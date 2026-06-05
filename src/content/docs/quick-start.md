---
title: Quick Start
description: End-to-end tutorial — go from a fresh ESP32 to your phone showing in the right room in Home Assistant.
sidebar:
  order: 2
---

Follow this tutorial to take one ESP32 from "in the box" to "Home Assistant knows my phone is in this room." It's a guaranteed-success path, not a survey of options — work through it top to bottom and don't skip steps.

If you want to compare the simple per-room approach (this tutorial) against the precise floor-plan approach (Companion), read [Approaches](/approach) first. This tutorial sets up the simple per-room approach — one node, one room.

## What you'll build

A single ESPresense node, sitting on USB power in one room, reporting your phone to Home Assistant. When you carry your phone out of range, Home Assistant flips the room sensor from "in this room" back to "away." When you carry it back, it flips again.

That's the "wow moment." Once you have it working for one room with one phone, the [calibration guide](/guides/calibration) and the [Home Assistant integration page](/integrations/home-assistant) show you how to scale it across the house.

### What to expect

* **Room-level presence is reliable** once you have one node per room and have completed calibration.
* **Sub-meter coordinate accuracy** is a separate, harder problem (3+ nodes per floor with line-of-sight, plus per-node calibration). That's the Companion path, not this tutorial.
* Expect to spend **30–45 minutes** on this tutorial the first time, most of it waiting for the firmware to flash and for Home Assistant to auto-discover the node.

## What you'll need

