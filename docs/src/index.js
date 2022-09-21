import Content from './contents.generated.js'
import menu from './menu.js'

export default {
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
  }
}
