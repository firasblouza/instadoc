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

  const endConsultation = async (id) => {
    try {
      const response = await axios.put(
        `/appointments/modify/${id}`,
        { status: "completed" },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );
      if (response.status === 200) {
        window.alert("Consultation Terminée avec succés");
        navigate("/dashboard/consultations");
      } else {
        window.alert("Désole, une erreur s'est produit");
      }
    } catch (err) {
      console.log(err);
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
    <section className="flex h-screen bg-white overflow-hidden">
      {Object.keys(appointment).length > 0 ? (
        <>
          {isSidebarOpen && <div onClick={handleSidebarToggle} className="fixed inset-0 bg-black/30 z-10 md:hidden" />}
          <Sidebar
            appointment={appointment}
            isOpen={isSidebarOpen} // isSidebarOpen can be controlled for mobile
            role={auth.role}
            notes={notes}
            setNotes={setNotes}
            socket={socket}
            handleSidebarToggle={handleSidebarToggle}
            endConsultation={() => endConsultation(appointment._id)}
          />
          <main className="flex-1 flex flex-col h-screen">
            <Interface 
              socket={socket} 
              appointment={appointment} 
              client={auth} 
              handleSidebarToggle={handleSidebarToggle}
              endConsultation={() => endConsultation(appointment._id)}
            />
          </main>
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <p>Chargement de la consultation...</p>
        </div>
      )}
    </section>
  );
};

export default Appointment;
