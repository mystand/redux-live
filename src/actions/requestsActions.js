// @flow
import type { HashType } from '../types'

export type RequestActionOptionMergeType = 'replace' | 'append'
export type RequestOptionComparatorType = <T>(a: T, b: T) => number
export type RequestActionOptionSubscribeType = {
  model: string,
  condition?: string
}
export type RequestActionOptionsType = {
  merge?: RequestActionOptionMergeType,
  subscribe?: RequestActionOptionSubscribeType,
  comparator?: RequestOptionComparatorType
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

export type SubscriptionActionType = 'create' | 'update' | 'destroy'
export type RequestSubscriptionActionOptionsType = {
  comparator?: RequestOptionComparatorType
}
export type RequestSubscriptionActionType<O> = {
  type: 'REQUEST_SUBSCRIPTION_ACTION',
  requestKey: string,
  action: SubscriptionActionType,
  object?: O,
  options: RequestSubscriptionActionOptionsType
}

export const REQUEST_START = 'REQUEST_START'
export const REQUEST_SUCCESS = 'REQUEST_SUCCESS'
export const REQUEST_ERROR = 'REQUEST_ERROR'
export const REQUEST_FAILURE = 'REQUEST_FAILURE'
export const REQUEST_CLEAR = 'REQUEST_CLEAR'
export const REQUEST_SUBSCRIPTION_ACTION = 'REQUEST_SUBSCRIPTION_ACTION'

export const success = <D>(
  requestKey: string,
  data: D,
  options: RequestActionOptionsType
): RequestSuccessActionType<D> => ({
  type: REQUEST_SUCCESS, requestKey, data, options
})

export const error = (requestKey: string, data: any, status: number, options: RequestActionOptionsType) => ({
  type: REQUEST_ERROR, requestKey, data, status, options
})

export const failure = (requestKey: string, error: Error, options: RequestActionOptionsType) => ({
  type: REQUEST_FAILURE, requestKey, error, options
})

export const clear = (requestKey: string) => ({
  type: REQUEST_CLEAR, requestKey
})

export const subscriptionAction = <O>(
  requestKey: string,
  action: SubscriptionActionType,
  object: O,
  options: RequestSubscriptionActionOptionsType
): RequestSubscriptionActionType<O> => ({
  type: REQUEST_SUBSCRIPTION_ACTION, requestKey, action, object, options
})
