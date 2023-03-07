import { useSocketContext } from '../../providers/Socket';

import Loader from '../Loader';
import ProviderWrapper from '../ProviderWrapper';

import './App.css';

const style: React.CSSProperties = {
    width: 50,
    height: 50,
    aspectRatio: 1,
    borderRadius: '50%',
};

function App() {
    const { connected, logs } = useSocketContext();

    return (
        <ProviderWrapper>
            <div className='App'>
                  <strong>nothing to see here - yet</strong>
                  <Loader />
                  <div
                    style={{...style, backgroundColor: connected ? 'green' : 'red' }}
                  >connected: {connected ? 'yes' : 'no'}</div>
                  <ul>{logs.map((m) => <li>{m}</li>)}</ul>
            </div>
        </ProviderWrapper>
    )
}

export default App;
