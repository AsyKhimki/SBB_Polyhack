import React, { useState } from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const Searchbar = ({ fetchMarkers, startDate, setStartDate, numcnst, }) => {
  return (
    <div>

      <nav className="navbar navbar-dark m-2" style={{border:"5pt"}}>

      <button
          className="btn btn-outline-info my-sm-0"
          style={{color: "#e62b19", backgroundColor:'#2F4989'}}
          type="submit"
          backgroundColor='#2F4989'
          onClick={fetchMarkers}
          >
            Let's go!
      </button>

      {/*<form className="form-inline my-2 my-lg-0" style={{color: "black"}}> */}
          {/*
          <input
            className="form-control mr-sm-2"
            type="search"
            placeholder="Search places..."
            aria-label="Search"
          /> */}

          <div>
              <DatePicker 
              selected={startDate}
              placeholderText="Select date"
              onChange={date => setStartDate(date)
              }/>
          </div>

          {/*<input
            className="form-check-input m-2"
            type="checkbox"
            value=""
            id="defaultCheck1"
          />*/}
          {/*
          <label className="form-check-label" for="defaultCheck1" style={{color: "black"}}>
            Show lines
          </label>
          <input
            className="form-check-input m-2"
            type="checkbox"
            value=""
            id="defaultCheck1"
          />*/}
          <label className="form-check-label" for="defaultCheck1">
            Number of construction sites {numcnst}
          </label>
        
      </nav>
    </div>
  );
};
