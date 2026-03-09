import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { authGuard } from "../middleware/authGuard.js";

const router = Router();

const folderBodySchema = z.object({
  name: z.string().min(1).max(100),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .default("#808080"),
});

// GET /api/folders
router.get("/api/folders", authGuard, async (req, res, next) => {
  try {
    const folders = await prisma.folder.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: "asc" },
    });

    res.json(
      folders.map((f) => ({
        ...f,
        createdAt: f.createdAt.toISOString(),
      }))
    );
  } catch (err) {
    next(err);
  }
});

// POST /api/folders
router.post("/api/folders", authGuard, async (req, res, next) => {
  try {
    const body = folderBodySchema.parse(req.body);

    const folder = await prisma.folder.create({
      data: {
        userId: req.user!.id,
        name: body.name,
        color: body.color,
      },
    });

    res.status(201).json({
      ...folder,
      createdAt: folder.createdAt.toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/folders/:id
router.put("/api/folders/:id", authGuard, async (req, res, next) => {
  try {
    const body = folderBodySchema.parse(req.body);

    const existing = await prisma.folder.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
    });
    if (!existing) {
      res.status(404).json({ error: "Folder not found" });
      return;
    }

    const folder = await prisma.folder.update({
      where: { id: req.params.id },
      data: { name: body.name, color: body.color },
    });

    res.json({
      ...folder,
      createdAt: folder.createdAt.toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/folders/:id
router.delete("/api/folders/:id", authGuard, async (req, res, next) => {
  try {
    const existing = await prisma.folder.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
    });
    if (!existing) {
      res.status(404).json({ error: "Folder not found" });
      return;
    }

    await prisma.folder.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
