---
title: Nodes
description: Reference list of ESP32 boards that run ESPresense, organised by tier from first-time-buyer pick to steer-away.
sidebar:
  order: 4
---

<!-- Last verified against firmware v4.0.6 on 2026-05-11. -->

Community-voiced board data and quotes are lifted from the canonical pin: [discussion #2334 — Boards: what works, what's flaky, what to avoid](https://github.com/ESPresense/ESPresense/discussions/2334). If a board you've run isn't listed, comment on that thread and we'll fold it in.

## First-time buyer (tier 1)

If you've never deployed ESPresense before, buy one of these. Both are branded, enclosed (or stamp-form, not a bare clone PCB), ship with a 3D antenna, and are well-supported by the [browser installer](/firmware) — it detects the chip family and lists the matching firmware builds in the dropdown.

:::note[Affiliate disclosure]
Some store links on this page (Amazon, AliExpress) are affiliate links. As an Amazon Associate, ESPresense earns from qualifying purchases, at no extra cost to you. Affiliate revenue helps fund the project — see [Credits](/credits) for other ways to support.
:::

| Board | Chip | Why it's tier 1 | Stores |
|:------|:-----|:--------------------|:-------|
| **M5 Atom S3 Lite** | ESP32-S3 | First-timer pick: ~$15, enclosed, USB-C, status LED, 8 MB flash, noticeably better BT range than original ESP32 [^cdc] | [m5stack](https://docs.m5stack.com/en/core/AtomS3%20Lite) [ali](https://s.click.aliexpress.com/e/_oFSxCND) [amz/us](https://amzn.to/4v3qPFm) |
| **M5 Stamp C3 Mate** | ESP32-C3 | Cost-conscious pick: stamp form, RISC-V, runs cool, 4 MB flash, 3D antenna, RGB LED | [m5stack](https://shop.m5stack.com/products/m5stamp-c3-mate-with-pin-headers) [ali](https://s.click.aliexpress.com/e/_omweFp9) |

## Chip families

Pick a chip first, then a board within it.

| Chip | Supported | Notes |
|:-----|:----------|:------|
| ESP32-S3 | yes — recommended for new deployments | 8 MB flash typical, BT 5.0 LE coded PHY, USB-CDC |
| ESP32-C3 | yes — recommended for cost-sensitive deployments | RISC-V, 4 MB flash typical |
| ESP32-C6 | yes | Newer RISC-V part with BT 5.3; firmware build available |
| Original ESP32 | yes, for now | Older silicon with less CPU and RAM than the S3/C3/C6 parts. Still supported, but expect it to age out of new firmware features eventually — prefer a newer chip for new deployments. |
| ESP32-S2 | no | No Bluetooth radio |
| ESP8266 | no | No Bluetooth radio |

## Community-tested (branded)

Branded boards we actively point new users at. The [browser installer](/firmware) detects the chip family and lists the matching firmware builds in its flavour dropdown. [^cdc]

### ESP32-S3

| Board | Stores | Notes |
|:------|:-------|:------|
| M5 Atom S3 Lite | [m5stack](https://docs.m5stack.com/en/core/AtomS3%20Lite) [ali](https://s.click.aliexpress.com/e/_oFSxCND) [amz/us](https://amzn.to/4v3qPFm) | Enclosed, USB-C. 8 MB flash, 3D antenna, IR emitter, RGB LED, button, GROVE [^cdc] |
| M5 Atom S3U | [ali](https://s.click.aliexpress.com/e/_c3bZmzLz) | Enclosed, USB-A. 8 MB flash, 3D antenna, IR emitter, PDM mic, RGB LED, button, GROVE [^cdc] |
| M5 Stamp S3 | [ali](https://s.click.aliexpress.com/e/_oB3a0Dv) | Stamp form. 8 MB flash, 3D antenna, RGB LED [^cdc] |
| Teyleten Robot S3 | [ali](https://s.click.aliexpress.com/e/_c3JEwtzv) [amz/us](https://amzn.to/4jXMRUl) | Dev board. 8 MB flash + 2 MB PSRAM. Sold as a 3-pack [^cdc] |

### ESP32-C3

| Board | Stores | Notes |
|:------|:-------|:------|
| M5 Stamp C3 Mate | [m5stack](https://shop.m5stack.com/products/m5stamp-c3-mate-with-pin-headers) [ali](https://s.click.aliexpress.com/e/_omweFp9) | Stamp form. 4 MB flash, 3D antenna, RGB LED, button |
| M5 Stamp C3U Mate | [ali](https://s.click.aliexpress.com/e/_onkgbFp) | Stamp form, USB-A. 4 MB flash, 3D antenna, RGB LED, button [^cdc] |
| ESP32-C3-DevKitM-1U | [ali](https://s.click.aliexpress.com/e/_c3bVwFQb) [amz/us](https://amzn.to/41WQXFa) | Espressif's dev board with ESP32-C3-MINI-1U module and U.FL connector. 4 MB flash, 160 MHz |

### Original ESP32

| Board | Stores | Notes |
|:------|:-------|:------|
| M5 Atom (Lite / Echo / Matrix) | [ali](https://s.click.aliexpress.com/e/_oDWoyd1) [m5stack](https://shop.m5stack.com/collections/m5-controllers/products/atom-lite-esp32-development-kit) [digi](https://www.digikey.com/en/products/detail/m5stack-technology-co-ltd/C008/12088545) | Enclosed. The 3D antenna is much better than generic clones |
| M5 Stamp Pico | [ali](https://s.click.aliexpress.com/e/_olAPbYT) [m5stack](https://shop.m5stack.com/collections/m5-controllers/products/m5stamp-pico-diy-kit) | Stamp form. Small, still has a 3D antenna |
| Adafruit Huzzah32 | [amz/us](https://amzn.to/4kWlmw4) | Dev board. Branded, quality control unlike generic ESP32 dev boards |

## Works, with caveats

These boards run ESPresense, but antenna and module QC vary — RSSI from one of these often won't agree with a branded board at the same distance, which makes fleet calibration harder and is a real problem for Companion's room solver. Use one you already own rather than buying a new one. **If a "with caveats" board misbehaves, reproduce on a tier-1 board before opening a firmware issue** — RF problems on a marginal clone look identical to firmware bugs and burn a lot of triage time.

| Board | Caveat | Source |
|:------|:-------|:-------|
| AZDelivery ESP32 NodeMCU (WROOM-32 module on a generic dev board) | Works but no brand QC | [#2334][p] / [#1567][1567], [#1577][1577] |
| Generic D1 Mini ESP32 (Micro-B and USB-C) | Multiple users report working in practice; same no-brand → no-QC caveat on the RF front-end | [#2334][p] / [#162][162] |
| LOLIN D32 ESP32 | Works; unbranded RF caveat | [#2334][p] |
| M5StickC Plus | Built-in battery is a liability for a fixed-in-place node | [#2334][p] |
| SEEEDSTUDIO XIAO ESP32-C3 | Runs on the `esp32C3` flavour. One report of a board overheating ([#1364][1364]); use a known-good USB-C cable and a real power supply | [#2334][p] / [#1364][1364] |

## Steer away

Each of these comes up often enough that it's worth saying plainly:

- **Unbranded "ESP32 dev board" listings (Amazon / AliExpress).** ESPresense uses RSSI as its primary input — every distance estimate and every Companion room solve assumes the fleet's readings agree with each other. Unbranded clones don't have consistent antenna designs even within a single product listing; two boards from the same batch routinely differ by several dB at the same distance, which translates to feet of error in the Companion floor plan. None of that matters for sensor/relay/presence projects like ESPHome, which is why *"these same cheap boards never drop with ESPHome"* is a common (and accurate, but irrelevant) objection — ESPHome isn't doing RSSI distance estimation across a calibrated fleet. The failure mode here is also silent: the board flashes, joins WiFi, reports to MQTT, but its RSSI numbers don't line up with the rest of the fleet and you can't tell whether bad tracking is firmware, calibration, or a bad RF front-end. @maxi1134 separately reports a 40-50% WiFi-retry rate on generic ESP32 dev boards ([#1364][1364], summarised in [#2334][p]). For any node you intend to calibrate against the fleet — and especially for Companion — spend the extra few dollars on a branded board.
- **ESP32-CAM.** Not officially supported. Camera owns most of the GPIOs, tighter RAM, no maintained firmware variant. One community member keeps a fork working with source-side modifications ([#1347][1347]); we don't build for it.
- **ESP32-S2 / ESP8266.** No Bluetooth radio — physically can't run ESPresense.
- **NSPanel as a base station.** Open question. The chip is an ESP32, but no one has reported flashing ESPresense over the stock NSPanel firmware and getting both the touch UI and BT scanning working ([#1335][1335]).
- **GL-S10 Bluetooth IoT Gateway.** Not an ESP32 — MediaTek MT7621 with a separate BLE module — so the ESPresense firmware doesn't apply ([#1263][1263]).

## Power and cabling

### USB-C chargers

* [20W USB-C Wall Charger](https://amzn.to/4kXGphK) — small fast charger with foldable plug
* [20W USB-C Wall Charger (3-pack)](https://amzn.to/4hFLcBz)
* [20W USB-C Charger (AliExpress)](https://s.click.aliexpress.com/e/_c4Myg1Bl) — PD/QC 3.0

### USB-C to C cables

* [0.5 ft USB-C to C](https://amzn.to/4j02B9f)
* [15 cm USB-C to C, right angle (AliExpress)](https://s.click.aliexpress.com/e/_c2vxVV1D)

### USB-A chargers

* [Dual USB-A 3-pack](https://amzn.to/4iA0EAq) — compact cube design

### USB-A to C cables

* [16 ft, 2-pack](https://amzn.to/3zzTTXW)
* [1 ft, 6-pack](https://amzn.to/3kyD8Is)
* [Straight adapter 4-pack](https://amzn.to/4hNrh3O)
* [Right-angle adapter 4-pack](https://amzn.to/4bWWH6o)

### USB-A to Micro-B cables

* [0.5 ft Micro USB cable](https://amzn.to/4hzksTa)

## See also

* [Canonical pin #2334][p] — community discussion, raw quotes, source threads
* [Install Firmware](/firmware) — browser-based installer
* [Discord](https://discord.gg/jbqmn7V6n6) — faster human turnaround on board questions

## Footnotes

[^cdc]: USB-CDC firmware flavour. Pick the `cdc` variant from the [browser installer](/firmware) flavour dropdown (or when flashing manually).

[p]: https://github.com/ESPresense/ESPresense/discussions/2334
[162]: https://github.com/ESPresense/ESPresense/discussions/162
[1263]: https://github.com/ESPresense/ESPresense/discussions/1263
[1335]: https://github.com/ESPresense/ESPresense/discussions/1335
[1347]: https://github.com/ESPresense/ESPresense/discussions/1347
[1364]: https://github.com/ESPresense/ESPresense/discussions/1364
[1567]: https://github.com/ESPresense/ESPresense/discussions/1567
[1577]: https://github.com/ESPresense/ESPresense/discussions/1577
