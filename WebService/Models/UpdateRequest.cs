using DataAccess.Data;
using DataAccess.Enums;
using System.ComponentModel.DataAnnotations;

namespace WebService.Models
{
    public class UpdateRequest
    {
        private string password;
        private string confirmPassword;
        private string role;
        private string email;

        public string FirstName { get; set; }
        public string LastName { get; set; }

        [EnumDataType(typeof(Role))]
        public string Role
        {
            get => role;
            set => role = replaceEmptyWithNull(value);
        }

        [EmailAddress]
        public string Email
        {
            get => email;
            set => email = replaceEmptyWithNull(value);
        }

        [MinLength(6)]
        public string Password
        {
            get => password;
            set => password = replaceEmptyWithNull(value);
        }

        [Compare("Password")]
        public string ConfirmPassword
        {
            get => confirmPassword;
            set => confirmPassword = replaceEmptyWithNull(value);
        }

        // helpers
        private string replaceEmptyWithNull(string value)
        {
            // replace empty string with null to make field optional
            return string.IsNullOrEmpty(value) ? null : value;
        }
    }
}
