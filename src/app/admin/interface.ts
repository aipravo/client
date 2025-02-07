/** @format */

export interface ISubscription {
    is_active: boolean;
    start_date: string | null;
    period: number | null;
    expiration: string | null;
}
