import { resolve } from 'path'
import fs from 'fs'
import glob from 'glob'

const TMPL_CONTENT = `
__IMPORTS__

export default {
__IDS__
}

`.trim()

export default function markdownPreload(CONTENT_PATH) {
  return {
    name: 'custom',
    enforce: 'pre',
    apply: 'build',
    buildStart () {
      const files = glob.sync('**/*.md', {cwd: CONTENT_PATH})
      const contents = files.map(filename => {
        const content = fs.readFileSync(resolve(CONTENT_PATH, filename)).toString()
        const match = content.match(/^id:(.*)\n/m)
        if (match === null) {
          throw new Error(`The id is missing on the file: ${filename}`)
        }
        const id = match[1].trim()
        return {
          id,
          filename,
          import: `import * as ${toUpperCamelCase(id)} from '@/${filename}'`
        }
      })

      let imports = contents.map(item => item.import)
      let ids = contents.map(item => toUpperCamelCase(item.id))

      const fileContent = TMPL_CONTENT
        .replace('__IMPORTS__', imports.join('\n'))
        .replace('__IDS__', ids.join(',\n'))

      fs.writeFileSync(
        resolve(__dirname, '..', 'contents.generated.js'),
        fileContent,
        {encoding: 'utf-8'})
    }
  }
}

function toUpperCamelCase(string) {
  return string
    .toLowerCase()
    .split('-')
    .map(it => it.charAt(0).toUpperCase() + it.substring(1))
    .join('');
}
