// frontend/src/context/CommuneContext.js
import React, { createContext, useState } from 'react';

export const CommuneContext = createContext();

export const CommuneProvider = ({ children }) => {
  const [selectedCommune, setSelectedCommune] = useState('Vohipeno');

  return (
    <CommuneContext.Provider value={{ selectedCommune, setSelectedCommune }}>
      {children}
    </CommuneContext.Provider>
  );
};
