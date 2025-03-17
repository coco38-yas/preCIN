import { Router } from 'express';
const router = Router();
import { getDashboardStats } from '../controllers/dashboardController.js';

// Définition de la route du tableau de bord
router.get('/', getDashboardStats);

export default router;
