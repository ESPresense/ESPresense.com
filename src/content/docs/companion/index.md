---
title: Companion
sidebar:
  order: 6
---


![GitHub release (latest by date)](https://img.shields.io/github/v/release/ESPresense/ESPresense-companion)
![Docker Pulls](https://img.shields.io/docker/pulls/espresense/espresense-companion)

A Home Assistant Add-on / Docker container that solves indoor positions using MQTT data received from multiple ESPresense nodes. The companion is the central brain of your ESPresense system. It:
- Processes distance readings from all nodes using trilateration to determine device locations
- Reports device room presence to Home Assistant via MQTT
- Visualizes BLE device locations on your floor plan
- Manages and configures ESPresense nodes
- Updates node firmware
- Adjusts device-specific settings
- Monitors and controls automatic node optimization

![image](https://user-images.githubusercontent.com/1491145/208942192-d8716e50-c822-48a7-a6d3-46b53ab9373e.png)

## Quick Start
1. [Install ESPresense Companion](/companion/installation)
2. [Configure your floor plan](/companion/configuration)
3. [Set up your nodes](/companion/configuration#node-placement)
4. [Optimize for accuracy](/companion/optimization)

## Need Help?
- Join our [Discord Community](https://discord.gg/jbqmn7V6n6)
- Check the [Troubleshooting Guide](/companion/troubleshooting)
- Contribute to this documentation by clicking "Edit this page" below
