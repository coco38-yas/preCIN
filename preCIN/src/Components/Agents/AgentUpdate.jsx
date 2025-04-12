// frontend/src/components/AgentUpdate.jsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Snackbar,
  Alert,
  Box,
  CircularProgress,
  Grow,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import '../Login/Login.css';
import logo from '../../LoginAssets/logoPrefet.png';

const AgentUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // État pour les données de l'agent à modifier (mêmes clés que pour AgentRegistre)
  const [agentData, setAgentData] = useState({ noms: '', commune_id: '' });
  // Liste des communes (attendues au format { id, name })
  const [communes, setCommunes] = useState([]);
  // Indicateur de chargement
  const [loading, setLoading] = useState(true);
  // Snackbar pour afficher messages de succès ou d'erreur
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Charger les données de l'agent via GET /agentregistre/:id
  useEffect(() => {
    Axios.get(`http://localhost:3000/agentregistre/${id}`)
      .then((res) => {
        // On s'attend à recevoir un objet agent avec 'noms' et 'commune_id'
        setAgentData({
          noms: res.data.noms || '',
          // On conserve la valeur numérique ou chaîne selon le besoin du Select
          commune_id: res.data.commune_id ? res.data.commune_id.toString() : '',
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement de l'agent :", err);
        setSnackbar({
          open: true,
          message: "Aucun agent trouvé pour cet ID.",
          severity: "error",
        });
        setLoading(false);
      });
  }, [id]);

  // Charger la liste des communes via GET /api/communes
  useEffect(() => {
    Axios.get('http://localhost:3000/api/communes')
      .then((res) => {
        // On s'attend à recevoir un tableau d'objets { id, name }
        setCommunes(res.data);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement des communes :", err);
      });
  }, []);

  // Gérer les changements des champs du formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAgentData((prev) => ({ ...prev, [name]: value }));
  };

  // Soumettre la mise à jour via PUT /agentregistre/:id
  const handleSubmit = (e) => {
    e.preventDefault();
    Axios.put(`http://localhost:3000/agentregistre/${id}`, agentData)
      .then((res) => {
        setSnackbar({ open: true, message: "Agent mis à jour avec succès", severity: "success" });
        // Redirection après quelques instants
        setTimeout(() => {
          navigate('/agentregistre');
        }, 2000);
      })
      .catch((err) => {
        console.error("Erreur lors de la mise à jour de l'agent :", err);
        setSnackbar({ open: true, message: "Erreur lors de la mise à jour", severity: "error" });
      });
  };

  // Annuler la modification et rediriger
  const handleCancel = () => {
    navigate('/agentregistre');
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>

      <Paper
        elevation={5}
        sx={{
          p: 4,
          borderRadius: 2,
          background: 'rgba(255,255,255,0.2)',
          backdropFilter: 'blur(10px)',
          position: 'relative',
          alignContent: 'center',
          justifyContent: 'center'
        }}
      >
        <div className="logo-container2">
          <div className="logo-wrapper">
            {/* Face avant avec le logo normal */}
            <div className="logoFront">
              <img src={logo} alt="Logo Prefecture" />
            </div>
            {/* Face arrière avec un filtre blanc */}
            <div className="logoFront">
              <img src={logo} alt="Logo Préfecture Blanc" />
            </div>
          </div>
        </div>
        <Typography variant="h5" align="center" gutterBottom>
          Modifier l'Agent
        </Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height={200}>
            <CircularProgress />
          </Box>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <TextField
              label="Nom du Chef"
              variant="outlined"
              name="noms"
              id="textfield"
              fullWidth
              value={agentData.noms}
              onChange={handleChange}
            />
            <FormControl fullWidth variant="outlined">
              <InputLabel>Commune Associée</InputLabel>
              <Select
                id="textfield"
                name="commune_id"
                label="Commune Associée"
                value={agentData.commune_id}
                onChange={handleChange}
              >
                {communes.map((commune) => (
                  <MenuItem key={commune.id} value={commune.id.toString()}>
                    {commune.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box display="flex" justifyContent="space-between" gap={2} mt={2}>
              <Button variant="contained" color="primary" type="submit" style={{ width: "120px" }} >
                Mettre à jour
              </Button>
              <Button variant="outlined" color="secondary" onClick={handleCancel} type='submit' fullWidth>
                Annuler
              </Button>
            </Box>
          </form>
        )}
      </Paper>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        TransitionComponent={Grow}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AgentUpdate;
