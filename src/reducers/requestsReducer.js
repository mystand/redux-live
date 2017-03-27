// @flow
import R from 'ramda'

import type { ActionType } from '../types'
import type {
  RequestSuccessActionType,
  RequestActionOptionMergeType,
  RequestOptionComparatorType,
  RequestSubscriptionActionType
} from '../actions/requestsActions'
import { // eslint-disable-line no-duplicate-imports
  REQUEST_START,
  REQUEST_SUCCESS,
  REQUEST_ERROR,
  REQUEST_FAILURE,
  REQUEST_CLEAR,
  REQUEST_SUBSCRIPTION_ACTION
} from '../actions/requestsActions'

export type RequestResultType<T> = {
  data: T,
  failureError: any,
  dataError: any,
  loading: boolean
}
export type RequestsReducerStateType = { [key: string]: RequestResultType<any> }

type ObjectType = { [key: string]: any, id: number }

const defaultState: RequestsReducerStateType = {}

function mergeData(
  oldData: any,
  newData: any,
  type: RequestActionOptionMergeType = 'replace',
  comparator?: RequestOptionComparatorType
) {
  if (type === 'replace') return comparator == null ? newData : R.sort(comparator, newData)
  if (type === 'append') {
    if (oldData == null) return newData
    if (newData == null) return oldData
    if (oldData instanceof Array && newData instanceof Array) return [...oldData, ...newData]
    throw new Error(`Unacceptable data types: ${oldData.constructor.name} and ${newData.constructor.name}`)
  }
}

const updatePath = R.curry((path, fn, object) => {
  const value = fn(R.path(path, object))
  return R.assocPath(path, value, object)
})

export default function<A: ActionType> (
  state: RequestsReducerStateType = defaultState,
  action: A
): RequestsReducerStateType {
  const { type, requestKey } = action

  switch (type) {
    case REQUEST_START:
      return {
        ...state,
        [requestKey]: {
          ...state[requestKey],
          loading: true,
          failureError: null
        }
      }

    case REQUEST_SUCCESS: {
      const { data, options: { merge, comparator } = {} } = (action: RequestSuccessActionType<any>)
      return {
        ...state,
        [requestKey]: {
          ...state[requestKey],
          loading: false,
          data: mergeData(state[requestKey].data, data, merge, comparator),
          dataError: null
        }
      }
    }

    case REQUEST_ERROR: {
      const { data } = action
      return {
        ...state,
        [requestKey]: {
          ...state[requestKey],
          loading: false,
          dataError: data
        }
      }
    }

    case REQUEST_FAILURE: {
      const { error } = action
      return {
        ...state,
        [requestKey]: {
          ...state[requestKey],
          loading: false,
          failureError: error
        }
      }
    }

    case REQUEST_CLEAR: {
      return R.dissoc(requestKey, state)
    }

    case REQUEST_SUBSCRIPTION_ACTION: {
      const { requestKey, options: { comparator } } = (action: RequestSubscriptionActionType<ObjectType>)
      const object: ObjectType = action.object
      const sAction: string = action.action

      let fn = null

      if (sAction === 'create') fn = (data: []) => [...data, object]
      if (sAction === 'destroy') fn = (data: []) => data.filter(x => x.id !== object.id)
      if (sAction === 'update') {
        fn = (data: []) => {
          const index = R.findIndex(x => x.id === object.id, data)
          if (index === -1) return [...data, object]
          return R.update(index, object, data)
        }
      }

      if (fn != null) {
        const newState = updatePath([requestKey, 'data'], fn, state)
        return comparator == null ? newState : R.sort(comparator, newState)
      }
      console.warn(`unrecognized subscribe action '${sAction}'`)
      return state
    }

    default:
      return state
  }
}
