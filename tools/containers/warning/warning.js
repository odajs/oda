import '../dialog/dialog.js';
ODA({is: 'oda-warning', extends: 'oda-dialog',
    title: 'Warning',
    icon: 'icons:warning'
})
const warning = ODA.showWarning;
ODA.showWarning = async (text, params = {}) => {
    text = text.toString();
    params.hideCancelButton = true;
    let error = false;
    if (text.startsWith('Error: ')) {
        error = text.startsWith('Error:');
        text = text.replace('Error: ', '')
    }
    params.icon ??= error ? 'icons:error' : 'icons:warning';
    if (error) {
        params.title ??= 'Error'
    }
    return await warning('oda-dialog-message', { icon: params.icon, message: text, error: error, warning: !error }, params);
}