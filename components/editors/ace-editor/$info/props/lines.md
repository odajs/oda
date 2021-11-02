Свойство **«lines»** задает количество строк в редакторе ace-editor.

```html _run_line_edit_loadoda_[page-with-oda-ace-editor.html]
<script type="module" src="/components/editors/ace-editor/ace-editor.js"></script>
<oda-ace-editor src="Текст 1" lines="1"></oda-ace-editor>
```

В случае, если количество строк указано более двух, то сбоку окна редактора ace-editor появятся стрелочки прокрутки:

```html _run_line_edit_loadoda_[page-with-oda-ace-editor.html]
<script type="module" src="/components/editors/ace-editor/ace-editor.js"></script>
<oda-ace-editor src="Текст 2" lines="10"></oda-ace-editor>
```