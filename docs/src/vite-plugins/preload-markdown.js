import { resolve, join, basename } from 'path'
import fs from 'fs'
import glob from 'glob'
import got from 'got'
import  { parse } from 'comment-parser'


const TMPL_CONTENT = `
__IMPORTS__

export default {
__IDS__
}

`.trim()

export default function markdownPreload(CONTENT_PATH, PWD_RESTQA) {
  return {
    name: 'custom',
    enforce: 'pre',
    apply: 'build',
    async buildStart () {
      const dir = resolve(__dirname, '..', 'generated')
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }

      const files = glob.sync('**/*.md', {cwd: CONTENT_PATH})
      const contents = files.map(filename => {
        const content = fs.readFileSync(resolve(CONTENT_PATH, filename)).toString()
        const match = content.match(/^id:(.*)\n/m)
        if (match === null) {
          throw new Error(`The id is missing on the file: ${filename}`)
        }
        const id = match[1].trim()

        const matchUrl = content.match(/^content_from:(.*)\n/m)
        const fromUrl = matchUrl && matchUrl[1].trim()

        return {
          id,
          filename,
          fromUrl,
          import: `import * as ${toUpperCamelCase(id)} from '@/${filename}'`
        }
      })

      const opt = {
        contents,
        CONTENT_PATH,
        dir,
        PWD_RESTQA
      }

      const resultRemote = await fetchRemote(opt)
      resultRemote.forEach(item => {
        contents[item.index].import = `import * as ${toUpperCamelCase(item.id)} from '__/${item.file.replace(dir + '/','')}'`
      })

      const resultFile = stepDefinition(opt)
      resultFile.forEach(item => {
        contents[item.index].import = `import * as ${toUpperCamelCase(item.id)} from '__/${item.file.replace(dir + '/','')}'`
      })


      let imports = contents.map(item => item.import)
      let ids = contents.map(item => toUpperCamelCase(item.id))

      const fileContent = TMPL_CONTENT
        .replace('__IMPORTS__', imports.join('\n'))
        .replace('__IDS__', ids.join(',\n'))


      fs.writeFileSync(
        resolve(dir, 'contents.js'),
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

function fetchRemote ({contents, CONTENT_PATH, dir}) {
  const urls = contents
    .filter(_ => _.fromUrl)
    .filter(_ => _.fromUrl.startsWith('https'))
    .map(_ => new Promise(async (resolve, reject) => {
      const content = fs.readFileSync(join(CONTENT_PATH, _.filename)).toString()
      const { body } = await got.get(_.fromUrl)
      const file = join(dir, basename(_.filename))
      fs.writeFileSync(
        file,
        content + body,
        {encoding: 'utf-8'})

      const index = contents.findIndex(el => el.id === _.id)
      resolve({
        ..._,
        file,
        index
      })
    }))

  return Promise.all(urls)
}

function stepDefinition ({contents, PWD_RESTQA, CONTENT_PATH, dir}) {
  const result = contents
    .filter(_ => _.fromUrl)
    .filter(_ => !_.fromUrl.startsWith('https'))
    .map(doc => {
      const remoteBody = fs.readFileSync(join(PWD_RESTQA, doc.fromUrl)).toString()
      const content = fs.readFileSync(join(CONTENT_PATH, doc.filename)).toString()
      const file = join(dir, basename(doc.filename))
      const categories = parse(remoteBody)
        .filter( step => {
          return step.tags.filter(tag => tag.tag === 'example').length
        })
        .reduce((result, step) => {
          const matchCategory = content.match(/^category:(.*)\n/m)
          const docCategory = matchCategory && matchCategory[1].trim()

          let category = ((step.tags.find(tag => tag.tag === 'category') || {}).source )|| 'Undefined'
          category = category[0].source.replace('* @category', '').trim()
          if (category === docCategory) {
            result[category] = result[category] || []
            result[category].push(step)
          }
          return result
        }, {})

      const body = Object.keys(categories)
        .map(category => {
          return categories[category]
            .map(formatStepDefintion)
            .join('\n\n---\n\n')
        })
        .join('\n')

      fs.writeFileSync(
        file,
        content + body,
        {encoding: 'utf-8'})

      const index = contents.findIndex(el => el.id === doc.id)
      return {
        ...doc,
        file,
        index
      }
    })

  return result
}

function formatStepDefintion(step) {
  const content = [
    step.source[1].source.replace('*', '').trim(),
    step.source[2].source.replace('*', '').trim()
  ]
  step.tags
    .forEach(({tag, source}) => {
      if (tag !== 'example') return
      const lines = source[0]
      let example = lines.source
        .replace('* @example', '*Example:*')
        .replace('<caption>', '*')
        .replace('</caption>', '*')
      content.push(example)
      content.push('```gherkin')
      const gherkin = source.splice(1).map(_ => _.source.replace('*', '').trim()).filter(_ => _)
      content.push(gherkin.join('\n'))
      content.push('```')
    })
  return content.join('\n\n')
}

