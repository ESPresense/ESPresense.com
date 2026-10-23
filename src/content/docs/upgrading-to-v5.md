---
title: Upgrading from v4 to v5
description: What v5 converts for you when it first starts after a v4 node upgrades, what's left to do, and the order to do it in.
---

v5 is a rewrite on ESP-IDF, with a new web UI. It installs over v4 like any other update. The flash layout is the same, so the node keeps its stored settings, and a node with **Automatically update** on will move to v5 by itself once v5 is the latest release.

On its first start, v5 converts the settings it stores differently, once. Most nodes need nothing more than the Home Assistant changes below. Board-specific v4 firmware needs its board template.

:::note
This page describes v5.0.0.
:::

## Update the Companion first

v5 nodes report and calibrate differently: device reports carry `rssi` and `rawRssi` instead of `rxAdj`, and the receiver setting is `rx_offset_rssi` instead of `rx_adj_rssi` (see [Receiver offset](#receiver-offset)). If you run the [ESPresense Companion](/companion/), update it to a version that supports v5 firmware **before** upgrading your nodes. An older Companion can't see a v5 node's receiver offset, and its calibration goes wrong on nodes that have one.

## What carries over

Room name, WiFi, MQTT, Home Assistant discovery, auto-update, and every setting on the Settings page (scanning, querying, counting, filtering, calibration) stay as they were. Sensor settings stay too: I2C sensor addresses and buses, DHT, DS18B20 and HX711 pins.

## What v5 converts for you

These happen on the node's first start on v5, for any node that was set up before (WiFi or Ethernet configured). The node's log shows each one as `Settings converted for v5: ...`.

### LEDs, motion, buttons and switches

v4 kept these as separate settings (`led_1_pin`, `pir_pin`, `button_1_type`, ...); v5 has **LEDs** and **Inputs** lists on the Hardware page. v5 builds the lists from the v4 settings:

- each LED keeps its pin, type, count and control. An LED you turned off on v4 stays off.
- a PIR becomes an input named **PIR** with role **Motion**, a radar one named **Radar** (also Motion), and buttons and switches **Button 1**, **Switch 1** and so on, each with its pin type and timeout.

Check the Hardware page afterwards.

### I2C pins

v4 had default I2C pins; v5 has none. If a node has an I2C sensor on bus 1, v5 sets v4's default for each bus 1 pin that was never set, so the sensor keeps reporting as it did on v4:

| Chip | Bus 1 SDA / SCL |
|:--|:--|
| ESP32, ESP32-S3 | 21 / 22 |
| ESP32-C3 | 19 / 18 |

The board-specific v4 builds had other defaults (below); their board template sets the right pins.

### Receiver offset

v4 and the early v5 betas used `rx_adj_rssi`, which was **subtracted** from every reading, and defaulted to +20 on the ESP32-S3. v5 uses **`rx_offset_rssi`**, which is **added** (+5 means "this node reads 5 dB weak") and defaults to 0 on every chip. v5 converts the value: `rx_offset_rssi = -rx_adj_rssi`, using +20 on an S3 that never had it set. Distances don't change.

- MQTT `rx_adj_rssi/set` still works for now, as a deprecated alias: the node stores the negated value.
- Device reports carry `rssi` (corrected by the offset) and `rawRssi` (the same reading before it), and no longer `rxAdj` or `rxOffset`.
- If you downgrade to v4 later, the node uses its calibration from before v5. A calibration changed on v5 doesn't carry back.

## What you need to do

### Home Assistant entities

v4 published one `motion` sensor plus `button`, `switch`, `pir` and `radar` sensors. v5 publishes one binary sensor per input, `input_1`, `input_2` and so on, named after the input. A motion input gets the motion device class. After upgrading:

- point automations that used any of the v4 `motion`, `pir`, `radar`, `button` or `switch` entities at the new input entities;
- delete the old entities in Home Assistant, which stop updating.

LEDs keep their entities (`led_1`, ...).

### LED brightness

v5 caps every LED at a `max_brightness` of 64 of 255 unless you set one. v4 only capped addressable LEDs, at 100 on most boards, so LEDs are dimmer after upgrading. For full brightness, set **Max brightness** to 255 on the Hardware page.

## Board-specific v4 firmware

v4 had separate builds for some boards (`m5stickc`, `m5stickc-plus`, `m5atom`, `macchina-a0`) with their pins built in. v5 has one build per chip; boards are set up with a [template](/configuration/templates) instead. The `m5stickc`, `m5stickc-plus` and `m5atom` updates install the plain `esp32` build, which can't tell which board it is on, so apply the board's template right after upgrading. The template also corrects I2C pins the conversion may have set to the plain `esp32` defaults.

- **M5StickC Plus** and **M5StickC:** apply the [M5StickC Plus template](/nodes/m5stickc-plus). Until you do, the default status LED on GPIO 2 drives the M5StickC Plus's buzzer, and the AXP192 power chip isn't read. The template has no status LED; v4 used the red LED on GPIO 10 (PWM Inverted), which you can add back. v4's defaults were I2C bus 1 on 32 / 33 and bus 2 on 21 / 22.
- **M5 Atom:** v4 drove the LEDs on GPIO 27 (25 of them, for the Matrix) and read the button on GPIO 39. Apply this template, with `count` set to 25 on an Atom Matrix and 1 on an Atom Lite. Keep `max_brightness` at 40 on the Matrix so it doesn't overheat: that's the ceiling M5Stack's own library uses (v4 used 50). The [M5 Atom Matrix page](/nodes/m5atom-matrix) has the full Matrix template:

  ```json
  {"name": "M5 Atom", "chip": "esp32", "settings": {"leds": [{"type": "grb", "pin": 27, "count": 25, "control": "status", "max_brightness": 40}], "inputs": [{"name": "Button", "role": "button", "pin": 39, "type": "floating_inverted"}], "I2C_Bus_1_SDA": 26, "I2C_Bus_1_SCL": 32, "I2C_Bus_2_SDA": 25, "I2C_Bus_2_SCL": 21}}
  ```

- **Macchina A0:** v5 has no `macchina-a0` update, so auto-update leaves it on v4. Install the `esp32` build with the [browser installer](/firmware), then apply the [Macchina A0 template](/nodes/macchina-a0).

## ESP32-C6 node IDs

If you ran an ESP32-C6 on a v5 beta before v5.0.0b3, it gets a new node ID once after updating ([ESPresense#2553](https://github.com/ESPresense/ESPresense/pull/2553)). It shows up in Home Assistant and the Companion as a new node; remove the old one. v4 had no ESP32-C6 build.

## Upgrade checklist

1. Update the [Companion](/companion/) to a version that supports v5 firmware, if you use it.
2. On v4, take a screenshot of the Hardware and Settings pages, to compare with afterwards.
3. Update the node: let auto-update run, update from the Companion, or use the [browser installer](/firmware).
4. If it ran board-specific v4 firmware (M5StickC, M5 Atom, Macchina A0), apply its board's [template](/nodes/).
5. Check the Hardware page: LEDs, inputs and I2C pins. Raise **Max brightness** if you want LEDs brighter.
6. In Home Assistant, move automations to the new input entities and delete the stale ones.

Plugs and other sealed devices can only be updated over the air. Leave them powered until the update finishes and the node is back online.
