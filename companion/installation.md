---
layout: page
title: Installation
parent: Companion
nav_order: 1
---

# Installation

## Home Assistant OS (HAOS)

### Step 1: Add Repository
<div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
    <a href="https://my.home-assistant.io/redirect/supervisor_add_addon_repository/?repository_url=https%3A%2F%2Fgithub.com%2FESPresense%2Fhassio-addons">
        <img src="https://my.home-assistant.io/badges/supervisor_add_addon_repository.svg" alt="Open your Home Assistant instance and show the add add-on repository dialog with a specific repository URL pre-filled." />
    </a>
    <span>Click <code>Add</code></span>
</div>

### Step 2: Install
<div style="display: flex; align-items: center; gap: 10px;">
    <a href="https://my.home-assistant.io/redirect/supervisor_store/">
        <img src="https://my.home-assistant.io/badges/supervisor_store.svg" alt="Open your Home Assistant instance and show the Supervisor add-on store." />
    </a>
    <span>Click <code>Install</code>, <code>Start</code>, then <code>Show in Sidebar</code></span>
</div>

### Manual Add-on Installation (Alternative)

If the buttons above don't work for you, follow these steps to add the repository and install the add-on manually within Home Assistant:

1.  **Navigate to Add-ons:** Go to `Settings` > `Add-ons` in your Home Assistant UI.
2.  **Add Repository:**
    *   Click the `Add-on Store` button (usually bottom right).
    *   Click the three dots (⋮) menu in the top right corner and select `Repositories`.
    *   Paste the following URL into the "Add repository" field:
        ```
        https://github.com/ESPresense/hassio-addons
        ```
    *   Click `Add`.
    *   Close the repository management dialog.
3.  **Install ESPresense Companion:**
    *   Refresh the Add-on Store page (you might need to wait a moment or refresh your browser).
    *   Search for `ESPresense Companion`.
    *   Click on the `ESPresense Companion` add-on.
    *   Click `Install`.
    *   Once installed, click `Start`.
    *   Optionally, enable `Show in sidebar` for easy access.

## DIY Docker Container

Example docker-compose configuration:
```yaml
version: '3.7'
services:
  espresense:
    image: espresense/espresense-companion
    ports:
      - 8267:8267
    volumes:
      - ./data/espresense:/config/espresense
```

## MQTT Setup

ESPresense and ESPresense Companion require MQTT to function. Here's how to set it up:

### Using Home Assistant's MQTT Addon
1. Install the Mosquitto broker addon from the official add-on store
2. Start the addon
3. ESPresense Companion will automatically use these settings

### Using External MQTT Broker
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
```markdown
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
1. **Can't see the add-on in Home Assistant:**
   - Refresh your browser
   - Verify the repository was added successfully
   - Check the add-on store logs

2. **MQTT Connection Failed:**
   - Verify MQTT broker is running
   - Check credentials are correct
   - Ensure MQTT port (1883) is not blocked

3. **Docker Container Won't Start:**
   - Check port 8267 is not in use
   - Verify volume mount permissions
   - Review container logs
