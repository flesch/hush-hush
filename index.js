'use strict';

const equalish = require('equalish');
const stringToRegExp = require('string-to-regexp');

class HushHush {

  constructor(criteria) {
    this.criteria = Array.isArray(criteria) ? criteria : [criteria];
    this.comparator = (a, b) => stringToRegExp(a).test(b);
  }

  add(criteria) {
    this.criteria = this.criteria.concat(Array.isArray(criteria) ? criteria : [criteria]);
    return this;
  }

  remove(criteria) {
    this.criteria = criteria ? this.criteria.filter(set => !equalish(set, criteria)) : [];
    return this;
  }

  test(state, callback) {
    const matches = this.criteria.filter(set => equalish(set, state, this.comparator));
    if (typeof callback === 'function') {
      return callback(null, { enabled:!!matches.length, matches });
    } else {
      return !!matches.length;
    }
  }

}

module.exports = HushHush;
