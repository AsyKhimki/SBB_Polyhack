import React, { Component } from "react";
import sbb_train from './sbb_train.jpg'

export const Infobar = ({ num, site_info } ) => {

  console.log("Infobar");

  return (
    <div >
      <div className="card m-4" style={{width: "15rem"}}>
       <img class="card-img-top" src={sbb_train} alt="Card image cap"/>
        <div className="card-body">
          <h5 className="card-title">Construction site # {site_info.name}</h5>

          
          <table style={{width:"13rem"}}>
            <tr>
              <td>Latitude:</td>
              <td>{site_info.lat.toFixed(3)}</td>
            </tr>

            <tr>
              <td>Longitude:</td>
              <td>{site_info.long.toFixed(3)}</td>
            </tr>
          </table>
          
        </div>
      </div>
    </div>
  );
};
