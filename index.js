'use strict';

require('babel-polyfill');

const stringToRegExp = require('string-to-regexp');

const list = {};

const isShallowEqual = (obj1, obj2, fuzzy = true) => {
  return Object.keys(obj1).every(key => {
    if (fuzzy) {
      return typeof obj1[key] === 'string' ? stringToRegExp(obj1[key]).test(obj2[key]) : obj1[key] === obj2[key];
    }
    return obj1[key] === obj2[key];
  });
};

const add = (id, criteria = []) => {
  const feature = list[id];
  if (feature) {
    list[id].criteria = [ ...feature.criteria, ...(Array.isArray(criteria) ? criteria : [criteria]) ];
  } else {
    list[id] = { id, enabled:false, criteria:(Array.isArray(criteria) ? criteria : [criteria]) };
  }
  return list[id];
};

const remove = (id, criteria) => {
  if (typeof criteria === 'object') {
    let feature = list[id];
    let length = feature.criteria.length;
    feature.criteria = feature.criteria.filter(set => !isShallowEqual(criteria, set, false));
    return length !== feature.criteria.length;
  } else {
    delete list[id];
    return true;
  }
};

const test = (id, state = {}, callback) => {
  let feature = list[id];
  if (feature) {
    let { enabled = true, criteria = [] } = feature;
    let matches = criteria.filter(set => isShallowEqual(set, state));
    feature.enabled = !!matches.length;
    if (typeof callback === 'function') {
      return callback(null, feature.enabled, Object.assign({}, feature, { state, matches }));
    } else {
      return feature.enabled;
    }
  } else {
    if (typeof callback === 'function') {
      return callback(new Error(`Unable to find a feature called '${id}.'`));
    } else {
      return false;
    }
  }
};

module.exports = { list, add, remove, test };
