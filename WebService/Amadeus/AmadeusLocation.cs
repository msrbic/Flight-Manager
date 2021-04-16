using DataAccess.Enums;
using Newtonsoft.Json;

namespace WebService.Amadeus
{
    public class AmadeusLocation
    {
        [JsonProperty("subType")]
        public LocationType LocationType { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("detailedName")]
        public string DetailedName { get; set; }

        [JsonProperty("iataCode")]
        public string IataCode { get; set; }

        [JsonProperty("address")]
        public AmadeusAddress Address { get; set; }
    }
}
