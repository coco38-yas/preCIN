// frontend/src/components/Trace.jsx
import '../templates/header_style.css';
import '../../App.css';
import '../Accueil/Accueil.css';
import Axios from 'axios';
import {
  Box,
  Tabs,
  Tab,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Typography,
  Divider,
  Button,
  Badge
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import { Delete as DeleteIcon, Search } from '@mui/icons-material';
import HistoriqueTab from './HistoriqueTabss';
import CreatCinForCom from '../templates/CreatCinForCom';
import ListCin from '../templates/ListCin';
import React, { useState, useEffect } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import logo from '../templates/Assets/PRECIN.png';
import { useNavigate, useLocation } from 'react-router-dom';

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

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const Trace = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [selectedCommune, setSelectedCommune] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [communesData, setCommunesData] = useState([]);
  const [deletedCount, setDeletedCount] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();

  // Récupération des communes
  useEffect(() => {
    Axios.get('http://localhost:3000/api/communes')
      .then(res => {
        const communesList = res.data.data || res.data;
        setCommunesData(communesList);

        let communeToSelect = null;
        if (location.state && location.state.selectedCommune) {
          communeToSelect = communesList.find(
            comm => comm.id.toString() === location.state.selectedCommune.id.toString()
          );
        }
        if (!communeToSelect) {
          const savedCommune = sessionStorage.getItem("selectedCommune");
          if (savedCommune) {
            const parsedCommune = JSON.parse(savedCommune);
            communeToSelect = communesList.find(
              comm => comm.id.toString() === parsedCommune.id.toString()
            );
          }
        }
        if (!communeToSelect && communesList.length > 0) {
          communeToSelect = communesList[0];
        }
        if (communeToSelect) {
          setSelectedCommune(communeToSelect);
          sessionStorage.setItem("selectedCommune", JSON.stringify(communeToSelect));
        }
      })
      .catch(err => console.error("Erreur lors de la récupération des communes :", err));
  }, [location.state]);

  useEffect(() => {
    if (location.state && location.state.tabIndex !== undefined) {
      setTabIndex(location.state.tabIndex);
    }
  }, [location.state]);

  // Fonction pour rafraîchir le compteur via l'API
  const refreshDeletedCount = () => {
    if (selectedCommune) {
      Axios.get('http://localhost:3000/api/creatcinforcom')
        .then(res => {
          const cards = res.data.data || res.data;
          const filtered = cards.filter(card =>
            card.isDeleted &&
            (card.commune_id === selectedCommune.id ||
              (card.commune_name && card.commune_name === selectedCommune.name))
          );
          setDeletedCount(filtered.length);
        })
        .catch(err => console.error("Erreur lors de la récupération des cartes supprimées :", err));
    }
  };

  // Mise à jour optimiste : incrémente ou décrémente directement le compteur
  const updateDeletedCountOptimistic = (actionType) => {
    if (actionType === 'softDelete') {
      setDeletedCount(prev => prev + 1);
    } else if (actionType === 'restore') {
      setDeletedCount(prev => (prev > 0 ? prev - 1 : 0));
    }
  };

  // Appel initial quand la commune est sélectionnée
  useEffect(() => {
    refreshDeletedCount();
  }, [selectedCommune]);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);
  const handleTabChange = (event, newValue) => setTabIndex(newValue);
  const handleCommuneSelect = (commune) => {
    setSelectedCommune(commune);
    sessionStorage.setItem("selectedCommune", JSON.stringify(commune));
  };

  return (
    <Box sx={{ display: 'flex', marginTop: '-120px', marginLeft: '-150px' }}>
      <CssBaseline />
      {/* Définition de l'animation pulse */}
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
          }
        `}
      </style>
      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          height: '100vh',
          overflowY: 'auto',
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            height: '100vh',
            boxSizing: 'border-box',
            background: 'rgb(216, 255, 243)',
            overflowY: 'auto',
            '&::-webkit-scrollbar': { width: '0px', background: 'transparent' },
            '&:hover::-webkit-scrollbar': { width: '8px' },
            '&:hover::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              borderRadius: '4px'
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
                selected={selectedCommune && selectedCommune.id === commune.id}
                onClick={() => handleCommuneSelect(commune)}
              >
                <LocationCityIcon style={{ verticalAlign: 'middle', marginRight: 8 }} />
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
            background: 'rgb(216, 255, 243)',
            height: '100vh',
            overflowY: 'auto',
            '&::-webkit-scrollbar': { width: '0px', background: 'transparent' },
            '&:hover::-webkit-scrollbar': { width: '8px' },
            '&:hover::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              borderRadius: '4px'
            },
          }}>
            {communesData.map((commune, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton
                  selected={selectedCommune && selectedCommune.id === commune.id}
                  onClick={() => handleCommuneSelect(commune)}
                >
                  <ListItemText primary={commune.abbreviation || commune.id} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
      <Main open={open}>
        <DrawerHeader />
        <Box sx={{ flexGrow: 1, p: 2, boxShadow: '0 7px 20px rgba(0,0,0,0.5)', width: '1450px', background: 'rgba(216, 255, 243, 0.8)', borderRadius: '10px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" gutterBottom>
              <LocationCityIcon style={{ verticalAlign: 'middle', marginRight: 8 }} />
              Gestion des Cartes pour {selectedCommune ? selectedCommune.name : ""}
            </Typography>
            <Button variant="contained" color="primary" onClick={() => navigate('/listcins')} startIcon={<Search />}>
              Recherche dans la base de données
            </Button>
          </Box>
          <Tabs sx={{ marginTop: '-20px' }} value={tabIndex} onChange={handleTabChange}>
            <Tab label="Liste des cartes" />
            <Tab label="Ajouter une carte" />
            <Tab
              label={
                <span>
                  Contrôle
                  {deletedCount > 0 && (
                    <Badge
                      badgeContent={deletedCount}
                      color="error"
                      sx={{
                        marginLeft: '8px',
                        animation: 'pulse 1s 5'
                      }}
                    >
                      <DeleteIcon />
                    </Badge>
                  )}
                </span>
              }
            />
            <Tab label="Historique" />
          </Tabs>
          {tabIndex === 0 && selectedCommune && (
            <ListCin selectedCommune={selectedCommune} controlMode={false} />
          )}
          {tabIndex === 1 && selectedCommune && (
            <CreatCinForCom selectedCommune={selectedCommune} />
          )}
          {tabIndex === 2 && selectedCommune && (
            <ListCin
              selectedCommune={selectedCommune}
              controlMode={true}
              refreshDeletedCount={refreshDeletedCount}
              updateDeletedCountOptimistic={updateDeletedCountOptimistic}
            />
          )}
          {tabIndex === 3 && selectedCommune && (
            <HistoriqueTab selectedCommune={selectedCommune} />
          )}
        </Box>
      </Main>
    </Box>
  );
};

export default Trace;
