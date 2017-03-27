// @flow
import type { ConnectedComponent } from 'react-redux'
import React from 'react'
import R from 'ramda'
import { connect } from 'react-redux'
import { autobind } from 'core-decorators'

import type { HashType, ActionType } from '../types'
import type { RequestStartActionType } from '../actions/requestsActions'
import * as requestsActions from '../actions/requestsActions'
import guid from '../lib/guid'

export type RequestDeclarationItemType<S> = {
  key: string,
  action: (props: HashType, state: ?S) => ActionType,
  cacheKey?: (props: HashType, state: ?S) => string
}

export type RequestsDeclarationType<S> = Array<RequestDeclarationItemType<S>>

export default function connectWithRequests<S>(
  requestsDeclaration: RequestsDeclarationType<S>,
  mapStateToProps?: Function,
  mapDispatchToProps?: Function,
  mergeProps?: Function,
  options?: HashType = {}
) {
  return (Component: React$Element<any>) => {
    // const requestsDeclaration: RequestsDeclarationType = Component.requests || []

    return R.compose(
      withRequests(requestsDeclaration),

      // $FlowIgnore todo
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

function withRequests<S>(requestsDeclaration: RequestsDeclarationType<S>) {
  return (Component: Class<ConnectedComponent<any, any, any, S>>) => {
    return class WithRequests extends React.Component {
      connectComponent: ConnectedComponent<any, any, any, S>
      displayName: string

      _requestsPrefix: string
      _requestsCacheKeys: { [key: string]: ?string }
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
          // $FlowIgnore
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
          // $FlowIgnore
          wrappedComponent.componentWillUpdate = (nextProps, nextState) => {
            this._performRequestsIfNeeded(nextProps, nextState)
            if (oldWillUpdate !== undefined) {
              oldWillUpdate.call(wrappedComponent, nextProps, nextState)
            }
          }
          // $FlowIgnore flow bug
          const state: S = wrappedComponent.state
          this._performRequestsIfNeeded(this.props, state)
        }
      }

      componentWillUnmount() {
        // $FlowIgnore
        const { dispatch } = this.connectComponent.store

        const keysForClear = [
          ...requestsDeclaration.map(x => x.key),
          ...this._additionalKeys
        ]

        keysForClear.forEach((key) => {
          dispatch(requestsActions.clear(`${this._requestsPrefix}-${key}`))
        })
      }

      _performRequestsIfNeeded(props: HashType, state: ?S) {
        // $FlowIgnore
        const { dispatch } = this.connectComponent.store

        requestsDeclaration.forEach((request) => {
          const { key, action: actionCreator, cacheKey: cacheKeyFn } = request
          const previousCacheKey = this._requestsCacheKeys[key]
          const cacheKey = cacheKeyFn ? cacheKeyFn(props, state) : null

          if (previousCacheKey !== cacheKey) {
            const requestKey = `${this._requestsPrefix}-${key}`
            this._requestsCacheKeys[key] = cacheKey
            dispatch({ ...actionCreator(props, state), requestKey })
          }
        })
      }

      @autobind
      connectRef(el) {
        this.connectComponent = el
      }

      @autobind
      dispatchRequest(action: RequestStartActionType) {
        // $FlowIgnore
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
