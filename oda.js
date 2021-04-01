/*
 * oda.js v3.0
 * (c) 2019-2020 R.A. Perepelkin
 * Under the MIT License.
 */

window.globalThis = window.globalThis || window;
'use strict';
if (!window.ODA) {
    const domParser = new DOMParser();
    const regExpApply = /(?:@apply\s+)(--[\w-]*\w+)+/g;
    const commentRegExp = /\/\*[^*/]*\*\//igm;
    const regExpParseRule = /([a-z-]+)\s*:\s*((?:[^;]*url\(.*?\)[^;]*|[^;]*)*)\s*(?:;|$)/gi;

    const OBS_PREFIX = '$obs$';

    function getStylesMixins(cssRule, styles = {}) {
        const style = cssRule.style;
        if (style) {
            Array.from(style).filter(s => s.startsWith('--')).forEach(s => {
                const css = getComputedStyle(document.documentElement).getPropertyValue(s);
                styles[s] = ODA.applyStyleMixins(css.replace(/{|}/g, '').trim(), ODA.style && ODA.style.styles || styles);
            });
        }
        return styles;
    }
    function cssRuleParse(rules, res, host = false) {
        for (let rule of rules) {
            if (rule.media) {
                let key = '@media ' + rule.media.mediaText;
                let r = res[key] = res[key] || {};
                cssRuleParse(rule.cssRules, r);
            }
            else if (rule.cssText) {
                if (rule.cssText.includes(':host') && !host) continue;
                const ss = rule.cssText.replace(rule.selectorText, '').match(regExpParseRule);
                if (!ss) continue;
                let sel = rule.selectorText.split(',').join(',\r');
                let r = res[sel] = res[sel] || [];
                r.add(...ss);
            }
        }
    }
    window.addEventListener('mousedown', e => {
        if (e.use) return;
        e.use = true;
        ODA.mousePos = new DOMRect(e.pageX, e.pageY);
        if (window.parent !== window)
            window.parent.dispatchEvent(new MouseEvent('mousedown', e));
        let i = 0;
        let w;
        while (w = window[i]) {
            if (w) {
                const ev = new MouseEvent('mousedown', e);
                ev.use = true;
                w.dispatchEvent(ev);
            }
            i++;
        }
    }, true);


    function isObject(obj) {
        return obj && typeof obj === 'object';
    }
    Object.equal = Object.equal || function (a, b, recurse) {
        if (a === b) return true;
        if (!isObject(a) || !isObject(b)) return false;
        if ((a?.__op__ || a) === (b?.__op__ || b)) return true;
        if (recurse) {
            for (let key in Object.assign({}, a, b))
                if (!Object.equal(b[key], a[key], recurse)) return false;
            return true;
        }
        return false;
    };
    const regExImport = /import\s+?(?:(?:(?:[\w*\s{},]*)\s+from\s+?)|)(?<name>(?:".*?")|(?:'.*?'))[\s]*?(?:;|$|)/g;
    const regexUrl = /https?:\/\/(?:.+\/)[^:?#&]+/g

    async function ODA(prototype = {}, origin, context) {
        const matches = (new Error()).stack.match(regexUrl);
        prototype.url = prototype.url || matches[matches.length - 1];
        prototype.dir = prototype.url.substring(0, prototype.url.lastIndexOf('/')) + '/';
        prototype.extends = Array.isArray(prototype.extends) ? prototype.extends : prototype.extends?.split(',') || [];
        let list = ODA.telemetry.modules[prototype.url];
        if (!list) {
            ODA.telemetry.modules[prototype.url] = list = [];
        }

        list.add(prototype.is)
        ODA.getImports(prototype.url);
        function regComponent() {
            if (window.customElements.get(prototype.is) === undefined) {
                try {
                    let parents = prototype.extends.filter(i => {
                        i = i.trim();
                        return i === 'this' || i.includes('-');
                    });
                    parents = parents.map(ext => {
                        ext = ext.trim();
                        if (ext === 'this')
                            return ext;
                        const parent = ODA.telemetry.components[ext];
                        if (!parent)
                            throw new Error(`Not found inherit parent "${ext}"`);
                        return parent;
                    });
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
                    const namedSlots = template.content.querySelectorAll('slot[name]');
                    for (let slot of namedSlots) {
                        for (let ch of slot.children) {
                            if (ch.attributes['slot']) continue;
                            ch.setAttribute('slot', slot.name);
                        }
                    }
                    prototype.slots = Array.prototype.map.call(namedSlots, el => el.getAttribute('name'));
                    if (ODA.style) {
                        const styles = Array.prototype.filter.call(template.content.children, i => i.localName === 'style');
                        const rules = {};
                        for (let style of styles) {
                            const text = style.textContent;
                            style.textContent = ODA.applyStyleMixins(text, ODA.style.styles);
                            // *** for compatibility with devices from Apple
                            let txtContent = style.textContent.replace(/\}\}/g, ']]]]').replace(/\s\s+/g, ' ').split('}'),
                                arrHost = [];
                            txtContent.map(o => {
                                let s = o.replace(/]]]]/g, '}}').trim() + '}';
                                if (s.includes(':host')) arrHost.push({ cssText: s, selectorText: s.replace(/\{.+\}/, '').trim() });
                            })
                            // ***
                            document.head.appendChild(style);
                            if (style.sheet.cssRules.length && !/\{\{.*\}\}/g.test(style.textContent)) {
                                cssRuleParse(style.sheet.cssRules, rules);
                                if (arrHost.length > 0) cssRuleParse(arrHost, rules, true); // ***
                                style.remove();
                            }
                            else
                                template.content.insertBefore(style, template.content.firstElementChild);
                        }
                        let classes = [];
                        for (let el of template.content.querySelectorAll('[class]')) {
                            for (let cls of el.getAttribute('class').split(' ')) {
                                cls && classes.add(cls);
                            }
                        }
                        for (let i of classes) {
                            let map = ODA.style.styles['--' + i];
                            if (!map) continue;
                            i = `${i}, ::slotted(.${i})`;
                            let r = rules['.' + i] = rules['.' + i] || [];
                            for (let s of map.split(';'))
                                s && r.add(s.trim() + ';')
                        }

                        let attributes = [];
                        for (let el of template.content.querySelectorAll('*')) {
                            for (let attr of el.attributes) {
                                attributes.add(attr.name.replace(/^\.?:+/g, ''));
                            }
                        }
                        for (let i of attributes) {
                            let map = ODA.style.styles['--' + i];
                            if (!map) continue;
                            i = `[${i}], ::slotted([${i}])`;
                            let r = rules[i] = rules[i] || [];
                            for (let s of map.split(';'))
                                s && r.add(s.trim() + ';')
                        }
                        const keys = Object.keys(rules);
                        if (keys.length) {
                            const el = document.createElement('style');
                            el.textContent = keys.map(i => {
                                const rule = rules[i];
                                // i += ', ::slotted('+i+')';
                                if (Array.isArray(rule))
                                    return '\r' + i + '{\r\t' + rule.join('\r\t') + '\r}';
                                return '\r' + i + '{\r\t' + Object.keys(rule).map(i => {
                                    return i + '{\r\t\t' + rule[i].join('\r\t\t') + '\r\t}';
                                }).join('\r') + '\r}';
                            }).join('');
                            template.content.insertBefore(el, template.content.firstElementChild);
                        }
                    }
                    prototype.template = template.innerHTML.trim();
                    ODA.telemetry.components[prototype.is] = { prototype: prototype, count: 0, render: 0 };
                    convertPrototype(parents);
                    let options;
                    let el;
                    if (prototype.extends.length === 1 && !prototype.extends[0].includes('-')) {
                        el = document.createElement(prototype.extends[0]).constructor
                        prototype.native = prototype.extends[0];
                        el = ComponentFactory(el);
                        options = { extends: prototype.extends[0] }
                    }
                    else
                        el = ComponentFactory();
                    window.customElements.define(prototype.is, el, options);
                    ODA.telemetry.last = prototype.is;
                    console.log(prototype.is, '- ok')
                }
                catch (e) {
                    console.error(prototype.is, e);
                }
            }
            else {
                // ODA.warn(prototype.is, 'component has already been registered');
            }
        }

        function observe(key, h) {
            core.observers[key] = core.observers[key] || [];
            core.observers[key].push(h);
        }
        const core = {
            cache: {},
            saveProps: {},
            slotRefs: {},
            slotted: [],
            reflects: [],
            observers: {},
            listeners: {},
            deps: {},
            prototype: prototype,
            node: { tag: '#document-fragment', id: 0, dirs: [] },
            defaults: {},
            intersect: new IntersectionObserver(entries => {
                for (let i = 0, entry, l = entries.length; i < l; i++) {
                    entry = entries[i];
                    if (!!entry.target.$sleep !== entry.isIntersecting) continue;
                    entry.target.$sleep = !entry.isIntersecting;
                    if (!entry.target.$sleep)
                        requestAnimationFrame(() => { entry.target.render.call(entry.target) });
                }
            }, { rootMargin: '20%' }),
            resize: new ResizeObserver(entries => {
                for (const obs of entries) {
                    // костыль для открытия dropdown при крутящейся svg
                    if (obs.target.__events?.has('resize')/* && !obs.target.$node?.svg*/)
                        obs.target.fire('resize');

                }
            })
        };
        function callHook(hook) {
            this.fire(hook);
            const h = prototype[hook];
            if (!h) return;
            h.call(this);
        }
        function ComponentFactory(proto = HTMLElement) {
            class odaComponent extends proto {
                constructor() {
                    super();
                    this.domHost = this.domHost || ODA.currentHost;
                    this.$proxy = makeReactive.call(this, this);
                    this.$core = Object.assign({}, core);
                    this.$core.data = {};
                    this.$core.slotted = [];
                    this.$core.slotRefs = {};
                    this.$core.events = {};
                    this.$core.cache = { observers: {} };
                    this.$core.debounces = new Map();
                    this.$core.intervals = new Map();
                    this.$core.renderer = render.bind(this);
                    this.$core.listeners = {};
                    this.props = prototype.props;
                    const defs = {};
                    for (let i in this.props) {
                        const desc = Object.getOwnPropertyDescriptor(this, i);
                        if (desc) {
                            defs[i] = makeReactive.call(this, desc.value);
                            delete this[i];
                        }
                        else {
                            this['#' + i] = makeReactive.call(this, core.defaults[i]);
                        }
                    }
                    try {
                        this.$core.root = this.$core.shadowRoot = this.attachShadow({ mode: 'closed' });
                    }
                    catch (e) {
                        this.$core.root = this.$core.shadowRoot = new DocumentFragment()
                    }

                    callHook.call(this, 'created');
                    ODA.telemetry.components[prototype.is].count++;
                    ODA.telemetry.components.count++;
                    if (prototype.hostAttributes) {
                        for (let a in prototype.hostAttributes) {
                            let val = prototype.hostAttributes[a];
                            val = (val === '') ? true : (val === undefined ? false : val);
                            this.setProperty(a, val);
                        }
                    }

                    for (let a of Array.prototype.filter.call(this.attributes, attr => attr.name.includes('.'))) {
                        let val = a.value;
                        val = (val === '') ? true : (val === undefined ? false : val);
                        this.setProperty(a.name, val);
                    }
                    for (let i in defs) {
                        this[i] = defs[i];
                    }

                    if (this.domHost) {
                        let descrs = Object.assign({}, Object.getOwnPropertyDescriptors(this.domHost.constructor.prototype), Object.getOwnPropertyDescriptors(this.domHost));
                        for (let key in descrs) {
                            if (key in this) continue;
                            if (key in odaComponent) continue;
                            if (key.startsWith('_')) continue;
                            if (key.startsWith(OBS_PREFIX)) continue;
                            const d = descrs[key];
                            if (!d.get && !d.set) continue;
                            Object.defineProperty(this, key, {
                                get() {
                                    return this.domHost[key];
                                },
                                set(val) {
                                    this.domHost[key] = val;
                                }
                            })
                        }
                    }
                    if (this.$core.shadowRoot) {
                        this.$core.resize.observe(this);
                        this.render(true);
                        callHook.call(this, 'ready');
                    }
                }
                connectedCallback() {
                    for (const prop of core.reflects) {
                        const val = this[prop.name]
                        if (val === false || val === undefined || val === null || val === '')
                            this.removeAttribute(prop.attrName);
                        else
                            this.setAttribute(prop.attrName, val === true ? '' : val);
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
                    callHook.call(this, 'attached');
                }
                disconnectedCallback() {
                    for (let event in prototype.listeners) {
                        this.removeEventListener(event, this.$core.listeners[event]);
                        delete this.$core.listeners[event];
                    }

                    this._retractSlots();
                    callHook.call(this, 'detached');
                }
                get $$savePath() {
                    return `${this.localName}/${(this.$core.saveKey || this.saveKey || '')}`;
                }
                static get observedAttributes() {
                    if (!prototype.observedAttributes) {
                        prototype.observedAttributes = Object.keys(prototype.props).map(key => prototype.props[key].attrName);
                        prototype.observedAttributes.add('slot');
                    }
                    return prototype.observedAttributes;
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
                        case Boolean: {
                            n = (n === '') ? true : (((o === '' && n === undefined) || (n === 'false')) ? false : n);
                        } break;
                        case Object: {
                            n = createFunc('', n, prototype);
                        } break;
                    }

                    if (name === 'slot' && n === '?') {
                        this._retractSlots();
                    }
                    this[name.toCamelCase()] = n;
                }
                updateStyle(styles = {}) {
                    this.$core.style = Object.assign({}, this.$core.style, styles);
                    this.render();
                }
                notify(block, value) {
                    if (block.options.target === this) {
                        this.$core.prototype.$obs?.forEach(name => {
                            this.interval(`observer-${name}`, () => {
                                return this[name];
                            });
                        });
                        const prop = block.prop;
                        if (prop && this.$node?.bind?.[prop.name] && (prop.notify || this.$node.listeners[prop.attrName + "-changed"])) {
                            this.dispatchEvent(new CustomEvent(prop.attrName + '-changed', { detail: { value, src: this }, bubbles: true, cancelable: true }));
                        }
                    }
                    // let root = this;
                    // while (root && root.domHost)
                    //     root = root.domHost;
                    // root.render();
                    this.render();
                }
                render(force) {
                    if (!force && (!this.$core.shadowRoot || this.$core.__inRender)) return;
                    this.$core.__inRender = true;
                    if (force)
                        render.call(this, force)
                    else
                        ODA.render(this.$core.renderer);
                    if (Object.keys(this.$core.saveProps).length) {
                        const savePath = this.$$savePath;
                        if (force) {
                            const s = JSON.parse(localStorage.getItem(savePath));
                            if (isObject(s) && Object.keys(s).length > 0) {
                                for (let p in this.$core.saveProps) {
                                    if (s[p] && typeof s[p] === 'object') {
                                        Object.keys(s[p]).forEach(k => this[p][k] = s[p][k]);
                                    } else this[p] = s[p];
                                }
                            }
                        }
                        else {
                            this.debounce('set-to-local-storage', () => {
                                const s = JSON.parse(localStorage.getItem(savePath)) || {};
                                for (const k in this.$core.saveProps) {
                                    const val = this[k];
                                    let def = this.$core.saveProps[k].default ?? this.$core.saveProps[k]?.get();
                                    if (typeof def === 'function') def = def();
                                    if (isObject(s[k]) && isObject(val) && isObject(def)) {
                                        const res = Object.create(s[k]);
                                        for (const p in val) {
                                            if (val[p] !== def[p]) {
                                                res[p] = val[p];
                                            }
                                        }
                                        s[k] = res;
                                    } else if (s[k] !== val) {
                                        s[k] = val;
                                    }
                                }
                                localStorage.setItem(savePath, JSON.stringify(s));
                            }, 300);
                        }
                    }
                }
                resolveUrl(path) {
                    return prototype.$path + path;
                }
                fire(event, detail) {
                    event = new odaCustomEvent(event, { detail: { value: detail }, composed: true });
                    this.dispatchEvent(event);
                }
                listen(event = '', callback, props = { target: this, once: false, useCapture: false }) {
                    props.target = props.target || this;
                    if (typeof callback === 'string') {
                        callback = this.$core.events[callback] = this.$core.events[callback] || this[callback].bind(this);
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
                get $dirInfo() {
                    return ODA.getDirInfo(this.$dir);
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
                create(tagName, props = {}, inner) {
                    const el = document.createElement(tagName);
                    for (let p in props)
                        el[p] = props[p];
                    if (inner) {
                        if (inner instanceof HTMLElement)
                            el.appendChild(inner);
                        else
                            el.textContent = inner;
                    }
                    return el;
                }
                clearSaves() {
                    globalThis.localStorage.removeItem(this.$$savePath);
                }
                debounce(key, handler, delay = 0) {
                    let db = this.$core.debounces.get(key);
                    if (db)
                        delay ? clearTimeout(db) : cancelAnimationFrame(db);
                    const fn = delay ? setTimeout : requestAnimationFrame;
                    const t = fn(() => {
                        this.$core.debounces.delete(key);
                        handler.call(this);
                    }, delay);
                    this.$core.debounces.set(key, t)
                }
                interval(key, handler, delay = 0) {
                    const fn = delay ? setTimeout : requestAnimationFrame;
                    const clearFn = delay ? clearTimeout : cancelAnimationFrame;
                    let task = this.$core.intervals.get(key);
                    if (task) {
                        task.handler = handler;
                    } else {
                        task = {
                            handler,
                            id: fn(() => {
                                const task = this.$core.intervals.get(key);
                                if (!task) return;
                                clearFn(task.id);
                                task.handler.call(this);
                                this.$core.intervals.delete(key);
                            }, delay)
                        };
                        this.$core.intervals.set(key, task);
                    }
                }
                get $() {
                    return this.$refs;
                }
                get $url() {
                    return prototype.url;
                }
                get $dir() {
                    return prototype.dir;
                }
                get $$parents() {
                    return prototype.parents.map(i => i.prototype.is);
                }
                get $$imports() {
                    return ODA.telemetry.imports[prototype.url];
                }
                get $$modules() {
                    return ODA.telemetry.modules[this.$url].filter(i => i !== prototype.is)
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
                    delay ? setTimeout(handler, delay) : requestAnimationFrame(handler)
                }
                __read(path = this.$$savePath, def) {
                    let s = JSON.parse(localStorage.getItem(prototype.is)) ?? {};
                    const parts = path.split('/');
                    while (parts.length && s) {
                        s = s[parts.shift()];
                    }
                    return s ?? def;
                }
                __write(path = this.$$savePath, value) {
                    let settings = JSON.parse(localStorage.getItem(prototype.is)) ?? {};
                    let s = settings;
                    const parts = path.split('/');
                    if (s) {
                        while (parts.length > 1) {
                            const p = parts.shift();
                            s = s[p] = typeof s[p] === 'object' ? s[p] : {};
                        }
                        s[parts.shift()] = value;
                        localStorage.setItem(prototype.is, JSON.stringify(settings));
                    }
                }
                $super(parentName, name, ...args) {
                    const components = ODA.telemetry.components;

                    if (parentName && components[parentName]) {
                        const proto = components[parentName].prototype;
                        const method = proto[name];
                        if (typeof method === 'function') return method.call(this, ...args);
                    }
                    const getIds = (p) => {
                        const res = [];
                        let id = p.extends;
                        if (id) {
                            const ids = id.split(/, */).filter(i => i !== 'this');
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
                    throw new Error(`Not found super method: "${name}" `);
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
                const obsName = `${OBS_PREFIX}${fName}`;
                function funcObserver() {
                    const params = vars.map(v => {
                        return v.func.call(this);
                    });
                    if (!params.includes(undefined)) {
                        let target = ODA.dpTarget;
                        ODA.dpTarget = undefined;
                        func.call(this, ...params);
                        ODA.dpTarget = target;
                        // this.async(() => {
                        //     let target = ODA.dpTarget;
                        //     ODA.dpTarget = undefined;
                        //     func.call(this, ...params)
                        //     ODA.dpTarget = target;
                        // });
                    }
                    return true;
                }
                if (!fName) throw new Error('ERROR: no function name!');
                prototype.props[obsName] = {
                    get: funcObserver
                };
                prototype.$obs.push(obsName);
            }
            for (let name in prototype.props) {
                const prop = prototype.props[name];
                prop.name = name;
                prop.attrName = prop.attrName || name.toKebabCase();
                if (prop.reflectToAttribute)
                    core.reflects.add(prop)
                if (prop.save) {
                    core.saveProps[name] = { default: prop.default, get: prop.get };
                }
                const key = '#' + name;
                const desc = { enumerable: !name.startsWith('_'), configurable: true };
                prototype.$blocks[key] = Object.create(null);
                prototype.$blocks[key].getter = prop.get;
                prototype.$blocks[key].setter = prop.set;
                prototype.$blocks[key].prop = prop;
                prototype.$blocks[key].key = key;
                desc.get = function () {
                    let val = this[key];
                    if (val === undefined) {
                        val = this.$proxy[key];
                    }
                    else {
                        const block = this.__op__.blocks[key];
                        if (!block) {
                            val = this.$proxy[key];
                        }
                        else if (ODA.dpTarget && !block.deps.includes(ODA.dpTarget)) {
                            val = this.$proxy[key];
                        }
                    }
                    return val;
                }
                desc.set = function (val) {
                    this.$proxy[key] = toType(prop.type, val);
                }
                Object.defineProperty(odaComponent.prototype, name, desc);
                Object.defineProperty(core.defaults, name, {
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
                        return prop.default;
                    }
                })
            }
            core.node.children = prototype.template ? parseJSX(prototype, prototype.template) : [];
            Object.getOwnPropertyNames(prototype).forEach(name => {
                const desc = getDescriptor(prototype, name);
                if (typeof desc.value === 'function') {
                    Object.defineProperty(odaComponent.prototype, name, {
                        enumerable: true,
                        writable: true,
                        value: function (...args) {
                            return desc.value.call(this, ...args);
                        }
                    });
                }
                else if (desc.get || desc.set) {
                    const key = '#' + name;
                    prototype.$blocks[key] = Object.create(null);
                    prototype.$blocks[key].key = key;
                    if (desc.get) {
                        prototype.$blocks[key].getter = desc.get;
                        desc.get = function () {
                            let val = this[key];
                            if (val === undefined) {
                                val = this.$proxy[key];
                            }
                            else {
                                const block = this.__op__.blocks[key];
                                if (!block) {
                                    val = this.$proxy[key];
                                }
                                else if (ODA.dpTarget && !block.deps.includes(ODA.dpTarget)) {
                                    val = this.$proxy[key];
                                }
                            }
                            return val;
                        }
                    }
                    if (desc.set) {
                        prototype.$blocks[key].setter = desc.set;
                        desc.set = function (v) {
                            this.$proxy[key] = v;
                        }
                    }
                    Object.defineProperty(odaComponent.prototype, name, desc);
                }
            });
            Object.defineProperty(odaComponent, 'name', {
                writable: false,
                value: prototype.is
            });
            return odaComponent
        }
        function convertPrototype(parents) {
            prototype.parents = parents;
            prototype.$blocks = Object.create(null);
            prototype.props = prototype.props || {};
            prototype.observers = prototype.observers || [];
            prototype.$obs = [];
            for (let key in prototype.props) {
                let prop = prototype.props[key];
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
                    const array = [].concat(prop);
                    prop = { default: function () { return [].concat(array); }, type: Array };
                }
                else if (typeof prop !== "object") {
                    prop = { default: prop, type: prop.__proto__.constructor };
                }
                else if (prop === null) {
                    prop = { type: Object, default: null };
                }
                else if (Object.keys(prop).length === 0 || (!getter && !setter && prop.default === undefined && !prop.type && !('shared' in prop))) {
                    prop = { default: prop, type: Object };
                }
                if (prop.shared) {
                    prototype.$shared = prototype.$shared || [];
                    prototype.$shared.add(key)
                }
                const def = (prop.default === undefined) ? (prop.value || prop.def) : prop.default;
                if (def !== undefined)
                    prop.default = def;
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

            prototype.listeners = prototype.listeners || {};
            if (prototype.keyBindings) {
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
                        e.preventDefault();
                        let handler = prototype.keyBindings[key];
                        if (typeof handler === 'string')
                            handler = prototype[handler];
                        handler.call(this, e);
                    }
                }
            }
            for (let event in prototype.listeners) {
                const handler = prototype.listeners[event];
                prototype.listeners[event] = (typeof handler === 'string') ? prototype[handler] : handler;
            }

            parents.forEach(parent => {
                if (typeof parent === 'object') {
                    prototype.$obs.add(...parent.prototype.$obs);
                    if (parent.prototype.$shared) {
                        prototype.$shared = prototype.$shared || [];
                        prototype.$shared.add(...parent.prototype.$shared)
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
                    for (let key in parent.prototype.listeners) {
                        if (!getDescriptor(prototype.listeners, key)) {
                            const par = getDescriptor(parent.prototype.listeners, key);
                            prototype.listeners[key] = par.value;
                        }
                    }
                    for (let key in parent.prototype) {
                        const p = getDescriptor(parent.prototype, key);
                        const self = getDescriptor(prototype, key);
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
                        else if (!self && (p.get || p.set)) {
                            Object.defineProperty(prototype, key, p)
                            //todo уточнить наследование если у родителя set а у наследника get
                        }
                        // else Object.defineProperty(prototype, key, self ? { ...p, ...self } : p);
                    }
                }
            });
        }

        if (document.frameworkIsReady)
            regComponent(prototype);
        else {
            const handler = () => {
                document.removeEventListener('framework-ready', handler);
                regComponent(prototype);
            };
            document.addEventListener('framework-ready', handler)
        }
        return prototype;
    }
    ODA.isLocal = document.location.hostname === 'localhost';
    ODA.$url = import.meta.url;
    ODA.$dir = ODA.$url.substring(0, ODA.$url.lastIndexOf('/'));
    const getDescriptor = Object.getOwnPropertyDescriptor;
    window.ODA = ODA;
    ODA.applyStyleMixins = function (styleText, styles) {
        while (styleText.match(commentRegExp)) {
            styleText = styleText.replace(commentRegExp, '');
        }
        let matches = styleText.match(regExpApply);
        if (matches) {
            matches = matches.map(m => m.replace(/@apply\s*/, ''));
            for (let v of matches) {
                const rule = styles[v];
                styleText = styleText.replace(new RegExp(`@apply\\s+${v}\\s*;?`, 'g'), rule);
            }
            if (styleText.match(regExpApply))
                styleText = ODA.applyStyleMixins(styleText, styles);
        }
        return styleText;
    }
    try {
        ODA.rootPath = import.meta;
        ODA.rootPath = ODA.rootPath.url.replace('/oda.js', '');
    } catch (e) {
        console.error(e);
    }

    const reCheckKey = /^__.+__$/;
    const reCheckArrayKey = /\d+/;
    ODA.targetStack = [];
    function makeReactive(target, oldTarget) {
        if (!isObject(target)) return target;
        const val = target.__op__?.hosts?.get(this);
        if (val !== undefined) return val;
        if (target !== this) {
            if (Array.isArray(target)) {
                for (const i in target) {
                    target[i] = makeReactive.call(this, target[i]);
                }
            }
            else if (!isNativeObject(target)) return target;
        }


        if (target.__op__) {
            target.__op__.hosts.set(this, target.__op__.proxy);
            return target.__op__.proxy
        }
        const options = target.__op__ || Object.create(null);
        const handlers = {
            get: (target, key) => {
                if (!key) return;
                let val = options.target[key];
                if (val && (options === val || typeof val === 'function')) return val;
                const block = getBlock.call(this, options, key);
                if (val === undefined || (ODA.dpTarget && ODA.dpTarget !== block)) {
                    if (ODA.dpTarget && !block.obs && !block.deps.includes(ODA.dpTarget)) {
                        block.deps.push(ODA.dpTarget);
                        ODA.dpTarget.count++;
                        // console.log(ODA.dpTarget.key, 'зависит от',key , '->' ,ODA.dpTarget.count);
                    }
                    if (val === undefined) {
                        if (block.getter) {
                            block.count = block.count || 0;
                            ODA.targetStack.push(ODA.dpTarget);
                            ODA.dpTarget = block;
                            val = block.getter.call(target);
                            if (val instanceof Promise) {
                                return val.then(val => {
                                    ODA.dpTarget = ODA.targetStack.pop();
                                    return getProxyValue.call(this, block, val);
                                }).catch(e => {
                                    console.warn(e)
                                })
                            }
                            ODA.dpTarget = ODA.targetStack.pop();
                            if (target === val && block.count === 0) {
                                block.count = -1;
                                return val;
                            }
                            return getProxyValue.call(this, block, val);
                        }
                    }
                }
                if (ODA.dpTarget || !block.prop || !block.prop.freeze)
                    val = makeReactive.call(this, val);
                return val;
            },
            set: async (target, key, value) => {
                const old = options.target[key];
                if (Object.equal(old, value)) return true;
                const block = getBlock.call(this, options, key);
                getProxyValue.call(this, block, value, true, old);
                return true;
            }
        };
        const proxy = new Proxy(options?.target || target, handlers);
        if (!target.__op__) {
            options.target = target;
            options.hosts = new Map();
            options.proxy = proxy;
            options.blocks = Object.create(null);
            Object.defineProperty(target, '__op__', {
                enumerable: false,
                configurable: true,
                value: options
            });
        }
        options.hosts.set(this, proxy);
        return proxy;
    }
    function getBlock(options, key) {
        return options.blocks[key] || (options.blocks[key] = Object.assign({ options, key, deps: [], obs: key.startsWith?.(`#${OBS_PREFIX}$`) }, this.$core.prototype.$blocks[key] || {}));
    }
    function getProxyValue(block, val, setter, old) {
        if (Object.equal(val, old)) return;
        const target = block.options.target;
        const key = block.key;
        if (ODA.dpTarget || !block.prop || !block.prop.freeze)
            val = makeReactive.call(this, val, old);
        if (setter || block.count)
            target[key] = val;
        resetDeps(block, [], setter);
        if (block.obs) return val;
        for (let host of block.options.hosts.keys()) {
            host.notify?.(block, val);
        }
        if (block.setter) {
            const v = block.setter.call(target, val, old);
            if (v !== undefined)
                val = target[v] = makeReactive.call(this, val, old);
        }
        if (block.prop && block.prop.reflectToAttribute && this.parentNode) {
            if (val === false || val === undefined || val === null || val === '')
                this.removeAttribute(block.prop.attrName);
            else
                this.setAttribute(block.prop.attrName, val === true ? '' : val);
        }
        return val;
    }
    function resetDeps(block, stack = [], recurse) {
        block.deps?.forEach(i => {
            if (i === block) return;
            i.options.target[i.key] = undefined;
            if (!recurse || stack.includes(i)) return;
            stack.add(i)
            resetDeps(i, stack, recurse);
        })
    }
    let sid = 0;
    class VNode {
        constructor(el, vars) {
            this.cache = {};
            this.id = ++sid;
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
        setCache(el) {
            this.cache[el.nodeName] = this.cache[el.nodeName] || [];
            this.cache[el.nodeName].add(el);
        }
        getCache(tag) {
            return (this.cache[tag] || []).shift()
        }
        set textContent(v) {
            this._textContent = v;
        }
        get textContent() {
            if (!this.translate)
                return this._textContent;
            return ODA.translate(this._textContent);
        }
        set translate(v) {
            this._translate = v;
        }
        get translate() {
            return this._translate !== false;
        }
    }
    const dirRE = /^((oda|[a-z])?-)|~/;
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
            src.translate = (el.parentElement && (el.parentElement.nodeName === 'STYLE' || el.parentElement.getAttribute('is') === 'style')) ? false : true;
            if (/\{\{((?:.|\n)+?)\}\}/g.test(value)) {
                let expr = value.replace(/^|$/g, "'").replace(/{{/g, "'+(").replace(/}}/g, ")+'").replace(/\n/g, "\\n").replace(/\+\'\'/g, "").replace(/\'\'\+/g, "");
                if (prototype[expr])
                    expr += '()';
                const fn = createFunc(vars.join(','), expr, prototype);
                src.text = src.text || [];
                src.text.push(function textContent($el) {
                    let value = exec.call(this, fn, $el.$for);
                    if ($el._text === value) return;
                    $el.nodeValue = $el._text = value;
                    // $el.nodeValue = src.translate ? ODA.translate(value, src.language) : value;
                });
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
                if (prototype[expr])
                    expr += '()';
                // else if (reDotQ.test(expr)) {
                //     expr = exprOptionalConverter(expr);
                // }
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
                                if (!e.target.parentNode) return;
                                let value = e.target.value;
                                const target = e.target;
                                switch (e.target.type) {
                                    case 'checkbox': {
                                        value = e.target.checked;
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
                                exec.call(this, func, [res, ...(e.target.$for || [])]);
                            };
                            src.listeners[name + '-changed'].notify = name;
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
                    if (prototype[attr.value])
                        expr = attr.value + '($event, $detail)';
                    name = name.replace(/^@/g, '');
                    const params = ['$event', '$detail', ...(vars || [])];
                    const fn = new Function(params.join(','), `with (this) {${expr}}`);
                    src.listeners = src.listeners || {};
                    const handler = prototype[expr];
                    src.listeners[name] = async function (e) {
                        modifiers && modifiers.stop && e.stopPropagation();
                        modifiers && modifiers.prevent && e.preventDefault();
                        modifiers && modifiers.immediate && e.stopImmediatePropagation();
                        if (typeof handler === 'function')
                            await handler.call(this, e, e.detail);
                        else
                            await exec.call(this, fn, [e, e.detail, ...(e.target.$for || [])]);
                        this.async(() => {
                            this.render();
                        })
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
                        src.vals[a] = src.attrs[a];
                        delete src.attrs[a];
                    }
                }
            }
            if (prototype.$shared && src.tag !== 'STYLE') {
                for (let key of prototype.$shared) {
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
            return (exec.call(this, fn, p) || '').toUpperCase() || tag;
        }
    };
    const directives = {
        wake($el, fn, p) {
            const key = exec.call(this, fn, p);
            $el.$wake = key;
        },
        'save-key'($el, fn, p) {
            if ($el.$core) {
                const key = exec.call(this, fn, p);
                if ($el.$core.saveKey === key) return;
                $el.$core.saveKey = key;
                $el.render(true);
            }
        },
        props($el, fn, p) {
            const props = exec.call(this, fn, p);
            if (this.props === props) {
                for (let i in props) {
                    $el.setProperty(i, this[i]);
                }
            }
            else {
                for (let i in props) {
                    $el.setProperty(i, props[i]);
                }
            }

        },
        ref($el, fn, p) {
            const ref = exec.call(this, fn, p);
            if ($el.$ref === ref) return;
            $el.$ref = ref;
            this.$core.$refs = null;
        },
        show($el, fn, p) {
            $el.style.display = exec.call(this, fn, p) ? '' : 'none';
        },
        html($el, fn, p) {
            const html = exec.call(this, fn, p) || '';
            if ($el.$cache.innerHTML === html) return;
            $el.innerHTML = $el.$cache.innerHTML = html;
        },
        text($el, fn, p) {
            let val = exec.call(this, fn, p);
            if (val === undefined)
                val = '';
            if ($el.$cache.textContent === val) return;
            $el.$cache.textContent = val;
            $el.textContent = ODA.translate(val, $el.language);
        },
        class($el, fn, p) {
            let s = exec.call(this, fn, p) || '';
            if (Array.isArray(s))
                s = s[0];
            if (!Object.equal($el.$class, s)) {
                $el.$class = s;
                if (typeof s === 'object')
                    s = Object.keys(s).filter(i => s[i]).join(' ');
                if ($el.$node.vals && $el.$node.vals.class)
                    s = (s ? (s + ' ') : '') + $el.$node.vals.class;
                $el.setAttribute('class', s);
            }
        },
        style($el, fn, p) {
            let s = exec.call(this, fn, p) || '';
            if (!Object.equal($el.$style, s, true)) {
                $el.$style = s;
                if (Array.isArray(s))
                    s = s.join('; ');
                else if (isObject(s))
                    s = Object.keys(s).filter(i => s[i]).map(i => i.toKebabCase() + ': ' + s[i]).join('; ');
                if ($el.$node.vals && $el.$node.vals.style)
                    s = $el.$node.vals.style + (s ? ('; ' + s) : '');
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
        const params = (newVars.shift() || '').replace('(', '').replace(')', '').split(',');
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

            if (!Array.isArray(items)) {
                items = +items || 0;
                if (items < 0)
                    items = 0
                items = new Array(items);
                if (items < 0)
                    items = 0;
                for (let i = 0; i < items.length; items[i++] = i);
            }
            const res = [];
            for (let i = 0; i < items.length; i++) {
                res.push({ child, params: [...p, items[i], i, items] });
            }
            return res;
        };
        h.src = child;
        return h;
    }

    function createElement(src, tag, old) {
        let $el;// = src.getCache(tag);
        if (!$el) {
            if (tag === '#comment')
                $el = document.createComment((src.textContent || src.id) + (old ? (': ' + old.tagName) : ''));
            else if (tag === '#text')
                $el = document.createTextNode(src.textContent || '');

            else {
                if (src.svg)
                    $el = document.createElementNS(svgNS, tag.toLowerCase());
                else {
                    ODA.currentHost = this;
                    $el = document.createElement(tag);
                    ODA.currentHost = undefined;
                }


                if (tag !== 'STYLE') {
                    this.$core.resize.observe($el);
                    this.$core.intersect.observe($el);
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
            $el.$cache = {};
            $el.$node = src;
            $el.domHost = this;
        }
        else if ($el.nodeType === 1) {
            for (let i of $el.attributes) {
                $el.removeAttribute(i.name);
            }
        }
        this.$core.refs = null;
        return $el;
    }
    async function render() {
        await updateDom.call(this, this.$core.node, this.$core.shadowRoot);
        this.$core.__inRender = false;
    }
    async function updateDom(src, $el, $parent, pars) {
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
                $parent.replaceChild(el, $el);
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
        $el.$wake = $el.$wake || this.$wake;
        $el.$for = pars;

        if ($el.children && src.children.length && (!$el.$sleep || $el.$wake || src.svg || $el.localName === 'slot')) {
            for (let i = 0, idx = 0, l = src.children.length; i < l; i++) {
                let h = src.children[i];
                if (typeof h === "function") {
                    let items = await h.call(this, pars);
                    items = items.map((node, i) => {
                        return updateDom.call(this, node.child, $el.childNodes[idx + i], $el, node.params);
                    })
                    Promise.all(items);
                    idx += items.length;

                    let el = $el.childNodes[idx];
                    while (el && el.$node === h.src) {
                        el.remove();
                        el = $el.childNodes[idx];
                    }

                }
                else {
                    let el = $el.childNodes[idx];
                    updateDom.call(this, h, el, $el, pars);
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
                if (b === undefined && src.listeners[i + '-changed'] && $el.fire) {
                    requestAnimationFrame(() => {
                        $el.fire(i + '-changed');
                    });
                } else {
                    $el.setProperty(i, b);
                }
            }
        if ($el.$core) {
            $el.render();
        }
        else
            if ($el.localName === 'slot') {
                const elements = ($el.assignedElements && $el.assignedElements()) || [];
                for (let el of elements) {
                    el.render && el.render();
                }
            }

        if (/* !this.parentElement ||  */!$el.slot || $el.slotProxy || $el.slot === '?' || this.slot === '?') return;
        this.$core.slotted.add($el);
        this.$core.intersect.unobserve($el);
        const el = $el._slotProxy || createElement.call(this, src, '#comment');
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
            for (host of this.$core.shadowRoot.querySelectorAll('*')) {
                if (host.$core?.prototype.slots?.includes($el.slot)) {
                    host.appendChild($el);
                    return;
                }
            }

            host = this;
            while (host) {
                for (let ch of host.children) {
                    if (ch.$core?.prototype.slots?.includes($el.slot)) {
                        ch.appendChild($el);
                        return;
                    }
                }
                if (host.$core.prototype.slots?.includes($el.slot)) {
                    host.appendChild($el);
                    return;
                }
                host = host.domHost || (host.parentElement?.$core && host.parentElement);
            }
            this.appendChild($el);
        })
    }
    const regExpWords = /[a-zA-Z][a-z]+|[a-zA-Z]/g;
    ODA.translates = { phrases: [], words: [] };
    ODA.translate = function (text, language) {
        return text;
    }

    let renderQueue = [], rafID = 0;
    let q = [];
    ODA.render = function (renderer) {
        renderQueue.add(renderer);
        if (rafID === 0)
            rafID = requestAnimationFrame(raf);
    };
    function raf() {
        // if (q.length === 0) {
        //     q = renderQueue;
        //     renderQueue = [];
        // }
        while (renderQueue.length)
            renderQueue.shift()();
        rafID = (q.length + renderQueue.length) ? requestAnimationFrame(raf) : 0;
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
            console.error('%c' + expr + '\r\n', 'color: black; font-weight: bold; padding: 4px;', prototype.is, prototype.url, e);
        }
    }
    function exec(fn, p = []) {
        try {
            return fn.call(this, ...p);
        }
        catch (e) {
            console.error('%c' + fn?.toString() + '\r\n', 'color: blue; padding: 4px;', this, e);
        }
    }
    const forVars = ['item', 'index', 'items'];
    const svgNS = "http://www.w3.org/2000/svg";
    const modifierRE = /\.[^.]+/g;
    Object.defineProperty(Element.prototype, 'error', {
        set(v) {
            const target = (this.nodeType === 3 && this.parentNode) ? this.parentNode : this;
            if (target.nodeType === 1) {
                if (v) {
                    target.setAttribute('part', 'error');
                    target.setAttribute('oda-error', v);
                }
                else {
                    target.removeAttribute('part');
                    target.removeAttribute('oda-error');
                }
            }
        }
    });


    const fnIncl = Array.prototype.includes;
    Object.defineProperty(Array.prototype, 'includes', {
        enumerable: false, configurable: true, value: function (item) {
            return fnIncl.call(this, item) || this.indexOf(item) > -1;
        }
    });


    if (!Array.prototype.nativeIndexOf) {
        Object.defineProperty(Array.prototype, 'nativeIndexOf', { enumerable: false, configurable: true, value: Array.prototype.indexOf });
        Object.defineProperty(Array.prototype, 'indexOf', {
            enumerable: false, configurable: true, value: function (item) {
                let idx = Array.prototype.nativeIndexOf.call(this, item);
                if (!~idx)
                    idx = this.findIndex(i => {
                        return Object.equal(i, item);
                    })
                return idx;
            }
        });
        Object.defineProperty(Array.prototype, 'has', {
            enumerable: false, configurable: true, value: Array.prototype.includes
        });
        Object.defineProperty(Array.prototype, 'clear', {
            enumerable: false, configurable: true, value: function () {
                this.splice(0);
            }
        });
        Object.defineProperty(Array.prototype, 'last', {
            enumerable: false, configurable: true, get() {
                return this[this.length - 1];
            }
        });
        Object.defineProperty(Array.prototype, 'add', {
            enumerable: false, configurable: true, value: function (...item) {
                for (let i of item) {
                    if (this.includes(i)) continue;
                    this.push(i);
                }
            }
        });
        Object.defineProperty(Array.prototype, 'remove', {
            enumerable: false, configurable: true, value: function (...items) {
                for (const item of items) {
                    let idx = this.indexOf(item);
                    this.splice(idx, 1);
                }
            }
        });
    }
    function cached(fn) {
        const cache = Object.create(null);
        return (function cachedFn(str) {
            return cache[str] || (cache[str] = fn(str))
        })
    }
    const kebabGlossary = {};
    function toKebab(str) {
        return (kebabGlossary[str] = str.replace(/\B([A-Z])/g, '-$1').toLowerCase());
    }
    if (!String.toKebabCase) {
        Object.defineProperty(String.prototype, 'toKebabCase', {
            enumerable: false, value: function () {
                const s = this.toString();
                const str = kebabGlossary[s];
                return str ? str : toKebab(s);
            }
        });
    }
    const camelGlossary = {};
    function toCamel(str) {
        return (camelGlossary[str] = str.replace(/-(\w)/g, function (_, c) { return c ? c.toUpperCase() : '' }))
    }
    String.prototype.replaceAll = function (search, replace) {
        return this.replace(new RegExp(search, 'g'), replace);
    };
    if (!String.toCamelCase) {
        Object.defineProperty(String.prototype, 'toCamelCase', {
            enumerable: false, value: function () {
                const s = this.toString();
                const str = camelGlossary[s];
                return str ? str : toCamel(s);
            }
        });
    }
    ODA.mainWindow = window;
    try {
        while (ODA.mainWindow.parent && ODA.mainWindow.parent !== ODA.mainWindow) {
            ODA.mainWindow = ODA.mainWindow.parent;
        }
    }
    catch (e) {
        console.dir(e);
    }
    ODA.origin = origin;
    ODA.telemetry = {
        proxy: 0, modules: {}, imports: {}, components: { count: 0 }, clear: () => {
            for (const i of Object.keys(ODA.telemetry)) {
                if (typeof ODA.telemetry[i] === 'number')
                    ODA.telemetry[i] = 0;
            }
        }
    };
    ODA.modules = [];
    ODA.tests = {};
    window.onerror = (...e) => {
        const module = ODA.modules.find(i => i.path === e[1]);
        if (module) {
            ODA.error(module.id, e[4].stack);
            return true;
        }
        else if (document.currentScript && e[0].includes('SyntaxError')) {
            let s = document.currentScript.textContent;
            let idx = s.indexOf('is:');
            if (idx > 0) {
                s = s.substring(idx + 3);
                s = s.replace(/'/g, '"');
                s = s.substring(s.indexOf('"') + 1);
                s = s.substring(0, s.indexOf('"'));
                if (s.includes('-')) {
                    ODA({
                        is: s,
                        template: `<span class="error border" style="cursor: help; padding: 2px; background-color: yellow; margin: 2px" title="${e[0]}'\n'${e[1]} - (${e[2]},${e[3]})">error: &lt;${s}&gt;</span>`
                    })
                }
            }
        }
        return false;
    };
    const _logFunction = async (type, ...args) => {
        const colors = {
            error: 'color: red',
            warn: 'color: orange',
            success: 'color: green'
        };
        const bodyLink = window.top?.document.body || document.body;
        await import('./tools/console/console.js');
        const logComponent = bodyLink.querySelector('oda-console') || bodyLink.appendChild(ODA.createComponent('oda-console'));
        const item = {
            type,
            style: colors[type] || null,
            text: [...args].join(' ')
        };
        logComponent.items = logComponent.items ? [...logComponent.items, item] : [item];
    };
    const _windowOnError = e => {
        const { message, filename, lineno, colno } = e;
        ODA.console.error(message, filename, lineno, colno);
    }
    ODA.console = window.top.ODA.console || {
        error: (...args) => _logFunction('error', ...args),
        warn: (...args) => _logFunction('warn', ...args),
        success: (...args) => _logFunction('success', ...args),
        status: (...args) => _logFunction('status', ...args),
        log: (...args) => _logFunction('log', ...args),
        _checkErrors: false,
        start: (filter) => {
            consoleDecorate(filter);
            window.addEventListener('error', _windowOnError);
            ODA.console._checkErrors = true;
        },
        stop: () => {
            consoleUnDecorate();
            window.removeEventListener('error', _windowOnError);
            ODA.console._checkErrors = false;
        },
        close: () => {
            const bodyLink = window.top?.document.body || document.body;
            const consoleLink = bodyLink.querySelector('oda-console');
            bodyLink.removeChild(consoleLink);
        }
    };
    const __consoleCache = {};
    const consoleDecorate = filter => {
        const c = window.console;
        for (const k in c) {
            const f = c[k];
            if (ODA.console[k] && (!filter || (filter && filter.includes(k)))) {
                __consoleCache[k] = c[k];
                c[k] = function (...args) {
                    ODA.console[k](...args);
                    f(...args);
                }
            }
        }
    }
    const consoleUnDecorate = () => {
        const c = window.console;
        for (const k in __consoleCache) {
            c[k] = __consoleCache[k];
            delete __consoleCache[k];
        }
    }
    const cache = {
        fetch: {},
        file: {}
    };
    ODA.loadURL = async function (url) {
        url = (new URL(url)).href;

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
    const pars = new DOMParser();
    ODA.loadHTML = async function (url) {
        if (!cache.file[url]) {
            cache.file[url] = new Promise(async (resolve, reject) => {
                try {
                    const file = await ODA.loadURL(url);
                    const text = await file.text();
                    resolve(pars.parseFromString(text, 'text/html'))
                } catch (e) {
                    reject(e)
                }
            });
        }
        return cache.file[url];
    };
    class odaRouter {
        constructor() {
            this.rules = {};
            this.root = window.location.pathname.replace(/\/[a-zA-Z]+\.[a-zA-Z]+$/, '/');
            window.addEventListener('popstate', (e) => {
                this.run(e.state?.path || '');
            })
        }
        create(rule, callback) {
            for (let r of rule.split(',')) {
                r = r || '__empty__';
                this.rules[r] = this.rules[r] || [];
                if (!this.rules[r].includes(callback))
                    this.rules[r].push(callback);
            }
        }
        set currentRoute(v) {
            this._current = v;
        }
        go(path, idx = 0) {
            if (path.startsWith('#')) {
                const hash = window.location.hash.split('#');
                hash.unshift();
                while (hash.length > idx + 1) {
                    hash.pop();
                }
                path = hash.join('#') + path;

            }
            window.history.pushState({ path }, null, path);
            this.run(path)
        }
        run(path) {
            rules: for (let rule in this.rules) {
                if (rule === '__empty__') {
                    if (path) continue;
                }
                else {
                    if (!(rule.includes('*')) && rule.length !== path.length) continue rules;
                    chars: for (let i = 0, char1, char2; i < rule.length; i++) {
                        char1 = rule[i];
                        char2 = path[i];
                        switch (char1) {
                            case '*':
                                break chars;
                            case '?':
                                if (char2 === undefined) continue rules;
                                break;
                            default:
                                if (char1 !== char2) continue rules;
                                break;
                        }
                    }
                }
                for (let h of this.rules[rule])
                    h(path)
            }
        }
        back() {
            window.history.back();
        }
        forward() {
            window.history.forward();
        }
    }
    ODA.router = new odaRouter();
    const hooks = ['created', 'ready', 'attached', 'detached', 'updated', 'destroyed'];
    const toString = Object.prototype.toString;
    function isNativeObject(obj) {
        return obj && (obj.constructor === Object);// ||  toString.call(c) === '[object Object]';
    }
    function def(obj, key, val, enumerable) {
        Object.defineProperty(obj, key, {
            value: val,
            enumerable: !!enumerable,
            writable: true,
            configurable: true
        });
    }
    function deepCopy(obj) {
        if (Array.isArray(obj))
            return obj.map(i => deepCopy(i));
        else if (isNativeObject(obj)) {
            obj = Object.assign({}, obj);
            for (const key in obj)
                obj[key] = deepCopy(obj[key]);
        }
        return obj;
    }

    Node.prototype.setProperty = function (name, v) {
        if (this.__lockBind === name) return;
        if (this.$core) {
            if (name.includes('.')) {
                let path = name.split('.');
                let step;
                for (let i = 0; i < path.length; i++) {
                    let key = path[i].toCamelCase();
                    if (i === 0) {
                        const prop = this.$core.prototype.props[key];
                        if (prop) {
                            step = this[key] = this[key] || {};
                        }
                        else break;
                    }
                    else if (isObject(step)) {
                        if (i < path.length - 1) {
                            step = step[key] = step[key] || {};
                        } else {
                            step[key] = v;
                            return;
                        }
                    }
                }
            }
            else {
                const prop = this.$core.prototype.props[name];
                if (prop) {
                    this[name] = v;
                    return;
                }
            }

        }
        if (typeof v === 'object' || this.nodeType !== 1 || this.$node?.vars.has(name)) {
            this[name] = v;
        }
        else {
            const d = !this.$core && getDescriptor(this.__proto__, name);
            if (!d)
                name = name.toKebabCase();
            else if (d.set && v !== undefined) {
                if (this[name] !== v)
                    this[name] = v;
                return;
            }
            if (!v && v !== 0)
                this.removeAttribute(name);
            else if (this.getAttribute(name) != v)
                this.setAttribute(name, v === true ? '' : v);
        }

        if (!this.assignedElements) return;
        for (const ch of this.assignedElements())
            ch.setProperty(name, v)

    };
    Node.prototype.fire = function (event, detail) {
        if (!this.$wake && this.$sleep) return;
        event = new odaCustomEvent(event, { detail: { value: detail }, composed: true });
        this.dispatchEvent(event);
    };
    Node.prototype.render = function () {
        if (!this.$wake && (this.$sleep || !this.$node)) return;
        updateDom.call(this.domHost, this.$node, this, this.parentNode, this.$for);
    };

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
                        value: source.path
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
            // if (!target.onclick) {
            //     target.onclick = () => void(0);
            // }
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
        constructor(target, handler, ...args) {
            super(target, handler, ...args);
            this.addSubEvent('mousedown', (e) => {
                this.detail = {
                    state: 'start',
                    start: {
                        x: e.clientX,
                        y: e.clientY
                    }, ddx: 0, ddy: 0, dx: 0, dy: 0,
                };
                window.addEventListener('mousemove', moveHandler);
                window.addEventListener('mouseup', upHandler);
            });
            const moveHandler = (e) => {
                this.detail.x = e.clientX;
                this.detail.y = e.clientY;
                this.detail.ddx = -(this.detail.dx - (e.clientX - this.detail.start.x));
                this.detail.ddy = -(this.detail.dy - (e.clientY - this.detail.start.y));
                this.detail.dx = e.clientX - this.detail.start.x;
                this.detail.dy = e.clientY - this.detail.start.y;
                if (this.detail.dx || this.detail.dy) {
                    const ce = new odaCustomEvent("track", { detail: Object.assign({}, this.detail) }, e);
                    this.handler(ce, ce.detail);
                    this.detail.state = 'track';
                }
            };
            const upHandler = (e) => {
                window.removeEventListener('mousemove', moveHandler);
                window.removeEventListener('mouseup', upHandler);
                this.detail.state = 'end';
                const ce = new odaCustomEvent("track", { detail: Object.assign({}, this.detail) }, e);
                this.handler(ce, ce.detail);
            };
        }

        get event() {
            return 'track'
        }
    }
    ODA._cache = {};
    ODA.cache = (key, callback) => {
        ODA._cache[key] = ODA._cache[key] || ((typeof callback === 'function') ? callback() : callback);
        return ODA._cache[key];
    }


    ODA.createComponent = (id, props = {}) => {
        let el = document.createElement(id);
        for (let p in props) {
            el[p] = props[p];
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
    ODA.push = (title = 'Warning!', { tag = 'message', body, icon = '/web/res/icons/warning.png', image } = {}) => {
        if (!body) {
            body = title;
            title = 'Warning!'
        }
        let params = { tag, body, icon, image };
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
    ODA.getIconUrl = function (icon, item) {
        let url = icon;
        if (!url.includes(':') && !url.includes('/web/')) {
            url = '/web/res/icons/' + url;
            if (!url.includes('.png'))
                url += '.png';
        }
        url = encodeURI(url);
    };
    ODA.getImports = function (urlOrId) {
        const p = ODA.telemetry.components[urlOrId];
        if (p)
            urlOrId = p.prototype.url;

        let list = ODA.telemetry.imports[urlOrId];
        if (!list) {
            list = ODA.telemetry.imports[urlOrId] = [];
            const dir = urlOrId.substring(0, urlOrId.lastIndexOf('/')) + '/';
            fetch(urlOrId).then(res => {
                res.text().then(text => {
                    const results = text.matchAll(regExImport);
                    for (let result of results) {
                        const url = new URL(dir + eval(result.groups.name)).href;
                        list.add(url);
                    }
                }).catch(err => {

                })
            }).catch(err => {

            })
        }
        return list;
    };
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
    window.ODARect = window.ODARect || class ODARect {
        constructor(element) {
            if (element?.host)
                element = element.host;
            const pos = element ? element.getBoundingClientRect() : ODA.mousePos;
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
    if (!window.DOMRect) {
        window.DOMRect = function (x, y, width, height) {
            this.x = x;
            this.y = y;
            this.top = y;
            this.bottom = y + height;
            this.left = x;
            this.right = x + width;
            this.width = width;
            this.height = height;
        }
    }
    document.addEventListener('mousedown', e => {
        ODA.mousePos = new DOMRect(e.pageX, e.pageY);
    });

    Object.defineProperty(ODA, 'language', {
        configurable: false,
        async set(n) {
            ODA._language = n;
            try {
                ODA.dictionary = await ODA.loadJSON(ODA.$dir + '/tools/languages/dictionaries/' + n + '.json');
            }
            catch (e) {
                ODA.dictionary = {};
            }
            for (let el of document.body.children)
                el.render?.();
        },
        get() {
            return ODA._language;
        }
    })
    ODA.language = navigator.language.split('-')[0];

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

    ODA.onKeyPress = function (keys, callback) {
        keys = keys.toLowerCase();
        for (let key of keys.split(',')) {
            const calls = keyPressMap[key] || [];
            calls.add(callback)
            keyPressMap[key] = calls;
        }
    }

    window.addEventListener('load', async () => {
        document.frameworkIsReady = true;
        document.oncontextmenu = (e) => {
            e.target.dispatchEvent(new MouseEvent('menu', e));
            return false;
        };
        await import('./styles.js');
        ODA.containerStack = [];
        ODA.getDirInfo(ODA.$dir + '/tools/containers').then(res => {
            ODA.$containers = (res.$DIR || []).map(i => i.name);
            for (let id of ODA.$containers) {
                ODA[('show-' + id).toCamelCase()] = async function (component, props = {}, hostProps = {}) {
                    await import('./tools/containers/' + id + '/' + id + '.js');
                    const host = ODA.createComponent('oda-' + id, hostProps);
                    let ctrl = component;
                    if (typeof ctrl === 'string')
                        ctrl = ODA.createComponent(ctrl, props);
                    else if (ctrl.parentElement) {
                        if (ctrl.containerHost)
                            ctrl.containerHost.fire('cancel');
                        const comment = document.createComment(ctrl.innerHTML);
                        comment.slotTarget = ctrl;
                        ctrl.slotProxy = comment;
                        ctrl.containerHost = host;
                        comment.$slot = ctrl.slot;
                        delete ctrl.slot;
                        ctrl.parentElement.replaceChild(comment, ctrl);
                    }
                    host.style.position = 'absolute';
                    host.style.width = '100%';
                    host.style.height = '100%';
                    host.appendChild(ctrl)
                    document.body.appendChild(host);
                    ODA.containerStack.push(host);
                    try {
                        return await new Promise((resolve, reject) => {
                            this.keyboardEvent = e => {
                                if (e.keyCode === 27) {
                                    while (ODA.containerStack.length)
                                        ODA.containerStack.pop().fire('cancel');
                                }
                            }
                            this.cancelEvent = e => {
                                reject();
                            }
                            this.mouseEvent = e => {
                                while (ODA.containerStack.includes(e.target.parentElement) && ODA.containerStack.last !== e.target.parentElement) {
                                    ODA.containerStack.pop().fire('cancel');
                                }

                                if (ODA.containerStack.last === host && e.target !== ctrl) {
                                    let el = e.target.parentElement;
                                    while (el) {
                                        if (el === host) return;
                                        el = el.parentElement;
                                    }
                                    while (ODA.containerStack.length)
                                        ODA.containerStack.pop().fire('cancel');
                                }

                            }
                            this.okEvent = e => {
                                resolve(ctrl);
                            }
                            host.addEventListener('cancel', this.cancelEvent);
                            host.addEventListener('ok', this.okEvent);
                            window.addEventListener('keydown', this.keyboardEvent, true);
                            // document.addEventListener('mousedown', this.mouseEvent, true);
                            const windows = [...Array.prototype.map.call(window.top, w => w), window];
                            if (window !== window.top) windows.push(window.top);
                            windows.forEach(w => {
                                w.document.addEventListener('mousedown', this.mouseEvent, true);
                            });
                        })
                    }
                    catch (e) {
                        console.warn(e);
                        return Promise.reject();
                    }
                    finally {
                        if (ctrl.slotProxy) {
                            ctrl.slot = ctrl.slotProxy.$slot;
                            ctrl.slotProxy.parentElement.replaceChild(ctrl, ctrl.slotProxy);
                        }
                        host.removeEventListener('cancel', this.cancelEvent);
                        host.removeEventListener('ok', this.okEvent);
                        window.removeEventListener('keydown', this.keyboardEvent, true);
                        // document.removeEventListener('mousedown', this.mouseEvent, true);
                        const windows = [...Array.prototype.map.call(window.top, w => w), window];
                        if (window !== window.top) windows.push(window.top);
                        windows.forEach(w => {
                            w.document.removeEventListener('mousedown', this.mouseEvent, true);
                        });
                        host.remove();
                    }
                }
            }
        })

        const hotKeys = {
            'ctrl+m': { import: './tools/monitor/monitor.js', component: 'oda-monitor' },
            'alt+t': { import: './tools/console/console.js', component: 'oda-console' }
        }
        document.addEventListener('keydown', _hotKeys);
        async function _hotKeys(e) {
            if (!e.code.startsWith('Key')) return;
            let key = (e.ctrlKey ? 'ctrl+' : '') + (e.altKey ? 'alt+' : '') + (e.shiftKey ? 'shift+' : '') + e.code.replace('Key', '').toLowerCase();
            const obj = hotKeys[key], doc = window.top.document;
            if (!obj) return;
            if (obj.import && obj.component) {
                obj.done = doc.body.querySelector(obj.component) || null;
                if (obj.done) {
                    doc.body.removeChild(obj.done);
                    obj.done = null;
                } else {
                    await import(obj.import);
                    obj.done = ODA.createComponent(obj.component);
                    doc.body.appendChild(obj.done);
                }
            }
        }

        document.dispatchEvent(new Event('framework-ready'));
        if (document.body.firstElementChild) {
            if (document.body.firstElementChild.tagName === 'ODA-TESTER') {
                document.body.style.display = 'none';
                import('./tools/tester/tester.js').then(() => {
                    document.body.style.display = '';
                });
            }
            document.title = document.title || (document.body.firstElementChild.label || document.body.firstElementChild.name || document.body.firstElementChild.localName);
        }
    });
    function toBool(v, def = false) {
        if (!v)
            return def;
        switch (typeof v) {
            case 'object': return true;
            case 'string': return v.toLowerCase() === 'true';
            case 'boolean': return v;
            case 'number': return v !== 0;
        }
        return false;
    }
    function toType(type, value) {
        switch (type) {
            case Boolean: return toBool(value);
            case Number: return parseFloat(value) || 0;
            case String: return value?.toString() || '';
            case Date: return Date.parse(value) || new Date(value)
            default: return value;
        }
    }
    Element.prototype.getClientRect = function (host) {
        let rect = this.getBoundingClientRect();
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
            this.__events = this.__events || new Map();
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
export default ODA;