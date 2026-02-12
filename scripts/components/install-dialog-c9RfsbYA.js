import { e as Kr, _ as h, o as Ie, n as u, t as Mt, m as ze, a as J, b as ne, s as ia, D as ra, i as te, c as Ut, r as P, d as oa, f as aa, g as $i, h as sa, E as tt, j as Yr, k as jr, l as Le, p as na, q as la } from "./styles-C07gaz4W.js";
import { i as U, b as g, a as N, A, D as Xr, E as it, w as be } from "./index-DVkTBVLT.js";
let da;
function ca(i) {
  return (t, e) => Kr(t, e, { get() {
    return (this.renderRoot ?? (da ??= document.createDocumentFragment())).querySelectorAll(i);
  } });
}
function ha(i) {
  return (t, e) => {
    const { slot: r } = i ?? {}, o = "slot" + (r ? `[name=${r}]` : ":not([name])");
    return Kr(t, e, { get() {
      return this.renderRoot?.querySelector(o)?.assignedNodes(i) ?? [];
    } });
  };
}
function Jr(i, t = ye) {
  const e = Li(i, t);
  return e && (e.tabIndex = 0, e.focus()), e;
}
function Qr(i, t = ye) {
  const e = eo(i, t);
  return e && (e.tabIndex = 0, e.focus()), e;
}
function at(i, t = ye) {
  for (let e = 0; e < i.length; e++) {
    const r = i[e];
    if (r.tabIndex === 0 && t(r))
      return {
        item: r,
        index: e
      };
  }
  return null;
}
function Li(i, t = ye) {
  for (const e of i)
    if (t(e))
      return e;
  return null;
}
function eo(i, t = ye) {
  for (let e = i.length - 1; e >= 0; e--) {
    const r = i[e];
    if (t(r))
      return r;
  }
  return null;
}
function fa(i, t, e = ye, r = !0) {
  for (let o = 1; o < i.length; o++) {
    const a = (o + t) % i.length;
    if (a < t && !r)
      return null;
    const s = i[a];
    if (e(s))
      return s;
  }
  return i[t] ? i[t] : null;
}
function pa(i, t, e = ye, r = !0) {
  for (let o = 1; o < i.length; o++) {
    const a = (t - o + i.length) % i.length;
    if (a > t && !r)
      return null;
    const s = i[a];
    if (e(s))
      return s;
  }
  return i[t] ? i[t] : null;
}
function Zi(i, t, e = ye, r = !0) {
  if (t) {
    const o = fa(i, t.index, e, r);
    return o && (o.tabIndex = 0, o.focus()), o;
  } else
    return Jr(i, e);
}
function Vi(i, t, e = ye, r = !0) {
  if (t) {
    const o = pa(i, t.index, e, r);
    return o && (o.tabIndex = 0, o.focus()), o;
  } else
    return Qr(i, e);
}
function ua() {
  return new Event("request-activation", { bubbles: !0, composed: !0 });
}
function ye(i) {
  return !i.disabled;
}
const V = {
  ArrowDown: "ArrowDown",
  ArrowLeft: "ArrowLeft",
  ArrowUp: "ArrowUp",
  ArrowRight: "ArrowRight",
  Home: "Home",
  End: "End"
};
class to {
  constructor(t) {
    this.handleKeydown = (d) => {
      const v = d.key;
      if (d.defaultPrevented || !this.isNavigableKey(v))
        return;
      const p = this.items;
      if (!p.length)
        return;
      const f = at(p, this.isActivatable);
      d.preventDefault();
      const _ = this.isRtl(), y = _ ? V.ArrowRight : V.ArrowLeft, x = _ ? V.ArrowLeft : V.ArrowRight;
      let b = null;
      switch (v) {
        // Activate the next item
        case V.ArrowDown:
        case x:
          b = Zi(p, f, this.isActivatable, this.wrapNavigation());
          break;
        // Activate the previous item
        case V.ArrowUp:
        case y:
          b = Vi(p, f, this.isActivatable, this.wrapNavigation());
          break;
        // Activate the first item
        case V.Home:
          b = Jr(p, this.isActivatable);
          break;
        // Activate the last item
        case V.End:
          b = Qr(p, this.isActivatable);
          break;
      }
      b && f && f.item !== b && (f.item.tabIndex = -1);
    }, this.onDeactivateItems = () => {
      const d = this.items;
      for (const v of d)
        this.deactivateItem(v);
    }, this.onRequestActivation = (d) => {
      this.onDeactivateItems();
      const v = d.target;
      this.activateItem(v), v.focus();
    }, this.onSlotchange = () => {
      const d = this.items;
      let v = !1;
      for (const f of d) {
        if (!f.disabled && f.tabIndex > -1 && !v) {
          v = !0, f.tabIndex = 0;
          continue;
        }
        f.tabIndex = -1;
      }
      if (v)
        return;
      const p = Li(d, this.isActivatable);
      p && (p.tabIndex = 0);
    };
    const { isItem: e, getPossibleItems: r, isRtl: o, deactivateItem: a, activateItem: s, isNavigableKey: n, isActivatable: c, wrapNavigation: l } = t;
    this.isItem = e, this.getPossibleItems = r, this.isRtl = o, this.deactivateItem = a, this.activateItem = s, this.isNavigableKey = n, this.isActivatable = c, this.wrapNavigation = l ?? (() => !0);
  }
  /**
   * The items being managed by the list. Additionally, attempts to see if the
   * object has a sub-item in the `.item` property.
   */
  get items() {
    const t = this.getPossibleItems(), e = [];
    for (const r of t) {
      if (this.isItem(r)) {
        e.push(r);
        continue;
      }
      const a = r.item;
      a && this.isItem(a) && e.push(a);
    }
    return e;
  }
  /**
   * Activates the next item in the list. If at the end of the list, the first
   * item will be activated.
   *
   * @return The activated list item or `null` if there are no items.
   */
  activateNextItem() {
    const t = this.items, e = at(t, this.isActivatable);
    return e && (e.item.tabIndex = -1), Zi(t, e, this.isActivatable, this.wrapNavigation());
  }
  /**
   * Activates the previous item in the list. If at the start of the list, the
   * last item will be activated.
   *
   * @return The activated list item or `null` if there are no items.
   */
  activatePreviousItem() {
    const t = this.items, e = at(t, this.isActivatable);
    return e && (e.item.tabIndex = -1), Vi(t, e, this.isActivatable, this.wrapNavigation());
  }
}
const ma = new Set(Object.values(V));
class io extends U {
  /** @export */
  get items() {
    return this.listController.items;
  }
  constructor() {
    super(), this.listController = new to({
      isItem: (t) => t.hasAttribute("md-list-item"),
      getPossibleItems: () => this.slotItems,
      isRtl: () => getComputedStyle(this).direction === "rtl",
      deactivateItem: (t) => {
        t.tabIndex = -1;
      },
      activateItem: (t) => {
        t.tabIndex = 0;
      },
      isNavigableKey: (t) => ma.has(t),
      isActivatable: (t) => !t.disabled && t.type !== "text"
    }), this.internals = // Cast needed for closure
    this.attachInternals(), this.internals.role = "list", this.addEventListener("keydown", this.listController.handleKeydown);
  }
  render() {
    return g`
      <slot
        @deactivate-items=${this.listController.onDeactivateItems}
        @request-activation=${this.listController.onRequestActivation}
        @slotchange=${this.listController.onSlotchange}>
      </slot>
    `;
  }
  /**
   * Activates the next item in the list. If at the end of the list, the first
   * item will be activated.
   *
   * @return The activated list item or `null` if there are no items.
   */
  activateNextItem() {
    return this.listController.activateNextItem();
  }
  /**
   * Activates the previous item in the list. If at the start of the list, the
   * last item will be activated.
   *
   * @return The activated list item or `null` if there are no items.
   */
  activatePreviousItem() {
    return this.listController.activatePreviousItem();
  }
}
h([
  Ie({ flatten: !0 })
], io.prototype, "slotItems", void 0);
const va = N`:host{background:var(--md-list-container-color, var(--md-sys-color-surface, #fef7ff));color:unset;display:flex;flex-direction:column;outline:none;padding:8px 0;position:relative}
`;
class ro extends io {
}
ro.styles = [va];
customElements.define("ew-list", ro);
class Di extends U {
  constructor() {
    super(...arguments), this.multiline = !1;
  }
  render() {
    return g`
      <slot name="container"></slot>
      <slot class="non-text" name="start"></slot>
      <div class="text">
        <slot name="overline" @slotchange=${this.handleTextSlotChange}></slot>
        <slot
          class="default-slot"
          @slotchange=${this.handleTextSlotChange}></slot>
        <slot name="headline" @slotchange=${this.handleTextSlotChange}></slot>
        <slot
          name="supporting-text"
          @slotchange=${this.handleTextSlotChange}></slot>
      </div>
      <slot class="non-text" name="trailing-supporting-text"></slot>
      <slot class="non-text" name="end"></slot>
    `;
  }
  handleTextSlotChange() {
    let t = !1, e = 0;
    for (const r of this.textSlots)
      if (ga(r) && (e += 1), e > 1) {
        t = !0;
        break;
      }
    this.multiline = t;
  }
}
h([
  u({ type: Boolean, reflect: !0 })
], Di.prototype, "multiline", void 0);
h([
  ca(".text slot")
], Di.prototype, "textSlots", void 0);
function ga(i) {
  for (const t of i.assignedNodes({ flatten: !0 })) {
    const e = t.nodeType === Node.ELEMENT_NODE, r = t.nodeType === Node.TEXT_NODE && t.textContent?.match(/\S/);
    if (e || r)
      return !0;
  }
  return !1;
}
const _a = N`:host{color:var(--md-sys-color-on-surface, #1d1b20);font-family:var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto));font-size:var(--md-sys-typescale-body-large-size, 1rem);font-weight:var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400));line-height:var(--md-sys-typescale-body-large-line-height, 1.5rem);align-items:center;box-sizing:border-box;display:flex;gap:16px;min-height:56px;overflow:hidden;padding:12px 16px;position:relative;text-overflow:ellipsis}:host([multiline]){min-height:72px}[name=overline]{color:var(--md-sys-color-on-surface-variant, #49454f);font-family:var(--md-sys-typescale-label-small-font, var(--md-ref-typeface-plain, Roboto));font-size:var(--md-sys-typescale-label-small-size, 0.6875rem);font-weight:var(--md-sys-typescale-label-small-weight, var(--md-ref-typeface-weight-medium, 500));line-height:var(--md-sys-typescale-label-small-line-height, 1rem)}[name=supporting-text]{color:var(--md-sys-color-on-surface-variant, #49454f);font-family:var(--md-sys-typescale-body-medium-font, var(--md-ref-typeface-plain, Roboto));font-size:var(--md-sys-typescale-body-medium-size, 0.875rem);font-weight:var(--md-sys-typescale-body-medium-weight, var(--md-ref-typeface-weight-regular, 400));line-height:var(--md-sys-typescale-body-medium-line-height, 1.25rem)}[name=trailing-supporting-text]{color:var(--md-sys-color-on-surface-variant, #49454f);font-family:var(--md-sys-typescale-label-small-font, var(--md-ref-typeface-plain, Roboto));font-size:var(--md-sys-typescale-label-small-size, 0.6875rem);font-weight:var(--md-sys-typescale-label-small-weight, var(--md-ref-typeface-weight-medium, 500));line-height:var(--md-sys-typescale-label-small-line-height, 1rem)}[name=container]::slotted(*){inset:0;position:absolute}.default-slot{display:inline}.default-slot,.text ::slotted(*){overflow:hidden;text-overflow:ellipsis}.text{display:flex;flex:1;flex-direction:column;overflow:hidden}
`;
let mi = class extends Di {
};
mi.styles = [_a];
mi = h([
  Mt("md-item")
], mi);
const oo = /* @__PURE__ */ Symbol.for(""), ba = (i) => {
  if (i?.r === oo) return i?._$litStatic$;
}, ke = (i, ...t) => ({ _$litStatic$: t.reduce((e, r, o) => e + ((a) => {
  if (a._$litStatic$ !== void 0) return a._$litStatic$;
  throw Error(`Value passed to 'literal' function must be a 'literal' result: ${a}. Use 'unsafeStatic' to pass non-literal values, but
            take care to ensure page security.`);
})(r) + i[o + 1], i[0]), r: oo }), Wi = /* @__PURE__ */ new Map(), ya = (i) => (t, ...e) => {
  const r = e.length;
  let o, a;
  const s = [], n = [];
  let c, l = 0, d = !1;
  for (; l < r; ) {
    for (c = t[l]; l < r && (a = e[l], (o = ba(a)) !== void 0); ) c += o + t[++l], d = !0;
    l !== r && n.push(a), s.push(c), l++;
  }
  if (l === r && s.push(t[r]), d) {
    const v = s.join("$$lit$$");
    (t = Wi.get(v)) === void 0 && (s.raw = s, Wi.set(v, t = s)), e = n;
  }
  return i(t, ...e);
}, Nt = ya(g);
const xa = ze(U);
class Re extends xa {
  constructor() {
    super(...arguments), this.disabled = !1, this.type = "text", this.isListItem = !0, this.href = "", this.target = "";
  }
  get isDisabled() {
    return this.disabled && this.type !== "link";
  }
  willUpdate(t) {
    this.href && (this.type = "link"), super.willUpdate(t);
  }
  render() {
    return this.renderListItem(g`
      <md-item>
        <div slot="container">
          ${this.renderRipple()} ${this.renderFocusRing()}
        </div>
        <slot name="start" slot="start"></slot>
        <slot name="end" slot="end"></slot>
        ${this.renderBody()}
      </md-item>
    `);
  }
  /**
   * Renders the root list item.
   *
   * @param content the child content of the list item.
   */
  renderListItem(t) {
    const e = this.type === "link";
    let r;
    switch (this.type) {
      case "link":
        r = ke`a`;
        break;
      case "button":
        r = ke`button`;
        break;
      default:
      case "text":
        r = ke`li`;
        break;
    }
    const o = this.type !== "text", a = e && this.target ? this.target : A;
    return Nt`
      <${r}
        id="item"
        tabindex="${this.isDisabled || !o ? -1 : 0}"
        ?disabled=${this.isDisabled}
        role="listitem"
        aria-selected=${this.ariaSelected || A}
        aria-checked=${this.ariaChecked || A}
        aria-expanded=${this.ariaExpanded || A}
        aria-haspopup=${this.ariaHasPopup || A}
        class="list-item ${ne(this.getRenderClasses())}"
        href=${this.href || A}
        target=${a}
        @focus=${this.onFocus}
      >${t}</${r}>
    `;
  }
  /**
   * Handles rendering of the ripple element.
   */
  renderRipple() {
    return this.type === "text" ? A : g` <md-ripple
      part="ripple"
      for="item"
      ?disabled=${this.isDisabled}></md-ripple>`;
  }
  /**
   * Handles rendering of the focus ring.
   */
  renderFocusRing() {
    return this.type === "text" ? A : g` <md-focus-ring
      @visibility-changed=${this.onFocusRingVisibilityChanged}
      part="focus-ring"
      for="item"
      inward></md-focus-ring>`;
  }
  onFocusRingVisibilityChanged(t) {
  }
  /**
   * Classes applied to the list item root.
   */
  getRenderClasses() {
    return { disabled: this.isDisabled };
  }
  /**
   * Handles rendering the headline and supporting text.
   */
  renderBody() {
    return g`
      <slot></slot>
      <slot name="overline" slot="overline"></slot>
      <slot name="headline" slot="headline"></slot>
      <slot name="supporting-text" slot="supporting-text"></slot>
      <slot
        name="trailing-supporting-text"
        slot="trailing-supporting-text"></slot>
    `;
  }
  onFocus() {
    this.tabIndex === -1 && this.dispatchEvent(ua());
  }
  focus() {
    this.listItemRoot?.focus();
  }
}
Re.shadowRootOptions = {
  ...U.shadowRootOptions,
  delegatesFocus: !0
};
h([
  u({ type: Boolean, reflect: !0 })
], Re.prototype, "disabled", void 0);
h([
  u({ reflect: !0 })
], Re.prototype, "type", void 0);
h([
  u({ type: Boolean, attribute: "md-list-item", reflect: !0 })
], Re.prototype, "isListItem", void 0);
h([
  u()
], Re.prototype, "href", void 0);
h([
  u()
], Re.prototype, "target", void 0);
h([
  J(".list-item")
], Re.prototype, "listItemRoot", void 0);
const wa = N`:host{display:flex;-webkit-tap-highlight-color:rgba(0,0,0,0);--md-ripple-hover-color: var(--md-list-item-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--md-ripple-hover-opacity: var(--md-list-item-hover-state-layer-opacity, 0.08);--md-ripple-pressed-color: var(--md-list-item-pressed-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--md-ripple-pressed-opacity: var(--md-list-item-pressed-state-layer-opacity, 0.12)}:host(:is([type=button]:not([disabled]),[type=link])){cursor:pointer}md-focus-ring{z-index:1;--md-focus-ring-shape: 8px}a,button,li{background:none;border:none;cursor:inherit;padding:0;margin:0;text-align:unset;text-decoration:none}.list-item{border-radius:inherit;display:flex;flex:1;max-width:inherit;min-width:inherit;outline:none;-webkit-tap-highlight-color:rgba(0,0,0,0);width:100%}.list-item.interactive{cursor:pointer}.list-item.disabled{opacity:var(--md-list-item-disabled-opacity, 0.3);pointer-events:none}[slot=container]{pointer-events:none}md-ripple{border-radius:inherit}md-item{border-radius:inherit;flex:1;height:100%;color:var(--md-list-item-label-text-color, var(--md-sys-color-on-surface, #1d1b20));font-family:var(--md-list-item-label-text-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));font-size:var(--md-list-item-label-text-size, var(--md-sys-typescale-body-large-size, 1rem));line-height:var(--md-list-item-label-text-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));font-weight:var(--md-list-item-label-text-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));min-height:var(--md-list-item-one-line-container-height, 56px);padding-top:var(--md-list-item-top-space, 12px);padding-bottom:var(--md-list-item-bottom-space, 12px);padding-inline-start:var(--md-list-item-leading-space, 16px);padding-inline-end:var(--md-list-item-trailing-space, 16px)}md-item[multiline]{min-height:var(--md-list-item-two-line-container-height, 72px)}[slot=supporting-text]{color:var(--md-list-item-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));font-family:var(--md-list-item-supporting-text-font, var(--md-sys-typescale-body-medium-font, var(--md-ref-typeface-plain, Roboto)));font-size:var(--md-list-item-supporting-text-size, var(--md-sys-typescale-body-medium-size, 0.875rem));line-height:var(--md-list-item-supporting-text-line-height, var(--md-sys-typescale-body-medium-line-height, 1.25rem));font-weight:var(--md-list-item-supporting-text-weight, var(--md-sys-typescale-body-medium-weight, var(--md-ref-typeface-weight-regular, 400)))}[slot=trailing-supporting-text]{color:var(--md-list-item-trailing-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));font-family:var(--md-list-item-trailing-supporting-text-font, var(--md-sys-typescale-label-small-font, var(--md-ref-typeface-plain, Roboto)));font-size:var(--md-list-item-trailing-supporting-text-size, var(--md-sys-typescale-label-small-size, 0.6875rem));line-height:var(--md-list-item-trailing-supporting-text-line-height, var(--md-sys-typescale-label-small-line-height, 1rem));font-weight:var(--md-list-item-trailing-supporting-text-weight, var(--md-sys-typescale-label-small-weight, var(--md-ref-typeface-weight-medium, 500)))}:is([slot=start],[slot=end])::slotted(*){fill:currentColor}[slot=start]{color:var(--md-list-item-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f))}[slot=end]{color:var(--md-list-item-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f))}@media(forced-colors: active){.disabled slot{color:GrayText}.list-item.disabled{color:GrayText;opacity:1}}
`;
class ao extends Re {
}
ao.styles = [wa];
customElements.define("ew-list-item", ao);
class so extends ra {
}
so.styles = [ia];
customElements.define("ew-divider", so);
const dt = /* @__PURE__ */ Symbol("createValidator"), ct = /* @__PURE__ */ Symbol("getValidityAnchor"), Jt = /* @__PURE__ */ Symbol("privateValidator"), ue = /* @__PURE__ */ Symbol("privateSyncValidity"), wt = /* @__PURE__ */ Symbol("privateCustomValidationMessage");
function Oi(i) {
  var t;
  class e extends i {
    constructor() {
      super(...arguments), this[t] = "";
    }
    get validity() {
      return this[ue](), this[te].validity;
    }
    get validationMessage() {
      return this[ue](), this[te].validationMessage;
    }
    get willValidate() {
      return this[ue](), this[te].willValidate;
    }
    checkValidity() {
      return this[ue](), this[te].checkValidity();
    }
    reportValidity() {
      return this[ue](), this[te].reportValidity();
    }
    setCustomValidity(o) {
      this[wt] = o, this[ue]();
    }
    requestUpdate(o, a, s) {
      super.requestUpdate(o, a, s), this[ue]();
    }
    firstUpdated(o) {
      super.firstUpdated(o), this[ue]();
    }
    [(t = wt, ue)]() {
      this[Jt] || (this[Jt] = this[dt]());
      const { validity: o, validationMessage: a } = this[Jt].getValidity(), s = !!this[wt], n = this[wt] || a;
      this[te].setValidity({ ...o, customError: s }, n, this[ct]() ?? void 0);
    }
    [dt]() {
      throw new Error("Implement [createValidator]");
    }
    [ct]() {
      throw new Error("Implement [getValidityAnchor]");
    }
  }
  return e;
}
const Ze = /* @__PURE__ */ Symbol("getFormValue"), vi = /* @__PURE__ */ Symbol("getFormState");
function Pi(i) {
  class t extends i {
    get form() {
      return this[te].form;
    }
    get labels() {
      return this[te].labels;
    }
    // Use @property for the `name` and `disabled` properties to add them to the
    // `observedAttributes` array and trigger `attributeChangedCallback()`.
    //
    // We don't use Lit's default getter/setter (`noAccessor: true`) because
    // the attributes need to be updated synchronously to work with synchronous
    // form APIs, and Lit updates attributes async by default.
    get name() {
      return this.getAttribute("name") ?? "";
    }
    set name(r) {
      this.setAttribute("name", r);
    }
    get disabled() {
      return this.hasAttribute("disabled");
    }
    set disabled(r) {
      this.toggleAttribute("disabled", r);
    }
    attributeChangedCallback(r, o, a) {
      if (r === "name" || r === "disabled") {
        const s = r === "disabled" ? o !== null : o;
        this.requestUpdate(r, s);
        return;
      }
      super.attributeChangedCallback(r, o, a);
    }
    requestUpdate(r, o, a) {
      super.requestUpdate(r, o, a), this[te].setFormValue(this[Ze](), this[vi]());
    }
    [Ze]() {
      throw new Error("Implement [getFormValue]");
    }
    [vi]() {
      return this[Ze]();
    }
    formDisabledCallback(r) {
      this.disabled = r;
    }
  }
  return t.formAssociated = !0, h([
    u({ noAccessor: !0 })
  ], t.prototype, "name", null), h([
    u({ type: Boolean, noAccessor: !0 })
  ], t.prototype, "disabled", null), t;
}
class Fi {
  /**
   * Creates a new validator.
   *
   * @param getCurrentState A callback that returns the current state of
   *     constraint validation-related properties.
   */
  constructor(t) {
    this.getCurrentState = t, this.currentValidity = {
      validity: {},
      validationMessage: ""
    };
  }
  /**
   * Returns the current `ValidityStateFlags` and validation message for the
   * validator.
   *
   * If the constraint validation state has not changed, this will return a
   * cached result. This is important since `getValidity()` can be called
   * frequently in response to synchronous property changes.
   *
   * @return The current validity and validation message.
   */
  getValidity() {
    const t = this.getCurrentState();
    if (!(!this.prevState || !this.equals(this.prevState, t)))
      return this.currentValidity;
    const { validity: r, validationMessage: o } = this.computeValidity(t);
    return this.prevState = this.copy(t), this.currentValidity = {
      validationMessage: o,
      validity: {
        // Change any `ValidityState` instances into `ValidityStateFlags` since
        // `ValidityState` cannot be easily `{...spread}`.
        badInput: r.badInput,
        customError: r.customError,
        patternMismatch: r.patternMismatch,
        rangeOverflow: r.rangeOverflow,
        rangeUnderflow: r.rangeUnderflow,
        stepMismatch: r.stepMismatch,
        tooLong: r.tooLong,
        tooShort: r.tooShort,
        typeMismatch: r.typeMismatch,
        valueMissing: r.valueMissing
      }
    }, this.currentValidity;
  }
}
class Ea extends Fi {
  computeValidity(t) {
    return this.checkboxControl || (this.checkboxControl = document.createElement("input"), this.checkboxControl.type = "checkbox"), this.checkboxControl.checked = t.checked, this.checkboxControl.required = t.required, {
      validity: this.checkboxControl.validity,
      validationMessage: this.checkboxControl.validationMessage
    };
  }
  equals(t, e) {
    return t.checked === e.checked && t.required === e.required;
  }
  copy({ checked: t, required: e }) {
    return { checked: t, required: e };
  }
}
const Sa = ze(Oi(Pi(Ut(U))));
class fe extends Sa {
  constructor() {
    super(), this.checked = !1, this.indeterminate = !1, this.required = !1, this.value = "on", this.prevChecked = !1, this.prevDisabled = !1, this.prevIndeterminate = !1, this.addEventListener("click", (t) => {
      !oa(t) || !this.input || (this.focus(), aa(this.input));
    });
  }
  update(t) {
    (t.has("checked") || t.has("disabled") || t.has("indeterminate")) && (this.prevChecked = t.get("checked") ?? this.checked, this.prevDisabled = t.get("disabled") ?? this.disabled, this.prevIndeterminate = t.get("indeterminate") ?? this.indeterminate), super.update(t);
  }
  render() {
    const t = !this.prevChecked && !this.prevIndeterminate, e = this.prevChecked && !this.prevIndeterminate, r = this.prevIndeterminate, o = this.checked && !this.indeterminate, a = this.indeterminate, s = ne({
      disabled: this.disabled,
      selected: o || a,
      unselected: !o && !a,
      checked: o,
      indeterminate: a,
      "prev-unselected": t,
      "prev-checked": e,
      "prev-indeterminate": r,
      "prev-disabled": this.prevDisabled
    }), { ariaLabel: n, ariaInvalid: c } = this;
    return g`
      <div class="container ${s}">
        <input
          type="checkbox"
          id="input"
          aria-checked=${a ? "mixed" : A}
          aria-label=${n || A}
          aria-invalid=${c || A}
          ?disabled=${this.disabled}
          ?required=${this.required}
          .indeterminate=${this.indeterminate}
          .checked=${this.checked}
          @input=${this.handleInput}
          @change=${this.handleChange} />

        <div class="outline"></div>
        <div class="background"></div>
        <md-focus-ring part="focus-ring" for="input"></md-focus-ring>
        <md-ripple for="input" ?disabled=${this.disabled}></md-ripple>
        <svg class="icon" viewBox="0 0 18 18" aria-hidden="true">
          <rect class="mark short" />
          <rect class="mark long" />
        </svg>
      </div>
    `;
  }
  handleInput(t) {
    const e = t.target;
    this.checked = e.checked, this.indeterminate = e.indeterminate;
  }
  handleChange(t) {
    $i(this, t);
  }
  [Ze]() {
    return !this.checked || this.indeterminate ? null : this.value;
  }
  [vi]() {
    return String(this.checked);
  }
  formResetCallback() {
    this.checked = this.hasAttribute("checked");
  }
  formStateRestoreCallback(t) {
    this.checked = t === "true";
  }
  [dt]() {
    return new Ea(() => this);
  }
  [ct]() {
    return this.input;
  }
}
fe.shadowRootOptions = {
  ...U.shadowRootOptions,
  delegatesFocus: !0
};
h([
  u({ type: Boolean })
], fe.prototype, "checked", void 0);
h([
  u({ type: Boolean })
], fe.prototype, "indeterminate", void 0);
h([
  u({ type: Boolean })
], fe.prototype, "required", void 0);
h([
  u()
], fe.prototype, "value", void 0);
h([
  P()
], fe.prototype, "prevChecked", void 0);
h([
  P()
], fe.prototype, "prevDisabled", void 0);
h([
  P()
], fe.prototype, "prevIndeterminate", void 0);
h([
  J("input")
], fe.prototype, "input", void 0);
const ka = N`:host{border-start-start-radius:var(--md-checkbox-container-shape-start-start, var(--md-checkbox-container-shape, 2px));border-start-end-radius:var(--md-checkbox-container-shape-start-end, var(--md-checkbox-container-shape, 2px));border-end-end-radius:var(--md-checkbox-container-shape-end-end, var(--md-checkbox-container-shape, 2px));border-end-start-radius:var(--md-checkbox-container-shape-end-start, var(--md-checkbox-container-shape, 2px));display:inline-flex;height:var(--md-checkbox-container-size, 18px);position:relative;vertical-align:top;width:var(--md-checkbox-container-size, 18px);-webkit-tap-highlight-color:rgba(0,0,0,0);cursor:pointer}:host([disabled]){cursor:default}:host([touch-target=wrapper]){margin:max(0px,(48px - var(--md-checkbox-container-size, 18px))/2)}md-focus-ring{height:44px;inset:unset;width:44px}input{appearance:none;height:48px;margin:0;opacity:0;outline:none;position:absolute;width:48px;z-index:1;cursor:inherit}:host([touch-target=none]) input{height:100%;width:100%}.container{border-radius:inherit;display:flex;height:100%;place-content:center;place-items:center;position:relative;width:100%}.outline,.background,.icon{inset:0;position:absolute}.outline,.background{border-radius:inherit}.outline{border-color:var(--md-checkbox-outline-color, var(--md-sys-color-on-surface-variant, #49454f));border-style:solid;border-width:var(--md-checkbox-outline-width, 2px);box-sizing:border-box}.background{background-color:var(--md-checkbox-selected-container-color, var(--md-sys-color-primary, #6750a4))}.background,.icon{opacity:0;transition-duration:150ms,50ms;transition-property:transform,opacity;transition-timing-function:cubic-bezier(0.3, 0, 0.8, 0.15),linear;transform:scale(0.6)}:where(.selected) :is(.background,.icon){opacity:1;transition-duration:350ms,50ms;transition-timing-function:cubic-bezier(0.05, 0.7, 0.1, 1),linear;transform:scale(1)}md-ripple{border-radius:var(--md-checkbox-state-layer-shape, var(--md-sys-shape-corner-full, 9999px));height:var(--md-checkbox-state-layer-size, 40px);inset:unset;width:var(--md-checkbox-state-layer-size, 40px);--md-ripple-hover-color: var(--md-checkbox-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--md-ripple-hover-opacity: var(--md-checkbox-hover-state-layer-opacity, 0.08);--md-ripple-pressed-color: var(--md-checkbox-pressed-state-layer-color, var(--md-sys-color-primary, #6750a4));--md-ripple-pressed-opacity: var(--md-checkbox-pressed-state-layer-opacity, 0.12)}.selected md-ripple{--md-ripple-hover-color: var(--md-checkbox-selected-hover-state-layer-color, var(--md-sys-color-primary, #6750a4));--md-ripple-hover-opacity: var(--md-checkbox-selected-hover-state-layer-opacity, 0.08);--md-ripple-pressed-color: var(--md-checkbox-selected-pressed-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--md-ripple-pressed-opacity: var(--md-checkbox-selected-pressed-state-layer-opacity, 0.12)}.icon{fill:var(--md-checkbox-selected-icon-color, var(--md-sys-color-on-primary, #fff));height:var(--md-checkbox-icon-size, 18px);width:var(--md-checkbox-icon-size, 18px)}.mark.short{height:2px;transition-property:transform,height;width:2px}.mark.long{height:2px;transition-property:transform,width;width:10px}.mark{animation-duration:150ms;animation-timing-function:cubic-bezier(0.3, 0, 0.8, 0.15);transition-duration:150ms;transition-timing-function:cubic-bezier(0.3, 0, 0.8, 0.15)}.selected .mark{animation-duration:350ms;animation-timing-function:cubic-bezier(0.05, 0.7, 0.1, 1);transition-duration:350ms;transition-timing-function:cubic-bezier(0.05, 0.7, 0.1, 1)}.checked .mark,.prev-checked.unselected .mark{transform:scaleY(-1) translate(7px, -14px) rotate(45deg)}.checked .mark.short,.prev-checked.unselected .mark.short{height:5.6568542495px}.checked .mark.long,.prev-checked.unselected .mark.long{width:11.313708499px}.indeterminate .mark,.prev-indeterminate.unselected .mark{transform:scaleY(-1) translate(4px, -10px) rotate(0deg)}.prev-unselected .mark{transition-property:none}.prev-unselected.checked .mark.long{animation-name:prev-unselected-to-checked}@keyframes prev-unselected-to-checked{from{width:0}}:where(:hover) .outline{border-color:var(--md-checkbox-hover-outline-color, var(--md-sys-color-on-surface, #1d1b20));border-width:var(--md-checkbox-hover-outline-width, 2px)}:where(:hover) .background{background:var(--md-checkbox-selected-hover-container-color, var(--md-sys-color-primary, #6750a4))}:where(:hover) .icon{fill:var(--md-checkbox-selected-hover-icon-color, var(--md-sys-color-on-primary, #fff))}:where(:focus-within) .outline{border-color:var(--md-checkbox-focus-outline-color, var(--md-sys-color-on-surface, #1d1b20));border-width:var(--md-checkbox-focus-outline-width, 2px)}:where(:focus-within) .background{background:var(--md-checkbox-selected-focus-container-color, var(--md-sys-color-primary, #6750a4))}:where(:focus-within) .icon{fill:var(--md-checkbox-selected-focus-icon-color, var(--md-sys-color-on-primary, #fff))}:where(:active) .outline{border-color:var(--md-checkbox-pressed-outline-color, var(--md-sys-color-on-surface, #1d1b20));border-width:var(--md-checkbox-pressed-outline-width, 2px)}:where(:active) .background{background:var(--md-checkbox-selected-pressed-container-color, var(--md-sys-color-primary, #6750a4))}:where(:active) .icon{fill:var(--md-checkbox-selected-pressed-icon-color, var(--md-sys-color-on-primary, #fff))}:where(.disabled,.prev-disabled) :is(.background,.icon,.mark){animation-duration:0s;transition-duration:0s}:where(.disabled) .outline{border-color:var(--md-checkbox-disabled-outline-color, var(--md-sys-color-on-surface, #1d1b20));border-width:var(--md-checkbox-disabled-outline-width, 2px);opacity:var(--md-checkbox-disabled-container-opacity, 0.38)}:where(.selected.disabled) .outline{visibility:hidden}:where(.selected.disabled) .background{background:var(--md-checkbox-selected-disabled-container-color, var(--md-sys-color-on-surface, #1d1b20));opacity:var(--md-checkbox-selected-disabled-container-opacity, 0.38)}:where(.disabled) .icon{fill:var(--md-checkbox-selected-disabled-icon-color, var(--md-sys-color-surface, #fef7ff))}@media(forced-colors: active){.background{background-color:CanvasText}.selected.disabled .background{background-color:GrayText;opacity:1}.outline{border-color:CanvasText}.disabled .outline{border-color:GrayText;opacity:1}.icon{fill:Canvas}}
`;
class no extends fe {
}
no.styles = [ka];
customElements.define("ew-checkbox", no);
class Aa {
  constructor(t) {
    this.targetElement = t, this.state = {
      bold: !1,
      italic: !1,
      underline: !1,
      strikethrough: !1,
      foregroundColor: null,
      backgroundColor: null,
      carriageReturn: !1,
      lines: [],
      secret: !1
    };
  }
  logs() {
    return this.targetElement.innerText;
  }
  processLine(t) {
    const e = /(?:\033|\\033)(?:\[(.*?)[@-~]|\].*?(?:\007|\033\\))/g;
    let r = 0;
    const o = document.createElement("span");
    o.classList.add("line");
    const a = (s) => {
      if (s === "")
        return;
      const n = document.createElement("span");
      if (this.state.bold && n.classList.add("log-bold"), this.state.italic && n.classList.add("log-italic"), this.state.underline && n.classList.add("log-underline"), this.state.strikethrough && n.classList.add("log-strikethrough"), this.state.secret && n.classList.add("log-secret"), this.state.foregroundColor !== null && n.classList.add(`log-fg-${this.state.foregroundColor}`), this.state.backgroundColor !== null && n.classList.add(`log-bg-${this.state.backgroundColor}`), n.appendChild(document.createTextNode(s)), o.appendChild(n), this.state.secret) {
        const c = document.createElement("span");
        c.classList.add("log-secret-redacted"), c.appendChild(document.createTextNode("[redacted]")), o.appendChild(c);
      }
    };
    for (; ; ) {
      const s = e.exec(t);
      if (s === null)
        break;
      const n = s.index;
      if (a(t.substring(r, n)), r = n + s[0].length, s[1] !== void 0)
        for (const c of s[1].split(";"))
          switch (parseInt(c)) {
            case 0:
              this.state.bold = !1, this.state.italic = !1, this.state.underline = !1, this.state.strikethrough = !1, this.state.foregroundColor = null, this.state.backgroundColor = null, this.state.secret = !1;
              break;
            case 1:
              this.state.bold = !0;
              break;
            case 3:
              this.state.italic = !0;
              break;
            case 4:
              this.state.underline = !0;
              break;
            case 5:
              this.state.secret = !0;
              break;
            case 6:
              this.state.secret = !1;
              break;
            case 9:
              this.state.strikethrough = !0;
              break;
            case 22:
              this.state.bold = !1;
              break;
            case 23:
              this.state.italic = !1;
              break;
            case 24:
              this.state.underline = !1;
              break;
            case 29:
              this.state.strikethrough = !1;
              break;
            case 30:
              this.state.foregroundColor = "black";
              break;
            case 31:
              this.state.foregroundColor = "red";
              break;
            case 32:
              this.state.foregroundColor = "green";
              break;
            case 33:
              this.state.foregroundColor = "yellow";
              break;
            case 34:
              this.state.foregroundColor = "blue";
              break;
            case 35:
              this.state.foregroundColor = "magenta";
              break;
            case 36:
              this.state.foregroundColor = "cyan";
              break;
            case 37:
              this.state.foregroundColor = "white";
              break;
            case 39:
              this.state.foregroundColor = null;
              break;
            case 41:
              this.state.backgroundColor = "red";
              break;
            case 42:
              this.state.backgroundColor = "green";
              break;
            case 43:
              this.state.backgroundColor = "yellow";
              break;
            case 44:
              this.state.backgroundColor = "blue";
              break;
            case 45:
              this.state.backgroundColor = "magenta";
              break;
            case 46:
              this.state.backgroundColor = "cyan";
              break;
            case 47:
              this.state.backgroundColor = "white";
              break;
            case 40:
            case 49:
              this.state.backgroundColor = null;
              break;
          }
    }
    return a(t.substring(r)), o;
  }
  processLines() {
    const t = this.targetElement.scrollTop > this.targetElement.scrollHeight - this.targetElement.offsetHeight - 50, e = this.state.carriageReturn, r = document.createDocumentFragment();
    if (this.state.lines.length != 0) {
      for (const o of this.state.lines)
        this.state.carriageReturn && o !== `
` && r.childElementCount && r.removeChild(r.lastChild), r.appendChild(this.processLine(o)), this.state.carriageReturn = o.includes("\r");
      e && this.state.lines[0] !== `
` ? this.targetElement.replaceChild(r, this.targetElement.lastChild) : this.targetElement.appendChild(r), this.state.lines = [], t && (this.targetElement.scrollTop = this.targetElement.scrollHeight);
    }
  }
  addLine(t) {
    this.state.lines.length == 0 && setTimeout(() => this.processLines(), 0), this.state.lines.push(t);
  }
}
const Ta = `
  .log {
    flex: 1;
    background-color: #1c1c1c;
    font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier,
      monospace;
    font-size: 12px;
    padding: 16px;
    overflow: auto;
    line-height: 1.45;
    border-radius: 3px;
    white-space: pre-wrap;
    overflow-wrap: break-word;
    color: #ddd;
  }

  .log-bold {
    font-weight: bold;
  }
  .log-italic {
    font-style: italic;
  }
  .log-underline {
    text-decoration: underline;
  }
  .log-strikethrough {
    text-decoration: line-through;
  }
  .log-underline.log-strikethrough {
    text-decoration: underline line-through;
  }
  .log-secret {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .log-secret-redacted {
    opacity: 0;
    width: 1px;
    font-size: 1px;
  }
  .log-fg-black {
    color: rgb(128, 128, 128);
  }
  .log-fg-red {
    color: rgb(255, 0, 0);
  }
  .log-fg-green {
    color: rgb(0, 255, 0);
  }
  .log-fg-yellow {
    color: rgb(255, 255, 0);
  }
  .log-fg-blue {
    color: rgb(0, 0, 255);
  }
  .log-fg-magenta {
    color: rgb(255, 0, 255);
  }
  .log-fg-cyan {
    color: rgb(0, 255, 255);
  }
  .log-fg-white {
    color: rgb(187, 187, 187);
  }
  .log-bg-black {
    background-color: rgb(0, 0, 0);
  }
  .log-bg-red {
    background-color: rgb(255, 0, 0);
  }
  .log-bg-green {
    background-color: rgb(0, 255, 0);
  }
  .log-bg-yellow {
    background-color: rgb(255, 255, 0);
  }
  .log-bg-blue {
    background-color: rgb(0, 0, 255);
  }
  .log-bg-magenta {
    background-color: rgb(255, 0, 255);
  }
  .log-bg-cyan {
    background-color: rgb(0, 255, 255);
  }
  .log-bg-white {
    background-color: rgb(255, 255, 255);
  }
`, Ve = (i) => new Promise((t) => setTimeout(t, i));
class Ca {
  constructor() {
    this.chunks = "";
  }
  transform(t, e) {
    this.chunks += t;
    const r = this.chunks.split(/\r?\n/);
    this.chunks = r.pop(), r.forEach((o) => e.enqueue(o + `\r
`));
  }
  flush(t) {
    t.enqueue(this.chunks);
  }
}
class Ia {
  transform(t, e) {
    const r = /* @__PURE__ */ new Date(), o = r.getHours().toString().padStart(2, "0"), a = r.getMinutes().toString().padStart(2, "0"), s = r.getSeconds().toString().padStart(2, "0");
    e.enqueue(`[${o}:${a}:${s}]${t}`);
  }
}
class W extends Error {
}
const Ra = 4, qi = 0, Gi = 1, $a = 2;
function Ye(i) {
  let t = i.length;
  for (; --t >= 0; )
    i[t] = 0;
}
const La = 0, lo = 1, Da = 2, Oa = 3, Pa = 258, Bi = 29, bt = 256, ht = bt + 1 + Bi, We = 30, zi = 19, co = 2 * ht + 1, De = 15, Qt = 16, Fa = 7, Mi = 256, ho = 16, fo = 17, po = 18, gi = (
  /* extra bits for each length code */
  new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0])
), Dt = (
  /* extra bits for each distance code */
  new Uint8Array([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13])
), Ba = (
  /* extra bits for each bit length code */
  new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7])
), uo = new Uint8Array([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]), za = 512, ve = new Array((ht + 2) * 2);
Ye(ve);
const st = new Array(We * 2);
Ye(st);
const ft = new Array(za);
Ye(ft);
const pt = new Array(Pa - Oa + 1);
Ye(pt);
const Ui = new Array(Bi);
Ye(Ui);
const Ot = new Array(We);
Ye(Ot);
function ei(i, t, e, r, o) {
  this.static_tree = i, this.extra_bits = t, this.extra_base = e, this.elems = r, this.max_length = o, this.has_stree = i && i.length;
}
let mo, vo, go;
function ti(i, t) {
  this.dyn_tree = i, this.max_code = 0, this.stat_desc = t;
}
const _o = (i) => i < 256 ? ft[i] : ft[256 + (i >>> 7)], ut = (i, t) => {
  i.pending_buf[i.pending++] = t & 255, i.pending_buf[i.pending++] = t >>> 8 & 255;
}, K = (i, t, e) => {
  i.bi_valid > Qt - e ? (i.bi_buf |= t << i.bi_valid & 65535, ut(i, i.bi_buf), i.bi_buf = t >> Qt - i.bi_valid, i.bi_valid += e - Qt) : (i.bi_buf |= t << i.bi_valid & 65535, i.bi_valid += e);
}, de = (i, t, e) => {
  K(
    i,
    e[t * 2],
    e[t * 2 + 1]
    /*.Len*/
  );
}, bo = (i, t) => {
  let e = 0;
  do
    e |= i & 1, i >>>= 1, e <<= 1;
  while (--t > 0);
  return e >>> 1;
}, Ma = (i) => {
  i.bi_valid === 16 ? (ut(i, i.bi_buf), i.bi_buf = 0, i.bi_valid = 0) : i.bi_valid >= 8 && (i.pending_buf[i.pending++] = i.bi_buf & 255, i.bi_buf >>= 8, i.bi_valid -= 8);
}, Ua = (i, t) => {
  const e = t.dyn_tree, r = t.max_code, o = t.stat_desc.static_tree, a = t.stat_desc.has_stree, s = t.stat_desc.extra_bits, n = t.stat_desc.extra_base, c = t.stat_desc.max_length;
  let l, d, v, p, f, _, y = 0;
  for (p = 0; p <= De; p++)
    i.bl_count[p] = 0;
  for (e[i.heap[i.heap_max] * 2 + 1] = 0, l = i.heap_max + 1; l < co; l++)
    d = i.heap[l], p = e[e[d * 2 + 1] * 2 + 1] + 1, p > c && (p = c, y++), e[d * 2 + 1] = p, !(d > r) && (i.bl_count[p]++, f = 0, d >= n && (f = s[d - n]), _ = e[d * 2], i.opt_len += _ * (p + f), a && (i.static_len += _ * (o[d * 2 + 1] + f)));
  if (y !== 0) {
    do {
      for (p = c - 1; i.bl_count[p] === 0; )
        p--;
      i.bl_count[p]--, i.bl_count[p + 1] += 2, i.bl_count[c]--, y -= 2;
    } while (y > 0);
    for (p = c; p !== 0; p--)
      for (d = i.bl_count[p]; d !== 0; )
        v = i.heap[--l], !(v > r) && (e[v * 2 + 1] !== p && (i.opt_len += (p - e[v * 2 + 1]) * e[v * 2], e[v * 2 + 1] = p), d--);
  }
}, yo = (i, t, e) => {
  const r = new Array(De + 1);
  let o = 0, a, s;
  for (a = 1; a <= De; a++)
    o = o + e[a - 1] << 1, r[a] = o;
  for (s = 0; s <= t; s++) {
    let n = i[s * 2 + 1];
    n !== 0 && (i[s * 2] = bo(r[n]++, n));
  }
}, Na = () => {
  let i, t, e, r, o;
  const a = new Array(De + 1);
  for (e = 0, r = 0; r < Bi - 1; r++)
    for (Ui[r] = e, i = 0; i < 1 << gi[r]; i++)
      pt[e++] = r;
  for (pt[e - 1] = r, o = 0, r = 0; r < 16; r++)
    for (Ot[r] = o, i = 0; i < 1 << Dt[r]; i++)
      ft[o++] = r;
  for (o >>= 7; r < We; r++)
    for (Ot[r] = o << 7, i = 0; i < 1 << Dt[r] - 7; i++)
      ft[256 + o++] = r;
  for (t = 0; t <= De; t++)
    a[t] = 0;
  for (i = 0; i <= 143; )
    ve[i * 2 + 1] = 8, i++, a[8]++;
  for (; i <= 255; )
    ve[i * 2 + 1] = 9, i++, a[9]++;
  for (; i <= 279; )
    ve[i * 2 + 1] = 7, i++, a[7]++;
  for (; i <= 287; )
    ve[i * 2 + 1] = 8, i++, a[8]++;
  for (yo(ve, ht + 1, a), i = 0; i < We; i++)
    st[i * 2 + 1] = 5, st[i * 2] = bo(i, 5);
  mo = new ei(ve, gi, bt + 1, ht, De), vo = new ei(st, Dt, 0, We, De), go = new ei(new Array(0), Ba, 0, zi, Fa);
}, xo = (i) => {
  let t;
  for (t = 0; t < ht; t++)
    i.dyn_ltree[t * 2] = 0;
  for (t = 0; t < We; t++)
    i.dyn_dtree[t * 2] = 0;
  for (t = 0; t < zi; t++)
    i.bl_tree[t * 2] = 0;
  i.dyn_ltree[Mi * 2] = 1, i.opt_len = i.static_len = 0, i.sym_next = i.matches = 0;
}, wo = (i) => {
  i.bi_valid > 8 ? ut(i, i.bi_buf) : i.bi_valid > 0 && (i.pending_buf[i.pending++] = i.bi_buf), i.bi_buf = 0, i.bi_valid = 0;
}, Ki = (i, t, e, r) => {
  const o = t * 2, a = e * 2;
  return i[o] < i[a] || i[o] === i[a] && r[t] <= r[e];
}, ii = (i, t, e) => {
  const r = i.heap[e];
  let o = e << 1;
  for (; o <= i.heap_len && (o < i.heap_len && Ki(t, i.heap[o + 1], i.heap[o], i.depth) && o++, !Ki(t, r, i.heap[o], i.depth)); )
    i.heap[e] = i.heap[o], e = o, o <<= 1;
  i.heap[e] = r;
}, Yi = (i, t, e) => {
  let r, o, a = 0, s, n;
  if (i.sym_next !== 0)
    do
      r = i.pending_buf[i.sym_buf + a++] & 255, r += (i.pending_buf[i.sym_buf + a++] & 255) << 8, o = i.pending_buf[i.sym_buf + a++], r === 0 ? de(i, o, t) : (s = pt[o], de(i, s + bt + 1, t), n = gi[s], n !== 0 && (o -= Ui[s], K(i, o, n)), r--, s = _o(r), de(i, s, e), n = Dt[s], n !== 0 && (r -= Ot[s], K(i, r, n)));
    while (a < i.sym_next);
  de(i, Mi, t);
}, _i = (i, t) => {
  const e = t.dyn_tree, r = t.stat_desc.static_tree, o = t.stat_desc.has_stree, a = t.stat_desc.elems;
  let s, n, c = -1, l;
  for (i.heap_len = 0, i.heap_max = co, s = 0; s < a; s++)
    e[s * 2] !== 0 ? (i.heap[++i.heap_len] = c = s, i.depth[s] = 0) : e[s * 2 + 1] = 0;
  for (; i.heap_len < 2; )
    l = i.heap[++i.heap_len] = c < 2 ? ++c : 0, e[l * 2] = 1, i.depth[l] = 0, i.opt_len--, o && (i.static_len -= r[l * 2 + 1]);
  for (t.max_code = c, s = i.heap_len >> 1; s >= 1; s--)
    ii(i, e, s);
  l = a;
  do
    s = i.heap[
      1
      /*SMALLEST*/
    ], i.heap[
      1
      /*SMALLEST*/
    ] = i.heap[i.heap_len--], ii(
      i,
      e,
      1
      /*SMALLEST*/
    ), n = i.heap[
      1
      /*SMALLEST*/
    ], i.heap[--i.heap_max] = s, i.heap[--i.heap_max] = n, e[l * 2] = e[s * 2] + e[n * 2], i.depth[l] = (i.depth[s] >= i.depth[n] ? i.depth[s] : i.depth[n]) + 1, e[s * 2 + 1] = e[n * 2 + 1] = l, i.heap[
      1
      /*SMALLEST*/
    ] = l++, ii(
      i,
      e,
      1
      /*SMALLEST*/
    );
  while (i.heap_len >= 2);
  i.heap[--i.heap_max] = i.heap[
    1
    /*SMALLEST*/
  ], Ua(i, t), yo(e, c, i.bl_count);
}, ji = (i, t, e) => {
  let r, o = -1, a, s = t[1], n = 0, c = 7, l = 4;
  for (s === 0 && (c = 138, l = 3), t[(e + 1) * 2 + 1] = 65535, r = 0; r <= e; r++)
    a = s, s = t[(r + 1) * 2 + 1], !(++n < c && a === s) && (n < l ? i.bl_tree[a * 2] += n : a !== 0 ? (a !== o && i.bl_tree[a * 2]++, i.bl_tree[ho * 2]++) : n <= 10 ? i.bl_tree[fo * 2]++ : i.bl_tree[po * 2]++, n = 0, o = a, s === 0 ? (c = 138, l = 3) : a === s ? (c = 6, l = 3) : (c = 7, l = 4));
}, Xi = (i, t, e) => {
  let r, o = -1, a, s = t[1], n = 0, c = 7, l = 4;
  for (s === 0 && (c = 138, l = 3), r = 0; r <= e; r++)
    if (a = s, s = t[(r + 1) * 2 + 1], !(++n < c && a === s)) {
      if (n < l)
        do
          de(i, a, i.bl_tree);
        while (--n !== 0);
      else a !== 0 ? (a !== o && (de(i, a, i.bl_tree), n--), de(i, ho, i.bl_tree), K(i, n - 3, 2)) : n <= 10 ? (de(i, fo, i.bl_tree), K(i, n - 3, 3)) : (de(i, po, i.bl_tree), K(i, n - 11, 7));
      n = 0, o = a, s === 0 ? (c = 138, l = 3) : a === s ? (c = 6, l = 3) : (c = 7, l = 4);
    }
}, Ha = (i) => {
  let t;
  for (ji(i, i.dyn_ltree, i.l_desc.max_code), ji(i, i.dyn_dtree, i.d_desc.max_code), _i(i, i.bl_desc), t = zi - 1; t >= 3 && i.bl_tree[uo[t] * 2 + 1] === 0; t--)
    ;
  return i.opt_len += 3 * (t + 1) + 5 + 5 + 4, t;
}, Za = (i, t, e, r) => {
  let o;
  for (K(i, t - 257, 5), K(i, e - 1, 5), K(i, r - 4, 4), o = 0; o < r; o++)
    K(i, i.bl_tree[uo[o] * 2 + 1], 3);
  Xi(i, i.dyn_ltree, t - 1), Xi(i, i.dyn_dtree, e - 1);
}, Va = (i) => {
  let t = 4093624447, e;
  for (e = 0; e <= 31; e++, t >>>= 1)
    if (t & 1 && i.dyn_ltree[e * 2] !== 0)
      return qi;
  if (i.dyn_ltree[18] !== 0 || i.dyn_ltree[20] !== 0 || i.dyn_ltree[26] !== 0)
    return Gi;
  for (e = 32; e < bt; e++)
    if (i.dyn_ltree[e * 2] !== 0)
      return Gi;
  return qi;
};
let Ji = !1;
const Wa = (i) => {
  Ji || (Na(), Ji = !0), i.l_desc = new ti(i.dyn_ltree, mo), i.d_desc = new ti(i.dyn_dtree, vo), i.bl_desc = new ti(i.bl_tree, go), i.bi_buf = 0, i.bi_valid = 0, xo(i);
}, Eo = (i, t, e, r) => {
  K(i, (La << 1) + (r ? 1 : 0), 3), wo(i), ut(i, e), ut(i, ~e), e && i.pending_buf.set(i.window.subarray(t, t + e), i.pending), i.pending += e;
}, qa = (i) => {
  K(i, lo << 1, 3), de(i, Mi, ve), Ma(i);
}, Ga = (i, t, e, r) => {
  let o, a, s = 0;
  i.level > 0 ? (i.strm.data_type === $a && (i.strm.data_type = Va(i)), _i(i, i.l_desc), _i(i, i.d_desc), s = Ha(i), o = i.opt_len + 3 + 7 >>> 3, a = i.static_len + 3 + 7 >>> 3, a <= o && (o = a)) : o = a = e + 5, e + 4 <= o && t !== -1 ? Eo(i, t, e, r) : i.strategy === Ra || a === o ? (K(i, (lo << 1) + (r ? 1 : 0), 3), Yi(i, ve, st)) : (K(i, (Da << 1) + (r ? 1 : 0), 3), Za(i, i.l_desc.max_code + 1, i.d_desc.max_code + 1, s + 1), Yi(i, i.dyn_ltree, i.dyn_dtree)), xo(i), r && wo(i);
}, Ka = (i, t, e) => (i.pending_buf[i.sym_buf + i.sym_next++] = t, i.pending_buf[i.sym_buf + i.sym_next++] = t >> 8, i.pending_buf[i.sym_buf + i.sym_next++] = e, t === 0 ? i.dyn_ltree[e * 2]++ : (i.matches++, t--, i.dyn_ltree[(pt[e] + bt + 1) * 2]++, i.dyn_dtree[_o(t) * 2]++), i.sym_next === i.sym_end);
var Ya = Wa, ja = Eo, Xa = Ga, Ja = Ka, Qa = qa, es = {
  _tr_init: Ya,
  _tr_stored_block: ja,
  _tr_flush_block: Xa,
  _tr_tally: Ja,
  _tr_align: Qa
};
const ts = (i, t, e, r) => {
  let o = i & 65535 | 0, a = i >>> 16 & 65535 | 0, s = 0;
  for (; e !== 0; ) {
    s = e > 2e3 ? 2e3 : e, e -= s;
    do
      o = o + t[r++] | 0, a = a + o | 0;
    while (--s);
    o %= 65521, a %= 65521;
  }
  return o | a << 16 | 0;
};
var mt = ts;
const is = () => {
  let i, t = [];
  for (var e = 0; e < 256; e++) {
    i = e;
    for (var r = 0; r < 8; r++)
      i = i & 1 ? 3988292384 ^ i >>> 1 : i >>> 1;
    t[e] = i;
  }
  return t;
}, rs = new Uint32Array(is()), os = (i, t, e, r) => {
  const o = rs, a = r + e;
  i ^= -1;
  for (let s = r; s < a; s++)
    i = i >>> 8 ^ o[(i ^ t[s]) & 255];
  return i ^ -1;
};
var H = os, qe = {
  2: "need dictionary",
  /* Z_NEED_DICT       2  */
  1: "stream end",
  /* Z_STREAM_END      1  */
  0: "",
  /* Z_OK              0  */
  "-1": "file error",
  /* Z_ERRNO         (-1) */
  "-2": "stream error",
  /* Z_STREAM_ERROR  (-2) */
  "-3": "data error",
  /* Z_DATA_ERROR    (-3) */
  "-4": "insufficient memory",
  /* Z_MEM_ERROR     (-4) */
  "-5": "buffer error",
  /* Z_BUF_ERROR     (-5) */
  "-6": "incompatible version"
  /* Z_VERSION_ERROR (-6) */
}, Ht = {
  /* Allowed flush values; see deflate() and inflate() below for details */
  Z_NO_FLUSH: 0,
  Z_PARTIAL_FLUSH: 1,
  Z_SYNC_FLUSH: 2,
  Z_FULL_FLUSH: 3,
  Z_FINISH: 4,
  Z_BLOCK: 5,
  Z_TREES: 6,
  /* Return codes for the compression/decompression functions. Negative values
  * are errors, positive values are used for special but normal events.
  */
  Z_OK: 0,
  Z_STREAM_END: 1,
  Z_NEED_DICT: 2,
  Z_STREAM_ERROR: -2,
  Z_DATA_ERROR: -3,
  Z_MEM_ERROR: -4,
  Z_BUF_ERROR: -5,
  Z_DEFAULT_COMPRESSION: -1,
  Z_FILTERED: 1,
  Z_HUFFMAN_ONLY: 2,
  Z_RLE: 3,
  Z_FIXED: 4,
  Z_DEFAULT_STRATEGY: 0,
  //Z_ASCII:                1, // = Z_TEXT (deprecated)
  Z_UNKNOWN: 2,
  /* The deflate compression method */
  Z_DEFLATED: 8
  //Z_NULL:                 null // Use -1 or null inline, depending on var type
};
const { _tr_init: as, _tr_stored_block: bi, _tr_flush_block: ss, _tr_tally: Ae, _tr_align: ns } = es, {
  Z_NO_FLUSH: Te,
  Z_PARTIAL_FLUSH: ls,
  Z_FULL_FLUSH: ds,
  Z_FINISH: ie,
  Z_BLOCK: Qi,
  Z_OK: Z,
  Z_STREAM_END: er,
  Z_STREAM_ERROR: ce,
  Z_DATA_ERROR: cs,
  Z_BUF_ERROR: ri,
  Z_DEFAULT_COMPRESSION: hs,
  Z_FILTERED: fs,
  Z_HUFFMAN_ONLY: Et,
  Z_RLE: ps,
  Z_FIXED: us,
  Z_DEFAULT_STRATEGY: ms,
  Z_UNKNOWN: vs,
  Z_DEFLATED: Zt
} = Ht, gs = 9, _s = 15, bs = 8, ys = 29, xs = 256, yi = xs + 1 + ys, ws = 30, Es = 19, Ss = 2 * yi + 1, ks = 15, L = 3, Se = 258, he = Se + L + 1, As = 32, Ge = 42, Ni = 57, xi = 69, wi = 73, Ei = 91, Si = 103, Oe = 113, rt = 666, q = 1, je = 2, Fe = 3, Xe = 4, Ts = 3, Pe = (i, t) => (i.msg = qe[t], t), tr = (i) => i * 2 - (i > 4 ? 9 : 0), we = (i) => {
  let t = i.length;
  for (; --t >= 0; )
    i[t] = 0;
}, Cs = (i) => {
  let t, e, r, o = i.w_size;
  t = i.hash_size, r = t;
  do
    e = i.head[--r], i.head[r] = e >= o ? e - o : 0;
  while (--t);
  t = o, r = t;
  do
    e = i.prev[--r], i.prev[r] = e >= o ? e - o : 0;
  while (--t);
};
let Is = (i, t, e) => (t << i.hash_shift ^ e) & i.hash_mask, Ce = Is;
const j = (i) => {
  const t = i.state;
  let e = t.pending;
  e > i.avail_out && (e = i.avail_out), e !== 0 && (i.output.set(t.pending_buf.subarray(t.pending_out, t.pending_out + e), i.next_out), i.next_out += e, t.pending_out += e, i.total_out += e, i.avail_out -= e, t.pending -= e, t.pending === 0 && (t.pending_out = 0));
}, X = (i, t) => {
  ss(i, i.block_start >= 0 ? i.block_start : -1, i.strstart - i.block_start, t), i.block_start = i.strstart, j(i.strm);
}, D = (i, t) => {
  i.pending_buf[i.pending++] = t;
}, Je = (i, t) => {
  i.pending_buf[i.pending++] = t >>> 8 & 255, i.pending_buf[i.pending++] = t & 255;
}, ki = (i, t, e, r) => {
  let o = i.avail_in;
  return o > r && (o = r), o === 0 ? 0 : (i.avail_in -= o, t.set(i.input.subarray(i.next_in, i.next_in + o), e), i.state.wrap === 1 ? i.adler = mt(i.adler, t, o, e) : i.state.wrap === 2 && (i.adler = H(i.adler, t, o, e)), i.next_in += o, i.total_in += o, o);
}, So = (i, t) => {
  let e = i.max_chain_length, r = i.strstart, o, a, s = i.prev_length, n = i.nice_match;
  const c = i.strstart > i.w_size - he ? i.strstart - (i.w_size - he) : 0, l = i.window, d = i.w_mask, v = i.prev, p = i.strstart + Se;
  let f = l[r + s - 1], _ = l[r + s];
  i.prev_length >= i.good_match && (e >>= 2), n > i.lookahead && (n = i.lookahead);
  do
    if (o = t, !(l[o + s] !== _ || l[o + s - 1] !== f || l[o] !== l[r] || l[++o] !== l[r + 1])) {
      r += 2, o++;
      do
        ;
      while (l[++r] === l[++o] && l[++r] === l[++o] && l[++r] === l[++o] && l[++r] === l[++o] && l[++r] === l[++o] && l[++r] === l[++o] && l[++r] === l[++o] && l[++r] === l[++o] && r < p);
      if (a = Se - (p - r), r = p - Se, a > s) {
        if (i.match_start = t, s = a, a >= n)
          break;
        f = l[r + s - 1], _ = l[r + s];
      }
    }
  while ((t = v[t & d]) > c && --e !== 0);
  return s <= i.lookahead ? s : i.lookahead;
}, Ke = (i) => {
  const t = i.w_size;
  let e, r, o;
  do {
    if (r = i.window_size - i.lookahead - i.strstart, i.strstart >= t + (t - he) && (i.window.set(i.window.subarray(t, t + t - r), 0), i.match_start -= t, i.strstart -= t, i.block_start -= t, i.insert > i.strstart && (i.insert = i.strstart), Cs(i), r += t), i.strm.avail_in === 0)
      break;
    if (e = ki(i.strm, i.window, i.strstart + i.lookahead, r), i.lookahead += e, i.lookahead + i.insert >= L)
      for (o = i.strstart - i.insert, i.ins_h = i.window[o], i.ins_h = Ce(i, i.ins_h, i.window[o + 1]); i.insert && (i.ins_h = Ce(i, i.ins_h, i.window[o + L - 1]), i.prev[o & i.w_mask] = i.head[i.ins_h], i.head[i.ins_h] = o, o++, i.insert--, !(i.lookahead + i.insert < L)); )
        ;
  } while (i.lookahead < he && i.strm.avail_in !== 0);
}, ko = (i, t) => {
  let e = i.pending_buf_size - 5 > i.w_size ? i.w_size : i.pending_buf_size - 5, r, o, a, s = 0, n = i.strm.avail_in;
  do {
    if (r = 65535, a = i.bi_valid + 42 >> 3, i.strm.avail_out < a || (a = i.strm.avail_out - a, o = i.strstart - i.block_start, r > o + i.strm.avail_in && (r = o + i.strm.avail_in), r > a && (r = a), r < e && (r === 0 && t !== ie || t === Te || r !== o + i.strm.avail_in)))
      break;
    s = t === ie && r === o + i.strm.avail_in ? 1 : 0, bi(i, 0, 0, s), i.pending_buf[i.pending - 4] = r, i.pending_buf[i.pending - 3] = r >> 8, i.pending_buf[i.pending - 2] = ~r, i.pending_buf[i.pending - 1] = ~r >> 8, j(i.strm), o && (o > r && (o = r), i.strm.output.set(i.window.subarray(i.block_start, i.block_start + o), i.strm.next_out), i.strm.next_out += o, i.strm.avail_out -= o, i.strm.total_out += o, i.block_start += o, r -= o), r && (ki(i.strm, i.strm.output, i.strm.next_out, r), i.strm.next_out += r, i.strm.avail_out -= r, i.strm.total_out += r);
  } while (s === 0);
  return n -= i.strm.avail_in, n && (n >= i.w_size ? (i.matches = 2, i.window.set(i.strm.input.subarray(i.strm.next_in - i.w_size, i.strm.next_in), 0), i.strstart = i.w_size, i.insert = i.strstart) : (i.window_size - i.strstart <= n && (i.strstart -= i.w_size, i.window.set(i.window.subarray(i.w_size, i.w_size + i.strstart), 0), i.matches < 2 && i.matches++, i.insert > i.strstart && (i.insert = i.strstart)), i.window.set(i.strm.input.subarray(i.strm.next_in - n, i.strm.next_in), i.strstart), i.strstart += n, i.insert += n > i.w_size - i.insert ? i.w_size - i.insert : n), i.block_start = i.strstart), i.high_water < i.strstart && (i.high_water = i.strstart), s ? Xe : t !== Te && t !== ie && i.strm.avail_in === 0 && i.strstart === i.block_start ? je : (a = i.window_size - i.strstart, i.strm.avail_in > a && i.block_start >= i.w_size && (i.block_start -= i.w_size, i.strstart -= i.w_size, i.window.set(i.window.subarray(i.w_size, i.w_size + i.strstart), 0), i.matches < 2 && i.matches++, a += i.w_size, i.insert > i.strstart && (i.insert = i.strstart)), a > i.strm.avail_in && (a = i.strm.avail_in), a && (ki(i.strm, i.window, i.strstart, a), i.strstart += a, i.insert += a > i.w_size - i.insert ? i.w_size - i.insert : a), i.high_water < i.strstart && (i.high_water = i.strstart), a = i.bi_valid + 42 >> 3, a = i.pending_buf_size - a > 65535 ? 65535 : i.pending_buf_size - a, e = a > i.w_size ? i.w_size : a, o = i.strstart - i.block_start, (o >= e || (o || t === ie) && t !== Te && i.strm.avail_in === 0 && o <= a) && (r = o > a ? a : o, s = t === ie && i.strm.avail_in === 0 && r === o ? 1 : 0, bi(i, i.block_start, r, s), i.block_start += r, j(i.strm)), s ? Fe : q);
}, oi = (i, t) => {
  let e, r;
  for (; ; ) {
    if (i.lookahead < he) {
      if (Ke(i), i.lookahead < he && t === Te)
        return q;
      if (i.lookahead === 0)
        break;
    }
    if (e = 0, i.lookahead >= L && (i.ins_h = Ce(i, i.ins_h, i.window[i.strstart + L - 1]), e = i.prev[i.strstart & i.w_mask] = i.head[i.ins_h], i.head[i.ins_h] = i.strstart), e !== 0 && i.strstart - e <= i.w_size - he && (i.match_length = So(i, e)), i.match_length >= L)
      if (r = Ae(i, i.strstart - i.match_start, i.match_length - L), i.lookahead -= i.match_length, i.match_length <= i.max_lazy_match && i.lookahead >= L) {
        i.match_length--;
        do
          i.strstart++, i.ins_h = Ce(i, i.ins_h, i.window[i.strstart + L - 1]), e = i.prev[i.strstart & i.w_mask] = i.head[i.ins_h], i.head[i.ins_h] = i.strstart;
        while (--i.match_length !== 0);
        i.strstart++;
      } else
        i.strstart += i.match_length, i.match_length = 0, i.ins_h = i.window[i.strstart], i.ins_h = Ce(i, i.ins_h, i.window[i.strstart + 1]);
    else
      r = Ae(i, 0, i.window[i.strstart]), i.lookahead--, i.strstart++;
    if (r && (X(i, !1), i.strm.avail_out === 0))
      return q;
  }
  return i.insert = i.strstart < L - 1 ? i.strstart : L - 1, t === ie ? (X(i, !0), i.strm.avail_out === 0 ? Fe : Xe) : i.sym_next && (X(i, !1), i.strm.avail_out === 0) ? q : je;
}, Ue = (i, t) => {
  let e, r, o;
  for (; ; ) {
    if (i.lookahead < he) {
      if (Ke(i), i.lookahead < he && t === Te)
        return q;
      if (i.lookahead === 0)
        break;
    }
    if (e = 0, i.lookahead >= L && (i.ins_h = Ce(i, i.ins_h, i.window[i.strstart + L - 1]), e = i.prev[i.strstart & i.w_mask] = i.head[i.ins_h], i.head[i.ins_h] = i.strstart), i.prev_length = i.match_length, i.prev_match = i.match_start, i.match_length = L - 1, e !== 0 && i.prev_length < i.max_lazy_match && i.strstart - e <= i.w_size - he && (i.match_length = So(i, e), i.match_length <= 5 && (i.strategy === fs || i.match_length === L && i.strstart - i.match_start > 4096) && (i.match_length = L - 1)), i.prev_length >= L && i.match_length <= i.prev_length) {
      o = i.strstart + i.lookahead - L, r = Ae(i, i.strstart - 1 - i.prev_match, i.prev_length - L), i.lookahead -= i.prev_length - 1, i.prev_length -= 2;
      do
        ++i.strstart <= o && (i.ins_h = Ce(i, i.ins_h, i.window[i.strstart + L - 1]), e = i.prev[i.strstart & i.w_mask] = i.head[i.ins_h], i.head[i.ins_h] = i.strstart);
      while (--i.prev_length !== 0);
      if (i.match_available = 0, i.match_length = L - 1, i.strstart++, r && (X(i, !1), i.strm.avail_out === 0))
        return q;
    } else if (i.match_available) {
      if (r = Ae(i, 0, i.window[i.strstart - 1]), r && X(i, !1), i.strstart++, i.lookahead--, i.strm.avail_out === 0)
        return q;
    } else
      i.match_available = 1, i.strstart++, i.lookahead--;
  }
  return i.match_available && (r = Ae(i, 0, i.window[i.strstart - 1]), i.match_available = 0), i.insert = i.strstart < L - 1 ? i.strstart : L - 1, t === ie ? (X(i, !0), i.strm.avail_out === 0 ? Fe : Xe) : i.sym_next && (X(i, !1), i.strm.avail_out === 0) ? q : je;
}, Rs = (i, t) => {
  let e, r, o, a;
  const s = i.window;
  for (; ; ) {
    if (i.lookahead <= Se) {
      if (Ke(i), i.lookahead <= Se && t === Te)
        return q;
      if (i.lookahead === 0)
        break;
    }
    if (i.match_length = 0, i.lookahead >= L && i.strstart > 0 && (o = i.strstart - 1, r = s[o], r === s[++o] && r === s[++o] && r === s[++o])) {
      a = i.strstart + Se;
      do
        ;
      while (r === s[++o] && r === s[++o] && r === s[++o] && r === s[++o] && r === s[++o] && r === s[++o] && r === s[++o] && r === s[++o] && o < a);
      i.match_length = Se - (a - o), i.match_length > i.lookahead && (i.match_length = i.lookahead);
    }
    if (i.match_length >= L ? (e = Ae(i, 1, i.match_length - L), i.lookahead -= i.match_length, i.strstart += i.match_length, i.match_length = 0) : (e = Ae(i, 0, i.window[i.strstart]), i.lookahead--, i.strstart++), e && (X(i, !1), i.strm.avail_out === 0))
      return q;
  }
  return i.insert = 0, t === ie ? (X(i, !0), i.strm.avail_out === 0 ? Fe : Xe) : i.sym_next && (X(i, !1), i.strm.avail_out === 0) ? q : je;
}, $s = (i, t) => {
  let e;
  for (; ; ) {
    if (i.lookahead === 0 && (Ke(i), i.lookahead === 0)) {
      if (t === Te)
        return q;
      break;
    }
    if (i.match_length = 0, e = Ae(i, 0, i.window[i.strstart]), i.lookahead--, i.strstart++, e && (X(i, !1), i.strm.avail_out === 0))
      return q;
  }
  return i.insert = 0, t === ie ? (X(i, !0), i.strm.avail_out === 0 ? Fe : Xe) : i.sym_next && (X(i, !1), i.strm.avail_out === 0) ? q : je;
};
function le(i, t, e, r, o) {
  this.good_length = i, this.max_lazy = t, this.nice_length = e, this.max_chain = r, this.func = o;
}
const ot = [
  /*      good lazy nice chain */
  new le(0, 0, 0, 0, ko),
  /* 0 store only */
  new le(4, 4, 8, 4, oi),
  /* 1 max speed, no lazy matches */
  new le(4, 5, 16, 8, oi),
  /* 2 */
  new le(4, 6, 32, 32, oi),
  /* 3 */
  new le(4, 4, 16, 16, Ue),
  /* 4 lazy matches */
  new le(8, 16, 32, 32, Ue),
  /* 5 */
  new le(8, 16, 128, 128, Ue),
  /* 6 */
  new le(8, 32, 128, 256, Ue),
  /* 7 */
  new le(32, 128, 258, 1024, Ue),
  /* 8 */
  new le(32, 258, 258, 4096, Ue)
  /* 9 max compression */
], Ls = (i) => {
  i.window_size = 2 * i.w_size, we(i.head), i.max_lazy_match = ot[i.level].max_lazy, i.good_match = ot[i.level].good_length, i.nice_match = ot[i.level].nice_length, i.max_chain_length = ot[i.level].max_chain, i.strstart = 0, i.block_start = 0, i.lookahead = 0, i.insert = 0, i.match_length = i.prev_length = L - 1, i.match_available = 0, i.ins_h = 0;
};
function Ds() {
  this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = Zt, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new Uint16Array(Ss * 2), this.dyn_dtree = new Uint16Array((2 * ws + 1) * 2), this.bl_tree = new Uint16Array((2 * Es + 1) * 2), we(this.dyn_ltree), we(this.dyn_dtree), we(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new Uint16Array(ks + 1), this.heap = new Uint16Array(2 * yi + 1), we(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new Uint16Array(2 * yi + 1), we(this.depth), this.sym_buf = 0, this.lit_bufsize = 0, this.sym_next = 0, this.sym_end = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
}
const yt = (i) => {
  if (!i)
    return 1;
  const t = i.state;
  return !t || t.strm !== i || t.status !== Ge && //#ifdef GZIP
  t.status !== Ni && //#endif
  t.status !== xi && t.status !== wi && t.status !== Ei && t.status !== Si && t.status !== Oe && t.status !== rt ? 1 : 0;
}, Ao = (i) => {
  if (yt(i))
    return Pe(i, ce);
  i.total_in = i.total_out = 0, i.data_type = vs;
  const t = i.state;
  return t.pending = 0, t.pending_out = 0, t.wrap < 0 && (t.wrap = -t.wrap), t.status = //#ifdef GZIP
  t.wrap === 2 ? Ni : (
    //#endif
    t.wrap ? Ge : Oe
  ), i.adler = t.wrap === 2 ? 0 : 1, t.last_flush = -2, as(t), Z;
}, To = (i) => {
  const t = Ao(i);
  return t === Z && Ls(i.state), t;
}, Os = (i, t) => yt(i) || i.state.wrap !== 2 ? ce : (i.state.gzhead = t, Z), Co = (i, t, e, r, o, a) => {
  if (!i)
    return ce;
  let s = 1;
  if (t === hs && (t = 6), r < 0 ? (s = 0, r = -r) : r > 15 && (s = 2, r -= 16), o < 1 || o > gs || e !== Zt || r < 8 || r > 15 || t < 0 || t > 9 || a < 0 || a > us || r === 8 && s !== 1)
    return Pe(i, ce);
  r === 8 && (r = 9);
  const n = new Ds();
  return i.state = n, n.strm = i, n.status = Ge, n.wrap = s, n.gzhead = null, n.w_bits = r, n.w_size = 1 << n.w_bits, n.w_mask = n.w_size - 1, n.hash_bits = o + 7, n.hash_size = 1 << n.hash_bits, n.hash_mask = n.hash_size - 1, n.hash_shift = ~~((n.hash_bits + L - 1) / L), n.window = new Uint8Array(n.w_size * 2), n.head = new Uint16Array(n.hash_size), n.prev = new Uint16Array(n.w_size), n.lit_bufsize = 1 << o + 6, n.pending_buf_size = n.lit_bufsize * 4, n.pending_buf = new Uint8Array(n.pending_buf_size), n.sym_buf = n.lit_bufsize, n.sym_end = (n.lit_bufsize - 1) * 3, n.level = t, n.strategy = a, n.method = e, To(i);
}, Ps = (i, t) => Co(i, t, Zt, _s, bs, ms), Fs = (i, t) => {
  if (yt(i) || t > Qi || t < 0)
    return i ? Pe(i, ce) : ce;
  const e = i.state;
  if (!i.output || i.avail_in !== 0 && !i.input || e.status === rt && t !== ie)
    return Pe(i, i.avail_out === 0 ? ri : ce);
  const r = e.last_flush;
  if (e.last_flush = t, e.pending !== 0) {
    if (j(i), i.avail_out === 0)
      return e.last_flush = -1, Z;
  } else if (i.avail_in === 0 && tr(t) <= tr(r) && t !== ie)
    return Pe(i, ri);
  if (e.status === rt && i.avail_in !== 0)
    return Pe(i, ri);
  if (e.status === Ge && e.wrap === 0 && (e.status = Oe), e.status === Ge) {
    let o = Zt + (e.w_bits - 8 << 4) << 8, a = -1;
    if (e.strategy >= Et || e.level < 2 ? a = 0 : e.level < 6 ? a = 1 : e.level === 6 ? a = 2 : a = 3, o |= a << 6, e.strstart !== 0 && (o |= As), o += 31 - o % 31, Je(e, o), e.strstart !== 0 && (Je(e, i.adler >>> 16), Je(e, i.adler & 65535)), i.adler = 1, e.status = Oe, j(i), e.pending !== 0)
      return e.last_flush = -1, Z;
  }
  if (e.status === Ni) {
    if (i.adler = 0, D(e, 31), D(e, 139), D(e, 8), e.gzhead)
      D(
        e,
        (e.gzhead.text ? 1 : 0) + (e.gzhead.hcrc ? 2 : 0) + (e.gzhead.extra ? 4 : 0) + (e.gzhead.name ? 8 : 0) + (e.gzhead.comment ? 16 : 0)
      ), D(e, e.gzhead.time & 255), D(e, e.gzhead.time >> 8 & 255), D(e, e.gzhead.time >> 16 & 255), D(e, e.gzhead.time >> 24 & 255), D(e, e.level === 9 ? 2 : e.strategy >= Et || e.level < 2 ? 4 : 0), D(e, e.gzhead.os & 255), e.gzhead.extra && e.gzhead.extra.length && (D(e, e.gzhead.extra.length & 255), D(e, e.gzhead.extra.length >> 8 & 255)), e.gzhead.hcrc && (i.adler = H(i.adler, e.pending_buf, e.pending, 0)), e.gzindex = 0, e.status = xi;
    else if (D(e, 0), D(e, 0), D(e, 0), D(e, 0), D(e, 0), D(e, e.level === 9 ? 2 : e.strategy >= Et || e.level < 2 ? 4 : 0), D(e, Ts), e.status = Oe, j(i), e.pending !== 0)
      return e.last_flush = -1, Z;
  }
  if (e.status === xi) {
    if (e.gzhead.extra) {
      let o = e.pending, a = (e.gzhead.extra.length & 65535) - e.gzindex;
      for (; e.pending + a > e.pending_buf_size; ) {
        let n = e.pending_buf_size - e.pending;
        if (e.pending_buf.set(e.gzhead.extra.subarray(e.gzindex, e.gzindex + n), e.pending), e.pending = e.pending_buf_size, e.gzhead.hcrc && e.pending > o && (i.adler = H(i.adler, e.pending_buf, e.pending - o, o)), e.gzindex += n, j(i), e.pending !== 0)
          return e.last_flush = -1, Z;
        o = 0, a -= n;
      }
      let s = new Uint8Array(e.gzhead.extra);
      e.pending_buf.set(s.subarray(e.gzindex, e.gzindex + a), e.pending), e.pending += a, e.gzhead.hcrc && e.pending > o && (i.adler = H(i.adler, e.pending_buf, e.pending - o, o)), e.gzindex = 0;
    }
    e.status = wi;
  }
  if (e.status === wi) {
    if (e.gzhead.name) {
      let o = e.pending, a;
      do {
        if (e.pending === e.pending_buf_size) {
          if (e.gzhead.hcrc && e.pending > o && (i.adler = H(i.adler, e.pending_buf, e.pending - o, o)), j(i), e.pending !== 0)
            return e.last_flush = -1, Z;
          o = 0;
        }
        e.gzindex < e.gzhead.name.length ? a = e.gzhead.name.charCodeAt(e.gzindex++) & 255 : a = 0, D(e, a);
      } while (a !== 0);
      e.gzhead.hcrc && e.pending > o && (i.adler = H(i.adler, e.pending_buf, e.pending - o, o)), e.gzindex = 0;
    }
    e.status = Ei;
  }
  if (e.status === Ei) {
    if (e.gzhead.comment) {
      let o = e.pending, a;
      do {
        if (e.pending === e.pending_buf_size) {
          if (e.gzhead.hcrc && e.pending > o && (i.adler = H(i.adler, e.pending_buf, e.pending - o, o)), j(i), e.pending !== 0)
            return e.last_flush = -1, Z;
          o = 0;
        }
        e.gzindex < e.gzhead.comment.length ? a = e.gzhead.comment.charCodeAt(e.gzindex++) & 255 : a = 0, D(e, a);
      } while (a !== 0);
      e.gzhead.hcrc && e.pending > o && (i.adler = H(i.adler, e.pending_buf, e.pending - o, o));
    }
    e.status = Si;
  }
  if (e.status === Si) {
    if (e.gzhead.hcrc) {
      if (e.pending + 2 > e.pending_buf_size && (j(i), e.pending !== 0))
        return e.last_flush = -1, Z;
      D(e, i.adler & 255), D(e, i.adler >> 8 & 255), i.adler = 0;
    }
    if (e.status = Oe, j(i), e.pending !== 0)
      return e.last_flush = -1, Z;
  }
  if (i.avail_in !== 0 || e.lookahead !== 0 || t !== Te && e.status !== rt) {
    let o = e.level === 0 ? ko(e, t) : e.strategy === Et ? $s(e, t) : e.strategy === ps ? Rs(e, t) : ot[e.level].func(e, t);
    if ((o === Fe || o === Xe) && (e.status = rt), o === q || o === Fe)
      return i.avail_out === 0 && (e.last_flush = -1), Z;
    if (o === je && (t === ls ? ns(e) : t !== Qi && (bi(e, 0, 0, !1), t === ds && (we(e.head), e.lookahead === 0 && (e.strstart = 0, e.block_start = 0, e.insert = 0))), j(i), i.avail_out === 0))
      return e.last_flush = -1, Z;
  }
  return t !== ie ? Z : e.wrap <= 0 ? er : (e.wrap === 2 ? (D(e, i.adler & 255), D(e, i.adler >> 8 & 255), D(e, i.adler >> 16 & 255), D(e, i.adler >> 24 & 255), D(e, i.total_in & 255), D(e, i.total_in >> 8 & 255), D(e, i.total_in >> 16 & 255), D(e, i.total_in >> 24 & 255)) : (Je(e, i.adler >>> 16), Je(e, i.adler & 65535)), j(i), e.wrap > 0 && (e.wrap = -e.wrap), e.pending !== 0 ? Z : er);
}, Bs = (i) => {
  if (yt(i))
    return ce;
  const t = i.state.status;
  return i.state = null, t === Oe ? Pe(i, cs) : Z;
}, zs = (i, t) => {
  let e = t.length;
  if (yt(i))
    return ce;
  const r = i.state, o = r.wrap;
  if (o === 2 || o === 1 && r.status !== Ge || r.lookahead)
    return ce;
  if (o === 1 && (i.adler = mt(i.adler, t, e, 0)), r.wrap = 0, e >= r.w_size) {
    o === 0 && (we(r.head), r.strstart = 0, r.block_start = 0, r.insert = 0);
    let c = new Uint8Array(r.w_size);
    c.set(t.subarray(e - r.w_size, e), 0), t = c, e = r.w_size;
  }
  const a = i.avail_in, s = i.next_in, n = i.input;
  for (i.avail_in = e, i.next_in = 0, i.input = t, Ke(r); r.lookahead >= L; ) {
    let c = r.strstart, l = r.lookahead - (L - 1);
    do
      r.ins_h = Ce(r, r.ins_h, r.window[c + L - 1]), r.prev[c & r.w_mask] = r.head[r.ins_h], r.head[r.ins_h] = c, c++;
    while (--l);
    r.strstart = c, r.lookahead = L - 1, Ke(r);
  }
  return r.strstart += r.lookahead, r.block_start = r.strstart, r.insert = r.lookahead, r.lookahead = 0, r.match_length = r.prev_length = L - 1, r.match_available = 0, i.next_in = s, i.input = n, i.avail_in = a, r.wrap = o, Z;
};
var Ms = Ps, Us = Co, Ns = To, Hs = Ao, Zs = Os, Vs = Fs, Ws = Bs, qs = zs, Gs = "pako deflate (from Nodeca project)", nt = {
  deflateInit: Ms,
  deflateInit2: Us,
  deflateReset: Ns,
  deflateResetKeep: Hs,
  deflateSetHeader: Zs,
  deflate: Vs,
  deflateEnd: Ws,
  deflateSetDictionary: qs,
  deflateInfo: Gs
};
const Ks = (i, t) => Object.prototype.hasOwnProperty.call(i, t);
var Ys = function(i) {
  const t = Array.prototype.slice.call(arguments, 1);
  for (; t.length; ) {
    const e = t.shift();
    if (e) {
      if (typeof e != "object")
        throw new TypeError(e + "must be non-object");
      for (const r in e)
        Ks(e, r) && (i[r] = e[r]);
    }
  }
  return i;
}, js = (i) => {
  let t = 0;
  for (let r = 0, o = i.length; r < o; r++)
    t += i[r].length;
  const e = new Uint8Array(t);
  for (let r = 0, o = 0, a = i.length; r < a; r++) {
    let s = i[r];
    e.set(s, o), o += s.length;
  }
  return e;
}, Vt = {
  assign: Ys,
  flattenChunks: js
};
let Io = !0;
try {
  String.fromCharCode.apply(null, new Uint8Array(1));
} catch {
  Io = !1;
}
const vt = new Uint8Array(256);
for (let i = 0; i < 256; i++)
  vt[i] = i >= 252 ? 6 : i >= 248 ? 5 : i >= 240 ? 4 : i >= 224 ? 3 : i >= 192 ? 2 : 1;
vt[254] = vt[254] = 1;
var Xs = (i) => {
  if (typeof TextEncoder == "function" && TextEncoder.prototype.encode)
    return new TextEncoder().encode(i);
  let t, e, r, o, a, s = i.length, n = 0;
  for (o = 0; o < s; o++)
    e = i.charCodeAt(o), (e & 64512) === 55296 && o + 1 < s && (r = i.charCodeAt(o + 1), (r & 64512) === 56320 && (e = 65536 + (e - 55296 << 10) + (r - 56320), o++)), n += e < 128 ? 1 : e < 2048 ? 2 : e < 65536 ? 3 : 4;
  for (t = new Uint8Array(n), a = 0, o = 0; a < n; o++)
    e = i.charCodeAt(o), (e & 64512) === 55296 && o + 1 < s && (r = i.charCodeAt(o + 1), (r & 64512) === 56320 && (e = 65536 + (e - 55296 << 10) + (r - 56320), o++)), e < 128 ? t[a++] = e : e < 2048 ? (t[a++] = 192 | e >>> 6, t[a++] = 128 | e & 63) : e < 65536 ? (t[a++] = 224 | e >>> 12, t[a++] = 128 | e >>> 6 & 63, t[a++] = 128 | e & 63) : (t[a++] = 240 | e >>> 18, t[a++] = 128 | e >>> 12 & 63, t[a++] = 128 | e >>> 6 & 63, t[a++] = 128 | e & 63);
  return t;
};
const Js = (i, t) => {
  if (t < 65534 && i.subarray && Io)
    return String.fromCharCode.apply(null, i.length === t ? i : i.subarray(0, t));
  let e = "";
  for (let r = 0; r < t; r++)
    e += String.fromCharCode(i[r]);
  return e;
};
var Qs = (i, t) => {
  const e = t || i.length;
  if (typeof TextDecoder == "function" && TextDecoder.prototype.decode)
    return new TextDecoder().decode(i.subarray(0, t));
  let r, o;
  const a = new Array(e * 2);
  for (o = 0, r = 0; r < e; ) {
    let s = i[r++];
    if (s < 128) {
      a[o++] = s;
      continue;
    }
    let n = vt[s];
    if (n > 4) {
      a[o++] = 65533, r += n - 1;
      continue;
    }
    for (s &= n === 2 ? 31 : n === 3 ? 15 : 7; n > 1 && r < e; )
      s = s << 6 | i[r++] & 63, n--;
    if (n > 1) {
      a[o++] = 65533;
      continue;
    }
    s < 65536 ? a[o++] = s : (s -= 65536, a[o++] = 55296 | s >> 10 & 1023, a[o++] = 56320 | s & 1023);
  }
  return Js(a, o);
}, en = (i, t) => {
  t = t || i.length, t > i.length && (t = i.length);
  let e = t - 1;
  for (; e >= 0 && (i[e] & 192) === 128; )
    e--;
  return e < 0 || e === 0 ? t : e + vt[i[e]] > t ? e : t;
}, gt = {
  string2buf: Xs,
  buf2string: Qs,
  utf8border: en
};
function tn() {
  this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
}
var Ro = tn;
const $o = Object.prototype.toString, {
  Z_NO_FLUSH: rn,
  Z_SYNC_FLUSH: on,
  Z_FULL_FLUSH: an,
  Z_FINISH: sn,
  Z_OK: Pt,
  Z_STREAM_END: nn,
  Z_DEFAULT_COMPRESSION: ln,
  Z_DEFAULT_STRATEGY: dn,
  Z_DEFLATED: cn
} = Ht;
function Wt(i) {
  this.options = Vt.assign({
    level: ln,
    method: cn,
    chunkSize: 16384,
    windowBits: 15,
    memLevel: 8,
    strategy: dn
  }, i || {});
  let t = this.options;
  t.raw && t.windowBits > 0 ? t.windowBits = -t.windowBits : t.gzip && t.windowBits > 0 && t.windowBits < 16 && (t.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new Ro(), this.strm.avail_out = 0;
  let e = nt.deflateInit2(
    this.strm,
    t.level,
    t.method,
    t.windowBits,
    t.memLevel,
    t.strategy
  );
  if (e !== Pt)
    throw new Error(qe[e]);
  if (t.header && nt.deflateSetHeader(this.strm, t.header), t.dictionary) {
    let r;
    if (typeof t.dictionary == "string" ? r = gt.string2buf(t.dictionary) : $o.call(t.dictionary) === "[object ArrayBuffer]" ? r = new Uint8Array(t.dictionary) : r = t.dictionary, e = nt.deflateSetDictionary(this.strm, r), e !== Pt)
      throw new Error(qe[e]);
    this._dict_set = !0;
  }
}
Wt.prototype.push = function(i, t) {
  const e = this.strm, r = this.options.chunkSize;
  let o, a;
  if (this.ended)
    return !1;
  for (t === ~~t ? a = t : a = t === !0 ? sn : rn, typeof i == "string" ? e.input = gt.string2buf(i) : $o.call(i) === "[object ArrayBuffer]" ? e.input = new Uint8Array(i) : e.input = i, e.next_in = 0, e.avail_in = e.input.length; ; ) {
    if (e.avail_out === 0 && (e.output = new Uint8Array(r), e.next_out = 0, e.avail_out = r), (a === on || a === an) && e.avail_out <= 6) {
      this.onData(e.output.subarray(0, e.next_out)), e.avail_out = 0;
      continue;
    }
    if (o = nt.deflate(e, a), o === nn)
      return e.next_out > 0 && this.onData(e.output.subarray(0, e.next_out)), o = nt.deflateEnd(this.strm), this.onEnd(o), this.ended = !0, o === Pt;
    if (e.avail_out === 0) {
      this.onData(e.output);
      continue;
    }
    if (a > 0 && e.next_out > 0) {
      this.onData(e.output.subarray(0, e.next_out)), e.avail_out = 0;
      continue;
    }
    if (e.avail_in === 0) break;
  }
  return !0;
};
Wt.prototype.onData = function(i) {
  this.chunks.push(i);
};
Wt.prototype.onEnd = function(i) {
  i === Pt && (this.result = Vt.flattenChunks(this.chunks)), this.chunks = [], this.err = i, this.msg = this.strm.msg;
};
function hn(i, t) {
  const e = new Wt(t);
  if (e.push(i, !0), e.err)
    throw e.msg || qe[e.err];
  return e.result;
}
var fn = hn, pn = {
  deflate: fn
};
const St = 16209, un = 16191;
var mn = function(t, e) {
  let r, o, a, s, n, c, l, d, v, p, f, _, y, x, b, E, S, m, k, O, w, I, R, T;
  const C = t.state;
  r = t.next_in, R = t.input, o = r + (t.avail_in - 5), a = t.next_out, T = t.output, s = a - (e - t.avail_out), n = a + (t.avail_out - 257), c = C.dmax, l = C.wsize, d = C.whave, v = C.wnext, p = C.window, f = C.hold, _ = C.bits, y = C.lencode, x = C.distcode, b = (1 << C.lenbits) - 1, E = (1 << C.distbits) - 1;
  e:
    do {
      _ < 15 && (f += R[r++] << _, _ += 8, f += R[r++] << _, _ += 8), S = y[f & b];
      t:
        for (; ; ) {
          if (m = S >>> 24, f >>>= m, _ -= m, m = S >>> 16 & 255, m === 0)
            T[a++] = S & 65535;
          else if (m & 16) {
            k = S & 65535, m &= 15, m && (_ < m && (f += R[r++] << _, _ += 8), k += f & (1 << m) - 1, f >>>= m, _ -= m), _ < 15 && (f += R[r++] << _, _ += 8, f += R[r++] << _, _ += 8), S = x[f & E];
            i:
              for (; ; ) {
                if (m = S >>> 24, f >>>= m, _ -= m, m = S >>> 16 & 255, m & 16) {
                  if (O = S & 65535, m &= 15, _ < m && (f += R[r++] << _, _ += 8, _ < m && (f += R[r++] << _, _ += 8)), O += f & (1 << m) - 1, O > c) {
                    t.msg = "invalid distance too far back", C.mode = St;
                    break e;
                  }
                  if (f >>>= m, _ -= m, m = a - s, O > m) {
                    if (m = O - m, m > d && C.sane) {
                      t.msg = "invalid distance too far back", C.mode = St;
                      break e;
                    }
                    if (w = 0, I = p, v === 0) {
                      if (w += l - m, m < k) {
                        k -= m;
                        do
                          T[a++] = p[w++];
                        while (--m);
                        w = a - O, I = T;
                      }
                    } else if (v < m) {
                      if (w += l + v - m, m -= v, m < k) {
                        k -= m;
                        do
                          T[a++] = p[w++];
                        while (--m);
                        if (w = 0, v < k) {
                          m = v, k -= m;
                          do
                            T[a++] = p[w++];
                          while (--m);
                          w = a - O, I = T;
                        }
                      }
                    } else if (w += v - m, m < k) {
                      k -= m;
                      do
                        T[a++] = p[w++];
                      while (--m);
                      w = a - O, I = T;
                    }
                    for (; k > 2; )
                      T[a++] = I[w++], T[a++] = I[w++], T[a++] = I[w++], k -= 3;
                    k && (T[a++] = I[w++], k > 1 && (T[a++] = I[w++]));
                  } else {
                    w = a - O;
                    do
                      T[a++] = T[w++], T[a++] = T[w++], T[a++] = T[w++], k -= 3;
                    while (k > 2);
                    k && (T[a++] = T[w++], k > 1 && (T[a++] = T[w++]));
                  }
                } else if ((m & 64) === 0) {
                  S = x[(S & 65535) + (f & (1 << m) - 1)];
                  continue i;
                } else {
                  t.msg = "invalid distance code", C.mode = St;
                  break e;
                }
                break;
              }
          } else if ((m & 64) === 0) {
            S = y[(S & 65535) + (f & (1 << m) - 1)];
            continue t;
          } else if (m & 32) {
            C.mode = un;
            break e;
          } else {
            t.msg = "invalid literal/length code", C.mode = St;
            break e;
          }
          break;
        }
    } while (r < o && a < n);
  k = _ >> 3, r -= k, _ -= k << 3, f &= (1 << _) - 1, t.next_in = r, t.next_out = a, t.avail_in = r < o ? 5 + (o - r) : 5 - (r - o), t.avail_out = a < n ? 257 + (n - a) : 257 - (a - n), C.hold = f, C.bits = _;
};
const Ne = 15, ir = 852, rr = 592, or = 0, ai = 1, ar = 2, vn = new Uint16Array([
  /* Length codes 257..285 base */
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  13,
  15,
  17,
  19,
  23,
  27,
  31,
  35,
  43,
  51,
  59,
  67,
  83,
  99,
  115,
  131,
  163,
  195,
  227,
  258,
  0,
  0
]), gn = new Uint8Array([
  /* Length codes 257..285 extra */
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  16,
  17,
  17,
  17,
  17,
  18,
  18,
  18,
  18,
  19,
  19,
  19,
  19,
  20,
  20,
  20,
  20,
  21,
  21,
  21,
  21,
  16,
  72,
  78
]), _n = new Uint16Array([
  /* Distance codes 0..29 base */
  1,
  2,
  3,
  4,
  5,
  7,
  9,
  13,
  17,
  25,
  33,
  49,
  65,
  97,
  129,
  193,
  257,
  385,
  513,
  769,
  1025,
  1537,
  2049,
  3073,
  4097,
  6145,
  8193,
  12289,
  16385,
  24577,
  0,
  0
]), bn = new Uint8Array([
  /* Distance codes 0..29 extra */
  16,
  16,
  16,
  16,
  17,
  17,
  18,
  18,
  19,
  19,
  20,
  20,
  21,
  21,
  22,
  22,
  23,
  23,
  24,
  24,
  25,
  25,
  26,
  26,
  27,
  27,
  28,
  28,
  29,
  29,
  64,
  64
]), yn = (i, t, e, r, o, a, s, n) => {
  const c = n.bits;
  let l = 0, d = 0, v = 0, p = 0, f = 0, _ = 0, y = 0, x = 0, b = 0, E = 0, S, m, k, O, w, I = null, R;
  const T = new Uint16Array(Ne + 1), C = new Uint16Array(Ne + 1);
  let Q = null, xe, Y, $e;
  for (l = 0; l <= Ne; l++)
    T[l] = 0;
  for (d = 0; d < r; d++)
    T[t[e + d]]++;
  for (f = c, p = Ne; p >= 1 && T[p] === 0; p--)
    ;
  if (f > p && (f = p), p === 0)
    return o[a++] = 1 << 24 | 64 << 16 | 0, o[a++] = 1 << 24 | 64 << 16 | 0, n.bits = 1, 0;
  for (v = 1; v < p && T[v] === 0; v++)
    ;
  for (f < v && (f = v), x = 1, l = 1; l <= Ne; l++)
    if (x <<= 1, x -= T[l], x < 0)
      return -1;
  if (x > 0 && (i === or || p !== 1))
    return -1;
  for (C[1] = 0, l = 1; l < Ne; l++)
    C[l + 1] = C[l] + T[l];
  for (d = 0; d < r; d++)
    t[e + d] !== 0 && (s[C[t[e + d]]++] = d);
  if (i === or ? (I = Q = s, R = 20) : i === ai ? (I = vn, Q = gn, R = 257) : (I = _n, Q = bn, R = 0), E = 0, d = 0, l = v, w = a, _ = f, y = 0, k = -1, b = 1 << f, O = b - 1, i === ai && b > ir || i === ar && b > rr)
    return 1;
  for (; ; ) {
    xe = l - y, s[d] + 1 < R ? (Y = 0, $e = s[d]) : s[d] >= R ? (Y = Q[s[d] - R], $e = I[s[d] - R]) : (Y = 96, $e = 0), S = 1 << l - y, m = 1 << _, v = m;
    do
      m -= S, o[w + (E >> y) + m] = xe << 24 | Y << 16 | $e | 0;
    while (m !== 0);
    for (S = 1 << l - 1; E & S; )
      S >>= 1;
    if (S !== 0 ? (E &= S - 1, E += S) : E = 0, d++, --T[l] === 0) {
      if (l === p)
        break;
      l = t[e + s[d]];
    }
    if (l > f && (E & O) !== k) {
      for (y === 0 && (y = f), w += v, _ = l - y, x = 1 << _; _ + y < p && (x -= T[_ + y], !(x <= 0)); )
        _++, x <<= 1;
      if (b += 1 << _, i === ai && b > ir || i === ar && b > rr)
        return 1;
      k = E & O, o[k] = f << 24 | _ << 16 | w - a | 0;
    }
  }
  return E !== 0 && (o[w + E] = l - y << 24 | 64 << 16 | 0), n.bits = f, 0;
};
var lt = yn;
const xn = 0, Lo = 1, Do = 2, {
  Z_FINISH: sr,
  Z_BLOCK: wn,
  Z_TREES: kt,
  Z_OK: Be,
  Z_STREAM_END: En,
  Z_NEED_DICT: Sn,
  Z_STREAM_ERROR: re,
  Z_DATA_ERROR: Oo,
  Z_MEM_ERROR: Po,
  Z_BUF_ERROR: kn,
  Z_DEFLATED: nr
} = Ht, qt = 16180, lr = 16181, dr = 16182, cr = 16183, hr = 16184, fr = 16185, pr = 16186, ur = 16187, mr = 16188, vr = 16189, Ft = 16190, me = 16191, si = 16192, gr = 16193, ni = 16194, _r = 16195, br = 16196, yr = 16197, xr = 16198, At = 16199, Tt = 16200, wr = 16201, Er = 16202, Sr = 16203, kr = 16204, Ar = 16205, li = 16206, Tr = 16207, Cr = 16208, B = 16209, Fo = 16210, Bo = 16211, An = 852, Tn = 592, Cn = 15, In = Cn, Ir = (i) => (i >>> 24 & 255) + (i >>> 8 & 65280) + ((i & 65280) << 8) + ((i & 255) << 24);
function Rn() {
  this.strm = null, this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new Uint16Array(320), this.work = new Uint16Array(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
}
const Me = (i) => {
  if (!i)
    return 1;
  const t = i.state;
  return !t || t.strm !== i || t.mode < qt || t.mode > Bo ? 1 : 0;
}, zo = (i) => {
  if (Me(i))
    return re;
  const t = i.state;
  return i.total_in = i.total_out = t.total = 0, i.msg = "", t.wrap && (i.adler = t.wrap & 1), t.mode = qt, t.last = 0, t.havedict = 0, t.flags = -1, t.dmax = 32768, t.head = null, t.hold = 0, t.bits = 0, t.lencode = t.lendyn = new Int32Array(An), t.distcode = t.distdyn = new Int32Array(Tn), t.sane = 1, t.back = -1, Be;
}, Mo = (i) => {
  if (Me(i))
    return re;
  const t = i.state;
  return t.wsize = 0, t.whave = 0, t.wnext = 0, zo(i);
}, Uo = (i, t) => {
  let e;
  if (Me(i))
    return re;
  const r = i.state;
  return t < 0 ? (e = 0, t = -t) : (e = (t >> 4) + 5, t < 48 && (t &= 15)), t && (t < 8 || t > 15) ? re : (r.window !== null && r.wbits !== t && (r.window = null), r.wrap = e, r.wbits = t, Mo(i));
}, No = (i, t) => {
  if (!i)
    return re;
  const e = new Rn();
  i.state = e, e.strm = i, e.window = null, e.mode = qt;
  const r = Uo(i, t);
  return r !== Be && (i.state = null), r;
}, $n = (i) => No(i, In);
let Rr = !0, di, ci;
const Ln = (i) => {
  if (Rr) {
    di = new Int32Array(512), ci = new Int32Array(32);
    let t = 0;
    for (; t < 144; )
      i.lens[t++] = 8;
    for (; t < 256; )
      i.lens[t++] = 9;
    for (; t < 280; )
      i.lens[t++] = 7;
    for (; t < 288; )
      i.lens[t++] = 8;
    for (lt(Lo, i.lens, 0, 288, di, 0, i.work, { bits: 9 }), t = 0; t < 32; )
      i.lens[t++] = 5;
    lt(Do, i.lens, 0, 32, ci, 0, i.work, { bits: 5 }), Rr = !1;
  }
  i.lencode = di, i.lenbits = 9, i.distcode = ci, i.distbits = 5;
}, Ho = (i, t, e, r) => {
  let o;
  const a = i.state;
  return a.window === null && (a.wsize = 1 << a.wbits, a.wnext = 0, a.whave = 0, a.window = new Uint8Array(a.wsize)), r >= a.wsize ? (a.window.set(t.subarray(e - a.wsize, e), 0), a.wnext = 0, a.whave = a.wsize) : (o = a.wsize - a.wnext, o > r && (o = r), a.window.set(t.subarray(e - r, e - r + o), a.wnext), r -= o, r ? (a.window.set(t.subarray(e - r, e), 0), a.wnext = r, a.whave = a.wsize) : (a.wnext += o, a.wnext === a.wsize && (a.wnext = 0), a.whave < a.wsize && (a.whave += o))), 0;
}, Dn = (i, t) => {
  let e, r, o, a, s, n, c, l, d, v, p, f, _, y, x = 0, b, E, S, m, k, O, w, I;
  const R = new Uint8Array(4);
  let T, C;
  const Q = (
    /* permutation of code lengths */
    new Uint8Array([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15])
  );
  if (Me(i) || !i.output || !i.input && i.avail_in !== 0)
    return re;
  e = i.state, e.mode === me && (e.mode = si), s = i.next_out, o = i.output, c = i.avail_out, a = i.next_in, r = i.input, n = i.avail_in, l = e.hold, d = e.bits, v = n, p = c, I = Be;
  e:
    for (; ; )
      switch (e.mode) {
        case qt:
          if (e.wrap === 0) {
            e.mode = si;
            break;
          }
          for (; d < 16; ) {
            if (n === 0)
              break e;
            n--, l += r[a++] << d, d += 8;
          }
          if (e.wrap & 2 && l === 35615) {
            e.wbits === 0 && (e.wbits = 15), e.check = 0, R[0] = l & 255, R[1] = l >>> 8 & 255, e.check = H(e.check, R, 2, 0), l = 0, d = 0, e.mode = lr;
            break;
          }
          if (e.head && (e.head.done = !1), !(e.wrap & 1) || /* check if zlib header allowed */
          (((l & 255) << 8) + (l >> 8)) % 31) {
            i.msg = "incorrect header check", e.mode = B;
            break;
          }
          if ((l & 15) !== nr) {
            i.msg = "unknown compression method", e.mode = B;
            break;
          }
          if (l >>>= 4, d -= 4, w = (l & 15) + 8, e.wbits === 0 && (e.wbits = w), w > 15 || w > e.wbits) {
            i.msg = "invalid window size", e.mode = B;
            break;
          }
          e.dmax = 1 << e.wbits, e.flags = 0, i.adler = e.check = 1, e.mode = l & 512 ? vr : me, l = 0, d = 0;
          break;
        case lr:
          for (; d < 16; ) {
            if (n === 0)
              break e;
            n--, l += r[a++] << d, d += 8;
          }
          if (e.flags = l, (e.flags & 255) !== nr) {
            i.msg = "unknown compression method", e.mode = B;
            break;
          }
          if (e.flags & 57344) {
            i.msg = "unknown header flags set", e.mode = B;
            break;
          }
          e.head && (e.head.text = l >> 8 & 1), e.flags & 512 && e.wrap & 4 && (R[0] = l & 255, R[1] = l >>> 8 & 255, e.check = H(e.check, R, 2, 0)), l = 0, d = 0, e.mode = dr;
        /* falls through */
        case dr:
          for (; d < 32; ) {
            if (n === 0)
              break e;
            n--, l += r[a++] << d, d += 8;
          }
          e.head && (e.head.time = l), e.flags & 512 && e.wrap & 4 && (R[0] = l & 255, R[1] = l >>> 8 & 255, R[2] = l >>> 16 & 255, R[3] = l >>> 24 & 255, e.check = H(e.check, R, 4, 0)), l = 0, d = 0, e.mode = cr;
        /* falls through */
        case cr:
          for (; d < 16; ) {
            if (n === 0)
              break e;
            n--, l += r[a++] << d, d += 8;
          }
          e.head && (e.head.xflags = l & 255, e.head.os = l >> 8), e.flags & 512 && e.wrap & 4 && (R[0] = l & 255, R[1] = l >>> 8 & 255, e.check = H(e.check, R, 2, 0)), l = 0, d = 0, e.mode = hr;
        /* falls through */
        case hr:
          if (e.flags & 1024) {
            for (; d < 16; ) {
              if (n === 0)
                break e;
              n--, l += r[a++] << d, d += 8;
            }
            e.length = l, e.head && (e.head.extra_len = l), e.flags & 512 && e.wrap & 4 && (R[0] = l & 255, R[1] = l >>> 8 & 255, e.check = H(e.check, R, 2, 0)), l = 0, d = 0;
          } else e.head && (e.head.extra = null);
          e.mode = fr;
        /* falls through */
        case fr:
          if (e.flags & 1024 && (f = e.length, f > n && (f = n), f && (e.head && (w = e.head.extra_len - e.length, e.head.extra || (e.head.extra = new Uint8Array(e.head.extra_len)), e.head.extra.set(
            r.subarray(
              a,
              // extra field is limited to 65536 bytes
              // - no need for additional size check
              a + f
            ),
            /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
            w
          )), e.flags & 512 && e.wrap & 4 && (e.check = H(e.check, r, f, a)), n -= f, a += f, e.length -= f), e.length))
            break e;
          e.length = 0, e.mode = pr;
        /* falls through */
        case pr:
          if (e.flags & 2048) {
            if (n === 0)
              break e;
            f = 0;
            do
              w = r[a + f++], e.head && w && e.length < 65536 && (e.head.name += String.fromCharCode(w));
            while (w && f < n);
            if (e.flags & 512 && e.wrap & 4 && (e.check = H(e.check, r, f, a)), n -= f, a += f, w)
              break e;
          } else e.head && (e.head.name = null);
          e.length = 0, e.mode = ur;
        /* falls through */
        case ur:
          if (e.flags & 4096) {
            if (n === 0)
              break e;
            f = 0;
            do
              w = r[a + f++], e.head && w && e.length < 65536 && (e.head.comment += String.fromCharCode(w));
            while (w && f < n);
            if (e.flags & 512 && e.wrap & 4 && (e.check = H(e.check, r, f, a)), n -= f, a += f, w)
              break e;
          } else e.head && (e.head.comment = null);
          e.mode = mr;
        /* falls through */
        case mr:
          if (e.flags & 512) {
            for (; d < 16; ) {
              if (n === 0)
                break e;
              n--, l += r[a++] << d, d += 8;
            }
            if (e.wrap & 4 && l !== (e.check & 65535)) {
              i.msg = "header crc mismatch", e.mode = B;
              break;
            }
            l = 0, d = 0;
          }
          e.head && (e.head.hcrc = e.flags >> 9 & 1, e.head.done = !0), i.adler = e.check = 0, e.mode = me;
          break;
        case vr:
          for (; d < 32; ) {
            if (n === 0)
              break e;
            n--, l += r[a++] << d, d += 8;
          }
          i.adler = e.check = Ir(l), l = 0, d = 0, e.mode = Ft;
        /* falls through */
        case Ft:
          if (e.havedict === 0)
            return i.next_out = s, i.avail_out = c, i.next_in = a, i.avail_in = n, e.hold = l, e.bits = d, Sn;
          i.adler = e.check = 1, e.mode = me;
        /* falls through */
        case me:
          if (t === wn || t === kt)
            break e;
        /* falls through */
        case si:
          if (e.last) {
            l >>>= d & 7, d -= d & 7, e.mode = li;
            break;
          }
          for (; d < 3; ) {
            if (n === 0)
              break e;
            n--, l += r[a++] << d, d += 8;
          }
          switch (e.last = l & 1, l >>>= 1, d -= 1, l & 3) {
            case 0:
              e.mode = gr;
              break;
            case 1:
              if (Ln(e), e.mode = At, t === kt) {
                l >>>= 2, d -= 2;
                break e;
              }
              break;
            case 2:
              e.mode = br;
              break;
            case 3:
              i.msg = "invalid block type", e.mode = B;
          }
          l >>>= 2, d -= 2;
          break;
        case gr:
          for (l >>>= d & 7, d -= d & 7; d < 32; ) {
            if (n === 0)
              break e;
            n--, l += r[a++] << d, d += 8;
          }
          if ((l & 65535) !== (l >>> 16 ^ 65535)) {
            i.msg = "invalid stored block lengths", e.mode = B;
            break;
          }
          if (e.length = l & 65535, l = 0, d = 0, e.mode = ni, t === kt)
            break e;
        /* falls through */
        case ni:
          e.mode = _r;
        /* falls through */
        case _r:
          if (f = e.length, f) {
            if (f > n && (f = n), f > c && (f = c), f === 0)
              break e;
            o.set(r.subarray(a, a + f), s), n -= f, a += f, c -= f, s += f, e.length -= f;
            break;
          }
          e.mode = me;
          break;
        case br:
          for (; d < 14; ) {
            if (n === 0)
              break e;
            n--, l += r[a++] << d, d += 8;
          }
          if (e.nlen = (l & 31) + 257, l >>>= 5, d -= 5, e.ndist = (l & 31) + 1, l >>>= 5, d -= 5, e.ncode = (l & 15) + 4, l >>>= 4, d -= 4, e.nlen > 286 || e.ndist > 30) {
            i.msg = "too many length or distance symbols", e.mode = B;
            break;
          }
          e.have = 0, e.mode = yr;
        /* falls through */
        case yr:
          for (; e.have < e.ncode; ) {
            for (; d < 3; ) {
              if (n === 0)
                break e;
              n--, l += r[a++] << d, d += 8;
            }
            e.lens[Q[e.have++]] = l & 7, l >>>= 3, d -= 3;
          }
          for (; e.have < 19; )
            e.lens[Q[e.have++]] = 0;
          if (e.lencode = e.lendyn, e.lenbits = 7, T = { bits: e.lenbits }, I = lt(xn, e.lens, 0, 19, e.lencode, 0, e.work, T), e.lenbits = T.bits, I) {
            i.msg = "invalid code lengths set", e.mode = B;
            break;
          }
          e.have = 0, e.mode = xr;
        /* falls through */
        case xr:
          for (; e.have < e.nlen + e.ndist; ) {
            for (; x = e.lencode[l & (1 << e.lenbits) - 1], b = x >>> 24, E = x >>> 16 & 255, S = x & 65535, !(b <= d); ) {
              if (n === 0)
                break e;
              n--, l += r[a++] << d, d += 8;
            }
            if (S < 16)
              l >>>= b, d -= b, e.lens[e.have++] = S;
            else {
              if (S === 16) {
                for (C = b + 2; d < C; ) {
                  if (n === 0)
                    break e;
                  n--, l += r[a++] << d, d += 8;
                }
                if (l >>>= b, d -= b, e.have === 0) {
                  i.msg = "invalid bit length repeat", e.mode = B;
                  break;
                }
                w = e.lens[e.have - 1], f = 3 + (l & 3), l >>>= 2, d -= 2;
              } else if (S === 17) {
                for (C = b + 3; d < C; ) {
                  if (n === 0)
                    break e;
                  n--, l += r[a++] << d, d += 8;
                }
                l >>>= b, d -= b, w = 0, f = 3 + (l & 7), l >>>= 3, d -= 3;
              } else {
                for (C = b + 7; d < C; ) {
                  if (n === 0)
                    break e;
                  n--, l += r[a++] << d, d += 8;
                }
                l >>>= b, d -= b, w = 0, f = 11 + (l & 127), l >>>= 7, d -= 7;
              }
              if (e.have + f > e.nlen + e.ndist) {
                i.msg = "invalid bit length repeat", e.mode = B;
                break;
              }
              for (; f--; )
                e.lens[e.have++] = w;
            }
          }
          if (e.mode === B)
            break;
          if (e.lens[256] === 0) {
            i.msg = "invalid code -- missing end-of-block", e.mode = B;
            break;
          }
          if (e.lenbits = 9, T = { bits: e.lenbits }, I = lt(Lo, e.lens, 0, e.nlen, e.lencode, 0, e.work, T), e.lenbits = T.bits, I) {
            i.msg = "invalid literal/lengths set", e.mode = B;
            break;
          }
          if (e.distbits = 6, e.distcode = e.distdyn, T = { bits: e.distbits }, I = lt(Do, e.lens, e.nlen, e.ndist, e.distcode, 0, e.work, T), e.distbits = T.bits, I) {
            i.msg = "invalid distances set", e.mode = B;
            break;
          }
          if (e.mode = At, t === kt)
            break e;
        /* falls through */
        case At:
          e.mode = Tt;
        /* falls through */
        case Tt:
          if (n >= 6 && c >= 258) {
            i.next_out = s, i.avail_out = c, i.next_in = a, i.avail_in = n, e.hold = l, e.bits = d, mn(i, p), s = i.next_out, o = i.output, c = i.avail_out, a = i.next_in, r = i.input, n = i.avail_in, l = e.hold, d = e.bits, e.mode === me && (e.back = -1);
            break;
          }
          for (e.back = 0; x = e.lencode[l & (1 << e.lenbits) - 1], b = x >>> 24, E = x >>> 16 & 255, S = x & 65535, !(b <= d); ) {
            if (n === 0)
              break e;
            n--, l += r[a++] << d, d += 8;
          }
          if (E && (E & 240) === 0) {
            for (m = b, k = E, O = S; x = e.lencode[O + ((l & (1 << m + k) - 1) >> m)], b = x >>> 24, E = x >>> 16 & 255, S = x & 65535, !(m + b <= d); ) {
              if (n === 0)
                break e;
              n--, l += r[a++] << d, d += 8;
            }
            l >>>= m, d -= m, e.back += m;
          }
          if (l >>>= b, d -= b, e.back += b, e.length = S, E === 0) {
            e.mode = Ar;
            break;
          }
          if (E & 32) {
            e.back = -1, e.mode = me;
            break;
          }
          if (E & 64) {
            i.msg = "invalid literal/length code", e.mode = B;
            break;
          }
          e.extra = E & 15, e.mode = wr;
        /* falls through */
        case wr:
          if (e.extra) {
            for (C = e.extra; d < C; ) {
              if (n === 0)
                break e;
              n--, l += r[a++] << d, d += 8;
            }
            e.length += l & (1 << e.extra) - 1, l >>>= e.extra, d -= e.extra, e.back += e.extra;
          }
          e.was = e.length, e.mode = Er;
        /* falls through */
        case Er:
          for (; x = e.distcode[l & (1 << e.distbits) - 1], b = x >>> 24, E = x >>> 16 & 255, S = x & 65535, !(b <= d); ) {
            if (n === 0)
              break e;
            n--, l += r[a++] << d, d += 8;
          }
          if ((E & 240) === 0) {
            for (m = b, k = E, O = S; x = e.distcode[O + ((l & (1 << m + k) - 1) >> m)], b = x >>> 24, E = x >>> 16 & 255, S = x & 65535, !(m + b <= d); ) {
              if (n === 0)
                break e;
              n--, l += r[a++] << d, d += 8;
            }
            l >>>= m, d -= m, e.back += m;
          }
          if (l >>>= b, d -= b, e.back += b, E & 64) {
            i.msg = "invalid distance code", e.mode = B;
            break;
          }
          e.offset = S, e.extra = E & 15, e.mode = Sr;
        /* falls through */
        case Sr:
          if (e.extra) {
            for (C = e.extra; d < C; ) {
              if (n === 0)
                break e;
              n--, l += r[a++] << d, d += 8;
            }
            e.offset += l & (1 << e.extra) - 1, l >>>= e.extra, d -= e.extra, e.back += e.extra;
          }
          if (e.offset > e.dmax) {
            i.msg = "invalid distance too far back", e.mode = B;
            break;
          }
          e.mode = kr;
        /* falls through */
        case kr:
          if (c === 0)
            break e;
          if (f = p - c, e.offset > f) {
            if (f = e.offset - f, f > e.whave && e.sane) {
              i.msg = "invalid distance too far back", e.mode = B;
              break;
            }
            f > e.wnext ? (f -= e.wnext, _ = e.wsize - f) : _ = e.wnext - f, f > e.length && (f = e.length), y = e.window;
          } else
            y = o, _ = s - e.offset, f = e.length;
          f > c && (f = c), c -= f, e.length -= f;
          do
            o[s++] = y[_++];
          while (--f);
          e.length === 0 && (e.mode = Tt);
          break;
        case Ar:
          if (c === 0)
            break e;
          o[s++] = e.length, c--, e.mode = Tt;
          break;
        case li:
          if (e.wrap) {
            for (; d < 32; ) {
              if (n === 0)
                break e;
              n--, l |= r[a++] << d, d += 8;
            }
            if (p -= c, i.total_out += p, e.total += p, e.wrap & 4 && p && (i.adler = e.check = /*UPDATE_CHECK(state.check, put - _out, _out);*/
            e.flags ? H(e.check, o, p, s - p) : mt(e.check, o, p, s - p)), p = c, e.wrap & 4 && (e.flags ? l : Ir(l)) !== e.check) {
              i.msg = "incorrect data check", e.mode = B;
              break;
            }
            l = 0, d = 0;
          }
          e.mode = Tr;
        /* falls through */
        case Tr:
          if (e.wrap && e.flags) {
            for (; d < 32; ) {
              if (n === 0)
                break e;
              n--, l += r[a++] << d, d += 8;
            }
            if (e.wrap & 4 && l !== (e.total & 4294967295)) {
              i.msg = "incorrect length check", e.mode = B;
              break;
            }
            l = 0, d = 0;
          }
          e.mode = Cr;
        /* falls through */
        case Cr:
          I = En;
          break e;
        case B:
          I = Oo;
          break e;
        case Fo:
          return Po;
        case Bo:
        /* falls through */
        default:
          return re;
      }
  return i.next_out = s, i.avail_out = c, i.next_in = a, i.avail_in = n, e.hold = l, e.bits = d, (e.wsize || p !== i.avail_out && e.mode < B && (e.mode < li || t !== sr)) && Ho(i, i.output, i.next_out, p - i.avail_out), v -= i.avail_in, p -= i.avail_out, i.total_in += v, i.total_out += p, e.total += p, e.wrap & 4 && p && (i.adler = e.check = /*UPDATE_CHECK(state.check, strm.next_out - _out, _out);*/
  e.flags ? H(e.check, o, p, i.next_out - p) : mt(e.check, o, p, i.next_out - p)), i.data_type = e.bits + (e.last ? 64 : 0) + (e.mode === me ? 128 : 0) + (e.mode === At || e.mode === ni ? 256 : 0), (v === 0 && p === 0 || t === sr) && I === Be && (I = kn), I;
}, On = (i) => {
  if (Me(i))
    return re;
  let t = i.state;
  return t.window && (t.window = null), i.state = null, Be;
}, Pn = (i, t) => {
  if (Me(i))
    return re;
  const e = i.state;
  return (e.wrap & 2) === 0 ? re : (e.head = t, t.done = !1, Be);
}, Fn = (i, t) => {
  const e = t.length;
  let r, o, a;
  return Me(i) || (r = i.state, r.wrap !== 0 && r.mode !== Ft) ? re : r.mode === Ft && (o = 1, o = mt(o, t, e, 0), o !== r.check) ? Oo : (a = Ho(i, t, e, e), a ? (r.mode = Fo, Po) : (r.havedict = 1, Be));
};
var Bn = Mo, zn = Uo, Mn = zo, Un = $n, Nn = No, Hn = Dn, Zn = On, Vn = Pn, Wn = Fn, qn = "pako inflate (from Nodeca project)", ge = {
  inflateReset: Bn,
  inflateReset2: zn,
  inflateResetKeep: Mn,
  inflateInit: Un,
  inflateInit2: Nn,
  inflate: Hn,
  inflateEnd: Zn,
  inflateGetHeader: Vn,
  inflateSetDictionary: Wn,
  inflateInfo: qn
};
function Gn() {
  this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
}
var Kn = Gn;
const Zo = Object.prototype.toString, {
  Z_NO_FLUSH: Yn,
  Z_FINISH: jn,
  Z_OK: _t,
  Z_STREAM_END: hi,
  Z_NEED_DICT: fi,
  Z_STREAM_ERROR: Xn,
  Z_DATA_ERROR: $r,
  Z_MEM_ERROR: Jn
} = Ht;
function Gt(i) {
  this.options = Vt.assign({
    chunkSize: 1024 * 64,
    windowBits: 15,
    to: ""
  }, i || {});
  const t = this.options;
  t.raw && t.windowBits >= 0 && t.windowBits < 16 && (t.windowBits = -t.windowBits, t.windowBits === 0 && (t.windowBits = -15)), t.windowBits >= 0 && t.windowBits < 16 && !(i && i.windowBits) && (t.windowBits += 32), t.windowBits > 15 && t.windowBits < 48 && (t.windowBits & 15) === 0 && (t.windowBits |= 15), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new Ro(), this.strm.avail_out = 0;
  let e = ge.inflateInit2(
    this.strm,
    t.windowBits
  );
  if (e !== _t)
    throw new Error(qe[e]);
  if (this.header = new Kn(), ge.inflateGetHeader(this.strm, this.header), t.dictionary && (typeof t.dictionary == "string" ? t.dictionary = gt.string2buf(t.dictionary) : Zo.call(t.dictionary) === "[object ArrayBuffer]" && (t.dictionary = new Uint8Array(t.dictionary)), t.raw && (e = ge.inflateSetDictionary(this.strm, t.dictionary), e !== _t)))
    throw new Error(qe[e]);
}
Gt.prototype.push = function(i, t) {
  const e = this.strm, r = this.options.chunkSize, o = this.options.dictionary;
  let a, s, n;
  if (this.ended) return !1;
  for (t === ~~t ? s = t : s = t === !0 ? jn : Yn, Zo.call(i) === "[object ArrayBuffer]" ? e.input = new Uint8Array(i) : e.input = i, e.next_in = 0, e.avail_in = e.input.length; ; ) {
    for (e.avail_out === 0 && (e.output = new Uint8Array(r), e.next_out = 0, e.avail_out = r), a = ge.inflate(e, s), a === fi && o && (a = ge.inflateSetDictionary(e, o), a === _t ? a = ge.inflate(e, s) : a === $r && (a = fi)); e.avail_in > 0 && a === hi && e.state.wrap > 0 && i[e.next_in] !== 0; )
      ge.inflateReset(e), a = ge.inflate(e, s);
    switch (a) {
      case Xn:
      case $r:
      case fi:
      case Jn:
        return this.onEnd(a), this.ended = !0, !1;
    }
    if (n = e.avail_out, e.next_out && (e.avail_out === 0 || a === hi))
      if (this.options.to === "string") {
        let c = gt.utf8border(e.output, e.next_out), l = e.next_out - c, d = gt.buf2string(e.output, c);
        e.next_out = l, e.avail_out = r - l, l && e.output.set(e.output.subarray(c, c + l), 0), this.onData(d);
      } else
        this.onData(e.output.length === e.next_out ? e.output : e.output.subarray(0, e.next_out));
    if (!(a === _t && n === 0)) {
      if (a === hi)
        return a = ge.inflateEnd(this.strm), this.onEnd(a), this.ended = !0, !0;
      if (e.avail_in === 0) break;
    }
  }
  return !0;
};
Gt.prototype.onData = function(i) {
  this.chunks.push(i);
};
Gt.prototype.onEnd = function(i) {
  i === _t && (this.options.to === "string" ? this.result = this.chunks.join("") : this.result = Vt.flattenChunks(this.chunks)), this.chunks = [], this.err = i, this.msg = this.strm.msg;
};
var Qn = Gt, el = {
  Inflate: Qn
};
const { deflate: tl } = pn, { Inflate: il } = el;
var rl = tl, ol = il;
class Hi {
  constructor(t, e = !1, r = !0) {
    this.device = t, this.tracing = e, this.slipReaderEnabled = !1, this.baudrate = 0, this.traceLog = "", this.lastTraceTime = Date.now(), this.buffer = new Uint8Array(0), this.SLIP_END = 192, this.SLIP_ESC = 219, this.SLIP_ESC_END = 220, this.SLIP_ESC_ESC = 221, this._DTR_state = !1, this.slipReaderEnabled = r;
  }
  /**
   * Request the serial device vendor ID and Product ID as string.
   * @returns {string} Return the device VendorID and ProductID from SerialPortInfo as formatted string.
   */
  getInfo() {
    const t = this.device.getInfo();
    return t.usbVendorId && t.usbProductId ? `WebSerial VendorID 0x${t.usbVendorId.toString(16)} ProductID 0x${t.usbProductId.toString(16)}` : "";
  }
  /**
   * Request the serial device product id from SerialPortInfo.
   * @returns {number | undefined} Return the product ID.
   */
  getPid() {
    return this.device.getInfo().usbProductId;
  }
  /**
   * Format received or sent data for tracing output.
   * @param {string} message Message to format as trace line.
   */
  trace(t) {
    const o = `${`TRACE ${(Date.now() - this.lastTraceTime).toFixed(3)}`} ${t}`;
    console.log(o), this.traceLog += o + `
`;
  }
  async returnTrace() {
    try {
      await navigator.clipboard.writeText(this.traceLog), console.log("Text copied to clipboard!");
    } catch (t) {
      console.error("Failed to copy text:", t);
    }
  }
  hexify(t) {
    return Array.from(t).map((e) => e.toString(16).padStart(2, "0")).join("").padEnd(16, " ");
  }
  hexConvert(t, e = !0) {
    if (e && t.length > 16) {
      let r = "", o = t;
      for (; o.length > 0; ) {
        const a = o.slice(0, 16), s = String.fromCharCode(...a).split("").map((n) => n === " " || n >= " " && n <= "~" && n !== "  " ? n : ".").join("");
        o = o.slice(16), r += `
    ${this.hexify(a.slice(0, 8))} ${this.hexify(a.slice(8))} | ${s}`;
      }
      return r;
    } else
      return this.hexify(t);
  }
  /**
   * Format data packet using the Serial Line Internet Protocol (SLIP).
   * @param {Uint8Array} data Binary unsigned 8 bit array data to format.
   * @returns {Uint8Array} Formatted unsigned 8 bit data array.
   */
  slipWriter(t) {
    const e = [];
    e.push(192);
    for (let r = 0; r < t.length; r++)
      t[r] === 219 ? e.push(219, 221) : t[r] === 192 ? e.push(219, 220) : e.push(t[r]);
    return e.push(192), new Uint8Array(e);
  }
  /**
   * Write binary data to device using the WebSerial device writable stream.
   * @param {Uint8Array} data 8 bit unsigned data array to write to device.
   */
  async write(t) {
    const e = this.slipWriter(t);
    if (this.device.writable) {
      const r = this.device.writable.getWriter();
      this.tracing && (console.log("Write bytes"), this.trace(`Write ${e.length} bytes: ${this.hexConvert(e)}`)), await r.write(e), r.releaseLock();
    }
  }
  /**
   * Append a buffer array after another buffer array
   * @param {Uint8Array} arr1 - First array buffer.
   * @param {Uint8Array} arr2 - magic hex number to select ROM.
   * @returns {Uint8Array} Return a 8 bit unsigned array.
   */
  appendArray(t, e) {
    const r = new Uint8Array(t.length + e.length);
    return r.set(t), r.set(e, t.length), r;
  }
  // Asynchronous generator to yield incoming data chunks
  async *readLoop(t) {
    if (this.reader)
      try {
        for (; ; ) {
          const e = new Promise((s, n) => setTimeout(() => n(new Error("Read timeout exceeded")), t)), r = await Promise.race([this.reader.read(), e]);
          if (r === null)
            break;
          const { value: o, done: a } = r;
          if (a || !o)
            break;
          yield o;
        }
      } catch (e) {
        console.error("Error reading from serial port:", e);
      } finally {
        this.buffer = new Uint8Array(0);
      }
  }
  // Read a specific number of bytes
  async newRead(t, e) {
    if (this.buffer.length >= t) {
      const o = this.buffer.slice(0, t);
      return this.buffer = this.buffer.slice(t), o;
    }
    for (; this.buffer.length < t; ) {
      const o = this.readLoop(e), { value: a, done: s } = await o.next();
      if (s || !a)
        break;
      this.buffer = this.appendArray(this.buffer, a);
    }
    const r = this.buffer.slice(0, t);
    return this.buffer = this.buffer.slice(t), r;
  }
  async flushInput() {
    var t;
    this.reader && !await this.reader.closed && (await this.reader.cancel(), this.reader.releaseLock(), this.reader = (t = this.device.readable) === null || t === void 0 ? void 0 : t.getReader());
  }
  async flushOutput() {
    var t, e;
    this.buffer = new Uint8Array(0), await ((t = this.device.writable) === null || t === void 0 ? void 0 : t.getWriter().close()), (e = this.device.writable) === null || e === void 0 || e.getWriter().releaseLock();
  }
  // `inWaiting` returns the count of bytes in the buffer
  inWaiting() {
    return this.buffer.length;
  }
  /**
   * Detect if the data read from device is a Fatal or Guru meditation error.
   * @param {Uint8Array} input Data read from device
   */
  detectPanicHandler(t) {
    const e = /G?uru Meditation Error: (?:Core \d panic'ed \(([a-zA-Z ]*)\))?/, r = /F?atal exception \(\d+\): (?:([a-zA-Z ]*)?.*epc)?/, o = new TextDecoder("utf-8").decode(t), a = o.match(e) || o.match(r);
    if (a) {
      const s = a[1] || a[2], n = `Guru Meditation Error detected${s ? ` (${s})` : ""}`;
      throw new Error(n);
    }
  }
  /**
   * Take a data array and return the first well formed packet after
   * replacing the escape sequence. Reads at least 8 bytes.
   * @param {number} timeout Timeout read data.
   * @yields {Uint8Array} Formatted packet using SLIP escape sequences.
   */
  async *read(t) {
    var e;
    this.reader || (this.reader = (e = this.device.readable) === null || e === void 0 ? void 0 : e.getReader());
    let r = null, o = !1, a = !1;
    for (; ; ) {
      const s = this.inWaiting(), n = await this.newRead(s > 0 ? s : 1, t);
      if (!n || n.length === 0) {
        const l = r === null ? a ? "Serial data stream stopped: Possible serial noise or corruption." : "No serial data received." : "Packet content transfer stopped";
        throw this.trace(l), new Error(l);
      }
      this.trace(`Read ${n.length} bytes: ${this.hexConvert(n)}`);
      let c = 0;
      for (; c < n.length; ) {
        const l = n[c++];
        if (r === null)
          if (l === this.SLIP_END)
            r = new Uint8Array(0);
          else {
            this.trace(`Read invalid data: ${this.hexConvert(n)}`);
            const d = await this.newRead(this.inWaiting(), t);
            throw this.trace(`Remaining data in serial buffer: ${this.hexConvert(d)}`), this.detectPanicHandler(new Uint8Array([...n, ...d || []])), new Error(`Invalid head of packet (0x${l.toString(16)}): Possible serial noise or corruption.`);
          }
        else if (o)
          if (o = !1, l === this.SLIP_ESC_END)
            r = this.appendArray(r, new Uint8Array([this.SLIP_END]));
          else if (l === this.SLIP_ESC_ESC)
            r = this.appendArray(r, new Uint8Array([this.SLIP_ESC]));
          else {
            this.trace(`Read invalid data: ${this.hexConvert(n)}`);
            const d = await this.newRead(this.inWaiting(), t);
            throw this.trace(`Remaining data in serial buffer: ${this.hexConvert(d)}`), this.detectPanicHandler(new Uint8Array([...n, ...d || []])), new Error(`Invalid SLIP escape (0xdb, 0x${l.toString(16)})`);
          }
        else l === this.SLIP_ESC ? o = !0 : l === this.SLIP_END ? (this.trace(`Received full packet: ${this.hexConvert(r)}`), this.buffer = this.appendArray(this.buffer, n.slice(c)), yield r, r = null, a = !0) : r = this.appendArray(r, new Uint8Array([l]));
      }
    }
  }
  /**
   * Read from serial device without slip formatting.
   * @yields {Uint8Array} The next number in the Fibonacci sequence.
   */
  async *rawRead() {
    if (this.reader)
      try {
        for (; ; ) {
          const { value: t, done: e } = await this.reader.read();
          if (e || !t)
            break;
          this.tracing && (console.log("Raw Read bytes"), this.trace(`Read ${t.length} bytes: ${this.hexConvert(t)}`)), yield t;
        }
      } catch (t) {
        console.error("Error reading from serial port:", t);
      } finally {
        this.buffer = new Uint8Array(0);
      }
  }
  /**
   * Send the RequestToSend (RTS) signal to given state
   * # True for EN=LOW, chip in reset and False EN=HIGH, chip out of reset
   * @param {boolean} state Boolean state to set the signal
   */
  async setRTS(t) {
    await this.device.setSignals({ requestToSend: t }), await this.setDTR(this._DTR_state);
  }
  /**
   * Send the dataTerminalReady (DTS) signal to given state
   * # True for IO0=LOW, chip in reset and False IO0=HIGH
   * @param {boolean} state Boolean state to set the signal
   */
  async setDTR(t) {
    this._DTR_state = t, await this.device.setSignals({ dataTerminalReady: t });
  }
  /**
   * Connect to serial device using the Webserial open method.
   * @param {number} baud Number baud rate for serial connection. Default is 115200.
   * @param {typeof import("w3c-web-serial").SerialOptions} serialOptions Serial Options for WebUSB SerialPort class.
   */
  async connect(t = 115200, e = {}) {
    var r;
    await this.device.open({
      baudRate: t,
      dataBits: e?.dataBits,
      stopBits: e?.stopBits,
      bufferSize: e?.bufferSize,
      parity: e?.parity,
      flowControl: e?.flowControl
    }), this.baudrate = t, this.reader = (r = this.device.readable) === null || r === void 0 ? void 0 : r.getReader();
  }
  async sleep(t) {
    return new Promise((e) => setTimeout(e, t));
  }
  /**
   * Wait for a given timeout ms for serial device unlock.
   * @param {number} timeout Timeout time in milliseconds (ms) to sleep
   */
  async waitForUnlock(t) {
    for (; this.device.readable && this.device.readable.locked || this.device.writable && this.device.writable.locked; )
      await this.sleep(t);
  }
  /**
   * Disconnect from serial device by running SerialPort.close() after streams unlock.
   */
  async disconnect() {
    var t, e;
    !((t = this.device.readable) === null || t === void 0) && t.locked && await ((e = this.reader) === null || e === void 0 ? void 0 : e.cancel()), await this.waitForUnlock(400), await this.device.close(), this.reader = void 0;
  }
}
function _e(i) {
  return new Promise((t) => setTimeout(t, i));
}
class al {
  constructor(t, e) {
    this.resetDelay = e, this.transport = t;
  }
  async reset() {
    await this.transport.setDTR(!1), await this.transport.setRTS(!0), await _e(100), await this.transport.setDTR(!0), await this.transport.setRTS(!1), await _e(this.resetDelay), await this.transport.setDTR(!1);
  }
}
class sl {
  constructor(t) {
    this.transport = t;
  }
  async reset() {
    await this.transport.setRTS(!1), await this.transport.setDTR(!1), await _e(100), await this.transport.setDTR(!0), await this.transport.setRTS(!1), await _e(100), await this.transport.setRTS(!0), await this.transport.setDTR(!1), await this.transport.setRTS(!0), await _e(100), await this.transport.setRTS(!1), await this.transport.setDTR(!1);
  }
}
class Vo {
  constructor(t, e = !1) {
    this.transport = t, this.usingUsbOtg = e, this.transport = t;
  }
  async reset() {
    this.usingUsbOtg ? (await _e(200), await this.transport.setRTS(!1), await _e(200)) : (await _e(100), await this.transport.setRTS(!1));
  }
}
function nl(i) {
  const t = ["D", "R", "W"], e = i.split("|");
  for (const r of e) {
    const o = r[0], a = r.slice(1);
    if (!t.includes(o))
      return !1;
    if (o === "D" || o === "R") {
      if (a !== "0" && a !== "1")
        return !1;
    } else if (o === "W") {
      const s = parseInt(a);
      if (isNaN(s) || s <= 0)
        return !1;
    }
  }
  return !0;
}
class ll {
  constructor(t, e) {
    this.transport = t, this.sequenceString = e, this.transport = t;
  }
  async reset() {
    const t = {
      D: async (e) => await this.transport.setDTR(e),
      R: async (e) => await this.transport.setRTS(e),
      W: async (e) => await _e(e)
    };
    try {
      if (!nl(this.sequenceString))
        return;
      const r = this.sequenceString.split("|");
      for (const o of r) {
        const a = o[0], s = o.slice(1);
        a === "W" ? await t.W(Number(s)) : (a === "D" || a === "R") && await t[a](s === "1");
      }
    } catch {
      throw new Error("Invalid custom reset sequence");
    }
  }
}
function dl(i) {
  return i && i.__esModule && Object.prototype.hasOwnProperty.call(i, "default") ? i.default : i;
}
var pi, Lr;
function cl() {
  return Lr || (Lr = 1, pi = function(t) {
    return atob(t);
  }), pi;
}
var hl = cl();
const fl = /* @__PURE__ */ dl(hl);
async function Dr(i) {
  let t;
  switch (i) {
    case "ESP32":
      t = await import("./stub_flasher_32-De6IF1qQ.js");
      break;
    case "ESP32-C2":
      t = await import("./stub_flasher_32c2-CmtEGinQ.js");
      break;
    case "ESP32-C3":
      t = await import("./stub_flasher_32c3-COF1MpA-.js");
      break;
    case "ESP32-C5":
      t = await import("./stub_flasher_32c5-GHbIm_2R.js");
      break;
    case "ESP32-C6":
      t = await import("./stub_flasher_32c6-DMu7FFpT.js");
      break;
    case "ESP32-C61":
      t = await import("./stub_flasher_32c61-Dim6JJZL.js");
      break;
    case "ESP32-H2":
      t = await import("./stub_flasher_32h2-DIR5HfOk.js");
      break;
    case "ESP32-P4":
      t = await import("./stub_flasher_32p4-CO-dEff4.js");
      break;
    case "ESP32-S2":
      t = await import("./stub_flasher_32s2-D_F_EHOa.js");
      break;
    case "ESP32-S3":
      t = await import("./stub_flasher_32s3-TO1nm7HD.js");
      break;
    case "ESP8266":
      t = await import("./stub_flasher_8266-DGKFSU-5.js");
      break;
  }
  if (t)
    return {
      bss_start: t.bss_start,
      data: t.data,
      data_start: t.data_start,
      entry: t.entry,
      text: t.text,
      text_start: t.text_start,
      decodedData: Or(t.data),
      decodedText: Or(t.text)
    };
}
function Or(i) {
  const e = fl(i).split("").map(function(r) {
    return r.charCodeAt(0);
  });
  return new Uint8Array(e);
}
function pl(i, t, e = 255) {
  const r = i.length % t;
  if (r !== 0) {
    const o = new Uint8Array(t - r).fill(e), a = new Uint8Array(i.length + o.length);
    return a.set(i), a.set(o, i.length), a;
  }
  return i;
}
async function ul(i) {
  switch (i) {
    case 15736195: {
      const { ESP32ROM: t } = await import("./esp32-CYjGtft5.js");
      return new t();
    }
    case 203546735:
    case 1867591791:
    case 2084675695: {
      const { ESP32C2ROM: t } = await import("./esp32c2-oe9rArpZ.js");
      return new t();
    }
    case 1763790959:
    case 456216687:
    case 1216438383:
    case 1130455151: {
      const { ESP32C3ROM: t } = await import("./esp32c3-CU68Ac5H.js");
      return new t();
    }
    case 752910447: {
      const { ESP32C6ROM: t } = await import("./esp32c6-Cld3wX56.js");
      return new t();
    }
    case 606167151:
    case 871374959:
    case 1333878895: {
      const { ESP32C61ROM: t } = await import("./esp32c61-xD8INJn_.js");
      return new t();
    }
    case 285294703:
    case 1675706479:
    case 1607549039: {
      const { ESP32C5ROM: t } = await import("./esp32c5-Uh9ky-0X.js");
      return new t();
    }
    case 3619110528:
    case 2548236392: {
      const { ESP32H2ROM: t } = await import("./esp32h2-BQM869UW.js");
      return new t();
    }
    case 9: {
      const { ESP32S3ROM: t } = await import("./esp32s3-BqRtXJZ0.js");
      return new t();
    }
    case 1990: {
      const { ESP32S2ROM: t } = await import("./esp32s2-CQxBRhHc.js");
      return new t();
    }
    case 4293968129: {
      const { ESP8266ROM: t } = await import("./esp8266-zRGw-VBo.js");
      return new t();
    }
    case 0:
    case 182303440:
    case 117676761: {
      const { ESP32P4ROM: t } = await import("./esp32p4-Bva6p5tS.js");
      return new t();
    }
    default:
      return null;
  }
}
class ml {
  /**
   * Create a new ESPLoader to perform serial communication
   * such as read/write flash memory and registers using a LoaderOptions object.
   * @param {LoaderOptions} options - LoaderOptions object argument for ESPLoader.
   * ```
   * const myLoader = new ESPLoader({ transport: Transport, baudrate: number, terminal?: IEspLoaderTerminal });
   * ```
   */
  constructor(t) {
    var e, r, o, a, s, n, c, l;
    this.ESP_RAM_BLOCK = 6144, this.ESP_FLASH_BEGIN = 2, this.ESP_FLASH_DATA = 3, this.ESP_FLASH_END = 4, this.ESP_MEM_BEGIN = 5, this.ESP_MEM_END = 6, this.ESP_MEM_DATA = 7, this.ESP_WRITE_REG = 9, this.ESP_READ_REG = 10, this.ESP_SPI_ATTACH = 13, this.ESP_CHANGE_BAUDRATE = 15, this.ESP_FLASH_DEFL_BEGIN = 16, this.ESP_FLASH_DEFL_DATA = 17, this.ESP_FLASH_DEFL_END = 18, this.ESP_SPI_FLASH_MD5 = 19, this.ESP_ERASE_FLASH = 208, this.ESP_ERASE_REGION = 209, this.ESP_READ_FLASH = 210, this.ESP_RUN_USER_CODE = 211, this.ESP_IMAGE_MAGIC = 233, this.ESP_CHECKSUM_MAGIC = 239, this.ROM_INVALID_RECV_MSG = 5, this.DEFAULT_TIMEOUT = 3e3, this.ERASE_REGION_TIMEOUT_PER_MB = 3e4, this.ERASE_WRITE_TIMEOUT_PER_MB = 4e4, this.MD5_TIMEOUT_PER_MB = 8e3, this.CHIP_ERASE_TIMEOUT = 12e4, this.FLASH_READ_TIMEOUT = 1e5, this.MAX_TIMEOUT = this.CHIP_ERASE_TIMEOUT * 2, this.CHIP_DETECT_MAGIC_REG_ADDR = 1073745920, this.DETECTED_FLASH_SIZES = {
      18: "256KB",
      19: "512KB",
      20: "1MB",
      21: "2MB",
      22: "4MB",
      23: "8MB",
      24: "16MB"
    }, this.DETECTED_FLASH_SIZES_NUM = {
      18: 256,
      19: 512,
      20: 1024,
      21: 2048,
      22: 4096,
      23: 8192,
      24: 16384
    }, this.USB_JTAG_SERIAL_PID = 4097, this.romBaudrate = 115200, this.debugLogging = !1, this.syncStubDetected = !1, this.flashSizeBytes = function(d) {
      let v = -1;
      return d.indexOf("KB") !== -1 ? v = parseInt(d.slice(0, d.indexOf("KB"))) * 1024 : d.indexOf("MB") !== -1 && (v = parseInt(d.slice(0, d.indexOf("MB"))) * 1024 * 1024), v;
    }, this.IS_STUB = !1, this.FLASH_WRITE_SIZE = 16384, this.transport = t.transport, this.baudrate = t.baudrate, this.resetConstructors = {
      classicReset: (d, v) => new al(d, v),
      customReset: (d, v) => new ll(d, v),
      hardReset: (d, v) => new Vo(d, v),
      usbJTAGSerialReset: (d) => new sl(d)
    }, t.serialOptions && (this.serialOptions = t.serialOptions), t.romBaudrate && (this.romBaudrate = t.romBaudrate), t.terminal && (this.terminal = t.terminal, this.terminal.clean()), typeof t.debugLogging < "u" && (this.debugLogging = t.debugLogging), t.port && (this.transport = new Hi(t.port)), typeof t.enableTracing < "u" && (this.transport.tracing = t.enableTracing), !((e = t.resetConstructors) === null || e === void 0) && e.classicReset && (this.resetConstructors.classicReset = (r = t.resetConstructors) === null || r === void 0 ? void 0 : r.classicReset), !((o = t.resetConstructors) === null || o === void 0) && o.customReset && (this.resetConstructors.customReset = (a = t.resetConstructors) === null || a === void 0 ? void 0 : a.customReset), !((s = t.resetConstructors) === null || s === void 0) && s.hardReset && (this.resetConstructors.hardReset = (n = t.resetConstructors) === null || n === void 0 ? void 0 : n.hardReset), !((c = t.resetConstructors) === null || c === void 0) && c.usbJTAGSerialReset && (this.resetConstructors.usbJTAGSerialReset = (l = t.resetConstructors) === null || l === void 0 ? void 0 : l.usbJTAGSerialReset), this.info("esptool.js"), this.info("Serial port " + this.transport.getInfo());
  }
  _sleep(t) {
    return new Promise((e) => setTimeout(e, t));
  }
  /**
   * Write to ESP Loader constructor's terminal with or without new line.
   * @param {string} str - String to write.
   * @param {boolean} withNewline - Add new line at the end ?
   */
  write(t, e = !0) {
    this.terminal ? e ? this.terminal.writeLine(t) : this.terminal.write(t) : console.log(t);
  }
  /**
   * Write error message to ESP Loader constructor's terminal with or without new line.
   * @param {string} str - String to write.
   * @param {boolean} withNewline - Add new line at the end ?
   */
  error(t, e = !0) {
    this.write(`Error: ${t}`, e);
  }
  /**
   * Write information message to ESP Loader constructor's terminal with or without new line.
   * @param {string} str - String to write.
   * @param {boolean} withNewline - Add new line at the end ?
   */
  info(t, e = !0) {
    this.write(t, e);
  }
  /**
   * Write debug message to ESP Loader constructor's terminal with or without new line.
   * @param {string} str - String to write.
   * @param {boolean} withNewline - Add new line at the end ?
   */
  debug(t, e = !0) {
    this.debugLogging && this.write(`Debug: ${t}`, e);
  }
  /**
   * Convert short integer to byte array
   * @param {number} i - Number to convert.
   * @returns {Uint8Array} Byte array.
   */
  _shortToBytearray(t) {
    return new Uint8Array([t & 255, t >> 8 & 255]);
  }
  /**
   * Convert an integer to byte array
   * @param {number} i - Number to convert.
   * @returns {ROM} The chip ROM class related to given magic hex number.
   */
  _intToByteArray(t) {
    return new Uint8Array([t & 255, t >> 8 & 255, t >> 16 & 255, t >> 24 & 255]);
  }
  /**
   * Convert a byte array to short integer.
   * @param {number} i - Number to convert.
   * @param {number} j - Number to convert.
   * @returns {number} Return a short integer number.
   */
  _byteArrayToShort(t, e) {
    return t | e >> 8;
  }
  /**
   * Convert a byte array to integer.
   * @param {number} i - Number to convert.
   * @param {number} j - Number to convert.
   * @param {number} k - Number to convert.
   * @param {number} l - Number to convert.
   * @returns {number} Return a integer number.
   */
  _byteArrayToInt(t, e, r, o) {
    return t | e << 8 | r << 16 | o << 24;
  }
  /**
   * Append a buffer array after another buffer array
   * @param {ArrayBuffer} buffer1 - First array buffer.
   * @param {ArrayBuffer} buffer2 - magic hex number to select ROM.
   * @returns {ArrayBufferLike} Return an array buffer.
   */
  _appendBuffer(t, e) {
    const r = new Uint8Array(t.byteLength + e.byteLength);
    return r.set(new Uint8Array(t), 0), r.set(new Uint8Array(e), t.byteLength), r.buffer;
  }
  /**
   * Append a buffer array after another buffer array
   * @param {Uint8Array} arr1 - First array buffer.
   * @param {Uint8Array} arr2 - magic hex number to select ROM.
   * @returns {Uint8Array} Return a 8 bit unsigned array.
   */
  _appendArray(t, e) {
    const r = new Uint8Array(t.length + e.length);
    return r.set(t, 0), r.set(e, t.length), r;
  }
  /**
   * Convert a unsigned 8 bit integer array to byte string.
   * @param {Uint8Array} u8Array - magic hex number to select ROM.
   * @returns {string} Return the equivalent string.
   */
  ui8ToBstr(t) {
    let e = "";
    for (let r = 0; r < t.length; r++)
      e += String.fromCharCode(t[r]);
    return e;
  }
  /**
   * Convert a byte string to unsigned 8 bit integer array.
   * @param {string} bStr - binary string input
   * @returns {Uint8Array} Return a 8 bit unsigned integer array.
   */
  bstrToUi8(t) {
    const e = new Uint8Array(t.length);
    for (let r = 0; r < t.length; r++)
      e[r] = t.charCodeAt(r);
    return e;
  }
  /**
   * Flush the serial input by raw read with 200 ms timeout.
   */
  async flushInput() {
    try {
      await this.transport.flushInput();
    } catch (t) {
      this.error(t.message);
    }
  }
  /**
   * Use the device serial port read function with given timeout to create a valid packet.
   * @param {number} op Operation number
   * @param {number} timeout timeout number in milliseconds
   * @returns {[number, Uint8Array]} valid response packet.
   */
  async readPacket(t = null, e = this.DEFAULT_TIMEOUT) {
    for (let r = 0; r < 100; r++) {
      const { value: o } = await this.transport.read(e).next();
      if (!o || o.length < 8)
        continue;
      const a = o[0];
      if (a !== 1)
        continue;
      const s = o[1], n = this._byteArrayToInt(o[4], o[5], o[6], o[7]), c = o.slice(8);
      if (a == 1) {
        if (t == null || s == t)
          return [n, c];
        if (c[0] != 0 && c[1] == this.ROM_INVALID_RECV_MSG)
          throw await this.flushInput(), new W("unsupported command error");
      }
    }
    throw new W("invalid response");
  }
  /**
   * Write a serial command to the chip
   * @param {number} op - Operation number
   * @param {Uint8Array} data - Unsigned 8 bit array
   * @param {number} chk - channel number
   * @param {boolean} waitResponse - wait for response ?
   * @param {number} timeout - timeout number in milliseconds
   * @returns {Promise<[number, Uint8Array]>} Return a number and a 8 bit unsigned integer array.
   */
  async command(t = null, e = new Uint8Array(0), r = 0, o = !0, a = this.DEFAULT_TIMEOUT) {
    if (t != null) {
      this.transport.tracing && this.transport.trace(`command op:0x${t.toString(16).padStart(2, "0")} data len=${e.length} wait_response=${o ? 1 : 0} timeout=${(a / 1e3).toFixed(3)} data=${this.transport.hexConvert(e)}`);
      const s = new Uint8Array(8 + e.length);
      s[0] = 0, s[1] = t, s[2] = this._shortToBytearray(e.length)[0], s[3] = this._shortToBytearray(e.length)[1], s[4] = this._intToByteArray(r)[0], s[5] = this._intToByteArray(r)[1], s[6] = this._intToByteArray(r)[2], s[7] = this._intToByteArray(r)[3];
      let n;
      for (n = 0; n < e.length; n++)
        s[8 + n] = e[n];
      await this.transport.write(s);
    }
    return o ? this.readPacket(t, a) : [0, new Uint8Array(0)];
  }
  /**
   * Read a register from chip.
   * @param {number} addr - Register address number
   * @param {number} timeout - Timeout in milliseconds (Default: 3000ms)
   * @returns {number} - Command number value
   */
  async readReg(t, e = this.DEFAULT_TIMEOUT) {
    const r = this._intToByteArray(t);
    return (await this.command(this.ESP_READ_REG, r, void 0, void 0, e))[0];
  }
  /**
   * Write a number value to register address in chip.
   * @param {number} addr - Register address number
   * @param {number} value - Number value to write in register
   * @param {number} mask - Hex number for mask
   * @param {number} delayUs Delay number
   * @param {number} delayAfterUs Delay after previous delay
   */
  async writeReg(t, e, r = 4294967295, o = 0, a = 0) {
    let s = this._appendArray(this._intToByteArray(t), this._intToByteArray(e));
    s = this._appendArray(s, this._intToByteArray(r)), s = this._appendArray(s, this._intToByteArray(o)), a > 0 && (s = this._appendArray(s, this._intToByteArray(this.chip.UART_DATE_REG_ADDR)), s = this._appendArray(s, this._intToByteArray(0)), s = this._appendArray(s, this._intToByteArray(0)), s = this._appendArray(s, this._intToByteArray(a))), await this.checkCommand("write target memory", this.ESP_WRITE_REG, s);
  }
  /**
   * Sync chip by sending sync command.
   * @returns {[number, Uint8Array]} Command result
   */
  async sync() {
    this.debug("Sync");
    const t = new Uint8Array(36);
    let e;
    for (t[0] = 7, t[1] = 7, t[2] = 18, t[3] = 32, e = 0; e < 32; e++)
      t[4 + e] = 85;
    try {
      let r = await this.command(8, t, void 0, void 0, 100);
      this.syncStubDetected = r[0] === 0;
      for (let o = 0; o < 7; o++)
        r = await this.command(), this.syncStubDetected = this.syncStubDetected && r[0] === 0;
      return r;
    } catch (r) {
      throw this.debug("Sync err " + r), r;
    }
  }
  /**
   * Attempt to connect to the chip by sending a reset sequence and later a sync command.
   * @param {string} mode - Reset mode to use
   * @param {ResetStrategy} resetStrategy - Reset strategy class to use for connect
   * @returns {string} - Returns 'success' or 'error' message.
   */
  async _connectAttempt(t = "default_reset", e) {
    this.debug("_connect_attempt " + t), e && await e.reset();
    const r = this.transport.inWaiting(), o = await this.transport.newRead(r > 0 ? r : 1, this.DEFAULT_TIMEOUT), a = Array.from(o, (p) => String.fromCharCode(p)).join(""), s = /boot:(0x[0-9a-fA-F]+)(.*waiting for download)?/, n = a.match(s);
    let c = !1, l = "", d = !1;
    n && (c = !0, l = n[1], d = !!n[2]);
    let v = "";
    for (let p = 0; p < 5; p++)
      try {
        this.debug(`Sync connect attempt ${p}`);
        const f = await this.sync();
        return this.debug(f[0].toString()), "success";
      } catch (f) {
        this.debug(`Error at sync ${f}`), f instanceof Error ? v = f.message : typeof f == "string" ? v = f : v = JSON.stringify(f);
      }
    return c && (v = `Wrong boot mode detected (${l}).
        This chip needs to be in download mode.`, d && (v = `Download mode successfully detected, but getting no sync reply:
           The serial TX path seems to be down.`)), v;
  }
  /**
   * Constructs a sequence of reset strategies based on the OS,
   * used ESP chip, external settings, and environment variables.
   * Returns a tuple of one or more reset strategies to be tried sequentially.
   * @param {string} mode - Reset mode to use
   * @returns {ResetStrategy[]} - Array of reset strategies
   */
  constructResetSequence(t) {
    if (t !== "no_reset") {
      if (t === "usb_reset" || this.transport.getPid() === this.USB_JTAG_SERIAL_PID) {
        if (this.resetConstructors.usbJTAGSerialReset)
          return this.debug("using USB JTAG Serial Reset"), [this.resetConstructors.usbJTAGSerialReset(this.transport)];
      } else if (this.resetConstructors.classicReset)
        return this.debug("using Classic Serial Reset"), [
          this.resetConstructors.classicReset(this.transport, 50),
          this.resetConstructors.classicReset(this.transport, 550)
        ];
    }
    return [];
  }
  /**
   * Perform a connection to chip.
   * @param {string} mode - Reset mode to use. Example: 'default_reset' | 'no_reset'
   * @param {number} attempts - Number of connection attempts
   * @param {boolean} detecting - Detect the connected chip
   */
  async connect(t = "default_reset", e = 7, r = !0) {
    let o;
    this.info("Connecting...", !1), await this.transport.connect(this.romBaudrate, this.serialOptions);
    const a = this.constructResetSequence(t);
    for (let s = 0; s < e; s++) {
      const n = a.length > 0 ? a[s % a.length] : null;
      if (o = await this._connectAttempt(t, n), o === "success")
        break;
    }
    if (o !== "success")
      throw new W("Failed to connect with the device");
    if (this.debug("Connect attempt successful."), this.info(`
\r`, !1), r) {
      const s = await this.readReg(this.CHIP_DETECT_MAGIC_REG_ADDR) >>> 0;
      this.debug("Chip Magic " + s.toString(16));
      const n = await ul(s);
      if (this.chip === null)
        throw new W(`Unexpected CHIP magic value ${s}. Failed to autodetect chip type.`);
      this.chip = n;
    }
  }
  /**
   * Connect and detect the existing chip.
   * @param {string} mode Reset mode to use for connection.
   */
  async detectChip(t = "default_reset") {
    await this.connect(t), this.info("Detecting chip type... ", !1), this.chip != null ? this.info(this.chip.CHIP_NAME) : this.info("unknown!");
  }
  /**
   * Execute the command and check the command response.
   * @param {string} opDescription Command operation description.
   * @param {number} op Command operation number
   * @param {Uint8Array} data Command value
   * @param {number} chk Checksum to use
   * @param {number} timeout TImeout number in milliseconds (ms)
   * @returns {number} Command result
   */
  async checkCommand(t = "", e = null, r = new Uint8Array(0), o = 0, a = this.DEFAULT_TIMEOUT) {
    this.debug("check_command " + t);
    const s = await this.command(e, r, o, void 0, a);
    return s[1].length > 4 ? s[1] : s[0];
  }
  /**
   * Start downloading an application image to RAM
   * @param {number} size Image size number
   * @param {number} blocks Number of data blocks
   * @param {number} blocksize Size of each data block
   * @param {number} offset Image offset number
   */
  async memBegin(t, e, r, o) {
    if (this.IS_STUB) {
      const s = o, n = o + t, c = await Dr(this.chip.CHIP_NAME);
      if (c) {
        const l = [
          [c.bss_start || c.data_start, c.data_start + c.decodedData.length],
          [c.text_start, c.text_start + c.decodedText.length]
        ];
        for (const [d, v] of l)
          if (s < v && n > d)
            throw new W(`Software loader is resident at 0x${d.toString(16).padStart(8, "0")}-0x${v.toString(16).padStart(8, "0")}.
            Can't load binary at overlapping address range 0x${s.toString(16).padStart(8, "0")}-0x${n.toString(16).padStart(8, "0")}.
            Either change binary loading address, or use the no-stub option to disable the software loader.`);
      }
    }
    this.debug("mem_begin " + t + " " + e + " " + r + " " + o.toString(16));
    let a = this._appendArray(this._intToByteArray(t), this._intToByteArray(e));
    a = this._appendArray(a, this._intToByteArray(r)), a = this._appendArray(a, this._intToByteArray(o)), await this.checkCommand("enter RAM download mode", this.ESP_MEM_BEGIN, a);
  }
  /**
   * Get the checksum for given unsigned 8-bit array
   * @param {Uint8Array} data Unsigned 8-bit integer array
   * @param {number} state Initial checksum
   * @returns {number} - Array checksum
   */
  checksum(t, e = this.ESP_CHECKSUM_MAGIC) {
    for (let r = 0; r < t.length; r++)
      e ^= t[r];
    return e;
  }
  /**
   * Send a block of image to RAM
   * @param {Uint8Array} buffer Unsigned 8-bit array
   * @param {number} seq Sequence number
   */
  async memBlock(t, e) {
    let r = this._appendArray(this._intToByteArray(t.length), this._intToByteArray(e));
    r = this._appendArray(r, this._intToByteArray(0)), r = this._appendArray(r, this._intToByteArray(0)), r = this._appendArray(r, t);
    const o = this.checksum(t);
    await this.checkCommand("write to target RAM", this.ESP_MEM_DATA, r, o);
  }
  /**
   * Leave RAM download mode and run application
   * @param {number} entrypoint - Entrypoint number
   */
  async memFinish(t) {
    const e = t === 0 ? 1 : 0, r = this._appendArray(this._intToByteArray(e), this._intToByteArray(t));
    await this.checkCommand("leave RAM download mode", this.ESP_MEM_END, r, void 0, 200);
  }
  /**
   * Configure SPI flash pins
   * @param {number} hspiArg -  Argument for SPI attachment
   */
  async flashSpiAttach(t) {
    const e = this._intToByteArray(t);
    await this.checkCommand("configure SPI flash pins", this.ESP_SPI_ATTACH, e);
  }
  /**
   * Scale timeouts which are size-specific.
   * @param {number} secondsPerMb Seconds per megabytes as number
   * @param {number} sizeBytes Size bytes number
   * @returns {number} - Scaled timeout for specified size.
   */
  timeoutPerMb(t, e) {
    const r = t * (e / 1e6);
    return r < 3e3 ? 3e3 : r;
  }
  /**
   * Start downloading to Flash (performs an erase)
   * @param {number} size Size to erase
   * @param {number} offset Offset to erase
   * @returns {number} Number of blocks (of size self.FLASH_WRITE_SIZE) to write.
   */
  async flashBegin(t, e) {
    const r = Math.floor((t + this.FLASH_WRITE_SIZE - 1) / this.FLASH_WRITE_SIZE), o = this.chip.getEraseSize(e, t), a = /* @__PURE__ */ new Date(), s = a.getTime();
    let n = 3e3;
    this.IS_STUB == !1 && (n = this.timeoutPerMb(this.ERASE_REGION_TIMEOUT_PER_MB, t)), this.debug("flash begin " + o + " " + r + " " + this.FLASH_WRITE_SIZE + " " + e + " " + t);
    let c = this._appendArray(this._intToByteArray(o), this._intToByteArray(r));
    c = this._appendArray(c, this._intToByteArray(this.FLASH_WRITE_SIZE)), c = this._appendArray(c, this._intToByteArray(e)), this.IS_STUB == !1 && (c = this._appendArray(c, this._intToByteArray(0))), await this.checkCommand("enter Flash download mode", this.ESP_FLASH_BEGIN, c, void 0, n);
    const l = a.getTime();
    return t != 0 && this.IS_STUB == !1 && this.info("Took " + (l - s) / 1e3 + "." + (l - s) % 1e3 + "s to erase flash block"), r;
  }
  /**
   * Start downloading compressed data to Flash (performs an erase)
   * @param {number} size Write size
   * @param {number} compsize Compressed size
   * @param {number} offset Offset for write
   * @returns {number} Returns number of blocks (size self.FLASH_WRITE_SIZE) to write.
   */
  async flashDeflBegin(t, e, r) {
    const o = Math.floor((e + this.FLASH_WRITE_SIZE - 1) / this.FLASH_WRITE_SIZE), a = Math.floor((t + this.FLASH_WRITE_SIZE - 1) / this.FLASH_WRITE_SIZE), s = /* @__PURE__ */ new Date(), n = s.getTime();
    let c, l;
    this.IS_STUB ? (c = t, l = this.DEFAULT_TIMEOUT) : (c = a * this.FLASH_WRITE_SIZE, l = this.timeoutPerMb(this.ERASE_REGION_TIMEOUT_PER_MB, c)), this.info("Compressed " + t + " bytes to " + e + "...");
    let d = this._appendArray(this._intToByteArray(c), this._intToByteArray(o));
    d = this._appendArray(d, this._intToByteArray(this.FLASH_WRITE_SIZE)), d = this._appendArray(d, this._intToByteArray(r)), (this.chip.CHIP_NAME === "ESP32-S2" || this.chip.CHIP_NAME === "ESP32-S3" || this.chip.CHIP_NAME === "ESP32-C3" || this.chip.CHIP_NAME === "ESP32-C2") && this.IS_STUB === !1 && (d = this._appendArray(d, this._intToByteArray(0))), await this.checkCommand("enter compressed flash mode", this.ESP_FLASH_DEFL_BEGIN, d, void 0, l);
    const v = s.getTime();
    return t != 0 && this.IS_STUB === !1 && this.info("Took " + (v - n) / 1e3 + "." + (v - n) % 1e3 + "s to erase flash block"), o;
  }
  /**
   * Write block to flash, retry if fail
   * @param {Uint8Array} data Unsigned 8-bit array data.
   * @param {number} seq Sequence number
   * @param {number} timeout Timeout in milliseconds (ms)
   */
  async flashBlock(t, e, r) {
    let o = this._appendArray(this._intToByteArray(t.length), this._intToByteArray(e));
    o = this._appendArray(o, this._intToByteArray(0)), o = this._appendArray(o, this._intToByteArray(0)), o = this._appendArray(o, t);
    const a = this.checksum(t);
    await this.checkCommand("write to target Flash after seq " + e, this.ESP_FLASH_DATA, o, a, r);
  }
  /**
   * Write block to flash, send compressed, retry if fail
   * @param {Uint8Array} data Unsigned int 8-bit array data to write
   * @param {number} seq Sequence number
   * @param {number} timeout Timeout in milliseconds (ms)
   */
  async flashDeflBlock(t, e, r) {
    let o = this._appendArray(this._intToByteArray(t.length), this._intToByteArray(e));
    o = this._appendArray(o, this._intToByteArray(0)), o = this._appendArray(o, this._intToByteArray(0)), o = this._appendArray(o, t);
    const a = this.checksum(t);
    this.debug("flash_defl_block " + t[0].toString(16) + " " + t[1].toString(16)), await this.checkCommand("write compressed data to flash after seq " + e, this.ESP_FLASH_DEFL_DATA, o, a, r);
  }
  /**
   * Leave flash mode and run/reboot
   * @param {boolean} reboot Reboot after leaving flash mode ?
   */
  async flashFinish(t = !1) {
    const e = t ? 0 : 1, r = this._intToByteArray(e);
    await this.checkCommand("leave Flash mode", this.ESP_FLASH_END, r);
  }
  /**
   * Leave compressed flash mode and run/reboot
   * @param {boolean} reboot Reboot after leaving flash mode ?
   */
  async flashDeflFinish(t = !1) {
    const e = t ? 0 : 1, r = this._intToByteArray(e);
    await this.checkCommand("leave compressed flash mode", this.ESP_FLASH_DEFL_END, r);
  }
  /**
   * Run an arbitrary SPI flash command.
   *
   * This function uses the "USR_COMMAND" functionality in the ESP
   * SPI hardware, rather than the precanned commands supported by
   * hardware. So the value of spiflashCommand is an actual command
   * byte, sent over the wire.
   *
   * After writing command byte, writes 'data' to MOSI and then
   * reads back 'readBits' of reply on MISO. Result is a number.
   * @param {number} spiflashCommand Command to execute in SPI
   * @param {Uint8Array} data Data to send
   * @param {number} readBits Number of bits to read
   * @returns {number} Register SPI_W0_REG value
   */
  async runSpiflashCommand(t, e, r) {
    const n = this.chip.SPI_REG_BASE, c = n + 0, l = n + this.chip.SPI_USR_OFFS, d = n + this.chip.SPI_USR1_OFFS, v = n + this.chip.SPI_USR2_OFFS, p = n + this.chip.SPI_W0_OFFS;
    let f;
    this.chip.SPI_MOSI_DLEN_OFFS != null ? f = async (w, I) => {
      const R = n + this.chip.SPI_MOSI_DLEN_OFFS, T = n + this.chip.SPI_MISO_DLEN_OFFS;
      w > 0 && await this.writeReg(R, w - 1), I > 0 && await this.writeReg(T, I - 1);
    } : f = async (w, I) => {
      const R = d, T = 17, C = 8, Q = w === 0 ? 0 : w - 1, Y = (I === 0 ? 0 : I - 1) << C | Q << T;
      await this.writeReg(R, Y);
    };
    const _ = 1 << 18, y = 28;
    if (r > 32)
      throw new W("Reading more than 32 bits back from a SPI flash operation is unsupported");
    if (e.length > 64)
      throw new W("Writing more than 64 bytes of data with one SPI command is unsupported");
    const x = e.length * 8, b = await this.readReg(l), E = await this.readReg(v);
    let S = -2147483648, m;
    r > 0 && (S |= 268435456), x > 0 && (S |= 134217728), await f(x, r), await this.writeReg(l, S);
    let k = 7 << y | t;
    if (await this.writeReg(v, k), x == 0)
      await this.writeReg(p, 0);
    else {
      if (e.length % 4 != 0) {
        const I = new Uint8Array(e.length % 4);
        e = this._appendArray(e, I);
      }
      let w = p;
      for (m = 0; m < e.length - 4; m += 4)
        k = this._byteArrayToInt(e[m], e[m + 1], e[m + 2], e[m + 3]), await this.writeReg(w, k), w += 4;
    }
    for (await this.writeReg(c, _), m = 0; m < 10 && (k = await this.readReg(c) & _, k != 0); m++)
      ;
    if (m === 10)
      throw new W("SPI command did not complete in time");
    const O = await this.readReg(p);
    return await this.writeReg(l, b), await this.writeReg(v, E), O;
  }
  /**
   * Read flash id by executing the SPIFLASH_RDID flash command.
   * @returns {Promise<number>} Register SPI_W0_REG value
   */
  async readFlashId() {
    const e = new Uint8Array(0);
    return await this.runSpiflashCommand(159, e, 24);
  }
  /**
   * Execute the erase flash command
   * @returns {Promise<number | Uint8Array>} Erase flash command result
   */
  async eraseFlash() {
    this.info("Erasing flash (this may take a while)...");
    let t = /* @__PURE__ */ new Date();
    const e = t.getTime(), r = await this.checkCommand("erase flash", this.ESP_ERASE_FLASH, void 0, void 0, this.CHIP_ERASE_TIMEOUT);
    t = /* @__PURE__ */ new Date();
    const o = t.getTime();
    return this.info("Chip erase completed successfully in " + (o - e) / 1e3 + "s"), r;
  }
  /**
   * Convert a number or unsigned 8-bit array to hex string
   * @param {number | Uint8Array } buffer Data to convert to hex string.
   * @returns {string} A hex string
   */
  toHex(t) {
    return Array.prototype.map.call(t, (e) => ("00" + e.toString(16)).slice(-2)).join("");
  }
  /**
   * Calculate the MD5 Checksum command
   * @param {number} addr Address number
   * @param {number} size Package size
   * @returns {string} MD5 Checksum string
   */
  async flashMd5sum(t, e) {
    const r = this.timeoutPerMb(this.MD5_TIMEOUT_PER_MB, e);
    let o = this._appendArray(this._intToByteArray(t), this._intToByteArray(e));
    o = this._appendArray(o, this._intToByteArray(0)), o = this._appendArray(o, this._intToByteArray(0));
    let a = await this.checkCommand("calculate md5sum", this.ESP_SPI_FLASH_MD5, o, void 0, r);
    return a instanceof Uint8Array && a.length > 16 && (a = a.slice(0, 16)), this.toHex(a);
  }
  async readFlash(t, e, r = null) {
    let o = this._appendArray(this._intToByteArray(t), this._intToByteArray(e));
    o = this._appendArray(o, this._intToByteArray(4096)), o = this._appendArray(o, this._intToByteArray(1024));
    const a = await this.checkCommand("read flash", this.ESP_READ_FLASH, o);
    if (a != 0)
      throw new W("Failed to read memory: " + a);
    let s = new Uint8Array(0);
    for (; s.length < e; ) {
      const { value: n } = await this.transport.read(this.FLASH_READ_TIMEOUT).next();
      if (n instanceof Uint8Array)
        n.length > 0 && (s = this._appendArray(s, n), await this.transport.write(this._intToByteArray(s.length)), r && r(n, s.length, e));
      else
        throw new W("Failed to read memory: " + n);
    }
    return s;
  }
  /**
   * Upload the flasher ROM bootloader (flasher stub) to the chip.
   * @returns {ROM} The Chip ROM
   */
  async runStub() {
    if (this.syncStubDetected)
      return this.info("Stub is already running. No upload is necessary."), this.chip;
    this.info("Uploading stub...");
    const t = await Dr(this.chip.CHIP_NAME);
    if (t === void 0)
      throw this.debug("Error loading Stub json"), new Error("Error loading Stub json");
    const e = [t.decodedText, t.decodedData];
    for (let a = 0; a < e.length; a++)
      if (e[a]) {
        const s = a === 0 ? t.text_start : t.data_start, n = e[a].length, c = Math.floor((n + this.ESP_RAM_BLOCK - 1) / this.ESP_RAM_BLOCK);
        await this.memBegin(n, c, this.ESP_RAM_BLOCK, s);
        for (let l = 0; l < c; l++) {
          const d = l * this.ESP_RAM_BLOCK, v = d + this.ESP_RAM_BLOCK;
          await this.memBlock(e[a].slice(d, v), l);
        }
      }
    this.info("Running stub..."), await this.memFinish(t.entry);
    const { value: r } = await this.transport.read(this.DEFAULT_TIMEOUT).next(), o = String.fromCharCode(...r);
    if (o !== "OHAI")
      throw new W(`Failed to start stub. Unexpected response ${o}`);
    return this.info("Stub running..."), this.IS_STUB = !0, this.chip;
  }
  /**
   * Change the chip baudrate.
   */
  async changeBaud() {
    this.info("Changing baudrate to " + this.baudrate);
    const t = this.IS_STUB ? this.romBaudrate : 0, e = this._appendArray(this._intToByteArray(this.baudrate), this._intToByteArray(t));
    await this.command(this.ESP_CHANGE_BAUDRATE, e), this.info("Changed"), await this.transport.disconnect(), await this._sleep(50), await this.transport.connect(this.baudrate, this.serialOptions);
  }
  /**
   * Execute the main function of ESPLoader.
   * @param {string} mode Reset mode to use
   * @returns {string} chip ROM
   */
  async main(t = "default_reset") {
    await this.detectChip(t);
    const e = await this.chip.getChipDescription(this);
    return this.info("Chip is " + e), this.info("Features: " + await this.chip.getChipFeatures(this)), this.info("Crystal is " + await this.chip.getCrystalFreq(this) + "MHz"), this.info("MAC: " + await this.chip.readMac(this)), await this.chip.readMac(this), typeof this.chip.postConnect < "u" && await this.chip.postConnect(this), await this.runStub(), this.romBaudrate !== this.baudrate && await this.changeBaud(), e;
  }
  /**
   * Parse a given flash size string to a number
   * @param {string} flsz Flash size to request
   * @returns {number} Flash size number
   */
  parseFlashSizeArg(t) {
    if (typeof this.chip.FLASH_SIZES[t] > "u")
      throw new W("Flash size " + t + " is not supported by this chip type. Supported sizes: " + this.chip.FLASH_SIZES);
    return this.chip.FLASH_SIZES[t];
  }
  /**
   * Update the image flash parameters with given arguments.
   * @param {string} image binary image as string
   * @param {number} address flash address number
   * @param {string} flashSize Flash size string
   * @param {string} flashMode Flash mode string
   * @param {string} flashFreq Flash frequency string
   * @returns {string} modified image string
   */
  _updateImageFlashParams(t, e, r, o, a) {
    if (this.debug("_update_image_flash_params " + r + " " + o + " " + a), t.length < 8 || e != this.chip.BOOTLOADER_FLASH_OFFSET)
      return t;
    if (r === "keep" && o === "keep" && a === "keep")
      return this.info("Not changing the image"), t;
    const s = parseInt(t[0]);
    let n = parseInt(t[2]);
    const c = parseInt(t[3]);
    if (s !== this.ESP_IMAGE_MAGIC)
      return this.info("Warning: Image file at 0x" + e.toString(16) + " doesn't look like an image file, so not changing any flash settings."), t;
    o !== "keep" && (n = { qio: 0, qout: 1, dio: 2, dout: 3 }[o]);
    let l = c & 15;
    a !== "keep" && (l = { "40m": 0, "26m": 1, "20m": 2, "80m": 15 }[a]);
    let d = c & 240;
    r !== "keep" && (d = this.parseFlashSizeArg(r));
    const v = n << 8 | l + d;
    return this.info("Flash params set to " + v.toString(16)), parseInt(t[2]) !== n << 8 && (t = t.substring(0, 2) + (n << 8).toString() + t.substring(3)), parseInt(t[3]) !== l + d && (t = t.substring(0, 3) + (l + d).toString() + t.substring(4)), t;
  }
  /**
   * Write set of file images into given address based on given FlashOptions object.
   * @param {FlashOptions} options FlashOptions to configure how and what to write into flash.
   */
  async writeFlash(t) {
    if (this.debug("EspLoader program"), t.flashSize !== "keep") {
      const o = this.flashSizeBytes(t.flashSize);
      for (let a = 0; a < t.fileArray.length; a++)
        if (t.fileArray[a].data.length + t.fileArray[a].address > o)
          throw new W(`File ${a + 1} doesn't fit in the available flash`);
    }
    this.IS_STUB === !0 && t.eraseAll === !0 && await this.eraseFlash();
    let e, r;
    for (let o = 0; o < t.fileArray.length; o++) {
      if (this.debug("Data Length " + t.fileArray[o].data.length), e = t.fileArray[o].data, this.debug("Image Length " + e.length), e.length === 0) {
        this.debug("Warning: File is empty");
        continue;
      }
      e = this.ui8ToBstr(pl(this.bstrToUi8(e), 4)), r = t.fileArray[o].address, e = this._updateImageFlashParams(e, r, t.flashSize, t.flashMode, t.flashFreq);
      let a = null;
      t.calculateMD5Hash && (a = t.calculateMD5Hash(e), this.debug("Image MD5 " + a));
      const s = e.length;
      let n;
      if (t.compress) {
        const b = this.bstrToUi8(e);
        e = this.ui8ToBstr(rl(b, { level: 9 })), n = await this.flashDeflBegin(s, e.length, r);
      } else
        n = await this.flashBegin(s, r);
      let c = 0, l = 0;
      const d = e.length;
      t.reportProgress && t.reportProgress(o, 0, d);
      let v = /* @__PURE__ */ new Date();
      const p = v.getTime();
      let f = 5e3;
      const _ = new ol({ chunkSize: 1 });
      let y = 0;
      for (_.onData = function(b) {
        y += b.byteLength;
      }; e.length > 0; ) {
        this.debug("Write loop " + r + " " + c + " " + n), this.info("Writing at 0x" + (r + y).toString(16) + "... (" + Math.floor(100 * (c + 1) / n) + "%)");
        const b = this.bstrToUi8(e.slice(0, this.FLASH_WRITE_SIZE));
        if (t.compress) {
          const E = y;
          _.push(b, !1);
          const S = y - E;
          let m = 3e3;
          this.timeoutPerMb(this.ERASE_WRITE_TIMEOUT_PER_MB, S) > 3e3 && (m = this.timeoutPerMb(this.ERASE_WRITE_TIMEOUT_PER_MB, S)), this.IS_STUB === !1 && (f = m), await this.flashDeflBlock(b, c, f), this.IS_STUB && (f = m);
        } else
          throw new W("Yet to handle Non Compressed writes");
        l += b.length, e = e.slice(this.FLASH_WRITE_SIZE, e.length), c++, t.reportProgress && t.reportProgress(o, l, d);
      }
      this.IS_STUB && await this.readReg(this.CHIP_DETECT_MAGIC_REG_ADDR, f), v = /* @__PURE__ */ new Date();
      const x = v.getTime() - p;
      if (t.compress && this.info("Wrote " + s + " bytes (" + l + " compressed) at 0x" + r.toString(16) + " in " + x / 1e3 + " seconds."), a) {
        const b = await this.flashMd5sum(r, s);
        if (new String(b).valueOf() != new String(a).valueOf())
          throw this.info("File  md5: " + a), this.info("Flash md5: " + b), new W("MD5 of file does not match data in flash!");
        this.info("Hash of data verified.");
      }
    }
    this.info("Leaving..."), this.IS_STUB && (await this.flashBegin(0, 0), t.compress ? await this.flashDeflFinish() : await this.flashFinish());
  }
  /**
   * Read SPI flash manufacturer and device id.
   */
  async flashId() {
    this.debug("flash_id");
    const t = await this.readFlashId();
    this.info("Manufacturer: " + (t & 255).toString(16));
    const e = t >> 16 & 255;
    this.info("Device: " + (t >> 8 & 255).toString(16) + e.toString(16)), this.info("Detected flash size: " + this.DETECTED_FLASH_SIZES[e]);
  }
  async getFlashSize() {
    this.debug("flash_id");
    const e = await this.readFlashId() >> 16 & 255;
    return this.DETECTED_FLASH_SIZES_NUM[e];
  }
  /**
   * Soft reset the device chip. Soft reset with run user code is the closest.
   * @param {boolean} stayInBootloader Flag to indicate if to stay in bootloader
   */
  async softReset(t) {
    if (this.IS_STUB) {
      if (this.chip.CHIP_NAME != "ESP8266")
        throw new W("Soft resetting is currently only supported on ESP8266");
      t ? (await this.flashBegin(0, 0), await this.flashFinish(!0)) : await this.command(this.ESP_RUN_USER_CODE, void 0, void 0, !1);
    } else {
      if (t)
        return;
      await this.flashBegin(0, 0), await this.flashFinish(!1);
    }
  }
  /**
   * Execute this function to execute after operation reset functions.
   * @param {After} mode After operation mode. Default is 'hard_reset'.
   * @param { boolean } usingUsbOtg For 'hard_reset' to specify if using USB-OTG
   */
  async after(t = "hard_reset", e) {
    switch (t) {
      case "hard_reset":
        this.resetConstructors.hardReset && (this.info("Hard resetting via RTS pin..."), await this.resetConstructors.hardReset(this.transport, e).reset());
        break;
      case "soft_reset":
        this.info("Soft resetting..."), await this.softReset(!1);
        break;
      case "no_reset_stub":
        this.info("Staying in flasher stub.");
        break;
      default:
        this.info("Staying in bootloader."), this.IS_STUB && this.softReset(!0);
        break;
    }
  }
}
class vl extends HTMLElement {
  constructor() {
    super(...arguments), this.allowInput = !0;
  }
  logs() {
    var t;
    return ((t = this._console) === null || t === void 0 ? void 0 : t.logs()) || "";
  }
  connectedCallback() {
    if (this._console)
      return;
    const t = this.attachShadow({ mode: "open" });
    if (t.innerHTML = `
      <style>
        :host, input {
          background-color: #1c1c1c;
          color: #ddd;
          font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier,
            monospace;
          line-height: 1.45;
          display: flex;
          flex-direction: column;
        }
        form {
          display: flex;
          align-items: center;
          padding: 0 8px 0 16px;
        }
        input {
          flex: 1;
          padding: 4px;
          margin: 0 8px;
          border: 0;
          outline: none;
        }
        ${Ta}
      </style>
      <div class="log"></div>
      ${this.allowInput ? `<form>
                >
                <input autofocus>
              </form>
            ` : ""}
    `, this._console = new Aa(this.shadowRoot.querySelector("div")), this.allowInput) {
      const o = this.shadowRoot.querySelector("input");
      this.addEventListener("click", () => {
        var a;
        ((a = getSelection()) === null || a === void 0 ? void 0 : a.toString()) === "" && o.focus();
      }), o.addEventListener("keydown", (a) => {
        a.key === "Enter" && (a.preventDefault(), a.stopPropagation(), this._sendCommand());
      });
    }
    const e = new AbortController(), r = this._connect(e.signal);
    this._cancelConnection = () => (e.abort(), r);
  }
  async _connect(t) {
    this.logger.debug("Starting console read loop");
    try {
      await this.port.readable.pipeThrough(new TextDecoderStream(), {
        signal: t
      }).pipeThrough(new TransformStream(new Ca())).pipeThrough(new TransformStream(new Ia())).pipeTo(new WritableStream({
        write: (e) => {
          this._console.addLine(e.replace("\r", ""));
        }
      })), t.aborted || (this._console.addLine(""), this._console.addLine(""), this._console.addLine("Terminal disconnected"));
    } catch (e) {
      this._console.addLine(""), this._console.addLine(""), this._console.addLine(`Terminal disconnected: ${e}`);
    } finally {
      await Ve(100), this.logger.debug("Finished console read loop");
    }
  }
  async _sendCommand() {
    const t = this.shadowRoot.querySelector("input"), e = t.value, r = new TextEncoder(), o = this.port.writable.getWriter();
    await o.write(r.encode(e + `\r
`)), this._console.addLine(`> ${e}\r
`), t.value = "", t.focus();
    try {
      o.releaseLock();
    } catch (a) {
      console.error("Ignoring release lock error", a);
    }
  }
  async disconnect() {
    this._cancelConnection && (await this._cancelConnection(), this._cancelConnection = void 0);
  }
  async reset() {
    this.logger.debug("Triggering reset");
    const t = new Hi(this.port);
    await t.setRTS(!0), await Ve(100), await new Vo(t).reset();
  }
}
customElements.define("ewt-console", vl);
function Pr(i, t = !0) {
  return t && getComputedStyle(i).getPropertyValue("direction").trim() === "rtl";
}
const gl = ze(Ut(U));
class G extends gl {
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
    return this[te].form;
  }
  /**
   * The labels this element is associated with.
   */
  get labels() {
    return this[te].labels;
  }
  constructor() {
    super(), this.disabled = !1, this.softDisabled = !1, this.flipIconInRtl = !1, this.href = "", this.target = "", this.ariaLabelSelected = "", this.toggle = !1, this.selected = !1, this.type = "submit", this.value = "", this.flipIcon = Pr(this, this.flipIconInRtl), this.addEventListener("click", this.handleClick.bind(this));
  }
  willUpdate() {
    this.href && (this.disabled = !1, this.softDisabled = !1);
  }
  render() {
    const t = this.href ? ke`div` : ke`button`, { ariaLabel: e, ariaHasPopup: r, ariaExpanded: o } = this, a = e && this.ariaLabelSelected, s = this.toggle ? this.selected : A;
    let n = A;
    return this.href || (n = a && this.selected ? this.ariaLabelSelected : e), Nt`<${t}
        class="icon-button ${ne(this.getRenderClasses())}"
        id="button"
        aria-label="${n || A}"
        aria-haspopup="${!this.href && r || A}"
        aria-expanded="${!this.href && o || A}"
        aria-pressed="${s}"
        aria-disabled=${!this.href && this.softDisabled || A}
        ?disabled="${!this.href && this.disabled}"
        @click="${this.handleClickOnChild}">
        ${this.renderFocusRing()}
        ${this.renderRipple()}
        ${this.selected ? A : this.renderIcon()}
        ${this.selected ? this.renderSelectedIcon() : A}
        ${this.renderTouchTarget()}
        ${this.href && this.renderLink()}
  </${t}>`;
  }
  renderLink() {
    const { ariaLabel: t } = this;
    return g`
      <a
        class="link"
        id="link"
        href="${this.href}"
        target="${this.target || A}"
        aria-label="${t || A}"></a>
    `;
  }
  getRenderClasses() {
    return {
      "flip-icon": this.flipIcon,
      selected: this.toggle && this.selected
    };
  }
  renderIcon() {
    return g`<span class="icon"><slot></slot></span>`;
  }
  renderSelectedIcon() {
    return g`<span class="icon icon--selected"
      ><slot name="selected"><slot></slot></slot
    ></span>`;
  }
  renderTouchTarget() {
    return g`<span class="touch"></span>`;
  }
  renderFocusRing() {
    return g`<md-focus-ring
      part="focus-ring"
      for=${this.href ? "link" : "button"}></md-focus-ring>`;
  }
  renderRipple() {
    const t = !this.href && (this.disabled || this.softDisabled);
    return g`<md-ripple
      for=${this.href ? "link" : A}
      ?disabled="${t}"></md-ripple>`;
  }
  connectedCallback() {
    this.flipIcon = Pr(this, this.flipIconInRtl), super.connectedCallback();
  }
  /** Handles a click on this element. */
  handleClick(t) {
    if (!this.href && this.softDisabled) {
      t.stopImmediatePropagation(), t.preventDefault();
      return;
    }
  }
  /**
   * Handles a click on the child <div> or <button> element within this
   * element's shadow DOM.
   */
  async handleClickOnChild(t) {
    await 0, !(!this.toggle || this.disabled || this.softDisabled || t.defaultPrevented) && (this.selected = !this.selected, this.dispatchEvent(new InputEvent("input", { bubbles: !0, composed: !0 })), this.dispatchEvent(new Event("change", { bubbles: !0 })));
  }
}
sa(G);
G.formAssociated = !0;
G.shadowRootOptions = {
  mode: "open",
  delegatesFocus: !0
};
h([
  u({ type: Boolean, reflect: !0 })
], G.prototype, "disabled", void 0);
h([
  u({ type: Boolean, attribute: "soft-disabled", reflect: !0 })
], G.prototype, "softDisabled", void 0);
h([
  u({ type: Boolean, attribute: "flip-icon-in-rtl" })
], G.prototype, "flipIconInRtl", void 0);
h([
  u()
], G.prototype, "href", void 0);
h([
  u()
], G.prototype, "target", void 0);
h([
  u({ attribute: "aria-label-selected" })
], G.prototype, "ariaLabelSelected", void 0);
h([
  u({ type: Boolean })
], G.prototype, "toggle", void 0);
h([
  u({ type: Boolean, reflect: !0 })
], G.prototype, "selected", void 0);
h([
  u()
], G.prototype, "type", void 0);
h([
  u({ reflect: !0 })
], G.prototype, "value", void 0);
h([
  P()
], G.prototype, "flipIcon", void 0);
const _l = N`:host{display:inline-flex;outline:none;-webkit-tap-highlight-color:rgba(0,0,0,0);height:var(--_container-height);width:var(--_container-width);justify-content:center}:host([touch-target=wrapper]){margin:max(0px,(48px - var(--_container-height))/2) max(0px,(48px - var(--_container-width))/2)}md-focus-ring{--md-focus-ring-shape-start-start: var(--_container-shape-start-start);--md-focus-ring-shape-start-end: var(--_container-shape-start-end);--md-focus-ring-shape-end-end: var(--_container-shape-end-end);--md-focus-ring-shape-end-start: var(--_container-shape-end-start)}:host(:is([disabled],[soft-disabled])){pointer-events:none}.icon-button{place-items:center;background:none;border:none;box-sizing:border-box;cursor:pointer;display:flex;place-content:center;outline:none;padding:0;position:relative;text-decoration:none;user-select:none;z-index:0;flex:1;border-start-start-radius:var(--_container-shape-start-start);border-start-end-radius:var(--_container-shape-start-end);border-end-start-radius:var(--_container-shape-end-start);border-end-end-radius:var(--_container-shape-end-end)}.icon ::slotted(*){font-size:var(--_icon-size);height:var(--_icon-size);width:var(--_icon-size);font-weight:inherit}md-ripple{z-index:-1;border-start-start-radius:var(--_container-shape-start-start);border-start-end-radius:var(--_container-shape-start-end);border-end-start-radius:var(--_container-shape-end-start);border-end-end-radius:var(--_container-shape-end-end)}.flip-icon .icon{transform:scaleX(-1)}.icon{display:inline-flex}.link{height:100%;outline:none;position:absolute;width:100%}.touch{position:absolute;height:max(48px,100%);width:max(48px,100%)}:host([touch-target=none]) .touch{display:none}@media(forced-colors: active){:host(:is([disabled],[soft-disabled])){--_disabled-icon-color: GrayText;--_disabled-icon-opacity: 1}}
`;
const bl = N`:host{--_disabled-icon-color: var(--md-icon-button-disabled-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-icon-opacity: var(--md-icon-button-disabled-icon-opacity, 0.38);--_icon-size: var(--md-icon-button-icon-size, 24px);--_selected-focus-icon-color: var(--md-icon-button-selected-focus-icon-color, var(--md-sys-color-primary, #6750a4));--_selected-hover-icon-color: var(--md-icon-button-selected-hover-icon-color, var(--md-sys-color-primary, #6750a4));--_selected-hover-state-layer-color: var(--md-icon-button-selected-hover-state-layer-color, var(--md-sys-color-primary, #6750a4));--_selected-hover-state-layer-opacity: var(--md-icon-button-selected-hover-state-layer-opacity, 0.08);--_selected-icon-color: var(--md-icon-button-selected-icon-color, var(--md-sys-color-primary, #6750a4));--_selected-pressed-icon-color: var(--md-icon-button-selected-pressed-icon-color, var(--md-sys-color-primary, #6750a4));--_selected-pressed-state-layer-color: var(--md-icon-button-selected-pressed-state-layer-color, var(--md-sys-color-primary, #6750a4));--_selected-pressed-state-layer-opacity: var(--md-icon-button-selected-pressed-state-layer-opacity, 0.12);--_state-layer-height: var(--md-icon-button-state-layer-height, 40px);--_state-layer-shape: var(--md-icon-button-state-layer-shape, var(--md-sys-shape-corner-full, 9999px));--_state-layer-width: var(--md-icon-button-state-layer-width, 40px);--_focus-icon-color: var(--md-icon-button-focus-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-icon-color: var(--md-icon-button-hover-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-state-layer-color: var(--md-icon-button-hover-state-layer-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-state-layer-opacity: var(--md-icon-button-hover-state-layer-opacity, 0.08);--_icon-color: var(--md-icon-button-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_pressed-icon-color: var(--md-icon-button-pressed-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_pressed-state-layer-color: var(--md-icon-button-pressed-state-layer-color, var(--md-sys-color-on-surface-variant, #49454f));--_pressed-state-layer-opacity: var(--md-icon-button-pressed-state-layer-opacity, 0.12);--_container-shape-start-start: 0;--_container-shape-start-end: 0;--_container-shape-end-end: 0;--_container-shape-end-start: 0;--_container-height: 0;--_container-width: 0;height:var(--_state-layer-height);width:var(--_state-layer-width)}:host([touch-target=wrapper]){margin:max(0px,(48px - var(--_state-layer-height))/2) max(0px,(48px - var(--_state-layer-width))/2)}md-focus-ring{--md-focus-ring-shape-start-start: var(--_state-layer-shape);--md-focus-ring-shape-start-end: var(--_state-layer-shape);--md-focus-ring-shape-end-end: var(--_state-layer-shape);--md-focus-ring-shape-end-start: var(--_state-layer-shape)}.standard{background-color:rgba(0,0,0,0);color:var(--_icon-color);--md-ripple-hover-color: var(--_hover-state-layer-color);--md-ripple-hover-opacity: var(--_hover-state-layer-opacity);--md-ripple-pressed-color: var(--_pressed-state-layer-color);--md-ripple-pressed-opacity: var(--_pressed-state-layer-opacity)}.standard:hover{color:var(--_hover-icon-color)}.standard:focus{color:var(--_focus-icon-color)}.standard:active{color:var(--_pressed-icon-color)}.standard:is(:disabled,[aria-disabled=true]){color:var(--_disabled-icon-color)}md-ripple{border-radius:var(--_state-layer-shape)}.standard:is(:disabled,[aria-disabled=true]){opacity:var(--_disabled-icon-opacity)}.selected{--md-ripple-hover-color: var(--_selected-hover-state-layer-color);--md-ripple-hover-opacity: var(--_selected-hover-state-layer-opacity);--md-ripple-pressed-color: var(--_selected-pressed-state-layer-color);--md-ripple-pressed-opacity: var(--_selected-pressed-state-layer-opacity)}.selected:not(:disabled,[aria-disabled=true]){color:var(--_selected-icon-color)}.selected:not(:disabled,[aria-disabled=true]):hover{color:var(--_selected-hover-icon-color)}.selected:not(:disabled,[aria-disabled=true]):focus{color:var(--_selected-focus-icon-color)}.selected:not(:disabled,[aria-disabled=true]):active{color:var(--_selected-pressed-icon-color)}
`;
class Wo extends G {
}
Wo.styles = [_l, bl];
customElements.define("ew-icon-button", Wo);
const yl = N`:host{--_active-indicator-color: var(--md-filled-text-field-active-indicator-color, var(--md-sys-color-on-surface-variant, #49454f));--_active-indicator-height: var(--md-filled-text-field-active-indicator-height, 1px);--_caret-color: var(--md-filled-text-field-caret-color, var(--md-sys-color-primary, #6750a4));--_container-color: var(--md-filled-text-field-container-color, var(--md-sys-color-surface-container-highest, #e6e0e9));--_disabled-active-indicator-color: var(--md-filled-text-field-disabled-active-indicator-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-active-indicator-height: var(--md-filled-text-field-disabled-active-indicator-height, 1px);--_disabled-active-indicator-opacity: var(--md-filled-text-field-disabled-active-indicator-opacity, 0.38);--_disabled-container-color: var(--md-filled-text-field-disabled-container-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-container-opacity: var(--md-filled-text-field-disabled-container-opacity, 0.04);--_disabled-input-text-color: var(--md-filled-text-field-disabled-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-input-text-opacity: var(--md-filled-text-field-disabled-input-text-opacity, 0.38);--_disabled-label-text-color: var(--md-filled-text-field-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-label-text-opacity: var(--md-filled-text-field-disabled-label-text-opacity, 0.38);--_disabled-leading-icon-color: var(--md-filled-text-field-disabled-leading-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-leading-icon-opacity: var(--md-filled-text-field-disabled-leading-icon-opacity, 0.38);--_disabled-supporting-text-color: var(--md-filled-text-field-disabled-supporting-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-supporting-text-opacity: var(--md-filled-text-field-disabled-supporting-text-opacity, 0.38);--_disabled-trailing-icon-color: var(--md-filled-text-field-disabled-trailing-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-trailing-icon-opacity: var(--md-filled-text-field-disabled-trailing-icon-opacity, 0.38);--_error-active-indicator-color: var(--md-filled-text-field-error-active-indicator-color, var(--md-sys-color-error, #b3261e));--_error-focus-active-indicator-color: var(--md-filled-text-field-error-focus-active-indicator-color, var(--md-sys-color-error, #b3261e));--_error-focus-caret-color: var(--md-filled-text-field-error-focus-caret-color, var(--md-sys-color-error, #b3261e));--_error-focus-input-text-color: var(--md-filled-text-field-error-focus-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_error-focus-label-text-color: var(--md-filled-text-field-error-focus-label-text-color, var(--md-sys-color-error, #b3261e));--_error-focus-leading-icon-color: var(--md-filled-text-field-error-focus-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_error-focus-supporting-text-color: var(--md-filled-text-field-error-focus-supporting-text-color, var(--md-sys-color-error, #b3261e));--_error-focus-trailing-icon-color: var(--md-filled-text-field-error-focus-trailing-icon-color, var(--md-sys-color-error, #b3261e));--_error-hover-active-indicator-color: var(--md-filled-text-field-error-hover-active-indicator-color, var(--md-sys-color-on-error-container, #410e0b));--_error-hover-input-text-color: var(--md-filled-text-field-error-hover-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_error-hover-label-text-color: var(--md-filled-text-field-error-hover-label-text-color, var(--md-sys-color-on-error-container, #410e0b));--_error-hover-leading-icon-color: var(--md-filled-text-field-error-hover-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_error-hover-state-layer-color: var(--md-filled-text-field-error-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_error-hover-state-layer-opacity: var(--md-filled-text-field-error-hover-state-layer-opacity, 0.08);--_error-hover-supporting-text-color: var(--md-filled-text-field-error-hover-supporting-text-color, var(--md-sys-color-error, #b3261e));--_error-hover-trailing-icon-color: var(--md-filled-text-field-error-hover-trailing-icon-color, var(--md-sys-color-on-error-container, #410e0b));--_error-input-text-color: var(--md-filled-text-field-error-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_error-label-text-color: var(--md-filled-text-field-error-label-text-color, var(--md-sys-color-error, #b3261e));--_error-leading-icon-color: var(--md-filled-text-field-error-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_error-supporting-text-color: var(--md-filled-text-field-error-supporting-text-color, var(--md-sys-color-error, #b3261e));--_error-trailing-icon-color: var(--md-filled-text-field-error-trailing-icon-color, var(--md-sys-color-error, #b3261e));--_focus-active-indicator-color: var(--md-filled-text-field-focus-active-indicator-color, var(--md-sys-color-primary, #6750a4));--_focus-active-indicator-height: var(--md-filled-text-field-focus-active-indicator-height, 3px);--_focus-input-text-color: var(--md-filled-text-field-focus-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_focus-label-text-color: var(--md-filled-text-field-focus-label-text-color, var(--md-sys-color-primary, #6750a4));--_focus-leading-icon-color: var(--md-filled-text-field-focus-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_focus-supporting-text-color: var(--md-filled-text-field-focus-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_focus-trailing-icon-color: var(--md-filled-text-field-focus-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-active-indicator-color: var(--md-filled-text-field-hover-active-indicator-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-active-indicator-height: var(--md-filled-text-field-hover-active-indicator-height, 1px);--_hover-input-text-color: var(--md-filled-text-field-hover-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-label-text-color: var(--md-filled-text-field-hover-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-leading-icon-color: var(--md-filled-text-field-hover-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-state-layer-color: var(--md-filled-text-field-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-state-layer-opacity: var(--md-filled-text-field-hover-state-layer-opacity, 0.08);--_hover-supporting-text-color: var(--md-filled-text-field-hover-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-trailing-icon-color: var(--md-filled-text-field-hover-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_input-text-color: var(--md-filled-text-field-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_input-text-font: var(--md-filled-text-field-input-text-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));--_input-text-line-height: var(--md-filled-text-field-input-text-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));--_input-text-placeholder-color: var(--md-filled-text-field-input-text-placeholder-color, var(--md-sys-color-on-surface-variant, #49454f));--_input-text-prefix-color: var(--md-filled-text-field-input-text-prefix-color, var(--md-sys-color-on-surface-variant, #49454f));--_input-text-size: var(--md-filled-text-field-input-text-size, var(--md-sys-typescale-body-large-size, 1rem));--_input-text-suffix-color: var(--md-filled-text-field-input-text-suffix-color, var(--md-sys-color-on-surface-variant, #49454f));--_input-text-weight: var(--md-filled-text-field-input-text-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));--_label-text-color: var(--md-filled-text-field-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_label-text-font: var(--md-filled-text-field-label-text-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-filled-text-field-label-text-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));--_label-text-populated-line-height: var(--md-filled-text-field-label-text-populated-line-height, var(--md-sys-typescale-body-small-line-height, 1rem));--_label-text-populated-size: var(--md-filled-text-field-label-text-populated-size, var(--md-sys-typescale-body-small-size, 0.75rem));--_label-text-size: var(--md-filled-text-field-label-text-size, var(--md-sys-typescale-body-large-size, 1rem));--_label-text-weight: var(--md-filled-text-field-label-text-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));--_leading-icon-color: var(--md-filled-text-field-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_leading-icon-size: var(--md-filled-text-field-leading-icon-size, 24px);--_supporting-text-color: var(--md-filled-text-field-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_supporting-text-font: var(--md-filled-text-field-supporting-text-font, var(--md-sys-typescale-body-small-font, var(--md-ref-typeface-plain, Roboto)));--_supporting-text-line-height: var(--md-filled-text-field-supporting-text-line-height, var(--md-sys-typescale-body-small-line-height, 1rem));--_supporting-text-size: var(--md-filled-text-field-supporting-text-size, var(--md-sys-typescale-body-small-size, 0.75rem));--_supporting-text-weight: var(--md-filled-text-field-supporting-text-weight, var(--md-sys-typescale-body-small-weight, var(--md-ref-typeface-weight-regular, 400)));--_trailing-icon-color: var(--md-filled-text-field-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_trailing-icon-size: var(--md-filled-text-field-trailing-icon-size, 24px);--_container-shape-start-start: var(--md-filled-text-field-container-shape-start-start, var(--md-filled-text-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_container-shape-start-end: var(--md-filled-text-field-container-shape-start-end, var(--md-filled-text-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_container-shape-end-end: var(--md-filled-text-field-container-shape-end-end, var(--md-filled-text-field-container-shape, var(--md-sys-shape-corner-none, 0px)));--_container-shape-end-start: var(--md-filled-text-field-container-shape-end-start, var(--md-filled-text-field-container-shape, var(--md-sys-shape-corner-none, 0px)));--_icon-input-space: var(--md-filled-text-field-icon-input-space, 16px);--_leading-space: var(--md-filled-text-field-leading-space, 16px);--_trailing-space: var(--md-filled-text-field-trailing-space, 16px);--_top-space: var(--md-filled-text-field-top-space, 16px);--_bottom-space: var(--md-filled-text-field-bottom-space, 16px);--_input-text-prefix-trailing-space: var(--md-filled-text-field-input-text-prefix-trailing-space, 2px);--_input-text-suffix-leading-space: var(--md-filled-text-field-input-text-suffix-leading-space, 2px);--_with-label-top-space: var(--md-filled-text-field-with-label-top-space, 8px);--_with-label-bottom-space: var(--md-filled-text-field-with-label-bottom-space, 8px);--_focus-caret-color: var(--md-filled-text-field-focus-caret-color, var(--md-sys-color-primary, #6750a4));--_with-leading-icon-leading-space: var(--md-filled-text-field-with-leading-icon-leading-space, 12px);--_with-trailing-icon-trailing-space: var(--md-filled-text-field-with-trailing-icon-trailing-space, 12px);--md-filled-field-active-indicator-color: var(--_active-indicator-color);--md-filled-field-active-indicator-height: var(--_active-indicator-height);--md-filled-field-bottom-space: var(--_bottom-space);--md-filled-field-container-color: var(--_container-color);--md-filled-field-container-shape-end-end: var(--_container-shape-end-end);--md-filled-field-container-shape-end-start: var(--_container-shape-end-start);--md-filled-field-container-shape-start-end: var(--_container-shape-start-end);--md-filled-field-container-shape-start-start: var(--_container-shape-start-start);--md-filled-field-content-color: var(--_input-text-color);--md-filled-field-content-font: var(--_input-text-font);--md-filled-field-content-line-height: var(--_input-text-line-height);--md-filled-field-content-size: var(--_input-text-size);--md-filled-field-content-space: var(--_icon-input-space);--md-filled-field-content-weight: var(--_input-text-weight);--md-filled-field-disabled-active-indicator-color: var(--_disabled-active-indicator-color);--md-filled-field-disabled-active-indicator-height: var(--_disabled-active-indicator-height);--md-filled-field-disabled-active-indicator-opacity: var(--_disabled-active-indicator-opacity);--md-filled-field-disabled-container-color: var(--_disabled-container-color);--md-filled-field-disabled-container-opacity: var(--_disabled-container-opacity);--md-filled-field-disabled-content-color: var(--_disabled-input-text-color);--md-filled-field-disabled-content-opacity: var(--_disabled-input-text-opacity);--md-filled-field-disabled-label-text-color: var(--_disabled-label-text-color);--md-filled-field-disabled-label-text-opacity: var(--_disabled-label-text-opacity);--md-filled-field-disabled-leading-content-color: var(--_disabled-leading-icon-color);--md-filled-field-disabled-leading-content-opacity: var(--_disabled-leading-icon-opacity);--md-filled-field-disabled-supporting-text-color: var(--_disabled-supporting-text-color);--md-filled-field-disabled-supporting-text-opacity: var(--_disabled-supporting-text-opacity);--md-filled-field-disabled-trailing-content-color: var(--_disabled-trailing-icon-color);--md-filled-field-disabled-trailing-content-opacity: var(--_disabled-trailing-icon-opacity);--md-filled-field-error-active-indicator-color: var(--_error-active-indicator-color);--md-filled-field-error-content-color: var(--_error-input-text-color);--md-filled-field-error-focus-active-indicator-color: var(--_error-focus-active-indicator-color);--md-filled-field-error-focus-content-color: var(--_error-focus-input-text-color);--md-filled-field-error-focus-label-text-color: var(--_error-focus-label-text-color);--md-filled-field-error-focus-leading-content-color: var(--_error-focus-leading-icon-color);--md-filled-field-error-focus-supporting-text-color: var(--_error-focus-supporting-text-color);--md-filled-field-error-focus-trailing-content-color: var(--_error-focus-trailing-icon-color);--md-filled-field-error-hover-active-indicator-color: var(--_error-hover-active-indicator-color);--md-filled-field-error-hover-content-color: var(--_error-hover-input-text-color);--md-filled-field-error-hover-label-text-color: var(--_error-hover-label-text-color);--md-filled-field-error-hover-leading-content-color: var(--_error-hover-leading-icon-color);--md-filled-field-error-hover-state-layer-color: var(--_error-hover-state-layer-color);--md-filled-field-error-hover-state-layer-opacity: var(--_error-hover-state-layer-opacity);--md-filled-field-error-hover-supporting-text-color: var(--_error-hover-supporting-text-color);--md-filled-field-error-hover-trailing-content-color: var(--_error-hover-trailing-icon-color);--md-filled-field-error-label-text-color: var(--_error-label-text-color);--md-filled-field-error-leading-content-color: var(--_error-leading-icon-color);--md-filled-field-error-supporting-text-color: var(--_error-supporting-text-color);--md-filled-field-error-trailing-content-color: var(--_error-trailing-icon-color);--md-filled-field-focus-active-indicator-color: var(--_focus-active-indicator-color);--md-filled-field-focus-active-indicator-height: var(--_focus-active-indicator-height);--md-filled-field-focus-content-color: var(--_focus-input-text-color);--md-filled-field-focus-label-text-color: var(--_focus-label-text-color);--md-filled-field-focus-leading-content-color: var(--_focus-leading-icon-color);--md-filled-field-focus-supporting-text-color: var(--_focus-supporting-text-color);--md-filled-field-focus-trailing-content-color: var(--_focus-trailing-icon-color);--md-filled-field-hover-active-indicator-color: var(--_hover-active-indicator-color);--md-filled-field-hover-active-indicator-height: var(--_hover-active-indicator-height);--md-filled-field-hover-content-color: var(--_hover-input-text-color);--md-filled-field-hover-label-text-color: var(--_hover-label-text-color);--md-filled-field-hover-leading-content-color: var(--_hover-leading-icon-color);--md-filled-field-hover-state-layer-color: var(--_hover-state-layer-color);--md-filled-field-hover-state-layer-opacity: var(--_hover-state-layer-opacity);--md-filled-field-hover-supporting-text-color: var(--_hover-supporting-text-color);--md-filled-field-hover-trailing-content-color: var(--_hover-trailing-icon-color);--md-filled-field-label-text-color: var(--_label-text-color);--md-filled-field-label-text-font: var(--_label-text-font);--md-filled-field-label-text-line-height: var(--_label-text-line-height);--md-filled-field-label-text-populated-line-height: var(--_label-text-populated-line-height);--md-filled-field-label-text-populated-size: var(--_label-text-populated-size);--md-filled-field-label-text-size: var(--_label-text-size);--md-filled-field-label-text-weight: var(--_label-text-weight);--md-filled-field-leading-content-color: var(--_leading-icon-color);--md-filled-field-leading-space: var(--_leading-space);--md-filled-field-supporting-text-color: var(--_supporting-text-color);--md-filled-field-supporting-text-font: var(--_supporting-text-font);--md-filled-field-supporting-text-line-height: var(--_supporting-text-line-height);--md-filled-field-supporting-text-size: var(--_supporting-text-size);--md-filled-field-supporting-text-weight: var(--_supporting-text-weight);--md-filled-field-top-space: var(--_top-space);--md-filled-field-trailing-content-color: var(--_trailing-icon-color);--md-filled-field-trailing-space: var(--_trailing-space);--md-filled-field-with-label-bottom-space: var(--_with-label-bottom-space);--md-filled-field-with-label-top-space: var(--_with-label-top-space);--md-filled-field-with-leading-content-leading-space: var(--_with-leading-icon-leading-space);--md-filled-field-with-trailing-content-trailing-space: var(--_with-trailing-icon-trailing-space)}
`;
class z extends U {
  constructor() {
    super(...arguments), this.disabled = !1, this.error = !1, this.focused = !1, this.label = "", this.noAsterisk = !1, this.populated = !1, this.required = !1, this.resizable = !1, this.supportingText = "", this.errorText = "", this.count = -1, this.max = -1, this.hasStart = !1, this.hasEnd = !1, this.isAnimating = !1, this.refreshErrorAlert = !1, this.disableTransitions = !1;
  }
  get counterText() {
    const t = this.count ?? -1, e = this.max ?? -1;
    return t < 0 || e <= 0 ? "" : `${t} / ${e}`;
  }
  get supportingOrErrorText() {
    return this.error && this.errorText ? this.errorText : this.supportingText;
  }
  /**
   * Re-announces the field's error supporting text to screen readers.
   *
   * Error text announces to screen readers anytime it is visible and changes.
   * Use the method to re-announce the message when the text has not changed,
   * but announcement is still needed (such as for `reportValidity()`).
   */
  reannounceError() {
    this.refreshErrorAlert = !0;
  }
  update(t) {
    t.has("disabled") && t.get("disabled") !== void 0 && (this.disableTransitions = !0), this.disabled && this.focused && (t.set("focused", !0), this.focused = !1), this.animateLabelIfNeeded({
      wasFocused: t.get("focused"),
      wasPopulated: t.get("populated")
    }), super.update(t);
  }
  render() {
    const t = this.renderLabel(
      /*isFloating*/
      !0
    ), e = this.renderLabel(
      /*isFloating*/
      !1
    ), r = this.renderOutline?.(t), o = {
      disabled: this.disabled,
      "disable-transitions": this.disableTransitions,
      error: this.error && !this.disabled,
      focused: this.focused,
      "with-start": this.hasStart,
      "with-end": this.hasEnd,
      populated: this.populated,
      resizable: this.resizable,
      required: this.required,
      "no-label": !this.label
    };
    return g`
      <div class="field ${ne(o)}">
        <div class="container-overflow">
          ${this.renderBackground?.()}
          <slot name="container"></slot>
          ${this.renderStateLayer?.()} ${this.renderIndicator?.()} ${r}
          <div class="container">
            <div class="start">
              <slot name="start"></slot>
            </div>
            <div class="middle">
              <div class="label-wrapper">
                ${e} ${r ? A : t}
              </div>
              <div class="content">
                <slot></slot>
              </div>
            </div>
            <div class="end">
              <slot name="end"></slot>
            </div>
          </div>
        </div>
        ${this.renderSupportingText()}
      </div>
    `;
  }
  updated(t) {
    (t.has("supportingText") || t.has("errorText") || t.has("count") || t.has("max")) && this.updateSlottedAriaDescribedBy(), this.refreshErrorAlert && requestAnimationFrame(() => {
      this.refreshErrorAlert = !1;
    }), this.disableTransitions && requestAnimationFrame(() => {
      this.disableTransitions = !1;
    });
  }
  renderSupportingText() {
    const { supportingOrErrorText: t, counterText: e } = this;
    if (!t && !e)
      return A;
    const r = g`<span>${t}</span>`, o = e ? g`<span class="counter">${e}</span>` : A, s = this.error && this.errorText && !this.refreshErrorAlert ? "alert" : A;
    return g`
      <div class="supporting-text" role=${s}>${r}${o}</div>
      <slot
        name="aria-describedby"
        @slotchange=${this.updateSlottedAriaDescribedBy}></slot>
    `;
  }
  updateSlottedAriaDescribedBy() {
    for (const t of this.slottedAriaDescribedBy)
      Xr(g`${this.supportingOrErrorText} ${this.counterText}`, t), t.setAttribute("hidden", "");
  }
  renderLabel(t) {
    if (!this.label)
      return A;
    let e;
    t ? e = this.focused || this.populated || this.isAnimating : e = !this.focused && !this.populated && !this.isAnimating;
    const r = {
      hidden: !e,
      floating: t,
      resting: !t
    }, o = `${this.label}${this.required && !this.noAsterisk ? "*" : ""}`;
    return g`
      <span class="label ${ne(r)}" aria-hidden=${!e}
        >${o}</span
      >
    `;
  }
  animateLabelIfNeeded({ wasFocused: t, wasPopulated: e }) {
    if (!this.label)
      return;
    t ??= this.focused, e ??= this.populated;
    const r = t || e, o = this.focused || this.populated;
    r !== o && (this.isAnimating = !0, this.labelAnimation?.cancel(), this.labelAnimation = this.floatingLabelEl?.animate(this.getLabelKeyframes(), { duration: 150, easing: tt.STANDARD }), this.labelAnimation?.addEventListener("finish", () => {
      this.isAnimating = !1;
    }));
  }
  getLabelKeyframes() {
    const { floatingLabelEl: t, restingLabelEl: e } = this;
    if (!t || !e)
      return [];
    const { x: r, y: o, height: a } = t.getBoundingClientRect(), { x: s, y: n, height: c } = e.getBoundingClientRect(), l = t.scrollWidth, d = e.scrollWidth, v = d / l, p = s - r, f = n - o + Math.round((c - a * v) / 2), _ = `translateX(${p}px) translateY(${f}px) scale(${v})`, y = "translateX(0) translateY(0) scale(1)", x = e.clientWidth, E = d > x ? `${x / v}px` : "";
    return this.focused || this.populated ? [
      { transform: _, width: E },
      { transform: y, width: E }
    ] : [
      { transform: y, width: E },
      { transform: _, width: E }
    ];
  }
  getSurfacePositionClientRect() {
    return this.containerEl.getBoundingClientRect();
  }
}
h([
  u({ type: Boolean })
], z.prototype, "disabled", void 0);
h([
  u({ type: Boolean })
], z.prototype, "error", void 0);
h([
  u({ type: Boolean })
], z.prototype, "focused", void 0);
h([
  u()
], z.prototype, "label", void 0);
h([
  u({ type: Boolean, attribute: "no-asterisk" })
], z.prototype, "noAsterisk", void 0);
h([
  u({ type: Boolean })
], z.prototype, "populated", void 0);
h([
  u({ type: Boolean })
], z.prototype, "required", void 0);
h([
  u({ type: Boolean })
], z.prototype, "resizable", void 0);
h([
  u({ attribute: "supporting-text" })
], z.prototype, "supportingText", void 0);
h([
  u({ attribute: "error-text" })
], z.prototype, "errorText", void 0);
h([
  u({ type: Number })
], z.prototype, "count", void 0);
h([
  u({ type: Number })
], z.prototype, "max", void 0);
h([
  u({ type: Boolean, attribute: "has-start" })
], z.prototype, "hasStart", void 0);
h([
  u({ type: Boolean, attribute: "has-end" })
], z.prototype, "hasEnd", void 0);
h([
  Ie({ slot: "aria-describedby" })
], z.prototype, "slottedAriaDescribedBy", void 0);
h([
  P()
], z.prototype, "isAnimating", void 0);
h([
  P()
], z.prototype, "refreshErrorAlert", void 0);
h([
  P()
], z.prototype, "disableTransitions", void 0);
h([
  J(".label.floating")
], z.prototype, "floatingLabelEl", void 0);
h([
  J(".label.resting")
], z.prototype, "restingLabelEl", void 0);
h([
  J(".container")
], z.prototype, "containerEl", void 0);
class xl extends z {
  renderBackground() {
    return g` <div class="background"></div> `;
  }
  renderStateLayer() {
    return g` <div class="state-layer"></div> `;
  }
  renderIndicator() {
    return g`<div class="active-indicator"></div>`;
  }
}
const wl = N`@layer styles{:host{--_active-indicator-color: var(--md-filled-field-active-indicator-color, var(--md-sys-color-on-surface-variant, #49454f));--_active-indicator-height: var(--md-filled-field-active-indicator-height, 1px);--_bottom-space: var(--md-filled-field-bottom-space, 16px);--_container-color: var(--md-filled-field-container-color, var(--md-sys-color-surface-container-highest, #e6e0e9));--_content-color: var(--md-filled-field-content-color, var(--md-sys-color-on-surface, #1d1b20));--_content-font: var(--md-filled-field-content-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));--_content-line-height: var(--md-filled-field-content-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));--_content-size: var(--md-filled-field-content-size, var(--md-sys-typescale-body-large-size, 1rem));--_content-space: var(--md-filled-field-content-space, 16px);--_content-weight: var(--md-filled-field-content-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));--_disabled-active-indicator-color: var(--md-filled-field-disabled-active-indicator-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-active-indicator-height: var(--md-filled-field-disabled-active-indicator-height, 1px);--_disabled-active-indicator-opacity: var(--md-filled-field-disabled-active-indicator-opacity, 0.38);--_disabled-container-color: var(--md-filled-field-disabled-container-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-container-opacity: var(--md-filled-field-disabled-container-opacity, 0.04);--_disabled-content-color: var(--md-filled-field-disabled-content-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-content-opacity: var(--md-filled-field-disabled-content-opacity, 0.38);--_disabled-label-text-color: var(--md-filled-field-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-label-text-opacity: var(--md-filled-field-disabled-label-text-opacity, 0.38);--_disabled-leading-content-color: var(--md-filled-field-disabled-leading-content-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-leading-content-opacity: var(--md-filled-field-disabled-leading-content-opacity, 0.38);--_disabled-supporting-text-color: var(--md-filled-field-disabled-supporting-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-supporting-text-opacity: var(--md-filled-field-disabled-supporting-text-opacity, 0.38);--_disabled-trailing-content-color: var(--md-filled-field-disabled-trailing-content-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-trailing-content-opacity: var(--md-filled-field-disabled-trailing-content-opacity, 0.38);--_error-active-indicator-color: var(--md-filled-field-error-active-indicator-color, var(--md-sys-color-error, #b3261e));--_error-content-color: var(--md-filled-field-error-content-color, var(--md-sys-color-on-surface, #1d1b20));--_error-focus-active-indicator-color: var(--md-filled-field-error-focus-active-indicator-color, var(--md-sys-color-error, #b3261e));--_error-focus-content-color: var(--md-filled-field-error-focus-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_error-focus-label-text-color: var(--md-filled-field-error-focus-label-text-color, var(--md-sys-color-error, #b3261e));--_error-focus-leading-content-color: var(--md-filled-field-error-focus-leading-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_error-focus-supporting-text-color: var(--md-filled-field-error-focus-supporting-text-color, var(--md-sys-color-error, #b3261e));--_error-focus-trailing-content-color: var(--md-filled-field-error-focus-trailing-content-color, var(--md-sys-color-error, #b3261e));--_error-hover-active-indicator-color: var(--md-filled-field-error-hover-active-indicator-color, var(--md-sys-color-on-error-container, #410e0b));--_error-hover-content-color: var(--md-filled-field-error-hover-content-color, var(--md-sys-color-on-surface, #1d1b20));--_error-hover-label-text-color: var(--md-filled-field-error-hover-label-text-color, var(--md-sys-color-on-error-container, #410e0b));--_error-hover-leading-content-color: var(--md-filled-field-error-hover-leading-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_error-hover-state-layer-color: var(--md-filled-field-error-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_error-hover-state-layer-opacity: var(--md-filled-field-error-hover-state-layer-opacity, 0.08);--_error-hover-supporting-text-color: var(--md-filled-field-error-hover-supporting-text-color, var(--md-sys-color-error, #b3261e));--_error-hover-trailing-content-color: var(--md-filled-field-error-hover-trailing-content-color, var(--md-sys-color-on-error-container, #410e0b));--_error-label-text-color: var(--md-filled-field-error-label-text-color, var(--md-sys-color-error, #b3261e));--_error-leading-content-color: var(--md-filled-field-error-leading-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_error-supporting-text-color: var(--md-filled-field-error-supporting-text-color, var(--md-sys-color-error, #b3261e));--_error-trailing-content-color: var(--md-filled-field-error-trailing-content-color, var(--md-sys-color-error, #b3261e));--_focus-active-indicator-color: var(--md-filled-field-focus-active-indicator-color, var(--md-sys-color-primary, #6750a4));--_focus-active-indicator-height: var(--md-filled-field-focus-active-indicator-height, 3px);--_focus-content-color: var(--md-filled-field-focus-content-color, var(--md-sys-color-on-surface, #1d1b20));--_focus-label-text-color: var(--md-filled-field-focus-label-text-color, var(--md-sys-color-primary, #6750a4));--_focus-leading-content-color: var(--md-filled-field-focus-leading-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_focus-supporting-text-color: var(--md-filled-field-focus-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_focus-trailing-content-color: var(--md-filled-field-focus-trailing-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-active-indicator-color: var(--md-filled-field-hover-active-indicator-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-active-indicator-height: var(--md-filled-field-hover-active-indicator-height, 1px);--_hover-content-color: var(--md-filled-field-hover-content-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-label-text-color: var(--md-filled-field-hover-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-leading-content-color: var(--md-filled-field-hover-leading-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-state-layer-color: var(--md-filled-field-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-state-layer-opacity: var(--md-filled-field-hover-state-layer-opacity, 0.08);--_hover-supporting-text-color: var(--md-filled-field-hover-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_hover-trailing-content-color: var(--md-filled-field-hover-trailing-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_label-text-color: var(--md-filled-field-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_label-text-font: var(--md-filled-field-label-text-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-filled-field-label-text-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));--_label-text-populated-line-height: var(--md-filled-field-label-text-populated-line-height, var(--md-sys-typescale-body-small-line-height, 1rem));--_label-text-populated-size: var(--md-filled-field-label-text-populated-size, var(--md-sys-typescale-body-small-size, 0.75rem));--_label-text-size: var(--md-filled-field-label-text-size, var(--md-sys-typescale-body-large-size, 1rem));--_label-text-weight: var(--md-filled-field-label-text-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));--_leading-content-color: var(--md-filled-field-leading-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_leading-space: var(--md-filled-field-leading-space, 16px);--_supporting-text-color: var(--md-filled-field-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_supporting-text-font: var(--md-filled-field-supporting-text-font, var(--md-sys-typescale-body-small-font, var(--md-ref-typeface-plain, Roboto)));--_supporting-text-leading-space: var(--md-filled-field-supporting-text-leading-space, 16px);--_supporting-text-line-height: var(--md-filled-field-supporting-text-line-height, var(--md-sys-typescale-body-small-line-height, 1rem));--_supporting-text-size: var(--md-filled-field-supporting-text-size, var(--md-sys-typescale-body-small-size, 0.75rem));--_supporting-text-top-space: var(--md-filled-field-supporting-text-top-space, 4px);--_supporting-text-trailing-space: var(--md-filled-field-supporting-text-trailing-space, 16px);--_supporting-text-weight: var(--md-filled-field-supporting-text-weight, var(--md-sys-typescale-body-small-weight, var(--md-ref-typeface-weight-regular, 400)));--_top-space: var(--md-filled-field-top-space, 16px);--_trailing-content-color: var(--md-filled-field-trailing-content-color, var(--md-sys-color-on-surface-variant, #49454f));--_trailing-space: var(--md-filled-field-trailing-space, 16px);--_with-label-bottom-space: var(--md-filled-field-with-label-bottom-space, 8px);--_with-label-top-space: var(--md-filled-field-with-label-top-space, 8px);--_with-leading-content-leading-space: var(--md-filled-field-with-leading-content-leading-space, 12px);--_with-trailing-content-trailing-space: var(--md-filled-field-with-trailing-content-trailing-space, 12px);--_container-shape-start-start: var(--md-filled-field-container-shape-start-start, var(--md-filled-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_container-shape-start-end: var(--md-filled-field-container-shape-start-end, var(--md-filled-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_container-shape-end-end: var(--md-filled-field-container-shape-end-end, var(--md-filled-field-container-shape, var(--md-sys-shape-corner-none, 0px)));--_container-shape-end-start: var(--md-filled-field-container-shape-end-start, var(--md-filled-field-container-shape, var(--md-sys-shape-corner-none, 0px)))}.background,.state-layer{border-radius:inherit;inset:0;pointer-events:none;position:absolute}.background{background:var(--_container-color)}.state-layer{visibility:hidden}.field:not(.disabled):hover .state-layer{visibility:visible}.label.floating{position:absolute;top:var(--_with-label-top-space)}.field:not(.with-start) .label-wrapper{margin-inline-start:var(--_leading-space)}.field:not(.with-end) .label-wrapper{margin-inline-end:var(--_trailing-space)}.active-indicator{inset:auto 0 0 0;pointer-events:none;position:absolute;width:100%;z-index:1}.active-indicator::before,.active-indicator::after{border-bottom:var(--_active-indicator-height) solid var(--_active-indicator-color);inset:auto 0 0 0;content:"";position:absolute;width:100%}.active-indicator::after{opacity:0;transition:opacity 150ms cubic-bezier(0.2, 0, 0, 1)}.focused .active-indicator::after{opacity:1}.field:not(.with-start) .content ::slotted(*){padding-inline-start:var(--_leading-space)}.field:not(.with-end) .content ::slotted(*){padding-inline-end:var(--_trailing-space)}.field:not(.no-label) .content ::slotted(:not(textarea)){padding-bottom:var(--_with-label-bottom-space);padding-top:calc(var(--_with-label-top-space) + var(--_label-text-populated-line-height))}.field:not(.no-label) .content ::slotted(textarea){margin-bottom:var(--_with-label-bottom-space);margin-top:calc(var(--_with-label-top-space) + var(--_label-text-populated-line-height))}:hover .active-indicator::before{border-bottom-color:var(--_hover-active-indicator-color);border-bottom-width:var(--_hover-active-indicator-height)}.active-indicator::after{border-bottom-color:var(--_focus-active-indicator-color);border-bottom-width:var(--_focus-active-indicator-height)}:hover .state-layer{background:var(--_hover-state-layer-color);opacity:var(--_hover-state-layer-opacity)}.disabled .active-indicator::before{border-bottom-color:var(--_disabled-active-indicator-color);border-bottom-width:var(--_disabled-active-indicator-height);opacity:var(--_disabled-active-indicator-opacity)}.disabled .background{background:var(--_disabled-container-color);opacity:var(--_disabled-container-opacity)}.error .active-indicator::before{border-bottom-color:var(--_error-active-indicator-color)}.error:hover .active-indicator::before{border-bottom-color:var(--_error-hover-active-indicator-color)}.error:hover .state-layer{background:var(--_error-hover-state-layer-color);opacity:var(--_error-hover-state-layer-opacity)}.error .active-indicator::after{border-bottom-color:var(--_error-focus-active-indicator-color)}.resizable .container{bottom:var(--_focus-active-indicator-height);clip-path:inset(var(--_focus-active-indicator-height) 0 0 0)}.resizable .container>*{top:var(--_focus-active-indicator-height)}}@layer hcm{@media(forced-colors: active){.disabled .active-indicator::before{border-color:GrayText;opacity:1}}}
`;
const El = N`:host{display:inline-flex;resize:both}.field{display:flex;flex:1;flex-direction:column;writing-mode:horizontal-tb;max-width:100%}.container-overflow{border-start-start-radius:var(--_container-shape-start-start);border-start-end-radius:var(--_container-shape-start-end);border-end-end-radius:var(--_container-shape-end-end);border-end-start-radius:var(--_container-shape-end-start);display:flex;height:100%;position:relative}.container{align-items:center;border-radius:inherit;display:flex;flex:1;max-height:100%;min-height:100%;min-width:min-content;position:relative}.field,.container-overflow{resize:inherit}.resizable:not(.disabled) .container{resize:inherit;overflow:hidden}.disabled{pointer-events:none}slot[name=container]{border-radius:inherit}slot[name=container]::slotted(*){border-radius:inherit;inset:0;pointer-events:none;position:absolute}@layer styles{.start,.middle,.end{display:flex;box-sizing:border-box;height:100%;position:relative}.start{color:var(--_leading-content-color)}.end{color:var(--_trailing-content-color)}.start,.end{align-items:center;justify-content:center}.with-start .start{margin-inline:var(--_with-leading-content-leading-space) var(--_content-space)}.with-end .end{margin-inline:var(--_content-space) var(--_with-trailing-content-trailing-space)}.middle{align-items:stretch;align-self:baseline;flex:1}.content{color:var(--_content-color);display:flex;flex:1;opacity:0;transition:opacity 83ms cubic-bezier(0.2, 0, 0, 1)}.no-label .content,.focused .content,.populated .content{opacity:1;transition-delay:67ms}:is(.disabled,.disable-transitions) .content{transition:none}.content ::slotted(*){all:unset;color:currentColor;font-family:var(--_content-font);font-size:var(--_content-size);line-height:var(--_content-line-height);font-weight:var(--_content-weight);width:100%;overflow-wrap:revert;white-space:revert}.content ::slotted(:not(textarea)){padding-top:var(--_top-space);padding-bottom:var(--_bottom-space)}.content ::slotted(textarea){margin-top:var(--_top-space);margin-bottom:var(--_bottom-space)}:hover .content{color:var(--_hover-content-color)}:hover .start{color:var(--_hover-leading-content-color)}:hover .end{color:var(--_hover-trailing-content-color)}.focused .content{color:var(--_focus-content-color)}.focused .start{color:var(--_focus-leading-content-color)}.focused .end{color:var(--_focus-trailing-content-color)}.disabled .content{color:var(--_disabled-content-color)}.disabled.no-label .content,.disabled.focused .content,.disabled.populated .content{opacity:var(--_disabled-content-opacity)}.disabled .start{color:var(--_disabled-leading-content-color);opacity:var(--_disabled-leading-content-opacity)}.disabled .end{color:var(--_disabled-trailing-content-color);opacity:var(--_disabled-trailing-content-opacity)}.error .content{color:var(--_error-content-color)}.error .start{color:var(--_error-leading-content-color)}.error .end{color:var(--_error-trailing-content-color)}.error:hover .content{color:var(--_error-hover-content-color)}.error:hover .start{color:var(--_error-hover-leading-content-color)}.error:hover .end{color:var(--_error-hover-trailing-content-color)}.error.focused .content{color:var(--_error-focus-content-color)}.error.focused .start{color:var(--_error-focus-leading-content-color)}.error.focused .end{color:var(--_error-focus-trailing-content-color)}}@layer hcm{@media(forced-colors: active){.disabled :is(.start,.content,.end){color:GrayText;opacity:1}}}@layer styles{.label{box-sizing:border-box;color:var(--_label-text-color);overflow:hidden;max-width:100%;text-overflow:ellipsis;white-space:nowrap;z-index:1;font-family:var(--_label-text-font);font-size:var(--_label-text-size);line-height:var(--_label-text-line-height);font-weight:var(--_label-text-weight);width:min-content}.label-wrapper{inset:0;pointer-events:none;position:absolute}.label.resting{position:absolute;top:var(--_top-space)}.label.floating{font-size:var(--_label-text-populated-size);line-height:var(--_label-text-populated-line-height);transform-origin:top left}.label.hidden{opacity:0}.no-label .label{display:none}.label-wrapper{inset:0;position:absolute;text-align:initial}:hover .label{color:var(--_hover-label-text-color)}.focused .label{color:var(--_focus-label-text-color)}.disabled .label{color:var(--_disabled-label-text-color)}.disabled .label:not(.hidden){opacity:var(--_disabled-label-text-opacity)}.error .label{color:var(--_error-label-text-color)}.error:hover .label{color:var(--_error-hover-label-text-color)}.error.focused .label{color:var(--_error-focus-label-text-color)}}@layer hcm{@media(forced-colors: active){.disabled .label:not(.hidden){color:GrayText;opacity:1}}}@layer styles{.supporting-text{color:var(--_supporting-text-color);display:flex;font-family:var(--_supporting-text-font);font-size:var(--_supporting-text-size);line-height:var(--_supporting-text-line-height);font-weight:var(--_supporting-text-weight);gap:16px;justify-content:space-between;padding-inline-start:var(--_supporting-text-leading-space);padding-inline-end:var(--_supporting-text-trailing-space);padding-top:var(--_supporting-text-top-space)}.supporting-text :nth-child(2){flex-shrink:0}:hover .supporting-text{color:var(--_hover-supporting-text-color)}.focus .supporting-text{color:var(--_focus-supporting-text-color)}.disabled .supporting-text{color:var(--_disabled-supporting-text-color);opacity:var(--_disabled-supporting-text-opacity)}.error .supporting-text{color:var(--_error-supporting-text-color)}.error:hover .supporting-text{color:var(--_error-hover-supporting-text-color)}.error.focus .supporting-text{color:var(--_error-focus-supporting-text-color)}}@layer hcm{@media(forced-colors: active){.disabled .supporting-text{color:GrayText;opacity:1}}}
`;
let Ai = class extends xl {
};
Ai.styles = [El, wl];
Ai = h([
  Mt("md-filled-field")
], Ai);
const Sl = (i) => i.strings === void 0, kl = {}, Al = (i, t = kl) => i._$AH = t;
const Fr = Yr(class extends jr {
  constructor(i) {
    if (super(i), i.type !== Le.PROPERTY && i.type !== Le.ATTRIBUTE && i.type !== Le.BOOLEAN_ATTRIBUTE) throw Error("The `live` directive is not allowed on child or event bindings");
    if (!Sl(i)) throw Error("`live` bindings can only contain a single expression");
  }
  render(i) {
    return i;
  }
  update(i, [t]) {
    if (t === it || t === A) return t;
    const e = i.element, r = i.name;
    if (i.type === Le.PROPERTY) {
      if (t === e[r]) return it;
    } else if (i.type === Le.BOOLEAN_ATTRIBUTE) {
      if (!!t === e.hasAttribute(r)) return it;
    } else if (i.type === Le.ATTRIBUTE && e.getAttribute(r) === t + "") return it;
    return Al(i), t;
  }
});
const qo = "important", Tl = " !" + qo, Bt = Yr(class extends jr {
  constructor(i) {
    if (super(i), i.type !== Le.ATTRIBUTE || i.name !== "style" || i.strings?.length > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
  }
  render(i) {
    return Object.keys(i).reduce((t, e) => {
      const r = i[e];
      return r == null ? t : t + `${e = e.includes("-") ? e : e.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, "-$&").toLowerCase()}:${r};`;
    }, "");
  }
  update(i, [t]) {
    const { style: e } = i.element;
    if (this.ft === void 0) return this.ft = new Set(Object.keys(t)), this.render(t);
    for (const r of this.ft) t[r] == null && (this.ft.delete(r), r.includes("-") ? e.removeProperty(r) : e[r] = null);
    for (const r in t) {
      const o = t[r];
      if (o != null) {
        this.ft.add(r);
        const a = typeof o == "string" && o.endsWith(Tl);
        r.includes("-") || a ? e.setProperty(r, a ? o.slice(0, -11) : o, a ? qo : "") : e[r] = o;
      }
    }
    return it;
  }
});
const Cl = {
  fromAttribute(i) {
    return i ?? "";
  },
  toAttribute(i) {
    return i || null;
  }
};
const zt = /* @__PURE__ */ Symbol("onReportValidity"), Ct = /* @__PURE__ */ Symbol("privateCleanupFormListeners"), It = /* @__PURE__ */ Symbol("privateDoNotReportInvalid"), Rt = /* @__PURE__ */ Symbol("privateIsSelfReportingValidity"), $t = /* @__PURE__ */ Symbol("privateCallOnReportValidity");
function Go(i) {
  var t, e, r;
  class o extends i {
    // Mixins must have a constructor with `...args: any[]`
    // tslint:disable-next-line:no-any
    constructor(...s) {
      super(...s), this[t] = new AbortController(), this[e] = !1, this[r] = !1, this.addEventListener("invalid", (n) => {
        this[It] || !n.isTrusted || this.addEventListener("invalid", () => {
          this[$t](n);
        }, { once: !0 });
      }, {
        // Listen during the capture phase, which will happen before the
        // bubbling phase. That way, we can add a final event listener that
        // will run after other event listeners, and we can check if it was
        // default prevented. This works because invalid does not bubble.
        capture: !0
      });
    }
    checkValidity() {
      this[It] = !0;
      const s = super.checkValidity();
      return this[It] = !1, s;
    }
    reportValidity() {
      this[Rt] = !0;
      const s = super.reportValidity();
      return s && this[$t](null), this[Rt] = !1, s;
    }
    [(t = Ct, e = It, r = Rt, $t)](s) {
      const n = s?.defaultPrevented;
      n || (this[zt](s), !(!n && s?.defaultPrevented)) || (this[Rt] || $l(this[te].form, this)) && this.focus();
    }
    [zt](s) {
      throw new Error("Implement [onReportValidity]");
    }
    formAssociatedCallback(s) {
      super.formAssociatedCallback && super.formAssociatedCallback(s), this[Ct].abort(), s && (this[Ct] = new AbortController(), Il(this, s, () => {
        this[$t](null);
      }, this[Ct].signal));
    }
  }
  return o;
}
function Il(i, t, e, r) {
  const o = Rl(t);
  let a = !1, s, n = !1;
  o.addEventListener("before", () => {
    n = !0, s = new AbortController(), a = !1, i.addEventListener("invalid", () => {
      a = !0;
    }, {
      signal: s.signal
    });
  }, { signal: r }), o.addEventListener("after", () => {
    n = !1, s?.abort(), !a && e();
  }, { signal: r }), t.addEventListener("submit", () => {
    n || e();
  }, {
    signal: r
  });
}
const ui = /* @__PURE__ */ new WeakMap();
function Rl(i) {
  if (!ui.has(i)) {
    const t = new EventTarget();
    ui.set(i, t);
    for (const e of ["reportValidity", "requestSubmit"]) {
      const r = i[e];
      i[e] = function() {
        t.dispatchEvent(new Event("before"));
        const o = Reflect.apply(r, this, arguments);
        return t.dispatchEvent(new Event("after")), o;
      };
    }
  }
  return ui.get(i);
}
function $l(i, t) {
  if (!i)
    return !0;
  let e;
  for (const r of i.elements)
    if (r.matches(":invalid")) {
      e = r;
      break;
    }
  return e === t;
}
class Ll extends Fi {
  computeValidity({ state: t, renderedControl: e }) {
    let r = e;
    Qe(t) && !r ? (r = this.inputControl || document.createElement("input"), this.inputControl = r) : r || (r = this.textAreaControl || document.createElement("textarea"), this.textAreaControl = r);
    const o = Qe(t) ? r : null;
    if (o && (o.type = t.type), r.value !== t.value && (r.value = t.value), r.required = t.required, o) {
      const a = t;
      a.pattern ? o.pattern = a.pattern : o.removeAttribute("pattern"), a.min ? o.min = a.min : o.removeAttribute("min"), a.max ? o.max = a.max : o.removeAttribute("max"), a.step ? o.step = a.step : o.removeAttribute("step");
    }
    return (t.minLength ?? -1) > -1 ? r.setAttribute("minlength", String(t.minLength)) : r.removeAttribute("minlength"), (t.maxLength ?? -1) > -1 ? r.setAttribute("maxlength", String(t.maxLength)) : r.removeAttribute("maxlength"), {
      validity: r.validity,
      validationMessage: r.validationMessage
    };
  }
  equals({ state: t }, { state: e }) {
    const r = t.type === e.type && t.value === e.value && t.required === e.required && t.minLength === e.minLength && t.maxLength === e.maxLength;
    return !Qe(t) || !Qe(e) ? r : r && t.pattern === e.pattern && t.min === e.min && t.max === e.max && t.step === e.step;
  }
  copy({ state: t }) {
    return {
      state: Qe(t) ? this.copyInput(t) : this.copyTextArea(t),
      renderedControl: null
    };
  }
  copyInput(t) {
    const { type: e, pattern: r, min: o, max: a, step: s } = t;
    return {
      ...this.copySharedState(t),
      type: e,
      pattern: r,
      min: o,
      max: a,
      step: s
    };
  }
  copyTextArea(t) {
    return {
      ...this.copySharedState(t),
      type: t.type
    };
  }
  copySharedState({ value: t, required: e, minLength: r, maxLength: o }) {
    return { value: t, required: e, minLength: r, maxLength: o };
  }
}
function Qe(i) {
  return i.type !== "textarea";
}
const Dl = ze(Go(Oi(Pi(Ut(U)))));
class $ extends Dl {
  constructor() {
    super(...arguments), this.error = !1, this.errorText = "", this.label = "", this.noAsterisk = !1, this.required = !1, this.value = "", this.prefixText = "", this.suffixText = "", this.hasLeadingIcon = !1, this.hasTrailingIcon = !1, this.supportingText = "", this.textDirection = "", this.rows = 2, this.cols = 20, this.inputMode = "", this.max = "", this.maxLength = -1, this.min = "", this.minLength = -1, this.noSpinner = !1, this.pattern = "", this.placeholder = "", this.readOnly = !1, this.multiple = !1, this.step = "", this.type = "text", this.autocomplete = "", this.dirty = !1, this.focused = !1, this.nativeError = !1, this.nativeErrorText = "";
  }
  /**
   * Gets or sets the direction in which selection occurred.
   */
  get selectionDirection() {
    return this.getInputOrTextarea().selectionDirection;
  }
  set selectionDirection(t) {
    this.getInputOrTextarea().selectionDirection = t;
  }
  /**
   * Gets or sets the end position or offset of a text selection.
   */
  get selectionEnd() {
    return this.getInputOrTextarea().selectionEnd;
  }
  set selectionEnd(t) {
    this.getInputOrTextarea().selectionEnd = t;
  }
  /**
   * Gets or sets the starting position or offset of a text selection.
   */
  get selectionStart() {
    return this.getInputOrTextarea().selectionStart;
  }
  set selectionStart(t) {
    this.getInputOrTextarea().selectionStart = t;
  }
  /**
   * The text field's value as a number.
   */
  get valueAsNumber() {
    const t = this.getInput();
    return t ? t.valueAsNumber : NaN;
  }
  set valueAsNumber(t) {
    const e = this.getInput();
    e && (e.valueAsNumber = t, this.value = e.value);
  }
  /**
   * The text field's value as a Date.
   */
  get valueAsDate() {
    const t = this.getInput();
    return t ? t.valueAsDate : null;
  }
  set valueAsDate(t) {
    const e = this.getInput();
    e && (e.valueAsDate = t, this.value = e.value);
  }
  get hasError() {
    return this.error || this.nativeError;
  }
  /**
   * Selects all the text in the text field.
   *
   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select
   */
  select() {
    this.getInputOrTextarea().select();
  }
  setRangeText(...t) {
    this.getInputOrTextarea().setRangeText(...t), this.value = this.getInputOrTextarea().value;
  }
  /**
   * Sets the start and end positions of a selection in the text field.
   *
   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/setSelectionRange
   *
   * @param start The offset into the text field for the start of the selection.
   * @param end The offset into the text field for the end of the selection.
   * @param direction The direction in which the selection is performed.
   */
  setSelectionRange(t, e, r) {
    this.getInputOrTextarea().setSelectionRange(t, e, r);
  }
  /**
   * Decrements the value of a numeric type text field by `step` or `n` `step`
   * number of times.
   *
   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/stepDown
   *
   * @param stepDecrement The number of steps to decrement, defaults to 1.
   */
  stepDown(t) {
    const e = this.getInput();
    e && (e.stepDown(t), this.value = e.value);
  }
  /**
   * Increments the value of a numeric type text field by `step` or `n` `step`
   * number of times.
   *
   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/stepUp
   *
   * @param stepIncrement The number of steps to increment, defaults to 1.
   */
  stepUp(t) {
    const e = this.getInput();
    e && (e.stepUp(t), this.value = e.value);
  }
  /**
   * Reset the text field to its default value.
   */
  reset() {
    this.dirty = !1, this.value = this.getAttribute("value") ?? "", this.nativeError = !1, this.nativeErrorText = "";
  }
  attributeChangedCallback(t, e, r) {
    t === "value" && this.dirty || super.attributeChangedCallback(t, e, r);
  }
  render() {
    const t = {
      disabled: this.disabled,
      error: !this.disabled && this.hasError,
      textarea: this.type === "textarea",
      "no-spinner": this.noSpinner
    };
    return g`
      <span class="text-field ${ne(t)}">
        ${this.renderField()}
      </span>
    `;
  }
  updated(t) {
    const e = this.getInputOrTextarea().value;
    this.value !== e && (this.value = e);
  }
  renderField() {
    return Nt`<${this.fieldTag}
      class="field"
      count=${this.value.length}
      ?disabled=${this.disabled}
      ?error=${this.hasError}
      error-text=${this.getErrorText()}
      ?focused=${this.focused}
      ?has-end=${this.hasTrailingIcon}
      ?has-start=${this.hasLeadingIcon}
      label=${this.label}
      ?no-asterisk=${this.noAsterisk}
      max=${this.maxLength}
      ?populated=${!!this.value}
      ?required=${this.required}
      ?resizable=${this.type === "textarea"}
      supporting-text=${this.supportingText}
    >
      ${this.renderLeadingIcon()}
      ${this.renderInputOrTextarea()}
      ${this.renderTrailingIcon()}
      <div id="description" slot="aria-describedby"></div>
      <slot name="container" slot="container"></slot>
    </${this.fieldTag}>`;
  }
  renderLeadingIcon() {
    return g`
      <span class="icon leading" slot="start">
        <slot name="leading-icon" @slotchange=${this.handleIconChange}></slot>
      </span>
    `;
  }
  renderTrailingIcon() {
    return g`
      <span class="icon trailing" slot="end">
        <slot name="trailing-icon" @slotchange=${this.handleIconChange}></slot>
      </span>
    `;
  }
  renderInputOrTextarea() {
    const t = { direction: this.textDirection }, e = this.ariaLabel || this.label || A, r = this.autocomplete, o = (this.maxLength ?? -1) > -1, a = (this.minLength ?? -1) > -1;
    if (this.type === "textarea")
      return g`
        <textarea
          class="input"
          style=${Bt(t)}
          aria-describedby="description"
          aria-invalid=${this.hasError}
          aria-label=${e}
          autocomplete=${r || A}
          name=${this.name || A}
          ?disabled=${this.disabled}
          maxlength=${o ? this.maxLength : A}
          minlength=${a ? this.minLength : A}
          placeholder=${this.placeholder || A}
          ?readonly=${this.readOnly}
          ?required=${this.required}
          rows=${this.rows}
          cols=${this.cols}
          .value=${Fr(this.value)}
          @change=${this.redispatchEvent}
          @focus=${this.handleFocusChange}
          @blur=${this.handleFocusChange}
          @input=${this.handleInput}
          @select=${this.redispatchEvent}></textarea>
      `;
    const s = this.renderPrefix(), n = this.renderSuffix(), c = this.inputMode;
    return g`
      <div class="input-wrapper">
        ${s}
        <input
          class="input"
          style=${Bt(t)}
          aria-describedby="description"
          aria-invalid=${this.hasError}
          aria-label=${e}
          autocomplete=${r || A}
          name=${this.name || A}
          ?disabled=${this.disabled}
          inputmode=${c || A}
          max=${this.max || A}
          maxlength=${o ? this.maxLength : A}
          min=${this.min || A}
          minlength=${a ? this.minLength : A}
          pattern=${this.pattern || A}
          placeholder=${this.placeholder || A}
          ?readonly=${this.readOnly}
          ?required=${this.required}
          ?multiple=${this.multiple}
          step=${this.step || A}
          type=${this.type}
          .value=${Fr(this.value)}
          @change=${this.redispatchEvent}
          @focus=${this.handleFocusChange}
          @blur=${this.handleFocusChange}
          @input=${this.handleInput}
          @select=${this.redispatchEvent} />
        ${n}
      </div>
    `;
  }
  renderPrefix() {
    return this.renderAffix(
      this.prefixText,
      /* isSuffix */
      !1
    );
  }
  renderSuffix() {
    return this.renderAffix(
      this.suffixText,
      /* isSuffix */
      !0
    );
  }
  renderAffix(t, e) {
    return t ? g`<span class="${ne({
      suffix: e,
      prefix: !e
    })}">${t}</span>` : A;
  }
  getErrorText() {
    return this.error ? this.errorText : this.nativeErrorText;
  }
  handleFocusChange() {
    this.focused = this.inputOrTextarea?.matches(":focus") ?? !1;
  }
  handleInput(t) {
    this.dirty = !0, this.value = t.target.value;
  }
  redispatchEvent(t) {
    $i(this, t);
  }
  getInputOrTextarea() {
    return this.inputOrTextarea || (this.connectedCallback(), this.scheduleUpdate()), this.isUpdatePending && this.scheduleUpdate(), this.inputOrTextarea;
  }
  getInput() {
    return this.type === "textarea" ? null : this.getInputOrTextarea();
  }
  handleIconChange() {
    this.hasLeadingIcon = this.leadingIcons.length > 0, this.hasTrailingIcon = this.trailingIcons.length > 0;
  }
  [Ze]() {
    return this.value;
  }
  formResetCallback() {
    this.reset();
  }
  formStateRestoreCallback(t) {
    this.value = t;
  }
  focus() {
    this.getInputOrTextarea().focus();
  }
  [dt]() {
    return new Ll(() => ({
      state: this,
      renderedControl: this.inputOrTextarea
    }));
  }
  [ct]() {
    return this.inputOrTextarea;
  }
  [zt](t) {
    t?.preventDefault();
    const e = this.getErrorText();
    this.nativeError = !!t, this.nativeErrorText = this.validationMessage, e === this.getErrorText() && this.field?.reannounceError();
  }
}
$.shadowRootOptions = {
  ...U.shadowRootOptions,
  delegatesFocus: !0
};
h([
  u({ type: Boolean, reflect: !0 })
], $.prototype, "error", void 0);
h([
  u({ attribute: "error-text" })
], $.prototype, "errorText", void 0);
h([
  u()
], $.prototype, "label", void 0);
h([
  u({ type: Boolean, attribute: "no-asterisk" })
], $.prototype, "noAsterisk", void 0);
h([
  u({ type: Boolean, reflect: !0 })
], $.prototype, "required", void 0);
h([
  u()
], $.prototype, "value", void 0);
h([
  u({ attribute: "prefix-text" })
], $.prototype, "prefixText", void 0);
h([
  u({ attribute: "suffix-text" })
], $.prototype, "suffixText", void 0);
h([
  u({ type: Boolean, attribute: "has-leading-icon" })
], $.prototype, "hasLeadingIcon", void 0);
h([
  u({ type: Boolean, attribute: "has-trailing-icon" })
], $.prototype, "hasTrailingIcon", void 0);
h([
  u({ attribute: "supporting-text" })
], $.prototype, "supportingText", void 0);
h([
  u({ attribute: "text-direction" })
], $.prototype, "textDirection", void 0);
h([
  u({ type: Number })
], $.prototype, "rows", void 0);
h([
  u({ type: Number })
], $.prototype, "cols", void 0);
h([
  u({ reflect: !0 })
], $.prototype, "inputMode", void 0);
h([
  u()
], $.prototype, "max", void 0);
h([
  u({ type: Number })
], $.prototype, "maxLength", void 0);
h([
  u()
], $.prototype, "min", void 0);
h([
  u({ type: Number })
], $.prototype, "minLength", void 0);
h([
  u({ type: Boolean, attribute: "no-spinner" })
], $.prototype, "noSpinner", void 0);
h([
  u()
], $.prototype, "pattern", void 0);
h([
  u({ reflect: !0, converter: Cl })
], $.prototype, "placeholder", void 0);
h([
  u({ type: Boolean, reflect: !0 })
], $.prototype, "readOnly", void 0);
h([
  u({ type: Boolean, reflect: !0 })
], $.prototype, "multiple", void 0);
h([
  u()
], $.prototype, "step", void 0);
h([
  u({ reflect: !0 })
], $.prototype, "type", void 0);
h([
  u({ reflect: !0 })
], $.prototype, "autocomplete", void 0);
h([
  P()
], $.prototype, "dirty", void 0);
h([
  P()
], $.prototype, "focused", void 0);
h([
  P()
], $.prototype, "nativeError", void 0);
h([
  P()
], $.prototype, "nativeErrorText", void 0);
h([
  J(".input")
], $.prototype, "inputOrTextarea", void 0);
h([
  J(".field")
], $.prototype, "field", void 0);
h([
  Ie({ slot: "leading-icon" })
], $.prototype, "leadingIcons", void 0);
h([
  Ie({ slot: "trailing-icon" })
], $.prototype, "trailingIcons", void 0);
class Ol extends $ {
  constructor() {
    super(...arguments), this.fieldTag = ke`md-filled-field`;
  }
}
const Pl = N`:host{display:inline-flex;outline:none;resize:both;text-align:start;-webkit-tap-highlight-color:rgba(0,0,0,0)}.text-field,.field{width:100%}.text-field{display:inline-flex}.field{cursor:text}.disabled .field{cursor:default}.text-field,.textarea .field{resize:inherit}slot[name=container]{border-radius:inherit}.icon{color:currentColor;display:flex;align-items:center;justify-content:center;fill:currentColor;position:relative}.icon ::slotted(*){display:flex;position:absolute}[has-start] .icon.leading{font-size:var(--_leading-icon-size);height:var(--_leading-icon-size);width:var(--_leading-icon-size)}[has-end] .icon.trailing{font-size:var(--_trailing-icon-size);height:var(--_trailing-icon-size);width:var(--_trailing-icon-size)}.input-wrapper{display:flex}.input-wrapper>*{all:inherit;padding:0}.input{caret-color:var(--_caret-color);overflow-x:hidden;text-align:inherit}.input::placeholder{color:currentColor;opacity:1}.input::-webkit-calendar-picker-indicator{display:none}.input::-webkit-search-decoration,.input::-webkit-search-cancel-button{display:none}@media(forced-colors: active){.input{background:none}}.no-spinner .input::-webkit-inner-spin-button,.no-spinner .input::-webkit-outer-spin-button{display:none}.no-spinner .input[type=number]{-moz-appearance:textfield}:focus-within .input{caret-color:var(--_focus-caret-color)}.error:focus-within .input{caret-color:var(--_error-focus-caret-color)}.text-field:not(.disabled) .prefix{color:var(--_input-text-prefix-color)}.text-field:not(.disabled) .suffix{color:var(--_input-text-suffix-color)}.text-field:not(.disabled) .input::placeholder{color:var(--_input-text-placeholder-color)}.prefix,.suffix{text-wrap:nowrap;width:min-content}.prefix{padding-inline-end:var(--_input-text-prefix-trailing-space)}.suffix{padding-inline-start:var(--_input-text-suffix-leading-space)}
`;
class Ko extends Ol {
  constructor() {
    super(...arguments), this.fieldTag = ke`md-filled-field`;
  }
}
Ko.styles = [Pl, yl];
customElements.define("ew-filled-text-field", Ko);
class Fl extends U {
  connectedCallback() {
    super.connectedCallback(), this.setAttribute("aria-hidden", "true");
  }
  render() {
    return g`<span class="shadow"></span>`;
  }
}
const Bl = N`:host,.shadow,.shadow::before,.shadow::after{border-radius:inherit;inset:0;position:absolute;transition-duration:inherit;transition-property:inherit;transition-timing-function:inherit}:host{display:flex;pointer-events:none;transition-property:box-shadow,opacity}.shadow::before,.shadow::after{content:"";transition-property:box-shadow,opacity;--_level: var(--md-elevation-level, 0);--_shadow-color: var(--md-elevation-shadow-color, var(--md-sys-color-shadow, #000))}.shadow::before{box-shadow:0px calc(1px*(clamp(0,var(--_level),1) + clamp(0,var(--_level) - 3,1) + 2*clamp(0,var(--_level) - 4,1))) calc(1px*(2*clamp(0,var(--_level),1) + clamp(0,var(--_level) - 2,1) + clamp(0,var(--_level) - 4,1))) 0px var(--_shadow-color);opacity:.3}.shadow::after{box-shadow:0px calc(1px*(clamp(0,var(--_level),1) + clamp(0,var(--_level) - 1,1) + 2*clamp(0,var(--_level) - 2,3))) calc(1px*(3*clamp(0,var(--_level),2) + 2*clamp(0,var(--_level) - 2,3))) calc(1px*(clamp(0,var(--_level),4) + 2*clamp(0,var(--_level) - 4,1))) var(--_shadow-color);opacity:.15}
`;
let Ti = class extends Fl {
};
Ti.styles = [Bl];
Ti = h([
  Mt("md-elevation")
], Ti);
function zl(i, t) {
  return new CustomEvent("close-menu", {
    bubbles: !0,
    composed: !0,
    detail: { initiator: i, reason: t, itemPath: [i] }
  });
}
const Br = zl, Ci = {
  SPACE: "Space",
  ENTER: "Enter"
}, zr = {
  CLICK_SELECTION: "click-selection",
  KEYDOWN: "keydown"
}, Ml = {
  ESCAPE: "Escape",
  SPACE: Ci.SPACE,
  ENTER: Ci.ENTER
};
function Yo(i) {
  return Object.values(Ml).some((t) => t === i);
}
function Ul(i) {
  return Object.values(Ci).some((t) => t === i);
}
function Ii(i, t) {
  const e = new Event("md-contains", { bubbles: !0, composed: !0 });
  let r = [];
  const o = (s) => {
    r = s.composedPath();
  };
  return t.addEventListener("md-contains", o), i.dispatchEvent(e), t.removeEventListener("md-contains", o), r.length > 0;
}
const se = {
  NONE: "none",
  LIST_ROOT: "list-root",
  FIRST_ITEM: "first-item",
  LAST_ITEM: "last-item"
};
const Mr = {
  END_START: "end-start",
  START_START: "start-start"
};
class Nl {
  /**
   * @param host The host to connect the controller to.
   * @param getProperties A function that returns the properties for the
   * controller.
   */
  constructor(t, e) {
    this.host = t, this.getProperties = e, this.surfaceStylesInternal = {
      display: "none"
    }, this.lastValues = {
      isOpen: !1
    }, this.host.addController(this);
  }
  /**
   * The StyleInfo map to apply to the surface via Lit's stylemap
   */
  get surfaceStyles() {
    return this.surfaceStylesInternal;
  }
  /**
   * Calculates the surface's new position required so that the surface's
   * `surfaceCorner` aligns to the anchor's `anchorCorner` while keeping the
   * surface inside the window viewport. This positioning also respects RTL by
   * checking `getComputedStyle()` on the surface element.
   */
  async position() {
    const { surfaceEl: t, anchorEl: e, anchorCorner: r, surfaceCorner: o, positioning: a, xOffset: s, yOffset: n, disableBlockFlip: c, disableInlineFlip: l, repositionStrategy: d } = this.getProperties(), v = r.toLowerCase().trim(), p = o.toLowerCase().trim();
    if (!t || !e)
      return;
    const f = window.innerWidth, _ = window.innerHeight, y = document.createElement("div");
    y.style.opacity = "0", y.style.position = "fixed", y.style.display = "block", y.style.inset = "0", document.body.appendChild(y);
    const x = y.getBoundingClientRect();
    y.remove();
    const b = window.innerHeight - x.bottom, E = window.innerWidth - x.right;
    this.surfaceStylesInternal = {
      display: "block",
      opacity: "0"
    }, this.host.requestUpdate(), await this.host.updateComplete, t.popover && t.isConnected && t.showPopover();
    const S = t.getSurfacePositionClientRect ? t.getSurfacePositionClientRect() : t.getBoundingClientRect(), m = e.getSurfacePositionClientRect ? e.getSurfacePositionClientRect() : e.getBoundingClientRect(), [k, O] = p.split("-"), [w, I] = v.split("-"), R = getComputedStyle(t).direction === "ltr";
    let { blockInset: T, blockOutOfBoundsCorrection: C, surfaceBlockProperty: Q } = this.calculateBlock({
      surfaceRect: S,
      anchorRect: m,
      anchorBlock: w,
      surfaceBlock: k,
      yOffset: n,
      positioning: a,
      windowInnerHeight: _,
      blockScrollbarHeight: b
    });
    if (C && !c) {
      const jt = k === "start" ? "end" : "start", Xt = w === "start" ? "end" : "start", pe = this.calculateBlock({
        surfaceRect: S,
        anchorRect: m,
        anchorBlock: Xt,
        surfaceBlock: jt,
        yOffset: n,
        positioning: a,
        windowInnerHeight: _,
        blockScrollbarHeight: b
      });
      C > pe.blockOutOfBoundsCorrection && (T = pe.blockInset, C = pe.blockOutOfBoundsCorrection, Q = pe.surfaceBlockProperty);
    }
    let { inlineInset: xe, inlineOutOfBoundsCorrection: Y, surfaceInlineProperty: $e } = this.calculateInline({
      surfaceRect: S,
      anchorRect: m,
      anchorInline: I,
      surfaceInline: O,
      xOffset: s,
      positioning: a,
      isLTR: R,
      windowInnerWidth: f,
      inlineScrollbarWidth: E
    });
    if (Y && !l) {
      const jt = O === "start" ? "end" : "start", Xt = I === "start" ? "end" : "start", pe = this.calculateInline({
        surfaceRect: S,
        anchorRect: m,
        anchorInline: Xt,
        surfaceInline: jt,
        xOffset: s,
        positioning: a,
        isLTR: R,
        windowInnerWidth: f,
        inlineScrollbarWidth: E
      });
      Math.abs(Y) > Math.abs(pe.inlineOutOfBoundsCorrection) && (xe = pe.inlineInset, Y = pe.inlineOutOfBoundsCorrection, $e = pe.surfaceInlineProperty);
    }
    d === "move" && (T = T - C, xe = xe - Y), this.surfaceStylesInternal = {
      display: "block",
      opacity: "1",
      [Q]: `${T}px`,
      [$e]: `${xe}px`
    }, d === "resize" && (C && (this.surfaceStylesInternal.height = `${S.height - C}px`), Y && (this.surfaceStylesInternal.width = `${S.width - Y}px`)), this.host.requestUpdate();
  }
  /**
   * Calculates the css property, the inset, and the out of bounds correction
   * for the surface in the block direction.
   */
  calculateBlock(t) {
    const { surfaceRect: e, anchorRect: r, anchorBlock: o, surfaceBlock: a, yOffset: s, positioning: n, windowInnerHeight: c, blockScrollbarHeight: l } = t, d = n === "fixed" || n === "document" ? 1 : 0, v = n === "document" ? 1 : 0, p = a === "start" ? 1 : 0, f = a === "end" ? 1 : 0, y = (o !== a ? 1 : 0) * r.height + s, x = p * r.top + f * (c - r.bottom - l), b = p * window.scrollY - f * window.scrollY, E = Math.abs(Math.min(0, c - x - y - e.height));
    return { blockInset: d * x + v * b + y, blockOutOfBoundsCorrection: E, surfaceBlockProperty: a === "start" ? "inset-block-start" : "inset-block-end" };
  }
  /**
   * Calculates the css property, the inset, and the out of bounds correction
   * for the surface in the inline direction.
   */
  calculateInline(t) {
    const { isLTR: e, surfaceInline: r, anchorInline: o, anchorRect: a, surfaceRect: s, xOffset: n, positioning: c, windowInnerWidth: l, inlineScrollbarWidth: d } = t, v = c === "fixed" || c === "document" ? 1 : 0, p = c === "document" ? 1 : 0, f = e ? 1 : 0, _ = e ? 0 : 1, y = r === "start" ? 1 : 0, x = r === "end" ? 1 : 0, E = (o !== r ? 1 : 0) * a.width + n, S = y * a.left + x * (l - a.right - d), m = y * (l - a.right - d) + x * a.left, k = f * S + _ * m, O = y * window.scrollX - x * window.scrollX, w = x * window.scrollX - y * window.scrollX, I = f * O + _ * w, R = Math.abs(Math.min(0, l - k - E - s.width)), T = v * k + E + p * I;
    let C = r === "start" ? "inset-inline-start" : "inset-inline-end";
    return (c === "document" || c === "fixed") && (r === "start" && e || r === "end" && !e ? C = "left" : C = "right"), {
      inlineInset: T,
      inlineOutOfBoundsCorrection: R,
      surfaceInlineProperty: C
    };
  }
  hostUpdate() {
    this.onUpdate();
  }
  hostUpdated() {
    this.onUpdate();
  }
  /**
   * Checks whether the properties passed into the controller have changed since
   * the last positioning. If so, it will reposition if the surface is open or
   * close it if the surface should close.
   */
  async onUpdate() {
    const t = this.getProperties();
    let e = !1;
    for (const [s, n] of Object.entries(t))
      if (e = e || n !== this.lastValues[s], e)
        break;
    const r = this.lastValues.isOpen !== t.isOpen, o = !!t.anchorEl, a = !!t.surfaceEl;
    e && o && a && (this.lastValues.isOpen = t.isOpen, t.isOpen ? (this.lastValues = t, await this.position(), t.onOpen()) : r && (await t.beforeClose(), this.close(), t.onClose()));
  }
  /**
   * Hides the surface.
   */
  close() {
    this.surfaceStylesInternal = {
      display: "none"
    }, this.host.requestUpdate();
    const t = this.getProperties().surfaceEl;
    t?.popover && t?.isConnected && t.hidePopover();
  }
}
const ee = {
  INDEX: 0,
  ITEM: 1,
  TEXT: 2
};
class Hl {
  /**
   * @param getProperties A function that returns the options of the typeahead
   * controller:
   *
   * {
   *   getItems: A function that returns an array of menu items to be searched.
   *   typeaheadBufferTime: The maximum time between each keystroke to keep the
   *       current type buffer alive.
   * }
   */
  constructor(t) {
    this.getProperties = t, this.typeaheadRecords = [], this.typaheadBuffer = "", this.cancelTypeaheadTimeout = 0, this.isTypingAhead = !1, this.lastActiveRecord = null, this.onKeydown = (e) => {
      this.isTypingAhead ? this.typeahead(e) : this.beginTypeahead(e);
    }, this.endTypeahead = () => {
      this.isTypingAhead = !1, this.typaheadBuffer = "", this.typeaheadRecords = [];
    };
  }
  get items() {
    return this.getProperties().getItems();
  }
  get active() {
    return this.getProperties().active;
  }
  /**
   * Sets up typingahead
   */
  beginTypeahead(t) {
    this.active && (t.code === "Space" || t.code === "Enter" || t.code.startsWith("Arrow") || t.code === "Escape" || (this.isTypingAhead = !0, this.typeaheadRecords = this.items.map((e, r) => [
      r,
      e,
      e.typeaheadText.trim().toLowerCase()
    ]), this.lastActiveRecord = this.typeaheadRecords.find((e) => e[ee.ITEM].tabIndex === 0) ?? null, this.lastActiveRecord && (this.lastActiveRecord[ee.ITEM].tabIndex = -1), this.typeahead(t)));
  }
  /**
   * Performs the typeahead. Based on the normalized items and the current text
   * buffer, finds the _next_ item with matching text and activates it.
   *
   * @example
   *
   * items: Apple, Banana, Olive, Orange, Cucumber
   * buffer: ''
   * user types: o
   *
   * activates Olive
   *
   * @example
   *
   * items: Apple, Banana, Olive (active), Orange, Cucumber
   * buffer: 'o'
   * user types: l
   *
   * activates Olive
   *
   * @example
   *
   * items: Apple, Banana, Olive (active), Orange, Cucumber
   * buffer: ''
   * user types: o
   *
   * activates Orange
   *
   * @example
   *
   * items: Apple, Banana, Olive, Orange (active), Cucumber
   * buffer: ''
   * user types: o
   *
   * activates Olive
   */
  typeahead(t) {
    if (t.defaultPrevented)
      return;
    if (clearTimeout(this.cancelTypeaheadTimeout), t.code === "Enter" || t.code.startsWith("Arrow") || t.code === "Escape") {
      this.endTypeahead(), this.lastActiveRecord && (this.lastActiveRecord[ee.ITEM].tabIndex = -1);
      return;
    }
    t.code === "Space" && t.preventDefault(), this.cancelTypeaheadTimeout = setTimeout(this.endTypeahead, this.getProperties().typeaheadBufferTime), this.typaheadBuffer += t.key.toLowerCase();
    const e = this.lastActiveRecord ? this.lastActiveRecord[ee.INDEX] : -1, r = this.typeaheadRecords.length, o = (c) => (c[ee.INDEX] + r - e) % r, a = this.typeaheadRecords.filter((c) => !c[ee.ITEM].disabled && c[ee.TEXT].startsWith(this.typaheadBuffer)).sort((c, l) => o(c) - o(l));
    if (a.length === 0) {
      clearTimeout(this.cancelTypeaheadTimeout), this.lastActiveRecord && (this.lastActiveRecord[ee.ITEM].tabIndex = -1), this.endTypeahead();
      return;
    }
    const s = this.typaheadBuffer.length === 1;
    let n;
    this.lastActiveRecord === a[0] && s ? n = a[1] ?? a[0] : n = a[0], this.lastActiveRecord && (this.lastActiveRecord[ee.ITEM].tabIndex = -1), this.lastActiveRecord = n, n[ee.ITEM].tabIndex = 0, n[ee.ITEM].focus();
  }
}
const jo = 200, Xo = /* @__PURE__ */ new Set([
  V.ArrowDown,
  V.ArrowUp,
  V.Home,
  V.End
]), Zl = /* @__PURE__ */ new Set([
  V.ArrowLeft,
  V.ArrowRight,
  ...Xo
]);
function Vl(i = document) {
  let t = i.activeElement;
  for (; t && t?.shadowRoot?.activeElement; )
    t = t.shadowRoot.activeElement;
  return t;
}
class M extends U {
  /**
   * Whether the menu is animating upwards or downwards when opening. This is
   * helpful for calculating some animation calculations.
   */
  get openDirection() {
    return this.menuCorner.split("-")[0] === "start" ? "DOWN" : "UP";
  }
  /**
   * The element which the menu should align to. If `anchor` is set to a
   * non-empty idref string, then `anchorEl` will resolve to the element with
   * the given id in the same root node. Otherwise, `null`.
   */
  get anchorElement() {
    return this.anchor ? this.getRootNode().querySelector(`#${this.anchor}`) : this.currentAnchorElement;
  }
  set anchorElement(t) {
    this.currentAnchorElement = t, this.requestUpdate("anchorElement");
  }
  constructor() {
    super(), this.anchor = "", this.positioning = "absolute", this.quick = !1, this.hasOverflow = !1, this.open = !1, this.xOffset = 0, this.yOffset = 0, this.noHorizontalFlip = !1, this.noVerticalFlip = !1, this.typeaheadDelay = jo, this.anchorCorner = Mr.END_START, this.menuCorner = Mr.START_START, this.stayOpenOnOutsideClick = !1, this.stayOpenOnFocusout = !1, this.skipRestoreFocus = !1, this.defaultFocus = se.FIRST_ITEM, this.noNavigationWrap = !1, this.typeaheadActive = !0, this.isSubmenu = !1, this.pointerPath = [], this.isRepositioning = !1, this.openCloseAnimationSignal = na(), this.listController = new to({
      isItem: (t) => t.hasAttribute("md-menu-item"),
      getPossibleItems: () => this.slotItems,
      isRtl: () => getComputedStyle(this).direction === "rtl",
      deactivateItem: (t) => {
        t.selected = !1, t.tabIndex = -1;
      },
      activateItem: (t) => {
        t.selected = !0, t.tabIndex = 0;
      },
      isNavigableKey: (t) => {
        if (!this.isSubmenu)
          return Zl.has(t);
        const r = getComputedStyle(this).direction === "rtl" ? V.ArrowLeft : V.ArrowRight;
        return t === r ? !0 : Xo.has(t);
      },
      wrapNavigation: () => !this.noNavigationWrap
    }), this.lastFocusedElement = null, this.typeaheadController = new Hl(() => ({
      getItems: () => this.items,
      typeaheadBufferTime: this.typeaheadDelay,
      active: this.typeaheadActive
    })), this.currentAnchorElement = null, this.internals = // Cast needed for closure
    this.attachInternals(), this.menuPositionController = new Nl(this, () => ({
      anchorCorner: this.anchorCorner,
      surfaceCorner: this.menuCorner,
      surfaceEl: this.surfaceEl,
      anchorEl: this.anchorElement,
      positioning: this.positioning === "popover" ? "document" : this.positioning,
      isOpen: this.open,
      xOffset: this.xOffset,
      yOffset: this.yOffset,
      disableBlockFlip: this.noVerticalFlip,
      disableInlineFlip: this.noHorizontalFlip,
      onOpen: this.onOpened,
      beforeClose: this.beforeClose,
      onClose: this.onClosed,
      // We can't resize components that have overflow like menus with
      // submenus because the overflow-y will show menu items / content
      // outside the bounds of the menu. Popover API fixes this because each
      // submenu is hoisted to the top-layer and are not considered overflow
      // content.
      repositionStrategy: this.hasOverflow && this.positioning !== "popover" ? "move" : "resize"
    })), this.onWindowResize = () => {
      this.isRepositioning || this.positioning !== "document" && this.positioning !== "fixed" && this.positioning !== "popover" || (this.isRepositioning = !0, this.reposition(), this.isRepositioning = !1);
    }, this.handleFocusout = async (t) => {
      const e = this.anchorElement;
      if (this.stayOpenOnFocusout || !this.open || this.pointerPath.includes(e))
        return;
      if (t.relatedTarget) {
        if (Ii(t.relatedTarget, this) || this.pointerPath.length !== 0 && Ii(t.relatedTarget, e))
          return;
      } else if (this.pointerPath.includes(this))
        return;
      const r = this.skipRestoreFocus;
      this.skipRestoreFocus = !0, this.close(), await this.updateComplete, this.skipRestoreFocus = r;
    }, this.onOpened = async () => {
      this.lastFocusedElement = Vl();
      const t = this.items, e = at(t);
      e && this.defaultFocus !== se.NONE && (e.item.tabIndex = -1);
      let r = !this.quick;
      switch (this.quick ? this.dispatchEvent(new Event("opening")) : r = !!await this.animateOpen(), this.defaultFocus) {
        case se.FIRST_ITEM:
          const o = Li(t);
          o && (o.tabIndex = 0, o.focus(), await o.updateComplete);
          break;
        case se.LAST_ITEM:
          const a = eo(t);
          a && (a.tabIndex = 0, a.focus(), await a.updateComplete);
          break;
        case se.LIST_ROOT:
          this.focus();
          break;
        default:
        case se.NONE:
          break;
      }
      r || this.dispatchEvent(new Event("opened"));
    }, this.beforeClose = async () => {
      this.open = !1, this.skipRestoreFocus || this.lastFocusedElement?.focus?.(), this.quick || await this.animateClose();
    }, this.onClosed = () => {
      this.quick && (this.dispatchEvent(new Event("closing")), this.dispatchEvent(new Event("closed")));
    }, this.onWindowPointerdown = (t) => {
      this.pointerPath = t.composedPath();
    }, this.onDocumentClick = (t) => {
      if (!this.open)
        return;
      const e = t.composedPath();
      !this.stayOpenOnOutsideClick && !e.includes(this) && !e.includes(this.anchorElement) && (this.open = !1);
    }, this.internals.role = "menu", this.addEventListener("keydown", this.handleKeydown), this.addEventListener("keydown", this.captureKeydown, { capture: !0 }), this.addEventListener("focusout", this.handleFocusout);
  }
  /**
   * The menu items associated with this menu. The items must be `MenuItem`s and
   * have both the `md-menu-item` and `md-list-item` attributes.
   */
  get items() {
    return this.listController.items;
  }
  willUpdate(t) {
    if (t.has("open")) {
      if (this.open) {
        this.removeAttribute("aria-hidden");
        return;
      }
      this.setAttribute("aria-hidden", "true");
    }
  }
  update(t) {
    t.has("open") && (this.open ? this.setUpGlobalEventListeners() : this.cleanUpGlobalEventListeners()), t.has("positioning") && this.positioning === "popover" && // type required for Google JS conformance
    !this.showPopover && (this.positioning = "fixed"), super.update(t);
  }
  connectedCallback() {
    super.connectedCallback(), this.open && this.setUpGlobalEventListeners();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.cleanUpGlobalEventListeners();
  }
  getBoundingClientRect() {
    return this.surfaceEl ? this.surfaceEl.getBoundingClientRect() : super.getBoundingClientRect();
  }
  getClientRects() {
    return this.surfaceEl ? this.surfaceEl.getClientRects() : super.getClientRects();
  }
  render() {
    return this.renderSurface();
  }
  /**
   * Renders the positionable surface element and its contents.
   */
  renderSurface() {
    return g`
      <div
        class="menu ${ne(this.getSurfaceClasses())}"
        style=${Bt(this.menuPositionController.surfaceStyles)}
        popover=${this.positioning === "popover" ? "manual" : A}>
        ${this.renderElevation()}
        <div class="items">
          <div class="item-padding"> ${this.renderMenuItems()} </div>
        </div>
      </div>
    `;
  }
  /**
   * Renders the menu items' slot
   */
  renderMenuItems() {
    return g`<slot
      @close-menu=${this.onCloseMenu}
      @deactivate-items=${this.onDeactivateItems}
      @request-activation=${this.onRequestActivation}
      @deactivate-typeahead=${this.handleDeactivateTypeahead}
      @activate-typeahead=${this.handleActivateTypeahead}
      @stay-open-on-focusout=${this.handleStayOpenOnFocusout}
      @close-on-focusout=${this.handleCloseOnFocusout}
      @slotchange=${this.listController.onSlotchange}></slot>`;
  }
  /**
   * Renders the elevation component.
   */
  renderElevation() {
    return g`<md-elevation part="elevation"></md-elevation>`;
  }
  getSurfaceClasses() {
    return {
      open: this.open,
      fixed: this.positioning === "fixed",
      "has-overflow": this.hasOverflow
    };
  }
  captureKeydown(t) {
    t.target === this && !t.defaultPrevented && Yo(t.code) && (t.preventDefault(), this.close()), this.typeaheadController.onKeydown(t);
  }
  /**
   * Performs the opening animation:
   *
   * https://direct.googleplex.com/#/spec/295000003+271060003
   *
   * @return A promise that resolve to `true` if the animation was aborted,
   *     `false` if it was not aborted.
   */
  async animateOpen() {
    const t = this.surfaceEl, e = this.slotEl;
    if (!t || !e)
      return !0;
    const r = this.openDirection;
    this.dispatchEvent(new Event("opening")), t.classList.toggle("animating", !0);
    const o = this.openCloseAnimationSignal.start(), a = t.offsetHeight, s = r === "UP", n = this.items, c = 500, l = 50, d = 250, v = (c - d) / n.length, p = t.animate([{ height: "0px" }, { height: `${a}px` }], {
      duration: c,
      easing: tt.EMPHASIZED
    }), f = e.animate([
      { transform: s ? `translateY(-${a}px)` : "" },
      { transform: "" }
    ], { duration: c, easing: tt.EMPHASIZED }), _ = t.animate([{ opacity: 0 }, { opacity: 1 }], l), y = [];
    for (let E = 0; E < n.length; E++) {
      const S = s ? n.length - 1 - E : E, m = n[S], k = m.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: d,
        delay: v * E
      });
      m.classList.toggle("md-menu-hidden", !0), k.addEventListener("finish", () => {
        m.classList.toggle("md-menu-hidden", !1);
      }), y.push([m, k]);
    }
    let x = (E) => {
    };
    const b = new Promise((E) => {
      x = E;
    });
    return o.addEventListener("abort", () => {
      p.cancel(), f.cancel(), _.cancel(), y.forEach(([E, S]) => {
        E.classList.toggle("md-menu-hidden", !1), S.cancel();
      }), x(!0);
    }), p.addEventListener("finish", () => {
      t.classList.toggle("animating", !1), this.openCloseAnimationSignal.finish(), x(!1);
    }), await b;
  }
  /**
   * Performs the closing animation:
   *
   * https://direct.googleplex.com/#/spec/295000003+271060003
   */
  animateClose() {
    let t;
    const e = new Promise((k) => {
      t = k;
    }), r = this.surfaceEl, o = this.slotEl;
    if (!r || !o)
      return t(!1), e;
    const s = this.openDirection === "UP";
    this.dispatchEvent(new Event("closing")), r.classList.toggle("animating", !0);
    const n = this.openCloseAnimationSignal.start(), c = r.offsetHeight, l = this.items, d = 150, v = 50, p = d - v, f = 50, _ = 50, y = 0.35, x = (d - _ - f) / l.length, b = r.animate([
      { height: `${c}px` },
      { height: `${c * y}px` }
    ], {
      duration: d,
      easing: tt.EMPHASIZED_ACCELERATE
    }), E = o.animate([
      { transform: "" },
      {
        transform: s ? `translateY(-${c * (1 - y)}px)` : ""
      }
    ], { duration: d, easing: tt.EMPHASIZED_ACCELERATE }), S = r.animate([{ opacity: 1 }, { opacity: 0 }], { duration: v, delay: p }), m = [];
    for (let k = 0; k < l.length; k++) {
      const O = s ? k : l.length - 1 - k, w = l[O], I = w.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: f,
        delay: _ + x * k
      });
      I.addEventListener("finish", () => {
        w.classList.toggle("md-menu-hidden", !0);
      }), m.push([w, I]);
    }
    return n.addEventListener("abort", () => {
      b.cancel(), E.cancel(), S.cancel(), m.forEach(([k, O]) => {
        O.cancel(), k.classList.toggle("md-menu-hidden", !1);
      }), t(!1);
    }), b.addEventListener("finish", () => {
      r.classList.toggle("animating", !1), m.forEach(([k]) => {
        k.classList.toggle("md-menu-hidden", !1);
      }), this.openCloseAnimationSignal.finish(), this.dispatchEvent(new Event("closed")), t(!0);
    }), e;
  }
  handleKeydown(t) {
    this.pointerPath = [], this.listController.handleKeydown(t);
  }
  setUpGlobalEventListeners() {
    document.addEventListener("click", this.onDocumentClick, { capture: !0 }), window.addEventListener("pointerdown", this.onWindowPointerdown), document.addEventListener("resize", this.onWindowResize, { passive: !0 }), window.addEventListener("resize", this.onWindowResize, { passive: !0 });
  }
  cleanUpGlobalEventListeners() {
    document.removeEventListener("click", this.onDocumentClick, {
      capture: !0
    }), window.removeEventListener("pointerdown", this.onWindowPointerdown), document.removeEventListener("resize", this.onWindowResize), window.removeEventListener("resize", this.onWindowResize);
  }
  onCloseMenu() {
    this.close();
  }
  onDeactivateItems(t) {
    t.stopPropagation(), this.listController.onDeactivateItems();
  }
  onRequestActivation(t) {
    t.stopPropagation(), this.listController.onRequestActivation(t);
  }
  handleDeactivateTypeahead(t) {
    t.stopPropagation(), this.typeaheadActive = !1;
  }
  handleActivateTypeahead(t) {
    t.stopPropagation(), this.typeaheadActive = !0;
  }
  handleStayOpenOnFocusout(t) {
    t.stopPropagation(), this.stayOpenOnFocusout = !0;
  }
  handleCloseOnFocusout(t) {
    t.stopPropagation(), this.stayOpenOnFocusout = !1;
  }
  close() {
    this.open = !1, this.slotItems.forEach((e) => {
      e.close?.();
    });
  }
  show() {
    this.open = !0;
  }
  /**
   * Activates the next item in the menu. If at the end of the menu, the first
   * item will be activated.
   *
   * @return The activated menu item or `null` if there are no items.
   */
  activateNextItem() {
    return this.listController.activateNextItem() ?? null;
  }
  /**
   * Activates the previous item in the menu. If at the start of the menu, the
   * last item will be activated.
   *
   * @return The activated menu item or `null` if there are no items.
   */
  activatePreviousItem() {
    return this.listController.activatePreviousItem() ?? null;
  }
  /**
   * Repositions the menu if it is open.
   *
   * Useful for the case where document or window-positioned menus have their
   * anchors moved while open.
   */
  reposition() {
    this.open && this.menuPositionController.position();
  }
}
h([
  J(".menu")
], M.prototype, "surfaceEl", void 0);
h([
  J("slot")
], M.prototype, "slotEl", void 0);
h([
  u()
], M.prototype, "anchor", void 0);
h([
  u()
], M.prototype, "positioning", void 0);
h([
  u({ type: Boolean })
], M.prototype, "quick", void 0);
h([
  u({ type: Boolean, attribute: "has-overflow" })
], M.prototype, "hasOverflow", void 0);
h([
  u({ type: Boolean, reflect: !0 })
], M.prototype, "open", void 0);
h([
  u({ type: Number, attribute: "x-offset" })
], M.prototype, "xOffset", void 0);
h([
  u({ type: Number, attribute: "y-offset" })
], M.prototype, "yOffset", void 0);
h([
  u({ type: Boolean, attribute: "no-horizontal-flip" })
], M.prototype, "noHorizontalFlip", void 0);
h([
  u({ type: Boolean, attribute: "no-vertical-flip" })
], M.prototype, "noVerticalFlip", void 0);
h([
  u({ type: Number, attribute: "typeahead-delay" })
], M.prototype, "typeaheadDelay", void 0);
h([
  u({ attribute: "anchor-corner" })
], M.prototype, "anchorCorner", void 0);
h([
  u({ attribute: "menu-corner" })
], M.prototype, "menuCorner", void 0);
h([
  u({ type: Boolean, attribute: "stay-open-on-outside-click" })
], M.prototype, "stayOpenOnOutsideClick", void 0);
h([
  u({ type: Boolean, attribute: "stay-open-on-focusout" })
], M.prototype, "stayOpenOnFocusout", void 0);
h([
  u({ type: Boolean, attribute: "skip-restore-focus" })
], M.prototype, "skipRestoreFocus", void 0);
h([
  u({ attribute: "default-focus" })
], M.prototype, "defaultFocus", void 0);
h([
  u({ type: Boolean, attribute: "no-navigation-wrap" })
], M.prototype, "noNavigationWrap", void 0);
h([
  Ie({ flatten: !0 })
], M.prototype, "slotItems", void 0);
h([
  P()
], M.prototype, "typeaheadActive", void 0);
const Wl = N`:host{--md-elevation-level: var(--md-menu-container-elevation, 2);--md-elevation-shadow-color: var(--md-menu-container-shadow-color, var(--md-sys-color-shadow, #000));min-width:112px;color:unset;display:contents}md-focus-ring{--md-focus-ring-shape: var(--md-menu-container-shape, var(--md-sys-shape-corner-extra-small, 4px))}.menu{border-radius:var(--md-menu-container-shape, var(--md-sys-shape-corner-extra-small, 4px));display:none;inset:auto;border:none;padding:0px;overflow:visible;background-color:rgba(0,0,0,0);color:inherit;opacity:0;z-index:20;position:absolute;user-select:none;max-height:inherit;height:inherit;min-width:inherit;max-width:inherit;scrollbar-width:inherit}.menu::backdrop{display:none}.fixed{position:fixed}.items{display:block;list-style-type:none;margin:0;outline:none;box-sizing:border-box;background-color:var(--md-menu-container-color, var(--md-sys-color-surface-container, #f3edf7));height:inherit;max-height:inherit;overflow:auto;min-width:inherit;max-width:inherit;border-radius:inherit;scrollbar-width:inherit}.item-padding{padding-block:8px}.has-overflow:not([popover]) .items{overflow:visible}.has-overflow.animating .items,.animating .items{overflow:hidden}.has-overflow.animating .items{pointer-events:none}.animating ::slotted(.md-menu-hidden){opacity:0}slot{display:block;height:inherit;max-height:inherit}::slotted(:is(md-divider,[role=separator])){margin:8px 0}@media(forced-colors: active){.menu{border-style:solid;border-color:CanvasText;border-width:1px}}
`;
let Ri = class extends M {
};
Ri.styles = [Wl];
Ri = h([
  Mt("md-menu")
], Ri);
class ql extends Fi {
  computeValidity(t) {
    return this.selectControl || (this.selectControl = document.createElement("select")), Xr(g`<option value=${t.value}></option>`, this.selectControl), this.selectControl.value = t.value, this.selectControl.required = t.required, {
      validity: this.selectControl.validity,
      validationMessage: this.selectControl.validationMessage
    };
  }
  equals(t, e) {
    return t.value === e.value && t.required === e.required;
  }
  copy({ value: t, required: e }) {
    return { value: t, required: e };
  }
}
function Gl(i) {
  const t = [];
  for (let e = 0; e < i.length; e++) {
    const r = i[e];
    r.selected && t.push([r, e]);
  }
  return t;
}
var Ur;
const Lt = /* @__PURE__ */ Symbol("value"), Kl = ze(Go(Oi(Pi(Ut(U)))));
class F extends Kl {
  /**
   * The value of the currently selected option.
   *
   * Note: For SSR, set `[selected]` on the requested option and `displayText`
   * rather than setting `value` setting `value` will incur a DOM query.
   */
  get value() {
    return this[Lt];
  }
  set value(t) {
    this.lastUserSetValue = t, this.select(t);
  }
  get options() {
    return this.menu?.items ?? [];
  }
  /**
   * The index of the currently selected option.
   *
   * Note: For SSR, set `[selected]` on the requested option and `displayText`
   * rather than setting `selectedIndex` setting `selectedIndex` will incur a
   * DOM query.
   */
  get selectedIndex() {
    const [t, e] = (this.getSelectedOptions() ?? [])[0] ?? [];
    return e ?? -1;
  }
  set selectedIndex(t) {
    this.lastUserSetSelectedIndex = t, this.selectIndex(t);
  }
  /**
   * Returns an array of selected options.
   *
   * NOTE: md-select only supports single selection.
   */
  get selectedOptions() {
    return (this.getSelectedOptions() ?? []).map(([t]) => t);
  }
  get hasError() {
    return this.error || this.nativeError;
  }
  constructor() {
    super(), this.quick = !1, this.required = !1, this.errorText = "", this.label = "", this.noAsterisk = !1, this.supportingText = "", this.error = !1, this.menuPositioning = "popover", this.clampMenuWidth = !1, this.typeaheadDelay = jo, this.hasLeadingIcon = !1, this.displayText = "", this.menuAlign = "start", this[Ur] = "", this.lastUserSetValue = null, this.lastUserSetSelectedIndex = null, this.lastSelectedOption = null, this.lastSelectedOptionRecords = [], this.nativeError = !1, this.nativeErrorText = "", this.focused = !1, this.open = !1, this.defaultFocus = se.NONE, this.prevOpen = this.open, this.selectWidth = 0, this.addEventListener("focus", this.handleFocus.bind(this)), this.addEventListener("blur", this.handleBlur.bind(this));
  }
  /**
   * Selects an option given the value of the option, and updates MdSelect's
   * value.
   */
  select(t) {
    const e = this.options.find((r) => r.value === t);
    e && this.selectItem(e);
  }
  /**
   * Selects an option given the index of the option, and updates MdSelect's
   * value.
   */
  selectIndex(t) {
    const e = this.options[t];
    e && this.selectItem(e);
  }
  /**
   * Reset the select to its default value.
   */
  reset() {
    for (const t of this.options)
      t.selected = t.hasAttribute("selected");
    this.updateValueAndDisplayText(), this.nativeError = !1, this.nativeErrorText = "";
  }
  [(Ur = Lt, zt)](t) {
    t?.preventDefault();
    const e = this.getErrorText();
    this.nativeError = !!t, this.nativeErrorText = this.validationMessage, e === this.getErrorText() && this.field?.reannounceError();
  }
  update(t) {
    if (this.hasUpdated || this.initUserSelection(), this.prevOpen !== this.open && this.open) {
      const e = this.getBoundingClientRect();
      this.selectWidth = e.width;
    }
    this.prevOpen = this.open, super.update(t);
  }
  render() {
    return g`
      <span
        class="select ${ne(this.getRenderClasses())}"
        @focusout=${this.handleFocusout}>
        ${this.renderField()} ${this.renderMenu()}
      </span>
    `;
  }
  async firstUpdated(t) {
    await this.menu?.updateComplete, this.lastSelectedOptionRecords.length || this.initUserSelection(), !this.lastSelectedOptionRecords.length && !this.options.length && setTimeout(() => {
      this.updateValueAndDisplayText();
    }), super.firstUpdated(t);
  }
  getRenderClasses() {
    return {
      disabled: this.disabled,
      error: this.error,
      open: this.open
    };
  }
  renderField() {
    return Nt`
      <${this.fieldTag}
          aria-haspopup="listbox"
          role="combobox"
          part="field"
          id="field"
          tabindex=${this.disabled ? "-1" : "0"}
          aria-label=${this.ariaLabel || A}
          aria-describedby="description"
          aria-expanded=${this.open ? "true" : "false"}
          aria-controls="listbox"
          class="field"
          label=${this.label}
          ?no-asterisk=${this.noAsterisk}
          .focused=${this.focused || this.open}
          .populated=${!!this.displayText}
          .disabled=${this.disabled}
          .required=${this.required}
          .error=${this.hasError}
          ?has-start=${this.hasLeadingIcon}
          has-end
          supporting-text=${this.supportingText}
          error-text=${this.getErrorText()}
          @keydown=${this.handleKeydown}
          @click=${this.handleClick}>
         ${this.renderFieldContent()}
         <div id="description" slot="aria-describedby"></div>
      </${this.fieldTag}>`;
  }
  renderFieldContent() {
    return [
      this.renderLeadingIcon(),
      this.renderLabel(),
      this.renderTrailingIcon()
    ];
  }
  renderLeadingIcon() {
    return g`
      <span class="icon leading" slot="start">
        <slot name="leading-icon" @slotchange=${this.handleIconChange}></slot>
      </span>
    `;
  }
  renderTrailingIcon() {
    return g`
      <span class="icon trailing" slot="end">
        <slot name="trailing-icon" @slotchange=${this.handleIconChange}>
          <svg height="5" viewBox="7 10 10 5" focusable="false">
            <polygon
              class="down"
              stroke="none"
              fill-rule="evenodd"
              points="7 10 12 15 17 10"></polygon>
            <polygon
              class="up"
              stroke="none"
              fill-rule="evenodd"
              points="7 15 12 10 17 15"></polygon>
          </svg>
        </slot>
      </span>
    `;
  }
  renderLabel() {
    return g`<div id="label">${this.displayText || g`&nbsp;`}</div>`;
  }
  renderMenu() {
    const t = this.label || this.ariaLabel;
    return g`<div class="menu-wrapper">
      <md-menu
        id="listbox"
        .defaultFocus=${this.defaultFocus}
        role="listbox"
        tabindex="-1"
        aria-label=${t || A}
        stay-open-on-focusout
        part="menu"
        exportparts="focus-ring: menu-focus-ring"
        anchor="field"
        style=${Bt({
      "--__menu-min-width": `${this.selectWidth}px`,
      "--__menu-max-width": this.clampMenuWidth ? `${this.selectWidth}px` : void 0
    })}
        no-navigation-wrap
        .open=${this.open}
        .quick=${this.quick}
        .positioning=${this.menuPositioning}
        .typeaheadDelay=${this.typeaheadDelay}
        .anchorCorner=${this.menuAlign === "start" ? "end-start" : "end-end"}
        .menuCorner=${this.menuAlign === "start" ? "start-start" : "start-end"}
        @opening=${this.handleOpening}
        @opened=${this.redispatchEvent}
        @closing=${this.redispatchEvent}
        @closed=${this.handleClosed}
        @close-menu=${this.handleCloseMenu}
        @request-selection=${this.handleRequestSelection}
        @request-deselection=${this.handleRequestDeselection}>
        ${this.renderMenuContent()}
      </md-menu>
    </div>`;
  }
  renderMenuContent() {
    return g`<slot></slot>`;
  }
  /**
   * Handles opening the select on keydown and typahead selection when the menu
   * is closed.
   */
  handleKeydown(t) {
    if (this.open || this.disabled || !this.menu)
      return;
    const e = this.menu.typeaheadController, r = t.code === "Space" || t.code === "ArrowDown" || t.code === "ArrowUp" || t.code === "End" || t.code === "Home" || t.code === "Enter";
    if (!e.isTypingAhead && r) {
      switch (t.preventDefault(), this.open = !0, t.code) {
        case "Space":
        case "ArrowDown":
        case "Enter":
          this.defaultFocus = se.NONE;
          break;
        case "End":
          this.defaultFocus = se.LAST_ITEM;
          break;
        case "ArrowUp":
        case "Home":
          this.defaultFocus = se.FIRST_ITEM;
          break;
      }
      return;
    }
    if (t.key.length === 1) {
      e.onKeydown(t), t.preventDefault();
      const { lastActiveRecord: a } = e;
      if (!a)
        return;
      this.labelEl?.setAttribute?.("aria-live", "polite"), this.selectItem(a[ee.ITEM]) && this.dispatchInteractionEvents();
    }
  }
  handleClick() {
    this.open = !this.open;
  }
  handleFocus() {
    this.focused = !0;
  }
  handleBlur() {
    this.focused = !1;
  }
  /**
   * Handles closing the menu when the focus leaves the select's subtree.
   */
  handleFocusout(t) {
    t.relatedTarget && Ii(t.relatedTarget, this) || (this.open = !1);
  }
  /**
   * Gets a list of all selected select options as a list item record array.
   *
   * @return An array of selected list option records.
   */
  getSelectedOptions() {
    if (!this.menu)
      return this.lastSelectedOptionRecords = [], null;
    const t = this.menu.items;
    return this.lastSelectedOptionRecords = Gl(t), this.lastSelectedOptionRecords;
  }
  async getUpdateComplete() {
    return await this.menu?.updateComplete, super.getUpdateComplete();
  }
  /**
   * Gets the selected options from the DOM, and updates the value and display
   * text to the first selected option's value and headline respectively.
   *
   * @return Whether or not the selected option has changed since last update.
   */
  updateValueAndDisplayText() {
    const t = this.getSelectedOptions() ?? [];
    let e = !1;
    if (t.length) {
      const [r] = t[0];
      e = this.lastSelectedOption !== r, this.lastSelectedOption = r, this[Lt] = r.value, this.displayText = r.displayText;
    } else
      e = this.lastSelectedOption !== null, this.lastSelectedOption = null, this[Lt] = "", this.displayText = "";
    return e;
  }
  /**
   * Focuses and activates the last selected item upon opening, and resets other
   * active items.
   */
  async handleOpening(t) {
    if (this.labelEl?.removeAttribute?.("aria-live"), this.redispatchEvent(t), this.defaultFocus !== se.NONE)
      return;
    const e = this.menu.items, r = at(e)?.item;
    let [o] = this.lastSelectedOptionRecords[0] ?? [null];
    r && r !== o && (r.tabIndex = -1), o = o ?? e[0], o && (o.tabIndex = 0, o.focus());
  }
  redispatchEvent(t) {
    $i(this, t);
  }
  handleClosed(t) {
    this.open = !1, this.redispatchEvent(t);
  }
  /**
   * Determines the reason for closing, and updates the UI accordingly.
   */
  handleCloseMenu(t) {
    const e = t.detail.reason, r = t.detail.itemPath[0];
    this.open = !1;
    let o = !1;
    e.kind === "click-selection" ? o = this.selectItem(r) : e.kind === "keydown" && Ul(e.key) ? o = this.selectItem(r) : (r.tabIndex = -1, r.blur()), o && this.dispatchInteractionEvents();
  }
  /**
   * Selects a given option, deselects other options, and updates the UI.
   *
   * @return Whether the last selected option has changed.
   */
  selectItem(t) {
    return (this.getSelectedOptions() ?? []).forEach(([r]) => {
      t !== r && (r.selected = !1);
    }), t.selected = !0, this.updateValueAndDisplayText();
  }
  /**
   * Handles updating selection when an option element requests selection via
   * property / attribute change.
   */
  handleRequestSelection(t) {
    const e = t.target;
    this.lastSelectedOptionRecords.some(([r]) => r === e) || this.selectItem(e);
  }
  /**
   * Handles updating selection when an option element requests deselection via
   * property / attribute change.
   */
  handleRequestDeselection(t) {
    const e = t.target;
    this.lastSelectedOptionRecords.some(([r]) => r === e) && this.updateValueAndDisplayText();
  }
  /**
   * Attempts to initialize the selected option from user-settable values like
   * SSR, setting `value`, or `selectedIndex` at startup.
   */
  initUserSelection() {
    this.lastUserSetValue && !this.lastSelectedOptionRecords.length ? this.select(this.lastUserSetValue) : this.lastUserSetSelectedIndex !== null && !this.lastSelectedOptionRecords.length ? this.selectIndex(this.lastUserSetSelectedIndex) : this.updateValueAndDisplayText();
  }
  handleIconChange() {
    this.hasLeadingIcon = this.leadingIcons.length > 0;
  }
  /**
   * Dispatches the `input` and `change` events.
   */
  dispatchInteractionEvents() {
    this.dispatchEvent(new Event("input", { bubbles: !0, composed: !0 })), this.dispatchEvent(new Event("change", { bubbles: !0 }));
  }
  getErrorText() {
    return this.error ? this.errorText : this.nativeErrorText;
  }
  [Ze]() {
    return this.value;
  }
  formResetCallback() {
    this.reset();
  }
  formStateRestoreCallback(t) {
    this.value = t;
  }
  click() {
    this.field?.click();
  }
  [dt]() {
    return new ql(() => this);
  }
  [ct]() {
    return this.field;
  }
}
F.shadowRootOptions = {
  ...U.shadowRootOptions,
  delegatesFocus: !0
};
h([
  u({ type: Boolean })
], F.prototype, "quick", void 0);
h([
  u({ type: Boolean })
], F.prototype, "required", void 0);
h([
  u({ type: String, attribute: "error-text" })
], F.prototype, "errorText", void 0);
h([
  u()
], F.prototype, "label", void 0);
h([
  u({ type: Boolean, attribute: "no-asterisk" })
], F.prototype, "noAsterisk", void 0);
h([
  u({ type: String, attribute: "supporting-text" })
], F.prototype, "supportingText", void 0);
h([
  u({ type: Boolean, reflect: !0 })
], F.prototype, "error", void 0);
h([
  u({ attribute: "menu-positioning" })
], F.prototype, "menuPositioning", void 0);
h([
  u({ type: Boolean, attribute: "clamp-menu-width" })
], F.prototype, "clampMenuWidth", void 0);
h([
  u({ type: Number, attribute: "typeahead-delay" })
], F.prototype, "typeaheadDelay", void 0);
h([
  u({ type: Boolean, attribute: "has-leading-icon" })
], F.prototype, "hasLeadingIcon", void 0);
h([
  u({ attribute: "display-text" })
], F.prototype, "displayText", void 0);
h([
  u({ attribute: "menu-align" })
], F.prototype, "menuAlign", void 0);
h([
  u()
], F.prototype, "value", null);
h([
  u({ type: Number, attribute: "selected-index" })
], F.prototype, "selectedIndex", null);
h([
  P()
], F.prototype, "nativeError", void 0);
h([
  P()
], F.prototype, "nativeErrorText", void 0);
h([
  P()
], F.prototype, "focused", void 0);
h([
  P()
], F.prototype, "open", void 0);
h([
  P()
], F.prototype, "defaultFocus", void 0);
h([
  J(".field")
], F.prototype, "field", void 0);
h([
  J("md-menu")
], F.prototype, "menu", void 0);
h([
  J("#label")
], F.prototype, "labelEl", void 0);
h([
  Ie({ slot: "leading-icon", flatten: !0 })
], F.prototype, "leadingIcons", void 0);
class Yl extends F {
  constructor() {
    super(...arguments), this.fieldTag = ke`md-filled-field`;
  }
}
const jl = N`:host{--_text-field-active-indicator-color: var(--md-filled-select-text-field-active-indicator-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-active-indicator-height: var(--md-filled-select-text-field-active-indicator-height, 1px);--_text-field-container-color: var(--md-filled-select-text-field-container-color, var(--md-sys-color-surface-container-highest, #e6e0e9));--_text-field-disabled-active-indicator-color: var(--md-filled-select-text-field-disabled-active-indicator-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-disabled-active-indicator-height: var(--md-filled-select-text-field-disabled-active-indicator-height, 1px);--_text-field-disabled-active-indicator-opacity: var(--md-filled-select-text-field-disabled-active-indicator-opacity, 0.38);--_text-field-disabled-container-color: var(--md-filled-select-text-field-disabled-container-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-disabled-container-opacity: var(--md-filled-select-text-field-disabled-container-opacity, 0.04);--_text-field-disabled-input-text-color: var(--md-filled-select-text-field-disabled-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-disabled-input-text-opacity: var(--md-filled-select-text-field-disabled-input-text-opacity, 0.38);--_text-field-disabled-label-text-color: var(--md-filled-select-text-field-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-disabled-label-text-opacity: var(--md-filled-select-text-field-disabled-label-text-opacity, 0.38);--_text-field-disabled-leading-icon-color: var(--md-filled-select-text-field-disabled-leading-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-disabled-leading-icon-opacity: var(--md-filled-select-text-field-disabled-leading-icon-opacity, 0.38);--_text-field-disabled-supporting-text-color: var(--md-filled-select-text-field-disabled-supporting-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-disabled-supporting-text-opacity: var(--md-filled-select-text-field-disabled-supporting-text-opacity, 0.38);--_text-field-disabled-trailing-icon-color: var(--md-filled-select-text-field-disabled-trailing-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-disabled-trailing-icon-opacity: var(--md-filled-select-text-field-disabled-trailing-icon-opacity, 0.38);--_text-field-error-active-indicator-color: var(--md-filled-select-text-field-error-active-indicator-color, var(--md-sys-color-error, #b3261e));--_text-field-error-focus-active-indicator-color: var(--md-filled-select-text-field-error-focus-active-indicator-color, var(--md-sys-color-error, #b3261e));--_text-field-error-focus-input-text-color: var(--md-filled-select-text-field-error-focus-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-error-focus-label-text-color: var(--md-filled-select-text-field-error-focus-label-text-color, var(--md-sys-color-error, #b3261e));--_text-field-error-focus-leading-icon-color: var(--md-filled-select-text-field-error-focus-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-error-focus-supporting-text-color: var(--md-filled-select-text-field-error-focus-supporting-text-color, var(--md-sys-color-error, #b3261e));--_text-field-error-focus-trailing-icon-color: var(--md-filled-select-text-field-error-focus-trailing-icon-color, var(--md-sys-color-error, #b3261e));--_text-field-error-hover-active-indicator-color: var(--md-filled-select-text-field-error-hover-active-indicator-color, var(--md-sys-color-on-error-container, #410e0b));--_text-field-error-hover-input-text-color: var(--md-filled-select-text-field-error-hover-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-error-hover-label-text-color: var(--md-filled-select-text-field-error-hover-label-text-color, var(--md-sys-color-on-error-container, #410e0b));--_text-field-error-hover-leading-icon-color: var(--md-filled-select-text-field-error-hover-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-error-hover-state-layer-color: var(--md-filled-select-text-field-error-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-error-hover-state-layer-opacity: var(--md-filled-select-text-field-error-hover-state-layer-opacity, 0.08);--_text-field-error-hover-supporting-text-color: var(--md-filled-select-text-field-error-hover-supporting-text-color, var(--md-sys-color-error, #b3261e));--_text-field-error-hover-trailing-icon-color: var(--md-filled-select-text-field-error-hover-trailing-icon-color, var(--md-sys-color-on-error-container, #410e0b));--_text-field-error-input-text-color: var(--md-filled-select-text-field-error-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-error-label-text-color: var(--md-filled-select-text-field-error-label-text-color, var(--md-sys-color-error, #b3261e));--_text-field-error-leading-icon-color: var(--md-filled-select-text-field-error-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-error-supporting-text-color: var(--md-filled-select-text-field-error-supporting-text-color, var(--md-sys-color-error, #b3261e));--_text-field-error-trailing-icon-color: var(--md-filled-select-text-field-error-trailing-icon-color, var(--md-sys-color-error, #b3261e));--_text-field-focus-active-indicator-color: var(--md-filled-select-text-field-focus-active-indicator-color, var(--md-sys-color-primary, #6750a4));--_text-field-focus-active-indicator-height: var(--md-filled-select-text-field-focus-active-indicator-height, 3px);--_text-field-focus-input-text-color: var(--md-filled-select-text-field-focus-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-focus-label-text-color: var(--md-filled-select-text-field-focus-label-text-color, var(--md-sys-color-primary, #6750a4));--_text-field-focus-leading-icon-color: var(--md-filled-select-text-field-focus-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-focus-supporting-text-color: var(--md-filled-select-text-field-focus-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-focus-trailing-icon-color: var(--md-filled-select-text-field-focus-trailing-icon-color, var(--md-sys-color-primary, #6750a4));--_text-field-hover-active-indicator-color: var(--md-filled-select-text-field-hover-active-indicator-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-hover-active-indicator-height: var(--md-filled-select-text-field-hover-active-indicator-height, 1px);--_text-field-hover-input-text-color: var(--md-filled-select-text-field-hover-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-hover-label-text-color: var(--md-filled-select-text-field-hover-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-hover-leading-icon-color: var(--md-filled-select-text-field-hover-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-hover-state-layer-color: var(--md-filled-select-text-field-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-hover-state-layer-opacity: var(--md-filled-select-text-field-hover-state-layer-opacity, 0.08);--_text-field-hover-supporting-text-color: var(--md-filled-select-text-field-hover-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-hover-trailing-icon-color: var(--md-filled-select-text-field-hover-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-input-text-color: var(--md-filled-select-text-field-input-text-color, var(--md-sys-color-on-surface, #1d1b20));--_text-field-input-text-font: var(--md-filled-select-text-field-input-text-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));--_text-field-input-text-line-height: var(--md-filled-select-text-field-input-text-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));--_text-field-input-text-size: var(--md-filled-select-text-field-input-text-size, var(--md-sys-typescale-body-large-size, 1rem));--_text-field-input-text-weight: var(--md-filled-select-text-field-input-text-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));--_text-field-label-text-color: var(--md-filled-select-text-field-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-label-text-font: var(--md-filled-select-text-field-label-text-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));--_text-field-label-text-line-height: var(--md-filled-select-text-field-label-text-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));--_text-field-label-text-populated-line-height: var(--md-filled-select-text-field-label-text-populated-line-height, var(--md-sys-typescale-body-small-line-height, 1rem));--_text-field-label-text-populated-size: var(--md-filled-select-text-field-label-text-populated-size, var(--md-sys-typescale-body-small-size, 0.75rem));--_text-field-label-text-size: var(--md-filled-select-text-field-label-text-size, var(--md-sys-typescale-body-large-size, 1rem));--_text-field-label-text-weight: var(--md-filled-select-text-field-label-text-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));--_text-field-leading-icon-color: var(--md-filled-select-text-field-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-leading-icon-size: var(--md-filled-select-text-field-leading-icon-size, 24px);--_text-field-supporting-text-color: var(--md-filled-select-text-field-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-supporting-text-font: var(--md-filled-select-text-field-supporting-text-font, var(--md-sys-typescale-body-small-font, var(--md-ref-typeface-plain, Roboto)));--_text-field-supporting-text-line-height: var(--md-filled-select-text-field-supporting-text-line-height, var(--md-sys-typescale-body-small-line-height, 1rem));--_text-field-supporting-text-size: var(--md-filled-select-text-field-supporting-text-size, var(--md-sys-typescale-body-small-size, 0.75rem));--_text-field-supporting-text-weight: var(--md-filled-select-text-field-supporting-text-weight, var(--md-sys-typescale-body-small-weight, var(--md-ref-typeface-weight-regular, 400)));--_text-field-trailing-icon-color: var(--md-filled-select-text-field-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_text-field-trailing-icon-size: var(--md-filled-select-text-field-trailing-icon-size, 24px);--_text-field-container-shape-start-start: var(--md-filled-select-text-field-container-shape-start-start, var(--md-filled-select-text-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_text-field-container-shape-start-end: var(--md-filled-select-text-field-container-shape-start-end, var(--md-filled-select-text-field-container-shape, var(--md-sys-shape-corner-extra-small, 4px)));--_text-field-container-shape-end-end: var(--md-filled-select-text-field-container-shape-end-end, var(--md-filled-select-text-field-container-shape, var(--md-sys-shape-corner-none, 0px)));--_text-field-container-shape-end-start: var(--md-filled-select-text-field-container-shape-end-start, var(--md-filled-select-text-field-container-shape, var(--md-sys-shape-corner-none, 0px)));--md-filled-field-active-indicator-color: var(--_text-field-active-indicator-color);--md-filled-field-active-indicator-height: var(--_text-field-active-indicator-height);--md-filled-field-container-color: var(--_text-field-container-color);--md-filled-field-container-shape-end-end: var(--_text-field-container-shape-end-end);--md-filled-field-container-shape-end-start: var(--_text-field-container-shape-end-start);--md-filled-field-container-shape-start-end: var(--_text-field-container-shape-start-end);--md-filled-field-container-shape-start-start: var(--_text-field-container-shape-start-start);--md-filled-field-content-color: var(--_text-field-input-text-color);--md-filled-field-content-font: var(--_text-field-input-text-font);--md-filled-field-content-line-height: var(--_text-field-input-text-line-height);--md-filled-field-content-size: var(--_text-field-input-text-size);--md-filled-field-content-weight: var(--_text-field-input-text-weight);--md-filled-field-disabled-active-indicator-color: var(--_text-field-disabled-active-indicator-color);--md-filled-field-disabled-active-indicator-height: var(--_text-field-disabled-active-indicator-height);--md-filled-field-disabled-active-indicator-opacity: var(--_text-field-disabled-active-indicator-opacity);--md-filled-field-disabled-container-color: var(--_text-field-disabled-container-color);--md-filled-field-disabled-container-opacity: var(--_text-field-disabled-container-opacity);--md-filled-field-disabled-content-color: var(--_text-field-disabled-input-text-color);--md-filled-field-disabled-content-opacity: var(--_text-field-disabled-input-text-opacity);--md-filled-field-disabled-label-text-color: var(--_text-field-disabled-label-text-color);--md-filled-field-disabled-label-text-opacity: var(--_text-field-disabled-label-text-opacity);--md-filled-field-disabled-leading-content-color: var(--_text-field-disabled-leading-icon-color);--md-filled-field-disabled-leading-content-opacity: var(--_text-field-disabled-leading-icon-opacity);--md-filled-field-disabled-supporting-text-color: var(--_text-field-disabled-supporting-text-color);--md-filled-field-disabled-supporting-text-opacity: var(--_text-field-disabled-supporting-text-opacity);--md-filled-field-disabled-trailing-content-color: var(--_text-field-disabled-trailing-icon-color);--md-filled-field-disabled-trailing-content-opacity: var(--_text-field-disabled-trailing-icon-opacity);--md-filled-field-error-active-indicator-color: var(--_text-field-error-active-indicator-color);--md-filled-field-error-content-color: var(--_text-field-error-input-text-color);--md-filled-field-error-focus-active-indicator-color: var(--_text-field-error-focus-active-indicator-color);--md-filled-field-error-focus-content-color: var(--_text-field-error-focus-input-text-color);--md-filled-field-error-focus-label-text-color: var(--_text-field-error-focus-label-text-color);--md-filled-field-error-focus-leading-content-color: var(--_text-field-error-focus-leading-icon-color);--md-filled-field-error-focus-supporting-text-color: var(--_text-field-error-focus-supporting-text-color);--md-filled-field-error-focus-trailing-content-color: var(--_text-field-error-focus-trailing-icon-color);--md-filled-field-error-hover-active-indicator-color: var(--_text-field-error-hover-active-indicator-color);--md-filled-field-error-hover-content-color: var(--_text-field-error-hover-input-text-color);--md-filled-field-error-hover-label-text-color: var(--_text-field-error-hover-label-text-color);--md-filled-field-error-hover-leading-content-color: var(--_text-field-error-hover-leading-icon-color);--md-filled-field-error-hover-state-layer-color: var(--_text-field-error-hover-state-layer-color);--md-filled-field-error-hover-state-layer-opacity: var(--_text-field-error-hover-state-layer-opacity);--md-filled-field-error-hover-supporting-text-color: var(--_text-field-error-hover-supporting-text-color);--md-filled-field-error-hover-trailing-content-color: var(--_text-field-error-hover-trailing-icon-color);--md-filled-field-error-label-text-color: var(--_text-field-error-label-text-color);--md-filled-field-error-leading-content-color: var(--_text-field-error-leading-icon-color);--md-filled-field-error-supporting-text-color: var(--_text-field-error-supporting-text-color);--md-filled-field-error-trailing-content-color: var(--_text-field-error-trailing-icon-color);--md-filled-field-focus-active-indicator-color: var(--_text-field-focus-active-indicator-color);--md-filled-field-focus-active-indicator-height: var(--_text-field-focus-active-indicator-height);--md-filled-field-focus-content-color: var(--_text-field-focus-input-text-color);--md-filled-field-focus-label-text-color: var(--_text-field-focus-label-text-color);--md-filled-field-focus-leading-content-color: var(--_text-field-focus-leading-icon-color);--md-filled-field-focus-supporting-text-color: var(--_text-field-focus-supporting-text-color);--md-filled-field-focus-trailing-content-color: var(--_text-field-focus-trailing-icon-color);--md-filled-field-hover-active-indicator-color: var(--_text-field-hover-active-indicator-color);--md-filled-field-hover-active-indicator-height: var(--_text-field-hover-active-indicator-height);--md-filled-field-hover-content-color: var(--_text-field-hover-input-text-color);--md-filled-field-hover-label-text-color: var(--_text-field-hover-label-text-color);--md-filled-field-hover-leading-content-color: var(--_text-field-hover-leading-icon-color);--md-filled-field-hover-state-layer-color: var(--_text-field-hover-state-layer-color);--md-filled-field-hover-state-layer-opacity: var(--_text-field-hover-state-layer-opacity);--md-filled-field-hover-supporting-text-color: var(--_text-field-hover-supporting-text-color);--md-filled-field-hover-trailing-content-color: var(--_text-field-hover-trailing-icon-color);--md-filled-field-label-text-color: var(--_text-field-label-text-color);--md-filled-field-label-text-font: var(--_text-field-label-text-font);--md-filled-field-label-text-line-height: var(--_text-field-label-text-line-height);--md-filled-field-label-text-populated-line-height: var(--_text-field-label-text-populated-line-height);--md-filled-field-label-text-populated-size: var(--_text-field-label-text-populated-size);--md-filled-field-label-text-size: var(--_text-field-label-text-size);--md-filled-field-label-text-weight: var(--_text-field-label-text-weight);--md-filled-field-leading-content-color: var(--_text-field-leading-icon-color);--md-filled-field-supporting-text-color: var(--_text-field-supporting-text-color);--md-filled-field-supporting-text-font: var(--_text-field-supporting-text-font);--md-filled-field-supporting-text-line-height: var(--_text-field-supporting-text-line-height);--md-filled-field-supporting-text-size: var(--_text-field-supporting-text-size);--md-filled-field-supporting-text-weight: var(--_text-field-supporting-text-weight);--md-filled-field-trailing-content-color: var(--_text-field-trailing-icon-color)}[has-start] .icon.leading{font-size:var(--_text-field-leading-icon-size);height:var(--_text-field-leading-icon-size);width:var(--_text-field-leading-icon-size)}.icon.trailing{font-size:var(--_text-field-trailing-icon-size);height:var(--_text-field-trailing-icon-size);width:var(--_text-field-trailing-icon-size)}
`;
const Xl = N`:host{color:unset;min-width:210px;display:flex}.field{cursor:default;outline:none}.select{position:relative;flex-direction:column}.icon.trailing svg,.icon ::slotted(*){fill:currentColor}.icon ::slotted(*){width:inherit;height:inherit;font-size:inherit}.icon slot{display:flex;height:100%;width:100%;align-items:center;justify-content:center}.icon.trailing :is(.up,.down){opacity:0;transition:opacity 75ms linear 75ms}.select:not(.open) .down,.select.open .up{opacity:1}.field,.select,md-menu{min-width:inherit;width:inherit;max-width:inherit;display:flex}md-menu{min-width:var(--__menu-min-width);max-width:var(--__menu-max-width, inherit)}.menu-wrapper{width:0px;height:0px;max-width:inherit}md-menu ::slotted(:not[disabled]){cursor:pointer}.field,.select{width:100%}:host{display:inline-flex}:host([disabled]){pointer-events:none}
`;
class Jo extends Yl {
}
Jo.styles = [Xl, jl];
customElements.define("ew-filled-select", Jo);
const Jl = N`:host{display:flex;--md-ripple-hover-color: var(--md-menu-item-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--md-ripple-hover-opacity: var(--md-menu-item-hover-state-layer-opacity, 0.08);--md-ripple-pressed-color: var(--md-menu-item-pressed-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--md-ripple-pressed-opacity: var(--md-menu-item-pressed-state-layer-opacity, 0.12)}:host([disabled]){opacity:var(--md-menu-item-disabled-opacity, 0.3);pointer-events:none}md-focus-ring{z-index:1;--md-focus-ring-shape: 8px}a,button,li{background:none;border:none;padding:0;margin:0;text-align:unset;text-decoration:none}.list-item{border-radius:inherit;display:flex;flex:1;max-width:inherit;min-width:inherit;outline:none;-webkit-tap-highlight-color:rgba(0,0,0,0)}.list-item:not(.disabled){cursor:pointer}[slot=container]{pointer-events:none}md-ripple{border-radius:inherit}md-item{border-radius:inherit;flex:1;color:var(--md-menu-item-label-text-color, var(--md-sys-color-on-surface, #1d1b20));font-family:var(--md-menu-item-label-text-font, var(--md-sys-typescale-body-large-font, var(--md-ref-typeface-plain, Roboto)));font-size:var(--md-menu-item-label-text-size, var(--md-sys-typescale-body-large-size, 1rem));line-height:var(--md-menu-item-label-text-line-height, var(--md-sys-typescale-body-large-line-height, 1.5rem));font-weight:var(--md-menu-item-label-text-weight, var(--md-sys-typescale-body-large-weight, var(--md-ref-typeface-weight-regular, 400)));min-height:var(--md-menu-item-one-line-container-height, 56px);padding-top:var(--md-menu-item-top-space, 12px);padding-bottom:var(--md-menu-item-bottom-space, 12px);padding-inline-start:var(--md-menu-item-leading-space, 16px);padding-inline-end:var(--md-menu-item-trailing-space, 16px)}md-item[multiline]{min-height:var(--md-menu-item-two-line-container-height, 72px)}[slot=supporting-text]{color:var(--md-menu-item-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));font-family:var(--md-menu-item-supporting-text-font, var(--md-sys-typescale-body-medium-font, var(--md-ref-typeface-plain, Roboto)));font-size:var(--md-menu-item-supporting-text-size, var(--md-sys-typescale-body-medium-size, 0.875rem));line-height:var(--md-menu-item-supporting-text-line-height, var(--md-sys-typescale-body-medium-line-height, 1.25rem));font-weight:var(--md-menu-item-supporting-text-weight, var(--md-sys-typescale-body-medium-weight, var(--md-ref-typeface-weight-regular, 400)))}[slot=trailing-supporting-text]{color:var(--md-menu-item-trailing-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));font-family:var(--md-menu-item-trailing-supporting-text-font, var(--md-sys-typescale-label-small-font, var(--md-ref-typeface-plain, Roboto)));font-size:var(--md-menu-item-trailing-supporting-text-size, var(--md-sys-typescale-label-small-size, 0.6875rem));line-height:var(--md-menu-item-trailing-supporting-text-line-height, var(--md-sys-typescale-label-small-line-height, 1rem));font-weight:var(--md-menu-item-trailing-supporting-text-weight, var(--md-sys-typescale-label-small-weight, var(--md-ref-typeface-weight-medium, 500)))}:is([slot=start],[slot=end])::slotted(*){fill:currentColor}[slot=start]{color:var(--md-menu-item-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f))}[slot=end]{color:var(--md-menu-item-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f))}.list-item{background-color:var(--md-menu-item-container-color, transparent)}.list-item.selected{background-color:var(--md-menu-item-selected-container-color, var(--md-sys-color-secondary-container, #e8def8))}.selected:not(.disabled) ::slotted(*){color:var(--md-menu-item-selected-label-text-color, var(--md-sys-color-on-secondary-container, #1d192b))}@media(forced-colors: active){:host([disabled]),:host([disabled]) slot{color:GrayText;opacity:1}.list-item{position:relative}.list-item.selected::before{content:"";position:absolute;inset:0;box-sizing:border-box;border-radius:inherit;pointer-events:none;border:3px double CanvasText}}
`;
class Ql {
  /**
   * @param host The MenuItem in which to attach this controller to.
   * @param config The object that configures this controller's behavior.
   */
  constructor(t, e) {
    this.host = t, this.internalTypeaheadText = null, this.onClick = () => {
      this.host.keepOpen || this.host.dispatchEvent(Br(this.host, {
        kind: zr.CLICK_SELECTION
      }));
    }, this.onKeydown = (r) => {
      if (this.host.href && r.code === "Enter") {
        const a = this.getInteractiveElement();
        a instanceof HTMLAnchorElement && a.click();
      }
      if (r.defaultPrevented)
        return;
      const o = r.code;
      this.host.keepOpen && o !== "Escape" || Yo(o) && (r.preventDefault(), this.host.dispatchEvent(Br(this.host, {
        kind: zr.KEYDOWN,
        key: o
      })));
    }, this.getHeadlineElements = e.getHeadlineElements, this.getSupportingTextElements = e.getSupportingTextElements, this.getDefaultElements = e.getDefaultElements, this.getInteractiveElement = e.getInteractiveElement, this.host.addController(this);
  }
  /**
   * The text that is selectable via typeahead. If not set, defaults to the
   * innerText of the item slotted into the `"headline"` slot, and if there are
   * no slotted elements into headline, then it checks the _default_ slot, and
   * then the `"supporting-text"` slot if nothing is in _default_.
   */
  get typeaheadText() {
    if (this.internalTypeaheadText !== null)
      return this.internalTypeaheadText;
    const t = this.getHeadlineElements(), e = [];
    return t.forEach((r) => {
      r.textContent && r.textContent.trim() && e.push(r.textContent.trim());
    }), e.length === 0 && this.getDefaultElements().forEach((r) => {
      r.textContent && r.textContent.trim() && e.push(r.textContent.trim());
    }), e.length === 0 && this.getSupportingTextElements().forEach((r) => {
      r.textContent && r.textContent.trim() && e.push(r.textContent.trim());
    }), e.join(" ");
  }
  /**
   * The recommended tag name to render as the list item.
   */
  get tagName() {
    switch (this.host.type) {
      case "link":
        return "a";
      case "button":
        return "button";
      default:
      case "menuitem":
      case "option":
        return "li";
    }
  }
  /**
   * The recommended role of the menu item.
   */
  get role() {
    return this.host.type === "option" ? "option" : "menuitem";
  }
  hostConnected() {
    this.host.toggleAttribute("md-menu-item", !0);
  }
  hostUpdate() {
    this.host.href && (this.host.type = "link");
  }
  /**
   * Use to set the typeaheadText when it changes.
   */
  setTypeaheadText(t) {
    this.internalTypeaheadText = t;
  }
}
function ed() {
  return new Event("request-selection", {
    bubbles: !0,
    composed: !0
  });
}
function td() {
  return new Event("request-deselection", {
    bubbles: !0,
    composed: !0
  });
}
class id {
  /**
   * The recommended role of the select option.
   */
  get role() {
    return this.menuItemController.role;
  }
  /**
   * The text that is selectable via typeahead. If not set, defaults to the
   * innerText of the item slotted into the `"headline"` slot, and if there are
   * no slotted elements into headline, then it checks the _default_ slot, and
   * then the `"supporting-text"` slot if nothing is in _default_.
   */
  get typeaheadText() {
    return this.menuItemController.typeaheadText;
  }
  setTypeaheadText(t) {
    this.menuItemController.setTypeaheadText(t);
  }
  /**
   * The text that is displayed in the select field when selected. If not set,
   * defaults to the textContent of the item slotted into the `"headline"` slot,
   * and if there are no slotted elements into headline, then it checks the
   * _default_ slot, and then the `"supporting-text"` slot if nothing is in
   * _default_.
   */
  get displayText() {
    return this.internalDisplayText !== null ? this.internalDisplayText : this.menuItemController.typeaheadText;
  }
  setDisplayText(t) {
    this.internalDisplayText = t;
  }
  /**
   * @param host The SelectOption in which to attach this controller to.
   * @param config The object that configures this controller's behavior.
   */
  constructor(t, e) {
    this.host = t, this.internalDisplayText = null, this.firstUpdate = !0, this.onClick = () => {
      this.menuItemController.onClick();
    }, this.onKeydown = (r) => {
      this.menuItemController.onKeydown(r);
    }, this.lastSelected = this.host.selected, this.menuItemController = new Ql(t, e), t.addController(this);
  }
  hostUpdate() {
    this.lastSelected !== this.host.selected && (this.host.ariaSelected = this.host.selected ? "true" : "false");
  }
  hostUpdated() {
    this.lastSelected !== this.host.selected && !this.firstUpdate && (this.host.selected ? this.host.dispatchEvent(ed()) : this.host.dispatchEvent(td())), this.lastSelected = this.host.selected, this.firstUpdate = !1;
  }
}
const rd = ze(U);
class oe extends rd {
  constructor() {
    super(...arguments), this.disabled = !1, this.isMenuItem = !0, this.selected = !1, this.value = "", this.type = "option", this.selectOptionController = new id(this, {
      getHeadlineElements: () => this.headlineElements,
      getSupportingTextElements: () => this.supportingTextElements,
      getDefaultElements: () => this.defaultElements,
      getInteractiveElement: () => this.listItemRoot
    });
  }
  /**
   * The text that is selectable via typeahead. If not set, defaults to the
   * innerText of the item slotted into the `"headline"` slot.
   */
  get typeaheadText() {
    return this.selectOptionController.typeaheadText;
  }
  set typeaheadText(t) {
    this.selectOptionController.setTypeaheadText(t);
  }
  /**
   * The text that is displayed in the select field when selected. If not set,
   * defaults to the textContent of the item slotted into the `"headline"` slot.
   */
  get displayText() {
    return this.selectOptionController.displayText;
  }
  set displayText(t) {
    this.selectOptionController.setDisplayText(t);
  }
  render() {
    return this.renderListItem(g`
      <md-item>
        <div slot="container">
          ${this.renderRipple()} ${this.renderFocusRing()}
        </div>
        <slot name="start" slot="start"></slot>
        <slot name="end" slot="end"></slot>
        ${this.renderBody()}
      </md-item>
    `);
  }
  /**
   * Renders the root list item.
   *
   * @param content the child content of the list item.
   */
  renderListItem(t) {
    return g`
      <li
        id="item"
        tabindex=${this.disabled ? -1 : 0}
        role=${this.selectOptionController.role}
        aria-label=${this.ariaLabel || A}
        aria-selected=${this.ariaSelected || A}
        aria-checked=${this.ariaChecked || A}
        aria-expanded=${this.ariaExpanded || A}
        aria-haspopup=${this.ariaHasPopup || A}
        class="list-item ${ne(this.getRenderClasses())}"
        @click=${this.selectOptionController.onClick}
        @keydown=${this.selectOptionController.onKeydown}
        >${t}</li
      >
    `;
  }
  /**
   * Handles rendering of the ripple element.
   */
  renderRipple() {
    return g` <md-ripple
      part="ripple"
      for="item"
      ?disabled=${this.disabled}></md-ripple>`;
  }
  /**
   * Handles rendering of the focus ring.
   */
  renderFocusRing() {
    return g` <md-focus-ring
      part="focus-ring"
      for="item"
      inward></md-focus-ring>`;
  }
  /**
   * Classes applied to the list item root.
   */
  getRenderClasses() {
    return {
      disabled: this.disabled,
      selected: this.selected
    };
  }
  /**
   * Handles rendering the headline and supporting text.
   */
  renderBody() {
    return g`
      <slot></slot>
      <slot name="overline" slot="overline"></slot>
      <slot name="headline" slot="headline"></slot>
      <slot name="supporting-text" slot="supporting-text"></slot>
      <slot
        name="trailing-supporting-text"
        slot="trailing-supporting-text"></slot>
    `;
  }
  focus() {
    this.listItemRoot?.focus();
  }
}
oe.shadowRootOptions = {
  ...U.shadowRootOptions,
  delegatesFocus: !0
};
h([
  u({ type: Boolean, reflect: !0 })
], oe.prototype, "disabled", void 0);
h([
  u({ type: Boolean, attribute: "md-menu-item", reflect: !0 })
], oe.prototype, "isMenuItem", void 0);
h([
  u({ type: Boolean })
], oe.prototype, "selected", void 0);
h([
  u()
], oe.prototype, "value", void 0);
h([
  J(".list-item")
], oe.prototype, "listItemRoot", void 0);
h([
  Ie({ slot: "headline" })
], oe.prototype, "headlineElements", void 0);
h([
  Ie({ slot: "supporting-text" })
], oe.prototype, "supportingTextElements", void 0);
h([
  ha({ slot: "" })
], oe.prototype, "defaultElements", void 0);
h([
  u({ attribute: "typeahead-text" })
], oe.prototype, "typeaheadText", null);
h([
  u({ attribute: "display-text" })
], oe.prototype, "displayText", null);
class Qo extends oe {
}
Qo.styles = [Jl];
customElements.define("ew-select-option", Qo);
const od = ze(U);
class xt extends od {
  constructor() {
    super(...arguments), this.value = 0, this.max = 1, this.indeterminate = !1, this.fourColor = !1;
  }
  render() {
    const { ariaLabel: t } = this;
    return g`
      <div
        class="progress ${ne(this.getRenderClasses())}"
        role="progressbar"
        aria-label="${t || A}"
        aria-valuemin="0"
        aria-valuemax=${this.max}
        aria-valuenow=${this.indeterminate ? A : this.value}
        >${this.renderIndicator()}</div
      >
    `;
  }
  getRenderClasses() {
    return {
      indeterminate: this.indeterminate,
      "four-color": this.fourColor
    };
  }
}
h([
  u({ type: Number })
], xt.prototype, "value", void 0);
h([
  u({ type: Number })
], xt.prototype, "max", void 0);
h([
  u({ type: Boolean })
], xt.prototype, "indeterminate", void 0);
h([
  u({ type: Boolean, attribute: "four-color" })
], xt.prototype, "fourColor", void 0);
class ad extends xt {
  renderIndicator() {
    return this.indeterminate ? this.renderIndeterminateContainer() : this.renderDeterminateContainer();
  }
  // Determinate mode is rendered with an svg so the progress arc can be
  // easily animated via stroke-dashoffset.
  renderDeterminateContainer() {
    const t = (1 - this.value / this.max) * 100;
    return g`
      <svg viewBox="0 0 4800 4800">
        <circle class="track" pathLength="100"></circle>
        <circle
          class="active-track"
          pathLength="100"
          stroke-dashoffset=${t}></circle>
      </svg>
    `;
  }
  // Indeterminate mode rendered with 2 bordered-divs. The borders are
  // clipped into half circles by their containers. The divs are then carefully
  // animated to produce changes to the spinner arc size.
  // This approach has 4.5x the FPS of rendering via svg on Chrome 111.
  // See https://lit.dev/playground/#gist=febb773565272f75408ab06a0eb49746.
  renderIndeterminateContainer() {
    return g` <div class="spinner">
      <div class="left">
        <div class="circle"></div>
      </div>
      <div class="right">
        <div class="circle"></div>
      </div>
    </div>`;
  }
}
const sd = N`:host{--_active-indicator-color: var(--md-circular-progress-active-indicator-color, var(--md-sys-color-primary, #6750a4));--_active-indicator-width: var(--md-circular-progress-active-indicator-width, 10);--_four-color-active-indicator-four-color: var(--md-circular-progress-four-color-active-indicator-four-color, var(--md-sys-color-tertiary-container, #ffd8e4));--_four-color-active-indicator-one-color: var(--md-circular-progress-four-color-active-indicator-one-color, var(--md-sys-color-primary, #6750a4));--_four-color-active-indicator-three-color: var(--md-circular-progress-four-color-active-indicator-three-color, var(--md-sys-color-tertiary, #7d5260));--_four-color-active-indicator-two-color: var(--md-circular-progress-four-color-active-indicator-two-color, var(--md-sys-color-primary-container, #eaddff));--_size: var(--md-circular-progress-size, 48px);display:inline-flex;vertical-align:middle;width:var(--_size);height:var(--_size);position:relative;align-items:center;justify-content:center;contain:strict;content-visibility:auto}.progress{flex:1;align-self:stretch;margin:4px}.progress,.spinner,.left,.right,.circle,svg,.track,.active-track{position:absolute;inset:0}svg{transform:rotate(-90deg)}circle{cx:50%;cy:50%;r:calc(50%*(1 - var(--_active-indicator-width)/100));stroke-width:calc(var(--_active-indicator-width)*1%);stroke-dasharray:100;fill:rgba(0,0,0,0)}.active-track{transition:stroke-dashoffset 500ms cubic-bezier(0, 0, 0.2, 1);stroke:var(--_active-indicator-color)}.track{stroke:rgba(0,0,0,0)}.progress.indeterminate{animation:linear infinite linear-rotate;animation-duration:1568.2352941176ms}.spinner{animation:infinite both rotate-arc;animation-duration:5332ms;animation-timing-function:cubic-bezier(0.4, 0, 0.2, 1)}.left{overflow:hidden;inset:0 50% 0 0}.right{overflow:hidden;inset:0 0 0 50%}.circle{box-sizing:border-box;border-radius:50%;border:solid calc(var(--_active-indicator-width)/100*(var(--_size) - 8px));border-color:var(--_active-indicator-color) var(--_active-indicator-color) rgba(0,0,0,0) rgba(0,0,0,0);animation:expand-arc;animation-iteration-count:infinite;animation-fill-mode:both;animation-duration:1333ms,5332ms;animation-timing-function:cubic-bezier(0.4, 0, 0.2, 1)}.four-color .circle{animation-name:expand-arc,four-color}.left .circle{rotate:135deg;inset:0 -100% 0 0}.right .circle{rotate:100deg;inset:0 0 0 -100%;animation-delay:-666.5ms,0ms}@media(forced-colors: active){.active-track{stroke:CanvasText}.circle{border-color:CanvasText CanvasText Canvas Canvas}}@keyframes expand-arc{0%{transform:rotate(265deg)}50%{transform:rotate(130deg)}100%{transform:rotate(265deg)}}@keyframes rotate-arc{12.5%{transform:rotate(135deg)}25%{transform:rotate(270deg)}37.5%{transform:rotate(405deg)}50%{transform:rotate(540deg)}62.5%{transform:rotate(675deg)}75%{transform:rotate(810deg)}87.5%{transform:rotate(945deg)}100%{transform:rotate(1080deg)}}@keyframes linear-rotate{to{transform:rotate(360deg)}}@keyframes four-color{0%{border-top-color:var(--_four-color-active-indicator-one-color);border-right-color:var(--_four-color-active-indicator-one-color)}15%{border-top-color:var(--_four-color-active-indicator-one-color);border-right-color:var(--_four-color-active-indicator-one-color)}25%{border-top-color:var(--_four-color-active-indicator-two-color);border-right-color:var(--_four-color-active-indicator-two-color)}40%{border-top-color:var(--_four-color-active-indicator-two-color);border-right-color:var(--_four-color-active-indicator-two-color)}50%{border-top-color:var(--_four-color-active-indicator-three-color);border-right-color:var(--_four-color-active-indicator-three-color)}65%{border-top-color:var(--_four-color-active-indicator-three-color);border-right-color:var(--_four-color-active-indicator-three-color)}75%{border-top-color:var(--_four-color-active-indicator-four-color);border-right-color:var(--_four-color-active-indicator-four-color)}90%{border-top-color:var(--_four-color-active-indicator-four-color);border-right-color:var(--_four-color-active-indicator-four-color)}100%{border-top-color:var(--_four-color-active-indicator-one-color);border-right-color:var(--_four-color-active-indicator-one-color)}}
`;
class ea extends ad {
}
ea.styles = [sd];
customElements.define("ew-circular-progress", ea);
class Kt extends U {
  render() {
    return g`
      <div>
        <ew-circular-progress
          active
          ?indeterminate=${this.progress === void 0}
          .value=${this.progress !== void 0 ? this.progress / 100 : void 0}
        ></ew-circular-progress>
        ${this.progress !== void 0 ? g`<div>${this.progress}%</div>` : ""}
      </div>
      ${this.label}
    `;
  }
}
Kt.styles = N`
    :host {
      display: flex;
      flex-direction: column;
      text-align: center;
    }
    ew-circular-progress {
      margin-bottom: 16px;
    }
  `;
h([
  u()
], Kt.prototype, "label", void 0);
h([
  u()
], Kt.prototype, "progress", void 0);
customElements.define("ewt-page-progress", Kt);
class Yt extends U {
  render() {
    return g`
      <div class="icon">${this.icon}</div>
      ${this.label}
    `;
  }
}
Yt.styles = N`
    :host {
      display: flex;
      flex-direction: column;
      text-align: center;
    }
    .icon {
      font-size: 50px;
      line-height: 80px;
      color: black;
    }
  `;
h([
  u()
], Yt.prototype, "icon", void 0);
h([
  u()
], Yt.prototype, "label", void 0);
customElements.define("ewt-page-message", Yt);
const nd = be`
  <svg width="24" height="24" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
    />
  </svg>
`, ld = be`
  <svg viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z"
    />
  </svg>
`, Nr = be`
  <svg slot="start" viewBox="0 0 24 24">
    <path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" />
  </svg>
`, dd = be`
  <svg slot="start" viewBox="0 0 24 24">
    <path d="M12,21L15.6,16.2C14.6,15.45 13.35,15 12,15C10.65,15 9.4,15.45 8.4,16.2L12,21M12,3C7.95,3 4.21,4.34 1.2,6.6L3,9C5.5,7.12 8.62,6 12,6C15.38,6 18.5,7.12 21,9L22.8,6.6C19.79,4.34 16.05,3 12,3M12,9C9.3,9 6.81,9.89 4.8,11.4L6.6,13.8C8.1,12.67 9.97,12 12,12C14.03,12 15.9,12.67 17.4,13.8L19.2,11.4C17.19,9.89 14.7,9 12,9Z" />
  </svg>
`, Hr = be`
  <svg slot="start" viewBox="0 0 24 24">
    <path d="M20,19V7H4V19H20M20,3A2,2 0 0,1 22,5V19A2,2 0 0,1 20,21H4A2,2 0 0,1 2,19V5C2,3.89 2.9,3 4,3H20M13,17V15H18V17H13M9.58,13L5.57,9H8.4L11.7,12.3C12.09,12.69 12.09,13.33 11.7,13.72L8.42,17H5.59L9.58,13Z" />
  </svg>
`, Zr = be`
  <svg slot="start" viewBox="0 0 24 24">
  <path d="M16.36,14C16.44,13.34 16.5,12.68 16.5,12C16.5,11.32 16.44,10.66 16.36,10H19.74C19.9,10.64 20,11.31 20,12C20,12.69 19.9,13.36 19.74,14M14.59,19.56C15.19,18.45 15.65,17.25 15.97,16H18.92C17.96,17.65 16.43,18.93 14.59,19.56M14.34,14H9.66C9.56,13.34 9.5,12.68 9.5,12C9.5,11.32 9.56,10.65 9.66,10H14.34C14.43,10.65 14.5,11.32 14.5,12C14.5,12.68 14.43,13.34 14.34,14M12,19.96C11.17,18.76 10.5,17.43 10.09,16H13.91C13.5,17.43 12.83,18.76 12,19.96M8,8H5.08C6.03,6.34 7.57,5.06 9.4,4.44C8.8,5.55 8.35,6.75 8,8M5.08,16H8C8.35,17.25 8.8,18.45 9.4,19.56C7.57,18.93 6.03,17.65 5.08,16M4.26,14C4.1,13.36 4,12.69 4,12C4,11.31 4.1,10.64 4.26,10H7.64C7.56,10.66 7.5,11.32 7.5,12C7.5,12.68 7.56,13.34 7.64,14M12,4.03C12.83,5.23 13.5,6.57 13.91,8H10.09C10.5,6.57 11.17,5.23 12,4.03M18.92,8H15.97C15.65,6.75 15.19,5.55 14.59,4.44C16.43,5.07 17.96,6.34 18.92,8M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
  </svg>
`, Vr = be`
  <svg slot="start" viewBox="0 0 24 24">
    <path d="m12.151 1.5882c-.3262 0-.6523.1291-.8996.3867l-8.3848 8.7354c-.0619.0644-.1223.1368-.1807.2154-.0588.0789-.1151.1638-.1688.2534-.2593.4325-.4552.9749-.5232 1.4555-.0026.018-.0076.0369-.0094.0548-.0121.0987-.0184.1944-.0184.2857v8.0124a1.2731 1.2731 0 001.2731 1.2731h7.8313l-3.4484-3.593a1.7399 1.7399 0 111.0803-1.125l2.6847 2.7972v-10.248a1.7399 1.7399 0 111.5276-0v7.187l2.6702-2.782a1.7399 1.7399 0 111.0566 1.1505l-3.7269 3.8831v2.7299h8.174a1.2471 1.2471 0 001.2471-1.2471v-8.0375c0-.0912-.0059-.1868-.0184-.2855-.0603-.4935-.2636-1.0617-.5326-1.5105-.0537-.0896-.1101-.1745-.1684-.253-.0588-.079-.1191-.1513-.181-.2158l-8.3848-8.7363c-.2473-.2577-.5735-.3866-.8995-.3864" />
  </svg>
`, cd = be`
  <svg slot="start" viewBox="0 0 24 24">
    <path d="M15,14C17.67,14 23,15.33 23,18V20H7V18C7,15.33 12.33,14 15,14M15,12A4,4 0 0,1 11,8A4,4 0 0,1 15,4A4,4 0 0,1 19,8A4,4 0 0,1 15,12M5,9.59L7.12,7.46L8.54,8.88L6.41,11L8.54,13.12L7.12,14.54L5,12.41L2.88,14.54L1.46,13.12L3.59,11L1.46,8.88L2.88,7.46L5,9.59Z" />
  </svg>
`, hd = be`
  <svg slot="start" viewBox="0 0 24 24">
    <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" />
  </svg>
`, fd = [
  73,
  77,
  80,
  82,
  79,
  86,
  1
  // protocol version
];
var He;
(function(i) {
  i[i.CURRENT_STATE = 1] = "CURRENT_STATE", i[i.ERROR_STATE = 2] = "ERROR_STATE", i[i.RPC = 3] = "RPC", i[i.RPC_RESULT = 4] = "RPC_RESULT";
})(He || (He = {}));
var Ee;
(function(i) {
  i[i.READY = 2] = "READY", i[i.PROVISIONING = 3] = "PROVISIONING", i[i.PROVISIONED = 4] = "PROVISIONED";
})(Ee || (Ee = {}));
const pd = {
  0: "NO_ERROR",
  1: "INVALID_RPC_PACKET",
  2: "UNKNOWN_RPC_COMMAND",
  3: "UNABLE_TO_CONNECT",
  254: "TIMEOUT",
  255: "UNKNOWN_ERROR"
};
class ta extends Error {
  constructor() {
    super("Port is not ready");
  }
}
const ud = (i) => new Promise((t) => setTimeout(t, i)), md = (i, t = 2) => {
  let e = i.toString(16).toUpperCase();
  return e.startsWith("-") ? "-0x" + e.substring(1).padStart(t, "0") : "0x" + e.padStart(t, "0");
}, Wr = (i) => "[" + i.map((t) => md(t)).join(", ") + "]";
class vd extends EventTarget {
  constructor(t, e) {
    if (super(), this.port = t, this.logger = e, this.error = 0, t.readable === null)
      throw new Error("Port is not readable");
    if (t.writable === null)
      throw new Error("Port is not writable");
  }
  /**
   * Detect Improv Serial, fetch the state and return the next URL if provisioned.
   * @param timeout Timeout in ms to wait for the device to respond. Default to 1000ms.
   */
  async initialize(t = 1e3) {
    if (this.logger.log("Initializing Improv Serial"), this._processInput(), await ud(1e3), this._reader === void 0)
      throw new ta();
    try {
      await new Promise(async (e, r) => {
        setTimeout(() => r(new Error("Improv Wi-Fi Serial not detected")), t), await this.requestCurrentState(), e(void 0);
      }), await this.requestInfo();
    } catch (e) {
      throw await this.close(), e;
    }
    return this.info;
  }
  async close() {
    this._reader && await new Promise((t) => {
      this._reader.cancel(), this.addEventListener("disconnect", t, { once: !0 });
    });
  }
  /**
   * This command will trigger at least one packet,
   * the Current State and if already provisioned,
   * the same response you would get if device provisioning
   * was successful (see below).
   */
  async requestCurrentState() {
    let t;
    try {
      await new Promise(async (r, o) => {
        this.addEventListener("state-changed", r, { once: !0 });
        const a = (s) => {
          this.removeEventListener("state-changed", r), o(s);
        };
        t = this._sendRPCWithResponse(2, []), t.catch(a);
      });
    } catch (r) {
      throw this._rpcFeedback = void 0, new Error(`Error fetching current state: ${r}`);
    }
    if (this.state !== Ee.PROVISIONED) {
      this._rpcFeedback = void 0;
      return;
    }
    const e = await t;
    this.nextUrl = e[0];
  }
  async requestInfo(t) {
    const e = await this._sendRPCWithResponse(3, [], t);
    this.info = {
      firmware: e[0],
      version: e[1],
      name: e[3],
      chipFamily: e[2]
    };
  }
  async provision(t, e, r) {
    const o = new TextEncoder(), a = o.encode(t), s = o.encode(e), n = [
      a.length,
      ...a,
      s.length,
      ...s
    ], c = await this._sendRPCWithResponse(1, n, r);
    this.nextUrl = c[0];
  }
  async scan() {
    const e = (await this._sendRPCWithMultipleResponses(4, [])).map(([r, o, a]) => ({
      name: r,
      rssi: parseInt(o),
      secured: a === "YES"
    }));
    return e.sort((r, o) => r.name.toLocaleLowerCase().localeCompare(o.name.toLocaleLowerCase())), e;
  }
  _sendRPC(t, e) {
    this.writePacketToStream(He.RPC, [
      t,
      e.length,
      ...e
    ]);
  }
  async _sendRPCWithResponse(t, e, r) {
    if (this._rpcFeedback)
      throw new Error("Only 1 RPC command that requires feedback can be active");
    return await this._awaitRPCResultWithTimeout(new Promise((o, a) => {
      this._rpcFeedback = { command: t, resolve: o, reject: a }, this._sendRPC(t, e);
    }), r);
  }
  async _sendRPCWithMultipleResponses(t, e, r) {
    if (this._rpcFeedback)
      throw new Error("Only 1 RPC command that requires feedback can be active");
    return await this._awaitRPCResultWithTimeout(new Promise((o, a) => {
      this._rpcFeedback = {
        command: t,
        resolve: o,
        reject: a,
        receivedData: []
      }, this._sendRPC(t, e);
    }), r);
  }
  async _awaitRPCResultWithTimeout(t, e) {
    return e ? await new Promise((r, o) => {
      const a = setTimeout(() => this._setError(
        254
        /* ImprovSerialErrorState.TIMEOUT */
      ), e);
      t.finally(() => clearTimeout(a)), t.then(r, o);
    }) : await t;
  }
  async _processInput() {
    this.logger.debug("Starting read loop"), this._reader = this.port.readable.getReader();
    try {
      let t = [], e, r = 0;
      for (; ; ) {
        const { value: o, done: a } = await this._reader.read();
        if (a)
          break;
        if (!(!o || o.length === 0))
          for (const s of o) {
            if (e === !1) {
              s === 10 && (e = void 0);
              continue;
            }
            if (e === !0) {
              t.push(s), t.length === r && (this._handleIncomingPacket(t), e = void 0, t = []);
              continue;
            }
            if (s === 10) {
              t = [];
              continue;
            }
            if (t.push(s), t.length !== 9)
              continue;
            if (e = String.fromCharCode(...t.slice(0, 6)) === "IMPROV", !e) {
              t = [];
              continue;
            }
            r = 9 + t[8] + 1;
          }
      }
    } catch (t) {
      this.logger.error("Error while reading serial port", t);
    } finally {
      this._reader.releaseLock(), this._reader = void 0;
    }
    this.logger.debug("Finished read loop"), this.dispatchEvent(new Event("disconnect"));
  }
  _handleIncomingPacket(t) {
    const e = t.slice(6), r = e[0], o = e[1], a = e[2], s = e.slice(3, 3 + a);
    if (this.logger.debug("PROCESS", {
      version: r,
      packetType: o,
      packetLength: a,
      data: Wr(s)
    }), r !== 1) {
      this.logger.error("Received unsupported version", r);
      return;
    }
    let n = e[3 + a], c = 0;
    for (let l = 0; l < t.length - 1; l++)
      c += t[l];
    if (c = c & 255, c !== n) {
      this.logger.error(`Received invalid checksum ${n}. Expected ${c}`);
      return;
    }
    if (o === He.CURRENT_STATE)
      this.state = s[0], this.dispatchEvent(new CustomEvent("state-changed", {
        detail: this.state
      }));
    else if (o === He.ERROR_STATE)
      this._setError(s[0]);
    else if (o === He.RPC_RESULT) {
      if (!this._rpcFeedback) {
        this.logger.error("Received result while not waiting for one");
        return;
      }
      const l = s[0];
      if (l !== this._rpcFeedback.command) {
        this.logger.error(`Received result for command ${l} but expected ${this._rpcFeedback.command}`);
        return;
      }
      const d = [], v = s[1];
      let p = 2;
      for (; p < 2 + v; )
        d.push(String.fromCodePoint(...s.slice(p + 1, p + s[p] + 1))), p += s[p] + 1;
      "receivedData" in this._rpcFeedback ? d.length > 0 ? this._rpcFeedback.receivedData.push(d) : (this._rpcFeedback.resolve(this._rpcFeedback.receivedData), this._rpcFeedback = void 0) : (this._rpcFeedback.resolve(d), this._rpcFeedback = void 0);
    } else
      this.logger.error("Unable to handle packet", e);
  }
  /**
   * Add header + checksum and write packet to stream
   */
  async writePacketToStream(t, e) {
    const r = new Uint8Array([
      ...fd,
      t,
      e.length,
      ...e,
      0,
      0
      // Will be newline
    ]);
    r[r.length - 2] = r.reduce((a, s) => a + s, 0) & 255, r[r.length - 1] = 10, this.logger.debug("Writing to stream:", Wr(new Array(...r)));
    const o = this.port.writable.getWriter();
    await o.write(r);
    try {
      o.releaseLock();
    } catch (a) {
      console.error("Ignoring release lock error", a);
    }
  }
  // Error is either received from device or is a timeout
  _setError(t) {
    this.error = t, t > 0 && this._rpcFeedback && (this._rpcFeedback.reject(pd[t] || `UNKNOWN_ERROR (${t})`), this._rpcFeedback = void 0), this.dispatchEvent(new CustomEvent("error-changed", {
      detail: this.error
    }));
  }
}
const et = async (i, t) => {
  await i.setRTS(!0), await Ve(100), await t.after();
}, gd = async (i, t, e, r, o) => {
  let a, s;
  const n = (y) => i({
    ...y,
    manifest: r,
    build: a,
    chipFamily: s
  }), c = new Hi(t), l = new ml({
    transport: c,
    baudrate: 115200,
    romBaudrate: 115200,
    enableTracing: !1
  });
  window.esploader = l, n({
    state: "initializing",
    message: "Initializing...",
    details: { done: !1 }
  });
  try {
    await l.main(), await l.flashId();
  } catch (y) {
    console.error(y), n({
      state: "error",
      message: "Failed to initialize. Try resetting your device or holding the BOOT button while clicking INSTALL.",
      details: { error: "failed_initialize", details: y }
    }), await et(c, l), await c.disconnect();
    return;
  }
  if (s = l.chip.CHIP_NAME, n({
    state: "initializing",
    message: `Initialized. Found ${s}`,
    details: { done: !0 }
  }), a = r.builds.find((y) => y.chipFamily === s), !a) {
    n({
      state: "error",
      message: `Your ${s} board is not supported.`,
      details: { error: "not_supported", details: s }
    }), await et(c, l), await c.disconnect();
    return;
  }
  n({
    state: "preparing",
    message: "Preparing installation...",
    details: { done: !1 }
  });
  const d = new URL(e, location.toString()).toString(), v = a.parts.map(async (y) => {
    const x = new URL(y.path, d).toString(), b = await fetch(x);
    if (!b.ok)
      throw new Error(`Downlading firmware ${y.path} failed: ${b.status}`);
    const E = new FileReader(), S = await b.blob();
    return new Promise((m) => {
      E.addEventListener("load", () => m(E.result)), E.readAsBinaryString(S);
    });
  }), p = [];
  let f = 0;
  for (let y = 0; y < v.length; y++)
    try {
      const x = await v[y];
      p.push({ data: x, address: a.parts[y].offset }), f += x.length;
    } catch (x) {
      n({
        state: "error",
        message: x.message,
        details: {
          error: "failed_firmware_download",
          details: x.message
        }
      }), await et(c, l), await c.disconnect();
      return;
    }
  n({
    state: "preparing",
    message: "Installation prepared",
    details: { done: !0 }
  }), o && (n({
    state: "erasing",
    message: "Erasing device...",
    details: { done: !1 }
  }), await l.eraseFlash(), n({
    state: "erasing",
    message: "Device erased",
    details: { done: !0 }
  })), n({
    state: "writing",
    message: "Writing progress: 0%",
    details: {
      bytesTotal: f,
      bytesWritten: 0,
      percentage: 0
    }
  });
  let _ = 0;
  try {
    await l.writeFlash({
      fileArray: p,
      flashSize: "keep",
      flashMode: "keep",
      flashFreq: "keep",
      eraseAll: !1,
      compress: !0,
      // report progress
      reportProgress: (y, x, b) => {
        const E = x / b * p[y].data.length, S = Math.floor((_ + E) / f * 100);
        if (x === b) {
          _ += E;
          return;
        }
        n({
          state: "writing",
          message: `Writing progress: ${S}%`,
          details: {
            bytesTotal: f,
            bytesWritten: _ + x,
            percentage: S
          }
        });
      }
    });
  } catch (y) {
    n({
      state: "error",
      message: y.message,
      details: { error: "write_failed", details: y }
    }), await et(c, l), await c.disconnect();
    return;
  }
  n({
    state: "writing",
    message: "Writing complete",
    details: {
      bytesTotal: f,
      bytesWritten: _,
      percentage: 100
    }
  }), await et(c, l), console.log("DISCONNECT"), await c.disconnect(), n({
    state: "finished",
    message: "All done!"
  });
}, _d = (i, t = "") => {
  const e = document.createElement("a");
  e.target = "_blank", e.href = i, e.download = t, document.body.appendChild(e), e.dispatchEvent(new MouseEvent("click")), document.body.removeChild(e);
}, bd = (i, t = "") => {
  const e = new Blob([i], { type: "text/plain" }), r = URL.createObjectURL(e);
  _d(r, t), setTimeout(() => URL.revokeObjectURL(r), 0);
}, yd = (i, t, e, r) => {
  r = r || {};
  const o = new CustomEvent(t, {
    bubbles: r.bubbles === void 0 ? !0 : r.bubbles,
    cancelable: !!r.cancelable,
    composed: r.composed === void 0 ? !0 : r.composed,
    detail: e
  });
  i.dispatchEvent(o);
}, xd = async (i) => {
  const t = new URL(i, location.toString()).toString(), r = await (await fetch(t)).json();
  return "new_install_skip_erase" in r && (console.warn('Manifest option "new_install_skip_erase" is deprecated. Use "new_install_prompt_erase" instead.'), r.new_install_skip_erase && (r.new_install_prompt_erase = !0)), r;
}, wd = "10.2.1";
console.log(`ESP Web Tools ${wd} by Open Home Foundation; https://esphome.github.io/esp-web-tools/`);
const qr = "⚠️", Gr = "🎉";
class ae extends U {
  constructor() {
    super(...arguments), this.logger = console, this._state = "DASHBOARD", this._installErase = !1, this._installConfirmed = !1, this._provisionForce = !1, this._wasProvisioned = !1, this._busy = !1, this._selectedSsid = null, this._bodyOverflow = null, this._handleDisconnect = () => {
      this._state = "ERROR", this._error = "Disconnected";
    };
  }
  render() {
    if (!this.port)
      return g``;
    let t, e, r = !1;
    return this._client === void 0 && this._state !== "INSTALL" && this._state !== "LOGS" ? this._error ? [t, e] = this._renderError(this._error) : e = this._renderProgress("Connecting") : this._state === "INSTALL" ? [t, e, r] = this._renderInstall() : this._state === "ASK_ERASE" ? [t, e] = this._renderAskErase() : this._state === "ERROR" ? [t, e] = this._renderError(this._error) : this._state === "DASHBOARD" ? [t, e, r] = this._client ? this._renderDashboard() : this._renderDashboardNoImprov() : this._state === "PROVISION" ? [t, e] = this._renderProvision() : this._state === "LOGS" && ([t, e] = this._renderLogs()), g`
      <ew-dialog
        open
        .heading=${t}
        @cancel=${this._preventDefault}
        @closed=${this._handleClose}
      >
        ${t ? g`<div slot="headline">${t}</div>` : ""}
        ${r ? g`
              <ew-icon-button slot="headline" @click=${this._closeDialog}>
                ${nd}
              </ew-icon-button>
            ` : ""}
        ${e}
      </ew-dialog>
    `;
  }
  _renderProgress(t, e) {
    return g`
      <ewt-page-progress
        slot="content"
        .label=${t}
        .progress=${e}
      ></ewt-page-progress>
    `;
  }
  _renderError(t) {
    const e = "Error", r = g`
      <ewt-page-message
        slot="content"
        .icon=${qr}
        .label=${t}
      ></ewt-page-message>
      <div slot="actions">
        <ew-text-button @click=${this._closeDialog}>Close</ew-text-button>
      </div>
    `;
    return [e, r];
  }
  _renderDashboard() {
    const t = this._manifest.name;
    let e, r = !0;
    return e = g`
      <div slot="content">
        <ew-list>
          <ew-list-item>
            <div slot="headline">Connected to ${this._info.name}</div>
            <div slot="supporting-text">
              ${this._info.firmware}&nbsp;${this._info.version}
              (${this._info.chipFamily})
            </div>
          </ew-list-item>
          ${this._isSameVersion ? "" : g`
                <ew-list-item
                  type="button"
                  @click=${() => {
      this._isSameFirmware ? this._startInstall(!1) : this._manifest.new_install_prompt_erase ? this._state = "ASK_ERASE" : this._startInstall(!0);
    }}
                >
                  ${Nr}
                  <div slot="headline">
                    ${this._isSameFirmware ? `Update ${this._manifest.name}` : `Install ${this._manifest.name}`}
                  </div>
                </ew-list-item>
              `}
          ${this._client.nextUrl === void 0 ? "" : g`
                <ew-list-item
                  type="link"
                  href=${this._client.nextUrl}
                  target="_blank"
                >
                  ${Zr}
                  <div slot="headline">Visit Device</div>
                </ew-list-item>
              `}
          ${!this._manifest.home_assistant_domain || this._client.state !== Ee.PROVISIONED ? "" : g`
                <ew-list-item
                  type="link"
                  href=${`https://my.home-assistant.io/redirect/config_flow_start/?domain=${this._manifest.home_assistant_domain}`}
                  target="_blank"
                >
                  ${Vr}
                  <div slot="headline">Add to Home Assistant</div>
                </ew-list-item>
              `}
          <ew-list-item
            type="button"
            @click=${() => {
      this._state = "PROVISION", this._client.state === Ee.PROVISIONED && (this._provisionForce = !0);
    }}
          >
            ${dd}
            <div slot="headline">
              ${this._client.state === Ee.READY ? "Connect to Wi-Fi" : "Change Wi-Fi"}
            </div>
          </ew-list-item>
          <ew-list-item
            type="button"
            @click=${async () => {
      const o = this._client;
      o && (await this._closeClientWithoutEvents(o), await Ve(100)), this._client = void 0, this._state = "LOGS";
    }}
          >
            ${Hr}
            <div slot="headline">Logs & Console</div>
          </ew-list-item>
          ${this._isSameFirmware && this._manifest.funding_url ? g`
                <ew-list-item
                  type="link"
                  href=${this._manifest.funding_url}
                  target="_blank"
                >
                  ${hd}
                  <div slot="headline">Fund Development</div>
                </ew-list-item>
              ` : ""}
          ${this._isSameVersion ? g`
                <ew-list-item
                  type="button"
                  class="danger"
                  @click=${() => this._startInstall(!0)}
                >
                  ${cd}
                  <div slot="headline">Erase User Data</div>
                </ew-list-item>
              ` : ""}
        </ew-list>
      </div>
    `, [t, e, r];
  }
  _renderDashboardNoImprov() {
    const t = this._manifest.name;
    let e, r = !0;
    return e = g`
      <div slot="content">
        <ew-list>
          <ew-list-item
            type="button"
            @click=${() => {
      this._manifest.new_install_prompt_erase ? this._state = "ASK_ERASE" : this._startInstall(!0);
    }}
          >
            ${Nr}
            <div slot="headline">${`Install ${this._manifest.name}`}</div>
          </ew-list-item>
          <ew-list-item
            type="button"
            @click=${async () => {
      this._client = void 0, this._state = "LOGS";
    }}
          >
            ${Hr}
            <div slot="headline">Logs & Console</div>
          </ew-list-item>
        </ew-list>
      </div>
    `, [t, e, r];
  }
  _renderProvision() {
    var t;
    let e = "Configure Wi-Fi", r;
    if (this._busy)
      return [
        e,
        this._renderProgress(this._ssids === void 0 ? "Scanning for networks" : "Trying to connect")
      ];
    if (!this._provisionForce && this._client.state === Ee.PROVISIONED) {
      e = void 0;
      const o = !this._wasProvisioned && (this._client.nextUrl !== void 0 || "home_assistant_domain" in this._manifest);
      r = g`
        <div slot="content">
          <ewt-page-message
            .icon=${Gr}
            label="Device connected to the network!"
          ></ewt-page-message>
          ${o ? g`
                <ew-list>
                  ${this._client.nextUrl === void 0 ? "" : g`
                        <ew-list-item
                          type="link"
                          href=${this._client.nextUrl}
                          target="_blank"
                          @click=${() => {
        this._state = "DASHBOARD";
      }}
                        >
                          ${Zr}
                          <div slot="headline">Visit Device</div>
                        </ew-list-item>
                      `}
                  ${this._manifest.home_assistant_domain ? g`
                        <ew-list-item
                          type="link"
                          href=${`https://my.home-assistant.io/redirect/config_flow_start/?domain=${this._manifest.home_assistant_domain}`}
                          target="_blank"
                          @click=${() => {
        this._state = "DASHBOARD";
      }}
                        >
                          ${Vr}
                          <div slot="headline">Add to Home Assistant</div>
                        </ew-list-item>
                      ` : ""}
                  <ew-list-item
                    type="button"
                    @click=${() => {
        this._state = "DASHBOARD";
      }}
                  >
                    <div slot="start" class="fake-icon"></div>
                    <div slot="headline">Skip</div>
                  </ew-list-item>
                </ew-list>
              ` : ""}
        </div>

        ${o ? "" : g`
              <div slot="actions">
                <ew-text-button
                  @click=${() => {
        this._state = "DASHBOARD";
      }}
                >
                  Continue
                </ew-text-button>
              </div>
            `}
      `;
    } else {
      let o;
      switch (this._client.error) {
        case 3:
          o = "Unable to connect";
          break;
        case 254:
          o = "Timeout";
          break;
        case 0:
        // Happens when list SSIDs not supported.
        case 2:
          break;
        default:
          o = `Unknown error (${this._client.error})`;
      }
      const a = (t = this._ssids) === null || t === void 0 ? void 0 : t.find((s) => s.name === this._selectedSsid);
      r = g`
        <ew-icon-button slot="headline" @click=${this._updateSsids}>
          ${ld}
        </ew-icon-button>
        <div slot="content">
          <div>Connect your device to the network to start using it.</div>
          ${o ? g`<p class="error">${o}</p>` : ""}
          ${this._ssids !== null ? g`
                <ew-filled-select
                  menu-positioning="fixed"
                  label="Network"
                  @change=${(s) => {
        const n = s.target.selectedIndex;
        this._selectedSsid = n === this._ssids.length ? null : this._ssids[n].name;
      }}
                >
                  ${this._ssids.map((s) => g`
                      <ew-select-option
                        .selected=${a === s}
                        .value=${s.name}
                      >
                        ${s.name}
                      </ew-select-option>
                    `)}
                  <ew-divider></ew-divider>
                  <ew-select-option .selected=${!a}>
                    Join other…
                  </ew-select-option>
                </ew-filled-select>
              ` : ""}
          ${// Show input box if command not supported or "Join Other" selected
      a ? "" : g`
                  <ew-filled-text-field
                    label="Network Name"
                    name="ssid"
                  ></ew-filled-text-field>
                `}
          ${!a || a.secured ? g`
                <ew-filled-text-field
                  label="Password"
                  name="password"
                  type="password"
                ></ew-filled-text-field>
              ` : ""}
        </div>
        <div slot="actions">
          <ew-text-button
            @click=${() => {
        this._state = "DASHBOARD";
      }}
          >
            ${this._installState && this._installErase ? "Skip" : "Back"}
          </ew-text-button>
          <ew-text-button @click=${this._doProvision}>Connect</ew-text-button>
        </div>
      `;
    }
    return [e, r];
  }
  _renderAskErase() {
    const t = "Erase device", e = g`
      <div slot="content">
        <div>
          Do you want to erase the device before installing
          ${this._manifest.name}? All data on the device will be lost.
        </div>
        <label class="formfield">
          <ew-checkbox touch-target="wrapper" class="danger"></ew-checkbox>
          Erase device
        </label>
      </div>
      <div slot="actions">
        <ew-text-button
          @click=${() => {
      this._state = "DASHBOARD";
    }}
        >
          Back
        </ew-text-button>
        <ew-text-button
          @click=${() => {
      const r = this.shadowRoot.querySelector("ew-checkbox");
      this._startInstall(r.checked);
    }}
        >
          Next
        </ew-text-button>
      </div>
    `;
    return [t, e];
  }
  _renderInstall() {
    let t, e;
    const o = !this._installErase && this._isSameFirmware;
    if (!this._installConfirmed && this._isSameVersion)
      t = "Erase User Data", e = g`
        <div slot="content">
          Do you want to reset your device and erase all user data from your
          device?
        </div>
        <div slot="actions">
          <ew-text-button class="danger" @click=${this._confirmInstall}>
            Erase User Data
          </ew-text-button>
        </div>
      `;
    else if (this._installConfirmed)
      if (!this._installState || this._installState.state === "initializing" || this._installState.state === "preparing")
        t = "Installing", e = this._renderProgress("Preparing installation");
      else if (this._installState.state === "erasing")
        t = "Installing", e = this._renderProgress("Erasing");
      else if (this._installState.state === "writing" || // When we're finished, keep showing this screen with 100% written
      // until Improv is initialized / not detected.
      this._installState.state === "finished" && this._client === void 0) {
        t = "Installing";
        let a, s;
        this._installState.state === "finished" ? s = "Wrapping up" : this._installState.details.percentage < 4 ? s = "Installing" : a = this._installState.details.percentage, e = this._renderProgress(g`
          ${s ? g`${s}<br />` : ""}
          <br />
          This will take
          ${this._installState.chipFamily === "ESP8266" ? "a minute" : "2 minutes"}.<br />
          Keep this page visible to prevent slow down
        `, a);
      } else if (this._installState.state === "finished") {
        t = void 0;
        const a = this._client !== null;
        e = g`
        <ewt-page-message
          slot="content"
          .icon=${Gr}
          label="Installation complete!"
        ></ewt-page-message>

        <div slot="actions">
          <ew-text-button
            @click=${() => {
          this._state = a && this._installErase ? "PROVISION" : "DASHBOARD";
        }}
          >
            Next
          </ew-text-button>
        </div>
      `;
      } else this._installState.state === "error" && (t = "Installation failed", e = g`
        <ewt-page-message
          slot="content"
          .icon=${qr}
          .label=${this._installState.message}
        ></ewt-page-message>
        <div slot="actions">
          <ew-text-button
            @click=${async () => {
        this._initialize(), this._state = "DASHBOARD";
      }}
          >
            Back
          </ew-text-button>
        </div>
      `);
    else {
      t = "Confirm Installation";
      const a = o ? "update to" : "install";
      e = g`
        <div slot="content">
          ${o ? g`Your device is running
                ${this._info.firmware}&nbsp;${this._info.version}.<br /><br />` : ""}
          Do you want to ${a}
          ${this._manifest.name}&nbsp;${this._manifest.version}?
          ${this._installErase ? g`<br /><br />All data on the device will be erased.` : ""}
        </div>
        <div slot="actions">
          <ew-text-button
            @click=${() => {
        this._state = "DASHBOARD";
      }}
          >
            Back
          </ew-text-button>
          <ew-text-button @click=${this._confirmInstall}>
            Install
          </ew-text-button>
        </div>
      `;
    }
    return [t, e, !1];
  }
  _renderLogs() {
    let t = "Logs", e;
    return e = g`
      <div slot="content">
        <ewt-console .port=${this.port} .logger=${this.logger}></ewt-console>
      </div>
      <div slot="actions">
        <ew-text-button
          @click=${async () => {
      await this.shadowRoot.querySelector("ewt-console").reset();
    }}
        >
          Reset Device
        </ew-text-button>
        <ew-text-button
          @click=${() => {
      bd(this.shadowRoot.querySelector("ewt-console").logs(), "esp-web-tools-logs.txt"), this.shadowRoot.querySelector("ewt-console").reset();
    }}
        >
          Download Logs
        </ew-text-button>
        <ew-text-button
          @click=${async () => {
      await this.shadowRoot.querySelector("ewt-console").disconnect(), this._state = "DASHBOARD", this._initialize();
    }}
        >
          Back
        </ew-text-button>
      </div>
    `, [t, e];
  }
  willUpdate(t) {
    t.has("_state") && (this._state !== "ERROR" && (this._error = void 0), this._state === "PROVISION" ? this._updateSsids() : this._provisionForce = !1, this._state === "INSTALL" && (this._installConfirmed = !1, this._installState = void 0));
  }
  async _updateSsids(t = 0) {
    const e = this._ssids;
    this._ssids = void 0, this._busy = !0;
    let r;
    try {
      r = await this._client.scan();
    } catch {
      this._ssids === void 0 && (this._ssids = null, this._selectedSsid = null), this._busy = !1;
      return;
    }
    if (r.length === 0 && t < 3) {
      console.log("SCHEDULE RETRY", t), setTimeout(() => this._updateSsids(t + 1), 2e3);
      return;
    }
    e ? this._selectedSsid && !r.find((o) => o.name === this._selectedSsid) && (this._selectedSsid = r[0].name) : this._selectedSsid = r.length ? r[0].name : null, this._ssids = r, this._busy = !1;
  }
  firstUpdated(t) {
    super.firstUpdated(t), this._bodyOverflow = document.body.style.overflow, document.body.style.overflow = "hidden", this._initialize();
  }
  updated(t) {
    super.updated(t), t.has("_state") && this.setAttribute("state", this._state), this._state === "PROVISION" && (t.has("_selectedSsid") && this._selectedSsid === null ? this._focusFormElement("ew-filled-text-field[name=ssid]") : t.has("_ssids") && this._focusFormElement());
  }
  _focusFormElement(t = "ew-filled-text-field, ew-filled-select") {
    const e = this.shadowRoot.querySelector(t);
    e && e.updateComplete.then(() => setTimeout(() => e.focus(), 100));
  }
  async _initialize(t = !1) {
    if (this.port.readable === null || this.port.writable === null) {
      this._state = "ERROR", this._error = "Serial port is not readable/writable. Close any other application using it and try again.";
      return;
    }
    try {
      this._manifest = await xd(this.manifestPath);
    } catch {
      this._state = "ERROR", this._error = "Failed to download manifest";
      return;
    }
    if (this._manifest.new_install_improv_wait_time === 0) {
      this._client = null;
      return;
    }
    const e = new vd(this.port, this.logger);
    e.addEventListener("state-changed", () => {
      this.requestUpdate();
    }), e.addEventListener("error-changed", () => this.requestUpdate());
    try {
      const r = t ? this._manifest.new_install_improv_wait_time !== void 0 ? this._manifest.new_install_improv_wait_time * 1e3 : 1e4 : 1e3;
      this._info = await e.initialize(r), this._client = e, e.addEventListener("disconnect", this._handleDisconnect);
    } catch (r) {
      this._info = void 0, r instanceof ta ? (this._state = "ERROR", this._error = "Serial port is not ready. Close any other application using it and try again.") : (this._client = null, this.logger.error("Improv initialization failed.", r));
    }
  }
  _startInstall(t) {
    this._state = "INSTALL", this._installErase = t, this._installConfirmed = !1;
  }
  async _confirmInstall() {
    this._installConfirmed = !0, this._installState = void 0, this._client && await this._closeClientWithoutEvents(this._client), this._client = void 0, await this.port.close(), gd((t) => {
      this._installState = t, t.state === "finished" ? Ve(100).then(() => this.port.open({ baudRate: 115200, bufferSize: 8192 })).then(() => this._initialize(!0)).then(() => this.requestUpdate()) : t.state === "error" && Ve(100).then(() => this.port.open({ baudRate: 115200, bufferSize: 8192 }));
    }, this.port, this.manifestPath, this._manifest, this._installErase);
  }
  async _doProvision() {
    var t;
    this._busy = !0, this._wasProvisioned = this._client.state === Ee.PROVISIONED;
    const e = this._selectedSsid === null ? this.shadowRoot.querySelector("ew-filled-text-field[name=ssid]").value : this._selectedSsid, r = ((t = this.shadowRoot.querySelector("ew-filled-text-field[name=password]")) === null || t === void 0 ? void 0 : t.value) || "";
    try {
      await this._client.provision(e, r, 3e4);
    } catch {
      return;
    } finally {
      this._busy = !1, this._provisionForce = !1;
    }
  }
  _closeDialog() {
    this.shadowRoot.querySelector("ew-dialog").close();
  }
  async _handleClose() {
    this._client && await this._closeClientWithoutEvents(this._client), yd(this, "closed"), document.body.style.overflow = this._bodyOverflow, this.parentNode.removeChild(this);
  }
  /**
   * Return if the device runs same firmware as manifest.
   */
  get _isSameFirmware() {
    var t;
    return this._info ? !((t = this.overrides) === null || t === void 0) && t.checkSameFirmware ? this.overrides.checkSameFirmware(this._manifest, this._info) : this._info.firmware === this._manifest.name : !1;
  }
  /**
   * Return if the device runs same firmware and version as manifest.
   */
  get _isSameVersion() {
    return this._isSameFirmware && this._info.version === this._manifest.version;
  }
  async _closeClientWithoutEvents(t) {
    t.removeEventListener("disconnect", this._handleDisconnect), await t.close();
  }
  _preventDefault(t) {
    t.preventDefault();
  }
}
ae.styles = [
  la,
  N`
      :host {
        --mdc-dialog-max-width: 390px;
      }
      div[slot="headline"] {
        padding-right: 48px;
      }
      ew-icon-button[slot="headline"] {
        position: absolute;
        right: 4px;
        top: 8px;
      }
      ew-icon-button[slot="headline"] svg {
        padding: 8px;
        color: var(--text-color);
      }
      .dialog-nav svg {
        color: var(--text-color);
      }
      .table-row {
        display: flex;
      }
      .table-row.last {
        margin-bottom: 16px;
      }
      .table-row svg {
        width: 20px;
        margin-right: 8px;
      }
      ew-filled-text-field,
      ew-filled-select {
        display: block;
        margin-top: 16px;
      }
      label.formfield {
        display: inline-flex;
        align-items: center;
        padding-right: 8px;
      }
      ew-list {
        margin: 0 -24px;
        padding: 0;
      }
      ew-list-item svg {
        height: 24px;
      }
      ewt-page-message + ew-list {
        padding-top: 16px;
      }
      .fake-icon {
        width: 24px;
      }
      .error {
        color: var(--danger-color);
      }
      .danger {
        --mdc-theme-primary: var(--danger-color);
        --mdc-theme-secondary: var(--danger-color);
        --md-sys-color-primary: var(--danger-color);
        --md-sys-color-on-surface: var(--danger-color);
      }
      button.link {
        background: none;
        color: inherit;
        border: none;
        padding: 0;
        font: inherit;
        text-align: left;
        text-decoration: underline;
        cursor: pointer;
      }
      :host([state="LOGS"]) ew-dialog {
        max-width: 90vw;
        max-height: 90vh;
      }
      ewt-console {
        width: calc(80vw - 48px);
        height: calc(90vh - 168px);
      }
    `
];
h([
  P()
], ae.prototype, "_client", void 0);
h([
  P()
], ae.prototype, "_state", void 0);
h([
  P()
], ae.prototype, "_installErase", void 0);
h([
  P()
], ae.prototype, "_installConfirmed", void 0);
h([
  P()
], ae.prototype, "_installState", void 0);
h([
  P()
], ae.prototype, "_provisionForce", void 0);
h([
  P()
], ae.prototype, "_error", void 0);
h([
  P()
], ae.prototype, "_busy", void 0);
h([
  P()
], ae.prototype, "_ssids", void 0);
h([
  P()
], ae.prototype, "_selectedSsid", void 0);
customElements.define("ewt-install-dialog", ae);
export {
  ae as EwtInstallDialog
};
