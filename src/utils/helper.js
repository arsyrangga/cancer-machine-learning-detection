const fs = require("fs");
const path = require("path");

// Middleware to check if file exists
const checkFileExists = async (filepath) => {
  try {
    const fullPath = path.join(__dirname, filepath);
    await fs.promises.access(fullPath, fs.constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
};

module.exports = {
  checkFileExists,
};
