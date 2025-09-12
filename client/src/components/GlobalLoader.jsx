import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

const GlobalLoader = () => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300">
      <div className="text-center space-y-6">
        {/* Beating Blue Heart */}
        <div className="relative flex items-center justify-center">
          <FaHeart className="text-6xl text-primary-500 heartbeat-scale" />
          
          {/* Blue Pulse Rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 border-2 border-primary-300 rounded-full animate-ping opacity-75"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 border-2 border-primary-400 rounded-full animate-ping animation-delay-300 opacity-50"></div>
          </div>
        </div>

        {/* Loading Dots */}
        <div className="space-y-4">
          <p className="text-lg font-medium text-neutral-700">Navigation...</p>
          <div className="flex items-center justify-center gap-2">
            <div className="w-3 h-3 bg-primary-500 rounded-full loading-dot-1"></div>
            <div className="w-3 h-3 bg-primary-500 rounded-full loading-dot-2"></div>
            <div className="w-3 h-3 bg-primary-500 rounded-full loading-dot-3"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalLoader;
