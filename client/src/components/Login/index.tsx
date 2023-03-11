import { useState } from "react";
import SwitchLoginType from "./SwitchLoginType";
import InputText from "../Generics/InputText";

import './Login.css';

const Login: React.FC<{}> = () => {
    const [loginType, setLoginType] = useState<'join-room'|'create-room'>('create-room');
    
    const switchLoginType = () => {
        setLoginType((prev) => prev === 'join-room' ? 'create-room' : 'join-room');
    };

    return (
        <form className='Login'>
            <SwitchLoginType label={loginType.split('-').join(' ')} checked={loginType === 'create-room'} switchChecked={switchLoginType} />
            <div className='Login__inputs_box'>
                <InputText name='username_input' label='username' htmlFor='username_input' className={'InputText'} />
                <InputText name='password_input' label='password' htmlFor='password_input' className={'InputText'} />
                {loginType === 'join-room' && <InputText name='roomID_input' label='room ID' htmlFor='roomID_input' required={true} className={'InputText'} />}
            </div>
            <input type='submit' value={loginType.split('-')[0]}/>
        </form>
    );
};

export default Login;
