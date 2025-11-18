const allowedOrigins = [
  // dev
  "http://127.0.0.1:3500","http://localhost:3500",
  "http://127.0.0.1:5500","http://localhost:5500",
  "http://127.0.0.1:3000","http://localhost:3000",
  "http://127.0.0.1:3001","http://localhost:3001",
  "http://127.0.0.1:5173","http://localhost:5173",
  // prod (add these two)
  "https://InstaCure.tn",
  "https://www.InstaCure.tn",
  // old previews
  "https://InstaCure.onrender.com",
  "https://InstaCurec.netlify.app",
  "https://InstaCure-server.vercel.app",
  "https://InstaCure.vercel.app"
];
module.exports = allowedOrigins;
