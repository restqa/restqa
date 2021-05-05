import Http from '../http'

async function get () {
  const { data } = await Http().get('/api/info')
  return data.team.note
}

export  { get }
