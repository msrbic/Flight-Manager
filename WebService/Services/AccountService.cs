using BC = BCrypt.Net.BCrypt;
using DataAccess.Data;
using DataAccess.Database;
using DataAccess.Enums;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using WebService.Helpers;
using WebService.Models;
using System.Collections.Generic;

namespace WebService.Services
{
    public class AccountService : IAccountService
    {
        private readonly FlightsManagerDb context;
        private readonly AppSettings appSettings;
        private readonly IEmailService emailService;

        public AccountService(FlightsManagerDb context,
            IOptions<AppSettings> appSettings,
            IEmailService emailService)
        {
            this.context = context;
            this.appSettings = appSettings.Value;
            this.emailService = emailService;
        }

        public AuthenticateResponse Authenticate(AuthenticateRequest model, string ipAddress)
        {
            var account = context.Accounts.SingleOrDefault(x => x.Email == model.Email);

            if (account == null || !account.IsVerified || !BC.Verify(model.Password, account.PasswordHash))
                throw new Exception("Email or password is incorrect");

            // authentication successful so generate jwt
            var jwtToken = generateJwtToken(account);

            // save changes to db
            context.Update(account);
            context.SaveChanges();

            var response = new AuthenticateResponse(account)
            {
                JwtToken = jwtToken,
            };
            return response;
        }

        public void Register(RegisterRequest model, string origin)
        {
            // validate
            var account = context.Accounts.Where(a => a.Email == model.Email).FirstOrDefault();
            if (account != null)
            {
                if (account.IsVerified)
                {
                    sendAlreadyRegisteredEmail(model.Email, origin);
                }
                else
                {
                    sendVerificationEmail(account, origin);
                }
                return;
            }

            // map model to new account object
            account = model.ToAccount();

            // first registered account is an admin
            account.Role = !context.Accounts.Any() ? Role.Admin : Role.User;
            account.VerificationToken = randomTokenString();

            // save account
            context.Accounts.Add(account);
            context.SaveChanges();

            // send email
            sendVerificationEmail(account, origin);
        }

        public void VerifyEmail(string token)
        {
            var account = context.Accounts.SingleOrDefault(x => x.VerificationToken == token);

            if (account == null) throw new Exception("Verification failed");

            account.Verified = DateTime.UtcNow;
            account.VerificationToken = null;

            context.Accounts.Update(account);
            context.SaveChanges();
        }

        public void ForgotPassword(ForgotPasswordRequest model, string origin)
        {
            var account = context.Accounts.SingleOrDefault(x => x.Email == model.Email);

            // always return ok response to prevent email enumeration
            if (account == null) return;

            // create reset token that expires after 1 day
            account.ResetToken = randomTokenString();
            account.ResetTokenExpires = DateTime.UtcNow.AddDays(1);

            context.Accounts.Update(account);
            context.SaveChanges();

            // send email
            sendPasswordResetEmail(account, origin);
        }

        public void ResetPassword(ResetPasswordRequest model)
        {
            var account = context.Accounts.SingleOrDefault(x =>
                x.ResetToken == model.Token &&
                x.ResetTokenExpires > DateTime.UtcNow);

            if (account == null)
                throw new Exception("Invalid token");

            // update password and remove reset token
            account.PasswordHash = BC.HashPassword(model.Password);
            account.PasswordReset = DateTime.UtcNow;
            account.ResetToken = null;
            account.ResetTokenExpires = null;

            context.Accounts.Update(account);
            context.SaveChanges();
        }

        public IEnumerable<AccountResponse> GetAll()
        {
            var accounts = context.Accounts;
            return accounts.Select(a => new AccountResponse(a)).ToList();
        }

        public AccountResponse GetById(int id)
        {
            var account = getAccount(id);
            return new AccountResponse(account);
        }

        public AccountResponse Create(CreateRequest model)
        {
            // validate
            if (context.Accounts.Any(x => x.Email == model.Email))
                throw new Exception($"Email '{model.Email}' is already registered");

            // map model to new account object
            var account = model.ToAccount();

            // save account
            context.Accounts.Add(account);
            context.SaveChanges();

            return new AccountResponse(account);
        }

