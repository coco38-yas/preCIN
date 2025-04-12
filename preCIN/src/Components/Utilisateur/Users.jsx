
import React from 'react'
import '../templates/header_style.css'
import '../../App.css'
import '../Accueil/Accueil.css'




import Axios from 'axios'

// import SidebarTrace from '../templates/sidebar'
import Header from '../templates/Header'


import { Outlet } from 'react-router-dom'
import BodyAccueil from '../templates/BodyAccueil'
import Inscription from '../Inscription/Inscription'
import UserList from './UserList'

const Users = () => {
  return (
    <div className='containers'>
        
        
        <UserList/>
    </div>
   
      
    
  )
}

export default Users

