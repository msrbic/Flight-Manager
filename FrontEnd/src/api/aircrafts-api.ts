import {Aircraft} from "./response/aircraft";
import fetcher from "./fetch-api";

export function getAllAircrafts(): Promise<Aircraft[]> {
    return fetcher('/api/Administrator/aircrafts')
        .then(value => value.json());
}

export function getAircraft(id: number): Promise<Aircraft> {
    return fetcher(`/api/Administrator/aircrafts/${id}`)
        .then(value => value.json());
}

export function updateAircraft(aircraft: Aircraft): Promise<Response> {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aircraft)
    };

    return fetcher(`/api/Administrator/aircrafts/${aircraft.id}`, requestOptions);
}

export function createAircraft(aircraft: Aircraft): Promise<Aircraft> {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aircraft)
    };

    return fetcher(`/api/Administrator/aircrafts`, requestOptions)
        .then(value => value.json());
}


export function deleteAircraft(id: number): Promise<Response> {
    const requestOptions = {
        method: 'DELETE'
    };

    return fetcher(`/api/Administrator/aircrafts/${id}`, requestOptions);
}
