using Newtonsoft.Json;

namespace WebService.Amadeus
{
    public class AmadeusAddress
    {
        [JsonProperty("cityName")]
        public string CityName { get; set; }

        [JsonProperty("countryName")]
        public string CountryName { get; set; }
    }
}
