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

// Dashboard
import Dashboard from "./components/Dashboard";
import AdminHome from "./components/Dashboard/tabs/admin/AdminHome";
import Profile from "./components/Dashboard/tabs/Profile";
import ManagePatients from "./components/Dashboard/tabs/admin/ManagePatients";
import ManageDoctors from "./components/Dashboard/tabs/admin/ManageDoctors";

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
        <Route path="dashboard/*" element={<Dashboard />}>
          <Route index element={<AdminHome />} />
          <Route path="profile" element={<Profile />} />
          <Route path="admin/patients" element={<ManagePatients />} />
          <Route path="admin/doctors" element={<ManageDoctors />} />
        </Route>
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
