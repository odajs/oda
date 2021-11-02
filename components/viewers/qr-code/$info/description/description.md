Компонент **«qr-code»** это компонент для вывода QR-кода внутри текстового сообщения в формате *.png или *.svg или *.html. 

Для использования компонента необходимо подключить JS-модуль **«qr-code.js»** и добавить в HTML-код пользовательский тэг **«oda-qr-code»**.

```html _run_line_edit_loadoda_[qr-code-sample.html]_h=260_
<script type="module" src="../../../oda.js"></script>
<script type="module" src="/components/viewers/qr-code/qr-code.js"></script>
<oda-qr-code value="0987654321-1234567890" modulesize=10></oda-qr-code>
```
