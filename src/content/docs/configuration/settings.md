---
title: Settings
sidebar:
  order: 2
---


<img src="/images/settings_screen.png" alt="Screenshot of ESP32 full settings interface" style="float:right;margin-left:20px;width:340px" />

These settings are accessible from the **Settings** page in the device web UI. Most can also be written live over [MQTT](/configuration/mqtt) — defaults and ranges for every option are listed in the [MQTT settings reference](/configuration/mqtt/#settings-reference). The ones marked **boot only** below are read once at startup and have no `<key>/set` handler; change them in the captive portal / Settings page and reboot the node.

## Scanning

* **Known BLE mac addresses** (no colons, space separated) — devices that use a random-but-static MAC. ESPresense publishes them with the stable id `known:{mac}`.
* **Known BLE identity resolving keys** — 32-hex-character IRKs (space separated) that let ESPresense recognise Apple devices through their address rotation. See [Apple devices](/apple) for extraction tips.
* **Forget beacon if not seen for (in milliseconds)** — drop idle fingerprints (`forget_ms`, default `150000` ms = 2.5 minutes). **Boot only.**
* **Maximum BLE fingerprints to track** — caps fingerprint memory at boot (`max_fingerprints`, default `100`; `200` on ESP32-S3/C3/C6). **Boot only.**
* **Allow active BLE connections to all devices** — `connect_all`. Bypasses the `query` allow-list and connects to everything. Expensive and rarely useful outside protocol debugging.

## Querying

Most BLE devices give a usable id from passive advertisements alone, but some need an active GATT connection to identify themselves. **Query** opens that connection and reads the Room Assistant id, model, and name characteristics. When the device responds, ESPresense upgrades to the most-selective id available.

* **Query device ids for characteristics** — id-prefix allow-list (`query`), e.g. `flora:` for Xiaomi Mi Flora plant sensors.
* **Requery interval in seconds** — re-issue the active query every N seconds (`requery_ms`, default `300`, range 30–3600). **Boot only.**

## Counting

A beta feature for devices that you can't fingerprint individually but where the *count* itself is useful — `exp:20` (COVID exposure apps), `apple:` (anonymous Apple devices), `Microsoft:cdp` (Microsoft devices). When set, auto-discovery adds a count sensor to your ESPresense node.

Only `count_ids` is live-settable. The three hysteresis knobs (`count_enter`, `count_exit`, `count_ms`) are read once at boot.

* **Include ID prefixes** (`count_ids`).
* **Start counting devices less than distance** (m) — "enter" radius (`count_enter`, default `2.0`). **Boot only.**
* **Stop counting devices greater than distance** (m) — "leave" radius (`count_exit`, default `4.0`). Setting this above the enter radius creates a hysteresis band that prevents flapping. **Boot only.**
* **Include devices with age less than** (ms) — drop a device from the count if its last advertisement is older than this (`count_ms`, default `10000`). **Boot only.**

## Filtering

* **Include only sending these IDs to MQTT** — if set, ONLY matching ids are published (`include`). Example: `Apple:iphone10-6 Apple:iphone13-2`.
* **Exclude sending these IDs to MQTT** — drop matching ids before publish (`exclude`). Example: `exp:20 Apple:iphone10-6`.
* **Maximum distance to report (in meters)** — distances above this are dropped as likely-noise (`max_distance`, default `16.0`).
* **Report early if beacon has moved more than this distance** — force-publish on a movement burst (`skip_distance`, default `0.5` m).
* **Skip reporting if message age is less than this** (ms) — rate-limit per fingerprint (`skip_ms`, default `5000`). The logic is: if the device was reported recently, suppress until either the report-early distance is exceeded **or** `skip_ms` elapses.

:::caution
Do not filter out the per-node iBeacon ids. Nodes use one another's advertisements for inter-node distance measurements; suppressing them breaks Companion's optimizer and the Calibration helpers.
:::

## Calibration

These settings control how ESPresense converts RSSI to a distance estimate. See [Calibration](/guides/calibration) for the full procedure.

* **RSSI expected from a 0dBm transmitter at 1 meter** — reference RSSI for ad-hoc devices (`ref_rssi`, default `-65`). *Not* used for iBeacons or Eddystone — those carry their own calibrated RSSI in the advertisement.
* **RSSI adjustment for receiver** — per-node offset to align antennas across boards (`rx_adj_rssi`, default `0`; `20` on bare ESP32-S3 builds to compensate for the on-chip antenna). M5STICK and M5ATOM builds — even when they're S3-based — keep the default at `0` because those board defines are matched before `ESP32S3` in `include/defaults.h`.
* **Factor used to account for absorption, reflection, or diffraction** — environmental path-loss exponent (`absorption`, default `2.7`, range 1–5). Higher = more attenuation per meter.
* **RSSI expected from this tx power at 1m** — calibration target for this node's own iBeacon broadcasts (`tx_ref_rssi`, default `-59`).

For LED and GPIO sensor configuration (PIR motion, radar motion, switches, buttons), see [Hardware](/configuration/hardware).

For the full topic list, command shapes, and over-the-air examples, see [MQTT](/configuration/mqtt).

---

*Last verified against firmware v4.0.6 (`main` @ d9a1765, 2026-05-10).*
