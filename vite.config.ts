import dts from 'vite-plugin-dts'  //類別庫自動補完功能(但目前試沒作用...)
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Library Mode之前
export default defineConfig({
  plugins: [react(),
       dts({ insertTypesEntry: true }) // 這會自動幫你產生 .d.ts 並關聯到 package.json
  ],
  server: {
    port: 5170,      // 固定使用 5171
    strictPort: true // 重要！若 5171 被佔用則報錯，而不是自動跳到 5172
  },
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
