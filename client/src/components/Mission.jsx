import { useEffect, useRef } from "react";

import { DrLeft, DrRight, Doctor3, verified, team } from "../assets";
import { FaHospital, FaCertificate } from "react-icons/fa6";
import { FaHospitalAlt } from "react-icons/fa";

import { Link, useNavigate } from "react-router-dom";

const Mission = () => {
  const effectRan = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (effectRan.current === false) {
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 0);
    }
    return () => {
      effectRan.current = true;
    };
  }, []);

  return (
    <section
      id="mission"
      className="w-full min-h-screen flex flex-col bg-gradient-to-r from-cyan-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% mt-[100px] items-center justify-center"
    >
      <div className="w-full h-full flex flex-col-reverse gap-3 md:flex-row z-20">
        <div className="flex flex-col w-full pt-7 md:w-1/2 items-cetner justify-center md:pl-5 z-10">
          <img src={DrLeft} alt="DrLeft" className="w-full md:w-5/6 h-auto " />
        </div>

        {/* Right Side */}
        <div className="flex flex-col pt-20 w-full md:w-2/5 ">
          <h1 className="text-5xl font-bold text-white text-center md:text-left ">
            Notre Mission
          </h1>
          <p className="text-white text-lg mt-4 px-5 text-center md:px-0 md:text-left">
            Notre mission à InstaDoc est de transformer l'accès aux soins grâce
            à une plateforme en ligne innovante et sûre. Nous visons à connecter
            les patients avec des professionnels de la santé qualifiés pour des
            consultations médicales pratiques et adaptées, améliorant ainsi la
            santé et la qualité de vie de nos utilisateurs.
          </p>
          {/* Add two buttons, consult a doctor and consult laboratories */}
          <div className="flex flex-col gap-5 md:flex-row justify-center items-center md:justify-start mt-10">
            <Link
              to="/doctors"
              className="bg-white text-center w-5/6 text-blue-500 font-bold py-2 px-4 rounded-lg hover:bg-gray-200"
            >
              Consulter un médecin
            </Link>
            <Link
              to="/labs"
              className="bg-white text-center w-5/6 text-blue-500 font-bold py-2 px-4 rounded-lg hover:bg-gray-200"
            >
              Consulter un laboratoire
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mission;
