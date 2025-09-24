import { useState, useEffect, useRef, useCallback, useContext } from "react";
import { FaTrashAlt, FaEye, FaEdit, FaSync, FaFileAlt, FaSearch, FaPlus, FaCalendarAlt, FaEyeSlash, FaCheckCircle, FaClock, FaHeart, FaComment, FaUpload, FaImage, FaUser } from "react-icons/fa";
import axios from "../../../../api/axios";
import useAccessToken from "../../../../hooks/useAccessToken";
import AuthContext from "../../../../context/AuthContext";
import MedicalLoader from "../../../MedicalLoader";
import LoadingButton from "../../../LoadingButton";
import { useToast } from "../../../Notifications/ToastContainer";

const ManageBlogs = () => {
  const effectRan = useRef(false);
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [stats, setStats] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [newBlog, setNewBlog] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "Autres",
    tags: "",
    status: "draft",
    seoTitle: "",
    seoDescription: ""
  });

  const categories = [
    "Medecine Generale",
    "Cardiologie", 
    "Neurologie",
    "Pediatrie",
    "Gynecologie",
    "Dermatologie",
    "Orthopedie",
    "Psychiatrie",
    "Chirurgie",
    "Radiologie",
    "Autres"
  ];

  const { accessToken } = useAccessToken();
  const { showSuccess, showError } = useToast();
  const { API_URL } = useContext(AuthContext);
  const IMG_URL = `${API_URL}/uploads/`;

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      if (accessToken) {
        const response = await axios.get("/blogs/admin/all", {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        setBlogs(response.data.data);
        setFilteredBlogs(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      showError("Erreur lors de la récupération des articles");
    } finally {
      setLoading(false);
    }
  }, [accessToken, showError]);

  const fetchStats = useCallback(async () => {
    try {
      if (accessToken) {
        const response = await axios.get("/blogs/admin/stats", {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        setStats(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching blog stats:", error);
    }
  }, [accessToken]);

  useEffect(() => {
    if (effectRan.current === false) {
      fetchBlogs();
      fetchStats();
    }
    return () => {
      effectRan.current = true;
    };
  }, [fetchBlogs, fetchStats]);

  // Filter functionality
  useEffect(() => {
    let filtered = blogs;

    if (searchTerm) {
      filtered = filtered.filter(blog => 
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(blog => blog.status === statusFilter);
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(blog => blog.category === categoryFilter);
    }

    setFilteredBlogs(filtered);
  }, [blogs, searchTerm, statusFilter, categoryFilter]);

  const handleViewDetails = (blog) => {
    setSelectedBlog(blog);
    setShowDetailsModal(true);
  };

  const handleEdit = (blog) => {
    setSelectedBlog({...blog});
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

  const handleDeleteClick = (blog) => {
    setSelectedBlog(blog);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedBlog) return;
    
    try {
      setActionLoading(true);
      await axios.delete(`/blogs/admin/${selectedBlog._id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      
      await fetchBlogs();
      await fetchStats();
      setShowDeleteModal(false);
      setSelectedBlog(null);
      showSuccess("Article supprimé avec succès");
    } catch (error) {
      console.error("Error deleting blog:", error);
      showError("Erreur lors de la suppression de l'article");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditSave = async () => {
    if (!selectedBlog) return;
    
    try {
      setActionLoading(true);
      
      const formData = new FormData();
      formData.append('title', selectedBlog.title);
      formData.append('content', selectedBlog.content);
      formData.append('excerpt', selectedBlog.excerpt);
      formData.append('category', selectedBlog.category);
      formData.append('tags', selectedBlog.tags.join(','));
      formData.append('status', selectedBlog.status);
      formData.append('seoTitle', selectedBlog.seoTitle || '');
      formData.append('seoDescription', selectedBlog.seoDescription || '');
      
      if (selectedImage) {
        formData.append('featuredImage', selectedImage);
      }

      await axios.put(`/blogs/admin/${selectedBlog._id}`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data"
        }
      });
      
      await fetchBlogs();
      await fetchStats();
      setShowEditModal(false);
      setSelectedBlog(null);
      setSelectedImage(null);
      setImagePreview(null);
      showSuccess("Article mis à jour avec succès");
    } catch (error) {
      console.error("Error updating blog:", error);
      showError("Erreur lors de la mise à jour de l'article");
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddBlog = async () => {
    try {
      setActionLoading(true);
      
      const formData = new FormData();
      formData.append('title', newBlog.title);
      formData.append('content', newBlog.content);
      formData.append('excerpt', newBlog.excerpt);
      formData.append('category', newBlog.category);
      formData.append('tags', newBlog.tags);
      formData.append('status', newBlog.status);
      formData.append('seoTitle', newBlog.seoTitle || '');
      formData.append('seoDescription', newBlog.seoDescription || '');
      
      if (selectedImage) {
        formData.append('featuredImage', selectedImage);
      }

      await axios.post("/blogs/admin/create", formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data"
        }
      });
      
      await fetchBlogs();
      await fetchStats();
      setShowAddModal(false);
      setNewBlog({
        title: "",
        content: "",
        excerpt: "",
        category: "Autres",
        tags: "",
        status: "draft",
        seoTitle: "",
        seoDescription: ""
      });
      setSelectedImage(null);
      setImagePreview(null);
      showSuccess("Article créé avec succès");
    } catch (error) {
      console.error("Error adding blog:", error);
      showError("Erreur lors de la création de l'article");
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      published: "bg-green-100 text-green-800",
      draft: "bg-yellow-100 text-yellow-800",
      archived: "bg-gray-100 text-gray-800"
    };
    
    const statusTexts = {
      published: "Publié",
      draft: "Brouillon",
      archived: "Archivé"
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}>
        {statusTexts[status]}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Non défini";
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
            <FaFileAlt className="mr-2" />
            Gestion du Blog
          </div>
          <h1 className="heading-1 text-neutral-900 mb-2">
            Gestion du{' '}
            <span className="bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent">
              Blog Médical
            </span>
          </h1>
          <p className="body-large text-neutral-600 max-w-2xl mx-auto">
            Gérez les articles et contenus du blog médical
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card-hover border-l-4 border-blue-500">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">Total Articles</p>
                  <p className="text-2xl font-bold text-neutral-900">{stats.totalBlogs || 0}</p>
                </div>
                <FaFileAlt className="text-blue-500 text-2xl" />
              </div>
            </div>
          </div>
          
          <div className="card-hover border-l-4 border-green-500">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">Articles Publiés</p>
                  <p className="text-2xl font-bold text-neutral-900">{stats.publishedBlogs || 0}</p>
                </div>
                <FaCheckCircle className="text-green-500 text-2xl" />
              </div>
            </div>
          </div>

          <div className="card-hover border-l-4 border-yellow-500">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">Brouillons</p>
                  <p className="text-2xl font-bold text-neutral-900">{stats.draftBlogs || 0}</p>
                </div>
                <FaClock className="text-yellow-500 text-2xl" />
              </div>
            </div>
          </div>

          <div className="card-hover border-l-4 border-purple-500">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">Total Vues</p>
                  <p className="text-2xl font-bold text-neutral-900">{stats.totalViews || 0}</p>
                </div>
                <FaEye className="text-purple-500 text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="card mb-6">
          <div className="card-body">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un article..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                  />
                </div>
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="published">Publié</option>
                  <option value="draft">Brouillon</option>
                  <option value="archived">Archivé</option>
                </select>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                >
                  <option value="all">Toutes les catégories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="btn-primary flex items-center gap-2"
                >
                  <FaPlus />
                  Nouvel Article
                </button>
                
                <button
                  onClick={() => {
                    fetchBlogs();
                    fetchStats();
                  }}
                  className="btn-secondary flex items-center gap-2"
                >
                  <FaSync />
                  Actualiser
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Blogs List */}
        <div className="card overflow-hidden">
          {filteredBlogs.length === 0 ? (
            <div className="text-center py-12">
              <FaFileAlt className="text-neutral-300 text-6xl mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-600 mb-2">
                {blogs.length === 0 ? "Aucun article trouvé" : "Aucun résultat"}
              </h3>
              <p className="text-neutral-500">
                {blogs.length === 0 
                  ? "Aucun article n'a encore été créé" 
                  : "Essayez de modifier vos filtres de recherche"
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-200">
              {filteredBlogs.map((blog) => (
                <div key={blog._id} className="p-6 hover:bg-neutral-50 transition-all duration-200">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="w-16 h-16 rounded-xl overflow-hidden border border-neutral-200 flex-shrink-0">
                        {blog.featuredImage ? (
                          <img
                            src={`${IMG_URL}${blog.featuredImage}`}
                            alt={blog.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div 
                          className="w-full h-full bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center"
                          style={{ display: blog.featuredImage ? 'none' : 'flex' }}
                        >
                          <FaImage className="text-sky-600 text-xl" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-neutral-900 truncate">
                            {blog.title}
                          </h3>
                          {getStatusBadge(blog.status)}
                        </div>
                        
                        <p className="text-sm text-neutral-600 mb-2 line-clamp-2">
                          {blog.excerpt}
                        </p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500">
                          <div className="flex items-center gap-1">
                            <FaCalendarAlt />
                            <span>{formatDate(blog.publishedAt || blog.createdAt)}</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <FaEye />
                            <span>{blog.views || 0} vues</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <FaHeart />
                            <span>{blog.likeCount || 0} likes</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <FaComment />
                            <span>{blog.commentCount || 0} commentaires</span>
                          </div>
                          
                          <span className="bg-neutral-100 px-2 py-1 rounded-full">
                            {blog.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                      <button
                        onClick={() => handleViewDetails(blog)}
                        className="btn-secondary px-4 py-2 font-medium flex items-center justify-center gap-2"
                      >
                        <FaEye />
                        <span className="hidden sm:inline">Voir détails</span>
                        <span className="sm:hidden">Détails</span>
                      </button>
                      
                      <button
                        onClick={() => handleEdit(blog)}
                        className="btn-primary px-4 py-2 font-medium flex items-center justify-center gap-2"
                      >
                        <FaEdit />
                        <span className="hidden sm:inline">Modifier</span>
                        <span className="sm:hidden">Modifier</span>
                      </button>

                      <button
                        onClick={() => handleDeleteClick(blog)}
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

        {/* Add Blog Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-sky-500 to-blue-600 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Nouvel Article</h2>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setNewBlog({
                        title: "",
                        content: "",
                        excerpt: "",
                        category: "Autres",
                        tags: "",
                        status: "draft",
                        seoTitle: "",
                        seoDescription: ""
                      });
                      setSelectedImage(null);
                      setImagePreview(null);
                    }}
                    className="text-white/80 hover:text-white text-2xl"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Titre de l'article</label>
                    <input
                      type="text"
                      value={newBlog.title}
                      onChange={(e) => setNewBlog({...newBlog, title: e.target.value})}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                      placeholder="Titre de l'article..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Catégorie</label>
                    <select
                      value={newBlog.category}
                      onChange={(e) => setNewBlog({...newBlog, category: e.target.value})}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Statut</label>
                    <select
                      value={newBlog.status}
                      onChange={(e) => setNewBlog({...newBlog, status: e.target.value})}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                    >
                      <option value="draft">Brouillon</option>
                      <option value="published">Publié</option>
                      <option value="archived">Archivé</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Tags (séparés par des virgules)</label>
                    <input
                      type="text"
                      value={newBlog.tags}
                      onChange={(e) => setNewBlog({...newBlog, tags: e.target.value})}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                      placeholder="santé, médecine, prévention..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Titre SEO</label>
                    <input
                      type="text"
                      value={newBlog.seoTitle}
                      onChange={(e) => setNewBlog({...newBlog, seoTitle: e.target.value})}
                      maxLength="60"
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                      placeholder="Titre pour les moteurs de recherche..."
                    />
                    <p className="text-xs text-neutral-500 mt-1">
                      {newBlog.seoTitle.length}/60 caractères
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Image de couverture</label>
                    <div className="border-2 border-dashed border-neutral-300 rounded-xl p-6 text-center hover:border-sky-400 transition-colors">
                      {imagePreview ? (
                        <div className="space-y-3">
                          <img
                            src={imagePreview}
                            alt="Aperçu"
                            className="mx-auto max-h-40 rounded-lg shadow-md"
                          />
                          <label className="inline-flex items-center px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 cursor-pointer transition-colors">
                            <FaUpload className="mr-2" />
                            Changer l'image
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
                            <p className="text-sm text-neutral-400">PNG, JPG jusqu'à 10MB</p>
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

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Extrait</label>
                    <textarea
                      value={newBlog.excerpt}
                      onChange={(e) => setNewBlog({...newBlog, excerpt: e.target.value})}
                      rows="3"
                      maxLength="300"
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                      placeholder="Résumé court de l'article..."
                    />
                    <p className="text-xs text-neutral-500 mt-1">
                      {newBlog.excerpt.length}/300 caractères
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Description SEO</label>
                    <textarea
                      value={newBlog.seoDescription}
                      onChange={(e) => setNewBlog({...newBlog, seoDescription: e.target.value})}
                      rows="2"
                      maxLength="160"
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                      placeholder="Description pour les moteurs de recherche..."
                    />
                    <p className="text-xs text-neutral-500 mt-1">
                      {newBlog.seoDescription.length}/160 caractères
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Contenu de l'article</label>
                    <textarea
                      value={newBlog.content}
                      onChange={(e) => setNewBlog({...newBlog, content: e.target.value})}
                      rows="10"
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                      placeholder="Contenu complet de l'article..."
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-neutral-200">
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setNewBlog({
                        title: "",
                        content: "",
                        excerpt: "",
                        category: "Autres",
                        tags: "",
                        status: "draft",
                        seoTitle: "",
                        seoDescription: ""
                      });
                      setSelectedImage(null);
                      setImagePreview(null);
                    }}
                    className="btn-secondary flex-1"
                    disabled={actionLoading}
                  >
                    Annuler
                  </button>
                  <LoadingButton
                    onClick={handleAddBlog}
                    isLoading={actionLoading}
                    className="btn-primary flex-1"
                  >
                    {actionLoading ? "Création..." : "Créer l'article"}
                  </LoadingButton>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedBlog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-neutral-900 mb-4">Confirmer la suppression</h3>
              <p className="text-neutral-600 mb-6">
                Êtes-vous sûr de vouloir supprimer l'article{' '}
                <strong>{selectedBlog.title}</strong> ?
                Cette action est irréversible.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedBlog(null);
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

        {/* Details Modal */}
        {showDetailsModal && selectedBlog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-neutral-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-neutral-900">Détails de l'article</h2>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      setSelectedBlog(null);
                    }}
                    className="text-white/80 hover:text-white text-2xl"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2">{selectedBlog.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-neutral-600 mb-4">
                    <span className="flex items-center gap-1">
                      <FaUser /> {selectedBlog.authorName}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaCalendarAlt /> {new Date(selectedBlog.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaEye /> {selectedBlog.views} vues
                    </span>
                    <span className="flex items-center gap-1">
                      <FaHeart /> {selectedBlog.likeCount} likes
                    </span>
                  </div>
                </div>

                {selectedBlog.featuredImage && (
                  <div>
                    <img
                      src={`${IMG_URL}${selectedBlog.featuredImage}`}
                      alt={selectedBlog.title}
                      className="w-full h-64 object-cover rounded-xl"
                    />
                  </div>
                )}

                <div>
                  <h4 className="font-semibold text-neutral-900 mb-2">Extrait</h4>
                  <p className="text-neutral-700">{selectedBlog.excerpt}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-neutral-900 mb-2">Contenu</h4>
                  <div className="prose max-w-none text-neutral-700 whitespace-pre-wrap">
                    {selectedBlog.content}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-neutral-900 mb-2">Catégorie</h4>
                    <span className="inline-block px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-sm">
                      {selectedBlog.category}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-900 mb-2">Statut</h4>
                    {getStatusBadge(selectedBlog.status)}
                  </div>
                </div>

                {selectedBlog.tags && selectedBlog.tags.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-neutral-900 mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedBlog.tags.map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-neutral-900 mb-2">Temps de lecture</h4>
                    <p className="text-neutral-700">{selectedBlog.readTime} minutes</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-900 mb-2">Commentaires</h4>
                    <p className="text-neutral-700">{selectedBlog.commentCount} commentaires</p>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-neutral-200">
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      setSelectedBlog(null);
                    }}
                    className="btn-secondary px-6 py-2"
                  >
                    Fermer
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleEdit(selectedBlog);
                    }}
                    className="btn-primary px-6 py-2"
                  >
                    Modifier
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && selectedBlog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-neutral-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-neutral-900">Modifier l'article</h2>
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedBlog(null);
                      setSelectedImage(null);
                      setImagePreview(null);
                    }}
                    className="text-white/80 hover:text-white text-2xl"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Titre</label>
                    <input
                      type="text"
                      value={selectedBlog.title}
                      onChange={(e) => setSelectedBlog({...selectedBlog, title: e.target.value})}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                      placeholder="Titre de l'article..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Catégorie</label>
                    <select
                      value={selectedBlog.category}
                      onChange={(e) => setSelectedBlog({...selectedBlog, category: e.target.value})}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Tags</label>
                    <input
                      type="text"
                      value={Array.isArray(selectedBlog.tags) ? selectedBlog.tags.join(', ') : selectedBlog.tags}
                      onChange={(e) => setSelectedBlog({...selectedBlog, tags: e.target.value})}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                      placeholder="santé, médecine, prévention..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Statut</label>
                    <select
                      value={selectedBlog.status}
                      onChange={(e) => setSelectedBlog({...selectedBlog, status: e.target.value})}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                    >
                      <option value="published">Publié</option>
                      <option value="draft">Brouillon</option>
                      <option value="archived">Archivé</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Titre SEO</label>
                    <input
                      type="text"
                      value={selectedBlog.seoTitle || ''}
                      onChange={(e) => setSelectedBlog({...selectedBlog, seoTitle: e.target.value})}
                      maxLength="60"
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                      placeholder="Titre pour les moteurs de recherche..."
                    />
                    <p className="text-xs text-neutral-500 mt-1">
                      {(selectedBlog.seoTitle || '').length}/60 caractères
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Image de couverture</label>
                    <div className="border-2 border-dashed border-neutral-300 rounded-xl p-6 text-center hover:border-sky-400 transition-colors">
                      {imagePreview ? (
                        <div className="space-y-3">
                          <img
                            src={imagePreview}
                            alt="Image de couverture"
                            className="mx-auto max-h-40 rounded-lg shadow-md"
                          />
                          <label className="inline-flex items-center px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 cursor-pointer transition-colors">
                            <FaUpload className="mr-2" />
                            Changer l'image
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
                            <p className="text-sm text-neutral-400">PNG, JPG jusqu'à 10MB</p>
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

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Extrait</label>
                    <textarea
                      value={selectedBlog.excerpt}
                      onChange={(e) => setSelectedBlog({...selectedBlog, excerpt: e.target.value})}
                      rows="3"
                      maxLength="300"
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                      placeholder="Résumé court de l'article..."
                    />
                    <p className="text-xs text-neutral-500 mt-1">
                      {selectedBlog.excerpt.length}/300 caractères
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Description SEO</label>
                    <textarea
                      value={selectedBlog.seoDescription || ''}
                      onChange={(e) => setSelectedBlog({...selectedBlog, seoDescription: e.target.value})}
                      rows="2"
                      maxLength="160"
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                      placeholder="Description pour les moteurs de recherche..."
                    />
                    <p className="text-xs text-neutral-500 mt-1">
                      {(selectedBlog.seoDescription || '').length}/160 caractères
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Contenu de l'article</label>
                    <textarea
                      value={selectedBlog.content}
                      onChange={(e) => setSelectedBlog({...selectedBlog, content: e.target.value})}
                      rows="10"
                      className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                      placeholder="Contenu de l'article..."
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-neutral-200">
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedBlog(null);
                      setSelectedImage(null);
                      setImagePreview(null);
                    }}
                    className="btn-secondary flex-1"
                    disabled={actionLoading}
                  >
                    Annuler
                  </button>
                  <LoadingButton
                    onClick={handleUpdateBlog}
                    isLoading={actionLoading}
                    className="btn-primary flex-1"
                  >
                    {actionLoading ? "Mise à jour..." : "Mettre à jour"}
                  </LoadingButton>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ManageBlogs;
