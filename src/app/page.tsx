"use client";
import Footer from '@/components/Footer/Footer';
import LinkBtn from '@/components/LinkBtn/LinkBtn';
import Logo from '@/components/Logo/Logo';
import TitleH1 from '@/components/TitleH1/TitleH1';
import TitleH4 from '@/components/TitleH4/TitleH4';
import Link from 'next/link';
import { useState } from 'react';
import { Accordion } from 'react-bootstrap';



export default function Home() {

	const [loading] = useState(false);

	return (
		<>
			<section className='home h100vh d-flex align-items-center justify-content-between py-5'>
				<div className=" container">
					<div className=" row">
						<div className=" col-lg-6 mb-5 mb-md-0">
							<div className=" d-flex align-items-center h-100 flex-column gap-4 home_wrap">
								<Logo
									width={160}
									height={159}
									alt='AIПраво логотип'
								/>
								<TitleH1
									span='Право'
								>
									Ai
								</TitleH1>
								<TitleH4>ИИ ассистент в юридической сфере</TitleH4>
								<div className=' d-flex flex-column gap-3 align-items-center justify-content-center w-100'>
									<LinkBtn
										href='/login'
										clazz='filled'
										disabled={loading}
									>
										Войти
									</LinkBtn>
									<LinkBtn
										href='/registration'
										clazz='outlined'
										disabled={loading}
									>
										Зарегистрироваться
									</LinkBtn>
								</div>
							</div>
						</div>
						<div className=" col-lg-6">
							<div className=" d-flex align-items-center justify-content-center flex-column gap-3">
								<h2>Как пользоваться</h2>
								<Accordion defaultActiveKey="0" className=' w-100'>
									<Accordion.Item eventKey="0">
										<Accordion.Header>Регистрация</Accordion.Header>
										<Accordion.Body className='px-3 py-2'>
											<ol className="list-group list-group-numbered ">
												<li className="list-group-item border-0 px-3 py-1">
													Перейдите на страницу&nbsp;
													<Link
														href='/registration'
														className='accordion_link'
													>регистрации</Link>
												</li>
												<li className="list-group-item border-0 px-3 py-1">Введите вашу почту, придумайте пароль, повторите пароль</li>
												<li className="list-group-item border-0 px-3 py-1">Перейдите по ссылке в письме, полученном на вашу почту</li>
											</ol>
										</Accordion.Body>
									</Accordion.Item>
									<Accordion.Item eventKey="1">
										<Accordion.Header>Авторизация</Accordion.Header>
										<Accordion.Body className='px-3 py-2'>
											<ol className="list-group list-group-numbered ">
												<li className="list-group-item border-0 px-3 py-1">
													Перейдите на страницу&nbsp;
													<Link
														href='/login'
														className='accordion_link'
													>авторизации</Link>
												</li>
												<li className="list-group-item border-0 px-3 py-1">Введите почту, которую указали при регистрации, введите пароль</li>
											</ol>
										</Accordion.Body>
									</Accordion.Item>
									<Accordion.Item eventKey="2">
										<Accordion.Header>Сброс пароля</Accordion.Header>
										<Accordion.Body className='px-3 py-2'>
											<ol className="list-group list-group-numbered ">
												<li className="list-group-item border-0 px-3 py-1">
													Перейдите на страницу&nbsp;
													<Link
														href='/reset'
														className='accordion_link'
													>сброс пароля</Link>
												</li>
												<li className="list-group-item border-0 px-3 py-1">Введите почту, которую указали при регистрации</li>
												<li className="list-group-item border-0 px-3 py-1">Перейдите по ссылке в письме, полученном на вашу почту</li>
												<li className="list-group-item border-0 px-3 py-1">Придумайте новый пароль, повторите пароль</li>
											</ol>
										</Accordion.Body>
									</Accordion.Item>
								</Accordion>
							</div>
						</div>
					</div>
				</div>
			</section>
			<Footer />
		</>
	);
}
