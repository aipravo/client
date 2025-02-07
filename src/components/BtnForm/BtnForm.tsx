import type { FC } from 'react';
import styled from './BtnForm.module.css'

interface BtnFormProps {
	type: 'submit' | 'reset' | 'button'
	clazz: 'filled' | 'outlined'
	children: React.ReactNode
	disabled: boolean
	custom?: string
	onClick?: () => void
}

const BtnForm: FC<BtnFormProps> = ({ type, clazz, children, disabled, custom, onClick }) => {
	return (
		<button
			type={type}
			className={`${styled[clazz]} ${disabled ? styled.disabled : ''} ${custom}`}
			disabled={disabled}
			onClick={onClick}
		>
			{children}
		</button>
	);
}

export default BtnForm;
