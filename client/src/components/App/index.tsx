import Loader from '../Loader';
import ProviderWrapper from '../ProviderWrapper';
import Login from '../Login';
import TimedRender from '../TimedRender';
import Editor from '../Editor';

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
    return (
        <ProviderWrapper>
            <div className='App'>
            {/*
                <TimedRender mode='for' seconds={2}>
                    <Loader />
                </TimedRender>
                <TimedRender mode='after' seconds={2}>
                    <Login />
                </TimedRender>
            */}
                <Editor />
            </div>
        </ProviderWrapper>
    );
}

export default App;
