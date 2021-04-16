using DataAccess.Enums;
using System.ComponentModel.DataAnnotations;

namespace DataAccess.Data
{
    public class FlightPrice
    {
        public int Id { get; set; }

        [Required]
        public int FlightId { get; set; }
        public Flight Flight { get; set; }

        [Required]
        public TravelClass TravelClass { get; set; }

        [Required]
        public TravelerType TravelerType { get; set; }

        [Required]
        public double Price { get; set; }
    }
}
