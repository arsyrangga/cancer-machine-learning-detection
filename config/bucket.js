const { Storage } = require("@google-cloud/storage");
const path = require("path");

const storage = new Storage({
    keyFilename: path.join(__dirname,'../' + process.env.keyFilename),
    projectId: process.env.projectId
});

const bucketName = process.env.bucketName;

async function download(fileName) {
  const options = {
    destination:  path.join(__dirname, "../model/" + fileName),
  };

  await storage
    .bucket(bucketName)
    .file("models/" + fileName)
    .download(options);
  console.log(fileName + " berhasil di load");
}

module.exports = {
  download,
};
