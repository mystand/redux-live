'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

exports.default = buildRequestsSaga;

var _requestsActions = require('../actions/requestsActions');

var requestsActions = _interopRequireWildcard(_requestsActions);

var _Subscription = require('../lib/Subscription');

var _Subscription2 = _interopRequireDefault(_Subscription);

var _effects = require('redux-saga/effects');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-line no-duplicate-imports
var subscriptions = {}; // eslint-disable-line no-duplicate-imports

function buildRequestsSaga(Api, dispatch) {
  var _marked = /*#__PURE__*/_regenerator2.default.mark(start);

  // todo fix annotation
  function start(action) {
    var requestKey, dataType, method, params, options, _ref, status, data, codeStart;

    return _regenerator2.default.wrap(function start$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            requestKey = action.requestKey, dataType = action.dataType, method = action.method, params = action.params, options = action.options;
            _context.prev = 1;
            _context.next = 4;
            return (0, _effects.call)(Api[dataType][method], params);

          case 4:
            _ref = _context.sent;
            status = _ref.response.status;
            data = _ref.data;
            codeStart = Math.floor(status / 100);

            if (!(codeStart === 4 || codeStart === 5)) {
              _context.next = 13;
              break;
            }

            _context.next = 11;
            return (0, _effects.put)(requestsActions.error(requestKey, data, status, options, dataType, method, params));

          case 11:
            _context.next = 15;
            break;

          case 13:
            _context.next = 15;
            return (0, _effects.put)(requestsActions.success(requestKey, dataType, method, data, options));

          case 15:
            _context.next = 21;
            break;

          case 17:
            _context.prev = 17;
            _context.t0 = _context['catch'](1);
            _context.next = 21;
            return (0, _effects.put)(requestsActions.failure(requestKey, _context.t0, options));

          case 21:
          case 'end':
            return _context.stop();
        }
      }
    }, _marked, this, [[1, 17]]);
  }

  function createSubscriptionIfNeeded(action) {
    var requestKey = action.requestKey,
        dataType = action.dataType,
        options = action.options;


    if (options != null && options.subscribe != null) {
      var _options$subscribe = options.subscribe,
          model = _options$subscribe.model,
          condition = _options$subscribe.condition,
          getUrlOptions = _options$subscribe.getUrlOptions;
      var comparator = options.comparator;

      var subscription = new _Subscription2.default(model, condition, getUrlOptions, function (sAction, object) {
        dispatch(requestsActions.subscriptionAction(requestKey, dataType, sAction, object, { comparator: comparator }));
      });
      if (!subscription.isEqual(subscriptions[requestKey])) {
        clearSubscriptionIfNeeded({ requestKey: requestKey });
        subscriptions[requestKey] = subscription;
        subscriptions[requestKey].open();
      }
    }
  }

  function clearSubscriptionIfNeeded(action) {
    var requestKey = action.requestKey;

    if (subscriptions[requestKey] != null) {
      subscriptions[requestKey].close();
      delete subscriptions[requestKey];
    }
  }

  return (/*#__PURE__*/_regenerator2.default.mark(function requestSaga() {
      return _regenerator2.default.wrap(function requestSaga$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return (0, _effects.takeEvery)(requestsActions.REQUEST_START, start);

            case 2:
              _context2.next = 4;
              return (0, _effects.takeEvery)(requestsActions.REQUEST_SUCCESS, createSubscriptionIfNeeded);

            case 4:
              _context2.next = 6;
              return (0, _effects.takeEvery)(requestsActions.REQUEST_CLEAR, clearSubscriptionIfNeeded);

            case 6:
            case 'end':
              return _context2.stop();
          }
        }
      }, requestSaga, this);
    })
  );
}