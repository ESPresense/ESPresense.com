---
title: Templates
description: Board templates for ESPresense nodes. Paste one to set a board's pins and Ethernet type in one go, or export your own to share.
sidebar:
  order: 5
---

A board template sets a board up in one go: its LED, button and sensor pins and, on Ethernet boards, its Ethernet type. Each [board page](/nodes/) has one to copy.

This needs firmware with [ESPresense#2531](https://github.com/ESPresense/ESPresense/pull/2531).

## Applying a template

1. Open the node's web UI and choose **Templates** in the sidebar (under Hardware).
2. Paste the template into the **Board Template** box.
3. Click **Preview**. It lists every setting that will change.
4. Click **Apply**.

## Format

```json
{"name": "M5Stack NanoC6", "chip": "esp32c6", "settings": {"led_1_pin": 20, "led_pwr_pin": 19, "...": "..."}}
```

* **`name`** is the board the template is for.
* **`chip`** is required, written as the lowercase chip target: `esp32`, `esp32c3`, `esp32c6` or `esp32s3` (not `ESP32-C6`, and not a firmware flavor like `esp32c3-cdc`). The node rejects a template made for a different chip, because the wrong pin numbers can land on flash GPIOs.
* **`settings`** holds setting names from any page of the web UI: [Network](/configuration/network) (for example `eth`, the Ethernet type), [Settings](/configuration/settings) or [Hardware](/configuration/hardware). Only the keys listed are changed. Board pages list unused pins as -1, so applying one gives the same result whatever was set before.
* Passwords (`wifi-password`, `ap-password`, `mqtt_user`, `mqtt_pass`) and saved LED state can't be set from a template.
* The node rejects the whole template if a key isn't a setting it knows, or a value is the wrong type or out of range. Dropdowns are option numbers (for `eth`, 1 is WT32-ETH01 and 14 is Waveshare ESP32-S3-ETH), pins are -1 to 48, booleans are `true`/`false`, and I2C addresses are strings (`"0x38"`).

## Sharing your board

**Export as template** on the Templates page saves `espresense-template.json`. It holds the Hardware page settings and Ethernet type, and only values that differ from the defaults. Room, WiFi, MQTT and scanning settings are never exported, so the file is safe to share. It leaves out `name`, so add the board's name before you share it.
