import React, { useState, useEffect } from 'react'

import '../../App.css'
import { Link } from 'react-router-dom'
import Axios from 'axios'


import fond from '../../LoginAssets/green-staircase.webp'
import logo from '../../LoginAssets/logoPrefet.png'
import { useNavigate } from 'react-router-dom'

const InscriptionUsers  = () => {
//UseState pour maintenir les entrées d'inputs
const [data, setData] = useState([]); // Liste des utilisateurs
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

const [email, setEmail] = useState('')
const [username, setUsername] = useState('')
const [password, setPassword] = useState('')

// Etat pour le champ de validation administrateur
  const [adminValidation, setAdminValidation] = useState('');
  
  const navigateTo = useNavigate();

  // Mot de passe administrateur attendu (à vérifier côté serveur pour plus de sécurité)
  const expectedAdminPassword = '__precin__';

  // Fonction pour charger les utilisateurs
  const fetchUsers = () => {
    setLoading(true);
    Axios.get('http://localhost:3000/inscription')
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Erreur lors du chargement des Utilisateurs.");
        setLoading(false);
      });
  };
    // Charger les utilisateurs au montage du composant
    useEffect(() => {
      fetchUsers();
    }, []);
  // Fonction de création d'utilisateur avec vérification du mot de passe admin
  const createUser = (e) => {
    e.preventDefault();
    if(adminValidation !== expectedAdminPassword) {
      alert("Le mot de passe administrateur est incorrect.");
      return;
    }
    Axios.post('http://localhost:3000/inscription', {
      Email: email,
      UserName: username,
      Password: password
    }).then(() => {
      console.log("Utilisateur a été créé");
       // Rafraîchir la liste
      navigateTo('/users/userlist');
      

    }).catch((err) => {
      console.error(err);
    });
  };

  return (
    <div className="inscriptionPage2 flex">
      <div className="container2 flex">

        <div className="formDiv flex">
          <div className="headerDiv">
            <img src={logo} alt="logo prefecture" />
            <h3>Nous allons vous Inscrire!</h3>
          </div>

          <form action="" className='form grid'>
            {/* <span className='showMessage'></span> */}
            <div className="inputDiv">
              <label htmlFor="email">Adresse Email</label>
              <div className="input flex">
                <input type="email" id='email' placeholder='Entrer l Email' onChange={(event)=>{
                  setEmail(event.target.value)
                }}/>
              </div>
            </div>
            <div className="inputDiv">
              <label htmlFor="username">Nouveau nom d'Utilisateur</label>
              <div className="input flex">
                <input type="text" id='username' placeholder="Entrer le nom d'Utilisateur" onChange={(event)=>{
                  setUsername(event.target.value)
                }}/>
              </div>
            </div>

            <div className="inputDiv">
              <label htmlFor="password">Nouveau Mot de passe</label>
              <div className="input flex">
                <input type="password" id='password' placeholder='Entrer le mot de passe' onChange={(event)=>{
                  setPassword(event.target.value)
                }}/>
              </div>
            </div>
           {/* Champ de validation administrateur */}
           <div className="inputDiv">
              <label htmlFor="adminValidation">Mot de passe admin</label>
              <div className="input flex">
                <input 
                  type="password" 
                  id='adminValidation' 
                  placeholder='Entrer le mot de passe admin' 
                  onChange={(event) => setAdminValidation(event.target.value)}
                  required
                />
              </div>
            </div>
            <button type='submit' id="btnLogin" className='flex' onClick={createUser}>
              <span>S'inscrire</span> 
                          
            </button>



          </form>
        </div>

      </div>
    </div>
      
 

  )
}

export default InscriptionUsers