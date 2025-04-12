import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Edit, Delete, SupervisorAccount as SupervisorAccountIcon } from '@mui/icons-material';
import { Link, useParams } from 'react-router-dom';
import Axios from 'axios';
import '../templates/Bodystyle.css';
import '../Login/Login.css';
import logo from '../../LoginAssets/logoPrefet.png';

const AgentRegistre = () => {
  const { agentId } = useParams(); // Récupère l'ID de l'URL pour la mise à jour

  const [agentChef, setAgentChef] = useState({ noms: '', commune_id: '' });
  const [data, setData] = useState([]); // Liste des agents
  const [communes, setCommunes] = useState([]); // Liste des communes
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Vérifier si on est en mode édition

  // États pour la confirmation de suppression avec mot de passe admin
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState(null);
  const [adminPassword, setAdminPassword] = useState('');
  // Mot de passe administrateur attendu (à sécuriser côté serveur en production)
  const expectedAdminPassword = '__precin__';

   // Fonction pour charger les agents
   const fetchAgents = () => {
    Axios.get('http://localhost:3000/agentregistre')
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setError("Erreur lors du chargement des agents.");
        setLoading(false);
      });
    }
   // Charger la liste des agents
     useEffect(() => {
      fetchAgents();
     }, []);
   
  // Charger la liste des communes
  useEffect(() => {
    Axios.get('http://localhost:3000/api/communes')
      .then((res) => {
        const communesList = res.data.data || res.data;
        setCommunes(communesList);
      })
      .catch((err) => console.log(err));
  }, []);

  // Charger un agent spécifique pour la mise à jour
  useEffect(() => {
    if (agentId) {
      setIsEditing(true);
      Axios.get(`http://localhost:3000/agentregistre/${agentId}`)
        .then((res) => setAgentChef(res.data))
        .catch((err) => console.log(err));
    }
  }, [agentId]);

  // Ajouter un agent
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios.post('http://localhost:3000/agentregistre', agentChef);
      setSuccessMessage('Agent ajouté avec succès');
      setOpenSnackbar(true);
      setData([...data, response.data]);
      setAgentChef({ noms: '', commune_id: '' });
      fetchAgents();
    } catch (err) {
      console.log(err);
      setError("Impossible d'ajouter l'agent.");
    }
  };

  // Mettre à jour un agent
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await Axios.put(`http://localhost:3000/agentregistre/${agentId}`, agentChef);
      setSuccessMessage('Agent mis à jour avec succès');
      setOpenSnackbar(true);
      setAgentChef({ noms: '', commune_id: '' });
      setIsEditing(false);
    } catch (err) {
      console.log(err);
      setError("Impossible de mettre à jour l'agent.");
    }
  };

  // Supprimer un agent (appelé après confirmation admin)
  const handleDelete = (id) => {
    Axios.delete(`http://localhost:3000/agentregistre/${id}`)
      .then(() => {
        setData(data.filter((agent) => agent.id !== id));
      })
      .catch((err) => console.log(err));
  };

  // Validation de la suppression avec le mot de passe admin
  const confirmDeletion = () => {
    if (adminPassword === expectedAdminPassword) {
      handleDelete(selectedAgentId);
    } else {
      alert("Mot de passe incorrect");
    }
    setAdminPassword('');
    setOpenConfirm(false);
  };

  // Colonnes du DataGrid
  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'noms', headerName: 'Nom', width: 200 },
    { field: 'commune_id', headerName: 'Commune associée', width: 200 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton color="primary" component={Link} to={`/agentupdate/${params.row.id}`}>
            <Edit />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => {
              setSelectedAgentId(params.row.id);
              setOpenConfirm(true);
            }}
          >
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ marginTop: '-38px' }}>
      <Box sx={{
        textAlign: 'center',
        fontWeight: 'regular',
        backdropFilter: 'blur(10px)',
        background: 'linear-gradient(45deg,rgba(255, 136, 0, 0.38),rgba(23, 255, 89, 0.2))',
        color: 'white',
        fontSize: '1.5rem',
        py: 2,
        borderRadius: '4px',
        marginBottom: '-20px'
      }}>
        <SupervisorAccountIcon style={{ verticalAlign: 'middle', marginRight: 20, transform: 'scale(2.5)' }} />
        GESTION DES AGENTS/CHEFS D'ARRONDISSEMENT
      </Box>
      <Box display="flex" gap={4} mt={4}>
        {/* Formulaire */}
        <Box flex={1} p={3} sx={{
          backdropFilter: 'blur(10px)',
          background: 'rgba(23, 255, 89, 0.2)',
          borderRadius: 2
        }}>
          <form onSubmit={isEditing ? handleUpdate : handleSubmit}>
            <div className="logo-container">
              <div className="logo-wrapper">
                <div className="logoFront">
                  <img src={logo} alt="Logo Prefecture" />
                </div>
                <div className="logoFront">
                  <img src={logo} alt="Logo Préfecture Blanc" />
                </div>
              </div>
            </div>
            <TextField
              fullWidth
              label="Nom de l'agent"
              variant="outlined"
              margin="normal"
              id="textfield"
              value={agentChef.noms}
              onChange={(e) => setAgentChef({ ...agentChef, noms: e.target.value })}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Commune</InputLabel>
              <Select
                value={agentChef.commune_id}
                id="textfield"
                onChange={(e) => setAgentChef({ ...agentChef, commune_id: e.target.value })}
              >
                {communes.map((commune) => (
                  <MenuItem key={commune.id} value={commune.id}>
                    {commune.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button type="submit" variant="contained" color={isEditing ? "secondary" : "primary"} fullWidth>
              {isEditing ? "Mettre à Jour" : "Ajouter"}
            </Button>
          </form>
        </Box>

        {/* Tableau DataGrid */}
        <Box flex={2} p={3} sx={{
          backdropFilter: 'blur(10px)',
          background: 'rgba(23, 255, 89, 0.2)',
          borderRadius: 2
        }}>
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
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
        <Alert severity="success" sx={{ width: '100%' }}>{successMessage}</Alert>
      </Snackbar>

      {/* Snackbar pour message d'erreur */}
      {error && (
        <Snackbar open={true} autoHideDuration={3000} onClose={() => setError(null)}>
          <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>
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

export default AgentRegistre;
