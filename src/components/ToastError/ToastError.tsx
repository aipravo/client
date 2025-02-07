import { FC, ReactNode, useEffect, useState } from 'react';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import style from './ToastError.module.css'

interface ToastErrorProps {
	children: ReactNode
	error: boolean
}

const ToastError: FC<ToastErrorProps> = ({ children, error = false }) => {
	const [show, setShow] = useState(error);

	useEffect(() => {
		setShow(error);
	}, [error]);

	return (
		<ToastContainer className={`position-fixed ${style.toastError}`}>
			<Toast
				onClose={() => setShow(!show)}
				className='text-bg-danger'
				show={show}
				delay={5000}
				autohide>
				<Toast.Body className=' d-flex align-items-center justify-content-between'>
					<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
						<g clipPath="url(#clip0_1920_393)">
							<path d="M8 12C8.22666 12 8.4168 11.9232 8.5704 11.7696C8.724 11.616 8.80053 11.4261 8.79999 11.2C8.79946 10.9739 8.72266 10.784 8.5696 10.6304C8.41653 10.4768 8.22666 10.4 8 10.4C7.77333 10.4 7.58346 10.4768 7.4304 10.6304C7.27733 10.784 7.20053 10.9739 7.2 11.2C7.19946 11.4261 7.27626 11.6163 7.4304 11.7704C7.58453 11.9245 7.7744 12.0011 8 12ZM7.2 8.8H8.79999V4H7.2V8.8ZM8 16C6.89333 16 5.85333 15.7899 4.88 15.3696C3.90667 14.9493 3.06 14.3795 2.34 13.66C1.62 12.9405 1.05013 12.0939 0.630401 11.12C0.210668 10.1461 0.000534346 9.10613 1.01266e-06 8C-0.00053232 6.89386 0.209601 5.85387 0.630401 4.88C1.0512 3.90613 1.62107 3.05947 2.34 2.34C3.05893 1.62053 3.9056 1.05067 4.88 0.6304C5.8544 0.210133 6.8944 0 8 0C9.10559 0 10.1456 0.210133 11.12 0.6304C12.0944 1.05067 12.9411 1.62053 13.66 2.34C14.3789 3.05947 14.9491 3.90613 15.3704 4.88C15.7917 5.85387 16.0016 6.89386 16 8C15.9984 9.10613 15.7883 10.1461 15.3696 11.12C14.9509 12.0939 14.3811 12.9405 13.66 13.66C12.9389 14.3795 12.0923 14.9496 11.12 15.3704C10.1477 15.7912 9.10773 16.0011 8 16Z" fill="white" />
						</g>
						<defs>
							<clipPath id="clip0_1920_393">
								<rect width="16" height="16" fill="white" />
							</clipPath>
						</defs>
					</svg>
					{children}
				</Toast.Body>
			</Toast>
		</ToastContainer>
	);
}

export default ToastError;
