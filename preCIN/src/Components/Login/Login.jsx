// src/components/Login/Login.jsx
import React, { useState, useContext } from 'react';
import './Login.css';
import '../../App.css';
import { Link, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import logo from '../../LoginAssets/logoPrefet.png';
import fond from '../../LoginAssets/green-staircase.webp';
import UserContext from '../../contexts/UserContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(UserContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const response = await Axios.post('http://localhost:3000/login', {
        UserName: username,
        Password: password,
      });
      // Supposons que la réponse renvoie un objet "user" dans response.data.user
      const user = response.data.user;
      console.log("Connexion réussie:", user);
      localStorage.setItem('user', JSON.stringify(user));
      setCurrentUser(user);
      navigate('/accueil');
    } catch (error) {
      console.error("Erreur lors du login :", error);
      setErrorMessage(
        error.response?.data.message || "Erreur lors de la connexion."
      );
    }
  };

  return (
    <div className="loginPage flex">
      <div className="container flex">
        <div className="gridVisiteur">
          <img src={fond} alt="Background" />
          <div className="textDiv">
            <h2 className="title">
              Créeons ensemble une base de données plus efficace
            </h2>
            <p className="title2">Offrons des gestions plus cohérents et relationnels</p>
          </div>
          <div className="footerDiv flex">
            <span className="text">Besoin de créer un compte?</span>
            <Link to="/inscription">
              <button id="btn">M'inscrire!</button>
            </Link>
          </div>
        </div>

        <div className="formDiv flex" >
          <div className="headerDiv">
            <div className="logo-container">
              <div className="logo-wrapper">
                {/* Face avant avec le logo normal */}
                <div className="logoBack">
                  <img src={logo} alt="Logo Prefecture" />
                </div>
                {/* Face arrière avec un filtre blanc */}
                <div className="logoFront">
                  <img src={logo} alt="Logo Préfecture Blanc" />
                </div>
              </div>
            </div>
            <h3>Heureux de vous revoir !</h3>
          </div>






          <form onSubmit={handleLogin} className="form grid">
            {errorMessage && (
              <div className="errorMessage" style={{ color: 'red', marginBottom: '10px' }}>
                {errorMessage}
              </div>
            )}
            <div className="inputDiv">
              <label htmlFor="username">Nom d'Utilisateur</label>
              <div className="input flex">
                <input
                  type="text"
                  id="username"
                  placeholder="Entrer le nom d'utilisateur"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="inputDiv">
              <label htmlFor="password">Mot de passe</label>
              <div className="input flex">
                <input
                  type="password"
                  id="password"
                  placeholder="Entrer le mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" id="btnLogin" className="flex">
              <span>Login</span>
            </button>
            <span className="forgotPassword">
              Mot de passe oublié ? <a href="#">Cliquez ici</a>
            </span>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
