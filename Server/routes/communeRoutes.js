// backend/routes/agentRoutes.js
import { Router } from 'express';
import {
  createCom,
  getComs,
  updateCom,
  deleteCom
} from '../controllers/communeController.js';

const router = Router();

// Route pour récupérer tous les agents
router.get('/', getComs);

// Route pour créer un nouvel agent
router.post('/', createCom);

// Route pour mettre à jour un agent existant
router.put('/:id', updateCom);

// Route pour supprimer un agent
router.delete('/:id', deleteCom);

export default router;
