import { Router } from 'express';
const router = Router();
import { getDashboardStats, getCommunes, getCommuneYearStats } from '../controllers/dashboardController.js';

// Définition de la route du tableau de bord
router.get('/', getDashboardStats);
router.get('/communes', getCommunes);           // Nouvelle route pour récupérer les communes
// Nouvelle route pour récupérer les statistiques annuelles par commune
router.get('/commune/year', getCommuneYearStats);

export default router;
