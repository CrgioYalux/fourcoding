import Loader from '../Loader';
import ProviderWrapper from '../ProviderWrapper';
import SocketInfo from '../SocketInfo';
import Login from '../Login';

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
                <Login />
            </div>
        </ProviderWrapper>
    );
}

export default App;
