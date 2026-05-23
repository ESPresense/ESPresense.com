---
title: MQTT
sidebar:
  order: 99
---


If you end up deploying a fleet of ESP32s in your home, it can quickly become painful to go to each device to update settings.

Any standard MQTT client works for inspecting and updating settings — [MQTT Explorer](https://mqtt-explorer.com) for a GUI, or the `mosquitto_sub` / `mosquitto_pub` CLI tools (they ship with the Mosquitto project but talk to any MQTT broker).


```bash
mosquitto_sub -h homeassistant.local -u <username> -P <password> -v -t "espresense/rooms/kitchen/#"
```

:::note
For configuration of the Companion App also check the [Companion MQTT](/companion/installation/#mqtt-setup) section.
:::

## Topic shape

The firmware uses one base topic prefix, `espresense`, hard-coded as the `CHANNEL`. Everything below that is built up from your room slug:

```
espresense/rooms/<room>/<key>           # node-side state / settings (retained)
espresense/rooms/<room>/<key>/set       # write a setting (publish to this)
espresense/rooms/<room>/telemetry       # JSON metrics (non-retained)
espresense/rooms/<room>/status          # online / offline (LWT, retained)
espresense/devices/<id>/<room>          # per-device distance (when pub_devices=on)
espresense/settings/<id>/config         # global device-config (Companion writes here)
```

`<room>` is the room name, slugified (uppercase/spaces are normalised to a slug).

A `<room>` of `*` matches every node and is the recommended way to roll a setting out to a fleet. Publish with the **retain** flag set on `*` topics and newly-joining nodes will also pick up that setting at startup.

## Reading current settings

When a node connects, it publishes a retained snapshot of its current settings under `espresense/rooms/<room>/...`. Subscribe to the room to see them:

```text
espresense/rooms/study/status        online
espresense/rooms/study/name          Study
espresense/rooms/study/max_distance  16.0
espresense/rooms/study/absorption    2.7
espresense/rooms/study/tx_ref_rssi   -59
espresense/rooms/study/rx_adj_rssi   0
espresense/rooms/study/query
espresense/rooms/study/include       apple:aaaayyyy iBeacon:232323
espresense/rooms/study/exclude       sonos:xxxx sonos:yyyy
espresense/rooms/study/known_macs    aabbccddeeff 112233445566
espresense/rooms/study/known_irks
espresense/rooms/study/count_ids
espresense/rooms/study/auto_update   OFF
espresense/rooms/study/prerelease    OFF
espresense/rooms/study/arduino_ota   OFF
```

Sensor and GPIO state (when configured) also appears under the same room prefix — see [Published topics](#published-topics) below.

## Updating settings

Publish to `<key>/set` to change a setting on one node:

```bash
mosquitto_pub -h homeassistant.local -u <username> -P <password> \
  -t "espresense/rooms/kitchen/auto_update/set" -m "ON" -d
```

Use a room of `*` to update every ESPresense node at once. Add `-r` (retain) and new nodes joining later will apply the same value on first boot:

```bash
mosquitto_pub -h homeassistant.local -u <username> -P <password> \
  -t "espresense/rooms/*/absorption/set" -m "3.0" -r
```

## Settings reference

### Core BLE

| Setting | Type | Default | Description |
|---|---|---|---|
| `max_distance` | float (0–100) | `16.0` | Maximum distance (m) to report. Devices computed beyond this are dropped. |
| `absorption` | float (1–5) | `2.7` | Environmental absorption / path-loss factor. Higher = signal attenuates faster. |
| `skip_distance` | float (0–10) | `0.5` | Report immediately if the beacon has moved more than this (m). |
| `skip_ms` | integer (0–3000000) | `5000` | Skip reporting if the message is younger than this (ms). Reduces MQTT chatter. |
| `max_divisor` | integer (2–10) | `10` | Maximum divisor for the report interval. Larger movements divide `skip_ms` to report sooner. |
| `forget_ms` | integer (0–3000000) | `150000` | Forget (drop) a fingerprint if not seen for this long (ms). **Boot only** — not in the `Command()` dispatcher; writes to `<room>/forget_ms/set` are ignored. Set in the captive portal / Settings page and reboot. |
| `max_fingerprints` | integer (16–2048) | `100` (`200` on ESP32-S3/C3/C6) | Maximum number of tracked BLE fingerprints. **Boot only.** |

### Calibration (RSSI)

| Setting | Type | Default | Description |
|---|---|---|---|
| `ref_rssi` | integer (-100 to 100) | `-65` | RSSI expected from a 0 dBm transmitter at 1 m. **Not** used for iBeacon / Eddystone (those carry their own calibrated RSSI). |
| `tx_ref_rssi` | integer (-100 to 0) | `-59` | RSSI expected from this node's iBeacon transmit power at 1 m. |
| `rx_adj_rssi` | integer (-100 to 100) | `0`* | Per-node receive RSSI adjustment. Use only when this board has a known-weak (or known-strong) antenna. <br>*Default `20` on bare ESP32-S3 builds; `0` on M5STICK and M5ATOM (even when S3-based — those board defines are matched before `ESP32S3` in `include/defaults.h:79-95`) and `0` on every other variant. |

See [Calibration](/guides/calibration) for the full procedure.

### Scanning / filtering

| Setting | Type | Default | Description |
|---|---|---|---|
| `include` | string | `""` | Whitespace-separated allow-list of device id prefixes. If set, ONLY matching ids are published. Example: `apple:iphone10-6 apple:iphone13-2`. |
| `exclude` | string | `""` | Whitespace-separated deny-list of device id prefixes. Filtered out before publish. Example: `exp:20 apple:iphone10-6`. |
| `known_macs` | string | `""` | Whitespace-separated BLE MACs (no colons, lowercase) treated as stable ids. Useful for devices that advertise a random-but-static MAC. Published as `known:<mac>`. |
| `known_irks` | string | `""` | Whitespace-separated 32-hex-character IRKs for resolving Apple random-resolvable MACs into a stable id. See [Apple devices](/apple) for how to extract them. |
| `query` | string | `""` | Whitespace-separated id prefixes to **actively connect** to over BLE and ask for Room Assistant / model / name characteristics. Example: `flora:` for Mi Flora plant sensors. |
| `requery_ms` | integer seconds (30–3600) | `300` | How often to re-issue active queries against matched devices. **Boot only.** |
| `connect_all` | ON / OFF | `OFF` | Allow active BLE connections to **every** device, bypassing the `query` filter. Intended for advanced debugging only — connecting to everything is expensive and can starve the scanner. |

### Counting

The count feature publishes a sensor with the number of unique devices currently within the count window. Useful when you can't fingerprint individuals but the population count itself is informative (e.g. `exp:20` COVID exposure apps, generic `apple:`).

Only `count_ids` is live-settable over MQTT. The three hysteresis knobs are read once at boot — set them in the captive portal / Settings page and reboot.

| Setting | Type | Default | Description |
|---|---|---|---|
| `count_ids` | string | `""` | Whitespace-separated id prefixes to count. |
| `count_enter` | float (0–100) | `2.0` | Start counting a device once it's closer than this (m). **Boot only.** |
| `count_exit` | float (0–100) | `4.0` | Stop counting once it's farther than this (m). Higher than `count_enter` creates hysteresis to prevent flapping. **Boot only.** |
| `count_ms` | integer ms (0–3000000) | `10000` | Stop counting a device if its last advertisement is older than this. **Boot only.** |

### Network / MQTT

These are configured at boot (over the captive portal / Network page) and **cannot** be set live over MQTT — restart-flashing only.

| Setting | Type | Default | Description |
|---|---|---|---|
| `wifi-ssid` | string | (empty) | Wi-Fi SSID. Can also be re-written via MQTT (`<room>/wifi-ssid/set`). |
| `wifi-password` | string | (empty) | Wi-Fi password. Same MQTT setter as above. |
| `wifi_timeout` | integer seconds | `60` | Seconds to wait for Wi-Fi before falling back to the captive portal. `-1` = wait forever. |
| `portal_timeout` | integer seconds | `300` | Seconds to keep the captive portal up before rebooting and retrying Wi-Fi. |
| `mqtt_host` | string | (build default) | MQTT broker hostname or IP. SSL is not supported. |
| `mqtt_port` | integer | `1883` | MQTT broker port. |
| `discovery` | checkbox | `ON` | Publish Home Assistant MQTT-discovery payloads on connect. |
| `discovery_prefix` | string | `homeassistant` | Home Assistant discovery prefix. Only change if your HA install uses a non-default prefix. |
| `pub_tele` | checkbox | `ON` | Publish to `<room>/telemetry` (uptime, free heap, scan counters, etc.). |
| `pub_devices` | checkbox | `ON` | Publish per-device distances to `espresense/devices/<id>/<room>` (the flat per-device topic shape). |

### Updates / OTA

| Setting | Type | Default | Description |
|---|---|---|---|
| `auto_update` | ON / OFF | `OFF` | Check GitHub for new firmware on a 15-minute interval and auto-flash if available. |
| `prerelease` | ON / OFF | `OFF` | Include pre-release builds when auto-checking. |
| `arduino_ota` | ON / OFF | `OFF` | Enable the Arduino OTA protocol (espota / PlatformIO). Keep off for less RAM use and a smaller attack surface. |
| `update` | string URL | `""` | If set, the node fetches firmware from this URL on next boot. Cleared after a successful update. |

### Motion / Switch / Button

Pin assignments live on the [Hardware](/configuration/hardware) page; the timeouts can be tuned at runtime.

| Setting | Type | Default | Description |
|---|---|---|---|
| `pir_timeout` | float seconds (0–300) | `0.5` | PIR debounce / hold time after the last trigger. |
| `radar_timeout` | float seconds (0–300) | `0.5` | Radar debounce / hold time after the last trigger. |
| `switch_1_timeout` | float seconds (0–300) | `0.5` | Switch One debounce. |
| `switch_2_timeout` | float seconds (0–300) | `0.5` | Switch Two debounce. |
| `button_1_timeout` | float seconds (0–300) | `0.5` | Button One debounce. |
| `button_2_timeout` | float seconds (0–300) | `0.5` | Button Two debounce. |

### Commands

| Topic | Payload | Action |
|---|---|---|
| `<room>/restart/set` *(or `reboot/set`)* | (any) | Restart the node immediately. |
| `<room>/name/set` | string | Rename the room. Slugified to form the device id. Empty payload resets to the MAC. |
| `<room>/enroll/set` | `id\|name` or `name` or `PRESS` | Enter BLE enrollment mode for 2 minutes. See [Apple devices → Enrollment](/apple/#enrollment-easiest). |
| `<room>/cancelEnroll/set` | (any) | Leave enrollment mode immediately. |

## Published topics

All topics under `espresense/rooms/<room>/...` are retained unless noted.

### Status

| Topic | Payload | Notes |
|---|---|---|
| `status` | `online` / `offline` | LWT — `offline` is published automatically on disconnect. |
| `name` | string | Current room display name. |
| `telemetry` | JSON | Non-retained. Includes `uptime`, `freeHeap`, scan counters, and `count` when `count_ids` is set. |

### Settings snapshot (on connect)

Republished retained when the node comes back online so a fresh subscriber sees the current values:

`max_distance`, `absorption`, `tx_ref_rssi`, `rx_adj_rssi`, `query`, `include`, `exclude`, `known_macs`, `known_irks`, `count_ids`, plus updater state (`auto_update`, `prerelease`, `arduino_ota`) and per-input timeouts when those sensors are enabled.

### GPIO sensors

Published when the corresponding pin is configured ([Hardware](/configuration/hardware)):

| Topic | Payload | Notes |
|---|---|---|
| `pir` | `ON` / `OFF` | Raw PIR state. |
| `radar` | `ON` / `OFF` | Raw radar state. |
| `motion` | `ON` / `OFF` | Logical OR of pir + radar. Use this in Home Assistant automations. |
| `switch_1`, `switch_2` | `ON` / `OFF` | Individual switch state. |
| `switch` | `ON` / `OFF` | Logical OR of both switches. |
| `button_1`, `button_2` | `ON` / `OFF` | Individual button state. |
| `button` | `ON` / `OFF` | Logical OR of both buttons. |

### LEDs

When a configured LED has **LED Control = MQTT** ([Hardware → MQTT LED control](/configuration/hardware/#mqtt-led-control-v40)):

| Topic | Payload | Notes |
|---|---|---|
| `led_1`, `led_2`, `led_3` | JSON state | Published when the LED changes. |
| `led_1/set`, `led_2/set`, `led_3/set` | JSON command | See the LED control example below. |

### Per-device topics

When `pub_devices` is on (default), each tracked device is published to a flat topic under `espresense/devices/`:

```
espresense/devices/<device-id>/<room>          # JSON: id, distance, rssi, name, …
espresense/devices/<device-id>/<room>/<report> # individual sub-reports (rare)
```

Payloads are non-retained. The top-level topic carries a single JSON object — the same shape `GET /json/devices` returns for one device. `<device-id>` is whatever the node settled on (`apple:iphone15-3`, `irk:…`, `known:…`, `iBeacon:…`, etc.). This is the topic shape Home Assistant's `mqtt_room` integration consumes.

### Subscribed topics

The firmware subscribes to three topics on connect:

| Topic | Used for |
|---|---|
| `espresense/rooms/*/+/set` | Fleet-wide setting writes (the `*` wildcard). |
| `espresense/rooms/<this-room>/+/set` | Per-node setting writes. |
| `espresense/settings/+/config` | Device-level enrollment configs published by the Companion (or by `POST /json/configs`). The `+` is the device id; the payload is the same JSON used by [REST `/json/configs`](/configuration/rest-api/#postjson-configs). |

## Examples

### Filter to only track Apple devices

```bash
mosquitto_pub -h homeassistant.local -u <username> -P <password> \
  -t "espresense/rooms/kitchen/include/set" -m "apple:"
```

### Set maximum distance to 10 meters

```bash
mosquitto_pub -h homeassistant.local -u <username> -P <password> \
  -t "espresense/rooms/kitchen/max_distance/set" -m "10.0"
```

### Enable auto-update on every node (and new joiners)

```bash
mosquitto_pub -h homeassistant.local -u <username> -P <password> \
  -t "espresense/rooms/*/auto_update/set" -m "ON" -r
```

### Adjust RSSI for a node with a weak antenna

```bash
mosquitto_pub -h homeassistant.local -u <username> -P <password> \
  -t "espresense/rooms/kitchen/rx_adj_rssi/set" -m "10"
```

### Start enrollment for a new device

```bash
mosquitto_pub -h homeassistant.local -u <username> -P <password> \
  -t "espresense/rooms/kitchen/enroll/set" -m "myphone:abcdef|My Phone"
```

### Update absorption everywhere

```bash
mosquitto_pub -h homeassistant.local -u <username> -P <password> \
  -t "espresense/rooms/*/absorption/set" -m "3.0" -r
```

### Control an MQTT-mode LED

```bash
mosquitto_pub -h homeassistant.local -u <username> -P <password> \
  -t "espresense/rooms/kitchen/led_1/set" \
  -m '{"state":"ON","brightness":64,"color":{"r":255,"g":128,"b":0}}'
```

Accepted JSON keys: `state` (`ON`/`OFF`), `brightness` (0–255), `color.r`/`g`/`b`, `white_value` (0–255), `color_temp`, and `effect`. Supported keys depend on the LED's color mode.

---

*Last verified against firmware v4.0.6 (`main` @ d9a1765, 2026-05-10).*
