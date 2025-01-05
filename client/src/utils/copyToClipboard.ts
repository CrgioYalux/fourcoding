export default function copyToClipboard(text: string): Promise<void> {
	if (navigator.clipboard && navigator.clipboard.writeText) {
		return navigator.clipboard.writeText(text);
	}

	return fallbackCopyToClipboard(text);
}

function fallbackCopyToClipboard(text: string): Promise<void> {
	return new Promise((resolve, reject) => {
		const textArea = document.createElement('textarea');
		textArea.value = text;

		textArea.style.position = 'fixed';
		textArea.style.left = '-9999px';

		document.body.appendChild(textArea);
		textArea.focus();
		textArea.select();

		try {
			document.execCommand('copy');
			resolve();
		} catch (err) {
			reject({ error: 'Could not copy to clipboard: ' + err });
		} finally {
			document.body.removeChild(textArea);
		}
	});
}
