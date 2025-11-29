import {
  type Meal,
  type InsertMeal,
  type Recipe,
  type HealthTip,
  type DailySummary,
  type WeeklyTrend,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getMeals(filters?: { date?: string; startDate?: string; endDate?: string }): Promise<Meal[]>;
  getMeal(id: string): Promise<Meal | undefined>;
  createMeal(meal: InsertMeal): Promise<Meal>;
  deleteMeal(id: string): Promise<boolean>;
  getDailySummary(date: string): Promise<DailySummary>;
  getWeeklyTrends(period?: string): Promise<WeeklyTrend[]>;
  getRecipes(): Promise<Recipe[]>;
  getRecipe(id: string): Promise<Recipe | undefined>;
  getHealthTips(): Promise<HealthTip[]>;
  getDailyTip(): Promise<HealthTip>;
}

export class MemStorage implements IStorage {
  private meals: Map<string, Meal>;
  private recipes: Map<string, Recipe>;
  private healthTips: Map<string, HealthTip>;

  constructor() {
    this.meals = new Map();
    this.recipes = new Map();
    this.healthTips = new Map();
    this.seedData();
  }

  private seedData() {
    const recipes: Recipe[] = [
      {
        id: "recipe-1",
        name: "Chicken Tinola",
        description: "A comforting Filipino soup with chicken, green papaya, and malunggay leaves. Light, nutritious, and perfect for any day.",
        ingredients: [
          "500g chicken (cut into pieces)",
          "1 medium green papaya (sliced)",
          "2 cups malunggay leaves",
          "1 thumb-sized ginger (sliced)",
          "1 onion (quartered)",
          "4 cups water or chicken broth",
          "2 tbsp fish sauce",
          "Salt and pepper to taste",
        ],
        instructions: [
          "Sauté ginger and onion until fragrant",
          "Add chicken pieces and cook until lightly browned",
          "Pour in water or broth and bring to a boil",
          "Simmer until chicken is cooked through (about 20 minutes)",
          "Add green papaya and cook until tender",
          "Season with fish sauce, salt, and pepper",
          "Add malunggay leaves last, cook for 2 minutes",
          "Serve hot with steamed rice",
        ],
        prepTime: 15,
        cookTime: 35,
        servings: 4,
        calories: 280,
        protein: 32,
        carbs: 12,
        fats: 12,
        costEstimate: "₱180-220",
        isBudgetFriendly: true,
        tags: ["Traditional", "High Protein", "Low Carb", "Soup"],
      },
      {
        id: "recipe-2",
        name: "Ginisang Monggo",
        description: "Hearty mung bean stew with bitter melon leaves and pork. A protein-rich dish that's gentle on the wallet.",
        ingredients: [
          "1 cup dried mung beans",
          "200g pork belly (cubed)",
          "2 cups ampalaya leaves or spinach",
          "1 tomato (chopped)",
          "1 onion (chopped)",
          "3 cloves garlic (minced)",
          "2 tbsp fish sauce",
          "4 cups water",
        ],
        instructions: [
          "Boil mung beans until soft (about 30 minutes)",
          "In a separate pan, sauté garlic, onion, and tomato",
          "Add pork and cook until browned",
          "Add cooked mung beans with its liquid",
          "Simmer for 10 minutes until flavors blend",
          "Season with fish sauce",
          "Add leafy greens and cook for 2 minutes",
          "Serve hot over rice",
        ],
        prepTime: 10,
        cookTime: 45,
        servings: 6,
        calories: 245,
        protein: 18,
        carbs: 28,
        fats: 8,
        costEstimate: "₱120-150",
        isBudgetFriendly: true,
        tags: ["Budget-Friendly", "High Protein", "Traditional", "Vegetarian Option"],
      },
      {
        id: "recipe-3",
        name: "Grilled Bangus",
        description: "Filipino-style grilled milkfish stuffed with tomatoes and onions. Rich in omega-3 fatty acids.",
        ingredients: [
          "1 whole bangus (milkfish, butterfly cut)",
          "2 tomatoes (sliced)",
          "1 onion (sliced)",
          "4 cloves garlic (minced)",
          "Salt and pepper",
          "Banana leaves for wrapping",
          "Lemon or calamansi for serving",
        ],
        instructions: [
          "Clean and prepare the bangus",
          "Season inside with salt, pepper, and garlic",
          "Stuff with tomatoes and onions",
          "Wrap in banana leaves",
          "Grill over medium heat for 15-20 minutes per side",
          "Serve with calamansi and steamed rice",
        ],
        prepTime: 15,
        cookTime: 40,
        servings: 3,
        calories: 320,
        protein: 28,
        carbs: 8,
        fats: 20,
        costEstimate: "₱250-300",
        isBudgetFriendly: false,
        tags: ["High Protein", "Omega-3", "Grilled", "Seafood"],
      },
      {
        id: "recipe-4",
        name: "Pinakbet",
        description: "Mixed vegetable dish with shrimp paste. A fiber-rich medley of local vegetables.",
        ingredients: [
          "1 cup squash (cubed)",
          "1 cup string beans (cut)",
          "1 cup bitter melon (sliced)",
          "1 cup eggplant (sliced)",
          "1 cup okra",
          "2 tomatoes (quartered)",
          "1 onion (sliced)",
          "3 tbsp shrimp paste (bagoong)",
          "200g pork or shrimp (optional)",
        ],
        instructions: [
          "Sauté onion and tomatoes until soft",
          "Add meat if using and cook until browned",
          "Add shrimp paste and stir",
          "Layer vegetables starting with squash",
          "Cover and cook on low heat for 15-20 minutes",
          "Do not stir - let vegetables steam",
          "Season to taste and serve",
        ],
        prepTime: 20,
        cookTime: 25,
        servings: 5,
        calories: 180,
        protein: 12,
        carbs: 22,
        fats: 6,
        costEstimate: "₱150-180",
        isBudgetFriendly: true,
        tags: ["Vegetarian Option", "High Fiber", "Traditional", "Budget-Friendly"],
      },
      {
        id: "recipe-5",
        name: "Chicken Inasal",
        description: "Grilled chicken marinated in vinegar, calamansi, and annatto. A Bacolod specialty that's high in protein.",
        ingredients: [
          "1 kg chicken (cut into pieces)",
          "1/2 cup vinegar",
          "1/4 cup calamansi juice",
          "6 cloves garlic (minced)",
          "1 lemongrass stalk (bruised)",
          "2 tbsp annatto oil",
          "Salt and pepper",
          "Chicken oil for basting",
        ],
        instructions: [
          "Combine vinegar, calamansi, garlic, lemongrass, salt, and pepper",
          "Marinate chicken for at least 4 hours or overnight",
          "Prepare annatto oil for basting",
          "Grill chicken over charcoal, basting frequently",
          "Cook until charred and cooked through (25-30 mins)",
          "Serve with garlic rice and atchara",
        ],
        prepTime: 240,
        cookTime: 30,
        servings: 4,
        calories: 350,
        protein: 38,
        carbs: 4,
        fats: 20,
        costEstimate: "₱200-250",
        isBudgetFriendly: true,
        tags: ["High Protein", "Low Carb", "Grilled", "Traditional"],
      },
      {
        id: "recipe-6",
        name: "Ensaladang Talong",
        description: "Roasted eggplant salad with tomatoes and salted eggs. Simple, delicious, and nutritious.",
        ingredients: [
          "3 large eggplants",
          "2 tomatoes (diced)",
          "1 onion (sliced thin)",
          "2 salted eggs (sliced)",
          "3 tbsp vinegar",
          "1 tbsp fish sauce",
          "Salt and pepper to taste",
        ],
        instructions: [
          "Roast eggplants over open flame until charred and soft",
          "Peel off the charred skin",
          "Flatten eggplants on a plate",
          "Top with tomatoes, onions, and salted eggs",
          "Drizzle with vinegar and fish sauce",
          "Season with salt and pepper",
          "Serve as a side dish",
        ],
        prepTime: 10,
        cookTime: 15,
        servings: 4,
        calories: 120,
        protein: 6,
        carbs: 14,
        fats: 5,
        costEstimate: "₱80-100",
        isBudgetFriendly: true,
        tags: ["Quick & Easy", "Vegetarian", "Budget-Friendly", "Low Calorie"],
      },
    ];

    recipes.forEach((recipe) => this.recipes.set(recipe.id, recipe));

    const tips: HealthTip[] = [
      {
        id: "tip-1",
        title: "Start Your Day with Protein",
        content: "Including protein in your breakfast helps maintain steady blood sugar levels and keeps you feeling full longer. Try adding eggs, tofu, or fish to your morning meal.",
        category: "nutrition",
        icon: "egg",
      },
      {
        id: "tip-2",
        title: "Colorful Plates, Healthier Meals",
        content: "Aim for at least 3 different colors on your plate at each meal. Different colored vegetables provide different nutrients and antioxidants.",
        category: "nutrition",
        icon: "palette",
      },
      {
        id: "tip-3",
        title: "Mindful Eating Practice",
        content: "Eat slowly and without distractions. It takes about 20 minutes for your brain to register fullness. This simple practice can help prevent overeating.",
        category: "mindfulness",
        icon: "brain",
      },
      {
        id: "tip-4",
        title: "Stay Hydrated Throughout the Day",
        content: "Drink water before meals and carry a water bottle with you. Sometimes thirst is mistaken for hunger. Aim for 8 glasses daily.",
        category: "wellness",
        icon: "droplet",
      },
      {
        id: "tip-5",
        title: "Move After Meals",
        content: "A short 10-15 minute walk after meals can help improve digestion and blood sugar control. It doesn't have to be intense - gentle movement works.",
        category: "fitness",
        icon: "footprints",
      },
      {
        id: "tip-6",
        title: "Choose Whole Grains",
        content: "Replace white rice occasionally with brown rice, adlai, or camote. These alternatives provide more fiber and nutrients while keeping you satisfied longer.",
        category: "nutrition",
        icon: "wheat",
      },
      {
        id: "tip-7",
        title: "Prepare Meals in Advance",
        content: "Meal prepping on weekends can help you make healthier choices during busy weekdays. Cook large batches of rice, proteins, and vegetables.",
        category: "wellness",
        icon: "calendar",
      },
      {
        id: "tip-8",
        title: "Practice Gratitude Before Eating",
        content: "Taking a moment to appreciate your food can improve your relationship with eating and help you enjoy meals more fully.",
        category: "mindfulness",
        icon: "heart",
      },
      {
        id: "tip-9",
        title: "Include Local Superfoods",
        content: "Malunggay, kamote, kalabasa, and ampalaya are nutritional powerhouses that are affordable and readily available. Include them regularly in your diet.",
        category: "nutrition",
        icon: "leaf",
      },
      {
        id: "tip-10",
        title: "Get Quality Sleep",
        content: "Poor sleep affects hunger hormones and can lead to increased appetite and weight gain. Aim for 7-9 hours of quality sleep each night.",
        category: "wellness",
        icon: "moon",
      },
    ];

    tips.forEach((tip) => this.healthTips.set(tip.id, tip));
  }

