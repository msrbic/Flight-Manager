using System.ComponentModel.DataAnnotations;

namespace WebService.Models
{
    public class VerifyEmailRequest
    {
        [Required]
        public string Token { get; set; }
    }
}
