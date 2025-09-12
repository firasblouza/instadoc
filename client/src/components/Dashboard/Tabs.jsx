import {
  FaTachometerAlt,
  FaUser,
  FaUserMd,
  FaUsers,
  FaFlask,
  FaStar,
  FaCog,
  FaSignOutAlt,
  FaHome
} from "react-icons/fa";

const getTabs = (role) => {
  let tabs = [];

  const commonTabs = [
    {
      name: "Tableau de bord",
      id: "home",
      path: "",
      icon: FaTachometerAlt
    },
    {
      name: "Mon Profil",
      id: "profile",
      path: "profile",
      icon: FaUser
    }
  ];

  const commonBottomTabs = [
    {
      name: "Paramètres",
      id: "settings",
      path: "settings",
      icon: FaCog
    },
    {
      name: "Déconnexion",
      id: "logout",
      path: "/logout",
      icon: FaSignOutAlt
    },
    {
      name: "Retour à l'accueil",
      id: "accueil",
      path: "/",
      icon: FaHome
    }
  ];

  if (role === "user") {
    tabs = [
      ...commonTabs,
      {
        name: "Mes Consultations",
        id: "consultations",
        path: "consultations",
        icon: FaUserMd
      },
      ...commonBottomTabs
    ];
  } else if (role === "doctor") {
    tabs = [
      ...commonTabs,
      {
        name: "Mes Demandes",
        id: "consultations",
        path: "consultations",
        icon: FaUserMd
      },
      ...commonBottomTabs
    ];
  } else if (role === "admin") {
    tabs = [
      ...commonTabs,
      {
        name: "Gestion des Patients",
        id: "admin-patients",
        path: "admin/patients",
        icon: FaUsers
      },
      {
        name: "Gestion des Médecins",
        id: "admin-doctors",
        path: "admin/doctors",
        icon: FaUserMd
      },
      {
        name: "Gestion des Labo",
        id: "admin-labs",
        path: "admin/labs",
        icon: FaFlask
      },
      {
        name: "Gestion des Avis",
        id: "admin-reviews",
        path: "admin/reviews",
        icon: FaStar
      },
      ...commonBottomTabs
    ];
  }
  return tabs;
};

export default getTabs;
