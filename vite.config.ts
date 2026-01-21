import dts from 'vite-plugin-dts'  //類別庫自動補完功能
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    dts({ insertTypesEntry: true }) // 這會自動幫你產生 .d.ts 並關聯到 package.json
  ],
  build: {
    lib: {
      entry: 'src/index.js', // 您的元件入口
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
