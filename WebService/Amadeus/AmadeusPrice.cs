using Newtonsoft.Json;

namespace WebService.Amadeus
{
    public class AmadeusPrice
    {
        [JsonProperty("total")]
        public double TotalPrice { get; set; }

        [JsonProperty("currency")]
        public string CurrencyCode { get; set; }
    }
}
