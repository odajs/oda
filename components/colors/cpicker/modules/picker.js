let Picker = function (options) {
    this.settings = {
        parent: undefined,
        orientation: 'right',
        x: 'auto',
        y: 'auto'
    };
    if (options instanceof HTMLElement) {
        this.settings.parent = options;
    } else {
        for (let name in options) {
            this.settings[name] = options[name];
        }
    }
    this.sliders = {
        'picker_selector': {
            down: false
        },
        'picker_hue': {
            down: false,
            vertical: true
        },
        'picker_opacity': {
            down: false,
            vertical: true
        },
    };
    this.colour = this.color = {
        hue: 0,
        saturation: 1,
        value: 1,
        alpha: 1,
        hsl: function () {
            let h = this.hue;
            let l = (2 - this.saturation) * this.value;
            let s = this.saturation * this.value;
            s /= l <= 1 ? l : 2 - l;
            l /= 2;
            s *= 100;
            l *= 100;
            return {
                h: Math.round(h || 0),
                s: Math.round(s || 0),
                l: Math.round(l),
                toString: function () {
                    return 'hsl(' + this.h + ', ' + this.s + '%, ' + this.l + '%)';
                }
            };
        },
        hsla: function () {
            let hsl = this.hsl();
            hsl.a = this.alpha.toFixed(2);
            hsl.toString = function () {
                return 'hsla(' + this.h + ', ' + this.s + '%, ' + this.l + '%, ' + this.a + ')';
            };
            return hsl;
        },
        rgb: function () {
            let r, g, b;
            let h = this.hue;
            let s = this.saturation;
            let v = this.value;
            h /= 60;
            let i = Math.floor(h);
            let f = h - i;
            let p = v * (1 - s);
            let q = v * (1 - s * f);
            let t = v * (1 - s * (1 - f));
            r = [v, q, p, p, t, v][i];
            g = [t, v, v, q, p, p][i];
            b = [p, p, t, v, v, q][i];
            return {
                r: Math.floor(r * 255),
                g: Math.floor(g * 255),
                b: Math.floor(b * 255),
                toString: function () {
                    return 'rgb(' + this.r + ', ' + this.g + ', ' + this.b + ')';
                }
            };
        },
        rgba: function () {
            let rgb = this.rgb()
            rgb.a = this.alpha;

            rgb.toString = function () {
                return 'rgba(' + this.r + ', ' + this.g + ', ' + this.b + ', ' + this.a + ')';
            };
            return rgb;
        },
        hex: function () {
            let rgb = this.rgb();
            function to_hex(c) {
                let hex = c.toString(16);
                return hex.length == 1 ? '0' + hex : hex;
            }
            return {
                r: to_hex(rgb.r),
                g: to_hex(rgb.g),
                b: to_hex(rgb.b),
                toString: function () {
                    return '#' + this.r + this.g + this.b;
                }
            }
        }
    };
    this.on_done = null;
    this.on_change = null;
};
Picker.prototype.css = {
    wrapper: {
        selector: '#picker_wrapper',
        background: '#f2f2f2',
        position: 'absolute',
        whiteSpace: 'nowrap',
        padding: '10px',
        cursor: 'default',
        fontFamily: 'sans-serif',
        fontWeight: '100',
        display: 'inline-block',
        boxShadow: '0 0 10px 1px rgba(0,0,0,0.4)',
        overflow: 'visible',
        textAlign: 'left',
        fontSize: '16px'
    },
    colour_picker: {
        selector: '#picker_selector',
        width: '180px',
        height: '150px',
        position: 'relative',
        background: 'hsl(0, 100%, 50%)',
        display: 'inline-block',
        border: '1px solid #ccc'
    },
    saturation_overlay: {
        selector: '#picker_saturation',
        width: '180px',
        height: '150px',
        position: 'absolute',
        background: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAACWCAYAAAB3qaIPAAADB0lEQVR4Ae3SQQrCMABE0cb7n9nYIgUXIW7ExecJUkmlOjNvzDmfx3HM831fPz/fZ/d1dW91tvv+7t4vn/Wv3/Gf335WPazOdrvs7n191hhjPk7IXhrINAB0ZkpBrgaA5iDVANCpOYUBmoFUA0Cn5hQGaAZSDQCdmlMYoBlINQB0ak5hgGYg1QDQqTmFAZqBVANAp+YUBmgGUg0AnZpTGKAZSDUAdGpOYYBmINUA0Kk5hQGagVQDQKfmFAZoBlINAJ2aUxigGUg1AHRqTmGAZiDVANCpOYUBmoFUA0Cn5hQGaAZSDQCdmlMYoBlINQB0ak5hgGYg1QDQqTmFAZqBVANAp+YUBmgGUg0AnZpTGKAZSDUAdGpOYYBmINUA0Kk5hQGagVQDQKfmFAZoBlINAJ2aUxigGUg1AHRqTmGAZiDVANCpOYUBmoFUA0Cn5hQGaAZSDQCdmlMYoBlINQB0ak5hgGYg1QDQqTmFAZqBVANAp+YUBmgGUg0AnZpTGKAZSDUAdGpOYYBmINUA0Kk5hQGagVQDQKfmFAZoBlINAJ2aUxigGUg1AHRqTmGAZiDVANCpOYUBmoFUA0Cn5hQGaAZSDQCdmlMYoBlINQB0ak5hgGYg1QDQqTmFAZqBVANAp+YUBmgGUg0AnZpTGKAZSDUAdGpOYYBmINUA0Kk5hQGagVQDQKfmFAZoBlINAJ2aUxigGUg1AHRqTmGAZiDVANCpOYUBmoFUA0Cn5hQGaAZSDQCdmlMYoBlINQB0ak5hgGYg1QDQqTmFAZqBVANAp+YUBmgGUg0AnZpTGKAZSDUAdGpOYYBmINUA0Kk5hQGagVQDQKfmFAZoBlINAJ2aUxigGUg1AHRqTmGAZiDVANCpOYUBmoFUA0Cn5hQGaAZSDQCdmlMYoBlINQB0ak5hgGYg1QDQqTmFAZqBVANAp+YUBmgGUg0AnZpTGKAZSDUAdGpOYYBmINUA0Kk5hQGagVQDQKfmFAZoBlINAJ2aUxigGUg1AHRqTmGAZiDVANCpOYUBmoFUAy+AUbcs6wwU4wAAAABJRU5ErkJggg==)'
    },
    value_overlay: {
        selector: '#picker_value',
        width: '180px',
        height: '150px',
        position: 'absolute',
        background: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAACWCAYAAAB3qaIPAAADFUlEQVR4Ae3WgQ3AMAzDsHbY/ycPa95QmQ9kC0bWchIIJbAPyxPigXJ5Au/hH6mdBBIJjNAWOlEliEmA0DxIJeDlSNUJxkJzIJUAoVN1giE0B1IJ+KFTdYKx0BxIJUDoVJ1gvBwcSCVgoVN1giE0B1IJeDlSdYKx0BxIJUDoVJ1gCM2BVAJ+6FSdYCw0B1IJEDpVJxgvBwdSCVjoVJ1gCM2BVAKETtUJxg/NgVQCFjpVJxhCcyCVgJcjVScYC82BVAKETtUJxsvBgVQCFjpVJxhCcyCVAKFTdYLxQ3MglYCFTtUJhtAcSCXg5UjVCcZCcyCVAKFTdYIhNAdSCfihU3WCsdAcSCVA6FSdYLwcHEglYKFTdYIhNAdSCXg5UnWCsdAcSCVA6FSdYAjNgVQCfuhUnWAsNAdSCRA6VScYLwcHUglY6FSdYAjNgVQChE7VCcYPzYFUAhY6VScYQnMglYCXI1UnGAvNgVQChE7VCcbLwYFUAhY6VScYQnMglQChU3WC8UNzIJWAhU7VCYbQHEgl4OVI1QnGQnMglQChU3WCITQHUgn4oVN1grHQHEglQOhUnWC8HBxIJWChU3WCITQHUgkQOlUnGD80B1IJWOhUnWAIzYFUAl6OVJ1gLDQHUgkQOlUnGC8HB1IJWOhUnWAIzYFUAoRO1QnGD82BVAIWOlUnGEJzIJWAlyNVJxgLzYFUAoRO1QmG0BxIJeCHTtUJxkJzIJUAoVN1gvFycCCVgIVO1QmG0BxIJeDlSNUJxkJzIJUAoVN1giE0B1IJ+KFTdYKx0BxIJUDoVJ1gvBwcSCVgoVN1giE0B1IJEDpVJxg/NAdSCVjoVJ1gCM2BVAJejlSdYCw0B1IJEDpVJxgvBwdSCVjoVJ1gCM2BVAKETtUJxg/NgVQCFjpVJxhCcyCVgJcjVScYC82BVAKETtUJhtAcSCXgh07VCcZCcyCVAKFTdYLxcnAglYCFTtUJhtAcSCXg5UjVCcZCcyCVAKFTdYIhNAdSCfihU3WCsdAcSCVA6FSdYLwcHEglsA/NlyICc3UCP/PSBEmeyvh+AAAAAElFTkSuQmCC)'
    },
    hue_slider: {
        selector: '#picker_hue',
        width: '16px',
        height: '150px',
        position: 'relative',
        display: 'inline-block',
        marginLeft: '10px',
        background: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAACWCAYAAADe8ajeAAABUklEQVRoBe2ZwQ4CMQhEIXJR//9T1biXyp1DJT4SzOKxRcLM0AJdXWJLwJ+J3EF3IhUOb+0jxDkcyD9qXpGHJ1R58nDyMMtA/6OnS95oGdVDFurQnlnWN/bjcEPQF9vD4RckbUzssTHIbtsr+4+NPa9yf8j9I8Tvw/6Q8QhxDvGj1x6yCl3o5bq5j5LbJmzP7hP9OExqEMwLOGSHUVe5fx72h9w/Qvws94eMR4hziB+9/pBxDmGHKgc70ausg30iEGHbJX+3wR2yLWdFhAM5dCu5BRdlVM5RFqwrEntECTTnFipEmdsmp0Gw9jLKfgFXd8fWZbgTEevvEO43xeCOuIDD/pDxCPE8xFXuDxnncByGGpFd+IMLdlTOihrs1ed5ttDDc4+/wbLtoTuEv9DYGSHjorCTWYXK/SHjHI7DcGMmFwouhxElqUEwP6Eoui5sof8A9nlhGxrI9UUAAAAASUVORK5CYII=)',
        border: '1px solid #ccc'
    },
    opacity_slider: {
        selector: '#picker_opacity',
        width: '16px',
        height: '150px',
        position: 'relative',
        display: 'inline-block',
        marginLeft: '10px',
        background: '#f00',
        border: '1px solid #ccc'
    },
    opacity_slider_overlay: {
        selector: '#picker_opacity_fade',
        width: '16px',
        height: '150px',
        display: 'inline-block',
        position: 'absolute',
        background: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAACWCAYAAADXGgikAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEBklEQVRo3q1ay6HUQAyz8+ZKIZzTAn3QB4VQB4Vs6qAMcdnAZCLJDvAu7C/J2JZl2SbiH//y9XptEYGIyOU7RETu+36+/n3N/KMREdt8wfR6Izecb4KIyDFdlPMX7LTs/SBPSnKiUJ+N6cnsByCnwmzGfIIUtsb7NyCm5Ji+TOE8a1oC+LR6dr7qOA4WiWRhzOX4QT5fT3uLQhbHjyXswXwQBR4uETrDyFDHbnxzKDMB6zGJCWBhjAVUYVCYDIkUaeLzP1A+jmMzjjvTeUXjDYlVGOX3w0AXDbMoDlhOQEVoTed05NExAQ0/RIdQIIAT1QkqE26ITQCf3RHffMCSjZoQDW6MlQ8+TJzX9zduZCeQ9jLOHAYwsVyEpYpRVmY3mr/P9bVyYkUol2zMZjmjp5z5gD5p33eJAcaJigMoBhQnuvIOVRc6hEL9MIqnsahQEyoOhArlMNB1Ja/0wWYKClY++NLgg+gwEtRTHEodobBaeaP/lVC6SiVVMkVhRiqBoRCXTmApgRFP8mM0dKGq2hc+kJS277ut0KtCUeShkqtd2qT4GELiZcEPti4owZEMZMPJWJInsmfCw3bngkQnacOgFGe/8NVx4XEccJSnkKhQaBuOyg+SD1J0JQqByZxoK7BLtlHEutSNQ3BAGL14A9KH6gUa72Mcx5GCNLH0CzSx5qYLBtZQ7fHpxFRQrUxhhJLN7sUiURUSKnU3Qxhp/LGp2pgPkivVEKb7hwTwTdTDWR+w6Yal9c3goCWyUDSkpcgKw4PJkKgycCP9wvyvHURV0t/KPBiVEqo640GF2li/QEG08EEyTswH1RhOI3U54BKlihNL7TTMILKTXBhmglOVtmCVCcXR0RVZ7SlOAvjumsxJH1Az3TRPlfoLKkdB5VmZ4wbT2UBmVIPprDJzLW0VH9zgrhQKuppZlbatMZCLkw8UlZ/9guKC7CCxzM5hMIAGT/zuG13GKQFWFpaWOcOM/lsspfQBTCNGFYpzVLobJIAf7pjTPFHOVDvduwx1NUuruDI7kyyl3qGKa2dNdBuJKhS6rnZjk6xK5ubf+kDO1mZ9QLXye35QjkSr8WeKzJRD2apCJ+udwwzpU62RHBLdlD+dWmeDJygtpZBYLTDL1tcl1WVgmQBe/2OeiILWW41nmIZLNuTdjWd0mq54aEY4jdR5OpQTO51re8fSmh/YbHzrAxkN1y+EUCqPFxSWI7ubrnDDOCUwWKmXPqiOmx2p+2g1Us3SWANOt18J4KeZI618cPuNS6bWfyUYZobmeDHCLOuyGAtt3TVRq9SpdG6lspsrpwkdlboqpcuV+tkvyE3PtF+IipXDVGQbxq1oOl2pt7Wxsl/uF8L1yswHGX4h5fYL+Qv+btsS2cFCRgAAAABJRU5ErkJggg==)'
    },
    colour_selector: {
        selector: '.picker_selector',
        width: '10px',
        height: '10px',
        position: 'absolute',
        display: 'inline-block',
        borderRadius: '20px',
        cursor: 'pointer',
        border: '2px solid #fff',
        boxShadow: '0 0 3px 1px #67b9ff',
        background: '#f00',
        left: '173px',
        top: '-7px'
    },
    slider_bar: {
        selector: '.picker_slider_bar',
        width: '100%',
        height: '10px',
        position: 'absolute',
        top: '-7px',
        borderRadius: '2px',
        cursor: 'pointer',
        border: '2px solid #fff',
        boxShadow: '0 0 3px 1px #67b9ff',
        marginLeft: '-2px',
        background: '#f00',
        fontSize: '16px'
    },
    sample: {
        selector: '#picker_sample',
        width: '180px',
        height: '24px',
        background: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAIUlEQVR42mM4c+bMf3yYEGAYNWBYGEBIASELRg0YFgYAAMoUr64OfmpAAAAAAElFTkSuQmCC)',
        display: 'inline-block',
        position: 'relative',
        marginTop: '10px',
        border: '1px solid #aaa',
    },
    sample_colour: {
        selector: '#picker_sample_colour',
        width: '100%',
        height: '100%',
        background: 'rgba(255,0,0,0.4)',
        position: 'absolute',
    },
    done_button: {
        selector: '#picker_done',
        width: '54px',
        height: '22px',
        lineHeight: '22px',
        background: '#e2e2e2',
        display: 'inline-block',
        border: '1px solid #ccc',
        marginLeft: '10px',
        textAlign: 'center',
        color: '#777',
        position: 'absolute',
        right: '7px',
        bottom: '11px',
        cursor: 'pointer',
        boxShadow: '0 0 3px 1px #eee'
    },
    sample_value: {
        selector: '#picker_sample_value',
        width: '180px',
        height: '18px',
        display: 'inline-block',
        position: 'relative',
        marginTop: '10px',
        border: '1px solid #aaa',
        fontSize: '14px'
    },
    copy_button: {
        selector: '#picker_sample_copy',
        width: '54px',
        height: '22px',
        lineHeight: '22px',
        background: '#e2e2e2',
        display: 'inline-block',
        border: '1px solid #ccc',
        marginLeft: '10px',
        textAlign: 'center',
        color: '#777',
        position: 'absolute',
        right: '7px',
        bottom: '44px',
        cursor: 'pointer',
        boxShadow: '0 0 3px 1px #eee'
    }
};
Picker.prototype.apply_style = function () {
    for (let name in this.css) {
        let element = this.css[name];
        let tags = this._shadow.querySelectorAll(element.selector);
        if (!tags.length) continue;
        let i = tags.length;
        while (i--) {
            let tag = tags[i];
            for (let name in element) {
                if (name == 'selector') continue;
                let property = element[name];
                tag.style[name] = property;
            }
        }
    }
};
Picker.prototype.show = function (color) {
    let wrapper = this._shadow.getElementById('picker_wrapper');
    if (wrapper) {
        wrapper.style.display = 'inline-block';
        //return;
    }
    let html = `
        <div id="picker_wrapper">
            <div id="picker_selector">
                <div id="picker_saturation"></div>
                <div id="picker_value"></div>
                <div class="picker_selector"></div>
            </div>
            <div id="picker_hue" class="picker_slider">
                <div class="picker_slider_bar"></div>
            </div>
            <div id="picker_opacity" class="picker_slider">
                <div id="picker_opacity_fade"></div>
                <div class="picker_slider_bar"></div>
            </div>
            <br>
            <div> 
                <div id="picker_sample_value"></div>
                <div id="picker_sample_copy">copy</div>
            </div>
            <div id="picker_sample">
                <div id="picker_sample_colour"></div>
            </div>
            <div id="picker_done">ok</div>
        </div>
    `
    let parent = this.settings.parent;
    if (parent.style.position != 'absolute') {
        parent.style.position = 'relative';
    }
    parent.innerHTML = html;
    this.apply_style();
    this.bind_events();
    let h, l, s, a;
    if (color) {
        let _color = color.replace('hsla(', '').replace(/%/g, '').replace(')', '').split(',')
        h = Number(_color[0]); s = Number(_color[1]) / 100; l = (Number(_color[2]) / 100) * 2; a = Number(_color[3]);
        s = l <= 1 ? s * l : s * (2 - l);
        this.color.hue = h;
        this.color.saturation = 2 * s / (l + s);
        this.color.saturation = this.color.saturation > 1 ? 1 : this.color.saturation;
        this.color.value = s / this.color.saturation;
        this.color.value = this.color.value > 1 ? 1 : this.color.value;
        this.color.alpha = a;
        let hue_select = this._shadow.getElementById('picker_hue');
        let height = Number(hue_select.style.height.replace('px', ''));
        let hue_slider = this._shadow.querySelector('#picker_hue .picker_slider_bar');
        hue_slider.style.top = Math.round(height - (height / 360 * this.color.hue)) + 'px';
        let opacity_select = this._shadow.getElementById('picker_opacity');
        height = Number(opacity_select.style.height.replace('px', ''));
        let opacity_slider = this._shadow.querySelector('#picker_opacity .picker_slider_bar');
        opacity_slider.style.top = Math.round(height - (height * a)) + 'px';
        let colour_select = this._shadow.getElementById('picker_selector');
        colour_select.style.background = 'hsl(' + this.colour.hue + ', 100%, 50%)';
    }
    this.update_sample(color);
    this.update_picker_slider(color ? `hsl(${h}, ${l * 200}%, ${s * 100}%)` : '');
    this.update_hue_slider();
    this.update_opacity_slider();
};
Picker.prototype.hide = function () {
    let element = this._shadow.getElementById('picker_wrapper');
    if (element) {
        element.style.display = 'none';
    }
};
Picker.prototype.update_picker_selector = function (element, x, y) {
    this.colour.saturation = x / (element.offsetWidth - 2);
    this.colour.value = 1 - y / (element.offsetHeight - 2);
    this.update_opacity_slider();
    this.update_sample();
    this.update_picker_slider();
};
Picker.prototype.update_picker_hue = function (element, x, y) {
    this.colour.hue = (1 - y / (element.offsetHeight - 2)) * 360;
    this.update_selector_hue();
    this.update_sample();
    this.update_hue_slider();
};
Picker.prototype.update_picker_opacity = function (element, x, y) {
    this.colour.alpha = 1 - y / (element.offsetHeight - 2);
    this.update_sample();
    this.update_opacity_slider();
};
Picker.prototype.update_sample = function (color) {
    let sample = this._shadow.getElementById('picker_sample_colour');
    sample.style.background = color || this.colour.hsla().toString();
    let value = this._shadow.getElementById('picker_sample_value');
    value.innerHTML = color || this.colour.hsla().toString();
    this.update_opacity_hue();
    if (this.on_change) {
        this.on_change(this.colour);
    }
};
Picker.prototype.update_selector_hue = function () {
    let picker = this._shadow.getElementById('picker_selector');
    picker.style.background = 'hsl(' + this.colour.hue + ', 100%, 50%)';
    this.update_picker_slider();
    this.update_opacity_slider();
};
Picker.prototype.update_opacity_hue = function () {
    let picker = this._shadow.getElementById('picker_opacity');
    picker.style.background = this.colour.hsl().toString();
};
Picker.prototype.update_picker_slider = function (color) {
    let slider = this._shadow.querySelector('#picker_selector .picker_selector');
    slider.style.background = color || this.colour.hsl().toString();
};
Picker.prototype.update_hue_slider = function () {
    let slider = this._shadow.querySelector('#picker_hue .picker_slider_bar');
    slider.style.background = 'hsl(' + this.colour.hue + ', 100%, 50%)';
};
Picker.prototype.update_opacity_slider = function () {
    let slider = this._shadow.querySelector('#picker_opacity .picker_slider_bar');
    slider.style.background = this.colour.hsla().toString();
};
Picker.prototype.mouse_move = function (e, element, _this, override) {
    let rect = element.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    if (override || (_this.sliders[element.id] && _this.sliders[element.id].down)) {
        let slider_info = _this.sliders[element.id];
        let slider = element.querySelectorAll('.picker_selector')[0] || element.querySelectorAll('.picker_slider_bar')[0];
        if (!slider) return;
        if (!slider_info.vertical) {
            x = Math.min(Math.max(x - slider.offsetWidth / 2, -(slider.offsetWidth / 2)), element.offsetWidth - slider.offsetWidth / 2 - 2);
            slider.style.left = x + 'px';
        }
        y = Math.min(Math.max(y - slider.offsetHeight / 2, -(slider.offsetHeight / 2)), element.offsetHeight - slider.offsetHeight / 2 - 2);
        slider.style.top = y + 'px';
        if (_this['update_' + element.id]) {
            _this['update_' + element.id](element, x + slider.offsetWidth / 2, y + slider.offsetHeight / 2);
        }
    }
};
Picker.prototype.bind_events = function () {
    let wrapper = this._shadow.getElementById('picker_wrapper');
    let done = this._shadow.getElementById('picker_done');
    let copy = this._shadow.getElementById('picker_sample_copy');
    let value = this._shadow.getElementById('picker_sample_value');
    let colour_select = this._shadow.getElementById('picker_selector');
    let hue_select = this._shadow.getElementById('picker_hue');
    let opacity_select = this._shadow.getElementById('picker_opacity');
    let picker_slider = this._shadow.querySelector('#picker_selector .picker_selector');
    let hue_slider = this._shadow.querySelector('#picker_hue .picker_slider_bar');
    let opacity_slider = this._shadow.querySelector('#picker_opacity .picker_slider_bar');
    let _this = this;
    colour_select.onmousemove = hue_select.onmousemove = opacity_select.onmousemove = function (e) {
        _this.mouse_move(e, this, _this);
        e.preventDefault();
    };
    colour_select.onmousedown = hue_select.onmousedown = opacity_select.onmousedown = function (e) {
        _this.sliders[this.id].down = true;
        _this.mouse_move(e, this, _this, true);
        e.preventDefault();
    };
    picker_slider.onmousedown = hue_slider.onmousedown = opacity_slider.onmousedown = function () {
        _this.sliders[this.parentNode.id].down = true;
    };
    wrapper.onclick = wrapper.onmousedown = function (e) {
        e.stopPropagation();
        e.preventDefault();
        return false;
    };
    this._shadow.ownerDocument.onmouseup = function () {
        for (let name in _this.sliders) {
            _this.sliders[name].down = false;
        }
    };
    document.onclick = function (e) {
        if (this._parent && this._parent != _this.settings.parent) {
            _this.hide();
        }
    };
    done.onclick = function () {
        _this.done();
    };
    copy.onclick = async () => {
        await navigator.clipboard.writeText(value.innerHTML);
    };
};
Picker.prototype.done = function () {
    this.hide();
    if (this.on_done) {
        this.on_done(this.colour);
    }
};
export default Picker;