  async getMeals(filters?: { date?: string; startDate?: string; endDate?: string }): Promise<Meal[]> {
    const meals = Array.from(this.meals.values());
    
    if (!filters) return meals;
    
    return meals.filter((meal) => {
      if (filters.date) {
        return meal.date === filters.date;
      }
      if (filters.startDate && filters.endDate) {
        return meal.date >= filters.startDate && meal.date <= filters.endDate;
      }
      return true;
    });
  }

  async getMeal(id: string): Promise<Meal | undefined> {
    return this.meals.get(id);
  }

  async createMeal(insertMeal: InsertMeal): Promise<Meal> {
    const id = randomUUID();
    const meal: Meal = { ...insertMeal, id };
    this.meals.set(id, meal);
    return meal;
  }

  async deleteMeal(id: string): Promise<boolean> {
    return this.meals.delete(id);
  }

  async getDailySummary(date: string): Promise<DailySummary> {
    const meals = await this.getMeals({ date });
    
    return {
      date,
      totalCalories: meals.reduce((sum, m) => sum + m.calories, 0),
      totalProtein: meals.reduce((sum, m) => sum + m.protein, 0),
      totalCarbs: meals.reduce((sum, m) => sum + m.carbs, 0),
      totalFats: meals.reduce((sum, m) => sum + m.fats, 0),
      mealCount: meals.length,
    };
  }

  async getWeeklyTrends(period?: string): Promise<WeeklyTrend[]> {
    const days = period === "month" ? 30 : 7;
    const trends: WeeklyTrend[] = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const summary = await this.getDailySummary(dateStr);

      trends.push({
        date: dateStr,
        calories: summary.totalCalories,
        protein: summary.totalProtein,
        carbs: summary.totalCarbs,
        fats: summary.totalFats,
      });
    }

    return trends;
  }

  async getRecipes(): Promise<Recipe[]> {
    return Array.from(this.recipes.values());
  }

  async getRecipe(id: string): Promise<Recipe | undefined> {
    return this.recipes.get(id);
  }

  async getHealthTips(): Promise<HealthTip[]> {
    return Array.from(this.healthTips.values());
  }

  async getDailyTip(): Promise<HealthTip> {
    const tips = Array.from(this.healthTips.values());
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
    );
    return tips[dayOfYear % tips.length];
  }
}

export const storage = new MemStorage();
