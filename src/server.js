const express = require("express");
const cors = require("cors");
const { upload, handleUploadError } = require("../config/multer");
const { loadModel } = require("./inference");
const { predictFunction, historyPredictFunction } = require("./controller/predictController");

const app = express();

(async () => {
  const model = await loadModel();

  // Middleware
  app.use(cors());
  app.use(express.json());

  const apiRouter = express.Router();

  apiRouter.post(
    "/predict",
    (req, res, next) => {
      upload.single("image")(req, res, (err) => {
        handleUploadError(err, req, res, next);
      });
    },
    (req, res) => predictFunction(req, res, model)
  );

  apiRouter.get(
    "/predict/histories",
    historyPredictFunction
  );

  app.use("/", apiRouter);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})();
