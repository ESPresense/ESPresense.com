function c(s, t, e, i) {
  var r = arguments.length, o = r < 3 ? t : i === null ? i = Object.getOwnPropertyDescriptor(t, e) : i, n;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") o = Reflect.decorate(s, t, e, i);
  else for (var l = s.length - 1; l >= 0; l--) (n = s[l]) && (o = (r < 3 ? n(o) : r > 3 ? n(t, e, o) : n(t, e)) || o);
  return r > 3 && o && Object.defineProperty(t, e, o), o;
}
const B = globalThis, rt = B.ShadowRoot && (B.ShadyCSS === void 0 || B.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ot = /* @__PURE__ */ Symbol(), mt = /* @__PURE__ */ new WeakMap();
let St = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== ot) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (rt && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = mt.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && mt.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const qt = (s) => new St(typeof s == "string" ? s : s + "", void 0, ot), T = (s, ...t) => {
  const e = s.length === 1 ? s[0] : t.reduce(((i, r, o) => i + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + s[o + 1]), s[0]);
  return new St(e, s, ot);
}, Wt = (s, t) => {
  if (rt) s.adoptedStyleSheets = t.map(((e) => e instanceof CSSStyleSheet ? e : e.styleSheet));
  else for (const e of t) {
    const i = document.createElement("style"), r = B.litNonce;
    r !== void 0 && i.setAttribute("nonce", r), i.textContent = e.cssText, s.appendChild(i);
  }
}, bt = rt ? (s) => s : (s) => s instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return qt(e);
})(s) : s;
const { is: Gt, defineProperty: Yt, getOwnPropertyDescriptor: Zt, getOwnPropertyNames: Kt, getOwnPropertySymbols: Xt, getPrototypeOf: Jt } = Object, q = globalThis, gt = q.trustedTypes, Qt = gt ? gt.emptyScript : "", te = q.reactiveElementPolyfillSupport, D = (s, t) => s, j = { toAttribute(s, t) {
  switch (t) {
    case Boolean:
      s = s ? Qt : null;
      break;
    case Object:
    case Array:
      s = s == null ? s : JSON.stringify(s);
  }
  return s;
}, fromAttribute(s, t) {
  let e = s;
  switch (t) {
    case Boolean:
      e = s !== null;
      break;
    case Number:
      e = s === null ? null : Number(s);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(s);
      } catch {
        e = null;
      }
  }
  return e;
} }, nt = (s, t) => !Gt(s, t), vt = { attribute: !0, type: String, converter: j, reflect: !1, useDefault: !1, hasChanged: nt };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), q.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let O = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = vt) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = /* @__PURE__ */ Symbol(), r = this.getPropertyDescriptor(t, i, e);
      r !== void 0 && Yt(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: r, set: o } = Zt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(n) {
      this[e] = n;
    } };
    return { get: r, set(n) {
      const l = r?.call(this);
      o?.call(this, n), this.requestUpdate(t, l, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? vt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(D("elementProperties"))) return;
    const t = Jt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(D("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(D("properties"))) {
      const e = this.properties, i = [...Kt(e), ...Xt(e)];
      for (const r of i) this.createProperty(r, e[r]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [i, r] of e) this.elementProperties.set(i, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, i] of this.elementProperties) {
      const r = this._$Eu(e, i);
      r !== void 0 && this._$Eh.set(r, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const i = new Set(t.flat(1 / 0).reverse());
      for (const r of i) e.unshift(bt(r));
    } else t !== void 0 && e.push(bt(t));
    return e;
  }
  static _$Eu(t, e) {
    const i = e.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise(((t) => this.enableUpdating = t)), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach(((t) => t(this)));
  }
  addController(t) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(t), this.renderRoot !== void 0 && this.isConnected && t.hostConnected?.();
  }
  removeController(t) {
    this._$EO?.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const i of e.keys()) this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Wt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach(((t) => t.hostConnected?.()));
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach(((t) => t.hostDisconnected?.()));
  }
  attributeChangedCallback(t, e, i) {
    this._$AK(t, i);
  }
  _$ET(t, e) {
    const i = this.constructor.elementProperties.get(t), r = this.constructor._$Eu(t, i);
    if (r !== void 0 && i.reflect === !0) {
      const o = (i.converter?.toAttribute !== void 0 ? i.converter : j).toAttribute(e, i.type);
      this._$Em = t, o == null ? this.removeAttribute(r) : this.setAttribute(r, o), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const i = this.constructor, r = i._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const o = i.getPropertyOptions(r), n = typeof o.converter == "function" ? { fromAttribute: o.converter } : o.converter?.fromAttribute !== void 0 ? o.converter : j;
      this._$Em = r, this[r] = n.fromAttribute(e, o.type) ?? this._$Ej?.get(r) ?? null, this._$Em = null;
    }
  }
  requestUpdate(t, e, i) {
    if (t !== void 0) {
      const r = this.constructor, o = this[t];
      if (i ??= r.getPropertyOptions(t), !((i.hasChanged ?? nt)(o, e) || i.useDefault && i.reflect && o === this._$Ej?.get(t) && !this.hasAttribute(r._$Eu(t, i)))) return;
      this.C(t, e, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: i, reflect: r, wrapped: o }, n) {
    i && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, n ?? e ?? this[t]), o !== !0 || n !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (e = void 0), this._$AL.set(t, e)), r === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
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
        for (const [r, o] of this._$Ep) this[r] = o;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [r, o] of i) {
        const { wrapped: n } = o, l = this[r];
        n !== !0 || this._$AL.has(r) || l === void 0 || this.C(r, void 0, o, l);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), this._$EO?.forEach(((i) => i.hostUpdate?.())), this.update(e)) : this._$EM();
    } catch (i) {
      throw t = !1, this._$EM(), i;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach(((e) => e.hostUpdated?.())), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
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
    this._$Eq &&= this._$Eq.forEach(((e) => this._$ET(e, this[e]))), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
O.elementStyles = [], O.shadowRootOptions = { mode: "open" }, O[D("elementProperties")] = /* @__PURE__ */ new Map(), O[D("finalized")] = /* @__PURE__ */ new Map(), te?.({ ReactiveElement: O }), (q.reactiveElementVersions ??= []).push("2.1.0");
const at = globalThis, V = at.trustedTypes, yt = V ? V.createPolicy("lit-html", { createHTML: (s) => s }) : void 0, Tt = "$lit$", A = `lit$${Math.random().toFixed(9).slice(2)}$`, Pt = "?" + A, ee = `<${Pt}>`, E = document, N = () => E.createComment(""), M = (s) => s === null || typeof s != "object" && typeof s != "function", lt = Array.isArray, ie = (s) => lt(s) || typeof s?.[Symbol.iterator] == "function", Z = `[ 	
\f\r]`, k = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, _t = /-->/g, xt = />/g, C = RegExp(`>|${Z}(?:([^\\s"'>=/]+)(${Z}*=${Z}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), At = /'/g, $t = /"/g, It = /^(?:script|style|textarea|title)$/i, Ot = (s) => (t, ...e) => ({ _$litType$: s, strings: t, values: e }), $ = Ot(1), Je = Ot(2), S = /* @__PURE__ */ Symbol.for("lit-noChange"), d = /* @__PURE__ */ Symbol.for("lit-nothing"), Ct = /* @__PURE__ */ new WeakMap(), w = E.createTreeWalker(E, 129);
function Rt(s, t) {
  if (!lt(s) || !s.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return yt !== void 0 ? yt.createHTML(t) : t;
}
const se = (s, t) => {
  const e = s.length - 1, i = [];
  let r, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", n = k;
  for (let l = 0; l < e; l++) {
    const a = s[l];
    let p, u, h = -1, y = 0;
    for (; y < a.length && (n.lastIndex = y, u = n.exec(a), u !== null); ) y = n.lastIndex, n === k ? u[1] === "!--" ? n = _t : u[1] !== void 0 ? n = xt : u[2] !== void 0 ? (It.test(u[2]) && (r = RegExp("</" + u[2], "g")), n = C) : u[3] !== void 0 && (n = C) : n === C ? u[0] === ">" ? (n = r ?? k, h = -1) : u[1] === void 0 ? h = -2 : (h = n.lastIndex - u[2].length, p = u[1], n = u[3] === void 0 ? C : u[3] === '"' ? $t : At) : n === $t || n === At ? n = C : n === _t || n === xt ? n = k : (n = C, r = void 0);
    const _ = n === C && s[l + 1].startsWith("/>") ? " " : "";
    o += n === k ? a + ee : h >= 0 ? (i.push(p), a.slice(0, h) + Tt + a.slice(h) + A + _) : a + A + (h === -2 ? l : _);
  }
  return [Rt(s, o + (s[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class z {
  constructor({ strings: t, _$litType$: e }, i) {
    let r;
    this.parts = [];
    let o = 0, n = 0;
    const l = t.length - 1, a = this.parts, [p, u] = se(t, e);
    if (this.el = z.createElement(p, i), w.currentNode = this.el.content, e === 2 || e === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (r = w.nextNode()) !== null && a.length < l; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const h of r.getAttributeNames()) if (h.endsWith(Tt)) {
          const y = u[n++], _ = r.getAttribute(h).split(A), I = /([.?@])?(.*)/.exec(y);
          a.push({ type: 1, index: o, name: I[2], strings: _, ctor: I[1] === "." ? oe : I[1] === "?" ? ne : I[1] === "@" ? ae : W }), r.removeAttribute(h);
        } else h.startsWith(A) && (a.push({ type: 6, index: o }), r.removeAttribute(h));
        if (It.test(r.tagName)) {
          const h = r.textContent.split(A), y = h.length - 1;
          if (y > 0) {
            r.textContent = V ? V.emptyScript : "";
            for (let _ = 0; _ < y; _++) r.append(h[_], N()), w.nextNode(), a.push({ type: 2, index: ++o });
            r.append(h[y], N());
          }
        }
      } else if (r.nodeType === 8) if (r.data === Pt) a.push({ type: 2, index: o });
      else {
        let h = -1;
        for (; (h = r.data.indexOf(A, h + 1)) !== -1; ) a.push({ type: 7, index: o }), h += A.length - 1;
      }
      o++;
    }
  }
  static createElement(t, e) {
    const i = E.createElement("template");
    return i.innerHTML = t, i;
  }
}
function R(s, t, e = s, i) {
  if (t === S) return t;
  let r = i !== void 0 ? e._$Co?.[i] : e._$Cl;
  const o = M(t) ? void 0 : t._$litDirective$;
  return r?.constructor !== o && (r?._$AO?.(!1), o === void 0 ? r = void 0 : (r = new o(s), r._$AT(s, e, i)), i !== void 0 ? (e._$Co ??= [])[i] = r : e._$Cl = r), r !== void 0 && (t = R(s, r._$AS(s, t.values), r, i)), t;
}
class re {
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
    const { el: { content: e }, parts: i } = this._$AD, r = (t?.creationScope ?? E).importNode(e, !0);
    w.currentNode = r;
    let o = w.nextNode(), n = 0, l = 0, a = i[0];
    for (; a !== void 0; ) {
      if (n === a.index) {
        let p;
        a.type === 2 ? p = new F(o, o.nextSibling, this, t) : a.type === 1 ? p = new a.ctor(o, a.name, a.strings, this, t) : a.type === 6 && (p = new le(o, this, t)), this._$AV.push(p), a = i[++l];
      }
      n !== a?.index && (o = w.nextNode(), n++);
    }
    return w.currentNode = E, r;
  }
  p(t) {
    let e = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}
class F {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, i, r) {
    this.type = 2, this._$AH = d, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
    t = R(this, t, e), M(t) ? t === d || t == null || t === "" ? (this._$AH !== d && this._$AR(), this._$AH = d) : t !== this._$AH && t !== S && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : ie(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== d && M(this._$AH) ? this._$AA.nextSibling.data = t : this.T(E.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: i } = t, r = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = z.createElement(Rt(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === r) this._$AH.p(e);
    else {
      const o = new re(r, this), n = o.u(this.options);
      o.p(e), this.T(n), this._$AH = o;
    }
  }
  _$AC(t) {
    let e = Ct.get(t.strings);
    return e === void 0 && Ct.set(t.strings, e = new z(t)), e;
  }
  k(t) {
    lt(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, r = 0;
    for (const o of t) r === e.length ? e.push(i = new F(this.O(N()), this.O(N()), this, this.options)) : i = e[r], i._$AI(o), r++;
    r < e.length && (this._$AR(i && i._$AB.nextSibling, r), e.length = r);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t && t !== this._$AB; ) {
      const i = t.nextSibling;
      t.remove(), t = i;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class W {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, i, r, o) {
    this.type = 1, this._$AH = d, this._$AN = void 0, this.element = t, this.name = e, this._$AM = r, this.options = o, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = d;
  }
  _$AI(t, e = this, i, r) {
    const o = this.strings;
    let n = !1;
    if (o === void 0) t = R(this, t, e, 0), n = !M(t) || t !== this._$AH && t !== S, n && (this._$AH = t);
    else {
      const l = t;
      let a, p;
      for (t = o[0], a = 0; a < o.length - 1; a++) p = R(this, l[i + a], e, a), p === S && (p = this._$AH[a]), n ||= !M(p) || p !== this._$AH[a], p === d ? t = d : t !== d && (t += (p ?? "") + o[a + 1]), this._$AH[a] = p;
    }
    n && !r && this.j(t);
  }
  j(t) {
    t === d ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class oe extends W {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === d ? void 0 : t;
  }
}
class ne extends W {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== d);
  }
}
class ae extends W {
  constructor(t, e, i, r, o) {
    super(t, e, i, r, o), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = R(this, t, e, 0) ?? d) === S) return;
    const i = this._$AH, r = t === d && i !== d || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, o = t !== d && (i === d || r);
    r && this.element.removeEventListener(this.name, this, i), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class le {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    R(this, t);
  }
}
const ce = at.litHtmlPolyfillSupport;
ce?.(z, F), (at.litHtmlVersions ??= []).push("3.3.0");
const de = (s, t, e) => {
  const i = e?.renderBefore ?? t;
  let r = i._$litPart$;
  if (r === void 0) {
    const o = e?.renderBefore ?? null;
    i._$litPart$ = r = new F(t.insertBefore(N(), o), o, void 0, e ?? {});
  }
  return r._$AI(s), r;
};
const ct = globalThis;
let x = class extends O {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = de(e, this.renderRoot, this.renderOptions);
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
};
x._$litElement$ = !0, x.finalized = !0, ct.litElementHydrateSupport?.({ LitElement: x });
const he = ct.litElementPolyfillSupport;
he?.({ LitElement: x });
(ct.litElementVersions ??= []).push("4.2.0");
const dt = (s) => (t, e) => {
  e !== void 0 ? e.addInitializer((() => {
    customElements.define(s, t);
  })) : customElements.define(s, t);
};
const pe = { attribute: !0, type: String, converter: j, reflect: !1, hasChanged: nt }, ue = (s = pe, t, e) => {
  const { kind: i, metadata: r } = e;
  let o = globalThis.litPropertyMetadata.get(r);
  if (o === void 0 && globalThis.litPropertyMetadata.set(r, o = /* @__PURE__ */ new Map()), i === "setter" && ((s = Object.create(s)).wrapped = !0), o.set(e.name, s), i === "accessor") {
    const { name: n } = e;
    return { set(l) {
      const a = t.get.call(this);
      t.set.call(this, l), this.requestUpdate(n, a, s);
    }, init(l) {
      return l !== void 0 && this.C(n, void 0, s, l), l;
    } };
  }
  if (i === "setter") {
    const { name: n } = e;
    return function(l) {
      const a = this[n];
      t.call(this, l), this.requestUpdate(n, a, s);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function f(s) {
  return (t, e) => typeof e == "object" ? ue(s, t, e) : ((i, r, o) => {
    const n = r.hasOwnProperty(o);
    return r.constructor.createProperty(o, i), n ? Object.getOwnPropertyDescriptor(r, o) : void 0;
  })(s, t, e);
}
function P(s) {
  return f({ ...s, state: !0, attribute: !1 });
}
const kt = (s, t, e) => (e.configurable = !0, e.enumerable = !0, Reflect.decorate && typeof t != "object" && Object.defineProperty(s, t, e), e);
function v(s, t) {
  return (e, i, r) => {
    const o = (n) => n.renderRoot?.querySelector(s) ?? null;
    return kt(e, i, { get() {
      return o(this);
    } });
  };
}
function fe(s) {
  return (t, e) => {
    const { slot: i, selector: r } = s ?? {}, o = "slot" + (i ? `[name=${i}]` : ":not([name])");
    return kt(t, e, { get() {
      const n = this.renderRoot?.querySelector(o), l = n?.assignedElements(s) ?? [];
      return r === void 0 ? l : l.filter(((a) => a.matches(r)));
    } });
  };
}
const me = T`:host{border-start-start-radius:var(--_container-shape-start-start);border-start-end-radius:var(--_container-shape-start-end);border-end-start-radius:var(--_container-shape-end-start);border-end-end-radius:var(--_container-shape-end-end);box-sizing:border-box;cursor:pointer;display:inline-flex;gap:8px;min-height:var(--_container-height);outline:none;padding-block:calc((var(--_container-height) - max(var(--_label-text-line-height),var(--_icon-size)))/2);padding-inline-start:var(--_leading-space);padding-inline-end:var(--_trailing-space);place-content:center;place-items:center;position:relative;font-family:var(--_label-text-font);font-size:var(--_label-text-size);line-height:var(--_label-text-line-height);font-weight:var(--_label-text-weight);text-overflow:ellipsis;text-wrap:nowrap;user-select:none;-webkit-tap-highlight-color:rgba(0,0,0,0);vertical-align:top;--md-ripple-hover-color: var(--_hover-state-layer-color);--md-ripple-pressed-color: var(--_pressed-state-layer-color);--md-ripple-hover-opacity: var(--_hover-state-layer-opacity);--md-ripple-pressed-opacity: var(--_pressed-state-layer-opacity)}md-focus-ring{--md-focus-ring-shape-start-start: var(--_container-shape-start-start);--md-focus-ring-shape-start-end: var(--_container-shape-start-end);--md-focus-ring-shape-end-end: var(--_container-shape-end-end);--md-focus-ring-shape-end-start: var(--_container-shape-end-start)}:host(:is([disabled],[soft-disabled])){cursor:default;pointer-events:none}.button{border-radius:inherit;cursor:inherit;display:inline-flex;align-items:center;justify-content:center;border:none;outline:none;-webkit-appearance:none;vertical-align:middle;background:rgba(0,0,0,0);text-decoration:none;min-width:calc(64px - var(--_leading-space) - var(--_trailing-space));width:100%;z-index:0;height:100%;font:inherit;color:var(--_label-text-color);padding:0;gap:inherit;text-transform:inherit}.button::-moz-focus-inner{padding:0;border:0}:host(:hover) .button{color:var(--_hover-label-text-color)}:host(:focus-within) .button{color:var(--_focus-label-text-color)}:host(:active) .button{color:var(--_pressed-label-text-color)}.background{background:var(--_container-color);border-radius:inherit;inset:0;position:absolute}.label{overflow:hidden}:is(.button,.label,.label slot),.label ::slotted(*){text-overflow:inherit}:host(:is([disabled],[soft-disabled])) .label{color:var(--_disabled-label-text-color);opacity:var(--_disabled-label-text-opacity)}:host(:is([disabled],[soft-disabled])) .background{background:var(--_disabled-container-color);opacity:var(--_disabled-container-opacity)}@media(forced-colors: active){.background{border:1px solid CanvasText}:host(:is([disabled],[soft-disabled])){--_disabled-icon-color: GrayText;--_disabled-icon-opacity: 1;--_disabled-container-opacity: 1;--_disabled-label-text-color: GrayText;--_disabled-label-text-opacity: 1}}:host([has-icon]:not([trailing-icon])){padding-inline-start:var(--_with-leading-icon-leading-space);padding-inline-end:var(--_with-leading-icon-trailing-space)}:host([has-icon][trailing-icon]){padding-inline-start:var(--_with-trailing-icon-leading-space);padding-inline-end:var(--_with-trailing-icon-trailing-space)}::slotted([slot=icon]){display:inline-flex;position:relative;writing-mode:horizontal-tb;fill:currentColor;flex-shrink:0;color:var(--_icon-color);font-size:var(--_icon-size);inline-size:var(--_icon-size);block-size:var(--_icon-size)}:host(:hover) ::slotted([slot=icon]){color:var(--_hover-icon-color)}:host(:focus-within) ::slotted([slot=icon]){color:var(--_focus-icon-color)}:host(:active) ::slotted([slot=icon]){color:var(--_pressed-icon-color)}:host(:is([disabled],[soft-disabled])) ::slotted([slot=icon]){color:var(--_disabled-icon-color);opacity:var(--_disabled-icon-opacity)}.touch{position:absolute;top:50%;height:48px;left:0;right:0;transform:translateY(-50%)}:host([touch-target=wrapper]){margin:max(0px,(48px - var(--_container-height))/2) 0}:host([touch-target=none]) .touch{display:none}
`;
const Dt = /* @__PURE__ */ Symbol("attachableController");
let Nt;
Nt = new MutationObserver((s) => {
  for (const t of s)
    t.target[Dt]?.hostConnected();
});
class Mt {
  get htmlFor() {
    return this.host.getAttribute("for");
  }
  set htmlFor(t) {
    t === null ? this.host.removeAttribute("for") : this.host.setAttribute("for", t);
  }
  get control() {
    return this.host.hasAttribute("for") ? !this.htmlFor || !this.host.isConnected ? null : this.host.getRootNode().querySelector(`#${this.htmlFor}`) : this.currentControl || this.host.parentElement;
  }
  set control(t) {
    t ? this.attach(t) : this.detach();
  }
  /**
   * Creates a new controller for an `Attachable` element.
   *
   * @param host The `Attachable` element.
   * @param onControlChange A callback with two parameters for the previous and
   *     next control. An `Attachable` element may perform setup or teardown
   *     logic whenever the control changes.
   */
  constructor(t, e) {
    this.host = t, this.onControlChange = e, this.currentControl = null, t.addController(this), t[Dt] = this, Nt?.observe(t, { attributeFilter: ["for"] });
  }
  attach(t) {
    t !== this.currentControl && (this.setCurrentControl(t), this.host.removeAttribute("for"));
  }
  detach() {
    this.setCurrentControl(null), this.host.setAttribute("for", "");
  }
  /** @private */
  hostConnected() {
    this.setCurrentControl(this.control);
  }
  /** @private */
  hostDisconnected() {
    this.setCurrentControl(null);
  }
  setCurrentControl(t) {
    this.onControlChange(this.currentControl, t), this.currentControl = t;
  }
}
const be = ["focusin", "focusout", "pointerdown"];
class ht extends x {
  constructor() {
    super(...arguments), this.visible = !1, this.inward = !1, this.attachableController = new Mt(this, this.onControlChange.bind(this));
  }
  get htmlFor() {
    return this.attachableController.htmlFor;
  }
  set htmlFor(t) {
    this.attachableController.htmlFor = t;
  }
  get control() {
    return this.attachableController.control;
  }
  set control(t) {
    this.attachableController.control = t;
  }
  attach(t) {
    this.attachableController.attach(t);
  }
  detach() {
    this.attachableController.detach();
  }
  connectedCallback() {
    super.connectedCallback(), this.setAttribute("aria-hidden", "true");
  }
  /** @private */
  handleEvent(t) {
    if (!t[wt]) {
      switch (t.type) {
        default:
          return;
        case "focusin":
          this.visible = this.control?.matches(":focus-visible") ?? !1;
          break;
        case "focusout":
        case "pointerdown":
          this.visible = !1;
          break;
      }
      t[wt] = !0;
    }
  }
  onControlChange(t, e) {
    for (const i of be)
      t?.removeEventListener(i, this), e?.addEventListener(i, this);
  }
  update(t) {
    t.has("visible") && this.dispatchEvent(new Event("visibility-changed")), super.update(t);
  }
}
c([
  f({ type: Boolean, reflect: !0 })
], ht.prototype, "visible", void 0);
c([
  f({ type: Boolean, reflect: !0 })
], ht.prototype, "inward", void 0);
const wt = /* @__PURE__ */ Symbol("handledByFocusRing");
const ge = T`:host{animation-delay:0s,calc(var(--md-focus-ring-duration, 600ms)*.25);animation-duration:calc(var(--md-focus-ring-duration, 600ms)*.25),calc(var(--md-focus-ring-duration, 600ms)*.75);animation-timing-function:cubic-bezier(0.2, 0, 0, 1);box-sizing:border-box;color:var(--md-focus-ring-color, var(--md-sys-color-secondary, #625b71));display:none;pointer-events:none;position:absolute}:host([visible]){display:flex}:host(:not([inward])){animation-name:outward-grow,outward-shrink;border-end-end-radius:calc(var(--md-focus-ring-shape-end-end, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) + var(--md-focus-ring-outward-offset, 2px));border-end-start-radius:calc(var(--md-focus-ring-shape-end-start, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) + var(--md-focus-ring-outward-offset, 2px));border-start-end-radius:calc(var(--md-focus-ring-shape-start-end, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) + var(--md-focus-ring-outward-offset, 2px));border-start-start-radius:calc(var(--md-focus-ring-shape-start-start, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) + var(--md-focus-ring-outward-offset, 2px));inset:calc(-1*var(--md-focus-ring-outward-offset, 2px));outline:var(--md-focus-ring-width, 3px) solid currentColor}:host([inward]){animation-name:inward-grow,inward-shrink;border-end-end-radius:calc(var(--md-focus-ring-shape-end-end, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) - var(--md-focus-ring-inward-offset, 0px));border-end-start-radius:calc(var(--md-focus-ring-shape-end-start, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) - var(--md-focus-ring-inward-offset, 0px));border-start-end-radius:calc(var(--md-focus-ring-shape-start-end, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) - var(--md-focus-ring-inward-offset, 0px));border-start-start-radius:calc(var(--md-focus-ring-shape-start-start, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) - var(--md-focus-ring-inward-offset, 0px));border:var(--md-focus-ring-width, 3px) solid currentColor;inset:var(--md-focus-ring-inward-offset, 0px)}@keyframes outward-grow{from{outline-width:0}to{outline-width:var(--md-focus-ring-active-width, 8px)}}@keyframes outward-shrink{from{outline-width:var(--md-focus-ring-active-width, 8px)}}@keyframes inward-grow{from{border-width:0}to{border-width:var(--md-focus-ring-active-width, 8px)}}@keyframes inward-shrink{from{border-width:var(--md-focus-ring-active-width, 8px)}}@media(prefers-reduced-motion){:host{animation:none}}
`;
let J = class extends ht {
};
J.styles = [ge];
J = c([
  dt("md-focus-ring")
], J);
const ve = { ATTRIBUTE: 1, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4 }, ye = (s) => (...t) => ({ _$litDirective$: s, values: t });
class _e {
  constructor(t) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t, e, i) {
    this._$Ct = t, this._$AM = e, this._$Ci = i;
  }
  _$AS(t, e) {
    return this.update(t, e);
  }
  update(t, e) {
    return this.render(...e);
  }
}
const zt = ye(class extends _e {
  constructor(s) {
    if (super(s), s.type !== ve.ATTRIBUTE || s.name !== "class" || s.strings?.length > 2) throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
  }
  render(s) {
    return " " + Object.keys(s).filter(((t) => s[t])).join(" ") + " ";
  }
  update(s, [t]) {
    if (this.st === void 0) {
      this.st = /* @__PURE__ */ new Set(), s.strings !== void 0 && (this.nt = new Set(s.strings.join(" ").split(/\s/).filter(((i) => i !== ""))));
      for (const i in t) t[i] && !this.nt?.has(i) && this.st.add(i);
      return this.render(t);
    }
    const e = s.element.classList;
    for (const i of this.st) i in t || (e.remove(i), this.st.delete(i));
    for (const i in t) {
      const r = !!t[i];
      r === this.st.has(i) || this.nt?.has(i) || (r ? (e.add(i), this.st.add(i)) : (e.remove(i), this.st.delete(i)));
    }
    return S;
  }
});
const L = {
  STANDARD: "cubic-bezier(0.2, 0, 0, 1)",
  EMPHASIZED: "cubic-bezier(.3,0,0,1)",
  EMPHASIZED_ACCELERATE: "cubic-bezier(.3,0,.8,.15)"
};
function ei() {
  let s = null;
  return {
    start() {
      return s?.abort(), s = new AbortController(), s.signal;
    },
    finish() {
      s = null;
    }
  };
}
const xe = 450, Et = 225, Ae = 0.2, $e = 10, Ce = 75, we = 0.35, Ee = "::after", Se = "forwards";
var b;
(function(s) {
  s[s.INACTIVE = 0] = "INACTIVE", s[s.TOUCH_DELAY = 1] = "TOUCH_DELAY", s[s.HOLDING = 2] = "HOLDING", s[s.WAITING_FOR_CLICK = 3] = "WAITING_FOR_CLICK";
})(b || (b = {}));
const Te = [
  "click",
  "contextmenu",
  "pointercancel",
  "pointerdown",
  "pointerenter",
  "pointerleave",
  "pointerup"
], Pe = 150, Ie = window.matchMedia("(forced-colors: active)");
class U extends x {
  constructor() {
    super(...arguments), this.disabled = !1, this.hovered = !1, this.pressed = !1, this.rippleSize = "", this.rippleScale = "", this.initialSize = 0, this.state = b.INACTIVE, this.attachableController = new Mt(this, this.onControlChange.bind(this));
  }
  get htmlFor() {
    return this.attachableController.htmlFor;
  }
  set htmlFor(t) {
    this.attachableController.htmlFor = t;
  }
  get control() {
    return this.attachableController.control;
  }
  set control(t) {
    this.attachableController.control = t;
  }
  attach(t) {
    this.attachableController.attach(t);
  }
  detach() {
    this.attachableController.detach();
  }
  connectedCallback() {
    super.connectedCallback(), this.setAttribute("aria-hidden", "true");
  }
  render() {
    const t = {
      hovered: this.hovered,
      pressed: this.pressed
    };
    return $`<div class="surface ${zt(t)}"></div>`;
  }
  update(t) {
    t.has("disabled") && this.disabled && (this.hovered = !1, this.pressed = !1), super.update(t);
  }
  /**
   * TODO(b/269799771): make private
   * @private only public for slider
   */
  handlePointerenter(t) {
    this.shouldReactToEvent(t) && (this.hovered = !0);
  }
  /**
   * TODO(b/269799771): make private
   * @private only public for slider
   */
  handlePointerleave(t) {
    this.shouldReactToEvent(t) && (this.hovered = !1, this.state !== b.INACTIVE && this.endPressAnimation());
  }
  handlePointerup(t) {
    if (this.shouldReactToEvent(t)) {
      if (this.state === b.HOLDING) {
        this.state = b.WAITING_FOR_CLICK;
        return;
      }
      if (this.state === b.TOUCH_DELAY) {
        this.state = b.WAITING_FOR_CLICK, this.startPressAnimation(this.rippleStartEvent);
        return;
      }
    }
  }
  async handlePointerdown(t) {
    if (this.shouldReactToEvent(t)) {
      if (this.rippleStartEvent = t, !this.isTouch(t)) {
        this.state = b.WAITING_FOR_CLICK, this.startPressAnimation(t);
        return;
      }
      this.state = b.TOUCH_DELAY, await new Promise((e) => {
        setTimeout(e, Pe);
      }), this.state === b.TOUCH_DELAY && (this.state = b.HOLDING, this.startPressAnimation(t));
    }
  }
  handleClick() {
    if (!this.disabled) {
      if (this.state === b.WAITING_FOR_CLICK) {
        this.endPressAnimation();
        return;
      }
      this.state === b.INACTIVE && (this.startPressAnimation(), this.endPressAnimation());
    }
  }
  handlePointercancel(t) {
    this.shouldReactToEvent(t) && this.endPressAnimation();
  }
  handleContextmenu() {
    this.disabled || this.endPressAnimation();
  }
  determineRippleSize() {
    const { height: t, width: e } = this.getBoundingClientRect(), i = Math.max(t, e), r = Math.max(we * i, Ce), o = this.currentCSSZoom ?? 1, n = Math.floor(i * Ae / o), a = Math.sqrt(e ** 2 + t ** 2) + $e;
    this.initialSize = n;
    const p = (a + r) / n;
    this.rippleScale = `${p / o}`, this.rippleSize = `${n}px`;
  }
  getNormalizedPointerEventCoords(t) {
    const { scrollX: e, scrollY: i } = window, { left: r, top: o } = this.getBoundingClientRect(), n = e + r, l = i + o, { pageX: a, pageY: p } = t, u = this.currentCSSZoom ?? 1;
    return {
      x: (a - n) / u,
      y: (p - l) / u
    };
  }
  getTranslationCoordinates(t) {
    const { height: e, width: i } = this.getBoundingClientRect(), r = this.currentCSSZoom ?? 1, o = {
      x: (i / r - this.initialSize) / 2,
      y: (e / r - this.initialSize) / 2
    };
    let n;
    return t instanceof PointerEvent ? n = this.getNormalizedPointerEventCoords(t) : n = {
      x: i / r / 2,
      y: e / r / 2
    }, n = {
      x: n.x - this.initialSize / 2,
      y: n.y - this.initialSize / 2
    }, { startPoint: n, endPoint: o };
  }
  startPressAnimation(t) {
    if (!this.mdRoot)
      return;
    this.pressed = !0, this.growAnimation?.cancel(), this.determineRippleSize();
    const { startPoint: e, endPoint: i } = this.getTranslationCoordinates(t), r = `${e.x}px, ${e.y}px`, o = `${i.x}px, ${i.y}px`;
    this.growAnimation = this.mdRoot.animate({
      top: [0, 0],
      left: [0, 0],
      height: [this.rippleSize, this.rippleSize],
      width: [this.rippleSize, this.rippleSize],
      transform: [
        `translate(${r}) scale(1)`,
        `translate(${o}) scale(${this.rippleScale})`
      ]
    }, {
      pseudoElement: Ee,
      duration: xe,
      easing: L.STANDARD,
      fill: Se
    });
  }
  async endPressAnimation() {
    this.rippleStartEvent = void 0, this.state = b.INACTIVE;
    const t = this.growAnimation;
    let e = 1 / 0;
    if (typeof t?.currentTime == "number" ? e = t.currentTime : t?.currentTime && (e = t.currentTime.to("ms").value), e >= Et) {
      this.pressed = !1;
      return;
    }
    await new Promise((i) => {
      setTimeout(i, Et - e);
    }), this.growAnimation === t && (this.pressed = !1);
  }
  /**
   * Returns `true` if
   *  - the ripple element is enabled
   *  - the pointer is primary for the input type
   *  - the pointer is the pointer that started the interaction, or will start
   * the interaction
   *  - the pointer is a touch, or the pointer state has the primary button
   * held, or the pointer is hovering
   */
  shouldReactToEvent(t) {
    if (this.disabled || !t.isPrimary || this.rippleStartEvent && this.rippleStartEvent.pointerId !== t.pointerId)
      return !1;
    if (t.type === "pointerenter" || t.type === "pointerleave")
      return !this.isTouch(t);
    const e = t.buttons === 1;
    return this.isTouch(t) || e;
  }
  isTouch({ pointerType: t }) {
    return t === "touch";
  }
  /** @private */
  async handleEvent(t) {
    if (!Ie?.matches)
      switch (t.type) {
        case "click":
          this.handleClick();
          break;
        case "contextmenu":
          this.handleContextmenu();
          break;
        case "pointercancel":
          this.handlePointercancel(t);
          break;
        case "pointerdown":
          await this.handlePointerdown(t);
          break;
        case "pointerenter":
          this.handlePointerenter(t);
          break;
        case "pointerleave":
          this.handlePointerleave(t);
          break;
        case "pointerup":
          this.handlePointerup(t);
          break;
      }
  }
  onControlChange(t, e) {
    for (const i of Te)
      t?.removeEventListener(i, this), e?.addEventListener(i, this);
  }
}
c([
  f({ type: Boolean, reflect: !0 })
], U.prototype, "disabled", void 0);
c([
  P()
], U.prototype, "hovered", void 0);
c([
  P()
], U.prototype, "pressed", void 0);
c([
  v(".surface")
], U.prototype, "mdRoot", void 0);
const Oe = T`:host{display:flex;margin:auto;pointer-events:none}:host([disabled]){display:none}@media(forced-colors: active){:host{display:none}}:host,.surface{border-radius:inherit;position:absolute;inset:0;overflow:hidden}.surface{-webkit-tap-highlight-color:rgba(0,0,0,0)}.surface::before,.surface::after{content:"";opacity:0;position:absolute}.surface::before{background-color:var(--md-ripple-hover-color, var(--md-sys-color-on-surface, #1d1b20));inset:0;transition:opacity 15ms linear,background-color 15ms linear}.surface::after{background:radial-gradient(closest-side, var(--md-ripple-pressed-color, var(--md-sys-color-on-surface, #1d1b20)) max(100% - 70px, 65%), transparent 100%);transform-origin:center center;transition:opacity 375ms linear}.hovered::before{background-color:var(--md-ripple-hover-color, var(--md-sys-color-on-surface, #1d1b20));opacity:var(--md-ripple-hover-opacity, 0.08)}.pressed::after{opacity:var(--md-ripple-pressed-opacity, 0.12);transition-duration:105ms}
`;
let Q = class extends U {
};
Q.styles = [Oe];
Q = c([
  dt("md-ripple")
], Q);
const Lt = [
  "role",
  "ariaAtomic",
  "ariaAutoComplete",
  "ariaBusy",
  "ariaChecked",
  "ariaColCount",
  "ariaColIndex",
  "ariaColSpan",
  "ariaCurrent",
  "ariaDisabled",
  "ariaExpanded",
  "ariaHasPopup",
  "ariaHidden",
  "ariaInvalid",
  "ariaKeyShortcuts",
  "ariaLabel",
  "ariaLevel",
  "ariaLive",
  "ariaModal",
  "ariaMultiLine",
  "ariaMultiSelectable",
  "ariaOrientation",
  "ariaPlaceholder",
  "ariaPosInSet",
  "ariaPressed",
  "ariaReadOnly",
  "ariaRequired",
  "ariaRoleDescription",
  "ariaRowCount",
  "ariaRowIndex",
  "ariaRowSpan",
  "ariaSelected",
  "ariaSetSize",
  "ariaSort",
  "ariaValueMax",
  "ariaValueMin",
  "ariaValueNow",
  "ariaValueText"
], Re = Lt.map(Ft);
function K(s) {
  return Re.includes(s);
}
function Ft(s) {
  return s.replace("aria", "aria-").replace(/Elements?/g, "").toLowerCase();
}
const H = /* @__PURE__ */ Symbol("privateIgnoreAttributeChangesFor");
function Ut(s) {
  var t;
  class e extends s {
    constructor() {
      super(...arguments), this[t] = /* @__PURE__ */ new Set();
    }
    attributeChangedCallback(r, o, n) {
      if (!K(r)) {
        super.attributeChangedCallback(r, o, n);
        return;
      }
      if (this[H].has(r))
        return;
      this[H].add(r), this.removeAttribute(r), this[H].delete(r);
      const l = et(r);
      n === null ? delete this.dataset[l] : this.dataset[l] = n, this.requestUpdate(et(r), o);
    }
    getAttribute(r) {
      return K(r) ? super.getAttribute(tt(r)) : super.getAttribute(r);
    }
    removeAttribute(r) {
      super.removeAttribute(r), K(r) && (super.removeAttribute(tt(r)), this.requestUpdate());
    }
  }
  return t = H, ke(e), e;
}
function ke(s) {
  for (const t of Lt) {
    const e = Ft(t), i = tt(e), r = et(e);
    s.createProperty(t, {
      attribute: e,
      noAccessor: !0
    }), s.createProperty(Symbol(i), {
      attribute: i,
      noAccessor: !0
    }), Object.defineProperty(s.prototype, t, {
      configurable: !0,
      enumerable: !0,
      get() {
        return this.dataset[r] ?? null;
      },
      set(o) {
        const n = this.dataset[r] ?? null;
        o !== n && (o === null ? delete this.dataset[r] : this.dataset[r] = o, this.requestUpdate(t, n));
      }
    });
  }
}
function tt(s) {
  return `data-${s}`;
}
function et(s) {
  return s.replace(/-\w/, (t) => t[1].toUpperCase());
}
const pt = /* @__PURE__ */ Symbol("internals"), X = /* @__PURE__ */ Symbol("privateInternals");
function De(s) {
  class t extends s {
    get [pt]() {
      return this[X] || (this[X] = this.attachInternals()), this[X];
    }
  }
  return t;
}
function Ne(s) {
  s.addInitializer((t) => {
    const e = t;
    e.addEventListener("click", async (i) => {
      const { type: r, [pt]: o } = e, { form: n } = o;
      if (!(!n || r === "button") && (await new Promise((l) => {
        setTimeout(l);
      }), !i.defaultPrevented)) {
        if (r === "reset") {
          n.reset();
          return;
        }
        n.addEventListener("submit", (l) => {
          Object.defineProperty(l, "submitter", {
            configurable: !0,
            enumerable: !0,
            get: () => e
          });
        }, { capture: !0, once: !0 }), o.setFormValue(e.value), n.requestSubmit();
      }
    });
  });
}
function Me(s) {
  const t = new MouseEvent("click", { bubbles: !0 });
  return s.dispatchEvent(t), t;
}
function ze(s) {
  return s.currentTarget !== s.target || s.composedPath()[0] !== s.target || s.target.disabled ? !1 : !Le(s);
}
function Le(s) {
  const t = it;
  return t && (s.preventDefault(), s.stopImmediatePropagation()), Fe(), t;
}
let it = !1;
async function Fe() {
  it = !0, await null, it = !1;
}
const Ue = Ut(De(x));
class g extends Ue {
  get name() {
    return this.getAttribute("name") ?? "";
  }
  set name(t) {
    this.setAttribute("name", t);
  }
  /**
   * The associated form element with which this element's value will submit.
   */
  get form() {
    return this[pt].form;
  }
  constructor() {
    super(), this.disabled = !1, this.softDisabled = !1, this.href = "", this.download = "", this.target = "", this.trailingIcon = !1, this.hasIcon = !1, this.type = "submit", this.value = "", this.addEventListener("click", this.handleClick.bind(this));
  }
  focus() {
    this.buttonElement?.focus();
  }
  blur() {
    this.buttonElement?.blur();
  }
  render() {
    const t = this.disabled || this.softDisabled, e = this.href ? this.renderLink() : this.renderButton(), i = this.href ? "link" : "button";
    return $`
      ${this.renderElevationOrOutline?.()}
      <div class="background"></div>
      <md-focus-ring part="focus-ring" for=${i}></md-focus-ring>
      <md-ripple
        part="ripple"
        for=${i}
        ?disabled="${t}"></md-ripple>
      ${e}
    `;
  }
  renderButton() {
    const { ariaLabel: t, ariaHasPopup: e, ariaExpanded: i } = this;
    return $`<button
      id="button"
      class="button"
      ?disabled=${this.disabled}
      aria-disabled=${this.softDisabled || d}
      aria-label="${t || d}"
      aria-haspopup="${e || d}"
      aria-expanded="${i || d}">
      ${this.renderContent()}
    </button>`;
  }
  renderLink() {
    const { ariaLabel: t, ariaHasPopup: e, ariaExpanded: i } = this;
    return $`<a
      id="link"
      class="button"
      aria-label="${t || d}"
      aria-haspopup="${e || d}"
      aria-expanded="${i || d}"
      aria-disabled=${this.disabled || this.softDisabled || d}
      tabindex="${this.disabled && !this.softDisabled ? -1 : d}"
      href=${this.href}
      download=${this.download || d}
      target=${this.target || d}
      >${this.renderContent()}
    </a>`;
  }
  renderContent() {
    const t = $`<slot
      name="icon"
      @slotchange="${this.handleSlotChange}"></slot>`;
    return $`
      <span class="touch"></span>
      ${this.trailingIcon ? d : t}
      <span class="label"><slot></slot></span>
      ${this.trailingIcon ? t : d}
    `;
  }
  handleClick(t) {
    if (this.softDisabled || this.disabled && this.href) {
      t.stopImmediatePropagation(), t.preventDefault();
      return;
    }
    !ze(t) || !this.buttonElement || (this.focus(), Me(this.buttonElement));
  }
  handleSlotChange() {
    this.hasIcon = this.assignedIcons.length > 0;
  }
}
Ne(g);
g.formAssociated = !0;
g.shadowRootOptions = {
  mode: "open",
  delegatesFocus: !0
};
c([
  f({ type: Boolean, reflect: !0 })
], g.prototype, "disabled", void 0);
c([
  f({ type: Boolean, attribute: "soft-disabled", reflect: !0 })
], g.prototype, "softDisabled", void 0);
c([
  f()
], g.prototype, "href", void 0);
c([
  f()
], g.prototype, "download", void 0);
c([
  f()
], g.prototype, "target", void 0);
c([
  f({ type: Boolean, attribute: "trailing-icon", reflect: !0 })
], g.prototype, "trailingIcon", void 0);
c([
  f({ type: Boolean, attribute: "has-icon", reflect: !0 })
], g.prototype, "hasIcon", void 0);
c([
  f()
], g.prototype, "type", void 0);
c([
  f({ reflect: !0 })
], g.prototype, "value", void 0);
c([
  v(".button")
], g.prototype, "buttonElement", void 0);
c([
  fe({ slot: "icon", flatten: !0 })
], g.prototype, "assignedIcons", void 0);
class He extends g {
}
const Be = T`:host{--_container-height: var(--md-text-button-container-height, 40px);--_disabled-label-text-color: var(--md-text-button-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-label-text-opacity: var(--md-text-button-disabled-label-text-opacity, 0.38);--_focus-label-text-color: var(--md-text-button-focus-label-text-color, var(--md-sys-color-primary, #6750a4));--_hover-label-text-color: var(--md-text-button-hover-label-text-color, var(--md-sys-color-primary, #6750a4));--_hover-state-layer-color: var(--md-text-button-hover-state-layer-color, var(--md-sys-color-primary, #6750a4));--_hover-state-layer-opacity: var(--md-text-button-hover-state-layer-opacity, 0.08);--_label-text-color: var(--md-text-button-label-text-color, var(--md-sys-color-primary, #6750a4));--_label-text-font: var(--md-text-button-label-text-font, var(--md-sys-typescale-label-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-text-button-label-text-line-height, var(--md-sys-typescale-label-large-line-height, 1.25rem));--_label-text-size: var(--md-text-button-label-text-size, var(--md-sys-typescale-label-large-size, 0.875rem));--_label-text-weight: var(--md-text-button-label-text-weight, var(--md-sys-typescale-label-large-weight, var(--md-ref-typeface-weight-medium, 500)));--_pressed-label-text-color: var(--md-text-button-pressed-label-text-color, var(--md-sys-color-primary, #6750a4));--_pressed-state-layer-color: var(--md-text-button-pressed-state-layer-color, var(--md-sys-color-primary, #6750a4));--_pressed-state-layer-opacity: var(--md-text-button-pressed-state-layer-opacity, 0.12);--_disabled-icon-color: var(--md-text-button-disabled-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-icon-opacity: var(--md-text-button-disabled-icon-opacity, 0.38);--_focus-icon-color: var(--md-text-button-focus-icon-color, var(--md-sys-color-primary, #6750a4));--_hover-icon-color: var(--md-text-button-hover-icon-color, var(--md-sys-color-primary, #6750a4));--_icon-color: var(--md-text-button-icon-color, var(--md-sys-color-primary, #6750a4));--_icon-size: var(--md-text-button-icon-size, 18px);--_pressed-icon-color: var(--md-text-button-pressed-icon-color, var(--md-sys-color-primary, #6750a4));--_container-shape-start-start: var(--md-text-button-container-shape-start-start, var(--md-text-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-start-end: var(--md-text-button-container-shape-start-end, var(--md-text-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-end: var(--md-text-button-container-shape-end-end, var(--md-text-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-start: var(--md-text-button-container-shape-end-start, var(--md-text-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_leading-space: var(--md-text-button-leading-space, 12px);--_trailing-space: var(--md-text-button-trailing-space, 12px);--_with-leading-icon-leading-space: var(--md-text-button-with-leading-icon-leading-space, 12px);--_with-leading-icon-trailing-space: var(--md-text-button-with-leading-icon-trailing-space, 16px);--_with-trailing-icon-leading-space: var(--md-text-button-with-trailing-icon-leading-space, 16px);--_with-trailing-icon-trailing-space: var(--md-text-button-with-trailing-icon-trailing-space, 12px);--_container-color: none;--_disabled-container-color: none;--_disabled-container-opacity: 0}
`;
class Ht extends He {
}
Ht.styles = [me, Be];
customElements.define("ew-text-button", Ht);
class G extends x {
  constructor() {
    super(...arguments), this.inset = !1, this.insetStart = !1, this.insetEnd = !1;
  }
}
c([
  f({ type: Boolean, reflect: !0 })
], G.prototype, "inset", void 0);
c([
  f({ type: Boolean, reflect: !0, attribute: "inset-start" })
], G.prototype, "insetStart", void 0);
c([
  f({ type: Boolean, reflect: !0, attribute: "inset-end" })
], G.prototype, "insetEnd", void 0);
const je = T`:host{box-sizing:border-box;color:var(--md-divider-color, var(--md-sys-color-outline-variant, #cac4d0));display:flex;height:var(--md-divider-thickness, 1px);width:100%}:host([inset]),:host([inset-start]){padding-inline-start:16px}:host([inset]),:host([inset-end]){padding-inline-end:16px}:host::before{background:currentColor;content:"";height:100%;width:100%}@media(forced-colors: active){:host::before{background:CanvasText}}
`;
function Ve(s, t) {
  t.bubbles && (!s.shadowRoot || t.composed) && t.stopPropagation();
  const e = Reflect.construct(t.constructor, [t.type, t]), i = s.dispatchEvent(e);
  return i || t.preventDefault(), i;
}
let st = class extends G {
};
st.styles = [je];
st = c([
  dt("md-divider")
], st);
const qe = {
  dialog: [
    [
      // Dialog slide down
      [{ transform: "translateY(-50px)" }, { transform: "translateY(0)" }],
      { duration: 500, easing: L.EMPHASIZED }
    ]
  ],
  scrim: [
    [
      // Scrim fade in
      [{ opacity: 0 }, { opacity: 0.32 }],
      { duration: 500, easing: "linear" }
    ]
  ],
  container: [
    [
      // Container fade in
      [{ opacity: 0 }, { opacity: 1 }],
      { duration: 50, easing: "linear", pseudoElement: "::before" }
    ],
    [
      // Container grow
      // Note: current spec says to grow from 0dp->100% and shrink from
      // 100%->35%. We change this to 35%->100% to simplify the animation that
      // is supposed to clip content as it grows. From 0dp it's possible to see
      // text/actions appear before the container has fully grown.
      [{ height: "35%" }, { height: "100%" }],
      { duration: 500, easing: L.EMPHASIZED, pseudoElement: "::before" }
    ]
  ],
  headline: [
    [
      // Headline fade in
      [{ opacity: 0 }, { opacity: 0, offset: 0.2 }, { opacity: 1 }],
      { duration: 250, easing: "linear", fill: "forwards" }
    ]
  ],
  content: [
    [
      // Content fade in
      [{ opacity: 0 }, { opacity: 0, offset: 0.2 }, { opacity: 1 }],
      { duration: 250, easing: "linear", fill: "forwards" }
    ]
  ],
  actions: [
    [
      // Actions fade in
      [{ opacity: 0 }, { opacity: 0, offset: 0.5 }, { opacity: 1 }],
      { duration: 300, easing: "linear", fill: "forwards" }
    ]
  ]
}, We = {
  dialog: [
    [
      // Dialog slide up
      [{ transform: "translateY(0)" }, { transform: "translateY(-50px)" }],
      { duration: 150, easing: L.EMPHASIZED_ACCELERATE }
    ]
  ],
  scrim: [
    [
      // Scrim fade out
      [{ opacity: 0.32 }, { opacity: 0 }],
      { duration: 150, easing: "linear" }
    ]
  ],
  container: [
    [
      // Container shrink
      [{ height: "100%" }, { height: "35%" }],
      {
        duration: 150,
        easing: L.EMPHASIZED_ACCELERATE,
        pseudoElement: "::before"
      }
    ],
    [
      // Container fade out
      [{ opacity: "1" }, { opacity: "0" }],
      { delay: 100, duration: 50, easing: "linear", pseudoElement: "::before" }
    ]
  ],
  headline: [
    [
      // Headline fade out
      [{ opacity: 1 }, { opacity: 0 }],
      { duration: 100, easing: "linear", fill: "forwards" }
    ]
  ],
  content: [
    [
      // Content fade out
      [{ opacity: 1 }, { opacity: 0 }],
      { duration: 100, easing: "linear", fill: "forwards" }
    ]
  ],
  actions: [
    [
      // Actions fade out
      [{ opacity: 1 }, { opacity: 0 }],
      { duration: 100, easing: "linear", fill: "forwards" }
    ]
  ]
};
const Ge = Ut(x);
class m extends Ge {
  // We do not use `delegatesFocus: true` due to a Chromium bug with
  // selecting text.
  // See https://bugs.chromium.org/p/chromium/issues/detail?id=950357
  /**
   * Opens the dialog when set to `true` and closes it when set to `false`.
   */
  get open() {
    return this.isOpen;
  }
  set open(t) {
    t !== this.isOpen && (this.isOpen = t, t ? (this.setAttribute("open", ""), this.show()) : (this.removeAttribute("open"), this.close()));
  }
  constructor() {
    super(), this.quick = !1, this.returnValue = "", this.noFocusTrap = !1, this.getOpenAnimation = () => qe, this.getCloseAnimation = () => We, this.isOpen = !1, this.isOpening = !1, this.isConnectedPromise = this.getIsConnectedPromise(), this.isAtScrollTop = !1, this.isAtScrollBottom = !1, this.nextClickIsFromContent = !1, this.hasHeadline = !1, this.hasActions = !1, this.hasIcon = !1, this.escapePressedWithoutCancel = !1, this.treewalker = document.createTreeWalker(this, NodeFilter.SHOW_ELEMENT), this.addEventListener("submit", this.handleSubmit);
  }
  /**
   * Opens the dialog and fires a cancelable `open` event. After a dialog's
   * animation, an `opened` event is fired.
   *
   * Add an `autofocus` attribute to a child of the dialog that should
   * receive focus after opening.
   *
   * @return A Promise that resolves after the animation is finished and the
   *     `opened` event was fired.
   */
  async show() {
    this.isOpening = !0, await this.isConnectedPromise, await this.updateComplete;
    const t = this.dialog;
    if (t.open || !this.isOpening) {
      this.isOpening = !1;
      return;
    }
    if (!this.dispatchEvent(new Event("open", { cancelable: !0 }))) {
      this.open = !1, this.isOpening = !1;
      return;
    }
    t.showModal(), this.open = !0, this.scroller && (this.scroller.scrollTop = 0), this.querySelector("[autofocus]")?.focus(), await this.animateDialog(this.getOpenAnimation()), this.dispatchEvent(new Event("opened")), this.isOpening = !1;
  }
  /**
   * Closes the dialog and fires a cancelable `close` event. After a dialog's
   * animation, a `closed` event is fired.
   *
   * @param returnValue A return value usually indicating which button was used
   *     to close a dialog. If a dialog is canceled by clicking the scrim or
   *     pressing Escape, it will not change the return value after closing.
   * @return A Promise that resolves after the animation is finished and the
   *     `closed` event was fired.
   */
  async close(t = this.returnValue) {
    if (this.isOpening = !1, !this.isConnected) {
      this.open = !1;
      return;
    }
    await this.updateComplete;
    const e = this.dialog;
    if (!e.open || this.isOpening) {
      this.open = !1;
      return;
    }
    const i = this.returnValue;
    if (this.returnValue = t, !this.dispatchEvent(new Event("close", { cancelable: !0 }))) {
      this.returnValue = i;
      return;
    }
    await this.animateDialog(this.getCloseAnimation()), e.close(t), this.open = !1, this.dispatchEvent(new Event("closed"));
  }
  connectedCallback() {
    super.connectedCallback(), this.isConnectedPromiseResolve();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.isConnectedPromise = this.getIsConnectedPromise();
  }
  render() {
    const t = this.open && !(this.isAtScrollTop && this.isAtScrollBottom), e = {
      "has-headline": this.hasHeadline,
      "has-actions": this.hasActions,
      "has-icon": this.hasIcon,
      scrollable: t,
      "show-top-divider": t && !this.isAtScrollTop,
      "show-bottom-divider": t && !this.isAtScrollBottom
    }, i = this.open && !this.noFocusTrap, r = $`
      <div
        class="focus-trap"
        tabindex="0"
        aria-hidden="true"
        @focus=${this.handleFocusTrapFocus}></div>
    `, { ariaLabel: o } = this;
    return $`
      <div class="scrim"></div>
      <dialog
        class=${zt(e)}
        aria-label=${o || d}
        aria-labelledby=${this.hasHeadline ? "headline" : d}
        role=${this.type === "alert" ? "alertdialog" : d}
        @cancel=${this.handleCancel}
        @click=${this.handleDialogClick}
        @close=${this.handleClose}
        @keydown=${this.handleKeydown}
        .returnValue=${this.returnValue || d}>
        ${i ? r : d}
        <div class="container" @click=${this.handleContentClick}>
          <div class="headline">
            <div class="icon" aria-hidden="true">
              <slot name="icon" @slotchange=${this.handleIconChange}></slot>
            </div>
            <h2 id="headline" aria-hidden=${!this.hasHeadline || d}>
              <slot
                name="headline"
                @slotchange=${this.handleHeadlineChange}></slot>
            </h2>
            <md-divider></md-divider>
          </div>
          <div class="scroller">
            <div class="content">
              <div class="top anchor"></div>
              <slot name="content"></slot>
              <div class="bottom anchor"></div>
            </div>
          </div>
          <div class="actions">
            <md-divider></md-divider>
            <slot name="actions" @slotchange=${this.handleActionsChange}></slot>
          </div>
        </div>
        ${i ? r : d}
      </dialog>
    `;
  }
  firstUpdated() {
    this.intersectionObserver = new IntersectionObserver((t) => {
      for (const e of t)
        this.handleAnchorIntersection(e);
    }, { root: this.scroller }), this.intersectionObserver.observe(this.topAnchor), this.intersectionObserver.observe(this.bottomAnchor);
  }
  handleDialogClick() {
    if (this.nextClickIsFromContent) {
      this.nextClickIsFromContent = !1;
      return;
    }
    this.dispatchEvent(new Event("cancel", { cancelable: !0 })) && this.close();
  }
  handleContentClick() {
    this.nextClickIsFromContent = !0;
  }
  handleSubmit(t) {
    const e = t.target, { submitter: i } = t;
    e.getAttribute("method") !== "dialog" || !i || this.close(i.getAttribute("value") ?? this.returnValue);
  }
  handleCancel(t) {
    if (t.target !== this.dialog)
      return;
    this.escapePressedWithoutCancel = !1;
    const e = !Ve(this, t);
    t.preventDefault(), !e && this.close();
  }
  handleClose() {
    this.escapePressedWithoutCancel && (this.escapePressedWithoutCancel = !1, this.dialog?.dispatchEvent(new Event("cancel", { cancelable: !0 })));
  }
  handleKeydown(t) {
    t.key === "Escape" && (this.escapePressedWithoutCancel = !0, setTimeout(() => {
      this.escapePressedWithoutCancel = !1;
    }));
  }
  async animateDialog(t) {
    if (this.cancelAnimations?.abort(), this.cancelAnimations = new AbortController(), this.quick)
      return;
    const { dialog: e, scrim: i, container: r, headline: o, content: n, actions: l } = this;
    if (!e || !i || !r || !o || !n || !l)
      return;
    const { container: a, dialog: p, scrim: u, headline: h, content: y, actions: _ } = t, I = [
      [e, p ?? []],
      [i, u ?? []],
      [r, a ?? []],
      [o, h ?? []],
      [n, y ?? []],
      [l, _ ?? []]
    ], ut = [];
    for (const [Y, jt] of I)
      for (const Vt of jt) {
        const ft = Y.animate(...Vt);
        this.cancelAnimations.signal.addEventListener("abort", () => {
          ft.cancel();
        }), ut.push(ft);
      }
    await Promise.all(ut.map((Y) => Y.finished.catch(() => {
    })));
  }
  handleHeadlineChange(t) {
    const e = t.target;
    this.hasHeadline = e.assignedElements().length > 0;
  }
  handleActionsChange(t) {
    const e = t.target;
    this.hasActions = e.assignedElements().length > 0;
  }
  handleIconChange(t) {
    const e = t.target;
    this.hasIcon = e.assignedElements().length > 0;
  }
  handleAnchorIntersection(t) {
    const { target: e, isIntersecting: i } = t;
    e === this.topAnchor && (this.isAtScrollTop = i), e === this.bottomAnchor && (this.isAtScrollBottom = i);
  }
  getIsConnectedPromise() {
    return new Promise((t) => {
      this.isConnectedPromiseResolve = t;
    });
  }
  handleFocusTrapFocus(t) {
    const [e, i] = this.getFirstAndLastFocusableChildren();
    if (!e || !i) {
      this.dialog?.focus();
      return;
    }
    const r = t.target === this.firstFocusTrap, o = !r, n = t.relatedTarget === e, l = t.relatedTarget === i, a = !n && !l;
    if (o && l || r && a) {
      e.focus();
      return;
    }
    if (r && n || o && a) {
      i.focus();
      return;
    }
  }
  getFirstAndLastFocusableChildren() {
    if (!this.treewalker)
      return [null, null];
    let t = null, e = null;
    for (this.treewalker.currentNode = this.treewalker.root; this.treewalker.nextNode(); ) {
      const i = this.treewalker.currentNode;
      Ye(i) && (t || (t = i), e = i);
    }
    return [t, e];
  }
}
c([
  f({ type: Boolean })
], m.prototype, "open", null);
c([
  f({ type: Boolean })
], m.prototype, "quick", void 0);
c([
  f({ attribute: !1 })
], m.prototype, "returnValue", void 0);
c([
  f()
], m.prototype, "type", void 0);
c([
  f({ type: Boolean, attribute: "no-focus-trap" })
], m.prototype, "noFocusTrap", void 0);
c([
  v("dialog")
], m.prototype, "dialog", void 0);
c([
  v(".scrim")
], m.prototype, "scrim", void 0);
c([
  v(".container")
], m.prototype, "container", void 0);
c([
  v(".headline")
], m.prototype, "headline", void 0);
c([
  v(".content")
], m.prototype, "content", void 0);
c([
  v(".actions")
], m.prototype, "actions", void 0);
c([
  P()
], m.prototype, "isAtScrollTop", void 0);
c([
  P()
], m.prototype, "isAtScrollBottom", void 0);
c([
  v(".scroller")
], m.prototype, "scroller", void 0);
c([
  v(".top.anchor")
], m.prototype, "topAnchor", void 0);
c([
  v(".bottom.anchor")
], m.prototype, "bottomAnchor", void 0);
c([
  v(".focus-trap")
], m.prototype, "firstFocusTrap", void 0);
c([
  P()
], m.prototype, "hasHeadline", void 0);
c([
  P()
], m.prototype, "hasActions", void 0);
c([
  P()
], m.prototype, "hasIcon", void 0);
function Ye(s) {
  const t = ":is(button,input,select,textarea,object,:is(a,area)[href],[tabindex],[contenteditable=true])", e = ":not(:disabled,[disabled])";
  return s.matches(t + e + ':not([tabindex^="-"])') ? !0 : !s.localName.includes("-") || !s.matches(e) ? !1 : s.shadowRoot?.delegatesFocus ?? !1;
}
const Ze = T`:host{border-start-start-radius:var(--md-dialog-container-shape-start-start, var(--md-dialog-container-shape, var(--md-sys-shape-corner-extra-large, 28px)));border-start-end-radius:var(--md-dialog-container-shape-start-end, var(--md-dialog-container-shape, var(--md-sys-shape-corner-extra-large, 28px)));border-end-end-radius:var(--md-dialog-container-shape-end-end, var(--md-dialog-container-shape, var(--md-sys-shape-corner-extra-large, 28px)));border-end-start-radius:var(--md-dialog-container-shape-end-start, var(--md-dialog-container-shape, var(--md-sys-shape-corner-extra-large, 28px)));display:contents;margin:auto;max-height:min(560px,100% - 48px);max-width:min(560px,100% - 48px);min-height:140px;min-width:280px;position:fixed;height:fit-content;width:fit-content}dialog{background:rgba(0,0,0,0);border:none;border-radius:inherit;flex-direction:column;height:inherit;margin:inherit;max-height:inherit;max-width:inherit;min-height:inherit;min-width:inherit;outline:none;overflow:visible;padding:0;width:inherit}dialog[open]{display:flex}::backdrop{background:none}.scrim{background:var(--md-sys-color-scrim, #000);display:none;inset:0;opacity:32%;pointer-events:none;position:fixed;z-index:1}:host([open]) .scrim{display:flex}h2{all:unset;align-self:stretch}.headline{align-items:center;color:var(--md-dialog-headline-color, var(--md-sys-color-on-surface, #1d1b20));display:flex;flex-direction:column;font-family:var(--md-dialog-headline-font, var(--md-sys-typescale-headline-small-font, var(--md-ref-typeface-brand, Roboto)));font-size:var(--md-dialog-headline-size, var(--md-sys-typescale-headline-small-size, 1.5rem));line-height:var(--md-dialog-headline-line-height, var(--md-sys-typescale-headline-small-line-height, 2rem));font-weight:var(--md-dialog-headline-weight, var(--md-sys-typescale-headline-small-weight, var(--md-ref-typeface-weight-regular, 400)));position:relative}slot[name=headline]::slotted(*){align-items:center;align-self:stretch;box-sizing:border-box;display:flex;gap:8px;padding:24px 24px 0}.icon{display:flex}slot[name=icon]::slotted(*){color:var(--md-dialog-icon-color, var(--md-sys-color-secondary, #625b71));fill:currentColor;font-size:var(--md-dialog-icon-size, 24px);margin-top:24px;height:var(--md-dialog-icon-size, 24px);width:var(--md-dialog-icon-size, 24px)}.has-icon slot[name=headline]::slotted(*){justify-content:center;padding-top:16px}.scrollable slot[name=headline]::slotted(*){padding-bottom:16px}.scrollable.has-headline slot[name=content]::slotted(*){padding-top:8px}.container{border-radius:inherit;display:flex;flex-direction:column;flex-grow:1;overflow:hidden;position:relative;transform-origin:top}.container::before{background:var(--md-dialog-container-color, var(--md-sys-color-surface-container-high, #ece6f0));border-radius:inherit;content:"";inset:0;position:absolute}.scroller{display:flex;flex:1;flex-direction:column;overflow:hidden;z-index:1}.scrollable .scroller{overflow-y:scroll}.content{color:var(--md-dialog-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));font-family:var(--md-dialog-supporting-text-font, var(--md-sys-typescale-body-medium-font, var(--md-ref-typeface-plain, Roboto)));font-size:var(--md-dialog-supporting-text-size, var(--md-sys-typescale-body-medium-size, 0.875rem));line-height:var(--md-dialog-supporting-text-line-height, var(--md-sys-typescale-body-medium-line-height, 1.25rem));flex:1;font-weight:var(--md-dialog-supporting-text-weight, var(--md-sys-typescale-body-medium-weight, var(--md-ref-typeface-weight-regular, 400)));height:min-content;position:relative}slot[name=content]::slotted(*){box-sizing:border-box;padding:24px}.anchor{position:absolute}.top.anchor{top:0}.bottom.anchor{bottom:0}.actions{position:relative}slot[name=actions]::slotted(*){box-sizing:border-box;display:flex;gap:8px;justify-content:flex-end;padding:16px 24px 24px}.has-actions slot[name=content]::slotted(*){padding-bottom:8px}md-divider{display:none;position:absolute}.has-headline.show-top-divider .headline md-divider,.has-actions.show-bottom-divider .actions md-divider{display:flex}.headline md-divider{bottom:0}.actions md-divider{top:0}@media(forced-colors: active){dialog{outline:2px solid WindowText}}
`;
class Bt extends m {
}
Bt.styles = [Ze];
customElements.define("ew-dialog", Bt);
const ri = T`
  :host {
    --roboto-font: Roboto, system-ui;
    --text-color: rgba(0, 0, 0, 0.6);
    --danger-color: #db4437;

    --md-sys-color-primary: #03a9f4;
    --md-sys-color-on-primary: #fff;
    --md-ref-typeface-brand: var(--roboto-font);
    --md-ref-typeface-plain: var(--roboto-font);

    --md-sys-color-surface: #fff;
    --md-sys-color-surface-container: #fff;
    --md-sys-color-surface-container-high: #fff;
    --md-sys-color-surface-container-highest: #f5f5f5;
    --md-sys-color-secondary-container: #e0e0e0;

    --md-sys-typescale-headline-font: var(--roboto-font);
    --md-sys-typescale-title-font: var(--roboto-font);
  }

  a {
    color: var(--md-sys-color-primary);
  }
`;
export {
  de as B,
  G as D,
  d as E,
  S as T,
  c as _,
  T as a,
  v as b,
  zt as c,
  pt as d,
  kt as e,
  De as f,
  ze as g,
  Me as h,
  x as i,
  Ve as j,
  Ne as k,
  L as l,
  Ut as m,
  f as n,
  fe as o,
  ye as p,
  _e as q,
  P as r,
  je as s,
  dt as t,
  ve as u,
  ei as v,
  Je as w,
  $ as x,
  ri as y
};
