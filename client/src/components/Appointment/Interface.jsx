import { useEffect, useRef, useState, useContext, useCallback } from "react";
import PropTypes from "prop-types";
import {
  FaPaperPlane,
  FaArrowLeft,
  FaPaperclip,
  FaFilePdf,
  FaFileWord,
  FaFileAlt,
  FaBars,
  FaTimes
} from "react-icons/fa";
import AuthContext from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "../Notifications/ToastContainer";
import { getImageURL } from "../../lib/constants";

import axios from "../../api/axios";

import useAccessToken from "../../hooks/useAccessToken";

const Interface = ({ appointment, client, socket, handleSidebarToggle, endConsultation }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const chatBox = useRef();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const { accessToken } = useAccessToken();
  const { showError } = useToast();

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const fetchMessages = useCallback(async () => {
    if (appointment && appointment._id) {
      try {
        const response = await axios.get(`/appointments/${appointment._id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        if (response.status === 200) {
          const messagesList = response.data.messages;
          if (messagesList.length > 0) {
            setMessages(messagesList);
          } else {
            setMessages([]);
          }
        } else {
          console.log("Error fetching Messages");
        }
      } catch (err) {
        console.log(err);
      }
    }
  }, [appointment, accessToken]);

  useEffect(() => {
    socket.on("send-message", (messageObj) => {
      setMessages((prevMessage) => [...prevMessage, messageObj]);
    });

    fetchMessages();

    return () => {
      socket.off("send-message");
    };
  }, [socket, fetchMessages]);

  useEffect(() => {
    // Check if appointment.messages is defined
    if (appointment.messages && appointment.messages.length < 0) {
      const firstMessage = {
        senderId: appointment.patient.userId,
        senderName: `${appointment.patient.firstName} ${appointment.patient.lastName}`,
        role: appointment.patient.role,
        content: appointment.reason
      };
      setMessages((prevMessages) => [...prevMessages, firstMessage]);
    }
    if (appointment.messages && appointment.messages.length > 0) {
      setMessages(appointment.messages);
    }

    return () => {
      setMessages([]);
    };
  }, [appointment]);

  const sendMessage = async () => {
    if (input && input !== "") {
      try {
        const messageObj = {
          senderId: client.id,
          senderName: client.fullName,
          role: client.role,
          content: input.trim(),
          createdAt: new Date().toISOString()
        };
        setMessages((prevMessages) => [...prevMessages, messageObj]);
        socket.emit("send-message", messageObj, appointment._id);
        setInput("");

        const send = await axios.put(
          `/appointments/message/${appointment._id}`,
          messageObj,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        );
        if (send.status === 200) {
          console.log("Message Sent");
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      showError("Le message ne peut pas être vide");
    }
  };
  
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('chatFile', file);

    try {
      const response = await axios.post(`/appointments/message/${appointment._id}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${accessToken}`
        }
      });
      
      const { fileUrl, fileName, fileType } = response.data;
      
      const messageObj = {
        senderId: client.id,
        senderName: client.fullName,
        role: client.role,
        content: `Fichier: ${fileName}`,
        fileUrl,
        fileName,
        fileType,
        createdAt: new Date().toISOString()
      };

      setMessages((prevMessages) => [...prevMessages, messageObj]);
      socket.emit("send-message", messageObj, appointment._id);
      setInput("");
      
      await axios.put(`/appointments/message/${appointment._id}`, messageObj, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

    } catch (error) {
      console.error("File upload failed", error);
      showError("Erreur lors de l'envoi du fichier");
    }
  };

  useEffect(() => {
    // Scroll the chatbox to the bottom on component load
    if (chatBox.current) {
      const chatbox = chatBox.current;
      chatbox.scrollTop = chatbox.scrollHeight;
    }
  }, [messages]);

  const { API_URL } = useContext(AuthContext);
  const IMG_URL = (filename) => getImageURL(filename);
  const IMG_Placeholder = getImageURL("imagePlaceholder.png");
  
  const MessageBubble = ({ msg, isMine, party }) => {
    const partyImage = party?.profileImage ? IMG_URL(party.profileImage) : IMG_Placeholder;
    
    const renderContent = () => {
      switch (msg.fileType) {
        case 'image':
          return <img src={`${API_URL}${msg.fileUrl}`} alt={msg.fileName} className="rounded-lg max-w-xs cursor-pointer" onClick={() => window.open(`${API_URL}${msg.fileUrl}`, '_blank')} />;
        case 'file':
          return (
            <a href={`${API_URL}${msg.fileUrl}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-neutral-200/50 p-2 rounded-lg hover:bg-neutral-200">
              {msg.fileName.endsWith('.pdf') ? <FaFilePdf /> : msg.fileName.endsWith('.doc') || msg.fileName.endsWith('.docx') ? <FaFileWord /> : <FaFileAlt />}
              <span className="text-sm font-medium">{msg.fileName}</span>
            </a>
          );
        default:
          return <p className="text-sm">{msg.content}</p>;
      }
    };

    return (
      <div className={`flex items-start gap-3 ${isMine ? "flex-row-reverse" : ""}`}>
        <img src={partyImage} alt={party?.firstName} className="w-8 h-8 rounded-full object-cover" />
        <div className={`p-3 rounded-2xl ${isMine ? "bg-primary-500 text-white rounded-br-none" : "bg-white text-neutral-800 rounded-bl-none shadow-sm"}`}>
          {renderContent()}
          <p className="text-xs opacity-70 mt-1 text-right">{new Date(msg.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
      </div>
    );
  };

  MessageBubble.propTypes = {
    msg: PropTypes.shape({
      fileType: PropTypes.string,
      fileUrl: PropTypes.string,
      fileName: PropTypes.string,
      content: PropTypes.string,
      createdAt: PropTypes.string.isRequired
    }).isRequired,
    isMine: PropTypes.bool.isRequired,
    party: PropTypes.shape({
      profileImage: PropTypes.string,
      firstName: PropTypes.string
    })
  };
  
  const otherParty = client.role === 'doctor' ? appointment.patient : appointment.doctor;

  return (
    <div className="flex flex-col w-full h-full bg-neutral-50">
      <div className="flex items-center justify-between p-3 bg-white border-b border-neutral-200">
        <div className="flex items-center">
          <button onClick={() => navigate('/dashboard')} className="p-2 rounded-full hover:bg-neutral-100">
            <FaArrowLeft className="text-neutral-600" />
          </button>
          <div className="flex items-center gap-3 ml-2">
            <img 
              src={otherParty.profileImage ? IMG_URL(otherParty.profileImage) : IMG_Placeholder} 
              alt={otherParty.firstName} 
              className="w-10 h-10 rounded-full object-cover" 
            />
            <div>
              <h2 className="font-semibold text-neutral-800">{otherParty.firstName} {otherParty.lastName}</h2>
              <p className="text-xs text-green-500">En ligne</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {client.role === 'doctor' && appointment.status !== 'completed' && (
            <button onClick={endConsultation} className="btn-danger-sm hidden md:flex items-center gap-2">
              <FaTimes />
              <span>Terminer</span>
            </button>
          )}
          <button onClick={handleSidebarToggle} className="p-2 rounded-full hover:bg-neutral-100 md:hidden">
            <FaBars className="text-neutral-600" />
          </button>
        </div>
      </div>
      <div
        ref={chatBox}
        className="flex-1 p-6 space-y-6 overflow-y-auto"
      >
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-sm text-neutral-400">
            Commencez la conversation.
          </div>
        )}
        {messages.map((message, index) => {
          const isMine = client.id === message.senderId;
          const party = isMine ? client : (client.role === 'doctor' ? appointment.patient : appointment.doctor);
          return <MessageBubble key={index} msg={message} isMine={isMine} party={party} />;
        })}
      </div>

      <div className="p-4 bg-white border-t border-neutral-200">
        <div className="flex items-center gap-3">
          <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileUpload} />
          <button onClick={() => fileInputRef.current.click()} className="btn-icon">
            <FaPaperclip />
          </button>
          <input
            type="text"
            value={input}
            placeholder="Écrire un message..."
            className="flex-1 input-style"
            onChange={(e) => handleInputChange(e)}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />
          <button
            className="btn-primary"
            onClick={sendMessage}
          >
            <FaPaperPlane />
            <span className="ml-2 hidden sm:inline">Envoyer</span>
          </button>
        </div>
      </div>
    </div>
  );
};

Interface.propTypes = {
  appointment: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    messages: PropTypes.array,
    patient: PropTypes.object,
    doctor: PropTypes.object,
    status: PropTypes.string,
    reason: PropTypes.string
  }).isRequired,
  client: PropTypes.shape({
    id: PropTypes.string.isRequired,
    fullName: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired
  }).isRequired,
  socket: PropTypes.object.isRequired,
  handleSidebarToggle: PropTypes.func.isRequired,
  endConsultation: PropTypes.func.isRequired
};

export default Interface;
