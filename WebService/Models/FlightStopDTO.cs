using System;

namespace WebService.Models
{
    public class FlightStopDTO
    {
        public string AirportName { get; set; }
        public DateTime ArrivalAt { get; set; }
        public DateTime DepartureAt { get; set; }
    }
}
