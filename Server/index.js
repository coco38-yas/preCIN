import express from 'express'

import mysql from 'mysql'
import cors from 'cors'
import multer from 'multer'
import path from 'path'
import bcrypt from 'bcrypt'
import router from './routes/cin.js'
import dotenv from 'dotenv';
dotenv.config();

const app = express()
app.use(express.json())
app.use(cors({
    origin:["http://localhost:5173"],
    methods:['GET', 'POST', 'PUT','DELETE'],
    credentials: true
}))

app.use('/uploads', express.static('uploads')); // pour servir les images

// Définition de la route GET /
app.get("/", (req, res) => {
    res.send("Bienvenue sur le serveur preCIN !");
});

// const port = 3000
//Faire marcher le server

// Utilisation de la variable d'environnement PORT, avec une valeur par défaut
const PORT = process.env.PORT || 3000;

// On parse l'URL de connexion
const dbUrl = new URL(process.env.DATABASE_URL);

app.listen(PORT, () => {
    console.log(`Server est lancé au port: ${PORT}`);
  });
// Création de la connexion avec les valeurs extraites
export const db = mysql.createConnection({
    host: dbUrl.hostname,                         // 'localhost'
    user: dbUrl.username,                         // 'root'
    password: dbUrl.password,                     // '' (vide s'il n'y a pas de mot de passe)
    database: dbUrl.pathname.replace('/', '')     // 'precin_db'
  });

// Route d'inscription
app.post('/inscription', (req, res) => {
    const { Email, UserName, Password } = req.body;
    // Vérifier si l'utilisateur existe déjà
    const checkQuery = "SELECT * FROM users WHERE email = ? OR username = ?";
    db.query(checkQuery, [Email, UserName], async (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length > 0) {
        return res.status(400).json({ message: "Utilisateur existe déjà" });
      }
      try {
        // Hacher le mot de passe
        const hashedPassword = await bcrypt.hash(Password, 10);
        const SQL = "INSERT INTO users (email, username, password) VALUES (?, ?, ?)";
        db.query(SQL, [Email, UserName, hashedPassword], (err, results) => {
          if (err) return res.status(500).json({ error: err.message });
          console.log("Utilisateur inséré avec succès");
          res.status(201).json({ message: "Utilisateur ajouté", id: results.insertId });
        });
      } catch (hashErr) {
        res.status(500).json({ error: hashErr.message });
      }
    });
  });
//////////////////////////////////////////////////////////////////////////////
// Route de login
app.post('/login', (req, res) => {
    const { UserName, Password } = req.body;
    const SQL = "SELECT * FROM users WHERE username = ?";
    db.query(SQL, [UserName], async (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) return res.status(404).json({ message: "Utilisateur non trouvé" });
      
      const user = results[0];
      try {
        // Comparer le mot de passe fourni avec le mot de passe haché
        const isValid = await bcrypt.compare(Password, user.password);
        if (!isValid) return res.status(401).json({ message: "Mot de passe incorrect" });
        
        // Optionnel : Générer un token JWT ici si besoin, par exemple avec jwt.sign()
        res.status(200).json({ message: "Connexion réussie", user });
      } catch (compErr) {
        res.status(500).json({ error: compErr.message });
      }
    });
  });
  
//////////////////////////ENDPOINT UNE SESSION/////////////////////
// Creation d'un route pour le server afin qu'on puisse enregistrer UNE SESSION

app.post('/session', (req, res) => {
    const sentSession = req.body.Session
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

////////////////////////////ENDPOINT UNE REGION/////////////////////
//Creation d'un route pour le server afin qu'on puisse enregistrer UNE SESSION

app.post('/region', (req, res) => {
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

////////////////////////////ENDPOINT UN DISTRICT/////////////////////
//Creation d'un route pour le server afin qu'on puisse enregistrer UNE SESSION

app.post('/district', (req, res) => {
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


///////////////////////IMAGE UPLOAD/////////////////////
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }

})
const upload = multer({
    storage: storage
})


////////////////////////////////////////////////////////////
app.get('/inscription', (req, res) => {
    const sql = "SELECT * FROM users";
    db.query(sql, (err, result) => {
        if (err) return res.json({ Message: "Erreur inside server!!" });
        return res.json(result);
    })

})

// Route pour récupérer les dernières images (fichier app.js ou routes.js)
app.get('/api/creatcinforcom/latest', (req, res) => {
    // On récupère les 5 derniers enregistrements possédant une image (imagePath non null)
    const query = `
      SELECT id, nom, commune_id, image_carte, date_ajout 
      FROM commune_i 
      WHERE image_carte IS NOT NULL 
      ORDER BY date_ajout DESC 
      LIMIT 10
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ data: results });
    });
});

// Exemple d'endpoint pour le tableau de bord avec agrégation (à personnaliser selon vos besoins)
import communeRoutes from './routes/communeRoutes.js'
import dashboardRoutes from "./routes/dashboardRoutes.js";
import agentRoutes from './routes/agentRoutes.js';
import apiRoutes from './routes/allapi.js'

import activationRoutes  from'./routes/activationRoutes.js';


// Monter le routeur pour la gestion des agents
app.use('/api', activationRoutes);
app.use('/agentregistre', agentRoutes);

app.use('/api/creatcinforcom', router);
app.use('/api/communes', communeRoutes);

app.use('/dashboard', dashboardRoutes);

// app.use('/allapi', apiRoutes); // Toutes les routes sous /api
