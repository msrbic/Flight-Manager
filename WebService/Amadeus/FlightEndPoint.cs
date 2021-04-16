using Newtonsoft.Json;
using System;

namespace WebService.Amadeus
{
    public class FlightEndPoint
    {
        [JsonProperty("iataCode")]
        public string IataCode { get; set; }

        [JsonProperty("terminal")]
        public string Terminal { get; set; }

        [JsonProperty("at")]
        public DateTime Time { get; set; }
    }
}
