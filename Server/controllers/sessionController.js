// backend/controllers/agentController.js
import {db} from '../index.js'; // Assurez-vous d'avoir un fichier de connexion à la BDD exportant "db"

// Création d'un agent
export const createAgent = (req, res, next) => {
  const { nomAgent, communeAgent } = req.body;
  const sql = "INSERT INTO agent_chef (noms, communes_id) VALUES (?, ?)";
  db.query(sql, [nomAgent, communeAgent], (err, results) => {
    if (err) {
      console.error("Erreur lors de la création de l'agent:", err);
      return next(err);
    }
    res.status(201).json({ message: "Agent créé avec succès", id: results.insertId });
  });
};

// Récupérer tous les agents
export const getAgents = (req, res, next) => {
  const sql = "SELECT * FROM agent_chef";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des agents:", err);
      return next(err);
    }
    res.json(results);
  });
};

// Mettre à jour un agent
export const updateAgent = (req, res, next) => {
  const { nomAgent, communeAgent } = req.body;
  const { id } = req.params;
  const sql = "UPDATE agent_chef SET noms = ?, communes_id = ? WHERE id = ?";
  db.query(sql, [nomAgent, communeAgent, id], (err, results) => {
    if (err) {
      console.error("Erreur lors de la mise à jour de l'agent:", err);
      return next(err);
    }
    res.json({ message: "Agent mis à jour avec succès" });
  });
};

// Supprimer un agent
export const deleteAgent = (req, res, next) => {
  const { id } = req.params;
  const sql = "DELETE FROM agent_chef WHERE id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Erreur lors de la suppression de l'agent:", err);
      return next(err);
    }
    res.json({ message: "Agent supprimé avec succès" });
  });
};
