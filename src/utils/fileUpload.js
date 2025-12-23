import sharp from "sharp";
import fs from "fs";
import path from "path";

// Setup S3 client
// const s3 = new S3Client({
//   region: process.env.AWS_REGION || 'eu-north-1',
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });

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
    .toBuffer()

  const uploadTarget = process.env.UPLOAD_TARGET || process.env.NODE_ENV;
  if (uploadTarget === "s3" || uploadTarget === "production") {
    // --- Upload to S3 (production) ---
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${folder}/${filename}`,
      Body: buffer,
      ContentType: "image/jpeg",
    };

    // await s3.send(new PutObjectCommand(params));

    return `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
  } else {
    // --- Save locally (development) ---
    const localFolder = path.join("assets", "images", folder);
    fs.mkdirSync(localFolder, { recursive: true });

    const localPath = path.join(localFolder, filename);
    fs.writeFileSync(localPath, buffer);

    return `assets/images/${folder}/${filename}`;
  }
};
