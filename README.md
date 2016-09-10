# hush-hush

[![npm](https://img.shields.io/npm/v/hush-hush.svg)](https://www.npmjs.com/package/hush-hush) [![Dependencies](https://david-dm.org/flesch/hush-hush.svg)](https://david-dm.org/flesch/hush-hush) [![Build Status](https://travis-ci.org/flesch/hush-hush.svg?branch=master)](https://travis-ci.org/flesch/hush-hush)

> For when you need to keep that **Super Secret Beta Feature** "hush-hush".

**hush-hush** lets you enable features in your application when the **state** you provide matches a set of criteria.

> :warning: This is a pre-release version while the API is being finalized!

## Install

**hush-hush** is available in both Node and the browser.

```bash
$ npm install --save hush-hush
```

In your application, `require` or `import` it.

```javascript
const features = require('hush-hush');
```

You'll notice I'm using `features` instead of `hushhush`. Not only is `hushhush` kind of ugly, it's very easy to misspell (`hushush !== hushhush`). Or you can avoid the whole mess using the destructuring syntax.

```javascript
import { add, remove, test } from 'hush-hush';
```

To use **hush-hush** directly in the browser, load the `latest` release version like so:

```html
<script src="https://cdn.rawgit.com/flesch/hush-hush/master/releases/hush-hush-latest.min.js"></script>
```

**Note**: This will expose **hush-hush** as `window.features`.

## Usage

### .add(id:String, criteria:Array,Object)

The first thing you'll do is **add** a **feature** and some **criteria**. When tested, the feature will enable if any of the criteria matches the state provided. (**tl;dr**: Filter "criteria" objects by state. If any are left, the feature is enabled.)

```javascript
features.add('secret-beta-feature', [
  { environment:'beta', role:'tester' },
  { environment:'^prod(uction)?$', user:'bbe6a53d-cee3-4562-af08-c892a4b3ca62' }
]);
```

| Argument | Type | Required | Description |
|:--|:--|:--|:--|
| id | String | Yes | The unique name of the feature. |
| criteria | Array, Object | Yes | Each set of "criteria" is defined as an Object. This can be an Array of criteria Objects, or a single plain Object. |

`criteria` is a plain Object - for best results try not to nest properties. You'll notice that strings are converted to regular expressions.

This method will return the feature added:

```javascript
{ id:'secret-beta-feature', enabled:true, criteria:[{}, {}] }
```

### .test(id:String, state:Object, callback:Function)

Once you've defined all of your features and the criteria needed for each to be enabled, you'll **test** against an object describing the current state.


```javascript
let state = { 
  environment: 'beta',
  role: 'tester',
  user: 'bbe6a53d-cee3-4562-af08-c892a4b3ca62'
};

features.test('secret-beta-feature', state, (err, enabled, feature) => {
  if (enabled) {
    console.log(`Yes, "${feature.id}" is enabled!`);
  }
});

```

| Argument | Type | Required | Description |
|:--|:--|:--|:--|
| id | String | Yes | The unique name of the feature. |
| state | Object | Yes | An object that each set of criteria will be tested against. |
| callback | Function | No | If omitted, .test() will return a Boolean. |

The `state` provided will be matched against each set of criteria. If **any** of the sets of criteria match, the feature is enabled.

When the test is complete, `callback` is executed, unless it's omitted, in which case a `Boolean` is returned.

### .remove(id:String, criteria:Object)

| Argument | Type | Required | Description |
|:--|:--|:--|:--|
| id | String | Yes | The unique name of the feature. |
| criteria | Object | No | A "criteria" object that will be removed from the set. |

You can remove indiviual sets of criteria from a feature:

```javascript
features.remove('secret-beta-feature', { environment:'beta', role:'tester' });
```

Or remove the feature entirely:

```javascript
features.remove('secret-beta-feature');
```

This method will return a `true` if critera or feature were successfully removed.

### Listing enabled features

The collection of features that have been added are exposed through the `.list` property (which is an ES6 `Map`). Once, you've tested each feature, you can report which ones are enabled:

```javascript
let enabled = Object.keys(features.list).filter(feature => {
  return features.list[feature].enabled;
});
```

> :warning: Be careful using this functionality. New features added through `.add` are enabled by default, and only disabled when the criteria doesn't match the state after it's been tested.

## License

(The MIT License)

Copyright (c) 2016 [John Flesch](http://fles.ch).

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.