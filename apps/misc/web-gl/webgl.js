ODA({ is: 'oda-webgl',
    template: `
        <style>
            :host{
                @apply --hotizontal;
                @apply --flex;
            }
        </style>
        <canvas id='canvas' style='flex: 1; width: 100%; height: 100%; touch-action: none;'
            @pointerdown="mouseDown"
            @pointerup="mouseUp"
            @pointerout="mouseUp"
            @pointermove="mouseMove"
            @mousewheel="mouseWheel"
        ></canvas>
    `,
    $public: {
        showGrid: true,
        gridSize: 5,
        gridPointSize: 2,
        gridColor: '1, 1, 1, 1',
        showBorder: true,
        borderColor: '0.1, 0.1, 0.1, 0.9',
        showLink: true,
        linkColor: '0.5, 0.5, 0.5, 0.9',
        amortization: 0.95,
        enableDraw: true,
        animate: true,
        THETA: 0,
        PHI: 0,
        _moveX: 0,
        _moveY: 0,
        _moveZ: -3,
        showLabel: true,
    },
    attached() {
        this.async(() => {
            this.drag = false;
            this.dX = this.dY = 0;
            this.canvas = this.$('canvas');
            this.gl = this.canvas.getContext("webgl2");
            this.gl.viewportWidth = this.canvas.width = window.innerWidth;
            this.gl.viewportHeight = this.canvas.height = window.innerHeight;
            this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

            this.shapes = [];

            setTimeout(() => {
                this.clearGL(this.gl);

                this.initGrid(this);
                if (this.showBorder) this.initBorder(this);
                this.initData(this);

                if(this.showLabel)
                    this.initText();

                this.draw();
            }, 300);

            window.addEventListener('keydown', e => {
                if (this.brain) {
                    const neurons = this.brain.inputs.filter(n => {
                        return n.x === 0 && n.y === +e.key;
                    })
                    neurons?.forEach(neuron => {
                        neuron.signal(neuron?.threshold * 2)
                    })
                }
                const shift = e.ctrlKey ? 0.01 : 0.1;
                switch (e.keyCode) {
                    case 39:
                        if (e.altKey) this.THETA = (this.THETA || 0) + shift;
                        else this._moveX = (this._moveX || 0) + shift;
                        break;
                    case 37:
                        if (e.altKey) this.THETA = (this.THETA || 0) - shift;
                        else this._moveX = (this._moveX || 0) - shift;
                        break;
                    case 40:
                        if (e.altKey) this.PHI = (this.PHI || 0) + shift;
                        else this._moveY = (this._moveY || 0) - shift;
                        break;
                    case 38:
                        if (e.altKey) this.PHI = (this.PHI || 0) - shift;
                        else this._moveY = (this._moveY || 0) + shift;
                        break;
                }
            })
        }, 100)
    },
    clearGL(gl) {
        gl.viewportWidth = gl.canvas.width = window.innerWidth;
        gl.viewportHeight = gl.canvas.height = window.innerHeight;
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.POLYGON_OFFSET_FILL);
        gl.polygonOffset(1.0, 1.0);
    },
    draw() {
        if (!this.drag) {
            this.dX *= this.animate ? 1 : this.amortization;
            this.dY *= this.animate ? 1 : this.amortization;
            this.THETA = (this.THETA || 0) + this.dX;
            this.PHI = (this.PHI || 0) + this.dY;
        }

        const gl = this.gl;
        this.clearGL(gl);

        const uModelViewMatrix = modelViewMatrix();
        const uProjectionMatrix = perspectiveMatrix(1, gl.viewportWidth / gl.viewportHeight, 1, 2000.0);
        translate(uModelViewMatrix, uModelViewMatrix, [this._moveX || 0, this._moveY || 0, this._moveZ || 0]);
        rotate(uModelViewMatrix, uModelViewMatrix, this.THETA || 0, [0, 1, 0]);
        rotate(uModelViewMatrix, uModelViewMatrix, this.PHI || 0, [1, 0, 0]);

        this.shapes.forEach(inf => {
            gl.useProgram(inf.program);
            gl.bindVertexArray(inf.vao);

            gl.uniformMatrix4fv(gl.getUniformLocation(inf.program, "uModelViewMatrix"), false, uModelViewMatrix);
            gl.uniformMatrix4fv(gl.getUniformLocation(inf.program, "uProjectionMatrix"), false, uProjectionMatrix);

            inf.draw();

            gl.bindVertexArray(null);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        })
        if (this.enableDraw || this.drag)
            this._draw = requestAnimationFrame(() => this.draw());
    },
    mouseDown(e) {
        this.drag = true;
        this.oldX = e.pageX;
        this.oldY = e.pageY;
        e.preventDefault();
    },
    mouseUp(e) {
        this.drag = false;
    },
    mouseWheel(e) {
        this._moveZ = (this._moveZ || 0) + e.deltaY / (this.offsetHeight * 50);
    },
    mouseMove(e) {
        if (this.drag) {
            this.dX = (e.pageX - this.oldX) * 2 * Math.PI / this.canvas.width;
            this.dY = (e.pageY - this.oldY) * 2 * Math.PI / this.canvas.height;
            this.THETA = (this.THETA || 0) + this.dX;
            this.PHI = (this.PHI || 0) + this.dY;
            this.oldX = e.pageX;
            this.oldY = e.pageY;
            e.preventDefault();
        }
    },
    initGrid(s = this) {
        const gl = s.gl, shapes = s.shapes, _size = s.data?._size || s.data?.size || s.gridSize,
            pointSize = s.gridPointSize, gridColor = s.gridColor, showGrid = s.showGrid;
        const info = { name: 'grid', size: 3, vertexShader: 'vs_PointGrid', fragmentShader: 'fs_Point', pointSize, gridColor };
        let size, _z, _x, _y, endPoint;
        if (typeof _size === 'number') {
            size = _size - 1;
            size <= 1 ? 2 : size;
            _x = _z = _y = size;
            endPoint = _size * _size * _size - 1;
        } else {
            _x = _size.x - 1;
            _y = _size.y - 1;
            _z = _size.z - 1;
            endPoint = _size.x * _size.y * _size.z - 1;
        }
        s._size = { x: _x, y: _y, z: _z, endPoint };
        s._map = new Map();
        let i = 0;
        info._vertices = [];
        for (let z = _z; z >= -_z; z -= 2)
            for (let y = _y; y >= -_y; y -= 2)
                for (let x = -_x; x <= _x; x += 2) {
                    s._map.set(i, { x: x / _x, y: y / _y, z: z / _z });
                    if (showGrid)
                        info._vertices.push(x / _x, y / _y, z / _z); // stride = 3
                    i++;
                }
        if (!showGrid) return;
        let stride = 3;
        info._attributes = [{ name: 'aVertexPosition', size: 3, stride, offset: 0 }];
        info.draw = () => {
            gl.uniform1f(gl.getUniformLocation(info.program, "uPointSize"), pointSize);
            gl.uniform4fv(gl.getUniformLocation(info.program, "uPointColor"), info.gridColor.split(','));
            gl.drawArrays(gl.POINTS, 0, info._vertices.length / stride);
        }
        initInfo(gl, shapes, info);
    },
    initBorder(s = this, sz = 1.0) {
        const gl = s.gl, shapes = this.shapes, borderColor = s.borderColor;
        const info = { name: 'border', size: 3, vertexShader: 'vs_Line', fragmentShader: 'fs_Line', borderColor };
        info._vertices = [-sz, -sz, sz, -sz, sz, sz, sz, sz, sz, sz, -sz, sz, -sz, -sz, -sz, -sz, sz, -sz, sz, sz, -sz, sz, -sz, -sz];
        info._indices = [0, 1, 1, 2, 2, 3, 3, 0, 0, 4, 4, 5, 5, 6, 6, 7, 7, 4, 1, 5, 2, 6, 3, 7];
        info._attributes = [{ name: 'aVertexPosition', size: 3, stride: 0, offset: 0 },];
        info.draw = () => {
            gl.uniform4fv(gl.getUniformLocation(info.program, "uPointColor"), info.borderColor.split(','));
            gl.drawElements(gl.LINES, info.indices.length, gl.UNSIGNED_SHORT, 0);
        }
        initInfo(gl, shapes, info);
    },
    initData(s = this) {
        const gl = s.gl, shapes = s.shapes, pointSize = s.gridPointSize, gridColor = s.gridColor, showGrid = s.showGrid,
            brain = s.brain, data = s.data || {}, showLink = s.showLink, linkColor = s.linkColor, _map = s._map;
        const info = { name: 'points', size: 3, vertexShader: 'vs_Point', fragmentShader: 'fs_Point', pointSize, gridColor };
        let _links, _fatLines;
        const coords = (x, y, z) => [-z + 1, 1 - y, -x + 1];
        const calc = () => {
            const _usedPoints = new Set();
            const _usedLines = new Set();
            info._vertices = [];
            _links = [];
            _fatLines = [];
            let _pointSize = pointSize;
            let _pointColor = [];

            if (showGrid) {
                info._vertices.push(-1, 1, 1, ...[0, 1, 0, 1], 8); // startPoint
                info._vertices.push(1, -1, -1, ...[1, 0, 0, 1], 8); // endPoint
            }
            Object.keys(data || {}).forEach(k => {
                const p = _map.get(+k);
                if (!p) return;
                if (typeof +k === 'number') {
                    let _pointSize, _pointColor;
                    if (!_usedPoints.has(+k)) {
                        _usedPoints.add(k);
                        _pointSize = data[k].size || data.pointSize || pointSize;
                        _pointColor = data[k].color || data.pointColor || gridColor.split(',');
                        info._vertices.push(p.x, p.y, p.z, ..._pointColor, _pointSize); // stride = 3 + 4 + 1 = (xyz) + (rgba) + size = 8
                    }
                    (data[k].links || []).forEach(_i => {
                        let c, w, i;
                        if (typeof _i === 'object') {
                            i = _i.p;
                            c = _i.c ? [..._i.c] : null;
                            w = _i.w;
                        } else {
                            i = _i;
                        }
                        const p2 = _map.get(+i);
                        if (p2) {
                            _pointSize = data[i]?.size || _pointSize || data.pointSize;
                            _pointColor = data[i]?.color || _pointColor || data.color;
                            if (!_usedPoints.has(+i)) {
                                _usedPoints.add(i);
                                info._vertices.push(p2.x, p2.y, p2.z, ..._pointColor, _pointSize);
                            }
                            if (!_usedLines.has(k + '-' + i)) {
                                _usedLines.add(k + '-' + i);
                                const width = w || data[k].width || (data[k].linkColor ? 0.001 : 0);
                                const color = c || data[k].linkColor || _pointColor;
                                if (width > 0)
                                    _fatLines.push({ x: p.x, y: p.y, z: p.z, x1: p2.x, y1: p2.y, z1: p2.z, color, width });
                                else
                                    _links.push(p.x, p.y, p.z, p2.x, p2.y, p2.z);
                            }
                        }
                    })
                }
            })
        }
        calc();

        let stride = 8;
        info._attributes = [
            { name: 'aVertexPosition', size: 3, stride, offset: 0 },
            { name: 'aPointColor', size: 4, stride, offset: 3 },
            { name: 'aPointSize', size: 1, stride, offset: 7 }
        ];
        info.draw = () => {
            calc();

            gl.bindBuffer(gl.ARRAY_BUFFER, info.vbo);
            info.vertices = new Float32Array(info._vertices);
            gl.bufferData(gl.ARRAY_BUFFER, info.vertices, gl['DYNAMIC_DRAW']);

            gl.drawArrays(gl.POINTS, 0, info._vertices.length / stride);
        }
        initInfo(gl, shapes, info, 'DYNAMIC_DRAW');

        if (showLink && _links?.length) {
            const _linkInfo = { ...{}, ...info };
            _linkInfo._vertices = _links
            _linkInfo.name = 'links';
            _linkInfo.size = 3;
            _linkInfo.vertexShader = 'vs_Line';
            _linkInfo.fragmentShader = 'fs_Line';
            _linkInfo._attributes = [{ name: 'aVertexPosition', size: 3, stride: 0, offset: 0 }];
            _linkInfo.draw = () => {
                gl.uniform4fv(gl.getUniformLocation(_linkInfo.program, "uPointColor"), linkColor.split(','));
                gl.drawArrays(gl.LINES, 0, _linkInfo._vertices.length / 3);
            }
            initInfo(gl, shapes, _linkInfo);
        }
        if (_fatLines?.length) {
            this.initFatLines(gl, shapes, _fatLines);
        }
    },
    initFatLines(gl, shapes, _fatLines, NumSides = 4) {
        const info = { name: 'lines', size: 3, vertexShader: 'vs_LineFat', fragmentShader: 'fs_Line', NumSides };
        info._vertices = [];
        let cyl_vertices;
        const buildVertices = (i) => {
            let x, y, angle = 0;
            const inc = Math.PI * 2.0 / NumSides;
            cyl_vertices = new Array(NumSides * 2);
            for (let i_side = 0; i_side < NumSides; i_side++) {
                x = i.width * Math.cos(angle);
                y = i.width * Math.sin(angle);
                cyl_vertices[i_side] = [i.x + x, i.y + y, i.z];
                cyl_vertices[i_side + NumSides] = [i.x1 + x, i.y1 + y, i.z1];
                angle += inc;
            }
        }
        const quad = (a, b, c, d, color) => {
            let indices = [a, b, c, a, c, d];
            for (let i = 0; i < indices.length; ++i)
                info._vertices.push(...cyl_vertices[indices[i]], ...color);
        }
        (_fatLines || []).forEach(i => {
            buildVertices(i);
            for (let i_side = 0; i_side < NumSides - 1; i_side++)
                quad(i_side + 1, i_side, NumSides + i_side, NumSides + i_side + 1, i.color);
            quad(0, NumSides - 1, 2 * NumSides - 1, NumSides, i.color);
        })
        info._attributes = [
            { name: 'aVertexPosition', size: 3, stride: 7, offset: 0 },
            { name: 'aPointColor', size: 4, stride: 7, offset: 3 }
        ];
        info.draw = () => {
            gl.bindBuffer(gl.ARRAY_BUFFER, info.vbo);
            info.vertices = new Float32Array(info._vertices);
            gl.bufferData(gl.ARRAY_BUFFER, info.vertices, gl['DYNAMIC_DRAW']);

            gl.drawArrays(gl.TRIANGLES, 0, info._vertices.length / 7);
        }
        initInfo(gl, shapes, info, 'DYNAMIC_DRAW');
    },
    initText(s = this, text = ['text']) {
        const gl = s.gl, shapes = s.shapes;
        const info = { name: 'text', size: 3, vertexShader: 'vs_Text', fragmentShader: 'fs_Text' };
        const textCtx = document.createElement("canvas").getContext("2d");
        const textCanvas = makeTextCanvas(textCtx, "TEXT", 60, 30);
        const textWidth = textCanvas.width;
        const textHeight = textCanvas.height;
        const textTex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, textTex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCanvas);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        info._vertices = [
            -1, .8, 1, 1, 0, 0,
            -.6, .8, 1, 1, 1, 0,
            -1, 1, 1, 1, 0, 1,
            -.6, 1, 1, 1, 1, 1,
        ];
        info._indices = [0, 1, 2, 2, 1, 3]
        info._attributes = [
            { name: 'aTxtPosition', size: 4, stride: 6, offset: 0 },
            { name: 'aTxtCoord', size: 2, stride: 6, offset: 4 },
        ];
        info.draw = () => {
            gl.drawElements(gl.TRIANGLES, info.indices.length, gl.UNSIGNED_SHORT, 0);
        }
        initInfo(gl, shapes, info);
    }
})

