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
        var _data = action.data,
            _action$options = action.options;
        _action$options = _action$options === undefined ? {} : _action$options;
        var merge = _action$options.merge;

        return _extends({}, state, _defineProperty({}, requestKey, _extends({}, state[requestKey], {
          loading: false,
          data: mergeData(state[requestKey].data, _data, merge),
          dataError: null
        })));
      }

    case _requestsActions.REQUEST_ERROR:
      {
        var _data2 = action.data;

        return _extends({}, state, _defineProperty({}, requestKey, _extends({}, state[requestKey], {
          loading: false,
          dataError: _data2
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
            return x.id != object.id;
          });
        };
        if (sAction === 'update') {
          fn = function fn(data) {
            var index = _ramda2.default.findIndex(function (x) {
              return x.id == object.id;
            }, data);
            if (index === -1) return [].concat(_toConsumableArray(data), [object]);
            return _ramda2.default.update(index, object, data);
          };
        }

        if (fn != null) return updatePath([_requestKey, 'data'], fn, state);
        console.warn('unrecognized subscribe action \'' + sAction + '\'');
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

var babelPluginFlowReactPropTypes_proptype_ActionType = require('../types').babelPluginFlowReactPropTypes_proptype_ActionType || require('react').PropTypes.any;

var babelPluginFlowReactPropTypes_proptype_RequestActionOptionMergeType = require('../actions/requestsActions').babelPluginFlowReactPropTypes_proptype_RequestActionOptionMergeType || require('react').PropTypes.any;

if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_RequestResultType', {
  value: require('react').PropTypes.shape({
    data: require('react').PropTypes.any.isRequired,
    failureError: require('react').PropTypes.any.isRequired,
    dataError: require('react').PropTypes.any.isRequired,
    loading: require('react').PropTypes.bool.isRequired
  })
});
if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_RequestsReducerStateType', {
  value: require('react').PropTypes.shape({})
});


var defaultState = {};

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

var updatePath = _ramda2.default.curry(function (path, fn, object) {
  var value = fn(_ramda2.default.path(path, object));
  return _ramda2.default.assocPath(path, value, object);
});