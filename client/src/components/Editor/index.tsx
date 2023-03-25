import { useState } from 'react';
import DEFAULT from './const';

import EditorTextarea from "./EditorTextarea";
import Preview from "./Preview";

import './Editor.css';

interface EditorProps {};

const Editor: React.FC<EditorProps> = () => {
    const [HTML, setHTML] = useState<string>(DEFAULT.HTML);
    const [CSS, setCSS] = useState<string>(DEFAULT.CSS);
    const [JS, setJS] = useState<string>(DEFAULT.JS);

    return (
        <div className='Editor'>
            <EditorTextarea editing='HTML' value={HTML} setValue={setHTML} />
            <EditorTextarea editing='CSS' value={CSS} setValue={setCSS} />
            <EditorTextarea editing='JS' value={JS} setValue={setJS} />
            <Preview JS={JS} HTML={HTML} CSS={CSS} />
        </div>
    );
};

export default Editor;
