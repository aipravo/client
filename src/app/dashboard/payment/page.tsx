'use client'
import Loader from '@/components/Loader/Loader';
import { useApp } from '@/context/AppContext';
import { useCallback, useEffect, useState, type FC } from 'react';
import { ITariff } from './interface';
import { buyTariff, getBalance, getSubscription, getTariffs } from '@/api/api';
import ToastError from '@/components/ToastError/ToastError';
import BtnForm from '@/components/BtnForm/BtnForm';
import useCloudPayments from '@/hooks/useCloudPayments';

const Tariffs: FC = () => {

	useCloudPayments()

	const { menu, setMenu, subscription, setBalance, setSubscription } = useApp()
	const [loading, setLoading] = useState<boolean>(false)
	const [error, setError] = useState<string>('')
	const [tariffs, setTariffs] = useState<ITariff[]>([])
	const [spinner, setSpinner] = useState<boolean>(false)

	const fetchTariffs = useCallback(async () => {
		setLoading(true)
		try {
			const response = await getTariffs()

			setTariffs(() => {
				const updatedTariffs = response.map((res) => {

					return {
						id: res.id,
						type: res.type,
						cost: res.cost,
						count_requests: res.count_requests,
						count_days: res.count_days
					}
				});
				return [...updatedTariffs];
			});
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
		if (!subscription.is_active) {
			fetchTariffs()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const handleBuy = async (req: Omit<ITariff, "id">) => {
		setSpinner(true)
		setError('');
		try {
			if (typeof window !== "undefined" && "tiptop" in window) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const widget = new (window as any).tiptop.Widget(); // <--- Кастомный тип `any`
				widget.pay('auth',
					{
						publicId: 'test_api_00000000000000000000002',
						description: 'Оплата запросов на aipravo.kz',
						amount: req.cost,
						currency: 'KZT',
						// accountId: 'user@example.com',
						// invoiceId: '1234567',
						// email: 'user@example.com',
						skin: "modern",
						autoClose: 3,
						data: { myProp: 'myProp value' }
					},
					{
						onSuccess: async function () {
							await buyTariff(req); // <--- Передаём `req`, а не `formData`
							if (req.type === 'fixed') {
								setBalance(await getBalance())
							} else if (req.type === 'subscription') {
								setSubscription(await getSubscription())
							}
						},
						onFail: function () {
							setError('Неуспешная оплата');
						},
					}
				);
			} else {
				throw new Error("CloudPayments SDK не загружен");
			}
		} catch (e) {
			setError(e instanceof Error ? e.message : "Ошибка handleBuy");
		} finally {
			setSpinner(false);
		}
	};


	if (loading) return <Loader />

	if (subscription.is_active) {
		return (
			<div className=" requests_wrap p-3 d-flex justify-content-center align-items-center">
				<h5 className=' text-center text-md-start'>У тебя <span className='text-accent'>VIP</span> подписка до: <span className='text-accent'>{subscription.expiration}</span> 😊</h5>
			</div>
		)
	}

	return (
		<div className=" requests_wrap p-3 overflow-y-auto d-flex gap-3 flex-wrap justify-content-center">
			{[...tariffs]
				.sort((a, b) => Number(a.cost) - Number(b.cost))
				.map((req, idx) => (
					<div key={`${idx}`} className="tariff_item p-3 d-flex flex-column gap-3 align-items-center justify-content-center">
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
							onClick={() => handleBuy(req)}
						>
							<span className="material-symbols-outlined me-2">shopping_cart</span>
							Купить
						</BtnForm>
					</div>
				))}

			{error && <ToastError error={true}>{error}</ToastError>}
		</div>
	);
}

export default Tariffs;
