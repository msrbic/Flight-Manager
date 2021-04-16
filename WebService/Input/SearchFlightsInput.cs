using DataAccess.Enums;
using System;
using System.Collections.Generic;

namespace WebService.Input
{
    public class SearchFlightsInput
    {
        public string OriginIATACode { get; set; }
        public string DestinationIATACode { get; set; }
        public DateTime DepartureDate { get; set; }
        public DateTime? ReturnDate { get; set; }
        public int Adults { get; set; }
        public int? Children { get; set; }
        public int? Infants { get; set; }
        public TravelClass? TravelClass { get; set; }
        public bool DirectFlightsOnly { get; set; }
        public string CurrencyCode { get; set; }
        public bool ShouldIncludeAmadeusFlights { get; set; }

        public Dictionary<string, string> GetParameterKeyValuePairs()
        {
            var result = new Dictionary<string, string>();

            result["originLocationCode"] = OriginIATACode;
            result["destinationLocationCode"] = DestinationIATACode;
            result["departureDate"] = DepartureDate.ToString("yyyy-MM-dd");
            result["adults"] = Adults.ToString();
            if(ReturnDate.HasValue) result["returnDate"] = ReturnDate.Value.ToString("yyyy-MM-dd");
            if (Children.HasValue) result["children"] = Children.ToString();
            if (Infants.HasValue) result["infants"] = Infants.ToString();
            if (TravelClass.HasValue) result["travelClass"] = TravelClass.ToString();
            if (DirectFlightsOnly) result["nonStop"] = DirectFlightsOnly.ToString().ToLower();
            if (CurrencyCode != null) result["currencyCode"] = CurrencyCode;

            return result;
        }
    }
}
