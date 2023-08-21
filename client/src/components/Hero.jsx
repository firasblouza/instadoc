import { doctors } from "../assets";

import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section
      id="hero"
      style={{ backgroundImage: `url(${doctors})` }}
      className="relative w-full h-[400px] lg:h-screen bg-top bg-cover bg-no-repeat flex flex-col justify-center items-center"
    >
      <div className="absolute inset-0 w-full h-auto flex flex-col items-center justify-center bg-gradient-to-r from-cyan-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% opacity-60"></div>

      <div className="hero__info w-full h-full flex flex-col items-center lg:items-start justify-start lg:justify-center mt-20 lg:mt-0 lg:px-28 z-10">
        <h1 className="hero__title text-center text-white text-2xl lg:text-4xl font-bold mb-5">
          Votre bien-être à portée de clic
        </h1>

        <h1 className="hero__title text-white text-2xl lg:text-4xl font-bold mb-8">
          En tout temps, en tout lieu.
        </h1>

        <p className="hero__description text-white w-3/3 px-5 text-lg lg:text-2xl font-normal mb-8 text-center lg:text-left">
          Partout et à tout moment, connectez-vous à des médecins de confiance.
        </p>

        <div className="hero__buttons flex flex-row gap-3">
          <Link to="/signup">
            <button className="hero__button shadow-lg bg-blue-500 rounded py-2 px-4 text-center text-white text-[16px] font-semibold mb-5 hover:bg-blue-400 transition-all duration-500">
              Inscrivez Maintenant
            </button>
          </Link>

          <Link to="/contact">
            <button className="hero__button shadow-lg bg-blue-500 rounded py-2 px-4 text-center text-white text-[16px] font-semibold mb-5 hover:bg-blue-400 transition-all duration-500">
              Contactez nous
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
