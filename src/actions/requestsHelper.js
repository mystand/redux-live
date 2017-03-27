// @flow
import type { HashType } from '../types'

import type { RequestActionOptionsType } from '../actions/requestsActions'
import { REQUEST_START } from './requestsActions'

export function generateIndex(dataType: string) {
  return (requestKey: string, params?: HashType, options?: RequestActionOptionsType) => ({
    type: REQUEST_START,
    method: 'index',
    requestKey,
    dataType,
    params,
    options
  })
}

type GetParamsType = {
  [key: string]: any,
  id: number | string
}

export function generateGet(dataType: string) {
  return (requestKey: string, params: GetParamsType, options?: RequestActionOptionsType) => ({
    type: REQUEST_START,
    method: 'get',
    requestKey,
    dataType,
    params,
    options
  })
}

type CreateParamsType = {
  [key: string]: any,
  record: HashType
}

export function generateCreate(dataType: string) {
  return (requestKey: string, params: CreateParamsType, options?: RequestActionOptionsType) => ({
    type: REQUEST_START,
    method: 'create',
    requestKey,
    dataType,
    params,
    options
  })
}

type UpdateParamsType = {
  [key: string]: any,
  record: HashType
}

export function generateUpdate(dataType: string) {
  return (requestKey: string, params: UpdateParamsType, options?: RequestActionOptionsType) => ({
    type: REQUEST_START,
    method: 'update',
    requestKey,
    dataType,
    params,
    options
  })
}

type DestroyParamsType = {
  [key: string]: any,
  id: number | string
}

export function generateDestroy(dataType: string) {
  return (requestKey: string, params: DestroyParamsType, options?: RequestActionOptionsType) => ({
    type: REQUEST_START,
    method: 'destroy',
    requestKey,
    dataType,
    params,
    options
  })
}
