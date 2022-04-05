ODA({ is: 'oda-dino',
    template: `
        <style>
            .hidden {
                display: none;
            }
            svg.dinos path {
                fill: var(--dino-color);
            }
        </style>

        <svg version="1.1" baseProfile="full" width="186" height="137" xmlns="http://www.w3.org/2000/svg" class="dinos">

            <!-- Тело -->
            <path d=" M0 48, h7, v12, h6, v7, h6, v6, h13, v-6, h7, v-7, h9, v-6, h10, v-6, h6, v-42, h7, v-6, h51, v6, h6, v29, h-32, v6, h19, v7, h-25, v12, h13, v13, h-7, v-6, h-6, v22, h-7, v10, h-6, v6, h-6, v7, h-45, v-7, h-7, v-6, h-6, v-7, h-6, v-6, h-7, z " stroke="transparent" id="body" visibility="visible"/>

            <!--Глаз маленький-->
            <rect x="77" y="9" fill="white" height="7" width="6" id="small-eye" class="eyes"/>

            <!--Глаз большой-->
            <rect x="78.5" y="10.5" fill="transparent" stroke-width="3" stroke="white" height="10" width="10" id="big-eye" visibility="hidden"/>

            <!--Рот-->
            <path d=" M95 34, v8, h20, v-1, h13, v-7, z " id="month" visibility="hidden"/>

            <!-- Тело наклон-->
            <path d=" M0 53, h6, v6, h13, v7, h26, v-7, h54, v7, h13, v-3, h6, v-7, h52, v7, h6, v28, h-32, v7, h19, v6, h-45, v-6, h-12, v9, h-7, v7, h7, v6, h-13, v-13, h-16, v4, h-39, v-7, h-6, v-6, h-6, v-7, h-7, v-6, h-6, v-6, h-7, v-7, h-6, z " id="body-bow" visibility="visible" class="hidden"/>

            <!--Глаз маленький наклон-->
            <rect x="125" y="66" fill="white" height="6" width="6" id="small-eye-bow" visibility="visible" class="hidden"/>

            <!--Глаз большой наклон-->
            <rect x="126.5" y="67.5" fill="transparent" stroke-width="3" stroke="white" height="10" width="10" id="big-eye-bow" visibility="hidden"/>

            <!--Рот наклон-->
            <path d="M143 90,v9,h20,v-1,h7,v-8,z" fill="grey" id="month-bow" visibility="hidden"/>

            <!--Первая нога-->
            <path d=" M32 111, v26, h13, v-6, h-6, v-7, h6, v-6, h6, v-7, z " id="first-leg" visibility="hidden"/>

            <!--Вторая нога-->
            <path d="M58 111,v7,h6,v19,h13,v-6,h-6,v-20,z" id="second-leg" visibility="hidden"/>

            <!-- Третья нога -->
            <path d="M64 111, v7, h16, v-6, h-9, v-1, z" visibility="hidden" id="third-leg"/>

            <!--Четвертая нога-->
            <path d=" M32 111, v7, h7, v6, h12, v-6, h-6, v-7, z " visibility="hidden" id="fourth-leg"/>

            <!--Первая нога наклон-->
            <path d=" M35 111, v25, h13, v-6, h-6, v-7, h6, v-6, h6, v-7, h-16, v1, z " id="first-leg-bow" visibility="hidden" class="hidden"/>

            <!--Вторая нога наклон-->
            <path d="M54 110, v26, h13, v-6, h-6, v-7, h6, v-6, h7, v-7, z " id="second-leg-bow" visibility="hidden" class="hidden"/>

            <!--Третья нога наклон-->
            <path d=" M67 110, v7, h16, v-6, h-6, v-1, z " id="third-leg-bow" visibility="hidden" class="hidden"/>

            <!-- Четвертая нога наклон -->
            <path d=" M35 111, v12, h13, v-6, h-6, v-7, h-4, v1, z " visibility="hidden" id="fourth-leg-bow" class="hidden"/>

            <animate href="#first-leg" attributeName="visibility" values="visible;hidden" dur="0.3s" repeatCount="indefinite" id="first-leg-anim"/>
            <animate href = "#fourth-leg" attributeName="visibility" values = "hidden;visible" dur="0.3s" repeatCount="indefinite"/>
            <animate href="#second-leg" attributeName="visibility" values="hidden;visible" dur="0.3s" repeatCount="indefinite" id="second-leg-anim"/>
            <animate href = "#third-leg" attributeName = "visibility" values = "visible;hidden" dur="0.3s" repeatCount = "indefinite"/>
            <animate href="#first-leg-bow" attributeName="visibility" values="visible;hidden" dur="0.3s" repeatCount="indefinite" id="first-leg-bow-anim"/>
            <animate href = "#fourth-leg-bow" attributeName="visibility" values = "hidden;visible" dur="0.3s" repeatCount="indefinite"/>
            <animate href="#second-leg-bow" attributeName="visibility" values="hidden;visible" dur="0.3s" repeatCount="indefinite" id="second-leg-bow-anim"/>
            <animate href = "#third-leg-bow" attributeName = "visibility" values = "visible;hidden" dur="0.3s" repeatCount = "indefinite"/>
        </svg>
    `,
    props: {
        name: "Привет динозавр",
    },
})
