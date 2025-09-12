import { useState, useEffect, useRef } from "react";
import { doctorSpecialties } from "../data/data";
import { doctors_vector } from "../assets";
import { FaStethoscope } from "react-icons/fa";

const Specialities = () => {
  const [selectedTab, setSelectedTab] = useState(doctorSpecialties[0]);
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
      id="specialities"
      className="section bg-gradient-to-b from-white to-neutral-50"
    >
      <div ref={sectionRef} className="container">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-600 rounded-full text-sm font-medium mb-6">
            <FaStethoscope className="mr-2" />
            Nos Spécialités
          </div>
          <h2 className="heading-2 mb-6">
            Nos{' '}
            <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              Spécialités
            </span>
          </h2>
          <p className="body-large text-neutral-600 max-w-3xl mx-auto">
            Découvrez notre large gamme de spécialités médicales avec des professionnels 
            qualifiés prêts à vous accompagner dans vos besoins de santé.
          </p>
        </div>

        <div className="space-y-12">
          {/* Desktop: Flex wrap */}
          <div className="hidden md:flex flex-wrap justify-center gap-3">
            {doctorSpecialties.map((speciality, index) => (
              <button
                key={index}
                onClick={() => setSelectedTab(speciality)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  selectedTab.value === speciality.value
                    ? "bg-primary-500 text-white shadow-lg scale-105"
                    : "bg-white text-neutral-600 hover:bg-primary-50 hover:text-primary-600 shadow-md hover:shadow-lg"
                }`}
              >
                {speciality.name}
              </button>
            ))}
          </div>

          {/* Mobile: Horizontal scroll */}
          <div className="md:hidden">
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
              {doctorSpecialties.map((speciality, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedTab(speciality)}
                  className={`px-6 py-3 rounded-full font-medium whitespace-nowrap flex-shrink-0 snap-center transition-all duration-300 ${
                    selectedTab.value === speciality.value
                      ? "bg-primary-500 text-white shadow-lg scale-105"
                      : "bg-white text-neutral-600 hover:bg-primary-50 hover:text-primary-600 shadow-md"
                  }`}
                >
                  {speciality.name}
                </button>
              ))}
            </div>
            <div className="flex justify-center mt-2">
              <div className="flex gap-1">
                {doctorSpecialties.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      selectedTab.value === doctorSpecialties[index].value
                        ? "bg-primary-500 w-6"
                        : "bg-neutral-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className={`card-hover bg-white p-8 lg:p-12 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-20 h-20 bg-primary-100 rounded-full opacity-50"></div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-secondary-100 rounded-full opacity-50"></div>
                <img 
                  src={doctors_vector} 
                  alt="Équipe médicale spécialisée" 
                  className="relative z-10 w-full h-auto"
                />
              </div>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="heading-2 text-primary-600">
                    {selectedTab.name}
                  </h3>
                  <p className="body-large text-neutral-600 leading-relaxed">
                    {selectedTab.description}
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => window.location.href = '/doctors'}
                    className="btn-primary btn-lg"
                  >
                    Consulter un spécialiste
                  </button>
                  <button 
                    onClick={() => window.location.href = '/contact'}
                    className="btn-secondary btn-lg"
                  >
                    En savoir plus
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-6 border-t border-neutral-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">24/7</div>
                    <div className="text-neutral-500 text-sm">Disponibilité</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-secondary-600">100%</div>
                    <div className="text-neutral-500 text-sm">Certifiés</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Specialities;
