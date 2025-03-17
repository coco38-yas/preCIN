import React from "react";
import { Outlet } from "react-router-dom";

import React from 'react'

const Layout = () => {
  return (
    <div style ={{padding: "10px"}}>
        <div style={{
          width: "100%",
          padding: "1rem",
          border: "1px solid #ccc"
        }}> <Header/> </div>
        
        <div style={{
          width: "100%",
          height: "80vh",
          marginTop: "1rem",
          border:"1px solid #ccc",
          padding: "10px"
        }}>
          <Outlet />
        </div>










    </div>
  )
}

export default Layout