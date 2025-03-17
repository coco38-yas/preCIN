import React from 'react';
import { Box, Card, CardContent, Typography, Container, Grid } from '@mui/material';
import logo from './Assets/PRECIN.png';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import MailIcon from '@mui/icons-material/Mail';
const AboutProject = () => {
    return (
        <Container maxWidth="lg" sx={{ paddingY: 4, background: 'rgba(0, 255, 242, 0.945)', borderRadius: '8px', marginBottom: '18px', boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.548)' }}>
            <Grid container spacing={4}>
                {/* Section: À propos du projet */}
                <Grid item xs={12}>
                    <Card sx={{ boxShadow: 3, color: '#000' }}>
                        <CardContent>
                            <Typography variant="h4" gutterBottom>
                                Application de gestion de la carte d'identité nationale
                                <img src={logo} alt="preCIN" style={{ width: '400px' }} />
                                (préprocessus CIN)
                                <h6>
                                    Développé par: Zohery Raharimahazo.
                                    <br />
                                    Contact :
                                    {/* Lien WhatsApp */}
                                    <a href="https://wa.me/261383401192" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#25D366' }}>
                                        <WhatsAppIcon style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                                        +261 38 34 011 92
                                    </a>
                                    {/* Lien Email avec icône */}
                                    <br />
                                    email:<a href="mailto:cocodesignservice81@gmail.com" style={{ textDecoration: 'none', color: '#007BFF' }}>
                                        <MailIcon style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                                        cocodesignservice81@gmail.com
                                    </a>
                                </h6>
                            </Typography>
                            <Typography variant="body1" style={{ color: '#000' }} paragraph>
                                Notre projet consiste en la création d'une application de gestion de la Carte d'Identité Nationale preCIN (préprocessus CIN) qui repose sur une base de données dynamique,
                                permettant de suivre et de gérer l'ensemble des informations relatives à chaque citoyen dans une région. Ce projet vise à simplifier le processus d'enregistrement,
                                de mise à jour et de gestion des cartes d'identité dans un environnement numérique sécurisé et efficace. L'application est conçue pour être utilisée par des administrations
                                publiques à tous les niveaux, de la région au district, avec une subdivision complète jusqu'aux communes.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Section: Capacités actuelles du système */}
                <Grid item xs={12}>
                    <Card sx={{ boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                Capacités actuelles du système
                            </Typography>

                            {/* Sous-section: Structure hiérarchique flexible */}
                            <Typography variant="h6" gutterBottom>
                                Structure hiérarchique flexible
                            </Typography>
                            <Typography variant="body1" style={{ color: '#000' }} paragraph>
                                L'application est construite pour permettre une gestion fluide des informations à chaque niveau administratif, depuis la région jusqu'à la commune.
                                Cela assure une cohérence des données tout en facilitant l'accès rapide aux informations spécifiques à chaque zone géographique.
                            </Typography>

                            {/* Sous-section: Gestion des CIN en temps réel */}
                            <Typography variant="h6" gutterBottom>
                                Gestion des CIN en temps réel
                            </Typography>
                            <Typography variant="body1" style={{ color: '#000' }} paragraph>
                                Chaque citoyen ayant une CIN peut avoir ses informations stockées et mises à jour en toute sécurité, incluant des informations sensibles telles que l'adresse,
                                la date de naissance, la photo, et plus encore. L'outil permet aux agents des services d'état civil d'ajouter, de modifier ou de supprimer des données rapidement.
                            </Typography>

                            {/* Sous-section: Accessibilité mobile et web */}
                            <Typography variant="h6" gutterBottom>
                                Accessibilité mobile et web
                            </Typography>
                            <Typography variant="body1" style={{ color: '#000' }} paragraph>
                                L'application est accessible à la fois via une interface web et mobile, offrant ainsi une accessibilité maximale, que ce soit pour les agents en bureau ou pour les
                                utilisateurs dans des zones rurales.
                            </Typography>

                            {/* Sous-section: Sécurité renforcée */}
                            <Typography variant="h6" gutterBottom>
                                Sécurité renforcée
                            </Typography>
                            <Typography variant="body1" style={{ color: '#000' }} paragraph>
                                La sécurité des données est une priorité absolue. Grâce à des systèmes de cryptage avancés et une gestion des rôles et permissions, nous garantissons que seules
                                les personnes autorisées peuvent accéder ou modifier des informations spécifiques.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Section: Futur potentiel et exemples d'utilisation */}
                <Grid item xs={12}>
                    <Card sx={{ boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant="h5" style={{ color: '#000' }} gutterBottom>
                                Futur potentiel et exemples d'utilisation
                            </Typography>

                            {/* Sous-section: Amélioration des services administratifs */}
                            <Typography variant="h6" gutterBottom>
                                Amélioration des services administratifs
                            </Typography>
                            <Typography variant="body1" style={{ color: '#000' }} paragraph>
                                L'intégration de la gestion de la CIN dans un système centralisé permet à l'administration locale de réduire le temps nécessaire pour la gestion des demandes
                                de CIN. Par exemple, une personne souhaitant renouveler sa CIN peut faire une demande en ligne, simplifiant ainsi le processus pour les citoyens et les autorités locales.
                            </Typography>

                            {/* Sous-section: Suivi statistique en temps réel */}
                            <Typography variant="h6" gutterBottom>
                                Suivi statistique en temps réel
                            </Typography>
                            <Typography variant="body1" style={{ color: '#000' }} paragraph>
                                L'application offre des capacités de suivi statistique en temps réel, permettant aux responsables régionaux de visualiser des données comme le nombre de CIN émises
                                et les demandes en cours, facilitant ainsi la prise de décision.
                            </Typography>

                            {/* Sous-section: Intégration avec d'autres services */}
                            <Typography variant="h6" gutterBottom>
                                Intégration avec d'autres services
                            </Typography>
                            <Typography variant="body1" style={{ color: '#000' }} paragraph>
                                
                            </Typography>

                            {/* Sous-section: Optimisation des ressources humaines */}
                            <Typography variant="h6" gutterBottom>
                                Optimisation des ressources humaines
                            </Typography>
                            <Typography variant="body1" style={{ color: '#000' }} paragraph>
                                Le système permet une gestion plus optimale des agents administratifs grâce à l'automatisation des processus et à la centralisation des données.
                            </Typography>

                            {/* Sous-section: Accessibilité internationale */}
                            <Typography variant="h6" gutterBottom>
                                Accessibilité internationale et coopération inter-gouvernementale
                            </Typography>
                            <Typography variant="body1" style={{ color: '#000' }} paragraph>
                                L'application pourrait permettre une coopération inter-gouvernementale fluide, facilitant la gestion des CIN à l'échelle mondiale grâce à des plateformes sécurisées
                                d'échanges de données.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Section: Conclusion */}
                <Grid item xs={12}>
                    <Card sx={{ boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                Conclusion
                            </Typography>
                            <Typography variant="body1" style={{ color: '#000' }} paragraph>
                                Ce projet n'est pas simplement un outil de gestion des CIN. Il représente une plateforme innovante capable de s’adapter aux besoins de la société moderne.
                                L’application prépare le terrain pour une révolution numérique dans la gestion des données administratives à l’échelle nationale et au-delà.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default AboutProject;
