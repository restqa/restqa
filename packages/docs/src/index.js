import Content from './generated/contents.js'
import FilePath from './generated/filepath.json'
import Menu from './menu.js'

let flatMenu = []

const flatten = function (item) {
  if (flatMenu.length) return flatMenu

  item.items.forEach(i => {
    flatMenu.push(i)
    i.items.forEach(u => {
      flatMenu.push(u)
      u.items.forEach(y => {
        flatMenu.push(y)
      })
    })
  })
  return flatMenu
}


export default {
  exists: function(id) {
    return Boolean(this.getElement(id))
  },
  menu: Menu(Content),
  getElement: function(id) {
    return Object.values(Content)
      .find(item => {
        return item.attributes.id === id
      })
  },
  getTitle: function(id) {
    return this.getElement(id).attributes.title;
  },
  getHtml: function(id) {
    return this.getElement(id).html
  },
  getElements: function() {
    return Content

  },
  getFilePath: function(id) {
    return FilePath.find(item => item.id === id).filename
  },

  getNavigation(id) {
    let list = flatten(this.menu)
    const index = list.findIndex(item => id === item.id)
    let previous = {}
    let next = {}
    if (index !== 0) {
      previous = this.getElement(list[index - 1].id)
    }
    if ((index + 1) !== list.length) {
      next = this.getElement(list[index + 1].id)
    }
    return {
      previous,
      next
    }
  }
}
