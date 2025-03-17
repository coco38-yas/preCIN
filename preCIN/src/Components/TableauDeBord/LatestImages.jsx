// LatestImages.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Carousel, Spinner, Alert } from 'react-bootstrap';

const LatestImages = () => {
  const [idCards, setIdCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLatestImages = async () => {
      try {
        // Récupération du token stocké après connexion (par exemple dans le localStorage)
        // const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/creatcinforcom/latest');
        setIdCards(response.data.data);
      } catch (err) {
        console.error('Erreur lors de la récupération des images', err);
        setError("Impossible de charger les images.");
      } finally {
        setLoading(false);
      }
    };
    fetchLatestImages();
  }, []);

  if (loading) {
    return (
      <div className="text-center my-4">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="my-4">
        {error}
      </Alert>
    );
  }

  return (
    <div className="container my-4">
      <h2 style={{color: 'rgba(0,0,0,0.8)', textAlign: 'center'}}>Dernières images ajoutées</h2>
      { idCards.length > 0 ? (
  <Carousel>
    {idCards.map((img, index) => (
      <Carousel.Item key={img.id} >
        <img
          className="d-block w-100"
          src={`http://localhost:3000/Uploads/${img.image_carte}`}
          alt={`Image ${index + 1}`}
          style={{ maxHeight: '400px', objectFit: 'cover', borderRadius: '8px' }}
        />
        <Carousel.Caption
          style={{
            // border: '2px solid rgba(255, 0, 0, 0.3)',
            padding: '10px',
            borderRadius: '8px',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            boxShadow: '0px 0px 10px rgba(0,0,0,0.5)'
          }}
        >
          <h3 style={{ textShadow: '3px 3px 5px rgba(255, 0, 0, 0.3)' }}>
            {img.nom}
          </h3>
          <p style={{ textShadow: '3px 3px 5px rgba(255, 0, 0, 1)' }}>
            {img.commune_id} - Ajouté le {new Date(img.date_ajout).toLocaleDateString()}
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    ))}
  </Carousel>
) : (
  <p>Aucune image disponible pour le moment.</p>
)}

    </div>
  );
};

export default LatestImages;