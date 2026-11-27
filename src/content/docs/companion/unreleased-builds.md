---
title: Running an unreleased Companion build
description: Run a Companion pull request's Docker image on Home Assistant — how the pr-<number> tag is formed, the add-on edit that points at it, and the way back to a stable release.
sidebar:
  label: Unreleased builds
  order: 6
---

*How-to · Last verified against Companion [2.6.8](https://github.com/ESPresense/ESPresense-companion/releases/tag/v2.6.8) — the version the stable app pins today — on 2026-11-24. Every tag, field and command below was read from the published workflows, the app repository and the Home Assistant Supervisor source. **Nobody here has run either path end to end on a live install** — see [What is verified, and what is not](#what-is-verified-and-what-is-not).*

Every Companion pull request opened from the main repository publishes a Docker image:

```text wrap
espresense/espresense-companion:pr-1916
```

Home Assistant will run that image if you point a copy of the Companion app at it. **The way back is to delete the copy and start the app you already had** — it is still pinned to 2.6.8, and your configuration never moves: it lives in Home Assistant's `config` share, not inside the image.

:::caution[These builds are unreviewed]
A `pr-` image is one contributor's unmerged branch, built by CI the moment it was pushed. It has had no review, no release testing, and no promise that it starts at all. If room occupancy in your house drives heating, locks or lights, read [Going back to a stable release](#going-back-to-a-stable-release) before you start, and take a Home Assistant backup.
:::

## First: do you actually need a PR build?

If what you want is "newer than stable" rather than "this exact pull request", install the beta app instead and skip this entire page. **ESPresense Companion - BETA** ships from the [same repository](https://github.com/ESPresense/hassio-addons) you already added, as a separate app with its own slug, currently 2.6.9-beta.5. It installs, updates and uninstalls like any other app — no hand-edited files.

One thing carries over even on that shortcut: **stop the Companion you already run before you start the beta, and turn off its Start on boot.** The two are identical where it matters — same ports 8267 and 8268 on the host network, same `/config/espresense` — so only one of them can run at a time, and stopping an app does not stop it coming back at the next boot. Turn the toggle on again when you go back to stable. Both also show as "ESPresense" in the sidebar, so label-check before you click.

Use a PR build when you need one specific unmerged change: a fix someone asked you to confirm, or your own branch.

## Step 1 — Check the pull request has an image

Ask the registry before you touch Home Assistant. Substitute the PR number for `1916`:

```sh wrap
curl -s -o /dev/null -w '%{http_code}\n' https://hub.docker.com/v2/repositories/espresense/espresense-companion/tags/pr-1916
```

Read the status code, not the body:

- **`200`** — the image is published. Go to step 2.
- **`404`** — there is no such tag.
- **anything else** (`429`, a `5xx`, or a connection error) — the registry is having a bad day. That is not an answer about the pull request; try again in a minute.

Drop the `-o /dev/null -w '%{http_code}\n'` and you get the tag's JSON instead, where `last_updated` tells you when the build landed.

A `404` has three causes:

| Reason | How to tell |
|---|---|
| **The PR comes from a fork.** Fork PRs get no Docker Hub credentials, so the build is skipped rather than run. | The PR header reads "wants to merge … from `someone-else:branch`". There is no image and nothing you can do from the outside — ask the author to open it from a branch on the main repository. |
| **The PR's last push predates 2026-11-05.** `pr-<number>` tags start with [companion#1855](https://github.com/ESPresense/ESPresense-companion/pull/1855); before it, PR builds went out under version-shaped tags. | The PR's **Checks** tab shows no **Deploy to Docker** run at all. What decides is when the head was last built, not when the PR was opened or merged — an old PR that got a push last week does have an image. This is why companion#1504 — the March 2026 Z-containment fix — has no `pr-1504` image. |
| **The build failed or is still running.** | The PR's **Checks** tab → **Deploy to Docker** is red or in progress. A successful run's summary lists every tag it pushed. |

### Two tag shapes, and which to use

Each build pushes two tags ([`docker.yml`](https://github.com/ESPresense/ESPresense-companion/blob/main/.github/workflows/docker.yml)):

| Tag | Points at | Use it when |
|---|---|---|
| `pr-1916` | The PR's **newest** push. Moves whenever the author pushes again. | You just want "the current state of this PR". |
| `pr-1916-1657bd8` | One commit, forever. The suffix is the first 7 characters of the PR head commit. | **Preferred.** You know exactly what you ran when you report back. |

Get the exact commit from the PR page ("latest commit" on the Files or Commits tab), or from the **Deploy to Docker** summary. Images are built for `amd64`, `arm64` and `armv7` — the same three as a release.

Release channels are never touched by a PR build: `latest`, `beta` and every `X.Y.Z` tag are published only by the release workflow.

## Step 2 — Point a copy of the app at that tag

The Supervisor runs an app from `image:version`, where `version` is a field in the app's own `config.yaml`. You cannot edit the app you installed from the store — it is overwritten on every repository refresh — so make a local copy with that one field changed.

1. **Get access to the `local_apps` folder.** Install either the **Samba share** or the **Terminal & SSH** app from the official store. In Samba it is the share called `local_apps`; in Terminal & SSH it is the directory `/local_apps`. (Older Home Assistant versions call both `addons` — the legacy name still points at the same folder.)

2. **Create one file**: `local_apps/espresense-companion-pr/config.yaml`. This is the store app's own configuration with `name`, `slug` and `version` changed — plus `description`, `url` and `panel_title`, so the two are tellable apart in the UI:

   ```yaml title="local_apps/espresense-companion-pr/config.yaml" wrap
   name: ESPresense Companion (PR)
   version: pr-1916-1657bd8
   slug: espresense-companion-pr
   description: Unreleased ESPresense Companion build from a pull request
   url: https://espresense.com/companion/unreleased-builds
   image: espresense/espresense-companion
   arch:
     - aarch64
     - amd64
   map:
     - config:rw
   host_network: true
   ingress: true
   ingress_port: 8267
   ingress_stream: true
   panel_icon: mdi:alpha-e-circle
   panel_title: ESPresense PR
   homeassistant_api: true
   services:
     - mqtt:want
   ports:
     8267/tcp: null
     8268/tcp: null
   ports_description:
     8267/tcp: UI
     8268/tcp: Firmware Updates
   ```

   No `Dockerfile` and nothing else is needed: because `image` is set, the Supervisor pulls that image instead of building anything. Those are all the fields the store app has — compare it against [`espresense-companion/config.yaml`](https://github.com/ESPresense/hassio-addons/blob/main/espresense-companion/config.yaml) if you want to check.

   One field is deliberately shorter than the store app's. The store lists `armhf` and `armv7` as well; the Supervisor now treats `armhf`, `armv7` and `i386` as deprecated and supports `aarch64` and `amd64`, and there is no 32-bit-ARMv6 image to pull in any case.

3. **Stop the Companion you already run, and turn off its Start on boot.** Settings → **Apps** → **ESPresense Companion** → **Stop**, then switch **Start on boot** off on the same page. Both apps bind ports 8267 and 8268 on the host network and both read and write the same `/config/espresense` folder, so exactly one of them can run at a time — and **stopping an app does not stop it starting at the next boot**. Leave the toggle on and a reboot or a Supervisor update brings the stable app back up underneath the PR build. Write down that you turned it off; step 2 of [going back](#going-back-to-a-stable-release) turns it on again.

4. **Make Home Assistant notice the new folder.** Settings → **Apps** → **Apps Store** → ⋮ (top right) → **Check for updates**, then reload the page. "ESPresense Companion (PR)" appears under **Local apps**.

5. **Install it, then start it.** Its page shows `pr-1916-1657bd8` as the current version — that string is the image tag the Supervisor pulled, which is how you confirm what is running. Enable **Show in sidebar** if you want the panel; it is listed as "ESPresense PR" so you can tell the two apart.

Your floor plan, nodes and settings are already there — the app maps Home Assistant's `config` share, and the Companion reads `/config/espresense` from it. Nothing was copied or migrated.

### Picking up a newer commit on the same PR

Edit `version:` in that same file to the new `pr-1916-<sha7>`, then **Check for updates** again. The Supervisor compares the installed version string against the file and offers **Update**, which pulls the new tag. Restarting the app is not enough on its own — the old image is already local under the old tag.

## Going back to a stable release

Three steps put the stable release back. They do not undo configuration the PR build wrote while it was running — that part is covered below.

1. **Stop and uninstall the local copy.** Settings → **Apps** → **ESPresense Companion (PR)** → **Stop**, then **Uninstall**. Delete the `local_apps/espresense-companion-pr` folder if you want it gone from the store. Uninstalling is what makes this stick: a local copy you merely stop has its own **Start on boot** on by default and will be back after a reboot.
2. **Start ESPresense Companion again, and turn Start on boot back on.** The app itself was never changed — still pinned to 2.6.8, image still on the machine (if it was pruned the Supervisor re-pulls it; every stable tag from `2.6.2` to `2.6.8` is still published, as is `latest`). The one thing you did change is the toggle you switched off in [step 3](#step-2--point-a-copy-of-the-app-at-that-tag); switch it back, or the next reboot leaves you with no Companion at all.
3. **Check the panel comes back.** Same ingress port, same sidebar entry as before.

**Your configuration is not part of the swap.** `config.yaml` and the history database live in `<home assistant config>/espresense/`, which the app mounts into the container — switching images cannot touch them, in either direction.

**The broker is the third place state lives, and it does come back with you.** The Companion advertises each device to Home Assistant as a *retained* MQTT discovery message, and it rebuilds its device list from those messages on every start — it keeps no device list of its own. So a device the PR build started tracking is still advertised after you go back: 2.6.8 reads the retained message on start and tracks it too, and the entity stays in Home Assistant. Uninstalling the local copy does not clear it, and `scripts/alpha off` does not clear it. **Do not count on a backup for this one either.** If you run the Mosquitto app, a full Home Assistant backup does include its `/data`, where the broker persists retained messages — so restoring that app would roll the retained message back, along with every other retained topic from every integration. Not even to a moment you chose: the app is backed up hot, without being stopped or flushed first, and Mosquitto writes its database every half hour by default, so you land on its last save, which can be older than the backup. That is a sledgehammer with a blurred edge, not a fix. If your broker runs anywhere else, the backup contains none of it.

The targeted way to get rid of one: delete the device in the Companion UI, which clears the retained message, or clear the topic on the broker yourself.

What a PR build *can* still do, while it runs, is write to that folder like any other build: saving a page in the UI rewrites that section of `config.yaml`, and device history goes to `.storage/history.db`. Neither is a trap on the way back — 2.6.8 ignores configuration keys it does not know, a newer build only ever adds columns to the history database, and `history.enabled` is off by default, so most readers have no `history.db` at all. But there is no undo for content, so:

:::tip[Take the backup before the entrance, not after]
Settings → **System** → **Backups** → **Create backup**, or just copy the `espresense` folder out of your Home Assistant `config` share. That — not the image tag — is what protects a working floor plan.
:::

## If you have SSH to the host: `scripts/alpha`

This is the path the project uses on its own soak install, and it is a single command in each direction. It needs ssh into the Home Assistant machine with `docker` and `ha` available — in practice the community **Advanced SSH & Web Terminal** app with protection mode **off** — plus a clone of the repository. The `gh` CLI is only needed for the PR-number form, which uses it to resolve the head commit; `status` and `off` work without it.

```sh wrap
git clone https://github.com/ESPresense/ESPresense-companion
cd ESPresense-companion
ALPHA_HOST=homeassistant.local scripts/alpha 1916     # run PR #1916's newest image
ALPHA_HOST=homeassistant.local scripts/alpha status   # which commit is running
ALPHA_HOST=homeassistant.local scripts/alpha off      # back to the released image
```

What it does, from [`scripts/alpha-remote`](https://github.com/ESPresense/ESPresense-companion/blob/main/scripts/alpha-remote): resolves the PR's head commit, waits for the image, pulls it, keeps the released image as `alpha-backup-<version>`, tags the PR image as the version your installed app expects, and restarts the app. `off` puts the backup back (or re-pulls the release) and restarts again.

Three consequences worth knowing before you use it:

- **The Supervisor still believes it runs the release.** The app page shows 2.6.8 whichever image is actually running, so `scripts/alpha status` is the only honest answer to "what is running". The next app update replaces the PR image.
- **It is a test rig, not a channel.** Nothing is published, and it only accepts an exact `pr-<number>-<sha7>` tag.
- **It will not run if you have also done [step 2](#step-2--point-a-copy-of-the-app-at-that-tag).** With both the store app and the local copy installed it finds two Companion containers and stops with `More than one ESPresense Companion add-on here; set ALPHA_ADDON to pick one`. Take that message at less than face value: the selector is matched *after* `espresense-companion` in the container name, so it can pick the `-pr` copy but never the store app, whose name ends there. Since this rig exists to swap the store app's image, **uninstall the local copy first**. Pick one path, not both.

Labelling a PR `alpha` does the same thing from CI onto one specific install the maintainers own — that label is not a way to get a build onto yours.

## This is not the firmware PR installer

[espresense.com/alpha](/alpha) flashes **node firmware** over USB. It lists successful `build.yml` runs and pull requests from the [`ESPresense/ESPresense`](https://github.com/ESPresense/ESPresense) repository, and it writes ESP32 binaries to a board. It has no Companion path at all, and a Companion PR number means nothing to it — but it does not say so. `/alpha/?pr=1504` with a *Companion* PR number sits on **"Waiting for the build for PR #1504…"**, re-checks every 30 seconds for fifteen minutes, and then offers a **View the PR on GitHub** link pointing at *firmware* PR #1504 — which exists, and is an unrelated dependency bump. A quarter of an hour on a spinner, then somebody else's pull request. That is the dead end behind [this request from March 2026](https://github.com/ESPresense/ESPresense/issues/2220#issuecomment-4048998887), which asked for exactly the two things this page is here to answer.

Firmware and Companion version independently. Running a Companion PR build does not change anything on your nodes.

## What is verified, and what is not

Read from source on 2026-11-24:

- **The tag scheme and the fork exclusion** — [`docker.yml`](https://github.com/ESPresense/ESPresense-companion/blob/main/.github/workflows/docker.yml); release channels come from [`docker-rel.yml`](https://github.com/ESPresense/ESPresense-companion/blob/main/.github/workflows/docker-rel.yml).
- **The images exist.** `pr-1916`, `pr-1916-1657bd8` and every tag from `2.6.2` to `2.6.8` resolve to a multi-architecture manifest in the registry.
- **`version:` is the image tag the Supervisor runs**, and any string is accepted there — it is passed through as the tag, and update detection is a string comparison, not a version comparison.
- **The configuration lives outside the image.** The app maps Home Assistant's `config` share and the image sets `CONFIG_DIR=/config/espresense`.
- **2.6.8 ignores unknown configuration keys**, so a key a newer build writes does not break the way back.
- **The architectures.** The image is built for `amd64`, `arm64` and `armv7`; the Supervisor supports `aarch64` and `amd64`, and lists `armhf`, `armv7` and `i386` as deprecated.
- **Start on boot is a separate setting from running.** An app's `boot` defaults to `auto`, stopping an app does not change it, and at every boot the Supervisor starts each installed app whose `boot` is `auto` — which is why step 3 turns the toggle off and the rollback turns it back on.
- **Retained discovery survives the rollback.** Discovery configs are published with the retain flag, and the device list is rebuilt from them on start — so the paragraph about the broker is a property of the code, not a guess. The Mosquitto app runs with `persistence true` and `persistence_location /data/`, which is why a backup of that app is the one thing that *does* contain broker state — taken hot, with no flush, against a database Mosquitto saves on its default half-hour interval.
- **The `/alpha` installer is firmware-only**, and the fifteen-minute wait and the firmware-repo link are in its shipped source in this repository.

Every claim above was re-derived a second time, independently, in a technical review on 2026-11-24.

Not verified: **no one has run either path on a live Home Assistant install.** The app copy and the rollback are read off the Supervisor's own source and the project's own scripts, not rehearsed on a house. The `scripts/alpha` path is exercised regularly by the maintainers on one install; the local-copy path in [Step 2](#step-2--point-a-copy-of-the-app-at-that-tag) is a procedure assembled from verified mechanisms, and you may be the first to run it.

If you do run it, say what happened — on the pull request you were testing, or in [Discussions](https://github.com/ESPresense/ESPresense/discussions). Both are better than this line staying as it is, and we will date it with what you saw.
