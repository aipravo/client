'use client'
import { useCallback, useEffect, useState, type FC } from 'react';
import { IRequestMessageRes } from './interface';
import { getFirstMessageById, getRequests } from '@/api/api';
import Link from 'next/link';
import ToastError from '@/components/ToastError/ToastError';
import Loader from '@/components/Loader/Loader';
import { useApp } from '@/context/AppContext';

const Requests: FC = () => {

	const [loading, setLoading] = useState<boolean>(false)
	const [error, setError] = useState<string>('')
	const [requests, setRequests] = useState<IRequestMessageRes[]>([])
	const { menu, setMenu, subscription } = useApp()

	const fetchRequests = useCallback(async () => {

		setLoading(true)
		try {
			const response = await getRequests();

			const messages = await Promise.all(response.map(req => getFirstMessageById(req.id)));

			setRequests(() => {

				const updatedRequests = response.map((req, index) => {

					return {
						id: req.id,
						attempts: req.attempts,
						createdAt: req.createdAt,
						userId: req.userId,
						message: messages[index],
					}
				});
				return [...updatedRequests];
			});


		} catch (e) {
			if (e instanceof Error) {
				setError(e.message)
			} else {
				setError("Ошибка fetchRequests")
			}
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		if (menu) {
			setMenu(!menu)
		}

		fetchRequests()

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fetchRequests])

	if (loading) return <Loader />

	return (
		<div className=" requests_wrap p-3">
			<div className="table-responsive h-100">
				<table className="table table-striped position-relative">
					<thead className='requests'>
						<tr>
							<th scope="col" style={{ width: '5%' }}>Дата</th>
							<th scope="col">Название</th>
							{!subscription.is_active &&
								(
									<th scope="col" style={{ width: '5%' }} className=' text-center'>Попытки</th>
								)
							}
							<th
								scope="col"
								style={{ width: '10%' }}
								className=' text-center'>Действия</th>
						</tr>
					</thead>
					<tbody className=' overflow-y-auto'>
						{[...requests]
							.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) // Сортировка по убыванию
							.map((req, idx) => (
								<tr key={`${req.id}-${idx}`}>
									<th scope="row">{new Date(req.createdAt).toLocaleDateString()}</th>
									<td className=' text-nowrap'>{req.message?.slice(0, 150)} ...</td>
									{!subscription.is_active &&
										(
											<td className="text-center">{req.attempts}</td>
										)
									}
									<td className="text-center">
										<Link
											href={`/dashboard/request/${req.id}`}
											className="request_detail"
										>
											Детали
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

export default Requests;
