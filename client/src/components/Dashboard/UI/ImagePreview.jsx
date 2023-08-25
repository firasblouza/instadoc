import { FaTimes } from "react-icons/fa";

const ImagePreview = ({ imageModal, setImageModal }) => {
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center">
      <div className="absolute inset-0 bg-gray-500 opacity-20"></div>
      <div className="relative bg-white rounded-lg overflow-hidden z-20 max-w-lg ">
        <button
          className="absolute top-0 right-0 m-2 text-gray-500 hover:text-gray-800"
          onClick={() => setImageModal(false)}
        >
          <FaTimes />
        </button>
        <img
          src={imageModal.image}
          alt=""
          className="w-full max-w- h-auto z-60"
        />
      </div>
    </div>
  );
};

export default ImagePreview;
