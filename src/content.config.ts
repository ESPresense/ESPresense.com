import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';

// Per-board pages (src/content/docs/nodes/*.mdx) carry a `board` block that
// <BoardPage /> renders as the header box, GPIO table and settings template.
const board = z.object({
  name: z.string(),
  chip: z.enum(['ESP32', 'ESP32-S3', 'ESP32-C3', 'ESP32-C6']),
  formFactor: z.string(),
  flash: z.string(),
  antenna: z.string(),
  usb: z.string().optional(),
  install: z.string(),
  rating: z.enum(['recommended', 'caveats', 'avoid']),
  ratingNote: z.string(),
  price: z.string().optional(),
  stores: z.array(z.object({ label: z.string(), url: z.string().url() })).default([]),
  gpio: z.array(z.object({ pin: z.number(), use: z.string(), setting: z.string().optional() })),
  // Firmware setting values, emitted as the template's "settings". Any endpoint's keys work
  // (e.g. `eth` from the main page). Dropdowns are option indexes, as the firmware stores them.
  // v5 firmware (ESPresense#2530) has JSON settings (`leds`, `inputs`, `outputs`, `power`),
  // written here as YAML lists/objects and passed through as-is.
  template: z.record(z.string(), z.union([z.number(), z.string(), z.boolean(), z.array(z.record(z.string(), z.unknown())), z.record(z.string(), z.unknown())])),
  // Oldest firmware that accepts every key in the template; older versions reject unknown keys.
  firmware: z.string().default('5.0.0b1'),
  verified: z.string().optional(),
});

// Add-on pages (src/content/docs/addons/*.mdx) carry an `addon` block: a sensor or module that
// plugs into a board. Its template names only the add-on's own settings, with no "chip" or pins,
// so it stacks on any board template that set up the connection (e.g. the GROVE I2C pins).
const settings = z.record(z.string(), z.union([z.number(), z.string(), z.boolean()]));
const addon = z.object({
  name: z.string(),
  connection: z.string(),
  sensors: z.string(),
  stores: z.array(z.object({ label: z.string(), url: z.string().url() })).default([]),
  template: settings.optional(),
  // Versions of one module that need different settings (e.g. a BMP280 or an older BMP180 board),
  // keyed by name; the page shows each with <AddonPage part="template" variant="..." />.
  variants: z.record(z.string(), settings).optional(),
  // Only for an add-on that brings its own pins (e.g. an M5StickC HAT on GPIO 0/26): the
  // template then names the chip, since pin numbers mean different things on each chip.
  chip: z.enum(['esp32', 'esp32c3', 'esp32c6', 'esp32s3']).optional(),
  verified: z.string().optional(),
}).refine((a) => a.template || a.variants, { message: 'an add-on needs a template or variants' });

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({ extend: z.object({ board: board.optional(), addon: addon.optional() }) }),
  }),
};
