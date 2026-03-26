// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

const [owner, repo] = (process.env.GITHUB_REPOSITORY ?? '').split('/');
const site = owner ? `https://${owner}.github.io` : 'https://example.com';
const base = repo ? `/${repo}` : '/';

// https://astro.build/config
export default defineConfig({
  site,
  base,
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
