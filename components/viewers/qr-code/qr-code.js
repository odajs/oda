import './qr.js' // https://www.webcomponents.org/element/webcomponent-qr-code
ODA({ is: 'oda-qr-code', template: `
    <qr-code :data="value" :margin :modulesize="moduleSize" :format></qr-code>
    `,
    props: {
        value: '',
        format: {
            default: 'png',
            list: ['png', 'svg', 'html'],
        },
        margin: 2,
        moduleSize: 5
    }
})
