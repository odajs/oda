import '../app-layout/app-layout.js';
ODA({ is: 'oda-site-layout', extends: 'oda-app-layout', template: `
        <oda-site-header slot="top-right"></oda-site-header>
        <oda-site-content slot="main"></oda-site-content>
        <oda-site-footer slot="footer"></oda-site-footer>
    `
});

ODA({ is: 'oda-site-header', template: `
    <style>
        :host {
            @apply --horizontal;
            @apply --flex;
            min-height: 40px;
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