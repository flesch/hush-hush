# 🙊 hush-hush

Feature flagging for when you need to keep that **Super Secret Beta Feature**™ *hush-hush*.

> ⚠️ This is a pre-release version!

Better documentation to follow soon, however here's a quick start example.

```
'use strict';

const hushush = require('hush-hush');

// Add a feature, with an array of objects that are the criteria
// for that feature to be enabled. Attributes of each criteria set are
// converted to regular expressions.
hushhush.feature('super-secret-beta-feature', [
  { environment:'production', user:'bbe6a53d-cee3-4562-af08-c892a4b3ca62' },
  { environment:'production', opted_in:true, role:'beta-testers' },
  { environment:'beta*' }
]);

// Define the current "state". Each set of criteria will be matched against
// this object. If they match, the feature is enabled.
let state = {
  environment:'production',
  user: 'bbe6a53d-cee3-4562-af08-c892a4b3ca62'
};

// Determine if a feature is enabled. If a callback is provided, this will
// execute asynchronously.
hushhush.toggle('super-secret-beta-feature', state, (err, enabled, feature) => {
  console.log(feature.id, enabled, JSON.stringify(feature, null, 2));
});

// Without a callback, a Boolean is returned.
console.log(hushhush.toggle('super-secret-beta-feature', state));

// Enable or disable a feature (disable turns it off without checking for
// a match).
hushhush.disable('super-secret-beta-feature');
hushhush.enable('super-secret-beta-feature');

// List features that are enabled.
console.log(hushhush.features.filter((feature) => {
  return hushhush.toggle(feature.id, state);
}));
```
