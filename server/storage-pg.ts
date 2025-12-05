import {
  type Meal,
  type InsertMeal,
  type Recipe,
  type HealthTip,
  type DailySummary,
  type WeeklyTrend,
  type User,
  type InsertUser,
  type Profile,
  type InsertProfile,
  type ChatMessage,
  type InsertChatMessage,
} from "@shared/schema";
import { pool } from "./db";
import { randomUUID } from "crypto";

export interface IStorage {
  getMeals(filters?: { date?: string; startDate?: string; endDate?: string; userId?: string }): Promise<Meal[]>;
  getMeal(id: string): Promise<Meal | undefined>;
  createMeal(meal: InsertMeal): Promise<Meal>;
  deleteMeal(id: string): Promise<boolean>;
  getDailySummary(date: string, userId?: string): Promise<DailySummary>;
  getWeeklyTrends(period?: string, userId?: string): Promise<WeeklyTrend[]>;
  getRecipes(): Promise<Recipe[]>;
  getRecipe(id: string): Promise<Recipe | undefined>;
  getHealthTips(): Promise<HealthTip[]>;
  getDailyTip(): Promise<HealthTip>;
  createUser(user: InsertUser): Promise<User>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUser(id: string): Promise<User | undefined>;
  createProfile(userId: string, profile: InsertProfile): Promise<Profile>;
  getProfile(userId: string): Promise<Profile | undefined>;
  updateProfile(userId: string, profile: Partial<InsertProfile>): Promise<Profile | undefined>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatMessages(userId: string): Promise<ChatMessage[]>;
}

// Sample recipes (hard-coded for now, can be stored in DB later)
const SAMPLE_RECIPES: Recipe[] = [
  {
    id: "recipe-1",
    name: "Chicken Tinola",
    description: "A comforting Filipino soup with chicken, green papaya, and malunggay leaves.",
    ingredients: ["500g chicken", "1 green papaya", "malunggay leaves", "ginger", "onion"],
    instructions: ["Sauté ginger", "Add chicken", "Add papaya", "Add malunggay"],
    prepTime: 15,
    cookTime: 35,
    servings: 4,
    calories: 280,
    protein: 32,
    carbs: 12,
    fats: 12,
    costEstimate: "₱180-220",
    isBudgetFriendly: true,
    tags: ["Traditional", "High Protein"],
  },
];

const SAMPLE_TIPS: HealthTip[] = [
  {
    id: "tip-1",
    title: "Stay Hydrated",
    content: "Drink at least 8 glasses of water daily for optimal health.",
    category: "wellness",
    icon: "Droplets",
  },
  {
    id: "tip-2",
    title: "Eat the Rainbow",
    content: "Include colorful vegetables in every meal for diverse nutrients.",
    category: "nutrition",
    icon: "Leaf",
  },
];

export class PostgresStorage implements IStorage {
  async createUser(user: InsertUser): Promise<User> {
    const id = randomUUID();
    const result = await pool.query(
      "INSERT INTO users (id, username, password) VALUES ($1, $2, $3) RETURNING *",
      [id, user.username, user.password]
    );
    return {
      id: result.rows[0].id,
      username: result.rows[0].username,
      password: result.rows[0].password,
    };
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    if (result.rows.length === 0) return undefined;
    return {
      id: result.rows[0].id,
      username: result.rows[0].username,
      password: result.rows[0].password,
    };
  }

  async getUser(id: string): Promise<User | undefined> {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    if (result.rows.length === 0) return undefined;
    return {
      id: result.rows[0].id,
      username: result.rows[0].username,
      password: result.rows[0].password,
    };
  }

  async createProfile(userId: string, profile: InsertProfile): Promise<Profile> {
    const id = randomUUID();
    const result = await pool.query(
      "INSERT INTO profiles (id, user_id, name, email, age, height, weight, goals) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [id, userId, profile.name, profile.email, profile.age, profile.height, profile.weight, profile.goals || []]
    );
    return {
      id: result.rows[0].id,
      userId: result.rows[0].user_id,
      name: result.rows[0].name,
      email: result.rows[0].email,
      age: result.rows[0].age,
      height: result.rows[0].height,
      weight: result.rows[0].weight,
      goals: result.rows[0].goals,
      createdAt: result.rows[0].created_at,
    };
  }

  async getProfile(userId: string): Promise<Profile | undefined> {
    const result = await pool.query("SELECT * FROM profiles WHERE user_id = $1", [userId]);
    if (result.rows.length === 0) return undefined;
    const row = result.rows[0];
    return {
      id: row.id,
      userId: row.user_id,
      name: row.name,
      email: row.email,
      age: row.age,
      height: row.height,
      weight: row.weight,
      goals: row.goals,
      createdAt: row.created_at,
    };
  }

  async updateProfile(userId: string, updates: Partial<InsertProfile>): Promise<Profile | undefined> {
    const profile = await this.getProfile(userId);
    if (!profile) return undefined;

    const updated = { ...profile, ...updates };
    await pool.query(
      "UPDATE profiles SET name = $1, email = $2, age = $3, height = $4, weight = $5, goals = $6 WHERE user_id = $7",
      [updated.name, updated.email, updated.age, updated.height, updated.weight, updated.goals, userId]
    );
    return updated;
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const timestamp = new Date().toISOString();
    await pool.query(
      "INSERT INTO chat_messages (id, user_id, role, content, timestamp) VALUES ($1, $2, $3, $4, $5)",
      [id, message.userId, message.role, message.content, timestamp]
    );
    return { id, ...message, timestamp };
  }

