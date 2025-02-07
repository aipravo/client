import type { FC } from 'react';
import { Spinner } from 'react-bootstrap';

interface SpinnerBtnProps {
	text?: string
}

const SpinnerBtn: FC<SpinnerBtnProps> = ({ text = 'Загрузка' }) => {
	return (
		<div className=' d-flex gap-2 align-items-center justify-content-center'>
			<Spinner
				animation="grow"
				size="sm"
			/>
			<span className=' d-none d-md-block'>{text}</span>
		</div>
	);
}

export default SpinnerBtn;
