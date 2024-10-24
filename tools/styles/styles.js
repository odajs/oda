let style = /*css*/`

:root {
    --style-group: 'theme';
    --content-background: light-dark(white, oklch(0.40 0 0));
    --light-background: light-dark(#eee, gray);
    --light-color: light-dark(gray, #eee);
    --bar-background: var(--content-background);
    --stroke-color: light-dark(transparent, transparent);
    --content-color: light-dark(black, rgb(200 200 200));
    --header-background: light-dark(silver, rgb(50 50 50));
    --header-color: var(--content-color);
    --border-color: light-dark(darkgray, darkgray);

    --accent-color: light-dark(blue, oklch(0.72 0.16 259.27));
    --success-color: light-dark(green, green);
    --error-color: light-dark(red, yellow);
    --error-background: light-dark(yellow, red);
    --info-color: light-dark(blueviolet, lightyellow);
    --info-background: light-dark(lightyellow, blueviolet);
    --warning-color: light-dark(orange, orange);
    --disabled-color: light-dark(silver, silver);

    --focused-color: var(--accent-color);
    --selected-color: light-dark(navy, rgb(0 153 255));
    --selected-background: var(--header-background);
    --selected-filter: brightness(0.8) contrast(1.2)/*', 'brightness(1.2) contrast(0.9)')*/;
    --pointer-color: light-dark(magenta, magenta);

    --dark-color: light-dark(white, rgb(20 20 20));
    --dark-background: light-dark(gray, gray);

    --body-background: light-dark(transparent, transparent);
    --body-color: var(--content-background);

    --section-background: light-dark(lightgrey, rgb(26 26 26));
    --section-color: light-dark(black, rgb(200 200 200));

    --layout-background: light-dark(whitesmoke, rgb(26 26 26));
    --layout-color: light-dark(black, rgb(200 200 200));
}

:root{
    --font-family: Roboto, Noto, sans-serif;
    --font-150:{
        font-size: 150%;
    };
}

:root{
    --style-group: 'layouts';
    --content:{
        background-color: var(--content-background, white);
        color: var(--content-color, black);
        fill: var(--content-color, black);
    };
    --light:{
        background-color: var(--light-background, #eee);
        color: var(--light-color, gray);
        fill: var(--light-color, gray);
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
        box-sizing: border-box;
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
    --dark: {
        color: var(--dark-color) !important;
        fill: var(--dark-color) !important;
        border-color: var(--dark-color) !important;
        background-color: var(--dark-background) !important;
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
    --border-radius: 0px;
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
    touch-action: none;
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    height: 100%;
    --my-variable: 100px;
}
@media print {
    .pe-no-print {
        display: none !important;
    }
    .pe-preserve-ancestor {
        display: block !important;
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
        box-shadow: none !important;
    }
    *::-webkit-scrollbar { width: 0px; height: 0px; }
    .raised, [raised] {
        border: none !important;
        box-shadow: none !important;
    }
}

input{
    background-color: var(--content-background);
    color: var(--content-color);
}
input::placeholder{
    color: inherit;
    opacity: .5;
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
    --style-group: 'states';
    --invert:{
        filter: invert(1);
    };
    --error: {
        color: var(--error-color) !important;
        border-color: var(--error-color) !important;
        fill: var(--error-color) !important;
        background-color: var(--error-background) !important;

    };
    --error-invert: {
        color: var(--error-background) !important;
        border-color: var(--error-background) !important;
        fill: var(--error-background) !important;
        background-color: var(--error-color) !important;
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

    --accent: {
        color: var(--accent-color) !important;
        fill: var(--accent-color) !important;
        border-color: var(--accent-color) !important;
        outline: var(--accent-color) dashed 2px;
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
        background-color: var(--info-background) !important;
    };
    --info-invert: {
        background-color: var(--info-color) !important;
        fill: var(--info-background) !important;
        color: var(--info-background) !important;
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
    --style-group: 'selectors';


    --active: {
        color: var(--selected-color) !important;
        fill: var(--selected-color) !important;
        background-color: var(--selected-background) !important;
    };
    --selected: {
        color: var(--selected-color) !important;
        fill: var(--selected-color) !important;
        filter: var(--selected-filter);
    };
    --outlined: {
        outline: var(--content-color) dashed .5px;
        outline-offset: -1px;
    };
    --focused:{
        position: relative !important;
        //box-shadow: 0 2px 0 0  var(--focused-color) !important;
    };
    --dimmed: {
        opacity: 0.7;
        filter: grayscale(80%);
    };
    --disabled: {
        @apply --dimmed;
        opacity: 0.3;
        cursor: default !important;
        user-focus: none;
        user-focus-key: none;
        user-select: none;
        user-input: none;
        pointer-events: none;
    };
}
.focused:after, *[focused]:after{
    content: '';
    position: absolute;
    background-color: var(--focused-color);
    bottom: 0px;
    left: 0px;
    height: 2px;
    right: 0px;
    z-index: 1;
}
.focused.focused-left:after, *[focused].focused-left:after{
    bottom: 0px;
    left: 0px;
    width: 2px;
    top: 0px;
    right: unset;
    height: unset;
}
.focused.focused-right:after, *[focused].focused-right:after{
    bottom: 0px;
    top: 0px;
    width: 2px;
    right: 0px;
    left: unset;
    height: unset;
}
.focused.focused-top:after, *[focused].focused-top:after{
    left: 0px;
    top: 0px;
    right: 0px;
    bottom: unset;
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
globalThis.cssRules = [];
globalThis.adopted = [];

const APPLY_REG_EXP = /@apply\s*/gm;
const COMMENT_REG_EXP = /\/\*[^*/]*\*\//igm;
const VAR_REG_EXP = /^--[\w-]*\w+/;
const RULE_BODY_REG_EXP = /^\s*{\s*[^{}]*\s*}\s*$/;

function extractCSSRules (style){
    const result = []
    const adds = []
    if (typeof style === 'string'){
        let ss = new CSSStyleSheet();
        ss.replaceSync(style);
        style = ss;
    }
    for (let i of style.cssRules) {
        if (i?.selectorText)
            result.push(i.selectorText+ '{');
        else{
            adds.unshift(applyStyleMixins(i.cssText));
            continue
        }
        for (let key of i.style || []) {
            let val = i.style.getPropertyValue(key).toString().trim();
            const priority = i.style.getPropertyPriority(key);
            if (priority) {
                val = `${val} !${priority}`;
            }
            if (!val) continue;
            if (!VAR_REG_EXP.test(key) || !RULE_BODY_REG_EXP.test(val)) {
                result.push(key+': '+val+';')
                continue;
            }
            val = val.replace(/^{|}$/g, '');
            val = applyStyleMixins(val);
            val = val.trim().split(';').map(i => {
                return i.trim();
            }).join(';\n\t').trim();
            cssRules[key] ??= val;
            key = key.substring(2);
            adds.push(`.${key}, [${key}] {`)
            adds.push(`${val}`)
            adds.push(`}`)
        }
        result.push('}');
    }
    result.push(...adds);
    return result.join('');
}
function applyStyleMixins (styleText) {
    styleText = styleText.replace(COMMENT_REG_EXP, '');
    styleText =  styleText.split(APPLY_REG_EXP);
    styleText =  styleText.map(i=>{
        let v = i.match(VAR_REG_EXP)?.[0];
        if(!v)
            return i;
        return i.replace(v+';', cssRules[v]);
    });
    styleText = styleText.join('');
    return styleText;
}
const PARSE_RULE_REG_EXP = /([a-z-]+)\s*:\s*((?:[^;]*url\(.*?\)[^;]*|[^;]*)*)\s*(?:;|$)/gi;
function cssRuleParse (rules, res, host = false) {
    for (let rule of rules) {
        switch (rule.type){
            case CSSRule.KEYFRAMES_RULE:{
                let key = rule.cssText;
                let r = res[key] = res[key] || {};
                cssRuleParse(rule.cssRules, r);
            } break;
            case CSSRule.MEDIA_RULE:{
                let key = '@media ' + rule.media.mediaText;
                let r = res[key] = res[key] || {};
                cssRuleParse(rule.cssRules, r);
            } break;
            default:{
                if (rule.cssText.includes(':host') && !host) continue;
                const ss = rule.cssText.replace(rule.selectorText, '').match(PARSE_RULE_REG_EXP);
                if (!ss) continue;
                let sel = rule.selectorText?.split(',').join(',\n');
                let r = res[sel] = res[sel] || [];
                r.add(...ss);
            } break;
        }
    }
}
style = extractCSSRules(style)
const ss = document.createElement('style');
ss.textContent = style;
ss.setAttribute('scope', 'ODA');
document.head.appendChild(ss);
import './adoptedStyleSheets.js'; // https://github.com/calebdwilliams/construct-style-sheets
if ('adoptedStyleSheets' in Document.prototype) {
    let ss = new CSSStyleSheet();
    ss.replaceSync(style);
    globalThis.adopted = [ss];
}
export default {
    cssRules: globalThis.cssRules,
    adopted: globalThis.adopted,
    extractCSSRules,
    applyStyleMixins,
    cssRuleParse
};