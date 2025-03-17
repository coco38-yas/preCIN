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

const AgentUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // État pour les données de l'agent à modifier
    const [agentData, setAgentData] = useState({ nomAgent: '', communeAgent: '' });
    // Liste des communes pour le Select
    const [communes, setCommunes] = useState([]);
    // Indicateur de chargement
    const [loading, setLoading] = useState(true);
    // Snackbar pour afficher messages de succès ou d'erreur
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Charger les données de l'agent
    useEffect(() => {
        Axios.get(`http://localhost:3000/agentregistre/${id}`)
            .then((res) => {
                // On suppose que le backend renvoie un objet agent avec 'noms' et 'communes_id'
                setAgentData({
                    nomAgent: res.data.noms || '',
                    communeAgent: res.data.communes_id ? res.data.communes_id.toString() : '',
                });
                setLoading(false);
            })
            .catch((err) => {
                console.error("Erreur lors du chargement de l'agent :", err);
                setLoading(false);
            });
    }, [id]);

    // Charger la liste des communes
    useEffect(() => {
        Axios.get('http://localhost:3000/api/communes')
            .then((res) => {
                // On suppose que res.data est un tableau d'objets { id, nom }
                setCommunes(res.data);
            })
            .catch((err) => console.error("Erreur lors du chargement des communes :", err));
    }, []);

    // Gérer les changements des champs du formulaire
    const handleChange = (e) => {
        const { name, value } = e.target;
        setAgentData((prev) => ({ ...prev, [name]: value }));
    };

    // Soumettre la mise à jour
    const handleSubmit = (e) => {
        e.preventDefault();
        Axios.put(`http://localhost:3000/agentregistre/${id}`, agentData)
            .then((res) => {
                setSnackbar({ open: true, message: "Agent mis à jour avec succès", severity: "success" });
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
                }}
            >
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
                            label="Nom de l'Agent"
                            variant="outlined"
                            name="nomAgent"
                            fullWidth
                            value={agentData.nomAgent}
                            onChange={handleChange}
                        />
                        <FormControl fullWidth variant="outlined">
                            <InputLabel>Commune Associée</InputLabel>
                            <Select
                                name="communeAgent"
                                label="Commune Associée"
                                value={agentData.communeAgent}
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
                            <Button variant="contained" color="primary" type="submit" fullWidth>
                                Mettre à jour
                            </Button>
                            <Button variant="outlined" color="secondary" onClick={handleCancel} fullWidth>
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


                TransitionComponent={Grow}     >

                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
                    {snackbar.message}</Alert></Snackbar></Container>);
};
export default AgentUpdate;
