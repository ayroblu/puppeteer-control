const puppeteer = require("puppeteer-core");

(async () => {
  // chrome://version/ - executablePath
  const browser = await puppeteer.launch({
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    userDataDir: "./userDataDir",
    // userDataDir: "/Users/blu/Library/Application Support/Google/Chrome",

    // This disables the session restore thing
    // https://raspberrypi.stackexchange.com/questions/68734/how-do-i-disable-restore-pages-chromium-didnt-shut-down-correctly-prompt
    args: ["--app=http://example.com"],

    // Makes chrome behave as you'd expect in viewports
    // https://github.com/puppeteer/puppeteer/issues/3688
    defaultViewport: null,
    headless: false,
  });
  const page = await browser.newPage();
  await page.goto("https://drive.google.com");
  // await page.screenshot({path: 'example.png'});

  // await browser.close();
})().catch(console.error);
