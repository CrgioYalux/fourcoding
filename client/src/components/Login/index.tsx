import { useEffect, useState } from 'react';

import Input from '../Generics/Input';

import { useSocketContext } from '../../providers/Socket/';

import './Login.css';

const Login: React.FC<{}> = () => {
	const [loginType, setLoginType] = useState<'join-room' | 'create-room'>(
		'create-room'
	);
	const { state, actions } = useSocketContext();
	const [lastLog, setLastLog] = useState<string>('');

	useEffect(() => {
		setLastLog(state.logs[state.logs.length - 1]);
	}, [state.logs.length]);

	const handleSubmit = (event: React.SyntheticEvent): void => {
		event.preventDefault();

		const form = event.target as HTMLFormElement & {
			username_input: HTMLInputElement;
			password_input: HTMLInputElement;
			roomID_input?: HTMLInputElement;
		};

		if (loginType === 'join-room') {
			if (!form.roomID_input?.value) return;

			const data = {
				roomID: form.roomID_input.value,
				username: !form.username_input.value
					? undefined
					: form.username_input.value,
				password: !form.password_input.value
					? undefined
					: form.password_input.value,
			};

			actions.joinRoom(data);
		} else {
			const data = {
				username: !form.username_input.value
					? undefined
					: form.username_input.value,
				password: !form.password_input.value
					? undefined
					: form.password_input.value,
			};

			actions.createRoom(data);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="Login">
			<div className="Login__header_options">
				<button
					type="button"
					className={loginType === 'join-room' ? '' : '--active'}
					onClick={() => {
						setLoginType('create-room');
						setLastLog('');
					}}
				>
					Create Room
				</button>
				<span>or</span>
				<button
					type="button"
					className={loginType === 'join-room' ? '--active' : ''}
					onClick={() => {
						setLoginType('join-room');
						setLastLog('');
					}}
				>
					Join Room
				</button>
			</div>
			<div className="Login__inputs_box">
				<Input
					type="text"
					name="username_input"
					label="nickname"
					htmlFor="username_input"
					className="Login__Input"
				/>
				<Input
					type="password"
					name="password_input"
					label="room password"
					htmlFor="password_input"
					className="Login__Input"
				/>
				{loginType === 'join-room' && (
					<Input
						type="text"
						name="roomID_input"
						label="room ID"
						htmlFor="roomID_input"
						className="Login__Input"
						required={true}
					/>
				)}
			</div>
			<div className="Login__submit_state">
				<strong>{lastLog}</strong>
				<button type="submit">{loginType.split('-')[0]}</button>
			</div>
		</form>
	);
};

export default Login;
