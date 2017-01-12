# hush-hush@v2

[![npm](https://img.shields.io/npm/v/hush-hush.svg)](https://www.npmjs.com/package/hush-hush) [![Dependencies](https://david-dm.org/flesch/hush-hush.svg)](https://david-dm.org/flesch/hush-hush)

> For when you need to keep that **Super Secret Beta Feature** "hush-hush".

**hush-hush** lets you enable features in your application when the **state** you provide matches a set of criteria.

## Install

**hush-hush** is available as Node module. Bundle it for the browser with Browserify or Webpack.

> :warning: v2 is a breaking change from the v1 alphas. The API has changed significantly.

```bash
$ npm install --save hush-hush
```

In your application, `require` or `import` it.

```javascript
const HushHush = require('hush-hush');
```

## Usage

### new HushHush(criteria:Array)

First, create an new `HushHush` instance of a feature you might want to enable (with or without a set of criteria).

```javascript
// Create an instance without any criteria.
const const secretBetaFeature = new HushHush();

// Create an instance with an array of the initial criteria.
const secretBetaFeature = new HushHush([
  { environment:'beta', role:'tester' },
  { environment:'^prod(uction)?$', user:'bbe6a53d-cee3-4562-af08-c892a4b3ca62' }
]);

// Create an instance with an initial criteria object.
const secretBetaFeature = new HushHush({ environment:'beta', role:'tester' });
```

`criteria` is a plain Object - for best results try not to nest properties. You'll notice that strings are converted to regular expressions.

### .add(criteria:Array,Object)

You can add additional sets of criteria later. Just `.add` it with an Array or Object.

```javascript
secretBetaFeature.add({ environment:'beta', role:'beta-opt-in' });
```

### .remove(criteria:Object)

You can remove individual sets of criteria from a feature:

```javascript
secretBetaFeature.remove({ environment:'beta', role:'tester' });
```

Or remove all criteria at once:

```javascript
secretBetaFeature.remove();
```

### .test(state:Object, callback:Function)

Once you've defined all of your features and the criteria needed for each to be enabled, you'll **test** against an object describing the current state.


```javascript
let state = {
  environment: 'beta',
  role: 'tester',
  user: 'bbe6a53d-cee3-4562-af08-c892a4b3ca62'
};

secretBetaFeature.test(state, (err, { enabled, matches }) => {
  if (enabled) {
    console.log(`"Secret Beta Feature" is enabled because it matched ${matches.length} set(s) of criteria.`);
  }
});
```

The `state` provided will be matched against each set of criteria. If **any** of the sets of criteria match, the feature is enabled.

When the test is complete, `callback` is executed, unless it's omitted, in which case a `Boolean` is returned.

```javascript
secretBetaFeature.test(state) // ==> true
```

## License

(The MIT License)

Copyright (c) 2017 [John Flesch](http://fles.ch).

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
