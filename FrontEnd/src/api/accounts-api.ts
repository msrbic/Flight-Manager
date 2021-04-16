import {Account} from "./response/account";
import {AccountRequest} from "./request/account-request";
import fetcher from "./fetch-api";
import { CreatedAccount } from "./response/created-account";
import { CreateAccountRequest } from "./request/create-account";

export function login(email: string, password: string): Promise<Account> {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email, password})
    };

    return fetch('/Accounts/authenticate', requestOptions)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return Promise.reject(String(response.status))
            }
        });
}

export function register(accountRequest: AccountRequest): Promise<Response> {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(accountRequest)
    };

    return fetch('/Accounts/register', requestOptions);
}

export function verifyEmail(token: string): Promise<Response> {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ token })
    };

    return fetch('/Accounts/verify-email', requestOptions);
}

export function forgotPassword(email: string): Promise<Response> {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ email })
    };

    return fetch('/Accounts/forgot-password', requestOptions);
}

export function resetPassword(token: string, password: string, confirmPassword: string): Promise<Response> {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ token, password, confirmPassword })
    };

    return fetch('/Accounts/reset-password', requestOptions);
}

export function getAllAccounts(): Promise<Account[]> {
    return fetcher('/Accounts')
        .then(value => value.json());
}

export function getAccount(id: number): Promise<Account> {
    return fetcher(`/Accounts/${id}`)
        .then(value => value.json());
}

export function updateAccount(account: Account): Promise<Response> {
    const requestOptions = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(account)
    };

    return fetcher(`/Accounts/${account.id}`, requestOptions);
}

export function createAccount(account: CreateAccountRequest): Promise<CreatedAccount> {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(account)
    };

    return fetcher(`/Accounts`, requestOptions)
        .then(value => value.json());
}


export function deleteAccount(id: number): Promise<Response> {
    const requestOptions = {
        method: 'DELETE'
    };

    return fetcher(`/Accounts/${id}`, requestOptions);
}

