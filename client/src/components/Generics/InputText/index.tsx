interface InputTextProps {
	name: string;
	label: string;
	htmlFor: string;
	placeholder?: string;
	required?: boolean;
	className?: string;
}

const InputText: React.FC<InputTextProps> = ({
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

export default InputText;
