"use client"
import { useState, FC } from 'react'
import LinkBtn from '../LinkBtn/LinkBtn'
import { createVipRequest } from '@/api/api'
import ToastError from '../ToastError/ToastError'
import { usePathname, useRouter } from 'next/navigation'
import TitleH1 from '../TitleH1/TitleH1'
import { useAdmin } from '@/context/AdminContext'
import BurgerAdmin from '../BurgerAdmin/BurgerAdmin'
import Logo from '../Logo/Logo'


const AsideAdmin: FC = () => {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')
	const location = usePathname()
	const router = useRouter()
	const { setThreadId, menu, setMenu } = useAdmin()

	const handleCreateVipRequest = async () => {

		setLoading(true)
		try {
			const response = await createVipRequest()
			setThreadId(response.thread_id)

			const requestPath = `/admin/request/${response.id}`
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

	const handleCreateTrainRequest = async () => {

		setLoading(true)
		try {
			const response = await createVipRequest()
			setThreadId(response.thread_id)

			const requestPath = `/admin/training/${response.id}`
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
			<BurgerAdmin
				onClick={() => setMenu(!menu)}
			/>
			<Logo
				width={48}
				height={47}
				alt='AI'
			/>
			<div className={`d-flex flex-column gap-2 w-100 menu ${menu ? 'open' : ''}`}>
				<LinkBtn
					href='#'
					clazz={location.startsWith('/admin/training/') ? 'filled' : 'outlined'}
					disabled={loading}
					onClick={handleCreateTrainRequest}
				>
					Обучение
				</LinkBtn>
				<LinkBtn
					href='#'
					clazz={location.startsWith('/admin/request/') ? 'filled' : 'outlined'}
					disabled={loading}
					onClick={handleCreateVipRequest}
				>
					Новый запрос
				</LinkBtn>
				<LinkBtn
					href='/admin/request'
					clazz={location === '/admin/request' ? 'filled' : 'outlined'}
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
					href='/admin/statistics'
					clazz={location.startsWith('/admin/statistics') ? 'filled' : 'outlined'}
					disabled={loading}
					onClick={() => {
						setTimeout(() => {
							if (menu) {
								setMenu(false);
							}
						}, 1000);
					}}
				>
					Статистика
				</LinkBtn>
				<LinkBtn
					href='/admin/payment'
					clazz={location === '/admin/payment' ? 'filled' : 'outlined'}
					disabled={loading}
					onClick={() => {
						setTimeout(() => {
							if (menu) {
								setMenu(false);
							}
						}, 1000);
					}}
				>
					Тарифы
				</LinkBtn>
				<LinkBtn
					href='/admin/edit-admin'
					clazz={location === '/admin/edit-admin' ? 'filled' : 'outlined'}
					disabled={loading}
					onClick={() => {
						setTimeout(() => {
							if (menu) {
								setMenu(false);
							}
						}, 1000);
					}}
				>
					Администраторы
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

export default AsideAdmin
