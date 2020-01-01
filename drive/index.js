const puppeteer = require("puppeteer-core");
const { autocompleteQuestion } = require("./prompt");
const { isElementVisible } = require("../utils");

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
async function waitForVisibleSelector(page) {
  await page.waitForNavigation();
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
async function openDriveFolder(drivePage) {
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
  const tvShow = await autocompleteQuestion({
    message: "Select the folder you want to open:",
    items: folderAndTexts.map(({ text }) => text),
  });
  await Promise.all(
    folderAndTexts
      .filter(({ text }) => text === tvShow)
      .map(({ folder }) => folder.click({ clickCount: 2 }))
  );
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
  await waitForVisibleSelector(drivePage);
  {
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
    const tvShow = await autocompleteQuestion({
      message: "Select the folder you want to open:",
      items: folderAndTexts.map(({ text }) => text),
    });
    await Promise.all(
      folderAndTexts
        .filter(({ text }) => text === tvShow)
        .map(({ folder }) => folder.click({ clickCount: 2 }))
    );
  }
  return drivePage;
}
// openTvShow().catch(console.error);

module.exports = {
  openTvShow,
};
