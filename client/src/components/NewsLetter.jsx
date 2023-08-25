import { useState } from "react";

import { Doctor3 } from "../assets";
import Input from "./Input";

const NewsLetter = () => {
  const [email, setEmail] = useState("");

  const inputClassName =
    "border border-grey-300 w-full w-full mb-5 md:mb-0 md:w-4/6 h-8 rounded-full shadow-md  flex justify-around items-center overflow-hidden py-2 px-5 bg-white";

  const newsletterSection = {
    title:
      "Vous souhaitez rester informé des dernières actualités de l'industrie de la santé en Tunisie ?",
    description:
      "Inscrivez-vous à notre newsletter pour recevoir régulièrement des mises à jour sur les avancées médicales, les conseils de santé et les dernières tendances dans le domaine de la santé en Tunisie.",
    buttonText: "S'inscrire",
    placeholder: "Votre adresse e-mail"
  };

  return (
    <section
      id="newsletter"
      className="w-full min-h-[300px] flex flex-col bg-gradient-to-r from-cyan-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% mt-[100px] items-center justify-center"
    >
      <div className="w-full h-full flex flex-col-reverse gap-3 md:flex-row items-center justify-center p-10">
        <div className="flex flex-col  w-full  ">
          <h1 className="text-3xl md:text-4xl font-bold text-white text-center md:text-left ">
            {newsletterSection.title}
          </h1>
          <p className="text-white text-lg mt-4 px-5 text-center md:px-0 md:text-left">
            {newsletterSection.description}
          </p>
          {/* Add the News Letter Field and button */}
          <div className="flex flex-col md:flex-row justify-center items-center md:justify-center w-full mt-10">
            <input
              type="email"
              id="NewsLetter"
              name="NewsLetter"
              placeholder={newsletterSection.placeholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClassName}
            />
            <button className="bg-white w-full md:max-w-[250px] flex-grow text-blue-500 font-bold py-1 px-4 rounded-lg md:ml-4 hover:bg-gray-200">
              {newsletterSection.buttonText}
            </button>
          </div>
        </div>
        <div className="flex flex-col w-full pt-7 md:w-1/2 items-cetner justify-center md:pl-5 z-10">
          <img src={Doctor3} alt="DrLeft" className="w-full md:w-6/6 h-auto " />
        </div>
      </div>
    </section>
  );
};

export default NewsLetter;
