import React, { useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

export const Map = ({ markers }) => {
  console.log(markers[0].lat);

  return (
    <div>
      <MapContainer
        center={[markers[0].lat, markers[0].long]}
        zoom={13}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
          url="https://api.mapbox.com/styles/v1/beta-sheet/ckh6dba8002u21aob78yl7tep/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYmV0YS1zaGVldCIsImEiOiJja2g2ZG5hN3QwYzlyMnJxY3hrYmtybHZqIn0.SEa-JVt3EsXaPGgx-4mnYA"
        />
        <Marker position={[markers[0].lat, markers[0].long]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};
