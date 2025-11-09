import { defineConfig, createLogger } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import runtimeErrorModal from "@replit/vite-plugin-runtime-error-modal";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logger = createLogger();
const originalWarning = logger.warn;
logger.warn = (msg, options) => {
  if (msg.includes('did not pass the `from` option')) return;
  originalWarning(msg, options);
};

export default defineConfig({
  customLogger: logger,
  plugins: [
    react(),
    runtimeErrorModal(),
  ],
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss(),
        autoprefixer(),
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
    dedupe: ['react', 'react-dom'],
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist", "public"),
    emptyOutDir: true,
    modulePreload: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // React core bundle
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor-react';
          }
          // UI components bundle (shadcn, radix)
          if (id.includes('node_modules/@radix-ui') || id.includes('components/ui')) {
            return 'vendor-ui';
          }
          // Form & validation bundle
          if (id.includes('node_modules/react-hook-form') || id.includes('node_modules/zod') || id.includes('node_modules/@hookform')) {
            return 'vendor-forms';
          }
          // React Query bundle
          if (id.includes('node_modules/@tanstack/react-query')) {
            return 'vendor-query';
          }
          // Animation libraries
          if (id.includes('node_modules/framer-motion')) {
            return 'vendor-motion';
          }
          // Icons bundle
          if (id.includes('node_modules/lucide-react') || id.includes('node_modules/react-icons')) {
            return 'vendor-icons';
          }
          // Rich text editor
          if (id.includes('node_modules/@tiptap')) {
            return 'vendor-editor';
          }
          // Remaining vendor code
          if (id.includes('node_modules')) {
            return 'vendor-other';
          }
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    cssMinify: 'esbuild',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        passes: 2,
      },
      mangle: {
        safari10: true,
      },
      format: {
        comments: false,
      },
    },
    chunkSizeWarningLimit: 600,
    reportCompressedSize: false,
    sourcemap: false,
  },
  server: {
    host: "0.0.0.0",
    port: 5000,
    strictPort: true,
    hmr: {
      clientPort: 443,
    },
    allowedHosts: [
      '.replit.app',
      '.repl.co',
      'localhost',
    ],
  },
});
