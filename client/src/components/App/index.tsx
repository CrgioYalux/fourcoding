import Loader from '../Loader';
import Login from '../Login';
import TimedRender from '../TimedRender';
import Editor from '../Editor';

import { useSocketContext } from '../../providers/Socket';

import './App.css';

function NothingToSeeHere_Yet() {
    return (
        <div className='NothingToSeeHere_Yet'>
            <strong>nothing to see here - yet</strong>
            <Loader />
        </div>
    );
}

function App() {
    const { state } = useSocketContext();

    return (
        <div className='App'>
            {
                !state.room
                ? <Login />
                : 
                <>
                    <TimedRender mode='for' seconds={2}>
                        <Loader />
                    </TimedRender>
                    <TimedRender mode='after' seconds={2}>
                        <Editor />
                    </TimedRender>
                </>
            }
        </div>
    );
}

export default App;
