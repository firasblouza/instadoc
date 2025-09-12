import { DrLeft } from "../assets";
import { Link } from "react-router-dom";
import { FaUserMd, FaFlask, FaRocket } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";

const Mission = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="mission"
      className="section bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500 relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-white animate-float"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 rounded-full bg-white animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-10 w-16 h-16 rounded-full bg-white animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div ref={sectionRef} className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className={`relative ${isVisible ? 'animate-slideInLeft' : 'opacity-0'}`}>
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-white/20 rounded-full"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full"></div>
              <img 
                src={DrLeft} 
                alt="Équipe médicale" 
                className="relative z-10 w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
          </div>

          <div className={`space-y-8 text-white ${isVisible ? 'animate-slideInRight' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                <FaRocket className="mr-2" />
                Notre Mission
              </div>
              <h2 className="heading-2 text-white">
                Notre{' '}
                <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  Mission
                </span>
              </h2>
              <p className="body-large text-white/90">
                Notre mission à InstaDoc est de transformer l'accès aux soins grâce à une plateforme 
                en ligne innovante et sûre. Nous visons à connecter les patients avec des professionnels 
                de la santé qualifiés pour des consultations médicales pratiques et adaptées, améliorant 
                ainsi la santé et la qualité de vie de nos utilisateurs.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/doctors" className="group">
                <button className="btn btn-lg bg-white text-primary-600 hover:bg-gray-50 hover:scale-105 transform transition-all duration-300 shadow-xl hover:shadow-2xl font-semibold w-full sm:w-auto">
                  <FaUserMd className="mr-2" />
                  Consulter un médecin
                </button>
              </Link>
              
              <Link to="/labs" className="group">
                <button className="btn btn-lg bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 transition-all duration-300 w-full sm:w-auto">
                  <FaFlask className="mr-2" />
                  Consulter un laboratoire
                </button>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">1000+</div>
                <div className="text-white/80 text-sm">Patients Satisfaits</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">50+</div>
                <div className="text-white/80 text-sm">Médecins Certifiés</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mission;
