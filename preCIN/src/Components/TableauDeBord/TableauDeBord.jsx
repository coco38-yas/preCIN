import React, { useState, useEffect, useRef, forwardRef } from 'react';
import Axios from 'axios';
import printJS from 'print-js';
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
  Collapse,
  Button
} from '@mui/material';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  LinearProgress,
  DialogActions
} from '@mui/material';

import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DownloadIcon from '@mui/icons-material/Download';
import CalendarViewMonthIcon from "@mui/icons-material/CalendarViewMonth";
// import CalendarViewYearIcon from '@mui/icons-material/CalendarViewYear';
import DateRangeIcon from '@mui/icons-material/DateRange';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import PrintIcon from '@mui/icons-material/Print';
import logoMinistere from '../../LoginAssets/logoprefet.png';
import logoRepublique from '../../LoginAssets/logorepublique.jpeg';

//  Pour le graphique dynamique avec react-chartjs-2
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
// Enregistrement des composants utilisés par ChartJS
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Pour la carte interactive avec React-Leaflet
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';






import LatestImages from './LatestImages';
import './TableauDeBord.css';
import { Visibility } from '@mui/icons-material';


// -----------------------------------------------------------------------------
// Constantes pour les mois et années
// -----------------------------------------------------------------------------
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

// -----------------------------------------------------------------------------
// Composant animé pour l'affichage des nombres (version écran)
// -----------------------------------------------------------------------------
const AnimatedNumberDisplay = ({ label, value, delay = 0 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const numericValue = Number(value) || 0;
    if (numericValue === 0) {
      setCount(0);
      return;
    }
    let start = 0;
    const duration = 2000;
    const stepTime = numericValue > 0 ? duration / numericValue : duration / 50;
    const interval = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= numericValue) clearInterval(interval);
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
      {label && (
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 'bold', color: '#fff', textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}
        >
          {label}
        </Typography>
      )}
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

