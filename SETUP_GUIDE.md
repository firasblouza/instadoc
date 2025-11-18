# 🚀 InstaCure Setup Guide

Complete guide for running InstaCure in **Development** and **Production** environments.

---

## 📋 Prerequisites

Before starting, ensure you have:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB** database (local or cloud like MongoDB Atlas)
- **Git** (optional, for cloning)

---

## 🔧 Development Environment

### Step 1: Install Dependencies

Open **two separate terminal windows/tabs**:

#### Terminal 1 - Server:
```bash
cd server
npm install
```

#### Terminal 2 - Client:
```bash
cd client
npm install
```

### Step 2: Configure Environment Variables

#### Server Environment Variables

Create a `.env` file in the `server/` directory:

```bash
# server/.env

# Server Configuration
PORT=3001
IO_PORT=3001

# Database
DATABASE_URI=mongodb://localhost:27017/InstaCure
# OR for MongoDB Atlas:
# DATABASE_URI=mongodb+srv://username:password@cluster.mongodb.net/InstaCure?retryWrites=true&w=majority

# JWT Secrets (Generate strong random strings)
ACCESS_TOKEN_SECRET=your-super-secret-access-token-key-change-this-in-production
REFRESH_TOKEN_SECRET=your-super-secret-refresh-token-key-change-this-in-production

# CORS Origins (comma-separated)
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

#### Client Environment Variables (Optional)

Create a `.env` file in the `client/` directory (only if you need to override defaults):

```bash
# client/.env

# API Base URL (defaults to http://localhost:3001 in dev)
VITE_API_BASE=http://localhost:3001
```

**Note:** The client automatically uses `http://localhost:3001` in development mode, so this file is optional.

### Step 3: Start MongoDB

Make sure MongoDB is running:

```bash
# If MongoDB is installed locally:
mongod

# OR if using MongoDB as a service:
# Windows: net start MongoDB
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### Step 4: Start the Application

#### Terminal 1 - Start Server:
```bash
cd server
npm start
```

You should see:
```
✅ Database connected successfully
✅ Server running on port 3001
```

#### Terminal 2 - Start Client:
```bash
cd client
npm run dev
```

You should see:
```
VITE v4.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Step 5: Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001
- **Socket.IO:** http://localhost:3001 (WebSocket)

---

## 🚀 Production Environment

### Step 1: Build the Client

```bash
cd client
npm run build
```

This creates a `client/dist/` folder with optimized production files.

### Step 2: Configure Production Environment Variables

#### Server Production Environment Variables

Create a `.env` file in the `server/` directory with production values:

```bash
# server/.env

# Server Configuration
PORT=3001
IO_PORT=3001

# Database (Use production MongoDB URI)
DATABASE_URI=mongodb+srv://username:password@cluster.mongodb.net/InstaCure?retryWrites=true&w=majority

# JWT Secrets (MUST be different from development!)
ACCESS_TOKEN_SECRET=your-production-access-token-secret-min-32-characters
REFRESH_TOKEN_SECRET=your-production-refresh-token-secret-min-32-characters

# CORS Origins (Your production domain)
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

#### Client Production Environment Variables

Create a `.env.production` file in the `client/` directory:

```bash
# client/.env.production

# API Base URL (Your production API URL)
VITE_API_BASE=https://api.yourdomain.com/api
# OR if API is on same domain:
# VITE_API_BASE=/api
```

### Step 3: Update Server to Serve Static Files

The server needs to serve the built client files. Update `server/src/server.js` to include:

```javascript
// Add this after app.use(cors(corsOptions))
const path = require('path');

// Serve static files from React app
app.use(express.static(path.join(__dirname, '../../client/dist')));

// API routes
app.use('/api/auth', require('./api/routes/auth'));
// ... other routes

