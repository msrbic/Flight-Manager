function updateOptions(options?: any) {
    const update = { ...options };
    if (localStorage.jwt) {
        update.headers = {
            ...update.headers,
            Authorization: `Bearer ${localStorage.jwt}`,
        };
    }
    return update;
}

export default function fetcher(url: string, options?: any) {
    return fetch(url, updateOptions(options));
}