import { useState, useContext } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { FaBars, FaUserCircle } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import AuthContext from "../../context/AuthContext";
import NotificationBell from "../Notifications/NotificationBell";

const Dashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { auth } = useAuth();
  const { API_URL } = useContext(AuthContext);
  const IMG_URL = `${API_URL}/uploads/`;

  return (
    <div className="flex h-screen bg-neutral-100 overflow-hidden">
      <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <main className={`flex-1 flex flex-col transition-all duration-300 lg:ml-20 ${isSidebarOpen && "lg:ml-72"}`}>
        {/* Top Header */}
        <header className="bg-white shadow-md p-3 sm:p-4 flex items-center justify-between z-30 flex-shrink-0">
          {/* Hamburger Menu for Mobile */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-full hover:bg-neutral-200 active:bg-neutral-300 lg:hidden touch-manipulation"
          >
            <FaBars className="text-neutral-600 text-lg" />
          </button>
          
          {/* Placeholder for left side on desktop to balance the layout */}
          <div className="hidden lg:block w-8"></div>

          <div className="flex items-center gap-2 sm:gap-4">
            <NotificationBell variant="dashboard" />
            <div className="w-px h-6 bg-neutral-300 hidden sm:block"></div>
            <div className="flex items-center gap-2 min-w-0">
              {auth.profileImage ? (
                <img
                  src={`${IMG_URL}${auth.profileImage}`}
                  alt={auth.fullName}
                  className="w-8 h-8 rounded-full object-cover border border-neutral-200 flex-shrink-0"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
              ) : null}
              <FaUserCircle 
                className="text-2xl text-neutral-500 flex-shrink-0" 
                style={{ display: auth.profileImage ? 'none' : 'block' }}
              />
              <div className="min-w-0 hidden sm:block">
                <h4 className="font-semibold text-sm text-neutral-800 truncate">{auth.fullName}</h4>
                <p className="text-xs text-neutral-500 capitalize">{auth.role}</p>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
