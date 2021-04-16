using DataAccess.Enums;
using Newtonsoft.Json;

namespace WebService.Amadeus
{
    public class AmadeusTravelerPricing
    {
        [JsonProperty("travelerType")]
        public TravelerType TravelerType { get; set; }

        [JsonProperty("price")]
        public AmadeusPrice Price { get; set; }
    }
}
