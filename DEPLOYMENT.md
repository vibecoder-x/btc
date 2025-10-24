# BTCindexer Deployment Instructions

## Environment Variables

Before deploying to Vercel, you need to set the following environment variables:

### Required Environment Variables

1. `NEXT_PUBLIC_SUPABASE_URL`
   - Your Supabase project URL
   - Example: `https://iosjlspiwhknhkffejda.supabase.co`

2. `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Your Supabase anonymous key
   - Found in: Supabase Dashboard → Settings → API → anon/public key

## Vercel Deployment Steps

### 1. Set Environment Variables in Vercel

In your Vercel project settings:

1. Go to **Settings** → **Environment Variables**
2. Add the following variables for **Production**, **Preview**, and **Development**:

```
NEXT_PUBLIC_SUPABASE_URL=https://iosjlspiwhknhkffejda.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key_here
```

### 2. Database Setup

Run the SQL commands in `supabase-schema.sql` in your Supabase SQL Editor to create:
- `users_profile` table
- `api_keys` table
- `usage_logs` table
- RLS policies
- Triggers

### 3. Configure Google OAuth (if enabled)

1. Go to Supabase Dashboard → Authentication → Providers
2. Enable Google
3. Add your Google OAuth credentials
4. Callback URL is: `https://iosjlspiwhknhkffejda.supabase.co/auth/v1/callback`

### 4. Deploy

Push to your GitHub repository, and Vercel will automatically build and deploy.

## Troubleshooting

### Build Fails with "Missing Supabase environment variables"

Make sure you've added the environment variables in Vercel Dashboard → Settings → Environment Variables for all environments (Production, Preview, Development).

### Users can't sign in after deployment

1. Check that environment variables are correctly set in Vercel
2. Verify Supabase URL and API key are correct
3. Run the database schema SQL if not done already
4. Check Supabase Dashboard → Authentication to see if users are being created
