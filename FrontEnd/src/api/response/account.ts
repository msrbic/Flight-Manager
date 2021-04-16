export interface Account {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    created: number;
    updated: number;
    isVerified: boolean;
    jwtToken: string;
}