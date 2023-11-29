ODA.showMenu = async (params = { title: 'menu', icon: 'icons:menu' }) => {
    await ODA.import('@oda/menu');
    return ODA.showDropdown('oda-menu', params, params);
}