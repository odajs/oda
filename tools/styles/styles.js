const STYLES = ODA.regTool('styles');
STYLES.path = import.meta.url.split('/').slice(0,-1).join('/');
const style = document.createElement('style');
style.textContent = /*css*/`
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}
::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);

}
::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: var(--body-background);
   -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5);
}
::-webkit-scrollbar-thumb:hover {
    @apply --dark;
    width: 16px;
}

:root{
    --font-family: Roboto, Noto, sans-serif;
    --bar-background: white;
    --stroke-color: transparent;
    --content-background: white;
    --content-color: black;
    --header-color: black;
    --border-color: darkgray;
    --border-radius: 0px;

    --body-background: transparent;
    --body-color: #555555;
    --header-background: silver;


    --section-background: lightgrey;
    --section-color: black;

    --layout-background: whitesmoke;
    --layout-color: black;

    --content:{
        background-color: var(--content-background, white);
        color: var(--content-color, black);
        fill: var(--content-color, black);
    };
    --font-150:{
        font-size: 150%;
    };
    --boxed: {
        border: 1px solid darkgray;
        margin: 4px;
        padding: 4px;
    };
    --horizontal: {
        display: flex;
        flex-direction: row;
    };
    --horizontal-center:{
        @apply --horizontal;
        align-items: center;
    };
    --h:{
        @apply --horizontal;
    };
    --horizontal-end:{
        @apply --horizontal;
        justify-content: flex-end;
    };
    --bold:{
        font-weight: bold;
    };
    --between:{
        justify-content: space-between;
    };
    --flex:{
        flex: 1;
        flex-basis: auto;
    };

    --no-flex: {
        flex-grow: 0;
        flex-shrink: 0;
        flex-basis: auto;
    };
    --bar:{
        @apply --horizontal;
    };
    --center:{
        justify-content: center;
        align-self: center;
        align-content: center;
        align-items: center;
    };
    --vertical: {
        display: flex;
        flex-direction: column;
    };
    --border:{
        border: 1px solid;
    };

    --toolbar:{
        @apply --horizontal;
        align-items: center;
    };
    --header: {
        background: var(--header-background);
        color: var(--header-color);
        fill: var(--header-color);
    };
    --heading: {
        @apply --horizontal;
        align-items: center;
        justify-content: space-between;
        background-color: var(--content-color) !important;
        color: var(--content-background) !important;
        fill: var(--content-background) !important;
    };
    --layout: {
        background: var(--layout-background);
        color: var(--layout-color);
        fill: var(--layout-color);
    };
    --footer: {
        @apply --header;
    };
    --border: {
        border: 1px solid var(--border-color, black);
        border-radius: var(--border-radius);
    };
    --border-left: {
        border-left: 1px solid var(--border-color, black);
    };
    --border-top: {
        border-top: 1px solid var(--border-color, black);
    };
    --border-right: {
        border-right: 1px solid var(--border-color, black);
    };
    --border-bottom: {
        border-bottom: 1px solid var(--border-color, black);
    };
    --label: {
        white-space: nowrap;
        align-content: center;
        text-overflow: ellipsis;
        font-family: var(--font-family);
        overflow: hidden;
    };

    --cover:{
        position: fixed;
        left: 0px;
        top: 0px;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,.1);
        z-index: 1000;
    };
    --user-select:{
        user-select: text !important;
    }

}
html {
    touch-action: manipulation;
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    height: 100%;
    --my-variable: 100px;
}
::part{
    min-width: 0px;
}
::part(error){
    position: relative;
    overflow: visible;
    min-height: 20px;
    min-width: 20px;
}
::part(error):before{
    content: '';
    position: absolute;
    top: 0px;
    left: 0px;
    width: 0px;
    height: 0px;
    border: 4px solid transparent;
    border-left: 4px solid red;
    border-top: 4px solid red;
}
body{
    display: flex;
    flex: 1;
    animation: fadeIn .5s;
    flex-direction: column;
    font-family: var(--font-family);
    user-select: none;
    margin: 0px;
    padding: 0px;
    height: 100%;
    overscroll-behavior: contain;
}
[hidden]{
    display: none !important;
}
:root {
    --box-shadow: 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12), 0 5px 5px -3px rgba(0, 0, 0, 0.2);
    --shadow: {
        box-shadow: var(--box-shadow);
    };

    --shadow-transition: {
        transition: box-shadow 0.28s cubic-bezier(0.4, 0, 0.2, 1);
    };

    --text-shadow: {
        text-shadow: 0 1px 1px var(--header-background, gray);
    };

    --text-shadow-black: {
        text-shadow: 0 1px 1px black;
    };
    --raised:{
        box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
    };
}
body[context-menu-show] *:not(oda-context-menu){
    pointer-events: none;
}

:root {
    --accent-color: blue;
    --success-color: green;
    --error-color: red;
    --error-background: yellow;
    --info-color: blueviolet;
    --warning-color: orange;
    --disabled-color: silver;
    --invert:{
        filter: invert(1);
    };
    --error: {
        color: var(--error-color);
        border-color: var(--error-color) !important;
        fill: var(--error-color) !important;
        background-color: var(--error-background);

    };
    --error-before: {
        content: attr(error);
        background-image: url("/web/oda/tools/styles/error.png");
        background-size: contain;
        background-repeat: no-repeat;
        position: absolute;
        top: -6px;
        left: 6px;
        pointer-events: none;
        @apply --raised;
        @apply --error;
        @apply --content;
        font-size: xx-small;
        padding: 2px 2px 2px 16px;
        z-index: 1;
        @apply --border;
        border-radius: 6px;
        min-height: 10px;
    };
    --error-invert: {
        background-color: var(--error-color) !important;
        fill: white !important;
        color: white !important;
    };

    --accent: {
        color: var(--accent-color) !important;
        fill: var(--accent-color) !important;
        border-color: var(--accent-color) !important;
    };
    --accent-invert: {
        background-color: var(--accent-color) !important;
        fill: white !important;
        color: white !important;
    };

    --success: {
        color: var(--success-color) !important;
        fill: var(--success-color) !important;
        border-color: var(--success-color) !important;
    };
    --success-invert: {
        background-color: var(--success-color) !important;
        fill: white !important;
        color: white !important;
    };

    --info: {
        color: var(--info-color) !important;
        fill: var(--info-color) !important;
        border-color: var(--info-color) !important;
    };
    --info-invert: {
        background-color: var(--info-color) !important;
        fill: white !important;
        color: white !important;
    };

    --warning: {
        color: var(--warning-color)  !important;
        fill: var(--warning-color) !important;
        border-color: var(--warning-color) !important;
    };

    --warning-invert: {
        background-color: var(--warning-color) !important;
        fill: white !important;
        color: white !important;
    };
    --help: {
    };
    --help-after: {
        content: attr(help);
        background-image: url("/web/oda/tools/styles/help.png");
        background-size: contain;
        background-repeat: no-repeat;
        position: absolute;
        top: -6px;
        left: 6px;
        pointer-events: none;
        @apply --raised;
        @apply --error;
        @apply --content;
        font-size: xx-small;
        padding: 2px 2px 2px 16px;
        z-index: 1;
        @apply --border;
        border-radius: 6px;
        min-height: 10px;
    };
}
:root{
    --focused-color: blue;
    --selected-color: navy;
    --selected-background: silver;
    --dark-color: white;
    --dark-background: gray;
    --dark: {
        color: var(--dark-color) !important;
        fill: var(--dark-color) !important;
        background-color: var(--dark-background) !important;
    };

    --active: {
        color: var(--selected-color) !important;
        fill: var(--selected-color) !important;
        background-color: var(--selected-background) !important;
    };
    --selected: {
        color: var(--selected-color) !important;
        fill: var(--selected-color) !important;
        filter: brightness(0.8) contrast(1.2);
    };
    --focused:{
        box-shadow: inset 0 -2px 0 0  var(--focused-color) !important;
    };
    --dimmed: {
        opacity: 0.4;
        filter: grayscale(80%);
    };
    --disabled: {
        @apply --dimmed;
        cursor: default !important;
        user-focus: none;
        user-focus-key: none;
        user-select: none;
        user-input: none;
        pointer-events: none;
    };
}
@keyframes blinker {
    100% {
        opacity: 0;
    }
}
@-webkit-keyframes blinker {
    100% {
        opacity: 0;
    }
}

@keyframes zoom-in {
    from {transform:scale(0)}
    to {transform:scale(1)}
}
@keyframes zoom-out {
    from {transform:scale(1)}
    to {transform:scale(0)}
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@-moz-keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes fadeOut {
    from {
        opacity: 1;
    }
    to {
        opacity: 0;
    }
}

@-moz-keyframes fadeOut {
    from {
        opacity: 1;
    }
    to {
        opacity: 0;
    }
}

`;
document.head.appendChild(style);

