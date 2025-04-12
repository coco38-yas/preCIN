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
    CardActions
} from '@mui/material';
import Axios from 'axios';
import { CompareArrows } from '@mui/icons-material';
import ListCin from '../templates/ListCin';

const HistoriqueTabss = ({ selectedCommune }) => {
    // -- États généraux --
    const [allCards, setAllCards] = useState([]);
    const [loading, setLoading] = useState(false);

    // -- État pour la gestion des vues (sous-onglets) --
    const [viewIndex, setViewIndex] = useState(0);

    // -- États pour la vue Filtrer par date --
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [filteredCardsByDate, setFilteredCardsByDate] = useState([]);
    const [expandedDateFilter, setExpandedDateFilter] = useState(false);

    // --- Nouvel état pour le mois sélectionné ---
    const [selectedMonth, setSelectedMonth] = useState('');

    // -- États pour la vue Jour par jour (mois en cours) --
    const [cardsByDay, setCardsByDay] = useState({}); // { '2025-04-01': [ {card}, {card} ], ... }

    // -- États pour la vue Incomplets --
    const [incompleteCards, setIncompleteCards] = useState([]);

    const [completeCards, setcompleteCards] = useState([]);

    // -- État pour la Dialog +INFO --
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogImage, setDialogImage] = useState('');

    // -------------------------------------
    // 1) Charger toutes les cartes de la commune
    // -------------------------------------
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

    // -------------------------------------
    // 2) Vue "Filtrer par date"
    //    => Filtre isConfirmed=1 et date_ajout ou date_delivre dans [startDate, endDate]
    // -------------------------------------
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

    // Vue 1 : Jour par jour (groupées par confirmation_date)
    useEffect(() => {
        if (viewIndex !== 1) return;
        // On filtre les cartes confirmées et ayant une confirmation_date renseignée
        const confirmedCards = allCards.filter(card =>
            Number(card.isConfirmed) === 1 && card.confirmation_date
        );
        // Grouper par confirmation_date (qui doit être au format "YYYY-MM-DD")
        const grouped = {};
        confirmedCards.forEach(card => {
            const confirmationDate = new Date(card.confirmation_date).toISOString().split('T')[0]; // par exemple "2025-04-11"
            if (!grouped[confirmationDate]) {
                grouped[confirmationDate] = [];
            }
            grouped[confirmationDate].push(card);
        });
        setCardsByDay(grouped);
    }, [allCards, viewIndex]);


    // -------------------------------------
    // 4) Vue "Incomplets" (statut isInProgress)
    //    => On considère "incomplet" si isConfirmed !== 1 ou si un champ essentiel manque
    // -------------------------------------
    useEffect(() => {
        if (viewIndex !== 2) return; // on ne calcule que si on est sur la vue "incomplet"
        const incomplete = allCards.filter((card) => {
            const isConfirmed = Number(card.isConfirmed) === 1;
            // Exemples de champs obligatoires :
            // nom, prenom, num_serie_origine, num_serie_delivre, date_ajout, date_delivre, carte_type
            // On peut affiner selon votre logique
            const requiredFields = [
                card.nom,
                card.prenom,
                card.num_serie_origine,
                card.num_serie_delivre,
                card.date_ajout,
                card.date_delivre,
                card.carte_type
            ];
            const hasAllRequired = requiredFields.every((f) => f && f !== '');
            // return !isConfirmed || !hasAllRequired;
            return !hasAllRequired;
        });
        setIncompleteCards(incomplete);
    }, [allCards, viewIndex]);

    // -------------------------------------
    // 5) Vue "Complets sans confirmation" (statut CheckCircle verte)
    //    => On considère "complet" si isConfirmed !== 1
    // -------------------------------------
    useEffect(() => {
        if (viewIndex !== 3) return; // on ne calcule que si on est sur la vue "incomplet"
        const complete = allCards.filter((card) => {
            const isConfirmed = Number(card.isConfirmed) === 1;
            // Exemples de champs obligatoires :
            // nom, prenom, num_serie_origine, num_serie_delivre, date_ajout, date_delivre, carte_type
            // On peut affiner selon votre logique

            // On filtre les cartes confirmées et ayant une confirmation_date renseignée
            const confirmedCards = allCards.filter(card =>
                isConfirmed === 1 && card.confirmation_date
            );
            const requiredFields = [
                card.nom,
                card.prenom,
                card.num_serie_origine,
                card.num_serie_delivre,
                card.date_ajout,
                card.date_delivre,
                card.carte_type
            ];
            const hasAllRequired = requiredFields.every((f) => f && f !== '');
            return !confirmedCards || hasAllRequired;
            // return !hasAllRequired;
        });
        setcompleteCards(complete);
    }, [allCards, viewIndex]);

    // -------------------------------------
    // 5) Gérer l’ouverture du dialog +INFO (affichage de l’image)
    // -------------------------------------
    const handleInfo = (image) => {
        setDialogImage(image);
        setOpenDialog(true);
    };
    // Utiliser useCallback pour mémoriser la fonction de mise à jour du mois
    const handleMonthSelected = useCallback((monthValue) => {
        setSelectedMonth(monthValue);
    }, []);

    // -------------------------------------
    // Rendu principal
    // -------------------------------------
    const handleChangeView = (event, newValue) => setViewIndex(newValue);

    return (
        <Box sx={{ mt: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Historique <CompareArrows sx={{ ml: 1 }} />
            </Typography>

            {/* Sous-onglets pour les 3 vues */}
            <Tabs value={viewIndex} onChange={handleChangeView} sx={{ mb: 2 }}>
                <Tab label="Filtrer par date" />
                <Tab label="Jour de sortie(mois en cours)" />
                <Tab label="Incomplets" />
                <Tab label="Sans Confirmation" />
            </Tabs>

            {loading && <Typography>Chargement des données...</Typography>}

            {/* ---------------------------- */}
            {/* Vue 0 : Filtrer par date */}
            {/* ---------------------------- */}
            {viewIndex === 0 && (
                <Box>
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
                        <Button
                            variant="outlined"
                            onClick={() => setExpandedDateFilter(!expandedDateFilter)}
                        >
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
                                <Card
                                    key={card.id}
                                    variant="outlined"
                                    sx={{ backgroundColor: '#fafafa' }}
                                >
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
                                        <Button size="small" onClick={() => handleInfo(card.image_carte)}>
                                            + INFO
                                        </Button>
                                    </CardActions>
                                </Card>
                            ))}
                        </Box>
                    )}
                </Box>
            )}

            {viewIndex === 1 && (
                <Box>
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                        Historique des cartes sorties par confirmation pour ce jour-ci
                    </Typography>
                    {Object.keys(cardsByDay).length === 0 && (
                        <Typography>Aucune carte confirmée pour ce jour.</Typography>
                    )}
                    {Object.entries(cardsByDay).map(([day, cards]) => (
                        <Box key={day} sx={{ mb: 4 }}>
                            <Typography variant="h6" sx={{ mb: 1, color: 'green' }}>
                                {`Date : ${day} (${cards.length} cartes au total du jours)`}
                            </Typography>
                            <Box
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                                    gap: 2,
                                }}
                            >
                                {cards.map((card) => (
                                    <Card key={card.id} variant="outlined">
                                        <CardContent>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                                {`Carte #${card.id}`}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: "#000" }}>
                                                <strong>N°_Original :</strong> {card.num_serie_origine || 'N/A'}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: "#000" }}>
                                                <strong>N°_Délivrée :</strong> {card.num_serie_delivre || 'N/A'}
                                            </Typography>
                                        </CardContent>
                                        <CardActions>
                                            <Button size="small" onClick={() => handleInfo(card.image_carte)}>
                                                + INFO
                                            </Button>
                                        </CardActions>
                                    </Card>
                                ))}
                            </Box>
                        </Box>
                    ))}
                </Box>
            )}

            {/* ---------------------------- */}
            {/* Vue 2 : Incomplets */}
            {/* ---------------------------- */}
            {viewIndex === 2 && (
                <Box>
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
                            gap: 2,
                        }}
                    >
                        {incompleteCards.map((card) => (
                            <Card key={card.id} variant="outlined">
                                <CardContent>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'orange' }}>
                                        {`Carte #${card.id} (Incomplète)`}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "#000" }}>
                                        Nom : <strong>{card.nom || 'Non défini'}</strong>
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "#000" }}>
                                        Prénom : <strong>{card.prenom || 'Non défini'}</strong>
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "#000" }}>
                                        Original : <strong>{card.num_serie_origine || 'Non défini'}</strong>
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "#000" }}>
                                        Délivrée : <strong>{card.num_serie_delivre || 'Non défini'}</strong>
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" onClick={() => handleInfo(card.image_carte)}>
                                        + INFO
                                    </Button>
                                </CardActions>
                            </Card>
                        ))}
                    </Box>
                </Box>
            )}

            {/* Vue 3 : Sans Confirmation */}
            {viewIndex === 3 && (
                // On passe selectedMonth et onMonthChange pour que ListCin gère le filtrage par mois,
                // et HistoriqueTab peut utiliser la valeur sélectionnée pour un affichage global.
                <Box>
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                        Cartes complètes sans confirmation pour sortir (mois sélectionné : {selectedMonth || "non défini"})
                    </Typography>
                    <ListCin
                        selectedCommune={selectedCommune}
                        viewMode="complete"
                        onMonthSelected={handleMonthSelected} // Callback stabilisé

                    // Vous pouvez transmettre d'autres callbacks si nécessaire
                    />
                </Box>
            )}


            {/* Dialog pour afficher l'image */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="lg" sx={{ backdropFilter: 'blur(6px)', background: 'linear-gradient(to left,rgba(3, 12, 107, 0.63), rgba(3, 112, 3, 0.51))' }}>
                <DialogTitle>Image de la carte</DialogTitle>
                <DialogContent>
                    {dialogImage ? (
                        <Box
                            component="img"
                            src={`http://localhost:3000/Uploads/${dialogImage}`}
                            alt="Carte"
                            sx={{ width: '100%' }}
                        />
                    ) : (
                        <Typography>Aucune image disponible.</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Fermer</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default HistoriqueTabss;
