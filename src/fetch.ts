import axios from 'axios'

export const get = async (url: string): Promise<Record<string, unknown>> => {
  const response = await axios(url, {
    method: 'GET'
  })

  return response.data
}
