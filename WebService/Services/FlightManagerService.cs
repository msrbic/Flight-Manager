using DataAccess.Data;
using DataAccess.Database;
using DataAccess.Enums;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebService.Models;
using WebService.Input;

namespace WebService.Services
{
    public class FlightManagerService
    {
        private readonly FlightsManagerDb context;

        public FlightManagerService(FlightsManagerDb context)
        {
            this.context = context;
        }

        public async Task<List<FlightDTO>> SearchFlights(SearchFlightsInput input)
        {
            var result = await getFlights(input.DepartureDate, input.DirectFlightsOnly,
                input.DestinationIATACode, input.OriginIATACode, false);

            if (input.ReturnDate.HasValue)
            {
                result.AddRange(await getFlights(input.ReturnDate.Value, input.DirectFlightsOnly,
                input.OriginIATACode, input.DestinationIATACode, true));
            }

            foreach (var resultFlight in result)
            {
                var price = getTotalPrice(input.Adults, TravelerType.Adult, input.TravelClass, resultFlight);
                if (input.Children.HasValue)
                {
                    price += getTotalPrice(input.Children.Value, TravelerType.Child, input.TravelClass, resultFlight);
                }
                if (input.Infants.HasValue)
                {
                    price += getTotalPrice(input.Infants.Value, TravelerType.SeatedInfant, input.TravelClass, resultFlight);
                }

                resultFlight.TotalPrice = price;
            }

            return result;
        }

        private async Task<List<FlightDTO>> getFlights(DateTime departureDate, bool directFlightsOnly,
            string destinationIataCode, string originIataCode, bool isReturnFlight)
        {
            var flightsQuery = context.Flights
                .Include(f => f.OriginAirport)
                .Include(f => f.DestinationAirport)
                .Include(f => f.Carrier)
                .Include(f => f.Aircraft)
                .Include(f => f.Prices)
                .Where(f => f.DepartureDateTime >= departureDate
                    && f.DepartureDateTime <= departureDate.AddDays(7));

            if (directFlightsOnly)
            {
                flightsQuery = flightsQuery
                    .Where(f => f.DestinationAirport.IataCode == destinationIataCode
                        && f.OriginAirport.IataCode == originIataCode);
            }

            var flights = await flightsQuery.ToListAsync();
            var result = new List<FlightDTO>();

            foreach (var flight in flights.Where(f => f.OriginAirport.IataCode == originIataCode))
            {
                var temp = new List<Flight>
                {
                    flight
                };
                if (flight.DestinationAirport.IataCode == destinationIataCode)
                {
                    result.Add(CreateFlightDTO(temp, isReturnFlight));
                    continue;
                }

                foreach (var flight1 in
                    flights.Where(f => f.OriginAirport.IataCode == flight.DestinationAirport.IataCode
                        && f.DepartureDateTime >= flight.ArrivalDateTime.AddHours(1)))
                {
                    if (flight1.DestinationAirport.IataCode == destinationIataCode)
                    {
                        temp.Add(flight1);
                        result.Add(CreateFlightDTO(temp, isReturnFlight));
                        continue;
                    }

                    foreach (var flight2 in
                    flights.Where(f => f.OriginAirport.IataCode == flight1.DestinationAirport.IataCode
                        && f.DepartureDateTime >= flight1.ArrivalDateTime.AddHours(1)
                        && f.DestinationAirport.IataCode == destinationIataCode))
                    {
                        temp.Add(flight2);
                        result.Add(CreateFlightDTO(temp, isReturnFlight));
                    }
                }
            }

            return result;
        }

        private double getTotalPrice(int numberOfPassengers,
            TravelerType passengerType, TravelClass? travelClass,
            FlightDTO flight)
        {
            return numberOfPassengers * flight.Prices
                       .Where(p => !travelClass.HasValue || p.TravelClass == travelClass)
                       .Where(p => p.TravelerType == passengerType)
                       .Select(p => p.Price)
                       .FirstOrDefault();
        }

        private FlightDTO CreateFlightDTO(List<Flight> flights, bool isReturnFlight)
        {
            var result = new FlightDTO();

            flights = flights.OrderBy(f => f.DepartureDateTime).ToList();

            result.Aircraft = string.Join(",",
                flights.Select(f => f.Aircraft.Model).Distinct());
            result.ArrivalAirport = flights.Last().DestinationAirport.IataCode;
            result.ArrivalTime = flights.Last().ArrivalDateTime;
            result.Carrier = string.Join(",",
                flights.Select(f => f.Carrier.Name).Distinct());
            result.DepartureAirport = flights.First().OriginAirport.IataCode;
            result.DepartureTime = flights.First().DepartureDateTime;
            result.FlightDuration = (result.ArrivalTime - result.DepartureTime).ToString();
            result.IsAmadeusFlight = false;
            result.IsFlightDirect = flights.Count == 1;
            result.IsReturnFlight = isReturnFlight;
            result.Prices = flights
                .SelectMany(f => f.Prices)
                .GroupBy(fp => (fp.TravelClass, fp.TravelerType), fp => fp.Price)
                .Select(g => new FlightPriceDTO()
                {
                    TravelClass = g.Key.TravelClass,
                    TravelerType = g.Key.TravelerType,
                    Price = g.Sum()
                })
                .ToList(); ;
            result.Stops = createFlightStops(flights);

            return result;
        }

        private List<FlightStopDTO> createFlightStops(List<Flight> flights)
        {
            var result = new List<FlightStopDTO>();

            for (int i = 1; i < flights.Count - 1; i++)
            {
                var flightStop = new FlightStopDTO()
                {
                    AirportName = flights[i].OriginAirport.IataCode,
                    ArrivalAt = flights[i - 1].ArrivalDateTime,
                    DepartureAt = flights[i].DepartureDateTime
                };

                result.Add(flightStop);
            }

            return result;
        }

        public async Task<List<LocationDTO>> GetIataCodes(string keyword)
        {
            var airports = context.Airports
                .Where(a => a.Name.Contains(keyword) || a.IataCode.Contains(keyword)
                    || a.DetailedName.Contains(keyword))
                .Include(a => a.City)
                .ThenInclude(c => c.Country)
                .Select(a => new LocationDTO(a))
                .ToList();

            //var cities = context.Cities
            //    .Where(c => c.Name.Contains(keyword) || c.IataCode.Contains(keyword)
            //        || c.DetailedName.Contains(keyword))
            //    .Include(c => c.Country)
            //    .Select(c => new LocationDTO(c))
            //    .ToList();

            //return airports.Concat(cities).ToList();

            return airports;
        }
    }
}
