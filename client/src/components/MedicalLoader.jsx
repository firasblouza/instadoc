import { FaUserMd, FaHeartbeat, FaStethoscope } from "react-icons/fa";

/* eslint-disable react/prop-types */
const MedicalLoader = ({ type = "heartbeat", message = "Chargement..." }) => {
  const HeartbeatLoader = () => (
    <div className="flex flex-col bg-white items-center space-y-6">
      <div className="relative">
        {/* Heartbeat Animation */}
        <div className="flex items-center justify-center">
          <FaHeartbeat className="text-6xl text-red-500 animate-pulse" />
        </div>
        
        {/* Heartbeat Line */}
        <div className="mt-4 w-32 h-1  rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse heartbeat-line"></div>
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-lg font-medium text-neutral-700">{message}</p>
        <p className="text-sm text-neutral-500">Veuillez patienter...</p>
      </div>
    </div>
  );

  const StethoscopeLoader = () => (
    <div className="flex flex-col items-center space-y-6">
      <div className="relative">
        {/* Rotating Stethoscope */}
        <div className="animate-spin">
          <FaStethoscope className="text-6xl text-primary-500" />
        </div>
        
        {/* Pulse Rings */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 border-2 border-primary-300 rounded-full animate-ping"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 border-2 border-secondary-300 rounded-full animate-ping animation-delay-200"></div>
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-lg font-medium text-neutral-700">{message}</p>
        <p className="text-sm text-neutral-500">Préparation en cours...</p>
      </div>
    </div>
  );

  const DoctorLoader = () => (
    <div className="flex flex-col items-center space-y-6">
      <div className="relative">
        {/* Doctor Icon with Pulse */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center animate-pulse">
          <FaUserMd className="text-3xl text-white" />
        </div>
        
        {/* Medical Cross Animation */}
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg animate-bounce">
          <div className="relative w-4 h-4">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-1 bg-red-500 rounded"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-4 bg-red-500 rounded"></div>
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-lg font-medium text-neutral-700">{message}</p>
        <p className="text-sm text-neutral-500">Connexion sécurisée...</p>
      </div>
    </div>
  );

  const MedicalPulseLoader = () => (
    <div className="flex flex-colitems-center space-y-6">
      <div className="relative flex items-center justify-center">
        {/* Central Medical Icon */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center z-10">
          <FaUserMd className="text-2xl text-white" />
        </div>
        
        {/* Animated Pulse Rings */}
        <div className="absolute inset-0">
          <div className="w-16 h-16 border-4 border-primary-300 rounded-full animate-ping"></div>
        </div>
        <div className="absolute inset-0">
          <div className="w-20 h-20 border-4 border-secondary-300 rounded-full animate-ping animation-delay-300"></div>
        </div>
        <div className="absolute inset-0">
          <div className="w-24 h-24 border-4 border-primary-200 rounded-full animate-ping animation-delay-600"></div>
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-lg font-medium text-neutral-700">{message}</p>
        <div className="flex items-center justify-center gap-1 mt-2">
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse animation-delay-200"></div>
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse animation-delay-400"></div>
        </div>
      </div>
    </div>
  );

  const renderLoader = () => {
    switch (type) {
      case "heartbeat":
        return <HeartbeatLoader />;
      case "stethoscope":
        return <StethoscopeLoader />;
      case "doctor":
        return <DoctorLoader />;
      case "pulse":
        return <MedicalPulseLoader />;
      default:
        return <HeartbeatLoader />;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-50 to-white">
      <div className="text-center">
        {renderLoader()}
      </div>
    </div>
  );
};

export default MedicalLoader;
