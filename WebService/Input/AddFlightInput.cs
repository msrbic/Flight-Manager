using DataAccess.Enums;
using System;
using System.Collections.Generic;

namespace WebService.Input
{
    public class AddFlightInput
    {
        public int OriginAirportId { get; set; }
        public int DestinationAirportId { get; set; }
        public DateTime DepartureDateTime { get; set; }
        public DateTime ArrivalDateTime { get; set; }
        public int AircraftId { get; set; }
        public int CarrierId { get; set; }
        public Dictionary<(TravelClass travelClass, TravelerType travelerType), double> Prices { get; set; }
        public int CurrencyId { get; set; }
    }
}
