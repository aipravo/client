import Image from 'next/image'
import logo from '../../../public/logo.svg'
import { FC } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface LogoProps {
	width: number
	height: number
	alt: string
}

const Logo: FC<LogoProps> = ({ width, height, alt }) => {

	const router = useRouter()
	const path = usePathname()

	const handleClick = () => {
		if (path.startsWith('/dashboard/')) {
			router.push('/dashboard');
		} else if (path.startsWith('/admin/')) {
			router.push('/admin');
		}
	}

	return (
		<Image
			rel='preload'
			src={logo}
			alt={alt}
			width={width}
			height={height}
			priority={true}
			onClick={handleClick}
			style={{ cursor: path === '/dashboard/' || '/admin/' ? 'pointer' : 'default' }}
		/>);
}

export default Logo;
