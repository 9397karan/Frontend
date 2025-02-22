import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: [
      'react-icons',
      '@radix-ui/react-separator',
      '@radix-ui/react-slot',
      'class-variance-authority',
    ],
  },
})
