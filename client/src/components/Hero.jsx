import { doctors } from "../assets";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaPlay, FaShieldAlt, FaClock, FaUserMd } from "react-icons/fa";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section
      id="hero"
      className="relative w-full min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 overflow-hidden"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={doctors} 
          alt="Medical professionals" 
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 gradient-overlay opacity-95"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-16 h-16 bg-white/20 rounded-full animate-float hidden lg:block"></div>
      <div className="absolute top-40 right-20 w-12 h-12 bg-white/15 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-40 left-20 w-20 h-20 bg-white/10 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>

      <div className="container relative z-10 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full py-20">
          
          {/* Content Section */}
          <div className={`space-y-8 ${isVisible ? 'animate-slideInLeft' : 'opacity-0'}`}>
            
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
              <FaShieldAlt className="mr-2" />
              Plateforme médicale certifiée
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="heading-1 text-white leading-tight">
                Votre bien-être à{' '}
                <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  portée de clic
                </span>
              </h1>
              <h2 className="text-xl md:text-2xl text-white/90 font-light">
                En tout temps, en tout lieu.
              </h2>
            </div>

            {/* Description */}
            <p className="body-large text-white/80 max-w-xl">
              Connectez-vous instantanément à des médecins qualifiés et obtenez des consultations médicales de qualité, 
              où que vous soyez et quand vous en avez besoin.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center px-3 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm">
                <FaClock className="mr-2 text-yellow-300" />
                Disponible 24/7
              </div>
              <div className="flex items-center px-3 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm">
                <FaUserMd className="mr-2 text-green-300" />
                Médecins certifiés
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/signup" className="group">
                <button className="btn btn-lg bg-white text-primary-600 hover:bg-gray-50 hover:scale-105 transform transition-all duration-300 shadow-xl hover:shadow-2xl font-semibold w-full sm:w-auto">
                  Commencer maintenant
                  <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </Link>
              
              <Link to="/doctors" className="group">
                <button className="btn btn-lg bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 transition-all duration-300 w-full sm:w-auto">
                  <FaPlay className="mr-2 text-sm" />
                  Voir les médecins
                </button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-6 pt-8 text-white/70 text-sm">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-green-600 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 border-2 border-white"></div>
                </div>
                <span>+1000 patients satisfaits</span>
              </div>
              <div className="hidden sm:block w-px h-6 bg-white/30"></div>
              <div className="hidden sm:flex items-center gap-2">
                <div className="flex text-yellow-300">
                  {'★'.repeat(5)}
                </div>
                <span>4.9/5 étoiles</span>
              </div>
            </div>
          </div>

          {/* Visual Section */}
          <div className={`relative ${isVisible ? 'animate-slideInRight' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
            <div className="relative">
              {/* Main Card */}
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center">
                        <FaUserMd className="text-white text-xl" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">Dr. Tasnim Benslema</h3>
                        <p className="text-white/70 text-sm">Médecin généraliste</p>
                      </div>
                    </div>
                    <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-white/80">
                      <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                      <span className="text-sm">Consultation disponible maintenant</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/80">
                      <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                      <span className="text-sm">Temps d'attente: &lt; 2 min</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/80">
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      <span className="text-sm">Spécialiste certifié</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Stats */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-xl animate-float" style={{ animationDelay: '1.5s' }}>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">24/7</div>
                  <div className="text-xs text-gray-600">Support</div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-xl animate-float" style={{ animationDelay: '2.5s' }}>
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary-600">98%</div>
                  <div className="text-xs text-gray-600">Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg className="relative block w-full h-20" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M1200 0L0 0 598.97 114.72 1200 0z" className="fill-white"></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
