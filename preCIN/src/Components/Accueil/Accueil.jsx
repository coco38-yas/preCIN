import React from 'react'
import '../templates/header_style.css'
import '../../App.css'
import './Accueil.css'

import { Link } from 'react-router-dom'
import Axios from 'axios'

import Header from '../templates/Header'
import BodyAccueil from '../templates/BodyAccueil'
import { Outlet } from 'react-router-dom'
import Sidebar from '../templates/Sidebar'



const Accueil = () => {
  return (
    <div className='containers'>
      
      
          
         
          <BodyAccueil />
        
     
      
    </div>




  )
}

export default Accueil