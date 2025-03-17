import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Box,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Snackbar,
} from '@mui/material';
import { Edit, Delete, Visibility as VisibilityIcon } from '@mui/icons-material';
import StyledDataGrid from './StyledDataGrid';

const ListCin = ({ selectedCommune }) => {
  const [allCards, setAllCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [message, setMessage] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Fonction pour récupérer les cartes depuis le backend
  const fetchCards = async () => {
    try {
      const res = await Axios.get('http://localhost:3000/api/creatcinforcom');
      const fetchedData = res.data.data || res.data;
      setAllCards(fetchedData);
      console.log("Cartes récupérées :", fetchedData);
    } catch (error) {
      console.error('Erreur lors du chargement des cartes', error);
      setMessage("Erreur lors du chargement des cartes.");
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  // Filtrer les cartes selon la commune sélectionnée
  useEffect(() => {
    if (!selectedCommune) {
      setFilteredCards(allCards);
    } else {
      const filtered = allCards.filter(
        (card) =>
          card.nom_commune === selectedCommune ||
          (card.commune_name && card.commune_name === selectedCommune)
      );
      setFilteredCards(filtered);
    }
  }, [selectedCommune, allCards]);

  // Fonction pour supprimer une carte
  const deleteCard = async (id) => {
    try {
      await Axios.delete(`http://localhost:3000/api/creatcinforcom/${id}`);
      setSnackbar({ open: true, message: 'Carte supprimée avec succès', severity: 'success' });
      fetchCards();
    } catch (error) {
      setMessage("Erreur lors de la suppression de la carte.");
      console.error(error);
    }
  };

  // Définition des colonnes du DataGrid
  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'image_carte',
      headerName: 'Image',
      width: 80,
      renderCell: (params) =>
        params.value ? (
          <img
            src={`http://localhost:3000/Uploads/${params.value}`}
            alt="Carte"
            style={{
              width: '100%',
              transition: 'transform 0.3s ease-in-out',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.5)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          />
        ) : 'Aucune'
    },
    { field: 'nom', headerName: 'Nom', width: 150 },
    { field: 'prenom', headerName: 'Prénoms', width: 150 },
    { field: 'region', headerName: 'Région', width: 50 },
    { field: 'agent_chef_id', headerName: 'Chef', width: 50 },
    { field: 'user_id', headerName: 'User', width: 50 },
    { field: 'num_serie_origine', headerName: 'N° Série Original', width: 150 },
    { field: 'num_serie_delivre', headerName: 'N° Série Délivrée', width: 150 },
    {
      field: 'date_ajout',
      headerName: "Date d'ajout",
      width: 100,
      renderCell: (params) =>
        params.value ? new Date(params.value).toLocaleDateString() : 'Aucune'
    },
    {
      field: 'date_delivre',
      headerName: "Date de del.",
      width: 100,
      renderCell: (params) =>
        params.value ? new Date(params.value).toLocaleDateString() : 'Aucune'
    },
    { field: 'carte_type', headerName: 'Type', width: 120 },
    { field: 'commune_id', headerName: 'CR', width: 50 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton color="primary" component={Link} to={`/edit/${params.row.id}`} sx={{ mr: 1 }}>
            <Edit />
          </IconButton>
          <IconButton color="error" onClick={() => deleteCard(params.row.id)}>
            <Delete />
          </IconButton>
          <IconButton
            color="success"
            onClick={() => {
              setSelectedRow(params.row);
              setOpenDialog(true);
            }}
          >
            <VisibilityIcon />
          </IconButton>
        </>
      )
    },
  ];

  return (
    <Box sx={{ width: '100%', padding: '10px' }}>
      {message && <Alert severity="error">{message}</Alert>}

      <StyledDataGrid
        rows={filteredCards}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        checkboxSelection
        slots={{ toolbar: GridToolbar }}
      />

      {/* Dialog pour afficher les détails de la carte sélectionnée */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle
          sx={{
            textAlign: 'center',
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #ff8a00, #e52e71)',
            color: 'white',
            fontSize: '2rem',
            py: 2,
            borderRadius: '4px'
          }}
        >
          Détail de la carte
        </DialogTitle>
        <DialogContent dividers>
          {selectedRow ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 3,
                backgroundColor: '#fff',
                borderRadius: '16px',
                p: 3,
                boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.15)',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.02)',
                },
              }}
            >
              <Box
                component="img"
                src={`http://localhost:3000/Uploads/${selectedRow.image_carte}`}
                alt={selectedRow.nom}
                sx={{
                  width: { xs: '100%', sm: 640 },
                  height: { xs: 'auto', sm: 220 },
                  borderRadius: '12px',
                  mr: 4,
                  objectFit: 'cover',
                }}
              />
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333', mb: 1 }}>
                  {selectedRow.nom} {selectedRow.prenom}
                </Typography>
                <Typography variant="h6" sx={{ color: '#555', mb: 1 }}>
                  Numéro de série original :{' '}
                  <span style={{ fontWeight: 'bold', color: '#e52e71' }}>
                    {selectedRow.num_serie_origine}
                  </span>
                </Typography>
                <Typography variant="h6" sx={{ color: '#555', mb: 1 }}>
                  Numéro de CIN :{' '}
                  <span style={{ fontWeight: 'bold', color: '#e52e71' }}>
                    {selectedRow.num_serie_delivre}
                  </span>
                </Typography>
                <Typography variant="h6" sx={{ color: '#555' }}>
                  Commune :{' '}
                  <span style={{ fontWeight: 'bold', color: '#ff8a00' }}>
                    {selectedRow.commune_name || selectedRow.commune_id}
                  </span>
                </Typography>
              </Box>
            </Box>
          ) : (
            <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }}>
              Aucun résultat trouvé.
            </Typography>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ListCin;
