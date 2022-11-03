import { resolve } from 'path'
import { defineConfig } from 'vite'
import markdownPlugin from 'vite-plugin-markdown'
import markdownPreload from './src/vite-plugins/preload-markdown.js'
import path from 'path'

const CONTENT_PATH = resolve(__dirname, 'content')
const GENERATED_PATH = resolve(__dirname, 'src', 'generated')
const PWD_RESTQA = resolve(__dirname, '..','plugins')

export default defineConfig({
  resolve: {
    alias: {
      "@": CONTENT_PATH,
      "__": GENERATED_PATH,
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'index',
      fileName: 'index'
    },
  },
  plugins: [
    markdownPreload(CONTENT_PATH, PWD_RESTQA),
    markdownPlugin.plugin({
      mode: 'html'
    })
  ],
})