//console.log('styles is loaded.');

const style2 = document.createElement('style');
style2.setAttribute('scope', 'oda-styles');
style2.textContent = '::-webkit-scrollbar {\n    width: 8px;\n    height: 8px;\n}\n::-webkit-scrollbar-track {\n    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);\n\n}\n::-webkit-scrollbar-thumb {\n    border-radius: 10px;\n    background: var(--body-background);\n   -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5);\n}\n::-webkit-scrollbar-thumb:hover {\n    @apply --dark;\n    width: 16px;\n}';
for (const key in ODA.cssRules) {
    const rule = ODA.cssRules[key];
    if (rule.includes(';')) {
        style2.textContent += `${key.replace(/^--/, '.')}{\n     ${rule.replace(/;/g, ';\n    ')}}\n`.replace(/    \}/g, '}');
        style2.textContent += `[${key.replace(/^--/, '')}]{\n     ${rule.replace(/;/g, ';\n    ')}}\n`.replace(/    \}/g, '}');
    }
}
import './adoptedStyleSheets.js'; // https://github.com/calebdwilliams/construct-style-sheets
if ('adoptedStyleSheets' in Document.prototype) {
    let _styleSheet = new CSSStyleSheet();
    _styleSheet.replaceSync(style2.textContent);
    ODA.adopted = [_styleSheet];
}

document.head.appendChild(style2);

export default STYLES;
