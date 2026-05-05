# Vercel Deployment Guide

## Environment Variables Required

Set these environment variables in your Vercel dashboard:

### Clerk Authentication
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_dW5iaWFzZWQtc3VuYmVhbS04OC5jbGVyay5hY2NvdW50cy5kZXYk`
- `CLERK_SECRET_KEY=sk_test_fMEsO0xsk3P2OXdCTI06XILS2ID9FhgHLPS7sNrAxz`

### Supabase Database
- `NEXT_PUBLIC_SUPABASE_URL=https://hjvfablftkwmdagtanbp.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_cKvFVBbapUPgUYBh2SUNwA__39l2q9t`

### Groq AI API
- `GROQ_API_KEY=gsk_...`

## Build Configuration

The project includes a `vercel.json` configuration file that handles:
- Build commands
- CORS headers for API routes
- Function timeouts
- Environment optimization

## Common Issues and Solutions

### 1. Middleware Deprecation Warning
The middleware.ts file uses the deprecated convention. This warning doesn't break deployment but should be addressed in future updates.

### 2. Environment Variables
Ensure all environment variables are set in Vercel dashboard, not just in .env.local

### 3. Build Failures
If build fails, check:
- All dependencies are installed
- Environment variables are correctly set
- No TypeScript errors

## Deployment Steps

1. Push changes to GitHub
2. Ensure environment variables are set in Vercel
3. Trigger deployment from Vercel dashboard
4. Monitor build logs for any errors

## Post-Deployment Checklist

- [ ] Authentication works correctly
- [ ] Database connections are established
- [ ] API endpoints respond correctly
- [ ] Static assets are loading
- [ ] No console errors in browser
