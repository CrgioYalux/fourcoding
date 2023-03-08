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

const WhereContextExists: React.FC<{}> = () => {
    const { connected, logs, room } = useSocketContext();
    return (
        <div className='WhereContextExists'>
            <div
            style={{...style, backgroundColor: connected ? 'green' : 'red' }}
            >connected: {connected ? 'yes' : 'no'}</div>
            <ul>{logs.map((m, i) => <li key={`${i}-${[...m].filter((c) => c === ' ').join('').toUpperCase()}`}>{m}</li>)}</ul>
            <pre>{JSON.stringify(room, null, 2)}</pre>
        </div>
    );
};

function App() {
    return (
        <ProviderWrapper>
            <div className='App'>
                <strong>nothing to see here - yet</strong>
                <Loader />
                <WhereContextExists />
            </div>
        </ProviderWrapper>
    )
}

export default App;
