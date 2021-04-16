using Microsoft.AspNetCore.WebUtilities;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using WebService.Models;
using WebService.Input;
using WebService.Amadeus;
using DataAccess.Database;
using DataAccess.Data;

namespace WebService.Services
{
    public class AmadeusService
    {
        private HttpClient client { get; }
        private string bearerToken { get; set; }
        private readonly CustomParameter clientId;
        private readonly CustomParameter clientSecret;

        public AmadeusService(HttpClient client, FlightsManagerDb context)
        {
            clientId = context.CustomParameters.Where(p => p.Key == "client_id").FirstOrDefault();
            clientSecret = context.CustomParameters.Where(p => p.Key == "client_secret").FirstOrDefault();
            client.BaseAddress = new Uri("https://test.api.amadeus.com");
            this.client = client;

            var authorizationResponse = Authorize();
            bearerToken = authorizationResponse.Result.access_token;

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", bearerToken);
        }

        private async Task<AuthorizationResponse> Authorize()
        {
            var content = new StringContent($"grant_type=client_credentials&{clientId.Key}={clientId.Value}&{clientSecret.Key}={clientSecret.Value}",
                Encoding.UTF8,
                "application/x-www-form-urlencoded");

            var response = await client.PostAsync("/v1/security/oauth2/token", content);

            var responseStream = await response.EnsureSuccessStatusCode().Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<AuthorizationResponse>(responseStream);
        }

        public async Task<List<FlightDTO>> SearchFlights(SearchFlightsInput input)
        {
            var query = input.GetParameterKeyValuePairs();
            var response = await client.GetAsync(QueryHelpers.AddQueryString("/v2/shopping/flight-offers", query));
            var responseStream = await response.Content.ReadAsStringAsync();

            var searchFlightResponse = JsonConvert.DeserializeObject<SearchFlightsResponse>(responseStream);

            return searchFlightResponse.Data.SelectMany(d => createFlightDTO(d, searchFlightResponse.Dictionaries)).ToList();
        }

        private List<FlightDTO> createFlightDTO(FlightOffer flightOffer, AmadeusDictionaries dictionaries)
        {
            var results = new List<FlightDTO>();

            for (int i = 0; i < Math.Min(flightOffer.Itineraries.Count, 2); i++)
            {
                var flightDTO = new FlightDTO();
                var segments = flightOffer.Itineraries[i].Segments.OrderBy(s => s.Departure.Time).ToList();

                flightDTO.Aircraft = string.Join(",",
                    segments.Select(s => dictionaries.Aircrafts[s.Aircraft.Code]).Distinct());
                flightDTO.ArrivalAirport = segments.Last().Arrival.IataCode;
                flightDTO.ArrivalTime = segments.Last().Arrival.Time;
                flightDTO.Carrier = string.Join(",",
                    segments.Select(s => dictionaries.Carriers[s.CarrierCode]).Distinct());
                flightDTO.DepartureAirport = segments.First().Departure.IataCode;
                flightDTO.DepartureTime = segments.First().Departure.Time;
                flightDTO.FlightDuration = (flightDTO.ArrivalTime - flightDTO.DepartureTime).ToString();
                flightDTO.IsAmadeusFlight = true;
                flightDTO.IsFlightDirect = segments.Count == 1;
                flightDTO.IsReturnFlight = i == 1;
                //add travel class
                flightDTO.Prices = flightOffer.TravelerPricing
                    .Select(p => new FlightPriceDTO() { TravelerType = p.TravelerType, Price = p.Price.TotalPrice })
                    .ToList();
                flightDTO.Stops = createFlightStops(segments);
                flightDTO.TotalPrice = flightOffer.Price.TotalPrice;

                results.Add(flightDTO);
            }
            return results;
        }

        private List<FlightStopDTO> createFlightStops(List<Segment> flightSegments)
        {
            var result = new List<FlightStopDTO>();

            for (int i = 1; i < flightSegments.Count; i++)
            {
                var flightStop = new FlightStopDTO()
                {
                    AirportName = flightSegments[i].Departure.IataCode,
                    ArrivalAt = flightSegments[i - 1].Arrival.Time,
                    DepartureAt = flightSegments[i].Departure.Time
                };

                result.Add(flightStop);
            }

            return result;
        }

        public async Task<List<LocationDTO>> GetIataCodes(string keyword)
        {
            var query = new Dictionary<string, string>
            {
                //["subType"] = "CITY,AIRPORT",
                ["subType"] = "AIRPORT",
                ["keyword"] = keyword.ToUpper(),
                ["view"] = "LIGHT"
            };

            var response = await client.GetAsync(QueryHelpers.AddQueryString("/v1/reference-data/locations", query));
            var responseStream = await response.Content.ReadAsStringAsync();

            var temp = JsonConvert.DeserializeObject<LocationResponse>(responseStream);

            return temp.Data.Select(d => new LocationDTO(d)).ToList();
        }
    }
}
