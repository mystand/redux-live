'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var babelPluginFlowReactPropTypes_proptype_HashType = require('../types').babelPluginFlowReactPropTypes_proptype_HashType || require('react').PropTypes.any;

if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_RequestActionOptionSubscribeType', {
  value: require('react').PropTypes.shape({
    model: require('react').PropTypes.string.isRequired,
    condition: require('react').PropTypes.string,
    getUrlOptions: require('react').PropTypes.object
  })
});
if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_RequestActionOptionsType', {
  value: require('react').PropTypes.shape({
    merge: require('react').PropTypes.any,
    subscribe: require('react').PropTypes.shape({
      model: require('react').PropTypes.string.isRequired,
      condition: require('react').PropTypes.string,
      getUrlOptions: require('react').PropTypes.object
    }),
    comparator: require('react').PropTypes.any
  })
});
if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_RequestStartActionType', {
  value: require('react').PropTypes.shape({
    type: require('react').PropTypes.oneOf(['REQUEST_START']).isRequired,
    requestKey: require('react').PropTypes.string.isRequired,
    params: babelPluginFlowReactPropTypes_proptype_HashType,
    options: require('react').PropTypes.shape({
      merge: require('react').PropTypes.any,
      subscribe: require('react').PropTypes.shape({
        model: require('react').PropTypes.string.isRequired,
        condition: require('react').PropTypes.string,
        getUrlOptions: require('react').PropTypes.object
      }),
      comparator: require('react').PropTypes.any
    })
  })
});
if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_RequestSuccessActionType', {
  value: require('react').PropTypes.shape({
    type: require('react').PropTypes.oneOf(['REQUEST_SUCCESS']).isRequired,
    requestKey: require('react').PropTypes.string.isRequired,
    data: require('react').PropTypes.any.isRequired,
    options: require('react').PropTypes.shape({
      merge: require('react').PropTypes.any,
      subscribe: require('react').PropTypes.shape({
        model: require('react').PropTypes.string.isRequired,
        condition: require('react').PropTypes.string,
        getUrlOptions: require('react').PropTypes.object
      }),
      comparator: require('react').PropTypes.any
    })
  })
});
if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_RequestSubscriptionActionOptionsType', {
  value: require('react').PropTypes.shape({
    comparator: require('react').PropTypes.any
  })
});
if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_RequestSubscriptionActionType', {
  value: require('react').PropTypes.shape({
    type: require('react').PropTypes.oneOf(['REQUEST_SUBSCRIPTION_ACTION']).isRequired,
    requestKey: require('react').PropTypes.string.isRequired,
    action: require('react').PropTypes.any.isRequired,
    object: require('react').PropTypes.any,
    options: require('react').PropTypes.shape({
      comparator: require('react').PropTypes.any
    }).isRequired
  })
});
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