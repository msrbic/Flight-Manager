using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace DataAccess.Data
{
    public class Flight
    {
        public int Id { get; set; }

        [Required]
        public int OriginAirportId { get; set; }
        public Airport OriginAirport { get; set; }

        [Required]
        public int DestinationAirportId { get; set; }
        public Airport DestinationAirport { get; set; }

        [Required]
        public DateTime DepartureDateTime { get; set; }

        [Required]
        public DateTime ArrivalDateTime { get; set; }

        [Required]
        public int AircraftId { get; set; }
        public Aircraft Aircraft { get; set; }

        [Required]
        public int CarrierId { get; set; }
        public Carrier Carrier { get; set; }

        public List<FlightPrice> Prices { get; set; }
    }
}
