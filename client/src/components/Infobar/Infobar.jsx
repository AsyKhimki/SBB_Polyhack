import React, { Component } from "react";
import sbb_train from "./sbb_train.jpg";

export const Infobar = ({ site_info }) => {
  console.log("Infobar");

  return (
    <div>
      <div className="card m-4" style={{ width: "20rem" }}>
        <img class="card-img-top" src={sbb_train} alt="Card image cap" />
        <div className="card-body">
          <h5 className="card-title">{site_info.name}</h5>

          <table style={{ width: "18rem" }}>
            <tr>
              <td align="left">
                <b>From:</b>
              </td>
              <td align="right">{site_info.date_from}</td>
            </tr>

            <tr>
              <td align="left">
                <b>To:</b>
              </td>
              <td align="right">{site_info.date_to}</td>
            </tr>

            <tr>
              <td align="left">
                <b>Capacity:</b>
              </td>
              <td align="right">{site_info.cap_red}</td>
            </tr>

            <tr>
              <td align="left">
                <b>Type:</b>
              </td>
              <td align="right">{site_info.type}</td>
            </tr>

            {site_info.operatingLines.length > 0 && (
              <tr>
                <td align="left">
                  <b>Affected lines:</b>
                </td>
                {site_info.operatingLines.map((ol) => {
                  return <td aligh="right">{ol.name}</td>;
                })}
              </tr>
            )}

            {site_info.operatingPoints.length > 0 && (
              <tr>
                <td align="left">
                  <b>Affected lines:</b>
                </td>
                {site_info.operatingPoints.map((op) => {
                  return <td align="right">{op.name}</td>;
                })}
              </tr>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};
