/**
 * Unit tests for the action's entrypoint, src/index.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import * as core from '@actions/core'
import * as index from '../src/index'

// Mock the GitHub Actions core library
const debugMock = jest.spyOn(core, 'debug')
const getInputMock = jest.spyOn(core, 'getInput')

// Mock the action's entrypoint
const runMock = jest.spyOn(index, 'run')

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('sets the time output', async () => {
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'fileName':
          return '/file/name.properties'
        default:
          return ''
      }
    })

    await index.run()
    expect(runMock).toHaveReturned()

    expect(debugMock).toHaveBeenNthCalledWith(1, '/github/workflow/event.json')
    expect(debugMock).toHaveBeenNthCalledWith(2, '/github/workspace')
  })
})