const initInfo = (gl, shapes, info, draw = 'STATIC_DRAW') => {
    info.program = createProgram(gl, info.vertexShader, info.fragmentShader);
    if (!info.program) return null;
    shapes.push(info);

    info.vao = gl.createVertexArray();
    gl.bindVertexArray(info.vao);

    info.vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, info.vbo);
    info.vertices = new Float32Array(info._vertices);
    gl.bufferData(gl.ARRAY_BUFFER, info.vertices, gl[draw]);
    info.FSIZE = info.vertices?.BYTES_PER_ELEMENT;
    (info._attributes || []).forEach(i => {
        info[i.name] = gl.getAttribLocation(info.program, i.name);
        gl.vertexAttribPointer(info[i.name], i.size || 3, gl.FLOAT, false, info.FSIZE * (i.stride || 0), info.FSIZE * (i.offset || 0));
        gl.enableVertexAttribArray(info[i.name]);
    })

    if (info._indices) {
        info.ibo = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, info.ibo);
        info.indices = new Uint16Array(info._indices);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, info.indices, gl[draw]);
    }

    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
}
const createProgram = (gl, vertexShader = 'v_shader', fragmentShader = 'f_shader') => {
    const program = gl.createProgram();
    gl.attachShader(program, initShader(gl, vertexShader));
    gl.attachShader(program, initShader(gl, fragmentShader));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Could not create program');
        return null;
    }
    gl.useProgram(program);
    return program;
}
const initShader = (gl, name) => {
    const type = name.startsWith('vs_') ? 'VERTEX_SHADER' : 'FRAGMENT_SHADER';
    const shader = gl.createShader(gl[type]);
    gl.shaderSource(shader, shaders[name].trim());
    gl.compileShader(shader);
    return shader;
}
const shaders = {
    vs_Point: `#version 300 es
        precision mediump float;
        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;
        in vec3 aVertexPosition;
        in float aPointSize;
        in vec4 aPointColor;
        out vec4 fColor;
        void main(void) {
            gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
            gl_PointSize = aPointSize;
            fColor = aPointColor;
        }
    `,
    vs_PointGrid: `#version 300 es
        precision mediump float;
        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;
        uniform float uPointSize;
        uniform vec4 uPointColor;
        in vec3 aVertexPosition;
        out vec4 fColor;
        void main(void) {
            gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
            gl_PointSize = uPointSize;
            fColor = uPointColor;
        }
    `,
    fs_Point: `#version 300 es
        precision mediump float;
        in vec4 fColor;
        out vec4 fragColor;
        void main(void) {
            if (length(gl_PointCoord - vec2(0.5)) > 0.5)
                discard;
            fragColor = fColor;
        }
    `,
    vs_Line: `#version 300 es
        precision mediump float;
        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;
        uniform vec4 uPointColor;
        in vec3 aVertexPosition;
        out vec4 fColor;
        void main(void) {
            gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
            fColor = uPointColor;
        }
    `,
    vs_LineFat: `#version 300 es
        precision mediump float;
        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;
        in vec3 aVertexPosition;
        in vec4 aPointColor;
        out vec4 fColor;
        void main() {
            gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
            fColor = aPointColor;
        }
    `,
    fs_Line: `#version 300 es
        precision mediump float;
        in vec4 fColor;
        out vec4 fragColor;
        void main(void) {
            fragColor = fColor;
        }
    `,
    vs_Text: `#version 300 es
        in vec4 aTxtPosition;
        in vec2 aTxtCoord;
        // uniform mat4 uTxtMatrix;
        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;
        out vec2 vTxtCoord;
        void main() {
            // gl_Position = uTxtMatrix * aTxtPosition
            gl_Position = uProjectionMatrix * uModelViewMatrix * aTxtPosition;
            vTxtCoord = aTxtCoord;
        }
    `,
    fs_Text: `#version 300 es
        precision highp float;
        in vec2 vTxtCoord;
        uniform sampler2D uTxtTexture;
        out vec4 fragColor;
        void main() {
            fragColor = texture(uTxtTexture, vTxtCoord);
        }
    `
}

