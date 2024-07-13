import multer from "multer";
import { v4 as uuid } from "uuid";
import ApiError from "./errorClass.utils.js";
const fileUpload = (fieldName) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
      cb(null, uuid() + "-" + file.originalname);
    },
  });

  function fileFilter(req, file, cb) {
    console.log(file);

    if (file.mimetype == "application/pdf") {
      cb(null, true);
    } else {
      cb(new ApiError("Pdf only allowed", 404), false);
    }
  }
  const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 },
  });

  return upload.single(fieldName);
};

export default fileUpload;
