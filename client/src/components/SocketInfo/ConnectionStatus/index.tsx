import { useSocketContext } from "../../../providers/Socket";

const style: React.CSSProperties = {
    width: 50,
    height: 50,
    aspectRatio: 1,
    borderRadius: '50%',
};

const ConnectionStatus: React.FC<{}> = ({}) => {
    const { state } = useSocketContext();

    return (
        <div
        style={{...style, backgroundColor: state.connected ? 'green' : 'red' }}
        >connected: {state.connected ? 'yes' : 'no'}</div>
    );
};

export default ConnectionStatus;
