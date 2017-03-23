'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
  var action = arguments[1];
  var type = action.type,
      requestKey = action.requestKey;


  switch (type) {
    case _requestsActions.REQUEST_START:
      return _extends({}, state, _defineProperty({}, requestKey, _extends({}, state[requestKey], {
        loading: true,
        failureError: null
      })));

    case _requestsActions.REQUEST_SUCCESS:
      {
        var data = action.data,
            _action$options = action.options;
        _action$options = _action$options === undefined ? {} : _action$options;
        var _merge = _action$options.merge;

        return _extends({}, state, _defineProperty({}, requestKey, _extends({}, state[requestKey], {
          loading: false,
          data: mergeData(state[requestKey].data, data, _merge),
          dataError: null
        })));
      }

    case _requestsActions.REQUEST_ERROR:
      {
        var _data = action.data;

        return _extends({}, state, _defineProperty({}, requestKey, _extends({}, state[requestKey], {
          loading: false,
          dataError: _data
        })));
      }

    case _requestsActions.REQUEST_FAILURE:
      {
        var error = action.error;

        return _extends({}, state, _defineProperty({}, requestKey, _extends({}, state[requestKey], {
          loading: false,
          failureError: error
        })));
      }

    case _requestsActions.REQUEST_CLEAR:
      {
        return _ramda2.default.dissoc(requestKey, state);
      }

    case _requestsActions.REQUEST_SUBSCRIPTION_ACTION:
      {
        var _requestKey = action.requestKey,
            sAction = action.action,
            object = action.object;

        var fn = null;

        if (sAction === 'create') fn = function fn(data) {
          return [].concat(_toConsumableArray(data), [object]);
        };
        if (sAction === 'destroy') fn = function fn(data) {
          return data.filter(function (x) {
            return x.id == object.id;
          });
        };
        if (sAction === 'update') fn = function fn(data) {
          return _ramda2.default.replaceBy(function (x) {
            return x.id == object.id;
          }, object, data);
        };

        if (fn != null) return _ramda2.default.updatePath([_requestKey, 'data'], fn, state);
        return state;
      }

    default:
      return state;
  }
};

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _requestsActions = require('../actions/requestsActions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var babelPluginFlowReactPropTypes_proptype_HashType = require('../types').babelPluginFlowReactPropTypes_proptype_HashType || require('react').PropTypes.any;

var defaultState = {};

if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_OptionsSubscribeType', {
  value: require('react').PropTypes.shape({
    model: require('react').PropTypes.string.isRequired,
    params: babelPluginFlowReactPropTypes_proptype_HashType
  })
});
if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_OptionsType', {
  value: require('react').PropTypes.shape({
    merge: require('react').PropTypes.any,
    subscribe: require('react').PropTypes.shape({
      model: require('react').PropTypes.string.isRequired,
      params: babelPluginFlowReactPropTypes_proptype_HashType
    })
  })
});


function mergeData(oldData, newData) {
  var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'replace';

  if (type === 'replace') return newData;
  if (type === 'append') {
    if (oldData == null) return newData;
    if (newData == null) return oldData;
    if (oldData instanceof Array && newData instanceof Array) return [].concat(_toConsumableArray(oldData), _toConsumableArray(newData));
    throw new Error('Unacceptable data types: ' + oldData.constructor.name + ' and ' + newData.constructor.name);
  }
}