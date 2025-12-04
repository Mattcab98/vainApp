# VainApp Deployment Guide

This guide covers deploying VainApp to production using Vercel (frontend) and Render (backend).

## Prerequisites

- GitHub account
- Vercel account (free tier works)
- Render account (free tier works)
- MongoDB Atlas account (free tier works)

---

## Step 1: Setup MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user with password
4. Whitelist all IPs (0.0.0.0/0) for development
5. Get your connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/vainapp?retryWrites=true&w=majority
   ```

---

## Step 2: Deploy Backend to Render

### Option A: Using Render Dashboard

1. **Push code to GitHub**
   ```bash
   cd vainapp
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Create Web Service on Render**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `vainapp-backend`
     - **Root Directory**: `backend`
     - **Environment**: `Node`
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npm start`
     - **Plan**: Free

3. **Set Environment Variables**
   Add these in Render dashboard:
   ```
   PORT=5000
   MONGO_URI=<your-mongodb-atlas-connection-string>
   JWT_SECRET=<generate-a-random-secret>
   STRIPE_SECRET_KEY=sk_test_... (or sk_live_...)
   STRIPE_WEBHOOK_SECRET=whsec_...
   FRONTEND_URL=https://your-app.vercel.app
   NODE_ENV=production
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Note your backend URL: `https://vainapp-backend.onrender.com`

### Option B: Using Render Blueprint (render.json)

1. Push code to GitHub (same as above)
2. In Render dashboard, click "New +" → "Blueprint"
3. Connect repository and select `backend/render.json`
4. Fill in environment variables
5. Deploy

---

## Step 3: Deploy Frontend to Vercel

1. **Update Frontend Environment**
   
   Create `frontend/.env.production`:
   ```env
   VITE_API_URL=https://vainapp-backend.onrender.com
   ```

2. **Deploy to Vercel**

   **Option A: Vercel CLI**
   ```bash
   cd frontend
   npm install -g vercel
   vercel login
   vercel --prod
   ```

   **Option B: Vercel Dashboard**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: Vite
     - **Root Directory**: `frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
   - Add Environment Variable:
     - `VITE_API_URL` = `https://vainapp-backend.onrender.com`
   - Click "Deploy"

3. **Note your frontend URL**: `https://vainapp.vercel.app`

4. **Update Backend CORS**
   
   Go back to Render and update `FRONTEND_URL` environment variable:
   ```
   FRONTEND_URL=https://vainapp.vercel.app
   ```

---

## Step 4: Configure CORS in Backend

Update `backend/src/server.ts` if needed:

```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
```

Redeploy backend after this change.

---

## Step 5: Test Deployment

1. Visit your frontend URL: `https://vainapp.vercel.app`
2. Try signing up a new user
3. Login and generate QR code
4. Check backend logs on Render for any errors

---

## Step 6: Setup Custom Domain (Optional)

### Frontend (Vercel)
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### Backend (Render)
1. Go to Service Settings → Custom Domains
2. Add your API subdomain (e.g., `api.yourdomain.com`)
3. Update DNS records

---

## Environment Variables Summary

### Backend (Render)
```env
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=https://vainapp.vercel.app
NODE_ENV=production
```

### Frontend (Vercel)
```env
VITE_API_URL=https://vainapp-backend.onrender.com
```

---

## Post-Deployment Checklist

- [ ] Backend health check works: `https://your-backend.onrender.com/health`
- [ ] Frontend loads correctly
- [ ] User signup works
- [ ] User login works
- [ ] QR generation works
- [ ] MongoDB connection is stable
- [ ] CORS is properly configured
- [ ] Environment variables are set
- [ ] SSL certificates are active (automatic on both platforms)

---

## Monitoring & Logs

### Render (Backend)
- View logs in Render dashboard
- Set up log drains for production monitoring
- Enable auto-deploy from GitHub

### Vercel (Frontend)
- View deployment logs in Vercel dashboard
- Analytics available on Pro plan
- Automatic deployments on git push

---

## Troubleshooting

### Backend won't start
- Check Render logs for errors
- Verify MongoDB connection string
- Ensure all environment variables are set
- Check Node.js version compatibility

### Frontend can't connect to backend
- Verify `VITE_API_URL` is correct
- Check CORS configuration
- Ensure backend is running
- Check browser console for errors

### MongoDB connection issues
- Verify connection string format
- Check IP whitelist (should include 0.0.0.0/0)
- Verify database user credentials
- Check MongoDB Atlas cluster status

---

## Scaling Considerations

### Free Tier Limitations
- **Render**: Spins down after 15 min of inactivity
- **MongoDB Atlas**: 512MB storage limit
- **Vercel**: 100GB bandwidth/month

### Upgrading
- Render: $7/month for always-on service
- MongoDB Atlas: $9/month for 2GB storage
- Vercel: $20/month for Pro features

---

## Security Best Practices

1. **Never commit `.env` files** - Add to `.gitignore`
2. **Use strong JWT secrets** - Generate with `openssl rand -base64 32`
3. **Enable rate limiting** - Add express-rate-limit
4. **Use HTTPS only** - Both platforms provide SSL automatically
5. **Rotate secrets regularly** - Especially JWT and Stripe keys
6. **Monitor logs** - Set up alerts for errors
7. **Keep dependencies updated** - Run `npm audit` regularly

---

## CI/CD Setup

Both Vercel and Render support automatic deployments:

1. Push to `main` branch → Production deployment
2. Push to `develop` branch → Preview deployment (Vercel)
3. Pull requests → Preview deployments

Configure in respective dashboards.

---

## Alternative Deployment Options

### Backend Alternatives
- **Railway**: Similar to Render, good free tier
- **Fly.io**: Global edge deployment
- **DigitalOcean App Platform**: $5/month
- **AWS Elastic Beanstalk**: More complex, scalable
- **Heroku**: $7/month (no free tier anymore)

### Frontend Alternatives
- **Netlify**: Similar to Vercel
- **Cloudflare Pages**: Free, fast CDN
- **GitHub Pages**: Free for static sites
- **AWS S3 + CloudFront**: More setup required

---

## Next Steps After Deployment

1. Set up monitoring (Sentry, LogRocket)
2. Configure Stripe webhooks with production URL
3. Add analytics (Google Analytics, Plausible)
4. Set up backup strategy for MongoDB
5. Create staging environment
6. Set up status page (status.io)
7. Configure email service (SendGrid, Mailgun)

---

## Support

- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com/

---

## Quick Deploy Commands

```bash
# Frontend
cd frontend
vercel --prod

# Backend (if using Railway CLI)
cd backend
railway up

# Or just push to GitHub and let auto-deploy handle it!
git add .
git commit -m "Deploy to production"
git push origin main
```

---

**Congratulations!** 🎉 Your VainApp is now live in production!
