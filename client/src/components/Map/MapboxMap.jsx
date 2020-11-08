//import "./MapboxMap.css";
import React, { useState } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  Circle,
} from "react-leaflet";
import { opacityById, weightById, colorById } from "./stylize_elements.js";
import { MapLine, MapActiveLine } from "./Line";
import { act } from "react-dom/test-utils";


export const Map = ({
  markers,
  lines,
  origin,
  setSite,
  setSiteInfo,
  setActiveLine,
  activeLine,
  construct,
}) => {
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
    },
  ];

  const test_city = {
    id: "GE",
    lat: "46.236360",
    lon: "6.139854",
    full_name: "Geneva",
    status: "Lockdown",
    details: "What a pity",
  };

  const handleClick = (event) => {
    const { lat, lng } = event.latlng;
    console.log(`Clicked at ${lat}, ${lng}`);
  };

  return (
    <div>
      <MapContainer
        center={origin}
        zoom={7}
        scrollWheelZoom={true}
        click={handleClick}
      >
        <TileLayer
          attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
          url="https://api.mapbox.com/styles/v1/beta-sheet/ckh6dba8002u21aob78yl7tep/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYmV0YS1zaGVldCIsImEiOiJja2g2ZG5hN3QwYzlyMnJxY3hrYmtybHZqIn0.SEa-JVt3EsXaPGgx-4mnYA"
        />

          <div>
          {markers.map((marker) => {

            return(
              <Circle
                center={{ lat: marker.lat, lng: marker.long }}
                fillColor="green"
                radius={1000}

                eventHandlers={{
                  click: (  ) => {
                    // console.log("Circle Has been clicked")
                    console.log("Print lines")
                    console.log(lines)
                    console.log("Print construction sites")
                    console.log(construct)
                    setSite(marker.name)
                    const test = markers.filter(x => x.name === marker.name);
                    setSiteInfo(test[0])
                  },
                }}
                />
            );
          })}

        </div>

        <div>
          {construct.map((cnst) => {

            console.log("Construction latitude");
            console.log(cnst.ops[0].lat);
            console.log(cnst)

            return (
              <Polyline
                
                positions={[
                  [cnst.ops[0].lat, cnst.ops[0].long],
                  [cnst.ops[1].lat, cnst.ops[1].long],
                ]}
                color={"red"}
                stroke={true}
                opacity={0.25}
                bubblingMouseEvents={false}
                weight={10}
              />
            );

            
          })}

        </div>


        <Marker position={[47.372406, 8.537606]}>
          <Popup>
            Welcome to Zurich. <br /> Easily customizable.
          </Popup>
        </Marker>

        {/* TRY out polylines 
        see properties
        https://leafletjs.com/reference-1.7.1.html#path
        */}

        <MapLine
          lines={lines}
          activeLine={activeLine}
          setActiveLine={setActiveLine}
        />

        {activeLine && <MapActiveLine activeLine={activeLine} />}

        {/* Add new type of a marker
         */}

        <Marker
          eventHandlers={{
            click: () => {
              console.log("marker clicked");
            },
          }}
          key={test_city.id}
          position={{ lat: 46.23636, lng: 6.139854 }}
        >
          <Popup>
            <span>
              {test_city.full_name}
              <br />
              {test_city.status}
              <br />
              {test_city.details}
              <br />
            </span>
          </Popup>
          <Circle
            eventHandlers={{
              click: () => {
                console.log("circle clicked");
              },
            }}
            center={{ lat: 46.23636, lng: 6.139854 }}
            fillColor="red"
            radius={1000}
          />
        </Marker>
      </MapContainer>
    </div>
  );
};
