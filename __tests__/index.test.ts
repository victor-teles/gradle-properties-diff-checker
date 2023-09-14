/**
 * Unit tests for the action's entrypoint, src/index.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import * as core from '@actions/core'
import * as index from '../src/index'
import axios from "axios";
// Mock the GitHub Actions core library
const debugMock = jest.spyOn(core, 'debug')
const getInputMock = jest.spyOn(core, 'getInput')

// Mock the action's entrypoint
const runMock = jest.spyOn(index, 'run')
const originalEnv = process.env
import mockAxios from 'jest-mock-axios';


describe('action', () => {
  afterEach(() => {
    mockAxios.reset();
  });


  beforeEach(() => {
    jest.clearAllMocks()
    jest.resetModules()



    process.env = {
      ...originalEnv,
      GITHUB_WORKSPACE: '/github/workspace',
      GITHUB_EVENT_PATH: '/github/workflow/event.json'
    }


  })

  it('sets the time output', async () => {
    mockAxios.mockResolvedValueOnce({ data: {} })
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

    expect(debugMock).toHaveBeenNthCalledWith(1, '{}')
    expect(debugMock).toHaveBeenNthCalledWith(2, '/github/workflow/event.json')
    expect(debugMock).toHaveBeenNthCalledWith(3, '/github/workspace')
  })
})
