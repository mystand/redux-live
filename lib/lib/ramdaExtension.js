'use strict';

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

_ramda2.default.isDate = _ramda2.default.is(Date);

_ramda2.default.log = function (argument) {
  console.log(argument); // eslint-disable-line no-console
  return argument;
};

_ramda2.default.isPresent = function (x) {
  return !_ramda2.default.isNil(x) && !_ramda2.default.isEmpty(x);
};

_ramda2.default.isString = _ramda2.default.is(String);

_ramda2.default.toggle = _ramda2.default.curry(function (value, array) {
  return array.includes(value) ? _ramda2.default.without([value], array) : [].concat(_toConsumableArray(array), [value]);
});

_ramda2.default.updatePath = _ramda2.default.curry(function (path, fn, object) {
  var value = fn(_ramda2.default.path(path, object));
  return _ramda2.default.assocPath(path, value, object);
});

_ramda2.default.replaceBy = _ramda2.default.curry(function (fn, value, array) {
  var index = _ramda2.default.findIndex(fn, array);
  return _ramda2.default.update(index, value, array);
});