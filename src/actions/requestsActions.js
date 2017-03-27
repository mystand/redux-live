// @flow
import type { HashType } from '../types'

export type RequestActionOptionMergeType = 'replace' | 'append'
export type RequestActionOptionSubscribeType = {
  model: string,
  condition?: string,
  comparator?: Function
}
export type RequestActionOptionsType = {
  merge?: RequestActionOptionMergeType,
  subscribe?: RequestActionOptionSubscribeType
}

export type RequestStartActionType = {
  type: 'REQUEST_START',
  requestKey: string,
  params?: HashType,
  options?: RequestActionOptionsType
}

export type RequestSuccessActionType<D> = {
  type: 'REQUEST_SUCCESS',
  requestKey: string,
  data: D,
  options?: RequestActionOptionsType
}

export const REQUEST_START = 'REQUEST_START'
export const REQUEST_SUCCESS = 'REQUEST_SUCCESS'
export const REQUEST_ERROR = 'REQUEST_ERROR'
export const REQUEST_FAILURE = 'REQUEST_FAILURE'
export const REQUEST_CLEAR = 'REQUEST_CLEAR'
export const REQUEST_SUBSCRIPTION_ACTION = 'REQUEST_SUBSCRIPTION_ACTION'

export const success = (requestKey: string, data: any, options: RequestActionOptionsType) => ({
  type: REQUEST_SUCCESS, requestKey, data, options
})

export const error = (requestKey: string, data: any, status: number) => ({
  type: REQUEST_ERROR, requestKey, data, status
})

export const failure = (requestKey: string, error: Error) => ({
  type: REQUEST_FAILURE, requestKey, error
})

export const clear = (requestKey: string) => ({
  type: REQUEST_CLEAR, requestKey
})

export const subscriptionAction = (requestKey: string, action: string, object: any) => ({
  type: REQUEST_SUBSCRIPTION_ACTION, requestKey, action, object
})
