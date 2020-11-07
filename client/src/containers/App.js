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
  const [lines, setLines] = useState([]);

// for now we're fetching the same data twice - the idea is to fetch markers 
// from one route and the lines from another
  const fetchLines = async() => {
    try {
      const response = await fetch("/allops");
      const data = await response.json();
      console.log("Fetching lines successful!");
      const dataArr = data.map(el => [el.lat, el.long]);
      console.log(dataArr);
      setLines(dataArr);
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
          <div className="info-container">
        <Infobar num={1}/>
        <Infobar num={2}/>
        <Infobar num={3}/>
        <Infobar num={4}/>
        <Infobar num={5}/>
        <Infobar num={6}/>
        </div>
        </td>
      </tr>     
      </table> 
    </div>
    }
    </div>
   );
}
 
export default App;
