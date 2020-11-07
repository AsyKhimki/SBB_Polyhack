import React, { useState } from "react";
import { MapContainer, Marker, Polyline, Popup, TileLayer } from "react-leaflet";


{/*var greenIcon = icon({
  iconUrl: 'test_icon.png',

  iconSize:     [38, 95], // size of the icon
  shadowSize:   [50, 64], // size of the shadow
  iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
  shadowAnchor: [4, 62],  // the same for the shadow
  popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});*/}

export const Map = ({ markers }) => {
  console.log(markers[0].lat);

  const sample_line = [
    {
      from_lat: "47.372406",
      from_long: "8.537606",
      id: "132512",
      to_lat: "46.951368",
      to_long: "7.451401",
    },
    {
      from_lat: "47.372406",
      from_long: "8.537606",
      id: "132513",
      to_lat: "47.539976",
      to_long: "7.579924",
    } 
  ]

  return (
    <div>
      <MapContainer
        center={[markers[0].lat, markers[0].long]}
        zoom={7}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
          url="https://api.mapbox.com/styles/v1/beta-sheet/ckh6dba8002u21aob78yl7tep/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYmV0YS1zaGVldCIsImEiOiJja2g2ZG5hN3QwYzlyMnJxY3hrYmtybHZqIn0.SEa-JVt3EsXaPGgx-4mnYA"
        />
        <div> {markers.map(marker => {
          console.log("printing")
          return <Marker position={[marker.lat, marker.long]}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
        }) } </div>

          <Marker position={[47.372406, 8.537606]}>
            <Popup>
              Welcome to Zurich. <br /> Easily customizable.
            </Popup>
          </Marker>

        {/* TRY out polylines */}
          {sample_line.map(({id, from_lat, from_long, to_lat, to_long}) => {
        return <Polyline key={id} positions={[
          [from_lat, from_long], [to_lat, to_long],
        ]} color={'red'} />
       })}

      </MapContainer>
    </div>
  );
};
