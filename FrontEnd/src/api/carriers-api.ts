import {Carrier} from "./response/carrier";
import fetcher from "./fetch-api";

export function getAllCarriers(): Promise<Carrier[]> {
    return fetcher('/api/Administrator/carriers')
        .then(value => value.json());
}

export function getCarrier(id: number): Promise<Carrier> {
    return fetcher(`/api/Administrator/carriers/${id}`)
        .then(value => value.json());
}

export function updateCarrier(carrier: Carrier): Promise<Response> {
    const requestOptions = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(carrier)
    };

    return fetcher(`/api/Administrator/carriers/${carrier.id}`, requestOptions);
}

export function createCarrier(carrier: Carrier): Promise<Carrier> {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(carrier)
    };

    return fetcher(`/api/Administrator/carriers`, requestOptions)
        .then(value => value.json());
}


export function deleteCarrier(id: number): Promise<Response> {
    const requestOptions = {
        method: 'DELETE'
    };

    return fetcher(`/api/Administrator/carriers/${id}`, requestOptions);
}
