Puppeteer Control Experiment
============================

I want to get to the point where I can control my browser with a macro recorder like idea

At this point, just script files that perform predefined scripts

Help developing
---------------
Utility function for async in nodejs cmdline

```javascript
// var {openSomething} = require('./something')
var result = []
async function runCmd(func) {
  return _runCmd(func).catch(console.error);
}
async function _runCmd(func) {
  result.push(await func())
}
// Example
//runCmd(() => openSomething())
```
