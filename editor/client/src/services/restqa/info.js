import Http from '../http'

async function retrieve() {
  const key = 'remote-info'
  let result = window.localStorage.getItem(key)
  result = result && JSON.parse(result)
  if (!result) {
    const { data } = await Http().get('/api/info')
    window.localStorage.setItem(key, JSON.stringify(data))
    result = data
  }
  return result
}


async function getTeamNote () {
  console.log((new Date()).getDay())
  const result  = await retrieve()
  return result.team.note
}



export  {
  getTeamNote
}
