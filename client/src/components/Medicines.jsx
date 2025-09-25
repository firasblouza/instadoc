import { useState, useEffect, useRef, useContext, useCallback } from "react";
import { FaSearch, FaFilter, FaPills, FaEye, FaTag, FaIndustry, FaWeight, FaCapsules } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import AuthContext from "../context/AuthContext";
import MedicalLoader from "./MedicalLoader";
import Modal from "./Dashboard/UI/Modal";
import usePageSEO from "../hooks/usePageSEO";

// Medicine categories for smart filtering
const medicineCategories = [
  { name: "Toutes les catégories", value: "all" },
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

const Medicines = () => {
  const [initialMedicines, setInitialMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { API_URL } = useContext(AuthContext);
  const IMG_URL = `${API_URL}/uploads/`;

  const effectRan = useRef(false);
  const navigate = useNavigate();

  // Set page SEO
  usePageSEO('medicines');

  const fetchMedicines = useCallback(async () => {
    setLoading(true);
    try {
      console.log("🔍 Fetching medicines from public page...");
      const response = await axios.get("/medicines");
      console.log("📊 Public medicines response:", response.data);
      if (response.status === 200) {
        setInitialMedicines(response.data);
        setFilteredMedicines(response.data);
      }
    } catch (error) {
      console.error("❌ Error fetching medicines:", error);
      // Fallback to empty array if API fails
      setInitialMedicines([]);
      setFilteredMedicines([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (effectRan.current === false) {
      fetchMedicines();
      effectRan.current = true;
    }
  }, [fetchMedicines]);

  // Filter and sort medicines
  useEffect(() => {
    let filtered = [...initialMedicines];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(medicine =>
        medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medicine.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        medicine.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (medicine.form && medicine.form.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(medicine => medicine.category === selectedCategory);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        default:
          return 0;
      }
    });

    setFilteredMedicines(filtered);
  }, [searchTerm, selectedCategory, sortBy, initialMedicines]);

  const handleReset = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSortBy("name");
  };

  const handleViewDetails = (medicine) => {
    setSelectedMedicine(medicine);
    setShowModal(true);
  };

  const getCategoryName = (categoryValue) => {
    const category = medicineCategories.find(cat => cat.value === categoryValue);
    return category ? category.name : categoryValue;
  };

  const getCategoryColor = (category) => {
    const colors = {
      "analgesic": "bg-blue-100 text-blue-800",
      "anti-inflammatory": "bg-red-100 text-red-800",
      "antibiotic": "bg-green-100 text-green-800",
      "vitamin": "bg-yellow-100 text-yellow-800",
      "cardiovascular": "bg-purple-100 text-purple-800",
      "digestive": "bg-orange-100 text-orange-800",
      "respiratory": "bg-cyan-100 text-cyan-800",
      "dermatological": "bg-pink-100 text-pink-800",
      "neurological": "bg-indigo-100 text-indigo-800"
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return <MedicalLoader type="stethoscope" message="Chargement des médicaments..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-16">
        <div className="container">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
              <FaPills className="mr-2" />
              Nos Médicaments
            </div>
            <h1 className="heading-1 text-white">
              Informations sur les{' '}
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                médicaments
              </span>
            </h1>
            <p className="body-large text-white/90 max-w-3xl mx-auto">
              Consultez les informations détaillées sur les médicaments disponibles en Tunisie : 
              prix, fabricants, dosages, formes et effets secondaires.
            </p>
            <div className="flex justify-center gap-4 pt-4">
              <div className="text-center">
                <div className="text-3xl font-bold">{initialMedicines.length}+</div>
                <div className="text-white/80 text-sm">Médicaments</div>
              </div>
              <div className="w-px bg-white/30"></div>
              <div className="text-center">
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-white/80 text-sm">Disponibilité</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white shadow-sm z-30">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Rechercher un médicament, fabricant, forme..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white min-w-[200px]"
              >
                {medicineCategories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.name}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white min-w-[150px]"
              >
                <option value="name">Trier par nom</option>
                <option value="price-low">Prix croissant</option>
                <option value="price-high">Prix décroissant</option>
              </select>

              <button
                onClick={handleReset}
                className="px-6 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl transition-colors duration-200 flex items-center gap-2"
              >
                <FaFilter className="text-sm" />
                Réinitialiser
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Results Count */}
      <section className="py-4 bg-neutral-50">
        <div className="container">
          <p className="text-neutral-600">
            {filteredMedicines.length} médicament{filteredMedicines.length !== 1 ? 's' : ''} trouvé{filteredMedicines.length !== 1 ? 's' : ''}
            {searchTerm && ` pour "${searchTerm}"`}
            {selectedCategory !== "all" && ` dans ${getCategoryName(selectedCategory)}`}
          </p>
        </div>
      </section>

      {/* Medicines Grid */}
      <section className="py-12">
        <div className="container">
          {filteredMedicines.length === 0 ? (
            <div className="text-center py-16">
              <FaPills className="mx-auto text-6xl text-neutral-300 mb-4" />
              <h3 className="text-xl font-semibold text-neutral-600 mb-2">
                Aucun médicament trouvé
              </h3>
              <p className="text-neutral-500 mb-6">
                Essayez de modifier vos critères de recherche
              </p>
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-colors duration-200"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMedicines.map((medicine) => (
                <div
                  key={medicine._id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  {/* Medicine Image */}
                  <div className="h-48 bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center relative overflow-hidden">
                    {medicine.medicineImage ? (
                      <img
                        src={`${IMG_URL}${medicine.medicineImage}`}
                        alt={medicine.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className="flex items-center justify-center w-full h-full"
                      style={{ display: medicine.medicineImage ? 'none' : 'flex' }}
                    >
                      <FaPills className="text-6xl text-primary-500" />
                    </div>
                    
                    {/* Prescription Badge */}
                    {medicine.prescriptionRequired && (
                      <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Ordonnance
                      </div>
                    )}
                    
                  </div>

                  {/* Medicine Info */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-neutral-800 line-clamp-2">
                        {medicine.name}
                      </h3>
                      <span className="text-xl font-bold text-primary-600">
                        {medicine.price.toFixed(2)} TND
                      </span>
                    </div>

                    <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
                      {medicine.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-neutral-500">
                        <FaTag className="text-xs" />
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(medicine.category)}`}>
                          {getCategoryName(medicine.category)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-neutral-500">
                        <FaIndustry className="text-xs" />
                        <span>{medicine.manufacturer}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-neutral-500">
                        <FaWeight className="text-xs" />
                        <span>{medicine.dosage}</span>
                      </div>
                      
                      {medicine.form && (
                        <div className="flex items-center gap-2 text-sm text-neutral-500">
                          <FaCapsules className="text-xs" />
                          <span className="capitalize">{medicine.form}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleViewDetails(medicine)}
                        className="w-full bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
                      >
                        <FaEye className="text-sm" />
                        Voir les détails
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Medicine Details Modal */}
      {showModal && selectedMedicine && (
        <Modal
          showModal={showModal}
          setShowModal={setShowModal}
          title="Détails du médicament"
        >
          <div className="space-y-6">
            {/* Medicine Header */}
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                {selectedMedicine.medicineImage ? (
                  <img
                    src={`${IMG_URL}${selectedMedicine.medicineImage}`}
                    alt={selectedMedicine.name}
                    className="w-full h-full object-cover rounded-xl"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <FaPills 
                  className="text-3xl text-primary-500"
                  style={{ display: selectedMedicine.medicineImage ? 'none' : 'block' }}
                />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-neutral-800 mb-2">
                  {selectedMedicine.name}
                </h2>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(selectedMedicine.category)}`}>
                    {getCategoryName(selectedMedicine.category)}
                  </span>
                  {selectedMedicine.prescriptionRequired && (
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                      Ordonnance requise
                    </span>
                  )}
                </div>
                <p className="text-3xl font-bold text-primary-600">
                  {selectedMedicine.price.toFixed(2)} TND
                </p>
              </div>
            </div>

            {/* Medicine Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-neutral-800 mb-3">Description</h3>
                <p className="text-neutral-600">{selectedMedicine.description}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-neutral-800 mb-3">Informations</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Fabricant:</span>
                    <span className="font-medium">{selectedMedicine.manufacturer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Dosage:</span>
                    <span className="font-medium">{selectedMedicine.dosage}</span>
                  </div>
                  {selectedMedicine.form && (
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Forme:</span>
                      <span className="font-medium capitalize">{selectedMedicine.form}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Side Effects */}
            {selectedMedicine.sideEffects && (
              <div>
                <h3 className="text-lg font-semibold text-neutral-800 mb-3">Effets secondaires</h3>
                <p className="text-neutral-600">{selectedMedicine.sideEffects}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4 border-t border-neutral-200">
              <button
                onClick={() => setShowModal(false)}
                className="w-full px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-colors duration-200"
              >
                Fermer
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Medicines;
