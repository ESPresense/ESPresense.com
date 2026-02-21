const U = globalThis, j = U.ShadowRoot && (U.ShadyCSS === void 0 || U.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, q = /* @__PURE__ */ Symbol(), G = /* @__PURE__ */ new WeakMap();
let oe = class {
  constructor(e, t, s) {
    if (this._$cssResult$ = !0, s !== q) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (j && e === void 0) {
      const s = t !== void 0 && t.length === 1;
      s && (e = G.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), s && G.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const ue = (i) => new oe(typeof i == "string" ? i : i + "", void 0, q), ne = (i, ...e) => {
  const t = i.length === 1 ? i[0] : e.reduce((s, r, o) => s + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + i[o + 1], i[0]);
  return new oe(t, i, q);
}, ge = (i, e) => {
  if (j) i.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const s = document.createElement("style"), r = U.litNonce;
    r !== void 0 && s.setAttribute("nonce", r), s.textContent = t.cssText, i.appendChild(s);
  }
}, Z = j ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const s of e.cssRules) t += s.cssText;
  return ue(t);
})(i) : i;
const { is: be, defineProperty: me, getOwnPropertyDescriptor: fe, getOwnPropertyNames: $e, getOwnPropertySymbols: ye, getPrototypeOf: ve } = Object, T = globalThis, J = T.trustedTypes, _e = J ? J.emptyScript : "", we = T.reactiveElementPolyfillSupport, E = (i, e) => i, z = { toAttribute(i, e) {
  switch (e) {
    case Boolean:
      i = i ? _e : null;
      break;
    case Object:
    case Array:
      i = i == null ? i : JSON.stringify(i);
  }
  return i;
}, fromAttribute(i, e) {
  let t = i;
  switch (e) {
    case Boolean:
      t = i !== null;
      break;
    case Number:
      t = i === null ? null : Number(i);
      break;
    case Object:
    case Array:
      try {
        t = JSON.parse(i);
      } catch {
        t = null;
      }
  }
  return t;
} }, ae = (i, e) => !be(i, e), Y = { attribute: !0, type: String, converter: z, reflect: !1, useDefault: !1, hasChanged: ae };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), T.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let _ = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = Y) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const s = /* @__PURE__ */ Symbol(), r = this.getPropertyDescriptor(e, s, t);
      r !== void 0 && me(this.prototype, e, r);
    }
  }
  static getPropertyDescriptor(e, t, s) {
    const { get: r, set: o } = fe(this.prototype, e) ?? { get() {
      return this[t];
    }, set(n) {
      this[t] = n;
    } };
    return { get: r, set(n) {
      const c = r?.call(this);
      o?.call(this, n), this.requestUpdate(e, c, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? Y;
  }
  static _$Ei() {
    if (this.hasOwnProperty(E("elementProperties"))) return;
    const e = ve(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(E("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(E("properties"))) {
      const t = this.properties, s = [...$e(t), ...ye(t)];
      for (const r of s) this.createProperty(r, t[r]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [s, r] of t) this.elementProperties.set(s, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, s] of this.elementProperties) {
      const r = this._$Eu(t, s);
      r !== void 0 && this._$Eh.set(r, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const s = new Set(e.flat(1 / 0).reverse());
      for (const r of s) t.unshift(Z(r));
    } else e !== void 0 && t.push(Z(e));
    return t;
  }
  static _$Eu(e, t) {
    const s = t.attribute;
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
    const e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
    for (const s of t.keys()) this.hasOwnProperty(s) && (e.set(s, this[s]), delete this[s]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return ge(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((e) => e.hostDisconnected?.());
  }
  attributeChangedCallback(e, t, s) {
    this._$AK(e, s);
  }
  _$ET(e, t) {
    const s = this.constructor.elementProperties.get(e), r = this.constructor._$Eu(e, s);
    if (r !== void 0 && s.reflect === !0) {
      const o = (s.converter?.toAttribute !== void 0 ? s.converter : z).toAttribute(t, s.type);
      this._$Em = e, o == null ? this.removeAttribute(r) : this.setAttribute(r, o), this._$Em = null;
    }
  }
  _$AK(e, t) {
    const s = this.constructor, r = s._$Eh.get(e);
    if (r !== void 0 && this._$Em !== r) {
      const o = s.getPropertyOptions(r), n = typeof o.converter == "function" ? { fromAttribute: o.converter } : o.converter?.fromAttribute !== void 0 ? o.converter : z;
      this._$Em = r;
      const c = n.fromAttribute(t, o.type);
      this[r] = c ?? this._$Ej?.get(r) ?? c, this._$Em = null;
    }
  }
  requestUpdate(e, t, s, r = !1, o) {
    if (e !== void 0) {
      const n = this.constructor;
      if (r === !1 && (o = this[e]), s ??= n.getPropertyOptions(e), !((s.hasChanged ?? ae)(o, t) || s.useDefault && s.reflect && o === this._$Ej?.get(e) && !this.hasAttribute(n._$Eu(e, s)))) return;
      this.C(e, t, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: s, reflect: r, wrapped: o }, n) {
    s && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, n ?? t ?? this[e]), o !== !0 || n !== void 0) || (this._$AL.has(e) || (this.hasUpdated || s || (t = void 0), this._$AL.set(e, t)), r === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
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
        for (const [r, o] of this._$Ep) this[r] = o;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [r, o] of s) {
        const { wrapped: n } = o, c = this[r];
        n !== !0 || this._$AL.has(r) || c === void 0 || this.C(r, void 0, o, c);
      }
    }
    let e = !1;
    const t = this._$AL;
    try {
      e = this.shouldUpdate(t), e ? (this.willUpdate(t), this._$EO?.forEach((s) => s.hostUpdate?.()), this.update(t)) : this._$EM();
    } catch (s) {
      throw e = !1, this._$EM(), s;
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
_.elementStyles = [], _.shadowRootOptions = { mode: "open" }, _[E("elementProperties")] = /* @__PURE__ */ new Map(), _[E("finalized")] = /* @__PURE__ */ new Map(), we?.({ ReactiveElement: _ }), (T.reactiveElementVersions ??= []).push("2.1.2");
const I = globalThis, Q = (i) => i, R = I.trustedTypes, X = R ? R.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, le = "$lit$", f = `lit$${Math.random().toFixed(9).slice(2)}$`, he = "?" + f, xe = `<${he}>`, v = document, k = () => v.createComment(""), P = (i) => i === null || typeof i != "object" && typeof i != "function", K = Array.isArray, Ae = (i) => K(i) || typeof i?.[Symbol.iterator] == "function", N = `[ 	
\f\r]`, S = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ee = /-->/g, te = />/g, $ = RegExp(`>|${N}(?:([^\\s"'>=/]+)(${N}*=${N}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), se = /'/g, re = /"/g, ce = /^(?:script|style|textarea|title)$/i, Se = (i) => (e, ...t) => ({ _$litType$: i, strings: e, values: t }), g = Se(1), x = /* @__PURE__ */ Symbol.for("lit-noChange"), u = /* @__PURE__ */ Symbol.for("lit-nothing"), ie = /* @__PURE__ */ new WeakMap(), y = v.createTreeWalker(v, 129);
function de(i, e) {
  if (!K(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return X !== void 0 ? X.createHTML(e) : e;
}
const Ee = (i, e) => {
  const t = i.length - 1, s = [];
  let r, o = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", n = S;
  for (let c = 0; c < t; c++) {
    const l = i[c];
    let d, p, a = -1, h = 0;
    for (; h < l.length && (n.lastIndex = h, p = n.exec(l), p !== null); ) h = n.lastIndex, n === S ? p[1] === "!--" ? n = ee : p[1] !== void 0 ? n = te : p[2] !== void 0 ? (ce.test(p[2]) && (r = RegExp("</" + p[2], "g")), n = $) : p[3] !== void 0 && (n = $) : n === $ ? p[0] === ">" ? (n = r ?? S, a = -1) : p[1] === void 0 ? a = -2 : (a = n.lastIndex - p[2].length, d = p[1], n = p[3] === void 0 ? $ : p[3] === '"' ? re : se) : n === re || n === se ? n = $ : n === ee || n === te ? n = S : (n = $, r = void 0);
    const b = n === $ && i[c + 1].startsWith("/>") ? " " : "";
    o += n === S ? l + xe : a >= 0 ? (s.push(d), l.slice(0, a) + le + l.slice(a) + f + b) : l + f + (a === -2 ? c : b);
  }
  return [de(i, o + (i[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), s];
};
class C {
  constructor({ strings: e, _$litType$: t }, s) {
    let r;
    this.parts = [];
    let o = 0, n = 0;
    const c = e.length - 1, l = this.parts, [d, p] = Ee(e, t);
    if (this.el = C.createElement(d, s), y.currentNode = this.el.content, t === 2 || t === 3) {
      const a = this.el.content.firstChild;
      a.replaceWith(...a.childNodes);
    }
    for (; (r = y.nextNode()) !== null && l.length < c; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const a of r.getAttributeNames()) if (a.endsWith(le)) {
          const h = p[n++], b = r.getAttribute(a).split(f), O = /([.?@])?(.*)/.exec(h);
          l.push({ type: 1, index: o, name: O[2], strings: b, ctor: O[1] === "." ? Pe : O[1] === "?" ? Ce : O[1] === "@" ? Me : H }), r.removeAttribute(a);
        } else a.startsWith(f) && (l.push({ type: 6, index: o }), r.removeAttribute(a));
        if (ce.test(r.tagName)) {
          const a = r.textContent.split(f), h = a.length - 1;
          if (h > 0) {
            r.textContent = R ? R.emptyScript : "";
            for (let b = 0; b < h; b++) r.append(a[b], k()), y.nextNode(), l.push({ type: 2, index: ++o });
            r.append(a[h], k());
          }
        }
      } else if (r.nodeType === 8) if (r.data === he) l.push({ type: 2, index: o });
      else {
        let a = -1;
        for (; (a = r.data.indexOf(f, a + 1)) !== -1; ) l.push({ type: 7, index: o }), a += f.length - 1;
      }
      o++;
    }
  }
  static createElement(e, t) {
    const s = v.createElement("template");
    return s.innerHTML = e, s;
  }
}
function A(i, e, t = i, s) {
  if (e === x) return e;
  let r = s !== void 0 ? t._$Co?.[s] : t._$Cl;
  const o = P(e) ? void 0 : e._$litDirective$;
  return r?.constructor !== o && (r?._$AO?.(!1), o === void 0 ? r = void 0 : (r = new o(i), r._$AT(i, t, s)), s !== void 0 ? (t._$Co ??= [])[s] = r : t._$Cl = r), r !== void 0 && (e = A(i, r._$AS(i, e.values), r, s)), e;
}
class ke {
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
    const { el: { content: t }, parts: s } = this._$AD, r = (e?.creationScope ?? v).importNode(t, !0);
    y.currentNode = r;
    let o = y.nextNode(), n = 0, c = 0, l = s[0];
    for (; l !== void 0; ) {
      if (n === l.index) {
        let d;
        l.type === 2 ? d = new M(o, o.nextSibling, this, e) : l.type === 1 ? d = new l.ctor(o, l.name, l.strings, this, e) : l.type === 6 && (d = new Oe(o, this, e)), this._$AV.push(d), l = s[++c];
      }
      n !== l?.index && (o = y.nextNode(), n++);
    }
    return y.currentNode = v, r;
  }
  p(e) {
    let t = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(e, s, t), t += s.strings.length - 2) : s._$AI(e[t])), t++;
  }
}
class M {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, t, s, r) {
    this.type = 2, this._$AH = u, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = s, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
    e = A(this, e, t), P(e) ? e === u || e == null || e === "" ? (this._$AH !== u && this._$AR(), this._$AH = u) : e !== this._$AH && e !== x && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Ae(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== u && P(this._$AH) ? this._$AA.nextSibling.data = e : this.T(v.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: t, _$litType$: s } = e, r = typeof s == "number" ? this._$AC(e) : (s.el === void 0 && (s.el = C.createElement(de(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === r) this._$AH.p(t);
    else {
      const o = new ke(r, this), n = o.u(this.options);
      o.p(t), this.T(n), this._$AH = o;
    }
  }
  _$AC(e) {
    let t = ie.get(e.strings);
    return t === void 0 && ie.set(e.strings, t = new C(e)), t;
  }
  k(e) {
    K(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let s, r = 0;
    for (const o of e) r === t.length ? t.push(s = new M(this.O(k()), this.O(k()), this, this.options)) : s = t[r], s._$AI(o), r++;
    r < t.length && (this._$AR(s && s._$AB.nextSibling, r), t.length = r);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    for (this._$AP?.(!1, !0, t); e !== this._$AB; ) {
      const s = Q(e).nextSibling;
      Q(e).remove(), e = s;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class H {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, s, r, o) {
    this.type = 1, this._$AH = u, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = o, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = u;
  }
  _$AI(e, t = this, s, r) {
    const o = this.strings;
    let n = !1;
    if (o === void 0) e = A(this, e, t, 0), n = !P(e) || e !== this._$AH && e !== x, n && (this._$AH = e);
    else {
      const c = e;
      let l, d;
      for (e = o[0], l = 0; l < o.length - 1; l++) d = A(this, c[s + l], t, l), d === x && (d = this._$AH[l]), n ||= !P(d) || d !== this._$AH[l], d === u ? e = u : e !== u && (e += (d ?? "") + o[l + 1]), this._$AH[l] = d;
    }
    n && !r && this.j(e);
  }
  j(e) {
    e === u ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Pe extends H {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === u ? void 0 : e;
  }
}
class Ce extends H {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== u);
  }
}
class Me extends H {
  constructor(e, t, s, r, o) {
    super(e, t, s, r, o), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = A(this, e, t, 0) ?? u) === x) return;
    const s = this._$AH, r = e === u && s !== u || e.capture !== s.capture || e.once !== s.once || e.passive !== s.passive, o = e !== u && (s === u || r);
    r && this.element.removeEventListener(this.name, this, s), o && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Oe {
  constructor(e, t, s) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    A(this, e);
  }
}
const Ue = I.litHtmlPolyfillSupport;
Ue?.(C, M), (I.litHtmlVersions ??= []).push("3.3.2");
const Re = (i, e, t) => {
  const s = t?.renderBefore ?? e;
  let r = s._$litPart$;
  if (r === void 0) {
    const o = t?.renderBefore ?? null;
    s._$litPart$ = r = new M(e.insertBefore(k(), o), o, void 0, t ?? {});
  }
  return r._$AI(i), r;
};
const V = globalThis;
class w extends _ {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Re(t, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return x;
  }
}
w._$litElement$ = !0, w.finalized = !0, V.litElementHydrateSupport?.({ LitElement: w });
const Te = V.litElementPolyfillSupport;
Te?.({ LitElement: w });
(V.litElementVersions ??= []).push("4.2.2");
const pe = async (i) => {
  import("./install-dialog-DArDMBzT.js");
  let e;
  try {
    e = await navigator.serial.requestPort();
  } catch (s) {
    if (s.name === "NotFoundError") {
      import("./index-C-PJ2ZYz.js").then((r) => r.openNoPortPickedDialog(() => pe(i)));
      return;
    }
    alert(`Error: ${s.message}`);
    return;
  }
  if (!e)
    return;
  try {
    await e.open({ baudRate: 115200, bufferSize: 8192 });
  } catch (s) {
    alert(s.message);
    return;
  }
  const t = document.createElement("ewt-install-dialog");
  t.port = e, t.manifestPath = i.manifest || i.getAttribute("manifest"), t.overrides = i.overrides, t.addEventListener("closed", () => {
    e.close();
  }, { once: !0 }), document.body.appendChild(t);
};
class m extends HTMLElement {
  connectedCallback() {
    if (this.renderRoot)
      return;
    if (this.renderRoot = this.attachShadow({ mode: "open" }), !m.isSupported || !m.isAllowed) {
      this.toggleAttribute("install-unsupported", !0), this.renderRoot.innerHTML = m.isAllowed ? "<slot name='unsupported'>Your browser does not support installing things on ESP devices. Use Google Chrome or Microsoft Edge.</slot>" : "<slot name='not-allowed'>You can only install ESP devices on HTTPS websites or on the localhost.</slot>";
      return;
    }
    this.toggleAttribute("install-supported", !0);
    const e = document.createElement("slot");
    e.addEventListener("click", async (s) => {
      s.preventDefault(), pe(this);
    }), e.name = "activate";
    const t = document.createElement("button");
    if (t.innerText = "Connect", e.append(t), "adoptedStyleSheets" in Document.prototype && "replaceSync" in CSSStyleSheet.prototype) {
      const s = new CSSStyleSheet();
      s.replaceSync(m.style), this.renderRoot.adoptedStyleSheets = [s];
    } else {
      const s = document.createElement("style");
      s.innerText = m.style, this.renderRoot.append(s);
    }
    this.renderRoot.append(e);
  }
}
m.isSupported = "serial" in navigator;
m.isAllowed = window.isSecureContext;
m.style = `
  button {
    position: relative;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    padding: 10px 24px;
    color: var(--esp-tools-button-text-color, #fff);
    background-color: var(--esp-tools-button-color, #03a9f4);
    border: none;
    border-radius: var(--esp-tools-button-border-radius, 9999px);
  }
  button::before {
    content: " ";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    opacity: 0.2;
    border-radius: var(--esp-tools-button-border-radius, 9999px);
  }
  button:hover::before {
    background-color: rgba(255,255,255,.8);
  }
  button:focus {
    outline: none;
  }
  button:focus::before {
    background-color: white;
  }
  button:active::before {
    background-color: grey;
  }
  :host([active]) button {
    color: rgba(0, 0, 0, 0.38);
    background-color: rgba(0, 0, 0, 0.12);
    box-shadow: none;
    cursor: unset;
    pointer-events: none;
  }
  .hidden {
    display: none;
  }`;
customElements.define("esp-web-install-button", m);
function He(i) {
  const e = Date.now() - new Date(i).getTime(), t = Math.floor(e / 6e4);
  if (t < 60) return `${t}m ago`;
  const s = Math.floor(t / 60);
  if (s < 24) return `${s}h ago`;
  const r = Math.floor(s / 24);
  return r < 14 ? `${r}d ago` : `${Math.floor(r / 7)}w ago`;
}
const W = class W extends w {
  constructor() {
    super(), this._themeObserver = null, this.response = {}, this.href = "", this.version = "", this.flavor = "";
  }
  static get properties() {
    return {
      href: { type: String },
      response: { type: Object },
      version: { type: String },
      flavor: { type: String }
    };
  }
  get manifest() {
    return this.href + this.version + ".json?" + new URLSearchParams({ flavor: this.flavor });
  }
  connectedCallback() {
    super.connectedCallback(), this._syncTheme(), this._themeObserver = new MutationObserver(() => this._syncTheme()), this._themeObserver.observe(document.documentElement, {
      attributes: !0,
      attributeFilter: ["data-theme"]
    });
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._themeObserver?.disconnect(), this._themeObserver = null;
  }
  _syncTheme() {
    const e = document.documentElement.dataset.theme || "light";
    this.setAttribute("theme", e);
  }
  async firstUpdated() {
    const e = await fetch("https://api.github.com/repos/ESPresense/ESPresense/releases", { credentials: "same-origin" });
    if (!e.ok) throw new Error(`GitHub API error: ${e.status}`);
    const t = await e.json();
    this.response = t.filter((s) => s.assets.length > 5).reduce((s, r) => {
      const o = r.prerelease ? "Beta" : "Release";
      return (s[o] = s[o] || []).push(r), s;
    }, {}), this.version = this.response.Release?.[0]?.tag_name ?? "";
  }
  flavorChanged(e) {
    this.flavor = e.target.value;
  }
  versionChanged(e) {
    this.version = e.target.value;
  }
  render() {
    const { response: e } = this;
    return g`
      <div class="body">
        <div class="field-row">
          <label for="version">Version:</label>
          <select id="version" @change=${this.versionChanged}>
            ${Object.keys(e).reverse().map((t) => g`
              <optgroup label="${t}">
                ${e[t].map((s) => g`
                  <option value=${s.tag_name} ?selected=${s.tag_name === this.version}>
                    ${s.name} — ${He(s.created_at)}
                  </option>
                `)}
              </optgroup>
            `)}
          </select>
        </div>
        <p class="connect-hint">Connect your ESP device via USB, then click Connect:</p>
        <div class="install-row">
          <div class="field-row">
            <label for="flavor">Flavor:</label>
            <select id="flavor" @change=${this.flavorChanged}>
              <option value="">Standard</option>
              <option value="verbose">Verbose</option>
              <option value="m5atom">M5Atom</option>
              <option value="m5stickc">M5StickC</option>
              <option value="m5stickc-plus">M5StickC-plus</option>
              <option value="macchina-a0">Macchina A0</option>
            </select>
          </div>
          <esp-web-install-button manifest=${this.manifest}></esp-web-install-button>
        </div>
      </div>
    `;
  }
};
W.styles = ne`
    :host {
      font-family: sans-serif;
      display: flex;
      flex-direction: column;
      padding: 10px 0;
      border: none;
      border-radius: 2pt;
      box-shadow: 0 0 0 1pt rgb(238, 235, 238);
      outline: none;
      transition: .1s;
      background-color: rgb(245, 246, 250);
    }

    .body {
      display: flex;
      flex-direction: column;
      padding: 4px 10px;
      gap: 6px;
    }

    .field-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .field-row label {
      font-size: 13px;
      white-space: nowrap;
      min-width: 56px;
    }

    .field-row select {
      flex: 1;
      font-size: 13px;
      padding: 3px 6px;
      border: 1px solid rgb(210, 208, 210);
      border-radius: 3px;
      background: white;
    }

    .install-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 8px 0 4px;
      border-top: 1px solid rgb(230, 228, 230);
      margin-top: 2px;
    }

    .connect-hint {
      margin: 0;
      font-size: 12px;
      color: #666;
    }

    .powered {
      display: flex;
      justify-content: center;
      padding: 8px 10px 4px;
      font-size: 12px;
      gap: 8px;
    }

    /* Dark theme */
    :host([theme="dark"]) {
      background-color: rgb(30, 30, 35);
      box-shadow: 0 0 0 1pt rgb(60, 60, 65);
      color: rgb(220, 220, 220);
    }
    :host([theme="dark"]) .field-row select {
      background-color: rgb(45, 45, 50);
      color: rgb(220, 220, 220);
      border: 1px solid rgb(80, 80, 85);
    }
    :host([theme="dark"]) .field-row label { color: rgb(200, 200, 200); }
    :host([theme="dark"]) a { color: rgb(100, 160, 255); }
    :host([theme="dark"]) .install-row { border-top-color: rgb(60, 60, 65); }
    :host([theme="dark"]) .connect-hint { color: rgb(150, 150, 160); }
  `;
let D = W;
function B(i) {
  const e = Date.now() - new Date(i).getTime(), t = Math.floor(e / 6e4);
  if (t < 60) return `${t}m ago`;
  const s = Math.floor(t / 60);
  if (s < 24) return `${s}h ago`;
  const r = Math.floor(s / 24);
  return r < 14 ? `${r}d ago` : `${Math.floor(r / 7)}w ago`;
}
const F = class F extends w {
  constructor() {
    super(), this._themeObserver = null, this.href = "", this.run_id = -1, this.flavor = "", this.loading = !0, this.buildVersion = "", this.querySha = "", this.queryPr = "", this.shaMatched = !0, this.builds = [], this.sources = [], this.selectedKey = "", this.showInstall = !1, this.selectedBuild = null;
  }
  static get properties() {
    return {
      href: { type: String },
      manifest: { type: String },
      run_id: { type: Number },
      flavor: { type: String },
      loading: { type: Boolean },
      buildVersion: { type: String, attribute: "build-version" },
      querySha: { type: String },
      queryPr: { type: String },
      shaMatched: { type: Boolean },
      builds: { type: Array },
      sources: { type: Array },
      selectedKey: { type: String },
      showInstall: { type: Boolean },
      selectedBuild: { type: Object }
    };
  }
  get manifest() {
    return this.run_id < 0 ? "" : this.href + this.run_id + ".json?" + new URLSearchParams({ flavor: this.flavor });
  }
  connectedCallback() {
    super.connectedCallback(), this._syncTheme(), this._themeObserver = new MutationObserver(() => this._syncTheme()), this._themeObserver.observe(document.documentElement, {
      attributes: !0,
      attributeFilter: ["data-theme"]
    });
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._themeObserver?.disconnect(), this._themeObserver = null;
  }
  _syncTheme() {
    const e = document.documentElement.dataset.theme || "light";
    this.setAttribute("theme", e);
  }
  async firstUpdated() {
    try {
      const [e, t] = await Promise.all([
        fetch(
          "https://api.github.com/repos/ESPresense/ESPresense/actions/workflows/build.yml/runs?status=success&per_page=100",
          { credentials: "same-origin" }
        ),
        fetch(
          "https://api.github.com/repos/ESPresense/ESPresense/pulls?state=all&per_page=100",
          { credentials: "same-origin" }
        )
      ]);
      if (!e.ok) throw new Error(`GitHub API error: ${e.status}`);
      const s = await e.json(), r = /* @__PURE__ */ new Map();
      if (t.ok) {
        const a = await t.json();
        for (const h of a) r.set(h.number, h.title || "");
      }
      this.querySha = new URLSearchParams(window.location.search).get("sha")?.trim().toLowerCase() || "", this.queryPr = new URLSearchParams(window.location.search).get("pr")?.trim() || "";
      const o = s.workflow_runs || [], n = o.filter(
        (a) => a.pull_requests.length === 0 && a.head_repository?.full_name === "ESPresense/ESPresense"
      ), c = o.filter((a) => a.pull_requests.length > 0), l = (a) => ({
        id: a.id,
        age: B(a.created_at),
        sha: a.head_sha.substring(0, 7),
        message: a.head_commit?.message?.split(`
`)[0] ?? "",
        tag: a.pull_requests.length > 0 ? `PR #${a.pull_requests[0].number}` : "Nightly",
        subtitle: a.pull_requests.length > 0 && a.pull_requests[0].title || "",
        sourceKey: a.pull_requests.length > 0 ? `pr-${a.pull_requests[0].number}` : "nightly"
      });
      this.builds = [
        ...n.map(l),
        ...c.map(l)
      ];
      const d = [];
      n.length > 0 && d.push({
        key: "nightly",
        label: "Nightly",
        title: "Main branch builds",
        count: n.length,
        latestAge: B(n[0].created_at)
      });
      const p = /* @__PURE__ */ new Map();
      for (const a of c) {
        const h = a.pull_requests[0];
        p.has(h.number) || p.set(h.number, {
          key: `pr-${h.number}`,
          label: `PR #${h.number}`,
          title: r.get(h.number) || h.title || "",
          count: 0,
          latestAge: B(a.created_at)
        }), p.get(h.number).count++;
      }
      if (this.sources = [...d, ...p.values()], this.selectedKey = "", this.querySha) {
        const a = o.find((h) => h.head_sha?.toLowerCase().startsWith(this.querySha));
        if (this.shaMatched = !!a, a) {
          const h = this.builds.find((b) => b.id === a.id);
          h && (this.selectedKey = h.sourceKey, this.selectedBuild = h, this.run_id = h.id, this.showInstall = !0);
        }
      } else if (this.queryPr) {
        const a = `pr-${this.queryPr}`;
        this.sources.find((h) => h.key === a) && (this.selectedKey = a);
      }
    } finally {
      this.loading = !1;
    }
  }
  flavorChanged(e) {
    this.flavor = e.target.value;
  }
  selectSource(e) {
    this.selectedKey = e, this.selectedBuild = null, this.run_id = -1;
  }
  selectBuild(e) {
    this.run_id = e.id, this.selectedBuild = e, this.shaMatched = !0;
  }
  goBack() {
    this.selectedKey = "", this.selectedBuild = null, this.run_id = -1;
  }
  _visibleBuilds() {
    return this.builds.filter((e) => e.sourceKey === this.selectedKey);
  }
  _flavorSelect() {
    return g`
      <select id="flavor" @change=${this.flavorChanged}>
        <option value="">Standard</option>
        <option value="verbose">Verbose</option>
        <option value="m5atom">M5Atom</option>
        <option value="m5stickc">M5StickC</option>
        <option value="m5stickc-plus">M5StickC-plus</option>
        <option value="macchina-a0">Macchina A0</option>
      </select>
    `;
  }
  _renderSourcePicker() {
    return g`
      <div class="table-wrap" style="padding: 4px 10px">
        <div class="table-label">Select a branch or PR</div>
        <div class="tbl">
          ${this.sources.map((e) => g`
            <div class="tbl-row src-row" @click=${() => this.selectSource(e.key)}>
              <div>
                <div class="src-label ${e.key === "nightly" ? "nightly" : "pr"}">${e.label}</div>
                <div class="src-meta">${e.latestAge} · ${e.count} build${e.count !== 1 ? "s" : ""}</div>
              </div>
              <span class="src-title" title=${e.title}>${e.title}</span>
            </div>
          `)}
        </div>
      </div>
    `;
  }
  _renderBuildPicker() {
    const e = this._visibleBuilds(), t = this.sources.find((s) => s.key === this.selectedKey);
    return g`
      <div class="install-screen">
        <button class="back-btn" @click=${this.goBack}>← Back</button>
        <div class="table-label">${t?.label}${t?.title ? g` — <span style="font-weight:400">${t.title}</span>` : ""}</div>
        <div class="tbl" style="margin-bottom:10px">
          ${e.map((s) => g`
            <div class="tbl-row bld-row ${this.selectedBuild?.id === s.id ? "selected" : ""}" @click=${() => this.selectBuild(s)}>
              <span class="bld-age">${s.age}</span>
              <span class="bld-sha">${s.sha}</span>
              <span class="bld-msg" title=${s.message}>${s.message}</span>
            </div>
          `)}
        </div>
        ${this.selectedBuild ? g`
            <p class="connect-hint">Connect your ESP device via USB, then click Connect:</p>
            <div class="install-row">
              <div class="flavor-row">
                <label for="flavor">Flavor:</label>
                ${this._flavorSelect()}
              </div>
              <esp-web-install-button manifest=${this.manifest}></esp-web-install-button>
            </div>` : g`<div class="empty-state">Select a build above to continue</div>`}
      </div>
    `;
  }
  render() {
    return g`
      ${this.loading ? g`<div style="padding:10px"><span>Loading builds...</span></div>` : this.selectedKey ? this._renderBuildPicker() : this._renderSourcePicker()}

    `;
  }
};
F.styles = ne`
    :host {
      font-family: sans-serif;
      display: flex;
      flex-direction: column;
      padding: 10px 0;
      border: none;
      border-radius: 2pt;
      box-shadow: 0 0 0 1pt rgb(238, 235, 238);
      outline: none;
      transition: .1s;
      background-color: rgb(245, 246, 250);
    }

    :host label { margin-right: 5px; }

    :host .powered {
      display: flex;
      justify-content: center;
      padding-top: 12px;
      font-size: 12px;
      gap: 8px;
    }

    /* Tables */
    .tables {
      display: flex;
      gap: 8px;
      padding: 4px 10px;
    }

    .table-wrap {
      flex: 1;
      min-width: 0;
    }

    .table-label {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #888;
      padding: 0 2px 4px;
    }

    .tbl {
      border: 1px solid rgb(220, 218, 220);
      border-radius: 4px;
      font-size: 12px;
      max-height: 250px;
      overflow-y: auto;
    }

    .tbl-row {
      display: grid;
      padding: 6px 10px;
      cursor: pointer;
      border-bottom: 1px solid rgb(238, 235, 238);
      align-items: center;
      line-height: 1.4;
      gap: 0 8px;
    }

    .tbl-row:last-child { border-bottom: none; }
    .tbl-row:hover { background: rgba(0,0,0,0.04); }

    .tbl-row.selected {
      background: rgba(59, 130, 246, 0.1);
      border-left: 3px solid rgb(59, 130, 246);
      padding-left: 7px;
    }

    /* Source table columns: label | title */
    .src-row {
      grid-template-columns: 78px 1fr;
    }

    .src-label {
      font-weight: 700;
      white-space: nowrap;
    }
    .src-label.nightly { color: rgb(16, 124, 16); }
    .src-label.pr { color: rgb(130, 80, 223); }

    .src-title {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #333;
    }

    .src-meta {
      font-size: 11px;
      color: #888;
      white-space: nowrap;
    }

    /* Build table columns: age | sha | message */
    .bld-row {
      grid-template-columns: 54px 52px 1fr;
    }

    .bld-age { color: #888; white-space: nowrap; }
    .bld-sha { font-family: monospace; color: #666; }
    .bld-msg {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #333;
    }

    .empty-state {
      padding: 12px 10px;
      color: #aaa;
      font-size: 12px;
      text-align: center;
    }

    /* Install screen */
    .install-screen {
      display: flex;
      flex-direction: column;
      padding: 0 10px;
    }

    .back-btn {
      background: none;
      border: none;
      color: rgb(59, 130, 246);
      cursor: pointer;
      font-size: 13px;
      padding: 4px 0 8px 0;
      text-align: left;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .back-btn:hover { text-decoration: underline; }

    .build-summary {
      background: rgb(237, 237, 242);
      border-radius: 4px;
      padding: 8px 12px;
      margin-bottom: 10px;
      font-size: 13px;
      line-height: 1.5;
    }

    .summary-tag { font-weight: 700; }
    .summary-tag.nightly { color: rgb(16, 124, 16); }
    .summary-tag.pr { color: rgb(130, 80, 223); }
    .summary-meta { color: #666; font-size: 12px; }
    .summary-desc { margin-top: 2px; color: #333; }

    .flavor-row {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
    }

    .connect-hint {
      margin: 6px 0 4px;
      font-size: 12px;
      color: #666;
    }

    .install-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 8px 0 4px;
      border-top: 1px solid rgb(230, 228, 230);
      margin-top: 6px;
    }

    /* Dark theme */
    :host([theme="dark"]) {
      background-color: rgb(30, 30, 35);
      box-shadow: 0 0 0 1pt rgb(60, 60, 65);
      color: rgb(220, 220, 220);
    }
    :host([theme="dark"]) select {
      background-color: rgb(45, 45, 50);
      color: rgb(220, 220, 220);
      border: 1px solid rgb(80, 80, 85);
    }
    :host([theme="dark"]) label { color: rgb(200, 200, 200); }
    :host([theme="dark"]) a { color: rgb(100, 160, 255); }
    :host([theme="dark"]) .tbl { border-color: rgb(60, 60, 65); }
    :host([theme="dark"]) .tbl-row { border-bottom-color: rgb(50, 50, 55); }
    :host([theme="dark"]) .tbl-row:hover { background: rgba(255,255,255,0.05); }
    :host([theme="dark"]) .tbl-row.selected { background: rgba(59,130,246,0.15); }
    :host([theme="dark"]) .src-title { color: rgb(200, 200, 200); }
    :host([theme="dark"]) .bld-msg { color: rgb(200, 200, 200); }
    :host([theme="dark"]) .bld-sha { color: rgb(150, 150, 160); }
    :host([theme="dark"]) .table-label { color: rgb(130, 130, 140); }
    :host([theme="dark"]) .build-summary { background: rgb(40, 40, 48); }
    :host([theme="dark"]) .summary-meta { color: rgb(150, 150, 160); }
    :host([theme="dark"]) .summary-desc { color: rgb(200, 200, 200); }
    :host([theme="dark"]) .back-btn { color: rgb(100, 160, 255); }
  `;
let L = F;
window.customElements.define("espresense-releases", D);
window.customElements.define("espresense-artifacts", L);
