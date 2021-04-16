using Newtonsoft.Json;
using System.Collections.Generic;

namespace WebService.Amadeus
{
    public class LocationResponse
    {
        [JsonProperty("meta")]
        public object Meta { get; set; }

        [JsonProperty("data")]
        public List<AmadeusLocation> Data { get; set; }
    }
}
