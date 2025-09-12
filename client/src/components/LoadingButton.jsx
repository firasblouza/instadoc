import { FaHeartbeat } from "react-icons/fa";

const LoadingButton = ({ 
  isLoading, 
  children, 
  className = "btn-primary", 
  loadingText = "Chargement...",
  ...props 
}) => {
  return (
    <button
      {...props}
      disabled={isLoading || props.disabled}
      className={`${className} ${isLoading ? 'cursor-not-allowed opacity-75' : ''}`}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <FaHeartbeat className="text-red-400 animate-pulse" />
          <span>{loadingText}</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default LoadingButton;
