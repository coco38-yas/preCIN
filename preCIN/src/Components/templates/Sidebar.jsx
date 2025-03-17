import React, { useState, useEffect } from 'react'
import './sidebar.css'
import Axios from 'axios'
import BodyAccueil from './BodyAccueil'
import { Link, } from 'react-router-dom'
import 'bootstrap-icons/font/bootstrap-icons.css'

const Sidebar = () => {
    //////////////////////////////////////////////////////////////////////////////////
    ////////////////////**********GETTING DATA FROM DATABASE*************/////////////
    //////////////////////////////////////////////////////////////////////////////////
    const [data, setData] = useState([])
    useEffect(() => {

        Axios.get('http://localhost:3000/api/communes')
            //.then(res  => console.log(res))
            .then(res => setData(res.data))
            .catch(err => console.log(err));
    }, [])





    return (

        <div className='logo-bg'>

            <label htmlFor="ch" id="lab"></label>
            <input type="checkbox" id='ch' />

            <div className='sidebar'>
                <nav>
                    {data.map((communes, index) => {
                        



                        return <ul key={index}>
                            <li>

                                <a href="/Trace">
                                    <i className='fs-4 bi-columns ms-2'></i>
                                    <span style={{ padding: '8px' }}>CR : {communes.name} </span>
                                </a>

                            </li>

                        </ul>


                    })}
                </nav>
                <div className="logout">
                    <Link to={'/'}>
                        <input type="submit" value="Déconnexion" />
                    </Link>

                </div>

            </div>


        </div>
    )
}

export default Sidebar