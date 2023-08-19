import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import useAuth from "../../hooks/useAuth";
import ManagePatients from "./tabs/admin/ManagePatients";
import Home from "./tabs/admin/Home";
import ManageDoctors from "./tabs/admin/ManageDoctors";

const Dashboard = () => {
  const [selectedTab, setSelectedTab] = useState("home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const { auth } = useAuth();

  const handleTabSelect = (tab) => {
    setSelectedTab(tab);
    setIsSidebarOpen(false);
  };

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <section id="userDashboard" className="relative w-full flex flex-col">
      <div className="flex justify-between items-center bg-sky-400 text-white p-4">
        <button
          className="block md:hidden text-white focus:outline-none"
          onClick={handleSidebarToggle}
        >
          <svg
            className="h-6 w-6 fill-current"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isSidebarOpen ? (
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M19.293 4.293a1 1 0 0 0-1.414-1.414L12 10.586 5.121 3.707a1 1 0 1 0-1.414 1.414L10.586 12l-6.879 6.879a1 1 0 1 0 1.414 1.414L12 13.414l6.879 6.879a1 1 0 1 0 1.414-1.414L13.414 12l6.879-6.879z"
              />
            ) : (
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4 6a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1zm0 5a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1zm0 5a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1z"
              />
            )}
          </svg>
        </button>
        <h1 className="text-xl font-bold">Dashboard</h1>
      </div>
      <div className="dashContainer flex flex-row w-full">
        <Sidebar
          selectedTab={selectedTab}
          onTabSelect={handleTabSelect}
          isOpen={isSidebarOpen}
          role={auth.role}
        />
        <div className="w-full md:w-4/5 p-4 max-h-[calc(100vh-60px)] overflow-y-hidden">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin/patients" element={<ManagePatients />} />
            <Route path="/admin/doctors" element={<ManageDoctors />} />
          </Routes>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
