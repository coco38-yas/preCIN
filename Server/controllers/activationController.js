import { db } from '../index.js'; // Assurez-vous que db est configuré pour votre MySQL
import { randomBytes } from 'crypto';
import bcrypt from 'bcrypt'; // Correction de l'importation
import moment from 'moment'; // Gestion des dates
const EXPIRATION_MONTHS = 6;

// Optionnel : fonction pour générer une clé (pour insertion manuelle ou automatisée)
export async function generateActivationKey() {
    // Exemple de code sous forme XXXX-XXXX-XXXX-XXXX
    return randomBytes(8).toString('hex').toUpperCase().match(/.{1,4}/g).join('-');
};

// Pour hacher une clé (si on souhaite stocker la version hachée)
export async function hashActivationKey(key) {
    const saltRounds = 10;
    return await bcrypt.hash(key, saltRounds);
};

export async function activateKey(req, res) {
    const { key } = req.body;

    if (!key) {
        return res.status(400).json({ success: false, message: "Clé d'activation requise." });
    }

    try {
        // Vérifier si la clé existe et n'a pas été utilisée
        const query = "SELECT * FROM activation_keys WHERE is_used = 0";
        const [rows] = await db.execute(query);

        let validKey = null;
        for (const row of rows) {
            // Vérification des données avant la comparaison
            if (!key || !row.key_hash) {
                return res.status(400).json({ success: false, message: "Clé ou hash invalide." });
            }

            console.log('Hash de la clé :', row.key_hash); // Vérification du hash

            const match = await bcrypt.compare(key, row.key_hash);
            if (match) {
                validKey = row;
                break;
            }
        }

        if (!validKey) {
            return res.status(400).json({ success: false, message: "Clé invalide ou déjà utilisée." });
        }

        // Définir la date d'expiration (6 mois)
        const expirationDate = moment().add(6, 'months').format('YYYY-MM-DD');

        // Mettre à jour la clé comme utilisée
        const updateQuery = "UPDATE activation_keys SET is_used = 1, activated_at = NOW(), expires_at = ? WHERE id = ?";
        await db.execute(updateQuery, [expirationDate, validKey.id]);

        return res.json({ success: true, message: "Activation réussie !", expires_at: expirationDate });

    } catch (error) {
        console.error("Erreur d'activation :", error);
        return res.status(500).json({ success: false, message: "Erreur serveur." });
    }
}


// Optionnel : Route pour ajouter manuellement une liste de clés
export async function addActivationKeys(req, res, next) {
    try {
        const { keys } = req.body; // Un tableau de clés en clair
        if (!keys || !Array.isArray(keys)) {
            return res.status(400).json({ message: "Veuillez fournir un tableau de clés." });
        }

        // Hacher chaque clé avant insertion dans la base de données
        const hashedKeys = await Promise.all(keys.map(async key => {
            const hashedKey = await bcrypt.hash(key, 10);
            return [hashedKey, false, null, null]; // Hachage de la clé avant stockage
        }));

        const sql = 'INSERT INTO activation_keys (key_hash, is_used, activated_at, expires_at) VALUES ?';
        db.query(sql, [hashedKeys], (err, results) => {
            if (err) return next(err);
            res.json({ message: "Clés ajoutées avec succès.", inserted: results.affectedRows });
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'insertion des clés", error });
    }
}
