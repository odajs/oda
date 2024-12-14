const CONTAINERS = ODA.regTool('containers')
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
            if (hostProps?.parent){
                let last = document.body.lastChild;
                while (last?.isContainer) {
                    if (last.parent === hostProps?.parent)
                        return;
                    // if (!last.includes(hostProps?.parent))
                    //     last.fire('cancel');
                    last = last.previousSibling;
                }
            }

            for (let i = 0; i<top.length; i++){
                const win = top[i];
                if (win === window) continue;
                let last = win.document.body.lastChild;
                while (last?.isContainer) {
                    last.fire('cancel');
                    last = last.previousSibling;
                }
            }

            const fn = ODA[('show-' + id).toCamelCase()];
            await import(path + '/' + id + '/' + id + '.js');
            if (ODA[('show-' + id).toCamelCase()] !== fn){
                return ODA[('show-' + id).toCamelCase()](...arguments);
            }
            const hostTag = `oda-${id}`;
            await ODA.waitReg(hostTag);

            const containerHost = await ODA.createComponent(hostTag, hostProps);
            hostProps.containerHost = containerHost;
            // containerHost.style.visibility = 'hidden';

            let control = component;
            if (typeof control === 'string') {
                ODA.waitReg(control);
                control = await ODA.createComponent.call(containerHost, control, props);
            }
            else { //todo Поверить режим для готовых компонентов
                if (control.parentElement) {
                    if (control.containerHost)
                        control.containerHost.fire('cancel');
                    const comment = document.createComment(control.innerHTML);
                    comment.slotTarget = control;
                    control.slotProxy = comment;
                    control.containerHost = containerHost;
                    comment.$slot = control.slot;
                    delete control.slot;
                    control.parentElement.replaceChild(comment, control);
                }
                control.assignProps(props);
            }
            containerHost.isContainer = true;
            containerHost.style.position = 'fixed';
            containerHost.style.zIndex = 1000;
            containerHost.style.width = containerHost.style.height = containerHost.style.maxWidth = containerHost.style.maxHeight = '100%';
            control.containerHost = containerHost;
            containerHost.appendChild(control);
            document.body.appendChild(containerHost);
            let onKeyDown, onCancel, onOk, onPointerDown, ignore;
            const result = new Promise((resolve, reject) => {
                function clearUp(){
                    let last = document.body.lastChild;
                    while (last?.isContainer && last !== containerHost) {
                        last.fire('cancel');
                        last = last.previousSibling;
                    }
                }
                onPointerDown = (e) =>{
                    if (hostProps.parent && e.composedPath().includes(hostProps.parent))
                        // e.stopPropagation();
                        return;
                    let host = containerHost;
                    if (e.target instanceof Node){
                        while(host && host.isContainer){
                            if (host.contains(e.target)){
                                e.stopPropagation();
                                return;
                            }
                            host = host.nextSibling;
                        }
                    }
                    onCancel();
                }
                onKeyDown = (e) => {
                    if (e.keyCode !== 27) return;
                    let last = document.body.lastChild;
                    while (!last?.isContainer) {
                        last = last.previousSibling;
                    }
                    last?.fire?.('cancel');
                };
                onCancel = (e) => {

                    reject('Cancel');

                    clearUp();
                };
                onOk = (e) => {

                    resolve({containerHost, control, result: e.detail.value});

                    clearUp();
                };
                containerHost.addEventListener('ok', onOk);
                containerHost.addEventListener('cancel', onCancel);

                control.addEventListener('ok', onOk);
                control.addEventListener('cancel', onCancel);
                top.addEventListener('keydown', onKeyDown);
                top.addEventListener('pointerdown', onPointerDown);
                window.addEventListener('pointerdown', onPointerDown, true);
                hostProps.parent?.addEventListener('pointerdown', onPointerDown, true);
            }).finally(() => {
                if (control.slotProxy) {
                    control.slot = control.slotProxy.$slot;
                    control.slotProxy.parentElement.replaceChild(control, control.slotProxy);
                }
                containerHost.removeEventListener('cancel', onCancel);
                containerHost.removeEventListener('ok', onOk);
                control.removeEventListener('ok', onOk);
                control.removeEventListener('cancel', onCancel);
                top.removeEventListener('keydown', onKeyDown);
                top.removeEventListener('pointerdown', onPointerDown);
                window.removeEventListener('pointerdown', onPointerDown, true);
                hostProps.parent?.removeEventListener('pointerdown', onPointerDown, true);
                containerHost.remove();
            })
            return result;
        }
    }
})
export default CONTAINERS