const { Firestore } = require("@google-cloud/firestore");
const path = require("path")

const db = new Firestore({
  keyFilename: path.join(__dirname, "../" + process.env.keyFilename),
  projectId: process.env.projectId,
});

async function store_data(data) {
  // Membuat Collection root-level
  const predictionsCollections = db.collection("predictions");

  const predictionDoc = await predictionsCollections.doc(data.id);
  const profileEros = {
    id: data.id,
    result: data.result,
    suggestion: data.suggestion,
    createdAt: data.createdAt,
  };
  await predictionDoc.set(profileEros);
}

async function get_all_data() {
  try {
    const predictionsCollections = db.collection("predictions");
    const snapshot = await predictionsCollections.get();

    const predictions = [];
    snapshot.forEach((doc) => {
      predictions.push(doc.data());
    });

    return predictions;
  } catch (error) {
    console.error("Error reading documents:", error);
    throw error;
  }
}

module.exports = {
  store_data,
  get_all_data,
};
