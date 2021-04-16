using Newtonsoft.Json;
using System.Collections.Generic;

namespace WebService.Amadeus
{
    public class SearchFlightsResponse
    {
        [JsonProperty("warnings")]
        public string Warnings { get; set; }

        [JsonProperty("meta")]
        public object Meta { get; set; }

        [JsonProperty("data")]
        public List<FlightOffer> Data { get; set; }

        [JsonProperty("dictionaries")]
        public AmadeusDictionaries Dictionaries { get; set; }
    }
}
