// Генерация случайного число в диапазоне от min до max включительно
export function randomInteger(min, max) {
    return Math.floor(min + Math.random() * (max + 1 - min));
}

export function map (n, start1, stop1, start2, stop2) {
    return (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
}

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

const polygons = new Map();
let  dinoCoords;
let svgCoords;

export function isIntersect(dino, svg, polygonName) {
    dinoCoords = dino.getBoundingClientRect();
    svgCoords = svg.getBoundingClientRect();
    if ((svgCoords.left+svgCoords.width < dinoCoords.left ||
        dinoCoords.left+dinoCoords.width < svgCoords.left ||
        dinoCoords.top + dinoCoords.height < svgCoords.top ||
        svgCoords.top + svgCoords.height < dinoCoords.top))
    {
        return false;
    }

    const svgPolygon = polygons.get(polygonName);
    return intersectPolygonPolygon(polygons.get('dino-body'), svgPolygon);
    // ||
    //     (getComputedStyle(dino.getElementById('first-leg')).visibility === 'visible' ?
    //         intersectPolygonPolygon(polygons.get('dino-first-leg'), svgPolygon) :
    //         intersectPolygonPolygon(polygons.get('dino-fourth-leg'), svgPolygon)) ||
    //     (getComputedStyle(dino.getElementById('second-leg')).visibility === 'visible' ?
    //         intersectPolygonPolygon(polygons.get('dino-second-leg'), svgPolygon) :
    //         intersectPolygonPolygon(polygons.get('dino-third-leg'), svgPolygon));
}


export function createPolygon(svg, name, id, kind) {
    if (id) {
        polygons.set(kind, pathToPolygon(svg.querySelector('#' + id)));
    }
    else {
        polygons.set(kind, pathToPolygon(svg.querySelector(name)));
    }
}


// Intersection of a Polygon and a Polygon

function intersectPolygonPolygon(polygon1, polygon2) {

    var length = polygon1.length;

    for ( let i = 0; i < length; i++ ) {
        const result = intersectionLinePolygon(polygon1[i], polygon1[(i+1) % length], polygon2);
        if (result)
            return true;
    }

    return false;

};

// Intersection of a Line and a Polygon

function intersectionLinePolygon(point1, point2, polygon) {
    const length = polygon.length;

    for ( let i = 0; i < length; i++ ) {
        if ( intersectionLineLine(point1.clone(), point2.clone(), polygon[i].clone(), polygon[(i+1) % length].clone()) )
            return true;
    }

    return false;
};

// Intersection of a Line and a Line

function intersectionLineLine(a1, b1, a2, b2) {

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
};

function pathToPolygon(path) {
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
};
