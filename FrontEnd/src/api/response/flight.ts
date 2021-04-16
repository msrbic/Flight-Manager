export interface Flight {
    isAmadeusFlight: boolean;
    flightDuration: string;
    departureAirport: string;
    arrivalAirport: string;
    departureTime: string;
    arrivalTime: string;
    carrier: string;
    aircraft: string;
    prices: Price[];
    stops: Stop[];
    totalPrice: number;
    isFlightDirect: boolean;
    isReturnFlight: boolean;
}

export interface Price {
    travelClass: TravelClass;
    travelerType: TravelerType;
    price: number;
}

export interface Stop {
    airportName: string;
    arrivalAt: moment.Moment;
    departureAt: moment.Moment;
}

export type TravelClass = 'Economy' | 'PremiumEconomy' | 'Business' | 'First' 
export type TravelerType = 'Child' | 'HeldInfant' | 'SeatedInfant' | 'Senior' | 'Adult' | 'Young' | 'Student'