// -----------------------------------------------------------------------------
// Bouton d'expansion personnalisé pour les cartes
// -----------------------------------------------------------------------------
const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <Button {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

// -----------------------------------------------------------------------------
// Composant imprimable pour la vue mensuelle
// -----------------------------------------------------------------------------
const PrintableDashboard = forwardRef((props, ref) => {
  const { statsMonth, selectedMonth, selectedYear, totalMonth } = props;

  // Récupérer le label du mois (ex: "Mars")
  const monthLabel = months.find(m => m.value === selectedMonth)?.label || '';

  return (
    <div
      ref={ref}
      id="printable-area"
      className="print-dashboard"
      style={{
        borderRadius: "4px",
        marginTop: '40px',
        padding: '20px',
        background: "#b9fffd"
      }}
    >
      {/* --------------- En-tête --------------- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        {/* Colonne de gauche */}
        <div style={{ textAlign: 'center', justifyContent: "center", width: '300px' }}>
          <img
            src={logoMinistere}
            alt="Ministère de l'Intérieur"
            style={{ width: '160px', marginBottom: '5px' }}
          />
          <p style={{ margin: 0, lineHeight: "0", textAlign: "center", color: "#000" }}>MINISTÈRE DE L'INTÉRIEUR</p>
          <p style={{ margin: 0, lineHeight: "0", textAlign: "center", color: "#000" }}>-----------------</p>
          <p style={{ margin: 0, lineHeight: "0", textAlign: "center", color: "#000" }}>PRÉFECTURE DE FENERIVE-EST</p>
          <p style={{ margin: 0, lineHeight: "0", textAlign: "center", color: "#000" }}>-----------------</p>
          <p style={{ margin: 0, lineHeight: "0", textAlign: "center", color: "#000" }}>DISTRICT DE FENERIVE-EST</p>
        </div>

        {/* Colonne de droite */}
        <div style={{ textAlign: 'left' }}>
          <img
            src={logoRepublique}
            alt="République de Madagascar"
            style={{ width: '200px', marginBottom: '5px', marginRight: '180px' }}
          />
          {/* <p style={{ fontWeight: 'bold', margin: 0 }}>REPUBLIQUE DE MADAGASCAR</p>
          <p style={{ margin: 0 }}>Fitiavana - Tanindrazana - Fandrosoana</p> */}
        </div>
      </div>
      {/* --------------- Fin en-tête --------------- */}
      <h2 style={{ textAlign: 'center', marginBottom: '20px', fontWeight: 'bold' }}>
        TABLEAU RÉCAPITULATIF DES STATISTIQUES
      </h2>
      <p style={{ textAlign: 'center', fontWeight: 'bold', color: "#000" }}>
        MOIS DE {monthLabel.toUpperCase()} (AN {selectedYear})
      </p>

      <table
        className="stats-table"
        width="100%"
        border="1"
        cellPadding="5"
        style={{ borderCollapse: 'collapse' }}
      >
        <thead>
          <tr style={{ textAlign: 'center', fontWeight: 'bold' }}>
            <th>Nom de la Commune</th>
            <th>Total CIN</th>
            <th>Sorties</th>
            <th>Restées</th>
            <th>Non Attribuées</th>
            <th>Primata</th>
            <th>Duplicata</th>
            <th>Ratées</th>
            <th>Femme</th>
            <th>Homme</th>
          </tr>
        </thead>
        <tbody>
          {statsMonth.map((stat, idx) => (
            <tr key={idx} style={{ textAlign: 'center' }}>
              <td>{stat.commune}</td>
              <td>{stat.totalCIN}</td>
              <td>{stat.totalConfirmed}</td>
              <td>{stat.totalCompleteNonConfirmed}</td>
              <td>{stat.nonAttribues}</td>
              <td>{stat.totalPrimata}</td>
              <td>{stat.totalDuplicata}</td>
              <td>{stat.totalRatee}</td>
              <td>{stat.totalFemme}</td>
              <td>{stat.totalHomme}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ marginTop: '30px' }}>TOTAL MENSUEL</h3>
      <table
        className="stats-table"
        width="100%"
        border="1"
        cellPadding="5"
        style={{ borderCollapse: 'collapse' }}
      >
        <thead>
          <tr style={{ textAlign: 'center', fontWeight: 'bold' }}>
            <th>Total CIN</th>
            <th>Sorties</th>
            <th>Restées</th>
            <th>Non Attribuées</th>
            <th>Primata</th>
            <th>Duplicata</th>
            <th>Ratées</th>
            <th>Femme</th>
            <th>Homme</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ textAlign: 'center' }}>
            <td>{totalMonth.totalCIN}</td>
            <td>{totalMonth.totalConfirmed}</td>
            <td>{totalMonth.totalCompleteNonConfirmed}</td>
            <td>{totalMonth.totalNonAttribues}</td>
            <td>{totalMonth.totalPrimata}</td>
            <td>{totalMonth.totalDuplicata}</td>
            <td>{totalMonth.totalRatee}</td>
            <td>{totalMonth.totalFemme}</td>
            <td>{totalMonth.totalHomme}</td>
          </tr>
        </tbody>
      </table>

      <div
        style={{
          marginTop: '50px',
          marginBottom: "100px",
          display: 'flex',
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <div
          style={{
            marginLeft: "70px",
            width: "200px",
            textAlign: 'center'
          }}
        >
          LE RESPONSABLE,
        </div>
        <div
          style={{
            marginLeft: "300px",
            width: "200px",
            textAlign: 'center'
          }}
        >
          LE CONTRÔLEUR,
        </div>
      </div>
    </div>
  );
});

// -----------------------------------------------------------------------------
// Composant imprimable pour la vue annuelle globale
// -----------------------------------------------------------------------------
const PrintableYearDashboard = forwardRef((props, ref) => {
  const { statsYear, selectedYear } = props;
  const grandTotal = statsYear.reduce(
    (acc, cur) => {
      acc.totalCIN += cur.totalCIN;
      acc.totalConfirmed += cur.totalConfirmed;
      acc.totalCompleteNonConfirmed += cur.totalCompleteNonConfirmed;
      acc.totalNonAttribues += cur.totalNonAttribues;
      acc.totalPrimata += cur.totalPrimata;
      acc.totalDuplicata += cur.totalDuplicata;
      acc.totalRatee += cur.totalRatee;
      acc.totalFemme += cur.totalFemme;
      acc.totalHomme += cur.totalHomme;
      return acc;
    },
    { totalCIN: 0, totalConfirmed: 0, totalCompleteNonConfirmed: 0, totalNonAttribues: 0, totalPrimata: 0, totalDuplicata: 0, totalRatee: 0, totalFemme: 0, totalHomme: 0 }
  );

  return (
    <div ref={ref} id="printable-area" className="print-dashboard" style={{ borderRadius: "4px", marginTop: '40px', padding: '20px', background: "#b9fffd" }}>
      {/* --------------- En-tête --------------- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        {/* Colonne de gauche */}
        <div style={{ textAlign: 'center', justifyContent: "center", width: '300px' }}>
          <img
            src={logoMinistere}
            alt="Ministère de l'Intérieur"
            style={{ width: '160px', marginBottom: '5px' }}
          />
          <p style={{ margin: 0, lineHeight: "0", textAlign: "center", color: "#000" }}>MINISTÈRE DE L'INTÉRIEUR</p>
          <p style={{ margin: 0, lineHeight: "0", textAlign: "center", color: "#000" }}>-----------------</p>
          <p style={{ margin: 0, lineHeight: "0", textAlign: "center", color: "#000" }}>PRÉFECTURE DE FENERIVE-EST</p>
          <p style={{ margin: 0, lineHeight: "0", textAlign: "center", color: "#000" }}>-----------------</p>
          <p style={{ margin: 0, lineHeight: "0", textAlign: "center", color: "#000" }}>DISTRICT DE FENERIVE-EST</p>
        </div>

        {/* Colonne de droite */}
        <div style={{ textAlign: 'left' }}>
          <img
            src={logoRepublique}
            alt="République de Madagascar"
            style={{ width: '200px', marginBottom: '5px', marginRight: '180px' }}
          />
          {/* <p style={{ fontWeight: 'bold', margin: 0 }}>REPUBLIQUE DE MADAGASCAR</p>
          <p style={{ margin: 0 }}>Fitiavana - Tanindrazana - Fandrosoana</p> */}
        </div>
      </div>
      {/* --------------- Fin en-tête --------------- */}
      <h2 style={{ textAlign: 'center', marginBottom: '20px', fontWeight: 'bold' }}>
        TABLEAU RÉCAPITULATIF DES STATISTIQUES <br></br>
        ANNUELLES POUR TOUTES LES COMMUNES
      </h2>
      <p style={{ textAlign: 'center', fontWeight: 'bold', color: "#000" }}>
        ANNÉE {selectedYear}
      </p>
      <table className="stats-table" width="100%" border="1" cellPadding="5" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'center', fontWeight: 'bold' }}>
            <th>Mois</th>
            <th>Total CIN</th>
            <th>Sorties</th>
            <th>Restées</th>
            <th>Non Attribués</th>
            <th>Primata</th>
            <th>Duplicata</th>
            <th>Ratées</th>
            <th>Femme</th>
            <th>Homme</th>
          </tr>
        </thead>
        <tbody>
          {statsYear.map((stat, idx) => (
            <tr key={idx} style={{ textAlign: 'center' }}>
              <td>{months.find(m => m.value === stat.month)?.label}</td>
              <td>{stat.totalCIN}</td>
              <td>{stat.totalConfirmed}</td>
              <td>{stat.totalCompleteNonConfirmed}</td>
              <td>{stat.totalNonAttribues}</td>
              <td>{stat.totalPrimata}</td>
              <td>{stat.totalDuplicata}</td>
              <td>{stat.totalRatee}</td>
              <td>{stat.totalFemme}</td>
              <td>{stat.totalHomme}</td>
            </tr>
          ))}
          <tr style={{ fontWeight: 'bold', textAlign: 'center' }}>
            <td>Total Année</td>
            <td>{grandTotal.totalCIN}</td>
            <td>{grandTotal.totalConfirmed}</td>
            <td>{grandTotal.totalCompleteNonConfirmed}</td>
            <td>{grandTotal.totalNonAttribues}</td>
            <td>{grandTotal.totalPrimata}</td>
            <td>{grandTotal.totalDuplicata}</td>
            <td>{grandTotal.totalRatee}</td>
            <td>{grandTotal.totalFemme}</td>
            <td>{grandTotal.totalHomme}</td>
          </tr>
        </tbody>
      </table>
      <div style={{ marginTop: '50px', marginBottom: "100px", display: 'flex', alignItems: "center", justifyContent: "center" }}>
        <div style={{ marginLeft: "70px", width: "200px", textAlign: 'center' }}>LE RESPONSABLE,</div>
        <div style={{ marginLeft: "300px", width: "200px", textAlign: 'center' }}>LE CONTRÔLEUR,</div>
      </div>
    </div>
  );
});

