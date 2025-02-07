import Link from 'next/link';
import type { FC, ReactNode } from 'react';

interface LinkMainProps {
	href: string
	children: ReactNode
}

const LinkMain: FC<LinkMainProps> = ({ href, children }) => {
	return (

		<Link
			href={href}
			className='main_link'
		>
			{children}
		</Link>
	);
}

export default LinkMain;
