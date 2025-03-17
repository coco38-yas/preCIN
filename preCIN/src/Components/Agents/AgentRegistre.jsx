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
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Edit, Delete } from '@mui/icons-material';
import { Link } from 'react-router-dom'
import Axios from 'axios';
import '../templates/Bodystyle.css'

const AgentRegistre = () => {
  const [agentChef, setAgentChef] = useState({ nomAgent: '', communeAgent: '' });
  const [data, setData] = useState([]); // Liste des agents
  const [communes, setCommunes] = useState([]); // Liste des communes
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Charger la liste des agents
  useEffect(() => {
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
  }, []);

  // Charger la liste des communes
  useEffect(() => {
    Axios.get('http://localhost:3000/api/communes')
      .then((res) => {
        setCommunes(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  // Ajouter un agent
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios.post('http://localhost:3000/agentregistre', agentChef);
      setSuccessMessage('Agent ajouté avec succès');
      setOpenSnackbar(true);
      setData([...data, response.data]); // Ajouter le nouvel agent à la liste
      setAgentChef({ nomAgent: '', communeAgent: '' });
    } catch (err) {
      console.log(err);
      setError("Impossible d'ajouter l'agent.");
    }
  };

  // Supprimer un agent
  const handleDelete = (id) => {
    Axios.delete(`http://localhost:3000/agentregistre/${id}`)
      .then(() => {
        setData(data.filter((agent) => agent.id !== id));
      })
      .catch((err) => console.log(err));
  };

  // Colonnes du DataGrid
  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'noms', headerName: 'Nom', width: 200 },
    { field: 'communeAgent', headerName: 'Commune associée', width: 200 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton color="primary" component={Link} to={`/agentupdate/${params.row.id}`}>
          <Edit />
        </IconButton>
          <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box display="flex" gap={4} mt={4}>
        {/* Formulaire */}
        <Box flex={1} p={3} sx={{ backdropFilter: 'blur(10px)', background: 'rgba(255,255,255,0.2)', borderRadius: 2 }}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Nom de l'agent"
              variant="outlined"
              margin="normal"
              id="textfield"
              value={agentChef.nomAgent}
              onChange={(e) => setAgentChef({ ...agentChef, nomAgent: e.target.value })}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Commune</InputLabel>
              <Select
                value={agentChef.communeAgent}
                id="textfield"
                onChange={(e) => setAgentChef({ ...agentChef, communeAgent: e.target.value })}
              >
                {communes.map((commune, index) => (
                  <MenuItem key={index} value={commune.name}>{commune.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Ajouter
            </Button>
          </form>
        </Box>

        {/* Tableau DataGrid */}
        <Box flex={2} p={3} sx={{ backdropFilter: 'blur(10px)', background: 'rgba(255,255,255,0.2)', borderRadius: 2 }}>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              <CircularProgress />
            </Box>
          ) : (
            <DataGrid
              rows={data}
              columns={columns}
              sx={{
                '& .MuiDataGrid-columnHeaders': {
                  background: 'linear-gradient(to left, rgb(3,112,3), rgb(3,11,107)) !important',
                  borderBottom: 'none',
                },
                '& .MuiDataGrid-virtualScroller': {
                  backgroundColor: 'rgba(23,235,23,0.5)',
                },
                '& .MuiDataGrid-footerContainer': {
                  background: 'linear-gradient(to left, rgb(3,112,3), rgb(3,11,107)) !important',
                  borderTop: 'none',
                },
                "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                  color: 'inherit',
                },
              }}
              pageSize={10}
              rowsPerPageOptions={[10]}
              checkboxSelection
            />
          )}
        </Box>
      </Box>

      {/* Message de succès */}
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
        <Alert severity="success" sx={{ width: '100%' }}>{successMessage}</Alert>
      </Snackbar>

      {/* Message d'erreur */}
      {error && (
        <Snackbar open={true} autoHideDuration={3000} onClose={() => setError(null)}>
          <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>
        </Snackbar>
      )}
    </Container>
  );
};

export default AgentRegistre;
