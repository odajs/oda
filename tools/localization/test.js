function setGetSet(prototype) {
    const c = prototype.constructor;
    prototype.constructor = function (...args) {
        console.log(args);
        return c.apply(this, args)
    }
    const textDescriptors = Object.getOwnPropertyDescriptors(prototype);
    for (const k in textDescriptors) {
        const d = textDescriptors[k];
        const descr = {};
        const func = function (type) {
            if(k === 'localName' || this.localName === 'style') return;
            console.log(k);
            console.log((new Error()).stack.split('\n').at(-1),'\n', ['set', 'get'][type], k);
        }
        if (d.configurable) {
            if (d.get || d.set) {
                if (typeof d.get === 'function') {
                    descr.get = function () {
                        func.call(this, 1);
                        return d.get.call(this)
                    }
                }
                if (typeof d.set === 'function') {
                    descr.set = function (v) {
                        func.call(this, 2);
                        d.set.call(this, v)
                    }
                }
            }
            else if (typeof d.value !== 'function') {
                descr.get = function () {
                    func.call(this, 1);
                    return d.get.call(this)
                }
                descr.set = function (v) {
                    func.call(this, 2);
                    d.set.call(this, v)
                }
            }
            Object.defineProperty(prototype, k, descr)
        }
    }
}
let p = HTMLElement.prototype;
while (p) {
    setGetSet(p)
    p = p.__proto__
}



const cr = document.createElement
document.createElement = function (...args) {
    console.log('createElement', args);
    return cr.apply(this, args)
}