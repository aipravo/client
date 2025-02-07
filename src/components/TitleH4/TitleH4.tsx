import type { FC, ReactNode } from 'react';

interface TitleH4Props {
	children: ReactNode
}

const TitleH4: FC<TitleH4Props> = ({ children }) => {
	return (
		<h4 className='home_subtitle text-center'>{children}</h4>
	);
}

export default TitleH4;
