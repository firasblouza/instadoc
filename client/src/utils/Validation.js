const errorMessages = {
  firstName: "Please enter your first name",
  lastName: "Please enter your last name",
  email: "Please enter your email",
  password: "Please enter your password",
  confirmPassword: "Please confirm your password",
  role: "Please select your role",
  idType: "Please select your ID type",
  idNumber: "Please enter your ID number",
  idImage: "Please upload your ID image",
  licenseNumber: "Please enter your license number",
  licenseImage: "Please upload your license image",
  speciality: "Please select your speciality",
  invalidEmail: "Please enter a valid email",
  shortPassword: "Password must be at least 8 characters long",
  noNumber: "Password must contain at least one number",
  noUppercase: "Password must contain at least one uppercase letter",
  noSpecial: "Password must contain at least one special character",
  noMatch: "Passwords do not match",
  noProfileImage: "Please upload your profile image"
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
    // Step 2: Security & Profile (Password, Date of Birth, Specialty)
    if (!isValidPassword({
      from: "signup",
      password: data.password,
      confirmPassword: data.confirmPassword,
      setMessage: setSignupMessage
    })) {
      return false;
    }
    if (!data.dateOfBirth) {
      setSignupMessage({
        message: "Please select your date of birth",
        error: true
      });
      return false;
    }
    if (data.role === "doctor" && !data.speciality) {
      setSignupMessage({
        message: "Please select your speciality",
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
        message: "Please select an ID type",
        error: true
      });
      return false;
    }
    if (!data.idNumber) {
      setSignupMessage({
        message: "Please enter your ID number",
        error: true
      });
      return false;
    }
    if (!data.licenseNumber) {
      setSignupMessage({
        message: "Please enter your license number",
        error: true
      });
      return false;
    }
    if (!data.profileImage) {
      setSignupMessage({
        message: "Please upload your profile image",
        error: true
      });
      return false;
    }
    if (!data.idImage) {
      setSignupMessage({
        message: "Please upload your ID image",
        error: true,
      });
      return false;
    }
    if (!data.licenseImage) {
      setSignupMessage({
        message: "Please upload your license image",
        error: true,
      });
      return false;
    }
    if (!data.cvImage) {
      setSignupMessage({
        message: "Please upload your CV image",
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

export { isValidData, isValidEmail, isValidPassword };
