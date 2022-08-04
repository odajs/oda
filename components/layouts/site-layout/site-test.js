
import {sectionsContent} from './content.js';
// Пока сделаю лендинг
import './site-template.js';
ODA({
    is: 'oda-site-test', /*extends: 'oda-css',*/ template: /*html*/ `
    <style>
        :host{width:100%; height: 100%; overflow: scroll;}
    </style>
    <oda-site-header ></oda-site-header>
    <div ~for='sections' class='content'>
        <div ~if='item?.inmenu' class='menu' slot='mainmenu'><a :href='"#sec"+index'>{{item?.inmenu}}</a></div>
        <a ~if='item?.inmenu' :name='"#sec"+index'></a>
        <h2 ~if='item?.header' class='secname'>{{item?.header}}</h2>
        <div ~if='item?.body' class='secbody' ~html='item?.body'></div>
    </div>
    <oda-site-footer ></oda-site-footer>
    `,
    props: {
        // css: './default.css',
        sections: sectionsContent,
        // w:{ get() {return this.offsetWidth} }
    },
    listeners: {
        'resize': '_resize',
        'scroll': '_scrol'

    },
    _resize() {
        console.log(this.offsetWidth, this.offsetHeight) 
    },

    _scrol(){ console.log(this.scrollTop)}

});


ODA({
    is: 'oda-site-header',/* extends: 'oda-css', */template: /*html*/ `
    <style>
        :host {display:flex;padding:2% 10%;align-items: center; justify-content: space-between;}
        #flogo {width: 20%;}

        .menu {padding:0 0 0 10px;}
    </style>
    <div id='flogo'><img src='svg/logo_platform-min.svg'/></div>

    <slot name='mainmenu' class='mainmenu'></slot>
    `
});


ODA({
    is: 'oda-site-footer',/* extends: 'oda-css',*/ template: /*html*/ `
    <div class='fcontent' ~html='content'></div>
    <div id='soc-menu'>
        <a ~for='socLinck' :href='item?.linck' :title='item?.title'><img :src='item?.img' /></a>
    </div>
    `,
    props: {
        socLinck: [{ img: 'test-soc/1.png', title: 'weChat', linck: '/' }, { img: 'test-soc/3.png', title: 'telegram', linck: '/' },
        { img: 'test-soc/2.png', title: 'vk', linck: '/' }, { img: 'test-soc/4.png', title: 'skype', linck: '/' }],
        content: /*html*/  `Copyright © 2015 BusinessInterSoft, <br/> LLC. ODANT® - is a registered trademark of BusinessInterSoft, LLC.`

    }
});

