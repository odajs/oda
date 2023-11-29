export default function() {
    return [
        {
            label: 'ODA.showConfirm()',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: 'Show oda-confirm.',
            insertText: "ODA.showConfirm('oda-${1:component}', ${2:{}});",
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
        },
        {
            label: 'ODA.showDialog()',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: 'Show oda-dialog.',
            insertText: "ODA.showDialog('oda-${1:component}', ${2:{}});",
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
        },
        {
            label: 'ODA.showModal()',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: 'Show oda-modal.',
            insertText: "ODA.showModal('oda-${1:component}', ${2:{}});",
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
        },
        {
            label: 'ODA.showDropdown()',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: 'Show oda-dropdown.',
            insertText: "ODA.showDropdown('oda-${1:component}', ${2:{}});",
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
        }
    ];
}