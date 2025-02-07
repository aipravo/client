'use client'
import { useApp } from '@/context/AppContext';
import type { FC } from 'react';

const Dashboard: FC = () => {

	const { balance, subscription } = useApp()


	if (subscription.is_active) {
		return (
			<div className=" d-flex justify-content-center align-items-center h-100 p-3 welcome">
				<div className=" col-md-5 mx-md-auto">
					<h3 className=' mb-4'>Приветствую, друг!👋</h3>
					<p className=' text-center text-md-start'>У тебя <span className='text-accent'>VIP</span> подписка до: <span className='text-accent'>{subscription.expiration}</span> 😊</p>
					<p className=' text-center text-md-start'>Чтобы приступить к работе, жми кнопку <span className='text-accent'>Новый запрос</span></p>
					<h5>Удачи! 🚀</h5>
				</div>
			</div>
		)
	}
	return (
		<div className=" d-flex justify-content-center align-items-center h-100 p-3 welcome">
			{!balance
				?
				<div className=" col-md-5 mx-md-auto">
					<h3 className=' mb-4'>Приветствую, друг!👋</h3>
					<p>Чтобы начать отправлять запросы, сначала нужно их приобрести.</p>
					<p>Просто нажми кнопку <span className='text-accent'>Купить запросы</span> в левом меню.</p>
					<p>После покупки появится кнопка <span className='text-accent'>Новый запрос</span>, и ты сможешь сразу приступить к работе.</p>
					<h5>Удачи! 🚀</h5>
				</div>
				:
				<div className=" col-md-5 mx-md-auto">
					<h3 className=' mb-4'>Приветствую, друг!👋</h3>
					<p>У тебя <span className='text-accent'>{balance}</span> {balance === 1 ? 'запрос' : balance % 10 === 1 && balance % 100 !== 11 ? 'запрос' : balance % 10 >= 2 && balance % 10 <= 4 && (balance % 100 < 10 || balance % 100 >= 20) ? 'запроса' : 'запросов'} 😊</p>
					<p>Чтобы приступить к работе, жми кнопку <span className='text-accent'>Новый запрос</span></p>
					<h5>Удачи! 🚀</h5>
				</div>
			}
		</div>
	);
}

export default Dashboard;
