import { useEffect } from "react";
import { FaTimes } from "react-icons/fa";

const Modal = ({
  title,
  children,
  firstAction,
  secondAction,
  firstActionArgs,
  secondActionArgs,
  firstButton,
  secondButton,
  showModal,
  setShowModal,
  size = "md"
}) => {
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModal]);

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleModalClose();
    }
  };

  const sizeClasses = {
    sm: "sm:max-w-md",
    md: "sm:max-w-lg",
    lg: "sm:max-w-2xl",
    xl: "sm:max-w-4xl"
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleBackdropClick}
      />

      {/* Modal Container */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className={`relative bg-white rounded-2xl shadow-2xl transform transition-all duration-300 w-full ${sizeClasses[size]} max-h-[95vh] flex flex-col`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-200 flex-shrink-0">
            <h3
              id="modal-title"
              className="heading-4 text-neutral-900"
            >
              {title}
            </h3>
            <button
              onClick={handleModalClose}
              className="w-10 h-10 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 hover:text-neutral-700 transition-all duration-200"
            >
              <FaTimes />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto flex-1 min-h-0">
            {children}
          </div>

          {/* Footer */}
          {(firstButton || secondButton) && (
            <div className="flex items-center justify-end gap-3 p-6 border-t border-neutral-200 bg-neutral-50 flex-shrink-0">
              {secondButton && (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={
                    secondAction === "close"
                      ? handleModalClose
                      : () => secondAction?.(...(secondActionArgs || []))
                  }
                >
                  {secondButton}
                </button>
              )}
              {firstButton && (
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => firstAction?.(...(firstActionArgs || []))}
                >
                  {firstButton}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
