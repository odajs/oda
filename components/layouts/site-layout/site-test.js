
import {sectionsContent} from './content.js';
// Пока сделаю лендинг
import './site-template.js';
ODA({
    is: 'oda-site-test', /*extends: 'oda-css',*/ template: /*html*/ `
    <style>
        :host{width:100%; height: 100%; overflow: scroll;scroll-behavior: smooth;}
        .fix {position:absolute; top:0%;}
        #header {width:100%; background:whitesmoke; border-bottom:2px solid #007fc6;}
        oda-site-header {padding:2% 10%;}
        .fix oda-site-header {padding:5px 10%;}
    </style>
    <div id='header' :class='fixmenu'>
        <oda-site-header :fixmenu ></oda-site-header>
    </div>
    <div ~for='sections' class='content' ~ref='"sec"+index'>
        <div ~if='item?.inmenu' class='menu' slot='mainmenu'><a @tap='_go(index)' :href='"#sec"+index'>{{item?.inmenu}}</a></div>
        <h2 ~if='item?.header' class='secname'>{{item?.header}}</h2>
        <div ~if='item?.body' class='secbody' ~html='item?.body'></div>
    </div>
    <oda-site-footer ></oda-site-footer>
    `,
    props: {
        // css: './default.css',
        sections: sectionsContent,
        fixmenu: 'nofix',
    },
    listeners: {
        'resize': '_resize',
        'scroll': '_scrol'
    },
    _resize() {
        console.log(this.offsetWidth, this.offsetHeight) 
    },

    _scrol(){
        this.fixmenu = (this.scrollTop > 10) ? 'fix' : 'nofix' 
        // console.log(this.scrollTop)
    },
    _go(i) {console.log(this.$refs['sec'+i][0])
        this.scrollTop = this.$refs['sec'+i][0].offsetTop
    }

});


ODA({
    is: 'oda-site-header',/* extends: 'oda-css', */template: /*html*/ `
    <style>
        :host {display:flex;align-items: center; justify-content: space-between; transition: all 0.5s linear;}
        #flogo {width: 20%;}
        #flogo.fix img {height:40px}
        .menu {padding:0 0 0 10px;}
    </style>
    <div id='flogo' :class='fixmenu'><img src='svg/logo_platform-min.svg'/></div>

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

