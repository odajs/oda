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

        <svg ~ref='mySVG' version="1.1" baseProfile="full" width="186" height="137" xmlns="http://www.w3.org/2000/svg" class="dinos">

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
        polygons: {},
    },
    jump() {
        this.classList.add("dino-jump");
        const svg = this.$core.root.querySelector("svg");
        svg.pauseAnimations();
        this.getAnimations().forEach((anim, i, arr) => {
            anim.onfinish = () => {
                this.classList.remove("dino-jump");
                this.offsetHeight; // reflow
                svg.unpauseAnimations();
            }
        });
    },
    isIntersection(cactus) {
        let dinoCoords = this.getBoundingClientRect();
        let cactusCoords = cactus.getBoundingClientRect();


        if ((cactusCoords.left+cactusCoords.width < dinoCoords.left ||
            dinoCoords.left+dinoCoords.width < cactusCoords.left ||
            dinoCoords.top + dinoCoords.height < cactusCoords.top ||
            cactusCoords.top + cactusCoords.height < dinoCoords.top))
        {
            return false;
        }

        return true;
        // const bow = dino.getElementById('body').classList.contains("hidden") ? "-bow" : "";

        const svgPolygon = this.polygons.get('cactus');

        // return intersectPolygonPolygon(polygons.get('dino-body' + bow), svgPolygon)
        // ||
        //     (getComputedStyle(dino.getElementById('first-leg' + bow)).visibility === 'visible' ?
        //         intersectPolygonPolygon(polygons.get('dino-first-leg' + bow), svgPolygon) :
        //         intersectPolygonPolygon(polygons.get('dino-fourth-leg'  + bow), svgPolygon)) ||
        //     (getComputedStyle(dino.getElementById('second-leg'  + bow)).visibility === 'visible' ?
        //         intersectPolygonPolygon(polygons.get('dino-second-leg' + bow), svgPolygon) :
        //         intersectPolygonPolygon(polygons.get('dino-third-leg'  + bow), svgPolygon));
    },

    createPolygon(svg, name, id, kind) {
        return id ? this.polygons.set(kind, pathToPolygon(svg.querySelector('#' + id))) :
            this.polygons.set(kind, pathToPolygon(svg.querySelector(name)));
    },

    // Intersection of a Polygon and a Polygon

    intersectPolygonPolygon(polygon1, polygon2) {

        var length = polygon1.length;

        for ( let i = 0; i < length; i++ ) {
            const result = intersectionLinePolygon(polygon1[i], polygon1[(i+1) % length], polygon2);
            if (result)
                return true;
        }

        return false;

    },

    // Intersection of a Line and a Polygon

    intersectionLinePolygon(point1, point2, polygon) {
        const length = polygon.length;

        for ( let i = 0; i < length; i++ ) {
            if ( intersectionLineLine(point1.clone(), point2.clone(), polygon[i].clone(), polygon[(i+1) % length].clone()) )
                return true;
        }

        return false;
    },

    // Intersection of a Line and a Line

    intersectionLineLine(a1, b1, a2, b2) {

        a1.moveTo(dinoCoords.x, dinoCoords.y);
        b1.moveTo(dinoCoords.x, dinoCoords.y);
        a2.moveTo(svgCoords.x, svgCoords.y);
        b2.moveTo(svgCoords.x, svgCoords.y);

        let maxA = {
            x: Math.max(a1.x, b1.x),
            y: Math.max(a1.y, b1.y),
        }

        let minA = {
            x: Math.min(a1.x, b1.x),
            y: Math.min(a1.y, b1.y),
        };

        let maxB = {
            x: Math.max(a2.x, b2.x),
            y: Math.max(a2.y, b2.y),
        }

        let minB = {
            x: Math.min(a2.x, b2.x),
            y: Math.min(a2.y, b2.y),
        };

        return minA.x <= minB.x && minB.x <= maxA.x && minA.y >= minB.y && minA.y <= maxB.y ||
            minA.x <= maxB.x && maxB.x <= maxA.x && maxA.y >= minB.y && maxA.y <= maxB.y ||
            minB.x <= minA.x && minA.x <= maxB.x && minB.y >= minA.y && minB.y <= maxA.y ||
            minB.x <= maxA.x && maxA.x <= maxB.x && maxB.y >= minA.y && maxB.y <= maxA.y;
    },

    pathToPolygon(path) {
        const points = path.getAttribute('d').split(',');
        let polygon = [];
        let lastPoint = new Point(0,0);
        points.forEach(point => {
            point = point.trim();
            switch (point[0]) {
                case 'M':
                    point = point.slice(1).split(' ');
                    lastPoint.x += +point[0];
                    lastPoint.y += +point[1];
                    polygon.push(lastPoint.clone());
                    break;
                case 'h':
                    lastPoint.x += +point.slice(1);
                    polygon.push(lastPoint.clone());
                    break;
                case 'v':
                    lastPoint.y += +point.slice(1);
                    polygon.push(lastPoint.clone());
                    break;
            }
        })
        return polygon;
    }
})
