using System.ComponentModel.DataAnnotations;

namespace DataAccess.Data
{
    public class Airport
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string DetailedName { get; set; }

        [Required]
        public string IataCode { get; set; }

        [Required]
        public int CityId { get; set; }
        public City City { get; set; }
    }
}
