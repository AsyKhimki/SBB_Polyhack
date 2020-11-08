import React, { Component } from "react";
import sbb_train from './sbb_train.jpg'

export const Infobar = ({ site_info } ) => {

  console.log("Infobar");

  return (
    <div >
      <div className="card m-4" style={{width: "15rem"}}>
       <img class="card-img-top" src={sbb_train} alt="Card image cap"/>
        <div className="card-body">
          <h5 className="card-title">Construction site {site_info.name}</h5>

          
          <table style={{width:"13rem"}}>
            <tr>
              <td align="left">From:</td>
              <td align="right">{site_info.date_from}</td>
            </tr>

            <tr>
              <td align="left">To:</td>
              <td align="right">{site_info.date_to}</td>
            </tr>

            <tr>
              <td align="left">Capacity:</td>
              <td align="right">{site_info.cap_red}</td>
            </tr>

            <tr>
              <td align="left">Type:</td>
              <td align="right">{site_info.type}</td>
            </tr>

          </table>
          
        </div>
      </div>
    </div>
  );
};

