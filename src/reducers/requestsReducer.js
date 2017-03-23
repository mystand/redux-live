// @flow
import R from 'ramda'

import type { HashType, ActionType } from '../types'
import {
  REQUEST_START,
  REQUEST_SUCCESS,
  REQUEST_ERROR,
  REQUEST_FAILURE,
  REQUEST_CLEAR,
  REQUEST_SUBSCRIPTION_ACTION
} from '../actions/requestsActions'

const defaultState = {}

export type OptionsMergeType = 'replace' | 'append'
export type OptionsSubscribeType = { model: string, params: HashType }

export type OptionsType = {
  merge?: OptionsMergeType,
  subscribe?: OptionsSubscribeType
}

function mergeData(oldData: any, newData: any, type: OptionsMergeType = 'replace') {
  if (type === 'replace') return newData
  if (type === 'append') {
    if (oldData == null) return newData
    if (newData == null) return oldData
    if (oldData instanceof Array && newData instanceof Array) return [...oldData, ...newData]
    throw new Error(`Unacceptable data types: ${oldData.constructor.name} and ${newData.constructor.name}`)
  }
}

export default function<A: ActionType> (state: HashType = defaultState, action: A) {
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
      const { data, options: { merge } = {} } = action
      return {
        ...state,
        [requestKey]: {
          ...state[requestKey],
          loading: false,
          data: mergeData(state[requestKey].data, data, merge),
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
      const { requestKey, action: sAction, object } = action
      let fn = null

      if (sAction === 'create') fn = (data: []) => [...data, object]
      if (sAction === 'destroy') fn = (data: []) => data.filter(x => x.id == object.id)
      if (sAction === 'update') fn = (data: []) => R.replaceBy(x => x.id == object.id, object, data)

      if (fn != null) return R.updatePath([requestKey, 'data'], fn, state)
      return state
    }

    default:
      return state
  }
}
