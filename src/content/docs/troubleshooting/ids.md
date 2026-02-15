---
title: Id Problems
slug: troubleshooting/ids
sidebar:
  order: 2
---


## Multiple devices with the same id

The newest version allows you to selectively decide which ids you want queried to improve the id. You can now put "apple:1005:9-12" in the query box and it'll ask the phone for it's model and turn it into "apple:13-3". BUT if apple:1005:9-12 is working for you reliably it's better just to use that and keep query empty. The ESP32 has to stop listening while sending out the queries which hurts the reliability of receiving advertisements from devices.

## I just want to use the mac address of my device as the id

Add the mac(s) to the box labled Known BLE mac addresses - ESPresense will use the id `known:{mac}` if that mac is seen.

## I tried known mac, but then the device "disappeared"

It appears your device is using [BLE Mac Randomization](https://www.mist.com/documentation/ble-mac-randomization/), we instead need to look at things other than mac to track it
