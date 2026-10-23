import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('@capacitor')) {
              return 'vendor-capacitor';
            }
            if (id.includes('socket.io-client') || id.includes('@supabase')) {
              return 'vendor-network';
            }
            return 'vendor-libs';
          }
        }
      }
    }
  },
  server: {
    port: 5174
  }
});
