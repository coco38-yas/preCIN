// frontend/src/components/CreatCinForCom.jsx
import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  TextField,
  Button,
  Alert,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from '@mui/material';
import Axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import defaultImage from '../templates/Assets/PRECIN.png';
import UserContext from "../../contexts/UserContext";

const CreatCinForCom = ({ selectedCommune }) => {
  const { id } = useParams(); // Mode édition si id présent
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);

  // Etat initial pour le formulaire
  const [formData, setFormData] = useState({
    agent_chef_id: "",    // ID de l'agent/chef (doit être non nul)
    // agent_name: "",       // Pour affichage
    user: currentUser ? currentUser.id : "",
    commune: "",          // ID de la commune
    nom: "",
    prenoms: "",
    sexe: "",
    numSerieOriginal: "",
    numSerieDelivre: "",
    dateAjout: "",
    dateDelivre: "",
    image: "",            // Nom de l'image enregistrée
    carteType: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState('');

  // Etats pour stocker les données de l'API
  const [communesData, setCommunesData] = useState([]);
  const [agentChef, setAgentChef] = useState([]);

  // Récupération des communes
  useEffect(() => {
    Axios.get('http://localhost:3000/api/communes')
      .then(res => {
        const data = res.data.data || res.data;
        setCommunesData(data);
      })
      .catch(err => console.error("Erreur lors de la récupération des communes :", err));
  }, []);

  // Récupération des agents/chefs
  useEffect(() => {
    Axios.get('http://localhost:3000/agentregistre')
      .then(res => {
        setAgentChef(res.data);
      })
      .catch(err => console.error("Erreur lors de la récupération des agents/chefs :", err));
  }, []);

  // Mise à jour du champ "commune" avec l'ID de la commune sélectionnée (si présente dans communesData)
  useEffect(() => {
    if (selectedCommune && communesData.length > 0) {
      const foundCommune = communesData.find(comm => comm.id.toString() === selectedCommune.id.toString());
      setFormData(prev => ({
        ...prev,
        commune: foundCommune ? foundCommune.id.toString() : "",
      }));
    }
  }, [selectedCommune, communesData]);

  // Recherche de l'agent dont le commune_id correspond à la commune sélectionnée
  useEffect(() => {
    if (selectedCommune && agentChef.length > 0) {
      const agentFound = agentChef.find(agent =>
        agent.commune_id && agent.commune_id.toString() === selectedCommune.id.toString()
      );
      if (agentFound) {
        setFormData(prev => ({
          ...prev,
          agent_chef_id: agentFound.id.toString(), // Assure que l'ID n'est pas null
          // agent_name: agentFound.noms || "",
        }));
      } else {
        // Aucun agent trouvé pour la commune sélectionnée
        setFormData(prev => ({
          ...prev,
          agent_chef_id: "",
          // agent_name: "",
        }));
      }
    }
  }, [selectedCommune, agentChef]);

  // Mettre à jour le champ user depuis currentUser
  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        user: currentUser.id,
      }));
    }
  }, [currentUser]);

  // Si en mode édition, pré-remplir le formulaire avec les données existantes
  useEffect(() => {
    if (id) {
      Axios.get(`http://localhost:3000/api/creatcinforcom/${id}`)
        .then(res => {
          const data = res.data.data;
          const isValidDate = (dateStr) => {
            const date = new Date(dateStr);
            return !isNaN(date.getTime()) && date.getTime() !== new Date(0).getTime();
          };
          setFormData({
            agent_chef_id: data.agent_chef_id ? data.agent_chef_id.toString() : "",
            // agent_name: "", // Vous pouvez ajouter une logique pour récupérer le nom de l'agent si besoin
            user: data.user_id ? data.user_id.toString() : "",
            commune: data.commune_id ? data.commune_id.toString() : "",
            nom: data.nom || "",
            prenoms: data.prenom || "",
            sexe: data.sexe ? data.sexe.toLowerCase() : "",
            numSerieOriginal: data.num_serie_origine || "",
            numSerieDelivre: data.num_serie_delivre || "",
            dateAjout: data.date_ajout ? new Date(data.date_ajout).toISOString().split('T')[0] : "",
            dateDelivre: data.date_delivre && isValidDate(data.date_delivre)
              ? new Date(data.date_delivre).toISOString().split('T')[0]
              : "",
            carteType: data.carte_type ? data.carte_type.toLowerCase() : "",
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
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Validation pour numSerieOriginal : 7 chiffres et 1 lettre maximum
    if (name === "numSerieOriginal" && !/^\d{0,7}[A-Za-z]?$/.test(value)) return;
    let newValue = value;
    // Pour numSerieDelivre, supprimer tout sauf les chiffres et limiter la longueur
    if (name === "numSerieDelivre") {
      newValue = value.replace(/\D/g, "").slice(0, 15);
    }
    setFormData(prev => ({ ...prev, [name]: newValue }));
  };

  // Gestion de la sélection d'image
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleReturnToList = () => {
    const savedCommune = sessionStorage.getItem("selectedCommune");
    const communeToSend = selectedCommune || (savedCommune ? JSON.parse(savedCommune) : null);
    navigate('/trace', { state: { selectedCommune: communeToSend, tabIndex: 0 } });

  }
  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Vérification finale : agent_chef_id doit être non nul
    if (!formData.agent_chef_id) {
      setMessage("Erreur : Aucun agent/chef associé n'a été trouvé pour la commune sélectionnée.");
      return;
    }
    const dataToSend = new FormData();
    for (const key in formData) {
      if (key !== 'image') {
        dataToSend.append(key, formData[key]);
      }
    }
    if (imageFile) {
      dataToSend.append('image', imageFile);
    } else {
      dataToSend.append('image', defaultImage);
    }
    try {
      if (id) {
        await Axios.put(`http://localhost:3000/api/creatcinforcom/${id}`, dataToSend);
        setMessage("Carte mise à jour avec succès.");
        // Vérifier si tous les champs sont remplis
      const allFields = [
        formData.nom,
        formData.prenoms,
        formData.sexe,
        formData.numSerieOriginal,
        formData.numSerieDelivre,
        formData.dateAjout,
        formData.dateDelivre,
        formData.carteType,
      ];
      const allFilled = allFields.filter(Boolean).length === allFields.length;
      if (allFilled) {
        // Stocker l'ID de la carte mise à jour pour activer l'animation dans ListCin
        sessionStorage.setItem("animateUpdatedCard", id);
      }
      } else {
        await Axios.post('http://localhost:3000/api/creatcinforcom', dataToSend);
        setMessage("Carte créée avec succès.");
      }
      // Redirection unique après soumission vers l'onglet liste
      handleReturnToList();
    } catch (error) {
      setMessage(error.response?.data.message || "Erreur lors de la soumission.");
      console.error(error);
    }

  };
 
  // Prévisualisation de l'image
  const imagePreview = imageFile
    ? URL.createObjectURL(imageFile)
    : formData.image
      ? `http://localhost:3000/Uploads/${formData.image}`
      : defaultImage;

  // Fonctions de formatage pour les numéros de série
  const formatNumeroSerie = (num) => {
    if (!num) return "";
    const cleanedNum = num.replace(/\D/g, "").slice(0, 12);
    return cleanedNum.match(/.{1,3}/g)?.join(" ") || "";
  };

  const formatNumeroSerieOriginal = (num) => {
    if (!num) return "";
    const match = num.match(/^(\d{7})([A-Za-z])$/);
    return match ? `${match[1]} ${match[2]}` : num;
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, padding: '14px' }}>
      {message && <Alert severity="info">{message}</Alert>}



      <Box sx={{ display: 'flex', justifyContent: 'center', borderRadius: '10px', padding: '15px', backdropFilter: 'blur(10px)', background: 'linear-gradient(to left,rgba(3, 12, 107, 0.63), rgba(3, 112, 3, 0.51))' }}>
        {/* Colonne gauche */}
        <Box sx={{ display: 'inline-block', width: '400px', padding: '6px' }}>

          <FormControl fullWidth margin="normal">
            <TextField
              name="agent"
              id="textfield"
              label="Agent/Chef Responsable"
              value={formData.agent_chef_id || ""}
              onChange={handleChange}
              // style={{color:'white'}}
              required
              select

            >
              {agentChef.map(({ id, noms }) => (
                <MenuItem key={id} value={id.toString()}>
                  {noms}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>

          <TextField
            label="Utilisateur actuel"
            name="user"
            id="textfield"
            value={currentUser?.username || ""}
            fullWidth
            margin="normal"
            InputProps={{ readOnly: true }}
          />


          <FormControl fullWidth margin="normal">
            <TextField
              name="commune"
              id="textfield"
              label='Commune associée'
              value={communesData.find(comm => comm.id.toString() === formData.commune) ? formData.commune : ""}
              onChange={handleChange}
              required
              select

            >
              {communesData.length === 0 ? (
                <MenuItem value="">Chargement...</MenuItem>
              ) : (
                communesData.map(({ id, name }) => (
                  <MenuItem key={id} value={id.toString()}>
                    {name}
                  </MenuItem>
                ))
              )}
            </TextField>
          </FormControl>

          <TextField
            label="Nom"
            name="nom"
            id="textfield"
            value={formData.nom}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Prénoms"
            name="prenoms"
            id="textfield"
            value={formData.prenoms}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Sexe"
            name="sexe"
            id="textfield"
            value={formData.sexe}
            onChange={handleChange}
            select
            fullWidth
            margin="normal"
          >
            <MenuItem value="femme">Femme</MenuItem>
            <MenuItem value="homme">Homme</MenuItem>
          </TextField>
        </Box>

        {/* Colonne droite */}
        <Box sx={{ display: 'inline-block', width: '400px', padding: '6px' }}>
          <TextField
            label="Numéro de Série Original (7 chiffres + 1 lettre)"
            name="numSerieOriginal"
            id="textfield"
            value={formatNumeroSerieOriginal(formData.numSerieOriginal)}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            label="Numéro de Série Délivrée (XXX XXX XXX XXX)"
            name="numSerieDelivre"
            id="textfield"
            value={formatNumeroSerie(formData.numSerieDelivre)}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/\s+/g, '');
              setFormData(prev => ({ ...prev, numSerieDelivre: rawValue }));
            }}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Date d'Ajout"
            name="dateAjout"
            type="date"
            id="textfield"
            value={formData.dateAjout}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Date de Délivrance"
            name="dateDelivre"
            type="date"
            id="textfield"
            value={formData.dateDelivre}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Type de Carte"
            name="carteType"
            id="textfield"
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
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
            <Button variant="contained" style={{ marginBottom: "20px" }} component="label" sx={{ mt: 2 }}>
              {imageFile ? "Changer l'image" : "Ajouter une image"}
              <input type="file" name="image" hidden onChange={handleFileChange} />
            </Button>
            <Button variant="contained" type="submit" style={{ marginTop: "20px", marginBottom: "20px" }} sx={{ mt: 2, ml: 2, }}>
              {id ? "Mettre à jour" : "Créer"}
            </Button>
          </Box>
        </Box>
        {/* Prévisualisation de l'image */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2, justifyContent: "center", padding: '8px' }}>
          <img
            id="textfield"
            src={imagePreview}
            alt="Prévisualisation"
            style={{ width: '500px', height: '200px', objectFit: 'contain', border: '1px solid #ccc', borderRadius: '8px' }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>

            <Button style={{color:"#fff"}} variant="contained" onClick={handleReturnToList}>
              Retour à la liste des cartes
            </Button>
          </Box>
        </Box>
        {/* Bouton de retour manuel (optionnel) */}

      </Box>





    </Box>
  );
};

export default CreatCinForCom;
