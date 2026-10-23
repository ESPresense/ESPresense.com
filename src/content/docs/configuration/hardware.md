---
title: Hardware
sidebar:
  order: 4
---


<img src="/images/hardware_screen.png" alt="Hardware page of the ESPresense node UI: LEDs, inputs, outputs, power, GPIO and I2C sensors" style="float:right;margin-left:20px;width:340px" />

The **Hardware** page in the node's web UI sets up what is wired to the board: LEDs, inputs (motion sensors, buttons, switches), outputs (relays), battery and energy metering, and sensors. To set a known board up in one go, apply its [board template](/configuration/templates); a template fills in the same fields. Saving restarts the node.

This page describes v5. v4 had fixed LED, PIR, radar, switch and button settings instead of the lists below; see [Upgrading from v4 to v5](/upgrading-to-v5).

**Board** names what the node is, e.g. `SwitchBot Plug Mini`. Applying a template sets it.

## LEDs

A list of up to 4 LEDs. Add one with **Add led**. LED 1 in the list is `led_1` in MQTT, LED 2 is `led_2`, and so on.

A generic board starts with one LED: PWM on GPIO 2, showing status. Boards without an LED there should use their template, or remove it.

* **Pin and type** - the GPIO, and what is on it:
  * **PWM** / **PWM Inverted** - a single plain LED. Inverted is for an LED wired to light when the pin is low.
  * **Addressable GRB** / **GRBW** / **RGB** / **RGBW** - a WS2812 / SK6812 strip or matrix, by its colour order.
