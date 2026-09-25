/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const U = globalThis, Z = U.ShadowRoot && (U.ShadyCSS === void 0 || U.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Y = Symbol(), ie = /* @__PURE__ */ new WeakMap();
let ue = class {
  constructor(e, t, a) {
    if (this._$cssResult$ = !0, a !== Y) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (Z && e === void 0) {
      const a = t !== void 0 && t.length === 1;
      a && (e = ie.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), a && ie.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const ye = (r) => new ue(typeof r == "string" ? r : r + "", void 0, Y), K = (r, ...e) => {
  const t = r.length === 1 ? r[0] : e.reduce((a, i, s) => a + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + r[s + 1], r[0]);
  return new ue(t, r, Y);
}, xe = (r, e) => {
  if (Z) r.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const a = document.createElement("style"), i = U.litNonce;
    i !== void 0 && a.setAttribute("nonce", i), a.textContent = t.cssText, r.appendChild(a);
  }
}, ae = Z ? (r) => r : (r) => r instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const a of e.cssRules) t += a.cssText;
  return ye(t);
})(r) : r;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: we, defineProperty: $e, getOwnPropertyDescriptor: ke, getOwnPropertyNames: Ae, getOwnPropertySymbols: Ce, getPrototypeOf: Se } = Object, V = globalThis, re = V.trustedTypes, Ee = re ? re.emptyScript : "", ze = V.reactiveElementPolyfillSupport, T = (r, e) => r, B = { toAttribute(r, e) {
  switch (e) {
    case Boolean:
      r = r ? Ee : null;
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
} }, Q = (r, e) => !we(r, e), se = { attribute: !0, type: String, converter: B, reflect: !1, useDefault: !1, hasChanged: Q };
Symbol.metadata ??= Symbol("metadata"), V.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let E = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = se) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const a = Symbol(), i = this.getPropertyDescriptor(e, a, t);
      i !== void 0 && $e(this.prototype, e, i);
    }
  }
  static getPropertyDescriptor(e, t, a) {
    const { get: i, set: s } = ke(this.prototype, e) ?? { get() {
      return this[t];
    }, set(o) {
      this[t] = o;
    } };
    return { get: i, set(o) {
      const c = i?.call(this);
      s?.call(this, o), this.requestUpdate(e, c, a);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? se;
  }
  static _$Ei() {
    if (this.hasOwnProperty(T("elementProperties"))) return;
    const e = Se(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(T("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(T("properties"))) {
      const t = this.properties, a = [...Ae(t), ...Ce(t)];
      for (const i of a) this.createProperty(i, t[i]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [a, i] of t) this.elementProperties.set(a, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, a] of this.elementProperties) {
      const i = this._$Eu(t, a);
      i !== void 0 && this._$Eh.set(i, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const a = new Set(e.flat(1 / 0).reverse());
      for (const i of a) t.unshift(ae(i));
    } else e !== void 0 && t.push(ae(e));
    return t;
  }
  static _$Eu(e, t) {
    const a = t.attribute;
    return a === !1 ? void 0 : typeof a == "string" ? a : typeof e == "string" ? e.toLowerCase() : void 0;
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
    for (const a of t.keys()) this.hasOwnProperty(a) && (e.set(a, this[a]), delete this[a]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return xe(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((e) => e.hostDisconnected?.());
  }
  attributeChangedCallback(e, t, a) {
    this._$AK(e, a);
  }
  _$ET(e, t) {
    const a = this.constructor.elementProperties.get(e), i = this.constructor._$Eu(e, a);
    if (i !== void 0 && a.reflect === !0) {
      const s = (a.converter?.toAttribute !== void 0 ? a.converter : B).toAttribute(t, a.type);
      this._$Em = e, s == null ? this.removeAttribute(i) : this.setAttribute(i, s), this._$Em = null;
    }
  }
  _$AK(e, t) {
    const a = this.constructor, i = a._$Eh.get(e);
    if (i !== void 0 && this._$Em !== i) {
      const s = a.getPropertyOptions(i), o = typeof s.converter == "function" ? { fromAttribute: s.converter } : s.converter?.fromAttribute !== void 0 ? s.converter : B;
      this._$Em = i;
      const c = o.fromAttribute(t, s.type);
      this[i] = c ?? this._$Ej?.get(i) ?? c, this._$Em = null;
    }
  }
  requestUpdate(e, t, a, i = !1, s) {
    if (e !== void 0) {
      const o = this.constructor;
      if (i === !1 && (s = this[e]), a ??= o.getPropertyOptions(e), !((a.hasChanged ?? Q)(s, t) || a.useDefault && a.reflect && s === this._$Ej?.get(e) && !this.hasAttribute(o._$Eu(e, a)))) return;
      this.C(e, t, a);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: a, reflect: i, wrapped: s }, o) {
    a && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, o ?? t ?? this[e]), s !== !0 || o !== void 0) || (this._$AL.has(e) || (this.hasUpdated || a || (t = void 0), this._$AL.set(e, t)), i === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
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
        for (const [i, s] of this._$Ep) this[i] = s;
        this._$Ep = void 0;
      }
      const a = this.constructor.elementProperties;
      if (a.size > 0) for (const [i, s] of a) {
        const { wrapped: o } = s, c = this[i];
        o !== !0 || this._$AL.has(i) || c === void 0 || this.C(i, void 0, s, c);
      }
    }
    let e = !1;
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), this._$EO?.forEach((a) => a.hostUpdate?.()), this.update(t)) : this._$EM();
    } catch (a) {
      throw e = !1, this._$EM(), a;
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
E.elementStyles = [], E.shadowRootOptions = { mode: "open" }, E[T("elementProperties")] = /* @__PURE__ */ new Map(), E[T("finalized")] = /* @__PURE__ */ new Map(), ze?.({ ReactiveElement: E }), (V.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const X = globalThis, oe = (r) => r, F = X.trustedTypes, ne = F ? F.createPolicy("lit-html", { createHTML: (r) => r }) : void 0, ge = "$lit$", x = `lit$${Math.random().toFixed(9).slice(2)}$`, me = "?" + x, Me = `<${me}>`, S = document, O = () => S.createComment(""), N = (r) => r === null || typeof r != "object" && typeof r != "function", ee = Array.isArray, Pe = (r) => ee(r) || typeof r?.[Symbol.iterator] == "function", W = `[ 	
\f\r]`, P = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, le = /-->/g, de = />/g, k = RegExp(`>|${W}(?:([^\\s"'>=/]+)(${W}*=${W}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ce = /'/g, pe = /"/g, fe = /^(?:script|style|textarea|title)$/i, Te = (r) => (e, ...t) => ({ _$litType$: r, strings: e, values: t }), l = Te(1), z = Symbol.for("lit-noChange"), d = Symbol.for("lit-nothing"), he = /* @__PURE__ */ new WeakMap(), A = S.createTreeWalker(S, 129);
function ve(r, e) {
  if (!ee(r) || !r.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ne !== void 0 ? ne.createHTML(e) : e;
}
const Oe = (r, e) => {
  const t = r.length - 1, a = [];
  let i, s = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", o = P;
  for (let c = 0; c < t; c++) {
    const n = r[c];
    let h, u, p = -1, v = 0;
    for (; v < n.length && (o.lastIndex = v, u = o.exec(n), u !== null); ) v = o.lastIndex, o === P ? u[1] === "!--" ? o = le : u[1] !== void 0 ? o = de : u[2] !== void 0 ? (fe.test(u[2]) && (i = RegExp("</" + u[2], "g")), o = k) : u[3] !== void 0 && (o = k) : o === k ? u[0] === ">" ? (o = i ?? P, p = -1) : u[1] === void 0 ? p = -2 : (p = o.lastIndex - u[2].length, h = u[1], o = u[3] === void 0 ? k : u[3] === '"' ? pe : ce) : o === pe || o === ce ? o = k : o === le || o === de ? o = P : (o = k, i = void 0);
    const _ = o === k && r[c + 1].startsWith("/>") ? " " : "";
    s += o === P ? n + Me : p >= 0 ? (a.push(h), n.slice(0, p) + ge + n.slice(p) + x + _) : n + x + (p === -2 ? c : _);
  }
  return [ve(r, s + (r[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), a];
};
class j {
  constructor({ strings: e, _$litType$: t }, a) {
    let i;
    this.parts = [];
    let s = 0, o = 0;
    const c = e.length - 1, n = this.parts, [h, u] = Oe(e, t);
    if (this.el = j.createElement(h, a), A.currentNode = this.el.content, t === 2 || t === 3) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (i = A.nextNode()) !== null && n.length < c; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const p of i.getAttributeNames()) if (p.endsWith(ge)) {
          const v = u[o++], _ = i.getAttribute(p).split(x), y = /([.?@])?(.*)/.exec(v);
          n.push({ type: 1, index: s, name: y[2], strings: _, ctor: y[1] === "." ? je : y[1] === "?" ? Re : y[1] === "@" ? De : I }), i.removeAttribute(p);
        } else p.startsWith(x) && (n.push({ type: 6, index: s }), i.removeAttribute(p));
        if (fe.test(i.tagName)) {
          const p = i.textContent.split(x), v = p.length - 1;
          if (v > 0) {
            i.textContent = F ? F.emptyScript : "";
            for (let _ = 0; _ < v; _++) i.append(p[_], O()), A.nextNode(), n.push({ type: 2, index: ++s });
            i.append(p[v], O());
          }
        }
      } else if (i.nodeType === 8) if (i.data === me) n.push({ type: 2, index: s });
      else {
        let p = -1;
        for (; (p = i.data.indexOf(x, p + 1)) !== -1; ) n.push({ type: 7, index: s }), p += x.length - 1;
      }
      s++;
    }
  }
  static createElement(e, t) {
    const a = S.createElement("template");
    return a.innerHTML = e, a;
  }
}
function M(r, e, t = r, a) {
  if (e === z) return e;
  let i = a !== void 0 ? t._$Co?.[a] : t._$Cl;
  const s = N(e) ? void 0 : e._$litDirective$;
  return i?.constructor !== s && (i?._$AO?.(!1), s === void 0 ? i = void 0 : (i = new s(r), i._$AT(r, t, a)), a !== void 0 ? (t._$Co ??= [])[a] = i : t._$Cl = i), i !== void 0 && (e = M(r, i._$AS(r, e.values), i, a)), e;
}
class Ne {
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
    const { el: { content: t }, parts: a } = this._$AD, i = (e?.creationScope ?? S).importNode(t, !0);
    A.currentNode = i;
    let s = A.nextNode(), o = 0, c = 0, n = a[0];
    for (; n !== void 0; ) {
      if (o === n.index) {
        let h;
        n.type === 2 ? h = new R(s, s.nextSibling, this, e) : n.type === 1 ? h = new n.ctor(s, n.name, n.strings, this, e) : n.type === 6 && (h = new Le(s, this, e)), this._$AV.push(h), n = a[++c];
      }
      o !== n?.index && (s = A.nextNode(), o++);
    }
    return A.currentNode = S, i;
  }
  p(e) {
    let t = 0;
    for (const a of this._$AV) a !== void 0 && (a.strings !== void 0 ? (a._$AI(e, a, t), t += a.strings.length - 2) : a._$AI(e[t])), t++;
  }
}
class R {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, t, a, i) {
    this.type = 2, this._$AH = d, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = a, this.options = i, this._$Cv = i?.isConnected ?? !0;
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
    e = M(this, e, t), N(e) ? e === d || e == null || e === "" ? (this._$AH !== d && this._$AR(), this._$AH = d) : e !== this._$AH && e !== z && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Pe(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== d && N(this._$AH) ? this._$AA.nextSibling.data = e : this.T(S.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: t, _$litType$: a } = e, i = typeof a == "number" ? this._$AC(e) : (a.el === void 0 && (a.el = j.createElement(ve(a.h, a.h[0]), this.options)), a);
    if (this._$AH?._$AD === i) this._$AH.p(t);
    else {
      const s = new Ne(i, this), o = s.u(this.options);
      s.p(t), this.T(o), this._$AH = s;
    }
  }
  _$AC(e) {
    let t = he.get(e.strings);
    return t === void 0 && he.set(e.strings, t = new j(e)), t;
  }
  k(e) {
    ee(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let a, i = 0;
    for (const s of e) i === t.length ? t.push(a = new R(this.O(O()), this.O(O()), this, this.options)) : a = t[i], a._$AI(s), i++;
    i < t.length && (this._$AR(a && a._$AB.nextSibling, i), t.length = i);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    for (this._$AP?.(!1, !0, t); e !== this._$AB; ) {
      const a = oe(e).nextSibling;
      oe(e).remove(), e = a;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class I {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, a, i, s) {
    this.type = 1, this._$AH = d, this._$AN = void 0, this.element = e, this.name = t, this._$AM = i, this.options = s, a.length > 2 || a[0] !== "" || a[1] !== "" ? (this._$AH = Array(a.length - 1).fill(new String()), this.strings = a) : this._$AH = d;
  }
  _$AI(e, t = this, a, i) {
    const s = this.strings;
    let o = !1;
    if (s === void 0) e = M(this, e, t, 0), o = !N(e) || e !== this._$AH && e !== z, o && (this._$AH = e);
    else {
      const c = e;
      let n, h;
      for (e = s[0], n = 0; n < s.length - 1; n++) h = M(this, c[a + n], t, n), h === z && (h = this._$AH[n]), o ||= !N(h) || h !== this._$AH[n], h === d ? e = d : e !== d && (e += (h ?? "") + s[n + 1]), this._$AH[n] = h;
    }
    o && !i && this.j(e);
  }
  j(e) {
    e === d ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class je extends I {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === d ? void 0 : e;
  }
}
class Re extends I {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== d);
  }
}
class De extends I {
  constructor(e, t, a, i, s) {
    super(e, t, a, i, s), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = M(this, e, t, 0) ?? d) === z) return;
    const a = this._$AH, i = e === d && a !== d || e.capture !== a.capture || e.once !== a.once || e.passive !== a.passive, s = e !== d && (a === d || i);
    i && this.element.removeEventListener(this.name, this, a), s && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Le {
  constructor(e, t, a) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = a;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    M(this, e);
  }
}
const Ue = X.litHtmlPolyfillSupport;
Ue?.(j, R), (X.litHtmlVersions ??= []).push("3.3.3");
const He = (r, e, t) => {
  const a = t?.renderBefore ?? e;
  let i = a._$litPart$;
  if (i === void 0) {
    const s = t?.renderBefore ?? null;
    a._$litPart$ = i = new R(e.insertBefore(O(), s), s, void 0, t ?? {});
  }
  return i._$AI(r), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const te = globalThis;
class C extends E {
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
C._$litElement$ = !0, C.finalized = !0, te.litElementHydrateSupport?.({ LitElement: C });
const Be = te.litElementPolyfillSupport;
Be?.({ LitElement: C });
(te.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Fe = { attribute: !0, type: String, converter: B, reflect: !1, hasChanged: Q }, Ve = (r = Fe, e, t) => {
  const { kind: a, metadata: i } = t;
  let s = globalThis.litPropertyMetadata.get(i);
  if (s === void 0 && globalThis.litPropertyMetadata.set(i, s = /* @__PURE__ */ new Map()), a === "setter" && ((r = Object.create(r)).wrapped = !0), s.set(t.name, r), a === "accessor") {
    const { name: o } = t;
    return { set(c) {
      const n = e.get.call(this);
      e.set.call(this, c), this.requestUpdate(o, n, r, !0, c);
    }, init(c) {
      return c !== void 0 && this.C(o, void 0, r, c), c;
    } };
  }
  if (a === "setter") {
    const { name: o } = t;
    return function(c) {
      const n = this[o];
      e.call(this, c), this.requestUpdate(o, n, r, !0, c);
    };
  }
  throw Error("Unsupported decorator location: " + a);
};
function w(r) {
  return (e, t) => typeof t == "object" ? Ve(r, e, t) : ((a, i, s) => {
    const o = i.hasOwnProperty(s);
    return i.constructor.createProperty(s, a), o ? Object.getOwnPropertyDescriptor(i, s) : void 0;
  })(r, e, t);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function g(r) {
  return w({ ...r, state: !0, attribute: !1 });
}
const Ie = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], Ge = () => ({
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
async function We() {
  try {
    await (await (await window.loadCardHelpers?.())?.createCardElement({ type: "entities", entities: [] }))?.constructor?.getConfigElement?.();
  } catch {
  }
  return Promise.race([
    customElements.whenDefined("ha-form").then(() => !0),
    new Promise((r) => setTimeout(() => r(!1), 4e3))
  ]);
}
var qe = Object.defineProperty, $ = (r, e, t, a) => {
  for (var i = void 0, s = r.length - 1, o; s >= 0; s--)
    (o = r[s]) && (i = o(e, t, i) || i);
  return i && qe(e, t, i), i;
};
class b extends C {
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
    const a = t.detail.value?.allowed_media_players ?? [];
    this._policies = {
      ...this._policies,
      [e.id]: { user_id: e.id, allowed_media_players: a }
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
    const t = this._allowed(e.id), a = this._orphans[e.id] ?? [];
    return l`
      <div class="card">
        <div class="row">
          <div class="grow">
            <div class="name">${e.name || "Unnamed user"}</div>
            <div class="sub">
              ${e.is_admin ? "Administrator — every speaker" : t.length === 0 ? "No speakers yet" : `${t.length} speaker${t.length === 1 ? "" : "s"}`}
            </div>
          </div>
        </div>
        ${e.is_admin ? d : l`
              <div class="form">
                ${this.haForm ? l`<ha-form
                      .hass=${this.hass}
                      .data=${{ allowed_media_players: t }}
                      .schema=${this._policySchema()}
                      .computeLabel=${() => "Allowed speakers"}
                      @value-changed=${(i) => this._policyChanged(e, i)}
                    ></ha-form>` : l`<label>
                      Allowed speakers (comma separated)
                      <input
                        .value=${t.join(", ")}
                        @change=${(i) => this._policyChanged(e, {
      detail: {
        value: {
          allowed_media_players: i.target.value.split(",").map((s) => s.trim()).filter(Boolean)
        }
      }
    })}
                      />
                    </label>`}
              </div>
              ${a.length ? l`<div class="warn">
                    ${a.length} of ${e.name}'s alarms use a speaker they can
                    no longer choose:
                    ${a.map((i) => `${i.name} (${i.media_player})`).join(", ")}.
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
    } catch (a) {
      this._error = a?.message ?? String(a);
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
    return this.alarms.length ? l`
      <h2>Who owns what</h2>
      ${this._unowned.length ? l`<div class="notice">
            <div class="grow">
              ${this._unowned.length}
              ${this._unowned.length === 1 ? "alarm has" : "alarms have"} no owner, so
              only administrators can see ${this._unowned.length === 1 ? "it" : "them"}.
            </div>
            <button class="primary" @click=${this._claimAll}>Assign all to me</button>
          </div>` : d}
      ${this.alarms.map(
      (e) => l`
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
        (t) => l`<option value=${t.id} ?selected=${t.id === e.owner_id}>
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
    return this._loaded ? l`
      ${this._error ? l`<div class="error">${this._error}</div>` : d}
      <h2>Speakers each person may use</h2>
      <p class="sub intro">
        Nobody gets a speaker until you grant it. Administrators always have all of
        them.
      </p>
      ${this._users.map((e) => this._renderUser(e))}
      ${this._renderOwnership()}
    ` : l`<div class="empty">Loading…</div>`;
  }
  static {
    this.styles = K`
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
  g()
], b.prototype, "_users");
$([
  g()
], b.prototype, "_policies");
$([
  g()
], b.prototype, "_orphans");
$([
  g()
], b.prototype, "_error");
$([
  g()
], b.prototype, "_loaded");
customElements.get("wakey-admin") || customElements.define("wakey-admin", b);
var Je = Object.defineProperty, G = (r, e, t, a) => {
  for (var i = void 0, s = r.length - 1, o; s >= 0; s--)
    (o = r[s]) && (i = o(e, t, i) || i);
  return i && Je(e, t, i), i;
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
function H() {
  try {
    const r = localStorage.getItem(J);
    if (r)
      return { ...q, ...JSON.parse(r) };
  } catch {
  }
  return { ...q };
}
function _e(r) {
  const e = {
    "Google Sans": "'Google Sans', var(--ha-font-family, Roboto, system-ui, sans-serif)",
    Rubik: "'Rubik', sans-serif",
    Nunito: "'Nunito', sans-serif",
    Inter: "'Inter', sans-serif",
    Oswald: "'Oswald', sans-serif",
    "Roboto Slab": "'Roboto Slab', serif",
    monospace: "'Courier New', Courier, monospace"
  };
  return e[r] || e["Google Sans"];
}
class D extends C {
  constructor() {
    super(...arguments), this.alarms = [], this._config = H(), this._previewMode = "single";
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
    return _e(e);
  }
  // --- Render Previews ---------------------------------------------------
  /**
   * Renders the single alarm card matching assets/alarm.png
   */
  _renderSingleAlarmCard() {
    const {
      font: e,
      weight: t,
      showSpeaker: a,
      showIcon: i,
      glow: s,
      scale: o,
      timeColor: c,
      cardBgColor: n,
      badgeBgColor: h,
      badgeTextColor: u,
      textColor: p,
      subColor: v
    } = this._config, _ = this._getFontFamily(e), L = `calc(4.5rem * ${Math.max(0.7, Math.min(1.4, o / 100))})`, be = s ? "text-shadow: 0 0 15px rgba(255, 255, 255, 0.45);" : "";
    return l`
      <div
        class="alarm-card-official single-preview"
        style="
          background-color: ${n};
          font-family: ${_};
        "
      >
        <!-- Header -->
        <div class="alarm-header-row">
          <div class="alarm-title-group">
            ${i ? l`
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
            font-size: ${L};
            ${be}
          "
        >
          07:30
        </div>

        <!-- Days -->
        <div class="alarm-days-label" style="color: ${p};">
          Lunes a Viernes
        </div>

        <!-- Speaker -->
        ${a ? l`
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
      showIcon: a,
      glow: i,
      scale: s,
      timeColor: o,
      cardBgColor: c,
      badgeBgColor: n,
      badgeTextColor: h,
      textColor: u,
      subColor: p
    } = this._config, v = this._getFontFamily(e), y = `calc(2.5rem * ${Math.max(0.7, Math.min(1.4, s / 100))})`, L = i ? "text-shadow: 0 0 10px rgba(255, 255, 255, 0.4);" : "";
    return l`
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
            ${a ? l`
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
              ${L}
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
              background-color: ${n};
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
              ${L}
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
              background-color: ${n};
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
    const { font: e, weight: t, cardBgColor: a, timeColor: i, textColor: s, subColor: o } = this._config, c = this._getFontFamily(e);
    return l`
      <div
        class="alarm-card-official single-preview ringing-preview"
        style="
          background-color: ${a};
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
          style="color: ${i}; font-weight: ${t}; font-size: 4.5rem;"
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
    return l`
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
    this.styles = K`
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
G([
  w({ attribute: !1 })
], D.prototype, "hass");
G([
  w({ attribute: !1 })
], D.prototype, "alarms");
G([
  g()
], D.prototype, "_config");
G([
  g()
], D.prototype, "_previewMode");
customElements.get("wakey-alarm-settings") || customElements.define("wakey-alarm-settings", D);
var Ze = Object.defineProperty, f = (r, e, t, a) => {
  for (var i = void 0, s = r.length - 1, o; s >= 0; s--)
    (o = r[s]) && (i = o(e, t, i) || i);
  return i && Ze(e, t, i), i;
};
const Ye = Ie.map((r, e) => ({ value: String(e), label: r }));
class m extends C {
  constructor() {
    super(...arguments), this.narrow = !1, this._alarms = [], this._isAdmin = !1, this._allowedPlayers = null, this._view = "alarms", this._loaded = !1, this._error = null, this._dialogOpen = !1, this._editing = null, this._draft = {}, this._adjusting = null, this._adjustTime = "", this._haForm = !1, this._testingAlarm = null, this._appearance = H(), this._subscribed = !1, this._onAppearanceChanged = (e) => {
      const t = e.detail;
      t?.config ? this._appearance = { ...t.config } : this._appearance = H();
    }, this._label = (e) => ({
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
  connectedCallback() {
    super.connectedCallback(), this._appearance = H(), window.addEventListener("wakey-appearance-changed", this._onAppearanceChanged), this._loadGoogleFonts();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.removeEventListener("wakey-appearance-changed", this._onAppearanceChanged), this._unsub?.(), this._unsub = void 0, this._subscribed = !1;
  }
  _loadGoogleFonts() {
    if (!document.getElementById("wakey-google-alarm-fonts")) {
      const e = document.createElement("link");
      e.id = "wakey-google-alarm-fonts", e.rel = "stylesheet", e.href = "https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&family=Inter:wght@300;400;500;700&family=Nunito:wght@300;400;500;700&family=Oswald:wght@300;400;500;700&family=Roboto+Slab:wght@300;400;500;700&family=Rubik:wght@300;400;500;700&display=swap", document.head.appendChild(e);
    }
  }
  updated(e) {
    e.has("hass") && this.hass && !this._subscribed && (this._subscribed = !0, this._subscribe(), We().then((t) => this._haForm = t));
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
    this._editing = null, this._draft = { ...Ge(), weekdays: ["0", "1", "2", "3", "4"] }, this._dialogOpen = !0;
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
      weekdays: (e.weekdays ?? []).map((a) => Number(a)),
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
      ...e === "weekly" ? [{ name: "weekdays", selector: { select: { multiple: !0, options: Ye } } }] : [{ name: "date", selector: { date: {} } }],
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
    const t = new Date(e.next_fire), a = Math.round((t.getTime() - Date.now()) / 6e4);
    if (a < 60) return `in ${Math.max(1, a)} min`;
    const i = Math.floor(a / 60);
    return i < 24 ? `in ${i}h ${a % 60}m` : t.toLocaleDateString(void 0, { weekday: "long" });
  }
  _fmtAdjusted(e) {
    const t = (/* @__PURE__ */ new Date()).toLocaleDateString("en-CA");
    return e.override_for === t ? `Today at ${e.override_time}` : `${(/* @__PURE__ */ new Date(`${e.override_for}T00:00:00`)).toLocaleDateString(void 0, { weekday: "long" })} at ${e.override_time}`;
  }
  _renderAdjustDialog() {
    const e = this._alarms.find((t) => t.id === this._adjusting);
    return e ? l`
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
          ${this._adjusted(e) ? l`<button @click=${() => this._clearAdjust(e)}>
                Back to ${e.time}
              </button>` : d}
          <button @click=${() => this._adjusting = null}>Cancel</button>
          <button class="primary" @click=${this._saveAdjust}>Save</button>
        </div>
      </div>
    ` : d;
  }
  _formatAlarmDays(e, t = !1) {
    if (e.repeat === "once") return e.date ?? (t ? "1 vez" : "Una vez");
    if (e.repeat === "never") return e.date ? `${e.date} (Nunca)` : "Nunca";
    const a = Array.isArray(e.weekdays) ? e.weekdays.map(Number) : [];
    if (a.length === 0) return "Sin días";
    if (a.length === 7) return t ? "Diario" : "Todos los días";
    const i = [...a].sort((n, h) => n - h);
    if (i.length === 5 && i[0] === 0 && i[1] === 1 && i[2] === 2 && i[3] === 3 && i[4] === 4)
      return t ? "Lun-Vie" : "Lunes a Viernes";
    if (i.length === 2 && i[0] === 5 && i[1] === 6)
      return t ? "Sáb, Dom" : "Sábados y Domingos";
    const c = t ? ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"] : [
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
      "Domingo"
    ];
    return i.map((n) => c[n] || `Día ${n}`).join(t ? ", " : " y ");
  }
  _formatSpeaker(e) {
    if (!e) return "Altavoz";
    const t = e.replace(/^media_player\./, "").replace(/_/g, " ").trim();
    return t.toLowerCase() === "salon" ? "Salón" : t.charAt(0).toUpperCase() + t.slice(1);
  }
  _renderAlarm(e) {
    const t = this._formatAlarmDays(e, !1), a = this._formatSpeaker(e.media_player);
    return l`
      <div class="card ${e.enabled ? "" : "dim"}">
        <div class="row">
          <div class="time">${e.time}</div>
          <div class="grow">
            <div class="name">${e.name}</div>
            <div class="sub">${t}</div>
            <div class="sub speaker-sub">
              <ha-icon icon="mdi:speaker"></ha-icon>
              <span>Altavoz: ${a}</span>
            </div>
          </div>
          <div class="right">
            ${this._haForm ? l`<ha-switch
                  .checked=${e.enabled}
                  @change=${() => this._toggle(e)}
                ></ha-switch>` : l`<input
                  type="checkbox"
                  .checked=${e.enabled}
                  @change=${() => this._toggle(e)}
                />`}
            <div class="next">${this._fmtNext(e)}</div>
          </div>
        </div>
        ${e.is_ringing || e.is_snoozed || e.skip_next || this._adjusted(e) ? l`<div class="flags">
              ${e.is_ringing ? l`<span class="flag ring">Ringing</span>` : d}
              ${e.is_snoozed ? l`<span class="flag">Snoozed</span>` : d}
              ${e.skip_next ? l`<span class="flag">Skipping next</span>` : d}
              ${this._adjusted(e) ? l`<span class="flag">${this._fmtAdjusted(e)}</span>` : d}
            </div>` : d}
        ${l`<div class="actions">
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
            </div>`}
      </div>
    `;
  }
  _renderRinging() {
    const e = this._alarms.filter((t) => t.is_ringing || t.is_snoozed);
    return e.length ? l`
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
    const e = this._draft.time ? String(this._draft.time).slice(0, 5) : "07:00", t = this._draft.name || "Alarma", a = this._formatAlarmDays(this._draft, !1), i = this._draft.media_player ? this._formatSpeaker(this._draft.media_player) : "";
    return l`
      <div class="scrim" @click=${this._closeDialog}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        <h2>${this._editing ? "Editar alarma" : "Nueva alarma"}</h2>

        <div class="live-alarm-preview">
          <div class="preview-header">
            <div class="preview-icon">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                <path d="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L16.2,17.2L17,15.9L12.5,13.2V8M22,5.7L17.7,2.2L16.4,3.8L20.7,7.3L22,5.7M6.3,3.8L5,2.2L0.7,5.7L2,7.3L6.3,3.8Z"/>
              </svg>
            </div>
            <div class="preview-title">${t}</div>
            <span class="preview-badge ${this._editing ? "edit" : "new"}">${this._editing ? "EDITANDO" : "PROGRAMADA"}</span>
          </div>
          <div class="preview-time">${e}</div>
          <div class="preview-sub">${a}</div>
          ${i ? l`
                <div class="preview-speaker">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z"/>
                  </svg>
                  <span>Altavoz: ${i}</span>
                </div>
              ` : d}
        </div>

        ${this._haForm ? l`<ha-form
              .hass=${this.hass}
              .data=${this._draft}
              .schema=${this._schema()}
              .computeLabel=${this._label}
              @value-changed=${this._formChanged}
            ></ha-form>` : l`
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
    if (!this._testingAlarm) return d;
    const e = this._testingAlarm, t = this._formatAlarmDays(e, !1), a = this._formatSpeaker(e.media_player), i = this._appearance, s = _e(i.font), o = Math.max(0.7, Math.min(1.4, i.scale / 100));
    return l`
      <div class="test-overlay" @click=${() => this._stopTest()}></div>
      <div class="test-stage" role="dialog" aria-modal="true">
        <!-- 100% exact replica of assets/alarm.png -->
        <div
          class="official-alarm-card"
          style="
            background-color: ${i.cardBgColor};
            font-family: ${s};
          "
        >
          <!-- Top Row: Circle icon + Title on left, Badge on right -->
          <div class="official-alarm-header">
            <div class="official-title-wrap">
              ${i.showIcon ? l`
                    <div class="official-alarm-icon">
                      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                        <path d="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L16.2,17.2L17,15.9L12.5,13.2V8M22,5.7L17.7,2.2L16.4,3.8L20.7,7.3L22,5.7M6.3,3.8L5,2.2L0.7,5.7L2,7.3L6.3,3.8Z"/>
                      </svg>
                    </div>
                  ` : d}
              <span class="official-alarm-name" style="color: ${i.textColor};">
                ${e.name || "Despertador"}
              </span>
            </div>
            <span
              class="official-alarm-badge"
              style="
                background-color: ${i.badgeBgColor};
                color: ${i.badgeTextColor};
              "
            >
              PROGRAMADA
            </span>
          </div>

          <!-- Center: Massive Time in Google Sans -->
          <div
            class="official-alarm-time"
            style="
              color: ${i.timeColor};
              font-weight: ${i.weight};
              font-size: calc(6.25rem * ${o});
              ${i.glow ? "text-shadow: 0 0 18px rgba(255, 255, 255, 0.45);" : ""}
            "
          >
            ${e.time}
          </div>

          <!-- Recurrence Text: Lunes a Viernes -->
          <div class="official-alarm-days" style="color: ${i.textColor};">
            ${t}
          </div>

          <!-- Speaker Row: Altavoz: Salón -->
          ${i.showSpeaker && e.media_player ? l`
                <div class="official-alarm-speaker" style="color: ${i.subColor};">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                    <path d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z"/>
                  </svg>
                  <span>Altavoz: ${a}</span>
                </div>
              ` : d}
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
    return this._canCreate ? l`<div class="empty">No alarms yet. Use Add alarm to create one.</div>` : l`<div class="empty">
        An administrator has not given you access to any speakers yet, so there is
        nowhere for an alarm to play.
      </div>`;
  }
  _renderAlarms() {
    return this._loaded ? this._alarms.length === 0 ? this._renderEmpty() : this._alarms.map((e) => this._renderAlarm(e)) : l`<div class="empty">Loading…</div>`;
  }
  render() {
    return l`
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
          ${this._isAdmin ? l`<button
                class=${this._view === "admin" ? "selected" : ""}
                @click=${() => this._view = "admin"}
              >
                Personas
              </button>` : d}
        </div>
        ${this._view === "alarms" && this._canCreate ? l`<button class="primary" @click=${this._openNew}>Añadir alarma</button>` : d}
      </div>

      <div class="body">
        ${this._error ? l`<div class="error">${this._error}</div>` : d}
        ${this._view === "admin" ? l`<wakey-admin
              .hass=${this.hass}
              .alarms=${this._alarms}
              .haForm=${this._haForm}
            ></wakey-admin>` : this._view === "settings" ? l`<wakey-alarm-settings
                .hass=${this.hass}
                .alarms=${this._alarms}
              ></wakey-alarm-settings>` : l`${this._renderRinging()} ${this._renderAlarms()}`}
      </div>

      ${this._renderDialog()}
      ${this._adjusting ? this._renderAdjustDialog() : d}
      ${this._testingAlarm ? this._renderTestModal() : d}
    `;
  }
  static {
    this.styles = K`
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
    .speaker-sub {
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .speaker-sub ha-icon {
      --mdc-icon-size: 14px;
    }
    .btn-test {
      color: #1a73e8;
      border-color: rgba(26, 115, 232, 0.3);
      display: inline-flex;
      align-items: center;
    }
    .btn-test:hover {
      background: rgba(26, 115, 232, 0.08);
    }
    .live-alarm-preview {
      background: #282a2d;
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 20px;
      padding: 22px 26px;
      margin-bottom: 20px;
      font-family: 'Google Sans', var(--ha-font-family, Roboto, sans-serif);
      text-align: center;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
    }
    .live-alarm-preview .preview-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }
    .live-alarm-preview .preview-icon {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      flex-shrink: 0;
    }
    .live-alarm-preview .preview-title {
      font-size: 18px;
      font-weight: 500;
      color: #ffffff;
      margin: 0 12px;
      flex: 1;
      text-align: left;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .live-alarm-preview .preview-badge {
      font-size: 11px;
      font-weight: 700;
      padding: 4px 12px;
      border-radius: 12px;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      flex-shrink: 0;
    }
    .live-alarm-preview .preview-badge.new {
      background: #c3e8cd;
      color: #137333;
    }
    .live-alarm-preview .preview-badge.edit {
      background: #c2e7ff;
      color: #004a77;
    }
    .live-alarm-preview .preview-time {
      font-size: 54px;
      font-weight: 400;
      color: #f7f6f2;
      line-height: 1;
      letter-spacing: -1.5px;
      margin: 8px 0 4px 0;
      font-variant-numeric: tabular-nums;
    }
    .live-alarm-preview .preview-sub {
      font-size: 16px;
      color: #e8eaed;
      margin-bottom: 4px;
    }
    .live-alarm-preview .preview-speaker {
      font-size: 14px;
      color: #dadce0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      margin-top: 4px;
    }

    /* Official Alarm View matching assets/alarm.png */
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
      gap: 22px;
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
      gap: 12px;
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
      line-height: 1;
      font-variant-numeric: tabular-nums;
      margin: 36px 0 16px 0;
      letter-spacing: -2px;
      font-family: inherit;
      color: #f7f6f2;
    }
    .official-alarm-days {
      font-size: 24px;
      font-weight: 400;
      margin-bottom: 12px;
    }
    .official-alarm-speaker {
      font-size: 19px;
      font-weight: 400;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 4px;
    }
    .official-test-actions {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 14px;
    }
    .official-btn-stop {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #ea4335;
      color: #ffffff;
      border: none;
      padding: 11px 26px;
      border-radius: 24px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(234, 67, 53, 0.45);
      transition: transform 120ms ease, background 120ms ease;
    }
    .official-btn-stop:hover {
      background: #d93025;
      transform: translateY(-1px);
    }
    .official-btn-close {
      background: rgba(255, 255, 255, 0.12);
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.2);
      padding: 11px 24px;
      border-radius: 24px;
      font-size: 15px;
      font-weight: 500;
      cursor: pointer;
      transition: background 120ms ease;
    }
    .official-btn-close:hover {
      background: rgba(255, 255, 255, 0.22);
    }
    @keyframes official-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes official-scale-in {
      from { opacity: 0; transform: translate(-50%, -46%) scale(0.95); }
      to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    }
  `;
  }
}
f([
  w({ attribute: !1 })
], m.prototype, "hass");
f([
  w({ attribute: !1 })
], m.prototype, "narrow");
f([
  g()
], m.prototype, "_alarms");
f([
  g()
], m.prototype, "_isAdmin");
f([
  g()
], m.prototype, "_allowedPlayers");
f([
  g()
], m.prototype, "_view");
f([
  g()
], m.prototype, "_loaded");
f([
  g()
], m.prototype, "_error");
f([
  g()
], m.prototype, "_dialogOpen");
f([
  g()
], m.prototype, "_editing");
f([
  g()
], m.prototype, "_draft");
f([
  g()
], m.prototype, "_adjusting");
f([
  g()
], m.prototype, "_adjustTime");
f([
  g()
], m.prototype, "_haForm");
f([
  g()
], m.prototype, "_testingAlarm");
f([
  g()
], m.prototype, "_appearance");
customElements.get("wakey-panel") || customElements.define("wakey-panel", m);
