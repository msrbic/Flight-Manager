export interface CreateAccountRequest {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    password: string;
    confirmPassword: string;
}