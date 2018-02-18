'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bpfrpt_proptype_RequestsDeclarationType = exports.bpfrpt_proptype_RequestDeclarationItemType = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

exports.default = connectWithRequests;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _reactRedux = require('react-redux');

var _coreDecorators = require('core-decorators');

var _reselect = require('reselect');

var _requestsActions = require('../actions/requestsActions');

var requestsActions = _interopRequireWildcard(_requestsActions);

var _guid = require('../lib/guid');

var _guid2 = _interopRequireDefault(_guid);

var _requestsReducer = require('../reducers/requestsReducer');

var _types = require('../types');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

var bpfrpt_proptype_RequestDeclarationItemType = {
  key: _propTypes2.default.string.isRequired,
  action: _propTypes2.default.func.isRequired,
  cacheKey: _propTypes2.default.func
};

var bpfrpt_proptype_RequestsDeclarationType = _propTypes2.default.arrayOf(_propTypes2.default.shape({
  key: _propTypes2.default.string.isRequired,
  action: _propTypes2.default.func.isRequired,
  cacheKey: _propTypes2.default.func
}));

var EMPTY_OBJECT = {};

function connectWithRequests(requestsDeclaration) {
  var mapStateToProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {
    return EMPTY_OBJECT;
  };
  var mapDispatchToProps = arguments[2];
  var mergeProps = arguments[3];
  var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

  return function (Component) {
    var resultSelectors = requestsDeclaration.map(function (request) {
      return function (state, props) {
        return state.requests[props._requestsPrefix + '-' + request.key] || _requestsReducer.defaultResult;
      };
    });

    var mapStateToPropsSelector = _reselect.createSelector.apply(undefined, [mapStateToProps].concat((0, _toConsumableArray3.default)(resultSelectors), [function (props) {
      for (var _len = arguments.length, results = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        results[_key - 1] = arguments[_key];
      }

      var result = (0, _extends3.default)({}, props);
      for (var i = 0; i < results.length; ++i) {
        result[requestsDeclaration[i].key + 'Result'] = results[i];
      }
      return result;
    }]));

    return _ramda2.default.compose(withRequests(requestsDeclaration),
    // $FlowIgnore todo
    (0, _reactRedux.connect)(mapStateToPropsSelector, mapDispatchToProps, mergeProps, (0, _extends3.default)({ withRef: true }, options)))(Component);
  };
}

