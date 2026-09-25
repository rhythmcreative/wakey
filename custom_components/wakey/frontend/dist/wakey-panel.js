/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const D = globalThis, W = D.ShadowRoot && (D.ShadyCSS === void 0 || D.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, F = Symbol(), J = /* @__PURE__ */ new WeakMap();
let oe = class {
  constructor(e, t, i) {
    if (this._$cssResult$ = !0, i !== F) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (W && e === void 0) {
      const i = t !== void 0 && t.length === 1;
      i && (e = J.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), i && J.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const ue = (r) => new oe(typeof r == "string" ? r : r + "", void 0, F), ne = (r, ...e) => {
  const t = r.length === 1 ? r[0] : e.reduce((i, s, a) => i + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + r[a + 1], r[0]);
  return new oe(t, r, F);
}, _e = (r, e) => {
  if (W) r.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const i = document.createElement("style"), s = D.litNonce;
    s !== void 0 && i.setAttribute("nonce", s), i.textContent = t.cssText, r.appendChild(i);
  }
}, Y = W ? (r) => r : (r) => r instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const i of e.cssRules) t += i.cssText;
  return ue(t);
})(r) : r;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: me, defineProperty: fe, getOwnPropertyDescriptor: ge, getOwnPropertyNames: ye, getOwnPropertySymbols: ve, getPrototypeOf: be } = Object, R = globalThis, K = R.trustedTypes, $e = K ? K.emptyScript : "", xe = R.reactiveElementPolyfillSupport, j = (r, e) => r, H = { toAttribute(r, e) {
  switch (e) {
    case Boolean:
      r = r ? $e : null;
      break;
    case Object:
    case Array:
      r = r == null ? r : JSON.stringify(r);
  }
  return r;
}, fromAttribute(r, e) {
  let t = r;
  switch (e) {
    case Boolean:
      t = r !== null;
      break;
    case Number:
      t = r === null ? null : Number(r);
      break;
    case Object:
    case Array:
      try {
        t = JSON.parse(r);
      } catch {
        t = null;
      }
  }
  return t;
} }, I = (r, e) => !me(r, e), Q = { attribute: !0, type: String, converter: H, reflect: !1, useDefault: !1, hasChanged: I };
Symbol.metadata ??= Symbol("metadata"), R.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let k = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = Q) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const i = Symbol(), s = this.getPropertyDescriptor(e, i, t);
      s !== void 0 && fe(this.prototype, e, s);
    }
  }
  static getPropertyDescriptor(e, t, i) {
    const { get: s, set: a } = ge(this.prototype, e) ?? { get() {
      return this[t];
    }, set(o) {
      this[t] = o;
    } };
    return { get: s, set(o) {
      const c = s?.call(this);
      a?.call(this, o), this.requestUpdate(e, c, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? Q;
  }
  static _$Ei() {
    if (this.hasOwnProperty(j("elementProperties"))) return;
    const e = be(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(j("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(j("properties"))) {
      const t = this.properties, i = [...ye(t), ...ve(t)];
      for (const s of i) this.createProperty(s, t[s]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [i, s] of t) this.elementProperties.set(i, s);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, i] of this.elementProperties) {
      const s = this._$Eu(t, i);
      s !== void 0 && this._$Eh.set(s, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const i = new Set(e.flat(1 / 0).reverse());
      for (const s of i) t.unshift(Y(s));
    } else e !== void 0 && t.push(Y(e));
    return t;
  }
  static _$Eu(e, t) {
    const i = t.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof e == "string" ? e.toLowerCase() : void 0;
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
    const e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
    for (const i of t.keys()) this.hasOwnProperty(i) && (e.set(i, this[i]), delete this[i]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return _e(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((e) => e.hostDisconnected?.());
  }
  attributeChangedCallback(e, t, i) {
    this._$AK(e, i);
  }
  _$ET(e, t) {
    const i = this.constructor.elementProperties.get(e), s = this.constructor._$Eu(e, i);
    if (s !== void 0 && i.reflect === !0) {
      const a = (i.converter?.toAttribute !== void 0 ? i.converter : H).toAttribute(t, i.type);
      this._$Em = e, a == null ? this.removeAttribute(s) : this.setAttribute(s, a), this._$Em = null;
    }
  }
  _$AK(e, t) {
    const i = this.constructor, s = i._$Eh.get(e);
    if (s !== void 0 && this._$Em !== s) {
      const a = i.getPropertyOptions(s), o = typeof a.converter == "function" ? { fromAttribute: a.converter } : a.converter?.fromAttribute !== void 0 ? a.converter : H;
      this._$Em = s;
      const c = o.fromAttribute(t, a.type);
      this[s] = c ?? this._$Ej?.get(s) ?? c, this._$Em = null;
    }
  }
  requestUpdate(e, t, i, s = !1, a) {
    if (e !== void 0) {
      const o = this.constructor;
      if (s === !1 && (a = this[e]), i ??= o.getPropertyOptions(e), !((i.hasChanged ?? I)(a, t) || i.useDefault && i.reflect && a === this._$Ej?.get(e) && !this.hasAttribute(o._$Eu(e, i)))) return;
      this.C(e, t, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: i, reflect: s, wrapped: a }, o) {
    i && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, o ?? t ?? this[e]), a !== !0 || o !== void 0) || (this._$AL.has(e) || (this.hasUpdated || i || (t = void 0), this._$AL.set(e, t)), s === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (t) {
      Promise.reject(t);
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
        for (const [s, a] of this._$Ep) this[s] = a;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [s, a] of i) {
        const { wrapped: o } = a, c = this[s];
        o !== !0 || this._$AL.has(s) || c === void 0 || this.C(s, void 0, a, c);
      }
    }
    let e = !1;
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), this._$EO?.forEach((i) => i.hostUpdate?.()), this.update(t)) : this._$EM();
    } catch (i) {
      throw e = !1, this._$EM(), i;
    }
    e && this._$AE(t);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    this._$EO?.forEach((t) => t.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
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
    this._$Eq &&= this._$Eq.forEach((t) => this._$ET(t, this[t])), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
k.elementStyles = [], k.shadowRootOptions = { mode: "open" }, k[j("elementProperties")] = /* @__PURE__ */ new Map(), k[j("finalized")] = /* @__PURE__ */ new Map(), xe?.({ ReactiveElement: k }), (R.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const q = globalThis, X = (r) => r, L = q.trustedTypes, ee = L ? L.createPolicy("lit-html", { createHTML: (r) => r }) : void 0, le = "$lit$", b = `lit$${Math.random().toFixed(9).slice(2)}$`, de = "?" + b, we = `<${de}>`, A = document, z = () => A.createComment(""), O = (r) => r === null || typeof r != "object" && typeof r != "function", Z = Array.isArray, Ae = (r) => Z(r) || typeof r?.[Symbol.iterator] == "function", V = `[ 	
\f\r]`, T = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, te = /-->/g, ie = />/g, x = RegExp(`>|${V}(?:([^\\s"'>=/]+)(${V}*=${V}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), se = /'/g, re = /"/g, ce = /^(?:script|style|textarea|title)$/i, ke = (r) => (e, ...t) => ({ _$litType$: r, strings: e, values: t }), d = ke(1), E = Symbol.for("lit-noChange"), n = Symbol.for("lit-nothing"), ae = /* @__PURE__ */ new WeakMap(), w = A.createTreeWalker(A, 129);
function he(r, e) {
  if (!Z(r) || !r.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ee !== void 0 ? ee.createHTML(e) : e;
}
const Se = (r, e) => {
  const t = r.length - 1, i = [];
  let s, a = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", o = T;
  for (let c = 0; c < t; c++) {
    const l = r[c];
    let p, _, h = -1, g = 0;
    for (; g < l.length && (o.lastIndex = g, _ = o.exec(l), _ !== null); ) g = o.lastIndex, o === T ? _[1] === "!--" ? o = te : _[1] !== void 0 ? o = ie : _[2] !== void 0 ? (ce.test(_[2]) && (s = RegExp("</" + _[2], "g")), o = x) : _[3] !== void 0 && (o = x) : o === x ? _[0] === ">" ? (o = s ?? T, h = -1) : _[1] === void 0 ? h = -2 : (h = o.lastIndex - _[2].length, p = _[1], o = _[3] === void 0 ? x : _[3] === '"' ? re : se) : o === re || o === se ? o = x : o === te || o === ie ? o = T : (o = x, s = void 0);
    const v = o === x && r[c + 1].startsWith("/>") ? " " : "";
    a += o === T ? l + we : h >= 0 ? (i.push(p), l.slice(0, h) + le + l.slice(h) + b + v) : l + b + (h === -2 ? c : v);
  }
  return [he(r, a + (r[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), i];
};
class N {
  constructor({ strings: e, _$litType$: t }, i) {
    let s;
    this.parts = [];
    let a = 0, o = 0;
    const c = e.length - 1, l = this.parts, [p, _] = Se(e, t);
    if (this.el = N.createElement(p, i), w.currentNode = this.el.content, t === 2 || t === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (s = w.nextNode()) !== null && l.length < c; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const h of s.getAttributeNames()) if (h.endsWith(le)) {
          const g = _[o++], v = s.getAttribute(h).split(b), U = /([.?@])?(.*)/.exec(g);
          l.push({ type: 1, index: a, name: U[2], strings: v, ctor: U[1] === "." ? Ce : U[1] === "?" ? Pe : U[1] === "@" ? Te : B }), s.removeAttribute(h);
        } else h.startsWith(b) && (l.push({ type: 6, index: a }), s.removeAttribute(h));
        if (ce.test(s.tagName)) {
          const h = s.textContent.split(b), g = h.length - 1;
          if (g > 0) {
            s.textContent = L ? L.emptyScript : "";
            for (let v = 0; v < g; v++) s.append(h[v], z()), w.nextNode(), l.push({ type: 2, index: ++a });
            s.append(h[g], z());
          }
        }
      } else if (s.nodeType === 8) if (s.data === de) l.push({ type: 2, index: a });
      else {
        let h = -1;
        for (; (h = s.data.indexOf(b, h + 1)) !== -1; ) l.push({ type: 7, index: a }), h += b.length - 1;
      }
      a++;
    }
  }
  static createElement(e, t) {
    const i = A.createElement("template");
    return i.innerHTML = e, i;
  }
}
function C(r, e, t = r, i) {
  if (e === E) return e;
  let s = i !== void 0 ? t._$Co?.[i] : t._$Cl;
  const a = O(e) ? void 0 : e._$litDirective$;
  return s?.constructor !== a && (s?._$AO?.(!1), a === void 0 ? s = void 0 : (s = new a(r), s._$AT(r, t, i)), i !== void 0 ? (t._$Co ??= [])[i] = s : t._$Cl = s), s !== void 0 && (e = C(r, s._$AS(r, e.values), s, i)), e;
}
class Ee {
  constructor(e, t) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: t }, parts: i } = this._$AD, s = (e?.creationScope ?? A).importNode(t, !0);
    w.currentNode = s;
    let a = w.nextNode(), o = 0, c = 0, l = i[0];
    for (; l !== void 0; ) {
      if (o === l.index) {
        let p;
        l.type === 2 ? p = new M(a, a.nextSibling, this, e) : l.type === 1 ? p = new l.ctor(a, l.name, l.strings, this, e) : l.type === 6 && (p = new je(a, this, e)), this._$AV.push(p), l = i[++c];
      }
      o !== l?.index && (a = w.nextNode(), o++);
    }
    return w.currentNode = A, s;
  }
  p(e) {
    let t = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(e, i, t), t += i.strings.length - 2) : i._$AI(e[t])), t++;
  }
}
class M {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, t, i, s) {
    this.type = 2, this._$AH = n, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = i, this.options = s, this._$Cv = s?.isConnected ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const t = this._$AM;
    return t !== void 0 && e?.nodeType === 11 && (e = t.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, t = this) {
    e = C(this, e, t), O(e) ? e === n || e == null || e === "" ? (this._$AH !== n && this._$AR(), this._$AH = n) : e !== this._$AH && e !== E && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Ae(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== n && O(this._$AH) ? this._$AA.nextSibling.data = e : this.T(A.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: t, _$litType$: i } = e, s = typeof i == "number" ? this._$AC(e) : (i.el === void 0 && (i.el = N.createElement(he(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === s) this._$AH.p(t);
    else {
      const a = new Ee(s, this), o = a.u(this.options);
      a.p(t), this.T(o), this._$AH = a;
    }
  }
  _$AC(e) {
    let t = ae.get(e.strings);
    return t === void 0 && ae.set(e.strings, t = new N(e)), t;
  }
  k(e) {
    Z(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let i, s = 0;
    for (const a of e) s === t.length ? t.push(i = new M(this.O(z()), this.O(z()), this, this.options)) : i = t[s], i._$AI(a), s++;
    s < t.length && (this._$AR(i && i._$AB.nextSibling, s), t.length = s);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    for (this._$AP?.(!1, !0, t); e !== this._$AB; ) {
      const i = X(e).nextSibling;
      X(e).remove(), e = i;
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
  constructor(e, t, i, s, a) {
    this.type = 1, this._$AH = n, this._$AN = void 0, this.element = e, this.name = t, this._$AM = s, this.options = a, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = n;
  }
  _$AI(e, t = this, i, s) {
    const a = this.strings;
    let o = !1;
    if (a === void 0) e = C(this, e, t, 0), o = !O(e) || e !== this._$AH && e !== E, o && (this._$AH = e);
    else {
      const c = e;
      let l, p;
      for (e = a[0], l = 0; l < a.length - 1; l++) p = C(this, c[i + l], t, l), p === E && (p = this._$AH[l]), o ||= !O(p) || p !== this._$AH[l], p === n ? e = n : e !== n && (e += (p ?? "") + a[l + 1]), this._$AH[l] = p;
    }
    o && !s && this.j(e);
  }
  j(e) {
    e === n ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Ce extends B {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === n ? void 0 : e;
  }
}
class Pe extends B {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== n);
  }
}
class Te extends B {
  constructor(e, t, i, s, a) {
    super(e, t, i, s, a), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = C(this, e, t, 0) ?? n) === E) return;
    const i = this._$AH, s = e === n && i !== n || e.capture !== i.capture || e.once !== i.once || e.passive !== i.passive, a = e !== n && (i === n || s);
    s && this.element.removeEventListener(this.name, this, i), a && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class je {
  constructor(e, t, i) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    C(this, e);
  }
}
const ze = q.litHtmlPolyfillSupport;
ze?.(N, M), (q.litHtmlVersions ??= []).push("3.3.3");
const Oe = (r, e, t) => {
  const i = t?.renderBefore ?? e;
  let s = i._$litPart$;
  if (s === void 0) {
    const a = t?.renderBefore ?? null;
    i._$litPart$ = s = new M(e.insertBefore(z(), a), a, void 0, t ?? {});
  }
  return s._$AI(r), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const G = globalThis;
class S extends k {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Oe(t, this.renderRoot, this.renderOptions);
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
S._$litElement$ = !0, S.finalized = !0, G.litElementHydrateSupport?.({ LitElement: S });
const Ne = G.litElementPolyfillSupport;
Ne?.({ LitElement: S });
(G.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Me = { attribute: !0, type: String, converter: H, reflect: !1, hasChanged: I }, Ue = (r = Me, e, t) => {
  const { kind: i, metadata: s } = t;
  let a = globalThis.litPropertyMetadata.get(s);
  if (a === void 0 && globalThis.litPropertyMetadata.set(s, a = /* @__PURE__ */ new Map()), i === "setter" && ((r = Object.create(r)).wrapped = !0), a.set(t.name, r), i === "accessor") {
    const { name: o } = t;
    return { set(c) {
      const l = e.get.call(this);
      e.set.call(this, c), this.requestUpdate(o, l, r, !0, c);
    }, init(c) {
      return c !== void 0 && this.C(o, void 0, r, c), c;
    } };
  }
  if (i === "setter") {
    const { name: o } = t;
    return function(c) {
      const l = this[o];
      e.call(this, c), this.requestUpdate(o, l, r, !0, c);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function P(r) {
  return (e, t) => typeof t == "object" ? Ue(r, e, t) : ((i, s, a) => {
    const o = s.hasOwnProperty(a);
    return s.constructor.createProperty(a, i), o ? Object.getOwnPropertyDescriptor(s, a) : void 0;
  })(r, e, t);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function u(r) {
  return P({ ...r, state: !0, attribute: !1 });
}
const pe = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], De = () => ({
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
async function He() {
  try {
    await (await (await window.loadCardHelpers?.())?.createCardElement({ type: "entities", entities: [] }))?.constructor?.getConfigElement?.();
  } catch {
  }
  return Promise.race([
    customElements.whenDefined("ha-form").then(() => !0),
    new Promise((r) => setTimeout(() => r(!1), 4e3))
  ]);
}
var Le = Object.defineProperty, $ = (r, e, t, i) => {
  for (var s = void 0, a = r.length - 1, o; a >= 0; a--)
    (o = r[a]) && (s = o(e, t, s) || s);
  return s && Le(e, t, s), s;
};
class y extends S {
  constructor() {
    super(...arguments), this.alarms = [], this.haForm = !1, this._users = [], this._policies = {}, this._orphans = {}, this._error = null, this._loaded = !1, this._saveTimers = {};
  }
  connectedCallback() {
    super.connectedCallback(), this._load();
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    for (const e of Object.values(this._saveTimers)) clearTimeout(e);
    this._saveTimers = {};
  }
  async _load() {
    try {
      const [e, t] = await Promise.all([
        this.hass.callWS({ type: "wakey/users/list" }),
        this.hass.callWS({
          type: "wakey/policy/list"
        })
      ]);
      this._users = e.users, this._policies = t.policies, this._loaded = !0;
    } catch (e) {
      this._error = e?.message ?? String(e), this._loaded = !0;
    }
  }
  _allowed(e) {
    return this._policies[e]?.allowed_media_players ?? [];
  }
  // --- speaker permissions -------------------------------------------------
  _policyChanged(e, t) {
    const i = t.detail.value?.allowed_media_players ?? [];
    this._policies = {
      ...this._policies,
      [e.id]: { user_id: e.id, allowed_media_players: i }
    }, clearTimeout(this._saveTimers[e.id]), this._saveTimers[e.id] = window.setTimeout(() => this._savePolicy(e), 600);
  }
  async _savePolicy(e) {
    try {
      const t = await this.hass.callWS({
        type: "wakey/policy/set",
        user_id: e.id,
        allowed_media_players: this._allowed(e.id)
      });
      this._policies = { ...this._policies, [e.id]: t.policy }, this._orphans = { ...this._orphans, [e.id]: t.orphaned_alarms }, this._error = null;
    } catch (t) {
      this._error = t?.message ?? String(t);
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
  _renderUser(e) {
    const t = this._allowed(e.id), i = this._orphans[e.id] ?? [];
    return d`
      <div class="card">
        <div class="row">
          <div class="grow">
            <div class="name">${e.name || "Unnamed user"}</div>
            <div class="sub">
              ${e.is_admin ? "Administrator — every speaker" : t.length === 0 ? "No speakers yet" : `${t.length} speaker${t.length === 1 ? "" : "s"}`}
            </div>
          </div>
        </div>
        ${e.is_admin ? n : d`
              <div class="form">
                ${this.haForm ? d`<ha-form
                      .hass=${this.hass}
                      .data=${{ allowed_media_players: t }}
                      .schema=${this._policySchema()}
                      .computeLabel=${() => "Allowed speakers"}
                      @value-changed=${(s) => this._policyChanged(e, s)}
                    ></ha-form>` : d`<label>
                      Allowed speakers (comma separated)
                      <input
                        .value=${t.join(", ")}
                        @change=${(s) => this._policyChanged(e, {
      detail: {
        value: {
          allowed_media_players: s.target.value.split(",").map((a) => a.trim()).filter(Boolean)
        }
      }
    })}
                      />
                    </label>`}
              </div>
              ${i.length ? d`<div class="warn">
                    ${i.length} of ${e.name}'s alarms use a speaker they can
                    no longer choose:
                    ${i.map((s) => `${s.name} (${s.media_player})`).join(", ")}.
                    They will still go off — reassign or delete them.
                  </div>` : n}
            `}
      </div>
    `;
  }
  // --- ownership -----------------------------------------------------------
  async _setOwner(e, t) {
    try {
      await this.hass.callWS({
        type: "wakey/set_owner",
        alarm_id: e,
        owner_id: t
      }), this._error = null;
    } catch (i) {
      this._error = i?.message ?? String(i);
    }
  }
  get _unowned() {
    return this.alarms.filter((e) => !e.owner_id);
  }
  async _claimAll() {
    const e = this.hass.user?.id;
    if (e)
      for (const t of this._unowned)
        await this._setOwner(t.id, e);
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
      (e) => d`
          <div class="card">
            <div class="row">
              <div class="grow">
                <div class="name">${e.time} · ${e.name}</div>
                <div class="sub">${e.media_player || "no player"}</div>
              </div>
              <select
                .value=${e.owner_id ?? ""}
                @change=${(t) => this._setOwner(e.id, t.target.value || null)}
              >
                <option value="">Unassigned</option>
                ${this._users.map(
        (t) => d`<option value=${t.id} ?selected=${t.id === e.owner_id}>
                    ${t.name || t.id}
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
      ${this._users.map((e) => this._renderUser(e))}
      ${this._renderOwnership()}
    ` : d`<div class="empty">Loading…</div>`;
  }
  static {
    this.styles = ne`
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
  }
}
$([
  P({ attribute: !1 })
], y.prototype, "hass");
$([
  P({ attribute: !1 })
], y.prototype, "alarms");
$([
  P({ attribute: !1 })
], y.prototype, "haForm");
$([
  u()
], y.prototype, "_users");
$([
  u()
], y.prototype, "_policies");
$([
  u()
], y.prototype, "_orphans");
$([
  u()
], y.prototype, "_error");
$([
  u()
], y.prototype, "_loaded");
customElements.get("wakey-admin") || customElements.define("wakey-admin", y);
var Re = Object.defineProperty, f = (r, e, t, i) => {
  for (var s = void 0, a = r.length - 1, o; a >= 0; a--)
    (o = r[a]) && (s = o(e, t, s) || s);
  return s && Re(e, t, s), s;
};
const Be = pe.map((r, e) => ({ value: String(e), label: r }));
class m extends S {
  constructor() {
    super(...arguments), this.narrow = !1, this._alarms = [], this._isAdmin = !1, this._allowedPlayers = null, this._view = "alarms", this._loaded = !1, this._error = null, this._dialogOpen = !1, this._editing = null, this._draft = {}, this._adjusting = null, this._adjustTime = "", this._haForm = !1, this._testingAlarm = null, this._subscribed = !1, this._closeDialog = () => {
      this._dialogOpen = !1, this._editing = null;
    }, this._formChanged = (e) => {
      this._draft = { ...this._draft, ...e.detail.value };
    }, this._label = (e) => ({
      name: "Name",
      time: "Time",
      repeat: "Repeat",
      weekdays: "Days of week",
      date: "Date",
      media_player: "Speaker",
      source_uri: "Audio URL or media-source URI",
      target_volume: "Target volume",
      volume_fade_duration_s: "Volume fade duration",
      pre_alarm_duration_m: "Pre-alarm duration (lights / smart home)",
      snooze_duration_m: "Snooze duration",
      auto_dismiss_m: "Auto-dismiss after"
    })[e.name] ?? e.name;
  }
  connectedCallback() {
    if (super.connectedCallback(), !document.getElementById("wakey-google-sans-font")) {
      const e = document.createElement("link");
      e.id = "wakey-google-sans-font", e.rel = "stylesheet", e.href = "https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&display=swap", document.head.appendChild(e);
    }
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._unsub?.(), this._unsub = void 0, this._subscribed = !1;
  }
  updated(e) {
    e.has("hass") && this.hass && !this._subscribed && (this._subscribed = !0, this._subscribe(), He().then((t) => this._haForm = t));
  }
  async _subscribe() {
    try {
      this._unsub = await this.hass.connection.subscribeMessage(
        (e) => {
          this._alarms = e.alarms ?? [], this._isAdmin = e.is_admin === !0, this._allowedPlayers = e.allowed_media_players ?? null, this._loaded = !0, this._error = null;
        },
        { type: "wakey/subscribe" }
      );
    } catch (e) {
      this._error = e?.message ?? String(e), this._loaded = !0;
    }
  }
  get _canCreate() {
    return this._allowedPlayers === null || this._allowedPlayers.length > 0;
  }
  // --- actions -----------------------------------------------------------
  async _call(e) {
    try {
      return await this.hass.callWS(e), !0;
    } catch (t) {
      return this._error = t?.message ?? String(t), !1;
    }
  }
  _toggle(e) {
    this._call({ type: "wakey/update", alarm_id: e.id, enabled: !e.enabled });
  }
  _skip(e) {
    this._call({ type: "wakey/skip_next", alarm_id: e.id, skip: !e.skip_next });
  }
  _adjusted(e) {
    return !e.override_for || !e.override_time ? !1 : e.override_for >= (/* @__PURE__ */ new Date()).toLocaleDateString("en-CA");
  }
  _openAdjust(e) {
    this._adjusting = e.id, this._adjustTime = e.override_time ?? e.time;
  }
  async _saveAdjust() {
    const e = this._adjusting;
    if (!e || !this._adjustTime) return;
    await this._call({
      type: "wakey/adjust_next",
      alarm_id: e,
      time: this._adjustTime.slice(0, 5)
    }) && (this._adjusting = null);
  }
  async _clearAdjust(e) {
    await this._call({ type: "wakey/adjust_next", alarm_id: e.id, clear: !0 }) && (this._adjusting = null);
  }
  _delete(e) {
    confirm(`Delete "${e.name}"?`) && this._call({ type: "wakey/delete", alarm_id: e.id });
  }
  _trigger(e) {
    this._testingAlarm = e, this._call({ type: "wakey/trigger", alarm_id: e.id });
  }
  _stopTest() {
    this._call({ type: "wakey/dismiss" }), this._testingAlarm = null;
  }
  // --- dialog ------------------------------------------------------------
  _openNew() {
    this._editing = null, this._draft = { ...De(), weekdays: ["0", "1", "2", "3", "4"] }, this._dialogOpen = !0;
  }
  _openEdit(e) {
    this._editing = e.id, this._draft = {
      name: e.name,
      time: e.time,
      repeat: e.repeat,
      weekdays: e.weekdays.map(String),
      date: e.date ?? "",
      media_player: e.media_player ?? "",
      source_uri: e.source_uri ?? "",
      pre_alarm_duration_m: e.pre_alarm_duration_m,
      volume_fade_duration_s: e.volume_fade_duration_s,
      target_volume: e.target_volume,
      snooze_duration_m: e.snooze_duration_m,
      auto_dismiss_m: e.auto_dismiss_m
    }, this._dialogOpen = !0;
  }
  async _save() {
    const e = this._draft, t = !!this._editing, i = {
      type: t ? "wakey/update" : "wakey/create",
      name: (e.name ?? "").trim(),
      time: (e.time ?? "07:00").slice(0, 5),
      repeat: e.repeat ?? "daily",
      weekdays: (e.weekdays ?? []).map(Number).sort(),
      date: e.repeat === "once" && e.date || null,
      media_player: e.media_player || null,
      source_uri: e.source_uri || null,
      pre_alarm_duration_m: Number(e.pre_alarm_duration_m ?? 0),
      volume_fade_duration_s: Number(e.volume_fade_duration_s ?? 0),
      target_volume: e.target_volume != null ? Number(e.target_volume) : null,
      snooze_duration_m: Number(e.snooze_duration_m ?? 9),
      auto_dismiss_m: Number(e.auto_dismiss_m ?? 30)
    };
    t && (i.alarm_id = this._editing), await this._call(i) && this._closeDialog();
  }
  // --- schema ------------------------------------------------------------
  _schema() {
    const e = this._draft.repeat === "once", t = this._draft.repeat === "never", i = !e && !t, s = (this._allowedPlayers ?? []).map((a) => ({
      value: a,
      label: this.hass.states[a]?.attributes.friendly_name ?? a
    }));
    return [
      { name: "name", selector: { text: {} } },
      { name: "time", selector: { time: {} } },
      {
        name: "repeat",
        selector: {
          select: {
            options: [
              { value: "daily", label: "Selected days" },
              { value: "once", label: "Specific date (once)" },
              { value: "never", label: "Single ring (auto-delete)" }
            ],
            mode: "dropdown"
          }
        }
      },
      ...i ? [
        {
          name: "weekdays",
          selector: {
            select: {
              multiple: !0,
              mode: "list",
              options: Be
            }
          }
        }
      ] : [],
      ...e ? [{ name: "date", selector: { date: {} } }] : [],
      {
        name: "media_player",
        selector: {
          select: {
            options: s,
            mode: "dropdown"
          }
        }
      },
      { name: "source_uri", selector: { text: {} } },
      {
        name: "target_volume",
        selector: {
          number: {
            min: 0,
            max: 1,
            step: 0.05,
            mode: "slider"
          }
        }
      },
      {
        name: "volume_fade_duration_s",
        selector: {
          number: {
            min: 0,
            max: 300,
            step: 5,
            mode: "box",
            unit_of_measurement: "s"
          }
        }
      },
      {
        name: "pre_alarm_duration_m",
        selector: {
          number: {
            min: 0,
            max: 60,
            step: 1,
            mode: "box",
            unit_of_measurement: "min"
          }
        }
      },
      {
        name: "snooze_duration_m",
        selector: {
          number: {
            min: 1,
            max: 30,
            step: 1,
            mode: "box",
            unit_of_measurement: "min"
          }
        }
      },
      {
        name: "auto_dismiss_m",
        selector: {
          number: {
            min: 5,
            max: 120,
            step: 5,
            mode: "box",
            unit_of_measurement: "min"
          }
        }
      }
    ];
  }
  // --- formatting --------------------------------------------------------
  _formatAlarmDays(e) {
    if (e.repeat === "once") return e.date ?? "Una vez";
    if (e.repeat === "never") return e.date ? `${e.date} (Nunca)` : "Una vez";
    const t = (e.weekdays || []).map(Number).sort((s, a) => s - a);
    if (t.length === 5 && t.every((s, a) => s === a)) return "Lunes a Viernes";
    if (t.length === 2 && t[0] === 5 && t[1] === 6) return "Fines de semana";
    if (t.length === 7) return "Todos los días";
    if (t.length === 0) return "Sin días";
    const i = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
    return t.map((s) => i[s]).join(" a ");
  }
  _formatSpeaker(e) {
    return e ? e.replace("media_player.", "").replace(/_/g, " ").replace(/\b\w/g, (t) => t.toUpperCase()).trim() : "";
  }
  _fmtNext(e) {
    return e.enabled ? e.skip_next ? "Next occurrence skipped" : e.next_occurrence ? `Next: ${new Date(e.next_occurrence).toLocaleDateString(void 0, {
      weekday: "short",
      month: "short",
      day: "numeric"
    })} ${e.time}` : "Not scheduled" : "Disabled";
  }
  _fmtAdjusted(e) {
    return !e.override_for || !e.override_time ? "" : `One-time: ${(/* @__PURE__ */ new Date(e.override_for + "T00:00:00")).toLocaleDateString(void 0, { weekday: "short", month: "short", day: "numeric" })} at ${e.override_time}`;
  }
  // --- render helpers ----------------------------------------------------
  _renderRinging() {
    const e = this._alarms.filter((t) => t.is_ringing || t.is_snoozed);
    return e.length === 0 ? n : d`
      <div class="banner">
        <div class="grow">
          <div>${e.map((t) => t.name).join(", ")}</div>
          <div class="sub">
            ${e.some((t) => t.is_ringing) ? "Alarm ringing" : "Alarm snoozed"}
          </div>
        </div>
        <button @click=${() => this._call({ type: "wakey/snooze" })}>Snooze</button>
        <button @click=${() => this._call({ type: "wakey/dismiss" })}>Dismiss</button>
      </div>
    `;
  }
  _renderDialog() {
    return this._dialogOpen ? d`
      <div class="scrim" @click=${this._closeDialog}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        <h2>${this._editing ? "Edit alarm" : "New alarm"}</h2>

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
              <label>Name<input .value=${this._draft.name ?? ""} @input=${(e) => this._draft = { ...this._draft, name: e.target.value }} /></label>
              <label>Time<input type="time" .value=${this._draft.time ?? "07:00"} @input=${(e) => this._draft = { ...this._draft, time: e.target.value }} /></label>
              <label>Media player<input .value=${this._draft.media_player ?? ""} @input=${(e) => this._draft = { ...this._draft, media_player: e.target.value }} /></label>
              <label>Source<input .value=${this._draft.source_uri ?? ""} @input=${(e) => this._draft = { ...this._draft, source_uri: e.target.value }} /></label>
            `}
        <div class="dialog-actions">
          <button @click=${this._closeDialog}>Cancel</button>
          <button class="primary" @click=${this._save}>Save</button>
        </div>
      </div>
    ` : n;
  }
  _renderAdjustDialog() {
    const e = this._alarms.find((t) => t.id === this._adjusting);
    return e ? d`
      <div class="scrim" @click=${() => this._adjusting = null}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        <h2>Adjust next occurrence: ${e.name}</h2>
        <p>Change the time for the next scheduled occurrence without editing the recurring schedule.</p>
        <label>
          New time
          <input
            type="time"
            .value=${this._adjustTime}
            @input=${(t) => this._adjustTime = t.target.value}
          />
        </label>
        <div class="dialog-actions">
          ${this._adjusted(e) ? d`<button @click=${() => this._clearAdjust(e)}>
                Back to ${e.time}
              </button>` : n}
          <button @click=${() => this._adjusting = null}>Cancel</button>
          <button class="primary" @click=${this._saveAdjust}>Save</button>
        </div>
      </div>
    ` : n;
  }
  _renderTestModal() {
    if (!this._testingAlarm) return n;
    const e = this._testingAlarm, t = this._formatAlarmDays(e), i = this._formatSpeaker(e.media_player);
    return d`
      <div class="test-overlay" @click=${() => this._stopTest()}></div>
      <div class="test-stage" role="dialog" aria-modal="true">
        <!-- 1:1 pixel match of assets/alarm.png -->
        <div class="official-alarm-card">
          <!-- Top Row: Circle icon + Title on left, Badge on right -->
          <div class="official-alarm-header">
            <div class="official-title-wrap">
              <div class="official-alarm-icon">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <path d="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L16.2,17.2L17,15.9L12.5,13.2V8M22,5.7L17.7,2.2L16.4,3.8L20.7,7.3L22,5.7M6.3,3.8L5,2.2L0.7,5.7L2,7.3L6.3,3.8Z"/>
                </svg>
              </div>
              <span class="official-alarm-name">${e.name || "Despertador"}</span>
            </div>
            <span class="official-alarm-badge">SONANDO</span>
          </div>

          <!-- Center: Massive Time in Google Sans -->
          <div class="official-alarm-time">
            ${e.time}
          </div>

          <!-- Recurrence Text: Lunes a Viernes -->
          <div class="official-alarm-days">
            ${t}
          </div>

          <!-- Speaker Row: Altavoz: Salón -->
          ${i ? d`
                <div class="official-alarm-speaker">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                    <path d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z"/>
                  </svg>
                  <span>Altavoz: ${i}</span>
                </div>
              ` : n}
        </div>

        <!-- Floating action buttons below the card -->
        <div class="official-test-actions">
          <button class="official-btn-stop" @click=${() => this._stopTest()}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M6,6H18V18H6V6Z"/>
            </svg>
            Detener sonido
          </button>
          <button class="official-btn-close" @click=${() => this._testingAlarm = null}>
            Cerrar
          </button>
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
    return this._loaded ? this._alarms.length === 0 ? this._renderEmpty() : this._alarms.map((e) => this._renderAlarm(e)) : d`<div class="empty">Loading…</div>`;
  }
  _renderAlarm(e) {
    const t = e.repeat === "once" ? e.date ?? "Once" : e.repeat === "never" ? e.date ? `${e.date} (Never)` : "Never (auto-delete)" : e.weekdays.length === 7 ? "Every day" : e.weekdays.length === 0 ? "No days selected" : e.weekdays.map((i) => pe[i]).join(" ");
    return d`
      <div class="card ${e.enabled ? "" : "dim"}">
        <div class="row">
          <div class="time">${e.time}</div>
          <div class="grow">
            <div class="name">${e.name}</div>
            <div class="sub">${t}</div>
            <div class="sub">${e.media_player || "no player"}</div>
          </div>
          <div class="right">
            ${this._haForm ? d`<ha-switch
                  .checked=${e.enabled}
                  @change=${() => this._toggle(e)}
                ></ha-switch>` : d`<input
                  type="checkbox"
                  .checked=${e.enabled}
                  @change=${() => this._toggle(e)}
                />`}
            <div class="next">${this._fmtNext(e)}</div>
          </div>
        </div>
        ${e.is_ringing || e.is_snoozed || e.skip_next || this._adjusted(e) ? d`<div class="flags">
              ${e.is_ringing ? d`<span class="flag ring">Ringing</span>` : n}
              ${e.is_snoozed ? d`<span class="flag">Snoozed</span>` : n}
              ${e.skip_next ? d`<span class="flag">Skipping next</span>` : n}
              ${this._adjusted(e) ? d`<span class="flag">${this._fmtAdjusted(e)}</span>` : n}
            </div>` : n}
        <div class="actions">
          <button @click=${() => this._openEdit(e)}>Edit</button>
          <button @click=${() => this._skip(e)}>
            ${e.skip_next ? "Don't skip" : "Skip next"}
          </button>
          <button @click=${() => this._openAdjust(e)}>Adjust next</button>
          <button class="btn-test" @click=${() => this._trigger(e)}>
            <ha-icon icon="mdi:play" style="--mdc-icon-size: 16px; margin-right: 4px; vertical-align: -2px;"></ha-icon>
            Test
          </button>
          <button class="danger" @click=${() => this._delete(e)}>Delete</button>
        </div>
      </div>
    `;
  }
  render() {
    const e = this._view === "admin";
    return d`
      <div class="header">
        <h1>Wakey</h1>
        ${this._isAdmin ? d`<div class="tabs">
              <button
                class=${e ? "" : "selected"}
                @click=${() => this._view = "alarms"}
              >
                Alarms
              </button>
              <button
                class=${e ? "selected" : ""}
                @click=${() => this._view = "admin"}
              >
                People
              </button>
            </div>` : n}
        ${!e && this._canCreate ? d`<button class="primary" @click=${this._openNew}>Add alarm</button>` : n}
      </div>

      <div class="body">
        ${this._error ? d`<div class="error">${this._error}</div>` : n}
        ${e ? d`<wakey-admin
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
  static {
    this.styles = ne`
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
      transition: opacity 120ms ease;
    }
    .card.dim {
      opacity: 0.55;
    }
    .row {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .time {
      font-size: 36px;
      font-weight: 300;
      letter-spacing: -0.5px;
      min-width: 100px;
    }
    .grow {
      flex: 1;
      min-width: 0;
    }
    .name {
      font-size: 16px;
      font-weight: 500;
    }
    .sub {
      font-size: 13px;
      color: var(--secondary-text-color, #757575);
      margin-top: 2px;
    }
    .right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 4px;
    }
    .next {
      font-size: 11px;
      color: var(--secondary-text-color, #757575);
    }
    .flags {
      display: flex;
      gap: 6px;
      margin-top: 8px;
      flex-wrap: wrap;
    }
    .flag {
      font-size: 11px;
      font-weight: 500;
      padding: 2px 8px;
      border-radius: 9999px;
      background: var(--secondary-background-color, #e0e0e0);
      color: var(--primary-text-color, #212121);
    }
    .flag.ring {
      background: var(--error-color, #db4437);
      color: #fff;
    }
    .actions {
      display: flex;
      gap: 8px;
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid var(--divider-color, #e0e0e0);
      flex-wrap: wrap;
    }
    button {
      background: transparent;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 8px;
      padding: 6px 12px;
      font-size: 13px;
      cursor: pointer;
      color: inherit;
    }
    button.primary {
      background: var(--primary-color, #03a9f4);
      color: #fff;
      border-color: transparent;
    }
    button.danger {
      color: var(--error-color, #db4437);
      border-color: transparent;
    }
    button.btn-test {
      color: var(--primary-color, #03a9f4);
      border-color: rgba(3, 169, 244, 0.35);
    }
    .scrim {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 99;
    }
    .dialog {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: var(--card-background-color, #fff);
      border-radius: var(--ha-card-border-radius, 16px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
      padding: 20px;
      width: min(480px, calc(100vw - 32px));
      max-height: 85vh;
      overflow-y: auto;
      z-index: 100;
    }
    .dialog h2 {
      margin-top: 0;
    }
    .dialog label {
      display: block;
      margin-top: 12px;
      font-size: 13px;
    }
    .dialog input {
      width: 100%;
      box-sizing: border-box;
      padding: 8px;
      margin-top: 4px;
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
    .empty {
      text-align: center;
      padding: 48px 16px;
      color: var(--secondary-text-color, #757575);
    }
    .error {
      background: var(--error-color, #db4437);
      color: #fff;
      padding: 8px 12px;
      border-radius: 8px;
      margin-bottom: 12px;
      font-size: 13px;
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

    /* Official Alarm Test Modal (1:1 with assets/alarm.png) */
    .test-overlay {
      position: fixed;
      inset: 0;
      background: rgba(14, 15, 17, 0.85);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      z-index: 1000;
      animation: official-fade-in 200ms ease;
    }
    .test-stage {
      position: fixed;
      z-index: 1001;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: min(520px, calc(100vw - 32px));
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      animation: official-scale-in 240ms cubic-bezier(0.16, 1, 0.3, 1);
    }
    .official-alarm-card {
      width: 100%;
      background-color: #282a2d;
      border-radius: 28px;
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.65), 0 2px 10px rgba(0, 0, 0, 0.3);
      box-sizing: border-box;
      padding: 38px 42px 34px 42px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      user-select: none;
      -webkit-user-select: none;
      font-family: 'Google Sans', Roboto, -apple-system, BlinkMacSystemFont, sans-serif;
    }
    .official-alarm-header {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .official-title-wrap {
      display: flex;
      align-items: center;
      gap: 14px;
      min-width: 0;
    }
    .official-alarm-icon {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      flex-shrink: 0;
    }
    .official-alarm-name {
      font-size: 24px;
      font-weight: 400;
      color: #ffffff;
      letter-spacing: -0.01em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .official-alarm-badge {
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.06em;
      padding: 6px 18px;
      border-radius: 20px;
      text-transform: uppercase;
      background: #c3e8cd;
      color: #137333;
      flex-shrink: 0;
    }
    .official-alarm-time {
      font-size: 96px;
      font-weight: 400;
      line-height: 1;
      font-variant-numeric: tabular-nums;
      font-feature-settings: 'tnum' 1;
      margin: 36px 0 16px 0;
      letter-spacing: -2px;
      color: #f7f6f2;
    }
    .official-alarm-days {
      font-size: 24px;
      font-weight: 400;
      color: #e8eaed;
      margin-bottom: 12px;
      letter-spacing: -0.01em;
    }
    .official-alarm-speaker {
      font-size: 19px;
      font-weight: 400;
      color: #dadce0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    .official-test-actions {
      display: flex;
      align-items: center;
      gap: 12px;
      justify-content: center;
      width: 100%;
    }
    .official-btn-stop {
      background: #d93025;
      color: #ffffff;
      border: none;
      border-radius: 9999px;
      padding: 12px 24px;
      font-size: 15px;
      font-weight: 500;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(217, 48, 37, 0.4);
      transition: background 0.15s ease, transform 0.15s ease;
    }
    .official-btn-stop:hover {
      background: #b3261e;
      transform: translateY(-1px);
    }
    .official-btn-close {
      background: rgba(255, 255, 255, 0.12);
      color: #ffffff;
      border: none;
      border-radius: 9999px;
      padding: 12px 24px;
      font-size: 15px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.15s ease;
    }
    .official-btn-close:hover {
      background: rgba(255, 255, 255, 0.2);
    }
    @keyframes official-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes official-scale-in {
      from { opacity: 0; transform: translate(-50%, -46%) scale(0.96); }
      to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    }
  `;
  }
}
f([
  P({ attribute: !1 })
], m.prototype, "hass");
f([
  P({ attribute: !1 })
], m.prototype, "narrow");
f([
  u()
], m.prototype, "_alarms");
f([
  u()
], m.prototype, "_isAdmin");
f([
  u()
], m.prototype, "_allowedPlayers");
f([
  u()
], m.prototype, "_view");
f([
  u()
], m.prototype, "_loaded");
f([
  u()
], m.prototype, "_error");
f([
  u()
], m.prototype, "_dialogOpen");
f([
  u()
], m.prototype, "_editing");
f([
  u()
], m.prototype, "_draft");
f([
  u()
], m.prototype, "_adjusting");
f([
  u()
], m.prototype, "_adjustTime");
f([
  u()
], m.prototype, "_haForm");
f([
  u()
], m.prototype, "_testingAlarm");
customElements.define("wakey-panel", m);
