# ESPresense.com

Source for <https://espresense.com>, the documentation site for [ESPresense](https://github.com/ESPresense/ESPresense) — an ESP32-based indoor positioning system.

Built with [Astro](https://astro.build/) and [Starlight](https://starlight.astro.build/). Deployed to Cloudflare Pages from `main`.

## Develop locally

You need Node 22 (see [`.nvmrc`](./.nvmrc)) and npm.

```sh
npm install
npm run dev
```

The site renders at <http://localhost:4321> with hot reload.

Other scripts:

```sh
npm run build      # production build to ./dist
npm run preview    # serve the production build locally
```

## Where pages live

- `src/content/docs/` — Markdown (`.md`) and MDX (`.mdx`) pages.
- `astro.config.mjs` — sidebar layout and URL redirects.
- `public/images/` — committed images (screenshots, diagrams).

## Contributing

Read **[CONTRIBUTING-docs.md](./CONTRIBUTING-docs.md)** before opening a PR. It covers:

- Which [Diataxis](https://diataxis.fr/) mode (tutorial / how-to / reference / explanation) fits which kind of page.
- The docs quality bar — verified commands, dated freshness lines, real diagrams, no abandoned drafts.
- How to submit a PR and what to expect on review.
- The voice we're aiming for.

For the firmware and the desktop daemon, see the upstream repos:

- Firmware: <https://github.com/ESPresense/ESPresense>
- Companion: <https://github.com/ESPresense/ESPresense-companion>

Questions: [Discussions](https://github.com/ESPresense/ESPresense/discussions) or [Discord](https://discord.gg/jbqmn7V6n6).
