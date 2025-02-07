'use client'
import Loader from '@/components/Loader/Loader';
import { useCallback, useEffect, useState, type FC } from 'react';
import { ITariff } from './interface';
import { createTariff, deleteTariffById, getTariffs } from '@/api/api';
import ToastError from '@/components/ToastError/ToastError';
import BtnForm from '@/components/BtnForm/BtnForm';
import { useAdmin } from '@/context/AdminContext';
import InputForm from '@/components/InputForm/InputForm';

const Tariffs: FC = () => {

	const { menu, setMenu } = useAdmin()
	const [formData, setFormData] = useState<Omit<ITariff, 'id'>>({
		type: '',
		cost: '',
		count_requests: '',
		count_days: ''
	});
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string>('')
	const [tariffs, setTariffs] = useState<ITariff[]>([])
	const [spinner, setSpinner] = useState<boolean>(false)

	const fetchTariffs = useCallback(async () => {
		setLoading(true)
		try {
			const response = await getTariffs()

			setTariffs(() =>
				response.map((res) => ({
					id: res.id,
					type: res.type,
					cost: res.cost,
					count_requests: res.count_requests,
					count_days: res.count_days
				}))
			);

		} catch (e) {
			if (e instanceof Error) {
				setError(e.message)
			} else {
				setError("Ошибка fetchTariffs")
			}
		} finally {
			setLoading(false)
		}

	}, [])

	useEffect(() => {
		if (menu) {
			setMenu(!menu)
		}

		fetchTariffs()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fetchTariffs])

	const handleSubmit = async (formData: Omit<ITariff, 'id'>, e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setSpinner(true);
		setError('');
		try {
			const response = await createTariff(formData)
			setFormData({
				type: '',
				cost: '',
				count_requests: '',
				count_days: ''
			})
			setTariffs((prevTariffs) => [...prevTariffs, response]);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Ошибка handleSubmit");
		} finally {
			setSpinner(false);
		}
	}

	const handleDelete = async (id: number) => {
		setSpinner(true);
		setError('');
		try {
			await deleteTariffById(id);

			setTariffs(prevTariffs => prevTariffs.filter(req => req.id !== id));
		} catch (e) {
			setError(e instanceof Error ? e.message : "Ошибка handleDelete");
		} finally {
			setSpinner(false);
		}
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;

		setFormData(prevFormData => ({
			...prevFormData,
			[name]: value // Приведение типа
		}));
	};


	if (loading) return <Loader />

	return (
		<div className=" requests_wrap p-3 overflow-y-auto position-relative">
			<h4 className='text-accent mb-3'>Добавить новый тариф</h4>
			<form onSubmit={(e) => handleSubmit(formData, e)} className='mb-4 d-flex flex-wrap gap-3 w-100 tariff_form'>
				<select className='tariff_input' name="type" value={formData.type} onChange={handleChange}>
					<option value="" disabled hidden>Выберите тип тарифа</option>
					<option value="fixed">Фиксированный</option>
					<option value="subscription">Подписка</option>
				</select>
				{formData.type === 'fixed' ?
					(
						<InputForm
							type='number'
							value={formData.count_requests ?? 0}
							name='count_requests'
							placeholder='кол-во запросов'
							onChange={handleChange}
							disabled={spinner}
							clazz='tariff_input'
						/>
					)
					: formData.type === 'subscription' ?
						(
							<InputForm
								type='number'
								value={formData.count_days ?? 0}
								name='count_days'
								placeholder='кол-во дней'
								onChange={handleChange}
								disabled={spinner}
								clazz='tariff_input'
							/>
						)
						:
						(
							<InputForm
								type='number'
								value=''
								name='other'
								anotherPlaceholder='Сначала выберите тип тарифа'
								disabled={true}
								clazz='tariff_input'
							/>
						)
				}
				<InputForm
					type='number'
					value={formData.cost}
					name='cost'
					onChange={handleChange}
					placeholder='стоимость тарифа'
					disabled={spinner}
					clazz='tariff_input'
				/>
				{
					formData.type !== "" &&
						formData.cost !== "" &&
						formData.count_days != null &&
						formData.count_requests != null ?
						(
							<BtnForm
								type="submit"
								clazz="filled"
								disabled={spinner}
								custom="tariff_input"
							>
								<span className="material-symbols-outlined me-2">add</span>
								Создать тариф
							</BtnForm>
						) :
						(
							<BtnForm
								type="submit"
								clazz="outlined"
								disabled={spinner}
								custom="tariff_input"
							>
								<span className="material-symbols-outlined me-2">add</span>
								Создать тариф
							</BtnForm>
						)
				}

			</form>
			<h4 className=' text-accent mb-3'>Список тарифов</h4>
			<div className=' w-100 d-flex flex-wrap gap-3 overflow-y-auto'>
				{
					[...tariffs]
						.sort((a, b) => Number(a.cost) - Number(b.cost))
						.map((req, idx) => (
							<div key={`${idx}`} className="tariff_item p-3 d-flex flex-column gap-3 align-items-center">
								<div className="tariff_count_requests d-flex justify-content-center align-items-center gap-2">
									{req.count_requests
										?
										(
											<>
												<span className=' text-accent requestss d-flex justify-content-center align-items-center rounded-circle'>{req.count_requests}</span>
												<span>{req.count_requests === 1 ? 'запрос' : req.count_requests % 10 === 1 && req.count_requests % 100 !== 11 ? 'запрос' : req.count_requests % 10 >= 2 && req.count_requests % 10 <= 4 && (req.count_requests % 100 < 10 || req.count_requests % 100 >= 20) ? 'запроса' : 'запросов'}</span>
											</>
										)
										:
										(
											<>
												<span className='vip_requests d-flex justify-content-center align-items-center rounded-pill px-3 text-accent'>VIP на {req.count_days} дней</span>
											</>
										)
									}

								</div>
								<div className="tariff_cost">{req.cost.toLocaleString('ru-RU')}&nbsp;<span>₸</span></div>
								<BtnForm
									type='button'
									clazz='filled'
									disabled={spinner}
									onClick={() => handleDelete(Number(req.id))}
								>
									<span className="material-symbols-outlined me-2">delete</span>
									Удалить
								</BtnForm>
							</div>
						))
				}
			</div>

			{error && <ToastError error={true}>{error}</ToastError>}
		</div>
	);
}

export default Tariffs;
