
import {db} from '../index.js'; // Assurez-vous d'avoir un fichier de connexion à la BDD exportant "db"

// Création d'une commune
export const createCom =  (req, res) => {
  //On a besoin de recuperer les variables envoyer par l'élément "form"
  const sentCommunes = req.body.Communes
  const sentRegion = req.body.region_id
  const sentDistrict = req.body.district_id
  const SQL = 'INSERT INTO communes (name, region_id, district_id) VALUES (?, ?, ?)'
  const Values = [sentCommunes, sentDistrict, sentRegion]
  db.query(SQL, Values, (err, results) => {
      if (err) {
          res.send(err)
      }
      else {
          console.log('Commune inséré avec succès')
          res.send({ message: 'COMMUNE ajoutée' })
      }
  })
}

// Récupérer tous les communes
export const getComs  = (req, res, next) => {
  const sql = "SELECT * FROM communes";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des agents:", err);
      return next(err);
    }
    res.json(results);
  });
};

// Mettre à jour un com
export const updateCom = (req, res, next) => {
  const sentCommunes = req.body.Communes
  const sentRegion = req.body.region_id
  const sentDistrict = req.body.district_id
  const { id } = req.params;
  const sql = "UPDATE communes SET name = ?, region_id = ?, district_id = ? WHERE id = ?";
  db.query(sql, [sentDistrict, sentRegion, sentCommunes, id], (err, results) => {
    if (err) {
      console.error("Erreur lors de la mise à jour de la commune:", err);
      return next(err);
    }
    res.json({ message: "Commune mis à jour avec succès" });
  });
};

// Supprimer un agent
export const deleteCom = (req, res, next) => {
  const { id } = req.params;
  const sql = "DELETE FROM communes WHERE id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Erreur lors de la suppression de l'agent:", err);
      return next(err);
    }
    res.json({ message: "Agent supprimé avec succès" });
  });
};
