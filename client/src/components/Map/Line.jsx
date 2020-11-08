import React, { useState } from "react";
import { Polyline, Circle } from "react-leaflet";

export const MapLine = ({ lines, setActiveLine, activeLine }) => {
  return (
    <div>
      {lines.map(({ id, opFrom, opTo, lnumber }) => {
        return (
          <Polyline
            key={id}
            positions={[
              [opFrom.lat, opFrom.long],
              [opTo.lat, opTo.long],
            ]}
            color={"blue"}
            stroke={true}
            opacity={0.5}
            bubblingMouseEvents={false}
            weight={5}
            eventHandlers={{
              click: () => {
                console.log("line clicked");
                const activeLine = lines.filter((l) => l.lnumber === lnumber);
                setActiveLine(activeLine);
              },
            }}
          />
        );
      })}
    </div>
  );
};

export const MapActiveLine = ({ activeLine }) => {
  return (
    <div>
      {activeLine.map(({ id, opFrom, opTo }) => {
        return (
          <Polyline
            key={id}
            positions={[
              [opFrom.lat, opFrom.long],
              [opTo.lat, opTo.long],
            ]}
            color={"red"}
            stroke={true}
            opacity={1}
            bubblingMouseEvents={false}
            weight={10}
          />
        );
      })}
    </div>
  );
};

export const MapConstrLine = ({ construct }) => {
  return (
    <div>
      {construct.map(({ operatingLines }) =>
        operatingLines.map(({ segment }) =>
          segment.map((seg) => {
            return (
              <Polyline
                positions={[
                  [seg.opFrom.lat, seg.opFrom.long],
                  [seg.opTo.lat, seg.opTo.long],
                ]}
                color={"red"}
                stroke={true}
                opacity={0.25}
                bubblingMouseEvents={false}
                weight={10}
              />
            );
          })
        )
      )}
    </div>
  );
};

export const MapConstrPoint = ({ construct }) => {
  return (
    <div>
      {construct.map(({ operatingPoints }) =>
        operatingPoints.map(({ point }) =>
          point.map((pt) => {
            return (
              <Circle
                eventHandlers={{
                  click: () => {
                    console.log("circle clicked");
                  },
                }}
                center={{ lat: pt.lat, lng: pt.long }}
                fillColor="red"
                radius={1000}
              />
            );
          })
        )
      )}
    </div>
  );
};
