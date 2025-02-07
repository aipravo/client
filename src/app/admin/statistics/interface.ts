/** @format */

import { ISubscription } from "../interface";
import { IPayment } from "../payment/interface";
// import { IMessage } from "../request/interface";

// interface IRequestMessage {
//     id: number;
//     thread_id: string;
//     messages: IMessage[];
// }

interface IBalance {
    id: number;
    value: number;
}

export interface ISetBalance {
    userId: number;
    value: number;
}

export interface IUser {
    id: number;
    email: string;
    balance: IBalance;
    subscription: ISubscription;
    payments: IPayment[];
}
