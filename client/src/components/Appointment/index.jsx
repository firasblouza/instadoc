import { useState, useEffect, useRef, useContext } from "react";
import { useParams, useNavigate, Outlet, Link } from "react-router-dom";

import useAuth from "../../hooks/useAuth";
import Sidebar from "./Sidebar";
import Interface from "./Interface";

import useAccessToken from "../../hooks/useAccessToken";
import axios from "../../api/axios";

import { socket } from "./socket";

// TODO: Implement the DAMN SOCKET krztni

const Appointment = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [appointment, setAppointment] = useState({});
  const [notes, setNotes] = useState([]);

  const effectRan = useRef(false);

  const { apptId } = useParams();
  const { accessToken, decodedToken } = useAccessToken();

  const { auth } = useAuth();

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const fetchPatient = async (patientId) => {
    try {
      if (accessToken && accessToken !== "") {
        const response = await axios.get(`/users/${patientId}`);
        return response.data;
      } else {
        console.log("No access token found");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log("Unauthorized: You need to log in or refresh your token");
      } else {
        console.log("An error occurred while fetching data:", error.message);
      }
    }
  };

  // Function to fetch the appointments

  const fetchAppointment = async () => {
    try {
      if (accessToken && accessToken !== "") {
        const doctorId = decodedToken.UserInfo.id;
        const response = await axios.get(`/appointments/${apptId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}` // Attach the token to the Authorization header
          }
        });
        const patient = await fetchPatient(response.data.userId);
        const doctor = await axios.get(`/doctors/${response.data.doctorId}`);
        if (patient && doctor) {
          const appointmentData = {
            ...response.data,
            patient,
            doctor: doctor.data
          };
          setAppointment(appointmentData);
          setNotes(appointmentData.notes);
        }
      } else {
        console.log("No access token found");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log("Unauthorized: You need to log in or refresh your token");
      } else {
        console.log("An error occurred while fetching data:", error.message);
      }
    }
  };

  // Load the appointments on component mount

  useEffect(() => {
    if (effectRan.current === false) {
      fetchAppointment();
    }
    return () => {
      effectRan.current = true;
    };
  }, []);

  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const initializeSocket = () => {
      if (!isConnected) {
        socket.auth = { apptId };
        socket.connect();
        setIsConnected(true);
        console.log("Socket connecting");
      }
    };

    const disconnectSocket = () => {
      socket.disconnect();
      setIsConnected(false);
    };

    initializeSocket();

    return () => {
      disconnectSocket();
    };
  }, []);

  // Listen for the "connect" event inside a separate useEffect
  useEffect(() => {
    const handleSocketConnect = () => {
      console.log(`Socket connected with id: ${socket.id} apptId : ${apptId}`);
    };

    socket.on("connect", handleSocketConnect);

    return () => {
      socket.off("connect", handleSocketConnect);
    };
  }, []); // This effect runs once when the component mounts

  return (
    <section id="apptDashboard" className="relative w-full flex flex-col">
      <div className="flex justify-between items-center bg-sky-400 text-white p-4">
        <button
          className="block md:hidden text-white focus:outline-none"
          onClick={handleSidebarToggle}
        >
          <svg
            className="h-6 w-6 fill-current"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isSidebarOpen ? (
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M19.293 4.293a1 1 0 0 0-1.414-1.414L12 10.586 5.121 3.707a1 1 0 1 0-1.414 1.414L10.586 12l-6.879 6.879a1 1 0 1 0 1.414 1.414L12 13.414l6.879 6.879a1 1 0 1 0 1.414-1.414L13.414 12l6.879-6.879z"
              />
            ) : (
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4 6a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1zm0 5a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1zm0 5a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1z"
              />
            )}
          </svg>
        </button>
        {Object.keys(appointment).length > 0 && (
          <h1 className="text-xl font-bold">
            Consultation - {appointment.patient.firstName}{" "}
            {appointment.patient.lastName}
          </h1>
        )}
      </div>
      <div className="dashContainer flex flex-row w-full">
        {Object.keys(appointment).length > 0 && (
          <Sidebar
            appointment={appointment}
            isOpen={isSidebarOpen}
            role={auth.role}
            notes={notes}
            setNotes={setNotes}
            socket={socket}
          />
        )}
        <div className="w-full md:w-4/5 p-4 max-h-[calc(100vh-60px)] overflow-y-hidden">
          <Interface socket={socket} appointment={appointment} client={auth} />
        </div>
      </div>
    </section>
  );
};

export default Appointment;
