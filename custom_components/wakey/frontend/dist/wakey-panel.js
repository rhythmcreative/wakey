/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const T = globalThis, L = T.ShadowRoot && (T.ShadyCSS === void 0 || T.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, I = Symbol(), Z = /* @__PURE__ */ new WeakMap();
let re = class {
  constructor(e, s, i) {
    if (this._$cssResult$ = !0, i !== I) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = s;
  }
  get styleSheet() {
    let e = this.o;
    const s = this.t;
    if (L && e === void 0) {
      const i = s !== void 0 && s.length === 1;
      i && (e = Z.get(s)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), i && Z.set(s, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const ce = (t) => new re(typeof t == "string" ? t : t + "", void 0, I), he = (t, ...e) => {
  const s = t.length === 1 ? t[0] : e.reduce((i, r, o) => i + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + t[o + 1], t[0]);
  return new re(s, t, I);
}, pe = (t, e) => {
  if (L) t.adoptedStyleSheets = e.map((s) => s instanceof CSSStyleSheet ? s : s.styleSheet);
  else for (const s of e) {
    const i = document.createElement("style"), r = T.litNonce;
    r !== void 0 && i.setAttribute("nonce", r), i.textContent = s.cssText, t.appendChild(i);
  }
}, J = L ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let s = "";
  for (const i of e.cssRules) s += i.cssText;
  return ce(s);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: ue, defineProperty: _e, getOwnPropertyDescriptor: me, getOwnPropertyNames: fe, getOwnPropertySymbols: ge, getPrototypeOf: $e } = Object, H = globalThis, K = H.trustedTypes, ye = K ? K.emptyScript : "", be = H.reactiveElementPolyfillSupport, k = (t, e) => t, z = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? ye : null;
      break;
    case Object:
    case Array:
      t = t == null ? t : JSON.stringify(t);
  }
  return t;
}, fromAttribute(t, e) {
  let s = t;
  switch (e) {
    case Boolean:
      s = t !== null;
      break;
    case Number:
      s = t === null ? null : Number(t);
      break;
    case Object:
    case Array:
      try {
        s = JSON.parse(t);
      } catch {
        s = null;
      }
  }
  return s;
} }, B = (t, e) => !ue(t, e), Y = { attribute: !0, type: String, converter: z, reflect: !1, useDefault: !1, hasChanged: B };
Symbol.metadata ??= Symbol("metadata"), H.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let A = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, s = Y) {
    if (s.state && (s.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((s = Object.create(s)).wrapped = !0), this.elementProperties.set(e, s), !s.noAccessor) {
      const i = Symbol(), r = this.getPropertyDescriptor(e, i, s);
      r !== void 0 && _e(this.prototype, e, r);
    }
  }
  static getPropertyDescriptor(e, s, i) {
    const { get: r, set: o } = me(this.prototype, e) ?? { get() {
      return this[s];
    }, set(n) {
      this[s] = n;
    } };
    return { get: r, set(n) {
      const l = r?.call(this);
      o?.call(this, n), this.requestUpdate(e, l, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? Y;
  }
  static _$Ei() {
    if (this.hasOwnProperty(k("elementProperties"))) return;
    const e = $e(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(k("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(k("properties"))) {
      const s = this.properties, i = [...fe(s), ...ge(s)];
      for (const r of i) this.createProperty(r, s[r]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const s = litPropertyMetadata.get(e);
      if (s !== void 0) for (const [i, r] of s) this.elementProperties.set(i, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [s, i] of this.elementProperties) {
      const r = this._$Eu(s, i);
      r !== void 0 && this._$Eh.set(r, s);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const s = [];
    if (Array.isArray(e)) {
      const i = new Set(e.flat(1 / 0).reverse());
      for (const r of i) s.unshift(J(r));
    } else e !== void 0 && s.push(J(e));
    return s;
  }
  static _$Eu(e, s) {
    const i = s.attribute;
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
    const e = /* @__PURE__ */ new Map(), s = this.constructor.elementProperties;
    for (const i of s.keys()) this.hasOwnProperty(i) && (e.set(i, this[i]), delete this[i]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return pe(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((e) => e.hostDisconnected?.());
  }
  attributeChangedCallback(e, s, i) {
    this._$AK(e, i);
  }
  _$ET(e, s) {
    const i = this.constructor.elementProperties.get(e), r = this.constructor._$Eu(e, i);
    if (r !== void 0 && i.reflect === !0) {
      const o = (i.converter?.toAttribute !== void 0 ? i.converter : z).toAttribute(s, i.type);
      this._$Em = e, o == null ? this.removeAttribute(r) : this.setAttribute(r, o), this._$Em = null;
    }
  }
  _$AK(e, s) {
    const i = this.constructor, r = i._$Eh.get(e);
    if (r !== void 0 && this._$Em !== r) {
      const o = i.getPropertyOptions(r), n = typeof o.converter == "function" ? { fromAttribute: o.converter } : o.converter?.fromAttribute !== void 0 ? o.converter : z;
      this._$Em = r;
      const l = n.fromAttribute(s, o.type);
      this[r] = l ?? this._$Ej?.get(r) ?? l, this._$Em = null;
    }
  }
  requestUpdate(e, s, i, r = !1, o) {
    if (e !== void 0) {
      const n = this.constructor;
      if (r === !1 && (o = this[e]), i ??= n.getPropertyOptions(e), !((i.hasChanged ?? B)(o, s) || i.useDefault && i.reflect && o === this._$Ej?.get(e) && !this.hasAttribute(n._$Eu(e, i)))) return;
      this.C(e, s, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, s, { useDefault: i, reflect: r, wrapped: o }, n) {
    i && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, n ?? s ?? this[e]), o !== !0 || n !== void 0) || (this._$AL.has(e) || (this.hasUpdated || i || (s = void 0), this._$AL.set(e, s)), r === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (s) {
      Promise.reject(s);
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
        for (const [r, o] of this._$Ep) this[r] = o;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [r, o] of i) {
        const { wrapped: n } = o, l = this[r];
        n !== !0 || this._$AL.has(r) || l === void 0 || this.C(r, void 0, o, l);
      }
    }
    let e = !1;
    const s = this._$AL;
    try {
      e = this.shouldUpdate(s), e ? (this.willUpdate(s), this._$EO?.forEach((i) => i.hostUpdate?.()), this.update(s)) : this._$EM();
    } catch (i) {
      throw e = !1, this._$EM(), i;
    }
    e && this._$AE(s);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    this._$EO?.forEach((s) => s.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
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
    this._$Eq &&= this._$Eq.forEach((s) => this._$ET(s, this[s])), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
A.elementStyles = [], A.shadowRootOptions = { mode: "open" }, A[k("elementProperties")] = /* @__PURE__ */ new Map(), A[k("finalized")] = /* @__PURE__ */ new Map(), be?.({ ReactiveElement: A }), (H.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const q = globalThis, G = (t) => t, D = q.trustedTypes, Q = D ? D.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, oe = "$lit$", $ = `lit$${Math.random().toFixed(9).slice(2)}$`, ne = "?" + $, ve = `<${ne}>`, v = document, P = () => v.createComment(""), O = (t) => t === null || typeof t != "object" && typeof t != "function", W = Array.isArray, xe = (t) => W(t) || typeof t?.[Symbol.iterator] == "function", j = `[ 	
\f\r]`, S = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, X = /-->/g, ee = />/g, y = RegExp(`>|${j}(?:([^\\s"'>=/]+)(${j}*=${j}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), te = /'/g, se = /"/g, ae = /^(?:script|style|textarea|title)$/i, Ae = (t) => (e, ...s) => ({ _$litType$: t, strings: e, values: s }), p = Ae(1), w = Symbol.for("lit-noChange"), d = Symbol.for("lit-nothing"), ie = /* @__PURE__ */ new WeakMap(), b = v.createTreeWalker(v, 129);
function le(t, e) {
  if (!W(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Q !== void 0 ? Q.createHTML(e) : e;
}
const we = (t, e) => {
  const s = t.length - 1, i = [];
  let r, o = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", n = S;
  for (let l = 0; l < s; l++) {
    const a = t[l];
    let h, u, c = -1, f = 0;
    for (; f < a.length && (n.lastIndex = f, u = n.exec(a), u !== null); ) f = n.lastIndex, n === S ? u[1] === "!--" ? n = X : u[1] !== void 0 ? n = ee : u[2] !== void 0 ? (ae.test(u[2]) && (r = RegExp("</" + u[2], "g")), n = y) : u[3] !== void 0 && (n = y) : n === y ? u[0] === ">" ? (n = r ?? S, c = -1) : u[1] === void 0 ? c = -2 : (c = n.lastIndex - u[2].length, h = u[1], n = u[3] === void 0 ? y : u[3] === '"' ? se : te) : n === se || n === te ? n = y : n === X || n === ee ? n = S : (n = y, r = void 0);
    const g = n === y && t[l + 1].startsWith("/>") ? " " : "";
    o += n === S ? a + ve : c >= 0 ? (i.push(h), a.slice(0, c) + oe + a.slice(c) + $ + g) : a + $ + (c === -2 ? l : g);
  }
  return [le(t, o + (t[s] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), i];
};
class N {
  constructor({ strings: e, _$litType$: s }, i) {
    let r;
    this.parts = [];
    let o = 0, n = 0;
    const l = e.length - 1, a = this.parts, [h, u] = we(e, s);
    if (this.el = N.createElement(h, i), b.currentNode = this.el.content, s === 2 || s === 3) {
      const c = this.el.content.firstChild;
      c.replaceWith(...c.childNodes);
    }
    for (; (r = b.nextNode()) !== null && a.length < l; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const c of r.getAttributeNames()) if (c.endsWith(oe)) {
          const f = u[n++], g = r.getAttribute(c).split($), M = /([.?@])?(.*)/.exec(f);
          a.push({ type: 1, index: o, name: M[2], strings: g, ctor: M[1] === "." ? Se : M[1] === "?" ? ke : M[1] === "@" ? Ce : R }), r.removeAttribute(c);
        } else c.startsWith($) && (a.push({ type: 6, index: o }), r.removeAttribute(c));
        if (ae.test(r.tagName)) {
          const c = r.textContent.split($), f = c.length - 1;
          if (f > 0) {
            r.textContent = D ? D.emptyScript : "";
            for (let g = 0; g < f; g++) r.append(c[g], P()), b.nextNode(), a.push({ type: 2, index: ++o });
            r.append(c[f], P());
          }
        }
      } else if (r.nodeType === 8) if (r.data === ne) a.push({ type: 2, index: o });
      else {
        let c = -1;
        for (; (c = r.data.indexOf($, c + 1)) !== -1; ) a.push({ type: 7, index: o }), c += $.length - 1;
      }
      o++;
    }
  }
  static createElement(e, s) {
    const i = v.createElement("template");
    return i.innerHTML = e, i;
  }
}
function E(t, e, s = t, i) {
  if (e === w) return e;
  let r = i !== void 0 ? s._$Co?.[i] : s._$Cl;
  const o = O(e) ? void 0 : e._$litDirective$;
  return r?.constructor !== o && (r?._$AO?.(!1), o === void 0 ? r = void 0 : (r = new o(t), r._$AT(t, s, i)), i !== void 0 ? (s._$Co ??= [])[i] = r : s._$Cl = r), r !== void 0 && (e = E(t, r._$AS(t, e.values), r, i)), e;
}
class Ee {
  constructor(e, s) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = s;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: s }, parts: i } = this._$AD, r = (e?.creationScope ?? v).importNode(s, !0);
    b.currentNode = r;
    let o = b.nextNode(), n = 0, l = 0, a = i[0];
    for (; a !== void 0; ) {
      if (n === a.index) {
        let h;
        a.type === 2 ? h = new U(o, o.nextSibling, this, e) : a.type === 1 ? h = new a.ctor(o, a.name, a.strings, this, e) : a.type === 6 && (h = new Pe(o, this, e)), this._$AV.push(h), a = i[++l];
      }
      n !== a?.index && (o = b.nextNode(), n++);
    }
    return b.currentNode = v, r;
  }
  p(e) {
    let s = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(e, i, s), s += i.strings.length - 2) : i._$AI(e[s])), s++;
  }
}
class U {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, s, i, r) {
    this.type = 2, this._$AH = d, this._$AN = void 0, this._$AA = e, this._$AB = s, this._$AM = i, this.options = r, this._$Cv = r?.isConnected ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const s = this._$AM;
    return s !== void 0 && e?.nodeType === 11 && (e = s.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, s = this) {
    e = E(this, e, s), O(e) ? e === d || e == null || e === "" ? (this._$AH !== d && this._$AR(), this._$AH = d) : e !== this._$AH && e !== w && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : xe(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== d && O(this._$AH) ? this._$AA.nextSibling.data = e : this.T(v.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: s, _$litType$: i } = e, r = typeof i == "number" ? this._$AC(e) : (i.el === void 0 && (i.el = N.createElement(le(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === r) this._$AH.p(s);
    else {
      const o = new Ee(r, this), n = o.u(this.options);
      o.p(s), this.T(n), this._$AH = o;
    }
  }
  _$AC(e) {
    let s = ie.get(e.strings);
    return s === void 0 && ie.set(e.strings, s = new N(e)), s;
  }
  k(e) {
    W(this._$AH) || (this._$AH = [], this._$AR());
    const s = this._$AH;
    let i, r = 0;
    for (const o of e) r === s.length ? s.push(i = new U(this.O(P()), this.O(P()), this, this.options)) : i = s[r], i._$AI(o), r++;
    r < s.length && (this._$AR(i && i._$AB.nextSibling, r), s.length = r);
  }
  _$AR(e = this._$AA.nextSibling, s) {
    for (this._$AP?.(!1, !0, s); e !== this._$AB; ) {
      const i = G(e).nextSibling;
      G(e).remove(), e = i;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class R {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, s, i, r, o) {
    this.type = 1, this._$AH = d, this._$AN = void 0, this.element = e, this.name = s, this._$AM = r, this.options = o, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = d;
  }
  _$AI(e, s = this, i, r) {
    const o = this.strings;
    let n = !1;
    if (o === void 0) e = E(this, e, s, 0), n = !O(e) || e !== this._$AH && e !== w, n && (this._$AH = e);
    else {
      const l = e;
      let a, h;
      for (e = o[0], a = 0; a < o.length - 1; a++) h = E(this, l[i + a], s, a), h === w && (h = this._$AH[a]), n ||= !O(h) || h !== this._$AH[a], h === d ? e = d : e !== d && (e += (h ?? "") + o[a + 1]), this._$AH[a] = h;
    }
    n && !r && this.j(e);
  }
  j(e) {
    e === d ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Se extends R {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === d ? void 0 : e;
  }
}
class ke extends R {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== d);
  }
}
class Ce extends R {
  constructor(e, s, i, r, o) {
    super(e, s, i, r, o), this.type = 5;
  }
  _$AI(e, s = this) {
    if ((e = E(this, e, s, 0) ?? d) === w) return;
    const i = this._$AH, r = e === d && i !== d || e.capture !== i.capture || e.once !== i.once || e.passive !== i.passive, o = e !== d && (i === d || r);
    r && this.element.removeEventListener(this.name, this, i), o && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Pe {
  constructor(e, s, i) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = s, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    E(this, e);
  }
}
const Oe = q.litHtmlPolyfillSupport;
Oe?.(N, U), (q.litHtmlVersions ??= []).push("3.3.3");
const Ne = (t, e, s) => {
  const i = s?.renderBefore ?? e;
  let r = i._$litPart$;
  if (r === void 0) {
    const o = s?.renderBefore ?? null;
    i._$litPart$ = r = new U(e.insertBefore(P(), o), o, void 0, s ?? {});
  }
  return r._$AI(t), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const F = globalThis;
class C extends A {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const s = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Ne(s, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return w;
  }
}
C._$litElement$ = !0, C.finalized = !0, F.litElementHydrateSupport?.({ LitElement: C });
const Ue = F.litElementPolyfillSupport;
Ue?.({ LitElement: C });
(F.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Me = (t) => (e, s) => {
  s !== void 0 ? s.addInitializer(() => {
    customElements.define(t, e);
  }) : customElements.define(t, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Te = { attribute: !0, type: String, converter: z, reflect: !1, hasChanged: B }, ze = (t = Te, e, s) => {
  const { kind: i, metadata: r } = s;
  let o = globalThis.litPropertyMetadata.get(r);
  if (o === void 0 && globalThis.litPropertyMetadata.set(r, o = /* @__PURE__ */ new Map()), i === "setter" && ((t = Object.create(t)).wrapped = !0), o.set(s.name, t), i === "accessor") {
    const { name: n } = s;
    return { set(l) {
      const a = e.get.call(this);
      e.set.call(this, l), this.requestUpdate(n, a, t, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(n, void 0, t, l), l;
    } };
  }
  if (i === "setter") {
    const { name: n } = s;
    return function(l) {
      const a = this[n];
      e.call(this, l), this.requestUpdate(n, a, t, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function V(t) {
  return (e, s) => typeof s == "object" ? ze(t, e, s) : ((i, r, o) => {
    const n = r.hasOwnProperty(o);
    return r.constructor.createProperty(o, i), n ? Object.getOwnPropertyDescriptor(r, o) : void 0;
  })(t, e, s);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function x(t) {
  return V({ ...t, state: !0, attribute: !1 });
}
const de = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], De = () => ({
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
  enabled: !0
});
var He = Object.defineProperty, Re = Object.getOwnPropertyDescriptor, m = (t, e, s, i) => {
  for (var r = i > 1 ? void 0 : i ? Re(e, s) : e, o = t.length - 1, n; o >= 0; o--)
    (n = t[o]) && (r = (i ? n(e, s, r) : n(r)) || r);
  return i && r && He(e, s, r), r;
};
const je = de.map((t, e) => ({ value: String(e), label: t }));
async function Le() {
  try {
    await (await (await window.loadCardHelpers?.())?.createCardElement({ type: "entities", entities: [] }))?.constructor?.getConfigElement?.();
  } catch {
  }
  return Promise.race([
    customElements.whenDefined("ha-form").then(() => !0),
    new Promise((t) => setTimeout(() => t(!1), 4e3))
  ]);
}
let _ = class extends C {
  constructor() {
    super(...arguments), this.narrow = !1, this._alarms = [], this._loaded = !1, this._error = null, this._dialogOpen = !1, this._editing = null, this._draft = {}, this._haForm = !1, this._subscribed = !1, this._label = (t) => ({
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
      advanced: "Advanced"
    })[t.name] ?? t.name;
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._unsub?.(), this._unsub = void 0, this._subscribed = !1;
  }
  updated(t) {
    t.has("hass") && this.hass && !this._subscribed && (this._subscribed = !0, this._subscribe(), Le().then((e) => this._haForm = e));
  }
  async _subscribe() {
    try {
      this._unsub = await this.hass.connection.subscribeMessage(
        (t) => {
          this._alarms = t.alarms ?? [], this._loaded = !0, this._error = null;
        },
        { type: "wakey/subscribe" }
      );
    } catch (t) {
      this._error = t?.message ?? String(t), this._loaded = !0;
    }
  }
  get _isAdmin() {
    return this.hass?.user?.is_admin !== !1;
  }
  // --- actions -----------------------------------------------------------
  async _call(t) {
    try {
      await this.hass.callWS(t);
    } catch (e) {
      this._error = e?.message ?? String(e);
    }
  }
  _toggle(t) {
    this._call({ type: "wakey/update", alarm_id: t.id, enabled: !t.enabled });
  }
  _skip(t) {
    this._call({ type: "wakey/skip_next", alarm_id: t.id, skip: !t.skip_next });
  }
  _delete(t) {
    confirm(`Delete "${t.name}"?`) && this._call({ type: "wakey/delete", alarm_id: t.id });
  }
  _trigger(t) {
    this._call({ type: "wakey/trigger", alarm_id: t.id });
  }
  // --- dialog ------------------------------------------------------------
  _openNew() {
    this._editing = null, this._draft = { ...De(), weekdays: ["0", "1", "2", "3", "4"] }, this._dialogOpen = !0;
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
      weekdays: (t.weekdays ?? []).map((s) => Number(s)),
      date: t.date ?? null,
      media_player: t.media_player,
      source_uri: t.source_uri,
      source_kind: t.source_kind ?? "music_assistant",
      volume: Number(t.volume ?? 0.7),
      fade_seconds: Number(t.fade_seconds ?? 0),
      snooze_minutes: Number(t.snooze_minutes ?? 9),
      auto_dismiss_minutes: Number(t.auto_dismiss_minutes ?? 30),
      pre_alarm_minutes: Number(t.pre_alarm_minutes ?? 0),
      pre_alarm_script: t.pre_alarm_script || null
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
      ...t === "weekly" ? [{ name: "weekdays", selector: { select: { multiple: !0, options: je } } }] : [{ name: "date", selector: { date: {} } }],
      {
        name: "media_player",
        required: !0,
        selector: { entity: { filter: { domain: "media_player" } } }
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
        name: "advanced",
        title: "Advanced",
        schema: [
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
          }
        ]
      }
    ];
  }
  // --- render ------------------------------------------------------------
  _fmtNext(t) {
    if (!t.enabled) return "Off";
    if (!t.next_fire) return "Never";
    const e = new Date(t.next_fire), s = Math.round((e.getTime() - Date.now()) / 6e4);
    if (s < 60) return `in ${Math.max(1, s)} min`;
    const i = Math.floor(s / 60);
    return i < 24 ? `in ${i}h ${s % 60}m` : e.toLocaleDateString(void 0, { weekday: "long" });
  }
  _renderAlarm(t) {
    const e = t.repeat === "once" ? t.date ?? "Once" : t.weekdays.length === 7 ? "Every day" : t.weekdays.length === 0 ? "No days selected" : t.weekdays.map((s) => de[s]).join(" ");
    return p`
      <div class="card ${t.enabled ? "" : "dim"}">
        <div class="row">
          <div class="time">${t.time}</div>
          <div class="grow">
            <div class="name">${t.name}</div>
            <div class="sub">${e}</div>
            <div class="sub">${t.media_player || "no player"}</div>
          </div>
          <div class="right">
            ${this._haForm ? p`<ha-switch
                  .checked=${t.enabled}
                  @change=${() => this._toggle(t)}
                ></ha-switch>` : p`<input
                  type="checkbox"
                  .checked=${t.enabled}
                  @change=${() => this._toggle(t)}
                />`}
            <div class="next">${this._fmtNext(t)}</div>
          </div>
        </div>
        ${t.is_ringing || t.is_snoozed || t.skip_next ? p`<div class="flags">
              ${t.is_ringing ? p`<span class="flag ring">Ringing</span>` : d}
              ${t.is_snoozed ? p`<span class="flag">Snoozed</span>` : d}
              ${t.skip_next ? p`<span class="flag">Skipping next</span>` : d}
            </div>` : d}
        ${this._isAdmin ? p`<div class="actions">
              <button @click=${() => this._openEdit(t)}>Edit</button>
              <button @click=${() => this._skip(t)}>
                ${t.skip_next ? "Don't skip" : "Skip next"}
              </button>
              <button @click=${() => this._trigger(t)}>Test</button>
              <button class="danger" @click=${() => this._delete(t)}>Delete</button>
            </div>` : d}
      </div>
    `;
  }
  _renderRinging() {
    const t = this._alarms.filter((e) => e.is_ringing || e.is_snoozed);
    return t.length ? p`
      <div class="banner">
        <div class="grow">
          <strong>${t.map((e) => e.name).join(", ")}</strong>
          <div class="sub">${t[0].is_snoozed ? "Snoozed" : "Ringing now"}</div>
        </div>
        <button @click=${() => this._call({ type: "wakey/snooze" })}>Snooze</button>
        <button @click=${() => this._call({ type: "wakey/dismiss" })}>Dismiss</button>
      </div>
    ` : d;
  }
  _renderDialog() {
    return this._dialogOpen ? p`
      <div class="scrim" @click=${this._closeDialog}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        <h2>${this._editing ? "Edit alarm" : "New alarm"}</h2>
        ${this._haForm ? p`<ha-form
              .hass=${this.hass}
              .data=${this._draft}
              .schema=${this._schema()}
              .computeLabel=${this._label}
              @value-changed=${this._formChanged}
            ></ha-form>` : p`
              <p class="warn">
                Home Assistant's form components did not load, so this is a reduced editor.
              </p>
              <label>Name<input .value=${this._draft.name ?? ""} @input=${(t) => this._draft = { ...this._draft, name: t.target.value }} /></label>
              <label>Time<input type="time" .value=${this._draft.time ?? "07:00"} @input=${(t) => this._draft = { ...this._draft, time: t.target.value }} /></label>
              <label>Media player<input .value=${this._draft.media_player ?? ""} @input=${(t) => this._draft = { ...this._draft, media_player: t.target.value }} /></label>
              <label>Source<input .value=${this._draft.source_uri ?? ""} @input=${(t) => this._draft = { ...this._draft, source_uri: t.target.value }} /></label>
            `}
        <div class="dialog-actions">
          <button @click=${this._closeDialog}>Cancel</button>
          <button class="primary" @click=${this._save}>Save</button>
        </div>
      </div>
    ` : d;
  }
  render() {
    return p`
      <div class="header">
        <h1>Wakey</h1>
        ${this._isAdmin ? p`<button class="primary" @click=${this._openNew}>Add alarm</button>` : d}
      </div>

      <div class="body">
        ${this._error ? p`<div class="error">${this._error}</div>` : d}
        ${this._renderRinging()}
        ${this._loaded ? this._alarms.length === 0 ? p`<div class="empty">
                No alarms yet.${this._isAdmin ? " Use Add alarm to create one." : ""}
              </div>` : this._alarms.map((t) => this._renderAlarm(t)) : p`<div class="empty">Loading…</div>`}
      </div>

      ${this._renderDialog()}
    `;
  }
};
_.styles = he`
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
  `;
m([
  V({ attribute: !1 })
], _.prototype, "hass", 2);
m([
  V({ attribute: !1 })
], _.prototype, "narrow", 2);
m([
  x()
], _.prototype, "_alarms", 2);
m([
  x()
], _.prototype, "_loaded", 2);
m([
  x()
], _.prototype, "_error", 2);
m([
  x()
], _.prototype, "_dialogOpen", 2);
m([
  x()
], _.prototype, "_editing", 2);
m([
  x()
], _.prototype, "_draft", 2);
m([
  x()
], _.prototype, "_haForm", 2);
_ = m([
  Me("wakey-panel")
], _);
