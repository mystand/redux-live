// @flow

import requestsReducer from '../../src/reducers/requestsReducer'
import * as requestsActions from '../../src/actions/requestsActions'

test("subscribe with action='replace' will replace object if it exists", () => {
  const requestKey = 'sample'
  const oldState = {
    [requestKey]: {
      data: [{ id: 1, name: 'Sample name' }],
      loading: true, failureError: null, dataError: null
    }
  }
  const action = requestsActions.subscriptionAction(requestKey, 'update', { id: 1, name: 'second' })

  const state = requestsReducer(oldState, action)

  expect(state[requestKey].data[0].name).toBe('second')
})

test("subscribe with action='replace' will add object if it not exists", () => {
  const requestKey = 'sample'
  const oldState = { [requestKey]: { data: [], loading: true, failureError: null, dataError: null } }
  const sampleObject = { id: 1, name: 'Sample name' }
  const action = requestsActions.subscriptionAction(requestKey, 'update', sampleObject)

  const state = requestsReducer(oldState, action)

  expect(state[requestKey].data).toContain(sampleObject)
})