        public AccountResponse Update(int id, UpdateRequest model)
        {
            var account = getAccount(id);

            // validate
            if (account.Email != model.Email && context.Accounts.Any(x => x.Email == model.Email))
                throw new Exception($"Email '{model.Email}' is already taken");

            // hash password if it was entered
            if (!string.IsNullOrEmpty(model.Password))
                account.PasswordHash = BC.HashPassword(model.Password);

            // copy model to account and save
            if (!string.IsNullOrEmpty(model.FirstName))
            {
                account.FirstName = model.FirstName;
            }
            if(!string.IsNullOrEmpty(model.LastName))
            {
                account.LastName = model.LastName;
            }
            if (!string.IsNullOrEmpty(model.Email))
            {
                account.Email = model.Email;
            }
            if (!string.IsNullOrEmpty(model.Role))
            {
                account.Role = Enum.Parse<Role>(model.Role);
            }
            account.Updated = DateTime.UtcNow;
            context.Accounts.Update(account);
            context.SaveChanges();

            return new AccountResponse(account);
        }

        public void Delete(int id)
        {
            var account = getAccount(id);
            context.Accounts.Remove(account);
            context.SaveChanges();
        }

        // helper methods

        private Account getAccount(int id)
        {
            var account = context.Accounts.Find(id);
            if (account == null) throw new KeyNotFoundException("Account not found");
            return account;
        }

        private string generateJwtToken(Account account)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(appSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] { new Claim("id", account.Id.ToString()) }),
                Expires = DateTime.UtcNow.AddMinutes(60),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private string randomTokenString()
        {
            using var rngCryptoServiceProvider = new RNGCryptoServiceProvider();
            var randomBytes = new byte[40];
            rngCryptoServiceProvider.GetBytes(randomBytes);
            // convert random bytes to hex string
            return BitConverter.ToString(randomBytes).Replace("-", "");
        }

        private void sendVerificationEmail(Account account, string origin)
        {
            string message;
            if (!string.IsNullOrEmpty(origin))
            {
                var verifyUrl = $"{origin}/Accounts/verify-email?token={account.VerificationToken}";
                message = $@"<p>Please click the below link to verify your email address:</p>
                             <p><a href=""{verifyUrl}"">verify email</a></p>";
            }
            else
            {
                message = $@"<p>Please use the below token to verify your email address with the <code>/accounts/verify-email</code> api route:</p>
                             <p><code>{account.VerificationToken}</code></p>";
            }

            emailService.Send(
                to: account.Email,
                subject: "Sign-up Verification API - Verify Email",
                html: $@"<h4>Verify Email</h4>
                         <p>Thanks for registering!</p>
                         {message}"
            );
        }

        private void sendAlreadyRegisteredEmail(string email, string origin)
        {
            string message;
            if (!string.IsNullOrEmpty(origin))
                message = $@"<p>If you don't know your password please visit the <a href=""{origin}/Accounts/forgot-password"">forgot password</a> page.</p>";
            else
                message = $@"<p>If you don't know your password you can reset it via the <code>/Accounts/forgot-password</code> api route.</p>";

            emailService.Send(
                to: email,
                subject: "Sign-up Verification API - Email Already Registered",
                html: $@"<h4>Email Already Registered</h4>
                         <p>Your email <strong>{email}</strong> is already registered.</p>
                         {message}"
            );
        }

        private void sendPasswordResetEmail(Account account, string origin)
        {
            string message;
            if (!string.IsNullOrEmpty(origin))
            {
                var resetUrl = $"{origin}/Accounts/reset-password?token={account.ResetToken}";
                message = $@"<p>Please click the below link to reset your password, the link will be valid for 1 day:</p>
                             <p><a href=""{resetUrl}"">reset password</a></p>";
            }
            else
            {
                message = $@"<p>Please use the below token to reset your password with the <code>/Accounts/reset-password</code> api route:</p>
                             <p><code>{account.ResetToken}</code></p>";
            }

            emailService.Send(
                to: account.Email,
                subject: "Sign-up Verification API - Reset Password",
                html: $@"<h4>Reset Password Email</h4>
                         {message}"
            );
        }

    }
}
