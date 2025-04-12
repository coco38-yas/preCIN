import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Tabs,
  Tab,
  TextField,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  CardActions,
  Snackbar,
  Alert
} from '@mui/material';
import Axios from 'axios';
import { CompareArrows } from '@mui/icons-material';
import ListCin from '../templates/ListCin';

const formatDateLocal = (dateStr) => {
  if (!dateStr) return '';
  let d;
  // Si la chaîne est exactement de 10 caractères, on suppose qu'elle est au format "YYYY-MM-DD"
  if (dateStr.length === 10) {
    d = new Date(dateStr + "T00:00:00");
  } else {
    d = new Date(dateStr);
  }
  // Si la date n'est pas valide, on retourne la chaîne d'origine (ou une chaîne vide)
  if (isNaN(d)) return '';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const HistoriqueTab = ({ selectedCommune }) => {
  // États généraux
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [allCards, setAllCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [adminDialogOpen, setAdminDialogOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [cardToUnlock, setCardToUnlock] = useState(null);

  // Gestion des vues par onglets
  const [viewIndex, setViewIndex] = useState(0);

  // États pour filtrer par date
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredCardsByDate, setFilteredCardsByDate] = useState([]);
  const [expandedDateFilter, setExpandedDateFilter] = useState(false);

  // Nouvel état pour le mois sélectionné remonté depuis ListCin
  const [selectedMonth, setSelectedMonth] = useState('');

  // Autres états pour d'autres vues
  const [cardsByDay, setCardsByDay] = useState({});
  const [incompleteCards, setIncompleteCards] = useState([]);
  const [completeCards, setCompleteCards] = useState([]);

  // États pour le dialog d'information
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogImage, setDialogImage] = useState('');

  // Chargement des cartes depuis l'API
  useEffect(() => {
    if (!selectedCommune) return;
    setLoading(true);
    Axios.get('http://localhost:3000/api/creatcinforcom')
      .then((res) => {
        setLoading(false);
        const cards = res.data.data || res.data;
        // Filtrer selon la commune sélectionnée
        const filtered = cards.filter((card) =>
          card.commune_id === selectedCommune.id ||
          (card.commune_name && card.commune_name === selectedCommune.name)
        );
        setAllCards(filtered);
      })
      .catch((err) => {
        setLoading(false);
        console.error("Erreur lors de la récupération des cartes :", err);
      });
  }, [selectedCommune]);

  // Exemple de filtrage par date pour la vue 0
  const handleFilterByDate = () => {
    if (!startDate || !endDate) return;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const filtered = allCards.filter((card) => {
      const isConfirmed = Number(card.isConfirmed) === 1;
      const dateAjout = card.date_ajout ? new Date(card.date_ajout) : null;
      const dateDelivre = card.date_delivre ? new Date(card.date_delivre) : null;
      const inInterval =
        (dateAjout && dateAjout >= start && dateAjout <= end) ||
        (dateDelivre && dateDelivre >= start && dateDelivre <= end);
      return isConfirmed && inInterval;
    });
    setFilteredCardsByDate(filtered);
  };

  // Vue 1 : Groupement des cartes confirmées par date de confirmation (Jour de sortie)
  useEffect(() => {
    if (viewIndex !== 1) return;
    const confirmedCards = allCards.filter(card =>
      Number(card.isConfirmed) === 1 && card.confirmation_date
    );
    const grouped = {};
    confirmedCards.forEach(card => {
      // Correction ici : utiliser formatDateLocal pour avoir la date exacte
      const confirmationDate = formatDateLocal(card.confirmation_date);
      if (!grouped[confirmationDate]) {
        grouped[confirmationDate] = [];
      }
      grouped[confirmationDate].push(card);
    });
    setCardsByDay(grouped);
  }, [allCards, viewIndex]);

  // Vue 2 : Cartes incomplètes
  useEffect(() => {
    if (viewIndex !== 2) return;
    const incomplete = allCards.filter((card) => {
      const requiredFields = [
        card.nom,
        card.prenom,
        card.num_serie_origine,
        card.num_serie_delivre,
        card.date_ajout,
        card.date_delivre,
        card.carte_type
      ];
      return !requiredFields.every(f => f && f !== '');
    });
    setIncompleteCards(incomplete);
  }, [allCards, viewIndex]);

  // Vue 3 : Sans Confirmation (Liste gérée par ListCin)
  // On passe le callback stabilisé pour remonter le mois sélectionné
  const handleMonthSelected = useCallback((monthValue) => {
    setSelectedMonth(monthValue);
  }, []);

  const handleChangeView = (event, newValue) => setViewIndex(newValue);
  const handleCancelConfirm = () => setOpenConfirm(false);
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
  };

  // (Exemple de fonction de confirmation à compléter selon vos besoins)
  const handleConfirmAction = async () => {
    // Votre logique ici...
    setOpenConfirm(false);
  };

  const handleOpenDialog = (imageName) => {
    setDialogImage(imageName);
    setOpenDialog(true);
  };


  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Historique <CompareArrows sx={{ ml: 1 }} />
      </Typography>

      <Tabs value={viewIndex} onChange={handleChangeView}
        TabIndicatorProps={{
          sx: {
            top: 0, // Positionne l'indicateur en haut
            bottom: 'auto', // Désactive la position par défaut en bas
            height: 8, // Vous pouvez ajuster la hauteur
            borderRadius: '8px 8px 0 0', // Arrondit uniquement les coins supérieurs
            backgroundColor: 'blue' // Changez la couleur selon vos besoins
          }
        }}
      >
        <Tab label="Filtrer par date" sx={{ '&.Mui-selected': { backgroundColor: '#b9fffd', borderRadius: '8px 8px 0 0' } }} />
        <Tab label="cartes confirmées (Jour de sortie)" sx={{ '&.Mui-selected': { backgroundColor: '#b9fffd', borderRadius: '8px 8px 0 0' } }} />
        <Tab label="Cartes Incomplètes (Non attribuées)" sx={{ '&.Mui-selected': { backgroundColor: '#b9fffd', borderRadius: '8px 8px 0 0' } }} />
        <Tab label="Cartes Complètes et Restées (Sans Confirmation)" sx={{ '&.Mui-selected': { backgroundColor: '#b9fffd', borderRadius: '8px 8px 0 0' } }} />
      </Tabs>

      {loading && <Typography>Chargement des données...</Typography>}

      {/* Vue 0 : Filtrer par date */}
      {viewIndex === 0 && (
        <Box sx={{ backgroundColor: '#b9fffd', p: 2, borderRadius: 1 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
            <TextField
              label="Début le..."
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Fin le..."
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <Button variant="contained" onClick={handleFilterByDate}>
              Filtrer
            </Button>
            <Button variant="outlined" onClick={() => setExpandedDateFilter(!expandedDateFilter)}>
              {expandedDateFilter ? 'Masquer la liste' : 'Voir la liste'}
            </Button>
          </Box>
          {startDate && endDate && (
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              {`Historique du ${startDate} au ${endDate} (${filteredCardsByDate.length} résultat(s))`}
            </Typography>
          )}
          {expandedDateFilter && (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: 2,
              }}
            >
              {filteredCardsByDate.map((card) => (
                <Card key={card.id} variant="outlined" sx={{ backgroundColor: '#fafafa' }}>
                  <CardContent>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: "#000" }}>
                      {`Carte #${card.id}`}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#000" }}>
                      N°_Original : <strong>{card.num_serie_origine || 'N/A'}</strong>
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#000" }}>
                      N°_Délivrée : <strong>{card.num_serie_delivre || 'N/A'}</strong>
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => handleOpenDialog(card.image_carte)}>
                      + INFO
                    </Button>
                  </CardActions>
                </Card>
              ))}
            </Box>
          )}
        </Box>
      )}

      {/* Vue 1 : Jour de sortie (mois en cours) */}
      {viewIndex === 1 && (
        <Box sx={{ backgroundColor: '#b9fffd', p: 2, borderRadius: 1 }}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Historique des cartes sorties par confirmation pour ce jour-ci
          </Typography>
          {Object.keys(cardsByDay).length === 0 && (
            <Typography>Aucune carte confirmée pour ce jour.</Typography>
          )}
          {Object.entries(cardsByDay).map(([day, cards]) => (
            <Box key={day} sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 1, color: 'green' }}>
                {`Date : ${day} (${cards.length} cartes)`}
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                  gap: 1,
                  
                 
                }}
              >
                {cards.map((card) => (
                  <Card key={card.id} variant="outlined"sx={{
                    transition: 'transform 0.3s ease-in-out',
                  '&:hover': { transform: 'scale(1.02)' },
                  height:'70px'

                  }}>
                    <CardContent
                      sx={{
                        p: 1, // padding réduit
                        background: 'linear-gradient(135deg, #40E0D0, #7CFC00)', // turquoise → vert fluo
                        borderRadius: 1,  
                      }}
                    >
                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr auto',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        {/* Colonne 1 : Carte #ID */}
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 'bold',px: 0, lineHeight: 1, mb: 0.5, color: "#000", fontSize: '15pt' }}
                        >
                          {`Carte #${card.id}`}
                        </Typography>

                        {/* Colonne 2 : Numéros */}
                        <Box>
                          <Typography variant="body2" sx={{ lineHeight: 0, mb: 0.5, color: "#000" }}>
                            <strong>{card.num_serie_origine}</strong>
                          </Typography>
                          <Typography variant="body2" sx={{ lineHeight: 0,mb: 2, color: "#000" }}>
                            <strong>{card.num_serie_delivre}</strong>
                          </Typography>
                        </Box>

                        {/* Colonne 3 : Bouton */}
                        <Button
                          size="small"
                          sx={{ minWidth: 'unset', px: 0.7, mb: 1, py: 2, background:'#b9fffd' }} // bouton compact
                          onClick={() => handleOpenDialog(card.image_carte)}
                        >
                          + INFO
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                ))}

              </Box>

            </Box>
          ))}
        </Box>
      )}

      {/* Vue 2 : Incomplets */}
      {viewIndex === 2 && (
        <Box sx={{ backgroundColor: '#b9fffd', p: 2, borderRadius: 1 }}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Cartes incomplètes ou en cours de traitement
          </Typography>
          {incompleteCards.length === 0 && (
            <Typography>Aucune carte incomplète trouvée.</Typography>
          )}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: 1,
              
            }}
          >
            {incompleteCards.map((card) => (
              <Card key={card.id} variant="outlined" sx={{
                transition: 'transform 0.3s ease-in-out',
              '&:hover': { transform: 'scale(1.02)' },
              height:'70px'}}
              >
                <CardContent
                  sx={{
                    p: 1, // padding réduit
                    background: 'linear-gradient(135deg, #40E0D0, #7CFC00)', // turquoise → vert fluo
                    borderRadius: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr auto',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    {/* Colonne 1 : Carte #ID */}
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 'bold', lineHeight: 1, mb: 0.5, color: "#000", fontSize: '15pt' }}
                    >
                      {`Carte #${card.id}`}
                    </Typography>

                    {/* Colonne 2 : Numéros */}
                    <Box>
                      <Typography variant="body2" sx={{ lineHeight: 0, mb: 0.5, color: "#000" }}>
                        <strong>{card.num_serie_origine || 'NonDéfini'}</strong>
                      </Typography>
                      <Typography variant="body2" sx={{ lineHeight: 0, color: "#000" }}>
                        <strong>{card.num_serie_delivre || 'NonDéfini'}</strong>
                      </Typography>

                    </Box>
                     {/* Colonne 3 : Bouton */}
                     <Button
                          size="small"
                          sx={{ minWidth: 'unset', px: 1, mb: 1, py: 2, background:'#b9fffd' }} // bouton compact
                          onClick={() => handleOpenDialog(card.image_carte)}
                        >
                          + INFO
                        </Button>
                      </Box>

                </CardContent>
               
              </Card>
            ))}
          </Box>
        </Box>
      )}

      {/* Vue 3 : Sans Confirmation */}
      {viewIndex === 3 && (
        <Box sx={{ backgroundColor: '#b9fffd', p: 2, borderRadius: 1 }}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            Cartes complètes sans confirmation pour sortir (Mois sélectionné : {selectedMonth || "non défini"})
          </Typography>
          {/* ListCin gère ici la sélection du mois et remonte la valeur via onMonthSelected */}
          <ListCin
            selectedCommune={selectedCommune}
            viewMode="complete"
            onMonthSelected={handleMonthSelected}
          />
        </Box>
      )}

      {/* Dialog et Snackbar */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="lg" sx={{ backdropFilter: 'blur(6px)', background: 'linear-gradient(to left,rgba(3, 12, 107, 0.63), rgba(3, 112, 3, 0.51))' }}>
        <DialogTitle
          sx={{
            textAlign: 'center',
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #ff8a00, #e52e71)',
            color: 'white',
            fontSize: '2rem',
            py: 2,
            borderRadius: '4px'
          }}
        >
          Détail de la carte
        </DialogTitle>
        <DialogContent dividers>
          {dialogImage ? (
            <Box component="img" src={`http://localhost:3000/Uploads/${dialogImage}`} alt="Carte" sx={{ width: '100%' }} />
          ) : (
            <Typography>Aucune image disponible.</Typography>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={openConfirm} onClose={handleCancelConfirm}>
        <DialogTitle>Confirmer l'action</DialogTitle>
        <DialogContent>
          {pendingAction === 'restore' && "Voulez-vous vraiment restaurer cet élément ?"}
          {pendingAction === 'softDelete' && "Voulez-vous vraiment supprimer cet élément ?"}
          {pendingAction === 'permanentDelete' && "Voulez-vous vraiment supprimer définitivement cet élément ?"}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelConfirm} color="primary">
            Annuler
          </Button>
          <Button onClick={handleConfirmAction} color="error">
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={adminDialogOpen} onClose={() => { /* Fermeture */ }}>
        <DialogTitle>Authentification administrateur</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Mot de passe"
            type="password"
            fullWidth
            variant="standard"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { /* Annulation */ }}>Annuler</Button>
          <Button onClick={() => { /* Validation */ }}>Valider</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default HistoriqueTab;
