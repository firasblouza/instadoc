import { useState, useEffect, useRef, useCallback } from "react";
import { FaTrashAlt, FaEye, FaEdit, FaSync, FaStar, FaSearch, FaUserMd, FaUser, FaCalendarAlt } from "react-icons/fa";
import axios from "../../../../api/axios";
import useAccessToken from "../../../../hooks/useAccessToken";
import MedicalLoader from "../../../MedicalLoader";
import LoadingButton from "../../../LoadingButton";

const ManageRatings = () => {
  const effectRan = useRef(false);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState([]);
  const [filteredRatings, setFilteredRatings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRating, setSelectedRating] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const { accessToken } = useAccessToken();

  const fetchRatings = useCallback(async () => {
    try {
      setLoading(true);
      if (accessToken) {
        const response = await axios.get("/ratings", {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        setRatings(response.data);
        setFilteredRatings(response.data);
      }
    } catch (error) {
      console.error("Error fetching ratings:", error);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    if (effectRan.current === false) {
      fetchRatings();
    }
    return () => {
      effectRan.current = true;
    };
  }, [fetchRatings]);

  // Search functionality
  useEffect(() => {
    const filtered = ratings.filter(rating =>
      rating.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rating.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rating.comment?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRatings(filtered);
  }, [ratings, searchTerm]);

  const handleViewDetails = (rating) => {
    setSelectedRating(rating);
    setShowDetailsModal(true);
  };

  const handleEdit = (rating) => {
    setSelectedRating({...rating});
    setShowEditModal(true);
  };

  const handleEditSave = async () => {
    if (!selectedRating) return;
    
    try {
      setActionLoading(true);
      
      const ratingData = {
        rating: selectedRating.rating,
        review: selectedRating.review
      };

      await axios.put(`/ratings/${selectedRating._id}`, ratingData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      });
      
      await fetchRatings();
      setShowEditModal(false);
      setSelectedRating(null);
    } catch (error) {
      console.error("Error updating rating:", error);
      alert("Erreur lors de la modification de l&apos;avis");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteClick = (rating) => {
    setSelectedRating(rating);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedRating) return;
    
    try {
      setActionLoading(true);
      await axios.delete(`/admin/rating/${selectedRating._id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      
      await fetchRatings();
      setShowDeleteModal(false);
      setSelectedRating(null);
    } catch (error) {
      console.error("Error deleting rating:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Non définie";
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar
        key={index}
        className={`${index < rating ? 'text-yellow-500' : 'text-neutral-300'} text-sm`}
      />
    ));
  };

  const averageRating = ratings.length > 0 
    ? (ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length).toFixed(1)
    : 0;

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
            <FaStar className="mr-2" />
            Gestion des Avis
          </div>
          <h1 className="heading-1 text-neutral-900 mb-2">
            Gestion des{' '}
            <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
              avis
            </span>
          </h1>
          <p className="body-large text-neutral-600 max-w-2xl mx-auto">
            Supervisez et gérez les avis des patients
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="card-hover border-l-4 border-sky-500">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">Total Avis</p>
                  <p className="text-2xl font-bold text-neutral-900">{ratings.length}</p>
                </div>
                <FaStar className="text-sky-500 text-2xl" />
              </div>
            </div>
          </div>
          
          <div className="card-hover border-l-4 border-yellow-500">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">Note Moyenne</p>
                  <p className="text-2xl font-bold text-neutral-900">{averageRating}</p>
                </div>
                <FaStar className="text-yellow-500 text-2xl" />
              </div>
            </div>
          </div>
          
          <div className="card-hover border-l-4 border-green-500">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">Avis ce mois</p>
                  <p className="text-2xl font-bold text-neutral-900">15</p>
                </div>
                <FaStar className="text-green-500 text-2xl" />
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
                  placeholder="Rechercher par médecin, patient ou commentaire..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                />
              </div>
              
              <button
                onClick={fetchRatings}
                className="btn-secondary flex items-center gap-2"
              >
                <FaSync />
                Actualiser
              </button>
            </div>
          </div>
        </div>

        {/* Ratings List */}
        <div className="card overflow-hidden">
          {filteredRatings.length === 0 ? (
            <div className="text-center py-12">
              <FaStar className="text-neutral-300 text-6xl mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-600 mb-2">
                {ratings.length === 0 ? "Aucun avis trouvé" : "Aucun résultat"}
              </h3>
              <p className="text-neutral-500">
                {ratings.length === 0 
                  ? "Aucun avis n'a encore été laissé" 
                  : "Essayez de modifier votre recherche"
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-200">
              {filteredRatings.map((rating) => (
                <div key={rating._id} className="p-6 hover:bg-neutral-50 transition-all duration-200">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FaStar className="text-yellow-600 text-xl" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                          <div className="flex items-center gap-1">
                            {renderStars(rating.rating)}
                            <span className="ml-2 text-sm font-medium text-neutral-700">({rating.rating}/5)</span>
                          </div>
                        </div>
                        
                        {rating.review && (
                          <div className="mb-3">
                            <p className="text-sm text-neutral-700 bg-neutral-50 p-3 rounded-lg border-l-4 border-sky-200">
                              <strong className="text-neutral-800">Avis:</strong> {rating.review}
                            </p>
                          </div>
                        )}
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-neutral-600 mb-2">
                          <div className="flex items-center gap-2">
                            <FaUserMd className="text-sky-500 flex-shrink-0" />
                            <span className="truncate">Dr. {rating.doctorName || "Médecin"}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <FaUser className="text-sky-500 flex-shrink-0" />
                            <span className="truncate">{rating.patientName || "Patient"}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <FaCalendarAlt className="text-sky-500 flex-shrink-0" />
                            <span>{formatDate(rating.createdAt)}</span>
                          </div>
                        </div>
                        
                        {rating.comment && (
                          <p className="text-sm text-neutral-600 bg-neutral-50 p-3 rounded-lg">
                            <strong className="text-neutral-800">Commentaire:</strong> {rating.comment}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                      <button
                        onClick={() => handleViewDetails(rating)}
                        className="btn-secondary px-4 py-2 font-medium flex items-center justify-center gap-2"
                      >
                        <FaEye />
                        <span className="hidden sm:inline">Voir détails</span>
                        <span className="sm:hidden">Détails</span>
                      </button>
                      
                      <button
                        onClick={() => handleEdit(rating)}
                        className="btn-primary px-4 py-2 font-medium flex items-center justify-center gap-2"
                      >
                        <FaEdit />
                        <span className="hidden sm:inline">Modifier</span>
                        <span className="sm:hidden">Modifier</span>
                      </button>
                      
                      <button
                        onClick={() => handleDeleteClick(rating)}
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

      {/* Rating Details Modal */}
      {showDetailsModal && selectedRating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-sky-500 to-blue-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Détails de l&apos;Avis</h2>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedRating(null);
                  }}
                  className="text-white/80 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="text-center p-4 bg-yellow-50 rounded-xl">
                <div className="flex items-center justify-center gap-1 mb-2">
                  {renderStars(selectedRating.rating)}
                </div>
                <p className="text-2xl font-bold text-neutral-900">{selectedRating.rating}/5</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <FaUserMd className="text-sky-600" />
                    <div>
                      <p className="text-sm text-neutral-500">Médecin</p>
                      <p className="font-semibold">Dr. {selectedRating.doctorName}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <FaUser className="text-sky-600" />
                    <div>
                      <p className="text-sm text-neutral-500">Patient</p>
                      <p className="font-semibold">{selectedRating.patientName}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <FaCalendarAlt className="text-sky-600" />
                    <div>
                      <p className="text-sm text-neutral-500">Date</p>
                      <p className="font-semibold">{formatDate(selectedRating.createdAt)}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {selectedRating.comment && (
                    <div>
                      <p className="text-sm text-neutral-500 mb-2">Commentaire</p>
                      <p className="font-semibold bg-neutral-50 p-3 rounded-lg">{selectedRating.comment}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-neutral-200">
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedRating(null);
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedRating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-neutral-900 mb-4">Confirmer la suppression</h3>
            <p className="text-neutral-600 mb-6">
              Êtes-vous sûr de vouloir supprimer cet avis ?
              Cette action est irréversible.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedRating(null);
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

      {/* Edit Rating Modal */}
      {showEditModal && selectedRating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="bg-gradient-to-r from-sky-500 to-blue-600 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Modifier l&apos;Avis</h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedRating(null);
                  }}
                  className="text-white/80 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Note</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setSelectedRating({...selectedRating, rating: star})}
                        className={`text-2xl transition-colors ${
                          star <= selectedRating.rating 
                            ? 'text-yellow-400' 
                            : 'text-neutral-300 hover:text-yellow-200'
                        }`}
                      >
                        <FaStar />
                      </button>
                    ))}
                    <span className="ml-2 text-sm font-medium text-neutral-700">
                      ({selectedRating.rating}/5)
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Avis</label>
                  <textarea
                    value={selectedRating.review || ''}
                    onChange={(e) => setSelectedRating({...selectedRating, review: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                    placeholder="Écrivez votre avis ici..."
                  />
                </div>

                <div className="text-sm text-neutral-600 bg-neutral-50 p-4 rounded-lg">
                  <p><strong>Médecin:</strong> Dr. {selectedRating.doctorName}</p>
                  <p><strong>Patient:</strong> {selectedRating.patientName}</p>
                  <p><strong>Date:</strong> {formatDate(selectedRating.createdAt)}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-neutral-200">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedRating(null);
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
    </section>
  );
};

export default ManageRatings;