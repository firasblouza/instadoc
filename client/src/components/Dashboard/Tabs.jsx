const getTabs = (role) => {
  let tabs = [];

  if (role === "user") {
    tabs = [
      {
        name: " < Page d'accueil",
        id: "accueil",
        path: "/"
      },
      {
        name: "Tableau de bord",
        id: "home",
        path: ""
      },
      {
        name: "Mon Profil",
        id: "profile",
        path: "profile"
      },
      {
        name: "Mes Consultations",
        id: "consultations",
        path: "consultations"
      },

      {
        name: "Paramètres",
        id: "settings",
        path: "settings"
      },
      {
        name: "Déconnexion",
        id: "logout",
        path: "/logout"
      }
    ];
  } else if (role === "doctor") {
    tabs = [
      {
        name: " < Page d'accueil",
        id: "accueil",
        path: "/"
      },
      {
        name: "Tableau de bord",
        id: "home",
        path: ""
      },
      {
        name: "Mon Profil",
        id: "profile",
        path: "profile"
      },
      {
        name: "Mes Demandes",
        id: "consultations",
        path: "consultations"
      },

      {
        name: "Paramètres",
        id: "settings",
        path: "settings"
      },
      {
        name: "Déconnexion",
        id: "logout",
        path: "/logout"
      }
    ];
  } else if (role === "admin") {
    tabs = [
      {
        name: " < Page d'accueil",
        id: "accueil",
        path: "/"
      },
      {
        name: "Tableau de bord",
        id: "home",
        path: ""
      },
      {
        name: "Mon Profil",
        id: "profile",
        path: "profile"
      },
      {
        name: "Gestion des Patients",
        id: "admin-patients",
        path: "admin/patients"
      },
      {
        name: "Gestion des Médecins",
        id: "admin-doctors",
        path: "admin/doctors"
      },
      {
        name: "Gestion des Labo",
        id: "admin-labs",
        path: "admin/labs"
      },
      {
        name: "Gestion des Avis",
        id: "admin-reviews",
        path: "admin/reviews"
      },
      {
        name: "Paramètres",
        id: "settings",
        path: "settings"
      },
      {
        name: "Déconnexion",
        id: "logout",
        path: "/logout"
      }
    ];
  }
  return tabs;
};

export default getTabs;
