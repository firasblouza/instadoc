import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { FaUserMd, FaBars, FaChevronDown, FaSignOutAlt, FaTachometerAlt } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import useLogout from "../../hooks/useLogout";
import AuthContext from "../../context/AuthContext";
import NotificationContext from "../../context/NotificationContext";
import MobileMenu from "./MobileMenu";
import NotificationBell from "../Notifications/NotificationBell";

const linkClassName = `text-base font-medium text-neutral-700 hover:text-primary-600 transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary-500 after:transition-all after:duration-300 hover:after:w-full`;

const Navbar = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = useLogout();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const { aboutRef, API_URL } = useContext(AuthContext);
  const { unreadCount } = useContext(NotificationContext);
  const IMG_URL = `${API_URL}/uploads/`;

  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/') return 'accueil';
    if (path.startsWith('/doctors')) return 'doctors';
    if (path.startsWith('/medicines')) return 'medicines';
    if (path.startsWith('/labs')) return 'labs';
    if (path.startsWith('/blog')) return 'blog';
    if (path.startsWith('/contact')) return 'contact';
    if (location.hash === '#about') return 'apropos';
    return '';
  };

  const activeTab = getActiveTab();

  const scrollToAbout = () => {
    if (location.pathname !== "/") {
      navigate("/");
    }
  };

  const signOut = async () => {
    await handleLogout();
    navigate("/");
  };

  const navItems = [
    { name: "Accueil", path: "/", key: "accueil" },
    { name: "À propos", href: "#about", key: "apropos", onClick: scrollToAbout },
    { name: "Médecins", path: "/doctors", key: "doctors" },
    { name: "Médicaments", path: "/medicines", key: "medicines" },
    { name: "Laboratoires", path: "/labs", key: "labs" },
    { name: "Blog", path: "/blog", key: "blog" },
    { name: "Contact", path: "/contact", key: "contact" },
  ];

  return (
    <>
      <nav className="bg-white/95 backdrop-blur-sm border-b border-neutral-200 sticky top-0 z-40">
        <div className="container">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <FaUserMd className="text-white text-lg" />
              </div>
              <span className="text-xl font-bold text-neutral-800 hidden sm:block">
                InstaDoc
              </span>
              </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                item.href ? (
                  <a
                    key={item.key}
                    href={item.href}
                    onClick={item.onClick}
                    className={`${linkClassName} ${
                      activeTab === item.key ? "text-primary-600 after:w-full" : ""
                    }`}
                  >
                    {item.name}
                  </a>
                ) : (
              <Link
                    key={item.key}
                    to={item.path}
                    className={`${linkClassName} ${
                      activeTab === item.key ? "text-primary-600 after:w-full" : ""
                    }`}
                  >
                    {item.name}
              </Link>
                )
              ))}
            </div>

            {/* Desktop Auth Section */}
            <div className="hidden lg:flex items-center gap-4">
              {auth?.email && (
                <NotificationBell variant="navbar" />
              )}
              {auth?.email ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center gap-3 px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 transition-colors duration-200"
                  >
                    <div className="relative">
                      {auth.profileImage ? (
                        <img
                          src={`${IMG_URL}${auth.profileImage}`}
                          alt={auth.fullName}
                          className="w-8 h-8 rounded-full object-cover border-2 border-primary-500"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div 
                        className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center"
                        style={{ display: auth.profileImage ? 'none' : 'flex' }}
                      >
                        <span className="text-white text-sm font-medium">
                          {auth.fullName?.charAt(0) || 'U'}
                        </span>
                      </div>
                      {unreadCount > 0 && !location.pathname.startsWith('/dashboard') && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-medium text-neutral-700">
                      {auth.fullName}
                    </span>
                    <FaChevronDown className={`text-neutral-500 text-xs transition-transform duration-200 ${
                      isProfileDropdownOpen ? 'rotate-180' : ''
                    }`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-lg border border-neutral-200 py-2 z-50">
                      <Link
                        to="/dashboard"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-neutral-50 transition-colors duration-200"
                      >
                        <FaTachometerAlt className="text-neutral-500" />
                        <span className="text-sm text-neutral-700">Dashboard</span>
                      </Link>
                      <hr className="my-2 border-neutral-100" />
                      <button
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          signOut();
                        }}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-red-50 transition-colors duration-200 w-full text-left"
                      >
                        <FaSignOutAlt className="text-red-500" />
                        <span className="text-sm text-red-600">Déconnexion</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    to="/login"
                    className="text-sm font-medium text-neutral-700 hover:text-primary-600 transition-colors duration-200"
                  >
                    Connexion
                      </Link>
                      <Link
                    to="/signup"
                    className="btn-primary btn text-sm"
                      >
                    S'inscrire
                      </Link>
                    </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden w-10 h-10 rounded-lg bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors duration-200"
            >
              <FaBars className="text-neutral-600" />
            </button>
          </div>
        </div>

        {/* Click outside to close dropdown */}
        {isProfileDropdownOpen && (
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsProfileDropdownOpen(false)}
          />
          )}
        </nav>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </>
  );
};

export default Navbar;
