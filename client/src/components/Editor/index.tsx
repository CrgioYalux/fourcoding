import { useState, useEffect } from 'react';
import { useSocketContext } from '../../providers/Socket';

import EditorTextarea from './EditorTextarea';
import Preview from './Preview';

import DEFAULT from './const';

import './Editor.css';
import CopyToClipboardIcon from '../Icons/CopyToClipboard';
import copyToClipboard from '../../utils/copyToClipboard';

interface EditorProps {}

const Editor: React.FC<EditorProps> = () => {
	const { state, actions } = useSocketContext();

	const [HTML, setHTML] = useState<string>(() => {
		if (state.isClientCreator) return DEFAULT.HTML;
		return '';
	});
	const [CSS, setCSS] = useState<string>(() => {
		if (state.isClientCreator) return DEFAULT.CSS;
		return '';
	});
	const [JS, setJS] = useState<string>(() => {
		if (state.isClientCreator) return DEFAULT.JS;
		return '';
	});

	useEffect(() => {
		actions.getFullEditor();
	}, []);

	useEffect(() => {
		if (!state.socket) return;

		state.socket.on('get-full-editor', () => {
			actions.sendFullEditor({ html: HTML, css: CSS, js: JS });
		});
		state.socket.on('send-full-editor', (data) => {
			setHTML(data.html);
			setCSS(data.css);
			setJS(data.js);
		});
		state.socket.on('send-html-editor', (data) => {
			setHTML(data.html);
		});
		state.socket.on('send-css-editor', (data) => {
			setCSS(data.css);
		});
		state.socket.on('send-js-editor', (data) => {
			setJS(data.js);
		});

		return () => {
			if (!state.socket) return;

			state.socket.off('get-full-editor');
			state.socket.off('send-full-editor');
			state.socket.off('send-html-editor');
			state.socket.off('send-css-editor');
			state.socket.off('send-js-editor');
		};
	});

	return (
		<div className="Editor__container">
			<div className="Editor__header">
				<div className="Editor-header__room-id">
					<small className="Editor-room-id__label">
						{`Room ID: ${state.room?.ID}`}
					</small>
					<button
						type="button"
						className="Editor-room-id__copy-to-clipboard"
						onClick={() => {
							if (!state.room?.ID) return;
							copyToClipboard(state.room.ID);
						}}
					>
						<CopyToClipboardIcon className="Editor-copy-to-clipboard__icon" />
					</button>
				</div>
				<small className="Editor-header__room_participants">
					{`Team: ${state.room?.participants.filter((p) => p !== null).join(' - ')}`}
				</small>
			</div>
			<div className="Editor">
				<EditorTextarea
					editing="HTML"
					value={HTML}
					onChange={(event) => {
						setHTML(event.target.value);
						actions.sendHTMLEditor({ html: event.target.value });
					}}
				/>
				<EditorTextarea
					editing="CSS"
					value={CSS}
					onChange={(event) => {
						setCSS(event.target.value);
						actions.sendCSSEditor({ css: event.target.value });
					}}
				/>
				<EditorTextarea
					editing="JS"
					value={JS}
					onChange={(event) => {
						setJS(event.target.value);
						actions.sendJSEditor({ js: event.target.value });
					}}
				/>
				<Preview JS={JS} HTML={HTML} CSS={CSS} />
			</div>
		</div>
	);
};

export default Editor;
