ODA({is: 'oda-matrix',
    template:`
            <style>
                :host {
                    width: 100vw;
                    height: 100vh;
                    background: radial-gradient(darkblue, blue);
                    animation: fadeIn 1 1s ease-out;
                }
                .light {
                    position: absolute;
                    width: 0px;
                    opacity: 1;
                    background-color: white;
                    box-shadow: white 0px 0px 10px 2px;
                    top: 100vh;
                    bottom: 0px;
                    left: 0px;
                    right: 0px;
                    margin: auto;
                }
                .x1{
                    animation: floatUp 4s infinite linear;
                    transform: scale(1.0);
                }
                .x2{
                    animation: floatUp 7s infinite linear;
                    transform: scale(1.6);
                    left: 15%;
                }

                .x3{
                    animation: floatUp 2.5s infinite linear;
                    transform: scale(.5);
                    left: -15%;
                }

                .x4{
                    animation: floatUp 4.5s infinite linear;
                    transform: scale(1.2);
                    left: -34%;
                }

                .x5{
                    animation: floatUp 8s infinite linear;
                    transform: scale(2.2);
                    left: -57%;
                }

                .x6{
                    animation: floatUp 3s infinite linear;
                    transform: scale(.8);
                    left: -81%;
                }

                .x7{
                    animation: floatUp 5.3s infinite linear;
                    transform: scale(3.2);
                    left: 37%;
                }

                .x8{
                    animation: floatUp 4.7s infinite linear;
                    transform: scale(1.7);
                    left: 62%;
                }

                .x9{
                    animation: floatUp 4.1s infinite linear;
                    transform: scale(0.9);
                    left: 85%;
                }
                @keyframes floatUp{
                    0%{top: -100vh; opacity: 0;}
                    25%{opacity: 1;}
                    50%{top: 0vh; opacity: .8;}
                    75%{opacity: 1;}
                    100%{top: 100vh; opacity: 0;}
                }

            </style>
            <div class='light x1'></div>
            <div class='light x2'></div>
            <div class='light x3'></div>
            <div class='light x4'></div>
            <div class='light x5'></div>
            <div class='light x6'></div>
            <div class='light x7'></div>
            <div class='light x8'></div>
            <div class='light x9'></div>
            `
})