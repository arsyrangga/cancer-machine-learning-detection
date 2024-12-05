const multer = require("multer");

const multerConfig = {
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1000000, // 1MB
  },
  fileFilter: (req, file, callback) => {
    const allowedMimeTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(
        new Error("Invalid file type. Only image files are allowed."),
        false
      );
    }
  },
};

const upload = multer(multerConfig);

const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        status: "Fail",
        message:
          "Payload content length greater than maximum allowed: 1000000",
      });
    }
  }
  next();
};


module.exports = { upload, handleUploadError };
