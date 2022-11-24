# Documentation

## About

Simple repository to enable the JAM stack for the RestQA documentation.

## Usage

The folder containing all the Markdown file are in the `content` folders.

Once the documentation is ready run the command:

```
npm run build
```

### API

#### menu

```js
import docs from '@restqa/docs'

const menu = docs.menu
```

#### exists(pageId):boolean

Check if the page id exists

```js
import docs from '@restqa/docs'

const isExists = docs.exists('introduction')
```

#### getElement(pageId):object

Get the page detail from page Id

```js
import docs from '@restqa/docs'

const introductionPage = docs.getElement('introduction')
```


#### getTitle(pageId):string

Get the title from page Id

```js
import docs from '@restqa/docs'

const introductionTitle = docs.getTitle('introduction')
```

#### getHtml(pageId):string<html>

Get the html content from page Id

```js
import docs from '@restqa/docs'

const introductionPageHtml = docs.getHtml('introduction')
```

#### getElements():array<object>

Get the list of all the pages

```js
import docs from '@restqa/docs'

const pages = docs.getElements()
```
