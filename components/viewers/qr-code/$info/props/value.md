Свойство **«value»** задает исходные данные, которые будут преобразованы в QR-код.

Это может быть как цифровая, так и алфавитно-цифровая информация, которая включает ряд специальных символов, позволяющих кодировать интернет-ссылки.

Например:

```html _run_line_edit_loadoda_[qr-code-sample.html]_h=260_
<script type="module" src="/components/viewers/qr-code/qr-code.js"></script>
<oda-qr-code value="0123456789" module-size=5></oda-qr-code>
<oda-qr-code value="odajs.org" module-size=5></oda-qr-code>
```
