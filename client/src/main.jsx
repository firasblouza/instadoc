import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { ToastProvider } from "./components/Notifications/ToastContainer";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <ToastProvider>
            <Routes>
              <Route path="/*" element={<App />} />
            </Routes>
          </ToastProvider>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>
);
