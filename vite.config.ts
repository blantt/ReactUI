import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path';
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
   build: {
    // 開啟「元件庫模式」
    lib: {
      // 指定進入點檔案
      entry: resolve(__dirname, 'src/index.tsx'), 
      // 元件庫名稱 (用於 UMD/IIFE)
      name: 'FishReactUI',
      // 指定產出的檔名格式
      fileName: (format) => `index.${format === 'es' ? 'esm.js' : 'js'}`,
      // 同時產出 ES 模組與 CommonJS 格式
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      // 關鍵：確保不要把 React 相關套件打包進去，讓使用者專案自己提供
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        // 在 UMD 模式下，告訴瀏覽器 React 是誰
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime'
        }
      }
    },
    // 建議關閉雜湊值 (在 lib 模式下預設即為關閉，但明確設定更安全)
    outDir: 'dist',
    emptyOutDir: true
  }
})
