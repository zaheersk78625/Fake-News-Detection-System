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

## Configuration Details

- **Framework:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **API Routes:** All requests to `/api/*` are handled by `api/index.ts`.
- **SPA Routing:** Any unknown route will serve `index.html` to support Client-Side Routing.
