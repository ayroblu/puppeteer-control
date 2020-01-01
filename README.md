Puppeteer Control Experiment
============================

I want to get to the point where I can control my browser with a macro recorder like idea

Help developing
---------------
Utility function for async in nodejs cmdline
```javascript
var {openTvShow} = require('./drive')
var result = []
async function runCmd(func) {
  return _runCmd(func).catch(console.error);
}
async function _runCmd(func) {
  result.push(await func())
}
runCmd(() => openTvShow())
```
