'use strict';

import 'babel-polyfill';
import fos from 'filter-objects';

export let list = new Map();

export const add = (id, criteria = []) => {
  let feature = list.get(id);
  if (feature) {
    feature.criteria = [ ...feature.criteria, ...(Array.isArray(criteria) ? criteria : [criteria]) ];
  } else {
    list.set(id, { id, enabled:true, criteria:(Array.isArray(criteria) ? criteria : [criteria]) });
  }
  return list.get(id);
};

export const remove = (id, criteria) => {
  if (typeof criteria === 'object') {
    let feature = list.get(id);
    let length = feature.criteria.length;
    feature.criteria = feature.criteria.filter(set => {
      var match = fos.makeMatchFn(Object.keys(criteria));
      return !match(criteria, set);
    });
    return length !== feature.criteria.length;
  } else {
    return list.delete(id);
  }
};

export const test = (id, state = {}, callback) => {
  let feature = list.get(id);
  if (feature) {
    let { enabled = true, criteria = [] } = feature;
    let matches = criteria.filter(set => {
      let match = fos.makeMatchFn(Object.keys(set), { regExpMatch:true });
      return match(set, state);
    });
    if (typeof callback === 'function') {
      return callback(null, !!matches.length, Object.assign({}, feature, { enabled:!!matches.length, state, matches }));
    } else {
      return !!matches.length;
    }
  } else {
    if (typeof callback === 'function') {
      return callback(new Error(`Unable to find a feature called '${id}.'`));
    } else {
      return false;
    }
  }
};
