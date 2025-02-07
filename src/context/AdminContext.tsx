"use client"
import React, { createContext, useContext, useState, ReactNode } from "react"

// 1. Определяем тип данных для контекста
interface AdminContextType {
	threadId: string
	setThreadId: (threadId: string) => void
	menu: boolean
	setMenu: (menu: boolean) => void
}

// 2. Создаём контекст с `null` вместо функций (избегаем ложных вызовов)
const AdminContext = createContext<AdminContextType | null>(null)

// 3. Создаём провайдер
interface AdminProviderProps {
	children: ReactNode
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
	const [threadId, setThreadId] = useState("")
	const [menu, setMenu] = useState(false)

	return (
		<AdminContext.Provider
			value={{
				threadId,
				setThreadId,
				menu,
				setMenu,
			}}
		>
			{children}
		</AdminContext.Provider>
	)
}

// 4. Хук для использования контекста (с защитой от `null`)
export const useAdmin = (): AdminContextType => {
	const context = useContext(AdminContext)
	if (!context) {
		throw new Error("useApp должен быть использован внутри <AppProvider>")
	}
	return context
}
