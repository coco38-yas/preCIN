import React from 'react';
import ExpandableTable from './ExpandableTable';
import AboutProject from './templates/AboutProject';

const Apropos = () => {
  return (
    <>
       <AboutProject/>
      <h1>À Propos</h1>
      <ExpandableTable />
    </>
  );
};

export default Apropos;
