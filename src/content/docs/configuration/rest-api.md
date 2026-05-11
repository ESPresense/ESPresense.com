---
title: REST API
sidebar:
  order: 5
---


Each ESPresense node runs a small HTTP server on its Wi-Fi address. The web UI uses it, the Companion calls it, and you can call it directly when scripting an install.

The API is unauthenticated and CORS-open (`Access-Control-Allow-Origin: *`). Treat the node like any other unauthenticated device on your LAN — keep it off the public internet.

The base URL is `http://<node-ip>` or `http://<node-hostname>.local` (mDNS, when enabled). Examples below use `kitchen.local`.

## Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/json` | Node info: room name, firmware version, board variant. |
| `GET` | `/json/devices` | Currently-tracked devices with distance, RSSI, and id. |
| `GET` | `/json/devices?showAll=1` | Same, plus invisible/filtered devices marked with `"vis": true`. |
| `GET` | `/json/configs` | Enrolled device configs (`id`, `alias`, `name`, `rssi@1m`). |
| `POST` | `/json/configs` | Add or update an enrolled device config. |
| `DELETE` | `/json/configs?id=<id>` | Remove an enrolled device config by id. |
| `POST` | `/restart` *(or `/reboot`)* | Restart the node. |
| WebSocket | `/ws` | Live state stream (room name, enrollment status). Used by the web UI. |

The static web UI (Svelte / SvelteKit) is served from `/` and its sub-paths (`/ui/...`) — those are not part of the REST surface.

## `GET /json`

```bash
curl http://kitchen.local/json
```

```json
{
  "room": "Kitchen",
  "ver": "4.0.6",
  "firm": "esp32"
}
```

`ver` and `firm` are present when the build set the `VERSION` and `FIRMWARE` macros (which the released artifacts always do; manual local builds may omit them).

## `GET /json/devices`

```bash
curl http://kitchen.local/json/devices
```

```json
{
  "room": "Kitchen",
  "ver": "4.0.6",
  "firm": "esp32",
  "devices": [
    {
      "id": "apple:iphone15-3",
      "name": "Dan's iPhone",
      "rssi@1m": -59,
      "rssi": -71,
      "distance": 2.4,
      "mac": "aabbccddeeff",
      "...": "..."
    }
  ]
}
```

Each entry is one currently-tracked BLE fingerprint. The full shape is what `BleFingerprint::fill()` emits — id, friendly name (if known), MAC, computed distance in meters, last-seen RSSI, calibrated RSSI@1m, and signal-source flags.

Add `?showAll=1` to include fingerprints that are normally suppressed by `include` / `exclude` / `max_distance` filtering. Suppressed entries are tagged `"vis": true` so you can distinguish them.

## `GET /json/configs`

```bash
curl http://kitchen.local/json/configs
```

```json
{
  "room": "Kitchen",
  "ver": "4.0.6",
  "firm": "esp32",
  "configs": [
    { "id": "apple:iphone15-3", "alias": "dans-iphone", "name": "Dan's iPhone", "rssi@1m": -59 },
    { "id": "irk:abcdef0123456789abcdef0123456789", "alias": "watch", "name": "Dan's Watch" }
  ]
}
```

`rssi@1m` is omitted when the device hasn't been calibrated.

## `POST /json/configs`

Add or update an enrollment. The body is JSON.

```bash
curl -X POST http://kitchen.local/json/configs \
  -H "Content-Type: application/json" \
  -d '{
    "id": "apple:iphone15-3",
    "alias": "dans-iphone",
    "name": "Dan'\''s iPhone",
    "rssi@1m": -59
  }'
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | string | yes | The fingerprint id to bind to (`apple:...`, `irk:...`, `known:...`, etc.). |
| `alias` | string | no | Stable id to publish under instead of `id`. Defaults to `id` when omitted. |
| `name` | string | no | Friendly name (shown in the web UI). |
| `rssi@1m` | integer | no | Calibrated 1-meter RSSI for this device. Omit (or send `-128`) for "uncalibrated". |

Response: `{"success": true}` (HTTP 200) on save; HTTP 400 / 500 with `{"error":"..."}` on bad input or storage failure.

Saved configs are propagated to the whole fleet via the retained MQTT topic `espresense/settings/<id>/config` ([MQTT subscribed topics](/configuration/mqtt/#subscribed-topics)).

## `DELETE /json/configs`

```bash
curl -X DELETE "http://kitchen.local/json/configs?id=apple:iphone15-3"
```

Removes the enrollment locally and clears the retained MQTT settings entry (so other nodes drop it too). Response shape matches `POST` — `{"success":true}` or `{"error":"..."}`.

## `POST /restart`

```bash
curl -X POST http://kitchen.local/restart
```

Returns `Restarting...` (text/plain) and reboots. `/reboot` is an alias.

## WebSocket `/ws`

The web UI opens a WebSocket to receive live state updates while you watch the device. Messages are JSON and currently carry:

```json
{ "state": { "enrolling": true, "remain": 117 }, "room": "Kitchen", "ver": "4.0.6" }
```

`enrolledId` is included when the most recent enroll succeeded. Clients can send `{"command":"enroll","payload":"name"}` or `{"command":"cancelEnroll"}` over the socket — both map to the same handler as the MQTT [enrollment commands](/configuration/mqtt/#commands).

---

*Last verified against firmware v4.0.6 (`main` @ d9a1765, 2026-05-10).*
