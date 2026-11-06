---
title: Anchor beacons
description: Put a battery beacon at a fixed, measured spot in every room so Companion has known distances to calibrate against and a ruler to check its positions.
sidebar:
  order: 2
---

*How-to · Last checked against [Companion v2.6.6](https://github.com/ESPresense/ESPresense-companion/releases/tag/v2.6.6) on 2026-11-06. The Companion steps follow its source; the beacon settings follow Blue Charm's published spec.*

An anchor is a beacon that never moves, at a spot you have marked on Companion's map. Companion then knows the true distance from it to every node that hears it. One per room is the recommendation.

What that buys you:

- **Calibration with a fixed reference.** Node-to-node links can't tell "every node hears 5 dB hot" from "every node transmits 5 dB loud". An anchor ranged with its own rssi@1m can, so Companion's optimizer holds anchors at their rssi@1m and uses them to pin node calibration ([#1863](https://github.com/ESPresense/ESPresense-companion/pull/1863)).
- **A ruler.** You can see how far off Companion is for something whose position you know, room by room, instead of guessing from a phone in your pocket.
- **A check on fingerprinting.** If you run the fingerprint locator from the BETA add-on, its accuracy check locates every anchor as if its position were unknown and reports the error ([#1753](https://github.com/ESPresense/ESPresense-companion/pull/1753)).

:::note[Affiliate disclosure]
The Amazon link on this page is an affiliate link. As an Amazon Associate, ESPresense earns from qualifying purchases, at no extra cost to you. Affiliate revenue helps fund the project — see [Credits](/credits) for other ways to support.
:::

## What to buy

**[Blue Charm BC04P-MultiBeacon](https://bluecharmbeacons.com/product/bluetooth-ble-ibeacon-bc04p-multibeacon-water-resistant-with-motion-sensor/)**, one per room. Where to buy: [Amazon 5-pack](https://link.amazon/B0euOHwxq).

- It runs on a CR2477 coin cell, rated about 4 years at 0 dBm, one advertisement a second, non-connectable.
- A CR2477 holds its voltage over its life far better than the CR2032 most beacons use. That matters more for an anchor than battery life does: as a cell sags, the beacon gets quieter, and Companion reads the drift as a calibration error.
- The KBeacon Pro app shows the battery level, so you can swap the cell before it sags.
- It broadcasts iBeacon, which ESPresense reports as `iBeacon:<uuid>-<major>-<minor>`.

Any iBeacon that lets you set its major/minor, interval and TX power will do; prefer one with a bigger cell or USB power over a CR2032.

## 1. Configure each beacon

In the KBeacon Pro app, set every beacon the same way except its minor:

| Setting | Value | Why |
|---|---|---|
| Format | iBeacon | ESPresense identifies it by UUID, major and minor |
| UUID | the same on all of them | one config rule can match them all |
| Major / Minor | major `1`, minor `1`, `2`, `3`, … | every anchor needs its own id |
| Advertising interval | 1000 ms | about ten readings per node every 10 s, and the rated battery life |
| TX power | 0 dBm | the rated battery life; enough for a room and the rooms next to it |
| Connectable | off | the rated battery life |

Two beacons with the same UUID, major and minor look like one device to ESPresense, and an anchor that is really two spots makes calibration worse, not better.

## 2. Place them

- **One per room, somewhere it will stay put:** a shelf, a picture rail, the back of a cabinet door. If it gets moved, its anchor is wrong until you move the anchor too.
- **About 1 m up**, where phones and watches usually are.
- **Not on or behind metal, and not within about 1 m of a node.** A beacon next to a node teaches Companion about that one link and little else.
- **Measure where it is** to within about 0.2 m, from your floor plan's origin, including its height above the floor. That position is the ground truth everything else is checked against.

## 3. Track them in Companion

Add each beacon to `devices:` in Companion's `config.yaml`, with the UUID you set in step 1 and a name that says where it is:

```yaml
devices:
  - id: "iBeacon:e2c56db5-dffb-48d2-b060-d0f5a71096e0-1-1"
    name: "Anchor Kitchen"
  - id: "iBeacon:e2c56db5-dffb-48d2-b060-d0f5a71096e0-1-2"
    name: "Anchor Living Room"
```

Ids match case-insensitively. Once a node hears the beacon, it shows up in Companion's device list.

## 4. Anchor each one

1. Open **Calibration** and pick the **Devices** tab. Only devices heard within their timeout (30 s by default) are listed, so make sure the beacon is on and in range.
2. Click the beacon.
3. **Select Floor**, then drag the marker onto the spot you measured.
4. Set **Height from Floor (m)** and press **Set**.
5. Press **Anchor here**.

The page now says **Anchored** with the coordinates, and the device list marks the beacon with 📍. **Remove anchor** undoes it, for when the beacon has moved.

## 5. Set its rssi@1m

Companion holds an anchor at its rssi@1m, so a wrong rssi@1m pulls every node's calibration with it. With the beacon anchored, leave it on its device calibration page for a minute: Companion compares each node's map distance with the distance it estimates from RSSI and works out the rssi@1m that would make them agree. When the readings are stable, press **Accept New Calibration**. Do this once per anchor.

## 6. Check it worked

- **Calibration → Nodes** now has a row per anchor: the distance on the map next to the distance measured, for every node that hears it. A node that is far off on every anchor is miscalibrated or misplaced.
- Change a battery when the KBeacon Pro app shows it low, and re-check the anchor if the beacon was moved to do it.

## See also

- [Companion → Optimization](/companion/optimization): how Companion tunes node calibration automatically.
- [Calibration](/guides/calibration): per-node settings, for when one node disagrees with the rest.
