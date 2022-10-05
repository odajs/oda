import {settings} from './settings.js';
import {bestRaccoonBrain, changeBestRaccoonBrain} from './raccoon-brain.js';

ODA({ is: 'oda-raccoon',
    template: `
        <style>
            #snappy{
                background-color: deepskyblue;
                position: relative;
                display: block;
            }
        </style>
        <svg id='snappy' class='img-responsive' viewBox="0 0 1200 700"></svg>
    `,
    async attached() {
       const s = Snap(this.$('#snappy')),
            vbW = 1200,
            vbH = 700,
            sun = s.circle(60, 600, 300),
            road1 = s.rect(-4, 580, vbW + 10, 130),
            road2 = s.rect(-4, 580, vbW + 10, 10);

        road2.attr({ fill: "grey" });
        sun.attr({ fill: "khaki", stroke: "goldenrod", strokeWidth: 40 });
        const night = s.rect(-4, -600, vbW + 10, 600);
        const moon = s.circle(980, 800, 60);
        moon.attr({ fill: "white" });
        let truck, lights, cactus, mountains, mountainRange, clouds, raccoon, raccoonBox, fishBox, fish;
        let costText;
        let populationText;
        let bestCostText;
        let currentPopulation = 0;
        //populationText.attr({ fill: 'yellow', "font-size": "40px" });
        //costText.attr({ fill: 'yellow', "font-size": "40px" });
        let value = 0;
        const raccoons = Array(settings.populationCount);
        Snap.load("images/neuro-raccoon.svg", onSVGLoaded);

        function onSVGLoaded(data) {
            truck = data.select("#tGroup");
            lights = data.select("#lights");
            cactus = data.select("#cGroup");
            mountains = data.select("#mGroup");
            mountainRange = data.select("#mrGroup");
            clouds = data.select("#clGroup");
            raccoon = data.select("#rGroup");
            fish = data.select("#fGroup");
            s.append(clouds);

            costText = s.text(50, 80, '0');
            populationText = s.text(550, 80, `0:${settings.populationCount}`);
            bestCostText = s.text(1060, 80, '0');
            populationText.attr({ fill: 'yellow', "font-size": "40px" });
            costText.attr({ fill: 'yellow', "font-size": "40px" });
            bestCostText.attr({ fill: 'yellow', "font-size": "40px" });
            s.append(mountains);
            s.append(mountainRange);
            s.append(cactus);
            s.append(fish);
            for (let index = 0; index < raccoons.length; index++) {
                raccoons[index] = raccoon.clone();
                raccoons[index].brain = bestRaccoonBrain.clone();
                raccoons[index].brain.cost = 0;
                raccoons[index].energy = 100;
                s.append( raccoons[index] );
                raccoons[index].transform('t100,136');
            }
            s.append(truck);
            lights.attr({ visibility: "hidden" });
            truck.transform('t60');
            cactus.transform('t-1200');
			fish.transform('t-600 s0.3');
            truck.hover(hoverOverTruck, hoverOutTruck);
            truck.mousedown(mouseDownTruck);
            sun.hover(hoverOverSun, hoverOutSun);
            sun.mousedown(mouseDownSun);
            moon.hover(hoverOverMoon, hoverOutMoon);
            moon.mousedown(mouseDownMoon);
            animateAll();
            let _int = setInterval(() => {
                value += 1;
                costText.attr({ text: Math.round(value), fill: 'yellow', "font-size": "40px" });
                fishBox = fish.getBBox();
                if (clouds.attr("fill") === "red") {
                    clouds.attr({ fill: "white" });
                };
                raccoons.forEach( raccoon => {
                    if (raccoon.inAnim().length === 0 && raccoon.energy <= 0 || raccoon.hasFish) {
                        return;
                    }
                    raccoonBox = raccoon.getBBox();
                    if (raccoon.inAnim().length !== 0) {
                        let intersect = Snap.path.isBBoxIntersect(raccoonBox, fishBox);
                        if ( intersect ){
                            raccoon.energy += 50;
                            raccoon.hasFish = true;
                            if ( clouds.attr("fill") !== "red" ){
                                clouds.attr({ fill: "red" });
                            }
                        }

                    } else {
                        const distance = raccoonBox.x - fishBox.x2;
                        if ( distance >= 0  && raccoon.inAnim().length == 0 ){
                            const inputs = [[ map( distance, 0, 1200, 0, 1) ]];
                            const result =  raccoon.brain.feedForward(inputs[0]);
                            if ( result[1] > result[0] ){
                                raccoonJump(raccoon);
                                raccoon.energy -= 10;
                            }
                        }
                    }
                });

            }, 100)
            document.addEventListener('keyup', mouseDownTruck);
        }
        function animateAll() {
            animatetTruck1();
            animateCactus();
            animateFish();
            animateMountains();
            animateMountainRange();
            animateClouds();
        }
        // Генерация случайного число в диапазоне от min до max включительно
        function randomInteger( min, max ) {
            return Math.floor( min + Math.random() * (max + 1 - min) );
        }

        function map (n, start1, stop1, start2, stop2 ){
            return (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
        }

        async function newPopulation() {
            let count = 0;
            let bestBrain = null;
            if ( clouds.attr("fill") !== "white" ){
                clouds.attr({ fill: "white" });
            }
            raccoons.forEach( raccoon => {
                raccoon.hasFish = false;
                if ( raccoon.energy > 0 ){
                    raccoon.energy -= 40;
                    raccoon.brain.cost = costText.attr( "text" );
                }
                if ( raccoon.energy <= 0 ){
                    raccoon.attr({ visibility: "hidden" });
                    count++;
                    populationText.attr( { text: `${currentPopulation}:${settings.populationCount - count}` });
                }
                if ( bestBrain == null || raccoon.brain.cost > bestBrain.cost ){
                    bestBrain = raccoon.brain
                }
                console.log( raccoon.energy );
            });

            if ( count === settings.populationCount ){
                currentPopulation++;
                value = 0;
                costText.attr( {text: '0'} );
                if ( bestBrain?.cost > bestRaccoonBrain.cost ){
                    bestCostText.attr( {text: bestBrain?.cost} );
                }
                populationText.attr( { text: `${currentPopulation}:${settings.populationCount}`});
                await changeBestRaccoonBrain( bestBrain );
                raccoons.forEach( raccoon => {
                    raccoon.brain = bestRaccoonBrain.clone();
                    raccoon.brain.cost = 0;
                    raccoon.energy = 100;

                    if ( Math.random() < 0.75 ){
                        raccoon.brain.mutate();
                    }
                    raccoon.attr( { visibility: "visible" } );
                });
            }
        }
        function animatetTruck1() { truck.animate({ transform: 't120,10' }, 6000, mina.easeinout, animatetTruck2) }
        function animatetTruck2() { truck.animate({ transform: 't-10,0' }, 6000, mina.easeinout, animatetTruck1) }
        function animateCactus() { cactus.animate({ transform: 't1300' }, 4000, mina.linear, animateCactus2) }
        function animateCactus2() { cactus.transform('t-1200'); cactus.animate({ transform: 't1300' }, 4000, mina.linear, animateCactus) }
        function animateFish() { fish.animate({ transform: 't1400 s0.3' }, 5000, mina.linear, animateFish2) }
        // function animateFish2() { fish.transform('t-500 s0.3'); fish.animate({ transform: 't500'}, 3000, mina.linear, animateFish) }
        async function animateFish2() {
            fish.transform('t-600 s0.3');
            fish.animate({ transform: 't1400 s0.3'}, 5000, mina.linear, animateFish2);
            await newPopulation();
        }
        function animateMountains() { mountains.animate({ transform: 't1200' }, 8000, '', animateMountains2) }
        function animateMountains2() { mountains.transform('t0'); animateMountains() }
        function animateMountainRange() { mountainRange.animate({ transform: 't1200' }, 4000, '', animateMountainRange2) }
        function animateMountainRange2() { mountainRange.transform('t0'); animateMountainRange() }
        function animateClouds() { clouds.animate({ transform: 't1200' }, 30000, '', animateClouds2) }
        function animateClouds2() { clouds.transform('t0'); animateClouds() }
        function animateCoon() { raccoon.animate({ transform: 't100,-270' }, 800, mina.backout, animateCoon2) }
        function animateCoon2() { raccoon.animate({ transform: 't100,140' }, 400, mina.bounce) }
        function hoverOverTruck() { document.body.style.cursor = "pointer" }
        function hoverOutTruck() { document.body.style.cursor = "default" }
        function mouseDownTruck() { animateCoon() }
        function hoverOverSun() { document.body.style.cursor = "pointer" }
        function hoverOutSun() { document.body.style.cursor = "default" }
        function lightsOn() { lights.attr({ visibility: "visible" }) }
        function hoverOverMoon() { document.body.style.cursor = "pointer" }
        function hoverOutMoon() { document.body.style.cursor = "default" }
        function mouseDownSun() {
            sun.animate({ transform: 't0,300' }, 1000, mina.bounce);
            night.animate({ transform: 't0,560' }, 1000, mina.bounce);
            moon.animate({ transform: 't0,-730' }, 1000, mina.bounce, lightsOn);
            clouds.attr({ "fill-opacity": 0.3 });
        }
        function mouseDownMoon() {
            sun.animate({ transform: 't60' }, 3000, mina.linear);
            night.animate({ transform: 't0,-560' }, 1000, mina.bounce);
            moon.animate({ transform: 't0,730' }, 1000, mina.bounce);
            clouds.attr({ "fill-opacity": 1 });
            lights.attr({ visibility: "hidden" });
        }
        function raccoonJump( raccoon ){
            raccoon.animate( { transform: 't100,-270' }, 800, mina.backout, () => {
                raccoon.animate( { transform: 't100,140' }, 400, mina.bounce, () => {
                    // if ( raccoon.energy <= 0 ){
                    //     raccoon.attr( { visibility: "hidden" } );
                    // }
                })
            })
        }

    },
	createPopulation(raccoons) {
        for (let index = 0; index < raccoons.length; index++) {
            raccoons[index] = bestRaccoonBrain.clone();
            raccoons[index].cost = 0;
        }
    }
})