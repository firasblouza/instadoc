import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { FaTimes, FaHome, FaUserMd, FaFlask, FaEnvelope, FaSignInAlt, FaTachometerAlt, FaSignOutAlt, FaPills, FaFileAlt } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import useLogout from "../../hooks/useLogout";
import AuthContext from "../../context/AuthContext";
import NotificationContext from "../../context/NotificationContext";

const MobileMenu = ({ isOpen, onClose }) => {
  const { auth } = useAuth();
  const handleLogout = useLogout();
  const { API_URL } = useContext(AuthContext);
  const { unreadCount } = useContext(NotificationContext);
  const IMG_URL = `${API_URL}/uploads/`;

  const menuItems = [
    { name: "Accueil", path: "/", icon: FaHome },
    { name: "Médecins", path: "/doctors", icon: FaUserMd },
    { name: "Médicaments", path: "/medicines", icon: FaPills },
    { name: "Laboratoires", path: "/labs", icon: FaFlask },
    { name: "Blog", path: "/blog", icon: FaFileAlt },
    { name: "Contact", path: "/contact", icon: FaEnvelope },
  ];

  const authItems = auth?.email 
    ? [
        { name: "Dashboard", path: "/dashboard", icon: FaTachometerAlt },
        { name: "Déconnexion", path: "/logout", icon: FaSignOutAlt, onClick: handleLogout },
      ]
    : [
        { name: "Connexion", path: "/login", icon: FaSignInAlt },
      ];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
              <FaUserMd className="text-white text-sm" />
            </div>
            <span className="font-semibold text-gray-900">InstaDoc</span>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
          >
            <FaTimes className="text-gray-600" />
          </button>
        </div>

        {/* User Info */}
        {auth?.email && (
          <div className="p-6 bg-gradient-to-r from-primary-50 to-secondary-50 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="relative">
                {auth.profileImage ? (
                  <img
                    src={`${IMG_URL}${auth.profileImage}`}
                    alt={auth.fullName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-primary-500"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center"
                  style={{ display: auth.profileImage ? 'none' : 'flex' }}
                >
                  <span className="text-white font-medium text-lg">
                    {auth.fullName?.charAt(0) || 'U'}
                  </span>
                </div>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{auth.fullName}</p>
                <p className="text-sm text-gray-600">{auth.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 py-6">
          <div className="space-y-2 px-6">
            {menuItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={index}
                  to={item.path}
                  onClick={onClose}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-all duration-200 group"
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    <IconComponent className="text-current group-hover:scale-110 transition-transform duration-200" />
                  </div>
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Divider */}
          <div className="my-6 mx-6 border-t border-gray-200" />

          {/* Auth Items */}
          <div className="space-y-2 px-6">
            {authItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={index}
                  to={item.path}
                  onClick={(e) => {
                    if (item.onClick) {
                      e.preventDefault();
                      item.onClick();
                    }
                    onClose();
                  }}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    item.name === "Déconnexion"
                      ? "text-red-600 hover:bg-red-50"
                      : "text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                  }`}
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    <IconComponent className="text-current group-hover:scale-110 transition-transform duration-200" />
                  </div>
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">
              Votre santé, notre priorité
            </p>
            <div className="flex justify-center gap-4">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                Service actif
              </div>
              <div className="text-xs text-gray-400">24/7 Support</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;




