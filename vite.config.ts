import dts from 'vite-plugin-dts'  //類別庫自動補完功能(但目前試沒作用...)
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Library Mode之後
export default defineConfig({
  plugins: [react(),
       dts({ insertTypesEntry: true }) // 這會自動幫你產生 .d.ts 並關聯到 package.json
  ],
  build: {
    // lib: {
    //   entry: 'src/index.js', // 您的元件入口
    //   name: 'MyComponentLib',
    //   formats: ['es', 'cjs']
    // },
    lib: {
      // 這是你元件庫的入口檔案
      entry: 'src/index.tsx', 
      // 別人 import 時顯示的名稱 (例如在 UMD 模式下)
      name: 'MyComponentLib',
      // 輸出的檔案名稱
      fileName: 'index',
      // 你想要的格式：es 是現代格式 (.mjs)，umd 是相容格式 (.cjs)
      formats: ['es', 'umd'] 
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
