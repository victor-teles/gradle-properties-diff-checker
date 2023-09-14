import fetch from 'node-fetch'

export const get = async (url: string): Promise<Record<string, unknown>> => {
  const response = await fetch(url, {
    method: 'GET'
  })

  return (await response.json()) as Record<string, unknown>
}
