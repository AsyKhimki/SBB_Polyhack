import logo from './logo.svg';
import './App.css';
import {Map} from './MapboxMap';
import {Titlebar} from './Titlebar';
import {Infobar} from './Infobar';
import {Searchbar} from './Searchbar';
import React, { useState } from 'react';
import ReactDOM from "react-dom";
//import { Leaflet, Icon } from "leaflet";
//import 'leaflet/dist/leaflet.css';


const App = () => {
  const [markers, setMarkers] = useState([{
    lat: 51.505,
    long: -0.09
  }]);
  const [loading, setLoading] = useState(false);

  const fetchMarkers = async() => {
    try {
      const response = await fetch("/allops");
      const data = await response.json();
      console.log("Fetch successful!");
      setMarkers(data);
    } catch (err) {
      console.log("There was a problem with backend connection");
      return;
    }
  }

  const fetchData = async() => {
    setLoading(true);
    await fetchMarkers();
    setLoading(false)
  }

  return ( 
    <div>
      {loading ? <div>Loading</div> : 
    <div>
    <Titlebar />
    <table width="100%">
      <tr>
        <td className="left-container"></td>
        <td className="map-container">
        <Searchbar fetchMarkers={fetchData}/>
        <Map markers={markers}/>
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
