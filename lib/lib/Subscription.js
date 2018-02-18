'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bpfrpt_proptype_CallbackType = exports.bpfrpt_proptype_ActionType = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _guid = require('../lib/guid');

var _guid2 = _interopRequireDefault(_guid);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var bpfrpt_proptype_ActionType = _propTypes2.default.oneOf(['create', 'update', 'destroy']);

var bpfrpt_proptype_CallbackType = _propTypes2.default.func;


var waitForConnect = new Promise(function () {});

var Command = {
  subscribe: function subscribe(guid, model, condition, getUrlOptions) {
    return JSON.stringify({
      command: 'subscribe',
      args: { model: model, condition: condition, guid: guid, getUrlOptions: getUrlOptions }
    });
  },

  unSubscribe: function unSubscribe(guid) {
    return JSON.stringify({ command: 'unSubscribe', args: { guid: guid } });
  }
};

var _webSocket = void 0;
var _callbacks = {};

var Subscription = function () {
  (0, _createClass3.default)(Subscription, null, [{
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

  function Subscription(model, condition, getUrlOptions, callback) {
    (0, _classCallCheck3.default)(this, Subscription);

    this._guid = (0, _guid2.default)();
    this._model = model;
    this._condition = condition;
    this._getUrlOptions = getUrlOptions;
    _callbacks[this._guid] = callback;
  }

  (0, _createClass3.default)(Subscription, [{
    key: 'open',
    value: function open() {
      var _this = this;

      if (_webSocket != null) {
        waitForConnect.then(function () {
          _webSocket.send(Command.subscribe(_this._guid, _this._model, _this._condition, _this._getUrlOptions));
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
      return this._model === subscription._model && this._condition === subscription._condition && this._getUrlOptions === subscription._getUrlOptions;
    }
  }]);
  return Subscription;
}();

exports.default = Subscription;
exports.bpfrpt_proptype_ActionType = bpfrpt_proptype_ActionType;
exports.bpfrpt_proptype_CallbackType = bpfrpt_proptype_CallbackType;