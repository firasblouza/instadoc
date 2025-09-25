import { useState, useEffect, useRef, useContext, useCallback } from "react";
import {
  FaFlask,
  FaEye,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaSearch,
  FaFilter,
  FaBuilding,
  FaGlobe
} from "react-icons/fa";

import Modal from "./Dashboard/UI/Modal";

import axios from "../api/axios";
import AuthContext from "../context/AuthContext";
import MedicalLoader from "./MedicalLoader";

const Labs = () => {
  const [labs, setLabs] = useState([]);
  const [initialLabs, setInitialLabs] = useState([]);
  const [filteredLabs, setFilteredLabs] = useState([]);
  const [selectedLab, setSelectedLab] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");

  const { API_URL } = useContext(AuthContext);
  const IMG_URL = `${API_URL}/uploads/`;

  const effectRan = useRef(false);

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showModal]);
  const fetchLabs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("/labs/");
      if (response.status === 200) {
        setLabs(response.data);
        setInitialLabs(response.data);
        setFilteredLabs(response.data);
      }
    } catch (err) {
      console.log("Error fetching labs:", err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let filtered = [...initialLabs];

    if (searchTerm) {
      filtered = filtered.filter(
        (lab) =>
          lab.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lab.address.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lab.address.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lab.contact.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCity !== "all") {
      filtered = filtered.filter((lab) => lab.address.city === selectedCity);
    }

    setFilteredLabs(filtered);
  }, [searchTerm, selectedCity, initialLabs]);

  const handleReset = () => {
    setSearchTerm("");
    setSelectedCity("all");
  };

  useEffect(() => {
    if (effectRan.current === false) {
      fetchLabs();
    }
    return () => {
      effectRan.current = true;
    };
  }, [fetchLabs]);

  if (loading) {
    return <MedicalLoader type="pulse" message="Chargement des laboratoires..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-secondary-500 to-primary-500 text-white py-16">
        <div className="container">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
              <FaFlask className="mr-2" />
              Nos Laboratoires
            </div>
            <h1 className="heading-1 text-white">
              Trouvez votre{' '}
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                laboratoire
              </span>
            </h1>
            <p className="body-large text-white/90 max-w-3xl mx-auto">
              Découvrez notre réseau de laboratoires partenaires équipés des dernières 
              technologies pour vos analyses médicales.
            </p>
            <div className="flex justify-center gap-4 pt-4">
              <div className="text-center">
                <div className="text-3xl font-bold">{initialLabs.length}+</div>
                <div className="text-white/80 text-sm">Laboratoires Partenaires</div>
              </div>
              <div className="w-px bg-white/30"></div>
              <div className="text-center">
                <div className="text-3xl font-bold">100%</div>
                <div className="text-white/80 text-sm">Certifiés</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white shadow-sm  z-30">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Rechercher un laboratoire..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white min-w-[200px]"
              >
                <option value="all">Toutes les villes</option>
                {[...new Set(initialLabs.map((lab) => lab.address.city))].map(
                  (city, index) => (
                    <option key={index} value={city}>
                      {city}
                    </option>
                  )
                )}
              </select>

              <button
                onClick={handleReset}
                className="btn-secondary px-6 py-3 whitespace-nowrap"
              >
                <FaFilter className="mr-2" />
                Réinitialiser
              </button>
            </div>
          </div>

          <div className="mt-6 flex justify-between items-center text-sm text-neutral-600">
            <p>
              {filteredLabs.length} laboratoire{filteredLabs.length > 1 ? 's' : ''} trouvé{filteredLabs.length > 1 ? 's' : ''}
              {searchTerm && ` pour "${searchTerm}"`}
            </p>
          </div>
        </div>
      </section>

      {/* Labs Grid */}
      <section className="py-12">
        <div className="container">
          {filteredLabs.length === 0 ? (
            <div className="text-center py-16">
              <FaFlask className="text-6xl text-neutral-300 mx-auto mb-4" />
              <h3 className="heading-4 text-neutral-600 mb-2">Aucun laboratoire trouvé</h3>
              <p className="text-neutral-500 mb-6">
                Essayez de modifier vos critères de recherche ou réinitialisez les filtres.
              </p>
              <button onClick={handleReset} className="btn-primary">
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredLabs.map((lab) => (
                <div
                  key={lab._id}
                  className="card-hover group cursor-pointer"
                  onClick={() => {
                    setSelectedLab(lab);
                    setShowModal(true);
                  }}
                >
                  <div className="relative overflow-hidden rounded-t-xl">
                    <img
                      src={`${IMG_URL}${lab.labImage}`}
                      alt={lab.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-neutral-700">
                        <FaFlask className="inline text-secondary-500 mr-1" />
                        Laboratoire
                      </div>
                    </div>
                  </div>
                  
                  <div className="card-body space-y-4">
                    <div className="space-y-2">
                      <h3 className="heading-4 group-hover:text-primary-600 transition-colors duration-200">
                        {lab.name}
                      </h3>
                      <div className="flex items-center gap-2 text-neutral-600">
                        <FaMapMarkerAlt className="text-primary-500" />
                        <span className="text-sm">{lab.address.location}, {lab.address.city}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-neutral-600">
                        <FaPhone className="text-secondary-500" />
                        <span>{lab.contact.phoneNumber}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral-600">
                        <FaEnvelope className="text-secondary-500" />
                        <span>{lab.contact.email}</span>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button className="btn-primary flex-1 group-hover:scale-105 transition-transform duration-200">
                        <FaEye className="mr-2" />
                        Voir détails
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`tel:${lab.contact.phoneNumber}`, '_self');
                        }}
                        className="btn-secondary p-3"
                      >
                        <FaPhone />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lab Details Modal */}
      {showModal && (
        <Modal
          showModal={showModal}
          setShowModal={setShowModal}
          title={selectedLab.name}
          firstButton="Appeler"
          firstAction={() => window.open(`tel:${selectedLab.contact?.phoneNumber}`, '_self')}
          secondButton="Fermer"
          secondAction="close"
          size="lg"
        >
          <div className="space-y-6">
            {/* Lab Image */}
            <div className="text-center">
              <img
                src={`${IMG_URL}${selectedLab.labImage}`}
                alt={selectedLab.name}
                className="w-full max-w-md mx-auto rounded-xl shadow-lg"
              />
            </div>

            {/* Lab Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-primary-50 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <FaBuilding className="text-primary-500 text-xl" />
                    <h4 className="font-semibold text-neutral-800">Informations générales</h4>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm font-medium text-neutral-500">Nom du laboratoire</label>
                      <p className="text-neutral-800 font-medium">{selectedLab.name}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-secondary-50 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <FaMapMarkerAlt className="text-secondary-500 text-xl" />
                    <h4 className="font-semibold text-neutral-800">Localisation</h4>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm font-medium text-neutral-500">Adresse</label>
                      <p className="text-neutral-800">{selectedLab.address?.location}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-neutral-500">Ville</label>
                      <p className="text-neutral-800">{selectedLab.address?.city}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-green-50 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <FaPhone className="text-green-500 text-xl" />
                    <h4 className="font-semibold text-neutral-800">Contact</h4>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-neutral-500">Téléphone</label>
                      <div className="flex items-center gap-2">
                        <p className="text-neutral-800">{selectedLab.contact?.phoneNumber}</p>
                        <button
                          onClick={() => window.open(`tel:${selectedLab.contact?.phoneNumber}`, '_self')}
                          className="text-green-600 hover:text-green-700 transition-colors duration-200"
                        >
                          <FaPhone className="text-sm" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-neutral-500">Email</label>
                      <div className="flex items-center gap-2">
                        <p className="text-neutral-800">{selectedLab.contact?.email}</p>
                        <button
                          onClick={() => window.open(`mailto:${selectedLab.contact?.email}`, '_blank')}
                          className="text-blue-600 hover:text-blue-700 transition-colors duration-200"
                        >
                          <FaEnvelope className="text-sm" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <FaGlobe className="text-purple-500 text-xl" />
                    <h4 className="font-semibold text-neutral-800">Services</h4>
                  </div>
                  <div className="space-y-2 text-sm text-neutral-600">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Analyses médicales complètes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Résultats rapides</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Équipements modernes</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Labs;
