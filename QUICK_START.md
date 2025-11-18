# ⚡ InstaDoc Quick Start Guide

## 🛠️ Development Environment

### 1. Install Dependencies
```bash
# Terminal 1 - Server
cd server
npm install

# Terminal 2 - Client  
cd client
npm install
```

### 2. Create Environment Files

**`server/.env`:**
```env
PORT=3001
IO_PORT=3001
DATABASE_URI=mongodb://localhost:27017/instadoc
ACCESS_TOKEN_SECRET=your-dev-access-token-secret
REFRESH_TOKEN_SECRET=your-dev-refresh-token-secret
ALLOWED_ORIGINS=http://localhost:5173
```

**`client/.env` (Optional - defaults work in dev):**
```env
VITE_API_BASE=http://localhost:3001
```

### 3. Start MongoDB
```bash
mongod
# OR if installed as service, it should already be running
```

### 4. Run the Application
```bash
# Terminal 1 - Start Server
cd server
npm start

# Terminal 2 - Start Client
cd client
npm run dev
```

### 5. Access
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3001

---

## 🚀 Production Environment

### 1. Build Client
```bash
cd client
npm run build
```

### 2. Update Environment Variables

**`server/.env`:**
```env
NODE_ENV=production
PORT=3001
IO_PORT=3001
DATABASE_URI=mongodb+srv://user:pass@cluster.mongodb.net/instadoc
ACCESS_TOKEN_SECRET=your-production-secret-min-32-chars
REFRESH_TOKEN_SECRET=your-production-secret-min-32-chars
ALLOWED_ORIGINS=https://yourdomain.com
```

**`client/.env.production`:**
```env
VITE_API_BASE=/api
# OR if API is on different domain:
# VITE_API_BASE=https://api.yourdomain.com/api
```

### 3. Start Production Server

**Option A: Direct Node**
```bash
cd server
NODE_ENV=production node src/server.js
```

**Option B: PM2 (Recommended)**
```bash
npm install -g pm2
cd server
pm2 start src/server.js --name instadoc-server
pm2 save
pm2 startup
```

---

## 📋 Required Environment Variables

| Variable | Dev Example | Production Example |
|----------|-------------|-------------------|
| `PORT` | `3001` | `3001` |
| `DATABASE_URI` | `mongodb://localhost:27017/instadoc` | `mongodb+srv://...` |
| `ACCESS_TOKEN_SECRET` | `dev-secret` | `strong-random-32+chars` |
| `REFRESH_TOKEN_SECRET` | `dev-secret` | `strong-random-32+chars` |
| `ALLOWED_ORIGINS` | `http://localhost:5173` | `https://yourdomain.com` |

---

## ✅ Verification Checklist

- [ ] MongoDB is running
- [ ] Server starts without errors
- [ ] Client builds successfully
- [ ] Environment variables are set
- [ ] Can access frontend in browser
- [ ] API endpoints respond correctly
- [ ] Socket.IO connections work

---

**For detailed setup instructions, see `SETUP_GUIDE.md`**


