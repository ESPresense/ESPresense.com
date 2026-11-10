---
title: Home Assistant
slug: integrations/home-assistant
sidebar:
  order: 1
---


The Home Assistant integration consists of two parts:
1. **node sensors**: each ESP32 appears as a device automatically through MQTT discovery, with the entities listed below
2. **beacons**: define each beacon in `configuration.yaml` (using [mqtt_room integration](https://www.home-assistant.io/integrations/mqtt_room/))

### beacons: MQTT device topics

Once the ESP32 is running, it is important to configure Home Assistant to use the information from the MQTT topic to determine what devices to track. You can read the full documentation [on the Home Assistant website](https://www.home-assistant.io/components/sensor.mqtt_room/). It is critical that you configure your device IDs to match the device fingerprint found by ESPresence (e.g. `apple:1007:11-12`).

#### connect to ESP32

The easiest way to find the fingerprint is to connect the usb cable and monitor the serial port (115200 baud) while bringing a device close to the ESP32. To monitor the serial port you can use the [ESPresense terminal](/troubleshooting/terminal/).
Alternatives: e.g. Arduino monitor function, the `PlatformIO` VSCode [extension](https://diyprojects.io/install-ide-platformio-extension-visual-studio-code-vscode-windows-32-bit-linux/#.YTmXNNMzYZ8) or via platform io ``pio  run --target monitor``.

You should see output similar to the following:

```text
--- Miniterm on /dev/cu.usbserial-39522517AB  115200,8,N,1 ---
--- Quit: Ctrl+C | Menu: Ctrl+T | Help: Ctrl+T followed by Ctrl+H ---
0 New   | MAC: 67dc0c979510, ID: apple:0c0e:26
0 New   | MAC: 14dc290e58f2, ID: apple:0a01:5
1 Close | MAC: 4277f2521053, ID: apple:1007:11-12
```

The `Close` message will show which devices are under half a meter away. Once you move the device > 1m you will see a `Left` message.

#### monitor MQTT topics

Alternatively, you can monitor the MQTT topics using e.g. [MQTT Explorer](http://mqtt-explorer.com/) or the monitoring built into the Home Assistant MQTT integration (Configure -> Listen to topic -> espresense/# -> Start listening will give you all taffic from all nodes).
Connect to the Home Assistant MQTT broker (same configuration as used for the ESPresence sensor setup).
This groups + shows the `rooms` and `devices`.

### MQTT auto discovery

ESPresense supports [MQTT auto discovery](https://www.home-assistant.io/integrations/mqtt/#mqtt-discovery), which is enabled by default in Home Assistant.
This means a device + entities for each ESP32 sensor will automatically be created.

The following inventory describes current firmware. Optional sensors, inputs, outputs,
and lights only appear when the relevant hardware and configuration are present;
names of configured inputs and outputs are chosen by the user. Lights use the
name `LED <number>` and are discovered when configured for MQTT control. A node
does not have every entity in this table.

<!-- ha-discovery-inventory:start -->

| Entity name | Home Assistant type | Availability |
| --- | --- | --- |
| Absorption | number | Standard node |
| AHTX0 Humidity | sensor | When the relevant hardware or feature is configured |
| AHTX0 Temperature | sensor | When the relevant hardware or feature is configured |
| Arduino OTA | switch | Standard node |
| Auto Update | switch | Standard node |
| Battery | sensor | When the relevant hardware or feature is configured |
| Battery Voltage | sensor | When the relevant hardware or feature is configured |
| BH1750 Lux | sensor | When the relevant hardware or feature is configured |
| BME280 Humidity | sensor | When the relevant hardware or feature is configured |
| BME280 Pressure | sensor | When the relevant hardware or feature is configured |
| BME280 Temperature | sensor | When the relevant hardware or feature is configured |
| BMP180 Pressure | sensor | When the relevant hardware or feature is configured |
| BMP180 Temperature | sensor | When the relevant hardware or feature is configured |
| BMP280 Pressure | sensor | When the relevant hardware or feature is configured |
| BMP280 Temperature | sensor | When the relevant hardware or feature is configured |
| Charging | binary sensor | When the relevant hardware or feature is configured |
| Co2 | sensor | When the relevant hardware or feature is configured |
| Configured input name | binary sensor | When the relevant hardware or feature is configured |
| Configured output name | switch | When the relevant hardware or feature is configured |
| Connectivity | binary sensor | Standard node |
| Count | sensor | When count filters are configured |
| Current | sensor | When the relevant hardware or feature is configured |
| DS18B20 Temperature &lt;number&gt; | sensor | When the relevant hardware or feature is configured |
| Energy | sensor | When the relevant hardware or feature is configured |
| Enroll | button | Standard node |
| Free Mem | sensor | Standard node |
| Humidity | sensor | When the relevant hardware or feature is configured |
| LED &lt;number&gt; | light | When an LED is configured for MQTT control |
| Max Distance | number | Standard node |
| Power | sensor | When the relevant hardware or feature is configured |
| Prerelease | switch | Standard node |
| Raw Weight | sensor | When the relevant hardware or feature is configured |
| Restart | button | Standard node |
| Temperature | sensor | When the relevant hardware or feature is configured |
| TSL2561 Lux | sensor | When the relevant hardware or feature is configured |
| TVOC | sensor | When the relevant hardware or feature is configured |
| Update | button | Standard node |
| Uptime | sensor | Standard node |
| Voltage | sensor | When the relevant hardware or feature is configured |

<!-- ha-discovery-inventory:end -->

They appear as device + entities in Mosquitto broker card on the **integrations** page.

[![Open your Home Assistant instance and show your integrations.](https://my.home-assistant.io/badges/integrations.svg)](https://my.home-assistant.io/redirect/integrations/)

And available in the **devices** overview.

[![Open your Home Assistant instance and show your devices.](https://my.home-assistant.io/badges/devices.svg)](https://my.home-assistant.io/redirect/devices/)

### beacons: configuration.yaml

Each beacon that should be monitored in Home Assistant needs to be added to the `configuration.yaml` file.

```yaml
sensor:
# One entry for each beacon you want to track
  - platform: mqtt_room
    device_id: "iTrack:xxxxxxxxxxxx"
    name: 'ESP Keys'
    state_topic: 'espresense/devices/iTrack:xxxxxxxxxxxx'
    timeout: 10
    away_timeout: 120
  - platform: mqtt_room
    device_id: "iBeacon:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx-3-58241"
    name: 'ESP Chipolo'
    state_topic: 'espresense/devices/iBeacon:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx-3-58241'
    timeout: 10
    away_timeout: 120
```
If you have enrolled a device with a specific name that becomes the device_id to track.

### screenshots

#### MQTT ESP32 Device

<img width="1033" alt="PNG image" src="https://user-images.githubusercontent.com/2084872/150005629-b080bf83-7eed-458d-8c91-808deb568e61.png" />

#### beacon: MQTT room sensor in the lovelace UI

![Mqtt Room sensor](/images/mqtt_room_sensor.png)

#### ESP32 sensor: binary sensor with telemetry in the lovelace UI

![Binary sensor with telemetry](/images/binary_sensor_with_telemetry.png)

### sensors: manual configuration

Normally not needed, but in case [MQTT auto discovery](https://www.home-assistant.io/integrations/mqtt/#mqtt-discovery) is disabled, it is possible to manually add a `binary_sensor` for the ESP32 sensor.
Note: this does not add the other controls and diagnostics listed under MQTT auto discovery above.

```yaml
mqtt:
  binary_sensor:
  # One entry per sensor node
    - unique_id: 'kitchen'
      name: 'Kitchen'
      state_topic: espresense/rooms/kitchen/status
      json_attributes_topic: espresense/rooms/kitchen/telemetry
      payload_on: online
      payload_off: offline
      device_class: connectivity
    - unique_id: 'living_room'
      name: 'Living Room'
      state_topic: espresense/rooms/living_room/status
      json_attributes_topic: espresense/rooms/living_room/telemetry
      payload_on: online
      payload_off: offline
      device_class: connectivity
    - unique_id: 'kid_room'
      name: 'Kid Room'
      state_topic: espresense/rooms/kid_room/status
      json_attributes_topic: espresense/rooms/kid_room/telemetry
      payload_on: online
      payload_off: offline
      device_class: connectivity
    - unique_id: 'master_bedroom'
      name: 'Master Bedroom'
      state_topic: espresense/rooms/master_bedroom/status
      json_attributes_topic: espresense/rooms/master_bedroom/telemetry
      payload_on: online
      payload_off: offline
      device_class: connectivity
```
