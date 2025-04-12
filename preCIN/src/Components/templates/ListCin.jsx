import React, { useState, useEffect, useMemo } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Box,
  Alert,
  Typography,
  Snackbar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField
} from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Edit, Delete, Visibility as VisibilityIcon } from '@mui/icons-material';
import RestoreIcon from '@mui/icons-material/Restore';
import LockOpen from '@mui/icons-material/LockOpen';
import StyledDataGrid from './StyledDataGrid';
import { CheckCircle, HourglassEmpty, Female, Male } from '@mui/icons-material';

const ListCin = ({
  selectedCommune,
  controlMode = false,
  refreshDeletedCount,
  updateDeletedCountOptimistic,
  viewMode = "",
  onMonthSelected = () => {}
}) => {
  // États pour cartes, messages et filtres internes (dates)
  const [allCards, setAllCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [message, setMessage] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // On initialise le mois local par défaut sur le mois actuel
  const [localMonth, setLocalMonth] = useState(new Date());

  // Autres états pour confirmations et dialogues
  const [confirmedCards, setConfirmedCards] = useState([]);
  const [unlockedCards, setUnlockedCards] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);
  const [adminDialogOpen, setAdminDialogOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [cardToUnlock, setCardToUnlock] = useState(null);

  const fetchCards = async () => {
    try {
      const res = await Axios.get('http://localhost:3000/api/creatcinforcom');
      const fetchedData = res.data.data || res.data;
      const filteredByMode = fetchedData.filter(card =>
        controlMode ? card.isDeleted : !card.isDeleted
      );
      setAllCards(filteredByMode);

      const confirmed = filteredByMode
        .filter(card => Number(card.isConfirmed) === 1)
        .map(card => card.id);
      setConfirmedCards(confirmed);
    } catch (error) {
      console.error('Erreur lors du chargement des cartes', error);
      setMessage("Erreur lors du chargement des cartes.");
    }
  };

  useEffect(() => {
    fetchCards();
  }, [controlMode]);

  // useEffect pour filtrer les cartes sans appeler onMonthSelected
  useEffect(() => {
    let cards = [...allCards];

    if (selectedCommune) {
      cards = cards.filter(card =>
        card.commune_id === selectedCommune.id ||
        (card.commune_name && card.commune_name === selectedCommune.name)
      );
    }

    if (localMonth) {
      const selectedYearMonth = localMonth.toISOString().slice(0, 7);
      cards = cards.filter(card => {
        if (!card.date_ajout) return false;
        const cardYearMonth = new Date(card.date_ajout).toISOString().slice(0, 7);
        return cardYearMonth === selectedYearMonth;
      });
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      cards = cards.filter(card => {
        const dateAjout = card.date_ajout ? new Date(card.date_ajout) : null;
        const dateDelivre = card.date_delivre ? new Date(card.date_delivre) : null;
        return (dateAjout && dateAjout >= start && dateAjout <= end) ||
               (dateDelivre && dateDelivre >= start && dateDelivre <= end);
      });
    }

    if (viewMode === "complete") {
      cards = cards.filter(card => {
        const isNotConfirmed = Number(card.isConfirmed) !== 1;
        const noConfirmationDate = !card.confirmation_date || card.confirmation_date === "";
        const requiredFields = [
          card.nom,
          card.prenom,
          card.num_serie_origine,
          card.num_serie_delivre,
          card.date_ajout,
          card.date_delivre,
          card.carte_type
        ];
        const hasAllRequired = requiredFields.every(field => field && field !== '');
        return isNotConfirmed && noConfirmationDate && hasAllRequired;
      });
    }
    setFilteredCards(cards);
  }, [selectedCommune, allCards, localMonth, startDate, endDate, viewMode]);

  // useEffect dédié pour appeler onMonthSelected quand localMonth change
  useEffect(() => {
    if (localMonth) {
      const selectedYearMonth = localMonth.toISOString().slice(0, 7);
      onMonthSelected(selectedYearMonth);
    }
  }, [localMonth, onMonthSelected]);

  // Gestion des filtres de dates
  const handleStartDateChange = (e) => setStartDate(e.target.value);
  const handleEndDateChange = (e) => setEndDate(e.target.value);

  // Gestion du mois avec DesktopDatePicker
  const handleMonthPickerChange = (newValue) => {
    setLocalMonth(newValue);
    setStartDate('');
    setEndDate('');
  };

  // Ouverture d'une confirmation pour une action
  const openConfirmation = (action, id) => {
    setDeleteId(id);
    setPendingAction(action);
    setOpenConfirm(true);
  };

  const handleConfirmAction = async () => {
    if (pendingAction === 'softDelete') {
      try {
        await Axios.patch(`http://localhost:3000/api/creatcinforcom/${deleteId}`, { isDeleted: true });
        setSnackbar({ open: true, message: 'Carte supprimée dans le corbeille avec succès', severity: 'success' });
        if (updateDeletedCountOptimistic) updateDeletedCountOptimistic('softDelete');
        fetchCards();
        if (refreshDeletedCount) refreshDeletedCount();
      } catch (error) {
        setMessage("Erreur lors de la suppression de la carte.");
        console.error(error);
      }
    } else if (pendingAction === 'permanentDelete') {
      try {
        await Axios.delete(`http://localhost:3000/api/creatcinforcom/${deleteId}`);
        setSnackbar({ open: true, message: 'Carte définitivement supprimée', severity: 'success' });
        fetchCards();
        if (refreshDeletedCount) refreshDeletedCount();
      } catch (error) {
        setMessage("Erreur lors de la suppression définitive de la carte.");
        console.error(error);
      }
    } else if (pendingAction === 'restore') {
      try {
        await Axios.patch(`http://localhost:3000/api/creatcinforcom/${deleteId}`, { isDeleted: false });
        setSnackbar({ open: true, message: 'Carte restaurée avec succès', severity: 'success' });
        if (updateDeletedCountOptimistic) updateDeletedCountOptimistic('restore');
        fetchCards();
        if (refreshDeletedCount) refreshDeletedCount();
      } catch (error) {
        setMessage("Erreur lors de la restauration de la carte.");
        console.error(error);
      }
    }
    setOpenConfirm(false);
  };

  const handleCancelConfirm = () => setOpenConfirm(false);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
  };

  // Confirmation de la carte via le CheckCircle
  const handleConfirmCard = async (rowId) => {
    if (!confirmedCards.includes(rowId)) {
      const confirmationDate = new Date().toISOString().slice(0, 10);
      try {
        await Axios.patch(`http://localhost:3000/api/creatcinforcom/confirm/${rowId}`, {
          confirmationDate,
        });
        setSnackbar({ open: true, message: 'Carte confirmée à sortir', severity: 'success' });
        fetchCards();
      } catch (error) {
        console.error("Erreur lors de la confirmation de la carte", error);
        setSnackbar({ open: true, message: 'Erreur lors de la confirmation', severity: 'error' });
      }
    }
  };

  // Ouverture du dialogue d'authentification pour débloquer l'édition d'une carte
  const handleOpenAdminDialog = (row) => {
    setCardToUnlock(row);
    setAdminDialogOpen(true);
  };

  // Vérification du mot de passe administrateur (ici, le mot de passe requis est "__precin__")
  const handleAdminConfirm = () => {
    if (adminPassword === '__precin__') {
      setUnlockedCards(prev => [...prev, cardToUnlock.id]);
      setSnackbar({ open: true, message: 'Carte déverrouillée pour édition', severity: 'success' });
      setAdminDialogOpen(false);
      setAdminPassword('');
      setCardToUnlock(null);
    } else {
      setSnackbar({ open: true, message: 'Mot de passe incorrect', severity: 'error' });
    }
  };

  const handleAdminCancel = () => {
    setAdminDialogOpen(false);
    setAdminPassword('');
    setCardToUnlock(null);
  };

  // Définition des colonnes du DataGrid
  const columns = useMemo(() => [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'status',
      headerName: 'Status',
      width: 50,
      renderCell: (params) => {
        const animateId = sessionStorage.getItem("animateUpdatedCard");
        const { nom, prenom, sexe, num_serie_origine, num_serie_delivre, date_ajout, date_delivre, carte_type } = params.row;
        const filledFields = [nom, prenom, sexe, num_serie_origine, num_serie_delivre, date_ajout, date_delivre, carte_type].filter(Boolean).length;
        const isInProgress = filledFields >= 3 && filledFields < 8;
        const isComplete = filledFields === 8;
        const isConfirmed = confirmedCards.includes(Number(params.row.id));

        if (viewMode === "complete") {
          return <CheckCircle style={{ color: 'green', fontSize: 24 }} />;
        }
        if (isComplete) {
          const shouldAnimate = animateId && animateId === params.row.id.toString();
          return (
            <>
              <style>{`
                @keyframes pop {
                  0% { transform: scale(0); opacity: 0; }
                  50% { transform: scale(1.2); opacity: 1; }
                  100% { transform: scale(1); opacity: 1; }
                }
                @keyframes flash {
                  0%, 100% { filter: brightness(1); }
                  50% { filter: brightness(2); }
                }
              `}</style>
              <IconButton
                onClick={() => {
                  if (!isConfirmed) {
                    handleConfirmCard(params.row.id);
                  }
                }}
                disabled={isConfirmed}
              >
                <CheckCircle
                  style={{
                    color: isConfirmed ? 'black' : 'green',
                    fontSize: 24,
                    animation: shouldAnimate && !isConfirmed ? 'pop 1s ease-out, flash 2s linear 5' : undefined,
                  }}
                />
              </IconButton>
            </>
          );
        } else if (isInProgress) {
          return (
            <>
              <style>{`
                @keyframes rotate {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(-360deg); }
                }
              `}</style>
              <HourglassEmpty
                style={{
                  color: 'orange',
                  fontSize: 24,
                  animation: 'rotate 2s linear infinite',
                }}
              />
            </>
          );
        } else {
          return 'Non terminé';
        }
      },
    },
    {
      field: 'image_carte',
      headerName: 'Image',
      width: 80,
      renderCell: (params) =>
        params.value ? (
          <img
            src={`http://localhost:3000/Uploads/${params.value}`}
            alt="Carte"
            loading="lazy"
            style={{ width: '100%', transition: 'transform 0.3s ease-in-out' }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.5)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          />
        ) : 'Aucune'
    },
    { field: 'nom', headerName: 'Nom', width: 150 },
    { field: 'prenom', headerName: 'Prénoms', width: 150 },
    {
      field: 'sexe',
      headerName: 'Sexe',
      width: 30,
      renderCell: (params) => {
        if (params.value && params.value.toLowerCase() === 'femme') {
          return <Female style={{ color: 'violet', fontSize: 24 }} />;
        } else if (params.value && params.value.toLowerCase() === 'homme') {
          return <Male style={{ color: 'blue', fontSize: 24 }} />;
        } else {
          return params.value;
        }
      },
    },
    { field: 'agent_chef_id', headerName: 'Chef', width: 50 },
    { field: 'user_id', headerName: 'User', width: 50 },
    { field: 'num_serie_origine', headerName: 'N° Série Original', width: 150 },
    { field: 'num_serie_delivre', headerName: 'N° Série Délivrée', width: 150 },
    {
      field: 'date_ajout',
      headerName: "Date d'ajout",
      width: 100,
      renderCell: (params) => params.value ? new Date(params.value).toLocaleDateString() : 'Aucune'
    },
    {
      field: 'date_delivre',
      headerName: "Date de del.",
      width: 100,
      renderCell: (params) => params.value ? new Date(params.value).toLocaleDateString() : 'Aucune'
    },
    { field: 'carte_type', headerName: 'Type', width: 120 },
    { field: 'commune_id', headerName: 'Com.', width: 50 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => {
        const isLocked = confirmedCards.includes(params.row.id) && !unlockedCards.includes(params.row.id);
        return !controlMode ? (
          <>
            <IconButton
              color="primary"
              component={Link}
              to={`/edit/${params.row.id}`}
              sx={{ mr: 1 }}
              disabled={isLocked}
            >
              <Edit />
            </IconButton>
            {isLocked && (
              <IconButton color="warning" onClick={() => handleOpenAdminDialog(params.row)}>
                <LockOpen />
              </IconButton>
            )}
            <IconButton color="error" onClick={() => openConfirmation('softDelete', params.row.id)}>
              <Delete />
            </IconButton>
            <IconButton
              color="success"
              onClick={() => {
                setSelectedRow(params.row);
                setOpenDialog(true);
              }}
            >
              <VisibilityIcon />
            </IconButton>
          </>
        ) : (
          <>
            <IconButton color="success" onClick={() => openConfirmation('restore', params.row.id)}>
              <RestoreIcon />
            </IconButton>
            <IconButton color="error" onClick={() => openConfirmation('permanentDelete', params.row.id)}>
              <Delete />
            </IconButton>
            <IconButton
              color="primary"
              onClick={() => {
                setSelectedRow(params.row);
                setOpenDialog(true);
              }}
            >
              <VisibilityIcon />
            </IconButton>
          </>
        );
      },
    },
  ], [controlMode, confirmedCards, unlockedCards, viewMode]);

  const rows = useMemo(() => filteredCards, [filteredCards]);

  return (
    <Box sx={{ width: '100%', padding: '10px' }}>
      {message && <Alert severity="error">{message}</Alert>}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2, alignItems: 'center' }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DesktopDatePicker
            label="Sélectionner le mois"
            inputFormat="yyyy-MM"
            views={['year', 'month']}
            value={localMonth}
            onChange={handleMonthPickerChange}
            textField={(params) => <TextField {...params} helperText={null} />}
          />
        </LocalizationProvider>
        <TextField
          id="start-date"
          label="Début le"
          type="date"
          value={startDate}
          onChange={handleStartDateChange}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          id="end-date"
          label="Fin le"
          type="date"
          value={endDate}
          onChange={handleEndDateChange}
          InputLabelProps={{ shrink: true }}
        />
      </Box>
      {controlMode && (
        <Typography variant="h6" color="error" sx={{ mb: 2 }}>
          {filteredCards.length > 0
            ? `Vous avez ${filteredCards.length} carte(s) supprimée(s)`
            : "Aucune carte supprimée"}
        </Typography>
      )}
      <StyledDataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        checkboxSelection
        slots={{ toolbar: GridToolbar }}
      />
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="lg">
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
          {selectedRow ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 3,
                backgroundColor: '#fff',
                borderRadius: '16px',
                p: 3,
                boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.15)',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': { transform: 'scale(1.02)' },
              }}
            >
              <Box
                component="img"
                src={`http://localhost:3000/Uploads/${selectedRow.image_carte}`}
                alt={selectedRow.nom}
                sx={{
                  width: { xs: '100%', sm: 640 },
                  height: { xs: 'auto', sm: 220 },
                  borderRadius: '12px',
                  mr: 4,
                  objectFit: 'cover',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': { transform: 'scale(1.6)', marginLeft: '180px' }
                }}
              />
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333', mb: 1 }}>
                  {selectedRow.nom} {selectedRow.prenom}
                </Typography>
                <Typography variant="h6" sx={{ color: '#555', mb: 1 }}>
                  Numéro de série original :{' '}
                  <span style={{ fontWeight: 'bold', color: '#e52e71' }}>
                    {selectedRow.num_serie_origine}
                  </span>
                </Typography>
                <Typography variant="h6" sx={{ color: '#555', mb: 1 }}>
                  Numéro de CIN :{' '}
                  <span style={{ fontWeight: 'bold', color: '#e52e71' }}>
                    {selectedRow.num_serie_delivre}
                  </span>
                </Typography>
                <Typography variant="h6" sx={{ color: '#555' }}>
                  Commune :{' '}
                  <span style={{ fontWeight: 'bold', color: '#ff8a00' }}>
                    {selectedRow.commune_name || selectedRow.commune_id}
                  </span>
                </Typography>
              </Box>
            </Box>
          ) : (
            <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }}>
              Aucun résultat trouvé.
            </Typography>
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
      <Dialog open={adminDialogOpen} onClose={handleAdminCancel}>
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
          <Button onClick={handleAdminCancel}>Annuler</Button>
          <Button onClick={handleAdminConfirm}>Valider</Button>
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

export default ListCin;
