---
title: Upgrading from v4 to v5
description: What carries over from ESPresense v4, what you need to set again after upgrading to v5, and how to do it.
---

v5 is a rewrite on ESP-IDF, with a new web UI. It installs over v4 like any other update. The flash layout is the same, so the node keeps its stored settings, and a node with **Automatically update** on will move to v5 by itself once v5 is the latest release.

Most settings carry over, but a few need attention. Before you upgrade, take a screenshot of the node's settings pages, so you have the old values to hand.

:::note
This page describes v5.0.0b3.
:::

## What carries over

Room name, WiFi, MQTT, Home Assistant discovery, auto-update, and every setting on the Settings page (scanning, querying, counting, filtering, calibration) stay as they were. Sensor settings stay too: I2C sensor addresses and buses, DHT, DS18B20 and HX711 pins.

## What you need to set again

### LEDs, motion, buttons and switches

v4 kept these as separate settings (`led_1_pin`, `pir_pin`, `button_1_type`, ...). v5 has **LEDs** and **Inputs** lists on the Hardware page instead and doesn't read the v4 settings. After upgrading, add them again on the Hardware page. The choices have the same names as in v4 (PWM Inverted, Addressable GRB, Pullup Inverted, Floating, ...). A v4 PIR or radar becomes an input with role **Motion**, a button one with role **Button**, and a switch one with role **Switch**.

A generic ESP32 board starts with v4's default LED (PWM on GPIO 2, showing status), so only LEDs you changed in v4 need setting again.

### I2C pins

v4 had default I2C pins; v5 has none. If you never set the SDA and SCL pins yourself, the I2C bus is off after upgrading, and your sensors stop reporting even though their settings are still there. Set the pins on the Hardware page, or apply your board's [template](/configuration/templates). These were v4's defaults:

| v4 firmware | Bus 1 SDA / SCL | Bus 2 SDA / SCL |
|:--|:--|:--|
| `esp32`, `esp32s3` | 21 / 22 | off |
| `esp32c3` | 19 / 18 | off |
| `m5stickc`, `m5stickc-plus` | 32 / 33 | 21 / 22 |
| `m5atom` | 26 / 32 | 25 / 21 |

### Home Assistant entities

v4 published one `motion` sensor plus `button`, `switch`, `pir` and `radar` sensors. v5 publishes one binary sensor per input, `input_1`, `input_2` and so on, named after the input. A motion input gets the motion device class. After upgrading:

- point automations that used any of the v4 `motion`, `pir`, `radar`, `button` or `switch` entities at the new input entities;
- delete the old entities in Home Assistant, which stop updating.

LEDs keep their entities (`led_1`, ...).

## Board-specific v4 firmware

v4 had separate builds for some boards (`m5stickc`, `m5stickc-plus`, `m5atom`, `macchina-a0`) with their pins built in. v5 has one build per chip; boards are set up with a [template](/configuration/templates) instead. The `m5stickc`, `m5stickc-plus` and `m5atom` updates install the plain `esp32` build, which doesn't know the board, so apply the board's template right after upgrading.

- **M5StickC Plus** and **M5StickC:** apply the [M5StickC Plus template](/nodes/m5stickc-plus). Until you do, the default status LED on GPIO 2 drives the M5StickC Plus's buzzer, and the AXP192 power chip isn't read. The template has no status LED; v4 used the red LED on GPIO 10 (PWM Inverted), which you can add back.
- **M5 Atom:** v4 drove the LEDs on GPIO 27 (25 of them, for the Matrix) and read the button on GPIO 39. Apply this template, with `count` set to 25 on an Atom Matrix and 1 on an Atom Lite. Keep `max_brightness` at 50 on the Matrix, as v4 did, so it doesn't overheat:

  ```json
  {"name": "M5 Atom", "chip": "esp32", "settings": {"leds": [{"type": "grb", "pin": 27, "count": 25, "control": "status", "max_brightness": 50}], "inputs": [{"name": "Button", "role": "button", "pin": 39, "type": "floating_inverted"}], "I2C_Bus_1_SDA": 26, "I2C_Bus_1_SCL": 32, "I2C_Bus_2_SDA": 25, "I2C_Bus_2_SCL": 21}}
  ```

- **Macchina A0:** v5 has no `macchina-a0` update, so auto-update leaves it on v4. Install the `esp32` build with the [browser installer](/firmware), then apply the [Macchina A0 template](/nodes/macchina-a0).

## ESP32-C6 node IDs

If you ran an ESP32-C6 on a v5 beta before v5.0.0b3, it gets a new node ID once after updating ([ESPresense#2553](https://github.com/ESPresense/ESPresense/pull/2553)). It shows up in Home Assistant and the Companion as a new node; remove the old one. v4 had no ESP32-C6 build.

## Upgrade checklist

1. On v4, take a screenshot of the Hardware and Settings pages.
2. Update: let auto-update run, update from the [Companion](/companion/), or use the [browser installer](/firmware).
3. Apply your board's [template](/nodes/), if it has one. Templates set the I2C pins, LEDs and buttons.
4. Add any other LEDs and inputs on the Hardware page, and set I2C pins if the template didn't.
5. In Home Assistant, move automations to the new input entities and delete the stale ones.

Plugs and other sealed devices can only be updated over the air. Leave them powered until the update finishes and the node is back online.
