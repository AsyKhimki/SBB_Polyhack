import React, { Component } from "react";

export const Infobar = ({ num }) => {
  return (
    <div>
      <div class="card m-4">
        <div class="card-body">
          <h5 class="card-title">Bottleneck {num}</h5>
          <h6 class="card-subtitle mb-2 text-muted">Construction site</h6>
          <p class="card-text">Some info about the bottleneck</p>
        </div>
      </div>
    </div>
  );
};
