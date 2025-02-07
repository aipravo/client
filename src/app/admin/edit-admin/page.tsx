'use client'
import { useCallback, useEffect, useState, type FC } from 'react';
import { changeAdminPassword, createAdmin, getAdmins, removeUser } from '@/api/api';
import ToastError from '@/components/ToastError/ToastError';
import Loader from '@/components/Loader/Loader';
import InputForm from '@/components/InputForm/InputForm';
import BtnForm from '@/components/BtnForm/BtnForm';
import { IAdmin, IAdminForm } from './interface';
import { useAdmin } from '@/context/AdminContext';

const EditAdmins: FC = () => {
	const [loading, setLoading] = useState<boolean>(true)
	const [passwords, setPasswords] = useState<{ [key: string]: string }>({});
	const [createFormData, setCreateFormData] = useState<IAdminForm>({
		email: '',
		password: ''
	});
	const [spinner, setSpinner] = useState<boolean>(false)
	const [error, setError] = useState<string>('')
	const { menu, setMenu } = useAdmin()
	const [admins, setAdmins] = useState<IAdmin[]>([])

	const fetchAdmins = useCallback(async () => {
		setLoading(true);
		setError('')
		try {
			const response = await getAdmins()

			setAdmins(response)
		} catch (e) {
			setError(e instanceof Error ? e.message : "Ошибка fetchAdmins");
		} finally {
			setLoading(false);
		}
	}, [])

	useEffect(() => {
		if (menu) {
			setMenu(!menu)
		}
		fetchAdmins()

	}, [fetchAdmins])

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, email: string) => {
		e.preventDefault();
		setSpinner(true);
		setError('');

		try {
			const isConfirmed = window.confirm('Вы уверены, что хотите изменить пароль?');

			if (!isConfirmed) {
				setPasswords(prev => {
					const updated = { ...prev };
					delete updated[email]; // Удаляем введенный пароль
					return updated;
				});
				return;
			}

			await changeAdminPassword({
				email,
				password: passwords[email]
			});

			setPasswords(prev => {
				const updated = { ...prev };
				delete updated[email]; // Удаляем введенный пароль
				return updated;
			});

			alert('Пароль успешно изменен')
		} catch (e) {
			setError(e instanceof Error ? e.message : "Ошибка handleSubmit");
		} finally {
			setSpinner(false);
		}
	};

	const handleCteateAdmin = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setSpinner(true);
		setError('');

		try {

			const response = await createAdmin(createFormData);

			setCreateFormData({
				email: '',
				password: ''
			});

			setAdmins(prev => ([...prev, response]))
		} catch (e) {
			setError(e instanceof Error ? e.message : "Ошибка handleSubmit");
		} finally {
			setSpinner(false);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>, email: string) => {
		setPasswords((prev) => ({
			...prev,
			[email]: e.target.value
		}));
	};


	const handleChangeCreate = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCreateFormData((prev) => ({
			...prev,
			[e.target.name]: e.target.value // email также будет попадать сюда
		}));
	};

	const handleDelete = async (id: number) => {
		setSpinner(true)
		try {
			const isConfirmed = window.confirm('Вы уверены, что хотите удалить?');

			if (!isConfirmed) {
				return;
			}

			await removeUser(id)
			setAdmins(admins => admins.filter(admin => admin.id !== id));

		} catch (e) {
			setError(e instanceof Error ? e.message : "Ошибка handleDelete");
		} finally {
			setSpinner(false);
		}
	}

	if (loading) return <Loader />

	return (
		<div className=" requests_wrap p-3 overflow-y-auto">
			<h4 className=' mb-3 text-accent'>Добавить нового администратора</h4>
			<form onSubmit={handleCteateAdmin} className=' d-flex flex-column flex-md-row align-items-center gap-3 mb-4'>
				<InputForm
					type='email'
					name='email'
					onChange={handleChangeCreate}
					value={createFormData.email}
					placeholder='email нового админа'
					disabled={spinner}
				/>
				<InputForm
					type='password'
					name='password'
					onChange={handleChangeCreate}
					value={createFormData.password}
					placeholder=''
					anotherPlaceholder='Придумайте ему пароль'
					disabled={spinner}
				/>
				<BtnForm
					type='submit'
					disabled={spinner}
					clazz='filled'
				>
					<span className="material-symbols-outlined me-2">add</span>
					<span>Добавить админа</span>
				</BtnForm>
			</form>
			<h4 className=' mb-3 text-accent'>Список администраторов</h4>
			{admins.length ?
				(
					<div className="table-responsive">
						<table className="table table-striped position-relative">
							<thead className='requests'>
								<tr>
									<th scope="col" style={{ width: '33%' }} className=' px-3'>Email</th>
									<th scope="col" style={{ width: '33%' }} className=' px-3'>Пароль</th>
									<th scope="col" style={{ width: '34%' }} className=' text-end px-3'>Действия</th>
								</tr>
							</thead>
							<tbody className=' overflow-y-auto'>
								{[...admins]
									.sort((a, b) => a.email.localeCompare(b.email))
									.map((admin) => (
										<tr key={admin.email}>
											<th scope="row" className=' align-content-center px-3'>{admin.email}</th>
											<td className='  px-3'>
												<form
													onSubmit={(e) => handleSubmit(e, admin.email)}
													className=' d-flex align-items-center gap-3'
												>
													<InputForm
														type='password'
														name='password'
														onChange={(e) => handleChange(e, admin.email)}
														value={passwords[admin.email] || ''}
														placeholder=''
														anotherPlaceholder='Изменить пароль'
														disabled={spinner}
													/>
													{passwords[admin.email] &&
														<BtnForm
															type='submit'
															disabled={spinner}
															clazz='outlined'
															custom='save_btn'
														>
															<span className="material-symbols-outlined">save</span>
														</BtnForm>
													}
												</form>
											</td>
											<td className=" text-end align-content-center px-3">
												<span
													className="request_detail "
													onClick={() => handleDelete(admin.id)}
												>
													Удалить
												</span>
											</td>
										</tr>
									))}

							</tbody>
						</table>
					</div>
				) :
				(
					<h5>Администраторы отсутствуют</h5>
				)
			}

			{error && <ToastError error={true}>{error}</ToastError>}
		</div>
	);
}

export default EditAdmins;
