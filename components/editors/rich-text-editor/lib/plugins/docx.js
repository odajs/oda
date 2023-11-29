import { TitleLevel as ft, ElementType as qe, ListStyle as ba } from "@hufe921/canvas-editor";
function va(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var qi = { exports: {} }, Vi = {
  aliceblue: [240, 248, 255],
  antiquewhite: [250, 235, 215],
  aqua: [0, 255, 255],
  aquamarine: [127, 255, 212],
  azure: [240, 255, 255],
  beige: [245, 245, 220],
  bisque: [255, 228, 196],
  black: [0, 0, 0],
  blanchedalmond: [255, 235, 205],
  blue: [0, 0, 255],
  blueviolet: [138, 43, 226],
  brown: [165, 42, 42],
  burlywood: [222, 184, 135],
  cadetblue: [95, 158, 160],
  chartreuse: [127, 255, 0],
  chocolate: [210, 105, 30],
  coral: [255, 127, 80],
  cornflowerblue: [100, 149, 237],
  cornsilk: [255, 248, 220],
  crimson: [220, 20, 60],
  cyan: [0, 255, 255],
  darkblue: [0, 0, 139],
  darkcyan: [0, 139, 139],
  darkgoldenrod: [184, 134, 11],
  darkgray: [169, 169, 169],
  darkgreen: [0, 100, 0],
  darkgrey: [169, 169, 169],
  darkkhaki: [189, 183, 107],
  darkmagenta: [139, 0, 139],
  darkolivegreen: [85, 107, 47],
  darkorange: [255, 140, 0],
  darkorchid: [153, 50, 204],
  darkred: [139, 0, 0],
  darksalmon: [233, 150, 122],
  darkseagreen: [143, 188, 143],
  darkslateblue: [72, 61, 139],
  darkslategray: [47, 79, 79],
  darkslategrey: [47, 79, 79],
  darkturquoise: [0, 206, 209],
  darkviolet: [148, 0, 211],
  deeppink: [255, 20, 147],
  deepskyblue: [0, 191, 255],
  dimgray: [105, 105, 105],
  dimgrey: [105, 105, 105],
  dodgerblue: [30, 144, 255],
  firebrick: [178, 34, 34],
  floralwhite: [255, 250, 240],
  forestgreen: [34, 139, 34],
  fuchsia: [255, 0, 255],
  gainsboro: [220, 220, 220],
  ghostwhite: [248, 248, 255],
  gold: [255, 215, 0],
  goldenrod: [218, 165, 32],
  gray: [128, 128, 128],
  green: [0, 128, 0],
  greenyellow: [173, 255, 47],
  grey: [128, 128, 128],
  honeydew: [240, 255, 240],
  hotpink: [255, 105, 180],
  indianred: [205, 92, 92],
  indigo: [75, 0, 130],
  ivory: [255, 255, 240],
  khaki: [240, 230, 140],
  lavender: [230, 230, 250],
  lavenderblush: [255, 240, 245],
  lawngreen: [124, 252, 0],
  lemonchiffon: [255, 250, 205],
  lightblue: [173, 216, 230],
  lightcoral: [240, 128, 128],
  lightcyan: [224, 255, 255],
  lightgoldenrodyellow: [250, 250, 210],
  lightgray: [211, 211, 211],
  lightgreen: [144, 238, 144],
  lightgrey: [211, 211, 211],
  lightpink: [255, 182, 193],
  lightsalmon: [255, 160, 122],
  lightseagreen: [32, 178, 170],
  lightskyblue: [135, 206, 250],
  lightslategray: [119, 136, 153],
  lightslategrey: [119, 136, 153],
  lightsteelblue: [176, 196, 222],
  lightyellow: [255, 255, 224],
  lime: [0, 255, 0],
  limegreen: [50, 205, 50],
  linen: [250, 240, 230],
  magenta: [255, 0, 255],
  maroon: [128, 0, 0],
  mediumaquamarine: [102, 205, 170],
  mediumblue: [0, 0, 205],
  mediumorchid: [186, 85, 211],
  mediumpurple: [147, 112, 219],
  mediumseagreen: [60, 179, 113],
  mediumslateblue: [123, 104, 238],
  mediumspringgreen: [0, 250, 154],
  mediumturquoise: [72, 209, 204],
  mediumvioletred: [199, 21, 133],
  midnightblue: [25, 25, 112],
  mintcream: [245, 255, 250],
  mistyrose: [255, 228, 225],
  moccasin: [255, 228, 181],
  navajowhite: [255, 222, 173],
  navy: [0, 0, 128],
  oldlace: [253, 245, 230],
  olive: [128, 128, 0],
  olivedrab: [107, 142, 35],
  orange: [255, 165, 0],
  orangered: [255, 69, 0],
  orchid: [218, 112, 214],
  palegoldenrod: [238, 232, 170],
  palegreen: [152, 251, 152],
  paleturquoise: [175, 238, 238],
  palevioletred: [219, 112, 147],
  papayawhip: [255, 239, 213],
  peachpuff: [255, 218, 185],
  peru: [205, 133, 63],
  pink: [255, 192, 203],
  plum: [221, 160, 221],
  powderblue: [176, 224, 230],
  purple: [128, 0, 128],
  rebeccapurple: [102, 51, 153],
  red: [255, 0, 0],
  rosybrown: [188, 143, 143],
  royalblue: [65, 105, 225],
  saddlebrown: [139, 69, 19],
  salmon: [250, 128, 114],
  sandybrown: [244, 164, 96],
  seagreen: [46, 139, 87],
  seashell: [255, 245, 238],
  sienna: [160, 82, 45],
  silver: [192, 192, 192],
  skyblue: [135, 206, 235],
  slateblue: [106, 90, 205],
  slategray: [112, 128, 144],
  slategrey: [112, 128, 144],
  snow: [255, 250, 250],
  springgreen: [0, 255, 127],
  steelblue: [70, 130, 180],
  tan: [210, 180, 140],
  teal: [0, 128, 128],
  thistle: [216, 191, 216],
  tomato: [255, 99, 71],
  turquoise: [64, 224, 208],
  violet: [238, 130, 238],
  wheat: [245, 222, 179],
  white: [255, 255, 255],
  whitesmoke: [245, 245, 245],
  yellow: [255, 255, 0],
  yellowgreen: [154, 205, 50]
}, $i = { exports: {} }, _a = function(e) {
  return !e || typeof e == "string" ? !1 : e instanceof Array || Array.isArray(e) || e.length >= 0 && (e.splice instanceof Function || Object.getOwnPropertyDescriptor(e, e.length - 1) && e.constructor.name !== "String");
}, xa = _a, Ea = Array.prototype.concat, Aa = Array.prototype.slice, Gn = $i.exports = function(e) {
  for (var r = [], n = 0, o = e.length; n < o; n++) {
    var c = e[n];
    xa(c) ? r = Ea.call(r, Aa.call(c)) : r.push(c);
  }
  return r;
};
Gn.wrap = function(t) {
  return function() {
    return t(Gn(arguments));
  };
};
var Ta = $i.exports, Dt = Vi, Bt = Ta, Xi = Object.hasOwnProperty, Zi = /* @__PURE__ */ Object.create(null);
for (var pr in Dt)
  Xi.call(Dt, pr) && (Zi[Dt[pr]] = pr);
var Be = qi.exports = {
  to: {},
  get: {}
};
Be.get = function(t) {
  var e = t.substring(0, 3).toLowerCase(), r, n;
  switch (e) {
    case "hsl":
      r = Be.get.hsl(t), n = "hsl";
      break;
    case "hwb":
      r = Be.get.hwb(t), n = "hwb";
      break;
    default:
      r = Be.get.rgb(t), n = "rgb";
      break;
  }
  return r ? { model: n, value: r } : null;
};
Be.get.rgb = function(t) {
  if (!t)
    return null;
  var e = /^#([a-f0-9]{3,4})$/i, r = /^#([a-f0-9]{6})([a-f0-9]{2})?$/i, n = /^rgba?\(\s*([+-]?\d+)(?=[\s,])\s*(?:,\s*)?([+-]?\d+)(?=[\s,])\s*(?:,\s*)?([+-]?\d+)\s*(?:[,|\/]\s*([+-]?[\d\.]+)(%?)\s*)?\)$/, o = /^rgba?\(\s*([+-]?[\d\.]+)\%\s*,?\s*([+-]?[\d\.]+)\%\s*,?\s*([+-]?[\d\.]+)\%\s*(?:[,|\/]\s*([+-]?[\d\.]+)(%?)\s*)?\)$/, c = /^(\w+)$/, u = [0, 0, 0, 1], i, l, b;
  if (i = t.match(r)) {
    for (b = i[2], i = i[1], l = 0; l < 3; l++) {
      var E = l * 2;
      u[l] = parseInt(i.slice(E, E + 2), 16);
    }
    b && (u[3] = parseInt(b, 16) / 255);
  } else if (i = t.match(e)) {
    for (i = i[1], b = i[3], l = 0; l < 3; l++)
      u[l] = parseInt(i[l] + i[l], 16);
    b && (u[3] = parseInt(b + b, 16) / 255);
  } else if (i = t.match(n)) {
    for (l = 0; l < 3; l++)
      u[l] = parseInt(i[l + 1], 0);
    i[4] && (i[5] ? u[3] = parseFloat(i[4]) * 0.01 : u[3] = parseFloat(i[4]));
  } else if (i = t.match(o)) {
    for (l = 0; l < 3; l++)
      u[l] = Math.round(parseFloat(i[l + 1]) * 2.55);
    i[4] && (i[5] ? u[3] = parseFloat(i[4]) * 0.01 : u[3] = parseFloat(i[4]));
  } else
    return (i = t.match(c)) ? i[1] === "transparent" ? [0, 0, 0, 0] : Xi.call(Dt, i[1]) ? (u = Dt[i[1]], u[3] = 1, u) : null : null;
  for (l = 0; l < 3; l++)
    u[l] = tt(u[l], 0, 255);
  return u[3] = tt(u[3], 0, 1), u;
};
Be.get.hsl = function(t) {
  if (!t)
    return null;
  var e = /^hsla?\(\s*([+-]?(?:\d{0,3}\.)?\d+)(?:deg)?\s*,?\s*([+-]?[\d\.]+)%\s*,?\s*([+-]?[\d\.]+)%\s*(?:[,|\/]\s*([+-]?(?=\.\d|\d)(?:0|[1-9]\d*)?(?:\.\d*)?(?:[eE][+-]?\d+)?)\s*)?\)$/, r = t.match(e);
  if (r) {
    var n = parseFloat(r[4]), o = (parseFloat(r[1]) % 360 + 360) % 360, c = tt(parseFloat(r[2]), 0, 100), u = tt(parseFloat(r[3]), 0, 100), i = tt(isNaN(n) ? 1 : n, 0, 1);
    return [o, c, u, i];
  }
  return null;
};
Be.get.hwb = function(t) {
  if (!t)
    return null;
  var e = /^hwb\(\s*([+-]?\d{0,3}(?:\.\d+)?)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?(?=\.\d|\d)(?:0|[1-9]\d*)?(?:\.\d*)?(?:[eE][+-]?\d+)?)\s*)?\)$/, r = t.match(e);
  if (r) {
    var n = parseFloat(r[4]), o = (parseFloat(r[1]) % 360 + 360) % 360, c = tt(parseFloat(r[2]), 0, 100), u = tt(parseFloat(r[3]), 0, 100), i = tt(isNaN(n) ? 1 : n, 0, 1);
    return [o, c, u, i];
  }
  return null;
};
Be.to.hex = function() {
  var t = Bt(arguments);
  return "#" + Gt(t[0]) + Gt(t[1]) + Gt(t[2]) + (t[3] < 1 ? Gt(Math.round(t[3] * 255)) : "");
};
Be.to.rgb = function() {
  var t = Bt(arguments);
  return t.length < 4 || t[3] === 1 ? "rgb(" + Math.round(t[0]) + ", " + Math.round(t[1]) + ", " + Math.round(t[2]) + ")" : "rgba(" + Math.round(t[0]) + ", " + Math.round(t[1]) + ", " + Math.round(t[2]) + ", " + t[3] + ")";
};
Be.to.rgb.percent = function() {
  var t = Bt(arguments), e = Math.round(t[0] / 255 * 100), r = Math.round(t[1] / 255 * 100), n = Math.round(t[2] / 255 * 100);
  return t.length < 4 || t[3] === 1 ? "rgb(" + e + "%, " + r + "%, " + n + "%)" : "rgba(" + e + "%, " + r + "%, " + n + "%, " + t[3] + ")";
};
Be.to.hsl = function() {
  var t = Bt(arguments);
  return t.length < 4 || t[3] === 1 ? "hsl(" + t[0] + ", " + t[1] + "%, " + t[2] + "%)" : "hsla(" + t[0] + ", " + t[1] + "%, " + t[2] + "%, " + t[3] + ")";
};
Be.to.hwb = function() {
  var t = Bt(arguments), e = "";
  return t.length >= 4 && t[3] !== 1 && (e = ", " + t[3]), "hwb(" + t[0] + ", " + t[1] + "%, " + t[2] + "%" + e + ")";
};
Be.to.keyword = function(t) {
  return Zi[t.slice(0, 3)];
};
function tt(t, e, r) {
  return Math.min(Math.max(e, t), r);
}
function Gt(t) {
  var e = Math.round(t).toString(16).toUpperCase();
  return e.length < 2 ? "0" + e : e;
}
var Sa = qi.exports;
const Pt = Vi, Yi = {};
for (const t of Object.keys(Pt))
  Yi[Pt[t]] = t;
const de = {
  rgb: { channels: 3, labels: "rgb" },
  hsl: { channels: 3, labels: "hsl" },
  hsv: { channels: 3, labels: "hsv" },
  hwb: { channels: 3, labels: "hwb" },
  cmyk: { channels: 4, labels: "cmyk" },
  xyz: { channels: 3, labels: "xyz" },
  lab: { channels: 3, labels: "lab" },
  lch: { channels: 3, labels: "lch" },
  hex: { channels: 1, labels: ["hex"] },
  keyword: { channels: 1, labels: ["keyword"] },
  ansi16: { channels: 1, labels: ["ansi16"] },
  ansi256: { channels: 1, labels: ["ansi256"] },
  hcg: { channels: 3, labels: ["h", "c", "g"] },
  apple: { channels: 3, labels: ["r16", "g16", "b16"] },
  gray: { channels: 1, labels: ["gray"] }
};
var Ji = de;
for (const t of Object.keys(de)) {
  if (!("channels" in de[t]))
    throw new Error("missing channels property: " + t);
  if (!("labels" in de[t]))
    throw new Error("missing channel labels property: " + t);
  if (de[t].labels.length !== de[t].channels)
    throw new Error("channel and label counts mismatch: " + t);
  const { channels: e, labels: r } = de[t];
  delete de[t].channels, delete de[t].labels, Object.defineProperty(de[t], "channels", { value: e }), Object.defineProperty(de[t], "labels", { value: r });
}
de.rgb.hsl = function(t) {
  const e = t[0] / 255, r = t[1] / 255, n = t[2] / 255, o = Math.min(e, r, n), c = Math.max(e, r, n), u = c - o;
  let i, l;
  c === o ? i = 0 : e === c ? i = (r - n) / u : r === c ? i = 2 + (n - e) / u : n === c && (i = 4 + (e - r) / u), i = Math.min(i * 60, 360), i < 0 && (i += 360);
  const b = (o + c) / 2;
  return c === o ? l = 0 : b <= 0.5 ? l = u / (c + o) : l = u / (2 - c - o), [i, l * 100, b * 100];
};
de.rgb.hsv = function(t) {
  let e, r, n, o, c;
  const u = t[0] / 255, i = t[1] / 255, l = t[2] / 255, b = Math.max(u, i, l), E = b - Math.min(u, i, l), T = function(A) {
    return (b - A) / 6 / E + 1 / 2;
  };
  return E === 0 ? (o = 0, c = 0) : (c = E / b, e = T(u), r = T(i), n = T(l), u === b ? o = n - r : i === b ? o = 1 / 3 + e - n : l === b && (o = 2 / 3 + r - e), o < 0 ? o += 1 : o > 1 && (o -= 1)), [
    o * 360,
    c * 100,
    b * 100
  ];
};
de.rgb.hwb = function(t) {
  const e = t[0], r = t[1];
  let n = t[2];
  const o = de.rgb.hsl(t)[0], c = 1 / 255 * Math.min(e, Math.min(r, n));
  return n = 1 - 1 / 255 * Math.max(e, Math.max(r, n)), [o, c * 100, n * 100];
};
de.rgb.cmyk = function(t) {
  const e = t[0] / 255, r = t[1] / 255, n = t[2] / 255, o = Math.min(1 - e, 1 - r, 1 - n), c = (1 - e - o) / (1 - o) || 0, u = (1 - r - o) / (1 - o) || 0, i = (1 - n - o) / (1 - o) || 0;
  return [c * 100, u * 100, i * 100, o * 100];
};
function ka(t, e) {
  return (t[0] - e[0]) ** 2 + (t[1] - e[1]) ** 2 + (t[2] - e[2]) ** 2;
}
de.rgb.keyword = function(t) {
  const e = Yi[t];
  if (e)
    return e;
  let r = 1 / 0, n;
  for (const o of Object.keys(Pt)) {
    const c = Pt[o], u = ka(t, c);
    u < r && (r = u, n = o);
  }
  return n;
};
de.keyword.rgb = function(t) {
  return Pt[t];
};
de.rgb.xyz = function(t) {
  let e = t[0] / 255, r = t[1] / 255, n = t[2] / 255;
  e = e > 0.04045 ? ((e + 0.055) / 1.055) ** 2.4 : e / 12.92, r = r > 0.04045 ? ((r + 0.055) / 1.055) ** 2.4 : r / 12.92, n = n > 0.04045 ? ((n + 0.055) / 1.055) ** 2.4 : n / 12.92;
  const o = e * 0.4124 + r * 0.3576 + n * 0.1805, c = e * 0.2126 + r * 0.7152 + n * 0.0722, u = e * 0.0193 + r * 0.1192 + n * 0.9505;
  return [o * 100, c * 100, u * 100];
};
de.rgb.lab = function(t) {
  const e = de.rgb.xyz(t);
  let r = e[0], n = e[1], o = e[2];
  r /= 95.047, n /= 100, o /= 108.883, r = r > 8856e-6 ? r ** (1 / 3) : 7.787 * r + 16 / 116, n = n > 8856e-6 ? n ** (1 / 3) : 7.787 * n + 16 / 116, o = o > 8856e-6 ? o ** (1 / 3) : 7.787 * o + 16 / 116;
  const c = 116 * n - 16, u = 500 * (r - n), i = 200 * (n - o);
  return [c, u, i];
};
de.hsl.rgb = function(t) {
  const e = t[0] / 360, r = t[1] / 100, n = t[2] / 100;
  let o, c, u;
  if (r === 0)
    return u = n * 255, [u, u, u];
  n < 0.5 ? o = n * (1 + r) : o = n + r - n * r;
  const i = 2 * n - o, l = [0, 0, 0];
  for (let b = 0; b < 3; b++)
    c = e + 1 / 3 * -(b - 1), c < 0 && c++, c > 1 && c--, 6 * c < 1 ? u = i + (o - i) * 6 * c : 2 * c < 1 ? u = o : 3 * c < 2 ? u = i + (o - i) * (2 / 3 - c) * 6 : u = i, l[b] = u * 255;
  return l;
};
de.hsl.hsv = function(t) {
  const e = t[0];
  let r = t[1] / 100, n = t[2] / 100, o = r;
  const c = Math.max(n, 0.01);
  n *= 2, r *= n <= 1 ? n : 2 - n, o *= c <= 1 ? c : 2 - c;
  const u = (n + r) / 2, i = n === 0 ? 2 * o / (c + o) : 2 * r / (n + r);
  return [e, i * 100, u * 100];
};
de.hsv.rgb = function(t) {
  const e = t[0] / 60, r = t[1] / 100;
  let n = t[2] / 100;
  const o = Math.floor(e) % 6, c = e - Math.floor(e), u = 255 * n * (1 - r), i = 255 * n * (1 - r * c), l = 255 * n * (1 - r * (1 - c));
  switch (n *= 255, o) {
    case 0:
      return [n, l, u];
    case 1:
      return [i, n, u];
    case 2:
      return [u, n, l];
    case 3:
      return [u, i, n];
    case 4:
      return [l, u, n];
    case 5:
      return [n, u, i];
  }
};
de.hsv.hsl = function(t) {
  const e = t[0], r = t[1] / 100, n = t[2] / 100, o = Math.max(n, 0.01);
  let c, u;
  u = (2 - r) * n;
  const i = (2 - r) * o;
  return c = r * o, c /= i <= 1 ? i : 2 - i, c = c || 0, u /= 2, [e, c * 100, u * 100];
};
de.hwb.rgb = function(t) {
  const e = t[0] / 360;
  let r = t[1] / 100, n = t[2] / 100;
  const o = r + n;
  let c;
  o > 1 && (r /= o, n /= o);
  const u = Math.floor(6 * e), i = 1 - n;
  c = 6 * e - u, u & 1 && (c = 1 - c);
  const l = r + c * (i - r);
  let b, E, T;
  switch (u) {
    default:
    case 6:
    case 0:
      b = i, E = l, T = r;
      break;
    case 1:
      b = l, E = i, T = r;
      break;
    case 2:
      b = r, E = i, T = l;
      break;
    case 3:
      b = r, E = l, T = i;
      break;
    case 4:
      b = l, E = r, T = i;
      break;
    case 5:
      b = i, E = r, T = l;
      break;
  }
  return [b * 255, E * 255, T * 255];
};
de.cmyk.rgb = function(t) {
  const e = t[0] / 100, r = t[1] / 100, n = t[2] / 100, o = t[3] / 100, c = 1 - Math.min(1, e * (1 - o) + o), u = 1 - Math.min(1, r * (1 - o) + o), i = 1 - Math.min(1, n * (1 - o) + o);
  return [c * 255, u * 255, i * 255];
};
de.xyz.rgb = function(t) {
  const e = t[0] / 100, r = t[1] / 100, n = t[2] / 100;
  let o, c, u;
  return o = e * 3.2406 + r * -1.5372 + n * -0.4986, c = e * -0.9689 + r * 1.8758 + n * 0.0415, u = e * 0.0557 + r * -0.204 + n * 1.057, o = o > 31308e-7 ? 1.055 * o ** (1 / 2.4) - 0.055 : o * 12.92, c = c > 31308e-7 ? 1.055 * c ** (1 / 2.4) - 0.055 : c * 12.92, u = u > 31308e-7 ? 1.055 * u ** (1 / 2.4) - 0.055 : u * 12.92, o = Math.min(Math.max(0, o), 1), c = Math.min(Math.max(0, c), 1), u = Math.min(Math.max(0, u), 1), [o * 255, c * 255, u * 255];
};
de.xyz.lab = function(t) {
  let e = t[0], r = t[1], n = t[2];
  e /= 95.047, r /= 100, n /= 108.883, e = e > 8856e-6 ? e ** (1 / 3) : 7.787 * e + 16 / 116, r = r > 8856e-6 ? r ** (1 / 3) : 7.787 * r + 16 / 116, n = n > 8856e-6 ? n ** (1 / 3) : 7.787 * n + 16 / 116;
  const o = 116 * r - 16, c = 500 * (e - r), u = 200 * (r - n);
  return [o, c, u];
};
de.lab.xyz = function(t) {
  const e = t[0], r = t[1], n = t[2];
  let o, c, u;
  c = (e + 16) / 116, o = r / 500 + c, u = c - n / 200;
  const i = c ** 3, l = o ** 3, b = u ** 3;
  return c = i > 8856e-6 ? i : (c - 16 / 116) / 7.787, o = l > 8856e-6 ? l : (o - 16 / 116) / 7.787, u = b > 8856e-6 ? b : (u - 16 / 116) / 7.787, o *= 95.047, c *= 100, u *= 108.883, [o, c, u];
};
de.lab.lch = function(t) {
  const e = t[0], r = t[1], n = t[2];
  let o;
  o = Math.atan2(n, r) * 360 / 2 / Math.PI, o < 0 && (o += 360);
  const u = Math.sqrt(r * r + n * n);
  return [e, u, o];
};
de.lch.lab = function(t) {
  const e = t[0], r = t[1], o = t[2] / 360 * 2 * Math.PI, c = r * Math.cos(o), u = r * Math.sin(o);
  return [e, c, u];
};
de.rgb.ansi16 = function(t, e = null) {
  const [r, n, o] = t;
  let c = e === null ? de.rgb.hsv(t)[2] : e;
  if (c = Math.round(c / 50), c === 0)
    return 30;
  let u = 30 + (Math.round(o / 255) << 2 | Math.round(n / 255) << 1 | Math.round(r / 255));
  return c === 2 && (u += 60), u;
};
de.hsv.ansi16 = function(t) {
  return de.rgb.ansi16(de.hsv.rgb(t), t[2]);
};
de.rgb.ansi256 = function(t) {
  const e = t[0], r = t[1], n = t[2];
  return e === r && r === n ? e < 8 ? 16 : e > 248 ? 231 : Math.round((e - 8) / 247 * 24) + 232 : 16 + 36 * Math.round(e / 255 * 5) + 6 * Math.round(r / 255 * 5) + Math.round(n / 255 * 5);
};
de.ansi16.rgb = function(t) {
  let e = t % 10;
  if (e === 0 || e === 7)
    return t > 50 && (e += 3.5), e = e / 10.5 * 255, [e, e, e];
  const r = (~~(t > 50) + 1) * 0.5, n = (e & 1) * r * 255, o = (e >> 1 & 1) * r * 255, c = (e >> 2 & 1) * r * 255;
  return [n, o, c];
};
de.ansi256.rgb = function(t) {
  if (t >= 232) {
    const c = (t - 232) * 10 + 8;
    return [c, c, c];
  }
  t -= 16;
  let e;
  const r = Math.floor(t / 36) / 5 * 255, n = Math.floor((e = t % 36) / 6) / 5 * 255, o = e % 6 / 5 * 255;
  return [r, n, o];
};
de.rgb.hex = function(t) {
  const r = (((Math.round(t[0]) & 255) << 16) + ((Math.round(t[1]) & 255) << 8) + (Math.round(t[2]) & 255)).toString(16).toUpperCase();
  return "000000".substring(r.length) + r;
};
de.hex.rgb = function(t) {
  const e = t.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
  if (!e)
    return [0, 0, 0];
  let r = e[0];
  e[0].length === 3 && (r = r.split("").map((i) => i + i).join(""));
  const n = parseInt(r, 16), o = n >> 16 & 255, c = n >> 8 & 255, u = n & 255;
  return [o, c, u];
};
de.rgb.hcg = function(t) {
  const e = t[0] / 255, r = t[1] / 255, n = t[2] / 255, o = Math.max(Math.max(e, r), n), c = Math.min(Math.min(e, r), n), u = o - c;
  let i, l;
  return u < 1 ? i = c / (1 - u) : i = 0, u <= 0 ? l = 0 : o === e ? l = (r - n) / u % 6 : o === r ? l = 2 + (n - e) / u : l = 4 + (e - r) / u, l /= 6, l %= 1, [l * 360, u * 100, i * 100];
};
de.hsl.hcg = function(t) {
  const e = t[1] / 100, r = t[2] / 100, n = r < 0.5 ? 2 * e * r : 2 * e * (1 - r);
  let o = 0;
  return n < 1 && (o = (r - 0.5 * n) / (1 - n)), [t[0], n * 100, o * 100];
};
de.hsv.hcg = function(t) {
  const e = t[1] / 100, r = t[2] / 100, n = e * r;
  let o = 0;
  return n < 1 && (o = (r - n) / (1 - n)), [t[0], n * 100, o * 100];
};
de.hcg.rgb = function(t) {
  const e = t[0] / 360, r = t[1] / 100, n = t[2] / 100;
  if (r === 0)
    return [n * 255, n * 255, n * 255];
  const o = [0, 0, 0], c = e % 1 * 6, u = c % 1, i = 1 - u;
  let l = 0;
  switch (Math.floor(c)) {
    case 0:
      o[0] = 1, o[1] = u, o[2] = 0;
      break;
    case 1:
      o[0] = i, o[1] = 1, o[2] = 0;
      break;
    case 2:
      o[0] = 0, o[1] = 1, o[2] = u;
      break;
    case 3:
      o[0] = 0, o[1] = i, o[2] = 1;
      break;
    case 4:
      o[0] = u, o[1] = 0, o[2] = 1;
      break;
    default:
      o[0] = 1, o[1] = 0, o[2] = i;
  }
  return l = (1 - r) * n, [
    (r * o[0] + l) * 255,
    (r * o[1] + l) * 255,
    (r * o[2] + l) * 255
  ];
};
de.hcg.hsv = function(t) {
  const e = t[1] / 100, r = t[2] / 100, n = e + r * (1 - e);
  let o = 0;
  return n > 0 && (o = e / n), [t[0], o * 100, n * 100];
};
de.hcg.hsl = function(t) {
  const e = t[1] / 100, n = t[2] / 100 * (1 - e) + 0.5 * e;
  let o = 0;
  return n > 0 && n < 0.5 ? o = e / (2 * n) : n >= 0.5 && n < 1 && (o = e / (2 * (1 - n))), [t[0], o * 100, n * 100];
};
de.hcg.hwb = function(t) {
  const e = t[1] / 100, r = t[2] / 100, n = e + r * (1 - e);
  return [t[0], (n - e) * 100, (1 - n) * 100];
};
de.hwb.hcg = function(t) {
  const e = t[1] / 100, n = 1 - t[2] / 100, o = n - e;
  let c = 0;
  return o < 1 && (c = (n - o) / (1 - o)), [t[0], o * 100, c * 100];
};
de.apple.rgb = function(t) {
  return [t[0] / 65535 * 255, t[1] / 65535 * 255, t[2] / 65535 * 255];
};
de.rgb.apple = function(t) {
  return [t[0] / 255 * 65535, t[1] / 255 * 65535, t[2] / 255 * 65535];
};
de.gray.rgb = function(t) {
  return [t[0] / 100 * 255, t[0] / 100 * 255, t[0] / 100 * 255];
};
de.gray.hsl = function(t) {
  return [0, 0, t[0]];
};
de.gray.hsv = de.gray.hsl;
de.gray.hwb = function(t) {
  return [0, 100, t[0]];
};
de.gray.cmyk = function(t) {
  return [0, 0, 0, t[0]];
};
de.gray.lab = function(t) {
  return [t[0], 0, 0];
};
de.gray.hex = function(t) {
  const e = Math.round(t[0] / 100 * 255) & 255, n = ((e << 16) + (e << 8) + e).toString(16).toUpperCase();
  return "000000".substring(n.length) + n;
};
de.rgb.gray = function(t) {
  return [(t[0] + t[1] + t[2]) / 3 / 255 * 100];
};
const Jt = Ji;
function Ia() {
  const t = {}, e = Object.keys(Jt);
  for (let r = e.length, n = 0; n < r; n++)
    t[e[n]] = {
      // http://jsperf.com/1-vs-infinity
      // micro-opt, but this is simple.
      distance: -1,
      parent: null
    };
  return t;
}
function Ra(t) {
  const e = Ia(), r = [t];
  for (e[t].distance = 0; r.length; ) {
    const n = r.pop(), o = Object.keys(Jt[n]);
    for (let c = o.length, u = 0; u < c; u++) {
      const i = o[u], l = e[i];
      l.distance === -1 && (l.distance = e[n].distance + 1, l.parent = n, r.unshift(i));
    }
  }
  return e;
}
function Ca(t, e) {
  return function(r) {
    return e(t(r));
  };
}
function Na(t, e) {
  const r = [e[t].parent, t];
  let n = Jt[e[t].parent][t], o = e[t].parent;
  for (; e[o].parent; )
    r.unshift(e[o].parent), n = Ca(Jt[e[o].parent][o], n), o = e[o].parent;
  return n.conversion = r, n;
}
var Oa = function(t) {
  const e = Ra(t), r = {}, n = Object.keys(e);
  for (let o = n.length, c = 0; c < o; c++) {
    const u = n[c];
    e[u].parent !== null && (r[u] = Na(u, e));
  }
  return r;
};
const un = Ji, Da = Oa, mt = {}, Pa = Object.keys(un);
function Fa(t) {
  const e = function(...r) {
    const n = r[0];
    return n == null ? n : (n.length > 1 && (r = n), t(r));
  };
  return "conversion" in t && (e.conversion = t.conversion), e;
}
function Ba(t) {
  const e = function(...r) {
    const n = r[0];
    if (n == null)
      return n;
    n.length > 1 && (r = n);
    const o = t(r);
    if (typeof o == "object")
      for (let c = o.length, u = 0; u < c; u++)
        o[u] = Math.round(o[u]);
    return o;
  };
  return "conversion" in t && (e.conversion = t.conversion), e;
}
Pa.forEach((t) => {
  mt[t] = {}, Object.defineProperty(mt[t], "channels", { value: un[t].channels }), Object.defineProperty(mt[t], "labels", { value: un[t].labels });
  const e = Da(t);
  Object.keys(e).forEach((n) => {
    const o = e[n];
    mt[t][n] = Ba(o), mt[t][n].raw = Fa(o);
  });
});
var La = mt;
const wt = Sa, Fe = La, Qi = [
  // To be honest, I don't really feel like keyword belongs in color convert, but eh.
  "keyword",
  // Gray conflicts with some method names, and has its own method defined.
  "gray",
  // Shouldn't really be in color-convert either...
  "hex"
], cn = {};
for (const t of Object.keys(Fe))
  cn[[...Fe[t].labels].sort().join("")] = t;
const Qt = {};
function Re(t, e) {
  if (!(this instanceof Re))
    return new Re(t, e);
  if (e && e in Qi && (e = null), e && !(e in Fe))
    throw new Error("Unknown model: " + e);
  let r, n;
  if (t == null)
    this.model = "rgb", this.color = [0, 0, 0], this.valpha = 1;
  else if (t instanceof Re)
    this.model = t.model, this.color = [...t.color], this.valpha = t.valpha;
  else if (typeof t == "string") {
    const o = wt.get(t);
    if (o === null)
      throw new Error("Unable to parse color from string: " + t);
    this.model = o.model, n = Fe[this.model].channels, this.color = o.value.slice(0, n), this.valpha = typeof o.value[n] == "number" ? o.value[n] : 1;
  } else if (t.length > 0) {
    this.model = e || "rgb", n = Fe[this.model].channels;
    const o = Array.prototype.slice.call(t, 0, n);
    this.color = ln(o, n), this.valpha = typeof t[n] == "number" ? t[n] : 1;
  } else if (typeof t == "number")
    this.model = "rgb", this.color = [
      t >> 16 & 255,
      t >> 8 & 255,
      t & 255
    ], this.valpha = 1;
  else {
    this.valpha = 1;
    const o = Object.keys(t);
    "alpha" in t && (o.splice(o.indexOf("alpha"), 1), this.valpha = typeof t.alpha == "number" ? t.alpha : 0);
    const c = o.sort().join("");
    if (!(c in cn))
      throw new Error("Unable to parse color from object: " + JSON.stringify(t));
    this.model = cn[c];
    const { labels: u } = Fe[this.model], i = [];
    for (r = 0; r < u.length; r++)
      i.push(t[u[r]]);
    this.color = ln(i);
  }
  if (Qt[this.model])
    for (n = Fe[this.model].channels, r = 0; r < n; r++) {
      const o = Qt[this.model][r];
      o && (this.color[r] = o(this.color[r]));
    }
  this.valpha = Math.max(0, Math.min(1, this.valpha)), Object.freeze && Object.freeze(this);
}
Re.prototype = {
  toString() {
    return this.string();
  },
  toJSON() {
    return this[this.model]();
  },
  string(t) {
    let e = this.model in wt.to ? this : this.rgb();
    e = e.round(typeof t == "number" ? t : 1);
    const r = e.valpha === 1 ? e.color : [...e.color, this.valpha];
    return wt.to[e.model](r);
  },
  percentString(t) {
    const e = this.rgb().round(typeof t == "number" ? t : 1), r = e.valpha === 1 ? e.color : [...e.color, this.valpha];
    return wt.to.rgb.percent(r);
  },
  array() {
    return this.valpha === 1 ? [...this.color] : [...this.color, this.valpha];
  },
  object() {
    const t = {}, { channels: e } = Fe[this.model], { labels: r } = Fe[this.model];
    for (let n = 0; n < e; n++)
      t[r[n]] = this.color[n];
    return this.valpha !== 1 && (t.alpha = this.valpha), t;
  },
  unitArray() {
    const t = this.rgb().color;
    return t[0] /= 255, t[1] /= 255, t[2] /= 255, this.valpha !== 1 && t.push(this.valpha), t;
  },
  unitObject() {
    const t = this.rgb().object();
    return t.r /= 255, t.g /= 255, t.b /= 255, this.valpha !== 1 && (t.alpha = this.valpha), t;
  },
  round(t) {
    return t = Math.max(t || 0, 0), new Re([...this.color.map(Ua(t)), this.valpha], this.model);
  },
  alpha(t) {
    return t !== void 0 ? new Re([...this.color, Math.max(0, Math.min(1, t))], this.model) : this.valpha;
  },
  // Rgb
  red: Ee("rgb", 0, ke(255)),
  green: Ee("rgb", 1, ke(255)),
  blue: Ee("rgb", 2, ke(255)),
  hue: Ee(["hsl", "hsv", "hsl", "hwb", "hcg"], 0, (t) => (t % 360 + 360) % 360),
  saturationl: Ee("hsl", 1, ke(100)),
  lightness: Ee("hsl", 2, ke(100)),
  saturationv: Ee("hsv", 1, ke(100)),
  value: Ee("hsv", 2, ke(100)),
  chroma: Ee("hcg", 1, ke(100)),
  gray: Ee("hcg", 2, ke(100)),
  white: Ee("hwb", 1, ke(100)),
  wblack: Ee("hwb", 2, ke(100)),
  cyan: Ee("cmyk", 0, ke(100)),
  magenta: Ee("cmyk", 1, ke(100)),
  yellow: Ee("cmyk", 2, ke(100)),
  black: Ee("cmyk", 3, ke(100)),
  x: Ee("xyz", 0, ke(95.047)),
  y: Ee("xyz", 1, ke(100)),
  z: Ee("xyz", 2, ke(108.833)),
  l: Ee("lab", 0, ke(100)),
  a: Ee("lab", 1),
  b: Ee("lab", 2),
  keyword(t) {
    return t !== void 0 ? new Re(t) : Fe[this.model].keyword(this.color);
  },
  hex(t) {
    return t !== void 0 ? new Re(t) : wt.to.hex(this.rgb().round().color);
  },
  hexa(t) {
    if (t !== void 0)
      return new Re(t);
    const e = this.rgb().round().color;
    let r = Math.round(this.valpha * 255).toString(16).toUpperCase();
    return r.length === 1 && (r = "0" + r), wt.to.hex(e) + r;
  },
  rgbNumber() {
    const t = this.rgb().color;
    return (t[0] & 255) << 16 | (t[1] & 255) << 8 | t[2] & 255;
  },
  luminosity() {
    const t = this.rgb().color, e = [];
    for (const [r, n] of t.entries()) {
      const o = n / 255;
      e[r] = o <= 0.04045 ? o / 12.92 : ((o + 0.055) / 1.055) ** 2.4;
    }
    return 0.2126 * e[0] + 0.7152 * e[1] + 0.0722 * e[2];
  },
  contrast(t) {
    const e = this.luminosity(), r = t.luminosity();
    return e > r ? (e + 0.05) / (r + 0.05) : (r + 0.05) / (e + 0.05);
  },
  level(t) {
    const e = this.contrast(t);
    return e >= 7 ? "AAA" : e >= 4.5 ? "AA" : "";
  },
  isDark() {
    const t = this.rgb().color;
    return (t[0] * 2126 + t[1] * 7152 + t[2] * 722) / 1e4 < 128;
  },
  isLight() {
    return !this.isDark();
  },
  negate() {
    const t = this.rgb();
    for (let e = 0; e < 3; e++)
      t.color[e] = 255 - t.color[e];
    return t;
  },
  lighten(t) {
    const e = this.hsl();
    return e.color[2] += e.color[2] * t, e;
  },
  darken(t) {
    const e = this.hsl();
    return e.color[2] -= e.color[2] * t, e;
  },
  saturate(t) {
    const e = this.hsl();
    return e.color[1] += e.color[1] * t, e;
  },
  desaturate(t) {
    const e = this.hsl();
    return e.color[1] -= e.color[1] * t, e;
  },
  whiten(t) {
    const e = this.hwb();
    return e.color[1] += e.color[1] * t, e;
  },
  blacken(t) {
    const e = this.hwb();
    return e.color[2] += e.color[2] * t, e;
  },
  grayscale() {
    const t = this.rgb().color, e = t[0] * 0.3 + t[1] * 0.59 + t[2] * 0.11;
    return Re.rgb(e, e, e);
  },
  fade(t) {
    return this.alpha(this.valpha - this.valpha * t);
  },
  opaquer(t) {
    return this.alpha(this.valpha + this.valpha * t);
  },
  rotate(t) {
    const e = this.hsl();
    let r = e.color[0];
    return r = (r + t) % 360, r = r < 0 ? 360 + r : r, e.color[0] = r, e;
  },
  mix(t, e) {
    if (!t || !t.rgb)
      throw new Error('Argument to "mix" was not a Color instance, but rather an instance of ' + typeof t);
    const r = t.rgb(), n = this.rgb(), o = e === void 0 ? 0.5 : e, c = 2 * o - 1, u = r.alpha() - n.alpha(), i = ((c * u === -1 ? c : (c + u) / (1 + c * u)) + 1) / 2, l = 1 - i;
    return Re.rgb(
      i * r.red() + l * n.red(),
      i * r.green() + l * n.green(),
      i * r.blue() + l * n.blue(),
      r.alpha() * o + n.alpha() * (1 - o)
    );
  }
};
for (const t of Object.keys(Fe)) {
  if (Qi.includes(t))
    continue;
  const { channels: e } = Fe[t];
  Re.prototype[t] = function(...r) {
    return this.model === t ? new Re(this) : r.length > 0 ? new Re(r, t) : new Re([...za(Fe[this.model][t].raw(this.color)), this.valpha], t);
  }, Re[t] = function(...r) {
    let n = r[0];
    return typeof n == "number" && (n = ln(r, e)), new Re(n, t);
  };
}
function Ma(t, e) {
  return Number(t.toFixed(e));
}
function Ua(t) {
  return function(e) {
    return Ma(e, t);
  };
}
function Ee(t, e, r) {
  t = Array.isArray(t) ? t : [t];
  for (const n of t)
    (Qt[n] || (Qt[n] = []))[e] = r;
  return t = t[0], function(n) {
    let o;
    return n !== void 0 ? (r && (n = r(n)), o = this[t](), o.color[e] = n, o) : (o = this[t]().color[e], r && (o = r(o)), o);
  };
}
function ke(t) {
  return function(e) {
    return Math.max(0, Math.min(t, e));
  };
}
function za(t) {
  return Array.isArray(t) ? t : [t];
}
function ln(t, e) {
  for (let r = 0; r < e; r++)
    typeof t[r] != "number" && (t[r] = 0);
  return t;
}
var ja = Re;
const Kn = /* @__PURE__ */ va(ja);
var Ha = Object.defineProperty, Wa = (t, e, r) => e in t ? Ha(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r, X = (t, e, r) => (Wa(t, typeof e != "symbol" ? e + "" : e, r), r);
class er {
  constructor(e) {
    X(this, "rootKey"), this.rootKey = e;
  }
}
const Ga = Object.seal({});
class q extends er {
  constructor(e) {
    super(e), X(this, "root"), this.root = new Array();
  }
  // This method is called by the formatter to get the XML representation of this component.
  // It is called recursively for all child components.
  // It is a serializer to be used in the xml library.
  // https://www.npmjs.com/package/xml
  // Child components can override this method to customize the XML representation, or execute side effects.
  prepForXml(e) {
    var r;
    e.stack.push(this);
    const n = this.root.map((o) => o instanceof er ? o.prepForXml(e) : o).filter((o) => o !== void 0);
    return e.stack.pop(), {
      [this.rootKey]: n.length ? n.length === 1 && ((r = n[0]) != null && r._attr) ? n[0] : n : Ga
    };
  }
  addChildElement(e) {
    return this.root.push(e), this;
  }
}
class Je extends q {
  prepForXml(e) {
    const r = super.prepForXml(e);
    if (r && (typeof r[this.rootKey] != "object" || Object.keys(r[this.rootKey]).length))
      return r;
  }
}
class le extends er {
  constructor(e) {
    super("_attr"), X(this, "xmlKeys"), this.root = e;
  }
  prepForXml(e) {
    const r = {};
    return Object.keys(this.root).forEach((n) => {
      const o = this.root[n];
      if (o !== void 0) {
        const c = this.xmlKeys && this.xmlKeys[n] || n;
        r[c] = o;
      }
    }), { _attr: r };
  }
}
class $e extends er {
  constructor(e) {
    super("_attr"), this.root = e;
  }
  prepForXml(e) {
    return { _attr: Object.values(this.root).filter(({ value: n }) => n !== void 0).reduce((n, { key: o, value: c }) => ({ ...n, [o]: c }), {}) };
  }
}
class Ae extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", {
      val: "w:val",
      color: "w:color",
      fill: "w:fill",
      space: "w:space",
      sz: "w:sz",
      type: "w:type",
      rsidR: "w:rsidR",
      rsidRPr: "w:rsidRPr",
      rsidSect: "w:rsidSect",
      w: "w:w",
      h: "w:h",
      top: "w:top",
      right: "w:right",
      bottom: "w:bottom",
      left: "w:left",
      header: "w:header",
      footer: "w:footer",
      gutter: "w:gutter",
      linePitch: "w:linePitch",
      pos: "w:pos"
    });
  }
}
var je = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function _n(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var es = {}, xn = { exports: {} }, gt = typeof Reflect == "object" ? Reflect : null, qn = gt && typeof gt.apply == "function" ? gt.apply : function(e, r, n) {
  return Function.prototype.apply.call(e, r, n);
}, Xt;
gt && typeof gt.ownKeys == "function" ? Xt = gt.ownKeys : Object.getOwnPropertySymbols ? Xt = function(e) {
  return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e));
} : Xt = function(e) {
  return Object.getOwnPropertyNames(e);
};
function Ka(t) {
  console && console.warn && console.warn(t);
}
var ts = Number.isNaN || function(e) {
  return e !== e;
};
function _e() {
  _e.init.call(this);
}
xn.exports = _e;
xn.exports.once = Xa;
_e.EventEmitter = _e;
_e.prototype._events = void 0;
_e.prototype._eventsCount = 0;
_e.prototype._maxListeners = void 0;
var Vn = 10;
function ir(t) {
  if (typeof t != "function")
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof t);
}
Object.defineProperty(_e, "defaultMaxListeners", {
  enumerable: !0,
  get: function() {
    return Vn;
  },
  set: function(t) {
    if (typeof t != "number" || t < 0 || ts(t))
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + t + ".");
    Vn = t;
  }
});
_e.init = function() {
  (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) && (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0;
};
_e.prototype.setMaxListeners = function(e) {
  if (typeof e != "number" || e < 0 || ts(e))
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + e + ".");
  return this._maxListeners = e, this;
};
function rs(t) {
  return t._maxListeners === void 0 ? _e.defaultMaxListeners : t._maxListeners;
}
_e.prototype.getMaxListeners = function() {
  return rs(this);
};
_e.prototype.emit = function(e) {
  for (var r = [], n = 1; n < arguments.length; n++)
    r.push(arguments[n]);
  var o = e === "error", c = this._events;
  if (c !== void 0)
    o = o && c.error === void 0;
  else if (!o)
    return !1;
  if (o) {
    var u;
    if (r.length > 0 && (u = r[0]), u instanceof Error)
      throw u;
    var i = new Error("Unhandled error." + (u ? " (" + u.message + ")" : ""));
    throw i.context = u, i;
  }
  var l = c[e];
  if (l === void 0)
    return !1;
  if (typeof l == "function")
    qn(l, this, r);
  else
    for (var b = l.length, E = os(l, b), n = 0; n < b; ++n)
      qn(E[n], this, r);
  return !0;
};
function ns(t, e, r, n) {
  var o, c, u;
  if (ir(r), c = t._events, c === void 0 ? (c = t._events = /* @__PURE__ */ Object.create(null), t._eventsCount = 0) : (c.newListener !== void 0 && (t.emit(
    "newListener",
    e,
    r.listener ? r.listener : r
  ), c = t._events), u = c[e]), u === void 0)
    u = c[e] = r, ++t._eventsCount;
  else if (typeof u == "function" ? u = c[e] = n ? [r, u] : [u, r] : n ? u.unshift(r) : u.push(r), o = rs(t), o > 0 && u.length > o && !u.warned) {
    u.warned = !0;
    var i = new Error("Possible EventEmitter memory leak detected. " + u.length + " " + String(e) + " listeners added. Use emitter.setMaxListeners() to increase limit");
    i.name = "MaxListenersExceededWarning", i.emitter = t, i.type = e, i.count = u.length, Ka(i);
  }
  return t;
}
_e.prototype.addListener = function(e, r) {
  return ns(this, e, r, !1);
};
_e.prototype.on = _e.prototype.addListener;
_e.prototype.prependListener = function(e, r) {
  return ns(this, e, r, !0);
};
function qa() {
  if (!this.fired)
    return this.target.removeListener(this.type, this.wrapFn), this.fired = !0, arguments.length === 0 ? this.listener.call(this.target) : this.listener.apply(this.target, arguments);
}
function is(t, e, r) {
  var n = { fired: !1, wrapFn: void 0, target: t, type: e, listener: r }, o = qa.bind(n);
  return o.listener = r, n.wrapFn = o, o;
}
_e.prototype.once = function(e, r) {
  return ir(r), this.on(e, is(this, e, r)), this;
};
_e.prototype.prependOnceListener = function(e, r) {
  return ir(r), this.prependListener(e, is(this, e, r)), this;
};
_e.prototype.removeListener = function(e, r) {
  var n, o, c, u, i;
  if (ir(r), o = this._events, o === void 0)
    return this;
  if (n = o[e], n === void 0)
    return this;
  if (n === r || n.listener === r)
    --this._eventsCount === 0 ? this._events = /* @__PURE__ */ Object.create(null) : (delete o[e], o.removeListener && this.emit("removeListener", e, n.listener || r));
  else if (typeof n != "function") {
    for (c = -1, u = n.length - 1; u >= 0; u--)
      if (n[u] === r || n[u].listener === r) {
        i = n[u].listener, c = u;
        break;
      }
    if (c < 0)
      return this;
    c === 0 ? n.shift() : Va(n, c), n.length === 1 && (o[e] = n[0]), o.removeListener !== void 0 && this.emit("removeListener", e, i || r);
  }
  return this;
};
_e.prototype.off = _e.prototype.removeListener;
_e.prototype.removeAllListeners = function(e) {
  var r, n, o;
  if (n = this._events, n === void 0)
    return this;
  if (n.removeListener === void 0)
    return arguments.length === 0 ? (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0) : n[e] !== void 0 && (--this._eventsCount === 0 ? this._events = /* @__PURE__ */ Object.create(null) : delete n[e]), this;
  if (arguments.length === 0) {
    var c = Object.keys(n), u;
    for (o = 0; o < c.length; ++o)
      u = c[o], u !== "removeListener" && this.removeAllListeners(u);
    return this.removeAllListeners("removeListener"), this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0, this;
  }
  if (r = n[e], typeof r == "function")
    this.removeListener(e, r);
  else if (r !== void 0)
    for (o = r.length - 1; o >= 0; o--)
      this.removeListener(e, r[o]);
  return this;
};
function ss(t, e, r) {
  var n = t._events;
  if (n === void 0)
    return [];
  var o = n[e];
  return o === void 0 ? [] : typeof o == "function" ? r ? [o.listener || o] : [o] : r ? $a(o) : os(o, o.length);
}
_e.prototype.listeners = function(e) {
  return ss(this, e, !0);
};
_e.prototype.rawListeners = function(e) {
  return ss(this, e, !1);
};
_e.listenerCount = function(t, e) {
  return typeof t.listenerCount == "function" ? t.listenerCount(e) : as.call(t, e);
};
_e.prototype.listenerCount = as;
function as(t) {
  var e = this._events;
  if (e !== void 0) {
    var r = e[t];
    if (typeof r == "function")
      return 1;
    if (r !== void 0)
      return r.length;
  }
  return 0;
}
_e.prototype.eventNames = function() {
  return this._eventsCount > 0 ? Xt(this._events) : [];
};
function os(t, e) {
  for (var r = new Array(e), n = 0; n < e; ++n)
    r[n] = t[n];
  return r;
}
function Va(t, e) {
  for (; e + 1 < t.length; e++)
    t[e] = t[e + 1];
  t.pop();
}
function $a(t) {
  for (var e = new Array(t.length), r = 0; r < e.length; ++r)
    e[r] = t[r].listener || t[r];
  return e;
}
function Xa(t, e) {
  return new Promise(function(r, n) {
    function o(u) {
      t.removeListener(e, c), n(u);
    }
    function c() {
      typeof t.removeListener == "function" && t.removeListener("error", o), r([].slice.call(arguments));
    }
    us(t, e, c, { once: !0 }), e !== "error" && Za(t, o, { once: !0 });
  });
}
function Za(t, e, r) {
  typeof t.on == "function" && us(t, "error", e, r);
}
function us(t, e, r, n) {
  if (typeof t.on == "function")
    n.once ? t.once(e, r) : t.on(e, r);
  else if (typeof t.addEventListener == "function")
    t.addEventListener(e, function o(c) {
      n.once && t.removeEventListener(e, o), r(c);
    });
  else
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof t);
}
var En = xn.exports, hn = { exports: {} };
typeof Object.create == "function" ? hn.exports = function(e, r) {
  r && (e.super_ = r, e.prototype = Object.create(r.prototype, {
    constructor: {
      value: e,
      enumerable: !1,
      writable: !0,
      configurable: !0
    }
  }));
} : hn.exports = function(e, r) {
  if (r) {
    e.super_ = r;
    var n = function() {
    };
    n.prototype = r.prototype, e.prototype = new n(), e.prototype.constructor = e;
  }
};
var ht = hn.exports, mr = {}, Ct = {}, $n;
function Ya() {
  if ($n)
    return Ct;
  $n = 1, Ct.byteLength = i, Ct.toByteArray = b, Ct.fromByteArray = A;
  for (var t = [], e = [], r = typeof Uint8Array < "u" ? Uint8Array : Array, n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", o = 0, c = n.length; o < c; ++o)
    t[o] = n[o], e[n.charCodeAt(o)] = o;
  e["-".charCodeAt(0)] = 62, e["_".charCodeAt(0)] = 63;
  function u(m) {
    var v = m.length;
    if (v % 4 > 0)
      throw new Error("Invalid string. Length must be a multiple of 4");
    var y = m.indexOf("=");
    y === -1 && (y = v);
    var S = y === v ? 0 : 4 - y % 4;
    return [y, S];
  }
  function i(m) {
    var v = u(m), y = v[0], S = v[1];
    return (y + S) * 3 / 4 - S;
  }
  function l(m, v, y) {
    return (v + y) * 3 / 4 - y;
  }
  function b(m) {
    var v, y = u(m), S = y[0], g = y[1], x = new r(l(m, S, g)), R = 0, D = g > 0 ? S - 4 : S, L;
    for (L = 0; L < D; L += 4)
      v = e[m.charCodeAt(L)] << 18 | e[m.charCodeAt(L + 1)] << 12 | e[m.charCodeAt(L + 2)] << 6 | e[m.charCodeAt(L + 3)], x[R++] = v >> 16 & 255, x[R++] = v >> 8 & 255, x[R++] = v & 255;
    return g === 2 && (v = e[m.charCodeAt(L)] << 2 | e[m.charCodeAt(L + 1)] >> 4, x[R++] = v & 255), g === 1 && (v = e[m.charCodeAt(L)] << 10 | e[m.charCodeAt(L + 1)] << 4 | e[m.charCodeAt(L + 2)] >> 2, x[R++] = v >> 8 & 255, x[R++] = v & 255), x;
  }
  function E(m) {
    return t[m >> 18 & 63] + t[m >> 12 & 63] + t[m >> 6 & 63] + t[m & 63];
  }
  function T(m, v, y) {
    for (var S, g = [], x = v; x < y; x += 3)
      S = (m[x] << 16 & 16711680) + (m[x + 1] << 8 & 65280) + (m[x + 2] & 255), g.push(E(S));
    return g.join("");
  }
  function A(m) {
    for (var v, y = m.length, S = y % 3, g = [], x = 16383, R = 0, D = y - S; R < D; R += x)
      g.push(T(m, R, R + x > D ? D : R + x));
    return S === 1 ? (v = m[y - 1], g.push(
      t[v >> 2] + t[v << 4 & 63] + "=="
    )) : S === 2 && (v = (m[y - 2] << 8) + m[y - 1], g.push(
      t[v >> 10] + t[v >> 4 & 63] + t[v << 2 & 63] + "="
    )), g.join("");
  }
  return Ct;
}
var Kt = {};
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
var Xn;
function Ja() {
  return Xn || (Xn = 1, Kt.read = function(t, e, r, n, o) {
    var c, u, i = o * 8 - n - 1, l = (1 << i) - 1, b = l >> 1, E = -7, T = r ? o - 1 : 0, A = r ? -1 : 1, m = t[e + T];
    for (T += A, c = m & (1 << -E) - 1, m >>= -E, E += i; E > 0; c = c * 256 + t[e + T], T += A, E -= 8)
      ;
    for (u = c & (1 << -E) - 1, c >>= -E, E += n; E > 0; u = u * 256 + t[e + T], T += A, E -= 8)
      ;
    if (c === 0)
      c = 1 - b;
    else {
      if (c === l)
        return u ? NaN : (m ? -1 : 1) * (1 / 0);
      u = u + Math.pow(2, n), c = c - b;
    }
    return (m ? -1 : 1) * u * Math.pow(2, c - n);
  }, Kt.write = function(t, e, r, n, o, c) {
    var u, i, l, b = c * 8 - o - 1, E = (1 << b) - 1, T = E >> 1, A = o === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, m = n ? 0 : c - 1, v = n ? 1 : -1, y = e < 0 || e === 0 && 1 / e < 0 ? 1 : 0;
    for (e = Math.abs(e), isNaN(e) || e === 1 / 0 ? (i = isNaN(e) ? 1 : 0, u = E) : (u = Math.floor(Math.log(e) / Math.LN2), e * (l = Math.pow(2, -u)) < 1 && (u--, l *= 2), u + T >= 1 ? e += A / l : e += A * Math.pow(2, 1 - T), e * l >= 2 && (u++, l /= 2), u + T >= E ? (i = 0, u = E) : u + T >= 1 ? (i = (e * l - 1) * Math.pow(2, o), u = u + T) : (i = e * Math.pow(2, T - 1) * Math.pow(2, o), u = 0)); o >= 8; t[r + m] = i & 255, m += v, i /= 256, o -= 8)
      ;
    for (u = u << o | i, b += o; b > 0; t[r + m] = u & 255, m += v, u /= 256, b -= 8)
      ;
    t[r + m - v] |= y * 128;
  }), Kt;
}
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
var Zn;
function Lt() {
  return Zn || (Zn = 1, function(t) {
    var e = Ya(), r = Ja(), n = typeof Symbol == "function" && typeof Symbol.for == "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
    t.Buffer = i, t.SlowBuffer = x, t.INSPECT_MAX_BYTES = 50;
    var o = 2147483647;
    t.kMaxLength = o, i.TYPED_ARRAY_SUPPORT = c(), !i.TYPED_ARRAY_SUPPORT && typeof console < "u" && typeof console.error == "function" && console.error(
      "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
    );
    function c() {
      try {
        var w = new Uint8Array(1), s = { foo: function() {
          return 42;
        } };
        return Object.setPrototypeOf(s, Uint8Array.prototype), Object.setPrototypeOf(w, s), w.foo() === 42;
      } catch {
        return !1;
      }
    }
    Object.defineProperty(i.prototype, "parent", {
      enumerable: !0,
      get: function() {
        if (i.isBuffer(this))
          return this.buffer;
      }
    }), Object.defineProperty(i.prototype, "offset", {
      enumerable: !0,
      get: function() {
        if (i.isBuffer(this))
          return this.byteOffset;
      }
    });
    function u(w) {
      if (w > o)
        throw new RangeError('The value "' + w + '" is invalid for option "size"');
      var s = new Uint8Array(w);
      return Object.setPrototypeOf(s, i.prototype), s;
    }
    function i(w, s, a) {
      if (typeof w == "number") {
        if (typeof s == "string")
          throw new TypeError(
            'The "string" argument must be of type string. Received type number'
          );
        return T(w);
      }
      return l(w, s, a);
    }
    i.poolSize = 8192;
    function l(w, s, a) {
      if (typeof w == "string")
        return A(w, s);
      if (ArrayBuffer.isView(w))
        return v(w);
      if (w == null)
        throw new TypeError(
          "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof w
        );
      if (Z(w, ArrayBuffer) || w && Z(w.buffer, ArrayBuffer) || typeof SharedArrayBuffer < "u" && (Z(w, SharedArrayBuffer) || w && Z(w.buffer, SharedArrayBuffer)))
        return y(w, s, a);
      if (typeof w == "number")
        throw new TypeError(
          'The "value" argument must not be of type number. Received type number'
        );
      var h = w.valueOf && w.valueOf();
      if (h != null && h !== w)
        return i.from(h, s, a);
      var O = S(w);
      if (O)
        return O;
      if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof w[Symbol.toPrimitive] == "function")
        return i.from(
          w[Symbol.toPrimitive]("string"),
          s,
          a
        );
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof w
      );
    }
    i.from = function(w, s, a) {
      return l(w, s, a);
    }, Object.setPrototypeOf(i.prototype, Uint8Array.prototype), Object.setPrototypeOf(i, Uint8Array);
    function b(w) {
      if (typeof w != "number")
        throw new TypeError('"size" argument must be of type number');
      if (w < 0)
        throw new RangeError('The value "' + w + '" is invalid for option "size"');
    }
    function E(w, s, a) {
      return b(w), w <= 0 ? u(w) : s !== void 0 ? typeof a == "string" ? u(w).fill(s, a) : u(w).fill(s) : u(w);
    }
    i.alloc = function(w, s, a) {
      return E(w, s, a);
    };
    function T(w) {
      return b(w), u(w < 0 ? 0 : g(w) | 0);
    }
    i.allocUnsafe = function(w) {
      return T(w);
    }, i.allocUnsafeSlow = function(w) {
      return T(w);
    };
    function A(w, s) {
      if ((typeof s != "string" || s === "") && (s = "utf8"), !i.isEncoding(s))
        throw new TypeError("Unknown encoding: " + s);
      var a = R(w, s) | 0, h = u(a), O = h.write(w, s);
      return O !== a && (h = h.slice(0, O)), h;
    }
    function m(w) {
      for (var s = w.length < 0 ? 0 : g(w.length) | 0, a = u(s), h = 0; h < s; h += 1)
        a[h] = w[h] & 255;
      return a;
    }
    function v(w) {
      if (Z(w, Uint8Array)) {
        var s = new Uint8Array(w);
        return y(s.buffer, s.byteOffset, s.byteLength);
      }
      return m(w);
    }
    function y(w, s, a) {
      if (s < 0 || w.byteLength < s)
        throw new RangeError('"offset" is outside of buffer bounds');
      if (w.byteLength < s + (a || 0))
        throw new RangeError('"length" is outside of buffer bounds');
      var h;
      return s === void 0 && a === void 0 ? h = new Uint8Array(w) : a === void 0 ? h = new Uint8Array(w, s) : h = new Uint8Array(w, s, a), Object.setPrototypeOf(h, i.prototype), h;
    }
    function S(w) {
      if (i.isBuffer(w)) {
        var s = g(w.length) | 0, a = u(s);
        return a.length === 0 || w.copy(a, 0, 0, s), a;
      }
      if (w.length !== void 0)
        return typeof w.length != "number" || f(w.length) ? u(0) : m(w);
      if (w.type === "Buffer" && Array.isArray(w.data))
        return m(w.data);
    }
    function g(w) {
      if (w >= o)
        throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + o.toString(16) + " bytes");
      return w | 0;
    }
    function x(w) {
      return +w != w && (w = 0), i.alloc(+w);
    }
    i.isBuffer = function(s) {
      return s != null && s._isBuffer === !0 && s !== i.prototype;
    }, i.compare = function(s, a) {
      if (Z(s, Uint8Array) && (s = i.from(s, s.offset, s.byteLength)), Z(a, Uint8Array) && (a = i.from(a, a.offset, a.byteLength)), !i.isBuffer(s) || !i.isBuffer(a))
        throw new TypeError(
          'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
        );
      if (s === a)
        return 0;
      for (var h = s.length, O = a.length, U = 0, B = Math.min(h, O); U < B; ++U)
        if (s[U] !== a[U]) {
          h = s[U], O = a[U];
          break;
        }
      return h < O ? -1 : O < h ? 1 : 0;
    }, i.isEncoding = function(s) {
      switch (String(s).toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "latin1":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return !0;
        default:
          return !1;
      }
    }, i.concat = function(s, a) {
      if (!Array.isArray(s))
        throw new TypeError('"list" argument must be an Array of Buffers');
      if (s.length === 0)
        return i.alloc(0);
      var h;
      if (a === void 0)
        for (a = 0, h = 0; h < s.length; ++h)
          a += s[h].length;
      var O = i.allocUnsafe(a), U = 0;
      for (h = 0; h < s.length; ++h) {
        var B = s[h];
        if (Z(B, Uint8Array))
          U + B.length > O.length ? i.from(B).copy(O, U) : Uint8Array.prototype.set.call(
            O,
            B,
            U
          );
        else if (i.isBuffer(B))
          B.copy(O, U);
        else
          throw new TypeError('"list" argument must be an Array of Buffers');
        U += B.length;
      }
      return O;
    };
    function R(w, s) {
      if (i.isBuffer(w))
        return w.length;
      if (ArrayBuffer.isView(w) || Z(w, ArrayBuffer))
        return w.byteLength;
      if (typeof w != "string")
        throw new TypeError(
          'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof w
        );
      var a = w.length, h = arguments.length > 2 && arguments[2] === !0;
      if (!h && a === 0)
        return 0;
      for (var O = !1; ; )
        switch (s) {
          case "ascii":
          case "latin1":
          case "binary":
            return a;
          case "utf8":
          case "utf-8":
            return d(w).length;
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return a * 2;
          case "hex":
            return a >>> 1;
          case "base64":
            return I(w).length;
          default:
            if (O)
              return h ? -1 : d(w).length;
            s = ("" + s).toLowerCase(), O = !0;
        }
    }
    i.byteLength = R;
    function D(w, s, a) {
      var h = !1;
      if ((s === void 0 || s < 0) && (s = 0), s > this.length || ((a === void 0 || a > this.length) && (a = this.length), a <= 0) || (a >>>= 0, s >>>= 0, a <= s))
        return "";
      for (w || (w = "utf8"); ; )
        switch (w) {
          case "hex":
            return ne(this, s, a);
          case "utf8":
          case "utf-8":
            return _(this, s, a);
          case "ascii":
            return $(this, s, a);
          case "latin1":
          case "binary":
            return pe(this, s, a);
          case "base64":
            return K(this, s, a);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return he(this, s, a);
          default:
            if (h)
              throw new TypeError("Unknown encoding: " + w);
            w = (w + "").toLowerCase(), h = !0;
        }
    }
    i.prototype._isBuffer = !0;
    function L(w, s, a) {
      var h = w[s];
      w[s] = w[a], w[a] = h;
    }
    i.prototype.swap16 = function() {
      var s = this.length;
      if (s % 2 !== 0)
        throw new RangeError("Buffer size must be a multiple of 16-bits");
      for (var a = 0; a < s; a += 2)
        L(this, a, a + 1);
      return this;
    }, i.prototype.swap32 = function() {
      var s = this.length;
      if (s % 4 !== 0)
        throw new RangeError("Buffer size must be a multiple of 32-bits");
      for (var a = 0; a < s; a += 4)
        L(this, a, a + 3), L(this, a + 1, a + 2);
      return this;
    }, i.prototype.swap64 = function() {
      var s = this.length;
      if (s % 8 !== 0)
        throw new RangeError("Buffer size must be a multiple of 64-bits");
      for (var a = 0; a < s; a += 8)
        L(this, a, a + 7), L(this, a + 1, a + 6), L(this, a + 2, a + 5), L(this, a + 3, a + 4);
      return this;
    }, i.prototype.toString = function() {
      var s = this.length;
      return s === 0 ? "" : arguments.length === 0 ? _(this, 0, s) : D.apply(this, arguments);
    }, i.prototype.toLocaleString = i.prototype.toString, i.prototype.equals = function(s) {
      if (!i.isBuffer(s))
        throw new TypeError("Argument must be a Buffer");
      return this === s ? !0 : i.compare(this, s) === 0;
    }, i.prototype.inspect = function() {
      var s = "", a = t.INSPECT_MAX_BYTES;
      return s = this.toString("hex", 0, a).replace(/(.{2})/g, "$1 ").trim(), this.length > a && (s += " ... "), "<Buffer " + s + ">";
    }, n && (i.prototype[n] = i.prototype.inspect), i.prototype.compare = function(s, a, h, O, U) {
      if (Z(s, Uint8Array) && (s = i.from(s, s.offset, s.byteLength)), !i.isBuffer(s))
        throw new TypeError(
          'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof s
        );
      if (a === void 0 && (a = 0), h === void 0 && (h = s ? s.length : 0), O === void 0 && (O = 0), U === void 0 && (U = this.length), a < 0 || h > s.length || O < 0 || U > this.length)
        throw new RangeError("out of range index");
      if (O >= U && a >= h)
        return 0;
      if (O >= U)
        return -1;
      if (a >= h)
        return 1;
      if (a >>>= 0, h >>>= 0, O >>>= 0, U >>>= 0, this === s)
        return 0;
      for (var B = U - O, re = h - a, oe = Math.min(B, re), ie = this.slice(O, U), ce = s.slice(a, h), me = 0; me < oe; ++me)
        if (ie[me] !== ce[me]) {
          B = ie[me], re = ce[me];
          break;
        }
      return B < re ? -1 : re < B ? 1 : 0;
    };
    function Y(w, s, a, h, O) {
      if (w.length === 0)
        return -1;
      if (typeof a == "string" ? (h = a, a = 0) : a > 2147483647 ? a = 2147483647 : a < -2147483648 && (a = -2147483648), a = +a, f(a) && (a = O ? 0 : w.length - 1), a < 0 && (a = w.length + a), a >= w.length) {
        if (O)
          return -1;
        a = w.length - 1;
      } else if (a < 0)
        if (O)
          a = 0;
        else
          return -1;
      if (typeof s == "string" && (s = i.from(s, h)), i.isBuffer(s))
        return s.length === 0 ? -1 : G(w, s, a, h, O);
      if (typeof s == "number")
        return s = s & 255, typeof Uint8Array.prototype.indexOf == "function" ? O ? Uint8Array.prototype.indexOf.call(w, s, a) : Uint8Array.prototype.lastIndexOf.call(w, s, a) : G(w, [s], a, h, O);
      throw new TypeError("val must be string, number or Buffer");
    }
    function G(w, s, a, h, O) {
      var U = 1, B = w.length, re = s.length;
      if (h !== void 0 && (h = String(h).toLowerCase(), h === "ucs2" || h === "ucs-2" || h === "utf16le" || h === "utf-16le")) {
        if (w.length < 2 || s.length < 2)
          return -1;
        U = 2, B /= 2, re /= 2, a /= 2;
      }
      function oe(Pe, et) {
        return U === 1 ? Pe[et] : Pe.readUInt16BE(et * U);
      }
      var ie;
      if (O) {
        var ce = -1;
        for (ie = a; ie < B; ie++)
          if (oe(w, ie) === oe(s, ce === -1 ? 0 : ie - ce)) {
            if (ce === -1 && (ce = ie), ie - ce + 1 === re)
              return ce * U;
          } else
            ce !== -1 && (ie -= ie - ce), ce = -1;
      } else
        for (a + re > B && (a = B - re), ie = a; ie >= 0; ie--) {
          for (var me = !0, we = 0; we < re; we++)
            if (oe(w, ie + we) !== oe(s, we)) {
              me = !1;
              break;
            }
          if (me)
            return ie;
        }
      return -1;
    }
    i.prototype.includes = function(s, a, h) {
      return this.indexOf(s, a, h) !== -1;
    }, i.prototype.indexOf = function(s, a, h) {
      return Y(this, s, a, h, !0);
    }, i.prototype.lastIndexOf = function(s, a, h) {
      return Y(this, s, a, h, !1);
    };
    function Q(w, s, a, h) {
      a = Number(a) || 0;
      var O = w.length - a;
      h ? (h = Number(h), h > O && (h = O)) : h = O;
      var U = s.length;
      h > U / 2 && (h = U / 2);
      for (var B = 0; B < h; ++B) {
        var re = parseInt(s.substr(B * 2, 2), 16);
        if (f(re))
          return B;
        w[a + B] = re;
      }
      return B;
    }
    function k(w, s, a, h) {
      return N(d(s, w.length - a), w, a, h);
    }
    function se(w, s, a, h) {
      return N(M(s), w, a, h);
    }
    function ue(w, s, a, h) {
      return N(I(s), w, a, h);
    }
    function P(w, s, a, h) {
      return N(F(s, w.length - a), w, a, h);
    }
    i.prototype.write = function(s, a, h, O) {
      if (a === void 0)
        O = "utf8", h = this.length, a = 0;
      else if (h === void 0 && typeof a == "string")
        O = a, h = this.length, a = 0;
      else if (isFinite(a))
        a = a >>> 0, isFinite(h) ? (h = h >>> 0, O === void 0 && (O = "utf8")) : (O = h, h = void 0);
      else
        throw new Error(
          "Buffer.write(string, encoding, offset[, length]) is no longer supported"
        );
      var U = this.length - a;
      if ((h === void 0 || h > U) && (h = U), s.length > 0 && (h < 0 || a < 0) || a > this.length)
        throw new RangeError("Attempt to write outside buffer bounds");
      O || (O = "utf8");
      for (var B = !1; ; )
        switch (O) {
          case "hex":
            return Q(this, s, a, h);
          case "utf8":
          case "utf-8":
            return k(this, s, a, h);
          case "ascii":
          case "latin1":
          case "binary":
            return se(this, s, a, h);
          case "base64":
            return ue(this, s, a, h);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return P(this, s, a, h);
          default:
            if (B)
              throw new TypeError("Unknown encoding: " + O);
            O = ("" + O).toLowerCase(), B = !0;
        }
    }, i.prototype.toJSON = function() {
      return {
        type: "Buffer",
        data: Array.prototype.slice.call(this._arr || this, 0)
      };
    };
    function K(w, s, a) {
      return s === 0 && a === w.length ? e.fromByteArray(w) : e.fromByteArray(w.slice(s, a));
    }
    function _(w, s, a) {
      a = Math.min(w.length, a);
      for (var h = [], O = s; O < a; ) {
        var U = w[O], B = null, re = U > 239 ? 4 : U > 223 ? 3 : U > 191 ? 2 : 1;
        if (O + re <= a) {
          var oe, ie, ce, me;
          switch (re) {
            case 1:
              U < 128 && (B = U);
              break;
            case 2:
              oe = w[O + 1], (oe & 192) === 128 && (me = (U & 31) << 6 | oe & 63, me > 127 && (B = me));
              break;
            case 3:
              oe = w[O + 1], ie = w[O + 2], (oe & 192) === 128 && (ie & 192) === 128 && (me = (U & 15) << 12 | (oe & 63) << 6 | ie & 63, me > 2047 && (me < 55296 || me > 57343) && (B = me));
              break;
            case 4:
              oe = w[O + 1], ie = w[O + 2], ce = w[O + 3], (oe & 192) === 128 && (ie & 192) === 128 && (ce & 192) === 128 && (me = (U & 15) << 18 | (oe & 63) << 12 | (ie & 63) << 6 | ce & 63, me > 65535 && me < 1114112 && (B = me));
          }
        }
        B === null ? (B = 65533, re = 1) : B > 65535 && (B -= 65536, h.push(B >>> 10 & 1023 | 55296), B = 56320 | B & 1023), h.push(B), O += re;
      }
      return fe(h);
    }
    var J = 4096;
    function fe(w) {
      var s = w.length;
      if (s <= J)
        return String.fromCharCode.apply(String, w);
      for (var a = "", h = 0; h < s; )
        a += String.fromCharCode.apply(
          String,
          w.slice(h, h += J)
        );
      return a;
    }
    function $(w, s, a) {
      var h = "";
      a = Math.min(w.length, a);
      for (var O = s; O < a; ++O)
        h += String.fromCharCode(w[O] & 127);
      return h;
    }
    function pe(w, s, a) {
      var h = "";
      a = Math.min(w.length, a);
      for (var O = s; O < a; ++O)
        h += String.fromCharCode(w[O]);
      return h;
    }
    function ne(w, s, a) {
      var h = w.length;
      (!s || s < 0) && (s = 0), (!a || a < 0 || a > h) && (a = h);
      for (var O = "", U = s; U < a; ++U)
        O += V[w[U]];
      return O;
    }
    function he(w, s, a) {
      for (var h = w.slice(s, a), O = "", U = 0; U < h.length - 1; U += 2)
        O += String.fromCharCode(h[U] + h[U + 1] * 256);
      return O;
    }
    i.prototype.slice = function(s, a) {
      var h = this.length;
      s = ~~s, a = a === void 0 ? h : ~~a, s < 0 ? (s += h, s < 0 && (s = 0)) : s > h && (s = h), a < 0 ? (a += h, a < 0 && (a = 0)) : a > h && (a = h), a < s && (a = s);
      var O = this.subarray(s, a);
      return Object.setPrototypeOf(O, i.prototype), O;
    };
    function j(w, s, a) {
      if (w % 1 !== 0 || w < 0)
        throw new RangeError("offset is not uint");
      if (w + s > a)
        throw new RangeError("Trying to access beyond buffer length");
    }
    i.prototype.readUintLE = i.prototype.readUIntLE = function(s, a, h) {
      s = s >>> 0, a = a >>> 0, h || j(s, a, this.length);
      for (var O = this[s], U = 1, B = 0; ++B < a && (U *= 256); )
        O += this[s + B] * U;
      return O;
    }, i.prototype.readUintBE = i.prototype.readUIntBE = function(s, a, h) {
      s = s >>> 0, a = a >>> 0, h || j(s, a, this.length);
      for (var O = this[s + --a], U = 1; a > 0 && (U *= 256); )
        O += this[s + --a] * U;
      return O;
    }, i.prototype.readUint8 = i.prototype.readUInt8 = function(s, a) {
      return s = s >>> 0, a || j(s, 1, this.length), this[s];
    }, i.prototype.readUint16LE = i.prototype.readUInt16LE = function(s, a) {
      return s = s >>> 0, a || j(s, 2, this.length), this[s] | this[s + 1] << 8;
    }, i.prototype.readUint16BE = i.prototype.readUInt16BE = function(s, a) {
      return s = s >>> 0, a || j(s, 2, this.length), this[s] << 8 | this[s + 1];
    }, i.prototype.readUint32LE = i.prototype.readUInt32LE = function(s, a) {
      return s = s >>> 0, a || j(s, 4, this.length), (this[s] | this[s + 1] << 8 | this[s + 2] << 16) + this[s + 3] * 16777216;
    }, i.prototype.readUint32BE = i.prototype.readUInt32BE = function(s, a) {
      return s = s >>> 0, a || j(s, 4, this.length), this[s] * 16777216 + (this[s + 1] << 16 | this[s + 2] << 8 | this[s + 3]);
    }, i.prototype.readIntLE = function(s, a, h) {
      s = s >>> 0, a = a >>> 0, h || j(s, a, this.length);
      for (var O = this[s], U = 1, B = 0; ++B < a && (U *= 256); )
        O += this[s + B] * U;
      return U *= 128, O >= U && (O -= Math.pow(2, 8 * a)), O;
    }, i.prototype.readIntBE = function(s, a, h) {
      s = s >>> 0, a = a >>> 0, h || j(s, a, this.length);
      for (var O = a, U = 1, B = this[s + --O]; O > 0 && (U *= 256); )
        B += this[s + --O] * U;
      return U *= 128, B >= U && (B -= Math.pow(2, 8 * a)), B;
    }, i.prototype.readInt8 = function(s, a) {
      return s = s >>> 0, a || j(s, 1, this.length), this[s] & 128 ? (255 - this[s] + 1) * -1 : this[s];
    }, i.prototype.readInt16LE = function(s, a) {
      s = s >>> 0, a || j(s, 2, this.length);
      var h = this[s] | this[s + 1] << 8;
      return h & 32768 ? h | 4294901760 : h;
    }, i.prototype.readInt16BE = function(s, a) {
      s = s >>> 0, a || j(s, 2, this.length);
      var h = this[s + 1] | this[s] << 8;
      return h & 32768 ? h | 4294901760 : h;
    }, i.prototype.readInt32LE = function(s, a) {
      return s = s >>> 0, a || j(s, 4, this.length), this[s] | this[s + 1] << 8 | this[s + 2] << 16 | this[s + 3] << 24;
    }, i.prototype.readInt32BE = function(s, a) {
      return s = s >>> 0, a || j(s, 4, this.length), this[s] << 24 | this[s + 1] << 16 | this[s + 2] << 8 | this[s + 3];
    }, i.prototype.readFloatLE = function(s, a) {
      return s = s >>> 0, a || j(s, 4, this.length), r.read(this, s, !0, 23, 4);
    }, i.prototype.readFloatBE = function(s, a) {
      return s = s >>> 0, a || j(s, 4, this.length), r.read(this, s, !1, 23, 4);
    }, i.prototype.readDoubleLE = function(s, a) {
      return s = s >>> 0, a || j(s, 8, this.length), r.read(this, s, !0, 52, 8);
    }, i.prototype.readDoubleBE = function(s, a) {
      return s = s >>> 0, a || j(s, 8, this.length), r.read(this, s, !1, 52, 8);
    };
    function C(w, s, a, h, O, U) {
      if (!i.isBuffer(w))
        throw new TypeError('"buffer" argument must be a Buffer instance');
      if (s > O || s < U)
        throw new RangeError('"value" argument is out of bounds');
      if (a + h > w.length)
        throw new RangeError("Index out of range");
    }
    i.prototype.writeUintLE = i.prototype.writeUIntLE = function(s, a, h, O) {
      if (s = +s, a = a >>> 0, h = h >>> 0, !O) {
        var U = Math.pow(2, 8 * h) - 1;
        C(this, s, a, h, U, 0);
      }
      var B = 1, re = 0;
      for (this[a] = s & 255; ++re < h && (B *= 256); )
        this[a + re] = s / B & 255;
      return a + h;
    }, i.prototype.writeUintBE = i.prototype.writeUIntBE = function(s, a, h, O) {
      if (s = +s, a = a >>> 0, h = h >>> 0, !O) {
        var U = Math.pow(2, 8 * h) - 1;
        C(this, s, a, h, U, 0);
      }
      var B = h - 1, re = 1;
      for (this[a + B] = s & 255; --B >= 0 && (re *= 256); )
        this[a + B] = s / re & 255;
      return a + h;
    }, i.prototype.writeUint8 = i.prototype.writeUInt8 = function(s, a, h) {
      return s = +s, a = a >>> 0, h || C(this, s, a, 1, 255, 0), this[a] = s & 255, a + 1;
    }, i.prototype.writeUint16LE = i.prototype.writeUInt16LE = function(s, a, h) {
      return s = +s, a = a >>> 0, h || C(this, s, a, 2, 65535, 0), this[a] = s & 255, this[a + 1] = s >>> 8, a + 2;
    }, i.prototype.writeUint16BE = i.prototype.writeUInt16BE = function(s, a, h) {
      return s = +s, a = a >>> 0, h || C(this, s, a, 2, 65535, 0), this[a] = s >>> 8, this[a + 1] = s & 255, a + 2;
    }, i.prototype.writeUint32LE = i.prototype.writeUInt32LE = function(s, a, h) {
      return s = +s, a = a >>> 0, h || C(this, s, a, 4, 4294967295, 0), this[a + 3] = s >>> 24, this[a + 2] = s >>> 16, this[a + 1] = s >>> 8, this[a] = s & 255, a + 4;
    }, i.prototype.writeUint32BE = i.prototype.writeUInt32BE = function(s, a, h) {
      return s = +s, a = a >>> 0, h || C(this, s, a, 4, 4294967295, 0), this[a] = s >>> 24, this[a + 1] = s >>> 16, this[a + 2] = s >>> 8, this[a + 3] = s & 255, a + 4;
    }, i.prototype.writeIntLE = function(s, a, h, O) {
      if (s = +s, a = a >>> 0, !O) {
        var U = Math.pow(2, 8 * h - 1);
        C(this, s, a, h, U - 1, -U);
      }
      var B = 0, re = 1, oe = 0;
      for (this[a] = s & 255; ++B < h && (re *= 256); )
        s < 0 && oe === 0 && this[a + B - 1] !== 0 && (oe = 1), this[a + B] = (s / re >> 0) - oe & 255;
      return a + h;
    }, i.prototype.writeIntBE = function(s, a, h, O) {
      if (s = +s, a = a >>> 0, !O) {
        var U = Math.pow(2, 8 * h - 1);
        C(this, s, a, h, U - 1, -U);
      }
      var B = h - 1, re = 1, oe = 0;
      for (this[a + B] = s & 255; --B >= 0 && (re *= 256); )
        s < 0 && oe === 0 && this[a + B + 1] !== 0 && (oe = 1), this[a + B] = (s / re >> 0) - oe & 255;
      return a + h;
    }, i.prototype.writeInt8 = function(s, a, h) {
      return s = +s, a = a >>> 0, h || C(this, s, a, 1, 127, -128), s < 0 && (s = 255 + s + 1), this[a] = s & 255, a + 1;
    }, i.prototype.writeInt16LE = function(s, a, h) {
      return s = +s, a = a >>> 0, h || C(this, s, a, 2, 32767, -32768), this[a] = s & 255, this[a + 1] = s >>> 8, a + 2;
    }, i.prototype.writeInt16BE = function(s, a, h) {
      return s = +s, a = a >>> 0, h || C(this, s, a, 2, 32767, -32768), this[a] = s >>> 8, this[a + 1] = s & 255, a + 2;
    }, i.prototype.writeInt32LE = function(s, a, h) {
      return s = +s, a = a >>> 0, h || C(this, s, a, 4, 2147483647, -2147483648), this[a] = s & 255, this[a + 1] = s >>> 8, this[a + 2] = s >>> 16, this[a + 3] = s >>> 24, a + 4;
    }, i.prototype.writeInt32BE = function(s, a, h) {
      return s = +s, a = a >>> 0, h || C(this, s, a, 4, 2147483647, -2147483648), s < 0 && (s = 4294967295 + s + 1), this[a] = s >>> 24, this[a + 1] = s >>> 16, this[a + 2] = s >>> 8, this[a + 3] = s & 255, a + 4;
    };
    function H(w, s, a, h, O, U) {
      if (a + h > w.length)
        throw new RangeError("Index out of range");
      if (a < 0)
        throw new RangeError("Index out of range");
    }
    function W(w, s, a, h, O) {
      return s = +s, a = a >>> 0, O || H(w, s, a, 4), r.write(w, s, a, h, 23, 4), a + 4;
    }
    i.prototype.writeFloatLE = function(s, a, h) {
      return W(this, s, a, !0, h);
    }, i.prototype.writeFloatBE = function(s, a, h) {
      return W(this, s, a, !1, h);
    };
    function te(w, s, a, h, O) {
      return s = +s, a = a >>> 0, O || H(w, s, a, 8), r.write(w, s, a, h, 52, 8), a + 8;
    }
    i.prototype.writeDoubleLE = function(s, a, h) {
      return te(this, s, a, !0, h);
    }, i.prototype.writeDoubleBE = function(s, a, h) {
      return te(this, s, a, !1, h);
    }, i.prototype.copy = function(s, a, h, O) {
      if (!i.isBuffer(s))
        throw new TypeError("argument should be a Buffer");
      if (h || (h = 0), !O && O !== 0 && (O = this.length), a >= s.length && (a = s.length), a || (a = 0), O > 0 && O < h && (O = h), O === h || s.length === 0 || this.length === 0)
        return 0;
      if (a < 0)
        throw new RangeError("targetStart out of bounds");
      if (h < 0 || h >= this.length)
        throw new RangeError("Index out of range");
      if (O < 0)
        throw new RangeError("sourceEnd out of bounds");
      O > this.length && (O = this.length), s.length - a < O - h && (O = s.length - a + h);
      var U = O - h;
      return this === s && typeof Uint8Array.prototype.copyWithin == "function" ? this.copyWithin(a, h, O) : Uint8Array.prototype.set.call(
        s,
        this.subarray(h, O),
        a
      ), U;
    }, i.prototype.fill = function(s, a, h, O) {
      if (typeof s == "string") {
        if (typeof a == "string" ? (O = a, a = 0, h = this.length) : typeof h == "string" && (O = h, h = this.length), O !== void 0 && typeof O != "string")
          throw new TypeError("encoding must be a string");
        if (typeof O == "string" && !i.isEncoding(O))
          throw new TypeError("Unknown encoding: " + O);
        if (s.length === 1) {
          var U = s.charCodeAt(0);
          (O === "utf8" && U < 128 || O === "latin1") && (s = U);
        }
      } else
        typeof s == "number" ? s = s & 255 : typeof s == "boolean" && (s = Number(s));
      if (a < 0 || this.length < a || this.length < h)
        throw new RangeError("Out of range index");
      if (h <= a)
        return this;
      a = a >>> 0, h = h === void 0 ? this.length : h >>> 0, s || (s = 0);
      var B;
      if (typeof s == "number")
        for (B = a; B < h; ++B)
          this[B] = s;
      else {
        var re = i.isBuffer(s) ? s : i.from(s, O), oe = re.length;
        if (oe === 0)
          throw new TypeError('The value "' + s + '" is invalid for argument "value"');
        for (B = 0; B < h - a; ++B)
          this[B + a] = re[B % oe];
      }
      return this;
    };
    var z = /[^+/0-9A-Za-z-_]/g;
    function p(w) {
      if (w = w.split("=")[0], w = w.trim().replace(z, ""), w.length < 2)
        return "";
      for (; w.length % 4 !== 0; )
        w = w + "=";
      return w;
    }
    function d(w, s) {
      s = s || 1 / 0;
      for (var a, h = w.length, O = null, U = [], B = 0; B < h; ++B) {
        if (a = w.charCodeAt(B), a > 55295 && a < 57344) {
          if (!O) {
            if (a > 56319) {
              (s -= 3) > -1 && U.push(239, 191, 189);
              continue;
            } else if (B + 1 === h) {
              (s -= 3) > -1 && U.push(239, 191, 189);
              continue;
            }
            O = a;
            continue;
          }
          if (a < 56320) {
            (s -= 3) > -1 && U.push(239, 191, 189), O = a;
            continue;
          }
          a = (O - 55296 << 10 | a - 56320) + 65536;
        } else
          O && (s -= 3) > -1 && U.push(239, 191, 189);
        if (O = null, a < 128) {
          if ((s -= 1) < 0)
            break;
          U.push(a);
        } else if (a < 2048) {
          if ((s -= 2) < 0)
            break;
          U.push(
            a >> 6 | 192,
            a & 63 | 128
          );
        } else if (a < 65536) {
          if ((s -= 3) < 0)
            break;
          U.push(
            a >> 12 | 224,
            a >> 6 & 63 | 128,
            a & 63 | 128
          );
        } else if (a < 1114112) {
          if ((s -= 4) < 0)
            break;
          U.push(
            a >> 18 | 240,
            a >> 12 & 63 | 128,
            a >> 6 & 63 | 128,
            a & 63 | 128
          );
        } else
          throw new Error("Invalid code point");
      }
      return U;
    }
    function M(w) {
      for (var s = [], a = 0; a < w.length; ++a)
        s.push(w.charCodeAt(a) & 255);
      return s;
    }
    function F(w, s) {
      for (var a, h, O, U = [], B = 0; B < w.length && !((s -= 2) < 0); ++B)
        a = w.charCodeAt(B), h = a >> 8, O = a % 256, U.push(O), U.push(h);
      return U;
    }
    function I(w) {
      return e.toByteArray(p(w));
    }
    function N(w, s, a, h) {
      for (var O = 0; O < h && !(O + a >= s.length || O >= w.length); ++O)
        s[O + a] = w[O];
      return O;
    }
    function Z(w, s) {
      return w instanceof s || w != null && w.constructor != null && w.constructor.name != null && w.constructor.name === s.name;
    }
    function f(w) {
      return w !== w;
    }
    var V = function() {
      for (var w = "0123456789abcdef", s = new Array(256), a = 0; a < 16; ++a)
        for (var h = a * 16, O = 0; O < 16; ++O)
          s[h + O] = w[a] + w[O];
      return s;
    }();
  }(mr)), mr;
}
Lt();
var cs = { exports: {} }, Se = cs.exports = {}, Ge, Ke;
function fn() {
  throw new Error("setTimeout has not been defined");
}
function dn() {
  throw new Error("clearTimeout has not been defined");
}
(function() {
  try {
    typeof setTimeout == "function" ? Ge = setTimeout : Ge = fn;
  } catch {
    Ge = fn;
  }
  try {
    typeof clearTimeout == "function" ? Ke = clearTimeout : Ke = dn;
  } catch {
    Ke = dn;
  }
})();
function ls(t) {
  if (Ge === setTimeout)
    return setTimeout(t, 0);
  if ((Ge === fn || !Ge) && setTimeout)
    return Ge = setTimeout, setTimeout(t, 0);
  try {
    return Ge(t, 0);
  } catch {
    try {
      return Ge.call(null, t, 0);
    } catch {
      return Ge.call(this, t, 0);
    }
  }
}
function Qa(t) {
  if (Ke === clearTimeout)
    return clearTimeout(t);
  if ((Ke === dn || !Ke) && clearTimeout)
    return Ke = clearTimeout, clearTimeout(t);
  try {
    return Ke(t);
  } catch {
    try {
      return Ke.call(null, t);
    } catch {
      return Ke.call(this, t);
    }
  }
}
var Ze = [], yt = !1, ut, Zt = -1;
function eo() {
  !yt || !ut || (yt = !1, ut.length ? Ze = ut.concat(Ze) : Zt = -1, Ze.length && hs());
}
function hs() {
  if (!yt) {
    var t = ls(eo);
    yt = !0;
    for (var e = Ze.length; e; ) {
      for (ut = Ze, Ze = []; ++Zt < e; )
        ut && ut[Zt].run();
      Zt = -1, e = Ze.length;
    }
    ut = null, yt = !1, Qa(t);
  }
}
Se.nextTick = function(t) {
  var e = new Array(arguments.length - 1);
  if (arguments.length > 1)
    for (var r = 1; r < arguments.length; r++)
      e[r - 1] = arguments[r];
  Ze.push(new fs(t, e)), Ze.length === 1 && !yt && ls(hs);
};
function fs(t, e) {
  this.fun = t, this.array = e;
}
fs.prototype.run = function() {
  this.fun.apply(null, this.array);
};
Se.title = "browser";
Se.browser = !0;
Se.env = {};
Se.argv = [];
Se.version = "";
Se.versions = {};
function Qe() {
}
Se.on = Qe;
Se.addListener = Qe;
Se.once = Qe;
Se.off = Qe;
Se.removeListener = Qe;
Se.removeAllListeners = Qe;
Se.emit = Qe;
Se.prependListener = Qe;
Se.prependOnceListener = Qe;
Se.listeners = function(t) {
  return [];
};
Se.binding = function(t) {
  throw new Error("process.binding is not supported");
};
Se.cwd = function() {
  return "/";
};
Se.chdir = function(t) {
  throw new Error("process.chdir is not supported");
};
Se.umask = function() {
  return 0;
};
var to = cs.exports;
const ye = /* @__PURE__ */ _n(to);
(function(t) {
  function e() {
    var n = this || self;
    return delete t.prototype.__magic__, n;
  }
  if (typeof globalThis == "object")
    return globalThis;
  if (this)
    return e();
  t.defineProperty(t.prototype, "__magic__", {
    configurable: !0,
    get: e
  });
  var r = __magic__;
  return r;
})(Object);
var wr, Yn;
function ds() {
  return Yn || (Yn = 1, wr = En.EventEmitter), wr;
}
var gr = {}, yr = {}, br, Jn;
function ps() {
  return Jn || (Jn = 1, br = function() {
    if (typeof Symbol != "function" || typeof Object.getOwnPropertySymbols != "function")
      return !1;
    if (typeof Symbol.iterator == "symbol")
      return !0;
    var e = {}, r = Symbol("test"), n = Object(r);
    if (typeof r == "string" || Object.prototype.toString.call(r) !== "[object Symbol]" || Object.prototype.toString.call(n) !== "[object Symbol]")
      return !1;
    var o = 42;
    e[r] = o;
    for (r in e)
      return !1;
    if (typeof Object.keys == "function" && Object.keys(e).length !== 0 || typeof Object.getOwnPropertyNames == "function" && Object.getOwnPropertyNames(e).length !== 0)
      return !1;
    var c = Object.getOwnPropertySymbols(e);
    if (c.length !== 1 || c[0] !== r || !Object.prototype.propertyIsEnumerable.call(e, r))
      return !1;
    if (typeof Object.getOwnPropertyDescriptor == "function") {
      var u = Object.getOwnPropertyDescriptor(e, r);
      if (u.value !== o || u.enumerable !== !0)
        return !1;
    }
    return !0;
  }), br;
}
var vr, Qn;
function sr() {
  if (Qn)
    return vr;
  Qn = 1;
  var t = ps();
  return vr = function() {
    return t() && !!Symbol.toStringTag;
  }, vr;
}
var _r, ei;
function ro() {
  if (ei)
    return _r;
  ei = 1;
  var t = typeof Symbol < "u" && Symbol, e = ps();
  return _r = function() {
    return typeof t != "function" || typeof Symbol != "function" || typeof t("foo") != "symbol" || typeof Symbol("bar") != "symbol" ? !1 : e();
  }, _r;
}
var xr, ti;
function no() {
  if (ti)
    return xr;
  ti = 1;
  var t = "Function.prototype.bind called on incompatible ", e = Array.prototype.slice, r = Object.prototype.toString, n = "[object Function]";
  return xr = function(c) {
    var u = this;
    if (typeof u != "function" || r.call(u) !== n)
      throw new TypeError(t + u);
    for (var i = e.call(arguments, 1), l, b = function() {
      if (this instanceof l) {
        var v = u.apply(
          this,
          i.concat(e.call(arguments))
        );
        return Object(v) === v ? v : this;
      } else
        return u.apply(
          c,
          i.concat(e.call(arguments))
        );
    }, E = Math.max(0, u.length - i.length), T = [], A = 0; A < E; A++)
      T.push("$" + A);
    if (l = Function("binder", "return function (" + T.join(",") + "){ return binder.apply(this,arguments); }")(b), u.prototype) {
      var m = function() {
      };
      m.prototype = u.prototype, l.prototype = new m(), m.prototype = null;
    }
    return l;
  }, xr;
}
var Er, ri;
function An() {
  if (ri)
    return Er;
  ri = 1;
  var t = no();
  return Er = Function.prototype.bind || t, Er;
}
var Ar, ni;
function io() {
  if (ni)
    return Ar;
  ni = 1;
  var t = An();
  return Ar = t.call(Function.call, Object.prototype.hasOwnProperty), Ar;
}
var Tr, ii;
function Tn() {
  if (ii)
    return Tr;
  ii = 1;
  var t, e = SyntaxError, r = Function, n = TypeError, o = function(se) {
    try {
      return r('"use strict"; return (' + se + ").constructor;")();
    } catch {
    }
  }, c = Object.getOwnPropertyDescriptor;
  if (c)
    try {
      c({}, "");
    } catch {
      c = null;
    }
  var u = function() {
    throw new n();
  }, i = c ? function() {
    try {
      return arguments.callee, u;
    } catch {
      try {
        return c(arguments, "callee").get;
      } catch {
        return u;
      }
    }
  }() : u, l = ro()(), b = Object.getPrototypeOf || function(se) {
    return se.__proto__;
  }, E = {}, T = typeof Uint8Array > "u" ? t : b(Uint8Array), A = {
    "%AggregateError%": typeof AggregateError > "u" ? t : AggregateError,
    "%Array%": Array,
    "%ArrayBuffer%": typeof ArrayBuffer > "u" ? t : ArrayBuffer,
    "%ArrayIteratorPrototype%": l ? b([][Symbol.iterator]()) : t,
    "%AsyncFromSyncIteratorPrototype%": t,
    "%AsyncFunction%": E,
    "%AsyncGenerator%": E,
    "%AsyncGeneratorFunction%": E,
    "%AsyncIteratorPrototype%": E,
    "%Atomics%": typeof Atomics > "u" ? t : Atomics,
    "%BigInt%": typeof BigInt > "u" ? t : BigInt,
    "%Boolean%": Boolean,
    "%DataView%": typeof DataView > "u" ? t : DataView,
    "%Date%": Date,
    "%decodeURI%": decodeURI,
    "%decodeURIComponent%": decodeURIComponent,
    "%encodeURI%": encodeURI,
    "%encodeURIComponent%": encodeURIComponent,
    "%Error%": Error,
    "%eval%": eval,
    // eslint-disable-line no-eval
    "%EvalError%": EvalError,
    "%Float32Array%": typeof Float32Array > "u" ? t : Float32Array,
    "%Float64Array%": typeof Float64Array > "u" ? t : Float64Array,
    "%FinalizationRegistry%": typeof FinalizationRegistry > "u" ? t : FinalizationRegistry,
    "%Function%": r,
    "%GeneratorFunction%": E,
    "%Int8Array%": typeof Int8Array > "u" ? t : Int8Array,
    "%Int16Array%": typeof Int16Array > "u" ? t : Int16Array,
    "%Int32Array%": typeof Int32Array > "u" ? t : Int32Array,
    "%isFinite%": isFinite,
    "%isNaN%": isNaN,
    "%IteratorPrototype%": l ? b(b([][Symbol.iterator]())) : t,
    "%JSON%": typeof JSON == "object" ? JSON : t,
    "%Map%": typeof Map > "u" ? t : Map,
    "%MapIteratorPrototype%": typeof Map > "u" || !l ? t : b((/* @__PURE__ */ new Map())[Symbol.iterator]()),
    "%Math%": Math,
    "%Number%": Number,
    "%Object%": Object,
    "%parseFloat%": parseFloat,
    "%parseInt%": parseInt,
    "%Promise%": typeof Promise > "u" ? t : Promise,
    "%Proxy%": typeof Proxy > "u" ? t : Proxy,
    "%RangeError%": RangeError,
    "%ReferenceError%": ReferenceError,
    "%Reflect%": typeof Reflect > "u" ? t : Reflect,
    "%RegExp%": RegExp,
    "%Set%": typeof Set > "u" ? t : Set,
    "%SetIteratorPrototype%": typeof Set > "u" || !l ? t : b((/* @__PURE__ */ new Set())[Symbol.iterator]()),
    "%SharedArrayBuffer%": typeof SharedArrayBuffer > "u" ? t : SharedArrayBuffer,
    "%String%": String,
    "%StringIteratorPrototype%": l ? b(""[Symbol.iterator]()) : t,
    "%Symbol%": l ? Symbol : t,
    "%SyntaxError%": e,
    "%ThrowTypeError%": i,
    "%TypedArray%": T,
    "%TypeError%": n,
    "%Uint8Array%": typeof Uint8Array > "u" ? t : Uint8Array,
    "%Uint8ClampedArray%": typeof Uint8ClampedArray > "u" ? t : Uint8ClampedArray,
    "%Uint16Array%": typeof Uint16Array > "u" ? t : Uint16Array,
    "%Uint32Array%": typeof Uint32Array > "u" ? t : Uint32Array,
    "%URIError%": URIError,
    "%WeakMap%": typeof WeakMap > "u" ? t : WeakMap,
    "%WeakRef%": typeof WeakRef > "u" ? t : WeakRef,
    "%WeakSet%": typeof WeakSet > "u" ? t : WeakSet
  }, m = function se(ue) {
    var P;
    if (ue === "%AsyncFunction%")
      P = o("async function () {}");
    else if (ue === "%GeneratorFunction%")
      P = o("function* () {}");
    else if (ue === "%AsyncGeneratorFunction%")
      P = o("async function* () {}");
    else if (ue === "%AsyncGenerator%") {
      var K = se("%AsyncGeneratorFunction%");
      K && (P = K.prototype);
    } else if (ue === "%AsyncIteratorPrototype%") {
      var _ = se("%AsyncGenerator%");
      _ && (P = b(_.prototype));
    }
    return A[ue] = P, P;
  }, v = {
    "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
    "%ArrayPrototype%": ["Array", "prototype"],
    "%ArrayProto_entries%": ["Array", "prototype", "entries"],
    "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
    "%ArrayProto_keys%": ["Array", "prototype", "keys"],
    "%ArrayProto_values%": ["Array", "prototype", "values"],
    "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
    "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
    "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"],
    "%BooleanPrototype%": ["Boolean", "prototype"],
    "%DataViewPrototype%": ["DataView", "prototype"],
    "%DatePrototype%": ["Date", "prototype"],
    "%ErrorPrototype%": ["Error", "prototype"],
    "%EvalErrorPrototype%": ["EvalError", "prototype"],
    "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
    "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
    "%FunctionPrototype%": ["Function", "prototype"],
    "%Generator%": ["GeneratorFunction", "prototype"],
    "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
    "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
    "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
    "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
    "%JSONParse%": ["JSON", "parse"],
    "%JSONStringify%": ["JSON", "stringify"],
    "%MapPrototype%": ["Map", "prototype"],
    "%NumberPrototype%": ["Number", "prototype"],
    "%ObjectPrototype%": ["Object", "prototype"],
    "%ObjProto_toString%": ["Object", "prototype", "toString"],
    "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
    "%PromisePrototype%": ["Promise", "prototype"],
    "%PromiseProto_then%": ["Promise", "prototype", "then"],
    "%Promise_all%": ["Promise", "all"],
    "%Promise_reject%": ["Promise", "reject"],
    "%Promise_resolve%": ["Promise", "resolve"],
    "%RangeErrorPrototype%": ["RangeError", "prototype"],
    "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
    "%RegExpPrototype%": ["RegExp", "prototype"],
    "%SetPrototype%": ["Set", "prototype"],
    "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
    "%StringPrototype%": ["String", "prototype"],
    "%SymbolPrototype%": ["Symbol", "prototype"],
    "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
    "%TypedArrayPrototype%": ["TypedArray", "prototype"],
    "%TypeErrorPrototype%": ["TypeError", "prototype"],
    "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
    "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
    "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
    "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
    "%URIErrorPrototype%": ["URIError", "prototype"],
    "%WeakMapPrototype%": ["WeakMap", "prototype"],
    "%WeakSetPrototype%": ["WeakSet", "prototype"]
  }, y = An(), S = io(), g = y.call(Function.call, Array.prototype.concat), x = y.call(Function.apply, Array.prototype.splice), R = y.call(Function.call, String.prototype.replace), D = y.call(Function.call, String.prototype.slice), L = y.call(Function.call, RegExp.prototype.exec), Y = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g, G = /\\(\\)?/g, Q = function(ue) {
    var P = D(ue, 0, 1), K = D(ue, -1);
    if (P === "%" && K !== "%")
      throw new e("invalid intrinsic syntax, expected closing `%`");
    if (K === "%" && P !== "%")
      throw new e("invalid intrinsic syntax, expected opening `%`");
    var _ = [];
    return R(ue, Y, function(J, fe, $, pe) {
      _[_.length] = $ ? R(pe, G, "$1") : fe || J;
    }), _;
  }, k = function(ue, P) {
    var K = ue, _;
    if (S(v, K) && (_ = v[K], K = "%" + _[0] + "%"), S(A, K)) {
      var J = A[K];
      if (J === E && (J = m(K)), typeof J > "u" && !P)
        throw new n("intrinsic " + ue + " exists, but is not available. Please file an issue!");
      return {
        alias: _,
        name: K,
        value: J
      };
    }
    throw new e("intrinsic " + ue + " does not exist!");
  };
  return Tr = function(ue, P) {
    if (typeof ue != "string" || ue.length === 0)
      throw new n("intrinsic name must be a non-empty string");
    if (arguments.length > 1 && typeof P != "boolean")
      throw new n('"allowMissing" argument must be a boolean');
    if (L(/^%?[^%]*%?$/, ue) === null)
      throw new e("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
    var K = Q(ue), _ = K.length > 0 ? K[0] : "", J = k("%" + _ + "%", P), fe = J.name, $ = J.value, pe = !1, ne = J.alias;
    ne && (_ = ne[0], x(K, g([0, 1], ne)));
    for (var he = 1, j = !0; he < K.length; he += 1) {
      var C = K[he], H = D(C, 0, 1), W = D(C, -1);
      if ((H === '"' || H === "'" || H === "`" || W === '"' || W === "'" || W === "`") && H !== W)
        throw new e("property names with quotes must have matching quotes");
      if ((C === "constructor" || !j) && (pe = !0), _ += "." + C, fe = "%" + _ + "%", S(A, fe))
        $ = A[fe];
      else if ($ != null) {
        if (!(C in $)) {
          if (!P)
            throw new n("base intrinsic for " + ue + " exists, but the property is not available.");
          return;
        }
        if (c && he + 1 >= K.length) {
          var te = c($, C);
          j = !!te, j && "get" in te && !("originalValue" in te.get) ? $ = te.get : $ = $[C];
        } else
          j = S($, C), $ = $[C];
        j && !pe && (A[fe] = $);
      }
    }
    return $;
  }, Tr;
}
var Sr = { exports: {} }, si;
function so() {
  return si || (si = 1, function(t) {
    var e = An(), r = Tn(), n = r("%Function.prototype.apply%"), o = r("%Function.prototype.call%"), c = r("%Reflect.apply%", !0) || e.call(o, n), u = r("%Object.getOwnPropertyDescriptor%", !0), i = r("%Object.defineProperty%", !0), l = r("%Math.max%");
    if (i)
      try {
        i({}, "a", { value: 1 });
      } catch {
        i = null;
      }
    t.exports = function(T) {
      var A = c(e, o, arguments);
      if (u && i) {
        var m = u(A, "length");
        m.configurable && i(
          A,
          "length",
          { value: 1 + l(0, T.length - (arguments.length - 1)) }
        );
      }
      return A;
    };
    var b = function() {
      return c(e, n, arguments);
    };
    i ? i(t.exports, "apply", { value: b }) : t.exports.apply = b;
  }(Sr)), Sr.exports;
}
var kr, ai;
function Sn() {
  if (ai)
    return kr;
  ai = 1;
  var t = Tn(), e = so(), r = e(t("String.prototype.indexOf"));
  return kr = function(o, c) {
    var u = t(o, !!c);
    return typeof u == "function" && r(o, ".prototype.") > -1 ? e(u) : u;
  }, kr;
}
var Ir, oi;
function ao() {
  if (oi)
    return Ir;
  oi = 1;
  var t = sr()(), e = Sn(), r = e("Object.prototype.toString"), n = function(i) {
    return t && i && typeof i == "object" && Symbol.toStringTag in i ? !1 : r(i) === "[object Arguments]";
  }, o = function(i) {
    return n(i) ? !0 : i !== null && typeof i == "object" && typeof i.length == "number" && i.length >= 0 && r(i) !== "[object Array]" && r(i.callee) === "[object Function]";
  }, c = function() {
    return n(arguments);
  }();
  return n.isLegacyArguments = o, Ir = c ? n : o, Ir;
}
var Rr, ui;
function oo() {
  if (ui)
    return Rr;
  ui = 1;
  var t = Object.prototype.toString, e = Function.prototype.toString, r = /^\s*(?:function)?\*/, n = sr()(), o = Object.getPrototypeOf, c = function() {
    if (!n)
      return !1;
    try {
      return Function("return function*() {}")();
    } catch {
    }
  }, u;
  return Rr = function(l) {
    if (typeof l != "function")
      return !1;
    if (r.test(e.call(l)))
      return !0;
    if (!n) {
      var b = t.call(l);
      return b === "[object GeneratorFunction]";
    }
    if (!o)
      return !1;
    if (typeof u > "u") {
      var E = c();
      u = E ? o(E) : !1;
    }
    return o(l) === u;
  }, Rr;
}
var Cr, ci;
function uo() {
  if (ci)
    return Cr;
  ci = 1;
  var t = Function.prototype.toString, e = typeof Reflect == "object" && Reflect !== null && Reflect.apply, r, n;
  if (typeof e == "function" && typeof Object.defineProperty == "function")
    try {
      r = Object.defineProperty({}, "length", {
        get: function() {
          throw n;
        }
      }), n = {}, e(function() {
        throw 42;
      }, null, r);
    } catch (x) {
      x !== n && (e = null);
    }
  else
    e = null;
  var o = /^\s*class\b/, c = function(R) {
    try {
      var D = t.call(R);
      return o.test(D);
    } catch {
      return !1;
    }
  }, u = function(R) {
    try {
      return c(R) ? !1 : (t.call(R), !0);
    } catch {
      return !1;
    }
  }, i = Object.prototype.toString, l = "[object Object]", b = "[object Function]", E = "[object GeneratorFunction]", T = "[object HTMLAllCollection]", A = "[object HTML document.all class]", m = "[object HTMLCollection]", v = typeof Symbol == "function" && !!Symbol.toStringTag, y = !(0 in [,]), S = function() {
    return !1;
  };
  if (typeof document == "object") {
    var g = document.all;
    i.call(g) === i.call(document.all) && (S = function(R) {
      if ((y || !R) && (typeof R > "u" || typeof R == "object"))
        try {
          var D = i.call(R);
          return (D === T || D === A || D === m || D === l) && R("") == null;
        } catch {
        }
      return !1;
    });
  }
  return Cr = e ? function(R) {
    if (S(R))
      return !0;
    if (!R || typeof R != "function" && typeof R != "object")
      return !1;
    try {
      e(R, null, r);
    } catch (D) {
      if (D !== n)
        return !1;
    }
    return !c(R) && u(R);
  } : function(R) {
    if (S(R))
      return !0;
    if (!R || typeof R != "function" && typeof R != "object")
      return !1;
    if (v)
      return u(R);
    if (c(R))
      return !1;
    var D = i.call(R);
    return D !== b && D !== E && !/^\[object HTML/.test(D) ? !1 : u(R);
  }, Cr;
}
var Nr, li;
function ms() {
  if (li)
    return Nr;
  li = 1;
  var t = uo(), e = Object.prototype.toString, r = Object.prototype.hasOwnProperty, n = function(l, b, E) {
    for (var T = 0, A = l.length; T < A; T++)
      r.call(l, T) && (E == null ? b(l[T], T, l) : b.call(E, l[T], T, l));
  }, o = function(l, b, E) {
    for (var T = 0, A = l.length; T < A; T++)
      E == null ? b(l.charAt(T), T, l) : b.call(E, l.charAt(T), T, l);
  }, c = function(l, b, E) {
    for (var T in l)
      r.call(l, T) && (E == null ? b(l[T], T, l) : b.call(E, l[T], T, l));
  }, u = function(l, b, E) {
    if (!t(b))
      throw new TypeError("iterator must be a function");
    var T;
    arguments.length >= 3 && (T = E), e.call(l) === "[object Array]" ? n(l, b, T) : typeof l == "string" ? o(l, b, T) : c(l, b, T);
  };
  return Nr = u, Nr;
}
var Or, hi;
function ws() {
  if (hi)
    return Or;
  hi = 1;
  var t = [
    "BigInt64Array",
    "BigUint64Array",
    "Float32Array",
    "Float64Array",
    "Int16Array",
    "Int32Array",
    "Int8Array",
    "Uint16Array",
    "Uint32Array",
    "Uint8Array",
    "Uint8ClampedArray"
  ], e = typeof globalThis > "u" ? je : globalThis;
  return Or = function() {
    for (var n = [], o = 0; o < t.length; o++)
      typeof e[t[o]] == "function" && (n[n.length] = t[o]);
    return n;
  }, Or;
}
var Dr, fi;
function gs() {
  if (fi)
    return Dr;
  fi = 1;
  var t = Tn(), e = t("%Object.getOwnPropertyDescriptor%", !0);
  if (e)
    try {
      e([], "length");
    } catch {
      e = null;
    }
  return Dr = e, Dr;
}
var Pr, di;
function ys() {
  if (di)
    return Pr;
  di = 1;
  var t = ms(), e = ws(), r = Sn(), n = r("Object.prototype.toString"), o = sr()(), c = gs(), u = typeof globalThis > "u" ? je : globalThis, i = e(), l = r("Array.prototype.indexOf", !0) || function(v, y) {
    for (var S = 0; S < v.length; S += 1)
      if (v[S] === y)
        return S;
    return -1;
  }, b = r("String.prototype.slice"), E = {}, T = Object.getPrototypeOf;
  o && c && T && t(i, function(m) {
    var v = new u[m]();
    if (Symbol.toStringTag in v) {
      var y = T(v), S = c(y, Symbol.toStringTag);
      if (!S) {
        var g = T(y);
        S = c(g, Symbol.toStringTag);
      }
      E[m] = S.get;
    }
  });
  var A = function(v) {
    var y = !1;
    return t(E, function(S, g) {
      if (!y)
        try {
          y = S.call(v) === g;
        } catch {
        }
    }), y;
  };
  return Pr = function(v) {
    if (!v || typeof v != "object")
      return !1;
    if (!o || !(Symbol.toStringTag in v)) {
      var y = b(n(v), 8, -1);
      return l(i, y) > -1;
    }
    return c ? A(v) : !1;
  }, Pr;
}
var Fr, pi;
function co() {
  if (pi)
    return Fr;
  pi = 1;
  var t = ms(), e = ws(), r = Sn(), n = gs(), o = r("Object.prototype.toString"), c = sr()(), u = typeof globalThis > "u" ? je : globalThis, i = e(), l = r("String.prototype.slice"), b = {}, E = Object.getPrototypeOf;
  c && n && E && t(i, function(m) {
    if (typeof u[m] == "function") {
      var v = new u[m]();
      if (Symbol.toStringTag in v) {
        var y = E(v), S = n(y, Symbol.toStringTag);
        if (!S) {
          var g = E(y);
          S = n(g, Symbol.toStringTag);
        }
        b[m] = S.get;
      }
    }
  });
  var T = function(v) {
    var y = !1;
    return t(b, function(S, g) {
      if (!y)
        try {
          var x = S.call(v);
          x === g && (y = x);
        } catch {
        }
    }), y;
  }, A = ys();
  return Fr = function(v) {
    return A(v) ? !c || !(Symbol.toStringTag in v) ? l(o(v), 8, -1) : T(v) : !1;
  }, Fr;
}
var mi;
function lo() {
  return mi || (mi = 1, function(t) {
    var e = ao(), r = oo(), n = co(), o = ys();
    function c(h) {
      return h.call.bind(h);
    }
    var u = typeof BigInt < "u", i = typeof Symbol < "u", l = c(Object.prototype.toString), b = c(Number.prototype.valueOf), E = c(String.prototype.valueOf), T = c(Boolean.prototype.valueOf);
    if (u)
      var A = c(BigInt.prototype.valueOf);
    if (i)
      var m = c(Symbol.prototype.valueOf);
    function v(h, O) {
      if (typeof h != "object")
        return !1;
      try {
        return O(h), !0;
      } catch {
        return !1;
      }
    }
    t.isArgumentsObject = e, t.isGeneratorFunction = r, t.isTypedArray = o;
    function y(h) {
      return typeof Promise < "u" && h instanceof Promise || h !== null && typeof h == "object" && typeof h.then == "function" && typeof h.catch == "function";
    }
    t.isPromise = y;
    function S(h) {
      return typeof ArrayBuffer < "u" && ArrayBuffer.isView ? ArrayBuffer.isView(h) : o(h) || H(h);
    }
    t.isArrayBufferView = S;
    function g(h) {
      return n(h) === "Uint8Array";
    }
    t.isUint8Array = g;
    function x(h) {
      return n(h) === "Uint8ClampedArray";
    }
    t.isUint8ClampedArray = x;
    function R(h) {
      return n(h) === "Uint16Array";
    }
    t.isUint16Array = R;
    function D(h) {
      return n(h) === "Uint32Array";
    }
    t.isUint32Array = D;
    function L(h) {
      return n(h) === "Int8Array";
    }
    t.isInt8Array = L;
    function Y(h) {
      return n(h) === "Int16Array";
    }
    t.isInt16Array = Y;
    function G(h) {
      return n(h) === "Int32Array";
    }
    t.isInt32Array = G;
    function Q(h) {
      return n(h) === "Float32Array";
    }
    t.isFloat32Array = Q;
    function k(h) {
      return n(h) === "Float64Array";
    }
    t.isFloat64Array = k;
    function se(h) {
      return n(h) === "BigInt64Array";
    }
    t.isBigInt64Array = se;
    function ue(h) {
      return n(h) === "BigUint64Array";
    }
    t.isBigUint64Array = ue;
    function P(h) {
      return l(h) === "[object Map]";
    }
    P.working = typeof Map < "u" && P(/* @__PURE__ */ new Map());
    function K(h) {
      return typeof Map > "u" ? !1 : P.working ? P(h) : h instanceof Map;
    }
    t.isMap = K;
    function _(h) {
      return l(h) === "[object Set]";
    }
    _.working = typeof Set < "u" && _(/* @__PURE__ */ new Set());
    function J(h) {
      return typeof Set > "u" ? !1 : _.working ? _(h) : h instanceof Set;
    }
    t.isSet = J;
    function fe(h) {
      return l(h) === "[object WeakMap]";
    }
    fe.working = typeof WeakMap < "u" && fe(/* @__PURE__ */ new WeakMap());
    function $(h) {
      return typeof WeakMap > "u" ? !1 : fe.working ? fe(h) : h instanceof WeakMap;
    }
    t.isWeakMap = $;
    function pe(h) {
      return l(h) === "[object WeakSet]";
    }
    pe.working = typeof WeakSet < "u" && pe(/* @__PURE__ */ new WeakSet());
    function ne(h) {
      return pe(h);
    }
    t.isWeakSet = ne;
    function he(h) {
      return l(h) === "[object ArrayBuffer]";
    }
    he.working = typeof ArrayBuffer < "u" && he(new ArrayBuffer());
    function j(h) {
      return typeof ArrayBuffer > "u" ? !1 : he.working ? he(h) : h instanceof ArrayBuffer;
    }
    t.isArrayBuffer = j;
    function C(h) {
      return l(h) === "[object DataView]";
    }
    C.working = typeof ArrayBuffer < "u" && typeof DataView < "u" && C(new DataView(new ArrayBuffer(1), 0, 1));
    function H(h) {
      return typeof DataView > "u" ? !1 : C.working ? C(h) : h instanceof DataView;
    }
    t.isDataView = H;
    var W = typeof SharedArrayBuffer < "u" ? SharedArrayBuffer : void 0;
    function te(h) {
      return l(h) === "[object SharedArrayBuffer]";
    }
    function z(h) {
      return typeof W > "u" ? !1 : (typeof te.working > "u" && (te.working = te(new W())), te.working ? te(h) : h instanceof W);
    }
    t.isSharedArrayBuffer = z;
    function p(h) {
      return l(h) === "[object AsyncFunction]";
    }
    t.isAsyncFunction = p;
    function d(h) {
      return l(h) === "[object Map Iterator]";
    }
    t.isMapIterator = d;
    function M(h) {
      return l(h) === "[object Set Iterator]";
    }
    t.isSetIterator = M;
    function F(h) {
      return l(h) === "[object Generator]";
    }
    t.isGeneratorObject = F;
    function I(h) {
      return l(h) === "[object WebAssembly.Module]";
    }
    t.isWebAssemblyCompiledModule = I;
    function N(h) {
      return v(h, b);
    }
    t.isNumberObject = N;
    function Z(h) {
      return v(h, E);
    }
    t.isStringObject = Z;
    function f(h) {
      return v(h, T);
    }
    t.isBooleanObject = f;
    function V(h) {
      return u && v(h, A);
    }
    t.isBigIntObject = V;
    function w(h) {
      return i && v(h, m);
    }
    t.isSymbolObject = w;
    function s(h) {
      return N(h) || Z(h) || f(h) || V(h) || w(h);
    }
    t.isBoxedPrimitive = s;
    function a(h) {
      return typeof Uint8Array < "u" && (j(h) || z(h));
    }
    t.isAnyArrayBuffer = a, ["isProxy", "isExternal", "isModuleNamespaceObject"].forEach(function(h) {
      Object.defineProperty(t, h, {
        enumerable: !1,
        value: function() {
          throw new Error(h + " is not supported in userland");
        }
      });
    });
  }(yr)), yr;
}
var Br, wi;
function ho() {
  return wi || (wi = 1, Br = function(e) {
    return e && typeof e == "object" && typeof e.copy == "function" && typeof e.fill == "function" && typeof e.readUInt8 == "function";
  }), Br;
}
var gi;
function bs() {
  return gi || (gi = 1, function(t) {
    var e = Object.getOwnPropertyDescriptors || function(H) {
      for (var W = Object.keys(H), te = {}, z = 0; z < W.length; z++)
        te[W[z]] = Object.getOwnPropertyDescriptor(H, W[z]);
      return te;
    }, r = /%[sdj%]/g;
    t.format = function(C) {
      if (!L(C)) {
        for (var H = [], W = 0; W < arguments.length; W++)
          H.push(u(arguments[W]));
        return H.join(" ");
      }
      for (var W = 1, te = arguments, z = te.length, p = String(C).replace(r, function(M) {
        if (M === "%%")
          return "%";
        if (W >= z)
          return M;
        switch (M) {
          case "%s":
            return String(te[W++]);
          case "%d":
            return Number(te[W++]);
          case "%j":
            try {
              return JSON.stringify(te[W++]);
            } catch {
              return "[Circular]";
            }
          default:
            return M;
        }
      }), d = te[W]; W < z; d = te[++W])
        x(d) || !k(d) ? p += " " + d : p += " " + u(d);
      return p;
    }, t.deprecate = function(C, H) {
      if (typeof ye < "u" && ye.noDeprecation === !0)
        return C;
      if (typeof ye > "u")
        return function() {
          return t.deprecate(C, H).apply(this, arguments);
        };
      var W = !1;
      function te() {
        if (!W) {
          if (ye.throwDeprecation)
            throw new Error(H);
          ye.traceDeprecation ? console.trace(H) : console.error(H), W = !0;
        }
        return C.apply(this, arguments);
      }
      return te;
    };
    var n = {}, o = /^$/;
    if (ye.env.NODE_DEBUG) {
      var c = ye.env.NODE_DEBUG;
      c = c.replace(/[|\\{}()[\]^$+?.]/g, "\\$&").replace(/\*/g, ".*").replace(/,/g, "$|^").toUpperCase(), o = new RegExp("^" + c + "$", "i");
    }
    t.debuglog = function(C) {
      if (C = C.toUpperCase(), !n[C])
        if (o.test(C)) {
          var H = ye.pid;
          n[C] = function() {
            var W = t.format.apply(t, arguments);
            console.error("%s %d: %s", C, H, W);
          };
        } else
          n[C] = function() {
          };
      return n[C];
    };
    function u(C, H) {
      var W = {
        seen: [],
        stylize: l
      };
      return arguments.length >= 3 && (W.depth = arguments[2]), arguments.length >= 4 && (W.colors = arguments[3]), g(H) ? W.showHidden = H : H && t._extend(W, H), G(W.showHidden) && (W.showHidden = !1), G(W.depth) && (W.depth = 2), G(W.colors) && (W.colors = !1), G(W.customInspect) && (W.customInspect = !0), W.colors && (W.stylize = i), E(W, C, W.depth);
    }
    t.inspect = u, u.colors = {
      bold: [1, 22],
      italic: [3, 23],
      underline: [4, 24],
      inverse: [7, 27],
      white: [37, 39],
      grey: [90, 39],
      black: [30, 39],
      blue: [34, 39],
      cyan: [36, 39],
      green: [32, 39],
      magenta: [35, 39],
      red: [31, 39],
      yellow: [33, 39]
    }, u.styles = {
      special: "cyan",
      number: "yellow",
      boolean: "yellow",
      undefined: "grey",
      null: "bold",
      string: "green",
      date: "magenta",
      // "name": intentionally not styling
      regexp: "red"
    };
    function i(C, H) {
      var W = u.styles[H];
      return W ? "\x1B[" + u.colors[W][0] + "m" + C + "\x1B[" + u.colors[W][1] + "m" : C;
    }
    function l(C, H) {
      return C;
    }
    function b(C) {
      var H = {};
      return C.forEach(function(W, te) {
        H[W] = !0;
      }), H;
    }
    function E(C, H, W) {
      if (C.customInspect && H && P(H.inspect) && // Filter out the util module, it's inspect function is special
      H.inspect !== t.inspect && // Also filter out any prototype objects using the circular check.
      !(H.constructor && H.constructor.prototype === H)) {
        var te = H.inspect(W, C);
        return L(te) || (te = E(C, te, W)), te;
      }
      var z = T(C, H);
      if (z)
        return z;
      var p = Object.keys(H), d = b(p);
      if (C.showHidden && (p = Object.getOwnPropertyNames(H)), ue(H) && (p.indexOf("message") >= 0 || p.indexOf("description") >= 0))
        return A(H);
      if (p.length === 0) {
        if (P(H)) {
          var M = H.name ? ": " + H.name : "";
          return C.stylize("[Function" + M + "]", "special");
        }
        if (Q(H))
          return C.stylize(RegExp.prototype.toString.call(H), "regexp");
        if (se(H))
          return C.stylize(Date.prototype.toString.call(H), "date");
        if (ue(H))
          return A(H);
      }
      var F = "", I = !1, N = ["{", "}"];
      if (S(H) && (I = !0, N = ["[", "]"]), P(H)) {
        var Z = H.name ? ": " + H.name : "";
        F = " [Function" + Z + "]";
      }
      if (Q(H) && (F = " " + RegExp.prototype.toString.call(H)), se(H) && (F = " " + Date.prototype.toUTCString.call(H)), ue(H) && (F = " " + A(H)), p.length === 0 && (!I || H.length == 0))
        return N[0] + F + N[1];
      if (W < 0)
        return Q(H) ? C.stylize(RegExp.prototype.toString.call(H), "regexp") : C.stylize("[Object]", "special");
      C.seen.push(H);
      var f;
      return I ? f = m(C, H, W, d, p) : f = p.map(function(V) {
        return v(C, H, W, d, V, I);
      }), C.seen.pop(), y(f, F, N);
    }
    function T(C, H) {
      if (G(H))
        return C.stylize("undefined", "undefined");
      if (L(H)) {
        var W = "'" + JSON.stringify(H).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
        return C.stylize(W, "string");
      }
      if (D(H))
        return C.stylize("" + H, "number");
      if (g(H))
        return C.stylize("" + H, "boolean");
      if (x(H))
        return C.stylize("null", "null");
    }
    function A(C) {
      return "[" + Error.prototype.toString.call(C) + "]";
    }
    function m(C, H, W, te, z) {
      for (var p = [], d = 0, M = H.length; d < M; ++d)
        pe(H, String(d)) ? p.push(v(
          C,
          H,
          W,
          te,
          String(d),
          !0
        )) : p.push("");
      return z.forEach(function(F) {
        F.match(/^\d+$/) || p.push(v(
          C,
          H,
          W,
          te,
          F,
          !0
        ));
      }), p;
    }
    function v(C, H, W, te, z, p) {
      var d, M, F;
      if (F = Object.getOwnPropertyDescriptor(H, z) || { value: H[z] }, F.get ? F.set ? M = C.stylize("[Getter/Setter]", "special") : M = C.stylize("[Getter]", "special") : F.set && (M = C.stylize("[Setter]", "special")), pe(te, z) || (d = "[" + z + "]"), M || (C.seen.indexOf(F.value) < 0 ? (x(W) ? M = E(C, F.value, null) : M = E(C, F.value, W - 1), M.indexOf(`
`) > -1 && (p ? M = M.split(`
`).map(function(I) {
        return "  " + I;
      }).join(`
`).slice(2) : M = `
` + M.split(`
`).map(function(I) {
        return "   " + I;
      }).join(`
`))) : M = C.stylize("[Circular]", "special")), G(d)) {
        if (p && z.match(/^\d+$/))
          return M;
        d = JSON.stringify("" + z), d.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/) ? (d = d.slice(1, -1), d = C.stylize(d, "name")) : (d = d.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'"), d = C.stylize(d, "string"));
      }
      return d + ": " + M;
    }
    function y(C, H, W) {
      var te = C.reduce(function(z, p) {
        return p.indexOf(`
`) >= 0, z + p.replace(/\u001b\[\d\d?m/g, "").length + 1;
      }, 0);
      return te > 60 ? W[0] + (H === "" ? "" : H + `
 `) + " " + C.join(`,
  `) + " " + W[1] : W[0] + H + " " + C.join(", ") + " " + W[1];
    }
    t.types = lo();
    function S(C) {
      return Array.isArray(C);
    }
    t.isArray = S;
    function g(C) {
      return typeof C == "boolean";
    }
    t.isBoolean = g;
    function x(C) {
      return C === null;
    }
    t.isNull = x;
    function R(C) {
      return C == null;
    }
    t.isNullOrUndefined = R;
    function D(C) {
      return typeof C == "number";
    }
    t.isNumber = D;
    function L(C) {
      return typeof C == "string";
    }
    t.isString = L;
    function Y(C) {
      return typeof C == "symbol";
    }
    t.isSymbol = Y;
    function G(C) {
      return C === void 0;
    }
    t.isUndefined = G;
    function Q(C) {
      return k(C) && _(C) === "[object RegExp]";
    }
    t.isRegExp = Q, t.types.isRegExp = Q;
    function k(C) {
      return typeof C == "object" && C !== null;
    }
    t.isObject = k;
    function se(C) {
      return k(C) && _(C) === "[object Date]";
    }
    t.isDate = se, t.types.isDate = se;
    function ue(C) {
      return k(C) && (_(C) === "[object Error]" || C instanceof Error);
    }
    t.isError = ue, t.types.isNativeError = ue;
    function P(C) {
      return typeof C == "function";
    }
    t.isFunction = P;
    function K(C) {
      return C === null || typeof C == "boolean" || typeof C == "number" || typeof C == "string" || typeof C == "symbol" || // ES6 symbol
      typeof C > "u";
    }
    t.isPrimitive = K, t.isBuffer = ho();
    function _(C) {
      return Object.prototype.toString.call(C);
    }
    function J(C) {
      return C < 10 ? "0" + C.toString(10) : C.toString(10);
    }
    var fe = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    function $() {
      var C = /* @__PURE__ */ new Date(), H = [
        J(C.getHours()),
        J(C.getMinutes()),
        J(C.getSeconds())
      ].join(":");
      return [C.getDate(), fe[C.getMonth()], H].join(" ");
    }
    t.log = function() {
      console.log("%s - %s", $(), t.format.apply(t, arguments));
    }, t.inherits = ht, t._extend = function(C, H) {
      if (!H || !k(H))
        return C;
      for (var W = Object.keys(H), te = W.length; te--; )
        C[W[te]] = H[W[te]];
      return C;
    };
    function pe(C, H) {
      return Object.prototype.hasOwnProperty.call(C, H);
    }
    var ne = typeof Symbol < "u" ? Symbol("util.promisify.custom") : void 0;
    t.promisify = function(H) {
      if (typeof H != "function")
        throw new TypeError('The "original" argument must be of type Function');
      if (ne && H[ne]) {
        var W = H[ne];
        if (typeof W != "function")
          throw new TypeError('The "util.promisify.custom" argument must be of type Function');
        return Object.defineProperty(W, ne, {
          value: W,
          enumerable: !1,
          writable: !1,
          configurable: !0
        }), W;
      }
      function W() {
        for (var te, z, p = new Promise(function(F, I) {
          te = F, z = I;
        }), d = [], M = 0; M < arguments.length; M++)
          d.push(arguments[M]);
        d.push(function(F, I) {
          F ? z(F) : te(I);
        });
        try {
          H.apply(this, d);
        } catch (F) {
          z(F);
        }
        return p;
      }
      return Object.setPrototypeOf(W, Object.getPrototypeOf(H)), ne && Object.defineProperty(W, ne, {
        value: W,
        enumerable: !1,
        writable: !1,
        configurable: !0
      }), Object.defineProperties(
        W,
        e(H)
      );
    }, t.promisify.custom = ne;
    function he(C, H) {
      if (!C) {
        var W = new Error("Promise was rejected with a falsy value");
        W.reason = C, C = W;
      }
      return H(C);
    }
    function j(C) {
      if (typeof C != "function")
        throw new TypeError('The "original" argument must be of type Function');
      function H() {
        for (var W = [], te = 0; te < arguments.length; te++)
          W.push(arguments[te]);
        var z = W.pop();
        if (typeof z != "function")
          throw new TypeError("The last argument must be of type Function");
        var p = this, d = function() {
          return z.apply(p, arguments);
        };
        C.apply(this, W).then(
          function(M) {
            ye.nextTick(d.bind(null, null, M));
          },
          function(M) {
            ye.nextTick(he.bind(null, M, d));
          }
        );
      }
      return Object.setPrototypeOf(H, Object.getPrototypeOf(C)), Object.defineProperties(
        H,
        e(C)
      ), H;
    }
    t.callbackify = j;
  }(gr)), gr;
}
var Lr, yi;
function fo() {
  if (yi)
    return Lr;
  yi = 1;
  function t(A, m) {
    var v = Object.keys(A);
    if (Object.getOwnPropertySymbols) {
      var y = Object.getOwnPropertySymbols(A);
      m && (y = y.filter(function(S) {
        return Object.getOwnPropertyDescriptor(A, S).enumerable;
      })), v.push.apply(v, y);
    }
    return v;
  }
  function e(A) {
    for (var m = 1; m < arguments.length; m++) {
      var v = arguments[m] != null ? arguments[m] : {};
      m % 2 ? t(Object(v), !0).forEach(function(y) {
        r(A, y, v[y]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(A, Object.getOwnPropertyDescriptors(v)) : t(Object(v)).forEach(function(y) {
        Object.defineProperty(A, y, Object.getOwnPropertyDescriptor(v, y));
      });
    }
    return A;
  }
  function r(A, m, v) {
    return m in A ? Object.defineProperty(A, m, { value: v, enumerable: !0, configurable: !0, writable: !0 }) : A[m] = v, A;
  }
  function n(A, m) {
    if (!(A instanceof m))
      throw new TypeError("Cannot call a class as a function");
  }
  function o(A, m) {
    for (var v = 0; v < m.length; v++) {
      var y = m[v];
      y.enumerable = y.enumerable || !1, y.configurable = !0, "value" in y && (y.writable = !0), Object.defineProperty(A, y.key, y);
    }
  }
  function c(A, m, v) {
    return m && o(A.prototype, m), v && o(A, v), A;
  }
  var u = Lt(), i = u.Buffer, l = bs(), b = l.inspect, E = b && b.custom || "inspect";
  function T(A, m, v) {
    i.prototype.copy.call(A, m, v);
  }
  return Lr = /* @__PURE__ */ function() {
    function A() {
      n(this, A), this.head = null, this.tail = null, this.length = 0;
    }
    return c(A, [{
      key: "push",
      value: function(v) {
        var y = {
          data: v,
          next: null
        };
        this.length > 0 ? this.tail.next = y : this.head = y, this.tail = y, ++this.length;
      }
    }, {
      key: "unshift",
      value: function(v) {
        var y = {
          data: v,
          next: this.head
        };
        this.length === 0 && (this.tail = y), this.head = y, ++this.length;
      }
    }, {
      key: "shift",
      value: function() {
        if (this.length !== 0) {
          var v = this.head.data;
          return this.length === 1 ? this.head = this.tail = null : this.head = this.head.next, --this.length, v;
        }
      }
    }, {
      key: "clear",
      value: function() {
        this.head = this.tail = null, this.length = 0;
      }
    }, {
      key: "join",
      value: function(v) {
        if (this.length === 0)
          return "";
        for (var y = this.head, S = "" + y.data; y = y.next; )
          S += v + y.data;
        return S;
      }
    }, {
      key: "concat",
      value: function(v) {
        if (this.length === 0)
          return i.alloc(0);
        for (var y = i.allocUnsafe(v >>> 0), S = this.head, g = 0; S; )
          T(S.data, y, g), g += S.data.length, S = S.next;
        return y;
      }
      // Consumes a specified amount of bytes or characters from the buffered data.
    }, {
      key: "consume",
      value: function(v, y) {
        var S;
        return v < this.head.data.length ? (S = this.head.data.slice(0, v), this.head.data = this.head.data.slice(v)) : v === this.head.data.length ? S = this.shift() : S = y ? this._getString(v) : this._getBuffer(v), S;
      }
    }, {
      key: "first",
      value: function() {
        return this.head.data;
      }
      // Consumes a specified amount of characters from the buffered data.
    }, {
      key: "_getString",
      value: function(v) {
        var y = this.head, S = 1, g = y.data;
        for (v -= g.length; y = y.next; ) {
          var x = y.data, R = v > x.length ? x.length : v;
          if (R === x.length ? g += x : g += x.slice(0, v), v -= R, v === 0) {
            R === x.length ? (++S, y.next ? this.head = y.next : this.head = this.tail = null) : (this.head = y, y.data = x.slice(R));
            break;
          }
          ++S;
        }
        return this.length -= S, g;
      }
      // Consumes a specified amount of bytes from the buffered data.
    }, {
      key: "_getBuffer",
      value: function(v) {
        var y = i.allocUnsafe(v), S = this.head, g = 1;
        for (S.data.copy(y), v -= S.data.length; S = S.next; ) {
          var x = S.data, R = v > x.length ? x.length : v;
          if (x.copy(y, y.length - v, 0, R), v -= R, v === 0) {
            R === x.length ? (++g, S.next ? this.head = S.next : this.head = this.tail = null) : (this.head = S, S.data = x.slice(R));
            break;
          }
          ++g;
        }
        return this.length -= g, y;
      }
      // Make sure the linked list only shows the minimal necessary information.
    }, {
      key: E,
      value: function(v, y) {
        return b(this, e({}, y, {
          // Only inspect one level.
          depth: 0,
          // It should not recurse.
          customInspect: !1
        }));
      }
    }]), A;
  }(), Lr;
}
var Mr, bi;
function vs() {
  if (bi)
    return Mr;
  bi = 1;
  function t(u, i) {
    var l = this, b = this._readableState && this._readableState.destroyed, E = this._writableState && this._writableState.destroyed;
    return b || E ? (i ? i(u) : u && (this._writableState ? this._writableState.errorEmitted || (this._writableState.errorEmitted = !0, ye.nextTick(o, this, u)) : ye.nextTick(o, this, u)), this) : (this._readableState && (this._readableState.destroyed = !0), this._writableState && (this._writableState.destroyed = !0), this._destroy(u || null, function(T) {
      !i && T ? l._writableState ? l._writableState.errorEmitted ? ye.nextTick(r, l) : (l._writableState.errorEmitted = !0, ye.nextTick(e, l, T)) : ye.nextTick(e, l, T) : i ? (ye.nextTick(r, l), i(T)) : ye.nextTick(r, l);
    }), this);
  }
  function e(u, i) {
    o(u, i), r(u);
  }
  function r(u) {
    u._writableState && !u._writableState.emitClose || u._readableState && !u._readableState.emitClose || u.emit("close");
  }
  function n() {
    this._readableState && (this._readableState.destroyed = !1, this._readableState.reading = !1, this._readableState.ended = !1, this._readableState.endEmitted = !1), this._writableState && (this._writableState.destroyed = !1, this._writableState.ended = !1, this._writableState.ending = !1, this._writableState.finalCalled = !1, this._writableState.prefinished = !1, this._writableState.finished = !1, this._writableState.errorEmitted = !1);
  }
  function o(u, i) {
    u.emit("error", i);
  }
  function c(u, i) {
    var l = u._readableState, b = u._writableState;
    l && l.autoDestroy || b && b.autoDestroy ? u.destroy(i) : u.emit("error", i);
  }
  return Mr = {
    destroy: t,
    undestroy: n,
    errorOrDestroy: c
  }, Mr;
}
var Ur = {}, vi;
function St() {
  if (vi)
    return Ur;
  vi = 1;
  function t(i, l) {
    i.prototype = Object.create(l.prototype), i.prototype.constructor = i, i.__proto__ = l;
  }
  var e = {};
  function r(i, l, b) {
    b || (b = Error);
    function E(A, m, v) {
      return typeof l == "string" ? l : l(A, m, v);
    }
    var T = /* @__PURE__ */ function(A) {
      t(m, A);
      function m(v, y, S) {
        return A.call(this, E(v, y, S)) || this;
      }
      return m;
    }(b);
    T.prototype.name = b.name, T.prototype.code = i, e[i] = T;
  }
  function n(i, l) {
    if (Array.isArray(i)) {
      var b = i.length;
      return i = i.map(function(E) {
        return String(E);
      }), b > 2 ? "one of ".concat(l, " ").concat(i.slice(0, b - 1).join(", "), ", or ") + i[b - 1] : b === 2 ? "one of ".concat(l, " ").concat(i[0], " or ").concat(i[1]) : "of ".concat(l, " ").concat(i[0]);
    } else
      return "of ".concat(l, " ").concat(String(i));
  }
  function o(i, l, b) {
    return i.substr(!b || b < 0 ? 0 : +b, l.length) === l;
  }
  function c(i, l, b) {
    return (b === void 0 || b > i.length) && (b = i.length), i.substring(b - l.length, b) === l;
  }
  function u(i, l, b) {
    return typeof b != "number" && (b = 0), b + l.length > i.length ? !1 : i.indexOf(l, b) !== -1;
  }
  return r("ERR_INVALID_OPT_VALUE", function(i, l) {
    return 'The value "' + l + '" is invalid for option "' + i + '"';
  }, TypeError), r("ERR_INVALID_ARG_TYPE", function(i, l, b) {
    var E;
    typeof l == "string" && o(l, "not ") ? (E = "must not be", l = l.replace(/^not /, "")) : E = "must be";
    var T;
    if (c(i, " argument"))
      T = "The ".concat(i, " ").concat(E, " ").concat(n(l, "type"));
    else {
      var A = u(i, ".") ? "property" : "argument";
      T = 'The "'.concat(i, '" ').concat(A, " ").concat(E, " ").concat(n(l, "type"));
    }
    return T += ". Received type ".concat(typeof b), T;
  }, TypeError), r("ERR_STREAM_PUSH_AFTER_EOF", "stream.push() after EOF"), r("ERR_METHOD_NOT_IMPLEMENTED", function(i) {
    return "The " + i + " method is not implemented";
  }), r("ERR_STREAM_PREMATURE_CLOSE", "Premature close"), r("ERR_STREAM_DESTROYED", function(i) {
    return "Cannot call " + i + " after a stream was destroyed";
  }), r("ERR_MULTIPLE_CALLBACK", "Callback called multiple times"), r("ERR_STREAM_CANNOT_PIPE", "Cannot pipe, not readable"), r("ERR_STREAM_WRITE_AFTER_END", "write after end"), r("ERR_STREAM_NULL_VALUES", "May not write null values to stream", TypeError), r("ERR_UNKNOWN_ENCODING", function(i) {
    return "Unknown encoding: " + i;
  }, TypeError), r("ERR_STREAM_UNSHIFT_AFTER_END_EVENT", "stream.unshift() after end event"), Ur.codes = e, Ur;
}
var zr, _i;
function _s() {
  if (_i)
    return zr;
  _i = 1;
  var t = St().codes.ERR_INVALID_OPT_VALUE;
  function e(n, o, c) {
    return n.highWaterMark != null ? n.highWaterMark : o ? n[c] : null;
  }
  function r(n, o, c, u) {
    var i = e(o, u, c);
    if (i != null) {
      if (!(isFinite(i) && Math.floor(i) === i) || i < 0) {
        var l = u ? c : "highWaterMark";
        throw new t(l, i);
      }
      return Math.floor(i);
    }
    return n.objectMode ? 16 : 16 * 1024;
  }
  return zr = {
    getHighWaterMark: r
  }, zr;
}
var jr, xi;
function po() {
  if (xi)
    return jr;
  xi = 1, jr = t;
  function t(r, n) {
    if (e("noDeprecation"))
      return r;
    var o = !1;
    function c() {
      if (!o) {
        if (e("throwDeprecation"))
          throw new Error(n);
        e("traceDeprecation") ? console.trace(n) : console.warn(n), o = !0;
      }
      return r.apply(this, arguments);
    }
    return c;
  }
  function e(r) {
    try {
      if (!je.localStorage)
        return !1;
    } catch {
      return !1;
    }
    var n = je.localStorage[r];
    return n == null ? !1 : String(n).toLowerCase() === "true";
  }
  return jr;
}
var Hr, Ei;
function xs() {
  if (Ei)
    return Hr;
  Ei = 1, Hr = Q;
  function t(z) {
    var p = this;
    this.next = null, this.entry = null, this.finish = function() {
      te(p, z);
    };
  }
  var e;
  Q.WritableState = Y;
  var r = {
    deprecate: po()
  }, n = ds(), o = Lt().Buffer, c = je.Uint8Array || function() {
  };
  function u(z) {
    return o.from(z);
  }
  function i(z) {
    return o.isBuffer(z) || z instanceof c;
  }
  var l = vs(), b = _s(), E = b.getHighWaterMark, T = St().codes, A = T.ERR_INVALID_ARG_TYPE, m = T.ERR_METHOD_NOT_IMPLEMENTED, v = T.ERR_MULTIPLE_CALLBACK, y = T.ERR_STREAM_CANNOT_PIPE, S = T.ERR_STREAM_DESTROYED, g = T.ERR_STREAM_NULL_VALUES, x = T.ERR_STREAM_WRITE_AFTER_END, R = T.ERR_UNKNOWN_ENCODING, D = l.errorOrDestroy;
  ht(Q, n);
  function L() {
  }
  function Y(z, p, d) {
    e = e || xt(), z = z || {}, typeof d != "boolean" && (d = p instanceof e), this.objectMode = !!z.objectMode, d && (this.objectMode = this.objectMode || !!z.writableObjectMode), this.highWaterMark = E(this, z, "writableHighWaterMark", d), this.finalCalled = !1, this.needDrain = !1, this.ending = !1, this.ended = !1, this.finished = !1, this.destroyed = !1;
    var M = z.decodeStrings === !1;
    this.decodeStrings = !M, this.defaultEncoding = z.defaultEncoding || "utf8", this.length = 0, this.writing = !1, this.corked = 0, this.sync = !0, this.bufferProcessing = !1, this.onwrite = function(F) {
      fe(p, F);
    }, this.writecb = null, this.writelen = 0, this.bufferedRequest = null, this.lastBufferedRequest = null, this.pendingcb = 0, this.prefinished = !1, this.errorEmitted = !1, this.emitClose = z.emitClose !== !1, this.autoDestroy = !!z.autoDestroy, this.bufferedRequestCount = 0, this.corkedRequestsFree = new t(this);
  }
  Y.prototype.getBuffer = function() {
    for (var p = this.bufferedRequest, d = []; p; )
      d.push(p), p = p.next;
    return d;
  }, function() {
    try {
      Object.defineProperty(Y.prototype, "buffer", {
        get: r.deprecate(function() {
          return this.getBuffer();
        }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.", "DEP0003")
      });
    } catch {
    }
  }();
  var G;
  typeof Symbol == "function" && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] == "function" ? (G = Function.prototype[Symbol.hasInstance], Object.defineProperty(Q, Symbol.hasInstance, {
    value: function(p) {
      return G.call(this, p) ? !0 : this !== Q ? !1 : p && p._writableState instanceof Y;
    }
  })) : G = function(p) {
    return p instanceof this;
  };
  function Q(z) {
    e = e || xt();
    var p = this instanceof e;
    if (!p && !G.call(Q, this))
      return new Q(z);
    this._writableState = new Y(z, this, p), this.writable = !0, z && (typeof z.write == "function" && (this._write = z.write), typeof z.writev == "function" && (this._writev = z.writev), typeof z.destroy == "function" && (this._destroy = z.destroy), typeof z.final == "function" && (this._final = z.final)), n.call(this);
  }
  Q.prototype.pipe = function() {
    D(this, new y());
  };
  function k(z, p) {
    var d = new x();
    D(z, d), ye.nextTick(p, d);
  }
  function se(z, p, d, M) {
    var F;
    return d === null ? F = new g() : typeof d != "string" && !p.objectMode && (F = new A("chunk", ["string", "Buffer"], d)), F ? (D(z, F), ye.nextTick(M, F), !1) : !0;
  }
  Q.prototype.write = function(z, p, d) {
    var M = this._writableState, F = !1, I = !M.objectMode && i(z);
    return I && !o.isBuffer(z) && (z = u(z)), typeof p == "function" && (d = p, p = null), I ? p = "buffer" : p || (p = M.defaultEncoding), typeof d != "function" && (d = L), M.ending ? k(this, d) : (I || se(this, M, z, d)) && (M.pendingcb++, F = P(this, M, I, z, p, d)), F;
  }, Q.prototype.cork = function() {
    this._writableState.corked++;
  }, Q.prototype.uncork = function() {
    var z = this._writableState;
    z.corked && (z.corked--, !z.writing && !z.corked && !z.bufferProcessing && z.bufferedRequest && ne(this, z));
  }, Q.prototype.setDefaultEncoding = function(p) {
    if (typeof p == "string" && (p = p.toLowerCase()), !(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((p + "").toLowerCase()) > -1))
      throw new R(p);
    return this._writableState.defaultEncoding = p, this;
  }, Object.defineProperty(Q.prototype, "writableBuffer", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._writableState && this._writableState.getBuffer();
    }
  });
  function ue(z, p, d) {
    return !z.objectMode && z.decodeStrings !== !1 && typeof p == "string" && (p = o.from(p, d)), p;
  }
  Object.defineProperty(Q.prototype, "writableHighWaterMark", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._writableState.highWaterMark;
    }
  });
  function P(z, p, d, M, F, I) {
    if (!d) {
      var N = ue(p, M, F);
      M !== N && (d = !0, F = "buffer", M = N);
    }
    var Z = p.objectMode ? 1 : M.length;
    p.length += Z;
    var f = p.length < p.highWaterMark;
    if (f || (p.needDrain = !0), p.writing || p.corked) {
      var V = p.lastBufferedRequest;
      p.lastBufferedRequest = {
        chunk: M,
        encoding: F,
        isBuf: d,
        callback: I,
        next: null
      }, V ? V.next = p.lastBufferedRequest : p.bufferedRequest = p.lastBufferedRequest, p.bufferedRequestCount += 1;
    } else
      K(z, p, !1, Z, M, F, I);
    return f;
  }
  function K(z, p, d, M, F, I, N) {
    p.writelen = M, p.writecb = N, p.writing = !0, p.sync = !0, p.destroyed ? p.onwrite(new S("write")) : d ? z._writev(F, p.onwrite) : z._write(F, I, p.onwrite), p.sync = !1;
  }
  function _(z, p, d, M, F) {
    --p.pendingcb, d ? (ye.nextTick(F, M), ye.nextTick(H, z, p), z._writableState.errorEmitted = !0, D(z, M)) : (F(M), z._writableState.errorEmitted = !0, D(z, M), H(z, p));
  }
  function J(z) {
    z.writing = !1, z.writecb = null, z.length -= z.writelen, z.writelen = 0;
  }
  function fe(z, p) {
    var d = z._writableState, M = d.sync, F = d.writecb;
    if (typeof F != "function")
      throw new v();
    if (J(d), p)
      _(z, d, M, p, F);
    else {
      var I = he(d) || z.destroyed;
      !I && !d.corked && !d.bufferProcessing && d.bufferedRequest && ne(z, d), M ? ye.nextTick($, z, d, I, F) : $(z, d, I, F);
    }
  }
  function $(z, p, d, M) {
    d || pe(z, p), p.pendingcb--, M(), H(z, p);
  }
  function pe(z, p) {
    p.length === 0 && p.needDrain && (p.needDrain = !1, z.emit("drain"));
  }
  function ne(z, p) {
    p.bufferProcessing = !0;
    var d = p.bufferedRequest;
    if (z._writev && d && d.next) {
      var M = p.bufferedRequestCount, F = new Array(M), I = p.corkedRequestsFree;
      I.entry = d;
      for (var N = 0, Z = !0; d; )
        F[N] = d, d.isBuf || (Z = !1), d = d.next, N += 1;
      F.allBuffers = Z, K(z, p, !0, p.length, F, "", I.finish), p.pendingcb++, p.lastBufferedRequest = null, I.next ? (p.corkedRequestsFree = I.next, I.next = null) : p.corkedRequestsFree = new t(p), p.bufferedRequestCount = 0;
    } else {
      for (; d; ) {
        var f = d.chunk, V = d.encoding, w = d.callback, s = p.objectMode ? 1 : f.length;
        if (K(z, p, !1, s, f, V, w), d = d.next, p.bufferedRequestCount--, p.writing)
          break;
      }
      d === null && (p.lastBufferedRequest = null);
    }
    p.bufferedRequest = d, p.bufferProcessing = !1;
  }
  Q.prototype._write = function(z, p, d) {
    d(new m("_write()"));
  }, Q.prototype._writev = null, Q.prototype.end = function(z, p, d) {
    var M = this._writableState;
    return typeof z == "function" ? (d = z, z = null, p = null) : typeof p == "function" && (d = p, p = null), z != null && this.write(z, p), M.corked && (M.corked = 1, this.uncork()), M.ending || W(this, M, d), this;
  }, Object.defineProperty(Q.prototype, "writableLength", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._writableState.length;
    }
  });
  function he(z) {
    return z.ending && z.length === 0 && z.bufferedRequest === null && !z.finished && !z.writing;
  }
  function j(z, p) {
    z._final(function(d) {
      p.pendingcb--, d && D(z, d), p.prefinished = !0, z.emit("prefinish"), H(z, p);
    });
  }
  function C(z, p) {
    !p.prefinished && !p.finalCalled && (typeof z._final == "function" && !p.destroyed ? (p.pendingcb++, p.finalCalled = !0, ye.nextTick(j, z, p)) : (p.prefinished = !0, z.emit("prefinish")));
  }
  function H(z, p) {
    var d = he(p);
    if (d && (C(z, p), p.pendingcb === 0 && (p.finished = !0, z.emit("finish"), p.autoDestroy))) {
      var M = z._readableState;
      (!M || M.autoDestroy && M.endEmitted) && z.destroy();
    }
    return d;
  }
  function W(z, p, d) {
    p.ending = !0, H(z, p), d && (p.finished ? ye.nextTick(d) : z.once("finish", d)), p.ended = !0, z.writable = !1;
  }
  function te(z, p, d) {
    var M = z.entry;
    for (z.entry = null; M; ) {
      var F = M.callback;
      p.pendingcb--, F(d), M = M.next;
    }
    p.corkedRequestsFree.next = z;
  }
  return Object.defineProperty(Q.prototype, "destroyed", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._writableState === void 0 ? !1 : this._writableState.destroyed;
    },
    set: function(p) {
      this._writableState && (this._writableState.destroyed = p);
    }
  }), Q.prototype.destroy = l.destroy, Q.prototype._undestroy = l.undestroy, Q.prototype._destroy = function(z, p) {
    p(z);
  }, Hr;
}
var Wr, Ai;
function xt() {
  if (Ai)
    return Wr;
  Ai = 1;
  var t = Object.keys || function(b) {
    var E = [];
    for (var T in b)
      E.push(T);
    return E;
  };
  Wr = u;
  var e = Es(), r = xs();
  ht(u, e);
  for (var n = t(r.prototype), o = 0; o < n.length; o++) {
    var c = n[o];
    u.prototype[c] || (u.prototype[c] = r.prototype[c]);
  }
  function u(b) {
    if (!(this instanceof u))
      return new u(b);
    e.call(this, b), r.call(this, b), this.allowHalfOpen = !0, b && (b.readable === !1 && (this.readable = !1), b.writable === !1 && (this.writable = !1), b.allowHalfOpen === !1 && (this.allowHalfOpen = !1, this.once("end", i)));
  }
  Object.defineProperty(u.prototype, "writableHighWaterMark", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._writableState.highWaterMark;
    }
  }), Object.defineProperty(u.prototype, "writableBuffer", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._writableState && this._writableState.getBuffer();
    }
  }), Object.defineProperty(u.prototype, "writableLength", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._writableState.length;
    }
  });
  function i() {
    this._writableState.ended || ye.nextTick(l, this);
  }
  function l(b) {
    b.end();
  }
  return Object.defineProperty(u.prototype, "destroyed", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._readableState === void 0 || this._writableState === void 0 ? !1 : this._readableState.destroyed && this._writableState.destroyed;
    },
    set: function(E) {
      this._readableState === void 0 || this._writableState === void 0 || (this._readableState.destroyed = E, this._writableState.destroyed = E);
    }
  }), Wr;
}
var Gr = {}, qt = { exports: {} }, Ti;
function mo() {
  return Ti || (Ti = 1, function(t, e) {
    var r = Lt(), n = r.Buffer;
    function o(u, i) {
      for (var l in u)
        i[l] = u[l];
    }
    n.from && n.alloc && n.allocUnsafe && n.allocUnsafeSlow ? t.exports = r : (o(r, e), e.Buffer = c);
    function c(u, i, l) {
      return n(u, i, l);
    }
    o(n, c), c.from = function(u, i, l) {
      if (typeof u == "number")
        throw new TypeError("Argument must not be a number");
      return n(u, i, l);
    }, c.alloc = function(u, i, l) {
      if (typeof u != "number")
        throw new TypeError("Argument must be a number");
      var b = n(u);
      return i !== void 0 ? typeof l == "string" ? b.fill(i, l) : b.fill(i) : b.fill(0), b;
    }, c.allocUnsafe = function(u) {
      if (typeof u != "number")
        throw new TypeError("Argument must be a number");
      return n(u);
    }, c.allocUnsafeSlow = function(u) {
      if (typeof u != "number")
        throw new TypeError("Argument must be a number");
      return r.SlowBuffer(u);
    };
  }(qt, qt.exports)), qt.exports;
}
var Si;
function pn() {
  if (Si)
    return Gr;
  Si = 1;
  var t = mo().Buffer, e = t.isEncoding || function(g) {
    switch (g = "" + g, g && g.toLowerCase()) {
      case "hex":
      case "utf8":
      case "utf-8":
      case "ascii":
      case "binary":
      case "base64":
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
      case "raw":
        return !0;
      default:
        return !1;
    }
  };
  function r(g) {
    if (!g)
      return "utf8";
    for (var x; ; )
      switch (g) {
        case "utf8":
        case "utf-8":
          return "utf8";
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return "utf16le";
        case "latin1":
        case "binary":
          return "latin1";
        case "base64":
        case "ascii":
        case "hex":
          return g;
        default:
          if (x)
            return;
          g = ("" + g).toLowerCase(), x = !0;
      }
  }
  function n(g) {
    var x = r(g);
    if (typeof x != "string" && (t.isEncoding === e || !e(g)))
      throw new Error("Unknown encoding: " + g);
    return x || g;
  }
  Gr.StringDecoder = o;
  function o(g) {
    this.encoding = n(g);
    var x;
    switch (this.encoding) {
      case "utf16le":
        this.text = T, this.end = A, x = 4;
        break;
      case "utf8":
        this.fillLast = l, x = 4;
        break;
      case "base64":
        this.text = m, this.end = v, x = 3;
        break;
      default:
        this.write = y, this.end = S;
        return;
    }
    this.lastNeed = 0, this.lastTotal = 0, this.lastChar = t.allocUnsafe(x);
  }
  o.prototype.write = function(g) {
    if (g.length === 0)
      return "";
    var x, R;
    if (this.lastNeed) {
      if (x = this.fillLast(g), x === void 0)
        return "";
      R = this.lastNeed, this.lastNeed = 0;
    } else
      R = 0;
    return R < g.length ? x ? x + this.text(g, R) : this.text(g, R) : x || "";
  }, o.prototype.end = E, o.prototype.text = b, o.prototype.fillLast = function(g) {
    if (this.lastNeed <= g.length)
      return g.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal);
    g.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, g.length), this.lastNeed -= g.length;
  };
  function c(g) {
    return g <= 127 ? 0 : g >> 5 === 6 ? 2 : g >> 4 === 14 ? 3 : g >> 3 === 30 ? 4 : g >> 6 === 2 ? -1 : -2;
  }
  function u(g, x, R) {
    var D = x.length - 1;
    if (D < R)
      return 0;
    var L = c(x[D]);
    return L >= 0 ? (L > 0 && (g.lastNeed = L - 1), L) : --D < R || L === -2 ? 0 : (L = c(x[D]), L >= 0 ? (L > 0 && (g.lastNeed = L - 2), L) : --D < R || L === -2 ? 0 : (L = c(x[D]), L >= 0 ? (L > 0 && (L === 2 ? L = 0 : g.lastNeed = L - 3), L) : 0));
  }
  function i(g, x, R) {
    if ((x[0] & 192) !== 128)
      return g.lastNeed = 0, "�";
    if (g.lastNeed > 1 && x.length > 1) {
      if ((x[1] & 192) !== 128)
        return g.lastNeed = 1, "�";
      if (g.lastNeed > 2 && x.length > 2 && (x[2] & 192) !== 128)
        return g.lastNeed = 2, "�";
    }
  }
  function l(g) {
    var x = this.lastTotal - this.lastNeed, R = i(this, g);
    if (R !== void 0)
      return R;
    if (this.lastNeed <= g.length)
      return g.copy(this.lastChar, x, 0, this.lastNeed), this.lastChar.toString(this.encoding, 0, this.lastTotal);
    g.copy(this.lastChar, x, 0, g.length), this.lastNeed -= g.length;
  }
  function b(g, x) {
    var R = u(this, g, x);
    if (!this.lastNeed)
      return g.toString("utf8", x);
    this.lastTotal = R;
    var D = g.length - (R - this.lastNeed);
    return g.copy(this.lastChar, 0, D), g.toString("utf8", x, D);
  }
  function E(g) {
    var x = g && g.length ? this.write(g) : "";
    return this.lastNeed ? x + "�" : x;
  }
  function T(g, x) {
    if ((g.length - x) % 2 === 0) {
      var R = g.toString("utf16le", x);
      if (R) {
        var D = R.charCodeAt(R.length - 1);
        if (D >= 55296 && D <= 56319)
          return this.lastNeed = 2, this.lastTotal = 4, this.lastChar[0] = g[g.length - 2], this.lastChar[1] = g[g.length - 1], R.slice(0, -1);
      }
      return R;
    }
    return this.lastNeed = 1, this.lastTotal = 2, this.lastChar[0] = g[g.length - 1], g.toString("utf16le", x, g.length - 1);
  }
  function A(g) {
    var x = g && g.length ? this.write(g) : "";
    if (this.lastNeed) {
      var R = this.lastTotal - this.lastNeed;
      return x + this.lastChar.toString("utf16le", 0, R);
    }
    return x;
  }
  function m(g, x) {
    var R = (g.length - x) % 3;
    return R === 0 ? g.toString("base64", x) : (this.lastNeed = 3 - R, this.lastTotal = 3, R === 1 ? this.lastChar[0] = g[g.length - 1] : (this.lastChar[0] = g[g.length - 2], this.lastChar[1] = g[g.length - 1]), g.toString("base64", x, g.length - R));
  }
  function v(g) {
    var x = g && g.length ? this.write(g) : "";
    return this.lastNeed ? x + this.lastChar.toString("base64", 0, 3 - this.lastNeed) : x;
  }
  function y(g) {
    return g.toString(this.encoding);
  }
  function S(g) {
    return g && g.length ? this.write(g) : "";
  }
  return Gr;
}
var Kr, ki;
function kn() {
  if (ki)
    return Kr;
  ki = 1;
  var t = St().codes.ERR_STREAM_PREMATURE_CLOSE;
  function e(c) {
    var u = !1;
    return function() {
      if (!u) {
        u = !0;
        for (var i = arguments.length, l = new Array(i), b = 0; b < i; b++)
          l[b] = arguments[b];
        c.apply(this, l);
      }
    };
  }
  function r() {
  }
  function n(c) {
    return c.setHeader && typeof c.abort == "function";
  }
  function o(c, u, i) {
    if (typeof u == "function")
      return o(c, null, u);
    u || (u = {}), i = e(i || r);
    var l = u.readable || u.readable !== !1 && c.readable, b = u.writable || u.writable !== !1 && c.writable, E = function() {
      c.writable || A();
    }, T = c._writableState && c._writableState.finished, A = function() {
      b = !1, T = !0, l || i.call(c);
    }, m = c._readableState && c._readableState.endEmitted, v = function() {
      l = !1, m = !0, b || i.call(c);
    }, y = function(R) {
      i.call(c, R);
    }, S = function() {
      var R;
      if (l && !m)
        return (!c._readableState || !c._readableState.ended) && (R = new t()), i.call(c, R);
      if (b && !T)
        return (!c._writableState || !c._writableState.ended) && (R = new t()), i.call(c, R);
    }, g = function() {
      c.req.on("finish", A);
    };
    return n(c) ? (c.on("complete", A), c.on("abort", S), c.req ? g() : c.on("request", g)) : b && !c._writableState && (c.on("end", E), c.on("close", E)), c.on("end", v), c.on("finish", A), u.error !== !1 && c.on("error", y), c.on("close", S), function() {
      c.removeListener("complete", A), c.removeListener("abort", S), c.removeListener("request", g), c.req && c.req.removeListener("finish", A), c.removeListener("end", E), c.removeListener("close", E), c.removeListener("finish", A), c.removeListener("end", v), c.removeListener("error", y), c.removeListener("close", S);
    };
  }
  return Kr = o, Kr;
}
var qr, Ii;
function wo() {
  if (Ii)
    return qr;
  Ii = 1;
  var t;
  function e(g, x, R) {
    return x in g ? Object.defineProperty(g, x, { value: R, enumerable: !0, configurable: !0, writable: !0 }) : g[x] = R, g;
  }
  var r = kn(), n = Symbol("lastResolve"), o = Symbol("lastReject"), c = Symbol("error"), u = Symbol("ended"), i = Symbol("lastPromise"), l = Symbol("handlePromise"), b = Symbol("stream");
  function E(g, x) {
    return {
      value: g,
      done: x
    };
  }
  function T(g) {
    var x = g[n];
    if (x !== null) {
      var R = g[b].read();
      R !== null && (g[i] = null, g[n] = null, g[o] = null, x(E(R, !1)));
    }
  }
  function A(g) {
    ye.nextTick(T, g);
  }
  function m(g, x) {
    return function(R, D) {
      g.then(function() {
        if (x[u]) {
          R(E(void 0, !0));
          return;
        }
        x[l](R, D);
      }, D);
    };
  }
  var v = Object.getPrototypeOf(function() {
  }), y = Object.setPrototypeOf((t = {
    get stream() {
      return this[b];
    },
    next: function() {
      var x = this, R = this[c];
      if (R !== null)
        return Promise.reject(R);
      if (this[u])
        return Promise.resolve(E(void 0, !0));
      if (this[b].destroyed)
        return new Promise(function(G, Q) {
          ye.nextTick(function() {
            x[c] ? Q(x[c]) : G(E(void 0, !0));
          });
        });
      var D = this[i], L;
      if (D)
        L = new Promise(m(D, this));
      else {
        var Y = this[b].read();
        if (Y !== null)
          return Promise.resolve(E(Y, !1));
        L = new Promise(this[l]);
      }
      return this[i] = L, L;
    }
  }, e(t, Symbol.asyncIterator, function() {
    return this;
  }), e(t, "return", function() {
    var x = this;
    return new Promise(function(R, D) {
      x[b].destroy(null, function(L) {
        if (L) {
          D(L);
          return;
        }
        R(E(void 0, !0));
      });
    });
  }), t), v), S = function(x) {
    var R, D = Object.create(y, (R = {}, e(R, b, {
      value: x,
      writable: !0
    }), e(R, n, {
      value: null,
      writable: !0
    }), e(R, o, {
      value: null,
      writable: !0
    }), e(R, c, {
      value: null,
      writable: !0
    }), e(R, u, {
      value: x._readableState.endEmitted,
      writable: !0
    }), e(R, l, {
      value: function(Y, G) {
        var Q = D[b].read();
        Q ? (D[i] = null, D[n] = null, D[o] = null, Y(E(Q, !1))) : (D[n] = Y, D[o] = G);
      },
      writable: !0
    }), R));
    return D[i] = null, r(x, function(L) {
      if (L && L.code !== "ERR_STREAM_PREMATURE_CLOSE") {
        var Y = D[o];
        Y !== null && (D[i] = null, D[n] = null, D[o] = null, Y(L)), D[c] = L;
        return;
      }
      var G = D[n];
      G !== null && (D[i] = null, D[n] = null, D[o] = null, G(E(void 0, !0))), D[u] = !0;
    }), x.on("readable", A.bind(null, D)), D;
  };
  return qr = S, qr;
}
var Vr, Ri;
function go() {
  return Ri || (Ri = 1, Vr = function() {
    throw new Error("Readable.from is not available in the browser");
  }), Vr;
}
var $r, Ci;
function Es() {
  if (Ci)
    return $r;
  Ci = 1, $r = k;
  var t;
  k.ReadableState = Q, En.EventEmitter;
  var e = function(N, Z) {
    return N.listeners(Z).length;
  }, r = ds(), n = Lt().Buffer, o = je.Uint8Array || function() {
  };
  function c(I) {
    return n.from(I);
  }
  function u(I) {
    return n.isBuffer(I) || I instanceof o;
  }
  var i = bs(), l;
  i && i.debuglog ? l = i.debuglog("stream") : l = function() {
  };
  var b = fo(), E = vs(), T = _s(), A = T.getHighWaterMark, m = St().codes, v = m.ERR_INVALID_ARG_TYPE, y = m.ERR_STREAM_PUSH_AFTER_EOF, S = m.ERR_METHOD_NOT_IMPLEMENTED, g = m.ERR_STREAM_UNSHIFT_AFTER_END_EVENT, x, R, D;
  ht(k, r);
  var L = E.errorOrDestroy, Y = ["error", "close", "destroy", "pause", "resume"];
  function G(I, N, Z) {
    if (typeof I.prependListener == "function")
      return I.prependListener(N, Z);
    !I._events || !I._events[N] ? I.on(N, Z) : Array.isArray(I._events[N]) ? I._events[N].unshift(Z) : I._events[N] = [Z, I._events[N]];
  }
  function Q(I, N, Z) {
    t = t || xt(), I = I || {}, typeof Z != "boolean" && (Z = N instanceof t), this.objectMode = !!I.objectMode, Z && (this.objectMode = this.objectMode || !!I.readableObjectMode), this.highWaterMark = A(this, I, "readableHighWaterMark", Z), this.buffer = new b(), this.length = 0, this.pipes = null, this.pipesCount = 0, this.flowing = null, this.ended = !1, this.endEmitted = !1, this.reading = !1, this.sync = !0, this.needReadable = !1, this.emittedReadable = !1, this.readableListening = !1, this.resumeScheduled = !1, this.paused = !0, this.emitClose = I.emitClose !== !1, this.autoDestroy = !!I.autoDestroy, this.destroyed = !1, this.defaultEncoding = I.defaultEncoding || "utf8", this.awaitDrain = 0, this.readingMore = !1, this.decoder = null, this.encoding = null, I.encoding && (x || (x = pn().StringDecoder), this.decoder = new x(I.encoding), this.encoding = I.encoding);
  }
  function k(I) {
    if (t = t || xt(), !(this instanceof k))
      return new k(I);
    var N = this instanceof t;
    this._readableState = new Q(I, this, N), this.readable = !0, I && (typeof I.read == "function" && (this._read = I.read), typeof I.destroy == "function" && (this._destroy = I.destroy)), r.call(this);
  }
  Object.defineProperty(k.prototype, "destroyed", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._readableState === void 0 ? !1 : this._readableState.destroyed;
    },
    set: function(N) {
      this._readableState && (this._readableState.destroyed = N);
    }
  }), k.prototype.destroy = E.destroy, k.prototype._undestroy = E.undestroy, k.prototype._destroy = function(I, N) {
    N(I);
  }, k.prototype.push = function(I, N) {
    var Z = this._readableState, f;
    return Z.objectMode ? f = !0 : typeof I == "string" && (N = N || Z.defaultEncoding, N !== Z.encoding && (I = n.from(I, N), N = ""), f = !0), se(this, I, N, !1, f);
  }, k.prototype.unshift = function(I) {
    return se(this, I, null, !0, !1);
  };
  function se(I, N, Z, f, V) {
    l("readableAddChunk", N);
    var w = I._readableState;
    if (N === null)
      w.reading = !1, fe(I, w);
    else {
      var s;
      if (V || (s = P(w, N)), s)
        L(I, s);
      else if (w.objectMode || N && N.length > 0)
        if (typeof N != "string" && !w.objectMode && Object.getPrototypeOf(N) !== n.prototype && (N = c(N)), f)
          w.endEmitted ? L(I, new g()) : ue(I, w, N, !0);
        else if (w.ended)
          L(I, new y());
        else {
          if (w.destroyed)
            return !1;
          w.reading = !1, w.decoder && !Z ? (N = w.decoder.write(N), w.objectMode || N.length !== 0 ? ue(I, w, N, !1) : ne(I, w)) : ue(I, w, N, !1);
        }
      else
        f || (w.reading = !1, ne(I, w));
    }
    return !w.ended && (w.length < w.highWaterMark || w.length === 0);
  }
  function ue(I, N, Z, f) {
    N.flowing && N.length === 0 && !N.sync ? (N.awaitDrain = 0, I.emit("data", Z)) : (N.length += N.objectMode ? 1 : Z.length, f ? N.buffer.unshift(Z) : N.buffer.push(Z), N.needReadable && $(I)), ne(I, N);
  }
  function P(I, N) {
    var Z;
    return !u(N) && typeof N != "string" && N !== void 0 && !I.objectMode && (Z = new v("chunk", ["string", "Buffer", "Uint8Array"], N)), Z;
  }
  k.prototype.isPaused = function() {
    return this._readableState.flowing === !1;
  }, k.prototype.setEncoding = function(I) {
    x || (x = pn().StringDecoder);
    var N = new x(I);
    this._readableState.decoder = N, this._readableState.encoding = this._readableState.decoder.encoding;
    for (var Z = this._readableState.buffer.head, f = ""; Z !== null; )
      f += N.write(Z.data), Z = Z.next;
    return this._readableState.buffer.clear(), f !== "" && this._readableState.buffer.push(f), this._readableState.length = f.length, this;
  };
  var K = 1073741824;
  function _(I) {
    return I >= K ? I = K : (I--, I |= I >>> 1, I |= I >>> 2, I |= I >>> 4, I |= I >>> 8, I |= I >>> 16, I++), I;
  }
  function J(I, N) {
    return I <= 0 || N.length === 0 && N.ended ? 0 : N.objectMode ? 1 : I !== I ? N.flowing && N.length ? N.buffer.head.data.length : N.length : (I > N.highWaterMark && (N.highWaterMark = _(I)), I <= N.length ? I : N.ended ? N.length : (N.needReadable = !0, 0));
  }
  k.prototype.read = function(I) {
    l("read", I), I = parseInt(I, 10);
    var N = this._readableState, Z = I;
    if (I !== 0 && (N.emittedReadable = !1), I === 0 && N.needReadable && ((N.highWaterMark !== 0 ? N.length >= N.highWaterMark : N.length > 0) || N.ended))
      return l("read: emitReadable", N.length, N.ended), N.length === 0 && N.ended ? d(this) : $(this), null;
    if (I = J(I, N), I === 0 && N.ended)
      return N.length === 0 && d(this), null;
    var f = N.needReadable;
    l("need readable", f), (N.length === 0 || N.length - I < N.highWaterMark) && (f = !0, l("length less than watermark", f)), N.ended || N.reading ? (f = !1, l("reading or ended", f)) : f && (l("do read"), N.reading = !0, N.sync = !0, N.length === 0 && (N.needReadable = !0), this._read(N.highWaterMark), N.sync = !1, N.reading || (I = J(Z, N)));
    var V;
    return I > 0 ? V = p(I, N) : V = null, V === null ? (N.needReadable = N.length <= N.highWaterMark, I = 0) : (N.length -= I, N.awaitDrain = 0), N.length === 0 && (N.ended || (N.needReadable = !0), Z !== I && N.ended && d(this)), V !== null && this.emit("data", V), V;
  };
  function fe(I, N) {
    if (l("onEofChunk"), !N.ended) {
      if (N.decoder) {
        var Z = N.decoder.end();
        Z && Z.length && (N.buffer.push(Z), N.length += N.objectMode ? 1 : Z.length);
      }
      N.ended = !0, N.sync ? $(I) : (N.needReadable = !1, N.emittedReadable || (N.emittedReadable = !0, pe(I)));
    }
  }
  function $(I) {
    var N = I._readableState;
    l("emitReadable", N.needReadable, N.emittedReadable), N.needReadable = !1, N.emittedReadable || (l("emitReadable", N.flowing), N.emittedReadable = !0, ye.nextTick(pe, I));
  }
  function pe(I) {
    var N = I._readableState;
    l("emitReadable_", N.destroyed, N.length, N.ended), !N.destroyed && (N.length || N.ended) && (I.emit("readable"), N.emittedReadable = !1), N.needReadable = !N.flowing && !N.ended && N.length <= N.highWaterMark, z(I);
  }
  function ne(I, N) {
    N.readingMore || (N.readingMore = !0, ye.nextTick(he, I, N));
  }
  function he(I, N) {
    for (; !N.reading && !N.ended && (N.length < N.highWaterMark || N.flowing && N.length === 0); ) {
      var Z = N.length;
      if (l("maybeReadMore read 0"), I.read(0), Z === N.length)
        break;
    }
    N.readingMore = !1;
  }
  k.prototype._read = function(I) {
    L(this, new S("_read()"));
  }, k.prototype.pipe = function(I, N) {
    var Z = this, f = this._readableState;
    switch (f.pipesCount) {
      case 0:
        f.pipes = I;
        break;
      case 1:
        f.pipes = [f.pipes, I];
        break;
      default:
        f.pipes.push(I);
        break;
    }
    f.pipesCount += 1, l("pipe count=%d opts=%j", f.pipesCount, N);
    var V = (!N || N.end !== !1) && I !== ye.stdout && I !== ye.stderr, w = V ? a : ce;
    f.endEmitted ? ye.nextTick(w) : Z.once("end", w), I.on("unpipe", s);
    function s(me, we) {
      l("onunpipe"), me === Z && we && we.hasUnpiped === !1 && (we.hasUnpiped = !0, U());
    }
    function a() {
      l("onend"), I.end();
    }
    var h = j(Z);
    I.on("drain", h);
    var O = !1;
    function U() {
      l("cleanup"), I.removeListener("close", oe), I.removeListener("finish", ie), I.removeListener("drain", h), I.removeListener("error", re), I.removeListener("unpipe", s), Z.removeListener("end", a), Z.removeListener("end", ce), Z.removeListener("data", B), O = !0, f.awaitDrain && (!I._writableState || I._writableState.needDrain) && h();
    }
    Z.on("data", B);
    function B(me) {
      l("ondata");
      var we = I.write(me);
      l("dest.write", we), we === !1 && ((f.pipesCount === 1 && f.pipes === I || f.pipesCount > 1 && F(f.pipes, I) !== -1) && !O && (l("false write response, pause", f.awaitDrain), f.awaitDrain++), Z.pause());
    }
    function re(me) {
      l("onerror", me), ce(), I.removeListener("error", re), e(I, "error") === 0 && L(I, me);
    }
    G(I, "error", re);
    function oe() {
      I.removeListener("finish", ie), ce();
    }
    I.once("close", oe);
    function ie() {
      l("onfinish"), I.removeListener("close", oe), ce();
    }
    I.once("finish", ie);
    function ce() {
      l("unpipe"), Z.unpipe(I);
    }
    return I.emit("pipe", Z), f.flowing || (l("pipe resume"), Z.resume()), I;
  };
  function j(I) {
    return function() {
      var Z = I._readableState;
      l("pipeOnDrain", Z.awaitDrain), Z.awaitDrain && Z.awaitDrain--, Z.awaitDrain === 0 && e(I, "data") && (Z.flowing = !0, z(I));
    };
  }
  k.prototype.unpipe = function(I) {
    var N = this._readableState, Z = {
      hasUnpiped: !1
    };
    if (N.pipesCount === 0)
      return this;
    if (N.pipesCount === 1)
      return I && I !== N.pipes ? this : (I || (I = N.pipes), N.pipes = null, N.pipesCount = 0, N.flowing = !1, I && I.emit("unpipe", this, Z), this);
    if (!I) {
      var f = N.pipes, V = N.pipesCount;
      N.pipes = null, N.pipesCount = 0, N.flowing = !1;
      for (var w = 0; w < V; w++)
        f[w].emit("unpipe", this, {
          hasUnpiped: !1
        });
      return this;
    }
    var s = F(N.pipes, I);
    return s === -1 ? this : (N.pipes.splice(s, 1), N.pipesCount -= 1, N.pipesCount === 1 && (N.pipes = N.pipes[0]), I.emit("unpipe", this, Z), this);
  }, k.prototype.on = function(I, N) {
    var Z = r.prototype.on.call(this, I, N), f = this._readableState;
    return I === "data" ? (f.readableListening = this.listenerCount("readable") > 0, f.flowing !== !1 && this.resume()) : I === "readable" && !f.endEmitted && !f.readableListening && (f.readableListening = f.needReadable = !0, f.flowing = !1, f.emittedReadable = !1, l("on readable", f.length, f.reading), f.length ? $(this) : f.reading || ye.nextTick(H, this)), Z;
  }, k.prototype.addListener = k.prototype.on, k.prototype.removeListener = function(I, N) {
    var Z = r.prototype.removeListener.call(this, I, N);
    return I === "readable" && ye.nextTick(C, this), Z;
  }, k.prototype.removeAllListeners = function(I) {
    var N = r.prototype.removeAllListeners.apply(this, arguments);
    return (I === "readable" || I === void 0) && ye.nextTick(C, this), N;
  };
  function C(I) {
    var N = I._readableState;
    N.readableListening = I.listenerCount("readable") > 0, N.resumeScheduled && !N.paused ? N.flowing = !0 : I.listenerCount("data") > 0 && I.resume();
  }
  function H(I) {
    l("readable nexttick read 0"), I.read(0);
  }
  k.prototype.resume = function() {
    var I = this._readableState;
    return I.flowing || (l("resume"), I.flowing = !I.readableListening, W(this, I)), I.paused = !1, this;
  };
  function W(I, N) {
    N.resumeScheduled || (N.resumeScheduled = !0, ye.nextTick(te, I, N));
  }
  function te(I, N) {
    l("resume", N.reading), N.reading || I.read(0), N.resumeScheduled = !1, I.emit("resume"), z(I), N.flowing && !N.reading && I.read(0);
  }
  k.prototype.pause = function() {
    return l("call pause flowing=%j", this._readableState.flowing), this._readableState.flowing !== !1 && (l("pause"), this._readableState.flowing = !1, this.emit("pause")), this._readableState.paused = !0, this;
  };
  function z(I) {
    var N = I._readableState;
    for (l("flow", N.flowing); N.flowing && I.read() !== null; )
      ;
  }
  k.prototype.wrap = function(I) {
    var N = this, Z = this._readableState, f = !1;
    I.on("end", function() {
      if (l("wrapped end"), Z.decoder && !Z.ended) {
        var s = Z.decoder.end();
        s && s.length && N.push(s);
      }
      N.push(null);
    }), I.on("data", function(s) {
      if (l("wrapped data"), Z.decoder && (s = Z.decoder.write(s)), !(Z.objectMode && s == null) && !(!Z.objectMode && (!s || !s.length))) {
        var a = N.push(s);
        a || (f = !0, I.pause());
      }
    });
    for (var V in I)
      this[V] === void 0 && typeof I[V] == "function" && (this[V] = function(a) {
        return function() {
          return I[a].apply(I, arguments);
        };
      }(V));
    for (var w = 0; w < Y.length; w++)
      I.on(Y[w], this.emit.bind(this, Y[w]));
    return this._read = function(s) {
      l("wrapped _read", s), f && (f = !1, I.resume());
    }, this;
  }, typeof Symbol == "function" && (k.prototype[Symbol.asyncIterator] = function() {
    return R === void 0 && (R = wo()), R(this);
  }), Object.defineProperty(k.prototype, "readableHighWaterMark", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._readableState.highWaterMark;
    }
  }), Object.defineProperty(k.prototype, "readableBuffer", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._readableState && this._readableState.buffer;
    }
  }), Object.defineProperty(k.prototype, "readableFlowing", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._readableState.flowing;
    },
    set: function(N) {
      this._readableState && (this._readableState.flowing = N);
    }
  }), k._fromList = p, Object.defineProperty(k.prototype, "readableLength", {
    // making it explicit this property is not enumerable
    // because otherwise some prototype manipulation in
    // userland will fail
    enumerable: !1,
    get: function() {
      return this._readableState.length;
    }
  });
  function p(I, N) {
    if (N.length === 0)
      return null;
    var Z;
    return N.objectMode ? Z = N.buffer.shift() : !I || I >= N.length ? (N.decoder ? Z = N.buffer.join("") : N.buffer.length === 1 ? Z = N.buffer.first() : Z = N.buffer.concat(N.length), N.buffer.clear()) : Z = N.buffer.consume(I, N.decoder), Z;
  }
  function d(I) {
    var N = I._readableState;
    l("endReadable", N.endEmitted), N.endEmitted || (N.ended = !0, ye.nextTick(M, N, I));
  }
  function M(I, N) {
    if (l("endReadableNT", I.endEmitted, I.length), !I.endEmitted && I.length === 0 && (I.endEmitted = !0, N.readable = !1, N.emit("end"), I.autoDestroy)) {
      var Z = N._writableState;
      (!Z || Z.autoDestroy && Z.finished) && N.destroy();
    }
  }
  typeof Symbol == "function" && (k.from = function(I, N) {
    return D === void 0 && (D = go()), D(k, I, N);
  });
  function F(I, N) {
    for (var Z = 0, f = I.length; Z < f; Z++)
      if (I[Z] === N)
        return Z;
    return -1;
  }
  return $r;
}
var Xr, Ni;
function As() {
  if (Ni)
    return Xr;
  Ni = 1, Xr = i;
  var t = St().codes, e = t.ERR_METHOD_NOT_IMPLEMENTED, r = t.ERR_MULTIPLE_CALLBACK, n = t.ERR_TRANSFORM_ALREADY_TRANSFORMING, o = t.ERR_TRANSFORM_WITH_LENGTH_0, c = xt();
  ht(i, c);
  function u(E, T) {
    var A = this._transformState;
    A.transforming = !1;
    var m = A.writecb;
    if (m === null)
      return this.emit("error", new r());
    A.writechunk = null, A.writecb = null, T != null && this.push(T), m(E);
    var v = this._readableState;
    v.reading = !1, (v.needReadable || v.length < v.highWaterMark) && this._read(v.highWaterMark);
  }
  function i(E) {
    if (!(this instanceof i))
      return new i(E);
    c.call(this, E), this._transformState = {
      afterTransform: u.bind(this),
      needTransform: !1,
      transforming: !1,
      writecb: null,
      writechunk: null,
      writeencoding: null
    }, this._readableState.needReadable = !0, this._readableState.sync = !1, E && (typeof E.transform == "function" && (this._transform = E.transform), typeof E.flush == "function" && (this._flush = E.flush)), this.on("prefinish", l);
  }
  function l() {
    var E = this;
    typeof this._flush == "function" && !this._readableState.destroyed ? this._flush(function(T, A) {
      b(E, T, A);
    }) : b(this, null, null);
  }
  i.prototype.push = function(E, T) {
    return this._transformState.needTransform = !1, c.prototype.push.call(this, E, T);
  }, i.prototype._transform = function(E, T, A) {
    A(new e("_transform()"));
  }, i.prototype._write = function(E, T, A) {
    var m = this._transformState;
    if (m.writecb = A, m.writechunk = E, m.writeencoding = T, !m.transforming) {
      var v = this._readableState;
      (m.needTransform || v.needReadable || v.length < v.highWaterMark) && this._read(v.highWaterMark);
    }
  }, i.prototype._read = function(E) {
    var T = this._transformState;
    T.writechunk !== null && !T.transforming ? (T.transforming = !0, this._transform(T.writechunk, T.writeencoding, T.afterTransform)) : T.needTransform = !0;
  }, i.prototype._destroy = function(E, T) {
    c.prototype._destroy.call(this, E, function(A) {
      T(A);
    });
  };
  function b(E, T, A) {
    if (T)
      return E.emit("error", T);
    if (A != null && E.push(A), E._writableState.length)
      throw new o();
    if (E._transformState.transforming)
      throw new n();
    return E.push(null);
  }
  return Xr;
}
var Zr, Oi;
function yo() {
  if (Oi)
    return Zr;
  Oi = 1, Zr = e;
  var t = As();
  ht(e, t);
  function e(r) {
    if (!(this instanceof e))
      return new e(r);
    t.call(this, r);
  }
  return e.prototype._transform = function(r, n, o) {
    o(null, r);
  }, Zr;
}
var Yr, Di;
function bo() {
  if (Di)
    return Yr;
  Di = 1;
  var t;
  function e(A) {
    var m = !1;
    return function() {
      m || (m = !0, A.apply(void 0, arguments));
    };
  }
  var r = St().codes, n = r.ERR_MISSING_ARGS, o = r.ERR_STREAM_DESTROYED;
  function c(A) {
    if (A)
      throw A;
  }
  function u(A) {
    return A.setHeader && typeof A.abort == "function";
  }
  function i(A, m, v, y) {
    y = e(y);
    var S = !1;
    A.on("close", function() {
      S = !0;
    }), t === void 0 && (t = kn()), t(A, {
      readable: m,
      writable: v
    }, function(x) {
      if (x)
        return y(x);
      S = !0, y();
    });
    var g = !1;
    return function(x) {
      if (!S && !g) {
        if (g = !0, u(A))
          return A.abort();
        if (typeof A.destroy == "function")
          return A.destroy();
        y(x || new o("pipe"));
      }
    };
  }
  function l(A) {
    A();
  }
  function b(A, m) {
    return A.pipe(m);
  }
  function E(A) {
    return !A.length || typeof A[A.length - 1] != "function" ? c : A.pop();
  }
  function T() {
    for (var A = arguments.length, m = new Array(A), v = 0; v < A; v++)
      m[v] = arguments[v];
    var y = E(m);
    if (Array.isArray(m[0]) && (m = m[0]), m.length < 2)
      throw new n("streams");
    var S, g = m.map(function(x, R) {
      var D = R < m.length - 1, L = R > 0;
      return i(x, D, L, function(Y) {
        S || (S = Y), Y && g.forEach(l), !D && (g.forEach(l), y(S));
      });
    });
    return m.reduce(b);
  }
  return Yr = T, Yr;
}
var In = Le, Rn = En.EventEmitter, vo = ht;
vo(Le, Rn);
Le.Readable = Es();
Le.Writable = xs();
Le.Duplex = xt();
Le.Transform = As();
Le.PassThrough = yo();
Le.finished = kn();
Le.pipeline = bo();
Le.Stream = Le;
function Le() {
  Rn.call(this);
}
Le.prototype.pipe = function(t, e) {
  var r = this;
  function n(E) {
    t.writable && t.write(E) === !1 && r.pause && r.pause();
  }
  r.on("data", n);
  function o() {
    r.readable && r.resume && r.resume();
  }
  t.on("drain", o), !t._isStdio && (!e || e.end !== !1) && (r.on("end", u), r.on("close", i));
  var c = !1;
  function u() {
    c || (c = !0, t.end());
  }
  function i() {
    c || (c = !0, typeof t.destroy == "function" && t.destroy());
  }
  function l(E) {
    if (b(), Rn.listenerCount(this, "error") === 0)
      throw E;
  }
  r.on("error", l), t.on("error", l);
  function b() {
    r.removeListener("data", n), t.removeListener("drain", o), r.removeListener("end", u), r.removeListener("close", i), r.removeListener("error", l), t.removeListener("error", l), r.removeListener("end", b), r.removeListener("close", b), t.removeListener("close", b);
  }
  return r.on("end", b), r.on("close", b), t.on("close", b), t.emit("pipe", r), t;
};
(function(t) {
  (function(e) {
    e.parser = function(p, d) {
      return new n(p, d);
    }, e.SAXParser = n, e.SAXStream = E, e.createStream = b, e.MAX_BUFFER_LENGTH = 64 * 1024;
    var r = [
      "comment",
      "sgmlDecl",
      "textNode",
      "tagName",
      "doctype",
      "procInstName",
      "procInstBody",
      "entity",
      "attribName",
      "attribValue",
      "cdata",
      "script"
    ];
    e.EVENTS = [
      "text",
      "processinginstruction",
      "sgmldeclaration",
      "doctype",
      "comment",
      "opentagstart",
      "attribute",
      "opentag",
      "closetag",
      "opencdata",
      "cdata",
      "closecdata",
      "error",
      "end",
      "ready",
      "script",
      "opennamespace",
      "closenamespace"
    ];
    function n(p, d) {
      if (!(this instanceof n))
        return new n(p, d);
      var M = this;
      c(M), M.q = M.c = "", M.bufferCheckPosition = e.MAX_BUFFER_LENGTH, M.opt = d || {}, M.opt.lowercase = M.opt.lowercase || M.opt.lowercasetags, M.looseCase = M.opt.lowercase ? "toLowerCase" : "toUpperCase", M.tags = [], M.closed = M.closedRoot = M.sawRoot = !1, M.tag = M.error = null, M.strict = !!p, M.noscript = !!(p || M.opt.noscript), M.state = k.BEGIN, M.strictEntities = M.opt.strictEntities, M.ENTITIES = M.strictEntities ? Object.create(e.XML_ENTITIES) : Object.create(e.ENTITIES), M.attribList = [], M.opt.xmlns && (M.ns = Object.create(y)), M.trackPosition = M.opt.position !== !1, M.trackPosition && (M.position = M.line = M.column = 0), ue(M, "onready");
    }
    Object.create || (Object.create = function(p) {
      function d() {
      }
      d.prototype = p;
      var M = new d();
      return M;
    }), Object.keys || (Object.keys = function(p) {
      var d = [];
      for (var M in p)
        p.hasOwnProperty(M) && d.push(M);
      return d;
    });
    function o(p) {
      for (var d = Math.max(e.MAX_BUFFER_LENGTH, 10), M = 0, F = 0, I = r.length; F < I; F++) {
        var N = p[r[F]].length;
        if (N > d)
          switch (r[F]) {
            case "textNode":
              K(p);
              break;
            case "cdata":
              P(p, "oncdata", p.cdata), p.cdata = "";
              break;
            case "script":
              P(p, "onscript", p.script), p.script = "";
              break;
            default:
              J(p, "Max buffer length exceeded: " + r[F]);
          }
        M = Math.max(M, N);
      }
      var Z = e.MAX_BUFFER_LENGTH - M;
      p.bufferCheckPosition = Z + p.position;
    }
    function c(p) {
      for (var d = 0, M = r.length; d < M; d++)
        p[r[d]] = "";
    }
    function u(p) {
      K(p), p.cdata !== "" && (P(p, "oncdata", p.cdata), p.cdata = ""), p.script !== "" && (P(p, "onscript", p.script), p.script = "");
    }
    n.prototype = {
      end: function() {
        fe(this);
      },
      write: z,
      resume: function() {
        return this.error = null, this;
      },
      close: function() {
        return this.write(null);
      },
      flush: function() {
        u(this);
      }
    };
    var i;
    try {
      i = In.Stream;
    } catch {
      i = function() {
      };
    }
    var l = e.EVENTS.filter(function(p) {
      return p !== "error" && p !== "end";
    });
    function b(p, d) {
      return new E(p, d);
    }
    function E(p, d) {
      if (!(this instanceof E))
        return new E(p, d);
      i.apply(this), this._parser = new n(p, d), this.writable = !0, this.readable = !0;
      var M = this;
      this._parser.onend = function() {
        M.emit("end");
      }, this._parser.onerror = function(F) {
        M.emit("error", F), M._parser.error = null;
      }, this._decoder = null, l.forEach(function(F) {
        Object.defineProperty(M, "on" + F, {
          get: function() {
            return M._parser["on" + F];
          },
          set: function(I) {
            if (!I)
              return M.removeAllListeners(F), M._parser["on" + F] = I, I;
            M.on(F, I);
          },
          enumerable: !0,
          configurable: !1
        });
      });
    }
    E.prototype = Object.create(i.prototype, {
      constructor: {
        value: E
      }
    }), E.prototype.write = function(p) {
      if (typeof Buffer == "function" && typeof Buffer.isBuffer == "function" && Buffer.isBuffer(p)) {
        if (!this._decoder) {
          var d = pn().StringDecoder;
          this._decoder = new d("utf8");
        }
        p = this._decoder.write(p);
      }
      return this._parser.write(p.toString()), this.emit("data", p), !0;
    }, E.prototype.end = function(p) {
      return p && p.length && this.write(p), this._parser.end(), !0;
    }, E.prototype.on = function(p, d) {
      var M = this;
      return !M._parser["on" + p] && l.indexOf(p) !== -1 && (M._parser["on" + p] = function() {
        var F = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
        F.splice(0, 0, p), M.emit.apply(M, F);
      }), i.prototype.on.call(M, p, d);
    };
    var T = "[CDATA[", A = "DOCTYPE", m = "http://www.w3.org/XML/1998/namespace", v = "http://www.w3.org/2000/xmlns/", y = { xml: m, xmlns: v }, S = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, g = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/, x = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, R = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
    function D(p) {
      return p === " " || p === `
` || p === "\r" || p === "	";
    }
    function L(p) {
      return p === '"' || p === "'";
    }
    function Y(p) {
      return p === ">" || D(p);
    }
    function G(p, d) {
      return p.test(d);
    }
    function Q(p, d) {
      return !G(p, d);
    }
    var k = 0;
    e.STATE = {
      BEGIN: k++,
      // leading byte order mark or whitespace
      BEGIN_WHITESPACE: k++,
      // leading whitespace
      TEXT: k++,
      // general stuff
      TEXT_ENTITY: k++,
      // &amp and such.
      OPEN_WAKA: k++,
      // <
      SGML_DECL: k++,
      // <!BLARG
      SGML_DECL_QUOTED: k++,
      // <!BLARG foo "bar
      DOCTYPE: k++,
      // <!DOCTYPE
      DOCTYPE_QUOTED: k++,
      // <!DOCTYPE "//blah
      DOCTYPE_DTD: k++,
      // <!DOCTYPE "//blah" [ ...
      DOCTYPE_DTD_QUOTED: k++,
      // <!DOCTYPE "//blah" [ "foo
      COMMENT_STARTING: k++,
      // <!-
      COMMENT: k++,
      // <!--
      COMMENT_ENDING: k++,
      // <!-- blah -
      COMMENT_ENDED: k++,
      // <!-- blah --
      CDATA: k++,
      // <![CDATA[ something
      CDATA_ENDING: k++,
      // ]
      CDATA_ENDING_2: k++,
      // ]]
      PROC_INST: k++,
      // <?hi
      PROC_INST_BODY: k++,
      // <?hi there
      PROC_INST_ENDING: k++,
      // <?hi "there" ?
      OPEN_TAG: k++,
      // <strong
      OPEN_TAG_SLASH: k++,
      // <strong /
      ATTRIB: k++,
      // <a
      ATTRIB_NAME: k++,
      // <a foo
      ATTRIB_NAME_SAW_WHITE: k++,
      // <a foo _
      ATTRIB_VALUE: k++,
      // <a foo=
      ATTRIB_VALUE_QUOTED: k++,
      // <a foo="bar
      ATTRIB_VALUE_CLOSED: k++,
      // <a foo="bar"
      ATTRIB_VALUE_UNQUOTED: k++,
      // <a foo=bar
      ATTRIB_VALUE_ENTITY_Q: k++,
      // <foo bar="&quot;"
      ATTRIB_VALUE_ENTITY_U: k++,
      // <foo bar=&quot
      CLOSE_TAG: k++,
      // </a
      CLOSE_TAG_SAW_WHITE: k++,
      // </a   >
      SCRIPT: k++,
      // <script> ...
      SCRIPT_ENDING: k++
      // <script> ... <
    }, e.XML_ENTITIES = {
      amp: "&",
      gt: ">",
      lt: "<",
      quot: '"',
      apos: "'"
    }, e.ENTITIES = {
      amp: "&",
      gt: ">",
      lt: "<",
      quot: '"',
      apos: "'",
      AElig: 198,
      Aacute: 193,
      Acirc: 194,
      Agrave: 192,
      Aring: 197,
      Atilde: 195,
      Auml: 196,
      Ccedil: 199,
      ETH: 208,
      Eacute: 201,
      Ecirc: 202,
      Egrave: 200,
      Euml: 203,
      Iacute: 205,
      Icirc: 206,
      Igrave: 204,
      Iuml: 207,
      Ntilde: 209,
      Oacute: 211,
      Ocirc: 212,
      Ograve: 210,
      Oslash: 216,
      Otilde: 213,
      Ouml: 214,
      THORN: 222,
      Uacute: 218,
      Ucirc: 219,
      Ugrave: 217,
      Uuml: 220,
      Yacute: 221,
      aacute: 225,
      acirc: 226,
      aelig: 230,
      agrave: 224,
      aring: 229,
      atilde: 227,
      auml: 228,
      ccedil: 231,
      eacute: 233,
      ecirc: 234,
      egrave: 232,
      eth: 240,
      euml: 235,
      iacute: 237,
      icirc: 238,
      igrave: 236,
      iuml: 239,
      ntilde: 241,
      oacute: 243,
      ocirc: 244,
      ograve: 242,
      oslash: 248,
      otilde: 245,
      ouml: 246,
      szlig: 223,
      thorn: 254,
      uacute: 250,
      ucirc: 251,
      ugrave: 249,
      uuml: 252,
      yacute: 253,
      yuml: 255,
      copy: 169,
      reg: 174,
      nbsp: 160,
      iexcl: 161,
      cent: 162,
      pound: 163,
      curren: 164,
      yen: 165,
      brvbar: 166,
      sect: 167,
      uml: 168,
      ordf: 170,
      laquo: 171,
      not: 172,
      shy: 173,
      macr: 175,
      deg: 176,
      plusmn: 177,
      sup1: 185,
      sup2: 178,
      sup3: 179,
      acute: 180,
      micro: 181,
      para: 182,
      middot: 183,
      cedil: 184,
      ordm: 186,
      raquo: 187,
      frac14: 188,
      frac12: 189,
      frac34: 190,
      iquest: 191,
      times: 215,
      divide: 247,
      OElig: 338,
      oelig: 339,
      Scaron: 352,
      scaron: 353,
      Yuml: 376,
      fnof: 402,
      circ: 710,
      tilde: 732,
      Alpha: 913,
      Beta: 914,
      Gamma: 915,
      Delta: 916,
      Epsilon: 917,
      Zeta: 918,
      Eta: 919,
      Theta: 920,
      Iota: 921,
      Kappa: 922,
      Lambda: 923,
      Mu: 924,
      Nu: 925,
      Xi: 926,
      Omicron: 927,
      Pi: 928,
      Rho: 929,
      Sigma: 931,
      Tau: 932,
      Upsilon: 933,
      Phi: 934,
      Chi: 935,
      Psi: 936,
      Omega: 937,
      alpha: 945,
      beta: 946,
      gamma: 947,
      delta: 948,
      epsilon: 949,
      zeta: 950,
      eta: 951,
      theta: 952,
      iota: 953,
      kappa: 954,
      lambda: 955,
      mu: 956,
      nu: 957,
      xi: 958,
      omicron: 959,
      pi: 960,
      rho: 961,
      sigmaf: 962,
      sigma: 963,
      tau: 964,
      upsilon: 965,
      phi: 966,
      chi: 967,
      psi: 968,
      omega: 969,
      thetasym: 977,
      upsih: 978,
      piv: 982,
      ensp: 8194,
      emsp: 8195,
      thinsp: 8201,
      zwnj: 8204,
      zwj: 8205,
      lrm: 8206,
      rlm: 8207,
      ndash: 8211,
      mdash: 8212,
      lsquo: 8216,
      rsquo: 8217,
      sbquo: 8218,
      ldquo: 8220,
      rdquo: 8221,
      bdquo: 8222,
      dagger: 8224,
      Dagger: 8225,
      bull: 8226,
      hellip: 8230,
      permil: 8240,
      prime: 8242,
      Prime: 8243,
      lsaquo: 8249,
      rsaquo: 8250,
      oline: 8254,
      frasl: 8260,
      euro: 8364,
      image: 8465,
      weierp: 8472,
      real: 8476,
      trade: 8482,
      alefsym: 8501,
      larr: 8592,
      uarr: 8593,
      rarr: 8594,
      darr: 8595,
      harr: 8596,
      crarr: 8629,
      lArr: 8656,
      uArr: 8657,
      rArr: 8658,
      dArr: 8659,
      hArr: 8660,
      forall: 8704,
      part: 8706,
      exist: 8707,
      empty: 8709,
      nabla: 8711,
      isin: 8712,
      notin: 8713,
      ni: 8715,
      prod: 8719,
      sum: 8721,
      minus: 8722,
      lowast: 8727,
      radic: 8730,
      prop: 8733,
      infin: 8734,
      ang: 8736,
      and: 8743,
      or: 8744,
      cap: 8745,
      cup: 8746,
      int: 8747,
      there4: 8756,
      sim: 8764,
      cong: 8773,
      asymp: 8776,
      ne: 8800,
      equiv: 8801,
      le: 8804,
      ge: 8805,
      sub: 8834,
      sup: 8835,
      nsub: 8836,
      sube: 8838,
      supe: 8839,
      oplus: 8853,
      otimes: 8855,
      perp: 8869,
      sdot: 8901,
      lceil: 8968,
      rceil: 8969,
      lfloor: 8970,
      rfloor: 8971,
      lang: 9001,
      rang: 9002,
      loz: 9674,
      spades: 9824,
      clubs: 9827,
      hearts: 9829,
      diams: 9830
    }, Object.keys(e.ENTITIES).forEach(function(p) {
      var d = e.ENTITIES[p], M = typeof d == "number" ? String.fromCharCode(d) : d;
      e.ENTITIES[p] = M;
    });
    for (var se in e.STATE)
      e.STATE[e.STATE[se]] = se;
    k = e.STATE;
    function ue(p, d, M) {
      p[d] && p[d](M);
    }
    function P(p, d, M) {
      p.textNode && K(p), ue(p, d, M);
    }
    function K(p) {
      p.textNode = _(p.opt, p.textNode), p.textNode && ue(p, "ontext", p.textNode), p.textNode = "";
    }
    function _(p, d) {
      return p.trim && (d = d.trim()), p.normalize && (d = d.replace(/\s+/g, " ")), d;
    }
    function J(p, d) {
      return K(p), p.trackPosition && (d += `
Line: ` + p.line + `
Column: ` + p.column + `
Char: ` + p.c), d = new Error(d), p.error = d, ue(p, "onerror", d), p;
    }
    function fe(p) {
      return p.sawRoot && !p.closedRoot && $(p, "Unclosed root tag"), p.state !== k.BEGIN && p.state !== k.BEGIN_WHITESPACE && p.state !== k.TEXT && J(p, "Unexpected end"), K(p), p.c = "", p.closed = !0, ue(p, "onend"), n.call(p, p.strict, p.opt), p;
    }
    function $(p, d) {
      if (typeof p != "object" || !(p instanceof n))
        throw new Error("bad call to strictFail");
      p.strict && J(p, d);
    }
    function pe(p) {
      p.strict || (p.tagName = p.tagName[p.looseCase]());
      var d = p.tags[p.tags.length - 1] || p, M = p.tag = { name: p.tagName, attributes: {} };
      p.opt.xmlns && (M.ns = d.ns), p.attribList.length = 0, P(p, "onopentagstart", M);
    }
    function ne(p, d) {
      var M = p.indexOf(":"), F = M < 0 ? ["", p] : p.split(":"), I = F[0], N = F[1];
      return d && p === "xmlns" && (I = "xmlns", N = ""), { prefix: I, local: N };
    }
    function he(p) {
      if (p.strict || (p.attribName = p.attribName[p.looseCase]()), p.attribList.indexOf(p.attribName) !== -1 || p.tag.attributes.hasOwnProperty(p.attribName)) {
        p.attribName = p.attribValue = "";
        return;
      }
      if (p.opt.xmlns) {
        var d = ne(p.attribName, !0), M = d.prefix, F = d.local;
        if (M === "xmlns")
          if (F === "xml" && p.attribValue !== m)
            $(
              p,
              "xml: prefix must be bound to " + m + `
Actual: ` + p.attribValue
            );
          else if (F === "xmlns" && p.attribValue !== v)
            $(
              p,
              "xmlns: prefix must be bound to " + v + `
Actual: ` + p.attribValue
            );
          else {
            var I = p.tag, N = p.tags[p.tags.length - 1] || p;
            I.ns === N.ns && (I.ns = Object.create(N.ns)), I.ns[F] = p.attribValue;
          }
        p.attribList.push([p.attribName, p.attribValue]);
      } else
        p.tag.attributes[p.attribName] = p.attribValue, P(p, "onattribute", {
          name: p.attribName,
          value: p.attribValue
        });
      p.attribName = p.attribValue = "";
    }
    function j(p, d) {
      if (p.opt.xmlns) {
        var M = p.tag, F = ne(p.tagName);
        M.prefix = F.prefix, M.local = F.local, M.uri = M.ns[F.prefix] || "", M.prefix && !M.uri && ($(p, "Unbound namespace prefix: " + JSON.stringify(p.tagName)), M.uri = F.prefix);
        var I = p.tags[p.tags.length - 1] || p;
        M.ns && I.ns !== M.ns && Object.keys(M.ns).forEach(function(B) {
          P(p, "onopennamespace", {
            prefix: B,
            uri: M.ns[B]
          });
        });
        for (var N = 0, Z = p.attribList.length; N < Z; N++) {
          var f = p.attribList[N], V = f[0], w = f[1], s = ne(V, !0), a = s.prefix, h = s.local, O = a === "" ? "" : M.ns[a] || "", U = {
            name: V,
            value: w,
            prefix: a,
            local: h,
            uri: O
          };
          a && a !== "xmlns" && !O && ($(p, "Unbound namespace prefix: " + JSON.stringify(a)), U.uri = a), p.tag.attributes[V] = U, P(p, "onattribute", U);
        }
        p.attribList.length = 0;
      }
      p.tag.isSelfClosing = !!d, p.sawRoot = !0, p.tags.push(p.tag), P(p, "onopentag", p.tag), d || (!p.noscript && p.tagName.toLowerCase() === "script" ? p.state = k.SCRIPT : p.state = k.TEXT, p.tag = null, p.tagName = ""), p.attribName = p.attribValue = "", p.attribList.length = 0;
    }
    function C(p) {
      if (!p.tagName) {
        $(p, "Weird empty close tag."), p.textNode += "</>", p.state = k.TEXT;
        return;
      }
      if (p.script) {
        if (p.tagName !== "script") {
          p.script += "</" + p.tagName + ">", p.tagName = "", p.state = k.SCRIPT;
          return;
        }
        P(p, "onscript", p.script), p.script = "";
      }
      var d = p.tags.length, M = p.tagName;
      p.strict || (M = M[p.looseCase]());
      for (var F = M; d--; ) {
        var I = p.tags[d];
        if (I.name !== F)
          $(p, "Unexpected close tag");
        else
          break;
      }
      if (d < 0) {
        $(p, "Unmatched closing tag: " + p.tagName), p.textNode += "</" + p.tagName + ">", p.state = k.TEXT;
        return;
      }
      p.tagName = M;
      for (var N = p.tags.length; N-- > d; ) {
        var Z = p.tag = p.tags.pop();
        p.tagName = p.tag.name, P(p, "onclosetag", p.tagName);
        var f = {};
        for (var V in Z.ns)
          f[V] = Z.ns[V];
        var w = p.tags[p.tags.length - 1] || p;
        p.opt.xmlns && Z.ns !== w.ns && Object.keys(Z.ns).forEach(function(s) {
          var a = Z.ns[s];
          P(p, "onclosenamespace", { prefix: s, uri: a });
        });
      }
      d === 0 && (p.closedRoot = !0), p.tagName = p.attribValue = p.attribName = "", p.attribList.length = 0, p.state = k.TEXT;
    }
    function H(p) {
      var d = p.entity, M = d.toLowerCase(), F, I = "";
      return p.ENTITIES[d] ? p.ENTITIES[d] : p.ENTITIES[M] ? p.ENTITIES[M] : (d = M, d.charAt(0) === "#" && (d.charAt(1) === "x" ? (d = d.slice(2), F = parseInt(d, 16), I = F.toString(16)) : (d = d.slice(1), F = parseInt(d, 10), I = F.toString(10))), d = d.replace(/^0+/, ""), isNaN(F) || I.toLowerCase() !== d ? ($(p, "Invalid character entity"), "&" + p.entity + ";") : String.fromCodePoint(F));
    }
    function W(p, d) {
      d === "<" ? (p.state = k.OPEN_WAKA, p.startTagPosition = p.position) : D(d) || ($(p, "Non-whitespace before first tag."), p.textNode = d, p.state = k.TEXT);
    }
    function te(p, d) {
      var M = "";
      return d < p.length && (M = p.charAt(d)), M;
    }
    function z(p) {
      var d = this;
      if (this.error)
        throw this.error;
      if (d.closed)
        return J(
          d,
          "Cannot write after close. Assign an onready handler."
        );
      if (p === null)
        return fe(d);
      typeof p == "object" && (p = p.toString());
      for (var M = 0, F = ""; F = te(p, M++), d.c = F, !!F; )
        switch (d.trackPosition && (d.position++, F === `
` ? (d.line++, d.column = 0) : d.column++), d.state) {
          case k.BEGIN:
            if (d.state = k.BEGIN_WHITESPACE, F === "\uFEFF")
              continue;
            W(d, F);
            continue;
          case k.BEGIN_WHITESPACE:
            W(d, F);
            continue;
          case k.TEXT:
            if (d.sawRoot && !d.closedRoot) {
              for (var I = M - 1; F && F !== "<" && F !== "&"; )
                F = te(p, M++), F && d.trackPosition && (d.position++, F === `
` ? (d.line++, d.column = 0) : d.column++);
              d.textNode += p.substring(I, M - 1);
            }
            F === "<" && !(d.sawRoot && d.closedRoot && !d.strict) ? (d.state = k.OPEN_WAKA, d.startTagPosition = d.position) : (!D(F) && (!d.sawRoot || d.closedRoot) && $(d, "Text data outside of root node."), F === "&" ? d.state = k.TEXT_ENTITY : d.textNode += F);
            continue;
          case k.SCRIPT:
            F === "<" ? d.state = k.SCRIPT_ENDING : d.script += F;
            continue;
          case k.SCRIPT_ENDING:
            F === "/" ? d.state = k.CLOSE_TAG : (d.script += "<" + F, d.state = k.SCRIPT);
            continue;
          case k.OPEN_WAKA:
            if (F === "!")
              d.state = k.SGML_DECL, d.sgmlDecl = "";
            else if (!D(F))
              if (G(S, F))
                d.state = k.OPEN_TAG, d.tagName = F;
              else if (F === "/")
                d.state = k.CLOSE_TAG, d.tagName = "";
              else if (F === "?")
                d.state = k.PROC_INST, d.procInstName = d.procInstBody = "";
              else {
                if ($(d, "Unencoded <"), d.startTagPosition + 1 < d.position) {
                  var N = d.position - d.startTagPosition;
                  F = new Array(N).join(" ") + F;
                }
                d.textNode += "<" + F, d.state = k.TEXT;
              }
            continue;
          case k.SGML_DECL:
            (d.sgmlDecl + F).toUpperCase() === T ? (P(d, "onopencdata"), d.state = k.CDATA, d.sgmlDecl = "", d.cdata = "") : d.sgmlDecl + F === "--" ? (d.state = k.COMMENT, d.comment = "", d.sgmlDecl = "") : (d.sgmlDecl + F).toUpperCase() === A ? (d.state = k.DOCTYPE, (d.doctype || d.sawRoot) && $(
              d,
              "Inappropriately located doctype declaration"
            ), d.doctype = "", d.sgmlDecl = "") : F === ">" ? (P(d, "onsgmldeclaration", d.sgmlDecl), d.sgmlDecl = "", d.state = k.TEXT) : (L(F) && (d.state = k.SGML_DECL_QUOTED), d.sgmlDecl += F);
            continue;
          case k.SGML_DECL_QUOTED:
            F === d.q && (d.state = k.SGML_DECL, d.q = ""), d.sgmlDecl += F;
            continue;
          case k.DOCTYPE:
            F === ">" ? (d.state = k.TEXT, P(d, "ondoctype", d.doctype), d.doctype = !0) : (d.doctype += F, F === "[" ? d.state = k.DOCTYPE_DTD : L(F) && (d.state = k.DOCTYPE_QUOTED, d.q = F));
            continue;
          case k.DOCTYPE_QUOTED:
            d.doctype += F, F === d.q && (d.q = "", d.state = k.DOCTYPE);
            continue;
          case k.DOCTYPE_DTD:
            d.doctype += F, F === "]" ? d.state = k.DOCTYPE : L(F) && (d.state = k.DOCTYPE_DTD_QUOTED, d.q = F);
            continue;
          case k.DOCTYPE_DTD_QUOTED:
            d.doctype += F, F === d.q && (d.state = k.DOCTYPE_DTD, d.q = "");
            continue;
          case k.COMMENT:
            F === "-" ? d.state = k.COMMENT_ENDING : d.comment += F;
            continue;
          case k.COMMENT_ENDING:
            F === "-" ? (d.state = k.COMMENT_ENDED, d.comment = _(d.opt, d.comment), d.comment && P(d, "oncomment", d.comment), d.comment = "") : (d.comment += "-" + F, d.state = k.COMMENT);
            continue;
          case k.COMMENT_ENDED:
            F !== ">" ? ($(d, "Malformed comment"), d.comment += "--" + F, d.state = k.COMMENT) : d.state = k.TEXT;
            continue;
          case k.CDATA:
            F === "]" ? d.state = k.CDATA_ENDING : d.cdata += F;
            continue;
          case k.CDATA_ENDING:
            F === "]" ? d.state = k.CDATA_ENDING_2 : (d.cdata += "]" + F, d.state = k.CDATA);
            continue;
          case k.CDATA_ENDING_2:
            F === ">" ? (d.cdata && P(d, "oncdata", d.cdata), P(d, "onclosecdata"), d.cdata = "", d.state = k.TEXT) : F === "]" ? d.cdata += "]" : (d.cdata += "]]" + F, d.state = k.CDATA);
            continue;
          case k.PROC_INST:
            F === "?" ? d.state = k.PROC_INST_ENDING : D(F) ? d.state = k.PROC_INST_BODY : d.procInstName += F;
            continue;
          case k.PROC_INST_BODY:
            if (!d.procInstBody && D(F))
              continue;
            F === "?" ? d.state = k.PROC_INST_ENDING : d.procInstBody += F;
            continue;
          case k.PROC_INST_ENDING:
            F === ">" ? (P(d, "onprocessinginstruction", {
              name: d.procInstName,
              body: d.procInstBody
            }), d.procInstName = d.procInstBody = "", d.state = k.TEXT) : (d.procInstBody += "?" + F, d.state = k.PROC_INST_BODY);
            continue;
          case k.OPEN_TAG:
            G(g, F) ? d.tagName += F : (pe(d), F === ">" ? j(d) : F === "/" ? d.state = k.OPEN_TAG_SLASH : (D(F) || $(d, "Invalid character in tag name"), d.state = k.ATTRIB));
            continue;
          case k.OPEN_TAG_SLASH:
            F === ">" ? (j(d, !0), C(d)) : ($(d, "Forward-slash in opening tag not followed by >"), d.state = k.ATTRIB);
            continue;
          case k.ATTRIB:
            if (D(F))
              continue;
            F === ">" ? j(d) : F === "/" ? d.state = k.OPEN_TAG_SLASH : G(S, F) ? (d.attribName = F, d.attribValue = "", d.state = k.ATTRIB_NAME) : $(d, "Invalid attribute name");
            continue;
          case k.ATTRIB_NAME:
            F === "=" ? d.state = k.ATTRIB_VALUE : F === ">" ? ($(d, "Attribute without value"), d.attribValue = d.attribName, he(d), j(d)) : D(F) ? d.state = k.ATTRIB_NAME_SAW_WHITE : G(g, F) ? d.attribName += F : $(d, "Invalid attribute name");
            continue;
          case k.ATTRIB_NAME_SAW_WHITE:
            if (F === "=")
              d.state = k.ATTRIB_VALUE;
            else {
              if (D(F))
                continue;
              $(d, "Attribute without value"), d.tag.attributes[d.attribName] = "", d.attribValue = "", P(d, "onattribute", {
                name: d.attribName,
                value: ""
              }), d.attribName = "", F === ">" ? j(d) : G(S, F) ? (d.attribName = F, d.state = k.ATTRIB_NAME) : ($(d, "Invalid attribute name"), d.state = k.ATTRIB);
            }
            continue;
          case k.ATTRIB_VALUE:
            if (D(F))
              continue;
            L(F) ? (d.q = F, d.state = k.ATTRIB_VALUE_QUOTED) : ($(d, "Unquoted attribute value"), d.state = k.ATTRIB_VALUE_UNQUOTED, d.attribValue = F);
            continue;
          case k.ATTRIB_VALUE_QUOTED:
            if (F !== d.q) {
              F === "&" ? d.state = k.ATTRIB_VALUE_ENTITY_Q : d.attribValue += F;
              continue;
            }
            he(d), d.q = "", d.state = k.ATTRIB_VALUE_CLOSED;
            continue;
          case k.ATTRIB_VALUE_CLOSED:
            D(F) ? d.state = k.ATTRIB : F === ">" ? j(d) : F === "/" ? d.state = k.OPEN_TAG_SLASH : G(S, F) ? ($(d, "No whitespace between attributes"), d.attribName = F, d.attribValue = "", d.state = k.ATTRIB_NAME) : $(d, "Invalid attribute name");
            continue;
          case k.ATTRIB_VALUE_UNQUOTED:
            if (!Y(F)) {
              F === "&" ? d.state = k.ATTRIB_VALUE_ENTITY_U : d.attribValue += F;
              continue;
            }
            he(d), F === ">" ? j(d) : d.state = k.ATTRIB;
            continue;
          case k.CLOSE_TAG:
            if (d.tagName)
              F === ">" ? C(d) : G(g, F) ? d.tagName += F : d.script ? (d.script += "</" + d.tagName, d.tagName = "", d.state = k.SCRIPT) : (D(F) || $(d, "Invalid tagname in closing tag"), d.state = k.CLOSE_TAG_SAW_WHITE);
            else {
              if (D(F))
                continue;
              Q(S, F) ? d.script ? (d.script += "</" + F, d.state = k.SCRIPT) : $(d, "Invalid tagname in closing tag.") : d.tagName = F;
            }
            continue;
          case k.CLOSE_TAG_SAW_WHITE:
            if (D(F))
              continue;
            F === ">" ? C(d) : $(d, "Invalid characters in closing tag");
            continue;
          case k.TEXT_ENTITY:
          case k.ATTRIB_VALUE_ENTITY_Q:
          case k.ATTRIB_VALUE_ENTITY_U:
            var Z, f;
            switch (d.state) {
              case k.TEXT_ENTITY:
                Z = k.TEXT, f = "textNode";
                break;
              case k.ATTRIB_VALUE_ENTITY_Q:
                Z = k.ATTRIB_VALUE_QUOTED, f = "attribValue";
                break;
              case k.ATTRIB_VALUE_ENTITY_U:
                Z = k.ATTRIB_VALUE_UNQUOTED, f = "attribValue";
                break;
            }
            F === ";" ? (d[f] += H(d), d.entity = "", d.state = Z) : G(d.entity.length ? R : x, F) ? d.entity += F : ($(d, "Invalid character in entity name"), d[f] += "&" + d.entity + F, d.entity = "", d.state = Z);
            continue;
          default:
            throw new Error(d, "Unknown state: " + d.state);
        }
      return d.position >= d.bufferCheckPosition && o(d), d;
    }
    /*! http://mths.be/fromcodepoint v0.1.0 by @mathias */
    String.fromCodePoint || function() {
      var p = String.fromCharCode, d = Math.floor, M = function() {
        var F = 16384, I = [], N, Z, f = -1, V = arguments.length;
        if (!V)
          return "";
        for (var w = ""; ++f < V; ) {
          var s = Number(arguments[f]);
          if (!isFinite(s) || // `NaN`, `+Infinity`, or `-Infinity`
          s < 0 || // not a valid Unicode code point
          s > 1114111 || // not a valid Unicode code point
          d(s) !== s)
            throw RangeError("Invalid code point: " + s);
          s <= 65535 ? I.push(s) : (s -= 65536, N = (s >> 10) + 55296, Z = s % 1024 + 56320, I.push(N, Z)), (f + 1 === V || I.length > F) && (w += p.apply(null, I), I.length = 0);
        }
        return w;
      };
      Object.defineProperty ? Object.defineProperty(String, "fromCodePoint", {
        value: M,
        configurable: !0,
        writable: !0
      }) : String.fromCodePoint = M;
    }();
  })(t);
})(es);
var Cn = {
  isArray: function(t) {
    return Array.isArray ? Array.isArray(t) : Object.prototype.toString.call(t) === "[object Array]";
  }
}, _o = Cn.isArray, Nn = {
  copyOptions: function(t) {
    var e, r = {};
    for (e in t)
      t.hasOwnProperty(e) && (r[e] = t[e]);
    return r;
  },
  ensureFlagExists: function(t, e) {
    (!(t in e) || typeof e[t] != "boolean") && (e[t] = !1);
  },
  ensureSpacesExists: function(t) {
    (!("spaces" in t) || typeof t.spaces != "number" && typeof t.spaces != "string") && (t.spaces = 0);
  },
  ensureAlwaysArrayExists: function(t) {
    (!("alwaysArray" in t) || typeof t.alwaysArray != "boolean" && !_o(t.alwaysArray)) && (t.alwaysArray = !1);
  },
  ensureKeyExists: function(t, e) {
    (!(t + "Key" in e) || typeof e[t + "Key"] != "string") && (e[t + "Key"] = e.compact ? "_" + t : t);
  },
  checkFnExists: function(t, e) {
    return t + "Fn" in e;
  }
}, xo = es, be = Nn, bt = Cn.isArray, ee, ge;
function Eo(t) {
  return ee = be.copyOptions(t), be.ensureFlagExists("ignoreDeclaration", ee), be.ensureFlagExists("ignoreInstruction", ee), be.ensureFlagExists("ignoreAttributes", ee), be.ensureFlagExists("ignoreText", ee), be.ensureFlagExists("ignoreComment", ee), be.ensureFlagExists("ignoreCdata", ee), be.ensureFlagExists("ignoreDoctype", ee), be.ensureFlagExists("compact", ee), be.ensureFlagExists("alwaysChildren", ee), be.ensureFlagExists("addParent", ee), be.ensureFlagExists("trim", ee), be.ensureFlagExists("nativeType", ee), be.ensureFlagExists("nativeTypeAttributes", ee), be.ensureFlagExists("sanitize", ee), be.ensureFlagExists("instructionHasAttributes", ee), be.ensureFlagExists("captureSpacesBetweenElements", ee), be.ensureAlwaysArrayExists(ee), be.ensureKeyExists("declaration", ee), be.ensureKeyExists("instruction", ee), be.ensureKeyExists("attributes", ee), be.ensureKeyExists("text", ee), be.ensureKeyExists("comment", ee), be.ensureKeyExists("cdata", ee), be.ensureKeyExists("doctype", ee), be.ensureKeyExists("type", ee), be.ensureKeyExists("name", ee), be.ensureKeyExists("elements", ee), be.ensureKeyExists("parent", ee), ee;
}
function Ts(t) {
  var e = Number(t);
  if (!isNaN(e))
    return e;
  var r = t.toLowerCase();
  return r === "true" ? !0 : r === "false" ? !1 : t;
}
function Mt(t, e) {
  var r;
  if (ee.compact) {
    if (!ge[ee[t + "Key"]] && (bt(ee.alwaysArray) ? ee.alwaysArray.indexOf(ee[t + "Key"]) !== -1 : ee.alwaysArray) && (ge[ee[t + "Key"]] = []), ge[ee[t + "Key"]] && !bt(ge[ee[t + "Key"]]) && (ge[ee[t + "Key"]] = [ge[ee[t + "Key"]]]), t + "Fn" in ee && typeof e == "string" && (e = ee[t + "Fn"](e, ge)), t === "instruction" && ("instructionFn" in ee || "instructionNameFn" in ee)) {
      for (r in e)
        if (e.hasOwnProperty(r))
          if ("instructionFn" in ee)
            e[r] = ee.instructionFn(e[r], r, ge);
          else {
            var n = e[r];
            delete e[r], e[ee.instructionNameFn(r, n, ge)] = n;
          }
    }
    bt(ge[ee[t + "Key"]]) ? ge[ee[t + "Key"]].push(e) : ge[ee[t + "Key"]] = e;
  } else {
    ge[ee.elementsKey] || (ge[ee.elementsKey] = []);
    var o = {};
    if (o[ee.typeKey] = t, t === "instruction") {
      for (r in e)
        if (e.hasOwnProperty(r))
          break;
      o[ee.nameKey] = "instructionNameFn" in ee ? ee.instructionNameFn(r, e, ge) : r, ee.instructionHasAttributes ? (o[ee.attributesKey] = e[r][ee.attributesKey], "instructionFn" in ee && (o[ee.attributesKey] = ee.instructionFn(o[ee.attributesKey], r, ge))) : ("instructionFn" in ee && (e[r] = ee.instructionFn(e[r], r, ge)), o[ee.instructionKey] = e[r]);
    } else
      t + "Fn" in ee && (e = ee[t + "Fn"](e, ge)), o[ee[t + "Key"]] = e;
    ee.addParent && (o[ee.parentKey] = ge), ge[ee.elementsKey].push(o);
  }
}
function Ss(t) {
  if ("attributesFn" in ee && t && (t = ee.attributesFn(t, ge)), (ee.trim || "attributeValueFn" in ee || "attributeNameFn" in ee || ee.nativeTypeAttributes) && t) {
    var e;
    for (e in t)
      if (t.hasOwnProperty(e) && (ee.trim && (t[e] = t[e].trim()), ee.nativeTypeAttributes && (t[e] = Ts(t[e])), "attributeValueFn" in ee && (t[e] = ee.attributeValueFn(t[e], e, ge)), "attributeNameFn" in ee)) {
        var r = t[e];
        delete t[e], t[ee.attributeNameFn(e, t[e], ge)] = r;
      }
  }
  return t;
}
function Ao(t) {
  var e = {};
  if (t.body && (t.name.toLowerCase() === "xml" || ee.instructionHasAttributes)) {
    for (var r = /([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|(\w+))\s*/g, n; (n = r.exec(t.body)) !== null; )
      e[n[1]] = n[2] || n[3] || n[4];
    e = Ss(e);
  }
  if (t.name.toLowerCase() === "xml") {
    if (ee.ignoreDeclaration)
      return;
    ge[ee.declarationKey] = {}, Object.keys(e).length && (ge[ee.declarationKey][ee.attributesKey] = e), ee.addParent && (ge[ee.declarationKey][ee.parentKey] = ge);
  } else {
    if (ee.ignoreInstruction)
      return;
    ee.trim && (t.body = t.body.trim());
    var o = {};
    ee.instructionHasAttributes && Object.keys(e).length ? (o[t.name] = {}, o[t.name][ee.attributesKey] = e) : o[t.name] = t.body, Mt("instruction", o);
  }
}
function To(t, e) {
  var r;
  if (typeof t == "object" && (e = t.attributes, t = t.name), e = Ss(e), "elementNameFn" in ee && (t = ee.elementNameFn(t, ge)), ee.compact) {
    if (r = {}, !ee.ignoreAttributes && e && Object.keys(e).length) {
      r[ee.attributesKey] = {};
      var n;
      for (n in e)
        e.hasOwnProperty(n) && (r[ee.attributesKey][n] = e[n]);
    }
    !(t in ge) && (bt(ee.alwaysArray) ? ee.alwaysArray.indexOf(t) !== -1 : ee.alwaysArray) && (ge[t] = []), ge[t] && !bt(ge[t]) && (ge[t] = [ge[t]]), bt(ge[t]) ? ge[t].push(r) : ge[t] = r;
  } else
    ge[ee.elementsKey] || (ge[ee.elementsKey] = []), r = {}, r[ee.typeKey] = "element", r[ee.nameKey] = t, !ee.ignoreAttributes && e && Object.keys(e).length && (r[ee.attributesKey] = e), ee.alwaysChildren && (r[ee.elementsKey] = []), ge[ee.elementsKey].push(r);
  r[ee.parentKey] = ge, ge = r;
}
function So(t) {
  ee.ignoreText || !t.trim() && !ee.captureSpacesBetweenElements || (ee.trim && (t = t.trim()), ee.nativeType && (t = Ts(t)), ee.sanitize && (t = t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")), Mt("text", t));
}
function ko(t) {
  ee.ignoreComment || (ee.trim && (t = t.trim()), Mt("comment", t));
}
function Io(t) {
  var e = ge[ee.parentKey];
  ee.addParent || delete ge[ee.parentKey], ge = e;
}
function Ro(t) {
  ee.ignoreCdata || (ee.trim && (t = t.trim()), Mt("cdata", t));
}
function Co(t) {
  ee.ignoreDoctype || (t = t.replace(/^ /, ""), ee.trim && (t = t.trim()), Mt("doctype", t));
}
function No(t) {
  t.note = t;
}
var ks = function(t, e) {
  var r = xo.parser(!0, {}), n = {};
  if (ge = n, ee = Eo(e), r.opt = { strictEntities: !0 }, r.onopentag = To, r.ontext = So, r.oncomment = ko, r.onclosetag = Io, r.onerror = No, r.oncdata = Ro, r.ondoctype = Co, r.onprocessinginstruction = Ao, r.write(t).close(), n[ee.elementsKey]) {
    var o = n[ee.elementsKey];
    delete n[ee.elementsKey], n[ee.elementsKey] = o, delete n.text;
  }
  return n;
}, Pi = Nn, Oo = ks;
function Do(t) {
  var e = Pi.copyOptions(t);
  return Pi.ensureSpacesExists(e), e;
}
var Po = function(t, e) {
  var r, n, o, c;
  return r = Do(e), n = Oo(t, r), c = "compact" in r && r.compact ? "_parent" : "parent", "addParent" in r && r.addParent ? o = JSON.stringify(n, function(u, i) {
    return u === c ? "_" : i;
  }, r.spaces) : o = JSON.stringify(n, null, r.spaces), o.replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
}, xe = Nn, Fo = Cn.isArray, Ne, Oe;
function Bo(t) {
  var e = xe.copyOptions(t);
  return xe.ensureFlagExists("ignoreDeclaration", e), xe.ensureFlagExists("ignoreInstruction", e), xe.ensureFlagExists("ignoreAttributes", e), xe.ensureFlagExists("ignoreText", e), xe.ensureFlagExists("ignoreComment", e), xe.ensureFlagExists("ignoreCdata", e), xe.ensureFlagExists("ignoreDoctype", e), xe.ensureFlagExists("compact", e), xe.ensureFlagExists("indentText", e), xe.ensureFlagExists("indentCdata", e), xe.ensureFlagExists("indentAttributes", e), xe.ensureFlagExists("indentInstruction", e), xe.ensureFlagExists("fullTagEmptyElement", e), xe.ensureFlagExists("noQuotesForNativeAttributes", e), xe.ensureSpacesExists(e), typeof e.spaces == "number" && (e.spaces = Array(e.spaces + 1).join(" ")), xe.ensureKeyExists("declaration", e), xe.ensureKeyExists("instruction", e), xe.ensureKeyExists("attributes", e), xe.ensureKeyExists("text", e), xe.ensureKeyExists("comment", e), xe.ensureKeyExists("cdata", e), xe.ensureKeyExists("doctype", e), xe.ensureKeyExists("type", e), xe.ensureKeyExists("name", e), xe.ensureKeyExists("elements", e), e;
}
function Ve(t, e, r) {
  return (!r && t.spaces ? `
` : "") + Array(e + 1).join(t.spaces);
}
function ar(t, e, r) {
  if (e.ignoreAttributes)
    return "";
  "attributesFn" in e && (t = e.attributesFn(t, Oe, Ne));
  var n, o, c, u, i = [];
  for (n in t)
    t.hasOwnProperty(n) && t[n] !== null && t[n] !== void 0 && (u = e.noQuotesForNativeAttributes && typeof t[n] != "string" ? "" : '"', o = "" + t[n], o = o.replace(/"/g, "&quot;"), c = "attributeNameFn" in e ? e.attributeNameFn(n, o, Oe, Ne) : n, i.push(e.spaces && e.indentAttributes ? Ve(e, r + 1, !1) : " "), i.push(c + "=" + u + ("attributeValueFn" in e ? e.attributeValueFn(o, n, Oe, Ne) : o) + u));
  return t && Object.keys(t).length && e.spaces && e.indentAttributes && i.push(Ve(e, r, !1)), i.join("");
}
function Is(t, e, r) {
  return Ne = t, Oe = "xml", e.ignoreDeclaration ? "" : "<?xml" + ar(t[e.attributesKey], e, r) + "?>";
}
function Rs(t, e, r) {
  if (e.ignoreInstruction)
    return "";
  var n;
  for (n in t)
    if (t.hasOwnProperty(n))
      break;
  var o = "instructionNameFn" in e ? e.instructionNameFn(n, t[n], Oe, Ne) : n;
  if (typeof t[n] == "object")
    return Ne = t, Oe = o, "<?" + o + ar(t[n][e.attributesKey], e, r) + "?>";
  var c = t[n] ? t[n] : "";
  return "instructionFn" in e && (c = e.instructionFn(c, n, Oe, Ne)), "<?" + o + (c ? " " + c : "") + "?>";
}
function Cs(t, e) {
  return e.ignoreComment ? "" : "<!--" + ("commentFn" in e ? e.commentFn(t, Oe, Ne) : t) + "-->";
}
function Ns(t, e) {
  return e.ignoreCdata ? "" : "<![CDATA[" + ("cdataFn" in e ? e.cdataFn(t, Oe, Ne) : t.replace("]]>", "]]]]><![CDATA[>")) + "]]>";
}
function Os(t, e) {
  return e.ignoreDoctype ? "" : "<!DOCTYPE " + ("doctypeFn" in e ? e.doctypeFn(t, Oe, Ne) : t) + ">";
}
function On(t, e) {
  return e.ignoreText ? "" : (t = "" + t, t = t.replace(/&amp;/g, "&"), t = t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"), "textFn" in e ? e.textFn(t, Oe, Ne) : t);
}
function Lo(t, e) {
  var r;
  if (t.elements && t.elements.length)
    for (r = 0; r < t.elements.length; ++r)
      switch (t.elements[r][e.typeKey]) {
        case "text":
          if (e.indentText)
            return !0;
          break;
        case "cdata":
          if (e.indentCdata)
            return !0;
          break;
        case "instruction":
          if (e.indentInstruction)
            return !0;
          break;
        case "doctype":
        case "comment":
        case "element":
          return !0;
        default:
          return !0;
      }
  return !1;
}
function Mo(t, e, r) {
  Ne = t, Oe = t.name;
  var n = [], o = "elementNameFn" in e ? e.elementNameFn(t.name, t) : t.name;
  n.push("<" + o), t[e.attributesKey] && n.push(ar(t[e.attributesKey], e, r));
  var c = t[e.elementsKey] && t[e.elementsKey].length || t[e.attributesKey] && t[e.attributesKey]["xml:space"] === "preserve";
  return c || ("fullTagEmptyElementFn" in e ? c = e.fullTagEmptyElementFn(t.name, t) : c = e.fullTagEmptyElement), c ? (n.push(">"), t[e.elementsKey] && t[e.elementsKey].length && (n.push(Ds(t[e.elementsKey], e, r + 1)), Ne = t, Oe = t.name), n.push(e.spaces && Lo(t, e) ? `
` + Array(r + 1).join(e.spaces) : ""), n.push("</" + o + ">")) : n.push("/>"), n.join("");
}
function Ds(t, e, r, n) {
  return t.reduce(function(o, c) {
    var u = Ve(e, r, n && !o);
    switch (c.type) {
      case "element":
        return o + u + Mo(c, e, r);
      case "comment":
        return o + u + Cs(c[e.commentKey], e);
      case "doctype":
        return o + u + Os(c[e.doctypeKey], e);
      case "cdata":
        return o + (e.indentCdata ? u : "") + Ns(c[e.cdataKey], e);
      case "text":
        return o + (e.indentText ? u : "") + On(c[e.textKey], e);
      case "instruction":
        var i = {};
        return i[c[e.nameKey]] = c[e.attributesKey] ? c : c[e.instructionKey], o + (e.indentInstruction ? u : "") + Rs(i, e, r);
    }
  }, "");
}
function Ps(t, e, r) {
  var n;
  for (n in t)
    if (t.hasOwnProperty(n))
      switch (n) {
        case e.parentKey:
        case e.attributesKey:
          break;
        case e.textKey:
          if (e.indentText || r)
            return !0;
          break;
        case e.cdataKey:
          if (e.indentCdata || r)
            return !0;
          break;
        case e.instructionKey:
          if (e.indentInstruction || r)
            return !0;
          break;
        case e.doctypeKey:
        case e.commentKey:
          return !0;
        default:
          return !0;
      }
  return !1;
}
function Uo(t, e, r, n, o) {
  Ne = t, Oe = e;
  var c = "elementNameFn" in r ? r.elementNameFn(e, t) : e;
  if (typeof t > "u" || t === null || t === "")
    return "fullTagEmptyElementFn" in r && r.fullTagEmptyElementFn(e, t) || r.fullTagEmptyElement ? "<" + c + "></" + c + ">" : "<" + c + "/>";
  var u = [];
  if (e) {
    if (u.push("<" + c), typeof t != "object")
      return u.push(">" + On(t, r) + "</" + c + ">"), u.join("");
    t[r.attributesKey] && u.push(ar(t[r.attributesKey], r, n));
    var i = Ps(t, r, !0) || t[r.attributesKey] && t[r.attributesKey]["xml:space"] === "preserve";
    if (i || ("fullTagEmptyElementFn" in r ? i = r.fullTagEmptyElementFn(e, t) : i = r.fullTagEmptyElement), i)
      u.push(">");
    else
      return u.push("/>"), u.join("");
  }
  return u.push(Fs(t, r, n + 1, !1)), Ne = t, Oe = e, e && u.push((o ? Ve(r, n, !1) : "") + "</" + c + ">"), u.join("");
}
function Fs(t, e, r, n) {
  var o, c, u, i = [];
  for (c in t)
    if (t.hasOwnProperty(c))
      for (u = Fo(t[c]) ? t[c] : [t[c]], o = 0; o < u.length; ++o) {
        switch (c) {
          case e.declarationKey:
            i.push(Is(u[o], e, r));
            break;
          case e.instructionKey:
            i.push((e.indentInstruction ? Ve(e, r, n) : "") + Rs(u[o], e, r));
            break;
          case e.attributesKey:
          case e.parentKey:
            break;
          case e.textKey:
            i.push((e.indentText ? Ve(e, r, n) : "") + On(u[o], e));
            break;
          case e.cdataKey:
            i.push((e.indentCdata ? Ve(e, r, n) : "") + Ns(u[o], e));
            break;
          case e.doctypeKey:
            i.push(Ve(e, r, n) + Os(u[o], e));
            break;
          case e.commentKey:
            i.push(Ve(e, r, n) + Cs(u[o], e));
            break;
          default:
            i.push(Ve(e, r, n) + Uo(u[o], c, e, r, Ps(u[o], e)));
        }
        n = n && !i.length;
      }
  return i.join("");
}
var Bs = function(t, e) {
  e = Bo(e);
  var r = [];
  return Ne = t, Oe = "_root_", e.compact ? r.push(Fs(t, e, 0, !0)) : (t[e.declarationKey] && r.push(Is(t[e.declarationKey], e, 0)), t[e.elementsKey] && t[e.elementsKey].length && r.push(Ds(t[e.elementsKey], e, 0, !r.length))), r.join("");
}, zo = Bs, jo = function(t, e) {
  t instanceof Buffer && (t = t.toString());
  var r = null;
  if (typeof t == "string")
    try {
      r = JSON.parse(t);
    } catch {
      throw new Error("The JSON structure is invalid");
    }
  else
    r = t;
  return zo(r, e);
}, Ho = ks, Wo = Po, Go = Bs, Ko = jo, Ls = {
  xml2js: Ho,
  xml2json: Wo,
  js2xml: Go,
  json2xml: Ko
};
const Dn = (t) => {
  switch (t.type) {
    case void 0:
    case "element":
      const e = new Vo(t.name, t.attributes), r = t.elements || [];
      for (const n of r) {
        const o = Dn(n);
        o !== void 0 && e.push(o);
      }
      return e;
    case "text":
      return t.text;
    default:
      return;
  }
};
class qo extends le {
  // noop
}
class Vo extends q {
  /**
   * Converts the xml string to a XmlComponent tree.
   *
   * @param importedContent xml content of the imported component
   */
  static fromXmlString(e) {
    const r = Ls.xml2js(e, { compact: !1 });
    return Dn(r);
  }
  /**
   * Converts the xml string to a XmlComponent tree.
   *
   * @param importedContent xml content of the imported component
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(e, r) {
    super(e), r && this.root.push(new qo(r));
  }
  push(e) {
    this.root.push(e);
  }
}
class $o extends q {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(e) {
    super(""), this._attr = e;
  }
  prepForXml(e) {
    return {
      _attr: this._attr
    };
  }
}
class Ms extends q {
  constructor(e, r) {
    super(e), r && (this.root = r.root);
  }
}
const De = (t) => {
  if (isNaN(t))
    throw new Error(`Invalid value '${t}' specified. Must be an integer.`);
  return Math.floor(t);
}, or = (t) => {
  const e = De(t);
  if (e < 0)
    throw new Error(`Invalid value '${t}' specified. Must be a positive integer.`);
  return e;
}, Us = (t, e) => {
  const r = e * 2;
  if (t.length !== r || isNaN(+`0x${t}`))
    throw new Error(`Invalid hex value '${t}'. Expected ${r} digit hex value`);
  return t;
}, Fi = (t) => Us(t, 1), Pn = (t) => {
  const e = t.slice(-2), r = t.substring(0, t.length - 2);
  return `${Number(r)}${e}`;
}, zs = (t) => {
  const e = Pn(t);
  if (parseFloat(e) < 0)
    throw new Error(`Invalid value '${e}' specified. Expected a positive number.`);
  return e;
}, Et = (t) => {
  if (t === "auto")
    return t;
  const e = t.charAt(0) === "#" ? t.substring(1) : t;
  return Us(e, 3);
}, Ye = (t) => typeof t == "string" ? Pn(t) : De(t), Xo = (t) => typeof t == "string" ? zs(t) : or(t), Ce = (t) => typeof t == "string" ? zs(t) : or(t), Zo = (t) => {
  const e = t.substring(0, t.length - 1);
  return `${Number(e)}%`;
}, Yo = (t) => typeof t == "number" ? De(t) : t.slice(-1) === "%" ? Zo(t) : Pn(t), Jo = or, Qo = or, eu = (t) => t.toISOString();
class ae extends q {
  constructor(e, r = !0) {
    super(e), r !== !0 && this.root.push(new Ae({ val: r }));
  }
}
class Jr extends q {
  constructor(e, r) {
    super(e), this.root.push(new Ae({ val: Xo(r) }));
  }
}
class tu extends q {
}
class lt extends q {
  constructor(e, r) {
    super(e), this.root.push(new Ae({ val: r }));
  }
}
class js extends q {
  constructor(e, r) {
    super(e), this.root.push(new Ae({ val: r }));
  }
}
class ru extends q {
  constructor(e, r) {
    super(e), this.root.push(new Ae({ val: r }));
  }
}
class it extends q {
  constructor(e, r) {
    super(e), this.root.push(r);
  }
}
class Hs extends q {
  constructor(e) {
    super(e.name), e.attributes && this.root.push(new $e(e.attributes));
  }
}
var ze = /* @__PURE__ */ ((t) => (t.START = "start", t.CENTER = "center", t.END = "end", t.BOTH = "both", t.MEDIUM_KASHIDA = "mediumKashida", t.DISTRIBUTE = "distribute", t.NUM_TAB = "numTab", t.HIGH_KASHIDA = "highKashida", t.LOW_KASHIDA = "lowKashida", t.THAI_DISTRIBUTE = "thaiDistribute", t.LEFT = "left", t.RIGHT = "right", t.JUSTIFIED = "both", t))(ze || {});
class nu extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", { val: "w:val" });
  }
}
class Ws extends q {
  constructor(e) {
    super("w:jc"), this.root.push(new nu({ val: e }));
  }
}
class ve extends q {
  constructor(e, { color: r, size: n, space: o, style: c }) {
    super(e), this.root.push(
      new iu({
        style: c,
        color: r === void 0 ? void 0 : Et(r),
        size: n === void 0 ? void 0 : Jo(n),
        space: o === void 0 ? void 0 : Qo(o)
      })
    );
  }
}
class iu extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", {
      style: "w:val",
      color: "w:color",
      size: "w:sz",
      space: "w:space"
    });
  }
}
var ur = /* @__PURE__ */ ((t) => (t.SINGLE = "single", t.DASH_DOT_STROKED = "dashDotStroked", t.DASHED = "dashed", t.DASH_SMALL_GAP = "dashSmallGap", t.DOT_DASH = "dotDash", t.DOT_DOT_DASH = "dotDotDash", t.DOTTED = "dotted", t.DOUBLE = "double", t.DOUBLE_WAVE = "doubleWave", t.INSET = "inset", t.NIL = "nil", t.NONE = "none", t.OUTSET = "outset", t.THICK = "thick", t.THICK_THIN_LARGE_GAP = "thickThinLargeGap", t.THICK_THIN_MEDIUM_GAP = "thickThinMediumGap", t.THICK_THIN_SMALL_GAP = "thickThinSmallGap", t.THIN_THICK_LARGE_GAP = "thinThickLargeGap", t.THIN_THICK_MEDIUM_GAP = "thinThickMediumGap", t.THIN_THICK_SMALL_GAP = "thinThickSmallGap", t.THIN_THICK_THIN_LARGE_GAP = "thinThickThinLargeGap", t.THIN_THICK_THIN_MEDIUM_GAP = "thinThickThinMediumGap", t.THIN_THICK_THIN_SMALL_GAP = "thinThickThinSmallGap", t.THREE_D_EMBOSS = "threeDEmboss", t.THREE_D_ENGRAVE = "threeDEngrave", t.TRIPLE = "triple", t.WAVE = "wave", t))(ur || {});
class su extends Je {
  constructor(e) {
    super("w:pBdr"), e.top && this.root.push(new ve("w:top", e.top)), e.bottom && this.root.push(new ve("w:bottom", e.bottom)), e.left && this.root.push(new ve("w:left", e.left)), e.right && this.root.push(new ve("w:right", e.right));
  }
}
class au extends q {
  constructor() {
    super("w:pBdr");
    const e = new ve("w:bottom", {
      color: "auto",
      space: 1,
      style: ur.SINGLE,
      size: 6
    });
    this.root.push(e);
  }
}
class ou extends q {
  constructor({ start: e, end: r, left: n, right: o, hanging: c, firstLine: u }) {
    super("w:ind"), this.root.push(
      new $e({
        start: {
          key: "w:start",
          value: e === void 0 ? void 0 : Ye(e)
        },
        end: {
          key: "w:end",
          value: r === void 0 ? void 0 : Ye(r)
        },
        left: {
          key: "w:left",
          value: n === void 0 ? void 0 : Ye(n)
        },
        right: {
          key: "w:right",
          value: o === void 0 ? void 0 : Ye(o)
        },
        hanging: {
          key: "w:hanging",
          value: c === void 0 ? void 0 : Ce(c)
        },
        firstLine: {
          key: "w:firstLine",
          value: u === void 0 ? void 0 : Ce(u)
        }
      })
    );
  }
}
let uu = class extends q {
  constructor() {
    super("w:br");
  }
};
class Fn extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", { type: "w:fldCharType", dirty: "w:dirty" });
  }
}
class Qr extends q {
  constructor(e) {
    super("w:fldChar"), this.root.push(new Fn({ type: "begin", dirty: e }));
  }
}
class en extends q {
  constructor(e) {
    super("w:fldChar"), this.root.push(new Fn({ type: "separate", dirty: e }));
  }
}
class tn extends q {
  constructor(e) {
    super("w:fldChar"), this.root.push(new Fn({ type: "end", dirty: e }));
  }
}
var At = /* @__PURE__ */ ((t) => (t.DEFAULT = "default", t.PRESERVE = "preserve", t))(At || {});
class Ft extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", { space: "xml:space" });
  }
}
class cu extends q {
  constructor() {
    super("w:instrText"), this.root.push(new Ft({ space: At.PRESERVE })), this.root.push("PAGE");
  }
}
class lu extends q {
  constructor() {
    super("w:instrText"), this.root.push(new Ft({ space: At.PRESERVE })), this.root.push("NUMPAGES");
  }
}
class hu extends q {
  constructor() {
    super("w:instrText"), this.root.push(new Ft({ space: At.PRESERVE })), this.root.push("SECTIONPAGES");
  }
}
class fu extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", {
      fill: "w:fill",
      color: "w:color",
      type: "w:val"
    });
  }
}
class cr extends q {
  constructor({ fill: e, color: r, type: n }) {
    super("w:shd"), this.root.push(
      new fu({
        fill: e === void 0 ? void 0 : Et(e),
        color: r === void 0 ? void 0 : Et(r),
        type: n
      })
    );
  }
}
class du extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", {
      id: "w:id",
      author: "w:author",
      date: "w:date"
    });
  }
}
class pu extends q {
  constructor(e) {
    super("w:em"), this.root.push(
      new Ae({
        val: e
      })
    );
  }
}
class mu extends pu {
  constructor(e = "dot") {
    super(e);
  }
}
class wu extends q {
  constructor(e) {
    super("w:spacing"), this.root.push(
      new Ae({
        val: Ye(e)
      })
    );
  }
}
class gu extends q {
  constructor(e) {
    super("w:color"), this.root.push(
      new Ae({
        val: Et(e)
      })
    );
  }
}
class yu extends q {
  constructor(e) {
    super("w:highlight"), this.root.push(
      new Ae({
        val: e
      })
    );
  }
}
class bu extends q {
  constructor(e) {
    super("w:highlightCs"), this.root.push(
      new Ae({
        val: e
      })
    );
  }
}
const vu = (t) => new Hs({
  name: "w:lang",
  attributes: {
    value: {
      key: "w:val",
      value: t.value
    },
    eastAsia: {
      key: "w:eastAsia",
      value: t.eastAsia
    },
    bidirectional: {
      key: "w:bidi",
      value: t.bidirectional
    }
  }
});
class Bi extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", {
      ascii: "w:ascii",
      cs: "w:cs",
      eastAsia: "w:eastAsia",
      hAnsi: "w:hAnsi",
      hint: "w:hint"
    });
  }
}
class rn extends q {
  constructor(e, r) {
    if (super("w:rFonts"), typeof e == "string") {
      const n = e;
      this.root.push(
        new Bi({
          ascii: n,
          cs: n,
          eastAsia: n,
          hAnsi: n,
          hint: r
        })
      );
    } else {
      const n = e;
      this.root.push(new Bi(n));
    }
  }
}
let Gs = class extends q {
  constructor(e) {
    super("w:vertAlign"), this.root.push(
      new Ae({
        val: e
      })
    );
  }
};
class _u extends Gs {
  constructor() {
    super("superscript");
  }
}
class xu extends Gs {
  constructor() {
    super("subscript");
  }
}
var Ks = /* @__PURE__ */ ((t) => (t.SINGLE = "single", t.WORDS = "words", t.DOUBLE = "double", t.THICK = "thick", t.DOTTED = "dotted", t.DOTTEDHEAVY = "dottedHeavy", t.DASH = "dash", t.DASHEDHEAVY = "dashedHeavy", t.DASHLONG = "dashLong", t.DASHLONGHEAVY = "dashLongHeavy", t.DOTDASH = "dotDash", t.DASHDOTHEAVY = "dashDotHeavy", t.DOTDOTDASH = "dotDotDash", t.DASHDOTDOTHEAVY = "dashDotDotHeavy", t.WAVE = "wave", t.WAVYHEAVY = "wavyHeavy", t.WAVYDOUBLE = "wavyDouble", t.NONE = "none", t))(Ks || {});
class Eu extends q {
  constructor(e = "single", r) {
    super("w:u"), this.root.push(
      new Ae({
        val: e,
        color: r === void 0 ? void 0 : Et(r)
      })
    );
  }
}
class kt extends Je {
  constructor(e) {
    if (super("w:rPr"), !e)
      return;
    e.noProof !== void 0 && this.push(new ae("w:noProof", e.noProof)), e.bold !== void 0 && this.push(new ae("w:b", e.bold)), (e.boldComplexScript === void 0 && e.bold !== void 0 || e.boldComplexScript) && this.push(new ae("w:bCs", e.boldComplexScript ?? e.bold)), e.italics !== void 0 && this.push(new ae("w:i", e.italics)), (e.italicsComplexScript === void 0 && e.italics !== void 0 || e.italicsComplexScript) && this.push(new ae("w:iCs", e.italicsComplexScript ?? e.italics)), e.underline && this.push(new Eu(e.underline.type, e.underline.color)), e.effect && this.push(new lt("w:effect", e.effect)), e.emphasisMark && this.push(new mu(e.emphasisMark.type)), e.color && this.push(new gu(e.color)), e.kern && this.push(new Jr("w:kern", e.kern)), e.position && this.push(new lt("w:position", e.position)), e.size !== void 0 && this.push(new Jr("w:sz", e.size));
    const r = e.sizeComplexScript === void 0 || e.sizeComplexScript === !0 ? e.size : e.sizeComplexScript;
    r && this.push(new Jr("w:szCs", r)), e.rightToLeft !== void 0 && this.push(new ae("w:rtl", e.rightToLeft)), e.smallCaps !== void 0 ? this.push(new ae("w:smallCaps", e.smallCaps)) : e.allCaps !== void 0 && this.push(new ae("w:caps", e.allCaps)), e.strike !== void 0 && this.push(new ae("w:strike", e.strike)), e.doubleStrike !== void 0 && this.push(new ae("w:dstrike", e.doubleStrike)), e.subScript && this.push(new xu()), e.superScript && this.push(new _u()), e.style && this.push(new lt("w:rStyle", e.style)), e.font && (typeof e.font == "string" ? this.push(new rn(e.font)) : "name" in e.font ? this.push(new rn(e.font.name, e.font.hint)) : this.push(new rn(e.font))), e.highlight && this.push(new yu(e.highlight));
    const n = e.highlightComplexScript === void 0 || e.highlightComplexScript === !0 ? e.highlight : e.highlightComplexScript;
    n && this.push(new bu(n)), e.characterSpacing && this.push(new wu(e.characterSpacing)), e.emboss !== void 0 && this.push(new ae("w:emboss", e.emboss)), e.imprint !== void 0 && this.push(new ae("w:imprint", e.imprint)), e.shading && this.push(new cr(e.shading)), e.revision && this.push(new Au(e.revision)), e.border && this.push(new ve("w:bdr", e.border)), e.snapToGrid && this.push(new ae("w:snapToGrid", e.snapToGrid)), e.vanish && this.push(new ae("w:vanish", e.vanish)), e.specVanish && this.push(new ae("w:specVanish", e.vanish)), e.scale !== void 0 && this.push(new js("w:w", e.scale)), e.language && this.push(vu(e.language)), e.math && this.push(new ae("w:oMath", e.math));
  }
  push(e) {
    this.root.push(e);
  }
}
class Au extends q {
  constructor(e) {
    super("w:rPrChange"), this.root.push(
      new du({
        id: e.id,
        author: e.author,
        date: e.date
      })
    ), this.addChildElement(new kt(e));
  }
}
class mn extends q {
  constructor(e) {
    return super("w:t"), typeof e == "string" ? (this.root.push(new Ft({ space: At.PRESERVE })), this.root.push(e), this) : (this.root.push(new Ft({ space: e.space ?? At.DEFAULT })), this.root.push(e.text), this);
  }
}
class Ut extends q {
  constructor(e) {
    if (super("w:r"), X(this, "properties"), this.properties = new kt(e), this.root.push(this.properties), e.break)
      for (let r = 0; r < e.break; r++)
        this.root.push(new uu());
    if (e.children)
      for (const r of e.children) {
        if (typeof r == "string") {
          switch (r) {
            case "CURRENT":
              this.root.push(new Qr()), this.root.push(new cu()), this.root.push(new en()), this.root.push(new tn());
              break;
            case "TOTAL_PAGES":
              this.root.push(new Qr()), this.root.push(new lu()), this.root.push(new en()), this.root.push(new tn());
              break;
            case "TOTAL_PAGES_IN_SECTION":
              this.root.push(new Qr()), this.root.push(new hu()), this.root.push(new en()), this.root.push(new tn());
              break;
            default:
              this.root.push(new mn(r));
              break;
          }
          continue;
        }
        this.root.push(r);
      }
    else
      e.text && this.root.push(new mn(e.text));
  }
}
class vt extends Ut {
  constructor(e) {
    if (typeof e == "string")
      return super({}), this.root.push(new mn(e)), this;
    super(e);
  }
}
let Tu = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict", Su = (t = 21) => {
  let e = "", r = t;
  for (; r--; )
    e += Tu[Math.random() * 64 | 0];
  return e;
};
const Me = (t) => Math.floor(t * 72 * 20), lr = (t = 0) => {
  let e = t;
  return () => ++e;
}, ku = () => lr(), Iu = () => lr(1), Ru = () => lr(), Cu = () => lr(), qs = () => Su().toLowerCase();
var Vs = /* @__PURE__ */ ((t) => (t.CHARACTER = "character", t.COLUMN = "column", t.INSIDE_MARGIN = "insideMargin", t.LEFT_MARGIN = "leftMargin", t.MARGIN = "margin", t.OUTSIDE_MARGIN = "outsideMargin", t.PAGE = "page", t.RIGHT_MARGIN = "rightMargin", t))(Vs || {}), $s = /* @__PURE__ */ ((t) => (t.BOTTOM_MARGIN = "bottomMargin", t.INSIDE_MARGIN = "insideMargin", t.LINE = "line", t.MARGIN = "margin", t.OUTSIDE_MARGIN = "outsideMargin", t.PAGE = "page", t.PARAGRAPH = "paragraph", t.TOP_MARGIN = "topMargin", t))($s || {});
class Nu extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", {
      x: "x",
      y: "y"
    });
  }
}
class Ou extends q {
  constructor() {
    super("wp:simplePos"), this.root.push(
      new Nu({
        x: 0,
        y: 0
      })
    );
  }
}
class Xs extends q {
  constructor(e) {
    super("wp:align"), this.root.push(e);
  }
}
class Zs extends q {
  constructor(e) {
    super("wp:posOffset"), this.root.push(e.toString());
  }
}
class Du extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", {
      relativeFrom: "relativeFrom"
    });
  }
}
class Pu extends q {
  constructor(e) {
    if (super("wp:positionH"), this.root.push(
      new Du({
        relativeFrom: e.relative || Vs.PAGE
      })
    ), e.align)
      this.root.push(new Xs(e.align));
    else if (e.offset !== void 0)
      this.root.push(new Zs(e.offset));
    else
      throw new Error("There is no configuration provided for floating position (Align or offset)");
  }
}
class Fu extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", {
      relativeFrom: "relativeFrom"
    });
  }
}
class Bu extends q {
  constructor(e) {
    if (super("wp:positionV"), this.root.push(
      new Fu({
        relativeFrom: e.relative || $s.PAGE
      })
    ), e.align)
      this.root.push(new Xs(e.align));
    else if (e.offset !== void 0)
      this.root.push(new Zs(e.offset));
    else
      throw new Error("There is no configuration provided for floating position (Align or offset)");
  }
}
class Lu extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", {
      uri: "uri"
    });
  }
}
class Mu extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", {
      embed: "r:embed",
      cstate: "cstate"
    });
  }
}
class Uu extends q {
  constructor(e) {
    super("a:blip"), this.root.push(
      new Mu({
        embed: `rId{${e.fileName}}`,
        cstate: "none"
      })
    );
  }
}
class zu extends q {
  constructor() {
    super("a:srcRect");
  }
}
class ju extends q {
  constructor() {
    super("a:fillRect");
  }
}
class Hu extends q {
  constructor() {
    super("a:stretch"), this.root.push(new ju());
  }
}
class Wu extends q {
  constructor(e) {
    super("pic:blipFill"), this.root.push(new Uu(e)), this.root.push(new zu()), this.root.push(new Hu());
  }
}
class Gu extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", {
      noChangeAspect: "noChangeAspect",
      noChangeArrowheads: "noChangeArrowheads"
    });
  }
}
class Ku extends q {
  constructor() {
    super("a:picLocks"), this.root.push(
      new Gu({
        noChangeAspect: 1,
        noChangeArrowheads: 1
      })
    );
  }
}
class qu extends q {
  constructor() {
    super("pic:cNvPicPr"), this.root.push(new Ku());
  }
}
const Ys = (t, e) => new Hs({
  name: "a:hlinkClick",
  attributes: {
    ...e ? {
      xmlns: {
        key: "xmlns:a",
        value: "http://schemas.openxmlformats.org/drawingml/2006/main"
      }
    } : {},
    id: {
      key: "r:id",
      value: `rId${t}`
    }
  }
});
class Vu extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", {
      id: "id",
      name: "name",
      descr: "descr"
    });
  }
}
class $u extends q {
  constructor() {
    super("pic:cNvPr"), this.root.push(
      new Vu({
        id: 0,
        name: "",
        descr: ""
      })
    );
  }
  prepForXml(e) {
    for (let r = e.stack.length - 1; r >= 0; r--) {
      const n = e.stack[r];
      if (n instanceof Bn) {
        this.root.push(Ys(n.linkId, !1));
        break;
      }
    }
    return super.prepForXml(e);
  }
}
class Xu extends q {
  constructor() {
    super("pic:nvPicPr"), this.root.push(new $u()), this.root.push(new qu());
  }
}
class Zu extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", {
      xmlns: "xmlns:pic"
    });
  }
}
class Yu extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", {
      cx: "cx",
      cy: "cy"
    });
  }
}
class Ju extends q {
  constructor(e, r) {
    super("a:ext"), X(this, "attributes"), this.attributes = new Yu({
      cx: e,
      cy: r
    }), this.root.push(this.attributes);
  }
}
class Qu extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", {
      x: "x",
      y: "y"
    });
  }
}
class ec extends q {
  constructor() {
    super("a:off"), this.root.push(
      new Qu({
        x: 0,
        y: 0
      })
    );
  }
}
class tc extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", {
      flipVertical: "flipV",
      flipHorizontal: "flipH",
      rotation: "rot"
    });
  }
}
class rc extends q {
  constructor(e) {
    var r, n;
    super("a:xfrm"), X(this, "extents"), this.root.push(
      new tc({
        flipVertical: (r = e.flip) == null ? void 0 : r.vertical,
        flipHorizontal: (n = e.flip) == null ? void 0 : n.horizontal,
        rotation: e.rotation
      })
    ), this.extents = new Ju(e.emus.x, e.emus.y), this.root.push(new ec()), this.root.push(this.extents);
  }
}
class nc extends q {
  constructor() {
    super("a:avLst");
  }
}
class ic extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", {
      prst: "prst"
    });
  }
}
class sc extends q {
  constructor() {
    super("a:prstGeom"), this.root.push(
      new ic({
        prst: "rect"
      })
    ), this.root.push(new nc());
  }
}
class ac extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", {
      bwMode: "bwMode"
    });
  }
}
class oc extends q {
  constructor(e) {
    super("pic:spPr"), X(this, "form"), this.root.push(
      new ac({
        bwMode: "auto"
      })
    ), this.form = new rc(e), this.root.push(this.form), this.root.push(new sc());
  }
}
class uc extends q {
  constructor(e, r) {
    super("pic:pic"), this.root.push(
      new Zu({
        xmlns: "http://schemas.openxmlformats.org/drawingml/2006/picture"
      })
    ), this.root.push(new Xu()), this.root.push(new Wu(e)), this.root.push(new oc(r));
  }
}
class cc extends q {
  constructor(e, r) {
    super("a:graphicData"), X(this, "pic"), this.root.push(
      new Lu({
        uri: "http://schemas.openxmlformats.org/drawingml/2006/picture"
      })
    ), this.pic = new uc(e, r), this.root.push(this.pic);
  }
}
class lc extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", {
      a: "xmlns:a"
    });
  }
}
class Js extends q {
  constructor(e, r) {
    super("a:graphic"), X(this, "data"), this.root.push(
      new lc({
        a: "http://schemas.openxmlformats.org/drawingml/2006/main"
      })
    ), this.data = new cc(e, r), this.root.push(this.data);
  }
}
var Ot = /* @__PURE__ */ ((t) => (t[t.NONE = 0] = "NONE", t[t.SQUARE = 1] = "SQUARE", t[t.TIGHT = 2] = "TIGHT", t[t.TOP_AND_BOTTOM = 3] = "TOP_AND_BOTTOM", t))(Ot || {}), Qs = /* @__PURE__ */ ((t) => (t.BOTH_SIDES = "bothSides", t.LEFT = "left", t.RIGHT = "right", t.LARGEST = "largest", t))(Qs || {});
class Li extends q {
  constructor() {
    super("wp:wrapNone");
  }
}
class hc extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", {
      distT: "distT",
      distB: "distB",
      distL: "distL",
      distR: "distR",
      wrapText: "wrapText"
    });
  }
}
class fc extends q {
  constructor(e, r = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  }) {
    super("wp:wrapSquare"), this.root.push(
      new hc({
        wrapText: e.side || Qs.BOTH_SIDES,
        distT: r.top,
        distB: r.bottom,
        distL: r.left,
        distR: r.right
      })
    );
  }
}
class dc extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", {
      distT: "distT",
      distB: "distB"
    });
  }
}
class pc extends q {
  constructor(e = {
    top: 0,
    bottom: 0
  }) {
    super("wp:wrapTight"), this.root.push(
      new dc({
        distT: e.top,
        distB: e.bottom
      })
    );
  }
}
class mc extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", {
      distT: "distT",
      distB: "distB"
    });
  }
}
class wc extends q {
  constructor(e = {
    top: 0,
    bottom: 0
  }) {
    super("wp:wrapTopAndBottom"), this.root.push(
      new mc({
        distT: e.top,
        distB: e.bottom
      })
    );
  }
}
class ea extends q {
  constructor({ name: e, description: r, title: n } = { name: "", description: "", title: "" }) {
    super("wp:docPr"), X(this, "docPropertiesUniqueNumericId", Ru()), this.root.push(
      new $e({
        id: {
          key: "id",
          value: this.docPropertiesUniqueNumericId()
        },
        name: {
          key: "name",
          value: e
        },
        description: {
          key: "descr",
          value: r
        },
        title: {
          key: "title",
          value: n
        }
      })
    );
  }
  prepForXml(e) {
    for (let r = e.stack.length - 1; r >= 0; r--) {
      const n = e.stack[r];
      if (n instanceof Bn) {
        this.root.push(Ys(n.linkId, !0));
        break;
      }
    }
    return super.prepForXml(e);
  }
}
class gc extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", {
      b: "b",
      l: "l",
      r: "r",
      t: "t"
    });
  }
}
class ta extends q {
  constructor() {
    super("wp:effectExtent"), this.root.push(
      new gc({
        b: 0,
        l: 0,
        r: 0,
        t: 0
      })
    );
  }
}
class yc extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", {
      cx: "cx",
      cy: "cy"
    });
  }
}
class ra extends q {
  constructor(e, r) {
    super("wp:extent"), X(this, "attributes"), this.attributes = new yc({
      cx: e,
      cy: r
    }), this.root.push(this.attributes);
  }
}
class bc extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", {
      xmlns: "xmlns:a",
      noChangeAspect: "noChangeAspect"
    });
  }
}
class vc extends q {
  constructor() {
    super("a:graphicFrameLocks"), this.root.push(
      new bc({
        xmlns: "http://schemas.openxmlformats.org/drawingml/2006/main",
        noChangeAspect: 1
      })
    );
  }
}
class na extends q {
  constructor() {
    super("wp:cNvGraphicFramePr"), this.root.push(new vc());
  }
}
class _c extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", {
      distT: "distT",
      distB: "distB",
      distL: "distL",
      distR: "distR",
      allowOverlap: "allowOverlap",
      behindDoc: "behindDoc",
      layoutInCell: "layoutInCell",
      locked: "locked",
      relativeHeight: "relativeHeight",
      simplePos: "simplePos"
    });
  }
}
class xc extends q {
  constructor(e, r, n) {
    super("wp:anchor");
    const o = {
      allowOverlap: !0,
      behindDocument: !1,
      lockAnchor: !1,
      layoutInCell: !0,
      verticalPosition: {},
      horizontalPosition: {},
      ...n.floating
    };
    if (this.root.push(
      new _c({
        distT: o.margins && o.margins.top || 0,
        distB: o.margins && o.margins.bottom || 0,
        distL: o.margins && o.margins.left || 0,
        distR: o.margins && o.margins.right || 0,
        simplePos: "0",
        // note: word doesn't fully support - so we use 0
        allowOverlap: o.allowOverlap === !0 ? "1" : "0",
        behindDoc: o.behindDocument === !0 ? "1" : "0",
        locked: o.lockAnchor === !0 ? "1" : "0",
        layoutInCell: o.layoutInCell === !0 ? "1" : "0",
        relativeHeight: o.zIndex ? o.zIndex : r.emus.y
      })
    ), this.root.push(new Ou()), this.root.push(new Pu(o.horizontalPosition)), this.root.push(new Bu(o.verticalPosition)), this.root.push(new ra(r.emus.x, r.emus.y)), this.root.push(new ta()), n.floating !== void 0 && n.floating.wrap !== void 0)
      switch (n.floating.wrap.type) {
        case Ot.SQUARE:
          this.root.push(new fc(n.floating.wrap, n.floating.margins));
          break;
        case Ot.TIGHT:
          this.root.push(new pc(n.floating.margins));
          break;
        case Ot.TOP_AND_BOTTOM:
          this.root.push(new wc(n.floating.margins));
          break;
        case Ot.NONE:
        default:
          this.root.push(new Li());
      }
    else
      this.root.push(new Li());
    this.root.push(new ea(n.docProperties)), this.root.push(new na()), this.root.push(new Js(e, r));
  }
}
class Ec extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", {
      distT: "distT",
      distB: "distB",
      distL: "distL",
      distR: "distR"
    });
  }
}
class Ac extends q {
  constructor({ mediaData: e, transform: r, docProperties: n }) {
    super("wp:inline"), X(this, "extent"), X(this, "graphic"), this.root.push(
      new Ec({
        distT: 0,
        distB: 0,
        distL: 0,
        distR: 0
      })
    ), this.extent = new ra(r.emus.x, r.emus.y), this.graphic = new Js(e, r), this.root.push(this.extent), this.root.push(new ta()), this.root.push(new ea(n)), this.root.push(new na()), this.root.push(this.graphic);
  }
}
class Tc extends q {
  constructor(e, r = {}) {
    if (super("w:drawing"), r.floating)
      this.root.push(new xc(e, e.transformation, r));
    else {
      const n = new Ac({
        mediaData: e,
        transform: e.transformation,
        docProperties: r.docProperties
      });
      this.root.push(n);
    }
  }
}
class Sc extends Ut {
  constructor(e) {
    super({}), X(this, "key", `${qs()}.png`), X(this, "imageData");
    const r = typeof e.data == "string" ? this.convertDataURIToBinary(e.data) : e.data;
    this.imageData = {
      stream: r,
      fileName: this.key,
      transformation: {
        pixels: {
          x: Math.round(e.transformation.width),
          y: Math.round(e.transformation.height)
        },
        emus: {
          x: Math.round(e.transformation.width * 9525),
          y: Math.round(e.transformation.height * 9525)
        },
        flip: e.transformation.flip,
        rotation: e.transformation.rotation ? e.transformation.rotation * 6e4 : void 0
      }
    };
    const n = new Tc(this.imageData, { floating: e.floating, docProperties: e.altText });
    this.root.push(n);
  }
  prepForXml(e) {
    return e.file.Media.addImage(this.key, this.imageData), super.prepForXml(e);
  }
  convertDataURIToBinary(e) {
    if (typeof atob == "function") {
      const r = ";base64,", n = e.indexOf(r), o = n === -1 ? 0 : n + r.length;
      return new Uint8Array(
        atob(e.substring(o)).split("").map((c) => c.charCodeAt(0))
      );
    } else {
      const r = require("buffer");
      return new r.Buffer(e, "base64");
    }
  }
}
class kc extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", { id: "w:id", initials: "w:initials", author: "w:author", date: "w:date" });
  }
}
class Ic extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", {
      "xmlns:cx": "xmlns:cx",
      "xmlns:cx1": "xmlns:cx1",
      "xmlns:cx2": "xmlns:cx2",
      "xmlns:cx3": "xmlns:cx3",
      "xmlns:cx4": "xmlns:cx4",
      "xmlns:cx5": "xmlns:cx5",
      "xmlns:cx6": "xmlns:cx6",
      "xmlns:cx7": "xmlns:cx7",
      "xmlns:cx8": "xmlns:cx8",
      "xmlns:mc": "xmlns:mc",
      "xmlns:aink": "xmlns:aink",
      "xmlns:am3d": "xmlns:am3d",
      "xmlns:o": "xmlns:o",
      "xmlns:r": "xmlns:r",
      "xmlns:m": "xmlns:m",
      "xmlns:v": "xmlns:v",
      "xmlns:wp14": "xmlns:wp14",
      "xmlns:wp": "xmlns:wp",
      "xmlns:w10": "xmlns:w10",
      "xmlns:w": "xmlns:w",
      "xmlns:w14": "xmlns:w14",
      "xmlns:w15": "xmlns:w15",
      "xmlns:w16cex": "xmlns:w16cex",
      "xmlns:w16cid": "xmlns:w16cid",
      "xmlns:w16": "xmlns:w16",
      "xmlns:w16sdtdh": "xmlns:w16sdtdh",
      "xmlns:w16se": "xmlns:w16se",
      "xmlns:wpg": "xmlns:wpg",
      "xmlns:wpi": "xmlns:wpi",
      "xmlns:wne": "xmlns:wne",
      "xmlns:wps": "xmlns:wps"
    });
  }
}
class Rc extends q {
  constructor({ id: e, initials: r, author: n, date: o = /* @__PURE__ */ new Date(), children: c }) {
    super("w:comment"), this.root.push(
      new kc({
        id: e,
        initials: r,
        author: n,
        date: o.toISOString()
      })
    );
    for (const u of c)
      this.root.push(u);
  }
}
class Cc extends q {
  constructor({ children: e }) {
    super("w:comments"), this.root.push(
      new Ic({
        "xmlns:cx": "http://schemas.microsoft.com/office/drawing/2014/chartex",
        "xmlns:cx1": "http://schemas.microsoft.com/office/drawing/2015/9/8/chartex",
        "xmlns:cx2": "http://schemas.microsoft.com/office/drawing/2015/10/21/chartex",
        "xmlns:cx3": "http://schemas.microsoft.com/office/drawing/2016/5/9/chartex",
        "xmlns:cx4": "http://schemas.microsoft.com/office/drawing/2016/5/10/chartex",
        "xmlns:cx5": "http://schemas.microsoft.com/office/drawing/2016/5/11/chartex",
        "xmlns:cx6": "http://schemas.microsoft.com/office/drawing/2016/5/12/chartex",
        "xmlns:cx7": "http://schemas.microsoft.com/office/drawing/2016/5/13/chartex",
        "xmlns:cx8": "http://schemas.microsoft.com/office/drawing/2016/5/14/chartex",
        "xmlns:mc": "http://schemas.openxmlformats.org/markup-compatibility/2006",
        "xmlns:aink": "http://schemas.microsoft.com/office/drawing/2016/ink",
        "xmlns:am3d": "http://schemas.microsoft.com/office/drawing/2017/model3d",
        "xmlns:o": "urn:schemas-microsoft-com:office:office",
        "xmlns:r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
        "xmlns:m": "http://schemas.openxmlformats.org/officeDocument/2006/math",
        "xmlns:v": "urn:schemas-microsoft-com:vml",
        "xmlns:wp14": "http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing",
        "xmlns:wp": "http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing",
        "xmlns:w10": "urn:schemas-microsoft-com:office:word",
        "xmlns:w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
        "xmlns:w14": "http://schemas.microsoft.com/office/word/2010/wordml",
        "xmlns:w15": "http://schemas.microsoft.com/office/word/2012/wordml",
        "xmlns:w16cex": "http://schemas.microsoft.com/office/word/2018/wordml/cex",
        "xmlns:w16cid": "http://schemas.microsoft.com/office/word/2016/wordml/cid",
        "xmlns:w16": "http://schemas.microsoft.com/office/word/2018/wordml",
        "xmlns:w16sdtdh": "http://schemas.microsoft.com/office/word/2020/wordml/sdtdatahash",
        "xmlns:w16se": "http://schemas.microsoft.com/office/word/2015/wordml/symex",
        "xmlns:wpg": "http://schemas.microsoft.com/office/word/2010/wordprocessingGroup",
        "xmlns:wpi": "http://schemas.microsoft.com/office/word/2010/wordprocessingInk",
        "xmlns:wne": "http://schemas.microsoft.com/office/word/2006/wordml",
        "xmlns:wps": "http://schemas.microsoft.com/office/word/2010/wordprocessingShape"
      })
    );
    for (const r of e)
      this.root.push(new Rc(r));
  }
}
class Nc extends tu {
  constructor() {
    super("w:tab");
  }
}
class Oc extends q {
  constructor() {
    super("w:pageBreakBefore");
  }
}
var tr = /* @__PURE__ */ ((t) => (t.AT_LEAST = "atLeast", t.EXACTLY = "exactly", t.EXACT = "exact", t.AUTO = "auto", t))(tr || {});
class Dc extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", {
      after: "w:after",
      before: "w:before",
      line: "w:line",
      lineRule: "w:lineRule"
    });
  }
}
class Pc extends q {
  constructor(e) {
    super("w:spacing"), this.root.push(new Dc(e));
  }
}
var ot = /* @__PURE__ */ ((t) => (t.HEADING_1 = "Heading1", t.HEADING_2 = "Heading2", t.HEADING_3 = "Heading3", t.HEADING_4 = "Heading4", t.HEADING_5 = "Heading5", t.HEADING_6 = "Heading6", t.TITLE = "Title", t))(ot || {});
let Vt = class extends q {
  constructor(e) {
    super("w:pStyle"), this.root.push(
      new Ae({
        val: e
      })
    );
  }
};
class Fc extends q {
  constructor(e) {
    super("w:tabs");
    for (const r of e)
      this.root.push(new Lc(r));
  }
}
var wn = /* @__PURE__ */ ((t) => (t.LEFT = "left", t.RIGHT = "right", t.CENTER = "center", t.BAR = "bar", t.CLEAR = "clear", t.DECIMAL = "decimal", t.END = "end", t.NUM = "num", t.START = "start", t))(wn || {});
class Bc extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", { val: "w:val", pos: "w:pos", leader: "w:leader" });
  }
}
class Lc extends q {
  constructor({ type: e, position: r, leader: n }) {
    super("w:tab"), this.root.push(
      new Bc({
        val: e,
        pos: r,
        leader: n
      })
    );
  }
}
class Mi extends q {
  constructor(e, r) {
    super("w:numPr"), this.root.push(new Mc(r)), this.root.push(new Uc(e));
  }
}
class Mc extends q {
  constructor(e) {
    if (super("w:ilvl"), e > 9)
      throw new Error(
        "Level cannot be greater than 9. Read more here: https://answers.microsoft.com/en-us/msoffice/forum/all/does-word-support-more-than-9-list-levels/d130fdcd-1781-446d-8c84-c6c79124e4d7"
      );
    this.root.push(
      new Ae({
        val: e
      })
    );
  }
}
class Uc extends q {
  constructor(e) {
    super("w:numId"), this.root.push(
      new Ae({
        val: typeof e == "string" ? `{${e}}` : e
      })
    );
  }
}
class ia extends q {
  constructor() {
    super(...arguments), X(this, "fileChild", Symbol());
  }
}
class zc extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", {
      id: "Id",
      type: "Type",
      target: "Target",
      targetMode: "TargetMode"
    });
  }
}
var sa = /* @__PURE__ */ ((t) => (t.EXTERNAL = "External", t))(sa || {});
class jc extends q {
  constructor(e, r, n, o) {
    super("Relationship"), this.root.push(
      new zc({
        id: e,
        type: r,
        target: n,
        targetMode: o
      })
    );
  }
}
class Hc extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", {
      id: "r:id",
      history: "w:history",
      anchor: "w:anchor"
    });
  }
}
class Bn extends q {
  constructor(e, r, n) {
    super("w:hyperlink"), X(this, "linkId"), this.linkId = r;
    const o = {
      history: 1,
      anchor: n || void 0,
      id: n ? void 0 : `rId${this.linkId}`
    }, c = new Hc(o);
    this.root.push(c), e.forEach((u) => {
      this.root.push(u);
    });
  }
}
class aa extends q {
  constructor(e) {
    super("w:externalHyperlink"), this.options = e;
  }
}
class Wc extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", {
      id: "w:id",
      name: "w:name"
    });
  }
}
class Gc extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", {
      id: "w:id"
    });
  }
}
class Kc {
  constructor(e) {
    X(this, "bookmarkUniqueNumericId", Cu()), X(this, "start"), X(this, "children"), X(this, "end");
    const r = this.bookmarkUniqueNumericId();
    this.start = new qc(e.id, r), this.children = e.children, this.end = new Vc(r);
  }
}
class qc extends q {
  constructor(e, r) {
    super("w:bookmarkStart");
    const n = new Wc({
      name: e,
      id: r
    });
    this.root.push(n);
  }
}
class Vc extends q {
  constructor(e) {
    super("w:bookmarkEnd");
    const r = new Gc({
      id: e
    });
    this.root.push(r);
  }
}
class $c extends q {
  constructor(e) {
    super("w:outlineLvl"), this.level = e, this.root.push(
      new Ae({
        val: e
      })
    );
  }
}
class Xc extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", {
      verticalAlign: "w:val"
    });
  }
}
class oa extends q {
  constructor(e) {
    super("w:vAlign"), this.root.push(new Xc({ verticalAlign: e }));
  }
}
var _t = /* @__PURE__ */ ((t) => (t.DEFAULT = "default", t.FIRST = "first", t.EVEN = "even", t))(_t || {});
class Zc extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", {
      type: "w:type",
      id: "r:id"
    });
  }
}
var gn = /* @__PURE__ */ ((t) => (t.HEADER = "w:headerReference", t.FOOTER = "w:footerReference", t))(gn || {});
class nn extends q {
  constructor(e, r) {
    super(e), this.root.push(
      new Zc({
        type: r.type || "default",
        id: `rId${r.id}`
      })
    );
  }
}
class Yc extends q {
  constructor({ space: e, count: r, separate: n, equalWidth: o, children: c }) {
    super("w:cols"), this.root.push(
      new $e({
        space: { key: "w:space", value: e === void 0 ? void 0 : Ce(e) },
        count: { key: "w:num", value: r === void 0 ? void 0 : De(r) },
        separate: { key: "w:sep", value: n },
        equalWidth: { key: "w:equalWidth", value: o }
      })
    ), !o && c && c.forEach((u) => this.addChildElement(u));
  }
}
class Jc extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", {
      type: "w:type",
      linePitch: "w:linePitch",
      charSpace: "w:charSpace"
    });
  }
}
class Qc extends q {
  constructor(e, r, n) {
    super("w:docGrid"), this.root.push(
      new Jc({
        type: n,
        linePitch: De(e),
        charSpace: r ? De(r) : void 0
      })
    );
  }
}
class el extends q {
  constructor({ countBy: e, start: r, restart: n, distance: o }) {
    super("w:lnNumType"), this.root.push(
      new $e({
        countBy: { key: "w:countBy", value: e === void 0 ? void 0 : De(e) },
        start: { key: "w:start", value: r === void 0 ? void 0 : De(r) },
        restart: { key: "w:restart", value: n },
        distance: { key: "w:distance", value: o === void 0 ? void 0 : Ce(o) }
      })
    );
  }
}
class Ui extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", {
      display: "w:display",
      offsetFrom: "w:offsetFrom",
      zOrder: "w:zOrder"
    });
  }
}
class tl extends Je {
  constructor(e) {
    if (super("w:pgBorders"), !e)
      return this;
    e.pageBorders ? this.root.push(
      new Ui({
        display: e.pageBorders.display,
        offsetFrom: e.pageBorders.offsetFrom,
        zOrder: e.pageBorders.zOrder
      })
    ) : this.root.push(new Ui({})), e.pageBorderTop && this.root.push(new ve("w:top", e.pageBorderTop)), e.pageBorderLeft && this.root.push(new ve("w:left", e.pageBorderLeft)), e.pageBorderBottom && this.root.push(new ve("w:bottom", e.pageBorderBottom)), e.pageBorderRight && this.root.push(new ve("w:right", e.pageBorderRight));
  }
}
class rl extends q {
  constructor(e, r, n, o, c, u, i) {
    super("w:pgMar"), this.root.push(
      new $e({
        top: { key: "w:top", value: Ye(e) },
        right: { key: "w:right", value: Ce(r) },
        bottom: { key: "w:bottom", value: Ye(n) },
        left: { key: "w:left", value: Ce(o) },
        header: { key: "w:header", value: Ce(c) },
        footer: { key: "w:footer", value: Ce(u) },
        gutter: { key: "w:gutter", value: Ce(i) }
      })
    );
  }
}
class nl extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", {
      start: "w:start",
      formatType: "w:fmt",
      separator: "w:chapSep"
    });
  }
}
class il extends q {
  constructor({ start: e, formatType: r, separator: n }) {
    super("w:pgNumType"), this.root.push(
      new nl({
        start: e === void 0 ? void 0 : De(e),
        formatType: r,
        separator: n
      })
    );
  }
}
var ua = /* @__PURE__ */ ((t) => (t.PORTRAIT = "portrait", t.LANDSCAPE = "landscape", t))(ua || {});
class sl extends q {
  constructor(e, r, n) {
    super("w:pgSz");
    const o = n === "landscape", c = Ce(e), u = Ce(r);
    this.root.push(
      new $e({
        width: { key: "w:w", value: o ? u : c },
        height: { key: "w:h", value: o ? c : u },
        orientation: { key: "w:orient", value: n }
      })
    );
  }
}
class al extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", { val: "w:val" });
  }
}
class ol extends q {
  constructor(e) {
    super("w:textDirection"), this.root.push(
      new al({
        val: e
      })
    );
  }
}
class ul extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", {
      val: "w:val"
    });
  }
}
class cl extends q {
  constructor(e) {
    super("w:type"), this.root.push(new ul({ val: e }));
  }
}
const st = {
  TOP: "1in",
  RIGHT: "1in",
  BOTTOM: "1in",
  LEFT: "1in",
  HEADER: 708,
  FOOTER: 708,
  GUTTER: 0
}, sn = {
  WIDTH: 11906,
  HEIGHT: 16838,
  ORIENTATION: ua.PORTRAIT
};
class ll extends q {
  constructor({
    page: {
      size: {
        width: e = sn.WIDTH,
        height: r = sn.HEIGHT,
        orientation: n = sn.ORIENTATION
      } = {},
      margin: {
        top: o = st.TOP,
        right: c = st.RIGHT,
        bottom: u = st.BOTTOM,
        left: i = st.LEFT,
        header: l = st.HEADER,
        footer: b = st.FOOTER,
        gutter: E = st.GUTTER
      } = {},
      pageNumbers: T = {},
      borders: A,
      textDirection: m
    } = {},
    grid: { linePitch: v = 360, charSpace: y, type: S } = {},
    headerWrapperGroup: g = {},
    footerWrapperGroup: x = {},
    lineNumbers: R,
    titlePage: D,
    verticalAlign: L,
    column: Y,
    type: G
  } = {}) {
    super("w:sectPr"), this.addHeaderFooterGroup(gn.HEADER, g), this.addHeaderFooterGroup(gn.FOOTER, x), G && this.root.push(new cl(G)), this.root.push(new sl(e, r, n)), this.root.push(new rl(o, c, u, i, l, b, E)), A && this.root.push(new tl(A)), R && this.root.push(new el(R)), this.root.push(new il(T)), Y && this.root.push(new Yc(Y)), L && this.root.push(new oa(L)), D !== void 0 && this.root.push(new ae("w:titlePg", D)), m && this.root.push(new ol(m)), this.root.push(new Qc(v, y, S));
  }
  addHeaderFooterGroup(e, r) {
    r.default && this.root.push(
      new nn(e, {
        type: _t.DEFAULT,
        id: r.default.View.ReferenceId
      })
    ), r.first && this.root.push(
      new nn(e, {
        type: _t.FIRST,
        id: r.first.View.ReferenceId
      })
    ), r.even && this.root.push(
      new nn(e, {
        type: _t.EVEN,
        id: r.even.View.ReferenceId
      })
    );
  }
}
class hl extends q {
  constructor() {
    super("w:body"), X(this, "sections", []);
  }
  /**
   * Adds new section properties.
   * Note: Previous section is created in paragraph after the current element, and then new section will be added.
   * The spec says:
   *  - section element should be in the last paragraph of the section
   *  - last section should be direct child of body
   *
   * @param options new section options
   */
  addSection(e) {
    const r = this.sections.pop();
    this.root.push(this.createSectionParagraph(r)), this.sections.push(new ll(e));
  }
  prepForXml(e) {
    return this.sections.length === 1 && (this.root.splice(0, 1), this.root.push(this.sections.pop())), super.prepForXml(e);
  }
  push(e) {
    this.root.push(e);
  }
  createSectionParagraph(e) {
    const r = new rt({}), n = new Tt({});
    return n.push(e), r.addChildElement(n), r;
  }
}
class zt extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", {
      wpc: "xmlns:wpc",
      mc: "xmlns:mc",
      o: "xmlns:o",
      r: "xmlns:r",
      m: "xmlns:m",
      v: "xmlns:v",
      wp14: "xmlns:wp14",
      wp: "xmlns:wp",
      w10: "xmlns:w10",
      w: "xmlns:w",
      w14: "xmlns:w14",
      w15: "xmlns:w15",
      wpg: "xmlns:wpg",
      wpi: "xmlns:wpi",
      wne: "xmlns:wne",
      wps: "xmlns:wps",
      Ignorable: "mc:Ignorable",
      cp: "xmlns:cp",
      dc: "xmlns:dc",
      dcterms: "xmlns:dcterms",
      dcmitype: "xmlns:dcmitype",
      xsi: "xmlns:xsi",
      type: "xsi:type",
      cx: "xmlns:cx",
      cx1: "xmlns:cx1",
      cx2: "xmlns:cx2",
      cx3: "xmlns:cx3",
      cx4: "xmlns:cx4",
      cx5: "xmlns:cx5",
      cx6: "xmlns:cx6",
      cx7: "xmlns:cx7",
      cx8: "xmlns:cx8",
      aink: "xmlns:aink",
      am3d: "xmlns:am3d",
      w16cex: "xmlns:w16cex",
      w16cid: "xmlns:w16cid",
      w16: "xmlns:w16",
      w16sdtdh: "xmlns:w16sdtdh",
      w16se: "xmlns:w16se"
    });
  }
}
class fl extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", {
      color: "w:color",
      themeColor: "w:themeColor",
      themeShade: "w:themeShade",
      themeTint: "w:themeTint"
    });
  }
}
class dl extends q {
  constructor(e) {
    super("w:background"), this.root.push(
      new fl({
        color: e.color === void 0 ? void 0 : Et(e.color),
        themeColor: e.themeColor,
        themeShade: e.themeShade === void 0 ? void 0 : Fi(e.themeShade),
        themeTint: e.themeTint === void 0 ? void 0 : Fi(e.themeTint)
      })
    );
  }
}
class pl extends q {
  constructor(e) {
    super("w:document"), X(this, "body"), this.root.push(
      new zt({
        wpc: "http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas",
        mc: "http://schemas.openxmlformats.org/markup-compatibility/2006",
        o: "urn:schemas-microsoft-com:office:office",
        r: "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
        m: "http://schemas.openxmlformats.org/officeDocument/2006/math",
        v: "urn:schemas-microsoft-com:vml",
        wp14: "http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing",
        wp: "http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing",
        w10: "urn:schemas-microsoft-com:office:word",
        w: "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
        w14: "http://schemas.microsoft.com/office/word/2010/wordml",
        w15: "http://schemas.microsoft.com/office/word/2012/wordml",
        wpg: "http://schemas.microsoft.com/office/word/2010/wordprocessingGroup",
        wpi: "http://schemas.microsoft.com/office/word/2010/wordprocessingInk",
        wne: "http://schemas.microsoft.com/office/word/2006/wordml",
        wps: "http://schemas.microsoft.com/office/word/2010/wordprocessingShape",
        cx: "http://schemas.microsoft.com/office/drawing/2014/chartex",
        cx1: "http://schemas.microsoft.com/office/drawing/2015/9/8/chartex",
        cx2: "http://schemas.microsoft.com/office/drawing/2015/10/21/chartex",
        cx3: "http://schemas.microsoft.com/office/drawing/2016/5/9/chartex",
        cx4: "http://schemas.microsoft.com/office/drawing/2016/5/10/chartex",
        cx5: "http://schemas.microsoft.com/office/drawing/2016/5/11/chartex",
        cx6: "http://schemas.microsoft.com/office/drawing/2016/5/12/chartex",
        cx7: "http://schemas.microsoft.com/office/drawing/2016/5/13/chartex",
        cx8: "http://schemas.microsoft.com/office/drawing/2016/5/14/chartex",
        aink: "http://schemas.microsoft.com/office/drawing/2016/ink",
        am3d: "http://schemas.microsoft.com/office/drawing/2017/model3d",
        w16cex: "http://schemas.microsoft.com/office/word/2018/wordml/cex",
        w16cid: "http://schemas.microsoft.com/office/word/2016/wordml/cid",
        w16: "http://schemas.microsoft.com/office/word/2018/wordml",
        w16sdtdh: "http://schemas.microsoft.com/office/word/2020/wordml/sdtdatahash",
        w16se: "http://schemas.microsoft.com/office/word/2015/wordml/symex",
        Ignorable: "w14 w15 wp14"
      })
    ), this.body = new hl(), e.background && this.root.push(new dl(e.background)), this.root.push(this.body);
  }
  add(e) {
    return this.body.push(e), this;
  }
  get Body() {
    return this.body;
  }
}
class ml extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", {
      xmlns: "xmlns"
    });
  }
}
class jt extends q {
  constructor() {
    super("Relationships"), this.root.push(
      new ml({
        xmlns: "http://schemas.openxmlformats.org/package/2006/relationships"
      })
    );
  }
  createRelationship(e, r, n, o) {
    const c = new jc(`rId${e}`, r, n, o);
    return this.root.push(c), c;
  }
  get RelationshipCount() {
    return this.root.length - 1;
  }
}
class ca {
  constructor(e) {
    X(this, "document"), X(this, "relationships"), this.document = new pl(e), this.relationships = new jt();
  }
  get View() {
    return this.document;
  }
  get Relationships() {
    return this.relationships;
  }
}
class wl extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", { val: "w:val" });
  }
}
class gl extends q {
  constructor() {
    super("w:wordWrap"), this.root.push(new wl({ val: 0 }));
  }
}
class yl extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", {
      anchorLock: "w:anchorLock",
      dropCap: "w:dropCap",
      width: "w:w",
      height: "w:h",
      x: "w:x",
      y: "w:y",
      anchorHorizontal: "w:hAnchor",
      anchorVertical: "w:vAnchor",
      spaceHorizontal: "w:hSpace",
      spaceVertical: "w:vSpace",
      rule: "w:hRule",
      alignmentX: "w:xAlign",
      alignmentY: "w:yAlign",
      lines: "w:lines",
      wrap: "w:wrap"
    });
  }
}
class bl extends q {
  constructor(e) {
    var r, n;
    super("w:framePr"), this.root.push(
      new yl({
        anchorLock: e.anchorLock,
        dropCap: e.dropCap,
        width: e.width,
        height: e.height,
        x: e.position ? e.position.x : void 0,
        y: e.position ? e.position.y : void 0,
        anchorHorizontal: e.anchor.horizontal,
        anchorVertical: e.anchor.vertical,
        spaceHorizontal: (r = e.space) == null ? void 0 : r.horizontal,
        spaceVertical: (n = e.space) == null ? void 0 : n.vertical,
        rule: e.rule,
        alignmentX: e.alignment ? e.alignment.x : void 0,
        alignmentY: e.alignment ? e.alignment.y : void 0,
        lines: e.lines,
        wrap: e.wrap
      })
    );
  }
}
class Tt extends Je {
  constructor(e) {
    if (super("w:pPr"), X(this, "numberingReferences", []), !e)
      return this;
    e.heading && this.push(new Vt(e.heading)), e.bullet && this.push(new Vt("ListParagraph")), e.numbering && !e.style && !e.heading && (e.numbering.custom || this.push(new Vt("ListParagraph"))), e.style && this.push(new Vt(e.style)), e.keepNext !== void 0 && this.push(new ae("w:keepNext", e.keepNext)), e.keepLines !== void 0 && this.push(new ae("w:keepLines", e.keepLines)), e.pageBreakBefore && this.push(new Oc()), e.frame && this.push(new bl(e.frame)), e.widowControl !== void 0 && this.push(new ae("w:widowControl", e.widowControl)), e.bullet && this.push(new Mi(1, e.bullet.level)), e.numbering && (this.numberingReferences.push({
      reference: e.numbering.reference,
      instance: e.numbering.instance ?? 0
    }), this.push(new Mi(`${e.numbering.reference}-${e.numbering.instance ?? 0}`, e.numbering.level))), e.border && this.push(new su(e.border)), e.thematicBreak && this.push(new au()), e.shading && this.push(new cr(e.shading)), e.wordWrap && this.push(new gl());
    const r = [
      ...e.rightTabStop ? [{ type: wn.RIGHT, position: e.rightTabStop }] : [],
      ...e.tabStops ? e.tabStops : [],
      ...e.leftTabStop ? [{ type: wn.LEFT, position: e.leftTabStop }] : []
    ];
    r.length > 0 && this.push(new Fc(r)), e.bidirectional !== void 0 && this.push(new ae("w:bidi", e.bidirectional)), e.spacing && this.push(new Pc(e.spacing)), e.indent && this.push(new ou(e.indent)), e.contextualSpacing !== void 0 && this.push(new ae("w:contextualSpacing", e.contextualSpacing)), e.alignment && this.push(new Ws(e.alignment)), e.outlineLevel !== void 0 && this.push(new $c(e.outlineLevel)), e.suppressLineNumbers !== void 0 && this.push(new ae("w:suppressLineNumbers", e.suppressLineNumbers)), e.autoSpaceEastAsianText !== void 0 && this.push(new ae("w:autoSpaceDN", e.autoSpaceEastAsianText));
  }
  push(e) {
    this.root.push(e);
  }
  prepForXml(e) {
    if (e.viewWrapper instanceof ca)
      for (const r of this.numberingReferences)
        e.file.Numbering.createConcreteNumberingInstance(r.reference, r.instance);
    return super.prepForXml(e);
  }
}
class rt extends ia {
  constructor(e) {
    if (super("w:p"), X(this, "properties"), typeof e == "string")
      return this.properties = new Tt({}), this.root.push(this.properties), this.root.push(new vt(e)), this;
    if (this.properties = new Tt(e), this.root.push(this.properties), e.text && this.root.push(new vt(e.text)), e.children)
      for (const r of e.children) {
        if (r instanceof Kc) {
          this.root.push(r.start);
          for (const n of r.children)
            this.root.push(n);
          this.root.push(r.end);
          continue;
        }
        this.root.push(r);
      }
  }
  prepForXml(e) {
    for (const r of this.root)
      if (r instanceof aa) {
        const n = this.root.indexOf(r), o = new Bn(r.options.children, qs());
        e.viewWrapper.Relationships.createRelationship(
          o.linkId,
          "http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink",
          r.options.link,
          sa.EXTERNAL
        ), this.root[n] = o;
      }
    return super.prepForXml(e);
  }
  addRunToFront(e) {
    return this.root.splice(1, 0, e), this;
  }
}
class vl extends q {
  constructor(e) {
    super("m:t"), this.root.push(e);
  }
}
class _l extends q {
  constructor(e) {
    super("m:r"), this.root.push(new vl(e));
  }
}
class xl extends q {
  constructor(e) {
    super("w:tblGrid");
    for (const r of e)
      this.root.push(new El(r));
  }
}
class El extends q {
  constructor(e) {
    super("w:gridCol"), e !== void 0 && this.root.push(
      new $e({
        width: { key: "w:w", value: Ce(e) }
      })
    );
  }
}
var Ln = /* @__PURE__ */ ((t) => (t.AUTO = "auto", t.DXA = "dxa", t.NIL = "nil", t.PERCENTAGE = "pct", t))(Ln || {});
class ct extends q {
  constructor(e, { type: r = "auto", size: n }) {
    super(e);
    let o = n;
    r === "pct" && typeof n == "number" && (o = `${n}%`), this.root.push(
      new $e({
        type: { key: "w:type", value: r },
        size: { key: "w:w", value: Yo(o) }
      })
    );
  }
}
var Mn = /* @__PURE__ */ ((t) => (t.TABLE = "w:tblCellMar", t.TABLE_CELL = "w:tcMar", t))(Mn || {});
class la extends Je {
  constructor(e, { marginUnitType: r = Ln.DXA, top: n, left: o, bottom: c, right: u }) {
    super(e), n !== void 0 && this.root.push(new ct("w:top", { type: r, size: n })), o !== void 0 && this.root.push(new ct("w:left", { type: r, size: o })), c !== void 0 && this.root.push(new ct("w:bottom", { type: r, size: c })), u !== void 0 && this.root.push(new ct("w:right", { type: r, size: u }));
  }
}
class Al extends Je {
  constructor(e) {
    super("w:tcBorders"), e.top && this.root.push(new ve("w:top", e.top)), e.start && this.root.push(new ve("w:start", e.start)), e.left && this.root.push(new ve("w:left", e.left)), e.bottom && this.root.push(new ve("w:bottom", e.bottom)), e.end && this.root.push(new ve("w:end", e.end)), e.right && this.root.push(new ve("w:right", e.right));
  }
}
class Tl extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", { val: "w:val" });
  }
}
class Sl extends q {
  constructor(e) {
    super("w:gridSpan"), this.root.push(
      new Tl({
        val: De(e)
      })
    );
  }
}
var Un = /* @__PURE__ */ ((t) => (t.CONTINUE = "continue", t.RESTART = "restart", t))(Un || {});
class kl extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", { val: "w:val" });
  }
}
class zi extends q {
  constructor(e) {
    super("w:vMerge"), this.root.push(
      new kl({
        val: e
      })
    );
  }
}
class Il extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", { val: "w:val" });
  }
}
class Rl extends q {
  constructor(e) {
    super("w:textDirection"), this.root.push(
      new Il({
        val: e
      })
    );
  }
}
class Cl extends Je {
  constructor(e) {
    super("w:tcPr"), e.width && this.root.push(new ct("w:tcW", e.width)), e.columnSpan && this.root.push(new Sl(e.columnSpan)), e.verticalMerge ? this.root.push(new zi(e.verticalMerge)) : e.rowSpan && e.rowSpan > 1 && this.root.push(new zi(Un.RESTART)), e.borders && this.root.push(new Al(e.borders)), e.shading && this.root.push(new cr(e.shading)), e.margins && this.root.push(new la(Mn.TABLE_CELL, e.margins)), e.textDirection && this.root.push(new Rl(e.textDirection)), e.verticalAlign && this.root.push(new oa(e.verticalAlign));
  }
}
class zn extends q {
  constructor(e) {
    super("w:tc"), this.options = e, this.root.push(new Cl(e));
    for (const r of e.children)
      this.root.push(r);
  }
  prepForXml(e) {
    return this.root[this.root.length - 1] instanceof rt || this.root.push(new rt({})), super.prepForXml(e);
  }
}
const dt = {
  style: ur.NONE,
  size: 0,
  color: "auto"
}, pt = {
  style: ur.SINGLE,
  size: 4,
  color: "auto"
};
class ha extends q {
  constructor(e) {
    super("w:tblBorders"), e.top ? this.root.push(new ve("w:top", e.top)) : this.root.push(new ve("w:top", pt)), e.left ? this.root.push(new ve("w:left", e.left)) : this.root.push(new ve("w:left", pt)), e.bottom ? this.root.push(new ve("w:bottom", e.bottom)) : this.root.push(new ve("w:bottom", pt)), e.right ? this.root.push(new ve("w:right", e.right)) : this.root.push(new ve("w:right", pt)), e.insideHorizontal ? this.root.push(new ve("w:insideH", e.insideHorizontal)) : this.root.push(new ve("w:insideH", pt)), e.insideVertical ? this.root.push(new ve("w:insideV", e.insideVertical)) : this.root.push(new ve("w:insideV", pt));
  }
}
X(ha, "NONE", {
  top: dt,
  bottom: dt,
  left: dt,
  right: dt,
  insideHorizontal: dt,
  insideVertical: dt
});
class Nl extends q {
  constructor({
    horizontalAnchor: e,
    verticalAnchor: r,
    absoluteHorizontalPosition: n,
    relativeHorizontalPosition: o,
    absoluteVerticalPosition: c,
    relativeVerticalPosition: u,
    bottomFromText: i,
    topFromText: l,
    leftFromText: b,
    rightFromText: E,
    overlap: T
  }) {
    super("w:tblpPr"), this.root.push(
      new $e({
        leftFromText: { key: "w:leftFromText", value: b === void 0 ? void 0 : Ce(b) },
        rightFromText: {
          key: "w:rightFromText",
          value: E === void 0 ? void 0 : Ce(E)
        },
        topFromText: { key: "w:topFromText", value: l === void 0 ? void 0 : Ce(l) },
        bottomFromText: {
          key: "w:bottomFromText",
          value: i === void 0 ? void 0 : Ce(i)
        },
        absoluteHorizontalPosition: {
          key: "w:tblpX",
          value: n === void 0 ? void 0 : Ye(n)
        },
        absoluteVerticalPosition: {
          key: "w:tblpY",
          value: c === void 0 ? void 0 : Ye(c)
        },
        horizontalAnchor: {
          key: "w:horzAnchor",
          value: e === void 0 ? void 0 : e
        },
        relativeHorizontalPosition: {
          key: "w:tblpXSpec",
          value: o
        },
        relativeVerticalPosition: {
          key: "w:tblpYSpec",
          value: u
        },
        verticalAnchor: {
          key: "w:vertAnchor",
          value: r
        }
      })
    ), T && this.root.push(new ru("w:tblOverlap", T));
  }
}
class Ol extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", { type: "w:type" });
  }
}
class Dl extends q {
  constructor(e) {
    super("w:tblLayout"), this.root.push(new Ol({ type: e }));
  }
}
class Pl extends Je {
  constructor(e) {
    super("w:tblPr"), e.style && this.root.push(new lt("w:tblStyle", e.style)), e.float && this.root.push(new Nl(e.float)), e.visuallyRightToLeft !== void 0 && this.root.push(new ae("w:bidiVisual", e.visuallyRightToLeft)), e.width && this.root.push(new ct("w:tblW", e.width)), e.alignment && this.root.push(new Ws(e.alignment)), e.indent && this.root.push(new ct("w:tblInd", e.indent)), e.borders && this.root.push(new ha(e.borders)), e.shading && this.root.push(new cr(e.shading)), e.layout && this.root.push(new Dl(e.layout)), e.cellMargin && this.root.push(new la(Mn.TABLE, e.cellMargin));
  }
}
class Fl extends ia {
  constructor({
    rows: e,
    width: r,
    // eslint-disable-next-line functional/immutable-data
    columnWidths: n = Array(Math.max(...e.map((A) => A.CellCount))).fill(100),
    margins: o,
    indent: c,
    float: u,
    layout: i,
    style: l,
    borders: b,
    alignment: E,
    visuallyRightToLeft: T
  }) {
    super("w:tbl"), this.root.push(
      new Pl({
        borders: b ?? {},
        width: r ?? { size: 100 },
        indent: c,
        float: u,
        layout: i,
        style: l,
        alignment: E,
        cellMargin: o,
        visuallyRightToLeft: T
      })
    ), this.root.push(new xl(n));
    for (const A of e)
      this.root.push(A);
    e.forEach((A, m) => {
      if (m === e.length - 1)
        return;
      let v = 0;
      A.cells.forEach((y) => {
        if (y.options.rowSpan && y.options.rowSpan > 1) {
          const S = new zn({
            // the inserted CONTINUE cell has rowSpan, and will be handled when process the next row
            rowSpan: y.options.rowSpan - 1,
            columnSpan: y.options.columnSpan,
            borders: y.options.borders,
            children: [],
            verticalMerge: Un.CONTINUE
          });
          e[m + 1].addCellToColumnIndex(S, v);
        }
        v += y.options.columnSpan || 1;
      });
    });
  }
}
class Bl extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", { value: "w:val", rule: "w:hRule" });
  }
}
class Ll extends q {
  constructor(e, r) {
    super("w:trHeight"), this.root.push(
      new Bl({
        value: Ce(e),
        rule: r
      })
    );
  }
}
class Ml extends Je {
  constructor(e) {
    super("w:trPr"), e.cantSplit !== void 0 && this.root.push(new ae("w:cantSplit", e.cantSplit)), e.tableHeader !== void 0 && this.root.push(new ae("w:tblHeader", e.tableHeader)), e.height && this.root.push(new Ll(e.height.value, e.height.rule));
  }
}
class Ul extends q {
  constructor(e) {
    super("w:tr"), this.options = e, this.root.push(new Ml(e));
    for (const r of e.children)
      this.root.push(r);
  }
  get CellCount() {
    return this.options.children.length;
  }
  get cells() {
    return this.root.filter((e) => e instanceof zn);
  }
  addCellToIndex(e, r) {
    this.root.splice(r + 1, 0, e);
  }
  addCellToColumnIndex(e, r) {
    const n = this.columnIndexToRootIndex(r, !0);
    this.addCellToIndex(e, n - 1);
  }
  rootIndexToColumnIndex(e) {
    if (e < 1 || e >= this.root.length)
      throw new Error(`cell 'rootIndex' should between 1 to ${this.root.length - 1}`);
    let r = 0;
    for (let n = 1; n < e; n++) {
      const o = this.root[n];
      r += o.options.columnSpan || 1;
    }
    return r;
  }
  columnIndexToRootIndex(e, r = !1) {
    if (e < 0)
      throw new Error("cell 'columnIndex' should not less than zero");
    let n = 0, o = 1;
    for (; n <= e; ) {
      if (o >= this.root.length) {
        if (r)
          return this.root.length;
        throw new Error(`cell 'columnIndex' should not great than ${n - 1}`);
      }
      const c = this.root[o];
      o += 1, n += c && c.options.columnSpan || 1;
    }
    return o - 1;
  }
}
class zl extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", {
      xmlns: "xmlns",
      vt: "xmlns:vt"
    });
  }
}
class jl extends q {
  constructor() {
    super("Properties"), this.root.push(
      new zl({
        xmlns: "http://schemas.openxmlformats.org/officeDocument/2006/extended-properties",
        vt: "http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"
      })
    );
  }
}
class Hl extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", {
      xmlns: "xmlns"
    });
  }
}
class Wl extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", {
      contentType: "ContentType",
      extension: "Extension"
    });
  }
}
class at extends q {
  constructor(e, r) {
    super("Default"), this.root.push(
      new Wl({
        contentType: e,
        extension: r
      })
    );
  }
}
class Gl extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", {
      contentType: "ContentType",
      partName: "PartName"
    });
  }
}
class Ue extends q {
  constructor(e, r) {
    super("Override"), this.root.push(
      new Gl({
        contentType: e,
        partName: r
      })
    );
  }
}
class Kl extends q {
  constructor() {
    super("Types"), this.root.push(
      new Hl({
        xmlns: "http://schemas.openxmlformats.org/package/2006/content-types"
      })
    ), this.root.push(new at("image/png", "png")), this.root.push(new at("image/jpeg", "jpeg")), this.root.push(new at("image/jpeg", "jpg")), this.root.push(new at("image/bmp", "bmp")), this.root.push(new at("image/gif", "gif")), this.root.push(new at("application/vnd.openxmlformats-package.relationships+xml", "rels")), this.root.push(new at("application/xml", "xml")), this.root.push(
      new Ue("application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml", "/word/document.xml")
    ), this.root.push(new Ue("application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml", "/word/styles.xml")), this.root.push(new Ue("application/vnd.openxmlformats-package.core-properties+xml", "/docProps/core.xml")), this.root.push(new Ue("application/vnd.openxmlformats-officedocument.custom-properties+xml", "/docProps/custom.xml")), this.root.push(new Ue("application/vnd.openxmlformats-officedocument.extended-properties+xml", "/docProps/app.xml")), this.root.push(new Ue("application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml", "/word/numbering.xml")), this.root.push(new Ue("application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml", "/word/footnotes.xml")), this.root.push(new Ue("application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml", "/word/settings.xml")), this.root.push(new Ue("application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml", "/word/comments.xml"));
  }
  addFooter(e) {
    this.root.push(
      new Ue("application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml", `/word/footer${e}.xml`)
    );
  }
  addHeader(e) {
    this.root.push(
      new Ue("application/vnd.openxmlformats-officedocument.wordprocessingml.header+xml", `/word/header${e}.xml`)
    );
  }
}
class ql extends q {
  constructor(e) {
    super("cp:coreProperties"), this.root.push(
      new zt({
        cp: "http://schemas.openxmlformats.org/package/2006/metadata/core-properties",
        dc: "http://purl.org/dc/elements/1.1/",
        dcterms: "http://purl.org/dc/terms/",
        dcmitype: "http://purl.org/dc/dcmitype/",
        xsi: "http://www.w3.org/2001/XMLSchema-instance"
      })
    ), e.title && this.root.push(new it("dc:title", e.title)), e.subject && this.root.push(new it("dc:subject", e.subject)), e.creator && this.root.push(new it("dc:creator", e.creator)), e.keywords && this.root.push(new it("cp:keywords", e.keywords)), e.description && this.root.push(new it("dc:description", e.description)), e.lastModifiedBy && this.root.push(new it("cp:lastModifiedBy", e.lastModifiedBy)), e.revision && this.root.push(new it("cp:revision", String(e.revision))), this.root.push(new ji("dcterms:created")), this.root.push(new ji("dcterms:modified"));
  }
}
class ji extends q {
  constructor(e) {
    super(e), this.root.push(
      new zt({
        type: "dcterms:W3CDTF"
      })
    ), this.root.push(eu(/* @__PURE__ */ new Date()));
  }
}
class Vl extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", {
      xmlns: "xmlns",
      vt: "xmlns:vt"
    });
  }
}
class $l extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", {
      fmtid: "fmtid",
      pid: "pid",
      name: "name"
    });
  }
}
class Xl extends q {
  constructor(e, r) {
    super("property"), this.root.push(
      new $l({
        fmtid: "{D5CDD505-2E9C-101B-9397-08002B2CF9AE}",
        pid: e.toString(),
        name: r.name
      })
    ), this.root.push(new Zl(r.value));
  }
}
class Zl extends q {
  constructor(e) {
    super("vt:lpwstr"), this.root.push(e);
  }
}
class Yl extends q {
  constructor(e) {
    super("Properties"), X(this, "nextId"), X(this, "properties", []), this.root.push(
      new Vl({
        xmlns: "http://schemas.openxmlformats.org/officeDocument/2006/custom-properties",
        vt: "http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"
      })
    ), this.nextId = 2;
    for (const r of e)
      this.addCustomProperty(r);
  }
  prepForXml(e) {
    return this.properties.forEach((r) => this.root.push(r)), super.prepForXml(e);
  }
  addCustomProperty(e) {
    this.properties.push(new Xl(this.nextId++, e));
  }
}
class Jl extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", {
      wpc: "xmlns:wpc",
      mc: "xmlns:mc",
      o: "xmlns:o",
      r: "xmlns:r",
      m: "xmlns:m",
      v: "xmlns:v",
      wp14: "xmlns:wp14",
      wp: "xmlns:wp",
      w10: "xmlns:w10",
      w: "xmlns:w",
      w14: "xmlns:w14",
      w15: "xmlns:w15",
      wpg: "xmlns:wpg",
      wpi: "xmlns:wpi",
      wne: "xmlns:wne",
      wps: "xmlns:wps",
      cp: "xmlns:cp",
      dc: "xmlns:dc",
      dcterms: "xmlns:dcterms",
      dcmitype: "xmlns:dcmitype",
      xsi: "xmlns:xsi",
      type: "xsi:type"
    });
  }
}
let Ql = class extends Ms {
  constructor(e, r) {
    super("w:ftr", r), X(this, "refId"), this.refId = e, r || this.root.push(
      new Jl({
        wpc: "http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas",
        mc: "http://schemas.openxmlformats.org/markup-compatibility/2006",
        o: "urn:schemas-microsoft-com:office:office",
        r: "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
        m: "http://schemas.openxmlformats.org/officeDocument/2006/math",
        v: "urn:schemas-microsoft-com:vml",
        wp14: "http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing",
        wp: "http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing",
        w10: "urn:schemas-microsoft-com:office:word",
        w: "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
        w14: "http://schemas.microsoft.com/office/word/2010/wordml",
        w15: "http://schemas.microsoft.com/office/word/2012/wordml",
        wpg: "http://schemas.microsoft.com/office/word/2010/wordprocessingGroup",
        wpi: "http://schemas.microsoft.com/office/word/2010/wordprocessingInk",
        wne: "http://schemas.microsoft.com/office/word/2006/wordml",
        wps: "http://schemas.microsoft.com/office/word/2010/wordprocessingShape"
      })
    );
  }
  get ReferenceId() {
    return this.refId;
  }
  add(e) {
    this.root.push(e);
  }
};
class eh {
  constructor(e, r, n) {
    X(this, "footer"), X(this, "relationships"), this.media = e, this.footer = new Ql(r, n), this.relationships = new jt();
  }
  add(e) {
    this.footer.add(e);
  }
  addChildElement(e) {
    this.footer.addChildElement(e);
  }
  get View() {
    return this.footer;
  }
  get Relationships() {
    return this.relationships;
  }
  get Media() {
    return this.media;
  }
}
class th extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", {
      type: "w:type",
      id: "w:id"
    });
  }
}
class rh extends q {
  constructor() {
    super("w:footnoteRef");
  }
}
class nh extends Ut {
  constructor() {
    super({
      style: "FootnoteReference"
    }), this.root.push(new rh());
  }
}
var yn = /* @__PURE__ */ ((t) => (t.SEPERATOR = "separator", t.CONTINUATION_SEPERATOR = "continuationSeparator", t))(yn || {});
class an extends q {
  constructor(e) {
    super("w:footnote"), this.root.push(
      new th({
        type: e.type,
        id: e.id
      })
    );
    for (let r = 0; r < e.children.length; r++) {
      const n = e.children[r];
      r === 0 && n.addRunToFront(new nh()), this.root.push(n);
    }
  }
}
class ih extends q {
  constructor() {
    super("w:continuationSeparator");
  }
}
class sh extends Ut {
  constructor() {
    super({}), this.root.push(new ih());
  }
}
class ah extends q {
  constructor() {
    super("w:separator");
  }
}
class oh extends Ut {
  constructor() {
    super({}), this.root.push(new ah());
  }
}
class uh extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", {
      wpc: "xmlns:wpc",
      mc: "xmlns:mc",
      o: "xmlns:o",
      r: "xmlns:r",
      m: "xmlns:m",
      v: "xmlns:v",
      wp14: "xmlns:wp14",
      wp: "xmlns:wp",
      w10: "xmlns:w10",
      w: "xmlns:w",
      w14: "xmlns:w14",
      w15: "xmlns:w15",
      wpg: "xmlns:wpg",
      wpi: "xmlns:wpi",
      wne: "xmlns:wne",
      wps: "xmlns:wps",
      Ignorable: "mc:Ignorable"
    });
  }
}
class ch extends q {
  constructor() {
    super("w:footnotes"), this.root.push(
      new uh({
        wpc: "http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas",
        mc: "http://schemas.openxmlformats.org/markup-compatibility/2006",
        o: "urn:schemas-microsoft-com:office:office",
        r: "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
        m: "http://schemas.openxmlformats.org/officeDocument/2006/math",
        v: "urn:schemas-microsoft-com:vml",
        wp14: "http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing",
        wp: "http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing",
        w10: "urn:schemas-microsoft-com:office:word",
        w: "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
        w14: "http://schemas.microsoft.com/office/word/2010/wordml",
        w15: "http://schemas.microsoft.com/office/word/2012/wordml",
        wpg: "http://schemas.microsoft.com/office/word/2010/wordprocessingGroup",
        wpi: "http://schemas.microsoft.com/office/word/2010/wordprocessingInk",
        wne: "http://schemas.microsoft.com/office/word/2006/wordml",
        wps: "http://schemas.microsoft.com/office/word/2010/wordprocessingShape",
        Ignorable: "w14 w15 wp14"
      })
    );
    const e = new an({
      id: -1,
      type: yn.SEPERATOR,
      children: [
        new rt({
          spacing: {
            after: 0,
            line: 240,
            lineRule: tr.AUTO
          },
          children: [new oh()]
        })
      ]
    });
    this.root.push(e);
    const r = new an({
      id: 0,
      type: yn.CONTINUATION_SEPERATOR,
      children: [
        new rt({
          spacing: {
            after: 0,
            line: 240,
            lineRule: tr.AUTO
          },
          children: [new sh()]
        })
      ]
    });
    this.root.push(r);
  }
  createFootNote(e, r) {
    const n = new an({
      id: e,
      children: r
    });
    this.root.push(n);
  }
}
class lh {
  constructor() {
    X(this, "footnotess"), X(this, "relationships"), this.footnotess = new ch(), this.relationships = new jt();
  }
  get View() {
    return this.footnotess;
  }
  get Relationships() {
    return this.relationships;
  }
}
class hh extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", {
      wpc: "xmlns:wpc",
      mc: "xmlns:mc",
      o: "xmlns:o",
      r: "xmlns:r",
      m: "xmlns:m",
      v: "xmlns:v",
      wp14: "xmlns:wp14",
      wp: "xmlns:wp",
      w10: "xmlns:w10",
      w: "xmlns:w",
      w14: "xmlns:w14",
      w15: "xmlns:w15",
      wpg: "xmlns:wpg",
      wpi: "xmlns:wpi",
      wne: "xmlns:wne",
      wps: "xmlns:wps",
      cp: "xmlns:cp",
      dc: "xmlns:dc",
      dcterms: "xmlns:dcterms",
      dcmitype: "xmlns:dcmitype",
      xsi: "xmlns:xsi",
      type: "xsi:type",
      cx: "xmlns:cx",
      cx1: "xmlns:cx1",
      cx2: "xmlns:cx2",
      cx3: "xmlns:cx3",
      cx4: "xmlns:cx4",
      cx5: "xmlns:cx5",
      cx6: "xmlns:cx6",
      cx7: "xmlns:cx7",
      cx8: "xmlns:cx8",
      w16cid: "xmlns:w16cid",
      w16se: "xmlns:w16se"
    });
  }
}
let fh = class extends Ms {
  constructor(e, r) {
    super("w:hdr", r), X(this, "refId"), this.refId = e, r || this.root.push(
      new hh({
        wpc: "http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas",
        mc: "http://schemas.openxmlformats.org/markup-compatibility/2006",
        o: "urn:schemas-microsoft-com:office:office",
        r: "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
        m: "http://schemas.openxmlformats.org/officeDocument/2006/math",
        v: "urn:schemas-microsoft-com:vml",
        wp14: "http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing",
        wp: "http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing",
        w10: "urn:schemas-microsoft-com:office:word",
        w: "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
        w14: "http://schemas.microsoft.com/office/word/2010/wordml",
        w15: "http://schemas.microsoft.com/office/word/2012/wordml",
        wpg: "http://schemas.microsoft.com/office/word/2010/wordprocessingGroup",
        wpi: "http://schemas.microsoft.com/office/word/2010/wordprocessingInk",
        wne: "http://schemas.microsoft.com/office/word/2006/wordml",
        wps: "http://schemas.microsoft.com/office/word/2010/wordprocessingShape",
        cx: "http://schemas.microsoft.com/office/drawing/2014/chartex",
        cx1: "http://schemas.microsoft.com/office/drawing/2015/9/8/chartex",
        cx2: "http://schemas.microsoft.com/office/drawing/2015/10/21/chartex",
        cx3: "http://schemas.microsoft.com/office/drawing/2016/5/9/chartex",
        cx4: "http://schemas.microsoft.com/office/drawing/2016/5/10/chartex",
        cx5: "http://schemas.microsoft.com/office/drawing/2016/5/11/chartex",
        cx6: "http://schemas.microsoft.com/office/drawing/2016/5/12/chartex",
        cx7: "http://schemas.microsoft.com/office/drawing/2016/5/13/chartex",
        cx8: "http://schemas.microsoft.com/office/drawing/2016/5/14/chartex",
        w16cid: "http://schemas.microsoft.com/office/word/2016/wordml/cid",
        w16se: "http://schemas.microsoft.com/office/word/2015/wordml/symex"
      })
    );
  }
  get ReferenceId() {
    return this.refId;
  }
  add(e) {
    this.root.push(e);
  }
};
class dh {
  constructor(e, r, n) {
    X(this, "header"), X(this, "relationships"), this.media = e, this.header = new fh(r, n), this.relationships = new jt();
  }
  add(e) {
    return this.header.add(e), this;
  }
  addChildElement(e) {
    this.header.addChildElement(e);
  }
  get View() {
    return this.header;
  }
  get Relationships() {
    return this.relationships;
  }
  get Media() {
    return this.media;
  }
}
class ph {
  constructor() {
    X(this, "map"), this.map = /* @__PURE__ */ new Map();
  }
  addImage(e, r) {
    this.map.set(e, r);
  }
  get Array() {
    return Array.from(this.map.values());
  }
}
var We = /* @__PURE__ */ ((t) => (t.DECIMAL = "decimal", t.UPPER_ROMAN = "upperRoman", t.LOWER_ROMAN = "lowerRoman", t.UPPER_LETTER = "upperLetter", t.LOWER_LETTER = "lowerLetter", t.ORDINAL = "ordinal", t.CARDINAL_TEXT = "cardinalText", t.ORDINAL_TEXT = "ordinalText", t.HEX = "hex", t.CHICAGO = "chicago", t.IDEOGRAPH__DIGITAL = "ideographDigital", t.JAPANESE_COUNTING = "japaneseCounting", t.AIUEO = "aiueo", t.IROHA = "iroha", t.DECIMAL_FULL_WIDTH = "decimalFullWidth", t.DECIMAL_HALF_WIDTH = "decimalHalfWidth", t.JAPANESE_LEGAL = "japaneseLegal", t.JAPANESE_DIGITAL_TEN_THOUSAND = "japaneseDigitalTenThousand", t.DECIMAL_ENCLOSED_CIRCLE = "decimalEnclosedCircle", t.DECIMAL_FULL_WIDTH2 = "decimalFullWidth2", t.AIUEO_FULL_WIDTH = "aiueoFullWidth", t.IROHA_FULL_WIDTH = "irohaFullWidth", t.DECIMAL_ZERO = "decimalZero", t.BULLET = "bullet", t.GANADA = "ganada", t.CHOSUNG = "chosung", t.DECIMAL_ENCLOSED_FULLSTOP = "decimalEnclosedFullstop", t.DECIMAL_ENCLOSED_PARENTHESES = "decimalEnclosedParen", t.DECIMAL_ENCLOSED_CIRCLE_CHINESE = "decimalEnclosedCircleChinese", t.IDEOGRAPH_ENCLOSED_CIRCLE = "ideographEnclosedCircle", t.IDEOGRAPH_TRADITIONAL = "ideographTraditional", t.IDEOGRAPH_ZODIAC = "ideographZodiac", t.IDEOGRAPH_ZODIAC_TRADITIONAL = "ideographZodiacTraditional", t.TAIWANESE_COUNTING = "taiwaneseCounting", t.IDEOGRAPH_LEGAL_TRADITIONAL = "ideographLegalTraditional", t.TAIWANESE_COUNTING_THOUSAND = "taiwaneseCountingThousand", t.TAIWANESE_DIGITAL = "taiwaneseDigital", t.CHINESE_COUNTING = "chineseCounting", t.CHINESE_LEGAL_SIMPLIFIED = "chineseLegalSimplified", t.CHINESE_COUNTING_THOUSAND = "chineseCountingThousand", t.KOREAN_DIGITAL = "koreanDigital", t.KOREAN_COUNTING = "koreanCounting", t.KOREAN_LEGAL = "koreanLegal", t.KOREAN_DIGITAL2 = "koreanDigital2", t.VIETNAMESE_COUNTING = "vietnameseCounting", t.RUSSIAN_LOWER = "russianLower", t.RUSSIAN_UPPER = "russianUpper", t.NONE = "none", t.NUMBER_IN_DASH = "numberInDash", t.HEBREW1 = "hebrew1", t.HEBREW2 = "hebrew2", t.ARABIC_ALPHA = "arabicAlpha", t.ARABIC_ABJAD = "arabicAbjad", t.HINDI_VOWELS = "hindiVowels", t.HINDI_CONSONANTS = "hindiConsonants", t.HINDI_NUMBERS = "hindiNumbers", t.HINDI_COUNTING = "hindiCounting", t.THAI_LETTERS = "thaiLetters", t.THAI_NUMBERS = "thaiNumbers", t.THAI_COUNTING = "thaiCounting", t.BAHT_TEXT = "bahtText", t.DOLLAR_TEXT = "dollarText", t.CUSTOM = "custom", t))(We || {});
class mh extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", {
      ilvl: "w:ilvl",
      tentative: "w15:tentative"
    });
  }
}
class wh extends q {
  constructor(e) {
    super("w:numFmt"), this.root.push(
      new Ae({
        val: e
      })
    );
  }
}
class gh extends q {
  constructor(e) {
    super("w:lvlText"), this.root.push(
      new Ae({
        val: e
      })
    );
  }
}
class yh extends q {
  constructor(e) {
    super("w:lvlJc"), this.root.push(
      new Ae({
        val: e
      })
    );
  }
}
class bh extends q {
  constructor(e) {
    super("w:suff"), this.root.push(
      new Ae({
        val: e
      })
    );
  }
}
class vh extends q {
  constructor() {
    super("w:isLgl");
  }
}
class _h extends q {
  constructor({
    level: e,
    format: r,
    text: n,
    alignment: o = ze.START,
    start: c = 1,
    style: u,
    suffix: i,
    isLegalNumberingStyle: l
  }) {
    if (super("w:lvl"), X(this, "paragraphProperties"), X(this, "runProperties"), this.root.push(new js("w:start", De(c))), r && this.root.push(new wh(r)), i && this.root.push(new bh(i)), l && this.root.push(new vh()), n && this.root.push(new gh(n)), this.root.push(new yh(o)), this.paragraphProperties = new Tt(u && u.paragraph), this.runProperties = new kt(u && u.run), this.root.push(this.paragraphProperties), this.root.push(this.runProperties), e > 9)
      throw new Error(
        "Level cannot be greater than 9. Read more here: https://answers.microsoft.com/en-us/msoffice/forum/all/does-word-support-more-than-9-list-levels/d130fdcd-1781-446d-8c84-c6c79124e4d7"
      );
    this.root.push(
      new mh({
        ilvl: De(e),
        tentative: 1
      })
    );
  }
}
class xh extends _h {
  // This is the level that sits under abstractNum. We make a
  // handful of properties required
}
class Eh extends q {
  constructor(e) {
    super("w:multiLevelType"), this.root.push(
      new Ae({
        val: e
      })
    );
  }
}
class Ah extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", {
      abstractNumId: "w:abstractNumId",
      restartNumberingAfterBreak: "w15:restartNumberingAfterBreak"
    });
  }
}
class Hi extends q {
  constructor(e, r) {
    super("w:abstractNum"), X(this, "id"), this.root.push(
      new Ah({
        abstractNumId: De(e),
        restartNumberingAfterBreak: 0
      })
    ), this.root.push(new Eh("hybridMultilevel")), this.id = e;
    for (const n of r)
      this.root.push(new xh(n));
  }
}
class Th extends q {
  constructor(e) {
    super("w:abstractNumId"), this.root.push(
      new Ae({
        val: e
      })
    );
  }
}
class Sh extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", { numId: "w:numId" });
  }
}
class Wi extends q {
  constructor(e) {
    if (super("w:num"), X(this, "numId"), X(this, "reference"), X(this, "instance"), this.numId = e.numId, this.reference = e.reference, this.instance = e.instance, this.root.push(
      new Sh({
        numId: De(e.numId)
      })
    ), this.root.push(new Th(De(e.abstractNumId))), e.overrideLevels && e.overrideLevels.length)
      for (const r of e.overrideLevels)
        this.root.push(new Ih(r.num, r.start));
  }
}
class kh extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", { ilvl: "w:ilvl" });
  }
}
class Ih extends q {
  constructor(e, r) {
    super("w:lvlOverride"), this.root.push(new kh({ ilvl: e })), r !== void 0 && this.root.push(new Ch(r));
  }
}
class Rh extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", { val: "w:val" });
  }
}
class Ch extends q {
  constructor(e) {
    super("w:startOverride"), this.root.push(new Rh({ val: e }));
  }
}
class Nh extends q {
  constructor(e) {
    super("w:numbering"), X(this, "abstractNumberingMap", /* @__PURE__ */ new Map()), X(this, "concreteNumberingMap", /* @__PURE__ */ new Map()), X(this, "referenceConfigMap", /* @__PURE__ */ new Map()), X(this, "abstractNumUniqueNumericId", ku()), X(this, "concreteNumUniqueNumericId", Iu()), this.root.push(
      new zt({
        wpc: "http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas",
        mc: "http://schemas.openxmlformats.org/markup-compatibility/2006",
        o: "urn:schemas-microsoft-com:office:office",
        r: "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
        m: "http://schemas.openxmlformats.org/officeDocument/2006/math",
        v: "urn:schemas-microsoft-com:vml",
        wp14: "http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing",
        wp: "http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing",
        w10: "urn:schemas-microsoft-com:office:word",
        w: "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
        w14: "http://schemas.microsoft.com/office/word/2010/wordml",
        w15: "http://schemas.microsoft.com/office/word/2012/wordml",
        wpg: "http://schemas.microsoft.com/office/word/2010/wordprocessingGroup",
        wpi: "http://schemas.microsoft.com/office/word/2010/wordprocessingInk",
        wne: "http://schemas.microsoft.com/office/word/2006/wordml",
        wps: "http://schemas.microsoft.com/office/word/2010/wordprocessingShape",
        Ignorable: "w14 w15 wp14"
      })
    );
    const r = new Hi(this.abstractNumUniqueNumericId(), [
      {
        level: 0,
        format: We.BULLET,
        text: "●",
        alignment: ze.LEFT,
        style: {
          paragraph: {
            indent: { left: Me(0.5), hanging: Me(0.25) }
          }
        }
      },
      {
        level: 1,
        format: We.BULLET,
        text: "○",
        alignment: ze.LEFT,
        style: {
          paragraph: {
            indent: { left: Me(1), hanging: Me(0.25) }
          }
        }
      },
      {
        level: 2,
        format: We.BULLET,
        text: "■",
        alignment: ze.LEFT,
        style: {
          paragraph: {
            indent: { left: 2160, hanging: Me(0.25) }
          }
        }
      },
      {
        level: 3,
        format: We.BULLET,
        text: "●",
        alignment: ze.LEFT,
        style: {
          paragraph: {
            indent: { left: 2880, hanging: Me(0.25) }
          }
        }
      },
      {
        level: 4,
        format: We.BULLET,
        text: "○",
        alignment: ze.LEFT,
        style: {
          paragraph: {
            indent: { left: 3600, hanging: Me(0.25) }
          }
        }
      },
      {
        level: 5,
        format: We.BULLET,
        text: "■",
        alignment: ze.LEFT,
        style: {
          paragraph: {
            indent: { left: 4320, hanging: Me(0.25) }
          }
        }
      },
      {
        level: 6,
        format: We.BULLET,
        text: "●",
        alignment: ze.LEFT,
        style: {
          paragraph: {
            indent: { left: 5040, hanging: Me(0.25) }
          }
        }
      },
      {
        level: 7,
        format: We.BULLET,
        text: "●",
        alignment: ze.LEFT,
        style: {
          paragraph: {
            indent: { left: 5760, hanging: Me(0.25) }
          }
        }
      },
      {
        level: 8,
        format: We.BULLET,
        text: "●",
        alignment: ze.LEFT,
        style: {
          paragraph: {
            indent: { left: 6480, hanging: Me(0.25) }
          }
        }
      }
    ]);
    this.concreteNumberingMap.set(
      "default-bullet-numbering",
      new Wi({
        numId: 1,
        abstractNumId: r.id,
        reference: "default-bullet-numbering",
        instance: 0,
        overrideLevels: [
          {
            num: 0,
            start: 1
          }
        ]
      })
    ), this.abstractNumberingMap.set("default-bullet-numbering", r);
    for (const n of e.config)
      this.abstractNumberingMap.set(n.reference, new Hi(this.abstractNumUniqueNumericId(), n.levels)), this.referenceConfigMap.set(n.reference, n.levels);
  }
  prepForXml(e) {
    for (const r of this.abstractNumberingMap.values())
      this.root.push(r);
    for (const r of this.concreteNumberingMap.values())
      this.root.push(r);
    return super.prepForXml(e);
  }
  createConcreteNumberingInstance(e, r) {
    const n = this.abstractNumberingMap.get(e);
    if (!n)
      return;
    const o = `${e}-${r}`;
    if (this.concreteNumberingMap.has(o))
      return;
    const c = this.referenceConfigMap.get(e), u = c && c[0].start, i = {
      numId: this.concreteNumUniqueNumericId(),
      abstractNumId: n.id,
      reference: e,
      instance: r,
      overrideLevel: u && Number.isInteger(u) ? {
        num: 0,
        start: u
      } : {
        num: 0,
        start: 1
      }
    };
    this.concreteNumberingMap.set(o, new Wi(i));
  }
  get ConcreteNumbering() {
    return Array.from(this.concreteNumberingMap.values());
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get ReferenceConfig() {
    return Array.from(this.referenceConfigMap.values());
  }
}
class Oh extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", {
      version: "w:val",
      name: "w:name",
      uri: "w:uri"
    });
  }
}
class Dh extends q {
  constructor(e) {
    super("w:compatSetting"), this.root.push(
      new Oh({
        version: e,
        uri: "http://schemas.microsoft.com/office/word",
        name: "compatibilityMode"
      })
    );
  }
}
class Ph extends q {
  constructor(e) {
    super("w:compat"), e.version && this.root.push(new Dh(e.version)), e.useSingleBorderforContiguousCells && this.root.push(new ae("w:useSingleBorderforContiguousCells", e.useSingleBorderforContiguousCells)), e.wordPerfectJustification && this.root.push(new ae("w:wpJustification", e.wordPerfectJustification)), e.noTabStopForHangingIndent && this.root.push(new ae("w:noTabHangInd", e.noTabStopForHangingIndent)), e.noLeading && this.root.push(new ae("w:noLeading", e.noLeading)), e.spaceForUnderline && this.root.push(new ae("w:spaceForUL", e.spaceForUnderline)), e.noColumnBalance && this.root.push(new ae("w:noColumnBalance", e.noColumnBalance)), e.balanceSingleByteDoubleByteWidth && this.root.push(new ae("w:balanceSingleByteDoubleByteWidth", e.balanceSingleByteDoubleByteWidth)), e.noExtraLineSpacing && this.root.push(new ae("w:noExtraLineSpacing", e.noExtraLineSpacing)), e.doNotLeaveBackslashAlone && this.root.push(new ae("w:doNotLeaveBackslashAlone", e.doNotLeaveBackslashAlone)), e.underlineTrailingSpaces && this.root.push(new ae("w:ulTrailSpace", e.underlineTrailingSpaces)), e.doNotExpandShiftReturn && this.root.push(new ae("w:doNotExpandShiftReturn", e.doNotExpandShiftReturn)), e.spacingInWholePoints && this.root.push(new ae("w:spacingInWholePoints", e.spacingInWholePoints)), e.lineWrapLikeWord6 && this.root.push(new ae("w:lineWrapLikeWord6", e.lineWrapLikeWord6)), e.printBodyTextBeforeHeader && this.root.push(new ae("w:printBodyTextBeforeHeader", e.printBodyTextBeforeHeader)), e.printColorsBlack && this.root.push(new ae("w:printColBlack", e.printColorsBlack)), e.spaceWidth && this.root.push(new ae("w:wpSpaceWidth", e.spaceWidth)), e.showBreaksInFrames && this.root.push(new ae("w:showBreaksInFrames", e.showBreaksInFrames)), e.subFontBySize && this.root.push(new ae("w:subFontBySize", e.subFontBySize)), e.suppressBottomSpacing && this.root.push(new ae("w:suppressBottomSpacing", e.suppressBottomSpacing)), e.suppressTopSpacing && this.root.push(new ae("w:suppressTopSpacing", e.suppressTopSpacing)), e.suppressSpacingAtTopOfPage && this.root.push(new ae("w:suppressSpacingAtTopOfPage", e.suppressSpacingAtTopOfPage)), e.suppressTopSpacingWP && this.root.push(new ae("w:suppressTopSpacingWP", e.suppressTopSpacingWP)), e.suppressSpBfAfterPgBrk && this.root.push(new ae("w:suppressSpBfAfterPgBrk", e.suppressSpBfAfterPgBrk)), e.swapBordersFacingPages && this.root.push(new ae("w:swapBordersFacingPages", e.swapBordersFacingPages)), e.convertMailMergeEsc && this.root.push(new ae("w:convMailMergeEsc", e.convertMailMergeEsc)), e.truncateFontHeightsLikeWP6 && this.root.push(new ae("w:truncateFontHeightsLikeWP6", e.truncateFontHeightsLikeWP6)), e.macWordSmallCaps && this.root.push(new ae("w:mwSmallCaps", e.macWordSmallCaps)), e.usePrinterMetrics && this.root.push(new ae("w:usePrinterMetrics", e.usePrinterMetrics)), e.doNotSuppressParagraphBorders && this.root.push(new ae("w:doNotSuppressParagraphBorders", e.doNotSuppressParagraphBorders)), e.wrapTrailSpaces && this.root.push(new ae("w:wrapTrailSpaces", e.wrapTrailSpaces)), e.footnoteLayoutLikeWW8 && this.root.push(new ae("w:footnoteLayoutLikeWW8", e.footnoteLayoutLikeWW8)), e.shapeLayoutLikeWW8 && this.root.push(new ae("w:shapeLayoutLikeWW8", e.shapeLayoutLikeWW8)), e.alignTablesRowByRow && this.root.push(new ae("w:alignTablesRowByRow", e.alignTablesRowByRow)), e.forgetLastTabAlignment && this.root.push(new ae("w:forgetLastTabAlignment", e.forgetLastTabAlignment)), e.adjustLineHeightInTable && this.root.push(new ae("w:adjustLineHeightInTable", e.adjustLineHeightInTable)), e.autoSpaceLikeWord95 && this.root.push(new ae("w:autoSpaceLikeWord95", e.autoSpaceLikeWord95)), e.noSpaceRaiseLower && this.root.push(new ae("w:noSpaceRaiseLower", e.noSpaceRaiseLower)), e.doNotUseHTMLParagraphAutoSpacing && this.root.push(new ae("w:doNotUseHTMLParagraphAutoSpacing", e.doNotUseHTMLParagraphAutoSpacing)), e.layoutRawTableWidth && this.root.push(new ae("w:layoutRawTableWidth", e.layoutRawTableWidth)), e.layoutTableRowsApart && this.root.push(new ae("w:layoutTableRowsApart", e.layoutTableRowsApart)), e.useWord97LineBreakRules && this.root.push(new ae("w:useWord97LineBreakRules", e.useWord97LineBreakRules)), e.doNotBreakWrappedTables && this.root.push(new ae("w:doNotBreakWrappedTables", e.doNotBreakWrappedTables)), e.doNotSnapToGridInCell && this.root.push(new ae("w:doNotSnapToGridInCell", e.doNotSnapToGridInCell)), e.selectFieldWithFirstOrLastCharacter && this.root.push(new ae("w:selectFldWithFirstOrLastChar", e.selectFieldWithFirstOrLastCharacter)), e.applyBreakingRules && this.root.push(new ae("w:applyBreakingRules", e.applyBreakingRules)), e.doNotWrapTextWithPunctuation && this.root.push(new ae("w:doNotWrapTextWithPunct", e.doNotWrapTextWithPunctuation)), e.doNotUseEastAsianBreakRules && this.root.push(new ae("w:doNotUseEastAsianBreakRules", e.doNotUseEastAsianBreakRules)), e.useWord2002TableStyleRules && this.root.push(new ae("w:useWord2002TableStyleRules", e.useWord2002TableStyleRules)), e.growAutofit && this.root.push(new ae("w:growAutofit", e.growAutofit)), e.useFELayout && this.root.push(new ae("w:useFELayout", e.useFELayout)), e.useNormalStyleForList && this.root.push(new ae("w:useNormalStyleForList", e.useNormalStyleForList)), e.doNotUseIndentAsNumberingTabStop && this.root.push(new ae("w:doNotUseIndentAsNumberingTabStop", e.doNotUseIndentAsNumberingTabStop)), e.useAlternateEastAsianLineBreakRules && this.root.push(new ae("w:useAltKinsokuLineBreakRules", e.useAlternateEastAsianLineBreakRules)), e.allowSpaceOfSameStyleInTable && this.root.push(new ae("w:allowSpaceOfSameStyleInTable", e.allowSpaceOfSameStyleInTable)), e.doNotSuppressIndentation && this.root.push(new ae("w:doNotSuppressIndentation", e.doNotSuppressIndentation)), e.doNotAutofitConstrainedTables && this.root.push(new ae("w:doNotAutofitConstrainedTables", e.doNotAutofitConstrainedTables)), e.autofitToFirstFixedWidthCell && this.root.push(new ae("w:autofitToFirstFixedWidthCell", e.autofitToFirstFixedWidthCell)), e.underlineTabInNumberingList && this.root.push(new ae("w:underlineTabInNumList", e.underlineTabInNumberingList)), e.displayHangulFixedWidth && this.root.push(new ae("w:displayHangulFixedWidth", e.displayHangulFixedWidth)), e.splitPgBreakAndParaMark && this.root.push(new ae("w:splitPgBreakAndParaMark", e.splitPgBreakAndParaMark)), e.doNotVerticallyAlignCellWithSp && this.root.push(new ae("w:doNotVertAlignCellWithSp", e.doNotVerticallyAlignCellWithSp)), e.doNotBreakConstrainedForcedTable && this.root.push(new ae("w:doNotBreakConstrainedForcedTable", e.doNotBreakConstrainedForcedTable)), e.ignoreVerticalAlignmentInTextboxes && this.root.push(new ae("w:doNotVertAlignInTxbx", e.ignoreVerticalAlignmentInTextboxes)), e.useAnsiKerningPairs && this.root.push(new ae("w:useAnsiKerningPairs", e.useAnsiKerningPairs)), e.cachedColumnBalance && this.root.push(new ae("w:cachedColBalance", e.cachedColumnBalance));
  }
}
class Fh extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", {
      wpc: "xmlns:wpc",
      mc: "xmlns:mc",
      o: "xmlns:o",
      r: "xmlns:r",
      m: "xmlns:m",
      v: "xmlns:v",
      wp14: "xmlns:wp14",
      wp: "xmlns:wp",
      w10: "xmlns:w10",
      w: "xmlns:w",
      w14: "xmlns:w14",
      w15: "xmlns:w15",
      wpg: "xmlns:wpg",
      wpi: "xmlns:wpi",
      wne: "xmlns:wne",
      wps: "xmlns:wps",
      Ignorable: "mc:Ignorable"
    });
  }
}
class Bh extends q {
  constructor(e) {
    var r;
    super("w:settings"), this.root.push(
      new Fh({
        wpc: "http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas",
        mc: "http://schemas.openxmlformats.org/markup-compatibility/2006",
        o: "urn:schemas-microsoft-com:office:office",
        r: "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
        m: "http://schemas.openxmlformats.org/officeDocument/2006/math",
        v: "urn:schemas-microsoft-com:vml",
        wp14: "http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing",
        wp: "http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing",
        w10: "urn:schemas-microsoft-com:office:word",
        w: "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
        w14: "http://schemas.microsoft.com/office/word/2010/wordml",
        w15: "http://schemas.microsoft.com/office/word/2012/wordml",
        wpg: "http://schemas.microsoft.com/office/word/2010/wordprocessingGroup",
        wpi: "http://schemas.microsoft.com/office/word/2010/wordprocessingInk",
        wne: "http://schemas.microsoft.com/office/word/2006/wordml",
        wps: "http://schemas.microsoft.com/office/word/2010/wordprocessingShape",
        Ignorable: "w14 w15 wp14"
      })
    ), this.root.push(new ae("w:displayBackgroundShape", !0)), e.trackRevisions !== void 0 && this.root.push(new ae("w:trackRevisions", e.trackRevisions)), e.evenAndOddHeaders !== void 0 && this.root.push(new ae("w:evenAndOddHeaders", e.evenAndOddHeaders)), e.updateFields !== void 0 && this.root.push(new ae("w:updateFields", e.updateFields)), this.root.push(
      new Ph({
        ...e.compatibility ?? {},
        version: ((r = e.compatibility) == null ? void 0 : r.version) ?? e.compatibilityModeVersion ?? 15
      })
    );
  }
}
class fa extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", { val: "w:val" });
  }
}
class Lh extends q {
  constructor(e) {
    super("w:name"), this.root.push(new fa({ val: e }));
  }
}
class Mh extends q {
  constructor(e) {
    super("w:uiPriority"), this.root.push(new fa({ val: De(e) }));
  }
}
class Uh extends le {
  constructor() {
    super(...arguments), X(this, "xmlKeys", {
      type: "w:type",
      styleId: "w:styleId",
      default: "w:default",
      customStyle: "w:customStyle"
    });
  }
}
class da extends q {
  constructor(e, r) {
    super("w:style"), this.root.push(new Uh(e)), r.name && this.root.push(new Lh(r.name)), r.basedOn && this.root.push(new lt("w:basedOn", r.basedOn)), r.next && this.root.push(new lt("w:next", r.next)), r.link && this.root.push(new lt("w:link", r.link)), r.uiPriority !== void 0 && this.root.push(new Mh(r.uiPriority)), r.semiHidden !== void 0 && this.root.push(new ae("w:semiHidden", r.semiHidden)), r.unhideWhenUsed !== void 0 && this.root.push(new ae("w:unhideWhenUsed", r.unhideWhenUsed)), r.quickFormat !== void 0 && this.root.push(new ae("w:qFormat", r.quickFormat));
  }
}
class hr extends da {
  constructor(e) {
    super({ type: "paragraph", styleId: e.id }, e), X(this, "paragraphProperties"), X(this, "runProperties"), this.paragraphProperties = new Tt(e.paragraph), this.runProperties = new kt(e.run), this.root.push(this.paragraphProperties), this.root.push(this.runProperties);
  }
}
class fr extends da {
  constructor(e) {
    super(
      { type: "character", styleId: e.id },
      {
        uiPriority: 99,
        unhideWhenUsed: !0,
        ...e
      }
    ), X(this, "runProperties"), this.runProperties = new kt(e.run), this.root.push(this.runProperties);
  }
}
class nt extends hr {
  constructor(e) {
    super({
      basedOn: "Normal",
      next: "Normal",
      quickFormat: !0,
      ...e
    });
  }
}
class zh extends nt {
  constructor(e) {
    super({
      id: "Title",
      name: "Title",
      ...e
    });
  }
}
class jh extends nt {
  constructor(e) {
    super({
      id: "Heading1",
      name: "Heading 1",
      ...e
    });
  }
}
class Hh extends nt {
  constructor(e) {
    super({
      id: "Heading2",
      name: "Heading 2",
      ...e
    });
  }
}
class Wh extends nt {
  constructor(e) {
    super({
      id: "Heading3",
      name: "Heading 3",
      ...e
    });
  }
}
class Gh extends nt {
  constructor(e) {
    super({
      id: "Heading4",
      name: "Heading 4",
      ...e
    });
  }
}
class Kh extends nt {
  constructor(e) {
    super({
      id: "Heading5",
      name: "Heading 5",
      ...e
    });
  }
}
class qh extends nt {
  constructor(e) {
    super({
      id: "Heading6",
      name: "Heading 6",
      ...e
    });
  }
}
class Vh extends nt {
  constructor(e) {
    super({
      id: "Strong",
      name: "Strong",
      ...e
    });
  }
}
class $h extends hr {
  constructor(e) {
    super({
      id: "ListParagraph",
      name: "List Paragraph",
      basedOn: "Normal",
      quickFormat: !0,
      ...e
    });
  }
}
class Xh extends hr {
  constructor(e) {
    super({
      id: "FootnoteText",
      name: "footnote text",
      link: "FootnoteTextChar",
      basedOn: "Normal",
      uiPriority: 99,
      semiHidden: !0,
      unhideWhenUsed: !0,
      paragraph: {
        spacing: {
          after: 0,
          line: 240,
          lineRule: tr.AUTO
        }
      },
      run: {
        size: 20
      },
      ...e
    });
  }
}
class Zh extends fr {
  constructor(e) {
    super({
      id: "FootnoteReference",
      name: "footnote reference",
      basedOn: "DefaultParagraphFont",
      semiHidden: !0,
      run: {
        superScript: !0
      },
      ...e
    });
  }
}
class Yh extends fr {
  constructor(e) {
    super({
      id: "FootnoteTextChar",
      name: "Footnote Text Char",
      basedOn: "DefaultParagraphFont",
      link: "FootnoteText",
      semiHidden: !0,
      run: {
        size: 20
      },
      ...e
    });
  }
}
class Jh extends fr {
  constructor(e) {
    super({
      id: "Hyperlink",
      name: "Hyperlink",
      basedOn: "DefaultParagraphFont",
      run: {
        color: "0563C1",
        underline: {
          type: Ks.SINGLE
        }
      },
      ...e
    });
  }
}
class bn extends q {
  constructor(e) {
    if (super("w:styles"), e.initialStyles && this.root.push(e.initialStyles), e.importedStyles)
      for (const r of e.importedStyles)
        this.root.push(r);
    if (e.paragraphStyles)
      for (const r of e.paragraphStyles)
        this.root.push(new hr(r));
    if (e.characterStyles)
      for (const r of e.characterStyles)
        this.root.push(new fr(r));
  }
}
class Qh extends q {
  constructor(e) {
    super("w:pPrDefault"), this.root.push(new Tt(e));
  }
}
class ef extends q {
  constructor(e) {
    super("w:rPrDefault"), this.root.push(new kt(e));
  }
}
class tf extends q {
  constructor(e) {
    super("w:docDefaults"), X(this, "runPropertiesDefaults"), X(this, "paragraphPropertiesDefaults"), this.runPropertiesDefaults = new ef(e.run), this.paragraphPropertiesDefaults = new Qh(e.paragraph), this.root.push(this.runPropertiesDefaults), this.root.push(this.paragraphPropertiesDefaults);
  }
}
class rf {
  /**
   * Creates new Style based on the given styles.
   * Parses the styles and convert them to XmlComponent.
   * Example content from styles.xml:
   * <?xml version="1.0">
   * <w:styles xmlns:mc="some schema" ...>
   *
   *   <w:style w:type="paragraph" w:styleId="Heading1">
   *           <w:name w:val="heading 1"/>
   *           .....
   *   </w:style>
   *
   *   <w:style w:type="paragraph" w:styleId="Heading2">
   *           <w:name w:val="heading 2"/>
   *           .....
   *   </w:style>
   *
   *   <w:docDefaults>Or any other element will be parsed to</w:docDefaults>
   *
   * </w:styles>
   *
   * @param externalStyles context from styles.xml
   */
  newInstance(e) {
    const r = Ls.xml2js(e, { compact: !1 });
    let n;
    for (const u of r.elements || [])
      u.name === "w:styles" && (n = u);
    if (n === void 0)
      throw new Error("can not find styles element");
    const o = n.elements || [];
    return new bn({
      initialStyles: new $o(n.attributes),
      importedStyles: o.map((u) => Dn(u))
    });
  }
}
class Gi {
  newInstance(e = {}) {
    return {
      initialStyles: new zt({
        mc: "http://schemas.openxmlformats.org/markup-compatibility/2006",
        r: "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
        w: "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
        w14: "http://schemas.microsoft.com/office/word/2010/wordml",
        w15: "http://schemas.microsoft.com/office/word/2012/wordml",
        Ignorable: "w14 w15"
      }),
      importedStyles: [
        new tf(e.document ?? {}),
        new zh({
          run: {
            size: 56
          },
          ...e.title
        }),
        new jh({
          run: {
            color: "2E74B5",
            size: 32
          },
          ...e.heading1
        }),
        new Hh({
          run: {
            color: "2E74B5",
            size: 26
          },
          ...e.heading2
        }),
        new Wh({
          run: {
            color: "1F4D78",
            size: 24
          },
          ...e.heading3
        }),
        new Gh({
          run: {
            color: "2E74B5",
            italics: !0
          },
          ...e.heading4
        }),
        new Kh({
          run: {
            color: "2E74B5"
          },
          ...e.heading5
        }),
        new qh({
          run: {
            color: "1F4D78"
          },
          ...e.heading6
        }),
        new Vh({
          run: {
            bold: !0
          },
          ...e.strong
        }),
        new $h(e.listParagraph || {}),
        new Jh(e.hyperlink || {}),
        new Zh(e.footnoteReference || {}),
        new Xh(e.footnoteText || {}),
        new Yh(e.footnoteTextChar || {})
      ]
    };
  }
}
class nf {
  constructor(e) {
    X(this, "currentRelationshipId", 1), X(this, "documentWrapper"), X(this, "headers", []), X(this, "footers", []), X(this, "coreProperties"), X(this, "numbering"), X(this, "media"), X(this, "fileRelationships"), X(this, "footnotesWrapper"), X(this, "settings"), X(this, "contentTypes"), X(this, "customProperties"), X(this, "appProperties"), X(this, "styles"), X(this, "comments");
    var r, n;
    if (this.coreProperties = new ql({
      ...e,
      creator: e.creator ?? "Un-named",
      revision: e.revision ?? 1,
      lastModifiedBy: e.lastModifiedBy ?? "Un-named"
    }), this.numbering = new Nh(e.numbering ? e.numbering : { config: [] }), this.comments = new Cc(e.comments ?? { children: [] }), this.fileRelationships = new jt(), this.customProperties = new Yl(e.customProperties ?? []), this.appProperties = new jl(), this.footnotesWrapper = new lh(), this.contentTypes = new Kl(), this.documentWrapper = new ca({ background: e.background }), this.settings = new Bh({
      compatibilityModeVersion: e.compatabilityModeVersion,
      compatibility: e.compatibility,
      evenAndOddHeaders: !!e.evenAndOddHeaderAndFooters,
      trackRevisions: (r = e.features) == null ? void 0 : r.trackRevisions,
      updateFields: (n = e.features) == null ? void 0 : n.updateFields
    }), this.media = new ph(), e.externalStyles) {
      const o = new rf();
      this.styles = o.newInstance(e.externalStyles);
    } else if (e.styles) {
      const c = new Gi().newInstance(e.styles.default);
      this.styles = new bn({
        ...c,
        ...e.styles
      });
    } else {
      const o = new Gi();
      this.styles = new bn(o.newInstance());
    }
    this.addDefaultRelationships();
    for (const o of e.sections)
      this.addSection(o);
    if (e.footnotes)
      for (const o in e.footnotes)
        this.footnotesWrapper.View.createFootNote(parseFloat(o), e.footnotes[o].children);
  }
  addSection({ headers: e = {}, footers: r = {}, children: n, properties: o }) {
    this.documentWrapper.View.Body.addSection({
      ...o,
      headerWrapperGroup: {
        default: e.default ? this.createHeader(e.default) : void 0,
        first: e.first ? this.createHeader(e.first) : void 0,
        even: e.even ? this.createHeader(e.even) : void 0
      },
      footerWrapperGroup: {
        default: r.default ? this.createFooter(r.default) : void 0,
        first: r.first ? this.createFooter(r.first) : void 0,
        even: r.even ? this.createFooter(r.even) : void 0
      }
    });
    for (const c of n)
      this.documentWrapper.View.add(c);
  }
  createHeader(e) {
    const r = new dh(this.media, this.currentRelationshipId++);
    for (const n of e.options.children)
      r.add(n);
    return this.addHeaderToDocument(r), r;
  }
  createFooter(e) {
    const r = new eh(this.media, this.currentRelationshipId++);
    for (const n of e.options.children)
      r.add(n);
    return this.addFooterToDocument(r), r;
  }
  addHeaderToDocument(e, r = _t.DEFAULT) {
    this.headers.push({ header: e, type: r }), this.documentWrapper.Relationships.createRelationship(
      e.View.ReferenceId,
      "http://schemas.openxmlformats.org/officeDocument/2006/relationships/header",
      `header${this.headers.length}.xml`
    ), this.contentTypes.addHeader(this.headers.length);
  }
  addFooterToDocument(e, r = _t.DEFAULT) {
    this.footers.push({ footer: e, type: r }), this.documentWrapper.Relationships.createRelationship(
      e.View.ReferenceId,
      "http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer",
      `footer${this.footers.length}.xml`
    ), this.contentTypes.addFooter(this.footers.length);
  }
  addDefaultRelationships() {
    this.fileRelationships.createRelationship(
      1,
      "http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument",
      "word/document.xml"
    ), this.fileRelationships.createRelationship(
      2,
      "http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties",
      "docProps/core.xml"
    ), this.fileRelationships.createRelationship(
      3,
      "http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties",
      "docProps/app.xml"
    ), this.fileRelationships.createRelationship(
      4,
      "http://schemas.openxmlformats.org/officeDocument/2006/relationships/custom-properties",
      "docProps/custom.xml"
    ), this.documentWrapper.Relationships.createRelationship(
      // eslint-disable-next-line functional/immutable-data
      this.currentRelationshipId++,
      "http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles",
      "styles.xml"
    ), this.documentWrapper.Relationships.createRelationship(
      // eslint-disable-next-line functional/immutable-data
      this.currentRelationshipId++,
      "http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering",
      "numbering.xml"
    ), this.documentWrapper.Relationships.createRelationship(
      // eslint-disable-next-line functional/immutable-data
      this.currentRelationshipId++,
      "http://schemas.openxmlformats.org/officeDocument/2006/relationships/footnotes",
      "footnotes.xml"
    ), this.documentWrapper.Relationships.createRelationship(
      // eslint-disable-next-line functional/immutable-data
      this.currentRelationshipId++,
      "http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings",
      "settings.xml"
    ), this.documentWrapper.Relationships.createRelationship(
      // eslint-disable-next-line functional/immutable-data
      this.currentRelationshipId++,
      "http://schemas.openxmlformats.org/officeDocument/2006/relationships/comments",
      "comments.xml"
    );
  }
  get Document() {
    return this.documentWrapper;
  }
  get Styles() {
    return this.styles;
  }
  get CoreProperties() {
    return this.coreProperties;
  }
  get Numbering() {
    return this.numbering;
  }
  get Media() {
    return this.media;
  }
  get FileRelationships() {
    return this.fileRelationships;
  }
  get Headers() {
    return this.headers.map((e) => e.header);
  }
  get Footers() {
    return this.footers.map((e) => e.footer);
  }
  get ContentTypes() {
    return this.contentTypes;
  }
  get CustomProperties() {
    return this.customProperties;
  }
  get AppProperties() {
    return this.appProperties;
  }
  get FootNotes() {
    return this.footnotesWrapper;
  }
  get Settings() {
    return this.settings;
  }
  get Comments() {
    return this.comments;
  }
}
class sf {
  constructor(e = { children: [] }) {
    X(this, "options"), this.options = e;
  }
}
class af {
  constructor(e = { children: [] }) {
    X(this, "options"), this.options = e;
  }
}
function $t(t) {
  throw new Error('Could not dynamically require "' + t + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var pa = { exports: {} };
(function(t, e) {
  (function(r) {
    t.exports = r();
  })(function() {
    return function r(n, o, c) {
      function u(b, E) {
        if (!o[b]) {
          if (!n[b]) {
            var T = typeof $t == "function" && $t;
            if (!E && T)
              return T(b, !0);
            if (i)
              return i(b, !0);
            var A = new Error("Cannot find module '" + b + "'");
            throw A.code = "MODULE_NOT_FOUND", A;
          }
          var m = o[b] = { exports: {} };
          n[b][0].call(m.exports, function(v) {
            var y = n[b][1][v];
            return u(y || v);
          }, m, m.exports, r, n, o, c);
        }
        return o[b].exports;
      }
      for (var i = typeof $t == "function" && $t, l = 0; l < c.length; l++)
        u(c[l]);
      return u;
    }({ 1: [function(r, n, o) {
      var c = r("./utils"), u = r("./support"), i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
      o.encode = function(l) {
        for (var b, E, T, A, m, v, y, S = [], g = 0, x = l.length, R = x, D = c.getTypeOf(l) !== "string"; g < l.length; )
          R = x - g, T = D ? (b = l[g++], E = g < x ? l[g++] : 0, g < x ? l[g++] : 0) : (b = l.charCodeAt(g++), E = g < x ? l.charCodeAt(g++) : 0, g < x ? l.charCodeAt(g++) : 0), A = b >> 2, m = (3 & b) << 4 | E >> 4, v = 1 < R ? (15 & E) << 2 | T >> 6 : 64, y = 2 < R ? 63 & T : 64, S.push(i.charAt(A) + i.charAt(m) + i.charAt(v) + i.charAt(y));
        return S.join("");
      }, o.decode = function(l) {
        var b, E, T, A, m, v, y = 0, S = 0, g = "data:";
        if (l.substr(0, g.length) === g)
          throw new Error("Invalid base64 input, it looks like a data url.");
        var x, R = 3 * (l = l.replace(/[^A-Za-z0-9+/=]/g, "")).length / 4;
        if (l.charAt(l.length - 1) === i.charAt(64) && R--, l.charAt(l.length - 2) === i.charAt(64) && R--, R % 1 != 0)
          throw new Error("Invalid base64 input, bad content length.");
        for (x = u.uint8array ? new Uint8Array(0 | R) : new Array(0 | R); y < l.length; )
          b = i.indexOf(l.charAt(y++)) << 2 | (A = i.indexOf(l.charAt(y++))) >> 4, E = (15 & A) << 4 | (m = i.indexOf(l.charAt(y++))) >> 2, T = (3 & m) << 6 | (v = i.indexOf(l.charAt(y++))), x[S++] = b, m !== 64 && (x[S++] = E), v !== 64 && (x[S++] = T);
        return x;
      };
    }, { "./support": 30, "./utils": 32 }], 2: [function(r, n, o) {
      var c = r("./external"), u = r("./stream/DataWorker"), i = r("./stream/Crc32Probe"), l = r("./stream/DataLengthProbe");
      function b(E, T, A, m, v) {
        this.compressedSize = E, this.uncompressedSize = T, this.crc32 = A, this.compression = m, this.compressedContent = v;
      }
      b.prototype = { getContentWorker: function() {
        var E = new u(c.Promise.resolve(this.compressedContent)).pipe(this.compression.uncompressWorker()).pipe(new l("data_length")), T = this;
        return E.on("end", function() {
          if (this.streamInfo.data_length !== T.uncompressedSize)
            throw new Error("Bug : uncompressed data size mismatch");
        }), E;
      }, getCompressedWorker: function() {
        return new u(c.Promise.resolve(this.compressedContent)).withStreamInfo("compressedSize", this.compressedSize).withStreamInfo("uncompressedSize", this.uncompressedSize).withStreamInfo("crc32", this.crc32).withStreamInfo("compression", this.compression);
      } }, b.createWorkerFrom = function(E, T, A) {
        return E.pipe(new i()).pipe(new l("uncompressedSize")).pipe(T.compressWorker(A)).pipe(new l("compressedSize")).withStreamInfo("compression", T);
      }, n.exports = b;
    }, { "./external": 6, "./stream/Crc32Probe": 25, "./stream/DataLengthProbe": 26, "./stream/DataWorker": 27 }], 3: [function(r, n, o) {
      var c = r("./stream/GenericWorker");
      o.STORE = { magic: "\0\0", compressWorker: function() {
        return new c("STORE compression");
      }, uncompressWorker: function() {
        return new c("STORE decompression");
      } }, o.DEFLATE = r("./flate");
    }, { "./flate": 7, "./stream/GenericWorker": 28 }], 4: [function(r, n, o) {
      var c = r("./utils"), u = function() {
        for (var i, l = [], b = 0; b < 256; b++) {
          i = b;
          for (var E = 0; E < 8; E++)
            i = 1 & i ? 3988292384 ^ i >>> 1 : i >>> 1;
          l[b] = i;
        }
        return l;
      }();
      n.exports = function(i, l) {
        return i !== void 0 && i.length ? c.getTypeOf(i) !== "string" ? function(b, E, T, A) {
          var m = u, v = A + T;
          b ^= -1;
          for (var y = A; y < v; y++)
            b = b >>> 8 ^ m[255 & (b ^ E[y])];
          return -1 ^ b;
        }(0 | l, i, i.length, 0) : function(b, E, T, A) {
          var m = u, v = A + T;
          b ^= -1;
          for (var y = A; y < v; y++)
            b = b >>> 8 ^ m[255 & (b ^ E.charCodeAt(y))];
          return -1 ^ b;
        }(0 | l, i, i.length, 0) : 0;
      };
    }, { "./utils": 32 }], 5: [function(r, n, o) {
      o.base64 = !1, o.binary = !1, o.dir = !1, o.createFolders = !0, o.date = null, o.compression = null, o.compressionOptions = null, o.comment = null, o.unixPermissions = null, o.dosPermissions = null;
    }, {}], 6: [function(r, n, o) {
      var c = null;
      c = typeof Promise < "u" ? Promise : r("lie"), n.exports = { Promise: c };
    }, { lie: 37 }], 7: [function(r, n, o) {
      var c = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Uint32Array < "u", u = r("pako"), i = r("./utils"), l = r("./stream/GenericWorker"), b = c ? "uint8array" : "array";
      function E(T, A) {
        l.call(this, "FlateWorker/" + T), this._pako = null, this._pakoAction = T, this._pakoOptions = A, this.meta = {};
      }
      o.magic = "\b\0", i.inherits(E, l), E.prototype.processChunk = function(T) {
        this.meta = T.meta, this._pako === null && this._createPako(), this._pako.push(i.transformTo(b, T.data), !1);
      }, E.prototype.flush = function() {
        l.prototype.flush.call(this), this._pako === null && this._createPako(), this._pako.push([], !0);
      }, E.prototype.cleanUp = function() {
        l.prototype.cleanUp.call(this), this._pako = null;
      }, E.prototype._createPako = function() {
        this._pako = new u[this._pakoAction]({ raw: !0, level: this._pakoOptions.level || -1 });
        var T = this;
        this._pako.onData = function(A) {
          T.push({ data: A, meta: T.meta });
        };
      }, o.compressWorker = function(T) {
        return new E("Deflate", T);
      }, o.uncompressWorker = function() {
        return new E("Inflate", {});
      };
    }, { "./stream/GenericWorker": 28, "./utils": 32, pako: 38 }], 8: [function(r, n, o) {
      function c(m, v) {
        var y, S = "";
        for (y = 0; y < v; y++)
          S += String.fromCharCode(255 & m), m >>>= 8;
        return S;
      }
      function u(m, v, y, S, g, x) {
        var R, D, L = m.file, Y = m.compression, G = x !== b.utf8encode, Q = i.transformTo("string", x(L.name)), k = i.transformTo("string", b.utf8encode(L.name)), se = L.comment, ue = i.transformTo("string", x(se)), P = i.transformTo("string", b.utf8encode(se)), K = k.length !== L.name.length, _ = P.length !== se.length, J = "", fe = "", $ = "", pe = L.dir, ne = L.date, he = { crc32: 0, compressedSize: 0, uncompressedSize: 0 };
        v && !y || (he.crc32 = m.crc32, he.compressedSize = m.compressedSize, he.uncompressedSize = m.uncompressedSize);
        var j = 0;
        v && (j |= 8), G || !K && !_ || (j |= 2048);
        var C = 0, H = 0;
        pe && (C |= 16), g === "UNIX" ? (H = 798, C |= function(te, z) {
          var p = te;
          return te || (p = z ? 16893 : 33204), (65535 & p) << 16;
        }(L.unixPermissions, pe)) : (H = 20, C |= function(te) {
          return 63 & (te || 0);
        }(L.dosPermissions)), R = ne.getUTCHours(), R <<= 6, R |= ne.getUTCMinutes(), R <<= 5, R |= ne.getUTCSeconds() / 2, D = ne.getUTCFullYear() - 1980, D <<= 4, D |= ne.getUTCMonth() + 1, D <<= 5, D |= ne.getUTCDate(), K && (fe = c(1, 1) + c(E(Q), 4) + k, J += "up" + c(fe.length, 2) + fe), _ && ($ = c(1, 1) + c(E(ue), 4) + P, J += "uc" + c($.length, 2) + $);
        var W = "";
        return W += `
\0`, W += c(j, 2), W += Y.magic, W += c(R, 2), W += c(D, 2), W += c(he.crc32, 4), W += c(he.compressedSize, 4), W += c(he.uncompressedSize, 4), W += c(Q.length, 2), W += c(J.length, 2), { fileRecord: T.LOCAL_FILE_HEADER + W + Q + J, dirRecord: T.CENTRAL_FILE_HEADER + c(H, 2) + W + c(ue.length, 2) + "\0\0\0\0" + c(C, 4) + c(S, 4) + Q + J + ue };
      }
      var i = r("../utils"), l = r("../stream/GenericWorker"), b = r("../utf8"), E = r("../crc32"), T = r("../signature");
      function A(m, v, y, S) {
        l.call(this, "ZipFileWorker"), this.bytesWritten = 0, this.zipComment = v, this.zipPlatform = y, this.encodeFileName = S, this.streamFiles = m, this.accumulate = !1, this.contentBuffer = [], this.dirRecords = [], this.currentSourceOffset = 0, this.entriesCount = 0, this.currentFile = null, this._sources = [];
      }
      i.inherits(A, l), A.prototype.push = function(m) {
        var v = m.meta.percent || 0, y = this.entriesCount, S = this._sources.length;
        this.accumulate ? this.contentBuffer.push(m) : (this.bytesWritten += m.data.length, l.prototype.push.call(this, { data: m.data, meta: { currentFile: this.currentFile, percent: y ? (v + 100 * (y - S - 1)) / y : 100 } }));
      }, A.prototype.openedSource = function(m) {
        this.currentSourceOffset = this.bytesWritten, this.currentFile = m.file.name;
        var v = this.streamFiles && !m.file.dir;
        if (v) {
          var y = u(m, v, !1, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
          this.push({ data: y.fileRecord, meta: { percent: 0 } });
        } else
          this.accumulate = !0;
      }, A.prototype.closedSource = function(m) {
        this.accumulate = !1;
        var v = this.streamFiles && !m.file.dir, y = u(m, v, !0, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
        if (this.dirRecords.push(y.dirRecord), v)
          this.push({ data: function(S) {
            return T.DATA_DESCRIPTOR + c(S.crc32, 4) + c(S.compressedSize, 4) + c(S.uncompressedSize, 4);
          }(m), meta: { percent: 100 } });
        else
          for (this.push({ data: y.fileRecord, meta: { percent: 0 } }); this.contentBuffer.length; )
            this.push(this.contentBuffer.shift());
        this.currentFile = null;
      }, A.prototype.flush = function() {
        for (var m = this.bytesWritten, v = 0; v < this.dirRecords.length; v++)
          this.push({ data: this.dirRecords[v], meta: { percent: 100 } });
        var y = this.bytesWritten - m, S = function(g, x, R, D, L) {
          var Y = i.transformTo("string", L(D));
          return T.CENTRAL_DIRECTORY_END + "\0\0\0\0" + c(g, 2) + c(g, 2) + c(x, 4) + c(R, 4) + c(Y.length, 2) + Y;
        }(this.dirRecords.length, y, m, this.zipComment, this.encodeFileName);
        this.push({ data: S, meta: { percent: 100 } });
      }, A.prototype.prepareNextSource = function() {
        this.previous = this._sources.shift(), this.openedSource(this.previous.streamInfo), this.isPaused ? this.previous.pause() : this.previous.resume();
      }, A.prototype.registerPrevious = function(m) {
        this._sources.push(m);
        var v = this;
        return m.on("data", function(y) {
          v.processChunk(y);
        }), m.on("end", function() {
          v.closedSource(v.previous.streamInfo), v._sources.length ? v.prepareNextSource() : v.end();
        }), m.on("error", function(y) {
          v.error(y);
        }), this;
      }, A.prototype.resume = function() {
        return !!l.prototype.resume.call(this) && (!this.previous && this._sources.length ? (this.prepareNextSource(), !0) : this.previous || this._sources.length || this.generatedError ? void 0 : (this.end(), !0));
      }, A.prototype.error = function(m) {
        var v = this._sources;
        if (!l.prototype.error.call(this, m))
          return !1;
        for (var y = 0; y < v.length; y++)
          try {
            v[y].error(m);
          } catch {
          }
        return !0;
      }, A.prototype.lock = function() {
        l.prototype.lock.call(this);
        for (var m = this._sources, v = 0; v < m.length; v++)
          m[v].lock();
      }, n.exports = A;
    }, { "../crc32": 4, "../signature": 23, "../stream/GenericWorker": 28, "../utf8": 31, "../utils": 32 }], 9: [function(r, n, o) {
      var c = r("../compressions"), u = r("./ZipFileWorker");
      o.generateWorker = function(i, l, b) {
        var E = new u(l.streamFiles, b, l.platform, l.encodeFileName), T = 0;
        try {
          i.forEach(function(A, m) {
            T++;
            var v = function(x, R) {
              var D = x || R, L = c[D];
              if (!L)
                throw new Error(D + " is not a valid compression method !");
              return L;
            }(m.options.compression, l.compression), y = m.options.compressionOptions || l.compressionOptions || {}, S = m.dir, g = m.date;
            m._compressWorker(v, y).withStreamInfo("file", { name: A, dir: S, date: g, comment: m.comment || "", unixPermissions: m.unixPermissions, dosPermissions: m.dosPermissions }).pipe(E);
          }), E.entriesCount = T;
        } catch (A) {
          E.error(A);
        }
        return E;
      };
    }, { "../compressions": 3, "./ZipFileWorker": 8 }], 10: [function(r, n, o) {
      function c() {
        if (!(this instanceof c))
          return new c();
        if (arguments.length)
          throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");
        this.files = /* @__PURE__ */ Object.create(null), this.comment = null, this.root = "", this.clone = function() {
          var u = new c();
          for (var i in this)
            typeof this[i] != "function" && (u[i] = this[i]);
          return u;
        };
      }
      (c.prototype = r("./object")).loadAsync = r("./load"), c.support = r("./support"), c.defaults = r("./defaults"), c.version = "3.10.1", c.loadAsync = function(u, i) {
        return new c().loadAsync(u, i);
      }, c.external = r("./external"), n.exports = c;
    }, { "./defaults": 5, "./external": 6, "./load": 11, "./object": 15, "./support": 30 }], 11: [function(r, n, o) {
      var c = r("./utils"), u = r("./external"), i = r("./utf8"), l = r("./zipEntries"), b = r("./stream/Crc32Probe"), E = r("./nodejsUtils");
      function T(A) {
        return new u.Promise(function(m, v) {
          var y = A.decompressed.getContentWorker().pipe(new b());
          y.on("error", function(S) {
            v(S);
          }).on("end", function() {
            y.streamInfo.crc32 !== A.decompressed.crc32 ? v(new Error("Corrupted zip : CRC32 mismatch")) : m();
          }).resume();
        });
      }
      n.exports = function(A, m) {
        var v = this;
        return m = c.extend(m || {}, { base64: !1, checkCRC32: !1, optimizedBinaryString: !1, createFolders: !1, decodeFileName: i.utf8decode }), E.isNode && E.isStream(A) ? u.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file.")) : c.prepareContent("the loaded zip file", A, !0, m.optimizedBinaryString, m.base64).then(function(y) {
          var S = new l(m);
          return S.load(y), S;
        }).then(function(y) {
          var S = [u.Promise.resolve(y)], g = y.files;
          if (m.checkCRC32)
            for (var x = 0; x < g.length; x++)
              S.push(T(g[x]));
          return u.Promise.all(S);
        }).then(function(y) {
          for (var S = y.shift(), g = S.files, x = 0; x < g.length; x++) {
            var R = g[x], D = R.fileNameStr, L = c.resolve(R.fileNameStr);
            v.file(L, R.decompressed, { binary: !0, optimizedBinaryString: !0, date: R.date, dir: R.dir, comment: R.fileCommentStr.length ? R.fileCommentStr : null, unixPermissions: R.unixPermissions, dosPermissions: R.dosPermissions, createFolders: m.createFolders }), R.dir || (v.file(L).unsafeOriginalName = D);
          }
          return S.zipComment.length && (v.comment = S.zipComment), v;
        });
      };
    }, { "./external": 6, "./nodejsUtils": 14, "./stream/Crc32Probe": 25, "./utf8": 31, "./utils": 32, "./zipEntries": 33 }], 12: [function(r, n, o) {
      var c = r("../utils"), u = r("../stream/GenericWorker");
      function i(l, b) {
        u.call(this, "Nodejs stream input adapter for " + l), this._upstreamEnded = !1, this._bindStream(b);
      }
      c.inherits(i, u), i.prototype._bindStream = function(l) {
        var b = this;
        (this._stream = l).pause(), l.on("data", function(E) {
          b.push({ data: E, meta: { percent: 0 } });
        }).on("error", function(E) {
          b.isPaused ? this.generatedError = E : b.error(E);
        }).on("end", function() {
          b.isPaused ? b._upstreamEnded = !0 : b.end();
        });
      }, i.prototype.pause = function() {
        return !!u.prototype.pause.call(this) && (this._stream.pause(), !0);
      }, i.prototype.resume = function() {
        return !!u.prototype.resume.call(this) && (this._upstreamEnded ? this.end() : this._stream.resume(), !0);
      }, n.exports = i;
    }, { "../stream/GenericWorker": 28, "../utils": 32 }], 13: [function(r, n, o) {
      var c = r("readable-stream").Readable;
      function u(i, l, b) {
        c.call(this, l), this._helper = i;
        var E = this;
        i.on("data", function(T, A) {
          E.push(T) || E._helper.pause(), b && b(A);
        }).on("error", function(T) {
          E.emit("error", T);
        }).on("end", function() {
          E.push(null);
        });
      }
      r("../utils").inherits(u, c), u.prototype._read = function() {
        this._helper.resume();
      }, n.exports = u;
    }, { "../utils": 32, "readable-stream": 16 }], 14: [function(r, n, o) {
      n.exports = { isNode: typeof Buffer < "u", newBufferFrom: function(c, u) {
        if (Buffer.from && Buffer.from !== Uint8Array.from)
          return Buffer.from(c, u);
        if (typeof c == "number")
          throw new Error('The "data" argument must not be a number');
        return new Buffer(c, u);
      }, allocBuffer: function(c) {
        if (Buffer.alloc)
          return Buffer.alloc(c);
        var u = new Buffer(c);
        return u.fill(0), u;
      }, isBuffer: function(c) {
        return Buffer.isBuffer(c);
      }, isStream: function(c) {
        return c && typeof c.on == "function" && typeof c.pause == "function" && typeof c.resume == "function";
      } };
    }, {}], 15: [function(r, n, o) {
      function c(L, Y, G) {
        var Q, k = i.getTypeOf(Y), se = i.extend(G || {}, E);
        se.date = se.date || /* @__PURE__ */ new Date(), se.compression !== null && (se.compression = se.compression.toUpperCase()), typeof se.unixPermissions == "string" && (se.unixPermissions = parseInt(se.unixPermissions, 8)), se.unixPermissions && 16384 & se.unixPermissions && (se.dir = !0), se.dosPermissions && 16 & se.dosPermissions && (se.dir = !0), se.dir && (L = g(L)), se.createFolders && (Q = S(L)) && x.call(this, Q, !0);
        var ue = k === "string" && se.binary === !1 && se.base64 === !1;
        G && G.binary !== void 0 || (se.binary = !ue), (Y instanceof T && Y.uncompressedSize === 0 || se.dir || !Y || Y.length === 0) && (se.base64 = !1, se.binary = !0, Y = "", se.compression = "STORE", k = "string");
        var P = null;
        P = Y instanceof T || Y instanceof l ? Y : v.isNode && v.isStream(Y) ? new y(L, Y) : i.prepareContent(L, Y, se.binary, se.optimizedBinaryString, se.base64);
        var K = new A(L, P, se);
        this.files[L] = K;
      }
      var u = r("./utf8"), i = r("./utils"), l = r("./stream/GenericWorker"), b = r("./stream/StreamHelper"), E = r("./defaults"), T = r("./compressedObject"), A = r("./zipObject"), m = r("./generate"), v = r("./nodejsUtils"), y = r("./nodejs/NodejsStreamInputAdapter"), S = function(L) {
        L.slice(-1) === "/" && (L = L.substring(0, L.length - 1));
        var Y = L.lastIndexOf("/");
        return 0 < Y ? L.substring(0, Y) : "";
      }, g = function(L) {
        return L.slice(-1) !== "/" && (L += "/"), L;
      }, x = function(L, Y) {
        return Y = Y !== void 0 ? Y : E.createFolders, L = g(L), this.files[L] || c.call(this, L, null, { dir: !0, createFolders: Y }), this.files[L];
      };
      function R(L) {
        return Object.prototype.toString.call(L) === "[object RegExp]";
      }
      var D = { load: function() {
        throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
      }, forEach: function(L) {
        var Y, G, Q;
        for (Y in this.files)
          Q = this.files[Y], (G = Y.slice(this.root.length, Y.length)) && Y.slice(0, this.root.length) === this.root && L(G, Q);
      }, filter: function(L) {
        var Y = [];
        return this.forEach(function(G, Q) {
          L(G, Q) && Y.push(Q);
        }), Y;
      }, file: function(L, Y, G) {
        if (arguments.length !== 1)
          return L = this.root + L, c.call(this, L, Y, G), this;
        if (R(L)) {
          var Q = L;
          return this.filter(function(se, ue) {
            return !ue.dir && Q.test(se);
          });
        }
        var k = this.files[this.root + L];
        return k && !k.dir ? k : null;
      }, folder: function(L) {
        if (!L)
          return this;
        if (R(L))
          return this.filter(function(k, se) {
            return se.dir && L.test(k);
          });
        var Y = this.root + L, G = x.call(this, Y), Q = this.clone();
        return Q.root = G.name, Q;
      }, remove: function(L) {
        L = this.root + L;
        var Y = this.files[L];
        if (Y || (L.slice(-1) !== "/" && (L += "/"), Y = this.files[L]), Y && !Y.dir)
          delete this.files[L];
        else
          for (var G = this.filter(function(k, se) {
            return se.name.slice(0, L.length) === L;
          }), Q = 0; Q < G.length; Q++)
            delete this.files[G[Q].name];
        return this;
      }, generate: function() {
        throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
      }, generateInternalStream: function(L) {
        var Y, G = {};
        try {
          if ((G = i.extend(L || {}, { streamFiles: !1, compression: "STORE", compressionOptions: null, type: "", platform: "DOS", comment: null, mimeType: "application/zip", encodeFileName: u.utf8encode })).type = G.type.toLowerCase(), G.compression = G.compression.toUpperCase(), G.type === "binarystring" && (G.type = "string"), !G.type)
            throw new Error("No output type specified.");
          i.checkSupport(G.type), G.platform !== "darwin" && G.platform !== "freebsd" && G.platform !== "linux" && G.platform !== "sunos" || (G.platform = "UNIX"), G.platform === "win32" && (G.platform = "DOS");
          var Q = G.comment || this.comment || "";
          Y = m.generateWorker(this, G, Q);
        } catch (k) {
          (Y = new l("error")).error(k);
        }
        return new b(Y, G.type || "string", G.mimeType);
      }, generateAsync: function(L, Y) {
        return this.generateInternalStream(L).accumulate(Y);
      }, generateNodeStream: function(L, Y) {
        return (L = L || {}).type || (L.type = "nodebuffer"), this.generateInternalStream(L).toNodejsStream(Y);
      } };
      n.exports = D;
    }, { "./compressedObject": 2, "./defaults": 5, "./generate": 9, "./nodejs/NodejsStreamInputAdapter": 12, "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31, "./utils": 32, "./zipObject": 35 }], 16: [function(r, n, o) {
      n.exports = r("stream");
    }, { stream: void 0 }], 17: [function(r, n, o) {
      var c = r("./DataReader");
      function u(i) {
        c.call(this, i);
        for (var l = 0; l < this.data.length; l++)
          i[l] = 255 & i[l];
      }
      r("../utils").inherits(u, c), u.prototype.byteAt = function(i) {
        return this.data[this.zero + i];
      }, u.prototype.lastIndexOfSignature = function(i) {
        for (var l = i.charCodeAt(0), b = i.charCodeAt(1), E = i.charCodeAt(2), T = i.charCodeAt(3), A = this.length - 4; 0 <= A; --A)
          if (this.data[A] === l && this.data[A + 1] === b && this.data[A + 2] === E && this.data[A + 3] === T)
            return A - this.zero;
        return -1;
      }, u.prototype.readAndCheckSignature = function(i) {
        var l = i.charCodeAt(0), b = i.charCodeAt(1), E = i.charCodeAt(2), T = i.charCodeAt(3), A = this.readData(4);
        return l === A[0] && b === A[1] && E === A[2] && T === A[3];
      }, u.prototype.readData = function(i) {
        if (this.checkOffset(i), i === 0)
          return [];
        var l = this.data.slice(this.zero + this.index, this.zero + this.index + i);
        return this.index += i, l;
      }, n.exports = u;
    }, { "../utils": 32, "./DataReader": 18 }], 18: [function(r, n, o) {
      var c = r("../utils");
      function u(i) {
        this.data = i, this.length = i.length, this.index = 0, this.zero = 0;
      }
      u.prototype = { checkOffset: function(i) {
        this.checkIndex(this.index + i);
      }, checkIndex: function(i) {
        if (this.length < this.zero + i || i < 0)
          throw new Error("End of data reached (data length = " + this.length + ", asked index = " + i + "). Corrupted zip ?");
      }, setIndex: function(i) {
        this.checkIndex(i), this.index = i;
      }, skip: function(i) {
        this.setIndex(this.index + i);
      }, byteAt: function() {
      }, readInt: function(i) {
        var l, b = 0;
        for (this.checkOffset(i), l = this.index + i - 1; l >= this.index; l--)
          b = (b << 8) + this.byteAt(l);
        return this.index += i, b;
      }, readString: function(i) {
        return c.transformTo("string", this.readData(i));
      }, readData: function() {
      }, lastIndexOfSignature: function() {
      }, readAndCheckSignature: function() {
      }, readDate: function() {
        var i = this.readInt(4);
        return new Date(Date.UTC(1980 + (i >> 25 & 127), (i >> 21 & 15) - 1, i >> 16 & 31, i >> 11 & 31, i >> 5 & 63, (31 & i) << 1));
      } }, n.exports = u;
    }, { "../utils": 32 }], 19: [function(r, n, o) {
      var c = r("./Uint8ArrayReader");
      function u(i) {
        c.call(this, i);
      }
      r("../utils").inherits(u, c), u.prototype.readData = function(i) {
        this.checkOffset(i);
        var l = this.data.slice(this.zero + this.index, this.zero + this.index + i);
        return this.index += i, l;
      }, n.exports = u;
    }, { "../utils": 32, "./Uint8ArrayReader": 21 }], 20: [function(r, n, o) {
      var c = r("./DataReader");
      function u(i) {
        c.call(this, i);
      }
      r("../utils").inherits(u, c), u.prototype.byteAt = function(i) {
        return this.data.charCodeAt(this.zero + i);
      }, u.prototype.lastIndexOfSignature = function(i) {
        return this.data.lastIndexOf(i) - this.zero;
      }, u.prototype.readAndCheckSignature = function(i) {
        return i === this.readData(4);
      }, u.prototype.readData = function(i) {
        this.checkOffset(i);
        var l = this.data.slice(this.zero + this.index, this.zero + this.index + i);
        return this.index += i, l;
      }, n.exports = u;
    }, { "../utils": 32, "./DataReader": 18 }], 21: [function(r, n, o) {
      var c = r("./ArrayReader");
      function u(i) {
        c.call(this, i);
      }
      r("../utils").inherits(u, c), u.prototype.readData = function(i) {
        if (this.checkOffset(i), i === 0)
          return new Uint8Array(0);
        var l = this.data.subarray(this.zero + this.index, this.zero + this.index + i);
        return this.index += i, l;
      }, n.exports = u;
    }, { "../utils": 32, "./ArrayReader": 17 }], 22: [function(r, n, o) {
      var c = r("../utils"), u = r("../support"), i = r("./ArrayReader"), l = r("./StringReader"), b = r("./NodeBufferReader"), E = r("./Uint8ArrayReader");
      n.exports = function(T) {
        var A = c.getTypeOf(T);
        return c.checkSupport(A), A !== "string" || u.uint8array ? A === "nodebuffer" ? new b(T) : u.uint8array ? new E(c.transformTo("uint8array", T)) : new i(c.transformTo("array", T)) : new l(T);
      };
    }, { "../support": 30, "../utils": 32, "./ArrayReader": 17, "./NodeBufferReader": 19, "./StringReader": 20, "./Uint8ArrayReader": 21 }], 23: [function(r, n, o) {
      o.LOCAL_FILE_HEADER = "PK", o.CENTRAL_FILE_HEADER = "PK", o.CENTRAL_DIRECTORY_END = "PK", o.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x07", o.ZIP64_CENTRAL_DIRECTORY_END = "PK", o.DATA_DESCRIPTOR = "PK\x07\b";
    }, {}], 24: [function(r, n, o) {
      var c = r("./GenericWorker"), u = r("../utils");
      function i(l) {
        c.call(this, "ConvertWorker to " + l), this.destType = l;
      }
      u.inherits(i, c), i.prototype.processChunk = function(l) {
        this.push({ data: u.transformTo(this.destType, l.data), meta: l.meta });
      }, n.exports = i;
    }, { "../utils": 32, "./GenericWorker": 28 }], 25: [function(r, n, o) {
      var c = r("./GenericWorker"), u = r("../crc32");
      function i() {
        c.call(this, "Crc32Probe"), this.withStreamInfo("crc32", 0);
      }
      r("../utils").inherits(i, c), i.prototype.processChunk = function(l) {
        this.streamInfo.crc32 = u(l.data, this.streamInfo.crc32 || 0), this.push(l);
      }, n.exports = i;
    }, { "../crc32": 4, "../utils": 32, "./GenericWorker": 28 }], 26: [function(r, n, o) {
      var c = r("../utils"), u = r("./GenericWorker");
      function i(l) {
        u.call(this, "DataLengthProbe for " + l), this.propName = l, this.withStreamInfo(l, 0);
      }
      c.inherits(i, u), i.prototype.processChunk = function(l) {
        if (l) {
          var b = this.streamInfo[this.propName] || 0;
          this.streamInfo[this.propName] = b + l.data.length;
        }
        u.prototype.processChunk.call(this, l);
      }, n.exports = i;
    }, { "../utils": 32, "./GenericWorker": 28 }], 27: [function(r, n, o) {
      var c = r("../utils"), u = r("./GenericWorker");
      function i(l) {
        u.call(this, "DataWorker");
        var b = this;
        this.dataIsReady = !1, this.index = 0, this.max = 0, this.data = null, this.type = "", this._tickScheduled = !1, l.then(function(E) {
          b.dataIsReady = !0, b.data = E, b.max = E && E.length || 0, b.type = c.getTypeOf(E), b.isPaused || b._tickAndRepeat();
        }, function(E) {
          b.error(E);
        });
      }
      c.inherits(i, u), i.prototype.cleanUp = function() {
        u.prototype.cleanUp.call(this), this.data = null;
      }, i.prototype.resume = function() {
        return !!u.prototype.resume.call(this) && (!this._tickScheduled && this.dataIsReady && (this._tickScheduled = !0, c.delay(this._tickAndRepeat, [], this)), !0);
      }, i.prototype._tickAndRepeat = function() {
        this._tickScheduled = !1, this.isPaused || this.isFinished || (this._tick(), this.isFinished || (c.delay(this._tickAndRepeat, [], this), this._tickScheduled = !0));
      }, i.prototype._tick = function() {
        if (this.isPaused || this.isFinished)
          return !1;
        var l = null, b = Math.min(this.max, this.index + 16384);
        if (this.index >= this.max)
          return this.end();
        switch (this.type) {
          case "string":
            l = this.data.substring(this.index, b);
            break;
          case "uint8array":
            l = this.data.subarray(this.index, b);
            break;
          case "array":
          case "nodebuffer":
            l = this.data.slice(this.index, b);
        }
        return this.index = b, this.push({ data: l, meta: { percent: this.max ? this.index / this.max * 100 : 0 } });
      }, n.exports = i;
    }, { "../utils": 32, "./GenericWorker": 28 }], 28: [function(r, n, o) {
      function c(u) {
        this.name = u || "default", this.streamInfo = {}, this.generatedError = null, this.extraStreamInfo = {}, this.isPaused = !0, this.isFinished = !1, this.isLocked = !1, this._listeners = { data: [], end: [], error: [] }, this.previous = null;
      }
      c.prototype = { push: function(u) {
        this.emit("data", u);
      }, end: function() {
        if (this.isFinished)
          return !1;
        this.flush();
        try {
          this.emit("end"), this.cleanUp(), this.isFinished = !0;
        } catch (u) {
          this.emit("error", u);
        }
        return !0;
      }, error: function(u) {
        return !this.isFinished && (this.isPaused ? this.generatedError = u : (this.isFinished = !0, this.emit("error", u), this.previous && this.previous.error(u), this.cleanUp()), !0);
      }, on: function(u, i) {
        return this._listeners[u].push(i), this;
      }, cleanUp: function() {
        this.streamInfo = this.generatedError = this.extraStreamInfo = null, this._listeners = [];
      }, emit: function(u, i) {
        if (this._listeners[u])
          for (var l = 0; l < this._listeners[u].length; l++)
            this._listeners[u][l].call(this, i);
      }, pipe: function(u) {
        return u.registerPrevious(this);
      }, registerPrevious: function(u) {
        if (this.isLocked)
          throw new Error("The stream '" + this + "' has already been used.");
        this.streamInfo = u.streamInfo, this.mergeStreamInfo(), this.previous = u;
        var i = this;
        return u.on("data", function(l) {
          i.processChunk(l);
        }), u.on("end", function() {
          i.end();
        }), u.on("error", function(l) {
          i.error(l);
        }), this;
      }, pause: function() {
        return !this.isPaused && !this.isFinished && (this.isPaused = !0, this.previous && this.previous.pause(), !0);
      }, resume: function() {
        if (!this.isPaused || this.isFinished)
          return !1;
        var u = this.isPaused = !1;
        return this.generatedError && (this.error(this.generatedError), u = !0), this.previous && this.previous.resume(), !u;
      }, flush: function() {
      }, processChunk: function(u) {
        this.push(u);
      }, withStreamInfo: function(u, i) {
        return this.extraStreamInfo[u] = i, this.mergeStreamInfo(), this;
      }, mergeStreamInfo: function() {
        for (var u in this.extraStreamInfo)
          Object.prototype.hasOwnProperty.call(this.extraStreamInfo, u) && (this.streamInfo[u] = this.extraStreamInfo[u]);
      }, lock: function() {
        if (this.isLocked)
          throw new Error("The stream '" + this + "' has already been used.");
        this.isLocked = !0, this.previous && this.previous.lock();
      }, toString: function() {
        var u = "Worker " + this.name;
        return this.previous ? this.previous + " -> " + u : u;
      } }, n.exports = c;
    }, {}], 29: [function(r, n, o) {
      var c = r("../utils"), u = r("./ConvertWorker"), i = r("./GenericWorker"), l = r("../base64"), b = r("../support"), E = r("../external"), T = null;
      if (b.nodestream)
        try {
          T = r("../nodejs/NodejsStreamOutputAdapter");
        } catch {
        }
      function A(v, y) {
        return new E.Promise(function(S, g) {
          var x = [], R = v._internalType, D = v._outputType, L = v._mimeType;
          v.on("data", function(Y, G) {
            x.push(Y), y && y(G);
          }).on("error", function(Y) {
            x = [], g(Y);
          }).on("end", function() {
            try {
              var Y = function(G, Q, k) {
                switch (G) {
                  case "blob":
                    return c.newBlob(c.transformTo("arraybuffer", Q), k);
                  case "base64":
                    return l.encode(Q);
                  default:
                    return c.transformTo(G, Q);
                }
              }(D, function(G, Q) {
                var k, se = 0, ue = null, P = 0;
                for (k = 0; k < Q.length; k++)
                  P += Q[k].length;
                switch (G) {
                  case "string":
                    return Q.join("");
                  case "array":
                    return Array.prototype.concat.apply([], Q);
                  case "uint8array":
                    for (ue = new Uint8Array(P), k = 0; k < Q.length; k++)
                      ue.set(Q[k], se), se += Q[k].length;
                    return ue;
                  case "nodebuffer":
                    return Buffer.concat(Q);
                  default:
                    throw new Error("concat : unsupported type '" + G + "'");
                }
              }(R, x), L);
              S(Y);
            } catch (G) {
              g(G);
            }
            x = [];
          }).resume();
        });
      }
      function m(v, y, S) {
        var g = y;
        switch (y) {
          case "blob":
          case "arraybuffer":
            g = "uint8array";
            break;
          case "base64":
            g = "string";
        }
        try {
          this._internalType = g, this._outputType = y, this._mimeType = S, c.checkSupport(g), this._worker = v.pipe(new u(g)), v.lock();
        } catch (x) {
          this._worker = new i("error"), this._worker.error(x);
        }
      }
      m.prototype = { accumulate: function(v) {
        return A(this, v);
      }, on: function(v, y) {
        var S = this;
        return v === "data" ? this._worker.on(v, function(g) {
          y.call(S, g.data, g.meta);
        }) : this._worker.on(v, function() {
          c.delay(y, arguments, S);
        }), this;
      }, resume: function() {
        return c.delay(this._worker.resume, [], this._worker), this;
      }, pause: function() {
        return this._worker.pause(), this;
      }, toNodejsStream: function(v) {
        if (c.checkSupport("nodestream"), this._outputType !== "nodebuffer")
          throw new Error(this._outputType + " is not supported by this method");
        return new T(this, { objectMode: this._outputType !== "nodebuffer" }, v);
      } }, n.exports = m;
    }, { "../base64": 1, "../external": 6, "../nodejs/NodejsStreamOutputAdapter": 13, "../support": 30, "../utils": 32, "./ConvertWorker": 24, "./GenericWorker": 28 }], 30: [function(r, n, o) {
      if (o.base64 = !0, o.array = !0, o.string = !0, o.arraybuffer = typeof ArrayBuffer < "u" && typeof Uint8Array < "u", o.nodebuffer = typeof Buffer < "u", o.uint8array = typeof Uint8Array < "u", typeof ArrayBuffer > "u")
        o.blob = !1;
      else {
        var c = new ArrayBuffer(0);
        try {
          o.blob = new Blob([c], { type: "application/zip" }).size === 0;
        } catch {
          try {
            var u = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
            u.append(c), o.blob = u.getBlob("application/zip").size === 0;
          } catch {
            o.blob = !1;
          }
        }
      }
      try {
        o.nodestream = !!r("readable-stream").Readable;
      } catch {
        o.nodestream = !1;
      }
    }, { "readable-stream": 16 }], 31: [function(r, n, o) {
      for (var c = r("./utils"), u = r("./support"), i = r("./nodejsUtils"), l = r("./stream/GenericWorker"), b = new Array(256), E = 0; E < 256; E++)
        b[E] = 252 <= E ? 6 : 248 <= E ? 5 : 240 <= E ? 4 : 224 <= E ? 3 : 192 <= E ? 2 : 1;
      b[254] = b[254] = 1;
      function T() {
        l.call(this, "utf-8 decode"), this.leftOver = null;
      }
      function A() {
        l.call(this, "utf-8 encode");
      }
      o.utf8encode = function(m) {
        return u.nodebuffer ? i.newBufferFrom(m, "utf-8") : function(v) {
          var y, S, g, x, R, D = v.length, L = 0;
          for (x = 0; x < D; x++)
            (64512 & (S = v.charCodeAt(x))) == 55296 && x + 1 < D && (64512 & (g = v.charCodeAt(x + 1))) == 56320 && (S = 65536 + (S - 55296 << 10) + (g - 56320), x++), L += S < 128 ? 1 : S < 2048 ? 2 : S < 65536 ? 3 : 4;
          for (y = u.uint8array ? new Uint8Array(L) : new Array(L), x = R = 0; R < L; x++)
            (64512 & (S = v.charCodeAt(x))) == 55296 && x + 1 < D && (64512 & (g = v.charCodeAt(x + 1))) == 56320 && (S = 65536 + (S - 55296 << 10) + (g - 56320), x++), S < 128 ? y[R++] = S : (S < 2048 ? y[R++] = 192 | S >>> 6 : (S < 65536 ? y[R++] = 224 | S >>> 12 : (y[R++] = 240 | S >>> 18, y[R++] = 128 | S >>> 12 & 63), y[R++] = 128 | S >>> 6 & 63), y[R++] = 128 | 63 & S);
          return y;
        }(m);
      }, o.utf8decode = function(m) {
        return u.nodebuffer ? c.transformTo("nodebuffer", m).toString("utf-8") : function(v) {
          var y, S, g, x, R = v.length, D = new Array(2 * R);
          for (y = S = 0; y < R; )
            if ((g = v[y++]) < 128)
              D[S++] = g;
            else if (4 < (x = b[g]))
              D[S++] = 65533, y += x - 1;
            else {
              for (g &= x === 2 ? 31 : x === 3 ? 15 : 7; 1 < x && y < R; )
                g = g << 6 | 63 & v[y++], x--;
              1 < x ? D[S++] = 65533 : g < 65536 ? D[S++] = g : (g -= 65536, D[S++] = 55296 | g >> 10 & 1023, D[S++] = 56320 | 1023 & g);
            }
          return D.length !== S && (D.subarray ? D = D.subarray(0, S) : D.length = S), c.applyFromCharCode(D);
        }(m = c.transformTo(u.uint8array ? "uint8array" : "array", m));
      }, c.inherits(T, l), T.prototype.processChunk = function(m) {
        var v = c.transformTo(u.uint8array ? "uint8array" : "array", m.data);
        if (this.leftOver && this.leftOver.length) {
          if (u.uint8array) {
            var y = v;
            (v = new Uint8Array(y.length + this.leftOver.length)).set(this.leftOver, 0), v.set(y, this.leftOver.length);
          } else
            v = this.leftOver.concat(v);
          this.leftOver = null;
        }
        var S = function(x, R) {
          var D;
          for ((R = R || x.length) > x.length && (R = x.length), D = R - 1; 0 <= D && (192 & x[D]) == 128; )
            D--;
          return D < 0 || D === 0 ? R : D + b[x[D]] > R ? D : R;
        }(v), g = v;
        S !== v.length && (u.uint8array ? (g = v.subarray(0, S), this.leftOver = v.subarray(S, v.length)) : (g = v.slice(0, S), this.leftOver = v.slice(S, v.length))), this.push({ data: o.utf8decode(g), meta: m.meta });
      }, T.prototype.flush = function() {
        this.leftOver && this.leftOver.length && (this.push({ data: o.utf8decode(this.leftOver), meta: {} }), this.leftOver = null);
      }, o.Utf8DecodeWorker = T, c.inherits(A, l), A.prototype.processChunk = function(m) {
        this.push({ data: o.utf8encode(m.data), meta: m.meta });
      }, o.Utf8EncodeWorker = A;
    }, { "./nodejsUtils": 14, "./stream/GenericWorker": 28, "./support": 30, "./utils": 32 }], 32: [function(r, n, o) {
      var c = r("./support"), u = r("./base64"), i = r("./nodejsUtils"), l = r("./external");
      function b(y) {
        return y;
      }
      function E(y, S) {
        for (var g = 0; g < y.length; ++g)
          S[g] = 255 & y.charCodeAt(g);
        return S;
      }
      r("setimmediate"), o.newBlob = function(y, S) {
        o.checkSupport("blob");
        try {
          return new Blob([y], { type: S });
        } catch {
          try {
            var g = new (self.BlobBuilder || self.WebKitBlobBuilder || self.MozBlobBuilder || self.MSBlobBuilder)();
            return g.append(y), g.getBlob(S);
          } catch {
            throw new Error("Bug : can't construct the Blob.");
          }
        }
      };
      var T = { stringifyByChunk: function(y, S, g) {
        var x = [], R = 0, D = y.length;
        if (D <= g)
          return String.fromCharCode.apply(null, y);
        for (; R < D; )
          S === "array" || S === "nodebuffer" ? x.push(String.fromCharCode.apply(null, y.slice(R, Math.min(R + g, D)))) : x.push(String.fromCharCode.apply(null, y.subarray(R, Math.min(R + g, D)))), R += g;
        return x.join("");
      }, stringifyByChar: function(y) {
        for (var S = "", g = 0; g < y.length; g++)
          S += String.fromCharCode(y[g]);
        return S;
      }, applyCanBeUsed: { uint8array: function() {
        try {
          return c.uint8array && String.fromCharCode.apply(null, new Uint8Array(1)).length === 1;
        } catch {
          return !1;
        }
      }(), nodebuffer: function() {
        try {
          return c.nodebuffer && String.fromCharCode.apply(null, i.allocBuffer(1)).length === 1;
        } catch {
          return !1;
        }
      }() } };
      function A(y) {
        var S = 65536, g = o.getTypeOf(y), x = !0;
        if (g === "uint8array" ? x = T.applyCanBeUsed.uint8array : g === "nodebuffer" && (x = T.applyCanBeUsed.nodebuffer), x)
          for (; 1 < S; )
            try {
              return T.stringifyByChunk(y, g, S);
            } catch {
              S = Math.floor(S / 2);
            }
        return T.stringifyByChar(y);
      }
      function m(y, S) {
        for (var g = 0; g < y.length; g++)
          S[g] = y[g];
        return S;
      }
      o.applyFromCharCode = A;
      var v = {};
      v.string = { string: b, array: function(y) {
        return E(y, new Array(y.length));
      }, arraybuffer: function(y) {
        return v.string.uint8array(y).buffer;
      }, uint8array: function(y) {
        return E(y, new Uint8Array(y.length));
      }, nodebuffer: function(y) {
        return E(y, i.allocBuffer(y.length));
      } }, v.array = { string: A, array: b, arraybuffer: function(y) {
        return new Uint8Array(y).buffer;
      }, uint8array: function(y) {
        return new Uint8Array(y);
      }, nodebuffer: function(y) {
        return i.newBufferFrom(y);
      } }, v.arraybuffer = { string: function(y) {
        return A(new Uint8Array(y));
      }, array: function(y) {
        return m(new Uint8Array(y), new Array(y.byteLength));
      }, arraybuffer: b, uint8array: function(y) {
        return new Uint8Array(y);
      }, nodebuffer: function(y) {
        return i.newBufferFrom(new Uint8Array(y));
      } }, v.uint8array = { string: A, array: function(y) {
        return m(y, new Array(y.length));
      }, arraybuffer: function(y) {
        return y.buffer;
      }, uint8array: b, nodebuffer: function(y) {
        return i.newBufferFrom(y);
      } }, v.nodebuffer = { string: A, array: function(y) {
        return m(y, new Array(y.length));
      }, arraybuffer: function(y) {
        return v.nodebuffer.uint8array(y).buffer;
      }, uint8array: function(y) {
        return m(y, new Uint8Array(y.length));
      }, nodebuffer: b }, o.transformTo = function(y, S) {
        if (S = S || "", !y)
          return S;
        o.checkSupport(y);
        var g = o.getTypeOf(S);
        return v[g][y](S);
      }, o.resolve = function(y) {
        for (var S = y.split("/"), g = [], x = 0; x < S.length; x++) {
          var R = S[x];
          R === "." || R === "" && x !== 0 && x !== S.length - 1 || (R === ".." ? g.pop() : g.push(R));
        }
        return g.join("/");
      }, o.getTypeOf = function(y) {
        return typeof y == "string" ? "string" : Object.prototype.toString.call(y) === "[object Array]" ? "array" : c.nodebuffer && i.isBuffer(y) ? "nodebuffer" : c.uint8array && y instanceof Uint8Array ? "uint8array" : c.arraybuffer && y instanceof ArrayBuffer ? "arraybuffer" : void 0;
      }, o.checkSupport = function(y) {
        if (!c[y.toLowerCase()])
          throw new Error(y + " is not supported by this platform");
      }, o.MAX_VALUE_16BITS = 65535, o.MAX_VALUE_32BITS = -1, o.pretty = function(y) {
        var S, g, x = "";
        for (g = 0; g < (y || "").length; g++)
          x += "\\x" + ((S = y.charCodeAt(g)) < 16 ? "0" : "") + S.toString(16).toUpperCase();
        return x;
      }, o.delay = function(y, S, g) {
        setImmediate(function() {
          y.apply(g || null, S || []);
        });
      }, o.inherits = function(y, S) {
        function g() {
        }
        g.prototype = S.prototype, y.prototype = new g();
      }, o.extend = function() {
        var y, S, g = {};
        for (y = 0; y < arguments.length; y++)
          for (S in arguments[y])
            Object.prototype.hasOwnProperty.call(arguments[y], S) && g[S] === void 0 && (g[S] = arguments[y][S]);
        return g;
      }, o.prepareContent = function(y, S, g, x, R) {
        return l.Promise.resolve(S).then(function(D) {
          return c.blob && (D instanceof Blob || ["[object File]", "[object Blob]"].indexOf(Object.prototype.toString.call(D)) !== -1) && typeof FileReader < "u" ? new l.Promise(function(L, Y) {
            var G = new FileReader();
            G.onload = function(Q) {
              L(Q.target.result);
            }, G.onerror = function(Q) {
              Y(Q.target.error);
            }, G.readAsArrayBuffer(D);
          }) : D;
        }).then(function(D) {
          var L = o.getTypeOf(D);
          return L ? (L === "arraybuffer" ? D = o.transformTo("uint8array", D) : L === "string" && (R ? D = u.decode(D) : g && x !== !0 && (D = function(Y) {
            return E(Y, c.uint8array ? new Uint8Array(Y.length) : new Array(Y.length));
          }(D))), D) : l.Promise.reject(new Error("Can't read the data of '" + y + "'. Is it in a supported JavaScript type (String, Blob, ArrayBuffer, etc) ?"));
        });
      };
    }, { "./base64": 1, "./external": 6, "./nodejsUtils": 14, "./support": 30, setimmediate: 54 }], 33: [function(r, n, o) {
      var c = r("./reader/readerFor"), u = r("./utils"), i = r("./signature"), l = r("./zipEntry"), b = r("./support");
      function E(T) {
        this.files = [], this.loadOptions = T;
      }
      E.prototype = { checkSignature: function(T) {
        if (!this.reader.readAndCheckSignature(T)) {
          this.reader.index -= 4;
          var A = this.reader.readString(4);
          throw new Error("Corrupted zip or bug: unexpected signature (" + u.pretty(A) + ", expected " + u.pretty(T) + ")");
        }
      }, isSignature: function(T, A) {
        var m = this.reader.index;
        this.reader.setIndex(T);
        var v = this.reader.readString(4) === A;
        return this.reader.setIndex(m), v;
      }, readBlockEndOfCentral: function() {
        this.diskNumber = this.reader.readInt(2), this.diskWithCentralDirStart = this.reader.readInt(2), this.centralDirRecordsOnThisDisk = this.reader.readInt(2), this.centralDirRecords = this.reader.readInt(2), this.centralDirSize = this.reader.readInt(4), this.centralDirOffset = this.reader.readInt(4), this.zipCommentLength = this.reader.readInt(2);
        var T = this.reader.readData(this.zipCommentLength), A = b.uint8array ? "uint8array" : "array", m = u.transformTo(A, T);
        this.zipComment = this.loadOptions.decodeFileName(m);
      }, readBlockZip64EndOfCentral: function() {
        this.zip64EndOfCentralSize = this.reader.readInt(8), this.reader.skip(4), this.diskNumber = this.reader.readInt(4), this.diskWithCentralDirStart = this.reader.readInt(4), this.centralDirRecordsOnThisDisk = this.reader.readInt(8), this.centralDirRecords = this.reader.readInt(8), this.centralDirSize = this.reader.readInt(8), this.centralDirOffset = this.reader.readInt(8), this.zip64ExtensibleData = {};
        for (var T, A, m, v = this.zip64EndOfCentralSize - 44; 0 < v; )
          T = this.reader.readInt(2), A = this.reader.readInt(4), m = this.reader.readData(A), this.zip64ExtensibleData[T] = { id: T, length: A, value: m };
      }, readBlockZip64EndOfCentralLocator: function() {
        if (this.diskWithZip64CentralDirStart = this.reader.readInt(4), this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8), this.disksCount = this.reader.readInt(4), 1 < this.disksCount)
          throw new Error("Multi-volumes zip are not supported");
      }, readLocalFiles: function() {
        var T, A;
        for (T = 0; T < this.files.length; T++)
          A = this.files[T], this.reader.setIndex(A.localHeaderOffset), this.checkSignature(i.LOCAL_FILE_HEADER), A.readLocalPart(this.reader), A.handleUTF8(), A.processAttributes();
      }, readCentralDir: function() {
        var T;
        for (this.reader.setIndex(this.centralDirOffset); this.reader.readAndCheckSignature(i.CENTRAL_FILE_HEADER); )
          (T = new l({ zip64: this.zip64 }, this.loadOptions)).readCentralPart(this.reader), this.files.push(T);
        if (this.centralDirRecords !== this.files.length && this.centralDirRecords !== 0 && this.files.length === 0)
          throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
      }, readEndOfCentral: function() {
        var T = this.reader.lastIndexOfSignature(i.CENTRAL_DIRECTORY_END);
        if (T < 0)
          throw this.isSignature(0, i.LOCAL_FILE_HEADER) ? new Error("Corrupted zip: can't find end of central directory") : new Error("Can't find end of central directory : is this a zip file ? If it is, see https://stuk.github.io/jszip/documentation/howto/read_zip.html");
        this.reader.setIndex(T);
        var A = T;
        if (this.checkSignature(i.CENTRAL_DIRECTORY_END), this.readBlockEndOfCentral(), this.diskNumber === u.MAX_VALUE_16BITS || this.diskWithCentralDirStart === u.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === u.MAX_VALUE_16BITS || this.centralDirRecords === u.MAX_VALUE_16BITS || this.centralDirSize === u.MAX_VALUE_32BITS || this.centralDirOffset === u.MAX_VALUE_32BITS) {
          if (this.zip64 = !0, (T = this.reader.lastIndexOfSignature(i.ZIP64_CENTRAL_DIRECTORY_LOCATOR)) < 0)
            throw new Error("Corrupted zip: can't find the ZIP64 end of central directory locator");
          if (this.reader.setIndex(T), this.checkSignature(i.ZIP64_CENTRAL_DIRECTORY_LOCATOR), this.readBlockZip64EndOfCentralLocator(), !this.isSignature(this.relativeOffsetEndOfZip64CentralDir, i.ZIP64_CENTRAL_DIRECTORY_END) && (this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(i.ZIP64_CENTRAL_DIRECTORY_END), this.relativeOffsetEndOfZip64CentralDir < 0))
            throw new Error("Corrupted zip: can't find the ZIP64 end of central directory");
          this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir), this.checkSignature(i.ZIP64_CENTRAL_DIRECTORY_END), this.readBlockZip64EndOfCentral();
        }
        var m = this.centralDirOffset + this.centralDirSize;
        this.zip64 && (m += 20, m += 12 + this.zip64EndOfCentralSize);
        var v = A - m;
        if (0 < v)
          this.isSignature(A, i.CENTRAL_FILE_HEADER) || (this.reader.zero = v);
        else if (v < 0)
          throw new Error("Corrupted zip: missing " + Math.abs(v) + " bytes.");
      }, prepareReader: function(T) {
        this.reader = c(T);
      }, load: function(T) {
        this.prepareReader(T), this.readEndOfCentral(), this.readCentralDir(), this.readLocalFiles();
      } }, n.exports = E;
    }, { "./reader/readerFor": 22, "./signature": 23, "./support": 30, "./utils": 32, "./zipEntry": 34 }], 34: [function(r, n, o) {
      var c = r("./reader/readerFor"), u = r("./utils"), i = r("./compressedObject"), l = r("./crc32"), b = r("./utf8"), E = r("./compressions"), T = r("./support");
      function A(m, v) {
        this.options = m, this.loadOptions = v;
      }
      A.prototype = { isEncrypted: function() {
        return (1 & this.bitFlag) == 1;
      }, useUTF8: function() {
        return (2048 & this.bitFlag) == 2048;
      }, readLocalPart: function(m) {
        var v, y;
        if (m.skip(22), this.fileNameLength = m.readInt(2), y = m.readInt(2), this.fileName = m.readData(this.fileNameLength), m.skip(y), this.compressedSize === -1 || this.uncompressedSize === -1)
          throw new Error("Bug or corrupted zip : didn't get enough information from the central directory (compressedSize === -1 || uncompressedSize === -1)");
        if ((v = function(S) {
          for (var g in E)
            if (Object.prototype.hasOwnProperty.call(E, g) && E[g].magic === S)
              return E[g];
          return null;
        }(this.compressionMethod)) === null)
          throw new Error("Corrupted zip : compression " + u.pretty(this.compressionMethod) + " unknown (inner file : " + u.transformTo("string", this.fileName) + ")");
        this.decompressed = new i(this.compressedSize, this.uncompressedSize, this.crc32, v, m.readData(this.compressedSize));
      }, readCentralPart: function(m) {
        this.versionMadeBy = m.readInt(2), m.skip(2), this.bitFlag = m.readInt(2), this.compressionMethod = m.readString(2), this.date = m.readDate(), this.crc32 = m.readInt(4), this.compressedSize = m.readInt(4), this.uncompressedSize = m.readInt(4);
        var v = m.readInt(2);
        if (this.extraFieldsLength = m.readInt(2), this.fileCommentLength = m.readInt(2), this.diskNumberStart = m.readInt(2), this.internalFileAttributes = m.readInt(2), this.externalFileAttributes = m.readInt(4), this.localHeaderOffset = m.readInt(4), this.isEncrypted())
          throw new Error("Encrypted zip are not supported");
        m.skip(v), this.readExtraFields(m), this.parseZIP64ExtraField(m), this.fileComment = m.readData(this.fileCommentLength);
      }, processAttributes: function() {
        this.unixPermissions = null, this.dosPermissions = null;
        var m = this.versionMadeBy >> 8;
        this.dir = !!(16 & this.externalFileAttributes), m == 0 && (this.dosPermissions = 63 & this.externalFileAttributes), m == 3 && (this.unixPermissions = this.externalFileAttributes >> 16 & 65535), this.dir || this.fileNameStr.slice(-1) !== "/" || (this.dir = !0);
      }, parseZIP64ExtraField: function() {
        if (this.extraFields[1]) {
          var m = c(this.extraFields[1].value);
          this.uncompressedSize === u.MAX_VALUE_32BITS && (this.uncompressedSize = m.readInt(8)), this.compressedSize === u.MAX_VALUE_32BITS && (this.compressedSize = m.readInt(8)), this.localHeaderOffset === u.MAX_VALUE_32BITS && (this.localHeaderOffset = m.readInt(8)), this.diskNumberStart === u.MAX_VALUE_32BITS && (this.diskNumberStart = m.readInt(4));
        }
      }, readExtraFields: function(m) {
        var v, y, S, g = m.index + this.extraFieldsLength;
        for (this.extraFields || (this.extraFields = {}); m.index + 4 < g; )
          v = m.readInt(2), y = m.readInt(2), S = m.readData(y), this.extraFields[v] = { id: v, length: y, value: S };
        m.setIndex(g);
      }, handleUTF8: function() {
        var m = T.uint8array ? "uint8array" : "array";
        if (this.useUTF8())
          this.fileNameStr = b.utf8decode(this.fileName), this.fileCommentStr = b.utf8decode(this.fileComment);
        else {
          var v = this.findExtraFieldUnicodePath();
          if (v !== null)
            this.fileNameStr = v;
          else {
            var y = u.transformTo(m, this.fileName);
            this.fileNameStr = this.loadOptions.decodeFileName(y);
          }
          var S = this.findExtraFieldUnicodeComment();
          if (S !== null)
            this.fileCommentStr = S;
          else {
            var g = u.transformTo(m, this.fileComment);
            this.fileCommentStr = this.loadOptions.decodeFileName(g);
          }
        }
      }, findExtraFieldUnicodePath: function() {
        var m = this.extraFields[28789];
        if (m) {
          var v = c(m.value);
          return v.readInt(1) !== 1 || l(this.fileName) !== v.readInt(4) ? null : b.utf8decode(v.readData(m.length - 5));
        }
        return null;
      }, findExtraFieldUnicodeComment: function() {
        var m = this.extraFields[25461];
        if (m) {
          var v = c(m.value);
          return v.readInt(1) !== 1 || l(this.fileComment) !== v.readInt(4) ? null : b.utf8decode(v.readData(m.length - 5));
        }
        return null;
      } }, n.exports = A;
    }, { "./compressedObject": 2, "./compressions": 3, "./crc32": 4, "./reader/readerFor": 22, "./support": 30, "./utf8": 31, "./utils": 32 }], 35: [function(r, n, o) {
      function c(v, y, S) {
        this.name = v, this.dir = S.dir, this.date = S.date, this.comment = S.comment, this.unixPermissions = S.unixPermissions, this.dosPermissions = S.dosPermissions, this._data = y, this._dataBinary = S.binary, this.options = { compression: S.compression, compressionOptions: S.compressionOptions };
      }
      var u = r("./stream/StreamHelper"), i = r("./stream/DataWorker"), l = r("./utf8"), b = r("./compressedObject"), E = r("./stream/GenericWorker");
      c.prototype = { internalStream: function(v) {
        var y = null, S = "string";
        try {
          if (!v)
            throw new Error("No output type specified.");
          var g = (S = v.toLowerCase()) === "string" || S === "text";
          S !== "binarystring" && S !== "text" || (S = "string"), y = this._decompressWorker();
          var x = !this._dataBinary;
          x && !g && (y = y.pipe(new l.Utf8EncodeWorker())), !x && g && (y = y.pipe(new l.Utf8DecodeWorker()));
        } catch (R) {
          (y = new E("error")).error(R);
        }
        return new u(y, S, "");
      }, async: function(v, y) {
        return this.internalStream(v).accumulate(y);
      }, nodeStream: function(v, y) {
        return this.internalStream(v || "nodebuffer").toNodejsStream(y);
      }, _compressWorker: function(v, y) {
        if (this._data instanceof b && this._data.compression.magic === v.magic)
          return this._data.getCompressedWorker();
        var S = this._decompressWorker();
        return this._dataBinary || (S = S.pipe(new l.Utf8EncodeWorker())), b.createWorkerFrom(S, v, y);
      }, _decompressWorker: function() {
        return this._data instanceof b ? this._data.getContentWorker() : this._data instanceof E ? this._data : new i(this._data);
      } };
      for (var T = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"], A = function() {
        throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
      }, m = 0; m < T.length; m++)
        c.prototype[T[m]] = A;
      n.exports = c;
    }, { "./compressedObject": 2, "./stream/DataWorker": 27, "./stream/GenericWorker": 28, "./stream/StreamHelper": 29, "./utf8": 31 }], 36: [function(r, n, o) {
      (function(c) {
        var u, i, l = c.MutationObserver || c.WebKitMutationObserver;
        if (l) {
          var b = 0, E = new l(v), T = c.document.createTextNode("");
          E.observe(T, { characterData: !0 }), u = function() {
            T.data = b = ++b % 2;
          };
        } else if (c.setImmediate || c.MessageChannel === void 0)
          u = "document" in c && "onreadystatechange" in c.document.createElement("script") ? function() {
            var y = c.document.createElement("script");
            y.onreadystatechange = function() {
              v(), y.onreadystatechange = null, y.parentNode.removeChild(y), y = null;
            }, c.document.documentElement.appendChild(y);
          } : function() {
            setTimeout(v, 0);
          };
        else {
          var A = new c.MessageChannel();
          A.port1.onmessage = v, u = function() {
            A.port2.postMessage(0);
          };
        }
        var m = [];
        function v() {
          var y, S;
          i = !0;
          for (var g = m.length; g; ) {
            for (S = m, m = [], y = -1; ++y < g; )
              S[y]();
            g = m.length;
          }
          i = !1;
        }
        n.exports = function(y) {
          m.push(y) !== 1 || i || u();
        };
      }).call(this, typeof je < "u" ? je : typeof self < "u" ? self : typeof window < "u" ? window : {});
    }, {}], 37: [function(r, n, o) {
      var c = r("immediate");
      function u() {
      }
      var i = {}, l = ["REJECTED"], b = ["FULFILLED"], E = ["PENDING"];
      function T(g) {
        if (typeof g != "function")
          throw new TypeError("resolver must be a function");
        this.state = E, this.queue = [], this.outcome = void 0, g !== u && y(this, g);
      }
      function A(g, x, R) {
        this.promise = g, typeof x == "function" && (this.onFulfilled = x, this.callFulfilled = this.otherCallFulfilled), typeof R == "function" && (this.onRejected = R, this.callRejected = this.otherCallRejected);
      }
      function m(g, x, R) {
        c(function() {
          var D;
          try {
            D = x(R);
          } catch (L) {
            return i.reject(g, L);
          }
          D === g ? i.reject(g, new TypeError("Cannot resolve promise with itself")) : i.resolve(g, D);
        });
      }
      function v(g) {
        var x = g && g.then;
        if (g && (typeof g == "object" || typeof g == "function") && typeof x == "function")
          return function() {
            x.apply(g, arguments);
          };
      }
      function y(g, x) {
        var R = !1;
        function D(G) {
          R || (R = !0, i.reject(g, G));
        }
        function L(G) {
          R || (R = !0, i.resolve(g, G));
        }
        var Y = S(function() {
          x(L, D);
        });
        Y.status === "error" && D(Y.value);
      }
      function S(g, x) {
        var R = {};
        try {
          R.value = g(x), R.status = "success";
        } catch (D) {
          R.status = "error", R.value = D;
        }
        return R;
      }
      (n.exports = T).prototype.finally = function(g) {
        if (typeof g != "function")
          return this;
        var x = this.constructor;
        return this.then(function(R) {
          return x.resolve(g()).then(function() {
            return R;
          });
        }, function(R) {
          return x.resolve(g()).then(function() {
            throw R;
          });
        });
      }, T.prototype.catch = function(g) {
        return this.then(null, g);
      }, T.prototype.then = function(g, x) {
        if (typeof g != "function" && this.state === b || typeof x != "function" && this.state === l)
          return this;
        var R = new this.constructor(u);
        return this.state !== E ? m(R, this.state === b ? g : x, this.outcome) : this.queue.push(new A(R, g, x)), R;
      }, A.prototype.callFulfilled = function(g) {
        i.resolve(this.promise, g);
      }, A.prototype.otherCallFulfilled = function(g) {
        m(this.promise, this.onFulfilled, g);
      }, A.prototype.callRejected = function(g) {
        i.reject(this.promise, g);
      }, A.prototype.otherCallRejected = function(g) {
        m(this.promise, this.onRejected, g);
      }, i.resolve = function(g, x) {
        var R = S(v, x);
        if (R.status === "error")
          return i.reject(g, R.value);
        var D = R.value;
        if (D)
          y(g, D);
        else {
          g.state = b, g.outcome = x;
          for (var L = -1, Y = g.queue.length; ++L < Y; )
            g.queue[L].callFulfilled(x);
        }
        return g;
      }, i.reject = function(g, x) {
        g.state = l, g.outcome = x;
        for (var R = -1, D = g.queue.length; ++R < D; )
          g.queue[R].callRejected(x);
        return g;
      }, T.resolve = function(g) {
        return g instanceof this ? g : i.resolve(new this(u), g);
      }, T.reject = function(g) {
        var x = new this(u);
        return i.reject(x, g);
      }, T.all = function(g) {
        var x = this;
        if (Object.prototype.toString.call(g) !== "[object Array]")
          return this.reject(new TypeError("must be an array"));
        var R = g.length, D = !1;
        if (!R)
          return this.resolve([]);
        for (var L = new Array(R), Y = 0, G = -1, Q = new this(u); ++G < R; )
          k(g[G], G);
        return Q;
        function k(se, ue) {
          x.resolve(se).then(function(P) {
            L[ue] = P, ++Y !== R || D || (D = !0, i.resolve(Q, L));
          }, function(P) {
            D || (D = !0, i.reject(Q, P));
          });
        }
      }, T.race = function(g) {
        var x = this;
        if (Object.prototype.toString.call(g) !== "[object Array]")
          return this.reject(new TypeError("must be an array"));
        var R = g.length, D = !1;
        if (!R)
          return this.resolve([]);
        for (var L = -1, Y = new this(u); ++L < R; )
          G = g[L], x.resolve(G).then(function(Q) {
            D || (D = !0, i.resolve(Y, Q));
          }, function(Q) {
            D || (D = !0, i.reject(Y, Q));
          });
        var G;
        return Y;
      };
    }, { immediate: 36 }], 38: [function(r, n, o) {
      var c = {};
      (0, r("./lib/utils/common").assign)(c, r("./lib/deflate"), r("./lib/inflate"), r("./lib/zlib/constants")), n.exports = c;
    }, { "./lib/deflate": 39, "./lib/inflate": 40, "./lib/utils/common": 41, "./lib/zlib/constants": 44 }], 39: [function(r, n, o) {
      var c = r("./zlib/deflate"), u = r("./utils/common"), i = r("./utils/strings"), l = r("./zlib/messages"), b = r("./zlib/zstream"), E = Object.prototype.toString, T = 0, A = -1, m = 0, v = 8;
      function y(g) {
        if (!(this instanceof y))
          return new y(g);
        this.options = u.assign({ level: A, method: v, chunkSize: 16384, windowBits: 15, memLevel: 8, strategy: m, to: "" }, g || {});
        var x = this.options;
        x.raw && 0 < x.windowBits ? x.windowBits = -x.windowBits : x.gzip && 0 < x.windowBits && x.windowBits < 16 && (x.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new b(), this.strm.avail_out = 0;
        var R = c.deflateInit2(this.strm, x.level, x.method, x.windowBits, x.memLevel, x.strategy);
        if (R !== T)
          throw new Error(l[R]);
        if (x.header && c.deflateSetHeader(this.strm, x.header), x.dictionary) {
          var D;
          if (D = typeof x.dictionary == "string" ? i.string2buf(x.dictionary) : E.call(x.dictionary) === "[object ArrayBuffer]" ? new Uint8Array(x.dictionary) : x.dictionary, (R = c.deflateSetDictionary(this.strm, D)) !== T)
            throw new Error(l[R]);
          this._dict_set = !0;
        }
      }
      function S(g, x) {
        var R = new y(x);
        if (R.push(g, !0), R.err)
          throw R.msg || l[R.err];
        return R.result;
      }
      y.prototype.push = function(g, x) {
        var R, D, L = this.strm, Y = this.options.chunkSize;
        if (this.ended)
          return !1;
        D = x === ~~x ? x : x === !0 ? 4 : 0, typeof g == "string" ? L.input = i.string2buf(g) : E.call(g) === "[object ArrayBuffer]" ? L.input = new Uint8Array(g) : L.input = g, L.next_in = 0, L.avail_in = L.input.length;
        do {
          if (L.avail_out === 0 && (L.output = new u.Buf8(Y), L.next_out = 0, L.avail_out = Y), (R = c.deflate(L, D)) !== 1 && R !== T)
            return this.onEnd(R), !(this.ended = !0);
          L.avail_out !== 0 && (L.avail_in !== 0 || D !== 4 && D !== 2) || (this.options.to === "string" ? this.onData(i.buf2binstring(u.shrinkBuf(L.output, L.next_out))) : this.onData(u.shrinkBuf(L.output, L.next_out)));
        } while ((0 < L.avail_in || L.avail_out === 0) && R !== 1);
        return D === 4 ? (R = c.deflateEnd(this.strm), this.onEnd(R), this.ended = !0, R === T) : D !== 2 || (this.onEnd(T), !(L.avail_out = 0));
      }, y.prototype.onData = function(g) {
        this.chunks.push(g);
      }, y.prototype.onEnd = function(g) {
        g === T && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = u.flattenChunks(this.chunks)), this.chunks = [], this.err = g, this.msg = this.strm.msg;
      }, o.Deflate = y, o.deflate = S, o.deflateRaw = function(g, x) {
        return (x = x || {}).raw = !0, S(g, x);
      }, o.gzip = function(g, x) {
        return (x = x || {}).gzip = !0, S(g, x);
      };
    }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/deflate": 46, "./zlib/messages": 51, "./zlib/zstream": 53 }], 40: [function(r, n, o) {
      var c = r("./zlib/inflate"), u = r("./utils/common"), i = r("./utils/strings"), l = r("./zlib/constants"), b = r("./zlib/messages"), E = r("./zlib/zstream"), T = r("./zlib/gzheader"), A = Object.prototype.toString;
      function m(y) {
        if (!(this instanceof m))
          return new m(y);
        this.options = u.assign({ chunkSize: 16384, windowBits: 0, to: "" }, y || {});
        var S = this.options;
        S.raw && 0 <= S.windowBits && S.windowBits < 16 && (S.windowBits = -S.windowBits, S.windowBits === 0 && (S.windowBits = -15)), !(0 <= S.windowBits && S.windowBits < 16) || y && y.windowBits || (S.windowBits += 32), 15 < S.windowBits && S.windowBits < 48 && !(15 & S.windowBits) && (S.windowBits |= 15), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new E(), this.strm.avail_out = 0;
        var g = c.inflateInit2(this.strm, S.windowBits);
        if (g !== l.Z_OK)
          throw new Error(b[g]);
        this.header = new T(), c.inflateGetHeader(this.strm, this.header);
      }
      function v(y, S) {
        var g = new m(S);
        if (g.push(y, !0), g.err)
          throw g.msg || b[g.err];
        return g.result;
      }
      m.prototype.push = function(y, S) {
        var g, x, R, D, L, Y, G = this.strm, Q = this.options.chunkSize, k = this.options.dictionary, se = !1;
        if (this.ended)
          return !1;
        x = S === ~~S ? S : S === !0 ? l.Z_FINISH : l.Z_NO_FLUSH, typeof y == "string" ? G.input = i.binstring2buf(y) : A.call(y) === "[object ArrayBuffer]" ? G.input = new Uint8Array(y) : G.input = y, G.next_in = 0, G.avail_in = G.input.length;
        do {
          if (G.avail_out === 0 && (G.output = new u.Buf8(Q), G.next_out = 0, G.avail_out = Q), (g = c.inflate(G, l.Z_NO_FLUSH)) === l.Z_NEED_DICT && k && (Y = typeof k == "string" ? i.string2buf(k) : A.call(k) === "[object ArrayBuffer]" ? new Uint8Array(k) : k, g = c.inflateSetDictionary(this.strm, Y)), g === l.Z_BUF_ERROR && se === !0 && (g = l.Z_OK, se = !1), g !== l.Z_STREAM_END && g !== l.Z_OK)
            return this.onEnd(g), !(this.ended = !0);
          G.next_out && (G.avail_out !== 0 && g !== l.Z_STREAM_END && (G.avail_in !== 0 || x !== l.Z_FINISH && x !== l.Z_SYNC_FLUSH) || (this.options.to === "string" ? (R = i.utf8border(G.output, G.next_out), D = G.next_out - R, L = i.buf2string(G.output, R), G.next_out = D, G.avail_out = Q - D, D && u.arraySet(G.output, G.output, R, D, 0), this.onData(L)) : this.onData(u.shrinkBuf(G.output, G.next_out)))), G.avail_in === 0 && G.avail_out === 0 && (se = !0);
        } while ((0 < G.avail_in || G.avail_out === 0) && g !== l.Z_STREAM_END);
        return g === l.Z_STREAM_END && (x = l.Z_FINISH), x === l.Z_FINISH ? (g = c.inflateEnd(this.strm), this.onEnd(g), this.ended = !0, g === l.Z_OK) : x !== l.Z_SYNC_FLUSH || (this.onEnd(l.Z_OK), !(G.avail_out = 0));
      }, m.prototype.onData = function(y) {
        this.chunks.push(y);
      }, m.prototype.onEnd = function(y) {
        y === l.Z_OK && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = u.flattenChunks(this.chunks)), this.chunks = [], this.err = y, this.msg = this.strm.msg;
      }, o.Inflate = m, o.inflate = v, o.inflateRaw = function(y, S) {
        return (S = S || {}).raw = !0, v(y, S);
      }, o.ungzip = v;
    }, { "./utils/common": 41, "./utils/strings": 42, "./zlib/constants": 44, "./zlib/gzheader": 47, "./zlib/inflate": 49, "./zlib/messages": 51, "./zlib/zstream": 53 }], 41: [function(r, n, o) {
      var c = typeof Uint8Array < "u" && typeof Uint16Array < "u" && typeof Int32Array < "u";
      o.assign = function(l) {
        for (var b = Array.prototype.slice.call(arguments, 1); b.length; ) {
          var E = b.shift();
          if (E) {
            if (typeof E != "object")
              throw new TypeError(E + "must be non-object");
            for (var T in E)
              E.hasOwnProperty(T) && (l[T] = E[T]);
          }
        }
        return l;
      }, o.shrinkBuf = function(l, b) {
        return l.length === b ? l : l.subarray ? l.subarray(0, b) : (l.length = b, l);
      };
      var u = { arraySet: function(l, b, E, T, A) {
        if (b.subarray && l.subarray)
          l.set(b.subarray(E, E + T), A);
        else
          for (var m = 0; m < T; m++)
            l[A + m] = b[E + m];
      }, flattenChunks: function(l) {
        var b, E, T, A, m, v;
        for (b = T = 0, E = l.length; b < E; b++)
          T += l[b].length;
        for (v = new Uint8Array(T), b = A = 0, E = l.length; b < E; b++)
          m = l[b], v.set(m, A), A += m.length;
        return v;
      } }, i = { arraySet: function(l, b, E, T, A) {
        for (var m = 0; m < T; m++)
          l[A + m] = b[E + m];
      }, flattenChunks: function(l) {
        return [].concat.apply([], l);
      } };
      o.setTyped = function(l) {
        l ? (o.Buf8 = Uint8Array, o.Buf16 = Uint16Array, o.Buf32 = Int32Array, o.assign(o, u)) : (o.Buf8 = Array, o.Buf16 = Array, o.Buf32 = Array, o.assign(o, i));
      }, o.setTyped(c);
    }, {}], 42: [function(r, n, o) {
      var c = r("./common"), u = !0, i = !0;
      try {
        String.fromCharCode.apply(null, [0]);
      } catch {
        u = !1;
      }
      try {
        String.fromCharCode.apply(null, new Uint8Array(1));
      } catch {
        i = !1;
      }
      for (var l = new c.Buf8(256), b = 0; b < 256; b++)
        l[b] = 252 <= b ? 6 : 248 <= b ? 5 : 240 <= b ? 4 : 224 <= b ? 3 : 192 <= b ? 2 : 1;
      function E(T, A) {
        if (A < 65537 && (T.subarray && i || !T.subarray && u))
          return String.fromCharCode.apply(null, c.shrinkBuf(T, A));
        for (var m = "", v = 0; v < A; v++)
          m += String.fromCharCode(T[v]);
        return m;
      }
      l[254] = l[254] = 1, o.string2buf = function(T) {
        var A, m, v, y, S, g = T.length, x = 0;
        for (y = 0; y < g; y++)
          (64512 & (m = T.charCodeAt(y))) == 55296 && y + 1 < g && (64512 & (v = T.charCodeAt(y + 1))) == 56320 && (m = 65536 + (m - 55296 << 10) + (v - 56320), y++), x += m < 128 ? 1 : m < 2048 ? 2 : m < 65536 ? 3 : 4;
        for (A = new c.Buf8(x), y = S = 0; S < x; y++)
          (64512 & (m = T.charCodeAt(y))) == 55296 && y + 1 < g && (64512 & (v = T.charCodeAt(y + 1))) == 56320 && (m = 65536 + (m - 55296 << 10) + (v - 56320), y++), m < 128 ? A[S++] = m : (m < 2048 ? A[S++] = 192 | m >>> 6 : (m < 65536 ? A[S++] = 224 | m >>> 12 : (A[S++] = 240 | m >>> 18, A[S++] = 128 | m >>> 12 & 63), A[S++] = 128 | m >>> 6 & 63), A[S++] = 128 | 63 & m);
        return A;
      }, o.buf2binstring = function(T) {
        return E(T, T.length);
      }, o.binstring2buf = function(T) {
        for (var A = new c.Buf8(T.length), m = 0, v = A.length; m < v; m++)
          A[m] = T.charCodeAt(m);
        return A;
      }, o.buf2string = function(T, A) {
        var m, v, y, S, g = A || T.length, x = new Array(2 * g);
        for (m = v = 0; m < g; )
          if ((y = T[m++]) < 128)
            x[v++] = y;
          else if (4 < (S = l[y]))
            x[v++] = 65533, m += S - 1;
          else {
            for (y &= S === 2 ? 31 : S === 3 ? 15 : 7; 1 < S && m < g; )
              y = y << 6 | 63 & T[m++], S--;
            1 < S ? x[v++] = 65533 : y < 65536 ? x[v++] = y : (y -= 65536, x[v++] = 55296 | y >> 10 & 1023, x[v++] = 56320 | 1023 & y);
          }
        return E(x, v);
      }, o.utf8border = function(T, A) {
        var m;
        for ((A = A || T.length) > T.length && (A = T.length), m = A - 1; 0 <= m && (192 & T[m]) == 128; )
          m--;
        return m < 0 || m === 0 ? A : m + l[T[m]] > A ? m : A;
      };
    }, { "./common": 41 }], 43: [function(r, n, o) {
      n.exports = function(c, u, i, l) {
        for (var b = 65535 & c | 0, E = c >>> 16 & 65535 | 0, T = 0; i !== 0; ) {
          for (i -= T = 2e3 < i ? 2e3 : i; E = E + (b = b + u[l++] | 0) | 0, --T; )
            ;
          b %= 65521, E %= 65521;
        }
        return b | E << 16 | 0;
      };
    }, {}], 44: [function(r, n, o) {
      n.exports = { Z_NO_FLUSH: 0, Z_PARTIAL_FLUSH: 1, Z_SYNC_FLUSH: 2, Z_FULL_FLUSH: 3, Z_FINISH: 4, Z_BLOCK: 5, Z_TREES: 6, Z_OK: 0, Z_STREAM_END: 1, Z_NEED_DICT: 2, Z_ERRNO: -1, Z_STREAM_ERROR: -2, Z_DATA_ERROR: -3, Z_BUF_ERROR: -5, Z_NO_COMPRESSION: 0, Z_BEST_SPEED: 1, Z_BEST_COMPRESSION: 9, Z_DEFAULT_COMPRESSION: -1, Z_FILTERED: 1, Z_HUFFMAN_ONLY: 2, Z_RLE: 3, Z_FIXED: 4, Z_DEFAULT_STRATEGY: 0, Z_BINARY: 0, Z_TEXT: 1, Z_UNKNOWN: 2, Z_DEFLATED: 8 };
    }, {}], 45: [function(r, n, o) {
      var c = function() {
        for (var u, i = [], l = 0; l < 256; l++) {
          u = l;
          for (var b = 0; b < 8; b++)
            u = 1 & u ? 3988292384 ^ u >>> 1 : u >>> 1;
          i[l] = u;
        }
        return i;
      }();
      n.exports = function(u, i, l, b) {
        var E = c, T = b + l;
        u ^= -1;
        for (var A = b; A < T; A++)
          u = u >>> 8 ^ E[255 & (u ^ i[A])];
        return -1 ^ u;
      };
    }, {}], 46: [function(r, n, o) {
      var c, u = r("../utils/common"), i = r("./trees"), l = r("./adler32"), b = r("./crc32"), E = r("./messages"), T = 0, A = 4, m = 0, v = -2, y = -1, S = 4, g = 2, x = 8, R = 9, D = 286, L = 30, Y = 19, G = 2 * D + 1, Q = 15, k = 3, se = 258, ue = se + k + 1, P = 42, K = 113, _ = 1, J = 2, fe = 3, $ = 4;
      function pe(f, V) {
        return f.msg = E[V], V;
      }
      function ne(f) {
        return (f << 1) - (4 < f ? 9 : 0);
      }
      function he(f) {
        for (var V = f.length; 0 <= --V; )
          f[V] = 0;
      }
      function j(f) {
        var V = f.state, w = V.pending;
        w > f.avail_out && (w = f.avail_out), w !== 0 && (u.arraySet(f.output, V.pending_buf, V.pending_out, w, f.next_out), f.next_out += w, V.pending_out += w, f.total_out += w, f.avail_out -= w, V.pending -= w, V.pending === 0 && (V.pending_out = 0));
      }
      function C(f, V) {
        i._tr_flush_block(f, 0 <= f.block_start ? f.block_start : -1, f.strstart - f.block_start, V), f.block_start = f.strstart, j(f.strm);
      }
      function H(f, V) {
        f.pending_buf[f.pending++] = V;
      }
      function W(f, V) {
        f.pending_buf[f.pending++] = V >>> 8 & 255, f.pending_buf[f.pending++] = 255 & V;
      }
      function te(f, V) {
        var w, s, a = f.max_chain_length, h = f.strstart, O = f.prev_length, U = f.nice_match, B = f.strstart > f.w_size - ue ? f.strstart - (f.w_size - ue) : 0, re = f.window, oe = f.w_mask, ie = f.prev, ce = f.strstart + se, me = re[h + O - 1], we = re[h + O];
        f.prev_length >= f.good_match && (a >>= 2), U > f.lookahead && (U = f.lookahead);
        do
          if (re[(w = V) + O] === we && re[w + O - 1] === me && re[w] === re[h] && re[++w] === re[h + 1]) {
            h += 2, w++;
            do
              ;
            while (re[++h] === re[++w] && re[++h] === re[++w] && re[++h] === re[++w] && re[++h] === re[++w] && re[++h] === re[++w] && re[++h] === re[++w] && re[++h] === re[++w] && re[++h] === re[++w] && h < ce);
            if (s = se - (ce - h), h = ce - se, O < s) {
              if (f.match_start = V, U <= (O = s))
                break;
              me = re[h + O - 1], we = re[h + O];
            }
          }
        while ((V = ie[V & oe]) > B && --a != 0);
        return O <= f.lookahead ? O : f.lookahead;
      }
      function z(f) {
        var V, w, s, a, h, O, U, B, re, oe, ie = f.w_size;
        do {
          if (a = f.window_size - f.lookahead - f.strstart, f.strstart >= ie + (ie - ue)) {
            for (u.arraySet(f.window, f.window, ie, ie, 0), f.match_start -= ie, f.strstart -= ie, f.block_start -= ie, V = w = f.hash_size; s = f.head[--V], f.head[V] = ie <= s ? s - ie : 0, --w; )
              ;
            for (V = w = ie; s = f.prev[--V], f.prev[V] = ie <= s ? s - ie : 0, --w; )
              ;
            a += ie;
          }
          if (f.strm.avail_in === 0)
            break;
          if (O = f.strm, U = f.window, B = f.strstart + f.lookahead, re = a, oe = void 0, oe = O.avail_in, re < oe && (oe = re), w = oe === 0 ? 0 : (O.avail_in -= oe, u.arraySet(U, O.input, O.next_in, oe, B), O.state.wrap === 1 ? O.adler = l(O.adler, U, oe, B) : O.state.wrap === 2 && (O.adler = b(O.adler, U, oe, B)), O.next_in += oe, O.total_in += oe, oe), f.lookahead += w, f.lookahead + f.insert >= k)
            for (h = f.strstart - f.insert, f.ins_h = f.window[h], f.ins_h = (f.ins_h << f.hash_shift ^ f.window[h + 1]) & f.hash_mask; f.insert && (f.ins_h = (f.ins_h << f.hash_shift ^ f.window[h + k - 1]) & f.hash_mask, f.prev[h & f.w_mask] = f.head[f.ins_h], f.head[f.ins_h] = h, h++, f.insert--, !(f.lookahead + f.insert < k)); )
              ;
        } while (f.lookahead < ue && f.strm.avail_in !== 0);
      }
      function p(f, V) {
        for (var w, s; ; ) {
          if (f.lookahead < ue) {
            if (z(f), f.lookahead < ue && V === T)
              return _;
            if (f.lookahead === 0)
              break;
          }
          if (w = 0, f.lookahead >= k && (f.ins_h = (f.ins_h << f.hash_shift ^ f.window[f.strstart + k - 1]) & f.hash_mask, w = f.prev[f.strstart & f.w_mask] = f.head[f.ins_h], f.head[f.ins_h] = f.strstart), w !== 0 && f.strstart - w <= f.w_size - ue && (f.match_length = te(f, w)), f.match_length >= k)
            if (s = i._tr_tally(f, f.strstart - f.match_start, f.match_length - k), f.lookahead -= f.match_length, f.match_length <= f.max_lazy_match && f.lookahead >= k) {
              for (f.match_length--; f.strstart++, f.ins_h = (f.ins_h << f.hash_shift ^ f.window[f.strstart + k - 1]) & f.hash_mask, w = f.prev[f.strstart & f.w_mask] = f.head[f.ins_h], f.head[f.ins_h] = f.strstart, --f.match_length != 0; )
                ;
              f.strstart++;
            } else
              f.strstart += f.match_length, f.match_length = 0, f.ins_h = f.window[f.strstart], f.ins_h = (f.ins_h << f.hash_shift ^ f.window[f.strstart + 1]) & f.hash_mask;
          else
            s = i._tr_tally(f, 0, f.window[f.strstart]), f.lookahead--, f.strstart++;
          if (s && (C(f, !1), f.strm.avail_out === 0))
            return _;
        }
        return f.insert = f.strstart < k - 1 ? f.strstart : k - 1, V === A ? (C(f, !0), f.strm.avail_out === 0 ? fe : $) : f.last_lit && (C(f, !1), f.strm.avail_out === 0) ? _ : J;
      }
      function d(f, V) {
        for (var w, s, a; ; ) {
          if (f.lookahead < ue) {
            if (z(f), f.lookahead < ue && V === T)
              return _;
            if (f.lookahead === 0)
              break;
          }
          if (w = 0, f.lookahead >= k && (f.ins_h = (f.ins_h << f.hash_shift ^ f.window[f.strstart + k - 1]) & f.hash_mask, w = f.prev[f.strstart & f.w_mask] = f.head[f.ins_h], f.head[f.ins_h] = f.strstart), f.prev_length = f.match_length, f.prev_match = f.match_start, f.match_length = k - 1, w !== 0 && f.prev_length < f.max_lazy_match && f.strstart - w <= f.w_size - ue && (f.match_length = te(f, w), f.match_length <= 5 && (f.strategy === 1 || f.match_length === k && 4096 < f.strstart - f.match_start) && (f.match_length = k - 1)), f.prev_length >= k && f.match_length <= f.prev_length) {
            for (a = f.strstart + f.lookahead - k, s = i._tr_tally(f, f.strstart - 1 - f.prev_match, f.prev_length - k), f.lookahead -= f.prev_length - 1, f.prev_length -= 2; ++f.strstart <= a && (f.ins_h = (f.ins_h << f.hash_shift ^ f.window[f.strstart + k - 1]) & f.hash_mask, w = f.prev[f.strstart & f.w_mask] = f.head[f.ins_h], f.head[f.ins_h] = f.strstart), --f.prev_length != 0; )
              ;
            if (f.match_available = 0, f.match_length = k - 1, f.strstart++, s && (C(f, !1), f.strm.avail_out === 0))
              return _;
          } else if (f.match_available) {
            if ((s = i._tr_tally(f, 0, f.window[f.strstart - 1])) && C(f, !1), f.strstart++, f.lookahead--, f.strm.avail_out === 0)
              return _;
          } else
            f.match_available = 1, f.strstart++, f.lookahead--;
        }
        return f.match_available && (s = i._tr_tally(f, 0, f.window[f.strstart - 1]), f.match_available = 0), f.insert = f.strstart < k - 1 ? f.strstart : k - 1, V === A ? (C(f, !0), f.strm.avail_out === 0 ? fe : $) : f.last_lit && (C(f, !1), f.strm.avail_out === 0) ? _ : J;
      }
      function M(f, V, w, s, a) {
        this.good_length = f, this.max_lazy = V, this.nice_length = w, this.max_chain = s, this.func = a;
      }
      function F() {
        this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = x, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new u.Buf16(2 * G), this.dyn_dtree = new u.Buf16(2 * (2 * L + 1)), this.bl_tree = new u.Buf16(2 * (2 * Y + 1)), he(this.dyn_ltree), he(this.dyn_dtree), he(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new u.Buf16(Q + 1), this.heap = new u.Buf16(2 * D + 1), he(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new u.Buf16(2 * D + 1), he(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
      }
      function I(f) {
        var V;
        return f && f.state ? (f.total_in = f.total_out = 0, f.data_type = g, (V = f.state).pending = 0, V.pending_out = 0, V.wrap < 0 && (V.wrap = -V.wrap), V.status = V.wrap ? P : K, f.adler = V.wrap === 2 ? 0 : 1, V.last_flush = T, i._tr_init(V), m) : pe(f, v);
      }
      function N(f) {
        var V = I(f);
        return V === m && function(w) {
          w.window_size = 2 * w.w_size, he(w.head), w.max_lazy_match = c[w.level].max_lazy, w.good_match = c[w.level].good_length, w.nice_match = c[w.level].nice_length, w.max_chain_length = c[w.level].max_chain, w.strstart = 0, w.block_start = 0, w.lookahead = 0, w.insert = 0, w.match_length = w.prev_length = k - 1, w.match_available = 0, w.ins_h = 0;
        }(f.state), V;
      }
      function Z(f, V, w, s, a, h) {
        if (!f)
          return v;
        var O = 1;
        if (V === y && (V = 6), s < 0 ? (O = 0, s = -s) : 15 < s && (O = 2, s -= 16), a < 1 || R < a || w !== x || s < 8 || 15 < s || V < 0 || 9 < V || h < 0 || S < h)
          return pe(f, v);
        s === 8 && (s = 9);
        var U = new F();
        return (f.state = U).strm = f, U.wrap = O, U.gzhead = null, U.w_bits = s, U.w_size = 1 << U.w_bits, U.w_mask = U.w_size - 1, U.hash_bits = a + 7, U.hash_size = 1 << U.hash_bits, U.hash_mask = U.hash_size - 1, U.hash_shift = ~~((U.hash_bits + k - 1) / k), U.window = new u.Buf8(2 * U.w_size), U.head = new u.Buf16(U.hash_size), U.prev = new u.Buf16(U.w_size), U.lit_bufsize = 1 << a + 6, U.pending_buf_size = 4 * U.lit_bufsize, U.pending_buf = new u.Buf8(U.pending_buf_size), U.d_buf = 1 * U.lit_bufsize, U.l_buf = 3 * U.lit_bufsize, U.level = V, U.strategy = h, U.method = w, N(f);
      }
      c = [new M(0, 0, 0, 0, function(f, V) {
        var w = 65535;
        for (w > f.pending_buf_size - 5 && (w = f.pending_buf_size - 5); ; ) {
          if (f.lookahead <= 1) {
            if (z(f), f.lookahead === 0 && V === T)
              return _;
            if (f.lookahead === 0)
              break;
          }
          f.strstart += f.lookahead, f.lookahead = 0;
          var s = f.block_start + w;
          if ((f.strstart === 0 || f.strstart >= s) && (f.lookahead = f.strstart - s, f.strstart = s, C(f, !1), f.strm.avail_out === 0) || f.strstart - f.block_start >= f.w_size - ue && (C(f, !1), f.strm.avail_out === 0))
            return _;
        }
        return f.insert = 0, V === A ? (C(f, !0), f.strm.avail_out === 0 ? fe : $) : (f.strstart > f.block_start && (C(f, !1), f.strm.avail_out), _);
      }), new M(4, 4, 8, 4, p), new M(4, 5, 16, 8, p), new M(4, 6, 32, 32, p), new M(4, 4, 16, 16, d), new M(8, 16, 32, 32, d), new M(8, 16, 128, 128, d), new M(8, 32, 128, 256, d), new M(32, 128, 258, 1024, d), new M(32, 258, 258, 4096, d)], o.deflateInit = function(f, V) {
        return Z(f, V, x, 15, 8, 0);
      }, o.deflateInit2 = Z, o.deflateReset = N, o.deflateResetKeep = I, o.deflateSetHeader = function(f, V) {
        return f && f.state ? f.state.wrap !== 2 ? v : (f.state.gzhead = V, m) : v;
      }, o.deflate = function(f, V) {
        var w, s, a, h;
        if (!f || !f.state || 5 < V || V < 0)
          return f ? pe(f, v) : v;
        if (s = f.state, !f.output || !f.input && f.avail_in !== 0 || s.status === 666 && V !== A)
          return pe(f, f.avail_out === 0 ? -5 : v);
        if (s.strm = f, w = s.last_flush, s.last_flush = V, s.status === P)
          if (s.wrap === 2)
            f.adler = 0, H(s, 31), H(s, 139), H(s, 8), s.gzhead ? (H(s, (s.gzhead.text ? 1 : 0) + (s.gzhead.hcrc ? 2 : 0) + (s.gzhead.extra ? 4 : 0) + (s.gzhead.name ? 8 : 0) + (s.gzhead.comment ? 16 : 0)), H(s, 255 & s.gzhead.time), H(s, s.gzhead.time >> 8 & 255), H(s, s.gzhead.time >> 16 & 255), H(s, s.gzhead.time >> 24 & 255), H(s, s.level === 9 ? 2 : 2 <= s.strategy || s.level < 2 ? 4 : 0), H(s, 255 & s.gzhead.os), s.gzhead.extra && s.gzhead.extra.length && (H(s, 255 & s.gzhead.extra.length), H(s, s.gzhead.extra.length >> 8 & 255)), s.gzhead.hcrc && (f.adler = b(f.adler, s.pending_buf, s.pending, 0)), s.gzindex = 0, s.status = 69) : (H(s, 0), H(s, 0), H(s, 0), H(s, 0), H(s, 0), H(s, s.level === 9 ? 2 : 2 <= s.strategy || s.level < 2 ? 4 : 0), H(s, 3), s.status = K);
          else {
            var O = x + (s.w_bits - 8 << 4) << 8;
            O |= (2 <= s.strategy || s.level < 2 ? 0 : s.level < 6 ? 1 : s.level === 6 ? 2 : 3) << 6, s.strstart !== 0 && (O |= 32), O += 31 - O % 31, s.status = K, W(s, O), s.strstart !== 0 && (W(s, f.adler >>> 16), W(s, 65535 & f.adler)), f.adler = 1;
          }
        if (s.status === 69)
          if (s.gzhead.extra) {
            for (a = s.pending; s.gzindex < (65535 & s.gzhead.extra.length) && (s.pending !== s.pending_buf_size || (s.gzhead.hcrc && s.pending > a && (f.adler = b(f.adler, s.pending_buf, s.pending - a, a)), j(f), a = s.pending, s.pending !== s.pending_buf_size)); )
              H(s, 255 & s.gzhead.extra[s.gzindex]), s.gzindex++;
            s.gzhead.hcrc && s.pending > a && (f.adler = b(f.adler, s.pending_buf, s.pending - a, a)), s.gzindex === s.gzhead.extra.length && (s.gzindex = 0, s.status = 73);
          } else
            s.status = 73;
        if (s.status === 73)
          if (s.gzhead.name) {
            a = s.pending;
            do {
              if (s.pending === s.pending_buf_size && (s.gzhead.hcrc && s.pending > a && (f.adler = b(f.adler, s.pending_buf, s.pending - a, a)), j(f), a = s.pending, s.pending === s.pending_buf_size)) {
                h = 1;
                break;
              }
              h = s.gzindex < s.gzhead.name.length ? 255 & s.gzhead.name.charCodeAt(s.gzindex++) : 0, H(s, h);
            } while (h !== 0);
            s.gzhead.hcrc && s.pending > a && (f.adler = b(f.adler, s.pending_buf, s.pending - a, a)), h === 0 && (s.gzindex = 0, s.status = 91);
          } else
            s.status = 91;
        if (s.status === 91)
          if (s.gzhead.comment) {
            a = s.pending;
            do {
              if (s.pending === s.pending_buf_size && (s.gzhead.hcrc && s.pending > a && (f.adler = b(f.adler, s.pending_buf, s.pending - a, a)), j(f), a = s.pending, s.pending === s.pending_buf_size)) {
                h = 1;
                break;
              }
              h = s.gzindex < s.gzhead.comment.length ? 255 & s.gzhead.comment.charCodeAt(s.gzindex++) : 0, H(s, h);
            } while (h !== 0);
            s.gzhead.hcrc && s.pending > a && (f.adler = b(f.adler, s.pending_buf, s.pending - a, a)), h === 0 && (s.status = 103);
          } else
            s.status = 103;
        if (s.status === 103 && (s.gzhead.hcrc ? (s.pending + 2 > s.pending_buf_size && j(f), s.pending + 2 <= s.pending_buf_size && (H(s, 255 & f.adler), H(s, f.adler >> 8 & 255), f.adler = 0, s.status = K)) : s.status = K), s.pending !== 0) {
          if (j(f), f.avail_out === 0)
            return s.last_flush = -1, m;
        } else if (f.avail_in === 0 && ne(V) <= ne(w) && V !== A)
          return pe(f, -5);
        if (s.status === 666 && f.avail_in !== 0)
          return pe(f, -5);
        if (f.avail_in !== 0 || s.lookahead !== 0 || V !== T && s.status !== 666) {
          var U = s.strategy === 2 ? function(B, re) {
            for (var oe; ; ) {
              if (B.lookahead === 0 && (z(B), B.lookahead === 0)) {
                if (re === T)
                  return _;
                break;
              }
              if (B.match_length = 0, oe = i._tr_tally(B, 0, B.window[B.strstart]), B.lookahead--, B.strstart++, oe && (C(B, !1), B.strm.avail_out === 0))
                return _;
            }
            return B.insert = 0, re === A ? (C(B, !0), B.strm.avail_out === 0 ? fe : $) : B.last_lit && (C(B, !1), B.strm.avail_out === 0) ? _ : J;
          }(s, V) : s.strategy === 3 ? function(B, re) {
            for (var oe, ie, ce, me, we = B.window; ; ) {
              if (B.lookahead <= se) {
                if (z(B), B.lookahead <= se && re === T)
                  return _;
                if (B.lookahead === 0)
                  break;
              }
              if (B.match_length = 0, B.lookahead >= k && 0 < B.strstart && (ie = we[ce = B.strstart - 1]) === we[++ce] && ie === we[++ce] && ie === we[++ce]) {
                me = B.strstart + se;
                do
                  ;
                while (ie === we[++ce] && ie === we[++ce] && ie === we[++ce] && ie === we[++ce] && ie === we[++ce] && ie === we[++ce] && ie === we[++ce] && ie === we[++ce] && ce < me);
                B.match_length = se - (me - ce), B.match_length > B.lookahead && (B.match_length = B.lookahead);
              }
              if (B.match_length >= k ? (oe = i._tr_tally(B, 1, B.match_length - k), B.lookahead -= B.match_length, B.strstart += B.match_length, B.match_length = 0) : (oe = i._tr_tally(B, 0, B.window[B.strstart]), B.lookahead--, B.strstart++), oe && (C(B, !1), B.strm.avail_out === 0))
                return _;
            }
            return B.insert = 0, re === A ? (C(B, !0), B.strm.avail_out === 0 ? fe : $) : B.last_lit && (C(B, !1), B.strm.avail_out === 0) ? _ : J;
          }(s, V) : c[s.level].func(s, V);
          if (U !== fe && U !== $ || (s.status = 666), U === _ || U === fe)
            return f.avail_out === 0 && (s.last_flush = -1), m;
          if (U === J && (V === 1 ? i._tr_align(s) : V !== 5 && (i._tr_stored_block(s, 0, 0, !1), V === 3 && (he(s.head), s.lookahead === 0 && (s.strstart = 0, s.block_start = 0, s.insert = 0))), j(f), f.avail_out === 0))
            return s.last_flush = -1, m;
        }
        return V !== A ? m : s.wrap <= 0 ? 1 : (s.wrap === 2 ? (H(s, 255 & f.adler), H(s, f.adler >> 8 & 255), H(s, f.adler >> 16 & 255), H(s, f.adler >> 24 & 255), H(s, 255 & f.total_in), H(s, f.total_in >> 8 & 255), H(s, f.total_in >> 16 & 255), H(s, f.total_in >> 24 & 255)) : (W(s, f.adler >>> 16), W(s, 65535 & f.adler)), j(f), 0 < s.wrap && (s.wrap = -s.wrap), s.pending !== 0 ? m : 1);
      }, o.deflateEnd = function(f) {
        var V;
        return f && f.state ? (V = f.state.status) !== P && V !== 69 && V !== 73 && V !== 91 && V !== 103 && V !== K && V !== 666 ? pe(f, v) : (f.state = null, V === K ? pe(f, -3) : m) : v;
      }, o.deflateSetDictionary = function(f, V) {
        var w, s, a, h, O, U, B, re, oe = V.length;
        if (!f || !f.state || (h = (w = f.state).wrap) === 2 || h === 1 && w.status !== P || w.lookahead)
          return v;
        for (h === 1 && (f.adler = l(f.adler, V, oe, 0)), w.wrap = 0, oe >= w.w_size && (h === 0 && (he(w.head), w.strstart = 0, w.block_start = 0, w.insert = 0), re = new u.Buf8(w.w_size), u.arraySet(re, V, oe - w.w_size, w.w_size, 0), V = re, oe = w.w_size), O = f.avail_in, U = f.next_in, B = f.input, f.avail_in = oe, f.next_in = 0, f.input = V, z(w); w.lookahead >= k; ) {
          for (s = w.strstart, a = w.lookahead - (k - 1); w.ins_h = (w.ins_h << w.hash_shift ^ w.window[s + k - 1]) & w.hash_mask, w.prev[s & w.w_mask] = w.head[w.ins_h], w.head[w.ins_h] = s, s++, --a; )
            ;
          w.strstart = s, w.lookahead = k - 1, z(w);
        }
        return w.strstart += w.lookahead, w.block_start = w.strstart, w.insert = w.lookahead, w.lookahead = 0, w.match_length = w.prev_length = k - 1, w.match_available = 0, f.next_in = U, f.input = B, f.avail_in = O, w.wrap = h, m;
      }, o.deflateInfo = "pako deflate (from Nodeca project)";
    }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./messages": 51, "./trees": 52 }], 47: [function(r, n, o) {
      n.exports = function() {
        this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
      };
    }, {}], 48: [function(r, n, o) {
      n.exports = function(c, u) {
        var i, l, b, E, T, A, m, v, y, S, g, x, R, D, L, Y, G, Q, k, se, ue, P, K, _, J;
        i = c.state, l = c.next_in, _ = c.input, b = l + (c.avail_in - 5), E = c.next_out, J = c.output, T = E - (u - c.avail_out), A = E + (c.avail_out - 257), m = i.dmax, v = i.wsize, y = i.whave, S = i.wnext, g = i.window, x = i.hold, R = i.bits, D = i.lencode, L = i.distcode, Y = (1 << i.lenbits) - 1, G = (1 << i.distbits) - 1;
        e:
          do {
            R < 15 && (x += _[l++] << R, R += 8, x += _[l++] << R, R += 8), Q = D[x & Y];
            t:
              for (; ; ) {
                if (x >>>= k = Q >>> 24, R -= k, (k = Q >>> 16 & 255) === 0)
                  J[E++] = 65535 & Q;
                else {
                  if (!(16 & k)) {
                    if (!(64 & k)) {
                      Q = D[(65535 & Q) + (x & (1 << k) - 1)];
                      continue t;
                    }
                    if (32 & k) {
                      i.mode = 12;
                      break e;
                    }
                    c.msg = "invalid literal/length code", i.mode = 30;
                    break e;
                  }
                  se = 65535 & Q, (k &= 15) && (R < k && (x += _[l++] << R, R += 8), se += x & (1 << k) - 1, x >>>= k, R -= k), R < 15 && (x += _[l++] << R, R += 8, x += _[l++] << R, R += 8), Q = L[x & G];
                  r:
                    for (; ; ) {
                      if (x >>>= k = Q >>> 24, R -= k, !(16 & (k = Q >>> 16 & 255))) {
                        if (!(64 & k)) {
                          Q = L[(65535 & Q) + (x & (1 << k) - 1)];
                          continue r;
                        }
                        c.msg = "invalid distance code", i.mode = 30;
                        break e;
                      }
                      if (ue = 65535 & Q, R < (k &= 15) && (x += _[l++] << R, (R += 8) < k && (x += _[l++] << R, R += 8)), m < (ue += x & (1 << k) - 1)) {
                        c.msg = "invalid distance too far back", i.mode = 30;
                        break e;
                      }
                      if (x >>>= k, R -= k, (k = E - T) < ue) {
                        if (y < (k = ue - k) && i.sane) {
                          c.msg = "invalid distance too far back", i.mode = 30;
                          break e;
                        }
                        if (K = g, (P = 0) === S) {
                          if (P += v - k, k < se) {
                            for (se -= k; J[E++] = g[P++], --k; )
                              ;
                            P = E - ue, K = J;
                          }
                        } else if (S < k) {
                          if (P += v + S - k, (k -= S) < se) {
                            for (se -= k; J[E++] = g[P++], --k; )
                              ;
                            if (P = 0, S < se) {
                              for (se -= k = S; J[E++] = g[P++], --k; )
                                ;
                              P = E - ue, K = J;
                            }
                          }
                        } else if (P += S - k, k < se) {
                          for (se -= k; J[E++] = g[P++], --k; )
                            ;
                          P = E - ue, K = J;
                        }
                        for (; 2 < se; )
                          J[E++] = K[P++], J[E++] = K[P++], J[E++] = K[P++], se -= 3;
                        se && (J[E++] = K[P++], 1 < se && (J[E++] = K[P++]));
                      } else {
                        for (P = E - ue; J[E++] = J[P++], J[E++] = J[P++], J[E++] = J[P++], 2 < (se -= 3); )
                          ;
                        se && (J[E++] = J[P++], 1 < se && (J[E++] = J[P++]));
                      }
                      break;
                    }
                }
                break;
              }
          } while (l < b && E < A);
        l -= se = R >> 3, x &= (1 << (R -= se << 3)) - 1, c.next_in = l, c.next_out = E, c.avail_in = l < b ? b - l + 5 : 5 - (l - b), c.avail_out = E < A ? A - E + 257 : 257 - (E - A), i.hold = x, i.bits = R;
      };
    }, {}], 49: [function(r, n, o) {
      var c = r("../utils/common"), u = r("./adler32"), i = r("./crc32"), l = r("./inffast"), b = r("./inftrees"), E = 1, T = 2, A = 0, m = -2, v = 1, y = 852, S = 592;
      function g(P) {
        return (P >>> 24 & 255) + (P >>> 8 & 65280) + ((65280 & P) << 8) + ((255 & P) << 24);
      }
      function x() {
        this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new c.Buf16(320), this.work = new c.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
      }
      function R(P) {
        var K;
        return P && P.state ? (K = P.state, P.total_in = P.total_out = K.total = 0, P.msg = "", K.wrap && (P.adler = 1 & K.wrap), K.mode = v, K.last = 0, K.havedict = 0, K.dmax = 32768, K.head = null, K.hold = 0, K.bits = 0, K.lencode = K.lendyn = new c.Buf32(y), K.distcode = K.distdyn = new c.Buf32(S), K.sane = 1, K.back = -1, A) : m;
      }
      function D(P) {
        var K;
        return P && P.state ? ((K = P.state).wsize = 0, K.whave = 0, K.wnext = 0, R(P)) : m;
      }
      function L(P, K) {
        var _, J;
        return P && P.state ? (J = P.state, K < 0 ? (_ = 0, K = -K) : (_ = 1 + (K >> 4), K < 48 && (K &= 15)), K && (K < 8 || 15 < K) ? m : (J.window !== null && J.wbits !== K && (J.window = null), J.wrap = _, J.wbits = K, D(P))) : m;
      }
      function Y(P, K) {
        var _, J;
        return P ? (J = new x(), (P.state = J).window = null, (_ = L(P, K)) !== A && (P.state = null), _) : m;
      }
      var G, Q, k = !0;
      function se(P) {
        if (k) {
          var K;
          for (G = new c.Buf32(512), Q = new c.Buf32(32), K = 0; K < 144; )
            P.lens[K++] = 8;
          for (; K < 256; )
            P.lens[K++] = 9;
          for (; K < 280; )
            P.lens[K++] = 7;
          for (; K < 288; )
            P.lens[K++] = 8;
          for (b(E, P.lens, 0, 288, G, 0, P.work, { bits: 9 }), K = 0; K < 32; )
            P.lens[K++] = 5;
          b(T, P.lens, 0, 32, Q, 0, P.work, { bits: 5 }), k = !1;
        }
        P.lencode = G, P.lenbits = 9, P.distcode = Q, P.distbits = 5;
      }
      function ue(P, K, _, J) {
        var fe, $ = P.state;
        return $.window === null && ($.wsize = 1 << $.wbits, $.wnext = 0, $.whave = 0, $.window = new c.Buf8($.wsize)), J >= $.wsize ? (c.arraySet($.window, K, _ - $.wsize, $.wsize, 0), $.wnext = 0, $.whave = $.wsize) : (J < (fe = $.wsize - $.wnext) && (fe = J), c.arraySet($.window, K, _ - J, fe, $.wnext), (J -= fe) ? (c.arraySet($.window, K, _ - J, J, 0), $.wnext = J, $.whave = $.wsize) : ($.wnext += fe, $.wnext === $.wsize && ($.wnext = 0), $.whave < $.wsize && ($.whave += fe))), 0;
      }
      o.inflateReset = D, o.inflateReset2 = L, o.inflateResetKeep = R, o.inflateInit = function(P) {
        return Y(P, 15);
      }, o.inflateInit2 = Y, o.inflate = function(P, K) {
        var _, J, fe, $, pe, ne, he, j, C, H, W, te, z, p, d, M, F, I, N, Z, f, V, w, s, a = 0, h = new c.Buf8(4), O = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
        if (!P || !P.state || !P.output || !P.input && P.avail_in !== 0)
          return m;
        (_ = P.state).mode === 12 && (_.mode = 13), pe = P.next_out, fe = P.output, he = P.avail_out, $ = P.next_in, J = P.input, ne = P.avail_in, j = _.hold, C = _.bits, H = ne, W = he, V = A;
        e:
          for (; ; )
            switch (_.mode) {
              case v:
                if (_.wrap === 0) {
                  _.mode = 13;
                  break;
                }
                for (; C < 16; ) {
                  if (ne === 0)
                    break e;
                  ne--, j += J[$++] << C, C += 8;
                }
                if (2 & _.wrap && j === 35615) {
                  h[_.check = 0] = 255 & j, h[1] = j >>> 8 & 255, _.check = i(_.check, h, 2, 0), C = j = 0, _.mode = 2;
                  break;
                }
                if (_.flags = 0, _.head && (_.head.done = !1), !(1 & _.wrap) || (((255 & j) << 8) + (j >> 8)) % 31) {
                  P.msg = "incorrect header check", _.mode = 30;
                  break;
                }
                if ((15 & j) != 8) {
                  P.msg = "unknown compression method", _.mode = 30;
                  break;
                }
                if (C -= 4, f = 8 + (15 & (j >>>= 4)), _.wbits === 0)
                  _.wbits = f;
                else if (f > _.wbits) {
                  P.msg = "invalid window size", _.mode = 30;
                  break;
                }
                _.dmax = 1 << f, P.adler = _.check = 1, _.mode = 512 & j ? 10 : 12, C = j = 0;
                break;
              case 2:
                for (; C < 16; ) {
                  if (ne === 0)
                    break e;
                  ne--, j += J[$++] << C, C += 8;
                }
                if (_.flags = j, (255 & _.flags) != 8) {
                  P.msg = "unknown compression method", _.mode = 30;
                  break;
                }
                if (57344 & _.flags) {
                  P.msg = "unknown header flags set", _.mode = 30;
                  break;
                }
                _.head && (_.head.text = j >> 8 & 1), 512 & _.flags && (h[0] = 255 & j, h[1] = j >>> 8 & 255, _.check = i(_.check, h, 2, 0)), C = j = 0, _.mode = 3;
              case 3:
                for (; C < 32; ) {
                  if (ne === 0)
                    break e;
                  ne--, j += J[$++] << C, C += 8;
                }
                _.head && (_.head.time = j), 512 & _.flags && (h[0] = 255 & j, h[1] = j >>> 8 & 255, h[2] = j >>> 16 & 255, h[3] = j >>> 24 & 255, _.check = i(_.check, h, 4, 0)), C = j = 0, _.mode = 4;
              case 4:
                for (; C < 16; ) {
                  if (ne === 0)
                    break e;
                  ne--, j += J[$++] << C, C += 8;
                }
                _.head && (_.head.xflags = 255 & j, _.head.os = j >> 8), 512 & _.flags && (h[0] = 255 & j, h[1] = j >>> 8 & 255, _.check = i(_.check, h, 2, 0)), C = j = 0, _.mode = 5;
              case 5:
                if (1024 & _.flags) {
                  for (; C < 16; ) {
                    if (ne === 0)
                      break e;
                    ne--, j += J[$++] << C, C += 8;
                  }
                  _.length = j, _.head && (_.head.extra_len = j), 512 & _.flags && (h[0] = 255 & j, h[1] = j >>> 8 & 255, _.check = i(_.check, h, 2, 0)), C = j = 0;
                } else
                  _.head && (_.head.extra = null);
                _.mode = 6;
              case 6:
                if (1024 & _.flags && (ne < (te = _.length) && (te = ne), te && (_.head && (f = _.head.extra_len - _.length, _.head.extra || (_.head.extra = new Array(_.head.extra_len)), c.arraySet(_.head.extra, J, $, te, f)), 512 & _.flags && (_.check = i(_.check, J, te, $)), ne -= te, $ += te, _.length -= te), _.length))
                  break e;
                _.length = 0, _.mode = 7;
              case 7:
                if (2048 & _.flags) {
                  if (ne === 0)
                    break e;
                  for (te = 0; f = J[$ + te++], _.head && f && _.length < 65536 && (_.head.name += String.fromCharCode(f)), f && te < ne; )
                    ;
                  if (512 & _.flags && (_.check = i(_.check, J, te, $)), ne -= te, $ += te, f)
                    break e;
                } else
                  _.head && (_.head.name = null);
                _.length = 0, _.mode = 8;
              case 8:
                if (4096 & _.flags) {
                  if (ne === 0)
                    break e;
                  for (te = 0; f = J[$ + te++], _.head && f && _.length < 65536 && (_.head.comment += String.fromCharCode(f)), f && te < ne; )
                    ;
                  if (512 & _.flags && (_.check = i(_.check, J, te, $)), ne -= te, $ += te, f)
                    break e;
                } else
                  _.head && (_.head.comment = null);
                _.mode = 9;
              case 9:
                if (512 & _.flags) {
                  for (; C < 16; ) {
                    if (ne === 0)
                      break e;
                    ne--, j += J[$++] << C, C += 8;
                  }
                  if (j !== (65535 & _.check)) {
                    P.msg = "header crc mismatch", _.mode = 30;
                    break;
                  }
                  C = j = 0;
                }
                _.head && (_.head.hcrc = _.flags >> 9 & 1, _.head.done = !0), P.adler = _.check = 0, _.mode = 12;
                break;
              case 10:
                for (; C < 32; ) {
                  if (ne === 0)
                    break e;
                  ne--, j += J[$++] << C, C += 8;
                }
                P.adler = _.check = g(j), C = j = 0, _.mode = 11;
              case 11:
                if (_.havedict === 0)
                  return P.next_out = pe, P.avail_out = he, P.next_in = $, P.avail_in = ne, _.hold = j, _.bits = C, 2;
                P.adler = _.check = 1, _.mode = 12;
              case 12:
                if (K === 5 || K === 6)
                  break e;
              case 13:
                if (_.last) {
                  j >>>= 7 & C, C -= 7 & C, _.mode = 27;
                  break;
                }
                for (; C < 3; ) {
                  if (ne === 0)
                    break e;
                  ne--, j += J[$++] << C, C += 8;
                }
                switch (_.last = 1 & j, C -= 1, 3 & (j >>>= 1)) {
                  case 0:
                    _.mode = 14;
                    break;
                  case 1:
                    if (se(_), _.mode = 20, K !== 6)
                      break;
                    j >>>= 2, C -= 2;
                    break e;
                  case 2:
                    _.mode = 17;
                    break;
                  case 3:
                    P.msg = "invalid block type", _.mode = 30;
                }
                j >>>= 2, C -= 2;
                break;
              case 14:
                for (j >>>= 7 & C, C -= 7 & C; C < 32; ) {
                  if (ne === 0)
                    break e;
                  ne--, j += J[$++] << C, C += 8;
                }
                if ((65535 & j) != (j >>> 16 ^ 65535)) {
                  P.msg = "invalid stored block lengths", _.mode = 30;
                  break;
                }
                if (_.length = 65535 & j, C = j = 0, _.mode = 15, K === 6)
                  break e;
              case 15:
                _.mode = 16;
              case 16:
                if (te = _.length) {
                  if (ne < te && (te = ne), he < te && (te = he), te === 0)
                    break e;
                  c.arraySet(fe, J, $, te, pe), ne -= te, $ += te, he -= te, pe += te, _.length -= te;
                  break;
                }
                _.mode = 12;
                break;
              case 17:
                for (; C < 14; ) {
                  if (ne === 0)
                    break e;
                  ne--, j += J[$++] << C, C += 8;
                }
                if (_.nlen = 257 + (31 & j), j >>>= 5, C -= 5, _.ndist = 1 + (31 & j), j >>>= 5, C -= 5, _.ncode = 4 + (15 & j), j >>>= 4, C -= 4, 286 < _.nlen || 30 < _.ndist) {
                  P.msg = "too many length or distance symbols", _.mode = 30;
                  break;
                }
                _.have = 0, _.mode = 18;
              case 18:
                for (; _.have < _.ncode; ) {
                  for (; C < 3; ) {
                    if (ne === 0)
                      break e;
                    ne--, j += J[$++] << C, C += 8;
                  }
                  _.lens[O[_.have++]] = 7 & j, j >>>= 3, C -= 3;
                }
                for (; _.have < 19; )
                  _.lens[O[_.have++]] = 0;
                if (_.lencode = _.lendyn, _.lenbits = 7, w = { bits: _.lenbits }, V = b(0, _.lens, 0, 19, _.lencode, 0, _.work, w), _.lenbits = w.bits, V) {
                  P.msg = "invalid code lengths set", _.mode = 30;
                  break;
                }
                _.have = 0, _.mode = 19;
              case 19:
                for (; _.have < _.nlen + _.ndist; ) {
                  for (; M = (a = _.lencode[j & (1 << _.lenbits) - 1]) >>> 16 & 255, F = 65535 & a, !((d = a >>> 24) <= C); ) {
                    if (ne === 0)
                      break e;
                    ne--, j += J[$++] << C, C += 8;
                  }
                  if (F < 16)
                    j >>>= d, C -= d, _.lens[_.have++] = F;
                  else {
                    if (F === 16) {
                      for (s = d + 2; C < s; ) {
                        if (ne === 0)
                          break e;
                        ne--, j += J[$++] << C, C += 8;
                      }
                      if (j >>>= d, C -= d, _.have === 0) {
                        P.msg = "invalid bit length repeat", _.mode = 30;
                        break;
                      }
                      f = _.lens[_.have - 1], te = 3 + (3 & j), j >>>= 2, C -= 2;
                    } else if (F === 17) {
                      for (s = d + 3; C < s; ) {
                        if (ne === 0)
                          break e;
                        ne--, j += J[$++] << C, C += 8;
                      }
                      C -= d, f = 0, te = 3 + (7 & (j >>>= d)), j >>>= 3, C -= 3;
                    } else {
                      for (s = d + 7; C < s; ) {
                        if (ne === 0)
                          break e;
                        ne--, j += J[$++] << C, C += 8;
                      }
                      C -= d, f = 0, te = 11 + (127 & (j >>>= d)), j >>>= 7, C -= 7;
                    }
                    if (_.have + te > _.nlen + _.ndist) {
                      P.msg = "invalid bit length repeat", _.mode = 30;
                      break;
                    }
                    for (; te--; )
                      _.lens[_.have++] = f;
                  }
                }
                if (_.mode === 30)
                  break;
                if (_.lens[256] === 0) {
                  P.msg = "invalid code -- missing end-of-block", _.mode = 30;
                  break;
                }
                if (_.lenbits = 9, w = { bits: _.lenbits }, V = b(E, _.lens, 0, _.nlen, _.lencode, 0, _.work, w), _.lenbits = w.bits, V) {
                  P.msg = "invalid literal/lengths set", _.mode = 30;
                  break;
                }
                if (_.distbits = 6, _.distcode = _.distdyn, w = { bits: _.distbits }, V = b(T, _.lens, _.nlen, _.ndist, _.distcode, 0, _.work, w), _.distbits = w.bits, V) {
                  P.msg = "invalid distances set", _.mode = 30;
                  break;
                }
                if (_.mode = 20, K === 6)
                  break e;
              case 20:
                _.mode = 21;
              case 21:
                if (6 <= ne && 258 <= he) {
                  P.next_out = pe, P.avail_out = he, P.next_in = $, P.avail_in = ne, _.hold = j, _.bits = C, l(P, W), pe = P.next_out, fe = P.output, he = P.avail_out, $ = P.next_in, J = P.input, ne = P.avail_in, j = _.hold, C = _.bits, _.mode === 12 && (_.back = -1);
                  break;
                }
                for (_.back = 0; M = (a = _.lencode[j & (1 << _.lenbits) - 1]) >>> 16 & 255, F = 65535 & a, !((d = a >>> 24) <= C); ) {
                  if (ne === 0)
                    break e;
                  ne--, j += J[$++] << C, C += 8;
                }
                if (M && !(240 & M)) {
                  for (I = d, N = M, Z = F; M = (a = _.lencode[Z + ((j & (1 << I + N) - 1) >> I)]) >>> 16 & 255, F = 65535 & a, !(I + (d = a >>> 24) <= C); ) {
                    if (ne === 0)
                      break e;
                    ne--, j += J[$++] << C, C += 8;
                  }
                  j >>>= I, C -= I, _.back += I;
                }
                if (j >>>= d, C -= d, _.back += d, _.length = F, M === 0) {
                  _.mode = 26;
                  break;
                }
                if (32 & M) {
                  _.back = -1, _.mode = 12;
                  break;
                }
                if (64 & M) {
                  P.msg = "invalid literal/length code", _.mode = 30;
                  break;
                }
                _.extra = 15 & M, _.mode = 22;
              case 22:
                if (_.extra) {
                  for (s = _.extra; C < s; ) {
                    if (ne === 0)
                      break e;
                    ne--, j += J[$++] << C, C += 8;
                  }
                  _.length += j & (1 << _.extra) - 1, j >>>= _.extra, C -= _.extra, _.back += _.extra;
                }
                _.was = _.length, _.mode = 23;
              case 23:
                for (; M = (a = _.distcode[j & (1 << _.distbits) - 1]) >>> 16 & 255, F = 65535 & a, !((d = a >>> 24) <= C); ) {
                  if (ne === 0)
                    break e;
                  ne--, j += J[$++] << C, C += 8;
                }
                if (!(240 & M)) {
                  for (I = d, N = M, Z = F; M = (a = _.distcode[Z + ((j & (1 << I + N) - 1) >> I)]) >>> 16 & 255, F = 65535 & a, !(I + (d = a >>> 24) <= C); ) {
                    if (ne === 0)
                      break e;
                    ne--, j += J[$++] << C, C += 8;
                  }
                  j >>>= I, C -= I, _.back += I;
                }
                if (j >>>= d, C -= d, _.back += d, 64 & M) {
                  P.msg = "invalid distance code", _.mode = 30;
                  break;
                }
                _.offset = F, _.extra = 15 & M, _.mode = 24;
              case 24:
                if (_.extra) {
                  for (s = _.extra; C < s; ) {
                    if (ne === 0)
                      break e;
                    ne--, j += J[$++] << C, C += 8;
                  }
                  _.offset += j & (1 << _.extra) - 1, j >>>= _.extra, C -= _.extra, _.back += _.extra;
                }
                if (_.offset > _.dmax) {
                  P.msg = "invalid distance too far back", _.mode = 30;
                  break;
                }
                _.mode = 25;
              case 25:
                if (he === 0)
                  break e;
                if (te = W - he, _.offset > te) {
                  if ((te = _.offset - te) > _.whave && _.sane) {
                    P.msg = "invalid distance too far back", _.mode = 30;
                    break;
                  }
                  z = te > _.wnext ? (te -= _.wnext, _.wsize - te) : _.wnext - te, te > _.length && (te = _.length), p = _.window;
                } else
                  p = fe, z = pe - _.offset, te = _.length;
                for (he < te && (te = he), he -= te, _.length -= te; fe[pe++] = p[z++], --te; )
                  ;
                _.length === 0 && (_.mode = 21);
                break;
              case 26:
                if (he === 0)
                  break e;
                fe[pe++] = _.length, he--, _.mode = 21;
                break;
              case 27:
                if (_.wrap) {
                  for (; C < 32; ) {
                    if (ne === 0)
                      break e;
                    ne--, j |= J[$++] << C, C += 8;
                  }
                  if (W -= he, P.total_out += W, _.total += W, W && (P.adler = _.check = _.flags ? i(_.check, fe, W, pe - W) : u(_.check, fe, W, pe - W)), W = he, (_.flags ? j : g(j)) !== _.check) {
                    P.msg = "incorrect data check", _.mode = 30;
                    break;
                  }
                  C = j = 0;
                }
                _.mode = 28;
              case 28:
                if (_.wrap && _.flags) {
                  for (; C < 32; ) {
                    if (ne === 0)
                      break e;
                    ne--, j += J[$++] << C, C += 8;
                  }
                  if (j !== (4294967295 & _.total)) {
                    P.msg = "incorrect length check", _.mode = 30;
                    break;
                  }
                  C = j = 0;
                }
                _.mode = 29;
              case 29:
                V = 1;
                break e;
              case 30:
                V = -3;
                break e;
              case 31:
                return -4;
              case 32:
              default:
                return m;
            }
        return P.next_out = pe, P.avail_out = he, P.next_in = $, P.avail_in = ne, _.hold = j, _.bits = C, (_.wsize || W !== P.avail_out && _.mode < 30 && (_.mode < 27 || K !== 4)) && ue(P, P.output, P.next_out, W - P.avail_out) ? (_.mode = 31, -4) : (H -= P.avail_in, W -= P.avail_out, P.total_in += H, P.total_out += W, _.total += W, _.wrap && W && (P.adler = _.check = _.flags ? i(_.check, fe, W, P.next_out - W) : u(_.check, fe, W, P.next_out - W)), P.data_type = _.bits + (_.last ? 64 : 0) + (_.mode === 12 ? 128 : 0) + (_.mode === 20 || _.mode === 15 ? 256 : 0), (H == 0 && W === 0 || K === 4) && V === A && (V = -5), V);
      }, o.inflateEnd = function(P) {
        if (!P || !P.state)
          return m;
        var K = P.state;
        return K.window && (K.window = null), P.state = null, A;
      }, o.inflateGetHeader = function(P, K) {
        var _;
        return P && P.state && 2 & (_ = P.state).wrap ? ((_.head = K).done = !1, A) : m;
      }, o.inflateSetDictionary = function(P, K) {
        var _, J = K.length;
        return P && P.state ? (_ = P.state).wrap !== 0 && _.mode !== 11 ? m : _.mode === 11 && u(1, K, J, 0) !== _.check ? -3 : ue(P, K, J, J) ? (_.mode = 31, -4) : (_.havedict = 1, A) : m;
      }, o.inflateInfo = "pako inflate (from Nodeca project)";
    }, { "../utils/common": 41, "./adler32": 43, "./crc32": 45, "./inffast": 48, "./inftrees": 50 }], 50: [function(r, n, o) {
      var c = r("../utils/common"), u = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0], i = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78], l = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0], b = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];
      n.exports = function(E, T, A, m, v, y, S, g) {
        var x, R, D, L, Y, G, Q, k, se, ue = g.bits, P = 0, K = 0, _ = 0, J = 0, fe = 0, $ = 0, pe = 0, ne = 0, he = 0, j = 0, C = null, H = 0, W = new c.Buf16(16), te = new c.Buf16(16), z = null, p = 0;
        for (P = 0; P <= 15; P++)
          W[P] = 0;
        for (K = 0; K < m; K++)
          W[T[A + K]]++;
        for (fe = ue, J = 15; 1 <= J && W[J] === 0; J--)
          ;
        if (J < fe && (fe = J), J === 0)
          return v[y++] = 20971520, v[y++] = 20971520, g.bits = 1, 0;
        for (_ = 1; _ < J && W[_] === 0; _++)
          ;
        for (fe < _ && (fe = _), P = ne = 1; P <= 15; P++)
          if (ne <<= 1, (ne -= W[P]) < 0)
            return -1;
        if (0 < ne && (E === 0 || J !== 1))
          return -1;
        for (te[1] = 0, P = 1; P < 15; P++)
          te[P + 1] = te[P] + W[P];
        for (K = 0; K < m; K++)
          T[A + K] !== 0 && (S[te[T[A + K]]++] = K);
        if (G = E === 0 ? (C = z = S, 19) : E === 1 ? (C = u, H -= 257, z = i, p -= 257, 256) : (C = l, z = b, -1), P = _, Y = y, pe = K = j = 0, D = -1, L = (he = 1 << ($ = fe)) - 1, E === 1 && 852 < he || E === 2 && 592 < he)
          return 1;
        for (; ; ) {
          for (Q = P - pe, se = S[K] < G ? (k = 0, S[K]) : S[K] > G ? (k = z[p + S[K]], C[H + S[K]]) : (k = 96, 0), x = 1 << P - pe, _ = R = 1 << $; v[Y + (j >> pe) + (R -= x)] = Q << 24 | k << 16 | se | 0, R !== 0; )
            ;
          for (x = 1 << P - 1; j & x; )
            x >>= 1;
          if (x !== 0 ? (j &= x - 1, j += x) : j = 0, K++, --W[P] == 0) {
            if (P === J)
              break;
            P = T[A + S[K]];
          }
          if (fe < P && (j & L) !== D) {
            for (pe === 0 && (pe = fe), Y += _, ne = 1 << ($ = P - pe); $ + pe < J && !((ne -= W[$ + pe]) <= 0); )
              $++, ne <<= 1;
            if (he += 1 << $, E === 1 && 852 < he || E === 2 && 592 < he)
              return 1;
            v[D = j & L] = fe << 24 | $ << 16 | Y - y | 0;
          }
        }
        return j !== 0 && (v[Y + j] = P - pe << 24 | 64 << 16 | 0), g.bits = fe, 0;
      };
    }, { "../utils/common": 41 }], 51: [function(r, n, o) {
      n.exports = { 2: "need dictionary", 1: "stream end", 0: "", "-1": "file error", "-2": "stream error", "-3": "data error", "-4": "insufficient memory", "-5": "buffer error", "-6": "incompatible version" };
    }, {}], 52: [function(r, n, o) {
      var c = r("../utils/common"), u = 0, i = 1;
      function l(a) {
        for (var h = a.length; 0 <= --h; )
          a[h] = 0;
      }
      var b = 0, E = 29, T = 256, A = T + 1 + E, m = 30, v = 19, y = 2 * A + 1, S = 15, g = 16, x = 7, R = 256, D = 16, L = 17, Y = 18, G = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0], Q = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13], k = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7], se = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], ue = new Array(2 * (A + 2));
      l(ue);
      var P = new Array(2 * m);
      l(P);
      var K = new Array(512);
      l(K);
      var _ = new Array(256);
      l(_);
      var J = new Array(E);
      l(J);
      var fe, $, pe, ne = new Array(m);
      function he(a, h, O, U, B) {
        this.static_tree = a, this.extra_bits = h, this.extra_base = O, this.elems = U, this.max_length = B, this.has_stree = a && a.length;
      }
      function j(a, h) {
        this.dyn_tree = a, this.max_code = 0, this.stat_desc = h;
      }
      function C(a) {
        return a < 256 ? K[a] : K[256 + (a >>> 7)];
      }
      function H(a, h) {
        a.pending_buf[a.pending++] = 255 & h, a.pending_buf[a.pending++] = h >>> 8 & 255;
      }
      function W(a, h, O) {
        a.bi_valid > g - O ? (a.bi_buf |= h << a.bi_valid & 65535, H(a, a.bi_buf), a.bi_buf = h >> g - a.bi_valid, a.bi_valid += O - g) : (a.bi_buf |= h << a.bi_valid & 65535, a.bi_valid += O);
      }
      function te(a, h, O) {
        W(a, O[2 * h], O[2 * h + 1]);
      }
      function z(a, h) {
        for (var O = 0; O |= 1 & a, a >>>= 1, O <<= 1, 0 < --h; )
          ;
        return O >>> 1;
      }
      function p(a, h, O) {
        var U, B, re = new Array(S + 1), oe = 0;
        for (U = 1; U <= S; U++)
          re[U] = oe = oe + O[U - 1] << 1;
        for (B = 0; B <= h; B++) {
          var ie = a[2 * B + 1];
          ie !== 0 && (a[2 * B] = z(re[ie]++, ie));
        }
      }
      function d(a) {
        var h;
        for (h = 0; h < A; h++)
          a.dyn_ltree[2 * h] = 0;
        for (h = 0; h < m; h++)
          a.dyn_dtree[2 * h] = 0;
        for (h = 0; h < v; h++)
          a.bl_tree[2 * h] = 0;
        a.dyn_ltree[2 * R] = 1, a.opt_len = a.static_len = 0, a.last_lit = a.matches = 0;
      }
      function M(a) {
        8 < a.bi_valid ? H(a, a.bi_buf) : 0 < a.bi_valid && (a.pending_buf[a.pending++] = a.bi_buf), a.bi_buf = 0, a.bi_valid = 0;
      }
      function F(a, h, O, U) {
        var B = 2 * h, re = 2 * O;
        return a[B] < a[re] || a[B] === a[re] && U[h] <= U[O];
      }
      function I(a, h, O) {
        for (var U = a.heap[O], B = O << 1; B <= a.heap_len && (B < a.heap_len && F(h, a.heap[B + 1], a.heap[B], a.depth) && B++, !F(h, U, a.heap[B], a.depth)); )
          a.heap[O] = a.heap[B], O = B, B <<= 1;
        a.heap[O] = U;
      }
      function N(a, h, O) {
        var U, B, re, oe, ie = 0;
        if (a.last_lit !== 0)
          for (; U = a.pending_buf[a.d_buf + 2 * ie] << 8 | a.pending_buf[a.d_buf + 2 * ie + 1], B = a.pending_buf[a.l_buf + ie], ie++, U === 0 ? te(a, B, h) : (te(a, (re = _[B]) + T + 1, h), (oe = G[re]) !== 0 && W(a, B -= J[re], oe), te(a, re = C(--U), O), (oe = Q[re]) !== 0 && W(a, U -= ne[re], oe)), ie < a.last_lit; )
            ;
        te(a, R, h);
      }
      function Z(a, h) {
        var O, U, B, re = h.dyn_tree, oe = h.stat_desc.static_tree, ie = h.stat_desc.has_stree, ce = h.stat_desc.elems, me = -1;
        for (a.heap_len = 0, a.heap_max = y, O = 0; O < ce; O++)
          re[2 * O] !== 0 ? (a.heap[++a.heap_len] = me = O, a.depth[O] = 0) : re[2 * O + 1] = 0;
        for (; a.heap_len < 2; )
          re[2 * (B = a.heap[++a.heap_len] = me < 2 ? ++me : 0)] = 1, a.depth[B] = 0, a.opt_len--, ie && (a.static_len -= oe[2 * B + 1]);
        for (h.max_code = me, O = a.heap_len >> 1; 1 <= O; O--)
          I(a, re, O);
        for (B = ce; O = a.heap[1], a.heap[1] = a.heap[a.heap_len--], I(a, re, 1), U = a.heap[1], a.heap[--a.heap_max] = O, a.heap[--a.heap_max] = U, re[2 * B] = re[2 * O] + re[2 * U], a.depth[B] = (a.depth[O] >= a.depth[U] ? a.depth[O] : a.depth[U]) + 1, re[2 * O + 1] = re[2 * U + 1] = B, a.heap[1] = B++, I(a, re, 1), 2 <= a.heap_len; )
          ;
        a.heap[--a.heap_max] = a.heap[1], function(we, Pe) {
          var et, He, It, Te, Ht, dr, Xe = Pe.dyn_tree, Hn = Pe.max_code, wa = Pe.stat_desc.static_tree, ga = Pe.stat_desc.has_stree, ya = Pe.stat_desc.extra_bits, Wn = Pe.stat_desc.extra_base, Rt = Pe.stat_desc.max_length, Wt = 0;
          for (Te = 0; Te <= S; Te++)
            we.bl_count[Te] = 0;
          for (Xe[2 * we.heap[we.heap_max] + 1] = 0, et = we.heap_max + 1; et < y; et++)
            Rt < (Te = Xe[2 * Xe[2 * (He = we.heap[et]) + 1] + 1] + 1) && (Te = Rt, Wt++), Xe[2 * He + 1] = Te, Hn < He || (we.bl_count[Te]++, Ht = 0, Wn <= He && (Ht = ya[He - Wn]), dr = Xe[2 * He], we.opt_len += dr * (Te + Ht), ga && (we.static_len += dr * (wa[2 * He + 1] + Ht)));
          if (Wt !== 0) {
            do {
              for (Te = Rt - 1; we.bl_count[Te] === 0; )
                Te--;
              we.bl_count[Te]--, we.bl_count[Te + 1] += 2, we.bl_count[Rt]--, Wt -= 2;
            } while (0 < Wt);
            for (Te = Rt; Te !== 0; Te--)
              for (He = we.bl_count[Te]; He !== 0; )
                Hn < (It = we.heap[--et]) || (Xe[2 * It + 1] !== Te && (we.opt_len += (Te - Xe[2 * It + 1]) * Xe[2 * It], Xe[2 * It + 1] = Te), He--);
          }
        }(a, h), p(re, me, a.bl_count);
      }
      function f(a, h, O) {
        var U, B, re = -1, oe = h[1], ie = 0, ce = 7, me = 4;
        for (oe === 0 && (ce = 138, me = 3), h[2 * (O + 1) + 1] = 65535, U = 0; U <= O; U++)
          B = oe, oe = h[2 * (U + 1) + 1], ++ie < ce && B === oe || (ie < me ? a.bl_tree[2 * B] += ie : B !== 0 ? (B !== re && a.bl_tree[2 * B]++, a.bl_tree[2 * D]++) : ie <= 10 ? a.bl_tree[2 * L]++ : a.bl_tree[2 * Y]++, re = B, me = (ie = 0) === oe ? (ce = 138, 3) : B === oe ? (ce = 6, 3) : (ce = 7, 4));
      }
      function V(a, h, O) {
        var U, B, re = -1, oe = h[1], ie = 0, ce = 7, me = 4;
        for (oe === 0 && (ce = 138, me = 3), U = 0; U <= O; U++)
          if (B = oe, oe = h[2 * (U + 1) + 1], !(++ie < ce && B === oe)) {
            if (ie < me)
              for (; te(a, B, a.bl_tree), --ie != 0; )
                ;
            else
              B !== 0 ? (B !== re && (te(a, B, a.bl_tree), ie--), te(a, D, a.bl_tree), W(a, ie - 3, 2)) : ie <= 10 ? (te(a, L, a.bl_tree), W(a, ie - 3, 3)) : (te(a, Y, a.bl_tree), W(a, ie - 11, 7));
            re = B, me = (ie = 0) === oe ? (ce = 138, 3) : B === oe ? (ce = 6, 3) : (ce = 7, 4);
          }
      }
      l(ne);
      var w = !1;
      function s(a, h, O, U) {
        W(a, (b << 1) + (U ? 1 : 0), 3), function(B, re, oe, ie) {
          M(B), ie && (H(B, oe), H(B, ~oe)), c.arraySet(B.pending_buf, B.window, re, oe, B.pending), B.pending += oe;
        }(a, h, O, !0);
      }
      o._tr_init = function(a) {
        w || (function() {
          var h, O, U, B, re, oe = new Array(S + 1);
          for (B = U = 0; B < E - 1; B++)
            for (J[B] = U, h = 0; h < 1 << G[B]; h++)
              _[U++] = B;
          for (_[U - 1] = B, B = re = 0; B < 16; B++)
            for (ne[B] = re, h = 0; h < 1 << Q[B]; h++)
              K[re++] = B;
          for (re >>= 7; B < m; B++)
            for (ne[B] = re << 7, h = 0; h < 1 << Q[B] - 7; h++)
              K[256 + re++] = B;
          for (O = 0; O <= S; O++)
            oe[O] = 0;
          for (h = 0; h <= 143; )
            ue[2 * h + 1] = 8, h++, oe[8]++;
          for (; h <= 255; )
            ue[2 * h + 1] = 9, h++, oe[9]++;
          for (; h <= 279; )
            ue[2 * h + 1] = 7, h++, oe[7]++;
          for (; h <= 287; )
            ue[2 * h + 1] = 8, h++, oe[8]++;
          for (p(ue, A + 1, oe), h = 0; h < m; h++)
            P[2 * h + 1] = 5, P[2 * h] = z(h, 5);
          fe = new he(ue, G, T + 1, A, S), $ = new he(P, Q, 0, m, S), pe = new he(new Array(0), k, 0, v, x);
        }(), w = !0), a.l_desc = new j(a.dyn_ltree, fe), a.d_desc = new j(a.dyn_dtree, $), a.bl_desc = new j(a.bl_tree, pe), a.bi_buf = 0, a.bi_valid = 0, d(a);
      }, o._tr_stored_block = s, o._tr_flush_block = function(a, h, O, U) {
        var B, re, oe = 0;
        0 < a.level ? (a.strm.data_type === 2 && (a.strm.data_type = function(ie) {
          var ce, me = 4093624447;
          for (ce = 0; ce <= 31; ce++, me >>>= 1)
            if (1 & me && ie.dyn_ltree[2 * ce] !== 0)
              return u;
          if (ie.dyn_ltree[18] !== 0 || ie.dyn_ltree[20] !== 0 || ie.dyn_ltree[26] !== 0)
            return i;
          for (ce = 32; ce < T; ce++)
            if (ie.dyn_ltree[2 * ce] !== 0)
              return i;
          return u;
        }(a)), Z(a, a.l_desc), Z(a, a.d_desc), oe = function(ie) {
          var ce;
          for (f(ie, ie.dyn_ltree, ie.l_desc.max_code), f(ie, ie.dyn_dtree, ie.d_desc.max_code), Z(ie, ie.bl_desc), ce = v - 1; 3 <= ce && ie.bl_tree[2 * se[ce] + 1] === 0; ce--)
            ;
          return ie.opt_len += 3 * (ce + 1) + 5 + 5 + 4, ce;
        }(a), B = a.opt_len + 3 + 7 >>> 3, (re = a.static_len + 3 + 7 >>> 3) <= B && (B = re)) : B = re = O + 5, O + 4 <= B && h !== -1 ? s(a, h, O, U) : a.strategy === 4 || re === B ? (W(a, 2 + (U ? 1 : 0), 3), N(a, ue, P)) : (W(a, 4 + (U ? 1 : 0), 3), function(ie, ce, me, we) {
          var Pe;
          for (W(ie, ce - 257, 5), W(ie, me - 1, 5), W(ie, we - 4, 4), Pe = 0; Pe < we; Pe++)
            W(ie, ie.bl_tree[2 * se[Pe] + 1], 3);
          V(ie, ie.dyn_ltree, ce - 1), V(ie, ie.dyn_dtree, me - 1);
        }(a, a.l_desc.max_code + 1, a.d_desc.max_code + 1, oe + 1), N(a, a.dyn_ltree, a.dyn_dtree)), d(a), U && M(a);
      }, o._tr_tally = function(a, h, O) {
        return a.pending_buf[a.d_buf + 2 * a.last_lit] = h >>> 8 & 255, a.pending_buf[a.d_buf + 2 * a.last_lit + 1] = 255 & h, a.pending_buf[a.l_buf + a.last_lit] = 255 & O, a.last_lit++, h === 0 ? a.dyn_ltree[2 * O]++ : (a.matches++, h--, a.dyn_ltree[2 * (_[O] + T + 1)]++, a.dyn_dtree[2 * C(h)]++), a.last_lit === a.lit_bufsize - 1;
      }, o._tr_align = function(a) {
        W(a, 2, 3), te(a, R, ue), function(h) {
          h.bi_valid === 16 ? (H(h, h.bi_buf), h.bi_buf = 0, h.bi_valid = 0) : 8 <= h.bi_valid && (h.pending_buf[h.pending++] = 255 & h.bi_buf, h.bi_buf >>= 8, h.bi_valid -= 8);
        }(a);
      };
    }, { "../utils/common": 41 }], 53: [function(r, n, o) {
      n.exports = function() {
        this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
      };
    }, {}], 54: [function(r, n, o) {
      (function(c) {
        (function(u, i) {
          if (!u.setImmediate) {
            var l, b, E, T, A = 1, m = {}, v = !1, y = u.document, S = Object.getPrototypeOf && Object.getPrototypeOf(u);
            S = S && S.setTimeout ? S : u, l = {}.toString.call(u.process) === "[object process]" ? function(D) {
              ye.nextTick(function() {
                x(D);
              });
            } : function() {
              if (u.postMessage && !u.importScripts) {
                var D = !0, L = u.onmessage;
                return u.onmessage = function() {
                  D = !1;
                }, u.postMessage("", "*"), u.onmessage = L, D;
              }
            }() ? (T = "setImmediate$" + Math.random() + "$", u.addEventListener ? u.addEventListener("message", R, !1) : u.attachEvent("onmessage", R), function(D) {
              u.postMessage(T + D, "*");
            }) : u.MessageChannel ? ((E = new MessageChannel()).port1.onmessage = function(D) {
              x(D.data);
            }, function(D) {
              E.port2.postMessage(D);
            }) : y && "onreadystatechange" in y.createElement("script") ? (b = y.documentElement, function(D) {
              var L = y.createElement("script");
              L.onreadystatechange = function() {
                x(D), L.onreadystatechange = null, b.removeChild(L), L = null;
              }, b.appendChild(L);
            }) : function(D) {
              setTimeout(x, 0, D);
            }, S.setImmediate = function(D) {
              typeof D != "function" && (D = new Function("" + D));
              for (var L = new Array(arguments.length - 1), Y = 0; Y < L.length; Y++)
                L[Y] = arguments[Y + 1];
              var G = { callback: D, args: L };
              return m[A] = G, l(A), A++;
            }, S.clearImmediate = g;
          }
          function g(D) {
            delete m[D];
          }
          function x(D) {
            if (v)
              setTimeout(x, 0, D);
            else {
              var L = m[D];
              if (L) {
                v = !0;
                try {
                  (function(Y) {
                    var G = Y.callback, Q = Y.args;
                    switch (Q.length) {
                      case 0:
                        G();
                        break;
                      case 1:
                        G(Q[0]);
                        break;
                      case 2:
                        G(Q[0], Q[1]);
                        break;
                      case 3:
                        G(Q[0], Q[1], Q[2]);
                        break;
                      default:
                        G.apply(i, Q);
                    }
                  })(L);
                } finally {
                  g(D), v = !1;
                }
              }
            }
          }
          function R(D) {
            D.source === u && typeof D.data == "string" && D.data.indexOf(T) === 0 && x(+D.data.slice(T.length));
          }
        })(typeof self > "u" ? c === void 0 ? this : c : self);
      }).call(this, typeof je < "u" ? je : typeof self < "u" ? self : typeof window < "u" ? window : {});
    }, {}] }, {}, [10])(10);
  });
})(pa);
var of = pa.exports;
const uf = /* @__PURE__ */ _n(of);
var rr = { exports: {} }, cf = {
  "&": "&amp;",
  '"': "&quot;",
  "'": "&apos;",
  "<": "&lt;",
  ">": "&gt;"
};
function lf(t) {
  return t && t.replace ? t.replace(/([&"<>'])/g, function(e, r) {
    return cf[r];
  }) : t;
}
var hf = lf, vn = hf, Ki = In.Stream, ff = "    ";
function df(t, e) {
  typeof e != "object" && (e = {
    indent: e
  });
  var r = e.stream ? new Ki() : null, n = "", o = !1, c = e.indent ? e.indent === !0 ? ff : e.indent : "", u = !0;
  function i(A) {
    u ? ye.nextTick(A) : A();
  }
  function l(A, m) {
    if (m !== void 0 && (n += m), A && !o && (r = r || new Ki(), o = !0), A && o) {
      var v = n;
      i(function() {
        r.emit("data", v);
      }), n = "";
    }
  }
  function b(A, m) {
    jn(l, nr(A, c, c ? 1 : 0), m);
  }
  function E() {
    if (r) {
      var A = n;
      i(function() {
        r.emit("data", A), r.emit("end"), r.readable = !1, r.emit("close");
      });
    }
  }
  function T(A) {
    var m = A.encoding || "UTF-8", v = { version: "1.0", encoding: m };
    A.standalone && (v.standalone = A.standalone), b({ "?xml": { _attr: v } }), n = n.replace("/>", "?>");
  }
  return i(function() {
    u = !1;
  }), e.declaration && T(e.declaration), t && t.forEach ? t.forEach(function(A, m) {
    var v;
    m + 1 === t.length && (v = E), b(A, v);
  }) : b(t, E), r ? (r.readable = !0, r) : n;
}
function pf() {
  var t = Array.prototype.slice.call(arguments), e = {
    _elem: nr(t)
  };
  return e.push = function(r) {
    if (!this.append)
      throw new Error("not assigned to a parent!");
    var n = this, o = this._elem.indent;
    jn(
      this.append,
      nr(
        r,
        o,
        this._elem.icount + (o ? 1 : 0)
      ),
      function() {
        n.append(!0);
      }
    );
  }, e.close = function(r) {
    r !== void 0 && this.push(r), this.end && this.end();
  }, e;
}
function mf(t, e) {
  return new Array(e || 0).join(t || "");
}
function nr(t, e, r) {
  r = r || 0;
  var n = mf(e, r), o, c = t, u = !1;
  if (typeof t == "object") {
    var i = Object.keys(t);
    if (o = i[0], c = t[o], c && c._elem)
      return c._elem.name = o, c._elem.icount = r, c._elem.indent = e, c._elem.indents = n, c._elem.interrupt = c, c._elem;
  }
  var l = [], b = [], E;
  function T(A) {
    var m = Object.keys(A);
    m.forEach(function(v) {
      l.push(wf(v, A[v]));
    });
  }
  switch (typeof c) {
    case "object":
      if (c === null)
        break;
      c._attr && T(c._attr), c._cdata && b.push(
        ("<![CDATA[" + c._cdata).replace(/\]\]>/g, "]]]]><![CDATA[>") + "]]>"
      ), c.forEach && (E = !1, b.push(""), c.forEach(function(A) {
        if (typeof A == "object") {
          var m = Object.keys(A)[0];
          m == "_attr" ? T(A._attr) : b.push(nr(
            A,
            e,
            r + 1
          ));
        } else
          b.pop(), E = !0, b.push(vn(A));
      }), E || b.push(""));
      break;
    default:
      b.push(vn(c));
  }
  return {
    name: o,
    interrupt: u,
    attributes: l,
    content: b,
    icount: r,
    indents: n,
    indent: e
  };
}
function jn(t, e, r) {
  if (typeof e != "object")
    return t(!1, e);
  var n = e.interrupt ? 1 : e.content.length;
  function o() {
    for (; e.content.length; ) {
      var u = e.content.shift();
      if (u !== void 0) {
        if (c(u))
          return;
        jn(t, u);
      }
    }
    t(!1, (n > 1 ? e.indents : "") + (e.name ? "</" + e.name + ">" : "") + (e.indent && !r ? `
` : "")), r && r();
  }
  function c(u) {
    return u.interrupt ? (u.interrupt.append = t, u.interrupt.end = o, u.interrupt = !1, t(!0), !0) : !1;
  }
  if (t(!1, e.indents + (e.name ? "<" + e.name : "") + (e.attributes.length ? " " + e.attributes.join(" ") : "") + (n ? e.name ? ">" : "" : e.name ? "/>" : "") + (e.indent && n > 1 ? `
` : "")), !n)
    return t(!1, e.indent ? `
` : "");
  c(e) || o();
}
function wf(t, e) {
  return t + '="' + vn(e) + '"';
}
rr.exports = df;
rr.exports.element = rr.exports.Element = pf;
var gf = rr.exports;
const Ie = /* @__PURE__ */ _n(gf);
class yf {
  // tslint:disable-next-line: no-object-literal-type-assertion
  format(e, r = { stack: [] }) {
    const n = e.prepForXml(r);
    if (n)
      return n;
    throw Error("XMLComponent did not format correctly");
  }
}
class bf {
  replace(e, r, n) {
    let o = e;
    return r.forEach((c, u) => {
      o = o.replace(new RegExp(`{${c.fileName}}`, "g"), (n + u).toString());
    }), o;
  }
  getMediaData(e, r) {
    return r.Array.filter((n) => e.search(`{${n.fileName}}`) > 0);
  }
}
class vf {
  replace(e, r) {
    let n = e;
    for (const o of r)
      n = n.replace(
        new RegExp(`{${o.reference}-${o.instance}}`, "g"),
        o.numId.toString()
      );
    return n;
  }
}
class _f {
  constructor() {
    X(this, "formatter"), X(this, "imageReplacer"), X(this, "numberingReplacer"), this.formatter = new yf(), this.imageReplacer = new bf(), this.numberingReplacer = new vf();
  }
  compile(e, r) {
    const n = new uf(), o = this.xmlifyFile(e, r), c = new Map(Object.entries(o));
    for (const [, u] of c)
      if (Array.isArray(u))
        for (const i of u)
          n.file(i.path, i.data);
      else
        n.file(u.path, u.data);
    for (const { stream: u, fileName: i } of e.Media.Array)
      n.file(`word/media/${i}`, u);
    return n;
  }
  xmlifyFile(e, r) {
    const n = e.Document.Relationships.RelationshipCount + 1, o = Ie(
      this.formatter.format(e.Document.View, {
        viewWrapper: e.Document,
        file: e,
        stack: []
      }),
      {
        indent: r,
        declaration: {
          standalone: "yes",
          encoding: "UTF-8"
        }
      }
    ), c = this.imageReplacer.getMediaData(o, e.Media);
    return {
      Relationships: {
        data: (() => (c.forEach((u, i) => {
          e.Document.Relationships.createRelationship(
            n + i,
            "http://schemas.openxmlformats.org/officeDocument/2006/relationships/image",
            `media/${u.fileName}`
          );
        }), Ie(
          this.formatter.format(e.Document.Relationships, {
            viewWrapper: e.Document,
            file: e,
            stack: []
          }),
          {
            indent: r,
            declaration: {
              encoding: "UTF-8"
            }
          }
        )))(),
        path: "word/_rels/document.xml.rels"
      },
      Document: {
        data: (() => {
          const u = this.imageReplacer.replace(o, c, n);
          return this.numberingReplacer.replace(u, e.Numbering.ConcreteNumbering);
        })(),
        path: "word/document.xml"
      },
      Styles: {
        data: (() => {
          const u = Ie(
            this.formatter.format(e.Styles, {
              viewWrapper: e.Document,
              file: e,
              stack: []
            }),
            {
              indent: r,
              declaration: {
                standalone: "yes",
                encoding: "UTF-8"
              }
            }
          );
          return this.numberingReplacer.replace(u, e.Numbering.ConcreteNumbering);
        })(),
        path: "word/styles.xml"
      },
      Properties: {
        data: Ie(
          this.formatter.format(e.CoreProperties, {
            viewWrapper: e.Document,
            file: e,
            stack: []
          }),
          {
            indent: r,
            declaration: {
              standalone: "yes",
              encoding: "UTF-8"
            }
          }
        ),
        path: "docProps/core.xml"
      },
      Numbering: {
        data: Ie(
          this.formatter.format(e.Numbering, {
            viewWrapper: e.Document,
            file: e,
            stack: []
          }),
          {
            indent: r,
            declaration: {
              standalone: "yes",
              encoding: "UTF-8"
            }
          }
        ),
        path: "word/numbering.xml"
      },
      FileRelationships: {
        data: Ie(
          this.formatter.format(e.FileRelationships, {
            viewWrapper: e.Document,
            file: e,
            stack: []
          }),
          {
            indent: r,
            declaration: {
              encoding: "UTF-8"
            }
          }
        ),
        path: "_rels/.rels"
      },
      HeaderRelationships: e.Headers.map((u, i) => {
        const l = Ie(
          this.formatter.format(u.View, {
            viewWrapper: u,
            file: e,
            stack: []
          }),
          {
            indent: r,
            declaration: {
              encoding: "UTF-8"
            }
          }
        );
        return this.imageReplacer.getMediaData(l, e.Media).forEach((E, T) => {
          u.Relationships.createRelationship(
            T,
            "http://schemas.openxmlformats.org/officeDocument/2006/relationships/image",
            `media/${E.fileName}`
          );
        }), {
          data: Ie(
            this.formatter.format(u.Relationships, {
              viewWrapper: u,
              file: e,
              stack: []
            }),
            {
              indent: r,
              declaration: {
                encoding: "UTF-8"
              }
            }
          ),
          path: `word/_rels/header${i + 1}.xml.rels`
        };
      }),
      FooterRelationships: e.Footers.map((u, i) => {
        const l = Ie(
          this.formatter.format(u.View, {
            viewWrapper: u,
            file: e,
            stack: []
          }),
          {
            indent: r,
            declaration: {
              encoding: "UTF-8"
            }
          }
        );
        return this.imageReplacer.getMediaData(l, e.Media).forEach((E, T) => {
          u.Relationships.createRelationship(
            T,
            "http://schemas.openxmlformats.org/officeDocument/2006/relationships/image",
            `media/${E.fileName}`
          );
        }), {
          data: Ie(
            this.formatter.format(u.Relationships, {
              viewWrapper: u,
              file: e,
              stack: []
            }),
            {
              indent: r,
              declaration: {
                encoding: "UTF-8"
              }
            }
          ),
          path: `word/_rels/footer${i + 1}.xml.rels`
        };
      }),
      Headers: e.Headers.map((u, i) => {
        const l = Ie(
          this.formatter.format(u.View, {
            viewWrapper: u,
            file: e,
            stack: []
          }),
          {
            indent: r,
            declaration: {
              encoding: "UTF-8"
            }
          }
        ), b = this.imageReplacer.getMediaData(l, e.Media), E = this.imageReplacer.replace(l, b, 0);
        return {
          data: this.numberingReplacer.replace(E, e.Numbering.ConcreteNumbering),
          path: `word/header${i + 1}.xml`
        };
      }),
      Footers: e.Footers.map((u, i) => {
        const l = Ie(
          this.formatter.format(u.View, {
            viewWrapper: u,
            file: e,
            stack: []
          }),
          {
            indent: r,
            declaration: {
              encoding: "UTF-8"
            }
          }
        ), b = this.imageReplacer.getMediaData(l, e.Media), E = this.imageReplacer.replace(l, b, 0);
        return {
          data: this.numberingReplacer.replace(E, e.Numbering.ConcreteNumbering),
          path: `word/footer${i + 1}.xml`
        };
      }),
      ContentTypes: {
        data: Ie(
          this.formatter.format(e.ContentTypes, {
            viewWrapper: e.Document,
            file: e,
            stack: []
          }),
          {
            indent: r,
            declaration: {
              encoding: "UTF-8"
            }
          }
        ),
        path: "[Content_Types].xml"
      },
      CustomProperties: {
        data: Ie(
          this.formatter.format(e.CustomProperties, {
            viewWrapper: e.Document,
            file: e,
            stack: []
          }),
          {
            indent: r,
            declaration: {
              standalone: "yes",
              encoding: "UTF-8"
            }
          }
        ),
        path: "docProps/custom.xml"
      },
      AppProperties: {
        data: Ie(
          this.formatter.format(e.AppProperties, {
            viewWrapper: e.Document,
            file: e,
            stack: []
          }),
          {
            indent: r,
            declaration: {
              standalone: "yes",
              encoding: "UTF-8"
            }
          }
        ),
        path: "docProps/app.xml"
      },
      FootNotes: {
        data: Ie(
          this.formatter.format(e.FootNotes.View, {
            viewWrapper: e.FootNotes,
            file: e,
            stack: []
          }),
          {
            indent: r,
            declaration: {
              encoding: "UTF-8"
            }
          }
        ),
        path: "word/footnotes.xml"
      },
      FootNotesRelationships: {
        data: Ie(
          this.formatter.format(e.FootNotes.Relationships, {
            viewWrapper: e.FootNotes,
            file: e,
            stack: []
          }),
          {
            indent: r,
            declaration: {
              encoding: "UTF-8"
            }
          }
        ),
        path: "word/_rels/footnotes.xml.rels"
      },
      Settings: {
        data: Ie(
          this.formatter.format(e.Settings, {
            viewWrapper: e.Document,
            file: e,
            stack: []
          }),
          {
            indent: r,
            declaration: {
              standalone: "yes",
              encoding: "UTF-8"
            }
          }
        ),
        path: "word/settings.xml"
      },
      Comments: {
        data: Ie(
          this.formatter.format(e.Comments, {
            viewWrapper: e.Document,
            file: e,
            stack: []
          }),
          {
            indent: r,
            declaration: {
              standalone: "yes",
              encoding: "UTF-8"
            }
          }
        ),
        path: "word/comments.xml"
      }
    };
  }
}
const Nt = (t) => t === !0 ? "  " : t === !1 ? void 0 : t;
class ma {
  static async toString(e, r) {
    return await this.compiler.compile(e, Nt(r)).generateAsync({
      type: "string",
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      compression: "DEFLATE"
    });
  }
  static async toBuffer(e, r) {
    return await this.compiler.compile(e, Nt(r)).generateAsync({
      type: "nodebuffer",
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      compression: "DEFLATE"
    });
  }
  static async toBase64String(e, r) {
    return await this.compiler.compile(e, Nt(r)).generateAsync({
      type: "base64",
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      compression: "DEFLATE"
    });
  }
  static async toBlob(e, r) {
    return await this.compiler.compile(e, Nt(r)).generateAsync({
      type: "blob",
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      compression: "DEFLATE"
    });
  }
  static toStream(e, r) {
    const n = new In.Stream();
    return this.compiler.compile(e, Nt(r)).generateAsync({
      type: "nodebuffer",
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      compression: "DEFLATE"
    }).then((c) => {
      n.emit("data", c), n.emit("end");
    }), n;
  }
}
X(ma, "compiler", new _f());
function xf(t, e) {
  const r = document.createElement("a");
  r.href = window.URL.createObjectURL(t), r.download = e, r.click(), window.URL.revokeObjectURL(r.href);
}
const Ef = {
  [ft.FIRST]: ot.HEADING_1,
  [ft.SECOND]: ot.HEADING_2,
  [ft.THIRD]: ot.HEADING_3,
  [ft.FOURTH]: ot.HEADING_4,
  [ft.FIFTH]: ot.HEADING_5,
  [ft.SIXTH]: ot.HEADING_6
};
function on(t) {
  var e;
  return t.type === qe.IMAGE ? new Sc({
    data: t.value,
    transformation: {
      width: t.width,
      height: t.height
    }
  }) : t.type === qe.HYPERLINK ? new aa({
    children: [
      new vt({
        text: (e = t.valueList) == null ? void 0 : e.map((r) => r.value).join(""),
        style: "Hyperlink"
      })
    ],
    link: t.url
  }) : t.type === qe.TAB ? new vt({
    children: [new Nc()]
  }) : t.type === qe.LATEX ? new _l(t.value) : new vt({
    font: t.font,
    text: t.value,
    bold: t.bold,
    size: `${(t.size || 16) / 0.75}pt`,
    color: Kn(t.color).hex() || "#000000",
    italics: t.italic,
    strike: t.strikeout,
    highlight: t.highlight ? Kn(t.highlight).hex() : void 0,
    superScript: t.type === qe.SUPERSCRIPT,
    subScript: t.type === qe.SUBSCRIPT,
    underline: t.underline ? {} : void 0
  });
}
function Yt(t) {
  var o, c, u;
  const e = [];
  let r = [];
  function n() {
    r.length && (e.push(new rt({
      children: r
    })), r = []);
  }
  for (let i = 0; i < t.length; i++) {
    const l = t[i];
    if (l.type === qe.TITLE)
      n(), e.push(new rt({
        heading: Ef[l.level],
        children: ((o = l.valueList) == null ? void 0 : o.map((b) => on(b))) || []
      }));
    else if (l.type === qe.LIST) {
      n();
      const b = ((c = l.valueList) == null ? void 0 : c.map((E) => E.value).join("").split(`
`).map((E, T) => new rt({
        children: [
          new vt({
            text: `${!l.listStyle || l.listStyle === ba.DECIMAL ? `${T + 1}. ` : "• "}${E}`
          })
        ]
      }))) || [];
      e.push(...b);
    } else if (l.type === qe.TABLE) {
      n();
      const { trList: b } = l, E = [];
      for (let T = 0; T < b.length; T++) {
        const A = b[T].tdList, m = [];
        for (let v = 0; v < A.length; v++) {
          const y = A[v];
          m.push(new zn({
            columnSpan: y.colspan,
            rowSpan: y.rowspan,
            children: Yt(y.value) || []
          }));
        }
        E.push(new Ul({
          children: m
        }));
      }
      e.push(new Fl({
        rows: E,
        width: {
          size: "100%",
          type: Ln.PERCENTAGE
        }
      }));
    } else
      l.type === qe.DATE ? r.push(...((u = l.valueList) == null ? void 0 : u.map((b) => on(b))) || []) : (/^\n/.test(l.value) && (n(), l.value = l.value.replace(/^\n/, "")), r.push(on(l)));
  }
  return n(), e;
}
function Cf(t) {
  const e = t.command;
  e.executeExportDocx = (r) => {
    const { fileName: n } = r, { data: { header: o, main: c, footer: u } } = e.getValue(), i = new nf({
      sections: [
        {
          headers: {
            default: new sf({
              children: Yt(o || [])
            })
          },
          footers: {
            default: new af({
              children: Yt(u || [])
            })
          },
          children: Yt(c || [])
        }
      ]
    });
    ma.toBlob(i).then((l) => {
      xf(l, `${n}.docx`);
    });
  };
}
export {
  Cf as default
};
//# sourceMappingURL=docx.js.map
