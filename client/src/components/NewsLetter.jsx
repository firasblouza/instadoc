import { useState, useEffect, useRef } from "react";
import { Doctor3 } from "../assets";
import { FaEnvelope, FaPaperPlane } from "react-icons/fa";

const NewsLetter = () => {
  const [email, setEmail] = useState("");
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      alert('Veuillez entrer votre adresse email');
      return;
    }
    
    console.log('Newsletter signup:', email);
    alert(`Merci ${email}! Vous êtes maintenant inscrit à notre newsletter. Fonctionnalité backend à implémenter.`);
    setEmail('');
  };

  return (
    <section
      id="newsletter"
      className="section bg-gradient-to-br from-secondary-500 via-secondary-600 to-primary-500 relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-16 right-16 w-40 h-40 rounded-full bg-white animate-float"></div>
        <div className="absolute bottom-16 left-16 w-32 h-32 rounded-full bg-white animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 left-1/4 w-20 h-20 rounded-full bg-white animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div ref={sectionRef} className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className={`space-y-8 text-white ${isVisible ? 'animate-slideInLeft' : 'opacity-0'}`}>
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                <FaEnvelope className="mr-2" />
                Newsletter
              </div>
              <h2 className="heading-2 text-white">
                Vous souhaitez rester{' '}
                <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  informé
                </span>{' '}
                des dernières actualités?
              </h2>
              <p className="body-large text-white/90">
                Inscrivez-vous à notre newsletter pour recevoir régulièrement des mises à jour 
                sur les avancées médicales, les conseils de santé et les dernières tendances 
                dans le domaine de la santé en Tunisie.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <input
                    type="email"
                    placeholder="Votre adresse e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-6 py-4 pl-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300"
                  />
                  <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70" />
                </div>
                <button
                  type="submit"
                  className="btn btn-lg bg-white text-secondary-600 hover:bg-gray-50 hover:scale-105 transform transition-all duration-300 shadow-xl hover:shadow-2xl font-semibold whitespace-nowrap"
                >
                  <FaPaperPlane className="mr-2" />
                  S'inscrire
                </button>
              </div>
              <p className="text-white/70 text-sm">
                En vous inscrivant, vous acceptez de recevoir nos newsletters et nos conditions d'utilisation.
              </p>
            </form>

            <div className="flex items-center gap-8 pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">5000+</div>
                <div className="text-white/80 text-sm">Abonnés</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">Weekly</div>
                <div className="text-white/80 text-sm">Newsletter</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">0</div>
                <div className="text-white/80 text-sm">Spam</div>
              </div>
            </div>
          </div>

          <div className={`relative ${isVisible ? 'animate-slideInRight' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
            <div className="relative">
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/20 rounded-full"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/10 rounded-full"></div>
              <img 
                src={Doctor3} 
                alt="Professionnel de santé" 
                className="relative z-10 w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsLetter;
