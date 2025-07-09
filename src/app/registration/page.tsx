'use client'
import { useState } from 'react';
import { registration } from '@/api/api';
import InputForm from '@/components/InputForm/InputForm';
import Logo from '@/components/Logo/Logo';
import SpinnerBtn from '@/components/SpinnerBtn/SpinnerBtn';
import TitleH1 from '@/components/TitleH1/TitleH1';
import TitleH4 from '@/components/TitleH4/TitleH4';
import ToastError from '@/components/ToastError/ToastError';
import { IRegistration, IRegistrationRes } from './interface';
import BtnForm from '@/components/BtnForm/BtnForm';
import LinkMain from '@/components/LinkMain/LinkMain';

export default function Home() {
	const [formData, setFormData] = useState<IRegistration>({ email: '', password: '', confirmPassword: '' });
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [link, setLink] = useState('');
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		setError('');

		try {
			const response: IRegistrationRes = await registration(formData);


			setSuccess(response.message)
			setLink(response.link)
		} catch (e) {
			if (e instanceof Error) {
				setError(e.message);
			} else {
				setError("Произошла неизвестная ошибка");
			}
		} finally {
			setLoading(false);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData(prevFormData => ({
			...prevFormData,
			[name]: value
		}));
	};


	if (success) {
		return (
			<div className='h100vh d-flex justify-content-center align-items-center'>
				<div className="row">
					<div className=" col col-lg-6 mx-auto">
						<p className=' text-center'>Перейдите по <a href={link} target='_blank' rel='noopener noreferrer' className='accent'>ссылке</a> для завершения регистрации.</p>
					</div>
				</div>
			</div>
		)
	}
	return (
		<>
			<section className='home h100vh d-flex align-items-center justify-content-between py-5'>
				<div className="container">
					<div className="row">
						<div className="col-lg-6 mb-5 mx-auto">
							<div className="d-flex align-items-center h-100 flex-column gap-4 home_wrap">
								<Logo width={80} height={79} alt='AIПраво логотип' />
								<TitleH1 span='Право'>Ai</TitleH1>
								<TitleH4>Регистрация</TitleH4>
								<div className='d-flex flex-column gap-2 align-items-center justify-content-center w-100'>
									<form onSubmit={handleSubmit} className='d-flex flex-column gap-3 w-100 justify-content-center align-items-center'>
										<InputForm
											type='email'
											name='email'
											placeholder='email'
											value={formData.email}
											onChange={handleChange}
											disabled={loading}
										/>
										<InputForm
											type='password'
											name='password'
											placeholder='новый пароль'
											value={formData.password}
											onChange={handleChange}
											disabled={loading}
										/>
										<InputForm
											type='password'
											name='confirmPassword'
											placeholder='пароль ещё раз'
											value={formData.confirmPassword}
											onChange={handleChange}
											disabled={loading}
										/>
										<BtnForm
											type='submit'
											clazz='filled'
											disabled={loading}>
											{loading ? <SpinnerBtn /> : 'Зарегистрироваться'}
										</BtnForm>
									</form>
									<div className=" d-flex justify-content-between align-items-center w-100">
										<LinkMain
											href='/login'
										>
											Авторизация
										</LinkMain>
										<LinkMain
											href='/reset'
										>
											Сброс пароля
										</LinkMain>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
			{error && <ToastError error={true}>{error}</ToastError>}
		</>
	);
}
