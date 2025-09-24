const allowedOrigins = [
  // dev
  "http://127.0.0.1:3500","http://localhost:3500",
  "http://127.0.0.1:5500","http://localhost:5500",
  "http://127.0.0.1:3000","http://localhost:3000",
  "http://127.0.0.1:3001","http://localhost:3001",
  "http://127.0.0.1:5173","http://localhost:5173",
  // prod (add these two)
  "https://instadoc.tn",
  "https://www.instadoc.tn",
  // old previews
  "https://instadoc.onrender.com",
  "https://instadocc.netlify.app",
  "https://instadoc-server.vercel.app",
  "https://instadoc.vercel.app"
];
module.exports = allowedOrigins;
