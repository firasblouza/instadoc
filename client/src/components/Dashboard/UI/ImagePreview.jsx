import { FaTimes, FaDownload } from "react-icons/fa";
import { useEffect } from "react";

const ImagePreview = ({ imageModal, setImageModal }) => {
  useEffect(() => {
    if (imageModal.state) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [imageModal.state]);

  const handleClose = () => {
    setImageModal({ state: false, image: "" });
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!imageModal.state) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleBackdropClick}
      />

      {/* Image Container */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          <h3 className="font-semibold text-neutral-800">Aperçu du document</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.open(imageModal.image, '_blank')}
              className="w-10 h-10 rounded-full bg-primary-100 hover:bg-primary-200 flex items-center justify-center text-primary-600 transition-all duration-200"
              title="Télécharger"
            >
              <FaDownload />
            </button>
            <button
              onClick={handleClose}
              className="w-10 h-10 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 hover:text-neutral-700 transition-all duration-200"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Image */}
        <div className="p-4 max-h-[calc(90vh-80px)] overflow-auto">
          <img
            src={imageModal.image}
            alt="Document preview"
            className="w-full h-auto max-w-full rounded-lg shadow-md"
          />
        </div>
      </div>
    </div>
  );
};

export default ImagePreview;
