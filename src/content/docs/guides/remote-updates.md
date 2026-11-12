---
title: Remote updates and Wi-Fi recovery
description: Update ESPresense firmware and change Wi-Fi without climbing up to the node — auto-update, custom URLs, espota, the fallback AP, and MQTT Wi-Fi changes.
sidebar:
  order: 3
---

*How-to · Behavior verified against firmware source [`main` @ `8f9306f`](https://github.com/ESPresense/ESPresense/commit/8f9306f) on 2026-11-10.*

Source: canonical pin [#2321 "OTA updates and WiFi reconfig — without re-flashing"](https://github.com/ESPresense/ESPresense/discussions/2321).

Use this page when the node is already on the wall and you need to update it or move it to another Wi-Fi network without a USB cable. For the individual fields, see the [Network reference](/configuration/network); for every topic, see [MQTT](/configuration/mqtt).

## Pick an update path

| Situation | Use |
|---|---|
| Normal fleet, nodes can reach github.com | [Auto-update](#auto-update) |
| One node, you're in Home Assistant | [Update now](#update-now) |
| Downgrade, self-hosted build, or no GitHub access | [Custom firmware URL](#custom-firmware-url) |
| You built locally and the node is on the same LAN | [espota](#espota) |

## Auto-update

Auto-update is **off by default**. Enable it on the node's **Network** page, from the Home Assistant switch, or over MQTT:

```bash
mosquitto_pub -h homeassistant.local -u <username> -P <password> \
  -t "espresense/rooms/kitchen/auto_update/set" -m "ON"
```

The node then checks the release URL every 15 minutes. A newer build is downloaded and the node reboots into it. Auto-update stays on the same firmware flavor — the flavor name is compiled into the image.

Watch the result on:

```text
espresense/rooms/kitchen/auto_update    ON / OFF
espresense/rooms/kitchen/update_error   last failure, or empty
```

Automatic checks are skipped while free heap is below about 70 KB, so a memory-starved node will not update until it recovers or reboots.

## Update now

In Home Assistant, press the **Update** button entity on the device. It publishes:

```text
espresense/rooms/kitchen/update/set    PRESS
```

`PRESS` is Home Assistant's default MQTT button payload, not a firmware magic value. The updater treats **any value that doesn't start with `http`** as "use the built-in release URL", so all of these do the same thing:

```bash
mosquitto_pub -h homeassistant.local -u <username> -P <password> \
  -t "espresense/rooms/kitchen/update/set" -m "PRESS"
```

The node reboots immediately and updates itself.

The web UI works too: set **Network → Update URL** to `PRESS` (or any non-empty, non-URL value) and reboot. The same field accepts a real URL, which is the next section.

## Custom firmware URL

Publish an `http(s)://` URL to the same topic:

```bash
mosquitto_pub -h homeassistant.local -u <username> -P <password> \
  -t "espresense/rooms/kitchen/update/set" -m "https://github.com/ESPresense/ESPresense/releases/download/v5.0.0b8/esp32.bin"
```

The MQTT form stores the URL and reboots immediately. The web-UI form stores it and updates on the next boot. Use this to downgrade, sideload a custom build, or update nodes that can't reach github.com.

On success the URL is cleared. On failure it is also cleared — the reason is published to `update_error` — so a bad URL does not retry on every boot.

Official images are release assets named `<flavor>.bin`:

https://github.com/ESPresense/ESPresense/releases

Current flavors: `esp32`, `esp32c3`, `esp32c3-cdc`, `esp32c6`, `esp32c6-cdc`, `esp32s3`, `esp32s3-cdc`, plus `-verbose` variants. There is no separate "sensors" flavor in v5.

To switch to another flavor that suits the same chip (for example `esp32c3` to `esp32c3-cdc`), flash it manually or use a custom URL. Auto-update will then keep that flavor. Changing chip family (for example `esp32` to `esp32s3`) requires different hardware.

## espota

espota is the Arduino OTA protocol, implemented natively in v5. It is **off by default**.

1. Enable **Network → Arduino OTA Update** (`arduino_ota`) and reboot the node.
2. Build the image by following the [firmware build instructions](https://github.com/ESPresense/ESPresense/blob/main/BUILDING.md) (`./build.sh esp32`). From the root of a checkout of the [firmware repository](https://github.com/ESPresense/ESPresense) (not this website repo), push it:

```bash
python3 tools/espota.py -i 192.168.1.50 -f build/esp32/espresense.bin
```

There is no OTA password. Leave this off unless you're using it: it is an unauthenticated open port and costs RAM.

## Pre-release builds

Enable **Include pre-release versions in auto-update** (`prerelease`). On a tagged release the node checks `espresense.com/releases/latest-any/download/<flavor>.bin`; on a branch/alpha build it checks `espresense.com/artifacts/latest/download/<branch>/<flavor>.bin`. See [Alpha builds](/alpha).

## When OTA doesn't work

- **Update failed during download or flash** — the node keeps running its current firmware. Check `espresense/rooms/<room>/update_error` for the reason, then try again.
- **New image doesn't boot** — reflash over USB with the [browser installer](/firmware). The installer asks whether to erase; **skipping erase keeps the saved Wi-Fi and MQTT settings**.
- **Node is unreachable after a flavor change** — flash the correct flavor for the board. An ESP32-S3 image on a classic ESP32 will not boot.

## Change Wi-Fi remotely

If the node is still online, write the new credentials over MQTT, then restart it:

```bash
mosquitto_pub -h homeassistant.local -u <username> -P <password> \
  -t "espresense/rooms/kitchen/wifi-ssid/set" -m "NewNetwork"

mosquitto_pub -h homeassistant.local -u <username> -P <password> \
  -t "espresense/rooms/kitchen/wifi-password/set" -m "<new-password>"

mosquitto_pub -h homeassistant.local -u <username> -P <password> \
  -t "espresense/rooms/kitchen/restart/set" -m "ON"
```

The change takes effect on the **next boot**, not immediately. Send both the SSID and the password before restarting; if you change only the SSID and reboot, the node cannot associate and falls back to its configuration AP.

To roll the change out to every node, publish to the literal `*` room. The firmware subscribes to `espresense/rooms/*/+/set`, so this reaches every node:

```bash
mosquitto_pub -h homeassistant.local -u <username> -P <password> \
  -t "espresense/rooms/*/wifi-ssid/set" -m "NewNetwork"
```

Publish the password the same way, then restart the nodes. Do **not** add `-r` (retain) to these commands: the broker would store the Wi-Fi credentials and replay them to every node that reconnects later. If you already published credentials retained, disconnect all affected nodes from the broker first, clear both retained topics with an empty retained publish (`mosquitto_pub ... -r -n -t "espresense/rooms/*/wifi-ssid/set"`, and the same for `wifi-password`), then reconnect the nodes. Never send these empty payloads to connected nodes: they erase saved credentials. If you already did, re-send both intended credentials without retain before any restart.

## Fallback configuration AP

If Wi-Fi is unreachable, the node opens its own access point:

1. At boot it waits `wifi_timeout` seconds (default `60`) for an address.
2. It then starts an AP named `espresense-<room>`. With the default room name (the chip MAC) that looks like `espresense-a1b2c3`.
3. Join it. The captive portal should open; if not, browse to `http://192.168.4.1`.
4. The portal stays up for `portal_timeout` seconds (default `300`), then the node reboots and retries Wi-Fi.

The AP is **open by default**. To secure it, set **Network → Configuration AP Password** (`ap-password`) to an 8–63 character passphrase; the node then uses WPA2. An empty or too-short value leaves the AP open.

If the node is still associated and won't fall back, power down the router/AP for about two minutes. The node's reconnect attempts fail, it reboots, Wi-Fi fails again, and the portal opens.

### Captive-portal networks

ESPresense cannot complete an interactive web login, so it cannot join a hotel, airport, or corporate network that requires a captive-portal sign-in. Use a travel router (for example a GL.iNet) that handles the login and broadcasts a clean WPA2 network, or a phone hotspot.

## Common failures

| Symptom | Cause | Fix |
|---|---|---|
| It never auto-updates | `auto_update` is off (the default), or no outbound HTTPS | Enable it and check `update_error` |
| Update URL field is empty after reboot | Expected — the URL is consumed on success or failure | Check `update_error`, then set the URL again |
| HA **Update** button does nothing | Node offline, or heap too low to run the updater | Check `status`; reboot a heap-starved node |
| Node unexpectedly in AP mode | Wi-Fi unreachable at boot, or reconnect gave up | Join the AP and fix Wi-Fi |
| AP disappeared after a flash | Wrong flavor for the board | Reflash via the [browser installer](/firmware) |
| `wifi-ssid/set` had no effect | Node didn't reboot, or password wasn't sent first | Send both topics, then `restart/set ON` |
| `espota` can't connect | Arduino OTA is off, or the node is on another subnet | Enable `arduino_ota` and check the IP |