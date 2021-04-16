import moment from "moment";

export interface FlightsSearchRequest {
    originIATACode?: string | null;
    destinationIATACode?: string | null;
    departureDate?: moment.Moment | null;
    returnDate?: moment.Moment | null;
    adults?: number;
    children?: number;
    infants?: number;
    travelClass?: number;
    directFlightsOnly?: boolean;
    currencyCode?: string;
    shouldIncludeAmadeusFlights?: boolean;
}