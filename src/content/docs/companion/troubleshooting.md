---
title: Troubleshooting
sidebar:
  order: 4
---


## Installation Issues

### Add-on Not Appearing
- Refresh your browser cache
- Re-add the repository using the button on the [Installation page](/companion/installation)
- Check add-on store logs for repository errors

### Container Issues
- Check if port 8267 is already in use
- Verify volume mount permissions
- Review container logs using `docker logs espresense-companion`
- Check firewall settings
- Verify container network mode

## MQTT Issues

### Connection Problems
- Verify MQTT broker is running
- Check credentials in config.yaml match your MQTT setup
- Ensure port 1883 is not blocked
- Test MQTT connection using MQTT Explorer
- Check broker logs

### Discovery Not Working
- Verify "Discovery" is enabled in MQTT configuration
- Check MQTT logs for discovery messages
- Try manually configuring MQTT in the Companion's MQTT tab

## Configuration Issues

### Room Layout Problems
- Verify floor ID matches between rooms and floor sections
- Check points format: `[[x,y], [x,y]]`
- Ensure coordinates are within floor bounds
- Confirm measurements use consistent units
- Verify origin point (0,0) is at bottom-left
- Check room points are in clockwise/counter-clockwise order
- Look for overlapping room definitions

### Node Configuration
- Confirm room ID matches between nodes and rooms sections
- Verify coords are within room boundaries
- Check that each node has a unique name
- Ensure node maximum distance is set to 0
- Verify node firmware version

## Device Tracking Issues

### Device Not Appearing
- Check devices tab for MQTT messages
- Verify device ID format matches wildcards
- Ensure BLE device is broadcasting
- Check number of node fixes (aim for 5+)

### Inaccurate Location
- Hover over device to see distance circles
- Verify node placement follows recommended guidelines
- Check for interference sources
- Review node optimization status
- Verify RSSI@1m calibration
- Ensure list of floors for nodes begins with the floor it is located on followed by the adjacent floors.

## Log Files
Check these logs for troubleshooting:

### Companion Logs
- Home Assistant add-on: Check add-on logs
- Docker: Use `docker logs espresense-companion`
- Look for error messages and connection issues

### MQTT Topics to Monitor
```
espresense/rooms/+/max_distance  # Node distance settings
espresense/devices/+             # Device updates
espresense/rooms/+/telemetry     # Node status
```

## Quick Fixes

### No Position Found
- Ensure you have at least 3 nodes for basic positioning
- Check that node maximum distance is set to 0
- Ensure each node has a unique name

### Poor Accuracy
1. Check Node Coverage:
   - Verify 5+ nodes can see device
   - Check node placement matches guidelines
   - Look for dead zones in coverage

2. Check Settings:
   - Verify node maximum distance is 0
   - Review device RSSI@1m values
   - Check node optimization results

### System Reset Steps
1. Soft Reset:
   - Restart the companion service
   - Clear browser cache
   - Re-subscribe to MQTT topics

2. Hard Reset:
   - Backup config.yaml
   - Remove and reinstall add-on
   - Restore configuration
   - Reconfigure nodes

## Getting Help

If you're still having issues:
1. Join our [Discord Community](https://discord.gg/jbqmn7V6n6) - The fastest way to get help and discuss ESPresense
2. Check [GitHub Issues](https://github.com/ESPresense/ESPresense-companion/issues)
3. Create a new issue with:
   - Your config.yaml (redact sensitive info)
   - Error messages/logs
   - Steps to reproduce
   - Expected vs actual behavior

## Help write this documentation! Click the edit this page below.
