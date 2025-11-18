import { DrRight, verified, team } from "../assets";
import { FaHospital, FaShieldAlt, FaUsers } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";

const About = ({ aboutRef }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const features = [
    {
      icon: FaHospital,
      title: "Santé, 24/7",
      description: "Nous nous engageons envers votre santé et votre bien-être, en proposant les dernières avancées en matière de soins complets basés sur des preuves solides.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: FaShieldAlt,
      title: "Confiance Assurée",
      description: "Appréciés par nos utilisateurs pour notre fiabilité et notre engagement envers leur bien-être.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: FaUsers,
      title: "Écoute, Conseil, Soutien",
      description: "Notre équipe est là pour écouter vos préoccupations, vous offrir des conseils avisés et vous soutenir tout au long de votre parcours de santé.",
      color: "from-purple-500 to-purple-600"
    }
  ];

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
      id="about"
      ref={aboutRef}
      className="section bg-gradient-to-b from-neutral-50 to-white relative overflow-hidden"
    >
      <div ref={sectionRef} className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className={`space-y-8 ${isVisible ? 'animate-slideInLeft' : 'opacity-0'}`}>
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-600 rounded-full text-sm font-medium">
                <FaUsers className="mr-2" />
                À Propos de Nous
              </div>
              <h2 className="heading-2">
                Qui Sommes{' '}
                <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                  Nous?
                </span>
              </h2>
              <p className="body-large">
                Chez InstaCure, nous aspirons à améliorer la santé et le bien-être de tous 
                en faisant de la consultation médicale un processus fluide, accessible et fiable.
              </p>
            </div>

            <div className="space-y-6">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div
                    key={index}
                    className={`card-hover bg-white p-6 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center flex-shrink-0`}>
                        <IconComponent className="text-white text-lg" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="heading-4 text-neutral-800">{feature.title}</h3>
                        <p className="body-normal">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={`relative ${isVisible ? 'animate-slideInRight' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary-100 rounded-full opacity-50"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-secondary-100 rounded-full opacity-50"></div>
              <img 
                src={DrRight} 
                alt="Médecin professionnel" 
                className="relative z-10 w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
