import {db} from '../index.js' // Assurez-vous que votre fichier de connexion existe

export const getDashboardStats = (req, res, next) => {
    const { month, year } = req.query;
    const sql = `
      SELECT 
        c.name AS commune,
        MONTH(ci.date_ajout) AS month,
        YEAR(ci.date_ajout) AS year,
        COUNT(*) AS totalCIN,
        SUM(CASE WHEN (ci.num_serie_delivre IS NULL OR ci.num_serie_delivre = '') THEN 1 ELSE 0 END) AS nonAttribues,
        SUM(CASE WHEN ci.carte_type = 'primata' THEN 1 ELSE 0 END) AS totalPrimata,
        SUM(CASE WHEN ci.carte_type = 'duplicata' THEN 1 ELSE 0 END) AS totalDuplicata,
        SUM(CASE WHEN ci.carte_type = 'ratee' THEN 1 ELSE 0 END) AS totalRatee
      FROM commune_i ci
      JOIN communes c ON ci.commune_id = c.id
      WHERE MONTH(ci.date_ajout) = ? AND YEAR(ci.date_ajout) = ?
      GROUP BY c.name, MONTH(ci.date_ajout), YEAR(ci.date_ajout)
    `;
  
    db.query(sql, [month, year], (err, results) => {
      if (err) {
        console.error("Erreur lors du dashboard :", err);
        return res.status(500).json({ error: "Erreur interne du serveur" });
      }
  
      res.json({ data: results }); // <== S'assure que c'est bien dans "data"
    });
  };
  