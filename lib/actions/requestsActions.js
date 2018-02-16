'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bpfrpt_proptype_RequestSubscriptionActionType = exports.bpfrpt_proptype_RequestSubscriptionActionOptionsType = exports.bpfrpt_proptype_SubscriptionActionType = exports.bpfrpt_proptype_RequestSuccessActionType = exports.bpfrpt_proptype_RequestStartActionType = exports.bpfrpt_proptype_RequestActionOptionsType = exports.bpfrpt_proptype_RequestActionOptionSubscribeType = exports.bpfrpt_proptype_RequestOptionComparatorType = exports.bpfrpt_proptype_RequestActionOptionMergeType = exports.subscriptionAction = exports.clear = exports.failure = exports.error = exports.success = exports.REQUEST_SUBSCRIPTION_ACTION = exports.REQUEST_CLEAR = exports.REQUEST_FAILURE = exports.REQUEST_ERROR = exports.REQUEST_SUCCESS = exports.REQUEST_START = undefined;

var _types = require('../types');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var bpfrpt_proptype_RequestActionOptionMergeType = _propTypes2.default.oneOf(['replace', 'append']);

var bpfrpt_proptype_RequestOptionComparatorType = _propTypes2.default.func;
var bpfrpt_proptype_RequestActionOptionSubscribeType = {
  model: _propTypes2.default.string.isRequired,
  condition: _propTypes2.default.string,
  getUrlOptions: _propTypes2.default.object
};
var bpfrpt_proptype_RequestActionOptionsType = {
  merge: _propTypes2.default.oneOf(['replace', 'append']),
  subscribe: _propTypes2.default.shape({
    model: _propTypes2.default.string.isRequired,
    condition: _propTypes2.default.string,
    getUrlOptions: _propTypes2.default.object
  }),
  comparator: _propTypes2.default.func
};
var bpfrpt_proptype_RequestStartActionType = {
  type: _propTypes2.default.oneOf(['REQUEST_START']).isRequired,
  requestKey: _propTypes2.default.string.isRequired,
  params: function params() {
    return (typeof _types.bpfrpt_proptype_HashType === 'function' ? _types.bpfrpt_proptype_HashType : _propTypes2.default.shape(_types.bpfrpt_proptype_HashType)).apply(this, arguments);
  },
  options: _propTypes2.default.shape({
    merge: _propTypes2.default.oneOf(['replace', 'append']),
    subscribe: _propTypes2.default.shape({
      model: _propTypes2.default.string.isRequired,
      condition: _propTypes2.default.string,
      getUrlOptions: _propTypes2.default.object
    }),
    comparator: _propTypes2.default.func
  })
};
var bpfrpt_proptype_RequestSuccessActionType = {
  type: _propTypes2.default.oneOf(['REQUEST_SUCCESS']).isRequired,
  requestKey: _propTypes2.default.string.isRequired,
  data: function data() {
    return (typeof D === 'function' ? _propTypes2.default.instanceOf(D).isRequired : _propTypes2.default.any.isRequired).apply(this, arguments);
  },
  options: _propTypes2.default.shape({
    merge: _propTypes2.default.oneOf(['replace', 'append']),
    subscribe: _propTypes2.default.shape({
      model: _propTypes2.default.string.isRequired,
      condition: _propTypes2.default.string,
      getUrlOptions: _propTypes2.default.object
    }),
    comparator: _propTypes2.default.func
  })
};

var bpfrpt_proptype_SubscriptionActionType = _propTypes2.default.oneOf(['create', 'update', 'destroy']);

var bpfrpt_proptype_RequestSubscriptionActionOptionsType = {
  comparator: _propTypes2.default.func
};
var bpfrpt_proptype_RequestSubscriptionActionType = {
  type: _propTypes2.default.oneOf(['REQUEST_SUBSCRIPTION_ACTION']).isRequired,
  requestKey: _propTypes2.default.string.isRequired,
  action: _propTypes2.default.oneOf(['create', 'update', 'destroy']).isRequired,
  object: function object() {
    return (typeof O === 'function' ? _propTypes2.default.instanceOf(O) : _propTypes2.default.any).apply(this, arguments);
  },
  options: _propTypes2.default.shape({
    comparator: _propTypes2.default.func
  }).isRequired
};
var REQUEST_START = exports.REQUEST_START = 'REQUEST_START';
var REQUEST_SUCCESS = exports.REQUEST_SUCCESS = 'REQUEST_SUCCESS';
var REQUEST_ERROR = exports.REQUEST_ERROR = 'REQUEST_ERROR';
var REQUEST_FAILURE = exports.REQUEST_FAILURE = 'REQUEST_FAILURE';
var REQUEST_CLEAR = exports.REQUEST_CLEAR = 'REQUEST_CLEAR';
var REQUEST_SUBSCRIPTION_ACTION = exports.REQUEST_SUBSCRIPTION_ACTION = 'REQUEST_SUBSCRIPTION_ACTION';

var success = exports.success = function success(requestKey, dataType, method, data, options) {
  return {
    type: REQUEST_SUCCESS, requestKey: requestKey, dataType: dataType, method: method, data: data, options: options
  };
};

var error = exports.error = function error(requestKey, data, status, options) {
  return {
    type: REQUEST_ERROR, requestKey: requestKey, data: data, status: status, options: options
  };
};

var failure = exports.failure = function failure(requestKey, error, options) {
  return {
    type: REQUEST_FAILURE, requestKey: requestKey, error: error, options: options
  };
};

var clear = exports.clear = function clear(requestKey) {
  return {
    type: REQUEST_CLEAR, requestKey: requestKey
  };
};

var subscriptionAction = exports.subscriptionAction = function subscriptionAction(requestKey, dataType, action, object, options) {
  return {
    type: REQUEST_SUBSCRIPTION_ACTION, requestKey: requestKey, dataType: dataType, action: action, object: object, options: options
  };
};
exports.bpfrpt_proptype_RequestActionOptionMergeType = bpfrpt_proptype_RequestActionOptionMergeType;
exports.bpfrpt_proptype_RequestOptionComparatorType = bpfrpt_proptype_RequestOptionComparatorType;
exports.bpfrpt_proptype_RequestActionOptionSubscribeType = bpfrpt_proptype_RequestActionOptionSubscribeType;
exports.bpfrpt_proptype_RequestActionOptionsType = bpfrpt_proptype_RequestActionOptionsType;
exports.bpfrpt_proptype_RequestStartActionType = bpfrpt_proptype_RequestStartActionType;
exports.bpfrpt_proptype_RequestSuccessActionType = bpfrpt_proptype_RequestSuccessActionType;
exports.bpfrpt_proptype_SubscriptionActionType = bpfrpt_proptype_SubscriptionActionType;
exports.bpfrpt_proptype_RequestSubscriptionActionOptionsType = bpfrpt_proptype_RequestSubscriptionActionOptionsType;
exports.bpfrpt_proptype_RequestSubscriptionActionType = bpfrpt_proptype_RequestSubscriptionActionType;