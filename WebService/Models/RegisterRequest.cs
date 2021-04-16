using BC = BCrypt.Net.BCrypt;
using DataAccess.Data;
using System;
using System.ComponentModel.DataAnnotations;

namespace WebService.Models
{
    public class RegisterRequest
    {
        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }

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
                Created = DateTime.UtcNow,
                PasswordHash = BC.HashPassword(this.Password)
            };
        }
    }
}
