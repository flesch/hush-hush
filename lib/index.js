'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var equalish = require('equalish');
var stringToRegExp = require('string-to-regexp');

var HushHush = function () {
  function HushHush(criteria) {
    _classCallCheck(this, HushHush);

    this.criteria = Array.isArray(criteria) ? criteria : [criteria];
    this.comparator = function (a, b) {
      return stringToRegExp(a).test(b);
    };
  }

  _createClass(HushHush, [{
    key: 'add',
    value: function add(criteria) {
      this.criteria = this.criteria.concat(Array.isArray(criteria) ? criteria : [criteria]);
      return this;
    }
  }, {
    key: 'remove',
    value: function remove(criteria) {
      this.criteria = criteria ? this.criteria.filter(function (set) {
        return !equalish(set, criteria);
      }) : [];
      return this;
    }
  }, {
    key: 'test',
    value: function test(state, callback) {
      var _this = this;

      var matches = this.criteria.filter(function (set) {
        return equalish(set, state, _this.comparator);
      });
      if (typeof callback === 'function') {
        return callback(null, { enabled: !!matches.length, matches: matches });
      } else {
        return !!matches.length;
      }
    }
  }]);

  return HushHush;
}();

module.exports = HushHush;
