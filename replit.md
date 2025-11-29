# NutriTrackPH - AI-Powered Nutrition Assistant

## Overview
NutriTrackPH is a health-focused digital calendar that promotes physical and mental wellness through nutrition awareness and balanced eating habits. It provides users with daily meal tracking, affordable recipe ideas, and educational insights about food nutrients.

**Mission**: Helping individuals achieve and maintain a healthy lifestyle aligned with SDG 3: Good Health and Well-Being.

## Tech Stack
- **Frontend**: React with TypeScript, Tailwind CSS, Shadcn UI components
- **Backend**: Express.js with TypeScript
- **AI**: OpenAI GPT-5 for meal analysis and nutrition insights
- **Charts**: Recharts for data visualization
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state

## Project Structure
```
├── client/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── ui/           # Shadcn UI base components
│   │   │   ├── app-sidebar.tsx
│   │   │   ├── theme-toggle.tsx
│   │   │   ├── meal-card.tsx
│   │   │   ├── recipe-card.tsx
│   │   │   ├── health-tip-card.tsx
│   │   │   ├── nutrition-ring.tsx
│   │   │   ├── nutrition-chart.tsx
│   │   │   └── add-meal-dialog.tsx
│   │   ├── pages/            # Route pages
│   │   │   ├── dashboard.tsx
│   │   │   ├── calendar.tsx
│   │   │   ├── recipes.tsx
│   │   │   ├── history.tsx
│   │   │   └── tips.tsx
│   │   ├── hooks/            # Custom React hooks
│   │   └── lib/              # Utilities
├── server/
│   ├── routes.ts             # API endpoints
│   ├── storage.ts            # In-memory data storage
│   └── openai.ts             # OpenAI integration
└── shared/
    └── schema.ts             # TypeScript types and Zod schemas
```

## Key Features
1. **Dashboard**: Overview of daily nutrition with progress rings, macro distribution chart, and recent meals
2. **Meal Calendar**: Visual calendar with meal entries organized by meal type (breakfast, lunch, dinner, snack)
3. **AI Meal Logging**: Natural language input analyzed by OpenAI for nutritional information
4. **Filipino Recipes**: Collection of affordable, nutritious recipes with local ingredients
5. **Health Tips**: Educational content about nutrition, wellness, fitness, and mindfulness
6. **Meal History**: Weekly and monthly nutrition trends with charts

## API Endpoints
- `GET /api/meals` - Get all meals (filterable by date range)
- `POST /api/meals` - Create a new meal
- `POST /api/meals/analyze` - Analyze meal description with AI
- `DELETE /api/meals/:id` - Delete a meal
- `GET /api/meals/summary` - Get daily nutrition summary
- `GET /api/meals/trends` - Get weekly/monthly nutrition trends
- `GET /api/recipes` - Get all recipes
- `GET /api/tips` - Get all health tips
- `GET /api/tips/daily` - Get today's health tip

## Running the App
The app runs on port 5000 with `npm run dev`. The Express server serves both the API and the Vite-built frontend.

## Environment Variables
- `OPENAI_API_KEY` - Required for AI-powered meal analysis

## Design System
- Primary color: Green (health/wellness theme)
- Font: Inter
- Dark mode support with theme toggle
- Responsive design for mobile and desktop