| Item | Notes | Approximate cost |
|---|---|---|
| **M5 Atom S3 Lite** | The board we recommend for first-time users. Better Bluetooth range than the cheaper alternatives, ships in a small enclosure (you don't see the bare PCB), and the web installer auto-picks the right firmware. Buy on [Amazon](https://amzn.to/4v3qPFm) or [AliExpress](https://s.click.aliexpress.com/e/_oFSxCND); [manufacturer specs](https://docs.m5stack.com/en/core/AtomS3%20Lite). | ~$15 |
| **USB-C cable, data-capable** | The cable that ships in some chargers is power-only and will not work for flashing. A short cable from a phone or laptop accessory is the safe bet. See the [USB-C cables list in Nodes](/nodes#usb-c-to-c-cables). | (already have one) |
| **USB-C wall charger, 5V** | After flashing, the node lives on a wall outlet. Any phone charger is fine. See [USB-C chargers](/nodes#usb-c-chargers). | ~$8 |
| **A computer running Edge or Chrome** | The browser installer needs WebSerial, which means Edge or a Chromium-based browser (Chrome, Brave, Arc). Firefox and Safari will not work. | (already have one) |
| **A running Home Assistant** with the [Mosquitto broker add-on](https://www.home-assistant.io/integrations/mqtt/#setting-up-a-broker) installed. | This tutorial assumes Home Assistant already has MQTT running. If you don't have an MQTT broker yet, install Mosquitto from the Home Assistant **Settings → Add-ons → Add-on Store** before continuing. | (free) |
| **An iPhone or iPad to track** | Apple devices have a one-click enrollment flow ([Enrollment](/apple#enrollment-easiest)) that the tutorial uses. Android works too — see the [Android beacon apps list](/android) — but the path is less consistent, so use Apple for your first run if you have one. | (already have one) |

:::caution[Don't substitute hardware on your first run]
**Avoid generic / unbranded "ESP32 dev board" listings on Amazon or AliExpress for your first node.** They often flash and connect fine, but their WiFi and Bluetooth front-ends vary wildly. When the results are bad, you won't know whether it's the firmware or the hardware — and that's the worst possible debugging experience for someone new to the project. Stick with the M5 Atom S3 Lite for this tutorial; once you have a working baseline, you can experiment.
:::

## Step 1 — Flash the firmware

1. Plug the M5 Atom S3 Lite into your computer with the USB-C cable.
2. Open the [Install Firmware](/firmware) page in **Edge or Chrome**.
3. Click **Connect**. A browser prompt asks which serial port to use — pick the one that appeared when you plugged in the board. On macOS it usually shows up as `usbmodem…`; on Windows as a new `COM` port; on Linux as `/dev/ttyACM0`.
4. The installer detects the chip (ESP32-S3) and shows the matching firmware build. Click **Install ESPresense** and wait for the progress bar to finish (about a minute).
5. When flashing completes, the LED on the board changes colour and the device reboots into the **first-boot captive portal**.

If the installer doesn't see the board:

* Check the cable — phone cables that ship with chargers are often power-only. Try a known-good data cable.
* On Windows, close any running serial-port apps (Arduino IDE, PlatformIO, MQTT Explorer's serial tab).
* If you're on Linux and the port doesn't appear at all, your user may need to be in the `dialout` group. Log out and back in after running `sudo usermod -a -G dialout $USER`.

For more on flashing edge cases and nightly builds, see [Install Firmware](/firmware) and [Alpha builds](/alpha).

## Step 2 — Connect ESPresense to your network

Once the device reboots after flashing, it broadcasts its own Wi-Fi access point so you can configure it.

1. On your phone or laptop, **disconnect from your normal Wi-Fi** and join the new network that starts with `ESPresense-`. There is no password.
2. Your device should pop up a captive-portal browser window automatically. If it doesn't, open `http://192.168.4.1` in a browser.
3. Fill in the form:

   | Field | What to enter |
   |---|---|
   | **Room name** | A short room name like `Office`, `Kitchen`, `Living Room`. This is the room this node will represent. |
   | **Wi-Fi SSID** | Your home Wi-Fi network. The **Available Networks** dropdown shows what the node can see. Pick a 2.4 GHz network — the ESP32 can't see 5 GHz networks. |
   | **Wi-Fi Password** | Your Wi-Fi password. |
   | **Server** | Your MQTT broker hostname. If you're running Mosquitto as an add-on inside Home Assistant, this is your Home Assistant hostname — most installations resolve to `homeassistant.local` over mDNS. |
   | **Port** | `1883`. |
   | **Username** / **Password** | Your MQTT broker credentials, if you set any. If you're using the Mosquitto add-on's default setup, this is the same as a Home Assistant user/password that has MQTT permission. |

   Leave every other field at its default for now.

4. Click **Save** and let the device reboot. It joins your home Wi-Fi, and the captive portal disappears. Reconnect your laptop/phone to your normal Wi-Fi.

The full list of fields on this screen is documented in [Network configuration](/configuration/network) — come back to it if you need to change the room name later, set up an Ethernet PoE board, or change MQTT credentials.

:::note
MQTT credentials are sent in **plaintext** — ESPresense does not support TLS. Only use this on a trusted home network, and don't reuse a password you care about.
:::

## Step 3 — Confirm the node appeared in Home Assistant

If MQTT auto-discovery is enabled in Home Assistant (it is by default), the node shows up as a new device within seconds of finishing Step 2.

1. In Home Assistant, go to **Settings → Devices & Services → MQTT**.
2. Click **devices** at the bottom.
3. You should see a new device named after the room you chose in Step 2 (`Office`, `Kitchen`, …). It comes with several entities — a connectivity sensor (online / offline), **Uptime** and **Free Mem** diagnostics, a **Restart** button, **Max Distance** and **Absorption** numbers, an **Enroll** button, plus auto-update controls when enabled in settings.

If the device doesn't appear after about a minute:

* Make sure the Mosquitto add-on is running and the MQTT integration in Home Assistant is configured against it.
* On your computer, install [MQTT Explorer](https://mqtt-explorer.com) (or use the **MQTT → Configure → Listen to a topic** UI inside Home Assistant) and subscribe to `espresense/#`. You should see retained settings appear under `espresense/rooms/<your-room>/...`. If you don't see anything, the node either isn't reaching the broker (network problem) or has bad credentials — power-cycle the board and watch the captive portal come back up if Wi-Fi failed.
* Read the [data-flow diagram](/troubleshooting/data-flow) — it shows what should be talking to what at this point.

Once the device is in Home Assistant, plug the M5 Atom into a wall outlet **in the room you named** (`Office`, etc.) and leave it there for the rest of the tutorial.

## Step 4 — Calibrate the node (quick pass)

Calibration matters because BLE devices broadcast at different power levels, and antennas on different boards receive differently. Without calibration, the distances ESPresense reports are arbitrary numbers — they may work for room-level presence (which is all this tutorial needs), but they get more reliable once you've calibrated.

For your first node, do the minimum:

1. Open the node's web UI: `http://<room-name>.local` (the slugified room name — `office.local`, `kitchen.local`). If mDNS doesn't resolve, use the IP address shown in Home Assistant's device page.
2. Click **Settings**.
3. Scroll to the **Calibration** section. Leave `RSSI adjustment for receiver` at `20` — that's the default for ESP32-S3 boards and compensates for the on-chip antenna.
4. Leave `RSSI expected from a 0dBm transmitter at 1 meter` at `-65` and `Factor` at `2.7` for now. These defaults work for most environments.

That's it for the first pass — the defaults are reasonable. Once you have more than one node, come back to [Calibration](/guides/calibration) and do the full per-node procedure so distances are consistent across rooms.

## Step 5 — Enroll your phone

To track a specific Apple device reliably, you "enroll" it with ESPresense. Enrollment captures the device's **Identity Resolving Key (IRK)** so ESPresense can recognise the device even after its Bluetooth MAC rotates (which iOS does periodically for privacy).

1. In the node's web UI, click **Devices**, or visit `http://<room-name>.local/ui/#/devices`.
2. In the **Name** field at the top, type a stable name for your phone — for example `dans-iphone`. No spaces. This is the id Home Assistant will use.
3. Click **Enroll**. The page shows a countdown — ESPresense is now advertising itself as a Bluetooth pairing target for the next ~2 minutes.
4. On your iPhone or iPad, open **Settings → Bluetooth**. Wait a few seconds; a device called `ESPresense` appears in the list.
5. Tap it. iOS asks if you want to pair — accept.
6. The countdown on the ESPresense page stops. Your device now shows in the **Configured Devices** list with the name you chose.

That's it — the IRK is captured and synced to every other ESPresense node on your MQTT broker, so you only have to do this once per phone, not once per room.

For the Apple Watch path, the Lookup method (extract IRK from a Mac's Keychain), or troubleshooting tips for pairing, see [Apple devices → Enrollment](/apple#enrollment-easiest).

For **Android phones**, ESPresense relies on a beacon app emitting a stable iBeacon UUID instead of enrollment — see [Android](/android) for the recommended apps. Set one up, give it a UUID, and Home Assistant will see that UUID as the device id in the steps below.

## Step 6 — Watch your phone appear in Home Assistant

Auto-discovery handles the node. For per-device tracking, you tell Home Assistant which device IDs to follow with the `mqtt_room` integration.

1. In Home Assistant, open **Settings → Devices & Services → Helpers** (or edit `configuration.yaml` directly).
2. Add the following to `configuration.yaml`. Replace `dans-iphone` with the name you used in Step 5:

   ```yaml
   sensor:
     - platform: mqtt_room
       device_id: "dans-iphone"
       name: "Dan's iPhone room"
       state_topic: "espresense/devices/dans-iphone"
       timeout: 10
       away_timeout: 120
   ```

3. Restart Home Assistant (**Developer Tools → Check Configuration → Restart**).
4. Pick up your phone, walk it into the room where the M5 Atom is sitting, and wait about 10 seconds. The new `Dan's iPhone room` sensor should show the room name you configured in Step 2.
5. Walk the phone two rooms away (or put it in a metal cabinet — anything that breaks line-of-sight). Wait `away_timeout` seconds (120 by default). The sensor flips to `not_home`.

Walk back. The sensor flips back to the room name.

**That's the wow moment.** Use that sensor in any Home Assistant automation — `if Dan's iPhone room is "Office" then turn on the office lamp`, anything you can think of.

## You've got one room working. Now what?

* **Add more nodes.** Repeat steps 1–4 for a node in every room you want presence detection in. (Step 5 doesn't repeat — your phone's IRK is already known to the fleet.) Once you have 2+ nodes, the `mqtt_room` integration picks the **nearest** room as the device's location.
* **Calibrate for accuracy.** With more than one node, distances need to be consistent between them. Walk through the [Calibration guide](/guides/calibration) once everything's deployed.
* **Track more devices.** Re-run Step 5 for each Apple device. For Android, give each phone a unique iBeacon UUID and add another `mqtt_room` block.
* **Enable auto-update.** In the node's web UI, **Settings → Updates**, turn on **Automatically update**. Each node checks for new firmware on a 15-minute interval and flashes itself when there's a release.
* **Try precise positioning.** If room-level isn't enough — for example, you want to know which side of the kitchen you're standing on — install the [Companion](/companion) and follow its [installation guide](/companion/installation).
* **Read the architecture.** [Data flow](/troubleshooting/data-flow) is a short diagram that shows you which piece is talking to which. Saves time the next time something doesn't work.

## When something doesn't work

* **The web installer can't connect.** Wrong cable, wrong browser, or another app is holding the serial port. See Step 1.
* **The captive portal never appeared.** Forget the `ESPresense-…` network on your laptop/phone, power-cycle the board, and rejoin. Or open `http://192.168.4.1` directly.
* **The node doesn't show up in Home Assistant.** MQTT credentials, broker hostname, or auto-discovery setting. See Step 3 troubleshooting.
* **Distances look completely wrong (e.g. "15 meters" for a phone next to the board).** This is normal *before* calibration. The defaults are reasonable for room-level presence; if you want better numbers, work through [Calibration](/guides/calibration).
* **The room sensor flaps between rooms.** Your `away_timeout` may be too short. Bump it from 120 to 300 seconds in `configuration.yaml`.
* **The serial terminal would help right now.** Plug the board into USB and open [the in-browser terminal](/troubleshooting/terminal). It shows live BLE detections and any errors the firmware logs.

For everything else, the [Troubleshooting section](/troubleshooting/data-flow) and the [GitHub Discussions](https://github.com/ESPresense/ESPresense/discussions) are the places to look. Search before posting — most first-run problems have been answered before.

<!-- Last verified against firmware v4.0.6 on 2026-05-10 with an M5 Atom S3 Lite, a Home Assistant 2026.4 install running the Mosquitto add-on, and an iPhone 15 enrolled via the UI flow. -->
<!-- Post-merge friction checkpoint 2026-06-05 (ESPA-114): no organic friction reported in the 2-week window after this tutorial shipped (2026-05-22 → 2026-06-05). GitHub Discussions + the CM watch were clean for every section (flashing, discovery, calibration, HA wiring). Still verified against firmware v4.0.6 (current latest release). -->

