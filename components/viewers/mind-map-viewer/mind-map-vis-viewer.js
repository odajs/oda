import './mind-map-vis/mind-map-vis.js';

ODA({
    is: 'mind-map-viewer',
    template: `
        <mind-map-vis :data-set="dataSet" :data-s="dataSet"></mind-map-vis>        
    `,
    props: {
        dataSet: [{
            label: "КОРЕНЬ", items: [
                { label: "1 строка" },
                {
                    label: "2 строка",
                    items: [
                        { label: "2.1 строка", },
                        {
                            label: "2.2 строка",
                            items: [
                                { label: "2.2.1 строка" },
                                { label: "2.2.2 строка" },
                                { label: "2.2.3 строка" },
                                { label: "2.2.4 строка" },
                                { label: "2.2.5 строка" },
                                { label: "2.2.6 строка" },
                                { label: "2.2.7 строка" },
                                { label: "2.2.8 строка" },
                                { label: "2.2.9 строка" },
                                { label: "2.2.10 строка" }
                            ]
                        },
                        { label: "2.3 строка" },
                        { label: "2.4 строка" },
                        { label: "2.5 строка" }
                    ]
                },
                {
                    label: "3 строка",
                    items: [
                        { label: "3.1 строка" },
                        { label: "3.2 строка" },
                        { label: "3.3 строка" },
                        { label: "3.4 строка" },
                        { label: "3.5 строка" },
                        { label: "3.6 строка" },
                        { label: "3.7 строка" },
                        { label: "3.8 строка" },
                        { label: "3.9 строка" },
                        { label: "3.10 строка" }
                    ]
                },
                { label: "4 строка" },
                {
                    label: "5 строка",
                    items: [
                        { label: "5.1 строка" },
                        {
                            label: "5.2 строка",
                            items: [
                                { label: "5.2.1 строка" },
                                { label: "5.2.2 строка" },
                                { label: "5.2.3 строка" },
                                { label: "5.2.4 строка" },
                                { label: "5.2.5 строка" },
                                { label: "5.2.6 строка" },
                                { label: "5.2.7 строка" },
                                { label: "5.2.8 строка" },
                                { label: "5.2.9 строка" },
                                { label: "5.2.10 строка" }
                            ]
                        },
                        { label: "5.3 строка" },
                        { label: "5.4 строка" },
                        { label: "5.5 строка" },
                        { label: "5.6 строка" },
                        { label: "5.7 строка" },
                        { label: "5.8 строка" },
                        { label: "5.9 строка" },
                        { label: "5.10 строка" }
                    ]
                },
                { label: "6 строка" },
                {
                    label: "7 строка",
                    items: [
                        { label: 'новая ветка' },
                        {
                            label: 'БАЗА ДАННЫХ', items: [
                                { label: 'новая ветка' }
                            ]
                        }
                    ]
                },
                { label: "8 строка" },
                { label: "9 строка" },
                { label: "10 строка" }
            ]
        }]
    },
    
});