using Newtonsoft.Json;

namespace WebService.Amadeus
{
    public class Segment
    {
        [JsonProperty("carrierCode")]
        public string CarrierCode { get; set; }

        [JsonProperty("aircraft")]
        public AircraftEquipment Aircraft { get; set; }

        [JsonProperty("departure")]
        public FlightEndPoint Departure { get; set; }

        [JsonProperty("arrival")]
        public FlightEndPoint Arrival { get; set; }
    }
}
