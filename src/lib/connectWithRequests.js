// @flow
import React from 'react'
import R from 'ramda'
import { connect } from 'react-redux'
import { autobind } from 'core-decorators'

import type { HashType } from '../types'
import type { RequestStartActionType } from '../actions/requestsActions'
import * as requestsActions from '../actions/requestsActions'
import guid from '../lib/guid'

export type SubscribeOptionsType = {
  model: string,
  params: HashType
}

export type RequestDeclarationItemType<S, A> = {
  key: string,
  cacheKey?: (props: HashType, state: S) => string,
  action: (key: string, props: HashType, state: S) => A
}

export type RequestsDeclarationType<S, A> = Array<RequestDeclarationItemType<S, A>>

export default function connectWithRequests<S, A>(
  requestsDeclaration: RequestsDeclarationType<S, A>,
  mapStateToProps?: Function,
  mapDispatchToProps?: Function,
  mergeProps?: Function,
  options?: HashType = {}
) {
  return (Component: React$Element<any>) => {
    // const requestsDeclaration: RequestsDeclarationType = Component.requests || []

    return R.compose(
      withRequests(requestsDeclaration),

      connect((state, props) => {
        const result = mapStateToProps !== undefined ? mapStateToProps(state, props) : {}
        requestsDeclaration.forEach((request) => {
          result[`${request.key}Result`] = state.requests[`${props._requestsPrefix}-${request.key}`]
        })
        return result
      }, mapDispatchToProps, mergeProps, { withRef: true, ...options })
    )(Component)
  }
}

declare class ConnectComponentType<S> extends React$Component<any, any, any> {
  displayName: string,
  getWrappedInstance(): React$Element<any>,
  store: S
}

function withRequests<S, A>(requestsDeclaration: RequestsDeclarationType<S, A>) {
  return (Component: ConnectComponentType<S>) => {
    return class WithRequests extends React.Component {
      connectComponent: ConnectComponentType<S>
      displayName: string

      _requestsPrefix: string
      _requestsCacheKeys: HashType
      _additionalKeys: Array<string>

      constructor() {
        super()
        this.displayName = `WithRequests(${Component.displayName})`
        this._requestsPrefix = guid()
        this._requestsCacheKeys = {}
        this._additionalKeys = []
      }

      componentDidMount() {
        const wrappedComponent = this.connectComponent.getWrappedInstance()

        if (wrappedComponent == null) {
          // wrapped component is function
          const oldWillUpdate = this.connectComponent.componentWillUpdate
          this.connectComponent.componentWillUpdate = (nextProps, nextState) => {
            this._performRequestsIfNeeded(nextProps, null)
            if (oldWillUpdate !== undefined) {
              oldWillUpdate.call(this.connectComponent, nextProps, nextState)
            }
          }
          this._performRequestsIfNeeded(this.props, null)

        } else {
          // wrapped component is class
          const oldWillUpdate = wrappedComponent.componentWillUpdate
          wrappedComponent.componentWillUpdate = (nextProps, nextState) => {
            this._performRequestsIfNeeded(nextProps, nextState)
            if (oldWillUpdate !== undefined) {
              oldWillUpdate.call(wrappedComponent, nextProps, nextState)
            }
          }
          this._performRequestsIfNeeded(this.props, wrappedComponent.state)
        }
      }

      componentWillUnmount() {
        const { dispatch } = this.connectComponent.store

        const keysForClear = [
          ...requestsDeclaration.map(x => x.key),
          ...this._additionalKeys
        ]

        keysForClear.forEach((key) => {
          dispatch(requestsActions.clear(`${this._requestsPrefix}-${key}`))
        })
      }

      _performRequestsIfNeeded<S>(props: HashType, state: ?S) {
        const { dispatch } = this.connectComponent.store

        requestsDeclaration.forEach((request) => {
          const { key, action, cacheKey: cacheKeyFn } = request
          const previousCacheKey = this._requestsCacheKeys[key]
          const cacheKey = cacheKeyFn ? cacheKeyFn(props, state) : null

          if (previousCacheKey !== cacheKey) {
            const requestKey = `${this._requestsPrefix}-${key}`
            this._requestsCacheKeys[key] = cacheKey
            dispatch(action(requestKey, props, state))
          }
        })
      }

      @autobind
      connectRef(el) {
        this.connectComponent = el
      }

      @autobind
      dispatchRequest(action: RequestStartActionType) {
        const { dispatch } = this.connectComponent.store

        const fullKey = `${this._requestsPrefix}-${action.requestKey}`
        this._additionalKeys.push(action.requestKey)
        dispatch({ ...action, requestKey: fullKey })
      }

      render() {
        return (
          <Component
            {...this.props}
            ref={this.connectRef}
            dispatchRequest={this.dispatchRequest}
            _requestsPrefix={this._requestsPrefix}
          />
        )
      }
    }
  }
}
