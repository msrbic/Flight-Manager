import {FlightsSearchRequest} from "./request/flights-search-request";
import {Flight} from "./response/flight";
import {Location} from "./response/location";
import fetcher from "./fetch-api";


export function searchFlights(request: FlightsSearchRequest, returnFlight?: boolean): Promise<Flight[]> {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            ...request,
            departureDate: request.departureDate?.format("YYYY-MM-DD"),
            returnDate: returnFlight ? request.returnDate?.format("YYYY-MM-DD") : undefined,
        })
    };

    return fetcher('/api/searchFlights', requestOptions)
        .then(response => response.json());
}

export function getIataCodes(keyword: string): Promise<Location[]> {
    return fetcher(`/api/SearchFlights/GetIataCodes?keyword=${keyword}`)
        .then(response => response.json());
}