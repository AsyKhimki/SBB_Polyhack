import React, { useState } from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const Searchbar = ({
  fetchMarkers,
  startDate,
  setStartDate,
  numcnst,
  showpo,
  setShowpo,
  showstat,
  setShowstat,
}) => {
  const handleInputChange = (event) => {
    const target = event.target;
    setShowpo(target.checked);
  };

  const handleStatChange = (event) => {
    const target = event.target;
    console.log("Statistics");
    console.log(target.checked);
    setShowstat(target.checked);
  };

  return (
    <div>
      <nav className="navbar navbar-dark m-2" style={{ border: "5pt" }}>
        <button
          className="btn btn-outline-info my-sm-0"
          style={{ color: "#e62b19", backgroundColor: "#EB0000" }}
          type="submit"
          backgroundColor="#2F4989"
          onClick={fetchMarkers}
        >
          <font color="white">
            <b>Let's go!</b>
          </font>
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
            onChange={(date) => setStartDate(date)}
          />
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
          <font color="white">
            Number of construction at the current date: <b>{numcnst}</b>
          </font>
        </label>
      </nav>

      <nav className="navbar navbar-dark m-2">
        <label
          className="form-check-label"
          for="defaultCheck1"
          style={{ color: "black" }}
        >
          <font color="white">Show operation points</font>
          <input
            className="form-check-input m-2"
            type="checkbox"
            value={showpo}
            onChange={handleInputChange}
            id="defaultCheck1"
          />
        </label>
      </nav>
    </div>
  );
};
