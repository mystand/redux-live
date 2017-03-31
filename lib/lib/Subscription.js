'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _guid = require('../lib/guid');

var _guid2 = _interopRequireDefault(_guid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var waitForConnect = new Promise(function () {});

var Command = {
  subscribe: function subscribe(guid, model, condition) {
    return JSON.stringify({
      command: 'subscribe',
      args: { model: model, condition: condition, guid: guid }
    });
  },

  unSubscribe: function unSubscribe(guid) {
    return JSON.stringify({ command: 'unSubscribe', args: { guid: guid } });
  }
};

var _webSocket = void 0;
var _callbacks = {};

var Subscription = function () {
  _createClass(Subscription, null, [{
    key: 'connect',
    value: function connect(url, protocol) {
      Subscription._disconnectIfOpen();
      _webSocket = new WebSocket(url, protocol);
      _webSocket.onmessage = Subscription._onMessage;
      waitForConnect = new Promise(function (resolve, reject) {
        _webSocket.onopen = resolve;
      });
    }
  }, {
    key: '_onMessage',
    value: function _onMessage(e) {
      var message = void 0;
      try {
        // $FlowIgnore todo
        message = JSON.parse(e.data);
      } catch (e) {
        console.error(e);
        return;
      }

      var _message = message,
          guid = _message.guid,
          action = _message.action,
          object = _message.object;

      var callback = _callbacks[guid];
      if (callback != null) callback(action, object);
    }
  }, {
    key: '_disconnectIfOpen',
    value: function _disconnectIfOpen() {
      if (_webSocket != null) {
        _webSocket.close();
        _webSocket = null;
      }
    }
  }]);

  function Subscription(model, condition, callback) {
    _classCallCheck(this, Subscription);

    this._guid = (0, _guid2.default)();
    this._model = model;
    this._condition = condition;
    _callbacks[this._guid] = callback;
  }

  _createClass(Subscription, [{
    key: 'open',
    value: function open() {
      var _this = this;

      if (_webSocket != null) {
        waitForConnect.then(function () {
          _webSocket.send(Command.subscribe(_this._guid, _this._model, _this._condition));
        });
      } else {
        console.error('Connection not established');
      }
    }
  }, {
    key: 'close',
    value: function close() {
      if (_webSocket != null) _webSocket.send(Command.unSubscribe(this._guid));
    }
  }, {
    key: 'isEqual',
    value: function isEqual(subscription) {
      if (subscription == null) return false;
      return this._model === subscription._model && this._condition === subscription._condition;
    }
  }]);

  return Subscription;
}();

exports.default = Subscription;