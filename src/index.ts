import * as core from '@actions/core'
/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const fileName: string = core.getInput('file-name')
    const dir = process.env.GITHUB_WORKSPACE || '/github/workspace'
    const eventFile =
      process.env.GITHUB_EVENT_PATH || '/github/workflow/event.json'

    core.debug(`${eventFile}`)
    core.debug(`${dir}`)
    core.debug(`${fileName}`)
    core.setOutput('changed', new Date().toTimeString())
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
