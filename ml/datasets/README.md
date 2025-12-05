# ML Datasets for NutriTrackPH

## 📊 Dataset Structure

Place your training datasets in this directory. Here are the recommended formats:

### 1. Nutrition Dataset (`nutrition_dataset.csv`)
```csv
meal_description,meal_type,calories,protein,carbs,fats,fiber,sodium,cuisine
"Chicken Adobo with Rice",dinner,650,45,55,25,3,1200,Filipino
"Sinigang na Baboy",lunch,420,35,20,18,5,1500,Filipino
"Tapsilog",breakfast,720,38,60,35,2,1100,Filipino
```

### 2. User Meal History (`user_meals.csv`)
```csv
user_id,meal_id,date,meal_type,rating,calories,protein,carbs,fats
user-123,meal-456,2025-12-01,breakfast,5,450,30,40,15
user-123,meal-789,2025-12-01,lunch,4,580,35,50,20
```

### 3. User Profiles (`user_profiles.csv`)
```csv
user_id,age,height,weight,goal,activity_level,budget,dietary_restrictions
user-123,25,170,70,weight_loss,moderate,medium,""
user-456,30,165,65,muscle_gain,high,high,vegetarian
```

### 4. Food Images (Optional)
- Create subdirectories: `images/chicken_adobo/`, `images/sinigang/`, etc.
- Label images with nutrition data in `image_labels.json`

## 🎯 How to Use

1. **Collect Data**: Gather meal data from your app or external sources
2. **Format Data**: Convert to CSV format matching the structure above
3. **Place Files**: Put CSV files in this directory
4. **Train Models**: Run training scripts (see `../training/`)

## 📈 Data Sources

- **USDA Food Database**: https://fdc.nal.usda.gov/
- **Open Food Facts**: https://world.openfoodfacts.org/
- **Your App Data**: Export from Neon database
- **Filipino Food Databases**: Research local nutrition databases

## 🔄 Exporting from Your Database

You can export data from your Neon database:

```sql
-- Export meals
COPY (SELECT * FROM meals) TO '/path/to/meals.csv' WITH CSV HEADER;

-- Export user profiles
COPY (SELECT * FROM profiles) TO '/path/to/profiles.csv' WITH CSV HEADER;
```

Or use a script to export:

```javascript
// ml/utils/export-data.js
import { pool } from '../../server/db.js';
import fs from 'fs';

async function exportMeals() {
  const result = await pool.query('SELECT * FROM meals');
  // Convert to CSV and save
}
```

