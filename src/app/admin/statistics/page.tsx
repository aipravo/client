'use client'
import { getUsersInfo, removeUser, setBalance } from '@/api/api';
import { useAdmin } from '@/context/AdminContext';
import { useCallback, useEffect, useState } from 'react';
import { ISetBalance, IUser } from './interface';
import Loader from '@/components/Loader/Loader';
import ToastError from '@/components/ToastError/ToastError';
import { getExpirationDate } from '@/context/AppContext';
import { IPayment } from '../payment/interface';
import Link from 'next/link';

const Statistics = () => {

	const [users, setUsers] = useState<IUser[]>([])
	const [spinner, setSpinner] = useState<boolean>(false)
	const [saveState, setSaveState] = useState<Record<number, boolean>>({});
	const [loading, setLoading] = useState<boolean>(true)
	const [balances, setBalances] = useState<Record<number, number>>({});
	const [error, setError] = useState<string>('')
	const { menu, setMenu } = useAdmin()

	const fetchUsersInfo = useCallback(async () => {
		setLoading(true)
		try {
			const fetchedUsers = await getUsersInfo();
			setUsers(fetchedUsers);

			const initialBalances = fetchedUsers.reduce((acc, user) => {
				acc[user.id] = user.balance?.value ?? 0;
				return acc;
			}, {} as Record<number, number>);

			setBalances(initialBalances);

		} catch (e) {
			setError(e instanceof Error ? e.message : "Ошибка fetchRequests");
		} finally {
			setLoading(false);
		}
	}, [])

	const getSumPayments = (payments: IPayment[]): number => {
		return (payments.reduce((sum, payment) => sum + payment.value, 0));
	}

	useEffect(() => {
		if (menu) {
			setMenu(!menu)
		}
		fetchUsersInfo()
	}, [fetchUsersInfo])

	const handleSaveBalance = async (userId: number) => {
		setSpinner(true)
		try {

			const updatedBalance: ISetBalance = {
				userId,
				value: balances[userId]
			}

			await setBalance(updatedBalance)
			setSaveState((prev) => ({ ...prev, [userId]: false }));

		} catch (e) {
			setError(e instanceof Error ? e.message : "Ошибка fetchRequests");
		} finally {
			setSpinner(false);
		}


	}

	const handleDelete = async (userId: number) => {
		setSpinner(true)
		try {
			const isConfirmed = window.confirm('Вы уверены, что хотите удалить?');

			if (!isConfirmed) {
				return;
			}

			await removeUser(userId)
			setUsers(users => users.filter(user => user.id !== userId));

		} catch (e) {
			setError(e instanceof Error ? e.message : "Ошибка handleDelete");
		} finally {
			setSpinner(false);
		}


	}

	if (loading) return <Loader />

	return (
		<div className=" requests_wrap p-3 overflow-y-auto">
			<div className="table-responsive">
				<table className="table table-striped position-relative">
					<thead className='requests'>
						<tr>
							<th scope="col" style={{ width: '25%' }} className='px-3'>Email</th>
							<th scope="col" style={{ width: '15%' }} className='px-3'>Баланс</th>
							<th scope="col" style={{ width: '15%' }} className='px-3'>Подписка</th>
							<th scope="col" style={{ width: '15%' }} className='px-3'>Платежи</th>
							<th scope="col" style={{ width: '15%' }} className='px-3'>Запросы</th>
							<th scope="col" style={{ width: '15%' }} className='px-3'>Действия</th>
						</tr>
					</thead>
					<tbody className=' overflow-y-auto'>
						{[...users]
							.sort((a, b) => a.id - b.id) // Сортировка по убыванию
							.map((req, idx) => (
								<tr key={`${req.id}-${idx}`}>
									<td className=' text-nowrap px-3'>{req.email}</td>
									<td className='text-nowrap px-3 '>
										<div className='d-flex gap-3 align-items-center'>
											{req.subscription.is_active ?
												(
													<span>Активна подписка</span>
												) :
												(
													<>
														<div className='d-flex gap-2 align-items-center'>
															<button
																className='btn_set_balance d-flex justify-content-center align-items-center rounded-circle'
																onClick={() => {
																	setBalances((prev) => ({
																		...prev,
																		[req.id]: Math.max(prev[req.id] - 1, 0)
																	}))
																	setSaveState((prev) => ({ ...prev, [req.id]: true }));
																}}
																disabled={spinner}
															>
																<span className="material-symbols-outlined">remove</span>
															</button>

															<span style={{ width: 28, textAlign: 'center' }}>{balances[req.id] ?? '0'}</span>

															<button
																className='btn_set_balance d-flex justify-content-center align-items-center rounded-circle'
																onClick={() => {
																	setBalances((prev) => ({
																		...prev,
																		[req.id]: prev[req.id] + 1
																	}))
																	setSaveState((prev) => ({ ...prev, [req.id]: true }));
																}}
																disabled={spinner}
															>
																<span className="material-symbols-outlined">add</span>
															</button>
														</div>
														{saveState[req.id] &&
															(
																<button
																	className='btn_set_balance save d-flex justify-content-center align-items-center rounded'
																	onClick={() => handleSaveBalance(req.id)}
																	disabled={spinner}
																>
																	<span className="material-symbols-outlined">save</span>
																</button>
															)
														}
													</>
												)
											}
										</div>
									</td>

									<td className=' text-nowrap px-3'>
										{req.subscription.is_active ?
											(`до ${getExpirationDate(req.subscription)}`) :
											('Отсутствует')
										}
									</td>
									<td className=' text-nowrap px-3'>
										{getSumPayments(req.payments) > 0 ? (
											<>
												{getSumPayments(req.payments).toLocaleString('ru-RU')} <span className="text-accent">₸</span>
											</>
										) : (
											getSumPayments(req.payments)
										)}
									</td>
									<td className='px-3'>

										<Link
											href={`/admin/statistics/${req.id}`}
											className="request_detail"
											aria-disabled={spinner}
										>
											Посмотреть
										</Link>
									</td>

									<td className='px-3'>
										<Link
											href=''
											className="request_detail"
											aria-disabled={spinner}
											onClick={() => handleDelete(req.id)}
										>
											Удалить
										</Link>
									</td>
								</tr>
							))}
					</tbody>
				</table>
			</div>
			{error && <ToastError error={true}>{error}</ToastError>}
		</div>
	);
}

export default Statistics;
