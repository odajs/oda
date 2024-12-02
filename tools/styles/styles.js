let style = /*css*/`

:root {
    --main-color: brown;
    
    --header-1: oklch(from var(--main-color) .8 .02 h);
    --header-2: oklch(from var(--main-color) 0.4 .02 h);
    --header-background: light-dark(var(--header-1), var(--header-2));
    --header-color: light-dark(var(--header-2), var(--header-1));
     
    --content-1: oklch(from var(--main-color) 1 .02 h);
    --content-2: oklch(from var(--main-color) 0.2 .02 h);
    --content-background: light-dark(var(--content-1), var(--content-2));
    --content-color: light-dark(var(--content-2), var(--content-1));

    --dark-1: oklch(from var(--main-color) .6 .02 h);
    --dark-2: oklch(from var(--main-color) 1 .02 h);
    --dark-background: light-dark(var(--dark-1), var(--dark-2));
    --dark-color: light-dark(var(--dark-2), var(--dark-1));
    
    --light-1: oklch(from var(--main-color) .95 .02 h);
    --light-2: oklch(from var(--main-color) .6 .02 h);
    --light-background: light-dark(var(--light-1), var(--light-2));
    --light-color: light-dark(var(--light-2), var(--light-1));
    
    --body-1: oklch(from var(--main-color) 1 .02 h);
    --body-2: oklch(from var(--main-color) 0.2 .02 h);   
    --body-background: light-dark(transparent, transparent);
    --body-color: light-dark(var(--body-2), var(--body-1));

    --section-1: oklch(from var(--main-color) .8 .02 h);
    --section-2: oklch(from var(--main-color) 0.2 .02 h);  
    --section-background: light-dark(var(--section-1), var(--section-2));
    --section-color: light-dark(var(--section-2), var(--section-1));



    --layout-1: oklch(from var(--main-color) 1 .02 h);
    --layout-2: oklch(from var(--main-color) 0.2 .02 h); 
    --layout-background: light-dark(var(--layout-1), var(--layout-2));
    --layout-color: light-dark(var(--layout-2), var(--layout-1));
    
    
    --info-1: oklch(from var(--main-color) 1 .02 h);
    --info-2: oklch(from var(--main-color) 0.6 .2 h);     
    --info-background: light-dark(var(--info-1), var(--info-2));
    --info-color: light-dark(var(--info-2), var(--info-1));
    
    
    --focused-color: var(--main-color);
    
    
    
    --style-group: 'theme';
    --bar-background: var(--content-background);
    --stroke-color: light-dark(transparent, transparent);
    

    --border-color: light-dark(black, white);
    

    
    --accent-color: light-dark(blue, oklch(0.72 0.16 259.27));
    
    --success-color: light-dark(green, green);
    --error-color: light-dark(red, yellow);
    --error-background: light-dark(yellow, red);

    --warning-color: light-dark(orange, orange);
    --disabled-color: light-dark(silver, silver);
    
    --selected-color: light-dark(navy, rgb(0 153 255));
    --selected-background: var(--header-background);
    --selected-filter: brightness(0.8) contrast(1.2)/*', 'brightness(1.2) contrast(0.9)')*/;
    --pointer-color: light-dark(magenta, magenta);


}

:root{
    --font-family: Roboto, Noto, sans-serif;
    --font-150:{
        font-size: 150%;
    };
}

:root{
    --style-group: 'layouts';
    --header: {
        background-color: var(--header-background);
        color: var(--header-color);
        fill: var(--header-color);
        border-color: var(--header-color);
    };
    --dark: {
        background-color: var(--dark-background) !important;
        color: var(--dark-color) !important;
        fill: var(--dark-color)  !important;
        border-color: var(--dark-color) !important;
    };
    
    --content:{
        background-color: var(--content-background);
        color: var(--content-color);
        fill: var(--content-color);
        border-color: var(--dark-color);
    };
    --light:{
        background-color: var(--light-background);
        color: var(--light-color);
        fill: var(--light-color);
        border-color: var(--light-color);
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
        background-color: var(--info-background) !important;
        color: var(--info-color) !important;
        fill: var(--info-color) !important;
        border-color: var(--info-color) !important;
        
    };
    --info-invert: {
        background-color: var(--info-color) !important;
        fill: var(--info-background) !important;
        color: var(--info-background) !important;
        border-color: var(--info-background) !important;
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