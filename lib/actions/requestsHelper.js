'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateIndex = generateIndex;
exports.generateGet = generateGet;
exports.generateCreate = generateCreate;
exports.generateUpdate = generateUpdate;
exports.generateDestroy = generateDestroy;

var _requestsActions = require('./requestsActions');

var _types = require('../types');

var _requestsActions2 = require('../actions/requestsActions');

function generateIndex(dataType) {
  return function (requestKey, params, options) {
    return {
      type: _requestsActions.REQUEST_START,
      method: 'index',
      requestKey: requestKey,
      dataType: dataType,
      params: params,
      options: options
    };
  };
}
function generateGet(dataType) {
  return function (requestKey, params, options) {
    return {
      type: _requestsActions.REQUEST_START,
      method: 'get',
      requestKey: requestKey,
      dataType: dataType,
      params: params,
      options: options
    };
  };
}

function generateCreate(dataType) {
  return function (requestKey, params, options) {
    return {
      type: _requestsActions.REQUEST_START,
      method: 'create',
      requestKey: requestKey,
      dataType: dataType,
      params: params,
      options: options
    };
  };
}

function generateUpdate(dataType) {
  return function (requestKey, params, options) {
    return {
      type: _requestsActions.REQUEST_START,
      method: 'update',
      requestKey: requestKey,
      dataType: dataType,
      params: params,
      options: options
    };
  };
}

function generateDestroy(dataType) {
  return function (requestKey, params, options) {
    return {
      type: _requestsActions.REQUEST_START,
      method: 'destroy',
      requestKey: requestKey,
      dataType: dataType,
      params: params,
      options: options
    };
  };
}