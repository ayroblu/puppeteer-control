const puppeteer = require("puppeteer-core");
const { autocompleteQuestion } = require("./prompt");
const { isElementVisible } = require("../utils");

module.exports = { openDrive, openDriveFolder };
let browser = null;

async function openDrive() {
  // chrome://version/ - executablePath
  if (!browser) {
    browser = await puppeteer.launch({
      executablePath:
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      userDataDir: "./userDataDir",

      // This disables the session restore thing
      // https://raspberrypi.stackexchange.com/questions/68734/how-do-i-disable-restore-pages-chromium-didnt-shut-down-correctly-prompt
      // args: ["--app=http://example.com"],

      // If you want to change profiles
      //args: ["--profile-directory=Default"],

      // These stop chrome exiting when script exit if you want
      // https://github.com/puppeteer/puppeteer/issues/4061
      handleNodeExit: [0, 2], // chrome exits when process.exit(0) or process.exit(2)
      handleSIGINT: false,
      handleSIGTERM: false,
      handleSIGHUP: false,

      // Makes chrome behave as you'd expect in viewports
      // https://github.com/puppeteer/puppeteer/issues/3688
      defaultViewport: null,
      headless: false,

      // For development
      //devtools: true,
    });
  }
  const page = await browser.newPage();
  await page.goto("https://drive.google.com");
  return page;
}

async function openDriveFolder(drivePage, desiredFolderName) {
  await waitForVisibleSelector(drivePage);
  const folders = (
    await Promise.all(
      Array.from(await drivePage.$$("[role=gridcell]")).map(async cell => ({
        cell,
        visible: await isElementVisible(cell),
      }))
    )
  )
    .filter(({ visible }) => visible)
    .map(({ cell }) => cell);
  const folderAndTexts = await Promise.all(
    folders.map(async folder => ({
      folder,
      text: await folder.evaluate(node => node.innerText),
    }))
  );
  const folderName =
    !desiredFolderName ||
    folderAndTexts.filter(({ text }) => text === desiredFolderName).length === 0
      ? await autocompleteQuestion({
          message: "Select the folder you want to open:",
          items: folderAndTexts.map(({ text }) => text),
        })
      : desiredFolderName;
  await Promise.all(
    folderAndTexts
      .filter(({ text }) => text === folderName)
      .map(({ folder }) => folder.click({ clickCount: 2 }))
  );
  await drivePage.waitForNavigation();
}

async function waitForVisibleSelector(page) {
  await page.waitForFunction(() => {
    function isElementVisible(element) {
      return !!(
        element &&
        (element.offsetWidth ||
          element.offsetHeight ||
          element.getClientRects().length)
      );
    }
    return (
      Array.from(document.querySelectorAll("[role=gridcell]")).filter(
        isElementVisible
      ).length > 0
    );
  });
}
