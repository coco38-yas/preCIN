
import React, { useState, useEffect, createContext, useContext } from 'react';
import { Grid, Paper, Typography, TextField, Button, Box, FormControl, InputLabel, Select, MenuItem, Container, Snackbar, Alert, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


const DistrictManagement = () => {
  return (
    <Grid item xs={12} md={6}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Création d'un District</Typography>
        <FormControl fullWidth margin="normal">
              <InputLabel>Région</InputLabel>
              <Select label="Région" value={region} onChange={(e) => setRegion(e.target.value)} >
                {regions.map((r) => (<MenuItem key={r.id} value={r.id}> {r.name} </MenuItem>))}
              </Select>
            </FormControl>
            <TextField label="Nom du district" value={district} onChange={(e) => setDistrict(e.target.value)} fullWidth margin="normal" />
            <Button variant="contained" color="primary" onClick={createDistrict} fullWidth> Créer District </Button>
            <DataGrid rows={[]} columns={columns} pageSize={5} sx={{ mt: 2 }} />
      </Paper>
    </Grid>
  );
};



export default DistrictManagement