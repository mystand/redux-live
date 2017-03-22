// @flow
import type { HashType } from '../types'
// import { AUTH_TOKEN_KEY } from 'constants/base'
import guid from '../lib/guid'

type ActionType = 'create' | 'update' | 'destroy'
type CallbackType = (action: ActionType, object: any) => void

const Command = {
  subscribe: (model: string, params: HashType, guid: string) => JSON.stringify({
    command: 'subscribe',
    args: { model, params, guid }
  }),

  unSubscribe: (guid: string) => JSON.stringify({ command: 'subscribe', args: { guid } })
}

let _webSocket: ?WebSocket
const _callbacks: { [key: string]: CallbackType } = {}

class Subscription {
  _guid: string
  _model: string
  _params: HashType

  static connect(url, protocols) {
    Subscription._disconnectIfOpen()
    // const authToken = localStorage.getItem(AUTH_TOKEN_KEY)
    // if (authToken != null) {
      _webSocket = new WebSocket(url, protocols)
      _webSocket.onmessage = Subscription._onMessage
    // } else {
    //   console.error('Not authorized for subscription')
    // }
  }

  static _onMessage(e: MessageEvent) {
    let message
    try {
      // $FlowFixMe
      message = JSON.parse(e.data)
    } catch (e) {
      console.error(e)
      return
    }

    const { guid, action, object } = message
    const callback = _callbacks[guid]
    if (callback != null) callback(action, object)
  }

  static _disconnectIfOpen() {
    if (_webSocket != null) {
      _webSocket.close()
      _webSocket = null
    }
  }

  constructor(model: string, params: HashType, callback: CallbackType) {
    this._guid = guid()
    this._model = model
    this._params = params
    _callbacks[this._guid] = callback
  }

  open() {
    if (_webSocket != null) {
      _webSocket.send(Command.subscribe(this._model, this._params, this._guid))
    } else {
      console.error('Connection not established')
    }
  }

  close() {
    if (_webSocket != null) _webSocket.send(Command.unSubscribe(this._guid))
  }
}

export default Subscription
