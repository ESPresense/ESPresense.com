---
title: Nodes
sidebar:
  order: 3
---


The firmware is currently compatible with the original ESP32, ESP32-C3, and the ESP32-S3.  Generally C3 or S3 is recommended for new deployments.  The C3 is nice and cheap and the RISC-V is fast!  The S3 has better bluetooth range but is a bit more pricey.

It is not compatible with the ESP32-S2 (doesn't have bluetooth), ESP32-C6 (too new no support in our dev environment), or ESP8266 (old, no bluetooth).

## ESP32-C3

| Name                | Stores       | Notes |
|:--------------------|:------------:|-------|
| M5 Stamp C3 Mate    | [m5stack](https://shop.m5stack.com/products/m5stamp-c3-mate-with-pin-headers) [ali](https://s.click.aliexpress.com/e/_omweFp9) | Stamp form factor w/ 4MB flash memory, built-in 3D antenna, RGB LED and button |
| M5 Stamp C3U Mate   | [ali](https://s.click.aliexpress.com/e/_onkgbFp) | Stamp form factor w/ 4MB flash memory, built-in 3D antenna, RGB LED and button [^cdc] |
| ESP32-C3-DevKitM-1U | [amz/us](https://amzn.to/41WQXFa) | Espressif's official development board with ESP32-C3-MINI-1U module, 4MB flash, 160MHz CPU |

## ESP32-S3

| Name               | Stores         | Notes |
|:-------------------|:--------------:|-------|
| M5 Atom S3 Lite    | [ali](https://s.click.aliexpress.com/e/_oFSxCND) | 8MB flash memory, built-in 3D antenna, IR emitter,  RGB LED, Button and GROVE interface [^cdc] |
| M5 Atom S3U        | [ali](https://s.click.aliexpress.com/e/_opyVX2n) | USB-A w/ 8MB flash memory, built-in 3D antenna, IR emitter, PDM mic, RGB LED, Button and GROVE interface [^cdc] |
| M5 Stamp S3        | [ali](https://s.click.aliexpress.com/e/_oB3a0Dv) | Stamp form factor w/ 8MB flash memory, built-in 3D antenna, and RGB LED [^cdc] |
| Teyleten Robot | [amz/us](https://amzn.to/4jXMRUl) | 8MB flash and 2MB PSRAM dev board, sold as a 3-pack |

## ESP32

| Name                | Stores         | Notes |
|:--------------------|:--------------:|-------|
| M5 Atom (all kinds) | [ali](https://s.click.aliexpress.com/e/_oDWoyd1) [m5stack](https://shop.m5stack.com/collections/m5-controllers/products/atom-lite-esp32-development-kit) [digi](https://www.digikey.com/en/products/detail/m5stack-technology-co-ltd/C008/12088545) | The 3D antenna is much better |
| M5 Stamp Pico       | [ali](https://s.click.aliexpress.com/e/_olAPbYT) [m5stack](https://shop.m5stack.com/collections/m5-controllers/products/m5stamp-pico-diy-kit) | Small and still has nice 3D antenna |
| Huzzah32            | [amz/us](https://amzn.to/4kWlmw4) | Much better quality than generic ESP32 dev boards |

## Works with caveats

| Name               | Stores         | Notes |
|:-------------------|:--------------:|-------|
| ESP32 dev board clones   | [ali](https://s.click.aliexpress.com/e/_okTMXEr) [amz/us](https://amzn.to/4iWKv86) [amz/uk](https://amzn.to/4iyqHYK) | [^unbranded] No brand |
| D1 Mini ESP32 (Micro B)  | [amz/us](https://amzn.to/3tlkK8D) | [^unbranded] No brand *Make sure you get the ESP32 NOT the ESP8266* |
| D1 Mini ESP32 (Type C)   | [ali](https://s.click.aliexpress.com/e/_oC7KI4X) [amz/us](https://amzn.to/41VjFGq) | [^unbranded] No brand |
| LOLIN D32 ESP32    | [ali](https://s.click.aliexpress.com/e/_onxVPQX) | [^unbranded] No brand |
| M5Stick-C Plus     | [ali](https://s.click.aliexpress.com/e/_oo2TM0P) [m5stack](https://shop.m5stack.com/collections/m5-controllers/products/m5stickc-plus-esp32-pico-mini-iot-development-kit) [amz/us](https://amzn.to/4iOzTZj) | These are great little devices, but their built-in battery makes them less ideal |

## USB C chargers

* [20W USB C Wall Charger](https://amzn.to/4kXGphK) - Small Fast Charger with Foldable Plug
* [20W USB C Wall Charger (3 pack)](https://amzn.to/4hFLcBz)

## USB C to C cables

* [0.5ft USB C to C](https://amzn.to/4j02B9f)

## USB A chargers

* [Dual USB A 3 pack](https://amzn.to/4iA0EAq) - 3-pack of dual-port USB-A chargers with compact cube design

## USB A to C cables

* [16ft 2 pack](https://amzn.to/3zzTTXW)
* [1ft 6 pack](https://amzn.to/3kyD8Is)
* [Straight Adapter 4 Pack](https://amzn.to/4hNrh3O)
* [Right Angle Adapter 4 Pack](https://amzn.to/4bWWH6o)

## USB-A to Micro-B cables

* [0.5 ft Micro USB Cable](https://amzn.to/4hzksTa)

## Footnotes

[^unbranded]: These are cheap, but no brand usually means no quality control, especially on the WiFi/BLE components
[^cdc]: Use CDC firmware flavor
