import { useState, useEffect, useRef, useCallback } from "react";
import { FaSearch, FaGlobe, FaCode, FaChartLine, FaUpload, FaEye, FaTimes, FaInfoCircle, FaExternalLinkAlt, FaFileAlt, FaRss, FaRobot } from "react-icons/fa";
import axios from "../../../../api/axios";
import useAccessToken from "../../../../hooks/useAccessToken";
import MedicalLoader from "../../../MedicalLoader";
import LoadingButton from "../../../LoadingButton";
import { useToast } from "../../../Notifications/ToastContainer";
import { useSEO } from "../../../../context/SEOContext";
import { getImageURL } from "../../../../lib/constants";

const ManageSEO = () => {
  const effectRan = useRef(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [seoData, setSeoData] = useState({});
  const [analytics, setAnalytics] = useState({});
  const [selectedFiles, setSelectedFiles] = useState({});

  const { accessToken } = useAccessToken();
  const { showSuccess, showError } = useToast();
  const { clearSEOCache } = useSEO();
  const IMG_URL = (filename) => getImageURL(filename);

  const tabs = [
    { id: "general", name: "Général", icon: FaGlobe },
    { id: "pages", name: "Pages", icon: FaFileAlt },
    { id: "social", name: "Réseaux Sociaux", icon: FaSearch },
    { id: "analytics", name: "Analytics", icon: FaChartLine },
    { id: "technical", name: "Technique", icon: FaCode },
    { id: "preview", name: "Aperçu", icon: FaEye }
  ];

  const pages = [
    { id: "home", name: "Accueil", description: "Page d'accueil du site" },
    { id: "about", name: "À propos", description: "Informations sur l'entreprise" },
    { id: "doctors", name: "Médecins", description: "Liste des médecins" },
    { id: "medicines", name: "Médicaments", description: "Catalogue des médicaments" },
    { id: "labs", name: "Laboratoires", description: "Liste des laboratoires" },
    { id: "blog", name: "Blog", description: "Articles et actualités" },
    { id: "contact", name: "Contact", description: "Informations de contact" }
  ];

  const fetchSEOSettings = useCallback(async () => {
    try {
      setLoading(true);
      const [seoResponse, analyticsResponse] = await Promise.all([
        axios.get("/seo", {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }),
        axios.get("/seo/analytics", {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
      ]);

      setSeoData(seoResponse.data.data);
      setAnalytics(analyticsResponse.data.data);
    } catch (error) {
      console.error("Error fetching SEO settings:", error);
      showError("Erreur lors de la récupération des paramètres SEO");
    } finally {
      setLoading(false);
    }
  }, [accessToken, showError]);

  useEffect(() => {
    if (effectRan.current === false) {
      fetchSEOSettings();
    }
    return () => {
      effectRan.current = true;
    };
  }, [fetchSEOSettings]);

  const handleInputChange = (field, value) => {
    setSeoData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (parent, field, value) => {
    setSeoData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleFileChange = (field, file) => {
    setSelectedFiles(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const handleKeywordsChange = (field, value) => {
    const keywords = value.split(',').map(k => k.trim()).filter(k => k.length > 0);
    handleInputChange(field, keywords);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const formData = new FormData();
      
      // Add all text data
      Object.keys(seoData).forEach(key => {
        if (typeof seoData[key] === 'object' && seoData[key] !== null) {
          if (Array.isArray(seoData[key])) {
            formData.append(key, seoData[key].join(','));
          } else {
            formData.append(key, JSON.stringify(seoData[key]));
          }
        } else {
          formData.append(key, seoData[key] || '');
        }
      });

      // Add files
      Object.keys(selectedFiles).forEach(key => {
        if (selectedFiles[key]) {
          formData.append(key, selectedFiles[key]);
        }
      });

      await axios.put("/seo", formData, {
        headers: { 
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data"
        }
      });

      setSelectedFiles({});
      clearSEOCache(); // Clear the SEO cache so fresh data is fetched
      await fetchSEOSettings();
      showSuccess("Paramètres SEO mis à jour avec succès");
    } catch (error) {
      console.error("Error updating SEO settings:", error);
      showError("Erreur lors de la mise à jour des paramètres SEO");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir réinitialiser tous les paramètres SEO ? Cette action est irréversible.")) {
      try {
        setSaving(true);
        await axios.post("/seo/reset", {}, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        await fetchSEOSettings();
        showSuccess("Paramètres SEO réinitialisés avec succès");
      } catch (error) {
        console.error("Error resetting SEO settings:", error);
        showError("Erreur lors de la réinitialisation des paramètres SEO");
      } finally {
        setSaving(false);
      }
    }
  };

  const getCompletenessPercentage = () => {
    const general = Object.values(analytics.completeness?.general || {}).filter(Boolean).length;
    const pages = Object.values(analytics.completeness?.pages || {}).reduce((acc, page) => {
      return acc + Object.values(page).filter(Boolean).length;
    }, 0);
    const total = 5 + (pages * 3); // 5 general fields + 3 fields per page
    const completed = general + pages;
    return Math.round((completed / total) * 100);
  };

  const renderFileUpload = (field, label, accept = "image/*") => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-neutral-700">{label}</label>
      <div className="border-2 border-dashed border-neutral-300 rounded-xl p-6 text-center hover:border-sky-400 transition-colors">
        {selectedFiles[field] || seoData[field] ? (
          <div className="space-y-3">
            <img
              src={selectedFiles[field] ? URL.createObjectURL(selectedFiles[field]) : IMG_URL(seoData[field])}
              alt="Preview"
              className="mx-auto max-h-32 rounded-lg shadow-md"
            />
            <label className="inline-flex items-center px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 cursor-pointer transition-colors">
              <FaUpload className="mr-2" />
              Changer
              <input
                type="file"
                accept={accept}
                className="hidden"
                onChange={(e) => handleFileChange(field, e.target.files[0])}
              />
            </label>
          </div>
        ) : (
          <label className="cursor-pointer">
            <div className="space-y-2">
              <FaUpload className="mx-auto text-2xl text-neutral-400" />
              <p className="text-neutral-600">Cliquez pour télécharger</p>
              <p className="text-sm text-neutral-400">
                {accept === "image/*" ? "PNG, JPG jusqu'à 10MB" : "Tous les fichiers"}
              </p>
            </div>
            <input
              type="file"
              accept={accept}
              className="hidden"
              onChange={(e) => handleFileChange(field, e.target.files[0])}
            />
          </label>
        )}
      </div>
    </div>
  );

  const renderTextField = (field, label, placeholder, maxLength = null, rows = 1) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-neutral-700">{label}</label>
      {rows > 1 ? (
        <textarea
          value={seoData[field] || ''}
          onChange={(e) => handleInputChange(field, e.target.value)}
          placeholder={placeholder}
          rows={rows}
          maxLength={maxLength}
          className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
        />
      ) : (
        <input
          type="text"
          value={seoData[field] || ''}
          onChange={(e) => handleInputChange(field, e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
        />
      )}
      {maxLength && (
        <p className="text-xs text-neutral-500">
          {(seoData[field] || '').length}/{maxLength} caractères
        </p>
      )}
    </div>
  );

  const renderKeywordsField = (field, label, placeholder) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-neutral-700">{label}</label>
      <input
        type="text"
        value={(seoData[field] || []).join(', ')}
        onChange={(e) => handleKeywordsChange(field, e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
      />
      <p className="text-xs text-neutral-500">Séparez les mots-clés par des virgules</p>
    </div>
  );

  if (loading) {
    return (
      <div className="w-full h-[calc(100vh-60px)] flex items-center justify-center">
        <MedicalLoader type="heartbeat" />
      </div>
    );
  }

  return (
    <section className="w-full bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sky-600 text-sm font-medium mb-4">
            <FaSearch className="mr-2" />
            Gestion du SEO
          </div>
          <h1 className="heading-1 text-neutral-900 mb-2">
            Optimisation{' '}
            <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
              Moteurs de Recherche
            </span>
          </h1>
          <p className="body-large text-neutral-600 max-w-2xl mx-auto">
            Gérez les paramètres SEO de votre site web pour améliorer votre visibilité sur les moteurs de recherche
          </p>
        </div>

        {/* SEO Score */}
        <div className="card mb-6">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {getCompletenessPercentage()}%
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900">Score SEO</h3>
                  <p className="text-sm text-neutral-600">
                    {analytics.suggestions?.length > 0 
                      ? `${analytics.suggestions.length} amélioration(s) suggérée(s)`
                      : "Configuration SEO optimale"
                    }
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={fetchSEOSettings}
                  className="btn-secondary flex items-center gap-2"
                >
                  <FaEye />
                  Actualiser
                </button>
                <button
                  onClick={handleReset}
                  className="btn bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-500 flex items-center gap-2"
                >
                  <FaTimes />
                  Réinitialiser
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Suggestions */}
        {analytics.suggestions?.length > 0 && (
          <div className="card mb-6 border-l-4 border-yellow-500">
            <div className="card-body">
              <div className="flex items-start gap-3">
                <FaInfoCircle className="text-yellow-500 text-xl mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-neutral-900 mb-2">Suggestions d&apos;amélioration</h4>
                  <ul className="space-y-1">
                    {analytics.suggestions.map((suggestion, index) => (
                      <li key={index} className="text-sm text-neutral-600 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="card mb-6">
          <div className="card-body p-0">
            <div className="flex flex-wrap border-b border-neutral-200">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 font-medium transition-all ${
                      activeTab === tab.id
                        ? 'text-sky-600 border-b-2 border-sky-500 bg-sky-50'
                        : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                    }`}
                  >
                    <Icon />
                    {tab.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="card">
          <div className="card-body">
            {/* General Tab */}
            {activeTab === "general" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-6">Paramètres Généraux</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {renderTextField("siteTitle", "Titre du Site", "InstaDoc - Plateforme de Télémédecine", 60)}
                    {renderTextField("siteDescription", "Description du Site", "Description courte du site", 160, 3)}
                    {renderKeywordsField("siteKeywords", "Mots-clés Généraux", "télémédecine, santé, médecins")}
                    {renderTextField("canonicalUrl", "URL Canonique", "https://instadoc.com")}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-6">Images</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {renderFileUpload("siteLogo", "Logo du Site")}
                    {renderFileUpload("siteFavicon", "Favicon", "image/x-icon,image/vnd.microsoft.icon")}
                  </div>
                </div>
              </div>
            )}

            {/* Pages Tab */}
            {activeTab === "pages" && (
              <div className="space-y-8">
                <h3 className="text-xl font-semibold text-neutral-900 mb-6">SEO par Page</h3>
                <div className="space-y-8">
                  {pages.map((page) => (
                    <div key={page.id} className="border border-neutral-200 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <h4 className="text-lg font-semibold text-neutral-900">{page.name}</h4>
                        <span className="text-sm text-neutral-500">({page.description})</span>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        {renderTextField(`${page.id}Title`, "Titre", `Titre SEO pour ${page.name}`, 60)}
                        {renderTextField(`${page.id}Description`, "Description", `Description SEO pour ${page.name}`, 160, 3)}
                        {renderKeywordsField(`${page.id}Keywords`, "Mots-clés", `mots-clés spécifiques à ${page.name}`)}
                      </div>
                      {page.id === 'home' && (
                        <div className="mt-4">
                          {renderFileUpload("homeImage", "Image de Couverture de la Page d'Accueil")}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Social Media Tab */}
            {activeTab === "social" && (
              <div className="space-y-8">
                <h3 className="text-xl font-semibold text-neutral-900 mb-6">Réseaux Sociaux</h3>
                
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Facebook */}
                  <div className="border border-neutral-200 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                      <FaSearch className="text-blue-600" />
                      Facebook
                    </h4>
                    <div className="space-y-4">
                      {renderTextField("socialMedia.facebook.appId", "App ID Facebook", "Votre App ID Facebook")}
                      {renderTextField("socialMedia.facebook.pageUrl", "URL de la Page", "https://facebook.com/votre-page")}
                    </div>
                  </div>

                  {/* Twitter */}
                  <div className="border border-neutral-200 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                      <FaSearch className="text-sky-500" />
                      Twitter
                    </h4>
                    <div className="space-y-4">
                      {renderTextField("socialMedia.twitter.handle", "Handle Twitter", "@votre_handle")}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-neutral-700">Type de Carte</label>
                        <select
                          value={seoData.socialMedia?.twitter?.cardType || 'summary_large_image'}
                          onChange={(e) => handleNestedInputChange('socialMedia', 'twitter', {
                            ...seoData.socialMedia?.twitter,
                            cardType: e.target.value
                          })}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                        >
                          <option value="summary">Summary</option>
                          <option value="summary_large_image">Summary Large Image</option>
                          <option value="app">App</option>
                          <option value="player">Player</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-neutral-900 mb-4">Open Graph</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    {renderFileUpload("openGraph.defaultImage", "Image par Défaut Open Graph")}
                    {renderTextField("openGraph.imageAlt", "Texte Alternatif de l'Image", "Description de l'image")}
                  </div>
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === "analytics" && (
              <div className="space-y-8">
                <h3 className="text-xl font-semibold text-neutral-900 mb-6">Analytics et Suivi</h3>
                
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Google Analytics */}
                  <div className="border border-neutral-200 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                      <FaChartLine className="text-orange-500" />
                      Google Analytics
                    </h4>
                    <div className="space-y-4">
                      {renderTextField("googleAnalytics.trackingId", "ID de Suivi GA4", "G-XXXXXXXXXX")}
                      {renderTextField("googleAnalytics.gtmId", "ID Google Tag Manager", "GTM-XXXXXXX")}
                    </div>
                  </div>

                  {/* Google Search Console */}
                  <div className="border border-neutral-200 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                      <FaSearch className="text-green-500" />
                      Google Search Console
                    </h4>
                    <div className="space-y-4">
                      {renderTextField("googleSearchConsole.verificationCode", "Code de Vérification", "Code de vérification du site")}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Technical Tab */}
            {activeTab === "technical" && (
              <div className="space-y-8">
                <h3 className="text-xl font-semibold text-neutral-900 mb-6">Paramètres Techniques</h3>
                
                <div className="space-y-6">
                  {renderTextField("robotsTxt", "Contenu robots.txt", "User-agent: *\nAllow: /", null, 6)}
                  
                  <div>
                    <h4 className="text-lg font-semibold text-neutral-900 mb-4">Schema Markup</h4>
                    <div className="space-y-4">
                      {renderTextField("schemaMarkup.organization", "Schema Organisation (JSON)", '{"@context": "https://schema.org", ...}', null, 6)}
                      {renderTextField("schemaMarkup.website", "Schema Site Web (JSON)", '{"@context": "https://schema.org", ...}', null, 6)}
                      {renderTextField("schemaMarkup.medicalBusiness", "Schema Entreprise Médicale (JSON)", '{"@context": "https://schema.org", ...}', null, 6)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Preview Tab */}
            {activeTab === "preview" && (
              <div className="space-y-8">
                <h3 className="text-xl font-semibold text-neutral-900 mb-6">Aperçu des Résultats de Recherche</h3>
                
                <div className="border border-neutral-200 rounded-xl p-6 bg-white">
                  <div className="flex items-center gap-2 mb-4">
                    <FaExternalLinkAlt className="text-neutral-400" />
                    <span className="text-sm text-neutral-500">Google Search Results</span>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-xl text-blue-600 hover:underline cursor-pointer">
                      {seoData.siteTitle || "Titre du Site"}
                    </h4>
                    <p className="text-green-700 text-sm">
                      {seoData.canonicalUrl || "https://instadoc.com"}
                    </p>
                    <p className="text-neutral-600 text-sm">
                      {seoData.siteDescription || "Description du site"}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border border-neutral-200 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-neutral-900 mb-4">Sitemap</h4>
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                      <FaRss />
                      <span>/sitemap.xml</span>
                    </div>
                  </div>
                  
                  <div className="border border-neutral-200 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-neutral-900 mb-4">Robots.txt</h4>
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                      <FaRobot />
                      <span>/robots.txt</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-6">
          <LoadingButton
            onClick={handleSave}
            isLoading={saving}
            className="btn-primary px-8 py-3"
          >
            {saving ? "Sauvegarde..." : "Sauvegarder les Paramètres"}
          </LoadingButton>
        </div>
      </div>
    </section>
  );
};

export default ManageSEO;
