import React, { useState, useEffect } from 'react'
import './header_style.css'
import Axios from 'axios'

import logoPrecin from './Assets/PRECIN.png'
import prefetLogo from './Assets/prefet-logo.png'



const Header = () => {

  const [datas, setDatas] = useState([])
  
  useEffect(() => {
      
      Axios.get('http://localhost:3000/inscription')
      //.then(res  => console.log(res))
      .then(res => setDatas(res.data) )
      .catch(err  => console.log(err));
    }, [])
  


  return (
    <div className='header-container'>
      <header>
        <div className='logo'>
          <img className='logoprecin' src={logoPrecin} alt="logo PreCin" />
        </div>
        <div>
          <nav className='nav_links'>
            <ul>
              <li>
                <a href="/Accueil">
                  <i className='fs-4 bi-columns ms-2'></i>
                  <span style={{ padding: '8px' }}>Accueil</span>
                </a>
              </li>
              <li>
                <a href="/Trace">
                  <i className='fs-4 bi-speedometer2 ms-2'></i>
                  <span style={{ padding: '8px' }}>Mission et Traçabilité</span>
                </a>
              </li>
              <li>
                <a href="/Users">
                  <i className='fs-4 bi-person ms-2'></i>
                  <span style={{ padding: '8px' }}>Utilisateurs</span>
                </a>
              </li>
              <li>
                <a href="/Agents">
                  <i className='fs-4 bi-people ms-2'></i>
                  <span style={{ padding: '8px' }}>Agents/Chefs</span>
                </a>
              </li>
              <li>
                <a href="/TableauDeBord">
                  <i className='fs-4 bi-speedometer2 ms-2'></i>
                  <span style={{ padding: '8px' }}>Tableau de Bord</span>
                </a>
              </li>
              
            </ul>
          </nav>
        </div>
        <div >
        <select id="users" className="">
                {datas.map((user, index) => {
                  return <option key={index} value="users">{user.username}</option>

                })}
              </select>
        
        </div>

      </header>
    </div>
  )
}

export default Header