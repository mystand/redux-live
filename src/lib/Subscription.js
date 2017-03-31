// @flow
import guid from '../lib/guid'

type ActionType = 'create' | 'update' | 'destroy'
type CallbackType = (action: ActionType, object: any) => void

let onConnect = null
let waitForConnect = new Promise((resolve, reject) => {
  onConnect = resolve
})

const Command = {
  subscribe: (guid: string, model: string, condition: ?string) => JSON.stringify({
    command: 'subscribe',
    args: { model, condition, guid }
  }),

  unSubscribe: (guid: string) => JSON.stringify({ command: 'unSubscribe', args: { guid } })
}

let _webSocket: ?WebSocket
const _callbacks: { [key: string]: CallbackType } = {}

class Subscription {
  _guid: string
  _model: string
  _condition: ?string

  static connect(url, protocol) {
    Subscription._disconnectIfOpen()
    _webSocket = new WebSocket(url, protocol)
    _webSocket.onmessage = Subscription._onMessage
    _webSocket.onopen = onConnect
  }

  static _onMessage(e: MessageEvent) {
    let message
    try {
      // $FlowIgnore todo
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

  constructor(model: string, condition: ?string, callback: CallbackType) {
    this._guid = guid()
    this._model = model
    this._condition = condition
    _callbacks[this._guid] = callback
  }

  open() {
    if (_webSocket != null) {
      waitForConnect.then(() => {
        _webSocket.send(Command.subscribe(this._guid, this._model, this._condition))
      })
    } else {
      console.error('Connection not established')
    }
  }

  close() {
    if (_webSocket != null) _webSocket.send(Command.unSubscribe(this._guid))
  }

  isEqual(subscription: Subscription) {
    if (subscription == null) return false
    return this._model === subscription._model && this._condition === subscription._condition
  }
}

export default Subscription