function withRequests(requestsDeclaration) {
  return function (Component) {
    var _desc, _value, _class2;

    return _class2 = function (_React$Component) {
      (0, _inherits3.default)(WithRequests, _React$Component);

      function WithRequests() {
        (0, _classCallCheck3.default)(this, WithRequests);

        var _this = (0, _possibleConstructorReturn3.default)(this, (WithRequests.__proto__ || Object.getPrototypeOf(WithRequests)).call(this));

        _this.displayName = 'WithRequests(' + Component.displayName + ')';
        _this._requestsPrefix = (0, _guid2.default)();
        _this._requestsCacheKeys = {};
        _this._additionalKeys = [];
        return _this;
      }

      (0, _createClass3.default)(WithRequests, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
          var _this2 = this;

          var wrappedComponent = this.connectComponent.getWrappedInstance();

          if (wrappedComponent == null) {
            // wrapped component is a function
            var oldWillUpdate = this.connectComponent.componentWillUpdate;
            // $FlowIgnore
            var _props = this.connectComponent.selector.props;
            // $FlowIgnore

            this.connectComponent.componentWillUpdate = function (nextProps, nextState) {
              _this2._performRequestsIfNeeded(_props, null);
              if (oldWillUpdate != null) {
                oldWillUpdate.call(_this2.connectComponent, nextProps, nextState);
              }
            };
            this._performRequestsIfNeeded(_props, null);
          } else {
            // wrapped component is a class
            var _oldWillUpdate = wrappedComponent.componentWillUpdate;
            // $FlowIgnore
            wrappedComponent.componentWillUpdate = function (nextProps, nextState) {
              _this2._performRequestsIfNeeded(nextProps, nextState);
              if (_oldWillUpdate != null) {
                _oldWillUpdate.call(wrappedComponent, nextProps, nextState);
              }
            };
            // $FlowIgnore flow bug
            var _state = wrappedComponent.state;
            this._performRequestsIfNeeded(wrappedComponent.props, _state);
          }
        }
      }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          var _this3 = this;

          // $FlowIgnore
          var dispatch = this.connectComponent.store.dispatch;


          var keysForClear = [].concat((0, _toConsumableArray3.default)(requestsDeclaration.map(function (x) {
            return x.key;
          })), (0, _toConsumableArray3.default)(this._additionalKeys));

          keysForClear.forEach(function (key) {
            dispatch(requestsActions.clear(_this3._requestsPrefix + '-' + key));
          });
        }
      }, {
        key: '_performRequestsIfNeeded',
        value: function _performRequestsIfNeeded(props, state) {
          var _this4 = this;

          // $FlowIgnore
          var dispatch = this.connectComponent.store.dispatch;


          requestsDeclaration.forEach(function (request) {
            var key = request.key,
                actionCreator = request.action,
                cacheKeyFn = request.cacheKey;

            var previousCacheKey = _this4._requestsCacheKeys[key] || null;
            var cacheKey = cacheKeyFn ? cacheKeyFn(props, state) : null;

            if (previousCacheKey !== cacheKey) {
              var requestKey = _this4._requestsPrefix + '-' + key;
              _this4._requestsCacheKeys[key] = cacheKey;
              dispatch((0, _extends3.default)({}, actionCreator(props, state), { requestKey: requestKey }));
            }
          });
        }
      }, {
        key: 'connectRef',
        value: function connectRef(el) {
          this.connectComponent = el;
        }
      }, {
        key: 'dispatchRequest',
        value: function dispatchRequest(action) {
          // $FlowIgnore
          var dispatch = this.connectComponent.store.dispatch;


          var fullKey = this._requestsPrefix + '-' + action.requestKey;
          this._additionalKeys.push(action.requestKey);
          dispatch((0, _extends3.default)({}, action, { requestKey: fullKey }));
        }
      }, {
        key: 'performRequest',
        value: function performRequest(requestKey) {
          // $FlowIgnore
          var request = requestsDeclaration.find(function (x) {
            return x.key === requestKey;
          });
          if (request) {
            var _key2 = request.key,
                actionCreator = request.action;
            var dispatch = this.connectComponent.store.dispatch;

            var _requestKey = this._requestsPrefix + '-' + _key2;
            var wrappedComponent = this.connectComponent.getWrappedInstance();

            if (wrappedComponent != null) {
              var _props2 = wrappedComponent.props,
                  _state2 = wrappedComponent.state;

              dispatch((0, _extends3.default)({}, actionCreator(_props2, _state2), { requestKey: _requestKey }));
            } else {
              var _props3 = this.connectComponent.selector.props;
              dispatch((0, _extends3.default)({}, actionCreator(_props3, null), { requestKey: _requestKey }));
            }
          } else {
            console.error('Undefined request key \'' + requestKey + '\'');
          }
        }
      }, {
        key: 'render',
        value: function render() {
          return _react2.default.createElement(Component, (0, _extends3.default)({}, this.props, {
            ref: this.connectRef,
            dispatchRequest: this.dispatchRequest,
            performRequest: this.performRequest,
            _requestsPrefix: this._requestsPrefix
          }));
        }
      }]);
      return WithRequests;
    }(_react2.default.Component), (_applyDecoratedDescriptor(_class2.prototype, 'connectRef', [_coreDecorators.autobind], Object.getOwnPropertyDescriptor(_class2.prototype, 'connectRef'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'dispatchRequest', [_coreDecorators.autobind], Object.getOwnPropertyDescriptor(_class2.prototype, 'dispatchRequest'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'performRequest', [_coreDecorators.autobind], Object.getOwnPropertyDescriptor(_class2.prototype, 'performRequest'), _class2.prototype)), _class2;
  };
}
withRequests.propTypes = bpfrpt_proptype_RequestsDeclarationType;
exports.bpfrpt_proptype_RequestDeclarationItemType = bpfrpt_proptype_RequestDeclarationItemType;
exports.bpfrpt_proptype_RequestsDeclarationType = bpfrpt_proptype_RequestsDeclarationType;