ODA({
    is: 'oda-loader',
    extends: 'oda-icon', imports: '@oda/icon',
    template: /*html*/`
    <style>
        :host{
            visibility: {{show ? 'visible' : 'hidden'}};
            opacity: .5
        }
        .icon{
            display: {{show ? '' : 'none'}};
        }
    </style>
    `,
    iconSize: 128,
    icon: 'odant:spin',
    fill: 'var(--info-color)',
    tasks: [],
    _show: false,
    get show() {
        this.tasks?.length;
        this.interval('show', () => {
            this._show = this.tasks?.length !== 0;
        }, this.delay);
        return this._show;
    },
    delay: 1000,
})

if(window === window.top) {
    await ODA.tryReg('oda-loader');
    const loader = document.createElement('oda-loader');
    loader.style = 'position: fixed;top: 50%;left: 50%;z-index: 100;transform: translate3d(-50%, -50%, 0);pointer-events: none;';
    loader.iconSize = 64;
    document.body.appendChild(loader);
    const $tasks = [];
    ((obj, methods) => {
        for (const m of methods) {
            obj[m] = (...args) => {
                obj.constructor.prototype[m].apply($tasks, args);
                loader.tasks = $tasks;
                if (loader.tasks.length <= 0) {
                    loader.show = false;
                }
            }
        }
    })($tasks, ['push', 'splice']);
    ODANT.$tasks = $tasks;
}