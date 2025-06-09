import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../s3-setup";

const uploadImageToR2 = async (file: Express.Multer.File, type: string) => {
  try {
    // Your bucket name
    const bucketName = process.env.R2_BUCKET_NAME;

    if (!bucketName || !process.env.R2_PUBLIC_URL) {
      throw new Error("Missing R2 configuration");
    }

    /*
        fileKey has to be unique. 
        To prevent conflict for files that has the same name, 
        we will append a timestamp before the original name
    */
    const fileKey = `${type}/${Date.now()}_${file.originalname}`;

    /*
        Here, we will use workers to display the image.
        We will have to manually create the imageUrl by appending the 
        cloudflare worker link that we use as proxy.
    */
    const imageUrl = `${process.env.R2_PUBLIC_URL}/${fileKey}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await s3.send(command);

    return imageUrl;
  } catch (error) {
    throw error;
  }
};

export default uploadImageToR2;
