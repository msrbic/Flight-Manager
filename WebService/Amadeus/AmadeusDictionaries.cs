using Newtonsoft.Json;
using System.Collections.Generic;

namespace WebService.Amadeus
{
    public class AmadeusDictionaries
    {
        [JsonProperty("aircraft")]
        public Dictionary<string, string> Aircrafts { get; set; }

        [JsonProperty("carriers")]
        public Dictionary<string, string> Carriers { get; set; }
    }
}