* **Count** (addressable only) - how many LEDs are in the strip.
* **Max brightness (1-255)** - a ceiling. The full brightness range from MQTT and Home Assistant is scaled down into it. Defaults to 255 for PWM and 100 for addressable LEDs, so dense matrices don't overheat. Some boards need lower, e.g. the [M5 Atom Matrix](/nodes/m5atom-matrix).
* **LED Control** - what drives the LED:
  * **MQTT** - you do, from Home Assistant or MQTT. The only mode that creates a Home Assistant light. See [MQTT LED control](#mqtt-led-control).
  * **Status** - shows WiFi and MQTT connection, and update progress.
  * **Motion** - on while any input with the **Motion** role is on.
  * **Count** - on while the node counts at least one device (see [Counting](/configuration/settings#counting)).
  * **Output** - mirrors an output's state. **Output to show** picks which.

### MQTT LED control

When an LED is set to **LED Control = MQTT**, control it by publishing JSON to `espresense/rooms/<room>/led_<n>/set`, where `<room>` is the node's room name and `<n>` the LED's place in the list:

```bash
mosquitto_pub -h <broker> -u <username> -P <password> \
  -t "espresense/rooms/kitchen/led_1/set" \
  -m '{"state":"ON","brightness":64}'
```

`brightness` is 0-255. You can also include `color` (`r`, `g`, `b`), `white_value`, and `color_temp` in the same payload. The node publishes the LED's state to `espresense/rooms/<room>/led_<n>` and keeps it across restarts.

## Inputs

A list of up to 8 inputs: motion sensors, buttons and switches. Input 1 is `input_1` in MQTT, and so on.

* **Name** - shown in Home Assistant. Defaults to `Input <n>`.
* **Role**:
  * **Motion** - a PIR or radar sensor. Gets the motion device class in Home Assistant, and drives LEDs set to **Motion**.
  * **Button** - toggles a linked output on each press.
  * **Switch** - a linked output follows it.
* **Pin and type** - the GPIO, and its wiring. **Pullup**, **Pulldown** and **Floating** turn on the internal pull-up, pull-down or neither; the **Inverted** types read low as on. A button that connects the pin to ground is usually **Pullup Inverted**. Floating is for sensors that drive the pin themselves, or pins with an external pull resistor.
* **Timeout (in seconds)** - how long the input stays on after the pin goes inactive. Debounces buttons and switches, and holds motion on between triggers. Default 0.5.

Each input is a binary sensor in Home Assistant. Its state is published to `espresense/rooms/<room>/input_<n>` as `ON` / `OFF`.

#### LD2410(b/c)

These are 24 GHz radar motion sensors (B and C variants have integrated Bluetooth). ESPresense doesn't use their UART; connect power and ground, wire the **OUT** (occupied) pin to a GPIO, and add it as a **Motion** input, usually **Pulldown** or **Floating**.

## Outputs

A list of up to 8 outputs: relays, and pins that must be held at a fixed level. Output 1 is `output_1` in MQTT, and so on.

* **Name** - shown in Home Assistant. Defaults to `Output <n>`.
* **Pin and type**:
  * **Output** / **Output Inverted** - a switch in Home Assistant. Inverted drives the pin low for on.
  * **Always High** / **Always Low** - set at boot and never changed, with no MQTT or Home Assistant entity. For enable pins, such as the LED power pin on the [M5 NanoC6](/nodes/nanoc6) or the CAN standby pin on the [Macchina A0](/nodes/macchina-a0).
* **Power-on state** - **Off**, **On**, or **Restore last**, the state before the restart or power cut.
* **Linked input** - an input that controls the output locally, without Home Assistant. A **Button** input toggles it; a **Switch** or **Motion** input drives it on and off.

The node publishes an output's state to `espresense/rooms/<room>/output_<n>` and takes `ON`, `OFF` or `TOGGLE` on `espresense/rooms/<room>/output_<n>/set`.

## Power

### Battery

For battery-powered nodes, such as the [LILYGO T-Energy-S3](/nodes/t-energy-s3) or a node in a car.

* **AXP192 power chip** - for the M5StickC: reads the battery from its power chip instead of a pin. Needs I2C bus 2 on SDA 21 / SCL 22.
* **Voltage pin** - the GPIO the battery's voltage divider feeds. Must be an ADC1 pin (GPIO 32–39 on the ESP32, GPIO 1–10 on the S3), because WiFi uses ADC2.
* **Divider multiplier** - how much the divider scales the voltage down, e.g. 2 for two equal resistors.
* **Type** - **Li-ion (1 cell)**, or **12V lead-acid**.

With a battery set up, the node adds `batt` (%) and `mV` to its telemetry and creates **Battery** and **Battery Voltage** sensors in Home Assistant. Lead-acid and AXP192 batteries also get a **Charging** binary sensor; lead-acid counts as charging above 13.2 V (engine running). The Li-ion percentage comes from a resting curve (4.2 V full, 3.3 V empty), so it reads high while charging.

### Energy meter

For smart plugs with a power-metering chip, such as the [Athom Plug V3](/nodes/athom-pg03v3) or [SwitchBot Plug Mini](/nodes/switchbot-plug-mini). Use the plug's template; it has the right pins and calibration.

* **Chip** - **BL0937**, **HLW8012 / CSE7759**, or **CSE7766** (serial).
* **CSE7766:** only its **RX pin**. It's factory calibrated.
* **BL0937 / HLW8012:** the **CF**, **CF1** and **SEL** pins, **SEL polarity**, and the **Voltage divider** and **Current resistor** calibration values, which mean the same as in ESPHome's `hlw8012` platform.

The node publishes `power` (W), `energy` (kWh, kept across restarts) and, when it can measure them, `voltage` (V) and `current` (A) under `espresense/rooms/<room>/`, every 10 seconds, with Home Assistant sensors for each.

## GPIO Sensors

### DHT11 / DHT22

* **DHT11 / DHT22 sensor pin** - GPIO pin for the sensor.
* **DHT temperature / humidity offset** - calibration offsets added to the readings.

### DS18B20

* **DS18B20 sensor pin** - GPIO pin for the One-Wire bus.
* **DS18B20 temperature offset** - calibration offset for temperature readings.

### HX711 (weight)

* **HX711 SCK (clock) pin** and **DOUT (data) pin** - the load cell amplifier's two pins.

## I2C Settings

Configure up to 2 I2C buses. v5 has no default I2C pins: a bus is off until its pins are set, by hand or by a board template.

* **SDA pin** / **SCL pin** - the bus's two pins.
* **Debug I2C addresses** - scans the buses and logs the addresses found to the serial console.

## I2C Sensors

Each sensor has an **I2C Bus** (1 or 2) and usually an **I2C address**, with the chip's possible addresses shown next to it. The **Add-ons** pages have [templates](/configuration/templates) for common sensor boards, such as the [M5Stack ENV IV](/addons/m5stack-env-iv).

* **AHTX0**, **BH1750**, **BME280**, **BMP085/BMP180**, **BMP280**, **SGP30**, **SCD4x** - bus and address.
* **TSL2561** - bus, address and **gain** (auto, 1x, 16x).
* **SHT3x / SHT4x** (including SHT85) - bus only; the sensor is found at 0x44 or 0x45 automatically. The page also lists SHTC1/3, SHTW, SHT2x, HTU21D and Si7021, but v5 only detects SHT3x and SHT4x.

## Tips

* Set a pin to -1, or remove the list entry, to disable it.
* The pin pickers only offer pins that suit the setting: no flash or PSRAM pins, and input-only pins only for inputs.
* Addressable LEDs need a power supply that can carry them; keep **Max brightness** low on dense strips.
* Raise an input's **Timeout** if a motion sensor or switch flickers.

---

*Last verified against firmware v5 (`main` @ d456b99, 2026-10-23).*
