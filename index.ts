import express from "express";
import upload from "./multer-middleware";
import dotenv from "dotenv";
import uploadImageToR2 from "./utils/uploadImageToR2";
import deleteImageFromR2 from "./utils/deleteImageFromR2";

dotenv.config();

const app = express();
app.use(express.json());

// CONTROLLER
async function uploadImageToCloudFlare(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    if (!req.file) throw new Error("There is no file to upload");

    const imageUrl = await uploadImageToR2(req.file, "profile");

    res.send({ message: "Upload success", image_url: imageUrl });
  } catch (error) {
    console.log("Upload error : ", error);
    res.status(500).json(error);
  }
}

async function deleteImageFromCloudFlare(
  req: express.Request,
  res: express.Response
) {
  try {
    const { key } = req.body;

    if (!key) {
      res.status(400).json({ error: "Missing key" });
    }

    const finalKey = key.replace(process.env.R2_PUBLIC_URL + "/", "");

    await deleteImageFromR2(finalKey);

    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(400).json({ error: "Failed to delete image" });
  }
}

// ROUTERS
app.get("/", (req, res) => {
  res.json({ message: "Hello world" });
});

app.post("/image", upload.single("image"), uploadImageToCloudFlare);

app.delete("/image", deleteImageFromCloudFlare);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server run at http://localhost:${port}`);
});
