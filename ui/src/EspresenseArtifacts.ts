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

const POLL_INTERVAL_MS = 30_000;
// The listing can lag a finished build by up to ~10 minutes; allow some slack
const WAIT_LIMIT_MS = 15 * 60_000;

interface Build {
  id: number;
  age: string;
  sha: string;
  message: string;
  tag: string;
  subtitle: string;
  sourceKey: string; // "nightly" or "pr-1234"
}

interface Source {
  key: string;       // "nightly" or "pr-1234"
  label: string;     // "Nightly" or "PR #1234"
  title: string;     // "" or PR title
  count: number;
  latestAge: string;
}

export class EspresenseArtifacts extends LitElement {
  href: string;
  flavor: string;
  run_id: number;
  loading: boolean;
  buildVersion: string;
  querySha: string;
  queryPr: string;
  shaMatched: boolean;
  builds: Build[];
  sources: Source[];
  selectedKey: string;
  showInstall: boolean;
  selectedBuild: Build | null;
  waiting: "" | "polling" | "gave-up";
  lastChecked: number;
  private _allRuns: any[] = [];
  private _waitStarted = 0;
  private _pollTimer = 0;

  static get properties() {
    return {
      href: { type: String },
      manifest: { type: String },
      run_id: { type: Number },
      flavor: { type: String },
      loading: { type: Boolean },
      buildVersion: { type: String, attribute: 'build-version' },
      querySha: { type: String },
      queryPr: { type: String },
      shaMatched: { type: Boolean },
      builds: { type: Array },
      sources: { type: Array },
      selectedKey: { type: String },
      showInstall: { type: Boolean },
      selectedBuild: { type: Object },
      waiting: { type: String },
      lastChecked: { type: Number },
    };
  }

  get manifest() {
    if (this.run_id < 0) return "";
    return this.href + this.run_id + ".json?" + new URLSearchParams({ flavor: this.flavor });
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

    .notice {
      margin: 0 10px 8px;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 13px;
      line-height: 1.5;
      background: rgba(59, 130, 246, 0.1);
      border-left: 3px solid rgb(59, 130, 246);
    }
    .notice strong { display: block; }
    .notice a { color: rgb(59, 130, 246); }
    .link-btn {
      background: none;
      border: none;
      padding: 0;
      color: rgb(59, 130, 246);
      cursor: pointer;
      font: inherit;
      text-decoration: underline;
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
    :host([theme="dark"]) .notice { background: rgba(59, 130, 246, 0.15); }
    :host([theme="dark"]) .link-btn { color: rgb(100, 160, 255); }
  `;

  private _themeObserver: MutationObserver | null = null;

  constructor() {
    super();
    this.href = "";
    this.run_id = -1;
    this.flavor = "";
    this.loading = true;
    this.buildVersion = "";
    this.querySha = "";
    this.queryPr = "";
    this.shaMatched = true;
    this.builds = [];
    this.sources = [];
    this.selectedKey = "";
    this.showInstall = false;
    this.selectedBuild = null;
    this.waiting = "";
    this.lastChecked = 0;
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
    window.clearTimeout(this._pollTimer);
  }

  private _syncTheme() {
    const theme = document.documentElement.dataset.theme || 'light';
    this.setAttribute('theme', theme);
  }

  async firstUpdated() {
    const params = new URLSearchParams(window.location.search);
    this.querySha = params.get("sha")?.trim().toLowerCase() || "";
    this.queryPr = params.get("pr")?.trim() || "";
    try {
      await this._loadRuns(false);
    } catch (e) {
      console.warn(e);
    } finally {
      this.loading = false;
    }
    this._applyQuery();
  }

  // The listing is cached for a few minutes, so a link handed out the moment a
  // build finishes can arrive before the build does. Keep checking until it
  // shows up rather than leaving the visitor on a list without it.
  private _waitForBuild() {
    if (!this._waitStarted) this._waitStarted = Date.now();
    if (Date.now() - this._waitStarted > WAIT_LIMIT_MS) {
      this.waiting = "gave-up";
      return;
    }
    this.waiting = "polling";
    this._pollTimer = window.setTimeout(async () => {
      try {
        await this._loadRuns(true);
      } catch (e) {
        console.warn(e);
      }
      this._applyQuery();
    }, POLL_INTERVAL_MS);
  }

  checkAgain() {
    this._waitStarted = 0;
    window.clearTimeout(this._pollTimer);
    this._waitForBuild();
  }

  private async _loadRuns(fresh: boolean) {
    // Cached proxy, not api.github.com: browsers share a 60/hour allowance there.
    // When polling, skip the browser's copy so each check reaches the edge.
    const runsResponse = await fetch("/artifacts/runs", {
      credentials: "same-origin",
      ...(fresh && { cache: "no-store" as RequestCache }),
    });
    if (!runsResponse.ok) throw new Error(`Run listing error: ${runsResponse.status}`);
    const runsData = await runsResponse.json();
    this.lastChecked = Date.now();

    const allRuns: any[] = runsData.workflow_runs || [];
    this._allRuns = allRuns;

    const nightlyRuns = allRuns.filter(
      (r) => r.pull_requests.length === 0 &&
        r.head_repository?.full_name === "ESPresense/ESPresense"
    );
    const prRuns = allRuns.filter((r) => r.pull_requests.length > 0);

    const toEntry = (r: any): Build => ({
      id: r.id,
      age: timeAgo(r.created_at),
      sha: r.head_sha.substring(0, 7),
      message: r.head_commit?.message?.split("\n")[0] ?? "",
      tag: r.pull_requests.length > 0 ? `PR #${r.pull_requests[0].number}` : "Nightly",
      subtitle: r.pull_requests.length > 0 ? (r.display_title || "") : "",
      sourceKey: r.pull_requests.length > 0 ? `pr-${r.pull_requests[0].number}` : "nightly",
    });

