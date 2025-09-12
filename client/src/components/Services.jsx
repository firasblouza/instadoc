import { useState, useEffect, useRef } from "react";
import { FaUserMd, FaClock, FaShieldAlt, FaHeadset, FaArrowRight } from "react-icons/fa";

const Services = () => {
  const [visibleCards, setVisibleCards] = useState([]);
  const sectionRef = useRef(null);

  const services = [
    {
      icon: FaUserMd,
      title: "Consultation Médicale Expert",
      description: "Accédez à des consultations virtuelles avec des médecins hautement qualifiés et expérimentés. Recevez des conseils médicaux adaptés à vos besoins.",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      delay: "0s"
    },
    {
      icon: FaClock,
      title: "Rendez-vous Instantanés",
      description: "Réservez des rendez-vous instantanément, sans attendre dans de longues files d'attente. Obtenez un accès rapide aux soins médicaux quand vous en avez le plus besoin.",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      delay: "0.1s"
    },
    {
      icon: FaShieldAlt,
      title: "Sécurisé et Privé",
      description: "Vos informations de santé sont gardées confidentielles et sécurisées. Nous priorisons la confidentialité des données et vos informations sensibles sont protégées.",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      delay: "0.2s"
    },
    {
      icon: FaHeadset,
      title: "Support Live 24/7",
      description: "Obtenez une assistance immédiate 24h/24. Notre équipe dédiée de professionnels est disponible pour répondre à vos préoccupations et questions.",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      delay: "0.3s"
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('.service-card');
            cards.forEach((card, index) => {
              setTimeout(() => {
                card.classList.add('animate-fadeInUp');
                card.classList.remove('opacity-0');
              }, index * 150);
            });
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
      ref={sectionRef}
      id="services"
      className="section bg-gradient-to-b from-white to-neutral-50 -mt-10 relative z-20"
    >
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-600 rounded-full text-sm font-medium mb-6">
            <FaUserMd className="mr-2" />
            Nos Services
          </div>
          <h2 className="heading-2 mb-6">
            Des soins de santé{' '}
            <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              exceptionnels
            </span>
          </h2>
          <p className="body-large text-neutral-600 max-w-3xl mx-auto">
            Découvrez notre gamme complète de services médicaux conçus pour vous offrir 
            les meilleurs soins, où que vous soyez et quand vous en avez besoin.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div
                key={index}
                className={`service-card opacity-0 group card-hover ${service.bgColor} border-0 cursor-pointer`}
                style={{ animationDelay: service.delay }}
              >
                <div className="card-body text-center space-y-6">
                  {/* Icon */}
                  <div className="relative">
                    <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r ${service.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="text-2xl text-white" />
                    </div>
                    {/* Floating decoration */}
                    <div className={`absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r ${service.color} rounded-full opacity-20 group-hover:scale-125 transition-transform duration-300`}></div>
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <h3 className="heading-4 text-neutral-800 group-hover:text-primary-600 transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="body-normal text-neutral-600 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* Hover Arrow */}
                  <div className="flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className={`flex items-center text-sm font-medium text-transparent bg-gradient-to-r ${service.color} bg-clip-text`}>
                      En savoir plus
                      <FaArrowRight className="ml-2 text-xs group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="body-normal text-neutral-600 mb-6">
            Prêt à commencer votre parcours de santé avec nous ?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => window.location.href = '/signup'}
              className="btn-primary btn-lg group"
            >
              Commencer maintenant
              <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            <button 
              onClick={() => window.location.href = '/doctors'}
              className="btn-secondary btn-lg"
            >
              En savoir plus
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
