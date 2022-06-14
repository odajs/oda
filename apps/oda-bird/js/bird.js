export { BirdFactory }

//  import styles from '../../css/bird.css';

// import styles from '../../js/css-module-loader.js?src=./css/bird.css'

import {bestNeuroBrain} from './generation.js'

let tmp = document.createElement('template');
tmp.innerHTML = `
    <style>
        :host {
            position: absolute;
            display: block;
        }
        img {
            display: block;
            width: 40px;
            height: 40px;
        }
    </style>

    <img id="bird-image" part="bird-image" class="bird" src="images/angry-birds.png" />
`;

tmp.setAttribute('id', 'tmp-bird');
tmp.setAttribute('a', '2');

tmp.b = 1;
tmp.a = 3;

document.body.append(tmp);

function MyRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function map (n, start1, stop1, start2, stop2) {
    return (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
}

//map(5,-10,10,0,1)
//(-10-0))/(10-0)*(1-0)+0 = 15/20*1=0,75

//0->0,5
//-10->0
//10->1

function BirdFactory() {

    class NeuroBird extends HTMLElement {

        constructor () {
            super();
            // let tmp = document.createElement('template');
            // tmp.innerHTML = '<img id="bird" part="bird-image" class="bird" src="images/angry-birds.png" />';
            this.attachShadow({mode: 'open'});
            this.shadowRoot.appendChild(document.importNode(tmp.content, true));
            // this.shadowRoot.adoptedStyleSheets = [styles];
            this.shadowRoot.querySelector('#bird-image').onload = () => this.isReady = true;
            // this.speedX = MyRandom(2, this.maxVelocity.x);
            this.speedX = this.maxVelocity.x;
            this.speedY = 0;
            this.neuroBrain = bestNeuroBrain.clone();
            this.neuroBrain.cost = 0;

            // this.neuroBrain.mutate(); // Mutate the clone

            this.randomAmount = Math.random();
            if (this.randomAmount<0.75) {
                this.neuroBrain.mutate();// Mutate the clone
            }

            // if (MyRandom(0,1)>MyRandom(0,1)) {
            //     this.neuroBrain.mutate();// Mutate the clone
            // }

            this.countRotation = 0;
            this.traveledDistance = 0;
        }

        neuroBrain;

        countRotation;

        traveledDistance;

        isReady = false;

        // speedX = 1;
        // speedY = 1;

        maxVelocity = {
            x: 10,
            y: 10
        }



        minVelocityY = 10;

        connectedCallback() {
            // Object.defineProperty(NeuroBird.prototype, 'my', {
            //     configurable: true,
            //     enumerable: true,
            //     writeable: true,
            //     get: function() {
            //          return this.getAttribute('my');
            //     },
            //     set: function (value) {
            //         this.setAttribute('my', value)
            //     }
            // });

            this.style.transform = `translate3d(${Math.random()*100}px, ${Math.random()*800}px, 0)`;
            // this.style.transform = `translate3d(${Math.random()*200}px, ${Math.random()*200}px, 0)`;
            // this.style.top = Math.random()*100+'px';
            // this.style.left = Math.random()*300+'px';
            // this.style.left = 100+'px';
        }

        // static get observedAttributes() {
        //     return ['my'];
        // }

        // attributeChangedCallback(name, oldValue, newValue) {
        //     switch (name) {
        //         case 'my':
        //             if (this.my !== newValue) {
        //                 this.my = newValue;
        //             }
        //             break;
        //         default:
        //             break;
        //     }
        // }

        // get my() {
        //     return this.getAttribute('my');
        // }

        // set my(value) {
        //     this.setAttribute('my', value);
        // }

        move() {
            if (!this.isReady)
                return;

            const rect = this.getBoundingClientRect();


            // const inputs = [[
            //     map(rect.x, this.parentNode.offsetLeft, this.parentNode.offsetLeft + this.parentNode.offsetWidth, 0, 1),
            //     map(rect.x + rect.width, this.parentNode.offsetLeft, this.parentNode.offsetLeft + this.parentNode.offsetWidth, 0, 1),
            //     map(this.speedX, 0, 10, 0, 1),


            //     map(rect.y, this.parentNode.offsetTop, this.parentNode.offsetTop + this.parentNode.offsetHeight, 0, 1),
            //     map(rect.y + rect.height, this.parentNode.offsetTop, this.parentNode.offsetTop + this.parentNode.offsetHeight, 0, 1),
            //     map(this.speedY, 0, 10, 0, 1),

            //     // this.speedX,
            //     // rect.y,
            //     // rect.height,
            //     // this.speedY
            // ]];

            const inputs = [[
                map(this.speedX > 0 ? this.parentNode.offsetLeft + this.parentNode.offsetWidth - (rect.x + rect.width) :
                rect.x , this.parentNode.offsetLeft, this.parentNode.offsetLeft + this.parentNode.offsetWidth, 0, 1),
            ]];

            const result = this.neuroBrain.feedForward(inputs[0]);

            if (result[1]  > result[0]) {
                // const x = rect.x + this.speedX;
                // if ( (x + rect.width > this.parentNode.offsetLeft + this.parentNode.offsetWidth && this.speedX > 0) ||
                //      (x < this.parentNode.offsetLeft && this.speedX < 0) ) {
                //     this.neuroBrain.cost += 10;
                // }
                // else this.neuroBrain.cost -= 20;

                this.speedX = -this.speedX;
                this.countRotation++;
            }

            this.neuroBrain.cost+=10;
            if (this.countRotation > 10) {
                this.remove();
                return;
            }

            let x = rect.x + this.speedX;
            if ((x + rect.width > this.parentNode.offsetLeft + this.parentNode.offsetWidth && this.speedX > 0) ||
                (x < this.parentNode.offsetLeft && this.speedX < 0) ) {
                if ( this.countRotation == 0 )
                    this.neuroBrain.cost = -1000;
                if (this.neuroBrain.cost >= bestNeuroBrain.cost) {
                    bestNeuroBrain.change(this.neuroBrain);
                }
                this.remove();
                return;
            }

            // if (x + rect.width > this.parentNode.offsetWidth && this.speedX > 0) {
            //     x = 2 * (this.parentNode.offsetWidth - rect.width) - x;
            //     this.speedX = -this.speedX;
            // } else if (x < this.parentNode.offsetLeft && this.speedX < 0) {
            //     x = this.parentNode.offsetLeft - x;
            //     this.speedX=-this.speedX;
            // }


            // if (result[3]  > result[2]) {
            //     this.speedY = -this.speedY;
            //     this.countRotation++;
            //     this.neuroBrain.cost -= 100;
            // }
            let  y = rect.y + this.speedY;
            // if ( (y + rect.height > this.parentNode.offsetHeight && this.speedY > 0) ||
            //     (y < this.parentNode.offsetTop && this.speedY < 0) ) {

            //     this.neuroBrain.cost -= 1000;

            //     if (this.neuroBrain.cost > bestNeuroBrain.cost) {
            //         bestNeuroBrain.change(this.neuroBrain);
            //     }

            //     this.remove();
            //     return;
            // }





            // if (this.neuroBrain.cost < -10) {
            //     if (this.neuroBrain.cost >= bestNeuroBrain.cost) {
            //         bestNeuroBrain.change(this.neuroBrain);
            //         console.log(this.neuroBrain.cost);
            //     }
            //     this.remove();
            //     return;
            // }



            this.traveledDistance += Math.hypot(this.speedX, this.speedY);
            // this.neuroBrain.cost += Math.hypot(this.speedX, this.speedY);

            // let y = rect.y + this.speedY;

            // if (y + rect.height > this.parentNode.offsetHeight && this.speedY > 0) {
            //     y = 2 * (this.parentNode.offsetHeight - rect.height) - y;
            //     this.speedY = -this.speedY;
            // } else if (y < this.parentNode.offsetTop && this.speedY < 0) {
            //     y = this.parentNode.offsetTop - y;
            //     this.speedY=-this.speedY;
            // }

            this.style.transform = `translate3d(${x}px, ${y}px, 0)`;
            this.style.transform += (this.speedX < 0) ? ' scaleX(-1)' : "";
        }

        // showMessage(event) {
        //     alert("This is the message " + this.getAttribute('greet-name'));
        //     console.log(event);
        // }

    }

    return NeuroBird;
}

// export { BirdFactory }

// // import styles from '../../css/bird.css';

// import styles from '../../js/css-module-loader.js?src=./css/bird.css'

// let tmp = document.createElement('template');
// tmp.innerHTML = `
// <img id="bird" part="bird-image" class="bird" src="images/angry-birds.png" />
// `;
// tmp.setAttribute('id', 'tmp-bird');
// tmp.setAttribute('a', '2');
// tmp.b = 1;
// tmp.a = 3;
// document.body.append(tmp);

// function BirdFactory() {

//     class NeuroBird extends HTMLElement {

//         constructor () {
//             super();
//             // let tmp = document.createElement('template');
//             // tmp.innerHTML = '<img id="bird" part="bird-image" class="bird" src="images/angry-birds.png" />';
//             this.attachShadow({mode: 'open'});
//             this.shadowRoot.appendChild(document.importNode(tmp.content, true));
//             this.shadowRoot.adoptedStyleSheets = [styles];
//         }

//         connectedCallback() {
//             // Object.defineProperty(NeuroBird.prototype, 'my', {
//             //     configurable: true,
//             //     enumerable: true,
//             //     writeable: true,
//             //     get: function() {
//             //          return this.getAttribute('my');
//             //     },
//             //     set: function (value) {
//             //         this.setAttribute('my', value)
//             //     }
//             // });
//             console.log("Connected");
//             this.style.top = Math.random()*100+'px';
//             this.style.left = Math.random()*300+'px';
//         }

//         static get observedAttributes() {
//             return ['my'];
//         }

//         attributeChangedCallback(name, oldValue, newValue) {
//             switch (name) {
//                 case 'my':
//                     if (this.my !== newValue) {
//                         this.my = newValue;
//                     }
//                     break;
//                 default:
//                     break;
//             }
//         }

//         get my() {
//             return this.getAttribute('my');
//         }

//         set my(value) {
//             this.setAttribute('my', value);
//         }

//         showMessage(event) {
//             alert("This is the message " + this.getAttribute('greet-name'));
//             console.log(event);
//         }

//     }

//     return NeuroBird;
// }