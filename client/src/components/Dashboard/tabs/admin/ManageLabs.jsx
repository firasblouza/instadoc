import { useState, useEffect, useRef, useCallback } from "react";
import { FaTrashAlt, FaEye, FaEdit, FaSync, FaFlask, FaSearch, FaPlus, FaEnvelope, FaPhone, FaMapMarkerAlt, FaUpload } from "react-icons/fa";
import axios from "../../../../api/axios";
import useAccessToken from "../../../../hooks/useAccessToken";
import MedicalLoader from "../../../MedicalLoader";
import LoadingButton from "../../../LoadingButton";
import { useToast } from "../../../Notifications/ToastContainer";
import { getImageURL } from "../../../../lib/constants";

// Tunisian cities list
const tunisianCities = [
  "Tunis", "Sfax", "Sousse", "Kairouan", "Bizerte", "Gabès", "Ariana", "Gafsa",
  "Monastir", "Ben Arous", "Kasserine", "Médenine", "Nabeul", "Tataouine", 
  "Béja", "Jendouba", "Kébili", "Mahdia", "Manouba", "Siliana", "Tozeur",
  "Zaghouan", "Sidi Bouzid", "Kef"
];

const ManageLabs = () => {
  const effectRan = useRef(false);
  const [loading, setLoading] = useState(true);
  const [labs, setLabs] = useState([]);
  const [filteredLabs, setFilteredLabs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLab, setSelectedLab] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [newLab, setNewLab] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    city: "",
    description: ""
  });
  const [newLabImage, setNewLabImage] = useState(null);
  const [newLabImagePreview, setNewLabImagePreview] = useState(null);

  const { accessToken } = useAccessToken();
  const { showSuccess, showError } = useToast();
  const IMG_URL = (filename) => getImageURL(filename);

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

  const handleEdit = (lab) => {
    setSelectedLab({...lab});
    setSelectedImage(null);
    setImagePreview(null);
    setShowEditModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNewLabImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewLabImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewLabImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteClick = (lab) => {
    setSelectedLab(lab);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedLab) return;
    
    try {
      setActionLoading(true);
      await axios.delete(`/labs/delete/${selectedLab._id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
      
      await fetchLabs();
      setShowDeleteModal(false);
      setSelectedLab(null);
    } catch (error) {
      console.error("Error deleting lab:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditSave = async () => {
    if (!selectedLab) return;
    
    try {
      setActionLoading(true);
      
      // Format the data according to the expected structure
      const labData = {
        name: selectedLab.name,
        address: {
          location: typeof selectedLab.address === 'string' 
            ? selectedLab.address 
            : selectedLab.address?.location || '',
          city: typeof selectedLab.address === 'string' 
            ? selectedLab.address 
            : selectedLab.address?.city || ''
        },
        contact: {
          email: selectedLab.contact?.email || selectedLab.email || '',
          phoneNumber: selectedLab.contact?.phoneNumber || selectedLab.phoneNumber || ''
        }
      };

      // Always use FormData to match backend expectations
      const formData = new FormData();
      formData.append('lab', JSON.stringify(labData));
      
      if (selectedImage) {
        formData.append('labImage', selectedImage);
      }

      await axios.put(`/labs/edit/${selectedLab._id}`, formData, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "multipart/form-data"
            }
      });
      
      await fetchLabs();
      setShowEditModal(false);
      setSelectedLab(null);
      setSelectedImage(null);
      setImagePreview(null);
      showSuccess("Laboratoire modifié avec succès");
    } catch (error) {
      console.error("Error updating lab:", error);
      showError("Erreur lors de la modification du laboratoire");
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddLab = async () => {
    try {
      setActionLoading(true);
      
      // Format the data according to the expected structure
      const labData = {
        name: newLab.name,
        address: {
          location: newLab.address,
          city: newLab.city
        },
        contact: {
          email: newLab.email,
          phoneNumber: newLab.phoneNumber
        },
        description: newLab.description
      };

      // Use FormData to handle both JSON data and image
      const formData = new FormData();
      formData.append('lab', JSON.stringify(labData));
      
      if (newLabImage) {
        formData.append('labImage', newLabImage);
      }

      await axios.post("/labs/add", formData, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "multipart/form-data"
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
      setNewLabImage(null);
      setNewLabImagePreview(null);
      showSuccess("Laboratoire ajouté avec succès");
    } catch (error) {
      console.error("Error adding lab:", error);
      showError("Erreur lors de l'ajout du laboratoire");
    } finally {
      setActionLoading(false);
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
    <section className="w-full bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-1 sm:p-4">
      <div className="max-w-6xl mx-auto px-2 sm:px-4">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sky-600 text-xs sm:text-sm font-medium mb-3 sm:mb-4">
            <FaFlask className="mr-2 text-sm" />
            Gestion des Laboratoires
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 mb-2">
            Gestion des{' '}
            <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
              laboratoires
            </span>
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto px-4">
            Gérez les laboratoires partenaires de la plateforme
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 mb-6 sm:mb-8">
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
        <div className="card mb-4 sm:mb-6">
          <div className="card-body p-2 sm:p-4">
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="relative w-full">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Rechercher un laboratoire..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <FaPlus />
                  Ajouter
                </button>
                
                <button
                  onClick={fetchLabs}
                  className="btn-secondary flex items-center justify-center gap-2 w-full sm:w-auto"
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
                <div key={lab._id} className="p-3 sm:p-6 hover:bg-neutral-50 transition-all duration-200">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border border-neutral-200 flex-shrink-0">
                        {lab.labImage ? (
                          <img
                            src={IMG_URL(lab.labImage)}
                            alt={lab.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div 
                          className="w-full h-full bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center"
                          style={{ display: lab.labImage ? 'none' : 'flex' }}
                        >
                          <FaFlask className="text-sky-600 text-xl" />
                          </div>
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

                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      <button
                        onClick={() => handleViewDetails(lab)}
                        className="btn-secondary px-4 py-2 font-medium flex items-center justify-center gap-2"
                      >
                        <FaEye />
                        <span className="hidden sm:inline">Voir détails</span>
                        <span className="sm:hidden">Détails</span>
                      </button>
                      
                            <button
                        onClick={() => handleEdit(lab)}
                        className="btn-primary px-4 py-2 font-medium flex items-center justify-center gap-2"
                      >
                        <FaEdit />
                        <span className="hidden sm:inline">Modifier</span>
                        <span className="sm:hidden">Modifier</span>
                            </button>

                      <button
                        onClick={() => handleDeleteClick(lab)}
                        className="btn bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 px-4 py-2 font-medium flex items-center justify-center gap-2"
                      >
                        <FaTrashAlt />
                        <span className="hidden sm:inline">Supprimer</span>
                        <span className="sm:hidden">Supprimer</span>
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
                <div className="w-16 h-16 rounded-full overflow-hidden border border-neutral-200">
                  {selectedLab.labImage ? (
                    <img
                      src={IMG_URL(selectedLab.labImage)}
                      alt={selectedLab.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className="w-full h-full bg-sky-100 flex items-center justify-center"
                    style={{ display: selectedLab.labImage ? 'none' : 'flex' }}
                  >
                    <FaFlask className="text-sky-600 text-2xl" />
                  </div>
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
                    setNewLabImage(null);
                    setNewLabImagePreview(null);
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
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Ville</label>
                  <select
                    value={newLab.city}
                    onChange={(e) => setNewLab({...newLab, city: e.target.value})}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all bg-white"
                  >
                    <option value="">Sélectionner une ville</option>
                    {tunisianCities.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
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

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Image du laboratoire</label>
                <div className="border-2 border-dashed border-neutral-300 rounded-xl p-6 text-center hover:border-sky-400 transition-colors">
                  {newLabImagePreview ? (
                    <div className="space-y-3">
                      <img
                        src={newLabImagePreview}
                        alt="Image du laboratoire"
                        className="mx-auto max-h-40 rounded-lg shadow-md"
                      />
                      <label className="inline-flex items-center px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 cursor-pointer transition-colors">
                        <FaUpload className="mr-2" />
                        Changer l&apos;image
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleNewLabImageChange}
                        />
                      </label>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <div className="space-y-2">
                        <FaUpload className="mx-auto text-3xl text-neutral-400" />
                        <p className="text-neutral-600">Cliquez pour télécharger une image</p>
                        <p className="text-sm text-neutral-400">PNG, JPG jusqu&apos;à 10MB</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleNewLabImageChange}
                      />
                    </label>
                  )}
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
                    setNewLabImage(null);
                    setNewLabImagePreview(null);
                  }}
                  className="btn-secondary flex-1"
                  disabled={actionLoading}
                >
                  Annuler
                </button>
                <LoadingButton
                  onClick={handleAddLab}
                  isLoading={actionLoading}
                  className="btn-primary flex-1"
                >
                  {actionLoading ? "Ajout en cours..." : "Ajouter le laboratoire"}
                </LoadingButton>
            </div>
          </div>
        </div>
      </div>
      )}

              {/* Edit Lab Modal */}
      {showEditModal && selectedLab && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="bg-gradient-to-r from-sky-500 to-blue-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Modifier le Laboratoire</h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedLab(null);
                  }}
                  className="text-white/80 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
                  </div>

            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Nom du laboratoire</label>
                  <input
                        type="text"
                    value={selectedLab.name || ''}
                    onChange={(e) => setSelectedLab({...selectedLab, name: e.target.value})}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Email</label>
                  <input
                        type="email"
                    value={selectedLab.contact?.email || selectedLab.email || ''}
                    onChange={(e) => setSelectedLab({
                            ...selectedLab,
                      contact: {...selectedLab.contact, email: e.target.value}
                    })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Téléphone</label>
                  <input
                    type="tel"
                    value={selectedLab.contact?.phoneNumber || selectedLab.phoneNumber || ''}
                    onChange={(e) => setSelectedLab({
                            ...selectedLab,
                      contact: {...selectedLab.contact, phoneNumber: e.target.value}
                    })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Ville</label>
                  <select
                    value={selectedLab.address?.city || ''}
                    onChange={(e) => setSelectedLab({
                            ...selectedLab,
                      address: {...selectedLab.address, city: e.target.value}
                    })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all bg-white"
                  >
                    <option value="">Sélectionner une ville</option>
                    {tunisianCities.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Adresse</label>
                  <input
                        type="text"
                    value={selectedLab.address?.location || ''}
                    onChange={(e) => setSelectedLab({
                            ...selectedLab,
                      address: {...selectedLab.address, location: e.target.value}
                    })}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Image du laboratoire</label>
                <div className="border-2 border-dashed border-neutral-300 rounded-xl p-6 text-center hover:border-sky-400 transition-colors">
                  {selectedLab.labImage || imagePreview ? (
                    <div className="space-y-3">
                      <img
                        src={
                          imagePreview
                            ? imagePreview
                            : selectedLab.labImage
                            ? IMG_URL(selectedLab.labImage)
                            : IMG_URL("imagePlaceholder.png")
                        }
                        alt="Image du laboratoire"
                        className="mx-auto max-h-40 rounded-lg shadow-md"
                      />
                      <label className="inline-flex items-center px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 cursor-pointer transition-colors">
                        <FaUpload className="mr-2" />
                        Changer l&apos;image
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <div className="space-y-2">
                        <FaUpload className="mx-auto text-3xl text-neutral-400" />
                        <p className="text-neutral-600">Cliquez pour télécharger une image</p>
                        <p className="text-sm text-neutral-400">PNG, JPG jusqu&apos;à 10MB</p>
                      </div>
                          <input
                            type="file"
                            accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Description</label>
                <textarea
                  value={selectedLab.description || ''}
                  onChange={(e) => setSelectedLab({...selectedLab, description: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                      />
                    </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-neutral-200">
                        <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedLab(null);
                  }}
                  className="btn-secondary flex-1"
                  disabled={actionLoading}
                >
                  Annuler
                        </button>
                <LoadingButton
                  onClick={handleEditSave}
                  isLoading={actionLoading}
                  className="btn-primary flex-1"
                >
                  {actionLoading ? "Enregistrement..." : "Enregistrer"}
                </LoadingButton>
              </div>
                      </div>
                    </div>
                  </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedLab && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-neutral-900 mb-4">Confirmer la suppression</h3>
            <p className="text-neutral-600 mb-6">
              Êtes-vous sûr de vouloir supprimer le laboratoire{' '}
              <strong>{selectedLab.name}</strong> ?
              Cette action est irréversible.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedLab(null);
                }}
                className="flex-1 btn-secondary"
                disabled={actionLoading}
              >
                Annuler
              </button>
              <LoadingButton
                onClick={handleDeleteConfirm}
                isLoading={actionLoading}
                className="flex-1 btn bg-red-500 text-white hover:bg-red-600 focus:ring-red-500"
              >
                {actionLoading ? "Suppression..." : "Supprimer"}
              </LoadingButton>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ManageLabs;