// Catch all handler: send back React's index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});
```

### Step 4: Start Production Server

#### Option A: Using Node.js directly

```bash
cd server
NODE_ENV=production node src/server.js
```

#### Option B: Using PM2 (Recommended for production)

Install PM2 globally:
```bash
npm install -g pm2
```

Start with PM2:
```bash
cd server
pm2 start src/server.js --name InstaCure-server
```

PM2 Commands:
```bash
pm2 list              # View running processes
pm2 logs InstaCure-server  # View logs
pm2 restart InstaCure-server  # Restart
pm2 stop InstaCure-server     # Stop
pm2 delete InstaCure-server   # Remove
```

#### Option C: Using Docker (Advanced)

Create `Dockerfile` in root:
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy server files
COPY server/package*.json ./server/
RUN cd server && npm install --production

# Copy client build
COPY client/dist ./client/dist

# Copy server source
COPY server/src ./server/src

WORKDIR /app/server

EXPOSE 3001

CMD ["node", "src/server.js"]
```

Build and run:
```bash
docker build -t InstaCure .
docker run -p 3001:3001 --env-file server/.env InstaCure
```

---

## 🔐 Security Checklist for Production

- [ ] Change all JWT secrets to strong, random strings (min 32 characters)
- [ ] Use HTTPS (SSL/TLS certificate)
- [ ] Update `ALLOWED_ORIGINS` to your production domain only
- [ ] Use environment variables, never hardcode secrets
- [ ] Enable MongoDB authentication
- [ ] Use MongoDB Atlas or secure your MongoDB instance
- [ ] Set up proper firewall rules
- [ ] Enable rate limiting (consider adding `express-rate-limit`)
- [ ] Regular security updates for dependencies
- [ ] Set up proper logging and monitoring

---

## 📝 Environment Variables Summary

### Server Required Variables:
| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server HTTP port | `3001` |
| `IO_PORT` | Socket.IO port | `3001` |
| `DATABASE_URI` | MongoDB connection string | `mongodb://localhost:27017/InstaCure` |
| `ACCESS_TOKEN_SECRET` | JWT access token secret | `your-secret-key` |
| `REFRESH_TOKEN_SECRET` | JWT refresh token secret | `your-secret-key` |
| `ALLOWED_ORIGINS` | CORS allowed origins | `http://localhost:5173` |

### Client Optional Variables:
| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE` | API base URL | `http://localhost:3001` (dev) or `/api` (prod) |

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find process using port 3001
# Windows:
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:3001 | xargs kill -9
```

### MongoDB Connection Error
- Check if MongoDB is running
- Verify `DATABASE_URI` is correct
- Check MongoDB authentication credentials

### CORS Errors
- Verify `ALLOWED_ORIGINS` includes your frontend URL
- Check server CORS configuration

### Socket.IO Connection Issues
- Ensure `IO_PORT` matches server port
- Check firewall settings
- Verify WebSocket support on hosting provider

---

## 📦 Deployment Options

### Vercel (Frontend) + Railway/Render (Backend)
- Deploy client to Vercel
- Deploy server to Railway or Render
- Update `VITE_API_BASE` to backend URL

### Heroku
- Use Heroku buildpacks for Node.js
- Set environment variables in Heroku dashboard
- Deploy both client and server

### DigitalOcean / AWS / Azure
- Use App Platform / Elastic Beanstalk / App Service
- Configure environment variables
- Set up MongoDB Atlas or managed database

---

## ✅ Quick Start Commands

### Development:
```bash
# Terminal 1
cd server && npm install && npm start

# Terminal 2
cd client && npm install && npm run dev
```

### Production:
```bash
# Build client
cd client && npm run build

# Start server
cd server && NODE_ENV=production node src/server.js
```

---

## 📞 Need Help?

If you encounter issues:
1. Check console logs for errors
2. Verify all environment variables are set
3. Ensure MongoDB is running and accessible
4. Check network/firewall settings
5. Review the troubleshooting section above

---

**Last Updated:** 2024



