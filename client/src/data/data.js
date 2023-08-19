const doctorSpecialties = [
  { value: "cardiologie", name: "Cardiologie" },
  { value: "dermatologie", name: "Dermatologie" },
  { value: "endocrinologie", name: "Endocrinologie" },
  { value: "gastroenterologie", name: "Gastroentérologie" },
  { value: "neurologie", name: "Neurologie" },
  { value: "oncologie", name: "Oncologie" },
  { value: "pediatrie", name: "Pédiatrie" },
  { value: "psychiatrie", name: "Psychiatrie" },
  { value: "radiologie", name: "Radiologie" },
  { value: "chirurgie", name: "Chirurgie" },
  { value: "medecine-generale", name: "Médecine Générale" }
  // Add more specialties as needed
];

const userData = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "",
  idType: "",
  idNumber: "",
  idImage: null,
  licenseNumber: "",
  licenseImage: null,
  speciality: ""
};

export { userData, doctorSpecialties };
