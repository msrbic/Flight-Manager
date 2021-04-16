using System.ComponentModel.DataAnnotations;

namespace WebService.Models
{
    public class ForgotPasswordRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}
