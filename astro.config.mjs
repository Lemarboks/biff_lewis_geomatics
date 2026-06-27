import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

const site = process.env.SITE_URL || 'https://www.blgeomatics.co.za';
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site,
  base,
  build: {
    format: 'file',
  },
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        webp: { quality: 76, effort: 5 },
        avif: { quality: 62, effort: 4 },
        jpeg: { quality: 78, mozjpeg: true },
        png: { quality: 78 },
      },
    },
    dangerouslyProcessSVG: true,
    responsiveStyles: true,
    breakpoints: [320, 480, 640, 800],
  },
  integrations: [sitemap()],
  trailingSlash: 'never',
});