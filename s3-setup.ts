import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_URL!,
  credentials: {
    accessKeyId: process.env.R2_ACCESSKEY!,
    secretAccessKey: process.env.R2_SECRETACCESSKEY!,
  },
});

export default s3;
