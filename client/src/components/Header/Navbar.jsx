import { facebook, github } from "../../assets";
import { Link } from "react-router-dom";

const linkClassName =
  "text-[16px] font-normal whitespace-nowrap text-[#1E1E1E] lg:text-[18px]";

const Navbar = () => {
  return (
    <div className="Navbar w-full h-full flex flex-row items-center justify-between py-3 px-2">
      <div
        id="hamburger-button"
        className="w-10 h-10 bg-blue-400 flex flex-col justify-center items-center relative lg:hidden"
      >
        <div className="absolute  -mt-0.5 h-1 w-7 rounded transition-all duration-500 bg-white before:absolute before:h-1 before:w-7 before:rounded before:-translate-y-2 before:bg-white before:transition-all before:duration-500 before:content-[''] after:h-1 after:w-7  after:translate-y-2 after:rounded after:bg-white after:transition-all after:duration-500 after:content-[''] after:absolute"></div>
      </div>

      <nav className="w-full hidden lg:flex lg:flex-row gap-3 lg:gap-5 justify-between items-center">
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
          <Link to="/login" className={linkClassName}>
            Inscription
          </Link>
        </div>
      </nav>

      <div className="navbar__item w-auto flex lg:flex lg:flex-row gap-3 justify-end items-center">
        <p className="text-[16px] lg:text-[18px] font-light text-[#1E1E1E] whitespace-nowrap">
          Suivi Nous :{" "}
        </p>
        <img className="w-6 h-6 cursor-pointer" src={facebook} alt="facebook" />
        <img className="w-6 h-6 cursor-pointer" src={github} alt="github" />
      </div>
    </div>
  );
};

export default Navbar;
