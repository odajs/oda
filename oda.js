/* * oda.js v3.0
 * (c) 2019-2021 R.A. Perepelkin
 * Under the MIT License.
 */
import './rocks.js';
'use strict';
if (!window.ODA) {
    window.document.body.style.visibility = 'hidden';
    const makeReactive = KERNEL.makeReactive;
    const domParser = new DOMParser();
    const regExpApply = /(?:@apply\s+)(--[\w-]*\w+)+/g;
    const commentRegExp = /\/\*[^*/]*\*\//igm;
    const regExpParseRule = /([a-z-]+)\s*:\s*((?:[^;]*url\(.*?\)[^;]*|[^;]*)*)\s*(?:;|$)/gi;
    function cssRuleParse(rules, res, host = false) {
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
                    const ss = rule.cssText.replace(rule.selectorText, '').match(regExpParseRule);
                    if (!ss) continue;
                    let sel = rule.selectorText?.split(',').join(',\r');
                    let r = res[sel] = res[sel] || [];
                    r.add(...ss);
                } break;
            }
        }
    }
    //window.addEventListener('pointerdown', e => {
        // console.log(e)
        // ODA.mousePos = new DOMRect(e.pageX, e.pageY);
        // try {
        //     ({
        //         undefined() {
        //             this.up();
        //             this.down();
        //         },
        //         up() {
        //             if(window !== window.parent){
        //                 const ev = new PointerEvent('pointerdown', e);
        //                 ev.direction = 'up';
        //                 window.parent.dispatchEvent(ev);
        //             }
        //         },
        //         down(){
        //             let i = 0;
        //             let w;
        //             while (w = window[i]) {
        //                 const ev = new PointerEvent('pointerdown', e);
        //                 ev.direction = 'down';
        //                 w.dispatchEvent?.(ev);
        //                 i++;
        //             }
        //         }
        //     })[e.direction]();
        // }
        // catch (e){
        //     console.error(e);
        // }
    //}, true);
    // function pointerDownListen(win = window){
    //     // getWins(win);
    //     Array.from(win).forEach(w=>{
    //         pointerDownListen(w);
    //         w.addEventListener('pointerdown', e=> {
    //             if (e.usable === w)
    //                 return;
    //             const ev = new PointerEvent('pointerdown', e);
    //             ev.usable = w;
    //             let ww = win;
    //             do {
    //                 ww.dispatchEvent(ev);
    //                 ww = ww.parent;
    //             }
    //             while (ww !== ww.top)
    //             ww.dispatchEvent(ev);
    //         }, true);

    //     })
    // }

    const pointerDownListen = (win = window) => {
        win.addEventListener('pointerdown', (e) => {
            ODA.mousePos = new DOMRect(e.pageX, e.pageY);
            if (win !== top) top.dispatchEvent(new PointerEvent("pointerdown", e));
        })
        Array.from(win).forEach(w => pointerDownListen(w));
    }

    function isObject(obj) {
        return obj && typeof obj === 'object';
    }
    function decode(map, r){
        if (!map) return;
        for (let s of map.split(';')){
            if (!s) continue;
            if (s.trim().startsWith('@apply')){
                s = s.replace('@apply', '').replace(';', '').trim();
                decode(ODA.cssRules?.[s], r);
            }
            else{
                r.add(s.trim() + ';')
            }
        }
    }
    async function regComponent(prototype, context) {
        if (window.customElements.get(prototype.is)) return prototype.is;
        try {
            if (prototype.imports){
                if (typeof prototype.imports === 'string')
                    prototype.imports = prototype.imports.split(',').map(i=>i.trim());
                await Promise.allSettled((prototype.imports).map( i => {
                    return ODA.import(i, context, prototype);
                }));
            }

            let parents = await Promise.all(prototype.extends.filter(ext => {
                ext = ext.trim();
                return ext === 'this' || ext.includes('-');
            }).map(async ext => {
                ext = ext.trim();
                if (ext === 'this')
                    return ext;
                let parent = ODA.telemetry.components[ext] || (await ODA.tryReg(ext));
                if (!parent)
                    throw new Error(`Not found inherit parent "${ext}"`);
                return parent;
            }));
            let template = prototype.template || '';
            if (parents.length) {
                let templateExt = '';
                for (let parent of parents) {
                    if (parent === 'this') {
                        templateExt += template;
                        template = null;
                    }
                    else
                        templateExt += parent.prototype.template;
                }
                if (template)
                    templateExt += template;
                template = templateExt;
            }
            const doc = domParser.parseFromString(`<template>${template || ''}</template>`, 'text/html');
            template = doc.querySelector('template');
            const styles = Array.prototype.filter.call(template.content.children, i => i.localName === 'style');
            const rules = {};
            for (let style of styles) {
                style.textContent = ODA.applyStyleMixins(style.textContent);
                // *** for compatibility with devices from Apple
                let txtContent = style.textContent.replace(/\}\}/g, ']]]]').replace(/\s\s+/g, ' ').split('}'),
                    arrHost = [];
                txtContent.map(o => {
                    let s = o.replace(/]]]]/g, '}}').trim() + '}';
                    if (s.includes(':host'))
                        arrHost.push({ cssText: s, selectorText: s.replace(/\{.+\}/, '').trim() });
                })
                // ***
                document.head.appendChild(style);
                if (style.sheet.cssRules.length && !/\{\{.*\}\}/g.test(style.textContent)) {
                    cssRuleParse(style.sheet.cssRules, rules);
                    if (arrHost.length > 0)
                        cssRuleParse(arrHost, rules, true); // ***
                    style.remove();
                }
                else
                    template.content.insertBefore(style, template.content.firstElementChild);
            }
            const keys = Object.keys(rules);
            if (keys.length) {
                const el = document.createElement('style');
                el.textContent = keys.map(i => {
                    const rule = rules[i];
                    if (Array.isArray(rule))
                        return '\r' + i + '{\r\t' + rule.join('\r\t') + '\r}';
                    return '\r' + i + '{\r\t' + Object.keys(rule).map(i => {
                        return i + '{\r\t\t' + rule[i].join('\r\t\t') + '\r\t}';
                    }).join('\r') + '\r}';
                }).join('');
                template.content.insertBefore(el, template.content.firstElementChild);
            }
            prototype.template = template.innerHTML.trim();
            ODA.telemetry.components[prototype.is] = { prototype: prototype, count: 0, render: 0 };
            convertPrototype(prototype, parents);
            let options;
            let el;
            if (prototype.extends.length === 1 && !prototype.extends[0].includes('-')) {
                el = document.createElement(prototype.extends[0]).constructor
                prototype.native = prototype.extends[0];
                el = ComponentFactory(prototype, el);
                options = { extends: prototype.extends[0] }
            }
            else
                el = ComponentFactory(prototype);
            window.customElements.define(prototype.is, el, options);
            ODA.telemetry.last = prototype.is;
            console.log(prototype.is, '- ok')
        }
        catch (e) {
            console.error(prototype.is, e);
        }
        finally {
            delete ODA.deferred[prototype.is];
            delete prototype.$system.reg;
        }
    }
    function ComponentFactory(prototype, proto = HTMLElement) {
        function callHook(hook, ...args) {
            this.fire(hook, ...args);
            prototype[hook]?.call(this, ...args);
        }
        const core = {
            // saveProps: {},
            reflects: [],
            prototype: prototype,
            node: { tag: '#document-fragment', id: 0, dirs: [] },
            defaults: {},
            intersect: new IntersectionObserver(entries => {
                for (let i = 0, entry, l = entries.length; i < l; i++) {
                    entry = entries[i];
                    if (!!entry.target.$sleep !== entry.isIntersecting) continue;
                    entry.target.$sleep = !entry.isIntersecting && !!(entry.target.offsetWidth && entry.target.offsetHeight);
                    if (!entry.target.$sleep){
                        // if (entry.target.localName in ODA.deferred){
                        //     ODA.tryReg(entry.target.localName)?.then(res=>{
                        //         entry.target.domHost?.render();
                        //     })
                        // }
                        // else
                            entry.target.domHost?.render();
                    }
                }
            }, { rootMargin: '20%' }),
            resize: new ResizeObserver(entries => {
                for (const obs of entries) {
                    if (obs.target.__events?.has('resize'))
                        obs.target.fire('resize');
                }
            })
        };
        class odaComponent extends proto {
            constructor() {
                super();
                Object.defineProperty(this, '$$id', {
                    value: nextId()
                })
                Object.defineProperty(this, '$proxy', {
                    value: makeReactive.call(this, this)
                })
                Object.defineProperty(this, '$core', {
                    value: Object.assign({}, core)
                })
                this.$core.slotted = [];
                this.$core.slotRefs = Object.create(null);
                this.$core.events = Object.create(null);
                this.$core.debounces = new Map();
                this.$core.intervals = Object.create(null);
                this.$core.listeners = Object.create(null);
                Object.defineProperty(this, 'props', {
                    value: prototype.props
                })
                const defs = Object.create(null);
                for (let i in core.defaults) {
                    const desc = Object.getOwnPropertyDescriptor(this, i);
                    if (desc) {
                        defs[i] = makeReactive.call(this, desc.value, (this.$core.saveProps?.[i] && i));
                        delete this[i];
                    }
                    this['#' + i] =  makeReactive.call(this, core.defaults[i], (this.$core.saveProps?.[i] && i));
                }

                try {
                    this.$core.root = this.$core.shadowRoot = this.attachShadow({ mode: 'closed' });
                    if (ODA.adopted) {
                        this.$core.root.adoptedStyleSheets = ODA.adopted;
                    }
                }
                catch (e) {
                    this.$core.root = this.$core.shadowRoot = new DocumentFragment()
                }
                callHook.call(this, 'created');
                ODA.telemetry.components[prototype.is].count++;
                ODA.telemetry.components.count++;
                if (prototype.hostAttributes) {
                    this.async(() => {
                        for (let a in prototype.hostAttributes) {
                            let val = prototype.hostAttributes[a];
                            val = (val === '') ? true : (val === undefined ? false : val);
                            this.setProperty(a, val);
                        }
                    });
                }
                for (let a of this.attributes) {
                    let val = a.value;
                    val = (val === '') ? true : (val === undefined ? false : val);
                    this.setProperty(a.name, val);
                }
                for (let i in defs) {
                    this[i] = defs[i];
                }
                this.$core.renderer = render.bind(this);
                if (this.$core.shadowRoot) {
                    this.$core.resize.observe(this);
                    this.loadSettings();

                    callHook.call(this, 'ready');
                }
                // Object.defineProperty(this, '$wake', {
                //     value: false
                // })
            }
            connectedCallback() {
                if (!this.domHost/* && this.parentElement !== document.body*/){
                    this.$wake = true;
                    this.style.setProperty?.('visibility', 'hidden');
                }

                // if(!this.domHost){
                //     let parent = this.parentNode;
                //     let dh = parent.$core ? parent : null;
                //     while(!dh && parent){
                //         dh = parent.$core ? parent : null;
                //         parent = parent.parentNode;
                //     }
                //     this.domHost = dh;
                // }
                const parentElement =  this.domHost || this.parentNode
                if (parentElement?.$core) {
                    if (!parentElement.$core.$pdp){
                        parentElement.$core.$pdp = {};
                        let pdp = Object.assign({}, Object.getOwnPropertyDescriptors(parentElement.constructor.prototype), Object.getOwnPropertyDescriptors(parentElement));
                        for (let key in pdp) {
                            //todo: исключить все системные свойства и методы
                            if (hooks.includes(key)) continue;
                            // if (key in this.__proto__) continue;
                            if (key.startsWith('_')) continue;
                            if (key.startsWith('$obs$')) continue;
                            const d = pdp[key];
                            if((typeof d.value === 'function') || d.get || d.set){
                                parentElement.$core.$pdp[key] = {
                                    get() {
                                        return parentElement[key];
                                    },
                                    set(val) {
                                        parentElement[key] = val;
                                    }
                                }
                            }
                        }
                    }
                    this.setPDP();
                }
                for (const key in this.$core.observers) {
                    for (const h of this.$core.observers[key])
                        h.call(this);
                }
                for (let event in prototype.listeners) {
                    this.$core.listeners[event] = (e) => {
                        prototype.listeners[event].call(this, e, e.detail);
                    };
                    this.addEventListener(event, this.$core.listeners[event]);
                }
                this.fire('attached');
                this.render();
                this.async(()=>{
                    callHook.call(this, 'attached');
                    Array.prototype.forEach.call(this.attributes, a=>{
                        let val = a.value;
                        val = (val === '') ? true : (val === undefined ? false : val);
                        this.setProperty(a.name, val);
                    })
                    if (this.style.getPropertyValue?.('visibility') !== 'hidden') {
                        callHook.call(this, 'onVisible')
                    }
                })
            }
            disconnectedCallback() {
                for (let event in prototype.listeners) {
                    this.removeEventListener(event, this.$core.listeners[event]);
                    delete this.$core.listeners[event];
                }

                this._retractSlots();
                callHook.call(this, 'detached');
            }
            setPDP() {
                const parentElement = this.domHost || this.parentNode;
                if (!parentElement.$core) return
                for (let key in parentElement.$core.$pdp){
                    if (key in this) continue;
                    let desc = parentElement.$core.$pdp[key];
                    if(typeof desc.value === 'function'){
                        desc = Object.assign({}, desc, {value: desc.value.bind(this)});
                    }
                    Object.defineProperty(this, key, desc);
                }
            }
            get rootHost(){
                return this.domHost?.rootHost || (this.parentElement?.$core?this.parentElement.rootHost:this.domHost || this);
            }
            // get $$savePath() {
            //     return `${this.localName}/${(this.$core.saveKey || this.saveKey || '')}`;
            // }
            static get observedAttributes() {
                if (!prototype.$system.observedAttributes) {
                    prototype.$system.observedAttributes = Object.keys(prototype.props).map(key => prototype.props[key].attrName);
                    prototype.$system.observedAttributes.add('slot');
                }
                return prototype.$system.observedAttributes;
            }
            _retractSlots() {
                this.$core.slotted.forEach(el => {
                    el.slotProxy?.parentNode?.replaceChild(el, el.slotProxy);
                    el._slotProxy = el.slotProxy;
                    el.slotProxy = undefined;
                });
                this.$core.slotted.splice(0, this.$core.slotted.length);
            }
            attributeChangedCallback(name, o, n) {
                if (o === n) return;
                const descriptor = this.props[name.toCamelCase()];
                if (Array.isArray(descriptor?.list) && !descriptor.list.includes(n)) {
                    return;
                }
                switch (descriptor?.type) {
                    case Object: {
                        n = createFunc('', n, prototype);
                    } break;
                    case Boolean: {
                        n = (n === '') ? true : (((o === '' && n === undefined) || (n === 'false')) ? false : n);
                    } break;
                    default: {
                        n = toType(descriptor?.type, n);
                        if (n === null)
                            return;
                    }
                }
                if (name === 'slot' && n === '?') {
                    this._retractSlots();
                }
                // if (name === 'slot') {
                //     this.async(() => {
                //         this._retractSlots();
                //     }, 150);
                // }
                if (this[name.toCamelCase()] !== n)
                    this[name.toCamelCase()] = n;
            }
            updateStyle(styles = {}) {
                this.$core.style = Object.assign({}, this.$core.style, styles);
                this.render();
            }
            notify(block, value) {
                if (block?.options.target === this) {
                    const prop = block.prop;
                    if (prop){
                        this.fire(prop.attrName + '-changed', value);
                    }
                }

                if (!this.isConnected){
                    if (block?.options.hosts.has(this)){
                        this.debounce('debounce-clear', () => {
                            if (!this.isConnected)
                                block.options.hosts.delete(this);
                        }, 100)
                    }
                }
                // else {
                    this.interval('render-interval', ()=>{
                        for (const prop of this.$core.reflects) {
                            const val = this[prop.name]
                            if (val || val === 0)
                                this.setAttribute(prop.attrName, val === true ? '' : val);
                            else
                                this.removeAttribute(prop.attrName);
                        }
                        this.render();
                    })

                // }

            }
            render() {
                if (!this.$core.shadowRoot) return;
                ODA.render((this.rootHost || this).$core?.renderer);
                callHook.call(this, 'onRender');
                if (!this.domHost && this.$wake && this.style.getPropertyValue?.('visibility') === 'hidden'){
                    this.debounce('first-show', ()=>{
                        this.$wake = false;
                        this.style.removeProperty?.('visibility');
                        callHook.call(this, 'onVisible');
                        // console.log(this,  'visibility')
                    }, 200)
                    this.interval('force-show', ()=>{
                        this.$wake = false;
                        this.style.removeProperty?.('visibility');
                        callHook.call(this, 'onVisible');
                    }, 1000)
                }
            }
            resolveUrl(path) {
                return prototype.$system.path + path;
            }
            fire(event, detail) {
                event = new odaCustomEvent(event, { detail: { value: detail, src: this }, composed: true });
                this.dispatchEvent(event);
            }
            listen(event = '', callback, props = { target: this, once: false, useCapture: false }) {
                props.target = props.target || this;
                if (typeof callback === 'string') {
                    callback = this.$core.events[callback] ??= this[callback].bind(this);
                }
                event.split(',').forEach(i => {
                    props.target.addEventListener(i.trim(), callback, props.useCapture);
                    if (props.once) {
                        const once = () => {
                            props.target.removeEventListener(i.trim(), callback, props.useCapture)
                            props.target.removeEventListener(i.trim(), once)
                        }
                        props.target.addEventListener(i.trim(), once)
                    }
                });
            }
            unlisten(event = '', callback, props = { target: this, useCapture: false }) {
                props.target = props.target || this;
                if (props.target) {
                    if (typeof callback === 'string')
                        callback = this.$core.events[callback];
                    if (callback) {
                        event.split(',').forEach(i => {
                            props.target.removeEventListener(i.trim(), callback, props.useCapture)
                        });
                    }
                }
            }
            createElement(tagName, props = {}, inner) {
                return this.create(...arguments);
            }
            create(tagName, props = {}, inner) {
                const el = ODA.createElement(tagName, props);
                if (inner) {
                    if (inner instanceof HTMLElement)
                        el.appendChild(inner);
                    else
                        el.textContent = inner;
                }
                return el;
            }
            $addClass(cls){
                this.classList.add(cls)
            }
            get $keys(){
                if (!this['#$keys']){
                    this['#$keys'] = {};
                    for (let i in prototype.keyBindings || {}){
                        this['#$keys'][i] = prototype.keyBindings[i].bind(this);
                    }
                }
                return this['#$keys'];
            }
            get $body(){
                return this.domHost?.body || this.parentNode?.body || this.parentElement;
            }
            $removeClass(cls){
                this.classList.remove(cls)
            }
            $toggleClass(cls){
                this.classList.toggle(cls)
            }
            clearSettings() {
                globalThis.localStorage.removeItem(this.$$savePath);
            }
            loadSettings(force = false){
                if (!this.$core.saveProps) return;
                this.loadSettings.loadedPath = this.$$savePath;
                const saves = JSON.parse(globalThis.localStorage.getItem(this.$$savePath) || '{}');
                for(const p in this.$core.saveProps) {
                    try{
                        if (force || JSON.stringify(this[p]) === this.$core.saveProps[p])
                            this[p] = saves[p] ?? this[p];
                    }
                    catch (e){
                        console.warn('Incompatible value for save', e)
                    }
                }
                callHook.call(this, 'afterLoadSettings', this.$$savePath);
            }
            saveSettings(){
                if (!this.$core.saveProps) return;
                const saves = {};//JSON.parse(globalThis.localStorage.getItem(this.$$savePath) || '{}');
                for (const name in this.$core.saveProps){
                    const value = this[name];
                    saves[name] = value
                }
                globalThis.localStorage.setItem(this.$$savePath, JSON.stringify(saves));
            }
            debounce(key, handler, delay = 0) {
                if (typeof handler === 'string')
                    handler = this[handler].bind(this);
                let db = this.$core.debounces.get(key);
                if (db)
                    delay ? clearTimeout(db) : cancelAnimationFrame(db);
                const fn = delay ? setTimeout : requestAnimationFrame;
                const t = fn(() => {
                    this.$core.debounces.delete(key);
                    handler();
                }, delay);
                this.$core.debounces.set(key, t)
            }
            interval(key, handler, delay = 0) {
                if (typeof handler === 'string')
                    handler = this[handler].bind(this);
                let task = this.$core.intervals[key];
                if (task) {
                    task.handler = handler;
                } else {
                    const fn = delay ? setTimeout : requestAnimationFrame;
                    const clearFn = delay ? clearTimeout : cancelAnimationFrame;
                    task = {
                        handler,
                        id: fn(() => {
                            clearFn(task.id);
                            this.$core.intervals[key] = undefined;
                            task.handler();
                        }, delay)
                    };
                    this.$core.intervals[key] = task;
                }
            }
            $(path){
                return this.$core.shadowRoot.querySelector(path) || undefined;
            }
            $$(path){
                return Array.from(this.$core.shadowRoot.querySelectorAll(path));
            }
            // get $() {
            //     return this.$refs;
            // }
            get $url() {
                return prototype.$system.url;
            }
            get $dir() {
                return prototype.$system.dir;
            }
            get $$parents() {
                return prototype.$system.parents.filter(i=>typeof i === 'object').map(i => i.prototype.is);
            }
            // get $$imports() {
            //     return ODA.telemetry.imports[prototype.$system.url];
            // }
            get $$modules() {
                return ODA.telemetry.modules[this.$url]?.filter(i => i !== prototype.is) || []
            }
            get $refs() {
                if (!this.$core.refs || Object.keys(this.$core.refs).length === 0) {
                    this.$core.refs = Object.assign({}, this.$core.slotRefs);
                    let els = [...this.$core.shadowRoot.querySelectorAll('*'), ...this.querySelectorAll('*')];
                    els = Array.prototype.filter.call(els, i => i.$ref);
                    for (let el of els) {
                        let ref = el.$ref;
                        let arr = this.$core.refs[ref];
                        if (Array.isArray(arr))
                            arr.push(el);
                        else if (el.$for)
                            this.$core.refs[ref] = [el];
                        else
                            this.$core.refs[ref] = el;
                    }
                }
                return this.$core.refs;
            }
            async(handler, delay = 0) {
                if (typeof handler === 'string')
                    handler = this[handler].bind(this);
                return delay ? setTimeout(handler, delay) : requestAnimationFrame(handler)
            }
            /**
             * @argument {string|Function} handler
             * @argument {number} tacts
             */
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
            $super(parentName, name, ...args) {
                const components = ODA.telemetry.components;

                if (parentName && components[parentName]) {
                    const proto = components[parentName].prototype;
                    const descriptor = Object.getOwnPropertyDescriptor(proto, name);
                    if (!descriptor){
                        throw new Error(`Not found super: "${name}" `);
                    }
                    if (typeof descriptor.value === 'function')
                        return descriptor.value.call(this, ...args);
                    if (descriptor.get)
                        return descriptor.get.call(this);
                    return undefined;
                    // const method = proto[name];
                    // if (typeof method === 'function') return method.call(this, ...args);
                }
               /* const getIds = (p) => {
                    const res = [];
                    let id = p.extends;
                    if (id) {
                        const ids = id.split(/, *!/).filter(i => i !== 'this');
                        for (const id of ids) {
                            res.push(id);
                            res.push(...getIds(components[id].prototype));
                        }
                    }
                    return res;
                };
                const curId = prototype.is;
                const curMethod = components[curId].prototype.methods[name] || components[curId].prototype[name];
                const ids = getIds(components[curId].prototype);
                for (const id of ids) {
                    const proto = components[id].prototype;
                    const method = proto.methods[name] || proto[name];
                    if (curMethod !== method && typeof method === 'function') {
                        return method.call(this, ...args);
                    }
                }
                throw new Error(`Not found super method: "${name}" `);*/
            }
        }
        Object.defineProperty(odaComponent, 'name', {value: 'odaComponent'})
        odaComponent.__model__ = prototype;
        for(const name in prototype.props){
            const prop = prototype.props[name];
            if (prop.save) {
                core.saveProps =  core.saveProps || {};
                core.saveProps[name] = JSON.stringify(typeof prop.default === 'function'?prop.default():prop.default);
            }
        }
        while (prototype.observers.length > 0) {
            let func = prototype.observers.shift();
            let expr;
            let fName;
            if (typeof func === 'function') {
                fName = func.name;
                expr = func.toString();
                expr = expr.substring(0, expr.indexOf('{')).replace('async', '').replace('function', '').replace(fName, '');
            }
            else {
                fName = func.slice(0, func.indexOf('(')).trim();
                expr = func.substring(func.indexOf('(')).trim();
            }
            expr = expr.replace('(', '').replace(')', '').trim();
            const vars = expr.split(',').map((prop, idx) => {
                prop = prop.trim();
                return { prop, func: createFunc('', prop, prototype), arg: 'v' + idx };
            });
            if (typeof func === 'string') {
                const args = vars.map(i => {
                    const idx = func.indexOf('(');
                    func = func.slice(0, idx) + func.slice(idx).replace(i.prop, i.arg);
                    return i.arg;
                }).join(',');
                func = createFunc(args, func, prototype)// prototype[fName];
            }
            if (!func) throw new Error(`function "${fName}" for string observer not found!!`)
            const obsName = `$obs$${fName}`;
            function funcObserver() {
                let params = vars.map(v => {
                    return v.func.call(this);
                });
                if (!params.includes(undefined)) {
                    this.async(() => {
                        params = vars.map(v => {
                            return v.func.call(this);
                        });
                        func.call(this, ...params)
                    });
                }
                return true;
            }
            if (!fName) throw new Error('ERROR: no function name!');
            // Object.defineProperty(prototype.props, obsName, {
            //     get: funcObserver
            // })
            prototype.props[obsName] = {
                get: funcObserver
            };
            prototype.$system.observers.push(obsName);
        }
        for (let name in prototype.props) {
            const prop = prototype.props[name];
            prop.name = name;
            prop.attrName = prop.attrName || name.toKebabCase();
            if (prop.reflectToAttribute)
                core.reflects.add(prop)
            const key = '#' + name;
            const desc = { enumerable: !name.startsWith('_'), configurable: true };
            prototype.$system.blocks[key] = Object.create(null);
            prototype.$system.blocks[key].getter = prop.get;
            prototype.$system.blocks[key].setter = prop.set;
            prototype.$system.blocks[key].prop = prop;
            prototype.$system.blocks[key].key = key;
            desc.get = function () {
                let val = this[key];
                if (val === undefined) {
                    val = this.$proxy[key];
                }
                else if (KERNEL.dpTarget) {
                    const block = this.__op__.blocks[key];
                    if (!block?.deps.includes(KERNEL.dpTarget))
                        val = this.$proxy[key];
                }

                return val;
            }
            desc.set = function (val) {
                const old = this[key];
                if (val == old) return;
                val = toType(prop.type, val);
                if (val === old) return;

                this.$proxy[key] = val;
                if (prop.reflectToAttribute){
                    this.interval(key+'-attr', ()=>{
                        if (val || val === 0)
                            this.setAttribute(prop.attrName, val === true ? '' : val);
                        else
                            this.removeAttribute(prop.attrName);
                    })
                }

            }
            Object.defineProperty(odaComponent.prototype, name, desc);
            Object.defineProperty(core.defaults, name, {
                configurable: true,
                enumerable: true,
                get() {
                    if (prop.get)
                        return undefined;
                    if (typeof prop.default === "function")
                        return prop.default.call(this);
                    else if (Array.isArray(prop.default))
                        return Array.from(prop.default);
                    else if (isObject(prop.default))
                        return Object.assign({}, prop.default);
                    return toType(prop.type, prop.default);
                }
            })
        }
        core.node.children = prototype.template ? parseJSX(prototype, prototype.template) : [];
        let descriptors = Object.getOwnPropertyDescriptors(prototype);
        for (let name in descriptors) {
            const desc = descriptors[name];
            if (typeof desc.value === 'function') {
                Object.defineProperty(odaComponent.prototype, name, {
                    enumerable: true,
                    writable: true,
                    value: function (...args) {
                        return desc.value.call(this, ...args);
                    }
                });
            }
            else if (!KERNEL.reservedWords.includes(name)) {
                if ('value' in desc) {
                    const def = desc.value;
                    Object.defineProperty(core.defaults, name, {
                        configurable: true,
                        enumerable: true,
                        get() {
                            if (Array.isArray(def))
                                return Array.from(def);
                            else if (isObject(def))
                                return Object.assign({}, def);
                            return def;
                        }
                    });
                    desc.value = undefined;
                    delete desc.value;
                    delete desc.writable;
                    delete desc.enumerable;
                }
                const key = '#' + name;
                prototype.$system.blocks[key] = Object.create(null);
                Object.assign(prototype.$system.blocks[key], { key, getter: desc.get, setter: desc.set, prop: { attrName: name.toKebabCase() } });
                desc.get = function () {
                    let val = this[key];
                    if (val === undefined) {
                        val = this.$proxy[key];
                    }
                    else if (KERNEL.dpTarget) {
                        const block = this.__op__.blocks[key];
                        if (!block?.deps.includes(KERNEL.dpTarget)) {
                            val = this.$proxy[key];
                        }
                    }
                    return val;
                }
                desc.set = function (v) {
                    this.$proxy[key] = v;
                }
                Object.defineProperty(odaComponent.prototype, name, desc);
                if(name in core.prototype){
                    // console.log(name);
                    Object.defineProperty(core.defaults, name, {
                        configurable: true,
                        enumerable: true,
                    })
                }
            }
        }
        Object.defineProperty(odaComponent, 'name', {
            writable: false,
            value: prototype.is
        });
        return odaComponent
    }
    function convertPrototype(prototype, parents) {
        prototype.$system.parents = parents;
        prototype.$system.blocks = Object.create(null);
        prototype.props = prototype.props || {};
        prototype.observers = prototype.observers || [];
        prototype.$system.observers = prototype.$system.observers || [];

        for (let key in prototype.props) {
            let prop = prototype.props[key];
            // if (prop === undefined) continue;
            let getter = prop && (prop.get || (typeof prop === 'function' && !prop.prototype && prop));
            if (getter) {
                if (typeof prop === 'function')
                    prototype.props[key] = prop = {};
                if (typeof getter === 'string')
                    getter = prototype[getter];
                prop.get = getter;
            }
            let setter = prop && prop.set;
            if (setter) {
                if (typeof setter === 'string')
                    setter = prototype[setter];
                delete prop.observe;
                prop.set = setter;
            }
            if (typeof prop === "function") {
                prop = { type: prop };
            }
            else if (Array.isArray(prop)) {
                // const array = [].concat(prop);
                prop = { default: prop, type: prop.__proto__.constructor };//{ default: function () { return [].concat(array); }, type: Array };
            }
            else if (prop !== null && typeof prop !== "object") {
                prop = { default: prop, type: prop.__proto__.constructor };
            }
            else if (prop === null) {
                prop = { type: Object, default: null };
            }
            else if (Object.keys(prop).length === 0 || (!getter && !setter && prop.default === undefined && !prop.type && !('shared' in prop))) {
                prop = { default: prop, type: Object };
            }
            if (prop.shared) {
                prototype.$system.shared = prototype.$system.shared || [];
                prototype.$system.shared.add(key)
            }
            const def = (prop.default === undefined) ? (prop.value || prop.def) : prop.default;
            if (def !== undefined){
                if (typeof def === 'function')
                    console.warn('Error default value type', prototype.is, prop)

                prop.default = def;
            }

            delete prop.value;
            if (prop.default !== undefined && typeof prop.default !== 'function') {
                switch (prop.type) {
                    case undefined: {
                        if (Array.isArray(prop.default)) {
                            const array = [].concat(prop.default);
                            prop.default = function () { return [].concat(array) };
                            prop.type = Array;
                        }
                        else if (isNativeObject(prop.default)) {
                            const obj = Object.assign({}, prop.default);
                            prop.default = function () { return Object.assign({}, obj) };
                            prop.type = Object;
                        }
                        else if (prop.default === null)
                            prop.type = Object;
                        else {
                            prop.type = prop.default.__proto__.constructor;
                        }
                    } break;
                    case Object: {
                        if (prop.default) {
                            const obj = Object.assign({}, prop.default);
                            prop.default = function () { return Object.assign({}, obj) };
                        }
                    } break;
                    case Array: {
                        const array = Array.from(prop.default);
                        prop.default = function () { return Array.from(array) };
                    } break;
                }
            }
            prototype.props[key] = prop;
        }
        Object.defineProperty(prototype, 'saveKey', {
            set(val){
                this.debounce('loadSettings', () => {
                    this.loadSettings(true);
                });
            }
        })
        if (!('$$savePath' in prototype) && !('$$savePath' in prototype.props)) {
            Object.defineProperty(prototype, '$$savePath', {
                get() {
                    let key = (this.$core.saveKey || this.saveKey || '');
                    return `${this.localName}${key && '/'+key}`;
                }
            })
        }

        prototype.listeners ??= {};
        prototype.keyBindings ??= {};
        prototype.listeners.keydown = function (e) {
            const e_key = e.key.toLowerCase();
            const e_code = e.code.toLowerCase();
            const key = Object.keys(prototype.keyBindings).find(key => {
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
                // e.preventDefault();
                let handler = prototype.keyBindings[key];
                if (typeof handler === 'string')
                    handler = prototype[handler];
                handler.call(this, e);
            }
        }

        for (let event in prototype.listeners) {
            const handler = prototype.listeners[event];
            prototype.listeners[event] = (typeof handler === 'string') ? prototype[handler] : handler;
        }

        parents.forEach(parent => {
            if (typeof parent === 'object') {
                prototype.$system.observers.add(...parent.prototype.$system.observers);
                if (parent.prototype.$system.shared) {
                    prototype.$system.shared = prototype.$system.shared || [];
                    prototype.$system.shared.add(...parent.prototype.$system.shared)
                }
                for (let key in parent.prototype.props) {
                    let p = parent.prototype.props[key];
                    let me = prototype.props[key];
                    if (!me) {
                        p = Object.assign({}, p);
                        p.extends = parent.prototype.is;
                        prototype.props[key] = p;
                    }
                    else {

                        for (let k in p) {
                            if (!(k in me)) {
                                me[k] = p[k];
                            }
                            else if (k === 'type' && p[k] && me[k] !== p[k]) {
                                const _types = new Set([...(Array.isArray(me[k]) ? me[k] : [me[k]]), ...(Array.isArray(p[k]) ? p[k] : [p[k]])]);
                                me[k] = [..._types];
                            }
                        }
                        if (!me.extends)
                            me.extends = parent.prototype.is;
                        else
                            me.extends = me.extends + ', ' + parent.prototype.is;
                    }
                }
                for (let key in parent.prototype.keyBindings) {
                    if (!Object.getOwnPropertyDescriptor(prototype.keyBindings, key)) {
                        const par = Object.getOwnPropertyDescriptor(parent.prototype.keyBindings, key);
                        prototype.keyBindings[key] = par.value;
                    }
                }
                for (let key in parent.prototype.listeners) {
                    if (!Object.getOwnPropertyDescriptor(prototype.listeners, key)) {
                        const par = Object.getOwnPropertyDescriptor(parent.prototype.listeners, key);
                        prototype.listeners[key] = par.value;
                    }
                }
                for (let key in parent.prototype) {
                    const p = Object.getOwnPropertyDescriptor(parent.prototype, key);
                    const self = Object.getOwnPropertyDescriptor(prototype, key);
                    if (typeof p.value === 'function') {
                        if (!self) {
                            prototype[key] = function (...args) {
                                return p.value.call(this, ...args);
                            }
                        }
                        else if (hooks.includes(key)) {
                            prototype[key] = function () {
                                p.value.apply(this);
                                if (self)
                                    self.value.apply(this);
                            }
                        }
                    }
                    else if (!self && !KERNEL.reservedWords.includes(key)) {
                        Object.defineProperty(prototype, key, p)
                    }
                }
            }
        });
    }
    const regExImport = /import\s+?(?:(?:(?:[\w*\s{},]*)\s+from\s+?)|)(?<name>(?:".*?")|(?:'.*?'))[\s]*?(?:;|$|)/g;
    const regexUrl = /https?:\/\/(?:.+\/)[^:?#&]+/g
    async function ODA(prototype = {}) {
        prototype.is = prototype.is.toLowerCase();
        const proto = ODA.telemetry.components[prototype.is];
        if (proto)
            return proto.prototype;
        if(!prototype.$system){
            prototype.$system = Object.create(null)
            const matches = (new Error()).stack.match(regexUrl);
            prototype.$system.url = matches[matches.length - 1];
            prototype.$system.dir = prototype.$system.url.substring(0, prototype.$system.url.lastIndexOf('/')) + '/';
            prototype.extends = Array.isArray(prototype.extends) ? prototype.extends : prototype.extends?.split(',') || [];
            ODA.deferred[prototype.is] = {
                url: prototype.$system.url,
                is: prototype.is,
                reg: async (context)=>{
                    prototype.$system.reg = prototype.$system.reg || regComponent(prototype, context);
                    await prototype.$system.reg;
                    return ODA.telemetry.components[prototype.is];
                }
            }
            setTimeout(() => {
                ODA.calledDeferred.reduce((res, d, i) => {
                    if (d.tagName === prototype.is) {
                        res.push(i);
                        ODA.deferred[d.tagName]?.reg(d.context);
                    }
                    return res;
                }, []).forEach(i => ODA.calledDeferred.splice(i, 1));
            });
        }
        return prototype;
    }
    ODA.regHotKey = function (key, handle){
        ODA.$hotKeys = ODA.$hotKeys || {};
        ODA.$hotKeys[key] =  handle;
    }
    document.addEventListener('keydown', async (e) =>{
        if (!e.code.startsWith('Key')) return;
        let key = (e.ctrlKey ? 'ctrl+' : '') + (e.altKey ? 'alt+' : '') + (e.shiftKey ? 'shift+' : '') + e.code.replace('Key', '').toLowerCase();
        ODA.$hotKeys?.[key]?.(e);
    });
    ODA.regTool = function (name){
        return ODA[name] || (ODA[name] = Object.create(null));
    }
    ODA.rootPath = import.meta.url;
    ODA.rootPath = ODA.rootPath.split('/').slice(0,-1).join('/'); //todo что-то убрать
    window.ODA = ODA;
    Object.defineProperty(ODA, 'cssRules', {
        get(){
            let rules = ODA['#cssRules'];
            if (!rules || !Object.keys(rules).length){
                ODA['#cssRules'] = rules = Object.create(null);
                for (let style of document.querySelectorAll('style')){
                    for (let i of style.sheet.cssRules) {
                        if (i.style) {
                            for (let key of i.style) {
                                let val = i.style.getPropertyValue(key);
                                if (!/^--/.test(key)) continue;
                                val = val.toString().trim().replace(/^{|}$/g, '').trim().split(';').join(';');
                                while (val.includes('@apply')){
                                    val = ODA.applyStyleMixins(val);
                                }
                                rules[key] = val;
                            }
                        }
                    }
                }
            }
            return rules;
        }
    })
    // ODA.cssRules
    ODA.applyStyleMixins = function (styleText) {
        while (styleText.match(commentRegExp)) {
            styleText = styleText.replace(commentRegExp, '');
        }
        let matches = styleText.match(regExpApply);
        if (matches) {
            matches = matches.map(m => m.replace(/@apply\s*/, ''));
            for (let v of matches) {
                const rule = ODA.cssRules[v];
                styleText = styleText.replace(new RegExp(`@apply\\s+${v}\\s*;?`, 'g'), rule);
            }
            if (styleText.match(regExpApply))
                styleText = ODA.applyStyleMixins(styleText);
        }
        return styleText;
    }
    class VNode {
        constructor(el, vars) {
            this.id = ++VNode.sid;
            this.vars = vars;
            el.$node = this;
            this.el = el;
            this.tag = el.nodeName;
            this.fn = {};
            this.children = [];
            if (el.nodeName === 'svg' || (el.parentNode && el.parentNode.$node && el.parentNode.$node.svg))
                this.svg = true;
            this.listeners = {};
        }
    }
    VNode.sid = 0
    const dirRE = /^((oda|[a-z])?-)|~/;
    //var localizationPhrase = {}
    function parseJSX(prototype, el, vars = []) {
        if (typeof el === 'string') {
            let tmp = document.createElement('template');
            tmp.innerHTML = el;
            tmp = tmp.content.childNodes;
            return Array.prototype.map.call(tmp, el => parseJSX(prototype, el)).filter(i => i);
        }
        let src = new VNode(el, vars);
        if (el.nodeType === 3) {
            let value = el.textContent.trim();
            if (!value) return;
            src.translate = (el.parentElement?.nodeName === 'STYLE' || el.parentElement?.getAttribute('is') === 'style') ? false : true;
            // function translateVal (val) {
            //     if (typeof val !== 'string') return val;
            //     const testLeter =  new RegExp('[a-z].*?','gi')
            //     //const sMF = (v,sp) => { retutn v.split(sp).map(a => a.trim()).filter(a =>  testLeter.test(a) ) }
            //     const phraze = val.split(/\r?\n/).map(a => a.trim()).filter(a =>  testLeter.test(a) )
            //     const words = val.split(/\s+/).map(a => a.trim()).filter(a =>  testLeter.test(a) )
            //     //
            //     phraze.forEach(v => ODA.localization.phraze[v]='')
            //     words.forEach(v => ODA.localization.words[v]='')

            //     const rePhraze = new RegExp('\\b' + Object.keys( ODA.localization.dictionary.phraze ).join('\\b|\\b') + '\\b',"gi");
            //     const reWords = new RegExp('\\b' + Object.keys(ODA.localization.dictionary.words).join('\\b|\\b') + '\\b',"gi");
            //     //console.log(reWords)
            //     var newVal = val.replaceAll(rePhraze, md => ODA.localization.dictionary.phraze[md] )
            //                     .replaceAll(reWords, md => ODA.localization.dictionary.words[md]);
            //     //console.log(val, newVal)
            //     return newVal
            // }
            if ( (/\{\{((?:.|\n)+?)\}\}/g.test(value)) || ( src.translate /*&& ODA.localization*/ ) ) {
                let expr = value.replace(/^|$/g, "'").replace(/{{/g, "'+(").replace(/}}/g, ")+'").replace(/\n/g, "\\n").replace(/\+\'\'/g, "").replace(/\'\'\+/g, "");
                if (prototype[expr])
                    expr += '()';
                const fn = createFunc(vars.join(','), expr, prototype);
                src.text = src.text || [];
                src.text.push(function textContent($el) {
                    let val = exec.call(this, fn, $el.$for);
                    if (typeof val === 'object') return;
                    //todo  localization
                    if (src.translate && /*ODA.localization?.dictionary &&*/ val) {
                        //console.log('!!')
                        val = ODA.translate(val) //translateVal(val)
                    }
                    if ($el.textContent == val) return
                    $el.textContent = val;
                });
            }
            else {
                //todo  localization
                src.textContent = value;
            }
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
                    if (tags[name])
                        new Tags(src, name, expr, vars, prototype);
                    else if (directives[name])
                        new Directive(src, name, expr, vars, prototype);
                    else if (name === 'for')
                        return forDirective(prototype, src, name, expr, vars, attr.name);
                    else {
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
                            const func = new Function(params.join(','), `with (this) {${expr} = $value}`);
                            src.listeners[name + '-changed'] = function func2wayBind(e, d) {
                                if (!e.target.parentNode) return;
                                let res = e.detail.value === undefined ? e.target[name] : e.detail.value;
                                if (e.target.$node.vars.length) {
                                    let idx = e.target.$node.vars.indexOf(expr);
                                    if (idx % 2 === 0) {
                                        const array = e.target.$for[idx + 2];
                                        const index = e.target.$for[idx + 1];
                                        array[index] = e.target[name];
                                        return;
                                    }
                                }
                                if (res !== undefined || e.target.$for !== undefined) //todo понаблюдать
                                    exec.call(this, func, [res, ...(e.target.$for || [])]);
                            };
                            src.listeners[name + '-changed'].notify = name;
                            src.listeners[name + '-changed'].expr = expr;
                        }
                        const h = function (params) {
                            return exec.call(this, fn, params);
                        };
                        h.modifiers = modifiers;
                        src.bind = src.bind || {};
                        src.bind[name.toCamelCase()] = h;
                    }
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
                    const params = ['$event', '$detail', ...(vars || [])];
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
                            result = exec.call(this, fn, [e, e.detail, ...(e.target.$for || [])]);
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
                else if (name === 'ref') {
                    new Directive(src, name, "\'" + expr + "\'", vars);
                }
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
                        src.bind[key] = function (params, $el) {
                            let result = exec.call(this, fn, params);
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
        return src;
    }
    const tags = {
        if(tag, fn, p, $el) {
            let t = exec.call(this, fn, p);
            return t ? tag : '#comment';
        },
        'else-if'(tag, fn, p, $el) {
            if (!$el || ($el.previousElementSibling && $el.previousElementSibling.nodeType === 1))
                return '#comment';
            return exec.call(this, fn, p) ? tag : '#comment';
        },
        else(tag, fn, p, $el) {
            if (!$el || ($el.previousElementSibling && $el.previousElementSibling.nodeType === 1))
                return '#comment';
            return tag;
        },
        is(tag, fn, p) {
            if (tag.startsWith('#'))
                return tag;
            return (exec.call(this, fn, p) || '')?.toUpperCase() || tag;
        }
    };
    const directives = {
        wake($el, fn, p) {
            $el.$wake = exec.call(this, fn, p);
        },
        'save-key'($el, fn, p) {
            if ($el.$core) {
                const key = exec.call(this, fn, p);
                if ($el.$core.saveKey === key) return;
                $el.$core.saveKey = key;
            }
        },
        props($el, fn, p) {
            const props = exec.call(this, fn, p);
            for (let i in props) {
                if (i.startsWith('#') || i.startsWith('$')) continue;
                let val = props[i];
                if (val === undefined) continue;
                const map = { class: ' ', style: ';' };
                if (Object.keys(map).includes(i)) {
                    const oldVal = $el.getAttribute(i);
                    // список уникальных значений из старого и нового значения
                    if (oldVal) val = [...new Set([...oldVal.trim().replace(/ +/g, ' ').split(map[i]), ...val.trim().replace(/ +/g, ' ').split(map[i])])].join(map[i]);
                }
                $el.setProperty(i, val);
            }
        },
        ref($el, fn, p) {
            const ref = exec.call(this, fn, p);
            if ($el.$ref === ref) return;
            $el.$ref = ref;
            this.$core.refs = null;
        },
        show($el, fn, p) {
            $el.style.display = exec.call(this, fn, p) ? '' : 'none';
        },
        html($el, fn, p) {
            const val = exec.call(this, fn, p) ?? '';
            if ($el.__innerHTML === val) return;
            $el.innerHTML = $el.__innerHTML = val;
        },
        text($el, fn, p) {
            $el.textContent = exec.call(this, fn, p) ?? '';
        },
        class($el, fn, p) {
            let s = exec.call(this, fn, p) ?? '';
            if (Array.isArray(s))
                s = s[0];
            if (!Object.equal($el.$class, s)) {
                $el.$class = s;
                if (typeof s === 'object')
                    s = Object.keys(s).filter(i => s[i]).join(' ');
                if ($el.$node?.vals?.class)
                    s = (s ? (s + ' ') : '') + $el.$node.vals.class;
                $el.setAttribute('class', s);
            }
        },
        style($el, fn, p) {
            let s = exec.call(this, fn, p) ?? '';
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
                $el.setAttribute('style', s);
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
        const newVars = expr.replace(/\s(in|of)\s/, '\n').split('\n');
        expr = newVars.pop();
        const params = (newVars.shift() || '').replace('(', '').replace(')', '').split(',').map(s => s.trim());
        forVars.forEach((varName, i) => {
            let p = (params[i] || forVars[i]).trim();
            let pp = p;
            let idx = 1;
            while (vars.find(v => p === v)) {
                p = pp + idx; ++idx;
            }
            newVars.push(p);
        });
        src.vars = [...vars];
        src.vars.push(...newVars);
        src.el.removeAttribute(attrName);
        const child = parseJSX(prototype, src.el, src.vars);
        const fn = createFunc(src.vars.join(','), expr, prototype);
        const h = async function (p = []) {
            let items = exec.call(this, fn, p);
            if (items instanceof Promise)
                items = await items;
            else if (typeof items === 'string')
                items = items.split('');
            else if (isObject(items) && !Array.isArray(items)){
                const forFunc = (key, index)=>{
                    return {child, params: [...p, items[key], index, items, key]}
                }
                return Object.keys(items).map(forFunc);
            }
            if (!Array.isArray(items)) {
                items = +items || 0;
                if (items < 0)
                    items = 0
                items = new Array(items);
                if (items < 0)
                    items = 0;
                for (let i = 0; i < items.length; items[i++] = i);
            }
            const forFunc = (item, index)=>{
                return { child, params: [...p, item, index, items, index] }
            }
            return items.map(forFunc);
        };
        h.src = child;
        return h;
    }


    // const  _appendChild = HTMLElement.prototype.appendChild;
    // HTMLElement.prototype.appendChild = function (tag, ...args){
    //     ODA.tryReg(tag.localName);
    //     return _appendChild.call(this, tag, ...args);
    // }
    const  _createElement = document.createElement;
    document.createElement = function (tag, ...args){
        ODA.tryReg(tag.toLowerCase());
        return _createElement.call(this, tag, ...args);
    }
    function createElement(src, tag, old) {
        let $el;
        if (tag === '#comment')
            $el = document.createComment((src.textContent || src.id) + (old ? (': ' + old.tagName) : ''));
        else if (tag === '#text')
            $el = document.createTextNode(src.textContent || '');

        else {
            if (src.svg)
                $el = document.createElementNS(svgNS, tag.toLowerCase());
            else {
                $el = document.createElement(tag);
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
                    this.$core.resize.observe($el);
                    this.$core.intersect.observe($el);
                }
            }

            if (src.attrs)
                for (let i in src.attrs)
                    $el.setAttribute(i, src.attrs[i]);
            for (const e in src.listeners || {}) {
                const event = (ev) => {
                    src.listeners[e].call(this, ev);
                }
                $el.addEventListener(e, event);
            }
        }
        $el.$node = src;
        $el.domHost = this;
        return $el;
    }
    let inRender = false;
    async function render(renderId) {
        if (!inRender) {
            inRender = true;
            await updateDom.call(this, this.$core.node, this.$core.shadowRoot, renderId);
            inRender = false;
        }
    }
    async function updateDom(src, $el, renderId, $parent, pars) {
        if (renderId !== renderCounter)
            return;
        if ($parent) {
            let tag = src.tag;
            if (src.tags) {
                for (let h of src.tags)
                    tag = h.call(this, tag, src.fn[h.name], pars, $el);
            }
            if (!$el) {
                $el = createElement.call(this, src, tag);
                $parent.appendChild($el);
            }
            else if ($el.$node && $el.$node.id !== src.id) {
                const el = createElement.call(this, src, tag);
                if ($parent.contains($el)){
                    $parent.insertBefore(el, $el);

                }else{
                    $parent.replaceChild(el, $el);
                }
                $el = el;
            }
            else if ($el.slotTarget) {
                $el = $el.slotTarget;
            }
            else if ($el.nodeName !== tag) {
                const el = createElement.call(this, src, tag, $el);
                $parent.replaceChild(el, $el);
                el.$ref = $el.$ref;
                $el = el;
            }
        }
        if ($el.localName in ODA.deferred)
            return;

        $el.$wake = $el.$wake || this.$wake;
        $el.$for = pars;
        const ch = src.children.length && $el.children && (!$el.$sleep || $el.$wake || src.svg || $el.localName === 'slot')
        if (ch) {
            let idx = 0;
            for (let i = 0, l = src.children.length; i < l; i++) {
                let h = src.children[i];
                if (typeof h === "function") {
                    const items = await h.call(this, pars)
                    const children = $el.childNodes;
                    const list = [];
                    for(let j = 0; j<items.length; j++){
                        const elem = children[idx + j];
                        const node = items[j]
                        list.push(updateDom.call(this, node.child, elem, renderId, $el, node.params))
                    }
                    await Promise.all(list);
                    idx += items.length;
                    let el = $el.childNodes[idx];
                    while (el && el.$node === h.src) {
                        $el.removeChild(el);
                        el = $el.childNodes[idx];
                    }
                }
                else {
                    let el = $el.childNodes[idx];
                    while (el && !el.$node){
                        idx++
                        el = $el.childNodes[idx];
                    }
                    await updateDom.call(this, h, el, renderId, $el, pars);
                    idx++;
                }
            }
        }
        if ($el.nodeType !== 1) {
            for (let h of src.text || [])
                h.call(this, $el);
            return;
        }




        if (src.dirs)
            for (let h of src.dirs)
                h.call(this, $el, src.fn[h.name], pars);
        if (src.bind)
            for (let i in src.bind) {
                const b = src.bind[i].call(this, pars, $el);
                const listener = src.listeners[i.toKebabCase() + '-changed'];
                if (i.includes('.') && listener) {
                    const pathToObj = i.slice(0, i.lastIndexOf('.'));
                    const propName = i.slice(i.lastIndexOf('.') + 1);
                    const obj = (new Function(`with(this){return ${pathToObj}}`)).call($el);
                    const bottUpdates = obj?.__op__?.blocks?.[propName]?.updates;
                    const topUpdates = new Function(`with(this){return __op__.blocks['${listener.expr}'] || __op__.blocks['#${listener.expr}']}`).call(this, listener)?.updates ?? 0;
                    if (bottUpdates > topUpdates && $el.fire) {
                        this.setProperty(listener.expr, obj[propName]);
                    } else {
                        $el.setProperty(i, b);
                    }
                } else {
                    if (b === undefined && listener && $el.fire) {
                        requestAnimationFrame(() => {
                            $el.fire(i + '-changed');
                        });
                    } else  {
                        $el.setProperty(i, b);
                    }
                }

            }

        this.$core.prototype.$system.observers?.forEach(name => {
            return this[name];
        });

        if (!$el.$sleep || this.$wake){
            if ($el.$core && this.isConnected) {
                updateDom.call($el, $el.$core.node, $el.$core.shadowRoot, renderId);
            }
            else if ($el.localName === 'slot') {
                const elements = $el.assignedElements?.() || [];
                for (let el of elements) {
                    if (el.$core && !el.$sleep) {
                        updateDom.call(el, el.$core.node, el.$core.shadowRoot, renderId);
                    }
                }
            }
        }


        if (!$el.slot || $el.slotProxy || $el.slot === '?' || this.slot === '?' || $el.parentElement?.slot)
            return;
        // console.warn('SLOT', this.$$id, $el.$$id)
        this.$core.slotted.add($el);
        this.$core.intersect.unobserve($el);
        const el = $el.slotProxy || createElement.call(this, src, '#comment');
        el.slotTarget = $el;
        $el.slotProxy = el;
        el.textContent += `-- ${$el.localName} (slot: "${$el.slot}")`;

        if ($el.$ref) {
            let arr = this.$core.slotRefs[$el.$ref];
            if (Array.isArray(arr))
                arr.push($el);
            else if ($el.$for)
                this.$core.slotRefs[$el.$ref] = [$el];
            else
                this.$core.slotRefs[$el.$ref] = $el;
        }
        $parent.replaceChild(el, $el);
        if ($el.slot === '*')
            $el.removeAttribute('slot')
        requestAnimationFrame(() => {
            let host;
            const filter = `slot[name='${$el.slot}']`;
            for (host of this.$core.shadowRoot?.querySelectorAll('*')) {
                if (host.$core?.shadowRoot?.querySelector(filter)) {
                    applySlotByOrder($el, host);
                    return;
                }
            }
            host = this;
            while (host) {
                for (let ch of host.children) {
                    if(ch.$core?.shadowRoot?.querySelector(filter)){
                        applySlotByOrder($el, ch);
                        return;
                    }
                }
                if (host.$core?.shadowRoot?.querySelector(filter)) {
                    applySlotByOrder($el, host);
                    return;
                }
                host = host.domHost || (host.parentElement?.$core && host.parentElement);
            }
            applySlotByOrder($el, this);
        })
    }
    function applySlotByOrder($el, host) {
        const prev = $el.slotProxy?.previousSibling;
        const target = prev instanceof Comment && prev?.slotTarget?.nextSibling || null;
        host.insertBefore($el, target);
    }

    let renderQueue = [], rid = 0, renderCounter = 0
    ODA.render = function (renderer) {
        renderQueue.add(renderer);
        if(rid) return
        rid = requestAnimationFrame(raf);
    }
    async function raf() {
        renderCounter = rid
        while (renderQueue.length){
            await renderQueue.shift()?.(renderCounter);
        }
        rid = 0;
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
            return new Function(vars, `with (this) {return (${expr})}`);
        }
        catch (e) {
            console.error('%c' + expr + '\r\n', 'color: black; font-weight: bold; padding: 4px;', prototype.is, prototype.$system.url, e);
        }
    }
    function exec(fn, p = []) {
        try {
            return fn.call(this, ...p);
        }
        catch (e) {
            console.warn('%c' + fn?.toString() + '\r\n', 'color: blue; padding: 4px;', this, e);
        }
    }
    const forVars = ['item', 'index', 'items', 'key'];
    const svgNS = "http://www.w3.org/2000/svg";
    const modifierRE = /\.[^.]+/g;
    ODA.origin = origin;
    ODA.deferred = {};
    ODA.calledDeferred = [];
    ODA.tryReg = function (tagName, context) {
        if(!tagName?.includes('-'))
            return;
        const def = ODA.deferred[tagName];
        if (def)
            return def.reg(context);
        if (!ODA.calledDeferred.some(d => d.tagName === tagName && d.context === context)){
            ODA.calledDeferred.push({tagName, context});
        }
    }
    ODA.updateStyle=(changes = ODA.cssRules, el)=>{
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
    ODA.telemetry = {
        proxy: 0, modules: {}, imports: {}, regs: {}, components: { count: 0 }, clear: () => {
            for (const i of Object.keys(ODA.telemetry)) {
                if (typeof ODA.telemetry[i] === 'number')
                    ODA.telemetry[i] = 0;
            }
        },
    };
    const cache = {
        fetch: {},
        file: {}
    };
    ODA.loadURL = async function (url) {
        try{
            url = (new URL(url)).href;
        }
        catch (e){
            console.log(e)
        }
        if (!cache.fetch[url])
            cache.fetch[url] = fetch(url);
        return cache.fetch[url];
    };
    ODA.loadJSON = async function (url) {
        if (!cache.file[url]) {
            cache.file[url] = new Promise(async (resolve, reject) => {
                try {
                    const file = await ODA.loadURL(url);
                    const text = await file.json();
                    resolve(text)
                }
                catch (e) {
                    reject(e)
                }
            });
        }
        return cache.file[url];
    };
    ODA.loadHTML = async function (url) {
        if (!cache.file[url]) {
            cache.file[url] = new Promise(async (resolve, reject) => {
                try {
                    const file = await ODA.loadURL(url);
                    const text = await file.text();
                    resolve(domParser.parseFromString(text, 'text/html'))
                } catch (e) {
                    reject(e)
                }
            });
        }
        return cache.file[url];
    };
    const hooks = ['created', 'ready', 'attached', 'detached', 'updated', 'afterLoadSettings', 'destroyed', 'onRender', 'onVisible'];
    const toString = Object.prototype.toString;
    function isNativeObject(obj) {
        return obj && (obj.constructor === Object);// ||  toString.call(c) === '[object Object]';
    }
    class odaEvent {
        constructor(target, handler, ...args) {
            this.handler = handler;
            target.__listeners = target.__listeners || {};
            target.__listeners[this.event] = target.__listeners[this.event] || new Map();
            target.__listeners[this.event].set(handler, this);
            this._target = target;
            this._events = {};
        }
        static remove(name, target, handler) {
            const event = target.__listeners?.[name]?.get(handler);
            event?.delete();
        }
        get event() {
            return 'event'
        }
        addSubEvent(name, handler, useCapture) {
            this._events[name] = handler;
            this._target.addEventListener(name, handler, useCapture);
        }
        delete() {
            for (const name in this._events) {
                if (this._events.hasOwnProperty(name)) {
                    this._target.removeEventListener(name, this._events[name]);
                }
            }
            delete this._events;
        }
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
    class odaEventTap extends odaEvent {
        constructor(target, handler, ...args) {
            super(target, handler, ...args);
            this.addSubEvent('click', (e) => {
                const ce = new odaCustomEvent("tap", { detail: { sourceEvent: e } }, e);
                this.handler(ce, ce.detail);
            });
        }
        get event() {
            return 'tap'
        }
    }
    class odaEventDown extends odaEvent {
        constructor(target, handler, ...args) {
            super(target, handler, ...args);
            this.addSubEvent('mousedown', (e) => {
                const ce = new odaCustomEvent("down", { detail: { sourceEvent: e } }, e);
                this.handler(ce, ce.detail);
            });
        }
        get event() {
            return 'down'
        }
    }
    class odaEventUp extends odaEvent {
        constructor(target, handler, ...args) {
            super(target, handler, ...args);
            this.addSubEvent('mouseup', (e) => {
                const ce = new odaCustomEvent("up", { detail: { sourceEvent: e } }, e);
                this.handler(ce, ce.detail);
            });
        }
        get event() {
            return 'up'
        }
    }
    class odaEventTrack extends odaEvent {
        static removeBack(){
            if (odaEventTrack.back){
                odaEventTrack.back.style.cursor = ''
                odaEventTrack.back?.remove();
            }
            odaEventTrack.handler = undefined;
            odaEventTrack.detail = undefined;
        }
        constructor(target, handler, ...args) {
            super(target, handler, ...args);
            this.addSubEvent('mousedown', (e) => {
                if(e.buttons !== 1) return;
                odaEventTrack.handler ??= handler;
                odaEventTrack.detail ??= {
                    start: {
                        x: e.clientX,
                        y: e.clientY
                    }, ddx: 0, ddy: 0, dx: 0, dy: 0,
                    target: target,
                    startButton: e.button
                };
                window.addEventListener('mousemove', moveHandler);
                window.addEventListener('mouseup', upHandler);
                target.addEventListener('mouseleave', leaveHandler, {once: true});
            });
            const leaveHandler = (e) =>{
                if(e.buttons !== 1) {
                    upHandler(e);
                    return;
                }
                if (!odaEventTrack.back){
                    odaEventTrack.back = document.createElement('div');
                    odaEventTrack.back.style.setProperty('width', '100%');
                    odaEventTrack.back.style.setProperty('height', '100%');
                    odaEventTrack.back.style.setProperty('position', 'fixed');
                    odaEventTrack.back.classList.add('odaTrackBack');
                    odaEventTrack.back.addEventListener('mousedown', () => {
                        odaEventTrack.removeBack()
                    }, {once: true});
                    odaEventTrack.back.addEventListener('mouseup', upHandler, {once: true});
                    odaEventTrack.back.style.setProperty('z-index', '1000000');
                }
                if (!odaEventTrack.back.isConnected)
                    document.body.appendChild(odaEventTrack.back);
            }

            const moveHandler = (e) => {
                if (odaEventTrack.detail && !odaEventTrack.detail.state) {
                    const x = Math.abs(odaEventTrack.detail.start.x - e.clientX);
                    const y = Math.abs(odaEventTrack.detail.start.y - e.clientY)
                    if (Math.max(x,y)>2 || e.type === 'mouseleave') {
                        // target.removeEventListener('mouseleave', moveHandler);
                        odaEventTrack.detail.state = 'start'
                        let ce = new odaCustomEvent("track", {detail: Object.assign({}, odaEventTrack.detail)}, e);
                        odaEventTrack.handler (ce, ce.detail);
                    }
                }
                else if (odaEventTrack.detail) {
                    odaEventTrack.detail.state = 'track';
                    // console.log(target, this.detail.state, e.clientX, e.clientY)
                    if (odaEventTrack.back)
                        odaEventTrack.back.style.cursor = target.style.cursor || odaEventTrack.back.style.cursor || 'pointer';
                    // console.log('back', target.style.cursor)
                    odaEventTrack.detail.x = e.clientX;
                    odaEventTrack.detail.y = e.clientY;
                    odaEventTrack.detail.ddx = -(odaEventTrack.detail.dx - (e.clientX - odaEventTrack.detail.start.x));
                    odaEventTrack.detail.ddy = -(odaEventTrack.detail.dy - (e.clientY - odaEventTrack.detail.start.y));
                    odaEventTrack.detail.dx = e.clientX - odaEventTrack.detail.start.x;
                    odaEventTrack.detail.dy = e.clientY - odaEventTrack.detail.start.y;
                    const ce = new odaCustomEvent("track", { detail: Object.assign({}, odaEventTrack.detail) }, e);
                    odaEventTrack.handler (ce, ce.detail);
                }
            };
            const upHandler = (e) => {
                window.removeEventListener('mousemove', moveHandler);
                window.removeEventListener('mouseup', upHandler);
                target.removeEventListener('mouseleave', leaveHandler);
                if (odaEventTrack.detail?.state){
                    odaEventTrack.detail.ddx = 0;
                    odaEventTrack.detail.ddy = 0;
                    odaEventTrack.detail.state = 'end';
                    const ce = new odaCustomEvent("track", { detail: Object.assign({}, odaEventTrack.detail) }, e);
                    odaEventTrack.handler (ce, ce.detail);
                }
                odaEventTrack.removeBack()
            };
        }
        get event() {
            return 'track'
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
    window.ODARect ??= class ODARect {
        constructor(element) {
            if (element?.host)
                element = element.host;
            const pos = element ? element.getBoundingClientRect() : ODA.mousePos || {};
            this.x = pos.x;
            this.y = pos.y;
            this.top = pos.top;
            this.bottom = pos.bottom;
            this.left = pos.left;
            this.right = pos.right;
            this.width = pos.width;
            this.height = pos.height;
        }
    };
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
        await import('./tools/styles/styles.js');
        ODA.aliases = await ODA.loadJSON(ODA.rootPath + '/aliases.json');
        if (document.body.firstElementChild) {
            if (document.body.firstElementChild.tagName === 'ODA-TESTER') {
                window.document.body.style.visibility = 'hidden';
                import('./tools/tester/tester.js').then(async () => {
                    await ODA.tryReg('oda-tester');
                });
            }
            window.document.body.style.visibility = 'visible';
            document.title = document.title || (document.body.firstElementChild.label || document.body.firstElementChild.name || document.body.firstElementChild.localName);
        }
        ODA.init();
    });
    ODA.init = ()=>{
        for (let tag in ODA.deferred){
            const el = document.querySelector(tag);
            if (el)
                ODA.tryReg(tag);
        }
    }
    Node:{
        Node.prototype.setProperty = function (name, v) {
            if (this.__lockBind === name) return;
            if (this.$core) {
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
                else if (name in this.__proto__) { // понаблюдать 👀
                    try{
                        if (this[name] != v)
                            this[name] = v;
                    }
                    catch (e){
                       // console.log(e)
                    }

                    // if(!(name in this.__proto__)) return;
                }
                else if ((name in (this.props || {})) || (name in (this.$core?.prototype || {}) /*Object.getOwnPropertyDescriptor(this.__proto__, name) ||*/ )/* || name in this.__proto__*/) { // понаблюдать 👀
                    if (this[name] != v)
                        this[name] = v;
                    return;
                        // if(!(name in this.__proto__)) return;
                }
            }
            // понаблюдать 👀
            if (typeof v === 'object' || (typeof v === 'function') || this.nodeType !== 1 || this.$node?.vars.has(name)) {
                if (this[name] != v)
                    this[name] = v;
            }
            else {
                const d = !this.$core && (Object.getOwnPropertyDescriptor(this.__proto__, name) || name in this);

                if (d){
                    if (d === true || (d.set && v !== undefined)) {
                        try{
                            if (!(name === 'src' && this.localName === 'iframe' && typeof(v) === 'string'
                                    && decodeURIComponent(this[name]) === decodeURIComponent(v)))
                                if (this[name] != v)
                                    this[name] = v;
                            if (d !== true) //todo надо думать
                                return;
                        }
                        catch (e){

                        }


                    }
                }
                else
                    name = name.toKebabCase();
                if (!v && v !== 0)
                    this.removeAttribute(name);
                else if (this.getAttribute(name) != v)
                    this.setAttribute(name, v === true ? '' : v);
            }

            if (!this.assignedElements) return;
            for (const ch of this.assignedElements())
                ch.setProperty(name, v)

        };
        Node.prototype.fire = function (event, detail, options = {}) {
            if (!this.$wake && this.$sleep) return;
            event = new odaCustomEvent(event, { detail: { value: detail }, composed: true, ...options});
            this.dispatchEvent(event);
        };
        Node.prototype.render = function () {
            if (!this.$wake && (this.$sleep || !this.$node)) return;
            updateDom.call(this.domHost, this.$node, this, renderCounter, this.parentNode, this.$for);
        };
    }
    Element:{
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
            const func = Element.prototype.addEventListener;
            Element.prototype.addEventListener = function (name, handler, ...args) {
                let event;
                switch (name) {
                    case 'tap':
                        event = new odaEventTap(this, handler, ...args);
                        break;
                    case 'down':
                        event = new odaEventDown(this, handler, ...args);
                        break;
                    case 'up':
                        event = new odaEventUp(this, handler, ...args);
                        break;
                    case 'track':
                        event = new odaEventTrack(this, handler, ...args);
                        break;
                    default:
                        event = func.call(this, name, handler, ...args);
                        break;
                }
                if (!this.__events){
                    Object.defineProperty(this, '__events', {
                        value: new Map()
                    })
                }
                let array = this.__events.get(name);
                if (!array) {
                    array = [];
                    this.__events.set(name, array);
                }
                array.push({ handler, event: event });
                return event;
            };
        }
        if (!Element.prototype.__removeEventListener) {
            const func = Element.prototype.removeEventListener;
            Element.prototype.removeEventListener = function (name, handler, ...args) {
                if (this.__events) {
                    const array = this.__events.get(name) || [];
                    const event = array.find(i => i.handler === handler)
                    if (event) {
                        odaEvent.remove(name, this, handler);
                        const idx = array.indexOf(event);
                        if (idx > -1) {
                            array.splice(idx, 1);
                        }
                    }
                    if (!array.length)
                        this.__events.delete(name);
                }
                func.call(this, name, handler, ...args);
            };
        }
    }
    ODA.translate = (val)=>{
        return val;
    }
    ODA.import = async function (url, context, prototype){
        url = url.trim();
        if (url in ODA.aliases)
            url = ODA.rootPath + '/' + ODA.aliases[url];
        else if (url.startsWith('./'))
            url = prototype.$system.dir + url.substring(1);
        else if (url.startsWith('../'))
            url = prototype.$system.dir +'/'+url;

        url = url.replace(/\/\//g, '/');
        return import(url);
    }
    Qarantine:{
        ODA.createComponent = ODA.createElement = (id, props = {}) => {
            ODA.tryReg(id);
            let el = document.createElement(id);
            for (let p in props) {
                const prop = props[p];
                if (typeof prop === 'function')
                    el.addEventListener(p, prop.bind(el), true)
                else
                    el[p] = prop;
            }
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
        ODA.showFileDialog = (accept = '*', multiple) => {
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
}
export default ODA;