// -----------------------------------------------------------------------------
// Composant imprimable pour la vue annuelle par commune
// -----------------------------------------------------------------------------
const PrintableCommuneDashboard = forwardRef((props, ref) => {
  const { statsCommune, selectedCommune, selectedYear } = props;

  // Calcul du grand total pour l'année
  const grandTotal = statsCommune.reduce(
    (acc, cur) => {
      acc.totalCIN += Number(cur.totalCIN) || 0;
      acc.totalConfirmed += Number(cur.totalConfirmed) || 0;
      acc.totalCompleteNonConfirmed += Number(cur.totalCompleteNonConfirmed) || 0;
      acc.totalNonAttribues += Number(cur.nonAttribues) || 0;
      acc.totalPrimata += Number(cur.totalPrimata) || 0;
      acc.totalDuplicata += Number(cur.totalDuplicata) || 0;
      acc.totalRatee += Number(cur.totalRatee) || 0;
      acc.totalFemme += Number(cur.totalFemme) || 0;
      acc.totalHomme += Number(cur.totalHomme) || 0;
      return acc;
    },
    {
      totalCIN: 0,
      totalConfirmed: 0,
      totalCompleteNonConfirmed: 0,
      totalNonAttribues: 0,
      totalPrimata: 0,
      totalDuplicata: 0,
      totalRatee: 0,
      totalFemme: 0,
      totalHomme: 0
    }
  );

  return (
    <div ref={ref} id="printable-area" className="print-dashboard" style={{ borderRadius: "4px", marginTop: '40px', padding: '20px', background: "#b9fffd" }}>
      {/* --------------- En-tête --------------- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        {/* Colonne de gauche */}
        <div style={{ textAlign: 'center', justifyContent: "center", width: '300px' }}>
          <img
            src={logoMinistere}
            alt="Ministère de l'Intérieur"
            style={{ width: '160px', marginBottom: '5px' }}
          />
          <p style={{ margin: 0, lineHeight: "0", textAlign: "center", color: "#000" }}>MINISTÈRE DE L'INTÉRIEUR</p>
          <p style={{ margin: 0, lineHeight: "0", textAlign: "center", color: "#000" }}>-----------------</p>
          <p style={{ margin: 0, lineHeight: "0", textAlign: "center", color: "#000" }}>PRÉFECTURE DE FENERIVE-EST</p>
          <p style={{ margin: 0, lineHeight: "0", textAlign: "center", color: "#000" }}>-----------------</p>
          <p style={{ margin: 0, lineHeight: "0", textAlign: "center", color: "#000" }}>DISTRICT DE FENERIVE-EST</p>
        </div>

        {/* Colonne de droite */}
        <div style={{ textAlign: 'left' }}>
          <img
            src={logoRepublique}
            alt="République de Madagascar"
            style={{ width: '200px', marginBottom: '5px', marginRight: '180px' }}
          />
          {/* <p style={{ fontWeight: 'bold', margin: 0 }}>REPUBLIQUE DE MADAGASCAR</p>
          <p style={{ margin: 0 }}>Fitiavana - Tanindrazana - Fandrosoana</p> */}
        </div>
      </div>
      {/* --------------- Fin en-tête --------------- */}
      <h2 style={{ textAlign: 'center', marginBottom: '20px', fontWeight: 'bold' }}>
        STATISTIQUES ANNUELLES DE LA COMMUNE
      </h2>
      <p style={{ textAlign: 'center', fontWeight: 'bold', color: "#000" }}>
        {selectedCommune.toUpperCase()} - ANNÉE {selectedYear}
      </p>
      <table className="stats-table" width="100%" border="1" cellPadding="5" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'center', fontWeight: 'bold' }}>
            <th>Mois</th>
            <th>Total CIN</th>
            <th>Sorties</th>
            <th>Restées</th>
            <th>Non Attribués</th>
            <th>Primata</th>
            <th>Duplicata</th>
            <th>Ratées</th>
            <th>Femme</th>
            <th>Homme</th>
          </tr>
        </thead>
        <tbody>
          {statsCommune.map((stat, idx) => (
            <tr key={idx} style={{ textAlign: 'center' }}>
              <td>{months.find(m => m.value === stat.month)?.label}</td>
              <td>{stat.totalCIN}</td>
              <td>{stat.totalConfirmed}</td>
              <td>{stat.totalCompleteNonConfirmed}</td>
              <td>{stat.nonAttribues}</td>
              <td>{stat.totalPrimata}</td>
              <td>{stat.totalDuplicata}</td>
              <td>{stat.totalRatee}</td>
              <td>{stat.totalFemme}</td>
              <td>{stat.totalHomme}</td>
            </tr>
          ))}
          <tr style={{ fontWeight: 'bold', textAlign: 'center' }}>
            <td>Total Année</td>
            <td>{grandTotal.totalCIN}</td>
            <td>{grandTotal.totalConfirmed}</td>
            <td>{grandTotal.totalCompleteNonConfirmed}</td>
            <td>{grandTotal.totalNonAttribues}</td>
            <td>{grandTotal.totalPrimata}</td>
            <td>{grandTotal.totalDuplicata}</td>
            <td>{grandTotal.totalRatee}</td>
            <td>{grandTotal.totalFemme}</td>
            <td>{grandTotal.totalHomme}</td>
          </tr>
        </tbody>
      </table>
      <div style={{ marginTop: '50px', marginBottom: "100px", display: 'flex', alignItems: "center", justifyContent: "center" }}>
        <div style={{ marginLeft: "70px", width: "200px", textAlign: 'center' }}>LE RESPONSABLE,</div>
        <div style={{ marginLeft: "300px", width: "200px", textAlign: 'center' }}>LE CONTRÔLEUR,</div>
      </div>
    </div>
  );
});


