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
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const [seenStatus, setSeenStatus] = useState({});
  const [isUserTyping, setIsUserTyping] = useState(false);

  const chatBox = useRef();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const { accessToken } = useAccessToken();
  const { showError } = useToast();

  const handleInputChange = useCallback((e) => {
    setInput(e.target.value);
    
    // Handle typing indicator
    if (!isUserTyping) {
      setIsUserTyping(true);
      socket.emit("typing", {
        appointmentId: appointment?._id,
        userId: client?.id,
        userName: client?.fullName,
        isTyping: true
      });
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsUserTyping(false);
      socket.emit("typing", {
        appointmentId: appointment?._id,
        userId: client?.id,
        userName: client?.fullName,
        isTyping: false
      });
    }, 1000);
  }, [isUserTyping, socket]);

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
  }, [appointment?._id, accessToken]);

  // Socket listeners - set up once and use refs for current values
  useEffect(() => {
    const handleMessage = (messageObj) => {
      setMessages((prevMessage) => [...prevMessage, messageObj]);
    };

    const handleTyping = (data) => {
      // Use current values instead of dependencies
      const currentAppointmentId = appointment?._id;
      const currentClientId = client?.id;
      
      if (data.appointmentId === currentAppointmentId && data.userId !== currentClientId) {
        if (data.isTyping) {
          setTypingUser(data.userName);
          setIsTyping(true);
        } else {
          setTypingUser(null);
          setIsTyping(false);
        }
      }
    };

    const handleMessageSeen = (data) => {
      const currentAppointmentId = appointment?._id;
      
      if (data.appointmentId === currentAppointmentId) {
        setSeenStatus(prev => ({
          ...prev,
          [data.messageId]: {
            seenBy: data.seenBy,
            seenAt: data.seenAt
          }
        }));
      }
    };

    socket.on("send-message", handleMessage);
    socket.on("typing", handleTyping);
    socket.on("message-seen", handleMessageSeen);

    return () => {
      socket.off("send-message", handleMessage);
      socket.off("typing", handleTyping);
      socket.off("message-seen", handleMessageSeen);
    };
  }, [socket]); // Only depend on socket, not appointment or client

  // Fetch messages only when appointment changes
  useEffect(() => {
    if (appointment && appointment._id) {
      fetchMessages();
    }
  }, [appointment?._id, fetchMessages]);

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

  const sendMessage = useCallback(async () => {
    if (input && input !== "") {
      try {
        const messageObj = {
          senderId: client.id,
          senderName: client.fullName,
          role: client.role,
          content: input.trim(),
          createdAt: new Date().toISOString(),
          messageId: Date.now().toString() // Add unique ID for seen tracking
        };
        setMessages((prevMessages) => [...prevMessages, messageObj]);
        socket.emit("send-message", messageObj, appointment._id);
        setInput("");

        // Stop typing indicator when sending message
        setIsUserTyping(false);
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        socket.emit("typing", {
          appointmentId: appointment._id,
          userId: client.id,
          userName: client.fullName,
          isTyping: false
        });

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
  }, [input, client, socket, appointment._id, accessToken, showError]);
  
  const handleFileUpload = useCallback(async (e) => {
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
  }, [appointment._id, accessToken, client, socket, showError]);

  // Mark messages as seen when they come into view
  const markMessageAsSeen = useCallback((messageId) => {
    if (messageId && !seenStatus[messageId]) {
      socket.emit("message-seen", {
        appointmentId: appointment._id,
        messageId: messageId,
        seenBy: client.id,
        seenAt: new Date().toISOString()
      });
    }
  }, [socket, appointment._id, client.id, seenStatus]);

  useEffect(() => {
    // Scroll the chatbox to the bottom on component load
    if (chatBox.current) {
      const chatbox = chatBox.current;
      chatbox.scrollTop = chatbox.scrollHeight;
    }
  }, [messages]);

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const { API_URL } = useContext(AuthContext);
  const IMG_URL = (filename) => getImageURL(filename);
  const IMG_Placeholder = getImageURL("imagePlaceholder.png");
  
  const MessageBubble = ({ msg, isMine, party }) => {
    const partyImage = party?.profileImage ? IMG_URL(party.profileImage) : IMG_Placeholder;
    const messageId = msg.messageId || msg._id;
    const isSeen = seenStatus[messageId];
    
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
        <img 
          src={partyImage} 
          alt={party?.firstName} 
          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
          onLoad={() => {
            // Mark message as seen when image loads
            if (isMine && messageId) {
              markMessageAsSeen(messageId);
            }
          }}
        />
        <div className={`p-3 rounded-2xl ${isMine ? "bg-primary-500 text-white rounded-br-none" : "bg-white text-neutral-800 rounded-bl-none shadow-sm"}`}>
          {renderContent()}
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs opacity-70">{new Date(msg.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
            {isMine && (
              <div className="flex items-center gap-1">
                {isSeen ? (
                  <span className="text-xs opacity-70">✓✓</span>
                ) : (
                  <span className="text-xs opacity-50">✓</span>
                )}
              </div>
            )}
          </div>
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
      createdAt: PropTypes.string.isRequired,
      messageId: PropTypes.string,
      _id: PropTypes.string
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
        
        {/* Typing Indicator */}
        {isTyping && typingUser && (
          <div className="flex items-start gap-3">
            <img 
              src={client.role === 'doctor' ? IMG_URL(appointment.patient?.profileImage) : IMG_URL(appointment.doctor?.profileImage)} 
              alt={typingUser} 
              className="w-8 h-8 rounded-full object-cover" 
            />
            <div className="bg-white text-neutral-800 rounded-2xl rounded-bl-none shadow-sm p-3">
              <div className="flex items-center gap-1">
                <span className="text-sm text-neutral-600">{typingUser} est en train d&apos;écrire</span>
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1 h-1 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1 h-1 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
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
            className="flex-1 px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all outline-none"
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
