ODA({is: 'oda-tab',
    template: `
        <style>
            :host{
                @apply --vertical;
                @apply --flex;
                overflow: hidden;
                position: relative;
            }
        </style>
        <oda-tab-groups ~if="showGroupsPanel"></oda-tab-groups>
        <oda-tab-head ~if="showHeader"></oda-tab-head>
        <oda-tab-body tabindex="0" :even-odd :col-lines :row-lines></oda-tab-body>
        <oda-tab-foot ~if="showFooter"></oda-tab-foot>
    `,
    $public:{
        showGroupsPanel: {
            $def: false,
            $save: true
        },
        evenOdd: {
            $def: false,
            $save: true
        },
        colLines: {
            $def: false,
            $save: true
        },
        rowLines: {
            $def: false,
            $save: true
        },
        showHeader: false,
        showFooter: false,

    },
    columns:{

    },
    dataSet:{

    },
    items:{

    },
    rows:{

    }
})
ODA({is: 'oda-tab-groups',
    template: `
        oda-tab-groups
    `

})
ODA({is: 'oda-tab-head',
    template: `
        <style>
            :host{
                @apply --gark;
                @apply --horizontal;
            }
        </style>
        oda-tab-head
    `

})
ODA({is: 'oda-tab-body',
    template: `
        <style>
            :host{
                @apply --flex;
                @apply --vertical;
            }
        </style>
        <div>
        oda-tab-body
        </div>
        
    `

})
ODA({is: 'oda-tab-foot',
    template: `
        <style>
            :host{
                @apply --gark;
                @apply --horizontal;
            }
        </style>
        oda-tab-foot
    `

})