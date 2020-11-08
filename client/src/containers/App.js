import logo from './logo.svg';
import './App.css';
import {Map} from '../components/Map/MapboxMap';
import {Titlebar} from '../components/Titlebar/Titlebar';
import {Infobar} from '../components/Infobar/Infobar';
import {Infobars} from '../components/Infobar/Infobars';
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
  const [construct, setConstruct] = useState([]);
  const [numcnst, setNumcnst] = useState(0);
  const [ops, setOps] = useState([]); // raw data from backend - to be removed later
  const [site, setSite] = useState("1");
  const [startDate, setStartDate] = useState(new Date());
  const [siteInfo, setSiteInfo] = useState({date_from: "2017-06-30", date_to: "2027-12-30", cap_red: "0.25", type:"none"});
  const [activeLine, setActiveLine] = useState(undefined);

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

  const fetchConstruction = async() => {
    try {
      const response = await fetch("/allconstrs");
      const data = await response.json();
      console.log("Fetching construction sites successful!");
      console.log(data);
      setConstruct(data);
    } catch (err) {
      console.log("There was a problem with backend connection");
      return;
    }
  };

  const fetchData = async() => {
    setLoading(true);
    await fetchMarkers();
    await fetchLines();
    await fetchConstruction();
    setLoading(false)

  }
  
  

  return ( 
    <div>
      {loading ? <div>Loading</div> : 
    
    <div>
    <Titlebar text={"Intelligent\nrestriction detection"}/> 
    <Container>
    <Row>
      
       {/*<Col className="left-container"
        xs={2}
        style={{backgroundColor:'#2F4989'}}>
      </Col>*/}

        <Col className="map-container" xs={7.8} style={{backgroundColor:"#e62b19"}}>
        <Searchbar fetchMarkers={fetchData} startDate={startDate} setStartDate={setStartDate} numcnst={numcnst} style={{color: "black"}}/>
        <Map markers={markers} lines={lines} origin={origin} setSite={setSite}  setSiteInfo={setSiteInfo} setActiveLine={setActiveLine} activeLine={activeLine} construct={construct} startDate={startDate} setNumcnst={setNumcnst} style={{width: "100%"}}/>
        </Col>

        <Col xs={3.2} style={{backgroundColor:'#2F4989'}}>
          
          <div className="info-container" style={{backgroundColor:'#2F4989', width: "18rem", height:"400pt", border:"none"}}>
          <h2>Current construction sites</h2>
              
             
              <Infobars construct={construct} startDate={startDate}/>
              {/*<Infobar num={3, "18rem"}/>
              <Infobar site_info={siteInfo}  />
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
