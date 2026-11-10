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
| `GET` | `/json/devices?showAll=1` | Include invisible devices; visible entries have `"vis": true`. |
| `GET` | `/json/configs` | Enrolled device configs (`id`, `alias`, `name`, `rssi@1m`). |
| `GET` | `/json/tele` | Heap and fingerprint telemetry. |
| `GET` | `/json/template` | Export a board settings template. |
| `POST` | `/json/template` | Validate or import a board settings template. |
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

Add `?showAll=1` to include fingerprints that are normally invisible. With this parameter, entries that are normally visible have `"vis": true`; invisible entries do not have the `vis` field. The presence of `showAll` enables this behavior, regardless of its value.

## `GET /json/tele`

Returns `room`, `freeHeap`, `maxHeap`, and `fingerprints`. Heap values are in bytes; `maxHeap` is the largest allocatable block. This small response is designed to work when memory is too low for the streamed JSON endpoints. It returns HTTP 500 with an `error` if the response does not fit.

## Board templates: `/json/template`

`GET /json/template` exports `chip` and `settings`, with `name`, `firmware`, and `version` when available. `settings` contains the board's exportable settings. HTTP 429 indicates low memory; HTTP 500 indicates the template did not fit.

`POST /json/template` accepts a JSON object with a nonempty `settings` object and optional `name` and `chip`. If the template sets pins, `chip` is required and must match the node. Settings, values, and pins are validated before applying changes. A template can include more than hardware settings; passwords and runtime state are not importable. See the [template validation source](https://github.com/ESPresense/ESPresense/blob/1106c1f45bd56abe0402ffb0de22b637015c06f4/main/SettingsTemplate.h) for the accepted shape and validation rules.

Add `?dry` to validate and preview without writing. A successful response contains `restart` and a `changes` array with `key`, `from`, and `to` for each changed value. A non-dry import restarts the node when settings changed. Errors are JSON objects with an `error` field: 400 for invalid input, 413 when the body cannot be read or exceeds 6144 bytes, 429 for low memory, and 500 for a flash write failure. A flash write failure can occur after earlier settings have been written.

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
| `rssi@1m` | integer | no | Calibrated 1-meter RSSI for this device. Omit when uncalibrated. |

Response: `{"success": true}` (HTTP 200) when the MQTT config publication succeeds; HTTP 400 for invalid JSON or missing `id`, 413 if the body cannot be read or exceeds 2048 bytes, or 500 if publication fails. Errors have an `error` field. A successful response does not by itself confirm that every node has applied the config.

Saved configs are propagated to the whole fleet via the retained MQTT topic `espresense/settings/<id>/config` ([MQTT subscribed topics](/configuration/mqtt/#subscribed-topics)).

## `DELETE /json/configs`

```bash
curl -X DELETE "http://kitchen.local/json/configs?id=apple:iphone15-3"
```

Publishes an empty retained MQTT settings entry so nodes can remove the enrollment. Response shape matches `POST` — `{"success":true}` or `{"error":"..."}`. A missing `id` returns 400; a failed publication returns 500.

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

*Source checked against [firmware v5.0.0b8](https://github.com/ESPresense/ESPresense/tree/v5.0.0b8) on 2026-11-09. The GET endpoints were checked on an ESP32-S3 node; configuration writes, restart, and WebSocket commands were not tested on a device during this update.*
