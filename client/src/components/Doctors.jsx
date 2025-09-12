import { useEffect, useState, useRef, useContext, useCallback } from "react";
import { FaSearch, FaFilter, FaUserMd, FaStar, FaEye, FaCalendarAlt } from "react-icons/fa";
import { doctorSpecialties } from "../data/data";
import { capitalize } from "../utils/Capitalize";
import { useNavigate } from "react-router-dom";

import axios from "../api/axios";

import AvgRating from "./Profiles/AvgRating";
import AuthContext from "../context/AuthContext";
import MedicalLoader from "./MedicalLoader";

const Doctors = () => {
  const [initialDoctors, setInitialDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  const { API_URL } = useContext(AuthContext);
  const IMG_URL = `${API_URL}/uploads/`;

  const effectRan = useRef(false);
  const navigate = useNavigate();

  const calculateAverageRating = (ratings) => {
    if (ratings.length === 0) {
      return 0; // Handle the case where there are no ratings.
    }

    const sumOfRatings = ratings.reduce(
      (total, rating) => total + rating.rating,
      0
    );
    return sumOfRatings / ratings.length;
  };

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("/doctors");
      const approvedDoctors = response.data.filter(
        (doctor) => doctor.verifiedStatus === "approved"
      );

      const fetchRatingsPromises = approvedDoctors.map(async (doctor) => {
        try {
          const docRatings = await axios.get(`/ratings/doctor/${doctor._id}`);
          const avgRating = calculateAverageRating(docRatings.data);
          return {
            ...doctor,
            rating: avgRating,
            reviewCount: docRatings.data.length
          };
        } catch (error) {
          return {
            ...doctor,
            rating: 0,
            reviewCount: 0
          };
        }
      });

      const doctorsWithRatings = await Promise.all(fetchRatingsPromises);
      
      setInitialDoctors(doctorsWithRatings);
      setFilteredDoctors(doctorsWithRatings);
    } catch (error) {
      console.log("Error fetching doctors:", error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (effectRan.current === false) {
      fetchDoctors();
    }
    return () => {
      effectRan.current = true;
    };
  }, [fetchDoctors]);

  useEffect(() => {
    let filtered = [...initialDoctors];

    if (searchTerm) {
      filtered = filtered.filter(
        (doctor) =>
          doctor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doctor.speciality.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSpecialty !== "all") {
      filtered = filtered.filter((doctor) => doctor.speciality === selectedSpecialty);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
        case "rating":
          return b.rating - a.rating;
        case "reviews":
          return b.reviewCount - a.reviewCount;
        default:
          return 0;
      }
    });

    setFilteredDoctors(filtered);
  }, [searchTerm, selectedSpecialty, sortBy, initialDoctors]);

  const handleReset = () => {
    setSearchTerm("");
    setSelectedSpecialty("all");
    setSortBy("name");
  };

  if (loading) {
    return <MedicalLoader type="stethoscope" message="Chargement des médecins..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-16">
        <div className="container">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
              <FaUserMd className="mr-2" />
              Nos Médecins
            </div>
            <h1 className="heading-1 text-white">
              Trouvez votre{' '}
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                médecin idéal
              </span>
            </h1>
            <p className="body-large text-white/90 max-w-3xl mx-auto">
              Découvrez notre équipe de médecins qualifiés et expérimentés, 
              prêts à vous accompagner dans votre parcours de santé.
            </p>
            <div className="flex justify-center gap-4 pt-4">
              <div className="text-center">
                <div className="text-3xl font-bold">{initialDoctors.length}+</div>
                <div className="text-white/80 text-sm">Médecins Certifiés</div>
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
      <section className="py-8 bg-white shadow-sm sticky top-0 z-30">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Rechercher un médecin ou spécialité..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white min-w-[200px]"
              >
                <option value="all">Toutes les spécialités</option>
                {doctorSpecialties.map((specialty) => (
                  <option key={specialty.value} value={specialty.value}>
                    {specialty.name}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white min-w-[150px]"
              >
                <option value="name">Trier par nom</option>
                <option value="rating">Meilleure note</option>
                <option value="reviews">Plus d&apos;avis</option>
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

          {/* Results Summary */}
          <div className="mt-6 flex justify-between items-center text-sm text-neutral-600">
            <p>
              {filteredDoctors.length} médecin{filteredDoctors.length > 1 ? 's' : ''} trouvé{filteredDoctors.length > 1 ? 's' : ''}
              {searchTerm && ` pour "${searchTerm}"`}
            </p>
          </div>
        </div>
      </section>

      {/* Doctors Grid */}
      <section className="py-12">
        <div className="container">
          {filteredDoctors.length === 0 ? (
            <div className="text-center py-16">
              <FaUserMd className="text-6xl text-neutral-300 mx-auto mb-4" />
              <h3 className="heading-4 text-neutral-600 mb-2">Aucun médecin trouvé</h3>
              <p className="text-neutral-500 mb-6">
                Essayez de modifier vos critères de recherche ou réinitialisez les filtres.
              </p>
              <button onClick={handleReset} className="btn-primary">
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredDoctors.map((doctor) => (
                <div
                  key={doctor._id}
                  className="card-hover group cursor-pointer"
                  onClick={() => navigate(`/doctor/${doctor._id}`)}
                >
                  <div className="relative overflow-hidden rounded-t-xl">
                    <img
                      src={`${IMG_URL}${doctor.profileImage}`}
                      alt={`Dr. ${doctor.firstName} ${doctor.lastName}`}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-neutral-700">
                        <FaStar className="inline text-yellow-400 mr-1" />
                        {doctor.rating > 0 ? doctor.rating.toFixed(1) : 'N/A'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="card-body space-y-4">
                    <div className="space-y-2">
                      <h3 className="heading-4 group-hover:text-primary-600 transition-colors duration-200">
                        Dr. {doctor.firstName} {doctor.lastName}
                      </h3>
                      <p className="text-primary-600 font-medium">
                        {capitalize(doctor.speciality)}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-neutral-600">
                      <div className="flex items-center gap-1">
                        <AvgRating rating={doctor.rating} />
                        <span>({doctor.reviewCount})</span>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button className="btn-primary flex-1 group-hover:scale-105 transition-transform duration-200">
                        <FaEye className="mr-2" />
                        Voir le profil
                      </button>
                      <button className="btn-secondary p-3">
                        <FaCalendarAlt />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Doctors;
