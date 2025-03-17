import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
} from '@mui/material';
import { Card, CardContent } from '@mui/material';

import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import MailIcon from '@mui/icons-material/Mail';
import logo from './Assets/PRECIN.png';

import { DataGrid } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import Axios from 'axios';
import './bodystyle.css';
import { Link } from 'react-router-dom';
import LatestImages from '../TableauDeBord/LatestImages';

const BodyAccueil = () => {
  // États pour les formulaires de création de Session, Région, District (Partie haute)
  const [session, setSession] = useState('');
  const [region, setRegion] = useState('');
  const [district, setDistrict] = useState('');

  // États pour le formulaire de création de Commune (Partie basse)
  const [commune, setCommune] = useState({ name: '', region_id: '', district_id: '' });
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  // États pour les listes récupérées depuis le backend
  const [communesData, setCommunesData] = useState([]);
  const [regions, setRegions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const { id } = useParams();
  const [message, setMessage] = useState('');

  // Snackbar pour notifications
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // État pour activer/désactiver le bloc de formulaires
  const [formEnabled, setFormEnabled] = useState(false);



  // Fonctions de création (Session, Région, District)
  const createSession = () => {
    Axios.post('http://localhost:3000/session', { Session: session })
      .then(() => {
        setSnackbar({ open: true, message: 'Session créée avec succès', severity: 'success' });
      })
      .catch((err) => {
        console.error(err);
        setSnackbar({ open: true, message: 'Erreur lors de la création de la session', severity: 'error' });
      });
  };

  const createRegion = () => {
    Axios.post('http://localhost:3000/region', { Regions: region })
      .then(() => {
        setSnackbar({ open: true, message: 'Région créée avec succès', severity: 'success' });
        fetchRegions();
      })
      .catch((err) => {
        console.error(err);
        setSnackbar({ open: true, message: 'Erreur lors de la création de la région', severity: 'error' });
      });
  };

  const createDistrict = () => {
    Axios.post('http://localhost:3000/district', { Districts: district })
      .then(() => {
        setSnackbar({ open: true, message: 'District créé avec succès', severity: 'success' });
        fetchDistricts();
      })
      .catch((err) => {
        console.error('Erreur:', err.response?.data || err.message);
        setSnackbar({ open: true, message: 'Erreur lors de la création du district', severity: 'error' });
      });
  };

  // Fonction pour créer une Commune
  const createCom = () => {
    Axios.post('http://localhost:3000/api/communes', {
      Communes: commune,
      region_id: selectedRegion,
      district_id: selectedDistrict,
    })
      .then(() => {
        setSnackbar({ open: true, message: 'Commune ajoutée avec succès', severity: 'success' });
        fetchCommunes(); // Rafraîchir la liste après ajout
      })
      .catch((err) => {
        console.error(err);
        setSnackbar({ open: true, message: "Erreur lors de l'ajout de la commune", severity: 'error' });
      });
  };

  // Fonctions pour récupérer les données depuis le backend
  const fetchCommunes = () => {
    Axios.get('http://localhost:3000/api/communes')
      .then((res) => setCommunesData(res.data))
      .catch((err) => console.error(err));
  };

  const fetchRegions = () => {
    Axios.get('http://localhost:3000/region')
      .then((res) => setRegions(res.data))
      .catch((err) => console.error(err));
  };

  const fetchDistricts = () => {
    Axios.get('http://localhost:3000/district')
      .then((res) => setDistricts(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchCommunes();
    fetchRegions();
    fetchDistricts();
  }, []);

  // Chargement des données en mode édition et mapping des clés
  useEffect(() => {
    if (id) {
      Axios.get(`http://localhost:3000/api/communes/${id}`)
        .then((res) => {
          const data = res.data; // Vérifiez la structure exacte de la réponse
          setCommune({
            name: data.name || "",  // Correction du champ de la commune
            region_id: data.region_id ? data.region_id.toString() : "",
            district_id: data.district_id ? data.district_id.toString() : "",
          });
        })
        .catch((err) => {
          setMessage("Erreur lors du chargement des données.");
          console.error(err);
        });
    }
  }, [id]);

  // Fonction pour supprimer une commune
  const deleteCommune = (id) => {
    Axios.delete(`http://localhost:3000/api/communes/${id}`)
      .then(() => {
        setSnackbar({ open: true, message: 'Commune supprimée avec succès', severity: 'success' });
        fetchCommunes();
      })
      .catch((err) => {
        console.error(err);
        setSnackbar({ open: true, message: 'Erreur lors de la suppression de la commune', severity: 'error' });
      });
  };

  // Colonnes du DataGrid
  const columns = [
    { field: 'id', headerName: 'Id', width: 50 },
    { field: 'region_id', headerName: 'Région', width: 150 },
    { field: 'district_id', headerName: 'District', width: 150 },
    { field: 'name', headerName: 'Commune', width: 200 },
    {
      field: 'action',
      headerName: 'Action',
      width: 200,
      renderCell: (params) => (
        <>
          <IconButton
            color="primary"
            component={Link}
            to={`/editcommune/${params.row.id}`}
            sx={{ mr: 1 }}
          >
            <Edit />
          </IconButton>
          <IconButton color="error" onClick={() => deleteCommune(params.row.id)}>
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];

  const districtList = [
    { id: 1, name: 'Fénérive-Est' },
    { id: 2, name: 'Vavatenina' },
    { id: 3, name: 'Soanierana-Ivongo' },
    { id: 4, name: 'Maroantsetra' },
    { id: 5, name: 'Mananara-Nord' },
  
  ];

  const regionList = [
    {id: 1, name: 'Analanjirofo'}
  ]



  return (
    <Container sx={{ py: 4, background: 'rgba(0, 255, 242, 0.945)', borderRadius: '8px', marginBottom: '18px', boxShadow: '0px 0px 20px rgba(255, 2, 33, 0.548)' }}>
      {message && <Alert severity="info">{message}</Alert>}
      <Grid container spacing={4} padding={4} >
        <Card sx={{ boxShadow: 3, color: '#000', margin: '4px' }} style={{ background: 'rgba(233, 255, 242, 0.945)' }}>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              Application de gestion de la carte d'identité nationale
              <img src={logo} alt="preCIN" style={{ width: '400px' }} />
              (préprocessus CIN)
              <h6>
                Développé par: Zohery Raharimahazo.
                <br />
                Contact :
                {/* Lien WhatsApp */}
                <a href="https://wa.me/261383401192" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#25D366' }}>
                  <WhatsAppIcon style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                  +261 38 34 011 92
                </a>
                {/* Lien Email avec icône */}
                <br />
                email:<a href="mailto:cocodesignservice81@gmail.com" style={{ textDecoration: 'none', color: '#007BFF' }}>
                  <MailIcon style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                  cocodesignservice81@gmail.com
                </a>
              </h6>
            </Typography>
            <Typography variant="body1" style={{ color: '#000' }} paragraph>
              Notre projet consiste en la création d'une application de gestion de la Carte d'Identité Nationale preCIN (préprocessus CIN) qui repose sur une base de données dynamique,
              permettant de suivre et de gérer l'ensemble des informations relatives à chaque citoyen dans une région. Ce projet vise à simplifier le processus d'enregistrement,
              de mise à jour et de gestion des cartes d'identité dans un environnement numérique sécurisé et efficace. L'application est conçue pour être utilisée par des administrations
              publiques à tous les niveaux, de la région au district, avec une subdivision complète jusqu'aux communes.
            </Typography>
          </CardContent>
        </Card>


        {/* Colonne gauche : Formulaires de création */}

        <Grid item xs={12} md={4}>


          {/* Bouton de bascule pour activer/désactiver le bloc */}
          <Box sx={{ mb: 2, textAlign: 'center' }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setFormEnabled(!formEnabled)}
            >
              {formEnabled ? 'Désactiver' : 'Activer'}
            </Button>
          </Box>
          <Grid container spacing={1} sx={{ height: '70%', opacity: formEnabled ? 1 : 0.5, pointerEvents: formEnabled ? 'auto' : 'none' }}>
            {/* Ligne haute : Session, Région, District */}
            <Grid item xs={12}>
              <Paper elevation={5} sx={{ p: 2, borderRadius: 2, display: 'flex', gap: 2, justifyContent: 'space-between' }}>
                <Box flex={1}>
                  <Typography variant="subtitle1" gutterBottom>Session</Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Session d'année"
                    id="textfield"
                    value={session}
                    onChange={(e) => setSession(e.target.value)}
                    size="small"
                    disabled={!formEnabled}
                  />
                  <Button variant="contained" color="primary" fullWidth sx={{ mt: 1 }} onClick={createSession} disabled={!formEnabled}>
                    Créer
                  </Button>
                </Box>
                <Box flex={1}>
                  <Typography variant="subtitle1" gutterBottom>Région</Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    id="textfield"
                    label="Région"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    size="small"
                    disabled={!formEnabled}
                  />
                  <Button variant="contained" color="primary" fullWidth sx={{ mt: 1 }} onClick={createRegion} disabled={!formEnabled}>
                    Créer
                  </Button>
                </Box>
                <Box flex={1}>
                  <Typography variant="subtitle1" gutterBottom>District</Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="District"
                    id="textfield"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    size="small"
                    disabled={!formEnabled}
                  />
                  <Button variant="contained" color="primary" fullWidth sx={{ mt: 1 }} onClick={createDistrict} disabled={!formEnabled}>
                    Créer
                  </Button>
                </Box>
              </Paper>
            </Grid>
            {/* Ligne basse : Formulaire pour ajouter une Commune */}
            <Grid item xs={12}>
              <Paper elevation={5} sx={{ p: 1, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>Ajouter une Commune</Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Nom de la Commune"
                  id="textfield"
                  value={commune.name}
                  onChange={(e) => setCommune({ ...commune, name: e.target.value })}
                  margin="normal"
                  disabled={!formEnabled}
                />
                <FormControl fullWidth margin="normal" size="small" disabled={!formEnabled}>
                  <InputLabel>Région</InputLabel>
                  <Select
                    value={regionList.length > 0 ? commune.region_id || "" : ""}
                    label="Région"
                    id="textfield"
                    onChange={(e) => setCommune({ ...commune, region_id: Number(e.target.value) })}
                  >
                    {regionList.map((reg) => (
                      <MenuItem key={reg.id} value={reg.id}>{reg.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="normal" size="small" disabled={!formEnabled}>

                  <InputLabel>District</InputLabel>
                  <Select
                    value={districtList.length > 0 ? commune.district_id || "" : ""}
                    onChange={(e) => setCommune({ ...commune, district_id: Number(e.target.value) })}
                    label="District"
                    id="textfield"
                  >
                    {districtList.map((district) => (
                      <MenuItem key={district.id} value={district.id}>{district.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button variant="contained" color="primary" fullWidth sx={{ mt: 1 }} onClick={createCom} disabled={!formEnabled}>
                  Ajouter
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
        {/* Colonne droite : Liste des communes dans DataGrid */}
        <Grid item xs={12} md={8}>
          <Paper
            elevation={5}
            sx={{
              p: 3,
              borderRadius: 2,
              backdropFilter: 'blur(10px)',
              background: 'rgba(255,255,255,0.2)',
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              align="center"
              sx={{
                py: 1,
                background: 'linear-gradient(to right, #4CAF50, #81C784)',
                color: 'white',
                borderRadius: '4px 4px 0 0',
              }}
            >
              Liste des Communes
            </Typography>
            <Box sx={{ height: 400 }}>
              <DataGrid
                rows={communesData}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5, 10, 20]}
                checkboxSelection
                disableSelectionOnClick
                sx={{
                  background: 'rgba(255,255,255,0.8)',
                  borderRadius: '8px',
                  '& .MuiDataGrid-columnHeaders': {
                    background: 'linear-gradient(to left, rgb(3,112,3), rgb(3,11,107)) !important',
                    color: 'black',
                  },
                  '& .MuiDataGrid-footerContainer': {
                    background: 'linear-gradient(to left, rgb(3,112,3), rgb(3,11,107)) !important',
                    color: 'white',
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
      {/* Snackbar pour notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      <LatestImages />
    </Container>
  );
};

export default BodyAccueil;
