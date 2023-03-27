import { useEffect, useState } from "react";

import SwitchLoginType from "./SwitchLoginType";
import InputText from "../Generics/InputText";

import { useSocketContext } from '../../providers/Socket/';

import './Login.css';

const Login: React.FC<{}> = () => {
    const [loginType, setLoginType] = useState<'join-room'|'create-room'>('create-room');
    const { state, actions } = useSocketContext();
    const [lastLog, setLastLog] = useState<string>('');

    useEffect(() => {
        setLastLog(state.logs[state.logs.length - 1]);
    }, [state.logs.length]);

    const switchLoginType = (): void => {
        setLoginType((prev) => prev === 'join-room' ? 'create-room' : 'join-room');
        setLastLog('');
    };

    const handleSubmit = (event: React.SyntheticEvent): void => {
        event.preventDefault();

        const form = event.target as HTMLFormElement & {
            username_input: HTMLInputElement,
            password_input: HTMLInputElement,
            roomID_input?: HTMLInputElement,
        };

        if (loginType === 'join-room') {
            if (!form.roomID_input?.value) return;

            const data = {
                roomID: form.roomID_input.value,
                username: !form.username_input.value ? undefined : form.username_input.value,
                password: !form.password_input.value ? undefined : form.password_input.value,
            };

            actions.joinRoom(data);
        }
        else {
            const data = {
                username: !form.username_input.value ? undefined : form.username_input.value,
                password: !form.password_input.value ? undefined : form.password_input.value,
            };

            actions.createRoom(data);
        }
    };

    return (
        <form onSubmit={handleSubmit} className='Login'>
            <SwitchLoginType label={loginType.split('-').join(' ')} checked={loginType === 'create-room'} switchChecked={switchLoginType} />
            <div className='Login__inputs_box'>
                <InputText name='username_input' label='username' htmlFor='username_input' className={'InputText'} />
                <InputText name='password_input' label='password' htmlFor='password_input' className={'InputText'} />
                {loginType === 'join-room' && <InputText name='roomID_input' label='room ID' htmlFor='roomID_input' required={true} className={'InputText'} />}
            </div>
            <input type='submit' value={loginType.split('-')[0]}/>
            <strong>{lastLog}</strong>
        </form>
    );
};

export default Login;
