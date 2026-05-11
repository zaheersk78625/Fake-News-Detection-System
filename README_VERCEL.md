# Deploying to Vercel

This project is configured for easy deployment to [Vercel](https://vercel.com).

## Prerequisites

- A Vercel account.
- [Vercel CLI](https://vercel.com/docs/cli) (optional, but recommended).

## Deployment Steps

1. **Push your code to GitHub/GitLab/Bitbucket.**
2. **Import your repository into Vercel.**
3. **Configure Environment Variables:**
   - In the Vercel project settings, add a new environment variable:
     - **Key:** `GEMINI_API_KEY`
     - **Value:** Your Google Gemini API Key (get it from [Google AI Studio](https://aistudio.google.com/app/apikey)).
4. **Deploy!** 🚀

Vercel will automatically detect the settings from `vercel.json` and deploy:
- The **Frontend** (Vite/React) as a static site.
- The **Backend** (`api/index.ts`) as a Serverless Function.

## Troubleshooting Login (Firebase Auth)

If you cannot log in on your deployed Vercel site, it is likely due to domain authorization:

1. **Add Authorized Domain:**
   - Go to the [Firebase Console](https://console.firebase.google.com/).
   - Navigate to **Authentication** > **Settings** > **Authorized Domains**.
   - Add your Vercel deployment URL (e.g., `your-app-name.vercel.app`).

2. **Check Auth Providers:**
   - Ensure Google Sign-in is enabled in **Authentication** > **Sign-in method**.

3. **Check Environment Variables:**
   - Verify that `GEMINI_API_KEY` is set in Vercel settings for the backend API to work.
