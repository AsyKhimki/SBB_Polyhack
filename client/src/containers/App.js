import logo from './logo.svg';
import './App.css';
import {Map} from '../components/Map/MapboxMap';
import {Titlebar} from '../components/Titlebar/Titlebar';
import {Infobar} from '../components/Infobar/Infobar';
import {Searchbar} from '../components/Searchbar/Searchbar';
import {Navbar} from '../components/Navbar/Navbar';
import {MyForm} from '../components/Form/Form';
import React, { useState } from 'react';
import { Container, Row, Col } from 'react-grid-system'
import ReactDOM from "react-dom";
//import { Leaflet, Icon } from "leaflet";
//import 'leaflet/dist/leaflet.css';


const App = () => {

  const [origin, setOrigin] = useState([47.372406, 8.537606 ]);
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lines, setLines] = useState([]);
  const [ops, setOps] = useState([]); // raw data from backend - to be removed later
  const [site, setSite] = useState("1");
  const [siteInfo, setSiteInfo] = useState({'lat': 47.372406, 'long': 8.537606});
  const [activeLine, setActiveLine] = useState(undefined);

// for now we're fetching the same data twice - the idea is to fetch markers 
// from one route and the lines from another

{/*
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
*/}
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
    const test = markers.filter(marker => marker.name === site);
    console.log("Test filter")
    console.log(test)
  }
  

  return ( 
    <div>
      {loading ? <div>Loading</div> : 
    
    <div>
    <Titlebar text={"Find the Bootleneck"}/> 
    <Container>
    <Row>
      
       <Col className="left-container"
        xs={2}
        style={{backgroundColor:'#2F4989'}}>
        </Col>

        <Col className="map-container" xs={7.8} style={{backgroundColor:"#e62b19"}}>
        <Searchbar fetchMarkers={fetchData} style={{color: "black"}}/>
        <Map markers={markers} lines={lines} origin={origin} setSite={setSite} setSiteInfo={setSiteInfo} setActiveLine={setActiveLine} activeLine={activeLine} style={{width: "100%"}}/>
        </Col>

        <Col xs={2} style={{backgroundColor:'#2F4989'}}>
          <div className="info-container" style={{backgroundColor:'#2F4989', width: "18rem", height:"400pt", border:"none"}}>
              <Infobar num={site} site_info={siteInfo}  />
              <Infobar num={site} site_info={siteInfo} />
              {/*<Infobar num={3, "18rem"}/>
              <Infobar num={4, "18rem"}/>
              <Infobar num={5, "18rem"}/>
              <Infobar num={6, "18rem"}/>*/}
          </div>
        </Col>
      </Row>
      
      </Container>

    </div>
    }
    </div>
   );
}
 
export default App;
