import { Router } from 'express';
const router = Router();
import { addKeys, activateKey } from '../controllers/activationController.js';

router.post('/add-keys', addKeys); // Ajout manuel des clés
router.post('/activate', activateKey); // Activation d'une clé

export default router;
