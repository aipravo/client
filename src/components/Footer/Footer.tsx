import type { FC } from 'react';
import Logo from '../Logo/Logo';
import TitleH1 from '../TitleH1/TitleH1';
import Link from 'next/link';

const Footer: FC = () => {
	return (
		<footer className='footer py-5'>
			<div className=" container">
				<div className="row justify-content-center justify-content-md-between align-items-center">
					<div className=" col-12 col-md-auto order-1 order-md-0">
						<div className=" d-flex flex-column gap-2 align-items-center">
							<div className=' d-flex gap-3'>
								<Logo
									width={80}
									height={80}
									alt='footer AiPravo'
								/>
								<div
									className=" d-flex flex-column"
									style={{ width: 150 }}
								>
									<TitleH1
										style={{ fontSize: 33 }}
									>
										AI
										<span>Право</span>
									</TitleH1>
									<span
										style={{ fontSize: 15, textAlign: 'center' }}
									>ИИ АССИСТЕНТ юридической сферы</span>
								</div>
							</div>

							<span
								style={{ fontSize: 15, color: '#bdbdbd' }}
							>© Все права защищены AIPRAVO</span>
						</div>

					</div>
					<div className="col-12 col-md-auto order-0 order-md-1 mb-5 mb-md-0">
						<div className=" d-flex gap-5 flex-column flex-md-row align-items-center">
							<ul className=' list-unstyled flex-column gap-3 m-0 footer_links d-none d-md-flex'>
								<li>
									<Link
										href={'/login'}
									>
										Авторизация
									</Link>
								</li>
								<li>
									<Link
										href={'/registration'}
									>
										Регистрация
									</Link>
								</li>
								<li>
									<Link
										href={'/reset'}
									>
										Сброс пароля
									</Link>
								</li>
							</ul>
							<ul className=' list-unstyled d-flex flex-column gap-3 m-0 footer_links text-center text-md-start'>
								<li>
									<Link
										href={'/offer-agreement'}
									>
										Договор оферты
									</Link>
								</li>
								<li>
									<Link
										href={'/privacy-policy'}
									>
										Политика конфиденциальности
									</Link>
								</li>
								<li>
									<Link
										href={'/payment-info'}
									>
										Информация об онлайн оплате
									</Link>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}

export default Footer;

