'use strict';

import stringToRegExp from 'string-to-regexp';

export let features = [];

export const feature = (id, criteria) => {
  let feature = features.find(feature => feature.id === id);
  if (feature) {
    feature.criteria = [ ...feature.criteria, ...(Array.isArray(criteria) ? criteria : [criteria]) ];
  } else {
    features.push({ id, enabled:true, criteria:(Array.isArray(criteria) ? criteria : [criteria]) });
  }
};

export const toggle = (id, state = {}, callback) => {

  let feature = features.find(feature => feature.id === id);

  if (feature) {
    let { enabled = true, criteria } = feature;
    let matches = criteria.filter(set => {
      return enabled && Object.keys(set).every(key => {
        let expression = stringToRegExp(set[key]);
        return expression ? expression.test(state[key]) : false;
      });
    });
    if (typeof callback === 'function') {
      return callback(null, !!matches.length, Object.assign({}, feature, { enabled:!!matches.length, matches }));
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

const enable_disable = (state) => {
  return (id) => {
    let feature = features.find(feature => feature.id === id);
    feature.enabled = state;
    return feature;
  }
};

export const enable = enable_disable(true);
export const disable = enable_disable(false);
