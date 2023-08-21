const doctorSpecialties = [
  {
    value: "cardiologie",
    name: "Cardiologie",
    description:
      "Notre équipe de cardiologues hautement qualifiés s'engage à fournir une expertise de pointe dans le diagnostic et le traitement des problèmes cardiaques. Votre santé cardiaque est notre priorité absolue.",
    icon: "lien_vers_icone_cardiologie"
  },
  {
    value: "dermatologie",
    name: "Dermatologie",
    description:
      "Découvrez les dernières avancées en matière de soins de la peau avec notre équipe de dermatologues expérimentés. Nous proposons des consultations en ligne pour une peau éclatante et en santé.",
    icon: "lien_vers_icone_dermatologie"
  },
  {
    value: "endocrinologie",
    name: "Endocrinologie",
    description:
      "Nos experts en endocrinologie se spécialisent dans la gestion des déséquilibres hormonaux et des troubles associés. Faites-nous confiance pour des consultations en ligne complètement adaptées à vos besoins.",
    icon: "lien_vers_icone_endocrinologie"
  },
  {
    value: "gastroenterologie",
    name: "Gastroentérologie",
    description:
      "Obtenez des soins spécialisés pour les problèmes gastro-intestinaux auprès de nos gastroentérologues expérimentés. Bénéficiez de consultations en ligne pour un système digestif en santé.",
    icon: "lien_vers_icone_gastroenterologie"
  },
  {
    value: "neurologie",
    name: "Neurologie",
    description:
      "Notre équipe en neurologie propose des diagnostics avancés et des options de traitement pour les affections neurologiques. Accédez à des consultations en ligne pour une santé cérébrale optimale.",
    icon: "lien_vers_icone_neurologie"
  },
  {
    value: "oncologie",
    name: "Oncologie",
    description:
      "Recevez des soins compatissants et des conseils d'experts de nos spécialistes en oncologie. Nous offrons des consultations en ligne pour vous soutenir tout au long de votre parcours contre le cancer.",
    icon: "lien_vers_icone_oncologie"
  },
  {
    value: "pediatrie",
    name: "Pédiatrie",
    description:
      "Nos pédiatres offrent des soins complets pour la santé des enfants. Accédez à des consultations en ligne pour assurer le bien-être et la croissance de votre enfant.",
    icon: "lien_vers_icone_pediatrie"
  },
  {
    value: "psychiatrie",
    name: "Psychiatrie",
    description:
      "Bénéficiez d'un soutien personnalisé en santé mentale de la part de notre équipe de psychiatres compatissants. Accédez à des consultations en ligne pour améliorer votre bien-être émotionnel.",
    icon: "lien_vers_icone_psychiatrie"
  },
  {
    value: "radiologie",
    name: "Radiologie",
    description:
      "Nos radiologues fournissent des diagnostics d'imagerie avancés pour la détection précise de maladies. Obtenez des consultations en ligne pour des diagnostics et des plans de traitement précis.",
    icon: "lien_vers_icone_radiologie"
  },
  {
    value: "chirurgie",
    name: "Chirurgie",
    description:
      "Profitez de soins chirurgicaux experts et de plans de traitement personnalisés de nos chirurgiens qualifiés. Connectez-vous pour des consultations en ligne afin de répondre à vos besoins chirurgicaux.",
    icon: "lien_vers_icone_chirurgie"
  },
  {
    value: "medecine-generale",
    name: "Médecine Générale",
    description:
      "Consultez nos médecins généralistes expérimentés pour vos besoins en soins primaires. Connectez-vous pour des consultations en ligne afin de maintenir votre bien-être général.",
    icon: "lien_vers_icone_medecine_generale"
  }
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
