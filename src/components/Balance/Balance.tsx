import { useApp } from '@/context/AppContext';
import { FC } from 'react';


const Balance: FC = () => {
	const { balance, subscription } = useApp()

	if (subscription.is_active) {
		return (
			<div className=' d-flex flex-md-column gap-2 '>
				<h5 className=' mb-0 text-right text-md-center'></h5>
				<div className=" d-flex flex-md-column gap-1 align-items-center">
					<p className='mb-0 balanceCount'>VIP</p>
					<h5 className='mb-0 text-center'>до: {subscription.expiration}</h5>
				</div>
			</div>
		)
	}
	return (
		<div className=' d-flex flex-md-column gap-2 '>
			<h5 className=' mb-0 text-right text-md-center'>Баланс</h5>
			<div className=" d-flex flex-md-column gap-1 align-items-center">
				<p className='mb-0 balanceCount'>{balance} </p>
				<h5 className='mb-0 text-center'>{balance === 1 ? 'запрос' : balance % 10 === 1 && balance % 100 !== 11 ? 'запрос' : balance % 10 >= 2 && balance % 10 <= 4 && (balance % 100 < 10 || balance % 100 >= 20) ? 'запроса' : 'запросов'}</h5>
			</div>
		</div>
	);
}

export default Balance;
