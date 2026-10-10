---
title: Nodes
description: Reference list of ESP32 boards that run ESPresense, organised by tier from first-time-buyer pick to steer-away.
sidebar:
  order: 4
---

<!-- Last verified against firmware v4.0.6 on 2026-05-11. -->

Community-voiced board data and quotes are lifted from the canonical pin: [discussion #2334 — Boards: what works, what's flaky, what to avoid](https://github.com/ESPresense/ESPresense/discussions/2334). If a board you've run isn't listed, comment on that thread and we'll fold it in.

## Chip families

Pick a chip first, then a board within it.

| Chip | Supported | Notes |
|:-----|:----------|:------|
| ESP32-S3 | yes — recommended for new deployments | 8 MB flash typical, BT 5.0 LE coded PHY, USB-CDC |
| ESP32-C3 | yes — recommended for cost-sensitive deployments | RISC-V, 4 MB flash typical |
| ESP32-C6 | yes — bleeding edge | Newer RISC-V part with BT 5.3; firmware build available |
| Original ESP32 | yes, for now | Older silicon with less CPU and RAM than the S3/C3/C6 parts. Still supported, but expect it to age out of new firmware features eventually — prefer a newer chip for new deployments. |
| ESP32-S2 | no | No Bluetooth radio |
| ESP8266 | no | No Bluetooth radio |

## Recommended boards

**The boards in bold are the picks if you don't want to think about it** — M5 Atom S3 Lite as the default, M5Stack NanoC6 for kitting out a whole house (tiny, enclosed, very capable, ~$6), M5 Stamp C3 Mate as a cost-conscious alternative.

All branded boards listed here flash with the [browser installer](/firmware), which picks the right firmware flavour automatically.

:::note[Affiliate disclosure]
Some store links on this page (Amazon, AliExpress, M5Stack) are affiliate links. As an Amazon Associate, ESPresense earns from qualifying purchases, at no extra cost to you. Affiliate revenue helps fund the project — see [Credits](/credits) for other ways to support.
:::

### ESP32-S3

| Board | Stores | Notes |
|:------|:-------|:------|
| **[M5 Atom S3 Lite](/nodes/atom-s3-lite)** | [m5stack](https://shop.m5stack.com/products/atoms3-lite-esp32s3-dev-kit?ref=ESPresense) [ali](https://s.click.aliexpress.com/e/_c3SezL2p) [ali2](https://s.click.aliexpress.com/e/_oFSxCND) [amz/us](https://amzn.to/47b6xzW) | Enclosed, USB-C. 8 MB flash, 3D antenna, IR emitter, RGB LED, button, GROVE [^cdc] |
| **[LILYGO T-Energy-S3](/nodes/t-energy-s3)** | [amz/us](https://www.amazon.com/dp/B0HKM6N3N2?tag=espresense-20) | 18650 holder and power switch: a portable node for calibration walks, about a day per charge. 16 MB flash, PCB antenna, USB-C [^cdc] |
| M5 Atom S3U | [m5stack](https://shop.m5stack.com/products/atoms3u?ref=ESPresense) [ali](https://s.click.aliexpress.com/e/_c3bZmzLz) [amz/us](https://amzn.to/4uZJFgE) | Enclosed, USB-A. 8 MB flash, 3D antenna, IR emitter, PDM mic, RGB LED, button, GROVE [^cdc] |
| M5 Stamp S3 | [ali](https://s.click.aliexpress.com/e/_oB3a0Dv) [amz/us](https://amzn.to/4dv6anp) | Stamp form. 8 MB flash, 3D antenna, RGB LED [^cdc] |
| Seeed XIAO ESP32-S3 | [ali](https://s.click.aliexpress.com/e/_c4thPCrX) [amz/us](https://amzn.to/4dpWw5E) | Tiny module, USB-C. 8 MB flash + 8 MB PSRAM, U.FL connector with external antenna. Listing also sells the C3 and S3 Sense — pick the S3 option. Amazon sells a 3-pack [^cdc] |

### ESP32-C3

| Board | Stores | Notes |
|:------|:-------|:------|
| **M5 Stamp C3 Mate** | [m5stack](https://shop.m5stack.com/products/m5stamp-c3-mate-with-pin-headers?ref=ESPresense) [ali](https://s.click.aliexpress.com/e/_omweFp9) [amz/us](https://amzn.to/4tVkzP4) | Stamp form. 4 MB flash, 3D antenna, RGB LED, button |
| M5 Stamp C3U Mate | [m5stack](https://shop.m5stack.com/products/m5stamp-c3u-mate-with-pin-headers?ref=ESPresense) [ali](https://s.click.aliexpress.com/e/_onkgbFp) [amz/us](https://amzn.to/479m4QW) | Stamp form, USB-A. 4 MB flash, 3D antenna, RGB LED, button [^cdc] |
| ESP32-C3-DevKitM-1U | [ali](https://s.click.aliexpress.com/e/_c3bVwFQb) | Espressif's dev board with ESP32-C3-MINI-1U module and U.FL connector. 4 MB flash, 160 MHz |

### ESP32-C6

C6 support is bleeding edge — expect rougher edges than S3/C3.

| Board | Stores | Notes |
|:------|:-------|:------|
| **[M5Stack NanoC6](/nodes/nanoc6)** | [m5stack](https://shop.m5stack.com/products/m5stack-nanoc6-dev-kit?ref=ESPresense) [ali](https://s.click.aliexpress.com/e/_c36Zc6y1) [amz/us](https://amzn.to/3VVBUfq) | Very small and enclosed, USB-C. 4 MB flash, ceramic antenna, IR emitter, RGB LED, button, GROVE |
| Seeed XIAO ESP32-C6 | [ali](https://s.click.aliexpress.com/e/_c364MTzR) [amz/us](https://amzn.to/4jNi9R6) | Tiny module, USB-C. 4 MB flash, onboard ceramic antenna + U.FL connector. Amazon sells a 3-pack |

### Original ESP32

Still supported, but don't buy one new — the silicon is old and the newer S3/C3/C6 boards above are better and cost about the same. These are listed for people who already own one.

| Board | Notes |
|:------|:------|
| M5 Atom (Lite / Echo / Matrix) | Enclosed. The 3D antenna is much better than generic clones |
| M5 Stamp Pico | Stamp form. Small, still has a 3D antenna |
| Adafruit Huzzah32 | Dev board. Branded, quality control unlike generic ESP32 dev boards |

## Works, with caveats

These boards run ESPresense, but antenna and module QC vary — RSSI from one of these often won't agree with a branded board at the same distance, which makes fleet calibration harder and is a real problem for Companion's room solver. Use one you already own rather than buying a new one. **If a "with caveats" board misbehaves, reproduce on a tier-1 board before opening a firmware issue** — RF problems on a marginal clone look identical to firmware bugs and burn a lot of triage time.

| Board | Caveat | Source |
|:------|:-------|:-------|
| AZDelivery ESP32 NodeMCU (WROOM-32 module on a generic dev board) | Works but no brand QC | [#2334][p] / [#1567][1567], [#1577][1577] |
| Generic D1 Mini ESP32 (Micro-B and USB-C) | Multiple users report working in practice; same no-brand → no-QC caveat on the RF front-end | [#2334][p] / [#162][162] |
| LOLIN D32 ESP32 | Works; unbranded RF caveat | [#2334][p] |
| M5StickC Plus | Built-in battery is a liability for a fixed-in-place node | [#2334][p] |
| [Macchina A0](/nodes/macchina-a0) | Car OBD-II dongle. From v5 it runs the plain `esp32` build with a board template instead of its own flavor | [#2530](https://github.com/ESPresense/ESPresense/pull/2530) |
| SEEEDSTUDIO XIAO ESP32-C3 ([amz/us](https://amzn.to/4e4zCRp), 3-pack) | Runs on the `esp32C3` flavour. One report of a board overheating ([#1364][1364]); use a known-good USB-C cable and a real power supply | [#2334][p] / [#1364][1364] |

## Ethernet and PoE boards

A wired node keeps WiFi out of the way, and a PoE board needs only one cable. Ethernet works on the `esp32` and `esp32s3` builds. Pick the board under **Ethernet Type** on the Network page, or apply the board's [template](/configuration/templates), which also moves I2C off the Ethernet pins ([#2510](https://github.com/ESPresense/ESPresense/issues/2510)). Most of these are original-ESP32 boards, because that's where the Ethernet MAC is.

| Board | Ethernet Type | PoE | Notes |
|:------|:--------------|:----|:------|
| **[Olimex ESP32-POE-ISO](/nodes/olimex-esp32-poe)** | ESP32-POE | 802.3af, isolated | The classic PoE node. Non-ISO version: never plug in USB while on PoE |
| **[Silicognition wESP32](/nodes/wesp32)** | wESP32 Rev7+ (older: WESP32) | 802.3at, isolated | Rock solid, 12 V output. ~$55 plus a $15 programmer |
| **[GL.iNet GL-S10](/nodes/gl-s10)** | GL-inet GL-S10 v2.1 | Yes | Enclosed, external antenna. Open the case once to flash |
| **[Waveshare ESP32-S3-ETH](/nodes/waveshare-esp32-s3-eth)** | Waveshare ESP32-S3-ETH (W5500) | Add-on module | The only S3 option. Native USB, use the `esp32s3-cdc` flavor |
| [LilyGO T-Internet-POE](/nodes/lilygo-t-internet-poe) | LilyGO-T-ETH-POE | 802.3af, isolated | No USB data port; flash with an adapter |
| [LilyGO T-ETH-Lite (ESP32)](/nodes/lilygo-t-eth-lite) | LilyGO-T-ETH-Lite (RTL8201) | Shield | No USB data port. Not the S3 version |
| [WT32-ETH01](/nodes/wt32-eth01) | WT32-ETH01 | No | Cheapest wired node. No USB, some units hang at power-up |
| [EST-PoE-32](/nodes/est-poe-32) | EST-PoE-32 | Low power, not isolated | Often sold out |
| [QuinLED-ESP32 (Ethernet)](/nodes/quinled-esp32) | QuinLED-ESP32 | No | Comes on QuinLED's "with LAN" LED controllers |
| [Espressif ESP32-Ethernet-Kit](/nodes/esp32-ethernet-kit) | KIT-VE | 802.3at board | Dev kit, ~$55 |
| TwilightLord-ESP32 Ethernet Shield | TwilightLord-ESP32 | No | Hobbyist Tindie shield, not currently sold |
| RGB2Go Ethernet module, Athom "IoTorero" Ethernet controller | ESP32Deux | No | LED controllers that use this profile; reuse one if you have it |

## Smart plugs

An ESP32 smart plug flashed with ESPresense is a node that's also a working outlet, and it never needs a USB charger. The relay is driven as an MQTT-controlled LED until the firmware gets a relay output ([#1316](https://github.com/ESPresense/ESPresense/issues/1316)).

| Plug | Chip | Notes |
|:-----|:-----|:------|
| **[SwitchBot Plug Mini (W1901400)](/nodes/switchbot-plug-mini)** | ESP32-C3 | Excellent. Flashes over the air with SwitchbOTA if you haven't taken the v2.x update |
| [Athom Plug V3 (PG03V3-US16A)](/nodes/athom-pg03v3) | ESP32-C3 | Works, but the antenna is weak |

## Steer away

Each of these comes up often enough that it's worth saying plainly:

- **Unbranded "ESP32 dev board" listings (Amazon / AliExpress).** ESPresense uses RSSI as its primary input — every distance estimate and every Companion room solve assumes the fleet's readings agree with each other. Unbranded clones don't have consistent antenna designs even within a single product listing; two boards from the same batch routinely differ by several dB at the same distance, which translates to feet of error in the Companion floor plan. None of that matters for sensor/relay/presence projects like ESPHome, which is why *"these same cheap boards never drop with ESPHome"* is a common (and accurate, but irrelevant) objection — ESPHome isn't doing RSSI distance estimation across a calibrated fleet. The failure mode here is also silent: the board flashes, joins WiFi, reports to MQTT, but its RSSI numbers don't line up with the rest of the fleet and you can't tell whether bad tracking is firmware, calibration, or a bad RF front-end. @maxi1134 separately reports a 40-50% WiFi-retry rate on generic ESP32 dev boards ([#1364][1364], summarised in [#2334][p]). For any node you intend to calibrate against the fleet — and especially for Companion — spend the extra few dollars on a branded board.
- **ESP32-CAM.** Not officially supported. Camera owns most of the GPIOs, tighter RAM, no maintained firmware variant. One community member keeps a fork working with source-side modifications ([#1347][1347]); we don't build for it.
- **ESP32-S2 / ESP8266.** No Bluetooth radio — physically can't run ESPresense.
- **NSPanel as a base station.** Open question. The chip is an ESP32, but no one has reported flashing ESPresense over the stock NSPanel firmware and getting both the touch UI and BT scanning working ([#1335][1335]).

## Power and cabling

### USB-C chargers

* [20W USB-C Wall Charger](https://amzn.to/4kXGphK) — small fast charger with foldable plug
* [20W USB-C Wall Charger (3-pack)](https://amzn.to/4hFLcBz)
* [USB-C Charger (AliExpress)](https://s.click.aliexpress.com/e/_c3xfg629) — listed as 40W; a node only draws a watt or two, so any working charger is plenty

### USB-C to C cables

* [0.5 ft USB-C to C](https://amzn.to/4j02B9f)
* [15 cm USB-C to C, right angle (AliExpress)](https://s.click.aliexpress.com/e/_c32QumGp)

### USB-A chargers

* [Dual USB-A 3-pack](https://amzn.to/4iA0EAq) — compact cube design

### USB-A to C cables

* [10 ft flat, 2-pack](https://amzn.to/4hQ0shc)
* [1 ft braided, 3-pack](https://amzn.to/4emtPqm)
* [6 inch, 5-pack](https://amzn.to/4ia1nu9)
* [Straight adapter 4-pack](https://amzn.to/4hNrh3O)
* [Right-angle adapter 4-pack](https://amzn.to/4bWWH6o)

### USB-A to Micro-B cables

* [0.5 ft Micro USB cable](https://amzn.to/4hzksTa)

## See also

* [Canonical pin #2334][p] — community discussion, raw quotes, source threads
* [Install Firmware](/firmware) — browser-based installer
* [Discord](https://discord.gg/jbqmn7V6n6) — faster human turnaround on board questions

## Footnotes

[^cdc]: Native USB (USB-CDC): the chip talks USB directly, with no separate USB-to-serial chip, so the board is a little cheaper. Nothing to choose when flashing — the browser installer picks the right firmware automatically.

[p]: https://github.com/ESPresense/ESPresense/discussions/2334
[162]: https://github.com/ESPresense/ESPresense/discussions/162
[1335]: https://github.com/ESPresense/ESPresense/discussions/1335
[1347]: https://github.com/ESPresense/ESPresense/discussions/1347
[1364]: https://github.com/ESPresense/ESPresense/discussions/1364
[1567]: https://github.com/ESPresense/ESPresense/discussions/1567
[1577]: https://github.com/ESPresense/ESPresense/discussions/1577
