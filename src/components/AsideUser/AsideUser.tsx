"use client"
import { useState, FC } from 'react'
import LinkBtn from '../LinkBtn/LinkBtn'
import { createRequest, createVipRequest, getBalance } from '@/api/api'
import ToastError from '../ToastError/ToastError'
import { usePathname, useRouter } from 'next/navigation'
import TitleH1 from '../TitleH1/TitleH1'
import Balance from '../Balance/Balance'
import { useApp } from '@/context/AppContext'
import Burger from '../Burger/Burger'


const AsideUser: FC = () => {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const location = usePathname()
	const router = useRouter()
	const { balance, setBalance, setThreadId, setAttempts, menu, setMenu, subscription } = useApp()

	const handleCreateVipRequest = async () => {

		setLoading(true)
		try {
			const response = await createVipRequest()
			setThreadId(response.thread_id)
			setAttempts(response.attempts)

			const requestPath = `/dashboard/request/${response.id}`
			router.push(requestPath)
		} catch (e) {
			if (e instanceof Error) {
				setError(e.message)
			} else {
				setError("Произошла неизвестная ошибка")
			}
		} finally {
			setLoading(false)
			setMenu(!menu)
		}
	}
	const handleCreateRequest = async () => {

		setLoading(true)
		try {
			const response = await createRequest()
			setThreadId(response.thread_id)
			setAttempts(response.attempts)

			const requestPath = `/dashboard/request/${response.id}`
			router.push(requestPath)
			setBalance(await getBalance())
		} catch (e) {
			if (e instanceof Error) {
				setError(e.message)
			} else {
				setError("Произошла неизвестная ошибка")
			}
		} finally {
			setLoading(false)
			setMenu(!menu)
		}
	}

	const handleLogout = () => {
		localStorage.removeItem('token')
		localStorage.removeItem('role')
	}

	return (
		<div className=' d-flex flex-md-column align-items-center justify-content-between position-relative menu_wrap'>
			<TitleH1
				span='Право'
				className=' d-none d-md-block'
			>
				Ai
			</TitleH1>
			<Burger
				onClick={() => setMenu(!menu)}
			/>
			<Balance />
			<div className={`d-flex flex-column gap-2 w-100 menu ${menu ? 'open' : ''}`}>
				{subscription.is_active ? (
					<LinkBtn
						href='#'
						clazz={location.startsWith('/dashboard/request/') ? 'filled' : 'outlined'}
						disabled={loading}
						onClick={handleCreateVipRequest}
					>
						Новый запрос
					</LinkBtn>
				) :
					balance > 0 && (
						<LinkBtn
							href='#'
							clazz={location.startsWith('/dashboard/request/') ? 'filled' : 'outlined'}
							disabled={loading}
							onClick={handleCreateRequest}
						>
							Новый запрос
						</LinkBtn>
					)}
				<LinkBtn
					href='/dashboard/payment'
					clazz={location === '/dashboard/payment' ? 'filled' : 'outlined'}
					disabled={loading}
					onClick={() => {
						setTimeout(() => {
							if (menu) {
								setMenu(false);
							}
						}, 1000);
					}}
				>
					Купить запросы
				</LinkBtn>
				<LinkBtn
					href='/dashboard/request'
					clazz={location === '/dashboard/request' ? 'filled' : 'outlined'}
					disabled={loading}
					onClick={() => {
						setTimeout(() => {
							if (menu) {
								setMenu(false);
							}
						}, 1000);
					}}
				>
					История запросов
				</LinkBtn>
				<LinkBtn
					href='/dashboard/change-password'
					clazz={location === '/dashboard/change-password' ? 'filled' : 'outlined'}
					disabled={loading}
					onClick={() => {
						setTimeout(() => {
							if (menu) {
								setMenu(false);
							}
						}, 1000);
					}}
				>
					Изменить пароль
				</LinkBtn>
				<LinkBtn
					href='/'
					clazz='outlined'
					disabled={loading}
					onClick={handleLogout}
				>
					Выйти
				</LinkBtn>
			</div>
			{error && <ToastError error={true}>{error}</ToastError>}
		</div>
	)
}

export default AsideUser
