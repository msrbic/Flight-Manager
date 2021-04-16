using BC = BCrypt.Net.BCrypt;
using DataAccess.Data;
using DataAccess.Enums;
using System.ComponentModel.DataAnnotations;
using System;

namespace WebService.Models
{
    public class CreateRequest
    {
        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }

        [Required]
        [EnumDataType(typeof(Role))]
        public string Role { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [MinLength(6)]
        public string Password { get; set; }

        [Required]
        [Compare("Password")]
        public string ConfirmPassword { get; set; }

        public Account ToAccount()
        {
            return new Account()
            {
                FirstName = this.FirstName,
                LastName = this.LastName,
                Email = this.Email,
                PasswordHash = BC.HashPassword(this.Password),
                Role = Enum.Parse<Role>(this.Role),
                Created = DateTime.UtcNow,
                Verified = DateTime.UtcNow
            };
        }
    }
}
