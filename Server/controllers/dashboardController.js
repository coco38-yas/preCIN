import { db } from '../index.js' // Assurez-vous que votre fichier de connexion existe

export const getDashboardStats = (req, res, next) => {
  const { month, year } = req.query;
  const sql = `
      SELECT 
        c.name AS commune,
        MONTH(ci.date_ajout) AS month,
        YEAR(ci.date_ajout) AS year,
        COUNT(*) AS totalCIN,
        SUM(CASE WHEN isConfirmed = 1 AND confirmation_date IS NOT NULL THEN 1 ELSE 0 END) AS totalConfirmed,
      SUM(CASE 
            WHEN ( (isConfirmed <> 1 OR isConfirmed IS NULL) 
              AND (confirmation_date IS NULL OR confirmation_date = '')
              AND (nom <> '' AND prenom <> '' AND num_serie_origine <> '' 
                   AND num_serie_delivre <> '' AND carte_type <> ''
                   AND date_ajout IS NOT NULL AND date_delivre IS NOT NULL)
            )
            THEN 1 ELSE 0 END) AS totalCompleteNonConfirmed,
        SUM(CASE WHEN (ci.num_serie_delivre IS NULL OR ci.num_serie_delivre = '') THEN 1 ELSE 0 END) AS nonAttribues,
        SUM(CASE WHEN ci.carte_type = 'primata' THEN 1 ELSE 0 END) AS totalPrimata,
        SUM(CASE WHEN ci.carte_type = 'duplicata' THEN 1 ELSE 0 END) AS totalDuplicata,
        SUM(CASE WHEN ci.carte_type = 'ratee' THEN 1 ELSE 0 END) AS totalRatee,
        SUM(CASE WHEN ci.sexe= 'femme' THEN 1 ELSE 0 END) AS totalFemme,
        SUM(CASE WHEN ci.sexe= 'homme' THEN 1 ELSE 0 END) AS totalHomme
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



// Exemple de fonction pour récupérer les communes
export const getCommunes = (req, res, next) => {
  const sql = `SELECT name FROM communes ORDER BY name ASC`;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des communes :", err);
      return res.status(500).json({ error: "Erreur interne du serveur" });
    }
    // On renvoie un tableau des noms de communes
    const communes = results.map(row => row.name);
    res.json({ data: communes });
  });
};



export const getCommuneYearStats = (req, res, next) => {
  const { commune, year } = req.query;
  // Ici, on utilise une jointure pour filtrer par commune (en fonction de la table communes)
  const sql = `
    SELECT 
      MONTH(ci.date_ajout) AS month,
      COUNT(*) AS totalCIN,
      SUM(CASE WHEN isConfirmed = 1 AND confirmation_date IS NOT NULL THEN 1 ELSE 0 END) AS totalConfirmed,
      SUM(CASE 
            WHEN ( (isConfirmed <> 1 OR isConfirmed IS NULL) 
              AND (confirmation_date IS NULL OR confirmation_date = '')
              AND (nom <> '' AND prenom <> '' AND num_serie_origine <> '' 
                   AND num_serie_delivre <> '' AND carte_type <> ''
                   AND date_ajout IS NOT NULL AND date_delivre IS NOT NULL)
            )
            THEN 1 ELSE 0 END) AS totalCompleteNonConfirmed,
      SUM(CASE WHEN (ci.num_serie_delivre IS NULL OR ci.num_serie_delivre = '') THEN 1 ELSE 0 END) AS nonAttribues,
      SUM(CASE WHEN ci.carte_type = 'primata' THEN 1 ELSE 0 END) AS totalPrimata,
      SUM(CASE WHEN ci.carte_type = 'duplicata' THEN 1 ELSE 0 END) AS totalDuplicata,
      SUM(CASE WHEN ci.carte_type = 'ratee' THEN 1 ELSE 0 END) AS totalRatee,
      SUM(CASE WHEN ci.sexe= 'femme' THEN 1 ELSE 0 END) AS totalFemme,
      SUM(CASE WHEN ci.sexe= 'homme' THEN 1 ELSE 0 END) AS totalHomme
    FROM commune_i ci
    JOIN communes c ON ci.commune_id = c.id
    WHERE c.name = ? AND YEAR(ci.date_ajout) = ?
    GROUP BY MONTH(ci.date_ajout)
    ORDER BY MONTH(ci.date_ajout)
  `;

  db.query(sql, [commune, year], (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des statistiques pour la commune :", err);
      return res.status(500).json({ error: "Erreur interne du serveur" });
    }
    res.json({ data: results });
  });
};
