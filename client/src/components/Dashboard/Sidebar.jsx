import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import getTabs from "./Tabs";
import useAccessToken from "../../hooks/useAccessToken";
import axios from "../../api/axios";
import { FaChevronLeft } from "react-icons/fa";
import { logo } from "../../assets";
import AuthContext from "../../context/AuthContext";

/* eslint-disable react/prop-types */
const Sidebar = ({ isSidebarOpen, setSidebarOpen }) => {
  const { auth, API_URL } = useContext(AuthContext);
  const location = useLocation();
  const [demandes, setDemandes] = useState(0);
  const { accessToken, decodedToken } = useAccessToken();

  useEffect(() => {
    let isMounted = true;
    
    const getAppointments = async () => {
      // More strict validation
      if (!accessToken || !decodedToken?.UserInfo?.id || !isMounted) {
        return;
      }
      
      const id = decodedToken.UserInfo.id;
      const userRole = decodedToken.UserInfo.role;
      const path = userRole === "doctor" ? "doctor" : "user";
      
      try {
        const response = await axios.get(`/appointments/${path}/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          },
          timeout: 5000 // Add timeout to prevent hanging requests
        });
        
        if (isMounted && response.status === 200) {
          const appointments = response.data;
          const filtered = appointments.filter(
            (appointment) => appointment.status === "pending"
          );
          setDemandes(filtered.length);
        }
      } catch (err) {
        // Only set to 0 if component is still mounted
        if (isMounted) {
          setDemandes(0);
        }
      }
    };

    // Longer delay to ensure token is fully ready
    const timer = setTimeout(() => {
      if (isMounted) {
        getAppointments();
      }
    }, 1000);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [accessToken, decodedToken]);
  
  const tabs = getTabs(auth.role).map((tab) => {
    if (tab.id === "consultations") {
      return { ...tab, notificationCount: demandes };
    }
    return tab;
  });

  const isActive = (path) => {
    if (path === "") return location.pathname === "/dashboard";
    return location.pathname.includes(path);
  };

  return (
    <>
      {/* Backdrop for mobile */}
      <div
        className={`fixed inset-0 bg-black/60 z-40 lg:hidden transition-opacity duration-300 ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-neutral-900 text-white flex flex-col transition-all duration-300 z-50 ${
          isSidebarOpen ? "w-72" : "-translate-x-full w-72 lg:translate-x-0 lg:w-20"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-center p-4 border-b border-neutral-800 h-20">
          {/* Expanded State: Full Logo */}
          <div className={`transition-all duration-300 flex justify-center ${isSidebarOpen ? "w-40 opacity-100" : "w-0 opacity-0"}`}>
            <img src={logo} alt="InstaCure" className="h-12" />
          </div>
          
          {/* Collapsed State: B-Tech Icon */}
          <div className={`transition-all duration-300 ${isSidebarOpen ? "w-0 opacity-0" : "w-12 opacity-100"}`}>
            <img src={logo} alt="B-Tech Solutions" className="w-full" />
          </div>
        </div>
        
        {/* Collapse Button */}
        <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className={`absolute top-6 -right-4 p-2 rounded-full bg-primary-500 hover:bg-primary-600 text-white shadow-lg transition-all duration-300 hidden lg:block z-50 ${
              !isSidebarOpen && "rotate-180"
            }`}
          >
            <FaChevronLeft />
        </button>

        {/* User Profile */}
        <div className="p-4 space-y-3">
          <div className={`flex items-center gap-3 ${!isSidebarOpen && "justify-center"}`}>
            {auth.profileImage ? (
              <img
                src={`${API_URL}/uploads/${auth.profileImage}`}
                alt={auth.fullName}
                className="w-10 h-10 rounded-full object-cover border-2 border-primary-500"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div 
              className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center font-bold text-lg"
              style={{ display: auth.profileImage ? 'none' : 'flex' }}
            >
              {auth.fullName?.charAt(0) || 'U'}
            </div>
            <div className={`${!isSidebarOpen && "hidden"}`}>
              <h4 className="font-semibold">{auth.fullName}</h4>
              <p className="text-xs text-neutral-400 capitalize">{auth.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-2 overflow-y-auto scrollbar-hide">
          {tabs.map((tab) => {
            if (["settings", "logout", "accueil"].includes(tab.id)) return null; // We'll render these at the bottom
            const Icon = tab.icon;
            return (
              <Link
                key={tab.id}
                to={tab.path}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 ${
                  isActive(tab.path)
                    ? "bg-primary-500 text-white shadow-lg"
                    : "text-neutral-300 hover:bg-neutral-800 hover:text-white"
                } ${!isSidebarOpen && "justify-center"}`}
              >
                <Icon className="text-lg flex-shrink-0" />
                <span className={`flex-1 ${!isSidebarOpen && "hidden"}`}>{tab.name}</span>
                {tab.notificationCount > 0 && (
                  <span
                    className={`bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center ${
                      !isSidebarOpen && "absolute top-2 right-2"
                    }`}
                  >
                    {tab.notificationCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Navigation */}
        <div className="px-3 py-4 border-t border-neutral-800 space-y-2">
          {tabs.map((tab) => {
            if (!["settings", "logout", "accueil"].includes(tab.id)) return null;
            const Icon = tab.icon;
            return (
              <Link
                key={tab.id}
                to={tab.path}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 ${
                  isActive(tab.path)
                    ? "bg-neutral-700 text-white"
                    : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                } ${!isSidebarOpen && "justify-center"}`}
              >
                <Icon className="text-lg flex-shrink-0" />
                <span className={`flex-1 ${!isSidebarOpen && "hidden"}`}>{tab.name}</span>
              </Link>
            );
          })}
        </div>  
      </aside>
    </>
  );
};

export default Sidebar;