import { z } from "zod";

// Meal entry schema
export const mealSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]),
  date: z.string(),
  time: z.string(),
  calories: z.number(),
  protein: z.number(),
  carbs: z.number(),
  fats: z.number(),
  fiber: z.number().optional(),
  sodium: z.number().optional(),
  imageUrl: z.string().optional(),
});

export const insertMealSchema = mealSchema.omit({ id: true });

export type Meal = z.infer<typeof mealSchema>;
export type InsertMeal = z.infer<typeof insertMealSchema>;

// Recipe schema
export const recipeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  ingredients: z.array(z.string()),
  instructions: z.array(z.string()),
  prepTime: z.number(),
  cookTime: z.number(),
  servings: z.number(),
  calories: z.number(),
  protein: z.number(),
  carbs: z.number(),
  fats: z.number(),
  costEstimate: z.string(),
  isBudgetFriendly: z.boolean(),
  imageUrl: z.string().optional(),
  tags: z.array(z.string()),
});

export const insertRecipeSchema = recipeSchema.omit({ id: true });

export type Recipe = z.infer<typeof recipeSchema>;
export type InsertRecipe = z.infer<typeof insertRecipeSchema>;

// Health tip schema
export const healthTipSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  category: z.enum(["nutrition", "wellness", "fitness", "mindfulness"]),
  icon: z.string(),
});

export type HealthTip = z.infer<typeof healthTipSchema>;

// Daily nutrition summary
export const dailySummarySchema = z.object({
  date: z.string(),
  totalCalories: z.number(),
  totalProtein: z.number(),
  totalCarbs: z.number(),
  totalFats: z.number(),
  mealCount: z.number(),
});

export type DailySummary = z.infer<typeof dailySummarySchema>;

// AI meal analysis request/response
export const analyzeMealRequestSchema = z.object({
  mealDescription: z.string(),
  mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]),
});

export type AnalyzeMealRequest = z.infer<typeof analyzeMealRequestSchema>;

export const analyzeMealResponseSchema = z.object({
  name: z.string(),
  description: z.string(),
  calories: z.number(),
  protein: z.number(),
  carbs: z.number(),
  fats: z.number(),
  fiber: z.number().optional(),
  sodium: z.number().optional(),
  healthInsight: z.string(),
});

export type AnalyzeMealResponse = z.infer<typeof analyzeMealResponseSchema>;

// User schema (keeping existing)
export const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  password: z.string(),
});

export const insertUserSchema = userSchema.omit({ id: true });

export type User = z.infer<typeof userSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;

// Weekly trend data
export const weeklyTrendSchema = z.object({
  date: z.string(),
  calories: z.number(),
  protein: z.number(),
  carbs: z.number(),
  fats: z.number(),
});

export type WeeklyTrend = z.infer<typeof weeklyTrendSchema>;
