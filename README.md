# Our Story App 💕

A beautiful couples app for daily questions and deeper connection, now with real-time database sync!

## What's New? 🎉

Your app now uses **Supabase** instead of localStorage, which means:
- ✅ Your answers sync between ALL devices in real-time
- ✅ Both of you can see each other's answers (after 9pm)
- ✅ All history is preserved forever in the cloud
- ✅ Works on any device - phone, tablet, computer

## Quick Start

### 1. Migrate Your Existing Data

If you have previous answers in localStorage, migrate them:

1. Open your app in the browser where you've been using it
2. Go to: `https://your-app-url.vercel.app/migrate-localstorage.html`
3. Click "Scan LocalStorage"
4. Click "Migrate to Database"
5. Done! Your data is now in the database

**Do this on BOTH devices** (yours and your partner's) to get all the data!

### 2. Use the App

Just visit your app URL and log in as usual. Everything works the same, but now it syncs!

## How It Works

### Database Structure

**Submissions Table:**
- Stores all your daily answers
- Unique constraint on (user, date) - one answer per person per day
- Automatically tracks when answers were submitted

**Love Notes Table:**
- Stores love notes you send to each other
- Shows up for your partner the next day
- Marks as read after viewing

### Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# The app uses the Supabase credentials from .env.local
```

### Environment Variables

These are already set up in Vercel:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public API key

## Features

- 📝 **Daily Questions** - 35 thoughtful questions that cycle through
- 🌟 **Weekly Reflections** - Special reflection question every Sunday
- 🔥 **Streak Counter** - Track your consistency together
- 💌 **Love Notes** - Send surprise messages for the next day
- 📖 **History View** - See all your past conversations
- 🔒 **9pm Unlock** - Answers unlock at 9pm each day
- 🎨 **Beautiful UI** - Beach-themed gradients and animations

## Technical Details

**Stack:**
- Next.js 14 (App Router)
- React 18
- Supabase (PostgreSQL database)
- Tailwind CSS
- TypeScript

**Deployment:**
- Hosted on Vercel
- Automatic deployments from GitHub
- Environment variables configured

## Troubleshooting

### Can't see partner's answer?
- Make sure both of you submitted your answers
- Check that it's after 9pm
- Try refreshing the page

### Migration issues?
- Make sure you're on the device where you originally used the app
- Check browser console for any errors
- Try the migration tool again

### Database not working?
- Check that environment variables are set in Vercel
- Verify Supabase project is active
- Look for errors in browser console

## Files

- `app/page.tsx` - Main app component with all UI and logic
- `lib/supabase.ts` - Supabase client configuration
- `migrate-localstorage.html` - Tool to migrate existing data
- `supabase/migrations/` - Database schema migrations
- `.env.local` - Local environment variables (not committed)

## Support

If you have any issues, check:
1. Browser console for errors
2. Supabase dashboard for database issues
3. Vercel logs for deployment issues

---

Made with 💕 for growing closer together
