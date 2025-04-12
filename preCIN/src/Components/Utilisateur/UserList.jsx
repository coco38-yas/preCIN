import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Delete, People as PeopleIcon } from '@mui/icons-material';
import Axios from 'axios';
import InscriptionUsers from './InscriptionUsers';

const UserList = () => {
  const [data, setData] = useState([]); // Liste des utilisateurs
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Etats pour la confirmation de suppression avec mot de passe admin
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [adminPassword, setAdminPassword] = useState('');
  // Mot de passe administrateur attendu (à sécuriser côté serveur en production)
  const expectedAdminPassword = '__precin__';

  // Fonction pour charger les utilisateurs
  const fetchUsers = () => {
    setLoading(true);
    Axios.get('http://localhost:3000/inscription')
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Erreur lors du chargement des Utilisateurs.");
        setLoading(false);
      });
  };

  // Charger les utilisateurs au montage du composant
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fonction pour supprimer un utilisateur
  const handleDelete = (id) => {
    Axios.delete(`http://localhost:3000/inscription/${id}`)
      .then(() => {
        setSuccessMessage('Utilisateur supprimé avec succès');
        setOpenSnackbar(true);
        fetchUsers(); // Rafraîchir la liste
      })
      .catch((err) => {
        console.error(err);
        setError("Erreur lors de la suppression de l'utilisateur.");
      });
  };

  // Colonnes du DataGrid
  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'username', headerName: "Nom d'Utilisateur", width: 200 },
    { field: 'email', headerName: 'E-mail', width: 200 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <IconButton
          color="error"
          onClick={() => {
            setSelectedUserId(params.row.id);
            setOpenConfirm(true);
          }}
        >
          <Delete />
        </IconButton>
      ),
    },
  ];

  // Validation et confirmation de la suppression avec le mot de passe admin
  const confirmDeletion = () => {
    if (adminPassword === expectedAdminPassword) {
      handleDelete(selectedUserId);
    } else {
      alert("Mot de passe incorrect");
    }
    // Réinitialiser le mot de passe et fermer la boîte de dialogue
    setAdminPassword('');
    setOpenConfirm(false);
  };

  return (
    <Container>
      <Box
        sx={{
          textAlign: 'center',
          fontWeight: 'regular',
          backdropFilter: 'blur(10px)',
          background: 'linear-gradient(45deg,rgba(255, 136, 0, 0.38),rgba(23, 255, 89, 0.2))',
          color: 'white',
          fontSize: '1.5rem',
          py: 2,
          borderRadius: '4px',
          marginBottom: '-20px',
          marginTop: '-38px'
        }}
      >
        <PeopleIcon
          style={{ verticalAlign: 'middle', marginRight: 20, transform: 'scale(2.0)' }}
        />
        GESTION DES UTILISATEURS
      </Box>
      <Box display="flex" gap={4} mt={4}>
        <Box
          flex={1}
          p={3}
          sx={{
            backdropFilter: 'blur(10px)',
            background: 'rgba(23, 255, 89, 0.2)',
            borderRadius: 2
          }}
        >
          <InscriptionUsers />
        </Box>
        <Box
          flex={2}
          p={3}
          sx={{
            backdropFilter: 'blur(10px)',
            background: 'rgba(23, 255, 89, 0.2)',
            borderRadius: 2
          }}
        >
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              <CircularProgress />
            </Box>
          ) : (
            <DataGrid
              rows={data}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10]}
              checkboxSelection
            />
          )}
        </Box>
      </Box>

      {/* Snackbar pour message de succès */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Snackbar pour message d'erreur */}
      {error && (
        <Snackbar open={true} autoHideDuration={3000} onClose={() => setError(null)}>
          <Alert severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      )}

      {/* Dialog de confirmation avec saisie du mot de passe admin */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Confirmation de suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Pour confirmer la suppression, veuillez saisir le mot de passe administrateur.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Mot de passe admin"
            type="password"
            fullWidth
            variant="standard"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)} color="primary">
            Annuler
          </Button>
          <Button onClick={confirmDeletion} color="error">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserList;
