using System.ComponentModel.DataAnnotations;

namespace DataAccess.Data
{
    public class Currency
    {
        public int Id { get; set; }

        [Required]
        public string ISOCode { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public double ExchangeRate { get; set; }

        [Required]
        public bool IsDefault { get; set; }
    }
}
