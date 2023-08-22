import { DrLeft, DrRight, Doctor3, verified, team } from "../assets";

import { FaHospital, FaCertificate } from "react-icons/fa6";
import { FaHospitalAlt } from "react-icons/fa";
const About = ({ aboutRef }) => {
  return (
    <section
      id="about"
      ref={aboutRef}
      className="w-full min-h-screen flex flex-col px-5 bg-white mt-[100px]"
    >
      <div className="w-full h-full flex flex-col gap-5 md:flex-row">
        <div className="flex flex-col pt-20 w-full md:w-3/5 md:pl-20">
          <h1 className="text-5xl font-bold text-gray-800 text-center md:text-left ">
            Qui Sommes Nous?
          </h1>
          <p className="text-gray-600 text-lg mt-4 px-5 md:px-0 text-center md:text-left">
            Chez InstaDoc, nous aspirons à améliorer la santé et le bien-être de
            tous en faisant de la consultation médicale un processus fluide,
            accessible et fiable.
          </p>
          {/* Icons and cards to add some services */}
          <div className="flex flex-col mt-10 shadow-lg py-3 rounded-lg">
            <div className="flex flex-row  gap-6 items-center justify-center">
              <FaHospital className="w-[70px] h-auto text-[#179CF0] mt-2" />
              <div className="flex flex-col w-2/3">
                <p className="text-gray-600 text-lg font-semi mt-4">
                  Santé, 24/24
                </p>
                <p className="text-gray-600 font-light">
                  Nous nous engageons envers votre santé et votre bien-être, en
                  proposant les dernières avancées en matière de soins complets
                  basés sur des preuves solides.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col mt-2 shadow-lg py-3 rounded-lg">
            <div className="flex flex-row  gap-6 items-center justify-center">
              <img
                src={verified}
                className="w-[70px] h-auto text-blue-500 mt-2"
              />
              <div className="flex flex-col w-2/3">
                <p className="text-gray-600 text-lg font-semi mt-4">
                  Confiance Assuré
                </p>
                <p className="text-gray-600 font-light">
                  Appréciés par nos utilisateurs pour notre fiabilité et notre
                  engagement envers leur bien-être.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col mt-2 shadow-lg py-3 rounded-lg">
            <div className="flex flex-row  gap-6 items-center justify-center">
              <img src={team} className="w-[70px] h-auto text-blue-500 mt-2" />
              <div className="flex flex-col w-2/3">
                <p className="text-gray-600 text-lg font-semi mt-4">
                  Écoute, Conseil, Soutien
                </p>
                <p className="text-gray-600 font-light">
                  Notre équipe est là pour écouter vos préoccupations, vous
                  offrir des conseils avisés et vous soutenir tout au long de
                  votre parcours de santé.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full md:w-1/2 justify-center items-center">
          <img src={DrRight} alt="DrLeft" className="w-5/6 h-auto" />
        </div>
      </div>
    </section>
  );
};

export default About;
