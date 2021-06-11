import Http from '../http'

async function get () {
  const key = 'remote-info'
  const date = new Date()
  const today = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`

  let result = window.localStorage.getItem(key)
  result = result && JSON.parse(result)
  if (!result || result.today !== today) {
    const { data } = await Http().get('/api/info')
    result = {
      today,
      data
    }
    window.localStorage.setItem(key, JSON.stringify(result))
  }
  return result.data
}

export default  {
  get
}
