---
title: Installation
sidebar:
  order: 1
---

Installing the ESPresense Companion is a combination of the Companion App itself and a MQTT server.

Companion deployment:

- Recommended: As an [App](#home-assistant-app) within Home Assistant
- Optional: As a (composed) [container](#containerized-deployment) elsewhere (experienced users)

MQTT setup:

- Recommended: Home Assistant [MQTT](#home-assistant-mqtt-app) App
- Alternative: [External](#external-mqtt-broker) MQTT broker

## Home Assistant App

### Two-step Install (Recommended!)

#### Step 1: Add Repository

<a href="https://my.home-assistant.io/redirect/supervisor_add_addon_repository/?repository_url=https%3A%2F%2Fgithub.com%2FESPresense%2Fhassio-addons">
  <img src="https://my.home-assistant.io/badges/supervisor_add_addon_repository.svg"
       alt="Add ESPresense App repository to Home Assistant" />
</a>

Click **Add** in the dialog.

#### Step 2: Install

<a href="https://my.home-assistant.io/redirect/supervisor_store/">
  <img src="https://my.home-assistant.io/badges/supervisor_store.svg"
       alt="Open Home Assistant Supervisor App store" />
</a>

Click **Install**, **Start**, then **Show in Sidebar**.

### Manual App Installation

If the buttons above don't work for you, follow these steps to add the repository and install the app manually within Home Assistant:

1.  **Navigate to Apps:** Go to `Settings` > `Add-ons` in your Home Assistant UI.
2.  **Add Repository:**
    *   Click the `Apps Store` button (usually bottom right).
    *   Click the three dots menu in the top right corner and select `Repositories`.
    *   Paste the following URL into the "Add repository" field:
        ```
        https://github.com/ESPresense/hassio-addons
        ```
    *   Click `Add`.
    *   Close the repository management dialog.
3.  **Install ESPresense Companion:**
    *   Refresh the Apps Store page (you might need to wait a moment or refresh your browser).
    *   Search for `ESPresense Companion`.
    *   Click on the `ESPresense Companion` app.
    *   Click `Install`.
    *   Once installed, click `Start`.
    *   Optionally, enable `Show in sidebar` for easy access.

### Containerized Deployment

Example docker-compose configuration:

```yaml title="compose.yaml"
services:
  espresense:
    image: espresense/espresense-companion
    ports:
      - 8267:8267
      - 8268:8268
    volumes:
      - ./data/espresense:/config/espresense
```

Port `8268` is required for firmware updates.

## MQTT Setup

ESPresense and ESPresense Companion require MQTT to function. Here's two ways to set it up:

#### Home Assistant MQTT App
1. Install the Mosquitto broker app from the official app store
2. Start the app
3. ESPresense Companion will automatically use these settings

### External MQTT Broker
1. Install [Mosquitto](https://mosquitto.org/) or your preferred MQTT broker
2. Note your configuration:
   - Host
   - Port (default 1883)
   - Username
   - Password
3. You'll need these details for the configuration step

### MQTT Discovery
- Enable MQTT Discovery ("auto-discovered") in your MQTT configuration
- If disabled, you'll need to manually configure MQTT settings in the Companion's MQTT tab

### Node Configuration
After installation, configure your ESPresense nodes by setting maximum distance to zero. To modify the maximum distance, send an MQTT message (in Home Assistant, Settings->MQtt->Configure, "Publish a packet"?) :
```text
key: espresense/rooms/*/max_distance/set
value: 0
```
This ensures you get all distance readings without filtering.

## Next Steps

Once installation is complete:
1. Move on to [Configuration](/companion/configuration) to set up your floor plan
2. Place your nodes according to the [Node Placement Guide](/companion/configuration#node-placement)
3. Start tracking your devices!

## Troubleshooting Installation

### Common Issues:
1. **Can't see the app in Home Assistant:**
   - Refresh your browser
   - Verify the repository was added successfully
   - Check the app store logs

2. **MQTT Connection Failed:**
   - Verify MQTT broker is running
   - Check credentials are correct
   - Ensure MQTT port (1883) is not blocked

3. **Docker Container Won't Start:**
   - Check port 8267 is not in use
   - Verify volume mount permissions
   - Review container logs
