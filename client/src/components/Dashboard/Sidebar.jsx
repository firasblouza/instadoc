import { Link } from "react-router-dom";
import getTabs from "./Tabs";

const Sidebar = ({ selectedTab, onTabSelect, isOpen, role }) => {
  const handleTabClick = (tab) => {
    onTabSelect(tab);
  };

  const tabs = getTabs(role);

  const activeTab = "bg-gray-700";

  return (
    <nav
      className={`absolute md:static w-full origin-top md:w-1/5 bg-gray-800 text-white h-[calc(100vh-60px)]  ${
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
        {tabs.map((tab, index) => (
          <li
            key={tab.id}
            className={` cursor-pointer   hover:bg-gray-700 ${
              selectedTab === tab.id ? activeTab : ""
            }`}
            onClick={() => handleTabClick(tab.id)}
          >
            <Link className="w-full block p-4" to={tab.path}>
              {tab.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;
