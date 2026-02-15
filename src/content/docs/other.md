---
title: Other
sidebar:
  hidden: true
---


## COVID Exposure Apps

If none of the above is helping you uniquely identity your phone you can install a COVID Exposure tracker app on just the phone you want to track. Those beacons will be shown as `exp:20`. Unfortunetly we cannot use them to unqiuely identify your device **if it is enabled on multiple devices**. BUT, we can use the number of unique `exp:20` ids to count the number of people that are in a room.  Use the [count settings](/configuration/settings#counting) to do this.

## Room assistant iOS App (Deprecated)

This app has unfortunately not been working while in the background so we can no longer recommend it.

## Querying (Deprecated)

If you can't install an app or Enroll (pair once) to a device you can instead Query it for name, model or manufacturer see (https://espresense.com/configuration/settings#scanning).  This is a last resort because when you're connecting to a device you'll lose all advertising packets from other devices.
