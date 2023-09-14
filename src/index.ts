import * as core from '@actions/core'
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

    core.debug(`${eventFile}`)
    core.debug(`${dir}`)
    core.debug(`${fileName}`)
    core.debug(`${property}`)

    core.setOutput('changed', new Date().toTimeString())
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
