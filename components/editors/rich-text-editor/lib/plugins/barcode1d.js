import { ElementType as At } from "../canvas-editor.es.js";
function Rt(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var le = {}, U = {}, l = {};
Object.defineProperty(l, "__esModule", {
  value: !0
});
function Pt(t, e) {
  if (!(t instanceof e))
    throw new TypeError("Cannot call a class as a function");
}
var Tt = function t(e, r) {
  Pt(this, t), this.data = e, this.text = r.text || e, this.options = r;
};
l.default = Tt;
Object.defineProperty(U, "__esModule", {
  value: !0
});
U.CODE39 = void 0;
var Mt = function() {
  function t(e, r) {
    for (var n = 0; n < r.length; n++) {
      var a = r[n];
      a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a);
    }
  }
  return function(e, r, n) {
    return r && t(e.prototype, r), n && t(e, n), e;
  };
}(), kt = l, It = Dt(kt);
function Dt(t) {
  return t && t.__esModule ? t : { default: t };
}
function jt(t, e) {
  if (!(t instanceof e))
    throw new TypeError("Cannot call a class as a function");
}
function Bt(t, e) {
  if (!t)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e && (typeof e == "object" || typeof e == "function") ? e : t;
}
function Lt(t, e) {
  if (typeof e != "function" && e !== null)
    throw new TypeError("Super expression must either be null or a function, not " + typeof e);
  t.prototype = Object.create(e && e.prototype, { constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 } }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
}
var Nt = function(t) {
  Lt(e, t);
  function e(r, n) {
    return jt(this, e), r = r.toUpperCase(), n.mod43 && (r += Ht(Ft(r))), Bt(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, r, n));
  }
  return Mt(e, [{
    key: "encode",
    value: function() {
      for (var n = te("*"), a = 0; a < this.data.length; a++)
        n += te(this.data[a]) + "0";
      return n += te("*"), {
        data: n,
        text: this.text
      };
    }
  }, {
    key: "valid",
    value: function() {
      return this.data.search(/^[0-9A-Z\-\.\ \$\/\+\%]+$/) !== -1;
    }
  }]), e;
}(It.default), tt = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "-", ".", " ", "$", "/", "+", "%", "*"], Gt = [20957, 29783, 23639, 30485, 20951, 29813, 23669, 20855, 29789, 23645, 29975, 23831, 30533, 22295, 30149, 24005, 21623, 29981, 23837, 22301, 30023, 23879, 30545, 22343, 30161, 24017, 21959, 30065, 23921, 22385, 29015, 18263, 29141, 17879, 29045, 18293, 17783, 29021, 18269, 17477, 17489, 17681, 20753, 35770];
function te(t) {
  return Ct(nt(t));
}
function Ct(t) {
  return Gt[t].toString(2);
}
function Ht(t) {
  return tt[t];
}
function nt(t) {
  return tt.indexOf(t);
}
function Ft(t) {
  for (var e = 0, r = 0; r < t.length; r++)
    e += nt(t[r]);
  return e = e % 43, e;
}
U.CODE39 = Nt;
var s = {}, he = {}, P = {}, f = {};
Object.defineProperty(f, "__esModule", {
  value: !0
});
var I;
function ne(t, e, r) {
  return e in t ? Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = r, t;
}
var rt = f.SET_A = 0, at = f.SET_B = 1, it = f.SET_C = 2;
f.SHIFT = 98;
var Xt = f.START_A = 103, zt = f.START_B = 104, Ut = f.START_C = 105;
f.MODULO = 103;
f.STOP = 106;
f.FNC1 = 207;
f.SET_BY_CODE = (I = {}, ne(I, Xt, rt), ne(I, zt, at), ne(I, Ut, it), I);
f.SWAP = {
  101: rt,
  100: at,
  99: it
};
f.A_START_CHAR = String.fromCharCode(208);
f.B_START_CHAR = String.fromCharCode(209);
f.C_START_CHAR = String.fromCharCode(210);
f.A_CHARS = "[\0-_È-Ï]";
f.B_CHARS = "[ -È-Ï]";
f.C_CHARS = "(Ï*[0-9]{2}Ï*)";
f.BARS = [11011001100, 11001101100, 11001100110, 10010011e3, 10010001100, 10001001100, 10011001e3, 10011000100, 10001100100, 11001001e3, 11001000100, 11000100100, 10110011100, 10011011100, 10011001110, 10111001100, 10011101100, 10011100110, 11001110010, 11001011100, 11001001110, 11011100100, 11001110100, 11101101110, 11101001100, 11100101100, 11100100110, 11101100100, 11100110100, 11100110010, 11011011e3, 11011000110, 11000110110, 10100011e3, 10001011e3, 10001000110, 10110001e3, 10001101e3, 10001100010, 11010001e3, 11000101e3, 11000100010, 10110111e3, 10110001110, 10001101110, 10111011e3, 10111000110, 10001110110, 11101110110, 11010001110, 11000101110, 11011101e3, 11011100010, 11011101110, 11101011e3, 11101000110, 11100010110, 11101101e3, 11101100010, 11100011010, 11101111010, 11001000010, 11110001010, 1010011e4, 10100001100, 1001011e4, 10010000110, 10000101100, 10000100110, 1011001e4, 10110000100, 1001101e4, 10011000010, 10000110100, 10000110010, 11000010010, 1100101e4, 11110111010, 11000010100, 10001111010, 10100111100, 10010111100, 10010011110, 10111100100, 10011110100, 10011110010, 11110100100, 11110010100, 11110010010, 11011011110, 11011110110, 11110110110, 10101111e3, 10100011110, 10001011110, 10111101e3, 10111100010, 11110101e3, 11110100010, 10111011110, 10111101110, 11101011110, 11110101110, 11010000100, 1101001e4, 11010011100, 1100011101011];
Object.defineProperty(P, "__esModule", {
  value: !0
});
var qt = function() {
  function t(e, r) {
    for (var n = 0; n < r.length; n++) {
      var a = r[n];
      a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a);
    }
  }
  return function(e, r, n) {
    return r && t(e.prototype, r), n && t(e, n), e;
  };
}(), Vt = l, Jt = Qt(Vt), h = f;
function Qt(t) {
  return t && t.__esModule ? t : { default: t };
}
function Wt(t, e) {
  if (!(t instanceof e))
    throw new TypeError("Cannot call a class as a function");
}
function Yt(t, e) {
  if (!t)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e && (typeof e == "object" || typeof e == "function") ? e : t;
}
function Zt(t, e) {
  if (typeof e != "function" && e !== null)
    throw new TypeError("Super expression must either be null or a function, not " + typeof e);
  t.prototype = Object.create(e && e.prototype, { constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 } }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
}
var Kt = function(t) {
  Zt(e, t);
  function e(r, n) {
    Wt(this, e);
    var a = Yt(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, r.substring(1), n));
    return a.bytes = r.split("").map(function(i) {
      return i.charCodeAt(0);
    }), a;
  }
  return qt(e, [{
    key: "valid",
    value: function() {
      return /^[\x00-\x7F\xC8-\xD3]+$/.test(this.data);
    }
    // The public encoding function
  }, {
    key: "encode",
    value: function() {
      var n = this.bytes, a = n.shift() - 105, i = h.SET_BY_CODE[a];
      if (i === void 0)
        throw new RangeError("The encoding does not start with a start character.");
      this.shouldEncodeAsEan128() === !0 && n.unshift(h.FNC1);
      var o = e.next(n, 1, i);
      return {
        text: this.text === this.data ? this.text.replace(/[^\x20-\x7E]/g, "") : this.text,
        data: (
          // Add the start bits
          e.getBar(a) + // Add the encoded bits
          o.result + // Add the checksum
          e.getBar((o.checksum + a) % h.MODULO) + // Add the end bits
          e.getBar(h.STOP)
        )
      };
    }
    // GS1-128/EAN-128
  }, {
    key: "shouldEncodeAsEan128",
    value: function() {
      var n = this.options.ean128 || !1;
      return typeof n == "string" && (n = n.toLowerCase() === "true"), n;
    }
    // Get a bar symbol by index
  }], [{
    key: "getBar",
    value: function(n) {
      return h.BARS[n] ? h.BARS[n].toString() : "";
    }
    // Correct an index by a set and shift it from the bytes array
  }, {
    key: "correctIndex",
    value: function(n, a) {
      if (a === h.SET_A) {
        var i = n.shift();
        return i < 32 ? i + 64 : i - 32;
      } else
        return a === h.SET_B ? n.shift() - 32 : (n.shift() - 48) * 10 + n.shift() - 48;
    }
  }, {
    key: "next",
    value: function(n, a, i) {
      if (!n.length)
        return { result: "", checksum: 0 };
      var o = void 0, u = void 0;
      if (n[0] >= 200) {
        u = n.shift() - 105;
        var y = h.SWAP[u];
        y !== void 0 ? o = e.next(n, a + 1, y) : ((i === h.SET_A || i === h.SET_B) && u === h.SHIFT && (n[0] = i === h.SET_A ? n[0] > 95 ? n[0] - 96 : n[0] : n[0] < 32 ? n[0] + 96 : n[0]), o = e.next(n, a + 1, i));
      } else
        u = e.correctIndex(n, i), o = e.next(n, a + 1, i);
      var $ = e.getBar(u), xt = u * a;
      return {
        result: $ + o.result,
        checksum: xt + o.checksum
      };
    }
  }]), e;
}(Jt.default);
P.default = Kt;
var de = {};
Object.defineProperty(de, "__esModule", {
  value: !0
});
var g = f, ot = function(e) {
  return e.match(new RegExp("^" + g.A_CHARS + "*"))[0].length;
}, ut = function(e) {
  return e.match(new RegExp("^" + g.B_CHARS + "*"))[0].length;
}, ft = function(e) {
  return e.match(new RegExp("^" + g.C_CHARS + "*"))[0];
};
function _e(t, e) {
  var r = e ? g.A_CHARS : g.B_CHARS, n = t.match(new RegExp("^(" + r + "+?)(([0-9]{2}){2,})([^0-9]|$)"));
  if (n)
    return n[1] + String.fromCharCode(204) + ct(t.substring(n[1].length));
  var a = t.match(new RegExp("^" + r + "+"))[0];
  return a.length === t.length ? t : a + String.fromCharCode(e ? 205 : 206) + _e(t.substring(a.length), !e);
}
function ct(t) {
  var e = ft(t), r = e.length;
  if (r === t.length)
    return t;
  t = t.substring(r);
  var n = ot(t) >= ut(t);
  return e + String.fromCharCode(n ? 206 : 205) + _e(t, n);
}
de.default = function(t) {
  var e = void 0, r = ft(t).length;
  if (r >= 2)
    e = g.C_START_CHAR + ct(t);
  else {
    var n = ot(t) > ut(t);
    e = (n ? g.A_START_CHAR : g.B_START_CHAR) + _e(t, n);
  }
  return e.replace(
    /[\xCD\xCE]([^])[\xCD\xCE]/,
    // Any sequence between 205 and 206 characters
    function(a, i) {
      return String.fromCharCode(203) + i;
    }
  );
};
Object.defineProperty(he, "__esModule", {
  value: !0
});
var en = P, tn = lt(en), nn = de, rn = lt(nn);
function lt(t) {
  return t && t.__esModule ? t : { default: t };
}
function an(t, e) {
  if (!(t instanceof e))
    throw new TypeError("Cannot call a class as a function");
}
function re(t, e) {
  if (!t)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e && (typeof e == "object" || typeof e == "function") ? e : t;
}
function on(t, e) {
  if (typeof e != "function" && e !== null)
    throw new TypeError("Super expression must either be null or a function, not " + typeof e);
  t.prototype = Object.create(e && e.prototype, { constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 } }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
}
var un = function(t) {
  on(e, t);
  function e(r, n) {
    if (an(this, e), /^[\x00-\x7F\xC8-\xD3]+$/.test(r))
      var a = re(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, (0, rn.default)(r), n));
    else
      var a = re(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, r, n));
    return re(a);
  }
  return e;
}(tn.default);
he.default = un;
var ve = {};
Object.defineProperty(ve, "__esModule", {
  value: !0
});
var fn = function() {
  function t(e, r) {
    for (var n = 0; n < r.length; n++) {
      var a = r[n];
      a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a);
    }
  }
  return function(e, r, n) {
    return r && t(e.prototype, r), n && t(e, n), e;
  };
}(), cn = P, ln = hn(cn), He = f;
function hn(t) {
  return t && t.__esModule ? t : { default: t };
}
function dn(t, e) {
  if (!(t instanceof e))
    throw new TypeError("Cannot call a class as a function");
}
function _n(t, e) {
  if (!t)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e && (typeof e == "object" || typeof e == "function") ? e : t;
}
function vn(t, e) {
  if (typeof e != "function" && e !== null)
    throw new TypeError("Super expression must either be null or a function, not " + typeof e);
  t.prototype = Object.create(e && e.prototype, { constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 } }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
}
var sn = function(t) {
  vn(e, t);
  function e(r, n) {
    return dn(this, e), _n(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, He.A_START_CHAR + r, n));
  }
  return fn(e, [{
    key: "valid",
    value: function() {
      return new RegExp("^" + He.A_CHARS + "+$").test(this.data);
    }
  }]), e;
}(ln.default);
ve.default = sn;
var se = {};
Object.defineProperty(se, "__esModule", {
  value: !0
});
var yn = function() {
  function t(e, r) {
    for (var n = 0; n < r.length; n++) {
      var a = r[n];
      a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a);
    }
  }
  return function(e, r, n) {
    return r && t(e.prototype, r), n && t(e, n), e;
  };
}(), pn = P, gn = On(pn), Fe = f;
function On(t) {
  return t && t.__esModule ? t : { default: t };
}
function En(t, e) {
  if (!(t instanceof e))
    throw new TypeError("Cannot call a class as a function");
}
function bn(t, e) {
  if (!t)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e && (typeof e == "object" || typeof e == "function") ? e : t;
}
function mn(t, e) {
  if (typeof e != "function" && e !== null)
    throw new TypeError("Super expression must either be null or a function, not " + typeof e);
  t.prototype = Object.create(e && e.prototype, { constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 } }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
}
var wn = function(t) {
  mn(e, t);
  function e(r, n) {
    return En(this, e), bn(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, Fe.B_START_CHAR + r, n));
  }
  return yn(e, [{
    key: "valid",
    value: function() {
      return new RegExp("^" + Fe.B_CHARS + "+$").test(this.data);
    }
  }]), e;
}(gn.default);
se.default = wn;
var ye = {};
Object.defineProperty(ye, "__esModule", {
  value: !0
});
var $n = function() {
  function t(e, r) {
    for (var n = 0; n < r.length; n++) {
      var a = r[n];
      a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a);
    }
  }
  return function(e, r, n) {
    return r && t(e.prototype, r), n && t(e, n), e;
  };
}(), Sn = P, xn = An(Sn), Xe = f;
function An(t) {
  return t && t.__esModule ? t : { default: t };
}
function Rn(t, e) {
  if (!(t instanceof e))
    throw new TypeError("Cannot call a class as a function");
}
function Pn(t, e) {
  if (!t)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e && (typeof e == "object" || typeof e == "function") ? e : t;
}
function Tn(t, e) {
  if (typeof e != "function" && e !== null)
    throw new TypeError("Super expression must either be null or a function, not " + typeof e);
  t.prototype = Object.create(e && e.prototype, { constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 } }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
}
var Mn = function(t) {
  Tn(e, t);
  function e(r, n) {
    return Rn(this, e), Pn(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, Xe.C_START_CHAR + r, n));
  }
  return $n(e, [{
    key: "valid",
    value: function() {
      return new RegExp("^" + Xe.C_CHARS + "+$").test(this.data);
    }
  }]), e;
}(xn.default);
ye.default = Mn;
Object.defineProperty(s, "__esModule", {
  value: !0
});
s.CODE128C = s.CODE128B = s.CODE128A = s.CODE128 = void 0;
var kn = he, In = q(kn), Dn = ve, jn = q(Dn), Bn = se, Ln = q(Bn), Nn = ye, Gn = q(Nn);
function q(t) {
  return t && t.__esModule ? t : { default: t };
}
s.CODE128 = In.default;
s.CODE128A = jn.default;
s.CODE128B = Ln.default;
s.CODE128C = Gn.default;
var c = {}, pe = {}, v = {};
Object.defineProperty(v, "__esModule", {
  value: !0
});
v.SIDE_BIN = "101";
v.MIDDLE_BIN = "01010";
v.BINARIES = {
  L: [
    // The L (left) type of encoding
    "0001101",
    "0011001",
    "0010011",
    "0111101",
    "0100011",
    "0110001",
    "0101111",
    "0111011",
    "0110111",
    "0001011"
  ],
  G: [
    // The G type of encoding
    "0100111",
    "0110011",
    "0011011",
    "0100001",
    "0011101",
    "0111001",
    "0000101",
    "0010001",
    "0001001",
    "0010111"
  ],
  R: [
    // The R (right) type of encoding
    "1110010",
    "1100110",
    "1101100",
    "1000010",
    "1011100",
    "1001110",
    "1010000",
    "1000100",
    "1001000",
    "1110100"
  ],
  O: [
    // The O (odd) encoding for UPC-E
    "0001101",
    "0011001",
    "0010011",
    "0111101",
    "0100011",
    "0110001",
    "0101111",
    "0111011",
    "0110111",
    "0001011"
  ],
  E: [
    // The E (even) encoding for UPC-E
    "0100111",
    "0110011",
    "0011011",
    "0100001",
    "0011101",
    "0111001",
    "0000101",
    "0010001",
    "0001001",
    "0010111"
  ]
};
v.EAN2_STRUCTURE = ["LL", "LG", "GL", "GG"];
v.EAN5_STRUCTURE = ["GGLLL", "GLGLL", "GLLGL", "GLLLG", "LGGLL", "LLGGL", "LLLGG", "LGLGL", "LGLLG", "LLGLG"];
v.EAN13_STRUCTURE = ["LLLLLL", "LLGLGG", "LLGGLG", "LLGGGL", "LGLLGG", "LGGLLG", "LGGGLL", "LGLGLG", "LGLGGL", "LGGLGL"];
var V = {}, b = {};
Object.defineProperty(b, "__esModule", {
  value: !0
});
var Cn = v, Hn = function(e, r, n) {
  var a = e.split("").map(function(o, u) {
    return Cn.BINARIES[r[u]];
  }).map(function(o, u) {
    return o ? o[e[u]] : "";
  });
  if (n) {
    var i = e.length - 1;
    a = a.map(function(o, u) {
      return u < i ? o + n : o;
    });
  }
  return a.join("");
};
b.default = Hn;
Object.defineProperty(V, "__esModule", {
  value: !0
});
var Fn = function() {
  function t(e, r) {
    for (var n = 0; n < r.length; n++) {
      var a = r[n];
      a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a);
    }
  }
  return function(e, r, n) {
    return r && t(e.prototype, r), n && t(e, n), e;
  };
}(), S = v, Xn = b, ze = ht(Xn), zn = l, Un = ht(zn);
function ht(t) {
  return t && t.__esModule ? t : { default: t };
}
function qn(t, e) {
  if (!(t instanceof e))
    throw new TypeError("Cannot call a class as a function");
}
function Vn(t, e) {
  if (!t)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e && (typeof e == "object" || typeof e == "function") ? e : t;
}
function Jn(t, e) {
  if (typeof e != "function" && e !== null)
    throw new TypeError("Super expression must either be null or a function, not " + typeof e);
  t.prototype = Object.create(e && e.prototype, { constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 } }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
}
var Qn = function(t) {
  Jn(e, t);
  function e(r, n) {
    qn(this, e);
    var a = Vn(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, r, n));
    return a.fontSize = !n.flat && n.fontSize > n.width * 10 ? n.width * 10 : n.fontSize, a.guardHeight = n.height + a.fontSize / 2 + n.textMargin, a;
  }
  return Fn(e, [{
    key: "encode",
    value: function() {
      return this.options.flat ? this.encodeFlat() : this.encodeGuarded();
    }
  }, {
    key: "leftText",
    value: function(n, a) {
      return this.text.substr(n, a);
    }
  }, {
    key: "leftEncode",
    value: function(n, a) {
      return (0, ze.default)(n, a);
    }
  }, {
    key: "rightText",
    value: function(n, a) {
      return this.text.substr(n, a);
    }
  }, {
    key: "rightEncode",
    value: function(n, a) {
      return (0, ze.default)(n, a);
    }
  }, {
    key: "encodeGuarded",
    value: function() {
      var n = { fontSize: this.fontSize }, a = { height: this.guardHeight };
      return [{ data: S.SIDE_BIN, options: a }, { data: this.leftEncode(), text: this.leftText(), options: n }, { data: S.MIDDLE_BIN, options: a }, { data: this.rightEncode(), text: this.rightText(), options: n }, { data: S.SIDE_BIN, options: a }];
    }
  }, {
    key: "encodeFlat",
    value: function() {
      var n = [S.SIDE_BIN, this.leftEncode(), S.MIDDLE_BIN, this.rightEncode(), S.SIDE_BIN];
      return {
        data: n.join(""),
        text: this.text
      };
    }
  }]), e;
}(Un.default);
V.default = Qn;
Object.defineProperty(pe, "__esModule", {
  value: !0
});
var Wn = function() {
  function t(e, r) {
    for (var n = 0; n < r.length; n++) {
      var a = r[n];
      a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a);
    }
  }
  return function(e, r, n) {
    return r && t(e.prototype, r), n && t(e, n), e;
  };
}(), D = function t(e, r, n) {
  e === null && (e = Function.prototype);
  var a = Object.getOwnPropertyDescriptor(e, r);
  if (a === void 0) {
    var i = Object.getPrototypeOf(e);
    return i === null ? void 0 : t(i, r, n);
  } else {
    if ("value" in a)
      return a.value;
    var o = a.get;
    return o === void 0 ? void 0 : o.call(n);
  }
}, Yn = v, Zn = V, Kn = er(Zn);
function er(t) {
  return t && t.__esModule ? t : { default: t };
}
function tr(t, e) {
  if (!(t instanceof e))
    throw new TypeError("Cannot call a class as a function");
}
function nr(t, e) {
  if (!t)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e && (typeof e == "object" || typeof e == "function") ? e : t;
}
function rr(t, e) {
  if (typeof e != "function" && e !== null)
    throw new TypeError("Super expression must either be null or a function, not " + typeof e);
  t.prototype = Object.create(e && e.prototype, { constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 } }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
}
var Ue = function(e) {
  var r = e.substr(0, 12).split("").map(function(n) {
    return +n;
  }).reduce(function(n, a, i) {
    return i % 2 ? n + a * 3 : n + a;
  }, 0);
  return (10 - r % 10) % 10;
}, ar = function(t) {
  rr(e, t);
  function e(r, n) {
    tr(this, e), r.search(/^[0-9]{12}$/) !== -1 && (r += Ue(r));
    var a = nr(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, r, n));
    return a.lastChar = n.lastChar, a;
  }
  return Wn(e, [{
    key: "valid",
    value: function() {
      return this.data.search(/^[0-9]{13}$/) !== -1 && +this.data[12] === Ue(this.data);
    }
  }, {
    key: "leftText",
    value: function() {
      return D(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "leftText", this).call(this, 1, 6);
    }
  }, {
    key: "leftEncode",
    value: function() {
      var n = this.data.substr(1, 6), a = Yn.EAN13_STRUCTURE[this.data[0]];
      return D(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "leftEncode", this).call(this, n, a);
    }
  }, {
    key: "rightText",
    value: function() {
      return D(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "rightText", this).call(this, 7, 6);
    }
  }, {
    key: "rightEncode",
    value: function() {
      var n = this.data.substr(7, 6);
      return D(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "rightEncode", this).call(this, n, "RRRRRR");
    }
    // The "standard" way of printing EAN13 barcodes with guard bars
  }, {
    key: "encodeGuarded",
    value: function() {
      var n = D(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "encodeGuarded", this).call(this);
      return this.options.displayValue && (n.unshift({
        data: "000000000000",
        text: this.text.substr(0, 1),
        options: { textAlign: "left", fontSize: this.fontSize }
      }), this.options.lastChar && (n.push({
        data: "00"
      }), n.push({
        data: "00000",
        text: this.options.lastChar,
        options: { fontSize: this.fontSize }
      }))), n;
    }
  }]), e;
}(Kn.default);
pe.default = ar;
var ge = {};
Object.defineProperty(ge, "__esModule", {
  value: !0
});
var ir = function() {
  function t(e, r) {
    for (var n = 0; n < r.length; n++) {
      var a = r[n];
      a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a);
    }
  }
  return function(e, r, n) {
    return r && t(e.prototype, r), n && t(e, n), e;
  };
}(), H = function t(e, r, n) {
  e === null && (e = Function.prototype);
  var a = Object.getOwnPropertyDescriptor(e, r);
  if (a === void 0) {
    var i = Object.getPrototypeOf(e);
    return i === null ? void 0 : t(i, r, n);
  } else {
    if ("value" in a)
      return a.value;
    var o = a.get;
    return o === void 0 ? void 0 : o.call(n);
  }
}, or = V, ur = fr(or);
function fr(t) {
  return t && t.__esModule ? t : { default: t };
}
function cr(t, e) {
  if (!(t instanceof e))
    throw new TypeError("Cannot call a class as a function");
}
function lr(t, e) {
  if (!t)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e && (typeof e == "object" || typeof e == "function") ? e : t;
}
function hr(t, e) {
  if (typeof e != "function" && e !== null)
    throw new TypeError("Super expression must either be null or a function, not " + typeof e);
  t.prototype = Object.create(e && e.prototype, { constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 } }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
}
var qe = function(e) {
  var r = e.substr(0, 7).split("").map(function(n) {
    return +n;
  }).reduce(function(n, a, i) {
    return i % 2 ? n + a : n + a * 3;
  }, 0);
  return (10 - r % 10) % 10;
}, dr = function(t) {
  hr(e, t);
  function e(r, n) {
    return cr(this, e), r.search(/^[0-9]{7}$/) !== -1 && (r += qe(r)), lr(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, r, n));
  }
  return ir(e, [{
    key: "valid",
    value: function() {
      return this.data.search(/^[0-9]{8}$/) !== -1 && +this.data[7] === qe(this.data);
    }
  }, {
    key: "leftText",
    value: function() {
      return H(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "leftText", this).call(this, 0, 4);
    }
  }, {
    key: "leftEncode",
    value: function() {
      var n = this.data.substr(0, 4);
      return H(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "leftEncode", this).call(this, n, "LLLL");
    }
  }, {
    key: "rightText",
    value: function() {
      return H(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "rightText", this).call(this, 4, 4);
    }
  }, {
    key: "rightEncode",
    value: function() {
      var n = this.data.substr(4, 4);
      return H(e.prototype.__proto__ || Object.getPrototypeOf(e.prototype), "rightEncode", this).call(this, n, "RRRR");
    }
  }]), e;
}(ur.default);
ge.default = dr;
var Oe = {};
Object.defineProperty(Oe, "__esModule", {
  value: !0
});
var _r = function() {
  function t(e, r) {
    for (var n = 0; n < r.length; n++) {
      var a = r[n];
      a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a);
    }
  }
  return function(e, r, n) {
    return r && t(e.prototype, r), n && t(e, n), e;
  };
}(), vr = v, sr = b, yr = dt(sr), pr = l, gr = dt(pr);
function dt(t) {
  return t && t.__esModule ? t : { default: t };
}
function Or(t, e) {
  if (!(t instanceof e))
    throw new TypeError("Cannot call a class as a function");
}
function Er(t, e) {
  if (!t)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e && (typeof e == "object" || typeof e == "function") ? e : t;
}
function br(t, e) {
  if (typeof e != "function" && e !== null)
    throw new TypeError("Super expression must either be null or a function, not " + typeof e);
  t.prototype = Object.create(e && e.prototype, { constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 } }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
}
var mr = function(e) {
  var r = e.split("").map(function(n) {
    return +n;
  }).reduce(function(n, a, i) {
    return i % 2 ? n + a * 9 : n + a * 3;
  }, 0);
  return r % 10;
}, wr = function(t) {
  br(e, t);
  function e(r, n) {
    return Or(this, e), Er(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, r, n));
  }
  return _r(e, [{
    key: "valid",
    value: function() {
      return this.data.search(/^[0-9]{5}$/) !== -1;
    }
  }, {
    key: "encode",
    value: function() {
      var n = vr.EAN5_STRUCTURE[mr(this.data)];
      return {
        data: "1011" + (0, yr.default)(this.data, n, "01"),
        text: this.text
      };
    }
  }]), e;
}(gr.default);
Oe.default = wr;
var Ee = {};
Object.defineProperty(Ee, "__esModule", {
  value: !0
});
var $r = function() {
  function t(e, r) {
    for (var n = 0; n < r.length; n++) {
      var a = r[n];
      a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a);
    }
  }
  return function(e, r, n) {
    return r && t(e.prototype, r), n && t(e, n), e;
  };
}(), Sr = v, xr = b, Ar = _t(xr), Rr = l, Pr = _t(Rr);
function _t(t) {
  return t && t.__esModule ? t : { default: t };
}
function Tr(t, e) {
  if (!(t instanceof e))
    throw new TypeError("Cannot call a class as a function");
}
function Mr(t, e) {
  if (!t)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e && (typeof e == "object" || typeof e == "function") ? e : t;
}
function kr(t, e) {
  if (typeof e != "function" && e !== null)
    throw new TypeError("Super expression must either be null or a function, not " + typeof e);
  t.prototype = Object.create(e && e.prototype, { constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 } }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
}
var Ir = function(t) {
  kr(e, t);
  function e(r, n) {
    return Tr(this, e), Mr(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, r, n));
  }
  return $r(e, [{
    key: "valid",
    value: function() {
      return this.data.search(/^[0-9]{2}$/) !== -1;
    }
  }, {
    key: "encode",
    value: function() {
      var n = Sr.EAN2_STRUCTURE[parseInt(this.data) % 4];
      return {
        // Start bits + Encode the two digits with 01 in between
        data: "1011" + (0, Ar.default)(this.data, n, "01"),
        text: this.text
      };
    }
  }]), e;
}(Pr.default);
Ee.default = Ir;
var L = {};
Object.defineProperty(L, "__esModule", {
  value: !0
});
var Dr = function() {
  function t(e, r) {
    for (var n = 0; n < r.length; n++) {
      var a = r[n];
      a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a);
    }
  }
  return function(e, r, n) {
    return r && t(e.prototype, r), n && t(e, n), e;
  };
}();
L.checksum = ue;
var jr = b, x = vt(jr), Br = l, Lr = vt(Br);
function vt(t) {
  return t && t.__esModule ? t : { default: t };
}
function Nr(t, e) {
  if (!(t instanceof e))
    throw new TypeError("Cannot call a class as a function");
}
function Gr(t, e) {
  if (!t)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e && (typeof e == "object" || typeof e == "function") ? e : t;
}
function Cr(t, e) {
  if (typeof e != "function" && e !== null)
    throw new TypeError("Super expression must either be null or a function, not " + typeof e);
  t.prototype = Object.create(e && e.prototype, { constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 } }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
}
var Hr = function(t) {
  Cr(e, t);
  function e(r, n) {
    Nr(this, e), r.search(/^[0-9]{11}$/) !== -1 && (r += ue(r));
    var a = Gr(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, r, n));
    return a.displayValue = n.displayValue, n.fontSize > n.width * 10 ? a.fontSize = n.width * 10 : a.fontSize = n.fontSize, a.guardHeight = n.height + a.fontSize / 2 + n.textMargin, a;
  }
  return Dr(e, [{
    key: "valid",
    value: function() {
      return this.data.search(/^[0-9]{12}$/) !== -1 && this.data[11] == ue(this.data);
    }
  }, {
    key: "encode",
    value: function() {
      return this.options.flat ? this.flatEncoding() : this.guardedEncoding();
    }
  }, {
    key: "flatEncoding",
    value: function() {
      var n = "";
      return n += "101", n += (0, x.default)(this.data.substr(0, 6), "LLLLLL"), n += "01010", n += (0, x.default)(this.data.substr(6, 6), "RRRRRR"), n += "101", {
        data: n,
        text: this.text
      };
    }
  }, {
    key: "guardedEncoding",
    value: function() {
      var n = [];
      return this.displayValue && n.push({
        data: "00000000",
        text: this.text.substr(0, 1),
        options: { textAlign: "left", fontSize: this.fontSize }
      }), n.push({
        data: "101" + (0, x.default)(this.data[0], "L"),
        options: { height: this.guardHeight }
      }), n.push({
        data: (0, x.default)(this.data.substr(1, 5), "LLLLL"),
        text: this.text.substr(1, 5),
        options: { fontSize: this.fontSize }
      }), n.push({
        data: "01010",
        options: { height: this.guardHeight }
      }), n.push({
        data: (0, x.default)(this.data.substr(6, 5), "RRRRR"),
        text: this.text.substr(6, 5),
        options: { fontSize: this.fontSize }
      }), n.push({
        data: (0, x.default)(this.data[11], "R") + "101",
        options: { height: this.guardHeight }
      }), this.displayValue && n.push({
        data: "00000000",
        text: this.text.substr(11, 1),
        options: { textAlign: "right", fontSize: this.fontSize }
      }), n;
    }
  }]), e;
}(Lr.default);
function ue(t) {
  var e = 0, r;
  for (r = 1; r < 11; r += 2)
    e += parseInt(t[r]);
  for (r = 0; r < 11; r += 2)
    e += parseInt(t[r]) * 3;
  return (10 - e % 10) % 10;
}
L.default = Hr;
var be = {};
Object.defineProperty(be, "__esModule", {
  value: !0
});
var Fr = function() {
  function t(e, r) {
    for (var n = 0; n < r.length; n++) {
      var a = r[n];
      a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a);
    }
  }
  return function(e, r, n) {
    return r && t(e.prototype, r), n && t(e, n), e;
  };
}(), Xr = b, zr = st(Xr), Ur = l, qr = st(Ur), Vr = L;
function st(t) {
  return t && t.__esModule ? t : { default: t };
}
function Jr(t, e) {
  if (!(t instanceof e))
    throw new TypeError("Cannot call a class as a function");
}
function ae(t, e) {
  if (!t)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e && (typeof e == "object" || typeof e == "function") ? e : t;
}
function Qr(t, e) {
  if (typeof e != "function" && e !== null)
    throw new TypeError("Super expression must either be null or a function, not " + typeof e);
  t.prototype = Object.create(e && e.prototype, { constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 } }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
}
var Wr = ["XX00000XXX", "XX10000XXX", "XX20000XXX", "XXX00000XX", "XXXX00000X", "XXXXX00005", "XXXXX00006", "XXXXX00007", "XXXXX00008", "XXXXX00009"], Yr = [["EEEOOO", "OOOEEE"], ["EEOEOO", "OOEOEE"], ["EEOOEO", "OOEEOE"], ["EEOOOE", "OOEEEO"], ["EOEEOO", "OEOOEE"], ["EOOEEO", "OEEOOE"], ["EOOOEE", "OEEEOO"], ["EOEOEO", "OEOEOE"], ["EOEOOE", "OEOEEO"], ["EOOEOE", "OEEOEO"]], Zr = function(t) {
  Qr(e, t);
  function e(r, n) {
    Jr(this, e);
    var a = ae(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, r, n));
    if (a.isValid = !1, r.search(/^[0-9]{6}$/) !== -1)
      a.middleDigits = r, a.upcA = Ve(r, "0"), a.text = n.text || "" + a.upcA[0] + r + a.upcA[a.upcA.length - 1], a.isValid = !0;
    else if (r.search(/^[01][0-9]{7}$/) !== -1)
      if (a.middleDigits = r.substring(1, r.length - 1), a.upcA = Ve(a.middleDigits, r[0]), a.upcA[a.upcA.length - 1] === r[r.length - 1])
        a.isValid = !0;
      else
        return ae(a);
    else
      return ae(a);
    return a.displayValue = n.displayValue, n.fontSize > n.width * 10 ? a.fontSize = n.width * 10 : a.fontSize = n.fontSize, a.guardHeight = n.height + a.fontSize / 2 + n.textMargin, a;
  }
  return Fr(e, [{
    key: "valid",
    value: function() {
      return this.isValid;
    }
  }, {
    key: "encode",
    value: function() {
      return this.options.flat ? this.flatEncoding() : this.guardedEncoding();
    }
  }, {
    key: "flatEncoding",
    value: function() {
      var n = "";
      return n += "101", n += this.encodeMiddleDigits(), n += "010101", {
        data: n,
        text: this.text
      };
    }
  }, {
    key: "guardedEncoding",
    value: function() {
      var n = [];
      return this.displayValue && n.push({
        data: "00000000",
        text: this.text[0],
        options: { textAlign: "left", fontSize: this.fontSize }
      }), n.push({
        data: "101",
        options: { height: this.guardHeight }
      }), n.push({
        data: this.encodeMiddleDigits(),
        text: this.text.substring(1, 7),
        options: { fontSize: this.fontSize }
      }), n.push({
        data: "010101",
        options: { height: this.guardHeight }
      }), this.displayValue && n.push({
        data: "00000000",
        text: this.text[7],
        options: { textAlign: "right", fontSize: this.fontSize }
      }), n;
    }
  }, {
    key: "encodeMiddleDigits",
    value: function() {
      var n = this.upcA[0], a = this.upcA[this.upcA.length - 1], i = Yr[parseInt(a)][parseInt(n)];
      return (0, zr.default)(this.middleDigits, i);
    }
  }]), e;
}(qr.default);
function Ve(t, e) {
  for (var r = parseInt(t[t.length - 1]), n = Wr[r], a = "", i = 0, o = 0; o < n.length; o++) {
    var u = n[o];
    u === "X" ? a += t[i++] : a += u;
  }
  return a = "" + e + a, "" + a + (0, Vr.checksum)(a);
}
be.default = Zr;
Object.defineProperty(c, "__esModule", {
  value: !0
});
c.UPCE = c.UPC = c.EAN2 = c.EAN5 = c.EAN8 = c.EAN13 = void 0;
var Kr = pe, ea = T(Kr), ta = ge, na = T(ta), ra = Oe, aa = T(ra), ia = Ee, oa = T(ia), ua = L, fa = T(ua), ca = be, la = T(ca);
function T(t) {
  return t && t.__esModule ? t : { default: t };
}
c.EAN13 = ea.default;
c.EAN8 = na.default;
c.EAN5 = aa.default;
c.EAN2 = oa.default;
c.UPC = fa.default;
c.UPCE = la.default;
var R = {}, J = {}, N = {};
Object.defineProperty(N, "__esModule", {
  value: !0
});
N.START_BIN = "1010";
N.END_BIN = "11101";
N.BINARIES = ["00110", "10001", "01001", "11000", "00101", "10100", "01100", "00011", "10010", "01010"];
Object.defineProperty(J, "__esModule", {
  value: !0
});
var ha = function() {
  function t(e, r) {
    for (var n = 0; n < r.length; n++) {
      var a = r[n];
      a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a);
    }
  }
  return function(e, r, n) {
    return r && t(e.prototype, r), n && t(e, n), e;
  };
}(), F = N, da = l, _a = va(da);
function va(t) {
  return t && t.__esModule ? t : { default: t };
}
function sa(t, e) {
  if (!(t instanceof e))
    throw new TypeError("Cannot call a class as a function");
}
function ya(t, e) {
  if (!t)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e && (typeof e == "object" || typeof e == "function") ? e : t;
}
function pa(t, e) {
  if (typeof e != "function" && e !== null)
    throw new TypeError("Super expression must either be null or a function, not " + typeof e);
  t.prototype = Object.create(e && e.prototype, { constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 } }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
}
var ga = function(t) {
  pa(e, t);
  function e() {
    return sa(this, e), ya(this, (e.__proto__ || Object.getPrototypeOf(e)).apply(this, arguments));
  }
  return ha(e, [{
    key: "valid",
    value: function() {
      return this.data.search(/^([0-9]{2})+$/) !== -1;
    }
  }, {
    key: "encode",
    value: function() {
      var n = this, a = this.data.match(/.{2}/g).map(function(i) {
        return n.encodePair(i);
      }).join("");
      return {
        data: F.START_BIN + a + F.END_BIN,
        text: this.text
      };
    }
    // Calculate the data of a number pair
  }, {
    key: "encodePair",
    value: function(n) {
      var a = F.BINARIES[n[1]];
      return F.BINARIES[n[0]].split("").map(function(i, o) {
        return (i === "1" ? "111" : "1") + (a[o] === "1" ? "000" : "0");
      }).join("");
    }
  }]), e;
}(_a.default);
J.default = ga;
var me = {};
Object.defineProperty(me, "__esModule", {
  value: !0
});
var Oa = function() {
  function t(e, r) {
    for (var n = 0; n < r.length; n++) {
      var a = r[n];
      a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a);
    }
  }
  return function(e, r, n) {
    return r && t(e.prototype, r), n && t(e, n), e;
  };
}(), Ea = J, ba = ma(Ea);
function ma(t) {
  return t && t.__esModule ? t : { default: t };
}
function wa(t, e) {
  if (!(t instanceof e))
    throw new TypeError("Cannot call a class as a function");
}
function $a(t, e) {
  if (!t)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e && (typeof e == "object" || typeof e == "function") ? e : t;
}
function Sa(t, e) {
  if (typeof e != "function" && e !== null)
    throw new TypeError("Super expression must either be null or a function, not " + typeof e);
  t.prototype = Object.create(e && e.prototype, { constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 } }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
}
var Je = function(e) {
  var r = e.substr(0, 13).split("").map(function(n) {
    return parseInt(n, 10);
  }).reduce(function(n, a, i) {
    return n + a * (3 - i % 2 * 2);
  }, 0);
  return Math.ceil(r / 10) * 10 - r;
}, xa = function(t) {
  Sa(e, t);
  function e(r, n) {
    return wa(this, e), r.search(/^[0-9]{13}$/) !== -1 && (r += Je(r)), $a(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, r, n));
  }
  return Oa(e, [{
    key: "valid",
    value: function() {
      return this.data.search(/^[0-9]{14}$/) !== -1 && +this.data[13] === Je(this.data);
    }
  }]), e;
}(ba.default);
me.default = xa;
Object.defineProperty(R, "__esModule", {
  value: !0
});
R.ITF14 = R.ITF = void 0;
var Aa = J, Ra = yt(Aa), Pa = me, Ta = yt(Pa);
function yt(t) {
  return t && t.__esModule ? t : { default: t };
}
R.ITF = Ra.default;
R.ITF14 = Ta.default;
var _ = {}, m = {};
Object.defineProperty(m, "__esModule", {
  value: !0
});
var Ma = function() {
  function t(e, r) {
    for (var n = 0; n < r.length; n++) {
      var a = r[n];
      a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a);
    }
  }
  return function(e, r, n) {
    return r && t(e.prototype, r), n && t(e, n), e;
  };
}(), ka = l, Ia = Da(ka);
function Da(t) {
  return t && t.__esModule ? t : { default: t };
}
function ja(t, e) {
  if (!(t instanceof e))
    throw new TypeError("Cannot call a class as a function");
}
function Ba(t, e) {
  if (!t)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e && (typeof e == "object" || typeof e == "function") ? e : t;
}
function La(t, e) {
  if (typeof e != "function" && e !== null)
    throw new TypeError("Super expression must either be null or a function, not " + typeof e);
  t.prototype = Object.create(e && e.prototype, { constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 } }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
}
var Na = function(t) {
  La(e, t);
  function e(r, n) {
    return ja(this, e), Ba(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, r, n));
  }
  return Ma(e, [{
    key: "encode",
    value: function() {
      for (var n = "110", a = 0; a < this.data.length; a++) {
        var i = parseInt(this.data[a]), o = i.toString(2);
        o = Ga(o, 4 - o.length);
        for (var u = 0; u < o.length; u++)
          n += o[u] == "0" ? "100" : "110";
      }
      return n += "1001", {
        data: n,
        text: this.text
      };
    }
  }, {
    key: "valid",
    value: function() {
      return this.data.search(/^[0-9]+$/) !== -1;
    }
  }]), e;
}(Ia.default);
function Ga(t, e) {
  for (var r = 0; r < e; r++)
    t = "0" + t;
  return t;
}
m.default = Na;
var we = {}, w = {};
Object.defineProperty(w, "__esModule", {
  value: !0
});
w.mod10 = Ca;
w.mod11 = Ha;
function Ca(t) {
  for (var e = 0, r = 0; r < t.length; r++) {
    var n = parseInt(t[r]);
    (r + t.length) % 2 === 0 ? e += n : e += n * 2 % 10 + Math.floor(n * 2 / 10);
  }
  return (10 - e % 10) % 10;
}
function Ha(t) {
  for (var e = 0, r = [2, 3, 4, 5, 6, 7], n = 0; n < t.length; n++) {
    var a = parseInt(t[t.length - 1 - n]);
    e += r[n % r.length] * a;
  }
  return (11 - e % 11) % 11;
}
Object.defineProperty(we, "__esModule", {
  value: !0
});
var Fa = m, Xa = Ua(Fa), za = w;
function Ua(t) {
  return t && t.__esModule ? t : { default: t };
}
function qa(t, e) {
  if (!(t instanceof e))
    throw new TypeError("Cannot call a class as a function");
}
function Va(t, e) {
  if (!t)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e && (typeof e == "object" || typeof e == "function") ? e : t;
}
function Ja(t, e) {
  if (typeof e != "function" && e !== null)
    throw new TypeError("Super expression must either be null or a function, not " + typeof e);
  t.prototype = Object.create(e && e.prototype, { constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 } }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
}
var Qa = function(t) {
  Ja(e, t);
  function e(r, n) {
    return qa(this, e), Va(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, r + (0, za.mod10)(r), n));
  }
  return e;
}(Xa.default);
we.default = Qa;
var $e = {};
Object.defineProperty($e, "__esModule", {
  value: !0
});
var Wa = m, Ya = Ka(Wa), Za = w;
function Ka(t) {
  return t && t.__esModule ? t : { default: t };
}
function ei(t, e) {
  if (!(t instanceof e))
    throw new TypeError("Cannot call a class as a function");
}
function ti(t, e) {
  if (!t)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e && (typeof e == "object" || typeof e == "function") ? e : t;
}
function ni(t, e) {
  if (typeof e != "function" && e !== null)
    throw new TypeError("Super expression must either be null or a function, not " + typeof e);
  t.prototype = Object.create(e && e.prototype, { constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 } }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
}
var ri = function(t) {
  ni(e, t);
  function e(r, n) {
    return ei(this, e), ti(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, r + (0, Za.mod11)(r), n));
  }
  return e;
}(Ya.default);
$e.default = ri;
var Se = {};
Object.defineProperty(Se, "__esModule", {
  value: !0
});
var ai = m, ii = oi(ai), Qe = w;
function oi(t) {
  return t && t.__esModule ? t : { default: t };
}
function ui(t, e) {
  if (!(t instanceof e))
    throw new TypeError("Cannot call a class as a function");
}
function fi(t, e) {
  if (!t)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e && (typeof e == "object" || typeof e == "function") ? e : t;
}
function ci(t, e) {
  if (typeof e != "function" && e !== null)
    throw new TypeError("Super expression must either be null or a function, not " + typeof e);
  t.prototype = Object.create(e && e.prototype, { constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 } }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
}
var li = function(t) {
  ci(e, t);
  function e(r, n) {
    return ui(this, e), r += (0, Qe.mod10)(r), r += (0, Qe.mod10)(r), fi(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, r, n));
  }
  return e;
}(ii.default);
Se.default = li;
var xe = {};
Object.defineProperty(xe, "__esModule", {
  value: !0
});
var hi = m, di = _i(hi), We = w;
function _i(t) {
  return t && t.__esModule ? t : { default: t };
}
function vi(t, e) {
  if (!(t instanceof e))
    throw new TypeError("Cannot call a class as a function");
}
function si(t, e) {
  if (!t)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e && (typeof e == "object" || typeof e == "function") ? e : t;
}
function yi(t, e) {
  if (typeof e != "function" && e !== null)
    throw new TypeError("Super expression must either be null or a function, not " + typeof e);
  t.prototype = Object.create(e && e.prototype, { constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 } }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
}
var pi = function(t) {
  yi(e, t);
  function e(r, n) {
    return vi(this, e), r += (0, We.mod11)(r), r += (0, We.mod10)(r), si(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, r, n));
  }
  return e;
}(di.default);
xe.default = pi;
Object.defineProperty(_, "__esModule", {
  value: !0
});
_.MSI1110 = _.MSI1010 = _.MSI11 = _.MSI10 = _.MSI = void 0;
var gi = m, Oi = G(gi), Ei = we, bi = G(Ei), mi = $e, wi = G(mi), $i = Se, Si = G($i), xi = xe, Ai = G(xi);
function G(t) {
  return t && t.__esModule ? t : { default: t };
}
_.MSI = Oi.default;
_.MSI10 = bi.default;
_.MSI11 = wi.default;
_.MSI1010 = Si.default;
_.MSI1110 = Ai.default;
var Q = {};
Object.defineProperty(Q, "__esModule", {
  value: !0
});
Q.pharmacode = void 0;
var Ri = function() {
  function t(e, r) {
    for (var n = 0; n < r.length; n++) {
      var a = r[n];
      a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a);
    }
  }
  return function(e, r, n) {
    return r && t(e.prototype, r), n && t(e, n), e;
  };
}(), Pi = l, Ti = Mi(Pi);
function Mi(t) {
  return t && t.__esModule ? t : { default: t };
}
function ki(t, e) {
  if (!(t instanceof e))
    throw new TypeError("Cannot call a class as a function");
}
function Ii(t, e) {
  if (!t)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e && (typeof e == "object" || typeof e == "function") ? e : t;
}
function Di(t, e) {
  if (typeof e != "function" && e !== null)
    throw new TypeError("Super expression must either be null or a function, not " + typeof e);
  t.prototype = Object.create(e && e.prototype, { constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 } }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
}
var ji = function(t) {
  Di(e, t);
  function e(r, n) {
    ki(this, e);
    var a = Ii(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, r, n));
    return a.number = parseInt(r, 10), a;
  }
  return Ri(e, [{
    key: "encode",
    value: function() {
      for (var n = this.number, a = ""; !isNaN(n) && n != 0; )
        n % 2 === 0 ? (a = "11100" + a, n = (n - 2) / 2) : (a = "100" + a, n = (n - 1) / 2);
      return a = a.slice(0, -2), {
        data: a,
        text: this.text
      };
    }
  }, {
    key: "valid",
    value: function() {
      return this.number >= 3 && this.number <= 131070;
    }
  }]), e;
}(Ti.default);
Q.pharmacode = ji;
var W = {};
Object.defineProperty(W, "__esModule", {
  value: !0
});
W.codabar = void 0;
var Bi = function() {
  function t(e, r) {
    for (var n = 0; n < r.length; n++) {
      var a = r[n];
      a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a);
    }
  }
  return function(e, r, n) {
    return r && t(e.prototype, r), n && t(e, n), e;
  };
}(), Li = l, Ni = Gi(Li);
function Gi(t) {
  return t && t.__esModule ? t : { default: t };
}
function Ci(t, e) {
  if (!(t instanceof e))
    throw new TypeError("Cannot call a class as a function");
}
function Hi(t, e) {
  if (!t)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e && (typeof e == "object" || typeof e == "function") ? e : t;
}
function Fi(t, e) {
  if (typeof e != "function" && e !== null)
    throw new TypeError("Super expression must either be null or a function, not " + typeof e);
  t.prototype = Object.create(e && e.prototype, { constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 } }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
}
var Xi = function(t) {
  Fi(e, t);
  function e(r, n) {
    Ci(this, e), r.search(/^[0-9\-\$\:\.\+\/]+$/) === 0 && (r = "A" + r + "A");
    var a = Hi(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, r.toUpperCase(), n));
    return a.text = a.options.text || a.text.replace(/[A-D]/g, ""), a;
  }
  return Bi(e, [{
    key: "valid",
    value: function() {
      return this.data.search(/^[A-D][0-9\-\$\:\.\+\/]+[A-D]$/) !== -1;
    }
  }, {
    key: "encode",
    value: function() {
      for (var n = [], a = this.getEncodings(), i = 0; i < this.data.length; i++)
        n.push(a[this.data.charAt(i)]), i !== this.data.length - 1 && n.push("0");
      return {
        text: this.text,
        data: n.join("")
      };
    }
  }, {
    key: "getEncodings",
    value: function() {
      return {
        0: "101010011",
        1: "101011001",
        2: "101001011",
        3: "110010101",
        4: "101101001",
        5: "110101001",
        6: "100101011",
        7: "100101101",
        8: "100110101",
        9: "110100101",
        "-": "101001101",
        $: "101100101",
        ":": "1101011011",
        "/": "1101101011",
        ".": "1101101101",
        "+": "1011011011",
        A: "1011001001",
        B: "1001001011",
        C: "1010010011",
        D: "1010011001"
      };
    }
  }]), e;
}(Ni.default);
W.codabar = Xi;
var Y = {};
Object.defineProperty(Y, "__esModule", {
  value: !0
});
Y.GenericBarcode = void 0;
var zi = function() {
  function t(e, r) {
    for (var n = 0; n < r.length; n++) {
      var a = r[n];
      a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a);
    }
  }
  return function(e, r, n) {
    return r && t(e.prototype, r), n && t(e, n), e;
  };
}(), Ui = l, qi = Vi(Ui);
function Vi(t) {
  return t && t.__esModule ? t : { default: t };
}
function Ji(t, e) {
  if (!(t instanceof e))
    throw new TypeError("Cannot call a class as a function");
}
function Qi(t, e) {
  if (!t)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e && (typeof e == "object" || typeof e == "function") ? e : t;
}
function Wi(t, e) {
  if (typeof e != "function" && e !== null)
    throw new TypeError("Super expression must either be null or a function, not " + typeof e);
  t.prototype = Object.create(e && e.prototype, { constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 } }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
}
var Yi = function(t) {
  Wi(e, t);
  function e(r, n) {
    return Ji(this, e), Qi(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this, r, n));
  }
  return zi(e, [{
    key: "encode",
    value: function() {
      return {
        data: "10101010101010101010101010101010101010101",
        text: this.text
      };
    }
    // Resturn true/false if the string provided is valid for this encoder
  }, {
    key: "valid",
    value: function() {
      return !0;
    }
  }]), e;
}(qi.default);
Y.GenericBarcode = Yi;
Object.defineProperty(le, "__esModule", {
  value: !0
});
var Zi = U, X = s, A = c, Ye = R, j = _, Ki = Q, eo = W, to = Y;
le.default = {
  CODE39: Zi.CODE39,
  CODE128: X.CODE128,
  CODE128A: X.CODE128A,
  CODE128B: X.CODE128B,
  CODE128C: X.CODE128C,
  EAN13: A.EAN13,
  EAN8: A.EAN8,
  EAN5: A.EAN5,
  EAN2: A.EAN2,
  UPC: A.UPC,
  UPCE: A.UPCE,
  ITF14: Ye.ITF14,
  ITF: Ye.ITF,
  MSI: j.MSI,
  MSI10: j.MSI10,
  MSI11: j.MSI11,
  MSI1010: j.MSI1010,
  MSI1110: j.MSI1110,
  pharmacode: Ki.pharmacode,
  codabar: eo.codabar,
  GenericBarcode: to.GenericBarcode
};
var M = {};
Object.defineProperty(M, "__esModule", {
  value: !0
});
var no = Object.assign || function(t) {
  for (var e = 1; e < arguments.length; e++) {
    var r = arguments[e];
    for (var n in r)
      Object.prototype.hasOwnProperty.call(r, n) && (t[n] = r[n]);
  }
  return t;
};
M.default = function(t, e) {
  return no({}, t, e);
};
var Ae = {};
Object.defineProperty(Ae, "__esModule", {
  value: !0
});
Ae.default = ro;
function ro(t) {
  var e = [];
  function r(n) {
    if (Array.isArray(n))
      for (var a = 0; a < n.length; a++)
        r(n[a]);
    else
      n.text = n.text || "", n.data = n.data || "", e.push(n);
  }
  return r(t), e;
}
var Re = {};
Object.defineProperty(Re, "__esModule", {
  value: !0
});
Re.default = ao;
function ao(t) {
  return t.marginTop = t.marginTop || t.margin, t.marginBottom = t.marginBottom || t.margin, t.marginRight = t.marginRight || t.margin, t.marginLeft = t.marginLeft || t.margin, t;
}
var Pe = {}, Te = {}, Z = {};
Object.defineProperty(Z, "__esModule", {
  value: !0
});
Z.default = io;
function io(t) {
  var e = ["width", "height", "textMargin", "fontSize", "margin", "marginTop", "marginBottom", "marginLeft", "marginRight"];
  for (var r in e)
    e.hasOwnProperty(r) && (r = e[r], typeof t[r] == "string" && (t[r] = parseInt(t[r], 10)));
  return typeof t.displayValue == "string" && (t.displayValue = t.displayValue != "false"), t;
}
var K = {};
Object.defineProperty(K, "__esModule", {
  value: !0
});
var oo = {
  width: 2,
  height: 100,
  format: "auto",
  displayValue: !0,
  fontOptions: "",
  font: "monospace",
  text: void 0,
  textAlign: "center",
  textPosition: "bottom",
  textMargin: 2,
  fontSize: 20,
  background: "#ffffff",
  lineColor: "#000000",
  margin: 10,
  marginTop: void 0,
  marginBottom: void 0,
  marginLeft: void 0,
  marginRight: void 0,
  valid: function() {
  }
};
K.default = oo;
Object.defineProperty(Te, "__esModule", {
  value: !0
});
var uo = Z, fo = pt(uo), co = K, Ze = pt(co);
function pt(t) {
  return t && t.__esModule ? t : { default: t };
}
function lo(t) {
  var e = {};
  for (var r in Ze.default)
    Ze.default.hasOwnProperty(r) && (t.hasAttribute("jsbarcode-" + r.toLowerCase()) && (e[r] = t.getAttribute("jsbarcode-" + r.toLowerCase())), t.hasAttribute("data-" + r.toLowerCase()) && (e[r] = t.getAttribute("data-" + r.toLowerCase())));
  return e.value = t.getAttribute("jsbarcode-value") || t.getAttribute("data-value"), e = (0, fo.default)(e), e;
}
Te.default = lo;
var Me = {}, ke = {}, d = {};
Object.defineProperty(d, "__esModule", {
  value: !0
});
d.getTotalWidthOfEncodings = d.calculateEncodingAttributes = d.getBarcodePadding = d.getEncodingHeight = d.getMaximumHeightOfEncodings = void 0;
var ho = M, _o = vo(ho);
function vo(t) {
  return t && t.__esModule ? t : { default: t };
}
function gt(t, e) {
  return e.height + (e.displayValue && t.text.length > 0 ? e.fontSize + e.textMargin : 0) + e.marginTop + e.marginBottom;
}
function Ot(t, e, r) {
  if (r.displayValue && e < t) {
    if (r.textAlign == "center")
      return Math.floor((t - e) / 2);
    if (r.textAlign == "left")
      return 0;
    if (r.textAlign == "right")
      return Math.floor(t - e);
  }
  return 0;
}
function so(t, e, r) {
  for (var n = 0; n < t.length; n++) {
    var a = t[n], i = (0, _o.default)(e, a.options), o;
    i.displayValue ? o = go(a.text, i, r) : o = 0;
    var u = a.data.length * i.width;
    a.width = Math.ceil(Math.max(o, u)), a.height = gt(a, i), a.barcodePadding = Ot(o, u, i);
  }
}
function yo(t) {
  for (var e = 0, r = 0; r < t.length; r++)
    e += t[r].width;
  return e;
}
function po(t) {
  for (var e = 0, r = 0; r < t.length; r++)
    t[r].height > e && (e = t[r].height);
  return e;
}
function go(t, e, r) {
  var n;
  if (r)
    n = r;
  else if (typeof document < "u")
    n = document.createElement("canvas").getContext("2d");
  else
    return 0;
  n.font = e.fontOptions + " " + e.fontSize + "px " + e.font;
  var a = n.measureText(t);
  if (!a)
    return 0;
  var i = a.width;
  return i;
}
d.getMaximumHeightOfEncodings = po;
d.getEncodingHeight = gt;
d.getBarcodePadding = Ot;
d.calculateEncodingAttributes = so;
d.getTotalWidthOfEncodings = yo;
Object.defineProperty(ke, "__esModule", {
  value: !0
});
var Oo = function() {
  function t(e, r) {
    for (var n = 0; n < r.length; n++) {
      var a = r[n];
      a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a);
    }
  }
  return function(e, r, n) {
    return r && t(e.prototype, r), n && t(e, n), e;
  };
}(), Eo = M, bo = mo(Eo), ie = d;
function mo(t) {
  return t && t.__esModule ? t : { default: t };
}
function wo(t, e) {
  if (!(t instanceof e))
    throw new TypeError("Cannot call a class as a function");
}
var $o = function() {
  function t(e, r, n) {
    wo(this, t), this.canvas = e, this.encodings = r, this.options = n;
  }
  return Oo(t, [{
    key: "render",
    value: function() {
      if (!this.canvas.getContext)
        throw new Error("The browser does not support canvas.");
      this.prepareCanvas();
      for (var r = 0; r < this.encodings.length; r++) {
        var n = (0, bo.default)(this.options, this.encodings[r].options);
        this.drawCanvasBarcode(n, this.encodings[r]), this.drawCanvasText(n, this.encodings[r]), this.moveCanvasDrawing(this.encodings[r]);
      }
      this.restoreCanvas();
    }
  }, {
    key: "prepareCanvas",
    value: function() {
      var r = this.canvas.getContext("2d");
      r.save(), (0, ie.calculateEncodingAttributes)(this.encodings, this.options, r);
      var n = (0, ie.getTotalWidthOfEncodings)(this.encodings), a = (0, ie.getMaximumHeightOfEncodings)(this.encodings);
      this.canvas.width = n + this.options.marginLeft + this.options.marginRight, this.canvas.height = a, r.clearRect(0, 0, this.canvas.width, this.canvas.height), this.options.background && (r.fillStyle = this.options.background, r.fillRect(0, 0, this.canvas.width, this.canvas.height)), r.translate(this.options.marginLeft, 0);
    }
  }, {
    key: "drawCanvasBarcode",
    value: function(r, n) {
      var a = this.canvas.getContext("2d"), i = n.data, o;
      r.textPosition == "top" ? o = r.marginTop + r.fontSize + r.textMargin : o = r.marginTop, a.fillStyle = r.lineColor;
      for (var u = 0; u < i.length; u++) {
        var y = u * r.width + n.barcodePadding;
        i[u] === "1" ? a.fillRect(y, o, r.width, r.height) : i[u] && a.fillRect(y, o, r.width, r.height * i[u]);
      }
    }
  }, {
    key: "drawCanvasText",
    value: function(r, n) {
      var a = this.canvas.getContext("2d"), i = r.fontOptions + " " + r.fontSize + "px " + r.font;
      if (r.displayValue) {
        var o, u;
        r.textPosition == "top" ? u = r.marginTop + r.fontSize - r.textMargin : u = r.height + r.textMargin + r.marginTop + r.fontSize, a.font = i, r.textAlign == "left" || n.barcodePadding > 0 ? (o = 0, a.textAlign = "left") : r.textAlign == "right" ? (o = n.width - 1, a.textAlign = "right") : (o = n.width / 2, a.textAlign = "center"), a.fillText(n.text, o, u);
      }
    }
  }, {
    key: "moveCanvasDrawing",
    value: function(r) {
      var n = this.canvas.getContext("2d");
      n.translate(r.width, 0);
    }
  }, {
    key: "restoreCanvas",
    value: function() {
      var r = this.canvas.getContext("2d");
      r.restore();
    }
  }]), t;
}();
ke.default = $o;
var Ie = {};
Object.defineProperty(Ie, "__esModule", {
  value: !0
});
var So = function() {
  function t(e, r) {
    for (var n = 0; n < r.length; n++) {
      var a = r[n];
      a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a);
    }
  }
  return function(e, r, n) {
    return r && t(e.prototype, r), n && t(e, n), e;
  };
}(), xo = M, Ao = Ro(xo), oe = d;
function Ro(t) {
  return t && t.__esModule ? t : { default: t };
}
function Po(t, e) {
  if (!(t instanceof e))
    throw new TypeError("Cannot call a class as a function");
}
var z = "http://www.w3.org/2000/svg", To = function() {
  function t(e, r, n) {
    Po(this, t), this.svg = e, this.encodings = r, this.options = n, this.document = n.xmlDocument || document;
  }
  return So(t, [{
    key: "render",
    value: function() {
      var r = this.options.marginLeft;
      this.prepareSVG();
      for (var n = 0; n < this.encodings.length; n++) {
        var a = this.encodings[n], i = (0, Ao.default)(this.options, a.options), o = this.createGroup(r, i.marginTop, this.svg);
        this.setGroupOptions(o, i), this.drawSvgBarcode(o, i, a), this.drawSVGText(o, i, a), r += a.width;
      }
    }
  }, {
    key: "prepareSVG",
    value: function() {
      for (; this.svg.firstChild; )
        this.svg.removeChild(this.svg.firstChild);
      (0, oe.calculateEncodingAttributes)(this.encodings, this.options);
      var r = (0, oe.getTotalWidthOfEncodings)(this.encodings), n = (0, oe.getMaximumHeightOfEncodings)(this.encodings), a = r + this.options.marginLeft + this.options.marginRight;
      this.setSvgAttributes(a, n), this.options.background && this.drawRect(0, 0, a, n, this.svg).setAttribute("style", "fill:" + this.options.background + ";");
    }
  }, {
    key: "drawSvgBarcode",
    value: function(r, n, a) {
      var i = a.data, o;
      n.textPosition == "top" ? o = n.fontSize + n.textMargin : o = 0;
      for (var u = 0, y = 0, $ = 0; $ < i.length; $++)
        y = $ * n.width + a.barcodePadding, i[$] === "1" ? u++ : u > 0 && (this.drawRect(y - n.width * u, o, n.width * u, n.height, r), u = 0);
      u > 0 && this.drawRect(y - n.width * (u - 1), o, n.width * u, n.height, r);
    }
  }, {
    key: "drawSVGText",
    value: function(r, n, a) {
      var i = this.document.createElementNS(z, "text");
      if (n.displayValue) {
        var o, u;
        i.setAttribute("style", "font:" + n.fontOptions + " " + n.fontSize + "px " + n.font), n.textPosition == "top" ? u = n.fontSize - n.textMargin : u = n.height + n.textMargin + n.fontSize, n.textAlign == "left" || a.barcodePadding > 0 ? (o = 0, i.setAttribute("text-anchor", "start")) : n.textAlign == "right" ? (o = a.width - 1, i.setAttribute("text-anchor", "end")) : (o = a.width / 2, i.setAttribute("text-anchor", "middle")), i.setAttribute("x", o), i.setAttribute("y", u), i.appendChild(this.document.createTextNode(a.text)), r.appendChild(i);
      }
    }
  }, {
    key: "setSvgAttributes",
    value: function(r, n) {
      var a = this.svg;
      a.setAttribute("width", r + "px"), a.setAttribute("height", n + "px"), a.setAttribute("x", "0px"), a.setAttribute("y", "0px"), a.setAttribute("viewBox", "0 0 " + r + " " + n), a.setAttribute("xmlns", z), a.setAttribute("version", "1.1"), a.setAttribute("style", "transform: translate(0,0)");
    }
  }, {
    key: "createGroup",
    value: function(r, n, a) {
      var i = this.document.createElementNS(z, "g");
      return i.setAttribute("transform", "translate(" + r + ", " + n + ")"), a.appendChild(i), i;
    }
  }, {
    key: "setGroupOptions",
    value: function(r, n) {
      r.setAttribute("style", "fill:" + n.lineColor + ";");
    }
  }, {
    key: "drawRect",
    value: function(r, n, a, i, o) {
      var u = this.document.createElementNS(z, "rect");
      return u.setAttribute("x", r), u.setAttribute("y", n), u.setAttribute("width", a), u.setAttribute("height", i), o.appendChild(u), u;
    }
  }]), t;
}();
Ie.default = To;
var De = {};
Object.defineProperty(De, "__esModule", {
  value: !0
});
var Mo = function() {
  function t(e, r) {
    for (var n = 0; n < r.length; n++) {
      var a = r[n];
      a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a);
    }
  }
  return function(e, r, n) {
    return r && t(e.prototype, r), n && t(e, n), e;
  };
}();
function ko(t, e) {
  if (!(t instanceof e))
    throw new TypeError("Cannot call a class as a function");
}
var Io = function() {
  function t(e, r, n) {
    ko(this, t), this.object = e, this.encodings = r, this.options = n;
  }
  return Mo(t, [{
    key: "render",
    value: function() {
      this.object.encodings = this.encodings;
    }
  }]), t;
}();
De.default = Io;
Object.defineProperty(Me, "__esModule", {
  value: !0
});
var Do = ke, jo = je(Do), Bo = Ie, Lo = je(Bo), No = De, Go = je(No);
function je(t) {
  return t && t.__esModule ? t : { default: t };
}
Me.default = { CanvasRenderer: jo.default, SVGRenderer: Lo.default, ObjectRenderer: Go.default };
var k = {};
Object.defineProperty(k, "__esModule", {
  value: !0
});
function Be(t, e) {
  if (!(t instanceof e))
    throw new TypeError("Cannot call a class as a function");
}
function Le(t, e) {
  if (!t)
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e && (typeof e == "object" || typeof e == "function") ? e : t;
}
function Ne(t, e) {
  if (typeof e != "function" && e !== null)
    throw new TypeError("Super expression must either be null or a function, not " + typeof e);
  t.prototype = Object.create(e && e.prototype, { constructor: { value: t, enumerable: !1, writable: !0, configurable: !0 } }), e && (Object.setPrototypeOf ? Object.setPrototypeOf(t, e) : t.__proto__ = e);
}
var Co = function(t) {
  Ne(e, t);
  function e(r, n) {
    Be(this, e);
    var a = Le(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this));
    return a.name = "InvalidInputException", a.symbology = r, a.input = n, a.message = '"' + a.input + '" is not a valid input for ' + a.symbology, a;
  }
  return e;
}(Error), Ho = function(t) {
  Ne(e, t);
  function e() {
    Be(this, e);
    var r = Le(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this));
    return r.name = "InvalidElementException", r.message = "Not supported type to render on", r;
  }
  return e;
}(Error), Fo = function(t) {
  Ne(e, t);
  function e() {
    Be(this, e);
    var r = Le(this, (e.__proto__ || Object.getPrototypeOf(e)).call(this));
    return r.name = "NoElementException", r.message = "No element to render on.", r;
  }
  return e;
}(Error);
k.InvalidInputException = Co;
k.InvalidElementException = Ho;
k.NoElementException = Fo;
Object.defineProperty(Pe, "__esModule", {
  value: !0
});
var Xo = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
  return typeof t;
} : function(t) {
  return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
}, zo = Te, fe = Et(zo), Uo = Me, B = Et(Uo), qo = k;
function Et(t) {
  return t && t.__esModule ? t : { default: t };
}
function Ge(t) {
  if (typeof t == "string")
    return Vo(t);
  if (Array.isArray(t)) {
    for (var e = [], r = 0; r < t.length; r++)
      e.push(Ge(t[r]));
    return e;
  } else {
    if (typeof HTMLCanvasElement < "u" && t instanceof HTMLImageElement)
      return Jo(t);
    if (t && t.nodeName && t.nodeName.toLowerCase() === "svg" || typeof SVGElement < "u" && t instanceof SVGElement)
      return {
        element: t,
        options: (0, fe.default)(t),
        renderer: B.default.SVGRenderer
      };
    if (typeof HTMLCanvasElement < "u" && t instanceof HTMLCanvasElement)
      return {
        element: t,
        options: (0, fe.default)(t),
        renderer: B.default.CanvasRenderer
      };
    if (t && t.getContext)
      return {
        element: t,
        renderer: B.default.CanvasRenderer
      };
    if (t && (typeof t > "u" ? "undefined" : Xo(t)) === "object" && !t.nodeName)
      return {
        element: t,
        renderer: B.default.ObjectRenderer
      };
    throw new qo.InvalidElementException();
  }
}
function Vo(t) {
  var e = document.querySelectorAll(t);
  if (e.length !== 0) {
    for (var r = [], n = 0; n < e.length; n++)
      r.push(Ge(e[n]));
    return r;
  }
}
function Jo(t) {
  var e = document.createElement("canvas");
  return {
    element: e,
    options: (0, fe.default)(t),
    renderer: B.default.CanvasRenderer,
    afterRender: function() {
      t.setAttribute("src", e.toDataURL());
    }
  };
}
Pe.default = Ge;
var Ce = {};
Object.defineProperty(Ce, "__esModule", {
  value: !0
});
var Qo = function() {
  function t(e, r) {
    for (var n = 0; n < r.length; n++) {
      var a = r[n];
      a.enumerable = a.enumerable || !1, a.configurable = !0, "value" in a && (a.writable = !0), Object.defineProperty(e, a.key, a);
    }
  }
  return function(e, r, n) {
    return r && t(e.prototype, r), n && t(e, n), e;
  };
}();
function Wo(t, e) {
  if (!(t instanceof e))
    throw new TypeError("Cannot call a class as a function");
}
var Yo = function() {
  function t(e) {
    Wo(this, t), this.api = e;
  }
  return Qo(t, [{
    key: "handleCatch",
    value: function(r) {
      if (r.name === "InvalidInputException")
        if (this.api._options.valid !== this.api._defaults.valid)
          this.api._options.valid(!1);
        else
          throw r.message;
      else
        throw r;
      this.api.render = function() {
      };
    }
  }, {
    key: "wrapBarcodeCall",
    value: function(r) {
      try {
        var n = r.apply(void 0, arguments);
        return this.api._options.valid(!0), n;
      } catch (a) {
        return this.handleCatch(a), this.api;
      }
    }
  }]), t;
}();
Ce.default = Yo;
var Zo = le, E = O(Zo), Ko = M, C = O(Ko), eu = Ae, bt = O(eu), tu = Re, Ke = O(tu), nu = Pe, ru = O(nu), au = Z, iu = O(au), ou = Ce, uu = O(ou), mt = k, fu = K, wt = O(fu);
function O(t) {
  return t && t.__esModule ? t : { default: t };
}
var p = function() {
}, ee = function(e, r, n) {
  var a = new p();
  if (typeof e > "u")
    throw Error("No element to render on was provided.");
  return a._renderProperties = (0, ru.default)(e), a._encodings = [], a._options = wt.default, a._errorHandler = new uu.default(a), typeof r < "u" && (n = n || {}, n.format || (n.format = St()), a.options(n)[n.format](r, n).render()), a;
};
ee.getModule = function(t) {
  return E.default[t];
};
for (var et in E.default)
  E.default.hasOwnProperty(et) && cu(E.default, et);
