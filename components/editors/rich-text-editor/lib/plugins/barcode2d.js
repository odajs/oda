import { ElementType as Qe } from "../canvas-editor.es.js";
function Jr(r, t) {
  var e = Object.setPrototypeOf;
  e ? e(r, t) : r.__proto__ = t;
}
function tn(r, t) {
  t === void 0 && (t = r.constructor);
  var e = Error.captureStackTrace;
  e && e(r, t);
}
var en = function() {
  var r = function(e, n) {
    return r = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function(i, a) {
      i.__proto__ = a;
    } || function(i, a) {
      for (var o in a)
        Object.prototype.hasOwnProperty.call(a, o) && (i[o] = a[o]);
    }, r(e, n);
  };
  return function(t, e) {
    if (typeof e != "function" && e !== null)
      throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), rn = function(r) {
  en(t, r);
  function t(e, n) {
    var i = this.constructor, a = r.call(this, e, n) || this;
    return Object.defineProperty(a, "name", {
      value: i.name,
      enumerable: !1,
      configurable: !0
    }), Jr(a, i.prototype), tn(a), a;
  }
  return t;
}(Error), nn = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), At = (
  /** @class */
  function(r) {
    nn(t, r);
    function t(e) {
      e === void 0 && (e = void 0);
      var n = r.call(this, e) || this;
      return n.message = e, n;
    }
    return t.prototype.getKind = function() {
      var e = this.constructor;
      return e.kind;
    }, t.kind = "Exception", t;
  }(rn)
), an = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), tt = (
  /** @class */
  function(r) {
    an(t, r);
    function t() {
      return r !== null && r.apply(this, arguments) || this;
    }
    return t.kind = "ArgumentException", t;
  }(At)
), on = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), D = (
  /** @class */
  function(r) {
    on(t, r);
    function t() {
      return r !== null && r.apply(this, arguments) || this;
    }
    return t.kind = "IllegalArgumentException", t;
  }(At)
), Br = (
  /** @class */
  function() {
    function r(t) {
      if (this.binarizer = t, t === null)
        throw new D("Binarizer must be non-null.");
    }
    return r.prototype.getWidth = function() {
      return this.binarizer.getWidth();
    }, r.prototype.getHeight = function() {
      return this.binarizer.getHeight();
    }, r.prototype.getBlackRow = function(t, e) {
      return this.binarizer.getBlackRow(t, e);
    }, r.prototype.getBlackMatrix = function() {
      return (this.matrix === null || this.matrix === void 0) && (this.matrix = this.binarizer.getBlackMatrix()), this.matrix;
    }, r.prototype.isCropSupported = function() {
      return this.binarizer.getLuminanceSource().isCropSupported();
    }, r.prototype.crop = function(t, e, n, i) {
      var a = this.binarizer.getLuminanceSource().crop(t, e, n, i);
      return new r(this.binarizer.createBinarizer(a));
    }, r.prototype.isRotateSupported = function() {
      return this.binarizer.getLuminanceSource().isRotateSupported();
    }, r.prototype.rotateCounterClockwise = function() {
      var t = this.binarizer.getLuminanceSource().rotateCounterClockwise();
      return new r(this.binarizer.createBinarizer(t));
    }, r.prototype.rotateCounterClockwise45 = function() {
      var t = this.binarizer.getLuminanceSource().rotateCounterClockwise45();
      return new r(this.binarizer.createBinarizer(t));
    }, r.prototype.toString = function() {
      try {
        return this.getBlackMatrix().toString();
      } catch {
        return "";
      }
    }, r;
  }()
), fn = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), et = (
  /** @class */
  function(r) {
    fn(t, r);
    function t() {
      return r !== null && r.apply(this, arguments) || this;
    }
    return t.getChecksumInstance = function() {
      return new t();
    }, t.kind = "ChecksumException", t;
  }(At)
), sn = (
  /** @class */
  function() {
    function r(t) {
      this.source = t;
    }
    return r.prototype.getLuminanceSource = function() {
      return this.source;
    }, r.prototype.getWidth = function() {
      return this.source.getWidth();
    }, r.prototype.getHeight = function() {
      return this.source.getHeight();
    }, r;
  }()
), j = (
  /** @class */
  function() {
    function r() {
    }
    return r.arraycopy = function(t, e, n, i, a) {
      for (; a--; )
        n[i++] = t[e++];
    }, r.currentTimeMillis = function() {
      return Date.now();
    }, r;
  }()
), un = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), ze = (
  /** @class */
  function(r) {
    un(t, r);
    function t() {
      return r !== null && r.apply(this, arguments) || this;
    }
    return t.kind = "IndexOutOfBoundsException", t;
  }(At)
), cn = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), Je = (
  /** @class */
  function(r) {
    cn(t, r);
    function t(e, n) {
      e === void 0 && (e = void 0), n === void 0 && (n = void 0);
      var i = r.call(this, n) || this;
      return i.index = e, i.message = n, i;
    }
    return t.kind = "ArrayIndexOutOfBoundsException", t;
  }(ze)
), ln = globalThis && globalThis.__values || function(r) {
  var t = typeof Symbol == "function" && Symbol.iterator, e = t && r[t], n = 0;
  if (e)
    return e.call(r);
  if (r && typeof r.length == "number")
    return {
      next: function() {
        return r && n >= r.length && (r = void 0), { value: r && r[n++], done: !r };
      }
    };
  throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, ot = (
  /** @class */
  function() {
    function r() {
    }
    return r.fill = function(t, e) {
      for (var n = 0, i = t.length; n < i; n++)
        t[n] = e;
    }, r.fillWithin = function(t, e, n, i) {
      r.rangeCheck(t.length, e, n);
      for (var a = e; a < n; a++)
        t[a] = i;
    }, r.rangeCheck = function(t, e, n) {
      if (e > n)
        throw new D("fromIndex(" + e + ") > toIndex(" + n + ")");
      if (e < 0)
        throw new Je(e);
      if (n > t)
        throw new Je(n);
    }, r.asList = function() {
      for (var t = [], e = 0; e < arguments.length; e++)
        t[e] = arguments[e];
      return t;
    }, r.create = function(t, e, n) {
      var i = Array.from({ length: t });
      return i.map(function(a) {
        return Array.from({ length: e }).fill(n);
      });
    }, r.createInt32Array = function(t, e, n) {
      var i = Array.from({ length: t });
      return i.map(function(a) {
        return Int32Array.from({ length: e }).fill(n);
      });
    }, r.equals = function(t, e) {
      if (!t || !e || !t.length || !e.length || t.length !== e.length)
        return !1;
      for (var n = 0, i = t.length; n < i; n++)
        if (t[n] !== e[n])
          return !1;
      return !0;
    }, r.hashCode = function(t) {
      var e, n;
      if (t === null)
        return 0;
      var i = 1;
      try {
        for (var a = ln(t), o = a.next(); !o.done; o = a.next()) {
          var f = o.value;
          i = 31 * i + f;
        }
      } catch (s) {
        e = { error: s };
      } finally {
        try {
          o && !o.done && (n = a.return) && n.call(a);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return i;
    }, r.fillUint8Array = function(t, e) {
      for (var n = 0; n !== t.length; n++)
        t[n] = e;
    }, r.copyOf = function(t, e) {
      return t.slice(0, e);
    }, r.copyOfUint8Array = function(t, e) {
      if (t.length <= e) {
        var n = new Uint8Array(e);
        return n.set(t), n;
      }
      return t.slice(0, e);
    }, r.copyOfRange = function(t, e, n) {
      var i = n - e, a = new Int32Array(i);
      return j.arraycopy(t, e, a, 0, i), a;
    }, r.binarySearch = function(t, e, n) {
      n === void 0 && (n = r.numberComparator);
      for (var i = 0, a = t.length - 1; i <= a; ) {
        var o = a + i >> 1, f = n(e, t[o]);
        if (f > 0)
          i = o + 1;
        else if (f < 0)
          a = o - 1;
        else
          return o;
      }
      return -i - 1;
    }, r.numberComparator = function(t, e) {
      return t - e;
    }, r;
  }()
), B = (
  /** @class */
  function() {
    function r() {
    }
    return r.numberOfTrailingZeros = function(t) {
      var e;
      if (t === 0)
        return 32;
      var n = 31;
      return e = t << 16, e !== 0 && (n -= 16, t = e), e = t << 8, e !== 0 && (n -= 8, t = e), e = t << 4, e !== 0 && (n -= 4, t = e), e = t << 2, e !== 0 && (n -= 2, t = e), n - (t << 1 >>> 31);
    }, r.numberOfLeadingZeros = function(t) {
      if (t === 0)
        return 32;
      var e = 1;
      return t >>> 16 || (e += 16, t <<= 16), t >>> 24 || (e += 8, t <<= 8), t >>> 28 || (e += 4, t <<= 4), t >>> 30 || (e += 2, t <<= 2), e -= t >>> 31, e;
    }, r.toHexString = function(t) {
      return t.toString(16);
    }, r.toBinaryString = function(t) {
      return String(parseInt(String(t), 2));
    }, r.bitCount = function(t) {
      return t = t - (t >>> 1 & 1431655765), t = (t & 858993459) + (t >>> 2 & 858993459), t = t + (t >>> 4) & 252645135, t = t + (t >>> 8), t = t + (t >>> 16), t & 63;
    }, r.truncDivision = function(t, e) {
      return Math.trunc(t / e);
    }, r.parseInt = function(t, e) {
      return e === void 0 && (e = void 0), parseInt(t, e);
    }, r.MIN_VALUE_32_BITS = -2147483648, r.MAX_VALUE = Number.MAX_SAFE_INTEGER, r;
  }()
), ct = (
  /** @class */
  function() {
    function r(t, e) {
      t === void 0 ? (this.size = 0, this.bits = new Int32Array(1)) : (this.size = t, e == null ? this.bits = r.makeArray(t) : this.bits = e);
    }
    return r.prototype.getSize = function() {
      return this.size;
    }, r.prototype.getSizeInBytes = function() {
      return Math.floor((this.size + 7) / 8);
    }, r.prototype.ensureCapacity = function(t) {
      if (t > this.bits.length * 32) {
        var e = r.makeArray(t);
        j.arraycopy(this.bits, 0, e, 0, this.bits.length), this.bits = e;
      }
    }, r.prototype.get = function(t) {
      return (this.bits[Math.floor(t / 32)] & 1 << (t & 31)) !== 0;
    }, r.prototype.set = function(t) {
      this.bits[Math.floor(t / 32)] |= 1 << (t & 31);
    }, r.prototype.flip = function(t) {
      this.bits[Math.floor(t / 32)] ^= 1 << (t & 31);
    }, r.prototype.getNextSet = function(t) {
      var e = this.size;
      if (t >= e)
        return e;
      var n = this.bits, i = Math.floor(t / 32), a = n[i];
      a &= ~((1 << (t & 31)) - 1);
      for (var o = n.length; a === 0; ) {
        if (++i === o)
          return e;
        a = n[i];
      }
      var f = i * 32 + B.numberOfTrailingZeros(a);
      return f > e ? e : f;
    }, r.prototype.getNextUnset = function(t) {
      var e = this.size;
      if (t >= e)
        return e;
      var n = this.bits, i = Math.floor(t / 32), a = ~n[i];
      a &= ~((1 << (t & 31)) - 1);
      for (var o = n.length; a === 0; ) {
        if (++i === o)
          return e;
        a = ~n[i];
      }
      var f = i * 32 + B.numberOfTrailingZeros(a);
      return f > e ? e : f;
    }, r.prototype.setBulk = function(t, e) {
      this.bits[Math.floor(t / 32)] = e;
    }, r.prototype.setRange = function(t, e) {
      if (e < t || t < 0 || e > this.size)
        throw new D();
      if (e !== t) {
        e--;
        for (var n = Math.floor(t / 32), i = Math.floor(e / 32), a = this.bits, o = n; o <= i; o++) {
          var f = o > n ? 0 : t & 31, s = o < i ? 31 : e & 31, u = (2 << s) - (1 << f);
          a[o] |= u;
        }
      }
    }, r.prototype.clear = function() {
      for (var t = this.bits.length, e = this.bits, n = 0; n < t; n++)
        e[n] = 0;
    }, r.prototype.isRange = function(t, e, n) {
      if (e < t || t < 0 || e > this.size)
        throw new D();
      if (e === t)
        return !0;
      e--;
      for (var i = Math.floor(t / 32), a = Math.floor(e / 32), o = this.bits, f = i; f <= a; f++) {
        var s = f > i ? 0 : t & 31, u = f < a ? 31 : e & 31, c = (2 << u) - (1 << s) & 4294967295;
        if ((o[f] & c) !== (n ? c : 0))
          return !1;
      }
      return !0;
    }, r.prototype.appendBit = function(t) {
      this.ensureCapacity(this.size + 1), t && (this.bits[Math.floor(this.size / 32)] |= 1 << (this.size & 31)), this.size++;
    }, r.prototype.appendBits = function(t, e) {
      if (e < 0 || e > 32)
        throw new D("Num bits must be between 0 and 32");
      this.ensureCapacity(this.size + e);
      for (var n = e; n > 0; n--)
        this.appendBit((t >> n - 1 & 1) === 1);
    }, r.prototype.appendBitArray = function(t) {
      var e = t.size;
      this.ensureCapacity(this.size + e);
      for (var n = 0; n < e; n++)
        this.appendBit(t.get(n));
    }, r.prototype.xor = function(t) {
      if (this.size !== t.size)
        throw new D("Sizes don't match");
      for (var e = this.bits, n = 0, i = e.length; n < i; n++)
        e[n] ^= t.bits[n];
    }, r.prototype.toBytes = function(t, e, n, i) {
      for (var a = 0; a < i; a++) {
        for (var o = 0, f = 0; f < 8; f++)
          this.get(t) && (o |= 1 << 7 - f), t++;
        e[n + a] = /*(byte)*/
        o;
      }
    }, r.prototype.getBitArray = function() {
      return this.bits;
    }, r.prototype.reverse = function() {
      for (var t = new Int32Array(this.bits.length), e = Math.floor((this.size - 1) / 32), n = e + 1, i = this.bits, a = 0; a < n; a++) {
        var o = i[a];
        o = o >> 1 & 1431655765 | (o & 1431655765) << 1, o = o >> 2 & 858993459 | (o & 858993459) << 2, o = o >> 4 & 252645135 | (o & 252645135) << 4, o = o >> 8 & 16711935 | (o & 16711935) << 8, o = o >> 16 & 65535 | (o & 65535) << 16, t[e - a] = /*(int)*/
        o;
      }
      if (this.size !== n * 32) {
        for (var f = n * 32 - this.size, s = t[0] >>> f, a = 1; a < n; a++) {
          var u = t[a];
          s |= u << 32 - f, t[a - 1] = s, s = u >>> f;
        }
        t[n - 1] = s;
      }
      this.bits = t;
    }, r.makeArray = function(t) {
      return new Int32Array(Math.floor((t + 31) / 32));
    }, r.prototype.equals = function(t) {
      if (!(t instanceof r))
        return !1;
      var e = t;
      return this.size === e.size && ot.equals(this.bits, e.bits);
    }, r.prototype.hashCode = function() {
      return 31 * this.size + ot.hashCode(this.bits);
    }, r.prototype.toString = function() {
      for (var t = "", e = 0, n = this.size; e < n; e++)
        e & 7 || (t += " "), t += this.get(e) ? "X" : ".";
      return t;
    }, r.prototype.clone = function() {
      return new r(this.size, this.bits.slice());
    }, r.prototype.toArray = function() {
      for (var t = [], e = 0, n = this.size; e < n; e++)
        t.push(this.get(e));
      return t;
    }, r;
  }()
), Me;
(function(r) {
  r[r.OTHER = 0] = "OTHER", r[r.PURE_BARCODE = 1] = "PURE_BARCODE", r[r.POSSIBLE_FORMATS = 2] = "POSSIBLE_FORMATS", r[r.TRY_HARDER = 3] = "TRY_HARDER", r[r.CHARACTER_SET = 4] = "CHARACTER_SET", r[r.ALLOWED_LENGTHS = 5] = "ALLOWED_LENGTHS", r[r.ASSUME_CODE_39_CHECK_DIGIT = 6] = "ASSUME_CODE_39_CHECK_DIGIT", r[r.ASSUME_GS1 = 7] = "ASSUME_GS1", r[r.RETURN_CODABAR_START_END = 8] = "RETURN_CODABAR_START_END", r[r.NEED_RESULT_POINT_CALLBACK = 9] = "NEED_RESULT_POINT_CALLBACK", r[r.ALLOWED_EAN_EXTENSIONS = 10] = "ALLOWED_EAN_EXTENSIONS";
})(Me || (Me = {}));
const $ = Me;
var hn = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), T = (
  /** @class */
  function(r) {
    hn(t, r);
    function t() {
      return r !== null && r.apply(this, arguments) || this;
    }
    return t.getFormatInstance = function() {
      return new t();
    }, t.kind = "FormatException", t;
  }(At)
), dn = globalThis && globalThis.__values || function(r) {
  var t = typeof Symbol == "function" && Symbol.iterator, e = t && r[t], n = 0;
  if (e)
    return e.call(r);
  if (r && typeof r.length == "number")
    return {
      next: function() {
        return r && n >= r.length && (r = void 0), { value: r && r[n++], done: !r };
      }
    };
  throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, X;
(function(r) {
  r[r.Cp437 = 0] = "Cp437", r[r.ISO8859_1 = 1] = "ISO8859_1", r[r.ISO8859_2 = 2] = "ISO8859_2", r[r.ISO8859_3 = 3] = "ISO8859_3", r[r.ISO8859_4 = 4] = "ISO8859_4", r[r.ISO8859_5 = 5] = "ISO8859_5", r[r.ISO8859_6 = 6] = "ISO8859_6", r[r.ISO8859_7 = 7] = "ISO8859_7", r[r.ISO8859_8 = 8] = "ISO8859_8", r[r.ISO8859_9 = 9] = "ISO8859_9", r[r.ISO8859_10 = 10] = "ISO8859_10", r[r.ISO8859_11 = 11] = "ISO8859_11", r[r.ISO8859_13 = 12] = "ISO8859_13", r[r.ISO8859_14 = 13] = "ISO8859_14", r[r.ISO8859_15 = 14] = "ISO8859_15", r[r.ISO8859_16 = 15] = "ISO8859_16", r[r.SJIS = 16] = "SJIS", r[r.Cp1250 = 17] = "Cp1250", r[r.Cp1251 = 18] = "Cp1251", r[r.Cp1252 = 19] = "Cp1252", r[r.Cp1256 = 20] = "Cp1256", r[r.UnicodeBigUnmarked = 21] = "UnicodeBigUnmarked", r[r.UTF8 = 22] = "UTF8", r[r.ASCII = 23] = "ASCII", r[r.Big5 = 24] = "Big5", r[r.GB18030 = 25] = "GB18030", r[r.EUC_KR = 26] = "EUC_KR";
})(X || (X = {}));
var at = (
  /** @class */
  function() {
    function r(t, e, n) {
      for (var i, a, o = [], f = 3; f < arguments.length; f++)
        o[f - 3] = arguments[f];
      this.valueIdentifier = t, this.name = n, typeof e == "number" ? this.values = Int32Array.from([e]) : this.values = e, this.otherEncodingNames = o, r.VALUE_IDENTIFIER_TO_ECI.set(t, this), r.NAME_TO_ECI.set(n, this);
      for (var s = this.values, u = 0, c = s.length; u !== c; u++) {
        var l = s[u];
        r.VALUES_TO_ECI.set(l, this);
      }
      try {
        for (var h = dn(o), d = h.next(); !d.done; d = h.next()) {
          var v = d.value;
          r.NAME_TO_ECI.set(v, this);
        }
      } catch (g) {
        i = { error: g };
      } finally {
        try {
          d && !d.done && (a = h.return) && a.call(h);
        } finally {
          if (i)
            throw i.error;
        }
      }
    }
    return r.prototype.getValueIdentifier = function() {
      return this.valueIdentifier;
    }, r.prototype.getName = function() {
      return this.name;
    }, r.prototype.getValue = function() {
      return this.values[0];
    }, r.getCharacterSetECIByValue = function(t) {
      if (t < 0 || t >= 900)
        throw new T("incorect value");
      var e = r.VALUES_TO_ECI.get(t);
      if (e === void 0)
        throw new T("incorect value");
      return e;
    }, r.getCharacterSetECIByName = function(t) {
      var e = r.NAME_TO_ECI.get(t);
      if (e === void 0)
        throw new T("incorect value");
      return e;
    }, r.prototype.equals = function(t) {
      if (!(t instanceof r))
        return !1;
      var e = t;
      return this.getName() === e.getName();
    }, r.VALUE_IDENTIFIER_TO_ECI = /* @__PURE__ */ new Map(), r.VALUES_TO_ECI = /* @__PURE__ */ new Map(), r.NAME_TO_ECI = /* @__PURE__ */ new Map(), r.Cp437 = new r(X.Cp437, Int32Array.from([0, 2]), "Cp437"), r.ISO8859_1 = new r(X.ISO8859_1, Int32Array.from([1, 3]), "ISO-8859-1", "ISO88591", "ISO8859_1"), r.ISO8859_2 = new r(X.ISO8859_2, 4, "ISO-8859-2", "ISO88592", "ISO8859_2"), r.ISO8859_3 = new r(X.ISO8859_3, 5, "ISO-8859-3", "ISO88593", "ISO8859_3"), r.ISO8859_4 = new r(X.ISO8859_4, 6, "ISO-8859-4", "ISO88594", "ISO8859_4"), r.ISO8859_5 = new r(X.ISO8859_5, 7, "ISO-8859-5", "ISO88595", "ISO8859_5"), r.ISO8859_6 = new r(X.ISO8859_6, 8, "ISO-8859-6", "ISO88596", "ISO8859_6"), r.ISO8859_7 = new r(X.ISO8859_7, 9, "ISO-8859-7", "ISO88597", "ISO8859_7"), r.ISO8859_8 = new r(X.ISO8859_8, 10, "ISO-8859-8", "ISO88598", "ISO8859_8"), r.ISO8859_9 = new r(X.ISO8859_9, 11, "ISO-8859-9", "ISO88599", "ISO8859_9"), r.ISO8859_10 = new r(X.ISO8859_10, 12, "ISO-8859-10", "ISO885910", "ISO8859_10"), r.ISO8859_11 = new r(X.ISO8859_11, 13, "ISO-8859-11", "ISO885911", "ISO8859_11"), r.ISO8859_13 = new r(X.ISO8859_13, 15, "ISO-8859-13", "ISO885913", "ISO8859_13"), r.ISO8859_14 = new r(X.ISO8859_14, 16, "ISO-8859-14", "ISO885914", "ISO8859_14"), r.ISO8859_15 = new r(X.ISO8859_15, 17, "ISO-8859-15", "ISO885915", "ISO8859_15"), r.ISO8859_16 = new r(X.ISO8859_16, 18, "ISO-8859-16", "ISO885916", "ISO8859_16"), r.SJIS = new r(X.SJIS, 20, "SJIS", "Shift_JIS"), r.Cp1250 = new r(X.Cp1250, 21, "Cp1250", "windows-1250"), r.Cp1251 = new r(X.Cp1251, 22, "Cp1251", "windows-1251"), r.Cp1252 = new r(X.Cp1252, 23, "Cp1252", "windows-1252"), r.Cp1256 = new r(X.Cp1256, 24, "Cp1256", "windows-1256"), r.UnicodeBigUnmarked = new r(X.UnicodeBigUnmarked, 25, "UnicodeBigUnmarked", "UTF-16BE", "UnicodeBig"), r.UTF8 = new r(X.UTF8, 26, "UTF8", "UTF-8"), r.ASCII = new r(X.ASCII, Int32Array.from([27, 170]), "ASCII", "US-ASCII"), r.Big5 = new r(X.Big5, 28, "Big5"), r.GB18030 = new r(X.GB18030, 29, "GB18030", "GB2312", "EUC_CN", "GBK"), r.EUC_KR = new r(X.EUC_KR, 30, "EUC_KR", "EUC-KR"), r;
  }()
), vn = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), ue = (
  /** @class */
  function(r) {
    vn(t, r);
    function t() {
      return r !== null && r.apply(this, arguments) || this;
    }
    return t.kind = "UnsupportedOperationException", t;
  }(At)
), It = (
  /** @class */
  function() {
    function r() {
    }
    return r.decode = function(t, e) {
      var n = this.encodingName(e);
      return this.customDecoder ? this.customDecoder(t, n) : typeof TextDecoder > "u" || this.shouldDecodeOnFallback(n) ? this.decodeFallback(t, n) : new TextDecoder(n).decode(t);
    }, r.shouldDecodeOnFallback = function(t) {
      return !r.isBrowser() && t === "ISO-8859-1";
    }, r.encode = function(t, e) {
      var n = this.encodingName(e);
      return this.customEncoder ? this.customEncoder(t, n) : typeof TextEncoder > "u" ? this.encodeFallback(t) : new TextEncoder().encode(t);
    }, r.isBrowser = function() {
      return typeof window < "u" && {}.toString.call(window) === "[object Window]";
    }, r.encodingName = function(t) {
      return typeof t == "string" ? t : t.getName();
    }, r.encodingCharacterSet = function(t) {
      return t instanceof at ? t : at.getCharacterSetECIByName(t);
    }, r.decodeFallback = function(t, e) {
      var n = this.encodingCharacterSet(e);
      if (r.isDecodeFallbackSupported(n)) {
        for (var i = "", a = 0, o = t.length; a < o; a++) {
          var f = t[a].toString(16);
          f.length < 2 && (f = "0" + f), i += "%" + f;
        }
        return decodeURIComponent(i);
      }
      if (n.equals(at.UnicodeBigUnmarked))
        return String.fromCharCode.apply(null, new Uint16Array(t.buffer));
      throw new ue("Encoding " + this.encodingName(e) + " not supported by fallback.");
    }, r.isDecodeFallbackSupported = function(t) {
      return t.equals(at.UTF8) || t.equals(at.ISO8859_1) || t.equals(at.ASCII);
    }, r.encodeFallback = function(t) {
      for (var e = btoa(unescape(encodeURIComponent(t))), n = e.split(""), i = [], a = 0; a < n.length; a++)
        i.push(n[a].charCodeAt(0));
      return new Uint8Array(i);
    }, r;
  }()
), F = (
  /** @class */
  function() {
    function r() {
    }
    return r.castAsNonUtf8Char = function(t, e) {
      e === void 0 && (e = null);
      var n = e ? e.getName() : this.ISO88591;
      return It.decode(new Uint8Array([t]), n);
    }, r.guessEncoding = function(t, e) {
      if (e != null && e.get($.CHARACTER_SET) !== void 0)
        return e.get($.CHARACTER_SET).toString();
      for (var n = t.length, i = !0, a = !0, o = !0, f = 0, s = 0, u = 0, c = 0, l = 0, h = 0, d = 0, v = 0, g = 0, x = 0, w = 0, y = t.length > 3 && t[0] === /*(byte) */
      239 && t[1] === /*(byte) */
      187 && t[2] === /*(byte) */
      191, _ = 0; _ < n && (i || a || o); _++) {
        var E = t[_] & 255;
        o && (f > 0 ? E & 128 ? f-- : o = !1 : E & 128 && (E & 64 ? (f++, E & 32 ? (f++, E & 16 ? (f++, E & 8 ? o = !1 : c++) : u++) : s++) : o = !1)), i && (E > 127 && E < 160 ? i = !1 : E > 159 && (E < 192 || E === 215 || E === 247) && w++), a && (l > 0 ? E < 64 || E === 127 || E > 252 ? a = !1 : l-- : E === 128 || E === 160 || E > 239 ? a = !1 : E > 160 && E < 224 ? (h++, v = 0, d++, d > g && (g = d)) : E > 127 ? (l++, d = 0, v++, v > x && (x = v)) : (d = 0, v = 0));
      }
      return o && f > 0 && (o = !1), a && l > 0 && (a = !1), o && (y || s + u + c > 0) ? r.UTF8 : a && (r.ASSUME_SHIFT_JIS || g >= 3 || x >= 3) ? r.SHIFT_JIS : i && a ? g === 2 && h === 2 || w * 10 >= n ? r.SHIFT_JIS : r.ISO88591 : i ? r.ISO88591 : a ? r.SHIFT_JIS : o ? r.UTF8 : r.PLATFORM_DEFAULT_ENCODING;
    }, r.format = function(t) {
      for (var e = [], n = 1; n < arguments.length; n++)
        e[n - 1] = arguments[n];
      var i = -1;
      function a(f, s, u, c, l, h) {
        if (f === "%%")
          return "%";
        if (e[++i] !== void 0) {
          f = c ? parseInt(c.substr(1)) : void 0;
          var d = l ? parseInt(l.substr(1)) : void 0, v;
          switch (h) {
            case "s":
              v = e[i];
              break;
            case "c":
              v = e[i][0];
              break;
            case "f":
              v = parseFloat(e[i]).toFixed(f);
              break;
            case "p":
              v = parseFloat(e[i]).toPrecision(f);
              break;
            case "e":
              v = parseFloat(e[i]).toExponential(f);
              break;
            case "x":
              v = parseInt(e[i]).toString(d || 16);
              break;
            case "d":
              v = parseFloat(parseInt(e[i], d || 10).toPrecision(f)).toFixed(0);
              break;
          }
          v = typeof v == "object" ? JSON.stringify(v) : (+v).toString(d);
          for (var g = parseInt(u), x = u && u[0] + "" == "0" ? "0" : " "; v.length < g; )
            v = s !== void 0 ? v + x : x + v;
          return v;
        }
      }
      var o = /%(-)?(0?[0-9]+)?([.][0-9]+)?([#][0-9]+)?([scfpexd%])/g;
      return t.replace(o, a);
    }, r.getBytes = function(t, e) {
      return It.encode(t, e);
    }, r.getCharCode = function(t, e) {
      return e === void 0 && (e = 0), t.charCodeAt(e);
    }, r.getCharAt = function(t) {
      return String.fromCharCode(t);
    }, r.SHIFT_JIS = at.SJIS.getName(), r.GB2312 = "GB2312", r.ISO88591 = at.ISO8859_1.getName(), r.EUC_JP = "EUC_JP", r.UTF8 = at.UTF8.getName(), r.PLATFORM_DEFAULT_ENCODING = r.UTF8, r.ASSUME_SHIFT_JIS = !1, r;
  }()
), M = (
  /** @class */
  function() {
    function r(t) {
      t === void 0 && (t = ""), this.value = t;
    }
    return r.prototype.enableDecoding = function(t) {
      return this.encoding = t, this;
    }, r.prototype.append = function(t) {
      return typeof t == "string" ? this.value += t.toString() : this.encoding ? this.value += F.castAsNonUtf8Char(t, this.encoding) : this.value += String.fromCharCode(t), this;
    }, r.prototype.appendChars = function(t, e, n) {
      for (var i = e; e < e + n; i++)
        this.append(t[i]);
      return this;
    }, r.prototype.length = function() {
      return this.value.length;
    }, r.prototype.charAt = function(t) {
      return this.value.charAt(t);
    }, r.prototype.deleteCharAt = function(t) {
      this.value = this.value.substr(0, t) + this.value.substring(t + 1);
    }, r.prototype.setCharAt = function(t, e) {
      this.value = this.value.substr(0, t) + e + this.value.substr(t + 1);
    }, r.prototype.substring = function(t, e) {
      return this.value.substring(t, e);
    }, r.prototype.setLengthToZero = function() {
      this.value = "";
    }, r.prototype.toString = function() {
      return this.value;
    }, r.prototype.insert = function(t, e) {
      this.value = this.value.substring(0, t) + e + this.value.substring(t);
    }, r;
  }()
), Nt = (
  /** @class */
  function() {
    function r(t, e, n, i) {
      if (this.width = t, this.height = e, this.rowSize = n, this.bits = i, e == null && (e = t), this.height = e, t < 1 || e < 1)
        throw new D("Both dimensions must be greater than 0");
      n == null && (n = Math.floor((t + 31) / 32)), this.rowSize = n, i == null && (this.bits = new Int32Array(this.rowSize * this.height));
    }
    return r.parseFromBooleanArray = function(t) {
      for (var e = t.length, n = t[0].length, i = new r(n, e), a = 0; a < e; a++)
        for (var o = t[a], f = 0; f < n; f++)
          o[f] && i.set(f, a);
      return i;
    }, r.parseFromString = function(t, e, n) {
      if (t === null)
        throw new D("stringRepresentation cannot be null");
      for (var i = new Array(t.length), a = 0, o = 0, f = -1, s = 0, u = 0; u < t.length; )
        if (t.charAt(u) === `
` || t.charAt(u) === "\r") {
          if (a > o) {
            if (f === -1)
              f = a - o;
            else if (a - o !== f)
              throw new D("row lengths do not match");
            o = a, s++;
          }
          u++;
        } else if (t.substring(u, u + e.length) === e)
          u += e.length, i[a] = !0, a++;
        else if (t.substring(u, u + n.length) === n)
          u += n.length, i[a] = !1, a++;
        else
          throw new D("illegal character encountered: " + t.substring(u));
      if (a > o) {
        if (f === -1)
          f = a - o;
        else if (a - o !== f)
          throw new D("row lengths do not match");
        s++;
      }
      for (var c = new r(f, s), l = 0; l < a; l++)
        i[l] && c.set(Math.floor(l % f), Math.floor(l / f));
      return c;
    }, r.prototype.get = function(t, e) {
      var n = e * this.rowSize + Math.floor(t / 32);
      return (this.bits[n] >>> (t & 31) & 1) !== 0;
    }, r.prototype.set = function(t, e) {
      var n = e * this.rowSize + Math.floor(t / 32);
      this.bits[n] |= 1 << (t & 31) & 4294967295;
    }, r.prototype.unset = function(t, e) {
      var n = e * this.rowSize + Math.floor(t / 32);
      this.bits[n] &= ~(1 << (t & 31) & 4294967295);
    }, r.prototype.flip = function(t, e) {
      var n = e * this.rowSize + Math.floor(t / 32);
      this.bits[n] ^= 1 << (t & 31) & 4294967295;
    }, r.prototype.xor = function(t) {
      if (this.width !== t.getWidth() || this.height !== t.getHeight() || this.rowSize !== t.getRowSize())
        throw new D("input matrix dimensions do not match");
      for (var e = new ct(Math.floor(this.width / 32) + 1), n = this.rowSize, i = this.bits, a = 0, o = this.height; a < o; a++)
        for (var f = a * n, s = t.getRow(a, e).getBitArray(), u = 0; u < n; u++)
          i[f + u] ^= s[u];
    }, r.prototype.clear = function() {
      for (var t = this.bits, e = t.length, n = 0; n < e; n++)
        t[n] = 0;
    }, r.prototype.setRegion = function(t, e, n, i) {
      if (e < 0 || t < 0)
        throw new D("Left and top must be nonnegative");
      if (i < 1 || n < 1)
        throw new D("Height and width must be at least 1");
      var a = t + n, o = e + i;
      if (o > this.height || a > this.width)
        throw new D("The region must fit inside the matrix");
      for (var f = this.rowSize, s = this.bits, u = e; u < o; u++)
        for (var c = u * f, l = t; l < a; l++)
          s[c + Math.floor(l / 32)] |= 1 << (l & 31) & 4294967295;
    }, r.prototype.getRow = function(t, e) {
      e == null || e.getSize() < this.width ? e = new ct(this.width) : e.clear();
      for (var n = this.rowSize, i = this.bits, a = t * n, o = 0; o < n; o++)
        e.setBulk(o * 32, i[a + o]);
      return e;
    }, r.prototype.setRow = function(t, e) {
      j.arraycopy(e.getBitArray(), 0, this.bits, t * this.rowSize, this.rowSize);
    }, r.prototype.rotate180 = function() {
      for (var t = this.getWidth(), e = this.getHeight(), n = new ct(t), i = new ct(t), a = 0, o = Math.floor((e + 1) / 2); a < o; a++)
        n = this.getRow(a, n), i = this.getRow(e - 1 - a, i), n.reverse(), i.reverse(), this.setRow(a, i), this.setRow(e - 1 - a, n);
    }, r.prototype.getEnclosingRectangle = function() {
      for (var t = this.width, e = this.height, n = this.rowSize, i = this.bits, a = t, o = e, f = -1, s = -1, u = 0; u < e; u++)
        for (var c = 0; c < n; c++) {
          var l = i[u * n + c];
          if (l !== 0) {
            if (u < o && (o = u), u > s && (s = u), c * 32 < a) {
              for (var h = 0; !(l << 31 - h & 4294967295); )
                h++;
              c * 32 + h < a && (a = c * 32 + h);
            }
            if (c * 32 + 31 > f) {
              for (var h = 31; !(l >>> h); )
                h--;
              c * 32 + h > f && (f = c * 32 + h);
            }
          }
        }
      return f < a || s < o ? null : Int32Array.from([a, o, f - a + 1, s - o + 1]);
    }, r.prototype.getTopLeftOnBit = function() {
      for (var t = this.rowSize, e = this.bits, n = 0; n < e.length && e[n] === 0; )
        n++;
      if (n === e.length)
        return null;
      for (var i = n / t, a = n % t * 32, o = e[n], f = 0; !(o << 31 - f & 4294967295); )
        f++;
      return a += f, Int32Array.from([a, i]);
    }, r.prototype.getBottomRightOnBit = function() {
      for (var t = this.rowSize, e = this.bits, n = e.length - 1; n >= 0 && e[n] === 0; )
        n--;
      if (n < 0)
        return null;
      for (var i = Math.floor(n / t), a = Math.floor(n % t) * 32, o = e[n], f = 31; !(o >>> f); )
        f--;
      return a += f, Int32Array.from([a, i]);
    }, r.prototype.getWidth = function() {
      return this.width;
    }, r.prototype.getHeight = function() {
      return this.height;
    }, r.prototype.getRowSize = function() {
      return this.rowSize;
    }, r.prototype.equals = function(t) {
      if (!(t instanceof r))
        return !1;
      var e = t;
      return this.width === e.width && this.height === e.height && this.rowSize === e.rowSize && ot.equals(this.bits, e.bits);
    }, r.prototype.hashCode = function() {
      var t = this.width;
      return t = 31 * t + this.width, t = 31 * t + this.height, t = 31 * t + this.rowSize, t = 31 * t + ot.hashCode(this.bits), t;
    }, r.prototype.toString = function(t, e, n) {
      return t === void 0 && (t = "X "), e === void 0 && (e = "  "), n === void 0 && (n = `
`), this.buildToString(t, e, n);
    }, r.prototype.buildToString = function(t, e, n) {
      for (var i = new M(), a = 0, o = this.height; a < o; a++) {
        for (var f = 0, s = this.width; f < s; f++)
          i.append(this.get(f, a) ? t : e);
        i.append(n);
      }
      return i.toString();
    }, r.prototype.clone = function() {
      return new r(this.width, this.height, this.rowSize, this.bits.slice());
    }, r;
  }()
), pn = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), C = (
  /** @class */
  function(r) {
    pn(t, r);
    function t() {
      return r !== null && r.apply(this, arguments) || this;
    }
    return t.getNotFoundInstance = function() {
      return new t();
    }, t.kind = "NotFoundException", t;
  }(At)
), gn = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), xn = (
  /** @class */
  function(r) {
    gn(t, r);
    function t(e) {
      var n = r.call(this, e) || this;
      return n.luminances = t.EMPTY, n.buckets = new Int32Array(t.LUMINANCE_BUCKETS), n;
    }
    return t.prototype.getBlackRow = function(e, n) {
      var i = this.getLuminanceSource(), a = i.getWidth();
      n == null || n.getSize() < a ? n = new ct(a) : n.clear(), this.initArrays(a);
      for (var o = i.getRow(e, this.luminances), f = this.buckets, s = 0; s < a; s++)
        f[(o[s] & 255) >> t.LUMINANCE_SHIFT]++;
      var u = t.estimateBlackPoint(f);
      if (a < 3)
        for (var s = 0; s < a; s++)
          (o[s] & 255) < u && n.set(s);
      else
        for (var c = o[0] & 255, l = o[1] & 255, s = 1; s < a - 1; s++) {
          var h = o[s + 1] & 255;
          (l * 4 - c - h) / 2 < u && n.set(s), c = l, l = h;
        }
      return n;
    }, t.prototype.getBlackMatrix = function() {
      var e = this.getLuminanceSource(), n = e.getWidth(), i = e.getHeight(), a = new Nt(n, i);
      this.initArrays(n);
      for (var o = this.buckets, f = 1; f < 5; f++)
        for (var s = Math.floor(i * f / 5), u = e.getRow(s, this.luminances), c = Math.floor(n * 4 / 5), l = Math.floor(n / 5); l < c; l++) {
          var h = u[l] & 255;
          o[h >> t.LUMINANCE_SHIFT]++;
        }
      for (var d = t.estimateBlackPoint(o), v = e.getMatrix(), f = 0; f < i; f++)
        for (var g = f * n, l = 0; l < n; l++) {
          var h = v[g + l] & 255;
          h < d && a.set(l, f);
        }
      return a;
    }, t.prototype.createBinarizer = function(e) {
      return new t(e);
    }, t.prototype.initArrays = function(e) {
      this.luminances.length < e && (this.luminances = new Uint8ClampedArray(e));
      for (var n = this.buckets, i = 0; i < t.LUMINANCE_BUCKETS; i++)
        n[i] = 0;
    }, t.estimateBlackPoint = function(e) {
      for (var n = e.length, i = 0, a = 0, o = 0, f = 0; f < n; f++)
        e[f] > o && (a = f, o = e[f]), e[f] > i && (i = e[f]);
      for (var s = 0, u = 0, f = 0; f < n; f++) {
        var c = f - a, l = e[f] * c * c;
        l > u && (s = f, u = l);
      }
      if (a > s) {
        var h = a;
        a = s, s = h;
      }
      if (s - a <= n / 16)
        throw new C();
      for (var d = s - 1, v = -1, f = s - 1; f > a; f--) {
        var g = f - a, l = g * g * (s - f) * (i - e[f]);
        l > v && (d = f, v = l);
      }
      return d << t.LUMINANCE_SHIFT;
    }, t.LUMINANCE_BITS = 5, t.LUMINANCE_SHIFT = 8 - t.LUMINANCE_BITS, t.LUMINANCE_BUCKETS = 1 << t.LUMINANCE_BITS, t.EMPTY = Uint8ClampedArray.from([0]), t;
  }(sn)
), yn = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), Fr = (
  /** @class */
  function(r) {
    yn(t, r);
    function t(e) {
      var n = r.call(this, e) || this;
      return n.matrix = null, n;
    }
    return t.prototype.getBlackMatrix = function() {
      if (this.matrix !== null)
        return this.matrix;
      var e = this.getLuminanceSource(), n = e.getWidth(), i = e.getHeight();
      if (n >= t.MINIMUM_DIMENSION && i >= t.MINIMUM_DIMENSION) {
        var a = e.getMatrix(), o = n >> t.BLOCK_SIZE_POWER;
        n & t.BLOCK_SIZE_MASK && o++;
        var f = i >> t.BLOCK_SIZE_POWER;
        i & t.BLOCK_SIZE_MASK && f++;
        var s = t.calculateBlackPoints(a, o, f, n, i), u = new Nt(n, i);
        t.calculateThresholdForBlock(a, o, f, n, i, s, u), this.matrix = u;
      } else
        this.matrix = r.prototype.getBlackMatrix.call(this);
      return this.matrix;
    }, t.prototype.createBinarizer = function(e) {
      return new t(e);
    }, t.calculateThresholdForBlock = function(e, n, i, a, o, f, s) {
      for (var u = o - t.BLOCK_SIZE, c = a - t.BLOCK_SIZE, l = 0; l < i; l++) {
        var h = l << t.BLOCK_SIZE_POWER;
        h > u && (h = u);
        for (var d = t.cap(l, 2, i - 3), v = 0; v < n; v++) {
          var g = v << t.BLOCK_SIZE_POWER;
          g > c && (g = c);
          for (var x = t.cap(v, 2, n - 3), w = 0, y = -2; y <= 2; y++) {
            var _ = f[d + y];
            w += _[x - 2] + _[x - 1] + _[x] + _[x + 1] + _[x + 2];
          }
          var E = w / 25;
          t.thresholdBlock(e, g, h, E, a, s);
        }
      }
    }, t.cap = function(e, n, i) {
      return e < n ? n : e > i ? i : e;
    }, t.thresholdBlock = function(e, n, i, a, o, f) {
      for (var s = 0, u = i * o + n; s < t.BLOCK_SIZE; s++, u += o)
        for (var c = 0; c < t.BLOCK_SIZE; c++)
          (e[u + c] & 255) <= a && f.set(n + c, i + s);
    }, t.calculateBlackPoints = function(e, n, i, a, o) {
      for (var f = o - t.BLOCK_SIZE, s = a - t.BLOCK_SIZE, u = new Array(i), c = 0; c < i; c++) {
        u[c] = new Int32Array(n);
        var l = c << t.BLOCK_SIZE_POWER;
        l > f && (l = f);
        for (var h = 0; h < n; h++) {
          var d = h << t.BLOCK_SIZE_POWER;
          d > s && (d = s);
          for (var v = 0, g = 255, x = 0, w = 0, y = l * a + d; w < t.BLOCK_SIZE; w++, y += a) {
            for (var _ = 0; _ < t.BLOCK_SIZE; _++) {
              var E = e[y + _] & 255;
              v += E, E < g && (g = E), E > x && (x = E);
            }
            if (x - g > t.MIN_DYNAMIC_RANGE)
              for (w++, y += a; w < t.BLOCK_SIZE; w++, y += a)
                for (var _ = 0; _ < t.BLOCK_SIZE; _++)
                  v += e[y + _] & 255;
          }
          var m = v >> t.BLOCK_SIZE_POWER * 2;
          if (x - g <= t.MIN_DYNAMIC_RANGE && (m = g / 2, c > 0 && h > 0)) {
            var I = (u[c - 1][h] + 2 * u[c][h - 1] + u[c - 1][h - 1]) / 4;
            g < I && (m = I);
          }
          u[c][h] = m;
        }
      }
      return u;
    }, t.BLOCK_SIZE_POWER = 3, t.BLOCK_SIZE = 1 << t.BLOCK_SIZE_POWER, t.BLOCK_SIZE_MASK = t.BLOCK_SIZE - 1, t.MINIMUM_DIMENSION = t.BLOCK_SIZE * 5, t.MIN_DYNAMIC_RANGE = 24, t;
  }(xn)
), ie = (
  /** @class */
  function() {
    function r(t, e) {
      this.width = t, this.height = e;
    }
    return r.prototype.getWidth = function() {
      return this.width;
    }, r.prototype.getHeight = function() {
      return this.height;
    }, r.prototype.isCropSupported = function() {
      return !1;
    }, r.prototype.crop = function(t, e, n, i) {
      throw new ue("This luminance source does not support cropping.");
    }, r.prototype.isRotateSupported = function() {
      return !1;
    }, r.prototype.rotateCounterClockwise = function() {
      throw new ue("This luminance source does not support rotation by 90 degrees.");
    }, r.prototype.rotateCounterClockwise45 = function() {
      throw new ue("This luminance source does not support rotation by 45 degrees.");
    }, r.prototype.toString = function() {
      for (var t = new Uint8ClampedArray(this.width), e = new M(), n = 0; n < this.height; n++) {
        for (var i = this.getRow(n, t), a = 0; a < this.width; a++) {
          var o = i[a] & 255, f = void 0;
          o < 64 ? f = "#" : o < 128 ? f = "+" : o < 192 ? f = "." : f = " ", e.append(f);
        }
        e.append(`
`);
      }
      return e.toString();
    }, r;
  }()
), wn = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), ye = (
  /** @class */
  function(r) {
    wn(t, r);
    function t(e) {
      var n = r.call(this, e.getWidth(), e.getHeight()) || this;
      return n.delegate = e, n;
    }
    return t.prototype.getRow = function(e, n) {
      for (var i = this.delegate.getRow(e, n), a = this.getWidth(), o = 0; o < a; o++)
        i[o] = /*(byte)*/
        255 - (i[o] & 255);
      return i;
    }, t.prototype.getMatrix = function() {
      for (var e = this.delegate.getMatrix(), n = this.getWidth() * this.getHeight(), i = new Uint8ClampedArray(n), a = 0; a < n; a++)
        i[a] = /*(byte)*/
        255 - (e[a] & 255);
      return i;
    }, t.prototype.isCropSupported = function() {
      return this.delegate.isCropSupported();
    }, t.prototype.crop = function(e, n, i, a) {
      return new t(this.delegate.crop(e, n, i, a));
    }, t.prototype.isRotateSupported = function() {
      return this.delegate.isRotateSupported();
    }, t.prototype.invert = function() {
      return this.delegate;
    }, t.prototype.rotateCounterClockwise = function() {
      return new t(this.delegate.rotateCounterClockwise());
    }, t.prototype.rotateCounterClockwise45 = function() {
      return new t(this.delegate.rotateCounterClockwise45());
    }, t;
  }(ie)
), _n = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), An = (
  /** @class */
  function(r) {
    _n(t, r);
    function t(e) {
      var n = r.call(this, e.width, e.height) || this;
      return n.canvas = e, n.tempCanvasElement = null, n.buffer = t.makeBufferFromCanvasImageData(e), n;
    }
    return t.makeBufferFromCanvasImageData = function(e) {
      var n = e.getContext("2d").getImageData(0, 0, e.width, e.height);
      return t.toGrayscaleBuffer(n.data, e.width, e.height);
    }, t.toGrayscaleBuffer = function(e, n, i) {
      var a = new Uint8ClampedArray(n * i);
      if (t.FRAME_INDEX = !t.FRAME_INDEX, t.FRAME_INDEX)
        for (var o = 0, f = 0, s = e.length; o < s; o += 4, f++) {
          var u = void 0, c = e[o + 3];
          if (c === 0)
            u = 255;
          else {
            var l = e[o], h = e[o + 1], d = e[o + 2];
            u = 306 * l + 601 * h + 117 * d + 512 >> 10;
          }
          a[f] = u;
        }
      else
        for (var o = 0, f = 0, v = e.length; o < v; o += 4, f++) {
          var u = void 0, c = e[o + 3];
          if (c === 0)
            u = 255;
          else {
            var l = e[o], h = e[o + 1], d = e[o + 2];
            u = 306 * l + 601 * h + 117 * d + 512 >> 10;
          }
          a[f] = 255 - u;
        }
      return a;
    }, t.prototype.getRow = function(e, n) {
      if (e < 0 || e >= this.getHeight())
        throw new D("Requested row is outside the image: " + e);
      var i = this.getWidth(), a = e * i;
      return n === null ? n = this.buffer.slice(a, a + i) : (n.length < i && (n = new Uint8ClampedArray(i)), n.set(this.buffer.slice(a, a + i))), n;
    }, t.prototype.getMatrix = function() {
      return this.buffer;
    }, t.prototype.isCropSupported = function() {
      return !0;
    }, t.prototype.crop = function(e, n, i, a) {
      return r.prototype.crop.call(this, e, n, i, a), this;
    }, t.prototype.isRotateSupported = function() {
      return !0;
    }, t.prototype.rotateCounterClockwise = function() {
      return this.rotate(-90), this;
    }, t.prototype.rotateCounterClockwise45 = function() {
      return this.rotate(-45), this;
    }, t.prototype.getTempCanvasElement = function() {
      if (this.tempCanvasElement === null) {
        var e = this.canvas.ownerDocument.createElement("canvas");
        e.width = this.canvas.width, e.height = this.canvas.height, this.tempCanvasElement = e;
      }
      return this.tempCanvasElement;
    }, t.prototype.rotate = function(e) {
      var n = this.getTempCanvasElement(), i = n.getContext("2d"), a = e * t.DEGREE_TO_RADIANS, o = this.canvas.width, f = this.canvas.height, s = Math.ceil(Math.abs(Math.cos(a)) * o + Math.abs(Math.sin(a)) * f), u = Math.ceil(Math.abs(Math.sin(a)) * o + Math.abs(Math.cos(a)) * f);
      return n.width = s, n.height = u, i.translate(s / 2, u / 2), i.rotate(a), i.drawImage(this.canvas, o / -2, f / -2), this.buffer = t.makeBufferFromCanvasImageData(n), this;
    }, t.prototype.invert = function() {
      return new ye(this);
    }, t.DEGREE_TO_RADIANS = Math.PI / 180, t.FRAME_INDEX = !0, t;
  }(ie)
), En = (
  /** @class */
  function() {
    function r(t, e, n) {
      this.deviceId = t, this.label = e, this.kind = "videoinput", this.groupId = n || void 0;
    }
    return r.prototype.toJSON = function() {
      return {
        kind: this.kind,
        groupId: this.groupId,
        deviceId: this.deviceId,
        label: this.label
      };
    }, r;
  }()
), gt = globalThis && globalThis.__awaiter || function(r, t, e, n) {
  function i(a) {
    return a instanceof e ? a : new e(function(o) {
      o(a);
    });
  }
  return new (e || (e = Promise))(function(a, o) {
    function f(c) {
      try {
        u(n.next(c));
      } catch (l) {
        o(l);
      }
    }
    function s(c) {
      try {
        u(n.throw(c));
      } catch (l) {
        o(l);
      }
    }
    function u(c) {
      c.done ? a(c.value) : i(c.value).then(f, s);
    }
    u((n = n.apply(r, t || [])).next());
  });
}, xt = globalThis && globalThis.__generator || function(r, t) {
  var e = { label: 0, sent: function() {
    if (a[0] & 1)
      throw a[1];
    return a[1];
  }, trys: [], ops: [] }, n, i, a, o;
  return o = { next: f(0), throw: f(1), return: f(2) }, typeof Symbol == "function" && (o[Symbol.iterator] = function() {
    return this;
  }), o;
  function f(u) {
    return function(c) {
      return s([u, c]);
    };
  }
  function s(u) {
    if (n)
      throw new TypeError("Generator is already executing.");
    for (; e; )
      try {
        if (n = 1, i && (a = u[0] & 2 ? i.return : u[0] ? i.throw || ((a = i.return) && a.call(i), 0) : i.next) && !(a = a.call(i, u[1])).done)
          return a;
        switch (i = 0, a && (u = [u[0] & 2, a.value]), u[0]) {
          case 0:
          case 1:
            a = u;
            break;
          case 4:
            return e.label++, { value: u[1], done: !1 };
          case 5:
            e.label++, i = u[1], u = [0];
            continue;
          case 7:
            u = e.ops.pop(), e.trys.pop();
            continue;
          default:
            if (a = e.trys, !(a = a.length > 0 && a[a.length - 1]) && (u[0] === 6 || u[0] === 2)) {
              e = 0;
              continue;
            }
            if (u[0] === 3 && (!a || u[1] > a[0] && u[1] < a[3])) {
              e.label = u[1];
              break;
            }
            if (u[0] === 6 && e.label < a[1]) {
              e.label = a[1], a = u;
              break;
            }
            if (a && e.label < a[2]) {
              e.label = a[2], e.ops.push(u);
              break;
            }
            a[2] && e.ops.pop(), e.trys.pop();
            continue;
        }
        u = t.call(r, e);
      } catch (c) {
        u = [6, c], i = 0;
      } finally {
        n = a = 0;
      }
    if (u[0] & 5)
      throw u[1];
    return { value: u[0] ? u[1] : void 0, done: !0 };
  }
}, Cn = globalThis && globalThis.__values || function(r) {
  var t = typeof Symbol == "function" && Symbol.iterator, e = t && r[t], n = 0;
  if (e)
    return e.call(r);
  if (r && typeof r.length == "number")
    return {
      next: function() {
        return r && n >= r.length && (r = void 0), { value: r && r[n++], done: !r };
      }
    };
  throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, $t = (
  /** @class */
  function() {
    function r(t, e, n) {
      e === void 0 && (e = 500), this.reader = t, this.timeBetweenScansMillis = e, this._hints = n, this._stopContinuousDecode = !1, this._stopAsyncDecode = !1, this._timeBetweenDecodingAttempts = 0;
    }
    return Object.defineProperty(r.prototype, "hasNavigator", {
      /**
       * If navigator is present.
       */
      get: function() {
        return typeof navigator < "u";
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "isMediaDevicesSuported", {
      /**
       * If mediaDevices under navigator is supported.
       */
      get: function() {
        return this.hasNavigator && !!navigator.mediaDevices;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "canEnumerateDevices", {
      /**
       * If enumerateDevices under navigator is supported.
       */
      get: function() {
        return !!(this.isMediaDevicesSuported && navigator.mediaDevices.enumerateDevices);
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "timeBetweenDecodingAttempts", {
      /** Time between two decoding tries in milli seconds. */
      get: function() {
        return this._timeBetweenDecodingAttempts;
      },
      /**
       * Change the time span the decoder waits between two decoding tries.
       *
       * @param {number} millis Time between two decoding tries in milli seconds.
       */
      set: function(t) {
        this._timeBetweenDecodingAttempts = t < 0 ? 0 : t;
      },
      enumerable: !1,
      configurable: !0
    }), Object.defineProperty(r.prototype, "hints", {
      /**
       * Sets the hints.
       */
      get: function() {
        return this._hints;
      },
      /**
       * Sets the hints.
       */
      set: function(t) {
        this._hints = t || null;
      },
      enumerable: !1,
      configurable: !0
    }), r.prototype.listVideoInputDevices = function() {
      return gt(this, void 0, void 0, function() {
        var t, e, n, i, a, o, f, s, u, c, l, h;
        return xt(this, function(d) {
          switch (d.label) {
            case 0:
              if (!this.hasNavigator)
                throw new Error("Can't enumerate devices, navigator is not present.");
              if (!this.canEnumerateDevices)
                throw new Error("Can't enumerate devices, method not supported.");
              return [4, navigator.mediaDevices.enumerateDevices()];
            case 1:
              t = d.sent(), e = [];
              try {
                for (n = Cn(t), i = n.next(); !i.done; i = n.next())
                  a = i.value, o = a.kind === "video" ? "videoinput" : a.kind, o === "videoinput" && (f = a.deviceId || a.id, s = a.label || "Video device " + (e.length + 1), u = a.groupId, c = { deviceId: f, label: s, kind: o, groupId: u }, e.push(c));
              } catch (v) {
                l = { error: v };
              } finally {
                try {
                  i && !i.done && (h = n.return) && h.call(n);
                } finally {
                  if (l)
                    throw l.error;
                }
              }
              return [2, e];
          }
        });
      });
    }, r.prototype.getVideoInputDevices = function() {
      return gt(this, void 0, void 0, function() {
        var t;
        return xt(this, function(e) {
          switch (e.label) {
            case 0:
              return [4, this.listVideoInputDevices()];
            case 1:
              return t = e.sent(), [2, t.map(function(n) {
                return new En(n.deviceId, n.label);
              })];
          }
        });
      });
    }, r.prototype.findDeviceById = function(t) {
      return gt(this, void 0, void 0, function() {
        var e;
        return xt(this, function(n) {
          switch (n.label) {
            case 0:
              return [4, this.listVideoInputDevices()];
            case 1:
              return e = n.sent(), e ? [2, e.find(function(i) {
                return i.deviceId === t;
              })] : [2, null];
          }
        });
      });
    }, r.prototype.decodeFromInputVideoDevice = function(t, e) {
      return gt(this, void 0, void 0, function() {
        return xt(this, function(n) {
          switch (n.label) {
            case 0:
              return [4, this.decodeOnceFromVideoDevice(t, e)];
            case 1:
              return [2, n.sent()];
          }
        });
      });
    }, r.prototype.decodeOnceFromVideoDevice = function(t, e) {
      return gt(this, void 0, void 0, function() {
        var n, i;
        return xt(this, function(a) {
          switch (a.label) {
            case 0:
              return this.reset(), t ? n = { deviceId: { exact: t } } : n = { facingMode: "environment" }, i = { video: n }, [4, this.decodeOnceFromConstraints(i, e)];
            case 1:
              return [2, a.sent()];
          }
        });
      });
    }, r.prototype.decodeOnceFromConstraints = function(t, e) {
      return gt(this, void 0, void 0, function() {
        var n;
        return xt(this, function(i) {
          switch (i.label) {
            case 0:
              return [4, navigator.mediaDevices.getUserMedia(t)];
            case 1:
              return n = i.sent(), [4, this.decodeOnceFromStream(n, e)];
            case 2:
              return [2, i.sent()];
          }
        });
      });
    }, r.prototype.decodeOnceFromStream = function(t, e) {
      return gt(this, void 0, void 0, function() {
        var n, i;
        return xt(this, function(a) {
          switch (a.label) {
            case 0:
              return this.reset(), [4, this.attachStreamToVideo(t, e)];
            case 1:
              return n = a.sent(), [4, this.decodeOnce(n)];
            case 2:
              return i = a.sent(), [2, i];
          }
        });
      });
    }, r.prototype.decodeFromInputVideoDeviceContinuously = function(t, e, n) {
      return gt(this, void 0, void 0, function() {
        return xt(this, function(i) {
          switch (i.label) {
            case 0:
              return [4, this.decodeFromVideoDevice(t, e, n)];
            case 1:
              return [2, i.sent()];
          }
        });
      });
    }, r.prototype.decodeFromVideoDevice = function(t, e, n) {
      return gt(this, void 0, void 0, function() {
        var i, a;
        return xt(this, function(o) {
          switch (o.label) {
            case 0:
              return t ? i = { deviceId: { exact: t } } : i = { facingMode: "environment" }, a = { video: i }, [4, this.decodeFromConstraints(a, e, n)];
            case 1:
              return [2, o.sent()];
          }
        });
      });
    }, r.prototype.decodeFromConstraints = function(t, e, n) {
      return gt(this, void 0, void 0, function() {
        var i;
        return xt(this, function(a) {
          switch (a.label) {
            case 0:
              return [4, navigator.mediaDevices.getUserMedia(t)];
            case 1:
              return i = a.sent(), [4, this.decodeFromStream(i, e, n)];
            case 2:
              return [2, a.sent()];
          }
        });
      });
    }, r.prototype.decodeFromStream = function(t, e, n) {
      return gt(this, void 0, void 0, function() {
        var i;
        return xt(this, function(a) {
          switch (a.label) {
            case 0:
              return this.reset(), [4, this.attachStreamToVideo(t, e)];
            case 1:
              return i = a.sent(), [4, this.decodeContinuously(i, n)];
            case 2:
              return [2, a.sent()];
          }
        });
      });
    }, r.prototype.stopAsyncDecode = function() {
      this._stopAsyncDecode = !0;
    }, r.prototype.stopContinuousDecode = function() {
      this._stopContinuousDecode = !0;
    }, r.prototype.attachStreamToVideo = function(t, e) {
      return gt(this, void 0, void 0, function() {
        var n;
        return xt(this, function(i) {
          switch (i.label) {
            case 0:
              return n = this.prepareVideoElement(e), this.addVideoSource(n, t), this.videoElement = n, this.stream = t, [4, this.playVideoOnLoadAsync(n)];
            case 1:
              return i.sent(), [2, n];
          }
        });
      });
    }, r.prototype.playVideoOnLoadAsync = function(t) {
      var e = this;
      return new Promise(function(n, i) {
        return e.playVideoOnLoad(t, function() {
          return n();
        });
      });
    }, r.prototype.playVideoOnLoad = function(t, e) {
      var n = this;
      this.videoEndedListener = function() {
        return n.stopStreams();
      }, this.videoCanPlayListener = function() {
        return n.tryPlayVideo(t);
      }, t.addEventListener("ended", this.videoEndedListener), t.addEventListener("canplay", this.videoCanPlayListener), t.addEventListener("playing", e), this.tryPlayVideo(t);
    }, r.prototype.isVideoPlaying = function(t) {
      return t.currentTime > 0 && !t.paused && !t.ended && t.readyState > 2;
    }, r.prototype.tryPlayVideo = function(t) {
      return gt(this, void 0, void 0, function() {
        return xt(this, function(e) {
          switch (e.label) {
            case 0:
              if (this.isVideoPlaying(t))
                return console.warn("Trying to play video that is already playing."), [
                  2
                  /*return*/
                ];
              e.label = 1;
            case 1:
              return e.trys.push([1, 3, , 4]), [4, t.play()];
            case 2:
              return e.sent(), [3, 4];
            case 3:
              return e.sent(), console.warn("It was not possible to play the video."), [3, 4];
            case 4:
              return [
                2
                /*return*/
              ];
          }
        });
      });
    }, r.prototype.getMediaElement = function(t, e) {
      var n = document.getElementById(t);
      if (!n)
        throw new tt("element with id '" + t + "' not found");
      if (n.nodeName.toLowerCase() !== e.toLowerCase())
        throw new tt("element with id '" + t + "' must be an " + e + " element");
      return n;
    }, r.prototype.decodeFromImage = function(t, e) {
      if (!t && !e)
        throw new tt("either imageElement with a src set or an url must be provided");
      return e && !t ? this.decodeFromImageUrl(e) : this.decodeFromImageElement(t);
    }, r.prototype.decodeFromVideo = function(t, e) {
      if (!t && !e)
        throw new tt("Either an element with a src set or an URL must be provided");
      return e && !t ? this.decodeFromVideoUrl(e) : this.decodeFromVideoElement(t);
    }, r.prototype.decodeFromVideoContinuously = function(t, e, n) {
      if (t === void 0 && e === void 0)
        throw new tt("Either an element with a src set or an URL must be provided");
      return e && !t ? this.decodeFromVideoUrlContinuously(e, n) : this.decodeFromVideoElementContinuously(t, n);
    }, r.prototype.decodeFromImageElement = function(t) {
      if (!t)
        throw new tt("An image element must be provided.");
      this.reset();
      var e = this.prepareImageElement(t);
      this.imageElement = e;
      var n;
      return this.isImageLoaded(e) ? n = this.decodeOnce(e, !1, !0) : n = this._decodeOnLoadImage(e), n;
    }, r.prototype.decodeFromVideoElement = function(t) {
      var e = this._decodeFromVideoElementSetup(t);
      return this._decodeOnLoadVideo(e);
    }, r.prototype.decodeFromVideoElementContinuously = function(t, e) {
      var n = this._decodeFromVideoElementSetup(t);
      return this._decodeOnLoadVideoContinuously(n, e);
    }, r.prototype._decodeFromVideoElementSetup = function(t) {
      if (!t)
        throw new tt("A video element must be provided.");
      this.reset();
      var e = this.prepareVideoElement(t);
      return this.videoElement = e, e;
    }, r.prototype.decodeFromImageUrl = function(t) {
      if (!t)
        throw new tt("An URL must be provided.");
      this.reset();
      var e = this.prepareImageElement();
      this.imageElement = e;
      var n = this._decodeOnLoadImage(e);
      return e.src = t, n;
    }, r.prototype.decodeFromVideoUrl = function(t) {
      if (!t)
        throw new tt("An URL must be provided.");
      this.reset();
      var e = this.prepareVideoElement(), n = this.decodeFromVideoElement(e);
      return e.src = t, n;
    }, r.prototype.decodeFromVideoUrlContinuously = function(t, e) {
      if (!t)
        throw new tt("An URL must be provided.");
      this.reset();
      var n = this.prepareVideoElement(), i = this.decodeFromVideoElementContinuously(n, e);
      return n.src = t, i;
    }, r.prototype._decodeOnLoadImage = function(t) {
      var e = this;
      return new Promise(function(n, i) {
        e.imageLoadedListener = function() {
          return e.decodeOnce(t, !1, !0).then(n, i);
        }, t.addEventListener("load", e.imageLoadedListener);
      });
    }, r.prototype._decodeOnLoadVideo = function(t) {
      return gt(this, void 0, void 0, function() {
        return xt(this, function(e) {
          switch (e.label) {
            case 0:
              return [4, this.playVideoOnLoadAsync(t)];
            case 1:
              return e.sent(), [4, this.decodeOnce(t)];
            case 2:
              return [2, e.sent()];
          }
        });
      });
    }, r.prototype._decodeOnLoadVideoContinuously = function(t, e) {
      return gt(this, void 0, void 0, function() {
        return xt(this, function(n) {
          switch (n.label) {
            case 0:
              return [4, this.playVideoOnLoadAsync(t)];
            case 1:
              return n.sent(), this.decodeContinuously(t, e), [
                2
                /*return*/
              ];
          }
        });
      });
    }, r.prototype.isImageLoaded = function(t) {
      return !(!t.complete || t.naturalWidth === 0);
    }, r.prototype.prepareImageElement = function(t) {
      var e;
      return typeof t > "u" && (e = document.createElement("img"), e.width = 200, e.height = 200), typeof t == "string" && (e = this.getMediaElement(t, "img")), t instanceof HTMLImageElement && (e = t), e;
    }, r.prototype.prepareVideoElement = function(t) {
      var e;
      return !t && typeof document < "u" && (e = document.createElement("video"), e.width = 200, e.height = 200), typeof t == "string" && (e = this.getMediaElement(t, "video")), t instanceof HTMLVideoElement && (e = t), e.setAttribute("autoplay", "true"), e.setAttribute("muted", "true"), e.setAttribute("playsinline", "true"), e;
    }, r.prototype.decodeOnce = function(t, e, n) {
      var i = this;
      e === void 0 && (e = !0), n === void 0 && (n = !0), this._stopAsyncDecode = !1;
      var a = function(o, f) {
        if (i._stopAsyncDecode) {
          f(new C("Video stream has ended before any code could be detected.")), i._stopAsyncDecode = void 0;
          return;
        }
        try {
          var s = i.decode(t);
          o(s);
        } catch (h) {
          var u = e && h instanceof C, c = h instanceof et || h instanceof T, l = c && n;
          if (u || l)
            return setTimeout(a, i._timeBetweenDecodingAttempts, o, f);
          f(h);
        }
      };
      return new Promise(function(o, f) {
        return a(o, f);
      });
    }, r.prototype.decodeContinuously = function(t, e) {
      var n = this;
      this._stopContinuousDecode = !1;
      var i = function() {
        if (n._stopContinuousDecode) {
          n._stopContinuousDecode = void 0;
          return;
        }
        try {
          var a = n.decode(t);
          e(a, null), setTimeout(i, n.timeBetweenScansMillis);
        } catch (s) {
          e(null, s);
          var o = s instanceof et || s instanceof T, f = s instanceof C;
          (o || f) && setTimeout(i, n._timeBetweenDecodingAttempts);
        }
      };
      i();
    }, r.prototype.decode = function(t) {
      var e = this.createBinaryBitmap(t);
      return this.decodeBitmap(e);
    }, r.prototype.createBinaryBitmap = function(t) {
      this.getCaptureCanvasContext(t), t instanceof HTMLVideoElement ? this.drawFrameOnCanvas(t) : this.drawImageOnCanvas(t);
      var e = this.getCaptureCanvas(t), n = new An(e), i = new Fr(n);
      return new Br(i);
    }, r.prototype.getCaptureCanvasContext = function(t) {
      if (!this.captureCanvasContext) {
        var e = this.getCaptureCanvas(t), n = void 0;
        try {
          n = e.getContext("2d", { willReadFrequently: !0 });
        } catch {
          n = e.getContext("2d");
        }
        this.captureCanvasContext = n;
      }
      return this.captureCanvasContext;
    }, r.prototype.getCaptureCanvas = function(t) {
      if (!this.captureCanvas) {
        var e = this.createCaptureCanvas(t);
        this.captureCanvas = e;
      }
      return this.captureCanvas;
    }, r.prototype.drawFrameOnCanvas = function(t, e, n) {
      e === void 0 && (e = {
        sx: 0,
        sy: 0,
        sWidth: t.videoWidth,
        sHeight: t.videoHeight,
        dx: 0,
        dy: 0,
        dWidth: t.videoWidth,
        dHeight: t.videoHeight
      }), n === void 0 && (n = this.captureCanvasContext), n.drawImage(t, e.sx, e.sy, e.sWidth, e.sHeight, e.dx, e.dy, e.dWidth, e.dHeight);
    }, r.prototype.drawImageOnCanvas = function(t, e, n) {
      e === void 0 && (e = {
        sx: 0,
        sy: 0,
        sWidth: t.naturalWidth,
        sHeight: t.naturalHeight,
        dx: 0,
        dy: 0,
        dWidth: t.naturalWidth,
        dHeight: t.naturalHeight
      }), n === void 0 && (n = this.captureCanvasContext), n.drawImage(t, e.sx, e.sy, e.sWidth, e.sHeight, e.dx, e.dy, e.dWidth, e.dHeight);
    }, r.prototype.decodeBitmap = function(t) {
      return this.reader.decode(t, this._hints);
    }, r.prototype.createCaptureCanvas = function(t) {
      if (typeof document > "u")
        return this._destroyCaptureCanvas(), null;
      var e = document.createElement("canvas"), n, i;
      return typeof t < "u" && (t instanceof HTMLVideoElement ? (n = t.videoWidth, i = t.videoHeight) : t instanceof HTMLImageElement && (n = t.naturalWidth || t.width, i = t.naturalHeight || t.height)), e.style.width = n + "px", e.style.height = i + "px", e.width = n, e.height = i, e;
    }, r.prototype.stopStreams = function() {
      this.stream && (this.stream.getVideoTracks().forEach(function(t) {
        return t.stop();
      }), this.stream = void 0), this._stopAsyncDecode === !1 && this.stopAsyncDecode(), this._stopContinuousDecode === !1 && this.stopContinuousDecode();
    }, r.prototype.reset = function() {
      this.stopStreams(), this._destroyVideoElement(), this._destroyImageElement(), this._destroyCaptureCanvas();
    }, r.prototype._destroyVideoElement = function() {
      this.videoElement && (typeof this.videoEndedListener < "u" && this.videoElement.removeEventListener("ended", this.videoEndedListener), typeof this.videoPlayingEventListener < "u" && this.videoElement.removeEventListener("playing", this.videoPlayingEventListener), typeof this.videoCanPlayListener < "u" && this.videoElement.removeEventListener("loadedmetadata", this.videoCanPlayListener), this.cleanVideoSource(this.videoElement), this.videoElement = void 0);
    }, r.prototype._destroyImageElement = function() {
      this.imageElement && (this.imageLoadedListener !== void 0 && this.imageElement.removeEventListener("load", this.imageLoadedListener), this.imageElement.src = void 0, this.imageElement.removeAttribute("src"), this.imageElement = void 0);
    }, r.prototype._destroyCaptureCanvas = function() {
      this.captureCanvasContext = void 0, this.captureCanvas = void 0;
    }, r.prototype.addVideoSource = function(t, e) {
      try {
        t.srcObject = e;
      } catch {
        t.src = URL.createObjectURL(e);
      }
    }, r.prototype.cleanVideoSource = function(t) {
      try {
        t.srcObject = null;
      } catch {
        t.src = "";
      }
      this.videoElement.removeAttribute("src");
    }, r;
  }()
), pt = (
  /** @class */
  function() {
    function r(t, e, n, i, a, o) {
      n === void 0 && (n = e == null ? 0 : 8 * e.length), o === void 0 && (o = j.currentTimeMillis()), this.text = t, this.rawBytes = e, this.numBits = n, this.resultPoints = i, this.format = a, this.timestamp = o, this.text = t, this.rawBytes = e, n == null ? this.numBits = e == null ? 0 : 8 * e.length : this.numBits = n, this.resultPoints = i, this.format = a, this.resultMetadata = null, o == null ? this.timestamp = j.currentTimeMillis() : this.timestamp = o;
    }
    return r.prototype.getText = function() {
      return this.text;
    }, r.prototype.getRawBytes = function() {
      return this.rawBytes;
    }, r.prototype.getNumBits = function() {
      return this.numBits;
    }, r.prototype.getResultPoints = function() {
      return this.resultPoints;
    }, r.prototype.getBarcodeFormat = function() {
      return this.format;
    }, r.prototype.getResultMetadata = function() {
      return this.resultMetadata;
    }, r.prototype.putMetadata = function(t, e) {
      this.resultMetadata === null && (this.resultMetadata = /* @__PURE__ */ new Map()), this.resultMetadata.set(t, e);
    }, r.prototype.putAllMetadata = function(t) {
      t !== null && (this.resultMetadata === null ? this.resultMetadata = t : this.resultMetadata = new Map(t));
    }, r.prototype.addResultPoints = function(t) {
      var e = this.resultPoints;
      if (e === null)
        this.resultPoints = t;
      else if (t !== null && t.length > 0) {
        var n = new Array(e.length + t.length);
        j.arraycopy(e, 0, n, 0, e.length), j.arraycopy(t, 0, n, e.length, t.length), this.resultPoints = n;
      }
    }, r.prototype.getTimestamp = function() {
      return this.timestamp;
    }, r.prototype.toString = function() {
      return this.text;
    }, r;
  }()
), Be;
(function(r) {
  r[r.AZTEC = 0] = "AZTEC", r[r.CODABAR = 1] = "CODABAR", r[r.CODE_39 = 2] = "CODE_39", r[r.CODE_93 = 3] = "CODE_93", r[r.CODE_128 = 4] = "CODE_128", r[r.DATA_MATRIX = 5] = "DATA_MATRIX", r[r.EAN_8 = 6] = "EAN_8", r[r.EAN_13 = 7] = "EAN_13", r[r.ITF = 8] = "ITF", r[r.MAXICODE = 9] = "MAXICODE", r[r.PDF_417 = 10] = "PDF_417", r[r.QR_CODE = 11] = "QR_CODE", r[r.RSS_14 = 12] = "RSS_14", r[r.RSS_EXPANDED = 13] = "RSS_EXPANDED", r[r.UPC_A = 14] = "UPC_A", r[r.UPC_E = 15] = "UPC_E", r[r.UPC_EAN_EXTENSION = 16] = "UPC_EAN_EXTENSION";
})(Be || (Be = {}));
const N = Be;
var Fe;
(function(r) {
  r[r.OTHER = 0] = "OTHER", r[r.ORIENTATION = 1] = "ORIENTATION", r[r.BYTE_SEGMENTS = 2] = "BYTE_SEGMENTS", r[r.ERROR_CORRECTION_LEVEL = 3] = "ERROR_CORRECTION_LEVEL", r[r.ISSUE_NUMBER = 4] = "ISSUE_NUMBER", r[r.SUGGESTED_PRICE = 5] = "SUGGESTED_PRICE", r[r.POSSIBLE_COUNTRY = 6] = "POSSIBLE_COUNTRY", r[r.UPC_EAN_EXTENSION = 7] = "UPC_EAN_EXTENSION", r[r.PDF417_EXTRA_METADATA = 8] = "PDF417_EXTRA_METADATA", r[r.STRUCTURED_APPEND_SEQUENCE = 9] = "STRUCTURED_APPEND_SEQUENCE", r[r.STRUCTURED_APPEND_PARITY = 10] = "STRUCTURED_APPEND_PARITY";
})(Fe || (Fe = {}));
const dt = Fe;
var we = (
  /** @class */
  function() {
    function r(t, e, n, i, a, o) {
      a === void 0 && (a = -1), o === void 0 && (o = -1), this.rawBytes = t, this.text = e, this.byteSegments = n, this.ecLevel = i, this.structuredAppendSequenceNumber = a, this.structuredAppendParity = o, this.numBits = t == null ? 0 : 8 * t.length;
    }
    return r.prototype.getRawBytes = function() {
      return this.rawBytes;
    }, r.prototype.getNumBits = function() {
      return this.numBits;
    }, r.prototype.setNumBits = function(t) {
      this.numBits = t;
    }, r.prototype.getText = function() {
      return this.text;
    }, r.prototype.getByteSegments = function() {
      return this.byteSegments;
    }, r.prototype.getECLevel = function() {
      return this.ecLevel;
    }, r.prototype.getErrorsCorrected = function() {
      return this.errorsCorrected;
    }, r.prototype.setErrorsCorrected = function(t) {
      this.errorsCorrected = t;
    }, r.prototype.getErasures = function() {
      return this.erasures;
    }, r.prototype.setErasures = function(t) {
      this.erasures = t;
    }, r.prototype.getOther = function() {
      return this.other;
    }, r.prototype.setOther = function(t) {
      this.other = t;
    }, r.prototype.hasStructuredAppend = function() {
      return this.structuredAppendParity >= 0 && this.structuredAppendSequenceNumber >= 0;
    }, r.prototype.getStructuredAppendParity = function() {
      return this.structuredAppendParity;
    }, r.prototype.getStructuredAppendSequenceNumber = function() {
      return this.structuredAppendSequenceNumber;
    }, r;
  }()
), ee = (
  /** @class */
  function() {
    function r() {
    }
    return r.prototype.exp = function(t) {
      return this.expTable[t];
    }, r.prototype.log = function(t) {
      if (t === 0)
        throw new D();
      return this.logTable[t];
    }, r.addOrSubtract = function(t, e) {
      return t ^ e;
    }, r;
  }()
), Ft = (
  /** @class */
  function() {
    function r(t, e) {
      if (e.length === 0)
        throw new D();
      this.field = t;
      var n = e.length;
      if (n > 1 && e[0] === 0) {
        for (var i = 1; i < n && e[i] === 0; )
          i++;
        i === n ? this.coefficients = Int32Array.from([0]) : (this.coefficients = new Int32Array(n - i), j.arraycopy(e, i, this.coefficients, 0, this.coefficients.length));
      } else
        this.coefficients = e;
    }
    return r.prototype.getCoefficients = function() {
      return this.coefficients;
    }, r.prototype.getDegree = function() {
      return this.coefficients.length - 1;
    }, r.prototype.isZero = function() {
      return this.coefficients[0] === 0;
    }, r.prototype.getCoefficient = function(t) {
      return this.coefficients[this.coefficients.length - 1 - t];
    }, r.prototype.evaluateAt = function(t) {
      if (t === 0)
        return this.getCoefficient(0);
      var e = this.coefficients, n;
      if (t === 1) {
        n = 0;
        for (var i = 0, a = e.length; i !== a; i++) {
          var o = e[i];
          n = ee.addOrSubtract(n, o);
        }
        return n;
      }
      n = e[0];
      for (var f = e.length, s = this.field, i = 1; i < f; i++)
        n = ee.addOrSubtract(s.multiply(t, n), e[i]);
      return n;
    }, r.prototype.addOrSubtract = function(t) {
      if (!this.field.equals(t.field))
        throw new D("GenericGFPolys do not have same GenericGF field");
      if (this.isZero())
        return t;
      if (t.isZero())
        return this;
      var e = this.coefficients, n = t.coefficients;
      if (e.length > n.length) {
        var i = e;
        e = n, n = i;
      }
      var a = new Int32Array(n.length), o = n.length - e.length;
      j.arraycopy(n, 0, a, 0, o);
      for (var f = o; f < n.length; f++)
        a[f] = ee.addOrSubtract(e[f - o], n[f]);
      return new r(this.field, a);
    }, r.prototype.multiply = function(t) {
      if (!this.field.equals(t.field))
        throw new D("GenericGFPolys do not have same GenericGF field");
      if (this.isZero() || t.isZero())
        return this.field.getZero();
      for (var e = this.coefficients, n = e.length, i = t.coefficients, a = i.length, o = new Int32Array(n + a - 1), f = this.field, s = 0; s < n; s++)
        for (var u = e[s], c = 0; c < a; c++)
          o[s + c] = ee.addOrSubtract(o[s + c], f.multiply(u, i[c]));
      return new r(f, o);
    }, r.prototype.multiplyScalar = function(t) {
      if (t === 0)
        return this.field.getZero();
      if (t === 1)
        return this;
      for (var e = this.coefficients.length, n = this.field, i = new Int32Array(e), a = this.coefficients, o = 0; o < e; o++)
        i[o] = n.multiply(a[o], t);
      return new r(n, i);
    }, r.prototype.multiplyByMonomial = function(t, e) {
      if (t < 0)
        throw new D();
      if (e === 0)
        return this.field.getZero();
      for (var n = this.coefficients, i = n.length, a = new Int32Array(i + t), o = this.field, f = 0; f < i; f++)
        a[f] = o.multiply(n[f], e);
      return new r(o, a);
    }, r.prototype.divide = function(t) {
      if (!this.field.equals(t.field))
        throw new D("GenericGFPolys do not have same GenericGF field");
      if (t.isZero())
        throw new D("Divide by 0");
      for (var e = this.field, n = e.getZero(), i = this, a = t.getCoefficient(t.getDegree()), o = e.inverse(a); i.getDegree() >= t.getDegree() && !i.isZero(); ) {
        var f = i.getDegree() - t.getDegree(), s = e.multiply(i.getCoefficient(i.getDegree()), o), u = t.multiplyByMonomial(f, s), c = e.buildMonomial(f, s);
        n = n.addOrSubtract(c), i = i.addOrSubtract(u);
      }
      return [n, i];
    }, r.prototype.toString = function() {
      for (var t = "", e = this.getDegree(); e >= 0; e--) {
        var n = this.getCoefficient(e);
        if (n !== 0) {
          if (n < 0 ? (t += " - ", n = -n) : t.length > 0 && (t += " + "), e === 0 || n !== 1) {
            var i = this.field.log(n);
            i === 0 ? t += "1" : i === 1 ? t += "a" : (t += "a^", t += i);
          }
          e !== 0 && (e === 1 ? t += "x" : (t += "x^", t += e));
        }
      }
      return t;
    }, r;
  }()
), mn = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), Lr = (
  /** @class */
  function(r) {
    mn(t, r);
    function t() {
      return r !== null && r.apply(this, arguments) || this;
    }
    return t.kind = "ArithmeticException", t;
  }(At)
), In = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), _t = (
  /** @class */
  function(r) {
    In(t, r);
    function t(e, n, i) {
      var a = r.call(this) || this;
      a.primitive = e, a.size = n, a.generatorBase = i;
      for (var o = new Int32Array(n), f = 1, s = 0; s < n; s++)
        o[s] = f, f *= 2, f >= n && (f ^= e, f &= n - 1);
      a.expTable = o;
      for (var u = new Int32Array(n), s = 0; s < n - 1; s++)
        u[o[s]] = s;
      return a.logTable = u, a.zero = new Ft(a, Int32Array.from([0])), a.one = new Ft(a, Int32Array.from([1])), a;
    }
    return t.prototype.getZero = function() {
      return this.zero;
    }, t.prototype.getOne = function() {
      return this.one;
    }, t.prototype.buildMonomial = function(e, n) {
      if (e < 0)
        throw new D();
      if (n === 0)
        return this.zero;
      var i = new Int32Array(e + 1);
      return i[0] = n, new Ft(this, i);
    }, t.prototype.inverse = function(e) {
      if (e === 0)
        throw new Lr();
      return this.expTable[this.size - this.logTable[e] - 1];
    }, t.prototype.multiply = function(e, n) {
      return e === 0 || n === 0 ? 0 : this.expTable[(this.logTable[e] + this.logTable[n]) % (this.size - 1)];
    }, t.prototype.getSize = function() {
      return this.size;
    }, t.prototype.getGeneratorBase = function() {
      return this.generatorBase;
    }, t.prototype.toString = function() {
      return "GF(0x" + B.toHexString(this.primitive) + "," + this.size + ")";
    }, t.prototype.equals = function(e) {
      return e === this;
    }, t.AZTEC_DATA_12 = new t(4201, 4096, 1), t.AZTEC_DATA_10 = new t(1033, 1024, 1), t.AZTEC_DATA_6 = new t(67, 64, 1), t.AZTEC_PARAM = new t(19, 16, 1), t.QR_CODE_FIELD_256 = new t(285, 256, 0), t.DATA_MATRIX_FIELD_256 = new t(301, 256, 1), t.AZTEC_DATA_8 = t.DATA_MATRIX_FIELD_256, t.MAXICODE_FIELD_64 = t.AZTEC_DATA_6, t;
  }(ee)
), Sn = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), ae = (
  /** @class */
  function(r) {
    Sn(t, r);
    function t() {
      return r !== null && r.apply(this, arguments) || this;
    }
    return t.kind = "ReedSolomonException", t;
  }(At)
), Tn = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), Kt = (
  /** @class */
  function(r) {
    Tn(t, r);
    function t() {
      return r !== null && r.apply(this, arguments) || this;
    }
    return t.kind = "IllegalStateException", t;
  }(At)
), _e = (
  /** @class */
  function() {
    function r(t) {
      this.field = t;
    }
    return r.prototype.decode = function(t, e) {
      for (var n = this.field, i = new Ft(n, t), a = new Int32Array(e), o = !0, f = 0; f < e; f++) {
        var s = i.evaluateAt(n.exp(f + n.getGeneratorBase()));
        a[a.length - 1 - f] = s, s !== 0 && (o = !1);
      }
      if (!o)
        for (var u = new Ft(n, a), c = this.runEuclideanAlgorithm(n.buildMonomial(e, 1), u, e), l = c[0], h = c[1], d = this.findErrorLocations(l), v = this.findErrorMagnitudes(h, d), f = 0; f < d.length; f++) {
          var g = t.length - 1 - n.log(d[f]);
          if (g < 0)
            throw new ae("Bad error location");
          t[g] = _t.addOrSubtract(t[g], v[f]);
        }
    }, r.prototype.runEuclideanAlgorithm = function(t, e, n) {
      if (t.getDegree() < e.getDegree()) {
        var i = t;
        t = e, e = i;
      }
      for (var a = this.field, o = t, f = e, s = a.getZero(), u = a.getOne(); f.getDegree() >= (n / 2 | 0); ) {
        var c = o, l = s;
        if (o = f, s = u, o.isZero())
          throw new ae("r_{i-1} was zero");
        f = c;
        for (var h = a.getZero(), d = o.getCoefficient(o.getDegree()), v = a.inverse(d); f.getDegree() >= o.getDegree() && !f.isZero(); ) {
          var g = f.getDegree() - o.getDegree(), x = a.multiply(f.getCoefficient(f.getDegree()), v);
          h = h.addOrSubtract(a.buildMonomial(g, x)), f = f.addOrSubtract(o.multiplyByMonomial(g, x));
        }
        if (u = h.multiply(s).addOrSubtract(l), f.getDegree() >= o.getDegree())
          throw new Kt("Division algorithm failed to reduce polynomial?");
      }
      var w = u.getCoefficient(0);
      if (w === 0)
        throw new ae("sigmaTilde(0) was zero");
      var y = a.inverse(w), _ = u.multiplyScalar(y), E = f.multiplyScalar(y);
      return [_, E];
    }, r.prototype.findErrorLocations = function(t) {
      var e = t.getDegree();
      if (e === 1)
        return Int32Array.from([t.getCoefficient(1)]);
      for (var n = new Int32Array(e), i = 0, a = this.field, o = 1; o < a.getSize() && i < e; o++)
        t.evaluateAt(o) === 0 && (n[i] = a.inverse(o), i++);
      if (i !== e)
        throw new ae("Error locator degree does not match number of roots");
      return n;
    }, r.prototype.findErrorMagnitudes = function(t, e) {
      for (var n = e.length, i = new Int32Array(n), a = this.field, o = 0; o < n; o++) {
        for (var f = a.inverse(e[o]), s = 1, u = 0; u < n; u++)
          if (o !== u) {
            var c = a.multiply(e[u], f), l = c & 1 ? c & -2 : c | 1;
            s = a.multiply(s, l);
          }
        i[o] = a.multiply(t.evaluateAt(f), a.inverse(s)), a.getGeneratorBase() !== 0 && (i[o] = a.multiply(i[o], f));
      }
      return i;
    }, r;
  }()
), lt;
(function(r) {
  r[r.UPPER = 0] = "UPPER", r[r.LOWER = 1] = "LOWER", r[r.MIXED = 2] = "MIXED", r[r.DIGIT = 3] = "DIGIT", r[r.PUNCT = 4] = "PUNCT", r[r.BINARY = 5] = "BINARY";
})(lt || (lt = {}));
var tr = (
  /** @class */
  function() {
    function r() {
    }
    return r.prototype.decode = function(t) {
      this.ddata = t;
      var e = t.getBits(), n = this.extractBits(e), i = this.correctBits(n), a = r.convertBoolArrayToByteArray(i), o = r.getEncodedData(i), f = new we(a, o, null, null);
      return f.setNumBits(i.length), f;
    }, r.highLevelDecode = function(t) {
      return this.getEncodedData(t);
    }, r.getEncodedData = function(t) {
      for (var e = t.length, n = lt.UPPER, i = lt.UPPER, a = "", o = 0; o < e; )
        if (i === lt.BINARY) {
          if (e - o < 5)
            break;
          var f = r.readCode(t, o, 5);
          if (o += 5, f === 0) {
            if (e - o < 11)
              break;
            f = r.readCode(t, o, 11) + 31, o += 11;
          }
          for (var s = 0; s < f; s++) {
            if (e - o < 8) {
              o = e;
              break;
            }
            var u = r.readCode(t, o, 8);
            a += /*(char)*/
            F.castAsNonUtf8Char(u), o += 8;
          }
          i = n;
        } else {
          var c = i === lt.DIGIT ? 4 : 5;
          if (e - o < c)
            break;
          var u = r.readCode(t, o, c);
          o += c;
          var l = r.getCharacter(i, u);
          l.startsWith("CTRL_") ? (n = i, i = r.getTable(l.charAt(5)), l.charAt(6) === "L" && (n = i)) : (a += l, i = n);
        }
      return a;
    }, r.getTable = function(t) {
      switch (t) {
        case "L":
          return lt.LOWER;
        case "P":
          return lt.PUNCT;
        case "M":
          return lt.MIXED;
        case "D":
          return lt.DIGIT;
        case "B":
          return lt.BINARY;
        case "U":
        default:
          return lt.UPPER;
      }
    }, r.getCharacter = function(t, e) {
      switch (t) {
        case lt.UPPER:
          return r.UPPER_TABLE[e];
        case lt.LOWER:
          return r.LOWER_TABLE[e];
        case lt.MIXED:
          return r.MIXED_TABLE[e];
        case lt.PUNCT:
          return r.PUNCT_TABLE[e];
        case lt.DIGIT:
          return r.DIGIT_TABLE[e];
        default:
          throw new Kt("Bad table");
      }
    }, r.prototype.correctBits = function(t) {
      var e, n;
      this.ddata.getNbLayers() <= 2 ? (n = 6, e = _t.AZTEC_DATA_6) : this.ddata.getNbLayers() <= 8 ? (n = 8, e = _t.AZTEC_DATA_8) : this.ddata.getNbLayers() <= 22 ? (n = 10, e = _t.AZTEC_DATA_10) : (n = 12, e = _t.AZTEC_DATA_12);
      var i = this.ddata.getNbDatablocks(), a = t.length / n;
      if (a < i)
        throw new T();
      for (var o = t.length % n, f = new Int32Array(a), s = 0; s < a; s++, o += n)
        f[s] = r.readCode(t, o, n);
      try {
        var u = new _e(e);
        u.decode(f, a - i);
      } catch (x) {
        throw new T(x);
      }
      for (var c = (1 << n) - 1, l = 0, s = 0; s < i; s++) {
        var h = f[s];
        if (h === 0 || h === c)
          throw new T();
        (h === 1 || h === c - 1) && l++;
      }
      for (var d = new Array(i * n - l), v = 0, s = 0; s < i; s++) {
        var h = f[s];
        if (h === 1 || h === c - 1)
          d.fill(h > 1, v, v + n - 1), v += n - 1;
        else
          for (var g = n - 1; g >= 0; --g)
            d[v++] = (h & 1 << g) !== 0;
      }
      return d;
    }, r.prototype.extractBits = function(t) {
      var e = this.ddata.isCompact(), n = this.ddata.getNbLayers(), i = (e ? 11 : 14) + n * 4, a = new Int32Array(i), o = new Array(this.totalBitsInLayer(n, e));
      if (e)
        for (var f = 0; f < a.length; f++)
          a[f] = f;
      else
        for (var s = i + 1 + 2 * B.truncDivision(B.truncDivision(i, 2) - 1, 15), u = i / 2, c = B.truncDivision(s, 2), f = 0; f < u; f++) {
          var l = f + B.truncDivision(f, 15);
          a[u - f - 1] = c - l - 1, a[u + f] = c + l + 1;
        }
      for (var f = 0, h = 0; f < n; f++) {
        for (var d = (n - f) * 4 + (e ? 9 : 12), v = f * 2, g = i - 1 - v, x = 0; x < d; x++)
          for (var w = x * 2, y = 0; y < 2; y++)
            o[h + w + y] = t.get(a[v + y], a[v + x]), o[h + 2 * d + w + y] = t.get(a[v + x], a[g - y]), o[h + 4 * d + w + y] = t.get(a[g - y], a[g - x]), o[h + 6 * d + w + y] = t.get(a[g - x], a[v + y]);
        h += d * 8;
      }
      return o;
    }, r.readCode = function(t, e, n) {
      for (var i = 0, a = e; a < e + n; a++)
        i <<= 1, t[a] && (i |= 1);
      return i;
    }, r.readByte = function(t, e) {
      var n = t.length - e;
      return n >= 8 ? r.readCode(t, e, 8) : r.readCode(t, e, n) << 8 - n;
    }, r.convertBoolArrayToByteArray = function(t) {
      for (var e = new Uint8Array((t.length + 7) / 8), n = 0; n < e.length; n++)
        e[n] = r.readByte(t, 8 * n);
      return e;
    }, r.prototype.totalBitsInLayer = function(t, e) {
      return ((e ? 88 : 112) + 16 * t) * t;
    }, r.UPPER_TABLE = [
      "CTRL_PS",
      " ",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
      "CTRL_LL",
      "CTRL_ML",
      "CTRL_DL",
      "CTRL_BS"
    ], r.LOWER_TABLE = [
      "CTRL_PS",
      " ",
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
      "CTRL_US",
      "CTRL_ML",
      "CTRL_DL",
      "CTRL_BS"
    ], r.MIXED_TABLE = [
      // Module parse failed: Octal literal in strict mode (50:29)
      // so number string were scaped
      "CTRL_PS",
      " ",
      "\\1",
      "\\2",
      "\\3",
      "\\4",
      "\\5",
      "\\6",
      "\\7",
      "\b",
      "	",
      `
`,
      "\\13",
      "\f",
      "\r",
      "\\33",
      "\\34",
      "\\35",
      "\\36",
      "\\37",
      "@",
      "\\",
      "^",
      "_",
      "`",
      "|",
      "~",
      "\\177",
      "CTRL_LL",
      "CTRL_UL",
      "CTRL_PL",
      "CTRL_BS"
    ], r.PUNCT_TABLE = [
      "",
      "\r",
      `\r
`,
      ". ",
      ", ",
      ": ",
      "!",
      '"',
      "#",
      "$",
      "%",
      "&",
      "'",
      "(",
      ")",
      "*",
      "+",
      ",",
      "-",
      ".",
      "/",
      ":",
      ";",
      "<",
      "=",
      ">",
      "?",
      "[",
      "]",
      "{",
      "}",
      "CTRL_UL"
    ], r.DIGIT_TABLE = [
      "CTRL_PS",
      " ",
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      ",",
      ".",
      "CTRL_UL",
      "CTRL_US"
    ], r;
  }()
), U = (
  /** @class */
  function() {
    function r() {
    }
    return r.round = function(t) {
      return isNaN(t) ? 0 : t <= Number.MIN_SAFE_INTEGER ? Number.MIN_SAFE_INTEGER : t >= Number.MAX_SAFE_INTEGER ? Number.MAX_SAFE_INTEGER : (
        /*(int) */
        t + (t < 0 ? -0.5 : 0.5) | 0
      );
    }, r.distance = function(t, e, n, i) {
      var a = t - n, o = e - i;
      return (
        /*(float) */
        Math.sqrt(a * a + o * o)
      );
    }, r.sum = function(t) {
      for (var e = 0, n = 0, i = t.length; n !== i; n++) {
        var a = t[n];
        e += a;
      }
      return e;
    }, r;
  }()
), Le = (
  /** @class */
  function() {
    function r() {
    }
    return r.floatToIntBits = function(t) {
      return t;
    }, r.MAX_VALUE = Number.MAX_SAFE_INTEGER, r;
  }()
), O = (
  /** @class */
  function() {
    function r(t, e) {
      this.x = t, this.y = e;
    }
    return r.prototype.getX = function() {
      return this.x;
    }, r.prototype.getY = function() {
      return this.y;
    }, r.prototype.equals = function(t) {
      if (t instanceof r) {
        var e = t;
        return this.x === e.x && this.y === e.y;
      }
      return !1;
    }, r.prototype.hashCode = function() {
      return 31 * Le.floatToIntBits(this.x) + Le.floatToIntBits(this.y);
    }, r.prototype.toString = function() {
      return "(" + this.x + "," + this.y + ")";
    }, r.orderBestPatterns = function(t) {
      var e = this.distance(t[0], t[1]), n = this.distance(t[1], t[2]), i = this.distance(t[0], t[2]), a, o, f;
      if (n >= e && n >= i ? (o = t[0], a = t[1], f = t[2]) : i >= n && i >= e ? (o = t[1], a = t[0], f = t[2]) : (o = t[2], a = t[0], f = t[1]), this.crossProductZ(a, o, f) < 0) {
        var s = a;
        a = f, f = s;
      }
      t[0] = a, t[1] = o, t[2] = f;
    }, r.distance = function(t, e) {
      return U.distance(t.x, t.y, e.x, e.y);
    }, r.crossProductZ = function(t, e, n) {
      var i = e.x, a = e.y;
      return (n.x - i) * (t.y - a) - (n.y - a) * (t.x - i);
    }, r;
  }()
), je = (
  /** @class */
  function() {
    function r(t, e) {
      this.bits = t, this.points = e;
    }
    return r.prototype.getBits = function() {
      return this.bits;
    }, r.prototype.getPoints = function() {
      return this.points;
    }, r;
  }()
), bn = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), On = (
  /** @class */
  function(r) {
    bn(t, r);
    function t(e, n, i, a, o) {
      var f = r.call(this, e, n) || this;
      return f.compact = i, f.nbDatablocks = a, f.nbLayers = o, f;
    }
    return t.prototype.getNbLayers = function() {
      return this.nbLayers;
    }, t.prototype.getNbDatablocks = function() {
      return this.nbDatablocks;
    }, t.prototype.isCompact = function() {
      return this.compact;
    }, t;
  }(je)
), ke = (
  /** @class */
  function() {
    function r(t, e, n, i) {
      this.image = t, this.height = t.getHeight(), this.width = t.getWidth(), e == null && (e = r.INIT_SIZE), n == null && (n = t.getWidth() / 2 | 0), i == null && (i = t.getHeight() / 2 | 0);
      var a = e / 2 | 0;
      if (this.leftInit = n - a, this.rightInit = n + a, this.upInit = i - a, this.downInit = i + a, this.upInit < 0 || this.leftInit < 0 || this.downInit >= this.height || this.rightInit >= this.width)
        throw new C();
    }
    return r.prototype.detect = function() {
      for (var t = this.leftInit, e = this.rightInit, n = this.upInit, i = this.downInit, a = !1, o = !0, f = !1, s = !1, u = !1, c = !1, l = !1, h = this.width, d = this.height; o; ) {
        o = !1;
        for (var v = !0; (v || !s) && e < h; )
          v = this.containsBlackPoint(n, i, e, !1), v ? (e++, o = !0, s = !0) : s || e++;
        if (e >= h) {
          a = !0;
          break;
        }
        for (var g = !0; (g || !u) && i < d; )
          g = this.containsBlackPoint(t, e, i, !0), g ? (i++, o = !0, u = !0) : u || i++;
        if (i >= d) {
          a = !0;
          break;
        }
        for (var x = !0; (x || !c) && t >= 0; )
          x = this.containsBlackPoint(n, i, t, !1), x ? (t--, o = !0, c = !0) : c || t--;
        if (t < 0) {
          a = !0;
          break;
        }
        for (var w = !0; (w || !l) && n >= 0; )
          w = this.containsBlackPoint(t, e, n, !0), w ? (n--, o = !0, l = !0) : l || n--;
        if (n < 0) {
          a = !0;
          break;
        }
        o && (f = !0);
      }
      if (!a && f) {
        for (var y = e - t, _ = null, E = 1; _ === null && E < y; E++)
          _ = this.getBlackPointOnSegment(t, i - E, t + E, i);
        if (_ == null)
          throw new C();
        for (var m = null, E = 1; m === null && E < y; E++)
          m = this.getBlackPointOnSegment(t, n + E, t + E, n);
        if (m == null)
          throw new C();
        for (var I = null, E = 1; I === null && E < y; E++)
          I = this.getBlackPointOnSegment(e, n + E, e - E, n);
        if (I == null)
          throw new C();
        for (var S = null, E = 1; S === null && E < y; E++)
          S = this.getBlackPointOnSegment(e, i - E, e - E, i);
        if (S == null)
          throw new C();
        return this.centerEdges(S, _, I, m);
      } else
        throw new C();
    }, r.prototype.getBlackPointOnSegment = function(t, e, n, i) {
      for (var a = U.round(U.distance(t, e, n, i)), o = (n - t) / a, f = (i - e) / a, s = this.image, u = 0; u < a; u++) {
        var c = U.round(t + u * o), l = U.round(e + u * f);
        if (s.get(c, l))
          return new O(c, l);
      }
      return null;
    }, r.prototype.centerEdges = function(t, e, n, i) {
      var a = t.getX(), o = t.getY(), f = e.getX(), s = e.getY(), u = n.getX(), c = n.getY(), l = i.getX(), h = i.getY(), d = r.CORR;
      return a < this.width / 2 ? [
        new O(l - d, h + d),
        new O(f + d, s + d),
        new O(u - d, c - d),
        new O(a + d, o - d)
      ] : [
        new O(l + d, h + d),
        new O(f + d, s - d),
        new O(u - d, c + d),
        new O(a - d, o - d)
      ];
    }, r.prototype.containsBlackPoint = function(t, e, n, i) {
      var a = this.image;
      if (i) {
        for (var o = t; o <= e; o++)
          if (a.get(o, n))
            return !0;
      } else
        for (var f = t; f <= e; f++)
          if (a.get(n, f))
            return !0;
      return !1;
    }, r.INIT_SIZE = 10, r.CORR = 1, r;
  }()
), er = (
  /** @class */
  function() {
    function r() {
    }
    return r.checkAndNudgePoints = function(t, e) {
      for (var n = t.getWidth(), i = t.getHeight(), a = !0, o = 0; o < e.length && a; o += 2) {
        var f = Math.floor(e[o]), s = Math.floor(e[o + 1]);
        if (f < -1 || f > n || s < -1 || s > i)
          throw new C();
        a = !1, f === -1 ? (e[o] = 0, a = !0) : f === n && (e[o] = n - 1, a = !0), s === -1 ? (e[o + 1] = 0, a = !0) : s === i && (e[o + 1] = i - 1, a = !0);
      }
      a = !0;
      for (var o = e.length - 2; o >= 0 && a; o -= 2) {
        var f = Math.floor(e[o]), s = Math.floor(e[o + 1]);
        if (f < -1 || f > n || s < -1 || s > i)
          throw new C();
        a = !1, f === -1 ? (e[o] = 0, a = !0) : f === n && (e[o] = n - 1, a = !0), s === -1 ? (e[o + 1] = 0, a = !0) : s === i && (e[o + 1] = i - 1, a = !0);
      }
    }, r;
  }()
), kr = (
  /** @class */
  function() {
    function r(t, e, n, i, a, o, f, s, u) {
      this.a11 = t, this.a21 = e, this.a31 = n, this.a12 = i, this.a22 = a, this.a32 = o, this.a13 = f, this.a23 = s, this.a33 = u;
    }
    return r.quadrilateralToQuadrilateral = function(t, e, n, i, a, o, f, s, u, c, l, h, d, v, g, x) {
      var w = r.quadrilateralToSquare(t, e, n, i, a, o, f, s), y = r.squareToQuadrilateral(u, c, l, h, d, v, g, x);
      return y.times(w);
    }, r.prototype.transformPoints = function(t) {
      for (var e = t.length, n = this.a11, i = this.a12, a = this.a13, o = this.a21, f = this.a22, s = this.a23, u = this.a31, c = this.a32, l = this.a33, h = 0; h < e; h += 2) {
        var d = t[h], v = t[h + 1], g = a * d + s * v + l;
        t[h] = (n * d + o * v + u) / g, t[h + 1] = (i * d + f * v + c) / g;
      }
    }, r.prototype.transformPointsWithValues = function(t, e) {
      for (var n = this.a11, i = this.a12, a = this.a13, o = this.a21, f = this.a22, s = this.a23, u = this.a31, c = this.a32, l = this.a33, h = t.length, d = 0; d < h; d++) {
        var v = t[d], g = e[d], x = a * v + s * g + l;
        t[d] = (n * v + o * g + u) / x, e[d] = (i * v + f * g + c) / x;
      }
    }, r.squareToQuadrilateral = function(t, e, n, i, a, o, f, s) {
      var u = t - n + a - f, c = e - i + o - s;
      if (u === 0 && c === 0)
        return new r(n - t, a - n, t, i - e, o - i, e, 0, 0, 1);
      var l = n - a, h = f - a, d = i - o, v = s - o, g = l * v - h * d, x = (u * v - h * c) / g, w = (l * c - u * d) / g;
      return new r(n - t + x * n, f - t + w * f, t, i - e + x * i, s - e + w * s, e, x, w, 1);
    }, r.quadrilateralToSquare = function(t, e, n, i, a, o, f, s) {
      return r.squareToQuadrilateral(t, e, n, i, a, o, f, s).buildAdjoint();
    }, r.prototype.buildAdjoint = function() {
      return new r(this.a22 * this.a33 - this.a23 * this.a32, this.a23 * this.a31 - this.a21 * this.a33, this.a21 * this.a32 - this.a22 * this.a31, this.a13 * this.a32 - this.a12 * this.a33, this.a11 * this.a33 - this.a13 * this.a31, this.a12 * this.a31 - this.a11 * this.a32, this.a12 * this.a23 - this.a13 * this.a22, this.a13 * this.a21 - this.a11 * this.a23, this.a11 * this.a22 - this.a12 * this.a21);
    }, r.prototype.times = function(t) {
      return new r(this.a11 * t.a11 + this.a21 * t.a12 + this.a31 * t.a13, this.a11 * t.a21 + this.a21 * t.a22 + this.a31 * t.a23, this.a11 * t.a31 + this.a21 * t.a32 + this.a31 * t.a33, this.a12 * t.a11 + this.a22 * t.a12 + this.a32 * t.a13, this.a12 * t.a21 + this.a22 * t.a22 + this.a32 * t.a23, this.a12 * t.a31 + this.a22 * t.a32 + this.a32 * t.a33, this.a13 * t.a11 + this.a23 * t.a12 + this.a33 * t.a13, this.a13 * t.a21 + this.a23 * t.a22 + this.a33 * t.a23, this.a13 * t.a31 + this.a23 * t.a32 + this.a33 * t.a33);
    }, r;
  }()
), Dn = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), Nn = (
  /** @class */
  function(r) {
    Dn(t, r);
    function t() {
      return r !== null && r.apply(this, arguments) || this;
    }
    return t.prototype.sampleGrid = function(e, n, i, a, o, f, s, u, c, l, h, d, v, g, x, w, y, _, E) {
      var m = kr.quadrilateralToQuadrilateral(a, o, f, s, u, c, l, h, d, v, g, x, w, y, _, E);
      return this.sampleGridWithTransform(e, n, i, m);
    }, t.prototype.sampleGridWithTransform = function(e, n, i, a) {
      if (n <= 0 || i <= 0)
        throw new C();
      for (var o = new Nt(n, i), f = new Float32Array(2 * n), s = 0; s < i; s++) {
        for (var u = f.length, c = s + 0.5, l = 0; l < u; l += 2)
          f[l] = l / 2 + 0.5, f[l + 1] = c;
        a.transformPoints(f), er.checkAndNudgePoints(e, f);
        try {
          for (var l = 0; l < u; l += 2)
            e.get(Math.floor(f[l]), Math.floor(f[l + 1])) && o.set(l / 2, s);
        } catch {
          throw new C();
        }
      }
      return o;
    }, t;
  }(er)
), Ye = (
  /** @class */
  function() {
    function r() {
    }
    return r.setGridSampler = function(t) {
      r.gridSampler = t;
    }, r.getInstance = function() {
      return r.gridSampler;
    }, r.gridSampler = new Nn(), r;
  }()
), wt = (
  /** @class */
  function() {
    function r(t, e) {
      this.x = t, this.y = e;
    }
    return r.prototype.toResultPoint = function() {
      return new O(this.getX(), this.getY());
    }, r.prototype.getX = function() {
      return this.x;
    }, r.prototype.getY = function() {
      return this.y;
    }, r;
  }()
), Rn = (
  /** @class */
  function() {
    function r(t) {
      this.EXPECTED_CORNER_BITS = new Int32Array([
        3808,
        476,
        2107,
        1799
      ]), this.image = t;
    }
    return r.prototype.detect = function() {
      return this.detectMirror(!1);
    }, r.prototype.detectMirror = function(t) {
      var e = this.getMatrixCenter(), n = this.getBullsEyeCorners(e);
      if (t) {
        var i = n[0];
        n[0] = n[2], n[2] = i;
      }
      this.extractParameters(n);
      var a = this.sampleGrid(this.image, n[this.shift % 4], n[(this.shift + 1) % 4], n[(this.shift + 2) % 4], n[(this.shift + 3) % 4]), o = this.getMatrixCornerPoints(n);
      return new On(a, o, this.compact, this.nbDataBlocks, this.nbLayers);
    }, r.prototype.extractParameters = function(t) {
      if (!this.isValidPoint(t[0]) || !this.isValidPoint(t[1]) || !this.isValidPoint(t[2]) || !this.isValidPoint(t[3]))
        throw new C();
      var e = 2 * this.nbCenterLayers, n = new Int32Array([
        this.sampleLine(t[0], t[1], e),
        this.sampleLine(t[1], t[2], e),
        this.sampleLine(t[2], t[3], e),
        this.sampleLine(t[3], t[0], e)
        // Top
      ]);
      this.shift = this.getRotation(n, e);
      for (var i = 0, a = 0; a < 4; a++) {
        var o = n[(this.shift + a) % 4];
        this.compact ? (i <<= 7, i += o >> 1 & 127) : (i <<= 10, i += (o >> 2 & 992) + (o >> 1 & 31));
      }
      var f = this.getCorrectedParameterData(i, this.compact);
      this.compact ? (this.nbLayers = (f >> 6) + 1, this.nbDataBlocks = (f & 63) + 1) : (this.nbLayers = (f >> 11) + 1, this.nbDataBlocks = (f & 2047) + 1);
    }, r.prototype.getRotation = function(t, e) {
      var n = 0;
      t.forEach(function(a, o, f) {
        var s = (a >> e - 2 << 1) + (a & 1);
        n = (n << 3) + s;
      }), n = ((n & 1) << 11) + (n >> 1);
      for (var i = 0; i < 4; i++)
        if (B.bitCount(n ^ this.EXPECTED_CORNER_BITS[i]) <= 2)
          return i;
      throw new C();
    }, r.prototype.getCorrectedParameterData = function(t, e) {
      var n, i;
      e ? (n = 7, i = 2) : (n = 10, i = 4);
      for (var a = n - i, o = new Int32Array(n), f = n - 1; f >= 0; --f)
        o[f] = t & 15, t >>= 4;
      try {
        var s = new _e(_t.AZTEC_PARAM);
        s.decode(o, a);
      } catch {
        throw new C();
      }
      for (var u = 0, f = 0; f < i; f++)
        u = (u << 4) + o[f];
      return u;
    }, r.prototype.getBullsEyeCorners = function(t) {
      var e = t, n = t, i = t, a = t, o = !0;
      for (this.nbCenterLayers = 1; this.nbCenterLayers < 9; this.nbCenterLayers++) {
        var f = this.getFirstDifferent(e, o, 1, -1), s = this.getFirstDifferent(n, o, 1, 1), u = this.getFirstDifferent(i, o, -1, 1), c = this.getFirstDifferent(a, o, -1, -1);
        if (this.nbCenterLayers > 2) {
          var l = this.distancePoint(c, f) * this.nbCenterLayers / (this.distancePoint(a, e) * (this.nbCenterLayers + 2));
          if (l < 0.75 || l > 1.25 || !this.isWhiteOrBlackRectangle(f, s, u, c))
            break;
        }
        e = f, n = s, i = u, a = c, o = !o;
      }
      if (this.nbCenterLayers !== 5 && this.nbCenterLayers !== 7)
        throw new C();
      this.compact = this.nbCenterLayers === 5;
      var h = new O(e.getX() + 0.5, e.getY() - 0.5), d = new O(n.getX() + 0.5, n.getY() + 0.5), v = new O(i.getX() - 0.5, i.getY() + 0.5), g = new O(a.getX() - 0.5, a.getY() - 0.5);
      return this.expandSquare([h, d, v, g], 2 * this.nbCenterLayers - 3, 2 * this.nbCenterLayers);
    }, r.prototype.getMatrixCenter = function() {
      var t, e, n, i;
      try {
        var a = new ke(this.image).detect();
        t = a[0], e = a[1], n = a[2], i = a[3];
      } catch {
        var o = this.image.getWidth() / 2, f = this.image.getHeight() / 2;
        t = this.getFirstDifferent(new wt(o + 7, f - 7), !1, 1, -1).toResultPoint(), e = this.getFirstDifferent(new wt(o + 7, f + 7), !1, 1, 1).toResultPoint(), n = this.getFirstDifferent(new wt(o - 7, f + 7), !1, -1, 1).toResultPoint(), i = this.getFirstDifferent(new wt(o - 7, f - 7), !1, -1, -1).toResultPoint();
      }
      var s = U.round((t.getX() + i.getX() + e.getX() + n.getX()) / 4), u = U.round((t.getY() + i.getY() + e.getY() + n.getY()) / 4);
      try {
        var a = new ke(this.image, 15, s, u).detect();
        t = a[0], e = a[1], n = a[2], i = a[3];
      } catch {
        t = this.getFirstDifferent(new wt(s + 7, u - 7), !1, 1, -1).toResultPoint(), e = this.getFirstDifferent(new wt(s + 7, u + 7), !1, 1, 1).toResultPoint(), n = this.getFirstDifferent(new wt(s - 7, u + 7), !1, -1, 1).toResultPoint(), i = this.getFirstDifferent(new wt(s - 7, u - 7), !1, -1, -1).toResultPoint();
      }
      return s = U.round((t.getX() + i.getX() + e.getX() + n.getX()) / 4), u = U.round((t.getY() + i.getY() + e.getY() + n.getY()) / 4), new wt(s, u);
    }, r.prototype.getMatrixCornerPoints = function(t) {
      return this.expandSquare(t, 2 * this.nbCenterLayers, this.getDimension());
    }, r.prototype.sampleGrid = function(t, e, n, i, a) {
      var o = Ye.getInstance(), f = this.getDimension(), s = f / 2 - this.nbCenterLayers, u = f / 2 + this.nbCenterLayers;
      return o.sampleGrid(
        t,
        f,
        f,
        s,
        s,
        // topleft
        u,
        s,
        // topright
        u,
        u,
        // bottomright
        s,
        u,
        // bottomleft
        e.getX(),
        e.getY(),
        n.getX(),
        n.getY(),
        i.getX(),
        i.getY(),
        a.getX(),
        a.getY()
      );
    }, r.prototype.sampleLine = function(t, e, n) {
      for (var i = 0, a = this.distanceResultPoint(t, e), o = a / n, f = t.getX(), s = t.getY(), u = o * (e.getX() - t.getX()) / a, c = o * (e.getY() - t.getY()) / a, l = 0; l < n; l++)
        this.image.get(U.round(f + l * u), U.round(s + l * c)) && (i |= 1 << n - l - 1);
      return i;
    }, r.prototype.isWhiteOrBlackRectangle = function(t, e, n, i) {
      var a = 3;
      t = new wt(t.getX() - a, t.getY() + a), e = new wt(e.getX() - a, e.getY() - a), n = new wt(n.getX() + a, n.getY() - a), i = new wt(i.getX() + a, i.getY() + a);
      var o = this.getColor(i, t);
      if (o === 0)
        return !1;
      var f = this.getColor(t, e);
      return f !== o || (f = this.getColor(e, n), f !== o) ? !1 : (f = this.getColor(n, i), f === o);
    }, r.prototype.getColor = function(t, e) {
      for (var n = this.distancePoint(t, e), i = (e.getX() - t.getX()) / n, a = (e.getY() - t.getY()) / n, o = 0, f = t.getX(), s = t.getY(), u = this.image.get(t.getX(), t.getY()), c = Math.ceil(n), l = 0; l < c; l++)
        f += i, s += a, this.image.get(U.round(f), U.round(s)) !== u && o++;
      var h = o / n;
      return h > 0.1 && h < 0.9 ? 0 : h <= 0.1 === u ? 1 : -1;
    }, r.prototype.getFirstDifferent = function(t, e, n, i) {
      for (var a = t.getX() + n, o = t.getY() + i; this.isValid(a, o) && this.image.get(a, o) === e; )
        a += n, o += i;
      for (a -= n, o -= i; this.isValid(a, o) && this.image.get(a, o) === e; )
        a += n;
      for (a -= n; this.isValid(a, o) && this.image.get(a, o) === e; )
        o += i;
      return o -= i, new wt(a, o);
    }, r.prototype.expandSquare = function(t, e, n) {
      var i = n / (2 * e), a = t[0].getX() - t[2].getX(), o = t[0].getY() - t[2].getY(), f = (t[0].getX() + t[2].getX()) / 2, s = (t[0].getY() + t[2].getY()) / 2, u = new O(f + i * a, s + i * o), c = new O(f - i * a, s - i * o);
      a = t[1].getX() - t[3].getX(), o = t[1].getY() - t[3].getY(), f = (t[1].getX() + t[3].getX()) / 2, s = (t[1].getY() + t[3].getY()) / 2;
      var l = new O(f + i * a, s + i * o), h = new O(f - i * a, s - i * o), d = [u, l, c, h];
      return d;
    }, r.prototype.isValid = function(t, e) {
      return t >= 0 && t < this.image.getWidth() && e > 0 && e < this.image.getHeight();
    }, r.prototype.isValidPoint = function(t) {
      var e = U.round(t.getX()), n = U.round(t.getY());
      return this.isValid(e, n);
    }, r.prototype.distancePoint = function(t, e) {
      return U.distance(t.getX(), t.getY(), e.getX(), e.getY());
    }, r.prototype.distanceResultPoint = function(t, e) {
      return U.distance(t.getX(), t.getY(), e.getX(), e.getY());
    }, r.prototype.getDimension = function() {
      return this.compact ? 4 * this.nbLayers + 11 : this.nbLayers <= 4 ? 4 * this.nbLayers + 15 : 4 * this.nbLayers + 2 * (B.truncDivision(this.nbLayers - 4, 8) + 1) + 15;
    }, r;
  }()
), he = (
  /** @class */
  function() {
    function r() {
    }
    return r.prototype.decode = function(t, e) {
      e === void 0 && (e = null);
      var n = null, i = new Rn(t.getBlackMatrix()), a = null, o = null;
      try {
        var f = i.detectMirror(!1);
        a = f.getPoints(), this.reportFoundResultPoints(e, a), o = new tr().decode(f);
      } catch (l) {
        n = l;
      }
      if (o == null)
        try {
          var f = i.detectMirror(!0);
          a = f.getPoints(), this.reportFoundResultPoints(e, a), o = new tr().decode(f);
        } catch (l) {
          throw n ?? l;
        }
      var s = new pt(o.getText(), o.getRawBytes(), o.getNumBits(), a, N.AZTEC, j.currentTimeMillis()), u = o.getByteSegments();
      u != null && s.putMetadata(dt.BYTE_SEGMENTS, u);
      var c = o.getECLevel();
      return c != null && s.putMetadata(dt.ERROR_CORRECTION_LEVEL, c), s;
    }, r.prototype.reportFoundResultPoints = function(t, e) {
      if (t != null) {
        var n = t.get($.NEED_RESULT_POINT_CALLBACK);
        n != null && e.forEach(function(i, a, o) {
          n.foundPossibleResultPoint(i);
        });
      }
    }, r.prototype.reset = function() {
    }, r;
  }()
), Pn = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}();
(function(r) {
  Pn(t, r);
  function t(e) {
    return e === void 0 && (e = 500), r.call(this, new he(), e) || this;
  }
  return t;
})($t);
var ft = (
  /** @class */
  function() {
    function r() {
    }
    return r.prototype.decode = function(t, e) {
      try {
        return this.doDecode(t, e);
      } catch {
        var n = e && e.get($.TRY_HARDER) === !0;
        if (n && t.isRotateSupported()) {
          var i = t.rotateCounterClockwise(), a = this.doDecode(i, e), o = a.getResultMetadata(), f = 270;
          o !== null && o.get(dt.ORIENTATION) === !0 && (f = f + o.get(dt.ORIENTATION) % 360), a.putMetadata(dt.ORIENTATION, f);
          var s = a.getResultPoints();
          if (s !== null)
            for (var u = i.getHeight(), c = 0; c < s.length; c++)
              s[c] = new O(u - s[c].getY() - 1, s[c].getX());
          return a;
        } else
          throw new C();
      }
    }, r.prototype.reset = function() {
    }, r.prototype.doDecode = function(t, e) {
      var n = t.getWidth(), i = t.getHeight(), a = new ct(n), o = e && e.get($.TRY_HARDER) === !0, f = Math.max(1, i >> (o ? 8 : 5)), s;
      o ? s = i : s = 15;
      for (var u = Math.trunc(i / 2), c = 0; c < s; c++) {
        var l = Math.trunc((c + 1) / 2), h = (c & 1) === 0, d = u + f * (h ? l : -l);
        if (d < 0 || d >= i)
          break;
        try {
          a = t.getBlackRow(d, a);
        } catch {
          continue;
        }
        for (var v = function(y) {
          if (y === 1 && (a.reverse(), e && e.get($.NEED_RESULT_POINT_CALLBACK) === !0)) {
            var _ = /* @__PURE__ */ new Map();
            e.forEach(function(I, S) {
              return _.set(S, I);
            }), _.delete($.NEED_RESULT_POINT_CALLBACK), e = _;
          }
          try {
            var E = g.decodeRow(d, a, e);
            if (y === 1) {
              E.putMetadata(dt.ORIENTATION, 180);
              var m = E.getResultPoints();
              m !== null && (m[0] = new O(n - m[0].getX() - 1, m[0].getY()), m[1] = new O(n - m[1].getX() - 1, m[1].getY()));
            }
            return { value: E };
          } catch {
          }
        }, g = this, x = 0; x < 2; x++) {
          var w = v(x);
          if (typeof w == "object")
            return w.value;
        }
      }
      throw new C();
    }, r.recordPattern = function(t, e, n) {
      for (var i = n.length, a = 0; a < i; a++)
        n[a] = 0;
      var o = t.getSize();
      if (e >= o)
        throw new C();
      for (var f = !t.get(e), s = 0, u = e; u < o; ) {
        if (t.get(u) !== f)
          n[s]++;
        else {
          if (++s === i)
            break;
          n[s] = 1, f = !f;
        }
        u++;
      }
      if (!(s === i || s === i - 1 && u === o))
        throw new C();
    }, r.recordPatternInReverse = function(t, e, n) {
      for (var i = n.length, a = t.get(e); e > 0 && i >= 0; )
        t.get(--e) !== a && (i--, a = !a);
      if (i >= 0)
        throw new C();
      r.recordPattern(t, e + 1, n);
    }, r.patternMatchVariance = function(t, e, n) {
      for (var i = t.length, a = 0, o = 0, f = 0; f < i; f++)
        a += t[f], o += e[f];
      if (a < o)
        return Number.POSITIVE_INFINITY;
      var s = a / o;
      n *= s;
      for (var u = 0, c = 0; c < i; c++) {
        var l = t[c], h = e[c] * s, d = l > h ? l - h : h - l;
        if (d > n)
          return Number.POSITIVE_INFINITY;
        u += d;
      }
      return u / a;
    }, r;
  }()
), Mn = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), rr = (
  /** @class */
  function(r) {
    Mn(t, r);
    function t() {
      return r !== null && r.apply(this, arguments) || this;
    }
    return t.findStartPattern = function(e) {
      for (var n = e.getSize(), i = e.getNextSet(0), a = 0, o = Int32Array.from([0, 0, 0, 0, 0, 0]), f = i, s = !1, u = 6, c = i; c < n; c++)
        if (e.get(c) !== s)
          o[a]++;
        else {
          if (a === u - 1) {
            for (var l = t.MAX_AVG_VARIANCE, h = -1, d = t.CODE_START_A; d <= t.CODE_START_C; d++) {
              var v = ft.patternMatchVariance(o, t.CODE_PATTERNS[d], t.MAX_INDIVIDUAL_VARIANCE);
              v < l && (l = v, h = d);
            }
            if (h >= 0 && e.isRange(Math.max(0, f - (c - f) / 2), f, !1))
              return Int32Array.from([f, c, h]);
            f += o[0] + o[1], o = o.slice(2, o.length - 1), o[a - 1] = 0, o[a] = 0, a--;
          } else
            a++;
          o[a] = 1, s = !s;
        }
      throw new C();
    }, t.decodeCode = function(e, n, i) {
      ft.recordPattern(e, i, n);
      for (var a = t.MAX_AVG_VARIANCE, o = -1, f = 0; f < t.CODE_PATTERNS.length; f++) {
        var s = t.CODE_PATTERNS[f], u = this.patternMatchVariance(n, s, t.MAX_INDIVIDUAL_VARIANCE);
        u < a && (a = u, o = f);
      }
      if (o >= 0)
        return o;
      throw new C();
    }, t.prototype.decodeRow = function(e, n, i) {
      var a = i && i.get($.ASSUME_GS1) === !0, o = t.findStartPattern(n), f = o[2], s = 0, u = new Uint8Array(20);
      u[s++] = f;
      var c;
      switch (f) {
        case t.CODE_START_A:
          c = t.CODE_CODE_A;
          break;
        case t.CODE_START_B:
          c = t.CODE_CODE_B;
          break;
        case t.CODE_START_C:
          c = t.CODE_CODE_C;
          break;
        default:
          throw new T();
      }
      for (var l = !1, h = !1, d = "", v = o[0], g = o[1], x = Int32Array.from([0, 0, 0, 0, 0, 0]), w = 0, y = 0, _ = f, E = 0, m = !0, I = !1, S = !1; !l; ) {
        var b = h;
        switch (h = !1, w = y, y = t.decodeCode(n, x, g), u[s++] = y, y !== t.CODE_STOP && (m = !0), y !== t.CODE_STOP && (E++, _ += E * y), v = g, g += x.reduce(function(Ee, Ce) {
          return Ee + Ce;
        }, 0), y) {
          case t.CODE_START_A:
          case t.CODE_START_B:
          case t.CODE_START_C:
            throw new T();
        }
        switch (c) {
          case t.CODE_CODE_A:
            if (y < 64)
              S === I ? d += String.fromCharCode(" ".charCodeAt(0) + y) : d += String.fromCharCode(" ".charCodeAt(0) + y + 128), S = !1;
            else if (y < 96)
              S === I ? d += String.fromCharCode(y - 64) : d += String.fromCharCode(y + 64), S = !1;
            else
              switch (y !== t.CODE_STOP && (m = !1), y) {
                case t.CODE_FNC_1:
                  a && (d.length === 0 ? d += "]C1" : d += String.fromCharCode(29));
                  break;
                case t.CODE_FNC_2:
                case t.CODE_FNC_3:
                  break;
                case t.CODE_FNC_4_A:
                  !I && S ? (I = !0, S = !1) : I && S ? (I = !1, S = !1) : S = !0;
                  break;
                case t.CODE_SHIFT:
                  h = !0, c = t.CODE_CODE_B;
                  break;
                case t.CODE_CODE_B:
                  c = t.CODE_CODE_B;
                  break;
                case t.CODE_CODE_C:
                  c = t.CODE_CODE_C;
                  break;
                case t.CODE_STOP:
                  l = !0;
                  break;
              }
            break;
          case t.CODE_CODE_B:
            if (y < 96)
              S === I ? d += String.fromCharCode(" ".charCodeAt(0) + y) : d += String.fromCharCode(" ".charCodeAt(0) + y + 128), S = !1;
            else
              switch (y !== t.CODE_STOP && (m = !1), y) {
                case t.CODE_FNC_1:
                  a && (d.length === 0 ? d += "]C1" : d += String.fromCharCode(29));
                  break;
                case t.CODE_FNC_2:
                case t.CODE_FNC_3:
                  break;
                case t.CODE_FNC_4_B:
                  !I && S ? (I = !0, S = !1) : I && S ? (I = !1, S = !1) : S = !0;
                  break;
                case t.CODE_SHIFT:
                  h = !0, c = t.CODE_CODE_A;
                  break;
                case t.CODE_CODE_A:
                  c = t.CODE_CODE_A;
                  break;
                case t.CODE_CODE_C:
                  c = t.CODE_CODE_C;
                  break;
                case t.CODE_STOP:
                  l = !0;
                  break;
              }
            break;
          case t.CODE_CODE_C:
            if (y < 100)
              y < 10 && (d += "0"), d += y;
            else
              switch (y !== t.CODE_STOP && (m = !1), y) {
                case t.CODE_FNC_1:
                  a && (d.length === 0 ? d += "]C1" : d += String.fromCharCode(29));
                  break;
                case t.CODE_CODE_A:
                  c = t.CODE_CODE_A;
                  break;
                case t.CODE_CODE_B:
                  c = t.CODE_CODE_B;
                  break;
                case t.CODE_STOP:
                  l = !0;
                  break;
              }
            break;
        }
        b && (c = c === t.CODE_CODE_A ? t.CODE_CODE_B : t.CODE_CODE_A);
      }
      var P = g - v;
      if (g = n.getNextUnset(g), !n.isRange(g, Math.min(n.getSize(), g + (g - v) / 2), !1))
        throw new C();
      if (_ -= E * w, _ % 103 !== w)
        throw new et();
      var R = d.length;
      if (R === 0)
        throw new C();
      R > 0 && m && (c === t.CODE_CODE_C ? d = d.substring(0, R - 2) : d = d.substring(0, R - 1));
      for (var J = (o[1] + o[0]) / 2, L = v + P / 2, K = u.length, Et = new Uint8Array(K), Rt = 0; Rt < K; Rt++)
        Et[Rt] = u[Rt];
      var Ae = [new O(J, e), new O(L, e)];
      return new pt(d, Et, 0, Ae, N.CODE_128, (/* @__PURE__ */ new Date()).getTime());
    }, t.CODE_PATTERNS = [
      Int32Array.from([2, 1, 2, 2, 2, 2]),
      Int32Array.from([2, 2, 2, 1, 2, 2]),
      Int32Array.from([2, 2, 2, 2, 2, 1]),
      Int32Array.from([1, 2, 1, 2, 2, 3]),
      Int32Array.from([1, 2, 1, 3, 2, 2]),
      Int32Array.from([1, 3, 1, 2, 2, 2]),
      Int32Array.from([1, 2, 2, 2, 1, 3]),
      Int32Array.from([1, 2, 2, 3, 1, 2]),
      Int32Array.from([1, 3, 2, 2, 1, 2]),
      Int32Array.from([2, 2, 1, 2, 1, 3]),
      Int32Array.from([2, 2, 1, 3, 1, 2]),
      Int32Array.from([2, 3, 1, 2, 1, 2]),
      Int32Array.from([1, 1, 2, 2, 3, 2]),
      Int32Array.from([1, 2, 2, 1, 3, 2]),
      Int32Array.from([1, 2, 2, 2, 3, 1]),
      Int32Array.from([1, 1, 3, 2, 2, 2]),
      Int32Array.from([1, 2, 3, 1, 2, 2]),
      Int32Array.from([1, 2, 3, 2, 2, 1]),
      Int32Array.from([2, 2, 3, 2, 1, 1]),
      Int32Array.from([2, 2, 1, 1, 3, 2]),
      Int32Array.from([2, 2, 1, 2, 3, 1]),
      Int32Array.from([2, 1, 3, 2, 1, 2]),
      Int32Array.from([2, 2, 3, 1, 1, 2]),
      Int32Array.from([3, 1, 2, 1, 3, 1]),
      Int32Array.from([3, 1, 1, 2, 2, 2]),
      Int32Array.from([3, 2, 1, 1, 2, 2]),
      Int32Array.from([3, 2, 1, 2, 2, 1]),
      Int32Array.from([3, 1, 2, 2, 1, 2]),
      Int32Array.from([3, 2, 2, 1, 1, 2]),
      Int32Array.from([3, 2, 2, 2, 1, 1]),
      Int32Array.from([2, 1, 2, 1, 2, 3]),
      Int32Array.from([2, 1, 2, 3, 2, 1]),
      Int32Array.from([2, 3, 2, 1, 2, 1]),
      Int32Array.from([1, 1, 1, 3, 2, 3]),
      Int32Array.from([1, 3, 1, 1, 2, 3]),
      Int32Array.from([1, 3, 1, 3, 2, 1]),
      Int32Array.from([1, 1, 2, 3, 1, 3]),
      Int32Array.from([1, 3, 2, 1, 1, 3]),
      Int32Array.from([1, 3, 2, 3, 1, 1]),
      Int32Array.from([2, 1, 1, 3, 1, 3]),
      Int32Array.from([2, 3, 1, 1, 1, 3]),
      Int32Array.from([2, 3, 1, 3, 1, 1]),
      Int32Array.from([1, 1, 2, 1, 3, 3]),
      Int32Array.from([1, 1, 2, 3, 3, 1]),
      Int32Array.from([1, 3, 2, 1, 3, 1]),
      Int32Array.from([1, 1, 3, 1, 2, 3]),
      Int32Array.from([1, 1, 3, 3, 2, 1]),
      Int32Array.from([1, 3, 3, 1, 2, 1]),
      Int32Array.from([3, 1, 3, 1, 2, 1]),
      Int32Array.from([2, 1, 1, 3, 3, 1]),
      Int32Array.from([2, 3, 1, 1, 3, 1]),
      Int32Array.from([2, 1, 3, 1, 1, 3]),
      Int32Array.from([2, 1, 3, 3, 1, 1]),
      Int32Array.from([2, 1, 3, 1, 3, 1]),
      Int32Array.from([3, 1, 1, 1, 2, 3]),
      Int32Array.from([3, 1, 1, 3, 2, 1]),
      Int32Array.from([3, 3, 1, 1, 2, 1]),
      Int32Array.from([3, 1, 2, 1, 1, 3]),
      Int32Array.from([3, 1, 2, 3, 1, 1]),
      Int32Array.from([3, 3, 2, 1, 1, 1]),
      Int32Array.from([3, 1, 4, 1, 1, 1]),
      Int32Array.from([2, 2, 1, 4, 1, 1]),
      Int32Array.from([4, 3, 1, 1, 1, 1]),
      Int32Array.from([1, 1, 1, 2, 2, 4]),
      Int32Array.from([1, 1, 1, 4, 2, 2]),
      Int32Array.from([1, 2, 1, 1, 2, 4]),
      Int32Array.from([1, 2, 1, 4, 2, 1]),
      Int32Array.from([1, 4, 1, 1, 2, 2]),
      Int32Array.from([1, 4, 1, 2, 2, 1]),
      Int32Array.from([1, 1, 2, 2, 1, 4]),
      Int32Array.from([1, 1, 2, 4, 1, 2]),
      Int32Array.from([1, 2, 2, 1, 1, 4]),
      Int32Array.from([1, 2, 2, 4, 1, 1]),
      Int32Array.from([1, 4, 2, 1, 1, 2]),
      Int32Array.from([1, 4, 2, 2, 1, 1]),
      Int32Array.from([2, 4, 1, 2, 1, 1]),
      Int32Array.from([2, 2, 1, 1, 1, 4]),
      Int32Array.from([4, 1, 3, 1, 1, 1]),
      Int32Array.from([2, 4, 1, 1, 1, 2]),
      Int32Array.from([1, 3, 4, 1, 1, 1]),
      Int32Array.from([1, 1, 1, 2, 4, 2]),
      Int32Array.from([1, 2, 1, 1, 4, 2]),
      Int32Array.from([1, 2, 1, 2, 4, 1]),
      Int32Array.from([1, 1, 4, 2, 1, 2]),
      Int32Array.from([1, 2, 4, 1, 1, 2]),
      Int32Array.from([1, 2, 4, 2, 1, 1]),
      Int32Array.from([4, 1, 1, 2, 1, 2]),
      Int32Array.from([4, 2, 1, 1, 1, 2]),
      Int32Array.from([4, 2, 1, 2, 1, 1]),
      Int32Array.from([2, 1, 2, 1, 4, 1]),
      Int32Array.from([2, 1, 4, 1, 2, 1]),
      Int32Array.from([4, 1, 2, 1, 2, 1]),
      Int32Array.from([1, 1, 1, 1, 4, 3]),
      Int32Array.from([1, 1, 1, 3, 4, 1]),
      Int32Array.from([1, 3, 1, 1, 4, 1]),
      Int32Array.from([1, 1, 4, 1, 1, 3]),
      Int32Array.from([1, 1, 4, 3, 1, 1]),
      Int32Array.from([4, 1, 1, 1, 1, 3]),
      Int32Array.from([4, 1, 1, 3, 1, 1]),
      Int32Array.from([1, 1, 3, 1, 4, 1]),
      Int32Array.from([1, 1, 4, 1, 3, 1]),
      Int32Array.from([3, 1, 1, 1, 4, 1]),
      Int32Array.from([4, 1, 1, 1, 3, 1]),
      Int32Array.from([2, 1, 1, 4, 1, 2]),
      Int32Array.from([2, 1, 1, 2, 1, 4]),
      Int32Array.from([2, 1, 1, 2, 3, 2]),
      Int32Array.from([2, 3, 3, 1, 1, 1, 2])
    ], t.MAX_AVG_VARIANCE = 0.25, t.MAX_INDIVIDUAL_VARIANCE = 0.7, t.CODE_SHIFT = 98, t.CODE_CODE_C = 99, t.CODE_CODE_B = 100, t.CODE_CODE_A = 101, t.CODE_FNC_1 = 102, t.CODE_FNC_2 = 97, t.CODE_FNC_3 = 96, t.CODE_FNC_4_A = 101, t.CODE_FNC_4_B = 100, t.CODE_START_A = 103, t.CODE_START_B = 104, t.CODE_START_C = 105, t.CODE_STOP = 106, t;
  }(ft)
), Bn = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), me = globalThis && globalThis.__values || function(r) {
  var t = typeof Symbol == "function" && Symbol.iterator, e = t && r[t], n = 0;
  if (e)
    return e.call(r);
  if (r && typeof r.length == "number")
    return {
      next: function() {
        return r && n >= r.length && (r = void 0), { value: r && r[n++], done: !r };
      }
    };
  throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, nr = (
  /** @class */
  function(r) {
    Bn(t, r);
    function t(e, n) {
      e === void 0 && (e = !1), n === void 0 && (n = !1);
      var i = r.call(this) || this;
      return i.usingCheckDigit = e, i.extendedMode = n, i.decodeRowResult = "", i.counters = new Int32Array(9), i;
    }
    return t.prototype.decodeRow = function(e, n, i) {
      var a, o, f, s, u = this.counters;
      u.fill(0), this.decodeRowResult = "";
      var c = t.findAsteriskPattern(n, u), l = n.getNextSet(c[1]), h = n.getSize(), d, v;
      do {
        t.recordPattern(n, l, u);
        var g = t.toNarrowWidePattern(u);
        if (g < 0)
          throw new C();
        d = t.patternToChar(g), this.decodeRowResult += d, v = l;
        try {
          for (var x = (a = void 0, me(u)), w = x.next(); !w.done; w = x.next()) {
            var y = w.value;
            l += y;
          }
        } catch (K) {
          a = { error: K };
        } finally {
          try {
            w && !w.done && (o = x.return) && o.call(x);
          } finally {
            if (a)
              throw a.error;
          }
        }
        l = n.getNextSet(l);
      } while (d !== "*");
      this.decodeRowResult = this.decodeRowResult.substring(0, this.decodeRowResult.length - 1);
      var _ = 0;
      try {
        for (var E = me(u), m = E.next(); !m.done; m = E.next()) {
          var y = m.value;
          _ += y;
        }
      } catch (K) {
        f = { error: K };
      } finally {
        try {
          m && !m.done && (s = E.return) && s.call(E);
        } finally {
          if (f)
            throw f.error;
        }
      }
      var I = l - v - _;
      if (l !== h && I * 2 < _)
        throw new C();
      if (this.usingCheckDigit) {
        for (var S = this.decodeRowResult.length - 1, b = 0, P = 0; P < S; P++)
          b += t.ALPHABET_STRING.indexOf(this.decodeRowResult.charAt(P));
        if (this.decodeRowResult.charAt(S) !== t.ALPHABET_STRING.charAt(b % 43))
          throw new et();
        this.decodeRowResult = this.decodeRowResult.substring(0, S);
      }
      if (this.decodeRowResult.length === 0)
        throw new C();
      var R;
      this.extendedMode ? R = t.decodeExtended(this.decodeRowResult) : R = this.decodeRowResult;
      var J = (c[1] + c[0]) / 2, L = v + _ / 2;
      return new pt(R, null, 0, [new O(J, e), new O(L, e)], N.CODE_39, (/* @__PURE__ */ new Date()).getTime());
    }, t.findAsteriskPattern = function(e, n) {
      for (var i = e.getSize(), a = e.getNextSet(0), o = 0, f = a, s = !1, u = n.length, c = a; c < i; c++)
        if (e.get(c) !== s)
          n[o]++;
        else {
          if (o === u - 1) {
            if (this.toNarrowWidePattern(n) === t.ASTERISK_ENCODING && e.isRange(Math.max(0, f - Math.floor((c - f) / 2)), f, !1))
              return [f, c];
            f += n[0] + n[1], n.copyWithin(0, 2, 2 + o - 1), n[o - 1] = 0, n[o] = 0, o--;
          } else
            o++;
          n[o] = 1, s = !s;
        }
      throw new C();
    }, t.toNarrowWidePattern = function(e) {
      var n, i, a = e.length, o = 0, f;
      do {
        var s = 2147483647;
        try {
          for (var u = (n = void 0, me(e)), c = u.next(); !c.done; c = u.next()) {
            var l = c.value;
            l < s && l > o && (s = l);
          }
        } catch (g) {
          n = { error: g };
        } finally {
          try {
            c && !c.done && (i = u.return) && i.call(u);
          } finally {
            if (n)
              throw n.error;
          }
        }
        o = s, f = 0;
        for (var h = 0, d = 0, v = 0; v < a; v++) {
          var l = e[v];
          l > o && (d |= 1 << a - 1 - v, f++, h += l);
        }
        if (f === 3) {
          for (var v = 0; v < a && f > 0; v++) {
            var l = e[v];
            if (l > o && (f--, l * 2 >= h))
              return -1;
          }
          return d;
        }
      } while (f > 3);
      return -1;
    }, t.patternToChar = function(e) {
      for (var n = 0; n < t.CHARACTER_ENCODINGS.length; n++)
        if (t.CHARACTER_ENCODINGS[n] === e)
          return t.ALPHABET_STRING.charAt(n);
      if (e === t.ASTERISK_ENCODING)
        return "*";
      throw new C();
    }, t.decodeExtended = function(e) {
      for (var n = e.length, i = "", a = 0; a < n; a++) {
        var o = e.charAt(a);
        if (o === "+" || o === "$" || o === "%" || o === "/") {
          var f = e.charAt(a + 1), s = "\0";
          switch (o) {
            case "+":
              if (f >= "A" && f <= "Z")
                s = String.fromCharCode(f.charCodeAt(0) + 32);
              else
                throw new T();
              break;
            case "$":
              if (f >= "A" && f <= "Z")
                s = String.fromCharCode(f.charCodeAt(0) - 64);
              else
                throw new T();
              break;
            case "%":
              if (f >= "A" && f <= "E")
                s = String.fromCharCode(f.charCodeAt(0) - 38);
              else if (f >= "F" && f <= "J")
                s = String.fromCharCode(f.charCodeAt(0) - 11);
              else if (f >= "K" && f <= "O")
                s = String.fromCharCode(f.charCodeAt(0) + 16);
              else if (f >= "P" && f <= "T")
                s = String.fromCharCode(f.charCodeAt(0) + 43);
              else if (f === "U")
                s = "\0";
              else if (f === "V")
                s = "@";
              else if (f === "W")
                s = "`";
              else if (f === "X" || f === "Y" || f === "Z")
                s = "";
              else
                throw new T();
              break;
            case "/":
              if (f >= "A" && f <= "O")
                s = String.fromCharCode(f.charCodeAt(0) - 32);
              else if (f === "Z")
                s = ":";
              else
                throw new T();
              break;
          }
          i += s, a++;
        } else
          i += o;
      }
      return i;
    }, t.ALPHABET_STRING = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. $/+%", t.CHARACTER_ENCODINGS = [
      52,
      289,
      97,
      352,
      49,
      304,
      112,
      37,
      292,
      100,
      265,
      73,
      328,
      25,
      280,
      88,
      13,
      268,
      76,
      28,
      259,
      67,
      322,
      19,
      274,
      82,
      7,
      262,
      70,
      22,
      385,
      193,
      448,
      145,
      400,
      208,
      133,
      388,
      196,
      168,
      162,
      138,
      42
      // /-%
    ], t.ASTERISK_ENCODING = 148, t;
  }(ft)
), Fn = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), Ie = globalThis && globalThis.__values || function(r) {
  var t = typeof Symbol == "function" && Symbol.iterator, e = t && r[t], n = 0;
  if (e)
    return e.call(r);
  if (r && typeof r.length == "number")
    return {
      next: function() {
        return r && n >= r.length && (r = void 0), { value: r && r[n++], done: !r };
      }
    };
  throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, ir = (
  /** @class */
  function(r) {
    Fn(t, r);
    function t() {
      var e = r.call(this) || this;
      return e.decodeRowResult = "", e.counters = new Int32Array(6), e;
    }
    return t.prototype.decodeRow = function(e, n, i) {
      var a, o, f, s, u = this.findAsteriskPattern(n), c = n.getNextSet(u[1]), l = n.getSize(), h = this.counters;
      h.fill(0), this.decodeRowResult = "";
      var d, v;
      do {
        t.recordPattern(n, c, h);
        var g = this.toPattern(h);
        if (g < 0)
          throw new C();
        d = this.patternToChar(g), this.decodeRowResult += d, v = c;
        try {
          for (var x = (a = void 0, Ie(h)), w = x.next(); !w.done; w = x.next()) {
            var y = w.value;
            c += y;
          }
        } catch (P) {
          a = { error: P };
        } finally {
          try {
            w && !w.done && (o = x.return) && o.call(x);
          } finally {
            if (a)
              throw a.error;
          }
        }
        c = n.getNextSet(c);
      } while (d !== "*");
      this.decodeRowResult = this.decodeRowResult.substring(0, this.decodeRowResult.length - 1);
      var _ = 0;
      try {
        for (var E = Ie(h), m = E.next(); !m.done; m = E.next()) {
          var y = m.value;
          _ += y;
        }
      } catch (P) {
        f = { error: P };
      } finally {
        try {
          m && !m.done && (s = E.return) && s.call(E);
        } finally {
          if (f)
            throw f.error;
        }
      }
      if (c === l || !n.get(c))
        throw new C();
      if (this.decodeRowResult.length < 2)
        throw new C();
      this.checkChecksums(this.decodeRowResult), this.decodeRowResult = this.decodeRowResult.substring(0, this.decodeRowResult.length - 2);
      var I = this.decodeExtended(this.decodeRowResult), S = (u[1] + u[0]) / 2, b = v + _ / 2;
      return new pt(I, null, 0, [new O(S, e), new O(b, e)], N.CODE_93, (/* @__PURE__ */ new Date()).getTime());
    }, t.prototype.findAsteriskPattern = function(e) {
      var n = e.getSize(), i = e.getNextSet(0);
      this.counters.fill(0);
      for (var a = this.counters, o = i, f = !1, s = a.length, u = 0, c = i; c < n; c++)
        if (e.get(c) !== f)
          a[u]++;
        else {
          if (u === s - 1) {
            if (this.toPattern(a) === t.ASTERISK_ENCODING)
              return new Int32Array([o, c]);
            o += a[0] + a[1], a.copyWithin(0, 2, 2 + u - 1), a[u - 1] = 0, a[u] = 0, u--;
          } else
            u++;
          a[u] = 1, f = !f;
        }
      throw new C();
    }, t.prototype.toPattern = function(e) {
      var n, i, a = 0;
      try {
        for (var o = Ie(e), f = o.next(); !f.done; f = o.next()) {
          var s = f.value;
          a += s;
        }
      } catch (v) {
        n = { error: v };
      } finally {
        try {
          f && !f.done && (i = o.return) && i.call(o);
        } finally {
          if (n)
            throw n.error;
        }
      }
      for (var u = 0, c = e.length, l = 0; l < c; l++) {
        var h = Math.round(e[l] * 9 / a);
        if (h < 1 || h > 4)
          return -1;
        if (l & 1)
          u <<= h;
        else
          for (var d = 0; d < h; d++)
            u = u << 1 | 1;
      }
      return u;
    }, t.prototype.patternToChar = function(e) {
      for (var n = 0; n < t.CHARACTER_ENCODINGS.length; n++)
        if (t.CHARACTER_ENCODINGS[n] === e)
          return t.ALPHABET_STRING.charAt(n);
      throw new C();
    }, t.prototype.decodeExtended = function(e) {
      for (var n = e.length, i = "", a = 0; a < n; a++) {
        var o = e.charAt(a);
        if (o >= "a" && o <= "d") {
          if (a >= n - 1)
            throw new T();
          var f = e.charAt(a + 1), s = "\0";
          switch (o) {
            case "d":
              if (f >= "A" && f <= "Z")
                s = String.fromCharCode(f.charCodeAt(0) + 32);
              else
                throw new T();
              break;
            case "a":
              if (f >= "A" && f <= "Z")
                s = String.fromCharCode(f.charCodeAt(0) - 64);
              else
                throw new T();
              break;
            case "b":
              if (f >= "A" && f <= "E")
                s = String.fromCharCode(f.charCodeAt(0) - 38);
              else if (f >= "F" && f <= "J")
                s = String.fromCharCode(f.charCodeAt(0) - 11);
              else if (f >= "K" && f <= "O")
                s = String.fromCharCode(f.charCodeAt(0) + 16);
              else if (f >= "P" && f <= "T")
                s = String.fromCharCode(f.charCodeAt(0) + 43);
              else if (f === "U")
                s = "\0";
              else if (f === "V")
                s = "@";
              else if (f === "W")
                s = "`";
              else if (f >= "X" && f <= "Z")
                s = String.fromCharCode(127);
              else
                throw new T();
              break;
            case "c":
              if (f >= "A" && f <= "O")
                s = String.fromCharCode(f.charCodeAt(0) - 32);
              else if (f === "Z")
                s = ":";
              else
                throw new T();
              break;
          }
          i += s, a++;
        } else
          i += o;
      }
      return i;
    }, t.prototype.checkChecksums = function(e) {
      var n = e.length;
      this.checkOneChecksum(e, n - 2, 20), this.checkOneChecksum(e, n - 1, 15);
    }, t.prototype.checkOneChecksum = function(e, n, i) {
      for (var a = 1, o = 0, f = n - 1; f >= 0; f--)
        o += a * t.ALPHABET_STRING.indexOf(e.charAt(f)), ++a > i && (a = 1);
      if (e.charAt(n) !== t.ALPHABET_STRING[o % 47])
        throw new et();
    }, t.ALPHABET_STRING = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. $/+%abcd*", t.CHARACTER_ENCODINGS = [
      276,
      328,
      324,
      322,
      296,
      292,
      290,
      336,
      274,
      266,
      424,
      420,
      418,
      404,
      402,
      394,
      360,
      356,
      354,
      308,
      282,
      344,
      332,
      326,
      300,
      278,
      436,
      434,
      428,
      422,
      406,
      410,
      364,
      358,
      310,
      314,
      302,
      468,
      466,
      458,
      366,
      374,
      430,
      294,
      474,
      470,
      306,
      350
    ], t.ASTERISK_ENCODING = t.CHARACTER_ENCODINGS[47], t;
  }(ft)
), Ln = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), kn = globalThis && globalThis.__values || function(r) {
  var t = typeof Symbol == "function" && Symbol.iterator, e = t && r[t], n = 0;
  if (e)
    return e.call(r);
  if (r && typeof r.length == "number")
    return {
      next: function() {
        return r && n >= r.length && (r = void 0), { value: r && r[n++], done: !r };
      }
    };
  throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, ar = (
  /** @class */
  function(r) {
    Ln(t, r);
    function t() {
      var e = r !== null && r.apply(this, arguments) || this;
      return e.narrowLineWidth = -1, e;
    }
    return t.prototype.decodeRow = function(e, n, i) {
      var a, o, f = this.decodeStart(n), s = this.decodeEnd(n), u = new M();
      t.decodeMiddle(n, f[1], s[0], u);
      var c = u.toString(), l = null;
      i != null && (l = i.get($.ALLOWED_LENGTHS)), l == null && (l = t.DEFAULT_ALLOWED_LENGTHS);
      var h = c.length, d = !1, v = 0;
      try {
        for (var g = kn(l), x = g.next(); !x.done; x = g.next()) {
          var w = x.value;
          if (h === w) {
            d = !0;
            break;
          }
          w > v && (v = w);
        }
      } catch (E) {
        a = { error: E };
      } finally {
        try {
          x && !x.done && (o = g.return) && o.call(g);
        } finally {
          if (a)
            throw a.error;
        }
      }
      if (!d && h > v && (d = !0), !d)
        throw new T();
      var y = [new O(f[1], e), new O(s[0], e)], _ = new pt(
        c,
        null,
        // no natural byte representation for these barcodes
        0,
        y,
        N.ITF,
        (/* @__PURE__ */ new Date()).getTime()
      );
      return _;
    }, t.decodeMiddle = function(e, n, i, a) {
      var o = new Int32Array(10), f = new Int32Array(5), s = new Int32Array(5);
      for (o.fill(0), f.fill(0), s.fill(0); n < i; ) {
        ft.recordPattern(e, n, o);
        for (var u = 0; u < 5; u++) {
          var c = 2 * u;
          f[u] = o[c], s[u] = o[c + 1];
        }
        var l = t.decodeDigit(f);
        a.append(l.toString()), l = this.decodeDigit(s), a.append(l.toString()), o.forEach(function(h) {
          n += h;
        });
      }
    }, t.prototype.decodeStart = function(e) {
      var n = t.skipWhiteSpace(e), i = t.findGuardPattern(e, n, t.START_PATTERN);
      return this.narrowLineWidth = (i[1] - i[0]) / 4, this.validateQuietZone(e, i[0]), i;
    }, t.prototype.validateQuietZone = function(e, n) {
      var i = this.narrowLineWidth * 10;
      i = i < n ? i : n;
      for (var a = n - 1; i > 0 && a >= 0 && !e.get(a); a--)
        i--;
      if (i !== 0)
        throw new C();
    }, t.skipWhiteSpace = function(e) {
      var n = e.getSize(), i = e.getNextSet(0);
      if (i === n)
        throw new C();
      return i;
    }, t.prototype.decodeEnd = function(e) {
      e.reverse();
      try {
        var n = t.skipWhiteSpace(e), i = void 0;
        try {
          i = t.findGuardPattern(e, n, t.END_PATTERN_REVERSED[0]);
        } catch (o) {
          o instanceof C && (i = t.findGuardPattern(e, n, t.END_PATTERN_REVERSED[1]));
        }
        this.validateQuietZone(e, i[0]);
        var a = i[0];
        return i[0] = e.getSize() - i[1], i[1] = e.getSize() - a, i;
      } finally {
        e.reverse();
      }
    }, t.findGuardPattern = function(e, n, i) {
      var a = i.length, o = new Int32Array(a), f = e.getSize(), s = !1, u = 0, c = n;
      o.fill(0);
      for (var l = n; l < f; l++)
        if (e.get(l) !== s)
          o[u]++;
        else {
          if (u === a - 1) {
            if (ft.patternMatchVariance(o, i, t.MAX_INDIVIDUAL_VARIANCE) < t.MAX_AVG_VARIANCE)
              return [c, l];
            c += o[0] + o[1], j.arraycopy(o, 2, o, 0, u - 1), o[u - 1] = 0, o[u] = 0, u--;
          } else
            u++;
          o[u] = 1, s = !s;
        }
      throw new C();
    }, t.decodeDigit = function(e) {
      for (var n = t.MAX_AVG_VARIANCE, i = -1, a = t.PATTERNS.length, o = 0; o < a; o++) {
        var f = t.PATTERNS[o], s = ft.patternMatchVariance(e, f, t.MAX_INDIVIDUAL_VARIANCE);
        s < n ? (n = s, i = o) : s === n && (i = -1);
      }
      if (i >= 0)
        return i % 10;
      throw new C();
    }, t.PATTERNS = [
      Int32Array.from([1, 1, 2, 2, 1]),
      Int32Array.from([2, 1, 1, 1, 2]),
      Int32Array.from([1, 2, 1, 1, 2]),
      Int32Array.from([2, 2, 1, 1, 1]),
      Int32Array.from([1, 1, 2, 1, 2]),
      Int32Array.from([2, 1, 2, 1, 1]),
      Int32Array.from([1, 2, 2, 1, 1]),
      Int32Array.from([1, 1, 1, 2, 2]),
      Int32Array.from([2, 1, 1, 2, 1]),
      Int32Array.from([1, 2, 1, 2, 1]),
      Int32Array.from([1, 1, 3, 3, 1]),
      Int32Array.from([3, 1, 1, 1, 3]),
      Int32Array.from([1, 3, 1, 1, 3]),
      Int32Array.from([3, 3, 1, 1, 1]),
      Int32Array.from([1, 1, 3, 1, 3]),
      Int32Array.from([3, 1, 3, 1, 1]),
      Int32Array.from([1, 3, 3, 1, 1]),
      Int32Array.from([1, 1, 1, 3, 3]),
      Int32Array.from([3, 1, 1, 3, 1]),
      Int32Array.from([1, 3, 1, 3, 1])
      // 9
    ], t.MAX_AVG_VARIANCE = 0.38, t.MAX_INDIVIDUAL_VARIANCE = 0.5, t.DEFAULT_ALLOWED_LENGTHS = [6, 8, 10, 12, 14], t.START_PATTERN = Int32Array.from([1, 1, 1, 1]), t.END_PATTERN_REVERSED = [
      Int32Array.from([1, 1, 2]),
      Int32Array.from([1, 1, 3])
      // 3x
    ], t;
  }(ft)
), Un = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), Zt = (
  /** @class */
  function(r) {
    Un(t, r);
    function t() {
      var e = r !== null && r.apply(this, arguments) || this;
      return e.decodeRowStringBuffer = "", e;
    }
    return t.findStartGuardPattern = function(e) {
      for (var n = !1, i, a = 0, o = Int32Array.from([0, 0, 0]); !n; ) {
        o = Int32Array.from([0, 0, 0]), i = t.findGuardPattern(e, a, !1, this.START_END_PATTERN, o);
        var f = i[0];
        a = i[1];
        var s = f - (a - f);
        s >= 0 && (n = e.isRange(s, f, !1));
      }
      return i;
    }, t.checkChecksum = function(e) {
      return t.checkStandardUPCEANChecksum(e);
    }, t.checkStandardUPCEANChecksum = function(e) {
      var n = e.length;
      if (n === 0)
        return !1;
      var i = parseInt(e.charAt(n - 1), 10);
      return t.getStandardUPCEANChecksum(e.substring(0, n - 1)) === i;
    }, t.getStandardUPCEANChecksum = function(e) {
      for (var n = e.length, i = 0, a = n - 1; a >= 0; a -= 2) {
        var o = e.charAt(a).charCodeAt(0) - "0".charCodeAt(0);
        if (o < 0 || o > 9)
          throw new T();
        i += o;
      }
      i *= 3;
      for (var a = n - 2; a >= 0; a -= 2) {
        var o = e.charAt(a).charCodeAt(0) - "0".charCodeAt(0);
        if (o < 0 || o > 9)
          throw new T();
        i += o;
      }
      return (1e3 - i) % 10;
    }, t.decodeEnd = function(e, n) {
      return t.findGuardPattern(e, n, !1, t.START_END_PATTERN, new Int32Array(t.START_END_PATTERN.length).fill(0));
    }, t.findGuardPatternWithoutCounters = function(e, n, i, a) {
      return this.findGuardPattern(e, n, i, a, new Int32Array(a.length));
    }, t.findGuardPattern = function(e, n, i, a, o) {
      var f = e.getSize();
      n = i ? e.getNextUnset(n) : e.getNextSet(n);
      for (var s = 0, u = n, c = a.length, l = i, h = n; h < f; h++)
        if (e.get(h) !== l)
          o[s]++;
        else {
          if (s === c - 1) {
            if (ft.patternMatchVariance(o, a, t.MAX_INDIVIDUAL_VARIANCE) < t.MAX_AVG_VARIANCE)
              return Int32Array.from([u, h]);
            u += o[0] + o[1];
            for (var d = o.slice(2, o.length), v = 0; v < s - 1; v++)
              o[v] = d[v];
            o[s - 1] = 0, o[s] = 0, s--;
          } else
            s++;
          o[s] = 1, l = !l;
        }
      throw new C();
    }, t.decodeDigit = function(e, n, i, a) {
      this.recordPattern(e, i, n);
      for (var o = this.MAX_AVG_VARIANCE, f = -1, s = a.length, u = 0; u < s; u++) {
        var c = a[u], l = ft.patternMatchVariance(n, c, t.MAX_INDIVIDUAL_VARIANCE);
        l < o && (o = l, f = u);
      }
      if (f >= 0)
        return f;
      throw new C();
    }, t.MAX_AVG_VARIANCE = 0.48, t.MAX_INDIVIDUAL_VARIANCE = 0.7, t.START_END_PATTERN = Int32Array.from([1, 1, 1]), t.MIDDLE_PATTERN = Int32Array.from([1, 1, 1, 1, 1]), t.END_PATTERN = Int32Array.from([1, 1, 1, 1, 1, 1]), t.L_PATTERNS = [
      Int32Array.from([3, 2, 1, 1]),
      Int32Array.from([2, 2, 2, 1]),
      Int32Array.from([2, 1, 2, 2]),
      Int32Array.from([1, 4, 1, 1]),
      Int32Array.from([1, 1, 3, 2]),
      Int32Array.from([1, 2, 3, 1]),
      Int32Array.from([1, 1, 1, 4]),
      Int32Array.from([1, 3, 1, 2]),
      Int32Array.from([1, 2, 1, 3]),
      Int32Array.from([3, 1, 1, 2])
    ], t;
  }(ft)
), Vn = globalThis && globalThis.__values || function(r) {
  var t = typeof Symbol == "function" && Symbol.iterator, e = t && r[t], n = 0;
  if (e)
    return e.call(r);
  if (r && typeof r.length == "number")
    return {
      next: function() {
        return r && n >= r.length && (r = void 0), { value: r && r[n++], done: !r };
      }
    };
  throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, Hn = (
  /** @class */
  function() {
    function r() {
      this.CHECK_DIGIT_ENCODINGS = [24, 20, 18, 17, 12, 6, 3, 10, 9, 5], this.decodeMiddleCounters = Int32Array.from([0, 0, 0, 0]), this.decodeRowStringBuffer = "";
    }
    return r.prototype.decodeRow = function(t, e, n) {
      var i = this.decodeRowStringBuffer, a = this.decodeMiddle(e, n, i), o = i.toString(), f = r.parseExtensionString(o), s = [
        new O((n[0] + n[1]) / 2, t),
        new O(a, t)
      ], u = new pt(o, null, 0, s, N.UPC_EAN_EXTENSION, (/* @__PURE__ */ new Date()).getTime());
      return f != null && u.putAllMetadata(f), u;
    }, r.prototype.decodeMiddle = function(t, e, n) {
      var i, a, o = this.decodeMiddleCounters;
      o[0] = 0, o[1] = 0, o[2] = 0, o[3] = 0;
      for (var f = t.getSize(), s = e[1], u = 0, c = 0; c < 5 && s < f; c++) {
        var l = Zt.decodeDigit(t, o, s, Zt.L_AND_G_PATTERNS);
        n += String.fromCharCode("0".charCodeAt(0) + l % 10);
        try {
          for (var h = (i = void 0, Vn(o)), d = h.next(); !d.done; d = h.next()) {
            var v = d.value;
            s += v;
          }
        } catch (x) {
          i = { error: x };
        } finally {
          try {
            d && !d.done && (a = h.return) && a.call(h);
          } finally {
            if (i)
              throw i.error;
          }
        }
        l >= 10 && (u |= 1 << 4 - c), c !== 4 && (s = t.getNextSet(s), s = t.getNextUnset(s));
      }
      if (n.length !== 5)
        throw new C();
      var g = this.determineCheckDigit(u);
      if (r.extensionChecksum(n.toString()) !== g)
        throw new C();
      return s;
    }, r.extensionChecksum = function(t) {
      for (var e = t.length, n = 0, i = e - 2; i >= 0; i -= 2)
        n += t.charAt(i).charCodeAt(0) - "0".charCodeAt(0);
      n *= 3;
      for (var i = e - 1; i >= 0; i -= 2)
        n += t.charAt(i).charCodeAt(0) - "0".charCodeAt(0);
      return n *= 3, n % 10;
    }, r.prototype.determineCheckDigit = function(t) {
      for (var e = 0; e < 10; e++)
        if (t === this.CHECK_DIGIT_ENCODINGS[e])
          return e;
      throw new C();
    }, r.parseExtensionString = function(t) {
      if (t.length !== 5)
        return null;
      var e = r.parseExtension5String(t);
      return e == null ? null : /* @__PURE__ */ new Map([[dt.SUGGESTED_PRICE, e]]);
    }, r.parseExtension5String = function(t) {
      var e;
      switch (t.charAt(0)) {
        case "0":
          e = "£";
          break;
        case "5":
          e = "$";
          break;
        case "9":
          switch (t) {
            case "90000":
              return null;
            case "99991":
              return "0.00";
            case "99990":
              return "Used";
          }
          e = "";
          break;
        default:
          e = "";
          break;
      }
      var n = parseInt(t.substring(1)), i = (n / 100).toString(), a = n % 100, o = a < 10 ? "0" + a : a.toString();
      return e + i + "." + o;
    }, r;
  }()
), Gn = globalThis && globalThis.__values || function(r) {
  var t = typeof Symbol == "function" && Symbol.iterator, e = t && r[t], n = 0;
  if (e)
    return e.call(r);
  if (r && typeof r.length == "number")
    return {
      next: function() {
        return r && n >= r.length && (r = void 0), { value: r && r[n++], done: !r };
      }
    };
  throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, Xn = (
  /** @class */
  function() {
    function r() {
      this.decodeMiddleCounters = Int32Array.from([0, 0, 0, 0]), this.decodeRowStringBuffer = "";
    }
    return r.prototype.decodeRow = function(t, e, n) {
      var i = this.decodeRowStringBuffer, a = this.decodeMiddle(e, n, i), o = i.toString(), f = r.parseExtensionString(o), s = [
        new O((n[0] + n[1]) / 2, t),
        new O(a, t)
      ], u = new pt(o, null, 0, s, N.UPC_EAN_EXTENSION, (/* @__PURE__ */ new Date()).getTime());
      return f != null && u.putAllMetadata(f), u;
    }, r.prototype.decodeMiddle = function(t, e, n) {
      var i, a, o = this.decodeMiddleCounters;
      o[0] = 0, o[1] = 0, o[2] = 0, o[3] = 0;
      for (var f = t.getSize(), s = e[1], u = 0, c = 0; c < 2 && s < f; c++) {
        var l = Zt.decodeDigit(t, o, s, Zt.L_AND_G_PATTERNS);
        n += String.fromCharCode("0".charCodeAt(0) + l % 10);
        try {
          for (var h = (i = void 0, Gn(o)), d = h.next(); !d.done; d = h.next()) {
            var v = d.value;
            s += v;
          }
        } catch (g) {
          i = { error: g };
        } finally {
          try {
            d && !d.done && (a = h.return) && a.call(h);
          } finally {
            if (i)
              throw i.error;
          }
        }
        l >= 10 && (u |= 1 << 1 - c), c !== 1 && (s = t.getNextSet(s), s = t.getNextUnset(s));
      }
      if (n.length !== 2)
        throw new C();
      if (parseInt(n.toString()) % 4 !== u)
        throw new C();
      return s;
    }, r.parseExtensionString = function(t) {
      return t.length !== 2 ? null : /* @__PURE__ */ new Map([[dt.ISSUE_NUMBER, parseInt(t)]]);
    }, r;
  }()
), Wn = (
  /** @class */
  function() {
    function r() {
    }
    return r.decodeRow = function(t, e, n) {
      var i = Zt.findGuardPattern(e, n, !1, this.EXTENSION_START_PATTERN, new Int32Array(this.EXTENSION_START_PATTERN.length).fill(0));
      try {
        var a = new Hn();
        return a.decodeRow(t, e, i);
      } catch {
        var o = new Xn();
        return o.decodeRow(t, e, i);
      }
    }, r.EXTENSION_START_PATTERN = Int32Array.from([1, 1, 2]), r;
  }()
), zn = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), it = (
  /** @class */
  function(r) {
    zn(t, r);
    function t() {
      var e = r.call(this) || this;
      e.decodeRowStringBuffer = "", t.L_AND_G_PATTERNS = t.L_PATTERNS.map(function(f) {
        return Int32Array.from(f);
      });
      for (var n = 10; n < 20; n++) {
        for (var i = t.L_PATTERNS[n - 10], a = new Int32Array(i.length), o = 0; o < i.length; o++)
          a[o] = i[i.length - o - 1];
        t.L_AND_G_PATTERNS[n] = a;
      }
      return e;
    }
    return t.prototype.decodeRow = function(e, n, i) {
      var a = t.findStartGuardPattern(n), o = i == null ? null : i.get($.NEED_RESULT_POINT_CALLBACK);
      if (o != null) {
        var f = new O((a[0] + a[1]) / 2, e);
        o.foundPossibleResultPoint(f);
      }
      var s = this.decodeMiddle(n, a, this.decodeRowStringBuffer), u = s.rowOffset, c = s.resultString;
      if (o != null) {
        var l = new O(u, e);
        o.foundPossibleResultPoint(l);
      }
      var h = t.decodeEnd(n, u);
      if (o != null) {
        var d = new O((h[0] + h[1]) / 2, e);
        o.foundPossibleResultPoint(d);
      }
      var v = h[1], g = v + (v - h[0]);
      if (g >= n.getSize() || !n.isRange(v, g, !1))
        throw new C();
      var x = c.toString();
      if (x.length < 8)
        throw new T();
      if (!t.checkChecksum(x))
        throw new et();
      var w = (a[1] + a[0]) / 2, y = (h[1] + h[0]) / 2, _ = this.getBarcodeFormat(), E = [new O(w, e), new O(y, e)], m = new pt(x, null, 0, E, _, (/* @__PURE__ */ new Date()).getTime()), I = 0;
      try {
        var S = Wn.decodeRow(e, n, h[1]);
        m.putMetadata(dt.UPC_EAN_EXTENSION, S.getText()), m.putAllMetadata(S.getResultMetadata()), m.addResultPoints(S.getResultPoints()), I = S.getText().length;
      } catch {
      }
      var b = i == null ? null : i.get($.ALLOWED_EAN_EXTENSIONS);
      if (b != null) {
        var P = !1;
        for (var R in b)
          if (I.toString() === R) {
            P = !0;
            break;
          }
        if (!P)
          throw new C();
      }
      return _ === N.EAN_13 || N.UPC_A, m;
    }, t.checkChecksum = function(e) {
      return t.checkStandardUPCEANChecksum(e);
    }, t.checkStandardUPCEANChecksum = function(e) {
      var n = e.length;
      if (n === 0)
        return !1;
      var i = parseInt(e.charAt(n - 1), 10);
      return t.getStandardUPCEANChecksum(e.substring(0, n - 1)) === i;
    }, t.getStandardUPCEANChecksum = function(e) {
      for (var n = e.length, i = 0, a = n - 1; a >= 0; a -= 2) {
        var o = e.charAt(a).charCodeAt(0) - "0".charCodeAt(0);
        if (o < 0 || o > 9)
          throw new T();
        i += o;
      }
      i *= 3;
      for (var a = n - 2; a >= 0; a -= 2) {
        var o = e.charAt(a).charCodeAt(0) - "0".charCodeAt(0);
        if (o < 0 || o > 9)
          throw new T();
        i += o;
      }
      return (1e3 - i) % 10;
    }, t.decodeEnd = function(e, n) {
      return t.findGuardPattern(e, n, !1, t.START_END_PATTERN, new Int32Array(t.START_END_PATTERN.length).fill(0));
    }, t;
  }(Zt)
), jn = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), or = globalThis && globalThis.__values || function(r) {
  var t = typeof Symbol == "function" && Symbol.iterator, e = t && r[t], n = 0;
  if (e)
    return e.call(r);
  if (r && typeof r.length == "number")
    return {
      next: function() {
        return r && n >= r.length && (r = void 0), { value: r && r[n++], done: !r };
      }
    };
  throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, Ue = (
  /** @class */
  function(r) {
    jn(t, r);
    function t() {
      var e = r.call(this) || this;
      return e.decodeMiddleCounters = Int32Array.from([0, 0, 0, 0]), e;
    }
    return t.prototype.decodeMiddle = function(e, n, i) {
      var a, o, f, s, u = this.decodeMiddleCounters;
      u[0] = 0, u[1] = 0, u[2] = 0, u[3] = 0;
      for (var c = e.getSize(), l = n[1], h = 0, d = 0; d < 6 && l < c; d++) {
        var v = it.decodeDigit(e, u, l, it.L_AND_G_PATTERNS);
        i += String.fromCharCode("0".charCodeAt(0) + v % 10);
        try {
          for (var g = (a = void 0, or(u)), x = g.next(); !x.done; x = g.next()) {
            var w = x.value;
            l += w;
          }
        } catch (m) {
          a = { error: m };
        } finally {
          try {
            x && !x.done && (o = g.return) && o.call(g);
          } finally {
            if (a)
              throw a.error;
          }
        }
        v >= 10 && (h |= 1 << 5 - d);
      }
      i = t.determineFirstDigit(i, h);
      var y = it.findGuardPattern(e, l, !0, it.MIDDLE_PATTERN, new Int32Array(it.MIDDLE_PATTERN.length).fill(0));
      l = y[1];
      for (var d = 0; d < 6 && l < c; d++) {
        var v = it.decodeDigit(e, u, l, it.L_PATTERNS);
        i += String.fromCharCode("0".charCodeAt(0) + v);
        try {
          for (var _ = (f = void 0, or(u)), E = _.next(); !E.done; E = _.next()) {
            var w = E.value;
            l += w;
          }
        } catch (S) {
          f = { error: S };
        } finally {
          try {
            E && !E.done && (s = _.return) && s.call(_);
          } finally {
            if (f)
              throw f.error;
          }
        }
      }
      return { rowOffset: l, resultString: i };
    }, t.prototype.getBarcodeFormat = function() {
      return N.EAN_13;
    }, t.determineFirstDigit = function(e, n) {
      for (var i = 0; i < 10; i++)
        if (n === this.FIRST_DIGIT_ENCODINGS[i])
          return e = String.fromCharCode("0".charCodeAt(0) + i) + e, e;
      throw new C();
    }, t.FIRST_DIGIT_ENCODINGS = [0, 11, 13, 14, 19, 25, 28, 21, 22, 26], t;
  }(it)
), Yn = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), fr = globalThis && globalThis.__values || function(r) {
  var t = typeof Symbol == "function" && Symbol.iterator, e = t && r[t], n = 0;
  if (e)
    return e.call(r);
  if (r && typeof r.length == "number")
    return {
      next: function() {
        return r && n >= r.length && (r = void 0), { value: r && r[n++], done: !r };
      }
    };
  throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, sr = (
  /** @class */
  function(r) {
    Yn(t, r);
    function t() {
      var e = r.call(this) || this;
      return e.decodeMiddleCounters = Int32Array.from([0, 0, 0, 0]), e;
    }
    return t.prototype.decodeMiddle = function(e, n, i) {
      var a, o, f, s, u = this.decodeMiddleCounters;
      u[0] = 0, u[1] = 0, u[2] = 0, u[3] = 0;
      for (var c = e.getSize(), l = n[1], h = 0; h < 4 && l < c; h++) {
        var d = it.decodeDigit(e, u, l, it.L_PATTERNS);
        i += String.fromCharCode("0".charCodeAt(0) + d);
        try {
          for (var v = (a = void 0, fr(u)), g = v.next(); !g.done; g = v.next()) {
            var x = g.value;
            l += x;
          }
        } catch (E) {
          a = { error: E };
        } finally {
          try {
            g && !g.done && (o = v.return) && o.call(v);
          } finally {
            if (a)
              throw a.error;
          }
        }
      }
      var w = it.findGuardPattern(e, l, !0, it.MIDDLE_PATTERN, new Int32Array(it.MIDDLE_PATTERN.length).fill(0));
      l = w[1];
      for (var h = 0; h < 4 && l < c; h++) {
        var d = it.decodeDigit(e, u, l, it.L_PATTERNS);
        i += String.fromCharCode("0".charCodeAt(0) + d);
        try {
          for (var y = (f = void 0, fr(u)), _ = y.next(); !_.done; _ = y.next()) {
            var x = _.value;
            l += x;
          }
        } catch (I) {
          f = { error: I };
        } finally {
          try {
            _ && !_.done && (s = y.return) && s.call(y);
          } finally {
            if (f)
              throw f.error;
          }
        }
      }
      return { rowOffset: l, resultString: i };
    }, t.prototype.getBarcodeFormat = function() {
      return N.EAN_8;
    }, t;
  }(it)
), Zn = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), ur = (
  /** @class */
  function(r) {
    Zn(t, r);
    function t() {
      var e = r !== null && r.apply(this, arguments) || this;
      return e.ean13Reader = new Ue(), e;
    }
    return t.prototype.getBarcodeFormat = function() {
      return N.UPC_A;
    }, t.prototype.decode = function(e, n) {
      return this.maybeReturnResult(this.ean13Reader.decode(e));
    }, t.prototype.decodeRow = function(e, n, i) {
      return this.maybeReturnResult(this.ean13Reader.decodeRow(e, n, i));
    }, t.prototype.decodeMiddle = function(e, n, i) {
      return this.ean13Reader.decodeMiddle(e, n, i);
    }, t.prototype.maybeReturnResult = function(e) {
      var n = e.getText();
      if (n.charAt(0) === "0") {
        var i = new pt(n.substring(1), null, null, e.getResultPoints(), N.UPC_A);
        return e.getResultMetadata() != null && i.putAllMetadata(e.getResultMetadata()), i;
      } else
        throw new C();
    }, t.prototype.reset = function() {
      this.ean13Reader.reset();
    }, t;
  }(it)
), $n = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), Kn = globalThis && globalThis.__values || function(r) {
  var t = typeof Symbol == "function" && Symbol.iterator, e = t && r[t], n = 0;
  if (e)
    return e.call(r);
  if (r && typeof r.length == "number")
    return {
      next: function() {
        return r && n >= r.length && (r = void 0), { value: r && r[n++], done: !r };
      }
    };
  throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, cr = (
  /** @class */
  function(r) {
    $n(t, r);
    function t() {
      var e = r.call(this) || this;
      return e.decodeMiddleCounters = new Int32Array(4), e;
    }
    return t.prototype.decodeMiddle = function(e, n, i) {
      var a, o, f = this.decodeMiddleCounters.map(function(x) {
        return x;
      });
      f[0] = 0, f[1] = 0, f[2] = 0, f[3] = 0;
      for (var s = e.getSize(), u = n[1], c = 0, l = 0; l < 6 && u < s; l++) {
        var h = t.decodeDigit(e, f, u, t.L_AND_G_PATTERNS);
        i += String.fromCharCode("0".charCodeAt(0) + h % 10);
        try {
          for (var d = (a = void 0, Kn(f)), v = d.next(); !v.done; v = d.next()) {
            var g = v.value;
            u += g;
          }
        } catch (x) {
          a = { error: x };
        } finally {
          try {
            v && !v.done && (o = d.return) && o.call(d);
          } finally {
            if (a)
              throw a.error;
          }
        }
        h >= 10 && (c |= 1 << 5 - l);
      }
      return t.determineNumSysAndCheckDigit(new M(i), c), u;
    }, t.prototype.decodeEnd = function(e, n) {
      return t.findGuardPatternWithoutCounters(e, n, !0, t.MIDDLE_END_PATTERN);
    }, t.prototype.checkChecksum = function(e) {
      return it.checkChecksum(t.convertUPCEtoUPCA(e));
    }, t.determineNumSysAndCheckDigit = function(e, n) {
      for (var i = 0; i <= 1; i++)
        for (var a = 0; a < 10; a++)
          if (n === this.NUMSYS_AND_CHECK_DIGIT_PATTERNS[i][a]) {
            e.insert(
              0,
              /*(char)*/
              "0" + i
            ), e.append(
              /*(char)*/
              "0" + a
            );
            return;
          }
      throw C.getNotFoundInstance();
    }, t.prototype.getBarcodeFormat = function() {
      return N.UPC_E;
    }, t.convertUPCEtoUPCA = function(e) {
      var n = e.slice(1, 7).split("").map(function(o) {
        return o.charCodeAt(0);
      }), i = new M(
        /*12*/
      );
      i.append(e.charAt(0));
      var a = n[5];
      switch (a) {
        case 0:
        case 1:
        case 2:
          i.appendChars(n, 0, 2), i.append(a), i.append("0000"), i.appendChars(n, 2, 3);
          break;
        case 3:
          i.appendChars(n, 0, 3), i.append("00000"), i.appendChars(n, 3, 2);
          break;
        case 4:
          i.appendChars(n, 0, 4), i.append("00000"), i.append(n[4]);
          break;
        default:
          i.appendChars(n, 0, 5), i.append("0000"), i.append(a);
          break;
      }
      return e.length >= 8 && i.append(e.charAt(7)), i.toString();
    }, t.MIDDLE_END_PATTERN = Int32Array.from([1, 1, 1, 1, 1, 1]), t.NUMSYS_AND_CHECK_DIGIT_PATTERNS = [
      Int32Array.from([56, 52, 50, 49, 44, 38, 35, 42, 41, 37]),
      Int32Array.from([7, 11, 13, 14, 19, 25, 28, 21, 22, 1])
    ], t;
  }(it)
), qn = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), lr = globalThis && globalThis.__values || function(r) {
  var t = typeof Symbol == "function" && Symbol.iterator, e = t && r[t], n = 0;
  if (e)
    return e.call(r);
  if (r && typeof r.length == "number")
    return {
      next: function() {
        return r && n >= r.length && (r = void 0), { value: r && r[n++], done: !r };
      }
    };
  throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, Se = (
  /** @class */
  function(r) {
    qn(t, r);
    function t(e) {
      var n = r.call(this) || this, i = e == null ? null : e.get($.POSSIBLE_FORMATS), a = [];
      return i != null && (i.indexOf(N.EAN_13) > -1 && a.push(new Ue()), i.indexOf(N.UPC_A) > -1 && a.push(new ur()), i.indexOf(N.EAN_8) > -1 && a.push(new sr()), i.indexOf(N.UPC_E) > -1 && a.push(new cr())), a.length === 0 && (a.push(new Ue()), a.push(new ur()), a.push(new sr()), a.push(new cr())), n.readers = a, n;
    }
    return t.prototype.decodeRow = function(e, n, i) {
      var a, o;
      try {
        for (var f = lr(this.readers), s = f.next(); !s.done; s = f.next()) {
          var u = s.value;
          try {
            var c = u.decodeRow(e, n, i), l = c.getBarcodeFormat() === N.EAN_13 && c.getText().charAt(0) === "0", h = i == null ? null : i.get($.POSSIBLE_FORMATS), d = h == null || h.includes(N.UPC_A);
            if (l && d) {
              var v = c.getRawBytes(), g = new pt(c.getText().substring(1), v, v ? v.length : null, c.getResultPoints(), N.UPC_A);
              return g.putAllMetadata(c.getResultMetadata()), g;
            }
            return c;
          } catch {
          }
        }
      } catch (x) {
        a = { error: x };
      } finally {
        try {
          s && !s.done && (o = f.return) && o.call(f);
        } finally {
          if (a)
            throw a.error;
        }
      }
      throw new C();
    }, t.prototype.reset = function() {
      var e, n;
      try {
        for (var i = lr(this.readers), a = i.next(); !a.done; a = i.next()) {
          var o = a.value;
          o.reset();
        }
      } catch (f) {
        e = { error: f };
      } finally {
        try {
          a && !a.done && (n = i.return) && n.call(i);
        } finally {
          if (e)
            throw e.error;
        }
      }
    }, t;
  }(ft)
), Qn = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), Jn = (
  /** @class */
  function(r) {
    Qn(t, r);
    function t() {
      var e = r !== null && r.apply(this, arguments) || this;
      return e.CODA_BAR_CHAR_SET = {
        nnnnnww: "0",
        nnnnwwn: "1",
        nnnwnnw: "2",
        wwnnnnn: "3",
        nnwnnwn: "4",
        wnnnnwn: "5",
        nwnnnnw: "6",
        nwnnwnn: "7",
        nwwnnnn: "8",
        wnnwnnn: "9",
        nnnwwnn: "-",
        nnwwnnn: "$",
        wnnnwnw: ":",
        wnwnnnw: "/",
        wnwnwnn: ".",
        nnwwwww: "+",
        nnwwnwn: "A",
        nwnwnnw: "B",
        nnnwnww: "C",
        nnnwwwn: "D"
      }, e;
    }
    return t.prototype.decodeRow = function(e, n, i) {
      var a = this.getValidRowData(n);
      if (!a)
        throw new C();
      var o = this.codaBarDecodeRow(a.row);
      if (!o)
        throw new C();
      return new pt(o, null, 0, [new O(a.left, e), new O(a.right, e)], N.CODABAR, (/* @__PURE__ */ new Date()).getTime());
    }, t.prototype.getValidRowData = function(e) {
      var n = e.toArray(), i = n.indexOf(!0);
      if (i === -1)
        return null;
      var a = n.lastIndexOf(!0);
      if (a <= i)
        return null;
      n = n.slice(i, a + 1);
      for (var o = [], f = n[0], s = 1, u = 1; u < n.length; u++)
        n[u] === f ? s++ : (f = n[u], o.push(s), s = 1);
      return o.push(s), o.length < 23 && (o.length + 1) % 8 !== 0 ? null : { row: o, left: i, right: a };
    }, t.prototype.codaBarDecodeRow = function(e) {
      for (var n = [], i = Math.ceil(e.reduce(function(s, u) {
        return (s + u) / 2;
      }, 0)); e.length > 0; ) {
        var a = e.splice(0, 8).splice(0, 7), o = a.map(function(s) {
          return s < i ? "n" : "w";
        }).join("");
        if (this.CODA_BAR_CHAR_SET[o] === void 0)
          return null;
        n.push(this.CODA_BAR_CHAR_SET[o]);
      }
      var f = n.join("");
      return this.validCodaBarString(f) ? f : null;
    }, t.prototype.validCodaBarString = function(e) {
      var n = /^[A-D].{1,}[A-D]$/;
      return n.test(e);
    }, t;
  }(ft)
), ti = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), ei = globalThis && globalThis.__values || function(r) {
  var t = typeof Symbol == "function" && Symbol.iterator, e = t && r[t], n = 0;
  if (e)
    return e.call(r);
  if (r && typeof r.length == "number")
    return {
      next: function() {
        return r && n >= r.length && (r = void 0), { value: r && r[n++], done: !r };
      }
    };
  throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, Vt = (
  /** @class */
  function(r) {
    ti(t, r);
    function t() {
      var e = r.call(this) || this;
      return e.decodeFinderCounters = new Int32Array(4), e.dataCharacterCounters = new Int32Array(8), e.oddRoundingErrors = new Array(4), e.evenRoundingErrors = new Array(4), e.oddCounts = new Array(e.dataCharacterCounters.length / 2), e.evenCounts = new Array(e.dataCharacterCounters.length / 2), e;
    }
    return t.prototype.getDecodeFinderCounters = function() {
      return this.decodeFinderCounters;
    }, t.prototype.getDataCharacterCounters = function() {
      return this.dataCharacterCounters;
    }, t.prototype.getOddRoundingErrors = function() {
      return this.oddRoundingErrors;
    }, t.prototype.getEvenRoundingErrors = function() {
      return this.evenRoundingErrors;
    }, t.prototype.getOddCounts = function() {
      return this.oddCounts;
    }, t.prototype.getEvenCounts = function() {
      return this.evenCounts;
    }, t.prototype.parseFinderValue = function(e, n) {
      for (var i = 0; i < n.length; i++)
        if (ft.patternMatchVariance(e, n[i], t.MAX_INDIVIDUAL_VARIANCE) < t.MAX_AVG_VARIANCE)
          return i;
      throw new C();
    }, t.count = function(e) {
      return U.sum(new Int32Array(e));
    }, t.increment = function(e, n) {
      for (var i = 0, a = n[0], o = 1; o < e.length; o++)
        n[o] > a && (a = n[o], i = o);
      e[i]++;
    }, t.decrement = function(e, n) {
      for (var i = 0, a = n[0], o = 1; o < e.length; o++)
        n[o] < a && (a = n[o], i = o);
      e[i]--;
    }, t.isFinderPattern = function(e) {
      var n, i, a = e[0] + e[1], o = a + e[2] + e[3], f = a / o;
      if (f >= t.MIN_FINDER_PATTERN_RATIO && f <= t.MAX_FINDER_PATTERN_RATIO) {
        var s = Number.MAX_SAFE_INTEGER, u = Number.MIN_SAFE_INTEGER;
        try {
          for (var c = ei(e), l = c.next(); !l.done; l = c.next()) {
            var h = l.value;
            h > u && (u = h), h < s && (s = h);
          }
        } catch (d) {
          n = { error: d };
        } finally {
          try {
            l && !l.done && (i = c.return) && i.call(c);
          } finally {
            if (n)
              throw n.error;
          }
        }
        return u < 10 * s;
      }
      return !1;
    }, t.MAX_AVG_VARIANCE = 0.2, t.MAX_INDIVIDUAL_VARIANCE = 0.45, t.MIN_FINDER_PATTERN_RATIO = 9.5 / 12, t.MAX_FINDER_PATTERN_RATIO = 12.5 / 14, t;
  }(ft)
), de = (
  /** @class */
  function() {
    function r(t, e) {
      this.value = t, this.checksumPortion = e;
    }
    return r.prototype.getValue = function() {
      return this.value;
    }, r.prototype.getChecksumPortion = function() {
      return this.checksumPortion;
    }, r.prototype.toString = function() {
      return this.value + "(" + this.checksumPortion + ")";
    }, r.prototype.equals = function(t) {
      if (!(t instanceof r))
        return !1;
      var e = t;
      return this.value === e.value && this.checksumPortion === e.checksumPortion;
    }, r.prototype.hashCode = function() {
      return this.value ^ this.checksumPortion;
    }, r;
  }()
), Ur = (
  /** @class */
  function() {
    function r(t, e, n, i, a) {
      this.value = t, this.startEnd = e, this.value = t, this.startEnd = e, this.resultPoints = new Array(), this.resultPoints.push(new O(n, a)), this.resultPoints.push(new O(i, a));
    }
    return r.prototype.getValue = function() {
      return this.value;
    }, r.prototype.getStartEnd = function() {
      return this.startEnd;
    }, r.prototype.getResultPoints = function() {
      return this.resultPoints;
    }, r.prototype.equals = function(t) {
      if (!(t instanceof r))
        return !1;
      var e = t;
      return this.value === e.value;
    }, r.prototype.hashCode = function() {
      return this.value;
    }, r;
  }()
), ri = globalThis && globalThis.__values || function(r) {
  var t = typeof Symbol == "function" && Symbol.iterator, e = t && r[t], n = 0;
  if (e)
    return e.call(r);
  if (r && typeof r.length == "number")
    return {
      next: function() {
        return r && n >= r.length && (r = void 0), { value: r && r[n++], done: !r };
      }
    };
  throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, Wt = (
  /** @class */
  function() {
    function r() {
    }
    return r.getRSSvalue = function(t, e, n) {
      var i, a, o = 0;
      try {
        for (var f = ri(t), s = f.next(); !s.done; s = f.next()) {
          var u = s.value;
          o += u;
        }
      } catch (y) {
        i = { error: y };
      } finally {
        try {
          s && !s.done && (a = f.return) && a.call(f);
        } finally {
          if (i)
            throw i.error;
        }
      }
      for (var c = 0, l = 0, h = t.length, d = 0; d < h - 1; d++) {
        var v = void 0;
        for (v = 1, l |= 1 << d; v < t[d]; v++, l &= ~(1 << d)) {
          var g = r.combins(o - v - 1, h - d - 2);
          if (n && l === 0 && o - v - (h - d - 1) >= h - d - 1 && (g -= r.combins(o - v - (h - d), h - d - 2)), h - d - 1 > 1) {
            for (var x = 0, w = o - v - (h - d - 2); w > e; w--)
              x += r.combins(o - v - w - 1, h - d - 3);
            g -= x * (h - 1 - d);
          } else
            o - v > e && g--;
          c += g;
        }
        o -= v;
      }
      return c;
    }, r.combins = function(t, e) {
      var n, i;
      t - e > e ? (i = e, n = t - e) : (i = t - e, n = e);
      for (var a = 1, o = 1, f = t; f > n; f--)
        a *= f, o <= i && (a /= o, o++);
      for (; o <= i; )
        a /= o, o++;
      return a;
    }, r;
  }()
), ni = (
  /** @class */
  function() {
    function r() {
    }
    return r.buildBitArray = function(t) {
      var e = t.length * 2 - 1;
      t[t.length - 1].getRightChar() == null && (e -= 1);
      for (var n = 12 * e, i = new ct(n), a = 0, o = t[0], f = o.getRightChar().getValue(), s = 11; s >= 0; --s)
        f & 1 << s && i.set(a), a++;
      for (var s = 1; s < t.length; ++s) {
        for (var u = t[s], c = u.getLeftChar().getValue(), l = 11; l >= 0; --l)
          c & 1 << l && i.set(a), a++;
        if (u.getRightChar() !== null)
          for (var h = u.getRightChar().getValue(), l = 11; l >= 0; --l)
            h & 1 << l && i.set(a), a++;
      }
      return i;
    }, r;
  }()
), kt = (
  /** @class */
  function() {
    function r(t, e) {
      e ? this.decodedInformation = null : (this.finished = t, this.decodedInformation = e);
    }
    return r.prototype.getDecodedInformation = function() {
      return this.decodedInformation;
    }, r.prototype.isFinished = function() {
      return this.finished;
    }, r;
  }()
), Ze = (
  /** @class */
  function() {
    function r(t) {
      this.newPosition = t;
    }
    return r.prototype.getNewPosition = function() {
      return this.newPosition;
    }, r;
  }()
), ii = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), St = (
  /** @class */
  function(r) {
    ii(t, r);
    function t(e, n) {
      var i = r.call(this, e) || this;
      return i.value = n, i;
    }
    return t.prototype.getValue = function() {
      return this.value;
    }, t.prototype.isFNC1 = function() {
      return this.value === t.FNC1;
    }, t.FNC1 = "$", t;
  }(Ze)
), ai = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), Ut = (
  /** @class */
  function(r) {
    ai(t, r);
    function t(e, n, i) {
      var a = r.call(this, e) || this;
      return i ? (a.remaining = !0, a.remainingValue = a.remainingValue) : (a.remaining = !1, a.remainingValue = 0), a.newString = n, a;
    }
    return t.prototype.getNewString = function() {
      return this.newString;
    }, t.prototype.isRemaining = function() {
      return this.remaining;
    }, t.prototype.getRemainingValue = function() {
      return this.remainingValue;
    }, t;
  }(Ze)
), oi = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), Xt = (
  /** @class */
  function(r) {
    oi(t, r);
    function t(e, n, i) {
      var a = r.call(this, e) || this;
      if (n < 0 || n > 10 || i < 0 || i > 10)
        throw new T();
      return a.firstDigit = n, a.secondDigit = i, a;
    }
    return t.prototype.getFirstDigit = function() {
      return this.firstDigit;
    }, t.prototype.getSecondDigit = function() {
      return this.secondDigit;
    }, t.prototype.getValue = function() {
      return this.firstDigit * 10 + this.secondDigit;
    }, t.prototype.isFirstDigitFNC1 = function() {
      return this.firstDigit === t.FNC1;
    }, t.prototype.isSecondDigitFNC1 = function() {
      return this.secondDigit === t.FNC1;
    }, t.prototype.isAnyFNC1 = function() {
      return this.firstDigit === t.FNC1 || this.secondDigit === t.FNC1;
    }, t.FNC1 = 10, t;
  }(Ze)
), oe = globalThis && globalThis.__values || function(r) {
  var t = typeof Symbol == "function" && Symbol.iterator, e = t && r[t], n = 0;
  if (e)
    return e.call(r);
  if (r && typeof r.length == "number")
    return {
      next: function() {
        return r && n >= r.length && (r = void 0), { value: r && r[n++], done: !r };
      }
    };
  throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, fi = (
  /** @class */
  function() {
    function r() {
    }
    return r.parseFieldsInGeneralPurpose = function(t) {
      var e, n, i, a, o, f, s, u;
      if (!t)
        return null;
      if (t.length < 2)
        throw new C();
      var c = t.substring(0, 2);
      try {
        for (var l = oe(r.TWO_DIGIT_DATA_LENGTH), h = l.next(); !h.done; h = l.next()) {
          var d = h.value;
          if (d[0] === c)
            return d[1] === r.VARIABLE_LENGTH ? r.processVariableAI(2, d[2], t) : r.processFixedAI(2, d[1], t);
        }
      } catch (I) {
        e = { error: I };
      } finally {
        try {
          h && !h.done && (n = l.return) && n.call(l);
        } finally {
          if (e)
            throw e.error;
        }
      }
      if (t.length < 3)
        throw new C();
      var v = t.substring(0, 3);
      try {
        for (var g = oe(r.THREE_DIGIT_DATA_LENGTH), x = g.next(); !x.done; x = g.next()) {
          var d = x.value;
          if (d[0] === v)
            return d[1] === r.VARIABLE_LENGTH ? r.processVariableAI(3, d[2], t) : r.processFixedAI(3, d[1], t);
        }
      } catch (I) {
        i = { error: I };
      } finally {
        try {
          x && !x.done && (a = g.return) && a.call(g);
        } finally {
          if (i)
            throw i.error;
        }
      }
      try {
        for (var w = oe(r.THREE_DIGIT_PLUS_DIGIT_DATA_LENGTH), y = w.next(); !y.done; y = w.next()) {
          var d = y.value;
          if (d[0] === v)
            return d[1] === r.VARIABLE_LENGTH ? r.processVariableAI(4, d[2], t) : r.processFixedAI(4, d[1], t);
        }
      } catch (I) {
        o = { error: I };
      } finally {
        try {
          y && !y.done && (f = w.return) && f.call(w);
        } finally {
          if (o)
            throw o.error;
        }
      }
      if (t.length < 4)
        throw new C();
      var _ = t.substring(0, 4);
      try {
        for (var E = oe(r.FOUR_DIGIT_DATA_LENGTH), m = E.next(); !m.done; m = E.next()) {
          var d = m.value;
          if (d[0] === _)
            return d[1] === r.VARIABLE_LENGTH ? r.processVariableAI(4, d[2], t) : r.processFixedAI(4, d[1], t);
        }
      } catch (I) {
        s = { error: I };
      } finally {
        try {
          m && !m.done && (u = E.return) && u.call(E);
        } finally {
          if (s)
            throw s.error;
        }
      }
      throw new C();
    }, r.processFixedAI = function(t, e, n) {
      if (n.length < t)
        throw new C();
      var i = n.substring(0, t);
      if (n.length < t + e)
        throw new C();
      var a = n.substring(t, t + e), o = n.substring(t + e), f = "(" + i + ")" + a, s = r.parseFieldsInGeneralPurpose(o);
      return s == null ? f : f + s;
    }, r.processVariableAI = function(t, e, n) {
      var i = n.substring(0, t), a;
      n.length < t + e ? a = n.length : a = t + e;
      var o = n.substring(t, a), f = n.substring(a), s = "(" + i + ")" + o, u = r.parseFieldsInGeneralPurpose(f);
      return u == null ? s : s + u;
    }, r.VARIABLE_LENGTH = [], r.TWO_DIGIT_DATA_LENGTH = [
      ["00", 18],
      ["01", 14],
      ["02", 14],
      ["10", r.VARIABLE_LENGTH, 20],
      ["11", 6],
      ["12", 6],
      ["13", 6],
      ["15", 6],
      ["17", 6],
      ["20", 2],
      ["21", r.VARIABLE_LENGTH, 20],
      ["22", r.VARIABLE_LENGTH, 29],
      ["30", r.VARIABLE_LENGTH, 8],
      ["37", r.VARIABLE_LENGTH, 8],
      // internal company codes
      ["90", r.VARIABLE_LENGTH, 30],
      ["91", r.VARIABLE_LENGTH, 30],
      ["92", r.VARIABLE_LENGTH, 30],
      ["93", r.VARIABLE_LENGTH, 30],
      ["94", r.VARIABLE_LENGTH, 30],
      ["95", r.VARIABLE_LENGTH, 30],
      ["96", r.VARIABLE_LENGTH, 30],
      ["97", r.VARIABLE_LENGTH, 3],
      ["98", r.VARIABLE_LENGTH, 30],
      ["99", r.VARIABLE_LENGTH, 30]
    ], r.THREE_DIGIT_DATA_LENGTH = [
      // Same format as above
      ["240", r.VARIABLE_LENGTH, 30],
      ["241", r.VARIABLE_LENGTH, 30],
      ["242", r.VARIABLE_LENGTH, 6],
      ["250", r.VARIABLE_LENGTH, 30],
      ["251", r.VARIABLE_LENGTH, 30],
      ["253", r.VARIABLE_LENGTH, 17],
      ["254", r.VARIABLE_LENGTH, 20],
      ["400", r.VARIABLE_LENGTH, 30],
      ["401", r.VARIABLE_LENGTH, 30],
      ["402", 17],
      ["403", r.VARIABLE_LENGTH, 30],
      ["410", 13],
      ["411", 13],
      ["412", 13],
      ["413", 13],
      ["414", 13],
      ["420", r.VARIABLE_LENGTH, 20],
      ["421", r.VARIABLE_LENGTH, 15],
      ["422", 3],
      ["423", r.VARIABLE_LENGTH, 15],
      ["424", 3],
      ["425", 3],
      ["426", 3]
    ], r.THREE_DIGIT_PLUS_DIGIT_DATA_LENGTH = [
      // Same format as above
      ["310", 6],
      ["311", 6],
      ["312", 6],
      ["313", 6],
      ["314", 6],
      ["315", 6],
      ["316", 6],
      ["320", 6],
      ["321", 6],
      ["322", 6],
      ["323", 6],
      ["324", 6],
      ["325", 6],
      ["326", 6],
      ["327", 6],
      ["328", 6],
      ["329", 6],
      ["330", 6],
      ["331", 6],
      ["332", 6],
      ["333", 6],
      ["334", 6],
      ["335", 6],
      ["336", 6],
      ["340", 6],
      ["341", 6],
      ["342", 6],
      ["343", 6],
      ["344", 6],
      ["345", 6],
      ["346", 6],
      ["347", 6],
      ["348", 6],
      ["349", 6],
      ["350", 6],
      ["351", 6],
      ["352", 6],
      ["353", 6],
      ["354", 6],
      ["355", 6],
      ["356", 6],
      ["357", 6],
      ["360", 6],
      ["361", 6],
      ["362", 6],
      ["363", 6],
      ["364", 6],
      ["365", 6],
      ["366", 6],
      ["367", 6],
      ["368", 6],
      ["369", 6],
      ["390", r.VARIABLE_LENGTH, 15],
      ["391", r.VARIABLE_LENGTH, 18],
      ["392", r.VARIABLE_LENGTH, 15],
      ["393", r.VARIABLE_LENGTH, 18],
      ["703", r.VARIABLE_LENGTH, 30]
    ], r.FOUR_DIGIT_DATA_LENGTH = [
      // Same format as above
      ["7001", 13],
      ["7002", r.VARIABLE_LENGTH, 30],
      ["7003", 10],
      ["8001", 14],
      ["8002", r.VARIABLE_LENGTH, 20],
      ["8003", r.VARIABLE_LENGTH, 30],
      ["8004", r.VARIABLE_LENGTH, 30],
      ["8005", 6],
      ["8006", 18],
      ["8007", r.VARIABLE_LENGTH, 30],
      ["8008", r.VARIABLE_LENGTH, 12],
      ["8018", 18],
      ["8020", r.VARIABLE_LENGTH, 25],
      ["8100", 6],
      ["8101", 10],
      ["8102", 2],
      ["8110", r.VARIABLE_LENGTH, 70],
      ["8200", r.VARIABLE_LENGTH, 70]
    ], r;
  }()
), ce = (
  /** @class */
  function() {
    function r(t) {
      this.buffer = new M(), this.information = t;
    }
    return r.prototype.decodeAllCodes = function(t, e) {
      var n = e, i = null;
      do {
        var a = this.decodeGeneralPurposeField(n, i), o = fi.parseFieldsInGeneralPurpose(a.getNewString());
        if (o != null && t.append(o), a.isRemaining() ? i = "" + a.getRemainingValue() : i = null, n === a.getNewPosition())
          break;
        n = a.getNewPosition();
      } while (!0);
      return t.toString();
    }, r.prototype.isStillNumeric = function(t) {
      if (t + 7 > this.information.getSize())
        return t + 4 <= this.information.getSize();
      for (var e = t; e < t + 3; ++e)
        if (this.information.get(e))
          return !0;
      return this.information.get(t + 3);
    }, r.prototype.decodeNumeric = function(t) {
      if (t + 7 > this.information.getSize()) {
        var e = this.extractNumericValueFromBitArray(t, 4);
        return e === 0 ? new Xt(this.information.getSize(), Xt.FNC1, Xt.FNC1) : new Xt(this.information.getSize(), e - 1, Xt.FNC1);
      }
      var n = this.extractNumericValueFromBitArray(t, 7), i = (n - 8) / 11, a = (n - 8) % 11;
      return new Xt(t + 7, i, a);
    }, r.prototype.extractNumericValueFromBitArray = function(t, e) {
      return r.extractNumericValueFromBitArray(this.information, t, e);
    }, r.extractNumericValueFromBitArray = function(t, e, n) {
      for (var i = 0, a = 0; a < n; ++a)
        t.get(e + a) && (i |= 1 << n - a - 1);
      return i;
    }, r.prototype.decodeGeneralPurposeField = function(t, e) {
      this.buffer.setLengthToZero(), e != null && this.buffer.append(e), this.current.setPosition(t);
      var n = this.parseBlocks();
      return n != null && n.isRemaining() ? new Ut(this.current.getPosition(), this.buffer.toString(), n.getRemainingValue()) : new Ut(this.current.getPosition(), this.buffer.toString());
    }, r.prototype.parseBlocks = function() {
      var t, e;
      do {
        var n = this.current.getPosition();
        this.current.isAlpha() ? (e = this.parseAlphaBlock(), t = e.isFinished()) : this.current.isIsoIec646() ? (e = this.parseIsoIec646Block(), t = e.isFinished()) : (e = this.parseNumericBlock(), t = e.isFinished());
        var i = n !== this.current.getPosition();
        if (!i && !t)
          break;
      } while (!t);
      return e.getDecodedInformation();
    }, r.prototype.parseNumericBlock = function() {
      for (; this.isStillNumeric(this.current.getPosition()); ) {
        var t = this.decodeNumeric(this.current.getPosition());
        if (this.current.setPosition(t.getNewPosition()), t.isFirstDigitFNC1()) {
          var e = void 0;
          return t.isSecondDigitFNC1() ? e = new Ut(this.current.getPosition(), this.buffer.toString()) : e = new Ut(this.current.getPosition(), this.buffer.toString(), t.getSecondDigit()), new kt(!0, e);
        }
        if (this.buffer.append(t.getFirstDigit()), t.isSecondDigitFNC1()) {
          var e = new Ut(this.current.getPosition(), this.buffer.toString());
          return new kt(!0, e);
        }
        this.buffer.append(t.getSecondDigit());
      }
      return this.isNumericToAlphaNumericLatch(this.current.getPosition()) && (this.current.setAlpha(), this.current.incrementPosition(4)), new kt(!1);
    }, r.prototype.parseIsoIec646Block = function() {
      for (; this.isStillIsoIec646(this.current.getPosition()); ) {
        var t = this.decodeIsoIec646(this.current.getPosition());
        if (this.current.setPosition(t.getNewPosition()), t.isFNC1()) {
          var e = new Ut(this.current.getPosition(), this.buffer.toString());
          return new kt(!0, e);
        }
        this.buffer.append(t.getValue());
      }
      return this.isAlphaOr646ToNumericLatch(this.current.getPosition()) ? (this.current.incrementPosition(3), this.current.setNumeric()) : this.isAlphaTo646ToAlphaLatch(this.current.getPosition()) && (this.current.getPosition() + 5 < this.information.getSize() ? this.current.incrementPosition(5) : this.current.setPosition(this.information.getSize()), this.current.setAlpha()), new kt(!1);
    }, r.prototype.parseAlphaBlock = function() {
      for (; this.isStillAlpha(this.current.getPosition()); ) {
        var t = this.decodeAlphanumeric(this.current.getPosition());
        if (this.current.setPosition(t.getNewPosition()), t.isFNC1()) {
          var e = new Ut(this.current.getPosition(), this.buffer.toString());
          return new kt(!0, e);
        }
        this.buffer.append(t.getValue());
      }
      return this.isAlphaOr646ToNumericLatch(this.current.getPosition()) ? (this.current.incrementPosition(3), this.current.setNumeric()) : this.isAlphaTo646ToAlphaLatch(this.current.getPosition()) && (this.current.getPosition() + 5 < this.information.getSize() ? this.current.incrementPosition(5) : this.current.setPosition(this.information.getSize()), this.current.setIsoIec646()), new kt(!1);
    }, r.prototype.isStillIsoIec646 = function(t) {
      if (t + 5 > this.information.getSize())
        return !1;
      var e = this.extractNumericValueFromBitArray(t, 5);
      if (e >= 5 && e < 16)
        return !0;
      if (t + 7 > this.information.getSize())
        return !1;
      var n = this.extractNumericValueFromBitArray(t, 7);
      if (n >= 64 && n < 116)
        return !0;
      if (t + 8 > this.information.getSize())
        return !1;
      var i = this.extractNumericValueFromBitArray(t, 8);
      return i >= 232 && i < 253;
    }, r.prototype.decodeIsoIec646 = function(t) {
      var e = this.extractNumericValueFromBitArray(t, 5);
      if (e === 15)
        return new St(t + 5, St.FNC1);
      if (e >= 5 && e < 15)
        return new St(t + 5, "0" + (e - 5));
      var n = this.extractNumericValueFromBitArray(t, 7);
      if (n >= 64 && n < 90)
        return new St(t + 7, "" + (n + 1));
      if (n >= 90 && n < 116)
        return new St(t + 7, "" + (n + 7));
      var i = this.extractNumericValueFromBitArray(t, 8), a;
      switch (i) {
        case 232:
          a = "!";
          break;
        case 233:
          a = '"';
          break;
        case 234:
          a = "%";
          break;
        case 235:
          a = "&";
          break;
        case 236:
          a = "'";
          break;
        case 237:
          a = "(";
          break;
        case 238:
          a = ")";
          break;
        case 239:
          a = "*";
          break;
        case 240:
          a = "+";
          break;
        case 241:
          a = ",";
          break;
        case 242:
          a = "-";
          break;
        case 243:
          a = ".";
          break;
        case 244:
          a = "/";
          break;
        case 245:
          a = ":";
          break;
        case 246:
          a = ";";
          break;
        case 247:
          a = "<";
          break;
        case 248:
          a = "=";
          break;
        case 249:
          a = ">";
          break;
        case 250:
          a = "?";
          break;
        case 251:
          a = "_";
          break;
        case 252:
          a = " ";
          break;
        default:
          throw new T();
      }
      return new St(t + 8, a);
    }, r.prototype.isStillAlpha = function(t) {
      if (t + 5 > this.information.getSize())
        return !1;
      var e = this.extractNumericValueFromBitArray(t, 5);
      if (e >= 5 && e < 16)
        return !0;
      if (t + 6 > this.information.getSize())
        return !1;
      var n = this.extractNumericValueFromBitArray(t, 6);
      return n >= 16 && n < 63;
    }, r.prototype.decodeAlphanumeric = function(t) {
      var e = this.extractNumericValueFromBitArray(t, 5);
      if (e === 15)
        return new St(t + 5, St.FNC1);
      if (e >= 5 && e < 15)
        return new St(t + 5, "0" + (e - 5));
      var n = this.extractNumericValueFromBitArray(t, 6);
      if (n >= 32 && n < 58)
        return new St(t + 6, "" + (n + 33));
      var i;
      switch (n) {
        case 58:
          i = "*";
          break;
        case 59:
          i = ",";
          break;
        case 60:
          i = "-";
          break;
        case 61:
          i = ".";
          break;
        case 62:
          i = "/";
          break;
        default:
          throw new Kt("Decoding invalid alphanumeric value: " + n);
      }
      return new St(t + 6, i);
    }, r.prototype.isAlphaTo646ToAlphaLatch = function(t) {
      if (t + 1 > this.information.getSize())
        return !1;
      for (var e = 0; e < 5 && e + t < this.information.getSize(); ++e)
        if (e === 2) {
          if (!this.information.get(t + 2))
            return !1;
        } else if (this.information.get(t + e))
          return !1;
      return !0;
    }, r.prototype.isAlphaOr646ToNumericLatch = function(t) {
      if (t + 3 > this.information.getSize())
        return !1;
      for (var e = t; e < t + 3; ++e)
        if (this.information.get(e))
          return !1;
      return !0;
    }, r.prototype.isNumericToAlphaNumericLatch = function(t) {
      if (t + 1 > this.information.getSize())
        return !1;
      for (var e = 0; e < 4 && e + t < this.information.getSize(); ++e)
        if (this.information.get(t + e))
          return !1;
      return !0;
    }, r;
  }()
), Vr = (
  /** @class */
  function() {
    function r(t) {
      this.information = t, this.generalDecoder = new ce(t);
    }
    return r.prototype.getInformation = function() {
      return this.information;
    }, r.prototype.getGeneralDecoder = function() {
      return this.generalDecoder;
    }, r;
  }()
), si = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), Tt = (
  /** @class */
  function(r) {
    si(t, r);
    function t(e) {
      return r.call(this, e) || this;
    }
    return t.prototype.encodeCompressedGtin = function(e, n) {
      e.append("(01)");
      var i = e.length();
      e.append("9"), this.encodeCompressedGtinWithoutAI(e, n, i);
    }, t.prototype.encodeCompressedGtinWithoutAI = function(e, n, i) {
      for (var a = 0; a < 4; ++a) {
        var o = this.getGeneralDecoder().extractNumericValueFromBitArray(n + 10 * a, 10);
        o / 100 === 0 && e.append("0"), o / 10 === 0 && e.append("0"), e.append(o);
      }
      t.appendCheckDigit(e, i);
    }, t.appendCheckDigit = function(e, n) {
      for (var i = 0, a = 0; a < 13; a++) {
        var o = e.charAt(a + n).charCodeAt(0) - "0".charCodeAt(0);
        i += a & 1 ? o : 3 * o;
      }
      i = 10 - i % 10, i === 10 && (i = 0), e.append(i);
    }, t.GTIN_SIZE = 40, t;
  }(Vr)
), ui = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), ci = (
  /** @class */
  function(r) {
    ui(t, r);
    function t(e) {
      return r.call(this, e) || this;
    }
    return t.prototype.parseInformation = function() {
      var e = new M();
      e.append("(01)");
      var n = e.length(), i = this.getGeneralDecoder().extractNumericValueFromBitArray(t.HEADER_SIZE, 4);
      return e.append(i), this.encodeCompressedGtinWithoutAI(e, t.HEADER_SIZE + 4, n), this.getGeneralDecoder().decodeAllCodes(e, t.HEADER_SIZE + 44);
    }, t.HEADER_SIZE = 1 + 1 + 2, t;
  }(Tt)
), li = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), hi = (
  /** @class */
  function(r) {
    li(t, r);
    function t(e) {
      return r.call(this, e) || this;
    }
    return t.prototype.parseInformation = function() {
      var e = new M();
      return this.getGeneralDecoder().decodeAllCodes(e, t.HEADER_SIZE);
    }, t.HEADER_SIZE = 2 + 1 + 2, t;
  }(Vr)
), di = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), le = (
  /** @class */
  function(r) {
    di(t, r);
    function t(e) {
      return r.call(this, e) || this;
    }
    return t.prototype.encodeCompressedWeight = function(e, n, i) {
      var a = this.getGeneralDecoder().extractNumericValueFromBitArray(n, i);
      this.addWeightCode(e, a);
      for (var o = this.checkWeight(a), f = 1e5, s = 0; s < 5; ++s)
        o / f === 0 && e.append("0"), f /= 10;
      e.append(o);
    }, t;
  }(Tt)
), vi = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), Hr = (
  /** @class */
  function(r) {
    vi(t, r);
    function t(e) {
      return r.call(this, e) || this;
    }
    return t.prototype.parseInformation = function() {
      if (this.getInformation().getSize() !== t.HEADER_SIZE + le.GTIN_SIZE + t.WEIGHT_SIZE)
        throw new C();
      var e = new M();
      return this.encodeCompressedGtin(e, t.HEADER_SIZE), this.encodeCompressedWeight(e, t.HEADER_SIZE + le.GTIN_SIZE, t.WEIGHT_SIZE), e.toString();
    }, t.HEADER_SIZE = 4 + 1, t.WEIGHT_SIZE = 15, t;
  }(le)
), pi = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), gi = (
  /** @class */
  function(r) {
    pi(t, r);
    function t(e) {
      return r.call(this, e) || this;
    }
    return t.prototype.addWeightCode = function(e, n) {
      e.append("(3103)");
    }, t.prototype.checkWeight = function(e) {
      return e;
    }, t;
  }(Hr)
), xi = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), yi = (
  /** @class */
  function(r) {
    xi(t, r);
    function t(e) {
      return r.call(this, e) || this;
    }
    return t.prototype.addWeightCode = function(e, n) {
      n < 1e4 ? e.append("(3202)") : e.append("(3203)");
    }, t.prototype.checkWeight = function(e) {
      return e < 1e4 ? e : e - 1e4;
    }, t;
  }(Hr)
), wi = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), _i = (
  /** @class */
  function(r) {
    wi(t, r);
    function t(e) {
      return r.call(this, e) || this;
    }
    return t.prototype.parseInformation = function() {
      if (this.getInformation().getSize() < t.HEADER_SIZE + Tt.GTIN_SIZE)
        throw new C();
      var e = new M();
      this.encodeCompressedGtin(e, t.HEADER_SIZE);
      var n = this.getGeneralDecoder().extractNumericValueFromBitArray(t.HEADER_SIZE + Tt.GTIN_SIZE, t.LAST_DIGIT_SIZE);
      e.append("(392"), e.append(n), e.append(")");
      var i = this.getGeneralDecoder().decodeGeneralPurposeField(t.HEADER_SIZE + Tt.GTIN_SIZE + t.LAST_DIGIT_SIZE, null);
      return e.append(i.getNewString()), e.toString();
    }, t.HEADER_SIZE = 5 + 1 + 2, t.LAST_DIGIT_SIZE = 2, t;
  }(Tt)
), Ai = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), Ei = (
  /** @class */
  function(r) {
    Ai(t, r);
    function t(e) {
      return r.call(this, e) || this;
    }
    return t.prototype.parseInformation = function() {
      if (this.getInformation().getSize() < t.HEADER_SIZE + Tt.GTIN_SIZE)
        throw new C();
      var e = new M();
      this.encodeCompressedGtin(e, t.HEADER_SIZE);
      var n = this.getGeneralDecoder().extractNumericValueFromBitArray(t.HEADER_SIZE + Tt.GTIN_SIZE, t.LAST_DIGIT_SIZE);
      e.append("(393"), e.append(n), e.append(")");
      var i = this.getGeneralDecoder().extractNumericValueFromBitArray(t.HEADER_SIZE + Tt.GTIN_SIZE + t.LAST_DIGIT_SIZE, t.FIRST_THREE_DIGITS_SIZE);
      i / 100 === 0 && e.append("0"), i / 10 === 0 && e.append("0"), e.append(i);
      var a = this.getGeneralDecoder().decodeGeneralPurposeField(t.HEADER_SIZE + Tt.GTIN_SIZE + t.LAST_DIGIT_SIZE + t.FIRST_THREE_DIGITS_SIZE, null);
      return e.append(a.getNewString()), e.toString();
    }, t.HEADER_SIZE = 5 + 1 + 2, t.LAST_DIGIT_SIZE = 2, t.FIRST_THREE_DIGITS_SIZE = 10, t;
  }(Tt)
), Ci = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), Pt = (
  /** @class */
  function(r) {
    Ci(t, r);
    function t(e, n, i) {
      var a = r.call(this, e) || this;
      return a.dateCode = i, a.firstAIdigits = n, a;
    }
    return t.prototype.parseInformation = function() {
      if (this.getInformation().getSize() !== t.HEADER_SIZE + t.GTIN_SIZE + t.WEIGHT_SIZE + t.DATE_SIZE)
        throw new C();
      var e = new M();
      return this.encodeCompressedGtin(e, t.HEADER_SIZE), this.encodeCompressedWeight(e, t.HEADER_SIZE + t.GTIN_SIZE, t.WEIGHT_SIZE), this.encodeCompressedDate(e, t.HEADER_SIZE + t.GTIN_SIZE + t.WEIGHT_SIZE), e.toString();
    }, t.prototype.encodeCompressedDate = function(e, n) {
      var i = this.getGeneralDecoder().extractNumericValueFromBitArray(n, t.DATE_SIZE);
      if (i !== 38400) {
        e.append("("), e.append(this.dateCode), e.append(")");
        var a = i % 32;
        i /= 32;
        var o = i % 12 + 1;
        i /= 12;
        var f = i;
        f / 10 === 0 && e.append("0"), e.append(f), o / 10 === 0 && e.append("0"), e.append(o), a / 10 === 0 && e.append("0"), e.append(a);
      }
    }, t.prototype.addWeightCode = function(e, n) {
      e.append("("), e.append(this.firstAIdigits), e.append(n / 1e5), e.append(")");
    }, t.prototype.checkWeight = function(e) {
      return e % 1e5;
    }, t.HEADER_SIZE = 7 + 1, t.WEIGHT_SIZE = 20, t.DATE_SIZE = 16, t;
  }(le)
);
function mi(r) {
  try {
    if (r.get(1))
      return new ci(r);
    if (!r.get(2))
      return new hi(r);
    var t = ce.extractNumericValueFromBitArray(r, 1, 4);
    switch (t) {
      case 4:
        return new gi(r);
      case 5:
        return new yi(r);
    }
    var e = ce.extractNumericValueFromBitArray(r, 1, 5);
    switch (e) {
      case 12:
        return new _i(r);
      case 13:
        return new Ei(r);
    }
    var n = ce.extractNumericValueFromBitArray(r, 1, 7);
    switch (n) {
      case 56:
        return new Pt(r, "310", "11");
      case 57:
        return new Pt(r, "320", "11");
      case 58:
        return new Pt(r, "310", "13");
      case 59:
        return new Pt(r, "320", "13");
      case 60:
        return new Pt(r, "310", "15");
      case 61:
        return new Pt(r, "320", "15");
      case 62:
        return new Pt(r, "310", "17");
      case 63:
        return new Pt(r, "320", "17");
    }
  } catch (i) {
    throw console.log(i), new Kt("unknown decoder: " + r);
  }
}
var hr = (
  /** @class */
  function() {
    function r(t, e, n, i) {
      this.leftchar = t, this.rightchar = e, this.finderpattern = n, this.maybeLast = i;
    }
    return r.prototype.mayBeLast = function() {
      return this.maybeLast;
    }, r.prototype.getLeftChar = function() {
      return this.leftchar;
    }, r.prototype.getRightChar = function() {
      return this.rightchar;
    }, r.prototype.getFinderPattern = function() {
      return this.finderpattern;
    }, r.prototype.mustBeLast = function() {
      return this.rightchar == null;
    }, r.prototype.toString = function() {
      return "[ " + this.leftchar + ", " + this.rightchar + " : " + (this.finderpattern == null ? "null" : this.finderpattern.getValue()) + " ]";
    }, r.equals = function(t, e) {
      return t instanceof r ? r.equalsOrNull(t.leftchar, e.leftchar) && r.equalsOrNull(t.rightchar, e.rightchar) && r.equalsOrNull(t.finderpattern, e.finderpattern) : !1;
    }, r.equalsOrNull = function(t, e) {
      return t === null ? e === null : r.equals(t, e);
    }, r.prototype.hashCode = function() {
      var t = this.leftchar.getValue() ^ this.rightchar.getValue() ^ this.finderpattern.getValue();
      return t;
    }, r;
  }()
), Ii = (
  /** @class */
  function() {
    function r(t, e, n) {
      this.pairs = t, this.rowNumber = e, this.wasReversed = n;
    }
    return r.prototype.getPairs = function() {
      return this.pairs;
    }, r.prototype.getRowNumber = function() {
      return this.rowNumber;
    }, r.prototype.isReversed = function() {
      return this.wasReversed;
    }, r.prototype.isEquivalent = function(t) {
      return this.checkEqualitity(this, t);
    }, r.prototype.toString = function() {
      return "{ " + this.pairs + " }";
    }, r.prototype.equals = function(t, e) {
      return t instanceof r ? this.checkEqualitity(t, e) && t.wasReversed === e.wasReversed : !1;
    }, r.prototype.checkEqualitity = function(t, e) {
      if (!(!t || !e)) {
        var n;
        return t.forEach(function(i, a) {
          e.forEach(function(o) {
            i.getLeftChar().getValue() === o.getLeftChar().getValue() && i.getRightChar().getValue() === o.getRightChar().getValue() && i.getFinderPatter().getValue() === o.getFinderPatter().getValue() && (n = !0);
          });
        }), n;
      }
    }, r;
  }()
), Si = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), Mt = globalThis && globalThis.__values || function(r) {
  var t = typeof Symbol == "function" && Symbol.iterator, e = t && r[t], n = 0;
  if (e)
    return e.call(r);
  if (r && typeof r.length == "number")
    return {
      next: function() {
        return r && n >= r.length && (r = void 0), { value: r && r[n++], done: !r };
      }
    };
  throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, Ti = (
  /** @class */
  function(r) {
    Si(t, r);
    function t() {
      var e = r !== null && r.apply(this, arguments) || this;
      return e.pairs = new Array(t.MAX_PAIRS), e.rows = new Array(), e.startEnd = [2], e;
    }
    return t.prototype.decodeRow = function(e, n, i) {
      this.pairs.length = 0, this.startFromEven = !1;
      try {
        return t.constructResult(this.decodeRow2pairs(e, n));
      } catch {
      }
      return this.pairs.length = 0, this.startFromEven = !0, t.constructResult(this.decodeRow2pairs(e, n));
    }, t.prototype.reset = function() {
      this.pairs.length = 0, this.rows.length = 0;
    }, t.prototype.decodeRow2pairs = function(e, n) {
      for (var i = !1; !i; )
        try {
          this.pairs.push(this.retrieveNextPair(n, this.pairs, e));
        } catch (f) {
          if (f instanceof C) {
            if (!this.pairs.length)
              throw new C();
            i = !0;
          }
        }
      if (this.checkChecksum())
        return this.pairs;
      var a;
      if (this.rows.length ? a = !0 : a = !1, this.storeRow(e, !1), a) {
        var o = this.checkRowsBoolean(!1);
        if (o != null || (o = this.checkRowsBoolean(!0), o != null))
          return o;
      }
      throw new C();
    }, t.prototype.checkRowsBoolean = function(e) {
      if (this.rows.length > 25)
        return this.rows.length = 0, null;
      this.pairs.length = 0, e && (this.rows = this.rows.reverse());
      var n = null;
      try {
        n = this.checkRows(new Array(), 0);
      } catch (i) {
        console.log(i);
      }
      return e && (this.rows = this.rows.reverse()), n;
    }, t.prototype.checkRows = function(e, n) {
      for (var i, a, o = n; o < this.rows.length; o++) {
        var f = this.rows[o];
        this.pairs.length = 0;
        try {
          for (var s = (i = void 0, Mt(e)), u = s.next(); !u.done; u = s.next()) {
            var c = u.value;
            this.pairs.push(c.getPairs());
          }
        } catch (h) {
          i = { error: h };
        } finally {
          try {
            u && !u.done && (a = s.return) && a.call(s);
          } finally {
            if (i)
              throw i.error;
          }
        }
        if (this.pairs.push(f.getPairs()), !!t.isValidSequence(this.pairs)) {
          if (this.checkChecksum())
            return this.pairs;
          var l = new Array(e);
          l.push(f);
          try {
            return this.checkRows(l, o + 1);
          } catch (h) {
            console.log(h);
          }
        }
      }
      throw new C();
    }, t.isValidSequence = function(e) {
      var n, i;
      try {
        for (var a = Mt(t.FINDER_PATTERN_SEQUENCES), o = a.next(); !o.done; o = a.next()) {
          var f = o.value;
          if (!(e.length > f.length)) {
            for (var s = !0, u = 0; u < e.length; u++)
              if (e[u].getFinderPattern().getValue() !== f[u]) {
                s = !1;
                break;
              }
            if (s)
              return !0;
          }
        }
      } catch (c) {
        n = { error: c };
      } finally {
        try {
          o && !o.done && (i = a.return) && i.call(a);
        } finally {
          if (n)
            throw n.error;
        }
      }
      return !1;
    }, t.prototype.storeRow = function(e, n) {
      for (var i = 0, a = !1, o = !1; i < this.rows.length; ) {
        var f = this.rows[i];
        if (f.getRowNumber() > e) {
          o = f.isEquivalent(this.pairs);
          break;
        }
        a = f.isEquivalent(this.pairs), i++;
      }
      o || a || t.isPartialRow(this.pairs, this.rows) || (this.rows.push(i, new Ii(this.pairs, e, n)), this.removePartialRows(this.pairs, this.rows));
    }, t.prototype.removePartialRows = function(e, n) {
      var i, a, o, f, s, u;
      try {
        for (var c = Mt(n), l = c.next(); !l.done; l = c.next()) {
          var h = l.value;
          if (h.getPairs().length !== e.length) {
            var d = !0;
            try {
              for (var v = (o = void 0, Mt(h.getPairs())), g = v.next(); !g.done; g = v.next()) {
                var x = g.value, w = !1;
                try {
                  for (var y = (s = void 0, Mt(e)), _ = y.next(); !_.done; _ = y.next()) {
                    var E = _.value;
                    if (hr.equals(x, E)) {
                      w = !0;
                      break;
                    }
                  }
                } catch (m) {
                  s = { error: m };
                } finally {
                  try {
                    _ && !_.done && (u = y.return) && u.call(y);
                  } finally {
                    if (s)
                      throw s.error;
                  }
                }
                w || (d = !1);
              }
            } catch (m) {
              o = { error: m };
            } finally {
              try {
                g && !g.done && (f = v.return) && f.call(v);
              } finally {
                if (o)
                  throw o.error;
              }
            }
          }
        }
      } catch (m) {
        i = { error: m };
      } finally {
        try {
          l && !l.done && (a = c.return) && a.call(c);
        } finally {
          if (i)
            throw i.error;
        }
      }
    }, t.isPartialRow = function(e, n) {
      var i, a, o, f, s, u;
      try {
        for (var c = Mt(n), l = c.next(); !l.done; l = c.next()) {
          var h = l.value, d = !0;
          try {
            for (var v = (o = void 0, Mt(e)), g = v.next(); !g.done; g = v.next()) {
              var x = g.value, w = !1;
              try {
                for (var y = (s = void 0, Mt(h.getPairs())), _ = y.next(); !_.done; _ = y.next()) {
                  var E = _.value;
                  if (x.equals(E)) {
                    w = !0;
                    break;
                  }
                }
              } catch (m) {
                s = { error: m };
              } finally {
                try {
                  _ && !_.done && (u = y.return) && u.call(y);
                } finally {
                  if (s)
                    throw s.error;
                }
              }
              if (!w) {
                d = !1;
                break;
              }
            }
          } catch (m) {
            o = { error: m };
          } finally {
            try {
              g && !g.done && (f = v.return) && f.call(v);
            } finally {
              if (o)
                throw o.error;
            }
          }
          if (d)
            return !0;
        }
      } catch (m) {
        i = { error: m };
      } finally {
        try {
          l && !l.done && (a = c.return) && a.call(c);
        } finally {
          if (i)
            throw i.error;
        }
      }
      return !1;
    }, t.prototype.getRows = function() {
      return this.rows;
    }, t.constructResult = function(e) {
      var n = ni.buildBitArray(e), i = mi(n), a = i.parseInformation(), o = e[0].getFinderPattern().getResultPoints(), f = e[e.length - 1].getFinderPattern().getResultPoints(), s = [o[0], o[1], f[0], f[1]];
      return new pt(a, null, null, s, N.RSS_EXPANDED, null);
    }, t.prototype.checkChecksum = function() {
      var e = this.pairs.get(0), n = e.getLeftChar(), i = e.getRightChar();
      if (i === null)
        return !1;
      for (var a = i.getChecksumPortion(), o = 2, f = 1; f < this.pairs.size(); ++f) {
        var s = this.pairs.get(f);
        a += s.getLeftChar().getChecksumPortion(), o++;
        var u = s.getRightChar();
        u != null && (a += u.getChecksumPortion(), o++);
      }
      a %= 211;
      var c = 211 * (o - 4) + a;
      return c === n.getValue();
    }, t.getNextSecondBar = function(e, n) {
      var i;
      return e.get(n) ? (i = e.getNextUnset(n), i = e.getNextSet(i)) : (i = e.getNextSet(n), i = e.getNextUnset(i)), i;
    }, t.prototype.retrieveNextPair = function(e, n, i) {
      var a = n.length % 2 === 0;
      this.startFromEven && (a = !a);
      var o, f = !0, s = -1;
      do
        this.findNextPair(e, n, s), o = this.parseFoundFinderPattern(e, i, a), o === null ? s = t.getNextSecondBar(e, this.startEnd[0]) : f = !1;
      while (f);
      var u = this.decodeDataCharacter(e, o, a, !0);
      if (!this.isEmptyPair(n) && n[n.length - 1].mustBeLast())
        throw new C();
      var c;
      try {
        c = this.decodeDataCharacter(e, o, a, !1);
      } catch (l) {
        c = null, console.log(l);
      }
      return new hr(u, c, o, !0);
    }, t.prototype.isEmptyPair = function(e) {
      return e.length === 0;
    }, t.prototype.findNextPair = function(e, n, i) {
      var a = this.getDecodeFinderCounters();
      a[0] = 0, a[1] = 0, a[2] = 0, a[3] = 0;
      var o = e.getSize(), f;
      if (i >= 0)
        f = i;
      else if (this.isEmptyPair(n))
        f = 0;
      else {
        var s = n[n.length - 1];
        f = s.getFinderPattern().getStartEnd()[1];
      }
      var u = n.length % 2 !== 0;
      this.startFromEven && (u = !u);
      for (var c = !1; f < o && (c = !e.get(f), !!c); )
        f++;
      for (var l = 0, h = f, d = f; d < o; d++)
        if (e.get(d) !== c)
          a[l]++;
        else {
          if (l === 3) {
            if (u && t.reverseCounters(a), t.isFinderPattern(a)) {
              this.startEnd[0] = h, this.startEnd[1] = d;
              return;
            }
            u && t.reverseCounters(a), h += a[0] + a[1], a[0] = a[2], a[1] = a[3], a[2] = 0, a[3] = 0, l--;
          } else
            l++;
          a[l] = 1, c = !c;
        }
      throw new C();
    }, t.reverseCounters = function(e) {
      for (var n = e.length, i = 0; i < n / 2; ++i) {
        var a = e[i];
        e[i] = e[n - i - 1], e[n - i - 1] = a;
      }
    }, t.prototype.parseFoundFinderPattern = function(e, n, i) {
      var a, o, f;
      if (i) {
        for (var s = this.startEnd[0] - 1; s >= 0 && !e.get(s); )
          s--;
        s++, a = this.startEnd[0] - s, o = s, f = this.startEnd[1];
      } else
        o = this.startEnd[0], f = e.getNextUnset(this.startEnd[1] + 1), a = f - this.startEnd[1];
      var u = this.getDecodeFinderCounters();
      j.arraycopy(u, 0, u, 1, u.length - 1), u[0] = a;
      var c;
      try {
        c = this.parseFinderValue(u, t.FINDER_PATTERNS);
      } catch {
        return null;
      }
      return new Ur(c, [o, f], o, f, n);
    }, t.prototype.decodeDataCharacter = function(e, n, i, a) {
      for (var o = this.getDataCharacterCounters(), f = 0; f < o.length; f++)
        o[f] = 0;
      if (a)
        t.recordPatternInReverse(e, n.getStartEnd()[0], o);
      else {
        t.recordPattern(e, n.getStartEnd()[1], o);
        for (var s = 0, u = o.length - 1; s < u; s++, u--) {
          var c = o[s];
          o[s] = o[u], o[u] = c;
        }
      }
      var l = 17, h = U.sum(new Int32Array(o)) / l, d = (n.getStartEnd()[1] - n.getStartEnd()[0]) / 15;
      if (Math.abs(h - d) / d > 0.3)
        throw new C();
      for (var v = this.getOddCounts(), g = this.getEvenCounts(), x = this.getOddRoundingErrors(), w = this.getEvenRoundingErrors(), s = 0; s < o.length; s++) {
        var y = 1 * o[s] / h, _ = y + 0.5;
        if (_ < 1) {
          if (y < 0.3)
            throw new C();
          _ = 1;
        } else if (_ > 8) {
          if (y > 8.7)
            throw new C();
          _ = 8;
        }
        var E = s / 2;
        s & 1 ? (g[E] = _, w[E] = y - _) : (v[E] = _, x[E] = y - _);
      }
      this.adjustOddEvenCounts(l);
      for (var m = 4 * n.getValue() + (i ? 0 : 2) + (a ? 0 : 1) - 1, I = 0, S = 0, s = v.length - 1; s >= 0; s--) {
        if (t.isNotA1left(n, i, a)) {
          var b = t.WEIGHTS[m][2 * s];
          S += v[s] * b;
        }
        I += v[s];
      }
      for (var P = 0, s = g.length - 1; s >= 0; s--)
        if (t.isNotA1left(n, i, a)) {
          var b = t.WEIGHTS[m][2 * s + 1];
          P += g[s] * b;
        }
      var R = S + P;
      if (I & 1 || I > 13 || I < 4)
        throw new C();
      var J = (13 - I) / 2, L = t.SYMBOL_WIDEST[J], K = 9 - L, Et = Wt.getRSSvalue(v, L, !0), Rt = Wt.getRSSvalue(g, K, !1), Ae = t.EVEN_TOTAL_SUBSET[J], Ee = t.GSUM[J], Ce = Et * Ae + Rt + Ee;
      return new de(Ce, R);
    }, t.isNotA1left = function(e, n, i) {
      return !(e.getValue() === 0 && n && i);
    }, t.prototype.adjustOddEvenCounts = function(e) {
      var n = U.sum(new Int32Array(this.getOddCounts())), i = U.sum(new Int32Array(this.getEvenCounts())), a = !1, o = !1;
      n > 13 ? o = !0 : n < 4 && (a = !0);
      var f = !1, s = !1;
      i > 13 ? s = !0 : i < 4 && (f = !0);
      var u = n + i - e, c = (n & 1) === 1, l = (i & 1) === 0;
      if (u === 1)
        if (c) {
          if (l)
            throw new C();
          o = !0;
        } else {
          if (!l)
            throw new C();
          s = !0;
        }
      else if (u === -1)
        if (c) {
          if (l)
            throw new C();
          a = !0;
        } else {
          if (!l)
            throw new C();
          f = !0;
        }
      else if (u === 0) {
        if (c) {
          if (!l)
            throw new C();
          n < i ? (a = !0, s = !0) : (o = !0, f = !0);
        } else if (l)
          throw new C();
      } else
        throw new C();
      if (a) {
        if (o)
          throw new C();
        t.increment(this.getOddCounts(), this.getOddRoundingErrors());
      }
      if (o && t.decrement(this.getOddCounts(), this.getOddRoundingErrors()), f) {
        if (s)
          throw new C();
        t.increment(this.getEvenCounts(), this.getOddRoundingErrors());
      }
      s && t.decrement(this.getEvenCounts(), this.getEvenRoundingErrors());
    }, t.SYMBOL_WIDEST = [7, 5, 4, 3, 1], t.EVEN_TOTAL_SUBSET = [4, 20, 52, 104, 204], t.GSUM = [0, 348, 1388, 2948, 3988], t.FINDER_PATTERNS = [
      Int32Array.from([1, 8, 4, 1]),
      Int32Array.from([3, 6, 4, 1]),
      Int32Array.from([3, 4, 6, 1]),
      Int32Array.from([3, 2, 8, 1]),
      Int32Array.from([2, 6, 5, 1]),
      Int32Array.from([2, 2, 9, 1])
    ], t.WEIGHTS = [
      [1, 3, 9, 27, 81, 32, 96, 77],
      [20, 60, 180, 118, 143, 7, 21, 63],
      [189, 145, 13, 39, 117, 140, 209, 205],
      [193, 157, 49, 147, 19, 57, 171, 91],
      [62, 186, 136, 197, 169, 85, 44, 132],
      [185, 133, 188, 142, 4, 12, 36, 108],
      [113, 128, 173, 97, 80, 29, 87, 50],
      [150, 28, 84, 41, 123, 158, 52, 156],
      [46, 138, 203, 187, 139, 206, 196, 166],
      [76, 17, 51, 153, 37, 111, 122, 155],
      [43, 129, 176, 106, 107, 110, 119, 146],
      [16, 48, 144, 10, 30, 90, 59, 177],
      [109, 116, 137, 200, 178, 112, 125, 164],
      [70, 210, 208, 202, 184, 130, 179, 115],
      [134, 191, 151, 31, 93, 68, 204, 190],
      [148, 22, 66, 198, 172, 94, 71, 2],
      [6, 18, 54, 162, 64, 192, 154, 40],
      [120, 149, 25, 75, 14, 42, 126, 167],
      [79, 26, 78, 23, 69, 207, 199, 175],
      [103, 98, 83, 38, 114, 131, 182, 124],
      [161, 61, 183, 127, 170, 88, 53, 159],
      [55, 165, 73, 8, 24, 72, 5, 15],
      [45, 135, 194, 160, 58, 174, 100, 89]
    ], t.FINDER_PAT_A = 0, t.FINDER_PAT_B = 1, t.FINDER_PAT_C = 2, t.FINDER_PAT_D = 3, t.FINDER_PAT_E = 4, t.FINDER_PAT_F = 5, t.FINDER_PATTERN_SEQUENCES = [
      [t.FINDER_PAT_A, t.FINDER_PAT_A],
      [
        t.FINDER_PAT_A,
        t.FINDER_PAT_B,
        t.FINDER_PAT_B
      ],
      [
        t.FINDER_PAT_A,
        t.FINDER_PAT_C,
        t.FINDER_PAT_B,
        t.FINDER_PAT_D
      ],
      [
        t.FINDER_PAT_A,
        t.FINDER_PAT_E,
        t.FINDER_PAT_B,
        t.FINDER_PAT_D,
        t.FINDER_PAT_C
      ],
      [
        t.FINDER_PAT_A,
        t.FINDER_PAT_E,
        t.FINDER_PAT_B,
        t.FINDER_PAT_D,
        t.FINDER_PAT_D,
        t.FINDER_PAT_F
      ],
      [
        t.FINDER_PAT_A,
        t.FINDER_PAT_E,
        t.FINDER_PAT_B,
        t.FINDER_PAT_D,
        t.FINDER_PAT_E,
        t.FINDER_PAT_F,
        t.FINDER_PAT_F
      ],
      [
        t.FINDER_PAT_A,
        t.FINDER_PAT_A,
        t.FINDER_PAT_B,
        t.FINDER_PAT_B,
        t.FINDER_PAT_C,
        t.FINDER_PAT_C,
        t.FINDER_PAT_D,
        t.FINDER_PAT_D
      ],
      [
        t.FINDER_PAT_A,
        t.FINDER_PAT_A,
        t.FINDER_PAT_B,
        t.FINDER_PAT_B,
        t.FINDER_PAT_C,
        t.FINDER_PAT_C,
        t.FINDER_PAT_D,
        t.FINDER_PAT_E,
        t.FINDER_PAT_E
      ],
      [
        t.FINDER_PAT_A,
        t.FINDER_PAT_A,
        t.FINDER_PAT_B,
        t.FINDER_PAT_B,
        t.FINDER_PAT_C,
        t.FINDER_PAT_C,
        t.FINDER_PAT_D,
        t.FINDER_PAT_E,
        t.FINDER_PAT_F,
        t.FINDER_PAT_F
      ],
      [
        t.FINDER_PAT_A,
        t.FINDER_PAT_A,
        t.FINDER_PAT_B,
        t.FINDER_PAT_B,
        t.FINDER_PAT_C,
        t.FINDER_PAT_D,
        t.FINDER_PAT_D,
        t.FINDER_PAT_E,
        t.FINDER_PAT_E,
        t.FINDER_PAT_F,
        t.FINDER_PAT_F
      ]
    ], t.MAX_PAIRS = 11, t;
  }(Vt)
), bi = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), Oi = (
  /** @class */
  function(r) {
    bi(t, r);
    function t(e, n, i) {
      var a = r.call(this, e, n) || this;
      return a.count = 0, a.finderPattern = i, a;
    }
    return t.prototype.getFinderPattern = function() {
      return this.finderPattern;
    }, t.prototype.getCount = function() {
      return this.count;
    }, t.prototype.incrementCount = function() {
      this.count++;
    }, t;
  }(de)
), Di = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), Te = globalThis && globalThis.__values || function(r) {
  var t = typeof Symbol == "function" && Symbol.iterator, e = t && r[t], n = 0;
  if (e)
    return e.call(r);
  if (r && typeof r.length == "number")
    return {
      next: function() {
        return r && n >= r.length && (r = void 0), { value: r && r[n++], done: !r };
      }
    };
  throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, dr = (
  /** @class */
  function(r) {
    Di(t, r);
    function t() {
      var e = r !== null && r.apply(this, arguments) || this;
      return e.possibleLeftPairs = [], e.possibleRightPairs = [], e;
    }
    return t.prototype.decodeRow = function(e, n, i) {
      var a, o, f, s, u = this.decodePair(n, !1, e, i);
      t.addOrTally(this.possibleLeftPairs, u), n.reverse();
      var c = this.decodePair(n, !0, e, i);
      t.addOrTally(this.possibleRightPairs, c), n.reverse();
      try {
        for (var l = Te(this.possibleLeftPairs), h = l.next(); !h.done; h = l.next()) {
          var d = h.value;
          if (d.getCount() > 1)
            try {
              for (var v = (f = void 0, Te(this.possibleRightPairs)), g = v.next(); !g.done; g = v.next()) {
                var x = g.value;
                if (x.getCount() > 1 && t.checkChecksum(d, x))
                  return t.constructResult(d, x);
              }
            } catch (w) {
              f = { error: w };
            } finally {
              try {
                g && !g.done && (s = v.return) && s.call(v);
              } finally {
                if (f)
                  throw f.error;
              }
            }
        }
      } catch (w) {
        a = { error: w };
      } finally {
        try {
          h && !h.done && (o = l.return) && o.call(l);
        } finally {
          if (a)
            throw a.error;
        }
      }
      throw new C();
    }, t.addOrTally = function(e, n) {
      var i, a;
      if (n != null) {
        var o = !1;
        try {
          for (var f = Te(e), s = f.next(); !s.done; s = f.next()) {
            var u = s.value;
            if (u.getValue() === n.getValue()) {
              u.incrementCount(), o = !0;
              break;
            }
          }
        } catch (c) {
          i = { error: c };
        } finally {
          try {
            s && !s.done && (a = f.return) && a.call(f);
          } finally {
            if (i)
              throw i.error;
          }
        }
        o || e.push(n);
      }
    }, t.prototype.reset = function() {
      this.possibleLeftPairs.length = 0, this.possibleRightPairs.length = 0;
    }, t.constructResult = function(e, n) {
      for (var i = 4537077 * e.getValue() + n.getValue(), a = new String(i).toString(), o = new M(), f = 13 - a.length; f > 0; f--)
        o.append("0");
      o.append(a);
      for (var s = 0, f = 0; f < 13; f++) {
        var u = o.charAt(f).charCodeAt(0) - "0".charCodeAt(0);
        s += f & 1 ? u : 3 * u;
      }
      s = 10 - s % 10, s === 10 && (s = 0), o.append(s.toString());
      var c = e.getFinderPattern().getResultPoints(), l = n.getFinderPattern().getResultPoints();
      return new pt(o.toString(), null, 0, [c[0], c[1], l[0], l[1]], N.RSS_14, (/* @__PURE__ */ new Date()).getTime());
    }, t.checkChecksum = function(e, n) {
      var i = (e.getChecksumPortion() + 16 * n.getChecksumPortion()) % 79, a = 9 * e.getFinderPattern().getValue() + n.getFinderPattern().getValue();
      return a > 72 && a--, a > 8 && a--, i === a;
    }, t.prototype.decodePair = function(e, n, i, a) {
      try {
        var o = this.findFinderPattern(e, n), f = this.parseFoundFinderPattern(e, i, n, o), s = a == null ? null : a.get($.NEED_RESULT_POINT_CALLBACK);
        if (s != null) {
          var u = (o[0] + o[1]) / 2;
          n && (u = e.getSize() - 1 - u), s.foundPossibleResultPoint(new O(u, i));
        }
        var c = this.decodeDataCharacter(e, f, !0), l = this.decodeDataCharacter(e, f, !1);
        return new Oi(1597 * c.getValue() + l.getValue(), c.getChecksumPortion() + 4 * l.getChecksumPortion(), f);
      } catch {
        return null;
      }
    }, t.prototype.decodeDataCharacter = function(e, n, i) {
      for (var a = this.getDataCharacterCounters(), o = 0; o < a.length; o++)
        a[o] = 0;
      if (i)
        ft.recordPatternInReverse(e, n.getStartEnd()[0], a);
      else {
        ft.recordPattern(e, n.getStartEnd()[1] + 1, a);
        for (var f = 0, s = a.length - 1; f < s; f++, s--) {
          var u = a[f];
          a[f] = a[s], a[s] = u;
        }
      }
      for (var c = i ? 16 : 15, l = U.sum(new Int32Array(a)) / c, h = this.getOddCounts(), d = this.getEvenCounts(), v = this.getOddRoundingErrors(), g = this.getEvenRoundingErrors(), f = 0; f < a.length; f++) {
        var x = a[f] / l, w = Math.floor(x + 0.5);
        w < 1 ? w = 1 : w > 8 && (w = 8);
        var y = Math.floor(f / 2);
        f & 1 ? (d[y] = w, g[y] = x - w) : (h[y] = w, v[y] = x - w);
      }
      this.adjustOddEvenCounts(i, c);
      for (var _ = 0, E = 0, f = h.length - 1; f >= 0; f--)
        E *= 9, E += h[f], _ += h[f];
      for (var m = 0, I = 0, f = d.length - 1; f >= 0; f--)
        m *= 9, m += d[f], I += d[f];
      var S = E + 3 * m;
      if (i) {
        if (_ & 1 || _ > 12 || _ < 4)
          throw new C();
        var b = (12 - _) / 2, P = t.OUTSIDE_ODD_WIDEST[b], R = 9 - P, J = Wt.getRSSvalue(h, P, !1), L = Wt.getRSSvalue(d, R, !0), K = t.OUTSIDE_EVEN_TOTAL_SUBSET[b], Et = t.OUTSIDE_GSUM[b];
        return new de(J * K + L + Et, S);
      } else {
        if (I & 1 || I > 10 || I < 4)
          throw new C();
        var b = (10 - I) / 2, P = t.INSIDE_ODD_WIDEST[b], R = 9 - P, J = Wt.getRSSvalue(h, P, !0), L = Wt.getRSSvalue(d, R, !1), Rt = t.INSIDE_ODD_TOTAL_SUBSET[b], Et = t.INSIDE_GSUM[b];
        return new de(L * Rt + J + Et, S);
      }
    }, t.prototype.findFinderPattern = function(e, n) {
      var i = this.getDecodeFinderCounters();
      i[0] = 0, i[1] = 0, i[2] = 0, i[3] = 0;
      for (var a = e.getSize(), o = !1, f = 0; f < a && (o = !e.get(f), n !== o); )
        f++;
      for (var s = 0, u = f, c = f; c < a; c++)
        if (e.get(c) !== o)
          i[s]++;
        else {
          if (s === 3) {
            if (Vt.isFinderPattern(i))
              return [u, c];
            u += i[0] + i[1], i[0] = i[2], i[1] = i[3], i[2] = 0, i[3] = 0, s--;
          } else
            s++;
          i[s] = 1, o = !o;
        }
      throw new C();
    }, t.prototype.parseFoundFinderPattern = function(e, n, i, a) {
      for (var o = e.get(a[0]), f = a[0] - 1; f >= 0 && o !== e.get(f); )
        f--;
      f++;
      var s = a[0] - f, u = this.getDecodeFinderCounters(), c = new Int32Array(u.length);
      j.arraycopy(u, 0, c, 1, u.length - 1), c[0] = s;
      var l = this.parseFinderValue(c, t.FINDER_PATTERNS), h = f, d = a[1];
      return i && (h = e.getSize() - 1 - h, d = e.getSize() - 1 - d), new Ur(l, [f, a[1]], h, d, n);
    }, t.prototype.adjustOddEvenCounts = function(e, n) {
      var i = U.sum(new Int32Array(this.getOddCounts())), a = U.sum(new Int32Array(this.getEvenCounts())), o = !1, f = !1, s = !1, u = !1;
      e ? (i > 12 ? f = !0 : i < 4 && (o = !0), a > 12 ? u = !0 : a < 4 && (s = !0)) : (i > 11 ? f = !0 : i < 5 && (o = !0), a > 10 ? u = !0 : a < 4 && (s = !0));
      var c = i + a - n, l = (i & 1) === (e ? 1 : 0), h = (a & 1) === 1;
      if (c === 1)
        if (l) {
          if (h)
            throw new C();
          f = !0;
        } else {
          if (!h)
            throw new C();
          u = !0;
        }
      else if (c === -1)
        if (l) {
          if (h)
            throw new C();
          o = !0;
        } else {
          if (!h)
            throw new C();
          s = !0;
        }
      else if (c === 0) {
        if (l) {
          if (!h)
            throw new C();
          i < a ? (o = !0, u = !0) : (f = !0, s = !0);
        } else if (h)
          throw new C();
      } else
        throw new C();
      if (o) {
        if (f)
          throw new C();
        Vt.increment(this.getOddCounts(), this.getOddRoundingErrors());
      }
      if (f && Vt.decrement(this.getOddCounts(), this.getOddRoundingErrors()), s) {
        if (u)
          throw new C();
        Vt.increment(this.getEvenCounts(), this.getOddRoundingErrors());
      }
      u && Vt.decrement(this.getEvenCounts(), this.getEvenRoundingErrors());
    }, t.OUTSIDE_EVEN_TOTAL_SUBSET = [1, 10, 34, 70, 126], t.INSIDE_ODD_TOTAL_SUBSET = [4, 20, 48, 81], t.OUTSIDE_GSUM = [0, 161, 961, 2015, 2715], t.INSIDE_GSUM = [0, 336, 1036, 1516], t.OUTSIDE_ODD_WIDEST = [8, 6, 4, 3, 1], t.INSIDE_ODD_WIDEST = [2, 4, 6, 8], t.FINDER_PATTERNS = [
      Int32Array.from([3, 8, 2, 1]),
      Int32Array.from([3, 5, 5, 1]),
      Int32Array.from([3, 3, 7, 1]),
      Int32Array.from([3, 1, 9, 1]),
      Int32Array.from([2, 7, 4, 1]),
      Int32Array.from([2, 5, 6, 1]),
      Int32Array.from([2, 3, 8, 1]),
      Int32Array.from([1, 5, 7, 1]),
      Int32Array.from([1, 3, 9, 1])
    ], t;
  }(Vt)
), Ni = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), zt = (
  /** @class */
  function(r) {
    Ni(t, r);
    function t(e) {
      var n = r.call(this) || this;
      n.readers = [];
      var i = e ? e.get($.POSSIBLE_FORMATS) : null, a = e && e.get($.ASSUME_CODE_39_CHECK_DIGIT) !== void 0;
      return i && ((i.includes(N.EAN_13) || i.includes(N.UPC_A) || i.includes(N.EAN_8) || i.includes(N.UPC_E)) && n.readers.push(new Se(e)), i.includes(N.CODE_39) && n.readers.push(new nr(a)), i.includes(N.CODE_93) && n.readers.push(new ir()), i.includes(N.CODE_128) && n.readers.push(new rr()), i.includes(N.ITF) && n.readers.push(new ar()), i.includes(N.CODABAR) && n.readers.push(new Jn()), i.includes(N.RSS_14) && n.readers.push(new dr()), i.includes(N.RSS_EXPANDED) && (console.warn("RSS Expanded reader IS NOT ready for production yet! use at your own risk."), n.readers.push(new Ti()))), n.readers.length === 0 && (n.readers.push(new Se(e)), n.readers.push(new nr()), n.readers.push(new ir()), n.readers.push(new Se(e)), n.readers.push(new rr()), n.readers.push(new ar()), n.readers.push(new dr())), n;
    }
    return t.prototype.decodeRow = function(e, n, i) {
      for (var a = 0; a < this.readers.length; a++)
        try {
          return this.readers[a].decodeRow(e, n, i);
        } catch {
        }
      throw new C();
    }, t.prototype.reset = function() {
      this.readers.forEach(function(e) {
        return e.reset();
      });
    }, t;
  }(ft)
), Ri = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}();
(function(r) {
  Ri(t, r);
  function t(e, n) {
    return e === void 0 && (e = 500), r.call(this, new zt(n), e, n) || this;
  }
  return t;
})($t);
var vr = globalThis && globalThis.__values || function(r) {
  var t = typeof Symbol == "function" && Symbol.iterator, e = t && r[t], n = 0;
  if (e)
    return e.call(r);
  if (r && typeof r.length == "number")
    return {
      next: function() {
        return r && n >= r.length && (r = void 0), { value: r && r[n++], done: !r };
      }
    };
  throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, G = (
  /** @class */
  function() {
    function r(t, e, n) {
      this.ecCodewords = t, this.ecBlocks = [e], n && this.ecBlocks.push(n);
    }
    return r.prototype.getECCodewords = function() {
      return this.ecCodewords;
    }, r.prototype.getECBlocks = function() {
      return this.ecBlocks;
    }, r;
  }()
), V = (
  /** @class */
  function() {
    function r(t, e) {
      this.count = t, this.dataCodewords = e;
    }
    return r.prototype.getCount = function() {
      return this.count;
    }, r.prototype.getDataCodewords = function() {
      return this.dataCodewords;
    }, r;
  }()
), Pi = (
  /** @class */
  function() {
    function r(t, e, n, i, a, o) {
      var f, s;
      this.versionNumber = t, this.symbolSizeRows = e, this.symbolSizeColumns = n, this.dataRegionSizeRows = i, this.dataRegionSizeColumns = a, this.ecBlocks = o;
      var u = 0, c = o.getECCodewords(), l = o.getECBlocks();
      try {
        for (var h = vr(l), d = h.next(); !d.done; d = h.next()) {
          var v = d.value;
          u += v.getCount() * (v.getDataCodewords() + c);
        }
      } catch (g) {
        f = { error: g };
      } finally {
        try {
          d && !d.done && (s = h.return) && s.call(h);
        } finally {
          if (f)
            throw f.error;
        }
      }
      this.totalCodewords = u;
    }
    return r.prototype.getVersionNumber = function() {
      return this.versionNumber;
    }, r.prototype.getSymbolSizeRows = function() {
      return this.symbolSizeRows;
    }, r.prototype.getSymbolSizeColumns = function() {
      return this.symbolSizeColumns;
    }, r.prototype.getDataRegionSizeRows = function() {
      return this.dataRegionSizeRows;
    }, r.prototype.getDataRegionSizeColumns = function() {
      return this.dataRegionSizeColumns;
    }, r.prototype.getTotalCodewords = function() {
      return this.totalCodewords;
    }, r.prototype.getECBlocks = function() {
      return this.ecBlocks;
    }, r.getVersionForDimensions = function(t, e) {
      var n, i;
      if (t & 1 || e & 1)
        throw new T();
      try {
        for (var a = vr(r.VERSIONS), o = a.next(); !o.done; o = a.next()) {
          var f = o.value;
          if (f.symbolSizeRows === t && f.symbolSizeColumns === e)
            return f;
        }
      } catch (s) {
        n = { error: s };
      } finally {
        try {
          o && !o.done && (i = a.return) && i.call(a);
        } finally {
          if (n)
            throw n.error;
        }
      }
      throw new T();
    }, r.prototype.toString = function() {
      return "" + this.versionNumber;
    }, r.buildVersions = function() {
      return [
        new r(1, 10, 10, 8, 8, new G(5, new V(1, 3))),
        new r(2, 12, 12, 10, 10, new G(7, new V(1, 5))),
        new r(3, 14, 14, 12, 12, new G(10, new V(1, 8))),
        new r(4, 16, 16, 14, 14, new G(12, new V(1, 12))),
        new r(5, 18, 18, 16, 16, new G(14, new V(1, 18))),
        new r(6, 20, 20, 18, 18, new G(18, new V(1, 22))),
        new r(7, 22, 22, 20, 20, new G(20, new V(1, 30))),
        new r(8, 24, 24, 22, 22, new G(24, new V(1, 36))),
        new r(9, 26, 26, 24, 24, new G(28, new V(1, 44))),
        new r(10, 32, 32, 14, 14, new G(36, new V(1, 62))),
        new r(11, 36, 36, 16, 16, new G(42, new V(1, 86))),
        new r(12, 40, 40, 18, 18, new G(48, new V(1, 114))),
        new r(13, 44, 44, 20, 20, new G(56, new V(1, 144))),
        new r(14, 48, 48, 22, 22, new G(68, new V(1, 174))),
        new r(15, 52, 52, 24, 24, new G(42, new V(2, 102))),
        new r(16, 64, 64, 14, 14, new G(56, new V(2, 140))),
        new r(17, 72, 72, 16, 16, new G(36, new V(4, 92))),
        new r(18, 80, 80, 18, 18, new G(48, new V(4, 114))),
        new r(19, 88, 88, 20, 20, new G(56, new V(4, 144))),
        new r(20, 96, 96, 22, 22, new G(68, new V(4, 174))),
        new r(21, 104, 104, 24, 24, new G(56, new V(6, 136))),
        new r(22, 120, 120, 18, 18, new G(68, new V(6, 175))),
        new r(23, 132, 132, 20, 20, new G(62, new V(8, 163))),
        new r(24, 144, 144, 22, 22, new G(62, new V(8, 156), new V(2, 155))),
        new r(25, 8, 18, 6, 16, new G(7, new V(1, 5))),
        new r(26, 8, 32, 6, 14, new G(11, new V(1, 10))),
        new r(27, 12, 26, 10, 24, new G(14, new V(1, 16))),
        new r(28, 12, 36, 10, 16, new G(18, new V(1, 22))),
        new r(29, 16, 36, 14, 16, new G(24, new V(1, 32))),
        new r(30, 16, 48, 14, 22, new G(28, new V(1, 49)))
      ];
    }, r.VERSIONS = r.buildVersions(), r;
  }()
), Mi = (
  /** @class */
  function() {
    function r(t) {
      var e = t.getHeight();
      if (e < 8 || e > 144 || e & 1)
        throw new T();
      this.version = r.readVersion(t), this.mappingBitMatrix = this.extractDataRegion(t), this.readMappingMatrix = new Nt(this.mappingBitMatrix.getWidth(), this.mappingBitMatrix.getHeight());
    }
    return r.prototype.getVersion = function() {
      return this.version;
    }, r.readVersion = function(t) {
      var e = t.getHeight(), n = t.getWidth();
      return Pi.getVersionForDimensions(e, n);
    }, r.prototype.readCodewords = function() {
      var t = new Int8Array(this.version.getTotalCodewords()), e = 0, n = 4, i = 0, a = this.mappingBitMatrix.getHeight(), o = this.mappingBitMatrix.getWidth(), f = !1, s = !1, u = !1, c = !1;
      do
        if (n === a && i === 0 && !f)
          t[e++] = this.readCorner1(a, o) & 255, n -= 2, i += 2, f = !0;
        else if (n === a - 2 && i === 0 && o & 3 && !s)
          t[e++] = this.readCorner2(a, o) & 255, n -= 2, i += 2, s = !0;
        else if (n === a + 4 && i === 2 && !(o & 7) && !u)
          t[e++] = this.readCorner3(a, o) & 255, n -= 2, i += 2, u = !0;
        else if (n === a - 2 && i === 0 && (o & 7) === 4 && !c)
          t[e++] = this.readCorner4(a, o) & 255, n -= 2, i += 2, c = !0;
        else {
          do
            n < a && i >= 0 && !this.readMappingMatrix.get(i, n) && (t[e++] = this.readUtah(n, i, a, o) & 255), n -= 2, i += 2;
          while (n >= 0 && i < o);
          n += 1, i += 3;
          do
            n >= 0 && i < o && !this.readMappingMatrix.get(i, n) && (t[e++] = this.readUtah(n, i, a, o) & 255), n += 2, i -= 2;
          while (n < a && i >= 0);
          n += 3, i += 1;
        }
      while (n < a || i < o);
      if (e !== this.version.getTotalCodewords())
        throw new T();
      return t;
    }, r.prototype.readModule = function(t, e, n, i) {
      return t < 0 && (t += n, e += 4 - (n + 4 & 7)), e < 0 && (e += i, t += 4 - (i + 4 & 7)), this.readMappingMatrix.set(e, t), this.mappingBitMatrix.get(e, t);
    }, r.prototype.readUtah = function(t, e, n, i) {
      var a = 0;
      return this.readModule(t - 2, e - 2, n, i) && (a |= 1), a <<= 1, this.readModule(t - 2, e - 1, n, i) && (a |= 1), a <<= 1, this.readModule(t - 1, e - 2, n, i) && (a |= 1), a <<= 1, this.readModule(t - 1, e - 1, n, i) && (a |= 1), a <<= 1, this.readModule(t - 1, e, n, i) && (a |= 1), a <<= 1, this.readModule(t, e - 2, n, i) && (a |= 1), a <<= 1, this.readModule(t, e - 1, n, i) && (a |= 1), a <<= 1, this.readModule(t, e, n, i) && (a |= 1), a;
    }, r.prototype.readCorner1 = function(t, e) {
      var n = 0;
      return this.readModule(t - 1, 0, t, e) && (n |= 1), n <<= 1, this.readModule(t - 1, 1, t, e) && (n |= 1), n <<= 1, this.readModule(t - 1, 2, t, e) && (n |= 1), n <<= 1, this.readModule(0, e - 2, t, e) && (n |= 1), n <<= 1, this.readModule(0, e - 1, t, e) && (n |= 1), n <<= 1, this.readModule(1, e - 1, t, e) && (n |= 1), n <<= 1, this.readModule(2, e - 1, t, e) && (n |= 1), n <<= 1, this.readModule(3, e - 1, t, e) && (n |= 1), n;
    }, r.prototype.readCorner2 = function(t, e) {
      var n = 0;
      return this.readModule(t - 3, 0, t, e) && (n |= 1), n <<= 1, this.readModule(t - 2, 0, t, e) && (n |= 1), n <<= 1, this.readModule(t - 1, 0, t, e) && (n |= 1), n <<= 1, this.readModule(0, e - 4, t, e) && (n |= 1), n <<= 1, this.readModule(0, e - 3, t, e) && (n |= 1), n <<= 1, this.readModule(0, e - 2, t, e) && (n |= 1), n <<= 1, this.readModule(0, e - 1, t, e) && (n |= 1), n <<= 1, this.readModule(1, e - 1, t, e) && (n |= 1), n;
    }, r.prototype.readCorner3 = function(t, e) {
      var n = 0;
      return this.readModule(t - 1, 0, t, e) && (n |= 1), n <<= 1, this.readModule(t - 1, e - 1, t, e) && (n |= 1), n <<= 1, this.readModule(0, e - 3, t, e) && (n |= 1), n <<= 1, this.readModule(0, e - 2, t, e) && (n |= 1), n <<= 1, this.readModule(0, e - 1, t, e) && (n |= 1), n <<= 1, this.readModule(1, e - 3, t, e) && (n |= 1), n <<= 1, this.readModule(1, e - 2, t, e) && (n |= 1), n <<= 1, this.readModule(1, e - 1, t, e) && (n |= 1), n;
    }, r.prototype.readCorner4 = function(t, e) {
      var n = 0;
      return this.readModule(t - 3, 0, t, e) && (n |= 1), n <<= 1, this.readModule(t - 2, 0, t, e) && (n |= 1), n <<= 1, this.readModule(t - 1, 0, t, e) && (n |= 1), n <<= 1, this.readModule(0, e - 2, t, e) && (n |= 1), n <<= 1, this.readModule(0, e - 1, t, e) && (n |= 1), n <<= 1, this.readModule(1, e - 1, t, e) && (n |= 1), n <<= 1, this.readModule(2, e - 1, t, e) && (n |= 1), n <<= 1, this.readModule(3, e - 1, t, e) && (n |= 1), n;
    }, r.prototype.extractDataRegion = function(t) {
      var e = this.version.getSymbolSizeRows(), n = this.version.getSymbolSizeColumns();
      if (t.getHeight() !== e)
        throw new D("Dimension of bitMatrix must match the version size");
      for (var i = this.version.getDataRegionSizeRows(), a = this.version.getDataRegionSizeColumns(), o = e / i | 0, f = n / a | 0, s = o * i, u = f * a, c = new Nt(u, s), l = 0; l < o; ++l)
        for (var h = l * i, d = 0; d < f; ++d)
          for (var v = d * a, g = 0; g < i; ++g)
            for (var x = l * (i + 2) + 1 + g, w = h + g, y = 0; y < a; ++y) {
              var _ = d * (a + 2) + 1 + y;
              if (t.get(_, x)) {
                var E = v + y;
                c.set(E, w);
              }
            }
      return c;
    }, r;
  }()
), pr = globalThis && globalThis.__values || function(r) {
  var t = typeof Symbol == "function" && Symbol.iterator, e = t && r[t], n = 0;
  if (e)
    return e.call(r);
  if (r && typeof r.length == "number")
    return {
      next: function() {
        return r && n >= r.length && (r = void 0), { value: r && r[n++], done: !r };
      }
    };
  throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, Bi = (
  /** @class */
  function() {
    function r(t, e) {
      this.numDataCodewords = t, this.codewords = e;
    }
    return r.getDataBlocks = function(t, e) {
      var n, i, a, o, f = e.getECBlocks(), s = 0, u = f.getECBlocks();
      try {
        for (var c = pr(u), l = c.next(); !l.done; l = c.next()) {
          var h = l.value;
          s += h.getCount();
        }
      } catch (Et) {
        n = { error: Et };
      } finally {
        try {
          l && !l.done && (i = c.return) && i.call(c);
        } finally {
          if (n)
            throw n.error;
        }
      }
      var d = new Array(s), v = 0;
      try {
        for (var g = pr(u), x = g.next(); !x.done; x = g.next())
          for (var h = x.value, w = 0; w < h.getCount(); w++) {
            var y = h.getDataCodewords(), _ = f.getECCodewords() + y;
            d[v++] = new r(y, new Uint8Array(_));
          }
      } catch (Et) {
        a = { error: Et };
      } finally {
        try {
          x && !x.done && (o = g.return) && o.call(g);
        } finally {
          if (a)
            throw a.error;
        }
      }
      for (var E = d[0].codewords.length, m = E - f.getECCodewords(), I = m - 1, S = 0, w = 0; w < I; w++)
        for (var b = 0; b < v; b++)
          d[b].codewords[w] = t[S++];
      for (var P = e.getVersionNumber() === 24, R = P ? 8 : v, b = 0; b < R; b++)
        d[b].codewords[m - 1] = t[S++];
      for (var J = d[0].codewords.length, w = m; w < J; w++)
        for (var b = 0; b < v; b++) {
          var L = P ? (b + 8) % v : b, K = P && L > 7 ? w - 1 : w;
          d[L].codewords[K] = t[S++];
        }
      if (S !== t.length)
        throw new D();
      return d;
    }, r.prototype.getNumDataCodewords = function() {
      return this.numDataCodewords;
    }, r.prototype.getCodewords = function() {
      return this.codewords;
    }, r;
  }()
), Gr = (
  /** @class */
  function() {
    function r(t) {
      this.bytes = t, this.byteOffset = 0, this.bitOffset = 0;
    }
    return r.prototype.getBitOffset = function() {
      return this.bitOffset;
    }, r.prototype.getByteOffset = function() {
      return this.byteOffset;
    }, r.prototype.readBits = function(t) {
      if (t < 1 || t > 32 || t > this.available())
        throw new D("" + t);
      var e = 0, n = this.bitOffset, i = this.byteOffset, a = this.bytes;
      if (n > 0) {
        var o = 8 - n, f = t < o ? t : o, s = o - f, u = 255 >> 8 - f << s;
        e = (a[i] & u) >> s, t -= f, n += f, n === 8 && (n = 0, i++);
      }
      if (t > 0) {
        for (; t >= 8; )
          e = e << 8 | a[i] & 255, i++, t -= 8;
        if (t > 0) {
          var s = 8 - t, u = 255 >> s << s;
          e = e << t | (a[i] & u) >> s, n += t;
        }
      }
      return this.bitOffset = n, this.byteOffset = i, e;
    }, r.prototype.available = function() {
      return 8 * (this.bytes.length - this.byteOffset) - this.bitOffset;
    }, r;
  }()
), rt;
(function(r) {
  r[r.PAD_ENCODE = 0] = "PAD_ENCODE", r[r.ASCII_ENCODE = 1] = "ASCII_ENCODE", r[r.C40_ENCODE = 2] = "C40_ENCODE", r[r.TEXT_ENCODE = 3] = "TEXT_ENCODE", r[r.ANSIX12_ENCODE = 4] = "ANSIX12_ENCODE", r[r.EDIFACT_ENCODE = 5] = "EDIFACT_ENCODE", r[r.BASE256_ENCODE = 6] = "BASE256_ENCODE";
})(rt || (rt = {}));
var Fi = (
  /** @class */
  function() {
    function r() {
    }
    return r.decode = function(t) {
      var e = new Gr(t), n = new M(), i = new M(), a = new Array(), o = rt.ASCII_ENCODE;
      do
        if (o === rt.ASCII_ENCODE)
          o = this.decodeAsciiSegment(e, n, i);
        else {
          switch (o) {
            case rt.C40_ENCODE:
              this.decodeC40Segment(e, n);
              break;
            case rt.TEXT_ENCODE:
              this.decodeTextSegment(e, n);
              break;
            case rt.ANSIX12_ENCODE:
              this.decodeAnsiX12Segment(e, n);
              break;
            case rt.EDIFACT_ENCODE:
              this.decodeEdifactSegment(e, n);
              break;
            case rt.BASE256_ENCODE:
              this.decodeBase256Segment(e, n, a);
              break;
            default:
              throw new T();
          }
          o = rt.ASCII_ENCODE;
        }
      while (o !== rt.PAD_ENCODE && e.available() > 0);
      return i.length() > 0 && n.append(i.toString()), new we(t, n.toString(), a.length === 0 ? null : a, null);
    }, r.decodeAsciiSegment = function(t, e, n) {
      var i = !1;
      do {
        var a = t.readBits(8);
        if (a === 0)
          throw new T();
        if (a <= 128)
          return i && (a += 128), e.append(String.fromCharCode(a - 1)), rt.ASCII_ENCODE;
        if (a === 129)
          return rt.PAD_ENCODE;
        if (a <= 229) {
          var o = a - 130;
          o < 10 && e.append("0"), e.append("" + o);
        } else
          switch (a) {
            case 230:
              return rt.C40_ENCODE;
            case 231:
              return rt.BASE256_ENCODE;
            case 232:
              e.append(String.fromCharCode(29));
              break;
            case 233:
            case 234:
              break;
            case 235:
              i = !0;
              break;
            case 236:
              e.append("[)>05"), n.insert(0, "");
              break;
            case 237:
              e.append("[)>06"), n.insert(0, "");
              break;
            case 238:
              return rt.ANSIX12_ENCODE;
            case 239:
              return rt.TEXT_ENCODE;
            case 240:
              return rt.EDIFACT_ENCODE;
            case 241:
              break;
            default:
              if (a !== 254 || t.available() !== 0)
                throw new T();
              break;
          }
      } while (t.available() > 0);
      return rt.ASCII_ENCODE;
    }, r.decodeC40Segment = function(t, e) {
      var n = !1, i = [], a = 0;
      do {
        if (t.available() === 8)
          return;
        var o = t.readBits(8);
        if (o === 254)
          return;
        this.parseTwoBytes(o, t.readBits(8), i);
        for (var f = 0; f < 3; f++) {
          var s = i[f];
          switch (a) {
            case 0:
              if (s < 3)
                a = s + 1;
              else if (s < this.C40_BASIC_SET_CHARS.length) {
                var u = this.C40_BASIC_SET_CHARS[s];
                n ? (e.append(String.fromCharCode(u.charCodeAt(0) + 128)), n = !1) : e.append(u);
              } else
                throw new T();
              break;
            case 1:
              n ? (e.append(String.fromCharCode(s + 128)), n = !1) : e.append(String.fromCharCode(s)), a = 0;
              break;
            case 2:
              if (s < this.C40_SHIFT2_SET_CHARS.length) {
                var u = this.C40_SHIFT2_SET_CHARS[s];
                n ? (e.append(String.fromCharCode(u.charCodeAt(0) + 128)), n = !1) : e.append(u);
              } else
                switch (s) {
                  case 27:
                    e.append(String.fromCharCode(29));
                    break;
                  case 30:
                    n = !0;
                    break;
                  default:
                    throw new T();
                }
              a = 0;
              break;
            case 3:
              n ? (e.append(String.fromCharCode(s + 224)), n = !1) : e.append(String.fromCharCode(s + 96)), a = 0;
              break;
            default:
              throw new T();
          }
        }
      } while (t.available() > 0);
    }, r.decodeTextSegment = function(t, e) {
      var n = !1, i = [], a = 0;
      do {
        if (t.available() === 8)
          return;
        var o = t.readBits(8);
        if (o === 254)
          return;
        this.parseTwoBytes(o, t.readBits(8), i);
        for (var f = 0; f < 3; f++) {
          var s = i[f];
          switch (a) {
            case 0:
              if (s < 3)
                a = s + 1;
              else if (s < this.TEXT_BASIC_SET_CHARS.length) {
                var u = this.TEXT_BASIC_SET_CHARS[s];
                n ? (e.append(String.fromCharCode(u.charCodeAt(0) + 128)), n = !1) : e.append(u);
              } else
                throw new T();
              break;
            case 1:
              n ? (e.append(String.fromCharCode(s + 128)), n = !1) : e.append(String.fromCharCode(s)), a = 0;
              break;
            case 2:
              if (s < this.TEXT_SHIFT2_SET_CHARS.length) {
                var u = this.TEXT_SHIFT2_SET_CHARS[s];
                n ? (e.append(String.fromCharCode(u.charCodeAt(0) + 128)), n = !1) : e.append(u);
              } else
                switch (s) {
                  case 27:
                    e.append(String.fromCharCode(29));
                    break;
                  case 30:
                    n = !0;
                    break;
                  default:
                    throw new T();
                }
              a = 0;
              break;
            case 3:
              if (s < this.TEXT_SHIFT3_SET_CHARS.length) {
                var u = this.TEXT_SHIFT3_SET_CHARS[s];
                n ? (e.append(String.fromCharCode(u.charCodeAt(0) + 128)), n = !1) : e.append(u), a = 0;
              } else
                throw new T();
              break;
            default:
              throw new T();
          }
        }
      } while (t.available() > 0);
    }, r.decodeAnsiX12Segment = function(t, e) {
      var n = [];
      do {
        if (t.available() === 8)
          return;
        var i = t.readBits(8);
        if (i === 254)
          return;
        this.parseTwoBytes(i, t.readBits(8), n);
        for (var a = 0; a < 3; a++) {
          var o = n[a];
          switch (o) {
            case 0:
              e.append("\r");
              break;
            case 1:
              e.append("*");
              break;
            case 2:
              e.append(">");
              break;
            case 3:
              e.append(" ");
              break;
            default:
              if (o < 14)
                e.append(String.fromCharCode(o + 44));
              else if (o < 40)
                e.append(String.fromCharCode(o + 51));
              else
                throw new T();
              break;
          }
        }
      } while (t.available() > 0);
    }, r.parseTwoBytes = function(t, e, n) {
      var i = (t << 8) + e - 1, a = Math.floor(i / 1600);
      n[0] = a, i -= a * 1600, a = Math.floor(i / 40), n[1] = a, n[2] = i - a * 40;
    }, r.decodeEdifactSegment = function(t, e) {
      do {
        if (t.available() <= 16)
          return;
        for (var n = 0; n < 4; n++) {
          var i = t.readBits(6);
          if (i === 31) {
            var a = 8 - t.getBitOffset();
            a !== 8 && t.readBits(a);
            return;
          }
          i & 32 || (i |= 64), e.append(String.fromCharCode(i));
        }
      } while (t.available() > 0);
    }, r.decodeBase256Segment = function(t, e, n) {
      var i = 1 + t.getByteOffset(), a = this.unrandomize255State(t.readBits(8), i++), o;
      if (a === 0 ? o = t.available() / 8 | 0 : a < 250 ? o = a : o = 250 * (a - 249) + this.unrandomize255State(t.readBits(8), i++), o < 0)
        throw new T();
      for (var f = new Uint8Array(o), s = 0; s < o; s++) {
        if (t.available() < 8)
          throw new T();
        f[s] = this.unrandomize255State(t.readBits(8), i++);
      }
      n.push(f);
      try {
        e.append(It.decode(f, F.ISO88591));
      } catch (u) {
        throw new Kt("Platform does not support required encoding: " + u.message);
      }
    }, r.unrandomize255State = function(t, e) {
      var n = 149 * e % 255 + 1, i = t - n;
      return i >= 0 ? i : i + 256;
    }, r.C40_BASIC_SET_CHARS = [
      "*",
      "*",
      "*",
      " ",
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z"
    ], r.C40_SHIFT2_SET_CHARS = [
      "!",
      '"',
      "#",
      "$",
      "%",
      "&",
      "'",
      "(",
      ")",
      "*",
      "+",
      ",",
      "-",
      ".",
      "/",
      ":",
      ";",
      "<",
      "=",
      ">",
      "?",
      "@",
      "[",
      "\\",
      "]",
      "^",
      "_"
    ], r.TEXT_BASIC_SET_CHARS = [
      "*",
      "*",
      "*",
      " ",
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z"
    ], r.TEXT_SHIFT2_SET_CHARS = r.C40_SHIFT2_SET_CHARS, r.TEXT_SHIFT3_SET_CHARS = [
      "`",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
      "{",
      "|",
      "}",
      "~",
      String.fromCharCode(127)
    ], r;
  }()
), Li = globalThis && globalThis.__values || function(r) {
  var t = typeof Symbol == "function" && Symbol.iterator, e = t && r[t], n = 0;
  if (e)
    return e.call(r);
  if (r && typeof r.length == "number")
    return {
      next: function() {
        return r && n >= r.length && (r = void 0), { value: r && r[n++], done: !r };
      }
    };
  throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, ki = (
  /** @class */
  function() {
    function r() {
      this.rsDecoder = new _e(_t.DATA_MATRIX_FIELD_256);
    }
    return r.prototype.decode = function(t) {
      var e, n, i = new Mi(t), a = i.getVersion(), o = i.readCodewords(), f = Bi.getDataBlocks(o, a), s = 0;
      try {
        for (var u = Li(f), c = u.next(); !c.done; c = u.next()) {
          var l = c.value;
          s += l.getNumDataCodewords();
        }
      } catch (_) {
        e = { error: _ };
      } finally {
        try {
          c && !c.done && (n = u.return) && n.call(u);
        } finally {
          if (e)
            throw e.error;
        }
      }
      for (var h = new Uint8Array(s), d = f.length, v = 0; v < d; v++) {
        var g = f[v], x = g.getCodewords(), w = g.getNumDataCodewords();
        this.correctErrors(x, w);
        for (var y = 0; y < w; y++)
          h[y * d + v] = x[y];
      }
      return Fi.decode(h);
    }, r.prototype.correctErrors = function(t, e) {
      var n = new Int32Array(t);
      try {
        this.rsDecoder.decode(n, t.length - e);
      } catch {
        throw new et();
      }
      for (var i = 0; i < e; i++)
        t[i] = n[i];
    }, r;
  }()
), Ui = (
  /** @class */
  function() {
    function r(t) {
      this.image = t, this.rectangleDetector = new ke(this.image);
    }
    return r.prototype.detect = function() {
      var t = this.rectangleDetector.detect(), e = this.detectSolid1(t);
      if (e = this.detectSolid2(e), e[3] = this.correctTopRight(e), !e[3])
        throw new C();
      e = this.shiftToModuleCenter(e);
      var n = e[0], i = e[1], a = e[2], o = e[3], f = this.transitionsBetween(n, o) + 1, s = this.transitionsBetween(a, o) + 1;
      (f & 1) === 1 && (f += 1), (s & 1) === 1 && (s += 1), 4 * f < 7 * s && 4 * s < 7 * f && (f = s = Math.max(f, s));
      var u = r.sampleGrid(this.image, n, i, a, o, f, s);
      return new je(u, [n, i, a, o]);
    }, r.shiftPoint = function(t, e, n) {
      var i = (e.getX() - t.getX()) / (n + 1), a = (e.getY() - t.getY()) / (n + 1);
      return new O(t.getX() + i, t.getY() + a);
    }, r.moveAway = function(t, e, n) {
      var i = t.getX(), a = t.getY();
      return i < e ? i -= 1 : i += 1, a < n ? a -= 1 : a += 1, new O(i, a);
    }, r.prototype.detectSolid1 = function(t) {
      var e = t[0], n = t[1], i = t[3], a = t[2], o = this.transitionsBetween(e, n), f = this.transitionsBetween(n, i), s = this.transitionsBetween(i, a), u = this.transitionsBetween(a, e), c = o, l = [a, e, n, i];
      return c > f && (c = f, l[0] = e, l[1] = n, l[2] = i, l[3] = a), c > s && (c = s, l[0] = n, l[1] = i, l[2] = a, l[3] = e), c > u && (l[0] = i, l[1] = a, l[2] = e, l[3] = n), l;
    }, r.prototype.detectSolid2 = function(t) {
      var e = t[0], n = t[1], i = t[2], a = t[3], o = this.transitionsBetween(e, a), f = r.shiftPoint(n, i, (o + 1) * 4), s = r.shiftPoint(i, n, (o + 1) * 4), u = this.transitionsBetween(f, e), c = this.transitionsBetween(s, a);
      return u < c ? (t[0] = e, t[1] = n, t[2] = i, t[3] = a) : (t[0] = n, t[1] = i, t[2] = a, t[3] = e), t;
    }, r.prototype.correctTopRight = function(t) {
      var e = t[0], n = t[1], i = t[2], a = t[3], o = this.transitionsBetween(e, a), f = this.transitionsBetween(n, a), s = r.shiftPoint(e, n, (f + 1) * 4), u = r.shiftPoint(i, n, (o + 1) * 4);
      o = this.transitionsBetween(s, a), f = this.transitionsBetween(u, a);
      var c = new O(a.getX() + (i.getX() - n.getX()) / (o + 1), a.getY() + (i.getY() - n.getY()) / (o + 1)), l = new O(a.getX() + (e.getX() - n.getX()) / (f + 1), a.getY() + (e.getY() - n.getY()) / (f + 1));
      if (!this.isValid(c))
        return this.isValid(l) ? l : null;
      if (!this.isValid(l))
        return c;
      var h = this.transitionsBetween(s, c) + this.transitionsBetween(u, c), d = this.transitionsBetween(s, l) + this.transitionsBetween(u, l);
      return h > d ? c : l;
    }, r.prototype.shiftToModuleCenter = function(t) {
      var e = t[0], n = t[1], i = t[2], a = t[3], o = this.transitionsBetween(e, a) + 1, f = this.transitionsBetween(i, a) + 1, s = r.shiftPoint(e, n, f * 4), u = r.shiftPoint(i, n, o * 4);
      o = this.transitionsBetween(s, a) + 1, f = this.transitionsBetween(u, a) + 1, (o & 1) === 1 && (o += 1), (f & 1) === 1 && (f += 1);
      var c = (e.getX() + n.getX() + i.getX() + a.getX()) / 4, l = (e.getY() + n.getY() + i.getY() + a.getY()) / 4;
      e = r.moveAway(e, c, l), n = r.moveAway(n, c, l), i = r.moveAway(i, c, l), a = r.moveAway(a, c, l);
      var h, d;
      return s = r.shiftPoint(e, n, f * 4), s = r.shiftPoint(s, a, o * 4), h = r.shiftPoint(n, e, f * 4), h = r.shiftPoint(h, i, o * 4), u = r.shiftPoint(i, a, f * 4), u = r.shiftPoint(u, n, o * 4), d = r.shiftPoint(a, i, f * 4), d = r.shiftPoint(d, e, o * 4), [s, h, u, d];
    }, r.prototype.isValid = function(t) {
      return t.getX() >= 0 && t.getX() < this.image.getWidth() && t.getY() > 0 && t.getY() < this.image.getHeight();
    }, r.sampleGrid = function(t, e, n, i, a, o, f) {
      var s = Ye.getInstance();
      return s.sampleGrid(t, o, f, 0.5, 0.5, o - 0.5, 0.5, o - 0.5, f - 0.5, 0.5, f - 0.5, e.getX(), e.getY(), a.getX(), a.getY(), i.getX(), i.getY(), n.getX(), n.getY());
    }, r.prototype.transitionsBetween = function(t, e) {
      var n = Math.trunc(t.getX()), i = Math.trunc(t.getY()), a = Math.trunc(e.getX()), o = Math.trunc(e.getY()), f = Math.abs(o - i) > Math.abs(a - n);
      if (f) {
        var s = n;
        n = i, i = s, s = a, a = o, o = s;
      }
      for (var u = Math.abs(a - n), c = Math.abs(o - i), l = -u / 2, h = i < o ? 1 : -1, d = n < a ? 1 : -1, v = 0, g = this.image.get(f ? i : n, f ? n : i), x = n, w = i; x !== a; x += d) {
        var y = this.image.get(f ? w : x, f ? x : w);
        if (y !== g && (v++, g = y), l += c, l > 0) {
          if (w === o)
            break;
          w += h, l -= u;
        }
      }
      return v;
    }, r;
  }()
), ve = (
  /** @class */
  function() {
    function r() {
      this.decoder = new ki();
    }
    return r.prototype.decode = function(t, e) {
      e === void 0 && (e = null);
      var n, i;
      if (e != null && e.has($.PURE_BARCODE)) {
        var a = r.extractPureBits(t.getBlackMatrix());
        n = this.decoder.decode(a), i = r.NO_POINTS;
      } else {
        var o = new Ui(t.getBlackMatrix()).detect();
        n = this.decoder.decode(o.getBits()), i = o.getPoints();
      }
      var f = n.getRawBytes(), s = new pt(n.getText(), f, 8 * f.length, i, N.DATA_MATRIX, j.currentTimeMillis()), u = n.getByteSegments();
      u != null && s.putMetadata(dt.BYTE_SEGMENTS, u);
      var c = n.getECLevel();
      return c != null && s.putMetadata(dt.ERROR_CORRECTION_LEVEL, c), s;
    }, r.prototype.reset = function() {
    }, r.extractPureBits = function(t) {
      var e = t.getTopLeftOnBit(), n = t.getBottomRightOnBit();
      if (e == null || n == null)
        throw new C();
      var i = this.moduleSize(e, t), a = e[1], o = n[1], f = e[0], s = n[0], u = (s - f + 1) / i, c = (o - a + 1) / i;
      if (u <= 0 || c <= 0)
        throw new C();
      var l = i / 2;
      a += l, f += l;
      for (var h = new Nt(u, c), d = 0; d < c; d++)
        for (var v = a + d * i, g = 0; g < u; g++)
          t.get(f + g * i, v) && h.set(g, d);
      return h;
    }, r.moduleSize = function(t, e) {
      for (var n = e.getWidth(), i = t[0], a = t[1]; i < n && e.get(i, a); )
        i++;
      if (i === n)
        throw new C();
      var o = i - t[0];
      if (o === 0)
        throw new C();
      return o;
    }, r.NO_POINTS = [], r;
  }()
), Vi = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}();
(function(r) {
  Vi(t, r);
  function t(e) {
    return e === void 0 && (e = 500), r.call(this, new ve(), e) || this;
  }
  return t;
})($t);
var jt;
(function(r) {
  r[r.L = 0] = "L", r[r.M = 1] = "M", r[r.Q = 2] = "Q", r[r.H = 3] = "H";
})(jt || (jt = {}));
var Ve = (
  /** @class */
  function() {
    function r(t, e, n) {
      this.value = t, this.stringValue = e, this.bits = n, r.FOR_BITS.set(n, this), r.FOR_VALUE.set(t, this);
    }
    return r.prototype.getValue = function() {
      return this.value;
    }, r.prototype.getBits = function() {
      return this.bits;
    }, r.fromString = function(t) {
      switch (t) {
        case "L":
          return r.L;
        case "M":
          return r.M;
        case "Q":
          return r.Q;
        case "H":
          return r.H;
        default:
          throw new tt(t + "not available");
      }
    }, r.prototype.toString = function() {
      return this.stringValue;
    }, r.prototype.equals = function(t) {
      if (!(t instanceof r))
        return !1;
      var e = t;
      return this.value === e.value;
    }, r.forBits = function(t) {
      if (t < 0 || t >= r.FOR_BITS.size)
        throw new D();
      return r.FOR_BITS.get(t);
    }, r.FOR_BITS = /* @__PURE__ */ new Map(), r.FOR_VALUE = /* @__PURE__ */ new Map(), r.L = new r(jt.L, "L", 1), r.M = new r(jt.M, "M", 0), r.Q = new r(jt.Q, "Q", 3), r.H = new r(jt.H, "H", 2), r;
  }()
), Hi = globalThis && globalThis.__values || function(r) {
  var t = typeof Symbol == "function" && Symbol.iterator, e = t && r[t], n = 0;
  if (e)
    return e.call(r);
  if (r && typeof r.length == "number")
    return {
      next: function() {
        return r && n >= r.length && (r = void 0), { value: r && r[n++], done: !r };
      }
    };
  throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, Xr = (
  /** @class */
  function() {
    function r(t) {
      this.errorCorrectionLevel = Ve.forBits(t >> 3 & 3), this.dataMask = /*(byte) */
      t & 7;
    }
    return r.numBitsDiffering = function(t, e) {
      return B.bitCount(t ^ e);
    }, r.decodeFormatInformation = function(t, e) {
      var n = r.doDecodeFormatInformation(t, e);
      return n !== null ? n : r.doDecodeFormatInformation(t ^ r.FORMAT_INFO_MASK_QR, e ^ r.FORMAT_INFO_MASK_QR);
    }, r.doDecodeFormatInformation = function(t, e) {
      var n, i, a = Number.MAX_SAFE_INTEGER, o = 0;
      try {
        for (var f = Hi(r.FORMAT_INFO_DECODE_LOOKUP), s = f.next(); !s.done; s = f.next()) {
          var u = s.value, c = u[0];
          if (c === t || c === e)
            return new r(u[1]);
          var l = r.numBitsDiffering(t, c);
          l < a && (o = u[1], a = l), t !== e && (l = r.numBitsDiffering(e, c), l < a && (o = u[1], a = l));
        }
      } catch (h) {
        n = { error: h };
      } finally {
        try {
          s && !s.done && (i = f.return) && i.call(f);
        } finally {
          if (n)
            throw n.error;
        }
      }
      return a <= 3 ? new r(o) : null;
    }, r.prototype.getErrorCorrectionLevel = function() {
      return this.errorCorrectionLevel;
    }, r.prototype.getDataMask = function() {
      return this.dataMask;
    }, r.prototype.hashCode = function() {
      return this.errorCorrectionLevel.getBits() << 3 | this.dataMask;
    }, r.prototype.equals = function(t) {
      if (!(t instanceof r))
        return !1;
      var e = t;
      return this.errorCorrectionLevel === e.errorCorrectionLevel && this.dataMask === e.dataMask;
    }, r.FORMAT_INFO_MASK_QR = 21522, r.FORMAT_INFO_DECODE_LOOKUP = [
      Int32Array.from([21522, 0]),
      Int32Array.from([20773, 1]),
      Int32Array.from([24188, 2]),
      Int32Array.from([23371, 3]),
      Int32Array.from([17913, 4]),
      Int32Array.from([16590, 5]),
      Int32Array.from([20375, 6]),
      Int32Array.from([19104, 7]),
      Int32Array.from([30660, 8]),
      Int32Array.from([29427, 9]),
      Int32Array.from([32170, 10]),
      Int32Array.from([30877, 11]),
      Int32Array.from([26159, 12]),
      Int32Array.from([25368, 13]),
      Int32Array.from([27713, 14]),
      Int32Array.from([26998, 15]),
      Int32Array.from([5769, 16]),
      Int32Array.from([5054, 17]),
      Int32Array.from([7399, 18]),
      Int32Array.from([6608, 19]),
      Int32Array.from([1890, 20]),
      Int32Array.from([597, 21]),
      Int32Array.from([3340, 22]),
      Int32Array.from([2107, 23]),
      Int32Array.from([13663, 24]),
      Int32Array.from([12392, 25]),
      Int32Array.from([16177, 26]),
      Int32Array.from([14854, 27]),
      Int32Array.from([9396, 28]),
      Int32Array.from([8579, 29]),
      Int32Array.from([11994, 30]),
      Int32Array.from([11245, 31])
    ], r;
  }()
), Gi = globalThis && globalThis.__values || function(r) {
  var t = typeof Symbol == "function" && Symbol.iterator, e = t && r[t], n = 0;
  if (e)
    return e.call(r);
  if (r && typeof r.length == "number")
    return {
      next: function() {
        return r && n >= r.length && (r = void 0), { value: r && r[n++], done: !r };
      }
    };
  throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, A = (
  /** @class */
  function() {
    function r(t) {
      for (var e = [], n = 1; n < arguments.length; n++)
        e[n - 1] = arguments[n];
      this.ecCodewordsPerBlock = t, this.ecBlocks = e;
    }
    return r.prototype.getECCodewordsPerBlock = function() {
      return this.ecCodewordsPerBlock;
    }, r.prototype.getNumBlocks = function() {
      var t, e, n = 0, i = this.ecBlocks;
      try {
        for (var a = Gi(i), o = a.next(); !o.done; o = a.next()) {
          var f = o.value;
          n += f.getCount();
        }
      } catch (s) {
        t = { error: s };
      } finally {
        try {
          o && !o.done && (e = a.return) && e.call(a);
        } finally {
          if (t)
            throw t.error;
        }
      }
      return n;
    }, r.prototype.getTotalECCodewords = function() {
      return this.ecCodewordsPerBlock * this.getNumBlocks();
    }, r.prototype.getECBlocks = function() {
      return this.ecBlocks;
    }, r;
  }()
), p = (
  /** @class */
  function() {
    function r(t, e) {
      this.count = t, this.dataCodewords = e;
    }
    return r.prototype.getCount = function() {
      return this.count;
    }, r.prototype.getDataCodewords = function() {
      return this.dataCodewords;
    }, r;
  }()
), Xi = globalThis && globalThis.__values || function(r) {
  var t = typeof Symbol == "function" && Symbol.iterator, e = t && r[t], n = 0;
  if (e)
    return e.call(r);
  if (r && typeof r.length == "number")
    return {
      next: function() {
        return r && n >= r.length && (r = void 0), { value: r && r[n++], done: !r };
      }
    };
  throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, Gt = (
  /** @class */
  function() {
    function r(t, e) {
      for (var n, i, a = [], o = 2; o < arguments.length; o++)
        a[o - 2] = arguments[o];
      this.versionNumber = t, this.alignmentPatternCenters = e, this.ecBlocks = a;
      var f = 0, s = a[0].getECCodewordsPerBlock(), u = a[0].getECBlocks();
      try {
        for (var c = Xi(u), l = c.next(); !l.done; l = c.next()) {
          var h = l.value;
          f += h.getCount() * (h.getDataCodewords() + s);
        }
      } catch (d) {
        n = { error: d };
      } finally {
        try {
          l && !l.done && (i = c.return) && i.call(c);
        } finally {
          if (n)
            throw n.error;
        }
      }
      this.totalCodewords = f;
    }
    return r.prototype.getVersionNumber = function() {
      return this.versionNumber;
    }, r.prototype.getAlignmentPatternCenters = function() {
      return this.alignmentPatternCenters;
    }, r.prototype.getTotalCodewords = function() {
      return this.totalCodewords;
    }, r.prototype.getDimensionForVersion = function() {
      return 17 + 4 * this.versionNumber;
    }, r.prototype.getECBlocksForLevel = function(t) {
      return this.ecBlocks[t.getValue()];
    }, r.getProvisionalVersionForDimension = function(t) {
      if (t % 4 !== 1)
        throw new T();
      try {
        return this.getVersionForNumber((t - 17) / 4);
      } catch {
        throw new T();
      }
    }, r.getVersionForNumber = function(t) {
      if (t < 1 || t > 40)
        throw new D();
      return r.VERSIONS[t - 1];
    }, r.decodeVersionInformation = function(t) {
      for (var e = Number.MAX_SAFE_INTEGER, n = 0, i = 0; i < r.VERSION_DECODE_INFO.length; i++) {
        var a = r.VERSION_DECODE_INFO[i];
        if (a === t)
          return r.getVersionForNumber(i + 7);
        var o = Xr.numBitsDiffering(t, a);
        o < e && (n = i + 7, e = o);
      }
      return e <= 3 ? r.getVersionForNumber(n) : null;
    }, r.prototype.buildFunctionPattern = function() {
      var t = this.getDimensionForVersion(), e = new Nt(t);
      e.setRegion(0, 0, 9, 9), e.setRegion(t - 8, 0, 8, 9), e.setRegion(0, t - 8, 9, 8);
      for (var n = this.alignmentPatternCenters.length, i = 0; i < n; i++)
        for (var a = this.alignmentPatternCenters[i] - 2, o = 0; o < n; o++)
          i === 0 && (o === 0 || o === n - 1) || i === n - 1 && o === 0 || e.setRegion(this.alignmentPatternCenters[o] - 2, a, 5, 5);
      return e.setRegion(6, 9, 1, t - 17), e.setRegion(9, 6, t - 17, 1), this.versionNumber > 6 && (e.setRegion(t - 11, 0, 3, 6), e.setRegion(0, t - 11, 6, 3)), e;
    }, r.prototype.toString = function() {
      return "" + this.versionNumber;
    }, r.VERSION_DECODE_INFO = Int32Array.from([
      31892,
      34236,
      39577,
      42195,
      48118,
      51042,
      55367,
      58893,
      63784,
      68472,
      70749,
      76311,
      79154,
      84390,
      87683,
      92361,
      96236,
      102084,
      102881,
      110507,
      110734,
      117786,
      119615,
      126325,
      127568,
      133589,
      136944,
      141498,
      145311,
      150283,
      152622,
      158308,
      161089,
      167017
    ]), r.VERSIONS = [
      new r(1, new Int32Array(0), new A(7, new p(1, 19)), new A(10, new p(1, 16)), new A(13, new p(1, 13)), new A(17, new p(1, 9))),
      new r(2, Int32Array.from([6, 18]), new A(10, new p(1, 34)), new A(16, new p(1, 28)), new A(22, new p(1, 22)), new A(28, new p(1, 16))),
      new r(3, Int32Array.from([6, 22]), new A(15, new p(1, 55)), new A(26, new p(1, 44)), new A(18, new p(2, 17)), new A(22, new p(2, 13))),
      new r(4, Int32Array.from([6, 26]), new A(20, new p(1, 80)), new A(18, new p(2, 32)), new A(26, new p(2, 24)), new A(16, new p(4, 9))),
      new r(5, Int32Array.from([6, 30]), new A(26, new p(1, 108)), new A(24, new p(2, 43)), new A(18, new p(2, 15), new p(2, 16)), new A(22, new p(2, 11), new p(2, 12))),
      new r(6, Int32Array.from([6, 34]), new A(18, new p(2, 68)), new A(16, new p(4, 27)), new A(24, new p(4, 19)), new A(28, new p(4, 15))),
      new r(7, Int32Array.from([6, 22, 38]), new A(20, new p(2, 78)), new A(18, new p(4, 31)), new A(18, new p(2, 14), new p(4, 15)), new A(26, new p(4, 13), new p(1, 14))),
      new r(8, Int32Array.from([6, 24, 42]), new A(24, new p(2, 97)), new A(22, new p(2, 38), new p(2, 39)), new A(22, new p(4, 18), new p(2, 19)), new A(26, new p(4, 14), new p(2, 15))),
      new r(9, Int32Array.from([6, 26, 46]), new A(30, new p(2, 116)), new A(22, new p(3, 36), new p(2, 37)), new A(20, new p(4, 16), new p(4, 17)), new A(24, new p(4, 12), new p(4, 13))),
      new r(10, Int32Array.from([6, 28, 50]), new A(18, new p(2, 68), new p(2, 69)), new A(26, new p(4, 43), new p(1, 44)), new A(24, new p(6, 19), new p(2, 20)), new A(28, new p(6, 15), new p(2, 16))),
      new r(11, Int32Array.from([6, 30, 54]), new A(20, new p(4, 81)), new A(30, new p(1, 50), new p(4, 51)), new A(28, new p(4, 22), new p(4, 23)), new A(24, new p(3, 12), new p(8, 13))),
      new r(12, Int32Array.from([6, 32, 58]), new A(24, new p(2, 92), new p(2, 93)), new A(22, new p(6, 36), new p(2, 37)), new A(26, new p(4, 20), new p(6, 21)), new A(28, new p(7, 14), new p(4, 15))),
      new r(13, Int32Array.from([6, 34, 62]), new A(26, new p(4, 107)), new A(22, new p(8, 37), new p(1, 38)), new A(24, new p(8, 20), new p(4, 21)), new A(22, new p(12, 11), new p(4, 12))),
      new r(14, Int32Array.from([6, 26, 46, 66]), new A(30, new p(3, 115), new p(1, 116)), new A(24, new p(4, 40), new p(5, 41)), new A(20, new p(11, 16), new p(5, 17)), new A(24, new p(11, 12), new p(5, 13))),
      new r(15, Int32Array.from([6, 26, 48, 70]), new A(22, new p(5, 87), new p(1, 88)), new A(24, new p(5, 41), new p(5, 42)), new A(30, new p(5, 24), new p(7, 25)), new A(24, new p(11, 12), new p(7, 13))),
      new r(16, Int32Array.from([6, 26, 50, 74]), new A(24, new p(5, 98), new p(1, 99)), new A(28, new p(7, 45), new p(3, 46)), new A(24, new p(15, 19), new p(2, 20)), new A(30, new p(3, 15), new p(13, 16))),
      new r(17, Int32Array.from([6, 30, 54, 78]), new A(28, new p(1, 107), new p(5, 108)), new A(28, new p(10, 46), new p(1, 47)), new A(28, new p(1, 22), new p(15, 23)), new A(28, new p(2, 14), new p(17, 15))),
      new r(18, Int32Array.from([6, 30, 56, 82]), new A(30, new p(5, 120), new p(1, 121)), new A(26, new p(9, 43), new p(4, 44)), new A(28, new p(17, 22), new p(1, 23)), new A(28, new p(2, 14), new p(19, 15))),
      new r(19, Int32Array.from([6, 30, 58, 86]), new A(28, new p(3, 113), new p(4, 114)), new A(26, new p(3, 44), new p(11, 45)), new A(26, new p(17, 21), new p(4, 22)), new A(26, new p(9, 13), new p(16, 14))),
      new r(20, Int32Array.from([6, 34, 62, 90]), new A(28, new p(3, 107), new p(5, 108)), new A(26, new p(3, 41), new p(13, 42)), new A(30, new p(15, 24), new p(5, 25)), new A(28, new p(15, 15), new p(10, 16))),
      new r(21, Int32Array.from([6, 28, 50, 72, 94]), new A(28, new p(4, 116), new p(4, 117)), new A(26, new p(17, 42)), new A(28, new p(17, 22), new p(6, 23)), new A(30, new p(19, 16), new p(6, 17))),
      new r(22, Int32Array.from([6, 26, 50, 74, 98]), new A(28, new p(2, 111), new p(7, 112)), new A(28, new p(17, 46)), new A(30, new p(7, 24), new p(16, 25)), new A(24, new p(34, 13))),
      new r(23, Int32Array.from([6, 30, 54, 78, 102]), new A(30, new p(4, 121), new p(5, 122)), new A(28, new p(4, 47), new p(14, 48)), new A(30, new p(11, 24), new p(14, 25)), new A(30, new p(16, 15), new p(14, 16))),
      new r(24, Int32Array.from([6, 28, 54, 80, 106]), new A(30, new p(6, 117), new p(4, 118)), new A(28, new p(6, 45), new p(14, 46)), new A(30, new p(11, 24), new p(16, 25)), new A(30, new p(30, 16), new p(2, 17))),
      new r(25, Int32Array.from([6, 32, 58, 84, 110]), new A(26, new p(8, 106), new p(4, 107)), new A(28, new p(8, 47), new p(13, 48)), new A(30, new p(7, 24), new p(22, 25)), new A(30, new p(22, 15), new p(13, 16))),
      new r(26, Int32Array.from([6, 30, 58, 86, 114]), new A(28, new p(10, 114), new p(2, 115)), new A(28, new p(19, 46), new p(4, 47)), new A(28, new p(28, 22), new p(6, 23)), new A(30, new p(33, 16), new p(4, 17))),
      new r(27, Int32Array.from([6, 34, 62, 90, 118]), new A(30, new p(8, 122), new p(4, 123)), new A(28, new p(22, 45), new p(3, 46)), new A(30, new p(8, 23), new p(26, 24)), new A(30, new p(12, 15), new p(28, 16))),
      new r(28, Int32Array.from([6, 26, 50, 74, 98, 122]), new A(30, new p(3, 117), new p(10, 118)), new A(28, new p(3, 45), new p(23, 46)), new A(30, new p(4, 24), new p(31, 25)), new A(30, new p(11, 15), new p(31, 16))),
      new r(29, Int32Array.from([6, 30, 54, 78, 102, 126]), new A(30, new p(7, 116), new p(7, 117)), new A(28, new p(21, 45), new p(7, 46)), new A(30, new p(1, 23), new p(37, 24)), new A(30, new p(19, 15), new p(26, 16))),
      new r(30, Int32Array.from([6, 26, 52, 78, 104, 130]), new A(30, new p(5, 115), new p(10, 116)), new A(28, new p(19, 47), new p(10, 48)), new A(30, new p(15, 24), new p(25, 25)), new A(30, new p(23, 15), new p(25, 16))),
      new r(31, Int32Array.from([6, 30, 56, 82, 108, 134]), new A(30, new p(13, 115), new p(3, 116)), new A(28, new p(2, 46), new p(29, 47)), new A(30, new p(42, 24), new p(1, 25)), new A(30, new p(23, 15), new p(28, 16))),
      new r(32, Int32Array.from([6, 34, 60, 86, 112, 138]), new A(30, new p(17, 115)), new A(28, new p(10, 46), new p(23, 47)), new A(30, new p(10, 24), new p(35, 25)), new A(30, new p(19, 15), new p(35, 16))),
      new r(33, Int32Array.from([6, 30, 58, 86, 114, 142]), new A(30, new p(17, 115), new p(1, 116)), new A(28, new p(14, 46), new p(21, 47)), new A(30, new p(29, 24), new p(19, 25)), new A(30, new p(11, 15), new p(46, 16))),
      new r(34, Int32Array.from([6, 34, 62, 90, 118, 146]), new A(30, new p(13, 115), new p(6, 116)), new A(28, new p(14, 46), new p(23, 47)), new A(30, new p(44, 24), new p(7, 25)), new A(30, new p(59, 16), new p(1, 17))),
      new r(35, Int32Array.from([6, 30, 54, 78, 102, 126, 150]), new A(30, new p(12, 121), new p(7, 122)), new A(28, new p(12, 47), new p(26, 48)), new A(30, new p(39, 24), new p(14, 25)), new A(30, new p(22, 15), new p(41, 16))),
      new r(36, Int32Array.from([6, 24, 50, 76, 102, 128, 154]), new A(30, new p(6, 121), new p(14, 122)), new A(28, new p(6, 47), new p(34, 48)), new A(30, new p(46, 24), new p(10, 25)), new A(30, new p(2, 15), new p(64, 16))),
      new r(37, Int32Array.from([6, 28, 54, 80, 106, 132, 158]), new A(30, new p(17, 122), new p(4, 123)), new A(28, new p(29, 46), new p(14, 47)), new A(30, new p(49, 24), new p(10, 25)), new A(30, new p(24, 15), new p(46, 16))),
      new r(38, Int32Array.from([6, 32, 58, 84, 110, 136, 162]), new A(30, new p(4, 122), new p(18, 123)), new A(28, new p(13, 46), new p(32, 47)), new A(30, new p(48, 24), new p(14, 25)), new A(30, new p(42, 15), new p(32, 16))),
      new r(39, Int32Array.from([6, 26, 54, 82, 110, 138, 166]), new A(30, new p(20, 117), new p(4, 118)), new A(28, new p(40, 47), new p(7, 48)), new A(30, new p(43, 24), new p(22, 25)), new A(30, new p(10, 15), new p(67, 16))),
      new r(40, Int32Array.from([6, 30, 58, 86, 114, 142, 170]), new A(30, new p(19, 118), new p(6, 119)), new A(28, new p(18, 47), new p(31, 48)), new A(30, new p(34, 24), new p(34, 25)), new A(30, new p(20, 15), new p(61, 16)))
    ], r;
  }()
), st;
(function(r) {
  r[r.DATA_MASK_000 = 0] = "DATA_MASK_000", r[r.DATA_MASK_001 = 1] = "DATA_MASK_001", r[r.DATA_MASK_010 = 2] = "DATA_MASK_010", r[r.DATA_MASK_011 = 3] = "DATA_MASK_011", r[r.DATA_MASK_100 = 4] = "DATA_MASK_100", r[r.DATA_MASK_101 = 5] = "DATA_MASK_101", r[r.DATA_MASK_110 = 6] = "DATA_MASK_110", r[r.DATA_MASK_111 = 7] = "DATA_MASK_111";
})(st || (st = {}));
var gr = (
  /** @class */
  function() {
    function r(t, e) {
      this.value = t, this.isMasked = e;
    }
    return r.prototype.unmaskBitMatrix = function(t, e) {
      for (var n = 0; n < e; n++)
        for (var i = 0; i < e; i++)
          this.isMasked(n, i) && t.flip(i, n);
    }, r.values = /* @__PURE__ */ new Map([
      /**
       * 000: mask bits for which (x + y) mod 2 == 0
       */
      [st.DATA_MASK_000, new r(st.DATA_MASK_000, function(t, e) {
        return (t + e & 1) === 0;
      })],
      /**
       * 001: mask bits for which x mod 2 == 0
       */
      [st.DATA_MASK_001, new r(st.DATA_MASK_001, function(t, e) {
        return (t & 1) === 0;
      })],
      /**
       * 010: mask bits for which y mod 3 == 0
       */
      [st.DATA_MASK_010, new r(st.DATA_MASK_010, function(t, e) {
        return e % 3 === 0;
      })],
      /**
       * 011: mask bits for which (x + y) mod 3 == 0
       */
      [st.DATA_MASK_011, new r(st.DATA_MASK_011, function(t, e) {
        return (t + e) % 3 === 0;
      })],
      /**
       * 100: mask bits for which (x/2 + y/3) mod 2 == 0
       */
      [st.DATA_MASK_100, new r(st.DATA_MASK_100, function(t, e) {
        return (Math.floor(t / 2) + Math.floor(e / 3) & 1) === 0;
      })],
      /**
       * 101: mask bits for which xy mod 2 + xy mod 3 == 0
       * equivalently, such that xy mod 6 == 0
       */
      [st.DATA_MASK_101, new r(st.DATA_MASK_101, function(t, e) {
        return t * e % 6 === 0;
      })],
      /**
       * 110: mask bits for which (xy mod 2 + xy mod 3) mod 2 == 0
       * equivalently, such that xy mod 6 < 3
       */
      [st.DATA_MASK_110, new r(st.DATA_MASK_110, function(t, e) {
        return t * e % 6 < 3;
      })],
      /**
       * 111: mask bits for which ((x+y)mod 2 + xy mod 3) mod 2 == 0
       * equivalently, such that (x + y + xy mod 3) mod 2 == 0
       */
      [st.DATA_MASK_111, new r(st.DATA_MASK_111, function(t, e) {
        return (t + e + t * e % 3 & 1) === 0;
      })]
    ]), r;
  }()
), Wi = (
  /** @class */
  function() {
    function r(t) {
      var e = t.getHeight();
      if (e < 21 || (e & 3) !== 1)
        throw new T();
      this.bitMatrix = t;
    }
    return r.prototype.readFormatInformation = function() {
      if (this.parsedFormatInfo !== null && this.parsedFormatInfo !== void 0)
        return this.parsedFormatInfo;
      for (var t = 0, e = 0; e < 6; e++)
        t = this.copyBit(e, 8, t);
      t = this.copyBit(7, 8, t), t = this.copyBit(8, 8, t), t = this.copyBit(8, 7, t);
      for (var n = 5; n >= 0; n--)
        t = this.copyBit(8, n, t);
      for (var i = this.bitMatrix.getHeight(), a = 0, o = i - 7, n = i - 1; n >= o; n--)
        a = this.copyBit(8, n, a);
      for (var e = i - 8; e < i; e++)
        a = this.copyBit(e, 8, a);
      if (this.parsedFormatInfo = Xr.decodeFormatInformation(t, a), this.parsedFormatInfo !== null)
        return this.parsedFormatInfo;
      throw new T();
    }, r.prototype.readVersion = function() {
      if (this.parsedVersion !== null && this.parsedVersion !== void 0)
        return this.parsedVersion;
      var t = this.bitMatrix.getHeight(), e = Math.floor((t - 17) / 4);
      if (e <= 6)
        return Gt.getVersionForNumber(e);
      for (var n = 0, i = t - 11, a = 5; a >= 0; a--)
        for (var o = t - 9; o >= i; o--)
          n = this.copyBit(o, a, n);
      var f = Gt.decodeVersionInformation(n);
      if (f !== null && f.getDimensionForVersion() === t)
        return this.parsedVersion = f, f;
      n = 0;
      for (var o = 5; o >= 0; o--)
        for (var a = t - 9; a >= i; a--)
          n = this.copyBit(o, a, n);
      if (f = Gt.decodeVersionInformation(n), f !== null && f.getDimensionForVersion() === t)
        return this.parsedVersion = f, f;
      throw new T();
    }, r.prototype.copyBit = function(t, e, n) {
      var i = this.isMirror ? this.bitMatrix.get(e, t) : this.bitMatrix.get(t, e);
      return i ? n << 1 | 1 : n << 1;
    }, r.prototype.readCodewords = function() {
      var t = this.readFormatInformation(), e = this.readVersion(), n = gr.values.get(t.getDataMask()), i = this.bitMatrix.getHeight();
      n.unmaskBitMatrix(this.bitMatrix, i);
      for (var a = e.buildFunctionPattern(), o = !0, f = new Uint8Array(e.getTotalCodewords()), s = 0, u = 0, c = 0, l = i - 1; l > 0; l -= 2) {
        l === 6 && l--;
        for (var h = 0; h < i; h++)
          for (var d = o ? i - 1 - h : h, v = 0; v < 2; v++)
            a.get(l - v, d) || (c++, u <<= 1, this.bitMatrix.get(l - v, d) && (u |= 1), c === 8 && (f[s++] = /*(byte) */
            u, c = 0, u = 0));
        o = !o;
      }
      if (s !== e.getTotalCodewords())
        throw new T();
      return f;
    }, r.prototype.remask = function() {
      if (this.parsedFormatInfo !== null) {
        var t = gr.values[this.parsedFormatInfo.getDataMask()], e = this.bitMatrix.getHeight();
        t.unmaskBitMatrix(this.bitMatrix, e);
      }
    }, r.prototype.setMirror = function(t) {
      this.parsedVersion = null, this.parsedFormatInfo = null, this.isMirror = t;
    }, r.prototype.mirror = function() {
      for (var t = this.bitMatrix, e = 0, n = t.getWidth(); e < n; e++)
        for (var i = e + 1, a = t.getHeight(); i < a; i++)
          t.get(e, i) !== t.get(i, e) && (t.flip(i, e), t.flip(e, i));
    }, r;
  }()
), xr = globalThis && globalThis.__values || function(r) {
  var t = typeof Symbol == "function" && Symbol.iterator, e = t && r[t], n = 0;
  if (e)
    return e.call(r);
  if (r && typeof r.length == "number")
    return {
      next: function() {
        return r && n >= r.length && (r = void 0), { value: r && r[n++], done: !r };
      }
    };
  throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, zi = (
  /** @class */
  function() {
    function r(t, e) {
      this.numDataCodewords = t, this.codewords = e;
    }
    return r.getDataBlocks = function(t, e, n) {
      var i, a, o, f;
      if (t.length !== e.getTotalCodewords())
        throw new D();
      var s = e.getECBlocksForLevel(n), u = 0, c = s.getECBlocks();
      try {
        for (var l = xr(c), h = l.next(); !h.done; h = l.next()) {
          var d = h.value;
          u += d.getCount();
        }
      } catch (K) {
        i = { error: K };
      } finally {
        try {
          h && !h.done && (a = l.return) && a.call(l);
        } finally {
          if (i)
            throw i.error;
        }
      }
      var v = new Array(u), g = 0;
      try {
        for (var x = xr(c), w = x.next(); !w.done; w = x.next())
          for (var d = w.value, y = 0; y < d.getCount(); y++) {
            var _ = d.getDataCodewords(), E = s.getECCodewordsPerBlock() + _;
            v[g++] = new r(_, new Uint8Array(E));
          }
      } catch (K) {
        o = { error: K };
      } finally {
        try {
          w && !w.done && (f = x.return) && f.call(x);
        } finally {
          if (o)
            throw o.error;
        }
      }
      for (var m = v[0].codewords.length, I = v.length - 1; I >= 0; ) {
        var S = v[I].codewords.length;
        if (S === m)
          break;
        I--;
      }
      I++;
      for (var b = m - s.getECCodewordsPerBlock(), P = 0, y = 0; y < b; y++)
        for (var R = 0; R < g; R++)
          v[R].codewords[y] = t[P++];
      for (var R = I; R < g; R++)
        v[R].codewords[b] = t[P++];
      for (var J = v[0].codewords.length, y = b; y < J; y++)
        for (var R = 0; R < g; R++) {
          var L = R < I ? y : y + 1;
          v[R].codewords[L] = t[P++];
        }
      return v;
    }, r.prototype.getNumDataCodewords = function() {
      return this.numDataCodewords;
    }, r.prototype.getCodewords = function() {
      return this.codewords;
    }, r;
  }()
), Ct;
(function(r) {
  r[r.TERMINATOR = 0] = "TERMINATOR", r[r.NUMERIC = 1] = "NUMERIC", r[r.ALPHANUMERIC = 2] = "ALPHANUMERIC", r[r.STRUCTURED_APPEND = 3] = "STRUCTURED_APPEND", r[r.BYTE = 4] = "BYTE", r[r.ECI = 5] = "ECI", r[r.KANJI = 6] = "KANJI", r[r.FNC1_FIRST_POSITION = 7] = "FNC1_FIRST_POSITION", r[r.FNC1_SECOND_POSITION = 8] = "FNC1_SECOND_POSITION", r[r.HANZI = 9] = "HANZI";
})(Ct || (Ct = {}));
var Z = (
  /** @class */
  function() {
    function r(t, e, n, i) {
      this.value = t, this.stringValue = e, this.characterCountBitsForVersions = n, this.bits = i, r.FOR_BITS.set(i, this), r.FOR_VALUE.set(t, this);
    }
    return r.forBits = function(t) {
      var e = r.FOR_BITS.get(t);
      if (e === void 0)
        throw new D();
      return e;
    }, r.prototype.getCharacterCountBits = function(t) {
      var e = t.getVersionNumber(), n;
      return e <= 9 ? n = 0 : e <= 26 ? n = 1 : n = 2, this.characterCountBitsForVersions[n];
    }, r.prototype.getValue = function() {
      return this.value;
    }, r.prototype.getBits = function() {
      return this.bits;
    }, r.prototype.equals = function(t) {
      if (!(t instanceof r))
        return !1;
      var e = t;
      return this.value === e.value;
    }, r.prototype.toString = function() {
      return this.stringValue;
    }, r.FOR_BITS = /* @__PURE__ */ new Map(), r.FOR_VALUE = /* @__PURE__ */ new Map(), r.TERMINATOR = new r(Ct.TERMINATOR, "TERMINATOR", Int32Array.from([0, 0, 0]), 0), r.NUMERIC = new r(Ct.NUMERIC, "NUMERIC", Int32Array.from([10, 12, 14]), 1), r.ALPHANUMERIC = new r(Ct.ALPHANUMERIC, "ALPHANUMERIC", Int32Array.from([9, 11, 13]), 2), r.STRUCTURED_APPEND = new r(Ct.STRUCTURED_APPEND, "STRUCTURED_APPEND", Int32Array.from([0, 0, 0]), 3), r.BYTE = new r(Ct.BYTE, "BYTE", Int32Array.from([8, 16, 16]), 4), r.ECI = new r(Ct.ECI, "ECI", Int32Array.from([0, 0, 0]), 7), r.KANJI = new r(Ct.KANJI, "KANJI", Int32Array.from([8, 10, 12]), 8), r.FNC1_FIRST_POSITION = new r(Ct.FNC1_FIRST_POSITION, "FNC1_FIRST_POSITION", Int32Array.from([0, 0, 0]), 5), r.FNC1_SECOND_POSITION = new r(Ct.FNC1_SECOND_POSITION, "FNC1_SECOND_POSITION", Int32Array.from([0, 0, 0]), 9), r.HANZI = new r(Ct.HANZI, "HANZI", Int32Array.from([8, 10, 12]), 13), r;
  }()
), ji = (
  /** @class */
  function() {
    function r() {
    }
    return r.decode = function(t, e, n, i) {
      var a = new Gr(t), o = new M(), f = new Array(), s = -1, u = -1;
      try {
        var c = null, l = !1, h = void 0;
        do {
          if (a.available() < 4)
            h = Z.TERMINATOR;
          else {
            var d = a.readBits(4);
            h = Z.forBits(d);
          }
          switch (h) {
            case Z.TERMINATOR:
              break;
            case Z.FNC1_FIRST_POSITION:
            case Z.FNC1_SECOND_POSITION:
              l = !0;
              break;
            case Z.STRUCTURED_APPEND:
              if (a.available() < 16)
                throw new T();
              s = a.readBits(8), u = a.readBits(8);
              break;
            case Z.ECI:
              var v = r.parseECIValue(a);
              if (c = at.getCharacterSetECIByValue(v), c === null)
                throw new T();
              break;
            case Z.HANZI:
              var g = a.readBits(4), x = a.readBits(h.getCharacterCountBits(e));
              g === r.GB2312_SUBSET && r.decodeHanziSegment(a, o, x);
              break;
            default:
              var w = a.readBits(h.getCharacterCountBits(e));
              switch (h) {
                case Z.NUMERIC:
                  r.decodeNumericSegment(a, o, w);
                  break;
                case Z.ALPHANUMERIC:
                  r.decodeAlphanumericSegment(a, o, w, l);
                  break;
                case Z.BYTE:
                  r.decodeByteSegment(a, o, w, c, f, i);
                  break;
                case Z.KANJI:
                  r.decodeKanjiSegment(a, o, w);
                  break;
                default:
                  throw new T();
              }
              break;
          }
        } while (h !== Z.TERMINATOR);
      } catch {
        throw new T();
      }
      return new we(t, o.toString(), f.length === 0 ? null : f, n === null ? null : n.toString(), s, u);
    }, r.decodeHanziSegment = function(t, e, n) {
      if (n * 13 > t.available())
        throw new T();
      for (var i = new Uint8Array(2 * n), a = 0; n > 0; ) {
        var o = t.readBits(13), f = o / 96 << 8 & 4294967295 | o % 96;
        f < 959 ? f += 41377 : f += 42657, i[a] = /*(byte) */
        f >> 8 & 255, i[a + 1] = /*(byte) */
        f & 255, a += 2, n--;
      }
      try {
        e.append(It.decode(i, F.GB2312));
      } catch (s) {
        throw new T(s);
      }
    }, r.decodeKanjiSegment = function(t, e, n) {
      if (n * 13 > t.available())
        throw new T();
      for (var i = new Uint8Array(2 * n), a = 0; n > 0; ) {
        var o = t.readBits(13), f = o / 192 << 8 & 4294967295 | o % 192;
        f < 7936 ? f += 33088 : f += 49472, i[a] = /*(byte) */
        f >> 8, i[a + 1] = /*(byte) */
        f, a += 2, n--;
      }
      try {
        e.append(It.decode(i, F.SHIFT_JIS));
      } catch (s) {
        throw new T(s);
      }
    }, r.decodeByteSegment = function(t, e, n, i, a, o) {
      if (8 * n > t.available())
        throw new T();
      for (var f = new Uint8Array(n), s = 0; s < n; s++)
        f[s] = /*(byte) */
        t.readBits(8);
      var u;
      i === null ? u = F.guessEncoding(f, o) : u = i.getName();
      try {
        e.append(It.decode(f, u));
      } catch (c) {
        throw new T(c);
      }
      a.push(f);
    }, r.toAlphaNumericChar = function(t) {
      if (t >= r.ALPHANUMERIC_CHARS.length)
        throw new T();
      return r.ALPHANUMERIC_CHARS[t];
    }, r.decodeAlphanumericSegment = function(t, e, n, i) {
      for (var a = e.length(); n > 1; ) {
        if (t.available() < 11)
          throw new T();
        var o = t.readBits(11);
        e.append(r.toAlphaNumericChar(Math.floor(o / 45))), e.append(r.toAlphaNumericChar(o % 45)), n -= 2;
      }
      if (n === 1) {
        if (t.available() < 6)
          throw new T();
        e.append(r.toAlphaNumericChar(t.readBits(6)));
      }
      if (i)
        for (var f = a; f < e.length(); f++)
          e.charAt(f) === "%" && (f < e.length() - 1 && e.charAt(f + 1) === "%" ? e.deleteCharAt(f + 1) : e.setCharAt(f, String.fromCharCode(29)));
    }, r.decodeNumericSegment = function(t, e, n) {
      for (; n >= 3; ) {
        if (t.available() < 10)
          throw new T();
        var i = t.readBits(10);
        if (i >= 1e3)
          throw new T();
        e.append(r.toAlphaNumericChar(Math.floor(i / 100))), e.append(r.toAlphaNumericChar(Math.floor(i / 10) % 10)), e.append(r.toAlphaNumericChar(i % 10)), n -= 3;
      }
      if (n === 2) {
        if (t.available() < 7)
          throw new T();
        var a = t.readBits(7);
        if (a >= 100)
          throw new T();
        e.append(r.toAlphaNumericChar(Math.floor(a / 10))), e.append(r.toAlphaNumericChar(a % 10));
      } else if (n === 1) {
        if (t.available() < 4)
          throw new T();
        var o = t.readBits(4);
        if (o >= 10)
          throw new T();
        e.append(r.toAlphaNumericChar(o));
      }
    }, r.parseECIValue = function(t) {
      var e = t.readBits(8);
      if (!(e & 128))
        return e & 127;
      if ((e & 192) === 128) {
        var n = t.readBits(8);
        return (e & 63) << 8 & 4294967295 | n;
      }
      if ((e & 224) === 192) {
        var i = t.readBits(16);
        return (e & 31) << 16 & 4294967295 | i;
      }
      throw new T();
    }, r.ALPHANUMERIC_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:", r.GB2312_SUBSET = 1, r;
  }()
), Wr = (
  /** @class */
  function() {
    function r(t) {
      this.mirrored = t;
    }
    return r.prototype.isMirrored = function() {
      return this.mirrored;
    }, r.prototype.applyMirroredCorrection = function(t) {
      if (!(!this.mirrored || t === null || t.length < 3)) {
        var e = t[0];
        t[0] = t[2], t[2] = e;
      }
    }, r;
  }()
), yr = globalThis && globalThis.__values || function(r) {
  var t = typeof Symbol == "function" && Symbol.iterator, e = t && r[t], n = 0;
  if (e)
    return e.call(r);
  if (r && typeof r.length == "number")
    return {
      next: function() {
        return r && n >= r.length && (r = void 0), { value: r && r[n++], done: !r };
      }
    };
  throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, Yi = (
  /** @class */
  function() {
    function r() {
      this.rsDecoder = new _e(_t.QR_CODE_FIELD_256);
    }
    return r.prototype.decodeBooleanArray = function(t, e) {
      return this.decodeBitMatrix(Nt.parseFromBooleanArray(t), e);
    }, r.prototype.decodeBitMatrix = function(t, e) {
      var n = new Wi(t), i = null;
      try {
        return this.decodeBitMatrixParser(n, e);
      } catch (o) {
        i = o;
      }
      try {
        n.remask(), n.setMirror(!0), n.readVersion(), n.readFormatInformation(), n.mirror();
        var a = this.decodeBitMatrixParser(n, e);
        return a.setOther(new Wr(!0)), a;
      } catch (o) {
        throw i !== null ? i : o;
      }
    }, r.prototype.decodeBitMatrixParser = function(t, e) {
      var n, i, a, o, f = t.readVersion(), s = t.readFormatInformation().getErrorCorrectionLevel(), u = t.readCodewords(), c = zi.getDataBlocks(u, f, s), l = 0;
      try {
        for (var h = yr(c), d = h.next(); !d.done; d = h.next()) {
          var v = d.value;
          l += v.getNumDataCodewords();
        }
      } catch (I) {
        n = { error: I };
      } finally {
        try {
          d && !d.done && (i = h.return) && i.call(h);
        } finally {
          if (n)
            throw n.error;
        }
      }
      var g = new Uint8Array(l), x = 0;
      try {
        for (var w = yr(c), y = w.next(); !y.done; y = w.next()) {
          var v = y.value, _ = v.getCodewords(), E = v.getNumDataCodewords();
          this.correctErrors(_, E);
          for (var m = 0; m < E; m++)
            g[x++] = _[m];
        }
      } catch (I) {
        a = { error: I };
      } finally {
        try {
          y && !y.done && (o = w.return) && o.call(w);
        } finally {
          if (a)
            throw a.error;
        }
      }
      return ji.decode(g, f, s, e);
    }, r.prototype.correctErrors = function(t, e) {
      var n = new Int32Array(t);
      try {
        this.rsDecoder.decode(n, t.length - e);
      } catch {
        throw new et();
      }
      for (var i = 0; i < e; i++)
        t[i] = /*(byte) */
        n[i];
    }, r;
  }()
), Zi = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), $i = (
  /** @class */
  function(r) {
    Zi(t, r);
    function t(e, n, i) {
      var a = r.call(this, e, n) || this;
      return a.estimatedModuleSize = i, a;
    }
    return t.prototype.aboutEquals = function(e, n, i) {
      if (Math.abs(n - this.getY()) <= e && Math.abs(i - this.getX()) <= e) {
        var a = Math.abs(e - this.estimatedModuleSize);
        return a <= 1 || a <= this.estimatedModuleSize;
      }
      return !1;
    }, t.prototype.combineEstimate = function(e, n, i) {
      var a = (this.getX() + n) / 2, o = (this.getY() + e) / 2, f = (this.estimatedModuleSize + i) / 2;
      return new t(a, o, f);
    }, t;
  }(O)
), Ki = globalThis && globalThis.__values || function(r) {
  var t = typeof Symbol == "function" && Symbol.iterator, e = t && r[t], n = 0;
  if (e)
    return e.call(r);
  if (r && typeof r.length == "number")
    return {
      next: function() {
        return r && n >= r.length && (r = void 0), { value: r && r[n++], done: !r };
      }
    };
  throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, qi = (
  /** @class */
  function() {
    function r(t, e, n, i, a, o, f) {
      this.image = t, this.startX = e, this.startY = n, this.width = i, this.height = a, this.moduleSize = o, this.resultPointCallback = f, this.possibleCenters = [], this.crossCheckStateCount = new Int32Array(3);
    }
    return r.prototype.find = function() {
      for (var t = this.startX, e = this.height, n = this.width, i = t + n, a = this.startY + e / 2, o = new Int32Array(3), f = this.image, s = 0; s < e; s++) {
        var u = a + (s & 1 ? -Math.floor((s + 1) / 2) : Math.floor((s + 1) / 2));
        o[0] = 0, o[1] = 0, o[2] = 0;
        for (var c = t; c < i && !f.get(c, u); )
          c++;
        for (var l = 0; c < i; ) {
          if (f.get(c, u))
            if (l === 1)
              o[1]++;
            else if (l === 2) {
              if (this.foundPatternCross(o)) {
                var h = this.handlePossibleCenter(o, u, c);
                if (h !== null)
                  return h;
              }
              o[0] = o[2], o[1] = 1, o[2] = 0, l = 1;
            } else
              o[++l]++;
          else
            l === 1 && l++, o[l]++;
          c++;
        }
        if (this.foundPatternCross(o)) {
          var h = this.handlePossibleCenter(o, u, i);
          if (h !== null)
            return h;
        }
      }
      if (this.possibleCenters.length !== 0)
        return this.possibleCenters[0];
      throw new C();
    }, r.centerFromEnd = function(t, e) {
      return e - t[2] - t[1] / 2;
    }, r.prototype.foundPatternCross = function(t) {
      for (var e = this.moduleSize, n = e / 2, i = 0; i < 3; i++)
        if (Math.abs(e - t[i]) >= n)
          return !1;
      return !0;
    }, r.prototype.crossCheckVertical = function(t, e, n, i) {
      var a = this.image, o = a.getHeight(), f = this.crossCheckStateCount;
      f[0] = 0, f[1] = 0, f[2] = 0;
      for (var s = t; s >= 0 && a.get(e, s) && f[1] <= n; )
        f[1]++, s--;
      if (s < 0 || f[1] > n)
        return NaN;
      for (; s >= 0 && !a.get(e, s) && f[0] <= n; )
        f[0]++, s--;
      if (f[0] > n)
        return NaN;
      for (s = t + 1; s < o && a.get(e, s) && f[1] <= n; )
        f[1]++, s++;
      if (s === o || f[1] > n)
        return NaN;
      for (; s < o && !a.get(e, s) && f[2] <= n; )
        f[2]++, s++;
      if (f[2] > n)
        return NaN;
      var u = f[0] + f[1] + f[2];
      return 5 * Math.abs(u - i) >= 2 * i ? NaN : this.foundPatternCross(f) ? r.centerFromEnd(f, s) : NaN;
    }, r.prototype.handlePossibleCenter = function(t, e, n) {
      var i, a, o = t[0] + t[1] + t[2], f = r.centerFromEnd(t, n), s = this.crossCheckVertical(
        e,
        /*(int) */
        f,
        2 * t[1],
        o
      );
      if (!isNaN(s)) {
        var u = (t[0] + t[1] + t[2]) / 3;
        try {
          for (var c = Ki(this.possibleCenters), l = c.next(); !l.done; l = c.next()) {
            var h = l.value;
            if (h.aboutEquals(u, s, f))
              return h.combineEstimate(s, f, u);
          }
        } catch (v) {
          i = { error: v };
        } finally {
          try {
            l && !l.done && (a = c.return) && a.call(c);
          } finally {
            if (i)
              throw i.error;
          }
        }
        var d = new $i(f, s, u);
        this.possibleCenters.push(d), this.resultPointCallback !== null && this.resultPointCallback !== void 0 && this.resultPointCallback.foundPossibleResultPoint(d);
      }
      return null;
    }, r;
  }()
), Qi = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), Ji = (
  /** @class */
  function(r) {
    Qi(t, r);
    function t(e, n, i, a) {
      var o = r.call(this, e, n) || this;
      return o.estimatedModuleSize = i, o.count = a, a === void 0 && (o.count = 1), o;
    }
    return t.prototype.getEstimatedModuleSize = function() {
      return this.estimatedModuleSize;
    }, t.prototype.getCount = function() {
      return this.count;
    }, t.prototype.aboutEquals = function(e, n, i) {
      if (Math.abs(n - this.getY()) <= e && Math.abs(i - this.getX()) <= e) {
        var a = Math.abs(e - this.estimatedModuleSize);
        return a <= 1 || a <= this.estimatedModuleSize;
      }
      return !1;
    }, t.prototype.combineEstimate = function(e, n, i) {
      var a = this.count + 1, o = (this.count * this.getX() + n) / a, f = (this.count * this.getY() + e) / a, s = (this.count * this.estimatedModuleSize + i) / a;
      return new t(o, f, s, a);
    }, t;
  }(O)
), ta = (
  /** @class */
  function() {
    function r(t) {
      this.bottomLeft = t[0], this.topLeft = t[1], this.topRight = t[2];
    }
    return r.prototype.getBottomLeft = function() {
      return this.bottomLeft;
    }, r.prototype.getTopLeft = function() {
      return this.topLeft;
    }, r.prototype.getTopRight = function() {
      return this.topRight;
    }, r;
  }()
), Qt = globalThis && globalThis.__values || function(r) {
  var t = typeof Symbol == "function" && Symbol.iterator, e = t && r[t], n = 0;
  if (e)
    return e.call(r);
  if (r && typeof r.length == "number")
    return {
      next: function() {
        return r && n >= r.length && (r = void 0), { value: r && r[n++], done: !r };
      }
    };
  throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, ea = (
  /** @class */
  function() {
    function r(t, e) {
      this.image = t, this.resultPointCallback = e, this.possibleCenters = [], this.crossCheckStateCount = new Int32Array(5), this.resultPointCallback = e;
    }
    return r.prototype.getImage = function() {
      return this.image;
    }, r.prototype.getPossibleCenters = function() {
      return this.possibleCenters;
    }, r.prototype.find = function(t) {
      var e = t != null && t.get($.TRY_HARDER) !== void 0, n = t != null && t.get($.PURE_BARCODE) !== void 0, i = this.image, a = i.getHeight(), o = i.getWidth(), f = Math.floor(3 * a / (4 * r.MAX_MODULES));
      (f < r.MIN_SKIP || e) && (f = r.MIN_SKIP);
      for (var s = !1, u = new Int32Array(5), c = f - 1; c < a && !s; c += f) {
        u[0] = 0, u[1] = 0, u[2] = 0, u[3] = 0, u[4] = 0;
        for (var l = 0, h = 0; h < o; h++)
          if (i.get(h, c))
            (l & 1) === 1 && l++, u[l]++;
          else if (l & 1)
            u[l]++;
          else if (l === 4)
            if (r.foundPatternCross(u)) {
              var d = this.handlePossibleCenter(u, c, h, n);
              if (d === !0)
                if (f = 2, this.hasSkipped === !0)
                  s = this.haveMultiplyConfirmedCenters();
                else {
                  var v = this.findRowSkip();
                  v > u[2] && (c += v - u[2] - f, h = o - 1);
                }
              else {
                u[0] = u[2], u[1] = u[3], u[2] = u[4], u[3] = 1, u[4] = 0, l = 3;
                continue;
              }
              l = 0, u[0] = 0, u[1] = 0, u[2] = 0, u[3] = 0, u[4] = 0;
            } else
              u[0] = u[2], u[1] = u[3], u[2] = u[4], u[3] = 1, u[4] = 0, l = 3;
          else
            u[++l]++;
        if (r.foundPatternCross(u)) {
          var d = this.handlePossibleCenter(u, c, o, n);
          d === !0 && (f = u[0], this.hasSkipped && (s = this.haveMultiplyConfirmedCenters()));
        }
      }
      var g = this.selectBestPatterns();
      return O.orderBestPatterns(g), new ta(g);
    }, r.centerFromEnd = function(t, e) {
      return e - t[4] - t[3] - t[2] / 2;
    }, r.foundPatternCross = function(t) {
      for (var e = 0, n = 0; n < 5; n++) {
        var i = t[n];
        if (i === 0)
          return !1;
        e += i;
      }
      if (e < 7)
        return !1;
      var a = e / 7, o = a / 2;
      return Math.abs(a - t[0]) < o && Math.abs(a - t[1]) < o && Math.abs(3 * a - t[2]) < 3 * o && Math.abs(a - t[3]) < o && Math.abs(a - t[4]) < o;
    }, r.prototype.getCrossCheckStateCount = function() {
      var t = this.crossCheckStateCount;
      return t[0] = 0, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t;
    }, r.prototype.crossCheckDiagonal = function(t, e, n, i) {
      for (var a = this.getCrossCheckStateCount(), o = 0, f = this.image; t >= o && e >= o && f.get(e - o, t - o); )
        a[2]++, o++;
      if (t < o || e < o)
        return !1;
      for (; t >= o && e >= o && !f.get(e - o, t - o) && a[1] <= n; )
        a[1]++, o++;
      if (t < o || e < o || a[1] > n)
        return !1;
      for (; t >= o && e >= o && f.get(e - o, t - o) && a[0] <= n; )
        a[0]++, o++;
      if (a[0] > n)
        return !1;
      var s = f.getHeight(), u = f.getWidth();
      for (o = 1; t + o < s && e + o < u && f.get(e + o, t + o); )
        a[2]++, o++;
      if (t + o >= s || e + o >= u)
        return !1;
      for (; t + o < s && e + o < u && !f.get(e + o, t + o) && a[3] < n; )
        a[3]++, o++;
      if (t + o >= s || e + o >= u || a[3] >= n)
        return !1;
      for (; t + o < s && e + o < u && f.get(e + o, t + o) && a[4] < n; )
        a[4]++, o++;
      if (a[4] >= n)
        return !1;
      var c = a[0] + a[1] + a[2] + a[3] + a[4];
      return Math.abs(c - i) < 2 * i && r.foundPatternCross(a);
    }, r.prototype.crossCheckVertical = function(t, e, n, i) {
      for (var a = this.image, o = a.getHeight(), f = this.getCrossCheckStateCount(), s = t; s >= 0 && a.get(e, s); )
        f[2]++, s--;
      if (s < 0)
        return NaN;
      for (; s >= 0 && !a.get(e, s) && f[1] <= n; )
        f[1]++, s--;
      if (s < 0 || f[1] > n)
        return NaN;
      for (; s >= 0 && a.get(e, s) && f[0] <= n; )
        f[0]++, s--;
      if (f[0] > n)
        return NaN;
      for (s = t + 1; s < o && a.get(e, s); )
        f[2]++, s++;
      if (s === o)
        return NaN;
      for (; s < o && !a.get(e, s) && f[3] < n; )
        f[3]++, s++;
      if (s === o || f[3] >= n)
        return NaN;
      for (; s < o && a.get(e, s) && f[4] < n; )
        f[4]++, s++;
      if (f[4] >= n)
        return NaN;
      var u = f[0] + f[1] + f[2] + f[3] + f[4];
      return 5 * Math.abs(u - i) >= 2 * i ? NaN : r.foundPatternCross(f) ? r.centerFromEnd(f, s) : NaN;
    }, r.prototype.crossCheckHorizontal = function(t, e, n, i) {
      for (var a = this.image, o = a.getWidth(), f = this.getCrossCheckStateCount(), s = t; s >= 0 && a.get(s, e); )
        f[2]++, s--;
      if (s < 0)
        return NaN;
      for (; s >= 0 && !a.get(s, e) && f[1] <= n; )
        f[1]++, s--;
      if (s < 0 || f[1] > n)
        return NaN;
      for (; s >= 0 && a.get(s, e) && f[0] <= n; )
        f[0]++, s--;
      if (f[0] > n)
        return NaN;
      for (s = t + 1; s < o && a.get(s, e); )
        f[2]++, s++;
      if (s === o)
        return NaN;
      for (; s < o && !a.get(s, e) && f[3] < n; )
        f[3]++, s++;
      if (s === o || f[3] >= n)
        return NaN;
      for (; s < o && a.get(s, e) && f[4] < n; )
        f[4]++, s++;
      if (f[4] >= n)
        return NaN;
      var u = f[0] + f[1] + f[2] + f[3] + f[4];
      return 5 * Math.abs(u - i) >= i ? NaN : r.foundPatternCross(f) ? r.centerFromEnd(f, s) : NaN;
    }, r.prototype.handlePossibleCenter = function(t, e, n, i) {
      var a = t[0] + t[1] + t[2] + t[3] + t[4], o = r.centerFromEnd(t, n), f = this.crossCheckVertical(
        e,
        /*(int) */
        Math.floor(o),
        t[2],
        a
      );
      if (!isNaN(f) && (o = this.crossCheckHorizontal(
        /*(int) */
        Math.floor(o),
        /*(int) */
        Math.floor(f),
        t[2],
        a
      ), !isNaN(o) && (!i || this.crossCheckDiagonal(
        /*(int) */
        Math.floor(f),
        /*(int) */
        Math.floor(o),
        t[2],
        a
      )))) {
        for (var s = a / 7, u = !1, c = this.possibleCenters, l = 0, h = c.length; l < h; l++) {
          var d = c[l];
          if (d.aboutEquals(s, f, o)) {
            c[l] = d.combineEstimate(f, o, s), u = !0;
            break;
          }
        }
        if (!u) {
          var v = new Ji(o, f, s);
          c.push(v), this.resultPointCallback !== null && this.resultPointCallback !== void 0 && this.resultPointCallback.foundPossibleResultPoint(v);
        }
        return !0;
      }
      return !1;
    }, r.prototype.findRowSkip = function() {
      var t, e, n = this.possibleCenters.length;
      if (n <= 1)
        return 0;
      var i = null;
      try {
        for (var a = Qt(this.possibleCenters), o = a.next(); !o.done; o = a.next()) {
          var f = o.value;
          if (f.getCount() >= r.CENTER_QUORUM)
            if (i == null)
              i = f;
            else
              return this.hasSkipped = !0, /*(int) */
              Math.floor((Math.abs(i.getX() - f.getX()) - Math.abs(i.getY() - f.getY())) / 2);
        }
      } catch (s) {
        t = { error: s };
      } finally {
        try {
          o && !o.done && (e = a.return) && e.call(a);
        } finally {
          if (t)
            throw t.error;
        }
      }
      return 0;
    }, r.prototype.haveMultiplyConfirmedCenters = function() {
      var t, e, n, i, a = 0, o = 0, f = this.possibleCenters.length;
      try {
        for (var s = Qt(this.possibleCenters), u = s.next(); !u.done; u = s.next()) {
          var c = u.value;
          c.getCount() >= r.CENTER_QUORUM && (a++, o += c.getEstimatedModuleSize());
        }
      } catch (g) {
        t = { error: g };
      } finally {
        try {
          u && !u.done && (e = s.return) && e.call(s);
        } finally {
          if (t)
            throw t.error;
        }
      }
      if (a < 3)
        return !1;
      var l = o / f, h = 0;
      try {
        for (var d = Qt(this.possibleCenters), v = d.next(); !v.done; v = d.next()) {
          var c = v.value;
          h += Math.abs(c.getEstimatedModuleSize() - l);
        }
      } catch (g) {
        n = { error: g };
      } finally {
        try {
          v && !v.done && (i = d.return) && i.call(d);
        } finally {
          if (n)
            throw n.error;
        }
      }
      return h <= 0.05 * o;
    }, r.prototype.selectBestPatterns = function() {
      var t, e, n, i, a = this.possibleCenters.length;
      if (a < 3)
        throw new C();
      var o = this.possibleCenters, f;
      if (a > 3) {
        var s = 0, u = 0;
        try {
          for (var c = Qt(this.possibleCenters), l = c.next(); !l.done; l = c.next()) {
            var h = l.value, d = h.getEstimatedModuleSize();
            s += d, u += d * d;
          }
        } catch (m) {
          t = { error: m };
        } finally {
          try {
            l && !l.done && (e = c.return) && e.call(c);
          } finally {
            if (t)
              throw t.error;
          }
        }
        f = s / a;
        var v = Math.sqrt(u / a - f * f);
        o.sort(
          /**
           * <p>Orders by furthest from average</p>
           */
          // FurthestFromAverageComparator implements Comparator<FinderPattern>
          function(m, I) {
            var S = Math.abs(I.getEstimatedModuleSize() - f), b = Math.abs(m.getEstimatedModuleSize() - f);
            return S < b ? -1 : S > b ? 1 : 0;
          }
        );
        for (var g = Math.max(0.2 * f, v), x = 0; x < o.length && o.length > 3; x++) {
          var w = o[x];
          Math.abs(w.getEstimatedModuleSize() - f) > g && (o.splice(x, 1), x--);
        }
      }
      if (o.length > 3) {
        var s = 0;
        try {
          for (var y = Qt(o), _ = y.next(); !_.done; _ = y.next()) {
            var E = _.value;
            s += E.getEstimatedModuleSize();
          }
        } catch (I) {
          n = { error: I };
        } finally {
          try {
            _ && !_.done && (i = y.return) && i.call(y);
          } finally {
            if (n)
              throw n.error;
          }
        }
        f = s / o.length, o.sort(
          /**
           * <p>Orders by {@link FinderPattern#getCount()}, descending.</p>
           */
          // CenterComparator implements Comparator<FinderPattern>
          function(I, S) {
            if (S.getCount() === I.getCount()) {
              var b = Math.abs(S.getEstimatedModuleSize() - f), P = Math.abs(I.getEstimatedModuleSize() - f);
              return b < P ? 1 : b > P ? -1 : 0;
            } else
              return S.getCount() - I.getCount();
          }
        ), o.splice(3);
      }
      return [
        o[0],
        o[1],
        o[2]
      ];
    }, r.CENTER_QUORUM = 2, r.MIN_SKIP = 3, r.MAX_MODULES = 57, r;
  }()
), ra = (
  /** @class */
  function() {
    function r(t) {
      this.image = t;
    }
    return r.prototype.getImage = function() {
      return this.image;
    }, r.prototype.getResultPointCallback = function() {
      return this.resultPointCallback;
    }, r.prototype.detect = function(t) {
      this.resultPointCallback = t == null ? null : (
        /*(ResultPointCallback) */
        t.get($.NEED_RESULT_POINT_CALLBACK)
      );
      var e = new ea(this.image, this.resultPointCallback), n = e.find(t);
      return this.processFinderPatternInfo(n);
    }, r.prototype.processFinderPatternInfo = function(t) {
      var e = t.getTopLeft(), n = t.getTopRight(), i = t.getBottomLeft(), a = this.calculateModuleSize(e, n, i);
      if (a < 1)
        throw new C("No pattern found in proccess finder.");
      var o = r.computeDimension(e, n, i, a), f = Gt.getProvisionalVersionForDimension(o), s = f.getDimensionForVersion() - 7, u = null;
      if (f.getAlignmentPatternCenters().length > 0)
        for (var c = n.getX() - e.getX() + i.getX(), l = n.getY() - e.getY() + i.getY(), h = 1 - 3 / s, d = (
          /*(int) */
          Math.floor(e.getX() + h * (c - e.getX()))
        ), v = (
          /*(int) */
          Math.floor(e.getY() + h * (l - e.getY()))
        ), g = 4; g <= 16; g <<= 1)
          try {
            u = this.findAlignmentInRegion(a, d, v, g);
            break;
          } catch (_) {
            if (!(_ instanceof C))
              throw _;
          }
      var x = r.createTransform(e, n, i, u, o), w = r.sampleGrid(this.image, x, o), y;
      return u === null ? y = [i, e, n] : y = [i, e, n, u], new je(w, y);
    }, r.createTransform = function(t, e, n, i, a) {
      var o = a - 3.5, f, s, u, c;
      return i !== null ? (f = i.getX(), s = i.getY(), u = o - 3, c = u) : (f = e.getX() - t.getX() + n.getX(), s = e.getY() - t.getY() + n.getY(), u = o, c = o), kr.quadrilateralToQuadrilateral(3.5, 3.5, o, 3.5, u, c, 3.5, o, t.getX(), t.getY(), e.getX(), e.getY(), f, s, n.getX(), n.getY());
    }, r.sampleGrid = function(t, e, n) {
      var i = Ye.getInstance();
      return i.sampleGridWithTransform(t, n, n, e);
    }, r.computeDimension = function(t, e, n, i) {
      var a = U.round(O.distance(t, e) / i), o = U.round(O.distance(t, n) / i), f = Math.floor((a + o) / 2) + 7;
      switch (f & 3) {
        case 0:
          f++;
          break;
        case 2:
          f--;
          break;
        case 3:
          throw new C("Dimensions could be not found.");
      }
      return f;
    }, r.prototype.calculateModuleSize = function(t, e, n) {
      return (this.calculateModuleSizeOneWay(t, e) + this.calculateModuleSizeOneWay(t, n)) / 2;
    }, r.prototype.calculateModuleSizeOneWay = function(t, e) {
      var n = this.sizeOfBlackWhiteBlackRunBothWays(
        /*(int) */
        Math.floor(t.getX()),
        /*(int) */
        Math.floor(t.getY()),
        /*(int) */
        Math.floor(e.getX()),
        /*(int) */
        Math.floor(e.getY())
      ), i = this.sizeOfBlackWhiteBlackRunBothWays(
        /*(int) */
        Math.floor(e.getX()),
        /*(int) */
        Math.floor(e.getY()),
        /*(int) */
        Math.floor(t.getX()),
        /*(int) */
        Math.floor(t.getY())
      );
      return isNaN(n) ? i / 7 : isNaN(i) ? n / 7 : (n + i) / 14;
    }, r.prototype.sizeOfBlackWhiteBlackRunBothWays = function(t, e, n, i) {
      var a = this.sizeOfBlackWhiteBlackRun(t, e, n, i), o = 1, f = t - (n - t);
      f < 0 ? (o = t / /*(float) */
      (t - f), f = 0) : f >= this.image.getWidth() && (o = (this.image.getWidth() - 1 - t) / /*(float) */
      (f - t), f = this.image.getWidth() - 1);
      var s = (
        /*(int) */
        Math.floor(e - (i - e) * o)
      );
      return o = 1, s < 0 ? (o = e / /*(float) */
      (e - s), s = 0) : s >= this.image.getHeight() && (o = (this.image.getHeight() - 1 - e) / /*(float) */
      (s - e), s = this.image.getHeight() - 1), f = /*(int) */
      Math.floor(t + (f - t) * o), a += this.sizeOfBlackWhiteBlackRun(t, e, f, s), a - 1;
    }, r.prototype.sizeOfBlackWhiteBlackRun = function(t, e, n, i) {
      var a = Math.abs(i - e) > Math.abs(n - t);
      if (a) {
        var o = t;
        t = e, e = o, o = n, n = i, i = o;
      }
      for (var f = Math.abs(n - t), s = Math.abs(i - e), u = -f / 2, c = t < n ? 1 : -1, l = e < i ? 1 : -1, h = 0, d = n + c, v = t, g = e; v !== d; v += c) {
        var x = a ? g : v, w = a ? v : g;
        if (h === 1 === this.image.get(x, w)) {
          if (h === 2)
            return U.distance(v, g, t, e);
          h++;
        }
        if (u += s, u > 0) {
          if (g === i)
            break;
          g += l, u -= f;
        }
      }
      return h === 2 ? U.distance(n + c, i, t, e) : NaN;
    }, r.prototype.findAlignmentInRegion = function(t, e, n, i) {
      var a = (
        /*(int) */
        Math.floor(i * t)
      ), o = Math.max(0, e - a), f = Math.min(this.image.getWidth() - 1, e + a);
      if (f - o < t * 3)
        throw new C("Alignment top exceeds estimated module size.");
      var s = Math.max(0, n - a), u = Math.min(this.image.getHeight() - 1, n + a);
      if (u - s < t * 3)
        throw new C("Alignment bottom exceeds estimated module size.");
      var c = new qi(this.image, o, s, f - o, u - s, t, this.resultPointCallback);
      return c.find();
    }, r;
  }()
), pe = (
  /** @class */
  function() {
    function r() {
      this.decoder = new Yi();
    }
    return r.prototype.getDecoder = function() {
      return this.decoder;
    }, r.prototype.decode = function(t, e) {
      var n, i;
      if (e != null && e.get($.PURE_BARCODE) !== void 0) {
        var a = r.extractPureBits(t.getBlackMatrix());
        n = this.decoder.decodeBitMatrix(a, e), i = r.NO_POINTS;
      } else {
        var o = new ra(t.getBlackMatrix()).detect(e);
        n = this.decoder.decodeBitMatrix(o.getBits(), e), i = o.getPoints();
      }
      n.getOther() instanceof Wr && n.getOther().applyMirroredCorrection(i);
      var f = new pt(n.getText(), n.getRawBytes(), void 0, i, N.QR_CODE, void 0), s = n.getByteSegments();
      s !== null && f.putMetadata(dt.BYTE_SEGMENTS, s);
      var u = n.getECLevel();
      return u !== null && f.putMetadata(dt.ERROR_CORRECTION_LEVEL, u), n.hasStructuredAppend() && (f.putMetadata(dt.STRUCTURED_APPEND_SEQUENCE, n.getStructuredAppendSequenceNumber()), f.putMetadata(dt.STRUCTURED_APPEND_PARITY, n.getStructuredAppendParity())), f;
    }, r.prototype.reset = function() {
    }, r.extractPureBits = function(t) {
      var e = t.getTopLeftOnBit(), n = t.getBottomRightOnBit();
      if (e === null || n === null)
        throw new C();
      var i = this.moduleSize(e, t), a = e[1], o = n[1], f = e[0], s = n[0];
      if (f >= s || a >= o)
        throw new C();
      if (o - a !== s - f && (s = f + (o - a), s >= t.getWidth()))
        throw new C();
      var u = Math.round((s - f + 1) / i), c = Math.round((o - a + 1) / i);
      if (u <= 0 || c <= 0)
        throw new C();
      if (c !== u)
        throw new C();
      var l = (
        /*(int) */
        Math.floor(i / 2)
      );
      a += l, f += l;
      var h = f + /*(int) */
      Math.floor((u - 1) * i) - s;
      if (h > 0) {
        if (h > l)
          throw new C();
        f -= h;
      }
      var d = a + /*(int) */
      Math.floor((c - 1) * i) - o;
      if (d > 0) {
        if (d > l)
          throw new C();
        a -= d;
      }
      for (var v = new Nt(u, c), g = 0; g < c; g++)
        for (var x = a + /*(int) */
        Math.floor(g * i), w = 0; w < u; w++)
          t.get(f + /*(int) */
          Math.floor(w * i), x) && v.set(w, g);
      return v;
    }, r.moduleSize = function(t, e) {
      for (var n = e.getHeight(), i = e.getWidth(), a = t[0], o = t[1], f = !0, s = 0; a < i && o < n; ) {
        if (f !== e.get(a, o)) {
          if (++s === 5)
            break;
          f = !f;
        }
        a++, o++;
      }
      if (a === i || o === n)
        throw new C();
      return (a - t[0]) / 7;
    }, r.NO_POINTS = new Array(), r;
  }()
), na = globalThis && globalThis.__values || function(r) {
  var t = typeof Symbol == "function" && Symbol.iterator, e = t && r[t], n = 0;
  if (e)
    return e.call(r);
  if (r && typeof r.length == "number")
    return {
      next: function() {
        return r && n >= r.length && (r = void 0), { value: r && r[n++], done: !r };
      }
    };
  throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, k = (
  /** @class */
  function() {
    function r() {
    }
    return r.prototype.PDF417Common = function() {
    }, r.getBitCountSum = function(t) {
      return U.sum(t);
    }, r.toIntArray = function(t) {
      var e, n;
      if (t == null || !t.length)
        return r.EMPTY_INT_ARRAY;
      var i = new Int32Array(t.length), a = 0;
      try {
        for (var o = na(t), f = o.next(); !f.done; f = o.next()) {
          var s = f.value;
          i[a++] = s;
        }
      } catch (u) {
        e = { error: u };
      } finally {
        try {
          f && !f.done && (n = o.return) && n.call(o);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return i;
    }, r.getCodeword = function(t) {
      var e = ot.binarySearch(r.SYMBOL_TABLE, t & 262143);
      return e < 0 ? -1 : (r.CODEWORD_TABLE[e] - 1) % r.NUMBER_OF_CODEWORDS;
    }, r.NUMBER_OF_CODEWORDS = 929, r.MAX_CODEWORDS_IN_BARCODE = r.NUMBER_OF_CODEWORDS - 1, r.MIN_ROWS_IN_BARCODE = 3, r.MAX_ROWS_IN_BARCODE = 90, r.MODULES_IN_CODEWORD = 17, r.MODULES_IN_STOP_PATTERN = 18, r.BARS_IN_MODULE = 8, r.EMPTY_INT_ARRAY = new Int32Array([]), r.SYMBOL_TABLE = Int32Array.from([
      66142,
      66170,
      66206,
      66236,
      66290,
      66292,
      66350,
      66382,
      66396,
      66454,
      66470,
      66476,
      66594,
      66600,
      66614,
      66626,
      66628,
      66632,
      66640,
      66654,
      66662,
      66668,
      66682,
      66690,
      66718,
      66720,
      66748,
      66758,
      66776,
      66798,
      66802,
      66804,
      66820,
      66824,
      66832,
      66846,
      66848,
      66876,
      66880,
      66936,
      66950,
      66956,
      66968,
      66992,
      67006,
      67022,
      67036,
      67042,
      67044,
      67048,
      67062,
      67118,
      67150,
      67164,
      67214,
      67228,
      67256,
      67294,
      67322,
      67350,
      67366,
      67372,
      67398,
      67404,
      67416,
      67438,
      67474,
      67476,
      67490,
      67492,
      67496,
      67510,
      67618,
      67624,
      67650,
      67656,
      67664,
      67678,
      67686,
      67692,
      67706,
      67714,
      67716,
      67728,
      67742,
      67744,
      67772,
      67782,
      67788,
      67800,
      67822,
      67826,
      67828,
      67842,
      67848,
      67870,
      67872,
      67900,
      67904,
      67960,
      67974,
      67992,
      68016,
      68030,
      68046,
      68060,
      68066,
      68068,
      68072,
      68086,
      68104,
      68112,
      68126,
      68128,
      68156,
      68160,
      68216,
      68336,
      68358,
      68364,
      68376,
      68400,
      68414,
      68448,
      68476,
      68494,
      68508,
      68536,
      68546,
      68548,
      68552,
      68560,
      68574,
      68582,
      68588,
      68654,
      68686,
      68700,
      68706,
      68708,
      68712,
      68726,
      68750,
      68764,
      68792,
      68802,
      68804,
      68808,
      68816,
      68830,
      68838,
      68844,
      68858,
      68878,
      68892,
      68920,
      68976,
      68990,
      68994,
      68996,
      69e3,
      69008,
      69022,
      69024,
      69052,
      69062,
      69068,
      69080,
      69102,
      69106,
      69108,
      69142,
      69158,
      69164,
      69190,
      69208,
      69230,
      69254,
      69260,
      69272,
      69296,
      69310,
      69326,
      69340,
      69386,
      69394,
      69396,
      69410,
      69416,
      69430,
      69442,
      69444,
      69448,
      69456,
      69470,
      69478,
      69484,
      69554,
      69556,
      69666,
      69672,
      69698,
      69704,
      69712,
      69726,
      69754,
      69762,
      69764,
      69776,
      69790,
      69792,
      69820,
      69830,
      69836,
      69848,
      69870,
      69874,
      69876,
      69890,
      69918,
      69920,
      69948,
      69952,
      70008,
      70022,
      70040,
      70064,
      70078,
      70094,
      70108,
      70114,
      70116,
      70120,
      70134,
      70152,
      70174,
      70176,
      70264,
      70384,
      70412,
      70448,
      70462,
      70496,
      70524,
      70542,
      70556,
      70584,
      70594,
      70600,
      70608,
      70622,
      70630,
      70636,
      70664,
      70672,
      70686,
      70688,
      70716,
      70720,
      70776,
      70896,
      71136,
      71180,
      71192,
      71216,
      71230,
      71264,
      71292,
      71360,
      71416,
      71452,
      71480,
      71536,
      71550,
      71554,
      71556,
      71560,
      71568,
      71582,
      71584,
      71612,
      71622,
      71628,
      71640,
      71662,
      71726,
      71732,
      71758,
      71772,
      71778,
      71780,
      71784,
      71798,
      71822,
      71836,
      71864,
      71874,
      71880,
      71888,
      71902,
      71910,
      71916,
      71930,
      71950,
      71964,
      71992,
      72048,
      72062,
      72066,
      72068,
      72080,
      72094,
      72096,
      72124,
      72134,
      72140,
      72152,
      72174,
      72178,
      72180,
      72206,
      72220,
      72248,
      72304,
      72318,
      72416,
      72444,
      72456,
      72464,
      72478,
      72480,
      72508,
      72512,
      72568,
      72588,
      72600,
      72624,
      72638,
      72654,
      72668,
      72674,
      72676,
      72680,
      72694,
      72726,
      72742,
      72748,
      72774,
      72780,
      72792,
      72814,
      72838,
      72856,
      72880,
      72894,
      72910,
      72924,
      72930,
      72932,
      72936,
      72950,
      72966,
      72972,
      72984,
      73008,
      73022,
      73056,
      73084,
      73102,
      73116,
      73144,
      73156,
      73160,
      73168,
      73182,
      73190,
      73196,
      73210,
      73226,
      73234,
      73236,
      73250,
      73252,
      73256,
      73270,
      73282,
      73284,
      73296,
      73310,
      73318,
      73324,
      73346,
      73348,
      73352,
      73360,
      73374,
      73376,
      73404,
      73414,
      73420,
      73432,
      73454,
      73498,
      73518,
      73522,
      73524,
      73550,
      73564,
      73570,
      73572,
      73576,
      73590,
      73800,
      73822,
      73858,
      73860,
      73872,
      73886,
      73888,
      73916,
      73944,
      73970,
      73972,
      73992,
      74014,
      74016,
      74044,
      74048,
      74104,
      74118,
      74136,
      74160,
      74174,
      74210,
      74212,
      74216,
      74230,
      74244,
      74256,
      74270,
      74272,
      74360,
      74480,
      74502,
      74508,
      74544,
      74558,
      74592,
      74620,
      74638,
      74652,
      74680,
      74690,
      74696,
      74704,
      74726,
      74732,
      74782,
      74784,
      74812,
      74992,
      75232,
      75288,
      75326,
      75360,
      75388,
      75456,
      75512,
      75576,
      75632,
      75646,
      75650,
      75652,
      75664,
      75678,
      75680,
      75708,
      75718,
      75724,
      75736,
      75758,
      75808,
      75836,
      75840,
      75896,
      76016,
      76256,
      76736,
      76824,
      76848,
      76862,
      76896,
      76924,
      76992,
      77048,
      77296,
      77340,
      77368,
      77424,
      77438,
      77536,
      77564,
      77572,
      77576,
      77584,
      77600,
      77628,
      77632,
      77688,
      77702,
      77708,
      77720,
      77744,
      77758,
      77774,
      77788,
      77870,
      77902,
      77916,
      77922,
      77928,
      77966,
      77980,
      78008,
      78018,
      78024,
      78032,
      78046,
      78060,
      78074,
      78094,
      78136,
      78192,
      78206,
      78210,
      78212,
      78224,
      78238,
      78240,
      78268,
      78278,
      78284,
      78296,
      78322,
      78324,
      78350,
      78364,
      78448,
      78462,
      78560,
      78588,
      78600,
      78622,
      78624,
      78652,
      78656,
      78712,
      78726,
      78744,
      78768,
      78782,
      78798,
      78812,
      78818,
      78820,
      78824,
      78838,
      78862,
      78876,
      78904,
      78960,
      78974,
      79072,
      79100,
      79296,
      79352,
      79368,
      79376,
      79390,
      79392,
      79420,
      79424,
      79480,
      79600,
      79628,
      79640,
      79664,
      79678,
      79712,
      79740,
      79772,
      79800,
      79810,
      79812,
      79816,
      79824,
      79838,
      79846,
      79852,
      79894,
      79910,
      79916,
      79942,
      79948,
      79960,
      79982,
      79988,
      80006,
      80024,
      80048,
      80062,
      80078,
      80092,
      80098,
      80100,
      80104,
      80134,
      80140,
      80176,
      80190,
      80224,
      80252,
      80270,
      80284,
      80312,
      80328,
      80336,
      80350,
      80358,
      80364,
      80378,
      80390,
      80396,
      80408,
      80432,
      80446,
      80480,
      80508,
      80576,
      80632,
      80654,
      80668,
      80696,
      80752,
      80766,
      80776,
      80784,
      80798,
      80800,
      80828,
      80844,
      80856,
      80878,
      80882,
      80884,
      80914,
      80916,
      80930,
      80932,
      80936,
      80950,
      80962,
      80968,
      80976,
      80990,
      80998,
      81004,
      81026,
      81028,
      81040,
      81054,
      81056,
      81084,
      81094,
      81100,
      81112,
      81134,
      81154,
      81156,
      81160,
      81168,
      81182,
      81184,
      81212,
      81216,
      81272,
      81286,
      81292,
      81304,
      81328,
      81342,
      81358,
      81372,
      81380,
      81384,
      81398,
      81434,
      81454,
      81458,
      81460,
      81486,
      81500,
      81506,
      81508,
      81512,
      81526,
      81550,
      81564,
      81592,
      81602,
      81604,
      81608,
      81616,
      81630,
      81638,
      81644,
      81702,
      81708,
      81722,
      81734,
      81740,
      81752,
      81774,
      81778,
      81780,
      82050,
      82078,
      82080,
      82108,
      82180,
      82184,
      82192,
      82206,
      82208,
      82236,
      82240,
      82296,
      82316,
      82328,
      82352,
      82366,
      82402,
      82404,
      82408,
      82440,
      82448,
      82462,
      82464,
      82492,
      82496,
      82552,
      82672,
      82694,
      82700,
      82712,
      82736,
      82750,
      82784,
      82812,
      82830,
      82882,
      82884,
      82888,
      82896,
      82918,
      82924,
      82952,
      82960,
      82974,
      82976,
      83004,
      83008,
      83064,
      83184,
      83424,
      83468,
      83480,
      83504,
      83518,
      83552,
      83580,
      83648,
      83704,
      83740,
      83768,
      83824,
      83838,
      83842,
      83844,
      83848,
      83856,
      83872,
      83900,
      83910,
      83916,
      83928,
      83950,
      83984,
      84e3,
      84028,
      84032,
      84088,
      84208,
      84448,
      84928,
      85040,
      85054,
      85088,
      85116,
      85184,
      85240,
      85488,
      85560,
      85616,
      85630,
      85728,
      85756,
      85764,
      85768,
      85776,
      85790,
      85792,
      85820,
      85824,
      85880,
      85894,
      85900,
      85912,
      85936,
      85966,
      85980,
      86048,
      86080,
      86136,
      86256,
      86496,
      86976,
      88160,
      88188,
      88256,
      88312,
      88560,
      89056,
      89200,
      89214,
      89312,
      89340,
      89536,
      89592,
      89608,
      89616,
      89632,
      89664,
      89720,
      89840,
      89868,
      89880,
      89904,
      89952,
      89980,
      89998,
      90012,
      90040,
      90190,
      90204,
      90254,
      90268,
      90296,
      90306,
      90308,
      90312,
      90334,
      90382,
      90396,
      90424,
      90480,
      90494,
      90500,
      90504,
      90512,
      90526,
      90528,
      90556,
      90566,
      90572,
      90584,
      90610,
      90612,
      90638,
      90652,
      90680,
      90736,
      90750,
      90848,
      90876,
      90884,
      90888,
      90896,
      90910,
      90912,
      90940,
      90944,
      91e3,
      91014,
      91020,
      91032,
      91056,
      91070,
      91086,
      91100,
      91106,
      91108,
      91112,
      91126,
      91150,
      91164,
      91192,
      91248,
      91262,
      91360,
      91388,
      91584,
      91640,
      91664,
      91678,
      91680,
      91708,
      91712,
      91768,
      91888,
      91928,
      91952,
      91966,
      92e3,
      92028,
      92046,
      92060,
      92088,
      92098,
      92100,
      92104,
      92112,
      92126,
      92134,
      92140,
      92188,
      92216,
      92272,
      92384,
      92412,
      92608,
      92664,
      93168,
      93200,
      93214,
      93216,
      93244,
      93248,
      93304,
      93424,
      93664,
      93720,
      93744,
      93758,
      93792,
      93820,
      93888,
      93944,
      93980,
      94008,
      94064,
      94078,
      94084,
      94088,
      94096,
      94110,
      94112,
      94140,
      94150,
      94156,
      94168,
      94246,
      94252,
      94278,
      94284,
      94296,
      94318,
      94342,
      94348,
      94360,
      94384,
      94398,
      94414,
      94428,
      94440,
      94470,
      94476,
      94488,
      94512,
      94526,
      94560,
      94588,
      94606,
      94620,
      94648,
      94658,
      94660,
      94664,
      94672,
      94686,
      94694,
      94700,
      94714,
      94726,
      94732,
      94744,
      94768,
      94782,
      94816,
      94844,
      94912,
      94968,
      94990,
      95004,
      95032,
      95088,
      95102,
      95112,
      95120,
      95134,
      95136,
      95164,
      95180,
      95192,
      95214,
      95218,
      95220,
      95244,
      95256,
      95280,
      95294,
      95328,
      95356,
      95424,
      95480,
      95728,
      95758,
      95772,
      95800,
      95856,
      95870,
      95968,
      95996,
      96008,
      96016,
      96030,
      96032,
      96060,
      96064,
      96120,
      96152,
      96176,
      96190,
      96220,
      96226,
      96228,
      96232,
      96290,
      96292,
      96296,
      96310,
      96322,
      96324,
      96328,
      96336,
      96350,
      96358,
      96364,
      96386,
      96388,
      96392,
      96400,
      96414,
      96416,
      96444,
      96454,
      96460,
      96472,
      96494,
      96498,
      96500,
      96514,
      96516,
      96520,
      96528,
      96542,
      96544,
      96572,
      96576,
      96632,
      96646,
      96652,
      96664,
      96688,
      96702,
      96718,
      96732,
      96738,
      96740,
      96744,
      96758,
      96772,
      96776,
      96784,
      96798,
      96800,
      96828,
      96832,
      96888,
      97008,
      97030,
      97036,
      97048,
      97072,
      97086,
      97120,
      97148,
      97166,
      97180,
      97208,
      97220,
      97224,
      97232,
      97246,
      97254,
      97260,
      97326,
      97330,
      97332,
      97358,
      97372,
      97378,
      97380,
      97384,
      97398,
      97422,
      97436,
      97464,
      97474,
      97476,
      97480,
      97488,
      97502,
      97510,
      97516,
      97550,
      97564,
      97592,
      97648,
      97666,
      97668,
      97672,
      97680,
      97694,
      97696,
      97724,
      97734,
      97740,
      97752,
      97774,
      97830,
      97836,
      97850,
      97862,
      97868,
      97880,
      97902,
      97906,
      97908,
      97926,
      97932,
      97944,
      97968,
      97998,
      98012,
      98018,
      98020,
      98024,
      98038,
      98618,
      98674,
      98676,
      98838,
      98854,
      98874,
      98892,
      98904,
      98926,
      98930,
      98932,
      98968,
      99006,
      99042,
      99044,
      99048,
      99062,
      99166,
      99194,
      99246,
      99286,
      99350,
      99366,
      99372,
      99386,
      99398,
      99416,
      99438,
      99442,
      99444,
      99462,
      99504,
      99518,
      99534,
      99548,
      99554,
      99556,
      99560,
      99574,
      99590,
      99596,
      99608,
      99632,
      99646,
      99680,
      99708,
      99726,
      99740,
      99768,
      99778,
      99780,
      99784,
      99792,
      99806,
      99814,
      99820,
      99834,
      99858,
      99860,
      99874,
      99880,
      99894,
      99906,
      99920,
      99934,
      99962,
      99970,
      99972,
      99976,
      99984,
      99998,
      1e5,
      100028,
      100038,
      100044,
      100056,
      100078,
      100082,
      100084,
      100142,
      100174,
      100188,
      100246,
      100262,
      100268,
      100306,
      100308,
      100390,
      100396,
      100410,
      100422,
      100428,
      100440,
      100462,
      100466,
      100468,
      100486,
      100504,
      100528,
      100542,
      100558,
      100572,
      100578,
      100580,
      100584,
      100598,
      100620,
      100656,
      100670,
      100704,
      100732,
      100750,
      100792,
      100802,
      100808,
      100816,
      100830,
      100838,
      100844,
      100858,
      100888,
      100912,
      100926,
      100960,
      100988,
      101056,
      101112,
      101148,
      101176,
      101232,
      101246,
      101250,
      101252,
      101256,
      101264,
      101278,
      101280,
      101308,
      101318,
      101324,
      101336,
      101358,
      101362,
      101364,
      101410,
      101412,
      101416,
      101430,
      101442,
      101448,
      101456,
      101470,
      101478,
      101498,
      101506,
      101508,
      101520,
      101534,
      101536,
      101564,
      101580,
      101618,
      101620,
      101636,
      101640,
      101648,
      101662,
      101664,
      101692,
      101696,
      101752,
      101766,
      101784,
      101838,
      101858,
      101860,
      101864,
      101934,
      101938,
      101940,
      101966,
      101980,
      101986,
      101988,
      101992,
      102030,
      102044,
      102072,
      102082,
      102084,
      102088,
      102096,
      102138,
      102166,
      102182,
      102188,
      102214,
      102220,
      102232,
      102254,
      102282,
      102290,
      102292,
      102306,
      102308,
      102312,
      102326,
      102444,
      102458,
      102470,
      102476,
      102488,
      102514,
      102516,
      102534,
      102552,
      102576,
      102590,
      102606,
      102620,
      102626,
      102632,
      102646,
      102662,
      102668,
      102704,
      102718,
      102752,
      102780,
      102798,
      102812,
      102840,
      102850,
      102856,
      102864,
      102878,
      102886,
      102892,
      102906,
      102936,
      102974,
      103008,
      103036,
      103104,
      103160,
      103224,
      103280,
      103294,
      103298,
      103300,
      103312,
      103326,
      103328,
      103356,
      103366,
      103372,
      103384,
      103406,
      103410,
      103412,
      103472,
      103486,
      103520,
      103548,
      103616,
      103672,
      103920,
      103992,
      104048,
      104062,
      104160,
      104188,
      104194,
      104196,
      104200,
      104208,
      104224,
      104252,
      104256,
      104312,
      104326,
      104332,
      104344,
      104368,
      104382,
      104398,
      104412,
      104418,
      104420,
      104424,
      104482,
      104484,
      104514,
      104520,
      104528,
      104542,
      104550,
      104570,
      104578,
      104580,
      104592,
      104606,
      104608,
      104636,
      104652,
      104690,
      104692,
      104706,
      104712,
      104734,
      104736,
      104764,
      104768,
      104824,
      104838,
      104856,
      104910,
      104930,
      104932,
      104936,
      104968,
      104976,
      104990,
      104992,
      105020,
      105024,
      105080,
      105200,
      105240,
      105278,
      105312,
      105372,
      105410,
      105412,
      105416,
      105424,
      105446,
      105518,
      105524,
      105550,
      105564,
      105570,
      105572,
      105576,
      105614,
      105628,
      105656,
      105666,
      105672,
      105680,
      105702,
      105722,
      105742,
      105756,
      105784,
      105840,
      105854,
      105858,
      105860,
      105864,
      105872,
      105888,
      105932,
      105970,
      105972,
      106006,
      106022,
      106028,
      106054,
      106060,
      106072,
      106100,
      106118,
      106124,
      106136,
      106160,
      106174,
      106190,
      106210,
      106212,
      106216,
      106250,
      106258,
      106260,
      106274,
      106276,
      106280,
      106306,
      106308,
      106312,
      106320,
      106334,
      106348,
      106394,
      106414,
      106418,
      106420,
      106566,
      106572,
      106610,
      106612,
      106630,
      106636,
      106648,
      106672,
      106686,
      106722,
      106724,
      106728,
      106742,
      106758,
      106764,
      106776,
      106800,
      106814,
      106848,
      106876,
      106894,
      106908,
      106936,
      106946,
      106948,
      106952,
      106960,
      106974,
      106982,
      106988,
      107032,
      107056,
      107070,
      107104,
      107132,
      107200,
      107256,
      107292,
      107320,
      107376,
      107390,
      107394,
      107396,
      107400,
      107408,
      107422,
      107424,
      107452,
      107462,
      107468,
      107480,
      107502,
      107506,
      107508,
      107544,
      107568,
      107582,
      107616,
      107644,
      107712,
      107768,
      108016,
      108060,
      108088,
      108144,
      108158,
      108256,
      108284,
      108290,
      108292,
      108296,
      108304,
      108318,
      108320,
      108348,
      108352,
      108408,
      108422,
      108428,
      108440,
      108464,
      108478,
      108494,
      108508,
      108514,
      108516,
      108520,
      108592,
      108640,
      108668,
      108736,
      108792,
      109040,
      109536,
      109680,
      109694,
      109792,
      109820,
      110016,
      110072,
      110084,
      110088,
      110096,
      110112,
      110140,
      110144,
      110200,
      110320,
      110342,
      110348,
      110360,
      110384,
      110398,
      110432,
      110460,
      110478,
      110492,
      110520,
      110532,
      110536,
      110544,
      110558,
      110658,
      110686,
      110714,
      110722,
      110724,
      110728,
      110736,
      110750,
      110752,
      110780,
      110796,
      110834,
      110836,
      110850,
      110852,
      110856,
      110864,
      110878,
      110880,
      110908,
      110912,
      110968,
      110982,
      111e3,
      111054,
      111074,
      111076,
      111080,
      111108,
      111112,
      111120,
      111134,
      111136,
      111164,
      111168,
      111224,
      111344,
      111372,
      111422,
      111456,
      111516,
      111554,
      111556,
      111560,
      111568,
      111590,
      111632,
      111646,
      111648,
      111676,
      111680,
      111736,
      111856,
      112096,
      112152,
      112224,
      112252,
      112320,
      112440,
      112514,
      112516,
      112520,
      112528,
      112542,
      112544,
      112588,
      112686,
      112718,
      112732,
      112782,
      112796,
      112824,
      112834,
      112836,
      112840,
      112848,
      112870,
      112890,
      112910,
      112924,
      112952,
      113008,
      113022,
      113026,
      113028,
      113032,
      113040,
      113054,
      113056,
      113100,
      113138,
      113140,
      113166,
      113180,
      113208,
      113264,
      113278,
      113376,
      113404,
      113416,
      113424,
      113440,
      113468,
      113472,
      113560,
      113614,
      113634,
      113636,
      113640,
      113686,
      113702,
      113708,
      113734,
      113740,
      113752,
      113778,
      113780,
      113798,
      113804,
      113816,
      113840,
      113854,
      113870,
      113890,
      113892,
      113896,
      113926,
      113932,
      113944,
      113968,
      113982,
      114016,
      114044,
      114076,
      114114,
      114116,
      114120,
      114128,
      114150,
      114170,
      114194,
      114196,
      114210,
      114212,
      114216,
      114242,
      114244,
      114248,
      114256,
      114270,
      114278,
      114306,
      114308,
      114312,
      114320,
      114334,
      114336,
      114364,
      114380,
      114420,
      114458,
      114478,
      114482,
      114484,
      114510,
      114524,
      114530,
      114532,
      114536,
      114842,
      114866,
      114868,
      114970,
      114994,
      114996,
      115042,
      115044,
      115048,
      115062,
      115130,
      115226,
      115250,
      115252,
      115278,
      115292,
      115298,
      115300,
      115304,
      115318,
      115342,
      115394,
      115396,
      115400,
      115408,
      115422,
      115430,
      115436,
      115450,
      115478,
      115494,
      115514,
      115526,
      115532,
      115570,
      115572,
      115738,
      115758,
      115762,
      115764,
      115790,
      115804,
      115810,
      115812,
      115816,
      115830,
      115854,
      115868,
      115896,
      115906,
      115912,
      115920,
      115934,
      115942,
      115948,
      115962,
      115996,
      116024,
      116080,
      116094,
      116098,
      116100,
      116104,
      116112,
      116126,
      116128,
      116156,
      116166,
      116172,
      116184,
      116206,
      116210,
      116212,
      116246,
      116262,
      116268,
      116282,
      116294,
      116300,
      116312,
      116334,
      116338,
      116340,
      116358,
      116364,
      116376,
      116400,
      116414,
      116430,
      116444,
      116450,
      116452,
      116456,
      116498,
      116500,
      116514,
      116520,
      116534,
      116546,
      116548,
      116552,
      116560,
      116574,
      116582,
      116588,
      116602,
      116654,
      116694,
      116714,
      116762,
      116782,
      116786,
      116788,
      116814,
      116828,
      116834,
      116836,
      116840,
      116854,
      116878,
      116892,
      116920,
      116930,
      116936,
      116944,
      116958,
      116966,
      116972,
      116986,
      117006,
      117048,
      117104,
      117118,
      117122,
      117124,
      117136,
      117150,
      117152,
      117180,
      117190,
      117196,
      117208,
      117230,
      117234,
      117236,
      117304,
      117360,
      117374,
      117472,
      117500,
      117506,
      117508,
      117512,
      117520,
      117536,
      117564,
      117568,
      117624,
      117638,
      117644,
      117656,
      117680,
      117694,
      117710,
      117724,
      117730,
      117732,
      117736,
      117750,
      117782,
      117798,
      117804,
      117818,
      117830,
      117848,
      117874,
      117876,
      117894,
      117936,
      117950,
      117966,
      117986,
      117988,
      117992,
      118022,
      118028,
      118040,
      118064,
      118078,
      118112,
      118140,
      118172,
      118210,
      118212,
      118216,
      118224,
      118238,
      118246,
      118266,
      118306,
      118312,
      118338,
      118352,
      118366,
      118374,
      118394,
      118402,
      118404,
      118408,
      118416,
      118430,
      118432,
      118460,
      118476,
      118514,
      118516,
      118574,
      118578,
      118580,
      118606,
      118620,
      118626,
      118628,
      118632,
      118678,
      118694,
      118700,
      118730,
      118738,
      118740,
      118830,
      118834,
      118836,
      118862,
      118876,
      118882,
      118884,
      118888,
      118902,
      118926,
      118940,
      118968,
      118978,
      118980,
      118984,
      118992,
      119006,
      119014,
      119020,
      119034,
      119068,
      119096,
      119152,
      119166,
      119170,
      119172,
      119176,
      119184,
      119198,
      119200,
      119228,
      119238,
      119244,
      119256,
      119278,
      119282,
      119284,
      119324,
      119352,
      119408,
      119422,
      119520,
      119548,
      119554,
      119556,
      119560,
      119568,
      119582,
      119584,
      119612,
      119616,
      119672,
      119686,
      119692,
      119704,
      119728,
      119742,
      119758,
      119772,
      119778,
      119780,
      119784,
      119798,
      119920,
      119934,
      120032,
      120060,
      120256,
      120312,
      120324,
      120328,
      120336,
      120352,
      120384,
      120440,
      120560,
      120582,
      120588,
      120600,
      120624,
      120638,
      120672,
      120700,
      120718,
      120732,
      120760,
      120770,
      120772,
      120776,
      120784,
      120798,
      120806,
      120812,
      120870,
      120876,
      120890,
      120902,
      120908,
      120920,
      120946,
      120948,
      120966,
      120972,
      120984,
      121008,
      121022,
      121038,
      121058,
      121060,
      121064,
      121078,
      121100,
      121112,
      121136,
      121150,
      121184,
      121212,
      121244,
      121282,
      121284,
      121288,
      121296,
      121318,
      121338,
      121356,
      121368,
      121392,
      121406,
      121440,
      121468,
      121536,
      121592,
      121656,
      121730,
      121732,
      121736,
      121744,
      121758,
      121760,
      121804,
      121842,
      121844,
      121890,
      121922,
      121924,
      121928,
      121936,
      121950,
      121958,
      121978,
      121986,
      121988,
      121992,
      122e3,
      122014,
      122016,
      122044,
      122060,
      122098,
      122100,
      122116,
      122120,
      122128,
      122142,
      122144,
      122172,
      122176,
      122232,
      122246,
      122264,
      122318,
      122338,
      122340,
      122344,
      122414,
      122418,
      122420,
      122446,
      122460,
      122466,
      122468,
      122472,
      122510,
      122524,
      122552,
      122562,
      122564,
      122568,
      122576,
      122598,
      122618,
      122646,
      122662,
      122668,
      122694,
      122700,
      122712,
      122738,
      122740,
      122762,
      122770,
      122772,
      122786,
      122788,
      122792,
      123018,
      123026,
      123028,
      123042,
      123044,
      123048,
      123062,
      123098,
      123146,
      123154,
      123156,
      123170,
      123172,
      123176,
      123190,
      123202,
      123204,
      123208,
      123216,
      123238,
      123244,
      123258,
      123290,
      123314,
      123316,
      123402,
      123410,
      123412,
      123426,
      123428,
      123432,
      123446,
      123458,
      123464,
      123472,
      123486,
      123494,
      123500,
      123514,
      123522,
      123524,
      123528,
      123536,
      123552,
      123580,
      123590,
      123596,
      123608,
      123630,
      123634,
      123636,
      123674,
      123698,
      123700,
      123740,
      123746,
      123748,
      123752,
      123834,
      123914,
      123922,
      123924,
      123938,
      123944,
      123958,
      123970,
      123976,
      123984,
      123998,
      124006,
      124012,
      124026,
      124034,
      124036,
      124048,
      124062,
      124064,
      124092,
      124102,
      124108,
      124120,
      124142,
      124146,
      124148,
      124162,
      124164,
      124168,
      124176,
      124190,
      124192,
      124220,
      124224,
      124280,
      124294,
      124300,
      124312,
      124336,
      124350,
      124366,
      124380,
      124386,
      124388,
      124392,
      124406,
      124442,
      124462,
      124466,
      124468,
      124494,
      124508,
      124514,
      124520,
      124558,
      124572,
      124600,
      124610,
      124612,
      124616,
      124624,
      124646,
      124666,
      124694,
      124710,
      124716,
      124730,
      124742,
      124748,
      124760,
      124786,
      124788,
      124818,
      124820,
      124834,
      124836,
      124840,
      124854,
      124946,
      124948,
      124962,
      124964,
      124968,
      124982,
      124994,
      124996,
      125e3,
      125008,
      125022,
      125030,
      125036,
      125050,
      125058,
      125060,
      125064,
      125072,
      125086,
      125088,
      125116,
      125126,
      125132,
      125144,
      125166,
      125170,
      125172,
      125186,
      125188,
      125192,
      125200,
      125216,
      125244,
      125248,
      125304,
      125318,
      125324,
      125336,
      125360,
      125374,
      125390,
      125404,
      125410,
      125412,
      125416,
      125430,
      125444,
      125448,
      125456,
      125472,
      125504,
      125560,
      125680,
      125702,
      125708,
      125720,
      125744,
      125758,
      125792,
      125820,
      125838,
      125852,
      125880,
      125890,
      125892,
      125896,
      125904,
      125918,
      125926,
      125932,
      125978,
      125998,
      126002,
      126004,
      126030,
      126044,
      126050,
      126052,
      126056,
      126094,
      126108,
      126136,
      126146,
      126148,
      126152,
      126160,
      126182,
      126202,
      126222,
      126236,
      126264,
      126320,
      126334,
      126338,
      126340,
      126344,
      126352,
      126366,
      126368,
      126412,
      126450,
      126452,
      126486,
      126502,
      126508,
      126522,
      126534,
      126540,
      126552,
      126574,
      126578,
      126580,
      126598,
      126604,
      126616,
      126640,
      126654,
      126670,
      126684,
      126690,
      126692,
      126696,
      126738,
      126754,
      126756,
      126760,
      126774,
      126786,
      126788,
      126792,
      126800,
      126814,
      126822,
      126828,
      126842,
      126894,
      126898,
      126900,
      126934,
      127126,
      127142,
      127148,
      127162,
      127178,
      127186,
      127188,
      127254,
      127270,
      127276,
      127290,
      127302,
      127308,
      127320,
      127342,
      127346,
      127348,
      127370,
      127378,
      127380,
      127394,
      127396,
      127400,
      127450,
      127510,
      127526,
      127532,
      127546,
      127558,
      127576,
      127598,
      127602,
      127604,
      127622,
      127628,
      127640,
      127664,
      127678,
      127694,
      127708,
      127714,
      127716,
      127720,
      127734,
      127754,
      127762,
      127764,
      127778,
      127784,
      127810,
      127812,
      127816,
      127824,
      127838,
      127846,
      127866,
      127898,
      127918,
      127922,
      127924,
      128022,
      128038,
      128044,
      128058,
      128070,
      128076,
      128088,
      128110,
      128114,
      128116,
      128134,
      128140,
      128152,
      128176,
      128190,
      128206,
      128220,
      128226,
      128228,
      128232,
      128246,
      128262,
      128268,
      128280,
      128304,
      128318,
      128352,
      128380,
      128398,
      128412,
      128440,
      128450,
      128452,
      128456,
      128464,
      128478,
      128486,
      128492,
      128506,
      128522,
      128530,
      128532,
      128546,
      128548,
      128552,
      128566,
      128578,
      128580,
      128584,
      128592,
      128606,
      128614,
      128634,
      128642,
      128644,
      128648,
      128656,
      128670,
      128672,
      128700,
      128716,
      128754,
      128756,
      128794,
      128814,
      128818,
      128820,
      128846,
      128860,
      128866,
      128868,
      128872,
      128886,
      128918,
      128934,
      128940,
      128954,
      128978,
      128980,
      129178,
      129198,
      129202,
      129204,
      129238,
      129258,
      129306,
      129326,
      129330,
      129332,
      129358,
      129372,
      129378,
      129380,
      129384,
      129398,
      129430,
      129446,
      129452,
      129466,
      129482,
      129490,
      129492,
      129562,
      129582,
      129586,
      129588,
      129614,
      129628,
      129634,
      129636,
      129640,
      129654,
      129678,
      129692,
      129720,
      129730,
      129732,
      129736,
      129744,
      129758,
      129766,
      129772,
      129814,
      129830,
      129836,
      129850,
      129862,
      129868,
      129880,
      129902,
      129906,
      129908,
      129930,
      129938,
      129940,
      129954,
      129956,
      129960,
      129974,
      130010
    ]), r.CODEWORD_TABLE = Int32Array.from([
      2627,
      1819,
      2622,
      2621,
      1813,
      1812,
      2729,
      2724,
      2723,
      2779,
      2774,
      2773,
      902,
      896,
      908,
      868,
      865,
      861,
      859,
      2511,
      873,
      871,
      1780,
      835,
      2493,
      825,
      2491,
      842,
      837,
      844,
      1764,
      1762,
      811,
      810,
      809,
      2483,
      807,
      2482,
      806,
      2480,
      815,
      814,
      813,
      812,
      2484,
      817,
      816,
      1745,
      1744,
      1742,
      1746,
      2655,
      2637,
      2635,
      2626,
      2625,
      2623,
      2628,
      1820,
      2752,
      2739,
      2737,
      2728,
      2727,
      2725,
      2730,
      2785,
      2783,
      2778,
      2777,
      2775,
      2780,
      787,
      781,
      747,
      739,
      736,
      2413,
      754,
      752,
      1719,
      692,
      689,
      681,
      2371,
      678,
      2369,
      700,
      697,
      694,
      703,
      1688,
      1686,
      642,
      638,
      2343,
      631,
      2341,
      627,
      2338,
      651,
      646,
      643,
      2345,
      654,
      652,
      1652,
      1650,
      1647,
      1654,
      601,
      599,
      2322,
      596,
      2321,
      594,
      2319,
      2317,
      611,
      610,
      608,
      606,
      2324,
      603,
      2323,
      615,
      614,
      612,
      1617,
      1616,
      1614,
      1612,
      616,
      1619,
      1618,
      2575,
      2538,
      2536,
      905,
      901,
      898,
      909,
      2509,
      2507,
      2504,
      870,
      867,
      864,
      860,
      2512,
      875,
      872,
      1781,
      2490,
      2489,
      2487,
      2485,
      1748,
      836,
      834,
      832,
      830,
      2494,
      827,
      2492,
      843,
      841,
      839,
      845,
      1765,
      1763,
      2701,
      2676,
      2674,
      2653,
      2648,
      2656,
      2634,
      2633,
      2631,
      2629,
      1821,
      2638,
      2636,
      2770,
      2763,
      2761,
      2750,
      2745,
      2753,
      2736,
      2735,
      2733,
      2731,
      1848,
      2740,
      2738,
      2786,
      2784,
      591,
      588,
      576,
      569,
      566,
      2296,
      1590,
      537,
      534,
      526,
      2276,
      522,
      2274,
      545,
      542,
      539,
      548,
      1572,
      1570,
      481,
      2245,
      466,
      2242,
      462,
      2239,
      492,
      485,
      482,
      2249,
      496,
      494,
      1534,
      1531,
      1528,
      1538,
      413,
      2196,
      406,
      2191,
      2188,
      425,
      419,
      2202,
      415,
      2199,
      432,
      430,
      427,
      1472,
      1467,
      1464,
      433,
      1476,
      1474,
      368,
      367,
      2160,
      365,
      2159,
      362,
      2157,
      2155,
      2152,
      378,
      377,
      375,
      2166,
      372,
      2165,
      369,
      2162,
      383,
      381,
      379,
      2168,
      1419,
      1418,
      1416,
      1414,
      385,
      1411,
      384,
      1423,
      1422,
      1420,
      1424,
      2461,
      802,
      2441,
      2439,
      790,
      786,
      783,
      794,
      2409,
      2406,
      2403,
      750,
      742,
      738,
      2414,
      756,
      753,
      1720,
      2367,
      2365,
      2362,
      2359,
      1663,
      693,
      691,
      684,
      2373,
      680,
      2370,
      702,
      699,
      696,
      704,
      1690,
      1687,
      2337,
      2336,
      2334,
      2332,
      1624,
      2329,
      1622,
      640,
      637,
      2344,
      634,
      2342,
      630,
      2340,
      650,
      648,
      645,
      2346,
      655,
      653,
      1653,
      1651,
      1649,
      1655,
      2612,
      2597,
      2595,
      2571,
      2568,
      2565,
      2576,
      2534,
      2529,
      2526,
      1787,
      2540,
      2537,
      907,
      904,
      900,
      910,
      2503,
      2502,
      2500,
      2498,
      1768,
      2495,
      1767,
      2510,
      2508,
      2506,
      869,
      866,
      863,
      2513,
      876,
      874,
      1782,
      2720,
      2713,
      2711,
      2697,
      2694,
      2691,
      2702,
      2672,
      2670,
      2664,
      1828,
      2678,
      2675,
      2647,
      2646,
      2644,
      2642,
      1823,
      2639,
      1822,
      2654,
      2652,
      2650,
      2657,
      2771,
      1855,
      2765,
      2762,
      1850,
      1849,
      2751,
      2749,
      2747,
      2754,
      353,
      2148,
      344,
      342,
      336,
      2142,
      332,
      2140,
      345,
      1375,
      1373,
      306,
      2130,
      299,
      2128,
      295,
      2125,
      319,
      314,
      311,
      2132,
      1354,
      1352,
      1349,
      1356,
      262,
      257,
      2101,
      253,
      2096,
      2093,
      274,
      273,
      267,
      2107,
      263,
      2104,
      280,
      278,
      275,
      1316,
      1311,
      1308,
      1320,
      1318,
      2052,
      202,
      2050,
      2044,
      2040,
      219,
      2063,
      212,
      2060,
      208,
      2055,
      224,
      221,
      2066,
      1260,
      1258,
      1252,
      231,
      1248,
      229,
      1266,
      1264,
      1261,
      1268,
      155,
      1998,
      153,
      1996,
      1994,
      1991,
      1988,
      165,
      164,
      2007,
      162,
      2006,
      159,
      2003,
      2e3,
      172,
      171,
      169,
      2012,
      166,
      2010,
      1186,
      1184,
      1182,
      1179,
      175,
      1176,
      173,
      1192,
      1191,
      1189,
      1187,
      176,
      1194,
      1193,
      2313,
      2307,
      2305,
      592,
      589,
      2294,
      2292,
      2289,
      578,
      572,
      568,
      2297,
      580,
      1591,
      2272,
      2267,
      2264,
      1547,
      538,
      536,
      529,
      2278,
      525,
      2275,
      547,
      544,
      541,
      1574,
      1571,
      2237,
      2235,
      2229,
      1493,
      2225,
      1489,
      478,
      2247,
      470,
      2244,
      465,
      2241,
      493,
      488,
      484,
      2250,
      498,
      495,
      1536,
      1533,
      1530,
      1539,
      2187,
      2186,
      2184,
      2182,
      1432,
      2179,
      1430,
      2176,
      1427,
      414,
      412,
      2197,
      409,
      2195,
      405,
      2193,
      2190,
      426,
      424,
      421,
      2203,
      418,
      2201,
      431,
      429,
      1473,
      1471,
      1469,
      1466,
      434,
      1477,
      1475,
      2478,
      2472,
      2470,
      2459,
      2457,
      2454,
      2462,
      803,
      2437,
      2432,
      2429,
      1726,
      2443,
      2440,
      792,
      789,
      785,
      2401,
      2399,
      2393,
      1702,
      2389,
      1699,
      2411,
      2408,
      2405,
      745,
      741,
      2415,
      758,
      755,
      1721,
      2358,
      2357,
      2355,
      2353,
      1661,
      2350,
      1660,
      2347,
      1657,
      2368,
      2366,
      2364,
      2361,
      1666,
      690,
      687,
      2374,
      683,
      2372,
      701,
      698,
      705,
      1691,
      1689,
      2619,
      2617,
      2610,
      2608,
      2605,
      2613,
      2593,
      2588,
      2585,
      1803,
      2599,
      2596,
      2563,
      2561,
      2555,
      1797,
      2551,
      1795,
      2573,
      2570,
      2567,
      2577,
      2525,
      2524,
      2522,
      2520,
      1786,
      2517,
      1785,
      2514,
      1783,
      2535,
      2533,
      2531,
      2528,
      1788,
      2541,
      2539,
      906,
      903,
      911,
      2721,
      1844,
      2715,
      2712,
      1838,
      1836,
      2699,
      2696,
      2693,
      2703,
      1827,
      1826,
      1824,
      2673,
      2671,
      2669,
      2666,
      1829,
      2679,
      2677,
      1858,
      1857,
      2772,
      1854,
      1853,
      1851,
      1856,
      2766,
      2764,
      143,
      1987,
      139,
      1986,
      135,
      133,
      131,
      1984,
      128,
      1983,
      125,
      1981,
      138,
      137,
      136,
      1985,
      1133,
      1132,
      1130,
      112,
      110,
      1974,
      107,
      1973,
      104,
      1971,
      1969,
      122,
      121,
      119,
      117,
      1977,
      114,
      1976,
      124,
      1115,
      1114,
      1112,
      1110,
      1117,
      1116,
      84,
      83,
      1953,
      81,
      1952,
      78,
      1950,
      1948,
      1945,
      94,
      93,
      91,
      1959,
      88,
      1958,
      85,
      1955,
      99,
      97,
      95,
      1961,
      1086,
      1085,
      1083,
      1081,
      1078,
      100,
      1090,
      1089,
      1087,
      1091,
      49,
      47,
      1917,
      44,
      1915,
      1913,
      1910,
      1907,
      59,
      1926,
      56,
      1925,
      53,
      1922,
      1919,
      66,
      64,
      1931,
      61,
      1929,
      1042,
      1040,
      1038,
      71,
      1035,
      70,
      1032,
      68,
      1048,
      1047,
      1045,
      1043,
      1050,
      1049,
      12,
      10,
      1869,
      1867,
      1864,
      1861,
      21,
      1880,
      19,
      1877,
      1874,
      1871,
      28,
      1888,
      25,
      1886,
      22,
      1883,
      982,
      980,
      977,
      974,
      32,
      30,
      991,
      989,
      987,
      984,
      34,
      995,
      994,
      992,
      2151,
      2150,
      2147,
      2146,
      2144,
      356,
      355,
      354,
      2149,
      2139,
      2138,
      2136,
      2134,
      1359,
      343,
      341,
      338,
      2143,
      335,
      2141,
      348,
      347,
      346,
      1376,
      1374,
      2124,
      2123,
      2121,
      2119,
      1326,
      2116,
      1324,
      310,
      308,
      305,
      2131,
      302,
      2129,
      298,
      2127,
      320,
      318,
      316,
      313,
      2133,
      322,
      321,
      1355,
      1353,
      1351,
      1357,
      2092,
      2091,
      2089,
      2087,
      1276,
      2084,
      1274,
      2081,
      1271,
      259,
      2102,
      256,
      2100,
      252,
      2098,
      2095,
      272,
      269,
      2108,
      266,
      2106,
      281,
      279,
      277,
      1317,
      1315,
      1313,
      1310,
      282,
      1321,
      1319,
      2039,
      2037,
      2035,
      2032,
      1203,
      2029,
      1200,
      1197,
      207,
      2053,
      205,
      2051,
      201,
      2049,
      2046,
      2043,
      220,
      218,
      2064,
      215,
      2062,
      211,
      2059,
      228,
      226,
      223,
      2069,
      1259,
      1257,
      1254,
      232,
      1251,
      230,
      1267,
      1265,
      1263,
      2316,
      2315,
      2312,
      2311,
      2309,
      2314,
      2304,
      2303,
      2301,
      2299,
      1593,
      2308,
      2306,
      590,
      2288,
      2287,
      2285,
      2283,
      1578,
      2280,
      1577,
      2295,
      2293,
      2291,
      579,
      577,
      574,
      571,
      2298,
      582,
      581,
      1592,
      2263,
      2262,
      2260,
      2258,
      1545,
      2255,
      1544,
      2252,
      1541,
      2273,
      2271,
      2269,
      2266,
      1550,
      535,
      532,
      2279,
      528,
      2277,
      546,
      543,
      549,
      1575,
      1573,
      2224,
      2222,
      2220,
      1486,
      2217,
      1485,
      2214,
      1482,
      1479,
      2238,
      2236,
      2234,
      2231,
      1496,
      2228,
      1492,
      480,
      477,
      2248,
      473,
      2246,
      469,
      2243,
      490,
      487,
      2251,
      497,
      1537,
      1535,
      1532,
      2477,
      2476,
      2474,
      2479,
      2469,
      2468,
      2466,
      2464,
      1730,
      2473,
      2471,
      2453,
      2452,
      2450,
      2448,
      1729,
      2445,
      1728,
      2460,
      2458,
      2456,
      2463,
      805,
      804,
      2428,
      2427,
      2425,
      2423,
      1725,
      2420,
      1724,
      2417,
      1722,
      2438,
      2436,
      2434,
      2431,
      1727,
      2444,
      2442,
      793,
      791,
      788,
      795,
      2388,
      2386,
      2384,
      1697,
      2381,
      1696,
      2378,
      1694,
      1692,
      2402,
      2400,
      2398,
      2395,
      1703,
      2392,
      1701,
      2412,
      2410,
      2407,
      751,
      748,
      744,
      2416,
      759,
      757,
      1807,
      2620,
      2618,
      1806,
      1805,
      2611,
      2609,
      2607,
      2614,
      1802,
      1801,
      1799,
      2594,
      2592,
      2590,
      2587,
      1804,
      2600,
      2598,
      1794,
      1793,
      1791,
      1789,
      2564,
      2562,
      2560,
      2557,
      1798,
      2554,
      1796,
      2574,
      2572,
      2569,
      2578,
      1847,
      1846,
      2722,
      1843,
      1842,
      1840,
      1845,
      2716,
      2714,
      1835,
      1834,
      1832,
      1830,
      1839,
      1837,
      2700,
      2698,
      2695,
      2704,
      1817,
      1811,
      1810,
      897,
      862,
      1777,
      829,
      826,
      838,
      1760,
      1758,
      808,
      2481,
      1741,
      1740,
      1738,
      1743,
      2624,
      1818,
      2726,
      2776,
      782,
      740,
      737,
      1715,
      686,
      679,
      695,
      1682,
      1680,
      639,
      628,
      2339,
      647,
      644,
      1645,
      1643,
      1640,
      1648,
      602,
      600,
      597,
      595,
      2320,
      593,
      2318,
      609,
      607,
      604,
      1611,
      1610,
      1608,
      1606,
      613,
      1615,
      1613,
      2328,
      926,
      924,
      892,
      886,
      899,
      857,
      850,
      2505,
      1778,
      824,
      823,
      821,
      819,
      2488,
      818,
      2486,
      833,
      831,
      828,
      840,
      1761,
      1759,
      2649,
      2632,
      2630,
      2746,
      2734,
      2732,
      2782,
      2781,
      570,
      567,
      1587,
      531,
      527,
      523,
      540,
      1566,
      1564,
      476,
      467,
      463,
      2240,
      486,
      483,
      1524,
      1521,
      1518,
      1529,
      411,
      403,
      2192,
      399,
      2189,
      423,
      416,
      1462,
      1457,
      1454,
      428,
      1468,
      1465,
      2210,
      366,
      363,
      2158,
      360,
      2156,
      357,
      2153,
      376,
      373,
      370,
      2163,
      1410,
      1409,
      1407,
      1405,
      382,
      1402,
      380,
      1417,
      1415,
      1412,
      1421,
      2175,
      2174,
      777,
      774,
      771,
      784,
      732,
      725,
      722,
      2404,
      743,
      1716,
      676,
      674,
      668,
      2363,
      665,
      2360,
      685,
      1684,
      1681,
      626,
      624,
      622,
      2335,
      620,
      2333,
      617,
      2330,
      641,
      635,
      649,
      1646,
      1644,
      1642,
      2566,
      928,
      925,
      2530,
      2527,
      894,
      891,
      888,
      2501,
      2499,
      2496,
      858,
      856,
      854,
      851,
      1779,
      2692,
      2668,
      2665,
      2645,
      2643,
      2640,
      2651,
      2768,
      2759,
      2757,
      2744,
      2743,
      2741,
      2748,
      352,
      1382,
      340,
      337,
      333,
      1371,
      1369,
      307,
      300,
      296,
      2126,
      315,
      312,
      1347,
      1342,
      1350,
      261,
      258,
      250,
      2097,
      246,
      2094,
      271,
      268,
      264,
      1306,
      1301,
      1298,
      276,
      1312,
      1309,
      2115,
      203,
      2048,
      195,
      2045,
      191,
      2041,
      213,
      209,
      2056,
      1246,
      1244,
      1238,
      225,
      1234,
      222,
      1256,
      1253,
      1249,
      1262,
      2080,
      2079,
      154,
      1997,
      150,
      1995,
      147,
      1992,
      1989,
      163,
      160,
      2004,
      156,
      2001,
      1175,
      1174,
      1172,
      1170,
      1167,
      170,
      1164,
      167,
      1185,
      1183,
      1180,
      1177,
      174,
      1190,
      1188,
      2025,
      2024,
      2022,
      587,
      586,
      564,
      559,
      556,
      2290,
      573,
      1588,
      520,
      518,
      512,
      2268,
      508,
      2265,
      530,
      1568,
      1565,
      461,
      457,
      2233,
      450,
      2230,
      446,
      2226,
      479,
      471,
      489,
      1526,
      1523,
      1520,
      397,
      395,
      2185,
      392,
      2183,
      389,
      2180,
      2177,
      410,
      2194,
      402,
      422,
      1463,
      1461,
      1459,
      1456,
      1470,
      2455,
      799,
      2433,
      2430,
      779,
      776,
      773,
      2397,
      2394,
      2390,
      734,
      728,
      724,
      746,
      1717,
      2356,
      2354,
      2351,
      2348,
      1658,
      677,
      675,
      673,
      670,
      667,
      688,
      1685,
      1683,
      2606,
      2589,
      2586,
      2559,
      2556,
      2552,
      927,
      2523,
      2521,
      2518,
      2515,
      1784,
      2532,
      895,
      893,
      890,
      2718,
      2709,
      2707,
      2689,
      2687,
      2684,
      2663,
      2662,
      2660,
      2658,
      1825,
      2667,
      2769,
      1852,
      2760,
      2758,
      142,
      141,
      1139,
      1138,
      134,
      132,
      129,
      126,
      1982,
      1129,
      1128,
      1126,
      1131,
      113,
      111,
      108,
      105,
      1972,
      101,
      1970,
      120,
      118,
      115,
      1109,
      1108,
      1106,
      1104,
      123,
      1113,
      1111,
      82,
      79,
      1951,
      75,
      1949,
      72,
      1946,
      92,
      89,
      86,
      1956,
      1077,
      1076,
      1074,
      1072,
      98,
      1069,
      96,
      1084,
      1082,
      1079,
      1088,
      1968,
      1967,
      48,
      45,
      1916,
      42,
      1914,
      39,
      1911,
      1908,
      60,
      57,
      54,
      1923,
      50,
      1920,
      1031,
      1030,
      1028,
      1026,
      67,
      1023,
      65,
      1020,
      62,
      1041,
      1039,
      1036,
      1033,
      69,
      1046,
      1044,
      1944,
      1943,
      1941,
      11,
      9,
      1868,
      7,
      1865,
      1862,
      1859,
      20,
      1878,
      16,
      1875,
      13,
      1872,
      970,
      968,
      966,
      963,
      29,
      960,
      26,
      23,
      983,
      981,
      978,
      975,
      33,
      971,
      31,
      990,
      988,
      985,
      1906,
      1904,
      1902,
      993,
      351,
      2145,
      1383,
      331,
      330,
      328,
      326,
      2137,
      323,
      2135,
      339,
      1372,
      1370,
      294,
      293,
      291,
      289,
      2122,
      286,
      2120,
      283,
      2117,
      309,
      303,
      317,
      1348,
      1346,
      1344,
      245,
      244,
      242,
      2090,
      239,
      2088,
      236,
      2085,
      2082,
      260,
      2099,
      249,
      270,
      1307,
      1305,
      1303,
      1300,
      1314,
      189,
      2038,
      186,
      2036,
      183,
      2033,
      2030,
      2026,
      206,
      198,
      2047,
      194,
      216,
      1247,
      1245,
      1243,
      1240,
      227,
      1237,
      1255,
      2310,
      2302,
      2300,
      2286,
      2284,
      2281,
      565,
      563,
      561,
      558,
      575,
      1589,
      2261,
      2259,
      2256,
      2253,
      1542,
      521,
      519,
      517,
      514,
      2270,
      511,
      533,
      1569,
      1567,
      2223,
      2221,
      2218,
      2215,
      1483,
      2211,
      1480,
      459,
      456,
      453,
      2232,
      449,
      474,
      491,
      1527,
      1525,
      1522,
      2475,
      2467,
      2465,
      2451,
      2449,
      2446,
      801,
      800,
      2426,
      2424,
      2421,
      2418,
      1723,
      2435,
      780,
      778,
      775,
      2387,
      2385,
      2382,
      2379,
      1695,
      2375,
      1693,
      2396,
      735,
      733,
      730,
      727,
      749,
      1718,
      2616,
      2615,
      2604,
      2603,
      2601,
      2584,
      2583,
      2581,
      2579,
      1800,
      2591,
      2550,
      2549,
      2547,
      2545,
      1792,
      2542,
      1790,
      2558,
      929,
      2719,
      1841,
      2710,
      2708,
      1833,
      1831,
      2690,
      2688,
      2686,
      1815,
      1809,
      1808,
      1774,
      1756,
      1754,
      1737,
      1736,
      1734,
      1739,
      1816,
      1711,
      1676,
      1674,
      633,
      629,
      1638,
      1636,
      1633,
      1641,
      598,
      1605,
      1604,
      1602,
      1600,
      605,
      1609,
      1607,
      2327,
      887,
      853,
      1775,
      822,
      820,
      1757,
      1755,
      1584,
      524,
      1560,
      1558,
      468,
      464,
      1514,
      1511,
      1508,
      1519,
      408,
      404,
      400,
      1452,
      1447,
      1444,
      417,
      1458,
      1455,
      2208,
      364,
      361,
      358,
      2154,
      1401,
      1400,
      1398,
      1396,
      374,
      1393,
      371,
      1408,
      1406,
      1403,
      1413,
      2173,
      2172,
      772,
      726,
      723,
      1712,
      672,
      669,
      666,
      682,
      1678,
      1675,
      625,
      623,
      621,
      618,
      2331,
      636,
      632,
      1639,
      1637,
      1635,
      920,
      918,
      884,
      880,
      889,
      849,
      848,
      847,
      846,
      2497,
      855,
      852,
      1776,
      2641,
      2742,
      2787,
      1380,
      334,
      1367,
      1365,
      301,
      297,
      1340,
      1338,
      1335,
      1343,
      255,
      251,
      247,
      1296,
      1291,
      1288,
      265,
      1302,
      1299,
      2113,
      204,
      196,
      192,
      2042,
      1232,
      1230,
      1224,
      214,
      1220,
      210,
      1242,
      1239,
      1235,
      1250,
      2077,
      2075,
      151,
      148,
      1993,
      144,
      1990,
      1163,
      1162,
      1160,
      1158,
      1155,
      161,
      1152,
      157,
      1173,
      1171,
      1168,
      1165,
      168,
      1181,
      1178,
      2021,
      2020,
      2018,
      2023,
      585,
      560,
      557,
      1585,
      516,
      509,
      1562,
      1559,
      458,
      447,
      2227,
      472,
      1516,
      1513,
      1510,
      398,
      396,
      393,
      390,
      2181,
      386,
      2178,
      407,
      1453,
      1451,
      1449,
      1446,
      420,
      1460,
      2209,
      769,
      764,
      720,
      712,
      2391,
      729,
      1713,
      664,
      663,
      661,
      659,
      2352,
      656,
      2349,
      671,
      1679,
      1677,
      2553,
      922,
      919,
      2519,
      2516,
      885,
      883,
      881,
      2685,
      2661,
      2659,
      2767,
      2756,
      2755,
      140,
      1137,
      1136,
      130,
      127,
      1125,
      1124,
      1122,
      1127,
      109,
      106,
      102,
      1103,
      1102,
      1100,
      1098,
      116,
      1107,
      1105,
      1980,
      80,
      76,
      73,
      1947,
      1068,
      1067,
      1065,
      1063,
      90,
      1060,
      87,
      1075,
      1073,
      1070,
      1080,
      1966,
      1965,
      46,
      43,
      40,
      1912,
      36,
      1909,
      1019,
      1018,
      1016,
      1014,
      58,
      1011,
      55,
      1008,
      51,
      1029,
      1027,
      1024,
      1021,
      63,
      1037,
      1034,
      1940,
      1939,
      1937,
      1942,
      8,
      1866,
      4,
      1863,
      1,
      1860,
      956,
      954,
      952,
      949,
      946,
      17,
      14,
      969,
      967,
      964,
      961,
      27,
      957,
      24,
      979,
      976,
      972,
      1901,
      1900,
      1898,
      1896,
      986,
      1905,
      1903,
      350,
      349,
      1381,
      329,
      327,
      324,
      1368,
      1366,
      292,
      290,
      287,
      284,
      2118,
      304,
      1341,
      1339,
      1337,
      1345,
      243,
      240,
      237,
      2086,
      233,
      2083,
      254,
      1297,
      1295,
      1293,
      1290,
      1304,
      2114,
      190,
      187,
      184,
      2034,
      180,
      2031,
      177,
      2027,
      199,
      1233,
      1231,
      1229,
      1226,
      217,
      1223,
      1241,
      2078,
      2076,
      584,
      555,
      554,
      552,
      550,
      2282,
      562,
      1586,
      507,
      506,
      504,
      502,
      2257,
      499,
      2254,
      515,
      1563,
      1561,
      445,
      443,
      441,
      2219,
      438,
      2216,
      435,
      2212,
      460,
      454,
      475,
      1517,
      1515,
      1512,
      2447,
      798,
      797,
      2422,
      2419,
      770,
      768,
      766,
      2383,
      2380,
      2376,
      721,
      719,
      717,
      714,
      731,
      1714,
      2602,
      2582,
      2580,
      2548,
      2546,
      2543,
      923,
      921,
      2717,
      2706,
      2705,
      2683,
      2682,
      2680,
      1771,
      1752,
      1750,
      1733,
      1732,
      1731,
      1735,
      1814,
      1707,
      1670,
      1668,
      1631,
      1629,
      1626,
      1634,
      1599,
      1598,
      1596,
      1594,
      1603,
      1601,
      2326,
      1772,
      1753,
      1751,
      1581,
      1554,
      1552,
      1504,
      1501,
      1498,
      1509,
      1442,
      1437,
      1434,
      401,
      1448,
      1445,
      2206,
      1392,
      1391,
      1389,
      1387,
      1384,
      359,
      1399,
      1397,
      1394,
      1404,
      2171,
      2170,
      1708,
      1672,
      1669,
      619,
      1632,
      1630,
      1628,
      1773,
      1378,
      1363,
      1361,
      1333,
      1328,
      1336,
      1286,
      1281,
      1278,
      248,
      1292,
      1289,
      2111,
      1218,
      1216,
      1210,
      197,
      1206,
      193,
      1228,
      1225,
      1221,
      1236,
      2073,
      2071,
      1151,
      1150,
      1148,
      1146,
      152,
      1143,
      149,
      1140,
      145,
      1161,
      1159,
      1156,
      1153,
      158,
      1169,
      1166,
      2017,
      2016,
      2014,
      2019,
      1582,
      510,
      1556,
      1553,
      452,
      448,
      1506,
      1500,
      394,
      391,
      387,
      1443,
      1441,
      1439,
      1436,
      1450,
      2207,
      765,
      716,
      713,
      1709,
      662,
      660,
      657,
      1673,
      1671,
      916,
      914,
      879,
      878,
      877,
      882,
      1135,
      1134,
      1121,
      1120,
      1118,
      1123,
      1097,
      1096,
      1094,
      1092,
      103,
      1101,
      1099,
      1979,
      1059,
      1058,
      1056,
      1054,
      77,
      1051,
      74,
      1066,
      1064,
      1061,
      1071,
      1964,
      1963,
      1007,
      1006,
      1004,
      1002,
      999,
      41,
      996,
      37,
      1017,
      1015,
      1012,
      1009,
      52,
      1025,
      1022,
      1936,
      1935,
      1933,
      1938,
      942,
      940,
      938,
      935,
      932,
      5,
      2,
      955,
      953,
      950,
      947,
      18,
      943,
      15,
      965,
      962,
      958,
      1895,
      1894,
      1892,
      1890,
      973,
      1899,
      1897,
      1379,
      325,
      1364,
      1362,
      288,
      285,
      1334,
      1332,
      1330,
      241,
      238,
      234,
      1287,
      1285,
      1283,
      1280,
      1294,
      2112,
      188,
      185,
      181,
      178,
      2028,
      1219,
      1217,
      1215,
      1212,
      200,
      1209,
      1227,
      2074,
      2072,
      583,
      553,
      551,
      1583,
      505,
      503,
      500,
      513,
      1557,
      1555,
      444,
      442,
      439,
      436,
      2213,
      455,
      451,
      1507,
      1505,
      1502,
      796,
      763,
      762,
      760,
      767,
      711,
      710,
      708,
      706,
      2377,
      718,
      715,
      1710,
      2544,
      917,
      915,
      2681,
      1627,
      1597,
      1595,
      2325,
      1769,
      1749,
      1747,
      1499,
      1438,
      1435,
      2204,
      1390,
      1388,
      1385,
      1395,
      2169,
      2167,
      1704,
      1665,
      1662,
      1625,
      1623,
      1620,
      1770,
      1329,
      1282,
      1279,
      2109,
      1214,
      1207,
      1222,
      2068,
      2065,
      1149,
      1147,
      1144,
      1141,
      146,
      1157,
      1154,
      2013,
      2011,
      2008,
      2015,
      1579,
      1549,
      1546,
      1495,
      1487,
      1433,
      1431,
      1428,
      1425,
      388,
      1440,
      2205,
      1705,
      658,
      1667,
      1664,
      1119,
      1095,
      1093,
      1978,
      1057,
      1055,
      1052,
      1062,
      1962,
      1960,
      1005,
      1003,
      1e3,
      997,
      38,
      1013,
      1010,
      1932,
      1930,
      1927,
      1934,
      941,
      939,
      936,
      933,
      6,
      930,
      3,
      951,
      948,
      944,
      1889,
      1887,
      1884,
      1881,
      959,
      1893,
      1891,
      35,
      1377,
      1360,
      1358,
      1327,
      1325,
      1322,
      1331,
      1277,
      1275,
      1272,
      1269,
      235,
      1284,
      2110,
      1205,
      1204,
      1201,
      1198,
      182,
      1195,
      179,
      1213,
      2070,
      2067,
      1580,
      501,
      1551,
      1548,
      440,
      437,
      1497,
      1494,
      1490,
      1503,
      761,
      709,
      707,
      1706,
      913,
      912,
      2198,
      1386,
      2164,
      2161,
      1621,
      1766,
      2103,
      1208,
      2058,
      2054,
      1145,
      1142,
      2005,
      2002,
      1999,
      2009,
      1488,
      1429,
      1426,
      2200,
      1698,
      1659,
      1656,
      1975,
      1053,
      1957,
      1954,
      1001,
      998,
      1924,
      1921,
      1918,
      1928,
      937,
      934,
      931,
      1879,
      1876,
      1873,
      1870,
      945,
      1885,
      1882,
      1323,
      1273,
      1270,
      2105,
      1202,
      1199,
      1196,
      1211,
      2061,
      2057,
      1576,
      1543,
      1540,
      1484,
      1481,
      1478,
      1491,
      1700
    ]), r;
  }()
), ia = (
  /** @class */
  function() {
    function r(t, e) {
      this.bits = t, this.points = e;
    }
    return r.prototype.getBits = function() {
      return this.bits;
    }, r.prototype.getPoints = function() {
      return this.points;
    }, r;
  }()
), aa = globalThis && globalThis.__values || function(r) {
  var t = typeof Symbol == "function" && Symbol.iterator, e = t && r[t], n = 0;
  if (e)
    return e.call(r);
  if (r && typeof r.length == "number")
    return {
      next: function() {
        return r && n >= r.length && (r = void 0), { value: r && r[n++], done: !r };
      }
    };
  throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, oa = (
  /** @class */
  function() {
    function r() {
    }
    return r.detectMultiple = function(t, e, n) {
      var i = t.getBlackMatrix(), a = r.detect(n, i);
      return a.length || (i = i.clone(), i.rotate180(), a = r.detect(n, i)), new ia(i, a);
    }, r.detect = function(t, e) {
      for (var n, i, a = new Array(), o = 0, f = 0, s = !1; o < e.getHeight(); ) {
        var u = r.findVertices(e, o, f);
        if (u[0] == null && u[3] == null) {
          if (!s)
            break;
          s = !1, f = 0;
          try {
            for (var c = (n = void 0, aa(a)), l = c.next(); !l.done; l = c.next()) {
              var h = l.value;
              h[1] != null && (o = Math.trunc(Math.max(o, h[1].getY()))), h[3] != null && (o = Math.max(o, Math.trunc(h[3].getY())));
            }
          } catch (d) {
            n = { error: d };
          } finally {
            try {
              l && !l.done && (i = c.return) && i.call(c);
            } finally {
              if (n)
                throw n.error;
            }
          }
          o += r.ROW_STEP;
          continue;
        }
        if (s = !0, a.push(u), !t)
          break;
        u[2] != null ? (f = Math.trunc(u[2].getX()), o = Math.trunc(u[2].getY())) : (f = Math.trunc(u[4].getX()), o = Math.trunc(u[4].getY()));
      }
      return a;
    }, r.findVertices = function(t, e, n) {
      var i = t.getHeight(), a = t.getWidth(), o = new Array(8);
      return r.copyToResult(o, r.findRowsWithPattern(t, i, a, e, n, r.START_PATTERN), r.INDEXES_START_PATTERN), o[4] != null && (n = Math.trunc(o[4].getX()), e = Math.trunc(o[4].getY())), r.copyToResult(o, r.findRowsWithPattern(t, i, a, e, n, r.STOP_PATTERN), r.INDEXES_STOP_PATTERN), o;
    }, r.copyToResult = function(t, e, n) {
      for (var i = 0; i < n.length; i++)
        t[n[i]] = e[i];
    }, r.findRowsWithPattern = function(t, e, n, i, a, o) {
      for (var f = new Array(4), s = !1, u = new Int32Array(o.length); i < e; i += r.ROW_STEP) {
        var c = r.findGuardPattern(t, a, i, n, !1, o, u);
        if (c != null) {
          for (; i > 0; ) {
            var l = r.findGuardPattern(t, a, --i, n, !1, o, u);
            if (l != null)
              c = l;
            else {
              i++;
              break;
            }
          }
          f[0] = new O(c[0], i), f[1] = new O(c[1], i), s = !0;
          break;
        }
      }
      var h = i + 1;
      if (s) {
        for (var d = 0, l = Int32Array.from([Math.trunc(f[0].getX()), Math.trunc(f[1].getX())]); h < e; h++) {
          var c = r.findGuardPattern(t, l[0], h, n, !1, o, u);
          if (c != null && Math.abs(l[0] - c[0]) < r.MAX_PATTERN_DRIFT && Math.abs(l[1] - c[1]) < r.MAX_PATTERN_DRIFT)
            l = c, d = 0;
          else {
            if (d > r.SKIPPED_ROW_COUNT_MAX)
              break;
            d++;
          }
        }
        h -= d + 1, f[2] = new O(l[0], h), f[3] = new O(l[1], h);
      }
      return h - i < r.BARCODE_MIN_HEIGHT && ot.fill(f, null), f;
    }, r.findGuardPattern = function(t, e, n, i, a, o, f) {
      ot.fillWithin(f, 0, f.length, 0);
      for (var s = e, u = 0; t.get(s, n) && s > 0 && u++ < r.MAX_PIXEL_DRIFT; )
        s--;
      for (var c = s, l = 0, h = o.length, d = a; c < i; c++) {
        var v = t.get(c, n);
        if (v !== d)
          f[l]++;
        else {
          if (l === h - 1) {
            if (r.patternMatchVariance(f, o, r.MAX_INDIVIDUAL_VARIANCE) < r.MAX_AVG_VARIANCE)
              return new Int32Array([s, c]);
            s += f[0] + f[1], j.arraycopy(f, 2, f, 0, l - 1), f[l - 1] = 0, f[l] = 0, l--;
          } else
            l++;
          f[l] = 1, d = !d;
        }
      }
      return l === h - 1 && r.patternMatchVariance(f, o, r.MAX_INDIVIDUAL_VARIANCE) < r.MAX_AVG_VARIANCE ? new Int32Array([s, c - 1]) : null;
    }, r.patternMatchVariance = function(t, e, n) {
      for (var i = t.length, a = 0, o = 0, f = 0; f < i; f++)
        a += t[f], o += e[f];
      if (a < o)
        return (
          /*Float.POSITIVE_INFINITY*/
          1 / 0
        );
      var s = a / o;
      n *= s;
      for (var u = 0, c = 0; c < i; c++) {
        var l = t[c], h = e[c] * s, d = l > h ? l - h : h - l;
        if (d > n)
          return (
            /*Float.POSITIVE_INFINITY*/
            1 / 0
          );
        u += d;
      }
      return u / a;
    }, r.INDEXES_START_PATTERN = Int32Array.from([0, 4, 1, 5]), r.INDEXES_STOP_PATTERN = Int32Array.from([6, 2, 7, 3]), r.MAX_AVG_VARIANCE = 0.42, r.MAX_INDIVIDUAL_VARIANCE = 0.8, r.START_PATTERN = Int32Array.from([8, 1, 1, 1, 1, 1, 1, 3]), r.STOP_PATTERN = Int32Array.from([7, 1, 1, 3, 1, 1, 1, 2, 1]), r.MAX_PIXEL_DRIFT = 3, r.MAX_PATTERN_DRIFT = 5, r.SKIPPED_ROW_COUNT_MAX = 25, r.ROW_STEP = 5, r.BARCODE_MIN_HEIGHT = 10, r;
  }()
), fa = globalThis && globalThis.__values || function(r) {
  var t = typeof Symbol == "function" && Symbol.iterator, e = t && r[t], n = 0;
  if (e)
    return e.call(r);
  if (r && typeof r.length == "number")
    return {
      next: function() {
        return r && n >= r.length && (r = void 0), { value: r && r[n++], done: !r };
      }
    };
  throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, Ht = (
  /** @class */
  function() {
    function r(t, e) {
      if (e.length === 0)
        throw new D();
      this.field = t;
      var n = (
        /*int*/
        e.length
      );
      if (n > 1 && e[0] === 0) {
        for (var i = (
          /*int*/
          1
        ); i < n && e[i] === 0; )
          i++;
        i === n ? this.coefficients = new Int32Array([0]) : (this.coefficients = new Int32Array(n - i), j.arraycopy(e, i, this.coefficients, 0, this.coefficients.length));
      } else
        this.coefficients = e;
    }
    return r.prototype.getCoefficients = function() {
      return this.coefficients;
    }, r.prototype.getDegree = function() {
      return this.coefficients.length - 1;
    }, r.prototype.isZero = function() {
      return this.coefficients[0] === 0;
    }, r.prototype.getCoefficient = function(t) {
      return this.coefficients[this.coefficients.length - 1 - t];
    }, r.prototype.evaluateAt = function(t) {
      var e, n;
      if (t === 0)
        return this.getCoefficient(0);
      if (t === 1) {
        var i = (
          /*int*/
          0
        );
        try {
          for (var a = fa(this.coefficients), o = a.next(); !o.done; o = a.next()) {
            var f = o.value;
            i = this.field.add(i, f);
          }
        } catch (l) {
          e = { error: l };
        } finally {
          try {
            o && !o.done && (n = a.return) && n.call(a);
          } finally {
            if (e)
              throw e.error;
          }
        }
        return i;
      }
      for (var s = (
        /*int*/
        this.coefficients[0]
      ), u = (
        /*int*/
        this.coefficients.length
      ), c = 1; c < u; c++)
        s = this.field.add(this.field.multiply(t, s), this.coefficients[c]);
      return s;
    }, r.prototype.add = function(t) {
      if (!this.field.equals(t.field))
        throw new D("ModulusPolys do not have same ModulusGF field");
      if (this.isZero())
        return t;
      if (t.isZero())
        return this;
      var e = this.coefficients, n = t.coefficients;
      if (e.length > n.length) {
        var i = e;
        e = n, n = i;
      }
      var a = new Int32Array(n.length), o = (
        /*int*/
        n.length - e.length
      );
      j.arraycopy(n, 0, a, 0, o);
      for (var f = o; f < n.length; f++)
        a[f] = this.field.add(e[f - o], n[f]);
      return new r(this.field, a);
    }, r.prototype.subtract = function(t) {
      if (!this.field.equals(t.field))
        throw new D("ModulusPolys do not have same ModulusGF field");
      return t.isZero() ? this : this.add(t.negative());
    }, r.prototype.multiply = function(t) {
      return t instanceof r ? this.multiplyOther(t) : this.multiplyScalar(t);
    }, r.prototype.multiplyOther = function(t) {
      if (!this.field.equals(t.field))
        throw new D("ModulusPolys do not have same ModulusGF field");
      if (this.isZero() || t.isZero())
        return new r(this.field, new Int32Array([0]));
      for (var e = this.coefficients, n = (
        /*int*/
        e.length
      ), i = t.coefficients, a = (
        /*int*/
        i.length
      ), o = new Int32Array(n + a - 1), f = 0; f < n; f++)
        for (var s = (
          /*int*/
          e[f]
        ), u = 0; u < a; u++)
          o[f + u] = this.field.add(o[f + u], this.field.multiply(s, i[u]));
      return new r(this.field, o);
    }, r.prototype.negative = function() {
      for (var t = (
        /*int*/
        this.coefficients.length
      ), e = new Int32Array(t), n = 0; n < t; n++)
        e[n] = this.field.subtract(0, this.coefficients[n]);
      return new r(this.field, e);
    }, r.prototype.multiplyScalar = function(t) {
      if (t === 0)
        return new r(this.field, new Int32Array([0]));
      if (t === 1)
        return this;
      for (var e = (
        /*int*/
        this.coefficients.length
      ), n = new Int32Array(e), i = 0; i < e; i++)
        n[i] = this.field.multiply(this.coefficients[i], t);
      return new r(this.field, n);
    }, r.prototype.multiplyByMonomial = function(t, e) {
      if (t < 0)
        throw new D();
      if (e === 0)
        return new r(this.field, new Int32Array([0]));
      for (var n = (
        /*int*/
        this.coefficients.length
      ), i = new Int32Array(n + t), a = 0; a < n; a++)
        i[a] = this.field.multiply(this.coefficients[a], e);
      return new r(this.field, i);
    }, r.prototype.toString = function() {
      for (var t = new M(
        /*8 * this.getDegree()*/
      ), e = this.getDegree(); e >= 0; e--) {
        var n = (
          /*int*/
          this.getCoefficient(e)
        );
        n !== 0 && (n < 0 ? (t.append(" - "), n = -n) : t.length() > 0 && t.append(" + "), (e === 0 || n !== 1) && t.append(n), e !== 0 && (e === 1 ? t.append("x") : (t.append("x^"), t.append(e))));
      }
      return t.toString();
    }, r;
  }()
), sa = (
  /** @class */
  function() {
    function r() {
    }
    return r.prototype.add = function(t, e) {
      return (t + e) % this.modulus;
    }, r.prototype.subtract = function(t, e) {
      return (this.modulus + t - e) % this.modulus;
    }, r.prototype.exp = function(t) {
      return this.expTable[t];
    }, r.prototype.log = function(t) {
      if (t === 0)
        throw new D();
      return this.logTable[t];
    }, r.prototype.inverse = function(t) {
      if (t === 0)
        throw new Lr();
      return this.expTable[this.modulus - this.logTable[t] - 1];
    }, r.prototype.multiply = function(t, e) {
      return t === 0 || e === 0 ? 0 : this.expTable[(this.logTable[t] + this.logTable[e]) % (this.modulus - 1)];
    }, r.prototype.getSize = function() {
      return this.modulus;
    }, r.prototype.equals = function(t) {
      return t === this;
    }, r;
  }()
), ua = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), ca = (
  /** @class */
  function(r) {
    ua(t, r);
    function t(e, n) {
      var i = r.call(this) || this;
      i.modulus = e, i.expTable = new Int32Array(e), i.logTable = new Int32Array(e);
      for (var a = (
        /*int*/
        1
      ), o = 0; o < e; o++)
        i.expTable[o] = a, a = a * n % e;
      for (var o = 0; o < e - 1; o++)
        i.logTable[i.expTable[o]] = o;
      return i.zero = new Ht(i, new Int32Array([0])), i.one = new Ht(i, new Int32Array([1])), i;
    }
    return t.prototype.getZero = function() {
      return this.zero;
    }, t.prototype.getOne = function() {
      return this.one;
    }, t.prototype.buildMonomial = function(e, n) {
      if (e < 0)
        throw new D();
      if (n === 0)
        return this.zero;
      var i = new Int32Array(e + 1);
      return i[0] = n, new Ht(this, i);
    }, t.PDF417_GF = new t(k.NUMBER_OF_CODEWORDS, 3), t;
  }(sa)
), la = globalThis && globalThis.__values || function(r) {
  var t = typeof Symbol == "function" && Symbol.iterator, e = t && r[t], n = 0;
  if (e)
    return e.call(r);
  if (r && typeof r.length == "number")
    return {
      next: function() {
        return r && n >= r.length && (r = void 0), { value: r && r[n++], done: !r };
      }
    };
  throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, ha = (
  /** @class */
  function() {
    function r() {
      this.field = ca.PDF417_GF;
    }
    return r.prototype.decode = function(t, e, n) {
      for (var i, a, o = new Ht(this.field, t), f = new Int32Array(e), s = !1, u = e; u > 0; u--) {
        var c = o.evaluateAt(this.field.exp(u));
        f[e - u] = c, c !== 0 && (s = !0);
      }
      if (!s)
        return 0;
      var l = this.field.getOne();
      if (n != null)
        try {
          for (var h = la(n), d = h.next(); !d.done; d = h.next()) {
            var v = d.value, g = this.field.exp(t.length - 1 - v), x = new Ht(this.field, new Int32Array([this.field.subtract(0, g), 1]));
            l = l.multiply(x);
          }
        } catch (b) {
          i = { error: b };
        } finally {
          try {
            d && !d.done && (a = h.return) && a.call(h);
          } finally {
            if (i)
              throw i.error;
          }
        }
      for (var w = new Ht(this.field, f), y = this.runEuclideanAlgorithm(this.field.buildMonomial(e, 1), w, e), _ = y[0], E = y[1], m = this.findErrorLocations(_), I = this.findErrorMagnitudes(E, _, m), u = 0; u < m.length; u++) {
        var S = t.length - 1 - this.field.log(m[u]);
        if (S < 0)
          throw et.getChecksumInstance();
        t[S] = this.field.subtract(t[S], I[u]);
      }
      return m.length;
    }, r.prototype.runEuclideanAlgorithm = function(t, e, n) {
      if (t.getDegree() < e.getDegree()) {
        var i = t;
        t = e, e = i;
      }
      for (var a = t, o = e, f = this.field.getZero(), s = this.field.getOne(); o.getDegree() >= Math.round(n / 2); ) {
        var u = a, c = f;
        if (a = o, f = s, a.isZero())
          throw et.getChecksumInstance();
        o = u;
        for (var l = this.field.getZero(), h = a.getCoefficient(a.getDegree()), d = this.field.inverse(h); o.getDegree() >= a.getDegree() && !o.isZero(); ) {
          var v = o.getDegree() - a.getDegree(), g = this.field.multiply(o.getCoefficient(o.getDegree()), d);
          l = l.add(this.field.buildMonomial(v, g)), o = o.subtract(a.multiplyByMonomial(v, g));
        }
        s = l.multiply(f).subtract(c).negative();
      }
      var x = s.getCoefficient(0);
      if (x === 0)
        throw et.getChecksumInstance();
      var w = this.field.inverse(x), y = s.multiply(w), _ = o.multiply(w);
      return [y, _];
    }, r.prototype.findErrorLocations = function(t) {
      for (var e = t.getDegree(), n = new Int32Array(e), i = 0, a = 1; a < this.field.getSize() && i < e; a++)
        t.evaluateAt(a) === 0 && (n[i] = this.field.inverse(a), i++);
      if (i !== e)
        throw et.getChecksumInstance();
      return n;
    }, r.prototype.findErrorMagnitudes = function(t, e, n) {
      for (var i = e.getDegree(), a = new Int32Array(i), o = 1; o <= i; o++)
        a[i - o] = this.field.multiply(o, e.getCoefficient(o));
      for (var f = new Ht(this.field, a), s = n.length, u = new Int32Array(s), o = 0; o < s; o++) {
        var c = this.field.inverse(n[o]), l = this.field.subtract(0, t.evaluateAt(c)), h = this.field.inverse(f.evaluateAt(c));
        u[o] = this.field.multiply(l, h);
      }
      return u;
    }, r;
  }()
), He = (
  /** @class */
  function() {
    function r(t, e, n, i, a) {
      t instanceof r ? this.constructor_2(t) : this.constructor_1(t, e, n, i, a);
    }
    return r.prototype.constructor_1 = function(t, e, n, i, a) {
      var o = e == null || n == null, f = i == null || a == null;
      if (o && f)
        throw new C();
      o ? (e = new O(0, i.getY()), n = new O(0, a.getY())) : f && (i = new O(t.getWidth() - 1, e.getY()), a = new O(t.getWidth() - 1, n.getY())), this.image = t, this.topLeft = e, this.bottomLeft = n, this.topRight = i, this.bottomRight = a, this.minX = Math.trunc(Math.min(e.getX(), n.getX())), this.maxX = Math.trunc(Math.max(i.getX(), a.getX())), this.minY = Math.trunc(Math.min(e.getY(), i.getY())), this.maxY = Math.trunc(Math.max(n.getY(), a.getY()));
    }, r.prototype.constructor_2 = function(t) {
      this.image = t.image, this.topLeft = t.getTopLeft(), this.bottomLeft = t.getBottomLeft(), this.topRight = t.getTopRight(), this.bottomRight = t.getBottomRight(), this.minX = t.getMinX(), this.maxX = t.getMaxX(), this.minY = t.getMinY(), this.maxY = t.getMaxY();
    }, r.merge = function(t, e) {
      return t == null ? e : e == null ? t : new r(t.image, t.topLeft, t.bottomLeft, e.topRight, e.bottomRight);
    }, r.prototype.addMissingRows = function(t, e, n) {
      var i = this.topLeft, a = this.bottomLeft, o = this.topRight, f = this.bottomRight;
      if (t > 0) {
        var s = n ? this.topLeft : this.topRight, u = Math.trunc(s.getY() - t);
        u < 0 && (u = 0);
        var c = new O(s.getX(), u);
        n ? i = c : o = c;
      }
      if (e > 0) {
        var l = n ? this.bottomLeft : this.bottomRight, h = Math.trunc(l.getY() + e);
        h >= this.image.getHeight() && (h = this.image.getHeight() - 1);
        var d = new O(l.getX(), h);
        n ? a = d : f = d;
      }
      return new r(this.image, i, a, o, f);
    }, r.prototype.getMinX = function() {
      return this.minX;
    }, r.prototype.getMaxX = function() {
      return this.maxX;
    }, r.prototype.getMinY = function() {
      return this.minY;
    }, r.prototype.getMaxY = function() {
      return this.maxY;
    }, r.prototype.getTopLeft = function() {
      return this.topLeft;
    }, r.prototype.getTopRight = function() {
      return this.topRight;
    }, r.prototype.getBottomLeft = function() {
      return this.bottomLeft;
    }, r.prototype.getBottomRight = function() {
      return this.bottomRight;
    }, r;
  }()
), da = (
  /** @class */
  function() {
    function r(t, e, n, i) {
      this.columnCount = t, this.errorCorrectionLevel = i, this.rowCountUpperPart = e, this.rowCountLowerPart = n, this.rowCount = e + n;
    }
    return r.prototype.getColumnCount = function() {
      return this.columnCount;
    }, r.prototype.getErrorCorrectionLevel = function() {
      return this.errorCorrectionLevel;
    }, r.prototype.getRowCount = function() {
      return this.rowCount;
    }, r.prototype.getRowCountUpperPart = function() {
      return this.rowCountUpperPart;
    }, r.prototype.getRowCountLowerPart = function() {
      return this.rowCountLowerPart;
    }, r;
  }()
), $e = (
  /** @class */
  function() {
    function r() {
      this.buffer = "";
    }
    return r.form = function(t, e) {
      var n = -1;
      function i(o, f, s, u, c, l) {
        if (o === "%%")
          return "%";
        if (e[++n] !== void 0) {
          o = u ? parseInt(u.substr(1)) : void 0;
          var h = c ? parseInt(c.substr(1)) : void 0, d;
          switch (l) {
            case "s":
              d = e[n];
              break;
            case "c":
              d = e[n][0];
              break;
            case "f":
              d = parseFloat(e[n]).toFixed(o);
              break;
            case "p":
              d = parseFloat(e[n]).toPrecision(o);
              break;
            case "e":
              d = parseFloat(e[n]).toExponential(o);
              break;
            case "x":
              d = parseInt(e[n]).toString(h || 16);
              break;
            case "d":
              d = parseFloat(parseInt(e[n], h || 10).toPrecision(o)).toFixed(0);
              break;
          }
          d = typeof d == "object" ? JSON.stringify(d) : (+d).toString(h);
          for (var v = parseInt(s), g = s && s[0] + "" == "0" ? "0" : " "; d.length < v; )
            d = f !== void 0 ? d + g : g + d;
          return d;
        }
      }
      var a = /%(-)?(0?[0-9]+)?([.][0-9]+)?([#][0-9]+)?([scfpexd%])/g;
      return t.replace(a, i);
    }, r.prototype.format = function(t) {
      for (var e = [], n = 1; n < arguments.length; n++)
        e[n - 1] = arguments[n];
      this.buffer += r.form(t, e);
    }, r.prototype.toString = function() {
      return this.buffer;
    }, r;
  }()
), va = globalThis && globalThis.__values || function(r) {
  var t = typeof Symbol == "function" && Symbol.iterator, e = t && r[t], n = 0;
  if (e)
    return e.call(r);
  if (r && typeof r.length == "number")
    return {
      next: function() {
        return r && n >= r.length && (r = void 0), { value: r && r[n++], done: !r };
      }
    };
  throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, zr = (
  /** @class */
  function() {
    function r(t) {
      this.boundingBox = new He(t), this.codewords = new Array(t.getMaxY() - t.getMinY() + 1);
    }
    return r.prototype.getCodewordNearby = function(t) {
      var e = this.getCodeword(t);
      if (e != null)
        return e;
      for (var n = 1; n < r.MAX_NEARBY_DISTANCE; n++) {
        var i = this.imageRowToCodewordIndex(t) - n;
        if (i >= 0 && (e = this.codewords[i], e != null) || (i = this.imageRowToCodewordIndex(t) + n, i < this.codewords.length && (e = this.codewords[i], e != null)))
          return e;
      }
      return null;
    }, r.prototype.imageRowToCodewordIndex = function(t) {
      return t - this.boundingBox.getMinY();
    }, r.prototype.setCodeword = function(t, e) {
      this.codewords[this.imageRowToCodewordIndex(t)] = e;
    }, r.prototype.getCodeword = function(t) {
      return this.codewords[this.imageRowToCodewordIndex(t)];
    }, r.prototype.getBoundingBox = function() {
      return this.boundingBox;
    }, r.prototype.getCodewords = function() {
      return this.codewords;
    }, r.prototype.toString = function() {
      var t, e, n = new $e(), i = 0;
      try {
        for (var a = va(this.codewords), o = a.next(); !o.done; o = a.next()) {
          var f = o.value;
          if (f == null) {
            n.format("%3d:    |   %n", i++);
            continue;
          }
          n.format("%3d: %3d|%3d%n", i++, f.getRowNumber(), f.getValue());
        }
      } catch (s) {
        t = { error: s };
      } finally {
        try {
          o && !o.done && (e = a.return) && e.call(a);
        } finally {
          if (t)
            throw t.error;
        }
      }
      return n.toString();
    }, r.MAX_NEARBY_DISTANCE = 5, r;
  }()
), pa = globalThis && globalThis.__values || function(r) {
  var t = typeof Symbol == "function" && Symbol.iterator, e = t && r[t], n = 0;
  if (e)
    return e.call(r);
  if (r && typeof r.length == "number")
    return {
      next: function() {
        return r && n >= r.length && (r = void 0), { value: r && r[n++], done: !r };
      }
    };
  throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, ga = globalThis && globalThis.__read || function(r, t) {
  var e = typeof Symbol == "function" && r[Symbol.iterator];
  if (!e)
    return r;
  var n = e.call(r), i, a = [], o;
  try {
    for (; (t === void 0 || t-- > 0) && !(i = n.next()).done; )
      a.push(i.value);
  } catch (f) {
    o = { error: f };
  } finally {
    try {
      i && !i.done && (e = n.return) && e.call(n);
    } finally {
      if (o)
        throw o.error;
    }
  }
  return a;
}, re = (
  /** @class */
  function() {
    function r() {
      this.values = /* @__PURE__ */ new Map();
    }
    return r.prototype.setValue = function(t) {
      t = Math.trunc(t);
      var e = this.values.get(t);
      e == null && (e = 0), e++, this.values.set(t, e);
    }, r.prototype.getValue = function() {
      var t, e, n = -1, i = new Array(), a = function(l, h) {
        var d = {
          getKey: function() {
            return l;
          },
          getValue: function() {
            return h;
          }
        };
        d.getValue() > n ? (n = d.getValue(), i = [], i.push(d.getKey())) : d.getValue() === n && i.push(d.getKey());
      };
      try {
        for (var o = pa(this.values.entries()), f = o.next(); !f.done; f = o.next()) {
          var s = ga(f.value, 2), u = s[0], c = s[1];
          a(u, c);
        }
      } catch (l) {
        t = { error: l };
      } finally {
        try {
          f && !f.done && (e = o.return) && e.call(o);
        } finally {
          if (t)
            throw t.error;
        }
      }
      return k.toIntArray(i);
    }, r.prototype.getConfidence = function(t) {
      return this.values.get(t);
    }, r;
  }()
), xa = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), be = globalThis && globalThis.__values || function(r) {
  var t = typeof Symbol == "function" && Symbol.iterator, e = t && r[t], n = 0;
  if (e)
    return e.call(r);
  if (r && typeof r.length == "number")
    return {
      next: function() {
        return r && n >= r.length && (r = void 0), { value: r && r[n++], done: !r };
      }
    };
  throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, wr = (
  /** @class */
  function(r) {
    xa(t, r);
    function t(e, n) {
      var i = r.call(this, e) || this;
      return i._isLeft = n, i;
    }
    return t.prototype.setRowNumbers = function() {
      var e, n;
      try {
        for (var i = be(this.getCodewords()), a = i.next(); !a.done; a = i.next()) {
          var o = a.value;
          o != null && o.setRowNumberAsRowIndicatorColumn();
        }
      } catch (f) {
        e = { error: f };
      } finally {
        try {
          a && !a.done && (n = i.return) && n.call(i);
        } finally {
          if (e)
            throw e.error;
        }
      }
    }, t.prototype.adjustCompleteIndicatorColumnRowNumbers = function(e) {
      var n = this.getCodewords();
      this.setRowNumbers(), this.removeIncorrectCodewords(n, e);
      for (var i = this.getBoundingBox(), a = this._isLeft ? i.getTopLeft() : i.getTopRight(), o = this._isLeft ? i.getBottomLeft() : i.getBottomRight(), f = this.imageRowToCodewordIndex(Math.trunc(a.getY())), s = this.imageRowToCodewordIndex(Math.trunc(o.getY())), u = -1, c = 1, l = 0, h = f; h < s; h++)
        if (n[h] != null) {
          var d = n[h], v = d.getRowNumber() - u;
          if (v === 0)
            l++;
          else if (v === 1)
            c = Math.max(c, l), l = 1, u = d.getRowNumber();
          else if (v < 0 || d.getRowNumber() >= e.getRowCount() || v > h)
            n[h] = null;
          else {
            var g = void 0;
            c > 2 ? g = (c - 2) * v : g = v;
            for (var x = g >= h, w = 1; w <= g && !x; w++)
              x = n[h - w] != null;
            x ? n[h] = null : (u = d.getRowNumber(), l = 1);
          }
        }
    }, t.prototype.getRowHeights = function() {
      var e, n, i = this.getBarcodeMetadata();
      if (i == null)
        return null;
      this.adjustIncompleteIndicatorColumnRowNumbers(i);
      var a = new Int32Array(i.getRowCount());
      try {
        for (var o = be(this.getCodewords()), f = o.next(); !f.done; f = o.next()) {
          var s = f.value;
          if (s != null) {
            var u = s.getRowNumber();
            if (u >= a.length)
              continue;
            a[u]++;
          }
        }
      } catch (c) {
        e = { error: c };
      } finally {
        try {
          f && !f.done && (n = o.return) && n.call(o);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return a;
    }, t.prototype.adjustIncompleteIndicatorColumnRowNumbers = function(e) {
      for (var n = this.getBoundingBox(), i = this._isLeft ? n.getTopLeft() : n.getTopRight(), a = this._isLeft ? n.getBottomLeft() : n.getBottomRight(), o = this.imageRowToCodewordIndex(Math.trunc(i.getY())), f = this.imageRowToCodewordIndex(Math.trunc(a.getY())), s = this.getCodewords(), u = -1, c = o; c < f; c++)
        if (s[c] != null) {
          var l = s[c];
          l.setRowNumberAsRowIndicatorColumn();
          var h = l.getRowNumber() - u;
          h === 0 || (h === 1 ? u = l.getRowNumber() : l.getRowNumber() >= e.getRowCount() ? s[c] = null : u = l.getRowNumber());
        }
    }, t.prototype.getBarcodeMetadata = function() {
      var e, n, i = this.getCodewords(), a = new re(), o = new re(), f = new re(), s = new re();
      try {
        for (var u = be(i), c = u.next(); !c.done; c = u.next()) {
          var l = c.value;
          if (l != null) {
            l.setRowNumberAsRowIndicatorColumn();
            var h = l.getValue() % 30, d = l.getRowNumber();
            switch (this._isLeft || (d += 2), d % 3) {
              case 0:
                o.setValue(h * 3 + 1);
                break;
              case 1:
                s.setValue(h / 3), f.setValue(h % 3);
                break;
              case 2:
                a.setValue(h + 1);
                break;
            }
          }
        }
      } catch (g) {
        e = { error: g };
      } finally {
        try {
          c && !c.done && (n = u.return) && n.call(u);
        } finally {
          if (e)
            throw e.error;
        }
      }
      if (a.getValue().length === 0 || o.getValue().length === 0 || f.getValue().length === 0 || s.getValue().length === 0 || a.getValue()[0] < 1 || o.getValue()[0] + f.getValue()[0] < k.MIN_ROWS_IN_BARCODE || o.getValue()[0] + f.getValue()[0] > k.MAX_ROWS_IN_BARCODE)
        return null;
      var v = new da(a.getValue()[0], o.getValue()[0], f.getValue()[0], s.getValue()[0]);
      return this.removeIncorrectCodewords(i, v), v;
    }, t.prototype.removeIncorrectCodewords = function(e, n) {
      for (var i = 0; i < e.length; i++) {
        var a = e[i];
        if (e[i] != null) {
          var o = a.getValue() % 30, f = a.getRowNumber();
          if (f > n.getRowCount()) {
            e[i] = null;
            continue;
          }
          switch (this._isLeft || (f += 2), f % 3) {
            case 0:
              o * 3 + 1 !== n.getRowCountUpperPart() && (e[i] = null);
              break;
            case 1:
              (Math.trunc(o / 3) !== n.getErrorCorrectionLevel() || o % 3 !== n.getRowCountLowerPart()) && (e[i] = null);
              break;
            case 2:
              o + 1 !== n.getColumnCount() && (e[i] = null);
              break;
          }
        }
      }
    }, t.prototype.isLeft = function() {
      return this._isLeft;
    }, t.prototype.toString = function() {
      return "IsLeft: " + this._isLeft + `
` + r.prototype.toString.call(this);
    }, t;
  }(zr)
), ya = globalThis && globalThis.__values || function(r) {
  var t = typeof Symbol == "function" && Symbol.iterator, e = t && r[t], n = 0;
  if (e)
    return e.call(r);
  if (r && typeof r.length == "number")
    return {
      next: function() {
        return r && n >= r.length && (r = void 0), { value: r && r[n++], done: !r };
      }
    };
  throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, wa = (
  /** @class */
  function() {
    function r(t, e) {
      this.ADJUST_ROW_NUMBER_SKIP = 2, this.barcodeMetadata = t, this.barcodeColumnCount = t.getColumnCount(), this.boundingBox = e, this.detectionResultColumns = new Array(this.barcodeColumnCount + 2);
    }
    return r.prototype.getDetectionResultColumns = function() {
      this.adjustIndicatorColumnRowNumbers(this.detectionResultColumns[0]), this.adjustIndicatorColumnRowNumbers(this.detectionResultColumns[this.barcodeColumnCount + 1]);
      var t = k.MAX_CODEWORDS_IN_BARCODE, e;
      do
        e = t, t = this.adjustRowNumbersAndGetCount();
      while (t > 0 && t < e);
      return this.detectionResultColumns;
    }, r.prototype.adjustIndicatorColumnRowNumbers = function(t) {
      t != null && t.adjustCompleteIndicatorColumnRowNumbers(this.barcodeMetadata);
    }, r.prototype.adjustRowNumbersAndGetCount = function() {
      var t = this.adjustRowNumbersByRow();
      if (t === 0)
        return 0;
      for (var e = 1; e < this.barcodeColumnCount + 1; e++)
        for (var n = this.detectionResultColumns[e].getCodewords(), i = 0; i < n.length; i++)
          n[i] != null && (n[i].hasValidRowNumber() || this.adjustRowNumbers(e, i, n));
      return t;
    }, r.prototype.adjustRowNumbersByRow = function() {
      this.adjustRowNumbersFromBothRI();
      var t = this.adjustRowNumbersFromLRI();
      return t + this.adjustRowNumbersFromRRI();
    }, r.prototype.adjustRowNumbersFromBothRI = function() {
      if (!(this.detectionResultColumns[0] == null || this.detectionResultColumns[this.barcodeColumnCount + 1] == null)) {
        for (var t = this.detectionResultColumns[0].getCodewords(), e = this.detectionResultColumns[this.barcodeColumnCount + 1].getCodewords(), n = 0; n < t.length; n++)
          if (t[n] != null && e[n] != null && t[n].getRowNumber() === e[n].getRowNumber())
            for (var i = 1; i <= this.barcodeColumnCount; i++) {
              var a = this.detectionResultColumns[i].getCodewords()[n];
              a != null && (a.setRowNumber(t[n].getRowNumber()), a.hasValidRowNumber() || (this.detectionResultColumns[i].getCodewords()[n] = null));
            }
      }
    }, r.prototype.adjustRowNumbersFromRRI = function() {
      if (this.detectionResultColumns[this.barcodeColumnCount + 1] == null)
        return 0;
      for (var t = 0, e = this.detectionResultColumns[this.barcodeColumnCount + 1].getCodewords(), n = 0; n < e.length; n++)
        if (e[n] != null)
          for (var i = e[n].getRowNumber(), a = 0, o = this.barcodeColumnCount + 1; o > 0 && a < this.ADJUST_ROW_NUMBER_SKIP; o--) {
            var f = this.detectionResultColumns[o].getCodewords()[n];
            f != null && (a = r.adjustRowNumberIfValid(i, a, f), f.hasValidRowNumber() || t++);
          }
      return t;
    }, r.prototype.adjustRowNumbersFromLRI = function() {
      if (this.detectionResultColumns[0] == null)
        return 0;
      for (var t = 0, e = this.detectionResultColumns[0].getCodewords(), n = 0; n < e.length; n++)
        if (e[n] != null)
          for (var i = e[n].getRowNumber(), a = 0, o = 1; o < this.barcodeColumnCount + 1 && a < this.ADJUST_ROW_NUMBER_SKIP; o++) {
            var f = this.detectionResultColumns[o].getCodewords()[n];
            f != null && (a = r.adjustRowNumberIfValid(i, a, f), f.hasValidRowNumber() || t++);
          }
      return t;
    }, r.adjustRowNumberIfValid = function(t, e, n) {
      return n == null || n.hasValidRowNumber() || (n.isValidRowNumber(t) ? (n.setRowNumber(t), e = 0) : ++e), e;
    }, r.prototype.adjustRowNumbers = function(t, e, n) {
      var i, a;
      if (this.detectionResultColumns[t - 1] != null) {
        var o = n[e], f = this.detectionResultColumns[t - 1].getCodewords(), s = f;
        this.detectionResultColumns[t + 1] != null && (s = this.detectionResultColumns[t + 1].getCodewords());
        var u = new Array(14);
        u[2] = f[e], u[3] = s[e], e > 0 && (u[0] = n[e - 1], u[4] = f[e - 1], u[5] = s[e - 1]), e > 1 && (u[8] = n[e - 2], u[10] = f[e - 2], u[11] = s[e - 2]), e < n.length - 1 && (u[1] = n[e + 1], u[6] = f[e + 1], u[7] = s[e + 1]), e < n.length - 2 && (u[9] = n[e + 2], u[12] = f[e + 2], u[13] = s[e + 2]);
        try {
          for (var c = ya(u), l = c.next(); !l.done; l = c.next()) {
            var h = l.value;
            if (r.adjustRowNumber(o, h))
              return;
          }
        } catch (d) {
          i = { error: d };
        } finally {
          try {
            l && !l.done && (a = c.return) && a.call(c);
          } finally {
            if (i)
              throw i.error;
          }
        }
      }
    }, r.adjustRowNumber = function(t, e) {
      return e == null ? !1 : e.hasValidRowNumber() && e.getBucket() === t.getBucket() ? (t.setRowNumber(e.getRowNumber()), !0) : !1;
    }, r.prototype.getBarcodeColumnCount = function() {
      return this.barcodeColumnCount;
    }, r.prototype.getBarcodeRowCount = function() {
      return this.barcodeMetadata.getRowCount();
    }, r.prototype.getBarcodeECLevel = function() {
      return this.barcodeMetadata.getErrorCorrectionLevel();
    }, r.prototype.setBoundingBox = function(t) {
      this.boundingBox = t;
    }, r.prototype.getBoundingBox = function() {
      return this.boundingBox;
    }, r.prototype.setDetectionResultColumn = function(t, e) {
      this.detectionResultColumns[t] = e;
    }, r.prototype.getDetectionResultColumn = function(t) {
      return this.detectionResultColumns[t];
    }, r.prototype.toString = function() {
      var t = this.detectionResultColumns[0];
      t == null && (t = this.detectionResultColumns[this.barcodeColumnCount + 1]);
      for (var e = new $e(), n = 0; n < t.getCodewords().length; n++) {
        e.format("CW %3d:", n);
        for (var i = 0; i < this.barcodeColumnCount + 2; i++) {
          if (this.detectionResultColumns[i] == null) {
            e.format("    |   ");
            continue;
          }
          var a = this.detectionResultColumns[i].getCodewords()[n];
          if (a == null) {
            e.format("    |   ");
            continue;
          }
          e.format(" %3d|%3d", a.getRowNumber(), a.getValue());
        }
        e.format("%n");
      }
      return e.toString();
    }, r;
  }()
), _a = (
  /** @class */
  function() {
    function r(t, e, n, i) {
      this.rowNumber = r.BARCODE_ROW_UNKNOWN, this.startX = Math.trunc(t), this.endX = Math.trunc(e), this.bucket = Math.trunc(n), this.value = Math.trunc(i);
    }
    return r.prototype.hasValidRowNumber = function() {
      return this.isValidRowNumber(this.rowNumber);
    }, r.prototype.isValidRowNumber = function(t) {
      return t !== r.BARCODE_ROW_UNKNOWN && this.bucket === t % 3 * 3;
    }, r.prototype.setRowNumberAsRowIndicatorColumn = function() {
      this.rowNumber = Math.trunc(Math.trunc(this.value / 30) * 3 + Math.trunc(this.bucket / 3));
    }, r.prototype.getWidth = function() {
      return this.endX - this.startX;
    }, r.prototype.getStartX = function() {
      return this.startX;
    }, r.prototype.getEndX = function() {
      return this.endX;
    }, r.prototype.getBucket = function() {
      return this.bucket;
    }, r.prototype.getValue = function() {
      return this.value;
    }, r.prototype.getRowNumber = function() {
      return this.rowNumber;
    }, r.prototype.setRowNumber = function(t) {
      this.rowNumber = t;
    }, r.prototype.toString = function() {
      return this.rowNumber + "|" + this.value;
    }, r.BARCODE_ROW_UNKNOWN = -1, r;
  }()
), Aa = (
  /** @class */
  function() {
    function r() {
    }
    return r.initialize = function() {
      for (var t = 0; t < k.SYMBOL_TABLE.length; t++)
        for (var e = k.SYMBOL_TABLE[t], n = e & 1, i = 0; i < k.BARS_IN_MODULE; i++) {
          for (var a = 0; (e & 1) === n; )
            a += 1, e >>= 1;
          n = e & 1, r.RATIOS_TABLE[t] || (r.RATIOS_TABLE[t] = new Array(k.BARS_IN_MODULE)), r.RATIOS_TABLE[t][k.BARS_IN_MODULE - i - 1] = Math.fround(a / k.MODULES_IN_CODEWORD);
        }
      this.bSymbolTableReady = !0;
    }, r.getDecodedValue = function(t) {
      var e = r.getDecodedCodewordValue(r.sampleBitCounts(t));
      return e !== -1 ? e : r.getClosestDecodedValue(t);
    }, r.sampleBitCounts = function(t) {
      for (var e = U.sum(t), n = new Int32Array(k.BARS_IN_MODULE), i = 0, a = 0, o = 0; o < k.MODULES_IN_CODEWORD; o++) {
        var f = e / (2 * k.MODULES_IN_CODEWORD) + o * e / k.MODULES_IN_CODEWORD;
        a + t[i] <= f && (a += t[i], i++), n[i]++;
      }
      return n;
    }, r.getDecodedCodewordValue = function(t) {
      var e = r.getBitValue(t);
      return k.getCodeword(e) === -1 ? -1 : e;
    }, r.getBitValue = function(t) {
      for (var e = (
        /*long*/
        0
      ), n = 0; n < t.length; n++)
        for (var i = 0; i < t[n]; i++)
          e = e << 1 | (n % 2 === 0 ? 1 : 0);
      return Math.trunc(e);
    }, r.getClosestDecodedValue = function(t) {
      var e = U.sum(t), n = new Array(k.BARS_IN_MODULE);
      if (e > 1)
        for (var i = 0; i < n.length; i++)
          n[i] = Math.fround(t[i] / e);
      var a = Le.MAX_VALUE, o = -1;
      this.bSymbolTableReady || r.initialize();
      for (var f = 0; f < r.RATIOS_TABLE.length; f++) {
        for (var s = 0, u = r.RATIOS_TABLE[f], c = 0; c < k.BARS_IN_MODULE; c++) {
          var l = Math.fround(u[c] - n[c]);
          if (s += Math.fround(l * l), s >= a)
            break;
        }
        s < a && (a = s, o = k.SYMBOL_TABLE[f]);
      }
      return o;
    }, r.bSymbolTableReady = !1, r.RATIOS_TABLE = new Array(k.SYMBOL_TABLE.length).map(function(t) {
      return new Array(k.BARS_IN_MODULE);
    }), r;
  }()
), Ea = (
  /** @class */
  function() {
    function r() {
      this.segmentCount = -1, this.fileSize = -1, this.timestamp = -1, this.checksum = -1;
    }
    return r.prototype.getSegmentIndex = function() {
      return this.segmentIndex;
    }, r.prototype.setSegmentIndex = function(t) {
      this.segmentIndex = t;
    }, r.prototype.getFileId = function() {
      return this.fileId;
    }, r.prototype.setFileId = function(t) {
      this.fileId = t;
    }, r.prototype.getOptionalData = function() {
      return this.optionalData;
    }, r.prototype.setOptionalData = function(t) {
      this.optionalData = t;
    }, r.prototype.isLastSegment = function() {
      return this.lastSegment;
    }, r.prototype.setLastSegment = function(t) {
      this.lastSegment = t;
    }, r.prototype.getSegmentCount = function() {
      return this.segmentCount;
    }, r.prototype.setSegmentCount = function(t) {
      this.segmentCount = t;
    }, r.prototype.getSender = function() {
      return this.sender || null;
    }, r.prototype.setSender = function(t) {
      this.sender = t;
    }, r.prototype.getAddressee = function() {
      return this.addressee || null;
    }, r.prototype.setAddressee = function(t) {
      this.addressee = t;
    }, r.prototype.getFileName = function() {
      return this.fileName;
    }, r.prototype.setFileName = function(t) {
      this.fileName = t;
    }, r.prototype.getFileSize = function() {
      return this.fileSize;
    }, r.prototype.setFileSize = function(t) {
      this.fileSize = t;
    }, r.prototype.getChecksum = function() {
      return this.checksum;
    }, r.prototype.setChecksum = function(t) {
      this.checksum = t;
    }, r.prototype.getTimestamp = function() {
      return this.timestamp;
    }, r.prototype.setTimestamp = function(t) {
      this.timestamp = t;
    }, r;
  }()
), _r = (
  /** @class */
  function() {
    function r() {
    }
    return r.parseLong = function(t, e) {
      return e === void 0 && (e = void 0), parseInt(t, e);
    }, r;
  }()
), Ca = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), ma = (
  /** @class */
  function(r) {
    Ca(t, r);
    function t() {
      return r !== null && r.apply(this, arguments) || this;
    }
    return t.kind = "NullPointerException", t;
  }(At)
), Ia = (
  /** @class */
  function() {
    function r() {
    }
    return r.prototype.writeBytes = function(t) {
      this.writeBytesOffset(t, 0, t.length);
    }, r.prototype.writeBytesOffset = function(t, e, n) {
      if (t == null)
        throw new ma();
      if (e < 0 || e > t.length || n < 0 || e + n > t.length || e + n < 0)
        throw new ze();
      if (n === 0)
        return;
      for (var i = 0; i < n; i++)
        this.write(t[e + i]);
    }, r.prototype.flush = function() {
    }, r.prototype.close = function() {
    }, r;
  }()
), Sa = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), Ta = (
  /** @class */
  function(r) {
    Sa(t, r);
    function t() {
      return r !== null && r.apply(this, arguments) || this;
    }
    return t;
  }(At)
), ba = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), Oa = (
  /** @class */
  function(r) {
    ba(t, r);
    function t(e) {
      e === void 0 && (e = 32);
      var n = r.call(this) || this;
      if (n.count = 0, e < 0)
        throw new D("Negative initial size: " + e);
      return n.buf = new Uint8Array(e), n;
    }
    return t.prototype.ensureCapacity = function(e) {
      e - this.buf.length > 0 && this.grow(e);
    }, t.prototype.grow = function(e) {
      var n = this.buf.length, i = n << 1;
      if (i - e < 0 && (i = e), i < 0) {
        if (e < 0)
          throw new Ta();
        i = B.MAX_VALUE;
      }
      this.buf = ot.copyOfUint8Array(this.buf, i);
    }, t.prototype.write = function(e) {
      this.ensureCapacity(this.count + 1), this.buf[this.count] = /*(byte)*/
      e, this.count += 1;
    }, t.prototype.writeBytesOffset = function(e, n, i) {
      if (n < 0 || n > e.length || i < 0 || n + i - e.length > 0)
        throw new ze();
      this.ensureCapacity(this.count + i), j.arraycopy(e, n, this.buf, this.count, i), this.count += i;
    }, t.prototype.writeTo = function(e) {
      e.writeBytesOffset(this.buf, 0, this.count);
    }, t.prototype.reset = function() {
      this.count = 0;
    }, t.prototype.toByteArray = function() {
      return ot.copyOfUint8Array(this.buf, this.count);
    }, t.prototype.size = function() {
      return this.count;
    }, t.prototype.toString = function(e) {
      return e ? typeof e == "string" ? this.toString_string(e) : this.toString_number(e) : this.toString_void();
    }, t.prototype.toString_void = function() {
      return new String(
        this.buf
        /*, 0, this.count*/
      ).toString();
    }, t.prototype.toString_string = function(e) {
      return new String(
        this.buf
        /*, 0, this.count, charsetName*/
      ).toString();
    }, t.prototype.toString_number = function(e) {
      return new String(
        this.buf
        /*, hibyte, 0, this.count*/
      ).toString();
    }, t.prototype.close = function() {
    }, t;
  }(Ia)
), z;
(function(r) {
  r[r.ALPHA = 0] = "ALPHA", r[r.LOWER = 1] = "LOWER", r[r.MIXED = 2] = "MIXED", r[r.PUNCT = 3] = "PUNCT", r[r.ALPHA_SHIFT = 4] = "ALPHA_SHIFT", r[r.PUNCT_SHIFT = 5] = "PUNCT_SHIFT";
})(z || (z = {}));
function jr() {
  if (typeof window < "u")
    return window.BigInt || null;
  if (typeof global < "u")
    return global.BigInt || null;
  if (typeof self < "u")
    return self.BigInt || null;
  throw new Error("Can't search globals for BigInt!");
}
var fe;
function Bt(r) {
  if (typeof fe > "u" && (fe = jr()), fe === null)
    throw new Error("BigInt is not supported!");
  return fe(r);
}
function Da() {
  var r = [];
  r[0] = Bt(1);
  var t = Bt(900);
  r[1] = t;
  for (var e = 2; e < 16; e++)
    r[e] = r[e - 1] * t;
  return r;
}
var Na = (
  /** @class */
  function() {
    function r() {
    }
    return r.decode = function(t, e) {
      var n = new M(""), i = at.ISO8859_1;
      n.enableDecoding(i);
      for (var a = 1, o = t[a++], f = new Ea(); a < t[0]; ) {
        switch (o) {
          case r.TEXT_COMPACTION_MODE_LATCH:
            a = r.textCompaction(t, a, n);
            break;
          case r.BYTE_COMPACTION_MODE_LATCH:
          case r.BYTE_COMPACTION_MODE_LATCH_6:
            a = r.byteCompaction(o, t, i, a, n);
            break;
          case r.MODE_SHIFT_TO_BYTE_COMPACTION_MODE:
            n.append(
              /*(char)*/
              t[a++]
            );
            break;
          case r.NUMERIC_COMPACTION_MODE_LATCH:
            a = r.numericCompaction(t, a, n);
            break;
          case r.ECI_CHARSET:
            at.getCharacterSetECIByValue(t[a++]);
            break;
          case r.ECI_GENERAL_PURPOSE:
            a += 2;
            break;
          case r.ECI_USER_DEFINED:
            a++;
            break;
          case r.BEGIN_MACRO_PDF417_CONTROL_BLOCK:
            a = r.decodeMacroBlock(t, a, f);
            break;
          case r.BEGIN_MACRO_PDF417_OPTIONAL_FIELD:
          case r.MACRO_PDF417_TERMINATOR:
            throw new T();
          default:
            a--, a = r.textCompaction(t, a, n);
            break;
        }
        if (a < t.length)
          o = t[a++];
        else
          throw T.getFormatInstance();
      }
      if (n.length() === 0)
        throw T.getFormatInstance();
      var s = new we(null, n.toString(), null, e);
      return s.setOther(f), s;
    }, r.decodeMacroBlock = function(t, e, n) {
      if (e + r.NUMBER_OF_SEQUENCE_CODEWORDS > t[0])
        throw T.getFormatInstance();
      for (var i = new Int32Array(r.NUMBER_OF_SEQUENCE_CODEWORDS), a = 0; a < r.NUMBER_OF_SEQUENCE_CODEWORDS; a++, e++)
        i[a] = t[e];
      n.setSegmentIndex(B.parseInt(r.decodeBase900toBase10(i, r.NUMBER_OF_SEQUENCE_CODEWORDS)));
      var o = new M();
      e = r.textCompaction(t, e, o), n.setFileId(o.toString());
      var f = -1;
      for (t[e] === r.BEGIN_MACRO_PDF417_OPTIONAL_FIELD && (f = e + 1); e < t[0]; )
        switch (t[e]) {
          case r.BEGIN_MACRO_PDF417_OPTIONAL_FIELD:
            switch (e++, t[e]) {
              case r.MACRO_PDF417_OPTIONAL_FIELD_FILE_NAME:
                var s = new M();
                e = r.textCompaction(t, e + 1, s), n.setFileName(s.toString());
                break;
              case r.MACRO_PDF417_OPTIONAL_FIELD_SENDER:
                var u = new M();
                e = r.textCompaction(t, e + 1, u), n.setSender(u.toString());
                break;
              case r.MACRO_PDF417_OPTIONAL_FIELD_ADDRESSEE:
                var c = new M();
                e = r.textCompaction(t, e + 1, c), n.setAddressee(c.toString());
                break;
              case r.MACRO_PDF417_OPTIONAL_FIELD_SEGMENT_COUNT:
                var l = new M();
                e = r.numericCompaction(t, e + 1, l), n.setSegmentCount(B.parseInt(l.toString()));
                break;
              case r.MACRO_PDF417_OPTIONAL_FIELD_TIME_STAMP:
                var h = new M();
                e = r.numericCompaction(t, e + 1, h), n.setTimestamp(_r.parseLong(h.toString()));
                break;
              case r.MACRO_PDF417_OPTIONAL_FIELD_CHECKSUM:
                var d = new M();
                e = r.numericCompaction(t, e + 1, d), n.setChecksum(B.parseInt(d.toString()));
                break;
              case r.MACRO_PDF417_OPTIONAL_FIELD_FILE_SIZE:
                var v = new M();
                e = r.numericCompaction(t, e + 1, v), n.setFileSize(_r.parseLong(v.toString()));
                break;
              default:
                throw T.getFormatInstance();
            }
            break;
          case r.MACRO_PDF417_TERMINATOR:
            e++, n.setLastSegment(!0);
            break;
          default:
            throw T.getFormatInstance();
        }
      if (f !== -1) {
        var g = e - f;
        n.isLastSegment() && g--, n.setOptionalData(ot.copyOfRange(t, f, f + g));
      }
      return e;
    }, r.textCompaction = function(t, e, n) {
      for (var i = new Int32Array((t[0] - e) * 2), a = new Int32Array((t[0] - e) * 2), o = 0, f = !1; e < t[0] && !f; ) {
        var s = t[e++];
        if (s < r.TEXT_COMPACTION_MODE_LATCH)
          i[o] = s / 30, i[o + 1] = s % 30, o += 2;
        else
          switch (s) {
            case r.TEXT_COMPACTION_MODE_LATCH:
              i[o++] = r.TEXT_COMPACTION_MODE_LATCH;
              break;
            case r.BYTE_COMPACTION_MODE_LATCH:
            case r.BYTE_COMPACTION_MODE_LATCH_6:
            case r.NUMERIC_COMPACTION_MODE_LATCH:
            case r.BEGIN_MACRO_PDF417_CONTROL_BLOCK:
            case r.BEGIN_MACRO_PDF417_OPTIONAL_FIELD:
            case r.MACRO_PDF417_TERMINATOR:
              e--, f = !0;
              break;
            case r.MODE_SHIFT_TO_BYTE_COMPACTION_MODE:
              i[o] = r.MODE_SHIFT_TO_BYTE_COMPACTION_MODE, s = t[e++], a[o] = s, o++;
              break;
          }
      }
      return r.decodeTextCompaction(i, a, o, n), e;
    }, r.decodeTextCompaction = function(t, e, n, i) {
      for (var a = z.ALPHA, o = z.ALPHA, f = 0; f < n; ) {
        var s = t[f], u = (
          /*char*/
          ""
        );
        switch (a) {
          case z.ALPHA:
            if (s < 26)
              u = /*(char)('A' + subModeCh) */
              String.fromCharCode(65 + s);
            else
              switch (s) {
                case 26:
                  u = " ";
                  break;
                case r.LL:
                  a = z.LOWER;
                  break;
                case r.ML:
                  a = z.MIXED;
                  break;
                case r.PS:
                  o = a, a = z.PUNCT_SHIFT;
                  break;
                case r.MODE_SHIFT_TO_BYTE_COMPACTION_MODE:
                  i.append(
                    /*(char)*/
                    e[f]
                  );
                  break;
                case r.TEXT_COMPACTION_MODE_LATCH:
                  a = z.ALPHA;
                  break;
              }
            break;
          case z.LOWER:
            if (s < 26)
              u = /*(char)('a' + subModeCh)*/
              String.fromCharCode(97 + s);
            else
              switch (s) {
                case 26:
                  u = " ";
                  break;
                case r.AS:
                  o = a, a = z.ALPHA_SHIFT;
                  break;
                case r.ML:
                  a = z.MIXED;
                  break;
                case r.PS:
                  o = a, a = z.PUNCT_SHIFT;
                  break;
                case r.MODE_SHIFT_TO_BYTE_COMPACTION_MODE:
                  i.append(
                    /*(char)*/
                    e[f]
                  );
                  break;
                case r.TEXT_COMPACTION_MODE_LATCH:
                  a = z.ALPHA;
                  break;
              }
            break;
          case z.MIXED:
            if (s < r.PL)
              u = r.MIXED_CHARS[s];
            else
              switch (s) {
                case r.PL:
                  a = z.PUNCT;
                  break;
                case 26:
                  u = " ";
                  break;
                case r.LL:
                  a = z.LOWER;
                  break;
                case r.AL:
                  a = z.ALPHA;
                  break;
                case r.PS:
                  o = a, a = z.PUNCT_SHIFT;
                  break;
                case r.MODE_SHIFT_TO_BYTE_COMPACTION_MODE:
                  i.append(
                    /*(char)*/
                    e[f]
                  );
                  break;
                case r.TEXT_COMPACTION_MODE_LATCH:
                  a = z.ALPHA;
                  break;
              }
            break;
          case z.PUNCT:
            if (s < r.PAL)
              u = r.PUNCT_CHARS[s];
            else
              switch (s) {
                case r.PAL:
                  a = z.ALPHA;
                  break;
                case r.MODE_SHIFT_TO_BYTE_COMPACTION_MODE:
                  i.append(
                    /*(char)*/
                    e[f]
                  );
                  break;
                case r.TEXT_COMPACTION_MODE_LATCH:
                  a = z.ALPHA;
                  break;
              }
            break;
          case z.ALPHA_SHIFT:
            if (a = o, s < 26)
              u = /*(char)('A' + subModeCh)*/
              String.fromCharCode(65 + s);
            else
              switch (s) {
                case 26:
                  u = " ";
                  break;
                case r.TEXT_COMPACTION_MODE_LATCH:
                  a = z.ALPHA;
                  break;
              }
            break;
          case z.PUNCT_SHIFT:
            if (a = o, s < r.PAL)
              u = r.PUNCT_CHARS[s];
            else
              switch (s) {
                case r.PAL:
                  a = z.ALPHA;
                  break;
                case r.MODE_SHIFT_TO_BYTE_COMPACTION_MODE:
                  i.append(
                    /*(char)*/
                    e[f]
                  );
                  break;
                case r.TEXT_COMPACTION_MODE_LATCH:
                  a = z.ALPHA;
                  break;
              }
            break;
        }
        u !== "" && i.append(u), f++;
      }
    }, r.byteCompaction = function(t, e, n, i, a) {
      var o = new Oa(), f = 0, s = (
        /*long*/
        0
      ), u = !1;
      switch (t) {
        case r.BYTE_COMPACTION_MODE_LATCH:
          for (var c = new Int32Array(6), l = e[i++]; i < e[0] && !u; )
            switch (c[f++] = l, s = 900 * s + l, l = e[i++], l) {
              case r.TEXT_COMPACTION_MODE_LATCH:
              case r.BYTE_COMPACTION_MODE_LATCH:
              case r.NUMERIC_COMPACTION_MODE_LATCH:
              case r.BYTE_COMPACTION_MODE_LATCH_6:
              case r.BEGIN_MACRO_PDF417_CONTROL_BLOCK:
              case r.BEGIN_MACRO_PDF417_OPTIONAL_FIELD:
              case r.MACRO_PDF417_TERMINATOR:
                i--, u = !0;
                break;
              default:
                if (f % 5 === 0 && f > 0) {
                  for (var h = 0; h < 6; ++h)
                    o.write(
                      /*(byte)*/
                      Number(Bt(s) >> Bt(8 * (5 - h)))
                    );
                  s = 0, f = 0;
                }
                break;
            }
          i === e[0] && l < r.TEXT_COMPACTION_MODE_LATCH && (c[f++] = l);
          for (var d = 0; d < f; d++)
            o.write(
              /*(byte)*/
              c[d]
            );
          break;
        case r.BYTE_COMPACTION_MODE_LATCH_6:
          for (; i < e[0] && !u; ) {
            var v = e[i++];
            if (v < r.TEXT_COMPACTION_MODE_LATCH)
              f++, s = 900 * s + v;
            else
              switch (v) {
                case r.TEXT_COMPACTION_MODE_LATCH:
                case r.BYTE_COMPACTION_MODE_LATCH:
                case r.NUMERIC_COMPACTION_MODE_LATCH:
                case r.BYTE_COMPACTION_MODE_LATCH_6:
                case r.BEGIN_MACRO_PDF417_CONTROL_BLOCK:
                case r.BEGIN_MACRO_PDF417_OPTIONAL_FIELD:
                case r.MACRO_PDF417_TERMINATOR:
                  i--, u = !0;
                  break;
              }
            if (f % 5 === 0 && f > 0) {
              for (var h = 0; h < 6; ++h)
                o.write(
                  /*(byte)*/
                  Number(Bt(s) >> Bt(8 * (5 - h)))
                );
              s = 0, f = 0;
            }
          }
          break;
      }
      return a.append(It.decode(o.toByteArray(), n)), i;
    }, r.numericCompaction = function(t, e, n) {
      for (var i = 0, a = !1, o = new Int32Array(r.MAX_NUMERIC_CODEWORDS); e < t[0] && !a; ) {
        var f = t[e++];
        if (e === t[0] && (a = !0), f < r.TEXT_COMPACTION_MODE_LATCH)
          o[i] = f, i++;
        else
          switch (f) {
            case r.TEXT_COMPACTION_MODE_LATCH:
            case r.BYTE_COMPACTION_MODE_LATCH:
            case r.BYTE_COMPACTION_MODE_LATCH_6:
            case r.BEGIN_MACRO_PDF417_CONTROL_BLOCK:
            case r.BEGIN_MACRO_PDF417_OPTIONAL_FIELD:
            case r.MACRO_PDF417_TERMINATOR:
              e--, a = !0;
              break;
          }
        (i % r.MAX_NUMERIC_CODEWORDS === 0 || f === r.NUMERIC_COMPACTION_MODE_LATCH || a) && i > 0 && (n.append(r.decodeBase900toBase10(o, i)), i = 0);
      }
      return e;
    }, r.decodeBase900toBase10 = function(t, e) {
      for (var n = Bt(0), i = 0; i < e; i++)
        n += r.EXP900[e - i - 1] * Bt(t[i]);
      var a = n.toString();
      if (a.charAt(0) !== "1")
        throw new T();
      return a.substring(1);
    }, r.TEXT_COMPACTION_MODE_LATCH = 900, r.BYTE_COMPACTION_MODE_LATCH = 901, r.NUMERIC_COMPACTION_MODE_LATCH = 902, r.BYTE_COMPACTION_MODE_LATCH_6 = 924, r.ECI_USER_DEFINED = 925, r.ECI_GENERAL_PURPOSE = 926, r.ECI_CHARSET = 927, r.BEGIN_MACRO_PDF417_CONTROL_BLOCK = 928, r.BEGIN_MACRO_PDF417_OPTIONAL_FIELD = 923, r.MACRO_PDF417_TERMINATOR = 922, r.MODE_SHIFT_TO_BYTE_COMPACTION_MODE = 913, r.MAX_NUMERIC_CODEWORDS = 15, r.MACRO_PDF417_OPTIONAL_FIELD_FILE_NAME = 0, r.MACRO_PDF417_OPTIONAL_FIELD_SEGMENT_COUNT = 1, r.MACRO_PDF417_OPTIONAL_FIELD_TIME_STAMP = 2, r.MACRO_PDF417_OPTIONAL_FIELD_SENDER = 3, r.MACRO_PDF417_OPTIONAL_FIELD_ADDRESSEE = 4, r.MACRO_PDF417_OPTIONAL_FIELD_FILE_SIZE = 5, r.MACRO_PDF417_OPTIONAL_FIELD_CHECKSUM = 6, r.PL = 25, r.LL = 27, r.AS = 27, r.ML = 28, r.AL = 28, r.PS = 29, r.PAL = 29, r.PUNCT_CHARS = `;<>@[\\]_\`~!\r	,:
-.$/"|*()?{}'`, r.MIXED_CHARS = "0123456789&\r	,:#-.$/+%*=^", r.EXP900 = jr() ? Da() : [], r.NUMBER_OF_SEQUENCE_CODEWORDS = 2, r;
  }()
), Jt = globalThis && globalThis.__values || function(r) {
  var t = typeof Symbol == "function" && Symbol.iterator, e = t && r[t], n = 0;
  if (e)
    return e.call(r);
  if (r && typeof r.length == "number")
    return {
      next: function() {
        return r && n >= r.length && (r = void 0), { value: r && r[n++], done: !r };
      }
    };
  throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, Ra = (
  /** @class */
  function() {
    function r() {
    }
    return r.decode = function(t, e, n, i, a, o, f) {
      for (var s = new He(t, e, n, i, a), u = null, c = null, l, h = !0; ; h = !1) {
        if (e != null && (u = r.getRowIndicatorColumn(t, s, e, !0, o, f)), i != null && (c = r.getRowIndicatorColumn(t, s, i, !1, o, f)), l = r.merge(u, c), l == null)
          throw C.getNotFoundInstance();
        var d = l.getBoundingBox();
        if (h && d != null && (d.getMinY() < s.getMinY() || d.getMaxY() > s.getMaxY()))
          s = d;
        else
          break;
      }
      l.setBoundingBox(s);
      var v = l.getBarcodeColumnCount() + 1;
      l.setDetectionResultColumn(0, u), l.setDetectionResultColumn(v, c);
      for (var g = u != null, x = 1; x <= v; x++) {
        var w = g ? x : v - x;
        if (l.getDetectionResultColumn(w) === /* null */
        void 0) {
          var y = void 0;
          w === 0 || w === v ? y = new wr(s, w === 0) : y = new zr(s), l.setDetectionResultColumn(w, y);
          for (var _ = -1, E = _, m = s.getMinY(); m <= s.getMaxY(); m++) {
            if (_ = r.getStartColumn(l, w, m, g), _ < 0 || _ > s.getMaxX()) {
              if (E === -1)
                continue;
              _ = E;
            }
            var I = r.detectCodeword(t, s.getMinX(), s.getMaxX(), g, _, m, o, f);
            I != null && (y.setCodeword(m, I), E = _, o = Math.min(o, I.getWidth()), f = Math.max(f, I.getWidth()));
          }
        }
      }
      return r.createDecoderResult(l);
    }, r.merge = function(t, e) {
      if (t == null && e == null)
        return null;
      var n = r.getBarcodeMetadata(t, e);
      if (n == null)
        return null;
      var i = He.merge(r.adjustBoundingBox(t), r.adjustBoundingBox(e));
      return new wa(n, i);
    }, r.adjustBoundingBox = function(t) {
      var e, n;
      if (t == null)
        return null;
      var i = t.getRowHeights();
      if (i == null)
        return null;
      var a = r.getMax(i), o = 0;
      try {
        for (var f = Jt(i), s = f.next(); !s.done; s = f.next()) {
          var u = s.value;
          if (o += a - u, u > 0)
            break;
        }
      } catch (d) {
        e = { error: d };
      } finally {
        try {
          s && !s.done && (n = f.return) && n.call(f);
        } finally {
          if (e)
            throw e.error;
        }
      }
      for (var c = t.getCodewords(), l = 0; o > 0 && c[l] == null; l++)
        o--;
      for (var h = 0, l = i.length - 1; l >= 0 && (h += a - i[l], !(i[l] > 0)); l--)
        ;
      for (var l = c.length - 1; h > 0 && c[l] == null; l--)
        h--;
      return t.getBoundingBox().addMissingRows(o, h, t.isLeft());
    }, r.getMax = function(t) {
      var e, n, i = -1;
      try {
        for (var a = Jt(t), o = a.next(); !o.done; o = a.next()) {
          var f = o.value;
          i = Math.max(i, f);
        }
      } catch (s) {
        e = { error: s };
      } finally {
        try {
          o && !o.done && (n = a.return) && n.call(a);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return i;
    }, r.getBarcodeMetadata = function(t, e) {
      var n;
      if (t == null || (n = t.getBarcodeMetadata()) == null)
        return e == null ? null : e.getBarcodeMetadata();
      var i;
      return e == null || (i = e.getBarcodeMetadata()) == null ? n : n.getColumnCount() !== i.getColumnCount() && n.getErrorCorrectionLevel() !== i.getErrorCorrectionLevel() && n.getRowCount() !== i.getRowCount() ? null : n;
    }, r.getRowIndicatorColumn = function(t, e, n, i, a, o) {
      for (var f = new wr(e, i), s = 0; s < 2; s++)
        for (var u = s === 0 ? 1 : -1, c = Math.trunc(Math.trunc(n.getX())), l = Math.trunc(Math.trunc(n.getY())); l <= e.getMaxY() && l >= e.getMinY(); l += u) {
          var h = r.detectCodeword(t, 0, t.getWidth(), i, c, l, a, o);
          h != null && (f.setCodeword(l, h), i ? c = h.getStartX() : c = h.getEndX());
        }
      return f;
    }, r.adjustCodewordCount = function(t, e) {
      var n = e[0][1], i = n.getValue(), a = t.getBarcodeColumnCount() * t.getBarcodeRowCount() - r.getNumberOfECCodeWords(t.getBarcodeECLevel());
      if (i.length === 0) {
        if (a < 1 || a > k.MAX_CODEWORDS_IN_BARCODE)
          throw C.getNotFoundInstance();
        n.setValue(a);
      } else
        i[0] !== a && n.setValue(a);
    }, r.createDecoderResult = function(t) {
      var e = r.createBarcodeMatrix(t);
      r.adjustCodewordCount(t, e);
      for (var n = new Array(), i = new Int32Array(t.getBarcodeRowCount() * t.getBarcodeColumnCount()), a = (
        /*List<int[]>*/
        []
      ), o = (
        /*Collection<Integer>*/
        new Array()
      ), f = 0; f < t.getBarcodeRowCount(); f++)
        for (var s = 0; s < t.getBarcodeColumnCount(); s++) {
          var u = e[f][s + 1].getValue(), c = f * t.getBarcodeColumnCount() + s;
          u.length === 0 ? n.push(c) : u.length === 1 ? i[c] = u[0] : (o.push(c), a.push(u));
        }
      for (var l = new Array(a.length), h = 0; h < l.length; h++)
        l[h] = a[h];
      return r.createDecoderResultFromAmbiguousValues(t.getBarcodeECLevel(), i, k.toIntArray(n), k.toIntArray(o), l);
    }, r.createDecoderResultFromAmbiguousValues = function(t, e, n, i, a) {
      for (var o = new Int32Array(i.length), f = 100; f-- > 0; ) {
        for (var s = 0; s < o.length; s++)
          e[i[s]] = a[s][o[s]];
        try {
          return r.decodeCodewords(e, t, n);
        } catch (c) {
          var u = c instanceof et;
          if (!u)
            throw c;
        }
        if (o.length === 0)
          throw et.getChecksumInstance();
        for (var s = 0; s < o.length; s++)
          if (o[s] < a[s].length - 1) {
            o[s]++;
            break;
          } else if (o[s] = 0, s === o.length - 1)
            throw et.getChecksumInstance();
      }
      throw et.getChecksumInstance();
    }, r.createBarcodeMatrix = function(t) {
      for (var e, n, i, a, o = Array.from({ length: t.getBarcodeRowCount() }, function() {
        return new Array(t.getBarcodeColumnCount() + 2);
      }), f = 0; f < o.length; f++)
        for (var s = 0; s < o[f].length; s++)
          o[f][s] = new re();
      var u = 0;
      try {
        for (var c = Jt(t.getDetectionResultColumns()), l = c.next(); !l.done; l = c.next()) {
          var h = l.value;
          if (h != null)
            try {
              for (var d = (i = void 0, Jt(h.getCodewords())), v = d.next(); !v.done; v = d.next()) {
                var g = v.value;
                if (g != null) {
                  var x = g.getRowNumber();
                  if (x >= 0) {
                    if (x >= o.length)
                      continue;
                    o[x][u].setValue(g.getValue());
                  }
                }
              }
            } catch (w) {
              i = { error: w };
            } finally {
              try {
                v && !v.done && (a = d.return) && a.call(d);
              } finally {
                if (i)
                  throw i.error;
              }
            }
          u++;
        }
      } catch (w) {
        e = { error: w };
      } finally {
        try {
          l && !l.done && (n = c.return) && n.call(c);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return o;
    }, r.isValidBarcodeColumn = function(t, e) {
      return e >= 0 && e <= t.getBarcodeColumnCount() + 1;
    }, r.getStartColumn = function(t, e, n, i) {
      var a, o, f = i ? 1 : -1, s = null;
      if (r.isValidBarcodeColumn(t, e - f) && (s = t.getDetectionResultColumn(e - f).getCodeword(n)), s != null)
        return i ? s.getEndX() : s.getStartX();
      if (s = t.getDetectionResultColumn(e).getCodewordNearby(n), s != null)
        return i ? s.getStartX() : s.getEndX();
      if (r.isValidBarcodeColumn(t, e - f) && (s = t.getDetectionResultColumn(e - f).getCodewordNearby(n)), s != null)
        return i ? s.getEndX() : s.getStartX();
      for (var u = 0; r.isValidBarcodeColumn(t, e - f); ) {
        e -= f;
        try {
          for (var c = (a = void 0, Jt(t.getDetectionResultColumn(e).getCodewords())), l = c.next(); !l.done; l = c.next()) {
            var h = l.value;
            if (h != null)
              return (i ? h.getEndX() : h.getStartX()) + f * u * (h.getEndX() - h.getStartX());
          }
        } catch (d) {
          a = { error: d };
        } finally {
          try {
            l && !l.done && (o = c.return) && o.call(c);
          } finally {
            if (a)
              throw a.error;
          }
        }
        u++;
      }
      return i ? t.getBoundingBox().getMinX() : t.getBoundingBox().getMaxX();
    }, r.detectCodeword = function(t, e, n, i, a, o, f, s) {
      a = r.adjustCodewordStartColumn(t, e, n, i, a, o);
      var u = r.getModuleBitCount(t, e, n, i, a, o);
      if (u == null)
        return null;
      var c, l = U.sum(u);
      if (i)
        c = a + l;
      else {
        for (var h = 0; h < u.length / 2; h++) {
          var d = u[h];
          u[h] = u[u.length - 1 - h], u[u.length - 1 - h] = d;
        }
        c = a, a = c - l;
      }
      if (!r.checkCodewordSkew(l, f, s))
        return null;
      var v = Aa.getDecodedValue(u), g = k.getCodeword(v);
      return g === -1 ? null : new _a(a, c, r.getCodewordBucketNumber(v), g);
    }, r.getModuleBitCount = function(t, e, n, i, a, o) {
      for (var f = a, s = new Int32Array(8), u = 0, c = i ? 1 : -1, l = i; (i ? f < n : f >= e) && u < s.length; )
        t.get(f, o) === l ? (s[u]++, f += c) : (u++, l = !l);
      return u === s.length || f === (i ? n : e) && u === s.length - 1 ? s : null;
    }, r.getNumberOfECCodeWords = function(t) {
      return 2 << t;
    }, r.adjustCodewordStartColumn = function(t, e, n, i, a, o) {
      for (var f = a, s = i ? -1 : 1, u = 0; u < 2; u++) {
        for (; (i ? f >= e : f < n) && i === t.get(f, o); ) {
          if (Math.abs(a - f) > r.CODEWORD_SKEW_SIZE)
            return a;
          f += s;
        }
        s = -s, i = !i;
      }
      return f;
    }, r.checkCodewordSkew = function(t, e, n) {
      return e - r.CODEWORD_SKEW_SIZE <= t && t <= n + r.CODEWORD_SKEW_SIZE;
    }, r.decodeCodewords = function(t, e, n) {
      if (t.length === 0)
        throw T.getFormatInstance();
      var i = 1 << e + 1, a = r.correctErrors(t, n, i);
      r.verifyCodewordCount(t, i);
      var o = Na.decode(t, "" + e);
      return o.setErrorsCorrected(a), o.setErasures(n.length), o;
    }, r.correctErrors = function(t, e, n) {
      if (e != null && e.length > n / 2 + r.MAX_ERRORS || n < 0 || n > r.MAX_EC_CODEWORDS)
        throw et.getChecksumInstance();
      return r.errorCorrection.decode(t, n, e);
    }, r.verifyCodewordCount = function(t, e) {
      if (t.length < 4)
        throw T.getFormatInstance();
      var n = t[0];
      if (n > t.length)
        throw T.getFormatInstance();
      if (n === 0)
        if (e < t.length)
          t[0] = t.length - e;
        else
          throw T.getFormatInstance();
    }, r.getBitCountForCodeword = function(t) {
      for (var e = new Int32Array(8), n = 0, i = e.length - 1; !((t & 1) !== n && (n = t & 1, i--, i < 0)); )
        e[i]++, t >>= 1;
      return e;
    }, r.getCodewordBucketNumber = function(t) {
      return t instanceof Int32Array ? this.getCodewordBucketNumber_Int32Array(t) : this.getCodewordBucketNumber_number(t);
    }, r.getCodewordBucketNumber_number = function(t) {
      return r.getCodewordBucketNumber(r.getBitCountForCodeword(t));
    }, r.getCodewordBucketNumber_Int32Array = function(t) {
      return (t[0] - t[2] + t[4] - t[6] + 9) % 9;
    }, r.toString = function(t) {
      for (var e = new $e(), n = 0; n < t.length; n++) {
        e.format("Row %2d: ", n);
        for (var i = 0; i < t[n].length; i++) {
          var a = t[n][i];
          a.getValue().length === 0 ? e.format("        ", null) : e.format("%4d(%2d)", a.getValue()[0], a.getConfidence(a.getValue()[0]));
        }
        e.format("%n");
      }
      return e.toString();
    }, r.CODEWORD_SKEW_SIZE = 2, r.MAX_ERRORS = 3, r.MAX_EC_CODEWORDS = 512, r.errorCorrection = new ha(), r;
  }()
), Pa = globalThis && globalThis.__values || function(r) {
  var t = typeof Symbol == "function" && Symbol.iterator, e = t && r[t], n = 0;
  if (e)
    return e.call(r);
  if (r && typeof r.length == "number")
    return {
      next: function() {
        return r && n >= r.length && (r = void 0), { value: r && r[n++], done: !r };
      }
    };
  throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, ge = (
  /** @class */
  function() {
    function r() {
    }
    return r.prototype.decode = function(t, e) {
      e === void 0 && (e = null);
      var n = r.decode(t, e, !1);
      if (n == null || n.length === 0 || n[0] == null)
        throw C.getNotFoundInstance();
      return n[0];
    }, r.prototype.decodeMultiple = function(t, e) {
      e === void 0 && (e = null);
      try {
        return r.decode(t, e, !0);
      } catch (n) {
        throw n instanceof T || n instanceof et ? C.getNotFoundInstance() : n;
      }
    }, r.decode = function(t, e, n) {
      var i, a, o = new Array(), f = oa.detectMultiple(t, e, n);
      try {
        for (var s = Pa(f.getPoints()), u = s.next(); !u.done; u = s.next()) {
          var c = u.value, l = Ra.decode(f.getBits(), c[4], c[5], c[6], c[7], r.getMinCodewordWidth(c), r.getMaxCodewordWidth(c)), h = new pt(l.getText(), l.getRawBytes(), void 0, c, N.PDF_417);
          h.putMetadata(dt.ERROR_CORRECTION_LEVEL, l.getECLevel());
          var d = l.getOther();
          d != null && h.putMetadata(dt.PDF417_EXTRA_METADATA, d), o.push(h);
        }
      } catch (v) {
        i = { error: v };
      } finally {
        try {
          u && !u.done && (a = s.return) && a.call(s);
        } finally {
          if (i)
            throw i.error;
        }
      }
      return o.map(function(v) {
        return v;
      });
    }, r.getMaxWidth = function(t, e) {
      return t == null || e == null ? 0 : Math.trunc(Math.abs(t.getX() - e.getX()));
    }, r.getMinWidth = function(t, e) {
      return t == null || e == null ? B.MAX_VALUE : Math.trunc(Math.abs(t.getX() - e.getX()));
    }, r.getMaxCodewordWidth = function(t) {
      return Math.floor(Math.max(Math.max(r.getMaxWidth(t[0], t[4]), r.getMaxWidth(t[6], t[2]) * k.MODULES_IN_CODEWORD / k.MODULES_IN_STOP_PATTERN), Math.max(r.getMaxWidth(t[1], t[5]), r.getMaxWidth(t[7], t[3]) * k.MODULES_IN_CODEWORD / k.MODULES_IN_STOP_PATTERN)));
    }, r.getMinCodewordWidth = function(t) {
      return Math.floor(Math.min(Math.min(r.getMinWidth(t[0], t[4]), r.getMinWidth(t[6], t[2]) * k.MODULES_IN_CODEWORD / k.MODULES_IN_STOP_PATTERN), Math.min(r.getMinWidth(t[1], t[5]), r.getMinWidth(t[7], t[3]) * k.MODULES_IN_CODEWORD / k.MODULES_IN_STOP_PATTERN)));
    }, r.prototype.reset = function() {
    }, r;
  }()
), Ma = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), Ar = (
  /** @class */
  function(r) {
    Ma(t, r);
    function t() {
      return r !== null && r.apply(this, arguments) || this;
    }
    return t.kind = "ReaderException", t;
  }(At)
), Er = globalThis && globalThis.__values || function(r) {
  var t = typeof Symbol == "function" && Symbol.iterator, e = t && r[t], n = 0;
  if (e)
    return e.call(r);
  if (r && typeof r.length == "number")
    return {
      next: function() {
        return r && n >= r.length && (r = void 0), { value: r && r[n++], done: !r };
      }
    };
  throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, Yr = (
  /** @class */
  function() {
    function r() {
    }
    return r.prototype.decode = function(t, e) {
      return this.setHints(e), this.decodeInternal(t);
    }, r.prototype.decodeWithState = function(t) {
      return (this.readers === null || this.readers === void 0) && this.setHints(null), this.decodeInternal(t);
    }, r.prototype.setHints = function(t) {
      this.hints = t;
      var e = t != null && t.get($.TRY_HARDER) !== void 0, n = t == null ? null : t.get($.POSSIBLE_FORMATS), i = new Array();
      if (n != null) {
        var a = n.some(function(o) {
          return o === N.UPC_A || o === N.UPC_E || o === N.EAN_13 || o === N.EAN_8 || o === N.CODABAR || o === N.CODE_39 || o === N.CODE_93 || o === N.CODE_128 || o === N.ITF || o === N.RSS_14 || o === N.RSS_EXPANDED;
        });
        a && !e && i.push(new zt(t)), n.includes(N.QR_CODE) && i.push(new pe()), n.includes(N.DATA_MATRIX) && i.push(new ve()), n.includes(N.AZTEC) && i.push(new he()), n.includes(N.PDF_417) && i.push(new ge()), a && e && i.push(new zt(t));
      }
      i.length === 0 && (e || i.push(new zt(t)), i.push(new pe()), i.push(new ve()), i.push(new he()), i.push(new ge()), e && i.push(new zt(t))), this.readers = i;
    }, r.prototype.reset = function() {
      var t, e;
      if (this.readers !== null)
        try {
          for (var n = Er(this.readers), i = n.next(); !i.done; i = n.next()) {
            var a = i.value;
            a.reset();
          }
        } catch (o) {
          t = { error: o };
        } finally {
          try {
            i && !i.done && (e = n.return) && e.call(n);
          } finally {
            if (t)
              throw t.error;
          }
        }
    }, r.prototype.decodeInternal = function(t) {
      var e, n;
      if (this.readers === null)
        throw new Ar("No readers where selected, nothing can be read.");
      try {
        for (var i = Er(this.readers), a = i.next(); !a.done; a = i.next()) {
          var o = a.value;
          try {
            return o.decode(t, this.hints);
          } catch (f) {
            if (f instanceof Ar)
              continue;
          }
        }
      } catch (f) {
        e = { error: f };
      } finally {
        try {
          a && !a.done && (n = i.return) && n.call(i);
        } finally {
          if (e)
            throw e.error;
        }
      }
      throw new C("No MultiFormat Readers were able to detect the code.");
    }, r;
  }()
), Ba = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}();
(function(r) {
  Ba(t, r);
  function t(e, n) {
    e === void 0 && (e = null), n === void 0 && (n = 500);
    var i = this, a = new Yr();
    return a.setHints(e), i = r.call(this, a, n) || this, i;
  }
  return t.prototype.decodeBitmap = function(e) {
    return this.reader.decodeWithState(e);
  }, t;
})($t);
var Fa = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}();
(function(r) {
  Fa(t, r);
  function t(e) {
    return e === void 0 && (e = 500), r.call(this, new ge(), e) || this;
  }
  return t;
})($t);
var La = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}();
(function(r) {
  La(t, r);
  function t(e) {
    return e === void 0 && (e = 500), r.call(this, new pe(), e) || this;
  }
  return t;
})($t);
var Ge;
(function(r) {
  r[r.ERROR_CORRECTION = 0] = "ERROR_CORRECTION", r[r.CHARACTER_SET = 1] = "CHARACTER_SET", r[r.DATA_MATRIX_SHAPE = 2] = "DATA_MATRIX_SHAPE", r[r.DATA_MATRIX_COMPACT = 3] = "DATA_MATRIX_COMPACT", r[r.MIN_SIZE = 4] = "MIN_SIZE", r[r.MAX_SIZE = 5] = "MAX_SIZE", r[r.MARGIN = 6] = "MARGIN", r[r.PDF417_COMPACT = 7] = "PDF417_COMPACT", r[r.PDF417_COMPACTION = 8] = "PDF417_COMPACTION", r[r.PDF417_DIMENSIONS = 9] = "PDF417_DIMENSIONS", r[r.AZTEC_LAYERS = 10] = "AZTEC_LAYERS", r[r.QR_VERSION = 11] = "QR_VERSION", r[r.GS1_FORMAT = 12] = "GS1_FORMAT", r[r.FORCE_C40 = 13] = "FORCE_C40";
})(Ge || (Ge = {}));
const Ot = Ge;
var Zr = (
  /** @class */
  function() {
    function r(t) {
      this.field = t, this.cachedGenerators = [], this.cachedGenerators.push(new Ft(t, Int32Array.from([1])));
    }
    return r.prototype.buildGenerator = function(t) {
      var e = this.cachedGenerators;
      if (t >= e.length)
        for (var n = e[e.length - 1], i = this.field, a = e.length; a <= t; a++) {
          var o = n.multiply(new Ft(i, Int32Array.from([1, i.exp(a - 1 + i.getGeneratorBase())])));
          e.push(o), n = o;
        }
      return e[t];
    }, r.prototype.encode = function(t, e) {
      if (e === 0)
        throw new D("No error correction bytes");
      var n = t.length - e;
      if (n <= 0)
        throw new D("No data bytes provided");
      var i = this.buildGenerator(e), a = new Int32Array(n);
      j.arraycopy(t, 0, a, 0, n);
      var o = new Ft(this.field, a);
      o = o.multiplyByMonomial(e, 1);
      for (var f = o.divide(i)[1], s = f.getCoefficients(), u = e - s.length, c = 0; c < u; c++)
        t[n + c] = 0;
      j.arraycopy(s, 0, t, n + u, s.length);
    }, r;
  }()
), ne = (
  /** @class */
  function() {
    function r() {
    }
    return r.applyMaskPenaltyRule1 = function(t) {
      return r.applyMaskPenaltyRule1Internal(t, !0) + r.applyMaskPenaltyRule1Internal(t, !1);
    }, r.applyMaskPenaltyRule2 = function(t) {
      for (var e = 0, n = t.getArray(), i = t.getWidth(), a = t.getHeight(), o = 0; o < a - 1; o++)
        for (var f = n[o], s = 0; s < i - 1; s++) {
          var u = f[s];
          u === f[s + 1] && u === n[o + 1][s] && u === n[o + 1][s + 1] && e++;
        }
      return r.N2 * e;
    }, r.applyMaskPenaltyRule3 = function(t) {
      for (var e = 0, n = t.getArray(), i = t.getWidth(), a = t.getHeight(), o = 0; o < a; o++)
        for (var f = 0; f < i; f++) {
          var s = n[o];
          f + 6 < i && s[f] === 1 && s[f + 1] === 0 && s[f + 2] === 1 && s[f + 3] === 1 && s[f + 4] === 1 && s[f + 5] === 0 && s[f + 6] === 1 && (r.isWhiteHorizontal(s, f - 4, f) || r.isWhiteHorizontal(s, f + 7, f + 11)) && e++, o + 6 < a && n[o][f] === 1 && n[o + 1][f] === 0 && n[o + 2][f] === 1 && n[o + 3][f] === 1 && n[o + 4][f] === 1 && n[o + 5][f] === 0 && n[o + 6][f] === 1 && (r.isWhiteVertical(n, f, o - 4, o) || r.isWhiteVertical(n, f, o + 7, o + 11)) && e++;
        }
      return e * r.N3;
    }, r.isWhiteHorizontal = function(t, e, n) {
      e = Math.max(e, 0), n = Math.min(n, t.length);
      for (var i = e; i < n; i++)
        if (t[i] === 1)
          return !1;
      return !0;
    }, r.isWhiteVertical = function(t, e, n, i) {
      n = Math.max(n, 0), i = Math.min(i, t.length);
      for (var a = n; a < i; a++)
        if (t[a][e] === 1)
          return !1;
      return !0;
    }, r.applyMaskPenaltyRule4 = function(t) {
      for (var e = 0, n = t.getArray(), i = t.getWidth(), a = t.getHeight(), o = 0; o < a; o++)
        for (var f = n[o], s = 0; s < i; s++)
          f[s] === 1 && e++;
      var u = t.getHeight() * t.getWidth(), c = Math.floor(Math.abs(e * 2 - u) * 10 / u);
      return c * r.N4;
    }, r.getDataMaskBit = function(t, e, n) {
      var i, a;
      switch (t) {
        case 0:
          i = n + e & 1;
          break;
        case 1:
          i = n & 1;
          break;
        case 2:
          i = e % 3;
          break;
        case 3:
          i = (n + e) % 3;
          break;
        case 4:
          i = Math.floor(n / 2) + Math.floor(e / 3) & 1;
          break;
        case 5:
          a = n * e, i = (a & 1) + a % 3;
          break;
        case 6:
          a = n * e, i = (a & 1) + a % 3 & 1;
          break;
        case 7:
          a = n * e, i = a % 3 + (n + e & 1) & 1;
          break;
        default:
          throw new D("Invalid mask pattern: " + t);
      }
      return i === 0;
    }, r.applyMaskPenaltyRule1Internal = function(t, e) {
      for (var n = 0, i = e ? t.getHeight() : t.getWidth(), a = e ? t.getWidth() : t.getHeight(), o = t.getArray(), f = 0; f < i; f++) {
        for (var s = 0, u = -1, c = 0; c < a; c++) {
          var l = e ? o[f][c] : o[c][f];
          l === u ? s++ : (s >= 5 && (n += r.N1 + (s - 5)), s = 1, u = l);
        }
        s >= 5 && (n += r.N1 + (s - 5));
      }
      return n;
    }, r.N1 = 3, r.N2 = 3, r.N3 = 40, r.N4 = 10, r;
  }()
), ka = globalThis && globalThis.__values || function(r) {
  var t = typeof Symbol == "function" && Symbol.iterator, e = t && r[t], n = 0;
  if (e)
    return e.call(r);
  if (r && typeof r.length == "number")
    return {
      next: function() {
        return r && n >= r.length && (r = void 0), { value: r && r[n++], done: !r };
      }
    };
  throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, Ua = (
  /** @class */
  function() {
    function r(t, e) {
      this.width = t, this.height = e;
      for (var n = new Array(e), i = 0; i !== e; i++)
        n[i] = new Uint8Array(t);
      this.bytes = n;
    }
    return r.prototype.getHeight = function() {
      return this.height;
    }, r.prototype.getWidth = function() {
      return this.width;
    }, r.prototype.get = function(t, e) {
      return this.bytes[e][t];
    }, r.prototype.getArray = function() {
      return this.bytes;
    }, r.prototype.setNumber = function(t, e, n) {
      this.bytes[e][t] = n;
    }, r.prototype.setBoolean = function(t, e, n) {
      this.bytes[e][t] = /*(byte) */
      n ? 1 : 0;
    }, r.prototype.clear = function(t) {
      var e, n;
      try {
        for (var i = ka(this.bytes), a = i.next(); !a.done; a = i.next()) {
          var o = a.value;
          ot.fill(o, t);
        }
      } catch (f) {
        e = { error: f };
      } finally {
        try {
          a && !a.done && (n = i.return) && n.call(i);
        } finally {
          if (e)
            throw e.error;
        }
      }
    }, r.prototype.equals = function(t) {
      if (!(t instanceof r))
        return !1;
      var e = t;
      if (this.width !== e.width || this.height !== e.height)
        return !1;
      for (var n = 0, i = this.height; n < i; ++n)
        for (var a = this.bytes[n], o = e.bytes[n], f = 0, s = this.width; f < s; ++f)
          if (a[f] !== o[f])
            return !1;
      return !0;
    }, r.prototype.toString = function() {
      for (var t = new M(), e = 0, n = this.height; e < n; ++e) {
        for (var i = this.bytes[e], a = 0, o = this.width; a < o; ++a)
          switch (i[a]) {
            case 0:
              t.append(" 0");
              break;
            case 1:
              t.append(" 1");
              break;
            default:
              t.append("  ");
              break;
          }
        t.append(`
`);
      }
      return t.toString();
    }, r;
  }()
), Xe = (
  /** @class */
  function() {
    function r() {
      this.maskPattern = -1;
    }
    return r.prototype.getMode = function() {
      return this.mode;
    }, r.prototype.getECLevel = function() {
      return this.ecLevel;
    }, r.prototype.getVersion = function() {
      return this.version;
    }, r.prototype.getMaskPattern = function() {
      return this.maskPattern;
    }, r.prototype.getMatrix = function() {
      return this.matrix;
    }, r.prototype.toString = function() {
      var t = new M();
      return t.append(`<<
`), t.append(" mode: "), t.append(this.mode ? this.mode.toString() : "null"), t.append(`
 ecLevel: `), t.append(this.ecLevel ? this.ecLevel.toString() : "null"), t.append(`
 version: `), t.append(this.version ? this.version.toString() : "null"), t.append(`
 maskPattern: `), t.append(this.maskPattern.toString()), this.matrix ? (t.append(`
 matrix:
`), t.append(this.matrix.toString())) : t.append(`
 matrix: null
`), t.append(`>>
`), t.toString();
    }, r.prototype.setMode = function(t) {
      this.mode = t;
    }, r.prototype.setECLevel = function(t) {
      this.ecLevel = t;
    }, r.prototype.setVersion = function(t) {
      this.version = t;
    }, r.prototype.setMaskPattern = function(t) {
      this.maskPattern = t;
    }, r.prototype.setMatrix = function(t) {
      this.matrix = t;
    }, r.isValidMaskPattern = function(t) {
      return t >= 0 && t < r.NUM_MASK_PATTERNS;
    }, r.NUM_MASK_PATTERNS = 8, r;
  }()
), Va = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), Y = (
  /** @class */
  function(r) {
    Va(t, r);
    function t() {
      return r !== null && r.apply(this, arguments) || this;
    }
    return t.kind = "WriterException", t;
  }(At)
), Cr = (
  /** @class */
  function() {
    function r() {
    }
    return r.clearMatrix = function(t) {
      t.clear(
        /*(byte) */
        /*-1*/
        255
      );
    }, r.buildMatrix = function(t, e, n, i, a) {
      r.clearMatrix(a), r.embedBasicPatterns(n, a), r.embedTypeInfo(e, i, a), r.maybeEmbedVersionInfo(n, a), r.embedDataBits(t, i, a);
    }, r.embedBasicPatterns = function(t, e) {
      r.embedPositionDetectionPatternsAndSeparators(e), r.embedDarkDotAtLeftBottomCorner(e), r.maybeEmbedPositionAdjustmentPatterns(t, e), r.embedTimingPatterns(e);
    }, r.embedTypeInfo = function(t, e, n) {
      var i = new ct();
      r.makeTypeInfoBits(t, e, i);
      for (var a = 0, o = i.getSize(); a < o; ++a) {
        var f = i.get(i.getSize() - 1 - a), s = r.TYPE_INFO_COORDINATES[a], u = s[0], c = s[1];
        if (n.setBoolean(u, c, f), a < 8) {
          var l = n.getWidth() - a - 1, h = 8;
          n.setBoolean(l, h, f);
        } else {
          var l = 8, h = n.getHeight() - 7 + (a - 8);
          n.setBoolean(l, h, f);
        }
      }
    }, r.maybeEmbedVersionInfo = function(t, e) {
      if (!(t.getVersionNumber() < 7)) {
        var n = new ct();
        r.makeVersionInfoBits(t, n);
        for (var i = 6 * 3 - 1, a = 0; a < 6; ++a)
          for (var o = 0; o < 3; ++o) {
            var f = n.get(i);
            i--, e.setBoolean(a, e.getHeight() - 11 + o, f), e.setBoolean(e.getHeight() - 11 + o, a, f);
          }
      }
    }, r.embedDataBits = function(t, e, n) {
      for (var i = 0, a = -1, o = n.getWidth() - 1, f = n.getHeight() - 1; o > 0; ) {
        for (o === 6 && (o -= 1); f >= 0 && f < n.getHeight(); ) {
          for (var s = 0; s < 2; ++s) {
            var u = o - s;
            if (r.isEmpty(n.get(u, f))) {
              var c = void 0;
              i < t.getSize() ? (c = t.get(i), ++i) : c = !1, e !== 255 && ne.getDataMaskBit(e, u, f) && (c = !c), n.setBoolean(u, f, c);
            }
          }
          f += a;
        }
        a = -a, f += a, o -= 2;
      }
      if (i !== t.getSize())
        throw new Y("Not all bits consumed: " + i + "/" + t.getSize());
    }, r.findMSBSet = function(t) {
      return 32 - B.numberOfLeadingZeros(t);
    }, r.calculateBCHCode = function(t, e) {
      if (e === 0)
        throw new D("0 polynomial");
      var n = r.findMSBSet(e);
      for (t <<= n - 1; r.findMSBSet(t) >= n; )
        t ^= e << r.findMSBSet(t) - n;
      return t;
    }, r.makeTypeInfoBits = function(t, e, n) {
      if (!Xe.isValidMaskPattern(e))
        throw new Y("Invalid mask pattern");
      var i = t.getBits() << 3 | e;
      n.appendBits(i, 5);
      var a = r.calculateBCHCode(i, r.TYPE_INFO_POLY);
      n.appendBits(a, 10);
      var o = new ct();
      if (o.appendBits(r.TYPE_INFO_MASK_PATTERN, 15), n.xor(o), n.getSize() !== 15)
        throw new Y("should not happen but we got: " + n.getSize());
    }, r.makeVersionInfoBits = function(t, e) {
      e.appendBits(t.getVersionNumber(), 6);
      var n = r.calculateBCHCode(t.getVersionNumber(), r.VERSION_INFO_POLY);
      if (e.appendBits(n, 12), e.getSize() !== 18)
        throw new Y("should not happen but we got: " + e.getSize());
    }, r.isEmpty = function(t) {
      return t === 255;
    }, r.embedTimingPatterns = function(t) {
      for (var e = 8; e < t.getWidth() - 8; ++e) {
        var n = (e + 1) % 2;
        r.isEmpty(t.get(e, 6)) && t.setNumber(e, 6, n), r.isEmpty(t.get(6, e)) && t.setNumber(6, e, n);
      }
    }, r.embedDarkDotAtLeftBottomCorner = function(t) {
      if (t.get(8, t.getHeight() - 8) === 0)
        throw new Y();
      t.setNumber(8, t.getHeight() - 8, 1);
    }, r.embedHorizontalSeparationPattern = function(t, e, n) {
      for (var i = 0; i < 8; ++i) {
        if (!r.isEmpty(n.get(t + i, e)))
          throw new Y();
        n.setNumber(t + i, e, 0);
      }
    }, r.embedVerticalSeparationPattern = function(t, e, n) {
      for (var i = 0; i < 7; ++i) {
        if (!r.isEmpty(n.get(t, e + i)))
          throw new Y();
        n.setNumber(t, e + i, 0);
      }
    }, r.embedPositionAdjustmentPattern = function(t, e, n) {
      for (var i = 0; i < 5; ++i)
        for (var a = r.POSITION_ADJUSTMENT_PATTERN[i], o = 0; o < 5; ++o)
          n.setNumber(t + o, e + i, a[o]);
    }, r.embedPositionDetectionPattern = function(t, e, n) {
      for (var i = 0; i < 7; ++i)
        for (var a = r.POSITION_DETECTION_PATTERN[i], o = 0; o < 7; ++o)
          n.setNumber(t + o, e + i, a[o]);
    }, r.embedPositionDetectionPatternsAndSeparators = function(t) {
      var e = r.POSITION_DETECTION_PATTERN[0].length;
      r.embedPositionDetectionPattern(0, 0, t), r.embedPositionDetectionPattern(t.getWidth() - e, 0, t), r.embedPositionDetectionPattern(0, t.getWidth() - e, t);
      var n = 8;
      r.embedHorizontalSeparationPattern(0, n - 1, t), r.embedHorizontalSeparationPattern(t.getWidth() - n, n - 1, t), r.embedHorizontalSeparationPattern(0, t.getWidth() - n, t);
      var i = 7;
      r.embedVerticalSeparationPattern(i, 0, t), r.embedVerticalSeparationPattern(t.getHeight() - i - 1, 0, t), r.embedVerticalSeparationPattern(i, t.getHeight() - i, t);
    }, r.maybeEmbedPositionAdjustmentPatterns = function(t, e) {
      if (!(t.getVersionNumber() < 2))
        for (var n = t.getVersionNumber() - 1, i = r.POSITION_ADJUSTMENT_PATTERN_COORDINATE_TABLE[n], a = 0, o = i.length; a !== o; a++) {
          var f = i[a];
          if (f >= 0)
            for (var s = 0; s !== o; s++) {
              var u = i[s];
              u >= 0 && r.isEmpty(e.get(u, f)) && r.embedPositionAdjustmentPattern(u - 2, f - 2, e);
            }
        }
    }, r.POSITION_DETECTION_PATTERN = Array.from([
      Int32Array.from([1, 1, 1, 1, 1, 1, 1]),
      Int32Array.from([1, 0, 0, 0, 0, 0, 1]),
      Int32Array.from([1, 0, 1, 1, 1, 0, 1]),
      Int32Array.from([1, 0, 1, 1, 1, 0, 1]),
      Int32Array.from([1, 0, 1, 1, 1, 0, 1]),
      Int32Array.from([1, 0, 0, 0, 0, 0, 1]),
      Int32Array.from([1, 1, 1, 1, 1, 1, 1])
    ]), r.POSITION_ADJUSTMENT_PATTERN = Array.from([
      Int32Array.from([1, 1, 1, 1, 1]),
      Int32Array.from([1, 0, 0, 0, 1]),
      Int32Array.from([1, 0, 1, 0, 1]),
      Int32Array.from([1, 0, 0, 0, 1]),
      Int32Array.from([1, 1, 1, 1, 1])
    ]), r.POSITION_ADJUSTMENT_PATTERN_COORDINATE_TABLE = Array.from([
      Int32Array.from([-1, -1, -1, -1, -1, -1, -1]),
      Int32Array.from([6, 18, -1, -1, -1, -1, -1]),
      Int32Array.from([6, 22, -1, -1, -1, -1, -1]),
      Int32Array.from([6, 26, -1, -1, -1, -1, -1]),
      Int32Array.from([6, 30, -1, -1, -1, -1, -1]),
      Int32Array.from([6, 34, -1, -1, -1, -1, -1]),
      Int32Array.from([6, 22, 38, -1, -1, -1, -1]),
      Int32Array.from([6, 24, 42, -1, -1, -1, -1]),
      Int32Array.from([6, 26, 46, -1, -1, -1, -1]),
      Int32Array.from([6, 28, 50, -1, -1, -1, -1]),
      Int32Array.from([6, 30, 54, -1, -1, -1, -1]),
      Int32Array.from([6, 32, 58, -1, -1, -1, -1]),
      Int32Array.from([6, 34, 62, -1, -1, -1, -1]),
      Int32Array.from([6, 26, 46, 66, -1, -1, -1]),
      Int32Array.from([6, 26, 48, 70, -1, -1, -1]),
      Int32Array.from([6, 26, 50, 74, -1, -1, -1]),
      Int32Array.from([6, 30, 54, 78, -1, -1, -1]),
      Int32Array.from([6, 30, 56, 82, -1, -1, -1]),
      Int32Array.from([6, 30, 58, 86, -1, -1, -1]),
      Int32Array.from([6, 34, 62, 90, -1, -1, -1]),
      Int32Array.from([6, 28, 50, 72, 94, -1, -1]),
      Int32Array.from([6, 26, 50, 74, 98, -1, -1]),
      Int32Array.from([6, 30, 54, 78, 102, -1, -1]),
      Int32Array.from([6, 28, 54, 80, 106, -1, -1]),
      Int32Array.from([6, 32, 58, 84, 110, -1, -1]),
      Int32Array.from([6, 30, 58, 86, 114, -1, -1]),
      Int32Array.from([6, 34, 62, 90, 118, -1, -1]),
      Int32Array.from([6, 26, 50, 74, 98, 122, -1]),
      Int32Array.from([6, 30, 54, 78, 102, 126, -1]),
      Int32Array.from([6, 26, 52, 78, 104, 130, -1]),
      Int32Array.from([6, 30, 56, 82, 108, 134, -1]),
      Int32Array.from([6, 34, 60, 86, 112, 138, -1]),
      Int32Array.from([6, 30, 58, 86, 114, 142, -1]),
      Int32Array.from([6, 34, 62, 90, 118, 146, -1]),
      Int32Array.from([6, 30, 54, 78, 102, 126, 150]),
      Int32Array.from([6, 24, 50, 76, 102, 128, 154]),
      Int32Array.from([6, 28, 54, 80, 106, 132, 158]),
      Int32Array.from([6, 32, 58, 84, 110, 136, 162]),
      Int32Array.from([6, 26, 54, 82, 110, 138, 166]),
      Int32Array.from([6, 30, 58, 86, 114, 142, 170])
    ]), r.TYPE_INFO_COORDINATES = Array.from([
      Int32Array.from([8, 0]),
      Int32Array.from([8, 1]),
      Int32Array.from([8, 2]),
      Int32Array.from([8, 3]),
      Int32Array.from([8, 4]),
      Int32Array.from([8, 5]),
      Int32Array.from([8, 7]),
      Int32Array.from([8, 8]),
      Int32Array.from([7, 8]),
      Int32Array.from([5, 8]),
      Int32Array.from([4, 8]),
      Int32Array.from([3, 8]),
      Int32Array.from([2, 8]),
      Int32Array.from([1, 8]),
      Int32Array.from([0, 8])
    ]), r.VERSION_INFO_POLY = 7973, r.TYPE_INFO_POLY = 1335, r.TYPE_INFO_MASK_PATTERN = 21522, r;
  }()
), Ha = (
  /** @class */
  function() {
    function r(t, e) {
      this.dataBytes = t, this.errorCorrectionBytes = e;
    }
    return r.prototype.getDataBytes = function() {
      return this.dataBytes;
    }, r.prototype.getErrorCorrectionBytes = function() {
      return this.errorCorrectionBytes;
    }, r;
  }()
), mr = globalThis && globalThis.__values || function(r) {
  var t = typeof Symbol == "function" && Symbol.iterator, e = t && r[t], n = 0;
  if (e)
    return e.call(r);
  if (r && typeof r.length == "number")
    return {
      next: function() {
        return r && n >= r.length && (r = void 0), { value: r && r[n++], done: !r };
      }
    };
  throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, Ga = (
  /** @class */
  function() {
    function r() {
    }
    return r.calculateMaskPenalty = function(t) {
      return ne.applyMaskPenaltyRule1(t) + ne.applyMaskPenaltyRule2(t) + ne.applyMaskPenaltyRule3(t) + ne.applyMaskPenaltyRule4(t);
    }, r.encode = function(t, e, n) {
      n === void 0 && (n = null);
      var i = r.DEFAULT_BYTE_MODE_ENCODING, a = n !== null && n.get(Ot.CHARACTER_SET) !== void 0;
      a && (i = n.get(Ot.CHARACTER_SET).toString());
      var o = this.chooseMode(t, i), f = new ct();
      if (o === Z.BYTE && (a || r.DEFAULT_BYTE_MODE_ENCODING !== i)) {
        var s = at.getCharacterSetECIByName(i);
        s !== void 0 && this.appendECI(s, f);
      }
      this.appendModeInfo(o, f);
      var u = new ct();
      this.appendBytes(t, o, u, i);
      var c;
      if (n !== null && n.get(Ot.QR_VERSION) !== void 0) {
        var l = Number.parseInt(n.get(Ot.QR_VERSION).toString(), 10);
        c = Gt.getVersionForNumber(l);
        var h = this.calculateBitsNeeded(o, f, u, c);
        if (!this.willFit(h, c, e))
          throw new Y("Data too big for requested version");
      } else
        c = this.recommendVersion(e, o, f, u);
      var d = new ct();
      d.appendBitArray(f);
      var v = o === Z.BYTE ? u.getSizeInBytes() : t.length;
      this.appendLengthInfo(v, c, o, d), d.appendBitArray(u);
      var g = c.getECBlocksForLevel(e), x = c.getTotalCodewords() - g.getTotalECCodewords();
      this.terminateBits(x, d);
      var w = this.interleaveWithECBytes(d, c.getTotalCodewords(), x, g.getNumBlocks()), y = new Xe();
      y.setECLevel(e), y.setMode(o), y.setVersion(c);
      var _ = c.getDimensionForVersion(), E = new Ua(_, _), m = this.chooseMaskPattern(w, e, c, E);
      return y.setMaskPattern(m), Cr.buildMatrix(w, e, c, m, E), y.setMatrix(E), y;
    }, r.recommendVersion = function(t, e, n, i) {
      var a = this.calculateBitsNeeded(e, n, i, Gt.getVersionForNumber(1)), o = this.chooseVersion(a, t), f = this.calculateBitsNeeded(e, n, i, o);
      return this.chooseVersion(f, t);
    }, r.calculateBitsNeeded = function(t, e, n, i) {
      return e.getSize() + t.getCharacterCountBits(i) + n.getSize();
    }, r.getAlphanumericCode = function(t) {
      return t < r.ALPHANUMERIC_TABLE.length ? r.ALPHANUMERIC_TABLE[t] : -1;
    }, r.chooseMode = function(t, e) {
      if (e === void 0 && (e = null), at.SJIS.getName() === e && this.isOnlyDoubleByteKanji(t))
        return Z.KANJI;
      for (var n = !1, i = !1, a = 0, o = t.length; a < o; ++a) {
        var f = t.charAt(a);
        if (r.isDigit(f))
          n = !0;
        else if (this.getAlphanumericCode(f.charCodeAt(0)) !== -1)
          i = !0;
        else
          return Z.BYTE;
      }
      return i ? Z.ALPHANUMERIC : n ? Z.NUMERIC : Z.BYTE;
    }, r.isOnlyDoubleByteKanji = function(t) {
      var e;
      try {
        e = It.encode(t, at.SJIS);
      } catch {
        return !1;
      }
      var n = e.length;
      if (n % 2 !== 0)
        return !1;
      for (var i = 0; i < n; i += 2) {
        var a = e[i] & 255;
        if ((a < 129 || a > 159) && (a < 224 || a > 235))
          return !1;
      }
      return !0;
    }, r.chooseMaskPattern = function(t, e, n, i) {
      for (var a = Number.MAX_SAFE_INTEGER, o = -1, f = 0; f < Xe.NUM_MASK_PATTERNS; f++) {
        Cr.buildMatrix(t, e, n, f, i);
        var s = this.calculateMaskPenalty(i);
        s < a && (a = s, o = f);
      }
      return o;
    }, r.chooseVersion = function(t, e) {
      for (var n = 1; n <= 40; n++) {
        var i = Gt.getVersionForNumber(n);
        if (r.willFit(t, i, e))
          return i;
      }
      throw new Y("Data too big");
    }, r.willFit = function(t, e, n) {
      var i = e.getTotalCodewords(), a = e.getECBlocksForLevel(n), o = a.getTotalECCodewords(), f = i - o, s = (t + 7) / 8;
      return f >= s;
    }, r.terminateBits = function(t, e) {
      var n = t * 8;
      if (e.getSize() > n)
        throw new Y("data bits cannot fit in the QR Code" + e.getSize() + " > " + n);
      for (var i = 0; i < 4 && e.getSize() < n; ++i)
        e.appendBit(!1);
      var a = e.getSize() & 7;
      if (a > 0)
        for (var i = a; i < 8; i++)
          e.appendBit(!1);
      for (var o = t - e.getSizeInBytes(), i = 0; i < o; ++i)
        e.appendBits(i & 1 ? 17 : 236, 8);
      if (e.getSize() !== n)
        throw new Y("Bits size does not equal capacity");
    }, r.getNumDataBytesAndNumECBytesForBlockID = function(t, e, n, i, a, o) {
      if (i >= n)
        throw new Y("Block ID too large");
      var f = t % n, s = n - f, u = Math.floor(t / n), c = u + 1, l = Math.floor(e / n), h = l + 1, d = u - l, v = c - h;
      if (d !== v)
        throw new Y("EC bytes mismatch");
      if (n !== s + f)
        throw new Y("RS blocks mismatch");
      if (t !== (l + d) * s + (h + v) * f)
        throw new Y("Total bytes mismatch");
      i < s ? (a[0] = l, o[0] = d) : (a[0] = h, o[0] = v);
    }, r.interleaveWithECBytes = function(t, e, n, i) {
      var a, o, f, s;
      if (t.getSizeInBytes() !== n)
        throw new Y("Number of bits and data bytes does not match");
      for (var u = 0, c = 0, l = 0, h = new Array(), d = 0; d < i; ++d) {
        var v = new Int32Array(1), g = new Int32Array(1);
        r.getNumDataBytesAndNumECBytesForBlockID(e, n, i, d, v, g);
        var x = v[0], w = new Uint8Array(x);
        t.toBytes(8 * u, w, 0, x);
        var y = r.generateECBytes(w, g[0]);
        h.push(new Ha(w, y)), c = Math.max(c, x), l = Math.max(l, y.length), u += v[0];
      }
      if (n !== u)
        throw new Y("Data bytes does not match offset");
      for (var _ = new ct(), d = 0; d < c; ++d)
        try {
          for (var E = (a = void 0, mr(h)), m = E.next(); !m.done; m = E.next()) {
            var I = m.value, w = I.getDataBytes();
            d < w.length && _.appendBits(w[d], 8);
          }
        } catch (R) {
          a = { error: R };
        } finally {
          try {
            m && !m.done && (o = E.return) && o.call(E);
          } finally {
            if (a)
              throw a.error;
          }
        }
      for (var d = 0; d < l; ++d)
        try {
          for (var S = (f = void 0, mr(h)), b = S.next(); !b.done; b = S.next()) {
            var I = b.value, y = I.getErrorCorrectionBytes();
            d < y.length && _.appendBits(y[d], 8);
          }
        } catch (R) {
          f = { error: R };
        } finally {
          try {
            b && !b.done && (s = S.return) && s.call(S);
          } finally {
            if (f)
              throw f.error;
          }
        }
      if (e !== _.getSizeInBytes())
        throw new Y("Interleaving error: " + e + " and " + _.getSizeInBytes() + " differ.");
      return _;
    }, r.generateECBytes = function(t, e) {
      for (var n = t.length, i = new Int32Array(n + e), a = 0; a < n; a++)
        i[a] = t[a] & 255;
      new Zr(_t.QR_CODE_FIELD_256).encode(i, e);
      for (var o = new Uint8Array(e), a = 0; a < e; a++)
        o[a] = /*(byte) */
        i[n + a];
      return o;
    }, r.appendModeInfo = function(t, e) {
      e.appendBits(t.getBits(), 4);
    }, r.appendLengthInfo = function(t, e, n, i) {
      var a = n.getCharacterCountBits(e);
      if (t >= 1 << a)
        throw new Y(t + " is bigger than " + ((1 << a) - 1));
      i.appendBits(t, a);
    }, r.appendBytes = function(t, e, n, i) {
      switch (e) {
        case Z.NUMERIC:
          r.appendNumericBytes(t, n);
          break;
        case Z.ALPHANUMERIC:
          r.appendAlphanumericBytes(t, n);
          break;
        case Z.BYTE:
          r.append8BitBytes(t, n, i);
          break;
        case Z.KANJI:
          r.appendKanjiBytes(t, n);
          break;
        default:
          throw new Y("Invalid mode: " + e);
      }
    }, r.getDigit = function(t) {
      return t.charCodeAt(0) - 48;
    }, r.isDigit = function(t) {
      var e = r.getDigit(t);
      return e >= 0 && e <= 9;
    }, r.appendNumericBytes = function(t, e) {
      for (var n = t.length, i = 0; i < n; ) {
        var a = r.getDigit(t.charAt(i));
        if (i + 2 < n) {
          var o = r.getDigit(t.charAt(i + 1)), f = r.getDigit(t.charAt(i + 2));
          e.appendBits(a * 100 + o * 10 + f, 10), i += 3;
        } else if (i + 1 < n) {
          var o = r.getDigit(t.charAt(i + 1));
          e.appendBits(a * 10 + o, 7), i += 2;
        } else
          e.appendBits(a, 4), i++;
      }
    }, r.appendAlphanumericBytes = function(t, e) {
      for (var n = t.length, i = 0; i < n; ) {
        var a = r.getAlphanumericCode(t.charCodeAt(i));
        if (a === -1)
          throw new Y();
        if (i + 1 < n) {
          var o = r.getAlphanumericCode(t.charCodeAt(i + 1));
          if (o === -1)
            throw new Y();
          e.appendBits(a * 45 + o, 11), i += 2;
        } else
          e.appendBits(a, 6), i++;
      }
    }, r.append8BitBytes = function(t, e, n) {
      var i;
      try {
        i = It.encode(t, n);
      } catch (s) {
        throw new Y(s);
      }
      for (var a = 0, o = i.length; a !== o; a++) {
        var f = i[a];
        e.appendBits(f, 8);
      }
    }, r.appendKanjiBytes = function(t, e) {
      var n;
      try {
        n = It.encode(t, at.SJIS);
      } catch (l) {
        throw new Y(l);
      }
      for (var i = n.length, a = 0; a < i; a += 2) {
        var o = n[a] & 255, f = n[a + 1] & 255, s = o << 8 & 4294967295 | f, u = -1;
        if (s >= 33088 && s <= 40956 ? u = s - 33088 : s >= 57408 && s <= 60351 && (u = s - 49472), u === -1)
          throw new Y("Invalid byte sequence");
        var c = (u >> 8) * 192 + (u & 255);
        e.appendBits(c, 13);
      }
    }, r.appendECI = function(t, e) {
      e.appendBits(Z.ECI.getBits(), 4), e.appendBits(t.getValue(), 8);
    }, r.ALPHANUMERIC_TABLE = Int32Array.from([
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      36,
      -1,
      -1,
      -1,
      37,
      38,
      -1,
      -1,
      -1,
      -1,
      39,
      40,
      -1,
      41,
      42,
      43,
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      44,
      -1,
      -1,
      -1,
      -1,
      -1,
      -1,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24,
      25,
      26,
      27,
      28,
      29,
      30,
      31,
      32,
      33,
      34,
      35,
      -1,
      -1,
      -1,
      -1,
      -1
    ]), r.DEFAULT_BYTE_MODE_ENCODING = at.UTF8.getName(), r;
  }()
), Xa = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}();
(function(r) {
  Xa(t, r);
  function t(e, n, i, a, o, f, s, u) {
    var c = r.call(this, f, s) || this;
    if (c.yuvData = e, c.dataWidth = n, c.dataHeight = i, c.left = a, c.top = o, a + f > n || o + s > i)
      throw new D("Crop rectangle does not fit within image data.");
    return u && c.reverseHorizontal(f, s), c;
  }
  return t.prototype.getRow = function(e, n) {
    if (e < 0 || e >= this.getHeight())
      throw new D("Requested row is outside the image: " + e);
    var i = this.getWidth();
    (n == null || n.length < i) && (n = new Uint8ClampedArray(i));
    var a = (e + this.top) * this.dataWidth + this.left;
    return j.arraycopy(this.yuvData, a, n, 0, i), n;
  }, t.prototype.getMatrix = function() {
    var e = this.getWidth(), n = this.getHeight();
    if (e === this.dataWidth && n === this.dataHeight)
      return this.yuvData;
    var i = e * n, a = new Uint8ClampedArray(i), o = this.top * this.dataWidth + this.left;
    if (e === this.dataWidth)
      return j.arraycopy(this.yuvData, o, a, 0, i), a;
    for (var f = 0; f < n; f++) {
      var s = f * e;
      j.arraycopy(this.yuvData, o, a, s, e), o += this.dataWidth;
    }
    return a;
  }, t.prototype.isCropSupported = function() {
    return !0;
  }, t.prototype.crop = function(e, n, i, a) {
    return new t(this.yuvData, this.dataWidth, this.dataHeight, this.left + e, this.top + n, i, a, !1);
  }, t.prototype.renderThumbnail = function() {
    for (var e = this.getWidth() / t.THUMBNAIL_SCALE_FACTOR, n = this.getHeight() / t.THUMBNAIL_SCALE_FACTOR, i = new Int32Array(e * n), a = this.yuvData, o = this.top * this.dataWidth + this.left, f = 0; f < n; f++) {
      for (var s = f * e, u = 0; u < e; u++) {
        var c = a[o + u * t.THUMBNAIL_SCALE_FACTOR] & 255;
        i[s + u] = 4278190080 | c * 65793;
      }
      o += this.dataWidth * t.THUMBNAIL_SCALE_FACTOR;
    }
    return i;
  }, t.prototype.getThumbnailWidth = function() {
    return this.getWidth() / t.THUMBNAIL_SCALE_FACTOR;
  }, t.prototype.getThumbnailHeight = function() {
    return this.getHeight() / t.THUMBNAIL_SCALE_FACTOR;
  }, t.prototype.reverseHorizontal = function(e, n) {
    for (var i = this.yuvData, a = 0, o = this.top * this.dataWidth + this.left; a < n; a++, o += this.dataWidth)
      for (var f = o + e / 2, s = o, u = o + e - 1; s < f; s++, u--) {
        var c = i[s];
        i[s] = i[u], i[u] = c;
      }
  }, t.prototype.invert = function() {
    return new ye(this);
  }, t.THUMBNAIL_SCALE_FACTOR = 2, t;
})(ie);
var Wa = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}();
(function(r) {
  Wa(t, r);
  function t(e, n, i, a, o, f, s) {
    var u = r.call(this, n, i) || this;
    if (u.dataWidth = a, u.dataHeight = o, u.left = f, u.top = s, e.BYTES_PER_ELEMENT === 4) {
      for (var c = n * i, l = new Uint8ClampedArray(c), h = 0; h < c; h++) {
        var d = e[h], v = d >> 16 & 255, g = d >> 7 & 510, x = d & 255;
        l[h] = /*(byte) */
        (v + g + x) / 4 & 255;
      }
      u.luminances = l;
    } else
      u.luminances = e;
    if (a === void 0 && (u.dataWidth = n), o === void 0 && (u.dataHeight = i), f === void 0 && (u.left = 0), s === void 0 && (u.top = 0), u.left + n > u.dataWidth || u.top + i > u.dataHeight)
      throw new D("Crop rectangle does not fit within image data.");
    return u;
  }
  return t.prototype.getRow = function(e, n) {
    if (e < 0 || e >= this.getHeight())
      throw new D("Requested row is outside the image: " + e);
    var i = this.getWidth();
    (n == null || n.length < i) && (n = new Uint8ClampedArray(i));
    var a = (e + this.top) * this.dataWidth + this.left;
    return j.arraycopy(this.luminances, a, n, 0, i), n;
  }, t.prototype.getMatrix = function() {
    var e = this.getWidth(), n = this.getHeight();
    if (e === this.dataWidth && n === this.dataHeight)
      return this.luminances;
    var i = e * n, a = new Uint8ClampedArray(i), o = this.top * this.dataWidth + this.left;
    if (e === this.dataWidth)
      return j.arraycopy(this.luminances, o, a, 0, i), a;
    for (var f = 0; f < n; f++) {
      var s = f * e;
      j.arraycopy(this.luminances, o, a, s, e), o += this.dataWidth;
    }
    return a;
  }, t.prototype.isCropSupported = function() {
    return !0;
  }, t.prototype.crop = function(e, n, i, a) {
    return new t(this.luminances, i, a, this.dataWidth, this.dataHeight, this.left + e, this.top + n);
  }, t.prototype.invert = function() {
    return new ye(this);
  }, t;
})(ie);
var za = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), ja = (
  /** @class */
  function(r) {
    za(t, r);
    function t() {
      return r !== null && r.apply(this, arguments) || this;
    }
    return t.forName = function(e) {
      return this.getCharacterSetECIByName(e);
    }, t;
  }(at)
), Ya = (
  /** @class */
  function() {
    function r() {
    }
    return r.ISO_8859_1 = at.ISO8859_1, r;
  }()
), We, Za = 301, $a = function(r, t) {
  for (var e = 1, n = 0; n < 255; n++)
    t[n] = e, r[e] = n, e *= 2, e >= 256 && (e ^= Za);
  return {
    LOG: r,
    ALOG: t
  };
};
We = $a([], []), We.LOG;
We.ALOG;
var Ir;
(function(r) {
  r[r.FORCE_NONE = 0] = "FORCE_NONE", r[r.FORCE_SQUARE = 1] = "FORCE_SQUARE", r[r.FORCE_RECTANGLE = 2] = "FORCE_RECTANGLE";
})(Ir || (Ir = {}));
var Sr = 129, $r = 230, Ka = 231, qa = 235, Qa = 236, Ja = 237, to = 238, eo = 239, ro = 240, Oe = 254, no = 254, Tr = "[)>05", br = "[)>06", Or = "", W = 0, ht = 1, yt = 2, nt = 3, ut = 4, vt = 5, io = (
  /** @class */
  function() {
    function r() {
    }
    return r.prototype.getEncodingMode = function() {
      return W;
    }, r.prototype.encode = function(t) {
      var e = bt.determineConsecutiveDigitCount(t.getMessage(), t.pos);
      if (e >= 2)
        t.writeCodeword(this.encodeASCIIDigits(t.getMessage().charCodeAt(t.pos), t.getMessage().charCodeAt(t.pos + 1))), t.pos += 2;
      else {
        var n = t.getCurrentChar(), i = bt.lookAheadTest(t.getMessage(), t.pos, this.getEncodingMode());
        if (i !== this.getEncodingMode())
          switch (i) {
            case vt:
              t.writeCodeword(Ka), t.signalEncoderChange(vt);
              return;
            case ht:
              t.writeCodeword($r), t.signalEncoderChange(ht);
              return;
            case nt:
              t.writeCodeword(to), t.signalEncoderChange(nt);
              break;
            case yt:
              t.writeCodeword(eo), t.signalEncoderChange(yt);
              break;
            case ut:
              t.writeCodeword(ro), t.signalEncoderChange(ut);
              break;
            default:
              throw new Error("Illegal mode: " + i);
          }
        else
          bt.isExtendedASCII(n) ? (t.writeCodeword(qa), t.writeCodeword(n - 128 + 1), t.pos++) : (t.writeCodeword(n + 1), t.pos++);
      }
    }, r.prototype.encodeASCIIDigits = function(t, e) {
      if (bt.isDigit(t) && bt.isDigit(e)) {
        var n = (t - 48) * 10 + (e - 48);
        return n + 130;
      }
      throw new Error("not digits: " + t + e);
    }, r;
  }()
), ao = (
  /** @class */
  function() {
    function r() {
    }
    return r.prototype.getEncodingMode = function() {
      return vt;
    }, r.prototype.encode = function(t) {
      var e = new M();
      for (e.append(0); t.hasMoreCharacters(); ) {
        var n = t.getCurrentChar();
        e.append(n), t.pos++;
        var i = bt.lookAheadTest(t.getMessage(), t.pos, this.getEncodingMode());
        if (i !== this.getEncodingMode()) {
          t.signalEncoderChange(W);
          break;
        }
      }
      var a = e.length() - 1, o = 1, f = t.getCodewordCount() + a + o;
      t.updateSymbolInfo(f);
      var s = t.getSymbolInfo().getDataCapacity() - f > 0;
      if (t.hasMoreCharacters() || s)
        if (a <= 249)
          e.setCharAt(0, F.getCharAt(a));
        else if (a <= 1555)
          e.setCharAt(0, F.getCharAt(Math.floor(a / 250) + 249)), e.insert(1, F.getCharAt(a % 250));
        else
          throw new Error("Message length not in valid ranges: " + a);
      for (var u = 0, n = e.length(); u < n; u++)
        t.writeCodeword(this.randomize255State(e.charAt(u).charCodeAt(0), t.getCodewordCount() + 1));
    }, r.prototype.randomize255State = function(t, e) {
      var n = 149 * e % 255 + 1, i = t + n;
      return i <= 255 ? i : i - 256;
    }, r;
  }()
), Ke = (
  /** @class */
  function() {
    function r() {
    }
    return r.prototype.getEncodingMode = function() {
      return ht;
    }, r.prototype.encodeMaximal = function(t) {
      for (var e = new M(), n = 0, i = t.pos, a = 0; t.hasMoreCharacters(); ) {
        var o = t.getCurrentChar();
        t.pos++, n = this.encodeChar(o, e), e.length() % 3 === 0 && (i = t.pos, a = e.length());
      }
      if (a !== e.length()) {
        var f = Math.floor(e.length() / 3 * 2), s = Math.floor(t.getCodewordCount() + f + 1);
        t.updateSymbolInfo(s);
        var u = t.getSymbolInfo().getDataCapacity() - s, c = Math.floor(e.length() % 3);
        (c === 2 && u !== 2 || c === 1 && (n > 3 || u !== 1)) && (t.pos = i);
      }
      e.length() > 0 && t.writeCodeword($r), this.handleEOD(t, e);
    }, r.prototype.encode = function(t) {
      for (var e = new M(); t.hasMoreCharacters(); ) {
        var n = t.getCurrentChar();
        t.pos++;
        var i = this.encodeChar(n, e), a = Math.floor(e.length() / 3) * 2, o = t.getCodewordCount() + a;
        t.updateSymbolInfo(o);
        var f = t.getSymbolInfo().getDataCapacity() - o;
        if (!t.hasMoreCharacters()) {
          var s = new M();
          for (e.length() % 3 === 2 && f !== 2 && (i = this.backtrackOneCharacter(t, e, s, i)); e.length() % 3 === 1 && (i > 3 || f !== 1); )
            i = this.backtrackOneCharacter(t, e, s, i);
          break;
        }
        var u = e.length();
        if (u % 3 === 0) {
          var c = bt.lookAheadTest(t.getMessage(), t.pos, this.getEncodingMode());
          if (c !== this.getEncodingMode()) {
            t.signalEncoderChange(W);
            break;
          }
        }
      }
      this.handleEOD(t, e);
    }, r.prototype.backtrackOneCharacter = function(t, e, n, i) {
      var a = e.length(), o = e.toString().substring(0, a - i);
      e.setLengthToZero(), e.append(o), t.pos--;
      var f = t.getCurrentChar();
      return i = this.encodeChar(f, n), t.resetSymbolInfo(), i;
    }, r.prototype.writeNextTriplet = function(t, e) {
      t.writeCodewords(this.encodeToCodewords(e.toString()));
      var n = e.toString().substring(3);
      e.setLengthToZero(), e.append(n);
    }, r.prototype.handleEOD = function(t, e) {
      var n = Math.floor(e.length() / 3 * 2), i = e.length() % 3, a = t.getCodewordCount() + n;
      t.updateSymbolInfo(a);
      var o = t.getSymbolInfo().getDataCapacity() - a;
      if (i === 2) {
        for (e.append("\0"); e.length() >= 3; )
          this.writeNextTriplet(t, e);
        t.hasMoreCharacters() && t.writeCodeword(Oe);
      } else if (o === 1 && i === 1) {
        for (; e.length() >= 3; )
          this.writeNextTriplet(t, e);
        t.hasMoreCharacters() && t.writeCodeword(Oe), t.pos--;
      } else if (i === 0) {
        for (; e.length() >= 3; )
          this.writeNextTriplet(t, e);
        (o > 0 || t.hasMoreCharacters()) && t.writeCodeword(Oe);
      } else
        throw new Error("Unexpected case. Please report!");
      t.signalEncoderChange(W);
    }, r.prototype.encodeChar = function(t, e) {
      if (t === " ".charCodeAt(0))
        return e.append(3), 1;
      if (t >= "0".charCodeAt(0) && t <= "9".charCodeAt(0))
        return e.append(t - 48 + 4), 1;
      if (t >= "A".charCodeAt(0) && t <= "Z".charCodeAt(0))
        return e.append(t - 65 + 14), 1;
      if (t < " ".charCodeAt(0))
        return e.append(0), e.append(t), 2;
      if (t <= "/".charCodeAt(0))
        return e.append(1), e.append(t - 33), 2;
      if (t <= "@".charCodeAt(0))
        return e.append(1), e.append(t - 58 + 15), 2;
      if (t <= "_".charCodeAt(0))
        return e.append(1), e.append(t - 91 + 22), 2;
      if (t <= 127)
        return e.append(2), e.append(t - 96), 2;
      e.append("1");
      var n = 2;
      return n += this.encodeChar(t - 128, e), n;
    }, r.prototype.encodeToCodewords = function(t) {
      var e = 1600 * t.charCodeAt(0) + 40 * t.charCodeAt(1) + t.charCodeAt(2) + 1, n = e / 256, i = e % 256, a = new M();
      return a.append(n), a.append(i), a.toString();
    }, r;
  }()
), oo = (
  /** @class */
  function() {
    function r() {
    }
    return r.prototype.getEncodingMode = function() {
      return ut;
    }, r.prototype.encode = function(t) {
      for (var e = new M(); t.hasMoreCharacters(); ) {
        var n = t.getCurrentChar();
        this.encodeChar(n, e), t.pos++;
        var i = e.length();
        if (i >= 4) {
          t.writeCodewords(this.encodeToCodewords(e.toString()));
          var a = e.toString().substring(4);
          e.setLengthToZero(), e.append(a);
          var o = bt.lookAheadTest(t.getMessage(), t.pos, this.getEncodingMode());
          if (o !== this.getEncodingMode()) {
            t.signalEncoderChange(W);
            break;
          }
        }
      }
      e.append(F.getCharAt(31)), this.handleEOD(t, e);
    }, r.prototype.handleEOD = function(t, e) {
      try {
        var n = e.length();
        if (n === 0)
          return;
        if (n === 1) {
          t.updateSymbolInfo();
          var i = t.getSymbolInfo().getDataCapacity() - t.getCodewordCount(), a = t.getRemainingCharacters();
          if (a > i && (t.updateSymbolInfo(t.getCodewordCount() + 1), i = t.getSymbolInfo().getDataCapacity() - t.getCodewordCount()), a <= i && i <= 2)
            return;
        }
        if (n > 4)
          throw new Error("Count must not exceed 4");
        var o = n - 1, f = this.encodeToCodewords(e.toString()), s = !t.hasMoreCharacters(), u = s && o <= 2;
        if (o <= 2) {
          t.updateSymbolInfo(t.getCodewordCount() + o);
          var i = t.getSymbolInfo().getDataCapacity() - t.getCodewordCount();
          i >= 3 && (u = !1, t.updateSymbolInfo(t.getCodewordCount() + f.length));
        }
        u ? (t.resetSymbolInfo(), t.pos -= o) : t.writeCodewords(f);
      } finally {
        t.signalEncoderChange(W);
      }
    }, r.prototype.encodeChar = function(t, e) {
      t >= " ".charCodeAt(0) && t <= "?".charCodeAt(0) ? e.append(t) : t >= "@".charCodeAt(0) && t <= "^".charCodeAt(0) ? e.append(F.getCharAt(t - 64)) : bt.illegalCharacter(F.getCharAt(t));
    }, r.prototype.encodeToCodewords = function(t) {
      var e = t.length;
      if (e === 0)
        throw new Error("StringBuilder must not be empty");
      var n = t.charAt(0).charCodeAt(0), i = e >= 2 ? t.charAt(1).charCodeAt(0) : 0, a = e >= 3 ? t.charAt(2).charCodeAt(0) : 0, o = e >= 4 ? t.charAt(3).charCodeAt(0) : 0, f = (n << 18) + (i << 12) + (a << 6) + o, s = f >> 16 & 255, u = f >> 8 & 255, c = f & 255, l = new M();
      return l.append(s), e >= 2 && l.append(u), e >= 3 && l.append(c), l.toString();
    }, r;
  }()
), fo = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), so = globalThis && globalThis.__values || function(r) {
  var t = typeof Symbol == "function" && Symbol.iterator, e = t && r[t], n = 0;
  if (e)
    return e.call(r);
  if (r && typeof r.length == "number")
    return {
      next: function() {
        return r && n >= r.length && (r = void 0), { value: r && r[n++], done: !r };
      }
    };
  throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, H = (
  /** @class */
  function() {
    function r(t, e, n, i, a, o, f, s) {
      f === void 0 && (f = 0), s === void 0 && (s = 0), this.rectangular = t, this.dataCapacity = e, this.errorCodewords = n, this.matrixWidth = i, this.matrixHeight = a, this.dataRegions = o, this.rsBlockData = f, this.rsBlockError = s;
    }
    return r.lookup = function(t, e, n, i, a) {
      var o, f;
      e === void 0 && (e = 0), n === void 0 && (n = null), i === void 0 && (i = null), a === void 0 && (a = !0);
      try {
        for (var s = so(co), u = s.next(); !u.done; u = s.next()) {
          var c = u.value;
          if (!(e === 1 && c.rectangular) && !(e === 2 && !c.rectangular) && !(n != null && (c.getSymbolWidth() < n.getWidth() || c.getSymbolHeight() < n.getHeight())) && !(i != null && (c.getSymbolWidth() > i.getWidth() || c.getSymbolHeight() > i.getHeight())) && t <= c.dataCapacity)
            return c;
        }
      } catch (l) {
        o = { error: l };
      } finally {
        try {
          u && !u.done && (f = s.return) && f.call(s);
        } finally {
          if (o)
            throw o.error;
        }
      }
      if (a)
        throw new Error("Can't find a symbol arrangement that matches the message. Data codewords: " + t);
      return null;
    }, r.prototype.getHorizontalDataRegions = function() {
      switch (this.dataRegions) {
        case 1:
          return 1;
        case 2:
        case 4:
          return 2;
        case 16:
          return 4;
        case 36:
          return 6;
        default:
          throw new Error("Cannot handle this number of data regions");
      }
    }, r.prototype.getVerticalDataRegions = function() {
      switch (this.dataRegions) {
        case 1:
        case 2:
          return 1;
        case 4:
          return 2;
        case 16:
          return 4;
        case 36:
          return 6;
        default:
          throw new Error("Cannot handle this number of data regions");
      }
    }, r.prototype.getSymbolDataWidth = function() {
      return this.getHorizontalDataRegions() * this.matrixWidth;
    }, r.prototype.getSymbolDataHeight = function() {
      return this.getVerticalDataRegions() * this.matrixHeight;
    }, r.prototype.getSymbolWidth = function() {
      return this.getSymbolDataWidth() + this.getHorizontalDataRegions() * 2;
    }, r.prototype.getSymbolHeight = function() {
      return this.getSymbolDataHeight() + this.getVerticalDataRegions() * 2;
    }, r.prototype.getCodewordCount = function() {
      return this.dataCapacity + this.errorCodewords;
    }, r.prototype.getInterleavedBlockCount = function() {
      return this.rsBlockData ? this.dataCapacity / this.rsBlockData : 1;
    }, r.prototype.getDataCapacity = function() {
      return this.dataCapacity;
    }, r.prototype.getErrorCodewords = function() {
      return this.errorCodewords;
    }, r.prototype.getDataLengthForInterleavedBlock = function(t) {
      return this.rsBlockData;
    }, r.prototype.getErrorLengthForInterleavedBlock = function(t) {
      return this.rsBlockError;
    }, r;
  }()
), uo = (
  /** @class */
  function(r) {
    fo(t, r);
    function t() {
      return r.call(this, !1, 1558, 620, 22, 22, 36, -1, 62) || this;
    }
    return t.prototype.getInterleavedBlockCount = function() {
      return 10;
    }, t.prototype.getDataLengthForInterleavedBlock = function(e) {
      return e <= 8 ? 156 : 155;
    }, t;
  }(H)
), co = [
  new H(!1, 3, 5, 8, 8, 1),
  new H(!1, 5, 7, 10, 10, 1),
  /*rect*/
  new H(!0, 5, 7, 16, 6, 1),
  new H(!1, 8, 10, 12, 12, 1),
  /*rect*/
  new H(!0, 10, 11, 14, 6, 2),
  new H(!1, 12, 12, 14, 14, 1),
  /*rect*/
  new H(!0, 16, 14, 24, 10, 1),
  new H(!1, 18, 14, 16, 16, 1),
  new H(!1, 22, 18, 18, 18, 1),
  /*rect*/
  new H(!0, 22, 18, 16, 10, 2),
  new H(!1, 30, 20, 20, 20, 1),
  /*rect*/
  new H(!0, 32, 24, 16, 14, 2),
  new H(!1, 36, 24, 22, 22, 1),
  new H(!1, 44, 28, 24, 24, 1),
  /*rect*/
  new H(!0, 49, 28, 22, 14, 2),
  new H(!1, 62, 36, 14, 14, 4),
  new H(!1, 86, 42, 16, 16, 4),
  new H(!1, 114, 48, 18, 18, 4),
  new H(!1, 144, 56, 20, 20, 4),
  new H(!1, 174, 68, 22, 22, 4),
  new H(!1, 204, 84, 24, 24, 4, 102, 42),
  new H(!1, 280, 112, 14, 14, 16, 140, 56),
  new H(!1, 368, 144, 16, 16, 16, 92, 36),
  new H(!1, 456, 192, 18, 18, 16, 114, 48),
  new H(!1, 576, 224, 20, 20, 16, 144, 56),
  new H(!1, 696, 272, 22, 22, 16, 174, 68),
  new H(!1, 816, 336, 24, 24, 16, 136, 56),
  new H(!1, 1050, 408, 18, 18, 36, 175, 68),
  new H(!1, 1304, 496, 20, 20, 36, 163, 62),
  new uo()
], lo = (
  /** @class */
  function() {
    function r(t) {
      this.msg = t, this.pos = 0, this.skipAtEnd = 0;
      for (var e = t.split("").map(function(f) {
        return f.charCodeAt(0);
      }), n = new M(), i = 0, a = e.length; i < a; i++) {
        var o = String.fromCharCode(e[i] & 255);
        if (o === "?" && t.charAt(i) !== "?")
          throw new Error("Message contains characters outside ISO-8859-1 encoding.");
        n.append(o);
      }
      this.msg = n.toString(), this.shape = 0, this.codewords = new M(), this.newEncoding = -1;
    }
    return r.prototype.setSymbolShape = function(t) {
      this.shape = t;
    }, r.prototype.setSizeConstraints = function(t, e) {
      this.minSize = t, this.maxSize = e;
    }, r.prototype.getMessage = function() {
      return this.msg;
    }, r.prototype.setSkipAtEnd = function(t) {
      this.skipAtEnd = t;
    }, r.prototype.getCurrentChar = function() {
      return this.msg.charCodeAt(this.pos);
    }, r.prototype.getCurrent = function() {
      return this.msg.charCodeAt(this.pos);
    }, r.prototype.getCodewords = function() {
      return this.codewords;
    }, r.prototype.writeCodewords = function(t) {
      this.codewords.append(t);
    }, r.prototype.writeCodeword = function(t) {
      this.codewords.append(t);
    }, r.prototype.getCodewordCount = function() {
      return this.codewords.length();
    }, r.prototype.getNewEncoding = function() {
      return this.newEncoding;
    }, r.prototype.signalEncoderChange = function(t) {
      this.newEncoding = t;
    }, r.prototype.resetEncoderSignal = function() {
      this.newEncoding = -1;
    }, r.prototype.hasMoreCharacters = function() {
      return this.pos < this.getTotalMessageCharCount();
    }, r.prototype.getTotalMessageCharCount = function() {
      return this.msg.length - this.skipAtEnd;
    }, r.prototype.getRemainingCharacters = function() {
      return this.getTotalMessageCharCount() - this.pos;
    }, r.prototype.getSymbolInfo = function() {
      return this.symbolInfo;
    }, r.prototype.updateSymbolInfo = function(t) {
      t === void 0 && (t = this.getCodewordCount()), (this.symbolInfo == null || t > this.symbolInfo.getDataCapacity()) && (this.symbolInfo = H.lookup(t, this.shape, this.minSize, this.maxSize, !0));
    }, r.prototype.resetSymbolInfo = function() {
      this.symbolInfo = null;
    }, r;
  }()
), ho = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), vo = (
  /** @class */
  function(r) {
    ho(t, r);
    function t() {
      return r !== null && r.apply(this, arguments) || this;
    }
    return t.prototype.getEncodingMode = function() {
      return nt;
    }, t.prototype.encode = function(e) {
      for (var n = new M(); e.hasMoreCharacters(); ) {
        var i = e.getCurrentChar();
        e.pos++, this.encodeChar(i, n);
        var a = n.length();
        if (a % 3 === 0) {
          this.writeNextTriplet(e, n);
          var o = bt.lookAheadTest(e.getMessage(), e.pos, this.getEncodingMode());
          if (o !== this.getEncodingMode()) {
            e.signalEncoderChange(W);
            break;
          }
        }
      }
      this.handleEOD(e, n);
    }, t.prototype.encodeChar = function(e, n) {
      switch (e) {
        case 13:
          n.append(0);
          break;
        case "*".charCodeAt(0):
          n.append(1);
          break;
        case ">".charCodeAt(0):
          n.append(2);
          break;
        case " ".charCodeAt(0):
          n.append(3);
          break;
        default:
          e >= "0".charCodeAt(0) && e <= "9".charCodeAt(0) ? n.append(e - 48 + 4) : e >= "A".charCodeAt(0) && e <= "Z".charCodeAt(0) ? n.append(e - 65 + 14) : bt.illegalCharacter(F.getCharAt(e));
          break;
      }
      return 1;
    }, t.prototype.handleEOD = function(e, n) {
      e.updateSymbolInfo();
      var i = e.getSymbolInfo().getDataCapacity() - e.getCodewordCount(), a = n.length();
      e.pos -= a, (e.getRemainingCharacters() > 1 || i > 1 || e.getRemainingCharacters() !== i) && e.writeCodeword(no), e.getNewEncoding() < 0 && e.signalEncoderChange(W);
    }, t;
  }(Ke)
), po = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), go = (
  /** @class */
  function(r) {
    po(t, r);
    function t() {
      return r !== null && r.apply(this, arguments) || this;
    }
    return t.prototype.getEncodingMode = function() {
      return yt;
    }, t.prototype.encodeChar = function(e, n) {
      if (e === " ".charCodeAt(0))
        return n.append(3), 1;
      if (e >= "0".charCodeAt(0) && e <= "9".charCodeAt(0))
        return n.append(e - 48 + 4), 1;
      if (e >= "a".charCodeAt(0) && e <= "z".charCodeAt(0))
        return n.append(e - 97 + 14), 1;
      if (e < " ".charCodeAt(0))
        return n.append(0), n.append(e), 2;
      if (e <= "/".charCodeAt(0))
        return n.append(1), n.append(e - 33), 2;
      if (e <= "@".charCodeAt(0))
        return n.append(1), n.append(e - 58 + 15), 2;
      if (e >= "[".charCodeAt(0) && e <= "_".charCodeAt(0))
        return n.append(1), n.append(e - 91 + 22), 2;
      if (e === "`".charCodeAt(0))
        return n.append(2), n.append(0), 2;
      if (e <= "Z".charCodeAt(0))
        return n.append(2), n.append(e - 65 + 1), 2;
      if (e <= 127)
        return n.append(2), n.append(e - 123 + 27), 2;
      n.append("1");
      var i = 2;
      return i += this.encodeChar(e - 128, n), i;
    }, t;
  }(Ke)
), xo = (
  /** @class */
  function() {
    function r() {
    }
    return r.randomize253State = function(t) {
      var e = 149 * t % 253 + 1, n = Sr + e;
      return n <= 254 ? n : n - 254;
    }, r.encodeHighLevel = function(t, e, n, i, a) {
      e === void 0 && (e = 0), n === void 0 && (n = null), i === void 0 && (i = null), a === void 0 && (a = !1);
      var o = new Ke(), f = [
        new io(),
        o,
        new go(),
        new vo(),
        new oo(),
        new ao()
      ], s = new lo(t);
      s.setSymbolShape(e), s.setSizeConstraints(n, i), t.startsWith(Tr) && t.endsWith(Or) ? (s.writeCodeword(Qa), s.setSkipAtEnd(2), s.pos += Tr.length) : t.startsWith(br) && t.endsWith(Or) && (s.writeCodeword(Ja), s.setSkipAtEnd(2), s.pos += br.length);
      var u = W;
      for (a && (o.encodeMaximal(s), u = s.getNewEncoding(), s.resetEncoderSignal()); s.hasMoreCharacters(); )
        f[u].encode(s), s.getNewEncoding() >= 0 && (u = s.getNewEncoding(), s.resetEncoderSignal());
      var c = s.getCodewordCount();
      s.updateSymbolInfo();
      var l = s.getSymbolInfo().getDataCapacity();
      c < l && u !== W && u !== vt && u !== ut && s.writeCodeword("þ");
      var h = s.getCodewords();
      for (h.length() < l && h.append(Sr); h.length() < l; )
        h.append(this.randomize253State(h.length() + 1));
      return s.getCodewords().toString();
    }, r.lookAheadTest = function(t, e, n) {
      var i = this.lookAheadTestIntern(t, e, n);
      if (n === nt && i === nt) {
        for (var a = Math.min(e + 3, t.length), o = e; o < a; o++)
          if (!this.isNativeX12(t.charCodeAt(o)))
            return W;
      } else if (n === ut && i === ut) {
        for (var a = Math.min(e + 4, t.length), o = e; o < a; o++)
          if (!this.isNativeEDIFACT(t.charCodeAt(o)))
            return W;
      }
      return i;
    }, r.lookAheadTestIntern = function(t, e, n) {
      if (e >= t.length)
        return n;
      var i;
      n === W ? i = [0, 1, 1, 1, 1, 1.25] : (i = [1, 2, 2, 2, 2, 2.25], i[n] = 0);
      for (var a = 0, o = new Uint8Array(6), f = []; ; ) {
        if (e + a === t.length) {
          ot.fill(o, 0), ot.fill(f, 0);
          var s = this.findMinimums(i, f, B.MAX_VALUE, o), u = this.getMinimumCount(o);
          if (f[W] === s)
            return W;
          if (u === 1) {
            if (o[vt] > 0)
              return vt;
            if (o[ut] > 0)
              return ut;
            if (o[yt] > 0)
              return yt;
            if (o[nt] > 0)
              return nt;
          }
          return ht;
        }
        var c = t.charCodeAt(e + a);
        if (a++, this.isDigit(c) ? i[W] += 0.5 : this.isExtendedASCII(c) ? (i[W] = Math.ceil(i[W]), i[W] += 2) : (i[W] = Math.ceil(i[W]), i[W]++), this.isNativeC40(c) ? i[ht] += 2 / 3 : this.isExtendedASCII(c) ? i[ht] += 8 / 3 : i[ht] += 4 / 3, this.isNativeText(c) ? i[yt] += 2 / 3 : this.isExtendedASCII(c) ? i[yt] += 8 / 3 : i[yt] += 4 / 3, this.isNativeX12(c) ? i[nt] += 2 / 3 : this.isExtendedASCII(c) ? i[nt] += 13 / 3 : i[nt] += 10 / 3, this.isNativeEDIFACT(c) ? i[ut] += 3 / 4 : this.isExtendedASCII(c) ? i[ut] += 17 / 4 : i[ut] += 13 / 4, this.isSpecialB256(c) ? i[vt] += 4 : i[vt]++, a >= 4) {
          if (ot.fill(o, 0), ot.fill(f, 0), this.findMinimums(i, f, B.MAX_VALUE, o), f[W] < this.min(f[vt], f[ht], f[yt], f[nt], f[ut]))
            return W;
          if (f[vt] < f[W] || f[vt] + 1 < this.min(f[ht], f[yt], f[nt], f[ut]))
            return vt;
          if (f[ut] + 1 < this.min(f[vt], f[ht], f[yt], f[nt], f[W]))
            return ut;
          if (f[yt] + 1 < this.min(f[vt], f[ht], f[ut], f[nt], f[W]))
            return yt;
          if (f[nt] + 1 < this.min(f[vt], f[ht], f[ut], f[yt], f[W]))
            return nt;
          if (f[ht] + 1 < this.min(f[W], f[vt], f[ut], f[yt])) {
            if (f[ht] < f[nt])
              return ht;
            if (f[ht] === f[nt]) {
              for (var l = e + a + 1; l < t.length; ) {
                var h = t.charCodeAt(l);
                if (this.isX12TermSep(h))
                  return nt;
                if (!this.isNativeX12(h))
                  break;
                l++;
              }
              return ht;
            }
          }
        }
      }
    }, r.min = function(t, e, n, i, a) {
      var o = Math.min(t, Math.min(e, Math.min(n, i)));
      return a === void 0 ? o : Math.min(o, a);
    }, r.findMinimums = function(t, e, n, i) {
      for (var a = 0; a < 6; a++) {
        var o = e[a] = Math.ceil(t[a]);
        n > o && (n = o, ot.fill(i, 0)), n === o && (i[a] = i[a] + 1);
      }
      return n;
    }, r.getMinimumCount = function(t) {
      for (var e = 0, n = 0; n < 6; n++)
        e += t[n];
      return e || 0;
    }, r.isDigit = function(t) {
      return t >= "0".charCodeAt(0) && t <= "9".charCodeAt(0);
    }, r.isExtendedASCII = function(t) {
      return t >= 128 && t <= 255;
    }, r.isNativeC40 = function(t) {
      return t === " ".charCodeAt(0) || t >= "0".charCodeAt(0) && t <= "9".charCodeAt(0) || t >= "A".charCodeAt(0) && t <= "Z".charCodeAt(0);
    }, r.isNativeText = function(t) {
      return t === " ".charCodeAt(0) || t >= "0".charCodeAt(0) && t <= "9".charCodeAt(0) || t >= "a".charCodeAt(0) && t <= "z".charCodeAt(0);
    }, r.isNativeX12 = function(t) {
      return this.isX12TermSep(t) || t === " ".charCodeAt(0) || t >= "0".charCodeAt(0) && t <= "9".charCodeAt(0) || t >= "A".charCodeAt(0) && t <= "Z".charCodeAt(0);
    }, r.isX12TermSep = function(t) {
      return t === 13 || // CR
      t === "*".charCodeAt(0) || t === ">".charCodeAt(0);
    }, r.isNativeEDIFACT = function(t) {
      return t >= " ".charCodeAt(0) && t <= "^".charCodeAt(0);
    }, r.isSpecialB256 = function(t) {
      return !1;
    }, r.determineConsecutiveDigitCount = function(t, e) {
      e === void 0 && (e = 0);
      for (var n = t.length, i = e; i < n && this.isDigit(t.charCodeAt(i)); )
        i++;
      return i - e;
    }, r.illegalCharacter = function(t) {
      var e = B.toHexString(t.charCodeAt(0));
      throw e = "0000".substring(0, 4 - e.length) + e, new Error("Illegal character: " + t + " (0x" + e + ")");
    }, r;
  }()
);
const bt = xo;
var De = globalThis && globalThis.__values || function(r) {
  var t = typeof Symbol == "function" && Symbol.iterator, e = t && r[t], n = 0;
  if (e)
    return e.call(r);
  if (r && typeof r.length == "number")
    return {
      next: function() {
        return r && n >= r.length && (r = void 0), { value: r && r[n++], done: !r };
      }
    };
  throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, Dr = (
  /** @class */
  function() {
    function r(t) {
      this.charset = t, this.name = t.name;
    }
    return r.prototype.canEncode = function(t) {
      try {
        return It.encode(t, this.charset) != null;
      } catch {
        return !1;
      }
    }, r;
  }()
), yo = (
  /** @class */
  function() {
    function r(t, e, n) {
      var i, a, o, f, s, u;
      this.ENCODERS = [
        "IBM437",
        "ISO-8859-2",
        "ISO-8859-3",
        "ISO-8859-4",
        "ISO-8859-5",
        "ISO-8859-6",
        "ISO-8859-7",
        "ISO-8859-8",
        "ISO-8859-9",
        "ISO-8859-10",
        "ISO-8859-11",
        "ISO-8859-13",
        "ISO-8859-14",
        "ISO-8859-15",
        "ISO-8859-16",
        "windows-1250",
        "windows-1251",
        "windows-1252",
        "windows-1256",
        "Shift_JIS"
      ].map(function(P) {
        return new Dr(ja.forName(P));
      }), this.encoders = [];
      var c = [];
      c.push(new Dr(Ya.ISO_8859_1));
      for (var l = e != null && e.name.startsWith("UTF"), h = 0; h < t.length; h++) {
        var d = !1;
        try {
          for (var v = (i = void 0, De(c)), g = v.next(); !g.done; g = v.next()) {
            var x = g.value, w = t.charAt(h), y = w.charCodeAt(0);
            if (y === n || x.canEncode(w)) {
              d = !0;
              break;
            }
          }
        } catch (P) {
          i = { error: P };
        } finally {
          try {
            g && !g.done && (a = v.return) && a.call(v);
          } finally {
            if (i)
              throw i.error;
          }
        }
        if (!d)
          try {
            for (var _ = (o = void 0, De(this.ENCODERS)), E = _.next(); !E.done; E = _.next()) {
              var x = E.value;
              if (x.canEncode(t.charAt(h))) {
                c.push(x), d = !0;
                break;
              }
            }
          } catch (P) {
            o = { error: P };
          } finally {
            try {
              E && !E.done && (f = _.return) && f.call(_);
            } finally {
              if (o)
                throw o.error;
            }
          }
        d || (l = !0);
      }
      if (c.length === 1 && !l)
        this.encoders = [c[0]];
      else {
        this.encoders = [];
        var m = 0;
        try {
          for (var I = De(c), S = I.next(); !S.done; S = I.next()) {
            var x = S.value;
            this.encoders[m++] = x;
          }
        } catch (P) {
          s = { error: P };
        } finally {
          try {
            S && !S.done && (u = I.return) && u.call(I);
          } finally {
            if (s)
              throw s.error;
          }
        }
      }
      var b = -1;
      if (e != null) {
        for (var h = 0; h < this.encoders.length; h++)
          if (this.encoders[h] != null && e.name === this.encoders[h].name) {
            b = h;
            break;
          }
      }
      this.priorityEncoderIndex = b;
    }
    return r.prototype.length = function() {
      return this.encoders.length;
    }, r.prototype.getCharsetName = function(t) {
      if (!(t < this.length()))
        throw new Error("index must be less than length");
      return this.encoders[t].name;
    }, r.prototype.getCharset = function(t) {
      if (!(t < this.length()))
        throw new Error("index must be less than length");
      return this.encoders[t].charset;
    }, r.prototype.getECIValue = function(t) {
      return this.encoders[t].charset.getValueIdentifier();
    }, r.prototype.getPriorityEncoderIndex = function() {
      return this.priorityEncoderIndex;
    }, r.prototype.canEncode = function(t, e) {
      if (!(e < this.length()))
        throw new Error("index must be less than length");
      return !0;
    }, r.prototype.encode = function(t, e) {
      if (!(e < this.length()))
        throw new Error("index must be less than length");
      return It.encode(F.getCharAt(t), this.encoders[e].name);
    }, r;
  }()
), wo = 3, _o = (
  /** @class */
  function() {
    function r(t, e, n) {
      this.fnc1 = n;
      var i = new yo(t, e, n);
      if (i.length() === 1)
        for (var a = 0; a < this.bytes.length; a++) {
          var o = t.charAt(a).charCodeAt(0);
          this.bytes[a] = o === n ? 1e3 : o;
        }
      else
        this.bytes = this.encodeMinimally(t, i, n);
    }
    return r.prototype.getFNC1Character = function() {
      return this.fnc1;
    }, r.prototype.length = function() {
      return this.bytes.length;
    }, r.prototype.haveNCharacters = function(t, e) {
      if (t + e - 1 >= this.bytes.length)
        return !1;
      for (var n = 0; n < e; n++)
        if (this.isECI(t + n))
          return !1;
      return !0;
    }, r.prototype.charAt = function(t) {
      if (t < 0 || t >= this.length())
        throw new Error("" + t);
      if (this.isECI(t))
        throw new Error("value at " + t + " is not a character but an ECI");
      return this.isFNC1(t) ? this.fnc1 : this.bytes[t];
    }, r.prototype.subSequence = function(t, e) {
      if (t < 0 || t > e || e > this.length())
        throw new Error("" + t);
      for (var n = new M(), i = t; i < e; i++) {
        if (this.isECI(i))
          throw new Error("value at " + i + " is not a character but an ECI");
        n.append(this.charAt(i));
      }
      return n.toString();
    }, r.prototype.isECI = function(t) {
      if (t < 0 || t >= this.length())
        throw new Error("" + t);
      return this.bytes[t] > 255 && this.bytes[t] <= 999;
    }, r.prototype.isFNC1 = function(t) {
      if (t < 0 || t >= this.length())
        throw new Error("" + t);
      return this.bytes[t] === 1e3;
    }, r.prototype.getECIValue = function(t) {
      if (t < 0 || t >= this.length())
        throw new Error("" + t);
      if (!this.isECI(t))
        throw new Error("value at " + t + " is not an ECI but a character");
      return this.bytes[t] - 256;
    }, r.prototype.addEdge = function(t, e, n) {
      (t[e][n.encoderIndex] == null || t[e][n.encoderIndex].cachedTotalSize > n.cachedTotalSize) && (t[e][n.encoderIndex] = n);
    }, r.prototype.addEdges = function(t, e, n, i, a, o) {
      var f = t.charAt(i).charCodeAt(0), s = 0, u = e.length();
      e.getPriorityEncoderIndex() >= 0 && (f === o || e.canEncode(f, e.getPriorityEncoderIndex())) && (s = e.getPriorityEncoderIndex(), u = s + 1);
      for (var c = s; c < u; c++)
        (f === o || e.canEncode(f, c)) && this.addEdge(n, i + 1, new Nr(f, e, c, a, o));
    }, r.prototype.encodeMinimally = function(t, e, n) {
      var i = t.length, a = new Nr[i + 1][e.length()]();
      this.addEdges(t, e, a, 0, null, n);
      for (var o = 1; o <= i; o++) {
        for (var f = 0; f < e.length(); f++)
          a[o][f] != null && o < i && this.addEdges(t, e, a, o, a[o][f], n);
        for (var f = 0; f < e.length(); f++)
          a[o - 1][f] = null;
      }
      for (var s = -1, u = B.MAX_VALUE, f = 0; f < e.length(); f++)
        if (a[i][f] != null) {
          var c = a[i][f];
          c.cachedTotalSize < u && (u = c.cachedTotalSize, s = f);
        }
      if (s < 0)
        throw new Error('Failed to encode "' + t + '"');
      for (var l = [], h = a[i][s]; h != null; ) {
        if (h.isFNC1())
          l.unshift(1e3);
        else
          for (var d = e.encode(h.c, h.encoderIndex), o = d.length - 1; o >= 0; o--)
            l.unshift(d[o] & 255);
        var v = h.previous === null ? 0 : h.previous.encoderIndex;
        v !== h.encoderIndex && l.unshift(256 + e.getECIValue(h.encoderIndex)), h = h.previous;
      }
      for (var g = [], o = 0; o < g.length; o++)
        g[o] = l[o];
      return g;
    }, r;
  }()
), Nr = (
  /** @class */
  function() {
    function r(t, e, n, i, a) {
      this.c = t, this.encoderSet = e, this.encoderIndex = n, this.previous = i, this.fnc1 = a, this.c = t === a ? 1e3 : t;
      var o = this.isFNC1() ? 1 : e.encode(t, n).length, f = i === null ? 0 : i.encoderIndex;
      f !== n && (o += wo), i != null && (o += i.cachedTotalSize), this.cachedTotalSize = o;
    }
    return r.prototype.isFNC1 = function() {
      return this.c === 1e3;
    }, r;
  }()
), Ao = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}();
globalThis && globalThis.__values;
var Eo = globalThis && globalThis.__read || function(r, t) {
  var e = typeof Symbol == "function" && r[Symbol.iterator];
  if (!e)
    return r;
  var n = e.call(r), i, a = [], o;
  try {
    for (; (t === void 0 || t-- > 0) && !(i = n.next()).done; )
      a.push(i.value);
  } catch (f) {
    o = { error: f };
  } finally {
    try {
      i && !i.done && (e = n.return) && e.call(n);
    } finally {
      if (o)
        throw o.error;
    }
  }
  return a;
};
globalThis && globalThis.__spread;
var Rr;
(function(r) {
  r[r.ASCII = 0] = "ASCII", r[r.C40 = 1] = "C40", r[r.TEXT = 2] = "TEXT", r[r.X12 = 3] = "X12", r[r.EDF = 4] = "EDF", r[r.B256 = 5] = "B256";
})(Rr || (Rr = {}));
(function(r) {
  Ao(t, r);
  function t(e, n, i, a, o) {
    var f = r.call(this, e, n, i) || this;
    return f.shape = a, f.macroId = o, f;
  }
  return t.prototype.getMacroId = function() {
    return this.macroId;
  }, t.prototype.getShapeHint = function() {
    return this.shape;
  }, t;
})(_o);
var Co = (
  /** @class */
  function() {
    function r() {
    }
    return r.prototype.isCompact = function() {
      return this.compact;
    }, r.prototype.setCompact = function(t) {
      this.compact = t;
    }, r.prototype.getSize = function() {
      return this.size;
    }, r.prototype.setSize = function(t) {
      this.size = t;
    }, r.prototype.getLayers = function() {
      return this.layers;
    }, r.prototype.setLayers = function(t) {
      this.layers = t;
    }, r.prototype.getCodeWords = function() {
      return this.codeWords;
    }, r.prototype.setCodeWords = function(t) {
      this.codeWords = t;
    }, r.prototype.getMatrix = function() {
      return this.matrix;
    }, r.prototype.setMatrix = function(t) {
      this.matrix = t;
    }, r;
  }()
), Pr = (
  /** @class */
  function() {
    function r() {
    }
    return r.singletonList = function(t) {
      return [t];
    }, r.min = function(t, e) {
      return t.sort(e)[0];
    }, r;
  }()
), mo = (
  /** @class */
  function() {
    function r(t) {
      this.previous = t;
    }
    return r.prototype.getPrevious = function() {
      return this.previous;
    }, r;
  }()
), Io = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), qe = (
  /** @class */
  function(r) {
    Io(t, r);
    function t(e, n, i) {
      var a = r.call(this, e) || this;
      return a.value = n, a.bitCount = i, a;
    }
    return t.prototype.appendTo = function(e, n) {
      e.appendBits(this.value, this.bitCount);
    }, t.prototype.add = function(e, n) {
      return new t(this, e, n);
    }, t.prototype.addBinaryShift = function(e, n) {
      return console.warn("addBinaryShift on SimpleToken, this simply returns a copy of this token"), new t(this, e, n);
    }, t.prototype.toString = function() {
      var e = this.value & (1 << this.bitCount) - 1;
      return e |= 1 << this.bitCount, "<" + B.toBinaryString(e | 1 << this.bitCount).substring(1) + ">";
    }, t;
  }(mo)
), So = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        i.hasOwnProperty(a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), To = (
  /** @class */
  function(r) {
    So(t, r);
    function t(e, n, i) {
      var a = r.call(this, e, 0, 0) || this;
      return a.binaryShiftStart = n, a.binaryShiftByteCount = i, a;
    }
    return t.prototype.appendTo = function(e, n) {
      for (var i = 0; i < this.binaryShiftByteCount; i++)
        (i === 0 || i === 31 && this.binaryShiftByteCount <= 62) && (e.appendBits(31, 5), this.binaryShiftByteCount > 62 ? e.appendBits(this.binaryShiftByteCount - 31, 16) : i === 0 ? e.appendBits(Math.min(this.binaryShiftByteCount, 31), 5) : e.appendBits(this.binaryShiftByteCount - 31, 5)), e.appendBits(n[this.binaryShiftStart + i], 8);
    }, t.prototype.addBinaryShift = function(e, n) {
      return new t(this, e, n);
    }, t.prototype.toString = function() {
      return "<" + this.binaryShiftStart + "::" + (this.binaryShiftStart + this.binaryShiftByteCount - 1) + ">";
    }, t;
  }(qe)
);
function bo(r, t, e) {
  return new To(r, t, e);
}
function te(r, t, e) {
  return new qe(r, t, e);
}
var Oo = [
  "UPPER",
  "LOWER",
  "DIGIT",
  "MIXED",
  "PUNCT"
], Lt = 0, xe = 1, mt = 2, Kr = 3, Dt = 4, Do = new qe(null, 0, 0), Ne = [
  Int32Array.from([
    0,
    (5 << 16) + 28,
    (5 << 16) + 30,
    (5 << 16) + 29,
    655360 + 928 + 30
    // UPPER -> MIXED -> PUNCT
  ]),
  Int32Array.from([
    (9 << 16) + 480 + 14,
    0,
    (5 << 16) + 30,
    (5 << 16) + 29,
    655360 + 928 + 30
    // LOWER -> MIXED -> PUNCT
  ]),
  Int32Array.from([
    (4 << 16) + 14,
    (9 << 16) + 448 + 28,
    0,
    (9 << 16) + 448 + 29,
    917504 + 14336 + 928 + 30
    // DIGIT -> UPPER -> MIXED -> PUNCT
  ]),
  Int32Array.from([
    (5 << 16) + 29,
    (5 << 16) + 28,
    655360 + 928 + 30,
    0,
    (5 << 16) + 30
    // MIXED -> PUNCT
  ]),
  Int32Array.from([
    (5 << 16) + 31,
    655360 + 992 + 28,
    655360 + 992 + 30,
    655360 + 992 + 29,
    0
  ])
], No = globalThis && globalThis.__values || function(r) {
  var t = typeof Symbol == "function" && Symbol.iterator, e = t && r[t], n = 0;
  if (e)
    return e.call(r);
  if (r && typeof r.length == "number")
    return {
      next: function() {
        return r && n >= r.length && (r = void 0), { value: r && r[n++], done: !r };
      }
    };
  throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
function Ro(r) {
  var t, e;
  try {
    for (var n = No(r), i = n.next(); !i.done; i = n.next()) {
      var a = i.value;
      ot.fill(a, -1);
    }
  } catch (o) {
    t = { error: o };
  } finally {
    try {
      i && !i.done && (e = n.return) && e.call(n);
    } finally {
      if (t)
        throw t.error;
    }
  }
  return r[Lt][Dt] = 0, r[xe][Dt] = 0, r[xe][Lt] = 28, r[Kr][Dt] = 0, r[mt][Dt] = 0, r[mt][Lt] = 15, r;
}
var qr = Ro(ot.createInt32Array(6, 6)), Po = globalThis && globalThis.__values || function(r) {
  var t = typeof Symbol == "function" && Symbol.iterator, e = t && r[t], n = 0;
  if (e)
    return e.call(r);
  if (r && typeof r.length == "number")
    return {
      next: function() {
        return r && n >= r.length && (r = void 0), { value: r && r[n++], done: !r };
      }
    };
  throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, Mo = (
  /** @class */
  function() {
    function r(t, e, n, i) {
      this.token = t, this.mode = e, this.binaryShiftByteCount = n, this.bitCount = i;
    }
    return r.prototype.getMode = function() {
      return this.mode;
    }, r.prototype.getToken = function() {
      return this.token;
    }, r.prototype.getBinaryShiftByteCount = function() {
      return this.binaryShiftByteCount;
    }, r.prototype.getBitCount = function() {
      return this.bitCount;
    }, r.prototype.latchAndAppend = function(t, e) {
      var n = this.bitCount, i = this.token;
      if (t !== this.mode) {
        var a = Ne[this.mode][t];
        i = te(i, a & 65535, a >> 16), n += a >> 16;
      }
      var o = t === mt ? 4 : 5;
      return i = te(i, e, o), new r(i, t, 0, n + o);
    }, r.prototype.shiftAndAppend = function(t, e) {
      var n = this.token, i = this.mode === mt ? 4 : 5;
      return n = te(n, qr[this.mode][t], i), n = te(n, e, 5), new r(n, this.mode, 0, this.bitCount + i + 5);
    }, r.prototype.addBinaryShiftChar = function(t) {
      var e = this.token, n = this.mode, i = this.bitCount;
      if (this.mode === Dt || this.mode === mt) {
        var a = Ne[n][Lt];
        e = te(e, a & 65535, a >> 16), i += a >> 16, n = Lt;
      }
      var o = this.binaryShiftByteCount === 0 || this.binaryShiftByteCount === 31 ? 18 : this.binaryShiftByteCount === 62 ? 9 : 8, f = new r(e, n, this.binaryShiftByteCount + 1, i + o);
      return f.binaryShiftByteCount === 2047 + 31 && (f = f.endBinaryShift(t + 1)), f;
    }, r.prototype.endBinaryShift = function(t) {
      if (this.binaryShiftByteCount === 0)
        return this;
      var e = this.token;
      return e = bo(e, t - this.binaryShiftByteCount, this.binaryShiftByteCount), new r(e, this.mode, 0, this.bitCount);
    }, r.prototype.isBetterThanOrEqualTo = function(t) {
      var e = this.bitCount + (Ne[this.mode][t.mode] >> 16);
      return this.binaryShiftByteCount < t.binaryShiftByteCount ? e += r.calculateBinaryShiftCost(t) - r.calculateBinaryShiftCost(this) : this.binaryShiftByteCount > t.binaryShiftByteCount && t.binaryShiftByteCount > 0 && (e += 10), e <= t.bitCount;
    }, r.prototype.toBitArray = function(t) {
      for (var e, n, i = [], a = this.endBinaryShift(t.length).token; a !== null; a = a.getPrevious())
        i.unshift(a);
      var o = new ct();
      try {
        for (var f = Po(i), s = f.next(); !s.done; s = f.next()) {
          var u = s.value;
          u.appendTo(o, t);
        }
      } catch (c) {
        e = { error: c };
      } finally {
        try {
          s && !s.done && (n = f.return) && n.call(f);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return o;
    }, r.prototype.toString = function() {
      return F.format("%s bits=%d bytes=%d", Oo[this.mode], this.bitCount, this.binaryShiftByteCount);
    }, r.calculateBinaryShiftCost = function(t) {
      return t.binaryShiftByteCount > 62 ? 21 : t.binaryShiftByteCount > 31 ? 20 : t.binaryShiftByteCount > 0 ? 10 : 0;
    }, r.INITIAL_STATE = new r(Do, Lt, 0, 0), r;
  }()
);
function Bo(r) {
  var t = F.getCharCode(" "), e = F.getCharCode("."), n = F.getCharCode(",");
  r[Lt][t] = 1;
  for (var i = F.getCharCode("Z"), a = F.getCharCode("A"), o = a; o <= i; o++)
    r[Lt][o] = o - a + 2;
  r[xe][t] = 1;
  for (var f = F.getCharCode("z"), s = F.getCharCode("a"), o = s; o <= f; o++)
    r[xe][o] = o - s + 2;
  r[mt][t] = 1;
  for (var u = F.getCharCode("9"), c = F.getCharCode("0"), o = c; o <= u; o++)
    r[mt][o] = o - c + 2;
  r[mt][n] = 12, r[mt][e] = 13;
  for (var l = [
    "\0",
    " ",
    "",
    "",
    "",
    "",
    "",
    "",
    "\x07",
    "\b",
    "	",
    `
`,
    "\v",
    "\f",
    "\r",
    "\x1B",
    "",
    "",
    "",
    "",
    "@",
    "\\",
    "^",
    "_",
    "`",
    "|",
    "~",
    ""
  ], h = 0; h < l.length; h++)
    r[Kr][F.getCharCode(l[h])] = h;
  for (var d = [
    "\0",
    "\r",
    "\0",
    "\0",
    "\0",
    "\0",
    "!",
    "'",
    "#",
    "$",
    "%",
    "&",
    "'",
    "(",
    ")",
    "*",
    "+",
    ",",
    "-",
    ".",
    "/",
    ":",
    ";",
    "<",
    "=",
    ">",
    "?",
    "[",
    "]",
    "{",
    "}"
  ], h = 0; h < d.length; h++)
    F.getCharCode(d[h]) > 0 && (r[Dt][F.getCharCode(d[h])] = h);
  return r;
}
var Re = Bo(ot.createInt32Array(5, 256)), se = globalThis && globalThis.__values || function(r) {
  var t = typeof Symbol == "function" && Symbol.iterator, e = t && r[t], n = 0;
  if (e)
    return e.call(r);
  if (r && typeof r.length == "number")
    return {
      next: function() {
        return r && n >= r.length && (r = void 0), { value: r && r[n++], done: !r };
      }
    };
  throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, Fo = (
  /** @class */
  function() {
    function r(t) {
      this.text = t;
    }
    return r.prototype.encode = function() {
      for (var t = F.getCharCode(" "), e = F.getCharCode(`
`), n = Pr.singletonList(Mo.INITIAL_STATE), i = 0; i < this.text.length; i++) {
        var a = void 0, o = i + 1 < this.text.length ? this.text[i + 1] : 0;
        switch (this.text[i]) {
          case F.getCharCode("\r"):
            a = o === e ? 2 : 0;
            break;
          case F.getCharCode("."):
            a = o === t ? 3 : 0;
            break;
          case F.getCharCode(","):
            a = o === t ? 4 : 0;
            break;
          case F.getCharCode(":"):
            a = o === t ? 5 : 0;
            break;
          default:
            a = 0;
        }
        a > 0 ? (n = r.updateStateListForPair(n, i, a), i++) : n = this.updateStateListForChar(n, i);
      }
      var f = Pr.min(n, function(s, u) {
        return s.getBitCount() - u.getBitCount();
      });
      return f.toBitArray(this.text);
    }, r.prototype.updateStateListForChar = function(t, e) {
      var n, i, a = [];
      try {
        for (var o = se(t), f = o.next(); !f.done; f = o.next()) {
          var s = f.value;
          this.updateStateForChar(s, e, a);
        }
      } catch (u) {
        n = { error: u };
      } finally {
        try {
          f && !f.done && (i = o.return) && i.call(o);
        } finally {
          if (n)
            throw n.error;
        }
      }
      return r.simplifyStates(a);
    }, r.prototype.updateStateForChar = function(t, e, n) {
      for (var i = this.text[e] & 255, a = Re[t.getMode()][i] > 0, o = null, f = 0; f <= Dt; f++) {
        var s = Re[f][i];
        if (s > 0) {
          if (o == null && (o = t.endBinaryShift(e)), !a || f === t.getMode() || f === mt) {
            var u = o.latchAndAppend(f, s);
            n.push(u);
          }
          if (!a && qr[t.getMode()][f] >= 0) {
            var c = o.shiftAndAppend(f, s);
            n.push(c);
          }
        }
      }
      if (t.getBinaryShiftByteCount() > 0 || Re[t.getMode()][i] === 0) {
        var l = t.addBinaryShiftChar(e);
        n.push(l);
      }
    }, r.updateStateListForPair = function(t, e, n) {
      var i, a, o = [];
      try {
        for (var f = se(t), s = f.next(); !s.done; s = f.next()) {
          var u = s.value;
          this.updateStateForPair(u, e, n, o);
        }
      } catch (c) {
        i = { error: c };
      } finally {
        try {
          s && !s.done && (a = f.return) && a.call(f);
        } finally {
          if (i)
            throw i.error;
        }
      }
      return this.simplifyStates(o);
    }, r.updateStateForPair = function(t, e, n, i) {
      var a = t.endBinaryShift(e);
      if (i.push(a.latchAndAppend(Dt, n)), t.getMode() !== Dt && i.push(a.shiftAndAppend(Dt, n)), n === 3 || n === 4) {
        var o = a.latchAndAppend(mt, 16 - n).latchAndAppend(mt, 1);
        i.push(o);
      }
      if (t.getBinaryShiftByteCount() > 0) {
        var f = t.addBinaryShiftChar(e).addBinaryShiftChar(e + 1);
        i.push(f);
      }
    }, r.simplifyStates = function(t) {
      var e, n, i, a, o = [];
      try {
        for (var f = se(t), s = f.next(); !s.done; s = f.next()) {
          var u = s.value, c = !0, l = function(x) {
            if (x.isBetterThanOrEqualTo(u))
              return c = !1, "break";
            u.isBetterThanOrEqualTo(x) && (o = o.filter(function(w) {
              return w !== x;
            }));
          };
          try {
            for (var h = (i = void 0, se(o)), d = h.next(); !d.done; d = h.next()) {
              var v = d.value, g = l(v);
              if (g === "break")
                break;
            }
          } catch (x) {
            i = { error: x };
          } finally {
            try {
              d && !d.done && (a = h.return) && a.call(h);
            } finally {
              if (i)
                throw i.error;
            }
          }
          c && o.push(u);
        }
      } catch (x) {
        e = { error: x };
      } finally {
        try {
          s && !s.done && (n = f.return) && n.call(f);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return o;
    }, r;
  }()
), Lo = globalThis && globalThis.__values || function(r) {
  var t = typeof Symbol == "function" && Symbol.iterator, e = t && r[t], n = 0;
  if (e)
    return e.call(r);
  if (r && typeof r.length == "number")
    return {
      next: function() {
        return r && n >= r.length && (r = void 0), { value: r && r[n++], done: !r };
      }
    };
  throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
(function() {
  function r() {
  }
  return r.encodeBytes = function(t) {
    return r.encode(t, r.DEFAULT_EC_PERCENT, r.DEFAULT_AZTEC_LAYERS);
  }, r.encode = function(t, e, n) {
    var i = new Fo(t).encode(), a = B.truncDivision(i.getSize() * e, 100) + 11, o = i.getSize() + a, f, s, u, c, l;
    if (n !== r.DEFAULT_AZTEC_LAYERS) {
      if (f = n < 0, s = Math.abs(n), s > (f ? r.MAX_NB_BITS_COMPACT : r.MAX_NB_BITS))
        throw new D(F.format("Illegal value %s for layers", n));
      u = r.totalBitsInLayer(s, f), c = r.WORD_SIZE[s];
      var h = u - u % c;
      if (l = r.stuffBits(i, c), l.getSize() + a > h)
        throw new D("Data to large for user specified layer");
      if (f && l.getSize() > c * 64)
        throw new D("Data to large for user specified layer");
    } else {
      c = 0, l = null;
      for (var d = 0; ; d++) {
        if (d > r.MAX_NB_BITS)
          throw new D("Data too large for an Aztec code");
        if (f = d <= 3, s = f ? d + 1 : d, u = r.totalBitsInLayer(s, f), !(o > u)) {
          (l == null || c !== r.WORD_SIZE[s]) && (c = r.WORD_SIZE[s], l = r.stuffBits(i, c));
          var h = u - u % c;
          if (!(f && l.getSize() > c * 64) && l.getSize() + a <= h)
            break;
        }
      }
    }
    var v = r.generateCheckWords(l, u, c), g = l.getSize() / c, x = r.generateModeMessage(f, s, g), w = (f ? 11 : 14) + s * 4, y = new Int32Array(w), _;
    if (f) {
      _ = w;
      for (var d = 0; d < y.length; d++)
        y[d] = d;
    } else {
      _ = w + 1 + 2 * B.truncDivision(B.truncDivision(w, 2) - 1, 15);
      for (var E = B.truncDivision(w, 2), m = B.truncDivision(_, 2), d = 0; d < E; d++) {
        var I = d + B.truncDivision(d, 15);
        y[E - d - 1] = m - I - 1, y[E + d] = m + I + 1;
      }
    }
    for (var S = new Nt(_), d = 0, b = 0; d < s; d++) {
      for (var P = (s - d) * 4 + (f ? 9 : 12), R = 0; R < P; R++)
        for (var J = R * 2, L = 0; L < 2; L++)
          v.get(b + J + L) && S.set(y[d * 2 + L], y[d * 2 + R]), v.get(b + P * 2 + J + L) && S.set(y[d * 2 + R], y[w - 1 - d * 2 - L]), v.get(b + P * 4 + J + L) && S.set(y[w - 1 - d * 2 - L], y[w - 1 - d * 2 - R]), v.get(b + P * 6 + J + L) && S.set(y[w - 1 - d * 2 - R], y[d * 2 + L]);
      b += P * 8;
    }
    if (r.drawModeMessage(S, f, _, x), f)
      r.drawBullsEye(S, B.truncDivision(_, 2), 5);
    else {
      r.drawBullsEye(S, B.truncDivision(_, 2), 7);
      for (var d = 0, R = 0; d < B.truncDivision(w, 2) - 1; d += 15, R += 16)
        for (var L = B.truncDivision(_, 2) & 1; L < _; L += 2)
          S.set(B.truncDivision(_, 2) - R, L), S.set(B.truncDivision(_, 2) + R, L), S.set(L, B.truncDivision(_, 2) - R), S.set(L, B.truncDivision(_, 2) + R);
    }
    var K = new Co();
    return K.setCompact(f), K.setSize(_), K.setLayers(s), K.setCodeWords(g), K.setMatrix(S), K;
  }, r.drawBullsEye = function(t, e, n) {
    for (var i = 0; i < n; i += 2)
      for (var a = e - i; a <= e + i; a++)
        t.set(a, e - i), t.set(a, e + i), t.set(e - i, a), t.set(e + i, a);
    t.set(e - n, e - n), t.set(e - n + 1, e - n), t.set(e - n, e - n + 1), t.set(e + n, e - n), t.set(e + n, e - n + 1), t.set(e + n, e + n - 1);
  }, r.generateModeMessage = function(t, e, n) {
    var i = new ct();
    return t ? (i.appendBits(e - 1, 2), i.appendBits(n - 1, 6), i = r.generateCheckWords(i, 28, 4)) : (i.appendBits(e - 1, 5), i.appendBits(n - 1, 11), i = r.generateCheckWords(i, 40, 4)), i;
  }, r.drawModeMessage = function(t, e, n, i) {
    var a = B.truncDivision(n, 2);
    if (e)
      for (var o = 0; o < 7; o++) {
        var f = a - 3 + o;
        i.get(o) && t.set(f, a - 5), i.get(o + 7) && t.set(a + 5, f), i.get(20 - o) && t.set(f, a + 5), i.get(27 - o) && t.set(a - 5, f);
      }
    else
      for (var o = 0; o < 10; o++) {
        var f = a - 5 + o + B.truncDivision(o, 5);
        i.get(o) && t.set(f, a - 7), i.get(o + 10) && t.set(a + 7, f), i.get(29 - o) && t.set(f, a + 7), i.get(39 - o) && t.set(a - 7, f);
      }
  }, r.generateCheckWords = function(t, e, n) {
    var i, a, o = t.getSize() / n, f = new Zr(r.getGF(n)), s = B.truncDivision(e, n), u = r.bitsToWords(t, n, s);
    f.encode(u, s - o);
    var c = e % n, l = new ct();
    l.appendBits(0, c);
    try {
      for (var h = Lo(Array.from(u)), d = h.next(); !d.done; d = h.next()) {
        var v = d.value;
        l.appendBits(v, n);
      }
    } catch (g) {
      i = { error: g };
    } finally {
      try {
        d && !d.done && (a = h.return) && a.call(h);
      } finally {
        if (i)
          throw i.error;
      }
    }
    return l;
  }, r.bitsToWords = function(t, e, n) {
    var i = new Int32Array(n), a, o;
    for (a = 0, o = t.getSize() / e; a < o; a++) {
      for (var f = 0, s = 0; s < e; s++)
        f |= t.get(a * e + s) ? 1 << e - s - 1 : 0;
      i[a] = f;
    }
    return i;
  }, r.getGF = function(t) {
    switch (t) {
      case 4:
        return _t.AZTEC_PARAM;
      case 6:
        return _t.AZTEC_DATA_6;
      case 8:
        return _t.AZTEC_DATA_8;
      case 10:
        return _t.AZTEC_DATA_10;
      case 12:
        return _t.AZTEC_DATA_12;
      default:
        throw new D("Unsupported word size " + t);
    }
  }, r.stuffBits = function(t, e) {
    for (var n = new ct(), i = t.getSize(), a = (1 << e) - 2, o = 0; o < i; o += e) {
      for (var f = 0, s = 0; s < e; s++)
        (o + s >= i || t.get(o + s)) && (f |= 1 << e - 1 - s);
      (f & a) === a ? (n.appendBits(f & a, e), o--) : f & a ? n.appendBits(f, e) : (n.appendBits(f | 1, e), o--);
    }
    return n;
  }, r.totalBitsInLayer = function(t, e) {
    return ((e ? 88 : 112) + 16 * t) * t;
  }, r.DEFAULT_EC_PERCENT = 33, r.DEFAULT_AZTEC_LAYERS = 0, r.MAX_NB_BITS = 32, r.MAX_NB_BITS_COMPACT = 4, r.WORD_SIZE = Int32Array.from([
    4,
    6,
    6,
    8,
    8,
    8,
    8,
    8,
    8,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    12,
    12,
    12,
    12,
    12,
    12,
    12,
    12,
    12,
    12
  ]), r;
})();
var ko = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        Object.prototype.hasOwnProperty.call(i, a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    if (typeof e != "function" && e !== null)
      throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), Uo = (
  /** @class */
  function(r) {
    ko(t, r);
    function t(e) {
      var n = r.call(this, e.width, e.height) || this;
      return n.canvas = e, n.tempCanvasElement = null, n.buffer = t.makeBufferFromCanvasImageData(e), n;
    }
    return t.makeBufferFromCanvasImageData = function(e) {
      var n = e.getContext("2d");
      if (!n)
        throw new Error("Couldn't get canvas context.");
      var i = n.getImageData(0, 0, e.width, e.height);
      return t.toGrayscaleBuffer(i.data, e.width, e.height);
    }, t.toGrayscaleBuffer = function(e, n, i) {
      for (var a = new Uint8ClampedArray(n * i), o = 0, f = 0, s = e.length; o < s; o += 4, f++) {
        var u = void 0, c = e[o + 3];
        if (c === 0)
          u = 255;
        else {
          var l = e[o], h = e[o + 1], d = e[o + 2];
          u = 306 * l + 601 * h + 117 * d + 512 >> 10;
        }
        a[f] = u;
      }
      return a;
    }, t.prototype.getRow = function(e, n) {
      if (e < 0 || e >= this.getHeight())
        throw new D("Requested row is outside the image: " + e);
      var i = this.getWidth(), a = e * i;
      return n === null ? n = this.buffer.slice(a, a + i) : (n.length < i && (n = new Uint8ClampedArray(i)), n.set(this.buffer.slice(a, a + i))), n;
    }, t.prototype.getMatrix = function() {
      return this.buffer;
    }, t.prototype.isCropSupported = function() {
      return !0;
    }, t.prototype.crop = function(e, n, i, a) {
      return r.prototype.crop.call(this, e, n, i, a), this;
    }, t.prototype.isRotateSupported = function() {
      return !0;
    }, t.prototype.rotateCounterClockwise = function() {
      return this.rotate(-90), this;
    }, t.prototype.rotateCounterClockwise45 = function() {
      return this.rotate(-45), this;
    }, t.prototype.invert = function() {
      return new ye(this);
    }, t.prototype.getTempCanvasElement = function() {
      if (this.tempCanvasElement === null) {
        var e = this.canvas.ownerDocument.createElement("canvas");
        e.width = this.canvas.width, e.height = this.canvas.height, this.tempCanvasElement = e;
      }
      return this.tempCanvasElement;
    }, t.prototype.rotate = function(e) {
      var n = this.getTempCanvasElement();
      if (!n)
        throw new Error("Could not create a Canvas element.");
      var i = e * t.DEGREE_TO_RADIANS, a = this.canvas.width, o = this.canvas.height, f = Math.ceil(Math.abs(Math.cos(i)) * a + Math.abs(Math.sin(i)) * o), s = Math.ceil(Math.abs(Math.sin(i)) * a + Math.abs(Math.cos(i)) * o);
      n.width = f, n.height = s;
      var u = n.getContext("2d");
      if (!u)
        throw new Error("Could not create a Canvas Context element.");
      return u.translate(f / 2, s / 2), u.rotate(i), u.drawImage(this.canvas, a / -2, o / -2), this.buffer = t.makeBufferFromCanvasImageData(n), this;
    }, t.DEGREE_TO_RADIANS = Math.PI / 180, t;
  }(ie)
);
function Qr() {
  return typeof navigator < "u";
}
function Vo() {
  return Qr() && !!navigator.mediaDevices;
}
function Ho() {
  return !!(Vo() && navigator.mediaDevices.enumerateDevices);
}
var Yt = globalThis && globalThis.__assign || function() {
  return Yt = Object.assign || function(r) {
    for (var t, e = 1, n = arguments.length; e < n; e++) {
      t = arguments[e];
      for (var i in t)
        Object.prototype.hasOwnProperty.call(t, i) && (r[i] = t[i]);
    }
    return r;
  }, Yt.apply(this, arguments);
}, q = globalThis && globalThis.__awaiter || function(r, t, e, n) {
  function i(a) {
    return a instanceof e ? a : new e(function(o) {
      o(a);
    });
  }
  return new (e || (e = Promise))(function(a, o) {
    function f(c) {
      try {
        u(n.next(c));
      } catch (l) {
        o(l);
      }
    }
    function s(c) {
      try {
        u(n.throw(c));
      } catch (l) {
        o(l);
      }
    }
    function u(c) {
      c.done ? a(c.value) : i(c.value).then(f, s);
    }
    u((n = n.apply(r, t || [])).next());
  });
}, Q = globalThis && globalThis.__generator || function(r, t) {
  var e = { label: 0, sent: function() {
    if (a[0] & 1)
      throw a[1];
    return a[1];
  }, trys: [], ops: [] }, n, i, a, o;
  return o = { next: f(0), throw: f(1), return: f(2) }, typeof Symbol == "function" && (o[Symbol.iterator] = function() {
    return this;
  }), o;
  function f(u) {
    return function(c) {
      return s([u, c]);
    };
  }
  function s(u) {
    if (n)
      throw new TypeError("Generator is already executing.");
    for (; e; )
      try {
        if (n = 1, i && (a = u[0] & 2 ? i.return : u[0] ? i.throw || ((a = i.return) && a.call(i), 0) : i.next) && !(a = a.call(i, u[1])).done)
          return a;
        switch (i = 0, a && (u = [u[0] & 2, a.value]), u[0]) {
          case 0:
          case 1:
            a = u;
            break;
          case 4:
            return e.label++, { value: u[1], done: !1 };
          case 5:
            e.label++, i = u[1], u = [0];
            continue;
          case 7:
            u = e.ops.pop(), e.trys.pop();
            continue;
          default:
            if (a = e.trys, !(a = a.length > 0 && a[a.length - 1]) && (u[0] === 6 || u[0] === 2)) {
              e = 0;
              continue;
            }
            if (u[0] === 3 && (!a || u[1] > a[0] && u[1] < a[3])) {
              e.label = u[1];
              break;
            }
            if (u[0] === 6 && e.label < a[1]) {
              e.label = a[1], a = u;
              break;
            }
            if (a && e.label < a[2]) {
              e.label = a[2], e.ops.push(u);
              break;
            }
            a[2] && e.ops.pop(), e.trys.pop();
            continue;
        }
        u = t.call(r, e);
      } catch (c) {
        u = [6, c], i = 0;
      } finally {
        n = a = 0;
      }
    if (u[0] & 5)
      throw u[1];
    return { value: u[0] ? u[1] : void 0, done: !0 };
  }
}, Pe = globalThis && globalThis.__values || function(r) {
  var t = typeof Symbol == "function" && Symbol.iterator, e = t && r[t], n = 0;
  if (e)
    return e.call(r);
  if (r && typeof r.length == "number")
    return {
      next: function() {
        return r && n >= r.length && (r = void 0), { value: r && r[n++], done: !r };
      }
    };
  throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
}, Go = {
  delayBetweenScanAttempts: 500,
  delayBetweenScanSuccess: 500,
  tryPlayVideoTimeout: 5e3
}, qt = (
  /** @class */
  function() {
    function r(t, e, n) {
      e === void 0 && (e = /* @__PURE__ */ new Map()), n === void 0 && (n = {}), this.reader = t, this.hints = e, this.options = Yt(Yt({}, Go), n);
    }
    return Object.defineProperty(r.prototype, "possibleFormats", {
      /**
       * Allows to change the possible formats the decoder should
       * search for while scanning some image. Useful for changing
       * the possible formats during BrowserCodeReader::scan.
       */
      set: function(t) {
        this.hints.set($.POSSIBLE_FORMATS, t);
      },
      enumerable: !1,
      configurable: !0
    }), r.addVideoSource = function(t, e) {
      try {
        t.srcObject = e;
      } catch {
        console.error("got interrupted by new loading request");
      }
    }, r.mediaStreamSetTorch = function(t, e) {
      return q(this, void 0, void 0, function() {
        return Q(this, function(n) {
          switch (n.label) {
            case 0:
              return [4, t.applyConstraints({
                advanced: [{
                  fillLightMode: e ? "flash" : "off",
                  torch: !!e
                }]
              })];
            case 1:
              return n.sent(), [
                2
                /*return*/
              ];
          }
        });
      });
    }, r.mediaStreamIsTorchCompatible = function(t) {
      var e, n, i = t.getVideoTracks();
      try {
        for (var a = Pe(i), o = a.next(); !o.done; o = a.next()) {
          var f = o.value;
          if (r.mediaStreamIsTorchCompatibleTrack(f))
            return !0;
        }
      } catch (s) {
        e = { error: s };
      } finally {
        try {
          o && !o.done && (n = a.return) && n.call(a);
        } finally {
          if (e)
            throw e.error;
        }
      }
      return !1;
    }, r.mediaStreamIsTorchCompatibleTrack = function(t) {
      try {
        var e = t.getCapabilities();
        return "torch" in e;
      } catch (n) {
        return console.error(n), console.warn("Your browser may be not fully compatible with WebRTC and/or ImageCapture specs. Torch will not be available."), !1;
      }
    }, r.isVideoPlaying = function(t) {
      return t.currentTime > 0 && !t.paused && t.readyState > 2;
    }, r.getMediaElement = function(t, e) {
      var n = document.getElementById(t);
      if (!n)
        throw new tt("element with id '".concat(t, "' not found"));
      if (n.nodeName.toLowerCase() !== e.toLowerCase())
        throw new tt("element with id '".concat(t, "' must be an ").concat(e, " element"));
      return n;
    }, r.createVideoElement = function(t) {
      if (t instanceof HTMLVideoElement)
        return t;
      if (typeof t == "string")
        return r.getMediaElement(t, "video");
      if (!t && typeof document < "u") {
        var e = document.createElement("video");
        return e.width = 200, e.height = 200, e;
      }
      throw new Error("Couldn't get videoElement from videoSource!");
    }, r.prepareImageElement = function(t) {
      if (t instanceof HTMLImageElement)
        return t;
      if (typeof t == "string")
        return r.getMediaElement(t, "img");
      if (typeof t > "u") {
        var e = document.createElement("img");
        return e.width = 200, e.height = 200, e;
      }
      throw new Error("Couldn't get imageElement from imageSource!");
    }, r.prepareVideoElement = function(t) {
      var e = r.createVideoElement(t);
      return e.setAttribute("autoplay", "true"), e.setAttribute("muted", "true"), e.setAttribute("playsinline", "true"), e;
    }, r.isImageLoaded = function(t) {
      return !(!t.complete || t.naturalWidth === 0);
    }, r.createBinaryBitmapFromCanvas = function(t) {
      var e = new Uo(t), n = new Fr(e);
      return new Br(n);
    }, r.drawImageOnCanvas = function(t, e) {
      t.drawImage(e, 0, 0);
    }, r.getMediaElementDimensions = function(t) {
      if (t instanceof HTMLVideoElement)
        return {
          height: t.videoHeight,
          width: t.videoWidth
        };
      if (t instanceof HTMLImageElement)
        return {
          height: t.naturalHeight || t.height,
          width: t.naturalWidth || t.width
        };
      throw new Error("Couldn't find the Source's dimensions!");
    }, r.createCaptureCanvas = function(t) {
      if (!t)
        throw new tt("Cannot create a capture canvas without a media element.");
      if (typeof document > "u")
        throw new Error(`The page "Document" is undefined, make sure you're running in a browser.`);
      var e = document.createElement("canvas"), n = r.getMediaElementDimensions(t), i = n.width, a = n.height;
      return e.style.width = i + "px", e.style.height = a + "px", e.width = i, e.height = a, e;
    }, r.tryPlayVideo = function(t) {
      return q(this, void 0, void 0, function() {
        var e;
        return Q(this, function(n) {
          switch (n.label) {
            case 0:
              if (t != null && t.ended)
                return console.error("Trying to play video that has ended."), [2, !1];
              if (r.isVideoPlaying(t))
                return console.warn("Trying to play video that is already playing."), [2, !0];
              n.label = 1;
            case 1:
              return n.trys.push([1, 3, , 4]), [4, t.play()];
            case 2:
              return n.sent(), [2, !0];
            case 3:
              return e = n.sent(), console.warn("It was not possible to play the video.", e), [2, !1];
            case 4:
              return [
                2
                /*return*/
              ];
          }
        });
      });
    }, r.createCanvasFromMediaElement = function(t) {
      var e = r.createCaptureCanvas(t), n = e.getContext("2d");
      if (!n)
        throw new Error("Couldn't find Canvas 2D Context.");
      return r.drawImageOnCanvas(n, t), e;
    }, r.createBinaryBitmapFromMediaElem = function(t) {
      var e = r.createCanvasFromMediaElement(t);
      return r.createBinaryBitmapFromCanvas(e);
    }, r.destroyImageElement = function(t) {
      t.src = "", t.removeAttribute("src"), t = void 0;
    }, r.listVideoInputDevices = function() {
      return q(this, void 0, void 0, function() {
        var t, e, n, i, a, o, f, s, u, c, l, h;
        return Q(this, function(d) {
          switch (d.label) {
            case 0:
              if (!Qr())
                throw new Error("Can't enumerate devices, navigator is not present.");
              if (!Ho())
                throw new Error("Can't enumerate devices, method not supported.");
              return [4, navigator.mediaDevices.enumerateDevices()];
            case 1:
              t = d.sent(), e = [];
              try {
                for (n = Pe(t), i = n.next(); !i.done; i = n.next())
                  a = i.value, o = a.kind === "video" ? "videoinput" : a.kind, o === "videoinput" && (f = a.deviceId || a.id, s = a.label || "Video device ".concat(e.length + 1), u = a.groupId, c = { deviceId: f, label: s, kind: o, groupId: u }, e.push(c));
              } catch (v) {
                l = { error: v };
              } finally {
                try {
                  i && !i.done && (h = n.return) && h.call(n);
                } finally {
                  if (l)
                    throw l.error;
                }
              }
              return [2, e];
          }
        });
      });
    }, r.findDeviceById = function(t) {
      return q(this, void 0, void 0, function() {
        var e;
        return Q(this, function(n) {
          switch (n.label) {
            case 0:
              return [4, r.listVideoInputDevices()];
            case 1:
              return e = n.sent(), e ? [2, e.find(function(i) {
                return i.deviceId === t;
              })] : [
                2
                /*return*/
              ];
          }
        });
      });
    }, r.cleanVideoSource = function(t) {
      if (t) {
        try {
          t.srcObject = null;
        } catch {
          t.src = "";
        }
        t && t.removeAttribute("src");
      }
    }, r.releaseAllStreams = function() {
      r.streamTracker.length !== 0 && r.streamTracker.forEach(function(t) {
        t.getTracks().forEach(function(e) {
          return e.stop();
        });
      }), r.streamTracker = [];
    }, r.playVideoOnLoadAsync = function(t, e) {
      return q(this, void 0, void 0, function() {
        var n;
        return Q(this, function(i) {
          switch (i.label) {
            case 0:
              return [4, r.tryPlayVideo(t)];
            case 1:
              return n = i.sent(), n ? [2, !0] : [2, new Promise(function(a, o) {
                var f = setTimeout(function() {
                  r.isVideoPlaying(t) || (o(!1), t.removeEventListener("canplay", s));
                }, e), s = function() {
                  r.tryPlayVideo(t).then(function(u) {
                    clearTimeout(f), t.removeEventListener("canplay", s), a(u);
                  });
                };
                t.addEventListener("canplay", s);
              })];
          }
        });
      });
    }, r.attachStreamToVideo = function(t, e, n) {
      return n === void 0 && (n = 5e3), q(this, void 0, void 0, function() {
        var i;
        return Q(this, function(a) {
          switch (a.label) {
            case 0:
              return i = r.prepareVideoElement(e), r.addVideoSource(i, t), [4, r.playVideoOnLoadAsync(i, n)];
            case 1:
              return a.sent(), [2, i];
          }
        });
      });
    }, r._waitImageLoad = function(t) {
      return new Promise(function(e, n) {
        var i = 1e4, a = setTimeout(function() {
          r.isImageLoaded(t) || (t.removeEventListener("load", o), n());
        }, i), o = function() {
          clearTimeout(a), t.removeEventListener("load", o), e();
        };
        t.addEventListener("load", o);
      });
    }, r.checkCallbackFnOrThrow = function(t) {
      if (!t)
        throw new tt("`callbackFn` is a required parameter, you cannot capture results without it.");
    }, r.disposeMediaStream = function(t) {
      t.getVideoTracks().forEach(function(e) {
        return e.stop();
      }), t = void 0;
    }, r.prototype.decode = function(t) {
      var e = r.createCanvasFromMediaElement(t);
      return this.decodeFromCanvas(e);
    }, r.prototype.decodeBitmap = function(t) {
      return this.reader.decode(t, this.hints);
    }, r.prototype.decodeFromCanvas = function(t) {
      var e = r.createBinaryBitmapFromCanvas(t);
      return this.decodeBitmap(e);
    }, r.prototype.decodeFromImageElement = function(t) {
      return q(this, void 0, void 0, function() {
        var e;
        return Q(this, function(n) {
          switch (n.label) {
            case 0:
              if (!t)
                throw new tt("An image element must be provided.");
              return e = r.prepareImageElement(t), [4, this._decodeOnLoadImage(e)];
            case 1:
              return [2, n.sent()];
          }
        });
      });
    }, r.prototype.decodeFromImageUrl = function(t) {
      return q(this, void 0, void 0, function() {
        var e;
        return Q(this, function(n) {
          switch (n.label) {
            case 0:
              if (!t)
                throw new tt("An URL must be provided.");
              e = r.prepareImageElement(), e.src = t, n.label = 1;
            case 1:
              return n.trys.push([1, , 3, 4]), [4, this.decodeFromImageElement(e)];
            case 2:
              return [2, n.sent()];
            case 3:
              return r.destroyImageElement(e), [
                7
                /*endfinally*/
              ];
            case 4:
              return [
                2
                /*return*/
              ];
          }
        });
      });
    }, r.prototype.decodeFromConstraints = function(t, e, n) {
      return q(this, void 0, void 0, function() {
        var i, a;
        return Q(this, function(o) {
          switch (o.label) {
            case 0:
              return r.checkCallbackFnOrThrow(n), [4, this.getUserMedia(t)];
            case 1:
              i = o.sent(), o.label = 2;
            case 2:
              return o.trys.push([2, 4, , 5]), [4, this.decodeFromStream(i, e, n)];
            case 3:
              return [2, o.sent()];
            case 4:
              throw a = o.sent(), r.disposeMediaStream(i), a;
            case 5:
              return [
                2
                /*return*/
              ];
          }
        });
      });
    }, r.prototype.decodeFromStream = function(t, e, n) {
      return q(this, void 0, void 0, function() {
        var i, a, o, f, s, u, c, l, h, d = this;
        return Q(this, function(v) {
          switch (v.label) {
            case 0:
              return r.checkCallbackFnOrThrow(n), i = this.options.tryPlayVideoTimeout, [4, r.attachStreamToVideo(t, e, i)];
            case 1:
              return a = v.sent(), o = function() {
                r.disposeMediaStream(t), r.cleanVideoSource(a);
              }, f = this.scan(a, n, o), s = t.getVideoTracks(), u = Yt(Yt({}, f), { stop: function() {
                f.stop();
              }, streamVideoConstraintsApply: function(g, x) {
                return q(this, void 0, void 0, function() {
                  var w, y, _, E, m, I, S;
                  return Q(this, function(b) {
                    switch (b.label) {
                      case 0:
                        w = x ? s.filter(x) : s, b.label = 1;
                      case 1:
                        b.trys.push([1, 6, 7, 8]), y = Pe(w), _ = y.next(), b.label = 2;
                      case 2:
                        return _.done ? [3, 5] : (E = _.value, [4, E.applyConstraints(g)]);
                      case 3:
                        b.sent(), b.label = 4;
                      case 4:
                        return _ = y.next(), [3, 2];
                      case 5:
                        return [3, 8];
                      case 6:
                        return m = b.sent(), I = { error: m }, [3, 8];
                      case 7:
                        try {
                          _ && !_.done && (S = y.return) && S.call(y);
                        } finally {
                          if (I)
                            throw I.error;
                        }
                        return [
                          7
                          /*endfinally*/
                        ];
                      case 8:
                        return [
                          2
                          /*return*/
                        ];
                    }
                  });
                });
              }, streamVideoConstraintsGet: function(g) {
                return s.find(g).getConstraints();
              }, streamVideoSettingsGet: function(g) {
                return s.find(g).getSettings();
              }, streamVideoCapabilitiesGet: function(g) {
                return s.find(g).getCapabilities();
              } }), c = r.mediaStreamIsTorchCompatible(t), c && (l = s == null ? void 0 : s.find(function(g) {
                return r.mediaStreamIsTorchCompatibleTrack(g);
              }), h = function(g) {
                return q(d, void 0, void 0, function() {
                  return Q(this, function(x) {
                    switch (x.label) {
                      case 0:
                        return [4, r.mediaStreamSetTorch(l, g)];
                      case 1:
                        return x.sent(), [
                          2
                          /*return*/
                        ];
                    }
                  });
                });
              }, u.switchTorch = h, u.stop = function() {
                return q(d, void 0, void 0, function() {
                  return Q(this, function(g) {
                    switch (g.label) {
                      case 0:
                        return f.stop(), [4, h(!1)];
                      case 1:
                        return g.sent(), [
                          2
                          /*return*/
                        ];
                    }
                  });
                });
              }), [2, u];
          }
        });
      });
    }, r.prototype.decodeFromVideoDevice = function(t, e, n) {
      return q(this, void 0, void 0, function() {
        var i, a;
        return Q(this, function(o) {
          switch (o.label) {
            case 0:
              return r.checkCallbackFnOrThrow(n), t ? i = { deviceId: { exact: t } } : i = { facingMode: "environment" }, a = { video: i }, [4, this.decodeFromConstraints(a, e, n)];
            case 1:
              return [2, o.sent()];
          }
        });
      });
    }, r.prototype.decodeFromVideoElement = function(t, e) {
      return q(this, void 0, void 0, function() {
        var n, i;
        return Q(this, function(a) {
          switch (a.label) {
            case 0:
              if (r.checkCallbackFnOrThrow(e), !t)
                throw new tt("A video element must be provided.");
              return n = r.prepareVideoElement(t), i = this.options.tryPlayVideoTimeout, [4, r.playVideoOnLoadAsync(n, i)];
            case 1:
              return a.sent(), [2, this.scan(n, e)];
          }
        });
      });
    }, r.prototype.decodeFromVideoUrl = function(t, e) {
      return q(this, void 0, void 0, function() {
        var n, i, a, o;
        return Q(this, function(f) {
          switch (f.label) {
            case 0:
              if (r.checkCallbackFnOrThrow(e), !t)
                throw new tt("An URL must be provided.");
              return n = r.prepareVideoElement(), n.src = t, i = function() {
                r.cleanVideoSource(n);
              }, a = this.options.tryPlayVideoTimeout, [4, r.playVideoOnLoadAsync(n, a)];
            case 1:
              return f.sent(), o = this.scan(n, e, i), [2, o];
          }
        });
      });
    }, r.prototype.decodeOnceFromConstraints = function(t, e) {
      return q(this, void 0, void 0, function() {
        var n;
        return Q(this, function(i) {
          switch (i.label) {
            case 0:
              return [4, this.getUserMedia(t)];
            case 1:
              return n = i.sent(), [4, this.decodeOnceFromStream(n, e)];
            case 2:
              return [2, i.sent()];
          }
        });
      });
    }, r.prototype.decodeOnceFromStream = function(t, e) {
      return q(this, void 0, void 0, function() {
        var n, i, a;
        return Q(this, function(o) {
          switch (o.label) {
            case 0:
              return n = !!e, [4, r.attachStreamToVideo(t, e)];
            case 1:
              i = o.sent(), o.label = 2;
            case 2:
              return o.trys.push([2, , 4, 5]), [4, this.scanOneResult(i)];
            case 3:
              return a = o.sent(), [2, a];
            case 4:
              return n || r.cleanVideoSource(i), [
                7
                /*endfinally*/
              ];
            case 5:
              return [
                2
                /*return*/
              ];
          }
        });
      });
    }, r.prototype.decodeOnceFromVideoDevice = function(t, e) {
      return q(this, void 0, void 0, function() {
        var n, i;
        return Q(this, function(a) {
          switch (a.label) {
            case 0:
              return t ? n = { deviceId: { exact: t } } : n = { facingMode: "environment" }, i = { video: n }, [4, this.decodeOnceFromConstraints(i, e)];
            case 1:
              return [2, a.sent()];
          }
        });
      });
    }, r.prototype.decodeOnceFromVideoElement = function(t) {
      return q(this, void 0, void 0, function() {
        var e, n;
        return Q(this, function(i) {
          switch (i.label) {
            case 0:
              if (!t)
                throw new tt("A video element must be provided.");
              return e = r.prepareVideoElement(t), n = this.options.tryPlayVideoTimeout, [4, r.playVideoOnLoadAsync(e, n)];
            case 1:
              return i.sent(), [4, this.scanOneResult(e)];
            case 2:
              return [2, i.sent()];
          }
        });
      });
    }, r.prototype.decodeOnceFromVideoUrl = function(t) {
      return q(this, void 0, void 0, function() {
        var e, n;
        return Q(this, function(i) {
          switch (i.label) {
            case 0:
              if (!t)
                throw new tt("An URL must be provided.");
              e = r.prepareVideoElement(), e.src = t, n = this.decodeOnceFromVideoElement(e), i.label = 1;
            case 1:
              return i.trys.push([1, , 3, 4]), [4, n];
            case 2:
              return [2, i.sent()];
            case 3:
              return r.cleanVideoSource(e), [
                7
                /*endfinally*/
              ];
            case 4:
              return [
                2
                /*return*/
              ];
          }
        });
      });
    }, r.prototype.scanOneResult = function(t, e, n, i) {
      var a = this;
      return e === void 0 && (e = !0), n === void 0 && (n = !0), i === void 0 && (i = !0), new Promise(function(o, f) {
        a.scan(t, function(s, u, c) {
          if (s) {
            o(s), c.stop();
            return;
          }
          if (u) {
            if (u instanceof C && e || u instanceof et && n || u instanceof T && i)
              return;
            c.stop(), f(u);
          }
        });
      });
    }, r.prototype.scan = function(t, e, n) {
      var i = this;
      r.checkCallbackFnOrThrow(e);
      var a = r.createCaptureCanvas(t), o = a.getContext("2d");
      if (!o)
        throw new Error("Couldn't create canvas for visual element scan.");
      var f = function() {
        o = void 0, a = void 0;
      }, s = !1, u, c = function() {
        s = !0, clearTimeout(u), f(), n && n();
      }, l = { stop: c }, h = function() {
        if (!s)
          try {
            r.drawImageOnCanvas(o, t);
            var d = i.decodeFromCanvas(a);
            e(d, void 0, l), u = setTimeout(h, i.options.delayBetweenScanSuccess);
          } catch (w) {
            e(void 0, w, l);
            var v = w instanceof et, g = w instanceof T, x = w instanceof C;
            if (v || g || x) {
              u = setTimeout(h, i.options.delayBetweenScanAttempts);
              return;
            }
            f(), n && n(w);
          }
      };
      return h(), l;
    }, r.prototype._decodeOnLoadImage = function(t) {
      return q(this, void 0, void 0, function() {
        var e;
        return Q(this, function(n) {
          switch (n.label) {
            case 0:
              return e = r.isImageLoaded(t), e ? [3, 2] : [4, r._waitImageLoad(t)];
            case 1:
              n.sent(), n.label = 2;
            case 2:
              return [2, this.decode(t)];
          }
        });
      });
    }, r.prototype.getUserMedia = function(t) {
      return q(this, void 0, void 0, function() {
        var e;
        return Q(this, function(n) {
          switch (n.label) {
            case 0:
              return [4, navigator.mediaDevices.getUserMedia(t)];
            case 1:
              return e = n.sent(), r.streamTracker.push(e), [2, e];
          }
        });
      });
    }, r.streamTracker = [], r;
  }()
), Xo = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        Object.prototype.hasOwnProperty.call(i, a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    if (typeof e != "function" && e !== null)
      throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}();
(function(r) {
  Xo(t, r);
  function t(e, n) {
    return r.call(this, new he(), e, n) || this;
  }
  return t;
})(qt);
var Wo = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        Object.prototype.hasOwnProperty.call(i, a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    if (typeof e != "function" && e !== null)
      throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}();
(function(r) {
  Wo(t, r);
  function t(e, n) {
    return r.call(this, new zt(e), e, n) || this;
  }
  return t;
})(qt);
var zo = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        Object.prototype.hasOwnProperty.call(i, a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    if (typeof e != "function" && e !== null)
      throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}();
(function(r) {
  zo(t, r);
  function t(e, n) {
    return r.call(this, new ve(), e, n) || this;
  }
  return t;
})(qt);
var jo = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        Object.prototype.hasOwnProperty.call(i, a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    if (typeof e != "function" && e !== null)
      throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}();
(function(r) {
  jo(t, r);
  function t(e, n) {
    var i = this, a = new Yr();
    return a.setHints(e), i = r.call(this, a, e, n) || this, i.reader = a, i;
  }
  return Object.defineProperty(t.prototype, "possibleFormats", {
    set: function(e) {
      this.hints.set($.POSSIBLE_FORMATS, e), this.reader.setHints(this.hints);
    },
    enumerable: !1,
    configurable: !0
  }), t.prototype.decodeBitmap = function(e) {
    return this.reader.decodeWithState(e);
  }, t.prototype.setHints = function(e) {
    this.hints = e, this.reader.setHints(this.hints);
  }, t;
})(qt);
var Yo = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        Object.prototype.hasOwnProperty.call(i, a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    if (typeof e != "function" && e !== null)
      throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}();
(function(r) {
  Yo(t, r);
  function t(e, n) {
    return r.call(this, new ge(), e, n) || this;
  }
  return t;
})(qt);
var Zo = globalThis && globalThis.__extends || function() {
  var r = function(t, e) {
    return r = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, i) {
      n.__proto__ = i;
    } || function(n, i) {
      for (var a in i)
        Object.prototype.hasOwnProperty.call(i, a) && (n[a] = i[a]);
    }, r(t, e);
  };
  return function(t, e) {
    if (typeof e != "function" && e !== null)
      throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
    r(t, e);
    function n() {
      this.constructor = t;
    }
    t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
  };
}(), $o = (
  /** @class */
  function(r) {
    Zo(t, r);
    function t(e, n) {
      return r.call(this, new pe(), e, n) || this;
    }
    return t;
  }(qt)
), Mr = "http://www.w3.org/2000/svg", Ko = (
  /** @class */
  function() {
    function r() {
    }
    return r.prototype.write = function(t, e, n, i) {
      if (t.length === 0)
        throw new D("Found empty contents");
      if (e < 0 || n < 0)
        throw new D("Requested dimensions are too small: " + e + "x" + n);
      var a = Ve.L, o = r.QUIET_ZONE_SIZE;
      if (i) {
        if (i.get(Ot.ERROR_CORRECTION) !== void 0) {
          var f = i.get(Ot.ERROR_CORRECTION).toString();
          a = Ve.fromString(f);
        }
        i.get(Ot.MARGIN) !== void 0 && (o = Number.parseInt(i.get(Ot.MARGIN).toString(), 10));
      }
      var s = Ga.encode(t, a, i);
      return this.renderResult(s, e, n, o);
    }, r.prototype.writeToDom = function(t, e, n, i, a) {
      if (typeof t == "string") {
        var o = document.querySelector(t);
        if (!o)
          throw new Error("Could no find the target HTML element.");
        t = o;
      }
      var f = this.write(e, n, i, a);
      t instanceof HTMLElement && t.appendChild(f);
    }, r.prototype.renderResult = function(t, e, n, i) {
      var a = t.getMatrix();
      if (a === null)
        throw new Kt();
      for (var o = a.getWidth(), f = a.getHeight(), s = o + i * 2, u = f + i * 2, c = Math.max(e, s), l = Math.max(n, u), h = Math.min(Math.floor(c / s), Math.floor(l / u)), d = Math.floor((c - o * h) / 2), v = Math.floor((l - f * h) / 2), g = this.createSVGElement(c, l), x = 0, w = v; x < f; x++, w += h)
        for (var y = 0, _ = d; y < o; y++, _ += h)
          if (a.get(y, x) === 1) {
            var E = this.createSvgRectElement(_, w, h, h);
            g.appendChild(E);
          }
      return g;
    }, r.prototype.createSVGElement = function(t, e) {
      var n = document.createElementNS(Mr, "svg"), i = t.toString(), a = e.toString();
      return n.setAttribute("height", a), n.setAttribute("width", i), n.setAttribute("viewBox", "0 0 " + i + " " + a), n;
    }, r.prototype.createSvgRectElement = function(t, e, n, i) {
      var a = document.createElementNS(Mr, "rect");
      return a.setAttribute("x", t.toString()), a.setAttribute("y", e.toString()), a.setAttribute("height", n.toString()), a.setAttribute("width", i.toString()), a.setAttribute("fill", "#000000"), a;
    }, r.QUIET_ZONE_SIZE = 4, r;
  }()
);
function qo(r) {
  return `data:image/svg+xml;base64,${btoa(decodeURIComponent(r.outerHTML))}`;
}
function Jo(r, t = {}) {
  const e = r.command;
  e.executeInsertBarcode2D = (n, i, a, o) => {
    const f = new Ko();
    o || (o = /* @__PURE__ */ new Map()), o.has(Ot.MARGIN) || o.set(Ot.MARGIN, 0);
    const s = f.write(n, i, a, o);
    s.setAttribute("xmlns", "http://www.w3.org/2000/svg"), e.executeInsertElementList([
      {
        type: Qe.IMAGE,
        value: qo(s),
        width: i,
        height: a
      }
    ]);
  }, t.isRegisterDetectorContextMenu && r.register.contextMenuList([
    {
      name: "识别二维码链接",
      icon: "qrcode",
      when: (n) => {
        var i;
        return n.startElement === n.endElement && ((i = n.startElement) == null ? void 0 : i.type) === Qe.IMAGE;
      },
      callback: async (n, i) => {
        var u;
        const a = (u = i.startElement) == null ? void 0 : u.value;
        if (!a)
          return;
        const s = (await new $o().decodeFromImageUrl(a)).getText();
        s && /^(http|https):.*/.test(s) && window.open(s, "_blank");
      }
    }
  ]);
}
export {
  Jo as default
};
//# sourceMappingURL=barcode2d.js.map