function makeTextCanvas(textCtx, text, width, height) {
    textCtx.canvas.width = width;
    textCtx.canvas.height = height;
    textCtx.font = "20px monospace";
    textCtx.textAlign = "center";
    textCtx.textBaseline = "middle";
    textCtx.fillStyle = "black";
    textCtx.clearRect(0, 0, textCtx.canvas.width, textCtx.canvas.height);
    textCtx.fillText(text, width / 2, height / 2);
    return textCtx.canvas;
}

function perspectiveMatrix(fieldOfViewInRadians, aspectRatio, near, far) {
    const f = 1.0 / Math.tan(fieldOfViewInRadians / 2);
    const rangeInv = 1 / (near - far);
    return [
        f / aspectRatio, 0, 0, 0,
        0, f, 0, 0,
        0, 0, (near + far) * rangeInv, -1,
        0, 0, near * far * rangeInv * 2, 0
    ];
}
function modelViewMatrix() {
    const out = new Float32Array(16);
    out[0] = 1; out[5] = 1; out[10] = 1; out[15] = 1;
    return out;
}
function translate(out, a, v) {
    const x = v[0], y = v[1], z = v[2];
    let a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23;
    if (a === out) {
        out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
        out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
        out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
        out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
    } else {
        a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
        a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
        a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];
        out[0] = a00; out[1] = a01; out[2] = a02; out[3] = a03;
        out[4] = a10; out[5] = a11; out[6] = a12; out[7] = a13;
        out[8] = a20; out[9] = a21; out[10] = a22; out[11] = a23;
        out[12] = a00 * x + a10 * y + a20 * z + a[12];
        out[13] = a01 * x + a11 * y + a21 * z + a[13];
        out[14] = a02 * x + a12 * y + a22 * z + a[14];
        out[15] = a03 * x + a13 * y + a23 * z + a[15];
    }
    return out;
}
function rotate(out, a, rad, axis) {
    const EPSILON = 0.000001;
    let x = axis[0], y = axis[1], z = axis[2],
        len = Math.hypot(x, y, z), s, c, t,
        a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23,
        b00, b01, b02,
        b10, b11, b12,
        b20, b21, b22;
    if (len < EPSILON) return null;
    len = 1 / len;
    x *= len; y *= len; z *= len;
    s = Math.sin(rad); c = Math.cos(rad); t = 1 - c;
    a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
    a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
    a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];
    b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s;
    b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s;
    b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c;
    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
    out[11] = a03 * b20 + a13 * b21 + a23 * b22;
    if (a !== out) out[12] = a[12]; out[13] = a[13]; out[14] = a[14]; out[15] = a[15];
    return out;
}
