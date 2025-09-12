import { useState } from "react";
import { FaUpload, FaImage, FaFileAlt, FaIdCard, FaArrowRight, FaArrowLeft, FaCertificate } from "react-icons/fa";
import LoadingButton from "../LoadingButton";

const SignupFinish = ({
  userData,
  setUserData,
  changeStep,
  handleUserSignup
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const fieldName = e.target.name;
    
    if (file) {
      setUserData({ ...userData, [fieldName]: file });
    }
  };

  const handleSubmit = async (e) => {
    setIsLoading(true);
    try {
      await handleUserSignup(e);
    } finally {
      setIsLoading(false);
    }
  };

  const FileUploadField = ({ name, label, icon: Icon, description, currentFile }) => (
    <div>
      <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
        <Icon className="text-primary-500" />
        {label}
      </label>
      <div className="border-2 border-dashed border-neutral-300 rounded-xl p-4 hover:border-primary-500 transition-colors duration-200">
        <div className="text-center">
          <div className="relative inline-block">
            <button
              type="button"
              className="btn-secondary group"
            >
              <FaUpload className="mr-2 group-hover:scale-110 transition-transform duration-200" />
              Choisir un fichier
            </button>
            <input
              type="file"
              name={name}
              accept="image/*,application/pdf"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
          <p className="text-xs text-neutral-500 mt-2">{description}</p>
          {currentFile && (
            <p className="text-xs text-green-600 mt-1 font-medium">
              ✓ {currentFile.name}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ID Document */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
          <FaIdCard className="text-primary-500" />
          Type de pièce d&apos;identité
        </label>
        <select
          value={userData.idType}
          onChange={(e) => setUserData({ ...userData, idType: e.target.value })}
          required
          className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white transition-all duration-200"
        >
          <option value="">Sélectionnez un type</option>
          <option value="idcard">Carte d&apos;identité nationale</option>
          <option value="passport">Passeport</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
            <FaIdCard className="text-primary-500" />
            Numéro
          </label>
          <input
            type="text"
            value={userData.idNumber}
            onChange={(e) => setUserData({ ...userData, idNumber: e.target.value })}
            placeholder="Numéro du document"
            required
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
          />
        </div>
        
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
            <FaCertificate className="text-primary-500" />
            N° Licence médicale
          </label>
          <input
            type="text"
            value={userData.licenseNumber}
            onChange={(e) => setUserData({ ...userData, licenseNumber: e.target.value })}
            placeholder="Numéro de licence"
            required
            className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      {/* File Uploads */}
      <div className="space-y-4">
        <FileUploadField
          name="profileImage"
          label="Photo de profil"
          icon={FaImage}
          description="Format: JPG, PNG (Max: 5MB)"
          currentFile={userData.profileImage}
        />
        <FileUploadField
          name="idImage"
          label="Image de la pièce d'identité"
          icon={FaIdCard}
          description="Scannez ou prenez une photo claire"
          currentFile={userData.idImage}
        />
        <FileUploadField
          name="licenseImage"
          label="Image de la licence médicale"
          icon={FaCertificate}
          description="Scannez ou prenez une photo claire"
          currentFile={userData.licenseImage}
        />
        <FileUploadField
          name="cvImage"
          label="Curriculum Vitae (CV)"
          icon={FaFileAlt}
          description="Format: PDF, JPG, PNG (Max: 5MB)"
          currentFile={userData.cvImage}
        />
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4 pt-4">
        <LoadingButton
          type="button"
          className="btn-secondary flex-1"
          onClick={changeStep}
          name="back"
        >
          <FaArrowLeft className="mr-2" />
          Retour
        </LoadingButton>
        
        <LoadingButton
          type="submit"
          isLoading={isLoading}
          loadingText="Inscription..."
          className="btn-primary flex-1 group"
          name="doctorSignup"
        >
          <span>Créer mon compte</span>
          <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
        </LoadingButton>
      </div>
    </form>
  );
};

export default SignupFinish;
