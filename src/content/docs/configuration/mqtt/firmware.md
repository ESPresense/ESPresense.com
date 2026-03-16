---
title: Firmware
---

After Wi-Fi setup, each ESPresense node uses MQTT in two directions.

## Firmware Writes

Firmware publishes node state and BLE observations:

- `espresense/rooms/<room>/status` for online or offline availability
- `espresense/rooms/<room>/telemetry` for node health and configuration telemetry
- `espresense/devices/<device_id>` for detected BLE device updates

## Firmware Reads

Firmware subscribes to configuration and command topics:

- `espresense/rooms/<room>/+/set` for per-node setting updates
- `espresense/rooms/*/+/set` for fleet-wide setting updates

This is how nodes receive runtime config such as `max_distance`, `include`, `exclude`, `auto_update`, and LED commands.

For the full topic reference and command examples, see [MQTT Overview](/configuration/mqtt).
