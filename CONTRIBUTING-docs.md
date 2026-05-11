# Contributing to the ESPresense docs

Thanks for fixing a doc. The bar is here on purpose — once you know what good looks like, the PR almost writes itself.

This file covers the docs site at [espresense.com](https://espresense.com), built from this repo. Code/firmware contributions go to [`ESPresense/ESPresense`](https://github.com/ESPresense/ESPresense); the desktop daemon goes to [`ESPresense-companion`](https://github.com/ESPresense/ESPresense-companion).

---

## TL;DR for the impatient

1. Pick the [Diataxis mode](#1-which-kind-of-page-am-i-writing-diataxis) for what you're writing. One mode per page.
2. If you're documenting firmware behavior or commands, **boot the firmware and run them.** Then add a `Last verified against firmware vX.Y.Z (YYYY-MM-DD)` line.
3. `npm install && npm run dev` to preview at <http://localhost:4321>.
4. Open a PR. Maintainer review is usually 1–3 days. Friendly nits are normal; the bar below is what we hold ourselves to too.

---

## 1. Which kind of page am I writing? (Diataxis)

We use the [Diataxis](https://diataxis.fr/) frame. **Pick one mode per page.** Mixed-mode pages are the single most common reason a docs PR gets sent back.

| Mode | When to use it | Reader's question | Example on this site |
|---|---|---|---|
| **Tutorial** | Teaching a new user end-to-end the first time | "I just bought an ESP32 — what do I do?" | (in flight) the new Getting Started page |
| **How-to** | Walking an existing user through a specific task | "How do I calibrate my nodes?" | [`guides/calibration.md`](./src/content/docs/guides/calibration.md) |
| **Reference** | Looking up exact options, fields, topics, schemas | "What does `absorption` accept?" | [`configuration/mqtt.md`](./src/content/docs/configuration/mqtt.md), [`configuration/settings.md`](./src/content/docs/configuration/settings.md) |
| **Explanation** | Building the reader's mental model | "Why does Companion need 5–8 nodes per floor and mqtt_room only one?" | [`approach.mdx`](./src/content/docs/approach.mdx) |

Quick rules of thumb:

- **Tutorials and how-tos look similar but aren't.** A tutorial assumes nothing and lands somewhere new. A how-to assumes the user already knows what they're trying to do — short, direct, no preamble.
- **Reference is dense and skimmable**, not narrative. Tables, field lists, schemas. If you're writing prose paragraphs in a reference page, you probably want a separate explanation page.
- **Explanation is the only place for "why."** Don't bury the why inside reference tables (we have done this; it's how `companion/configuration.md` ended up at 319 lines doing all four modes at once).
- **If a page wants to be two modes, split it.** Link between them.

The audit in [ESPA-38](https://github.com/ESPresense/ESPresense/issues) flagged several mixed-mode pages — the patterns to avoid are listed in [The defects we keep finding](#3-the-defects-we-keep-finding) below.

---

## 2. The docs quality bar

Hold a PR to all six. Maintainers will hold their own PRs to all six.

### 2.1 Verified commands and config

If your page contains a command, a YAML/JSON snippet, an MQTT topic, or a UI click-path:

- **Run it** against the firmware version you're claiming to support, on the kind of board the page targets. Don't paste from memory and don't paste from an old discussion thread without re-running.
- **Use a real value, not a placeholder.** `host: mqtt.local` is verifiable; `host: your_host` teaches nothing and breaks copy-paste. If a placeholder is genuinely necessary, give one full worked example first and then call out which token the reader substitutes.
- **MQTT topics: pick one prefix and stick to it.** The current prefix is `espresense/`. The legacy `room_presence/` prefix appears in old screenshots and stale forum posts; don't reintroduce it.

### 2.2 Dated freshness line

Every reference and how-to page gets a one-line freshness footer (or italic line under the title for shorter pages):

```md
*Last verified against firmware [v4.1.0b0](https://github.com/ESPresense/ESPresense/releases/tag/v4.1.0b0) on 2026-05-10.*
```

- Use the actual firmware tag you tested against, with a link to the GitHub release.
- Date in `YYYY-MM-DD`. If you didn't test today, use the date you tested.
- Tutorials: same line, plus the board model you tested on.
- Explanation pages: optional. Date them when the underlying mental model could go stale (e.g. "as of fw v4.x the multilateration solver…").

If you can't honestly write this line for a page you're touching, that's a finding — flag it in the PR description and we'll figure it out together. Don't fake the date.

### 2.3 Real diagrams, not link dumps

- **Diagrams: SVG with descriptive `alt` text.** JPGs and PNGs are accepted for screenshots only. A "diagram" that's 20 academic PDFs in a bullet list is a link dump, not a diagram (see `guides/technical.md` — that's the cautionary tale).
- **Screenshots: dated and current.** Home Assistant's UI changed "Settings → Apps" to "Settings → Add-ons" — screenshots showing the old labels mislead users. If you're reshooting, drop the file in `public/images/` and reference it with a relative path.
- **Avoid hot-linking** `user-images.githubusercontent.com` URLs. Those break when the user account changes. Commit the image into `public/images/`.

### 2.4 No abandoned drafts

- Don't merge a page that's missing the next step. Either finish it or open it as a draft PR with `[WIP]` in the title.
- Empty H2 headings (a heading followed by no content, then another heading) are a sign of a half-done split — finish the section or remove the heading.
- Stub integrations (`integrations/homebridge.md`, `integrations/domoticz.md`) are fine as long as they're honestly framed as stubs and link to the upstream project. Stubs that pretend to be complete docs aren't.

### 2.5 Information scent in titles, slugs, and sidebar

- **Page titles are promises.** A page called "Quick Start" should teach you to start quickly. If it's a list of external blog links, name it `external-resources.md`.
- **Sidebar group matches the page mode.** A "Getting started" sidebar entry that points to a reference page sets the wrong expectation.
- **Slugs are URLs forever.** Don't rename casually. If you must, add a redirect in [`astro.config.mjs`](./astro.config.mjs) under `redirects:` so old links keep working.

### 2.6 Cite the source

For any non-trivial claim — calibration values, board recommendations, behavior of an MQTT topic — cite the source inline. Acceptable sources, in rough order of authority:

1. The firmware source (link to a specific file/line on `main` or a tag).
2. A maintained canonical-pinned [Discussion](https://github.com/ESPresense/ESPresense/discussions).
3. A specific Discussion or Issue thread (link to the comment, not just the thread).
4. A maintainer's blog post or video — only when the above don't exist.

"I read it on Discord" is not a source. Pull it into Discussions or a docs page first.

---

## 3. The defects we keep finding

These came out of the [ESPA-38](https://github.com/ESPresense/ESPresense/issues) audit walking every page on the site as of 2026-05-10. They aren't theoretical:

- **Mixed-mode pages.** `companion/configuration.md` is reference + how-to + explanation in one 319-line file. The Kalman-filter section is genuinely good explanation, but it's invisible under three config tables. → Split.
- **Stale UI labels.** "Settings → Apps / Apps Store" is the Home Assistant UI from before the Add-ons rename. Screenshots showing the old labels date the whole page.
- **Inconsistent topic prefixes.** `room_presence/#` in one example, `espresense/#` in the next. Pick one (it's `espresense/`).
- **Placeholder values that don't run.** `host: your_host` in the External MQTT block. A reader can't verify a config that won't connect.
- **Pages that are link dumps.** `guides/technical.md` is 20+ academic PDFs with no commentary. Useful raw material; not a docs page. Either turn it into real explanation citing 3–5 of them, or move it out of the public docs.
- **Component-only pages.** `troubleshooting/terminal.mdx` is 9 lines and an embedded `<SerialTerminal />`. A first-time user lands on a black box. Always wrap a component with: what it does, browser requirements, what a healthy result looks like.
- **Empty H2s.** Two consecutive `##` headings with nothing between them — a sign of an abandoned split. `apple.mdx` had this; don't ship it.
- **No freshness line, anywhere.** Before this contributing guide, no page on the site told the reader which firmware it was verified against. We're backfilling. Don't add to the deficit.
- **Affiliate-link rot.** Amazon/AliExpress links in `devices.md` and `nodes.md` go stale. If you add a board recommendation, link the manufacturer page first and the marketplace as a secondary "where to buy."

If you spot one of these in a page you're touching, fix it in the same PR — don't paper over it.

---

## 4. How to submit a docs PR

### 4.1 Setup

You need Node 22 (see [`.nvmrc`](./.nvmrc)) and npm. Then:

```sh
npm install
npm run dev
```

The site renders at <http://localhost:4321>. Hot reload works — save a `.md` or `.mdx` file and the browser refreshes.

To check the production build before pushing:

```sh
npm run build
npm run preview
```

The site is built with [Astro](https://astro.build/) and [Starlight](https://starlight.astro.build/). Pages live under `src/content/docs/` as Markdown (`.md`) or MDX (`.mdx`). The sidebar is configured in [`astro.config.mjs`](./astro.config.mjs).

### 4.2 Branch and commit

- Branch off `main`. Name it descriptively: `docs/calibration-how-to`, `docs/refresh-reference-fw-4.0.6`, `fix/typo-apple-enrollment`.
- One PR, one logical change. A typo fix and a page split shouldn't share a commit.
- Commit messages: imperative mood, present tense — "Add calibration how-to" not "Added calibration how-to".

### 4.3 Open the PR

Title: short and specific. "Calibration how-to with Discussions failure-mode triage" beats "calibration page".

Body should cover:

- **What** changed and **why**.
- **Diataxis mode** of any new or rewritten page.
- **Tested on** which firmware version and which board (or "site preview only — no firmware behavior changed").
- **Screenshots** if the page has visible UI changes (drag/drop the image into the PR body — GitHub uploads it).
- **Linked issue or Discussion**, if applicable.

If you used a draft because you want early feedback, mark it as a GitHub draft and say what you want eyes on.

### 4.4 What to expect on review

- A maintainer (currently [@DTTerastar](https://github.com/DTTerastar)) is auto-assigned. Expect a first response within ~3 days. Quicker on Discord if it's urgent.
- Reviews focus on: Diataxis mode, the [quality bar](#2-the-docs-quality-bar) above, voice ([§5](#5-the-voice)), and accuracy of any firmware/UI claim.
- "Can you re-test against the latest firmware tag?" and "Can you cite the source for that number?" are normal asks, not pushback.
- Small typo fixes can land same-day. New pages or restructures usually involve one round of revisions.
- We squash-merge. Your commit history on the branch doesn't need to be tidy.

### 4.5 After merge

- Cloudflare Pages picks up `main` and deploys to <https://espresense.com> within a few minutes.
- If you broke a known URL (renamed a slug, deleted a page), you should have already added a redirect in `astro.config.mjs`. If you forgot, open a follow-up PR.

---

## 5. The voice

Read [`approach.mdx`](./src/content/docs/approach.mdx) and [`guides/calibration.md`](./src/content/docs/guides/calibration.md) before you write. They're the model.

The site's voice is:

- **Direct.** "Place the beacon exactly 1 m from the reference node." Not "It is recommended that the beacon be positioned approximately one meter from the reference node."
- **Helpful.** Tell the reader what setting fixes their symptom up front. The 30-second triage table at the top of the calibration page exists because most readers landed there panicked.
- **Occasionally dry.** "Cranking RSSI@1m down to 'see further' is the wrong knob — it just makes other distances inaccurate" is allowed. So is calling a 9-line page "a black box." Don't reach for jokes; do trust the reader to handle a flat statement of fact.
- **Plain talk only.** No corporate jargon. We don't have "stakeholders" or "leverage synergies." We have nodes, beacons, and a reader trying to figure out why their phone reads 3 m away when it's in their pocket.
- **Second person, present tense.** "You set this once, globally." Not "users will need to set this once."
- **Short sentences carry the load.** Long sentences are reserved for hedged technical claims that genuinely need the qualifier.

What we avoid:

- Marketing copy. ESPresense is a hobbyist project that grew up; the docs match.
- "Simply." If a step were simple, the reader wouldn't be reading the docs.
- Apologizing for the project ("We know the calibration UI is confusing…"). State the current behavior clearly and link to the relevant Discussion if you'd like to see it improved.
- Threats and exclamation points. The reader is already frustrated; don't pile on.

---

## 6. Common contributions, with shape

If your contribution is one of these, here's the shape we're looking for.

**Fixing a typo or stale link.** Single commit, single file. No need for a freshness-line update. Squash-merges same-day.

**Updating a page against a new firmware release.** Walk every command and config option mentioned. Update the freshness line at the top. If something now behaves differently, note the version it changed in. Coordinate with the [Tech Lead](https://github.com/ESPresense/ESPresense/discussions) before stating "what the firmware does" — don't guess.

**Adding a new how-to.** Pick a single, specific task. Don't try to be exhaustive. Cite the Discussions thread or Issue that motivated it. Add a freshness line. Add the page to `astro.config.mjs` sidebar in the right group.

**Adding a new integration.** Stubs are fine if they link upstream and say "PRs welcome." Full integration docs should follow the shape of `integrations/home-assistant.md` (auto-discovery first, manual config second, troubleshooting last).

**Splitting a mixed-mode page.** Open a tracking issue first so we can coordinate redirects and sidebar changes. The split should land as one PR, not several — readers shouldn't see a half-split state in production.

**Restoring a Discussions answer to a docs page.** Pick a question that has been asked three or more times. Convert the canonical answer into either a how-to (if it's procedural) or a reference page (if it's a value/topic/option). Link the Discussion forward to the new page; the Community Manager adds a "see the docs page" pointer at the top of the Discussion.

---

## 7. When to ask before opening the PR

You don't need permission for typos, link fixes, freshness updates, or screenshot refreshes. Open the PR.

For larger changes, drop a note in [Discussions](https://github.com/ESPresense/ESPresense/discussions) or [Discord](https://discord.gg/jbqmn7V6n6) first if you're:

- **Restructuring the sidebar** or renaming pages (URL stability matters).
- **Deleting a page** (someone may be linking to it).
- **Stating new firmware behavior** that isn't already documented (Tech Lead needs to confirm).
- **Adding a translation.** We don't currently maintain translations and would need to commit to keeping them current before accepting one.

---

## 8. License

By contributing, you agree your contribution is licensed under the same license as the repo. Contributions are credited via the GitHub commit history; major contributors also get a line in [`credits.md`](./src/content/docs/credits.md).

---

*Last revised 2026-05-11 against firmware v4.1.0b0. If something on this page is out of date, it's also fair game for a PR.*
