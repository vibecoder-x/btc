# Fixing Google OAuth "redirect_uri_mismatch" Error

## The Error You're Seeing:

```
Error 400: redirect_uri_mismatch
You can't sign in because BTCindexer sent an invalid request.
```

This means Google OAuth redirect URIs are not configured correctly.

## Step-by-Step Fix

### Step 1: Find Your Supabase Callback URL

Your Supabase callback URL is:
```
https://iosjlspiwhknhkffejda.supabase.co/auth/v1/callback
```

### Step 2: Configure Google Cloud Console

1. **Go to Google Cloud Console**:
   - Visit: https://console.cloud.google.com/
   - Select your project (or create one if you haven't)

2. **Enable Google+ API** (if not already enabled):
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API"
   - Click "Enable"

3. **Go to OAuth Consent Screen**:
   - Click "APIs & Services" → "OAuth consent screen"
   - If you haven't set it up:
     - Choose "External" (for public app)
     - Click "Create"
     - Fill in:
       - App name: `BTCindexer`
       - User support email: Your email
       - Developer contact: Your email
     - Click "Save and Continue"
     - Skip scopes (click "Save and Continue")
     - Add test users if in testing mode
     - Click "Save and Continue"

4. **Create OAuth 2.0 Credentials**:
   - Go to "APIs & Services" → "Credentials"
   - Click "+ CREATE CREDENTIALS" → "OAuth client ID"
   - Choose "Web application"
   - Name it: `BTCindexer`

5. **Add Authorized Redirect URIs** (IMPORTANT):
   In the "Authorized redirect URIs" section, add BOTH:

   ```
   https://iosjlspiwhknhkffejda.supabase.co/auth/v1/callback
   ```

   AND (for local development):

   ```
   http://localhost:3000/auth/v1/callback
   ```

   Click "+ ADD URI" for each one.

6. **Save and Copy Credentials**:
   - Click "CREATE"
   - Copy your **Client ID** (looks like: `123456789-abc.apps.googleusercontent.com`)
   - Copy your **Client Secret** (looks like: `GOCSPX-abc123...`)
   - Keep these safe!

### Step 3: Configure Supabase

1. **Go to Supabase Dashboard**:
   - Visit: https://supabase.com/dashboard
   - Select your project: `iosjlspiwhknhkffejda`

2. **Configure Authentication**:
   - Go to "Authentication" → "Providers"
   - Find "Google" in the list
   - Click to expand

3. **Enable Google Provider**:
   - Toggle "Enable Sign in with Google" to ON
   - Paste your **Client ID** from Google
   - Paste your **Client Secret** from Google

4. **Configure Site URL** (CRITICAL):
   - Go to "Authentication" → "URL Configuration"
   - Set **Site URL** to your production domain:
     - If deployed to Vercel: `https://your-app.vercel.app`
     - If custom domain: `https://btcindexer.com`
   - For now, you can use: `http://localhost:3000` for testing

5. **Add Redirect URLs**:
   - In "Redirect URLs" section, add:
     ```
     http://localhost:3000/**
     https://your-app.vercel.app/**
     ```

6. **Save Changes**

### Step 4: Update Your Deployed App (Vercel)

After deploying to Vercel, you need to update Google OAuth:

1. **Get Your Vercel URL**:
   - Example: `https://btcindexer.vercel.app`

2. **Add to Google Cloud Console**:
   - Go back to Google Cloud Console → Credentials → Your OAuth Client
   - Click "Edit"
   - Add to "Authorized redirect URIs":
     ```
     https://iosjlspiwhknhkffejda.supabase.co/auth/v1/callback
     ```
   - Add to "Authorized JavaScript origins":
     ```
     https://btcindexer.vercel.app
     ```
   - Save

3. **Update Supabase Site URL**:
   - Go to Supabase → Authentication → URL Configuration
   - Change Site URL to: `https://btcindexer.vercel.app`
   - Add to Redirect URLs: `https://btcindexer.vercel.app/**`
   - Save

## Testing the Fix

### Test Locally (Development):

1. Make sure your `.env.local` has:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://iosjlspiwhknhkffejda.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

2. Run your app:
   ```bash
   npm run dev
   ```

3. Go to: `http://localhost:3000/login`

4. Click "Continue with Google"

5. You should see Google login screen (not an error)

### Test on Vercel (Production):

1. Make sure environment variables are set in Vercel (see VERCEL_SETUP.md)

2. Deploy your app

3. Go to your Vercel URL: `https://your-app.vercel.app/login`

4. Click "Continue with Google"

5. Should work without redirect_uri_mismatch error

## Common Issues & Solutions

### Issue 1: Still getting redirect_uri_mismatch
**Solution**:
- Double-check the redirect URI in Google Cloud Console
- It must be EXACTLY: `https://iosjlspiwhknhkffejda.supabase.co/auth/v1/callback`
- No extra spaces, no trailing slash differences
- Click "Save" after adding

### Issue 2: "Access blocked: This app's request is invalid"
**Solution**:
- Make sure you added your email as a test user in OAuth Consent Screen
- OR publish your OAuth app (click "Publish App" in OAuth Consent Screen)

### Issue 3: Works locally but not on Vercel
**Solution**:
- Make sure you updated Supabase Site URL to your Vercel domain
- Add Vercel domain to Supabase Redirect URLs
- Redeploy after updating environment variables

### Issue 4: "The client ID is not valid"
**Solution**:
- Verify you copied the correct Client ID from Google
- Make sure it's saved in Supabase → Authentication → Providers → Google
- No extra spaces when pasting

## Quick Checklist

Before testing, verify:

**Google Cloud Console**:
- [ ] OAuth consent screen is configured
- [ ] Created OAuth 2.0 Client ID
- [ ] Added redirect URI: `https://iosjlspiwhknhkffejda.supabase.co/auth/v1/callback`
- [ ] Copied Client ID and Client Secret

**Supabase**:
- [ ] Enabled Google provider
- [ ] Pasted Client ID from Google
- [ ] Pasted Client Secret from Google
- [ ] Set Site URL (localhost for dev, Vercel URL for prod)
- [ ] Added redirect URLs

**Your App**:
- [ ] Environment variables set (locally and in Vercel)
- [ ] Redeployed if on Vercel
- [ ] Can access login page
- [ ] "Continue with Google" button visible

## Video Tutorial References

Search YouTube for:
- "Supabase Google OAuth setup"
- "How to fix redirect_uri_mismatch Google OAuth"
- "Google Cloud Console OAuth setup"

## Need Help?

If still not working:
1. Check browser console for errors (F12 → Console tab)
2. Verify exact redirect URI in Google Cloud Console
3. Make sure OAuth consent screen is published or you're added as test user
4. Try clearing browser cache/cookies
5. Test in incognito/private window
