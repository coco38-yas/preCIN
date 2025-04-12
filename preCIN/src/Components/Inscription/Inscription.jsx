import React, { useState } from 'react';
import '../../App.css';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import fond from '../../LoginAssets/green-staircase.webp';
import logo from '../../LoginAssets/logoPrefet.png';
import { useNavigate } from 'react-router-dom';

const Inscription = () => {
  // Etats pour les entrées utilisateur
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // Etat pour le champ de validation administrateur
  const [adminValidation, setAdminValidation] = useState('');
  
  const navigateTo = useNavigate();

  // Mot de passe administrateur attendu (à vérifier côté serveur pour plus de sécurité)
  const expectedAdminPassword = '__precin__';

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
      navigateTo('/login');
    }).catch((err) => {
      console.error(err);
    });
  };

  return (
    <div className="inscriptionPage flex">
      <div className="container flex">
        <div className="gridVisiteur">
          <img src={fond} alt="bg" />
          <div className="textDiv">
            <h2 className='title'>Créons ensemble une base de données plus performante et efficace</h2>
            <p>Offrons des gestions plus cohérentes et relationnelles</p>
          </div>
          <div className="footerDiv flex">
            <span className="text">Ayant déjà un compte</span>
            <Link to={'/login'}>
              <button id="btn">Me connecter</button>
            </Link>
          </div>
        </div>
        
        <div className="formDiv flex">
          <div className="headerDiv">
            <img src={logo} alt="logo prefecture" />
            <h3>Nous allons vous inscrire!</h3>
          </div>
          <form className='form grid' onSubmit={createUser}>
            <div className="inputDiv">
              <label htmlFor="email">Adresse Email</label>
              <div className="input flex">
                <input 
                  type="email" 
                  id='email' 
                  placeholder="Entrer l'Email" 
                  onChange={(event) => setEmail(event.target.value)} 
                  required
                />
              </div>
            </div>
            <div className="inputDiv">
              <label htmlFor="username">Nouveau nom d'Utilisateur</label>
              <div className="input flex">
                <input 
                  type="text" 
                  id='username' 
                  placeholder="Entrer le nom d'Utilisateur" 
                  onChange={(event) => setUsername(event.target.value)}
                  required
                />
              </div>
            </div>
            <div className="inputDiv">
              <label htmlFor="password">Nouveau Mot de passe</label>
              <div className="input flex">
                <input 
                  type="password" 
                  id='password' 
                  placeholder='Entrer le mot de passe' 
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
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
            <button type='submit' id="btnLogin" className='flex'>
              <span>S'inscrire</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Inscription;
