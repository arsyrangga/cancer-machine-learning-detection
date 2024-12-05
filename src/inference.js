const tfjs = require("@tensorflow/tfjs-node");
const { download } = require("../config/bucket");
const { checkFileExists } = require("./utils/helper");

const listModel = [
  process.env.model1,
  process.env.model2,
  process.env.model3,
  process.env.model4,
  process.env.model,
];

async function checkAndDownloadFiles() {
  const downloadPromises = listModel.map(async (filename) => {
    const filePath = `../../model/${filename}`;

    const exists = await checkFileExists(filePath);
  

    if (!exists) {
      await download(filename);
    }
    return Promise.resolve();
  });

  // Wait for all downloads to complete
  await Promise.all(downloadPromises);
}

async function loadModel() {
  await checkAndDownloadFiles();
  const modelUrl = "file://model/" + process.env.model;
  return tfjs.loadGraphModel(modelUrl);
}

async function predict(model, image) {
  try {
    const tensor = tfjs.node
      .decodeJpeg(image)
      .resizeNearestNeighbor([224, 224])
      .expandDims()
      .toFloat();

    const prediction = model.predict(tensor);
    const score = await prediction.data();
    const confidenceScore = Math.max(...score) * 100;

    const label = confidenceScore >= 0.5 ? "Cancer" : "Non-cancer";

    const suggestion =
      label === "Cancer"
        ? "Segera periksa ke dokter!"
        : "Penyakit kanker tidak terdeteksi.";

    return { label, suggestion };
  } catch (error) {
    throw error;
  }
}

module.exports = { loadModel, predict };
