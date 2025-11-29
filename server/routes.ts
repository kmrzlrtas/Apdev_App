import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeMeal } from "./openai";
import { insertMealSchema, analyzeMealRequestSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // IMPORTANT: Define specific routes BEFORE parameterized routes
  
  // Analyze meal with AI (must be before /api/meals/:id)
  app.post("/api/meals/analyze", async (req, res) => {
    try {
      const parsed = analyzeMealRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid request", details: parsed.error.errors });
      }

      const analysis = await analyzeMeal(parsed.data.mealDescription, parsed.data.mealType);
      res.json(analysis);
    } catch (error) {
      console.error("Analyze meal error:", error);
      res.status(500).json({ error: "Failed to analyze meal" });
    }
  });

  // Get daily summary (must be before /api/meals/:id)
  app.get("/api/meals/summary", async (req, res) => {
    try {
      const { date } = req.query;
      const dateStr = typeof date === "string" ? date : new Date().toISOString().split("T")[0];
      const summary = await storage.getDailySummary(dateStr);
      res.json(summary);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch summary" });
    }
  });

  // Get weekly/monthly trends (must be before /api/meals/:id)
  app.get("/api/meals/trends", async (req, res) => {
    try {
      const { period } = req.query;
      const trends = await storage.getWeeklyTrends(typeof period === "string" ? period : undefined);
      res.json(trends);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch trends" });
    }
  });

  // Get meals with optional date filtering
  app.get("/api/meals", async (req, res) => {
    try {
      const { date, startDate, endDate } = req.query;
      const filters: { date?: string; startDate?: string; endDate?: string } = {};
      
      if (typeof date === "string") filters.date = date;
      if (typeof startDate === "string") filters.startDate = startDate;
      if (typeof endDate === "string") filters.endDate = endDate;
      
      const meals = await storage.getMeals(Object.keys(filters).length > 0 ? filters : undefined);
      res.json(meals);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch meals" });
    }
  });

  // Get single meal (parameterized route - must be AFTER specific routes)
  app.get("/api/meals/:id", async (req, res) => {
    try {
      const meal = await storage.getMeal(req.params.id);
      if (!meal) {
        return res.status(404).json({ error: "Meal not found" });
      }
      res.json(meal);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch meal" });
    }
  });

  // Create meal
  app.post("/api/meals", async (req, res) => {
    try {
      const parsed = insertMealSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid meal data", details: parsed.error.errors });
      }

      const meal = await storage.createMeal(parsed.data);
      res.status(201).json(meal);
    } catch (error) {
      console.error("Create meal error:", error);
      res.status(500).json({ error: "Failed to create meal" });
    }
  });

  // Delete meal
  app.delete("/api/meals/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteMeal(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Meal not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete meal" });
    }
  });

  // Get all recipes
  app.get("/api/recipes", async (req, res) => {
    try {
      const recipes = await storage.getRecipes();
      res.json(recipes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch recipes" });
    }
  });

  // Get single recipe
  app.get("/api/recipes/:id", async (req, res) => {
    try {
      const recipe = await storage.getRecipe(req.params.id);
      if (!recipe) {
        return res.status(404).json({ error: "Recipe not found" });
      }
      res.json(recipe);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch recipe" });
    }
  });

  // Get all health tips
  app.get("/api/tips", async (req, res) => {
    try {
      const tips = await storage.getHealthTips();
      res.json(tips);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tips" });
    }
  });

  // Get daily tip
  app.get("/api/tips/daily", async (req, res) => {
    try {
      const tip = await storage.getDailyTip();
      res.json(tip);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch daily tip" });
    }
  });

  return httpServer;
}
