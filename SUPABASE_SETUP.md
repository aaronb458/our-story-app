# Supabase Setup Instructions

## Quick Setup (5 minutes)

### 1. Create a Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" and sign up (free tier is fine)
3. Create a new project (give it any name like "our-story-app")
4. Choose a database password and region

### 2. Create Database Tables
1. In your Supabase dashboard, click on "SQL Editor" in the left sidebar
2. Click "New Query"
3. Copy and paste the entire contents of `supabase-setup.sql` (in this directory)
4. Click "Run" to create the tables

### 3. Get Your API Keys
1. Go to Project Settings (gear icon in sidebar)
2. Click on "API" in the settings menu
3. Copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

### 4. Update Environment Variables
1. Open `.env.local` in this directory
2. Replace the placeholder values:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...your-key-here
   ```

### 5. Deploy to Vercel
If you're using Vercel (which it looks like you are):
1. Go to your Vercel project dashboard
2. Go to Settings → Environment Variables
3. Add these two variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = your project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your anon key
4. Redeploy your app

### 6. Test It!
1. Run `npm run dev` locally (or just visit your deployed site)
2. Log in as hubby on one device
3. Log in as wifey on another device
4. Submit answers and see them sync in real-time!

## What Changed?

### Before (localStorage only):
- Each person's answers stayed on their own device
- No syncing between devices
- No central database

### After (Supabase):
- All answers saved to a shared database
- Both of you can see each other's answers (after 9pm)
- Works across all devices
- History is preserved forever

## Troubleshooting

### "Failed to submit answer"
- Check that your `.env.local` file has the correct Supabase credentials
- Make sure you ran the SQL setup script in Supabase
- Restart your dev server after updating environment variables

### Can't see partner's answer
- Make sure both of you are using the deployed version (or both using local)
- Check that it's after 9pm
- Verify partner actually submitted their answer

### Questions?
Check the Supabase documentation or feel free to reach out!
