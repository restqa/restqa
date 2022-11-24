import Content from './generated/contents.js'
import FilePath from './generated/filepath.json'
import menu from './menu.js'

export default {
  exists: function(id) {
    return Boolean(this.getElement(id))
  },
  menu: menu(Content),
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
  }

}
