/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const M = globalThis, q = M.ShadowRoot && (M.ShadyCSS === void 0 || M.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, F = Symbol(), Y = /* @__PURE__ */ new WeakMap();
let ne = class {
  constructor(e, t, i) {
    if (this._$cssResult$ = !0, i !== F) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (q && e === void 0) {
      const i = t !== void 0 && t.length === 1;
      i && (e = Y.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), i && Y.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const ue = (r) => new ne(typeof r == "string" ? r : r + "", void 0, F), le = (r, ...e) => {
  const t = r.length === 1 ? r[0] : e.reduce((i, s, a) => i + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + r[a + 1], r[0]);
  return new ne(t, r, F);
}, _e = (r, e) => {
  if (q) r.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const i = document.createElement("style"), s = M.litNonce;
    s !== void 0 && i.setAttribute("nonce", s), i.textContent = t.cssText, r.appendChild(i);
  }
}, G = q ? (r) => r : (r) => r instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const i of e.cssRules) t += i.cssText;
  return ue(t);
})(r) : r;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: me, defineProperty: ge, getOwnPropertyDescriptor: fe, getOwnPropertyNames: ve, getOwnPropertySymbols: ye, getPrototypeOf: $e } = Object, W = globalThis, X = W.trustedTypes, be = X ? X.emptyScript : "", we = W.reactiveElementPolyfillSupport, j = (r, e) => r, R = { toAttribute(r, e) {
  switch (e) {
    case Boolean:
      r = r ? be : null;
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
} }, V = (r, e) => !me(r, e), Q = { attribute: !0, type: String, converter: R, reflect: !1, useDefault: !1, hasChanged: V };
Symbol.metadata ??= Symbol("metadata"), W.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
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
      s !== void 0 && ge(this.prototype, e, s);
    }
  }
  static getPropertyDescriptor(e, t, i) {
    const { get: s, set: a } = fe(this.prototype, e) ?? { get() {
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
    const e = $e(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(j("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(j("properties"))) {
      const t = this.properties, i = [...ve(t), ...ye(t)];
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
      for (const s of i) t.unshift(G(s));
    } else e !== void 0 && t.push(G(e));
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
      const a = (i.converter?.toAttribute !== void 0 ? i.converter : R).toAttribute(t, i.type);
      this._$Em = e, a == null ? this.removeAttribute(s) : this.setAttribute(s, a), this._$Em = null;
    }
  }
  _$AK(e, t) {
    const i = this.constructor, s = i._$Eh.get(e);
    if (s !== void 0 && this._$Em !== s) {
      const a = i.getPropertyOptions(s), o = typeof a.converter == "function" ? { fromAttribute: a.converter } : a.converter?.fromAttribute !== void 0 ? a.converter : R;
      this._$Em = s;
      const c = o.fromAttribute(t, a.type);
      this[s] = c ?? this._$Ej?.get(s) ?? c, this._$Em = null;
    }
  }
  requestUpdate(e, t, i, s = !1, a) {
    if (e !== void 0) {
      const o = this.constructor;
      if (s === !1 && (a = this[e]), i ??= o.getPropertyOptions(e), !((i.hasChanged ?? V)(a, t) || i.useDefault && i.reflect && a === this._$Ej?.get(e) && !this.hasAttribute(o._$Eu(e, i)))) return;
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
k.elementStyles = [], k.shadowRootOptions = { mode: "open" }, k[j("elementProperties")] = /* @__PURE__ */ new Map(), k[j("finalized")] = /* @__PURE__ */ new Map(), we?.({ ReactiveElement: k }), (W.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const J = globalThis, ee = (r) => r, L = J.trustedTypes, te = L ? L.createPolicy("lit-html", { createHTML: (r) => r }) : void 0, de = "$lit$", $ = `lit$${Math.random().toFixed(9).slice(2)}$`, ce = "?" + $, xe = `<${ce}>`, A = document, O = () => A.createComment(""), N = (r) => r === null || typeof r != "object" && typeof r != "function", Z = Array.isArray, Ae = (r) => Z(r) || typeof r?.[Symbol.iterator] == "function", I = `[ 	
\f\r]`, T = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ie = /-->/g, se = />/g, w = RegExp(`>|${I}(?:([^\\s"'>=/]+)(${I}*=${I}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), re = /'/g, ae = /"/g, he = /^(?:script|style|textarea|title)$/i, ke = (r) => (e, ...t) => ({ _$litType$: r, strings: e, values: t }), d = ke(1), E = Symbol.for("lit-noChange"), n = Symbol.for("lit-nothing"), oe = /* @__PURE__ */ new WeakMap(), x = A.createTreeWalker(A, 129);
function pe(r, e) {
  if (!Z(r) || !r.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return te !== void 0 ? te.createHTML(e) : e;
}
const Se = (r, e) => {
  const t = r.length - 1, i = [];
  let s, a = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", o = T;
  for (let c = 0; c < t; c++) {
    const l = r[c];
    let p, _, h = -1, f = 0;
    for (; f < l.length && (o.lastIndex = f, _ = o.exec(l), _ !== null); ) f = o.lastIndex, o === T ? _[1] === "!--" ? o = ie : _[1] !== void 0 ? o = se : _[2] !== void 0 ? (he.test(_[2]) && (s = RegExp("</" + _[2], "g")), o = w) : _[3] !== void 0 && (o = w) : o === w ? _[0] === ">" ? (o = s ?? T, h = -1) : _[1] === void 0 ? h = -2 : (h = o.lastIndex - _[2].length, p = _[1], o = _[3] === void 0 ? w : _[3] === '"' ? ae : re) : o === ae || o === re ? o = w : o === ie || o === se ? o = T : (o = w, s = void 0);
    const y = o === w && r[c + 1].startsWith("/>") ? " " : "";
    a += o === T ? l + xe : h >= 0 ? (i.push(p), l.slice(0, h) + de + l.slice(h) + $ + y) : l + $ + (h === -2 ? c : y);
  }
  return [pe(r, a + (r[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), i];
};
class z {
  constructor({ strings: e, _$litType$: t }, i) {
    let s;
    this.parts = [];
    let a = 0, o = 0;
    const c = e.length - 1, l = this.parts, [p, _] = Se(e, t);
    if (this.el = z.createElement(p, i), x.currentNode = this.el.content, t === 2 || t === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (s = x.nextNode()) !== null && l.length < c; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const h of s.getAttributeNames()) if (h.endsWith(de)) {
          const f = _[o++], y = s.getAttribute(h).split($), D = /([.?@])?(.*)/.exec(f);
          l.push({ type: 1, index: a, name: D[2], strings: y, ctor: D[1] === "." ? Ce : D[1] === "?" ? Pe : D[1] === "@" ? Te : B }), s.removeAttribute(h);
        } else h.startsWith($) && (l.push({ type: 6, index: a }), s.removeAttribute(h));
        if (he.test(s.tagName)) {
          const h = s.textContent.split($), f = h.length - 1;
          if (f > 0) {
            s.textContent = L ? L.emptyScript : "";
            for (let y = 0; y < f; y++) s.append(h[y], O()), x.nextNode(), l.push({ type: 2, index: ++a });
            s.append(h[f], O());
          }
        }
      } else if (s.nodeType === 8) if (s.data === ce) l.push({ type: 2, index: a });
      else {
        let h = -1;
        for (; (h = s.data.indexOf($, h + 1)) !== -1; ) l.push({ type: 7, index: a }), h += $.length - 1;
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
  const a = N(e) ? void 0 : e._$litDirective$;
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
    x.currentNode = s;
    let a = x.nextNode(), o = 0, c = 0, l = i[0];
    for (; l !== void 0; ) {
      if (o === l.index) {
        let p;
        l.type === 2 ? p = new U(a, a.nextSibling, this, e) : l.type === 1 ? p = new l.ctor(a, l.name, l.strings, this, e) : l.type === 6 && (p = new je(a, this, e)), this._$AV.push(p), l = i[++c];
      }
      o !== l?.index && (a = x.nextNode(), o++);
    }
    return x.currentNode = A, s;
  }
  p(e) {
    let t = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(e, i, t), t += i.strings.length - 2) : i._$AI(e[t])), t++;
  }
}
class U {
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
    e = C(this, e, t), N(e) ? e === n || e == null || e === "" ? (this._$AH !== n && this._$AR(), this._$AH = n) : e !== this._$AH && e !== E && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Ae(e) ? this.k(e) : this._(e);
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
    const { values: t, _$litType$: i } = e, s = typeof i == "number" ? this._$AC(e) : (i.el === void 0 && (i.el = z.createElement(pe(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === s) this._$AH.p(t);
    else {
      const a = new Ee(s, this), o = a.u(this.options);
      a.p(t), this.T(o), this._$AH = a;
    }
  }
  _$AC(e) {
    let t = oe.get(e.strings);
    return t === void 0 && oe.set(e.strings, t = new z(e)), t;
  }
  k(e) {
    Z(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let i, s = 0;
    for (const a of e) s === t.length ? t.push(i = new U(this.O(O()), this.O(O()), this, this.options)) : i = t[s], i._$AI(a), s++;
    s < t.length && (this._$AR(i && i._$AB.nextSibling, s), t.length = s);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    for (this._$AP?.(!1, !0, t); e !== this._$AB; ) {
      const i = ee(e).nextSibling;
      ee(e).remove(), e = i;
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
    if (a === void 0) e = C(this, e, t, 0), o = !N(e) || e !== this._$AH && e !== E, o && (this._$AH = e);
    else {
      const c = e;
      let l, p;
      for (e = a[0], l = 0; l < a.length - 1; l++) p = C(this, c[i + l], t, l), p === E && (p = this._$AH[l]), o ||= !N(p) || p !== this._$AH[l], p === n ? e = n : e !== n && (e += (p ?? "") + a[l + 1]), this._$AH[l] = p;
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
const Oe = J.litHtmlPolyfillSupport;
Oe?.(z, U), (J.litHtmlVersions ??= []).push("3.3.3");
const Ne = (r, e, t) => {
  const i = t?.renderBefore ?? e;
  let s = i._$litPart$;
  if (s === void 0) {
    const a = t?.renderBefore ?? null;
    i._$litPart$ = s = new U(e.insertBefore(O(), a), a, void 0, t ?? {});
  }
  return s._$AI(r), s;
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
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Ne(t, this.renderRoot, this.renderOptions);
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
const ze = K.litElementPolyfillSupport;
ze?.({ LitElement: S });
(K.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Ue = { attribute: !0, type: String, converter: R, reflect: !1, hasChanged: V }, De = (r = Ue, e, t) => {
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
  return (e, t) => typeof t == "object" ? De(r, e, t) : ((i, s, a) => {
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
const H = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], Me = () => ({
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
var Re = Object.defineProperty, b = (r, e, t, i) => {
  for (var s = void 0, a = r.length - 1, o; a >= 0; a--)
    (o = r[a]) && (s = o(e, t, s) || s);
  return s && Re(e, t, s), s;
};
class v extends S {
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
    this.styles = le`
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
b([
  P({ attribute: !1 })
], v.prototype, "hass");
b([
  P({ attribute: !1 })
], v.prototype, "alarms");
b([
  P({ attribute: !1 })
], v.prototype, "haForm");
b([
  u()
], v.prototype, "_users");
b([
  u()
], v.prototype, "_policies");
b([
  u()
], v.prototype, "_orphans");
b([
  u()
], v.prototype, "_error");
b([
  u()
], v.prototype, "_loaded");
customElements.get("wakey-admin") || customElements.define("wakey-admin", v);
var Le = Object.defineProperty, g = (r, e, t, i) => {
  for (var s = void 0, a = r.length - 1, o; a >= 0; a--)
    (o = r[a]) && (s = o(e, t, s) || s);
  return s && Le(e, t, s), s;
};
const We = H.map((r, e) => ({ value: String(e), label: r }));
class m extends S {
  constructor() {
    super(...arguments), this.narrow = !1, this._alarms = [], this._isAdmin = !1, this._allowedPlayers = null, this._view = "alarms", this._loaded = !1, this._error = null, this._dialogOpen = !1, this._editing = null, this._draft = {}, this._adjusting = null, this._adjustTime = "", this._haForm = !1, this._testingAlarm = null, this._subscribed = !1, this._label = (e) => ({
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
    })[e.name] ?? e.name;
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
  /**
   * Whether a one-time adjustment is still ahead of us.
   *
   * The backend clears a spent adjustment on its next scheduling pass, which
   * can be a while after the day itself has gone. Checking the date here
   * keeps a dead one off the card in the meantime.
   */
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
    this._editing = null, this._draft = { ...Me(), weekdays: ["0", "1", "2", "3", "4"] }, this._dialogOpen = !0;
  }
  _openEdit(e) {
    this._editing = e.id, this._draft = {
      ...e,
      weekdays: (e.weekdays ?? []).map(String),
      media: e.media_player ? { entity_id: e.media_player } : void 0
    }, this._dialogOpen = !0;
  }
  _closeDialog() {
    this._dialogOpen = !1, this._editing = null;
  }
  _formChanged(e) {
    const t = { ...e.detail.value };
    t.media_player && t.media?.entity_id !== t.media_player && (t.media = { ...t.media ?? {}, entity_id: t.media_player }), t.media?.media_content_id && t.media.media_content_id !== this._draft.media?.media_content_id && (t.source_uri = t.media.media_content_id), this._draft = t;
  }
  async _save() {
    const e = this._draft;
    if (!e.time || !e.media_player || !e.source_uri) {
      this._error = "Name, time, media player and source are all required.";
      return;
    }
    const t = {
      name: e.name || "Alarm",
      time: String(e.time).slice(0, 5),
      repeat: e.repeat ?? "weekly",
      weekdays: (e.weekdays ?? []).map((i) => Number(i)),
      date: e.date ?? null,
      media_player: e.media_player,
      source_uri: e.source_uri,
      source_kind: e.source_kind ?? "music_assistant",
      volume: Number(e.volume ?? 0.7),
      fade_seconds: Number(e.fade_seconds ?? 0),
      resume_previous: !!(e.resume_previous ?? !1),
      snooze_minutes: Number(e.snooze_minutes ?? 9),
      auto_dismiss_minutes: Number(e.auto_dismiss_minutes ?? 30),
      pre_alarm_minutes: Number(e.pre_alarm_minutes ?? 0),
      pre_alarm_script: e.pre_alarm_script || null,
      notify_targets: e.notify_targets ?? [],
      repeat_count: Number(e.repeat_count ?? 0)
    };
    this._editing ? await this._call({ type: "wakey/update", alarm_id: this._editing, ...t }) : await this._call({ type: "wakey/create", ...t, enabled: e.enabled ?? !0 }), this._closeDialog();
  }
  _schema() {
    const e = this._draft.repeat ?? "weekly";
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
      ...e === "weekly" ? [{ name: "weekdays", selector: { select: { multiple: !0, options: We } } }] : [{ name: "date", selector: { date: {} } }],
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
  _fmtNext(e) {
    if (!e.enabled) return "Off";
    if (!e.next_fire) return "Never";
    const t = new Date(e.next_fire), i = Math.round((t.getTime() - Date.now()) / 6e4);
    if (i < 60) return `in ${Math.max(1, i)} min`;
    const s = Math.floor(i / 60);
    return s < 24 ? `in ${s}h ${i % 60}m` : t.toLocaleDateString(void 0, { weekday: "long" });
  }
  _fmtAdjusted(e) {
    const t = (/* @__PURE__ */ new Date()).toLocaleDateString("en-CA");
    return e.override_for === t ? `Today at ${e.override_time}` : `${(/* @__PURE__ */ new Date(`${e.override_for}T00:00:00`)).toLocaleDateString(void 0, { weekday: "long" })} at ${e.override_time}`;
  }
  _renderAdjustDialog() {
    const e = this._alarms.find((t) => t.id === this._adjusting);
    return e ? d`
      <div class="scrim" @click=${() => this._adjusting = null}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        <h2>Adjust next</h2>
        <p class="hint">
          Just this once. ${e.name} rings at the new time, then goes back to
          ${e.time} on its own.
        </p>
        <label>
          Time
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
  _renderAlarm(e) {
    const t = e.repeat === "once" ? e.date ?? "Once" : e.weekdays.length === 7 ? "Every day" : e.weekdays.length === 0 ? "No days selected" : e.weekdays.map((i) => H[i]).join(" ");
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
        ${d`<div class="actions">
              <button @click=${() => this._openEdit(e)}>Edit</button>
              <button @click=${() => this._skip(e)}>
                ${e.skip_next ? "Don't skip" : "Skip next"}
              </button>
              <button @click=${() => this._openAdjust(e)}>Adjust next</button>
              <button @click=${() => this._trigger(e)}>Test</button>
              <button class="danger" @click=${() => this._delete(e)}>Delete</button>
            </div>`}
      </div>
    `;
  }
  _renderRinging() {
    const e = this._alarms.filter((t) => t.is_ringing || t.is_snoozed);
    return e.length ? d`
      <div class="banner">
        <div class="grow">
          <strong>${e.map((t) => t.name).join(", ")}</strong>
          <div class="sub">${e[0].is_snoozed ? "Snoozed" : "Ringing now"}</div>
        </div>
        <button @click=${() => this._call({ type: "wakey/snooze" })}>Snooze</button>
        <button @click=${() => this._call({ type: "wakey/dismiss" })}>Dismiss</button>
      </div>
    ` : n;
  }
  _renderDialog() {
    if (!this._dialogOpen) return n;
    const e = this._draft.time ? String(this._draft.time).slice(0, 5) : "07:00", t = this._draft.name || "Alarma", i = this._draft.repeat === "once" ? this._draft.date || "Una vez" : this._draft.weekdays?.length === 7 ? "Todos los días" : this._draft.weekdays?.length ? this._draft.weekdays.map((s) => H[Number(s)]).join(" ") : "L M X J V";
    return d`
      <div class="scrim" @click=${this._closeDialog}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        <h2>${this._editing ? "Editar alarma" : "Nueva alarma"}</h2>

        <div class="live-alarm-preview">
          <div class="preview-header">
            <div class="preview-icon"><ha-icon icon="mdi:alarm"></ha-icon></div>
            <div class="preview-title">${t}</div>
            <span class="preview-badge ${this._editing ? "edit" : "new"}">${this._editing ? "EDITANDO" : "NUEVA"}</span>
          </div>
          <div class="preview-time">${e}</div>
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
    const e = this._testingAlarm, t = e.repeat === "once" ? e.date ?? "Una vez" : e.weekdays.length === 7 ? "Todos los días" : e.weekdays.length === 0 ? "Sin días" : e.weekdays.map((i) => H[i]).join(" ");
    return d`
      <div class="scrim" @click=${() => this._stopTest()}></div>
      <div class="dialog test-dialog" role="dialog" aria-modal="true">
        <div class="live-alarm-preview test-mode">
          <div class="preview-header">
            <div class="preview-icon pulsing"><ha-icon icon="mdi:bell-ring"></ha-icon></div>
            <div class="preview-title">${e.name || "Alarma"}</div>
            <span class="preview-badge test">SONANDO</span>
          </div>
          <div class="preview-time">${e.time}</div>
          <div class="preview-sub">${t}</div>
          <div class="preview-speaker">
            <ha-icon icon="mdi:speaker"></ha-icon> ${String(e.media_player || "Altavoz").replace("media_player.", "").replace(/_/g, " ")}
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
    return this._loaded ? this._alarms.length === 0 ? this._renderEmpty() : this._alarms.map((e) => this._renderAlarm(e)) : d`<div class="empty">Loading…</div>`;
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
    this.styles = le`
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
  }
}
g([
  P({ attribute: !1 })
], m.prototype, "hass");
g([
  P({ attribute: !1 })
], m.prototype, "narrow");
g([
  u()
], m.prototype, "_alarms");
g([
  u()
], m.prototype, "_isAdmin");
g([
  u()
], m.prototype, "_allowedPlayers");
g([
  u()
], m.prototype, "_view");
g([
  u()
], m.prototype, "_loaded");
g([
  u()
], m.prototype, "_error");
g([
  u()
], m.prototype, "_dialogOpen");
g([
  u()
], m.prototype, "_editing");
g([
  u()
], m.prototype, "_draft");
g([
  u()
], m.prototype, "_adjusting");
g([
  u()
], m.prototype, "_adjustTime");
g([
  u()
], m.prototype, "_haForm");
g([
  u()
], m.prototype, "_testingAlarm");
customElements.get("wakey-panel") || customElements.define("wakey-panel", m);
