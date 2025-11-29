# NutriTrackPH - Setup Guide

## Quick Start (All platforms)

### Prerequisites
- Node.js (v16+) - https://nodejs.org/
- Git - https://git-scm.com/

### Step 1: Clone the project
```bash
git clone <your-repo-url>
cd nutritrack-ph
```

### Step 2: Install dependencies
```bash
npm install
```

### Step 3: Create .env file
Create a file named `.env` in the root folder with:
```
DATABASE_URL=postgresql://neondb_owner:npg_IcH8lXeO7UZu@ep-broad-thunder-aho5vla3-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
OPENAI_API_KEY=
SESSION_SECRET=my-secret-key-123
```

**Note:** Keep `.env` private - never commit it to Git!

### Step 4: Run the app
```bash
npm run dev
```

### Step 5: Open browser
Go to `http://localhost:5000`

### Create an account
- Click "Register here" on the login page
- Enter username and password (min 3 and 6 characters)
- Click "Create Account"

### Start tracking meals
- Go to Calendar to log meals
- Visit AI Assistant to chat about nutrition
- Update your profile anytime

## Database
Your app uses **Neon PostgreSQL** (cloud database)
- All data is stored in: https://console.neon.tech/
- Works on any device with internet
- No local database installation needed

## Troubleshooting

**Port 5000 already in use?**
- Change PORT in terminal: `PORT=3000 npm run dev`

**Can't connect to database?**
- Check your DATABASE_URL in .env
- Make sure internet connection is active
- Check Neon console for database status

**npm install fails?**
- Try: `npm install --legacy-peer-deps`

## For Mobile
Open `http://<your-ip>:5000` on your phone
(Find your IP: `ipconfig getifaddr en0` on Mac, `ipconfig` on Windows)
