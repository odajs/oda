import '../dialog/dialog.js';
ODA({is: 'oda-confirm', extends: 'oda-dialog',
    title: 'Confirm',
    icon: 'icons:help'
})
const confirm = ODA.showConfirm;
ODA.showConfirm = async (text, params = {}) => {
    return await confirm('oda-dialog-message', { icon: 'icons:help', message: text }, params);
}