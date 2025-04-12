import { Router } from 'express';
const router = Router();
import { db } from '../index.js'; // Assurez-vous que db est configuré pour votre MySQL

import { activateKey, addActivationKeys, generateActivationKey, hashActivationKey } from '../controllers/activationController.js';

// Route pour activer une clé
router.post('/activate', activateKey);

// Route pour ajouter une liste de clés manuellement (optionnelle)
router.post('/add-keys', addActivationKeys);

// Vérifier si la clé d'activation est valide et non expirée
router.get('/check-activation', async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT * FROM activation_keys 
            WHERE is_used = 1 AND expires_at > NOW() 
            ORDER BY expires_at DESC LIMIT 1
        `);

        if (rows.length > 0) {
            res.json({ activated: true, expiration_date: rows[0].expiration_date });
        } else {
            res.json({ activated: false });
        }
    } catch (error) {
        console.error("Erreur de vérification d'activation:", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});
export default router;
