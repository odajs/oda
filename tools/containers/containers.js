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
        ODA[('show-' + id).toCamelCase()] = async function (component, props = {}, hostProps = {}, onVisible) {
            await import(path + '/' + id + '/' + id + '.js');
            const host = await ODA.createComponent('oda-' + id, hostProps);
            let ctrl = component;
            if (typeof ctrl === 'string')
                ctrl = await ODA.createComponent(ctrl, props);
            else {
                if (ctrl.parentElement) {
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
                for (let i in props) {
                    ctrl[i] = props[i];
                }
            }
            host.style.position = 'fixed';
            host.style.width = '100%';
            host.style.height = '100%';
            ctrl.domHost = host;
            host.appendChild(ctrl);
            host.style.opacity = 0;
            document.body.appendChild(host);
            setTimeout(() => {
                host.style.opacity = 1;
                let timeOutId, intervalId;
                let f = (force) => {
                    const s = ctrl.computedStyleMap();
                    if (force || (s.get('visibility')?.value === 'visible' && s.get('opacity')?.value > 0 && s.get('display')?.value !== 'none')) {
                        clearTimeout(timeOutId);
                        clearInterval(intervalId);
                        ctrl.setPDP?.();
                        onVisible?.(host, ctrl);
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

            let close, onMouseDown, onKeyDown, onCancel, onOk;
            const windows = [...Array.prototype.map.call(window.top, w => w), window];
            windows.add(window.top);

            const result = new Promise((resolve, reject) => {
                close = (e, condition, fireEvent = true) => {
                    const list = containerStack.filter(c => c.allowClose !== false);

                    while (condition(list)) {
                        const c = list.pop();
                        if (c) {
                            if (fireEvent) c.fire('cancel');
                            containerStack.remove(c);
                        }
                    }
                }
                onMouseDown = (e) => {
                    let inside = false; // курсор внутри контейнера
                    for (const ch of host.$core?.shadowRoot?.children) {
                        const r = ch.getBoundingClientRect?.();
                        if (r) {
                            inside = (e.x >= r.x && e.x <= r.x + r.width) && (e.y >= r.y && e.y <= r.y + r.height);
                            if (inside) break;
                        }
                    }
                    if (!inside) {
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
                }
                onKeyDown = (e) => {
                    if (e.keyCode === 27) onCancel(e);
                    else if (e.keyCode === 13) {
                        if (!host.focusedButton) {
                            const accent = host.buttonElems?.find(b => b.hasAttribute('accent'));
                            if (accent) {
                                e.stopPropagation();
                                accent.click?.();
                            }
                            else onOk(e);
                        }
                    }
                }
                onCancel = (e) => {
                    setTimeout(() => reject());
                }
                onOk = (e) => {
                    close(e, (list) => list.length, false);
                    setTimeout(() => resolve(ctrl));
                }

                host.addEventListener('cancel', onCancel);
                host.addEventListener('ok', onOk);

                windows.forEach(w => {
                    w.addEventListener('keydown', onKeyDown, true);
                    w.addEventListener('mousedown', onMouseDown, true);
                });
            });
            result.finally(() => {
                if (ctrl.slotProxy) {
                    ctrl.slot = ctrl.slotProxy.$slot;
                    ctrl.slotProxy.parentElement.replaceChild(ctrl, ctrl.slotProxy);
                }
                host.removeEventListener('cancel', onCancel);
                host.removeEventListener('ok', onOk);

                windows.forEach(w => {
                    w.removeEventListener('keydown', onKeyDown, true);
                    w.removeEventListener('mousedown', onMouseDown, true);
                });

                setTimeout(() => host.remove());
            })
            return result;
        }
    }
})

export default CONTAINERS