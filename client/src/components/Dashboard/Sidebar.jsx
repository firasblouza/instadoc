import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import getTabs from "./Tabs";

import axios from "../../api/axios";

import useAccessToken from "../../hooks/useAccessToken";

const Sidebar = ({ selectedTab, onTabSelect, isOpen, role }) => {
  const handleTabClick = (tab) => {
    onTabSelect(tab);
  };

  const effectRan = useRef(false);

  const [demandes, setDemandes] = useState(0);

  const activeTab = "bg-gray-700";

  // Function to get pending appointments for both users and doctors

  const getAppointments = async () => {
    const { accessToken, decodedToken } = useAccessToken();
    if (accessToken && accessToken !== "") {
      const id = decodedToken.UserInfo.id;
      const userRole = decodedToken.UserInfo.role;
      const path = userRole === "doctor" ? "doctor" : "user";
      try {
        const response = await axios.get(`/appointments/${path}/${id}`);
        if (response.status === 200) {
          const appointments = response.data;
          const filtered = appointments.filter(
            (appointment) => appointment.status === "pending"
          );
          setDemandes(filtered.length);
        } else {
          setDemandes(0);
        }
      } catch (err) {
        if (err?.response) {
          console.log(err.response.data);
          setDemandes(0);
        }
      }
    }
  };

  // Get appointments on component load

  useEffect(() => {
    if (effectRan.current === false) {
      getAppointments();
    }
    return () => {
      effectRan.current === true;
    };
  }, []);

  const tabs = getTabs(role);

  const updatedTabs = getTabs(role).map((tab) => {
    if (tab.id === "consultations") {
      return {
        ...tab,
        demandes: demandes, // Use the correct property name here
        demandesContent: `"${demandes.toString().replace(/"/g, '\\"')}"`
      };
    }
    return tab;
  });

  return (
    <nav
      className={`absolute md:static w-full origin-top md:w-1/5 bg-gray-800 text-white h-[calc(100vh-60px)] z-20  ${
        isOpen ? "block" : "hidden md:block"
      }`}
    >
      <ul className="flex flex-col w-full h-full">
        {/* <li
          className={`p-4 cursor-pointer hover:bg-gray-700 ${
            selectedTab === "profile" ? "bg-gray-700" : ""
          }`}
          onClick={() => handleTabClick("home")}
        >
          <Link to="/">Home</Link>
        </li> */}
        {updatedTabs.map((tab, index) => (
          <li
            key={tab.id}
            className={`cursor-pointer   hover:bg-gray-700 ${
              selectedTab === tab.id ? activeTab : ""
            } `}
            onClick={() => handleTabClick(tab.id)}
          >
            <Link className="w-full block p-4" to={tab.path}>
              <div className={"relative flex items-center"}>
                {tab.name}
                {tab.id === "consultations" && (
                  <div
                    className={
                      "w-fit px-1 h-6 text-white bg-red-500 ml-2 rounded-sm"
                    }
                  >
                    {tab.demandes}
                  </div>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;
