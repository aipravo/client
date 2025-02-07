import { useAdmin } from '@/context/AdminContext'
import { HTMLAttributes, type FC } from 'react'

const BurgerAdmin: FC<HTMLAttributes<HTMLDivElement>> = (props) => {

	const { menu, setMenu } = useAdmin()


	return (
		<div
			{...props}
			className="burger d-flex d-md-none justify-content-center align-items-center"
			onClick={() => setMenu(!menu)}
		>
			<span className="material-symbols-outlined">
				{menu ? 'close' : 'menu'}
			</span>
		</div>
	)
}

export default BurgerAdmin
