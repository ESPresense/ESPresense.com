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
  // v5 firmware (ESPresense#2530) also has JSON settings (`leds`, `inputs`, `outputs`, `power`),
  // written here as YAML lists/objects and passed through as-is.
  template: z.record(z.string(), z.union([z.number(), z.string(), z.boolean(), z.array(z.record(z.string(), z.unknown())), z.record(z.string(), z.unknown())])),
  verified: z.string().optional(),
});

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({ extend: z.object({ board: board.optional() }) }),
  }),
};
