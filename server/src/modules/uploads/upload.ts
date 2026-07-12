import fs from "node:fs";
import path from "node:path";
import multer from "multer";
import { env } from "../../config/env.js";

const absoluteUploadDirectory = path.resolve(process.cwd(), env.UPLOAD_DIR);

fs.mkdirSync(absoluteUploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (_request, _file, callback) => {
    callback(null, absoluteUploadDirectory);
  },
  filename: (_request, file, callback) => {
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/\s+/g, "-");
    callback(null, `${timestamp}-${safeName}`);
  }
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

export function toPublicUploadPath(filename: string) {
  return `/uploads/${filename}`;
}
