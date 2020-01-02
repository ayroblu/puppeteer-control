const { openDrive, openDriveFolder } = require("./methods");

async function openPages() {
  let drivePage = await openDrive();
  await openDriveFolder(drivePage, "TV Shows");
  await openDriveFolder(drivePage, "Top Gear");

  drivePage = await openDrive();
  await openDriveFolder(drivePage, "TV Shows");
  await openDriveFolder(drivePage, "Billions");
}
openPages().catch(console.error);
