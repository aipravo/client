'use client'
import { useEffect, useState, type FC } from 'react';
import { changePassword } from '@/api/api';
import ToastError from '@/components/ToastError/ToastError';
import Loader from '@/components/Loader/Loader';
import InputForm from '@/components/InputForm/InputForm';
import BtnForm from '@/components/BtnForm/BtnForm';
import SpinnerBtn from '@/components/SpinnerBtn/SpinnerBtn';
import { IChangePasswordRes } from './interface';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';

const ChangePassword: FC = () => {
	const [loading, setLoading] = useState<boolean>(true)
	const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
	const [spinner, setSpinner] = useState<boolean>(false)
	const [error, setError] = useState<string>('')
	const [success, setSuccess] = useState('');

	const { menu, setMenu } = useApp()
	const router = useRouter()

	useEffect(() => {
		if (menu) {
			setMenu(!menu)
		}
		setLoading(false)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setSpinner(true);
		setError('');

		try {
			const response: IChangePasswordRes = await changePassword(formData);
			setSuccess(response.message)
			setTimeout(() => {
				router.push('/login')
			}, 1000);
		} catch (e) {
			if (e instanceof Error) {
				setError(e.message);
			} else {
				setError("Произошла неизвестная ошибка");
			}
		} finally {
			setSpinner(false);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData(prevFormData => ({
			...prevFormData,
			[name]: value
		}));
	};

	if (loading) return <Loader />

	return (
		<div className=" requests_wrap p-3 d-flex justify-content-center align-items-center">
			{success
				?
				<h3>{success}</h3>
				:
				<form onSubmit={handleSubmit}
					className='d-flex flex-column gap-3 w-100 justify-content-center align-items-center'
					style={{ maxWidth: 320 }}
				>
					<InputForm
						type='password'
						name='password'
						placeholder='новый пароль'
						value={formData.password}
						onChange={handleChange}
						disabled={spinner}
					/>
					<InputForm
						type='password'
						name='confirmPassword'
						placeholder='пароль ещё раз'
						value={formData.confirmPassword}
						onChange={handleChange}
						disabled={spinner}
					/>
					<BtnForm
						type='submit'
						clazz='filled'
						disabled={spinner}>
						{spinner ? <SpinnerBtn /> : 'Изменить пароль'}
					</BtnForm>
				</form>
			}

			{error && <ToastError error={true}>{error}</ToastError>}
		</div>
	);
}

export default ChangePassword;
