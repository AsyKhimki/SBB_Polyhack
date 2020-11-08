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
import {
  opacityById,
  weightById,
  colorById,
  adjustSizeByDVW,
} from "./stylize_elements.js";
import {
  MapLine,
  MapActiveLine,
  MapConstrLine,
  MapConstrPoint,
  MapProblemLine,
} from "./Line";
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
  problems,
  startDate,
  setNumcnst,
  showpo,
  stations,
  showsta,
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

  var cnt = 0;

  console.log({ showpo });

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

        {showpo ? (
          <div>
            {markers.map((marker) => {
              return (
                <Circle
                  center={{ lat: marker.lat, lng: marker.long }}
                  fillColor="green"
                  radius={1000}
                  eventHandlers={{
                    click: () => {
                      // console.log("Circle Has been clicked")
                      console.log("Print lines");
                      console.log(lines);
                      console.log("Print construction sites");
                      console.log(construct);
                      setSite(marker.name);
                      const test = markers.filter(
                        (x) => x.name === marker.name
                      );
                      setSiteInfo(test[0]);
                    },
                  }}
                />
              );
            })}
          </div>
        ) : null}

        <div>
          {stations
            .filter((st) => {
              return parseInt(st.fields.dwv) >= 200;
            })

            .map((station) => {
              // console.log(station.fields)

              var rad = adjustSizeByDVW(parseInt(station.fields.dwv));

              return (
                <Circle
                  center={{
                    lat: station.geometry.coordinates[1],
                    lng: station.geometry.coordinates[0],
                  }}
                  fillColor="grey"
                  radius={rad}
                >
                  <Popup>
                    <b>{station.fields.bahnhof_haltestelle} </b> <br />
                    <p>No. of Passengers </p>
                    <table>
                      <tr>
                        <td align="left">
                          <b>Average</b>
                        </td>

                        <td align="right">{station.fields.dtv}</td>
                      </tr>

                      <tr>
                        <td align="left">
                          <b>Weekdays</b>
                        </td>

                        <td align="right"> {station.fields.dwv}</td>
                      </tr>
                    </table>
                  </Popup>
                </Circle>
              );
            })}
        </div>

        {
          <MapConstrLine
            construct={construct.filter((obj) => {
              var date_from = new Date(obj.date_from);
              var date_to = new Date(obj.date_to);
              //console.log(date_from.getTime() > startDate.getTime() );
              var ans =
                date_from.getTime() <= startDate.getTime() &&
                date_to.getTime() >= startDate.getTime();
              cnt = ans ? cnt + 1 : cnt;
              setNumcnst(cnt);
              //console.log("number of constructions")
              //console.log(cnt);
              console.log(ans);
              return ans;
            })}
          />
        }

        {
          <MapConstrPoint
            construct={construct.filter((obj) => {
              var date_from = new Date(obj.date_from);
              var date_to = new Date(obj.date_to);
              //console.log(date_from.getTime() > startDate.getTime() );
              var ans =
                date_from.getTime() <= startDate.getTime() &&
                date_to.getTime() >= startDate.getTime();
              cnt = ans ? cnt + 1 : cnt;
              setNumcnst(cnt);
              //console.log("number of constructions")
              //console.log(cnt);
              console.log(ans);
              return ans;
            })}
          />
        }

        <MapProblemLine
          line={problems.filter((obj) => {
            var date_from = new Date(obj.date_from);
            var date_to = new Date(obj.date_to);
            //console.log(date_from.getTime() > startDate.getTime() );
            var ans =
              date_from.getTime() <= startDate.getTime() &&
              date_to.getTime() >= startDate.getTime();
            cnt = ans ? cnt + 1 : cnt;
            setNumcnst(cnt);
            //console.log("number of constructions")
            //console.log(cnt);
            console.log(ans);
            return ans;
          })}
        />

        <MapLine
          lines={lines}
          activeLine={activeLine}
          setActiveLine={setActiveLine}
        />

        {activeLine && <MapActiveLine activeLine={activeLine} />}
      </MapContainer>
    </div>
  );
};
