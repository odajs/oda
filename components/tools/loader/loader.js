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