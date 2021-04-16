using DataAccess.Data;
using System;
using System.Collections.Generic;
using System.Linq;

namespace WebService.Models
{
    public class AdministratorFlightDTO
    {
        public int Id { get; set; }
        public int OriginAirportId { get; set; }
        public int DestinationAirportId { get; set; }
        public DateTime DepartureDateTime { get; set; }
        public DateTime ArrivalDateTime { get; set; }
        public int AircraftId { get; set; }
        public int CarrierId { get; set; }
        public int CurrencyId { get; set; }
        public List<FlightPriceDTO> Prices { get; set; }

        public AdministratorFlightDTO()
        {

        }

        public AdministratorFlightDTO(Flight flight, int currencyId, double exchangeRate)
        {
            Id = flight.Id;
            OriginAirportId = flight.OriginAirportId;
            DestinationAirportId = flight.DestinationAirportId;
            DepartureDateTime = flight.DepartureDateTime;
            ArrivalDateTime = flight.ArrivalDateTime;
            AircraftId = flight.AircraftId;
            CarrierId = flight.CarrierId;
            CurrencyId = currencyId;
            Prices = flight.Prices
                .Select(p => new FlightPriceDTO()
                {
                    Price = p.Price * exchangeRate,
                    TravelClass = p.TravelClass,
                    TravelerType = p.TravelerType
                })
                .ToList();
        }
    }
}
