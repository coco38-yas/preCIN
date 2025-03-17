
import React, { useState, useEffect, createContext, useContext } from 'react';
import { Grid, Paper, Typography, TextField, Button, Box, FormControl, InputLabel, Select, MenuItem, Container, Snackbar, Alert, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


const CommuneManagement = () => {
    return (
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6">Création d'une Commune</Typography>
          <TextField label="Nom de la session" value={session} onChange={(e) => setSession(e.target.value)} fullWidth margin="normal" />
                <Button variant="contained" color="primary" onClick={createSession} fullWidth> Créer Session </Button>
                <DataGrid rows={[]} columns={columns} pageSize={5} sx={{ mt: 2 }} />
        </Paper>
      </Grid>
    );
  };
  



export default CommuneManagement