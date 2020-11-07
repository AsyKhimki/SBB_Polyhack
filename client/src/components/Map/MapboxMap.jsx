import "./MapboxMap.css";
import React, { useState } from "react";
import { MapContainer, Marker, Polyline, Popup, TileLayer, Circle } from "react-leaflet";
import { opacityById, weightById, colorById } from './stylize_elements.js'

{/*var greenIcon = icon({
  iconUrl: 'test_icon.png',

  iconSize:     [38, 95], // size of the icon
  shadowSize:   [50, 64], // size of the shadow
  iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
  shadowAnchor: [4, 62],  // the same for the shadow
  popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});*/}


/*
const colorById = (id) => {
  console.log("Line id");
  console.log(id);
  var res = parseInt(id) === 1 ? "red" : "blue";
  console.log(res);
  return res;
}

var highlight = {
  'fillColor': 'yellow',
  'weight': 2,
  'opacity': 1
};

const  weightById = (id) =>{

  var res = parseInt(id) === 1 ? 2 : 10;
  console.log(res);
  return res;
}

const opacityById= (id) =>{

  var res = parseInt(id) === 1 ? 0.25 : 1;
  console.log(res);
  return res;
}
*/

export const Map = ({ markers }) => {
  console.log(markers[0].lat);

  const sample_line = [
    {
      from_lat: "47.372406",
      from_long: "8.537606",
      id: "1",
      to_lat: "46.951368",
      to_long: "7.451401",
    },
    {
      from_lat: "47.372406",
      from_long: "8.537606",
      id: "2",
      to_lat: "47.539976",
      to_long: "7.579924",
    } 
  ]


  const test_city = {
    id: "GE",
    lat: "46.236360",
    lon: "6.139854",
    full_name: "Geneva",
    status: "Lockdown",
    details: "What a pity",
  };

  const handleClick = event => {
    const { lat, lng } = event.latlng
    console.log(`Clicked at ${lat}, ${lng}`)
  }
  
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
          return <Marker position={[marker.lat, marker.long]} className="my_marker">
            <Popup>
              Operation point {marker.name} <br /> Tell me more.
            </Popup>
          </Marker>
        }) } </div>

          <Marker position={[47.372406, 8.537606]}>
            <Popup>
              Welcome to Zurich. <br /> Easily customizable.
            </Popup>
          </Marker>

        {/* TRY out polylines 
        see properties
        https://leafletjs.com/reference-1.7.1.html#path
        */}

          {sample_line.map(({id, from_lat, from_long, to_lat, to_long}) => {
            return <Polyline key={id} 

              positions={[ [ from_lat, from_long], [to_lat, to_long]]} 
              color={colorById (id)}
              stroke = {true}
              opacity={opacityById(id)}
              bubblingMouseEvents={false}
              weight={weightById(id)} />

          })}

        {/* Add new type of a marker
        */}

              <Marker 
                key={test_city.id} 
                position={{lat:46.236360, lng: 6.139854}}
                onClick={handleClick}>
                <Popup>
                  <span>
                    {test_city.full_name}<br />
                    {test_city.status}<br />
                    {test_city.details}<br />
                    
                    {/*
                    {elem.vehicles_launched.map((elem, i) => {
                      return ( <p key={i}>{elem}</p>)
                    })} */}
                  </span>
                </Popup>
                <Circle 
                  center={{lat:46.236360, lng: 6.139854}}
                  fillColor="red" 
                  radius={1000}/>
              </Marker>

       

      </MapContainer>
    </div>
  );
};
