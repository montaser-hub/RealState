import sharp from "sharp";
import fs from "fs";
import path from "path";
import { uploadImageToB2 } from "./b2Upload.js";
import { config } from "../configs/env.js";

export const resizeAndSaveImage = async (file, options = {}) => {
  const {
    folder = 'users',
    prefix,
    width = 500,
    height = 500,
    quality = 90,
  } = options;

  if (!file) return null;

  const filename = `${prefix}-${Date.now()}.jpeg`;

  // Process and save image
  const buffer = await sharp(file.buffer)
    .resize(width, height)
    .toFormat("jpeg")
    .jpeg({ quality })
    .toBuffer();

  const uploadTarget = process.env.UPLOAD_TARGET || config.nodeEnv;
  
  if (uploadTarget === "b2" || uploadTarget === "production") {
    // Upload to Backblaze B2
    return await uploadImageToB2(buffer, folder, filename);
  } else {
    // Save locally (development)
    const localFolder = path.join("assets", "images", folder);
    fs.mkdirSync(localFolder, { recursive: true });

    const localPath = path.join(localFolder, filename);
    fs.writeFileSync(localPath, buffer);

    return `assets/images/${folder}/${filename}`;
  }
};
