---
layout: page
title: Sensors
permalink: /configuration/sensors
parent: "Configuration"
nav_order: 4
---

# Sensors

ESPresense supports various LED and GPIO sensor configurations for enhanced functionality and visual feedback. These settings are accessible from the full Settings view on the device web UI.

![Sensors section of the ESPresense settings UI](/images/sensors_screen.png){: width="360" }

## LEDs

Configure up to 3 addressable LEDs for visual feedback and status indication.

### LED Configuration

For each LED (LED 1, LED 2, LED 3), you can configure:

* **LED Type** - Select the type of addressable LED strip (WS2812, SK6812, etc.)
* **Pin (-1 to disable)** - GPIO pin number for the LED data line, or -1 to disable
* **Count (only applies to Addressable LEDs)** - Number of LEDs in the strip
* **LED Control** - Control mode for the LED behavior

## GPIO Sensors

Configure motion sensors, switches, and buttons connected to GPIO pins.

### PIR (Passive Infrared)

Motion detection using PIR sensors:

* **PIR motion pin type** - Input type configuration for the PIR sensor
* **PIR motion pin (-1 for disable)** - GPIO pin number for PIR sensor, or -1 to disable
* **PIR motion timeout (in seconds)** - How long to keep motion state active after detection

### Radar

Motion detection using radar sensors:

* **Radar motion pin type** - Input type configuration for the radar sensor
* **Radar motion pin (-1 for disable)** - GPIO pin number for radar sensor, or -1 to disable
* **Radar motion timeout (in seconds)** - How long to keep motion state active after detection

### Switches

Configure up to 2 switch inputs:

#### Switch One / Switch Two

* **Switch pin type** - Input type configuration for the switch
* **Switch pin (-1 for disable)** - GPIO pin number for the switch, or -1 to disable
* **Switch timeout (in seconds)** - Debounce timeout for switch activation

### Buttons

Configure up to 2 button inputs:

#### Button One / Button Two

* **Button pin type** - Input type configuration for the button
* **Button pin (-1 for disable)** - GPIO pin number for the button, or -1 to disable
* **Button timeout (in seconds)** - Debounce timeout for button presses

## Tips

* Set pin values to -1 to disable any unused sensors or LEDs
* Ensure GPIO pins don't conflict with other hardware functions
* Addressable LEDs require proper power supply for multiple LEDs
* Use appropriate timeout values to avoid false triggers on motion sensors
