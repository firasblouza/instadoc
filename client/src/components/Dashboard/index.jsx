import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { FaBars, FaBell, FaUserCircle } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";

const Dashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { auth } = useAuth();

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
            <button className="p-2 rounded-full hover:bg-neutral-200 relative">
              <FaBell className="text-neutral-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-px h-6 bg-neutral-300"></div>
            <div className="flex items-center gap-2">
              <FaUserCircle className="text-2xl text-neutral-500" />
              <div>
                <h4 className="font-semibold text-sm text-neutral-800">{auth.fullName}</h4>
                <p className="text-xs text-neutral-500">{auth.role}</p>
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
