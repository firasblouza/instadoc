import { Link } from "react-router-dom";
import { 
  FaUserMd, 
  FaFacebook, 
  FaLinkedin, 
  FaGithub, 
  FaTwitter,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaShieldAlt,
  FaHeart,
  FaArrowUp
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { btechIcon } from "../assets";

const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Accueil", path: "/" },
    { name: "À propos", path: "/#about" },
    { name: "Médecins", path: "/doctors" },
    { name: "Laboratoires", path: "/labs" },
    { name: "Contact", path: "/contact" }
  ];

  const services = [
    { name: "Consultation en ligne", path: "/doctors" },
    { name: "Prise de rendez-vous", path: "/doctors" },
    { name: "Suivi médical", path: "/dashboard" },
    { name: "Téléconsultation", path: "/doctors" },
    { name: "Urgences médicales", path: "/contact" }
  ];

  const legalLinks = [
    { name: "Politique de confidentialité", path: "/privacy" },
    { name: "Conditions d'utilisation", path: "/terms" },
    { name: "Mentions légales", path: "/legal" },
    { name: "FAQ", path: "/faq" }
  ];

  return (
    <>
      <footer className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-primary-500"></div>
          <div className="absolute top-40 right-20 w-24 h-24 rounded-full bg-secondary-500"></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 rounded-full bg-primary-400"></div>
          <div className="absolute bottom-40 right-1/3 w-20 h-20 rounded-full bg-secondary-400"></div>
        </div>

        <div className="container relative z-10">
          {/* Main Footer Content */}
          <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                  <FaUserMd className="text-white text-xl" />
                </div>
                <h3 className="text-2xl font-bold">InstaDoc</h3>
              </div>
              <p className="text-neutral-300 leading-relaxed mb-6">
                Votre plateforme de télémédecine de confiance. Connectez-vous instantanément 
                à des médecins qualifiés pour des consultations de qualité, 24h/24 et 7j/7.
              </p>
              
              {/* Trust Badges */}
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 text-green-400">
                  <FaShieldAlt />
                  <span>Certifié Sécurisé</span>
                </div>
                <div className="flex items-center gap-2 text-blue-400">
                  <FaClock />
                  <span>24/7 Disponible</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Liens Rapides</h4>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link 
                      to={link.path}
                      className="text-neutral-300 hover:text-primary-400 transition-colors duration-200 flex items-center group"
                    >
                      <span className="w-2 h-2 bg-primary-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Nos Services</h4>
              <ul className="space-y-3">
                {services.map((service, index) => (
                  <li key={index}>
                    <Link 
                      to={service.path}
                      className="text-neutral-300 hover:text-secondary-400 transition-colors duration-200 flex items-center group"
                    >
                      <span className="w-2 h-2 bg-secondary-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                      {service.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Contactez-nous</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-primary-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-neutral-300">Cité Ibn Khaldoun</p>
                    <p className="text-neutral-300">Tunis, Tunisie</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <FaPhone className="text-primary-400 flex-shrink-0" />
                  <a 
                    href="tel:+21621745331" 
                    className="text-neutral-300 hover:text-primary-400 transition-colors duration-200"
                  >
                    +216 21 745 331
                  </a>
                </div>
                
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-primary-400 flex-shrink-0" />
                  <a 
                    href="mailto:contact@instadoc.com" 
                    className="text-neutral-300 hover:text-primary-400 transition-colors duration-200"
                  >
                    contact@instadoc.com
                  </a>
                </div>
              </div>

              {/* Social Media */}
              <div className="mt-8">
                <h5 className="font-medium mb-4 text-white">Suivez-nous</h5>
                <div className="flex gap-3">
                  {[
                    { icon: FaFacebook, href: "https://www.facebook.com/firas.blouza", color: "hover:text-blue-400" },
                    { icon: FaLinkedin, href: "https://www.linkedin.com/in/firas-blouza-a5a785243/", color: "hover:text-blue-500" },
                    { icon: FaGithub, href: "https://www.github.com/firasblouza", color: "hover:text-gray-400" },
                    { icon: FaTwitter, href: "#", color: "hover:text-blue-300" },
                    { icon: FaInstagram, href: "#", color: "hover:text-pink-400" }
                  ].map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-400 ${social.color} transition-all duration-200 hover:bg-neutral-700 hover:scale-110`}
                    >
                      <social.icon />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="py-12 border-t border-neutral-700">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h4 className="text-xl font-semibold mb-2">Restez informé</h4>
                <p className="text-neutral-300">
                  Recevez les dernières actualités médicales et conseils santé directement dans votre boîte mail.
                </p>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                const email = e.target.email.value;
                if (!email) {
                  alert('Veuillez entrer votre adresse email');
                  return;
                }
                alert(`Merci ${email}! Inscription newsletter - Fonctionnalité à implémenter.`);
                e.target.reset();
              }} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  name="email"
                  placeholder="Votre adresse email"
                  required
                  className="flex-1 px-4 py-3 rounded-lg bg-neutral-800 border border-neutral-600 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button type="submit" className="btn-primary whitespace-nowrap">
                  S'abonner
                </button>
              </form>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="py-8 border-t border-neutral-700">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
              <div className="flex flex-wrap items-center gap-6 text-sm text-neutral-400">
                <p>&copy; {currentYear} InstaDoc. Tous droits réservés.</p>
                <div className="flex gap-4">
                  {legalLinks.map((link, index) => (
                    <Link
                      key={index}
                      to={link.path}
                      className="hover:text-primary-400 transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-center lg:justify-between gap-6 text-sm text-neutral-400">
                <div className="flex items-center gap-3">
                  <span>Fait avec</span>
                  <FaHeart className="text-red-400 animate-pulse" />
                  <span>en Tunisie</span>
                  <span className="mx-2">•</span>
                  <span>Powered by</span>
                  <a 
                    href="https://facebook.com/btechsolutions.io" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:scale-110 transition-transform duration-200"
                    title="B-Tech Solutions"
                  >
                    <img 
                      src={btechIcon} 
                      alt="B-Tech Solutions" 
                      className="w-7 h-7 opacity-80 hover:opacity-100 transition-opacity duration-200"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50 flex items-center justify-center"
          aria-label="Retour en haut"
        >
          <FaArrowUp />
        </button>
      )}
    </>
  );
};

export default Footer;