    this.builds = [
      ...nightlyRuns.map(toEntry),
      ...prRuns.map(toEntry),
    ];

    // Build source list (Nightly + unique PRs)
    const srcs: Source[] = [];
    if (nightlyRuns.length > 0) {
      srcs.push({
        key: "nightly",
        label: "Nightly",
        title: "Main branch builds",
        count: nightlyRuns.length,
        latestAge: timeAgo(nightlyRuns[0].created_at),
      });
    }

    const seenPrs = new Map<number, Source>();
    for (const r of prRuns) {
      const pr = r.pull_requests[0];
      if (!seenPrs.has(pr.number)) {
        seenPrs.set(pr.number, {
          key: `pr-${pr.number}`,
          label: `PR #${pr.number}`,
          title: r.display_title || "",
          count: 0,
          latestAge: timeAgo(r.created_at),
        });
      }
      seenPrs.get(pr.number)!.count++;
    }
    this.sources = [...srcs, ...seenPrs.values()];
  }

  // Select what ?sha= or ?pr= asked for, or start waiting for it to arrive
  private _applyQuery() {
    if (this.querySha) {
      const matched = this._allRuns.find((r) => r.head_sha?.toLowerCase().startsWith(this.querySha));
      this.shaMatched = !!matched;
      const build = matched && this.builds.find((b) => b.id === matched.id);
      if (build) {
        this.waiting = "";
        // Only move the visitor if they haven't picked something else meanwhile
        if (!this.selectedKey || this.selectedKey === `pr-${this.queryPr}`) {
          this.selectedKey = build.sourceKey;
          this.selectedBuild = build;
          this.run_id = build.id;
          this.showInstall = true;
        }
        return;
      }
    } else if (this.queryPr) {
      const key = `pr-${this.queryPr}`;
      if (this.sources.find((s) => s.key === key)) {
        this.waiting = "";
        if (!this.selectedKey) this.selectedKey = key;
        return;
      }
    } else {
      return;
    }
    this._waitForBuild();
  }

  flavorChanged(e: Event) {
    this.flavor = (e.target as HTMLSelectElement).value;
  }

  selectSource(key: string) {
    this.selectedKey = key;
    this.selectedBuild = null;
    this.run_id = -1;
  }

  selectBuild(build: Build) {
    this.run_id = build.id;
    this.selectedBuild = build;
    this.shaMatched = true;
  }

  goBack() {
    this.selectedKey = "";
    this.selectedBuild = null;
    this.run_id = -1;
  }

  private _visibleBuilds(): Build[] {
    return this.builds.filter((b) => b.sourceKey === this.selectedKey);
  }

  private _flavorSelect() {
    return html`
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

  private _renderSourcePicker() {
    return html`
      <div class="table-wrap" style="padding: 4px 10px">
        <div class="table-label">Select a branch or PR</div>
        <div class="tbl">
          ${this.sources.map((s) => html`
            <div class="tbl-row src-row" @click=${() => this.selectSource(s.key)}>
              <div>
                <div class="src-label ${s.key === 'nightly' ? 'nightly' : 'pr'}">${s.label}</div>
                <div class="src-meta">${s.latestAge} · ${s.count} build${s.count !== 1 ? 's' : ''}</div>
              </div>
              <span class="src-title" title=${s.title}>${s.title}</span>
            </div>
          `)}
        </div>
      </div>
    `;
  }

  private _renderBuildPicker() {
    const visibleBuilds = this._visibleBuilds();
    const src = this.sources.find((s) => s.key === this.selectedKey);
    return html`
      <div class="install-screen">
        <button class="back-btn" @click=${this.goBack}>← Back</button>
        <div class="table-label">${src?.label}${src?.title ? html` — <span style="font-weight:400">${src.title}</span>` : ''}</div>
        <div class="tbl" style="margin-bottom:10px">
          ${visibleBuilds.map((b) => html`
            <div class="tbl-row bld-row ${this.selectedBuild?.id === b.id ? 'selected' : ''}" @click=${() => this.selectBuild(b)}>
              <span class="bld-age">${b.age}</span>
              <span class="bld-sha">${b.sha}</span>
              <span class="bld-msg" title=${b.message}>${b.message}</span>
            </div>
          `)}
        </div>
        ${this.selectedBuild
        ? html`
            <p class="connect-hint">Connect your ESP device via USB, then click Connect:</p>
            <div class="install-row">
              <div class="flavor-row">
                <label for="flavor">Flavor:</label>
                ${this._flavorSelect()}
              </div>
              <esp-web-install-button manifest=${this.manifest}></esp-web-install-button>
            </div>`
        : html`<div class="empty-state">Select a build above to continue</div>`
      }
      </div>
    `;
  }

  private _renderWaiting() {
    if (!this.waiting) return "";
    const what = [
      this.queryPr && `PR #${this.queryPr}`,
      this.querySha && html`<code>${this.querySha.substring(0, 7)}</code>`,
    ].filter(Boolean);
    const label = what.length === 2 ? html`${what[0]} (${what[1]})` : what[0];
    const prLink = this.queryPr
      ? html` <a href="https://github.com/ESPresense/ESPresense/pull/${this.queryPr}" target="_blank" rel="noopener">View the PR on GitHub</a>.`
      : "";
    return this.waiting === "polling"
      ? html`<div class="notice" role="status">
          <strong>Waiting for the build for ${label}…</strong>
          A build that just finished can take up to 10 minutes to show up here.
          This page checks every 30 seconds and will open it as soon as it arrives.
        </div>`
      : html`<div class="notice" role="status">
          <strong>The build for ${label} hasn't shown up yet.</strong>
          It may still be building, or the build may have failed.${prLink}
          <button class="link-btn" @click=${this.checkAgain}>Keep checking</button>
        </div>`;
  }

  render() {
    return html`
      ${this._renderWaiting()}
      ${this.loading
        ? html`<div style="padding:10px"><span>Loading builds...</span></div>`
        : this.selectedKey
          ? this._renderBuildPicker()
          : this._renderSourcePicker()}

    `;
  }
}
