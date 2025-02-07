import type { FC } from 'react';
import Link from 'next/link';
import styled from './LinkBtn.module.css'

interface LinkBtnProps {
	href: string
	clazz: 'filled' | 'outlined'
	children: React.ReactNode
	disabled: boolean
	onClick?: () => void;
}

const LinkBtn: FC<LinkBtnProps> = ({ href, clazz, children, disabled, onClick }) => {
	return (
		<Link
			href={disabled ? `#` : href}
			className={`${styled[clazz]} ${disabled ? styled.disabled : ''}`}
			aria-disabled={disabled}
			onClick={onClick}
		>
			{children}
		</Link>
	);
}

export default LinkBtn;
