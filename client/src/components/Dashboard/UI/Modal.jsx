import { useState } from "react";
import { FaTimes, FaEye } from "react-icons/fa";
const Modal = ({
  title,
  data,
  firstAction,
  secondAction,
  showModal,
  setShowModal
}) => {
  const capitalize = (text) => {
    if (typeof text == "object") {
      return text[0]
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    } else if (typeof text == "string") {
      return text
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }
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
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <div className="flex flex-row justify-between w-full">
                  <h3
                    className="text-lg leading-6 font-medium text-gray-900"
                    id="modal-headline"
                  >
                    {title}
                  </h3>
                  <button
                    className="m-2 text-gray-500 hover:text-gray-800"
                    onClick={() => setShowModal(false)}
                  >
                    <FaTimes />
                  </button>
                </div>
                <div className="mt-2">
                  <div className="flex flex-col lg:flex-row gap-2">
                    <div className="w-1/3 flex flex-col">
                      <img src={`${data.IMG_URL}${data.profileImage}`} alt="" />
                    </div>
                    <div className="w-2/3">
                      <div className="flex flex-row justify-around py-3">
                        <div className="flex flex-col gap-2">
                          <p className="font-bold">Nom:</p>
                          <p>
                            {data.firstName} {data.lastName}
                          </p>
                          <p className="font-bold">Date du Naissance:</p>
                          <p>
                            {new Date(data.dateOfBirth).toLocaleDateString()}
                          </p>
                          <p className="font-bold">ID Type:</p>
                          <div className="flex flex-row gap-2 items-center">
                            <p>{data.idType}</p>
                            <FaEye
                              className="cursor-pointer"
                              onClick={() => {
                                secondAction(data.idImage);
                              }}
                            />
                          </div>
                          <p className="font-bold">Numero ID:</p>
                          <p>{data.idNumber}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <p className="font-bold"># License Médical:</p>
                          <div className="flex flex-row gap-2 items-center">
                            <p>{data.licenseNumber}</p>
                            <FaEye
                              className="cursor-pointer"
                              onClick={() => {
                                secondAction(data.licenseImage);
                              }}
                            />
                          </div>
                          <p className="font-bold">Spécialité:</p>
                          <p>{capitalize(data.speciality)}</p>
                          <p className="font-bold">Statut:</p>
                          <p>{capitalize(data.verifiedStatus)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row justify-end">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-green-400 border border-transparent rounded-md hover:bg-green-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={() => firstAction(data._id, "approve")}
                  >
                    Valider
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 ml-3 text-sm font-medium text-white bg-red-400 border border-transparent rounded-md hover:bg-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={() => firstAction(data._id, "reject")}
                  >
                    Reject
                  </button>
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
