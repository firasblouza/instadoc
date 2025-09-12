import { btechLogoLight, btechIcon } from "../assets";

const BTechBranding = ({ variant = "light", size = "sm", className = "" }) => {
  const sizeClasses = {
    xs: "w-4 h-4",
    sm: "w-5 h-5", 
    md: "w-6 h-6",
    lg: "w-8 h-8"
  };

  const textSizes = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base", 
    lg: "text-lg"
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className={`text-neutral-500 ${textSizes[size]}`}>
        Powered by
      </span>
      <img 
        src={variant === "light" ? btechLogoLight : btechIcon} 
        alt="B-Tech Solutions" 
        className={`${sizeClasses[size]} opacity-80 hover:opacity-100 transition-opacity duration-200`}
      />
      <a 
        href="https://btech-solutions.tn" 
        target="_blank" 
        rel="noopener noreferrer"
        className={`hover:text-primary-500 transition-colors duration-200 font-medium ${textSizes[size]} text-neutral-600`}
      >
        B-Tech Solutions
      </a>
    </div>
  );
};

export default BTechBranding;




