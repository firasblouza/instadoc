import { useState, useEffect, useRef, useCallback, useContext } from "react";
import { FaTrashAlt, FaEye, FaEdit, FaSync, FaPills, FaSearch, FaPlus, FaTag, FaIndustry, FaWeight, FaCapsules } from "react-icons/fa";
import useAccessToken from "../../../../hooks/useAccessToken";
import AuthContext from "../../../../context/AuthContext";
import MedicalLoader from "../../../MedicalLoader";
import LoadingButton from "../../../LoadingButton";
import { useToast } from "../../../Notifications/ToastContainer";
import axios from "../../../../api/axios";

// Medicine form options
const medicineForms = [
  "comprimé", "gélule", "sachet", "sirop", "injection", 
  "pommade", "collyre", "suppositoire", "patch", "autre"
];

const medicineCategories = [
  { name: "Analgésiques", value: "analgesic" },
  { name: "Anti-inflammatoires", value: "anti-inflammatory" },
  { name: "Antibiotiques", value: "antibiotic" },
  { name: "Vitamines", value: "vitamin" },
  { name: "Cardiovasculaires", value: "cardiovascular" },
  { name: "Digestifs", value: "digestive" },
  { name: "Respiratoires", value: "respiratory" },
  { name: "Dermatologiques", value: "dermatological" },
  { name: "Neurologiques", value: "neurological" }
];

