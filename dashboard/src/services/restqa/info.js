import Http from '../http'

async function retrieve () {
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


async function getTeamNote () {
  const result  = await retrieve()
  return result.team.note
}

async function getTeamSponsors () {
  const result  = await retrieve()
  return result.sponsors
}

async function getTeamBlog () {
  const result  = await retrieve()
  return result.team.blog
}

async function getTeamVideo () {
  const result  = await retrieve()
  return result.team.video
}

export  {
  getTeamNote,
  getTeamSponsors,
  getTeamBlog,
  getTeamVideo
}
