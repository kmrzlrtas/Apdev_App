# Quick Start: Adding ML to Your App

## 🚀 Step-by-Step Guide

### 1. Prepare Your Dataset

Create a CSV file with meal data:

```csv
meal_description,meal_type,calories,protein,carbs,fats
"Chicken Adobo with Rice",dinner,650,45,55,25
"Sinigang na Baboy",lunch,420,35,20,18
"Tapsilog",breakfast,720,38,60,35
```

Save it as: `ml/datasets/nutrition_dataset.csv`

### 2. Train Your First Model (Python)

```bash
# Install Python dependencies
pip install pandas scikit-learn numpy joblib

# Train the model
cd ml/training
python train-nutrition-model.py --dataset ../datasets/nutrition_dataset.csv
```

This will create trained models in `ml/models/`

### 3. Use ML Features in Your App

The ML service is already integrated! You can now:

**Get Recommendations:**
```javascript
GET /api/ml/recommendations
// Returns personalized meal recommendations
```

**Predict Health Trends:**
```javascript
GET /api/ml/trends?days=30
// Returns predicted calorie trends for next 30 days
```

**Detect Anomalies:**
```javascript
GET /api/ml/anomalies
// Detects unusual eating patterns
```

**Predict Nutrition (ML alternative to OpenAI):**
```javascript
POST /api/ml/predict-nutrition
Body: { mealDescription: "chicken adobo", mealType: "dinner" }
// Returns predicted nutrition values
```

### 4. Export Data from Your Database

To create training datasets from your existing data:

```sql
-- Export meals to CSV
COPY (
  SELECT name, meal_type, calories, protein, carbs, fats 
  FROM meals 
  WHERE calories IS NOT NULL
) TO '/path/to/nutrition_dataset.csv' WITH CSV HEADER;
```

### 5. Improve Models with More Data

- Collect more meal entries from users
- Add Filipino food nutrition databases
- Include user ratings and preferences
- Add image data if implementing food recognition

## 📚 Next Steps

1. **Start Simple**: Use the basic ML models provided
2. **Collect Data**: Export your meal data to CSV
3. **Train Models**: Run training scripts with your data
4. **Improve**: Add more features and data over time
5. **Deploy**: Use TensorFlow.js for browser-based predictions

## 🎯 ML Features You Can Add

- ✅ Nutrition prediction from text
- ✅ Meal recommendations
- ✅ Health trend forecasting
- ✅ Anomaly detection
- 🔜 Food image recognition
- 🔜 Personalized meal planning
- 🔜 Weight prediction
- 🔜 Optimal meal timing suggestions