function cu(t, e) {
  p.prototype[e] = p.prototype[e.toUpperCase()] = p.prototype[e.toLowerCase()] = function(r, n) {
    var a = this;
    return a._errorHandler.wrapBarcodeCall(function() {
      n.text = typeof n.text > "u" ? void 0 : "" + n.text;
      var i = (0, C.default)(a._options, n);
      i = (0, iu.default)(i);
      var o = t[e], u = $t(r, o, i);
      return a._encodings.push(u), a;
    });
  };
}
function $t(t, e, r) {
  t = "" + t;
  var n = new e(t, r);
  if (!n.valid())
    throw new mt.InvalidInputException(n.constructor.name, t);
  var a = n.encode();
  a = (0, bt.default)(a);
  for (var i = 0; i < a.length; i++)
    a[i].options = (0, C.default)(r, a[i].options);
  return a;
}
function St() {
  return E.default.CODE128 ? "CODE128" : Object.keys(E.default)[0];
}
p.prototype.options = function(t) {
  return this._options = (0, C.default)(this._options, t), this;
};
p.prototype.blank = function(t) {
  var e = new Array(t + 1).join("0");
  return this._encodings.push({ data: e }), this;
};
p.prototype.init = function() {
  if (this._renderProperties) {
    Array.isArray(this._renderProperties) || (this._renderProperties = [this._renderProperties]);
    var t;
    for (var e in this._renderProperties) {
      t = this._renderProperties[e];
      var r = (0, C.default)(this._options, t.options);
      r.format == "auto" && (r.format = St()), this._errorHandler.wrapBarcodeCall(function() {
        var n = r.value, a = E.default[r.format.toUpperCase()], i = $t(n, a, r);
        ce(t, i, r);
      });
    }
  }
};
p.prototype.render = function() {
  if (!this._renderProperties)
    throw new mt.NoElementException();
  if (Array.isArray(this._renderProperties))
    for (var t = 0; t < this._renderProperties.length; t++)
      ce(this._renderProperties[t], this._encodings, this._options);
  else
    ce(this._renderProperties, this._encodings, this._options);
  return this;
};
p.prototype._defaults = wt.default;
function ce(t, e, r) {
  e = (0, bt.default)(e);
  for (var n = 0; n < e.length; n++)
    e[n].options = (0, C.default)(r, e[n].options), (0, Ke.default)(e[n].options);
  (0, Ke.default)(r);
  var a = t.renderer, i = new a(t.element, e, r);
  i.render(), t.afterRender && t.afterRender();
}
typeof window < "u" && (window.JsBarcode = ee);
typeof jQuery < "u" && (jQuery.fn.JsBarcode = function(t, e) {
  var r = [];
  return jQuery(this).each(function() {
    r.push(this);
  }), ee(r, t, e);
});
var lu = ee;
const hu = /* @__PURE__ */ Rt(lu);
function du(t) {
  return `data:image/svg+xml;base64,${btoa(decodeURIComponent(t.outerHTML))}`;
}
function vu(t) {
  const e = t.command;
  e.executeInsertBarcode1D = (r, n, a, i) => {
    const o = document.createElement("svg");
    hu(o, r, i), e.executeInsertElementList([
      {
        type: At.IMAGE,
        value: du(o),
        width: n,
        height: a
      }
    ]);
  };
}
export {
  vu as default
};
//# sourceMappingURL=barcode1d.js.map
