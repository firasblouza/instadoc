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
    <div className="flex h-screen bg-neutral-100">
      <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <main className={`flex-1 flex flex-col transition-all duration-300 lg:ml-20 ${isSidebarOpen && "lg:ml-72"}`}>
        {/* Top Header */}
        <header className="bg-white shadow-md p-4 flex items-center justify-between z-30">
          {/* Hamburger Menu for Mobile */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-full hover:bg-neutral-200 lg:hidden"
          >
            <FaBars className="text-neutral-600" />
          </button>
          
          {/* Placeholder for left side on desktop to balance the layout */}
          <div className="hidden lg:block w-8"></div>

          <div className="flex items-center gap-4">
            <NotificationBell variant="dashboard" />
            <div className="w-px h-6 bg-neutral-300"></div>
            <div className="flex items-center gap-2">
              {auth.profileImage ? (
                <img
                  src={`${IMG_URL}${auth.profileImage}`}
                  alt={auth.fullName}
                  className="w-8 h-8 rounded-full object-cover border border-neutral-200"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
              ) : null}
              <FaUserCircle 
                className="text-2xl text-neutral-500" 
                style={{ display: auth.profileImage ? 'none' : 'block' }}
              />
              <div>
                <h4 className="font-semibold text-sm text-neutral-800">{auth.fullName}</h4>
                <p className="text-xs text-neutral-500 capitalize">{auth.role}</p>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
