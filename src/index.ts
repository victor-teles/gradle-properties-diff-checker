import * as core from '@actions/core'
import { readFileSync } from 'fs'
import { CommitResponse, getCommit } from './git'
import { join } from 'path'
import Properties from '@js.properties/properties'
/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const fileName: string = core.getInput('file-name')!
    const property: string = core.getInput('property')!
    const dir = process.env.GITHUB_WORKSPACE
    const eventFile = process.env.GITHUB_EVENT_PATH

    if (!eventFile || !dir) {
      core.debug(`Failed to retrive event data`)
      core.setFailed('Failed to retrive event data')
      return
    }

    const eventData = JSON.parse(
      readFileSync(eventFile, { encoding: 'utf8' })
    ) as Event

    const propertiesFileStr = readFileSync(join(dir, fileName), {
      encoding: 'utf8'
    })
    const propertiesFile = Properties.parseToEntries(propertiesFileStr)
    const version = propertiesFile.find(prop => prop.key === property)?.element

    if (!version) {
      core.debug(`Version not found`)
      core.setFailed('Version not found')
      return
    }

    for (const commit of eventData.commits) {
      const commitData = await getCommit(commit.id)
      checkDiff(commitData, fileName, property, version)
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()

// from https://github.com/EndBug/version-check
const checkDiff = (
  commit: CommitResponse,
  fileName: string,
  property: string,
  version: string
): void => {
  const file = commit.files.find(fileObj => fileName.includes(fileObj.filename))

  const rawLines = file?.patch
    .split('\n')
    .filter(
      line => line.includes(`${property} =`) && ['+', '-'].includes(line[0])
    )

  if (!rawLines) {
    core.info(`property ${property} not found on file ${fileName}`)
    core.setOutput('changed', false)
    return
  }

  if (!file?.patch) {
    core.setOutput('changed', false)
    return
  }

  const versionDiff = matchVersion(file?.patch)

  if (versionDiff !== version) {
    core.setOutput('changed', true)
    return
  }

  core.setOutput('changed', false)
}

function matchVersion(str: string): string {
  const semverRegex =
    /(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)(-(0|[1-9A-Za-z-][0-9A-Za-z-]*)(\.[0-9A-Za-z-]+)*)?(\+[0-9A-Za-z-]+(\.[0-9A-Za-z-]+)*)?/g
  return (str.match(semverRegex) || ([] as string[]))[0]
}

type Commit = {
  id: string
}

type Event = {
  commits: Commit[]
}
