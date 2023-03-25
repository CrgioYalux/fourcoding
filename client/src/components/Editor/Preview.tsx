import { useRef, useEffect } from 'react';

import './Editor.css';

interface PreviewProps {
    JS?: string;
    HTML?: string;
    CSS?: string;
};

function createPreview(JS: string, HTML: string, CSS: string): string {
    return `<html><body>${HTML}<script>${JS}</script><style>${CSS}</style></body></html>`;
}

const Preview: React.FC<PreviewProps> = ({ JS = '', HTML = '', CSS = '' }) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        if (iframeRef.current) {
            const preview = createPreview(JS, HTML, CSS);
            iframeRef.current.srcdoc = preview;
        }
    }, [JS, HTML, CSS]);

    return (
        <iframe
            ref={iframeRef}
            title='preview'
            id='preview_root'
            className='Preview'
        >
        </iframe>
    );
};

export default Preview;
