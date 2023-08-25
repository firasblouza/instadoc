import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useEffect } from "react";
import jwt_decode from "jwt-decode";

import useLogout from "./hooks/useLogout";

import Layout from "./components/Layout";
import Home from "./components/Home";
import Doctors from "./components/Doctors";
import Login from "./components/Login";
import Signup from "./components/Signup";
import RequireAuth from "./components/RequireAuth";
import Authenticated from "./components/Authenticated";
import Doctor from "./components/Profiles/Doctor";

// Dashboard
import Dashboard from "./components/Dashboard";
import AdminHome from "./components/Dashboard/tabs/admin/AdminHome";
import DoctorHome from "./components/Dashboard/tabs/doctor/DoctorHome";
import Profile from "./components/Dashboard/tabs/Profile";
import ManagePatients from "./components/Dashboard/tabs/admin/ManagePatients";
import ManageDoctors from "./components/Dashboard/tabs/admin/ManageDoctors";
import Settings from "./components/Dashboard/tabs/Settings";
import ManageLabs from "./components/Dashboard/tabs/admin/ManageLabs";
import Labs from "./components/Labs";

// Hooks

import useAccessToken from "./hooks/useAccessToken";

const App = () => {
  const location = useLocation();
  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const decodedToken = accessToken ? jwt_decode(accessToken) : null;

  const Logout = () => {
    const handleLogout = useLogout();
    const navigate = useNavigate();

    useEffect(() => {
      const performLogout = async () => {
        await handleLogout();
      };

      performLogout();
    }, []); // Use an empty dependency array to run the effect only once

    return null; // Render nothing while the logout process is being executed
  };
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
      </Route>
      <Route path="doctors" element={<Layout />}>
        <Route index element={<Doctors />} />
      </Route>

      <Route path="labs" element={<Layout />}>
        <Route index element={<Labs />} />
      </Route>

      {/* Individual Profiles */}
      <Route path="doctor/:doctorId" element={<Layout />}>
        <Route index element={<Doctor />} />
      </Route>

      {accessToken && (
        <Route path="dashboard/*" element={<Dashboard />}>
          {decodedToken.UserInfo.role === "admin" ? (
            <Route index element={<AdminHome />} />
          ) : decodedToken.UserInfo.role === "doctor" ? (
            <Route index element={<DoctorHome />} />
          ) : (
            <Route index element={<AdminHome />} />
          )}
          <Route path="profile" element={<Profile />} />
          <Route path="admin/patients" element={<ManagePatients />} />
          <Route path="admin/doctors" element={<ManageDoctors />} />
          <Route path="admin/labs" element={<ManageLabs />} />

          {/* End Admin Routes */}

          <Route path="settings" element={<Settings />} />
        </Route>
      )}

      {/* Admin Routes */}

      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />

      <Route element={<RequireAuth />}>
        <Route path="dashboard" element={<Dashboard />} />
      </Route>
      <Route path="logout" element={<Logout />} />
    </Routes>
  );
};

export default App;
