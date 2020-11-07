import React, { useState } from "react";

export const Searchbar = ({ fetchMarkers }) => {
  return (
    <div>
      <nav className="navbar navbar-dark m-2" style={{border:"10pt"}}>
        <form className="form-inline my-2 my-lg-0" style={{color: "black"}}>
          <input
            className="form-control mr-sm-2"
            type="search"
            placeholder="Search places..."
            aria-label="Search"
          />
          <button
            className="btn btn-outline-info my-sm-0"
            style={{color: "black"}}
            type="submit"
            onClick={fetchMarkers}
          >
            Fetch data
          </button>
          <input
            className="form-check-input m-2"
            type="checkbox"
            value=""
            id="defaultCheck1"
          />
          <label className="form-check-label" for="defaultCheck1" style={{color: "black"}}>
            Show lines
          </label>
          <input
            className="form-check-input m-2"
            type="checkbox"
            value=""
            id="defaultCheck1"
          />
          <label className="form-check-label" for="defaultCheck1">
            Show construction sites
          </label>
        </form>
      </nav>
    </div>
  );
};
