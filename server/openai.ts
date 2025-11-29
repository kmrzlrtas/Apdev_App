import OpenAI from "openai";
import type { AnalyzeMealResponse } from "@shared/schema";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// Fallback nutrition estimates for common Filipino dishes when OpenAI is not available
function getFallbackAnalysis(mealDescription: string, mealType: string): AnalyzeMealResponse {
  const lowerDesc = mealDescription.toLowerCase();
  
  // Common Filipino dish patterns with estimated nutrition
  const dishPatterns: Record<string, Partial<AnalyzeMealResponse>> = {
    "adobo": { calories: 450, protein: 35, carbs: 8, fats: 32 },
    "sinigang": { calories: 280, protein: 25, carbs: 15, fats: 12 },
    "tinola": { calories: 280, protein: 32, carbs: 12, fats: 12 },
    "kare-kare": { calories: 520, protein: 28, carbs: 35, fats: 32 },
    "lechon": { calories: 550, protein: 40, carbs: 2, fats: 42 },
    "pancit": { calories: 380, protein: 18, carbs: 52, fats: 12 },
    "lumpia": { calories: 320, protein: 12, carbs: 28, fats: 18 },
    "sisig": { calories: 420, protein: 28, carbs: 8, fats: 32 },
    "bicol express": { calories: 380, protein: 22, carbs: 12, fats: 28 },
    "pinakbet": { calories: 180, protein: 12, carbs: 22, fats: 6 },
    "monggo": { calories: 245, protein: 18, carbs: 28, fats: 8 },
    "bangus": { calories: 320, protein: 28, carbs: 8, fats: 20 },
    "tapsilog": { calories: 650, protein: 35, carbs: 55, fats: 32 },
    "longsilog": { calories: 620, protein: 28, carbs: 55, fats: 30 },
    "rice": { calories: 200, protein: 4, carbs: 45, fats: 1 },
    "egg": { calories: 90, protein: 7, carbs: 1, fats: 6 },
    "chicken": { calories: 280, protein: 32, carbs: 0, fats: 16 },
    "pork": { calories: 350, protein: 28, carbs: 0, fats: 26 },
    "fish": { calories: 200, protein: 25, carbs: 0, fats: 10 },
    "vegetables": { calories: 80, protein: 4, carbs: 15, fats: 1 },
  };

  // Find matching pattern
  let baseNutrition = { calories: 400, protein: 20, carbs: 45, fats: 15 };
  let matchedDish = "";
  
  for (const [pattern, nutrition] of Object.entries(dishPatterns)) {
    if (lowerDesc.includes(pattern)) {
      baseNutrition = { ...baseNutrition, ...nutrition };
      matchedDish = pattern;
      break;
    }
  }

  // Add rice calories if mentioned with a dish
  if (lowerDesc.includes("rice") && matchedDish && matchedDish !== "rice") {
    baseNutrition.calories += 200;
    baseNutrition.carbs += 45;
  }

  const healthInsights = [
    "Great choice! Remember to balance your meal with vegetables for added fiber.",
    "This meal provides good protein. Consider adding a side of leafy greens.",
    "Stay hydrated throughout the day for optimal nutrient absorption.",
    "For better portion control, try using a smaller plate.",
    "Adding malunggay or other local greens can boost your meal's nutritional value.",
  ];

  return {
    name: mealDescription.charAt(0).toUpperCase() + mealDescription.slice(1),
    description: `A ${mealType} meal featuring ${mealDescription}. Nutrition values are estimated.`,
    calories: baseNutrition.calories,
    protein: baseNutrition.protein,
    carbs: baseNutrition.carbs,
    fats: baseNutrition.fats,
    healthInsight: healthInsights[Math.floor(Math.random() * healthInsights.length)],
  };
}

export async function analyzeMeal(
  mealDescription: string,
  mealType: string
): Promise<AnalyzeMealResponse> {
  // If OpenAI is not configured, return a fallback response
  if (!openai) {
    console.log("OpenAI not configured, using fallback analysis");
    return getFallbackAnalysis(mealDescription, mealType);
  }

  const prompt = `Analyze this Filipino meal and provide nutritional information:

Meal Description: ${mealDescription}
Meal Type: ${mealType}

Provide a JSON response with these fields:
- name: A concise, proper name for this meal
- description: A brief description (1-2 sentences) of the meal
- calories: Estimated total calories (number)
- protein: Grams of protein (number)
- carbs: Grams of carbohydrates (number)  
- fats: Grams of fat (number)
- fiber: Grams of fiber (number, optional)
- sodium: Milligrams of sodium (number, optional)
- healthInsight: A helpful, encouraging nutrition tip related to this meal (1-2 sentences)

Base your estimates on typical Filipino portion sizes and cooking methods. Be accurate but encouraging.

Respond with JSON only, no additional text.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content:
            "You are a nutrition expert specializing in Filipino cuisine. Provide accurate nutritional analysis and helpful health insights. Always respond with valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 1024,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No response from AI");
    }

    const result = JSON.parse(content);

    return {
      name: result.name || mealDescription,
      description: result.description || `A ${mealType} meal`,
      calories: Math.round(result.calories || 0),
      protein: Math.round(result.protein || 0),
      carbs: Math.round(result.carbs || 0),
      fats: Math.round(result.fats || 0),
      fiber: result.fiber ? Math.round(result.fiber) : undefined,
      sodium: result.sodium ? Math.round(result.sodium) : undefined,
      healthInsight: result.healthInsight || "Enjoy your meal!",
    };
  } catch (error) {
    console.error("OpenAI analysis error:", error);
    return getFallbackAnalysis(mealDescription, mealType);
  }
}

export async function generateHealthTip(context?: string): Promise<string> {
  if (!openai) {
    return "Remember to eat a variety of colorful vegetables today!";
  }

  try {
    const prompt = context
      ? `Generate a brief, encouraging health tip related to: ${context}. Keep it to 1-2 sentences.`
      : "Generate a brief, encouraging Filipino nutrition or wellness tip. Keep it to 1-2 sentences.";

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content:
            "You are a friendly health and nutrition advisor focusing on Filipino wellness practices. Keep tips practical and encouraging.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_completion_tokens: 256,
    });

    return (
      response.choices[0].message.content ||
      "Remember to eat a variety of colorful vegetables today!"
    );
  } catch (error) {
    console.error("OpenAI tip generation error:", error);
    return "Remember to eat a variety of colorful vegetables today!";
  }
}
