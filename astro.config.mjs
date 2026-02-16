import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://espresense.com',
  adapter: cloudflare(),
  redirects: {
    '/beacons': '/devices',
    '/beacons/android': '/android',
    '/beacons/apple': '/apple',
    '/beacons/other': '/other',
    '/base-stations': '/nodes',
    '/hardware': '/nodes',
    '/install': '/firmware',
    '/data-flow': '/troubleshooting/data-flow',
    '/ids': '/troubleshooting/ids',
    '/terminal': '/troubleshooting/terminal',
    '/troubleshooting': '/troubleshooting/data-flow',
    '/troubleshooting/rebooting': '/troubleshooting/reboot-loops',
    '/integrations/home_assistant': '/integrations/home-assistant',
  },
  integrations: [
    starlight({
      title: 'ESPresense',
      description: 'ESP32 based indoor positioning system',
      logo: {
        light: './src/assets/images/logo.svg',
        dark: './src/assets/images/logo-dark.svg',
      },
      customCss: ['./src/styles/custom.css'],
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/ESPresense/ESPresense' },
        { icon: 'discord', label: 'Discord', href: 'https://discord.gg/jbqmn7V6n6' },
        { icon: 'rocket', label: 'Suggest Features', href: 'https://espresense.featurebase.app/' },
      ],
      editLink: {
        baseUrl: 'https://github.com/ESPresense/ESPresense.com/edit/main/',
      },
      head: [
        { tag: 'script', attrs: { src: 'https://analytics.ahrefs.com/analytics.js', 'data-key': '3gYSSnCtr/YAaiX2p0jWVQ', async: true } },
        { tag: 'script', attrs: { src: 'https://www.googletagmanager.com/gtag/js?id=G-5RPPLMZ514', async: true } },
        { tag: 'script', content: "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-5RPPLMZ514',{anonymize_ip:true});" },
      ],
      sidebar: [
        { label: 'Home', link: '/' },
        { slug: 'quick-start' },
        { slug: 'nodes' },
        { slug: 'firmware' },
        {
          label: 'Devices',
          items: [
            { slug: 'devices', label: 'Overview' },
            { slug: 'android' },
            { slug: 'apple' },
            { slug: 'other' },
          ],
        },
        {
          label: 'Configuration',
          items: [
            { slug: 'configuration/network' },
            { slug: 'configuration/settings' },
            { slug: 'configuration/hardware' },
          ],
        },
        {
          label: 'MQTT',
          items: [
            { slug: 'configuration/mqtt' },
          ],
        },
        {
          label: 'Companion',
          items: [
            { slug: 'companion', label: 'Overview' },
            { slug: 'companion/installation' },
            { slug: 'companion/configuration' },
            { slug: 'companion/optimization' },
            { slug: 'companion/troubleshooting' },
            { slug: 'companion/faq' },
          ],
        },
        {
          label: 'Integrations',
          items: [
            { slug: 'integrations/home-assistant' },
            { slug: 'integrations/homebridge' },
            { slug: 'integrations/domoticz' },
          ],
        },
        {
          label: 'Guides',
          items: [
            { slug: 'guides/calibration' },
            { slug: 'guides/technical' },
          ],
        },
        {
          label: 'Troubleshooting',
          items: [
            { slug: 'troubleshooting/data-flow' },
            { slug: 'troubleshooting/ids' },
            { slug: 'troubleshooting/logs' },
            { slug: 'troubleshooting/reboot-loops' },
            { slug: 'troubleshooting/terminal' },
          ],
        },
        { slug: 'enclosures' },
        { slug: 'credits' },
      ],
    }),
  ],
});
