import {Country} from "./response/country";
import fetcher from "./fetch-api";

export function getAllCountries(): Promise<Country[]> {
    return fetcher('/api/Administrator/countries')
        .then(value => value.json());
}

export function getCountry(id: number): Promise<Country> {
    return fetcher(`/api/Administrator/countries/${id}`)
        .then(value => value.json());
}

export function updateCountry(country: Country): Promise<Response> {
    const requestOptions = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(country)
    };

    return fetcher(`/api/Administrator/countries/${country.id}`, requestOptions);
}

export function createCountry(country: Country): Promise<Country> {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(country)
    };

    return fetcher(`/api/Administrator/countries`, requestOptions)
        .then(value => value.json());
}


export function deleteCountry(id: number): Promise<Response> {
    const requestOptions = {
        method: 'DELETE'
    };

    return fetcher(`/api/Administrator/countries/${id}`, requestOptions);
}
