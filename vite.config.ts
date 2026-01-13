import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: 'src/index.tsx', // 您的元件入口
      name: 'MyComponentLib',
     // fileName: (format) => `index.js`, // 固定檔名為 index.js
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      // 確保不要把 react 打包進去
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  }  
})
