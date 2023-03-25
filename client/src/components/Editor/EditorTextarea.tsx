import './Editor.css';

interface EditorTextareaProps {
    editing: 'JS' | 'HTML' | 'CSS';
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
};

const EditorTextarea: React.FC<EditorTextareaProps> = ({ editing, value, setValue }) => {
    return (
        <div className={`EditorTextarea --editing-${editing}`}>
            <div className='EditorTextArea__corner'></div>
            <div className='EditorTextArea__corner'></div>
            <div className='EditorTextArea__corner'></div>
            <div className='EditorTextArea__corner'></div>
            <span>{editing}</span>
            <textarea 
                value={value}
                onChange={(event) => setValue(event.target.value)}
                spellCheck={false}
            >
            </textarea>
        </div>
    );
};

export default EditorTextarea;
