import { useState } from "react";
import { 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaClock, 
  FaUser, 
  FaPaperPlane,
  FaHeadset,
  FaGlobe,
  FaFacebook,
  FaLinkedin,
  FaGithub
} from "react-icons/fa";
import { btechIcon } from "../assets";
import LoadingButton from "./LoadingButton";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.name || !formData.email || !formData.message) {
      alert('Veuillez remplir tous les champs obligatoires');
      setIsSubmitting(false);
      return;
    }

    try {
      console.log('Contact form submission:', formData);
      alert(`Merci ${formData.name}! Votre message a été envoyé. Nous vous répondrons sous 24h. (Fonctionnalité backend à implémenter)`);
      
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      alert('Erreur lors de l\'envoi du message. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: FaMapMarkerAlt,
      title: "Adresse",
      content: "Cité Ibn Khaldoun, Tunis, Tunisie",
      action: () => window.open('https://maps.google.com/?q=Cité+Ibn+Khaldoun+Tunis', '_blank')
    },
    {
      icon: FaPhone,
      title: "Téléphone",
      content: "+216 21 745 331",
      action: () => window.open('tel:+21621745331', '_self')
    },
    {
      icon: FaEnvelope,
      title: "Email",
      content: "contact@instadoc.com",
      action: () => window.open('mailto:contact@instadoc.com', '_blank')
    },
    {
      icon: FaClock,
      title: "Horaires",
      content: "24/7 - Support disponible",
      action: null
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-16">
        <div className="container">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
              <FaHeadset className="mr-2" />
              Contactez-nous
            </div>
            <h1 className="heading-1 text-white">
              Nous sommes là pour{' '}
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                vous aider
              </span>
            </h1>
            <p className="body-large text-white/90 max-w-3xl mx-auto">
              Une question, un problème technique ou besoin d&apos;assistance ? 
              Notre équipe est disponible pour vous accompagner.
            </p>
            <div className="flex justify-center gap-4 pt-4">
              <div className="text-center">
                <div className="text-3xl font-bold">&lt; 24h</div>
                <div className="text-white/80 text-sm">Temps de Réponse</div>
              </div>
              <div className="w-px bg-white/30"></div>
              <div className="text-center">
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-white/80 text-sm">Support Disponible</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Information */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h2 className="heading-2">
                    Restons en{' '}
                    <span className="bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                      contact
                    </span>
                  </h2>
                  <p className="body-large text-neutral-600">
                    Nous sommes à votre écoute pour toute question concernant nos services, 
                    une assistance technique ou simplement pour échanger sur vos besoins de santé.
                  </p>
                </div>

                {/* Contact Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {contactInfo.map((info, index) => {
                    const IconComponent = info.icon;
                    return (
                      <div
                        key={index}
                        className={`card-hover p-6 ${info.action ? 'cursor-pointer' : ''}`}
                        onClick={info.action}
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center flex-shrink-0">
                            <IconComponent className="text-white text-lg" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-semibold text-neutral-800">{info.title}</h4>
                            <p className="text-neutral-600 text-sm">{info.content}</p>
                            {info.action && (
                              <p className="text-primary-600 text-xs">Cliquer pour {info.title === 'Téléphone' ? 'appeler' : info.title === 'Email' ? 'envoyer un email' : 'voir sur la carte'}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Social Media */}
              <div className="card p-6">
                <h4 className="heading-4 mb-4">Suivez-nous</h4>
                <div className="flex gap-4">
                  {[
                    { icon: FaFacebook, href: "https://www.facebook.com/firas.blouza", color: "hover:text-blue-600" },
                    { icon: FaLinkedin, href: "https://www.linkedin.com/in/firas-blouza-a5a785243/", color: "hover:text-blue-700" },
                    { icon: FaGithub, href: "https://www.github.com/firasblouza", color: "hover:text-gray-800" }
                  ].map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-12 h-12 rounded-xl bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600 ${social.color} transition-all duration-200 hover:scale-110`}
                    >
                      <social.icon className="text-xl" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="card p-6">
                <h4 className="heading-4 mb-4">Notre localisation</h4>
                <div className="bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl p-8 text-center">
                  <FaGlobe className="text-4xl text-primary-500 mx-auto mb-4" />
                  <p className="text-neutral-600 mb-4">Carte interactive</p>
                  <button 
                    onClick={() => window.open('https://maps.google.com/?q=Cité+Ibn+Khaldoun+Tunis', '_blank')}
                    className="btn-primary"
                  >
                    <FaMapMarkerAlt className="mr-2" />
                    Voir sur Google Maps
                  </button>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="space-y-8">
              <div className="card p-8">
                <div className="space-y-6">
                  <div className="text-center space-y-4">
                    <h3 className="heading-3">Envoyez-nous un message</h3>
                    <p className="text-neutral-600">
                      Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
                          <FaUser className="text-primary-500" />
                          Nom complet *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Votre nom complet"
                          required
                          className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
                          <FaEnvelope className="text-primary-500" />
                          Adresse email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="votre@email.com"
                          required
                          className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
                        <FaHeadset className="text-primary-500" />
                        Sujet
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                      >
                        <option value="">Sélectionnez un sujet</option>
                        <option value="question-generale">Question générale</option>
                        <option value="support-technique">Support technique</option>
                        <option value="probleme-compte">Problème de compte</option>
                        <option value="suggestion">Suggestion d'amélioration</option>
                        <option value="partenariat">Partenariat</option>
                        <option value="autre">Autre</option>
                      </select>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
                        <FaPaperPlane className="text-primary-500" />
                        Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows="6"
                        placeholder="Décrivez votre demande en détail..."
                        required
                        className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none transition-all duration-200"
                      />
                      <p className="text-xs text-neutral-500 mt-2">
                        Minimum 10 caractères. Plus votre message est détaillé, mieux nous pourrons vous aider.
                      </p>
                    </div>

                    <LoadingButton
                      type="submit"
                      isLoading={isSubmitting}
                      loadingText="Envoi en cours..."
                      className="btn-primary btn-lg w-full group"
                    >
                      <FaPaperPlane className="mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                      Envoyer le message
                    </LoadingButton>
                  </form>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="card p-6">
                <h4 className="heading-4 mb-4">Questions fréquentes</h4>
                <div className="space-y-3">
                  <div className="border-l-4 border-primary-500 pl-4">
                    <h5 className="font-medium text-neutral-800">Comment réserver une consultation ?</h5>
                    <p className="text-sm text-neutral-600">Rendez-vous sur la page "Médecins", choisissez votre spécialiste et cliquez sur "Demander une consultation".</p>
                  </div>
                  <div className="border-l-4 border-secondary-500 pl-4">
                    <h5 className="font-medium text-neutral-800">Les consultations sont-elles sécurisées ?</h5>
                    <p className="text-sm text-neutral-600">Oui, toutes nos consultations utilisent un chiffrement de bout en bout pour protéger vos données.</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <h5 className="font-medium text-neutral-800">Puis-je annuler un rendez-vous ?</h5>
                    <p className="text-sm text-neutral-600">Vous pouvez annuler ou reporter votre rendez-vous depuis votre dashboard jusqu'à 2h avant l'heure prévue.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* B-Tech Branding Section */}
      <section className="py-8 bg-neutral-100 border-t border-neutral-200">
        <div className="container">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 text-neutral-500">
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
                  className="w-8 h-8 opacity-80 hover:opacity-100 transition-opacity duration-200"
                />
              </a>
            </div>
            <p className="text-xs text-neutral-400 mt-2">
              Développement et maintenance assurés par B-Tech Solutions
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
