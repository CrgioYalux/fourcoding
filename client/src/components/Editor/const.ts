const JS: string = `function main() {
    const bar = document.getElementById('bar');
    let counter = 0;

    const interval = setInterval(() => {
        if (bar) {
            bar.style.width = \`\$\{counter\}ch\`;

            counter++;

            if (counter === 8) {
                counter = 0;
            }
        }
    }, 500);
}

main();
`;

const HTML: string = `<div>
    <strong>loading</strong>
    <div id='bar'></div>
</div>`;

const CSS: string = `*, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    min-height: 100vh;
    display: grid;
    place-items: center;

    background-color: hsl(260, 50%, 15%);
    color: hsl(260, 50%, 90%);

    font-family: Arial, sans-serif;
    font-size: 22px;
    line-height: 1.4;
    letter-spacing: 1px;
}

body > div {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 8ch;
}

#bar {
    color: inherit;
    background-color: currentColor;
    height: 5px;
    border-radius: 999px;

    transition: width .25s;
}

`;

const DEFAULT = {
	HTML,
	CSS,
	JS,
};

export default DEFAULT;
