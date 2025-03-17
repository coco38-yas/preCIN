import React, { useEffect, useState } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import Axios from 'axios'
import ListCin from './ListCin';




const CommuneTabs = () => {

  //////////////////////////////////////////////////////////////////////////////////
  const [data, setData] = useState([])
  useEffect(() => {

    Axios.get('http://localhost:3000/')
      //.then(res  => console.log(res))
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  }, [])




  return (
    <Tabs defaultActiveKey={data[0]} id="commune-tabs" className="mb-3">

      {

        data.map((commune) => (
          <Tab eventKey={commune} title={commune.name} key={commune} >
            {/* Vous pouvez passer en props à CINList le nom de la commune pour filtrer */}
            <ListCin />
          </Tab>
        ))}
    </Tabs>
  );
};

export default CommuneTabs;