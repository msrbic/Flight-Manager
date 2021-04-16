export interface Currency {
    id?: number;
    isoCode: string;
    name: string;
    exchangeRate: string;
    isDefault: boolean;
}