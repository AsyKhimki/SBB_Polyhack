import React, { Component } from "react";
import sbb_train from './sbb_train.jpg'

export const Infobar = ({ num, txtwidth }) => {
  return (
    <div >
      <div className="card m-4" style={{width: "15rem"}}>
       <img class="card-img-top" src={sbb_train} alt="Card image cap"/>
        <div className="card-body">
          <h5 className="card-title">Bottleneck # {num}</h5>
          <h6 className="card-subtitle mb-2 text-muted">Construction site</h6>
          <p className="card-text">Some info about the bottleneck</p>
        </div>
      </div>
    </div>
  );
};
