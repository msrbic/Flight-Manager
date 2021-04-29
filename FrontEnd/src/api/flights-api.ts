import {FlightsSearchRequest} from "./request/flights-search-request";
import {Flight} from "./response/flight";
import {Location} from "./response/location";
import fetcher from "./fetch-api";
import {AdministratorFlight} from "./response/administrator-flight";
import { isNullOrUndefined } from "util";


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

export function getIataCodes(keyword: string, includeOnlyLocal?: boolean): Promise<Location[]> {
    var parameter = '';
    if (!isNullOrUndefined(includeOnlyLocal)) {
        parameter = `&includeOnlyLocal=${includeOnlyLocal}`;
    }
    return fetcher(`/api/SearchFlights/GetIataCodes?keyword=${keyword}${parameter}`)
        .then(response => response.json());
}

export function getAllFlights(currencyId: number | null | undefined): Promise<AdministratorFlight[]> {
    var parameter = '';
    if (!isNullOrUndefined(currencyId)) {
        parameter = `?currencyId=${currencyId}`;
    }
    return fetcher(`/api/Administrator/flights${parameter}`)
        .then(value => value.json());
}

export function getFlight(id: number, currencyId: number | null | undefined): Promise<AdministratorFlight> {
    var parameter = '';
    if (!isNullOrUndefined(currencyId)) {
        parameter = `?currencyId=${currencyId}`;
    }
    return fetcher(`/api/Administrator/flights/${id}${parameter}`)
        .then(value => value.json());
}

export function updateFlight(administratorFlight: AdministratorFlight): Promise<Response> {
    const requestOptions = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(administratorFlight)
    };

    return fetcher(`/api/Administrator/flights/${administratorFlight.id}`, requestOptions);
}

export function createFlight(administratorFlight: AdministratorFlight): Promise<AdministratorFlight> {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(administratorFlight)
    };

    return fetcher(`/api/Administrator/flights`, requestOptions)
        .then(value => value.json());
}


export function deleteFlight(id: number): Promise<Response> {
    const requestOptions = {
        method: 'DELETE'
    };

    return fetcher(`/api/Administrator/administratorFlights/${id}`, requestOptions);
}
