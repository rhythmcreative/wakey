/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const M = globalThis, q = M.ShadowRoot && (M.ShadyCSS === void 0 || M.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, F = Symbol(), Y = /* @__PURE__ */ new WeakMap();
let ne = class {
  constructor(e, i, s) {
    if (this._$cssResult$ = !0, s !== F) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = i;
  }
  get styleSheet() {
    let e = this.o;
    const i = this.t;
    if (q && e === void 0) {
      const s = i !== void 0 && i.length === 1;
      s && (e = Y.get(i)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), s && Y.set(i, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const _e = (t) => new ne(typeof t == "string" ? t : t + "", void 0, F), le = (t, ...e) => {
  const i = t.length === 1 ? t[0] : e.reduce((s, r, a) => s + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + t[a + 1], t[0]);
  return new ne(i, t, F);
}, me = (t, e) => {
  if (q) t.adoptedStyleSheets = e.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of e) {
    const s = document.createElement("style"), r = M.litNonce;
    r !== void 0 && s.setAttribute("nonce", r), s.textContent = i.cssText, t.appendChild(s);
  }
}, G = q ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let i = "";
  for (const s of e.cssRules) i += s.cssText;
  return _e(i);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: ge, defineProperty: fe, getOwnPropertyDescriptor: ve, getOwnPropertyNames: ye, getOwnPropertySymbols: $e, getPrototypeOf: be } = Object, W = globalThis, X = W.trustedTypes, we = X ? X.emptyScript : "", xe = W.reactiveElementPolyfillSupport, O = (t, e) => t, R = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? we : null;
      break;
    case Object:
    case Array:
      t = t == null ? t : JSON.stringify(t);
  }
  return t;
}, fromAttribute(t, e) {
  let i = t;
  switch (e) {
    case Boolean:
      i = t !== null;
      break;
    case Number:
      i = t === null ? null : Number(t);
      break;
    case Object:
    case Array:
      try {
        i = JSON.parse(t);
      } catch {
        i = null;
      }
  }
  return i;
} }, V = (t, e) => !ge(t, e), Q = { attribute: !0, type: String, converter: R, reflect: !1, useDefault: !1, hasChanged: V };
Symbol.metadata ??= Symbol("metadata"), W.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let k = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, i = Q) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(e, i), !i.noAccessor) {
      const s = Symbol(), r = this.getPropertyDescriptor(e, s, i);
      r !== void 0 && fe(this.prototype, e, r);
    }
  }
  static getPropertyDescriptor(e, i, s) {
    const { get: r, set: a } = ve(this.prototype, e) ?? { get() {
      return this[i];
    }, set(o) {
      this[i] = o;
    } };
    return { get: r, set(o) {
      const c = r?.call(this);
      a?.call(this, o), this.requestUpdate(e, c, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? Q;
  }
  static _$Ei() {
    if (this.hasOwnProperty(O("elementProperties"))) return;
    const e = be(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(O("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(O("properties"))) {
      const i = this.properties, s = [...ye(i), ...$e(i)];
      for (const r of s) this.createProperty(r, i[r]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const i = litPropertyMetadata.get(e);
      if (i !== void 0) for (const [s, r] of i) this.elementProperties.set(s, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [i, s] of this.elementProperties) {
      const r = this._$Eu(i, s);
      r !== void 0 && this._$Eh.set(r, i);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const i = [];
    if (Array.isArray(e)) {
      const s = new Set(e.flat(1 / 0).reverse());
      for (const r of s) i.unshift(G(r));
    } else e !== void 0 && i.push(G(e));
    return i;
  }
  static _$Eu(e, i) {
    const s = i.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e) => e(this));
  }
  addController(e) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
  }
  removeController(e) {
    this._$EO?.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), i = this.constructor.elementProperties;
    for (const s of i.keys()) this.hasOwnProperty(s) && (e.set(s, this[s]), delete this[s]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return me(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((e) => e.hostDisconnected?.());
  }
  attributeChangedCallback(e, i, s) {
    this._$AK(e, s);
  }
  _$ET(e, i) {
    const s = this.constructor.elementProperties.get(e), r = this.constructor._$Eu(e, s);
    if (r !== void 0 && s.reflect === !0) {
      const a = (s.converter?.toAttribute !== void 0 ? s.converter : R).toAttribute(i, s.type);
      this._$Em = e, a == null ? this.removeAttribute(r) : this.setAttribute(r, a), this._$Em = null;
    }
  }
  _$AK(e, i) {
    const s = this.constructor, r = s._$Eh.get(e);
    if (r !== void 0 && this._$Em !== r) {
      const a = s.getPropertyOptions(r), o = typeof a.converter == "function" ? { fromAttribute: a.converter } : a.converter?.fromAttribute !== void 0 ? a.converter : R;
      this._$Em = r;
      const c = o.fromAttribute(i, a.type);
      this[r] = c ?? this._$Ej?.get(r) ?? c, this._$Em = null;
    }
  }
  requestUpdate(e, i, s, r = !1, a) {
    if (e !== void 0) {
      const o = this.constructor;
      if (r === !1 && (a = this[e]), s ??= o.getPropertyOptions(e), !((s.hasChanged ?? V)(a, i) || s.useDefault && s.reflect && a === this._$Ej?.get(e) && !this.hasAttribute(o._$Eu(e, s)))) return;
      this.C(e, i, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, i, { useDefault: s, reflect: r, wrapped: a }, o) {
    s && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, o ?? i ?? this[e]), a !== !0 || o !== void 0) || (this._$AL.has(e) || (this.hasUpdated || s || (i = void 0), this._$AL.set(e, i)), r === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (i) {
      Promise.reject(i);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [r, a] of this._$Ep) this[r] = a;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [r, a] of s) {
        const { wrapped: o } = a, c = this[r];
        o !== !0 || this._$AL.has(r) || c === void 0 || this.C(r, void 0, a, c);
      }
    }
    let e = !1;
    const i = this._$AL;
    try {
      e = this.shouldUpdate(i), e ? (this.willUpdate(i), this._$EO?.forEach((s) => s.hostUpdate?.()), this.update(i)) : this._$EM();
    } catch (s) {
      throw e = !1, this._$EM(), s;
    }
    e && this._$AE(i);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    this._$EO?.forEach((i) => i.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Eq &&= this._$Eq.forEach((i) => this._$ET(i, this[i])), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
k.elementStyles = [], k.shadowRootOptions = { mode: "open" }, k[O("elementProperties")] = /* @__PURE__ */ new Map(), k[O("finalized")] = /* @__PURE__ */ new Map(), xe?.({ ReactiveElement: k }), (W.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const J = globalThis, ee = (t) => t, L = J.trustedTypes, te = L ? L.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, de = "$lit$", b = `lit$${Math.random().toFixed(9).slice(2)}$`, ce = "?" + b, Ae = `<${ce}>`, A = document, j = () => A.createComment(""), N = (t) => t === null || typeof t != "object" && typeof t != "function", Z = Array.isArray, ke = (t) => Z(t) || typeof t?.[Symbol.iterator] == "function", I = `[ 	
\f\r]`, T = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ie = /-->/g, se = />/g, w = RegExp(`>|${I}(?:([^\\s"'>=/]+)(${I}*=${I}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), re = /'/g, ae = /"/g, he = /^(?:script|style|textarea|title)$/i, Se = (t) => (e, ...i) => ({ _$litType$: t, strings: e, values: i }), d = Se(1), E = Symbol.for("lit-noChange"), n = Symbol.for("lit-nothing"), oe = /* @__PURE__ */ new WeakMap(), x = A.createTreeWalker(A, 129);
function pe(t, e) {
  if (!Z(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return te !== void 0 ? te.createHTML(e) : e;
}
const Ee = (t, e) => {
  const i = t.length - 1, s = [];
  let r, a = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", o = T;
  for (let c = 0; c < i; c++) {
    const l = t[c];
    let p, m, h = -1, v = 0;
    for (; v < l.length && (o.lastIndex = v, m = o.exec(l), m !== null); ) v = o.lastIndex, o === T ? m[1] === "!--" ? o = ie : m[1] !== void 0 ? o = se : m[2] !== void 0 ? (he.test(m[2]) && (r = RegExp("</" + m[2], "g")), o = w) : m[3] !== void 0 && (o = w) : o === w ? m[0] === ">" ? (o = r ?? T, h = -1) : m[1] === void 0 ? h = -2 : (h = o.lastIndex - m[2].length, p = m[1], o = m[3] === void 0 ? w : m[3] === '"' ? ae : re) : o === ae || o === re ? o = w : o === ie || o === se ? o = T : (o = w, r = void 0);
    const $ = o === w && t[c + 1].startsWith("/>") ? " " : "";
    a += o === T ? l + Ae : h >= 0 ? (s.push(p), l.slice(0, h) + de + l.slice(h) + b + $) : l + b + (h === -2 ? c : $);
  }
  return [pe(t, a + (t[i] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), s];
};
class z {
  constructor({ strings: e, _$litType$: i }, s) {
    let r;
    this.parts = [];
    let a = 0, o = 0;
    const c = e.length - 1, l = this.parts, [p, m] = Ee(e, i);
    if (this.el = z.createElement(p, s), x.currentNode = this.el.content, i === 2 || i === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (r = x.nextNode()) !== null && l.length < c; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const h of r.getAttributeNames()) if (h.endsWith(de)) {
          const v = m[o++], $ = r.getAttribute(h).split(b), D = /([.?@])?(.*)/.exec(v);
          l.push({ type: 1, index: a, name: D[2], strings: $, ctor: D[1] === "." ? Pe : D[1] === "?" ? Te : D[1] === "@" ? Oe : B }), r.removeAttribute(h);
        } else h.startsWith(b) && (l.push({ type: 6, index: a }), r.removeAttribute(h));
        if (he.test(r.tagName)) {
          const h = r.textContent.split(b), v = h.length - 1;
          if (v > 0) {
            r.textContent = L ? L.emptyScript : "";
            for (let $ = 0; $ < v; $++) r.append(h[$], j()), x.nextNode(), l.push({ type: 2, index: ++a });
            r.append(h[v], j());
          }
        }
      } else if (r.nodeType === 8) if (r.data === ce) l.push({ type: 2, index: a });
      else {
        let h = -1;
        for (; (h = r.data.indexOf(b, h + 1)) !== -1; ) l.push({ type: 7, index: a }), h += b.length - 1;
      }
      a++;
    }
  }
  static createElement(e, i) {
    const s = A.createElement("template");
    return s.innerHTML = e, s;
  }
}
function C(t, e, i = t, s) {
  if (e === E) return e;
  let r = s !== void 0 ? i._$Co?.[s] : i._$Cl;
  const a = N(e) ? void 0 : e._$litDirective$;
  return r?.constructor !== a && (r?._$AO?.(!1), a === void 0 ? r = void 0 : (r = new a(t), r._$AT(t, i, s)), s !== void 0 ? (i._$Co ??= [])[s] = r : i._$Cl = r), r !== void 0 && (e = C(t, r._$AS(t, e.values), r, s)), e;
}
class Ce {
  constructor(e, i) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = i;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: i }, parts: s } = this._$AD, r = (e?.creationScope ?? A).importNode(i, !0);
    x.currentNode = r;
    let a = x.nextNode(), o = 0, c = 0, l = s[0];
    for (; l !== void 0; ) {
      if (o === l.index) {
        let p;
        l.type === 2 ? p = new U(a, a.nextSibling, this, e) : l.type === 1 ? p = new l.ctor(a, l.name, l.strings, this, e) : l.type === 6 && (p = new je(a, this, e)), this._$AV.push(p), l = s[++c];
      }
      o !== l?.index && (a = x.nextNode(), o++);
    }
    return x.currentNode = A, r;
  }
  p(e) {
    let i = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(e, s, i), i += s.strings.length - 2) : s._$AI(e[i])), i++;
  }
}
class U {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, i, s, r) {
    this.type = 2, this._$AH = n, this._$AN = void 0, this._$AA = e, this._$AB = i, this._$AM = s, this.options = r, this._$Cv = r?.isConnected ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const i = this._$AM;
    return i !== void 0 && e?.nodeType === 11 && (e = i.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, i = this) {
    e = C(this, e, i), N(e) ? e === n || e == null || e === "" ? (this._$AH !== n && this._$AR(), this._$AH = n) : e !== this._$AH && e !== E && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : ke(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== n && N(this._$AH) ? this._$AA.nextSibling.data = e : this.T(A.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: i, _$litType$: s } = e, r = typeof s == "number" ? this._$AC(e) : (s.el === void 0 && (s.el = z.createElement(pe(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === r) this._$AH.p(i);
    else {
      const a = new Ce(r, this), o = a.u(this.options);
      a.p(i), this.T(o), this._$AH = a;
    }
  }
  _$AC(e) {
    let i = oe.get(e.strings);
    return i === void 0 && oe.set(e.strings, i = new z(e)), i;
  }
  k(e) {
    Z(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let s, r = 0;
    for (const a of e) r === i.length ? i.push(s = new U(this.O(j()), this.O(j()), this, this.options)) : s = i[r], s._$AI(a), r++;
    r < i.length && (this._$AR(s && s._$AB.nextSibling, r), i.length = r);
  }
  _$AR(e = this._$AA.nextSibling, i) {
    for (this._$AP?.(!1, !0, i); e !== this._$AB; ) {
      const s = ee(e).nextSibling;
      ee(e).remove(), e = s;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class B {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, i, s, r, a) {
    this.type = 1, this._$AH = n, this._$AN = void 0, this.element = e, this.name = i, this._$AM = r, this.options = a, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = n;
  }
  _$AI(e, i = this, s, r) {
    const a = this.strings;
    let o = !1;
    if (a === void 0) e = C(this, e, i, 0), o = !N(e) || e !== this._$AH && e !== E, o && (this._$AH = e);
    else {
      const c = e;
      let l, p;
      for (e = a[0], l = 0; l < a.length - 1; l++) p = C(this, c[s + l], i, l), p === E && (p = this._$AH[l]), o ||= !N(p) || p !== this._$AH[l], p === n ? e = n : e !== n && (e += (p ?? "") + a[l + 1]), this._$AH[l] = p;
    }
    o && !r && this.j(e);
  }
  j(e) {
    e === n ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Pe extends B {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === n ? void 0 : e;
  }
}
class Te extends B {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== n);
  }
}
class Oe extends B {
  constructor(e, i, s, r, a) {
    super(e, i, s, r, a), this.type = 5;
  }
  _$AI(e, i = this) {
    if ((e = C(this, e, i, 0) ?? n) === E) return;
    const s = this._$AH, r = e === n && s !== n || e.capture !== s.capture || e.once !== s.once || e.passive !== s.passive, a = e !== n && (s === n || r);
    r && this.element.removeEventListener(this.name, this, s), a && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class je {
  constructor(e, i, s) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    C(this, e);
  }
}
const Ne = J.litHtmlPolyfillSupport;
Ne?.(z, U), (J.litHtmlVersions ??= []).push("3.3.3");
const ze = (t, e, i) => {
  const s = i?.renderBefore ?? e;
  let r = s._$litPart$;
  if (r === void 0) {
    const a = i?.renderBefore ?? null;
    s._$litPart$ = r = new U(e.insertBefore(j(), a), a, void 0, i ?? {});
  }
  return r._$AI(t), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const K = globalThis;
class S extends k {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const i = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = ze(i, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return E;
  }
}
S._$litElement$ = !0, S.finalized = !0, K.litElementHydrateSupport?.({ LitElement: S });
const Ue = K.litElementPolyfillSupport;
Ue?.({ LitElement: S });
(K.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ue = (t) => (e, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(t, e);
  }) : customElements.define(t, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const De = { attribute: !0, type: String, converter: R, reflect: !1, hasChanged: V }, Me = (t = De, e, i) => {
  const { kind: s, metadata: r } = i;
  let a = globalThis.litPropertyMetadata.get(r);
  if (a === void 0 && globalThis.litPropertyMetadata.set(r, a = /* @__PURE__ */ new Map()), s === "setter" && ((t = Object.create(t)).wrapped = !0), a.set(i.name, t), s === "accessor") {
    const { name: o } = i;
    return { set(c) {
      const l = e.get.call(this);
      e.set.call(this, c), this.requestUpdate(o, l, t, !0, c);
    }, init(c) {
      return c !== void 0 && this.C(o, void 0, t, c), c;
    } };
  }
  if (s === "setter") {
    const { name: o } = i;
    return function(c) {
      const l = this[o];
      e.call(this, c), this.requestUpdate(o, l, t, !0, c);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function P(t) {
  return (e, i) => typeof i == "object" ? Me(t, e, i) : ((s, r, a) => {
    const o = r.hasOwnProperty(a);
    return r.constructor.createProperty(a, s), o ? Object.getOwnPropertyDescriptor(r, a) : void 0;
  })(t, e, i);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function _(t) {
  return P({ ...t, state: !0, attribute: !1 });
}
const H = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], He = () => ({
  name: "Alarm",
  time: "07:00",
  repeat: "weekly",
  weekdays: [0, 1, 2, 3, 4],
  media_player: "",
  source_uri: "",
  source_kind: "music_assistant",
  volume: 0.7,
  fade_seconds: 0,
  snooze_minutes: 9,
  auto_dismiss_minutes: 30,
  enabled: !0,
  notify_targets: [],
  repeat_count: 0,
  resume_previous: !1
});
async function Re() {
  try {
    await (await (await window.loadCardHelpers?.())?.createCardElement({ type: "entities", entities: [] }))?.constructor?.getConfigElement?.();
  } catch {
  }
  return Promise.race([
    customElements.whenDefined("ha-form").then(() => !0),
    new Promise((t) => setTimeout(() => t(!1), 4e3))
  ]);
}
var Le = Object.defineProperty, We = Object.getOwnPropertyDescriptor, y = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? We(e, i) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (r = (s ? o(e, i, r) : o(r)) || r);
  return s && r && Le(e, i, r), r;
};
let f = class extends S {
  constructor() {
    super(...arguments), this.alarms = [], this.haForm = !1, this._users = [], this._policies = {}, this._orphans = {}, this._error = null, this._loaded = !1, this._saveTimers = {};
  }
  connectedCallback() {
    super.connectedCallback(), this._load();
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    for (const t of Object.values(this._saveTimers)) clearTimeout(t);
    this._saveTimers = {};
  }
  async _load() {
    try {
      const [t, e] = await Promise.all([
        this.hass.callWS({ type: "wakey/users/list" }),
        this.hass.callWS({
          type: "wakey/policy/list"
        })
      ]);
      this._users = t.users, this._policies = e.policies, this._loaded = !0;
    } catch (t) {
      this._error = t?.message ?? String(t), this._loaded = !0;
    }
  }
  _allowed(t) {
    return this._policies[t]?.allowed_media_players ?? [];
  }
  // --- speaker permissions -------------------------------------------------
  _policyChanged(t, e) {
    const i = e.detail.value?.allowed_media_players ?? [];
    this._policies = {
      ...this._policies,
      [t.id]: { user_id: t.id, allowed_media_players: i }
    }, clearTimeout(this._saveTimers[t.id]), this._saveTimers[t.id] = window.setTimeout(() => this._savePolicy(t), 600);
  }
  async _savePolicy(t) {
    try {
      const e = await this.hass.callWS({
        type: "wakey/policy/set",
        user_id: t.id,
        allowed_media_players: this._allowed(t.id)
      });
      this._policies = { ...this._policies, [t.id]: e.policy }, this._orphans = { ...this._orphans, [t.id]: e.orphaned_alarms }, this._error = null;
    } catch (e) {
      this._error = e?.message ?? String(e);
    }
  }
  _policySchema() {
    return [
      {
        name: "allowed_media_players",
        selector: {
          entity: { multiple: !0, filter: { domain: "media_player" } }
        }
      }
    ];
  }
  _renderUser(t) {
    const e = this._allowed(t.id), i = this._orphans[t.id] ?? [];
    return d`
      <div class="card">
        <div class="row">
          <div class="grow">
            <div class="name">${t.name || "Unnamed user"}</div>
            <div class="sub">
              ${t.is_admin ? "Administrator — every speaker" : e.length === 0 ? "No speakers yet" : `${e.length} speaker${e.length === 1 ? "" : "s"}`}
            </div>
          </div>
        </div>
        ${t.is_admin ? n : d`
              <div class="form">
                ${this.haForm ? d`<ha-form
                      .hass=${this.hass}
                      .data=${{ allowed_media_players: e }}
                      .schema=${this._policySchema()}
                      .computeLabel=${() => "Allowed speakers"}
                      @value-changed=${(s) => this._policyChanged(t, s)}
                    ></ha-form>` : d`<label>
                      Allowed speakers (comma separated)
                      <input
                        .value=${e.join(", ")}
                        @change=${(s) => this._policyChanged(t, {
      detail: {
        value: {
          allowed_media_players: s.target.value.split(",").map((r) => r.trim()).filter(Boolean)
        }
      }
    })}
                      />
                    </label>`}
              </div>
              ${i.length ? d`<div class="warn">
                    ${i.length} of ${t.name}'s alarms use a speaker they can
                    no longer choose:
                    ${i.map((s) => `${s.name} (${s.media_player})`).join(", ")}.
                    They will still go off — reassign or delete them.
                  </div>` : n}
            `}
      </div>
    `;
  }
  // --- ownership -----------------------------------------------------------
  async _setOwner(t, e) {
    try {
      await this.hass.callWS({
        type: "wakey/set_owner",
        alarm_id: t,
        owner_id: e
      }), this._error = null;
    } catch (i) {
      this._error = i?.message ?? String(i);
    }
  }
  get _unowned() {
    return this.alarms.filter((t) => !t.owner_id);
  }
  async _claimAll() {
    const t = this.hass.user?.id;
    if (t)
      for (const e of this._unowned)
        await this._setOwner(e.id, t);
  }
  _renderOwnership() {
    return this.alarms.length ? d`
      <h2>Who owns what</h2>
      ${this._unowned.length ? d`<div class="notice">
            <div class="grow">
              ${this._unowned.length}
              ${this._unowned.length === 1 ? "alarm has" : "alarms have"} no owner, so
              only administrators can see ${this._unowned.length === 1 ? "it" : "them"}.
            </div>
            <button class="primary" @click=${this._claimAll}>Assign all to me</button>
          </div>` : n}
      ${this.alarms.map(
      (t) => d`
          <div class="card">
            <div class="row">
              <div class="grow">
                <div class="name">${t.time} · ${t.name}</div>
                <div class="sub">${t.media_player || "no player"}</div>
              </div>
              <select
                .value=${t.owner_id ?? ""}
                @change=${(e) => this._setOwner(t.id, e.target.value || null)}
              >
                <option value="">Unassigned</option>
                ${this._users.map(
        (e) => d`<option value=${e.id} ?selected=${e.id === t.owner_id}>
                    ${e.name || e.id}
                  </option>`
      )}
              </select>
            </div>
          </div>
        `
    )}
    ` : n;
  }
  render() {
    return this._loaded ? d`
      ${this._error ? d`<div class="error">${this._error}</div>` : n}
      <h2>Speakers each person may use</h2>
      <p class="sub intro">
        Nobody gets a speaker until you grant it. Administrators always have all of
        them.
      </p>
      ${this._users.map((t) => this._renderUser(t))}
      ${this._renderOwnership()}
    ` : d`<div class="empty">Loading…</div>`;
  }
};
f.styles = le`
    :host {
      display: block;
    }
    h2 {
      font-size: 16px;
      font-weight: 500;
      margin: 24px 0 4px;
    }
    .intro {
      margin: 0 0 12px;
    }
    .card {
      background: var(--card-background-color, #fff);
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: var(--ha-card-box-shadow, 0 2px 4px rgba(0, 0, 0, 0.1));
      padding: 16px;
      margin-bottom: 12px;
    }
    .row {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .grow {
      flex: 1;
      min-width: 0;
    }
    .name {
      font-weight: 500;
    }
    .sub {
      color: var(--secondary-text-color, #727272);
      font-size: 13px;
    }
    .form {
      margin-top: 8px;
    }
    .warn {
      margin-top: 10px;
      font-size: 13px;
      color: var(--warning-color, #ffa600);
    }
    .notice {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 16px;
      margin-bottom: 12px;
      border-radius: var(--ha-card-border-radius, 12px);
      background: var(--secondary-background-color, #e0e0e0);
    }
    select,
    input {
      font: inherit;
      padding: 8px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 6px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
    }
    input {
      display: block;
      width: 100%;
      box-sizing: border-box;
      margin-top: 4px;
    }
    label {
      display: block;
      font-size: 13px;
      color: var(--secondary-text-color, #727272);
    }
    button {
      font: inherit;
      font-size: 14px;
      padding: 8px 14px;
      border-radius: 8px;
      border: 1px solid var(--divider-color, #e0e0e0);
      background: transparent;
      color: var(--primary-color, #03a9f4);
      cursor: pointer;
      white-space: nowrap;
    }
    button.primary {
      background: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
      border-color: transparent;
    }
    .empty,
    .error {
      padding: 32px 16px;
      text-align: center;
      color: var(--secondary-text-color, #727272);
    }
    .error {
      color: var(--error-color, #db4437);
    }
  `;
y([
  P({ attribute: !1 })
], f.prototype, "hass", 2);
y([
  P({ attribute: !1 })
], f.prototype, "alarms", 2);
y([
  P({ attribute: !1 })
], f.prototype, "haForm", 2);
y([
  _()
], f.prototype, "_users", 2);
y([
  _()
], f.prototype, "_policies", 2);
y([
  _()
], f.prototype, "_orphans", 2);
y([
  _()
], f.prototype, "_error", 2);
y([
  _()
], f.prototype, "_loaded", 2);
f = y([
  ue("wakey-admin")
], f);
var Be = Object.defineProperty, Ie = Object.getOwnPropertyDescriptor, g = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? Ie(e, i) : e, a = t.length - 1, o; a >= 0; a--)
    (o = t[a]) && (r = (s ? o(e, i, r) : o(r)) || r);
  return s && r && Be(e, i, r), r;
};
const qe = H.map((t, e) => ({ value: String(e), label: t }));
let u = class extends S {
  constructor() {
    super(...arguments), this.narrow = !1, this._alarms = [], this._isAdmin = !1, this._allowedPlayers = null, this._view = "alarms", this._loaded = !1, this._error = null, this._dialogOpen = !1, this._editing = null, this._draft = {}, this._adjusting = null, this._adjustTime = "", this._haForm = !1, this._testingAlarm = null, this._subscribed = !1, this._label = (t) => ({
      name: "Name",
      time: "Time",
      repeat: "Repeat",
      weekdays: "Days",
      date: "Date",
      media_player: "Play on",
      media: "Browse for a track",
      source_uri: "Source (URI or search text)",
      volume: "Volume",
      fade_seconds: "Fade in",
      snooze_minutes: "Snooze length",
      auto_dismiss_minutes: "Auto dismiss after",
      pre_alarm_minutes: "Pre-alarm lead time",
      pre_alarm_script: "Pre-alarm script",
      notify_targets: "Notify on ring",
      repeat_count: "Playback repeats (0 = continuous)",
      resume_previous: "Resume previous playback",
      advanced: "Advanced"
    })[t.name] ?? t.name;
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._unsub?.(), this._unsub = void 0, this._subscribed = !1;
  }
  updated(t) {
    t.has("hass") && this.hass && !this._subscribed && (this._subscribed = !0, this._subscribe(), Re().then((e) => this._haForm = e));
  }
  async _subscribe() {
    try {
      this._unsub = await this.hass.connection.subscribeMessage(
        (t) => {
          this._alarms = t.alarms ?? [], this._isAdmin = t.is_admin === !0, this._allowedPlayers = t.allowed_media_players ?? null, this._loaded = !0, this._error = null;
        },
        { type: "wakey/subscribe" }
      );
    } catch (t) {
      this._error = t?.message ?? String(t), this._loaded = !0;
    }
  }
  /**
   * Whether this user has anywhere to point a new alarm.
   *
   * Speakers are deny-by-default, so a household member who has not been
   * granted any cannot usefully create anything yet — and an Add button that
   * always fails is worse than no Add button.
   */
  get _canCreate() {
    return this._allowedPlayers === null || this._allowedPlayers.length > 0;
  }
  // --- actions -----------------------------------------------------------
  async _call(t) {
    try {
      return await this.hass.callWS(t), !0;
    } catch (e) {
      return this._error = e?.message ?? String(e), !1;
    }
  }
  _toggle(t) {
    this._call({ type: "wakey/update", alarm_id: t.id, enabled: !t.enabled });
  }
  _skip(t) {
    this._call({ type: "wakey/skip_next", alarm_id: t.id, skip: !t.skip_next });
  }
  /**
   * Whether a one-time adjustment is still ahead of us.
   *
   * The backend clears a spent adjustment on its next scheduling pass, which
   * can be a while after the day itself has gone. Checking the date here
   * keeps a dead one off the card in the meantime.
   */
  _adjusted(t) {
    return !t.override_for || !t.override_time ? !1 : t.override_for >= (/* @__PURE__ */ new Date()).toLocaleDateString("en-CA");
  }
  _openAdjust(t) {
    this._adjusting = t.id, this._adjustTime = t.override_time ?? t.time;
  }
  async _saveAdjust() {
    const t = this._adjusting;
    if (!t || !this._adjustTime) return;
    await this._call({
      type: "wakey/adjust_next",
      alarm_id: t,
      time: this._adjustTime.slice(0, 5)
    }) && (this._adjusting = null);
  }
  async _clearAdjust(t) {
    await this._call({ type: "wakey/adjust_next", alarm_id: t.id, clear: !0 }) && (this._adjusting = null);
  }
  _delete(t) {
    confirm(`Delete "${t.name}"?`) && this._call({ type: "wakey/delete", alarm_id: t.id });
  }
  _trigger(t) {
    this._testingAlarm = t, this._call({ type: "wakey/trigger", alarm_id: t.id });
  }
  _stopTest() {
    this._call({ type: "wakey/dismiss" }), this._testingAlarm = null;
  }
  // --- dialog ------------------------------------------------------------
  _openNew() {
    this._editing = null, this._draft = { ...He(), weekdays: ["0", "1", "2", "3", "4"] }, this._dialogOpen = !0;
  }
  _openEdit(t) {
    this._editing = t.id, this._draft = {
      ...t,
      weekdays: (t.weekdays ?? []).map(String),
      media: t.media_player ? { entity_id: t.media_player } : void 0
    }, this._dialogOpen = !0;
  }
  _closeDialog() {
    this._dialogOpen = !1, this._editing = null;
  }
  _formChanged(t) {
    const e = { ...t.detail.value };
    e.media_player && e.media?.entity_id !== e.media_player && (e.media = { ...e.media ?? {}, entity_id: e.media_player }), e.media?.media_content_id && e.media.media_content_id !== this._draft.media?.media_content_id && (e.source_uri = e.media.media_content_id), this._draft = e;
  }
  async _save() {
    const t = this._draft;
    if (!t.time || !t.media_player || !t.source_uri) {
      this._error = "Name, time, media player and source are all required.";
      return;
    }
    const e = {
      name: t.name || "Alarm",
      time: String(t.time).slice(0, 5),
      repeat: t.repeat ?? "weekly",
      weekdays: (t.weekdays ?? []).map((i) => Number(i)),
      date: t.date ?? null,
      media_player: t.media_player,
      source_uri: t.source_uri,
      source_kind: t.source_kind ?? "music_assistant",
      volume: Number(t.volume ?? 0.7),
      fade_seconds: Number(t.fade_seconds ?? 0),
      resume_previous: !!(t.resume_previous ?? !1),
      snooze_minutes: Number(t.snooze_minutes ?? 9),
      auto_dismiss_minutes: Number(t.auto_dismiss_minutes ?? 30),
      pre_alarm_minutes: Number(t.pre_alarm_minutes ?? 0),
      pre_alarm_script: t.pre_alarm_script || null,
      notify_targets: t.notify_targets ?? [],
      repeat_count: Number(t.repeat_count ?? 0)
    };
    this._editing ? await this._call({ type: "wakey/update", alarm_id: this._editing, ...e }) : await this._call({ type: "wakey/create", ...e, enabled: t.enabled ?? !0 }), this._closeDialog();
  }
  _schema() {
    const t = this._draft.repeat ?? "weekly";
    return [
      { name: "name", required: !0, selector: { text: {} } },
      { name: "time", required: !0, selector: { time: {} } },
      {
        name: "repeat",
        required: !0,
        selector: {
          select: {
            mode: "dropdown",
            options: [
              { value: "weekly", label: "Weekly" },
              { value: "once", label: "Once" }
            ]
          }
        }
      },
      ...t === "weekly" ? [{ name: "weekdays", selector: { select: { multiple: !0, options: qe } } }] : [{ name: "date", selector: { date: {} } }],
      {
        name: "media_player",
        required: !0,
        selector: {
          entity: {
            filter: { domain: "media_player" },
            // Omitted for admins, who are unrestricted. For everyone else
            // this is the whole point: the picker only offers the speakers
            // they were granted, so the refusal never has to happen.
            ...this._allowedPlayers ? { include_entities: this._allowedPlayers } : {}
          }
        }
      },
      { name: "media", selector: { media: {} } },
      { name: "source_uri", required: !0, selector: { text: {} } },
      {
        type: "grid",
        schema: [
          { name: "volume", selector: { number: { min: 0, max: 1, step: 0.05, mode: "slider" } } },
          {
            name: "fade_seconds",
            selector: { number: { min: 0, max: 900, step: 15, mode: "box", unit_of_measurement: "s" } }
          }
        ]
      },
      {
        type: "expandable",
        // Deliberately unnamed: a named expandable makes ha-form nest its
        // fields under draft.advanced, while everything here reads and saves
        // them flat — the section would render empty and wipe on save.
        title: "Advanced",
        schema: [
          {
            name: "repeat_count",
            selector: { number: { min: 0, max: 100, mode: "box" } }
          },
          {
            name: "snooze_minutes",
            selector: { number: { min: 1, max: 120, mode: "box", unit_of_measurement: "min" } }
          },
          {
            name: "auto_dismiss_minutes",
            selector: { number: { min: 1, max: 240, mode: "box", unit_of_measurement: "min" } }
          },
          {
            name: "pre_alarm_minutes",
            selector: { number: { min: 0, max: 240, mode: "box", unit_of_measurement: "min" } }
          },
          {
            name: "pre_alarm_script",
            selector: { entity: { filter: { domain: "script" } } }
          },
          {
            name: "notify_targets",
            selector: { entity: { multiple: !0, filter: { domain: "notify" } } }
          },
          { name: "resume_previous", selector: { boolean: {} } }
        ]
      }
    ];
  }
  // --- render ------------------------------------------------------------
  _fmtNext(t) {
    if (!t.enabled) return "Off";
    if (!t.next_fire) return "Never";
    const e = new Date(t.next_fire), i = Math.round((e.getTime() - Date.now()) / 6e4);
    if (i < 60) return `in ${Math.max(1, i)} min`;
    const s = Math.floor(i / 60);
    return s < 24 ? `in ${s}h ${i % 60}m` : e.toLocaleDateString(void 0, { weekday: "long" });
  }
  _fmtAdjusted(t) {
    const e = (/* @__PURE__ */ new Date()).toLocaleDateString("en-CA");
    return t.override_for === e ? `Today at ${t.override_time}` : `${(/* @__PURE__ */ new Date(`${t.override_for}T00:00:00`)).toLocaleDateString(void 0, { weekday: "long" })} at ${t.override_time}`;
  }
  _renderAdjustDialog() {
    const t = this._alarms.find((e) => e.id === this._adjusting);
    return t ? d`
      <div class="scrim" @click=${() => this._adjusting = null}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        <h2>Adjust next</h2>
        <p class="hint">
          Just this once. ${t.name} rings at the new time, then goes back to
          ${t.time} on its own.
        </p>
        <label>
          Time
          <input
            type="time"
            .value=${this._adjustTime}
            @input=${(e) => this._adjustTime = e.target.value}
          />
        </label>
        <div class="dialog-actions">
          ${this._adjusted(t) ? d`<button @click=${() => this._clearAdjust(t)}>
                Back to ${t.time}
              </button>` : n}
          <button @click=${() => this._adjusting = null}>Cancel</button>
          <button class="primary" @click=${this._saveAdjust}>Save</button>
        </div>
      </div>
    ` : n;
  }
  _renderAlarm(t) {
    const e = t.repeat === "once" ? t.date ?? "Once" : t.weekdays.length === 7 ? "Every day" : t.weekdays.length === 0 ? "No days selected" : t.weekdays.map((i) => H[i]).join(" ");
    return d`
      <div class="card ${t.enabled ? "" : "dim"}">
        <div class="row">
          <div class="time">${t.time}</div>
          <div class="grow">
            <div class="name">${t.name}</div>
            <div class="sub">${e}</div>
            <div class="sub">${t.media_player || "no player"}</div>
          </div>
          <div class="right">
            ${this._haForm ? d`<ha-switch
                  .checked=${t.enabled}
                  @change=${() => this._toggle(t)}
                ></ha-switch>` : d`<input
                  type="checkbox"
                  .checked=${t.enabled}
                  @change=${() => this._toggle(t)}
                />`}
            <div class="next">${this._fmtNext(t)}</div>
          </div>
        </div>
        ${t.is_ringing || t.is_snoozed || t.skip_next || this._adjusted(t) ? d`<div class="flags">
              ${t.is_ringing ? d`<span class="flag ring">Ringing</span>` : n}
              ${t.is_snoozed ? d`<span class="flag">Snoozed</span>` : n}
              ${t.skip_next ? d`<span class="flag">Skipping next</span>` : n}
              ${this._adjusted(t) ? d`<span class="flag">${this._fmtAdjusted(t)}</span>` : n}
            </div>` : n}
        ${d`<div class="actions">
              <button @click=${() => this._openEdit(t)}>Edit</button>
              <button @click=${() => this._skip(t)}>
                ${t.skip_next ? "Don't skip" : "Skip next"}
              </button>
              <button @click=${() => this._openAdjust(t)}>Adjust next</button>
              <button @click=${() => this._trigger(t)}>Test</button>
              <button class="danger" @click=${() => this._delete(t)}>Delete</button>
            </div>`}
      </div>
    `;
  }
  _renderRinging() {
    const t = this._alarms.filter((e) => e.is_ringing || e.is_snoozed);
    return t.length ? d`
      <div class="banner">
        <div class="grow">
          <strong>${t.map((e) => e.name).join(", ")}</strong>
          <div class="sub">${t[0].is_snoozed ? "Snoozed" : "Ringing now"}</div>
        </div>
        <button @click=${() => this._call({ type: "wakey/snooze" })}>Snooze</button>
        <button @click=${() => this._call({ type: "wakey/dismiss" })}>Dismiss</button>
      </div>
    ` : n;
  }
  _renderDialog() {
    if (!this._dialogOpen) return n;
    const t = this._draft.time ? String(this._draft.time).slice(0, 5) : "07:00", e = this._draft.name || "Alarma", i = this._draft.repeat === "once" ? this._draft.date || "Una vez" : this._draft.weekdays?.length === 7 ? "Todos los días" : this._draft.weekdays?.length ? this._draft.weekdays.map((s) => H[Number(s)]).join(" ") : "L M X J V";
    return d`
      <div class="scrim" @click=${this._closeDialog}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        <h2>${this._editing ? "Editar alarma" : "Nueva alarma"}</h2>

        <div class="live-alarm-preview">
          <div class="preview-header">
            <div class="preview-icon"><ha-icon icon="mdi:alarm"></ha-icon></div>
            <div class="preview-title">${e}</div>
            <span class="preview-badge ${this._editing ? "edit" : "new"}">${this._editing ? "EDITANDO" : "NUEVA"}</span>
          </div>
          <div class="preview-time">${t}</div>
          <div class="preview-sub">${i}</div>
          ${this._draft.media_player ? d`<div class="preview-speaker"><ha-icon icon="mdi:speaker"></ha-icon> ${String(this._draft.media_player).replace("media_player.", "").replace(/_/g, " ")}</div>` : n}
        </div>

        ${this._haForm ? d`<ha-form
              .hass=${this.hass}
              .data=${this._draft}
              .schema=${this._schema()}
              .computeLabel=${this._label}
              @value-changed=${this._formChanged}
            ></ha-form>` : d`
              <p class="warn">
                Home Assistant's form components did not load, so this is a reduced editor.
              </p>
              <label>Name<input .value=${this._draft.name ?? ""} @input=${(s) => this._draft = { ...this._draft, name: s.target.value }} /></label>
              <label>Time<input type="time" .value=${this._draft.time ?? "07:00"} @input=${(s) => this._draft = { ...this._draft, time: s.target.value }} /></label>
              <label>Media player<input .value=${this._draft.media_player ?? ""} @input=${(s) => this._draft = { ...this._draft, media_player: s.target.value }} /></label>
              <label>Source<input .value=${this._draft.source_uri ?? ""} @input=${(s) => this._draft = { ...this._draft, source_uri: s.target.value }} /></label>
            `}
        <div class="dialog-actions">
          <button @click=${this._closeDialog}>Cancel</button>
          <button class="primary" @click=${this._save}>Save</button>
        </div>
      </div>
    `;
  }
  _renderTestModal() {
    if (!this._testingAlarm) return n;
    const t = this._testingAlarm, e = t.repeat === "once" ? t.date ?? "Una vez" : t.weekdays.length === 7 ? "Todos los días" : t.weekdays.length === 0 ? "Sin días" : t.weekdays.map((i) => H[i]).join(" ");
    return d`
      <div class="scrim" @click=${() => this._stopTest()}></div>
      <div class="dialog test-dialog" role="dialog" aria-modal="true">
        <div class="live-alarm-preview test-mode">
          <div class="preview-header">
            <div class="preview-icon pulsing"><ha-icon icon="mdi:bell-ring"></ha-icon></div>
            <div class="preview-title">${t.name || "Alarma"}</div>
            <span class="preview-badge test">SONANDO</span>
          </div>
          <div class="preview-time">${t.time}</div>
          <div class="preview-sub">${e}</div>
          <div class="preview-speaker">
            <ha-icon icon="mdi:speaker"></ha-icon> ${String(t.media_player || "Altavoz").replace("media_player.", "").replace(/_/g, " ")}
          </div>
        </div>
        <div class="dialog-actions test-actions">
          <button class="primary danger-btn" @click=${() => this._stopTest()}>
            <ha-icon icon="mdi:stop" style="--mdc-icon-size: 18px; margin-right: 4px; vertical-align: -2px;"></ha-icon>
            Detener sonido
          </button>
          <button @click=${() => this._testingAlarm = null}>Cerrar ventana</button>
        </div>
      </div>
    `;
  }
  _renderEmpty() {
    return this._canCreate ? d`<div class="empty">No alarms yet. Use Add alarm to create one.</div>` : d`<div class="empty">
        An administrator has not given you access to any speakers yet, so there is
        nowhere for an alarm to play.
      </div>`;
  }
  _renderAlarms() {
    return this._loaded ? this._alarms.length === 0 ? this._renderEmpty() : this._alarms.map((t) => this._renderAlarm(t)) : d`<div class="empty">Loading…</div>`;
  }
  render() {
    const t = this._view === "admin";
    return d`
      <div class="header">
        <h1>Wakey</h1>
        ${this._isAdmin ? d`<div class="tabs">
              <button
                class=${t ? "" : "selected"}
                @click=${() => this._view = "alarms"}
              >
                Alarms
              </button>
              <button
                class=${t ? "selected" : ""}
                @click=${() => this._view = "admin"}
              >
                People
              </button>
            </div>` : n}
        ${!t && this._canCreate ? d`<button class="primary" @click=${this._openNew}>Add alarm</button>` : n}
      </div>

      <div class="body">
        ${this._error ? d`<div class="error">${this._error}</div>` : n}
        ${t ? d`<wakey-admin
              .hass=${this.hass}
              .alarms=${this._alarms}
              .haForm=${this._haForm}
            ></wakey-admin>` : d`${this._renderRinging()} ${this._renderAlarms()}`}
      </div>

      ${this._renderDialog()}
      ${this._adjusting ? this._renderAdjustDialog() : n}
      ${this._testingAlarm ? this._renderTestModal() : n}
    `;
  }
};
u.styles = le`
    :host {
      display: block;
      min-height: 100vh;
      background: var(--primary-background-color, #f5f5f5);
      color: var(--primary-text-color, #212121);
      font-family: var(--paper-font-body1_-_font-family, inherit);
    }
    .header {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 20px;
      background: var(--app-header-background-color, var(--primary-color, #03a9f4));
      color: var(--app-header-text-color, #fff);
    }
    .header h1 {
      margin: 0;
      font-size: 20px;
      font-weight: 400;
      flex: 1;
    }
    .body {
      padding: 16px;
      max-width: 720px;
      margin: 0 auto;
      padding-bottom: calc(24px + var(--safe-area-inset-bottom, 0px));
    }
    .card {
      background: var(--card-background-color, #fff);
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: var(--ha-card-box-shadow, 0 2px 4px rgba(0, 0, 0, 0.1));
      padding: 16px;
      margin-bottom: 12px;
    }
    .card.dim {
      opacity: 0.55;
    }
    .row {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .grow {
      flex: 1;
      min-width: 0;
    }
    .time {
      font-size: clamp(2rem, 9vw, 2.75rem);
      font-variant-numeric: tabular-nums;
      line-height: 1;
      font-weight: 300;
    }
    .name {
      font-weight: 500;
    }
    .sub {
      color: var(--secondary-text-color, #727272);
      font-size: 13px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .right {
      text-align: right;
    }
    .next {
      font-size: 12px;
      color: var(--secondary-text-color, #727272);
      margin-top: 4px;
    }
    .flags {
      margin-top: 10px;
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }
    .flag {
      font-size: 12px;
      padding: 2px 8px;
      border-radius: 10px;
      background: var(--secondary-background-color, #e0e0e0);
    }
    .flag.ring {
      background: var(--error-color, #db4437);
      color: #fff;
    }
    .actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-top: 12px;
      border-top: 1px solid var(--divider-color, #e0e0e0);
      padding-top: 12px;
    }
    button {
      font: inherit;
      font-size: 14px;
      padding: 8px 14px;
      border-radius: 8px;
      border: 1px solid var(--divider-color, #e0e0e0);
      background: transparent;
      color: var(--primary-color, #03a9f4);
      cursor: pointer;
    }
    button.primary {
      background: var(--primary-color, #03a9f4);
      color: var(--text-primary-color, #fff);
      border-color: transparent;
    }
    button.danger {
      color: var(--error-color, #db4437);
    }
    .tabs {
      display: flex;
      gap: 4px;
    }
    .tabs button {
      color: inherit;
      border-color: transparent;
      opacity: 0.75;
    }
    .tabs button.selected {
      opacity: 1;
      border-bottom: 2px solid currentColor;
      border-radius: 8px 8px 0 0;
    }
    .banner {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 16px;
      margin-bottom: 12px;
      border-radius: var(--ha-card-border-radius, 12px);
      background: var(--error-color, #db4437);
      color: #fff;
    }
    .banner button {
      color: #fff;
      border-color: rgba(255, 255, 255, 0.6);
    }
    .banner .sub {
      color: rgba(255, 255, 255, 0.85);
    }
    .empty,
    .error {
      padding: 32px 16px;
      text-align: center;
      color: var(--secondary-text-color, #727272);
    }
    .error {
      color: var(--error-color, #db4437);
    }
    .scrim {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.45);
      z-index: 10;
    }
    .dialog {
      position: fixed;
      z-index: 11;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: min(560px, calc(100vw - 32px));
      max-height: calc(100vh - 64px);
      overflow: auto;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
      border-radius: var(--ha-card-border-radius, 12px);
      padding: 20px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }
    .dialog .hint {
      margin: -8px 0 16px;
      font-size: 13px;
      line-height: 1.4;
      color: var(--secondary-text-color, #727272);
    }
    .dialog h2 {
      margin: 0 0 16px;
      font-size: 18px;
      font-weight: 500;
    }
    .dialog label {
      display: block;
      margin-bottom: 12px;
      font-size: 13px;
      color: var(--secondary-text-color, #727272);
    }
    .dialog input {
      display: block;
      width: 100%;
      box-sizing: border-box;
      margin-top: 4px;
      padding: 8px;
      font: inherit;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 6px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
    }
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 20px;
    }
    .warn {
      color: var(--warning-color, #ffa600);
      font-size: 13px;
    }
    .live-alarm-preview {
      background: var(--secondary-background-color, rgba(127, 127, 127, 0.08));
      border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.15));
      border-radius: 16px;
      padding: 16px 20px;
      margin-bottom: 20px;
      font-family: var(--ha-font-family, "Google Sans", Roboto, sans-serif);
      color: var(--primary-text-color, #e8eaed);
    }
    .live-alarm-preview.test-mode {
      border-color: rgba(219, 68, 55, 0.4);
      background: rgba(219, 68, 55, 0.06);
    }
    .preview-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 6px;
    }
    .preview-icon {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--divider-color, rgba(127, 127, 127, 0.15));
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--primary-color, #03a9f4);
      flex-shrink: 0;
    }
    .preview-title {
      font-size: 18px;
      font-weight: 500;
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .preview-badge {
      font-size: 11px;
      font-weight: 600;
      padding: 3px 8px;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .preview-badge.new {
      background: rgba(76, 175, 80, 0.15);
      color: #4caf50;
    }
    .preview-badge.edit {
      background: rgba(3, 169, 244, 0.15);
      color: var(--primary-color, #03a9f4);
    }
    .preview-badge.test {
      background: rgba(219, 68, 55, 0.2);
      color: var(--error-color, #db4437);
    }
    .preview-time {
      font-size: clamp(2.5rem, 8vw, 3.25rem);
      font-weight: 500;
      line-height: 1.1;
      letter-spacing: -0.02em;
      font-variant-numeric: tabular-nums;
      margin: 4px 0 2px 0;
    }
    .preview-sub {
      font-size: 16px;
      color: var(--secondary-text-color, #9e9e9e);
      margin-top: 2px;
    }
    .preview-speaker {
      font-size: 13px;
      color: var(--secondary-text-color, #9e9e9e);
      margin-top: 6px;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .preview-speaker ha-icon {
      --mdc-icon-size: 15px;
    }
    .danger-btn {
      background: var(--error-color, #db4437) !important;
      color: #fff !important;
      border-color: transparent !important;
    }
    @keyframes wakey-pulse {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.08); opacity: 0.75; }
      100% { transform: scale(1); opacity: 1; }
    }
    .pulsing {
      animation: wakey-pulse 1.4s ease-in-out infinite;
      color: var(--error-color, #db4437) !important;
    }
  `;
g([
  P({ attribute: !1 })
], u.prototype, "hass", 2);
g([
  P({ attribute: !1 })
], u.prototype, "narrow", 2);
g([
  _()
], u.prototype, "_alarms", 2);
g([
  _()
], u.prototype, "_isAdmin", 2);
g([
  _()
], u.prototype, "_allowedPlayers", 2);
g([
  _()
], u.prototype, "_view", 2);
g([
  _()
], u.prototype, "_loaded", 2);
g([
  _()
], u.prototype, "_error", 2);
g([
  _()
], u.prototype, "_dialogOpen", 2);
g([
  _()
], u.prototype, "_editing", 2);
g([
  _()
], u.prototype, "_draft", 2);
g([
  _()
], u.prototype, "_adjusting", 2);
g([
  _()
], u.prototype, "_adjustTime", 2);
g([
  _()
], u.prototype, "_haForm", 2);
g([
  _()
], u.prototype, "_testingAlarm", 2);
u = g([
  ue("wakey-panel")
], u);
