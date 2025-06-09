import { DeleteObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import s3 from "../s3-setup";

const deleteImageFromR2 = async (key: string) => {
  try {
    // Check first if the file exist
    // Will throw error if there is no file
    await s3.send(
      new HeadObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
      })
    );

    const command = new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
    });

    await s3.send(command);
  } catch (err: any) {
    if (err.name === "NotFound") {
      throw new Error(`Object with key "${key}" does not exist.`);
    } else {
      throw err;
    }
  }
};

export default deleteImageFromR2;
