---
title: MQTT
sidebar:
  order: 99
---


If you end up deploying a fleet of ESP32s in your home, it can quickly become painful to go to each device to update settings.

You can use tools like [MQTT explorer](https://mqtt-explorer.com) or if you are using mosquitto (default for HA), the `mosquitto_sub` and `mosquitto_pub` tools to view and manage the settings.


```bash
mosquitto_sub -h homeassistant.local -u <username> -P <password> -i presense-information -v -t "espresense/rooms/kitchen/#"
```

:::note
For configuration of the Companion App also check the [Companion MQTT](/companion/installation/#mqtt-setup) section
:::

## Reading Current Settings

Example output when subscribing to a room:
```
espresense/rooms/study/status online
espresense/rooms/study/max_distance 10.00
espresense/rooms/study/absorption 3.50
espresense/rooms/study/include apple:aaaayyyy iBeacon:232323
espresense/rooms/study/exclude sonos:xxxx sonos:yyyy
espresense/rooms/study/auto_update OFF
espresense/rooms/study/prerelease OFF
espresense/rooms/study/arduino_ota OFF
```

## Updating Settings

You can update the configuration for any of the above topics by publishing to the `/set` endpoint for each topic like so:

```bash
mosquitto_pub -h homeassistant.local -u <username> -P <password> -i presense-information -t "espresense/rooms/kitchen/auto_update/set" -m "ON" -d
```

You can use a room of `*` to update all ESPresense nodes at the same time. If you retain that setting even NEW nodes will upon startup get that configuration set.

## Available Configuration Options

### Core BLE Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `max_distance` | float | 16.0 | Maximum distance to report (in meters). Devices beyond this distance are filtered out. |
| `absorption` | float | 2.7 | Factor used to account for signal absorption, reflection, or diffraction. Adjust based on your environment. |
| `skip_distance` | float | 0.5 | Report early if beacon has moved more than this distance (in meters). |
| `skip_ms` | integer | 5000 | Skip reporting if message age is less than this (in milliseconds). Reduces MQTT traffic. |
| `max_divisor` | integer | 10 | Max divisor for reporting interval. Larger movements divide the skip interval. |

### RSSI Calibration Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `ref_rssi` | integer | -65 | RSSI expected from a 0dBm transmitter at 1 meter. NOT used for iBeacons or Eddystone. |
| `tx_ref_rssi` | integer | -59 | RSSI expected from this tx power at 1m (used for node iBeacon transmission). |
| `rx_adj_rssi` | integer | 0* | RSSI adjustment for receiver (use only if you know this device has a weak antenna). *Default varies by board: ESP32S3=20, others=0 |

### Device Filtering

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `include` | string | (empty) | Include only sending these IDs to MQTT (space-separated). Example: `apple:iphone10-6 apple:iphone13-2` |
| `exclude` | string | (empty) | Exclude sending these IDs to MQTT (space-separated). Example: `exp:20 apple:iphone10-6` |
| `known_macs` | string | (empty) | Known BLE MAC addresses (no colons, space-separated). These devices get special handling. |
| `known_irks` | string | (empty) | Known BLE Identity Resolving Keys (32 hex chars, space-separated) for Apple device tracking. |
| `query` | string | (empty) | Query device IDs for characteristics. Example: `flora:` for Xiaomi Mi Flora devices. |

### Counting Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `count_ids` | string | (empty) | Include ID prefixes for counting (space-separated). Devices matching these prefixes are counted. |

### Update/OTA Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `auto_update` | ON/OFF | OFF | Automatically update firmware when new releases are available. |
| `prerelease` | ON/OFF | OFF | Include pre-released versions in auto-update checks. |
| `arduino_ota` | ON/OFF | OFF | Enable Arduino OTA updates (allows updating via Arduino IDE). |
| `update` | string | (empty) | If set to a URL, device will update from this URL on next boot. |

### Motion Sensor Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `pir_timeout` | float | 0.5 | PIR motion timeout in seconds (debounce time). |
| `radar_timeout` | float | 0.5 | Radar motion timeout in seconds (debounce time). |

### Switch Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `switch_1_timeout` | float | 0.5 | Switch One timeout in seconds (debounce time). |
| `switch_2_timeout` | float | 0.5 | Switch Two timeout in seconds (debounce time). |

### Button Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `button_1_timeout` | float | 0.5 | Button One timeout in seconds (debounce time). |
| `button_2_timeout` | float | 0.5 | Button Two timeout in seconds (debounce time). |

### System Commands

| Setting | Type | Description |
|---------|------|-------------|
| `restart` | button | Restart the device immediately. |
| `name` | string | Change the room name (slugified to create device ID). |

### Enrollment Commands

| Setting | Type | Description |
|---------|------|-------------|
| `enroll` | string | Start BLE device enrollment mode. Format: `id\|name` or just `name`. Device stays in enrollment mode for 2 minutes. |
| `cancelEnroll` | button | Cancel enrollment mode. |

## Examples

### Filter to only track Apple devices
```bash
mosquitto_pub -h homeassistant.local -u <username> -P <password> -t "espresense/rooms/kitchen/include/set" -m "apple:"
```

### Set maximum distance to 10 meters
```bash
mosquitto_pub -h homeassistant.local -u <username> -P <password> -t "espresense/rooms/kitchen/max_distance/set" -m "10.0"
```

### Enable auto-update on all nodes
```bash
mosquitto_pub -h homeassistant.local -u <username> -P <password> -t "espresense/rooms/*/auto_update/set" -m "ON" -r
```

### Adjust RSSI for a node with weak antenna
```bash
mosquitto_pub -h homeassistant.local -u <username> -P <password> -t "espresense/rooms/kitchen/rx_adj_rssi/set" -m "10"
```

### Start enrollment for a new device
```bash
mosquitto_pub -h homeassistant.local -u <username> -P <password> -t "espresense/rooms/kitchen/enroll/set" -m "myphone:abcdef|My Phone"
```

### Update all nodes simultaneously
```bash
mosquitto_pub -h homeassistant.local -u <username> -P <password> -t "espresense/rooms/*/absorption/set" -m "3.0" -r
```
