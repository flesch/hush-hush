'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

require('babel-polyfill');

var stringToRegExp = require('string-to-regexp');

var list = {};

var isShallowEqual = function isShallowEqual(obj1, obj2) {
  var fuzzy = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

  return Object.keys(obj1).every(function (key) {
    if (fuzzy) {
      return typeof obj1[key] === 'string' ? stringToRegExp(obj1[key]).test(obj2[key]) : obj1[key] === obj2[key];
    }
    return obj1[key] === obj2[key];
  });
};

var add = function add(id) {
  var criteria = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

  var feature = list[id];
  if (feature) {
    list[id].criteria = [].concat(_toConsumableArray(feature.criteria), _toConsumableArray(Array.isArray(criteria) ? criteria : [criteria]));
  } else {
    list[id] = { id: id, enabled: false, criteria: Array.isArray(criteria) ? criteria : [criteria] };
  }
  return list[id];
};

var remove = function remove(id, criteria) {
  if ((typeof criteria === 'undefined' ? 'undefined' : _typeof(criteria)) === 'object') {
    var feature = list[id];
    var length = feature.criteria.length;
    feature.criteria = feature.criteria.filter(function (set) {
      return !isShallowEqual(criteria, set, false);
    });
    return length !== feature.criteria.length;
  } else {
    delete list[id];
    return true;
  }
};

var test = function test(id) {
  var state = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var callback = arguments[2];

  var feature = list[id];
  if (feature) {
    var _feature$enabled = feature.enabled;
    var enabled = _feature$enabled === undefined ? true : _feature$enabled;
    var _feature$criteria = feature.criteria;
    var criteria = _feature$criteria === undefined ? [] : _feature$criteria;

    var matches = criteria.filter(function (set) {
      return isShallowEqual(set, state);
    });
    feature.enabled = !!matches.length;
    if (typeof callback === 'function') {
      return callback(null, feature.enabled, Object.assign({}, feature, { state: state, matches: matches }));
    } else {
      return feature.enabled;
    }
  } else {
    if (typeof callback === 'function') {
      return callback(new Error('Unable to find a feature called \'' + id + '.\''));
    } else {
      return false;
    }
  }
};

module.exports = { list: list, add: add, remove: remove, test: test };
