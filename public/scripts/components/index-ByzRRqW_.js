const U = globalThis, z = U.ShadowRoot && (U.ShadyCSS === void 0 || U.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, q = /* @__PURE__ */ Symbol(), Z = /* @__PURE__ */ new WeakMap();
let oe = class {
  constructor(e, t, s) {
    if (this._$cssResult$ = !0, s !== q) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = t;
  }
  get styleSheet() {
    let e = this.o;
    const t = this.t;
    if (z && e === void 0) {
      const s = t !== void 0 && t.length === 1;
      s && (e = Z.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), s && Z.set(t, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const ue = (o) => new oe(typeof o == "string" ? o : o + "", void 0, q), re = (o, ...e) => {
  const t = o.length === 1 ? o[0] : e.reduce((s, i, r) => s + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + o[r + 1], o[0]);
  return new oe(t, o, q);
}, fe = (o, e) => {
  if (z) o.adoptedStyleSheets = e.map((t) => t instanceof CSSStyleSheet ? t : t.styleSheet);
  else for (const t of e) {
    const s = document.createElement("style"), i = U.litNonce;
    i !== void 0 && s.setAttribute("nonce", i), s.textContent = t.cssText, o.appendChild(s);
  }
}, J = z ? (o) => o : (o) => o instanceof CSSStyleSheet ? ((e) => {
  let t = "";
  for (const s of e.cssRules) t += s.cssText;
  return ue(t);
})(o) : o;
const { is: me, defineProperty: $e, getOwnPropertyDescriptor: ge, getOwnPropertyNames: be, getOwnPropertySymbols: ve, getPrototypeOf: _e } = Object, T = globalThis, K = T.trustedTypes, ye = K ? K.emptyScript : "", Ae = T.reactiveElementPolyfillSupport, x = (o, e) => o, L = { toAttribute(o, e) {
  switch (e) {
    case Boolean:
      o = o ? ye : null;
      break;
    case Object:
    case Array:
      o = o == null ? o : JSON.stringify(o);
  }
  return o;
}, fromAttribute(o, e) {
  let t = o;
  switch (e) {
    case Boolean:
      t = o !== null;
      break;
    case Number:
      t = o === null ? null : Number(o);
      break;
    case Object:
    case Array:
      try {
        t = JSON.parse(o);
      } catch {
        t = null;
      }
  }
  return t;
} }, ne = (o, e) => !me(o, e), Y = { attribute: !0, type: String, converter: L, reflect: !1, useDefault: !1, hasChanged: ne };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), T.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let y = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, t = Y) {
    if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
      const s = /* @__PURE__ */ Symbol(), i = this.getPropertyDescriptor(e, s, t);
      i !== void 0 && $e(this.prototype, e, i);
    }
  }
  static getPropertyDescriptor(e, t, s) {
    const { get: i, set: r } = ge(this.prototype, e) ?? { get() {
      return this[t];
    }, set(n) {
      this[t] = n;
    } };
    return { get: i, set(n) {
      const l = i?.call(this);
      r?.call(this, n), this.requestUpdate(e, l, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? Y;
  }
  static _$Ei() {
    if (this.hasOwnProperty(x("elementProperties"))) return;
    const e = _e(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(x("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(x("properties"))) {
      const t = this.properties, s = [...be(t), ...ve(t)];
      for (const i of s) this.createProperty(i, t[i]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const t = litPropertyMetadata.get(e);
      if (t !== void 0) for (const [s, i] of t) this.elementProperties.set(s, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t, s] of this.elementProperties) {
      const i = this._$Eu(t, s);
      i !== void 0 && this._$Eh.set(i, t);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const t = [];
    if (Array.isArray(e)) {
      const s = new Set(e.flat(1 / 0).reverse());
      for (const i of s) t.unshift(J(i));
    } else e !== void 0 && t.push(J(e));
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
    return fe(e, this.constructor.elementStyles), e;
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
    const s = this.constructor.elementProperties.get(e), i = this.constructor._$Eu(e, s);
    if (i !== void 0 && s.reflect === !0) {
      const r = (s.converter?.toAttribute !== void 0 ? s.converter : L).toAttribute(t, s.type);
      this._$Em = e, r == null ? this.removeAttribute(i) : this.setAttribute(i, r), this._$Em = null;
    }
  }
  _$AK(e, t) {
    const s = this.constructor, i = s._$Eh.get(e);
    if (i !== void 0 && this._$Em !== i) {
      const r = s.getPropertyOptions(i), n = typeof r.converter == "function" ? { fromAttribute: r.converter } : r.converter?.fromAttribute !== void 0 ? r.converter : L;
      this._$Em = i;
      const l = n.fromAttribute(t, r.type);
      this[i] = l ?? this._$Ej?.get(i) ?? l, this._$Em = null;
    }
  }
  requestUpdate(e, t, s, i = !1, r) {
    if (e !== void 0) {
      const n = this.constructor;
      if (i === !1 && (r = this[e]), s ??= n.getPropertyOptions(e), !((s.hasChanged ?? ne)(r, t) || s.useDefault && s.reflect && r === this._$Ej?.get(e) && !this.hasAttribute(n._$Eu(e, s)))) return;
      this.C(e, t, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, t, { useDefault: s, reflect: i, wrapped: r }, n) {
    s && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, n ?? t ?? this[e]), r !== !0 || n !== void 0) || (this._$AL.has(e) || (this.hasUpdated || s || (t = void 0), this._$AL.set(e, t)), i === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
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
        for (const [i, r] of this._$Ep) this[i] = r;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [i, r] of s) {
        const { wrapped: n } = r, l = this[i];
        n !== !0 || this._$AL.has(i) || l === void 0 || this.C(i, void 0, r, l);
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
y.elementStyles = [], y.shadowRootOptions = { mode: "open" }, y[x("elementProperties")] = /* @__PURE__ */ new Map(), y[x("finalized")] = /* @__PURE__ */ new Map(), Ae?.({ ReactiveElement: y }), (T.reactiveElementVersions ??= []).push("2.1.2");
const B = globalThis, G = (o) => o, R = B.trustedTypes, Q = R ? R.createPolicy("lit-html", { createHTML: (o) => o }) : void 0, ae = "$lit$", g = `lit$${Math.random().toFixed(9).slice(2)}$`, he = "?" + g, Se = `<${he}>`, _ = document, C = () => _.createComment(""), P = (o) => o === null || typeof o != "object" && typeof o != "function", V = Array.isArray, we = (o) => V(o) || typeof o?.[Symbol.iterator] == "function", H = `[ 	
\f\r]`, E = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, X = /-->/g, ee = />/g, b = RegExp(`>|${H}(?:([^\\s"'>=/]+)(${H}*=${H}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), te = /'/g, se = /"/g, le = /^(?:script|style|textarea|title)$/i, ce = (o) => (e, ...t) => ({ _$litType$: o, strings: e, values: t }), u = ce(1), He = ce(2), S = /* @__PURE__ */ Symbol.for("lit-noChange"), d = /* @__PURE__ */ Symbol.for("lit-nothing"), ie = /* @__PURE__ */ new WeakMap(), v = _.createTreeWalker(_, 129);
function de(o, e) {
  if (!V(o) || !o.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Q !== void 0 ? Q.createHTML(e) : e;
}
const Ee = (o, e) => {
  const t = o.length - 1, s = [];
  let i, r = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", n = E;
  for (let l = 0; l < t; l++) {
    const a = o[l];
    let c, p, h = -1, m = 0;
    for (; m < a.length && (n.lastIndex = m, p = n.exec(a), p !== null); ) m = n.lastIndex, n === E ? p[1] === "!--" ? n = X : p[1] !== void 0 ? n = ee : p[2] !== void 0 ? (le.test(p[2]) && (i = RegExp("</" + p[2], "g")), n = b) : p[3] !== void 0 && (n = b) : n === b ? p[0] === ">" ? (n = i ?? E, h = -1) : p[1] === void 0 ? h = -2 : (h = n.lastIndex - p[2].length, c = p[1], n = p[3] === void 0 ? b : p[3] === '"' ? se : te) : n === se || n === te ? n = b : n === X || n === ee ? n = E : (n = b, i = void 0);
    const $ = n === b && o[l + 1].startsWith("/>") ? " " : "";
    r += n === E ? a + Se : h >= 0 ? (s.push(c), a.slice(0, h) + ae + a.slice(h) + g + $) : a + g + (h === -2 ? l : $);
  }
  return [de(o, r + (o[t] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), s];
};
class k {
  constructor({ strings: e, _$litType$: t }, s) {
    let i;
    this.parts = [];
    let r = 0, n = 0;
    const l = e.length - 1, a = this.parts, [c, p] = Ee(e, t);
    if (this.el = k.createElement(c, s), v.currentNode = this.el.content, t === 2 || t === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (i = v.nextNode()) !== null && a.length < l; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const h of i.getAttributeNames()) if (h.endsWith(ae)) {
          const m = p[n++], $ = i.getAttribute(h).split(g), O = /([.?@])?(.*)/.exec(m);
          a.push({ type: 1, index: r, name: O[2], strings: $, ctor: O[1] === "." ? Ce : O[1] === "?" ? Pe : O[1] === "@" ? ke : N }), i.removeAttribute(h);
        } else h.startsWith(g) && (a.push({ type: 6, index: r }), i.removeAttribute(h));
        if (le.test(i.tagName)) {
          const h = i.textContent.split(g), m = h.length - 1;
          if (m > 0) {
            i.textContent = R ? R.emptyScript : "";
            for (let $ = 0; $ < m; $++) i.append(h[$], C()), v.nextNode(), a.push({ type: 2, index: ++r });
            i.append(h[m], C());
          }
        }
      } else if (i.nodeType === 8) if (i.data === he) a.push({ type: 2, index: r });
      else {
        let h = -1;
        for (; (h = i.data.indexOf(g, h + 1)) !== -1; ) a.push({ type: 7, index: r }), h += g.length - 1;
      }
      r++;
    }
  }
  static createElement(e, t) {
    const s = _.createElement("template");
    return s.innerHTML = e, s;
  }
}
function w(o, e, t = o, s) {
  if (e === S) return e;
  let i = s !== void 0 ? t._$Co?.[s] : t._$Cl;
  const r = P(e) ? void 0 : e._$litDirective$;
  return i?.constructor !== r && (i?._$AO?.(!1), r === void 0 ? i = void 0 : (i = new r(o), i._$AT(o, t, s)), s !== void 0 ? (t._$Co ??= [])[s] = i : t._$Cl = i), i !== void 0 && (e = w(o, i._$AS(o, e.values), i, s)), e;
}
class xe {
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
    const { el: { content: t }, parts: s } = this._$AD, i = (e?.creationScope ?? _).importNode(t, !0);
    v.currentNode = i;
    let r = v.nextNode(), n = 0, l = 0, a = s[0];
    for (; a !== void 0; ) {
      if (n === a.index) {
        let c;
        a.type === 2 ? c = new M(r, r.nextSibling, this, e) : a.type === 1 ? c = new a.ctor(r, a.name, a.strings, this, e) : a.type === 6 && (c = new Me(r, this, e)), this._$AV.push(c), a = s[++l];
      }
      n !== a?.index && (r = v.nextNode(), n++);
    }
    return v.currentNode = _, i;
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
  constructor(e, t, s, i) {
    this.type = 2, this._$AH = d, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = s, this.options = i, this._$Cv = i?.isConnected ?? !0;
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
    e = w(this, e, t), P(e) ? e === d || e == null || e === "" ? (this._$AH !== d && this._$AR(), this._$AH = d) : e !== this._$AH && e !== S && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : we(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== d && P(this._$AH) ? this._$AA.nextSibling.data = e : this.T(_.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: t, _$litType$: s } = e, i = typeof s == "number" ? this._$AC(e) : (s.el === void 0 && (s.el = k.createElement(de(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === i) this._$AH.p(t);
    else {
      const r = new xe(i, this), n = r.u(this.options);
      r.p(t), this.T(n), this._$AH = r;
    }
  }
  _$AC(e) {
    let t = ie.get(e.strings);
    return t === void 0 && ie.set(e.strings, t = new k(e)), t;
  }
  k(e) {
    V(this._$AH) || (this._$AH = [], this._$AR());
    const t = this._$AH;
    let s, i = 0;
    for (const r of e) i === t.length ? t.push(s = new M(this.O(C()), this.O(C()), this, this.options)) : s = t[i], s._$AI(r), i++;
    i < t.length && (this._$AR(s && s._$AB.nextSibling, i), t.length = i);
  }
  _$AR(e = this._$AA.nextSibling, t) {
    for (this._$AP?.(!1, !0, t); e !== this._$AB; ) {
      const s = G(e).nextSibling;
      G(e).remove(), e = s;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class N {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, t, s, i, r) {
    this.type = 1, this._$AH = d, this._$AN = void 0, this.element = e, this.name = t, this._$AM = i, this.options = r, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = d;
  }
  _$AI(e, t = this, s, i) {
    const r = this.strings;
    let n = !1;
    if (r === void 0) e = w(this, e, t, 0), n = !P(e) || e !== this._$AH && e !== S, n && (this._$AH = e);
    else {
      const l = e;
      let a, c;
      for (e = r[0], a = 0; a < r.length - 1; a++) c = w(this, l[s + a], t, a), c === S && (c = this._$AH[a]), n ||= !P(c) || c !== this._$AH[a], c === d ? e = d : e !== d && (e += (c ?? "") + r[a + 1]), this._$AH[a] = c;
    }
    n && !i && this.j(e);
  }
  j(e) {
    e === d ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Ce extends N {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === d ? void 0 : e;
  }
}
class Pe extends N {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== d);
  }
}
class ke extends N {
  constructor(e, t, s, i, r) {
    super(e, t, s, i, r), this.type = 5;
  }
  _$AI(e, t = this) {
    if ((e = w(this, e, t, 0) ?? d) === S) return;
    const s = this._$AH, i = e === d && s !== d || e.capture !== s.capture || e.once !== s.once || e.passive !== s.passive, r = e !== d && (s === d || i);
    i && this.element.removeEventListener(this.name, this, s), r && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Me {
  constructor(e, t, s) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    w(this, e);
  }
}
const Oe = B.litHtmlPolyfillSupport;
Oe?.(k, M), (B.litHtmlVersions ??= []).push("3.3.2");
const Ue = (o, e, t) => {
  const s = t?.renderBefore ?? e;
  let i = s._$litPart$;
  if (i === void 0) {
    const r = t?.renderBefore ?? null;
    s._$litPart$ = i = new M(e.insertBefore(C(), r), r, void 0, t ?? {});
  }
  return i._$AI(o), i;
};
const W = globalThis;
class A extends y {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const t = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Ue(t, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return S;
  }
}
A._$litElement$ = !0, A.finalized = !0, W.litElementHydrateSupport?.({ LitElement: A });
const Re = W.litElementPolyfillSupport;
Re?.({ LitElement: A });
(W.litElementVersions ??= []).push("4.2.2");
const pe = async (o) => {
  import("./install-dialog-my3iFD8e.js");
  let e;
  try {
    e = await navigator.serial.requestPort();
  } catch (s) {
    if (s.name === "NotFoundError") {
      import("./index-CMVE8ms6.js").then((i) => i.openNoPortPickedDialog(() => pe(o)));
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
  t.port = e, t.manifestPath = o.manifest || o.getAttribute("manifest"), t.overrides = o.overrides, t.addEventListener("closed", () => {
    e.close();
  }, { once: !0 }), document.body.appendChild(t);
};
class f extends HTMLElement {
  connectedCallback() {
    if (this.renderRoot)
      return;
    if (this.renderRoot = this.attachShadow({ mode: "open" }), !f.isSupported || !f.isAllowed) {
      this.toggleAttribute("install-unsupported", !0), this.renderRoot.innerHTML = f.isAllowed ? "<slot name='unsupported'>Your browser does not support installing things on ESP devices. Use Google Chrome or Microsoft Edge.</slot>" : "<slot name='not-allowed'>You can only install ESP devices on HTTPS websites or on the localhost.</slot>";
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
      s.replaceSync(f.style), this.renderRoot.adoptedStyleSheets = [s];
    } else {
      const s = document.createElement("style");
      s.innerText = f.style, this.renderRoot.append(s);
    }
    this.renderRoot.append(e);
  }
}
f.isSupported = "serial" in navigator;
f.isAllowed = window.isSecureContext;
f.style = `
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
customElements.define("esp-web-install-button", f);
const I = class I extends A {
  constructor() {
    super(), this._themeObserver = null, this.response = /* @__PURE__ */ new Map(), this.href = "", this.version = "", this.flavor = "";
  }
  static get properties() {
    return {
      href: { type: String },
      manifest: { type: String },
      response: { type: Map },
      version: { type: String },
      flavor: { type: String }
    };
  }
  get manifest() {
    const e = new URLSearchParams({
      flavor: this.flavor
    });
    return this.href + this.version + ".json?" + e.toString();
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
  firstUpdated() {
    fetch("https://api.github.com/repos/ESPresense/ESPresense/releases", { credentials: "same-origin" }).then((e) => e.json()).then((e) => {
      this.response = e.filter((t) => t.assets.length > 5).reduce((t, s) => (t[s.prerelease ? "Beta" : "Release"] ? t[s.prerelease ? "Beta" : "Release"].push(s) : t[s.prerelease ? "Beta" : "Release"] = [s], t), /* @__PURE__ */ new Map()), console.log(this.response), this.version = this.response.Release[0].tag_name;
    });
  }
  flavorChanged(e) {
    this.flavor = e.target.value, console.log(this.flavor);
  }
  versionChanged(e) {
    this.version = e.target.value, console.log(this.version);
  }
  render() {
    const { response: e } = this;
    return u`
      <div><label for="flavor">Flavor:</label><select id="flavor" @change=${this.flavorChanged}><option value="">Standard</option><option value="cdc">Cdc</option><option value="verbose">Verbose</option><option value="m5atom">M5Atom</option><option value="m5stickc">M5StickC</option><option value="m5stickc-plus">M5StickC-plus</option><option value="macchina-a0">Macchina A0</option></select></div>
      <div><label for="version">Version:</label><select id="version" @change=${this.versionChanged}>>${Object.keys(e).reverse().map((t) => u` <optgroup label="${t}">${e[t].map((s) => u` <option value=${s.tag_name} ?selected=${s.tag_name == this.version}>${s.name}</option> `)}</optgroup>`)}</select></div>
      <div class="but"><esp-web-install-button manifest=${this.manifest}></esp-web-install-button></div>
      <div class="powered"><label>Powered by</label><a href="https://esphome.github.io/esp-web-tools/" target="_blank">ESP Web Tools</a></div>
    `;
  }
};
I.styles = re`
    :host {
      font-family: sans-serif;
    }

    :host label {
      margin-right: 5px;
    }

    :host .powered {
      display: flex;
      justify-content: center;
      padding-top: 12px;
      font-size: 12px;
    }

    :host {
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

    :host div {
      padding: 5px 10px;
      display: flex;
    }

    :host div.but {
      margin: 0 auto;
      display: flex;
    }

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

    :host([theme="dark"]) label {
      color: rgb(200, 200, 200);
    }

    :host([theme="dark"]) a {
      color: rgb(100, 160, 255);
    }
  `;
let j = I;
const F = class F extends A {
  constructor() {
    super(), this._themeObserver = null, this.response = /* @__PURE__ */ new Map(), this.href = "", this.run_id = -1, this.flavor = "", this.loading = !0, this.buildVersion = "", this.querySha = "", this.shaMatched = !0;
  }
  static get properties() {
    return {
      href: { type: String },
      manifest: { type: String },
      response: { type: Map },
      run_id: { type: Number },
      flavor: { type: String },
      loading: { type: Boolean },
      buildVersion: { type: String, attribute: "build-version" },
      querySha: { type: String },
      shaMatched: { type: Boolean }
    };
  }
  get manifest() {
    if (this.run_id < 0) return "";
    const e = new URLSearchParams({
      flavor: this.flavor
    });
    return this.href + this.run_id + ".json?" + e.toString();
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
  isSupportedRun(e) {
    return e.pull_requests.length > 0 || e.head_branch == "main" && e.head_repository.full_name == "ESPresense/ESPresense";
  }
  async firstUpdated() {
    try {
      const t = await (await fetch("https://api.github.com/repos/ESPresense/ESPresense/actions/workflows/build.yml/runs?status=success&per_page=100", { credentials: "same-origin" })).json();
      this.querySha = new URLSearchParams(window.location.search).get("sha")?.trim().toLowerCase() || "";
      const s = t.workflow_runs.filter((r) => this.isSupportedRun(r)), i = this.querySha ? s.find((r) => r.head_sha?.toLowerCase().startsWith(this.querySha)) : null;
      this.shaMatched = !this.querySha || !!i, this.run_id = this.querySha ? i?.id ?? -1 : s[0]?.id ?? -1, this.response = s.reduce((r, n) => (r[n.head_branch] ? r[n.head_branch].push(n) : r[n.head_branch] = [n], r), /* @__PURE__ */ new Map());
    } finally {
      this.loading = !1;
    }
  }
  flavorChanged(e) {
    this.flavor = e.target.value, console.log(this.flavor);
  }
  versionChanged(e) {
    const t = Number(e.target.value);
    this.run_id = Number.isFinite(t) ? t : -1, this.shaMatched = this.run_id > 0, console.log(this.run_id);
  }
  render() {
    const { response: e } = this;
    return u`
      <div><label for="flavor">Flavor:</label><select id="flavor" @change=${this.flavorChanged}><option value="">Standard</option><option value="cdc">Cdc</option><option value="verbose">Verbose</option><option value="m5atom">M5Atom</option><option value="m5stickc">M5StickC</option><option value="m5stickc-plus">M5StickC-plus</option><option value="macchina-a0">Macchina A0</option></select></div>
      ${this.loading ? u`<div><label for="version">Artifact:</label><span>Loading artifacts...</span></div>` : u`<div><label for="version">Artifact:</label><select id="version" .value=${this.shaMatched ? String(this.run_id) : ""} @change=${this.versionChanged}>${this.shaMatched ? null : u`<option value="" selected disabled>No match for sha ${this.querySha}</option>`}${Object.keys(e).reverse().map((t) => u` <optgroup label="${t}">${e[t].map((s) => u` <option value=${s.id} ?selected=${Number(s.id) === this.run_id}>${s.head_sha.substring(0, 7)}: ${s.head_commit.message.split(`
`)[0]}</option> `)}</optgroup>`)}</select></div>`}
      ${this.loading ? u`<div class="but">Loading artifacts...</div>` : this.run_id < 0 ? u`<div class="but">Select an artifact to continue.</div>` : u`<div class="but"><esp-web-install-button manifest=${this.manifest}></esp-web-install-button></div>`}
      <div class="powered"><label>UI ${this.buildVersion || "dev"}</label><label>Powered by</label><a href="https://esphome.github.io/esp-web-tools/" target="_blank">ESP Web Tools</a></div>
    `;
  }
};
F.styles = re`
    :host {
      font-family: sans-serif;
    }

    :host label {
      margin-right: 5px;
    }

    :host .powered {
      display: flex;
      justify-content: center;
      padding-top: 12px;
      font-size: 12px;
      gap: 8px;
    }

    :host {
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

    :host div {
      padding: 5px 10px;
      display: flex;
    }

    :host div.but {
      margin: 0 auto;
      display: flex;
    }

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

    :host([theme="dark"]) label {
      color: rgb(200, 200, 200);
    }

    :host([theme="dark"]) a {
      color: rgb(100, 160, 255);
    }
  `;
let D = F;
window.customElements.define("espresense-releases", j);
window.customElements.define("espresense-artifacts", D);
export {
  d as A,
  Ue as D,
  S as E,
  re as a,
  u as b,
  ne as f,
  A as i,
  L as u,
  He as w
};
