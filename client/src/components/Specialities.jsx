import { useState } from "react";
import { doctorSpecialties } from "../data/data";

import { doctors_vector } from "../assets";

const Specialities = () => {
  const [selectedTab, setSelectedTab] = useState(doctorSpecialties[0]);
  return (
    <section
      id="specialities"
      className="w-full  flex flex-col bg-white mt-[100px] "
    >
      <h1 className="text-4xl font-bold text-center mb-10 text-[#1E1E1E]">
        Nos Spécialités
      </h1>
      {/* Create Horizontal Tabs with Speciality names and description below   */}
      <div className="tabsContainer w-full flex flex-col items-center gap-5">
        <div className="w-full h-auto flex flex-row items-center justify-center gap-5 md:flex-row flex-wrap px-5">
          {doctorSpecialties.map((speciality, index) => {
            return (
              <div
                key={index}
                className={`h-auto flex flex-col items-center justify-center gap-5 shadow-lg p-2 hover:border-b-2 hover:border-blue-500 rounded-lg cursor-pointer ${
                  selectedTab.value === speciality.value
                    ? "border-b-2 border-blue-500"
                    : ""
                }`}
                onClick={() => setSelectedTab(speciality)}
              >
                <h1 className="text-1xl font-bold text-center">
                  {speciality.name}
                </h1>
              </div>
            );
          })}
        </div>
        {/* Tabs Content */}

        <div className="w-full h-auto flex flex-col items-center justify-center gap-5 md:w-4/5 shadow-blue-300 shadow-2xl rounded-2xl border border-gray-300 p-8">
          <div className="w-full h-auto flex flex-col items-center justify-center md:flex-row gap-5">
            <div className="vectorImage w-1/2 md:w-2/3 md:max-w-[500px] h-auto">
              <img src={doctors_vector} alt="doctors_vector" />
            </div>
            <div className="w-full h-auto flex flex-col px-10 gap-5">
              <h1 className="text-2xl font-bold text-center md:text-left">
                {selectedTab.name}
              </h1>

              <p className="text-1xl font-semi text-center md:text-left">
                {selectedTab.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Specialities;
