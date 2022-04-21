if (!globalThis.setImmediate) {
    const tasksByHandle = {};
    let nextHandle = 1;
    let currentlyRunningATask = false;
    let registerImmediate;
    globalThis.setImmediate = function setImmediate(callback) {
        tasksByHandle[nextHandle] = callback;
        registerImmediate(nextHandle);
        return nextHandle++
    }
    globalThis.clearImmediate = function clearImmediate(handle) { delete tasksByHandle[handle] }
    function runIfPresent(handle) {
        if (currentlyRunningATask) {
            setTimeout(runIfPresent, 0, handle);
        } else {
            const task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    task();
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }
    function installNextTickImplementation() { registerImmediate = handle => process.nextTick(() => { runIfPresent(handle) }) }
    function installPostMessageImplementation() {
        const messagePrefix = `setImmediate$${Math.random()}$`;
        const onGlobalMessage = event => {
            if (event.source === globalThis &&
                typeof event.data === 'string' &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        }
        globalThis.addEventListener('message', onGlobalMessage, false);
        registerImmediate = handle => globalThis.postMessage(messagePrefix + handle, '*');
    }
    if ({}.toString.call(globalThis.process) === '[object process]') installNextTickImplementation();
    else installPostMessageImplementation();
}
if (!globalThis.icaro) {
    const listeners = new WeakMap();
    const dispatch = Symbol();
    const isIcaro = Symbol();
    const timer = Symbol();
    const isArray = Symbol();
    const changes = Symbol();
    const API = {
        listen(fn) {
            const type = typeof fn;
            if (type !== 'function') throw `The icaro.listen method accepts as argument "typeof 'function'", "${type}" is not allowed`;
            if (!listeners.has(this)) listeners.set(this, []);
            listeners.get(this).push(fn);
            if (globalThis.LI?._icaro) console.log('_icaro_listen', listeners);
            return this;
        },
        unlisten(fn) {
            const callbacks = listeners.get(this);
            if (!callbacks) return
            if (fn) {
                const index = callbacks.indexOf(fn);
                if (~index) callbacks.splice(index, 1);
            } else listeners.set(this, []);
            if (globalThis.LI?._icaro) console.log('_icaro__unlisten', listeners);
            return this;
        },
        toJSON() {
            return Object.keys(this).reduce((ret, key) => {
                const value = this[key];
                ret[key] = value && value.toJSON ? value.toJSON() : value;
                return ret;
            }, this[isArray] ? [] : {});
        }
    }
    const ICARO_HANDLER = {
        set(target, property, value) {
            if (target[property] !== value) {
                if (value === Object(value) && !value[isIcaro]) target[property] = icaro(value);
                else target[property] = value;
                target[dispatch](property, value);
            }
            return true;
        }
    }
    function define(obj, key, value) { Object.defineProperty(obj, key, { value: value, enumerable: false, configurable: false, writable: false }) }
    function enhance(obj) {
        Object.assign(obj, {
            [changes]: new Map(),
            [timer]: null,
            [isIcaro]: true,
            [dispatch](property, value) {
                if (listeners.has(obj)) {
                    clearImmediate(obj[timer]);
                    obj[changes].set(property, value);
                    obj[timer] = setImmediate(function() {
                        listeners.get(obj).forEach(function(fn) { fn(obj[changes]); });
                        obj[changes].clear();
                    })
                }
            }
        })
        Object.keys(API).forEach(function(key) { define(obj, key, API[key].bind(obj)) });
        if (Array.isArray(obj)) {
            obj[isArray] = true;
            obj.forEach(function(item, i) {
                obj[i] = null;
                ICARO_HANDLER.set(obj, i, item);
            })
        }
        return obj;
    }
    globalThis.icaro = function(obj) { return new Proxy(enhance(obj || {}), Object.create(ICARO_HANDLER)) }
}
