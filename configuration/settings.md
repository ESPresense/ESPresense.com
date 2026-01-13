---
layout: page
title: Settings
permalink: /configuration/settings
parent: "Configuration"
nav_order: 2
---

# Settings

These settings are accessible by clicking "Click here to edit other settings!" at the bottom of the initial configuration page.

<div class="clearfix" markdown=1>

<img src="/images/full_settings.png" alt="Screenshot of ESP32 full settings interface" style="float:right;margin-left:20px;width:300px">

## Scanning

* Request scan results (this makes the ESP actively ask every advertisement for an additional SCAN RESULT). *Experimental* you should leave off unless you really want all the extra traffic
* Known BLE mac addresses - If you have a device that uses a random ble mac BUT it doesn't actually change the mac periodically you can just put it here and we'll use the id `known:{mac}`
* Query - we use the best id we can figure out based on passively listening to device advertisements, but sometimes you want an even better id. Query enables the ESP to connect to the device and ask it questions. Currently we ask for the room assistant id, model, and name. If we get useful answers back we will upgrade the id to the most selective one.

## Counting

This is a beta feature, it is for the usecase where a device fingerprint doesn't come up with a unique device but you can gleen useful info from the number of unique macs that are currently broadcasting within a certain distance of the base station. This is most useful for exp:20 (covid exposure apps), apple: (apple devices), or msft:cdp (microsoft devices). Once configured auto discovery will add a Count sensor to your ESPresense device.

* Include device ids - ids to count
* Start counting/stop counting (meters) - instead of a HARD line we support allowing a device to "enter" once it gets below a certain distance and only leave when going above a different larger distance. If you set them to the same value you'll get the HARD line
* Include device with age less than - Since we're just getting stateless advertisements we also need the device to "LEAVE" if not seen within a certain amount of time

## Filtering

* Include only sending these ids to mqtt - Just like it says, if set ONLY ids that match this come to mqtt
* Exclude sending these ids to mqtt - If set will filter out just these ids
* Maximum distance to report - If the distance is over 16 meters, it's probably crap and not worth even including in a trilaterization attempt, so don't bother sending to mqtt
* Skip reporting if not seen (in milliseconds) / report early if beacon has moved more than this distance. The basic logic is if i've reported this recently check out how long it's been and how far we've moved. If it's been > than the distance here it will report. If its over the skip reporting ms then we'll send the report with whatever the current distance is.

## Calibration

These settings control how ESPresense interprets signal strength. See the full [Calibration](calibration) guide for detailed steps and examples, including how to use the RSSI adjustment for receiver to balance different antennas or dev boards.

* RSSI expected from a 0dBm transmitter at 1 meter - Reference RSSI for non-calibrated devices.
* Factor used to account for absorption, reflection, or diffraction - Adjusts for walls and other obstacles.
* RSSI adjustment for receiver - Per-node offset to align RSSI across different antennas or hardware.
* Forget beacon if not seen for (in milliseconds) - How long to keep idle devices before removing them.

For LED and GPIO sensor configuration (PIR motion, radar motion, switches, buttons), see the [Sensors](sensors) page.

</div>