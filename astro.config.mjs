import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import rehypeExternalLinks from 'rehype-external-links';
export default defineConfig({
  site: 'https://espresense.com',
  markdown: {
    rehypePlugins: [
      [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
    ],
  },
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
        {
          label: 'Getting started',
          items: [
            { slug: 'approach' },
            { slug: 'quick-start' },
            { slug: 'external-resources' },
          ],
        },
        {
          label: 'Nodes',
          items: [
            { slug: 'nodes', label: 'Overview' },
            // One flat list, alphabetical. Explicit labels so each board's sidebar
            // name is the short model name, separate from its longer page title.
            {
              label: 'Boards',
              collapsed: true,
              items: [
                { label: 'Athom Plug V3', link: '/nodes/athom-pg03v3' },
                { label: 'ESP32-Ethernet-Kit', link: '/nodes/esp32-ethernet-kit' },
                { label: 'ESP32-S3-ETH', link: '/nodes/waveshare-esp32-s3-eth' },
                { label: 'EST-PoE-32', link: '/nodes/est-poe-32' },
                { label: 'GL-S10', link: '/nodes/gl-s10' },
                { label: 'M5 Atom Matrix', link: '/nodes/m5atom-matrix' },
                { label: 'M5 Atom S3 Lite', link: '/nodes/atom-s3-lite' },
                { label: 'M5 NanoC6', link: '/nodes/nanoc6' },
                { label: 'M5 Stamp C3', link: '/nodes/stamp-c3' },
                { label: 'M5StickC Plus', link: '/nodes/m5stickc-plus' },
                { label: 'Macchina A0', link: '/nodes/macchina-a0' },
                { label: 'Olimex ESP32-POE-ISO', link: '/nodes/olimex-esp32-poe' },
                { label: 'QuinLED-ESP32 Ethernet', link: '/nodes/quinled-esp32' },
                { label: 'SwitchBot Plug Mini', link: '/nodes/switchbot-plug-mini' },
                { label: 'T-Energy-S3', link: '/nodes/t-energy-s3' },
                { label: 'T-ETH-Lite ESP32', link: '/nodes/lilygo-t-eth-lite' },
                { label: 'T-Internet-POE', link: '/nodes/lilygo-t-internet-poe' },
                { label: 'wESP32', link: '/nodes/wesp32' },
                { label: 'WT32-ETH01', link: '/nodes/wt32-eth01' },
                { label: 'XIAO ESP32S3', link: '/nodes/xiao-esp32s3' },
              ],
            },
            {
              label: 'Add-ons',
              items: [
                { label: 'Grove AHT20', link: '/addons/grove-aht20' },
                { label: 'Grove Barometer', link: '/addons/grove-barometer' },
                { label: 'Grove BME280', link: '/addons/grove-bme280' },
                { label: 'Grove SCD41', link: '/addons/grove-scd41' },
                { label: 'Grove SGP30', link: '/addons/grove-sgp30' },
                { label: 'Grove SHT31 / SHT40', link: '/addons/grove-sht' },
                { label: 'Grove TSL2561', link: '/addons/grove-tsl2561' },
                { label: 'M5Stack CO2 / CO2L', link: '/addons/m5stack-co2' },
                { label: 'M5Stack DLight', link: '/addons/m5stack-dlight' },
                { label: 'M5Stack ENV II', link: '/addons/m5stack-env-ii' },
                { label: 'M5Stack ENV II HAT', link: '/addons/m5stack-env-ii-hat' },
                { label: 'M5Stack ENV III', link: '/addons/m5stack-env-iii' },
                { label: 'M5Stack ENV IV', link: '/addons/m5stack-env-iv' },
                { label: 'M5Stack TVOC', link: '/addons/m5stack-tvoc' },
              ],
            },
            { slug: 'firmware' },
            { slug: 'espreswitch', label: 'ESPreSwitch (SwitchBot Plug)' },
            { slug: 'enclosures' },
          ],
        },
        {
          label: 'Node Configuration',
          items: [
            { slug: 'configuration/network' },
            { slug: 'configuration/settings' },
            { slug: 'configuration/hardware' },
            { slug: 'configuration/templates' },
            { slug: 'configuration/mqtt' },
            { slug: 'configuration/rest-api' },
          ],
        },
        {
          label: 'Trackable Devices',
          items: [
            { slug: 'devices', label: 'Overview' },
            { slug: 'android' },
            { slug: 'apple' },
            { slug: 'other' },
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
            { slug: 'guides/enrolling-devices' },
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
        { slug: 'credits' },
      ],
    }),
  ],
});
