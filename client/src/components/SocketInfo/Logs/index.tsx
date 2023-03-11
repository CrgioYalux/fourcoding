import { useSocketContext } from "../../../providers/Socket";

const Logs: React.FC<{}> = () => {
    const { logs } = useSocketContext();

    return (
        <ul className='Logs'>
        {logs.map((msg, i) => <li key={`${i}-${[...msg].filter(c => c === ' ').join('')}`.toUpperCase()}>{msg}</li>)}
        </ul>
    );
};

export default Logs;
