const { uuid } = require("uuidv4");
const { predict } = require("../inference");
const { store_data, get_all_data } = require("../../config/firestore");
const { Timestamp } = require("@google-cloud/firestore");

const predictFunction = async (req, res, model) => {
  try {
    const image = req.file.buffer;
    const id = uuid();
    const predictions = await predict(model, image);

    const data = {
      id,
      result: predictions.label,
      suggestion: predictions.suggestion,
      createdAt: new Date(),
    };
    store_data(data);

    res.json({
      status: "success",
      message: "Model is predicted successfully",
      data,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "fail",
      message: "Terjadi kesalahan dalam melakukan prediksi",
    });
  }
};

const historyPredictFunction = async (req, res) => {
  try {
    const data = await get_all_data();

    res.json({
      status: "success",
      data: data?.map((e) => ({
        ...e,
        createdAt: new Timestamp(
          e.createdAt._seconds,
          e.createdAt._nanoseconds
        ).toDate(),
      })),
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "fail",
      message: "Terjadi kesalahan dalam melakukan mengambil data",
    });
  }
};

module.exports = {
  predictFunction,
  historyPredictFunction,
};
