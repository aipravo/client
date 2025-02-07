import { usePathname, useRouter } from 'next/navigation';
import type { FC, HTMLAttributes, ReactNode } from 'react';

interface TitleH1Props extends HTMLAttributes<HTMLHeadingElement> {
	span?: string
	children: ReactNode
}

const TitleH1: FC<TitleH1Props> = ({ span, children, className, ...props }) => {

	const path = usePathname()

	const router = useRouter()

	const handleClick = () => {

		if (path.startsWith('/dashboard/')) {
			router.push('/dashboard');
		} else if (path.startsWith('/admin/')) {
			router.push('/admin');
		}
	}

	return (
		<h1
			{...props}
			className={`home_title text-uppercase m-0  text-center ${className}`}
			onClick={handleClick}
			style={{ cursor: path === '/dashboard/' || '/admin/' ? 'pointer' : 'default', ...props.style }}
		>
			{children}
			<span>{span}</span>
		</h1>
	);
}

export default TitleH1;
