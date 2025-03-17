// backend/routes/agentRoutes.js
import { Router } from 'express';
import {
  createAgent,
  getAgents,
  updateAgent,
  deleteAgent
} from '../controllers/agentController.js';

const router = Router();

// Route pour récupérer tous les agents
router.get('/', getAgents);

// Route pour créer un nouvel agent
router.post('/', createAgent);

// Route pour mettre à jour un agent existant
router.put('/:id', updateAgent);

// Route pour supprimer un agent
router.delete('/:id', deleteAgent);

export default router;
