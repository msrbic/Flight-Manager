using DataAccess.Data;
using DataAccess.Enums;
using WebService.Amadeus;

namespace WebService.Models
{
    public class LocationDTO
    {
        public string IataCode { get; set; }
        public LocationType Type { get; set; }
        public string Name { get; set; }
        public string DetailedName { get; set; }
        public string CityName { get; set; }
        public string CountryName { get; set; }

        public override bool Equals(object obj)
        {
            var compare = obj as LocationDTO;
            if (compare == null)
            {
                return false;
            }

            return compare.IataCode == IataCode && compare.Type == Type && compare.Name == Name
                && compare.DetailedName == DetailedName && compare.CityName == CityName
                && compare.CountryName == CountryName;
        }

        public override int GetHashCode()
        {
            return IataCode.GetHashCode()
                ^ Type.GetHashCode()
                ^ Name.GetHashCode()
                ^ DetailedName.GetHashCode()
                ^ CityName.GetHashCode()
                ^ CountryName.GetHashCode();
        }

        public LocationDTO(Airport airport)
        {
            IataCode = airport.IataCode;
            Type = LocationType.Airport;
            Name = airport.Name;
            DetailedName = airport.DetailedName;
            CityName = airport.City?.Name ?? "Unknown";
            CountryName = airport.City?.Country?.Name ?? "Unknown";
        }

        public LocationDTO(City city)
        {
            IataCode = city.IataCode;
            Type = LocationType.City;
            Name = city.Name;
            DetailedName = city.DetailedName;
            CityName = city.Name;
            CountryName = city.Country?.Name;
        }

        public LocationDTO(AmadeusLocation location)
        {
            IataCode = location.IataCode;
            Type = location.LocationType;
            Name = location.Name;
            DetailedName = location.DetailedName;
            CityName = location.Address?.CityName ?? "Unknown";
            CountryName = location.Address?.CountryName ?? "Unknown";
        }
    }
}
