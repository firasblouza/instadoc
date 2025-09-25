import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { logo, doctors } from "../assets";
import { 
  FaUser, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaShieldAlt,
  FaArrowRight
} from "react-icons/fa";

import AuthContext from "../context/AuthContext";
import LoadingButton from "./LoadingButton";

const Login = () => {
  const {
    loginMessage,
    setLoginMessage,
    loginData,
    setLoginData,
    handleUserLogin
  } = useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setLoginMessage({ message: "", error: false });
  }, [setLoginMessage]);

  const handleSubmit = async (e) => {
    setIsLoading(true);
    try {
      await handleUserLogin(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
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
            {/* Mobile Logo & Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-6">
                <img src={logo} alt="InstaDoc" className="h-16" />
              </div>
              <h1 className="heading-2 text-neutral-800 mb-2">Bienvenue</h1>
              <p className="text-neutral-600">Connectez-vous à votre compte</p>
            </div>

            {/* Mobile Login Card */}
            <div className="card p-8 backdrop-blur-sm bg-white/90">
              {/* Status Message */}
              {loginMessage.message && (
                <div className={`p-4 rounded-xl text-center font-medium mb-6 ${
                  loginMessage.error 
                    ? "bg-red-50 text-red-700 border border-red-200" 
                    : "bg-green-50 text-green-700 border border-green-200"
                }`}>
                  {loginMessage.message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
                    <FaUser className="text-primary-500" />
                    Adresse email
                  </label>
                  <input
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    placeholder="votre@email.com"
                    required
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
                    <FaLock className="text-primary-500" />
                    Mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      placeholder="Entrez votre mot de passe"
                      required
                      className="w-full px-4 py-3 pr-12 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-neutral-700 transition-colors duration-200"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-neutral-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={loginData.rememberMe}
                      onChange={(e) => setLoginData({ ...loginData, rememberMe: e.target.checked })}
                      className="w-4 h-4 text-primary-500 border-neutral-300 rounded focus:ring-primary-500 focus:ring-2"
                    />
                    Se souvenir de moi
                  </label>
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-primary-600 hover:text-primary-700 transition-colors duration-200"
                  >
                    Mot de passe oublié?
                  </Link>
                </div>

                {/* Submit Button */}
                <LoadingButton
                  type="submit"
                  isLoading={isLoading}
                  loadingText="Connexion..."
                  className="btn-primary btn-lg w-full group"
                >
                  <span>Se connecter</span>
                  <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </LoadingButton>
              </form>

              {/* Sign Up Link */}
              <div className="mt-8 text-center">
                <p className="text-neutral-600 mb-4">Vous n&apos;avez pas de compte?</p>
                <Link to="/signup" className="btn-secondary btn-lg w-full group">
                  <FaUser className="mr-2" />
                  Créer un compte
                  <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 text-center">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-sm text-neutral-500">
                <div className="flex items-center gap-2">
                  <FaShieldAlt className="text-green-500" />
                  <span>Connexion sécurisée</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaUser className="text-primary-500" />
                  <span>Plateforme médicale</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <div className="grid lg:grid-cols-2 min-h-screen">
              {/* Left Side - Promotional Content */}
              <div className="bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500 flex items-center justify-center p-12 relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-white animate-float"></div>
                  <div className="absolute bottom-20 right-20 w-24 h-24 rounded-full bg-white animate-float" style={{ animationDelay: '1s' }}></div>
                  <div className="absolute top-1/2 right-10 w-16 h-16 rounded-full bg-white animate-float" style={{ animationDelay: '2s' }}></div>
                </div>

                <div className="relative z-10 text-white space-y-8 max-w-lg">
                  <div className="space-y-5">
                    <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                      <FaUser className="mr-2" />
                      Plateforme Médicale
                    </div>
                    
                    <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                      Rejoignez{' '}
                      <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                        InstaDoc
                      </span>
                    </h2>
                    
                    <p className="text-xl text-white/90 leading-relaxed">
                      Accédez à des consultations médicales de qualité avec des professionnels certifiés.
                    </p>
                  </div>

                  {/* Features Grid 2x2 */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                        <FaShieldAlt className="text-green-300" />
                      </div>
                      <span className="text-base">Sécurisé & Privé</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                        <FaUser className="text-blue-300" />
                      </div>
                      <span className="text-base">Médecins Certifiés</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                        <FaArrowRight className="text-purple-300" />
                      </div>
                      <span className="text-base">Disponible 24/7</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                        <FaLock className="text-yellow-300" />
                      </div>
                      <span className="text-base">HIPAA Compliant</span>
                    </div>
                  </div>

                  {/* New Account CTA */}
                  <div className="pt-6">
                    <p className="text-white/80 mb-4 text-base">Vous n&apos;avez pas encore de compte?</p>
                    <Link to="/signup" className="btn btn-lg bg-white text-primary-600 hover:bg-gray-50 hover:scale-105 transform transition-all duration-300 shadow-xl hover:shadow-2xl font-semibold w-full">
                      <FaUser className="mr-2" />
                      Créer un compte gratuitement
                      <FaArrowRight className="ml-2" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right Side - Login Form */}
              <div className="bg-white flex items-center justify-center p-10">
                <div className="w-full max-w-md space-y-7">
                  {/* Header */}
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-3 mb-5">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                        <FaUser className="text-white text-lg" />
                      </div>
                      <img src={logo} alt="InstaDoc" className="h-10" />
                    </div>
                    <h1 className="text-3xl font-bold text-neutral-800 mb-2">Connexion</h1>
                    <p className="text-base text-neutral-600">Accédez à votre espace personnel</p>
                  </div>

                  {/* Status Message */}
                  {loginMessage.message && (
                    <div className={`p-3 rounded-xl text-center text-sm font-medium ${
                      loginMessage.error 
                        ? "bg-red-50 text-red-700 border border-red-200" 
                        : "bg-green-50 text-green-700 border border-green-200"
                    }`}>
                      {loginMessage.message}
                    </div>
                  )}

                  {/* Login Form */}
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email Field */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
                        <FaUser className="text-primary-500" />
                        Adresse email
                      </label>
                      <input
                        type="email"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        placeholder="votre@email.com"
                        required
                        className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    {/* Password Field */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
                        <FaLock className="text-primary-500" />
                        Mot de passe
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={loginData.password}
                          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                          placeholder="Entrez votre mot de passe"
                          required
                          className="w-full px-4 py-3 pr-12 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-neutral-700 transition-colors duration-200"
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between text-sm">
                      <label className="flex items-center gap-2 text-neutral-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={loginData.rememberMe}
                          onChange={(e) => setLoginData({ ...loginData, rememberMe: e.target.checked })}
                          className="w-4 h-4 text-primary-500 border-neutral-300 rounded focus:ring-primary-500 focus:ring-1"
                        />
                        Se souvenir de moi
                      </label>
                      <Link 
                        to="/forgot-password" 
                        className="text-primary-600 hover:text-primary-700 transition-colors duration-200"
                      >
                        Mot de passe oublié?
                      </Link>
                    </div>

                    {/* Submit Button */}
                    <LoadingButton
                      type="submit"
                      isLoading={isLoading}
                      loadingText="Connexion..."
                      className="btn-primary btn-lg w-full group"
                    >
                      <span>Se connecter</span>
                      <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </LoadingButton>
                  </form>

                  {/* Trust Indicators */}
                  <div className="flex items-center justify-center gap-6 text-sm text-neutral-500 pt-4">
                    <div className="flex items-center gap-2">
                      <FaShieldAlt className="text-green-500" />
                      <span>Sécurisé</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaUser className="text-primary-500" />
                      <span>Certifié</span>
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

export default Login;
