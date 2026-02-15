import { f as ot, u as st, a as g, i as x, E as at, b, A as h } from "./index-DVkTBVLT.js";
function a(i, t, e, r) {
  var o = arguments.length, s = o < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, e) : r, n;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") s = Reflect.decorate(i, t, e, r);
  else for (var l = i.length - 1; l >= 0; l--) (n = i[l]) && (s = (o < 3 ? n(s) : o > 3 ? n(t, e, s) : n(t, e)) || s);
  return o > 3 && s && Object.defineProperty(t, e, s), s;
}
const $ = (i) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(i, t);
  }) : customElements.define(i, t);
};
const nt = { attribute: !0, type: String, converter: st, reflect: !1, hasChanged: ot }, lt = (i = nt, t, e) => {
  const { kind: r, metadata: o } = e;
  let s = globalThis.litPropertyMetadata.get(o);
  if (s === void 0 && globalThis.litPropertyMetadata.set(o, s = /* @__PURE__ */ new Map()), r === "setter" && ((i = Object.create(i)).wrapped = !0), s.set(e.name, i), r === "accessor") {
    const { name: n } = e;
    return { set(l) {
      const f = t.get.call(this);
      t.set.call(this, l), this.requestUpdate(n, f, i, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(n, void 0, i, l), l;
    } };
  }
  if (r === "setter") {
    const { name: n } = e;
    return function(l) {
      const f = this[n];
      t.call(this, l), this.requestUpdate(n, f, i, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + r);
};
function d(i) {
  return (t, e) => typeof e == "object" ? lt(i, t, e) : ((r, o, s) => {
    const n = o.hasOwnProperty(s);
    return o.constructor.createProperty(s, r), n ? Object.getOwnPropertyDescriptor(o, s) : void 0;
  })(i, t, e);
}
function v(i) {
  return d({ ...i, state: !0, attribute: !1 });
}
const U = (i, t, e) => (e.configurable = !0, e.enumerable = !0, Reflect.decorate && typeof t != "object" && Object.defineProperty(i, t, e), e);
function m(i, t) {
  return (e, r, o) => {
    const s = (n) => n.renderRoot?.querySelector(i) ?? null;
    return U(e, r, { get() {
      return s(this);
    } });
  };
}
function ct(i) {
  return (t, e) => {
    const { slot: r, selector: o } = i ?? {}, s = "slot" + (r ? `[name=${r}]` : ":not([name])");
    return U(t, e, { get() {
      const n = this.renderRoot?.querySelector(s), l = n?.assignedElements(i) ?? [];
      return o === void 0 ? l : l.filter((f) => f.matches(o));
    } });
  };
}
const dt = g`:host{border-start-start-radius:var(--_container-shape-start-start);border-start-end-radius:var(--_container-shape-start-end);border-end-start-radius:var(--_container-shape-end-start);border-end-end-radius:var(--_container-shape-end-end);box-sizing:border-box;cursor:pointer;display:inline-flex;gap:8px;min-height:var(--_container-height);outline:none;padding-block:calc((var(--_container-height) - max(var(--_label-text-line-height),var(--_icon-size)))/2);padding-inline-start:var(--_leading-space);padding-inline-end:var(--_trailing-space);place-content:center;place-items:center;position:relative;font-family:var(--_label-text-font);font-size:var(--_label-text-size);line-height:var(--_label-text-line-height);font-weight:var(--_label-text-weight);text-overflow:ellipsis;text-wrap:nowrap;user-select:none;-webkit-tap-highlight-color:rgba(0,0,0,0);vertical-align:top;--md-ripple-hover-color: var(--_hover-state-layer-color);--md-ripple-pressed-color: var(--_pressed-state-layer-color);--md-ripple-hover-opacity: var(--_hover-state-layer-opacity);--md-ripple-pressed-opacity: var(--_pressed-state-layer-opacity)}md-focus-ring{--md-focus-ring-shape-start-start: var(--_container-shape-start-start);--md-focus-ring-shape-start-end: var(--_container-shape-start-end);--md-focus-ring-shape-end-end: var(--_container-shape-end-end);--md-focus-ring-shape-end-start: var(--_container-shape-end-start)}:host(:is([disabled],[soft-disabled])){cursor:default;pointer-events:none}.button{border-radius:inherit;cursor:inherit;display:inline-flex;align-items:center;justify-content:center;border:none;outline:none;-webkit-appearance:none;vertical-align:middle;background:rgba(0,0,0,0);text-decoration:none;min-width:calc(64px - var(--_leading-space) - var(--_trailing-space));width:100%;z-index:0;height:100%;font:inherit;color:var(--_label-text-color);padding:0;gap:inherit;text-transform:inherit}.button::-moz-focus-inner{padding:0;border:0}:host(:hover) .button{color:var(--_hover-label-text-color)}:host(:focus-within) .button{color:var(--_focus-label-text-color)}:host(:active) .button{color:var(--_pressed-label-text-color)}.background{background-color:var(--_container-color);border-radius:inherit;inset:0;position:absolute}.label{overflow:hidden}:is(.button,.label,.label slot),.label ::slotted(*){text-overflow:inherit}:host(:is([disabled],[soft-disabled])) .label{color:var(--_disabled-label-text-color);opacity:var(--_disabled-label-text-opacity)}:host(:is([disabled],[soft-disabled])) .background{background-color:var(--_disabled-container-color);opacity:var(--_disabled-container-opacity)}@media(forced-colors: active){.background{border:1px solid CanvasText}:host(:is([disabled],[soft-disabled])){--_disabled-icon-color: GrayText;--_disabled-icon-opacity: 1;--_disabled-container-opacity: 1;--_disabled-label-text-color: GrayText;--_disabled-label-text-opacity: 1}}:host([has-icon]:not([trailing-icon])){padding-inline-start:var(--_with-leading-icon-leading-space);padding-inline-end:var(--_with-leading-icon-trailing-space)}:host([has-icon][trailing-icon]){padding-inline-start:var(--_with-trailing-icon-leading-space);padding-inline-end:var(--_with-trailing-icon-trailing-space)}::slotted([slot=icon]){display:inline-flex;position:relative;writing-mode:horizontal-tb;fill:currentColor;flex-shrink:0;color:var(--_icon-color);font-size:var(--_icon-size);inline-size:var(--_icon-size);block-size:var(--_icon-size)}:host(:hover) ::slotted([slot=icon]){color:var(--_hover-icon-color)}:host(:focus-within) ::slotted([slot=icon]){color:var(--_focus-icon-color)}:host(:active) ::slotted([slot=icon]){color:var(--_pressed-icon-color)}:host(:is([disabled],[soft-disabled])) ::slotted([slot=icon]){color:var(--_disabled-icon-color);opacity:var(--_disabled-icon-opacity)}.touch{position:absolute;top:50%;height:48px;left:0;right:0;transform:translateY(-50%)}:host([touch-target=wrapper]){margin:max(0px,(48px - var(--_container-height))/2) 0}:host([touch-target=none]) .touch{display:none}
`;
const G = /* @__PURE__ */ Symbol("attachableController");
let V;
V = new MutationObserver((i) => {
  for (const t of i)
    t.target[G]?.hostConnected();
});
class q {
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
    this.host = t, this.onControlChange = e, this.currentControl = null, t.addController(this), t[G] = this, V?.observe(t, { attributeFilter: ["for"] });
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
const ht = ["focusin", "focusout", "pointerdown"];
class D extends x {
  constructor() {
    super(...arguments), this.visible = !1, this.inward = !1, this.attachableController = new q(this, this.onControlChange.bind(this));
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
    if (!t[B]) {
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
      t[B] = !0;
    }
  }
  onControlChange(t, e) {
    for (const r of ht)
      t?.removeEventListener(r, this), e?.addEventListener(r, this);
  }
  update(t) {
    t.has("visible") && this.dispatchEvent(new Event("visibility-changed")), super.update(t);
  }
}
a([
  d({ type: Boolean, reflect: !0 })
], D.prototype, "visible", void 0);
a([
  d({ type: Boolean, reflect: !0 })
], D.prototype, "inward", void 0);
const B = /* @__PURE__ */ Symbol("handledByFocusRing");
const ut = g`:host{animation-delay:0s,calc(var(--md-focus-ring-duration, 600ms)*.25);animation-duration:calc(var(--md-focus-ring-duration, 600ms)*.25),calc(var(--md-focus-ring-duration, 600ms)*.75);animation-timing-function:cubic-bezier(0.2, 0, 0, 1);box-sizing:border-box;color:var(--md-focus-ring-color, var(--md-sys-color-secondary, #625b71));display:none;pointer-events:none;position:absolute}:host([visible]){display:flex}:host(:not([inward])){animation-name:outward-grow,outward-shrink;border-end-end-radius:calc(var(--md-focus-ring-shape-end-end, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) + var(--md-focus-ring-outward-offset, 2px));border-end-start-radius:calc(var(--md-focus-ring-shape-end-start, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) + var(--md-focus-ring-outward-offset, 2px));border-start-end-radius:calc(var(--md-focus-ring-shape-start-end, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) + var(--md-focus-ring-outward-offset, 2px));border-start-start-radius:calc(var(--md-focus-ring-shape-start-start, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) + var(--md-focus-ring-outward-offset, 2px));inset:calc(-1*var(--md-focus-ring-outward-offset, 2px));outline:var(--md-focus-ring-width, 3px) solid currentColor}:host([inward]){animation-name:inward-grow,inward-shrink;border-end-end-radius:calc(var(--md-focus-ring-shape-end-end, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) - var(--md-focus-ring-inward-offset, 0px));border-end-start-radius:calc(var(--md-focus-ring-shape-end-start, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) - var(--md-focus-ring-inward-offset, 0px));border-start-end-radius:calc(var(--md-focus-ring-shape-start-end, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) - var(--md-focus-ring-inward-offset, 0px));border-start-start-radius:calc(var(--md-focus-ring-shape-start-start, var(--md-focus-ring-shape, var(--md-sys-shape-corner-full, 9999px))) - var(--md-focus-ring-inward-offset, 0px));border:var(--md-focus-ring-width, 3px) solid currentColor;inset:var(--md-focus-ring-inward-offset, 0px)}@keyframes outward-grow{from{outline-width:0}to{outline-width:var(--md-focus-ring-active-width, 8px)}}@keyframes outward-shrink{from{outline-width:var(--md-focus-ring-active-width, 8px)}}@keyframes inward-grow{from{border-width:0}to{border-width:var(--md-focus-ring-active-width, 8px)}}@keyframes inward-shrink{from{border-width:var(--md-focus-ring-active-width, 8px)}}@media(prefers-reduced-motion){:host{animation:none}}
`;
let S = class extends D {
};
S.styles = [ut];
S = a([
  $("md-focus-ring")
], S);
const pt = { ATTRIBUTE: 1, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4 }, ft = (i) => (...t) => ({ _$litDirective$: i, values: t });
class mt {
  constructor(t) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t, e, r) {
    this._$Ct = t, this._$AM = e, this._$Ci = r;
  }
  _$AS(t, e) {
    return this.update(t, e);
  }
  update(t, e) {
    return this.render(...e);
  }
}
const j = ft(class extends mt {
  constructor(i) {
    if (super(i), i.type !== pt.ATTRIBUTE || i.name !== "class" || i.strings?.length > 2) throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
  }
  render(i) {
    return " " + Object.keys(i).filter((t) => i[t]).join(" ") + " ";
  }
  update(i, [t]) {
    if (this.st === void 0) {
      this.st = /* @__PURE__ */ new Set(), i.strings !== void 0 && (this.nt = new Set(i.strings.join(" ").split(/\s/).filter((r) => r !== "")));
      for (const r in t) t[r] && !this.nt?.has(r) && this.st.add(r);
      return this.render(t);
    }
    const e = i.element.classList;
    for (const r of this.st) r in t || (e.remove(r), this.st.delete(r));
    for (const r in t) {
      const o = !!t[r];
      o === this.st.has(r) || this.nt?.has(r) || (o ? (e.add(r), this.st.add(r)) : (e.remove(r), this.st.delete(r)));
    }
    return at;
  }
});
const y = {
  STANDARD: "cubic-bezier(0.2, 0, 0, 1)",
  EMPHASIZED: "cubic-bezier(.3,0,0,1)",
  EMPHASIZED_ACCELERATE: "cubic-bezier(.3,0,.8,.15)"
};
function Wt() {
  let i = null;
  return {
    start() {
      return i?.abort(), i = new AbortController(), i.signal;
    },
    finish() {
      i = null;
    }
  };
}
const bt = 450, H = 225, gt = 0.2, vt = 10, yt = 75, xt = 0.35, Ct = "::after", wt = "forwards";
var u;
(function(i) {
  i[i.INACTIVE = 0] = "INACTIVE", i[i.TOUCH_DELAY = 1] = "TOUCH_DELAY", i[i.HOLDING = 2] = "HOLDING", i[i.WAITING_FOR_CLICK = 3] = "WAITING_FOR_CLICK";
})(u || (u = {}));
const At = [
  "click",
  "contextmenu",
  "pointercancel",
  "pointerdown",
  "pointerenter",
  "pointerleave",
  "pointerup"
], Et = 150, _t = window.matchMedia("(forced-colors: active)");
class C extends x {
  constructor() {
    super(...arguments), this.disabled = !1, this.hovered = !1, this.pressed = !1, this.rippleSize = "", this.rippleScale = "", this.initialSize = 0, this.state = u.INACTIVE, this.checkBoundsAfterContextMenu = !1, this.attachableController = new q(this, this.onControlChange.bind(this));
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
    return b`<div class="surface ${j(t)}"></div>`;
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
    this.shouldReactToEvent(t) && (this.hovered = !1, this.state !== u.INACTIVE && this.endPressAnimation());
  }
  handlePointerup(t) {
    if (this.shouldReactToEvent(t)) {
      if (this.state === u.HOLDING) {
        this.state = u.WAITING_FOR_CLICK;
        return;
      }
      if (this.state === u.TOUCH_DELAY) {
        this.state = u.WAITING_FOR_CLICK, this.startPressAnimation(this.rippleStartEvent);
        return;
      }
    }
  }
  async handlePointerdown(t) {
    if (this.shouldReactToEvent(t)) {
      if (this.rippleStartEvent = t, !this.isTouch(t)) {
        this.state = u.WAITING_FOR_CLICK, this.startPressAnimation(t);
        return;
      }
      this.checkBoundsAfterContextMenu && !this.inBounds(t) || (this.checkBoundsAfterContextMenu = !1, this.state = u.TOUCH_DELAY, await new Promise((e) => {
        setTimeout(e, Et);
      }), this.state === u.TOUCH_DELAY && (this.state = u.HOLDING, this.startPressAnimation(t)));
    }
  }
  handleClick() {
    if (!this.disabled) {
      if (this.state === u.WAITING_FOR_CLICK) {
        this.endPressAnimation();
        return;
      }
      this.state === u.INACTIVE && (this.startPressAnimation(), this.endPressAnimation());
    }
  }
  handlePointercancel(t) {
    this.shouldReactToEvent(t) && this.endPressAnimation();
  }
  handleContextmenu() {
    this.disabled || (this.checkBoundsAfterContextMenu = !0, this.endPressAnimation());
  }
  determineRippleSize() {
    const { height: t, width: e } = this.getBoundingClientRect(), r = Math.max(t, e), o = Math.max(xt * r, yt), s = Math.floor(r * gt), l = Math.sqrt(e ** 2 + t ** 2) + vt;
    this.initialSize = s, this.rippleScale = `${(l + o) / s}`, this.rippleSize = `${s}px`;
  }
  getNormalizedPointerEventCoords(t) {
    const { scrollX: e, scrollY: r } = window, { left: o, top: s } = this.getBoundingClientRect(), n = e + o, l = r + s, { pageX: f, pageY: w } = t;
    return { x: f - n, y: w - l };
  }
  getTranslationCoordinates(t) {
    const { height: e, width: r } = this.getBoundingClientRect(), o = {
      x: (r - this.initialSize) / 2,
      y: (e - this.initialSize) / 2
    };
    let s;
    return t instanceof PointerEvent ? s = this.getNormalizedPointerEventCoords(t) : s = {
      x: r / 2,
      y: e / 2
    }, s = {
      x: s.x - this.initialSize / 2,
      y: s.y - this.initialSize / 2
    }, { startPoint: s, endPoint: o };
  }
  startPressAnimation(t) {
    if (!this.mdRoot)
      return;
    this.pressed = !0, this.growAnimation?.cancel(), this.determineRippleSize();
    const { startPoint: e, endPoint: r } = this.getTranslationCoordinates(t), o = `${e.x}px, ${e.y}px`, s = `${r.x}px, ${r.y}px`;
    this.growAnimation = this.mdRoot.animate({
      top: [0, 0],
      left: [0, 0],
      height: [this.rippleSize, this.rippleSize],
      width: [this.rippleSize, this.rippleSize],
      transform: [
        `translate(${o}) scale(1)`,
        `translate(${s}) scale(${this.rippleScale})`
      ]
    }, {
      pseudoElement: Ct,
      duration: bt,
      easing: y.STANDARD,
      fill: wt
    });
  }
  async endPressAnimation() {
    this.rippleStartEvent = void 0, this.state = u.INACTIVE;
    const t = this.growAnimation;
    let e = 1 / 0;
    if (typeof t?.currentTime == "number" ? e = t.currentTime : t?.currentTime && (e = t.currentTime.to("ms").value), e >= H) {
      this.pressed = !1;
      return;
    }
    await new Promise((r) => {
      setTimeout(r, H - e);
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
  /**
   * Check if the event is within the bounds of the element.
   *
   * This is only needed for the "stuck" contextmenu longpress on Chrome.
   */
  inBounds({ x: t, y: e }) {
    const { top: r, left: o, bottom: s, right: n } = this.getBoundingClientRect();
    return t >= o && t <= n && e >= r && e <= s;
  }
  isTouch({ pointerType: t }) {
    return t === "touch";
  }
  /** @private */
  async handleEvent(t) {
    if (!_t?.matches)
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
    for (const r of At)
      t?.removeEventListener(r, this), e?.addEventListener(r, this);
  }
}
a([
  d({ type: Boolean, reflect: !0 })
], C.prototype, "disabled", void 0);
a([
  v()
], C.prototype, "hovered", void 0);
a([
  v()
], C.prototype, "pressed", void 0);
a([
  m(".surface")
], C.prototype, "mdRoot", void 0);
const It = g`:host{display:flex;margin:auto;pointer-events:none}:host([disabled]){display:none}@media(forced-colors: active){:host{display:none}}:host,.surface{border-radius:inherit;position:absolute;inset:0;overflow:hidden}.surface{-webkit-tap-highlight-color:rgba(0,0,0,0)}.surface::before,.surface::after{content:"";opacity:0;position:absolute}.surface::before{background-color:var(--md-ripple-hover-color, var(--md-sys-color-on-surface, #1d1b20));inset:0;transition:opacity 15ms linear,background-color 15ms linear}.surface::after{background:radial-gradient(closest-side, var(--md-ripple-pressed-color, var(--md-sys-color-on-surface, #1d1b20)) max(100% - 70px, 65%), transparent 100%);transform-origin:center center;transition:opacity 375ms linear}.hovered::before{background-color:var(--md-ripple-hover-color, var(--md-sys-color-on-surface, #1d1b20));opacity:var(--md-ripple-hover-opacity, 0.08)}.pressed::after{opacity:var(--md-ripple-pressed-opacity, 0.12);transition-duration:105ms}
`;
let k = class extends C {
};
k.styles = [It];
k = a([
  $("md-ripple")
], k);
const W = [
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
], Tt = W.map(Y);
function I(i) {
  return Tt.includes(i);
}
function Y(i) {
  return i.replace("aria", "aria-").replace(/Elements?/g, "").toLowerCase();
}
const A = /* @__PURE__ */ Symbol("privateIgnoreAttributeChangesFor");
function K(i) {
  var t;
  class e extends i {
    constructor() {
      super(...arguments), this[t] = /* @__PURE__ */ new Set();
    }
    attributeChangedCallback(o, s, n) {
      if (!I(o)) {
        super.attributeChangedCallback(o, s, n);
        return;
      }
      if (this[A].has(o))
        return;
      this[A].add(o), this.removeAttribute(o), this[A].delete(o);
      const l = R(o);
      n === null ? delete this.dataset[l] : this.dataset[l] = n, this.requestUpdate(R(o), s);
    }
    getAttribute(o) {
      return I(o) ? super.getAttribute(P(o)) : super.getAttribute(o);
    }
    removeAttribute(o) {
      super.removeAttribute(o), I(o) && (super.removeAttribute(P(o)), this.requestUpdate());
    }
  }
  return t = A, St(e), e;
}
function St(i) {
  for (const t of W) {
    const e = Y(t), r = P(e), o = R(e);
    i.createProperty(t, {
      attribute: e,
      noAccessor: !0
    }), i.createProperty(Symbol(r), {
      attribute: r,
      noAccessor: !0
    }), Object.defineProperty(i.prototype, t, {
      configurable: !0,
      enumerable: !0,
      get() {
        return this.dataset[o] ?? null;
      },
      set(s) {
        const n = this.dataset[o] ?? null;
        s !== n && (s === null ? delete this.dataset[o] : this.dataset[o] = s, this.requestUpdate(t, n));
      }
    });
  }
}
function P(i) {
  return `data-${i}`;
}
function R(i) {
  return i.replace(/-\w/, (t) => t[1].toUpperCase());
}
const L = /* @__PURE__ */ Symbol("internals"), T = /* @__PURE__ */ Symbol("privateInternals");
function kt(i) {
  class t extends i {
    get [L]() {
      return this[T] || (this[T] = this.attachInternals()), this[T];
    }
  }
  return t;
}
function Pt(i) {
  i.addInitializer((t) => {
    const e = t;
    e.addEventListener("click", async (r) => {
      const { type: o, [L]: s } = e, { form: n } = s;
      if (!(!n || o === "button") && (await new Promise((l) => {
        setTimeout(l);
      }), !r.defaultPrevented)) {
        if (o === "reset") {
          n.reset();
          return;
        }
        n.addEventListener("submit", (l) => {
          Object.defineProperty(l, "submitter", {
            configurable: !0,
            enumerable: !0,
            get: () => e
          });
        }, { capture: !0, once: !0 }), s.setFormValue(e.value), n.requestSubmit();
      }
    });
  });
}
function Rt(i) {
  const t = new MouseEvent("click", { bubbles: !0 });
  return i.dispatchEvent(t), t;
}
function Ot(i) {
  return i.currentTarget !== i.target || i.composedPath()[0] !== i.target || i.target.disabled ? !1 : !Ft(i);
}
function Ft(i) {
  const t = O;
  return t && (i.preventDefault(), i.stopImmediatePropagation()), $t(), t;
}
let O = !1;
async function $t() {
  O = !0, await null, O = !1;
}
const Dt = K(kt(x));
class p extends Dt {
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
    return this[L].form;
  }
  constructor() {
    super(), this.disabled = !1, this.softDisabled = !1, this.href = "", this.target = "", this.trailingIcon = !1, this.hasIcon = !1, this.type = "submit", this.value = "", this.addEventListener("click", this.handleClick.bind(this));
  }
  focus() {
    this.buttonElement?.focus();
  }
  blur() {
    this.buttonElement?.blur();
  }
  render() {
    const t = !this.href && (this.disabled || this.softDisabled), e = this.href ? this.renderLink() : this.renderButton(), r = this.href ? "link" : "button";
    return b`
      ${this.renderElevationOrOutline?.()}
      <div class="background"></div>
      <md-focus-ring part="focus-ring" for=${r}></md-focus-ring>
      <md-ripple
        part="ripple"
        for=${r}
        ?disabled="${t}"></md-ripple>
      ${e}
    `;
  }
  renderButton() {
    const { ariaLabel: t, ariaHasPopup: e, ariaExpanded: r } = this;
    return b`<button
      id="button"
      class="button"
      ?disabled=${this.disabled}
      aria-disabled=${this.softDisabled || h}
      aria-label="${t || h}"
      aria-haspopup="${e || h}"
      aria-expanded="${r || h}">
      ${this.renderContent()}
    </button>`;
  }
  renderLink() {
    const { ariaLabel: t, ariaHasPopup: e, ariaExpanded: r } = this;
    return b`<a
      id="link"
      class="button"
      aria-label="${t || h}"
      aria-haspopup="${e || h}"
      aria-expanded="${r || h}"
      href=${this.href}
      target=${this.target || h}
      >${this.renderContent()}
    </a>`;
  }
  renderContent() {
    const t = b`<slot
      name="icon"
      @slotchange="${this.handleSlotChange}"></slot>`;
    return b`
      <span class="touch"></span>
      ${this.trailingIcon ? h : t}
      <span class="label"><slot></slot></span>
      ${this.trailingIcon ? t : h}
    `;
  }
  handleClick(t) {
    if (!this.href && this.softDisabled) {
      t.stopImmediatePropagation(), t.preventDefault();
      return;
    }
    !Ot(t) || !this.buttonElement || (this.focus(), Rt(this.buttonElement));
  }
  handleSlotChange() {
    this.hasIcon = this.assignedIcons.length > 0;
  }
}
Pt(p);
p.formAssociated = !0;
p.shadowRootOptions = {
  mode: "open",
  delegatesFocus: !0
};
a([
  d({ type: Boolean, reflect: !0 })
], p.prototype, "disabled", void 0);
a([
  d({ type: Boolean, attribute: "soft-disabled", reflect: !0 })
], p.prototype, "softDisabled", void 0);
a([
  d()
], p.prototype, "href", void 0);
a([
  d()
], p.prototype, "target", void 0);
a([
  d({ type: Boolean, attribute: "trailing-icon", reflect: !0 })
], p.prototype, "trailingIcon", void 0);
a([
  d({ type: Boolean, attribute: "has-icon", reflect: !0 })
], p.prototype, "hasIcon", void 0);
a([
  d()
], p.prototype, "type", void 0);
a([
  d({ reflect: !0 })
], p.prototype, "value", void 0);
a([
  m(".button")
], p.prototype, "buttonElement", void 0);
a([
  ct({ slot: "icon", flatten: !0 })
], p.prototype, "assignedIcons", void 0);
class Lt extends p {
}
const zt = g`:host{--_container-height: var(--md-text-button-container-height, 40px);--_disabled-label-text-color: var(--md-text-button-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-label-text-opacity: var(--md-text-button-disabled-label-text-opacity, 0.38);--_focus-label-text-color: var(--md-text-button-focus-label-text-color, var(--md-sys-color-primary, #6750a4));--_hover-label-text-color: var(--md-text-button-hover-label-text-color, var(--md-sys-color-primary, #6750a4));--_hover-state-layer-color: var(--md-text-button-hover-state-layer-color, var(--md-sys-color-primary, #6750a4));--_hover-state-layer-opacity: var(--md-text-button-hover-state-layer-opacity, 0.08);--_label-text-color: var(--md-text-button-label-text-color, var(--md-sys-color-primary, #6750a4));--_label-text-font: var(--md-text-button-label-text-font, var(--md-sys-typescale-label-large-font, var(--md-ref-typeface-plain, Roboto)));--_label-text-line-height: var(--md-text-button-label-text-line-height, var(--md-sys-typescale-label-large-line-height, 1.25rem));--_label-text-size: var(--md-text-button-label-text-size, var(--md-sys-typescale-label-large-size, 0.875rem));--_label-text-weight: var(--md-text-button-label-text-weight, var(--md-sys-typescale-label-large-weight, var(--md-ref-typeface-weight-medium, 500)));--_pressed-label-text-color: var(--md-text-button-pressed-label-text-color, var(--md-sys-color-primary, #6750a4));--_pressed-state-layer-color: var(--md-text-button-pressed-state-layer-color, var(--md-sys-color-primary, #6750a4));--_pressed-state-layer-opacity: var(--md-text-button-pressed-state-layer-opacity, 0.12);--_disabled-icon-color: var(--md-text-button-disabled-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-icon-opacity: var(--md-text-button-disabled-icon-opacity, 0.38);--_focus-icon-color: var(--md-text-button-focus-icon-color, var(--md-sys-color-primary, #6750a4));--_hover-icon-color: var(--md-text-button-hover-icon-color, var(--md-sys-color-primary, #6750a4));--_icon-color: var(--md-text-button-icon-color, var(--md-sys-color-primary, #6750a4));--_icon-size: var(--md-text-button-icon-size, 18px);--_pressed-icon-color: var(--md-text-button-pressed-icon-color, var(--md-sys-color-primary, #6750a4));--_container-shape-start-start: var(--md-text-button-container-shape-start-start, var(--md-text-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-start-end: var(--md-text-button-container-shape-start-end, var(--md-text-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-end: var(--md-text-button-container-shape-end-end, var(--md-text-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_container-shape-end-start: var(--md-text-button-container-shape-end-start, var(--md-text-button-container-shape, var(--md-sys-shape-corner-full, 9999px)));--_leading-space: var(--md-text-button-leading-space, 12px);--_trailing-space: var(--md-text-button-trailing-space, 12px);--_with-leading-icon-leading-space: var(--md-text-button-with-leading-icon-leading-space, 12px);--_with-leading-icon-trailing-space: var(--md-text-button-with-leading-icon-trailing-space, 16px);--_with-trailing-icon-leading-space: var(--md-text-button-with-trailing-icon-leading-space, 16px);--_with-trailing-icon-trailing-space: var(--md-text-button-with-trailing-icon-trailing-space, 12px);--_container-color: none;--_disabled-container-color: none;--_disabled-container-opacity: 0}
`;
class Z extends Lt {
}
Z.styles = [dt, zt];
customElements.define("ew-text-button", Z);
class E extends x {
  constructor() {
    super(...arguments), this.inset = !1, this.insetStart = !1, this.insetEnd = !1;
  }
}
a([
  d({ type: Boolean, reflect: !0 })
], E.prototype, "inset", void 0);
a([
  d({ type: Boolean, reflect: !0, attribute: "inset-start" })
], E.prototype, "insetStart", void 0);
a([
  d({ type: Boolean, reflect: !0, attribute: "inset-end" })
], E.prototype, "insetEnd", void 0);
const Nt = g`:host{box-sizing:border-box;color:var(--md-divider-color, var(--md-sys-color-outline-variant, #cac4d0));display:flex;height:var(--md-divider-thickness, 1px);width:100%}:host([inset]),:host([inset-start]){padding-inline-start:16px}:host([inset]),:host([inset-end]){padding-inline-end:16px}:host::before{background:currentColor;content:"";height:100%;width:100%}@media(forced-colors: active){:host::before{background:CanvasText}}
`;
function Mt(i, t) {
  t.bubbles && (!i.shadowRoot || t.composed) && t.stopPropagation();
  const e = Reflect.construct(t.constructor, [t.type, t]), r = i.dispatchEvent(e);
  return r || t.preventDefault(), r;
}
let F = class extends E {
};
F.styles = [Nt];
F = a([
  $("md-divider")
], F);
const Bt = {
  dialog: [
    [
      // Dialog slide down
      [{ transform: "translateY(-50px)" }, { transform: "translateY(0)" }],
      { duration: 500, easing: y.EMPHASIZED }
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
      { duration: 500, easing: y.EMPHASIZED, pseudoElement: "::before" }
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
}, Ht = {
  dialog: [
    [
      // Dialog slide up
      [{ transform: "translateY(0)" }, { transform: "translateY(-50px)" }],
      { duration: 150, easing: y.EMPHASIZED_ACCELERATE }
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
        easing: y.EMPHASIZED_ACCELERATE,
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
const Ut = K(x);
class c extends Ut {
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
    super(), this.quick = !1, this.returnValue = "", this.noFocusTrap = !1, this.getOpenAnimation = () => Bt, this.getCloseAnimation = () => Ht, this.isOpen = !1, this.isOpening = !1, this.isConnectedPromise = this.getIsConnectedPromise(), this.isAtScrollTop = !1, this.isAtScrollBottom = !1, this.nextClickIsFromContent = !1, this.hasHeadline = !1, this.hasActions = !1, this.hasIcon = !1, this.escapePressedWithoutCancel = !1, this.treewalker = document.createTreeWalker(this, NodeFilter.SHOW_ELEMENT), this.addEventListener("submit", this.handleSubmit);
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
    const r = this.returnValue;
    if (this.returnValue = t, !this.dispatchEvent(new Event("close", { cancelable: !0 }))) {
      this.returnValue = r;
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
    }, r = this.open && !this.noFocusTrap, o = b`
      <div
        class="focus-trap"
        tabindex="0"
        aria-hidden="true"
        @focus=${this.handleFocusTrapFocus}></div>
    `, { ariaLabel: s } = this;
    return b`
      <div class="scrim"></div>
      <dialog
        class=${j(e)}
        aria-label=${s || h}
        aria-labelledby=${this.hasHeadline ? "headline" : h}
        role=${this.type === "alert" ? "alertdialog" : h}
        @cancel=${this.handleCancel}
        @click=${this.handleDialogClick}
        @close=${this.handleClose}
        @keydown=${this.handleKeydown}
        .returnValue=${this.returnValue || h}>
        ${r ? o : h}
        <div class="container" @click=${this.handleContentClick}>
          <div class="headline">
            <div class="icon" aria-hidden="true">
              <slot name="icon" @slotchange=${this.handleIconChange}></slot>
            </div>
            <h2 id="headline" aria-hidden=${!this.hasHeadline || h}>
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
        ${r ? o : h}
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
    const e = t.target, { submitter: r } = t;
    e.method !== "dialog" || !r || this.close(r.getAttribute("value") ?? this.returnValue);
  }
  handleCancel(t) {
    if (t.target !== this.dialog)
      return;
    this.escapePressedWithoutCancel = !1;
    const e = !Mt(this, t);
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
    const { dialog: e, scrim: r, container: o, headline: s, content: n, actions: l } = this;
    if (!e || !r || !o || !s || !n || !l)
      return;
    const { container: f, dialog: w, scrim: z, headline: J, content: Q, actions: tt } = t, et = [
      [e, w ?? []],
      [r, z ?? []],
      [o, f ?? []],
      [s, J ?? []],
      [n, Q ?? []],
      [l, tt ?? []]
    ], N = [];
    for (const [_, it] of et)
      for (const rt of it) {
        const M = _.animate(...rt);
        this.cancelAnimations.signal.addEventListener("abort", () => {
          M.cancel();
        }), N.push(M);
      }
    await Promise.all(N.map((_) => _.finished.catch(() => {
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
    const { target: e, isIntersecting: r } = t;
    e === this.topAnchor && (this.isAtScrollTop = r), e === this.bottomAnchor && (this.isAtScrollBottom = r);
  }
  getIsConnectedPromise() {
    return new Promise((t) => {
      this.isConnectedPromiseResolve = t;
    });
  }
  handleFocusTrapFocus(t) {
    const [e, r] = this.getFirstAndLastFocusableChildren();
    if (!e || !r) {
      this.dialog?.focus();
      return;
    }
    const o = t.target === this.firstFocusTrap, s = !o, n = t.relatedTarget === e, l = t.relatedTarget === r, f = !n && !l;
    if (s && l || o && f) {
      e.focus();
      return;
    }
    if (o && n || s && f) {
      r.focus();
      return;
    }
  }
  getFirstAndLastFocusableChildren() {
    if (!this.treewalker)
      return [null, null];
    let t = null, e = null;
    for (this.treewalker.currentNode = this.treewalker.root; this.treewalker.nextNode(); ) {
      const r = this.treewalker.currentNode;
      Gt(r) && (t || (t = r), e = r);
    }
    return [t, e];
  }
}
a([
  d({ type: Boolean })
], c.prototype, "open", null);
a([
  d({ type: Boolean })
], c.prototype, "quick", void 0);
a([
  d({ attribute: !1 })
], c.prototype, "returnValue", void 0);
a([
  d()
], c.prototype, "type", void 0);
a([
  d({ type: Boolean, attribute: "no-focus-trap" })
], c.prototype, "noFocusTrap", void 0);
a([
  m("dialog")
], c.prototype, "dialog", void 0);
a([
  m(".scrim")
], c.prototype, "scrim", void 0);
a([
  m(".container")
], c.prototype, "container", void 0);
a([
  m(".headline")
], c.prototype, "headline", void 0);
a([
  m(".content")
], c.prototype, "content", void 0);
a([
  m(".actions")
], c.prototype, "actions", void 0);
a([
  v()
], c.prototype, "isAtScrollTop", void 0);
a([
  v()
], c.prototype, "isAtScrollBottom", void 0);
a([
  m(".scroller")
], c.prototype, "scroller", void 0);
a([
  m(".top.anchor")
], c.prototype, "topAnchor", void 0);
a([
  m(".bottom.anchor")
], c.prototype, "bottomAnchor", void 0);
a([
  m(".focus-trap")
], c.prototype, "firstFocusTrap", void 0);
a([
  v()
], c.prototype, "hasHeadline", void 0);
a([
  v()
], c.prototype, "hasActions", void 0);
a([
  v()
], c.prototype, "hasIcon", void 0);
function Gt(i) {
  const t = ":is(button,input,select,textarea,object,:is(a,area)[href],[tabindex],[contenteditable=true])", e = ":not(:disabled,[disabled])";
  return i.matches(t + e + ':not([tabindex^="-"])') ? !0 : !i.localName.includes("-") || !i.matches(e) ? !1 : i.shadowRoot?.delegatesFocus ?? !1;
}
const Vt = g`:host{border-start-start-radius:var(--md-dialog-container-shape-start-start, var(--md-dialog-container-shape, var(--md-sys-shape-corner-extra-large, 28px)));border-start-end-radius:var(--md-dialog-container-shape-start-end, var(--md-dialog-container-shape, var(--md-sys-shape-corner-extra-large, 28px)));border-end-end-radius:var(--md-dialog-container-shape-end-end, var(--md-dialog-container-shape, var(--md-sys-shape-corner-extra-large, 28px)));border-end-start-radius:var(--md-dialog-container-shape-end-start, var(--md-dialog-container-shape, var(--md-sys-shape-corner-extra-large, 28px)));display:contents;margin:auto;max-height:min(560px,100% - 48px);max-width:min(560px,100% - 48px);min-height:140px;min-width:280px;position:fixed;height:fit-content;width:fit-content}dialog{background:rgba(0,0,0,0);border:none;border-radius:inherit;flex-direction:column;height:inherit;margin:inherit;max-height:inherit;max-width:inherit;min-height:inherit;min-width:inherit;outline:none;overflow:visible;padding:0;width:inherit}dialog[open]{display:flex}::backdrop{background:none}.scrim{background:var(--md-sys-color-scrim, #000);display:none;inset:0;opacity:32%;pointer-events:none;position:fixed;z-index:1}:host([open]) .scrim{display:flex}h2{all:unset;align-self:stretch}.headline{align-items:center;color:var(--md-dialog-headline-color, var(--md-sys-color-on-surface, #1d1b20));display:flex;flex-direction:column;font-family:var(--md-dialog-headline-font, var(--md-sys-typescale-headline-small-font, var(--md-ref-typeface-brand, Roboto)));font-size:var(--md-dialog-headline-size, var(--md-sys-typescale-headline-small-size, 1.5rem));line-height:var(--md-dialog-headline-line-height, var(--md-sys-typescale-headline-small-line-height, 2rem));font-weight:var(--md-dialog-headline-weight, var(--md-sys-typescale-headline-small-weight, var(--md-ref-typeface-weight-regular, 400)));position:relative}slot[name=headline]::slotted(*){align-items:center;align-self:stretch;box-sizing:border-box;display:flex;gap:8px;padding:24px 24px 0}.icon{display:flex}slot[name=icon]::slotted(*){color:var(--md-dialog-icon-color, var(--md-sys-color-secondary, #625b71));fill:currentColor;font-size:var(--md-dialog-icon-size, 24px);margin-top:24px;height:var(--md-dialog-icon-size, 24px);width:var(--md-dialog-icon-size, 24px)}.has-icon slot[name=headline]::slotted(*){justify-content:center;padding-top:16px}.scrollable slot[name=headline]::slotted(*){padding-bottom:16px}.scrollable.has-headline slot[name=content]::slotted(*){padding-top:8px}.container{border-radius:inherit;display:flex;flex-direction:column;flex-grow:1;overflow:hidden;position:relative;transform-origin:top}.container::before{background:var(--md-dialog-container-color, var(--md-sys-color-surface-container-high, #ece6f0));border-radius:inherit;content:"";inset:0;position:absolute}.scroller{display:flex;flex:1;flex-direction:column;overflow:hidden;z-index:1}.scrollable .scroller{overflow-y:scroll}.content{color:var(--md-dialog-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));font-family:var(--md-dialog-supporting-text-font, var(--md-sys-typescale-body-medium-font, var(--md-ref-typeface-plain, Roboto)));font-size:var(--md-dialog-supporting-text-size, var(--md-sys-typescale-body-medium-size, 0.875rem));line-height:var(--md-dialog-supporting-text-line-height, var(--md-sys-typescale-body-medium-line-height, 1.25rem));flex:1;font-weight:var(--md-dialog-supporting-text-weight, var(--md-sys-typescale-body-medium-weight, var(--md-ref-typeface-weight-regular, 400)));height:min-content;position:relative}slot[name=content]::slotted(*){box-sizing:border-box;padding:24px}.anchor{position:absolute}.top.anchor{top:0}.bottom.anchor{bottom:0}.actions{position:relative}slot[name=actions]::slotted(*){box-sizing:border-box;display:flex;gap:8px;justify-content:flex-end;padding:16px 24px 24px}.has-actions slot[name=content]::slotted(*){padding-bottom:8px}md-divider{display:none;position:absolute}.has-headline.show-top-divider .headline md-divider,.has-actions.show-bottom-divider .actions md-divider{display:flex}.headline md-divider{bottom:0}.actions md-divider{top:0}@media(forced-colors: active){dialog{outline:2px solid WindowText}}
`;
class X extends c {
}
X.styles = [Vt];
customElements.define("ew-dialog", X);
const Zt = g`
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
  E as D,
  y as E,
  a as _,
  m as a,
  j as b,
  kt as c,
  Ot as d,
  U as e,
  Rt as f,
  Mt as g,
  Pt as h,
  L as i,
  ft as j,
  mt as k,
  pt as l,
  K as m,
  d as n,
  ct as o,
  Wt as p,
  Zt as q,
  v as r,
  Nt as s,
  $ as t
};
