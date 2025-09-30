# Deployment Guide

This guide explains how to deploy the SF Weekend Planner application to production.

## 🎯 Recommended Deployment Strategy

**Backend**: Railway (supports SWI-Prolog)  
**Frontend**: Vercel (optimized for React)

---

## 🔧 Backend Deployment (Railway)

### Prerequisites
- GitHub account
- Railway account (sign up at [railway.app](https://railway.app))

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

### Step 2: Deploy to Railway

1. Go to [railway.app](https://railway.app) and sign in
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your `sf-activity-planner` repository
4. Railway will detect the backend automatically

### Step 3: Configure Backend Service

1. Click on your backend service
2. Go to **Settings** → **Root Directory**
   - Set to: `backend`
3. Go to **Variables** tab (environment variables are auto-detected)
4. Railway will automatically:
   - Install SWI-Prolog (via `nixpacks.toml`)
   - Install Python dependencies
   - Run Gunicorn (via `Procfile`)

### Step 4: Get Your Backend URL

1. Go to **Settings** → **Networking**
2. Click **Generate Domain**
3. Copy your backend URL (e.g., `https://your-app.railway.app`)
4. **Save this URL** - you'll need it for the frontend!

---

## 🎨 Frontend Deployment (Vercel)

### Step 1: Update API URL

Before deploying, update the frontend to use your Railway backend URL:

```bash
cd frontend
```

Create a `.env.production` file:
```bash
REACT_APP_API_URL=https://your-app.railway.app
```

Replace `https://your-app.railway.app` with your actual Railway backend URL from above.

### Step 2: Update Frontend Code

In `frontend/src/components/PreferenceForm.js` and other components, update API calls to use:
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
```

### Step 3: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"New Project"** → **"Import Git Repository"**
3. Select your `sf-activity-planner` repository
4. Configure the project:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
5. Add Environment Variable:
   - Key: `REACT_APP_API_URL`
   - Value: Your Railway backend URL
6. Click **Deploy**

### Step 4: Update CORS (Backend)

After getting your Vercel URL, update the backend to allow requests from Vercel:

In `backend/app.py`, update CORS configuration:
```python
from flask_cors import CORS

# Replace this line:
CORS(app)

# With this:
CORS(app, origins=[
    "http://localhost:3000",  # Local development
    "https://your-vercel-app.vercel.app"  # Production
])
```

Commit and push changes - Railway will auto-deploy.

---

## 🔄 Alternative: Both on Railway

If you prefer to keep everything on Railway:

### Backend
Follow the Railway backend steps above.

### Frontend
1. In Railway dashboard, click **"New Service"**
2. Select your repository again
3. Configure:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Start Command**: `npx serve -s build -l $PORT`
4. Add to `frontend/package.json`:
   ```json
   "dependencies": {
     ...existing dependencies,
     "serve": "^14.2.0"
   }
   ```
5. Create `frontend/.env.production`:
   ```
   REACT_APP_API_URL=https://your-backend.railway.app
   ```

---

## 🧪 Testing Your Deployment

### Test Backend
```bash
curl https://your-backend.railway.app/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "message": "SF Weekend Planner API is running"
}
```

### Test Frontend
1. Visit your Vercel URL (or Railway frontend URL)
2. Fill out the preference form
3. Check that recommendations load correctly

---

## 🐛 Troubleshooting

### Backend Issues

**SWI-Prolog not found:**
- Check that `nixpacks.toml` is in the `backend/` directory
- Verify Railway is reading the config file

**Port binding errors:**
- Ensure `Procfile` uses `$PORT` variable
- Railway automatically assigns the PORT environment variable

**Import errors:**
- Check `requirements.txt` has all dependencies
- View Railway logs for specific error messages

### Frontend Issues

**API connection failed:**
- Verify `REACT_APP_API_URL` is set correctly
- Check that backend CORS allows your frontend domain
- Open browser console to see actual error messages

**Build failures:**
- Check Node.js version compatibility
- Try building locally first: `npm run build`

---

## 📊 Monitoring

### Railway
- View logs in Railway dashboard
- Monitor CPU and memory usage
- Set up health check alerts

### Vercel
- View deployment logs
- Check Analytics tab for performance
- Monitor build times

---

## 💰 Cost Estimates

### Railway
- **Free Tier**: $5 credit/month (usually enough for hobby projects)
- **Hobby Plan**: $5/month

### Vercel
- **Free Tier**: Unlimited personal projects
- **Pro**: $20/month (for production apps)

---

## 🚀 Continuous Deployment

Both Railway and Vercel support automatic deployments:

1. Push to GitHub
2. Changes automatically deploy
3. No manual intervention needed

### Set up automatic deployments:
- **Railway**: Auto-enabled for main branch
- **Vercel**: Auto-enabled for main branch (can configure branch previews)

---

## 📝 Environment Variables Summary

### Backend (Railway)
- `PORT` - Auto-set by Railway
- `PYTHON_VERSION` - Auto-detected from runtime

### Frontend (Vercel)
- `REACT_APP_API_URL` - Your Railway backend URL

---

## ✅ Deployment Checklist

Backend:
- [ ] `backend/requirements.txt` includes `gunicorn`
- [ ] `backend/Procfile` created
- [ ] `backend/nixpacks.toml` created
- [ ] Hardcoded paths fixed in `app.py`
- [ ] Pushed to GitHub
- [ ] Deployed to Railway
- [ ] Generated Railway domain
- [ ] Backend health check passes

Frontend:
- [ ] `.env.production` created with backend URL
- [ ] API calls use environment variable
- [ ] CORS updated in backend
- [ ] Pushed to GitHub
- [ ] Deployed to Vercel
- [ ] Environment variable set in Vercel
- [ ] Frontend loads and connects to backend

---

**Need Help?** Check the [Railway docs](https://docs.railway.app) or [Vercel docs](https://vercel.com/docs)
