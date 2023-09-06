import { useEffect, useRef, useState } from "react";

import axios from "../../api/axios";

import useAccessToken from "../../hooks/useAccessToken";

const Interface = ({ appointment, client, socket }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const chatBox = useRef();

  const { accessToken, decodedToken } = useAccessToken();

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const fetchMessages = async () => {
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
  };

  useEffect(() => {
    socket.on("send-message", (messageObj) => {
      setMessages((prevMessage) => [...prevMessage, messageObj]);
    });

    fetchMessages();

    return () => {
      socket.off("send-message");
    };
  }, []);

  useEffect(() => {
    // Check if appointment.messages is defined
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
          content: input.trim()
        };
        setMessages((prevMessages) => [...prevMessages, messageObj]);
        socket.emit("send-message", messageObj, appointment._id);
        setInput("");

        const send = await axios.put(
          `/appointments/message/${appointment._id}`,
          messageObj
        );
        if (send.status === 200) {
          console.log("Message Sent");
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      window.alert("Message can't be empty");
    }
  };

  useEffect(() => {
    // Scroll the chatbox to the bottom on component load
    const chatbox = chatBox.current;
    chatbox.scrollTop = chatbox.scrollHeight;
  }, [messages]); // Add

  return (
    // Create an Interface that has a chatbox to receive and send message and below it an input field to send messages
    <div className="flex flex-col items-center justify-center w-full h-[calc(100vh-100px)] max-h-[calc(100vh-100px)] gap-2 ">
      <div
        ref={chatBox}
        className="chatbox flex flex-col items-start justify-start w-full h-full gap-2 border border-black rounded-lg shadow-lg p-4 overflow-auto"
      >
        {messages.length > 0
          ? messages.map((message, index) => {
              return (
                <div
                  key={index}
                  className={`message flex flex-col items-start ${
                    client.role === message.role
                      ? "justify-end items-end"
                      : "justify-start"
                  } w-full h-full gap-2`}
                >
                  <p className="font-bold text-lg">
                    {message.senderName
                      ? message.senderName
                      : client.role === message.role
                      ? "You"
                      : message.role === "doctor"
                      ? "Doctor"
                      : "Patient"}
                  </p>
                  <p
                    className={`font-normal text-lg p-2 rounded-lg ${
                      message.role === "doctor"
                        ? "bg-sky-500"
                        : "bg-emerald-500"
                    } text-white`}
                  >
                    {message.content}
                  </p>
                </div>
              );
            })
          : null}
      </div>
      <div className="input flex flex-col md:flex-row items-start justify-start w-full  gap-2">
        <input
          type="text"
          value={input}
          placeholder="Type your message here"
          className="w-full md:w-4/5 h-8 p-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-transparent bg-white text-black list-none overflow-auto"
          onChange={(e) => handleInputChange(e)}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />
        <button
          className="w-full md:w-1/5 px-2 py-1 rounded-md bg-gray-700 hover:bg-gray-600 text-white"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Interface;
