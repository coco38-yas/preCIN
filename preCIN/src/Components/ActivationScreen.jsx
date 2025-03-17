// src/components/ActivationScreen.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Grow,
} from '@mui/material';
import Axios from 'axios';

const ActivationScreen = ({ onActivated }) => {
  const [activationKey, setActivationKey] = useState('');
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);

  // Validation simple : la clé doit comporter au moins 10 caractères
  const isValidKey = (key) => key.length >= 10;

  const handleActivation = async () => {
    if (!isValidKey(activationKey)) {
      setError("La clé d’activation doit contenir au moins 10 caractères.");
      return;
    }
    setError('');
    setLoading(true);
    try {
      const response = await Axios.post('http://localhost:3000/api/activate', { activationKey });
      setSnackbar({ open: true, message: "Activation réussie !", severity: "success" });
      setLoading(false);
      if (onActivated) onActivated();
    } catch (err) {
      console.error("Erreur lors de l'activation :", err);
      setError(err.response?.data?.message || "Erreur lors de l'activation.");
      setSnackbar({ open: true, message: "Erreur d'activation", severity: "error" });
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="60vh"
      p={3}
    >
      <Typography variant="h5" gutterBottom>
        Activation requise
      </Typography>
      <TextField
        label="Clé d'activation"
        variant="outlined"
        value={activationKey}
        onChange={(e) => setActivationKey(e.target.value)}
        error={!!error}
        helperText={error}
        fullWidth
        sx={{ maxWidth: 400, mb: 2 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleActivation}
        disabled={loading || !activationKey}
        sx={{ maxWidth: 400 }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Activer"}
      </Button>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        TransitionComponent={Grow}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ActivationScreen;
