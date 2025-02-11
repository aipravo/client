/** @format */

import { IAdmin, IAdminForm } from "@/app/admin/edit-admin/interface";
import { ISetBalance, IUser } from "@/app/admin/statistics/interface";
import {
    IChangePassword,
    IChangePasswordRes,
} from "@/app/dashboard/change-password/interface";
import { ISubscription } from "@/app/dashboard/interface";
import { ITariff } from "@/app/dashboard/payment/interface";
import {
    IMessage,
    IRequestRes,
    Message,
} from "@/app/dashboard/request/interface";
import { ILogin, ILoginRes } from "@/app/login/interface";
import { IRegistration, IRegistrationRes } from "@/app/registration/interface";
import { INewPassword, INewPasswordRes } from "@/app/reset/[token]/interface";
import { IReset, IResetRes } from "@/app/reset/interface";

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL; // Замените на ваш API URL"http://localhost:5000"

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE"; // Доступные методы

interface ApiOptions {
    method: HttpMethod;
    headers: Record<string, string>;
    body?: string | FormData;
}

const apiRequest = async <T>(
    endpoint: string,
    method: HttpMethod,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body?: Record<string, any> | FormData
): Promise<T> => {
    const token = localStorage.getItem("token");

    const options: ApiOptions = {
        method,
        headers: {},
    };

    if (token) {
        options.headers["Authorization"] = `Bearer ${token}`;
    }

    // Определяем, является ли тело FormData или JSON
    if (body instanceof FormData) {
        options.body = body; // Если FormData, просто добавляем в body
    } else if (body) {
        options.headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Ошибка запроса");
        }

        return response.json() as Promise<T>;
    } catch (error) {
        console.error("API Error:", (error as Error).message);
        throw error;
    }
};

export const login = (data: ILogin): Promise<ILoginRes> => {
    return apiRequest("/user/login", "POST", data);
};

export const registration = (
    data: IRegistration
): Promise<IRegistrationRes> => {
    return apiRequest("/user/registration", "POST", data);
};

export const createAdmin = (data: IAdminForm): Promise<IAdmin> => {
    return apiRequest("/user/create-admin", "POST", data);
};

export const reset = (data: IReset): Promise<IResetRes> => {
    return apiRequest("/user/reset", "POST", data);
};

export const setNewPassword = (
    data: INewPassword
): Promise<INewPasswordRes> => {
    return apiRequest("/user/set-new-pass", "POST", data);
};

export const removeUser = (id: number) => {
    return apiRequest(`/user/remove-user/${id}`, "DELETE");
};

export const createRequest = (): Promise<IRequestRes> => {
    return apiRequest("/request/create", "POST");
};

export const createVipRequest = (): Promise<IRequestRes> => {
    return apiRequest("/request/createvip", "POST");
};

export const createTrainRequest = () => {
    return apiRequest("/request/train", "POST");
};

export const changeAdminPassword = (data: IAdminForm) => {
    return apiRequest<IAdminForm>("/user/change-admin-pass", "POST", data);
};

export const getAdmins = (): Promise<IAdmin[]> => {
    return apiRequest<IAdmin[]>(`/user/get-admins`, "GET");
};

export const getRequestById = (id: number): Promise<IRequestRes> => {
    return apiRequest<IRequestRes>(`/request/get/${id}`, "GET");
};

export const getRequestByUserId = (userId: number): Promise<IRequestRes[]> => {
    return apiRequest<IRequestRes[]>(`/request/getby/${userId}`, "GET");
};

export const getRequests = (): Promise<IRequestRes[]> => {
    return apiRequest<IRequestRes[]>(`/request/get`, "GET");
};

export const getMessageById = (requestId: number): Promise<Message[]> => {
    return apiRequest(`/request/messages/${requestId}`, "GET");
};

export const getFirstMessageById = (requestId: number): Promise<string> => {
    return apiRequest(`/request/message/${requestId}`, "GET");
};

export const updateAttempts = (thread_id: string): Promise<number> => {
    return apiRequest("/request/update", "POST", { thread_id });
};

export const createMessage = (data: IMessage): Promise<string> => {
    const formData = new FormData();

    // Добавляем поля из IMessage
    formData.append("thread_id", data.thread_id);
    formData.append("content", data.content);
    formData.append("id", String(data.id));

    // Добавляем файлы, если они есть
    if (data.files) {
        data.files.forEach((file) => {
            formData.append("files", file);
        });
    }

    return apiRequest("/request/send", "POST", formData);
};

export const createAdminMessage = (data: IMessage): Promise<string> => {
    const formData = new FormData();

    // Добавляем поля из IMessage
    formData.append("thread_id", data.thread_id);
    formData.append("content", data.content);
    formData.append("id", String(data.id));

    // Добавляем файлы, если они есть
    if (data.files) {
        data.files.forEach((file) => {
            formData.append("files", file);
        });
    }

    return apiRequest("/request/learn", "POST", formData);
};

export const auth = () => {
    return apiRequest("/user/auth", "GET");
};

export const getBalance = (): Promise<number> => {
    return apiRequest("/balance/get", "GET");
};

export const setBalance = (data: ISetBalance) => {
    return apiRequest(`/balance/set`, "POST", data);
};

export const changePassword = (
    data: IChangePassword
): Promise<IChangePasswordRes> => {
    return apiRequest("/user/change-pass", "POST", data);
};

export const getSubscription = (): Promise<ISubscription> => {
    return apiRequest("/subscription/get", "GET");
};

export const getTariffs = (): Promise<ITariff[]> => {
    return apiRequest("/tariff/get", "GET");
};

export const createTariff = (
    formData: Omit<ITariff, "id">
): Promise<ITariff> => {
    return apiRequest("/tariff/create", "POST", formData);
};

export const deleteRequestById = (id: number) => {
    return apiRequest(`/request/delete/${id}`, "DELETE");
};

export const deleteRequestsByUserId = () => {
    return apiRequest(`/request/delete`, "DELETE");
};

export const deleteTariffById = (id: number) => {
    return apiRequest(`/tariff/delete/${id}`, "DELETE");
};

export const buyTariff = (formData: Omit<ITariff, "id">) => {
    return apiRequest(`/payment/create`, "POST", formData);
};

export const getUsersInfo = (): Promise<IUser[]> => {
    return apiRequest(`/user/get-all-info`, "GET");
};
