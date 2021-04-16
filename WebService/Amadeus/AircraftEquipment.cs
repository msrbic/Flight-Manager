using Newtonsoft.Json;

namespace WebService.Amadeus
{
    public class AircraftEquipment
    {
        [JsonProperty("code")]
        public string Code { get; set; }
    }
}
