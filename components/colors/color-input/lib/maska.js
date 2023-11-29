/*! maska v2.1.3 | (c) Alexander Shabunevich | Released under the MIT license */
var b = Object.defineProperty;
var L = (n, t, s) => t in n ? b(n, t, { enumerable: !0, configurable: !0, writable: !0, value: s }) : n[t] = s;
var f = (n, t, s) => (L(n, typeof t != "symbol" ? t + "" : t, s), s);
const R = {
  "#": { pattern: /[0-9]/ },
  "@": { pattern: /[a-zA-Z]/ },
  "*": { pattern: /[a-zA-Z0-9]/ }
};
class w {
  constructor(t = {}) {
    f(this, "opts", {});
    f(this, "memo", /* @__PURE__ */ new Map());
    var e;
    const s = { ...t };
    if (s.tokens != null) {
      s.tokens = s.tokensReplace ? { ...s.tokens } : { ...R, ...s.tokens };
      for (const a of Object.values(s.tokens))
        typeof a.pattern == "string" && (a.pattern = new RegExp(a.pattern));
    } else
      s.tokens = R;
    Array.isArray(s.mask) && (s.mask.length > 1 ? s.mask.sort((a, i) => a.length - i.length) : s.mask = (e = s.mask[0]) != null ? e : ""), s.mask === "" && (s.mask = null), this.opts = s;
  }
  masked(t) {
    return this.process(t, this.findMask(t));
  }
  unmasked(t) {
    return this.process(t, this.findMask(t), !1);
  }
  isEager() {
    return this.opts.eager === !0;
  }
  isReversed() {
    return this.opts.reversed === !0;
  }
  completed(t) {
    const s = this.findMask(t);
    if (this.opts.mask == null || s == null)
      return !1;
    const e = this.process(t, s).length;
    return typeof this.opts.mask == "string" ? e >= this.opts.mask.length : typeof this.opts.mask == "function" ? e >= s.length : this.opts.mask.filter((a) => e >= a.length).length === this.opts.mask.length;
  }
  findMask(t) {
    var a, i;
    const s = this.opts.mask;
    if (s == null)
      return null;
    if (typeof s == "string")
      return s;
    if (typeof s == "function")
      return s(t);
    const e = this.process(t, (a = s.slice(-1).pop()) != null ? a : "", !1);
    return (i = s.find((p) => this.process(t, p, !1).length >= e.length)) != null ? i : "";
  }
  escapeMask(t) {
    const s = [], e = [];
    return t.split("").forEach((a, i) => {
      a === "!" && t[i - 1] !== "!" ? e.push(i - e.length) : s.push(a);
    }), { mask: s.join(""), escaped: e };
  }
  process(t, s, e = !0) {
    var v;
    if (s == null)
      return t;
    const a = `value=${t},mask=${s},masked=${e ? 1 : 0}`;
    if (this.memo.has(a))
      return this.memo.get(a);
    const { mask: i, escaped: p } = this.escapeMask(s), l = [], k = this.opts.tokens != null ? this.opts.tokens : {}, r = this.isReversed() ? -1 : 1, u = this.isReversed() ? "unshift" : "push", g = this.isReversed() ? 0 : i.length - 1, V = this.isReversed() ? () => o > -1 && c > -1 : () => o < i.length && c < t.length, W = (m) => !this.isReversed() && m <= g || this.isReversed() && m >= g;
    let E, d = -1, o = this.isReversed() ? i.length - 1 : 0, c = this.isReversed() ? t.length - 1 : 0;
    for (; V(); ) {
      const m = i.charAt(o), h = k[m], M = (h == null ? void 0 : h.transform) != null ? h.transform(t.charAt(c)) : t.charAt(c);
      if (!p.includes(o) && h != null) {
        if (M.match(h.pattern) != null)
          l[u](M), h.repeated ? (d === -1 ? d = o : o === g && o !== d && (o = d - r), g === d && (o -= r)) : h.multiple && (o -= r), o += r;
        else if (h.multiple) {
          const P = ((v = l[c - r]) == null ? void 0 : v.match(h.pattern)) != null, A = i.charAt(o + r);
          P && A !== "" && k[A] == null ? (o += r, c -= r) : l[u]("");
        } else
          M === E ? E = void 0 : h.optional && (o += r, c -= r);
        c += r;
      } else
        e && !this.isEager() && l[u](m), M === m && !this.isEager() ? c += r : E = m, this.isEager() || (o += r);
      if (this.isEager())
        for (; W(o) && (k[i.charAt(o)] == null || p.includes(o)); )
          e ? l[u](i.charAt(o)) : i.charAt(o) === t.charAt(c) && (c += r), o += r;
    }
    return this.memo.set(a, l.join("")), this.memo.get(a);
  }
}
const S = (n) => JSON.parse(n.replaceAll("'", '"')), O = (n, t = {}) => {
  const s = { ...t };
  return n.dataset.maska != null && n.dataset.maska !== "" && (s.mask = x(n.dataset.maska)), n.dataset.maskaEager != null && (s.eager = y(n.dataset.maskaEager)), n.dataset.maskaReversed != null && (s.reversed = y(n.dataset.maskaReversed)), n.dataset.maskaTokensReplace != null && (s.tokensReplace = y(n.dataset.maskaTokensReplace)), n.dataset.maskaTokens != null && (s.tokens = J(n.dataset.maskaTokens)), s;
}, y = (n) => n !== "" ? Boolean(JSON.parse(n)) : !0, x = (n) => n.startsWith("[") && n.endsWith("]") ? S(n) : n, J = (n) => {
  if (n.startsWith("{") && n.endsWith("}"))
    return S(n);
  const t = {};
  return n.split("|").forEach((s) => {
    const e = s.split(":");
    t[e[0]] = {
      pattern: new RegExp(e[1]),
      optional: e[2] === "optional",
      multiple: e[2] === "multiple",
      repeated: e[2] === "repeated"
    };
  }), t;
};
class N {
  constructor(t, s = {}) {
    f(this, "items", /* @__PURE__ */ new Map());
    f(this, "beforeinputEvent", (t) => {
      const s = t.target, e = this.items.get(s);
      e.isEager() && "inputType" in t && t.inputType.startsWith("delete") && e.unmasked(s.value).length <= 1 && this.setMaskedValue(s, "");
    });
    f(this, "inputEvent", (t) => {
      if (t instanceof CustomEvent && t.type === "input" && t.detail != null && typeof t.detail == "object" && "masked" in t.detail)
        return;
      const s = t.target, e = this.items.get(s), a = s.value, i = s.selectionStart, p = s.selectionEnd;
      let l = a;
      if (e.isEager()) {
        const k = e.unmasked(a), r = e.masked(k);
        k === "" && "data" in t && t.data != null ? l = t.data : (r.startsWith(a) || e.completed(k)) && (l = k);
      }
      this.setMaskedValue(s, l), "inputType" in t && (t.inputType.startsWith("delete") || i != null && i < a.length) && s.setSelectionRange(i, p);
    });
    this.options = s, typeof t == "string" ? this.init(
      Array.from(document.querySelectorAll(t)),
      this.getMaskOpts(s)
    ) : this.init(
      "length" in t ? Array.from(t) : [t],
      this.getMaskOpts(s)
    );
  }
  destroy() {
    for (const t of this.items.keys())
      t.removeEventListener("input", this.inputEvent), t.removeEventListener("beforeinput", this.beforeinputEvent);
    this.items.clear();
  }
  needUpdate(t, s) {
    const e = this.items.get(t), a = new w(O(t, this.getMaskOpts(s)));
    return JSON.stringify(e.opts) !== JSON.stringify(a.opts);
  }
  getMaskOpts(t) {
    const { onMaska: s, preProcess: e, postProcess: a, ...i } = t;
    return i;
  }
  init(t, s) {
    for (const e of t) {
      const a = new w(O(e, s));
      this.items.set(e, a), e.value !== "" && this.setMaskedValue(e, e.value), e.addEventListener("input", this.inputEvent), e.addEventListener("beforeinput", this.beforeinputEvent);
    }
  }
  setMaskedValue(t, s) {
    const e = this.items.get(t);
    this.options.preProcess != null && (s = this.options.preProcess(s)), s = e.masked(s), this.options.postProcess != null && (s = this.options.postProcess(s)), t.value = s, t.dataset.maskaValue = s;
    const a = {
      masked: e.masked(s),
      unmasked: e.unmasked(s),
      completed: e.completed(s)
    };
    this.options.onMaska != null && (Array.isArray(this.options.onMaska) ? this.options.onMaska.forEach((i) => i(a)) : this.options.onMaska(a)), t.dispatchEvent(new CustomEvent("maska", { detail: a })), t.dispatchEvent(new CustomEvent("input", { detail: a }));
  }
}
const T = /* @__PURE__ */ new WeakMap(), C = (n) => {
  const t = n.dataset.maskaValue;
  (t == null && n.value !== "" || t != null && t !== n.value) && n.dispatchEvent(new CustomEvent("input"));
}, I = (n, t) => {
  const s = n instanceof HTMLInputElement ? n : n.querySelector("input"), e = { ...t.arg };
  if (s == null)
    return;
  const a = T.get(s);
  if (a != null) {
    if (C(s), !a.needUpdate(s, e))
      return;
    a.destroy();
  }
  if (t.value != null) {
    const i = t.value, p = (l) => {
      i.masked = l.masked, i.unmasked = l.unmasked, i.completed = l.completed;
    };
    e.onMaska = e.onMaska == null ? p : Array.isArray(e.onMaska) ? [...e.onMaska, p] : [e.onMaska, p];
  }
  T.set(s, new N(s, e)), setTimeout(() => {
    C(s);
  });
};
export {
  w as Mask,
  N as MaskInput,
  R as tokens,
  I as vMaska
};