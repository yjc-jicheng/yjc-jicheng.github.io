import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const SITE = 'https://yjc-jicheng.github.io';

export default defineConfig({
  site: SITE,
  base: '/',                 // <username>.github.io 根部署，保持 '/'
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  build: { inlineStylesheets: 'auto' },
  devToolbar: { enabled: false },
});
