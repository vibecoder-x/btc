# How to Add Environment Variables to Vercel - Step by Step Guide

## What Are Environment Variables?

Environment variables are secret configuration values that your application needs to work, like API keys and database URLs. They should NOT be committed to GitHub for security reasons.

For BTCindexer, we need to tell Vercel where your Supabase database is and how to connect to it.

## Your Supabase Credentials

You need these two values (you already have them):

1. **NEXT_PUBLIC_SUPABASE_URL**: `https://iosjlspiwhknhkffejda.supabase.co`
2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlvc2psc3Bpd2hrbmhrZmZlamRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyOTUzNjUsImV4cCI6MjA3Njg3MTM2NX0.8HmP4ryRpf1qKvmnDQEHdaYf9wsVjFpd4KyJkjMmOgU`

## Step-by-Step Instructions for Vercel

### Method 1: Using Vercel Dashboard (Easiest)

#### Step 1: Go to Your Vercel Project
1. Open https://vercel.com/dashboard
2. Log in to your account
3. Click on your **btcindexer** project (or whatever name you gave it)

#### Step 2: Open Settings
1. In your project page, click the **"Settings"** tab at the top
2. In the left sidebar, click **"Environment Variables"**

#### Step 3: Add First Variable (SUPABASE_URL)
1. You'll see a form with three fields:
   - **Key** (or Name)
   - **Value**
   - **Environments to apply to**

2. Fill in:
   - **Key**: Type exactly `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: Paste `https://iosjlspiwhknhkffejda.supabase.co`
   - **Environments**: Check all three boxes:
     - ✅ Production
     - ✅ Preview
     - ✅ Development

3. Click **"Save"** or **"Add"** button

#### Step 4: Add Second Variable (SUPABASE_ANON_KEY)
1. Click **"Add Another"** (or you'll see a new empty form)

2. Fill in:
   - **Key**: Type exactly `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value**: Paste `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlvc2psc3Bpd2hrbmhrZmZlamRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyOTUzNjUsImV4cCI6MjA3Njg3MTM2NX0.8HmP4ryRpf1qKvmnDQEHdaYf9wsVjFpd4KyJkjMmOgU`
   - **Environments**: Check all three boxes:
     - ✅ Production
     - ✅ Preview
     - ✅ Development

3. Click **"Save"** or **"Add"** button

#### Step 5: Redeploy
1. Go to the **"Deployments"** tab at the top
2. Click the **three dots (•••)** on your latest deployment
3. Click **"Redeploy"**
4. Confirm by clicking **"Redeploy"** again

**OR** just push a new commit to GitHub (Vercel will auto-deploy)

### Method 2: Using Vercel CLI (Alternative)

If you have Vercel CLI installed:

```bash
cd btcindexer

# Add for production
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# When prompted, paste: https://iosjlspiwhknhkffejda.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# When prompted, paste your anon key

# Add for preview
vercel env add NEXT_PUBLIC_SUPABASE_URL preview
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview

# Add for development
vercel env add NEXT_PUBLIC_SUPABASE_URL development
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY development

# Redeploy
vercel --prod
```

## How to Verify It Worked

### 1. Check Build Logs
1. Go to **Deployments** tab in Vercel
2. Click on your latest deployment
3. Look at the build logs - you should NOT see the error:
   ```
   Error: @supabase/ssr: Your project's URL and API key are required
   ```
4. Build should show: **"Build completed successfully"**

### 2. Test Your Deployed Site
1. Visit your Vercel URL (e.g., `https://btcindexer.vercel.app`)
2. Click **"Sign Up"** button
3. Try to create an account
4. If environment variables are set correctly:
   - You can sign up successfully
   - You'll be redirected to `/dashboard`
   - You can generate an API key

### 3. Check in Vercel Settings
1. Go to Settings → Environment Variables
2. You should see 2 variables listed:
   - `NEXT_PUBLIC_SUPABASE_URL` (Production, Preview, Development)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Production, Preview, Development)

## Common Issues & Solutions

### Issue 1: "Build still failing after adding env vars"
**Solution**: Make sure to **redeploy** after adding environment variables. They only take effect on NEW deployments.

### Issue 2: "I added the env vars but can't sign in"
**Solution**:
1. Check that you ran the SQL schema in Supabase (the `supabase-schema.sql` file)
2. Verify the environment variable values are EXACTLY as shown above (no extra spaces)
3. Make sure you selected all three environments (Production, Preview, Development)

### Issue 3: "Where do I find my Supabase keys?"
**Solution**:
1. Go to https://supabase.com/dashboard
2. Select your project: `iosjlspiwhknhkffejda`
3. Click Settings (gear icon) → API
4. Copy:
   - Project URL → Use for `NEXT_PUBLIC_SUPABASE_URL`
   - anon public key → Use for `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Issue 4: "Environment variable not showing in dropdown"
**Solution**: After adding env vars, you need to:
1. Wait a few seconds for Vercel to save them
2. Refresh the page
3. Redeploy your project

## Video Tutorial Reference

If you need a visual guide, search YouTube for:
- "How to add environment variables to Vercel"
- "Vercel environment variables tutorial"

The process is the same for all Next.js projects.

## Quick Checklist

Before you're done, verify:
- [ ] Added `NEXT_PUBLIC_SUPABASE_URL` to all 3 environments
- [ ] Added `NEXT_PUBLIC_SUPABASE_ANON_KEY` to all 3 environments
- [ ] Redeployed the project (or pushed new commit)
- [ ] Build completed successfully (no errors in logs)
- [ ] Can visit the deployed site
- [ ] Can sign up and create an account
- [ ] Can access dashboard at `/dashboard`

## Need Help?

If you're still having issues:
1. Check Vercel build logs for specific error messages
2. Verify your Supabase project is active at https://supabase.com/dashboard
3. Make sure you ran the SQL schema (`supabase-schema.sql`)
4. Double-check the environment variable values (no typos)
