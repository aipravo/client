'use client'
import InputForm from '@/components/InputForm/InputForm'
import Markdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import { useCallback, useEffect, useRef, useState, type FC } from 'react'
import { IMessage, Message } from '../interface'
import SpinnerBtn from '@/components/SpinnerBtn/SpinnerBtn'
import BtnForm from '@/components/BtnForm/BtnForm'
import { useApp } from '@/context/AppContext'
import { useParams } from 'next/navigation'
import { createMessage, getBalance, getMessageById, getRequestById, updateAttempts } from '@/api/api'
import ToastError from '@/components/ToastError/ToastError'
import Loader from '@/components/Loader/Loader'
import Modal from '@/components/Modal/Modal'

const Dashboard: FC = () => {
	const [formData, setFormData] = useState<IMessage>({
		thread_id: '',
		content: '',
		id: 0,
		files: []
	})
	const [error, setError] = useState<string>('')
	const [content, setContent] = useState<string>('')
	const [files, setFiles] = useState<File[]>([])
	const anotherPlaceholder = 'Hажмите + "Добавить попытки" для продолжения . Это списывает 1 запрос, что равно 3 попыткам.'
	const [spinner, setSpinner] = useState<boolean>(false)
	const [loading, setLoading] = useState<boolean>(false)
	const [attempts, setAttempts] = useState<number>()
	const fileInputRef = useRef<HTMLInputElement>(null)
	const chatContainerRef = useRef<HTMLDivElement>(null)
	const [messages, setMessages] = useState<Message[]>([])
	const [thread_id, setThread_id] = useState<string>('')
	const { setBalance } = useApp()
	const { id } = useParams()
	const { menu, setMenu, subscription } = useApp()
	const [isOpen, setIsOpen] = useState(false);
	const [pdfUrl, setPdfUrl] = useState("");



	useEffect(() => {
		scrollToBottom()
	}, [])

	const fetchRequest = useCallback(async () => {
		try {
			const response = await getRequestById(Number(id))
			setAttempts(response.attempts)
			setThread_id(response.thread_id)
			setFormData(prevFormData => ({
				...prevFormData,
				thread_id: response.thread_id,
				id: Number(id)
			}))
		} catch (e) {
			if (e instanceof Error) {
				setError(e.message)
			} else {
				setError("Ошибка fetchRequest")
			}
		} finally {
			setLoading(false)
		}
	}, [])
	useEffect(() => {
		if (menu) {
			setMenu(!menu)
		}

		fetchRequest()
	}, [fetchRequest])

	const fetchMessages = useCallback(async () => {
		try {
			const response = await getMessageById(Number(id))
			setMessages(() => [
				...response.map((msg) => ({
					role: msg.role,
					content: msg.content,
					files: msg.files
				})),
			])
		} catch (e) {
			if (e instanceof Error) {
				setError(e.message)
			} else {
				setError("Ошибка fetchMessages")
			}
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		fetchMessages()
	}, [fetchMessages])


	useEffect(() => {
		scrollToBottom()
	}, [messages])

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setSpinner(true)
		setError('')

		try {
			if (subscription.is_active) {
				const userMessage = { role: 'user', content: formData.content }

				updateMessages(userMessage)
				scrollToBottom()

				setContent('')

				setFiles([])
				if (fileInputRef.current) {
					fileInputRef.current.value = ""
				}

				const response = await createMessage(formData)

				setFormData(prevFormData => ({
					...prevFormData,
					content: '',
					files: []
				}));

				const aiMessage = { role: 'assistant', content: response }

				updateMessages(aiMessage)
				scrollToBottom()
			} else {
				if (attempts && attempts > 0) {
					const userMessage = { role: 'user', content: formData.content }

					updateMessages(userMessage)
					scrollToBottom()

					setContent('')

					setFiles([])
					if (fileInputRef.current) {
						fileInputRef.current.value = ""
					}

					const response = await createMessage(formData)

					const aiMessage = { role: 'assistant', content: response }

					updateMessages(aiMessage)
					scrollToBottom()

					setAttempts(await updateAttempts(thread_id))
				} else {
					setAttempts(await updateAttempts(thread_id))
					setBalance(await getBalance())
				}
			}


		} catch (e) {
			if (e instanceof Error) {
				setError(e.message)
			} else {
				setError("Произошла неизвестная ошибка")
			}
		} finally {
			setSpinner(false)
		}

	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
		}
	}

	const updateMessages = (newMessage: Message) => {
		setMessages(prevMessages => [...prevMessages, newMessage])
	}

	const scrollToBottom = () => {
		if (chatContainerRef.current) {
			chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
		}
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setContent(e.target.value)
		if (e.target.value) {
			setFormData(prevFormData => ({
				...prevFormData,
				content: e.target.value,
			}))
		}
	}

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files ? Array.from(e.target.files) : []
		setFiles(files)
		if (e.target.files) {
			const filesArray = Array.from(e.target.files)
			setFormData(prevFormData => ({
				...prevFormData,
				files: filesArray,
			}))
		}
	}



	const handleOpenModal = (url: string) => {
		setPdfUrl(url);
		setIsOpen(true);
	};

	if (loading) return <Loader />

	return (
		<div className=" d-flex flex-column justify-content-between gap-3 h-100">
			<div ref={chatContainerRef} className="messages p-3">
				{messages.length > 0
					?
					messages.map((msg, idx) => (
						<div key={idx} className={`message p-3 ${msg.role}`}>
							{msg.role === 'user'
								?
								<svg className='userSvg' width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
									<rect x="1.29297" y="0.5" width="46.2082" height="47" rx="23.1041" fill="white" />
									<rect x="1.29297" y="0.5" width="46.2082" height="47" rx="23.1041" stroke="#E65100" />
									<path d="M20.793 19.7895C20.793 21.8787 22.5876 23.5789 24.793 23.5789C26.9983 23.5789 28.793 21.8787 28.793 19.7895C28.793 17.7002 26.9983 16 24.793 16C22.5876 16 20.793 17.7002 20.793 19.7895ZM31.9041 32H32.793V31.1579C32.793 27.9082 30.001 25.2632 26.5707 25.2632H23.0152C19.5841 25.2632 16.793 27.9082 16.793 31.1579V32H31.9041Z" fill="#E65100" />
								</svg>
								:
								<svg className='aiSvg' width="49" height="48" viewBox="0 0 49 48" fill="none" xmlns="http://www.w3.org/2000/svg">
									<rect x="0.5" y="0.5" width="47.2229" height="47" rx="23.5" fill="white" />
									<rect x="0.5" y="0.5" width="47.2229" height="47" rx="23.5" stroke="#E65100" />
									<path d="M31.1035 23.0155C31.3793 22.3619 31.4714 21.6493 31.3706 20.9501C31.2698 20.2508 30.9797 19.5899 30.5297 19.0344C30.0797 18.4789 29.4858 18.0487 28.8085 17.7874C28.1312 17.5261 27.3946 17.4432 26.6734 17.5469C26.2265 16.9894 25.6352 16.5564 24.9596 16.2918C24.284 16.0271 23.5481 15.9404 22.8266 16.0403C22.1052 16.1401 21.4239 16.4231 20.8519 16.8605C20.2799 17.2978 19.8376 17.8739 19.5699 18.5304C18.8475 18.6261 18.1642 18.9054 17.5894 19.3397C17.0146 19.774 16.5687 20.348 16.2972 21.0032C16.0256 21.6585 15.938 22.3717 16.0433 23.0703C16.1485 23.769 16.4429 24.4282 16.8964 24.981C16.6751 25.5063 16.5717 26.0711 16.5931 26.6381C16.6145 27.205 16.7602 27.7611 17.0205 28.2693C17.2808 28.7775 17.6498 29.2263 18.1029 29.5859C18.5561 29.9454 19.083 30.2075 19.6488 30.3547C19.9995 30.4476 20.3612 30.4956 20.7248 30.4975C20.9265 30.4972 21.1278 30.4827 21.3273 30.4539C21.7743 31.0112 22.3656 31.4441 23.0412 31.7085C23.7168 31.973 24.4526 32.0596 25.1739 31.9597C25.8952 31.8597 26.5764 31.5767 27.1483 31.1394C27.7202 30.7021 28.1624 30.1261 28.4301 29.4698C29.1525 29.374 29.8358 29.0948 30.4106 28.6604C30.9854 28.2261 31.4313 27.6522 31.7028 26.9969C31.9744 26.3417 32.062 25.6285 31.9567 24.9298C31.8515 24.2311 31.5571 23.5719 31.1035 23.0191V23.0155ZM28.0452 18.7439C28.7886 18.9364 29.425 19.4026 29.8185 20.043C30.212 20.6835 30.3315 21.4475 30.1514 22.1721C30.0814 22.1267 30.0098 22.0836 29.9368 22.0428L26.655 20.2045C26.5653 20.1543 26.4635 20.1279 26.36 20.1279C26.2564 20.1279 26.1547 20.1543 26.065 20.2045L22.82 22.0192V20.6994L25.8069 19.0296C26.1419 18.8411 26.5123 18.7188 26.8965 18.6698C27.2807 18.6207 27.6711 18.6459 28.0452 18.7439ZM25.18 24.6582L24 25.3181L22.82 24.6582V23.3384L24 22.6784L25.18 23.3384V24.6582ZM20.46 19.9988C20.4603 19.4403 20.6296 18.8941 20.947 18.4278C21.2644 17.9615 21.716 17.5955 22.246 17.3751C22.7759 17.1548 23.3609 17.0896 23.9286 17.1878C24.4964 17.286 25.0219 17.5432 25.4403 17.9276C25.3666 17.964 25.2928 17.999 25.2191 18.0433L21.935 19.8752C21.8454 19.9253 21.771 19.9973 21.7192 20.0841C21.6674 20.1708 21.6401 20.2692 21.64 20.3694V23.9983L20.46 23.3384V19.9988ZM17.5735 21.0651C17.9494 20.4302 18.5639 19.9604 19.2889 19.7538C19.2833 19.8353 19.2804 19.917 19.28 19.9988V23.6683C19.28 23.7686 19.3073 23.8672 19.359 23.9541C19.4108 24.041 19.4853 24.1131 19.575 24.1633L22.82 25.9773L21.64 26.6408L18.6532 24.9675C17.9756 24.5886 17.4812 23.9646 17.2788 23.2328C17.0763 22.501 17.1823 21.7212 17.5735 21.0651ZM19.9548 29.2526C19.2114 29.0602 18.575 28.594 18.1815 27.9535C17.788 27.3131 17.6685 26.5491 17.8486 25.8245C17.9186 25.8695 17.9894 25.9131 18.0632 25.9538L21.345 27.7921C21.4347 27.8423 21.5365 27.8687 21.64 27.8687C21.7436 27.8687 21.8453 27.8423 21.935 27.7921L25.18 25.9773V27.2972L22.1931 28.967C21.858 29.1555 21.4877 29.2777 21.1035 29.3268C20.7193 29.3758 20.3289 29.3506 19.9548 29.2526ZM27.54 27.9978C27.5403 28.5565 27.3714 29.103 27.0543 29.5697C26.7372 30.0363 26.2858 30.4028 25.7559 30.6236C25.226 30.8444 24.6408 30.9098 24.0729 30.8119C23.5049 30.714 22.9791 30.4569 22.5604 30.0725C22.6342 30.0361 22.7079 29.9976 22.7817 29.9561L26.065 28.1214C26.1546 28.0713 26.229 27.9992 26.2808 27.9125C26.3326 27.8257 26.3599 27.7273 26.36 27.6271V23.9983L27.54 24.6582V27.9978ZM30.4265 26.9315C30.0506 27.5664 29.4361 28.0361 28.7111 28.2428C28.7163 28.1613 28.72 28.0799 28.72 27.9978V24.3282C28.72 24.2279 28.6927 24.1294 28.641 24.0425C28.5892 23.9556 28.5147 23.8835 28.425 23.8333L25.18 22.0192L26.36 21.3593L29.3468 23.0291C30.0244 23.408 30.5187 24.0319 30.7212 24.7638C30.9237 25.4956 30.8177 26.2754 30.4265 26.9315Z" fill="#E65100" />
								</svg>
							}

							{
								msg.files?.length ? (
									<div className="d-flex align-items-center gap-3 justify-content-end mb-2">
										{msg.files.map((file, idx) => (
											<span
												key={idx}
												data-url={`${process.env.NEXT_PUBLIC_SERVER}/${file}`}
												onClick={() => handleOpenModal(`${process.env.NEXT_PUBLIC_SERVER}/${file}`)}
												className='request_detail lh-1'
											>
												{`Файл ${idx + 1}`}
											</span>
										))}
									</div>
								) : null
							}
							<Markdown rehypePlugins={[rehypeHighlight]}>{msg.content}</Markdown>
						</div>
					))
					:
					<div className="w-100 d-flex justify-content-center align-items-center">
						<div className=" col-md-6 mx-md-auto">
							<h3 className=' mb-4 text-center text-md-start'>✨ Напоминаю! ✨</h3>

							{subscription.is_active
								?
								(
									<>
										<p className=' mb-4 text-center text-md-start'>У вас VIP подписка! Вы можете отправлять запросы без ограничений</p>

										<h2 className=' mb-4'>Инструкция по правильному запросу ассистенту</h2>

										<h4>1. Четко формулируйте запрос</h4>
										<p className=' mb-4'>
											<strong>📌 Плохо:</strong> &quot;Напиши договор.&quot;
											<br />
											<strong>✅ Хорошо:</strong> &quot;Составь договор аренды коммерческого помещения в Алматы между физическим и юридическим лицом, с учетом права выкупа через 3 года. Укажи обязанности сторон, порядок расторжения и ответственность за нарушение условий.&quot;
										</p>

										<h4>2. Указывайте детали</h4>
										<p className=' mb-4'>
											<strong>📌 Пример:</strong>
											<br />
											✅ &quot;Напиши исковое заявление в суд о взыскании задолженности по договору займа между двумя физическими лицами в Казахстане. Укажи сумму долга, проценты, неустойку и ссылку на ГК РК.&quot;
										</p>

										<h4>3. Используйте запросы по частям для объемных ответов</h4>
										<p>
											Если вам нужен <strong>большой документ</strong>, ассистент может разбить ответ на части.
										</p>
										<p className=' mb-4'>
											<strong>📌 Пример:</strong>
											<br />
											1️⃣ &quot;Составь первую часть договора – преамбулу и предмет договора.&quot;
											<br />
											2️⃣ &quot;Теперь добавь обязанности сторон и ответственность.&quot;
											<br />
											3️⃣ &quot;Допиши заключительные положения и реквизиты.&quot;
										</p>

										<h4>4. Если ответ короткий – уточняйте!</h4>
										<p className=' mb-4'>
											<strong>📌 Пример:</strong>
											<br />
											✅ &quot;Раскрой подробнее все разделы.&quot;
											<br />
											✅ &quot;Добавь ссылки на законы и разверни формулировки.&quot;
											<br />
											✅ &quot;Опиши больше деталей, например, ответственность за нарушение.&quot;
										</p>

										<h4>5. Не забывайте о юрисдикции</h4>
										<p>
											<strong>Ассистент работает только по законодательству Республики Казахстан.</strong>
										</p>
										<p className=' mb-4'>
											<strong>📌 Если вам нужны ссылки на законы, обязательно укажите:</strong>
											<br />
											✅ &quot;Составь исковое заявление с учетом
											норм Гражданского кодекса РК и Закона &quot;О защите прав потребителей.&quot;&quot;
										</p>

										<h4>Пример идеального запроса</h4>
										<div className="alert alert-success  className=' mb-4'">
											<p>
												&quot;Составь договор займа между физическим и юридическим лицом в Казахстане. Сумма займа –
												5 млн тенге, срок возврата – 12 месяцев. Проценты – 10% годовых. Добавь раздел об
												обеспечении (залог автомобиля). Укажи ответственность за просрочку платежа. Сошлись на ГК РК.&quot;
											</p>
										</div>

										<p className="text-center mt-4">
											<strong>Следуйте этой инструкции, и вы получите максимально развернутый юридический ответ! 🚀⚖️</strong>
										</p>
									</>
								)
								:
								(
									<>
										<p className=' mb-4'>Один запрос включает 3 попытки. Когда попытки заканчиваются, ты можешь добавить ещё.</p>
										<p>🔄 Как это работает?</p>
										<p>1️⃣ Закончились <span className='text-accent'>3</span> попытки?</p>
										<p>2️⃣ Добавляешь новые — списывается <span className='text-accent'>1</span> запрос</p>
										<p className=' mb-5'>3️⃣ Получаешь ещё <span className='text-accent'>3</span> попытки! 🎯</p>

										<h2 className=' mb-4'>Инструкция по правильному запросу ассистенту</h2>

										<h4>1. Четко формулируйте запрос</h4>
										<p className=' mb-4'>
											<strong>📌 Плохо:</strong> &quot;Напиши договор.&quot;
											<br />
											<strong>✅ Хорошо:</strong> &quot;Составь договор аренды коммерческого помещения в Алматы между физическим и юридическим лицом, с учетом права выкупа через 3 года. Укажи обязанности сторон, порядок расторжения и ответственность за нарушение условий.&quot;
										</p>

										<h4>2. Указывайте детали</h4>
										<p className=' mb-4'>
											<strong>📌 Пример:</strong>
											<br />
											✅ &quot;Напиши исковое заявление в суд о взыскании задолженности по договору займа между двумя физическими лицами в Казахстане. Укажи сумму долга, проценты, неустойку и ссылку на ГК РК.&quot;
										</p>

										<h4>3. Используйте запросы по частям для объемных ответов</h4>
										<p>
											Если вам нужен <strong>большой документ</strong>, ассистент может разбить ответ на части.
										</p>
										<p className=' mb-4'>
											<strong>📌 Пример:</strong>
											<br />
											1️⃣ &quot;Составь первую часть договора – преамбулу и предмет договора.&quot;
											<br />
											2️⃣ &quot;Теперь добавь обязанности сторон и ответственность.&quot;
											<br />
											3️⃣ &quot;Допиши заключительные положения и реквизиты.&quot;
										</p>

										<h4>4. Если ответ короткий – уточняйте!</h4>
										<p className=' mb-4'>
											<strong>📌 Пример:</strong>
											<br />
											✅ &quot;Раскрой подробнее все разделы.&quot;
											<br />
											✅ &quot;Добавь ссылки на законы и разверни формулировки.&quot;
											<br />
											✅ &quot;Опиши больше деталей, например, ответственность за нарушение.&quot;
										</p>

										<h4>5. Не забывайте о юрисдикции</h4>
										<p>
											<strong>Ассистент работает только по законодательству Республики Казахстан.</strong>
										</p>
										<p className=' mb-4'>
											<strong>📌 Если вам нужны ссылки на законы, обязательно укажите:</strong>
											<br />
											✅ &quot;Составь исковое заявление с учетом
											норм Гражданского кодекса РК и Закона &quot;О защите прав потребителей.&quot;&quot;
										</p>

										<h4>Пример идеального запроса</h4>
										<div className="alert alert-success  className=' mb-4'">
											<p>
												&quot;Составь договор займа между физическим и юридическим лицом в Казахстане. Сумма займа –
												5 млн тенге, срок возврата – 12 месяцев. Проценты – 10% годовых. Добавь раздел об
												обеспечении (залог автомобиля). Укажи ответственность за просрочку платежа. Сошлись на ГК РК.&quot;
											</p>
										</div>

										<p className="text-center mt-4">
											<strong>Следуйте этой инструкции, и вы получите максимально развернутый юридический ответ! 🚀⚖️</strong>
										</p>
									</>
								)
							}

						</div>
					</div>
				}
			</div>
			<form onSubmit={handleSubmit} className=' d-flex gap-3'>
				{subscription.is_active
					?
					(
						<>
							<InputForm
								type='text'
								placeholder='сообщение ...'
								onChange={handleChange}
								name='content'
								onKeyDown={handleKeyDown}
								value={content}
								disabled={spinner}
							/>
							<input
								id='uploadFile'
								hidden
								type="file"
								multiple
								onChange={handleFileChange}
								ref={fileInputRef}
								accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
								className='fileField'
								disabled={spinner}
							/>
						</>
					)
					:
					(
						<>
							<InputForm
								type='text'
								placeholder='сообщение ...'
								onChange={handleChange}
								name='content'
								onKeyDown={handleKeyDown}
								value={content}
								disabled={attempts === 0 ? true : spinner}
								anotherPlaceholder={attempts === 0 ? anotherPlaceholder : ''}
							/>
							<input
								id='uploadFile'
								hidden
								type="file"
								multiple
								onChange={handleFileChange}
								ref={fileInputRef}
								accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
								className='fileField'
								disabled={attempts === 0 ? true : spinner}
							/>
						</>
					)
				}

				<label htmlFor="uploadFile" className='uploadLabel'>
					{
						(files.length && files.length > 0)
							?
							<span className="file-count">{files.length}</span>
							:
							<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
								<path d="M640-520v-200h80v200h-80ZM440-244q-35-10-57.5-39T360-350v-370h80v476Zm30 164q-104 0-177-73t-73-177v-370q0-75 52.5-127.5T400-880q75 0 127.5 52.5T580-700v300h-80v-300q-1-42-29.5-71T400-800q-42 0-71 29t-29 71v370q-1 71 49 120.5T470-160q25 0 47.5-6.5T560-186v89q-21 8-43.5 12.5T470-80Zm170-40v-120H520v-80h120v-120h80v120h120v80H720v120h-80Z" />
							</svg>
					}
				</label>
				{subscription.is_active
					?
					(
						<BtnForm
							type='submit'
							clazz='filled'
							disabled={spinner}
							custom='sendBtn'
						>
							{spinner
								?
								<SpinnerBtn
									text='Думаю ...'
								/>
								:
								<span className=' d-flex align-items-center gap-2'>
									<span className=" d-none d-md-inline-block">Отправить</span>
									<span className="material-symbols-outlined">send</span>
								</span>
							}
						</BtnForm>
					)
					:
					(
						(attempts && attempts > 0)
							?
							(
								<BtnForm
									type='submit'
									clazz='filled'
									disabled={spinner}
									custom='sendBtn'
								>
									{spinner
										?
										<SpinnerBtn
											text='Думаю ...'
										/>
										:
										<span className=' d-flex align-items-center gap-2'>
											<span className='attempts d-none d-md-flex'>{attempts}</span>
											<span className=" d-none d-md-inline-block">Отправить</span>
											<span className="material-symbols-outlined">send</span>
										</span>
									}
								</BtnForm>
							)
							:
							(
								<BtnForm
									type='submit'
									clazz='filled'
									disabled={spinner}
									custom='sendBtn'
								>
									{spinner
										?
										<SpinnerBtn />
										:
										<span className=' d-flex align-items-center gap-2'>
											<span className="material-symbols-outlined">add</span>
											<span className=" d-none d-md-inline-block">Добавить попытки</span>
										</span>
									}
								</BtnForm>
							)
					)
				}
			</form>
			{error && <ToastError error={true}>{error}</ToastError>}
			<Modal isOpen={isOpen} onClose={() => setIsOpen(false)} pdfUrl={pdfUrl} />
		</div>
	)
}

export default Dashboard
