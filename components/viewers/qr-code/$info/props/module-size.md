Свойство **«moduleSize»** задает размер каждого модуля QR-кода в пикселях.

 Например:

```javascript _run_line_edit_loadoda_[my-component.js]
import '/components/viewers/qr-code/qr-code.js';
ODA({
    is: 'my-component',
    template: `
        <style>
            :host {
                background: 'cream';
            }
        </style>
        <label>Размер QR-модуля: <input type="number"> </label>
        <oda-qr-code value="0123456789" :module-size></oda-qr-code>
    `,
    props: {
        moduleSize: 5
    }
});
```

По умолчанию размер каждого модуля QR-кода задано равным 5 пикселям.

Это размер однозначно определяет величину внешнего отступа от области QR-кода, так как свойство  **margin** измеряется не в пикселях, а QR-модулях. По умолчанию оно задано равным двум QR-модулям, т.е. реальный отступ с каждой стороны от QR-кода будет составлять 10 пикселей.
