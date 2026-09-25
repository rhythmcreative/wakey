/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const H = globalThis, K = H.ShadowRoot && (H.ShadyCSS === void 0 || H.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Y = Symbol(), ie = /* @__PURE__ */ new WeakMap();
let ue = class {
  constructor(e, t, i) {
    if (this._$cssResult$ = !0, i !== Y) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (K && e === void 0) {
      const i = t !== void 0 && t.length === 1;
      i && (e = ie.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), i && ie.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const be = (r) => new ue(typeof r == "string" ? r : r + "", void 0, Y), Z = (r, ...e) => {
  const t = r.length === 1 ? r[0] : e.reduce((i, a, s) => i + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(a) + r[s + 1], r[0]);
  return new ue(t, r, Y);
}, ye = (r, e) => {
  if (K) r.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const i = document.createElement("style"), a = H.litNonce;
    a !== void 0 && i.setAttribute("nonce", a), i.textContent = t.cssText, r.appendChild(i);
  }
}, ae = K ? (r) => r : (r) => r instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const i of e.cssRules) t += i.cssText;
  return be(t);
})(r) : r;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: xe, defineProperty: we, getOwnPropertyDescriptor: $e, getOwnPropertyNames: ke, getOwnPropertySymbols: Ae, getPrototypeOf: Se } = Object, I = globalThis, re = I.trustedTypes, Ce = re ? re.emptyScript : "", Ee = I.reactiveElementPolyfillSupport, N = (r, e) => r, B = { toAttribute(r, e) {
  switch (e) {
    case Boolean:
      r = r ? Ce : null;
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
} }, X = (r, e) => !xe(r, e), se = { attribute: !0, type: String, converter: B, reflect: !1, useDefault: !1, hasChanged: X };
Symbol.metadata ??= Symbol("metadata"), I.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let E = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = se) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const i = Symbol(), a = this.getPropertyDescriptor(e, i, t);
      a !== void 0 && we(this.prototype, e, a);
    }
  }
  static getPropertyDescriptor(e, t, i) {
    const { get: a, set: s } = $e(this.prototype, e) ?? { get() {
      return this[t];
    }, set(o) {
      this[t] = o;
    } };
    return { get: a, set(o) {
      const c = a?.call(this);
      s?.call(this, o), this.requestUpdate(e, c, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? se;
  }
  static _$Ei() {
    if (this.hasOwnProperty(N("elementProperties"))) return;
    const e = Se(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(N("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(N("properties"))) {
      const t = this.properties, i = [...ke(t), ...Ae(t)];
      for (const a of i) this.createProperty(a, t[a]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [i, a] of t) this.elementProperties.set(i, a);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, i] of this.elementProperties) {
      const a = this._$Eu(t, i);
      a !== void 0 && this._$Eh.set(a, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const i = new Set(e.flat(1 / 0).reverse());
      for (const a of i) t.unshift(ae(a));
    } else e !== void 0 && t.push(ae(e));
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
    return ye(e, this.constructor.elementStyles), e;
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
    const i = this.constructor.elementProperties.get(e), a = this.constructor._$Eu(e, i);
    if (a !== void 0 && i.reflect === !0) {
      const s = (i.converter?.toAttribute !== void 0 ? i.converter : B).toAttribute(t, i.type);
      this._$Em = e, s == null ? this.removeAttribute(a) : this.setAttribute(a, s), this._$Em = null;
    }
  }
  _$AK(e, t) {
    const i = this.constructor, a = i._$Eh.get(e);
    if (a !== void 0 && this._$Em !== a) {
      const s = i.getPropertyOptions(a), o = typeof s.converter == "function" ? { fromAttribute: s.converter } : s.converter?.fromAttribute !== void 0 ? s.converter : B;
      this._$Em = a;
      const c = o.fromAttribute(t, s.type);
      this[a] = c ?? this._$Ej?.get(a) ?? c, this._$Em = null;
    }
  }
  requestUpdate(e, t, i, a = !1, s) {
    if (e !== void 0) {
      const o = this.constructor;
      if (a === !1 && (s = this[e]), i ??= o.getPropertyOptions(e), !((i.hasChanged ?? X)(s, t) || i.useDefault && i.reflect && s === this._$Ej?.get(e) && !this.hasAttribute(o._$Eu(e, i)))) return;
      this.C(e, t, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: i, reflect: a, wrapped: s }, o) {
    i && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, o ?? t ?? this[e]), s !== !0 || o !== void 0) || (this._$AL.has(e) || (this.hasUpdated || i || (t = void 0), this._$AL.set(e, t)), a === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
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
        for (const [a, s] of this._$Ep) this[a] = s;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [a, s] of i) {
        const { wrapped: o } = s, c = this[a];
        o !== !0 || this._$AL.has(a) || c === void 0 || this.C(a, void 0, s, c);
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
E.elementStyles = [], E.shadowRootOptions = { mode: "open" }, E[N("elementProperties")] = /* @__PURE__ */ new Map(), E[N("finalized")] = /* @__PURE__ */ new Map(), Ee?.({ ReactiveElement: E }), (I.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Q = globalThis, oe = (r) => r, F = Q.trustedTypes, ne = F ? F.createPolicy("lit-html", { createHTML: (r) => r }) : void 0, me = "$lit$", x = `lit$${Math.random().toFixed(9).slice(2)}$`, ge = "?" + x, ze = `<${ge}>`, C = document, O = () => C.createComment(""), j = (r) => r === null || typeof r != "object" && typeof r != "function", ee = Array.isArray, Pe = (r) => ee(r) || typeof r?.[Symbol.iterator] == "function", G = `[ 	
\f\r]`, T = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, le = /-->/g, de = />/g, k = RegExp(`>|${G}(?:([^\\s"'>=/]+)(${G}*=${G}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ce = /'/g, pe = /"/g, fe = /^(?:script|style|textarea|title)$/i, Te = (r) => (e, ...t) => ({ _$litType$: r, strings: e, values: t }), n = Te(1), z = Symbol.for("lit-noChange"), d = Symbol.for("lit-nothing"), he = /* @__PURE__ */ new WeakMap(), A = C.createTreeWalker(C, 129);
function ve(r, e) {
  if (!ee(r) || !r.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ne !== void 0 ? ne.createHTML(e) : e;
}
const Ne = (r, e) => {
  const t = r.length - 1, i = [];
  let a, s = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", o = T;
  for (let c = 0; c < t; c++) {
    const l = r[c];
    let h, u, p = -1, v = 0;
    for (; v < l.length && (o.lastIndex = v, u = o.exec(l), u !== null); ) v = o.lastIndex, o === T ? u[1] === "!--" ? o = le : u[1] !== void 0 ? o = de : u[2] !== void 0 ? (fe.test(u[2]) && (a = RegExp("</" + u[2], "g")), o = k) : u[3] !== void 0 && (o = k) : o === k ? u[0] === ">" ? (o = a ?? T, p = -1) : u[1] === void 0 ? p = -2 : (p = o.lastIndex - u[2].length, h = u[1], o = u[3] === void 0 ? k : u[3] === '"' ? pe : ce) : o === pe || o === ce ? o = k : o === le || o === de ? o = T : (o = k, a = void 0);
    const _ = o === k && r[c + 1].startsWith("/>") ? " " : "";
    s += o === T ? l + ze : p >= 0 ? (i.push(h), l.slice(0, p) + me + l.slice(p) + x + _) : l + x + (p === -2 ? c : _);
  }
  return [ve(r, s + (r[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), i];
};
class M {
  constructor({ strings: e, _$litType$: t }, i) {
    let a;
    this.parts = [];
    let s = 0, o = 0;
    const c = e.length - 1, l = this.parts, [h, u] = Ne(e, t);
    if (this.el = M.createElement(h, i), A.currentNode = this.el.content, t === 2 || t === 3) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (a = A.nextNode()) !== null && l.length < c; ) {
      if (a.nodeType === 1) {
        if (a.hasAttributes()) for (const p of a.getAttributeNames()) if (p.endsWith(me)) {
          const v = u[o++], _ = a.getAttribute(p).split(x), y = /([.?@])?(.*)/.exec(v);
          l.push({ type: 1, index: s, name: y[2], strings: _, ctor: y[1] === "." ? je : y[1] === "?" ? Me : y[1] === "@" ? Re : V }), a.removeAttribute(p);
        } else p.startsWith(x) && (l.push({ type: 6, index: s }), a.removeAttribute(p));
        if (fe.test(a.tagName)) {
          const p = a.textContent.split(x), v = p.length - 1;
          if (v > 0) {
            a.textContent = F ? F.emptyScript : "";
            for (let _ = 0; _ < v; _++) a.append(p[_], O()), A.nextNode(), l.push({ type: 2, index: ++s });
            a.append(p[v], O());
          }
        }
      } else if (a.nodeType === 8) if (a.data === ge) l.push({ type: 2, index: s });
      else {
        let p = -1;
        for (; (p = a.data.indexOf(x, p + 1)) !== -1; ) l.push({ type: 7, index: s }), p += x.length - 1;
      }
      s++;
    }
  }
  static createElement(e, t) {
    const i = C.createElement("template");
    return i.innerHTML = e, i;
  }
}
function P(r, e, t = r, i) {
  if (e === z) return e;
  let a = i !== void 0 ? t._$Co?.[i] : t._$Cl;
  const s = j(e) ? void 0 : e._$litDirective$;
  return a?.constructor !== s && (a?._$AO?.(!1), s === void 0 ? a = void 0 : (a = new s(r), a._$AT(r, t, i)), i !== void 0 ? (t._$Co ??= [])[i] = a : t._$Cl = a), a !== void 0 && (e = P(r, a._$AS(r, e.values), a, i)), e;
}
class Oe {
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
    const { el: { content: t }, parts: i } = this._$AD, a = (e?.creationScope ?? C).importNode(t, !0);
    A.currentNode = a;
    let s = A.nextNode(), o = 0, c = 0, l = i[0];
    for (; l !== void 0; ) {
      if (o === l.index) {
        let h;
        l.type === 2 ? h = new R(s, s.nextSibling, this, e) : l.type === 1 ? h = new l.ctor(s, l.name, l.strings, this, e) : l.type === 6 && (h = new De(s, this, e)), this._$AV.push(h), l = i[++c];
      }
      o !== l?.index && (s = A.nextNode(), o++);
    }
    return A.currentNode = C, a;
  }
  p(e) {
    let t = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(e, i, t), t += i.strings.length - 2) : i._$AI(e[t])), t++;
  }
}
class R {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, t, i, a) {
    this.type = 2, this._$AH = d, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = i, this.options = a, this._$Cv = a?.isConnected ?? !0;
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
    e = P(this, e, t), j(e) ? e === d || e == null || e === "" ? (this._$AH !== d && this._$AR(), this._$AH = d) : e !== this._$AH && e !== z && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Pe(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== d && j(this._$AH) ? this._$AA.nextSibling.data = e : this.T(C.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: t, _$litType$: i } = e, a = typeof i == "number" ? this._$AC(e) : (i.el === void 0 && (i.el = M.createElement(ve(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === a) this._$AH.p(t);
    else {
      const s = new Oe(a, this), o = s.u(this.options);
      s.p(t), this.T(o), this._$AH = s;
    }
  }
  _$AC(e) {
    let t = he.get(e.strings);
    return t === void 0 && he.set(e.strings, t = new M(e)), t;
  }
  k(e) {
    ee(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let i, a = 0;
    for (const s of e) a === t.length ? t.push(i = new R(this.O(O()), this.O(O()), this, this.options)) : i = t[a], i._$AI(s), a++;
    a < t.length && (this._$AR(i && i._$AB.nextSibling, a), t.length = a);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    for (this._$AP?.(!1, !0, t); e !== this._$AB; ) {
      const i = oe(e).nextSibling;
      oe(e).remove(), e = i;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class V {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, i, a, s) {
    this.type = 1, this._$AH = d, this._$AN = void 0, this.element = e, this.name = t, this._$AM = a, this.options = s, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = d;
  }
  _$AI(e, t = this, i, a) {
    const s = this.strings;
    let o = !1;
    if (s === void 0) e = P(this, e, t, 0), o = !j(e) || e !== this._$AH && e !== z, o && (this._$AH = e);
    else {
      const c = e;
      let l, h;
      for (e = s[0], l = 0; l < s.length - 1; l++) h = P(this, c[i + l], t, l), h === z && (h = this._$AH[l]), o ||= !j(h) || h !== this._$AH[l], h === d ? e = d : e !== d && (e += (h ?? "") + s[l + 1]), this._$AH[l] = h;
    }
    o && !a && this.j(e);
  }
  j(e) {
    e === d ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class je extends V {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === d ? void 0 : e;
  }
}
class Me extends V {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== d);
  }
}
class Re extends V {
  constructor(e, t, i, a, s) {
    super(e, t, i, a, s), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = P(this, e, t, 0) ?? d) === z) return;
    const i = this._$AH, a = e === d && i !== d || e.capture !== i.capture || e.once !== i.once || e.passive !== i.passive, s = e !== d && (i === d || a);
    a && this.element.removeEventListener(this.name, this, i), s && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class De {
  constructor(e, t, i) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    P(this, e);
  }
}
const Ue = Q.litHtmlPolyfillSupport;
Ue?.(M, R), (Q.litHtmlVersions ??= []).push("3.3.3");
const He = (r, e, t) => {
  const i = t?.renderBefore ?? e;
  let a = i._$litPart$;
  if (a === void 0) {
    const s = t?.renderBefore ?? null;
    i._$litPart$ = a = new R(e.insertBefore(O(), s), s, void 0, t ?? {});
  }
  return a._$AI(r), a;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const te = globalThis;
class S extends E {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = He(t, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return z;
  }
}
S._$litElement$ = !0, S.finalized = !0, te.litElementHydrateSupport?.({ LitElement: S });
const Le = te.litElementPolyfillSupport;
Le?.({ LitElement: S });
(te.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Be = { attribute: !0, type: String, converter: B, reflect: !1, hasChanged: X }, Fe = (r = Be, e, t) => {
  const { kind: i, metadata: a } = t;
  let s = globalThis.litPropertyMetadata.get(a);
  if (s === void 0 && globalThis.litPropertyMetadata.set(a, s = /* @__PURE__ */ new Map()), i === "setter" && ((r = Object.create(r)).wrapped = !0), s.set(t.name, r), i === "accessor") {
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
function w(r) {
  return (e, t) => typeof t == "object" ? Fe(r, e, t) : ((i, a, s) => {
    const o = a.hasOwnProperty(s);
    return a.constructor.createProperty(s, i), o ? Object.getOwnPropertyDescriptor(a, s) : void 0;
  })(r, e, t);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function m(r) {
  return w({ ...r, state: !0, attribute: !1 });
}
const L = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], Ie = () => ({
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
async function Ve() {
  try {
    await (await (await window.loadCardHelpers?.())?.createCardElement({ type: "entities", entities: [] }))?.constructor?.getConfigElement?.();
  } catch {
  }
  return Promise.race([
    customElements.whenDefined("ha-form").then(() => !0),
    new Promise((r) => setTimeout(() => r(!1), 4e3))
  ]);
}
var We = Object.defineProperty, $ = (r, e, t, i) => {
  for (var a = void 0, s = r.length - 1, o; s >= 0; s--)
    (o = r[s]) && (a = o(e, t, a) || a);
  return a && We(e, t, a), a;
};
class b extends S {
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
        ${e.is_admin ? d : n`
              <div class="form">
                ${this.haForm ? n`<ha-form
                      .hass=${this.hass}
                      .data=${{ allowed_media_players: t }}
                      .schema=${this._policySchema()}
                      .computeLabel=${() => "Allowed speakers"}
                      @value-changed=${(a) => this._policyChanged(e, a)}
                    ></ha-form>` : n`<label>
                      Allowed speakers (comma separated)
                      <input
                        .value=${t.join(", ")}
                        @change=${(a) => this._policyChanged(e, {
      detail: {
        value: {
          allowed_media_players: a.target.value.split(",").map((s) => s.trim()).filter(Boolean)
        }
      }
    })}
                      />
                    </label>`}
              </div>
              ${i.length ? n`<div class="warn">
                    ${i.length} of ${e.name}'s alarms use a speaker they can
                    no longer choose:
                    ${i.map((a) => `${a.name} (${a.media_player})`).join(", ")}.
                    They will still go off — reassign or delete them.
                  </div>` : d}
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
          </div>` : d}
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
    ` : d;
  }
  render() {
    return this._loaded ? n`
      ${this._error ? n`<div class="error">${this._error}</div>` : d}
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
    this.styles = Z`
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
  w({ attribute: !1 })
], b.prototype, "hass");
$([
  w({ attribute: !1 })
], b.prototype, "alarms");
$([
  w({ attribute: !1 })
], b.prototype, "haForm");
$([
  m()
], b.prototype, "_users");
$([
  m()
], b.prototype, "_policies");
$([
  m()
], b.prototype, "_orphans");
$([
  m()
], b.prototype, "_error");
$([
  m()
], b.prototype, "_loaded");
customElements.get("wakey-admin") || customElements.define("wakey-admin", b);
var Ge = Object.defineProperty, W = (r, e, t, i) => {
  for (var a = void 0, s = r.length - 1, o; s >= 0; s--)
    (o = r[s]) && (a = o(e, t, a) || a);
  return a && Ge(e, t, a), a;
};
const q = {
  style: "official",
  font: "Google Sans",
  weight: "400",
  is24h: !0,
  showSpeaker: !0,
  showIcon: !0,
  glow: !1,
  scale: 100,
  timeColor: "#f7f6f2",
  cardBgColor: "#282a2d",
  badgeBgColor: "#c3e8cd",
  badgeTextColor: "#137333",
  textColor: "#e8eaed",
  subColor: "#dadce0",
  pageBgColor: "#1e1f22"
}, J = "wakey_alarm_appearance";
function qe() {
  try {
    const r = localStorage.getItem(J);
    if (r)
      return { ...q, ...JSON.parse(r) };
  } catch {
  }
  return { ...q };
}
class D extends S {
  constructor() {
    super(...arguments), this.alarms = [], this._config = qe(), this._previewMode = "single";
  }
  connectedCallback() {
    super.connectedCallback(), this._loadGoogleFonts();
  }
  _loadGoogleFonts() {
    if (!document.getElementById("wakey-google-alarm-fonts")) {
      const e = document.createElement("link");
      e.id = "wakey-google-alarm-fonts", e.rel = "stylesheet", e.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&family=Nunito:wght@300;400;500;700&family=Oswald:wght@300;400;500;700&family=Roboto+Slab:wght@300;400;500;700&family=Rubik:wght@300;400;500;700&display=swap", document.head.appendChild(e);
    }
  }
  _updateConfig(e) {
    this._config = { ...this._config, ...e };
    try {
      localStorage.setItem(J, JSON.stringify(this._config)), window.dispatchEvent(
        new CustomEvent("wakey-appearance-changed", {
          detail: { config: this._config }
        })
      );
    } catch (t) {
      console.error("Failed to save appearance config", t);
    }
    this.requestUpdate();
  }
  _resetDefaults() {
    this._config = { ...q };
    try {
      localStorage.setItem(J, JSON.stringify(this._config)), window.dispatchEvent(
        new CustomEvent("wakey-appearance-changed", {
          detail: { config: this._config }
        })
      );
    } catch (e) {
      console.error("Failed to reset appearance config", e);
    }
    this.requestUpdate();
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
  // --- Render Previews ---------------------------------------------------
  /**
   * Renders the single alarm card matching assets/alarm.png
   */
  _renderSingleAlarmCard() {
    const {
      font: e,
      weight: t,
      showSpeaker: i,
      showIcon: a,
      glow: s,
      scale: o,
      timeColor: c,
      cardBgColor: l,
      badgeBgColor: h,
      badgeTextColor: u,
      textColor: p,
      subColor: v
    } = this._config, _ = this._getFontFamily(e), U = `calc(4.5rem * ${Math.max(0.7, Math.min(1.4, o / 100))})`, _e = s ? "text-shadow: 0 0 15px rgba(255, 255, 255, 0.45);" : "";
    return n`
      <div
        class="alarm-card-official single-preview"
        style="
          background-color: ${l};
          font-family: ${_};
        "
      >
        <!-- Header -->
        <div class="alarm-header-row">
          <div class="alarm-title-group">
            ${a ? n`
                  <div class="alarm-circle-icon">
                    <ha-icon icon="mdi:alarm"></ha-icon>
                  </div>
                ` : d}
            <span class="alarm-name" style="color: ${p};"
              >Despertador</span
            >
          </div>
          <span
            class="alarm-pill-badge"
            style="
              background-color: ${h};
              color: ${u};
            "
          >
            PROGRAMADA
          </span>
        </div>

        <!-- Time -->
        <div
          class="alarm-time-large"
          style="
            color: ${c};
            font-weight: ${t};
            font-size: ${U};
            ${_e}
          "
        >
          07:30
        </div>

        <!-- Days -->
        <div class="alarm-days-label" style="color: ${p};">
          Lunes a Viernes
        </div>

        <!-- Speaker -->
        ${i ? n`
              <div class="alarm-speaker-row" style="color: ${v};">
                <ha-icon icon="mdi:volume-high"></ha-icon>
                <span>Altavoz: Salón</span>
              </div>
            ` : d}
      </div>
    `;
  }
  /**
   * Renders the alarm list matching assets/alarm_list.png
   */
  _renderListAlarmCard() {
    const {
      font: e,
      weight: t,
      showIcon: i,
      glow: a,
      scale: s,
      timeColor: o,
      cardBgColor: c,
      badgeBgColor: l,
      badgeTextColor: h,
      textColor: u,
      subColor: p
    } = this._config, v = this._getFontFamily(e), y = `calc(2.5rem * ${Math.max(0.7, Math.min(1.4, s / 100))})`, U = a ? "text-shadow: 0 0 10px rgba(255, 255, 255, 0.4);" : "";
    return n`
      <div
        class="alarm-card-official list-preview"
        style="
          background-color: ${c};
          font-family: ${v};
        "
      >
        <!-- Header -->
        <div class="alarm-header-row list-header">
          <div class="alarm-title-group">
            ${i ? n`
                  <div class="alarm-circle-icon">
                    <ha-icon icon="mdi:alarm"></ha-icon>
                  </div>
                ` : d}
            <span class="alarm-name" style="color: ${u};"
              >Tus Alarmas</span
            >
          </div>
          <span class="alarm-pill-badge counter-badge"> 2 activas </span>
        </div>

        <!-- Row 1 -->
        <div class="alarm-list-row">
          <div
            class="list-time"
            style="
              color: ${o};
              font-weight: ${t};
              font-size: ${y};
              ${U}
            "
          >
            07:00
          </div>
          <div class="list-details" style="color: ${u};">
            Despertador • Lun-Vie
          </div>
          <span
            class="alarm-pill-badge active-tag"
            style="
              background-color: ${l};
              color: ${h};
            "
          >
            ACTIVA
          </span>
        </div>

        <!-- Row 2 -->
        <div class="alarm-list-row">
          <div
            class="list-time"
            style="
              color: ${o};
              font-weight: ${t};
              font-size: ${y};
              ${U}
            "
          >
            08:30
          </div>
          <div class="list-details" style="color: ${u};">
            Gimnasio • Sáb, Dom
          </div>
          <span
            class="alarm-pill-badge active-tag"
            style="
              background-color: ${l};
              color: ${h};
            "
          >
            ACTIVA
          </span>
        </div>
      </div>
    `;
  }
  /**
   * Renders the ringing alarm view
   */
  _renderRingingAlarmCard() {
    const { font: e, weight: t, cardBgColor: i, timeColor: a, textColor: s, subColor: o } = this._config, c = this._getFontFamily(e);
    return n`
      <div
        class="alarm-card-official single-preview ringing-preview"
        style="
          background-color: ${i};
          font-family: ${c};
          border: 2px solid #db4437;
        "
      >
        <div class="alarm-header-row">
          <div class="alarm-title-group">
            <div class="alarm-circle-icon ringing-pulse">
              <ha-icon icon="mdi:bell-ring"></ha-icon>
            </div>
            <span class="alarm-name" style="color: ${s};"
              >Alarma matutina</span
            >
          </div>
          <span class="alarm-pill-badge ringing-badge"> SONANDO AHORA </span>
        </div>

        <div
          class="alarm-time-large"
          style="color: ${a}; font-weight: ${t}; font-size: 4.5rem;"
        >
          07:30
        </div>

        <div class="alarm-days-label" style="color: ${s};">
          Lunes a Viernes
        </div>

        <div class="alarm-speaker-row" style="color: ${o};">
          <ha-icon icon="mdi:volume-high"></ha-icon>
          <span>Altavoz: Salón</span>
        </div>

        <div class="ringing-actions-bar">
          <button class="ring-btn snooze">
            <ha-icon icon="mdi:snooze"></ha-icon> Posponer 9 min
          </button>
          <button class="ring-btn dismiss">
            <ha-icon icon="mdi:alarm-off"></ha-icon> Apagar
          </button>
        </div>
      </div>
    `;
  }
  render() {
    return n`
      <div class="appearance-wrapper">
        <!-- Live Preview Showcase -->
        <div class="showcase-card">
          <div class="showcase-header">
            <div class="showcase-title">
              <ha-icon icon="mdi:palette-outline"></ha-icon>
              <span>Vista Previa del Diseño de Alarmas</span>
            </div>

            <!-- View Switcher -->
            <div class="view-switcher">
              <button
                class=${this._previewMode === "single" ? "active" : ""}
                @click=${() => this._previewMode = "single"}
              >
                <ha-icon icon="mdi:card-bulleted"></ha-icon>
                <span>Individual (Oficial)</span>
              </button>
              <button
                class=${this._previewMode === "list" ? "active" : ""}
                @click=${() => this._previewMode = "list"}
              >
                <ha-icon icon="mdi:format-list-bulleted"></ha-icon>
                <span>Lista</span>
              </button>
              <button
                class=${this._previewMode === "ringing" ? "active" : ""}
                @click=${() => this._previewMode = "ringing"}
              >
                <ha-icon icon="mdi:bell-ring"></ha-icon>
                <span>Sonando</span>
              </button>
            </div>
          </div>

          <!-- Preview Stage with Canvas -->
          <div
            class="preview-stage"
            style="background-color: ${this._config.pageBgColor};"
          >
            ${this._previewMode === "single" ? this._renderSingleAlarmCard() : this._previewMode === "list" ? this._renderListAlarmCard() : this._renderRingingAlarmCard()}
          </div>
        </div>

        <!-- Controls Section -->
        <div class="controls-grid">
          <!-- Typography & Scale -->
          <div class="settings-card">
            <h3>Tipografía y Estilo de Hora</h3>

            <div class="control-row">
              <label for="font-select">Familia tipográfica</label>
              <select
                id="font-select"
                .value=${this._config.font}
                @change=${(e) => this._updateConfig({ font: e.target.value })}
              >
                <option value="Google Sans">Google Sans (Oficial Google)</option>
                <option value="Inter">Inter (Moderna y Limpia)</option>
                <option value="Rubik">Rubik (Geométrica Suave)</option>
                <option value="Nunito">Nunito (Estilo iOS / StandBy)</option>
                <option value="Oswald">Oswald (Números Grandes Display)</option>
                <option value="Roboto Slab">Roboto Slab (Con serifa)</option>
                <option value="monospace">Monospace (Dígitos Retro)</option>
              </select>
            </div>

            <div class="control-row">
              <label for="weight-select">Grosor de la hora</label>
              <select
                id="weight-select"
                .value=${this._config.weight}
                @change=${(e) => this._updateConfig({ weight: e.target.value })}
              >
                <option value="300">300 (Fino / Light)</option>
                <option value="400">400 (Regular / Normal)</option>
                <option value="500">500 (Medio)</option>
                <option value="700">700 (Negrita / Bold)</option>
              </select>
            </div>

            <div class="control-row slider-container">
              <div class="slider-title-row">
                <label>Tamaño / Escala de la tarjeta</label>
                <span class="slider-val">${this._config.scale}%</span>
              </div>
              <input
                type="range"
                min="75"
                max="135"
                step="5"
                .value=${String(this._config.scale)}
                @input=${(e) => this._updateConfig({ scale: Number(e.target.value) })}
              />
            </div>
          </div>

          <!-- Color Customizer -->
          <div class="settings-card">
            <h3>Colores y Temas</h3>

            <div class="color-picker-item">
              <div class="color-text">
                <div class="color-name">Fondo de la tarjeta</div>
                <div class="color-desc">Color principal del recuadro (#282a2d)</div>
              </div>
              <input
                type="color"
                .value=${this._config.cardBgColor}
                @input=${(e) => this._updateConfig({ cardBgColor: e.target.value })}
              />
            </div>

            <div class="color-picker-item">
              <div class="color-text">
                <div class="color-name">Dígitos de la hora</div>
                <div class="color-desc">Color numérico destacado (#f7f6f2)</div>
              </div>
              <input
                type="color"
                .value=${this._config.timeColor}
                @input=${(e) => this._updateConfig({ timeColor: e.target.value })}
              />
            </div>

            <div class="color-picker-item">
              <div class="color-text">
                <div class="color-name">Fondo de etiqueta "PROGRAMADA"</div>
                <div class="color-desc">Color de la pastilla (#c3e8cd)</div>
              </div>
              <input
                type="color"
                .value=${this._config.badgeBgColor}
                @input=${(e) => this._updateConfig({ badgeBgColor: e.target.value })}
              />
            </div>

            <div class="color-picker-item">
              <div class="color-text">
                <div class="color-name">Texto de etiqueta "PROGRAMADA"</div>
                <div class="color-desc">Color de la letra interior (#137333)</div>
              </div>
              <input
                type="color"
                .value=${this._config.badgeTextColor}
                @input=${(e) => this._updateConfig({ badgeTextColor: e.target.value })}
              />
            </div>

            <div class="color-picker-item">
              <div class="color-text">
                <div class="color-name">Fondo de página</div>
                <div class="color-desc">Fondo exterior de la interfaz (#1e1f22)</div>
              </div>
              <input
                type="color"
                .value=${this._config.pageBgColor}
                @input=${(e) => this._updateConfig({ pageBgColor: e.target.value })}
              />
            </div>
          </div>

          <!-- Elements & Toggles -->
          <div class="settings-card">
            <h3>Elementos Visibles</h3>

            <div class="toggle-item">
              <div class="toggle-text">
                <div class="toggle-name">Icono circular de alarma</div>
                <div class="toggle-desc">Muestra el icono redondeado en la cabecera</div>
              </div>
              <input
                type="checkbox"
                .checked=${this._config.showIcon}
                @change=${(e) => this._updateConfig({ showIcon: e.target.checked })}
              />
            </div>

            <div class="toggle-item">
              <div class="toggle-text">
                <div class="toggle-name">Altavoz asignado</div>
                <div class="toggle-desc">Muestra el altavoz o reproductor de destino</div>
              </div>
              <input
                type="checkbox"
                .checked=${this._config.showSpeaker}
                @change=${(e) => this._updateConfig({ showSpeaker: e.target.checked })}
              />
            </div>

            <div class="toggle-item">
              <div class="toggle-text">
                <div class="toggle-name">Resplandor suave (Glow)</div>
                <div class="toggle-desc">Ligera aura luminosa en la hora</div>
              </div>
              <input
                type="checkbox"
                .checked=${this._config.glow}
                @change=${(e) => this._updateConfig({ glow: e.target.checked })}
              />
            </div>

            <div class="footer-buttons">
              <button class="btn-restore" @click=${this._resetDefaults}>
                <ha-icon icon="mdi:restore"></ha-icon>
                Restablecer diseño oficial (alarm.png)
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  static {
    this.styles = Z`
    :host {
      display: block;
      color: var(--primary-text-color, #212121);
    }

    .appearance-wrapper {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    /* Showcase Card */
    .showcase-card {
      background: var(--card-background-color, #fff);
      border-radius: 18px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
      overflow: hidden;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
    }

    .showcase-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
      padding: 14px 20px;
      background: rgba(0, 0, 0, 0.02);
      border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.06));
    }

    .showcase-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 15px;
      font-weight: 600;
    }

    .showcase-title ha-icon {
      color: var(--primary-color, #03a9f4);
    }

    .view-switcher {
      display: flex;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.05));
      border-radius: 10px;
      padding: 3px;
      gap: 4px;
    }

    .view-switcher button {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      padding: 6px 12px;
      border-radius: 8px;
      border: none;
      background: transparent;
      color: var(--secondary-text-color, #666);
      cursor: pointer;
      font-weight: 500;
      transition: all 180ms ease;
    }

    .view-switcher button.active {
      background: var(--card-background-color, #fff);
      color: var(--primary-color, #03a9f4);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
      font-weight: 600;
    }

    .preview-stage {
      padding: 40px 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 380px;
      transition: background-color 250ms ease;
    }

    /* Official Alarm Card matching assets/alarm.png */
    .alarm-card-official {
      border-radius: 28px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
      box-sizing: border-box;
      user-select: none;
    }

    .alarm-card-official.single-preview {
      width: 100%;
      max-width: 520px;
      padding: 36px 40px 32px 40px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .alarm-header-row {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
    }

    .alarm-title-group {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .alarm-circle-icon {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #e8eaed;
    }

    .alarm-circle-icon ha-icon {
      --mdc-icon-size: 24px;
    }

    .alarm-name {
      font-size: 22px;
      font-weight: 400;
      letter-spacing: -0.01em;
    }

    .alarm-pill-badge {
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.06em;
      padding: 6px 16px;
      border-radius: 20px;
      text-transform: uppercase;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
    }

    .alarm-time-large {
      line-height: 1;
      letter-spacing: -0.03em;
      font-variant-numeric: tabular-nums;
      margin: 12px 0 16px 0;
    }

    .alarm-days-label {
      font-size: 24px;
      font-weight: 400;
      letter-spacing: -0.01em;
      margin-bottom: 16px;
    }

    .alarm-speaker-row {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 19px;
      font-weight: 400;
    }

    .alarm-speaker-row ha-icon {
      --mdc-icon-size: 22px;
    }

    /* List Card Preview matching assets/alarm_list.png */
    .alarm-card-official.list-preview {
      width: 100%;
      max-width: 540px;
      padding: 24px 28px;
    }

    .list-header {
      padding-bottom: 18px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      margin-bottom: 8px;
    }

    .counter-badge {
      background: rgba(255, 255, 255, 0.12);
      color: #e8eaed;
      text-transform: none;
      font-weight: 500;
      font-size: 14px;
    }

    .alarm-list-row {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 20px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .alarm-list-row:last-child {
      border-bottom: none;
      padding-bottom: 8px;
    }

    .list-time {
      line-height: 1;
      font-variant-numeric: tabular-nums;
      letter-spacing: -0.02em;
      min-width: 120px;
    }

    .list-details {
      flex: 1;
      font-size: 18px;
      font-weight: 400;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .active-tag {
      font-size: 12px;
      padding: 5px 14px;
    }

    /* Ringing Preview Actions */
    .ringing-actions-bar {
      display: flex;
      gap: 12px;
      margin-top: 24px;
      width: 100%;
    }

    .ring-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 18px;
      border-radius: 12px;
      font-size: 15px;
      font-weight: 600;
      border: none;
      cursor: pointer;
    }

    .ring-btn.snooze {
      background: rgba(255, 255, 255, 0.15);
      color: #fff;
    }

    .ring-btn.dismiss {
      background: #db4437;
      color: #fff;
    }

    .ringing-pulse {
      animation: ring-pulse 1.3s infinite ease-in-out;
      background: rgba(219, 68, 55, 0.25);
      color: #db4437;
    }

    .ringing-badge {
      background: #db4437;
      color: #fff;
    }

    @keyframes ring-pulse {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.1);
      }
      100% {
        transform: scale(1);
      }
    }

    /* Controls Grid */
    .controls-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 16px;
    }

    .settings-card {
      background: var(--card-background-color, #fff);
      border-radius: 14px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
      padding: 20px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.06));
    }

    .settings-card h3 {
      margin: 0 0 16px 0;
      font-size: 16px;
      font-weight: 600;
    }

    .control-row {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: 16px;
    }

    .control-row label {
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

    /* Slider */
    .slider-title-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }

    .slider-val {
      font-weight: 600;
      color: var(--primary-color, #03a9f4);
    }

    input[type="range"] {
      width: 100%;
      accent-color: var(--primary-color, #03a9f4);
      cursor: pointer;
    }

    /* Color Item */
    .color-picker-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 10px 0;
      border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.06));
    }

    .color-picker-item:last-of-type {
      border-bottom: none;
    }

    .color-text {
      flex: 1;
    }

    .color-name {
      font-size: 14px;
      font-weight: 500;
    }

    .color-desc {
      font-size: 12px;
      color: var(--secondary-text-color, #727272);
      margin-top: 2px;
    }

    input[type="color"] {
      width: 40px;
      height: 40px;
      padding: 0;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 8px;
      background: none;
      cursor: pointer;
    }

    input[type="color"]::-webkit-color-swatch-wrapper {
      padding: 3px;
    }

    input[type="color"]::-webkit-color-swatch {
      border: none;
      border-radius: 6px;
    }

    /* Toggle Item */
    .toggle-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 12px 0;
      border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.06));
    }

    .toggle-item:last-of-type {
      border-bottom: none;
    }

    .toggle-text {
      flex: 1;
    }

    .toggle-name {
      font-size: 14px;
      font-weight: 500;
    }

    .toggle-desc {
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

    /* Footer Buttons */
    .footer-buttons {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
    }

    .btn-restore {
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
      transition: all 180ms ease;
    }

    .btn-restore:hover {
      color: var(--primary-color, #03a9f4);
      border-color: var(--primary-color, #03a9f4);
    }
  `;
  }
}
W([
  w({ attribute: !1 })
], D.prototype, "hass");
W([
  w({ attribute: !1 })
], D.prototype, "alarms");
W([
  m()
], D.prototype, "_config");
W([
  m()
], D.prototype, "_previewMode");
customElements.get("wakey-alarm-settings") || customElements.define("wakey-alarm-settings", D);
var Je = Object.defineProperty, f = (r, e, t, i) => {
  for (var a = void 0, s = r.length - 1, o; s >= 0; s--)
    (o = r[s]) && (a = o(e, t, a) || a);
  return a && Je(e, t, a), a;
};
const Ke = L.map((r, e) => ({ value: String(e), label: r }));
class g extends S {
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
    e.has("hass") && this.hass && !this._subscribed && (this._subscribed = !0, this._subscribe(), Ve().then((t) => this._haForm = t));
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
    this._editing = null, this._draft = { ...Ie(), weekdays: ["0", "1", "2", "3", "4"] }, this._dialogOpen = !0;
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
      ...e === "weekly" ? [{ name: "weekdays", selector: { select: { multiple: !0, options: Ke } } }] : [{ name: "date", selector: { date: {} } }],
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
    const a = Math.floor(i / 60);
    return a < 24 ? `in ${a}h ${i % 60}m` : t.toLocaleDateString(void 0, { weekday: "long" });
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
              </button>` : d}
          <button @click=${() => this._adjusting = null}>Cancel</button>
          <button class="primary" @click=${this._saveAdjust}>Save</button>
        </div>
      </div>
    ` : d;
  }
  _renderAlarm(e) {
    const t = e.repeat === "once" ? e.date ?? "Once" : e.repeat === "never" ? e.date ? `${e.date} (Never)` : "Never (auto-delete)" : e.weekdays.length === 7 ? "Every day" : e.weekdays.length === 0 ? "No days selected" : e.weekdays.map((i) => L[i]).join(" ");
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
              ${e.is_ringing ? n`<span class="flag ring">Ringing</span>` : d}
              ${e.is_snoozed ? n`<span class="flag">Snoozed</span>` : d}
              ${e.skip_next ? n`<span class="flag">Skipping next</span>` : d}
              ${this._adjusted(e) ? n`<span class="flag">${this._fmtAdjusted(e)}</span>` : d}
            </div>` : d}
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
    ` : d;
  }
  _renderDialog() {
    if (!this._dialogOpen) return d;
    const e = this._draft.time ? String(this._draft.time).slice(0, 5) : "07:00", t = this._draft.name || "Alarma", i = this._draft.repeat === "once" ? this._draft.date || "Una vez" : this._draft.repeat === "never" ? this._draft.date ? `${this._draft.date} (Nunca)` : "Nunca (auto-borrado)" : this._draft.weekdays?.length === 7 ? "Todos los días" : this._draft.weekdays?.length ? this._draft.weekdays.map((a) => L[Number(a)]).join(" ") : "L M X J V";
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
          ${this._draft.media_player ? n`<div class="preview-speaker"><ha-icon icon="mdi:speaker"></ha-icon> ${String(this._draft.media_player).replace("media_player.", "").replace(/_/g, " ")}</div>` : d}
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
              <label>Name<input .value=${this._draft.name ?? ""} @input=${(a) => this._draft = { ...this._draft, name: a.target.value }} /></label>
              <label>Time<input type="time" .value=${this._draft.time ?? "07:00"} @input=${(a) => this._draft = { ...this._draft, time: a.target.value }} /></label>
              <label>Media player<input .value=${this._draft.media_player ?? ""} @input=${(a) => this._draft = { ...this._draft, media_player: a.target.value }} /></label>
              <label>Source<input .value=${this._draft.source_uri ?? ""} @input=${(a) => this._draft = { ...this._draft, source_uri: a.target.value }} /></label>
            `}
        <div class="dialog-actions">
          <button @click=${this._closeDialog}>Cancel</button>
          <button class="primary" @click=${this._save}>Save</button>
        </div>
      </div>
    `;
  }
  _renderTestModal() {
    if (!this._testingAlarm) return d;
    const e = this._testingAlarm, t = e.repeat === "once" ? e.date ?? "Una vez" : e.repeat === "never" ? e.date ? `${e.date} (Nunca)` : "Nunca (auto-borrado)" : e.weekdays.length === 7 ? "Todos los días" : e.weekdays.length === 0 ? "Sin días" : e.weekdays.map((i) => L[i]).join(" ");
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
            Ajustes de Alarmas
          </button>
          ${this._isAdmin ? n`<button
                class=${this._view === "admin" ? "selected" : ""}
                @click=${() => this._view = "admin"}
              >
                Personas
              </button>` : d}
        </div>
        ${this._view === "alarms" && this._canCreate ? n`<button class="primary" @click=${this._openNew}>Añadir alarma</button>` : d}
      </div>

      <div class="body">
        ${this._error ? n`<div class="error">${this._error}</div>` : d}
        ${this._view === "admin" ? n`<wakey-admin
              .hass=${this.hass}
              .alarms=${this._alarms}
              .haForm=${this._haForm}
            ></wakey-admin>` : this._view === "settings" ? n`<wakey-alarm-settings
                .hass=${this.hass}
                .alarms=${this._alarms}
              ></wakey-alarm-settings>` : n`${this._renderRinging()} ${this._renderAlarms()}`}
      </div>

      ${this._renderDialog()}
      ${this._adjusting ? this._renderAdjustDialog() : d}
      ${this._testingAlarm ? this._renderTestModal() : d}
    `;
  }
  static {
    this.styles = Z`
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
f([
  w({ attribute: !1 })
], g.prototype, "hass");
f([
  w({ attribute: !1 })
], g.prototype, "narrow");
f([
  m()
], g.prototype, "_alarms");
f([
  m()
], g.prototype, "_isAdmin");
f([
  m()
], g.prototype, "_allowedPlayers");
f([
  m()
], g.prototype, "_view");
f([
  m()
], g.prototype, "_loaded");
f([
  m()
], g.prototype, "_error");
f([
  m()
], g.prototype, "_dialogOpen");
f([
  m()
], g.prototype, "_editing");
f([
  m()
], g.prototype, "_draft");
f([
  m()
], g.prototype, "_adjusting");
f([
  m()
], g.prototype, "_adjustTime");
f([
  m()
], g.prototype, "_haForm");
f([
  m()
], g.prototype, "_testingAlarm");
customElements.get("wakey-panel") || customElements.define("wakey-panel", g);
