ODA({is: 'oda-site-template', extends: 'oda-css', imports: '@oda/icon, ',
    template: /*html*/ `
    <div  id='site-all' :class='_class()'>
        <slot name='region-tuoolbar' id='region-tuoolbar'></slot>
        <slot name='region-mmenu' id='region-mmenu'></slot>
        <slot name='region-ltuoolbar' id='region-ltuoolbar'></slot>
        <slot name='region-rtuoolbar' id='region-rtuoolbar'></slot>
        <div id='site-main'> 
            <slot name='region-header' id='region-header'></slot>
            <slot name='region-left' id='region-left'></slot>
            <slot name='region-abovecontrnt' id='region-abovecontrnt'></slot>
            <slot name='region-contrnt' id='region-contrnt'></slot>
            <slot name='region-undercontrnt' id='region-undercontrnt'></slot>
            <slot name='region-right' id='region-right'></slot>
            <slot name='region-footer' id='region-footer'></slot>
        </div>
        <slot name='region-outbottom' id='region-outbottom'></slot>
    </div>

    `,
    props:{
        css:'./default.css'
    },

})



ODA({ is: 'oda-css', template: /*html*/ `<link rel="stylesheet" :href="css">` })