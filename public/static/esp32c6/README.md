# ESP32-C6 Bootloader Files

This directory contains bootloader files for ESP32-C6 boards.

## Required Files

The following files need to be added from the ESP-IDF/platformio build:

- `bootloader.bin` - Default bootloader (typically DIO 40MHz)
- `bootloader_dio_40m.bin` - DIO flash mode, 40MHz
- `bootloader_dio_80m.bin` - DIO flash mode, 80MHz  
- `bootloader_dout_40m.bin` - DOUT flash mode, 40MHz
- `bootloader_dout_80m.bin` - DOUT flash mode, 80MHz
- `bootloader_qio_40m.bin` - QIO flash mode, 40MHz
- `bootloader_qio_80m.bin` - QIO flash mode, 80MHz
- `bootloader_qout_40m.bin` - QOUT flash mode, 40MHz
- `bootloader_qout_80m.bin` - QOUT flash mode, 80MHz
- `partitions.bin` - Partition table

## How to Generate

These files are generated when building ESPresense for ESP32-C6:

```bash
platformio run -e esp32c6
```

The bootloader files will be in `.pio/build/esp32c6/` directory.

## Note

The ESP32-C6 uses a different bootloader than ESP32/ESP32-C3/ESP32-S3 due to its RISC-V architecture and different ROM layout.
