export interface AdministratorFlight {
    id: number,
    originAirportId: number;
    destinationAirportId: number;
    departureDateTime: string;
    arrivalDateTime: string;
    carrierId: number;
    aircraftId: number;
    currencyId: number;
    prices: Price[];
}

export interface Price {
    travelClass: number;
    travelerType: number;
    price: number;
}