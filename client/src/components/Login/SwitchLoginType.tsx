interface SwitchLoginTypeProps {
	label: string;
	checked: boolean;
	switchChecked: () => void;
}

const SwitchLoginType: React.FC<SwitchLoginTypeProps> = ({
	label,
	checked,
	switchChecked,
}) => {
	return (
		<label htmlFor="login_type" className="SwitchLoginType">
			<input
				type="checkbox"
				id="login_type"
				name="login_type"
				checked={checked}
				onChange={() => {}}
			/>
			<div className="SwitchLoginTypeBT">
				<span>{label}</span>
				<button type="button" onClick={switchChecked}>
					<span className="SwitchLoginTypeBT__button_part"></span>
				</button>
			</div>
		</label>
	);
};

export default SwitchLoginType;
