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

          
          <table style={{width:"14rem"}}>
            <tr>
              <td>From:</td>
              <td>{site_info.date_from}</td>
            </tr>

            <tr>
              <td>To:</td>
              <td>{site_info.date_to}</td>
            </tr>

            <tr>
              <td>Capacity:</td>
              <td>{site_info.cap_red}</td>
            </tr>

            <tr>
              <td>Type:</td>
              <td>{site_info.type}</td>
            </tr>

          </table>
          
        </div>
      </div>
    </div>
  );
};

