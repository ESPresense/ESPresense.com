---
layout: page
title: Home
permalink: /
nav_order: 0
---

# Home

An ESP32-based presence detection node designed for localized device tracking.

Reasons to use this over other solutions:

* ESP32 nodes are cheaper and easier to use than Raspberry Pis
* Extensive fingerprint-based IDs instead of MAC addresses for tracking or counting devices others can’t
* IRK-based enrollment of Apple devices to passively locate them uniquely, even with private random addresses
* Home Assistant MQTT Discovery for easy HA configuration
* Auto-updates by downloading GitHub-released binaries (optional, with a preference to disable if desired)
* Filters measured distance with both a median pre-filter and a 1Euro filter (reduces jitter for greater accuracy)
* Companion allows for full [multilateration](https://en.wikipedia.org/wiki/Trilateration)

For the best experience, we recommend pairing ESPresense nodes with the [ESPresense Companion](./companion) Docker container/HA Add-on. ESPresense nodes provide distance measurements to nearby devices, and ESPresense Companion aggregates those distances from multiple nodes, using an accurate floor plan to determine each device's location within your space ([multilateration](https://en.wikipedia.org/wiki/Trilateration)).

While this setup allows for more precise presence detection and triangulation, it requires an accurate floor plan and at least 3 nodes covering each room to work effectively.

If you prefer to stick with the [Home Assistant](https://www.home-assistant.io/) [`mqtt_room` component](https://www.home-assistant.io/components/sensor.mqtt_room/), it remains supported—though it is less capable and manually configured.

## Required

* [Nodes](./nodes)
* [Beacons/Phones/Watches](./devices)
* [MQTT Server](https://mosquitto.org/)

## Configuration & Setup

* [Network Configuration](./configuration/network) - WiFi and MQTT setup
* [Hardware Support](./configuration/hardware) - LEDs, Motion, and Environmental sensors
* [Advanced Settings](./configuration/settings) - Filtering, Counting, and Scanning logic

## Integrations

Connect ESPresense to your favorite automation platform:
* [Home Assistant](./integrations/home_assistant)
* [Homebridge](./integrations/homebridge)
* [Domoticz](./integrations/domoticz)

## Guides

* [Calibration](./guides/calibration) - Scale your distance measurements for accuracy
* [Technical](./guides/technical) - Under-the-hood details

## Troubleshooting

If you’re having trouble getting things set up or working properly, visit the [troubleshooting page](./troubleshooting) before opening an issue.

## Feature Requests

Have an idea or a request? Share it on [ESPresense Featurebase](https://espresense.featurebase.app/).

## Credits

This project builds on the hard work of a [number of people](./credits).
