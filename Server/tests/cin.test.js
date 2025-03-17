import request from 'supertest';
import app from '../server/index';

describe('Cards API', () => {
  let createdCardId;

  it('devrait créer une nouvelle carte', async () => {
    const res = await request(app)
      .post('/api/creatcinforcom')
      .field('user_id', 'TesUtilisateur')
      .field('agent_chef_id', 'TestChef')
      .field('num_serie_original', '123456A')
      .field('num_serie_delivre', '123-456-789-012')
      .field('date_ajout', '2025-01-01')
      .field('carte_type', 'primata')
      .field('commune_name', 'CommuneTest')
      .field('nom', 'Doe')
      .field('prenom', 'John')
     
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'Carte créée avec succès.');
    expect(res.body).toHaveProperty('id');
    createdCardId = res.body.id;
  });

  it('devrait récupérer la carte créée par ID', async () => {
    const res = await request(app).get(`/api/creatcinforcom/${createdCardId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toHaveProperty('id', createdCardId);
  });

  it('devrait mettre à jour la carte', async () => {
    const res = await request(app)
      .put(`/api/creatcinforcom/${createdCardId}`)
      .send({ nom: 'Smith' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Carte mise à jour avec succès.');
  });

  it('devrait supprimer la carte', async () => {
    const res = await request(app).delete(`/api/creatcinforcom/${createdCardId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Carte supprimée avec succès.');
  });
});