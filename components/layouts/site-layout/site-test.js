// 'ГЛАВНАЯ УЧЕБНЫЙ ЦЕНТР ДОКУМЕНТАЦИЯ БЛОГ ПАРТНЕРАМ ЦЕНЫ РЕЕСТР ЛИЦЕНЗИЙ ОНАС'

import './site-template.js';
ODA({ is: 'oda-site-test', extends: 'oda-site-template', template: `
<oda-site-footer></oda-site-footer>
`,
});


ODA({ is: 'oda-site-footer', template: `
    <style>
        :host {
            @apply --flex;
            min-height: 400px;
            @apply --header;
        }    
    </style>
    <span ~for="menu">Menu {{item}}</span>
    `,
    props: {
        menu: [
            1, 2, 3, 4
        ]
    }
});

ODA({ is: 'oda-site-content', template: `
    <style>
        :host {
            @apply --vertical;
            @apply --flex;
            overflow: auto;
        }   
        
        span {
            min-height: 100vh;
        } 
    </style>
    <span ~for="pages">Page {{item}}</span>
    `,
    props: {
        pages: [
            1, 2, 3, 4
        ]
    }
});