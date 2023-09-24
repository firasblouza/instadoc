import { FaTimes } from "react-icons/fa";
import { useState, useEffect } from "react";

const ImagePreview = ({ imageModal, setImageModal }) => {
  useEffect(() => {
    if (imageModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [imageModal]);

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center">
      <div className="absolute inset-0 bg-gray-500 opacity-20"></div>
      <div className="relative bg-white pt-10">
        <button
          className="absolute top-0 right-0 m-2 text-gray-500 hover:text-gray-800"
          onClick={() => setImageModal({ state: false, image: "" })}
        >
          <FaTimes />
        </button>
        <div className="relative bg-white rounded-lg overflow-hidden z-20 max-w-lg max-h-[500px] overflow-y-scroll">
          <img
            src={imageModal.image}
            alt=""
            className="w-full max-w- h-auto z-60"
          />
        </div>
      </div>
    </div>
  );
};

export default ImagePreview;
