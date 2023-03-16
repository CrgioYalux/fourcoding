import Logs from "./Logs";
import ConnectionStatus from "./ConnectionStatus";
import { useSocketContext } from '../../providers/Socket';

const SocketInfo: React.FC<{}> = () => {
    const { state } = useSocketContext();
    
    return (
        <div>
            <ConnectionStatus />
            <Logs />
            {JSON.stringify(state.room, null, 2)}
        </div>
    );
};

export default SocketInfo;
