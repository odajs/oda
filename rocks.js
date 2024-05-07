if (!globalThis.ROCKS) {
    if (typeof requestAnimationFrame === 'undefined')
        globalThis.requestAnimationFrame = setTimeout;
    const _addEventListener = EventTarget.prototype.addEventListener
    const _removeEventListener = EventTarget.prototype.removeEventListener;
    let _curId = 0;
    function incrementId(){
        return ++_curId;
    }
    Object.defineProperties(EventTarget.prototype, {
        addEventListener: {
            configurable: true,
            enumerable: true,
            writable: true,
            value: function addEventListener(event, handler, ...args) {
                if (!this.__events) {
                    this.__events = new Map();
                }
                let /**@type {Set<Function>} */ handlers = this.__events.get(event);
                if (!handlers) {
                    handlers = new Set;
                    this.__events.set(event, handlers);
                }
                handlers.add(handler);
                return _addEventListener.call(this, event, handler, ...args)
            }
        },
        removeEventListener: {
            configurable: true,
            enumerable: true,
            writable: true,
            value: function removeEventListener(event, handler, ...args) {
                if (this.__events && this.__events.has(event)) {
                    const /**@type {Set<Function>} */ handlers = this.__events.get(event);
                    const curHandler = Array.from(handlers).find(h => h === handler);
                    if (curHandler) {
                        handlers.delete(curHandler);
                    }
                    if (!handlers.size)
                        this.__events.delete(event);
                }
                return _removeEventListener.call(this, event, handler, ...args)
            }
        },
    })
    const OBS_PREFIX = '__obs__';
    const ID_KEY = Symbol('__id__')
    globalThis.CORE_KEY = Symbol('core');
    const THROTTLES = Object.create(null);
    globalThis.ROCKS = function (prototype){
        const rocks = class extends (this || EventTarget) {
            constructor() {
                super(...arguments);
                this[ID_KEY] = incrementId();
                if (Object.keys(this.constructor.__rocks__.prototype.$observers).length){
                    this.async(()=>{
                        for(let obs in this.constructor.__rocks__.prototype.$observers){
                            this[OBS_PREFIX+obs];
                        }
                    })
                }
            }
            toJSON() {
                const props = Object.values(this.constructor.__rocks__.descrs).filter(i => i.enumerable);
                const result =  props.reduce((res, i) => {
                    const val = this[i.name];
                    res[i.name] = this[i.name];
                    return res;
                }, {})
                return result;
            }
            [CORE_KEY] = {
                events: new Map(),
                callbacks: new Map(),
                attributes: new Map(),
                debounces: new Map(),
            }
            async(handler, delay = 0) {
                if (typeof handler === 'string')
                    handler = this[handler].bind(this);
                // this.throttle('', handler, delay)
                const fn = (delay? setTimeout : requestAnimationFrame) || setTimeout;
                return fn(()=>{
                    handler();
                }, delay)
            }
            debounce(key, handler, delay = 0) {
                if (typeof handler === 'string')
                    handler = this[handler].bind(this);
                key += '.' + delay;
                let db = this[CORE_KEY].debounces.get(key);
                if (db){
                    const clr = (delay ? clearTimeout : cancelAnimationFrame) || clearTimeout;
                    clr(db);
                }
                const fn = (delay ? setTimeout : requestAnimationFrame) || setTimeout;
                const t = fn(() => {
                    this[CORE_KEY].debounces.delete(key);
                    handler();
                }, delay);
                this[CORE_KEY].debounces.set(key, t);
            }
            throttle(key, handler, delay = 0) {
                key += '.' + delay;
                let handlers = THROTTLES[key];
                if (handlers){
                    handlers.add(handler);
                }
                else{
                    THROTTLES[key] = handlers = [handler];
                    const fn = (delay ? setTimeout : requestAnimationFrame) || setTimeout;
                    fn(() => {
                        delete THROTTLES[key];
                        handlers.forEach(h=>h());
                        handlers.clear();
                    }, delay)
                }
            }
            listen(event, callback, props = { target: this, once: false, useCapture: false }) {

                if (typeof callback === 'string')
                    callback = this[callback];
                if (!callback) throw new Error (`Undefined event handler for "${event}"`);
                if(this[CORE_KEY].callbacks.has(callback))
                    callback = this[CORE_KEY].callbacks.get(callback)
                else
                    this[CORE_KEY].callbacks.set(callback, (callback = callback.bind(this)))
                if (!this[CORE_KEY].events.has(props.target)) {
                    this[CORE_KEY].events.set(props.target, {});
                }
                const handlers = this[CORE_KEY].events.get(props.target)[event] ??= [];
                if (handlers.includes(callback)) return;
                if (!props.once)
                    handlers.push(callback);
                (props.target || this).addEventListener?.(event, callback, props);
            }
            unlisten(event, callback, props = { target: this }) {
                const handlers = this[CORE_KEY].events.get(props.target)?.[event];
                if (!handlers) return;
                if (typeof callback === 'string')
                    callback = this[callback];
                callback = this[CORE_KEY].callbacks.get(callback)
                if (callback){
                    const idx = handlers.indexOf(callback)
                    if (~idx) handlers.splice(idx, 1);
                    (props.target || this).removeEventListener?.(event, callback);
                }
                else{
                    while (callback = handlers.pop()){
                        (props.target || this).removeEventListener?.(event, callback);
                    }
                }
            }
            fire(event, value){
                if (!this.__events?.has(event)) return;
                const ev = new CustomEvent(event, { detail: { value, target: this }, composed: true });
                this.dispatchEvent(ev);
            }
            $super(name, ...args) {
                //                  rocks     class     rocks     class
                let proto = super.__proto__.__proto__;
                const myDs = Object.getOwnPropertyDescriptor(this.__proto__.__proto__, name);
                let ds;
                while (!ds && proto) {
                    ds = Object.getOwnPropertyDescriptor(proto, name);
                    if (ds){
                        if(ds.set?.setter && args.length && ds.set?.setter !== myDs.set?.setter )
                            return ds.set.setter.call(this, ...args);

                        if (ds.get?.getter && ds.get?.getter !== myDs.get?.getter )
                            return ds.get.getter.call(this);

                        if (typeof ds.value === "function" && ds.value !== myDs.value)
                            return ds.value.call(this, ...args);
                        ds = null;
                    }
                    proto = proto.__proto__;
                }

            }
            static get name() {
                let parent = this.prototype.__proto__.constructor
                let name = parent.name;
                while (name === 'rocks') {
                    parent = parent.prototype.__proto__.constructor
                    name = parent.name
                }
                return name;
            }
        }
        const descrs = {}
        prototype.extends = str2arr(prototype.extends);
        prototype.extends.forEach(ext => {
            joinProps.call(this,  descrs, prototype, ext.__rocks__);
        })
        joinProps.call(this, descrs, prototype, this?.__rocks__)
        if (prototype.$observers) {
            for (const name in prototype.$observers) {
                let func = prototype.$observers[name]
                let expr;
                let args;

                if (Array.isArray(func) || typeof func === 'string') {
                    args = str2arr(func);
                    func = prototype[name] || descrs[name]?.value;
                }
                if (!args) {
                    expr = func.toString();
                    const argsStart = expr.indexOf('(') + 1;
                    const argsEnd = expr.indexOf(')', argsStart);
                    args = str2arr(expr.slice(argsStart, argsEnd));
                }

                const checkArgs = args.map(a => a.split('.')[0].replace('?', ''));
                const obsName = `${OBS_PREFIX}${name}`
                prototype[obsName] = {
                    get() {
                        checkArgs.forEach(a => {
                            if (!(a in this)) {
                                let message = `undefined property "${a}" in ${prototype.is ? `<${prototype.is}>` : this.constructor.name} for observer ${name}`;
                                let host = this.domHost;
                                while (host){
                                    if (a in host){
                                        message += `
But this problem can be fixed by set
the property modifier $pdp: true
in the <${host.localName}>`;
                                        break;
                                    }
                                    host = host.domHost;
                                }
                                throw new Error(message);
                            }
                        })
                        const props = args.map(a => this[a]);
                        if (props.every(p => p !== undefined)) {
                            this.debounce(obsName, () => {
                                this[name](...props);
                            })
                        }
                        return true;
                    }
                };
                if (func) prototype[name] = func;
            }
        }

        joinProps.call(this,  descrs, prototype, {descrs: convertor(prototype)}, true)
        Object.defineProperty(rocks, '__rocks__', {configurable: false, value: {descrs, prototype}})
        try{
            Object.defineProperties(rocks.prototype, rocks.__rocks__.descrs);
        }
        catch (e){
            switch (e.name){
                case 'TypeError':{
                    const err = Object.values(rocks.__rocks__.descrs).find(i=>{
                        return i.value && (i.get || i.set || i.writable)
                    })
                    if (err)
                        throw new Error(e.name +' on "' + err.name+'" property: '+e.message)
                    else
                        throw e;
                } break;
            }
        }
        return rocks;
    }
    const ROCKS = globalThis.ROCKS;
    Object.defineProperty(Object.__proto__, 'ROCKS', {enumerable: false, configurable: false, value: ROCKS})
    function joinProps(descrs, proto, source, last = false){
        for (let d in source?.descrs){
            if (PROTOTYPE_SPECIAL_GROUPS.includes(d))
                continue;
            if (!descrs[d] || descrs[d].configurable) {
                if (!last || !descrs[d]){
                    descrs[d] ??= Object.create(null);
                }
                else if (source.descrs[d]?.$def){
                    descrs[d].getter = undefined;
                }
                Object.assign(descrs[d], source.descrs[d]);
                continue;
            }
            throw new Error(`Cannot override protected property "${d}"`); //todo указывать первоисточник где protected
        }
        for (let p of PROTOTYPE_SPECIAL_GROUPS)
            proto[p] = Object.assign({}, source?.prototype?.[p] || {}, proto[p] || {})
    }
    function str2arr(str) {
        if (typeof str === 'string') {
            str = str.split(',').map(s => s.trim());
        }
        if (Array.isArray(str)) {
            str = str.filter(Boolean);
        }
        if (!str) {
            str = [];
        }
        return str;
    }
    globalThis.str2arr = str2arr;
    const KEY = Symbol('ROCKS-PROPS');
    const IS_ROCKS_PROXY = Symbol('IS_ROCKS_PROXY');
    ROCKS.KEY = KEY;
    ROCKS.IS_ROCKS_PROXY = IS_ROCKS_PROXY;
    function reactor(target) {
        if (!Object.isExtensible(target) || (target.constructor !== Object &&  target.constructor !== Array ) || target?.constructor === Promise)
            return target;

        let op = target[KEY];
        if (op){
            op.hosts.add(this);
            return op.proxy;
        }
        op = Object.create(null);
        const handlers = {
            get: (target, key, resolver) => {
                if (typeof key === 'symbol') {
                    switch (key) {
                        case KEY: return op;
                        case IS_ROCKS_PROXY: return true;
                        default: op.target[key]
                    }
                }
                if (key === KEY) return op;
                let val = op.target[key];
                if (val){
                    if (op === val || op.target === val || key.constructor === Symbol || (val instanceof Object && val.constructor?.prototype === val) || val instanceof Function)
                        return val;
                }
                const $prop = op.props[key] ??= {deps: new Set()}
                $prop.deps.add(ROCKS.DEP_TARGET || target);
                return reactor.call(this, val);
            },
            set: (target, key, value) => {
                const old = (Array.isArray(op.target) && key === 'length')?undefined:op.target[key];
                if (Object.equal(old, value)) return true;
                const $prop = op.props[key] ??= { deps: new Set() }
                $prop.deps.add(ROCKS.DEP_TARGET || target);
                op.target[key] = reactor.call(this, value);
                ROCKS.resetDeps($prop);
                return true;
            },
            deleteProperty: (target, key) => {
                const $prop = op.props[key] ??= { deps: new Set() }
                op.target[key] = reactor.call(this, undefined);
                delete op.target[key];
                ROCKS.resetDeps($prop);
                return true;
            }
        };
        const proxy = new Proxy(op?.target || target, handlers);
        if (!target[KEY]) {
            op.target = target;
            op.hosts = new Set();
            op.proxy = proxy;
            op.props = Object.create(null);
            Object.defineProperty(target, KEY, {
                enumerable: false,
                configurable: false,
                value: op
            });
        }
        op.hosts.add(this);
        return proxy;
    }
    ROCKS.reactor = reactor;
    Object.equal ??= function (a, b, recurse) {
        if (a === b) return true;
        if (!(a instanceof Object) || !(b instanceof Object))
            return false;
        if ((a?.[KEY] || a) === (b?.[KEY] || b))
            return true;
        if (a instanceof Function && a.constructor === b.constructor)
            return a.toString() === b.toString();
        if (a instanceof Date && a.constructor === b.constructor) {
            return a.valueOf() === b.valueOf();
        }
        if (recurse) {
            try{
                const join = Object.assign({}, a, b)
                for (let key in join)
                    if (!Object.equal(b[key], a[key], recurse)) return false;
                return true;
            }
            catch (e){

            }
        }
        return false;
    };
    function isObject(obj) {
        return obj && typeof obj === 'object';
    }
    function isNativeObject(obj) {
        return obj && (obj.constructor === Object);
    }
    function convertor(proto, decor, result){
        const descriptors = Object.getOwnPropertyDescriptors(proto);
        result ??= Object.create(null);
        for (let name in descriptors){
            if (PROTOTYPE_RESERVED_WORDS.includes(name))
                continue;

            if (decor && PROTOTYPE_SPECIAL_GROUPS.includes(name))
                continue;
            if (decor && PROPERTY_ATTRIBUTES.includes(name))
                continue;
            const d = descriptors[name];
            let prop = Object.create(null);

            switch (typeof d.value){
                case 'object':{
                    if(d.value === null){
                        prop.$type = Object;
                        prop.$def = null;
                    }
                    else if (Array.isArray(d.value)){
                        prop.$type = Array;
                        prop.$def = d.value;
                    }
                    else{
                        const attrs = Object.keys(d.value);
                        if (attrs.some(i=>PROPERTY_SIGNS.includes(i))) { // it is property
                            for (let attr of attrs){
                                if (!PROPERTY_ATTRIBUTES.includes(attr) && !PROPERTY_SIGNS.includes(attr)){
                                    throw new Error(`Unknown attribute "${attr}" in description for property "${name}".`)
                                }
                                prop[attr] ??= d.value[attr];
                            }
                            if (!prop.$type && prop.$def !== undefined){
                                switch (typeof prop.$def){
                                    case 'object':{
                                        if (Array.isArray(prop.$def))
                                            prop.$type = Array;
                                        else if(prop.$def === null)
                                            prop.$type = Object;
                                        else{
                                            if(prop.$def.__proto__?.constructor === Object){
                                                let isStructure = false;
                                                for (let n in prop.$def){
                                                    const obj = prop.$def[n]
                                                    if (obj?.constructor === Object){
                                                        if (Object.keys(obj).some(i=>PROPERTY_SIGNS.includes(i))){
                                                            obj.$public ??= true;
                                                            isStructure = true;
                                                        }
                                                    }
                                                }
                                                if (isStructure){
                                                    class RocksObject extends ROCKS(prop.$def){
                                                        constructor(parent) {
                                                            super();
                                                            this.$parent = parent;
                                                        }
                                                    }
                                                    prop.$def = function (){
                                                        return new RocksObject(this)
                                                    }
                                                }
                                            }
                                            prop.$type = prop.$def.__proto__?.constructor || Object;
                                        }
                                    } break;
                                    default:{
                                        prop.$type = prop.$def.__proto__.constructor;
                                    }
                                }
                            }
                        }
                        else if (ROCKS.PROPERTY_FLAGS.includes(name)){
                            for (let attr of attrs){
                                if (ROCKS.PROPERTY_FLAGS.includes(attr)){
                                    prop[attr] ??= d.value[attr];
                                }
                            }
                            prop[name] = true;
                            convertor(d.value, prop, result);
                            continue;
                        }
                        else if (attrs.some(i => PROPERTY_ATTRIBUTES.includes(i))) {  // it is group
                            for (let attr of attrs){
                                if (PROPERTY_ATTRIBUTES.includes(attr)){
                                    prop[attr] ??= d.value[attr];
                                }
                            }
                            prop.$group ??= name;
                            convertor(d.value, prop, result);
                            continue;
                        }
                        else{
                            prop.$type = d.value.__proto__?.constructor || Object;
                            prop.$def = d.value;
                        }
                    }
                } break;
                case 'function':{
                    if (PROPERTY_TYPES.includes(d.value.name))
                        prop.$type = globalThis[d.value.name];
                    else
                        prop.value = d.value;
                } break;
                case 'undefined':{
                    if (d.get)
                        prop.get = d.get;
                    if (d.set)
                        prop.set = d.set;
                } break;
                default:{
                    prop.$type = d.value.__proto__.constructor;
                    prop.$def = d.value;
                }
            }
            if (name in result)
                throw new Error(`${prop.value?'Method':'Property'} "${name}" redeclared.`);

            prop = Object.assign(prop, decor || {})
            prop.name = name;
            if (name.startsWith(OBS_PREFIX)){
                prop.isObserver = true;
            }
            if (prop.$attr){
                if (prop.$attr === true)
                    prop.$attr = name.toKebabCase();
            }
            if (!prop.value){
                if (prop.$def !== undefined){
                    const def = prop.$def;
                    switch (prop.$type) {
                        case Object: {
                            prop.$def = function () { return def?Object.assign({}, def):def};
                        } break;
                        case Array: {
                            prop.$def = function () { return Array.from(def)};
                        } break;
                        default:{
                            if (typeof prop.$def !== 'function') {
                                if (def !== undefined)
                                    prop.$def = function () {
                                        return def
                                    };
                            }
                        }
                    }
                }
                const typeFunc = getTypeConverter(prop.$type);
                prop.toType = (val)=>{
                    return val === undefined?val:typeFunc(val);
                }
                prop.event = name.toKebabCase()+'-changed';
                const key = '#'+name;
                if ('get' in prop)
                    prop.getter = prop.get;
                prop.get = function (){
                    let $prop = joinPropDescriptors.call(this, name);
                    if (this === this.constructor.prototype)
                        return $prop.$def?.call(this);
                    let val = this[key];
                    if (val === undefined){
                        if($prop.getter){
                            $prop.depTarget = ROCKS.DEP_TARGET;
                            ROCKS.DEP_TARGET = $prop;
                            val = $prop.getter.call(this);
                            if ($prop.$type && val?.then && $prop.$type !== Promise){
                                if (val.result === undefined){
                                    setTimeout(resetDepTarget);
                                    const prom = val;
                                    prom.then(res=>{
                                        // if (ROCKS.DEP_TARGET === $prop)
                                        //
                                        // resetDepTarget();
                                        prom.result = this[key] = res;
                                        if (!$prop.$freeze)
                                            ROCKS.resetDeps($prop);
                                    })
                                    .catch(error=>{
                                        console.warn(error)
                                        prom.result = this[key] = $prop.$def?.() || null;
                                        if (!$prop.$freeze)
                                            ROCKS.resetDeps($prop);
                                    })
                                }
                                else {
                                    val = this[key] = val.result;
                                }
                            }
                            ROCKS.DEP_TARGET = $prop.depTarget;
                        }
                        if (!(key in this)){
                            const def = $prop.$def?.call(this);
                            if($prop.$save && this.$loadPropValue){
                                let saved = this.$loadPropValue(name);
                                if (saved !== undefined && def !== saved){
                                    $prop.old = val; //todo подумать
                                    val = saved;
                                    $prop.setter?.call(this, val, $prop.old);
                                }
                            }
                            if (def !== undefined && (val === undefined || Number.isNaN(val))) {
                                val = def;
                            }
                            if (!$prop.$freeze)
                                val = reactor.call(this, val);
                            val = $prop.toType(val)
                            $prop.old = this[key] = val;
                            this.fire($prop.event, val);
                            // this.$notify?.($prop, val);
                        }

                        if (Object.equal(val, $prop.old)){
                            this[key] = $prop.old;
                            // this.$notify?.($prop, val);
                        }
                        else if (!(val instanceof Promise)){
                            if (!$prop.$freeze)
                                val = reactor.call(this, val);
                            val = $prop.toType(val)
                            $prop.old = this[key] = val;
                            if (!$prop.$freeze)
                                ROCKS.resetDeps($prop);
                            if($prop.$public)
                            this.fire($prop.event, val);

                        }
                        else
                            $prop.old = this[key] = val;
                        this.$notify?.($prop, val);

                        if (Array.isArray(val))
                            val?.length; //todo никогда не удалять
                    }
                    if (!$prop.isObserver)
                        $prop.deps.add(ROCKS.DEP_TARGET || this);
                    return $prop.toType(val);
                }
                // нужно в $supper
                prop.get.getter = prop.getter;
                if ('set' in prop)
                    prop.setter = prop.set;
                prop.set = function (val){
                    let $prop = joinPropDescriptors.call(this, name);
                    if (!$prop.setter && $prop.$readOnly && this.constructor.prototype !== this)
                        throw new Error('Read only!!! ' + name);
                    val = $prop.toType(val);

                    $prop.old = this[key];
                    if ($prop.old === undefined && !(key in this))
                        $prop.old = $prop.$def?.call(this);
                    if (Object.equal(val, $prop.old)) return;
                    if (!$prop.$freeze)
                        val = reactor.call(this, val);
                    this[key] = val;
                    $prop.setter?.call(this, val, $prop.old);
                    if($prop.$save && this.$savePropValue)
                        this.$savePropValue(name, val);
                    if (!$prop.$freeze)
                        ROCKS.resetDeps($prop);
                    this.fire($prop.event, val);
                    this.$notify?.($prop, val);
                }
                // нужно в $supper
                prop.set.setter = prop.setter;
            }
            else{
                if (name.startsWith('__'))
                    prop.$final = true;
                else if (!name.startsWith('_')){
                    prop.$public = true;
                    prop.$pdp = true;
                }
            }
            prop.enumerable = prop.$public || prop.$pdp || false;
            prop.configurable = !prop.$final;
            result[name] = prop;
        }
        return result;
    }
    function resetDepTarget(){
        ROCKS.DEP_TARGET = null;
    }
    function joinPropDescriptors(name){
        const prop = this.constructor.__rocks__.descrs[name];
        prop.hosts ??= new WeakMap();
        let res = prop.hosts.get(this);
        if (!res){
            res = Object.assign({host: this, key: '#'+name, deps: new Set()}, prop);
            prop.hosts.set(this, res);
        }
        return  res;
    }
    ROCKS.resetDeps = ($prop, stack = new WeakSet) =>{
        for (let p of $prop.deps || []){
            if (p === $prop || p.$freeze)
                continue;
            if (p.host && typeof p.host === 'object') // todo опасно привязываться к хосту
                p.host[p.key] = undefined;
            if (stack.has(p)) continue;
            stack.add(p);
            ROCKS.resetDeps(p, stack);
        }
        if (($prop.isObserver || $prop.$attr) && $prop.host[$prop.key] === undefined){
            $prop.host.throttle($prop.name, ()=>{
                $prop.host[$prop.name];
            })
        }
        if ($prop?.$render){
            $prop.throttle('$render', ()=> {
                $prop.$render();
            })
        }
        else{
            for (let h of $prop[KEY]?.hosts || []){
                if (h?.throttle && h?.$render){
                    h.throttle('$render', ()=>{
                        h.$render();
                    })
                }
            }
        }
    }
    function toDate(v){return new Date(v)}
    function toString(v){return v?.toString() || ''}
    function toNumber(v){return (v !== undefined)?Number(v):undefined}
    function toBigInt(v) {
        if( typeof v === 'bigint' )
            return v;
        if( typeof v === 'string' ) {
            const val = /^[\-\+]?[0-9]+/.exec(v);
            return val===null ? undefined : BigInt(val[0]);
        }
        const val = Math.round( Number(v) );
        return isFinite(val) ? BigInt(val): undefined;
    }
    const toBool = globalThis.toBool = (v, def = false) => {
        if (v === undefined || v === null)
            return def;
        switch (typeof v) {
            case 'object': return true;
            case 'string': return v.toLowerCase() === 'true';
            case 'boolean': return v;
            case 'number': return v !== 0;
            case 'bigint': return v !== 0n;
        }
        return false;
    }
    function getTypeConverter(type){
        switch (type) {
            case Boolean: return toBool;
            case Number: return toNumber;
            case String: return toString;
            case Date: return toDate;
            case BigInt: return toBigInt;
        }
        return (val)=>{
            return val;
        }
    }
    // let DEP_TARGET;
    const PROTOTYPE_RESERVED_WORDS = ['is', 'imports', 'extends'];
    ROCKS.PROPERTY_FLAGS = ['$save', '$final', '$public', '$pdp', '$readOnly', '$freeze', '$group'];
    const PROTOTYPE_SPECIAL_GROUPS = ['$listeners', '$observers', '$keyBindings', '$innerEvents'];
    const PROPERTY_TYPES = ['Boolean', 'Number', 'String', 'Array', 'Object', 'Date', 'BigInt'];
    const PROPERTY_SIGNS = ['$def', '$type', 'get', 'set'];
    const PROPERTY_ATTRIBUTES = [...ROCKS.PROPERTY_FLAGS, '$label', '$list', '$multiSelect', '$attr', '$hidden', '$editor', '$description'];
    Array:{
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
                let index = -1;
                for (let i of item) {
                    index = this.indexOf(i);
                    if (index>-1) continue;
                    index = this.push(i);
                    index--;
                }
                return index;
            }
        });
        Object.defineProperty(Array.prototype, 'remove', {
            enumerable: false, configurable: true, value: function (...items) {
                for (const item of items) {
                    let idx = this.indexOf(item);
                    if (~idx)
                        this.splice(idx, 1);
                }
            }
        });
        Object.defineProperty(Array.prototype, 'swap', {
            enumerable: false, configurable: true,
            value: function (i1, i2) {
                return [this[i1], this[i2]] = [this[i2], this[i1]];
            }
        });
    }
    String:{
        const kebabGlossary = Object.create(null);
        function toKebab(str) {
            return kebabGlossary[str] ??= str.replace(/\B([A-Z])/g, '-$1').toLowerCase();
        }
        if (!String.toKebabCase) {
            Object.defineProperty(String.prototype, 'toKebabCase', {
                enumerable: false, value: function () {
                    return toKebab(this.toString());
                }
            });
        }
        const camelGlossary = Object.create(null);
        function toCamel(str) {
            return camelGlossary[str] ??= str.replace(/-(\w)/g, function (_, c) { return c ? c.toUpperCase() : '' })
        }

        if (!String.toCamelCase) {
            Object.defineProperty(String.prototype, 'toCamelCase', {
                enumerable: false, value: function () {
                    return toCamel(this.toString());
                }
            });
        }

        const capitalGlossary = Object.create(null);
        function toCapital(str) {
            if (!str) return '';
            return capitalGlossary[str] ??= str[0].toUpperCase() + str.slice(1);
        }

        if (!String.toCapitalCase) {
            Object.defineProperty(String.prototype, 'toCapitalCase', {
                enumerable: false, value: function () {
                    return toCapital(this.toString());
                }
            });
        }

        if (!String.toQName) {
            Object.defineProperty(String.prototype, 'toQName', {
                enumerable: false, value: function () {
                    return this.toLowerCase().split(' ')
                    .map((s, i) => {
                        if (i === 0) return (s === 'the') ? '' : s;
                        return s;
                    })
                    .join('-')
                    .replace(/-{2,}/g, '-')
                    .replace(/(^\d)/, '_$1')
                    .replace(/\./g, '');
                }
            })
        }
        if (!String.prototype.hashCode) {
            const cyrb53 = (str, seed = 0) => {
                let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
                for(let i = 0, ch; i < str.length; i++) {
                    ch = str.charCodeAt(i);
                    h1 = Math.imul(h1 ^ ch, 2654435761);
                    h2 = Math.imul(h2 ^ ch, 1597334677);
                }
                h1  = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
                h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
                h2  = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
                h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

                return 4294967296 * (2097151 & h2) + (h1 >>> 0);
            };
            String.prototype.hashCode = function (seed) {
                return cyrb53(this, seed);
            }
        }
    }
}
export default globalThis.ROCKS;