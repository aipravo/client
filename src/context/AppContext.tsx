"use client"
import { getBalance, getSubscription } from '@/api/api'
import { ISubscription } from '@/app/dashboard/interface'
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react"

// 1. Определяем тип данных для контекста
interface AppContextType {
	balance: number
	setBalance: (balance: number) => void
	attempts: number
	setAttempts: (attempts: number) => void
	threadId: string
	setThreadId: (threadId: string) => void
	menu: boolean
	setMenu: (menu: boolean) => void
	subscription: ISubscription
	setSubscription: (subscription: ISubscription) => void
}

// 2. Создаём контекст с `null` вместо функций (избегаем ложных вызовов)
const AppContext = createContext<AppContextType | null>(null)

// 3. Создаём провайдер
interface AppProviderProps {
	children: ReactNode
}

export const getExpirationDate = (subscription: ISubscription) => {
	if (!subscription.start_date || !subscription.period) return "Нет данных";

	const startDate = new Date(subscription.start_date);
	startDate.setDate(startDate.getDate() + subscription.period);

	return startDate.toLocaleDateString(); // Приведет к локальному формату (например, 02.02.2025)
};

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
	const [balance, setBalance] = useState(0)
	const [attempts, setAttempts] = useState(3)
	const [threadId, setThreadId] = useState("")
	const [menu, setMenu] = useState(false)
	const [subscription, setSubscription] = useState<ISubscription>({
		is_active: false,
		start_date: null,
		period: null,
		expiration: null
	})


	getExpirationDate(subscription)

	const fetchSubscription = useCallback(async () => {
		try {
			const response = await getSubscription(); // Если это объект
			setSubscription({
				is_active: response.is_active,
				start_date: response.start_date,
				period: response.period,
				expiration: getExpirationDate(response)
			});
		} catch (e) {
			console.error("Ошибка при получении Subscription:", e);
		}
	}, []);

	const fetchBalance = useCallback(async () => {
		try {
			const response = await getBalance();
			setBalance(response);
		} catch (e) {
			console.error("Ошибка при получении VIP статуса:", e);
		}
	}, []);

	useEffect(() => {
		fetchSubscription();
		fetchBalance()
	}, [fetchBalance, fetchSubscription])

	return (
		<AppContext.Provider
			value={{
				balance,
				setBalance,
				attempts,
				setAttempts,
				threadId,
				setThreadId,
				menu,
				setMenu,
				subscription,
				setSubscription
			}}
		>
			{children}
		</AppContext.Provider>
	)
}

// 4. Хук для использования контекста (с защитой от `null`)
export const useApp = (): AppContextType => {
	const context = useContext(AppContext)
	if (!context) {
		throw new Error("useApp должен быть использован внутри <AppProvider>")
	}
	return context
}
