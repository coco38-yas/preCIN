// backend/controllers/agentController.js
import { db } from '../index.js'; // Assurez-vous d'avoir un fichier de connexion à la BDD exportant "db"

// Création d'un agent
export const createAgent = (req, res, next) => {
  // On attend que le payload contienne { noms, commune_id }
  const { noms, commune_id } = req.body;
  const sql = "INSERT INTO agent_chef (noms, commune_id) VALUES (?, ?)";
  db.query(sql, [noms, commune_id], (err, results) => {
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

// Récupérer l'agent/chef correspondant à une commune
export const getAgentByCommune = (req, res, next) => {
  const { commune } = req.query;
  if (!commune) {
    return res.status(400).json({ message: "Le paramètre 'commune' est requis" });
  }
  // Récupérer uniquement le champ "noms" pour l'agent associé à la commune
  const sql = "SELECT noms FROM agent_chef WHERE commune_id = ? LIMIT 1";
  db.query(sql, [commune], (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération de l'agent/chef :", err);
      return next(err);
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Aucun agent/chef trouvé pour cette commune" });
    }
    res.json(results[0]); // Renvoie un objet avec la clé "noms"
  });
};

// Mettre à jour un agent
export const updateAgent = (req, res, next) => {
  const { noms, commune_id } = req.body;
  const { id } = req.params;

  if (!noms || !commune_id || !id) {
    return res.status(400).json({ message: "Tous les champs sont requis." });
  }

  const checkCommuneSql = "SELECT id FROM communes WHERE id = ?";
  db.query(checkCommuneSql, [commune_id], (err, results) => {
    if (err) {
      console.error("Erreur lors de la vérification de la commune:", err);
      return res.status(500).json({ message: "Erreur interne du serveur." });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Commune non trouvée." });
    }

    const updateSql = "UPDATE agent_chef SET noms = ?, commune_id = ? WHERE id = ?";
    db.query(updateSql, [noms, commune_id, id], (err, results) => {
      if (err) {
        console.error("Erreur lors de la mise à jour de l'agent:", err);
        return res.status(500).json({ message: "Erreur interne du serveur." });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Agent non trouvé." });
      }
      res.json({ message: "Agent mis à jour avec succès" });
    });
  });
};

// Récupérer un agent par son id
export const getAgentById = (req, res, next) => {
  const { id } = req.params;
  const sql = "SELECT * FROM agent_chef WHERE id = ?";
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération de l'agent :", err);
      return next(err);
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Agent non trouvé." });
    }
    res.json(results[0]);
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
