using Newtonsoft.Json;
using System.Collections.Generic;

namespace WebService.Amadeus
{
    public class Itinerary
    {
        [JsonProperty("duration")]
        public string Duration { get; set; }

        [JsonProperty("segments")]
        public List<Segment> Segments { get; set; }
    }
}