  async getChatMessages(userId: string): Promise<ChatMessage[]> {
    const result = await pool.query(
      "SELECT * FROM chat_messages WHERE user_id = $1 ORDER BY timestamp ASC",
      [userId]
    );
    return result.rows.map((row) => ({
      id: row.id,
      userId: row.user_id,
      role: row.role,
      content: row.content,
      timestamp: row.timestamp,
    }));
  }

  // Meals
  async getMeals(filters?: { date?: string; startDate?: string; endDate?: string; userId?: string }): Promise<Meal[]> {
    let query = "SELECT * FROM meals WHERE 1=1";
    const params: any[] = [];
    let paramCount = 1;

    if (filters?.userId) {
      query += ` AND user_id = $${paramCount}`;
      params.push(filters.userId);
      paramCount++;
    }

    if (filters?.date) {
      query += ` AND date = $${paramCount}`;
      params.push(filters.date);
      paramCount++;
    }

    if (filters?.startDate) {
      query += ` AND date >= $${paramCount}`;
      params.push(filters.startDate);
      paramCount++;
    }

    if (filters?.endDate) {
      query += ` AND date <= $${paramCount}`;
      params.push(filters.endDate);
      paramCount++;
    }

    query += " ORDER BY date DESC";
    const result = await pool.query(query, params);
    return result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      mealType: row.meal_type,
      date: row.date,
      time: row.time,
      calories: row.calories,
      protein: row.protein,
      carbs: row.carbs,
      fats: row.fats,
      fiber: row.fiber,
      sodium: row.sodium,
      imageUrl: row.image_url,
    }));
  }

  async getMeal(id: string): Promise<Meal | undefined> {
    const result = await pool.query("SELECT * FROM meals WHERE id = $1", [id]);
    if (result.rows.length === 0) return undefined;
    const row = result.rows[0];
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      mealType: row.meal_type,
      date: row.date,
      time: row.time,
      calories: row.calories,
      protein: row.protein,
      carbs: row.carbs,
      fats: row.fats,
      fiber: row.fiber,
      sodium: row.sodium,
      imageUrl: row.image_url,
    };
  }

  async createMeal(meal: InsertMeal): Promise<Meal> {
    const id = randomUUID();
    await pool.query(
      "INSERT INTO meals (id, user_id, name, description, meal_type, date, time, calories, protein, carbs, fats, fiber, sodium, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)",
      [
        id,
        meal.userId,
        meal.name,
        meal.description,
        meal.mealType,
        meal.date,
        meal.time,
        meal.calories,
        meal.protein,
        meal.carbs,
        meal.fats,
        meal.fiber,
        meal.sodium,
        meal.imageUrl,
      ]
    );
    return { id, ...meal };
  }

  async deleteMeal(id: string): Promise<boolean> {
    const result = await pool.query("DELETE FROM meals WHERE id = $1", [id]);
    return result.rowCount! > 0;
  }

  async getDailySummary(date: string, userId?: string): Promise<DailySummary> {
    let query = "SELECT SUM(calories) as total_calories, SUM(protein) as total_protein, SUM(carbs) as total_carbs, SUM(fats) as total_fats, COUNT(*) as meal_count FROM meals WHERE date = $1";
    const params: any[] = [date];
    if (userId) {
      query += " AND user_id = $2";
      params.push(userId);
    }
    const result = await pool.query(query, params);
    const row = result.rows[0];
    return {
      date,
      totalCalories: row.total_calories || 0,
      totalProtein: row.total_protein || 0,
      totalCarbs: row.total_carbs || 0,
      totalFats: row.total_fats || 0,
      mealCount: parseInt(row.meal_count) || 0,
    };
  }

  async getWeeklyTrends(period?: string, userId?: string): Promise<WeeklyTrend[]> {
    let query = "SELECT date, SUM(calories) as total_calories, SUM(protein) as total_protein, SUM(carbs) as total_carbs, SUM(fats) as total_fats FROM meals WHERE 1=1";
    const params: any[] = [];
    let paramCount = 1;
    
    if (userId) {
      query += ` AND user_id = $${paramCount}`;
      params.push(userId);
      paramCount++;
    }
    
    query += " GROUP BY date ORDER BY date DESC LIMIT 7";
    const result = await pool.query(query, params);
    return result.rows.map((row) => ({
      date: row.date,
      totalCalories: row.total_calories,
      totalProtein: row.total_protein,
      totalCarbs: row.total_carbs,
      totalFats: row.total_fats,
    }));
  }

  async getRecipes(): Promise<Recipe[]> {
    return SAMPLE_RECIPES;
  }

  async getRecipe(id: string): Promise<Recipe | undefined> {
    return SAMPLE_RECIPES.find((r) => r.id === id);
  }

  async getHealthTips(): Promise<HealthTip[]> {
    return SAMPLE_TIPS;
  }

  async getDailyTip(): Promise<HealthTip> {
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
    );
    return SAMPLE_TIPS[dayOfYear % SAMPLE_TIPS.length];
  }
}

export const storage = process.env.DATABASE_URL
  ? new PostgresStorage()
  : null;
