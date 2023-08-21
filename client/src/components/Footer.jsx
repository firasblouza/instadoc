import { logo } from "../assets";

import { Link } from "react-router-dom";

import { FaFacebook, FaLinkedin, FaGithub } from "react-icons/fa";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <section className="Footer w-full h-auto  flex flex-col  justify-around items-center  bg-slate-100">
      <div className="w-full h-auto flex flex-col md:flex-row items-center justify-center md:justify-center gap-5 p-12 ">
        <div className="w-full h-full md:w-3/5 flex flex-col items-center justify-start gap-2 ">
          <img
            src={logo}
            alt="logo"
            className="w-100 max-w-[180px]  p-2 h-auto"
          />
          <p className="text-base  font-semi text-center">
            InstaDoc is a platform that connects patients with doctors and
            clinics in Tunisia. We help you book appointments with ease.
          </p>
        </div>

        <div className="w-full md:w-3/5 h-[200px] flex flex-col items-center justify-center md:items-start md:justify-start gap-5">
          <h1 className="text-2xl font-bold text-center md:text-left">
            Liens Rapides
          </h1>
          <div className="w-full h-auto flex flex-col justify-center items-center md:items-start md:justify-start gap-2">
            <Link to="/" className="text-base font-medium">
              Accueil
            </Link>
            <Link to="/about" className="text-base font-medium">
              A propos
            </Link>
            <Link to="/contact" className="text-base font-medium">
              Contact
            </Link>
            <Link to="/doctors" className="text-base font-medium">
              Consulter un médecin
            </Link>
            <Link to="/labs" className="text-base font-medium">
              Laboratoires
            </Link>
          </div>
        </div>

        <div className="w-full md:w-3/5 h-[200px] flex flex-col items-center justify-center md:items-start md:justify-start gap-5">
          <h1 className="text-2xl font-bold text-center md:text-left">
            Contactez Nous
          </h1>

          <div className="w-full h-auto flex flex-col justify-center items-center md:items-start md:justify-start gap-2">
            <div className="flex flex-col md:flex-row text-center gap-1">
              <p className="text-base font-medium">
                <span className="font-bold">Address:</span>
                <span> Cité Ibn Khaldoun, Tunis</span>
              </p>
            </div>

            <p className="text-base font-medium">
              <span className="font-bold">Phone:</span>
              <span> +216 21 745 331</span>
            </p>

            <p className="text-base font-medium">
              <span className="font-bold">Email:</span>
              <span>
                {" "}
                <a href="mailto:firas.blouza1@gmail.com">
                  <span className="underline text-blue-500">InstaDoc</span>
                </a>
              </span>
            </p>

            <p className="text-base font-medium">
              <span className="font-bold">Github: </span>
              <span>
                {" "}
                <a href="https://github.com/firasblouza">
                  <span className="underline text-blue-500">InstaDoc</span>
                </a>
              </span>
            </p>
          </div>
        </div>

        <div className="w-full md:w-3/5 h-[200px] flex flex-col items-center justify-center md:items-start md:justify-start gap-5 ">
          <h1 className="text-2xl font-bold text-center md:text-left">
            Social Media
          </h1>
          <div className="w-full h-auto flex flex-row items-center justify-center md:items-start md:justify-start gap-5">
            <a href="https://www.facebook.com/firas.blouza">
              <FaFacebook className="text-4xl text-blue-500"></FaFacebook>
            </a>
            <a href="https://www.linkedin.com/in/firas-blouza-a5a785243/">
              <FaLinkedin className="text-4xl text-blue-800"></FaLinkedin>
            </a>
            <a href="https://www.github.com/firasblouza">
              <FaGithub className="text-4xl text-black-500"></FaGithub>
            </a>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-1 md:flex-row md:justify-between justify-center items-center h-auto w-full px-10  border-t border-black py-2">
        <p className="text-left text-base font-normal">
          &copy; {new Date().getFullYear()} InstaDoc. All rights reserved.
        </p>
        <p className="text-left text-base font-normal">
          Made with ❤️ {/* by Firas Blouza */}
        </p>
      </div>
    </section>
  );
};

export default Footer;
