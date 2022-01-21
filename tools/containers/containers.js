import "../../oda.js";
const CONTAINERS = ODA.regTool('containers');
const containerStack = [];
const path = import.meta.url.split('/').slice(0,-1).join('/')
ODA.loadJSON(path + '/_.dir').then(res=>{
    CONTAINERS.items = (res || []).map(i => i.name);
    for (let id of CONTAINERS.items) {
        ODA[('close-'+id).toCamelCase()] = function (){
            const dd = document.body.getElementsByTagName('oda-'+id)
            if (dd.length)
                for (let i = 0; i < dd.length; i++) {
                    const elm = dd[i];
                    elm.fire('cancel');
                }
        }
        ODA[('show-' + id).toCamelCase()] = async function (component, props = {}, hostProps = {}) {
            await import(path + '/' + id + '/' + id + '.js');
            const host = await ODA.createComponent('oda-' + id, hostProps);
            let ctrl = component;
            if (typeof ctrl === 'string')
                ctrl = await ODA.createComponent(ctrl, props);
            else if (ctrl.parentElement) {
                if (ctrl.containerHost)
                    ctrl.containerHost.fire('cancel');
                const comment = document.createComment(ctrl.innerHTML);
                comment.slotTarget = ctrl;
                ctrl.slotProxy = comment;
                ctrl.containerHost = host;
                comment.$slot = ctrl.slot;
                delete ctrl.slot;
                for (let i in props){
                    ctrl[i] = props[i];
                }

                ctrl.parentElement.replaceChild(comment, ctrl);
            }
            host.style.position = 'absolute';
            host.style.width = '100%';
            host.style.height = '100%';
            ctrl.domHost = host;
            host.appendChild(ctrl);
            host.style.opacity = 0;
            document.body.appendChild(host);
            setTimeout(() => {
                ctrl.setPDP();
                host.style.opacity = 1;
                let timeOutId, intervalId;
                let f = (force) => {
                    const s = ctrl.computedStyleMap();
                    if (force || (s.get('visibility')?.value === 'visible' && s.get('opacity')?.value > 0 && s.get('display')?.value !== 'none')) {
                        clearTimeout(timeOutId);
                        clearInterval(intervalId);
                        ctrl.focus?.();
                    }
                };
                timeOutId = setTimeout(f, 3000, [true]);
                intervalId = setInterval(f, 16);
            }, 100);
            if (host.allowClose === false) {
                containerStack.unshift(host);
            } else {
                containerStack.push(host);
            }
            const close = (e, condition) => {
                const list = containerStack.filter(c => c.allowClose !== false);
                while (condition(list)) {
                    const c = list.pop();
                    if (c) {
                        c.fire('cancel');
                        containerStack.remove(c);
                    }
                }
            }
            try {
                return await new Promise((resolve, reject) => {

                    this.cancelEvent = e => {
                        reject();
                    }
                    this.mouseEvent = e => {
                        close(e, (list) => list.includes(e.target.parentElement) && list.last !== e.target.parentElement);

                        if (containerStack.last === host && e.target !== ctrl) {
                            let el = e.target.parentElement;
                            while (el) {
                                if (el === host) return;
                                el = el.parentElement;
                            }
                            close(e, (list) => list.length);
                        }

                    }
                    this.okEvent = e => {
                        setTimeout(()=>{
                            resolve(ctrl);
                        },100)
                    }
                    host.addEventListener('cancel', this.cancelEvent);
                    host.addEventListener('ok', this.okEvent);

                    this.keyboardEvent = e => {
                        if (e.keyCode === 27) {
                            this.cancelEvent();
                            // close(e, (list) => list.length);
                        }
                        else if (e.keyCode === 13){
                            this.okEvent();
                        }
                    }


                    window.addEventListener('keydown', this.keyboardEvent, true);
                    const windows = [...Array.prototype.map.call(window.top, w => w), window];
                    if (window !== window.top) windows.push(window.top);
                    windows.forEach(w => {
                        w.document.addEventListener('mousedown', this.mouseEvent, true);
                    });
                })
            }
            catch (e) {
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

export default CONTAINERS