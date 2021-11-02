Свойство **«margin»** задает внешний отступ от каждого края компонента в пикселях самого QR-кода.

Размер каждого пикселя QR-кода определяется значением свойства **moduleSize**, который уже задается в стандартных пикселях.

Например, если свойство **moduleSize** задано равным 5, а свойство **margin** установлено в значение 3, то реальный отступ компонента будет составлять 5*3=15 пикселей от каждого края.

Например:

```html _run_line_edit_loadoda_[qr-code-sample.html]_h=450_
<script type="module" src="/components/viewers/qr-code/qr-code.js"></script>
<oda-qr-code value="0123456789" module-size=5 margin=3></oda-qr-code>
<oda-qr-code value="odajs.org" module-size=10 margin=5></oda-qr-code>
```

По умолчание свойство margin установлено в значение 2.
