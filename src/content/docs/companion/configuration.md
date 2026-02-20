---
title: Configuration
sidebar:
  order: 2
---


## Example Configuration
You can find an example configuration file [here](https://github.com/ESPresense/ESPresense-companion/blob/main/src/config.example.yaml)

## GPS Coordinates
Find your home's coordinates:
- **Google Maps**: Search your address and click the street in front of your house
- **Google Earth**: Search your address and hover over your house - coordinates and elevation show in bottom right

## Room Measurement Guide

Start at the **bottom-left corner** of your building/area - this serves as the **origin (0,0)**. All measurements are taken from this corner. When plotting, use either clockwise or counter-clockwise direction consistently. If you prefer, you can start from any corner of your building, but you will need to remember to set the correcponding option in the map settings.

### Example measurements (clockwise, using north as an example orientation, 2 rooms in a 3m * 8m house):
Note: All measurements are required to be in meters

#### Room 1
1. Start point(North East Corner): `(0,0)`
2. North wall (North West Corner): `(3,0)` (3 meters (9 feet))
3. East wall (South West Corner):  `(3,4)` (4 meters (12 feet))
4. South wall (South East Corner): `(0,4)`
5. West wall is automatically connected between last and first corner

#### Room 2
1. Start point(North East Corner): `(0,4)`
2. North wall (North West Corner): `(3,4)` (3 meters (9 feet))
3. East wall (South West Corner):  `(3,8)` (4 meters (12 feet))
4. South wall (South East Corner): `(0,8)`
5. West wall is automatically connected between last and first corner

### Example with a fireplace on the 2nd wall and 2 alcoves:

#### Room
1. Start point: `(0,0)`
2. Width: `(5,0)` (2 meters (6 feet))
3.   corner `(5,1)`
4. corner `(4.5,1)`
5. corner `(4.5,3)`
6.   corner `(5,3)`
7. Depth: `(5,3.5)` (3.5 meters (10.5 feet))
8. Final corner: `(0,3.5)`
9. Last wall is automatically connected between last and first corner

## Creating Your Floorplan

There are three ways to create your floor plan:
1. Use [MagicPlan](https://www.magicplan.app/) to create a free home plan
2. Use the [ESPresense Floorplan Creator](https://espresense.com/Floorplan-Creator/) to convert measurements to YAML
3. Directly edit the YAML coordinates in the config file - changes update live thanks to hot reloading
   - The Map has a nice feature where you can hover over a spot on the map, hit Cntrl-C at the points you want, then you can paste those points into the yaml

## Node Placement
The performance of your entire ESPresense system hinges almost entirely on the quality and placement of your ESPresense devices. Getting this right is the difference between a magical, seamless experience and a frustrating, unreliable one. The system works by trilateration, not just proximity. This means it calculates your position based on the relative signal strength (RSSI) from multiple ESPresense devices.
For optimal device location accuracy:
- Place base station nodes at the corners of your floor plan
- Add an additional node within 1-3 meters
- Aim for 5 fixes minimum - more fixes improve accuracy
- The algorithm prioritizes closest distances (40% weight using gaussian distribution)

## Configuration File

Navigate to `/config/espresense/config.yaml` and configure:

### MQTT Connection
```yaml
# For Home Assistant's MQTT addon
mqtt:
  username: your_username
  password: your_password
  ssl: false

# For external MQTT, also include:
  host: your_host
  port: 1883
```

### GPS Settings
```yaml
gps:
  latitude: your_decimal_latitude
  longitude: your_decimal_longitude
  elevation: your_elevation_in_meters
  rotation: your_rotation_in_degrees # Rotation in degrees from north (0 degrees)
```

*   `rotation`: Specifies the orientation of your map relative to North (0 degrees). This helps align the map correctly if your floorplan's 'up' direction isn't true North.
*   Use the **Geolocation** view in the UI to verify your GPS coordinates and rotation are set correctly.
*   Remember, the `config.yaml` file live reloads, so you can adjust these settings and see the changes on the map immediately without needing to restart.

### Map Settings
```yaml
map:
  flip_x: false # Set to true to flip X coordinates (default: false)
  flip_y: true # Set to true to use bottom-left origin, false for top-left origin (default: true)
  wall_thickness: 0.1 # Wall thickness in meters
  wall_color: "#ddd" # Optional wall color, if not set uses room color
  wall_opacity: 0.35 # Optional wall opacity, if not set defaults to 0.35
```
Note: Will just use defaults if left out of config yaml

### Filtering Configuration
ESPresense Companion uses a combination of Kalman filtering and probability smoothing to provide stable, accurate location tracking. These parameters can be configured in your `config.yaml` under the `filtering:` section.

#### Default Values
All parameters have sensible defaults built into the code. **You do not need to add these to your config unless you want to customize them**:

```yaml
filtering:
  process_noise: 0.01
  measurement_noise: 0.1
  max_velocity: 0.5
  smoothing_weight: 0.7
  motion_sigma: 2.0
```

#### Kalman Filter Parameters
These parameters control the Kalman filter that tracks device position and velocity.

##### `process_noise`
**Default:** `0.01`

Controls how quickly the filter adapts to changes in movement. This scales the process noise matrix (Q) in the Kalman filter.

| Value | Effect |
|-------|--------|
| Lower (e.g., 0.005) | Smoother tracking, slower to respond to direction changes |
| Higher (e.g., 0.05) | More responsive, but potentially more jittery |

##### `measurement_noise`
**Default:** `0.1`

Base value for how much to trust new location measurements. This is the measurement noise (R) in the Kalman filter.

:::note
This value is **dynamically increased** when a location jump exceeds `max_velocity`. The excess factor is squared, so physically impossible movements are heavily dampened.
:::

| Value | Effect |
|-------|--------|
| Lower (e.g., 0.05) | Trust measurements more, respond faster to changes |
| Higher (e.g., 0.2) | Trust the motion model more, smoother but slower |

##### `max_velocity`
**Default:** `0.5` (meters per second, ~1.1 mph)

Maximum expected movement speed. Used to detect and dampen physically impossible location jumps.

| Value | Use Case |
|-------|----------|
| 0.5 | Normal walking (default) |
| 1.0-2.0 | Fast walking or running |
| 0.3 | Slow-moving targets or stationary bias |

#### Smoothing Parameters
These parameters control how room/scenario probabilities are smoothed over time.

##### `smoothing_weight`
**Default:** `0.7`

Weight given to the previous probability state (0.0-1.0). This creates an exponential moving average over scenario probabilities.

The formula is: `new_probability = smoothing_weight * old_probability + (1 - smoothing_weight) * measurement`

| Value | Effect |
|-------|--------|
| Higher (e.g., 0.8-0.9) | More stable room assignments, slower to transition between rooms |
| Lower (e.g., 0.5) | Faster room transitions, but potentially more flickering |

##### `motion_sigma`
**Default:** `2.0` (meters)

Standard deviation for the Gaussian penalty applied to scenarios that don't match the Kalman-predicted location. This penalizes scenarios that would require "teleporting" the device.

The penalty is: `weight = exp(-distance^2 / (2 * motion_sigma^2))`

| Value | Effect |
|-------|--------|
| Lower (e.g., 1.0) | Strongly penalize scenarios far from predicted location |
| Higher (e.g., 3.0-4.0) | More tolerant of location uncertainty |

#### Tuning Guide

| Goal | Recommended Changes |
|------|---------------------|
| **Less jitter / more stable** | Decrease `process_noise` to 0.005, increase `smoothing_weight` to 0.8-0.9 |
| **Faster response to movement** | Increase `process_noise` to 0.05, decrease `smoothing_weight` to 0.5 |
| **Support running/fast movement** | Increase `max_velocity` to 1.0-2.0 |
| **Less signal noise tolerance** | Decrease `measurement_noise` to 0.05 |
| **Penalize room teleporting more** | Decrease `motion_sigma` to 1.0 |
| **More tolerant of BLE uncertainty** | Increase `motion_sigma` to 3.0-4.0 |

#### How It Works
1. **Kalman Filter** - Tracks device position and velocity in 3D space. Each new location measurement is filtered to produce a smooth trajectory.
2. **Motion Consistency Weighting** - Each possible scenario (room/floor combination) is weighted based on how consistent it is with the Kalman-predicted location using `motion_sigma`.
3. **Probability Smoothing** - Scenario probabilities are smoothed over time using `smoothing_weight` to prevent rapid flickering between rooms.
4. **Best Scenario Selection** - The scenario with the highest smoothed probability is selected as the device's current location.

### Optimisation Settings
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

locators:
  nadaraya_watson:
    enabled: true
    floors: ["ground", "outside"]  # floor id, see floor configuration section
    bandwidth: 0.5
    kernel: gaussian

  nelder_mead:
    enabled: true
    floors: ["ground", "outside"]  # floor id, see floor configuration section
    weighting:
      algorithm: gaussian
      props:
        sigma: 0.10

  nearest_node:
    enabled: true
    max_distance: 10 # in meters
```
Note: The locators section and most of the optimization section can be left out if optimization is not wanted, as long as enabled is set to false

### Other Settings
```yaml

timeout: 30 # How long before device considered stale
away_timeout: 120 # How long before device is considered away

history:
  enabled: false # Enable to log history to db (Beta)
  expire_after: 24h # Expire after 24 hours
```

### Floor Configuration
Units are always meters.
```yaml
floors:
  - id: ground
    name: Ground Floor
    bounds: [[0, 0, 0], [10, 8, 3]]  # Bounds (x,y,z) of map in meters, in this example: 10m wide, 8m deep, 3m high ([[left, bottom, z], [right, top, z]]).
    rooms: # See Rooms Section
```

### Rooms

Rooms are all measured from the initial starting point, regardless of floor. Paste output from floor plan creator or measure manually. Units are always meters.

```yaml
rooms:
  - id: living-room
    name: Living Room
    floor: ground
    points:
      - [0,0]
      - [3,0]
      - [3,4]
      - [0,4]
```
Note: you can define 4 or more points depending on the shape of the room. Use clockwise or counter-clockwise order consistently across all rooms.

### Nodes
Create 1 node entry for each node. Units are always meters.
```yaml
nodes:
  - id: esp32-1 # optional
    name: Living Room Node
    room: living-room # room id, see rooms section
    point: [2,2,1]  # x,y,z coordinates within room
    floors: ["ground", "outside"] # floor id, LIST THE FLOOR THE NODE IS ON FIRST, followed by the next closest location.
```
Note: Multiple nodes can be mapped to one room, but each needs a unique name.

### Devices
```yaml
# Devices to track
devices:
  # Specific device
  - id: darrels-watch
    name: "Darrell's Watch"

  # Using wildcards
  - id: "tile:*"    # Track all tiles
  - id: "irk:*"     # Track all IRKs
  - id: "apple:*"   # Track all Apple devices
  - id: "ibeacon:*" # Track all iBeacon devices
  - name: "*"       # Track all named devices

# Devices to NOT track
exclude_devices:
  - id: "iBeacon:e5ca1ade-f007-ba11-0000-000000000000-*" # These are junk, we alias them to node:*
```

## Live Updates

The configuration file supports hot reloading, which means:
- Changes to the config file update in real-time
- You can adjust room coordinates and see immediate results
- Fine-tune node positions while watching the effects live
- No need to restart the companion after changes
- If there is unexpected behavior give the companion add-on a moment to implement the configuration, if unresolved or unresponsive a reboot (not restart of home assistant, a full reboot) of the host device can resolve the issue.

:::tip
Help improve this documentation! Click 'Edit page' below.
:::
