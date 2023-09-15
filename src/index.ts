import * as core from '@actions/core'
import { readFileSync } from 'fs'
import { getCommit } from './git'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const fileName: string = core.getInput('file-name')
    const property: string = core.getInput('property')
    const dir = process.env.GITHUB_WORKSPACE
    const eventFile = process.env.GITHUB_EVENT_PATH

    if (!eventFile) {
      core.debug(`Failed to retrive event data`)
      core.setFailed('Failed to retrive event data')
      return
    }

    core.debug(`${eventFile}`)
    core.debug(`${dir}`)
    core.debug(`${fileName}`)
    core.debug(`${property}`)

    const eventData = JSON.parse(
      readFileSync(eventFile, { encoding: 'utf8' })
    ) as Event

    for (const commit of eventData.commits) {
      const commitData = await getCommit(commit.id)
      core.debug(`${commitData}`)
    }

    core.setOutput('changed', new Date().toTimeString())
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()

type Commit = {
  id: string
}

type Event = {
  commits: Commit[]
}
