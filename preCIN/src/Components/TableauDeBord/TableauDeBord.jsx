import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { motion } from 'framer-motion';
import {
  Box,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Collapse
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { IconButton } from '@mui/material';
import './TableauDeBord.css';
import LatestImages from './LatestImages';

const months = [
  { value: 1, label: "Janvier" },
  { value: 2, label: "Février" },
  { value: 3, label: "Mars" },
  { value: 4, label: "Avril" },
  { value: 5, label: "Mai" },
  { value: 6, label: "Juin" },
  { value: 7, label: "Juillet" },
  { value: 8, label: "Août" },
  { value: 9, label: "Septembre" },
  { value: 10, label: "Octobre" },
  { value: 11, label: "Novembre" },
  { value: 12, label: "Décembre" }
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

/**
 * Composant qui anime l'affichage d'un nombre avec un fond dégradé,
 * des bords arrondis et un effet de lueur externe dynamique.
 */
const AnimatedNumberDisplay = ({ label, value, delay = 0 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000; // durée totale en ms
    const stepTime = value > 0 ? duration / value : duration;
    const interval = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= value) clearInterval(interval);
    }, stepTime);
    return () => clearInterval(interval);
  }, [value]);

  return (
    <Box
      sx={{
        textAlign: 'center',
        my: 3,
        p: 3,
        borderRadius: '20px',
        background: 'linear-gradient(45deg, #002bff, #00c3ff, #00ff9e)',
        boxShadow: '0px 0px 20px rgba(255, 0, 0, 0.548)',
        animation: 'glowEffect 3s infinite alternate',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 'bold',
          color: '#fff',
          textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
        }}
      >
        {label}
      </Typography>
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay }}
        style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#fff',
          textShadow: '0px 0px 10px rgba(255,255,255,0.8)'
        }}
      >
        {count}
      </motion.span>
    </Box>
  );
};

// Composant personnalisé pour le bouton d'expansion avec pivotement
const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const TableauDeBord = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [stats, setStats] = useState([]);
  const [error, setError] = useState('');

  // Récupération des statistiques depuis le backend
  const fetchStats = async () => {
    try {
      const res = await Axios.get('http://localhost:3000/dashboard', {
        params: { month: selectedMonth, year: selectedYear }
      });
      let statsData = res.data?.data || res.data;
      if (!Array.isArray(statsData)) throw new Error('Format incorrect.');
      setStats(statsData);
      setError('');
    } catch (err) {
      setError('Erreur lors du chargement des statistiques');
      setStats([]);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [selectedMonth, selectedYear]);

  // Calcul des totaux globaux
  const totalCIN = stats.reduce((sum, s) => sum + s.totalCIN, 0);
  const totalNonAttribues = stats.reduce((sum, s) => sum + s.nonAttribues, 0);
  const totalPrimata = stats.reduce((sum, s) => sum + s.totalPrimata, 0);
  const totalDuplicata = stats.reduce((sum, s) => sum + s.totalDuplicata, 0);
  const totalRatee = stats.reduce((sum, s) => sum + s.totalRatee, 0);

  // État pour gérer l'expansion de chaque carte (indexé par l'index)
  const [expandedCards, setExpandedCards] = useState({});

  const handleExpandClick = (index) => {
    setExpandedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <Box sx={{ p: 4, background: 'rgba(0, 255, 242, 0.945)', borderRadius: '8px', marginBottom: '18px', boxShadow: '0px 0px 20px rgba(255, 255, 255, 0.548)' }}>
      <Typography variant="h4" gutterBottom>
        Tableau de Bord
      </Typography>

      {/* Sélecteurs de Mois et Année */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Mois</InputLabel>
          <Select
            value={selectedMonth}
            id="textfield"
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {months.map((m) => (
              <MenuItem key={m.value} value={m.value}>
                {m.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Année</InputLabel>
          <Select
            value={selectedYear}
            id="textfield"
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            {years.map((y) => (
              <MenuItem key={y} value={y}>
                {y}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Message d'erreur */}
      {error && <Typography color="error">{error}</Typography>}

      {/* Affichage global des totaux animés */}
      <Box
        sx={{
          textAlign: 'center',
          my: 3,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignContent: 'space-between'
        }}
      >
        <AnimatedNumberDisplay label="Total CIN" value={totalCIN} delay={0.4} />
        <AnimatedNumberDisplay label="Non Attribués" value={totalNonAttribues} delay={0.6} />
        <AnimatedNumberDisplay label="Primata" value={totalPrimata} delay={0.8} />
        <AnimatedNumberDisplay label="Duplicata" value={totalDuplicata} delay={1} />
        <AnimatedNumberDisplay label="Ratée" value={totalRatee} delay={1} />
      </Box>

      {/* GRID - Affichage des statistiques par commune avec expansion */}
      <Grid container spacing={1}>
        {stats.length > 0 ? (
          stats.map((stat, index) => (
            <Grid item key={index} xs={12} sm={6} md={4} spacing={0.2}>
              <Card
                sx={{
                  background: 'linear-gradient(to left, rgb(3, 112, 103), rgb(3, 151, 107))',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': { transform: 'scale(1.05)' },
                }}
              >
                <CardHeader
                  title={`${stat.commune} - ${stat.month}/${stat.year}`}
                  sx={{
                    background: 'linear-gradient(to left, rgb(3, 112, 3), rgb(3, 11, 107))',
                    color: 'white', '&:hover': { background: 'linear-gradient(to left,rgba(93,249,236,1), rgb(0, 255, 179))' }
                  }}
                  action={
                    <ExpandMore
                      expand={expandedCards[index] || false}
                      onClick={() => handleExpandClick(index)}
                      aria-expanded={expandedCards[index] || false}
                      aria-label="afficher/cacher"
                    >
                      <ExpandMoreIcon />
                    </ExpandMore>
                  }
                />
                <Collapse in={expandedCards[index]} timeout="auto" unmountOnExit>
                  <CardContent sx={{ p: 1 }}>
                    <Typography variant="body1">
                      Total CIN :{' '}
                      <AnimatedNumberDisplay label="" value={stat.totalCIN} delay={0.2} />
                    </Typography>
                    <Typography variant="body1">
                      Non attribués :{' '}
                      <AnimatedNumberDisplay label="" value={stat.nonAttribues} delay={0.4} />
                    </Typography>
                    <Typography variant="body1">
                      Primata :{' '}
                      <AnimatedNumberDisplay label="" value={stat.totalPrimata} delay={0.6} />
                    </Typography>
                    <Typography variant="body1">
                      Duplicata :{' '}
                      <AnimatedNumberDisplay label="" value={stat.totalDuplicata} delay={0.8} />
                    </Typography>
                    <Typography variant="body1">
                      Ratée :{' '}
                      <AnimatedNumberDisplay label="" value={stat.totalRatee} delay={0.8} />
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }} component="div">
                     
                      Agent Chef : <strong style={{ color: '#0080ff' }}>{stat.agent_chef_name || "Non défini"}</strong>
                    </Typography>
                  </CardContent>


                </Collapse>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body1" sx={{ p: 2 }}>
            Aucune donnée disponible pour ce mois et cette année.
          </Typography>
        )}
      </Grid>
      <LatestImages />
    </Box>
  );
};

export default TableauDeBord;
