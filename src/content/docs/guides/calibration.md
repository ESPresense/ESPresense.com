---
title: Calibration
sidebar:
  order: 1
---


Calibrating your ESPresense nodes helps each device estimate distance consistently, even when they use different antennas or are installed in different rooms. These settings are accessible from the Settings view in the device web UI.

<img src="/images/calibration_screen.png" alt="Calibration section of the ESPresense settings UI" style="float:right;margin-left:20px;width:360px" />

## Quick calibration procedure

1. Pick a **reference node** that will stay at its default **RSSI adjustment for receiver** of `0` and set it up in an open area.
2. Place a beacon that transmits **exactly 0 dBm** one meter away and record the average RSSI reported by the reference node.
3. Enter that value in **RSSI expected from a 0dBm transmitter at 1 meter** on every node that will track non-calibrated devices.
4. For each additional node, compare its reading of the same beacon at the same location and adjust **RSSI adjustment for receiver** as described below until its reported RSSI matches the reference node.
5. If the signal passes through walls or dense materials between rooms, increase the **Factor** slightly (for example, from `2.55` to `3.0`) and test whether calculated distances align better with reality.
6. Repeat the measurements in a second location to confirm the offsets before rolling the settings out across your deployment.

## RSSI expected from a 0dBm transmitter at 1 meter

This value establishes the reference point for devices that do not broadcast a calibrated `rssi@1m` (for example, many non-beacon wearables). To determine it:

1. Use a beacon transmitting at exactly 0 dBm.
2. Place the beacon 1 meter away from the ESP32.
3. Observe the RSSI reading on the Settings page and record the average value.
4. Enter that number as the reference.

Devices that already advertise `rssi@1m` keep their own calibration; others use this reference plus any additional adjustments below.

## Factor used to account for absorption, reflection, or diffraction

This factor adjusts for walls, furniture, or other environmental obstacles between rooms. Higher numbers assume more attenuation; lower numbers assume minimal obstruction. Increase the factor if reported distances are too small when signals pass through dense materials (brick, concrete, metal framing).

## RSSI adjustment for receiver

Different ESP32 boards and external antennas can report RSSI differently, even with identical firmware settings. The **RSSI adjustment for receiver** value is an offset (in dB) applied to *all* RSSI readings from a node so that mixed hardware stays aligned.

Typical use cases include:

* Balancing a node that uses a high-gain external antenna against nodes with built-in antennas.
* Normalizing readings between dev boards that ship with slightly different radio front-end tuning.

To tune the RSSI adjustment for receiver:

1. Pick a reference node (leave its **RSSI adjustment for receiver** at 0) and place a known beacon at a fixed distance from both the reference and the node you want to adjust.
2. Compare their reported RSSI values for the same beacon.
3. On the node that reads stronger, set a **negative** value equal to the difference; on a weaker-reading node, set a **positive** value until both nodes report approximately the same RSSI.
4. Repeat with a second location to verify consistency, then apply the same offset to nodes that share the same antenna or board type.

Because the RSSI adjustment for receiver is an additive offset, it does not change the relative movement of a device within a single room, but it keeps multi-room trilateration and occupancy decisions fair between nodes with different hardware.

## Forget beacon if not seen for (in milliseconds)

Controls how long a MAC address stays in the internal tracking list. Shorter durations remove stale devices sooner but may cause the same device to be re-added frequently if it only broadcasts occasionally. The default is 300000 ms (5 minutes).

## Calibration tips

* Re-run the reference measurement if you change antennas or enclosure materials.
* Perform RSSI adjustment for receiver comparisons with beacons at least a few meters away to avoid near-field effects.
* When installing multiple nodes in one room, calibrate them together to avoid uneven presence detection at room boundaries.

## Troubleshooting

### RSSI seems incorrect

Note that `rssi@1m` is broadcast in the beacons from `ibeacon` and `eddy` devices. If those are not correct, you need to fix the beacon to send the correct value.

For all other devices, `rssi@1m` is the **RSS expected from a 0dBm transmitter at 1 meter** setting plus an offset to correct for broadcast power. See [rssi.h](https://github.com/ESPresense/ESPresense/blob/main/lib/BleFingerprint/rssi.h) for the exact values used or to confirm how offsets are applied.
