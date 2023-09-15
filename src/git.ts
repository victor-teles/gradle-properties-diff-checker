import { get } from './fetch'

export const getCommit = async (
  sha: string
): Promise<Record<string, unknown>> => {
  const url = `https://api.github.com/repos/${process.env.GITHUB_REPOSITORY}/commits/${sha}`
  const response = await get(url)

  return response
}
