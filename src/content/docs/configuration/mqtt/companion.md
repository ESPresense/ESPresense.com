---
title: Companion
---

ESPresense Companion is also bidirectional on MQTT.

## Companion Reads

Companion subscribes to data coming from ESPresense nodes:

- `espresense/devices/+` for BLE observations from nodes
- `espresense/rooms/+/telemetry` for node telemetry
- `espresense/rooms/+/status` for node availability

## Companion Writes

Companion publishes processed outputs and configuration changes:

- Presence and location outputs for Home Assistant entities
- Node optimization and configuration updates through room `.../set` topics, such as max distance tuning

For the node topic reference and write examples, see [MQTT Overview](/configuration/mqtt).
