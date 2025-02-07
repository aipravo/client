import type { FC } from 'react';
import { Spinner } from 'react-bootstrap';

// interface LoaderProps { }

const Loader: FC = () => {
	return (
		<div className=" loader">
			<Spinner animation="border" variant="secondary" />
		</div>
	);
}

export default Loader;
