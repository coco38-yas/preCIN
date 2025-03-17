import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Button,
  Container,
  Select,
  MenuItem,
  InputLabel,
  Box,
  Typography
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';


// Import des composants
import Accueil from './Components/Accueil/accueil';
import Trace from './Components/MissionTrace/Trace';
import Login from './Components/Login/Login';
import Inscription from './Components/Inscription/Inscription';
import Users from './Components/Utilisateur/Users';
import Agents from './Components/Agents/Agents';
import TableauDeBord from './Components/TableauDeBord/TableauDeBord';
import Apropos from './Components/Apropos';
import CreatCinForCom from './Components/templates/CreatCinForCom';
import ListCins from './Components/templates/ListCins'

import logo from './Components/templates/Assets/PRECIN.png';

// Import des icônes Material‑UI
import HomeIcon from '@mui/icons-material/Home';
import TimelineIcon from '@mui/icons-material/Timeline';
import PeopleIcon from '@mui/icons-material/People';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InfoIcon from '@mui/icons-material/Info';

// Import du contexte utilisateur et du PrivateRoute
import UserContext from './contexts/UserContext';
import PrivateRoute from './PrivateRoute';
import AgentUpdate from './Components/Agents/AgentUpdate';
import AgentRegistre from './Components/Agents/AgentRegistre';
import BodyAccueil from './Components/templates/BodyAccueil';
import ActivationScreen from './Components/ActivationScreen';


// Layout pour les pages protégées
const MainLayout = ({ children }) => {
  const { currentUser, setCurrentUser } = React.useContext(UserContext);
  const navigate = useNavigate();

  // Fonction pour vérifier si un chemin correspond à la route active
  const isActive = (path) => {
    return location.pathname === path
      ? { backgroundColor: '#1976d2', color: '#fff' }
      : {};
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <>
      <AppBar position="fixed" sx={{ background: 'linear-gradient(to left, rgb(3,112,3), rgb(3,11,107))' }}>
        <Toolbar>
          {/* Logo à gauche */}
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2, mb: 2 }}>
            <img src={logo} alt="preCIN" style={{ width: '120px' }} />
          </Box>
          {/* Boutons de navigation centrés */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexGrow: 1, marginBottom: "23px", marginRight: "80px" }}>
            <Button component={Link} to="/accueil" sx={isActive('/accueil')} startIcon={<HomeIcon />}>
              Accueil
            </Button>
            <Button component={Link} to="/trace" sx={isActive('/trace')} startIcon={<TimelineIcon />}>
              Tracabilité CIN
            </Button>
            <Button component={Link} to="/users" sx={isActive('/users')} startIcon={<PeopleIcon />}>
              Utilisateurs
            </Button>
            <Button component={Link} to="/agents" sx={isActive('/agents')} startIcon={<SupervisorAccountIcon />}>
              Chef d'Arrondis.
            </Button>
            <Button component={Link} to="/tableaudebord" sx={isActive('/tableaudebord')} startIcon={<DashboardIcon />}>
              Tableau de Bord
            </Button>
            <Button component={Link} to="/apropos" sx={isActive('/apropos')} startIcon={<InfoIcon />}>
              À propos
            </Button>

          </Box>
          {/* Espace pour l'utilisateur courant et Logout */}
          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: "23px" }}>
            {currentUser && (
              <>
                <Typography variant="body1" sx={{ mr: 1 }}>
                  {currentUser.username}
                </Typography>
                <Button color="inherit" onClick={handleLogout} startIcon={<LogoutIcon />}>
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 10 }}>{children}</Container>
    </>
  );
};

// Composant qui gère le routage
const AppContent = () => {
  return (
    <Routes>
      {/* Routes publiques */}
      <Route path="/login" element={<Login />} />
      <Route path="/inscription" element={<Inscription />} />
      {/* Routes protégées */}
      <Route
        path="/*"
        element={
          <PrivateRoute>
            <MainLayout>
              <Routes>
                <Route path="/accueil" element={<Accueil />} />
                <Route path="/trace" element={<Trace />} />
                <Route path="/users" element={<Users />} />
                <Route path="/agents" element={<Agents />} />
                <Route path="/tableaudebord" element={<TableauDeBord />} />
                <Route path="/apropos" element={<Apropos />} />
                <Route path="/edit/:id" element={<CreatCinForCom />} />
                <Route path="/agentupdate/:id" element={<AgentUpdate />} />
                <Route path="/agentregistre" element={<AgentRegistre />} />
                <Route path="/listcins" element={<ListCins />} />
                <Route path="/editcommune/:id" element={<BodyAccueil />} />
                <Route path="/activate" element={<ActivationForm />} />

              </Routes>
            </MainLayout>
          </PrivateRoute>
        }
      />
      {/* Redirection par défaut vers /login */}
      <Route path="*" element={<Login />} />
    </Routes>
  );
};

const App = () => {
  // Gestion de l'utilisateur connecté depuis le localStorage
  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      <Router>
        <AppContent />
      </Router>
    </UserContext.Provider>
  );
};

export default App;
