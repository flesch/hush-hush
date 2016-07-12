'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.test = exports.remove = exports.add = exports.list = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

require('babel-polyfill');

var _filterObjects = require('filter-objects');

var _filterObjects2 = _interopRequireDefault(_filterObjects);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var list = exports.list = new Map();

var add = exports.add = function add(id) {
  var criteria = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

  var feature = list.get(id);
  if (feature) {
    feature.criteria = [].concat(_toConsumableArray(feature.criteria), _toConsumableArray(Array.isArray(criteria) ? criteria : [criteria]));
  } else {
    list.set(id, { id: id, enabled: true, criteria: Array.isArray(criteria) ? criteria : [criteria] });
  }
  return list.get(id);
};

var remove = exports.remove = function remove(id, criteria) {
  if ((typeof criteria === 'undefined' ? 'undefined' : _typeof(criteria)) === 'object') {
    var feature = list.get(id);
    var length = feature.criteria.length;
    feature.criteria = feature.criteria.filter(function (set) {
      var match = _filterObjects2.default.makeMatchFn(Object.keys(criteria));
      return !match(criteria, set);
    });
    return length !== feature.criteria.length;
  } else {
    return list.delete(id);
  }
};

var test = exports.test = function test(id) {
  var state = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var callback = arguments[2];

  var feature = list.get(id);
  if (feature) {
    var _feature$enabled = feature.enabled;
    var enabled = _feature$enabled === undefined ? true : _feature$enabled;
    var _feature$criteria = feature.criteria;
    var criteria = _feature$criteria === undefined ? [] : _feature$criteria;

    var matches = criteria.filter(function (set) {
      var match = _filterObjects2.default.makeMatchFn(Object.keys(set), { regExpMatch: true });
      return match(set, state);
    });
    if (typeof callback === 'function') {
      return callback(null, !!matches.length, Object.assign({}, feature, { enabled: !!matches.length, state: state, matches: matches }));
    } else {
      return !!matches.length;
    }
  } else {
    if (typeof callback === 'function') {
      return callback(new Error('Unable to find a feature called \'' + id + '.\''));
    } else {
      return false;
    }
  }
};
