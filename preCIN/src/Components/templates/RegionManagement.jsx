
import React, { useState, useEffect, createContext, useContext } from 'react';
import { Grid, Paper, Typography, TextField, Button, Box, FormControl, InputLabel, Select, MenuItem, Container, Snackbar, Alert, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


const RegionManagement = () => {
  return (
    <Grid item xs={12} md={6}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Création d'une Région</Typography>
        <FormControl fullWidth margin="normal">
                <InputLabel>District</InputLabel>
                <Select label="District" value={district} onChange={(e) => setDistrict(e.target.value)} >
                  {districts.map((d) => (<MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField label="Nom de la région" value={region} onChange={(e) => setRegion(e.target.value)} fullWidth margin="normal" />
              <Button variant="contained" color="primary" onClick={createRegion} fullWidth> Créer Région </Button>
              <DataGrid rows={[]} columns={columns} pageSize={5} sx={{ mt: 2 }} />
      </Paper>
    </Grid>
  );
};


export default RegionManagement