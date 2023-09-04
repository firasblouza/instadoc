import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

import axios from "../../api/axios";

import useAccessToken from "../../hooks/useAccessToken";

const Sidebar = ({ appointment, isOpen, role, notes, setNotes, socket }) => {
  const [newNote, setNewNote] = useState("");
  const [selectedNoteIndex, setSelectedNoteIndex] = useState(null);

  // Handle add notes

  const handleAddNote = async (e, id) => {
    if (newNote) {
      setNotes((prevNotes) => [...prevNotes, newNote]); // Add the newNote to the notes array
      setNewNote(""); // Clear the input field
      const updateNotes = await axios.put(`/appointments/modify/${id}`, {
        notes: [...notes, newNote]
      });
      socket.emit("noteAdded", newNote);
    }
  };
  const handleNoteClick = (index) => {
    setSelectedNoteIndex(index);
  };

  const handleNoteDelete = async (index, id) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    setNotes(updatedNotes);
    setSelectedNoteIndex(null);
    const updateNotes = await axios.put(`/appointments/modify/${id}`, {
      notes: updatedNotes
    });
  };

  return (
    <nav
      className={`absolute md:static w-full origin-top md:w-1/4 bg-gray-800 text-white h-[calc(100vh-60px)] z-20  ${
        isOpen ? "block" : "hidden md:block"
      } overflow-auto`}
    >
      {role === "doctor" ? (
        // Appointment Details
        <div className="flex flex-col items-start justify-center w-full gap-2">
          <div className="infoGroup flex flex-row gap-2 w-full px-4 py-1">
            <p className="font-bold text-lg">Patient: </p>
            <p className="font-normal text-lg">
              {appointment.patient.firstName} {appointment.patient.lastName}
            </p>
          </div>

          <div className="infoGroup flex flex-row gap-2 w-full px-4 py-1">
            <p className="font-bold text-lg">Date: </p>
            <p className="font-normal text-lg ">{appointment.date}</p>
          </div>

          <div className="infoGroup flex flex-row gap-2 w-full px-4 py-1">
            <p className="font-bold text-lg">Motif: </p>
            <p className="font-normal text-lg w-full h-20 p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent bg-white text-black list-none overflow-auto">
              {appointment.reason}
            </p>
          </div>

          <div className="infoGroup flex flex-row gap-2 w-full px-4 py-1">
            <p className="font-bold text-lg">Etat: </p>
            <p className="font-normal text-lg whitespace-nowrap">
              {appointment.status === "approved" ? "Active" : "Terminée"}
            </p>
          </div>

          {/*  Section to add notes concerning the consultation */}

          <div className="infoGroup flex flex-col gap-3 w-full px-4 py-1">
            <p className="font-bold text-lg">Notes: </p>

            <input
              type="text"
              value={newNote}
              placeholder="Ajouter une note"
              className="w-full px-2 py-1 rounded-md bg-gray-700 hover:bg-gray-600 text-white"
              onChange={(e) => setNewNote(e.target.value)}
            />
            <button
              className="w-full px-2 py-1 rounded-md bg-gray-700 hover:bg-gray-600 text-white"
              onClick={(e) => handleAddNote(e, appointment._id)}
            >
              Ajouter
            </button>
            <ul className="w-full h-32 p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent bg-white text-black list-none overflow-auto">
              {notes.map((note, index) => (
                <li
                  key={index}
                  onClick={() => handleNoteClick(index)}
                  className={
                    index === selectedNoteIndex ? "bg-gray-300 rounded-sm" : ""
                  }
                >
                  {note}
                </li>
              ))}
            </ul>
            {selectedNoteIndex !== null && (
              <div className="flex flex-col md:flex-row gap-2">
                <button
                  className="w-full px-2 py-1 rounded-md bg-gray-700 text-white"
                  onClick={() =>
                    handleNoteDelete(selectedNoteIndex, appointment._id)
                  }
                >
                  Supprimer
                </button>
              </div>
            )}
            {appointment.status !== "completed" ? (
              <button
                className="w-full px-2 py-1 rounded-md bg-gray-700 text-white"
                onClick={() => endConsultation(appointment._id)}
              >
                Terminer Consultation
              </button>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-start justify-center w-full gap-2">
          <div className="infoGroup flex flex-row gap-2 w-full px-4 py-3">
            <p className="font-bold text-lg">Doctor: </p>
            <p className="font-normal text-lg whitespace-nowrap">
              {appointment.doctor.firstName} {appointment.doctor.lastName}
            </p>
          </div>

          <div className="infoGroup flex flex-row gap-2 w-full px-4 py-3">
            <p className="font-bold text-lg">Date: </p>
            <p className="font-normal text-lg whitespace-nowrap">
              {appointment.date}
            </p>
          </div>

          <div className="infoGroup flex flex-row gap-2 w-full px-4 py-3">
            <p className="font-bold text-lg">Motif: </p>
            <p className="font-normal text-lg w-full h-20 p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent bg-white text-black list-none overflow-auto">
              {appointment.reason}
            </p>
          </div>

          <div className="infoGroup flex flex-row gap-2 w-full px-4 py-3">
            <p className="font-bold text-lg">Etat: </p>
            <p className="font-normal text-lg whitespace-nowrap">
              {appointment.status === "approved" ? "Active" : "Terminée"}
            </p>
          </div>

          <div className="infoGroup flex flex-col gap-2 w-full px-4 py-3">
            <p className="font-bold text-lg">Notes de médecin: </p>

            <ul className="w-full h-32 p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent bg-white text-black list-none overflow-auto">
              {notes.map((note, index) => (
                <li
                  key={index}
                  onClick={() => handleNoteClick(index)}
                  className={
                    index === selectedNoteIndex ? "bg-gray-300 rounded-sm" : ""
                  }
                >
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Sidebar;
