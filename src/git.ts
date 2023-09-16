import { get } from './fetch'

export const getCommit = async (sha: string): Promise<CommitResponse> => {
  const url = `https://api.github.com/repos/${process.env.GITHUB_REPOSITORY}/commits/${sha}`
  const response = await get(url)

  return response as CommitResponse
}

export type CommitResponse = {
  files: {
    filename: string
    additions: number
    deletions: number
    changes: number
    status: string
    raw_url: string
    blob_url: string
    patch: string
  }[]
}
