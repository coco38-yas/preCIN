import React, { useState, useEffect } from 'react'

import { Link } from 'react-router-dom'
import Axios from 'axios'
import { useNavigate } from 'react-router-dom'

//import 'bootstrap/dist/css/bootstrap.min.css'
const ShowImage = () => {



    //////////////////////////////////////////////////////////////////////////////////
    const [idCards, setIdCards] = useState([])
    useEffect(() => {

        Axios.get('http://localhost:3000/api/creatcinforcom')
            //.then(res  => console.log(res))
            .then(res => setIdCards(res.data))
            .catch(err => console.log(err));
    }, [])
    /////////////////////////////////////////////////////


    return (
        <div>


            <div id="latest-images">
                <h2>Dernières Images Ajoutées</h2>
                <div id="carouselLatestImages" class="carousel slide" data-ride="carousel">
                    <div class="carousel-inner">
                        <div class="carousel-item active">
                            {idCards.map((com) => {
                                return <div>
                                    {com.image_carte && (
                                        <img src={`http://localhost:3000/Uploads/` + com.image_carte} alt="CIN" width="100%" />
                                    )}
                                    <div class="carousel-caption">
                                        <h3>{com.nom}</h3>
                                        <p>{com.commune_id} - Ajouté le {new Date(com.date_ajout).toLocaleDateString()}</p>
                                        <button type="submit" className="plus-btn">Voir Détails</button>
                                    </div>
                                </div>


                            })}

                        </div>


                    </div>
                    <a class="carousel-control-prev" href="#carouselLatestImages" role="button" data-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="sr-only">Précédent</span>
                    </a>
                    <a class="carousel-control-next" href="#carouselLatestImages" role="button" data-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="sr-only">Suivant</span>
                    </a>
                </div>
            </div>
        </div>

    )
}

export default ShowImage