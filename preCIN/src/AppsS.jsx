// src/components/MainLayout.jsx
import React from 'react';
import { AppBar, Toolbar, Button, Box, Typography, Container } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import TimelineIcon from '@mui/icons-material/Timeline';
import PeopleIcon from '@mui/icons-material/People';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InfoIcon from '@mui/icons-material/Info';
import logo from './Components/templates/Assets/PRECIN.png';

const MainLayout = ({ children, currentUser, setCurrentUser }) => {
  const location = useLocation();
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
      <AppBar 
        position="fixed"
        sx={{ background: 'linear-gradient(to left, rgb(3,112,3), rgb(3,11,107))' }}
      >
        <Toolbar>
          {/* Logo à gauche */}
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <img src={logo} alt="preCIN" style={{ width: '120px' }} />
          </Box>
          {/* Boutons de navigation centrés */}
          <Box 
            sx={{ 
              display: 'flex', 
              gap: 2, 
              flexGrow: 1, 
              justifyContent: 'center' 
            }}
          >
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
              Chefs & Admins
            </Button>
            <Button component={Link} to="/tableaudebord" sx={isActive('/tableaudebord')} startIcon={<DashboardIcon />}>
              Tableau de Bord
            </Button>
            <Button component={Link} to="/apropos" sx={isActive('/apropos')} startIcon={<InfoIcon />}>
              À propos
            </Button>
          </Box>
          {/* Affichage de l'utilisateur connecté et bouton Logout */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {currentUser && (
              <>
                <Typography variant="body1" sx={{ mr: 1 }}>
                  {currentUser.username}
                </Typography>
                <Button onClick={handleLogout} sx={{ color: '#fff' }} startIcon={<LogoutIcon />}>
                  Logout
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 10 }}>
        {children}
      </Container>
    </>
  );
};

export default MainLayout;
