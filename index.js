var { openTvShow } = require("./drive");

async function run() {
  await openTvShow();
}
run().catch(console.error);
