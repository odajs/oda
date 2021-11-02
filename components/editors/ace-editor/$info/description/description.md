Компонент **ace-editor** предназначен для редактирования или просмотра кода на различных языках программирования c подсветкой синтаксиса для более чем 110 языков.

Для его использования необходимо подключить JS-модуль **ace-editor.js** и добавить в HTML-код пользовательский тэг **\<oda-ace-editor>**.

Использование на HTML странице:

```html _run_line_edit_loadoda_[page-with-oda-ace-editor.html]_h=54_
<script type="module" src="../../../oda.js"></script>
<script type="module" src="/components/editors/ace-editor/ace-editor.js"></script>
<oda-ace-editor src="Source code ..."></oda-ace-editor>
```

Использование в составе другого компонента:

```javascript _run_line_edit_loadoda_[my-component-with-oda-ace-editor.js]_h=54_
import '/components/editors/ace-editor/ace-editor.js';
ODA({
    is: 'my-component-with-oda-ace-editor',
    template: `
        <oda-ace-editor :src></oda-ace-editor>
    `,
    props: {
        src: 'Мой компонент использует oda-ace-editor'
    }
});
```
