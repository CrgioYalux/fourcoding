import { useSocketContext } from "../../../providers/Socket";

const Logs: React.FC<{}> = () => {
    const { state } = useSocketContext();

    return (
        <ul className='Logs'>
        {state.logs.map((msg, i) => <li key={`${i}-${[...msg].filter(c => c === ' ').join('')}`.toUpperCase()}>{msg}</li>)}
        </ul>
    );
};

export default Logs;
