import { useState, useEffect, useCallback, useContext } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FaSearch, FaCalendarAlt, FaUser, FaEye, FaHeart, FaComment, FaTag, FaFilter, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import axios from "../api/axios";
import AuthContext from "../context/AuthContext";
import MedicalLoader from "./MedicalLoader";
import usePageSEO from "../hooks/usePageSEO";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  // Set page SEO
  usePageSEO('blog');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [categories] = useState([
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
  ]);

  const { API_URL } = useContext(AuthContext);
  const IMG_URL = `${API_URL}/uploads/`;

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 9,
        ...(searchTerm && { search: searchTerm }),
        ...(selectedCategory !== 'all' && { category: selectedCategory })
      });

      const response = await axios.get(`/blogs?${params}`);
      setBlogs(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, selectedCategory]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (currentPage > 1) params.set('page', currentPage);
    
    setSearchParams(params);
  }, [searchTerm, selectedCategory, currentPage, setSearchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBlogs();
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  const renderBlogCard = (blog) => (
    <article key={blog._id} className="card-hover bg-white rounded-2xl overflow-hidden shadow-sm border border-neutral-200">
      <div className="relative">
        <Link to={`/blog/${blog.slug}`}>
          <div className="aspect-video w-full overflow-hidden">
            {blog.featuredImage ? (
              <img
                src={`${IMG_URL}${blog.featuredImage}`}
                alt={blog.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
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
              <div className="text-center">
                <div className="w-16 h-16 bg-sky-200 rounded-full flex items-center justify-center mx-auto mb-2">
                  <FaUser className="text-sky-600 text-2xl" />
                </div>
                <p className="text-sky-600 text-sm font-medium">Article Médical</p>
              </div>
            </div>
          </div>
        </Link>
        
        <div className="absolute top-4 left-4">
          <span className="bg-sky-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            {blog.category}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-3">
          <Link to={`/blog/${blog.slug}`}>
            <h3 className="text-xl font-bold text-neutral-900 hover:text-sky-600 transition-colors line-clamp-2">
              {blog.title}
            </h3>
          </Link>
        </div>

        <p className="text-neutral-600 mb-4 line-clamp-3">
          {truncateText(blog.excerpt, 150)}
        </p>

        <div className="flex items-center gap-4 text-sm text-neutral-500 mb-4">
          <div className="flex items-center gap-1">
            <FaUser className="text-sky-500" />
            <span>{blog.authorName}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaCalendarAlt className="text-sky-500" />
            <span>{formatDate(blog.publishedAt)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-neutral-500">
            <div className="flex items-center gap-1">
              <FaEye />
              <span>{blog.views || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <FaHeart />
              <span>{blog.likeCount || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <FaComment />
              <span>{blog.commentCount || 0}</span>
            </div>
          </div>
          
          <Link 
            to={`/blog/${blog.slug}`}
            className="text-sky-600 hover:text-sky-700 font-medium text-sm flex items-center gap-1"
          >
            Lire la suite
            <FaArrowRight className="text-xs" />
          </Link>
        </div>

        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-4 pt-4 border-t border-neutral-100">
            <div className="flex flex-wrap gap-2">
              {blog.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="flex items-center gap-1 text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded-full">
                  <FaTag className="text-xs" />
                  {tag}
                </span>
              ))}
              {blog.tags.length > 3 && (
                <span className="text-xs text-neutral-500">
                  +{blog.tags.length - 3} autres
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </article>
  );

  if (loading) {
    return (
      <div className="w-full h-[calc(100vh-60px)] flex items-center justify-center">
        <MedicalLoader type="heartbeat" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-16">
        <div className="container">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
              <FaUser className="mr-2" />
              Blog Médical
            </div>
            <h1 className="heading-1 text-white">
              Articles et{' '}
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Conseils Médicaux
              </span>
            </h1>
            <p className="body-large text-white/90 max-w-3xl mx-auto">
              Découvrez nos articles rédigés par des professionnels de la santé pour vous tenir informé des dernières actualités médicales et conseils de prévention.
            </p>
            <div className="flex justify-center gap-4 pt-4">
              <div className="text-center">
                <div className="text-3xl font-bold">{blogs.length}+</div>
                <div className="text-white/80 text-sm">Articles</div>
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

      {/* Spacer between hero and content */}
      <div className="bg-white py-8"></div>

      <div className="container">

        {/* Search and Filters */}
        <div className="card mb-8 -mt-16 relative z-10">
          <div className="card-body">
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              {/* Search */}
              <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Rechercher un article..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                />
              </form>

              {/* Category Filter */}
              <div className="flex items-center gap-3">
                <FaFilter className="text-neutral-500" />
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all bg-white"
                >
                  <option value="all">Toutes les catégories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Grid */}
        {blogs.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUser className="text-neutral-400 text-3xl" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-600 mb-2">
              Aucun article trouvé
            </h3>
            <p className="text-neutral-500 mb-6">
              {searchTerm || selectedCategory !== 'all' 
                ? "Essayez de modifier vos critères de recherche"
                : "Aucun article n'est encore disponible"
              }
            </p>
            {(searchTerm || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setCurrentPage(1);
                }}
                className="btn-primary"
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {blogs.map(renderBlogCard)}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={!pagination.hasPrevPage}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-neutral-300 text-neutral-600 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <FaArrowLeft />
                  Précédent
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-xl border transition-all ${
                          pageNum === pagination.currentPage
                            ? 'bg-sky-500 text-white border-sky-500'
                            : 'border-neutral-300 text-neutral-600 hover:bg-neutral-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                  disabled={!pagination.hasNextPage}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-neutral-300 text-neutral-600 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Suivant
                  <FaArrowRight />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Blog;
