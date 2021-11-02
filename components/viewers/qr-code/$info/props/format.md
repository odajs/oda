Свойство **«format»** задает формат, в котором будет выводится QR-код.

 На данный момент используются всего 3 формата:

 1. PNG — QR-код выводится в формате png.
 1. SVG — QR-код выводится в формате svn.
 1. HTML — QR-код выводится в формате html.

Например:

```html _run_line_edit_loadoda_[qr-code-sample.html]_h=500_
<script type="module" src="/components/viewers/qr-code/qr-code.js"></script>
<oda-qr-code value="It's PNG" module-size=5></oda-qr-code>
<oda-qr-code value="It's also PNG" module-size=5 format="png"></oda-qr-code>
<oda-qr-code value="It's SVG" module-size=5 format="svg"></oda-qr-code>
<oda-qr-code value="It's HTML" module-size=5 format="html"></oda-qr-code>
```

Форматом по умолчанию является PNG.
