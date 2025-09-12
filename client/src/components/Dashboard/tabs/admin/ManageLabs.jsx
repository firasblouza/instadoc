import { useState, useEffect, useRef, useCallback } from "react";
import { FaEye, FaSync, FaFlask, FaSearch, FaPlus, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import axios from "../../../../api/axios";
import useAccessToken from "../../../../hooks/useAccessToken";
import MedicalLoader from "../../../MedicalLoader";
import LoadingButton from "../../../LoadingButton";

const ManageLabs = () => {
  const effectRan = useRef(false);
  const [loading, setLoading] = useState(true);
  const [labs, setLabs] = useState([]);
  const [filteredLabs, setFilteredLabs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLab, setSelectedLab] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLab, setNewLab] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    description: ""
  });

  const { accessToken } = useAccessToken();

  const fetchLabs = useCallback(async () => {
    try {
      setLoading(true);
      if (accessToken) {
        const response = await axios.get("/labs", {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        setLabs(response.data);
        setFilteredLabs(response.data);
      }
    } catch (error) {
      console.error("Error fetching labs:", error);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    if (effectRan.current === false) {
      fetchLabs();
    }
    return () => {
      effectRan.current = true;
    };
  }, [fetchLabs]);

  // Search functionality
  useEffect(() => {
    const filtered = labs.filter(lab => {
      const addressString = typeof lab.address === 'string' 
        ? lab.address 
        : lab.address?.location || lab.address?.city || '';
      
      return lab.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lab.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        addressString.toLowerCase().includes(searchTerm.toLowerCase());
    });
    setFilteredLabs(filtered);
  }, [labs, searchTerm]);

  const handleViewDetails = (lab) => {
    setSelectedLab(lab);
    setShowDetailsModal(true);
  };

  const handleAddLab = async () => {
    try {
      await axios.post("/admin/labs", newLab, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      });
      
      await fetchLabs();
      setShowAddModal(false);
      setNewLab({
        name: "",
        email: "",
        phoneNumber: "",
        address: "",
        description: ""
      });
    } catch (error) {
      console.error("Error adding lab:", error);
    }
  };

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
            <FaFlask className="mr-2" />
            Gestion des Laboratoires
          </div>
          <h1 className="heading-1 text-neutral-900 mb-2">
            Gestion des{' '}
            <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
              laboratoires
            </span>
          </h1>
          <p className="body-large text-neutral-600 max-w-2xl mx-auto">
            Gérez les laboratoires partenaires de la plateforme
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="card-hover border-l-4 border-sky-500">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">Total Laboratoires</p>
                  <p className="text-2xl font-bold text-neutral-900">{labs.length}</p>
                </div>
                <FaFlask className="text-sky-500 text-2xl" />
              </div>
            </div>
          </div>
          
          <div className="card-hover border-l-4 border-green-500">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">Laboratoires Actifs</p>
                  <p className="text-2xl font-bold text-neutral-900">{labs.length}</p>
                </div>
                <FaFlask className="text-green-500 text-2xl" />
              </div>
            </div>
          </div>
          
          <div className="card-hover border-l-4 border-orange-500">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">Nouveaux ce mois</p>
                  <p className="text-2xl font-bold text-neutral-900">3</p>
                </div>
                <FaFlask className="text-orange-500 text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="card mb-6">
          <div className="card-body">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Rechercher un laboratoire..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="btn-primary flex items-center gap-2"
                >
                  <FaPlus />
                  Ajouter
                </button>
                
                <button
                  onClick={fetchLabs}
                  className="btn-secondary flex items-center gap-2"
                >
                  <FaSync />
                  Actualiser
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Labs List */}
        <div className="card overflow-hidden">
          {filteredLabs.length === 0 ? (
            <div className="text-center py-12">
              <FaFlask className="text-neutral-300 text-6xl mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-600 mb-2">
                {labs.length === 0 ? "Aucun laboratoire trouvé" : "Aucun résultat"}
              </h3>
              <p className="text-neutral-500">
                {labs.length === 0 
                  ? "Aucun laboratoire n'est encore inscrit" 
                  : "Essayez de modifier votre recherche"
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-200">
              {filteredLabs.map((lab) => (
                <div key={lab._id} className="p-6 hover:bg-neutral-50 transition-all duration-200">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-sky-100 to-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FaFlask className="text-sky-600 text-xl" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-neutral-900 truncate">
                          {lab.name}
                        </h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-neutral-600 mt-2">
                          <div className="flex items-center gap-2">
                            <FaEnvelope className="text-sky-500 flex-shrink-0" />
                            <span className="truncate">{lab.email || lab.contact?.email || "Non renseigné"}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <FaPhone className="text-sky-500 flex-shrink-0" />
                            <span className="truncate">{lab.phoneNumber || lab.contact?.phoneNumber || "Non renseigné"}</span>
                          </div>
                          
                          {lab.address && (
                            <div className="flex items-center gap-2 sm:col-span-2">
                              <FaMapMarkerAlt className="text-sky-500 flex-shrink-0" />
                              <span className="truncate">
                                {typeof lab.address === 'string' 
                                  ? lab.address 
                                  : lab.address?.location || lab.address?.city || "Adresse non renseignée"
                                }
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                      <button
                        onClick={() => handleViewDetails(lab)}
                        className="btn-secondary px-4 py-2 font-medium flex items-center justify-center gap-2"
                      >
                        <FaEye />
                        <span className="hidden sm:inline">Voir détails</span>
                        <span className="sm:hidden">Détails</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lab Details Modal */}
      {showDetailsModal && selectedLab && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-sky-500 to-blue-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Détails du Laboratoire</h2>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedLab(null);
                  }}
                  className="text-white/80 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-4 p-4 bg-sky-50 rounded-xl">
                <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center">
                  <FaFlask className="text-sky-600 text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-neutral-900">{selectedLab.name || "Laboratoire"}</h3>
                  <p className="text-neutral-600">{selectedLab.email || selectedLab.contact?.email || "Email non renseigné"}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <FaPhone className="text-sky-600" />
                    <div>
                      <p className="text-sm text-neutral-500">Téléphone</p>
                      <p className="font-semibold">{selectedLab.phoneNumber || selectedLab.contact?.phoneNumber || "Non renseigné"}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <FaMapMarkerAlt className="text-sky-600" />
                    <div>
                      <p className="text-sm text-neutral-500">Adresse</p>
                      <p className="font-semibold">
                        {typeof selectedLab.address === 'string' 
                          ? selectedLab.address 
                          : selectedLab.address?.location || selectedLab.address?.city || "Non renseignée"
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {selectedLab.description && (
                    <div>
                      <p className="text-sm text-neutral-500 mb-2">Description</p>
                      <p className="font-semibold bg-neutral-50 p-3 rounded-lg">{selectedLab.description}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-neutral-200">
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedLab(null);
                  }}
                  className="btn-secondary flex-1"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Lab Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-sky-500 to-blue-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Ajouter un Laboratoire</h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewLab({
                      name: "",
                      email: "",
                      phoneNumber: "",
                      address: "",
                      description: ""
                    });
                  }}
                  className="text-white/80 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Nom du laboratoire</label>
                  <input
                    type="text"
                    value={newLab.name}
                    onChange={(e) => setNewLab({...newLab, name: e.target.value})}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={newLab.email}
                    onChange={(e) => setNewLab({...newLab, email: e.target.value})}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Téléphone</label>
                  <input
                    type="tel"
                    value={newLab.phoneNumber}
                    onChange={(e) => setNewLab({...newLab, phoneNumber: e.target.value})}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Adresse</label>
                  <input
                    type="text"
                    value={newLab.address}
                    onChange={(e) => setNewLab({...newLab, address: e.target.value})}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Description</label>
                  <textarea
                    value={newLab.description}
                    onChange={(e) => setNewLab({...newLab, description: e.target.value})}
                    rows="3"
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-neutral-200">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewLab({
                      name: "",
                      email: "",
                      phoneNumber: "",
                      address: "",
                      description: ""
                    });
                  }}
                  className="btn-secondary flex-1"
                >
                  Annuler
                </button>
                <LoadingButton
                  onClick={handleAddLab}
                  className="btn-primary flex-1"
                >
                  Ajouter le laboratoire
                </LoadingButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ManageLabs;