---
title: Optimization
sidebar:
  order: 3
---


## Node Settings

### Maximum Distance
By default, nodes have a maximum distance of 16m. This means they will only report devices within this range. This default balances:
- Getting enough fixes for accurate positioning
- Avoiding less reliable long-distance measurements

You can adjust this setting if needed:
- Increase/remove limit to get more fixes (may reduce accuracy)
- Decrease limit to only use closer, potentially more reliable fixes

To modify the maximum distance, send an MQTT message:
```text
key: espresense/rooms/*/max_distance/set
value: 0  # 0 for no limit, or your desired maximum in meters
```

### Automatic Node Optimization

ESPresense Companion automatically optimizes node settings by sending out iBeacons that are received by other nodes. By comparing measured distances versus calculated distances (based on the floor plan), it adjusts node settings to minimize errors.

#### How it Works

1. When optimization is enabled, the system:
   - Takes 3 optimization snapshots at configured intervals
   - Establishes a baseline error measurement
   - Runs continuously at the configured interval (default: hourly)

2. For each optimization run:
   - Takes a new snapshot
   - Runs multiple optimization algorithms
   - Each algorithm attempts to find better settings
   - If new settings result in less error, they are applied to the nodes
   - If settings result in worse error, they are discarded

#### Optimizers
The system uses three optimizers:
- RxAdjRssi Optimizer
- Absorption Avg Optimizer
- Absorption Error Optimizer

These algorithms can adjust these node settings:
- Absorption
- RxAdjRssi

Each optimizer runs independently and can update node settings if it finds improvements.

#### Default Configuration

```yaml
optimization:
  enabled: true
  interval_secs: 3600
  limits:
    absorption_min: 2.5
    absorption_max: 3.5
    tx_ref_rssi_min: -70
    tx_ref_rssi_max: -50
    rx_adj_rssi_min: -15
    rx_adj_rssi_max: 20
```

The limits section prevents the optimizers from setting values outside these ranges.

Results can be viewed in the grid on the Calibration page, where they can also be reset across all nodes if required.

## Device Settings

### RSSI@1m Calibration

Each type of Bluetooth Low Energy (BLE) device transmits at different power levels. The RSSI@1m value tells the system what signal strength to expect when a device is exactly 1 meter from a node. This value is crucial for accurate distance calculations.

#### Default Values
ESPresense starts with these default values (base of -65 plus device-specific adjustment):

| Device Type | Adjustment | Final RSSI@1m |
|------------|------------|---------------|
| Apple devices | 0 | -65 |
| Room Assistant | 0 | -65 |
| Tile | -4 | -69 |
| COVID Exposure | -12 | -77 |
| iTag | -10 | -75 |
| Nut Tags | -12 | -77 |
| Mi Flora Monitor | -10 | -75 |

#### Manual Calibration
If the default values aren't providing accurate distances:

1. **Initial Setup:**
   - Place your device in a known location on your floor plan
   - Ensure multiple nodes can see the device (aim for 5+ fixes)
   - Hover over the device on the map to see the distance circles

2. **Adjusting RSSI@1m:**
   - Click the device on the map to open its settings
   - If distance circles are larger than actual distance, increase RSSI@1m
   - If distance circles are smaller than actual distance, decrease RSSI@1m
   - Make small adjustments and watch how circles update in real-time

3. **Verification:**
   - Move the device to different known locations
   - Verify distance circles match actual positions
   - Check accuracy at various distances from nodes

#### Tips for Better Calibration
- Start with the default value for your device type
- Keep the device in the same orientation during testing
- Metal objects, walls, and furniture can affect readings
- Note successful RSSI@1m values for your specific devices for future reference

:::tip
Help improve this documentation! Click 'Edit page ' below.
:::
