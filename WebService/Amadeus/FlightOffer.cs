using Newtonsoft.Json;
using System.Collections.Generic;

namespace WebService.Amadeus
{
    public class FlightOffer
    {
        [JsonProperty("type")]
        public string Type { get; set; }

        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("source")]
        public string Source { get; set; }

        [JsonProperty("oneWay")]
        public bool IsOneWay { get; set; }

        [JsonProperty("itineraries")]
        public List<Itinerary> Itineraries { get; set; }

        [JsonProperty("price")]
        public AmadeusPrice Price { get; set; }

        [JsonProperty("travelerPricings")]
        public List<AmadeusTravelerPricing> TravelerPricing { get; set; }
    }
}
