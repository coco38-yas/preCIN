import React, { useState, useEffect } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Alert,
} from '@mui/material';
import { Edit, Delete, Search } from '@mui/icons-material';
import StyledDataGrid from './StyledDataGrid';

const ListCins = ({ selectedCommune }) => {
  const [allCards, setAllCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [message, setMessage] = useState('');

  const fetchCards = async () => {
    try {
      const res = await Axios.get('http://localhost:3000/api/creatcinforcom');
      const fetchedData = res.data.data || res.data;
      setAllCards(fetchedData);
    } catch (error) {
      setMessage("Erreur lors du chargement des cartes.");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  useEffect(() => {
    const results = allCards.filter(
      (card) =>
        (card.nom && card.nom.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (card.prenom && card.prenom.toLowerCase().includes(searchTerm.toLowerCase())) ||
        // (card.num_serie_delivre && card.num_serie_delivre.includes(searchTerm))||
        (card.commune_name && card.commune_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    setFilteredCards(results);
  }, [searchTerm, allCards]);

  const deleteCard = async (id) => {
    try {
      await Axios.delete(`http://localhost:3000/api/creatcinforcom/${id}`);
      fetchCards();
    } catch (error) {
      setMessage("Erreur lors de la suppression de la carte.");
      console.error(error);
    }
  };

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
            style={{ width: '60px', borderRadius: '5px' }}
          />
        ) : 'Aucune'
    },
    { field: 'nom', headerName: 'Nom', width: 150 },
    { field: 'prenom', headerName: 'Prénoms', width: 150 },
    { field: 'region_id', headerName: 'Région', width: 50 },
    { field: 'commune_name', headerName: 'Commune', width: 150 },
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
        </>
      )
    },
  ];

  return (
    <Box sx={{ borderRadius: "8px", width: '100%', padding: '10px', background: 'rgba(0, 255, 242, 0.945)' }} >
      {message && <Alert severity="error">{message}</Alert>}

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <TextField
          label="Rechercher par nom"
          value={searchTerm}
          id='textfield'
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
        />
        <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)} sx={{ ml: 1 }}>
          <Search />
        </Button>
      </Box>

      <StyledDataGrid
        rows={filteredCards}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10, 20, 30]}
        checkboxSelection
        slots={{ toolbar: GridToolbar }}
      />

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
          Résultats de la recherche
        </DialogTitle>
        <DialogContent dividers>
          {filteredCards.length ? (
            filteredCards.map((card, index) => (
              <Box
                key={index}
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
                  src={`http://localhost:3000/Uploads/${card.image_carte}`}
                  alt={card.nom}
                  sx={{
                    width: { xs: '100%', sm: 600 },
                    height: { xs: 'auto', sm: 250 },
                    borderRadius: '12px',
                    mr: 4,
                    objectFit: 'cover',
                  }}
                />
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 'bold',
                      color: '#333',
                      mb: 1,
                    }}
                  >
                    {card.nom} {card.prenom}
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#555', mb: 1 }}>
                    Numéro de série original :{' '}
                    <span style={{ fontWeight: 'bold', color: '#e52e71' }}>
                      {card.num_serie_origine}
                    </span>
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#555', mb: 1 }}>
                    Numéro de CIN :{' '}
                    <span style={{ fontWeight: 'bold', color: '#e52e71' }}>
                      {card.num_serie_delivre}
                    </span>
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#555' }}>
                    Commune :{' '}
                    <span style={{ fontWeight: 'bold', color: '#ff8a00' }}>
                      {card.commune_name}
                    </span>
                  </Typography>
                </Box>
              </Box>
            ))
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

export default ListCins;
