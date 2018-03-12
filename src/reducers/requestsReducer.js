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
export const defaultResult: RequestResultType<any> = {
  data: undefined,
  failureError: null,
  dataError: null,
  loading: false
}

function mergeData<D: Object>(
  oldData: D,
  newData: D,
  type: RequestActionOptionMergeType = 'replace',
  comparator?: RequestOptionComparatorType
) {
  const mergedData = _mergeData(oldData, newData, type)
  return comparator == null ? mergedData : R.sort(comparator, mergedData)
}

function _mergeData<D: Object>(oldData: D, newData: D, type: RequestActionOptionMergeType) {
  if (type === 'replace') return newData
  else if (type === 'append') {
    if (oldData == null) return newData
    if (newData == null) return oldData
    if (oldData instanceof Array && newData instanceof Array) return [...oldData, ...newData]
    throw new Error(`Unacceptable data types: ${oldData.constructor.name} and ${newData.constructor.name}`)
  } else {
    throw new Error(`Unacceptable merge type: ${type}`)
  }
}

const updatePath = R.curry((path, fn, object) => {
  const value = fn(R.path(path, object))
  return R.assocPath(path, value, object)
})

export default function <A: ActionType> (
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
      if (state[requestKey] == null) return state
      const { data, options: { merge, comparator } = {} } = (action: RequestSuccessActionType<any>)

      return {
        ...state,
        [requestKey]: {
          ...state[requestKey],
          loading: false,
          data: mergeData(state[requestKey].data, data.data, merge, comparator),
          included: mergeData(state[requestKey].included, data.included, merge, comparator),
          dataError: null,
          ...R.omit(['data', 'included'], data)
        }
      }
    }

    case REQUEST_ERROR: {
      if (state[requestKey] == null) return state
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
      if (state[requestKey] == null) return state
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
      if (state[requestKey] == null) { return state }
      const object: ObjectType = action.object
      const sAction: string = action.action
      let updateData = null
      let updateIncluded = (newIncluded, data, included: []) => included

      if (sAction === 'create') updateData = (newData, data: []) => [...data, newData]
      if (sAction === 'destroy') updateData = (newData, data: []) => data.filter(x => x.id !== newData.id)
      if (sAction === 'update') {
        updateData = (newData, data: [] | {}) => {
          if (data.id) {
            // override only existed fields, according to JSON API spec stored in attributes fields
            return ({ ...newData, attributes: { ...data.attributes, ...newData }})
          }
          const index = R.findIndex(x => x.id === newData.id, data)
          // $FlowIgnore
          if (index === -1) return [...data, newData]
          // same logic with collection update
          return R.update(index, { ...newData, attributes: { ...data[index].attributes }}, data)
        }
        updateIncluded = (newIncluded, data, included: [] | {}) => {
          if (data.id) {
            // override only existed fields, according to JSON API spec stored in attributes fields
            return newIncluded
          }
          return included
        }
      }

      if (updateData != null) {
        if (comparator != null) {
          const fnFroDataOld = updateData
          const fnForIncludedOld = updateIncluded
          updateData = (newData, data: []) => R.sort(comparator, fnFroDataOld(newData, data))
          updateIncluded = (newIncluded, data, included: [] | {}) => R.sort(comparator, fnForIncludedOld(newIncluded, data, included))
        }

        return ({ ...state,
          [requestKey]: {
            ...object,
            data: updateData(object.data, R.clone(state[requestKey].data)),
            included: updateIncluded(object.included, R.clone(state[requestKey].data), R.clone(state[requestKey].included))
          }
        })
      }
      console.warn(`unrecognized subscribe action '${sAction}'`)
      return state
    }

    default:
      return state
  }
}
