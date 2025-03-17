// server/controllers/cardsController.js
import {db} from '../index.js';

export function createCin(req, res, next) {
    //On a besoin de recuperer les variables envoyer par l'élément "form"
    const imagePath = req.file.filename
    const {agent, user, commune, nom, prenoms, numSerieOriginal, numSerieDelivre, dateAjout, dateDelivre, carteType} = req.body
    //Creation de requête SQL pour insertion des utilisateur dans la base de donnée pour la table Users
    const SQL = 'INSERT INTO commune_i (agent_chef_id, user_id, commune_id, nom, prenom, num_serie_origine, num_serie_delivre, date_ajout, date_delivre, image_carte, carte_type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'  
    //Query pour executer le requête sql des deux etats 
    db.query(SQL, [agent, user, commune, nom, prenoms, numSerieOriginal, numSerieDelivre, dateAjout, dateDelivre,imagePath, carteType], (err, results) => {
        if (err) return next(err);
    res.status(201).json({ message: "Carte créée avec succès.", id: results.insertId });
    })

}

export function getCin(req, res) {
        const sql = " SELECT * FROM commune_i";
        db.query(sql, (err, results) => {
            if (err) return res.json({ Message: "Erreur inside server!!" });
            return res.json(results);
        })
    
    }

export function getCindById(req, res, next) {
  const sql = 'SELECT * FROM commune_i WHERE id = ?';
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return next(err);
    if (results.length === 0) return res.status(404).json({ message: "Carte non trouvée." });
    res.json({ data: results[0] });
  });
}

export function updateCin(req, res, next) {
  const { agent, user, commune, nom, prenoms, numSerieOriginal, numSerieDelivre, dateAjout, dateDelivre, carteType } = req.body;

  // Construire l'objet de mise à jour
  const updateData = {
    agent_chef_id: agent,
    user_id: user,
    commune_id: commune,
    nom: nom,
    prenom: prenoms,
    num_serie_origine: numSerieOriginal,
    num_serie_delivre: numSerieDelivre,
    date_ajout: dateAjout,
    date_delivre: dateDelivre,
    carte_type: carteType,
  };

  // Si une image est fournie, ajouter l'image dans updateData
  if (req.file) {
    updateData.image_carte = req.file.filename;
  }

  // Construire la requête SQL dynamiquement
  let sql = "UPDATE commune_i SET ";
  const keys = Object.keys(updateData);
  const values = [];
  const sets = keys.map(key => {
    values.push(updateData[key]);
    return `${key} = ?`;
  });
  sql += sets.join(", ");
  sql += " WHERE id = ?";
  values.push(req.params.id);

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error("Erreur lors de la mise à jour :", err);
      return next(err);
    }
    res.json({ message: "Carte mise à jour avec succès." });
  });
}





// export function updateCin(req, res, next) {
//   const values = {agent, user, commune, nom, prenoms, numSerieOriginal, numSerieDelivre, dateAjout, dateDelivre, carteType} = req.body;
//   const sql = `UPDATE commune_i SET * WHERE id = ?`;
//   db.query(sql, values, (err, results) => {
//     if (err) return next(err);
//     res.json({ message: "Carte mise à jour avec succès." });
//   });
// }

export function deleteCin(req, res, next) {
  const sql = 'DELETE FROM commune_i WHERE id = ?';
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return next(err);
    res.json({ message: "Carte supprimée avec succès." });
  });
}
