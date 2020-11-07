import React, { useState } from "react";

export const Searchbar = ({ fetchMarkers }) => {
  return (
    <div>
      <nav className="navbar navbar-light m-2">
        <form className="form-inline my-2 my-lg-0">
          <input
            className="form-control mr-sm-2"
            type="search"
            placeholder="Search places..."
            aria-label="Search"
          />
          <button
            className="btn btn-outline-info my-2 my-sm-0"
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
          <label className="form-check-label" for="defaultCheck1">
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
