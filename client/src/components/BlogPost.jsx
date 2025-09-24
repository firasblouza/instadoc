import { useState, useEffect, useCallback, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaCalendarAlt, FaUser, FaEye, FaHeart, FaComment, FaTag, FaShare, FaArrowLeft, FaUserMd, FaClock } from "react-icons/fa";
import axios from "../api/axios";
import AuthContext from "../context/AuthContext";
import MedicalLoader from "./MedicalLoader";
import LoadingButton from "./LoadingButton";
import useAccessToken from "../hooks/useAccessToken";
import { useSEO } from "../context/SEOContext";
import { useToast } from "./Notifications/ToastContainer";

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const { API_URL } = useContext(AuthContext);
  const { accessToken } = useAccessToken();
  const { setPageSEO } = useSEO();
  const { showSuccess } = useToast();
  const IMG_URL = `${API_URL}/uploads/`;

  const fetchBlogPost = useCallback(async () => {
    try {
      setLoading(true);
      const [blogResponse, relatedResponse] = await Promise.all([
        axios.get(`/blogs/slug/${slug}`),
        axios.get(`/blogs/related/${slug}`)
      ]);

      const blogData = blogResponse.data.data;
      setBlog(blogData);
      setRelatedBlogs(relatedResponse.data.data);
      setIsLiked(blogData.likes.some(like => like._id === (accessToken ? JSON.parse(atob(accessToken.split('.')[1])).UserInfo.id : null)));
      setLikeCount(blogData.likeCount);

      // Set dynamic SEO for blog post
      if (blogData) {
        const blogImage = blogData.featuredImage ? `${IMG_URL}${blogData.featuredImage}` : null;
        setPageSEO('blog', blogData.title, blogData.excerpt, blogImage);
      }
    } catch (error) {
      console.error("Error fetching blog post:", error);
      navigate('/blog');
    } finally {
      setLoading(false);
    }
  }, [slug, accessToken, navigate]);

  useEffect(() => {
    fetchBlogPost();
  }, [fetchBlogPost]);

  const handleLike = async () => {
    if (!accessToken) {
      navigate('/login');
      return;
    }

    try {
      const response = await axios.patch(`/blogs/${blog._id}/like`, {}, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      setIsLiked(response.data.data.isLiked);
      setLikeCount(response.data.data.likeCount);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!accessToken) {
      navigate('/login');
      return;
    }

    if (!commentText.trim()) return;

    try {
      setSubmittingComment(true);
      await axios.post(`/blogs/${blog._id}/comment`, {
        content: commentText
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      setCommentText('');
      // Refresh the blog post to get updated comments
      await fetchBlogPost();
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      showSuccess('Lien copié dans le presse-papiers !');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="w-full h-[calc(100vh-60px)] flex items-center justify-center">
        <MedicalLoader type="heartbeat" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="w-full h-[calc(100vh-60px)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-600 mb-4">Article non trouvé</h2>
          <Link to="/blog" className="btn-primary">
            Retour au blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full bg-gradient-to-br from-primary-50 via-white to-secondary-50 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/blog')}
            className="flex items-center gap-2 text-neutral-600 hover:text-sky-600 transition-colors"
          >
            <FaArrowLeft />
            Retour au blog
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <article className="lg:col-span-3">
            {/* Article Header */}
            <header className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-sky-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {blog.category}
                </span>
                <span className="text-neutral-500">•</span>
                <span className="text-sm text-neutral-500">
                  {blog.readTime} min de lecture
                </span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6 leading-tight">
                {blog.title}
              </h1>

              <p className="text-xl text-neutral-600 mb-6 leading-relaxed">
                {blog.excerpt}
              </p>

              {/* Author Info */}
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-neutral-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-neutral-200">
                    {blog.author.profileImage ? (
                      <img
                        src={`${IMG_URL}${blog.author.profileImage}`}
                        alt={blog.author.firstName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-sky-100 flex items-center justify-center">
                        <FaUserMd className="text-sky-600 text-xl" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900">
                      Dr. {blog.author.firstName} {blog.author.lastName}
                    </h3>
                    {blog.author.specialty && (
                      <p className="text-sm text-neutral-600">{blog.author.specialty}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-neutral-500">
                  <div className="flex items-center gap-1">
                    <FaCalendarAlt />
                    <span>{formatDate(blog.publishedAt)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaClock />
                    <span>{formatTime(blog.publishedAt)}</span>
                  </div>
                </div>
              </div>

              {/* Article Actions */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-6 text-sm text-neutral-500">
                  <div className="flex items-center gap-1">
                    <FaEye />
                    <span>{blog.views} vues</span>
                  </div>
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-1 transition-colors ${
                      isLiked ? 'text-red-500' : 'text-neutral-500 hover:text-red-500'
                    }`}
                  >
                    <FaHeart className={isLiked ? 'fill-current' : ''} />
                    <span>{likeCount} likes</span>
                  </button>
                  <div className="flex items-center gap-1">
                    <FaComment />
                    <span>{blog.comments.length} commentaires</span>
                  </div>
                </div>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors"
                >
                  <FaShare />
                  Partager
                </button>
              </div>
            </header>

            {/* Featured Image */}
            {blog.featuredImage && (
              <div className="mb-8">
                <img
                  src={`${IMG_URL}${blog.featuredImage}`}
                  alt={blog.title}
                  className="w-full h-64 lg:h-96 object-cover rounded-2xl shadow-lg"
                />
              </div>
            )}

            {/* Article Content */}
            <div className="prose prose-lg max-w-none mb-12">
              <div className="text-neutral-700 leading-relaxed">
                {blog.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 last:mb-0">
                    {paragraph || '\u00A0'}
                  </p>
                ))}
              </div>
            </div>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mb-8 pb-8 border-b border-neutral-200">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, index) => (
                    <span key={index} className="flex items-center gap-1 bg-neutral-100 text-neutral-600 px-3 py-2 rounded-full text-sm">
                      <FaTag className="text-xs" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Comments Section */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-neutral-900 mb-6">
                Commentaires ({blog.comments.length})
              </h3>

              {/* Add Comment Form */}
              <div className="mb-8">
                <form onSubmit={handleCommentSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0">
                      <FaUser className="text-sky-600" />
                    </div>
                    <div className="flex-1">
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Ajouter un commentaire..."
                        rows="3"
                        className="w-full p-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all resize-none"
                      />
                      <div className="flex justify-end mt-3">
                        <LoadingButton
                          type="submit"
                          isLoading={submittingComment}
                          disabled={!commentText.trim()}
                          className="btn-primary"
                        >
                          Commenter
                        </LoadingButton>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              {/* Comments List */}
              <div className="space-y-6">
                {blog.comments.map((comment, index) => (
                  <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
                        {comment.user.profileImage ? (
                          <img
                            src={`${IMG_URL}${comment.user.profileImage}`}
                            alt={comment.userName}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <FaUser className="text-neutral-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-neutral-900">{comment.userName}</h4>
                          <span className="text-sm text-neutral-500">
                            {formatDate(comment.createdAt)} à {formatTime(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-neutral-700">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {blog.comments.length === 0 && (
                  <div className="text-center py-8 text-neutral-500">
                    <FaComment className="text-4xl mx-auto mb-4" />
                    <p>Aucun commentaire pour le moment.</p>
                    <p className="text-sm">Soyez le premier à commenter cet article !</p>
                  </div>
                )}
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Author Card */}
              <div className="card bg-white p-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">À propos de l'auteur</h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-neutral-200">
                    {blog.author.profileImage ? (
                      <img
                        src={`${IMG_URL}${blog.author.profileImage}`}
                        alt={blog.author.firstName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-sky-100 flex items-center justify-center">
                        <FaUserMd className="text-sky-600 text-2xl" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-900">
                      Dr. {blog.author.firstName} {blog.author.lastName}
                    </h4>
                    {blog.author.specialty && (
                      <p className="text-sm text-neutral-600">{blog.author.specialty}</p>
                    )}
                  </div>
                </div>
                <Link
                  to={`/doctor/${blog.author._id}`}
                  className="btn-primary w-full text-center"
                >
                  Voir le profil
                </Link>
              </div>

              {/* Related Articles */}
              {relatedBlogs.length > 0 && (
                <div className="card bg-white p-6">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">Articles similaires</h3>
                  <div className="space-y-4">
                    {relatedBlogs.map((relatedBlog) => (
                      <Link
                        key={relatedBlog._id}
                        to={`/blog/${relatedBlog.slug}`}
                        className="block group"
                      >
                        <div className="flex gap-3">
                          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            {relatedBlog.featuredImage ? (
                              <img
                                src={`${IMG_URL}${relatedBlog.featuredImage}`}
                                alt={relatedBlog.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            ) : (
                              <div className="w-full h-full bg-sky-100 flex items-center justify-center">
                                <FaUser className="text-sky-600" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-neutral-900 group-hover:text-sky-600 transition-colors line-clamp-2">
                              {relatedBlog.title}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1">
                              <FaCalendarAlt />
                              <span>{formatDate(relatedBlog.publishedAt)}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default BlogPost;
