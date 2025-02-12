// app/reset/[token]/page.tsx
"use client";

import { useState, use } from "react";
import ToastError from '@/components/ToastError/ToastError';
import SpinnerBtn from '@/components/SpinnerBtn/SpinnerBtn';
import BtnForm from '@/components/BtnForm/BtnForm';
import InputForm from '@/components/InputForm/InputForm';
import { INewPassword, INewPasswordRes } from './interface';
import Logo from '@/components/Logo/Logo';
import TitleH1 from '@/components/TitleH1/TitleH1';
import TitleH4 from '@/components/TitleH4/TitleH4';
import { setNewPassword } from '@/api/api';
import LinkBtn from '@/components/LinkBtn/LinkBtn';

interface ResetPageProps {
	params: Promise<{ token: string }>;
}

export default function ResetPassword({ params }: ResetPageProps) {
	const { token } = use(params);
	const [formData, setFormData] = useState<INewPassword>({ password: '', confirmPassword: '', token: token });
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		setError('');

		try {
			const response: INewPasswordRes = await setNewPassword(formData);

			setSuccess(response.message)

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
			<div className='h100vh d-flex justify-content-center align-items-center w-100'>
				<div className="row">
					<div className=" col-12 col-lg-6 mx-auto w-100">
						<div className=" d-flex flex-column gap-3">
							<TitleH4>{success}</TitleH4>
							<LinkBtn
								href='/login'
								clazz='filled'
								disabled={loading}
							>
								Авторизоваться
							</LinkBtn>
						</div>
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
								<TitleH4>Сброс пароля</TitleH4>
								<div className='d-flex flex-column gap-2 align-items-center justify-content-center w-100'>
									<form onSubmit={handleSubmit} className='d-flex flex-column gap-3 w-100 justify-content-center align-items-center'>

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
											{loading ? <SpinnerBtn /> : 'Сохранить новый пароль'}
										</BtnForm>
									</form>
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
