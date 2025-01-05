import { useState } from 'react';

interface InputProps {
	name: string;
	label: string;
	htmlFor: string;
	placeholder?: string;
	required?: boolean;
	className?: string;
	type?: 'text' | 'password';
}

const PasswordInput: React.FC<Omit<InputProps, 'type'>> = ({
	name,
	label,
	htmlFor,
	placeholder,
	required,
	className,
}) => {
	const [isVisible, setIsVisible] = useState<boolean>(false);

	return (
		<label htmlFor={htmlFor} className={className}>
			<span>{label}</span>
			<input
				type={isVisible ? 'text' : 'password'}
				id={htmlFor}
				name={name}
				placeholder={placeholder}
				required={required}
			/>
			<button
				type="button"
				onClick={() => {
					setIsVisible((prev) => !prev);
				}}
			>
				{isVisible ? 'hide' : 'show'}
			</button>
		</label>
	);
};

const TextInput: React.FC<Omit<InputProps, 'type'>> = ({
	name,
	label,
	htmlFor,
	placeholder,
	required,
	className,
}) => {
	return (
		<label htmlFor={htmlFor} className={className}>
			<span>{label}</span>
			<input
				type="text"
				id={htmlFor}
				name={name}
				placeholder={placeholder}
				required={required}
			/>
		</label>
	);
};

const Input: React.FC<InputProps> = ({ type = 'text', ...rest }) => {
	if (type === 'text') return <TextInput {...rest} />;
	return <PasswordInput {...rest} />;
};

export default Input;
