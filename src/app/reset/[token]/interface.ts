/** @format */

export interface INewPassword {
    password: string;
    confirmPassword: string;
    token: string;
    [key: string]: string;
}

export interface INewPasswordRes {
    message: string;
}
