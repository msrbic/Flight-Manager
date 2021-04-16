using System.ComponentModel.DataAnnotations;

namespace DataAccess.Data
{
    public class Aircraft
    {
        public int Id { get; set; }
        [Required]
        public string Code { get; set; }
        [Required]
        public string Model { get; set; }
    }
}
