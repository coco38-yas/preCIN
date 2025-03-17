import { Router } from 'express';
const router = Router();
import {db} from '../index.js';  // Assurez-vous d'avoir une connexion à la base de données

//  1. Récupérer toutes les sessions
router.get('/sessions', async (req, res) => {
  try {
    const sessions = db.query('SELECT * FROM sessions');
    res.json(sessions.rows);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des sessions' });
  }
});

//  2. Ajouter une session
router.post('/sessions', (req, res) => {
  //On a besoin de recuperer les variables envoyer par l'élément "form"
  const sentSession = req.body.Session
  //Creation de requête SQL pour insertion des utilisateur dans la base de donnée pour la table Users
  const SQL = 'INSERT INTO sessions (year) VALUES (?)'
  const Values = [sentSession]
  //Query pour executer le requête sql des deux etats 
  db.query(SQL, Values, (err, results) => {
      if (err) {
          res.send(err)
      }
      else {
          console.log('Session configurée avec succès')
          res.send({ message: 'Session configurée' })
      }
  })
})

//  3. Récupérer toutes les régions
router.get('/regions', async (req, res) => {
  try {
    const regions = db.query('SELECT * FROM regions');
    res.json(regions.rows);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des régions' });
  }
});

//  4. Ajouter une région
router.post('/region', (req, res) => {
  const sentRegion = req.body.Regions
  const SQL = 'INSERT INTO regions (name) VALUES (?)'
  const Values = [sentRegion]
  db.query(SQL, Values, (err, results) => {
      if (err) {
          res.send(err)
      }
      else {
          console.log('Region crée avec succès')
          res.send({ message: 'Region crée aver succès' })
      }
  })
})
//  5. Récupérer tous les districts
router.get('/districts', async (req, res) => {
  try {
    const districts = db.query('SELECT * FROM districts');
    res.json(districts.rows);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des districts' });
  }
});

//  6. Ajouter un district
router.post('/district', (req, res) => {
  //On a besoin de recuperer les variables envoyer par l'élément "form"
  const sentDistrict = req.body.Districts
  const SQL = 'INSERT INTO districts (name) VALUES (?)'
  const Values = [sentDistrict]
  db.query(SQL, Values, (err, results) => {
      if (err) {
          res.send(err)
      }
      else {
          console.log('District crée avec succès')
          res.send({ message: 'District crée avec succès' })
      }
  })
})


export default router;
