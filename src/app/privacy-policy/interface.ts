/** @format */

export interface ILogin {
    email: string;
    password: string;
}

export interface ILoginRes {
    token: string;
    role: "ADMIN" | "USER";
}
