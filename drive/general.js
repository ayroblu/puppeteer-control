const { openDrive, openDriveFolder } = require("./methods");
const inquirer = require("inquirer");

const confirmQuestion = {
  type: "confirm",
  message: "Deeper?",
  name: "toConfirm",
  default: true,
};
const confirmPageQuestion = {
  type: "confirm",
  message: "Do you want to open another tab?",
  name: "toConfirm",
  default: true,
};
async function openPages() {
  for (;;) {
    const drivePage = await openDrive();
    for (;;) {
      const { toConfirm } = await inquirer.prompt([confirmQuestion]);
      if (!toConfirm) {
        break;
      }
      await openDriveFolder(drivePage);
    }
    const { toConfirm } = await inquirer.prompt([confirmPageQuestion]);
    if (!toConfirm) {
      break;
    }
  }
}
module.exports = { openPages };
