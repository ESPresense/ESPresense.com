---
title: Templates
description: Board and add-on templates for ESPresense nodes. Paste one to set a board's pins and Ethernet type, or an add-on sensor's settings, in one go, or export your own to share.
sidebar:
  order: 5
---

A board template sets a board up in one go: its LED, button and sensor pins and, on Ethernet boards, its Ethernet type. Each [board page](/nodes/) has one to copy.

An add-on template sets up something plugged into the board, such as the [M5Stack ENV IV](/addons/m5stack-env-iv) sensor. It holds only that add-on's settings, so one template works on every board.

Importing templates needs firmware v5.0.0b1 or later, a pre-release from the [releases page](https://github.com/ESPresense/ESPresense/releases). Board templates use the v5 hardware settings ([ESPresense#2530](https://github.com/ESPresense/ESPresense/pull/2530)), so a node on v4 can't import them.

## Applying a template

1. Open the node's web UI and choose **Templates** in the sidebar (under Hardware).
2. Paste the template into the **Board Template** box.
3. Click **Preview**. It lists every setting that will change.
4. Click **Apply**.

## Format

```json
{"name": "M5Stack NanoC6", "chip": "esp32c6", "settings": {"leds": [{"type": "grb", "pin": 20, "count": 1, "control": "status"}], "outputs": [{"name": "LED power", "pin": 19, "type": "high"}], "...": "..."}}
```

* **`name`** is the board the template is for.
* **`chip`** is the lowercase chip target: `esp32`, `esp32c3`, `esp32c6` or `esp32s3` (not `ESP32-C6`, and not a firmware flavor like `esp32c3-cdc`). It's required when the template sets a pin, because pin numbers mean different things on each chip, and the node rejects a template made for a different chip. A template with no pins (an add-on's sensor address and bus) can leave it out. Firmware up to v5.0.0b2 requires it on every template, and doesn't check pins.
* **`settings`** holds setting names from any page of the web UI: [Network](/configuration/network) (for example `eth`, the Ethernet type), [Settings](/configuration/settings) or [Hardware](/configuration/hardware). Only the keys listed are changed. `leds`, `inputs`, `outputs` and `power` are JSON values that replace the whole list. Board pages always include the three lists, empty if the board has none, so applying one gives the same result whatever was set before.
* Passwords (`wifi-password`, `ap-password`, `mqtt_user`, `mqtt_pass`) and saved LED state can't be set from a template.
* The node rejects the whole template if a key isn't a setting it knows, a value is the wrong type or out of range, or a pin can't work on this chip: one it doesn't have, one used by the flash or PSRAM, or an input-only pin (GPIO 34–39 on the ESP32) for an LED, output or I2C bus. The Hardware page's Save refuses the same pins. (Pin checks need firmware newer than v5.0.0b2.) Dropdowns are option numbers (for `eth`, 1 is WT32-ETH01 and 14 is Waveshare ESP32-S3-ETH), pins are -1 to 48, booleans are `true`/`false`, and I2C addresses are strings (`"0x38"`).

## Add-on templates

An add-on template holds only the add-on's own settings, with no `name` and no `chip`:

```json
{"settings": {"SHT_I2c_Bus": 1, "BMP280_I2c_Bus": 1, "BMP280_I2c": "0x76"}}
```

Templates only change the settings they name, so they stack. Apply the board's template first; on boards with a GROVE port it makes that port I2C bus 1. Then apply the add-on's. Leave out `name`: the node stores a template's name as the board's name. Add-on templates need firmware newer than v5.0.0b2 ([ESPresense#2555](https://github.com/ESPresense/ESPresense/pull/2555)).

## Sharing your board

**Export as template** on the Templates page saves `espresense-template.json`. It holds the Hardware page settings and Ethernet type, and only values that differ from the defaults. Room, WiFi, MQTT and scanning settings are never exported, so the file is safe to share. It leaves out `name`, so add the board's name before you share it.
