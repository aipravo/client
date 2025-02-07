/** @format */

export interface IRequest {
    content: string | null;
}

export interface IAttempts {
    thread_id: string;
}

export interface IAttemptsRes {
    attempts: number;
}

export interface IRequestRes {
    id: number;
    attempts: number;
    createdAt: string;
    thread_id: string;
    userId: number;
}

export interface IRequestMessageRes {
    id: number;
    attempts: number;
    createdAt: string;
    userId: number;
    message: string | null;
}

export interface IMessage {
    thread_id: string;
    content: string;
    id: number;
    files?: File[];
}

export interface Message {
    role: string;
    content: string;
    files?: string[];
}
