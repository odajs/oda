ODA({
    is: 'oda-loader',
    extends: 'oda-icon', imports: '@oda/icon',
    template: /*html*/`
    <style>:host{visibility: {{show ? 'visible' : 'hidden'}};}</style>
    `,
    iconSize: 128,
    icon: 'odant:spin',
    fill: 'var(--focused-color)',
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