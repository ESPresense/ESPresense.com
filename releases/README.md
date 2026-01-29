# Firmware Release Redirects

This directory structure supports ESPresense firmware update URLs. The actual redirects are handled by Cloudflare Pages using the `_redirects` file in the repository root.

## How It Works

The `/releases/latest-any/download/{firmware}.bin` URLs provide stable endpoints that always point to the latest firmware release. ESP32 devices use these URLs to automatically check for and install firmware updates.

### Redirect Mechanism

Cloudflare Pages processes the `_redirects` file to create HTTP 302 redirects:

```
/releases/latest-any/download/esp32.bin → https://github.com/ESPresense/ESPresense/releases/download/v4.0.0b14/esp32.bin
```

The 302 status code is essential for ESP32 firmware update detection - the device compares the redirect Location header to determine if an update is available.

### Automatic Updates

The redirects are automatically updated by the GitHub Action workflow `.github/workflows/update-redirects.yml` which:
- Runs every hour to check for new releases
- Can be manually triggered via workflow_dispatch
- Can be triggered by the ESPresense repo via repository_dispatch
- Updates the `_redirects` file to point to the latest release
- Commits changes which triggers Cloudflare Pages rebuild

## Supported Firmware Variants

- `esp32.bin` - Standard ESP32
- `esp32-verbose.bin` - ESP32 with verbose logging
- `esp32c3.bin` - ESP32-C3
- `esp32c3-cdc.bin` - ESP32-C3 with CDC USB
- `esp32c3-verbose.bin` - ESP32-C3 with verbose logging
- `esp32s3.bin` - ESP32-S3
- `esp32s3-cdc.bin` - ESP32-S3 with CDC USB
- `esp32s3-verbose.bin` - ESP32-S3 with verbose logging
- `m5atom.bin` - M5Atom
- `m5stickc.bin` - M5StickC
- `m5stickc-plus.bin` - M5StickC Plus
- `macchina-a0.bin` - Macchina A0

## Why Cloudflare Pages?

- **HTTP 302 support**: Real server-side redirects (not meta refresh)
- **Free tier**: Unlimited requests, 500 builds/month
- **Simple**: Just a `_redirects` file in the build output
- **Automatic deploys**: Connects directly to GitHub, rebuilds on push
- **Fast**: Global CDN distribution

## Testing

After deployment, test the redirects:

```bash
# Should return HTTP 302 with Location header
curl -I https://espresense.com/releases/latest-any/download/esp32.bin

# Expected response:
# HTTP/2 302
# location: https://github.com/ESPresense/ESPresense/releases/download/v4.0.0b14/esp32.bin
```

## Manual Updates

To manually update redirects to a specific version:

1. Edit the `_redirects` file in the repository root
2. Update the version tag in each redirect URL
3. Commit and push changes
4. Cloudflare Pages will automatically rebuild and deploy
