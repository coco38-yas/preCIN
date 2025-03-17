// import { query } from '../config/db';
import {db} from '../index.js'; // Connexion MySQL
import { hash, compare } from 'bcrypt';

export async function addKeys(req, res) {
    try {
        const { keys } = req.body; // Liste de clés en clair
        const hashedKeys = await Promise.all(keys.map(async key => ({
            activation_key: await hash(key, 10), // Hachage sécurisé
            is_used: false
        })));

        const sql = 'INSERT INTO activation_keys (activation_key, is_used) VALUES ?';
        const values = hashedKeys.map(k => [k.activation_key, k.is_used]);

        await db(sql, [values]);
        res.json({ message: 'Clés insérées avec succès' });

    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de l’insertion des clés', error: err });
    }
}

export async function activateKey(req, res) {
    try {
        const { key } = req.body;
        const [keys] = await db('SELECT * FROM activation_keys WHERE is_used = FALSE');

        for (const row of keys) {
            if (await compare(key, row.activation_key)) {
                const now = new Date();
                const expiresAt = new Date();
                expiresAt.setMonth(expiresAt.getMonth() + 6);

                await db('UPDATE activation_keys SET is_used = TRUE, activated_at = ?, expires_at = ? WHERE id = ?', 
                    [now, expiresAt, row.id]);

                return res.json({ message: 'Activation réussie', expiresAt });
            }
        }
        res.status(400).json({ message: 'Clé invalide ou déjà utilisée' });

    } catch (err) {
        res.status(500).json({ message: 'Erreur d’activation', error: err });
    }
}