const ManageMedicines = () => {
  const effectRan = useRef(false);
  const [loading, setLoading] = useState(true);
  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [newMedicine, setNewMedicine] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    manufacturer: "",
    dosage: "",
    form: "",
    sideEffects: "",
    prescriptionRequired: false
  });

  const { accessToken } = useAccessToken();
  const { API_URL } = useContext(AuthContext);
  const { showSuccess, showError } = useToast();
  const IMG_URL = `${API_URL}/uploads/`;


  const fetchMedicines = useCallback(async () => {
    try {
      setLoading(true);
      console.log("🔍 Fetching medicines from admin...");
      const response = await axios.get("/medicines", {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      console.log("Medicines response:", response);
      console.log("📊 Medicines response:", response.data);
      if (response.status === 200) {
        setMedicines(response.data);
        setFilteredMedicines(response.data);
      }
    } catch (error) {
      console.error("❌ Error fetching medicines:", error);
      setMedicines([]);
      setFilteredMedicines([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (effectRan.current === false) {
      fetchMedicines();
    }
    return () => {
      effectRan.current = true;
    };
  }, [fetchMedicines]);

  // Search functionality
  useEffect(() => {
    const filtered = medicines.filter(medicine =>
      medicine.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.manufacturer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.form?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMedicines(filtered);
  }, [medicines, searchTerm]);

  const handleViewDetails = (medicine) => {
    setSelectedMedicine(medicine);
    setShowDetailsModal(true);
  };

  const handleEdit = (medicine) => {
    setSelectedMedicine({...medicine});
    setShowEditModal(true);
  };

  const handleDeleteClick = (medicine) => {
    setSelectedMedicine(medicine);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedMedicine) return;
    
    try {
      setActionLoading(true);
      await axios.delete(`/medicines/${selectedMedicine._id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      
      await fetchMedicines();
      setShowDeleteModal(false);
      setSelectedMedicine(null);
      showSuccess("Médicament supprimé avec succès");
    } catch (error) {
      console.error("Error deleting medicine:", error);
      showError("Erreur lors de la suppression du médicament");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditSave = async () => {
    if (!selectedMedicine) return;
    
    try {
      setActionLoading(true);
      
      const medicineData = {
        name: selectedMedicine.name,
        description: selectedMedicine.description,
        price: parseFloat(selectedMedicine.price),
        category: selectedMedicine.category,
        manufacturer: selectedMedicine.manufacturer,
        dosage: selectedMedicine.dosage,
        form: selectedMedicine.form,
        sideEffects: selectedMedicine.sideEffects,
        prescriptionRequired: selectedMedicine.prescriptionRequired
      };

      const formData = new FormData();
      formData.append("medicine", JSON.stringify(medicineData));
      
      if (selectedMedicine.medicineImage && selectedMedicine.medicineImage instanceof File) {
        formData.append("medicineImage", selectedMedicine.medicineImage);
      }

      await axios.put(`/medicines/${selectedMedicine._id}`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data"
        }
      });
      
      await fetchMedicines();
      setShowEditModal(false);
      setSelectedMedicine(null);
      showSuccess("Médicament modifié avec succès");
    } catch (error) {
      console.error("Error updating medicine:", error);
      showError("Erreur lors de la modification du médicament");
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddMedicine = async () => {
    try {
      setActionLoading(true);
      
      const medicineData = {
        name: newMedicine.name,
        description: newMedicine.description,
        price: parseFloat(newMedicine.price),
        category: newMedicine.category,
        manufacturer: newMedicine.manufacturer,
        dosage: newMedicine.dosage,
        form: newMedicine.form,
        sideEffects: newMedicine.sideEffects,
        prescriptionRequired: newMedicine.prescriptionRequired
      };

      const formData = new FormData();
      formData.append("medicine", JSON.stringify(medicineData));
      
      if (newMedicine.medicineImage && newMedicine.medicineImage instanceof File) {
        formData.append("medicineImage", newMedicine.medicineImage);
      }

      await axios.post("/medicines", formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data"
        }
      });
      
      await fetchMedicines();
      setShowAddModal(false);
      setNewMedicine({
        name: "",
        description: "",
        price: "",
        category: "",
        manufacturer: "",
        dosage: "",
        form: "",
        sideEffects: "",
        prescriptionRequired: false
      });
      showSuccess("Médicament ajouté avec succès");
    } catch (error) {
      console.error("Error adding medicine:", error);
      showError("Erreur lors de l'ajout du médicament");
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
    <section className="w-full bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sky-600 text-sm font-medium mb-4">
            <FaPills className="mr-2" />
            Gestion des Médicaments
          </div>
          <h1 className="heading-1 text-neutral-900 mb-2">
            Gestion des{' '}
            <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
              médicaments
            </span>
          </h1>
          <p className="body-large text-neutral-600 max-w-2xl mx-auto">
            Gérez et supervisez tous les médicaments de la plateforme
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="card-hover border-l-4 border-sky-500">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">Total Médicaments</p>
                  <p className="text-2xl font-bold text-neutral-900">{medicines.length}</p>
                </div>
                <FaPills className="text-sky-500 text-2xl" />
              </div>
            </div>
          </div>
          
          <div className="card-hover border-l-4 border-green-500">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">Catégories</p>
                  <p className="text-2xl font-bold text-neutral-900">
                    {[...new Set(medicines.map(m => m.category))].length}
                  </p>
                </div>
                <FaPills className="text-green-500 text-2xl" />
              </div>
            </div>
          </div>
          
          <div className="card-hover border-l-4 border-orange-500">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">Fabricants</p>
                  <p className="text-2xl font-bold text-neutral-900">
                    {[...new Set(medicines.map(m => m.manufacturer))].length}
                  </p>
                </div>
                <FaPills className="text-orange-500 text-2xl" />
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
                  placeholder="Rechercher un médicament..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={fetchMedicines}
                  className="btn-secondary flex items-center gap-2"
                >
                  <FaSync />
                  Actualiser
                </button>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="btn-primary flex items-center gap-2"
                >
                  <FaPlus />
                  Ajouter un médicament
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Medicines List */}
        <div className="card overflow-hidden">
          {filteredMedicines.length === 0 ? (
            <div className="text-center py-12">
              <FaPills className="text-neutral-300 text-6xl mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-600 mb-2">
                {medicines.length === 0 ? "Aucun médicament trouvé" : "Aucun résultat"}
              </h3>
              <p className="text-neutral-500">
                {medicines.length === 0 
                  ? "Aucun médicament n'est encore enregistré" 
                  : "Essayez de modifier votre recherche"
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-200">
              {filteredMedicines.map((medicine) => (
                <div key={medicine._id} className="p-6 hover:bg-neutral-50 transition-all duration-200">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-14 h-14 rounded-xl overflow-hidden border border-neutral-200 flex-shrink-0">
                        {medicine.medicineImage ? (
                          <img
                            src={`${IMG_URL}${medicine.medicineImage}`}
                            alt={medicine.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div 
                          className="w-full h-full bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center"
                          style={{ display: medicine.medicineImage ? 'none' : 'flex' }}
                        >
                          <FaPills className="text-sky-600 text-xl" />
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-neutral-900 truncate">
                          {medicine.name}
                        </h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-neutral-600 mt-2">
                          <div className="flex items-center gap-2">
                            <FaPills className="text-sky-500 flex-shrink-0" />
                            <span className="truncate">{medicine.category}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <FaPills className="text-sky-500 flex-shrink-0" />
                            <span className="truncate">{medicine.manufacturer}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 sm:col-span-2">
                            <FaPills className="text-sky-500 flex-shrink-0" />
                            <span className="truncate">{medicine.dosage}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                      <button
                        onClick={() => handleViewDetails(medicine)}
                        className="btn-secondary px-4 py-2 font-medium flex items-center justify-center gap-2"
                      >
                        <FaEye />
                        <span className="hidden sm:inline">Voir détails</span>
                        <span className="sm:hidden">Détails</span>
                      </button>
                      
                      <button
                        onClick={() => handleEdit(medicine)}
                        className="btn-primary px-4 py-2 font-medium flex items-center justify-center gap-2"
                      >
                        <FaEdit />
                        <span className="hidden sm:inline">Modifier</span>
                        <span className="sm:hidden">Modifier</span>
                      </button>
                      
                      <button
                        onClick={() => handleDeleteClick(medicine)}
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

      {/* Medicine Details Modal */}
      {showDetailsModal && selectedMedicine && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-sky-500 to-blue-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Détails du Médicament</h2>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedMedicine(null);
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
                  {selectedMedicine.medicineImage ? (
                    <img
                      src={`${IMG_URL}${selectedMedicine.medicineImage}`}
                      alt={selectedMedicine.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className="w-full h-full bg-sky-100 flex items-center justify-center"
                    style={{ display: selectedMedicine.medicineImage ? 'none' : 'flex' }}
                  >
                    <FaPills className="text-sky-600 text-2xl" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-neutral-900">{selectedMedicine.name}</h3>
                  <p className="text-neutral-600">{selectedMedicine.category}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <FaIndustry className="text-sky-600" />
                    <div>
                      <p className="text-sm text-neutral-500">Fabricant</p>
                      <p className="font-semibold">{selectedMedicine.manufacturer}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <FaWeight className="text-sky-600" />
                    <div>
                      <p className="text-sm text-neutral-500">Dosage</p>
                      <p className="font-semibold">{selectedMedicine.dosage}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <FaTag className="text-sky-600" />
                    <div>
                      <p className="text-sm text-neutral-500">Prix</p>
                      <p className="font-semibold">{selectedMedicine.price} TND</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <FaCapsules className="text-sky-600" />
                    <div>
                      <p className="text-sm text-neutral-500">Forme</p>
                      <p className="font-semibold capitalize">{selectedMedicine.form}</p>
                    </div>
                  </div>


                  <div className="flex items-center space-x-3">
                    <FaPills className="text-sky-600" />
                    <div>
                      <p className="text-sm text-neutral-500">Prescription requise</p>
                      <p className="font-semibold">
                        {selectedMedicine.prescriptionRequired ? (
                          <span className="text-red-600">Oui</span>
                        ) : (
                          <span className="text-green-600">Non</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-neutral-500 mb-2">Description</p>
                    <p className="font-semibold bg-neutral-50 p-3 rounded-lg text-sm leading-relaxed">
                      {selectedMedicine.description}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-neutral-500 mb-2">Effets secondaires</p>
                    <p className="font-semibold bg-neutral-50 p-3 rounded-lg text-sm leading-relaxed">
                      {selectedMedicine.sideEffects}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-neutral-200">
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedMedicine(null);
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

      {/* Add Medicine Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-sky-500 to-blue-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Ajouter un Médicament</h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewMedicine({
                      name: "",
                      description: "",
                      price: "",
                      category: "",
                      manufacturer: "",
                      dosage: "",
                      sideEffects: ""
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
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Nom du médicament</label>
                  <input
                    type="text"
                    value={newMedicine.name}
                    onChange={(e) => setNewMedicine({...newMedicine, name: e.target.value})}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Catégorie</label>
                  <select
                    value={newMedicine.category}
                    onChange={(e) => setNewMedicine({...newMedicine, category: e.target.value})}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {medicineCategories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Fabricant</label>
                  <input
                    type="text"
                    value={newMedicine.manufacturer}
                    onChange={(e) => setNewMedicine({...newMedicine, manufacturer: e.target.value})}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Dosage</label>
                  <input
                    type="text"
                    value={newMedicine.dosage}
                    onChange={(e) => setNewMedicine({...newMedicine, dosage: e.target.value})}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Forme</label>
                  <select
                    value={newMedicine.form}
                    onChange={(e) => setNewMedicine({...newMedicine, form: e.target.value})}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                  >
                    <option value="">Sélectionner une forme</option>
                    {medicineForms.map((form) => (
                      <option key={form} value={form}>
                        {form.charAt(0).toUpperCase() + form.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Prix (TND)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newMedicine.price}
                    onChange={(e) => setNewMedicine({...newMedicine, price: e.target.value})}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                  />
                </div>

              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Description</label>
                <textarea
                  value={newMedicine.description}
                  onChange={(e) => setNewMedicine({...newMedicine, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Effets secondaires</label>
                <textarea
                  value={newMedicine.sideEffects}
                  onChange={(e) => setNewMedicine({...newMedicine, sideEffects: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-neutral-200">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setNewMedicine({
                      name: "",
                      description: "",
                      price: "",
                      category: "",
                      manufacturer: "",
                      dosage: "",
                      form: "",
                      sideEffects: "",
                      prescriptionRequired: false
                    });
                  }}
                  className="btn-secondary flex-1"
                >
                  Annuler
                </button>
                <LoadingButton
                  onClick={handleAddMedicine}
                  className="btn-primary flex-1"
                >
                  Ajouter le médicament
                </LoadingButton>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Edit Medicine Modal */}
      {showEditModal && selectedMedicine && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="bg-gradient-to-r from-sky-500 to-blue-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Modifier le Médicament</h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedMedicine(null);
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
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Nom du médicament</label>
                  <input
                    type="text"
                    value={selectedMedicine.name || ''}
                    onChange={(e) => setSelectedMedicine({...selectedMedicine, name: e.target.value})}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Catégorie</label>
                  <select
                    value={selectedMedicine.category || ''}
                    onChange={(e) => setSelectedMedicine({...selectedMedicine, category: e.target.value})}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {medicineCategories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Fabricant</label>
                  <input
                    type="text"
                    value={selectedMedicine.manufacturer || ''}
                    onChange={(e) => setSelectedMedicine({...selectedMedicine, manufacturer: e.target.value})}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Dosage</label>
                  <input
                    type="text"
                    value={selectedMedicine.dosage || ''}
                    onChange={(e) => setSelectedMedicine({...selectedMedicine, dosage: e.target.value})}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Forme</label>
                  <select
                    value={selectedMedicine.form || ''}
                    onChange={(e) => setSelectedMedicine({...selectedMedicine, form: e.target.value})}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                  >
                    <option value="">Sélectionner une forme</option>
                    {medicineForms.map((form) => (
                      <option key={form} value={form}>
                        {form.charAt(0).toUpperCase() + form.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Prix (TND)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={selectedMedicine.price || ''}
                    onChange={(e) => setSelectedMedicine({...selectedMedicine, price: e.target.value})}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Description</label>
                <textarea
                  value={selectedMedicine.description || ''}
                  onChange={(e) => setSelectedMedicine({...selectedMedicine, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Effets secondaires</label>
                <textarea
                  value={selectedMedicine.sideEffects || ''}
                  onChange={(e) => setSelectedMedicine({...selectedMedicine, sideEffects: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-neutral-200">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedMedicine(null);
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
      {showDeleteModal && selectedMedicine && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-neutral-900 mb-4">Confirmer la suppression</h3>
            <p className="text-neutral-600 mb-6">
              Êtes-vous sûr de vouloir supprimer le médicament{' '}
              <strong>{selectedMedicine.name}</strong> ?
              Cette action est irréversible.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedMedicine(null);
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

export default ManageMedicines;
