import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';

import { CommuneProvider } from './Components/context/CommuneContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CommuneProvider>
      <App />
    </CommuneProvider>
  </React.StrictMode>
);
