/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const J = globalThis, se = J.ShadowRoot && (J.ShadyCSS === void 0 || J.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, re = Symbol(), ce = /* @__PURE__ */ new WeakMap();
let xe = class {
  constructor(e, t, i) {
    if (this._$cssResult$ = !0, i !== re) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (se && e === void 0) {
      const i = t !== void 0 && t.length === 1;
      i && (e = ce.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), i && ce.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const je = (r) => new xe(typeof r == "string" ? r : r + "", void 0, re), oe = (r, ...e) => {
  const t = r.length === 1 ? r[0] : e.reduce((i, s, o) => i + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + r[o + 1], r[0]);
  return new xe(t, r, re);
}, Ne = (r, e) => {
  if (se) r.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const i = document.createElement("style"), s = J.litNonce;
    s !== void 0 && i.setAttribute("nonce", s), i.textContent = t.cssText, r.appendChild(i);
  }
}, pe = se ? (r) => r : (r) => r instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const i of e.cssRules) t += i.cssText;
  return je(t);
})(r) : r;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Oe, defineProperty: Me, getOwnPropertyDescriptor: Re, getOwnPropertyNames: De, getOwnPropertySymbols: Ue, getPrototypeOf: He } = Object, X = globalThis, he = X.trustedTypes, Le = he ? he.emptyScript : "", Ie = X.reactiveElementPolyfillSupport, L = (r, e) => r, Z = { toAttribute(r, e) {
  switch (e) {
    case Boolean:
      r = r ? Le : null;
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
} }, ae = (r, e) => !Oe(r, e), ue = { attribute: !0, type: String, converter: Z, reflect: !1, useDefault: !1, hasChanged: ae };
Symbol.metadata ??= Symbol("metadata"), X.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let R = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = ue) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const i = Symbol(), s = this.getPropertyDescriptor(e, i, t);
      s !== void 0 && Me(this.prototype, e, s);
    }
  }
  static getPropertyDescriptor(e, t, i) {
    const { get: s, set: o } = Re(this.prototype, e) ?? { get() {
      return this[t];
    }, set(a) {
      this[t] = a;
    } };
    return { get: s, set(a) {
      const c = s?.call(this);
      o?.call(this, a), this.requestUpdate(e, c, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? ue;
  }
  static _$Ei() {
    if (this.hasOwnProperty(L("elementProperties"))) return;
    const e = He(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(L("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(L("properties"))) {
      const t = this.properties, i = [...De(t), ...Ue(t)];
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
      for (const s of i) t.unshift(pe(s));
    } else e !== void 0 && t.push(pe(e));
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
    return Ne(e, this.constructor.elementStyles), e;
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
      const o = (i.converter?.toAttribute !== void 0 ? i.converter : Z).toAttribute(t, i.type);
      this._$Em = e, o == null ? this.removeAttribute(s) : this.setAttribute(s, o), this._$Em = null;
    }
  }
  _$AK(e, t) {
    const i = this.constructor, s = i._$Eh.get(e);
    if (s !== void 0 && this._$Em !== s) {
      const o = i.getPropertyOptions(s), a = typeof o.converter == "function" ? { fromAttribute: o.converter } : o.converter?.fromAttribute !== void 0 ? o.converter : Z;
      this._$Em = s;
      const c = a.fromAttribute(t, o.type);
      this[s] = c ?? this._$Ej?.get(s) ?? c, this._$Em = null;
    }
  }
  requestUpdate(e, t, i, s = !1, o) {
    if (e !== void 0) {
      const a = this.constructor;
      if (s === !1 && (o = this[e]), i ??= a.getPropertyOptions(e), !((i.hasChanged ?? ae)(o, t) || i.useDefault && i.reflect && o === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, i)))) return;
      this.C(e, t, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: i, reflect: s, wrapped: o }, a) {
    i && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, a ?? t ?? this[e]), o !== !0 || a !== void 0) || (this._$AL.has(e) || (this.hasUpdated || i || (t = void 0), this._$AL.set(e, t)), s === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
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
        for (const [s, o] of this._$Ep) this[s] = o;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [s, o] of i) {
        const { wrapped: a } = o, c = this[s];
        a !== !0 || this._$AL.has(s) || c === void 0 || this.C(s, void 0, o, c);
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
R.elementStyles = [], R.shadowRootOptions = { mode: "open" }, R[L("elementProperties")] = /* @__PURE__ */ new Map(), R[L("finalized")] = /* @__PURE__ */ new Map(), Ie?.({ ReactiveElement: R }), (X.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ne = globalThis, ge = (r) => r, Y = ne.trustedTypes, fe = Y ? Y.createPolicy("lit-html", { createHTML: (r) => r }) : void 0, we = "$lit$", A = `lit$${Math.random().toFixed(9).slice(2)}$`, ke = "?" + A, Fe = `<${ke}>`, N = document, I = () => N.createComment(""), F = (r) => r === null || typeof r != "object" && typeof r != "function", le = Array.isArray, Be = (r) => le(r) || typeof r?.[Symbol.iterator] == "function", ie = `[ 	
\f\r]`, H = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, me = /-->/g, ve = />/g, z = RegExp(`>|${ie}(?:([^\\s"'>=/]+)(${ie}*=${ie}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), _e = /'/g, ye = /"/g, Ae = /^(?:script|style|textarea|title)$/i, Ve = (r) => (e, ...t) => ({ _$litType$: r, strings: e, values: t }), n = Ve(1), D = Symbol.for("lit-noChange"), l = Symbol.for("lit-nothing"), be = /* @__PURE__ */ new WeakMap(), P = N.createTreeWalker(N, 129);
function Ce(r, e) {
  if (!le(r) || !r.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return fe !== void 0 ? fe.createHTML(e) : e;
}
const We = (r, e) => {
  const t = r.length - 1, i = [];
  let s, o = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", a = H;
  for (let c = 0; c < t; c++) {
    const d = r[c];
    let u, g, p = -1, m = 0;
    for (; m < d.length && (a.lastIndex = m, g = a.exec(d), g !== null); ) m = a.lastIndex, a === H ? g[1] === "!--" ? a = me : g[1] !== void 0 ? a = ve : g[2] !== void 0 ? (Ae.test(g[2]) && (s = RegExp("</" + g[2], "g")), a = z) : g[3] !== void 0 && (a = z) : a === z ? g[0] === ">" ? (a = s ?? H, p = -1) : g[1] === void 0 ? p = -2 : (p = a.lastIndex - g[2].length, u = g[1], a = g[3] === void 0 ? z : g[3] === '"' ? ye : _e) : a === ye || a === _e ? a = z : a === me || a === ve ? a = H : (a = z, s = void 0);
    const h = a === z && r[c + 1].startsWith("/>") ? " " : "";
    o += a === H ? d + Fe : p >= 0 ? (i.push(u), d.slice(0, p) + we + d.slice(p) + A + h) : d + A + (p === -2 ? c : h);
  }
  return [Ce(r, o + (r[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), i];
};
class B {
  constructor({ strings: e, _$litType$: t }, i) {
    let s;
    this.parts = [];
    let o = 0, a = 0;
    const c = e.length - 1, d = this.parts, [u, g] = We(e, t);
    if (this.el = B.createElement(u, i), P.currentNode = this.el.content, t === 2 || t === 3) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (s = P.nextNode()) !== null && d.length < c; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const p of s.getAttributeNames()) if (p.endsWith(we)) {
          const m = g[a++], h = s.getAttribute(p).split(A), b = /([.?@])?(.*)/.exec(m);
          d.push({ type: 1, index: o, name: b[2], strings: h, ctor: b[1] === "." ? Ge : b[1] === "?" ? Je : b[1] === "@" ? Ke : Q }), s.removeAttribute(p);
        } else p.startsWith(A) && (d.push({ type: 6, index: o }), s.removeAttribute(p));
        if (Ae.test(s.tagName)) {
          const p = s.textContent.split(A), m = p.length - 1;
          if (m > 0) {
            s.textContent = Y ? Y.emptyScript : "";
            for (let h = 0; h < m; h++) s.append(p[h], I()), P.nextNode(), d.push({ type: 2, index: ++o });
            s.append(p[m], I());
          }
        }
      } else if (s.nodeType === 8) if (s.data === ke) d.push({ type: 2, index: o });
      else {
        let p = -1;
        for (; (p = s.data.indexOf(A, p + 1)) !== -1; ) d.push({ type: 7, index: o }), p += A.length - 1;
      }
      o++;
    }
  }
  static createElement(e, t) {
    const i = N.createElement("template");
    return i.innerHTML = e, i;
  }
}
function U(r, e, t = r, i) {
  if (e === D) return e;
  let s = i !== void 0 ? t._$Co?.[i] : t._$Cl;
  const o = F(e) ? void 0 : e._$litDirective$;
  return s?.constructor !== o && (s?._$AO?.(!1), o === void 0 ? s = void 0 : (s = new o(r), s._$AT(r, t, i)), i !== void 0 ? (t._$Co ??= [])[i] = s : t._$Cl = s), s !== void 0 && (e = U(r, s._$AS(r, e.values), s, i)), e;
}
class qe {
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
    const { el: { content: t }, parts: i } = this._$AD, s = (e?.creationScope ?? N).importNode(t, !0);
    P.currentNode = s;
    let o = P.nextNode(), a = 0, c = 0, d = i[0];
    for (; d !== void 0; ) {
      if (a === d.index) {
        let u;
        d.type === 2 ? u = new V(o, o.nextSibling, this, e) : d.type === 1 ? u = new d.ctor(o, d.name, d.strings, this, e) : d.type === 6 && (u = new Ze(o, this, e)), this._$AV.push(u), d = i[++c];
      }
      a !== d?.index && (o = P.nextNode(), a++);
    }
    return P.currentNode = N, s;
  }
  p(e) {
    let t = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(e, i, t), t += i.strings.length - 2) : i._$AI(e[t])), t++;
  }
}
class V {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, t, i, s) {
    this.type = 2, this._$AH = l, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = i, this.options = s, this._$Cv = s?.isConnected ?? !0;
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
    e = U(this, e, t), F(e) ? e === l || e == null || e === "" ? (this._$AH !== l && this._$AR(), this._$AH = l) : e !== this._$AH && e !== D && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Be(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== l && F(this._$AH) ? this._$AA.nextSibling.data = e : this.T(N.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: t, _$litType$: i } = e, s = typeof i == "number" ? this._$AC(e) : (i.el === void 0 && (i.el = B.createElement(Ce(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === s) this._$AH.p(t);
    else {
      const o = new qe(s, this), a = o.u(this.options);
      o.p(t), this.T(a), this._$AH = o;
    }
  }
  _$AC(e) {
    let t = be.get(e.strings);
    return t === void 0 && be.set(e.strings, t = new B(e)), t;
  }
  k(e) {
    le(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let i, s = 0;
    for (const o of e) s === t.length ? t.push(i = new V(this.O(I()), this.O(I()), this, this.options)) : i = t[s], i._$AI(o), s++;
    s < t.length && (this._$AR(i && i._$AB.nextSibling, s), t.length = s);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    for (this._$AP?.(!1, !0, t); e !== this._$AB; ) {
      const i = ge(e).nextSibling;
      ge(e).remove(), e = i;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class Q {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, i, s, o) {
    this.type = 1, this._$AH = l, this._$AN = void 0, this.element = e, this.name = t, this._$AM = s, this.options = o, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = l;
  }
  _$AI(e, t = this, i, s) {
    const o = this.strings;
    let a = !1;
    if (o === void 0) e = U(this, e, t, 0), a = !F(e) || e !== this._$AH && e !== D, a && (this._$AH = e);
    else {
      const c = e;
      let d, u;
      for (e = o[0], d = 0; d < o.length - 1; d++) u = U(this, c[i + d], t, d), u === D && (u = this._$AH[d]), a ||= !F(u) || u !== this._$AH[d], u === l ? e = l : e !== l && (e += (u ?? "") + o[d + 1]), this._$AH[d] = u;
    }
    a && !s && this.j(e);
  }
  j(e) {
    e === l ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Ge extends Q {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === l ? void 0 : e;
  }
}
class Je extends Q {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== l);
  }
}
class Ke extends Q {
  constructor(e, t, i, s, o) {
    super(e, t, i, s, o), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = U(this, e, t, 0) ?? l) === D) return;
    const i = this._$AH, s = e === l && i !== l || e.capture !== i.capture || e.once !== i.once || e.passive !== i.passive, o = e !== l && (i === l || s);
    s && this.element.removeEventListener(this.name, this, i), o && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Ze {
  constructor(e, t, i) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    U(this, e);
  }
}
const Ye = ne.litHtmlPolyfillSupport;
Ye?.(B, V), (ne.litHtmlVersions ??= []).push("3.3.3");
const Xe = (r, e, t) => {
  const i = t?.renderBefore ?? e;
  let s = i._$litPart$;
  if (s === void 0) {
    const o = t?.renderBefore ?? null;
    i._$litPart$ = s = new V(e.insertBefore(I(), o), o, void 0, t ?? {});
  }
  return s._$AI(r), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const de = globalThis;
class j extends R {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Xe(t, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return D;
  }
}
j._$litElement$ = !0, j.finalized = !0, de.litElementHydrateSupport?.({ LitElement: j });
const Qe = de.litElementPolyfillSupport;
Qe?.({ LitElement: j });
(de.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const et = { attribute: !0, type: String, converter: Z, reflect: !1, hasChanged: ae }, tt = (r = et, e, t) => {
  const { kind: i, metadata: s } = t;
  let o = globalThis.litPropertyMetadata.get(s);
  if (o === void 0 && globalThis.litPropertyMetadata.set(s, o = /* @__PURE__ */ new Map()), i === "setter" && ((r = Object.create(r)).wrapped = !0), o.set(t.name, r), i === "accessor") {
    const { name: a } = t;
    return { set(c) {
      const d = e.get.call(this);
      e.set.call(this, c), this.requestUpdate(a, d, r, !0, c);
    }, init(c) {
      return c !== void 0 && this.C(a, void 0, r, c), c;
    } };
  }
  if (i === "setter") {
    const { name: a } = t;
    return function(c) {
      const d = this[a];
      e.call(this, c), this.requestUpdate(a, d, r, !0, c);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function O(r) {
  return (e, t) => typeof t == "object" ? tt(r, e, t) : ((i, s, o) => {
    const a = s.hasOwnProperty(o);
    return s.constructor.createProperty(o, i), a ? Object.getOwnPropertyDescriptor(s, o) : void 0;
  })(r, e, t);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function f(r) {
  return O({ ...r, state: !0, attribute: !1 });
}
const K = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], it = () => ({
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
async function st() {
  try {
    await (await (await window.loadCardHelpers?.())?.createCardElement({ type: "entities", entities: [] }))?.constructor?.getConfigElement?.();
  } catch {
  }
  return Promise.race([
    customElements.whenDefined("ha-form").then(() => !0),
    new Promise((r) => setTimeout(() => r(!1), 4e3))
  ]);
}
var rt = Object.defineProperty, C = (r, e, t, i) => {
  for (var s = void 0, o = r.length - 1, a; o >= 0; o--)
    (a = r[o]) && (s = a(e, t, s) || s);
  return s && rt(e, t, s), s;
};
class k extends j {
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
    return n`
      <div class="card">
        <div class="row">
          <div class="grow">
            <div class="name">${e.name || "Unnamed user"}</div>
            <div class="sub">
              ${e.is_admin ? "Administrator — every speaker" : t.length === 0 ? "No speakers yet" : `${t.length} speaker${t.length === 1 ? "" : "s"}`}
            </div>
          </div>
        </div>
        ${e.is_admin ? l : n`
              <div class="form">
                ${this.haForm ? n`<ha-form
                      .hass=${this.hass}
                      .data=${{ allowed_media_players: t }}
                      .schema=${this._policySchema()}
                      .computeLabel=${() => "Allowed speakers"}
                      @value-changed=${(s) => this._policyChanged(e, s)}
                    ></ha-form>` : n`<label>
                      Allowed speakers (comma separated)
                      <input
                        .value=${t.join(", ")}
                        @change=${(s) => this._policyChanged(e, {
      detail: {
        value: {
          allowed_media_players: s.target.value.split(",").map((o) => o.trim()).filter(Boolean)
        }
      }
    })}
                      />
                    </label>`}
              </div>
              ${i.length ? n`<div class="warn">
                    ${i.length} of ${e.name}'s alarms use a speaker they can
                    no longer choose:
                    ${i.map((s) => `${s.name} (${s.media_player})`).join(", ")}.
                    They will still go off — reassign or delete them.
                  </div>` : l}
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
    return this.alarms.length ? n`
      <h2>Who owns what</h2>
      ${this._unowned.length ? n`<div class="notice">
            <div class="grow">
              ${this._unowned.length}
              ${this._unowned.length === 1 ? "alarm has" : "alarms have"} no owner, so
              only administrators can see ${this._unowned.length === 1 ? "it" : "them"}.
            </div>
            <button class="primary" @click=${this._claimAll}>Assign all to me</button>
          </div>` : l}
      ${this.alarms.map(
      (e) => n`
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
        (t) => n`<option value=${t.id} ?selected=${t.id === e.owner_id}>
                    ${t.name || t.id}
                  </option>`
      )}
              </select>
            </div>
          </div>
        `
    )}
    ` : l;
  }
  render() {
    return this._loaded ? n`
      ${this._error ? n`<div class="error">${this._error}</div>` : l}
      <h2>Speakers each person may use</h2>
      <p class="sub intro">
        Nobody gets a speaker until you grant it. Administrators always have all of
        them.
      </p>
      ${this._users.map((e) => this._renderUser(e))}
      ${this._renderOwnership()}
    ` : n`<div class="empty">Loading…</div>`;
  }
  static {
    this.styles = oe`
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
C([
  O({ attribute: !1 })
], k.prototype, "hass");
C([
  O({ attribute: !1 })
], k.prototype, "alarms");
C([
  O({ attribute: !1 })
], k.prototype, "haForm");
C([
  f()
], k.prototype, "_users");
C([
  f()
], k.prototype, "_policies");
C([
  f()
], k.prototype, "_orphans");
C([
  f()
], k.prototype, "_error");
C([
  f()
], k.prototype, "_loaded");
customElements.get("wakey-admin") || customElements.define("wakey-admin", k);
var ot = Object.defineProperty, ee = (r, e, t, i) => {
  for (var s = void 0, o = r.length - 1, a; o >= 0; o--)
    (a = r[o]) && (s = a(e, t, s) || s);
  return s && ot(e, t, s), s;
};
const G = {
  style: "flip",
  font: "Google Sans",
  weight: "400",
  is24h: !0,
  showSeconds: !1,
  showDate: !0,
  glow: !1,
  scale: 100,
  clockColor: "#f5f5f7",
  cardColor: "#232328",
  bgColor: "#0d0d11"
}, $e = "wakey_clock_config";
class W extends j {
  constructor() {
    super(...arguments), this._config = { ...G }, this._now = /* @__PURE__ */ new Date(), this._fullscreen = !1;
  }
  connectedCallback() {
    super.connectedCallback(), this._loadConfig(), this._loadGoogleFonts(), this._timer = window.setInterval(() => {
      this._now = /* @__PURE__ */ new Date();
    }, 1e3);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._timer && (clearInterval(this._timer), this._timer = void 0);
  }
  _loadConfig() {
    try {
      const e = localStorage.getItem($e);
      e && (this._config = { ...G, ...JSON.parse(e) });
    } catch {
      this._config = { ...G };
    }
  }
  _saveConfig() {
    try {
      localStorage.setItem($e, JSON.stringify(this._config)), window.dispatchEvent(
        new CustomEvent("wakey-clock-settings-changed", {
          detail: { config: this._config }
        })
      );
    } catch (e) {
      console.error("Failed to save Wakey clock config", e);
    }
  }
  _updateConfig(e) {
    this._config = { ...this._config, ...e }, this._saveConfig(), this.requestUpdate();
  }
  _loadGoogleFonts() {
    if (!document.getElementById("wakey-google-clock-fonts")) {
      const e = document.createElement("link");
      e.id = "wakey-google-clock-fonts", e.rel = "stylesheet", e.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700;900&family=Nunito:wght@300;400;500;700;900&family=Oswald:wght@300;400;500;700&family=Roboto+Slab:wght@300;400;500;700;900&family=Rubik:wght@300;400;500;700;900&display=swap", document.head.appendChild(e);
    }
  }
  _resetDefaults() {
    this._config = { ...G }, this._saveConfig();
  }
  _getFontFamily(e) {
    const t = {
      "Google Sans": "'Google Sans', var(--ha-font-family, Roboto, system-ui, sans-serif)",
      Rubik: "'Rubik', sans-serif",
      Nunito: "'Nunito', sans-serif",
      Inter: "'Inter', sans-serif",
      Oswald: "'Oswald', sans-serif",
      "Roboto Slab": "'Roboto Slab', serif",
      monospace: "'Courier New', Courier, monospace"
    };
    return t[e] || t["Google Sans"];
  }
  _hexToRgb(e) {
    const t = e.replace("#", "");
    if (t.length === 3) {
      const i = parseInt(t[0] + t[0], 16), s = parseInt(t[1] + t[1], 16), o = parseInt(t[2] + t[2], 16);
      return `${i}, ${s}, ${o}`;
    }
    if (t.length === 6) {
      const i = parseInt(t.slice(0, 2), 16), s = parseInt(t.slice(2, 4), 16), o = parseInt(t.slice(4, 6), 16);
      return `${i}, ${s}, ${o}`;
    }
    return "245, 245, 247";
  }
  // --- Clock Renderer ----------------------------------------------------
  _renderClockView(e = !1) {
    const {
      style: t,
      font: i,
      weight: s,
      is24h: o,
      showSeconds: a,
      showDate: c,
      glow: d,
      scale: u,
      clockColor: g,
      cardColor: p
    } = this._config, m = this._getFontFamily(i), h = this._hexToRgb(g), b = this._hexToRgb(p);
    let y = this._now.getHours(), x = "";
    o || (x = y >= 12 ? "PM" : "AM", y = y % 12, y === 0 && (y = 12));
    const S = o ? String(y).padStart(2, "0") : String(y), E = String(this._now.getMinutes()).padStart(2, "0"), T = String(this._now.getSeconds()).padStart(2, "0"), $ = this._now.toLocaleDateString(void 0, {
      weekday: "long",
      month: "long",
      day: "numeric"
    }), M = d ? `text-shadow: 0 0 12px rgba(${h}, 0.85), 0 0 30px rgba(${h}, 0.45);` : "", w = Math.max(0.6, Math.min(2.5, u / 100));
    if (e) {
      const Ee = `calc(min(18vw, 26vh) * ${w})`, Te = `calc(min(4.2vw, 6vh) * ${w})`, ze = `calc(min(22vw, 30vh) * ${w})`, Pe = `calc(min(2vw, 2.5vh) * ${w}) calc(min(3vw, 3.5vh) * ${w})`;
      return this._renderStyleHTML(
        t,
        m,
        s,
        g,
        h,
        p,
        b,
        S,
        E,
        T,
        x,
        $,
        Ee,
        Te,
        ze,
        Pe,
        a,
        c,
        o,
        M,
        !0
      );
    }
    const q = `${Math.round(44 * w)}px`, te = `${Math.round(13 * w)}px`, Se = `${Math.round(52 * w)}px`;
    return this._renderStyleHTML(
      t,
      m,
      s,
      g,
      h,
      p,
      b,
      S,
      E,
      T,
      x,
      $,
      q,
      te,
      Se,
      "8px 12px",
      a,
      c,
      o,
      M,
      !1
    );
  }
  _renderStyleHTML(e, t, i, s, o, a, c, d, u, g, p, m, h, b, y, x, S, E, T, $, M) {
    if (e === "flip")
      return n`
        <div
          class="clock-container"
          style="font-family:${t}; font-variant-numeric:tabular-nums; line-height:1;"
        >
          <div class="flip-row">
            <div
              class="flip-card"
              style="background:${a}; min-width:${y}; padding:${x};"
            >
              <span
                style="color:${s}; font-weight:${i}; font-size:${h}; ${$}"
                >${d}</span
              >
              <div class="flip-divider"></div>
            </div>

            <div
              class="colon"
              style="color:${s}; font-size:${h}; font-weight:${i};"
            >
              :
            </div>

            <div
              class="flip-card"
              style="background:${a}; min-width:${y}; padding:${x};"
            >
              <span
                style="color:${s}; font-weight:${i}; font-size:${h}; ${$}"
                >${u}</span
              >
              <div class="flip-divider"></div>
            </div>

            ${S ? n`
                  <div
                    class="colon"
                    style="color:${s}; font-size:${h}; font-weight:${i};"
                  >
                    :
                  </div>
                  <div
                    class="flip-card"
                    style="background:${a}; min-width:${y}; padding:${x};"
                  >
                    <span
                      style="color:${s}; font-weight:${i}; font-size:${h}; ${$}"
                      >${g}</span
                    >
                    <div class="flip-divider"></div>
                  </div>
                ` : l}
            ${T ? l : n`<div
                  class="ampm-badge"
                  style="color:${s}; font-size:${M ? "calc(min(3vw, 4vh))" : "11px"};"
                >
                  ${p}
                </div>`}
          </div>
          ${E ? n`<div
                class="clock-date"
                style="color:rgba(${o}, 0.75); font-size:${b};"
              >
                ${m}
              </div>` : l}
        </div>
      `;
    if (e === "roller")
      return n`
        <div
          class="clock-container"
          style="font-family:${t}; font-variant-numeric:tabular-nums; line-height:1;"
        >
          <div class="roller-row">
            <div
              class="roller-card"
              style="background:linear-gradient(180deg, rgba(0,0,0,0.55) 0%, ${a} 30%, ${a} 70%, rgba(0,0,0,0.6) 100%); min-width:${y}; padding:${x};"
            >
              <span
                style="color:${s}; font-weight:${i}; font-size:${h}; ${$}"
                >${d}</span
              >
            </div>

            <div
              class="colon"
              style="color:${s}; font-size:${h}; font-weight:${i};"
            >
              :
            </div>

            <div
              class="roller-card"
              style="background:linear-gradient(180deg, rgba(0,0,0,0.55) 0%, ${a} 30%, ${a} 70%, rgba(0,0,0,0.6) 100%); min-width:${y}; padding:${x};"
            >
              <span
                style="color:${s}; font-weight:${i}; font-size:${h}; ${$}"
                >${u}</span
              >
            </div>

            ${S ? n`
                  <div
                    class="colon"
                    style="color:${s}; font-size:${h}; font-weight:${i};"
                  >
                    :
                  </div>
                  <div
                    class="roller-card"
                    style="background:linear-gradient(180deg, rgba(0,0,0,0.55) 0%, ${a} 30%, ${a} 70%, rgba(0,0,0,0.6) 100%); min-width:${y}; padding:${x};"
                  >
                    <span
                      style="color:${s}; font-weight:${i}; font-size:${h}; ${$}"
                      >${g}</span
                    >
                  </div>
                ` : l}
            ${T ? l : n`<div
                  class="ampm-badge"
                  style="color:${s}; font-size:${M ? "calc(min(3vw, 4vh))" : "11px"};"
                >
                  ${p}
                </div>`}
          </div>
          ${E ? n`<div
                class="clock-date"
                style="color:rgba(${o}, 0.75); font-size:${b};"
              >
                ${m}
              </div>` : l}
        </div>
      `;
    if (e === "lcd") {
      const q = `${d}:${u}${S ? `:${g}` : ""}${T ? "" : ` ${p}`}`, te = q.replace(/[0-9]/g, "8").replace(/[A-Za-z]/g, "8");
      return n`
        <div
          class="clock-container"
          style="font-family:'Courier New', monospace; line-height:1;"
        >
          <div
            class="lcd-bezel"
            style="background:${a}; padding:${M ? "calc(min(3vw, 4vh)) calc(min(4.5vw, 6vh))" : "14px 20px"};"
          >
            <div
              class="lcd-ghost"
              style="color:rgba(${o}, 0.08); font-size:${h}; font-weight:${i};"
            >
              ${te}
            </div>
            <div
              class="lcd-active"
              style="color:${s}; font-size:${h}; font-weight:${i}; ${$}"
            >
              ${q}
            </div>
          </div>
          ${E ? n`<div
                class="clock-date"
                style="font-family:${t}; color:rgba(${o}, 0.75); font-size:${b};"
              >
                ${m}
              </div>` : l}
        </div>
      `;
    }
    const w = `${d}:${u}${S ? `:${g}` : ""}`;
    return n`
      <div
        class="clock-container"
        style="font-family:${t}; font-variant-numeric:tabular-nums; line-height:1;"
      >
        <div
          class="digital-time"
          style="color:${s}; font-weight:${i}; font-size:${h}; ${$}"
        >
          ${w}${T ? l : n`<span class="digital-ampm">${p}</span>`}
        </div>
        ${E ? n`<div
              class="clock-date"
              style="color:rgba(${o}, 0.75); font-size:${b};"
            >
              ${m}
            </div>` : l}
      </div>
    `;
  }
  // --- Main Render -------------------------------------------------------
  render() {
    const e = this._config.style === "flip" || this._config.style === "roller" || this._config.style === "lcd";
    return n`
      <div class="settings-wrapper">
        <!-- Live Preview Header Card -->
        <div class="preview-card">
          <div class="preview-header-bar">
            <div class="preview-title">
              <ha-icon icon="mdi:clock-outline"></ha-icon>
              <span>Vista Previa en Vivo</span>
              <span class="live-tag">TICTAC ACTIVO</span>
            </div>
            <button
              class="fullscreen-btn"
              @click=${() => this._fullscreen = !0}
              title="Ver reloj a pantalla completa"
            >
              <ha-icon icon="mdi:fullscreen"></ha-icon>
              <span>Pantalla completa</span>
            </button>
          </div>

          <div
            class="preview-viewport"
            style="background-color: ${this._config.bgColor};"
          >
            ${this._renderClockView(!1)}
          </div>
        </div>

        <!-- Controls Container -->
        <div class="options-container">
          <!-- Style Selector -->
          <div class="section-card">
            <h3>Estilo del Reloj</h3>
            <div class="style-grid">
              <div
                class="style-option ${this._config.style === "digital" ? "selected" : ""}"
                @click=${() => this._updateConfig({ style: "digital" })}
              >
                <div class="style-icon"><ha-icon icon="mdi:numeric"></ha-icon></div>
                <div class="style-name">Digital</div>
                <div class="style-desc">Moderno y minimalista</div>
              </div>

              <div
                class="style-option ${this._config.style === "flip" ? "selected" : ""}"
                @click=${() => this._updateConfig({ style: "flip" })}
              >
                <div class="style-icon"><ha-icon icon="mdi:flip-to-back"></ha-icon></div>
                <div class="style-name">Flip Clock</div>
                <div class="style-desc">Solapas mecánicas retro</div>
              </div>

              <div
                class="style-option ${this._config.style === "roller" ? "selected" : ""}"
                @click=${() => this._updateConfig({ style: "roller" })}
              >
                <div class="style-icon"><ha-icon icon="mdi:cylinder"></ha-icon></div>
                <div class="style-name">Roller Clock</div>
                <div class="style-desc">Cilíndrico 3D con relieve</div>
              </div>

              <div
                class="style-option ${this._config.style === "lcd" ? "selected" : ""}"
                @click=${() => this._updateConfig({ style: "lcd" })}
              >
                <div class="style-icon"><ha-icon icon="mdi:watch"></ha-icon></div>
                <div class="style-name">LCD Clock</div>
                <div class="style-desc">7 segmentos vintage</div>
              </div>
            </div>
          </div>

          <!-- Typography -->
          <div class="section-card">
            <h3>Tipografía y Fuente</h3>
            <div class="form-row">
              <label for="font-select">Familia tipográfica</label>
              <select
                id="font-select"
                .value=${this._config.font}
                @change=${(t) => this._updateConfig({ font: t.target.value })}
              >
                <option value="Google Sans">Google Sans</option>
                <option value="Rubik">Rubik</option>
                <option value="Nunito">Nunito (Apple StandBy)</option>
                <option value="Inter">Inter</option>
                <option value="Oswald">Oswald (Reloj de pared)</option>
                <option value="Roboto Slab">Roboto Slab</option>
                <option value="monospace">Monospace</option>
              </select>
            </div>

            <div class="form-row">
              <label for="weight-select">Grosor de dígitos (Weight)</label>
              <select
                id="weight-select"
                .value=${this._config.weight}
                @change=${(t) => this._updateConfig({ weight: t.target.value })}
              >
                <option value="300">300 (Ligero / Fino)</option>
                <option value="400">400 (Regular / Normal)</option>
                <option value="500">500 (Medio)</option>
                <option value="700">700 (Negrita / Bold)</option>
                <option value="900">900 (Extra Bold / Black)</option>
              </select>
            </div>
          </div>

          <!-- Formats & Toggles -->
          <div class="section-card">
            <h3>Opciones de Visualización</h3>

            <div class="toggle-row">
              <div class="toggle-info">
                <div class="toggle-title">Formato 24 horas</div>
                <div class="toggle-sub">Alterna entre 24h y 12h con indicador AM/PM</div>
              </div>
              <input
                type="checkbox"
                .checked=${this._config.is24h}
                @change=${(t) => this._updateConfig({ is24h: t.target.checked })}
              />
            </div>

            <div class="toggle-row">
              <div class="toggle-info">
                <div class="toggle-title">Mostrar segundos</div>
                <div class="toggle-sub">Incluye la unidad de segundos en el reloj</div>
              </div>
              <input
                type="checkbox"
                .checked=${this._config.showSeconds}
                @change=${(t) => this._updateConfig({ showSeconds: t.target.checked })}
              />
            </div>

            <div class="toggle-row">
              <div class="toggle-info">
                <div class="toggle-title">Mostrar fecha</div>
                <div class="toggle-sub">Línea de día de la semana y fecha completa</div>
              </div>
              <input
                type="checkbox"
                .checked=${this._config.showDate}
                @change=${(t) => this._updateConfig({ showDate: t.target.checked })}
              />
            </div>

            <div class="toggle-row">
              <div class="toggle-info">
                <div class="toggle-title">Resplandor neón (Glow)</div>
                <div class="toggle-sub">
                  Añade un halo luminoso y sombras difusas a los dígitos
                </div>
              </div>
              <input
                type="checkbox"
                .checked=${this._config.glow}
                @change=${(t) => this._updateConfig({ glow: t.target.checked })}
              />
            </div>

            <div class="form-row slider-row">
              <div class="slider-header">
                <label>Tamaño / Escala del reloj</label>
                <span class="slider-value">${this._config.scale}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="250"
                step="5"
                .value=${String(this._config.scale)}
                @input=${(t) => this._updateConfig({ scale: Number(t.target.value) })}
              />
            </div>
          </div>

          <!-- Color Customization -->
          <div class="section-card">
            <h3>Paleta de Colores</h3>

            <div class="color-row">
              <div class="color-info">
                <div class="color-label">Color de Dígitos y Texto</div>
                <div class="color-sub">Color principal de los números y fecha</div>
              </div>
              <input
                type="color"
                .value=${this._config.clockColor}
                @input=${(t) => this._updateConfig({ clockColor: t.target.value })}
              />
            </div>

            ${e ? n`
                  <div class="color-row">
                    <div class="color-info">
                      <div class="color-label">Color de Tarjetas / Bisel</div>
                      <div class="color-sub">
                        Fondo de las fichas en Flip, Roller y marco de LCD
                      </div>
                    </div>
                    <input
                      type="color"
                      .value=${this._config.cardColor}
                      @input=${(t) => this._updateConfig({ cardColor: t.target.value })}
                    />
                  </div>
                ` : l}

            <div class="color-row">
              <div class="color-info">
                <div class="color-label">Fondo del Reloj / Salvapantallas</div>
                <div class="color-sub">Fondo general detrás de los elementos</div>
              </div>
              <input
                type="color"
                .value=${this._config.bgColor}
                @input=${(t) => this._updateConfig({ bgColor: t.target.value })}
              />
            </div>

            <div class="actions-footer">
              <button class="reset-btn" @click=${this._resetDefaults}>
                <ha-icon icon="mdi:restore"></ha-icon>
                Restablecer predeterminados
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Fullscreen Modal Preview -->
      ${this._fullscreen ? n`
            <div
              class="fs-overlay"
              style="background-color: ${this._config.bgColor};"
              @click=${() => this._fullscreen = !1}
            >
              <div class="fs-dismiss-hint">Haz clic o toca para salir</div>
              <div class="fs-clock-wrap">${this._renderClockView(!0)}</div>
            </div>
          ` : l}
    `;
  }
  static {
    this.styles = oe`
    :host {
      display: block;
      color: var(--primary-text-color, #212121);
    }

    .settings-wrapper {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    /* Live Preview Card */
    .preview-card {
      background: var(--card-background-color, #fff);
      border-radius: var(--ha-card-border-radius, 14px);
      box-shadow: var(--ha-card-box-shadow, 0 4px 12px rgba(0, 0, 0, 0.08));
      overflow: hidden;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
    }

    .preview-header-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 18px;
      border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
      background: rgba(0, 0, 0, 0.02);
    }

    .preview-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
      font-size: 15px;
    }

    .live-tag {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.05em;
      padding: 3px 8px;
      border-radius: 6px;
      background: rgba(76, 175, 80, 0.15);
      color: #388e3c;
    }

    .fullscreen-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      font-weight: 500;
      padding: 6px 12px;
      border-radius: 8px;
      border: 1px solid var(--divider-color, #ddd);
      background: transparent;
      color: var(--primary-color, #03a9f4);
      cursor: pointer;
      transition: all 180ms ease;
    }

    .fullscreen-btn:hover {
      background: var(--primary-color, #03a9f4);
      color: #fff;
      border-color: transparent;
    }

    .preview-viewport {
      position: relative;
      min-height: 200px;
      padding: 32px 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.6);
      transition: background-color 250ms ease;
    }

    /* Clock Elements */
    .clock-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      user-select: none;
    }

    .clock-date {
      font-weight: 400;
      margin-top: 0.6em;
      letter-spacing: 0.02em;
      text-align: center;
    }

    /* Flip Clock */
    .flip-row,
    .roller-row {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .flip-card {
      position: relative;
      border-radius: 8px;
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.12);
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      box-sizing: border-box;
    }

    .flip-divider {
      position: absolute;
      left: 0;
      right: 0;
      top: 50%;
      height: 1px;
      background: rgba(0, 0, 0, 0.7);
      box-shadow: 0 1px 0 rgba(255, 255, 255, 0.08);
      pointer-events: none;
    }

    /* Roller Clock */
    .roller-card {
      position: relative;
      border-radius: 12px;
      box-shadow: inset 0 6px 8px -3px rgba(0, 0, 0, 0.8),
        inset 0 -6px 8px -3px rgba(0, 0, 0, 0.8), 0 6px 18px rgba(0, 0, 0, 0.45);
      border: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      box-sizing: border-box;
    }

    .colon {
      opacity: 0.85;
      margin: 0 2px;
    }

    .ampm-badge {
      align-self: flex-end;
      margin-bottom: 6px;
      padding: 3px 6px;
      border-radius: 4px;
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.1);
      font-weight: 700;
    }

    /* LCD Clock */
    .lcd-bezel {
      position: relative;
      border-radius: 10px;
      box-shadow: inset 0 3px 8px rgba(0, 0, 0, 0.85), 0 4px 14px rgba(0, 0, 0, 0.5);
      border: 2px solid rgba(255, 255, 255, 0.08);
      letter-spacing: 0.08em;
    }

    .lcd-ghost {
      pointer-events: none;
    }

    .lcd-active {
      position: absolute;
      left: 20px;
      top: 14px;
    }

    /* Digital Clock */
    .digital-time {
      letter-spacing: 0.02em;
    }

    .digital-ampm {
      font-size: 0.45em;
      opacity: 0.8;
      font-weight: 400;
      vertical-align: top;
      margin-left: 6px;
    }

    /* Options Sections */
    .options-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .section-card {
      background: var(--card-background-color, #fff);
      border-radius: var(--ha-card-border-radius, 14px);
      box-shadow: var(--ha-card-box-shadow, 0 2px 6px rgba(0, 0, 0, 0.06));
      padding: 20px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.06));
    }

    .section-card h3 {
      margin: 0 0 16px 0;
      font-size: 16px;
      font-weight: 500;
    }

    /* Style Grid */
    .style-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 12px;
    }

    .style-option {
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.03));
      border: 2px solid transparent;
      border-radius: 12px;
      padding: 16px 12px;
      text-align: center;
      cursor: pointer;
      transition: all 180ms ease;
    }

    .style-option:hover {
      background: rgba(3, 169, 244, 0.08);
    }

    .style-option.selected {
      border-color: var(--primary-color, #03a9f4);
      background: rgba(3, 169, 244, 0.12);
    }

    .style-icon {
      font-size: 28px;
      color: var(--primary-color, #03a9f4);
      margin-bottom: 6px;
    }

    .style-name {
      font-weight: 600;
      font-size: 14px;
      margin-bottom: 4px;
    }

    .style-desc {
      font-size: 11px;
      color: var(--secondary-text-color, #727272);
      line-height: 1.3;
    }

    /* Form Rows */
    .form-row {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: 16px;
    }

    .form-row:last-child {
      margin-bottom: 0;
    }

    .form-row label {
      font-size: 14px;
      font-weight: 500;
    }

    select {
      font: inherit;
      font-size: 14px;
      padding: 10px 14px;
      border-radius: 8px;
      border: 1px solid var(--divider-color, #ccc);
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
      outline: none;
    }

    select:focus {
      border-color: var(--primary-color, #03a9f4);
    }

    /* Toggles */
    .toggle-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 12px 0;
      border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.06));
    }

    .toggle-row:last-of-type {
      border-bottom: none;
    }

    .toggle-info {
      flex: 1;
    }

    .toggle-title {
      font-size: 14px;
      font-weight: 500;
    }

    .toggle-sub {
      font-size: 12px;
      color: var(--secondary-text-color, #727272);
      margin-top: 2px;
    }

    input[type="checkbox"] {
      width: 20px;
      height: 20px;
      accent-color: var(--primary-color, #03a9f4);
      cursor: pointer;
    }

    /* Slider */
    .slider-row {
      margin-top: 14px;
    }

    .slider-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .slider-value {
      font-weight: 600;
      color: var(--primary-color, #03a9f4);
    }

    input[type="range"] {
      width: 100%;
      accent-color: var(--primary-color, #03a9f4);
      cursor: pointer;
    }

    /* Color Rows */
    .color-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 12px 0;
      border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.06));
    }

    .color-row:last-of-type {
      border-bottom: none;
    }

    .color-info {
      flex: 1;
    }

    .color-label {
      font-size: 14px;
      font-weight: 500;
    }

    .color-sub {
      font-size: 12px;
      color: var(--secondary-text-color, #727272);
      margin-top: 2px;
    }

    input[type="color"] {
      width: 44px;
      height: 44px;
      padding: 0;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 8px;
      background: none;
      cursor: pointer;
    }

    input[type="color"]::-webkit-color-swatch-wrapper {
      padding: 4px;
    }

    input[type="color"]::-webkit-color-swatch {
      border: none;
      border-radius: 6px;
    }

    /* Footer */
    .actions-footer {
      margin-top: 16px;
      display: flex;
      justify-content: flex-end;
    }

    .reset-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      padding: 8px 14px;
      border-radius: 8px;
      border: 1px solid var(--divider-color, #ddd);
      background: transparent;
      color: var(--secondary-text-color, #666);
      cursor: pointer;
    }

    .reset-btn:hover {
      color: var(--error-color, #db4437);
      border-color: var(--error-color, #db4437);
    }

    /* Fullscreen Modal */
    .fs-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      user-select: none;
    }

    .fs-dismiss-hint {
      position: absolute;
      top: 24px;
      padding: 6px 14px;
      background: rgba(0, 0, 0, 0.4);
      color: rgba(255, 255, 255, 0.7);
      border-radius: 20px;
      font-size: 12px;
      letter-spacing: 0.03em;
    }

    .fs-clock-wrap {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `;
  }
}
ee([
  O({ attribute: !1 })
], W.prototype, "hass");
ee([
  f()
], W.prototype, "_config");
ee([
  f()
], W.prototype, "_now");
ee([
  f()
], W.prototype, "_fullscreen");
customElements.get("wakey-clock-settings") || customElements.define("wakey-clock-settings", W);
var at = Object.defineProperty, _ = (r, e, t, i) => {
  for (var s = void 0, o = r.length - 1, a; o >= 0; o--)
    (a = r[o]) && (s = a(e, t, s) || s);
  return s && at(e, t, s), s;
};
const nt = K.map((r, e) => ({ value: String(e), label: r }));
class v extends j {
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
    e.has("hass") && this.hass && !this._subscribed && (this._subscribed = !0, this._subscribe(), st().then((t) => this._haForm = t));
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
    this._editing = null, this._draft = { ...it(), weekdays: ["0", "1", "2", "3", "4"] }, this._dialogOpen = !0;
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
              { value: "once", label: "Once" },
              { value: "never", label: "Never (auto-delete)" }
            ]
          }
        }
      },
      ...e === "weekly" ? [{ name: "weekdays", selector: { select: { multiple: !0, options: nt } } }] : [{ name: "date", selector: { date: {} } }],
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
    return e ? n`
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
          ${this._adjusted(e) ? n`<button @click=${() => this._clearAdjust(e)}>
                Back to ${e.time}
              </button>` : l}
          <button @click=${() => this._adjusting = null}>Cancel</button>
          <button class="primary" @click=${this._saveAdjust}>Save</button>
        </div>
      </div>
    ` : l;
  }
  _renderAlarm(e) {
    const t = e.repeat === "once" ? e.date ?? "Once" : e.repeat === "never" ? e.date ? `${e.date} (Never)` : "Never (auto-delete)" : e.weekdays.length === 7 ? "Every day" : e.weekdays.length === 0 ? "No days selected" : e.weekdays.map((i) => K[i]).join(" ");
    return n`
      <div class="card ${e.enabled ? "" : "dim"}">
        <div class="row">
          <div class="time">${e.time}</div>
          <div class="grow">
            <div class="name">${e.name}</div>
            <div class="sub">${t}</div>
            <div class="sub">${e.media_player || "no player"}</div>
          </div>
          <div class="right">
            ${this._haForm ? n`<ha-switch
                  .checked=${e.enabled}
                  @change=${() => this._toggle(e)}
                ></ha-switch>` : n`<input
                  type="checkbox"
                  .checked=${e.enabled}
                  @change=${() => this._toggle(e)}
                />`}
            <div class="next">${this._fmtNext(e)}</div>
          </div>
        </div>
        ${e.is_ringing || e.is_snoozed || e.skip_next || this._adjusted(e) ? n`<div class="flags">
              ${e.is_ringing ? n`<span class="flag ring">Ringing</span>` : l}
              ${e.is_snoozed ? n`<span class="flag">Snoozed</span>` : l}
              ${e.skip_next ? n`<span class="flag">Skipping next</span>` : l}
              ${this._adjusted(e) ? n`<span class="flag">${this._fmtAdjusted(e)}</span>` : l}
            </div>` : l}
        ${n`<div class="actions">
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
    return e.length ? n`
      <div class="banner">
        <div class="grow">
          <strong>${e.map((t) => t.name).join(", ")}</strong>
          <div class="sub">${e[0].is_snoozed ? "Snoozed" : "Ringing now"}</div>
        </div>
        <button @click=${() => this._call({ type: "wakey/snooze" })}>Snooze</button>
        <button @click=${() => this._call({ type: "wakey/dismiss" })}>Dismiss</button>
      </div>
    ` : l;
  }
  _renderDialog() {
    if (!this._dialogOpen) return l;
    const e = this._draft.time ? String(this._draft.time).slice(0, 5) : "07:00", t = this._draft.name || "Alarma", i = this._draft.repeat === "once" ? this._draft.date || "Una vez" : this._draft.repeat === "never" ? this._draft.date ? `${this._draft.date} (Nunca)` : "Nunca (auto-borrado)" : this._draft.weekdays?.length === 7 ? "Todos los días" : this._draft.weekdays?.length ? this._draft.weekdays.map((s) => K[Number(s)]).join(" ") : "L M X J V";
    return n`
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
          ${this._draft.media_player ? n`<div class="preview-speaker"><ha-icon icon="mdi:speaker"></ha-icon> ${String(this._draft.media_player).replace("media_player.", "").replace(/_/g, " ")}</div>` : l}
        </div>

        ${this._haForm ? n`<ha-form
              .hass=${this.hass}
              .data=${this._draft}
              .schema=${this._schema()}
              .computeLabel=${this._label}
              @value-changed=${this._formChanged}
            ></ha-form>` : n`
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
    if (!this._testingAlarm) return l;
    const e = this._testingAlarm, t = e.repeat === "once" ? e.date ?? "Una vez" : e.repeat === "never" ? e.date ? `${e.date} (Nunca)` : "Nunca (auto-borrado)" : e.weekdays.length === 7 ? "Todos los días" : e.weekdays.length === 0 ? "Sin días" : e.weekdays.map((i) => K[i]).join(" ");
    return n`
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
    return this._canCreate ? n`<div class="empty">No alarms yet. Use Add alarm to create one.</div>` : n`<div class="empty">
        An administrator has not given you access to any speakers yet, so there is
        nowhere for an alarm to play.
      </div>`;
  }
  _renderAlarms() {
    return this._loaded ? this._alarms.length === 0 ? this._renderEmpty() : this._alarms.map((e) => this._renderAlarm(e)) : n`<div class="empty">Loading…</div>`;
  }
  render() {
    return n`
      <div class="header">
        <h1>Wakey</h1>
        <div class="tabs">
          <button
            class=${this._view === "alarms" ? "selected" : ""}
            @click=${() => this._view = "alarms"}
          >
            Alarmas
          </button>
          <button
            class=${this._view === "settings" ? "selected" : ""}
            @click=${() => this._view = "settings"}
          >
            Reloj y Ajustes
          </button>
          ${this._isAdmin ? n`<button
                class=${this._view === "admin" ? "selected" : ""}
                @click=${() => this._view = "admin"}
              >
                Personas
              </button>` : l}
        </div>
        ${this._view === "alarms" && this._canCreate ? n`<button class="primary" @click=${this._openNew}>Añadir alarma</button>` : l}
      </div>

      <div class="body">
        ${this._error ? n`<div class="error">${this._error}</div>` : l}
        ${this._view === "admin" ? n`<wakey-admin
              .hass=${this.hass}
              .alarms=${this._alarms}
              .haForm=${this._haForm}
            ></wakey-admin>` : this._view === "settings" ? n`<wakey-clock-settings
                .hass=${this.hass}
              ></wakey-clock-settings>` : n`${this._renderRinging()} ${this._renderAlarms()}`}
      </div>

      ${this._renderDialog()}
      ${this._adjusting ? this._renderAdjustDialog() : l}
      ${this._testingAlarm ? this._renderTestModal() : l}
    `;
  }
  static {
    this.styles = oe`
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
_([
  O({ attribute: !1 })
], v.prototype, "hass");
_([
  O({ attribute: !1 })
], v.prototype, "narrow");
_([
  f()
], v.prototype, "_alarms");
_([
  f()
], v.prototype, "_isAdmin");
_([
  f()
], v.prototype, "_allowedPlayers");
_([
  f()
], v.prototype, "_view");
_([
  f()
], v.prototype, "_loaded");
_([
  f()
], v.prototype, "_error");
_([
  f()
], v.prototype, "_dialogOpen");
_([
  f()
], v.prototype, "_editing");
_([
  f()
], v.prototype, "_draft");
_([
  f()
], v.prototype, "_adjusting");
_([
  f()
], v.prototype, "_adjustTime");
_([
  f()
], v.prototype, "_haForm");
_([
  f()
], v.prototype, "_testingAlarm");
customElements.get("wakey-panel") || customElements.define("wakey-panel", v);
