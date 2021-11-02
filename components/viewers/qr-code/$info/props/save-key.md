Свойство **saveKey** задает ключ, с которым значения свойств компонента сохраняются в Веб-хранилище. Свойство функционирует аналогично директиве [**~save-key**](https://odajs.org/#learn#learn/docs/guide/structure/template/jsx/directives/~save-key.md).

В Веб-хранилище сохраняются значения только тех свойств, у которых параметр **save** установлен в значение **true**. Компонент **oda-qr-code** сохраняемых свойств не имеет.


```javascript _run_line_edit_loadoda_[my-component]_h=220_
<script type="module" src="/components/viewers/qr-code/qr-code.js"></script>

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
