# Deployment Guide

## 🚀 Deploy to Vercel (Recommended for Next.js)

### Prerequisites
- GitHub account
- Vercel account (free)
- Database hosting (PlanetScale, Railway, or any MySQL provider)

### Steps:
1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/jobseeker-app.git
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set environment variables:
     - `DATABASE_HOST`
     - `DATABASE_USER`
     - `DATABASE_PASSWORD`
     - `DATABASE_NAME`
     - `JWT_SECRET`

3. **Set up Database:**
   - Use PlanetScale (MySQL), Supabase, or Railway for database
   - Import the schema from `backend/database/schema.sql`

---

## 🚂 Deploy to Railway (Full-stack)

### Steps:
1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   railway login
   ```

2. **Deploy:**
   ```bash
   railway project create
   railway up
   ```

3. **Add MySQL service:**
   ```bash
   railway add mysql
   ```

4. **Set environment variables** in Railway dashboard

---

## 🐳 Deploy with Docker

### Steps:
1. **Build the image:**
   ```bash
   docker build -t jobseeker-app .
   ```

2. **Run locally:**
   ```bash
   docker run -p 3000:3000 -p 3001:3001 \
     -e DATABASE_HOST=your-host \
     -e DATABASE_USER=your-user \
     -e DATABASE_PASSWORD=your-password \
     -e DATABASE_NAME=jobseeker_db \
     -e JWT_SECRET=your-secret \
     jobseeker-app
   ```

3. **Deploy to cloud:**
   - Push to Docker Hub
   - Deploy on AWS ECS, Google Cloud Run, or DigitalOcean App Platform

---

## ☁️ Deploy to Netlify + Backend Service

### Frontend (Netlify):
1. Connect GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `.next`

### Backend (Render/Railway):
1. Deploy backend separately on Render or Railway
2. Update frontend API calls to use backend URL

---

## 🔧 Environment Variables Required

```env
DATABASE_HOST=your-database-host
DATABASE_USER=your-database-user
DATABASE_PASSWORD=your-database-password
DATABASE_NAME=jobseeker_db
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=production
```

---

## 📝 Pre-deployment Checklist

- [ ] Database schema imported
- [ ] Environment variables configured
- [ ] Frontend builds successfully (`npm run build`)
- [ ] Backend builds successfully (`cd backend && npm run build`)
- [ ] All API endpoints tested
- [ ] CORS configured for production domain
- [ ] Database connection tested

---

## 🔍 Testing Deployment

After deployment, test these endpoints:
- `GET /api/jobseeker/1/notes` - Should return notes
- `POST /api/jobseeker/1/notes` - Should add new note
- Frontend pages load correctly
- Notes functionality works end-to-end

---

## 🆘 Troubleshooting

### Common Issues:
1. **Database connection failed:**
   - Check environment variables
   - Verify database host accessibility
   - Check firewall/security groups

2. **API routes not working:**
   - Verify Next.js API routes are deployed
   - Check CORS configuration
   - Verify backend service is running

3. **Build failures:**
   - Check TypeScript errors: `npm run build`
   - Verify all dependencies are installed
   - Check Node.js version compatibility
