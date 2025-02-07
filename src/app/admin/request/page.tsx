'use client'
import { useCallback, useEffect, useState, type FC } from 'react';
import { IRequestMessageRes } from './interface';
import { deleteRequestById, deleteRequestsByUserId, getFirstMessageById, getRequests } from '@/api/api';
import Link from 'next/link';
import ToastError from '@/components/ToastError/ToastError';
import Loader from '@/components/Loader/Loader';
import { useAdmin } from '@/context/AdminContext';
import BtnForm from '@/components/BtnForm/BtnForm';

const Requests: FC = () => {

	const [spinner, setSpinner] = useState<boolean>(false)
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string>('')
	const { menu, setMenu } = useAdmin()
	const [requests, setRequests] = useState<IRequestMessageRes[]>([])

	const fetchRequests = useCallback(async () => {
		try {
			setLoading(true);

			const response = await getRequests();
			const messages = await Promise.all(response.map(req => getFirstMessageById(req.id)));

			setRequests(response.map((req, index) => ({
				id: req.id,
				attempts: req.attempts,
				createdAt: req.createdAt,
				userId: req.userId,
				message: messages[index],
			})));
		} catch (e) {
			setError(e instanceof Error ? e.message : "Ошибка fetchRequests");
		} finally {
			setLoading(false);
		}
	}, [setRequests, setError, setLoading]);

	useEffect(() => {
		if (menu) {
			setMenu(!menu)
		}
		fetchRequests()

	}, [fetchRequests])

	const handleDelete = async (id: number) => {
		setSpinner(true);
		try {
			await deleteRequestById(id);

			setRequests(prevRequests => prevRequests.filter(req => req.id !== id));
		} catch (e) {
			setError(e instanceof Error ? e.message : "Ошибка handleDelete");
		} finally {
			setSpinner(false);
		}
	};

	const handleDeleteAll = async () => {
		setSpinner(true);
		try {
			await deleteRequestsByUserId();

			setRequests([]);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Ошибка handleDelete");
		} finally {
			setSpinner(false);
		}
	};


	if (loading) return <Loader />

	return (
		<div className=" requests_wrap p-3 overflow-y-auto">
			<BtnForm
				type='button'
				clazz='filled'
				disabled={spinner}
				onClick={handleDeleteAll}
				custom='mb-3 mx-auto clear_req_btn'
			>
				Очистить историю
			</BtnForm>
			<div className="table-responsive">
				<table className="table table-striped position-relative">
					<thead className='requests'>
						<tr>
							<th scope="col" style={{ width: '5%' }}>Дата</th>
							<th scope="col">Название</th>
							<th scope="col" style={{ width: '10%' }} className=' text-center'>Действия</th>
						</tr>
					</thead>
					<tbody className=' overflow-y-auto'>
						{[...requests]
							.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) // Сортировка по убыванию
							.map((req, idx) => (
								<tr key={`${req.id}-${idx}`}>
									<th scope="row">{new Date(req.createdAt).toLocaleDateString()}</th>
									<td className=' text-nowrap'>{req.message?.slice(0, 150)} ...</td>
									<td className="text-center d-flex gap-3 justify-content-center">
										<Link
											href={`/admin/request/${req.id}`}
											className="request_detail"
											aria-disabled={spinner}
										>
											Детали
										</Link>
										<Link
											href=''
											className="request_detail"
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

export default Requests;
