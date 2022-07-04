import "../../oda.js";
const CONTAINERS = ODA.regTool('containers');
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
            document.body.appendChild(host);
            let close, onMouseDown, onKeyDown, onCancel, onOk;
            const windows = [...Array.prototype.map.call(window.top, w => w), window];
            windows.add(window.top);

            const result = new Promise((resolve, reject) => {
                onMouseDown = (e) => {
                    if (host ===  e.target){
                        if (host._close)
                            host._close(e);
                        else
                            host.fire('cancel');
                    }
                }
                onKeyDown = (e) => {
                    if (e.keyCode === 27) onCancel(e);
                }
                onCancel = (e) => {
                    reject()
                }
                onOk = (e) => {
                    setTimeout(() => resolve(ctrl));
                }
                host.addEventListener('cancel', onCancel);
                host.addEventListener('ok', onOk);

                windows.forEach(w => {
                    w.addEventListener('keydown', onKeyDown, true);
                    w.addEventListener('pointerdown', onMouseDown);
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
                    w.removeEventListener('pointerdown', onMouseDown);
                });

                setTimeout(() => host.remove());
            })
            return result;
        }
    }
})

export default CONTAINERS