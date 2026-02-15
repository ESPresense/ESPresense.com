const k = globalThis, z = k.ShadowRoot && (k.ShadyCSS === void 0 || k.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, q = /* @__PURE__ */ Symbol(), Z = /* @__PURE__ */ new WeakMap();
let ot = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== q) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (z && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = Z.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && Z.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const ut = (o) => new ot(typeof o == "string" ? o : o + "", void 0, q), rt = (o, ...t) => {
  const e = o.length === 1 ? o[0] : t.reduce((s, i, r) => s + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + o[r + 1], o[0]);
  return new ot(e, o, q);
}, ft = (o, t) => {
  if (z) o.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), i = k.litNonce;
    i !== void 0 && s.setAttribute("nonce", i), s.textContent = e.cssText, o.appendChild(s);
  }
}, J = z ? (o) => o : (o) => o instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return ut(e);
})(o) : o;
const { is: $t, defineProperty: gt, getOwnPropertyDescriptor: mt, getOwnPropertyNames: vt, getOwnPropertySymbols: _t, getPrototypeOf: bt } = Object, N = globalThis, K = N.trustedTypes, yt = K ? K.emptyScript : "", At = N.reactiveElementPolyfillSupport, x = (o, t) => o, L = { toAttribute(o, t) {
  switch (t) {
    case Boolean:
      o = o ? yt : null;
      break;
    case Object:
    case Array:
      o = o == null ? o : JSON.stringify(o);
  }
  return o;
}, fromAttribute(o, t) {
  let e = o;
  switch (t) {
    case Boolean:
      e = o !== null;
      break;
    case Number:
      e = o === null ? null : Number(o);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(o);
      } catch {
        e = null;
      }
  }
  return e;
} }, nt = (o, t) => !$t(o, t), Y = { attribute: !0, type: String, converter: L, reflect: !1, useDefault: !1, hasChanged: nt };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), N.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let y = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = Y) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = /* @__PURE__ */ Symbol(), i = this.getPropertyDescriptor(t, s, e);
      i !== void 0 && gt(this.prototype, t, i);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: i, set: r } = mt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(n) {
      this[e] = n;
    } };
    return { get: i, set(n) {
      const l = i?.call(this);
      r?.call(this, n), this.requestUpdate(t, l, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Y;
  }
  static _$Ei() {
    if (this.hasOwnProperty(x("elementProperties"))) return;
    const t = bt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(x("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(x("properties"))) {
      const e = this.properties, s = [...vt(e), ..._t(e)];
      for (const i of s) this.createProperty(i, e[i]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [s, i] of e) this.elementProperties.set(s, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, s] of this.elementProperties) {
      const i = this._$Eu(e, s);
      i !== void 0 && this._$Eh.set(i, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const i of s) e.unshift(J(i));
    } else t !== void 0 && e.push(J(t));
    return e;
  }
  static _$Eu(t, e) {
    const s = e.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t) => t(this));
  }
  addController(t) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(t), this.renderRoot !== void 0 && this.isConnected && t.hostConnected?.();
  }
  removeController(t) {
    this._$EO?.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const s of e.keys()) this.hasOwnProperty(s) && (t.set(s, this[s]), delete this[s]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return ft(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, e, s) {
    this._$AK(t, s);
  }
  _$ET(t, e) {
    const s = this.constructor.elementProperties.get(t), i = this.constructor._$Eu(t, s);
    if (i !== void 0 && s.reflect === !0) {
      const r = (s.converter?.toAttribute !== void 0 ? s.converter : L).toAttribute(e, s.type);
      this._$Em = t, r == null ? this.removeAttribute(i) : this.setAttribute(i, r), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const s = this.constructor, i = s._$Eh.get(t);
    if (i !== void 0 && this._$Em !== i) {
      const r = s.getPropertyOptions(i), n = typeof r.converter == "function" ? { fromAttribute: r.converter } : r.converter?.fromAttribute !== void 0 ? r.converter : L;
      this._$Em = i;
      const l = n.fromAttribute(e, r.type);
      this[i] = l ?? this._$Ej?.get(i) ?? l, this._$Em = null;
    }
  }
  requestUpdate(t, e, s, i = !1, r) {
    if (t !== void 0) {
      const n = this.constructor;
      if (i === !1 && (r = this[t]), s ??= n.getPropertyOptions(t), !((s.hasChanged ?? nt)(r, e) || s.useDefault && s.reflect && r === this._$Ej?.get(t) && !this.hasAttribute(n._$Eu(t, s)))) return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: i, wrapped: r }, n) {
    s && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, n ?? e ?? this[t]), r !== !0 || n !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)), i === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
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
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), this._$EO?.forEach((s) => s.hostUpdate?.()), this.update(e)) : this._$EM();
    } catch (s) {
      throw t = !1, this._$EM(), s;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
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
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
y.elementStyles = [], y.shadowRootOptions = { mode: "open" }, y[x("elementProperties")] = /* @__PURE__ */ new Map(), y[x("finalized")] = /* @__PURE__ */ new Map(), At?.({ ReactiveElement: y }), (N.reactiveElementVersions ??= []).push("2.1.2");
const B = globalThis, G = (o) => o, T = B.trustedTypes, Q = T ? T.createPolicy("lit-html", { createHTML: (o) => o }) : void 0, at = "$lit$", m = `lit$${Math.random().toFixed(9).slice(2)}$`, ht = "?" + m, St = `<${ht}>`, b = document, C = () => b.createComment(""), P = (o) => o === null || typeof o != "object" && typeof o != "function", V = Array.isArray, wt = (o) => V(o) || typeof o?.[Symbol.iterator] == "function", O = `[ 	
\f\r]`, E = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, X = /-->/g, tt = />/g, v = RegExp(`>|${O}(?:([^\\s"'>=/]+)(${O}*=${O}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), et = /'/g, st = /"/g, lt = /^(?:script|style|textarea|title)$/i, ct = (o) => (t, ...e) => ({ _$litType$: o, strings: t, values: e }), u = ct(1), Ot = ct(2), S = /* @__PURE__ */ Symbol.for("lit-noChange"), d = /* @__PURE__ */ Symbol.for("lit-nothing"), it = /* @__PURE__ */ new WeakMap(), _ = b.createTreeWalker(b, 129);
function dt(o, t) {
  if (!V(o) || !o.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Q !== void 0 ? Q.createHTML(t) : t;
}
const Et = (o, t) => {
  const e = o.length - 1, s = [];
  let i, r = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", n = E;
  for (let l = 0; l < e; l++) {
    const a = o[l];
    let c, p, h = -1, $ = 0;
    for (; $ < a.length && (n.lastIndex = $, p = n.exec(a), p !== null); ) $ = n.lastIndex, n === E ? p[1] === "!--" ? n = X : p[1] !== void 0 ? n = tt : p[2] !== void 0 ? (lt.test(p[2]) && (i = RegExp("</" + p[2], "g")), n = v) : p[3] !== void 0 && (n = v) : n === v ? p[0] === ">" ? (n = i ?? E, h = -1) : p[1] === void 0 ? h = -2 : (h = n.lastIndex - p[2].length, c = p[1], n = p[3] === void 0 ? v : p[3] === '"' ? st : et) : n === st || n === et ? n = v : n === X || n === tt ? n = E : (n = v, i = void 0);
    const g = n === v && o[l + 1].startsWith("/>") ? " " : "";
    r += n === E ? a + St : h >= 0 ? (s.push(c), a.slice(0, h) + at + a.slice(h) + m + g) : a + m + (h === -2 ? l : g);
  }
  return [dt(o, r + (o[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class M {
  constructor({ strings: t, _$litType$: e }, s) {
    let i;
    this.parts = [];
    let r = 0, n = 0;
    const l = t.length - 1, a = this.parts, [c, p] = Et(t, e);
    if (this.el = M.createElement(c, s), _.currentNode = this.el.content, e === 2 || e === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (i = _.nextNode()) !== null && a.length < l; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const h of i.getAttributeNames()) if (h.endsWith(at)) {
          const $ = p[n++], g = i.getAttribute(h).split(m), R = /([.?@])?(.*)/.exec($);
          a.push({ type: 1, index: r, name: R[2], strings: g, ctor: R[1] === "." ? Ct : R[1] === "?" ? Pt : R[1] === "@" ? Mt : H }), i.removeAttribute(h);
        } else h.startsWith(m) && (a.push({ type: 6, index: r }), i.removeAttribute(h));
        if (lt.test(i.tagName)) {
          const h = i.textContent.split(m), $ = h.length - 1;
          if ($ > 0) {
            i.textContent = T ? T.emptyScript : "";
            for (let g = 0; g < $; g++) i.append(h[g], C()), _.nextNode(), a.push({ type: 2, index: ++r });
            i.append(h[$], C());
          }
        }
      } else if (i.nodeType === 8) if (i.data === ht) a.push({ type: 2, index: r });
      else {
        let h = -1;
        for (; (h = i.data.indexOf(m, h + 1)) !== -1; ) a.push({ type: 7, index: r }), h += m.length - 1;
      }
      r++;
    }
  }
  static createElement(t, e) {
    const s = b.createElement("template");
    return s.innerHTML = t, s;
  }
}
function w(o, t, e = o, s) {
  if (t === S) return t;
  let i = s !== void 0 ? e._$Co?.[s] : e._$Cl;
  const r = P(t) ? void 0 : t._$litDirective$;
  return i?.constructor !== r && (i?._$AO?.(!1), r === void 0 ? i = void 0 : (i = new r(o), i._$AT(o, e, s)), s !== void 0 ? (e._$Co ??= [])[s] = i : e._$Cl = i), i !== void 0 && (t = w(o, i._$AS(o, t.values), i, s)), t;
}
class xt {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: s } = this._$AD, i = (t?.creationScope ?? b).importNode(e, !0);
    _.currentNode = i;
    let r = _.nextNode(), n = 0, l = 0, a = s[0];
    for (; a !== void 0; ) {
      if (n === a.index) {
        let c;
        a.type === 2 ? c = new U(r, r.nextSibling, this, t) : a.type === 1 ? c = new a.ctor(r, a.name, a.strings, this, t) : a.type === 6 && (c = new Ut(r, this, t)), this._$AV.push(c), a = s[++l];
      }
      n !== a?.index && (r = _.nextNode(), n++);
    }
    return _.currentNode = b, i;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class U {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, s, i) {
    this.type = 2, this._$AH = d, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = i, this._$Cv = i?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && t?.nodeType === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = w(this, t, e), P(t) ? t === d || t == null || t === "" ? (this._$AH !== d && this._$AR(), this._$AH = d) : t !== this._$AH && t !== S && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : wt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== d && P(this._$AH) ? this._$AA.nextSibling.data = t : this.T(b.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: s } = t, i = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = M.createElement(dt(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === i) this._$AH.p(e);
    else {
      const r = new xt(i, this), n = r.u(this.options);
      r.p(e), this.T(n), this._$AH = r;
    }
  }
  _$AC(t) {
    let e = it.get(t.strings);
    return e === void 0 && it.set(t.strings, e = new M(t)), e;
  }
  k(t) {
    V(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, i = 0;
    for (const r of t) i === e.length ? e.push(s = new U(this.O(C()), this.O(C()), this, this.options)) : s = e[i], s._$AI(r), i++;
    i < e.length && (this._$AR(s && s._$AB.nextSibling, i), e.length = i);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const s = G(t).nextSibling;
      G(t).remove(), t = s;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class H {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, s, i, r) {
    this.type = 1, this._$AH = d, this._$AN = void 0, this.element = t, this.name = e, this._$AM = i, this.options = r, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = d;
  }
  _$AI(t, e = this, s, i) {
    const r = this.strings;
    let n = !1;
    if (r === void 0) t = w(this, t, e, 0), n = !P(t) || t !== this._$AH && t !== S, n && (this._$AH = t);
    else {
      const l = t;
      let a, c;
      for (t = r[0], a = 0; a < r.length - 1; a++) c = w(this, l[s + a], e, a), c === S && (c = this._$AH[a]), n ||= !P(c) || c !== this._$AH[a], c === d ? t = d : t !== d && (t += (c ?? "") + r[a + 1]), this._$AH[a] = c;
    }
    n && !i && this.j(t);
  }
  j(t) {
    t === d ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Ct extends H {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === d ? void 0 : t;
  }
}
class Pt extends H {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== d);
  }
}
class Mt extends H {
  constructor(t, e, s, i, r) {
    super(t, e, s, i, r), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = w(this, t, e, 0) ?? d) === S) return;
    const s = this._$AH, i = t === d && s !== d || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, r = t !== d && (s === d || i);
    i && this.element.removeEventListener(this.name, this, s), r && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Ut {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    w(this, t);
  }
}
const Rt = B.litHtmlPolyfillSupport;
Rt?.(M, U), (B.litHtmlVersions ??= []).push("3.3.2");
const kt = (o, t, e) => {
  const s = e?.renderBefore ?? t;
  let i = s._$litPart$;
  if (i === void 0) {
    const r = e?.renderBefore ?? null;
    s._$litPart$ = i = new U(t.insertBefore(C(), r), r, void 0, e ?? {});
  }
  return i._$AI(o), i;
};
const W = globalThis;
class A extends y {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = kt(e, this.renderRoot, this.renderOptions);
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
const Tt = W.litElementPolyfillSupport;
Tt?.({ LitElement: A });
(W.litElementVersions ??= []).push("4.2.2");
const pt = async (o) => {
  import("./install-dialog-c9RfsbYA.js");
  let t;
  try {
    t = await navigator.serial.requestPort();
  } catch (s) {
    if (s.name === "NotFoundError") {
      import("./index-CbiN7akd.js").then((i) => i.openNoPortPickedDialog(() => pt(o)));
      return;
    }
    alert(`Error: ${s.message}`);
    return;
  }
  if (!t)
    return;
  try {
    await t.open({ baudRate: 115200, bufferSize: 8192 });
  } catch (s) {
    alert(s.message);
    return;
  }
  const e = document.createElement("ewt-install-dialog");
  e.port = t, e.manifestPath = o.manifest || o.getAttribute("manifest"), e.overrides = o.overrides, e.addEventListener("closed", () => {
    t.close();
  }, { once: !0 }), document.body.appendChild(e);
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
    const t = document.createElement("slot");
    t.addEventListener("click", async (s) => {
      s.preventDefault(), pt(this);
    }), t.name = "activate";
    const e = document.createElement("button");
    if (e.innerText = "Connect", t.append(e), "adoptedStyleSheets" in Document.prototype && "replaceSync" in CSSStyleSheet.prototype) {
      const s = new CSSStyleSheet();
      s.replaceSync(f.style), this.renderRoot.adoptedStyleSheets = [s];
    } else {
      const s = document.createElement("style");
      s.innerText = f.style, this.renderRoot.append(s);
    }
    this.renderRoot.append(t);
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
    const t = new URLSearchParams({
      flavor: this.flavor
    });
    return this.href + this.version + ".json?" + t.toString();
  }
  constructor() {
    super(), this.response = /* @__PURE__ */ new Map(), this.href = "", this.version = "", this.flavor = "";
  }
  firstUpdated() {
    fetch("https://api.github.com/repos/ESPresense/ESPresense/releases", { credentials: "same-origin" }).then((t) => t.json()).then((t) => {
      this.response = t.filter((e) => e.assets.length > 5).reduce((e, s) => (e[s.prerelease ? "Beta" : "Release"] ? e[s.prerelease ? "Beta" : "Release"].push(s) : e[s.prerelease ? "Beta" : "Release"] = [s], e), /* @__PURE__ */ new Map()), console.log(this.response), this.version = this.response.Release[0].tag_name;
    });
  }
  flavorChanged(t) {
    this.flavor = t.target.value, console.log(this.flavor);
  }
  versionChanged(t) {
    this.version = t.target.value, console.log(this.version);
  }
  render() {
    const { response: t } = this;
    return u`
      <div><label for="flavor">Flavor:</label><select id="flavor" @change=${this.flavorChanged}><option value="">Standard</option><option value="cdc">Cdc</option><option value="verbose">Verbose</option><option value="m5atom">M5Atom</option><option value="m5stickc">M5StickC</option><option value="m5stickc-plus">M5StickC-plus</option><option value="macchina-a0">Macchina A0</option></select></div>
      <div><label for="version">Version:</label><select id="version" @change=${this.versionChanged}>>${Object.keys(t).reverse().map((e) => u` <optgroup label="${e}">${t[e].map((s) => u` <option value=${s.tag_name} ?selected=${s.tag_name == this.version}>${s.name}</option> `)}</optgroup>`)}</select></div>
      <div class="but"><esp-web-install-button manifest=${this.manifest}></esp-web-install-button></div>
      <div class="powered"><label>Powered by</label><a href="https://esphome.github.io/esp-web-tools/" target="_blank">ESP Web Tools</a></div>
    `;
  }
};
I.styles = rt`
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
  `;
let j = I;
const F = class F extends A {
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
    const t = new URLSearchParams({
      flavor: this.flavor
    });
    return this.href + this.run_id + ".json?" + t.toString();
  }
  constructor() {
    super(), this.response = /* @__PURE__ */ new Map(), this.href = "", this.run_id = -1, this.flavor = "", this.loading = !0, this.buildVersion = "", this.querySha = "", this.shaMatched = !0;
  }
  isSupportedRun(t) {
    return t.pull_requests.length > 0 || t.head_branch == "main" && t.head_repository.full_name == "ESPresense/ESPresense";
  }
  async firstUpdated() {
    try {
      const e = await (await fetch("https://api.github.com/repos/ESPresense/ESPresense/actions/workflows/build.yml/runs?status=success&per_page=100", { credentials: "same-origin" })).json();
      this.querySha = new URLSearchParams(window.location.search).get("sha")?.trim().toLowerCase() || "";
      const s = e.workflow_runs.filter((r) => this.isSupportedRun(r)), i = this.querySha ? s.find((r) => r.head_sha?.toLowerCase().startsWith(this.querySha)) : null;
      this.shaMatched = !this.querySha || !!i, this.run_id = this.querySha ? i?.id ?? -1 : s[0]?.id ?? -1, this.response = s.reduce((r, n) => (r[n.head_branch] ? r[n.head_branch].push(n) : r[n.head_branch] = [n], r), /* @__PURE__ */ new Map());
    } finally {
      this.loading = !1;
    }
  }
  flavorChanged(t) {
    this.flavor = t.target.value, console.log(this.flavor);
  }
  versionChanged(t) {
    const e = Number(t.target.value);
    this.run_id = Number.isFinite(e) ? e : -1, this.shaMatched = this.run_id > 0, console.log(this.run_id);
  }
  render() {
    const { response: t } = this;
    return u`
      <div><label for="flavor">Flavor:</label><select id="flavor" @change=${this.flavorChanged}><option value="">Standard</option><option value="cdc">Cdc</option><option value="verbose">Verbose</option><option value="m5atom">M5Atom</option><option value="m5stickc">M5StickC</option><option value="m5stickc-plus">M5StickC-plus</option><option value="macchina-a0">Macchina A0</option></select></div>
      ${this.loading ? u`<div><label for="version">Artifact:</label><span>Loading artifacts...</span></div>` : u`<div><label for="version">Artifact:</label><select id="version" .value=${this.shaMatched ? String(this.run_id) : ""} @change=${this.versionChanged}>${this.shaMatched ? null : u`<option value="" selected disabled>No match for sha ${this.querySha}</option>`}${Object.keys(t).reverse().map((e) => u` <optgroup label="${e}">${t[e].map((s) => u` <option value=${s.id} ?selected=${Number(s.id) === this.run_id}>${s.head_sha.substring(0, 7)}: ${s.head_commit.message.split(`
`)[0]}</option> `)}</optgroup>`)}</select></div>`}
      ${this.loading ? u`<div class="but">Loading artifacts...</div>` : this.run_id < 0 ? u`<div class="but">Select an artifact to continue.</div>` : u`<div class="but"><esp-web-install-button manifest=${this.manifest}></esp-web-install-button></div>`}
      <div class="powered"><label>UI ${this.buildVersion || "dev"}</label><label>Powered by</label><a href="https://esphome.github.io/esp-web-tools/" target="_blank">ESP Web Tools</a></div>
    `;
  }
};
F.styles = rt`
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
  `;
let D = F;
window.customElements.define("espresense-releases", j);
window.customElements.define("espresense-artifacts", D);
export {
  d as A,
  kt as D,
  S as E,
  rt as a,
  u as b,
  nt as f,
  A as i,
  L as u,
  Ot as w
};
