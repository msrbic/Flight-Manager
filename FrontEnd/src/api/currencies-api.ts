import {Currency} from "./response/currency";
import fetcher from "./fetch-api";

export function getAllCurrencies(): Promise<Currency[]> {
    return fetcher('/api/Administrator/currencies')
        .then(value => value.json());
}

export function getCurrency(id: number): Promise<Currency> {
    return fetcher(`/api/Administrator/currencies/${id}`)
        .then(value => value.json());
}

export function updateCurrency(currency: Currency): Promise<Response> {
    const requestOptions = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(currency)
    };

    return fetcher(`/api/Administrator/currencies/${currency.id}`, requestOptions);
}

export function createCurrency(currency: Currency): Promise<Currency> {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(currency)
    };

    return fetcher(`/api/Administrator/currencies`, requestOptions)
        .then(value => value.json());
}


export function deleteCurrency(id: number): Promise<Response> {
    const requestOptions = {
        method: 'DELETE'
    };

    return fetcher(`/api/Administrator/currencies/${id}`, requestOptions);
}
