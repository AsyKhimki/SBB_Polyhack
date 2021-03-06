import logo from './logo.svg';
import './App.css';
import {Map} from '../components/Map/MapboxMap';
import {Titlebar} from '../components/Titlebar/Titlebar';
import {Infobar} from '../components/Infobar/Infobar';
import {Searchbar} from '../components/Searchbar/Searchbar';
import {Navbar} from '../components/Navbar/Navbar';
import {MyForm} from '../components/Form/Form';
import React, { useState } from 'react';
import ReactDOM from "react-dom";
//import { Leaflet, Icon } from "leaflet";
//import 'leaflet/dist/leaflet.css';


const App = () => {
  const [origin, setOrigin] = useState([47.372406, 8.537606 ]);
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ops, setOps] = useState([]); // raw data from backend - to be removed later
  const [lines, setLines] = useState([{id: 1, opFrom: {lat: 47.4352897624, long: 8.34964761959}, opTo: {lat: 47.4380613536, long: 8.33763783781}}]);

// for now we're fetching the same data twice - the idea is to fetch markers 
// from one route and the lines from another
  const fetchLines = async() => {
    try {
      const response = await fetch("/alllines");
      const data = await response.json();
      console.log("Fetching lines successful!");
      //const dataArr = data.map(el => [el.lat, el.long]);
      //console.log(dataArr);
      let dataArr = [];
      for (let lineIndex = 0; lineIndex < data.length; lineIndex++) {
        let line = {
          admin: data[lineIndex].admin,
          lnumber: data[lineIndex].lnumber,
          name: data[lineIndex].name,
          segments: []
        }
        for (let opIndex = 1; opIndex < data[lineIndex].ops.length; opIndex++) {
          let opFrom = data[lineIndex].ops[opIndex-1];
          let opTo = data[lineIndex].ops[opIndex];
          let id = line.lnumber.toString() + "_" + opIndex.toString();
          let name = line.name;
          let lnumber = line.lnumber;
          let admin = line.admin;
          //line.segments.push({name, lnumber, admin, opFrom, opTo, id});
          dataArr.push({name, lnumber, admin, opFrom, opTo, id});
        }
        //dataArr.push(line)
      }
      console.log(dataArr);
      setLines(dataArr);
      setOps(data);
    } catch (err) {
      console.log("There was a problem with backend connection");
      return;
    }
  }

  const fetchMarkers = async() => {
    try {
      const response = await fetch("/allops");
      const data = await response.json();
      console.log("Fetching markers successful!");
      console.log(data);
      setMarkers(data);
    } catch (err) {
      console.log("There was a problem with backend connection");
      return;
    }
  }

  const fetchData = async() => {
    setLoading(true);
    //await fetchMarkers();
    await fetchLines();
    setLoading(false)
  }

  return ( 
    <div>
      {loading ? <div>Loading</div> : 
    <div>
    <Titlebar />
    <Navbar />
    <table width="100%">
    <tbody>
      <tr>
        <td className="left-container"
        style={{backgroundColor:'#2F4989'}}>
        <MyForm />
        </td>
        <td className="map-container">
        <Searchbar fetchMarkers={fetchData}/>
        <Map markers={markers} lines={lines} origin={origin}/>
        </td>
        <td>
          <div className="info-container" style={{backgroundColor:'#2F4989', width: "18rem"}}>
              <Infobar num={1, "18rem"}/>
              <Infobar num={2, "18rem"}/>
              <Infobar num={3, "18rem"}/>
              <Infobar num={4, "18rem"}/>
              <Infobar num={5, "18rem"}/>
              <Infobar num={6, "18rem"}/>
        </div>
        </td>
      </tr>     
      </tbody>
      </table> 
    </div>
    }
    </div>
   );
}
 
export default App;
