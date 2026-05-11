---
title: Enrolling devices
description: Per-device enrollment recipes — what works, what doesn't, and where the community has not settled a path.
sidebar:
  order: 2
---

*How-to · Last verified against firmware [v4.0.6](https://github.com/ESPresense/ESPresense/releases/tag/v4.0.6) on 2026-05-11.*

Some devices Just Work — drop in a [Blue Charm beacon](/devices) and ESPresense finds it. Others need an IRK, a setting flipped in a vendor app, or a workaround that the community has spent years arguing about. This page is the per-device recipe sheet, scoped to the recipes that have actually been confirmed in [Discussions](https://github.com/ESPresense/ESPresense/discussions).

Source matrix: canonical pin [#2324 "Enrolling devices: what works, what doesn't, and where to look"](https://github.com/ESPresense/ESPresense/discussions/2324) by [@Terastar-Paperclip](https://github.com/Terastar-Paperclip).

## 30-second triage

| Device | Path | Status |
|---|---|---|
| iPhone / iPad | Pair to ESPresense node, IRK auto-captured | ✅ Settled |
| iPhone (iOS 17+, in-firmware pair fails) | Mac → Keychain Access fallback | ✅ Settled (fallback) |
| Apple Watch | `BluetoothLE` companion app pair, then verify there's one entry not two | ⚠️ Mixed — read [the section](#apple-watch) |
| Apple Watch (alternative) | Mac → Keychain Access fallback | ✅ Settled (fallback) |
| AirPods / BeatsX / HomePod | none | ❌ No settled path |
| Withings ScanWatch | Android HCI snoop → Wireshark → IRK | ✅ Settled (involved) |
| Polar HR straps (H10 / H9) | Broadcast HR mode on, generic `name:` enrollment | ✅ Works |
| Polar Loop (2025) | none | ❌ No settled path |
| Moto Tag / Galaxy SmartTag / Find-My-network | none | ⚠️ Limited; identifier rotates |
| Android phones | HA Companion app `ble_transmitter` | ✅ Settled |
| Amazfit / Mi Band / Zepp watches | Vendor app → enable Discoverable | ✅ Settled |

If your device is **not** in the table, start at [/devices](/devices) for the known-working list. If it advertises an [iBeacon](/devices) or Eddystone profile, no enrollment is needed — the firmware picks it up on first sight.

## iPhone

**Source:** [#1348](https://github.com/ESPresense/ESPresense/discussions/1348) · existing recipe lives on [/apple](/apple). Confirmed by [@DTTerastar](https://github.com/DTTerastar) (maintainer) and multiple users.

The settled path is to put the firmware in enrollment mode and pair the phone over BLE. The phone exchanges its IRK during the secure pairing handshake; the firmware reads it from the BLE bond store and publishes a retained config to MQTT.

1. Open `http://<node-ip>/ui/#/devices` on the same network as the node.
2. Type a friendly name (e.g., `dt-phone`) in the **Enroll** field and click **Enroll**. The node starts advertising a Heart Rate Monitor service named `ESPresense` for 120 seconds.
3. On the iPhone: **Settings → Bluetooth**. Tap the new `ESPresense` entry and accept the secure pairing prompt.
4. The enroll prompt clears automatically. The firmware publishes:

   ```text
   espresense/settings/irk:<32-hex>/config   (retained)
   {"id": "dt-phone", "name": "dt-phone"}
   ```

5. Other nodes pick up the retained config and resolve the same iPhone the next time it advertises.

:::tip[Why this is the easy path]
The firmware reads the IRK directly from the NimBLE bond store after `READ_ENC` authentication, then deletes the bond. You don't ever see the raw key.
:::

### iOS 17+ fallback (Mac Keychain)

A subset of iPhones on iOS 17+ accept the pair but never deliver the IRK to the firmware ([#1348](https://github.com/ESPresense/ESPresense/discussions/1348), tracked). The settled fallback is to read the IRK out of iCloud Keychain on a paired Mac. The full procedure (Keychain Access → search `bluetooth` → `Public: XX:XX:...` → Show Password) is on [/apple → Lookup Method](/apple/#lookup-method-requires-a-mac). The decoded 32-character hex IRK goes into the same `espresense/settings/irk:<hex>/config` topic as above.

### iPhone screen-off tracking

**Source:** [#492](https://github.com/ESPresense/ESPresense/discussions/492). Partial — not a calibration knob. The community has *not* settled this.

iPhones suppress nearby BLE advertisements when locked unless something on the device has a reason to talk. Reports:

- [@DTTerastar](https://github.com/DTTerastar): "My iPhone blasts out nearby info every 500ms no matter what" — works without intervention on his unit.
- [@51av0sh](https://github.com/51av0sh): a paired Apple Watch keeps the phone broadcasting for ~20 minutes after lock.
- [@huytd2k](https://github.com/huytd2k): installing the `room-assistant` iOS app keeps it advertising.
- Universal Clipboard / Handoff, iCloud Family Sharing, and iCloud Photo backup have all been reported to keep an iPhone broadcasting through lock — none of them is a guaranteed fix.

If you hit this, the IRK enrollment is not the problem. Add an Apple Watch on the same Apple ID, or accept a "presence with hysteresis" approach in Home Assistant.

## Apple Watch

**Source:** [#2099](https://github.com/ESPresense/ESPresense/discussions/2099) · existing recipe on [/apple](/apple/#apple-watch-using-bluetooth-terminal-app). Reported by [@prankhd](https://github.com/prankhd); community has *not* settled this.

:::caution[Limited — no fully-settled solution]
Apple Watch enrollment works for some users via the [Bluetooth Terminal](https://apps.apple.com/app/id1058693037) companion app's watchOS pair flow, and works for others via Settings → Bluetooth → ESPresense directly. The same procedure produces different results across watchOS versions and watch models. We do not have a procedure that works for every reader.
:::

The shape of the problem from [#2099](https://github.com/ESPresense/ESPresense/discussions/2099):

- The native **Settings → Bluetooth → ESPresense** path sometimes pairs but skips the secure-connection prompt that delivers the IRK — you end up with the watch as an unresolved entry.
- Some users see **two** entries appear: a "static" entry that lives at one position on the floorplan and a "moving" entry that tracks the watch. Only the moving one is the real IRK-backed identity; the other is the pre-resolution fingerprint.
- The Bluetooth Terminal companion app's watchOS BluetoothLE view sometimes refuses to initiate pairing if a prior attempt failed. Force-quit the watchOS app, toggle Bluetooth off and on, relaunch — covered in detail at [/apple → Apple Watch troubleshooting](/apple/#apple-watch-using-bluetooth-terminal-app).

**What to do today:**

1. Try [/apple → Apple Watch (using Bluetooth Terminal App)](/apple/#apple-watch-using-bluetooth-terminal-app) first.
2. If it produces two entries, the moving one is the right one. Delete the static one.
3. If neither path works, use the **Mac Keychain fallback** ([/apple → Lookup Method](/apple/#lookup-method-requires-a-mac)) — read the watch's IRK from your iCloud Keychain. The watch's Bluetooth MAC is at **Watch → Settings → About**.

If you find a watchOS-version-specific recipe that works reliably, please add it to [#2099](https://github.com/ESPresense/ESPresense/discussions/2099) — the canonical pin is updated from confirmed Discussions content.

## AirPods / BeatsX / HomePod

**Source:** [#1531](https://github.com/ESPresense/ESPresense/discussions/1531). Contributors: [@DrSpaldo](https://github.com/DrSpaldo), [@dxmnkd316](https://github.com/dxmnkd316), [@nonanonymousanon](https://github.com/nonanonymousanon).

:::caution[Limited — no settled solution]
AirPods and other accessory-class Apple Continuity devices do not expose an IRK over the GAP pairing flow ESPresense uses, and their advertising addresses rotate. There is no settled recipe for tracking a *specific* pair of AirPods today.
:::

What's true:

- AirPods are visible in the fingerprints list as `apple:0707:<len>` or similar Continuity payloads — but multiple sets of AirPods produce the same fingerprint, so they're not uniquely identifiable.
- [@dxmnkd316](https://github.com/dxmnkd316) reports their AirPods kept the same Bluetooth address for ~8 hours instead of the expected ~15 minutes. Address persistence appears generation- and firmware-dependent, so even pinning by MAC is unreliable.
- macOS-extracted IRKs *can* sometimes be obtained for AirPods Pro 2 and later (the same `Public: XX:XX:...` Keychain entry trick as iPhone), but the success rate varies and the key may stop resolving after a firmware update.

If you need "is somebody wearing their AirPods" presence, an `apple:0707:*` *count* over time can be useful as a soft signal, but don't wire it to identity.

## Withings ScanWatch

**Source:** [#1247](https://github.com/ESPresense/ESPresense/discussions/1247). Contributors: [@ginkel](https://github.com/ginkel) (asker), [@max00346](https://github.com/max00346) (procedure), [@rkrkrk0987](https://github.com/rkrkrk0987) (Android 15 path), [@wanghuangjie](https://github.com/wanghuangjie) (MQTT example), [@vincenttor](https://github.com/vincenttor) (Wireshark help).

Withings devices don't pair to the ESPresense node — they pair only to the Withings app, which lives on the phone. The settled path is to capture the pairing handshake on an Android phone you control, extract the IRK from the HCI snoop log, and publish it manually.

**You will need:** an Android phone with developer options, a USB cable, [`adb`](https://developer.android.com/tools/adb), and [Wireshark](https://www.wireshark.org/).

1. **Android → Settings → System → Developer options.** Turn on:
   - **Enable Bluetooth HCI snoop log** (a.k.a. "Bluetooth Debugging to File" on some OEM skins)
   - **USB debugging**
2. **Pair the ScanWatch to that Android phone** through the Withings app. Wear the watch close enough that the pairing actually completes.
3. **Pull the bug report:**

   ```bash
   adb bugreport scanwatch
   ```

   The output is a `.zip`.
4. **Find the HCI log** inside the zip at `FS/data/log/bt/*_hci.log` (Android 14 and below) or `FS/data/misc/bluetooth/logs/*` (Android 15+, per [@rkrkrk0987](https://github.com/rkrkrk0987)).
5. **Open the log in Wireshark.** Filter on `btsmp`. Find the **Identity Information** packet — that's the IRK delivered by the watch during the secure-pairing handshake.
6. **Copy the 32-character hex IRK** out of the packet (little-endian — Wireshark shows it big-endian for some captures; if resolution fails, byte-reverse).
7. **Publish to MQTT** with **retain**:

   ```text
   espresense/settings/irk:<32-hex>/config   (retained)
   {"id": "scanwatch", "name": "Withings ScanWatch"}
   ```

Same `irk:` topic shape as the iPhone path — once it's published retained, every ESPresense node in the deployment picks it up.

## Polar

**Source:** [#2054 "Polar loop compatibility?"](https://github.com/ESPresense/ESPresense/discussions/2054). Asker: [@jacksaturn](https://github.com/jacksaturn). The community has *not* validated the 2025 Polar Loop.

### Polar HR straps (H10, H9, Verity Sense)

These work when **Broadcast Heart Rate** is enabled in Polar Flow / Polar Beat. With broadcast on, the strap advertises with a stable BLE MAC and a recognizable manufacturer/service signature, and ESPresense fingerprints it as `name:polar-h10-…` (or similar — the kebabified BLE-advertised name). Enroll exactly like a generic named device:

```text
espresense/settings/name:polar-h10-12345678/config   (retained)
{"id": "polar-strap", "name": "Polar H10"}
```

Same caveat as Garmin Instinct Solar on [/devices](/devices): the strap only broadcasts while Heart Rate Broadcast is on. If you take it off and put it back, broadcast is off until you turn it on again.

### Polar Loop (2025)

:::caution[Limited — no settled solution]
Nobody has reported a working enrollment for the 2025 Polar Loop strap on the [#2054](https://github.com/ESPresense/ESPresense/discussions/2054) thread or elsewhere. If you have one and want to help, post your fingerprint output to [#2054](https://github.com/ESPresense/ESPresense/discussions/2054) — the strap may or may not advertise consistently outside the Polar app's reach.
:::

## Moto Tag / Galaxy SmartTag / Find-My-network

**Source:** canonical pin [#2324](https://github.com/ESPresense/ESPresense/discussions/2324). Greenfield — the community has *not* settled a path.

:::caution[Limited — identifier rotates]
Devices on Apple's Find-My or Google's Find-My-Device networks rotate their advertised identifiers as part of the protocol's privacy design. ESPresense fingerprints them as `apple:findmy` or `smarttag:<payload-len>`, but the identifier you see in 10 minutes is not the identifier you saw 10 minutes ago — and *every* SmartTag advertises an `apple:findmy`-shaped payload, so you can't distinguish one tag from another. This is by design, not a firmware bug.
:::

What you can do:

- **Count, don't identify.** A rolling count of distinct `apple:findmy` MACs near a node can tell you "more than usual" but not "Bob's tag is here."
- **Track the carrier, not the tag.** If the tag rides in your bag and your phone is in your pocket, track the phone via IRK.
- **OpenHaystack beacons:** if you flash an ESP32 or an nRF as an [OpenHaystack tag](https://github.com/acalatrava/openhaystack-firmware/tree/main/apps/openhaystack-alternative), the BLE address is *yours* — pin it in ESPresense by MAC like any other beacon. This is on [/devices](/devices).

Apple AirTags are explicitly on the [/devices](/devices#known-to-not-work) "known to not work" list for individual tracking. Galaxy SmartTags are listed as "randomized mac addresses."

## Android phones

**Source:** [/android](/android) · [#880](https://github.com/ESPresense/ESPresense/discussions/880) (asker [@moblsu](https://github.com/moblsu), thread unanswered).

Android does not deliver an IRK to a non-bonded peripheral and rotates the BLE MAC. The settled path is to run the **Home Assistant Companion App** with **BLE Transmitter** enabled — the phone broadcasts an iBeacon with a UUID you choose, and ESPresense fingerprints that UUID as a stable identity.

1. Install [Home Assistant Companion App](https://companion.home-assistant.io/docs/core/sensors/#bluetooth-sensors) on the phone.
2. In the app: **Settings → Manage Sensors → BLE Transmitter → enable.** Optionally configure the UUID (default is per-device).
3. Whitelist the app from battery optimization (Android will kill it otherwise).
4. ESPresense sees the phone as an iBeacon-shaped identity. Enroll it the same way you would any iBeacon — by the UUID/major/minor.

:::tip[The fingerprint format gotcha]
[@moblsu](https://github.com/moblsu) in [#880](https://github.com/ESPresense/ESPresense/discussions/880) flagged that the BLE Transmitter UUID shows up with underscores in HA but ESPresense displays it with hyphens (`1dXXXX16-481e-4579-8b35-ffcXXXXXX758_100_1` vs. `…-…-100-1`). When matching the device in Home Assistant automations, you may need a `replace('_', '-')` template — or vice versa.
:::

Beacon Scope (standalone Android app, [Play Store](https://play.google.com/store/apps/details?id=com.davidgyoungtech.beaconscanner)) is the alternative if you don't run Home Assistant.

## Amazfit / Mi Band / Zepp watches

**Source:** [#1202](https://github.com/ESPresense/ESPresense/discussions/1202). Contributor: [@SteveDockar](https://github.com/SteveDockar).

These devices keep a static BLE MAC and fingerprint as `mifit:<mac>`. The catch is they don't pair to ESPresense — you have to flip them to broadcast and then write the config to MQTT yourself.

1. **In the Zepp / Mi Fitness app:** Profile → watch/band → **Bluetooth visibility** (also labeled "Discoverable" on some models): **on**. Without this, the watch only talks to a paired phone and ESPresense never sees it.
2. **Find the fingerprint.** Open `http://<node-ip>/ui/#/devices` and look for a `mifit:<mac>` entry that appears when the watch is nearby.
3. **Publish a retained config** to MQTT:

   ```text
   espresense/settings/mifit:<aa:bb:cc:dd:ee:ff>/config   (retained)
   {"id": "amazfit-balance", "name": "Amazfit Balance"}
   ```

4. The device now shows up as `amazfit-balance` across every node in the deployment.

Confirmed working units from the community: Amazfit Balance, Band, Bip S, Bip 3 Pro, GTS 2 Mini, GTS 4 Mini, GTR 2e, Xiaomi Mi Band. Full list on [/devices](/devices).

:::tip[Why MQTT and not the UI Enroll button?]
The UI Enroll button captures an IRK from a secure-pairing handshake. Mi Band / Amazfit watches don't pair to ESPresense (the BLE service they expose is locked to the Zepp app), so there's no handshake to capture. Writing the `mifit:<mac>` config directly tells the firmware "this MAC is this identity" and skips the pairing step entirely.
:::

## After enrollment

Whatever path got you here, the device should now show up under its friendly name at:

- `http://<node-ip>/ui/#/devices` (per-node view)
- `espresense/devices/<id>/<room>` MQTT topic (RSSI + distance per node)
- Companion's device list, if you run it

If distances look off, head to [Calibration](/guides/calibration) — that's where to fix RSSI@1m, per-node offsets, and absorption. Enrollment only gets the device *seen*; calibration is what makes distances *accurate*.

If you find a working recipe for a device that's flagged ⚠️ or ❌ above, please post to the linked Discussion. The matrix at the top is maintained from confirmed community reports — your one-line "this worked for me" is what moves a device from ⚠️ to ✅.

## Reference

- Canonical pin: [#2324 Enrolling devices: what works, what doesn't, and where to look](https://github.com/ESPresense/ESPresense/discussions/2324)
- Known-working device list: [/devices](/devices)
- Apple IRK details and `IrkDecode` form: [/apple](/apple)
- Android app options: [/android](/android)
- MQTT settings topic schema: [/configuration/mqtt](/configuration/mqtt)
- Calibration once the device is enrolled: [/guides/calibration](/guides/calibration)
