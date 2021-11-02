Свойство **«value»** задает исходный текст для редактирования, при этом происходит двухстороннее связывание с редактируемыми данными в **«ace-editor»** 

Например:

```javascript _run_line_edit_loadoda_[my-component.js]_h=220_
import '/components/editors/ace-editor/ace-editor.js';
ODA({
    is: 'my-component',
    template: `
        <oda-ace-editor ::value></oda-ace-editor>
        <div>Value:</div>
        <textarea :value readonly style="width: 100%; height: 100px;"></textarea>
    `,
    props: {
        value: 'Редактируемый текст с двухсторонним связыванием ...'
    }
});
```