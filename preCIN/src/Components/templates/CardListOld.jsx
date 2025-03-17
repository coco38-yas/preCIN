// src/components/CardList.jsx
import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, TextField, Button, Alert } from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CardList = () => {
  const [cards, setCards] = useState([]);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');

  const fetchCards = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/cards', { params: { search } });
      console.log(res.data.data);
      setCards(res.data.data);
    } catch (error) {
      setMessage("Erreur lors du chargement des cartes.");
    }
  };

  useEffect(() => {
    fetchCards();
  }, [search]);

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'image_path',
      headerName: 'Image',
      width: 80,
      renderCell: (params) =>
        params.value ? (
          <img src={`http://localhost:3000/${params.value}`} alt="Carte" style={{ width: '60px', borderRadius: '5px' }} />
        ) : 'Aucune'
    },
    { field: 'region', headerName: 'Région', width: 150 },
    { field: 'chef_responsable', headerName: 'Chef', width: 150 },
    { field: 'utilisateur', headerName: 'Utilisateur', width: 150 },
    { field: 'numero_serie_original', headerName: 'N° Série Original', width: 150 },
    { field: 'numero_serie_delivree', headerName: 'N° Série Délivrée', width: 150 },
    { field: 'date_ajout', headerName: "Date d'ajout", width: 120 },
    { field: 'type_carte', headerName: 'Type', width: 120 },
    { field: 'nom_commune', headerName: 'Commune', width: 150 },
    { field: 'nom', headerName: 'Nom', width: 150 },
    { field: 'prenom', headerName: 'Prénom', width: 150 },
    { field: 'sexe', headerName: 'Sexe', width: 90 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <>
          <Button variant="contained" size="small" component={Link} to={`/edit/${params.row.id}`} sx={{ mr: 1 }}>
            Mod.
          </Button>
          <Button variant="contained" color="error" size="small" onClick={() => deleteCard(params.row.id)}>
            Supp.
          </Button>
        </>
      )
    }
  ];

  const deleteCard = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/cards/${id}`);
      fetchCards();
    } catch (error) {
      setMessage("Erreur lors de la suppression.");
    }
  };

  return (
    <Box>
      {message && <Alert severity="error">{message}</Alert>}
      <TextField 
        label="Rechercher" 
        variant="outlined" 
        fullWidth 
        margin="normal"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div style={{ height: 500, width: '100%' }}>
        <DataGrid 
          rows={cards} 
          columns={columns} 
          pageSize={10}
          rowsPerPageOptions={[10]}
          checkboxSelection
        />
      </div>
    </Box>
  );
};

export default CardList;
