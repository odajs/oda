/* * oda.js v3.0
 * (c) 2019-2022 Roman Perepyolkin, Vadim Biryuk, Alexander Uvarov
 * Under the MIT License.
 */
import './rocks.js';
import aliases from './aliases.js';
import ODAStyles from './tools/styles/styles.js'
'use strict';
if (!window.ODA?.IsReady) {
    // document.body.style.visibility = 'hidden';
    const domParser = new DOMParser();
    const pointerDownListen = (win = window) => {
        try { //cross-origin
            win.addEventListener('pointerdown', (e) => {
                if (win !== top)
                    top.dispatchEvent(new PointerEvent("pointerdown", e));
            })
            // ToDo: not works dropdown (without parent) in modal:
            win.addEventListener('pointerdown', (e) => {
                ODA.mousePos = new DOMRect(e.pageX, e.pageY);
            }, true)
            // Array.from(win).forEach(w => pointerDownListen(w));
        } catch (err) {
            console.error(err);
        }
    }
    function isObject(obj) {
        return obj && typeof obj === 'object';
    }

    function loadImports(prototype) {
        if (prototype.imports) {
            if (!Array.isArray(prototype.imports)) {
                prototype.imports = prototype.imports.split(',').map(i => i.trim());
            }
            const imports = prototype.imports.map(s => s.trim()).filter(Boolean).map(i => ODA.import(i, prototype));
            if (imports.some(i => i.then)) {
                return Promise.all(imports);
            }
            else {
                return imports;
            }
        }
        else {
            return [];
        }
    }

    function getParents(prototype) {
        clearExtends(prototype);
        let parents = prototype.extends.map(s => s.trim()).filter(Boolean).reduce((res, ext) => {
            ext = ext.trim();
            if (ext === 'this')
                res.push(ext);
            else if (ext.includes('-')) {
                let parent = ODA.telemetry.components[ext] || ODA.waitDependence(ext);
                res.push(parent);
            }
            return res;
        }, []);
        if (parents.some(p => p.then)) {
            return Promise.all(parents);
        }
        else {
            return parents;
        }
    }

    function finalizeRegistration(prototype, imports = [], parents = []) {
        try{
            let template = prototype.template || '';
            if (parents.length) {
                let templateExt = '';
                for (let parent of parents) {
                    if (parent === 'this') {
                        templateExt += template;
                        template = null;
                    }
                    else
                        templateExt += parent.prototype.$template;
                }
                if (template)
                    templateExt += template;
                template = templateExt;
                parents = parents.filter(i => i?.constructor === Object);
                prototype.extends = parents.map(i => i.el);

            }
            const doc = domParser.parseFromString(`<template>${template || ''}</template>`, 'text/html');
            template = doc.querySelector('template');
            const styles = Array.prototype.filter.call(template.content.children, i => i.localName === 'style');
            for (let style of styles) {
                let css = style.textContent;//.split('\n')
                while (css.includes('@apply'))
                    css = ODAStyles.applyStyleMixins(css);
                let ss = new CSSStyleSheet();
                ss.replaceSync(css);
                style.textContent = css;
                // template.content.insertBefore(style, template.content.children[0])
                // todo доделать слияние стилей
            }
            while (styles.length) {
                template.content.insertBefore(styles.pop(), template.content.firstChild);
            }

            prototype.$template = template.innerHTML.trim();
            delete prototype.template;
            prototype.$system.$styles = [...(ODAStyles.adopted || [])]
            const children = parseJSX(prototype, prototype.$template);

            const sk = Object.getOwnPropertyDescriptor(prototype, '$saveKey');

            Object.defineProperty(prototype, '$saveKey', {
                configurable: true,
                enumerable: false,
                get() {
                    let value = sk?.get?.call(this);
                    if (value === undefined)
                        value = '';
                    return value;
                },
                set(n) {
                    this[CORE_KEY].loaded = {};
                    this['#$savePath'] = undefined;
                    Object.values(this.constructor.__rocks__.descrs).filter(i => i.$save).forEach(i => {
                        const val = this.$loadPropValue(i.name);
                        if (val !== undefined)
                            this[i.name] = val;
                    });
                }
            });


            const el = class extends odaComponent.ROCKS(prototype) {
                constructor() {
                    super(...arguments);
                    Object.assign(this[CORE_KEY], {
                        test: {},
                        children,
                        pdp,
                        attributes: new Map(),
                        slotted: new Set()
                    });
                    if (this.isConnected) {
                        for (let i in this.constructor.__rocks__.descrs) {
                            const desc = Object.getOwnPropertyDescriptor(this, i);
                            if (desc) {
                                delete this[i];
                                this[i] = desc.value;
                            }
                        }
                    }
                    this[CORE_KEY].shadowRoot = this.attachShadow({ mode: 'closed' });
                    this[CORE_KEY].shadowRoot.adoptedStyleSheets = prototype.$system.$styles;


                    this.async(() => {
                        for (let a of this.attributes) {
                            let val = a.value;
                            val = (val === '') ? true : (val === undefined ? false : val);
                            const key = a.name.toCamelCase();
                            const prop = this.constructor.__rocks__.descrs[key];
                            if (prop && !prop.$readOnly)
                                this[key] = prop.toType(val);
                        }
                        prototype.$listeners.keydown = function (e) {
                            const e_key = e.key.toLowerCase();
                            const e_code = e.code.toLowerCase();
                            const key = Object.keys(this.$keys).find(key => {
                                return key.toLowerCase().split(',').some(v => {
                                    return v.split('+').every(s => {
                                        if (!s) return false;
                                        const k = s.trim() || ' ';
                                        switch (k) {
                                            case 'ctrl':
                                                return e.ctrlKey;
                                            case 'shift':
                                                return e.shiftKey;
                                            case 'alt':
                                                return e.altKey;
                                            default:
                                                return k === e_key || k === e_code || `key${k}` === e_code;
                                        }
                                    })
                                });
                            });
                            if (key) {
                                let handler = this.$keys[key];
                                if (typeof handler === 'string')
                                    handler = this[handler];
                                if (!handler) {
                                    throw new Error('no keybinding handler')
                                }
                                handler.call(this, e);
                            }
                        }
                        for (let n in prototype.$listeners) {
                            const fn = prototype.$listeners[n];
                            let args = false;
                            if (fn.constructor === String) {
                                prototype.$listeners[n] = this.__proto__[fn];
                            }
                            // if(n === 'mousewheel' || n === 'wheel') args = {passive: true}
                            this.addEventListener(n, prototype.$listeners[n].bind(this), args);
                        }
                        for (let n in prototype.$innerEvents) {
                            const fn = prototype.$innerEvents[n];
                            if (fn.constructor === String) {
                                prototype.$innerEvents[n] = this.__proto__[fn];
                            }
                            this[CORE_KEY].shadowRoot.addEventListener(n, prototype.$innerEvents[n].bind(this));
                        }
                        observedAttrProps.forEach(i => { //инициализация $attrs свойств ВАЖНО!!!
                            this[i.name];
                        });
                        this.ready?.();
                    });
                }
                static get observedAttributes() {
                    return observedAttributes;
                }
                attributeChangedCallback(name, o, n) {
                    if (name === 'slot') {
                        this.throttle('$render', ()=>{
                            this.$render();
                        }, 16)
                    }
                    else {
                        n = (n === '') ? true : n;
                        observedAttrProps.filter(i => i.$attr === name).forEach(i => {
                            this[i.name] = n;
                        });
                    }
                }
                $super(parentName, name, ...args) {
                    const components = ODA.telemetry.components;
                    if (parentName && components[parentName]) {
                        const proto = components[parentName].prototype;
                        const descriptor = Object.getOwnPropertyDescriptor(proto, name);
                        if (!descriptor) {
                            throw new Error(`Not found super: "${name}" `);
                        }
                        if (typeof descriptor.value === 'function')
                            return descriptor.value.call(this, ...args);
                        if (descriptor.get)
                            return descriptor.get.call(this);
                        return undefined;
                    }
                }
            };
            const pdp = Object.values(el.__rocks__.descrs).filter(i => i.$pdp && !COMPONENT_HOOKS.includes(i.name)).map(i => {
                const name = i.name;
                return (i.value?.constructor === Function) ?
                    { name, value: i.value } :
                    {
                        name, get() { return this.domHost[name]; },
                        set(val) { this.domHost[name] = val; }
                    };
            });
            const observedAttrProps = Object.values(el.__rocks__.descrs).filter(i => i.$attr);
            const observedAttributes = observedAttrProps.filter(i => !i.$readOnly).map(i => {
                if (i.$attr === true)
                    return i.name;
                return i.$attr;
            });
            observedAttributes.push('slot');
            Object.defineProperty(el, 'name', { value: prototype.is });
            Object.defineProperty(el, Symbol.toStringTag, { value: '<' + prototype.is + '>', enumerable: false, configurable: false });

            window.customElements.define(prototype.is, el);
            if (!el) {
                console.warn(`No custom element class in "${prototype.is}"`);
            }
            const component = ODA.telemetry.components[prototype.is] = { prototype, el };
            ODA.telemetry.last = prototype.is;
            if (ODA.wait?.[prototype.is]?.reg) {
                ODA.wait[prototype.is].reg(component);
                delete ODA.wait[prototype.is];
            }
            return prototype.is;
        }
        catch (e){
            console.error(prototype.is, e);
        }
    }

    function regComponent(prototype) {
        if (window.customElements.get(prototype.is)) return prototype.is;
        // try {
            const imports = loadImports(prototype);
            if (imports.then){
                return imports.then(imp=>{
                    let parents = getParents(prototype);
                    if(parents.then){
                        return parents.then(par =>{
                            return finalizeRegistration(prototype, imp, par);
                        })
                    }
                    return finalizeRegistration(prototype, imp, parents);
                })
            }
            let parents = getParents(prototype);
            if(parents.then){
                return parents.then(par =>{
                    return finalizeRegistration(prototype, imports, par);
                })
            }
            return finalizeRegistration(prototype, imports, parents);


/*        }
        catch (e) {
            console.error(prototype.is, e);
        }
        finally {
            delete prototype.$system.reg;
        }*/
    }

    const regexUrl = /https?:\/\/(?:.+\/)[^:?#&]+/g
    const clearExtends = (proto, exts) => {
        const toRemove = [];
        if (!exts) {
            for (const ext of proto.extends) {
                const parentExtends = ODA.telemetry.prototypes[ext]?.extends;
                if (parentExtends?.length) toRemove.add(...clearExtends(proto, parentExtends));
            }
            for (const rm of toRemove) {
                const idx = proto.extends.indexOf(rm);
                if (~idx) {
                    proto.extends.splice(idx, 1);
                }
            }
            return toRemove;
        }
        for (const ext of exts) {
            if (proto.extends.includes(ext)) {
                toRemove.add(ext);
            }
            const parentExtends = ODA.telemetry.prototypes[ext]?.extends;
            if (parentExtends?.length) clearExtends(proto, parentExtends);
        }
        return toRemove;
    }
    class odaComponent extends HTMLElement{
        connectedCallback() {
            ODA.resizeObserver.observe(this);
            ODA.intersectionObserver.observe(this);
            this.__pdp?.forEach(i=>{
                if(i.name in this)
                    return;
                Object.defineProperty(this, i.name, i)
            })
            if (this._on_disconnect_timer){
                clearTimeout(this._on_disconnect_timer)
                this._on_disconnect_timer = 0;
                return;
            }
            this.async(()=>{
                this.$render();
                this.attached?.();
            })
        }
        disconnectedCallback() {
            ODA.resizeObserver.unobserve(this);
            ODA.intersectionObserver.unobserve(this);
            this._on_disconnect_timer = setTimeout(() => {
                this._on_disconnect_timer = 0;
                this.detached?.();
            }, 100)
            if (this[CORE_KEY].slotted?.size) {
                this.async(()=>{
                    this.$render(true);
                })
            }
        }
        setProperty(name, v){
            if (name.includes('.')) {
                let path = name.split('.');
                let step;
                for (let i = 0; i < path.length; i++) {
                    let key = path[i].toCamelCase();
                    if (i === 0) {
                        if (this.props && key in this.props) {
                            step = this[key] ??= {}
                        }
                        else break;
                    }
                    else if (isObject(step)) {
                        if (i < path.length - 1) {
                            step = step[key] ??= {};
                        } else {
                            step[key] = v;
                            return;
                        }
                    }
                }
            }
            else if (name in this.__proto__) {
                this[name] = v;
            }
            else if (!isObject(v)){
                try{
                    name = name.toKebabCase();
                    if (v || v === 0)
                        this.setAttribute(name, v === true ? '' : v);
                    else
                        this.removeAttribute(name);
                }
                catch (e){
                    console.log(e)
                }
            }
            else{
                this[name] = v;
            }
        }
        get __pdp() {
            const pdps = this.domHost?.__pdp || [];
            pdps.push(...(this.domHost?.[CORE_KEY].pdp || []));
            return pdps?.filter(desc => {
                return  !Object.keys(this.constructor.__rocks__.descrs).some(key => key === desc.name);
            })
        }
        $updateStyle(styles = {}) {
            this[CORE_KEY].style = Object.assign({}, this[CORE_KEY].style, styles);
            this.$render();
        }
        $notify($prop, val) {
            if($prop?.$attr){
                if (val || val === 0)
                    this.setAttribute($prop?.$attr, val === true ? '' : val);
                else
                    this.removeAttribute($prop?.$attr);
            }
            this.updated?.();
        }
        $render(force) {

            if(this.isConnected || force) {
                if(this.domHost?.__render && !force)
                    return this.domHost?.__render;
                return this.__render ??= new Promise(async resolve =>{
                    await renderChildren.call(this, this[CORE_KEY].shadowRoot)
                    this[CORE_KEY].test['render'] = (this[CORE_KEY].test['render'] || 0) + 1;
                    this.onRender?.();
                    resolve(this);
                    this.__render = undefined;
                })
            }
            return this.__render;
        }
        get $keys(){
            if (!this['#$keys']){
                this['#$keys'] = {};
                for (let i in this.constructor.__rocks__.prototype.$keyBindings || {}) {
                    let handler = this.constructor.__rocks__.prototype.$keyBindings[i];
                    this['#$keys'][i] = (typeof handler === 'function')
                        ? handler.bind(this)
                        : handler;
                }
            }
            return this['#$keys'];
        }
        get $body(){
            return this.domHost?.body || this.parentNode?.body || this.parentElement;
        }

        get $savePath(){
            return `${this.localName}${this.$saveKey && ('/'+this.$saveKey) || ''}`;
        }
        $loadPropValue(key){
            this[CORE_KEY].loaded ??={};
            this[CORE_KEY].loaded[key] = true;
            const value = ODA.LocalStorage.create(this.$savePath).getItem(key);
            if (value && typeof value === 'object') {
                if (Array.isArray(value)) {
                    return Array.from(value);
                }
                return { ...value };
            }
            return value;
        }
        $savePropValue(key, value){
            if (!this[CORE_KEY].loaded?.[key]) return;
            ODA.LocalStorage.create(this.$savePath).setItem(key, value);
        }
        $resetSettings(){
            ODA.LocalStorage.create(this.$savePath).clear();
        }
        get $slotted() {
            return Array.prototype.reduce.call(this[CORE_KEY].shadowRoot.childNodes, (res, i) => {
                if (i?.slotTarget?.parentElement)
                    res.add(i.slotTarget.parentElement);
                return res;
            }, [])
        }
        $(path) {
            if (!path) return null;
            let result = this[CORE_KEY].shadowRoot?.querySelector(path);
            if(!result){
                for(let i of this.$slotted){
                    result = i.querySelector(path);
                    if(result && result.domHost === this)
                        break;
                    else
                        result = null;
                }
            }
            return result
        }
        $$(path) {
            if (!path) return [];
            let result =  Array.from(this[CORE_KEY].shadowRoot.querySelectorAll(path));
            for(let i of this.$slotted){
                const res = i.querySelectorAll(path);
                for(let el of res){
                    if(el.domHost === this);
                        result.add(el)
                }
            }
            return result;
        }
        get $url() {
            this.constructor.__rocks__.prototype.$system.url;
        }
        $next(handler, tacts = 0){
            if (tacts>0)
                requestAnimationFrame(()=>{
                    this.$next(handler, tacts - 1)
                })
            else {
                if (typeof handler === 'string')
                    handler = this[handler].bind(this);
                requestAnimationFrame(handler);
            }
        }
    }
    function ODA(prototype = {}, stat = {}) {
        return ODA.telemetry.prototypes[prototype.is] ??= (() => {
            if (ODA.telemetry.components[prototype.is]) return ODA.telemetry.components[prototype.is];
            prototype.is = prototype.is.toLowerCase();
            prototype.$system ??= Object.create(null);
            const matches = (new Error()).stack.match(regexUrl);
            prototype.$system.url = matches[matches.length - 1];
            prototype.$system.dir = prototype.$system.url.substring(0, prototype.$system.url.lastIndexOf('/')) + '/';
            prototype.extends = str2arr(prototype.extends);
            const res = regComponent(prototype);
            if (res.then) {
                return res.then(() => {
                    ODA.telemetry.prototypes[prototype.is] = prototype;
                    return prototype.is;
                })
            }
            else {
                return res;
            }
        })();
    }
    // ODA.isHidden = true;
    ODA.regHotKey = function (key, handle){
        ODA.$hotKeys = ODA.$hotKeys || {};
        ODA.$hotKeys[key] =  handle;
    }
    document.addEventListener('keydown', async (e) =>{
        if (!e.code?.startsWith?.('Key')) return;
        let key = (e.ctrlKey ? 'ctrl+' : '') + (e.altKey ? 'alt+' : '') + (e.shiftKey ? 'shift+' : '') + e.code.replace('Key', '').toLowerCase();
        ODA.$hotKeys?.[key]?.(e);
    });
    ODA.regTool = function (name){
        return ODA[name] || (ODA[name] = Object.create(null));
    }
    ODA.rootPath = import.meta.url;
    ODA.rootPath = ODA.rootPath.split('/').slice(0, -1).join('/');
    /** @type {{[key: string]: {promise: Promise<string>|undefined, reg: function|undefined}}} */
    ODA.wait = {};
    /** @param {string} tag */
    ODA.waitDependence = function (tag) {
        if (tag in ODA.telemetry.components) {
            return ODA.telemetry.components[tag].prototype;
        }
        ODA.wait[tag] ??= {promise: undefined, reg: undefined};
        ODA.wait[tag].promise ??= new Promise(resolve => {
            ODA.wait[tag].reg = prototype => resolve(prototype);
        });
        return ODA.wait[tag].promise;
    }
    /** @param {string} tag */
    ODA.waitReg = function (tag) {
        return ODA.telemetry.prototypes[tag] || ODA.waitDependence(tag);
    }
    window.ODA = ODA;
    const apples = ['Mac68K', 'MacPPC', 'MacIntel', 'iPhone', 'iPod', 'iPad',]
    ODA.isApple = apples.includes(navigator.platform);
    localStorage:{
        ODA.LocalStorage = class odaLocalStorage extends ROCKS({
            get data(){
                try{
                    const data = JSON.parse(globalThis.localStorage.getItem(this.path) || '{}');
                    data.$$stamp ??= Date.now();
                    return data;
                }
                catch (e){
                    console.warn(e)
                }
                return {};
            },
            getItem(key){
                return this.data[key];
            },
            getFromItem(key, subKey){
                return this.data[key]?.[subKey];
            },
            setItem(key, value){
                this.data[key] = value;
                this.save();
            },
            setToItem(key, subKey, value){
                key = this.data[key] ??= {};
                key[subKey] = value;
                this.save();
            },
            save(){
                if (this['#data'] === undefined) return;
                if(this.raf)
                    cancelAnimationFrame(this.raf);
                this.raf = requestAnimationFrame(()=>{
                    globalThis.localStorage.setItem(this.path, JSON.stringify(this.data));
                    this.raf = 0;
                })
            },
            get version(){
                return this.data.$$stamp;
            },
            clear(){
                this.data = undefined;
                this.version = undefined;
                globalThis.localStorage.removeItem(this.path);

            }
        }){
            constructor(path) {
                super();
                this.path = path;
            }
            static items = {}
            static create(path){
                return ODA.LocalStorage.items[path] ??= new ODA.LocalStorage(path);
            }
        }
    }

    Object.defineProperty(ODA, 'top',  {
        get (){
            if (window.parent !== window)
                return window.parent.ODA?.top || window;
            return window;
        }
    })

    class VNode {
        constructor(el, vars) {
            this.id = ++VNode.sid;
            this.vars = vars;
            el.$node = this;
            this.el = el;
            this.tag = el.nodeName;
            this.fn = {};
            this.children = [];
            if (el.parentNode?.$node?.isSvg || el.nodeName === 'svg')
                this.isSvg = true;
            else if (el.nodeName === 'SLOT')
                this.isSlot = true;
            this.listeners = {};
        }
    }
    VNode.sid = 0
    const dirRE = /^((oda|[a-z])?-)|~/;
    //var localizationPhrase = {}
    const INLINE_EXPRESSION = /\{\{((?:.|\n)+?)\}\}/;
    function parseJSX(prototype, el, vars = []) {
        if (!el) return []
        if (typeof el === 'string') {
            let tmp = document.createElement('template');
            tmp.innerHTML = el;
            tmp = tmp.content.childNodes;
            return Array.prototype.map.call(tmp, el => parseJSX(prototype, el)).filter(i => (i && !i.$remove));
        }
        let src = new VNode(el, vars);
        if (el.nodeType === 3) {
            let value = el.textContent.trim();
            if (!value) return;
            if (INLINE_EXPRESSION.test(value)){
                let expr = value.replace(/^|$/g, "'").replace(/{{/g, "'+(").replace(/}}/g, ")+'").replace(/\n/g, "\\n").replace(/\+\'\'/g, "").replace(/\'\'\+/g, "");
                if (prototype[expr])
                    expr += '()';
                const fn = createFunc(vars.join(','), expr, prototype);
                src.text ??= [];
                if(el.parentElement?.localName === 'style'){
                    let name = '_style' + el.$node.id;
                    const key = '#'+name;
                    prototype[name] = {
                        get(){
                            return exec.call(this, fn);
                        }
                    }
                    src.text.push(function ($el) {
                        if(this[key]) return;
                        $el.textContent = this[name] || '';

                    })
                }
                else{
                    src.text.push(function ($el) {
                        let text = String(exec.call(this, fn, $el, $el.__for));
                        if ($el.___textContent == text)
                            return;
                        $el.textContent = $el.___textContent = text;
                    })
                }
            }
            else if(el.parentElement?.localName === 'style' && !el.parentElement.parentElement){
                el.parentElement.$node.$remove = true;
                let ss = new CSSStyleSheet();
                while(value.includes('@apply'))
                    value = ODA.applyStyleMixins(value);
                ss.replaceSync(value);
                prototype.$system.$styles.push(ss);
                return;
            }
            else
                src.textContent = value;
        }
        else if (el.nodeType === 8) {
            src.textContent = el.textContent;
        }
        else {
            for (const attr of el.attributes) {
                let name = attr.name;
                let expr = attr.value;
                let modifiers;
                if (typeof Object.getOwnPropertyDescriptor(prototype, expr)?.value === "function")
                    expr += '()';
                if (/^(:|bind:)/.test(attr.name)) {
                    name = name.replace(/^(::?|:|bind::?)/g, '');
                    if (expr === '')
                        expr = attr.name.replace(/:+/, '').toCamelCase();
                    let fn = createFunc(vars.join(','), expr, prototype);
                    if (/::/.test(attr.name)) {

                        const params = ['$value', ...(vars || [])];
                        src.listeners.input = function func2wayInput(e) {
                            if (!e.target.parentNode || !(name === 'value' || name === 'checked')) return;
                            e.stopPropagation();
                            const target = e.target;
                            let value = target.value;
                            switch (target.type) {
                                case 'checkbox': {
                                    value = target.checked;
                                }
                            }
                            target.__lockBind = name;
                            const handle = () => {
                                target.__lockBind = false;
                                target.removeEventListener('blur', handle);
                            };
                            target.addEventListener('blur', handle);
                            target.dispatchEvent(new CustomEvent(name + '-changed', { detail: { value } }));
                        };
                        const func = new Function('$this,'+params.join(','), `with (this) {${expr} = $value}`);
                        src.listeners[name + '-changed'] = function func2wayBind(e, d) {
                            if (!e.target.parentNode) return;
                            let res = e.detail.value === undefined ? e.target[name] : e.detail.value;
                            if (e.target.$node.vars.length) {
                                let idx = e.target.$node.vars.indexOf(expr);
                                if (idx % 2 === 0) {
                                    const array = e.target.__for[idx + 2];
                                    const index = e.target.__for[idx + 1];
                                    array[index] = e.target[name];
                                    return;
                                }
                            }
                            if (res !== undefined || e.target.__for !== undefined) //todo понаблюдать
                                exec.call(this, func, e.target, [res,  ...(e.target.__for || [])]);
                        };
                        src.listeners[name + '-changed'].notify = name;
                        src.listeners[name + '-changed'].expr = expr;
                    }
                    const h = function (params, $el) {
                        return exec.call(this, fn, params, $el);
                    };
                    h.modifiers = modifiers;
                    src.bind = src.bind || {};
                    src.bind[name.toCamelCase()] = h;
                }
                else if (dirRE.test(name)) {
                    name = name.replace(dirRE, '');
                    if (name === 'for')
                        return forDirective(prototype, src, name, expr, vars, attr.name);
                    else if (tags[name])
                        new Tags(src, name, expr, vars, prototype);
                    else if (directives[name])
                        new Directive(src, name, expr, vars, prototype);
                    else
                        throw new Error('Unknown directive ' + attr.name);
                }
                else if (/^@/.test(attr.name)) {
                    modifiers = parseModifiers(name);
                    if (modifiers)
                        name = name.replace(modifierRE, '');
                    if (expr === (attr.value +'()'))
                        expr = attr.value + '($event, $detail)';
                    name = name.replace(/^@/g, '');
                    const params = ['$this','$event', '$detail',  ...(vars || [])];
                    const fn = new Function(params.join(','), `with (this) {${expr}}`);
                    src.listeners = src.listeners || {};
                    // const handler = prototype[expr];
                    const func = attr.value.trim();
                    src.listeners[name] = async function (e) {
                        modifiers && modifiers.stop && e.stopPropagation();
                        modifiers && modifiers.prevent && e.preventDefault();
                        modifiers && modifiers.immediate && e.stopImmediatePropagation();
                        let result;
                        const descriptor  = Object.getOwnPropertyDescriptor(this,  expr)
                        const handler = this[func];
                        if (typeof handler === 'function')
                            result = handler.call(this, e, e.detail);
                        else
                            result = exec.call(this, fn, e.target,  [e, e.detail, ...(e.target.__for || [])]);
                        if (result?.then){
                            try{
                                await result;
                            }
                            catch (e){

                            }
                        }
                    };
                }
                else if (name === 'is')
                    src.tag = expr.toUpperCase();
                else {
                    src.attrs = src.attrs || {};
                    src.attrs[name] = expr;
                }
            }
            if (src.attrs && src.dirs) {
                for (const a of Object.keys(src.attrs)) {
                    if (src.dirs.find(f => f.name === a)) {
                        src.vals = src.vals || {};
                        switch (a){
                            case 'style': {
                                src.vals[a] = styleStringToObject(src.attrs[a]);
                            } break;
                            default:{
                                src.vals[a] = src.attrs[a];
                            }
                        }
                        delete src.attrs[a];
                    }
                }
            }
            if (prototype.$system.shared && src.tag !== 'STYLE') {
                for (let key of prototype.$system.shared) {
                    if (src.bind?.[key] === undefined) {
                        src.bind = src.bind || {};
                        let fn = createFunc(vars.join(','), key, prototype);
                        src.bind[key] = function ($el, params) {
                            let result = exec.call(this, fn, $el, params);
                            if (result === undefined)
                                result = $el[key];
                            if (result === undefined)
                                result = prototype.props[key]?.default;
                            return result;
                        }
                    }
                }
            }
            src.children = Array.from(el.childNodes).map(el => {
                return parseJSX(prototype, el, vars)
            }).filter(i => i);
        }
        if(src.children.length === 1 && src.children[0].tag === '#text')
            src.ignoreChildren = true;
        if(src.bind?.slot || src.attrs?.slot)
            src.isSlotted = true;
        return src;
    }
    const tags = {
        if(tag, fn, p, $el) {
            return  exec.call(this, fn, $el, p)? tag : false;
        },
        'else-if'(tag, fn, p, $el) {
            if ($el?.previousElementSibling?.nodeType !== 1)
                return exec.call(this, fn, $el, p) ? tag : false;
        },
        else(tag, fn, p, $el) {
            if ($el?.previousElementSibling?.nodeType !== 1)
                return tag;
        },
        is(tag, fn, p, $el) {
            if (tag.startsWith('#'))
                return tag;
            return (exec.call(this, fn, $el, p) || '')?.toUpperCase() || tag;
        }
    };
    const directives = {
        wake($el, fn, p) {
            $el.$wake = exec.call(this, fn, $el, p);
        },
        'save-key'($el, fn, p) {
            if ($el[CORE_KEY]) {
                $el.$saveKey =  exec.call(this, fn, $el, p);
            }
        },
        props($el, fn, p) {
            const props = exec.call(this, fn, $el, p);
            if ($el.__dir_props__) {
                if (Object.equal($el.__dir_props__.last, props, true))
                    return;
            }
            else {
                $el.__dir_props__ = { current: {}, last: {} };
            }
            const keys = new Set([$el.__dir_props__.last, props].map(o => (o && Object.keys(o)) || []).flat());
            for (const k of keys) {
                $el.__dir_props__.current[k] = props?.[k];
            }
            $el.__dir_props__.last = props;
            $el.assignProps($el.__dir_props__.current);
        },
        show($el, fn, p) {
            $el.style.display = exec.call(this, fn, $el, p) ? '' : 'none';
        },
        html($el, fn, p) {
            const html = exec.call(this, fn, $el, p) ?? '';
            if ($el.___innerHTML == html)
                return;
            $el.innerHTML = $el.___innerHTML = html;
        },
        text($el, fn, p) {
            const text =  exec.call(this, fn, $el, p) ?? '';
            if ($el.___textContent == text)
                return;
            $el.textContent = $el.___textContent = text;
        },
        class($el, fn, p) {
            let s = exec.call(this, fn, $el, p) ?? '';
            if (!Object.equal($el.$class, s)) {
                $el.$class = s;
                if (Array.isArray(s))
                    s = s.join(' ');
                else if (typeof s === 'object')
                    s = Object.keys(s).filter(i => s[i]).join(' ');
                if ($el.$node?.vals?.class)
                    s = (s ? (s + ' ') : '') + $el.$node.vals.class;
                // this.throttle('set-class', ()=>{
                    $el.setAttribute('class', s);
                // })
            }
        },
        style($el, fn, p) {
            let s = exec.call(this, fn, $el, p) ?? '';
            if (!Object.equal($el.$style, s, true)) {
                $el.$style = s;
                if (typeof s === 'string') s = styleStringToArray(s);
                if (Array.isArray(s))      s = styleArrayToObject(s);

                s = Object.keys(s).reduce((res, a) => {
                    res[a.trim().toKebabCase()] = s[a]; // minHeight -> min-height
                    return res;
                }, {})

                const def = $el.$node?.vals?.style || {};
                const cur = styleStringToObject($el.getAttribute('style'));
                s = { ...def, ...cur, ...s };
                s = styleObjectToString(s);
                // this.throttle('set-style', ()=>{
                    $el.setAttribute('style', s);
                // })
            }
        }
    };
    class Directive {
        constructor(src, name, expr, vars, prototype) {
            if (expr === '')
                expr = name.replace(/:+/, '').toCamelCase();
            src.fn[name] = createFunc(vars.join(','), expr, prototype);
            src.fn[name].expr = expr;
            src.dirs = src.dirs || [];
            src.dirs.push(directives[name])
        }
    }
    class Tags {
        constructor(src, name, expr, vars, prototype) {
            src.fn[name] = expr ? createFunc(vars.join(','), expr, prototype) : null;
            src.tags = src.tags || [];
            src.tags.push(tags[name])
        }
    }
    function forDirective(prototype, src, name, expr, vars, attrName) {
        const idx = vars.length + 1;
        src.vars = [...vars, '$'.repeat(idx)+'for'];
        src.el.removeAttribute(attrName);
        const child = parseJSX(prototype, src.el, src.vars);
        const fn = createFunc(src.vars.join(','), expr, prototype);
        const h = function (p = []) {
            let items = exec.call(this, fn, undefined, p);
            if (typeof items === 'string')
                items = items.split('');
            else if (isObject(items) && !Array.isArray(items)){
                return Object.keys(items).map((key, index)=>{
                    return {child, params: [...p, {item: items[key], index, items, key}]}
                });
            }
            if (!Array.isArray(items)) {
                items = +items || 0;
                if (items < 0)
                    items = 0
                items = new Array(items);
                for (let i = 0; i < items.length; items[i++] = i);
            }
            const res = [];
            for (let index = 0; index < items.length; index++) {
                if (!(index in items)) continue;
                const item = items[index];
                res.push({ child, params: [...p, {item, index, items, key: index}] });
            }
            return res;
        };
        h.src = child;
        return h;
    }

    const _createElement = document.createElement;
    document.createElement = function (tag, ...args) {
        if(tag.includes('-')){
            const prototype = ODA.telemetry.prototypes[tag];
            if (prototype?.then) {
                prototype.then(prototype => {
                    ODA.wait?.[tag]?.reg?.({ prototype });
                    delete ODA.wait?.[tag]
                })
            }
            else {
                ODA.wait?.[tag]?.reg?.({ prototype });
                delete ODA.wait?.[tag]
            }
        }
        return _createElement.call(this, tag, ...args);
    }
    function createElement(src, tag, old, __for) {
        let $el;
        if (tag === '#comment')
            $el = document.createComment((src.textContent || src.id) + (old ? (': ' + old.tagName) : ''));
        else if (tag === '#text')
            $el = document.createTextNode('');
        else {
            if (src.isSvg)
                $el = document.createElementNS(svgNS, tag.toLowerCase());
            else {
                $el = ODA.createElement.call(this, tag);
            }
            switch (tag){
                case 'STYLE':{

                } break;
                case 'IFRAME':{
                    $el.addEventListener('load', e=>{
                        try{
                            if (!e.target.contentDocument.ODA){
                                pointerDownListen(e.target.contentWindow);
                            }
                        }
                        catch (e){
                            console.warn(e)
                        }
                    })
                } break;
                default:{
                    if (!src.isSvg && !src.isSlot){
                        ODA.intersectionObserver.observe($el);
                        ODA.resizeObserver.observe($el);
                    }
                }
            }
            if (src.attrs)
                for (let i in src.attrs)
                    $el.setAttribute(i, src.attrs[i]);
            for (const e in src.listeners || {}) {
                const event = (ev) => {
                    src.listeners[e].call(this, ev);
                }
                $el.addEventListener(e, event, {passive: ['wheel'].some(i=>i === e)});
            }
        }
        $el.$node = src;
        $el.domHost = this;
        if (__for) $el.__for = __for;
        return $el;
    }

    async function renderChildren(root){
        if (!root.$sleep || root.$wake){
            let el, idx = 0;
            for (let h of (root?.$node || this[CORE_KEY]).children || []){
                if (h.call){ // table list
                    let items = h.call(this, root.__for);
                    for(let i = 0; i<items.length; i++){
                        const node = items[i];
                        if(node){
                            while (el = root.childNodes[idx]){
                                if (el.$node === node.child) break;
                                if (!el.$node) {
                                    idx++;
                                    continue;
                                }
                                //понаблюдать 👀
                                else if(el.$node.vars !== node.child.vars) {
                                    break;
                                }
                                root.removeChild(el);
                            }
                            el = root.childNodes[idx+i];
                            el = await renderElement.call(this, node.child, el, root, node.params);
                        }
                    }
                    idx += items.length;
                }
                else{ // single element
                    while (el = root.childNodes[idx]){
                        if (el.$node === h) break;
                        if (!el.$node) {
                            idx++;
                            continue;
                        }
                        root.removeChild(el);
                    }
                    el = await renderElement.call(this, h, el, root, root.__for);
                    idx++;
                }
            }
            if (root[CORE_KEY] && root.isConnected){
                await root.$render(this);
            }
            // else if (root?.$node?.isSlot){
            //     // for (let el of root.assignedElements?.() || []){
            //     //     if (el.$sleep || !el[CORE_KEY]) continue;
            //     //     /*await*/ el.$render(this);
            //     // }
            // }
            else{
                while (el = root.childNodes[idx]){
                    if (!el?.$node) {
                        idx++;
                        continue;
                    }
                    root.removeChild(el);
                }
            }
        }
        return root;
    }
    async function renderElement(src, $el, $parent, __for) {
        if ($parent) {
            let tag = src.tag;
            if (src.tags) {
                for (let h of src.tags)
                    tag = h.call(this, tag, src.fn[h.name], __for, $el) || '#comment';
            }
            if (!$el) {
                $el = createElement.call(this, src, tag, __for);
                $el.__for = __for || $el.__for;
                $parent.appendChild($el);
                if ($el.nodeType === 3)
                    $el.textContent = src.textContent;
            }
            else if ($el.$node && $el.$node?.id !== src.id) {
                const el = createElement.call(this, src, tag, undefined, __for);
                if ($parent.contains($el))
                    $parent.insertBefore(el, $el);
                else
                    $parent.replaceChild(el, $el);
                $el = el;
            }
            else if ($el.slotTarget){
                if($el.slotTarget.nodeName !== tag){
                    const old = $el.slotTarget;
                    old.__before ??= Object.create(null);
                    const el = old.__before[tag] ??= createElement.call(this, src, tag, old, __for);
                    el.__before ??= Object.create(null);
                    el.__before[el.nodeName] = old;
                    old.parentElement.replaceChild(el, old);
                    el.slotProxy = $el;
                    $el.slotTarget = el;
                }
                $el = $el.slotTarget;
            }
            else if ($el.nodeName !== tag) {
                $el.__before ??= Object.create(null);
                const el = $el.__before[tag] ??= createElement.call(this, src, tag, $el, __for);
                el.__before ??= Object.create(null);
                el.__before[$el.nodeName] = $el;
                $parent.replaceChild(el, $el);
                $el = el;
            }
        }
        $el.__for = __for || $el.__for;
        switch ($el.nodeType) {
            case 3:
            case 8: {
                for (let h of src.text || [])
                    h.call(this, $el);
                return $el;
            }
        }
        if (src.dirs)
            for (let h of src.dirs)
                h.call(this, $el, src.fn[h.name], __for);
        if (src.bind) {
            for (let key in src.bind) {
                let val = src.bind[key].call(this, $el, __for);
                if (key.includes('.')) {
                    const listener = src.listeners[key.toKebabCase() + '-changed'];
                    if (listener) {
                        const pathToObj = key.slice(0, key.lastIndexOf('.'));
                        const propName = key.slice(key.lastIndexOf('.') + 1);
                        const obj = (new Function(`with(this){return ${pathToObj}}`)).call($el);
                        const bottUpdates = obj?.__op__?.blocks?.[propName]?.updates;
                        const topUpdates = new Function(`with(this){return __op__.blocks['${listener.expr}'] || __op__.blocks['#${listener.expr}']}`).call(this, listener)?.updates ?? 0;
                        if (bottUpdates > topUpdates && $el.fire) {
                            this.setProperty(listener.expr, obj[propName]);
                            continue;
                        }
                    }
                }
                if(val?.then){
                    if ('result' in val.then){
                        val = val.then.result;
                    }
                    else{
                        const _key = key;
                        val?.then(res=>{
                            $el.setProperty(_key, res);
                        })
                    }
                }
                else
                    $el.setProperty(key, val);
            }
        }
        if(src.isSlotted)
            renderSlottedElement.call(this, src, $el, $parent);
        if(src.ignoreChildren && !$el?.[CORE_KEY])
            return renderElement.call(this, src.children[0], $el.childNodes[0], $el, __for);
        return renderChildren.call(this, $el);
    }
    function renderSlottedElement(src, $el, $parent){
        if (this.isConnected) {
            if ($el.slot && !$el.slotProxy && $el.slot !== '?' && !$el.parentElement?.slot) {
                $el.slotProxy ??= createElement.call(this, src, '#comment');
                $el.slotProxy.slotTarget = $el;
                $el.slotProxy.textContent += `-- ${$el.localName} (slot: "${$el.slot}")`;

                this[CORE_KEY].slotted.add($el);

                $parent.replaceChild($el.slotProxy, $el);
                if ($el.slot === '*')
                    $el.removeAttribute('slot')

                requestAnimationFrame(() => {
                    let host;
                    const filter = `slot[name='${$el.slot}']`;
                    for (host of this[CORE_KEY].shadowRoot?.querySelectorAll('*')) {
                        if (host[CORE_KEY]?.shadowRoot?.querySelector(filter)) {
                            applySlotByOrder($el, host);
                            return;
                        }
                    }
                    host = this;
                    while (host) {
                        for (let ch of host.children) {
                            if(ch[CORE_KEY]?.shadowRoot?.querySelector(filter)){
                                applySlotByOrder($el, ch);
                                return;
                            }
                        }
                        if (host[CORE_KEY]?.shadowRoot?.querySelector(filter)) {
                            applySlotByOrder($el, host);
                            return;
                        }
                        host = host.domHost || (host.parentElement?.[CORE_KEY] && host.parentElement);
                    }
                    applySlotByOrder($el, this);
                })

            }
            if ($el.parentElement?.$render && !$el.parentElement?.__render) {
                let p = $el.domHost; // 👀
                while (p) {
                    if (p === $el.parentElement) return;
                    p = p.parentElement;
                }
                this.async(() => {
                    $el.parentElement?.$render?.();
                });
            }
        }
        else {
            while (this[CORE_KEY].slotted?.size) {
                const el = this[CORE_KEY].slotted.values().next().value;
                this[CORE_KEY].slotted.delete(el);
                el.slotProxy?.parentNode?.replaceChild(el, el.slotProxy);
                el._slotProxy = el.slotProxy;
                el.slotProxy = undefined;
            }
        }
    }
    function applySlotByOrder($el, host) {
        const prev = $el.slotProxy?.previousSibling;
        const target = prev instanceof Comment && prev?.slotTarget?.nextSibling || null;
        host.insertBefore($el.slotProxy.slotTarget, target);
    }
    function parseModifiers(name) {
        if (!name) return;
        const match = name.match(modifierRE);
        if (!match) return;
        const ret = {};
        match.forEach(function (m) { ret[m.slice(1)] = true; });
        return ret
    }
    function createFunc(vars, expr, prototype = {}) {
        try {
            return new Function('$this,'+vars, `with (this) {return (${expr})}`);
        }
        catch (e) {
            console.error('%c' + expr + '\r\n', 'color: black; font-weight: bold; padding: 4px;', prototype.is, prototype.$system.url, e);
        }
    }
    function exec(fn, $el, p = []) {
        try {
            return fn.call(this, $el, ...p);
        }
        catch (e) {
            switch (e.name){
                case 'ReferenceError':{
                    const prop = e.message.split(' ')[0];
                    let host = this.domHost;
                    while (host){
                        if(prop in host){
                            console.error(`${e.name}: ${e.message} in <${this.localName}>.
But this problem can be fixed by set
the property modifier $pdp: true
in the <${host.localName}>`);
                            return;
                        }
                        host = host.domHost;
                    }
                } break;
            }
            console.error(e, this);
        }
    }
    const forVars = ['item', 'index', 'items', 'key'];
    const svgNS = "http://www.w3.org/2000/svg";
    const modifierRE = /\.[^.]+/g;
    ODA.origin = origin;
    ODA.calledDeferred = [];
    ODA.updateStyle=(changes = ODAStyles.cssRules, el)=>{
        if (el?.style) {
            for (let p in changes)
                el.style.setProperty(p, changes[p])
            return;
        }
        Array.from(window).forEach(w=>{
            w.ODA?.updateStyle(changes);
        })
        for (let style of document.querySelectorAll('style')){
            for (let i of style.sheet.cssRules) {
                for (let p in changes){
                    i.style?.setProperty(p, changes[p])
                }
            }
        }
    }

    ODA.convertOdaUrl = function (url, prototype){
        try{
            url = url.trim();
            if (aliases && url in aliases)
                url = ODA.rootPath + '/' + aliases[url];
            else if (prototype){
                if (url.startsWith('./'))
                    url = prototype.$system.dir + url.substring(1);
                else if (url.startsWith('../'))
                    url = prototype.$system.dir +'/'+url;
            }
            url = url.replace(/\/\//g, '/');
            url = (new URL(url)).href;
        }
        catch (e){
            console.log(e)
        }
        return url;
    }
    ODA.resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
            if (entry.target.__events?.has('resize'))
                entry.target.fire('resize');
            if (entry.target[CORE_KEY]?.shadowRoot?.__events?.has('resize'))
                entry.target[CORE_KEY].shadowRoot.fire('resize');
        }
    })
    ODA.intersectionObserver = new IntersectionObserver(entries => {
        let wake;
        for (let i = 0, entry, l = entries.length; i < l; i++) {
            entry = entries[i];
            entry.target.$sleep = !entry.isIntersecting && !entry.target.$wake;
            if (!entry.target.$sleep){
                wake ??= [];
                wake.add(entry.target.domHost || entry.target)
            }
        }
        if(!wake) return;
        for(let t of wake)
            t.$render?.()
    }, { rootMargin: '10%', threshold: 0})


    ODA.cache = {};
    ODA.import = function (url, prototype){
        url = ODA.convertOdaUrl(url, prototype);
        return ODA.cache[url] ??= import(url);
    }
    ODA.fetch = function (url, prototype) {
        url = ODA.convertOdaUrl(url, prototype);
        return ODA.cache[url] ??= fetch(url);
    }
    ODA.loadJSON = function (url, prototype) {
        return ODA.cache['json:'+url] ??= ODA.fetch(url, prototype).then(file=>{
            return file.json();
        })
    }
    const COMPONENT_HOOKS = ['created', 'ready', 'attached', 'detached', 'updated', 'afterLoadSettings', 'destroyed', 'onRender', 'onVisible'];
    const toString = Object.prototype.toString;
    function isNativeObject(obj) {
        return obj && (obj.constructor === Object);// ||  toString.call(c) === '[object Object]';
    }
    if (!("path" in Event.prototype))
        Object.defineProperty(Event.prototype, "path", {
            get: function () {
                var path = [];
                var currentElem = this.target;
                while (currentElem) {
                    path.push(currentElem);
                    currentElem = currentElem.parentElement;
                }
                if (path.indexOf(window) === -1 && path.indexOf(document) === -1)
                    path.push(document);
                if (path.indexOf(window) === -1)
                    path.push(window);
                return path;
            }
        });

    class odaCustomEvent extends CustomEvent {
        constructor(name, params, source) {
            super(name, params);
            if (source) {
                const props = {
                    path: {
                        value: source.composedPath()
                    },
                    currentTarget: {
                        value: source.currentTarget
                    },
                    target: {
                        value: source.target
                    },
                    stopPropagation: {
                        value: () => source.stopPropagation()
                    },
                    preventDefault: {
                        value: () => source.preventDefault()
                    },
                    sourceEvent: {
                        value: source
                    }
                };
                Object.defineProperties(this, props);
            }
        }
    }
    ODA.getDirInfo = async function (url) {
        let res;
        if (window.location.hostname !== 'localhost') {
            try {
                res = await ODA.loadJSON(url.replace('/web/oda/', '/api/web/oda/') + '?get_dirlist');
            }
            catch (e) {
                //  console.error(e);
            }
        }
        if (!res) {
            try {
                res = await ODA.loadJSON(url + '/_.info');
                ODA.localDirs = true;
            }
            catch (e) {
                res = {}
                console.error(e)
            }
        }
        return res;
    }
    const keyPressMap = {}
    window.addEventListener('keypress', (e) => {
        const e_key = e.key.toLowerCase();
        const e_code = e.code.toLowerCase();
        const key = Object.keys(keyPressMap).find(key => {
            return key.toLowerCase().split(',').some(v => {
                return v.split('+').every(s => {
                    if (!s) return false;
                    const k = s.trim() || ' ';
                    switch (k) {
                        case 'ctrl':
                            return e.ctrlKey;
                        case 'shift':
                            return e.shiftKey;
                        case 'alt':
                            return e.altKey;
                        default:
                            return k === e_key || k === e_code || `key${k}` === e_code;
                    }
                })
            });
        });
        if (key) {
            const calls = keyPressMap[key.toLowerCase()] || [];
            calls.forEach(func => func(e))
        }
    }, true)
    window.addEventListener('load', async () => {
        pointerDownListen();
        document.oncontextmenu = (e) => {
            e.target.dispatchEvent(new MouseEvent('menu', e));
            return false;
        };
        // let sleep = 0;
        if (document.body.firstElementChild) {
            if (document.body.firstElementChild.tagName === 'ODA-TESTER') {
                document.body.style.visibility = 'hidden';
                document.body.firstElementChild.$wake = true;
                document.body.firstElementChild.style.visibility = 'hidden';
                await import('./tools/tester/tester.js');
                setTimeout(()=>{
                    document.body.firstElementChild.style.visibility = '';
                    // ODA.isHidden = false;
                    document.body.style.visibility = '';
                }, 200)
                // sleep = 500;
            }
            document.title = document.title || (document.body.firstElementChild.label || document.body.firstElementChild.name || document.body.firstElementChild.localName);
        }

    });

    Node:{
        const ob_types = ['function', 'object'];
        const only_getters = ['viewBox'];
        Node.prototype.setProperty = function (name, v) {
            if ((name in this || ob_types.includes(typeof v) || this.nodeType !== 1) && !only_getters.includes(name)) {
                try{
                    if (!(this.attributes?.[name]?.value == v || this[name] == v))
                        this[name] = v;
                }
                catch (e){
                    console.warn(e, 'Error on set value ', v, name, this)
                }
            }
            if (!ob_types.includes(typeof v)){ // todo лишняя проверка
                if(this.localName !== 'svg')
                    name = name.toKebabCase();
                if (!v && v !== 0)
                    this.removeAttribute(name);
                else if (this.attributes?.[name]?.value != v)
                    this.setAttribute(name, v === true ? '' : v);
            }

            if (!this.assignedElements) return;
            for (const ch of this.assignedElements())
                ch.setProperty(name, v)
        };
        SVGElement.prototype.setProperty = function (name, v) {
            let desc, proto = this;
            while (proto && !desc) {
                desc = Object.getOwnPropertyDescriptor(proto, name);
                proto = Object.getPrototypeOf(proto);
            }
            if (desc && (desc.set || desc.writable)) {
                Node.prototype.setProperty.call(this, name, v);
            }
            else {
                if (!v && v !== 0)
                    this.removeAttribute(name);
                else if (this.attributes?.[name]?.value != v)
                    this.setAttribute(name, v === true ? '' : v);
            }
        }
        Node.prototype.fire = function (event, detail, options = {}) {
            if (!this.$wake && this.$sleep) return;
            event = new odaCustomEvent(event, { detail: { value: detail }, composed: true, ...options});
            this.dispatchEvent(event);
        };
        Node.prototype.$render = function (src) {
            this.domHost?.$render?.(src);
        };
    }
    Element:{
        Element.prototype.assignProps = function (props = {}){
            for (let i in props){
                const p = props[i];
                if (typeof p === 'function') {
                    this.__propsHandlers ??= {};
                    const fn = this.__propsHandlers[i] ??= p.bind(this);
                    // если не кешировать функцию после bind, то каждый раз будет новая подписка
                    this.addEventListener(i, fn, true);
                    // todo: отписка?
                }
            }
            for (let i in props){
                const p = props[i];
                if (typeof p !== 'function'){
                    if(i in this)
                        this[i] = p;
                    else if(i[0] !== '#')
                        this.setProperty(i, p)
                }

            }
        }
        Element.prototype.getClientRect = function (host) {
            let rect = this.getBoundingClientRect.call(this);
            if (host) {
                const rectHost = host.getBoundingClientRect?.() || host;
                const res = { x: 0, y: 0, top: 0, bottom: 0, left: 0, right: 0, width: 0, height: 0 };
                for (let n in res)
                    res[n] = rect[n];
                res.x -= rectHost.x || 0;
                res.y -= rectHost.y || 0;
                res.top -= rectHost.top || 0;
                res.left -= rectHost.left || 0;
                res.bottom -= rectHost.top || 0;
                res.right -= rectHost.left || 0;
                res.center = {x: res.left + (res.right-res.left)/2, y: res.top + (res.bottom-res.top)/2};
                rect = res;
                rect.host = host;
            }
            return rect;
        }
        if (!Element.prototype.__addEventListener) {
            const EVENT_MAP = {
                'tap': 'click',
                'down': 'mousedown',
                'up': 'mouseup',
                'm_down': 'mousedown',
                'm_up': 'mouseup',
                'p_down': 'pointerdown',
                'p_up': 'pointerup',
                'k_down': 'keydown',
                'k_up': 'keyup',
            }
            const func = EventTarget.prototype.addEventListener;
            EventTarget.prototype.__addEventListener = func
            EventTarget.prototype.addEventListener = function (name, handler, ...args) {
                if (name === 'track')
                    return listenTrack(this, handler, ...args)

                const type = EVENT_MAP[name] || name
                return func.call(this, type, handler, ...args)
            };
            function listenTrack(target, handler, params) {
                let detail;
                target.addEventListener('pointerdown', (e) => {
                    if ((target !== e.target && !(target.contains(e.target)))|| e.buttons !== 1) return;
                    detail = {
                        start: {
                            x: e.clientX,
                            y: e.clientY
                        }, ddx: 0, ddy: 0, dx: 0, dy: 0,
                        target,
                        startButton: e.button
                    }
                    window.addEventListener('pointermove', moveHandler)
                    window.addEventListener('dragstart', upHandler)
                    window.addEventListener('pointerup', upHandler)
                    target.addEventListener('pointerleave', leave, {once: true})
                })
                function leave(e) {
                    if ((target === e.target || target.contains(e.target)) && detail && !detail.state)
                        start(e);
                }
                function start(e){
                    target.removeEventListener('pointerleave', leave);
                    target.setPointerCapture(e.pointerId);
                    detail.state = 'start'
                    fireTrack(e)
                }
                function moveHandler(e) {
                    if (detail && !detail.state) {
                        const x = Math.abs(detail.start.x - e.clientX)
                        const y = Math.abs(detail.start.y - e.clientY)
                        if (Math.max(x, y) > 2)
                            start(e);
                    }
                    else if (detail) {
                        detail.state = 'track'
                        detail.x = e.clientX
                        detail.y = e.clientY
                        detail.ddx = -(detail.dx - (e.clientX - detail.start.x))
                        detail.ddy = -(detail.dy - (e.clientY - detail.start.y))
                        detail.dx = e.clientX - detail.start.x
                        detail.dy = e.clientY - detail.start.y
                        fireTrack(e)
                    }
                }
                function fireTrack(e) {
                    const ce = new odaCustomEvent('track', { detail: Object.assign({}, detail) }, e)
                    handler(ce, ce.detail)
                }

                function upHandler(e) {
                    window.removeEventListener('pointermove', moveHandler)
                    window.removeEventListener('pointerup', upHandler)
                    target.removeEventListener('pointerleave', leave);
                    if (detail?.state) {
                        detail.ddx = 0
                        detail.ddy = 0
                        detail.state = 'end'
                        fireTrack(e)
                    }
                }
            }
        }
    }
    Object.defineProperty(ODA, 'language', {
        get() {
            return globalThis.localStorage.getItem('oda-language') || navigator.language;
        },
        set(v) {
            globalThis.localStorage.setItem('oda-language', v);
            const event = new odaCustomEvent('change-language', { detail: { value: v }, composed: true});
            window.dispatchEvent(event);
        }
    });

    Qarantine:{
        ODA.createComponent = ODA.createElement = (id, props) => {
            let el = document.createElement(id);
            if(props)
                el.assignProps(props);
            return el;
        }
        ODA.loadComponent = async (comp, props = {}, folder = 'components') => {
            if (typeof comp !== 'string') return comp;
            comp = comp.replace('oda-', '')
            let path = `./${folder}/${comp}/${comp}.js`;
            await import(path);
            return ODA.createComponent(`oda-${comp}`, props)
        }
        ODA.notify = function (text) {
            ODA.push(text);
        };
        ODA.push = (title = 'Warning!', params = {}) => {
            if (!params.body) {
                params.body = title;
                title = 'Warning!'
            }
            switch (Notification.permission.toLowerCase()) {
                case "granted":
                    new Notification(title, params);
                    break;
                case "denied":
                    break;
                case "default":
                    Notification.requestPermission(state => {
                        if (state === "granted")
                            ODA.push(title, params);
                    });
                    break;
            }
        };
        ODA.pushMessage = ODA.push;
        ODA.pushError = (error, context) => {
            if (error instanceof Error)
                error = error.stack;
            const tag = context?.displayLabel || 'Error';
            ODA.push(tag, {
                tag: tag,
                body: error,
                icon: '/web/res/icons/error.png'
            })
        };
        ODA.showFileDialog = ({ accept = '*', multiple }) => {
            return new Promise(resolve=>{
                const fialog = document.createElement('input');
                fialog.setAttribute('type', 'file');
                fialog.setAttribute('accept', accept );
                fialog.setAttribute('multiple', multiple);
                fialog.onchange = (e)=>{
                    resolve(e.target.files);
                };
                fialog.click();
                fialog.remove();
            })
        };

        ODA.saveJSON = async (fileName, json)=> {

            const opts = {
                types: [{

                    description: 'JSON file',
                    accept: {'text/plain': ['.json']},

                }],
                suggestedName: fileName,
                excludeAcceptAllOption: true
            };
            const fileHandle = await window.showSaveFilePicker(opts);
            const writable = await fileHandle.createWritable();
            const contents = JSON.stringify(json);
            await writable.write(contents);
            await writable.close();
        };
    }
    let componentCounter = 0;
    function nextId() {
        return ++componentCounter;
    }

    function showOpenFilePickerPolyfill(options) {
        return new Promise((resolve) => {
            const input = document.createElement("input");
            input.type = "file";
            input.multiple = options.multiple;
            if(options.types) {
                input.accept = options.types
                    .map((type) => type.accept)
                    .flatMap((inst) => Object.keys(inst).flatMap((key) => inst[key]))
                    .join(",");
            }
            input.addEventListener("change", () => {
                resolve(
                    [...input.files].map((file) => {
                        return {
                            getFile: async () =>
                                new Promise((resolve) => {
                                    resolve(file);
                                }),
                        };
                    })
                );
            });
            input.click();
        });
    }
    function styleStringToArray(str) {
        // предотвращение ошибок при url("data:image/png;base64,
        return (str?.match(/(?:(?:[\d\w\-]*\s*:)\s*(?:(?:url\s*\([^\)]*\))|(?:[\d\w\s\(\)\-\,\.\#\%]*)));?\s*/gm) || [])
            .map(a => a.at(-1) === ';' ? a.slice(0, -1) : a);
    }
    function styleArrayToObject(arr) {
        if (!arr) return {};
        return arr.reduce((res, a) => {
            if (a) {
                // предотвращение ошибок при url("data:image/png;base64,
                const idx = a.indexOf(':');
                if (~idx) {
                    res[a.slice(0, idx).trim()] = a.slice(idx + 1).trim();
                }
            }
            return res;
        }, {});
    }
    function styleStringToObject(str) {
        return styleArrayToObject(styleStringToArray(str));
    }
    function styleObjectToString(obj) {
        if (!obj) return '';
        return Object.keys(obj).reduce((res, a) => {
            res += a + ': ' + obj[a] + ';'
            return res;
        }, '');
    }
    if (typeof window.showOpenFilePicker !== 'function') {
        window.showOpenFilePicker = showOpenFilePickerPolyfill
    }
    ODA.Worker = class{
        constructor(url, props) {
            this.worker = new ((typeof SharedWorker !== 'undefined')?SharedWorker:Worker)(url, props);
            this.worker = this.worker.port || this.worker;
            this.worker.start?.();
        }
        set onmessage(v){
            this.worker.onmessage = v;
        }
        get onmessage(){
            return this.worker.onmessage;
        }
        set onmessageerror(v){
            this.worker.onmessageerror = v
        }
        get onmessageerror(){
            return this.worker.onmessageerror;
        }
        postMessage(...args){
            this.worker.postMessage(...args);
        }
    }
    telemetry:{
        let telId = 0;
        class odaTelemetry extends ROCKS({
            get(path){
                return new Promise(resolve=>{
                    this.resolves[path] = resolve;
                    worker.postMessage({type: 'get', path})
                }).then(res=>{
                    console.log(res);
                })
            },
            set(path, value){
                worker.postMessage({type: 'set', path, value})
            },
            add(path, value){
                worker.postMessage({type: 'add', path, value})
            },
            clear(path){
                worker.postMessage({type: 'clear', path})
            },
            async measure(path, handle){
                let time = Date.now();
                await handle();
                worker.postMessage({type: 'add', path, value: { ' time': Date.now() - time, ' count': 1}})
            }
        }){
            prototypes = {}
            components = {}
            resolves = {}
        }
        ODA.telemetry = new odaTelemetry();
        let worker = new ODA.Worker(ODA.rootPath+'/telemetry-ww.js');
        worker.onmessage = function (e){
            switch (e.data.type){
                case 'get':{
                    ODA.telemetry.resolves[e.data.path]?.(e.data.result);
                    delete ODA.telemetry.resolves[e.data.path];
                } break;
            }
        }
        worker.onmessageerror = function (e) {
            console.error(e);
        }
    }

    isoLocale:{
        const exclusionsLangFlag = {
            'en': 'gb',
            'zh': 'cn',
            'uk': 'ua',
            'be': 'by',
        }
        ODA.getFlags = isoLocale => {
            let regExp = new RegExp( Object.keys(exclusionsLangFlag).join('|'),'g')
            let parts = isoLocale.toLowerCase().replace(regExp, (m)=> exclusionsLangFlag[m]).split('-')
            return `flags:${(parts[1] || parts[0]).toUpperCase()}`
        }
        ODA.getLangLabel  = isoLocale => {
            let [language, region, variant] = isoLocale.split('-');
            let langLang = new Intl.DisplayNames(isoLocale, {type: "language"}).of(language)
            let label = langLang
            if (region) label +=  ` (${ new Intl.DisplayNames(isoLocale, {type: "region", style: "short"}).of(region) })`
            if (variant)  label += ` ${ variant }`
            let langCur = new Intl.DisplayNames(ODA.language, {type: "language"}).of(language)
            if (langLang!==langCur) label +=  ` - ${langCur}`
            return label
        }
    }
    window.ODA.IsReady = true;
}

export default ODA;