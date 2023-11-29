import './lib/qr.js';
ODA({ is: 'oda-qr-code',
    template: `
        <qr-code :data="value" :margin :modulesize="moduleSize" :format></qr-code>
    `,
    $public: {
        value: '',
        format: {
            $def: 'png',
            $list: ['png', 'svg', 'html'],
        },
        margin: 2,
        moduleSize: 5
    }
})
