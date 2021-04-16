using DataAccess.Enums;

namespace WebService.Models
{
    public class FlightPriceDTO
    {
        public TravelClass TravelClass { get; set; }

        public TravelerType TravelerType { get; set; }

        public double Price { get; set; }
    }
}
