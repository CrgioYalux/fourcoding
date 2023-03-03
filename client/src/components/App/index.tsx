import './App.css';
import Loader from '../Loader';
import ProviderWrapper from '../ProviderWrapper';

function App() {
    return (
        <ProviderWrapper>
            <div className='App'>
                  <strong>nothing to see here - yet</strong>
                  <Loader />
            </div>
        </ProviderWrapper>
    )
}

export default App;
