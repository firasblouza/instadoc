import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useEffect } from "react";

import useLogout from "./hooks/useLogout";

import Layout from "./components/Layout";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import RequireAuth from "./components/RequireAuth";
import PersistLogin from "./components/PersistLogin";
import Dashboard from "./components/Dashboard";

const App = () => {
  const location = useLocation();
  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  const Logout = () => {
    const handleLogout = useLogout();
    const navigate = useNavigate();

    useEffect(() => {
      const performLogout = async () => {
        await handleLogout();
        navigate("/login");
      };

      performLogout();
    }, [handleLogout, navigate]);

    return null; // Render nothing while the logout process is being executed
  };

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="dashboard/*" element={<Dashboard />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />

        <Route element={<RequireAuth />}>
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
        <Route path="logout" element={<Logout />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
