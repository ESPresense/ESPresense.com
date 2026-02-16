import { html, css, LitElement } from 'lit';
import "esp-web-tools"

export class EspresenseArtifacts extends LitElement {
  response: Map<string, any>;
  href: string;
  flavor: string;
  run_id: number;
  loading: boolean;
  buildVersion: string;
  querySha: string;
  shaMatched: boolean;

  static get properties() {
    return {
      href: { type: String },
      manifest: { type: String },
      response: { type: Map<string, any> },
      run_id: { type: Number },
      flavor: { type: String },
      loading: { type: Boolean },
      buildVersion: { type: String, attribute: 'build-version' },
      querySha: { type: String },
      shaMatched: { type: Boolean }
    };
  }

  get manifest() {
    if (this.run_id < 0) return "";
    const params = new URLSearchParams({
      flavor: this.flavor,
    });
    return this.href + this.run_id + ".json?" + params.toString();
  }

  static styles = css`
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

  private _themeObserver: MutationObserver | null = null;

  constructor() {
    super();
    this.response = new Map();
    this.href = "";
    this.run_id = -1;
    this.flavor = "";
    this.loading = true;
    this.buildVersion = "";
    this.querySha = "";
    this.shaMatched = true;
  }

  connectedCallback() {
    super.connectedCallback();
    this._syncTheme();
    this._themeObserver = new MutationObserver(() => this._syncTheme());
    this._themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._themeObserver?.disconnect();
    this._themeObserver = null;
  }

  private _syncTheme() {
    const theme = document.documentElement.dataset.theme || 'light';
    this.setAttribute('theme', theme);
  }

  isSupportedRun(run) {
    return run.pull_requests.length > 0 || run.head_branch == "main" && run.head_repository.full_name == "ESPresense/ESPresense";
  }

  async firstUpdated() {
    try {
      const runsResponse = await fetch("https://api.github.com/repos/ESPresense/ESPresense/actions/workflows/build.yml/runs?status=success&per_page=100", { credentials: "same-origin" });
      const runsData = await runsResponse.json();
      this.querySha = new URLSearchParams(window.location.search).get("sha")?.trim().toLowerCase() || "";
      const wf = runsData.workflow_runs.filter(i => this.isSupportedRun(i));
      const matchedRun = this.querySha ? wf.find(i => i.head_sha?.toLowerCase().startsWith(this.querySha)) : null;
      this.shaMatched = !this.querySha || !!matchedRun;
      this.run_id = this.querySha ? (matchedRun?.id ?? -1) : (wf[0]?.id ?? -1);
      this.response = wf.reduce((p, c) => (p[c.head_branch] ? p[c.head_branch].push(c) : p[c.head_branch] = [c], p), new Map());
    } finally {
      this.loading = false;
    }
  }

  flavorChanged(e) {
    this.flavor = e.target.value;
    console.log(this.flavor);
  }

  versionChanged(e) {
    const selected = Number(e.target.value);
    this.run_id = Number.isFinite(selected) ? selected : -1;
    this.shaMatched = this.run_id > 0;
    console.log(this.run_id);
  }

  render() {
    const { response } = this;
    return html`
      <div><label for="flavor">Flavor:</label><select id="flavor" @change=${this.flavorChanged}><option value="">Standard</option><option value="cdc">Cdc</option><option value="verbose">Verbose</option><option value="m5atom">M5Atom</option><option value="m5stickc">M5StickC</option><option value="m5stickc-plus">M5StickC-plus</option><option value="macchina-a0">Macchina A0</option></select></div>
      ${this.loading
        ? html`<div><label for="version">Artifact:</label><span>Loading artifacts...</span></div>`
        : html`<div><label for="version">Artifact:</label><select id="version" .value=${this.shaMatched ? String(this.run_id) : ""} @change=${this.versionChanged}>${!this.shaMatched ? html`<option value="" selected disabled>No match for sha ${this.querySha}</option>` : null}${Object.keys(response).reverse().map((key) => html` <optgroup label="${key}">${response[key].map((i) => html` <option value=${i.id} ?selected=${Number(i.id) === this.run_id}>${i.head_sha.substring(0,7)}: ${i.head_commit.message.split("\n")[0]}</option> `)}</optgroup>`)}</select></div>`}
      ${this.loading ? html`<div class="but">Loading artifacts...</div>` : this.run_id < 0 ? html`<div class="but">Select an artifact to continue.</div>` : html`<div class="but"><esp-web-install-button manifest=${this.manifest}></esp-web-install-button></div>`}
      <div class="powered"><label>UI ${this.buildVersion || "dev"}</label><label>Powered by</label><a href="https://esphome.github.io/esp-web-tools/" target="_blank">ESP Web Tools</a></div>
    `;
  }
}
