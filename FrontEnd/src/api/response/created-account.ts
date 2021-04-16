export interface CreatedAccount {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    created: number;
    updated: number;
    isVerified: boolean;
}