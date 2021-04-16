import {Airport} from "./response/airport";
import fetcher from "./fetch-api";

export function getAllAirports(): Promise<Airport[]> {
    return fetcher('/api/Administrator/airports')
        .then(value => value.json());
}

export function getAirport(id: number): Promise<Airport> {
    return fetcher(`/api/Administrator/airports/${id}`)
        .then(value => value.json());
}

export function updateAirport(airport: Airport): Promise<Response> {
    const requestOptions = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(airport)
    };

    return fetcher(`/api/Administrator/airports/${airport.id}`, requestOptions);
}

export function createAirport(airport: Airport): Promise<Airport> {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(airport)
    };

    return fetcher(`/api/Administrator/airports`, requestOptions)
        .then(value => value.json());
}


export function deleteAirport(id: number): Promise<Response> {
    const requestOptions = {
        method: 'DELETE'
    };

    return fetcher(`/api/Administrator/airports/${id}`, requestOptions);
}
