using System.ComponentModel.DataAnnotations;

namespace DataAccess.Data
{
    public class CustomParameter
    {
        public int Id { get; set; }
        [Required]
        public string Key { get; set; }
        [Required]
        public string Value { get; set; }
    }
}
