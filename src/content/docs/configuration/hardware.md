---
title: Hardware
sidebar:
  order: 4
---


ESPresense supports various LED and GPIO sensor configurations for enhanced functionality and visual feedback. These settings are accessible from the **Hardware** page in the device web UI.

<img src="/images/hardware_screen.png" alt="Sensors section of the ESPresense settings UI" style="float:right;margin-left:20px;width:340px" />

## LEDs

Configure up to 3 addressable LEDs for visual feedback and status indication.

### LED Configuration

For each LED (LED 1, LED 2, LED 3), you can configure:

* **LED Type** - Select the type of addressable LED strip (WS2812, SK6812, etc.)
* **Pin (-1 to disable)** - GPIO pin for the LED data line, or -1 to disable
* **Count (only applies to Addressable LEDs)** - Number of LEDs in the strip
* **LED Control** - Control mode for the LED behavior

### MQTT LED control (v4.0)

When an LED is set to **LED Control = MQTT**, you can control it by publishing JSON to:

* `espresense/rooms/<room>/led_1/set`
* `espresense/rooms/<room>/led_2/set`
* `espresense/rooms/<room>/led_3/set`

`<room>` is your node's room name (same topic prefix used for other room settings).

Brightness is set using the `brightness` field (0-255):

```bash
mosquitto_pub -h <broker> -u <username> -P <password> \
  -t "espresense/rooms/kitchen/led_1/set" \
  -m '{"state":"ON","brightness":64}'
```

You can also include `color` (`r`,`g`,`b`), `white_value`, and `color_temp` in the same JSON payload.

## GPIO Sensors

Configure motion sensors, switches, and buttons connected to GPIO pins.

### PIR (Passive Infrared)

Motion detection using PIR sensors:

* **PIR motion pin type** - Input type configuration for the PIR sensor
* **PIR motion pin (-1 for disable)** - GPIO pin for PIR sensor, or -1 to disable
* **PIR motion timeout (in seconds)** - How long to keep motion state active after detection

### Radar

Motion detection using radar sensors:

* **Radar motion pin type** - Input type configuration for the radar sensor
* **Radar motion pin (-1 for disable)** - GPIO pin for radar sensor, or -1 to disable
* **Radar motion timeout (in seconds)** - How long to keep motion state active after detection

#### LD2410(b/c)
These are 24GHz radar motion sensors (B & C variants have integrated Bluetooth). These devices have a UART serial port which is unused by ESPresense; we use a single pin to indicate motion/static presence.

To use these with ESPresense, connect Power and Ground, and wire the 'Occupied' pin to a GPIO. Configure it with `Radar motion pin type` as needed (usually `Pullup` or `Input` depending on wiring).

### Pin Types
For GPIO sensors (PIR, Radar, Switches, Buttons), the following pin types are available to match your hardware wiring:
* Pullup / Pullup Inverted
* Pulldown / Pulldown Inverted
* Floating / Floating Inverted

### Switches

Configure up to 2 switch inputs:

#### Switch One / Switch Two

* **Switch pin type** - Input type configuration for the switch
* **Switch pin (-1 for disable)** - GPIO pin for the switch, or -1 to disable
* **Switch timeout (in seconds)** - Debounce timeout for switch activation

### Buttons

Configure up to 2 button inputs:

#### Button One / Button Two

* **Button pin type** - Input type configuration for the button
* **Button pin (-1 for disable)** - GPIO pin for the button, or -1 to disable
* **Button timeout (in seconds)** - Debounce timeout for button presses

## Temperature Sensors

Configure various temperature and humidity sensors.

### DHT11 / DHT22

* **DHT11/DHT22 sensor pin** - GPIO pin for the sensor
* **DHT temperature offset** - Calibration offset for temperature readings

### DS18B20

* **DS18B20 sensor pin** - GPIO pin for the One-Wire bus
* **DS18B20 temperature offset** - Calibration offset for temperature readings

## I2C Settings

Configure up to 2 I2C buses.

### Bus 1 / Bus 2

* **SDA pin** - GPIO pin for Serial Data
* **SCL pin** - GPIO pin for Serial Clock
* **Debug I2C addresses** - Scans the bus and logs found addresses to serial console

## I2C Sensors

Configure various I2C environmental and light sensors.

### General Sensors
Supported sensors: AHTX0, BH1750, BME280, BMP085, BMP280, TSL2561, SGP30, SCD4x.

* **I2C Bus** - Select which I2C bus (1 or 2) the sensor is connected to.
* **I2C address** - Specific hex address (e.g., 0x76).
* **Gain (TSL2561 only)** - Luminous gain setting (auto, 1x, 16x).

### SHT Series
Supported sensors: SHT3x, SHT4x, SHT85.

* **I2C Bus (-1 to disable)** - Select bus or -1 to disable.

## Weight Sensor (HX711)

Configure a load cell amplifier.

* **HX711 SCK (Clock) pin** - GPIO pin for the clock line.
* **HX711 DOUT (Data) pin** - GPIO pin for the data line.

## Tips

* Set pin values to -1 to disable any unused sensors or LEDs
* Ensure GPIO pins don't conflict with other hardware functions
* Addressable LEDs require proper power supply for multiple LEDs
* Use appropriate timeout values to avoid false triggers on motion sensors
