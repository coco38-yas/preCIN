// frontend/src/components/CreatCinForCom.jsx
import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Alert, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import Axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import defaultImage from '../templates/Assets/PRECIN.png'; // Fichier d'image par défaut (assurez-vous qu'il existe)

const CreatCinForCom = () => {
  const { id } = useParams(); // Mode édition si id est présent
  const navigate = useNavigate();

  // État initial pour les champs du formulaire
  const [formData, setFormData] = useState({
    agent: "",
    user: "",
    commune: "",
    nom: "",
    prenoms: "",
    numSerieOriginal: "",
    numSerieDelivre: "",
    dateAjout: "",
    dateDelivre: "",
    image: "", // Contiendra le nom de l'image enregistrée
    carteType: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState('');

  // Charger les données en mode édition
  useEffect(() => {
    if (id) {
      Axios.get(`http://localhost:3000/api/creatcinforcom/${id}`)
        .then(res => {
          const data = res.data.data;
          setFormData({
            nom: data.nom || "",
            prenoms: data.prenom || "",
            agent: data.agent_chef_id ? data.agent_chef_id.toString() : "",
            user: data.user_id ? data.user_id.toString() : "",
            commune: data.commune_id ? data.commune_id.toString() : "",
            numSerieOriginal: formatNumeroSerieOriginal(data.num_serie_origine) || "",
            numSerieDelivre: formatNumeroSerie(data.num_serie_delivre) || "", //FORMATAGE ICI
            dateAjout: data.dateAjout ? new Date(data.dateAjout).toISOString().split('T')[0] : "",
            dateDelivre: data.dateDelivre ? new Date(data.dateDelivre).toISOString().split('T')[0] : "",
            carteType: data.carteType ? data.carteType.toLowerCase() : "",
            image: data.image_carte || "",
          });
        })
        .catch(err => {
          setMessage("Erreur lors du chargement des données.");
          console.error(err);
        });
    }
  }, [id]);

  // Gestion des changements dans le formulaire
  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData(prev => ({ ...prev, [name]: value }));
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Si le champ modifié est `numSerieOriginal`, on applique une validation
    if (name === "numSerieOriginal") {
      // Vérifier que la valeur contient **7 chiffres et 1 lettre** au maximum
      if (!/^\d{0,7}[A-Za-z]?$/.test(value)) return;
    }

    let newValue = value;

    //  Validation stricte pour `numSerieDelivre`
    if (name === "numSerieDelivre") {
      newValue = value.replace(/\D/g, ""); // Supprimer tout sauf les chiffres
      newValue = newValue.slice(0, 12); // Limiter à 12 chiffres
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };


  // Gestion de la sélection du fichier image
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  // Lors de la soumission, si aucune image n'est sélectionnée, on envoie "default_carte.png"
  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = new FormData();
    // Ajouter toutes les clés sauf "image"
    for (const key in formData) {
      if (key !== 'image') {
        dataToSend.append(key, formData[key]);
      }
    }
    // Ajouter l'image : si un fichier est sélectionné, on l'envoie, sinon on envoie le nom de l'image par défaut
    if (imageFile) {
      dataToSend.append('image', imageFile);
    } else {
      dataToSend.append('image', defaultImage); // Valeur par défaut
    }

    try {
      if (id) {
        // Mode édition
        await Axios.put(`http://localhost:3000/api/creatcinforcom/${id}`, dataToSend);
        setMessage("Carte mise à jour avec succès.");
      } else {
        // Mode création
        await Axios.post('http://localhost:3000/api/creatcinforcom', dataToSend);
        setMessage("Carte créée avec succès.");
      }
      navigate('/trace');
    } catch (error) {
      setMessage(error.response?.data.message || "Erreur lors de la soumission.");
      console.error(error);
    }
  };

  // Récupérer les données pour le Select des communes
  const [communesData, setCommunesData] = useState([]);
  useEffect(() => {
    Axios.get('http://localhost:3000/api/communes')
      .then(res => {
        const communesList = res.data.data || res.data;
        setCommunesData(communesList);
      })
      .catch(err => console.error("Erreur lors de la récupération des communes :", err));
  }, []);

  // Récupérer les données pour le Select des agents/chefs
  const [agentChef, setAgentChef] = useState([]);
  useEffect(() => {
    Axios.get('http://localhost:3000/agentregistre')
      .then(res => setAgentChef(res.data))
      .catch(err => console.log(err));
  }, []);

  // Récupérer les données pour le Select des utilisateurs
  const [datas, setDatas] = useState([]);
  useEffect(() => {
    Axios.get('http://localhost:3000/inscription')
      .then(res => setDatas(res.data))
      .catch(err => console.log(err));
  }, []);

  // Prévisualisation de l'image :
  // Si un fichier est sélectionné, affiche son preview,
  // sinon, si en mode édition et une image existe, affiche l'image enregistrée,
  // sinon, affiche l'image par défaut.
  const imagePreview = imageFile
    ? URL.createObjectURL(imageFile)
    : formData.image
      ? `http://localhost:3000/Uploads/${formData.image}`
      : defaultImage;

  // const formatNumeroSerie = (num) => {
  //   if (!num) return ""; // Gère les cas undefined/null
  //   const strNum = String(num); // Convertit en string au cas où c'est un nombre
  //   return strNum.replace(/(\d{3})(?=\d)/g, "$1 ").trim();
  // };

  const formatNumeroSerie = (num) => {
    if (!num) return "";
    
    const cleanedNum = num.replace(/\D/g, "").slice(0, 12); // Enlever tout sauf chiffres et limiter à 12
    return cleanedNum.match(/.{1,3}/g)?.join(" ") || ""; // Regrouper par 3 chiffres
  };
  

  const isValidUser = datas.some(user => user.id.toString() === formData.user);

  const formatNumeroSerieOriginal = (num) => {
    if (!num) return "";

    // Vérifier si le format est valide : exactement 7 chiffres suivis d'une lettre
    const match = num.match(/^(\d{7})([A-Za-z])$/);
    if (match) {
      return `${match[1]} ${match[2]}`; // Séparer les 7 chiffres et la lettre
    }

    return num; // Si le format est incorrect, renvoyer tel quel
  };


  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, background: 'rgb(216, 255, 243)', padding: '14px' }}>
      {message && <Alert severity="info">{message}</Alert>}

      {/* Prévisualisation de l'image */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
        <img
          id="textfield"
          src={imagePreview}
          alt="Prévisualisation"
          style={{ width: '1000px', height: '200px', objectFit: 'contain', border: '1px solid #ccc', borderRadius: '8px' }}
        />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ display: 'inline-block', width: '500px', padding: '6px' }}>
          <InputLabel id="agent-label">Agent/Chef Responsable</InputLabel>
          <Select id="textfield"
            name="agent"
            value={formData.agent}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
            labelId="agent-label"
          >
            {agentChef.map(({ id, noms }, index) => (
              <MenuItem key={index} value={id.toString()}>
                {noms}
              </MenuItem>
            ))}
          </Select>

          <InputLabel id="user-label">Utilisateur</InputLabel>

          <Select
            id="textfield"
            name="user"
            value={isValidUser ? formData.user : ""}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
            labelId="user-label"
          >
            {datas.map(({ id, username }) => (
              <MenuItem key={id} value={id.toString()}>
                {username}
              </MenuItem>
            ))}
          </Select>



          <InputLabel id="commune-label">Nom de la Commune assignée</InputLabel>
          <Select
            id="textfield"
            name="commune"
            value={formData.commune || ""}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
            labelId="commune-label"
          >
            {communesData.map(({ id, name }, index) => (
              <MenuItem key={index} value={id.toString()}>
                {name}
              </MenuItem>
            ))}
          </Select>

          <TextField
            id="textfield"
            label="Nom"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            id="textfield"
            label="Prénoms"
            name="prenoms"
            value={formData.prenoms}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        </Box>

        <Box sx={{ display: 'inline-block', width: '500px', padding: '6px' }}>

          <TextField
            id="textfield"
            label="Numéro de Série Original (7 chiffres + 1 lettre)"
            name="numSerieOriginal"
            value={formatNumeroSerieOriginal(formData.numSerieOriginal)}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
          />

          {/* <TextField
            id="textfield"
            label="Numéro de Série Délivrée (XXX-XXX-XXX-XXX)"
            name="numSerieDelivre"
            value={formData.numSerieDelivre}
            onChange={handleChange}
            fullWidth
            margin="normal"
          /> */}
          <TextField
            id="textfield"
            label="Numéro de Série Délivrée (XXX XXX XXX XXX)"
            name="numSerieDelivre"
            value={formatNumeroSerie(formData.numSerieDelivre)}
            onChange={(e) => {
              // Supprime les espaces pour stocker proprement dans formData
              const rawValue = e.target.value.replace(/\s+/g, '');
              setFormData(prev => ({ ...prev, numSerieDelivre: rawValue }));
            }}
            fullWidth
            margin="normal"
          />


          <TextField
            id="textfield"
            label="Date d'Ajout"
            name="dateAjout"
            type="date"
            value={formData.dateAjout}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            id="textfield"
            label="Date de Délivrance"
            name="dateDelivre"
            type="date"
            value={formData.dateDelivre}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            id="textfield"
            label="Type de Carte"
            name="carteType"
            value={formData.carteType}
            onChange={handleChange}
            select
            fullWidth
            margin="normal"
          >
            <MenuItem value="primata">Primata</MenuItem>
            <MenuItem value="duplicata">Duplicata</MenuItem>
            <MenuItem value="ratee">Ratée</MenuItem>
          </TextField>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
        <Button variant="contained" component="label" sx={{ mt: 2 }}>
          {imageFile ? "Changer l'image" : "Ajouter une image"}
          <input type="file" name="image" hidden onChange={handleFileChange} />
        </Button>
        <Button variant="contained" type="submit" sx={{ mt: 2, ml: 2 }}>
          {id ? "Mettre à jour" : "Créer"}
        </Button>
      </Box>
    </Box>
  );
};

export default CreatCinForCom;
