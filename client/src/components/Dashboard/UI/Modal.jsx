import { useState, useEffect } from "react";
import { FaTimes, FaEye } from "react-icons/fa";
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
  setShowModal
}) => {
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showModal]);

  const handleModalClose = () => {
    setShowModal(false);
    document.body.style.overflow = "auto";
  };

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className=" bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex flex-col lg:flex-row sm:items-start">
              <div className="mt-3 text-center sm:mt-0  sm:text-left w-full">
                <div className="flex flex-row justify-between w-full">
                  <h3
                    className="text-lg leading-6 text-center md:text-left font-medium text-gray-900"
                    id="modal-headline"
                  >
                    {title}
                  </h3>
                  <button
                    className="m-2 text-gray-500 hover:text-gray-800"
                    onClick={handleModalClose}
                  >
                    <FaTimes />
                  </button>
                </div>
                <div className="ModalContent  mt-2">{children}</div>
                <div className="flex flex-row justify-center md:justify-end my-3">
                  {firstButton && firstButton !== "" && (
                    <button
                      type="button"
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-green-400 border border-transparent rounded-md hover:bg-green-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                      onClick={
                        firstAction
                          ? () => firstAction(...(firstActionArgs || []))
                          : undefined
                      }
                    >
                      {firstButton}
                    </button>
                  )}
                  {secondButton && secondButton !== "" && (
                    <button
                      type="button"
                      className="inline-flex justify-center px-4 py-2 ml-3 text-sm font-medium text-white bg-red-400 border border-transparent rounded-md hover:bg-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                      onClick={
                        secondAction
                          ? secondAction === "close"
                            ? handleModalClose
                            : () => secondAction(...(secondActionArgs || []))
                          : undefined
                      }
                    >
                      {secondButton}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
