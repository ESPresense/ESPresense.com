import { html, css, LitElement } from 'lit';
import "esp-web-tools"

export class EspresenseReleases extends LitElement {
  response: Map<string, any>;
  href: string;
  version: string;
  flavor: string;

  static get properties() {
    return {
      href: { type: String },
      manifest: { type: String },
      response: { type: Map<string, any> },
      version: { type: String },
      flavor: { type: String }
    };
  }

  get manifest() {
    const params = new URLSearchParams({
      flavor: this.flavor,
    });
    return this.href + this.version + ".json?" + params.toString();
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

    @media (prefers-color-scheme: dark) {
      :host {
        background-color: rgb(30, 30, 35);
        box-shadow: 0 0 0 1pt rgb(60, 60, 65);
        color: rgb(220, 220, 220);
      }

      :host select {
        background-color: rgb(45, 45, 50);
        color: rgb(220, 220, 220);
        border: 1px solid rgb(80, 80, 85);
      }

      :host label {
        color: rgb(200, 200, 200);
      }

      :host a {
        color: rgb(100, 160, 255);
      }
    }
  `;

  constructor() {
    super();
    this.response = new Map();
    this.href = "";
    this.version = "";
    this.flavor = "";
  }

  firstUpdated() {
    fetch("https://api.github.com/repos/ESPresense/ESPresense/releases", { credentials: "same-origin" })
      .then((r) => r.json())
      .then((r) => {
        this.response = r.filter((item) => item.assets.length > 5).reduce((p, c) => (p[c.prerelease ? "Beta" : "Release"] ? p[c.prerelease ? "Beta" : "Release"].push(c) : p[c.prerelease ? "Beta" : "Release"] = [c], p), new Map());
        console.log(this.response);
        this.version = this.response["Release"][0].tag_name;
      });
  }

  flavorChanged(e) {
    this.flavor = e.target.value;
    console.log(this.flavor);
  }

  versionChanged(e) {
    this.version = e.target.value;
    console.log(this.version);
  }

  render() {
    const { response } = this;
    return html`
      <div><label for="flavor">Flavor:</label><select id="flavor" @change=${this.flavorChanged}><option value="">Standard</option><option value="cdc">Cdc</option><option value="verbose">Verbose</option><option value="m5atom">M5Atom</option><option value="m5stickc">M5StickC</option><option value="m5stickc-plus">M5StickC-plus</option><option value="macchina-a0">Macchina A0</option></select></div>
      <div><label for="version">Version:</label><select id="version" @change=${this.versionChanged}>>${Object.keys(response).reverse().map((key) => html` <optgroup label="${key}">${response[key].map((i) => html` <option value=${i.tag_name} ?selected=${i.tag_name == this.version}>${i.name}</option> `)}</optgroup>`)}</select></div>
      <div class="but"><esp-web-install-button manifest=${this.manifest}></esp-web-install-button></div>
      <div class="powered"><label>Powered by</label><a href="https://esphome.github.io/esp-web-tools/" target="_blank">ESP Web Tools</a></div>
    `;
  }
}
