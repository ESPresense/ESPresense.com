---
title: Data Flow Diagram
slug: troubleshooting/data-flow
sidebar:
  order: 1
---


It can be a challenge to troubleshoot problems with tracking a beacon, as the problem can exist in different places in the "information pipeline." The flow of information can be visualized in the following way:

![Beacon Flow](/images/beacon_flow.jpg)

1. Beacon broadcasts an advertisement packet.
2. ESP32 collects the broadcast (green arrow)
3. ESP32 verifies connection to WiFi (orange arrow)
4. ESP32 verifies connection to MQTT (yellow arrow)
5. MQTT publishes data to `espresense` topic (purple arrow)
6. Home Assistant parses information and reports configured sensors
