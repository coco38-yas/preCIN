import React, { useState } from 'react'

import '../../App.css'
import { Link } from 'react-router-dom'
import Axios from 'axios'


import fond from '../../LoginAssets/green-staircase.webp'
import logo from '../../LoginAssets/logoPrefet.png'
import { useNavigate } from 'react-router-dom'

const Inscription  = () => {
//UseState pour maintenir les entrées d'inputs
const [email, setEmail] = useState('')
const [username, setUsername] = useState('')
const [password, setPassword] = useState('')

//Onclick, recuperation des entrées par utilisateur
const createUser = () => {
// Requisition d'Axios pour créer une sorte API qui va connecter au server
  Axios.post('http://localhost:3000/inscription', {
    // creation de variable pour envoyer au server à l'aide du route(qui recevera)
    Email: email,
    UserName: username,
    Password: password
  }).then(()=>{
    console.log("Utilisateur a été crée")
  })
  navigateTo('/login')  
}
const navigateTo = useNavigate()


  return (
    <div className="inscriptionPage flex">
      <div className="container flex">

        <div className="gridVisiteur">
          <img src={fond} alt="bg" />
          <div className="textDiv">
            <h2 className='title'> Créeons ensemble une base de donnée plus meilleure et plus efficace</h2>
            <p>Offrons des gestions plus cohérents et relationnels </p>
          </div>

          <div className="footerDiv flex">
            <span className="text">Ayant déjà une compte</span>
            <Link to={'/login'}>
              <button id="btn">Me connecter</button>
            </Link>
          
          </div>
        </div>
        

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
                <input type="text" id='username' placeholder='Entrer le nom d Utilisateur' onChange={(event)=>{
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
           
            <button type='submit' id="btnLogin" className='flex' onClick={createUser}>
              <span>S'inscrire</span> 
                          
            </button>



          </form>
        </div>

      </div>
    </div>
      
 

  )
}

export default Inscription