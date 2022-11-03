
export default function (content) {
  const contents = Object.values(content)
    .map(item => {
      return {
        id: item.attributes.id,
        name: item.attributes.sidebar_label || item.attributes.title,
        parent: item.attributes.parent || 'root',
        order: item.attributes.order || 0,
        disabled: Boolean(item.attributes.disabled),
        items: []
      }
    })

  const result = [{
      id: 'root',
      items: []
    },
    ...contents
  ]

  function parseChild(element) {
    element.items = contents
      .filter(_ => _.parent === element.id)
      .filter(_ =>  false === _.disabled)
    if (element.items.length) {
      element.items.forEach(parseChild)
    }
    element.items = element.items.sort((a, b) => a.order - b.order)
    return element;
  }

  return parseChild(result[0])
}
