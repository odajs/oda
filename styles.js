ODA({
    is: 'oda-style', template: /*html*/`
            <style scope="oda" group="layouts">
            :root{
                --font-family: Roboto, Noto, sans-serif;
                --bar-background: white;
                --stroke-color: transparent;
                --content-background: white;
                --content-color: black;
                --header-color: black;
                --border-color: darkslategray;
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
                };
                --font-150:{
                    font-size: 150%;
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
                --layout: {
                    background: var(--layout-background);
                    color: var(--layout-color);
                    fill: var(--layout-color);
                };
                --footer: {
                    @apply --header;
                };
                --border: {
                    border: 1px solid var(--border-color, darkslategray);
                    border-radius: var(--border-radius);
                };
                --border-left: {
                    border-left: 1px solid var(--border-color, darkslategray);
                };
                --border-top: {
                    border-top: 1px solid var(--border-color, darkslategray);
                };
                --border-right: {
                    border-right: 1px solid var(--border-color, darkslategray);
                };
                --border-bottom: {
                    border-bottom: 1px solid var(--border-color, darkslategray);
                };
                --label: {
                    white-space: nowrap;
                    align-content: center;
                    text-overflow: ellipsis;
                    font-family: var(--font-family);
                    overflow: hidden;
                    padding: 0px 4px;
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
            };
            ::-webkit-scrollbar {
                width: 12px;
                height: 12px;
            }
            ::-webkit-scrollbar-track {
                -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);

            }
            ::-webkit-scrollbar-thumb {
                border-radius: 10px;
                background: var(--body-background);

                -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5);
            }
            html {
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
                background: var(--body-background);
                color: var(--body-color, #555555);
                fill: var(--body-color, #555555);
                stroke: var(--stroke-color, transparent);
            }
            [hidden]{
                display: none !important;
            }

        </style>
        <style scope="oda" group="shadow">
            :root {
                --box-shadow: 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12), 0 5px 5px -3px rgba(0, 0, 0, 0.2);
                --shadow: {
                    box-shadow: var(--box-shadow);
                };

                --shadow-transition: {
                    transition: box-shadow 0.28s cubic-bezier(0.4, 0, 0.2, 1);
                };

                --text-shadow: {
                    text-shadow: 0 1px 1px rgba(255, 255, 255, 0.75);
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
        </style>
        <style scope="oda" group="special">
            :root {
                --success-color: green;
                --error-color: red;
                --info-color: blueviolet;
                --warning-color: orange;
                --invert:{
                    color: var(--layout-background) !important;
                    border-color: var(--layout-background) !important;
                    fill: var(--layout-background) !important;
                    background: var(--layout-color) !important;
                };
                --error: {
                    color: var(--error-color) !important;
                    border-color: var(--error-color) !important;
                    fill: var(--error-color) !important;

                };
                --error-invert: {
                    @apply --invert;
                    background: var(--error-color) !important;
                };

                --success: {
                    color: var(--success-color) !important;
                    fill: var(--success-color) !important;
                    border-color: var(--success-color) !important;
                };
                --success-invert: {
                    @apply --invert;
                    background: var(--success-color) !important;
                };

                --info: {
                    color: var(--info-color) !important;
                    fill: var(--info-color) !important;
                    border-color: var(--info-color) !important;
                };
                --info-invert: {
                    @apply --invert;
                    background: var(--info-color) !important;
                };

                --warning: {
                    color: var(--warning-color)  !important;
                    fill: var(--warning-color) !important;
                    border-color: var(--warning-color) !important;
                };

                --warning-invert: {
                    @apply --invert;
                    background: var(--warning-color) !important;
                };
            }
        </style>
        <style scope="oda" group="effects">
            :root{
                --focused-color: blue;
                --selected-color: navy;
                --selected-background: silver;
                --dark-color: white;
                --dark-background: gray;
                --dark: {
                    color: var(--dark-color) !important;
                    background-color: var(--dark-background) !important;
                };

                --active: {
                    color: var(--selected-color) !important;
                    background-color: var(--selected-background) !important;
                };
                --selected: {
                    color: var(--selected-color) !important;
                    filter: brightness(0.8) contrast(1.2);
                };
                --focused:{
                    box-shadow: inset 0 -2px 0 0  var(--focused-color)!important;
                };
                --disabled: {
                    cursor: default !important;
                    opacity: 0.4;
                    user-focus: none;
                    user-focus-key: none;
                    user-select: none;
                    user-input: none;
                    pointer-events: none;
                    filter: grayscale(80%);
                };
            }
        </style>
        <style scope="oda">
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
        </style>
        <style group="theme"></style>`,
    props: {
        nodes: [],
        theme: {
            default: {},
            freeze: true,
            set(n, o) {
                for (let node of this.nodes)
                    node.textContent = this.convert(node);
                document.querySelector('style[group=theme]').textContent = `\n:root{\n${Object.keys(n).map(key => '\t' + key + ': ' + n[key] + ';\n').join('')}}`;
                let event = new CustomEvent('setTheme', { detail: { value: document.querySelector('style[group=theme]').textContent }, composed: true });
                document.dispatchEvent(event);
            }
        }
    },
    ready() {
        this.elements = Array.from(this.$core.shadowRoot.children);
        const styles = {};
        for (let style of this.elements) {
            document.head.appendChild(style);
            for (let i of style.sheet.cssRules) {
                if (i.style) {
                    for (let key of i.style) {
                        let val = i.style.getPropertyValue(key);
                        if (!/^--/.test(key)) continue;
                        val = val.toString().trim().replace(/^{|}$/g, '').trim().split(';').join(';');
                        styles[key] = val;
                    }
                }
            }
        }
        this.styles = new Proxy(styles, {
            get: (target, p, receiver) => {
                let val = Reflect.get(target, p, receiver);
                if (typeof val === 'string') {
                    let theme = this.theme[p];
                    if (theme)
                        return theme;
                    ODA.applyStyleMixins(val, this.styles);
                }
                return val;
            },
            set: (target, p, value, receiver) => {
                target[p] = value;
                return true;
            }
        });
    },
    convert(node, style) {
        node.style = style || node.style || node.textContent;
        this.nodes.add(node);
        const res = node.style;
        res && ODA.applyStyleMixins(res, this.styles);
        return res;
    },
    update(updates = {}) {
        if (Object.keys(updates).length === 0)
            this.theme = updates;
        else
            this.theme = Object.assign({}, this.theme, updates);
    }
});
ODA.style = document.createElement('oda-style');