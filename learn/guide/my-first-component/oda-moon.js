ODA({ is: 'oda-moon',
    template: `
        <style>
            .hidden {
                display: none;
            }
            svg path {
                fill: var(--moon-color);
            }
        </style>
        <svg version="1.1" baseProfile="full" width="64" height="128" xmlns="http://www.w3.org/2000/svg">
            <path d=" M0 128, v-7, h10, v-6, h6, v-6, h7, v-6, h3, v-10, h3, v-58, h-3, v-10, h-3, v-6, h-7, v-7, h-6, v-6, h-10, v-6, h19, v6, h13, v6, h7, v7, h6, v6, h6, v10, h7, v9, h6, v39, h-6, v9, h-7, v10, h-6, v6, h-6, v7, h-7, v6, h-13, v7, z"/>
        </svg>
    `,
    props: {
        name: "Привет луна",
    },
})
