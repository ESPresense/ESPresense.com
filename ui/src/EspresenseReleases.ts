import { html, css, LitElement } from 'lit';
import "esp-web-tools"

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 14) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

export class EspresenseReleases extends LitElement {
  response: Record<string, any[]>;
  href: string;
  version: string;
  flavor: string;

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

  static styles = css`
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

  private _themeObserver: MutationObserver | null = null;

  constructor() {
    super();
    this.response = {};
    this.href = "";
    this.version = "";
    this.flavor = "";
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

  async firstUpdated() {
    const response = await fetch("https://api.github.com/repos/ESPresense/ESPresense/releases", { credentials: "same-origin" });
    if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);
    const data = await response.json();
    this.response = data
      .filter((item: any) => item.assets.length > 5)
      .reduce((p: Record<string, any[]>, c: any) => {
        const key = c.prerelease ? "Beta" : "Release";
        (p[key] = p[key] || []).push(c);
        return p;
      }, {});
    this.version = this.response["Release"]?.[0]?.tag_name ?? "";
  }

  flavorChanged(e: Event) {
    this.flavor = (e.target as HTMLSelectElement).value;
  }

  versionChanged(e: Event) {
    this.version = (e.target as HTMLSelectElement).value;
  }

  render() {
    const { response } = this;
    return html`
      <div class="body">
        <div class="field-row">
          <label for="version">Version:</label>
          <select id="version" @change=${this.versionChanged}>
            ${Object.keys(response).reverse().map((key) => html`
              <optgroup label="${key}">
                ${response[key].map((i) => html`
                  <option value=${i.tag_name} ?selected=${i.tag_name === this.version}>
                    ${i.name} — ${timeAgo(i.created_at)}
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
              <option value="cdc">Cdc</option>
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
}
