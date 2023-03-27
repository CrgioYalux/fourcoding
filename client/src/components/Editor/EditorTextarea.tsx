import './Editor.css';

interface EditorTextareaProps {
    editing: 'JS' | 'HTML' | 'CSS';
    value: string;
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

const EditorTextarea: React.FC<EditorTextareaProps> = ({ editing, value, onChange }) => {
    return (
        <div className={`EditorTextarea --editing-${editing}`}>
            <div className='EditorTextArea__corner'></div>
            <div className='EditorTextArea__corner'></div>
            <div className='EditorTextArea__corner'></div>
            <div className='EditorTextArea__corner'></div>
            <span>{editing}</span>
            <textarea 
                value={value}
                onChange={onChange}
                spellCheck={false}
            >
            </textarea>
        </div>
    );
};

export default EditorTextarea;
