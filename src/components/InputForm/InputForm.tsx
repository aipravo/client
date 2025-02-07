import { useState, type FC } from 'react';

interface InputFormProps {
	type: 'text' | 'password' | 'email' | 'number' | 'hidden';
	name: string;
	value: string | number | readonly string[];
	placeholder?: string
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
	disabled: boolean
	onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
	anotherPlaceholder?: string;
	clazz?: string;
}

const InputForm: FC<InputFormProps> = ({ type, name, value, onChange, placeholder, disabled, onKeyDown, anotherPlaceholder, clazz }) => {
	const [showPassword, setShowPassword] = useState<boolean>(false);

	return (
		<div className={`input_wrap ${clazz}`}>
			<input
				type={type === 'password' && showPassword ? 'text' : type}
				name={name}
				value={value}
				placeholder={anotherPlaceholder ? anotherPlaceholder : `Введите ${placeholder}`}
				className={`form_input form-control `}
				onChange={onChange}
				disabled={disabled}
				onKeyDown={onKeyDown}
				required
			/>
			{(type === 'password' && value) && (
				<span
					className="material-symbols-outlined"
					onClick={() => setShowPassword(!showPassword)}
				>
					{showPassword ? 'visibility_off' : 'visibility'}
				</span>
			)}
		</div>
	);
}

export default InputForm;
