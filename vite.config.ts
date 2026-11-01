import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { defineConfig, loadEnv, Plugin } from 'vite';

const DEFAULT_SITE_URL = 'https://photo-strip-maker.vercel.app';

function seoSiteUrlPlugin(siteUrl: string): Plugin {
  const cleanUrl = (siteUrl || DEFAULT_SITE_URL).replace(/\/+$/, '');
  return {
    name: 'seo-site-url-plugin',
    transformIndexHtml(html) {
      return html.replaceAll(DEFAULT_SITE_URL, cleanUrl);
    },
    closeBundle() {
      if (cleanUrl === DEFAULT_SITE_URL) return;
      const distDir = path.resolve(__dirname, 'dist');
      for (const fileName of ['robots.txt', 'sitemap.xml']) {
        const filePath = path.join(distDir, fileName);
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf-8');
          fs.writeFileSync(filePath, content.replaceAll(DEFAULT_SITE_URL, cleanUrl), 'utf-8');
        }
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const siteUrl = env.NEXT_PUBLIC_SITE_URL || env.VITE_SITE_URL || DEFAULT_SITE_URL;

  return {
    envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
    plugins: [react(), tailwindcss(), seoSiteUrlPlugin(siteUrl)],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
