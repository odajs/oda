ODA({is: 'oda-loader',  extends: 'oda-icon', imports: '@oda/icon',
    template: /*html*/`
    <style>
        :host{
            position: fixed !important;
            top: 50%;
            left: 50%;
            z-index: 1000;
            transform: translate3d(-50%, -50%, 0);
            pointer-events: none;
            opacity: 0.5;
            filter: drop-shadow(2px 2px 5px rgba(0,0,0,0.5));
        }
        :host .icon{
            border-radius: 50%;
            animation: spin 1.5s linear infinite;
            @apply --content;
        }
        @keyframes spin {
                0% { transform: rotate(0deg) scale(1); }
                50% { transform: rotate(180deg) scale(.9); }
                100% { transform: rotate(360deg) scale(1); }
            }
    </style>
    `,
    iconSize: 64,
    icon: 'icons:settings',
    tasks: [],
    hidden:{
        get(){
            return !this.tasks.length;
        },
        $attr: true
    },
    addTask(task) {
        if (!task) {
            const id = Math.floor(Math.random() * Date.now()).toString(16);
            task = {id}
        }
        if (!this.tasks.some(t => t.id === task.id))
            this.tasks.push(task);
        return task
    },
    removeTask(task) {
        if (!task) return;
        const idx = this.tasks.findIndex(t => t.id === task.id);
        if (~idx)
            this.tasks.splice(idx, 1);
    }
});
let loaderPromise;
export async function getLoader(icon = 'icons:settings') {
    if (ODA.top.__loader) return ODA.top.__loader;
    return loaderPromise ??= new Promise(async (resolve, reject) => {
        try {
            await ODA.top.ODA.import('@oda/loader');
            await ODA.top.ODA.waitReg('oda-loader');
            ODA.top.__loader = ODA.top.document.body.querySelector('oda-loader');
            if (!ODA.top.__loader) {
                ODA.top.__loader = ODA.top.document.createElement('oda-loader');
                ODA.top.__loader.icon = icon;
                ODA.top.document.body.appendChild(ODA.top.__loader);
            }
            resolve(ODA.top.__loader);
        }
        catch (err) {
            console.error('Error on get loader: ', err);
            reject(err);
        }
    })
}