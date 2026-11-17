import { defineConfig } from 'astro/config';
// Static demo. No integrations, no UI frameworks.
export default defineConfig({
  site: 'https://demo.foothillsamishfurniture.invalid',
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file', inlineStylesheets: 'always', assets: '_assets' },
  image: { responsiveStyles: false },
  compressHTML: true,
  devToolbar: { enabled: false },
  // Explicit modern CSS targets so the minifier keeps unprefixed backdrop-filter for Chrome.
  vite: { build: { cssTarget: ['chrome111', 'edge111', 'firefox111', 'safari16.4'] } },
});
