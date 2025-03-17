// frontend/src/components/PersistentDrawerLeft.jsx (renommé Trace.jsx)
import '../templates/header_style.css';
import '../../App.css';
import '../Accueil/Accueil.css';
import Axios from 'axios';
import { Box, Tabs, Tab, Drawer, Toolbar, List, ListItem, ListItemButton, ListItemText, IconButton, Typography, Divider, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CreatCinForCom from '../templates/CreatCinForCom';
import ListCin from '../templates/ListCin';
import React, { useState, useEffect } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import logo from '../templates/Assets/PRECIN.png'

import { useNavigate } from 'react-router-dom';




const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: `${drawerWidth}px`,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  })
);

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));


const Trace = () => {
  const theme = useTheme();
  // États locaux
  const [open, setOpen] = useState(false);
  const [selectedCommune, setSelectedCommune] = useState('');
  const [tabIndex, setTabIndex] = useState(0);
  const [communesData, setCommunesData] = useState([]);

  const navigate = useNavigate()

  // Récupération des communes depuis l'API
  useEffect(() => {
    Axios.get('http://localhost:3000/api/communes')
      .then(res => {
        const communesList = res.data.data || res.data;
        setCommunesData(communesList);
        // Par défaut, on sélectionne la première commune (en utilisant son nom)
        if (communesList && communesList.length > 0) {
          setSelectedCommune(communesList[0].name);
        }
      })
      .catch(err => console.error("Erreur lors de la récupération des communes :", err));
  }, []);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);
  const handleTabChange = (event, newValue) => setTabIndex(newValue);
  const handleCommuneSelect = (communeName) => setSelectedCommune(communeName);

  return (
    <Box sx={{ display: 'flex', marginTop: '-120px', marginLeft: '-70px' }}>
      <CssBaseline />
      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          height: '100vh',         // Fixer la hauteur à 100% de la viewport
          overflowY: 'auto',       // Activer le défilement vertical

          '& .MuiDrawer-paper': {
            width: drawerWidth,
            height: '100vh',
            boxSizing: 'border-box',
            background: 'rgb(216, 255, 243)',
            overflowY: 'auto', // Ajout de cette ligne pour permettre le défilement vertical
            // Masquer la scrollbar par défaut pour WebKit (Chrome, Safari)
            '&::-webkit-scrollbar': {
              width: '0px',
              background: 'transparent',
            },
            // Au survol, afficher la scrollbar
            '&:hover::-webkit-scrollbar': {
              width: '8px',
            },
            '&:hover::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              borderRadius: '4px',
            },
          },

        }}
      >
        <DrawerHeader>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <img src={logo} alt="preCIN" style={{ width: '120px' }} />
          </Box>

          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}

          </IconButton>

        </DrawerHeader>
        <Divider />
        <List sx={{ background: 'rgb(216, 255, 243)' }}>
          {communesData.map((commune, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton
                selected={selectedCommune === commune.name}
                onClick={() => handleCommuneSelect(commune.name)}
              >
                <ListItemText primary={commune.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      {!open && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 1201,
            background: 'rgb(216, 255, 243)',
            boxShadow: '0 7px 20px rgba(0,0,0,0.5)',
          }}
        >
          <IconButton onClick={handleDrawerOpen} color="primary">
            <MenuIcon />
          </IconButton>
          <List sx={{
            background: 'rgb(216, 255, 243)', height: '100vh', overflowY: 'auto', '&::-webkit-scrollbar': {
              width: '0px',
              background: 'transparent',
            },
            // Au survol, afficher la scrollbar
            '&:hover::-webkit-scrollbar': {
              width: '8px',
            },
            '&:hover::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              borderRadius: '4px',
            },
          }}>
            {communesData.map((commune, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton
                  selected={selectedCommune === commune.name}
                  onClick={() => handleCommuneSelect(commune.name)}
                >
                  <ListItemText primary={commune.abbreviation || commune.id} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
      <Main open={open} >
        <DrawerHeader />

        <Box sx={{ flexGrow: 1, p: 2, boxShadow: '0 7px 20px rgba(0,0,0,0.5)', width: '1290px', background: 'rgb(216, 255, 243, 0.8)', borderRadius: '10px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" gutterBottom>
              Gestion des Cartes pour {selectedCommune}
            </Typography>
            <Button variant="contained" color="primary" onClick={() => navigate('/listcins')}>
              Recherche dans la base de données
            </Button>
          </Box>
          <Tabs sx={{marginTop:'-20px'}} value={tabIndex} onChange={handleTabChange}>
            <Tab label="Liste des cartes" />
            <Tab label="Ajouter une carte" />
          </Tabs>
          {tabIndex === 0 && <ListCin selectedCommune={selectedCommune} />}
          {tabIndex === 1 && <CreatCinForCom />}
        </Box>
      </Main>
    </Box>
  );
};

export default Trace;
