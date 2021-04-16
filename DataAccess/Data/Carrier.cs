using System.ComponentModel.DataAnnotations;

namespace DataAccess.Data
{
    public class Carrier
    {
        public int Id { get; set; }
        [Required]
        public string Code { get; set; }
        [Required]
        public string Name { get; set; }
    }
}
