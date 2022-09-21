import { resolve } from 'path'
import { defineConfig } from 'vite'
import markdownPlugin from 'vite-plugin-markdown'
import markdownPreload from './src/vite-plugins/preload-markdown.js'
import path from 'path'

const CONTENT_PATH = resolve(__dirname, 'content')

export default defineConfig({
  resolve: {
    alias: {
      "@": CONTENT_PATH,
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'index',
      fileName: 'index'
    },
    /*
    watch: {
      include: 'content/**',
      exclude: [
        'src/contents.generated.js',
        'dist/**'
      ]
    }
    */
  },
  plugins: [
    markdownPreload(CONTENT_PATH),
    markdownPlugin.plugin({
      mode: 'html'
    })
  ],
})

