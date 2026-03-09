import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { authGuard } from "../middleware/authGuard.js";

const router = Router();

const ingredientSchema = z.object({
  name: z.string().min(1),
  quantity: z.string(),
  unit: z.string(),
});

const recipeBodySchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).default(""),
  instructions: z.string().max(5000).default(""),
  prepTime: z.number().int().min(0).default(0),
  cookTime: z.number().int().min(0).default(0),
  servings: z.number().int().min(1).default(1),
  folderId: z.string().nullable().default(null),
  imageUrl: z.string().nullable().default(null),
  ingredients: z.array(ingredientSchema).default([]),
  tags: z.array(z.string().min(1)).default([]),
});

function formatRecipe(recipe: any) {
  return {
    id: recipe.id,
    userId: recipe.userId,
    title: recipe.title,
    description: recipe.description,
    instructions: recipe.instructions,
    prepTime: recipe.prepTime,
    cookTime: recipe.cookTime,
    servings: recipe.servings,
    imageUrl: recipe.imageUrl,
    folderId: recipe.folderId,
    ingredients: recipe.ingredients,
    tags: recipe.recipeTags.map((rt: any) => ({
      id: rt.tag.id,
      name: rt.tag.name,
    })),
    createdAt: recipe.createdAt.toISOString(),
    updatedAt: recipe.updatedAt.toISOString(),
  };
}

const recipeInclude = {
  ingredients: true,
  recipeTags: { include: { tag: true } },
};

// GET /api/recipes
router.get("/api/recipes", authGuard, async (req, res, next) => {
  try {
    const { folderId, search } = req.query;

    const where: any = { userId: req.user!.id };
    if (folderId && typeof folderId === "string") {
      where.folderId = folderId;
    }
    if (search && typeof search === "string") {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        {
          recipeTags: {
            some: {
              tag: { name: { contains: search, mode: "insensitive" } },
            },
          },
        },
      ];
    }

    const recipes = await prisma.recipe.findMany({
      where,
      include: recipeInclude,
      orderBy: { createdAt: "desc" },
    });

    res.json(recipes.map(formatRecipe));
  } catch (err) {
    next(err);
  }
});

// GET /api/recipes/:id
router.get("/api/recipes/:id", authGuard, async (req, res, next) => {
  try {
    const recipe = await prisma.recipe.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
      include: recipeInclude,
    });

    if (!recipe) {
      res.status(404).json({ error: "Recipe not found" });
      return;
    }

    res.json(formatRecipe(recipe));
  } catch (err) {
    next(err);
  }
});

// POST /api/recipes
router.post("/api/recipes", authGuard, async (req, res, next) => {
  try {
    const body = recipeBodySchema.parse(req.body);

    // Upsert tags
    const tagRecords = await Promise.all(
      body.tags.map((name) =>
        prisma.tag.upsert({
          where: { name },
          create: { name },
          update: {},
        })
      )
    );

    const recipe = await prisma.recipe.create({
      data: {
        userId: req.user!.id,
        title: body.title,
        description: body.description,
        instructions: body.instructions,
        prepTime: body.prepTime,
        cookTime: body.cookTime,
        servings: body.servings,
        imageUrl: body.imageUrl,
        folderId: body.folderId,
        ingredients: {
          create: body.ingredients.map((i) => ({
            name: i.name,
            quantity: i.quantity,
            unit: i.unit,
          })),
        },
        recipeTags: {
          create: tagRecords.map((t) => ({ tagId: t.id })),
        },
      },
      include: recipeInclude,
    });

    res.status(201).json(formatRecipe(recipe));
  } catch (err) {
    next(err);
  }
});

// PUT /api/recipes/:id
router.put("/api/recipes/:id", authGuard, async (req, res, next) => {
  try {
    const body = recipeBodySchema.parse(req.body);
    const id = req.params.id;

    const recipe = await prisma.$transaction(async (tx) => {
      const existing = await tx.recipe.findFirst({
        where: { id, userId: req.user!.id },
      });
      if (!existing) return null;

      // Delete old ingredients and tags
      await tx.ingredient.deleteMany({ where: { recipeId: id } });
      await tx.recipeTag.deleteMany({ where: { recipeId: id } });

      // Upsert tags
      const tagRecords = await Promise.all(
        body.tags.map((name) =>
          tx.tag.upsert({
            where: { name },
            create: { name },
            update: {},
          })
        )
      );

      return tx.recipe.update({
        where: { id },
        data: {
          title: body.title,
          description: body.description,
          instructions: body.instructions,
          prepTime: body.prepTime,
          cookTime: body.cookTime,
          servings: body.servings,
          imageUrl: body.imageUrl,
          folderId: body.folderId,
          ingredients: {
            create: body.ingredients.map((i) => ({
              name: i.name,
              quantity: i.quantity,
              unit: i.unit,
            })),
          },
          recipeTags: {
            create: tagRecords.map((t) => ({ tagId: t.id })),
          },
        },
        include: recipeInclude,
      });
    });

    if (!recipe) {
      res.status(404).json({ error: "Recipe not found" });
      return;
    }

    res.json(formatRecipe(recipe));
  } catch (err) {
    next(err);
  }
});

// DELETE /api/recipes/:id
router.delete("/api/recipes/:id", authGuard, async (req, res, next) => {
  try {
    const existing = await prisma.recipe.findFirst({
      where: { id: req.params.id, userId: req.user!.id },
    });

    if (!existing) {
      res.status(404).json({ error: "Recipe not found" });
      return;
    }

    await prisma.recipe.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
