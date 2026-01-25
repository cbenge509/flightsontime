// @ts-check
import {defineConfig} from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://cbenge509.github.io',
  base: '/flightsontime',
  vite: {
    plugins: [tailwindcss()],
  },
});
