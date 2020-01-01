const puppeteer = require("puppeteer-core");

async function openDrive() {
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

    // For development
    devtools: true,
  });
  const page = await browser.newPage();
  await page.goto("https://drive.google.com");
  return page;
}
async function openTvShow() {
  const drivePage = await openDrive();
  await drivePage.waitForSelector("[role=gridcell]", { visible: true });
  const folders = await drivePage.$$("[role=gridcell]");
  const folderAndTexts = await Promise.all(
    folders.map(async folder => ({
      folder,
      text: await folder.evaluate(node => node.innerText),
    }))
  );
  await Promise.all(
    folderAndTexts
      .filter(({ text }) => text === "TV Shows")
      .map(({ folder }) => folder.click({ clickCount: 2 }))
  );
  await drivePage.waitForNavigation();
  await drivePage.waitForSelector("[role=gridcell]", { visible: true });
  {
    const folders = await drivePage.$$("[role=gridcell]");
    const folderAndTexts = await Promise.all(
      folders.map(async folder => ({
        folder,
        text: await folder.evaluate(node => node.innerText),
      }))
    );
    console.log(folderAndTexts.map(({ text }) => text));
  }
}
// Array.from(document.querySelectorAll('[role=gridcell]')).map(e => e.innerText)
openTvShow().catch(console.error);
