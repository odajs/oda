Компонент **html-editor** предназначен для редактирование HTML кода с просмотром в реальном времени.

Для его использования необходимо подключить JS-модуль «**html-editor.js**» и добавить в HTML-код пользовательский тэг **oda-html-editor**.

Например:

```html _run_line_edit_loadoda_[demo.html]_h=400_
<script type="module" src="../../../oda.js"></script>
<script type="module" src="/components/editors/html-editor/html-editor.js"></script>
<oda-html-editor src="&lt;h1 style='color:red'&gt;HTML editor with live preview&lt;/h1&gt;" show-editor></oda-html-editor>
```
