// @flow
import type { ConnectedComponent } from 'react-redux'
import React from 'react'
import R from 'ramda'
import { connect } from 'react-redux'
import { autobind } from 'core-decorators'
import { createSelector } from 'reselect'

import type { HashType, ActionType } from '../types'
import type { RequestStartActionType } from '../actions/requestsActions'
import * as requestsActions from '../actions/requestsActions'
import guid from '../lib/guid'
import { defaultResult } from '../reducers/requestsReducer'

export type RequestDeclarationItemType<S> = {
  key: string,
  action: (props: HashType, state: ?S) => ActionType,
  cacheKey?: (props: HashType, state: ?S) => string
}

export type RequestsDeclarationType<S> = Array<RequestDeclarationItemType<S>>

const EMPTY_OBJECT = {}

export default function connectWithRequests<S>(
  requestsDeclaration: RequestsDeclarationType<S>,
  mapStateToProps?: Function = () => (EMPTY_OBJECT),
  mapDispatchToProps?: Function,
  mergeProps?: Function,
  options?: HashType = {}
) {
  return (Component: React$Element<any>) => {
    const resultSelectors = requestsDeclaration.map(request =>
      (state, props) => state.requests[`${props._requestsPrefix}-${request.key}`] || defaultResult
    )

    const mapStateToPropsSelector = createSelector(mapStateToProps, ...resultSelectors, (props, ...results) => {
      const result = { ...props }
      for (let i = 0; i < results.length; ++i) {
        result[`${requestsDeclaration[i].key}Result`] = results[i]
      }
      return result
    })

    return R.compose(
      withRequests(requestsDeclaration),
      // $FlowIgnore todo
      connect(mapStateToPropsSelector, mapDispatchToProps, mergeProps, { withRef: true, ...options })
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
          // wrapped component is a function
          const oldWillUpdate = this.connectComponent.componentWillUpdate
          // $FlowIgnore
          const { selector: { props } } = this.connectComponent
          // $FlowIgnore
          this.connectComponent.componentWillUpdate = (nextProps, nextState) => {
            this._performRequestsIfNeeded(nextProps, null)
            if (oldWillUpdate != null) {
              oldWillUpdate.call(this.connectComponent, nextProps, nextState)
            }
          }
          this._performRequestsIfNeeded(props, null)

        } else {
          // wrapped component is a class
          const oldWillUpdate = wrappedComponent.componentWillUpdate
          // $FlowIgnore
          wrappedComponent.componentWillUpdate = (nextProps, nextState) => {
            this._performRequestsIfNeeded(nextProps, nextState)
            if (oldWillUpdate != null) {
              oldWillUpdate.call(wrappedComponent, nextProps, nextState)
            }
          }
          // $FlowIgnore flow bug
          const state: S = wrappedComponent.state
          this._performRequestsIfNeeded(wrappedComponent.props, state)
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
          const previousCacheKey = this._requestsCacheKeys[key] || null
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

      @autobind
      performRequest(requestKey: string) {
        // $FlowIgnore
        const request = requestsDeclaration.find(x => x.key === requestKey)
        if (request) {
          const { key, action: actionCreator } = request
          const { dispatch } = this.connectComponent.store
          const requestKey = `${this._requestsPrefix}-${key}`
          const wrappedComponent = this.connectComponent.getWrappedInstance()

          if (wrappedComponent != null) {
            const { props, state } = wrappedComponent
            dispatch({ ...actionCreator(props, state), requestKey })
          } else {
            const props = this.connectComponent.selector.props
            dispatch({ ...actionCreator(props, null), requestKey })
          }
        } else {
          console.error(`Undefined request key '${requestKey}'`)
        }
      }

      render() {
        return (
          <Component
            {...this.props}
            ref={this.connectRef}
            dispatchRequest={this.dispatchRequest}
            performRequest={this.performRequest}
            _requestsPrefix={this._requestsPrefix}
          />
        )
      }
    }
  }
}
