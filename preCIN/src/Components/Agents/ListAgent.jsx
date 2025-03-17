import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, CircularProgress, Snackbar, Alert } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Axios from 'axios';

const ListAgent = () => {
  // État pour stocker les agents
  const [agentChefs, setAgentchefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Récupération des agents au chargement du composant
  useEffect(() => {
    Axios.get('http://localhost:3000/agentregistre')
      .then((res) => {
        setAgentchefs(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erreur lors du chargement des agents:', err);
        setError("Impossible de charger la liste des agents.");
        setLoading(false);
      });
  }, []);

  // Définition des colonnes du DataGrid
  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'noms', headerName: 'Nom de l\'Agent', width: 250 },
    { field: 'communes_id', headerName: 'Commune Associée', width: 200 },
  ];

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h5" align="center" gutterBottom>
          Liste des Agents et Chefs
        </Typography>

        {loading ? (
          <CircularProgress style={{ display: 'block', margin: '20px auto' }} />
        ) : (
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={agentChefs}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              checkboxSelection
              disableSelectionOnClick
            />
          </div>
        )}
      </Paper>

      {/* Snackbar pour afficher les erreurs */}
      <Snackbar open={!!error} autoHideDuration={4000} onClose={() => setError('')}>
        <Alert onClose={() => setError('')} severity="error" variant="filled">
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ListAgent;
