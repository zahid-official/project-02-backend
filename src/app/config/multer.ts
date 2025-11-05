import fs from "fs";
import path from "path";
import multer from "multer";

const uploadPath = path.join(process.cwd(), "uploads");

// if uploads folder not exist then create it
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const multerUploader = multer({ storage });
export default multerUploader;
