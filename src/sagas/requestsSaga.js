// @flow
import { call, put, takeEvery } from 'redux-saga/effects'

import type { RequestSuccessActionType } from '../actions/requestsActions'
import type { ActionType } from '../lib/Subscription'
import * as requestsActions from '../actions/requestsActions' // eslint-disable-line no-duplicate-imports
import Subscription from '../lib/Subscription' // eslint-disable-line no-duplicate-imports

const subscriptions: { [key: string]: Subscription } = {}

export default function buildRequestsSaga(Api: any, dispatch: Function) { // todo fix annotation
  function * start(action) {
    const { requestKey, dataType, method, params, options } = action

    try {
      const { response: { status }, data } = yield call(Api[dataType][method], params)
      const codeStart = Math.floor(status / 100)
      if (codeStart === 4 || codeStart === 5) {
        yield put(requestsActions.error(requestKey, data, status))
      } else {
        yield put(requestsActions.success(requestKey, data, options))
      }
    } catch (e) {
      yield put(requestsActions.failure(requestKey, e))
    }
  }

  function createSubscriptionIfNeeded(action: RequestSuccessActionType<any>) {
    const { requestKey, options } = action

    if (options != null && options.subscribe != null) {
      const { model, condition } = options.subscribe
      const { comparator } = options

      const subscription = new Subscription(model, condition, (sAction: ActionType, object: any) => {
        dispatch(requestsActions.subscriptionAction(requestKey, sAction, object, { comparator }))
      })

      if (!subscription.isEqual(subscriptions[requestKey])) {
        clearSubscriptionIfNeeded({ requestKey })
        subscriptions[requestKey] = subscription
        subscriptions[requestKey].open()
      }
    }
  }

  function clearSubscriptionIfNeeded(action) {
    const { requestKey } = action
    if (subscriptions[requestKey] != null) {
      subscriptions[requestKey].close()
      delete subscriptions[requestKey]
    }
  }

  return function * requestSaga(): Generator<*, *, *> {
    yield takeEvery(requestsActions.REQUEST_START, start)
    yield takeEvery(requestsActions.REQUEST_SUCCESS, createSubscriptionIfNeeded)
    yield takeEvery(requestsActions.REQUEST_CLEAR, clearSubscriptionIfNeeded)
  }
}
