---
layout: page
title: Settings
permalink: /configuration/settings
parent: "Configuration"
nav_order: 2
---

# Settings

These settings are accessible from the **Settings** page in the device web UI.

<div class="clearfix" markdown=1>

<img src="/images/settings_screen.png" alt="Screenshot of ESP32 full settings interface" style="float:right;margin-left:20px;width:340px">

## Scanning
* Known BLE mac addresses (no colons, space separated) - If you have a device that uses a random ble mac BUT it doesn't actually change the mac periodically you can just put it here and we'll use the id `known:{mac}`
* Known BLE identity resolving keys, should be 32 hex chars space separated
* Forget beacon if not seen for (in milliseconds) - How long to keep idle devices before removing them.

## Querying
We use the best id we can figure out based on passively listening to device advertisements, but sometimes you want an even better id. Query enables the ESP to connect to the device and ask it questions. Currently we ask for the room assistant id, model, and name. If we get useful answers back we will upgrade the id to the most selective one.

* Query device ids for characteristics (eg. flora:)
* Requery interval in seconds

## Counting
This is a beta feature, it is for the usecase where a device fingerprint doesn't come up with a unique device but you can gleen useful info from the number of unique macs that are currently broadcasting within a certain distance of the base station. This is most useful for exp:20 (covid exposure apps), apple: (apple devices), or msft:cdp (microsoft devices). Once configured auto discovery will add a Count sensor to your ESPresense device.

* Include id prefixes (space separated)
* Start counting devices less than distance (in meters) - "Enter" distance: device counts when closer than this.
* Stop counting devices greater than distance (in meters) - "Leave" distance: device stops counting when further than this. Setting this higher than the start distance creates a hysteresis zone to prevent rapid toggling.
* Include devices with age less than (in ms) - Since we're just getting stateless advertisements we also need the device to "LEAVE" if not seen within a certain amount of time.

## Filtering
* Include only sending these ids to mqtt (eg. apple:iphone10-6 apple:iphone13-2) - If set ONLY ids that match this come to mqtt.
* Exclude sending these ids to mqtt (eg. exp:20 apple:iphone10-6) - If set will filter out just these ids.
* Maximum distance to report (in meters) - If the distance is over this value (default 16m), it's likely inaccurate and not worth including in trilateration.
* Report early if beacon has moved more than this distance (in meters) - If the device moves more than this distance, report immediately.
* Skip reporting if message age is less that this (in milliseconds) - The logic is: if reported recently, check time elapsed and distance moved. If moved > "Report early" distance, report immediately. If time elapsed > "Skip reporting" time, report regardless of movement.

## Calibration
These settings control how ESPresense interprets signal strength. See the full [Calibration](/guides/calibration) guide for detailed steps and examples, including how to use the RSSI adjustment for receiver to balance different antennas or dev boards.

* RSSI expected from a 0dBm transmitter at 1 meter (NOT used for iBeacons or Eddystone) - Reference RSSI for non-calibrated devices.
* RSSI adjustment for receiver (use only if you know this device has a weak antenna) - Per-node offset to align RSSI across different antennas or hardware.
* Factor used to account for absorption, reflection, or diffraction - Adjusts for walls and other obstacles (Environmental Factor).
* RSSI expected from this tx power at 1m (used for node iBeacon)

For LED and GPIO sensor configuration (PIR motion, radar motion, switches, buttons), see the [Hardware](hardware) page.

</div>