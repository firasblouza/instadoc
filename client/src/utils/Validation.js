const errorMessages = {
  firstName: "Veuillez saisir votre prénom",
  lastName: "Veuillez saisir votre nom",
  email: "Veuillez saisir votre adresse email",
  phoneNumber: "Veuillez saisir votre numéro de téléphone",
  password: "Veuillez saisir votre mot de passe",
  confirmPassword: "Veuillez confirmer votre mot de passe",
  role: "Veuillez sélectionner votre rôle",
  idType: "Veuillez sélectionner un type de pièce d'identité",
  idNumber: "Veuillez saisir votre numéro de pièce d'identité",
  idImage: "Veuillez télécharger l'image de votre pièce d'identité",
  licenseNumber: "Veuillez saisir votre numéro de licence",
  licenseImage: "Veuillez télécharger l'image de votre licence",
  speciality: "Veuillez sélectionner votre spécialité",
  invalidEmail: "Veuillez saisir une adresse email valide",
  invalidPhone: "Veuillez saisir un numéro de téléphone valide",
  shortPassword: "Le mot de passe doit contenir au moins 8 caractères",
  noNumber: "Le mot de passe doit contenir au moins un chiffre",
  noUppercase: "Le mot de passe doit contenir au moins une majuscule",
  noSpecial: "Le mot de passe doit contenir au moins un caractère spécial",
  noMatch: "Les mots de passe ne correspondent pas",
  noProfileImage: "Veuillez télécharger votre photo de profil"
};

const isValidEmail = (email, setSignupMessage) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email.length === 0) {
    setSignupMessage({
      message: errorMessages.email,
      error: true
    });
    return false;
  }
  if (!emailRegex.test(email)) {
    setSignupMessage({
      message: errorMessages.invalidEmail,
      error: true
    });
    return false;
  }
  setSignupMessage({
    message: "",
    error: false
  });
  return true;
};

const isValidPhoneNumber = (phoneNumber, setSignupMessage) => {
  const phoneRegex = /^(\+216|0)?[0-9]{8}$/;
  if (phoneNumber.length === 0) {
    setSignupMessage({
      message: errorMessages.phoneNumber,
      error: true
    });
    return false;
  }
  if (!phoneRegex.test(phoneNumber.replace(/\s/g, ''))) {
    setSignupMessage({
      message: errorMessages.invalidPhone,
      error: true
    });
    return false;
  }
  setSignupMessage({
    message: "",
    error: false
  });
  return true;
};

const isValidPassword = ({ from, password, confirmPassword, setMessage }) => {
  if (!from || from !== "settings") {
    if (password.length === 0) {
      setMessage({
        message: errorMessages.password,
        error: true
      });
      return false;
    }
  }

  if (password.length < 8) {
    setMessage({
      message: errorMessages.shortPassword,
      error: true
    });
    return false;
  }
  if (!/[0-9]/.test(password)) {
    setMessage({
      message: errorMessages.noNumber,
      error: true
    });
    return false;
  }
  if (!/[A-Z]/.test(password)) {
    setMessage({
      message: errorMessages.noUppercase,
      error: true
    });
    return false;
  }
  if (!/[$&+,:;=?@#|'<>.^*()%!-]/.test(password)) {
    setMessage({
      message: errorMessages.noSpecial,
      error: true
    });
    return false;
  }

  if (confirmPassword.length === 0) {
    setMessage({
      message: errorMessages.confirmPassword,
      error: true
    });
    return false;
  }
  if (password !== confirmPassword) {
    setMessage({
      message: errorMessages.noMatch,
      error: true
    });
    return false;
  }
  setMessage({
    message: "",
    error: false
  });
  return true;
};

const isValidData = (data, setSignupMessage, step) => {
  if (step === 1) {
    if (!data.firstName)
      return setSignupMessage({
        message: errorMessages.firstName,
        error: true
      });
    if (!data.lastName)
      return setSignupMessage({
        message: errorMessages.lastName,
        error: true
      });
    if (!data.email)
      return setSignupMessage({
        message: errorMessages.email,
        error: true
      });
    if (!isValidEmail(data.email, setSignupMessage)) return false;
    if (!data.role || data.role === "default") {
      setSignupMessage({
        message: errorMessages.role,
        error: true
      });
      return false;
    }
    setSignupMessage({
      message: "",
      error: false
    });
    return true;
  } else if (step === 2) {
    // Step 2: Security & Profile (Password, Phone Number, Date of Birth, Specialty)
    if (!isValidPassword({
      from: "signup",
      password: data.password,
      confirmPassword: data.confirmPassword,
      setMessage: setSignupMessage
    })) {
      return false;
    }
    if (!isValidPhoneNumber(data.phoneNumber, setSignupMessage)) {
      return false;
    }
    if (!data.dateOfBirth) {
      setSignupMessage({
        message: "Veuillez sélectionner votre date de naissance",
        error: true
      });
      return false;
    }
    if (data.role === "doctor" && !data.speciality) {
      setSignupMessage({
        message: "Veuillez sélectionner votre spécialité",
        error: true
      });
      return false;
    }
    setSignupMessage({
      message: "",
      error: false
    });
    return true;
  } else if (step === 3) {
    // Step 3: Professional Documents (Doctor only)
    if (!data.idType) {
      setSignupMessage({
        message: "Veuillez sélectionner un type de pièce d'identité",
        error: true
      });
      return false;
    }
    if (!data.idNumber) {
      setSignupMessage({
        message: "Veuillez saisir votre numéro de pièce d'identité",
        error: true
      });
      return false;
    }
    if (!data.licenseNumber) {
      setSignupMessage({
        message: "Veuillez saisir votre numéro de licence",
        error: true
      });
      return false;
    }
    if (!data.profileImage) {
      setSignupMessage({
        message: "Veuillez télécharger votre photo de profil",
        error: true
      });
      return false;
    }
    if (!data.idImage) {
      setSignupMessage({
        message: "Veuillez télécharger l'image de votre pièce d'identité",
        error: true,
      });
      return false;
    }
    if (!data.licenseImage) {
      setSignupMessage({
        message: "Veuillez télécharger l'image de votre licence",
        error: true,
      });
      return false;
    }
    if (!data.cvImage) {
      setSignupMessage({
        message: "Veuillez télécharger votre CV",
        error: true,
      });
      return false;
    }
    setSignupMessage({
      message: "",
      error: false
    });
    return true;
  }
  setSignupMessage({
    message: "",
    error: false
  });
  return true;
};

export { isValidData, isValidEmail, isValidPassword, isValidPhoneNumber };
