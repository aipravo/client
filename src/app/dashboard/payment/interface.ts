/** @format */

export interface ITariff {
    id: number;
    type: "fixed" | "subscription" | "";
    cost: number | "";
    count_requests: number | "" | null;
    count_days: number | "" | null;
}
