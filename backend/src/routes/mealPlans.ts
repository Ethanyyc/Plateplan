import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { authGuard } from "../middleware/authGuard.js";

const router = Router();

const recipeInclude = {
  ingredients: true,
  recipeTags: { include: { tag: true } },
};

function formatRecipeInEntry(recipe: any) {
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

function formatMealPlan(mealPlan: any) {
  const weekDate =
    mealPlan.weekStartDate instanceof Date
      ? mealPlan.weekStartDate.toISOString().split("T")[0]
      : String(mealPlan.weekStartDate);

  return {
    id: mealPlan.id,
    userId: mealPlan.userId,
    weekStartDate: weekDate,
    entries: (mealPlan.entries || []).map((entry: any) => ({
      id: entry.id,
      mealPlanId: entry.mealPlanId,
      recipeId: entry.recipeId,
      recipe: formatRecipeInEntry(entry.recipe),
      dayOfWeek: entry.dayOfWeek,
      mealType: entry.mealType,
    })),
  };
}

function getMonday(dateStr?: string): Date {
  let d: Date;
  if (dateStr) {
    // Parse as UTC to avoid timezone issues with date-only strings
    d = new Date(dateStr + "T00:00:00Z");
  } else {
    d = new Date();
  }
  const day = d.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setUTCDate(d.getUTCDate() + diff);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

const entryInclude = {
  recipe: {
    include: recipeInclude,
  },
};

// GET /api/meal-plans
router.get("/api/meal-plans", authGuard, async (req, res, next) => {
  try {
    const weekStartDate = getMonday(req.query.week as string | undefined);

    const mealPlan = await prisma.mealPlan.upsert({
      where: {
        userId_weekStartDate: {
          userId: req.user!.id,
          weekStartDate,
        },
      },
      create: {
        userId: req.user!.id,
        weekStartDate,
      },
      update: {},
      include: {
        entries: {
          include: entryInclude,
        },
      },
    });

    res.json(formatMealPlan(mealPlan));
  } catch (err) {
    next(err);
  }
});

// POST /api/meal-plans/:id/entries
const createEntrySchema = z.object({
  recipeId: z.string().min(1),
  dayOfWeek: z.enum([
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ]),
  mealType: z.enum(["BREAKFAST", "LUNCH", "DINNER"]),
});

router.post(
  "/api/meal-plans/:id/entries",
  authGuard,
  async (req, res, next) => {
    try {
      const body = createEntrySchema.parse(req.body);

      // Verify meal plan belongs to user
      const mealPlan = await prisma.mealPlan.findFirst({
        where: { id: req.params.id, userId: req.user!.id },
      });
      if (!mealPlan) {
        res.status(404).json({ error: "Meal plan not found" });
        return;
      }

      const entry = await prisma.mealPlanEntry.create({
        data: {
          mealPlanId: req.params.id,
          recipeId: body.recipeId,
          dayOfWeek: body.dayOfWeek,
          mealType: body.mealType,
        },
        include: entryInclude,
      });

      res.status(201).json({
        id: entry.id,
        mealPlanId: entry.mealPlanId,
        recipeId: entry.recipeId,
        recipe: formatRecipeInEntry(entry.recipe),
        dayOfWeek: entry.dayOfWeek,
        mealType: entry.mealType,
      });
    } catch (err) {
      next(err);
    }
  }
);

// PATCH /api/meal-plans/:id/entries/:entryId
const patchEntrySchema = z.object({
  dayOfWeek: z
    .enum([
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
      "SUNDAY",
    ])
    .optional(),
  mealType: z.enum(["BREAKFAST", "LUNCH", "DINNER"]).optional(),
});

router.patch(
  "/api/meal-plans/:id/entries/:entryId",
  authGuard,
  async (req, res, next) => {
    try {
      const body = patchEntrySchema.parse(req.body);

      // Verify ownership
      const mealPlan = await prisma.mealPlan.findFirst({
        where: { id: req.params.id, userId: req.user!.id },
      });
      if (!mealPlan) {
        res.status(404).json({ error: "Meal plan not found" });
        return;
      }

      const entry = await prisma.mealPlanEntry.update({
        where: { id: req.params.entryId },
        data: {
          ...(body.dayOfWeek !== undefined && { dayOfWeek: body.dayOfWeek }),
          ...(body.mealType !== undefined && { mealType: body.mealType }),
        },
        include: entryInclude,
      });

      res.json({
        id: entry.id,
        mealPlanId: entry.mealPlanId,
        recipeId: entry.recipeId,
        recipe: formatRecipeInEntry(entry.recipe),
        dayOfWeek: entry.dayOfWeek,
        mealType: entry.mealType,
      });
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/meal-plans/:id/entries/:entryId
router.delete(
  "/api/meal-plans/:id/entries/:entryId",
  authGuard,
  async (req, res, next) => {
    try {
      // Verify ownership
      const mealPlan = await prisma.mealPlan.findFirst({
        where: { id: req.params.id, userId: req.user!.id },
      });
      if (!mealPlan) {
        res.status(404).json({ error: "Meal plan not found" });
        return;
      }

      await prisma.mealPlanEntry.delete({
        where: { id: req.params.entryId },
      });

      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
