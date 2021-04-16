import {City} from "./response/city";
import fetcher from "./fetch-api";

export function getAllCities(): Promise<City[]> {
    return fetcher('/api/Administrator/cities')
        .then(value => value.json());
}

export function getCity(id: number): Promise<City> {
    return fetcher(`/api/Administrator/cities/${id}`)
        .then(value => value.json());
}

export function updateCity(city: City): Promise<Response> {
    const requestOptions = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(city)
    };

    return fetcher(`/api/Administrator/cities/${city.id}`, requestOptions);
}

export function createCity(city: City): Promise<City> {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(city)
    };

    return fetcher(`/api/Administrator/cities`, requestOptions)
        .then(value => value.json());
}


export function deleteCity(id: number): Promise<Response> {
    const requestOptions = {
        method: 'DELETE'
    };

    return fetcher(`/api/Administrator/cities/${id}`, requestOptions);
}
