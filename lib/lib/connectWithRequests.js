'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = connectWithRequests;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _reactRedux = require('react-redux');

var _coreDecorators = require('core-decorators');

var _requestsActions = require('../actions/requestsActions');

var requestsActions = _interopRequireWildcard(_requestsActions);

var _guid = require('../lib/guid');

var _guid2 = _interopRequireDefault(_guid);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

var babelPluginFlowReactPropTypes_proptype_ActionType = require('../types').babelPluginFlowReactPropTypes_proptype_ActionType || require('react').PropTypes.any;

var babelPluginFlowReactPropTypes_proptype_HashType = require('../types').babelPluginFlowReactPropTypes_proptype_HashType || require('react').PropTypes.any;

var babelPluginFlowReactPropTypes_proptype_RequestStartActionType = require('../actions/requestsActions').babelPluginFlowReactPropTypes_proptype_RequestStartActionType || require('react').PropTypes.any;

if (typeof exports !== 'undefined') Object.defineProperty(exports, 'babelPluginFlowReactPropTypes_proptype_RequestDeclarationItemType', {
  value: require('react').PropTypes.shape({
    key: require('react').PropTypes.string.isRequired,
    action: require('react').PropTypes.func.isRequired,
    cacheKey: require('react').PropTypes.func
  })
});
function connectWithRequests(requestsDeclaration, mapStateToProps, mapDispatchToProps, mergeProps) {
  var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

  return function (Component) {
    return _ramda2.default.compose(withRequests(requestsDeclaration),

    // $FlowIgnore todo
    (0, _reactRedux.connect)(function (state, props) {
      var result = mapStateToProps !== undefined ? mapStateToProps(state, props) : {};
      requestsDeclaration.forEach(function (request) {
        result[request.key + 'Result'] = state.requests[props._requestsPrefix + '-' + request.key];
      });
      return result;
    }, mapDispatchToProps, mergeProps, _extends({ withRef: true }, options)))(Component);
  };
}

function withRequests(requestsDeclaration) {
  return function (Component) {
    var _desc, _value, _class2;

    return _class2 = function (_React$Component) {
      _inherits(WithRequests, _React$Component);

      function WithRequests() {
        _classCallCheck(this, WithRequests);

        var _this = _possibleConstructorReturn(this, (WithRequests.__proto__ || Object.getPrototypeOf(WithRequests)).call(this));

        _this.displayName = 'WithRequests(' + Component.displayName + ')';
        _this._requestsPrefix = (0, _guid2.default)();
        _this._requestsCacheKeys = {};
        _this._additionalKeys = [];
        return _this;
      }

      _createClass(WithRequests, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
          var _this2 = this;

          var wrappedComponent = this.connectComponent.getWrappedInstance();

          if (wrappedComponent == null) {
            // wrapped component is a function
            var oldWillUpdate = this.connectComponent.componentWillUpdate;
            // $FlowIgnore
            var selector = this.connectComponent.selector;
            // $FlowIgnore

            this.connectComponent.componentWillUpdate = function (nextProps, nextState) {
              _this2._performRequestsIfNeeded(selector.props, null);
              if (oldWillUpdate !== undefined) {
                oldWillUpdate.call(_this2.connectComponent, nextProps, nextState);
              }
            };
            this._performRequestsIfNeeded(selector.props, null);
          } else {
            // wrapped component is a class
            var _oldWillUpdate = wrappedComponent.componentWillUpdate;
            // $FlowIgnore
            wrappedComponent.componentWillUpdate = function (nextProps, nextState) {
              _this2._performRequestsIfNeeded(nextProps, nextState);
              if (_oldWillUpdate !== undefined) {
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


          var keysForClear = [].concat(_toConsumableArray(requestsDeclaration.map(function (x) {
            return x.key;
          })), _toConsumableArray(this._additionalKeys));

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
              dispatch(_extends({}, actionCreator(props, state), { requestKey: requestKey }));
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
          dispatch(_extends({}, action, { requestKey: fullKey }));
        }
      }, {
        key: 'render',
        value: function render() {
          return _react2.default.createElement(Component, _extends({}, this.props, {
            ref: this.connectRef,
            dispatchRequest: this.dispatchRequest,
            _requestsPrefix: this._requestsPrefix
          }));
        }
      }]);

      return WithRequests;
    }(_react2.default.Component), (_applyDecoratedDescriptor(_class2.prototype, 'connectRef', [_coreDecorators.autobind], Object.getOwnPropertyDescriptor(_class2.prototype, 'connectRef'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'dispatchRequest', [_coreDecorators.autobind], Object.getOwnPropertyDescriptor(_class2.prototype, 'dispatchRequest'), _class2.prototype)), _class2;
  };
}