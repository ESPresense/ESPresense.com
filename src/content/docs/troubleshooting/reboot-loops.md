---
title: Reboot Loops
slug: troubleshooting/reboot-loops
sidebar:
  order: 3
---


If mqtt stays disconnected after many tries the device will reboot. If Wifi is disconnected it will reboot as well, and go into the Wifi Portal. The Wifi Portal will stay up for 30 seconds and then reboot and it'll try it all over again. The best way to tell what is going on is to connect the device to this computer and use [this](/troubleshooting/logs#esp32-via-serial).
