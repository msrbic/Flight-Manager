using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace DataAccess.Data
{
    public class City
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string DetailedName { get; set; }

        [Required]
        public string IataCode { get; set; }

        [Required]
        public int CountryId { get; set; }
        public Country Country { get; set; }

        public List<Airport> Airports { get; set; }
    }
}
