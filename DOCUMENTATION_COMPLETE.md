# 📚 Documentation Complète - InstaDoc

## Table des Matières

1. [Introduction](#introduction)
2. [Glossaire des Termes Techniques](#glossaire-des-termes-techniques)
3. [Packages Utilisés](#packages-utilisés)
4. [Architecture Générale](#architecture-générale)
5. [Client (Frontend)](#client-frontend)
6. [Serveur (Backend)](#serveur-backend)
7. [Flux de Données](#flux-de-données)
8. [Technologies Utilisées](#technologies-utilisées)

---

## 📂 Structure des Fichiers (Navigation Rapide)

### Client (Frontend)

#### Configuration
- [`client/index.html`](#clientindexhtml) - Point d'entrée HTML
- [`client/package.json`](#clientpackagejson) - Dépendances et scripts npm
- [`client/vite.config.js`](#clientviteconfigjs) - Configuration Vite
- [`client/tailwind.config.js`](#clienttailwindconfigjs) - Configuration Tailwind CSS

#### Point d'Entrée
- [`client/src/main.jsx`](#clientsrcmainjsx) - Point d'entrée React
- [`client/src/App.jsx`](#clientsrcappjsx) - Composant racine avec routes

#### API et Librairies
- [`client/src/api/axios.js`](#clientsrcapiaxiosjs) - Configuration Axios (legacy)
- [`client/src/lib/api.js`](#clientsrclibapijs) - Configuration API centralisée
- [`client/src/lib/constants.js`](#clientsrclibconstantsjs) - Constantes et utilitaires
- [`client/src/lib/socket.js`](#clientsrclibsocketjs) - Configuration Socket.IO

#### Contextes
- [`client/src/context/AuthContext.jsx`](#clientsrccontextauthcontextjsx) - Gestion authentification
- [`client/src/context/NotificationContext.jsx`](#clientsrccontextnotificationcontextjsx) - Gestion notifications
- [`client/src/context/SEOContext.jsx`](#clientsrccontextseocontextjsx) - Gestion SEO

#### Hooks
- [`client/src/hooks/useAccessToken.jsx`](#clientsrchooksuseaccesstokenjsx) - Récupération token JWT
- [`client/src/hooks/useAuth.jsx`](#clientsrchooksuseauthjsx) - Hook authentification
- [`client/src/hooks/useRefreshToken.jsx`](#clientsrchooksuserefreshtokenjsx) - Rafraîchissement token
- [`client/src/hooks/useLogout.jsx`](#clientsrchooksuselogoutjsx) - Déconnexion
- [`client/src/hooks/usePageSEO.jsx`](#clientsrchooksusepageseojsx) - SEO par page

#### Utilitaires
- [`client/src/utils/Validation.js`](#clientsrcutilsvalidationjs) - Validation formulaires
- [`client/src/utils/Capitalize.js`](#clientsrcutilscapitalizejs) - Capitalisation texte
- [`client/src/data/data.js`](#clientsrcdatadatajs) - Données statiques

#### Composants Principaux
- [`client/src/components/Layout.jsx`](#clientsrccomponentslayoutjsx) - Layout principal
- [`client/src/components/Home.jsx`](#clientsrccomponentshomejsx) - Page d'accueil
- [`client/src/components/Login.jsx`](#clientsrccomponentsloginjsx) - Page connexion
- [`client/src/components/Doctors.jsx`](#clientsrccomponentsdoctorsjsx) - Liste médecins
- [`client/src/components/Medicines.jsx`](#clientsrccomponentsmedicinesjsx) - Liste médicaments
- [`client/src/components/Labs.jsx`](#clientsrccomponentslabsjsx) - Liste laboratoires
- [`client/src/components/Blog.jsx`](#clientsrccomponentsblogjsx) - Page blog
- [`client/src/components/Contact.jsx`](#clientsrccomponentscontactjsx) - Page contact

#### Composants Signup
- [`client/src/components/Signup/index.jsx`](#clientsrccomponentssignupindexjsx) - Gestionnaire d'inscription
- [`client/src/components/Signup/SignupMain.jsx`](#clientsrccomponentssignupsignupmainjsx) - Étape 1: Informations de base
- [`client/src/components/Signup/SignupData.jsx`](#clientsrccomponentssignupsignupdatajsx) - Étape 2: Sécurité et profil
- [`client/src/components/Signup/SignupFinish.jsx`](#clientsrccomponentssignupsignupfinishjsx) - Étape 3: Documents professionnels

#### Composants Header
- [`client/src/components/Header/index.jsx`](#clientsrccomponentsheaderindexjsx) - Header principal
- [`client/src/components/Header/Navbar.jsx`](#clientsrccomponentsheadernavbarjsx) - Barre de navigation
- [`client/src/components/Header/MobileMenu.jsx`](#clientsrccomponentsheadermobilemenujsx) - Menu mobile
- [`client/src/components/Header/UpperHeader.jsx`](#clientsrccomponentsheaderupperheaderjsx) - Barre supérieure

#### Composants Dashboard
- [`client/src/components/Dashboard/index.jsx`](#clientsrccomponentsdashboardindexjsx) - Conteneur dashboard
- [`client/src/components/Dashboard/Sidebar.jsx`](#clientsrccomponentsdashboardsidebarjsx) - Barre latérale
- [`client/src/components/Dashboard/Tabs.jsx`](#clientsrccomponentsdashboardtabsjsx) - Configuration onglets
- [`client/src/components/Dashboard/tabs/Profile.jsx`](#clientsrccomponentsdashboardtabsprofilejsx) - Page profil
- [`client/src/components/Dashboard/tabs/Settings.jsx`](#clientsrccomponentsdashboardtabssettingsjsx) - Page paramètres

#### Dashboard Admin
- [`client/src/components/Dashboard/tabs/admin/AdminHome.jsx`](#clientsrccomponentsdashboardtabsadminadminhomejsx) - Accueil admin
- [`client/src/components/Dashboard/tabs/admin/ManagePatients.jsx`](#clientsrccomponentsdashboardtabsadminmanagepatientsjsx) - Gestion patients
- [`client/src/components/Dashboard/tabs/admin/ManageDoctors.jsx`](#clientsrccomponentsdashboardtabsadminmanagedoctorsjsx) - Gestion médecins
- [`client/src/components/Dashboard/tabs/admin/ManageLabs.jsx`](#clientsrccomponentsdashboardtabsadminmanagelabsjsx) - Gestion laboratoires
- [`client/src/components/Dashboard/tabs/admin/ManageMedicines.jsx`](#clientsrccomponentsdashboardtabsadminmanagemedicinesjsx) - Gestion médicaments
- [`client/src/components/Dashboard/tabs/admin/ManageBlogs.jsx`](#clientsrccomponentsdashboardtabsadminmanageblogsjsx) - Gestion blog
- [`client/src/components/Dashboard/tabs/admin/ManageSEO.jsx`](#clientsrccomponentsdashboardtabsadminmanageseojsx) - Gestion SEO
- [`client/src/components/Dashboard/tabs/admin/ManageRatings.jsx`](#clientsrccomponentsdashboardtabsadminmanageratingsjsx) - Gestion avis
- [`client/src/components/Dashboard/tabs/admin/FinancialAnalytics.jsx`](#clientsrccomponentsdashboardtabsadminfinancialanalyticsjsx) - Analytics financiers

#### Dashboard Doctor
- [`client/src/components/Dashboard/tabs/doctor/DoctorHome.jsx`](#clientsrccomponentsdashboardtabsdoctordoctorhomejsx) - Accueil médecin
- [`client/src/components/Dashboard/tabs/doctor/Demandes.jsx`](#clientsrccomponentsdashboardtabsdoctordemandesjsx) - Gestion demandes
- [`client/src/components/Dashboard/tabs/doctor/Pricing.jsx`](#clientsrccomponentsdashboardtabsdoctorpricingjsx) - Gestion tarifs

#### Dashboard Patient
- [`client/src/components/Dashboard/tabs/patient/PatientHome.jsx`](#clientsrccomponentsdashboardtabspatientpatienthomejsx) - Accueil patient
- [`client/src/components/Dashboard/tabs/patient/Demandes.jsx`](#clientsrccomponentsdashboardtabspatientdemandesjsx) - Consultations patient

#### Composants Appointment
- [`client/src/components/Appointment/index.jsx`](#clientsrccomponentsappointmentindexjsx) - Composant principal rendez-vous
- [`client/src/components/Appointment/Interface.jsx`](#clientsrccomponentsappointmentinterfacejsx) - Interface chat
- [`client/src/components/Appointment/Sidebar.jsx`](#clientsrccomponentsappointmentsidebarjsx) - Barre latérale rendez-vous
- [`client/src/components/Appointment/BookingModal.jsx`](#clientsrccomponentsappointmentbookingmodaljsx) - Modal réservation
- [`client/src/components/Appointment/socket.jsx`](#clientsrccomponentsappointmentsocketjsx) - Configuration Socket.IO

#### Composants Profiles
- [`client/src/components/Profiles/Doctor.jsx`](#clientsrccomponentsprofilesdoctorjsx) - Profil médecin
- [`client/src/components/Profiles/StarRating.jsx`](#clientsrccomponentsprofilesstarratingjsx) - Évaluation étoiles
- [`client/src/components/Profiles/AvgRating.jsx`](#clientsrccomponentsprofilesavgratingjsx) - Note moyenne

#### Composants Notifications
- [`client/src/components/Notifications/NotificationBell.jsx`](#clientsrccomponentsnotificationsnotificationbelljsx) - Cloche notifications
- [`client/src/components/Notifications/ToastContainer.jsx`](#clientsrccomponentsnotificationstoastcontainerjsx) - Conteneur toasts

#### Autres Composants
- [`client/src/components/Footer.jsx`](#clientsrccomponentsfooterjsx) - Footer
- [`client/src/components/Hero.jsx`](#clientsrccomponentsherojsx) - Section hero
- [`client/src/components/RequireAuth.jsx`](#clientsrccomponentsrequireauthjsx) - Protection routes
- [`client/src/components/GlobalLoader.jsx`](#clientsrccomponentsgloballoaderjsx) - Loader global

---

### Serveur (Backend)

#### Configuration
- [`server/package.json`](#serverpackagejson) - Dépendances et scripts npm
- [`server/src/server.js`](#serversrcserverjs) - Point d'entrée serveur

#### Configuration Serveur
- [`server/src/config/db.js`](#serversrcconfigdbjs) - Configuration MongoDB
- [`server/src/config/allowedOrigins.js`](#serversrcconfigallowedoriginsjs) - Origines CORS autorisées
- [`server/src/config/corsOptions.js`](#serversrcconfigcorsoptionsjs) - Configuration CORS

#### Modèles
- [`server/src/api/models/User.js`](#serversrcapimodelsuserjs) - Modèle utilisateur
- [`server/src/api/models/Doctor.js`](#serversrcapimodelsdoctorjs) - Modèle médecin
- [`server/src/api/models/Appointment.js`](#serversrcapimodelsappointmentjs) - Modèle rendez-vous
- [`server/src/api/models/Medicine.js`](#serversrcapimodelsmedicinejs) - Modèle médicament
- [`server/src/api/models/Lab.js`](#serversrcapimodelslabjs) - Modèle laboratoire
- [`server/src/api/models/Blog.js`](#serversrcapimodelsblogjs) - Modèle blog
- [`server/src/api/models/Notification.js`](#serversrcapimodelsnotificationjs) - Modèle notification
- [`server/src/api/models/Rating.js`](#serversrcapimodelsratingjs) - Modèle avis
- [`server/src/api/models/SEO.js`](#serversrcapimodelsseojs) - Modèle SEO
- [`server/src/api/models/DoctorPricing.js`](#serversrcapimodelsdoctorpricingjs) - Modèle tarifs médecin
- [`server/src/api/models/Speciality.js`](#serversrcapimodelsspecialityjs) - Modèle spécialité

#### Middlewares
- [`server/src/api/middleware/verifyJWT.js`](#serversrcapimiddlewareverifyjwtjs) - Vérification JWT
- [`server/src/api/middleware/verifyRole.js`](#serversrcapimiddlewareverifyrolejs) - Vérification rôle
- [`server/src/api/middleware/multer.js`](#serversrcapimiddlewaremulterjs) - Upload fichiers
- [`server/src/api/middleware/credentials.js`](#serversrcapimiddlewarecredentialsjs) - Gestion credentials

#### Routes
- [`server/src/api/routes/auth.js`](#serversrcapiroutesauthjs) - Route authentification
- [`server/src/api/routes/register.js`](#serversrcapiroutesregisterjs) - Route inscription
- [`server/src/api/routes/refresh.js`](#serversrcapiroutesrefreshjs) - Route rafraîchissement token
- [`server/src/api/routes/logout.js`](#serversrcapirouteslogoutjs) - Route déconnexion
- [`server/src/api/routes/doctorRoutes.js`](#serversrcapiroutesdoctorroutesjs) - Routes médecins
- [`server/src/api/routes/appointmentRoutes.js`](#serversrcapiroutesappointmentroutesjs) - Routes rendez-vous
- [`server/src/api/routes/notificationRoutes.js`](#serversrcapiroutesnotificationroutesjs) - Routes notifications
- [`server/src/api/routes/adminRoutes.js`](#serversrcapiroutesadminroutesjs) - Routes admin
- [`server/src/api/routes/medicineRoutes.js`](#serversrcapiroutesmedicineroutesjs) - Routes médicaments
- [`server/src/api/routes/labRoutes.js`](#serversrcapirouteslabroutesjs) - Routes laboratoires
- [`server/src/api/routes/blogRoutes.js`](#serversrcapiroutesblogroutesjs) - Routes blog
- [`server/src/api/routes/ratingRoutes.js`](#serversrcapiroutesratingroutesjs) - Routes avis
- [`server/src/api/routes/seoRoutes.js`](#serversrcapiroutesseoroutesjs) - Routes SEO
- [`server/src/api/routes/userRoutes.js`](#serversrcapiroutesuserroutesjs) - Routes utilisateurs

#### Contrôleurs
- [`server/src/api/controllers/authController.js`](#serversrcapicontrollersauthcontrollerjs) - Contrôleur authentification
- [`server/src/api/controllers/registerController.js`](#serversrcapicontrollersregistercontrollerjs) - Contrôleur inscription
- [`server/src/api/controllers/appointmentController.js`](#serversrcapicontrollersappointmentcontrollerjs) - Contrôleur rendez-vous
- [`server/src/api/controllers/doctorController.js`](#serversrcapicontrollersdoctorcontrollerjs) - Contrôleur médecins
- [`server/src/api/controllers/notificationController.js`](#serversrcapicontrollersnotificationcontrollerjs) - Contrôleur notifications
- [`server/src/api/controllers/adminController.js`](#serversrcapicontrollersadmincontrollerjs) - Contrôleur admin
- [`server/src/api/controllers/medicineController.js`](#serversrcapicontrollersmedicinecontrollerjs) - Contrôleur médicaments
- [`server/src/api/controllers/labController.js`](#serversrcapicontrollerslabcontrollerjs) - Contrôleur laboratoires
- [`server/src/api/controllers/blogController.js`](#serversrcapicontrollersblogcontrollerjs) - Contrôleur blog
- [`server/src/api/controllers/ratingController.js`](#serversrcapicontrollersratingcontrollerjs) - Contrôleur avis
- [`server/src/api/controllers/seoController.js`](#serversrcapicontrollersseocontrollerjs) - Contrôleur SEO
- [`server/src/api/controllers/userController.js`](#serversrcapicontrollersusercontrollerjs) - Contrôleur utilisateurs
- [`server/src/api/controllers/refreshTokenController.js`](#serversrcapicontrollersrefreshtokencontrollerjs) - Contrôleur refresh token
- [`server/src/api/controllers/logoutController.js`](#serversrcapicontrollerslogoutcontrollerjs) - Contrôleur déconnexion

---

## <span id="glossaire-des-termes-techniques">Glossaire des Termes Techniques</span>

Cette section explique les termes techniques utilisés dans cette documentation.

### Frontend (React)

- **Hook** : Fonction React qui permet d'utiliser l'état et d'autres fonctionnalités dans les composants fonctionnels. Exemple : `const [count, setCount] = useState(0);`

- **Context** : Mécanisme React pour partager des données entre composants sans passer par les props. Exemple : `const AuthContext = createContext();`

- **Provider** : Composant qui enveloppe l'application pour fournir des données via Context à tous les composants enfants. Exemple : `<AuthProvider><App /></AuthProvider>`

- **Route** : Définition d'un chemin URL et du composant à afficher pour ce chemin. Exemple : `<Route path="/login" element={<Login />} />`

- **Component** : Fonction ou classe React qui retourne du JSX pour créer une partie de l'interface utilisateur. Exemple : `const Button = () => <button>Cliquer</button>;`

- **State** : Données qui peuvent changer dans un composant et déclenchent un re-render. Exemple : `const [name, setName] = useState("");`

- **Props** : Données passées d'un composant parent à un composant enfant. Exemple : `<UserCard name="John" age={25} />`

- **Effect** : Hook qui permet d'exécuter du code après le rendu du composant. Exemple : `useEffect(() => { fetchData(); }, []);`

### Backend (Node.js/Express)

- **Middleware** : Fonction qui s'exécute entre la requête HTTP et la réponse, permettant de modifier ou valider les données. Exemple : `app.use(express.json());`

- **Route** : Définition d'un endpoint API (URL + méthode HTTP) et de la fonction à exécuter. Exemple : `router.get("/users", getUsers);`

- **Model** : Schéma de données qui définit la structure d'une collection dans la base de données. Exemple : `const User = mongoose.model("User", userSchema);`

- **Controller** : Fonction qui contient la logique métier pour gérer une requête HTTP spécifique. Exemple : `const getUsers = async (req, res) => { ... };`

- **CORS** : Cross-Origin Resource Sharing, mécanisme qui permet à un site web d'accéder à des ressources d'un autre domaine. Exemple : `app.use(cors({ origin: "http://localhost:5173" }));`

- **JWT** : JSON Web Token, format de token sécurisé pour authentifier les utilisateurs. Exemple : `const token = jwt.sign({ userId: 123 }, secret);`

- **MVC** : Model-View-Controller, architecture qui sépare les données (Model), l'affichage (View) et la logique (Controller). Exemple : `User.js` (Model), `userController.js` (Controller), `UserProfile.jsx` (View)

- **ODM** : Object Document Mapper, outil qui permet de travailler avec MongoDB en utilisant des objets JavaScript. Exemple : Mongoose est un ODM pour MongoDB

- **WebSocket** : Protocole de communication bidirectionnel en temps réel entre client et serveur. Exemple : `socket.on("message", (data) => { ... });`

- **Schema** : Définition de la structure d'un document dans MongoDB avec types et validations. Exemple : `const userSchema = new Schema({ name: String, age: Number });`

- **Query** : Requête pour récupérer des données de la base de données. Exemple : `User.find({ age: { $gt: 18 } });`

- **Promise** : Objet JavaScript qui représente une opération asynchrone qui sera complétée dans le futur. Exemple : `fetch("/api/users").then(res => res.json());`

- **Async/Await** : Syntaxe JavaScript pour gérer les opérations asynchrones de manière synchrone. Exemple : `const users = await User.find();`

### Général

- **API** : Application Programming Interface, ensemble de règles et protocoles pour communiquer entre applications. Exemple : `GET /api/users` retourne la liste des utilisateurs

- **REST** : Architectural style pour créer des APIs web utilisant les méthodes HTTP (GET, POST, PUT, DELETE). Exemple : `GET /users` (lire), `POST /users` (créer)

- **CRUD** : Create, Read, Update, Delete, les quatre opérations de base sur les données. Exemple : Créer un utilisateur, Lire la liste, Modifier, Supprimer

- **HTTP** : HyperText Transfer Protocol, protocole de communication pour transférer des données sur le web. Exemple : `GET`, `POST`, `PUT`, `DELETE`

- **JSON** : JavaScript Object Notation, format de données textuelles pour échanger des données. Exemple : `{ "name": "John", "age": 30 }`

- **Environment Variables** : Variables d'environnement stockées dans un fichier `.env` pour la configuration. Exemple : `DATABASE_URI=mongodb://localhost:27017/instadoc`

- **Token** : Chaîne de caractères utilisée pour authentifier un utilisateur sans stocker son mot de passe. Exemple : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

- **Hash** : Transformation d'un mot de passe en une chaîne irréversible pour la sécurité. Exemple : `bcrypt.hash("password123", 10)` → `$2b$10$...`

- **Cookie** : Petite donnée stockée dans le navigateur et envoyée avec chaque requête. Exemple : `refreshToken` stocké dans les cookies

- **Session** : Période d'interaction entre un utilisateur et l'application, maintenue par le serveur. Exemple : Session utilisateur après connexion

---

## <span id="packages-utilisés">Packages Utilisés</span>

### Packages Client (Frontend)

#### Dépendances Principales

- **`react`** & **`react-dom`** : Bibliothèque React pour créer des interfaces utilisateur interactives. Exemple : `import React from "react"; const App = () => <div>Hello</div>;`

- **`react-router-dom`** : Bibliothèque de routage pour React, permet la navigation entre pages. Exemple : `<Route path="/login" element={<Login />} />`

- **`axios`** : Client HTTP pour faire des requêtes API (GET, POST, etc.). Exemple : `axios.get("/api/users").then(res => console.log(res.data));`

- **`socket.io-client`** : Client WebSocket pour la communication en temps réel avec le serveur. Exemple : `socket.emit("message", { text: "Hello" });`

- **`jwt-decode`** : Bibliothèque pour décoder les tokens JWT côté client. Exemple : `const decoded = jwt_decode(token); console.log(decoded.userId);`

- **`recharts`** : Bibliothèque pour créer des graphiques et visualisations de données. Exemple : `<LineChart data={data}><Line dataKey="value" /></LineChart>`

- **`react-icons`** : Collection d'icônes pour React. Exemple : `import { FaUser } from "react-icons/fa"; <FaUser />`

- **`react-i18next`** & **`i18next`** : Bibliothèques pour l'internationalisation (multi-langues). Exemple : `const { t } = useTranslation(); <p>{t("welcome")}</p>`

#### Dépendances de Développement

- **`vite`** : Build tool moderne et rapide pour les applications React. Exemple : `npm run dev` lance le serveur de développement

- **`tailwindcss`** : Framework CSS utility-first pour styliser rapidement. Exemple : `<div className="bg-blue-500 text-white p-4">`

- **`eslint`** : Outil pour détecter les erreurs et problèmes de code. Exemple : Vérifie automatiquement le code lors du développement

### Packages Serveur (Backend)

#### Dépendances Principales

- **`express`** : Framework web minimaliste pour Node.js, facilite la création d'APIs. Exemple : `app.get("/users", (req, res) => res.json(users));`

- **`mongoose`** : ODM (Object Document Mapper) pour MongoDB, simplifie les interactions avec la base de données. Exemple : `const user = await User.findOne({ email: "test@example.com" });`

- **`jsonwebtoken`** : Bibliothèque pour créer et vérifier les tokens JWT. Exemple : `const token = jwt.sign({ userId: 123 }, secret, { expiresIn: "1h" });`

- **`bcrypt`** : Bibliothèque pour hasher les mots de passe de manière sécurisée. Exemple : `const hash = await bcrypt.hash("password123", 10);`

- **`multer`** : Middleware pour gérer l'upload de fichiers (images, documents). Exemple : `upload.single("image")` traite un fichier uploadé

- **`socket.io`** : Bibliothèque pour la communication WebSocket en temps réel. Exemple : `io.on("connection", (socket) => { socket.emit("message", data); });`

- **`cors`** : Middleware pour gérer les requêtes Cross-Origin (CORS). Exemple : `app.use(cors({ origin: "http://localhost:5173" }));`

- **`dotenv`** : Charge les variables d'environnement depuis un fichier `.env`. Exemple : `require("dotenv").config();` puis `process.env.DATABASE_URI`

- **`cookie-parser`** : Middleware pour parser les cookies des requêtes HTTP. Exemple : `app.use(cookieParser());` puis `req.cookies.token`

- **`date-fns`** : Bibliothèque pour manipuler et formater les dates. Exemple : `format(new Date(), "dd/MM/yyyy")` → "25/12/2024"

#### Dépendances de Développement

- **`nodemon`** : Outil qui redémarre automatiquement le serveur lors des modifications de fichiers. Exemple : `nodemon server.js` surveille les changements

---

## <span id="introduction">Introduction</span>

**InstaDoc** est une plateforme de télémédecine développée avec React (frontend) et Node.js/Express (backend). Cette application permet aux patients de consulter des médecins en ligne, de rechercher des médicaments et des laboratoires, et de gérer leurs rendez-vous médicaux.

### Structure du Projet

```
instadoc/
├── client/          # Application React (Frontend)
└── server/          # Application Node.js/Express (Backend)
```

---

## <span id="architecture-générale">Architecture Générale</span>

L'application suit une architecture **MVC (Model-View-Controller)** :

- **Model** : Modèles Mongoose dans `server/src/api/models/`
- **View** : Composants React dans `client/src/components/`
- **Controller** : Contrôleurs dans `server/src/api/controllers/`

### Communication Client-Serveur

- **HTTP/REST API** : Pour les requêtes CRUD classiques
- **WebSocket (Socket.IO)** : Pour les fonctionnalités en temps réel (chat, notifications)

---

## <span id="client-frontend">Client (Frontend)</span>

### Structure des Dossiers

```
client/
├── index.html              # Point d'entrée HTML
├── package.json            # Dépendances et scripts npm
├── vite.config.js          # Configuration Vite
├── tailwind.config.js      # Configuration Tailwind CSS
├── postcss.config.js       # Configuration PostCSS
├── public/                 # Fichiers statiques publics
│   ├── favicon.png
│   └── _redirects
└── src/                    # Code source de l'application
    ├── main.jsx            # Point d'entrée React
    ├── App.jsx              # Composant racine avec routes
    ├── index.css            # Styles globaux
    ├── api/                 # Configuration API
    ├── assets/              # Images et ressources
    ├── components/          # Composants React
    ├── context/             # Contextes React (state management)
    ├── hooks/               # Hooks personnalisés
    ├── lib/                 # Bibliothèques et utilitaires
    ├── data/                # Données statiques
    └── utils/               # Fonctions utilitaires
```

---

### 📄 Fichiers de Configuration

#### <span id="clientindexhtml">`client/index.html`</span>

**Emplacement** : `client/index.html`

**Rôle** : Point d'entrée HTML de l'application. C'est le fichier HTML de base qui charge l'application React.

**Contenu principal** :
- Meta tags pour le SEO (titre, description, Open Graph, Twitter Cards)
- Lien vers Google Fonts (Poppins)
- Div `#root` où React monte l'application
- Script qui charge `main.jsx`

**Exemple** :
```html
<div id="root"></div>
<script type="module" src="/src/main.jsx"></script>
```

---

#### <span id="clientpackagejson">`client/package.json`</span>

**Emplacement** : `client/package.json`

**Rôle** : Définit les dépendances et les scripts npm du projet client.

**Scripts disponibles** :
- `npm run dev` : Lance le serveur de développement Vite
- `npm run build` : Compile l'application pour la production
- `npm run preview` : Prévisualise la version de production
- `npm run lint` : Vérifie le code avec ESLint

**Dépendances principales** :
- `react` & `react-dom` : Bibliothèque React
- `react-router-dom` : Routage côté client
- `axios` : Client HTTP pour les appels API
- `socket.io-client` : Client WebSocket
- `jwt-decode` : Décodage des tokens JWT
- `recharts` : Graphiques et visualisations
- `react-icons` : Bibliothèque d'icônes

---

#### <span id="clientviteconfigjs">`client/vite.config.js`</span>

**Emplacement** : `client/vite.config.js`

**Rôle** : Configuration du bundler Vite qui compile et sert l'application React.

**Configuration** :
- Plugin React pour transpiler JSX
- Configuration ESBuild pour supporter les fichiers `.js` et `.jsx`

**Exemple** :
```javascript
export default defineConfig({
  esbuild: {
    loader: 'jsx',
    include: ["src/**/*.js", "src/**/*.jsx"]
  },
  plugins: [react()],
})
```

---

#### <span id="clienttailwindconfigjs">`client/tailwind.config.js`</span>

**Emplacement** : `client/tailwind.config.js`

**Rôle** : Configuration de Tailwind CSS, le framework CSS utility-first utilisé pour le styling.

**Fonctionnalités** :
- Définit les chemins de scan pour les classes Tailwind
- Permet de personnaliser les couleurs, espacements, etc.

---

### 📄 Point d'Entrée de l'Application

#### <span id="clientsrcmainjsx">`client/src/main.jsx`</span>

**Emplacement** : `client/src/main.jsx`

**Rôle** : Point d'entrée de l'application React. C'est ici que React est monté dans le DOM.

**Structure** :
1. Importe les styles globaux (`index.css`)
2. Configure React Router
3. Enveloppe l'application avec les providers de contexte :
   - `AuthProvider` : Gestion de l'authentification
   - `NotificationProvider` : Gestion des notifications
   - `ToastProvider` : Gestion des toasts (messages d'alerte)
4. Monte le composant `App` dans `#root`

**Exemple** :
```javascript
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <ToastProvider>
            <Routes>
              <Route path="/*" element={<App />} />
            </Routes>
          </ToastProvider>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>
);
```

**Explication** :
- `React.StrictMode` : Mode strict de React pour détecter les problèmes
- `Router` : Fournit le contexte de routage à toute l'application
- Les providers enveloppent l'app pour partager l'état global

---

#### <span id="clientsrcappjsx">`client/src/App.jsx`</span>

**Emplacement** : `client/src/App.jsx`

**Rôle** : Composant racine qui définit toutes les routes de l'application et la structure de navigation.

**Fonctionnalités principales** :
1. Définit toutes les routes avec React Router
2. Gère l'authentification et les redirections
3. Affiche différents dashboards selon le rôle (admin, doctor, user)
4. Intègre le SEO avec `SEOProvider`

**Routes principales** :

```javascript
// Route publique - Page d'accueil
<Route path="/" element={<Layout />}>
  <Route index element={<Home />} />
  <Route path="contact" element={<Contact />} />
</Route>

// Routes pour les médecins, médicaments, laboratoires
<Route path="doctors" element={<Layout />}>
  <Route index element={<Doctors />} />
</Route>

// Routes du dashboard (protégées)
<Route path="dashboard/*" element={<Dashboard />}>
  {/* Routes conditionnelles selon le rôle */}
  {decodedToken.UserInfo.role === "admin" ? (
    <Route index element={<AdminHome />} />
  ) : decodedToken.UserInfo.role === "doctor" ? (
    <Route index element={<DoctorHome />} />
  ) : (
    <Route index element={<PatientHome />} />
  )}
</Route>
```

**Logique d'authentification** :
- Décode le token JWT pour obtenir le rôle de l'utilisateur
- Affiche le dashboard approprié selon le rôle
- Redirige vers `/login` si non authentifié

---

### 📁 Dossier `client/src/api/`

#### <span id="clientsrcapiaxiosjs">`client/src/api/axios.js`</span>

**Emplacement** : `client/src/api/axios.js`

**Rôle** : Configuration legacy de Axios (déprécié). Redirige vers `lib/api.js` pour la nouvelle configuration centralisée.

**Note** : Ce fichier existe pour la compatibilité avec l'ancien code. Les nouveaux composants doivent utiliser `lib/api.js`.

---

### 📁 Dossier `client/src/lib/`

Ce dossier contient les bibliothèques et configurations centralisées.

#### <span id="clientsrclibapijs">`client/src/lib/api.js`</span>

**Emplacement** : `client/src/lib/api.js`

**Rôle** : Configuration centralisée de l'instance Axios pour toutes les requêtes HTTP.

**Fonctionnalités** :
1. **Détermine l'URL de base** selon l'environnement :
   - Développement : `http://localhost:3001`
   - Production : `/api` (relatif) ou variable d'environnement `VITE_API_BASE`

2. **Intercepteur de requête** : Ajoute automatiquement le token JWT dans les headers
   ```javascript
   api.interceptors.request.use((config) => {
     const token = localStorage.getItem("accessToken");
     if (token) {
       config.headers.Authorization = `Bearer ${token}`;
     }
     return config;
   });
   ```

3. **Intercepteur de réponse** : Gère les erreurs 401 (non autorisé) en redirigeant vers `/login`

**Exemple d'utilisation** :
```javascript
import { api } from "../lib/api.js";

// GET request
const response = await api.get("/doctors");

// POST request
const response = await api.post("/appointments", appointmentData);
```

---

#### <span id="clientsrclibconstantsjs">`client/src/lib/constants.js`</span>

**Emplacement** : `client/src/lib/constants.js`

**Rôle** : Constantes et fonctions utilitaires pour les URLs d'images et de médias.

**Fonctions principales** :

1. **`API_BASE_URL`** : URL de base de l'API selon l'environnement
2. **`SOCKET_URL`** : URL du serveur WebSocket
3. **`getImageURL(filename)`** : Génère l'URL complète d'une image
   - En développement : `http://localhost:3001/uploads/image.jpg`
   - En production : `/uploads/image.jpg` (relatif)

**Exemple** :
```javascript
import { getImageURL } from "../lib/constants.js";

const imageUrl = getImageURL("doctor-profile.jpg");
// Dev: "http://localhost:3001/uploads/doctor-profile.jpg"
// Prod: "/uploads/doctor-profile.jpg"
```

---

#### <span id="clientsrclibsocketjs">`client/src/lib/socket.js`</span>

**Emplacement** : `client/src/lib/socket.js`

**Rôle** : Configuration et création de l'instance Socket.IO pour la communication WebSocket en temps réel.

**Fonctionnalités** :
- Se connecte au serveur WebSocket
- Gère l'authentification via token JWT
- Émet et écoute les événements Socket.IO

**Exemple d'utilisation** :
```javascript
import { createSocket } from "../lib/socket.js";

const socket = createSocket(userId, token, appointmentId);
socket.on("new-message", (message) => {
  console.log("Nouveau message:", message);
});
```

---

### 📁 Dossier `client/src/context/`

Les contextes React permettent de partager l'état global entre tous les composants sans prop drilling.

#### <span id="clientsrccontextauthcontextjsx">`client/src/context/AuthContext.jsx`</span>

**Emplacement** : `client/src/context/AuthContext.jsx`

**Rôle** : Gère l'état d'authentification global de l'application.

**État géré** :
- `userData` : Données du formulaire d'inscription
- `loginData` : Données du formulaire de connexion
- `auth` : Informations de l'utilisateur connecté
- `userInfo` : Informations détaillées de l'utilisateur
- `selectedAppt` : Rendez-vous sélectionné

**Fonctions principales** :
- `handleSignup()` : Gère l'inscription d'un nouvel utilisateur
- `handleLogin()` : Gère la connexion
- `handleLogout()` : Gère la déconnexion
- Validation des formulaires

**Exemple d'utilisation** :
```javascript
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const { auth, userInfo, handleLogin } = useContext(AuthContext);
```

---

#### <span id="clientsrccontextnotificationcontextjsx">`client/src/context/NotificationContext.jsx`</span>

**Emplacement** : `client/src/context/NotificationContext.jsx`

**Rôle** : Gère les notifications en temps réel via WebSocket.

**Fonctionnalités** :
1. **Récupère les notifications** depuis l'API
2. **Écoute les nouvelles notifications** via Socket.IO
3. **Gère le compteur de notifications non lues**
4. **Affiche des toasts** pour les notifications importantes
5. **Marque les notifications comme lues**

**État géré** :
- `notifications` : Liste de toutes les notifications
- `unreadCount` : Nombre de notifications non lues
- `loading` : État de chargement

**Exemple d'utilisation** :
```javascript
import { useContext } from "react";
import { NotificationContext } from "../context/NotificationContext";

const { notifications, unreadCount, markAsRead } = useContext(NotificationContext);
```

---

#### <span id="clientsrccontextseocontextjsx">`client/src/context/SEOContext.jsx`</span>

**Emplacement** : `client/src/context/SEOContext.jsx`

**Rôle** : Gère le SEO (Search Engine Optimization) dynamique de l'application.

**Fonctionnalités** :
1. **Récupère les données SEO** depuis l'API pour chaque page
2. **Met à jour dynamiquement** les meta tags (title, description, etc.)
3. **Fournit des valeurs par défaut** si l'API échoue

**Pages gérées** :
- `home`, `doctors`, `medicines`, `labs`, `blog`, `contact`

**Exemple d'utilisation** :
```javascript
import { usePageSEO } from "../hooks/usePageSEO";

function DoctorsPage() {
  usePageSEO('doctors'); // Met à jour automatiquement le SEO
  return <div>...</div>;
}
```

---

### 📁 Dossier `client/src/hooks/`

Les hooks personnalisés permettent de réutiliser la logique entre composants.

#### <span id="clientsrchooksuseaccesstokenjsx">`client/src/hooks/useAccessToken.jsx`</span>

**Emplacement** : `client/src/hooks/useAccessToken.jsx`

**Rôle** : Récupère et décode le token JWT depuis le localStorage.

**Retourne** :
- `accessToken` : Le token JWT brut
- `decodedToken` : Le token décodé (contient les infos utilisateur)

**Exemple** :
```javascript
import useAccessToken from "../hooks/useAccessToken";

const { accessToken, decodedToken } = useAccessToken();
const userId = decodedToken?.UserInfo?.id;
const userRole = decodedToken?.UserInfo?.role;
```

---

#### <span id="clientsrchooksuseauthjsx">`client/src/hooks/useAuth.jsx`</span>

**Emplacement** : `client/src/hooks/useAuth.jsx`

**Rôle** : Hook simplifié pour accéder au contexte d'authentification.

**Exemple** :
```javascript
import useAuth from "../hooks/useAuth";

const { auth, userInfo } = useAuth();
```

---

#### <span id="clientsrchooksuserefreshtokenjsx">`client/src/hooks/useRefreshToken.jsx`</span>

**Emplacement** : `client/src/hooks/useRefreshToken.jsx`

**Rôle** : Rafraîchit le token d'accès quand il expire.

**Fonctionnement** :
1. Appelle l'endpoint `/refresh` avec le refresh token (dans les cookies)
2. Reçoit un nouveau access token
3. Le sauvegarde dans le localStorage

**Exemple** :
```javascript
import useRefreshToken from "../hooks/useRefreshToken";

const refresh = useRefreshToken();
const newAccessToken = await refresh();
```

---

#### <span id="clientsrchooksuselogoutjsx">`client/src/hooks/useLogout.jsx`</span>

**Emplacement** : `client/src/hooks/useLogout.jsx`

**Rôle** : Gère la déconnexion de l'utilisateur.

**Actions** :
1. Appelle l'endpoint `/logout` pour supprimer le refresh token côté serveur
2. Supprime le access token du localStorage
3. Redirige vers `/login`

**Exemple** :
```javascript
import useLogout from "../hooks/useLogout";

const handleLogout = useLogout();
await handleLogout();
```

---

#### <span id="clientsrchooksusepageseojsx">`client/src/hooks/usePageSEO.jsx`</span>

**Emplacement** : `client/src/hooks/usePageSEO.jsx`

**Rôle** : Hook pour mettre à jour le SEO d'une page spécifique.

**Exemple** :
```javascript
import { usePageSEO } from "../hooks/usePageSEO";

function MedicinesPage() {
  usePageSEO('medicines');
  return <div>...</div>;
}
```

---

### 📁 Dossier `client/src/utils/`

#### <span id="clientsrcutilsvalidationjs">`client/src/utils/Validation.js`</span>

**Emplacement** : `client/src/utils/Validation.js`

**Rôle** : Fonctions de validation pour les formulaires.

**Fonctions disponibles** :

1. **`isValidEmail(email, setSignupMessage)`** :
   - Vérifie que l'email est valide avec une regex
   - Affiche un message d'erreur si invalide

2. **`isValidPhoneNumber(phoneNumber, setSignupMessage)`** :
   - Vérifie le format tunisien : `+216XXXXXXXX` ou `0XXXXXXXX`
   - Regex : `/^(\+216|0)?[0-9]{8}$/`

3. **`isValidPassword({ password, confirmPassword, setMessage })`** :
   - Vérifie que le mot de passe :
     - Contient au moins 8 caractères
     - Contient au moins un chiffre
     - Contient au moins une majuscule
     - Contient au moins un caractère spécial
     - Correspond à la confirmation

4. **`isValidData(data, setSignupMessage, step)`** :
   - Valide les données selon l'étape du formulaire d'inscription
   - Step 1 : Nom, prénom, email, rôle
   - Step 2 : Mot de passe, téléphone, date de naissance, spécialité
   - Step 3 : Documents professionnels (médecins uniquement)

**Exemple** :
```javascript
import { isValidEmail, isValidPassword } from "../utils/Validation";

if (!isValidEmail(email, setError)) return;
if (!isValidPassword({ password, confirmPassword, setMessage: setError })) return;
```

---

#### <span id="clientsrcutilscapitalizejs">`client/src/utils/Capitalize.js`</span>

**Emplacement** : `client/src/utils/Capitalize.js`

**Rôle** : Fonction utilitaire pour capitaliser les mots.

**Fonctionnement** :
- Prend un texte (string ou array)
- Sépare par les tirets `-`
- Met la première lettre de chaque mot en majuscule
- Rejoint avec des espaces

**Exemple** :
```javascript
import { capitalize } from "../utils/Capitalize";

capitalize("cardiologie"); // "Cardiologie"
capitalize("medecin-generaliste"); // "Medecin Generaliste"
```

---

### 📁 Dossier `client/src/data/`

#### <span id="clientsrcdatadatajs">`client/src/data/data.js`</span>

**Emplacement** : `client/src/data/data.js`

**Rôle** : Données statiques de l'application (spécialités médicales, villes tunisiennes, etc.).

**Contenu principal** :

1. **`doctorSpecialties`** : Liste des spécialités médicales avec descriptions
   ```javascript
   {
     value: "cardiologie",
     name: "Cardiologie",
     description: "Notre équipe de cardiologues..."
   }
   ```

2. **`tunisianCities`** : Liste des 24 gouvernorats tunisiens
   ```javascript
   ["Ariana", "Béja", "Ben Arous", ...]
   ```

3. **Autres données statiques** utilisées dans l'application

---

### 📁 Dossier `client/src/components/`

Ce dossier contient tous les composants React de l'application.

#### Structure du Dossier Components

```
components/
├── Layout.jsx              # Layout principal avec Header et Footer
├── Home.jsx                # Page d'accueil
├── Login.jsx               # Page de connexion
├── Signup/                 # Composants d'inscription
├── Header/                 # Composants du header
├── Footer.jsx              # Footer de l'application
├── Dashboard/              # Composants du dashboard
├── Appointment/            # Composants des rendez-vous
├── Profiles/              # Profils des médecins
├── Notifications/         # Composants de notifications
└── ... (autres composants)
```

---

#### <span id="clientsrccomponentslayoutjsx">`client/src/components/Layout.jsx`</span>

**Emplacement** : `client/src/components/Layout.jsx`

**Rôle** : Layout principal qui enveloppe toutes les pages publiques avec Header et Footer.

**Structure** :
```javascript
<div className="App">
  <Header />
  <Outlet />  {/* Contenu de la page actuelle */}
  <Footer />
</div>
```

**Utilisation** : Utilisé comme wrapper pour les routes publiques dans `App.jsx`.

---

#### <span id="clientsrccomponentshomejsx">`client/src/components/Home.jsx`</span>

**Emplacement** : `client/src/components/Home.jsx`

**Rôle** : Page d'accueil de l'application.

**Sections principales** :
- Hero section (bannière principale)
- Services proposés
- À propos
- Mission
- Newsletter

---

#### <span id="clientsrccomponentsloginjsx">`client/src/components/Login.jsx`</span>

**Emplacement** : `client/src/components/Login.jsx`

**Rôle** : Page de connexion pour les utilisateurs.

**Fonctionnalités** :
1. Formulaire de connexion (email, mot de passe)
2. Option "Se souvenir de moi"
3. Validation des champs
4. Appel à l'API `/login`
5. Gestion des erreurs
6. Redirection après connexion réussie

**Flux** :
```javascript
User saisit email/password 
  → Validation 
  → Appel API /login 
  → Reçoit accessToken et refreshToken 
  → Sauvegarde tokens 
  → Redirige vers dashboard
```

---

##### <span id="clientsrccomponentssignup">`client/src/components/Signup/`</span>

**Emplacement** : `client/src/components/Signup/`

**Rôle** : Processus d'inscription en plusieurs étapes.

---

#### <span id="clientsrccomponentssignupindexjsx">`client/src/components/Signup/index.jsx`</span>

**Emplacement** : `client/src/components/Signup/index.jsx`

**Rôle** : Composant principal qui gère les étapes d'inscription.

**Fonctionnalités** :
- Gère la navigation entre les étapes
- Valide les données à chaque étape
- Soumet les données finales à l'API

---

#### <span id="clientsrccomponentssignupsignupmainjsx">`client/src/components/Signup/SignupMain.jsx`</span>

**Emplacement** : `client/src/components/Signup/SignupMain.jsx`

**Rôle** : Étape 1 - Informations de base (nom, prénom, email, rôle).

**Champs** :
- Prénom
- Nom
- Email
- Rôle (patient, médecin)

---

#### <span id="clientsrccomponentssignupsignupdatajsx">`client/src/components/Signup/SignupData.jsx`</span>

**Emplacement** : `client/src/components/Signup/SignupData.jsx`

**Rôle** : Étape 2 - Sécurité et profil (mot de passe, téléphone, date de naissance, spécialité).

**Champs** :
- Mot de passe et confirmation
- Numéro de téléphone
- Date de naissance
- Spécialité (si médecin)

---

#### <span id="clientsrccomponentssignupsignupfinishjsx">`client/src/components/Signup/SignupFinish.jsx`</span>

**Emplacement** : `client/src/components/Signup/SignupFinish.jsx`

**Rôle** : Étape 3 - Documents professionnels (uniquement pour les médecins).

**Documents requis** :
- Photo de profil
- Pièce d'identité (type, numéro, image)
- Licence médicale (numéro, image)
- CV

**Flux d'inscription** :
```
Étape 1: Informations de base
  ↓
Étape 2: Sécurité et profil
  ↓
Étape 3: Documents (si médecin)
  ↓
Soumission finale → API /register
```

---

##### <span id="clientsrccomponentsheader">`client/src/components/Header/`</span>

**Emplacement** : `client/src/components/Header/`

**Rôle** : Header (en-tête) de l'application avec navigation.

---

#### <span id="clientsrccomponentsheaderindexjsx">`client/src/components/Header/index.jsx`</span>

**Emplacement** : `client/src/components/Header/index.jsx`

**Rôle** : Composant principal du header qui combine UpperHeader et Navbar.

---

#### <span id="clientsrccomponentsheadernavbarjsx">`client/src/components/Header/Navbar.jsx`</span>

**Emplacement** : `client/src/components/Header/Navbar.jsx`

**Rôle** : Barre de navigation principale.

**Fonctionnalités** :
- Navigation entre les pages
- Logo de l'application
- Menu responsive (desktop/mobile)
- Liens vers login/signup ou profil selon l'état d'authentification

---

#### <span id="clientsrccomponentsheadermobilemenujsx">`client/src/components/Header/MobileMenu.jsx`</span>

**Emplacement** : `client/src/components/Header/MobileMenu.jsx`

**Rôle** : Menu mobile (hamburger) pour les petits écrans.

**Fonctionnalités** :
- Menu hamburger
- Navigation mobile
- Fermeture automatique après sélection

---

#### <span id="clientsrccomponentsheaderupperheaderjsx">`client/src/components/Header/UpperHeader.jsx`</span>

**Emplacement** : `client/src/components/Header/UpperHeader.jsx`

**Rôle** : Barre supérieure (contact, réseaux sociaux).

**Contenu** :
- Informations de contact
- Liens vers les réseaux sociaux

---

#### <span id="clientsrccomponentsfooterjsx">`client/src/components/Footer.jsx`</span>

**Emplacement** : `client/src/components/Footer.jsx`

**Rôle** : Footer (pied de page) de l'application.

**Contenu** :
- Liens vers les pages importantes
- Informations de contact
- Réseaux sociaux
- Copyright

---

#### `client/src/components/Dashboard/`

**Emplacement** : `client/src/components/Dashboard/`

**Rôle** : Tous les composants liés au tableau de bord (dashboard).

**Structure** :
```
Dashboard/
├── index.jsx              # Conteneur principal du dashboard
├── Sidebar.jsx            # Barre latérale de navigation
├── Tabs.jsx               # Configuration des onglets selon le rôle
└── tabs/                  # Pages du dashboard
    ├── admin/             # Pages admin
    ├── doctor/            # Pages médecin
    ├── patient/           # Pages patient
    ├── Profile.jsx        # Profil utilisateur
    ├── Settings.jsx       # Paramètres
    └── UI/                # Composants UI réutilisables
```

---

#### <span id="clientsrccomponentsdashboardindexjsx">`client/src/components/Dashboard/index.jsx`</span>

**Emplacement** : `client/src/components/Dashboard/index.jsx`

**Rôle** : Conteneur principal du dashboard avec sidebar et header.

**Structure** :
```javascript
<div className="flex h-screen">
  <Sidebar />           {/* Navigation latérale */}
  <main>
    <header>            {/* Header avec notification bell */}
      <NotificationBell />
      <UserProfile />
    </header>
    <Outlet />          {/* Contenu de la page actuelle */}
  </main>
</div>
```

---

#### <span id="clientsrccomponentsdashboardsidebarjsx">`client/src/components/Dashboard/Sidebar.jsx`</span>

**Emplacement** : `client/src/components/Dashboard/Sidebar.jsx`

**Rôle** : Barre latérale de navigation du dashboard.

**Fonctionnalités** :
1. Affiche les onglets selon le rôle (admin/doctor/user)
2. Compte les demandes en attente (badge sur "Consultations")
3. Navigation entre les pages du dashboard
4. Responsive (se cache sur mobile, s'affiche avec hamburger)

**Exemple d'onglets** :
- Admin : Accueil, Patients, Médecins, Laboratoires, Médicaments, Blogs, SEO, Avis, Paramètres
- Doctor : Accueil, Consultations, Tarifs, Profil, Paramètres
- Patient : Accueil, Consultations, Profil, Paramètres

---

#### <span id="clientsrccomponentsdashboardtabsjsx">`client/src/components/Dashboard/Tabs.jsx`</span>

**Emplacement** : `client/src/components/Dashboard/Tabs.jsx`

**Rôle** : Configuration des onglets selon le rôle.

**Fonctionnalités** :
- Définit les onglets disponibles pour chaque rôle (admin, doctor, user)
- Retourne la liste des onglets appropriés
- Utilisé par Sidebar pour afficher la navigation

---

##### <span id="clientsrccomponentsdashboardtabsadmin">`client/src/components/Dashboard/tabs/admin/`</span>

**Emplacement** : `client/src/components/Dashboard/tabs/admin/`

**Rôle** : Pages du dashboard réservées aux administrateurs.

---

#### <span id="clientsrccomponentsdashboardtabsadminadminhomejsx">`client/src/components/Dashboard/tabs/admin/AdminHome.jsx`</span>

**Emplacement** : `client/src/components/Dashboard/tabs/admin/AdminHome.jsx`

**Rôle** : Page d'accueil admin avec statistiques et graphiques.

**Fonctionnalités** :
- Statistiques globales (nombre de patients, médecins, rendez-vous, etc.)
- Graphiques de visualisation des données
- Activités récentes
- Actions rapides

---

#### <span id="clientsrccomponentsdashboardtabsadminmanagepatientsjsx">`client/src/components/Dashboard/tabs/admin/ManagePatients.jsx`</span>

**Emplacement** : `client/src/components/Dashboard/tabs/admin/ManagePatients.jsx`

**Rôle** : Gestion des patients (liste, recherche, filtres).

**Fonctionnalités** :
- Liste avec pagination
- Recherche et filtres
- Actions CRUD (Create, Read, Update, Delete)
- Modals pour ajout/modification

---

#### <span id="clientsrccomponentsdashboardtabsadminmanagedoctorsjsx">`client/src/components/Dashboard/tabs/admin/ManageDoctors.jsx`</span>

**Emplacement** : `client/src/components/Dashboard/tabs/admin/ManageDoctors.jsx`

**Rôle** : Gestion des médecins (ajout, modification, suppression, approbation).

**Fonctionnalités** :
- Liste des médecins avec statut d'approbation
- Approuver/rejeter les médecins
- Modifier les informations des médecins
- Gérer les spécialités

---

#### <span id="clientsrccomponentsdashboardtabsadminmanagelabsjsx">`client/src/components/Dashboard/tabs/admin/ManageLabs.jsx`</span>

**Emplacement** : `client/src/components/Dashboard/tabs/admin/ManageLabs.jsx`

**Rôle** : Gestion des laboratoires.

**Fonctionnalités** :
- Liste des laboratoires
- Ajouter/modifier/supprimer des laboratoires
- Gérer les informations (adresse, téléphone, etc.)

---

#### <span id="clientsrccomponentsdashboardtabsadminmanagemedicinesjsx">`client/src/components/Dashboard/tabs/admin/ManageMedicines.jsx`</span>

**Emplacement** : `client/src/components/Dashboard/tabs/admin/ManageMedicines.jsx`

**Rôle** : Gestion des médicaments.

**Fonctionnalités** :
- Liste des médicaments
- Ajouter/modifier/supprimer des médicaments
- Gérer les informations (dosage, prix, effets secondaires, etc.)

---

#### <span id="clientsrccomponentsdashboardtabsadminmanageblogsjsx">`client/src/components/Dashboard/tabs/admin/ManageBlogs.jsx`</span>

**Emplacement** : `client/src/components/Dashboard/tabs/admin/ManageBlogs.jsx`

**Rôle** : Gestion des articles de blog.

**Fonctionnalités** :
- Liste des articles
- Créer/modifier/supprimer des articles
- Publier/dépublier des articles
- Gérer les images et le contenu

---

#### <span id="clientsrccomponentsdashboardtabsadminmanageseojsx">`client/src/components/Dashboard/tabs/admin/ManageSEO.jsx`</span>

**Emplacement** : `client/src/components/Dashboard/tabs/admin/ManageSEO.jsx`

**Rôle** : Gestion du SEO pour chaque page.

**Fonctionnalités** :
- Configurer les meta tags (title, description, keywords)
- Gérer le SEO pour chaque page de l'application
- Prévisualisation des résultats SEO

---

#### <span id="clientsrccomponentsdashboardtabsadminmanageratingsjsx">`client/src/components/Dashboard/tabs/admin/ManageRatings.jsx`</span>

**Emplacement** : `client/src/components/Dashboard/tabs/admin/ManageRatings.jsx`

**Rôle** : Gestion des avis et évaluations.

**Fonctionnalités** :
- Liste des avis
- Modérer les avis
- Supprimer les avis inappropriés
- Statistiques des évaluations

---

#### <span id="clientsrccomponentsdashboardtabsadminfinancialanalyticsjsx">`client/src/components/Dashboard/tabs/admin/FinancialAnalytics.jsx`</span>

**Emplacement** : `client/src/components/Dashboard/tabs/admin/FinancialAnalytics.jsx`

**Rôle** : Analytics financiers (si applicable).

**Fonctionnalités** :
- Graphiques de revenus
- Statistiques financières
- Analyses de performance

---

##### <span id="clientsrccomponentsdashboardtabsdoctor">`client/src/components/Dashboard/tabs/doctor/`</span>

**Emplacement** : `client/src/components/Dashboard/tabs/doctor/`

**Rôle** : Pages du dashboard pour les médecins.

---

#### <span id="clientsrccomponentsdashboardtabsdoctordoctorhomejsx">`client/src/components/Dashboard/tabs/doctor/DoctorHome.jsx`</span>

**Emplacement** : `client/src/components/Dashboard/tabs/doctor/DoctorHome.jsx`

**Rôle** : Page d'accueil médecin avec statistiques.

**Fonctionnalités** :
- Statistiques personnelles (nombre de consultations, revenus, etc.)
- Graphiques de performance
- Demandes en attente
- Actions rapides

---

#### <span id="clientsrccomponentsdashboardtabsdoctordemandesjsx">`client/src/components/Dashboard/tabs/doctor/Demandes.jsx`</span>

**Emplacement** : `client/src/components/Dashboard/tabs/doctor/Demandes.jsx`

**Rôle** : Gestion des demandes de rendez-vous (approuver, rejeter, voir détails).

**Fonctionnalités** :
- Voir les demandes de rendez-vous en attente
- Approuver/rejeter les demandes
- Voir l'historique des consultations
- Filtrer par statut (en attente, approuvées, rejetées, complétées)

---

#### <span id="clientsrccomponentsdashboardtabsdoctorpricingjsx">`client/src/components/Dashboard/tabs/doctor/Pricing.jsx`</span>

**Emplacement** : `client/src/components/Dashboard/tabs/doctor/Pricing.jsx`

**Rôle** : Gestion des tarifs de consultation.

**Fonctionnalités** :
- Définir les tarifs de consultation
- Gérer différents types de consultations
- Modifier les prix

---

##### <span id="clientsrccomponentsdashboardtabspatient">`client/src/components/Dashboard/tabs/patient/`</span>

**Emplacement** : `client/src/components/Dashboard/tabs/patient/`

**Rôle** : Pages du dashboard pour les patients.

---

#### <span id="clientsrccomponentsdashboardtabspatientpatienthomejsx">`client/src/components/Dashboard/tabs/patient/PatientHome.jsx`</span>

**Emplacement** : `client/src/components/Dashboard/tabs/patient/PatientHome.jsx`

**Rôle** : Page d'accueil patient avec statistiques.

**Fonctionnalités** :
- Statistiques personnelles (nombre de consultations, prochains rendez-vous)
- Graphiques de santé
- Actions rapides (réserver un rendez-vous, voir l'historique)

---

#### <span id="clientsrccomponentsdashboardtabspatientdemandesjsx">`client/src/components/Dashboard/tabs/patient/Demandes.jsx`</span>

**Emplacement** : `client/src/components/Dashboard/tabs/patient/Demandes.jsx`

**Rôle** : Liste des consultations du patient (en attente, approuvées, rejetées).

**Fonctionnalités** :
- Voir l'état des demandes de rendez-vous
- Voir l'historique des consultations
- Filtrer par statut (en attente, approuvées, rejetées, complétées)
- Voir les détails de chaque consultation

---

#### <span id="clientsrccomponentsdashboardtabsprofilejsx">`client/src/components/Dashboard/tabs/Profile.jsx`</span>

**Emplacement** : `client/src/components/Dashboard/tabs/Profile.jsx`

**Rôle** : Page de profil utilisateur (tous les rôles).

**Fonctionnalités** :
- Affiche les informations de l'utilisateur
- Permet de modifier le profil
- Upload de photo de profil

---

#### <span id="clientsrccomponentsdashboardtabssettingsjsx">`client/src/components/Dashboard/tabs/Settings.jsx`</span>

**Emplacement** : `client/src/components/Dashboard/tabs/Settings.jsx`

**Rôle** : Page de paramètres utilisateur.

**Fonctionnalités** :
- Changer le mot de passe
- Modifier les préférences
- Gérer les notifications

---

##### `client/src/components/Dashboard/tabs/UI/`

**Emplacement** : `client/src/components/Dashboard/tabs/UI/`

**Rôle** : Composants UI réutilisables pour le dashboard.

**Fichiers** :

1. **`Modal.jsx`** : Composant modal réutilisable
2. **`ImagePreview.jsx`** : Prévisualisation d'images

---

##### <span id="clientsrccomponentsappointment">`client/src/components/Appointment/`</span>

**Emplacement** : `client/src/components/Appointment/`

**Rôle** : Composants pour la gestion des rendez-vous et du chat.

---

#### <span id="clientsrccomponentsappointmentindexjsx">`client/src/components/Appointment/index.jsx`</span>

**Emplacement** : `client/src/components/Appointment/index.jsx`

**Rôle** : Composant principal du rendez-vous qui combine Interface et Sidebar.

---

#### <span id="clientsrccomponentsappointmentinterfacejsx">`client/src/components/Appointment/Interface.jsx`</span>

**Emplacement** : `client/src/components/Appointment/Interface.jsx`

**Rôle** : Interface de chat entre patient et médecin.

**Fonctionnalités** :
- Chat en temps réel entre patient et médecin
- Indicateur de frappe (typing indicator)
- Statut "vu" des messages
- Upload de fichiers/images

---

#### <span id="clientsrccomponentsappointmentsidebarjsx">`client/src/components/Appointment/Sidebar.jsx`</span>

**Emplacement** : `client/src/components/Appointment/Sidebar.jsx`

**Rôle** : Barre latérale avec notes et informations du rendez-vous.

**Fonctionnalités** :
- Notes de consultation
- Informations du rendez-vous
- Historique des messages

---

#### <span id="clientsrccomponentsappointmentbookingmodaljsx">`client/src/components/Appointment/BookingModal.jsx`</span>

**Emplacement** : `client/src/components/Appointment/BookingModal.jsx`

**Rôle** : Modal pour réserver un rendez-vous.

**Fonctionnalités** :
- Formulaire de réservation
- Sélection de date et heure
- Confirmation de réservation

---

#### <span id="clientsrccomponentsappointmentsocketjsx">`client/src/components/Appointment/socket.jsx`</span>

**Emplacement** : `client/src/components/Appointment/socket.jsx`

**Rôle** : Configuration Socket.IO pour le chat.

**Fonctionnalités** :
- Connexion WebSocket
- Gestion des événements Socket.IO
- Émission et réception de messages

---

##### <span id="clientsrccomponentsprofiles">`client/src/components/Profiles/`</span>

**Emplacement** : `client/src/components/Profiles/`

**Rôle** : Composants pour afficher les profils des médecins.

---

#### <span id="clientsrccomponentsprofilesdoctorjsx">`client/src/components/Profiles/Doctor.jsx`</span>

**Emplacement** : `client/src/components/Profiles/Doctor.jsx`

**Rôle** : Page de profil détaillée d'un médecin.

**Fonctionnalités** :
- Affichage des informations du médecin
- Avis et évaluations
- Réservation de rendez-vous
- Tarifs de consultation

---

#### <span id="clientsrccomponentsprofilesstarratingjsx">`client/src/components/Profiles/StarRating.jsx`</span>

**Emplacement** : `client/src/components/Profiles/StarRating.jsx`

**Rôle** : Composant d'évaluation par étoiles.

**Fonctionnalités** :
- Affichage des étoiles (1-5)
- Permet de laisser une note
- Affichage visuel interactif

---

#### <span id="clientsrccomponentsprofilesavgratingjsx">`client/src/components/Profiles/AvgRating.jsx`</span>

**Emplacement** : `client/src/components/Profiles/AvgRating.jsx`

**Rôle** : Affichage de la note moyenne.

**Fonctionnalités** :
- Calcule la moyenne des évaluations
- Affiche la note moyenne avec étoiles
- Affiche le nombre total d'avis

---

##### <span id="clientsrccomponentsnotifications">`client/src/components/Notifications/`</span>

**Emplacement** : `client/src/components/Notifications/`

**Rôle** : Composants pour les notifications.

---

#### <span id="clientsrccomponentsnotificationsnotificationbelljsx">`client/src/components/Notifications/NotificationBell.jsx`</span>

**Emplacement** : `client/src/components/Notifications/NotificationBell.jsx`

**Rôle** : Icône de cloche avec badge de notifications non lues.

**Fonctionnalités** :
- Affichage du nombre de notifications non lues
- Dropdown avec liste des notifications
- Marquer comme lu
- Navigation vers les notifications

---

#### <span id="clientsrccomponentsnotificationstoastcontainerjsx">`client/src/components/Notifications/ToastContainer.jsx`</span>

**Emplacement** : `client/src/components/Notifications/ToastContainer.jsx`

**Rôle** : Conteneur pour les toasts (messages d'alerte).

**Fonctionnalités** :
- Toasts pour les notifications importantes
- Différents types de toasts (success, error, warning, info)
- Fermeture automatique ou manuelle

---

#### Autres Composants

---

#### <span id="clientsrccomponentsdoctorsjsx">`client/src/components/Doctors.jsx`</span>

**Emplacement** : `client/src/components/Doctors.jsx`

**Rôle** : Page de liste des médecins avec recherche et filtres.

**Fonctionnalités** :
- Liste des médecins avec pagination
- Recherche par nom, spécialité
- Filtres par spécialité, ville
- Affichage des informations principales
- Lien vers le profil détaillé

---

#### <span id="clientsrccomponentsmedicinesjsx">`client/src/components/Medicines.jsx`</span>

**Emplacement** : `client/src/components/Medicines.jsx`

**Rôle** : Page de liste des médicaments.

**Fonctionnalités** :
- Liste des médicaments avec pagination
- Recherche par nom
- Filtres par fabricant, forme, dosage
- Affichage des détails (prix, effets secondaires)
- Modal de détails

---

#### <span id="clientsrccomponentslabsjsx">`client/src/components/Labs.jsx`</span>

**Emplacement** : `client/src/components/Labs.jsx`

**Rôle** : Page de liste des laboratoires.

**Fonctionnalités** :
- Liste des laboratoires avec pagination
- Recherche par nom
- Filtres par ville
- Affichage des informations (adresse, téléphone)
- Modal de détails

---

#### <span id="clientsrccomponentsblogjsx">`client/src/components/Blog.jsx`</span>

**Emplacement** : `client/src/components/Blog.jsx`

**Rôle** : Page de blog avec articles.

**Fonctionnalités** :
- Liste des articles de blog
- Recherche et filtres
- Affichage des articles avec images
- Pagination
- Lien vers les articles individuels

---

#### <span id="clientsrccomponentscontactjsx">`client/src/components/Contact.jsx`</span>

**Emplacement** : `client/src/components/Contact.jsx`

**Rôle** : Page de contact.

**Fonctionnalités** :
- Formulaire de contact
- Informations de contact
- Carte (si applicable)
- Validation du formulaire

---

#### <span id="clientsrccomponentsherojsx">`client/src/components/Hero.jsx`</span>

**Emplacement** : `client/src/components/Hero.jsx`

**Rôle** : Section hero (bannière) de la page d'accueil.

**Fonctionnalités** :
- Bannière principale avec texte
- Call-to-action
- Design attractif et responsive

---

#### <span id="clientsrccomponentsrequireauthjsx">`client/src/components/RequireAuth.jsx`</span>

**Emplacement** : `client/src/components/RequireAuth.jsx`

**Rôle** : Composant de protection de route (redirige vers login si non authentifié).

**Fonctionnalités** :
- Vérifie si l'utilisateur est authentifié
- Redirige vers `/login` si non authentifié
- Protège les routes privées

---

#### <span id="clientsrccomponentsgloballoaderjsx">`client/src/components/GlobalLoader.jsx`</span>

**Emplacement** : `client/src/components/GlobalLoader.jsx`

**Rôle** : Loader global de l'application.

**Fonctionnalités** :
- Affiche un loader pendant le chargement
- Utilisé pour les opérations asynchrones
- Design cohérent avec l'application

---

## <span id="serveur-backend">Serveur (Backend)</span>

### Structure des Dossiers

```
server/
├── package.json            # Dépendances et scripts npm
├── src/
│   ├── server.js           # Point d'entrée du serveur
│   ├── config/             # Configuration (DB, CORS, etc.)
│   └── api/
│       ├── controllers/    # Contrôleurs (logique métier)
│       ├── models/         # Modèles Mongoose (schémas DB)
│       ├── routes/         # Routes Express
│       └── middleware/     # Middlewares (auth, upload, etc.)
├── uploads/                # Fichiers uploadés (images)
└── public/                 # Fichiers statiques
```

---

### 📄 Fichiers de Configuration

#### <span id="serverpackagejson">`server/package.json`</span>

**Emplacement** : `server/package.json`

**Rôle** : Définit les dépendances et scripts npm du serveur.

**Scripts** :
- `npm start` : Lance le serveur avec nodemon (redémarre automatiquement)

**Dépendances principales** :
- `express` : Framework web Node.js
- `mongoose` : ODM pour MongoDB
- `jsonwebtoken` : Génération et vérification de tokens JWT
- `bcrypt` : Hachage de mots de passe
- `multer` : Gestion des uploads de fichiers
- `socket.io` : WebSocket pour le temps réel
- `cors` : Gestion CORS
- `dotenv` : Variables d'environnement
- `cookie-parser` : Parsing des cookies

---

### 📄 Point d'Entrée du Serveur

#### <span id="serversrcserverjs">`server/src/server.js`</span>

**Emplacement** : `server/src/server.js`

**Rôle** : Point d'entrée principal du serveur Express. Configure le serveur HTTP, WebSocket, et toutes les routes.

**Structure** :

1. **Configuration initiale** :
   ```javascript
   require("dotenv").config();  // Charge les variables d'environnement
   const app = express();
   const http = require("http").createServer(app);
   const io = require("socket.io")(http);  // WebSocket
   ```

2. **Middleware Socket.IO** : Authentification des connexions WebSocket
   ```javascript
   io.use((socket, next) => {
     // Vérifie le token JWT
     // Joint la room user_${userId} pour les notifications
   });
   ```

3. **Événements Socket.IO** :
   - `connection` : Nouvelle connexion WebSocket
   - `add-note`, `delete-note` : Gestion des notes de consultation
   - `send-message` : Messages du chat
   - `typing` : Indicateur de frappe
   - `message-seen` : Statut "vu" des messages

4. **Middleware Express** :
   - `express.static` : Servir les fichiers statiques (`/uploads`, `public`)
   - `cors` : Gestion CORS
   - `express.json()` : Parser JSON
   - `cookie-parser` : Parser cookies

5. **Routes** :
   ```javascript
   app.use("/register", require("./api/routes/register"));
   app.use("/login", require("./api/routes/auth"));
   app.use("/doctors", require("./api/routes/doctorRoutes"));
   // ... autres routes
   ```

6. **Production** : Sert les fichiers React compilés
   ```javascript
   if (process.env.NODE_ENV === "production") {
     app.use(express.static(path.join(__dirname, "../../client/dist")));
   }
   ```

7. **Démarrage** : Attend la connexion MongoDB puis démarre le serveur
   ```javascript
   mongoose.connection.once("open", () => {
     http.listen(PORT, "0.0.0.0", () => {
       console.log("App listening at http://%s:%s", host, port);
     });
   });
   ```

---

### 📁 Dossier `server/src/config/`

#### <span id="serversrcconfigdbjs">`server/src/config/db.js`</span>

**Emplacement** : `server/src/config/db.js`

**Rôle** : Configuration de la connexion à MongoDB.

**Fonctionnement** :
```javascript
const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    });
  } catch (err) {
    console.error(err);
  }
};
```

**Utilisation** : Appelé dans `server.js` avant de démarrer le serveur.

---

#### <span id="serversrcconfigallowedoriginsjs">`server/src/config/allowedOrigins.js`</span>

**Emplacement** : `server/src/config/allowedOrigins.js`

**Rôle** : Liste des origines autorisées pour CORS.

**Contenu** :
```javascript
const allowedOrigins = [
  "http://localhost:5173",  // Dev frontend
  "http://localhost:3000",
  // ... autres origines
];
```

---

#### <span id="serversrcconfigcorsoptionsjs">`server/src/config/corsOptions.js`</span>

**Emplacement** : `server/src/config/corsOptions.js`

**Rôle** : Configuration CORS pour Express.

**Options** :
- `origin` : Fonction qui vérifie si l'origine est autorisée
- `credentials` : Autorise l'envoi de cookies
- `optionsSuccessStatus` : Status code pour les requêtes OPTIONS

---

### 📁 Dossier `server/src/api/models/`

Les modèles Mongoose définissent la structure des documents dans MongoDB.

#### <span id="serversrcapimodelsuserjs">`server/src/api/models/User.js`</span>

**Emplacement** : `server/src/api/models/User.js`

**Rôle** : Modèle pour les utilisateurs (patients, médecins, admins).

**Schéma** :
```javascript
{
  email: String (unique, required),
  phoneNumber: String,
  password: String (required, hashed),
  dateOfBirth: Date,
  profileImage: String (path),
  role: String (enum: ["user", "doctor", "admin"]),
  firstName: String (required),
  lastName: String (required),
  age: Number,
  sex: String,
  allergies: [String],
  medicalHistory: [{ date: Date, entry: String }],
  refreshToken: String
}
```

**Utilisation** :
```javascript
const User = require("./models/User");
const user = await User.findOne({ email: "user@example.com" });
```

---

#### <span id="serversrcapimodelsdoctorjs">`server/src/api/models/Doctor.js`</span>

**Emplacement** : `server/src/api/models/Doctor.js`

**Rôle** : Modèle pour les médecins (étend User avec des champs spécifiques).

**Champs supplémentaires** :
- `speciality` : Spécialité médicale
- `licenseNumber` : Numéro de licence
- `licenseImage` : Image de la licence
- `idType` : Type de pièce d'identité
- `idNumber` : Numéro de pièce d'identité
- `idImage` : Image de la pièce d'identité
- `cvImage` : CV du médecin
- `isApproved` : Statut d'approbation (admin)
- `pricing` : Référence vers DoctorPricing

---

#### <span id="serversrcapimodelsappointmentjs">`server/src/api/models/Appointment.js`</span>

**Emplacement** : `server/src/api/models/Appointment.js`

**Rôle** : Modèle pour les rendez-vous médicaux.

**Schéma** :
```javascript
{
  userId: ObjectId (référence User),
  doctorId: ObjectId (référence Doctor),
  date: Date,
  time: String,
  status: String (enum: ["pending", "approved", "rejected", "completed"]),
  notes: [String],
  messages: [{
    senderId: ObjectId,
    content: String,
    timestamp: Date,
    isRead: Boolean,
    attachments: [String]
  }]
}
```

---

#### <span id="serversrcapimodelsmedicinejs">`server/src/api/models/Medicine.js`</span>

**Emplacement** : `server/src/api/models/Medicine.js`

**Rôle** : Modèle pour les médicaments.

**Champs** :
- `name` : Nom du médicament
- `manufacturer` : Fabricant
- `dosage` : Dosage
- `form` : Forme (comprimé, sirop, etc.)
- `price` : Prix
- `description` : Description
- `sideEffects` : Effets secondaires
- `image` : Image du médicament

---

#### <span id="serversrcapimodelslabjs">`server/src/api/models/Lab.js`</span>

**Emplacement** : `server/src/api/models/Lab.js`

**Rôle** : Modèle pour les laboratoires.

**Champs** :
- `name` : Nom du laboratoire
- `address` : Adresse complète (rue, ville, code postal)
- `phoneNumber` : Téléphone
- `email` : Email
- `image` : Image du laboratoire

---

#### <span id="serversrcapimodelsblogjs">`server/src/api/models/Blog.js`</span>

**Emplacement** : `server/src/api/models/Blog.js`

**Rôle** : Modèle pour les articles de blog.

**Champs** :
- `title` : Titre
- `slug` : URL-friendly title
- `content` : Contenu de l'article
- `author` : Auteur
- `image` : Image de couverture
- `published` : Boolean (publié ou non)
- `publishedAt` : Date de publication

---

#### <span id="serversrcapimodelsnotificationjs">`server/src/api/models/Notification.js`</span>

**Emplacement** : `server/src/api/models/Notification.js`

**Rôle** : Modèle pour les notifications.

**Schéma** :
```javascript
{
  userId: ObjectId,
  title: String,
  message: String,
  type: String (enum: ["appointment", "approval", "rejection"]),
  priority: String (enum: ["low", "medium", "high"]),
  isRead: Boolean,
  actionUrl: String,
  metadata: Object
}
```

---

#### <span id="serversrcapimodelsratingjs">`server/src/api/models/Rating.js`</span>

**Emplacement** : `server/src/api/models/Rating.js`

**Rôle** : Modèle pour les avis et évaluations.

**Champs** :
- `userId` : Utilisateur qui a laissé l'avis
- `doctorId` : Médecin évalué
- `rating` : Note (1-5)
- `comment` : Commentaire
- `createdAt` : Date de création

---

#### <span id="serversrcapimodelsseojs">`server/src/api/models/SEO.js`</span>

**Emplacement** : `server/src/api/models/SEO.js`

**Rôle** : Modèle pour les données SEO de chaque page.

**Champs** :
- `page` : Nom de la page (home, doctors, etc.)
- `title` : Titre SEO
- `description` : Meta description
- `keywords` : Mots-clés

---

#### Autres Modèles

- **`DoctorPricing.js`** : Tarifs de consultation des médecins
- **`Speciality.js`** : Spécialités médicales

---

### 📁 Dossier `server/src/api/middleware/`

#### <span id="serversrcapimiddlewareverifyjwtjs">`server/src/api/middleware/verifyJWT.js`</span>

**Emplacement** : `server/src/api/middleware/verifyJWT.js`

**Rôle** : Middleware pour vérifier le token JWT dans les requêtes.

**Fonctionnement** :
1. Extrait le token du header `Authorization: Bearer <token>`
2. Vérifie le token avec `jwt.verify()`
3. Ajoute `req.user` avec les infos décodées
4. Passe à la route suivante ou retourne 401 si invalide

**Utilisation** :
```javascript
const verifyJWT = require("./middleware/verifyJWT");

router.get("/protected", verifyJWT, controller.getProtectedData);
```

---

#### <span id="serversrcapimiddlewareverifyrolejs">`server/src/api/middleware/verifyRole.js`</span>

**Emplacement** : `server/src/api/middleware/verifyRole.js`

**Rôle** : Middleware pour vérifier le rôle de l'utilisateur.

**Utilisation** :
```javascript
const verifyRole = require("./middleware/verifyRole");

router.get("/admin-only", verifyJWT, verifyRole("admin"), controller.adminAction);
```

---

#### <span id="serversrcapimiddlewaremulterjs">`server/src/api/middleware/multer.js`</span>

**Emplacement** : `server/src/api/middleware/multer.js`

**Rôle** : Configuration Multer pour l'upload de fichiers.

**Configuration** :
- Destination : `server/uploads/`
- Nom de fichier : Génère un nom unique
- Filtres : Accepte seulement images (jpg, png, etc.)

**Utilisation** :
```javascript
const upload = require("./middleware/multer");

router.post("/upload", upload.single("image"), controller.uploadImage);
```

---

#### <span id="serversrcapimiddlewarecredentialsjs">`server/src/api/middleware/credentials.js`</span>

**Emplacement** : `server/src/api/middleware/credentials.js`

**Rôle** : Middleware pour gérer les credentials CORS.

**Fonctionnement** : Ajoute les headers nécessaires pour les requêtes avec credentials (cookies).

---

### 📁 Dossier `server/src/api/routes/`

Les routes définissent les endpoints de l'API et les associent aux contrôleurs.

#### <span id="serversrcapiroutesauthjs">`server/src/api/routes/auth.js`</span>

**Emplacement** : `server/src/api/routes/auth.js`

**Rôle** : Route pour l'authentification (connexion).

**Endpoint** :
- `POST /login` : Connexion utilisateur

**Exemple** :
```javascript
const router = express.Router();
router.post("/", authController.handleAuth);
```

---

#### <span id="serversrcapiroutesregisterjs">`server/src/api/routes/register.js`</span>

**Emplacement** : `server/src/api/routes/register.js`

**Rôle** : Route pour l'inscription.

**Endpoint** :
- `POST /register` : Inscription nouvel utilisateur

---

#### <span id="serversrcapiroutesrefreshjs">`server/src/api/routes/refresh.js`</span>

**Emplacement** : `server/src/api/routes/refresh.js`

**Rôle** : Route pour rafraîchir le token d'accès.

**Endpoint** :
- `POST /refresh` : Rafraîchit l'access token avec le refresh token (dans les cookies)

---

#### <span id="serversrcapirouteslogoutjs">`server/src/api/routes/logout.js`</span>

**Emplacement** : `server/src/api/routes/logout.js`

**Rôle** : Route pour la déconnexion.

**Endpoint** :
- `POST /logout` : Déconnecte l'utilisateur (supprime le refresh token)

---

#### <span id="serversrcapiroutesdoctorroutesjs">`server/src/api/routes/doctorRoutes.js`</span>

**Emplacement** : `server/src/api/routes/doctorRoutes.js`

**Rôle** : Routes pour la gestion des médecins.

**Endpoints** :
- `GET /doctors` : Liste des médecins
- `GET /doctors/:id` : Détails d'un médecin
- `POST /doctors` : Créer un médecin (admin)
- `PUT /doctors/:id` : Modifier un médecin
- `DELETE /doctors/:id` : Supprimer un médecin
- `PUT /doctors/:id/approve` : Approuver un médecin (admin)
- `PUT /doctors/:id/reject` : Rejeter un médecin (admin)

---

#### <span id="serversrcapiroutesappointmentroutesjs">`server/src/api/routes/appointmentRoutes.js`</span>

**Emplacement** : `server/src/api/routes/appointmentRoutes.js`

**Rôle** : Routes pour la gestion des rendez-vous.

**Endpoints** :
- `GET /appointments/user/:userId` : Rendez-vous d'un patient
- `GET /appointments/doctor/:doctorId` : Rendez-vous d'un médecin
- `POST /appointments` : Créer un rendez-vous
- `PUT /appointments/:id` : Modifier un rendez-vous
- `DELETE /appointments/:id` : Supprimer un rendez-vous

---

#### <span id="serversrcapiroutesnotificationroutesjs">`server/src/api/routes/notificationRoutes.js`</span>

**Emplacement** : `server/src/api/routes/notificationRoutes.js`

**Rôle** : Routes pour les notifications.

**Endpoints** :
- `GET /notifications/:userId` : Notifications d'un utilisateur
- `PUT /notifications/:id/read` : Marquer comme lu
- `PUT /notifications/read-all` : Marquer toutes comme lues

---

#### Autres Routes

- **`adminRoutes.js`** : Routes admin (statistiques, etc.)
- **`medicineRoutes.js`** : Routes pour les médicaments
- **`labRoutes.js`** : Routes pour les laboratoires
- **`blogRoutes.js`** : Routes pour le blog
- **`ratingRoutes.js`** : Routes pour les avis
- **`seoRoutes.js`** : Routes pour le SEO
- **`userRoutes.js`** : Routes pour les utilisateurs

---

### 📁 Dossier `server/src/api/controllers/`

Les contrôleurs contiennent la logique métier pour chaque route.

#### <span id="serversrcapicontrollersauthcontrollerjs">`server/src/api/controllers/authController.js`</span>

**Emplacement** : `server/src/api/controllers/authController.js`

**Rôle** : Gère l'authentification (connexion).

**Fonction `handleAuth`** :
1. Vérifie email et mot de passe
2. Compare le mot de passe hashé avec `bcrypt.compare()`
3. Génère un access token (15 min) et un refresh token (7 jours)
4. Sauvegarde le refresh token dans la DB et dans un cookie
5. Retourne l'access token

**Exemple** :
```javascript
const handleAuth = async (req, res) => {
  const { email, password } = req.body;
  
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Email invalide" });
  
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: "Mot de passe invalide" });
  
  const accessToken = jwt.sign({ UserInfo: {...} }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ UserInfo: {...} }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
  
  user.refreshToken = refreshToken;
  await user.save();
  
  res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.json({ accessToken });
};
```

---

#### <span id="serversrcapicontrollersregistercontrollerjs">`server/src/api/controllers/registerController.js`</span>

**Emplacement** : `server/src/api/controllers/registerController.js`

**Rôle** : Gère l'inscription de nouveaux utilisateurs.

**Fonctionnement** :
1. Valide les données reçues
2. Vérifie si l'email existe déjà
3. Hash le mot de passe avec `bcrypt.hash()`
4. Crée l'utilisateur dans la DB
5. Si médecin, crée aussi un document Doctor
6. Retourne un message de succès

---

#### <span id="serversrcapicontrollersappointmentcontrollerjs">`server/src/api/controllers/appointmentController.js`</span>

**Emplacement** : `server/src/api/controllers/appointmentController.js`

**Rôle** : Gère toutes les opérations liées aux rendez-vous.

**Fonctions principales** :

1. **`scheduleAppointment`** : Crée un nouveau rendez-vous
   - Crée l'appointment dans la DB
   - Crée une notification pour le médecin
   - Broadcast la notification via WebSocket

2. **`getAppointmentsByUserId`** : Récupère les rendez-vous d'un patient

3. **`getAppointmentsByDoctorId`** : Récupère les rendez-vous d'un médecin

4. **`modifyAppointmentById`** : Modifie un rendez-vous (statut, notes, etc.)
   - Met à jour le statut (approved/rejected)
   - Crée une notification pour le patient
   - Broadcast via WebSocket

5. **`deleteAppointmentById`** : Supprime un rendez-vous

---

#### <span id="serversrcapicontrollersdoctorcontrollerjs">`server/src/api/controllers/doctorController.js`</span>

**Emplacement** : `server/src/api/controllers/doctorController.js`

**Rôle** : Gère les opérations sur les médecins.

**Fonctions principales** :

1. **`getAllDoctors`** : Liste tous les médecins (avec filtres, recherche, pagination)

2. **`getDoctorById`** : Récupère un médecin par ID

3. **`createDoctor`** : Crée un nouveau médecin (admin)

4. **`updateDoctorById`** : Met à jour un médecin

5. **`approveDoctorById`** : Approuve un médecin (admin)
   - Met `isApproved = true`
   - Crée une notification pour le médecin
   - Broadcast via WebSocket

6. **`rejectDoctorById`** : Rejette un médecin (admin)
   - Met `isApproved = false`
   - Crée une notification
   - Broadcast via WebSocket

7. **`deleteDoctorById`** : Supprime un médecin

---

#### <span id="serversrcapicontrollersnotificationcontrollerjs">`server/src/api/controllers/notificationController.js`</span>

**Emplacement** : `server/src/api/controllers/notificationController.js`

**Rôle** : Gère les notifications.

**Fonctions** :
- `getNotificationsByUserId` : Récupère les notifications d'un utilisateur
- `markNotificationAsRead` : Marque une notification comme lue
- `markAllNotificationsAsRead` : Marque toutes comme lues

---

#### Autres Contrôleurs

- **`adminController.js`** : Statistiques et opérations admin
- **`medicineController.js`** : CRUD médicaments
- **`labController.js`** : CRUD laboratoires
- **`blogController.js`** : CRUD articles de blog
- **`ratingController.js`** : Gestion des avis
- **`seoController.js`** : Gestion du SEO
- **`userController.js`** : Gestion des utilisateurs
- **`refreshTokenController.js`** : Rafraîchissement du token
- **`logoutController.js`** : Déconnexion

---

## <span id="flux-de-données">Flux de Données</span>

### Flux d'Authentification

```
1. User saisit email/password dans Login.jsx
   ↓
2. Appel API POST /login
   ↓
3. authController.handleAuth vérifie credentials
   ↓
4. Génère accessToken et refreshToken
   ↓
5. Retourne accessToken au client
   ↓
6. Client sauvegarde accessToken dans localStorage
   ↓
7. Client redirige vers /dashboard
```

### Flux de Création de Rendez-vous

```
1. Patient réserve un rendez-vous (BookingModal.jsx)
   ↓
2. Appel API POST /appointments
   ↓
3. appointmentController.scheduleAppointment crée l'appointment
   ↓
4. Crée une notification pour le médecin
   ↓
5. Broadcast notification via WebSocket (io.to(`user_${doctorId}`).emit())
   ↓
6. Médecin reçoit la notification en temps réel
   ↓
7. NotificationBell affiche le badge de notification
```

### Flux de Chat en Temps Réel

```
1. Patient envoie un message (Interface.jsx)
   ↓
2. Émet événement Socket.IO "send-message"
   ↓
3. Serveur reçoit l'événement (server.js)
   ↓
4. Broadcast à tous les clients dans la room appointmentId
   ↓
5. Médecin reçoit le message en temps réel
   ↓
6. Interface.jsx met à jour l'affichage
```

---

## <span id="technologies-utilisées">Technologies Utilisées</span>

### Frontend
- **React 18** : Bibliothèque UI
- **React Router 6** : Routage
- **Vite** : Build tool et dev server
- **Tailwind CSS** : Framework CSS
- **Axios** : Client HTTP
- **Socket.IO Client** : WebSocket
- **JWT Decode** : Décodage tokens
- **Recharts** : Graphiques

### Backend
- **Node.js** : Runtime JavaScript
- **Express** : Framework web
- **MongoDB** : Base de données
- **Mongoose** : ODM MongoDB
- **JWT** : Authentification
- **Bcrypt** : Hachage mots de passe
- **Multer** : Upload fichiers
- **Socket.IO** : WebSocket serveur
- **CORS** : Gestion CORS

---

## Conclusion

Cette documentation couvre l'ensemble de l'architecture et des fichiers de l'application InstaDoc. Pour toute question ou clarification, référez-vous aux fichiers source correspondants.

**Note** : Cette documentation est un guide de référence. Le code source reste la source de vérité absolue.

---

**Dernière mise à jour** : 2024

