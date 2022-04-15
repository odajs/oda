ODA({ is: 'oda-cactus',
    template: `
        <style>
            .hidden {
                display: none;
            }
            svg.cactuses path {
                fill: var(--cactus-color);
            }
        </style>

        <svg version="1.1" baseProfile="full" width="74" height="147" xmlns="http://www.w3.org/2000/svg" class="cactuses">
            <path d="M0 41, h3,v-3, h10, v3, h3, v42, h10, v-80, h3, v-3, h16, v3, h3, v80, h10, v-48, h3, v-3, h10, v3, h3, v48, h-3, v3, h-4, v3, h-3, v4, h-3, v3, h-13, v51, h-22, v-48, h-16, v-3, h-3, v-3, h-4, v-4, h-3, z"/>
        </svg>
    `,
    props: {
        name: "Привет кактус",
    },
    attached() {
        const path = this.$core.root.querySelector("path");
        this.polygons = new Map();
        this.polygons.set('cactus', this.pathToPolygon(path));
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

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    clone() {
        return new Point(this.x,this.y);
    }
    moveTo(dx, dy) {
        this.x += dx;
        this.y += dy;
    }
}