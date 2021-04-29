export interface Location {
    id: number | null;
    iataCode: string;
    locationType: string; // enum
    name: string;
    detailedName: string;
    cityName: string;
    countryName: string;
}