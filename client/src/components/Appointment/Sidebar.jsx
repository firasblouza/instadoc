import { useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import PropTypes from 'prop-types';
import {
  FaPlus,
  FaTrash,
  FaTimes
} from "react-icons/fa";
import AuthContext from "../../context/AuthContext";
import BTechBranding from "../BTechBranding";

import axios from "../../api/axios";

import useAccessToken from "../../hooks/useAccessToken";

const Sidebar = ({ appointment, isOpen, role, notes, setNotes, socket, handleSidebarToggle, endConsultation }) => {
  const [newNote, setNewNote] = useState("");
  const [selectedNoteIndex, setSelectedNoteIndex] = useState(null);

  const { accessToken } = useAccessToken();
  const navigate = useNavigate();
  const { API_URL } = useContext(AuthContext);
  const IMG_URL = `${API_URL}/uploads/`;
  const IMG_Placeholder = `${API_URL}/imagePlaceholder.png`;

  const handleAddNote = async (e, id) => {
    if (newNote) {
      setNotes((prevNotes) => [...prevNotes, newNote]); // Add the newNote to the notes array
      setNewNote(""); // Clear the input field
      const updatedNotes = [...notes, newNote];
      const update = await axios.put(`/appointments/modify/${id}`, {
        notes: updatedNotes
      });
      socket.emit("add-note", updatedNotes, id);
    }
  };

  const handleNoteDelete = async (index, id) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    setNotes(updatedNotes);
    setSelectedNoteIndex(null);
    const updateNotes = await axios.put(`/appointments/modify/${id}`, {
      notes: updatedNotes
    });
    socket.emit("delete-note", updatedNotes, id);
  };

  useEffect(() => {
    socket.on("add-note", (updatedNotes) => {
      setNotes(updatedNotes);
    });

    socket.on("delete-note", (updatedNotes) => {
      setNotes(updatedNotes);
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    return () => {
      socket.off("add-note");
      socket.off("delete-note");
    };
  }, [socket, setNotes]);

  const handleNoteClick = (index) => {
    setSelectedNoteIndex(index);
  };

  const otherParty = role === 'doctor' ? appointment.patient : appointment.doctor;
  const otherPartyRole = role === 'doctor' ? 'Patient' : 'Médecin';

  const statusPill = (status) => {
    switch(status) {
      case 'approved': return <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">Active</span>;
      case 'completed': return <span className="px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">Terminée</span>;
      default: return <span className="px-2 py-1 text-xs font-medium text-gray-800 bg-gray-100 rounded-full">{status}</span>;
    }
  }

  return (
    <nav
      className={`fixed md:static w-full md:w-96 bg-neutral-800 text-white border-r border-neutral-700 h-full z-20 ${
        isOpen ? "block" : "hidden"
      } md:block flex-shrink-0 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 scrollbar-thin scrollbar-thumb-neutral-600 scrollbar-track-neutral-800`}
    >
      <div className="h-full flex flex-col">
        <div className="p-4 flex justify-between items-center border-b border-neutral-700 md:hidden">
            <h2 className="font-semibold">Détails</h2>
            <button onClick={handleSidebarToggle} className="p-2 text-neutral-400 hover:text-white">
                <FaTimes />
            </button>
         </div>
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Party Info */}
          <div className="text-center">
            <div className="w-24 h-24 rounded-full mx-auto overflow-hidden border-4 border-neutral-700 shadow-lg mb-3">
              <img
                src={otherParty.profileImage ? `${IMG_URL}${otherParty.profileImage}` : IMG_Placeholder}
                alt={otherParty.firstName}
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-xl font-bold text-white">
              {otherParty.firstName} {otherParty.lastName}
            </h2>
            <p className="text-sm text-neutral-400">{otherPartyRole}</p>
          </div>
          
          {/* Appointment Details */}
          <div className="space-y-4">
            <div className="bg-neutral-700/50 p-4 rounded-xl">
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Date</p>
              <p className="font-medium text-neutral-100">{new Date(appointment.startDateTime || appointment.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div className="bg-neutral-700/50 p-4 rounded-xl">
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Motif</p>
              <p className="text-neutral-100 text-sm">{appointment.reason}</p>
            </div>
            <div className="bg-neutral-700/50 p-4 rounded-xl flex justify-between items-center">
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">État</p>
              {statusPill(appointment.status)}
            </div>
          </div>
          
          {/* Notes Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-neutral-300 uppercase tracking-wider">
              {role === 'doctor' ? 'Notes de consultation' : 'Notes du médecin'}
            </h3>
            
            {/* Notes List */}
            <div className="bg-neutral-700/50 rounded-xl p-2 min-h-[120px]">
              {notes && notes.length > 0 ? (
                <ul className="space-y-2">
                  {notes.map((note, index) => (
                    <li
                      key={index}
                      onClick={() => handleNoteClick(index)}
                      className={`text-sm p-2 rounded-md flex justify-between items-center text-neutral-200 ${selectedNoteIndex === index ? 'bg-primary-500/20' : 'hover:bg-neutral-600/50'}`}
                    >
                      <span>{note}</span>
                      {selectedNoteIndex === index && role === 'doctor' && (
                        <button onClick={() => handleNoteDelete(selectedNoteIndex, appointment._id)} className="text-red-400 hover:text-red-500">
                          <FaTrash />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex items-center justify-center h-full text-xs text-neutral-500">Aucune note.</div>
              )}
            </div>
            
            {/* Add Note Form (doctor only) */}
            {role === "doctor" && appointment.status !== "completed" && (
              <div className="relative">
                <input
                  type="text"
                  value={newNote}
                  placeholder="Ajouter une note..."
                  className="bg-neutral-700/50 p-3 rounded-xl w-full text-sm text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 pr-10"
                  onChange={(e) => setNewNote(e.target.value)}
                />
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-neutral-400 hover:text-white"
                  onClick={(e) => handleAddNote(e, appointment._id)}
                >
                  <FaPlus />
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer Actions */}
        <div className="p-6 mt-auto border-t border-neutral-700 space-y-4">
          {role === 'doctor' && appointment.status !== "completed" && (
            <button
              className="btn-danger w-full md:hidden"
              onClick={endConsultation}
            >
              Terminer la Consultation
            </button>
          )}
           {role !== 'doctor' && (
            <p className="text-xs text-center text-neutral-500 md:hidden">Seul le médecin peut terminer la consultation.</p>
          )}
          <BTechBranding variant="dark" className="justify-center" />
        </div>
      </div>
    </nav>
  );
};

Sidebar.propTypes = {
    appointment: PropTypes.object.isRequired,
    isOpen: PropTypes.bool.isRequired,
    role: PropTypes.string.isRequired,
    notes: PropTypes.array,
    setNotes: PropTypes.func.isRequired,
    socket: PropTypes.object.isRequired,
    handleSidebarToggle: PropTypes.func.isRequired,
    endConsultation: PropTypes.func.isRequired
};

export default Sidebar;
