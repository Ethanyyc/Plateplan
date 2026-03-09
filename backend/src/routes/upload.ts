import { Router } from "express";
import multer from "multer";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { s3, BUCKET } from "../lib/s3.js";
import { authGuard } from "../middleware/authGuard.js";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// POST /api/upload/recipe-image
router.post(
  "/api/upload/recipe-image",
  authGuard,
  upload.single("image"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        res.status(400).json({ error: "No image file provided" });
        return;
      }

      const ext = path.extname(req.file.originalname).toLowerCase();
      const key = `recipe-images/${uuidv4()}${ext}`;

      await s3.send(
        new PutObjectCommand({
          Bucket: BUCKET,
          Key: key,
          Body: req.file.buffer,
          ContentType: req.file.mimetype,
          ACL: "public-read",
        })
      );

      const region = process.env.DO_SPACES_REGION || "tor1";
      const url = `https://${BUCKET}.${region}.digitaloceanspaces.com/${key}`;

      res.json({ url });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
