/** @format */

export interface IRegistration {
    email: string;
    password: string;
    confirmPassword: string;
    [key: string]: string;
}

export interface IRegistrationRes {
    message: string;
}
