import Http from '../http'

async function retrieve () {
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
  const result  = await retrieve()
  return result.team.note
}

async function getTeamSponsors () {
  const result  = await retrieve()
  return result.team.sponsors
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
