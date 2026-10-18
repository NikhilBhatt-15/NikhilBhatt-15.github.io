import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// SITE_URL lets you move to a custom domain (e.g. https://nikhilbhatt.tech) without code changes.
export default defineConfig({
  site: process.env.SITE_URL || 'https://nikhilbhatt-15.github.io',
  integrations: [sitemap()],
  devToolbar: { enabled: false },
  image: {
    // Movie posters and backdrops are hotlinked from these hosts.
    domains: ['image.tmdb.org', 'upload.wikimedia.org'],
  },
  markdown: {
    shikiConfig: { theme: 'vitesse-dark' },
  },
});
