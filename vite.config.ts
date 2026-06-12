import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        VitePWA({
          registerType: 'autoUpdate',
          includeAssets: ['apple-touch-icon.png', 'favicon-64x64.png'],
          manifest: {
            name: 'PX Control - Protocolo de Ensayos',
            short_name: 'PX Control',
            description: 'Sistema de Gestión de Calidad ISO 9001 - Control y gestión de protocolos de ensayos y pruebas',
            lang: 'es',
            theme_color: '#0f172a',
            background_color: '#f8fafc',
            display: 'standalone',
            start_url: '/',
            icons: [
              { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
              { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
              { src: 'pwa-maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
            ]
          },
          workbox: {
            globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
            // La app usa Tailwind y fuentes desde CDN: cachearlas para uso sin conexión
            runtimeCaching: [
              {
                urlPattern: /^https:\/\/cdn\.tailwindcss\.com\/.*/i,
                handler: 'CacheFirst',
                options: {
                  cacheName: 'cdn-tailwind',
                  expiration: { maxEntries: 5, maxAgeSeconds: 60 * 60 * 24 * 30 }
                }
              },
              {
                urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
                handler: 'CacheFirst',
                options: {
                  cacheName: 'google-fonts',
                  expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 }
                }
              },
              {
                urlPattern: /^https:\/\/esm\.sh\/.*/i,
                handler: 'CacheFirst',
                options: {
                  cacheName: 'esm-modules',
                  expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 30 }
                }
              }
            ]
          }
        })
      ],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