// -----------------------------------------------------------------------------
// Composant principal : TableauDeBord
// -----------------------------------------------------------------------------
const TableauDeBord = () => {
  // Trois modes de vue : "month", "year" ou "commune"
  const [viewMode, setViewMode] = useState('month');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedCommune, setSelectedCommune] = useState('');
  const [statsMonth, setStatsMonth] = useState([]);
  const [statsYear, setStatsYear] = useState([]);
  const [statsCommune, setStatsCommune] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedCards, setExpandedCards] = useState({});
  const [openDialog, setOpenDialog] = useState(false);


  const printRef = useRef();

  // Impression via printJS
  const handlePrint = () => {
    printJS({
      printable: 'printable-area',
      type: 'html',
      targetStyles: ['*']
    });
  };

  // const [loading, setLoading] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');

  const handleBackup = async () => {
    setOpenDialog(true);
    setBackupProgress(0);
    setSuccessMessage('');
    try {
      const res = await Axios.post(
        'http://localhost:3000/api/backup',
        {
          folderPath: 'C:\\xampp\\mysql\\data',
          destination: 'C:\\Users\\cocoDesign\\Documents\\sauvegarde'
        },
        {
          // On peut utiliser onUploadProgress si le serveur supporte l'envoi d'informations de progression
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setBackupProgress(percentCompleted);
            }
          }
        }
      );
      // Si votre API ne renvoie pas de progression, vous pouvez aussi simuler la progression :
      setBackupProgress(100);
      // Attendre un court instant pour laisser le temps à l'utilisateur de voir 100%
      setTimeout(() => {
        setLoading(false);
        setSuccessMessage('Sauvegarde effectuée avec succès : ' + res.data.message);
      }, 800);
    } catch (err) {
      console.error(err);
      setLoading(false);
      setSuccessMessage('Erreur lors de la sauvegarde.');
    }
  };

  // Fonction de sauvegarde
  // const handleBackup = async () => {
  //   try {
  //     const res = await Axios.post('http://localhost:3000/api/backup', {
  //       folderPath: 'C:\\xampp\\mysql\\data',
  //       destination: 'C:\\Users\\cocod\\Documents\\sauvegarde'
  //     });
  //     alert('Sauvegarde effectuée avec succès : ' + res.data.message);
  //   } catch (err) {
  //     console.error(err);
  //     alert('Erreur lors de la sauvegarde.');
  //   }
  // };

  // Récupération des statistiques mensuelles pour un mois donné
  const fetchStatsMonth = async () => {
    setLoading(true);
    try {
      const res = await Axios.get('http://localhost:3000/dashboard', {
        params: { month: selectedMonth, year: selectedYear }
      });
      const statsData = res.data?.data || res.data;
      if (!Array.isArray(statsData)) throw new Error('Format incorrect.');
      setStatsMonth(statsData);
      setError('');
    } catch (err) {
      setError('Erreur lors du chargement des statistiques mensuelles');
      setStatsMonth([]);
    }
    setLoading(false);
  };

  // Récupération des statistiques annuelles globales
  const fetchStatsYear = async () => {
    setLoading(true);
    try {
      const monthPromises = [];
      for (let m = 1; m <= 12; m++) {
        monthPromises.push(
          Axios.get('http://localhost:3000/dashboard', {
            params: { month: m, year: selectedYear }
          })
        );
      }
      const responses = await Promise.all(monthPromises);
      const statsByMonth = responses.map((res, index) => {
        const data = res.data?.data || res.data;
        return {
          month: index + 1,
          totalCIN: data.reduce((sum, s) => sum + Number(s.totalCIN || 0), 0),
          totalConfirmed: data.reduce((sum, s) => sum + Number(s.totalConfirmed || 0), 0),
          totalCompleteNonConfirmed: data.reduce((sum, s) => sum + Number(s.totalCompleteNonConfirmed || 0), 0),
          totalNonAttribues: data.reduce((sum, s) => sum + Number(s.nonAttribues || 0), 0),
          totalPrimata: data.reduce((sum, s) => sum + Number(s.totalPrimata || 0), 0),
          totalDuplicata: data.reduce((sum, s) => sum + Number(s.totalDuplicata || 0), 0),
          totalRatee: data.reduce((sum, s) => sum + Number(s.totalRatee || 0), 0),
          totalFemme: data.reduce((sum, s) => sum + Number(s.totalFemme || 0), 0),
          totalHomme: data.reduce((sum, s) => sum + Number(s.totalHomme || 0), 0)
        };
      });
      setStatsYear(statsByMonth);
      setError('');
    } catch (err) {
      setError('Erreur lors du chargement des statistiques annuelles');
      setStatsYear([]);
    }
    setLoading(false);
  };

  // Récupération des statistiques annuelles pour une commune donnée
  const fetchStatsCommune = async () => {
    if (!selectedCommune) return;
    setLoading(true);
    try {
      const res = await Axios.get('http://localhost:3000/dashboard/commune/year', {
        params: { commune: selectedCommune, year: selectedYear }
      });
      const data = res.data?.data || res.data;
      if (!Array.isArray(data)) throw new Error('Format incorrect.');
      setStatsCommune(data);
      setError('');
    } catch (err) {
      setError('Erreur lors du chargement des statistiques pour la commune');
      setStatsCommune([]);
    }
    setLoading(false);
  };

  // Récupération de la liste des communes disponibles
  const fetchCommunes = async () => {
    try {
      const res = await Axios.get('http://localhost:3000/dashboard/communes');
      const data = res.data?.data || res.data;
      if (Array.isArray(data) && data.length > 0) {
        setCommunes(data);
        setSelectedCommune(data[0]); // sélection par défaut
      }
    } catch (err) {
      console.error('Erreur lors du chargement des communes', err);
    }
  };

  // Lancer le chargement en fonction du mode de vue
  useEffect(() => {
    if (viewMode === 'month') {
      fetchStatsMonth();
    } else if (viewMode === 'year') {
      fetchStatsYear();
    } else if (viewMode === 'commune') {
      fetchStatsCommune();
    }
  }, [selectedYear, selectedMonth, viewMode, selectedCommune]);

  // Chargement initial de la liste des communes
  useEffect(() => {
    fetchCommunes();
  }, []);

  // Calcul des totaux mensuels pour la vue mensuelle
  const totalMonth = {
    totalCIN: statsMonth.reduce((sum, s) => sum + Number(s.totalCIN || 0), 0),
    totalConfirmed: statsMonth.reduce((sum, s) => sum + Number(s.totalConfirmed || 0), 0),
    totalCompleteNonConfirmed: statsMonth.reduce((sum, s) => sum + Number(s.totalCompleteNonConfirmed || 0), 0),
    totalNonAttribues: statsMonth.reduce((sum, s) => sum + Number(s.nonAttribues || 0), 0),
    totalPrimata: statsMonth.reduce((sum, s) => sum + Number(s.totalPrimata || 0), 0),
    totalDuplicata: statsMonth.reduce((sum, s) => sum + Number(s.totalDuplicata || 0), 0),
    totalRatee: statsMonth.reduce((sum, s) => sum + Number(s.totalRatee || 0), 0),
    totalFemme: statsMonth.reduce((sum, s) => sum + Number(s.totalFemme || 0), 0),
    totalHomme: statsMonth.reduce((sum, s) => sum + Number(s.totalHomme || 0), 0)
  };

  const handleExpandClick = (index) => {
    setExpandedCards(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };
  // Préparation des données pour le graphique dynamique dans la vue mensuelle :
  // Ici, nous affichons un bar chart regroupant le "totalCIN" par commune
  const chartLabels = statsMonth.map(stat => stat.commune);
  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Total CIN',
        data: statsMonth.map(stat => Number(stat.totalCIN) || 0),
        backgroundColor: 'rgba(75,192,192)',
        borderColor: 'rgba(75,192,192)',
        borderWidth: 1
      }
    ]
  };

  // Définir une position moyenne pour la carte (si les données contiennent latitude/longitude)
  // Ici, on prend la première donnée disponible, sinon position par défaut sur Paris
  const defaultPosition = [48.8566, 2.3522];
  const mapPosition = statsMonth.length > 0 && statsMonth[0].latitude && statsMonth[0].longitude
    ? [statsMonth[0].latitude, statsMonth[0].longitude]
    : defaultPosition;

  return (
    <Box
      sx={{
        p: 6,
        width: '1450px',
        marginLeft: '-150px',
        background: 'rgba(0, 255, 242, 0.945)',
        borderRadius: '8px',
        marginBottom: '18px',
        boxShadow: '0px 0px 20px rgba(74, 74, 74, 0.55)'
      }}
    >
      <Typography variant="h4" gutterBottom>
        <DashboardIcon style={{ verticalAlign: 'middle', marginRight: 8 }} />
        Tableau de Bord
      </Typography>
      {/* Sélecteurs de mode d'affichage */}
      <Box className="no-print" sx={{ mb: 3, textAlign: 'right', display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
        <Button variant="contained" color="secondary" onClick={handleBackup} startIcon={<DownloadIcon />}>
          Sauvegarder
        </Button>
        <Button variant={viewMode === 'month' ? "contained" : "outlined"} onClick={() => setViewMode('month')} startIcon={<CalendarViewMonthIcon />}>
          Vue Mensuelle
        </Button>

        <Button variant={viewMode === 'commune' ? "contained" : "outlined"} onClick={() => setViewMode('commune')} startIcon={<CalendarTodayIcon />}>
          Vue Annuelle par Commune
        </Button>

        <Button variant={viewMode === 'year' ? "contained" : "outlined"} onClick={() => setViewMode('year')} startIcon={<DateRangeIcon />}>
          Vue Annuelle Globale
        </Button>
      </Box>

      {/* Sélecteurs Année, Mois (pour mensuelle) et Commune (pour vue par commune) */}
      <Box className="no-print" sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        {viewMode === 'month' && (
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Mois</InputLabel>
            <Select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
              {months.map(m => (
                <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Année</InputLabel>
          <Select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
            {years.map(y => (
              <MenuItem key={y} value={y}>{y}</MenuItem>
            ))}
          </Select>
        </FormControl>
        {viewMode === 'commune' && (
          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel>Commune</InputLabel>
            <Select value={selectedCommune} onChange={(e) => setSelectedCommune(e.target.value)} >

              {communes.map((commune, idx) => (
                <MenuItem key={idx} value={commune}>
                  <LocationCityIcon style={{ verticalAlign: 'middle', marginRight: 8 }} />

                  {commune}</MenuItem>

              ))}

            </Select>
          </FormControl>
        )}
      </Box>

      {error && <Typography color="error">{error}</Typography>}

      {/* Bouton d'impression */}
      <Box className="no-print" sx={{ mb: 3, textAlign: 'right' }}>
        <Button variant="contained" color="primary" onClick={handlePrint} startIcon={<PrintIcon />}>
          Imprimer le tableau
        </Button>
      </Box>

      {/* Rendu en fonction du mode */}
      {viewMode === 'month' ? (
        // Vue mensuelle : Container à deux colonnes
        <Grid container spacing={2}>
          {/* Colonne de gauche : Totaux globaux et zone imprimable */}
          <Grid item xs={12} md={11}>
            <Box sx={{ textAlign: 'center', my: 3, display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
              <AnimatedNumberDisplay label="Total CIN" value={loading ? 0 : totalMonth.totalCIN} delay={0.4} />
              <AnimatedNumberDisplay label="Sorties" value={loading ? 0 : totalMonth.totalConfirmed} delay={0.4} />
              <AnimatedNumberDisplay label="Restées" value={loading ? 0 : totalMonth.totalCompleteNonConfirmed} delay={0.4} />
              <AnimatedNumberDisplay label="Non Attribués" value={loading ? 0 : totalMonth.totalNonAttribues} delay={0.6} />
              <AnimatedNumberDisplay label="Primata" value={loading ? 0 : totalMonth.totalPrimata} delay={0.8} />
              <AnimatedNumberDisplay label="Duplicata" value={loading ? 0 : totalMonth.totalDuplicata} delay={1} />
              <AnimatedNumberDisplay label="Ratées" value={loading ? 0 : totalMonth.totalRatee} delay={1.2} />
              <AnimatedNumberDisplay label="Femme" value={loading ? 0 : totalMonth.totalFemme} delay={1.3} />
              <AnimatedNumberDisplay label="Homme" value={loading ? 0 : totalMonth.totalHomme} delay={1.4} />
            </Box>
            <div className="printable">
              <PrintableDashboard
                ref={printRef}
                statsMonth={statsMonth}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                totalMonth={totalMonth}
              />
            </div>
            {/* Dialog de chargement avec barre de progression */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth sx={{ backdropFilter: 'blur(6px)', background: 'linear-gradient(to left,rgba(3, 12, 107, 0.63), rgba(3, 112, 3, 0.51))' }}>
              <DialogTitle>En cours de sauvegarde...</DialogTitle>
              <DialogContent>
                <LinearProgress variant="determinate" value={backupProgress} sx={{ height: '40px', background: 'linear-gradient(45deg, #ff8a00, #e52e71)' }} />
                <Typography variant="body2" align="center" sx={{ mt: 1, color: '#000' }}>
                  {backupProgress}%
                </Typography>
              </DialogContent>
            </Dialog>

            {/* Affichage du message de succès ou d'erreur */}
            {successMessage && (
              <Dialog open={Boolean(successMessage)} onClose={() => setSuccessMessage('')} sx={{ backdropFilter: 'blur(2px)' }} >
                <DialogTitle>Backup</DialogTitle>
                <DialogContent>
                  <Typography sx={{ mt: 1, color: '#000' }}>{successMessage}</Typography>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setSuccessMessage('')} color="primary">
                    OK
                  </Button>
                </DialogActions>
              </Dialog>
            )}


          </Grid>

          {/* Colonne de droite : Cartes par commune réduites */}
          <Grid item xs={12} md={1} >
            {statsMonth.length > 0 ? (
              statsMonth.map((stat, index) => (
                <Card
                  key={index}
                  sx={{
                    mb: 2,
                    p: 1,
                    background: 'linear-gradient(to left, rgb(3,112,103), rgb(3,151,107))',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': { transform: 'scale(1.02)' }
                  }}
                >
                  <CardHeader
                    title={`${stat.commune} - ${stat.month}/${stat.year}`}
                    sx={{
                      p: 1,
                      background: 'linear-gradient(to left, rgb(3,112,3), rgb(3,11,107))',
                      color: 'white'
                    }}
                    action={
                      <Button onClick={() => handleExpandClick(index)} aria-label="afficher/cacher">
                        <ExpandMoreIcon style={{ transform: expandedCards[index] ? 'rotate(180deg)' : 'rotate(0deg)' }} />
                      </Button>
                    }
                  />
                  <Collapse in={expandedCards[index]} timeout="auto" unmountOnExit>
                    <CardContent sx={{ p: 1 }}>
                      <Typography variant="body1">
                        Total CIN : <AnimatedNumberDisplay label="" value={Number(stat.totalCIN) || 0} delay={0.2} />
                      </Typography>
                      <Typography variant="body1">
                        Sorties: <AnimatedNumberDisplay label="" value={Number(stat.totalConfirmed) || 0} delay={0.2} />
                      </Typography>
                      <Typography variant="body1">
                        Restées: <AnimatedNumberDisplay label="" value={Number(stat.totalCompleteNonConfirmed) || 0} delay={0.2} />
                      </Typography>
                      <Typography variant="body1">
                        Non attribués : <AnimatedNumberDisplay label="" value={Number(stat.nonAttribues) || 0} delay={0.4} />
                      </Typography>
                      <Typography variant="body1">
                        Primata : <AnimatedNumberDisplay label="" value={Number(stat.totalPrimata) || 0} delay={0.6} />
                      </Typography>
                      <Typography variant="body1">
                        Duplicata : <AnimatedNumberDisplay label="" value={Number(stat.totalDuplicata) || 0} delay={0.8} />
                      </Typography>
                      <Typography variant="body1">
                        Ratée : <AnimatedNumberDisplay label="" value={Number(stat.totalRatee) || 0} delay={1} />
                      </Typography>
                      <Typography variant="body1">
                        Femme : <AnimatedNumberDisplay label="" value={Number(stat.totalFemme) || 0} delay={1.2} />
                      </Typography>
                      <Typography variant="body1">
                        Homme : <AnimatedNumberDisplay label="" value={Number(stat.totalHomme) || 0} delay={1.4} />
                      </Typography>
                    </CardContent>
                  </Collapse>
                </Card>
              ))
            ) : (
              <Typography variant="body1" sx={{ p: 2 }}>
                Aucune donnée disponible pour ce mois et cette année.
              </Typography>
            )}
          </Grid>
        </Grid>
      ) : viewMode === 'year' ? (
        // Vue annuelle globale : affichage du tableau récapitulatif
        <div className="printable">
          <PrintableYearDashboard ref={printRef} statsYear={statsYear} selectedYear={selectedYear} />
        </div>
      ) : (
        // Vue annuelle par commune
        <div>
          {statsCommune && statsCommune.length > 0 ? (
            <div className="printable">
              <PrintableCommuneDashboard ref={printRef} statsCommune={statsCommune} selectedCommune={selectedCommune} selectedYear={selectedYear} />
            </div>
          ) : (
            <Typography variant="body1" sx={{ p: 2 }}>
              Aucune donnée disponible pour la commune {selectedCommune} en {selectedYear}.
            </Typography>
          )}
        </div>
      )}
      {/* Section complémentaire : Graphique dynamique et carte interactive */}
      <Box sx={{ mt: 4, width: '100%' }} fullWidth maxWidth="lg">
        <Typography variant="h5" gutterBottom>
          Visualisation Dynamique des Indicateurs
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Typography variant="subtitle1" gutterBottom>
              Diagramme - Total CIN par Commune
            </Typography>
            <Bar data={chartData} options={{
              responsive: true,
              plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Total CIN' }
              }
            }} />
          </Grid>
          {/* <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom>
                    Carte Interactive des Communes
                  </Typography>
                  <MapContainer center={mapPosition} zoom={10} style={{ height: '300px', width: '100%' }}>
                    <TileLayer
                      attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {statsMonth.map((stat, index) => (
                      stat.latitude && stat.longitude && (
                        <Marker key={index} position={[stat.latitude, stat.longitude]}>
                          <Popup>
                            <strong>{stat.commune}</strong><br />
                            Total CIN: {stat.totalCIN}
                          </Popup>
                        </Marker>
                      )
                    ))}
                  </MapContainer>
                </Grid> */}
        </Grid>
      </Box>
    </Box>
  );


};


export default TableauDeBord;
