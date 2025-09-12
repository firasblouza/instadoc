import { logo, doctors } from "../../assets";
import { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUserMd, FaShieldAlt, FaArrowLeft, FaStethoscope, FaClock, FaHeart } from "react-icons/fa";
import AuthContext from "../../context/AuthContext";

const Signup = () => {
  const { stepDisplay, signupMessage, setSignupMessage, step, userData } = useContext(AuthContext);

  useEffect(() => {
    setSignupMessage({ message: "", error: false });
  }, [setSignupMessage]);

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Informations de base";
      case 2:
        return "Sécurité et profil";
      case 3:
        return "Finalisation";
      default:
        return "Créer votre compte";
    }
  };

  const totalSteps = userData.role === "doctor" ? 3 : 2;

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-5">
        <img 
          src={doctors} 
          alt="Medical background" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10">
        {/* Mobile Layout */}
        <div className="lg:hidden min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            {/* Mobile Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-secondary-500 to-primary-500 flex items-center justify-center">
                  <FaUserMd className="text-white text-xl" />
                </div>
                <img src={logo} alt="InstaDoc" className="h-10" />
              </div>
              <h1 className="heading-2 text-neutral-800 mb-2">Créer un compte</h1>
              <p className="text-neutral-600">{getStepTitle()}</p>
              
              {/* Step Indicator */}
              <div className="flex items-center justify-center gap-2 mt-4">
                {[...Array(totalSteps)].map((_, i) => (
                  <div
                    key={i + 1}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      step >= i + 1 ? 'bg-primary-500' : 'bg-neutral-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Mobile Form Card */}
            <div className="card p-6 backdrop-blur-sm bg-white/90">
              {/* Status Message */}
              {signupMessage.message && (
                <div className={`p-4 rounded-xl text-center font-medium mb-6 ${
                  signupMessage.error 
                    ? "bg-red-50 text-red-700 border border-red-200" 
                    : "bg-green-50 text-green-700 border border-green-200"
                }`}>
                  {signupMessage.message}
                </div>
              )}

              {stepDisplay()}

              {/* Login Link */}
              <div className="mt-6 text-center">
                <p className="text-neutral-600 mb-4">Vous avez déjà un compte?</p>
                <Link to="/login" className="btn-secondary w-full">
                  <FaArrowLeft className="mr-2" />
                  Se connecter
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <div className="grid lg:grid-cols-2 min-h-screen">
            {/* Left Side - Promotional Content */}
            <div className="bg-gradient-to-br from-secondary-500 via-secondary-600 to-primary-500 flex items-center justify-center p-12 relative overflow-hidden">
              {/* Background Elements */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-white animate-float"></div>
                <div className="absolute bottom-20 right-20 w-24 h-24 rounded-full bg-white animate-float" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 right-10 w-16 h-16 rounded-full bg-white animate-float" style={{ animationDelay: '2s' }}></div>
              </div>

              <div className="relative z-10 text-white space-y-8 max-w-lg">
                <div className="space-y-5">
                  <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                    <FaStethoscope className="mr-2" />
                    Rejoignez Notre Équipe
                  </div>
                  
                  <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                    Commencez avec{' '}
                    <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                      InstaDoc
                    </span>
                  </h2>
                  
                  <p className="text-xl text-white/90 leading-relaxed">
                    Créez votre compte et accédez à une plateforme médicale moderne et sécurisée.
                  </p>
                </div>

                {/* Benefits Grid 2x2 */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <FaHeart className="text-red-300" />
                    </div>
                    <span className="text-base">Gratuit à Vie</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <FaShieldAlt className="text-green-300" />
                    </div>
                    <span className="text-base">100% Sécurisé</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <FaClock className="text-blue-300" />
                    </div>
                    <span className="text-base">Inscription Rapide</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <FaUserMd className="text-purple-300" />
                    </div>
                    <span className="text-base">Accès Immédiat</span>
                  </div>
                </div>

                {/* Login CTA */}
                <div className="pt-6">
                  <p className="text-white/80 mb-4 text-base">Vous avez déjà un compte?</p>
                  <Link to="/login" className="btn btn-lg bg-white text-secondary-600 hover:bg-gray-50 hover:scale-105 transform transition-all duration-300 shadow-xl hover:shadow-2xl font-semibold w-full">
                    <FaArrowLeft className="mr-2" />
                    Se connecter maintenant
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Side - Signup Form */}
            <div className="bg-white flex items-center justify-center p-10">
              <div className="w-full max-w-md space-y-7">
                {/* Header */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-3 mb-5">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-secondary-500 to-primary-500 flex items-center justify-center">
                      <FaUserMd className="text-white text-lg" />
                    </div>
                    <img src={logo} alt="InstaDoc" className="h-10" />
                  </div>
                  <h1 className="text-3xl font-bold text-neutral-800 mb-2">Inscription</h1>
                  <p className="text-base text-neutral-600">{getStepTitle()}</p>
                  
                  {/* Step Indicator */}
                  <div className="flex items-center justify-center gap-3 mt-6">
                    {[...Array(totalSteps)].map((_, i) => {
                      const stepNum = i + 1;
                      return (
                      <div key={stepNum} className="flex items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                            step >= stepNum 
                              ? 'bg-primary-500 text-white' 
                              : 'bg-neutral-200 text-neutral-500'
                          }`}
                        >
                          {stepNum}
                        </div>
                        {stepNum < totalSteps && (
                          <div className={`w-8 h-1 mx-2 transition-all duration-300 ${
                            step > stepNum ? 'bg-primary-500' : 'bg-neutral-200'
                          }`} />
                        )}
                      </div>
                      )
                    })}
                  </div>
                </div>

                {/* Status Message */}
                {signupMessage.message && (
                  <div className={`p-4 rounded-xl text-center font-medium ${
                    signupMessage.error 
                      ? "bg-red-50 text-red-700 border border-red-200" 
                      : "bg-green-50 text-green-700 border border-green-200"
                  }`}>
                    {signupMessage.message}
                  </div>
                )}

                {/* Form Steps */}
                <div className="space-y-6">
                  {stepDisplay()}
                </div>

                {/* Trust Indicators */}
                <div className="flex items-center justify-center gap-6 text-sm text-neutral-500 pt-4">
                  <div className="flex items-center gap-2">
                    <FaShieldAlt className="text-green-500" />
                    <span>Sécurisé</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaUserMd className="text-primary-500" />
                    <span>Médical</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
