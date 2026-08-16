// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// While previewing on GitHub Pages' default URL, `site` + `base` point at the
// project page. At domain cutover: set site to 'https://www.kettle.games',
// remove `base`, and add public/CNAME (see README "Going live on kettle.games").
export default defineConfig({
  site: 'https://playfulbacon.github.io',
  base: '/studio-website',
  integrations: [sitemap()],
});
