---
title: Trackable Devices
sidebar:
  order: 3
---


## Known working

| Name                 | Links                                       | Notes                                                                |
|:---------------------|:--------------------------------------------|:---------------------------------------------------------------------|
| Android Phones       |                                             | [Must install an app](/android) |
| iPhones              |                                             | [Pair to retrieve IRK](/apple) |
| Apple Watches        |                                             | [Use iCloud keychain to get IRK](/apple) |
| Wear OS Smartwatches |                                             | [Must use HA companion app](/android) |
| Tiles                | [amz/us](https://amzn.to/3h77T5f)           | These work great, but update somewhat slow |
| Blue Charm Beacons   | [amz/us](https://amzn.to/2YGdA3w)           | These work great [^beaconconfig] |
| Blue Charm Beacons (BC021-MultiBeacon) | [amz/us](https://amzn.to/4ceo8Jb)           | Bluetooth BLE 5.0 with Movement Sensor [^beaconconfig] |
| Blue Charm Beacons (BC05-MultiBeacon) | [amz/us](https://amzn.to/4iWu0Ja)           | Long Range Water-Resistant BLE iBeacon with Adjustable Movement - Ideal for mail detection [^beaconconfig] |
| Generic BTLE Beacons |                                             | Anything that follows the iBeacon or Eddystone standards |
| musegear finder 2    | [musegear](https://shop.musegear-finder.net/collections/finder-2) | Must be connected once with the associated app. Id format: iTrack:... |
| musegear finder mini | [musegear](https://shop.musegear-finder.net/collections/finder-mini) | Must be connected once with the associated app. Id format: iTrack:... |
| Whoop strap 3.0      |                                             | Id format: name:whoop-xxxxxxx |
| Whoop strap 4.0      |                                             | Id format: name:whoop-xxxxxxx |
| Amazfit Balance      |                                             | Seen as `mifit:xxx`. Enable "Visibility" in Zepp app (Profile -> Watch) |
| Amazfit Band         | [amz/us](https://amzn.to/3lArIr0)           | Make sure discoverable is turned on |
| Amazfit Bip S        | [amz/us](https://amzn.to/3C4DyMK)           |
| Amazfit Bip 3 Pro    | [amz/us](https://amzn.asia/d/98vWhnk)       | Use the Zepp app on your paired phone to set the watch to be discoverable |
| Amazfit GTS 2 Mini   | [amz/us](https://amzn.to/3e6JQom)           |
| Amazfit GTS 4 Mini   | [amz/us](https://amzn.to/3nc8CrI)           | Make sure discoverable is turned on |
| Amazfit GTR 2e       | [amz/us](https://amzn.to/3Awz16C)           |
| Xiaomi Mi Band       | [amz/us](https://amzn.to/3E8AJMh)           | Make sure discoverable is turned on |
| Innway Wallet Card   | [amz/us](https://amzn.to/3Z8Govf)           | Rechargeable iBeacon - no need to use app or activate |
| OpenHaystack-Beacons | [openhaystack-firmware](https://github.com/acalatrava/openhaystack-firmware/tree/main/apps/openhaystack-alternative) | Work outdoors with Apple's FindMy Network and are easily indoor-trackable |
| Xiaomi Mi Tags| [ali](https://s.click.aliexpress.com/e/_ookE8F9)| If you pair them to the app, simply turn off Bluetooth long enough for it to start beeping, leave it disconnected after. |

## Works with caveats

| Name                 | Links                                       | Notes                                                                |
|:---------------------|:--------------------------------------------|:---------------------------------------------------------------------|
| MiFlora plant sensor |                                             | Location only |
| FitBits              |                                             | Only works when not connected to a phone |
| Xiaomi Watch         |                                             | Only works when not connected to a phone |
| HUAWEI Band 6        |                                             | Only works when not connected to a phone |
| HUAWEI Watch GT2     |                                             | Only works when not connected to a phone |
| Fi Smart Dog Collar  |                                             | Smart Base needs to be powered off or Collars will not beacon |
| Gigaset G-Tag        |                                             | Only works when not connected to a phone |
| Garmin Instinct Solar| [amz/us](https://amzn.to/3JF7IeI)           | This only work while using the Broadcast Heart Rate function. It seems to be somewhat slow but usable. I do think that maybe all garmin device with this function will work. |
| Whoop strap 5.0      | [whoop](https://join.whoop.com/B3BD19)      | Id format: name:whoop-xxxxxxx - Seems to only work with the Broadcast Heart Rate setting enabled |

## Known to not work

| Name                | Notes                                                                |
|:--------------------|:---------------------------------------------------------------------|
| Apple AirTags       | We can only count how many are currently not connected to a phone |
| Garmin Fenix 5X Plus | Seen as `garmin:xxxx` at boot only for a few seconds; does not reliably beacon |
| Samsung SmartTags   | Randomized mac addresses |

### Add to the list

If you have a different BLE-enabled piece of hardware that you have gotten to work with this project, please let us know about it! You can click the edit this page in the footer.

## Footnotes

[^beaconconfig]: These can do eddystone and iBeacon at the same time, just pick iBeacon

