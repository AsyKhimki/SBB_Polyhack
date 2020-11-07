import "./Titlebar.css";
import sbb from './SBB_LOGO.jpg'
import polyhack from  './PolyHACK2020.png'
import React, { Component } from "react";
import { gridLayer } from "leaflet";
import { gracefulify } from "graceful-fs";

export const Titlebar = () => {

  const mystyle = {
    backgroundColor: "Blue",
    padding: "20px",
    fontFamily: "Arial"
  };

  return (
    <div>
      <nav className="navbar navbar-light bg-light titlebar" style={mystyle}>
       <img src={sbb} alt="House image" height={100} width={400} />
        <span className="navbar-brand mb-0 h1">Bottleneck!</span>
        <img src={polyhack} alt="House image" height={100} width={400} />
      </nav>
      
    </div>
  );
};
