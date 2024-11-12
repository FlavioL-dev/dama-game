import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'assets/*',
      ],
      manifest: {
        name: 'Dama il gioco',
        short_name: 'Dama',
        description: 'progetto SAW',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/white_pawn.png', 
            sizes: '100x100',
            type: 'image/png'
          }
        ]
      }
    })
  ]
});