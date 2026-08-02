# 🚀 Jockey - Store Stock Management System: Production Deployment Guide

Your **Jockey Store Stock Management System** is 100% production-ready, fully error-tested, and optimized for deployment.

---

## 🛠️ Recommended Production Setup (100% FREE)

| Component | Platform | Free Tier | Setup Time |
| :--- | :--- | :--- | :--- |
| **Database** | [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) | 512 MB M0 Cluster (Free Forever) | 5 mins |
| **Backend API** | [Render Web Service](https://render.com) | Free Web Service | 5 mins |
| **Frontend UI** | [Vercel](https://vercel.com) / [Render Static Site](https://render.com) | Free Unlimited Hosting | 3 mins |

---

## 📌 Step 1: Set Up MongoDB Atlas (Production Database)

1. Sign up / Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Click **Create a Database** → Choose the **FREE M0 Shared** cluster.
3. Under **Database Access**, create a database user (e.g., username: `jockey_admin`, password: `your_secure_password`).
4. Under **Network Access**, click **Add IP Address** → Choose **Allow Access from Anywhere (`0.0.0.0/0`)**.
5. Click **Connect** → **Drivers** and copy your connection string:
   ```
   mongodb+srv://jockey_admin:<password>@cluster0.xxx.mongodb.net/jockey_stock_db?retryWrites=true&w=majority
   ```

---

## 📌 Step 2: Deploy Backend Server to Render

1. Push your code repository to **GitHub**.
2. Log in to [Render.com](https://render.com) and click **New +** → **Web Service**.
3. Connect your GitHub repository.
4. Set the following fields:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start` (or `node server.js`)
5. Under **Environment Variables**, add:
   - `NODE_ENV` = `production`
   - `PORT` = `5000`
   - `MONGO_URI` = `mongodb+srv://jockey_admin:<password>@cluster0.xxx.mongodb.net/jockey_stock_db?retryWrites=true&w=majority`
6. Click **Create Web Service**. Your backend API URL will be live at:
   `https://jockey-backend.onrender.com`

---

## 📌 Step 3: Deploy Frontend Web App to Vercel

1. Log in to [Vercel.com](https://vercel.com) and click **Add New...** → **Project**.
2. Import your GitHub repository.
3. Set the following fields:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Under **Environment Variables**, add:
   - `VITE_API_URL` = `https://jockey-backend.onrender.com/api` (Replace with your actual Render API URL)
5. Click **Deploy**. Your Jockey Stock Management app will be live with an SSL certificate (`https://your-jockey-app.vercel.app`)!

---

## ⚡ Option 2: Single-Server Deployment (Render / Railway / Heroku)

If you prefer serving both Backend API and Frontend UI from a single Node/Express server:

1. Build frontend assets locally:
   ```powershell
   cd frontend
   npm run build
   ```
2. Set `NODE_ENV=production` on Render/Railway.
3. Express will automatically serve the built static UI from `frontend/dist` on port `5000` with zero CORS issues!

---

## 🛡️ Production Safety & Safeguards Built-In

1. **Negative Stock Prevention**: Database-level atomic `$inc` and `$gte` Mongoose queries prevent race conditions and negative inventory.
2. **INR (`₹`) Currency Formatting**: All calculations, totals, and graph tooltips use `en-IN` formatting.
3. **Free-Size Accessories Mode**: Dedicated handling for non-garment accessories (Belts, Caps, Socks, Wallets).
4. **Clean Data Tables**: Spacing protection (`whitespace-nowrap`) prevents text clipping or overlapping badges.
5. **High-Contrast Print Output**: Dedicated `@media print` CSS for clean purchase order printing.
