import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage as pgStorage } from "./storage-pg";
import { storage } from "./storage";
import { analyzeMeal, generateHealthTip } from "./openai";
import { insertMealSchema, analyzeMealRequestSchema, insertChatMessageSchema, insertProfileSchema, insertUserSchema } from "@shared/schema";

// Use PostgreSQL if DATABASE_URL is set, otherwise use in-memory storage
const activeStorage = process.env.DATABASE_URL && pgStorage ? pgStorage : storage;

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // IMPORTANT: Define specific routes BEFORE parameterized routes

  // Auth endpoints
  app.post("/api/auth/register", async (req, res) => {
    try {
      const parsed = insertUserSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      const existingUser = await activeStorage.getUserByUsername(parsed.data.username);
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }

      const user = await activeStorage.createUser(parsed.data);
      
      // Create default profile
      await activeStorage.createProfile(user.id, {
        name: parsed.data.username,
        email: `${parsed.data.username}@nutritrack.ph`,
      });

      res.status(201).json(user);
    } catch (error) {
      console.error("Register error:", error);
      res.status(500).json({ error: "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
      }

      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      res.json(user);
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.get("/api/auth/session", async (req, res) => {
    try {
      // For demo purposes, check if user ID is passed
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      res.json(user);
    } catch (error) {
      console.error("Session check error:", error);
      res.status(401).json({ error: "Session check failed" });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    try {
      res.json({ message: "Logged out successfully" });
    } catch (error) {
      res.status(500).json({ error: "Logout failed" });
    }
  });

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

  // Chat endpoints
  app.get("/api/chat", async (req, res) => {
    try {
      const userId = req.query.userId as string || "demo-user";
      const messages = await storage.getChatMessages(userId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch chat messages" });
    }
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const userId = req.query.userId as string || "demo-user";
      const { content } = req.body;

      if (!content || typeof content !== "string") {
        return res.status(400).json({ error: "Content is required" });
      }

      // Save user message
      const userMessage = await storage.createChatMessage({
        userId,
        role: "user",
        content,
      });

      // Generate AI response using OpenAI
      const systemPrompt = `You are a friendly nutrition assistant specializing in Filipino cuisine. 
You help users track their meals, provide nutritional advice, suggest affordable recipes with local ingredients, 
and give personalized health tips aligned with SDG 3: Good Health and Well-Being. 
Keep responses concise and encouraging.`;

      try {
        const assistantResponse = await generateHealthTip(content);
        
        const assistantMessage = await storage.createChatMessage({
          userId,
          role: "assistant",
          content: assistantResponse,
        });

        res.status(201).json({
          userMessage,
          assistantMessage,
        });
      } catch (aiError) {
        console.error("AI response error:", aiError);
        // Fallback response
        const fallbackMessage = await storage.createChatMessage({
          userId,
          role: "assistant",
          content: "That's a great question! Try describing your meal or asking about specific recipes. I'm here to help you make nutritious choices with Filipino ingredients!",
        });

        res.status(201).json({
          userMessage,
          assistantMessage: fallbackMessage,
        });
      }
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ error: "Failed to process chat message" });
    }
  });

  // Profile endpoints
  app.get("/api/profile", async (req, res) => {
    try {
      const userId = req.query.userId as string || "demo-user";
      const profile = await storage.getProfile(userId);
      
      if (!profile) {
        // Create a default profile if it doesn't exist
        const defaultProfile = await storage.createProfile(userId, {
          name: "User",
          email: "user@example.com",
        });
        return res.json(defaultProfile);
      }

      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  app.patch("/api/profile", async (req, res) => {
    try {
      const userId = req.query.userId as string || "demo-user";
      const parsed = insertProfileSchema.partial().safeParse(req.body);

      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid profile data" });
      }

      let profile = await storage.getProfile(userId);
      
      if (!profile) {
        // Create profile if it doesn't exist
        profile = await storage.createProfile(userId, {
          name: parsed.data.name || "User",
          email: parsed.data.email || "user@example.com",
        });
      } else {
        // Update existing profile
        profile = await storage.updateProfile(userId, parsed.data);
      }

      res.json(profile);
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  });

  return httpServer;
}
