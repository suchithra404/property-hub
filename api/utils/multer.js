import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only images allowed"), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 6 }, // allow max 6 files
  fileFilter,
});

// helper middlewares
export const uploadArray = (fieldName = "images", maxCount = 6) => upload.array(fieldName, maxCount);
export const uploadSingle = (fieldName = "image") => upload.single(fieldName);

export default upload;
