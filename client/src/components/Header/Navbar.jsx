import { facebook, github } from "../../assets";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { FaPowerOff } from "react-icons/fa6";
import useAuth from "../../hooks/useAuth";
import useLogout from "../../hooks/useLogout";
import { useNavigate } from "react-router-dom";

const linkClassName =
  "text-[16px] font-normal whitespace-nowrap text-[#1E1E1E] lg:text-[18px]";

const mobileLinkClassName =
  "w-full py-6 text-center hover:opacity-90 text-2xl text-white";

const Navbar = () => {
  const { auth } = useAuth();

  const navigate = useNavigate();

  const handleLogout = useLogout();

  const signOut = async () => {
    await handleLogout();
    navigate("/");
  };

  const mobileMenu = useRef(null);
  const profileDropdown = useRef(null);

  const toggleMobileMenu = (e) => {
    const hamburgerButton = e.target;
    const mobileMenuRef = mobileMenu.current;
    mobileMenuRef.classList.toggle("hidden");
    mobileMenuRef.classList.toggle("flex");
  };

  const toggleProfileDropdown = () => {
    const profileDropdownRef = profileDropdown.current;
    profileDropdownRef.classList.toggle("hidden");
  };

  return (
    <>
      <section className="Navbar w-full h-full flex flex-row items-center justify-between py-3 px-2">
        <div className="flex justify-between w-full">
          <button
            id="hamburger-button"
            className="w-10 h-10 bg-blue-400 flex flex-col justify-center items-center relative lg:hidden cursor-pointer"
            onClick={(e) => toggleMobileMenu(e)}
          >
            <div className="absolute  -mt-0.5 h-1 w-8 rounded bg-white transition-all duration-500 before:absolute before:h-1 before:w-8 before:-translate-x-4 before:-translate-y-2 before:rounded before:bg-white before:transition-all before:duration-500 before:content-[''] after:absolute after:h-1 after:w-8 after:-translate-x-4 after:translate-y-2 after:rounded after:bg-white after:transition-all after:duration-500 after:content-['']"></div>
          </button>

          <nav
            className="w-full hidden lg:flex lg:flex-row gap-3 lg:gap-5 lg:justify-between items-center"
            aria-label="main"
          >
            <div className="navbar__item hidden lg:flex lg:flex-row gap-1 lg:gap-5 justify-start items-center">
              <Link to="/" className={`${linkClassName} mr-2`}>
                Acceuil
              </Link>
              <Link to="/about" className={`${linkClassName} mr-2`}>
                A propos
              </Link>
              <Link to="/services" className={`${linkClassName} mr-2`}>
                Services
              </Link>
              <Link to="/contact" className={`${linkClassName} mr-2`}>
                Contact
              </Link>
            </div>

            <div className="navbar__item w-auto flex lg:flex lg:flex-row gap-3 justify-end items-center">
              {auth?.email ? (
                // Create Dropdown Menu for the dashboard
                <div className="relative">
                  <p
                    className={`${linkClassName} cursor-pointer`}
                    onClick={toggleProfileDropdown}
                  >
                    <FaPowerOff className="inline-block mr-2" />
                    {auth.fullName}
                  </p>
                  <div
                    id="profie_dropdown"
                    ref={profileDropdown}
                    className="absolute top-10 left-0 h-full bg-white z-30 hidden "
                  >
                    <div className="bg-white w-full shadow-lg rounded-lg  p-2">
                      <Link
                        to="/dashboard"
                        className="block py-2 px-4 hover:bg-gray-100 w-full cursor-pointer"
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/logout"
                        onClick={signOut}
                        className="block py-2 px-4 hover:bg-gray-100 cursor-pointer"
                      >
                        Logout
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <Link to="/login" className={linkClassName}>
                  Connexion / Inscription
                </Link>
              )}
            </div>
          </nav>
        </div>
      </section>
      <section
        id="mobile-menu"
        ref={mobileMenu}
        onClick={(e) => toggleMobileMenu(e)}
        className="absolute w-full h-full bg-sky-300 origin-top  flex-col top-0 z-30 animate-open-menu hidden"
      >
        <button className="text-8xl self-end px-6 text-white">&times;</button>
        <nav
          className="flex min-h-screen flex-col items-center py-8"
          aria-label="mobile"
        >
          <Link to="/" className={`${mobileLinkClassName} mr-2`}>
            Acceuil
          </Link>
          <Link to="/about" className={`${mobileLinkClassName} mr-2`}>
            A propos
          </Link>
          <Link to="/services" className={`${mobileLinkClassName} mr-2`}>
            Services
          </Link>
          <Link to="/contact" className={`${mobileLinkClassName} mr-2`}>
            Contact
          </Link>
          <Link to="/login" className={mobileLinkClassName}>
            Inscription
          </Link>
        </nav>
      </section>
    </>
  );
};

export default Navbar;
