"""
Train Nutrition Prediction Model
Predicts calories, protein, carbs, fats from meal descriptions

Usage:
    python train-nutrition-model.py --dataset ../datasets/nutrition_dataset.csv
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score
import joblib
import argparse

def load_dataset(filepath):
    """Load nutrition dataset from CSV"""
    df = pd.read_csv(filepath)
    print(f"Loaded {len(df)} samples")
    return df

def preprocess_data(df):
    """Preprocess meal descriptions"""
    # Combine description and meal type
    df['text'] = df['meal_description'] + ' ' + df['meal_type']
    
    # Vectorize text
    vectorizer = TfidfVectorizer(max_features=1000, stop_words='english')
    X = vectorizer.fit_transform(df['text'])
    
    # Target variables
    y_calories = df['calories'].values
    y_protein = df['protein'].values
    y_carbs = df['carbs'].values
    y_fats = df['fats'].values
    
    return X, y_calories, y_protein, y_carbs, y_fats, vectorizer

def train_models(X, y_calories, y_protein, y_carbs, y_fats):
    """Train separate models for each nutrition metric"""
    X_train, X_test, y_cal_train, y_cal_test = train_test_split(
        X, y_calories, test_size=0.2, random_state=42
    )
    
    # Train models
    models = {}
    
    for name, y_train, y_test in [
        ('calories', y_cal_train, y_cal_test),
        ('protein', y_protein[train_idx], y_protein[test_idx]),
        ('carbs', y_carbs[train_idx], y_carbs[test_idx]),
        ('fats', y_fats[train_idx], y_fats[test_idx]),
    ]:
        model = RandomForestRegressor(n_estimators=100, random_state=42)
        model.fit(X_train, y_train)
        
        # Evaluate
        y_pred = model.predict(X_test)
        mae = mean_absolute_error(y_test, y_pred)
        r2 = r2_score(y_test, y_pred)
        
        print(f"{name.capitalize()} Model:")
        print(f"  MAE: {mae:.2f}")
        print(f"  R²: {r2:.3f}")
        
        models[name] = model
    
    return models

def save_models(models, vectorizer, output_dir='../models'):
    """Save trained models"""
    import os
    os.makedirs(output_dir, exist_ok=True)
    
    for name, model in models.items():
        joblib.dump(model, f"{output_dir}/{name}_model.pkl")
    
    joblib.dump(vectorizer, f"{output_dir}/vectorizer.pkl")
    print(f"Models saved to {output_dir}")

def main():
    parser = argparse.ArgumentParser(description='Train nutrition prediction model')
    parser.add_argument('--dataset', required=True, help='Path to CSV dataset')
    parser.add_argument('--output', default='../models', help='Output directory for models')
    
    args = parser.parse_args()
    
    # Load and preprocess
    df = load_dataset(args.dataset)
    X, y_calories, y_protein, y_carbs, y_fats, vectorizer = preprocess_data(df)
    
    # Train
    models = train_models(X, y_calories, y_protein, y_carbs, y_fats)
    
    # Save
    save_models(models, vectorizer, args.output)
    
    print("Training complete!")

if __name__ == '__main__':
    main()

