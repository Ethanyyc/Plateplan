import "dotenv/config";
import { prisma } from "../src/lib/prisma.js";
import { auth } from "../src/lib/auth.js";

async function main() {
  console.log("Seeding database...");

  // Clean existing data in reverse dependency order
  await prisma.mealPlanEntry.deleteMany();
  await prisma.mealPlan.deleteMany();
  await prisma.recipeTag.deleteMany();
  await prisma.ingredient.deleteMany();
  await prisma.recipe.deleteMany();
  await prisma.folder.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  console.log("Cleared existing data.");

  // Create seed user via Better Auth
  const signUpResult = await auth.api.signUpEmail({
    body: {
      email: "test@example.com",
      password: "password123",
      name: "Test User",
    },
  });
  const userId = signUpResult.user.id;
  console.log(`Created user: ${userId}`);

  // Create folders
  const [breakfast, lunch, dinner, dessert, quickMeals, mealPrep] =
    await Promise.all([
      prisma.folder.create({
        data: { userId, name: "Breakfast", color: "#FF6B6B" },
      }),
      prisma.folder.create({
        data: { userId, name: "Lunch", color: "#4ECDC4" },
      }),
      prisma.folder.create({
        data: { userId, name: "Dinner", color: "#45B7D1" },
      }),
      prisma.folder.create({
        data: { userId, name: "Dessert", color: "#F7DC6F" },
      }),
      prisma.folder.create({
        data: { userId, name: "Quick Meals", color: "#82E0AA" },
      }),
      prisma.folder.create({
        data: { userId, name: "Meal Prep", color: "#BB8FCE" },
      }),
    ]);
  console.log("Created 6 folders.");

  // Create tags
  const tagNames = [
    "Italian",
    "Pasta",
    "Vegetarian",
    "Breakfast",
    "Asian",
    "Quick",
    "Dessert",
    "Baking",
    "Salad",
    "Meal Prep",
  ];
  const tags: Record<string, { id: string }> = {};
  for (const name of tagNames) {
    tags[name] = await prisma.tag.create({ data: { name } });
  }
  console.log(`Created ${tagNames.length} tags.`);

  // Create recipes
  const spaghettiCarbonara = await prisma.recipe.create({
    data: {
      userId,
      title: "Spaghetti Carbonara",
      description:
        "Classic Italian pasta with eggs, cheese, pancetta, and black pepper.",
      instructions:
        "1. Cook pasta al dente.\n2. Fry pancetta until crispy.\n3. Mix eggs and cheese.\n4. Combine pasta, pancetta, egg mixture off heat.\n5. Season and serve.",
      prepTime: 10,
      cookTime: 20,
      servings: 4,
      imageUrl:
        "https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=800&auto=format&fit=crop",
      folderId: dinner.id,
      ingredients: {
        create: [
          { name: "Spaghetti", quantity: "400", unit: "g" },
          { name: "Pancetta", quantity: "150", unit: "g" },
          { name: "Eggs", quantity: "3", unit: "whole" },
          { name: "Parmesan", quantity: "100", unit: "g" },
          { name: "Black pepper", quantity: "1", unit: "tsp" },
        ],
      },
      recipeTags: {
        create: [
          { tagId: tags["Italian"].id },
          { tagId: tags["Pasta"].id },
        ],
      },
    },
  });

  const avocadoToast = await prisma.recipe.create({
    data: {
      userId,
      title: "Avocado Toast",
      description:
        "Creamy avocado on toasted sourdough with poached eggs.",
      instructions:
        "1. Toast bread.\n2. Mash avocado with lemon, salt.\n3. Spread on toast.\n4. Top with poached eggs.\n5. Season with chilli flakes.",
      prepTime: 5,
      cookTime: 10,
      servings: 2,
      imageUrl:
        "https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=800&auto=format&fit=crop",
      folderId: breakfast.id,
      ingredients: {
        create: [
          { name: "Sourdough bread", quantity: "2", unit: "slices" },
          { name: "Avocado", quantity: "1", unit: "whole" },
          { name: "Eggs", quantity: "2", unit: "whole" },
          { name: "Lemon juice", quantity: "1", unit: "tbsp" },
        ],
      },
      recipeTags: {
        create: [
          { tagId: tags["Vegetarian"].id },
          { tagId: tags["Breakfast"].id },
        ],
      },
    },
  });

  const chickenStirFry = await prisma.recipe.create({
    data: {
      userId,
      title: "Chicken Stir Fry",
      description:
        "Quick and healthy chicken and vegetable stir fry with soy-ginger sauce.",
      instructions:
        "1. Marinate chicken in soy, ginger, garlic.\n2. Stir fry chicken until golden.\n3. Add vegetables.\n4. Add sauce and toss.\n5. Serve over rice.",
      prepTime: 15,
      cookTime: 15,
      servings: 3,
      imageUrl:
        "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&auto=format&fit=crop",
      folderId: quickMeals.id,
      ingredients: {
        create: [
          { name: "Chicken breast", quantity: "500", unit: "g" },
          { name: "Bell peppers", quantity: "2", unit: "whole" },
          { name: "Soy sauce", quantity: "3", unit: "tbsp" },
          { name: "Ginger", quantity: "1", unit: "tsp" },
        ],
      },
      recipeTags: {
        create: [
          { tagId: tags["Asian"].id },
          { tagId: tags["Quick"].id },
        ],
      },
    },
  });

  const chocolateLavaCake = await prisma.recipe.create({
    data: {
      userId,
      title: "Chocolate Lava Cake",
      description:
        "Indulgent warm chocolate cake with a molten centre.",
      instructions:
        "1. Melt chocolate and butter.\n2. Mix eggs and sugar.\n3. Combine and fold in flour.\n4. Bake at 200\u00B0C for 12 min.\n5. Unmould and serve immediately.",
      prepTime: 15,
      cookTime: 12,
      servings: 4,
      imageUrl:
        "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800&auto=format&fit=crop",
      folderId: dessert.id,
      ingredients: {
        create: [
          { name: "Dark chocolate", quantity: "200", unit: "g" },
          { name: "Butter", quantity: "100", unit: "g" },
          { name: "Eggs", quantity: "4", unit: "whole" },
          { name: "Sugar", quantity: "80", unit: "g" },
          { name: "Flour", quantity: "50", unit: "g" },
        ],
      },
      recipeTags: {
        create: [
          { tagId: tags["Dessert"].id },
          { tagId: tags["Baking"].id },
        ],
      },
    },
  });

  const greekSalad = await prisma.recipe.create({
    data: {
      userId,
      title: "Greek Salad",
      description:
        "Fresh Mediterranean salad with tomatoes, cucumber, olives, and feta.",
      instructions:
        "1. Chop tomatoes, cucumber, and onion.\n2. Add olives and feta.\n3. Drizzle with olive oil and lemon.\n4. Season and toss gently.",
      prepTime: 10,
      cookTime: 0,
      servings: 2,
      imageUrl:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop",
      folderId: lunch.id,
      ingredients: {
        create: [
          { name: "Tomatoes", quantity: "3", unit: "whole" },
          { name: "Cucumber", quantity: "1", unit: "whole" },
          { name: "Feta cheese", quantity: "100", unit: "g" },
          { name: "Kalamata olives", quantity: "50", unit: "g" },
        ],
      },
      recipeTags: {
        create: [
          { tagId: tags["Vegetarian"].id },
          { tagId: tags["Salad"].id },
        ],
      },
    },
  });

  const overnightOats = await prisma.recipe.create({
    data: {
      userId,
      title: "Overnight Oats",
      description:
        "Healthy, no-cook prep-ahead breakfast with oats, milk, and berries.",
      instructions:
        "1. Mix oats with milk and yoghurt.\n2. Add honey and vanilla.\n3. Refrigerate overnight.\n4. Top with fresh berries to serve.",
      prepTime: 5,
      cookTime: 0,
      servings: 1,
      imageUrl:
        "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=800&auto=format&fit=crop",
      folderId: mealPrep.id,
      ingredients: {
        create: [
          { name: "Rolled oats", quantity: "80", unit: "g" },
          { name: "Milk", quantity: "200", unit: "ml" },
          { name: "Greek yoghurt", quantity: "50", unit: "g" },
          { name: "Mixed berries", quantity: "100", unit: "g" },
        ],
      },
      recipeTags: {
        create: [
          { tagId: tags["Vegetarian"].id },
          { tagId: tags["Meal Prep"].id },
        ],
      },
    },
  });

  console.log("Created 6 recipes with ingredients and tags.");

  // Create meal plan for week of 2026-03-02 (Monday)
  const mealPlan = await prisma.mealPlan.create({
    data: {
      userId,
      weekStartDate: new Date("2026-03-02T00:00:00Z"),
      entries: {
        create: [
          {
            recipeId: avocadoToast.id,
            dayOfWeek: "MONDAY",
            mealType: "BREAKFAST",
          },
          {
            recipeId: greekSalad.id,
            dayOfWeek: "MONDAY",
            mealType: "LUNCH",
          },
          {
            recipeId: spaghettiCarbonara.id,
            dayOfWeek: "TUESDAY",
            mealType: "DINNER",
          },
          {
            recipeId: chickenStirFry.id,
            dayOfWeek: "WEDNESDAY",
            mealType: "DINNER",
          },
          {
            recipeId: overnightOats.id,
            dayOfWeek: "THURSDAY",
            mealType: "BREAKFAST",
          },
          {
            recipeId: chocolateLavaCake.id,
            dayOfWeek: "FRIDAY",
            mealType: "DINNER",
          },
        ],
      },
    },
  });

  console.log(
    `Created meal plan (${mealPlan.id}) with 6 entries for week of 2026-03-02.`
  );
  console.log("Seed complete!");
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
