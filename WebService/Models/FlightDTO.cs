using System;
using System.Collections.Generic;

namespace WebService.Models
{
    public class FlightDTO
    {
        public bool IsAmadeusFlight { get; set; }
        public string FlightDuration { get; set; }
        public string DepartureAirport { get; set; }
        public string ArrivalAirport { get; set; }
        public DateTime DepartureTime { get; set; }
        public DateTime ArrivalTime { get; set; }
        public string Carrier { get; set; }
        public string Aircraft { get; set; }
        public List<FlightPriceDTO> Prices { get; set; }
        public double TotalPrice { get; set; }
        public bool IsFlightDirect { get; set; }
        public bool IsReturnFlight { get; set; }
        public List<FlightStopDTO> Stops { get; set; }
    }
}
